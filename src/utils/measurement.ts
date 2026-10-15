export const events = ["page_view", "calculator_use", "quiz_use", "guide_cta", "form_start", "form_success"] as const;
export type MeasurementEvent = typeof events[number];
export const variants = ["direct", "ad_a_rozdily", "ad_b_naklady", "other"] as const;
export type AdVariant = typeof variants[number];
export const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Never retain a raw URL, arbitrary UTM value, referrer or input value.
export function adVariant(search: string): AdVariant {
  const query = new URLSearchParams(search);
  if (![...query.keys()].some(key => key.startsWith("utm_"))) return "direct";
  if (query.get("utm_campaign") !== "etf_porovnani") return "other";
  const content = query.get("utm_content");
  return content === "ad_a_rozdily" || content === "ad_b_naklady" ? content : "other";
}
