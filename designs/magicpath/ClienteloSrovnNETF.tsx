import { useState, type FormEvent } from 'react';
import './ClienteloApple.css';
const funds = [{
  ticker: 'VOO',
  short: 'Velké firmy',
  focus: 'Velké americké společnosti',
  name: 'Vanguard S&P 500 ETF',
  index: 'S&P 500 Index',
  fee: '0,03 %',
  note: 'Výchozí pohled na velké americké firmy.',
  detail: 'Sleduje index S&P 500. Proti VTI se soustředí na velké společnosti.',
  dots: 'large',
  source: 'https://workplace.vanguard.com/assets/corp/fund_communications/pdf_publish/us-products/fact-sheet/F0968.pdf'
}, {
  ticker: 'VTI',
  short: 'Široký trh',
  focus: 'Americký trh včetně menších firem',
  name: 'Vanguard Morningstar Total Stock Market ETF',
  index: 'Morningstar US Total Market Index',
  fee: '0,03 %',
  note: 'Širší záběr při stejné nákladovosti.',
  detail: 'Zahrnuje také menší společnosti. Širší pokrytí samo o sobě neslibuje vyšší výnos.',
  dots: 'broad',
  source: 'https://workplace.vanguard.com/assets/corp/fund_communications/pdf_publish/us-products/fact-sheet/F0970.pdf'
}, {
  ticker: 'SCHD',
  short: 'Dividendy',
  focus: 'Vybrané americké dividendové firmy',
  name: 'Schwab U.S. Dividend Equity ETF',
  index: 'Dow Jones U.S. Dividend 100 Index',
  fee: '0,06 %',
  note: 'Odlišná strategie výběru společností.',
  detail: 'Vybírá dividendové firmy podle fundamentálních ukazatelů. Dividendy nezaručují vyšší celkový výnos ani menší riziko.',
  dots: 'dividend',
  source: 'https://www.schwabassetmanagement.com/products/schd'
}];
const Arrow = () => <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const Mark = () => <svg aria-hidden="true" width="30" height="30" viewBox="0 0 30 30" fill="none"><rect width="30" height="30" rx="9" fill="currentColor" /><path d="M9 9h12M9 15h8M9 21h12" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>;
const Mosaic = ({
  kind
}: {
  kind: string;
}) => <span className={'cl-mosaic ' + kind} aria-hidden="true">{Array.from({
    length: 16
  }, (_, i) => <i key={i} />)}</span>;
