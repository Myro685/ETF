import { useState } from "react";
import { funds, etfData, formatDate } from "../data/etfs";
import { annualFundCost, formatCurrency, parseAmount } from "../utils/costs";
import "./InteractiveTools.css";

export function CostCalculator() {
  const [input, setInput] = useState("100 000");
  const { value, error } = parseAmount(input);
  const costs =
    value === null
      ? []
      : funds.map((fund) => ({
          ...fund,
          cost: annualFundCost(value, fund.expenseRatioPercent),
        }));
  const difference = costs.length
    ? Math.max(...costs.map((f) => f.cost)) -
      Math.min(...costs.map((f) => f.cost))
    : 0;
  return (
    <section
      id="cl-calculator"
      className="cl-section cl-wrap"
      aria-labelledby="cl-calculator-title"
    >
      <p className="cl-eyebrow">Vyzkoušejte si • bez e-mailu</p>
      <h2 id="cl-calculator-title">Malé procento. Konkrétní částka.</h2>
      <p className="cl-tool-lead">
        Zadejte hodnotu investice a porovnejte orientační roční náklad fondů v
        korunách.
      </p>
      <div className="cl-calculator-panel">
        <div className="cl-amount-controls">
          <label htmlFor="cl-amount">Ilustrativní hodnota investice v Kč</label>
          <input
            id="cl-amount"
            type="text"
            inputMode="decimal"
            maxLength={30}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            aria-invalid={value === null}
            aria-describedby="cl-amount-help cl-amount-error"
          />
          <p id="cl-amount-help">
            Od 0 do 1 miliardy Kč. Lze použít desetinnou čárku.
          </p>
          <div className="cl-presets" aria-label="Ukázkové částky">
            {[10_000, 100_000, 1_000_000].map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setInput(amount.toLocaleString("cs-CZ"))}
                aria-pressed={value === amount}
              >
                {amount.toLocaleString("cs-CZ")} Kč
              </button>
            ))}
          </div>
          <p id="cl-amount-error" role="status" className="cl-tool-error">
            {error}
          </p>
        </div>
        <div
          className="cl-calculator-result"
          aria-live="polite"
          aria-atomic="true"
        >
          {value === null ? (
            <p className="cl-result-empty">
              Po zadání platné částky se zobrazí porovnání.
            </p>
          ) : (
            <>
              <p>
                Orientační náklad za rok při hodnotě {formatCurrency(value)}
              </p>
              <dl className="cl-cost-values">
                {costs.map((fund) => (
                  <div key={fund.ticker}>
                    <dt>
                      {fund.ticker}
                      <span>{fund.fee} ročně</span>
                    </dt>
                    <dd>{formatCurrency(fund.cost)}</dd>
                  </div>
                ))}
              </dl>
              <p className="cl-cost-difference">
                Rozdíl nejvyššího a nejnižšího nákladu:{" "}
                <strong>{formatCurrency(difference)} za rok.</strong>
              </p>
              <p className="cl-cost-insight">
                VOO a VTI mají stejnou nákladovost, ale odlišné pokrytí trhu.
                Samotný poplatek neurčuje vhodný fond.
              </p>
            </>
          )}
        </div>
      </div>
      <p className="cl-tool-note">
        Model počítá s konstantní hodnotou investice po celý rok. Náklad je
        promítnutý do hodnoty fondu, není samostatnou fakturou. Nezahrnuje
        brokera, spread, směnu ani daně a nepředpovídá výnos. Výsledky jsou
        zaokrouhlené na haléře.
      </p>
      <p className="cl-tool-note">
        Sazby ověřené{" "}
        <time dateTime={etfData.verifiedOn}>
          {formatDate(etfData.verifiedOn)}
        </time>
        . <a href="#cl-sources">Zdroje údajů</a>
      </p>
      <a href="#cl-guide" className="cl-tool-link">
        Jak náklady číst? Podívejte se, co bude v průvodci →
      </a>
    </section>
  );
}
