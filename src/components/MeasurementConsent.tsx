import { useEffect, useState } from "react";
import { measurement } from "../services/analytics";
import "./MeasurementConsent.css";

export function MeasurementConsent() {
  const [open, setOpen] = useState(() => measurement().preference() === null);
  useEffect(() => {
    const analytics = measurement();
    const preference = analytics.preference();
    analytics.start(preference === true);
    // Also apply a preference changed in another tab.
    const sync = () => { const next = analytics.preference(); analytics.start(next === true); setOpen(next === null); };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function choose(allowed: boolean) {
    measurement().choose(allowed);
    setOpen(false);
  }
  return <>
    <button className="cl-measure-settings" type="button" onClick={() => setOpen(true)}>Nastavení měření</button>
    {open && <aside className="cl-measure-consent" aria-labelledby="cl-measure-title">
      <h2 id="cl-measure-title">Pomůžete nám zlepšit porovnání?</h2>
      <p>S vaším souhlasem změříme návštěvu, použití nástrojů a cestu k průvodci. Bez e-mailu, částek nebo odpovědí v kvízu. Volbu můžete kdykoli změnit v patičce.</p>
      <a href="/ochrana-udaju.html#mereni">Podrobnosti o měření</a>
      <div className="cl-measure-actions">
        <button type="button" onClick={() => choose(false)}>Bez měření</button>
        <button type="button" onClick={() => choose(true)}>Povolit měření</button>
      </div>
    </aside>}
  </>;
}
