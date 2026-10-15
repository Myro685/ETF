import {
  ArrowRightIcon,
  ArrowDownIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@radix-ui/react-icons";
import { etfData, funds, formatDate } from "../data/etfs";
import { SourceList } from "./SourceList";
import { CostCalculator } from "./CostCalculator";
import { EtfQuiz } from "./EtfQuiz";
import { GuideForm } from "./GuideForm";
import { MeasurementConsent } from "./MeasurementConsent";
import { measurement } from "../services/analytics";
import "./EtfLanding.css";
import { MarketSculpture } from "./MarketSculpture";
import "./Atlas.css";
const Arrow = () => <ArrowRightIcon aria-hidden="true" width={20} height={20} />;
export const EtfLanding = () => {
  return (
    <div className="cl-page" lang="cs" onClickCapture={event => {
      if ((event.target as HTMLElement).closest('a[href="#cl-guide"]')) void measurement().track("guide_cta");
    }}>
      <a className="cl-skip" href="#cl-main">
        Přejít na obsah
      </a>
      <header className="cl-header cl-wrap">
        <a href="#cl-main" className="cl-brand" aria-label="Clientelo: úvod">
          clientelo<span className="cl-brand-dot">.</span>
        </a>
        <nav aria-label="Sekce stránky">
          <a href="#cl-comparison">Porovnání</a>
          <a href="#cl-calculator">Kalkulačka</a>
          <a href="#cl-sources">Zdroje</a>
          <a className="cl-nav-guide" href="#cl-guide">
            Průvodce zdarma <Arrow />
          </a>
        </nav>
      </header>
      <main id="cl-main">
        <section className="cl-hero cl-wrap" aria-labelledby="cl-title">
          <div className="cl-hero-copy">
            <h1 id="cl-title">
              Než koupíte ETF,
              <br />
              <span>poznejte rozdíly.</span>
            </h1>
            <p className="cl-lead">
              Porovnejte zaměření a roční nákladovost tří ETF. V kalkulačce
              uvidíte orientační náklad v Kč. Zdarma, bez e-mailu.
            </p>
            <div className="cl-hero-actions">
              <a className="cl-button" href="#cl-comparison">
                Porovnat ETF <Arrow />
              </a>
              <a className="cl-secondary" href="#cl-calculator">
                Porovnat náklady v Kč <ArrowDownIcon aria-hidden="true" />
              </a>
            </div>
          </div>
          <MarketSculpture />
        </section>
        <section
          id="cl-comparison"
          className="cl-section cl-wrap"
          aria-labelledby="cl-comparison-title"
        >
          <div className="cl-section-heading">
            <div>
              <h2 id="cl-comparison-title">Rozdíly na jednom místě.</h2>
            </div>
            <p>
              Ověřeno{" "}
              <time dateTime={etfData.verifiedOn}>
                {formatDate(etfData.verifiedOn)}
              </time>
              <br /> Zdroj: dokumenty emitentů
            </p>
          </div>
          <div className="cl-board">
            <table>
              <caption className="cl-visually-hidden">
                Zaměření a roční nákladovost ETF VOO, VTI a SCHD
              </caption>
              <thead>
                <tr>
                  <th scope="col">
                    <span>Co porovnáváme</span>
                  </th>
                  {funds.map((f) => (
                    <th key={f.ticker} scope="col">
                      <strong>{f.ticker}</strong>
                      <span>{f.short}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Zaměření</th>
                  {funds.map((f) => (
                    <td key={f.ticker}>{f.focusCs}</td>
                  ))}
                </tr>
                <tr className="cl-fee-row">
                  <th scope="row">
                    Roční nákladovost <small>Náklad fondu</small>
                  </th>
                  {funds.map((f) => (
                    <td key={f.ticker}>{f.fee}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Burza</th>
                  {funds.map((f) => (
                    <td key={f.ticker}>{f.exchange}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <details className="cl-fund-details">
            <summary>
              Celé názvy fondů a sledované indexy{" "}
              <span className="cl-expand-icon" aria-hidden="true">
                <ChevronDownIcon />
              </span>
            </summary>
            <div className="cl-fund-detail-grid">
              {funds.map((f) => (
                <div key={f.ticker}>
                  <h3>{f.ticker}</h3>
                  <p>{f.name}</p>
                  <dl>
                    <dt>Sledovaný index</dt>
                    <dd>{f.benchmark}</dd>
                  </dl>
                  <a
                    className="cl-source-link"
                    href={f.source.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {f.ticker}: zdroj emitenta
                  </a>
                </div>
              ))}
            </div>
          </details>
          <p className="cl-cost-note">
            Nákladovost je roční náklad fondu. Další náklady mohou zahrnovat
            poplatek brokera, spread, směnu měny a daně. Údaj není prognóza
            výnosu.
          </p>
          <aside className="cl-availability">
            <span className="cl-info" aria-hidden="true">
              i
            </span>
            <div>
              <h3>Nejdřív ověřte dostupnost u brokera</h3>
              <p>
                Nákup závisí na brokerovi, účtu a dokumentu KID (sdělení
                klíčových informací). Konkrétní nákup{" "}
                {funds.map((f) => f.ticker).join(", ")} na českém retailovém
                účtu nebyl otestován.{" "}
                <a href="#cl-context">Proč na tom záleží</a>
              </p>
            </div>
          </aside>
        </section>
        <CostCalculator />
        <section
          className="cl-differences"
          aria-labelledby="cl-differences-title"
        >
          <div className="cl-wrap cl-section">
            <h2 id="cl-differences-title">Co si z porovnání odnést</h2>
            <div className="cl-lessons">
              {funds.map((f) => (
                <div key={f.ticker}>
                  <span className="cl-lesson-ticker">{f.ticker}</span>
                  <h3>{f.note}</h3>
                  <p>{f.detail}</p>
                </div>
              ))}
            </div>
            <p className="cl-neutral-note">
              Porovnání vysvětluje rozdíly. Neurčuje nejlepší fond pro vaši
              situaci.
            </p>
          </div>
        </section>
        <EtfQuiz />
        <section
          id="cl-guide"
          className="cl-section cl-wrap cl-guide"
          aria-labelledby="cl-guide-title"
        >
          <div className="cl-guide-visual" aria-hidden="true">
            <div className="cl-book">
              <div className="cl-book-header">PRŮVODCE / ETF</div>
              <div>
                <p>
                  Před prvním
                  <br />
                  nákupem.
                </p>
              </div>
              <div className="cl-book-bottom">
                <span>VOO · VTI · SCHD</span>
                <Arrow />
              </div>
            </div>
            <span className="cl-cover-caption">
              Návrh obálky PDF · kresba je dekorativní
            </span>
          </div>
          <div className="cl-guide-copy">
            <h2 id="cl-guide-title">
              Rozdíly si uložte.
              <br />
              Checklist vezměte s sebou.
            </h2>
            <p>
              PDF „Průvodce porovnáním ETF před prvním nákupem“ vám pomůže
              vrátit se k podstatnému.
            </p>
            <ul className="cl-checklist">
              <li><CheckIcon aria-hidden="true" />Podrobnější vysvětlení rozdílů mezi fondy</li>
              <li><CheckIcon aria-hidden="true" />Příklad pro pochopení ročních poplatků</li>
              <li><CheckIcon aria-hidden="true" />Checklist toho, co ověřit u brokera</li>
            </ul>
            <GuideForm />
          </div>
        </section>
        <section id="cl-context" className="cl-context">
          <div className="cl-wrap cl-section">
            <h2>Ještě před nákupem</h2>
            <div className="cl-context-grid">
              <div>
                <h3>Dostupnost není automatická</h3>
                <p>{etfData.availability.explanationCs}</p>
              </div>
              <div>
                <h3>Americký trh není bez rizika</h3>
                <p>
                  Hodnota akciového ETF může klesnout. Počítejte také s vlivem
                  kurzu měny. Dividendové zaměření ani širší pokrytí trhu
                  nezaručují výnos. Tento obsah slouží ke vzdělávání, nejde o
                  osobní investiční doporučení.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="cl-sources"
          className="cl-section cl-wrap cl-sources"
          aria-labelledby="cl-sources-title"
        >
          <div className="cl-source-heading">
            <h2 id="cl-sources-title">Údaje mají svůj zdroj.</h2>
            <p>
              Ověřeno{" "}
              <time dateTime={etfData.verifiedOn}>
                {formatDate(etfData.verifiedOn)}
              </time>
            </p>
          </div>
          <details>
            <summary>
              Fondy, burza a dostupnost <span>Rozbalit zdroje</span>
            </summary>
            <SourceList />
          </details>
          <p className="cl-cost-note">
            Před nákupem ověřte aktuální dokumenty a náklady. Zobrazené údaje
            nenahrazují dokumentaci fondu ani ověření konkrétního účtu.
          </p>
        </section>
      </main>
      <footer className="cl-footer cl-wrap">
        <span>© 2026 Clientelo</span>
        <p>Rozumět rozdílům je dobrý začátek.</p>
        <span>Vzdělávací porovnání ETF</span>
        <MeasurementConsent />
      </footer>
    </div>
  );
};
