import { readFile, writeFile } from "node:fs/promises";
import { parseGmailClient, GMAIL_SCOPE } from "../server/gmail-oauth.ts";
import { normalizeEmail } from "../src/utils/email.ts";

// Import already-authorized credentials locally. No network calls, no secret output.
async function main() {
  const envFile = new URL("../.env.local", import.meta.url);
  let text = await readFile(envFile, "utf8");
  const client = parseGmailClient(JSON.parse(await readFile(new URL("../private-data/google-oauth-client.json", import.meta.url), "utf8")));
  const tokens = JSON.parse(await readFile(new URL("../private-data/gmail-tokens.json", import.meta.url), "utf8"));
  if (tokens.scope !== GMAIL_SCOPE || typeof tokens.refresh_token !== "string" || !tokens.refresh_token)
    throw new Error("Invalid saved authorization");
  if (!/^GUIDE_ENABLED=false\r?$/m.test(text)) throw new Error("Keep collection disabled during setup");
  const sender = normalizeEmail(process.argv[2]);
  if (!sender) throw new Error("Missing sender email");
  const values = { MAIL_PROVIDER: "gmail", GMAIL_CLIENT_ID: client.client_id,
    GMAIL_CLIENT_SECRET: client.client_secret, GMAIL_REFRESH_TOKEN: tokens.refresh_token, GUIDE_FROM_EMAIL: sender };
  for (const [key, value] of Object.entries(values)) {
    const pattern = new RegExp(`^${key}=.*$`, "gm");
    if ((text.match(pattern) || []).length > 1) throw new Error("Duplicate configuration key");
    const line = `${key}=${JSON.stringify(value)}`;
    text = pattern.test(text) ? text.replace(new RegExp(`^${key}=.*$`, "gm"), () => line) : `${text.trimEnd()}\n${line}\n`;
  }
  await writeFile(envFile, text, { mode: 0o600 });
  console.log("Gmail nastavený v soukromé konfiguraci. Formulář zůstává vypnutý; nic se neodeslalo.");
}
main().catch(() => { console.error("Nastavení Gmailu se nepodařilo. Ověřte soukromé soubory a adresu odesílatele; obsah neposílejte do chatu."); process.exitCode = 1; });
