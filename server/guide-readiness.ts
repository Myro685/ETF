import { readConfiguration, type Environment } from "./guide.ts";
import { normalizeEmail, isSafeLink } from "../src/utils/email.ts";

type Check = { name: string; ok: boolean; detail: string };

// Local checks only: never log values or send credentials to any service.
export function checkGuideReadiness(env: Environment): Check[] {
  const gmail = env.MAIL_PROVIDER === "gmail";
  const required = [
    "APP_ORIGIN", "SUPABASE_URL", "SUPABASE_SECRET_KEY",
    ...(gmail ? ["GMAIL_CLIENT_ID", "GMAIL_CLIENT_SECRET", "GMAIL_REFRESH_TOKEN"] : ["RESEND_API_KEY"]),
    "GUIDE_FROM_EMAIL", "GUIDE_DOWNLOAD_URL", "PRIVACY_CONTROLLER_NAME",
    "PRIVACY_CONTACT_EMAIL", "PRIVACY_POLICY_URL", "PRIVACY_NOTICE_VERSION",
  ];
  const checks = required.map((name) => ({
    name,
    ok: !!env[name]?.trim(),
    detail: env[name]?.trim() ? "Vyplněno (hodnota se nevypisuje)." : "Doplňte v soukromé konfiguraci.",
  }));
  checks.push({
    name: "Formát konfigurace",
    ok: !!readConfiguration({ ...env, GUIDE_ENABLED: "true" }),
    detail: "Kontrola formátů URL, e-mailů a přesného originu podle serveru; neověřuje platnost klíčů.",
  });
  const sender = normalizeEmail(env.GUIDE_FROM_EMAIL);
  const senderDomain = sender?.split("@")[1];
  const disallowedDomains = ["gmail.com", "googlemail.com", "outlook.com", "hotmail.com", "seznam.cz", "resend.dev"];
  checks.push({
    name: "Produkční odesílatel",
    ok: !!senderDomain && (gmail || !disallowedDomains.includes(senderDomain)),
    detail: gmail ? "Použijte adresu účtu, který jste připojili přes Gmail OAuth; vlastní doména není nutná. Účet nelze ověřit touto lokální kontrolou." : "Použijte vlastní doménu ověřenou v Resend. Testovací resend.dev není veřejné doručení. Kontaktní e-mail může být Gmail.",
  });
  checks.push({
    name: "Veřejná adresa aplikace",
    ok: isSafeLink(env.APP_ORIGIN),
    detail: "Pro veřejné spuštění musí být aplikace dostupná přes HTTPS; localhost slouží vývoji.",
  });
  checks.push({
    name: "Aktivace formuláře",
    ok: env.GUIDE_ENABLED === "true",
    detail: "Zapněte až po migracích, propojení odesílatele, zveřejnění informací a kontrole PDF.",
  });
  return checks;
}
