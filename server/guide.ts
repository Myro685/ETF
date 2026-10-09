import { normalizeEmail, isSafeLink } from "../src/utils/email.ts";

export type Environment = Record<string, string | undefined>;
export type PublicPrivacy = {
  controller: string;
  contact: string;
  url: string;
  version: string;
};
type Configuration = {
  origin: string;
  supabaseUrl: string;
  supabaseKey: string;
  resendKey: string;
  from: string;
  guideUrl: string;
  privacy: PublicPrivacy;
};
export function readConfiguration(env: Environment): Configuration | null {
  const origin = env.APP_ORIGIN;
  const from = normalizeEmail(env.GUIDE_FROM_EMAIL);
  const contact = normalizeEmail(env.PRIVACY_CONTACT_EMAIL);
  if (
    !origin ||
    !isSafeLink(env.SUPABASE_URL) ||
    !env.SUPABASE_SECRET_KEY ||
    !env.RESEND_API_KEY ||
    !from ||
    !isSafeLink(env.GUIDE_DOWNLOAD_URL) ||
    !env.PRIVACY_CONTROLLER_NAME?.trim() ||
    !contact ||
    !isSafeLink(env.PRIVACY_POLICY_URL) ||
    !env.PRIVACY_NOTICE_VERSION ||
    env.GUIDE_ENABLED !== "true"
  )
    return null;
  try {
    if (new URL(origin).origin !== origin) return null;
  } catch {
    return null;
  }
  return {
    origin,
    from,
    supabaseUrl: env.SUPABASE_URL.replace(/\/$/, ""),
    supabaseKey: env.SUPABASE_SECRET_KEY,
    resendKey: env.RESEND_API_KEY,
    guideUrl: env.GUIDE_DOWNLOAD_URL,
    privacy: {
      controller: env.PRIVACY_CONTROLLER_NAME.trim(),
      contact,
      url: env.PRIVACY_POLICY_URL,
      version: env.PRIVACY_NOTICE_VERSION,
    },
  };
}

