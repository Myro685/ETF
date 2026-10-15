import assert from "node:assert/strict";
import test from "node:test";
import { once } from "node:events";
import { request as httpRequest } from "node:http";
import type { Credentials } from "google-auth-library";
import { createGmailOAuthServer, GMAIL_SCOPE, GMAIL_REDIRECT, googleOAuthAdapter, parseGmailClient } from "../server/gmail-oauth.ts";

test("Google authorization uses only send scope, offline consent, state and PKCE", async () => {
  const client = parseGmailClient({ web: { client_id: "test.apps.googleusercontent.com", client_secret: "fixture-only", redirect_uris: [GMAIL_REDIRECT], token_uri: "https://attacker.invalid" } });
  const flow = await googleOAuthAdapter(client).authorize("fixture-state");
  const url = new URL(flow.url);
  assert.equal(url.origin, "https://accounts.google.com");
  assert.equal(url.searchParams.get("scope"), GMAIL_SCOPE);
  assert.equal(url.searchParams.get("access_type"), "offline");
  assert.equal(url.searchParams.get("state"), "fixture-state");
  assert.equal(url.searchParams.get("code_challenge_method"), "S256");
  assert.ok(flow.verifier.length >= 43);
  assert.ok(!flow.url.includes("fixture-only"));
  assert.throws(() => parseGmailClient({ installed: {} }));
});

test("OAuth callback rejects CSRF, expired or extra-scope grants and never persists access tokens", async () => {
  let clock = 0, state = "", exchanges = 0, saved: Credentials | null = null;
  let grant: Credentials = { refresh_token: "synthetic-refresh", access_token: "synthetic-access", scope: GMAIL_SCOPE };
  const server = createGmailOAuthServer({
    adapter: {
      async authorize(value) { state = value; return { url: "https://accounts.google.com/fixture", verifier: "synthetic-verifier" }; },
      async exchange(_code, verifier) { assert.equal(verifier, "synthetic-verifier"); exchanges++; return grant; },
    },
    async save(value) { saved = value; }, now: () => clock,
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const base = `http://127.0.0.1:${address.port}`;
  // Native HTTP preserves the custom Host header when the test uses an ephemeral port.
  const request = (path: string, options: RequestInit = {}) => new Promise<Response>((resolve, reject) => {
    const req = httpRequest(base + path, {
      method: options.method || "GET", headers: { Host: "127.0.0.1:5175", ...options.headers },
    }, async (res) => {
      const chunks: Buffer[] = [];
      for await (const chunk of res) chunks.push(Buffer.from(chunk));
      resolve(new Response(Buffer.concat(chunks), { status: res.statusCode, headers: res.headers as Record<string, string> }));
    });
    req.on("error", reject);
    req.end();
  });
  try {
    const page = await request("/");
    assert.equal(page.headers.get("cache-control"), "no-store");
    const html = await page.text();
    const start = html.match(/action="([^"]+)"/)![1];
    const authorize = () => request(start, { method: "POST", headers: { Origin: "http://127.0.0.1:5175" } });
    assert.equal((await request("/", { headers: { Host: "attacker.invalid" } })).status, 403);
    assert.equal((await request(start, { method: "POST", headers: { Origin: "https://attacker.invalid" } })).status, 403);
    assert.equal((await authorize()).status, 303);
    assert.equal((await request("/oauth/callback?state=wrong&code=synthetic")).status, 403);
    assert.equal(exchanges, 0);
    clock = 600001;
    assert.equal((await request(`/oauth/callback?state=${state}&code=synthetic`)).status, 403);
    assert.equal(exchanges, 0);
    await authorize();
    grant = { refresh_token: "synthetic-refresh", scope: GMAIL_SCOPE + " https://www.googleapis.com/auth/gmail.readonly" };
    assert.equal((await request(`/oauth/callback?state=${state}&code=synthetic`)).status, 400);
    assert.equal(saved, null);
    await authorize();
    grant = { refresh_token: "synthetic-refresh", access_token: "synthetic-access", scope: GMAIL_SCOPE };
    const callback = `/oauth/callback?state=${state}&code=synthetic`;
    const success = await request(callback);
    assert.equal(success.status, 303);
    assert.equal(success.headers.get("location"), "/");
    assert.deepEqual(saved, { refresh_token: "synthetic-refresh", scope: GMAIL_SCOPE, token_type: "Bearer" });
    const beforeReplay = exchanges;
    assert.equal((await request(callback)).status, 403);
    assert.equal(exchanges, beforeReplay);
    const confirmation = await (await request("/")).text();
    assert.ok(confirmation.includes("Gmail je propojený."));
    assert.ok(!confirmation.includes("synthetic-refresh"));
    assert.ok(!confirmation.includes("synthetic-access"));
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});