export const ClienteloSrovnNETF = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'invalid' | 'preview'>('idle');
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus('invalid');
      return;
    }
    setStatus('preview');
  }
  return <div className="cl-page" lang="cs">
    <a className="cl-skip" href="#cl-main">Přejít na obsah</a>
    <header className="cl-header cl-wrap">
      <a href="#cl-main" className="cl-brand" aria-label="Clientelo — úvod"><Mark />clientelo<span className="cl-brand-dot">.</span></a>
      <nav aria-label="Sekce stránky"><a href="#cl-comparison">Porovnání</a><a href="#cl-sources">Zdroje</a><a className="cl-nav-guide" href="#cl-guide">Průvodce zdarma <Arrow /></a></nav>
    </header>
    <main id="cl-main">
      <section className="cl-hero cl-wrap" aria-labelledby="cl-title">
        <div className="cl-hero-copy">
          <p className="cl-eyebrow">VOO / VTI / SCHD</p>
          <h1 id="cl-title">Než koupíte ETF,<br /><span>poznejte rozdíly.</span></h1>
          <p className="cl-lead">Tři přístupy k americkým akciím. Porovnejte zaměření a roční náklady — zdarma, bez e-mailu.</p>
          <div className="cl-hero-actions"><a className="cl-button" href="#cl-comparison">Porovnat ETF <Arrow /></a><a className="cl-secondary" href="#cl-guide">Co najdu v průvodci <span aria-hidden="true">↓</span></a></div>
        </div>
        <div className="cl-ribbon" aria-label="Rychlý přehled zaměření ETF">
          {funds.map(f => <div className="cl-ribbon-fund" key={f.ticker}><Mosaic kind={f.dots} /><div><strong>{f.ticker}</strong><span>{f.short}</span></div></div>)}
        </div>
        <p className="cl-ribbon-note">Tři pohledy na americký trh. Symboly jsou schematické.</p>
      </section>
      <section id="cl-comparison" className="cl-section cl-wrap" aria-labelledby="cl-comparison-title">
        <div className="cl-section-heading"><div><p className="cl-eyebrow">Porovnání bez e-mailu</p><h2 id="cl-comparison-title">Rozdíly na jednom místě.</h2></div><p>Ověřeno 9. 10. 2026<br /> Zdroj: dokumenty emitentů</p></div>
        <div className="cl-board"><table><caption className="cl-visually-hidden">Zaměření a roční nákladovost ETF VOO, VTI a SCHD</caption><thead><tr><th scope="col"><span>Co porovnáváme</span></th>{funds.map(f => <th key={f.ticker} scope="col"><strong>{f.ticker}</strong><span>{f.short}</span></th>)}</tr></thead><tbody>
          <tr><th scope="row">Zaměření</th><td>Velké americké firmy</td><td>Americký trh i s menšími firmami</td><td>Vybrané dividendové firmy</td></tr>
          <tr className="cl-fee-row"><th scope="row">Roční nákladovost <small>Náklad fondu</small></th>{funds.map(f => <td key={f.ticker}>{f.fee}</td>)}</tr>
          <tr><th scope="row">Burza</th>{funds.map(f => <td key={f.ticker}>NYSE Arca</td>)}</tr>
        </tbody></table></div>
        <details className="cl-fund-details"><summary>Celé názvy fondů a sledované indexy <span aria-hidden="true">+</span></summary><div className="cl-fund-detail-grid">{funds.map(f => <div key={f.ticker}><h3>{f.ticker}</h3><p>{f.name}</p><dl><dt>Sledovaný index</dt><dd>{f.index}</dd></dl><a className="cl-source-link" href={f.source} target="_blank" rel="noreferrer">{f.ticker} — zdroj emitenta ↗</a></div>)}</div></details>
        <p className="cl-cost-note">Nákladovost je roční náklad fondu. Další náklady mohou zahrnovat poplatek brokera, spread, směnu měny a daně. Údaj není prognóza výnosu.</p>
        <aside className="cl-availability"><span className="cl-info" aria-hidden="true">i</span><div><h3>Nejdřív ověřte dostupnost u brokera</h3><p>Nákup závisí na brokerovi, účtu a dokumentu KID. Konkrétní nákup VOO, VTI ani SCHD na českém retailovém účtu nebyl otestován. <a href="#cl-context">Proč na tom záleží ↓</a></p></div></aside>
      </section>
      <section className="cl-differences" aria-labelledby="cl-differences-title"><div className="cl-wrap cl-section">
        <p className="cl-eyebrow">Jak údaje číst</p><h2 id="cl-differences-title">Co si z porovnání odnést</h2>
        <div className="cl-lessons">{funds.map(f => <div key={f.ticker}><span className="cl-lesson-ticker">{f.ticker}</span><h3>{f.note}</h3><p>{f.detail}</p></div>)}</div>
        <p className="cl-neutral-note">Porovnání vysvětluje rozdíly. Neurčuje nejlepší fond pro vaši situaci.</p>
      </div></section>
      <section id="cl-guide" className="cl-section cl-wrap cl-guide" aria-labelledby="cl-guide-title">
        <div className="cl-guide-visual" aria-hidden="true"><div className="cl-book"><div className="cl-book-header">PRŮVODCE / ETF</div><div><p>Před prvním<br />nákupem.</p><svg className="cl-book-art" width="160" height="70" viewBox="0 0 160 70" fill="none"><path d="M0 60C30 60 30 10 60 10s30 50 60 50 30-50 40-50M0 45c30 0 30-20 60-20s30 20 60 20 30-20 40-20" stroke="currentColor" strokeWidth="1.5" /></svg></div><div className="cl-book-bottom"><span>VOO · VTI · SCHD</span><Arrow /></div></div><span className="cl-cover-caption">Návrh obálky PDF · kresba je dekorativní</span></div>
        <div className="cl-guide-copy"><p className="cl-eyebrow">Praktický průvodce zdarma</p><h2 id="cl-guide-title">Rozdíly si uložte.<br />Checklist vezměte s sebou.</h2><p>PDF „Průvodce porovnáním ETF před prvním nákupem“ vám pomůže vrátit se k podstatnému.</p>
          <ul className="cl-checklist"><li>Podrobnější vysvětlení rozdílů mezi fondy</li><li>Příklad pro pochopení ročních poplatků</li><li>Checklist toho, co ověřit u brokera</li></ul>
          <form noValidate onSubmit={submit} className="cl-form"><label htmlFor="cl-email">E-mail pro doručení průvodce</label><div className="cl-form-row"><input id="cl-email" type="email" autoComplete="email" inputMode="email" placeholder="vas@email.cz" value={email} onChange={e => {
                setEmail(e.target.value);
                setStatus('idle');
              }} aria-invalid={status === 'invalid'} aria-describedby="cl-form-note cl-form-status" required /><button type="submit" className="cl-button">Poslat průvodce zdarma <Arrow /></button></div>
            <div id="cl-form-status" className={'cl-form-status ' + status} role="status">{status === 'invalid' ? 'Zadejte e-mail ve tvaru jmeno@domena.cz.' : status === 'preview' ? 'Náhled potvrzení: v hotové verzi zde získáte odkaz ke stažení. V tomto návrhu se e-mail neukládá ani nic neposílá.' : ''}</div>
            <p id="cl-form-note" className="cl-form-note">E-mail bude sloužit k doručení průvodce. Vyžádání PDF vás automaticky nepřihlásí k newsletteru.</p>
          </form><p className="cl-prototype-note">Návrh formuláře · doručení PDF připravujeme.</p>
        </div>
      </section>
      <section id="cl-context" className="cl-context"><div className="cl-wrap cl-section"><p className="cl-eyebrow">Důležité souvislosti</p><h2>Ještě před nákupem</h2><div className="cl-context-grid"><div><h3>Dostupnost není automatická</h3><p>IBKR uvádí omezení retailových nákupů bez KID. Fio popisuje přístup k americkým ETF. Z toho nelze odvodit dostupnost každého tickeru na vašem účtu. Ověřte přesný instrument a oprávnění u brokera. CFD není přímé vlastnictví ETF.</p></div><div><h3>Americký trh není bez rizika</h3><p>Hodnota akciového ETF může klesnout. Počítejte také s vlivem kurzu měny. Dividendové zaměření ani širší pokrytí trhu nezaručují výnos. Tento obsah slouží ke vzdělávání, nejde o osobní investiční doporučení.</p></div></div></div></section>
      <section id="cl-sources" className="cl-section cl-wrap cl-sources" aria-labelledby="cl-sources-title"><div className="cl-source-heading"><h2 id="cl-sources-title">Údaje mají svůj zdroj.</h2><p>Ověřeno 9. 10. 2026</p></div>
        <details><summary>Fondy, burza a dostupnost <span>Rozbalit zdroje</span></summary><div className="cl-source-content"><ul>{funds.map(f => <li key={f.ticker}><a href={f.source} target="_blank" rel="noreferrer">{f.ticker} — zdroj emitenta ↗</a>{f.ticker === 'SCHD' ? <span>Datum účinnosti poplatku neuvedeno; ověřeno 9. 10. 2026.</span> : <span>Fact sheet k 30. 6. 2026; ověřeno 9. 10. 2026.</span>}</li>)}<li><a href="https://www.sec.gov/Archives/edgar/data/36405/000003640526000386/f45788d1.htm" target="_blank" rel="noreferrer">VTI — dodatek k názvu fondu a indexu ↗</a><span>Účinný od 29. 7. 2026. Červnový fact sheet používá původní název.</span></li><li><a href="https://www.nyse.com/regulation/exchange-traded-products" target="_blank" rel="noreferrer">NYSE — burzy a ETF ↗</a><span>NYSE Arca je samostatná burza skupiny NYSE, nikoliv NYSE main market.</span></li><li><a href="https://www.cnb.cz/cs/dohled-financni-trh/legislativni-zakladna/stanoviska-k-regulaci-financniho-trhu/RS2018-12/" target="_blank" rel="noreferrer">ČNB — PRIIPs, část B.2 ↗</a></li><li><a href="https://www.interactivebrokers.com/campus/trading-lessons/us-taxes-for-us-non-residents-3/" target="_blank" rel="noreferrer">IBKR — odpověď k omezením bez KID ↗</a><span>Odpověď z 19. 11. 2025; ověřeno 9. 10. 2026.</span></li><li><a href="https://www.fio.cz/akcie-investice/etf" target="_blank" rel="noreferrer">Fio — přístup k americkým ETF ↗</a></li></ul></div></details>
        <p className="cl-cost-note">Před nákupem ověřte aktuální dokumenty a náklady. Zobrazené údaje nenahrazují dokumentaci fondu ani ověření konkrétního účtu.</p>
      </section>
    </main>
    <footer className="cl-footer cl-wrap"><span>© 2026 Clientelo</span><p>Rozumět rozdílům je dobrý začátek.</p><span>Vzdělávací porovnání ETF</span></footer>
  </div>;
};