export type ApiInput = {
  method: string;
  kind: "config" | "submit";
  origin?: string;
  contentType?: string;
  body?: unknown;
};
export type ApiOutput = { status: number; body: Record<string, unknown> };
export async function handleGuide(
  input: ApiInput,
  env: Environment,
  fetcher: typeof fetch = fetch,
): Promise<ApiOutput> {
  const config = readConfiguration(env);
  const error = (status: number, code: string): ApiOutput => ({
    status,
    body: { code },
  });
  if (input.kind === "config")
    return input.method === "GET"
      ? {
          status: 200,
          body: { available: !!config, privacy: config?.privacy || null },
        }
      : error(405, "method_not_allowed");
  if (input.method !== "POST") return error(405, "method_not_allowed");
  if (!input.contentType?.toLowerCase().startsWith("application/json"))
    return error(415, "invalid_body");
  const body = input.body;
  if (!body || typeof body !== "object" || Array.isArray(body))
    return error(400, "invalid_body");
  const {
    email: rawEmail,
    requestId,
    noticeVersion,
  } = body as Record<string, unknown>;
  const email = normalizeEmail(rawEmail);
  if (!email) return error(400, "invalid_email");
  if (
    typeof requestId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      requestId,
    )
  )
    return error(400, "invalid_request");
  if (!config) return error(503, "unavailable");
  if (input.origin !== config.origin) return error(403, "forbidden");
  if (noticeVersion !== config.privacy.version)
    return error(409, "privacy_changed");
  const supabaseHeaders: Record<string, string> = {
    apikey: config.supabaseKey,
    "Content-Type": "application/json",
  };
  if (config.supabaseKey.startsWith("eyJ"))
    supabaseHeaders.Authorization = `Bearer ${config.supabaseKey}`;
  async function rpc(name: string, parameters: Record<string, unknown>) {
    const response = await fetcher(
      `${config!.supabaseUrl}/rest/v1/rpc/${name}`,
      {
        method: "POST",
        headers: supabaseHeaders,
        body: JSON.stringify(parameters),
        signal: AbortSignal.timeout(8_000),
      },
    );
    if (!response.ok) throw new Error("storage_failed");
    return response.json();
  }
  // Verify the configured asset before collecting a new contact.
  try {
    const pdf = await fetcher(config.guideUrl, {
      headers: { Range: "bytes=0-15" },
      signal: AbortSignal.timeout(5_000),
    });
    if (
      !pdf.ok ||
      !pdf.body ||
      !pdf.headers.get("content-type")?.includes("application/pdf")
    ) {
      await pdf.body?.cancel();
      return error(503, "unavailable");
    }
    const reader = pdf.body.getReader();
    let prefix = "";
    while (prefix.length < 5) {
      const chunk = await reader.read();
      if (chunk.done) break;
      prefix += new TextDecoder().decode(
        chunk.value.slice(0, 5 - prefix.length),
      );
    }
    await reader.cancel();
    if (prefix !== "%PDF-") return error(503, "unavailable");
  } catch {
    return error(503, "unavailable");
  }
  let job: {
    mail_id: string | null;
    download_url: string;
    from_email: string;
    contact_email: string;
  };
  try {
    const raw = await rpc("register_guide_request", {
      p_id: requestId,
      p_email: email,
      p_notice_version: config.privacy.version,
      p_download_url: config.guideUrl,
      p_from_email: config.from,
      p_contact_email: config.privacy.contact,
    });
    if (!raw || typeof raw !== "object")
      throw new Error("Invalid storage response");
    const row = raw as Record<string, unknown>;
    if (typeof row.code === "string") {
      if (!["rate_limited", "expired", "invalid_request"].includes(row.code))
        throw new Error("Invalid storage response");
      return error(row.code === "rate_limited" ? 429 : 409, row.code);
    }
    if (
      !isSafeLink(row.download_url) ||
      typeof row.from_email !== "string" ||
      !normalizeEmail(row.from_email) ||
      typeof row.contact_email !== "string" ||
      !normalizeEmail(row.contact_email) ||
      (row.mail_id !== null && typeof row.mail_id !== "string")
    )
      throw new Error("Invalid storage response");
    job = {
      download_url: row.download_url,
      from_email: row.from_email,
      contact_email: row.contact_email,
      mail_id: row.mail_id as string | null,
    };
  } catch {
    return error(503, "storage_failed");
  }
  if (job.mail_id)
    return {
      status: 200,
      body: { accepted: true, downloadUrl: job.download_url },
    };
  // Frozen payload from storage keeps retries identical for the provider's idempotency key.
  let mailId: string;
  try {
    const response = await fetcher("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.resendKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `clientelo-guide/${requestId}`,
      },
      body: JSON.stringify({
        from: `Clientelo <${job.from_email}>`,
        to: [email],
        reply_to: job.contact_email,
        subject: "Váš průvodce porovnáním ETF",
        text: `Dobrý den,\n\nzde je vyžádaný Průvodce porovnáním ETF před prvním nákupem:\n${job.download_url}\n\nVyžádání PDF vás nepřihlásilo k newsletteru.\nClientelo`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return error(502, "delivery_failed");
    const data = await response.json();
    if (
      !data ||
      typeof data !== "object" ||
      !("id" in data) ||
      typeof data.id !== "string" ||
      !data.id
    )
      return error(502, "delivery_failed");
    mailId = data.id;
  } catch {
    return error(502, "delivery_failed");
  }
  try {
    const completion = await rpc("complete_guide_request", {
      p_id: requestId,
      p_mail_id: mailId,
    });
    if (
      !completion ||
      typeof completion !== "object" ||
      !("ok" in completion) ||
      completion.ok !== true
    )
      throw new Error("Invalid completion response");
  } catch {
    return error(503, "delivery_failed");
  }
  return {
    status: 200,
    body: { accepted: true, downloadUrl: job.download_url },
  };
}
