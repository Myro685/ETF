import { createServer } from "node:http";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { OAuth2Client, CodeChallengeMethod, type Credentials } from "google-auth-library";

export const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.send";
export const GMAIL_REDIRECT = "http://127.0.0.1:5175/oauth/callback";
const LOCAL_ORIGIN = new URL(GMAIL_REDIRECT).origin;
const SESSION_MS = 10 * 60 * 1000;

export type GmailClient = { client_id: string; client_secret: string };
export function parseGmailClient(raw: unknown): GmailClient {
  const web = (raw as { web?: Record<string, unknown> } | null)?.web;
  if (!web || typeof web.client_id !== "string" ||
    !web.client_id.endsWith(".apps.googleusercontent.com") ||
    typeof web.client_secret !== "string" || !web.client_secret ||
    !Array.isArray(web.redirect_uris) || !web.redirect_uris.includes(GMAIL_REDIRECT))
    throw new Error("Neplatný OAuth JSON nebo chybějící návratová adresa.");
  // Endpoints from the downloaded file are deliberately ignored.
  return { client_id: web.client_id, client_secret: web.client_secret };
}

type Adapter = {
  authorize: (state: string) => Promise<{ url: string; verifier: string }>;
  exchange: (code: string, verifier: string) => Promise<Credentials>;
};
export function googleOAuthAdapter(client: GmailClient): Adapter {
  const oauth = new OAuth2Client(client.client_id, client.client_secret, GMAIL_REDIRECT);
  return {
    async authorize(state) {
      const pkce = await oauth.generateCodeVerifierAsync();
      const url = oauth.generateAuthUrl({
        scope: [GMAIL_SCOPE], access_type: "offline", prompt: "consent", state,
        include_granted_scopes: false,
        code_challenge: pkce.codeChallenge, code_challenge_method: CodeChallengeMethod.S256,
      });
      return { url, verifier: pkce.codeVerifier };
    },
    async exchange(code, verifier) {
      const { tokens } = await oauth.getToken({ code, codeVerifier: verifier });
      return tokens;
    },
  };
}

function matches(value: string | null, expected: string) {
  if (!value || Buffer.byteLength(value) !== Buffer.byteLength(expected)) return false;
  return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}

// Authentication utility only. No Gmail send/read endpoint exists here.
export function createGmailOAuthServer({ adapter, save, onConnected = () => {}, now = Date.now }: {
  adapter: Adapter;
  save: (credentials: Credentials) => Promise<void>;
  onConnected?: () => void;
  now?: () => number;
}) {
  const ticket = randomBytes(32).toString("hex");
  let pending: { state: string; verifier: string; expires: number } | null = null;
  let busy = false;
  let connected = false;
  return createServer(async (request, response) => {
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("Referrer-Policy", "no-referrer");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; form-action 'self' https://accounts.google.com; frame-ancestors 'none'; base-uri 'none'");
    const end = (status: number, text: string) => {
      response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(text);
    };
    // Prevent DNS rebinding; listen() also binds exclusively to loopback.
    if (request.headers.host !== "127.0.0.1:5175") return end(403, "Nepovolená adresa.");
    let url: URL;
    try { url = new URL(request.url || "/", LOCAL_ORIGIN); }
    catch { return end(400, "Neplatný požadavek."); }
    if (url.origin !== LOCAL_ORIGIN) return end(403, "Nepovolená adresa.");
    if (url.pathname === "/" && request.method === "GET") {
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(`<!doctype html><html lang="cs"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Clientelo · Propojení Gmailu</title>
        <style>body{font:17px/1.65 system-ui,sans-serif;color:#202e27;background:#fcfdfb;max-width:620px;margin:12vh auto;padding:24px}h1{font-size:32px;line-height:1.2}button{font:inherit;background:#285a43;color:white;border:0;border-radius:8px;padding:12px 20px;cursor:pointer}button:focus-visible{outline:3px solid #285a43;outline-offset:4px}p{color:#52635a}</style>
        <h1>${connected ? "Gmail je propojený." : "Propojit odesílání přes Gmail"}</h1>
        <p>${connected ? "Přístup byl uložený na tomto počítači. Vraťte se do chatu. Žádný e-mail nebyl odeslaný." : "Přihlaste se účtem, ze kterého chcete odesílat průvodce. Clientelo požádá pouze o odesílání zpráv, bez čtení doručené pošty. Toto propojení žádný e-mail neodešle."}</p>
        ${connected ? "" : `<form action="/oauth/start?ticket=${ticket}" method="post"><button type="submit">Pokračovat ke Googlu</button></form>`}</html>`);
      return;
    }
    if (url.pathname === "/oauth/start") {
      if (request.method !== "POST") return end(405, "Použijte tlačítko na úvodní stránce.");
      if (request.headers.origin !== LOCAL_ORIGIN || !matches(url.searchParams.get("ticket"), ticket))
        return end(403, "Neplatný začátek propojení.");
      if (connected || busy) return end(409, "Propojení už probíhá nebo je dokončené.");
      busy = true;
      pending = null;
      try {
        const state = randomBytes(32).toString("hex");
        const flow = await adapter.authorize(state);
        pending = { state, verifier: flow.verifier, expires: now() + SESSION_MS };
        response.writeHead(303, { Location: flow.url });
        response.end();
      } catch { end(500, "Propojení se nepodařilo zahájit. Vraťte se na úvod a zkuste to znovu."); }
      finally { busy = false; }
      return;
    }
    if (url.pathname === "/oauth/callback") {
      if (request.method !== "GET") return end(405, "Nepovolená metoda.");
      if (!pending || now() > pending.expires || !matches(url.searchParams.get("state"), pending.state))
        return end(403, "Neplatné nebo prošlé propojení. Vraťte se na http://127.0.0.1:5175/ a začněte znovu.");
      // Consume the state before awaiting anything: duplicate callbacks cannot exchange twice.
      const flow = pending;
      pending = null;
      if (url.searchParams.has("error")) return end(400, "Propojení nebylo povoleno. Žádný e-mail se neodeslal.");
      const code = url.searchParams.get("code");
      if (!code) return end(400, "Chybí odpověď Googlu. Začněte propojení znovu.");
      busy = true;
      try {
        const tokens = await adapter.exchange(code, flow.verifier);
        const scopes = tokens.scope?.split(/\s+/).filter(Boolean) || [];
        if (!tokens.refresh_token || scopes.length !== 1 || scopes[0] !== GMAIL_SCOPE)
          return end(400, "Chybí dlouhodobý přístup nebo není udělené přesně oprávnění odesílat Gmail. Vraťte se do chatu.");
        await save({ refresh_token: tokens.refresh_token, scope: GMAIL_SCOPE, token_type: "Bearer" });
        connected = true;
        onConnected();
        // Remove authorization code from the visible address before showing confirmation.
        response.writeHead(303, { Location: "/" });
        response.end();
      } catch { end(502, "Přístup se nepodařilo bezpečně uložit. Vraťte se do chatu; tajné údaje neposílejte."); }
      finally { busy = false; }
      return;
    }
    end(404, "Stránka neexistuje.");
  });
}
