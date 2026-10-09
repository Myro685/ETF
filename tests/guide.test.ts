import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { once } from "node:events";
import { PGlite } from "@electric-sql/pglite";
import { handleGuide, type ApiInput } from "../server/guide.ts";
import { normalizeEmail, isSafeLink } from "../src/utils/email.ts";
import { requestGuide, GuideError } from "../src/services/guide.ts";
import { guideHttp } from "../server/http.ts";

test("HTTP adapter rejects malformed and oversized requests without invoking providers", async () => {
  const server = createServer((request, response) => {
    void guideHttp("submit", request, response);
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const url = `http://127.0.0.1:${address.port}`;
  try {
    const malformed = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    });
    assert.equal(malformed.status, 400);
    assert.equal(malformed.headers.get("cache-control"), "no-store");
    const oversized = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invalid: "x".repeat(3000) }),
    });
    assert.equal(oversized.status, 413);
    assert.equal((await fetch(url)).status, 405);
  } finally {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

// Synthetic, in-memory fixtures. No visitor data, service account or external requests.
const env = {
  GUIDE_ENABLED: "true",
  APP_ORIGIN: "https://clientelo.example.invalid",
  SUPABASE_URL: "https://database.example.invalid",
  SUPABASE_SECRET_KEY: "test-only-key",
  RESEND_API_KEY: "test-only-key",
  GUIDE_FROM_EMAIL: "sender@example.invalid",
  GUIDE_DOWNLOAD_URL: "https://clientelo.example.invalid/guide.pdf",
  PRIVACY_CONTROLLER_NAME: "Test fixture",
  PRIVACY_CONTACT_EMAIL: "privacy@example.invalid",
  PRIVACY_POLICY_URL: "https://clientelo.example.invalid/privacy",
  PRIVACY_NOTICE_VERSION: "fixture-v1",
};
const input = (id = randomUUID()): ApiInput => ({
  method: "POST",
  kind: "submit",
  origin: env.APP_ORIGIN,
  contentType: "application/json",
  body: {
    email: "reader@example.invalid",
    requestId: id,
    noticeVersion: "fixture-v1",
  },
});
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
const pdf = () =>
  new Response("%PDF-1.7 fixture", {
    headers: { "Content-Type": "application/pdf" },
  });

test("Email normalization rejects malformed addresses and injection without changing valid plus aliases", () => {
  assert.equal(
    normalizeEmail(" Reader+ETF@Example.cz "),
    "reader+etf@example.cz",
  );
  for (const value of [
    "",
    "a@b",
    "a..b@example.cz",
    "a@-example.cz",
    "a@example..cz",
    "a@example.cz\r\nBcc:x@y.cz",
    "a b@example.cz",
    "a".repeat(65) + "@example.cz",
    null,
    123,
  ])
    assert.equal(normalizeEmail(value), null);
  assert.equal(isSafeLink("javascript:alert(1)"), false);
});

test("Missing configuration, invalid input and origin mismatch never call storage or email", async () => {
  const forbiddenFetch = async () => {
    throw new Error("External request was forbidden");
  };
  assert.equal((await handleGuide(input(), {}, forbiddenFetch)).status, 503);
  assert.equal(
    (
      await handleGuide(
        { ...input(), body: { email: "invalid" } },
        env,
        forbiddenFetch,
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await handleGuide(
        { ...input(), origin: "https://other.example.invalid" },
        env,
        forbiddenFetch,
      )
    ).status,
    403,
  );
  assert.equal(
    (
      await handleGuide(
        {
          ...input(),
          body: { ...(input().body as object), noticeVersion: "old" },
        },
        env,
        forbiddenFetch,
      )
    ).body.code,
    "privacy_changed",
  );
  const publicConfig = await handleGuide(
    { method: "GET", kind: "config" },
    env,
    forbiddenFetch,
  );
  assert.equal(publicConfig.body.available, true);
  assert.ok(!JSON.stringify(publicConfig).includes("test-only-key"));
});

test("Asset and provider failures never produce a false success", async () => {
  for (const phase of ["pdf", "storage", "mail", "completion"]) {
    const calls: string[] = [];
    const fetcher: typeof fetch = async (url) => {
      const address = String(url);
      calls.push(address);
      if (address === env.GUIDE_DOWNLOAD_URL)
        return phase === "pdf" ? new Response("not a PDF") : pdf();
      if (address.endsWith("register_guide_request"))
        return phase === "storage"
          ? json({}, 503)
          : json({
              download_url: env.GUIDE_DOWNLOAD_URL,
              from_email: env.GUIDE_FROM_EMAIL,
              contact_email: env.PRIVACY_CONTACT_EMAIL,
              mail_id: null,
            });
      if (address.endsWith("complete_guide_request"))
        return phase === "completion" ? json({}, 503) : json({ ok: true });
      return phase === "mail" ? json({}, 502) : json({ id: "fixture-mail-id" });
    };
    const result = await handleGuide(input(), env, fetcher);
    assert.notEqual(result.status, 200);
    assert.notEqual(result.body.accepted, true);
    if (phase === "pdf") assert.equal(calls.length, 1);
    if (phase === "storage") assert.equal(calls.length, 2);
  }
});

test("Real PostgreSQL migration: contacts, retries, rate limit, grants, delivery state and deletion", async () => {
  const db = new PGlite();
  try {
    await db.exec(
      "create role anon; create role authenticated; create role service_role; grant usage on schema public to anon, authenticated, service_role;",
    );
    await db.exec(
      await readFile(
        new URL("../supabase/001-guide.sql", import.meta.url),
        "utf8",
      ),
    );
    const mailBodies: string[] = [];
    const mailKeys: string[] = [];
    let rejectMail = true;
    const fetcher: typeof fetch = async (url, options) => {
      const address = String(url);
      if (address === env.GUIDE_DOWNLOAD_URL) return pdf();
      const parameters = JSON.parse(String(options?.body));
      if (address.endsWith("register_guide_request")) {
        const result = await db.query(
          "select public.register_guide_request($1,$2,$3,$4,$5,$6) as job",
          [
            parameters.p_id,
            parameters.p_email,
            parameters.p_notice_version,
            parameters.p_download_url,
            parameters.p_from_email,
            parameters.p_contact_email,
          ],
        );
        return json(result.rows[0].job);
      }
      if (address.endsWith("complete_guide_request")) {
        const result = await db.query(
          "select public.complete_guide_request($1,$2) as result",
          [parameters.p_id, parameters.p_mail_id],
        );
        return json(result.rows[0].result);
      }
      mailBodies.push(String(options?.body));
      mailKeys.push(new Headers(options?.headers).get("Idempotency-Key")!);
      return rejectMail ? json({}, 502) : json({ id: "fixture-mail-id" });
    };
    const first = input();
    assert.equal(
      (await handleGuide(first, env, fetcher)).body.code,
      "delivery_failed",
    );
    rejectMail = false;
    assert.equal((await handleGuide(first, env, fetcher)).status, 200);
    assert.equal(mailKeys[0], mailKeys[1]);
    assert.equal(mailBodies[0], mailBodies[1]);
    assert.equal((await handleGuide(first, env, fetcher)).status, 200);
    assert.equal(mailBodies.length, 2);
    const count = await db.query(
      "select count(*)::int as count from public.guide_contacts",
    );
    assert.equal(count.rows[0].count, 1);
    assert.equal((await handleGuide(input(), env, fetcher)).status, 200);
    assert.equal((await handleGuide(input(), env, fetcher)).status, 200);
    assert.equal((await handleGuide(input(), env, fetcher)).status, 429);
    const grants = await db.query(
      "select has_function_privilege('anon','public.register_guide_request(uuid,text,text,text,text,text)','execute') as anon, has_function_privilege('service_role','public.register_guide_request(uuid,text,text,text,text,text)','execute') as server, has_table_privilege('authenticated','public.guide_contacts','select') as read",
    );
    assert.deepEqual(grants.rows[0], {
      anon: false,
      server: true,
      read: false,
    });
    const expiredId = randomUUID();
    await db.query(
      "insert into public.guide_requests(id,email,notice_version,created_at,download_url,from_email,contact_email) values ($1,'reader@example.invalid','fixture-v1',now()-interval '24 hours',$2,$3,$4)",
      [
        expiredId,
        env.GUIDE_DOWNLOAD_URL,
        env.GUIDE_FROM_EMAIL,
        env.PRIVACY_CONTACT_EMAIL,
      ],
    );
    assert.equal(
      (await handleGuide(input(expiredId), env, fetcher)).body.code,
      "expired",
    );
    await db.exec(
      "update public.guide_contacts set expires_at=now()-interval '1 hour'; select public.purge_expired_guide_contacts();",
    );
    assert.equal(
      (
        await db.query(
          "select count(*)::int as count from public.guide_requests",
        )
      ).rows[0].count,
      0,
    );
  } finally {
    await db.close();
  }
});

test("Client distinguishes timeout, network, server error and malformed success", async () => {
  for (const code of ["timeout", "network", "delivery_failed", "unexpected"]) {
    const fetcher: typeof fetch = async () => {
      if (code === "timeout") throw new DOMException("fixture", "TimeoutError");
      if (code === "network") throw new TypeError("fixture");
      if (code === "delivery_failed") return json({ code }, 502);
      return json({ accepted: true, downloadUrl: "javascript:alert(1)" });
    };
    await assert.rejects(
      () =>
        requestGuide(
          "reader@example.invalid",
          randomUUID(),
          "fixture-v1",
          fetcher,
        ),
      (error: unknown) => error instanceof GuideError && error.code === code,
    );
  }
  const result = await requestGuide(
    "reader@example.invalid",
    randomUUID(),
    "fixture-v1",
    async () => json({ accepted: true, downloadUrl: env.GUIDE_DOWNLOAD_URL }),
  );
  assert.equal(result.downloadUrl, env.GUIDE_DOWNLOAD_URL);
});
