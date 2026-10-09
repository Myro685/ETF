import { isSafeLink } from "../utils/email.ts";

export type GuideConfiguration = {
  available: boolean;
  privacy: null | {
    controller: string;
    contact: string;
    url: string;
    version: string;
  };
};
export type GuideResult = { downloadUrl: string };
export class GuideError extends Error {
  readonly code: string;
  constructor(code: string) {
    super(code);
    this.code = code;
  }
}
export const guideMessages: Record<string, string> = {
  invalid_email: "Zadejte e-mail ve tvaru jmeno@domena.cz.",
  unavailable:
    "Doručení průvodce připravujeme. Při tomto pokusu se e-mail neukládá ani neodesílá.",
  storage_failed: "Kontakt se nepodařilo uložit. Zkuste odeslání znovu.",
  delivery_failed:
    "Žádost je uložená, ale odeslání e-mailu se nezdařilo. Zkuste to znovu; stejnou žádost neopakujeme jako nový kontakt.",
  network:
    "Spojení se přerušilo. Ověřte připojení a zkuste to znovu. Výsledek odeslání zatím nelze potvrdit.",
  timeout:
    "Odeslání trvá déle než obvykle. Zkuste to znovu; použijeme stejnou žádost, aby nevznikl duplicitní e-mail.",
  rate_limited:
    "Bylo odesláno příliš mnoho žádostí. Zkuste to znovu za hodinu.",
  expired: "Původní žádost už vypršela. Odešlete novou žádost.",
  privacy_changed:
    "Informace o zpracování údajů se změnily. Obnovte stránku a přečtěte si je před odesláním.",
  unexpected: "Odeslání se nepodařilo potvrdit. Zkuste to znovu později.",
};

export async function loadGuideConfiguration(
  signal?: AbortSignal,
): Promise<GuideConfiguration> {
  const response = await fetch("/api/guide-config", {
    signal,
    cache: "no-store",
  });
  if (!response.ok) throw new GuideError("unavailable");
  const data = await response.json();
  if (!data.available) return { available: false, privacy: null };
  if (
    !data.privacy ||
    !isSafeLink(data.privacy.url) ||
    typeof data.privacy.controller !== "string" ||
    typeof data.privacy.contact !== "string" ||
    typeof data.privacy.version !== "string"
  )
    throw new GuideError("unavailable");
  return data;
}

export async function requestGuide(
  email: string,
  requestId: string,
  noticeVersion: string,
  fetcher: typeof fetch = fetch,
): Promise<GuideResult> {
  let response: Response;
  try {
    response = await fetcher("/api/guide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, requestId, noticeVersion }),
      signal: AbortSignal.timeout(25_000),
    });
  } catch (error) {
    throw new GuideError(
      error instanceof Error && error.name === "TimeoutError"
        ? "timeout"
        : "network",
    );
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new GuideError("unexpected");
  }
  if (!response.ok)
    throw new GuideError(
      typeof data.code === "string" ? data.code : "unexpected",
    );
  if (data.accepted !== true || !isSafeLink(data.downloadUrl))
    throw new GuideError("unexpected");
  return { downloadUrl: data.downloadUrl };
}

export const guideService = {
  load: loadGuideConfiguration,
  send: requestGuide,
};
