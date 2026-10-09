# Rozhodnutí

## 2026-10-09 — možnosti interaktivní funkce (návrh k výběru)

Na žádost uživatele připravené tři možnosti pro bod 6: ilustrativní roční náklad v Kč, porovnání zvolené dvojice a krátký vzdělávací kvíz. Podrobnosti a plán ověření v docs/interactive-feature.md. AI doporučuje první variantu kvůli konkrétnímu novému výsledku a návaznosti na současnou nabídku PDF. Uživatel zatím variantu nezvolil; žádná funkce není implementovaná a úkoly bodu 6 v Notion zůstávají neodškrtnuté.

## 2026-10-09 — implementace webu (pokyn uživatele)

Navazující pokyn „vezmi ten design a vytvoř web“ přijímá přepracovaný návrh pro implementaci. Návrh z MagicPath je převedený do React aplikace jako EtfLanding. Zachovaná hierarchie, paleta, mobilní porovnání a tmavá varianta. Původní návrh zůstává archivovaný v designs/magicpath/.

Čísla, názvy, indexy, dostupnost, data ověření a všech devět zdrojů se čtou ze společného src/data/etfs.json přes src/data/etfs.ts. Nepřidáváme závislosti, které návrh nepoužívá. Součástí implementace je české formátování procent a dat, favicon, titulek a popis stránky.

Formulář má validaci a předem viditelné omezení dostupnosti služby. Syntakticky platný e-mail není úspěšné doručení: aplikace výslovně říká, že nebyl uložen ani odeslán. PDF, backend a měření patří do dalších bodů. Bod 5 již byl odškrtnutý v Notion; implementace neopravňuje označit body 6, 7 nebo 11 jako celé dokončené.

Lint, TypeScript a build prošly. Browser kontrola šířek 320–1440 px, klávesnice, detailů, zdrojů a validačních stavů je popsaná v docs/design.md.

## 2026-10-09 — návrh v MagicPath a přepracování vzhledu

Uživatel požádal o bod 5 v MagicPath a odložil reklamu. Poté odsouhlasil strukturu prvního návrhu a požádal o přepracování vzhledu podle apple-design. Nový vzhled je návrh k posouzení, nikoliv dodatečně připsané schválení.

Zachované pořadí: jasný úvod, užitečné porovnání, vysvětlení, nabídka PDF a formulář, souvislosti a zdroje. Nový návrh nahrazuje tři dlouhé mobilní karty společným porovnáním, odstraňuje velkou mobilní obálku a opakované logo. Pro web používáme obecné principy Apple HIG, nikoliv nativní navigační vzory.

Podrobnosti, tokeny a ověření v docs/design.md; zdroj návrhu v designs/magicpath/. Návrh je v existujícím MagicPath projektu 459239012931100672 s desktopovým a mobilním náhledem. Formulář je výslovně označený prototyp bez ukládání a doručení. Hlavní aplikace zatím zůstává technickým základem; body 6–8 nejsou hotové.

## 2026-10-09 — výběr ETF a interpretace zadání (výběr na pokyn uživatele)

Pro vzdělávací porovnání vybrané VOO, VTI a SCHD: velké americké firmy, široký americký trh a dividendová strategie. Jde o redakční výběr pro projekt, nikoliv osobní doporučení investice. Primární zdroje a datový podklad jsou v docs/etf-research.md a src/data/etfs.json.

NYSE interpretujeme jako skupinu burz včetně NYSE Arca, ale v obsahu uvádíme přesný listing NYSE Arca. Při striktním požadavku na NYSE main market je nutné výběr přehodnotit; tato interpretace nebyla potvrzena původním zadavatelem.

Dostupnost nevyjadřujeme obecně jako ano/ne. Zdroje ČNB, IBKR a Fio ukazují závislost na brokerovi, KID, způsobu služby a konkrétním účtu. Nákup jednotlivých tickerů nebyl na klientském účtu otestován. Toto omezení bude viditelné u porovnání. Nepřidáváme CFD jako náhradu přímého vlastnictví ETF.

VTI má od 29. 7. 2026 nový název fondu a indexu; aktuální názvy ověřené právním dodatkem mají přednost před červnovým fact sheetem. Data neobsahují rychle zastarávající ceny, výnosy ani počty pozic. Bod 3 je dokončen jako výběr a prověření z veřejných zdrojů.

## 2026-10-09 — nabídka a vedení dokumentace (schváleno uživatelem)

Uživatel schválil nabídku v docs/offer.md: porovnání ETF zdarma na stránce a PDF průvodce s vysvětlením a checklistem za e-mail. O e-mail požádáme až po užitečném porovnání. Bod 2 je hotový; vytvoření PDF a doručení ještě zbývá implementovat.

Nový pokyn nahrazuje původní pravidlo zapisování podrobností do Notion: informace, návrhy, výsledky a rozhodnutí patří do projektových souborů. Notion používáme jen k odškrtávání bodů. Pravidlo promítnuto do AGENTS.md, projektových rules, README a přehledu projektu.

## 2026-10-09 — cílová skupina (schváleno uživatelem)

Varianta 2: česky mluvící člověk před prvním nákupem ETF zaměřeného na americký trh, s účtem u brokera a základní znalostí ETF. Má několik kandidátů, ale neví, podle čeho je porovnat.

Praktický obsah vysvětlí zaměření, šíři trhu, poplatky a dostupnost. Tato potřeba propojuje reklamu, porovnání a navazující obsah za e-mail.

## 2026-10-09 — vedení projektu (pokyn uživatele)

Po dokončených krocích zapisovat výsledky a stav do Notion. Udržovat README a informace o projektu. Připravit prostor pro rozšiřování skills a rules.

## 2026-10-09 — technický základ (implementační volba)

React + TypeScript + Vite s npm. Uživatel požadoval React projekt ve složce Projects. TypeScript a Vite jsou zvolené pro typovou kontrolu a jednoduchý vývojový server. Zatím bez externích služeb. Skills přidáme až podle konkrétní potřeby.

## 2026-10-09 — GitHub repozitář (pokyn uživatele)

Uživatel určil https://github.com/Myro685/ETF.git. Repozitář byl prázdný a jeho veřejná viditelnost byla ověřena přes GitHub API. Nastaven remote origin a tracking main → origin/main. Úvodní commit c5b6564 byl nahrán bez přepisování historie.
