import { OAuth2Client } from "google-auth-library";
import { normalizeEmail, isSafeLink } from "../src/utils/email.ts";

export type GmailCredentials = { clientId: string; clientSecret: string; refreshToken: string };
export function readGmailCredentials(env: Record<string, string | undefined>): GmailCredentials | null {
  if (!env.GMAIL_CLIENT_ID?.endsWith(".apps.googleusercontent.com") ||
      !env.GMAIL_CLIENT_SECRET?.trim() || !env.GMAIL_REFRESH_TOKEN?.trim()) return null;
  return { clientId: env.GMAIL_CLIENT_ID, clientSecret: env.GMAIL_CLIENT_SECRET, refreshToken: env.GMAIL_REFRESH_TOKEN };
}

// Refresh may be retried safely: it cannot send an email. Sending below has no auto-retry.
export async function gmailAccessToken(credentials: GmailCredentials): Promise<string> {
  const oauth = new OAuth2Client(credentials.clientId, credentials.clientSecret);
  oauth.setCredentials({ refresh_token: credentials.refreshToken });
  const result = await oauth.getAccessToken();
  if (!result.token) throw new Error("Gmail authorization unavailable");
  return result.token;
}

export function buildGuideMime(mail: { from: string; to: string; replyTo: string; url: string; requestId: string }): string {
  const from = normalizeEmail(mail.from), to = normalizeEmail(mail.to), replyTo = normalizeEmail(mail.replyTo);
  if (!from || !to || !replyTo || !isSafeLink(mail.url) ||
      !/^[a-f0-9-]{36}$/i.test(mail.requestId)) throw new Error("Invalid mail payload");
  const text = `Dobrý den,\n\nzde je vyžádaný Průvodce porovnáním ETF před prvním nákupem:\n${mail.url}\n\nVyžádání PDF vás nepřihlásilo k newsletteru.\nClientelo`;
  const body = Buffer.from(text).toString("base64").match(/.{1,76}/g)!.join("\r\n");
  return [
    `From: Clientelo <${from}>`, `To: ${to}`, `Reply-To: ${replyTo}`,
    `Subject: =?UTF-8?B?${Buffer.from("Váš průvodce porovnáním ETF").toString("base64")}?=`,
    `Message-ID: <guide.${mail.requestId}@${from.split("@")[1]}>`,
    "MIME-Version: 1.0", 'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64", "", body, "",
  ].join("\r\n");
}
