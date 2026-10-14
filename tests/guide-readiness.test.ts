import assert from "node:assert/strict";
import test from "node:test";
import { checkGuideReadiness } from "../server/guide-readiness.ts";

test("Readiness reports missing setup without disclosing secrets or enabling the service", () => {
  const env = { SUPABASE_SECRET_KEY: "secret-value-never-print", GUIDE_ENABLED: "false" };
  const checks = checkGuideReadiness(env);
  assert.equal(checks.find((check) => check.name === "RESEND_API_KEY")?.ok, false);
  assert.equal(checks.find((check) => check.name === "Aktivace formuláře")?.ok, false);
  assert.ok(!JSON.stringify(checks).includes(env.SUPABASE_SECRET_KEY));
  assert.equal(env.GUIDE_ENABLED, "false");
});

test("Readiness does not mistake Gmail or the Resend test domain for a production sender", () => {
  for (const address of ["owner@gmail.com", "onboarding@resend.dev"]) {
    const checks = checkGuideReadiness({ GUIDE_FROM_EMAIL: address });
    assert.equal(checks.find((check) => check.name === "Produkční odesílatel")?.ok, false);
  }
});
