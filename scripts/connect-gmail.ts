import { readFile, writeFile, access } from "node:fs/promises";
import { createGmailOAuthServer, googleOAuthAdapter, parseGmailClient } from "../server/gmail-oauth.ts";

const directory = new URL("../private-data/", import.meta.url);
const clientFile = new URL("google-oauth-client.json", directory);
const tokenFile = new URL("gmail-tokens.json", directory);

async function main() {
  try {
    await access(tokenFile);
    console.log("Gmail už má lokálně uložený přístup. Nepřepisuji jej. Pokračujte v chatu.");
    return;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const client = parseGmailClient(JSON.parse(await readFile(clientFile, "utf8")));
  const server = createGmailOAuthServer({
    adapter: googleOAuthAdapter(client),
    async save(tokens) {
      await writeFile(tokenFile, JSON.stringify(tokens), { flag: "wx", mode: 0o600 });
    },
    onConnected() { console.log("Gmail propojený; přístup uložený soukromě. Žádný e-mail se neodeslal."); },
  });
  const timeout = setTimeout(() => {
    console.log("Čas pro propojení vypršel. Lze znovu spustit npm run connect:gmail.");
    server.close();
    server.closeAllConnections();
  }, 15 * 60 * 1000);
  server.once("close", () => clearTimeout(timeout));
  server.once("error", () => {
    clearTimeout(timeout);
    console.error("Místní propojení nelze spustit. Ověřte, že port 5175 není obsazený.");
    process.exitCode = 1;
  });
  server.listen(5175, "127.0.0.1", () => console.log("Otevřete http://127.0.0.1:5175/ a pokračujte tlačítkem ke Googlu."));
}
main().catch(() => {
  console.error("Nelze načíst soukromý OAuth JSON. Zkontrolujte jeho umístění a návratovou adresu; obsah neposílejte do chatu.");
  process.exitCode = 1;
});
