import { adVariant, type AdVariant, type MeasurementEvent, uuid } from "../utils/measurement.ts";

const consentKey = "clientelo-measurement-v1";
const sessionKey = "clientelo-session-v1";
const consentAge = 180 * 24 * 60 * 60 * 1000;
type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type Session = { id: string; variant: AdVariant; seen: MeasurementEvent[] };

export class Measurement {
  private allowed = false;
  private session: Session | null = null;
  private local: StorageLike;
  private tab: StorageLike;
  private search: string;
  private send: (body: object) => Promise<boolean>;
  private makeId: () => string;
  constructor(local: StorageLike, tab: StorageLike, search: string,
    send: (body: object) => Promise<boolean>, makeId: () => string) {
    this.local = local; this.tab = tab; this.search = search; this.send = send; this.makeId = makeId;
  }

  preference(): boolean | null {
    try {
      const saved = JSON.parse(this.local.getItem(consentKey) || "null");
      if (typeof saved?.allowed === "boolean" && Date.now() - saved.at < consentAge) return saved.allowed;
    } catch { /* Storage can be blocked. The page remains usable. */ }
    return null;
  }
  choose(allowed: boolean) {
    try { this.local.setItem(consentKey, JSON.stringify({ allowed, at: Date.now() })); } catch { /* Memory only. */ }
    this.start(allowed);
  }
  start(allowed: boolean) {
    this.allowed = allowed;
    if (!allowed) {
      this.session = null;
      try { this.tab.removeItem(sessionKey); } catch { /* No storage. */ }
      return;
    }
    if (!this.session) {
      try {
        const saved = JSON.parse(this.tab.getItem(sessionKey) || "null");
        if (uuid.test(saved?.id) && ["direct", "other", "ad_a_rozdily", "ad_b_naklady"].includes(saved.variant) && Array.isArray(saved.seen))
          this.session = saved;
      } catch { /* Start a fresh session. */ }
      this.session ||= { id: this.makeId(), variant: adVariant(this.search), seen: [] };
    }
    void this.track("page_view");
  }
  private persist() {
    try { this.tab.setItem(sessionKey, JSON.stringify(this.session)); } catch { /* Memory only. */ }
  }
  async track(event: MeasurementEvent, requestId?: string) {
    if (!this.allowed || !this.session || this.session.seen.includes(event)) return;
    const session = this.session;
    // Reserve synchronously, including StrictMode effects and rapid input changes.
    session.seen.push(event);
    this.persist();
    let ok = false;
    try {
      ok = await this.send({ sessionId: session.id, variant: session.variant, event,
        ...(event === "form_success" && requestId ? { requestId } : {}) });
    } catch { /* Analytics must never interrupt the requested service. */ }
    if (!ok) {
      session.seen = session.seen.filter(value => value !== event);
      if (this.allowed && this.session === session) this.persist();
    }
  }
}

let instance: Measurement | undefined;
export function measurement() {
  if (!instance) {
    const memory = () => { const values = new Map<string, string>(); return {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
      removeItem: (key: string) => { values.delete(key); },
    }; };
    let local: StorageLike = memory(), tab: StorageLike = memory();
    try { local = window.localStorage; tab = window.sessionStorage; } catch { /* Private browsing. */ }
    instance = new Measurement(local, tab, window.location.search, async body => {
      const response = await fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body), keepalive: true, signal: AbortSignal.timeout(5_000) });
      return response.ok;
    }, () => crypto.randomUUID());
  }
  return instance;
}
