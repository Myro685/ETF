import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { handleGuide } from "../server/guide.ts";
const env = {
  GUIDE_ENABLED: "true", GUIDE_DEMO_MODE: "true", MAIL_PROVIDER: "gmail",
  APP_ORIGIN: "https://demo.example.invalid", SUPABASE_URL: "https://db.example.invalid",
  SUPABASE_SECRET_KEY: "fixture-secret", GMAIL_CLIENT_ID: "fixture.apps.googleusercontent.com",
  GMAIL_CLIENT_SECRET: "fixture-secret", GMAIL_REFRESH_TOKEN: "fixture-refresh",
  GUIDE_FROM_EMAIL: "operator@example.invalid", GUIDE_DOWNLOAD_URL: "https://demo.example.invalid/guide.pdf",
  PRIVACY_CONTROLLER_NAME: "Fixture", PRIVACY_CONTACT_EMAIL: "operator@example.invalid",
  PRIVACY_POLICY_URL: "https://demo.example.invalid/privacy", PRIVACY_NOTICE_VERSION: "demo-v1",
};
test("Evaluation mode rejects arbitrary visitor addresses before any storage, PDF or Gmail request", async () => {
  const config = await handleGuide({ kind: "config", method: "GET" }, env);
  assert.equal(config.body.demoOnly, true);
  assert.equal(config.body.available, true);
  let requests = 0;
  const fetcher: typeof fetch = async () => { requests++; throw new Error("Synthetic stop"); };
  const request = (email: string) => ({ kind: "submit" as const, method: "POST", origin: env.APP_ORIGIN,
    contentType: "application/json", body: { email, requestId: randomUUID(), noticeVersion: env.PRIVACY_NOTICE_VERSION } });
  for (const email of ["visitor@example.invalid", "operator+alias@example.invalid", "visitor@gmail.com"]) {
    const result = await handleGuide(request(email), env, fetcher);
    assert.equal(result.status, 403);
    assert.equal(result.body.code, "demo_only");
  }
  assert.equal(requests, 0);
  const acceptedAddress = await handleGuide(request(" OPERATOR@example.invalid "), env, fetcher);
  assert.notEqual(acceptedAddress.body.code, "demo_only");
  assert.ok(requests > 0, "Only the exact normalized operator address may reach the pipeline");
});
