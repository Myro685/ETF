import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { buildGuideMime, gmailAccessToken, readGmailCredentials } from "../server/gmail-delivery.ts";
import { normalizeEmail } from "../src/utils/email.ts";

// Run without --send to inspect the exact message. Send only after recipient approval.
async function main() {
  const from = normalizeEmail(process.env.GUIDE_FROM_EMAIL ?? "");
  const to = normalizeEmail(process.env.PRIVACY_CONTACT_EMAIL ?? "");
  const url = process.env.GUIDE_DOWNLOAD_URL ?? "";
  if (!from || !to || !url.startsWith("https://")) throw new Error("Missing mail configuration");
  const requestId = randomUUID();
  const mime = buildGuideMime({ from, to, replyTo: to, url, requestId });
  if (process.argv.length === 2) {
    const parts = mime.split("\r\n\r\n");
    console.log(`Příjemce: ${to}\nOdesílatel: Clientelo <${from}>\nPředmět: Váš průvodce porovnáním ETF\n`);
    console.log(Buffer.from(parts[1].replace(/\s/g, ""), "base64").toString("utf8"));
    console.log("\nNáhled: nic nebylo odesláno ani uloženo do databáze.");
    return;
  }
  if (process.argv.length !== 3 || process.argv[2] !== "--send") throw new Error("Invalid arguments");
  const credentials = readGmailCredentials(process.env);
  if (!credentials) throw new Error("Missing Gmail configuration");
  const token = await gmailAccessToken(credentials);
  const privateDir = new URL("../private-data/", import.meta.url);
  await mkdir(privateDir, { recursive: true });
  // Exclusive claim survives errors and prevents another send after an uncertain response.
  await writeFile(new URL("gmail-smoke-test-claim.json", privateDir), JSON.stringify({ requestId, startedAt: new Date().toISOString() }), { flag: "wx", mode: 0o600 });
  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ raw: Buffer.from(mime).toString("base64url") }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("Uncertain send result; do not retry");
  const result = await response.json() as { id?: string };
  if (typeof result.id !== "string" || !result.id) throw new Error("Uncertain send result; do not retry");
  await writeFile(new URL("gmail-smoke-test-result.json", privateDir), JSON.stringify({ requestId, messageId: result.id, acceptedAt: new Date().toISOString() }), { flag: "wx", mode: 0o600 });
  console.log("Gmail přijal jednu testovací zprávu. Příjem do schránky musí potvrdit uživatel. Databáze ani formulář nebyly změněny.");
}
main().catch(() => { console.error("Test se nepodařilo dokončit. Neopakujte odeslání bez kontroly Gmailu a soukromého záznamu; žádné klíče se nevypisují."); process.exitCode = 1; });
