import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { handleGuide, type ApiInput } from "../server/guide.ts";
import { buildGuideMime } from "../server/gmail-delivery.ts";
import { checkGuideReadiness } from "../server/guide-readiness.ts";

const env = {
  MAIL_PROVIDER: "gmail", GUIDE_ENABLED: "true", APP_ORIGIN: "https://fixture.example.invalid",
  SUPABASE_URL: "https://db.example.invalid", SUPABASE_SECRET_KEY: "fixture-only-secret",
  GMAIL_CLIENT_ID: "fixture.apps.googleusercontent.com", GMAIL_CLIENT_SECRET: "fixture-only-client-secret",
  GMAIL_REFRESH_TOKEN: "fixture-only-refresh", GUIDE_FROM_EMAIL: "sender@gmail.com",
  GUIDE_DOWNLOAD_URL: "https://fixture.example.invalid/guide.pdf", PRIVACY_CONTROLLER_NAME: "Fixture",
  PRIVACY_CONTACT_EMAIL: "privacy@example.invalid", PRIVACY_POLICY_URL: "https://fixture.example.invalid/privacy", PRIVACY_NOTICE_VERSION: "fixture-v1",
};
const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers: { "Content-Type": "application/json" } });
const input = (id = randomUUID()): ApiInput => ({ kind: "submit", method: "POST", origin: env.APP_ORIGIN,
  contentType: "application/json", body: { email: "reader@example.invalid", requestId: id, noticeVersion: env.PRIVACY_NOTICE_VERSION } });

test("Gmail setup permits the connected Gmail sender and never exposes credentials in public config", async () => {
  assert.ok(checkGuideReadiness(env).every(check => check.ok));
  const config = await handleGuide({ kind: "config", method: "GET" }, env);
  assert.equal(config.body.available, true);
  for (const secret of [env.GMAIL_CLIENT_SECRET, env.GMAIL_REFRESH_TOKEN, env.SUPABASE_SECRET_KEY])
    assert.ok(!JSON.stringify(config).includes(secret));
  assert.equal((await handleGuide({ kind: "config", method: "GET" }, { ...env, GMAIL_REFRESH_TOKEN: "" })).body.available, false);
});

test("Gmail MIME safely encodes Czech content and refuses header injection", () => {
  const message = { from: "sender@gmail.com", to: "reader@example.invalid", replyTo: "privacy@example.invalid", url: env.GUIDE_DOWNLOAD_URL, requestId: randomUUID() };
  const mime = buildGuideMime(message);
  assert.ok(mime.includes("Subject: =?UTF-8?B?"));
  assert.ok(Buffer.from(mime.split("\r\n\r\n")[1].replace(/\r\n/g, ""), "base64").toString().includes(env.GUIDE_DOWNLOAD_URL));
  assert.throws(() => buildGuideMime({ ...message, to: "reader@example.invalid\r\nBcc: attacker@example.invalid" }));
});

test("Gmail database claim prevents double send after concurrency, lost response or failed completion", async () => {
  const db = new PGlite();
  let sends = 0, mode = "success";
  try {
    await db.exec("create role anon; create role authenticated; create role service_role; grant usage on schema public to anon, authenticated, service_role;");
    for (const file of ["001-guide.sql", "002-gmail.sql"])
      await db.exec(await readFile(new URL(`../supabase/${file}`, import.meta.url), "utf8"));
    const fetcher: typeof fetch = async (url, options) => {
      const address = String(url);
      if (address === env.GUIDE_DOWNLOAD_URL) return new Response("%PDF-1.4 fixture", { headers: { "Content-Type": "application/pdf" } });
      const p = JSON.parse(String(options?.body));
      if (address.endsWith("register_gmail_guide_request") || address.endsWith("register_guide_request")) {
        const fn = address.endsWith("register_gmail_guide_request") ? "register_gmail_guide_request" : "register_guide_request";
        const result = await db.query(`select public.${fn}($1,$2,$3,$4,$5,$6) as value`, [p.p_id,p.p_email,p.p_notice_version,p.p_download_url,p.p_from_email,p.p_contact_email]);
        return json(result.rows[0].value);
      }
      if (address.endsWith("claim_gmail_guide_request")) {
        const result = await db.query("select public.claim_gmail_guide_request($1) as value", [p.p_id]);
        return json(result.rows[0].value);
      }
      if (address.endsWith("complete_guide_request")) {
        if (mode === "completion-failed") return json({}, 503);
        const result = await db.query("select public.complete_guide_request($1,$2) as value", [p.p_id,p.p_mail_id]);
        return json(result.rows[0].value);
      }
      assert.equal(address, "https://gmail.googleapis.com/gmail/v1/users/me/messages/send");
      assert.equal(new Headers(options?.headers).get("Authorization"), "Bearer fixture-token");
      assert.ok(Buffer.from(p.raw, "base64url").toString().includes("To: reader@example.invalid"));
      sends++;
      if (mode === "lost-response") throw new TypeError("Synthetic connection loss after send");
      return json({ id: `fixture-mail-${sends}` });
    };
    const token = async () => "fixture-token";
    const first = input();
    const concurrent = await Promise.all([handleGuide(first, env, fetcher, token), handleGuide(first, env, fetcher, token)]);
    assert.ok(concurrent.some(result => result.status === 200));
    assert.equal(sends, 1);
    assert.equal((await handleGuide(first, env, fetcher, token)).status, 200);
    assert.equal(sends, 1);
    assert.equal((await handleGuide(first, { ...env, MAIL_PROVIDER: "resend", RESEND_API_KEY: "fixture" }, fetcher)).body.code, "invalid_request", "provider change must not resend an old Gmail request");
    mode = "lost-response";
    const uncertain = input();
    assert.equal((await handleGuide(uncertain, env, fetcher, token)).body.code, "delivery_uncertain");
    assert.equal(sends, 2);
    assert.equal((await handleGuide(uncertain, env, fetcher, token)).body.code, "delivery_uncertain");
    assert.equal(sends, 2);
    mode = "completion-failed";
    const completion = input();
    assert.equal((await handleGuide(completion, env, fetcher, token)).body.code, "delivery_uncertain");
    assert.equal(sends, 3);
    assert.equal((await handleGuide(completion, env, fetcher, token)).body.code, "delivery_uncertain");
    assert.equal(sends, 3);
    const grants = await db.query("select has_function_privilege('anon','public.claim_gmail_guide_request(uuid)','execute') as anon, has_function_privilege('service_role','public.claim_gmail_guide_request(uuid)','execute') as server");
    assert.deepEqual(grants.rows[0], { anon: false, server: true });
  } finally { await db.close(); }
});
