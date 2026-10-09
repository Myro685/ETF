import { useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { GuideForm } from "../src/components/GuideForm";
import { GuideError, type GuideResult } from "../src/services/guide";
import "../src/index.css";
import "../src/components/EtfLanding.css";

export function FormPreview() {
  const [mode, setMode] = useState("success");
  const [calls, setCalls] = useState(0);
  const finish = useRef<(() => void) | null>(null);
  const service = useMemo(
    () => ({
      async load() {
        return {
          available: mode !== "unavailable",
          privacy:
            mode === "unavailable"
              ? null
              : {
                  controller: "Ukázka pro test",
                  contact: "privacy@example.invalid",
                  url: "https://example.invalid/privacy",
                  version: "fixture-v1",
                },
        };
      },
      async send(): Promise<GuideResult> {
        setCalls((value) => value + 1);
        if (mode === "failure") throw new GuideError("delivery_failed");
        if (mode === "network") throw new GuideError("network");
        if (mode === "slow")
          await new Promise<void>((resolve) => {
            finish.current = resolve;
          });
        return { downloadUrl: "https://example.invalid/guide.pdf" };
      },
    }),
    [mode],
  );
  return (
    <main className="cl-page">
      <div className="cl-wrap" style={{ paddingBlock: 32, maxWidth: 640 }}>
        <p>
          <strong>TESTOVACÍ STRÁNKA.</strong> Pouze syntetické scénáře, žádné
          uložení ani odeslání. Není součástí veřejného webu.
        </p>
        <label htmlFor="test-mode">Testovaný stav</label>
        <select
          id="test-mode"
          value={mode}
          onChange={(event) => {
            setMode(event.target.value);
            setCalls(0);
          }}
        >
          <option value="success">Úspěch</option>
          <option value="failure">Chyba odeslání</option>
          <option value="network">Výpadek sítě</option>
          <option value="slow">Čekání</option>
          <option value="unavailable">Není nastaveno</option>
        </select>
        <p>Počet požadavků: {calls}</p>
        <button type="button" onClick={() => finish.current?.()}>
          Dokončit čekání
        </button>
        <div className="cl-guide-copy" style={{ marginTop: 32 }}>
          <h2>Průvodce zdarma</h2>
          <GuideForm key={mode} service={service} />
        </div>
      </div>
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<FormPreview />);
