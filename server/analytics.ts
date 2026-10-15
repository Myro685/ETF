import { events, variants, uuid } from "../src/utils/measurement.ts";
import type { Environment, ApiOutput } from "./guide.ts";

export async function handleEvent(input: { method: string; origin?: string; contentType?: string; body?: unknown },
  env: Environment, fetcher: typeof fetch = fetch): Promise<ApiOutput> {
  const reply = (status: number, code: string): ApiOutput => ({ status, body: { code } });
  if (input.method !== "POST") return reply(405, "method_not_allowed");
  if (input.origin !== env.APP_ORIGIN || !env.APP_ORIGIN) return reply(403, "forbidden");
  if (!input.contentType?.toLowerCase().startsWith("application/json")) return reply(415, "invalid_body");
  if (!input.body || typeof input.body !== "object" || Array.isArray(input.body)) return reply(400, "invalid_body");
  const body = input.body as Record<string, unknown>;
  const { sessionId, variant, event, requestId } = body;
  if (Object.keys(body).some(key => !["sessionId", "variant", "event", "requestId"].includes(key)) ||
    typeof sessionId !== "string" || !uuid.test(sessionId) ||
    !variants.includes(variant as typeof variants[number]) || !events.includes(event as typeof events[number]) ||
    (event === "form_success" ? typeof requestId !== "string" || !uuid.test(requestId) : requestId !== undefined))
    return reply(400, "invalid_body");
  if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY) return reply(503, "unavailable");
  const headers: Record<string, string> = { apikey: env.SUPABASE_SECRET_KEY, "Content-Type": "application/json" };
  if (env.SUPABASE_SECRET_KEY.startsWith("eyJ")) headers.Authorization = `Bearer ${env.SUPABASE_SECRET_KEY}`;
  try {
    const response = await fetcher(`${env.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/rpc/record_measurement`, {
      method: "POST", headers, signal: AbortSignal.timeout(4_000),
      body: JSON.stringify({ p_session: sessionId, p_variant: variant, p_event: event, p_request: requestId ?? null }),
    });
    if (!response.ok) return reply(503, "storage_failed");
    const result = await response.json();
    return result && typeof result === "object" && "ok" in result && result.ok === true ? reply(200, "recorded") : reply(409, "not_recorded");
  } catch { return reply(503, "storage_failed"); }
}
