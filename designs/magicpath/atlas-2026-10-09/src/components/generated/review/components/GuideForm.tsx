import { useEffect, useRef, useState, type FormEvent } from "react";
import { normalizeEmail } from "../utils/email";
import {
  guideService,
  GuideError,
  guideMessages,
  type GuideConfiguration,
} from "../services/guide";
import "./GuideForm.css";

type Status = "idle" | "invalid" | "sending" | "error" | "success";
export function GuideForm({
  service = guideService,
}: {
  service?: typeof guideService;
}) {
  const [email, setEmail] = useState("");
  const [configuration, setConfiguration] = useState<GuideConfiguration | null>(
    null,
  );
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const emailField = useRef<HTMLInputElement>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const request = useRef<{ email: string; id: string } | null>(null);
  const inFlight = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    let active = true;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);
    service
      .load(controller.signal)
      .then((data) => {
        if (active) setConfiguration(data);
      })
      .catch(() => {
        if (active) setConfiguration({ available: false, privacy: null });
      })
      .finally(() => clearTimeout(timer));
    return () => {
      active = false;
      mounted.current = false;
      controller.abort();
      clearTimeout(timer);
    };
  }, [service]);

  function validate() {
    if (!normalizeEmail(email)) {
      setStatus("invalid");
      setMessage(guideMessages.invalid_email);
      return false;
    }
    return true;
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (inFlight.current || status === "success") return;
    if (!validate()) {
      emailField.current?.focus();
      return;
    }
    if (!configuration?.available || !configuration.privacy) {
      setStatus("error");
      setMessage(guideMessages.unavailable);
      return;
    }
    const normalized = normalizeEmail(email)!;
    if (request.current?.email !== normalized)
      request.current = { email: normalized, id: crypto.randomUUID() };
    inFlight.current = true;
    setStatus("sending");
    setMessage("Připravujeme průvodce k odeslání…");
    try {
      const result = await service.send(
        normalized,
        request.current.id,
        configuration.privacy.version,
      );
      if (!mounted.current) return;
      setDownloadUrl(result.downloadUrl);
      setEmail("");
      setStatus("success");
      setMessage("");
      requestAnimationFrame(() => successHeading.current?.focus());
    } catch (error) {
      if (!mounted.current) return;
      const code = error instanceof GuideError ? error.code : "unexpected";
      if (code === "expired") request.current = null;
      setStatus(code === "invalid_email" ? "invalid" : "error");
      setMessage(guideMessages[code] || guideMessages.unexpected);
      if (code === "invalid_email") emailField.current?.focus();
    } finally {
      inFlight.current = false;
    }
  }

  const privacy = configuration?.privacy;
  return (
    <div className="cl-guide-form">
      {status === "success" ? (
        <div className="cl-guide-success" role="status">
          <h3 ref={successHeading} tabIndex={-1}>
            Průvodce je připravený.
          </h3>
          <p>
            E-mail s odkazem jsme předali k odeslání. Doručení do schránky může
            chvíli trvat; podívejte se také do spamu.
          </p>
          <a
            className="cl-button"
            href={downloadUrl}
            target="_blank"
            rel="noreferrer"
          >
            Stáhnout PDF průvodce
          </a>
          <p>
            Stažení můžete použít hned. Vyžádání PDF vás nepřihlásilo k
            newsletteru.
          </p>
        </div>
      ) : (
        <>
          {!configuration?.available && (
            <p className="cl-prototype-note" id="cl-form-availability">
              {configuration
                ? "Průvodce připravujeme. Zatím si můžete ověřit formát e-mailu; žádný kontakt neukládáme."
                : "Ověřujeme dostupnost doručení…"}
            </p>
          )}
          <form
            noValidate
            onSubmit={submit}
            className="cl-form"
            aria-busy={status === "sending"}
          >
            <label htmlFor="cl-email">E-mail pro doručení průvodce</label>
            <div className="cl-form-row">
              <input
                ref={emailField}
                id="cl-email"
                name="email"
                maxLength={254}
                type="email"
                autoComplete="email"
                inputMode="email"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="vas@email.cz"
                value={email}
                readOnly={status === "sending"}
                required
                aria-invalid={status === "invalid"}
                aria-describedby="cl-form-note cl-form-status"
                onChange={(event) => {
                  setEmail(event.target.value);
                  setStatus("idle");
                  setMessage("");
                }}
                onBlur={() => {
                  if (email.trim() && status !== "sending") validate();
                }}
              />
              <button
                type="submit"
                className="cl-button"
                disabled={!configuration || status === "sending"}
              >
                {status === "sending"
                  ? "Odesíláme…"
                  : configuration?.available
                    ? status === "error"
                      ? "Zkusit odeslat znovu"
                      : "Poslat průvodce zdarma"
                    : "Zkontrolovat e-mail"}
              </button>
            </div>
            <div
              id="cl-form-status"
              className={"cl-form-status " + status}
              role="status"
              aria-atomic="true"
            >
              {message}
            </div>
            <p id="cl-form-note" className="cl-form-note">
              E-mail použijeme pro doručení průvodce a vyřízení vaší žádosti.
              Žádné automatické přihlášení k newsletteru.
            </p>
            {privacy && (
              <p className="cl-form-note">
                Správce: {privacy.controller}.{" "}
                <a href={privacy.url} target="_blank" rel="noreferrer">
                  Jak zpracováváme údaje
                </a>
              </p>
            )}
          </form>
        </>
      )}
    </div>
  );
}
