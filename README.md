# Clientelo

Mobilní stránka pro srozumitelné porovnání ETF zaměřených na americký trh. Pomůže návštěvníkovi pochopit rozdíly mezi fondy a nabídne mu užitečný doplňující obsah výměnou za e-mail.

## Aktuální stav

- Schválená cílová skupina a hlavní problém (bod 1).
- Vytvořený základ React + TypeScript + Vite a jednoduchá česká úvodní stránka.
- Připravené instrukce pro AI, projektová pravidla, místo pro skills a dokumentace.
- Veřejný repozitář [Myro685/ETF](https://github.com/Myro685/ETF), větev main napojená na origin/main; úvodní commit nahraný.
- Schválená nabídka (bod 2): porovnání zdarma a PDF průvodce s checklistem za e-mail; formulář až po porovnání. Podrobnosti v [docs/offer.md](docs/offer.md).
- Bod 3 hotový: pro vzdělávací porovnání vybrané VOO, VTI a SCHD. Data a zdroje v [src/data/etfs.json](src/data/etfs.json), zdůvodnění a omezení v [docs/etf-research.md](docs/etf-research.md).
- Bod 5: obsah a responzivní návrh vytvořené v MagicPath, vzhled přepracovaný podle apple-design. Struktura je odsouhlasená; nový vzhled připravený k posouzení. Specifikace v [docs/design.md](docs/design.md), podklady v designs/magicpath/. Návrh zatím není zapojený do aplikace.
- Reklamy (bod 4) odložené na pokyn uživatele. Následuje přenos návrhu do aplikace a bod 6.
- Termín odevzdání: **16. října 2026**.

Zadání bylo načteno z [Clientelo projektu v Notion](https://app.notion.com/p/3f4e1942c8af80ddacf7c7b070dea863). Notion nyní slouží pouze k odškrtávání bodů. Aktuální informace, rozhodnutí a podrobnosti řešení vedeme v tomto repozitáři.

## Cílová skupina

Česky mluvící člověk před prvním nákupem ETF zaměřeného na americký trh. Už má účet u brokera a ví, že ETF může obsahovat akcie mnoha společností. Chce dlouhodobě investovat do amerického trhu, ale našel několik podobně vypadajících fondů. Na reklamu klikne kvůli přehlednému srovnání jejich rozdílů.

**Hlavní problém:** Má několik kandidátů, ale neví, podle čeho je porovnat.

**Jazyk a obsah:** Stručný, praktický tón. Srovnání zaměření, šíře trhu a ročních poplatků, doplněné informací o dostupnosti pro českého drobného investora. Každý údaj dostane krátké vysvětlení, proč při porovnání záleží.

## Spuštění

Použij Node.js 24 LTS a npm. Závislosti jsou zachycené v package-lock.json.

```powershell
cd C:\Users\miros\Projects\clientelo
npm ci
npm run dev
```

Vite vypíše místní adresu vývojového serveru.

```powershell
npm run lint
npm run build
npm run preview
```

Build provede kontrolu TypeScriptu a sestaví aplikaci do dist/. Preview slouží k místní kontrole sestavené aplikace.

## Struktura

| Umístění | Účel |
| --- | --- |
| src/ | React aplikace a styly |
| AGENTS.md | Vstupní instrukce pro AI |
| .agents/rules/project.md | Pravidla implementace a dokumentace |
| .agents/skills/ | Budoucí projektové skills |
| docs/project.md | Zadání, priority a stav všech bodů |
| docs/decisions.md | Rozhodnutí a jejich důvody |
| docs/offer.md | Schválená nabídka výměnou za e-mail |
| docs/etf-research.md | Výběr ETF, primární zdroje, burza a dostupnost |
| docs/design.md | Obsah, pořadí sekcí, design tokeny a kontrola návrhu |
| designs/magicpath/ | Uložené TSX a CSS návrhu v MagicPath |
| src/data/etfs.json | Ověřená data ETF a odkazy na zdroje |
| ai-log/ | Záznam spolupráce s AI a budoucí exporty |

Po dokončeném kroku aktualizujeme README a příslušnou dokumentaci; v Notion pouze odškrtneme splněné body. Návrhy odlišujeme od schválených rozhodnutí. Práci ukládáme průběžnými commity.

## Data, služby a měření

ETF pro porovnání: **VOO (0,03 %), VTI (0,03 %) a SCHD (0,06 %)** roční zveřejněné nákladovosti fondu. Nejde o celkové náklady investora. Všechny mají listing na **NYSE Arca**, která je samostatnou burzou skupiny NYSE; striktní NYSE main market výběr nesplňuje. Data ověřena 9. 10. 2026, včetně oddělených dat zdrojových dokumentů. Úplné zdroje a interpretace jsou v docs/etf-research.md a src/data/etfs.json.

Dostupnost pro český retail je **podmíněná podle brokera a účtu**: IBKR uvádí omezení bez KID, Fio umožňuje přístup k americkým ETF a ČNB rozlišuje execution-only přístup. Konkrétní nákup jednotlivých tickerů na klientském účtu nebyl otestován. Tuto informaci zobrazíme přímo u porovnání; nebudeme slibovat nákup u každého brokera. VTI používá aktuální název Vanguard Morningstar Total Stock Market ETF a Morningstar US Total Market Index, účinné od 29. 7. 2026.

Externí služby zatím nejsou vybrané. Nejsou potřeba žádné proměnné prostředí. Při doplnění služeb vytvoříme .env.example pouze s názvy proměnných a bezpečnými příklady. Tajné klíče a kontakty návštěvníků nepatří do repozitáře.

Před spuštěním zopakujeme kontrolu nákladovosti a dostupnosti. Očekávanou konverzi a tři hypotézy pro A/B testování doplníme po návrhu stránky. Skutečná konverze zatím není změřená.

## Spolupráce s AI

Používáme Codex. AI dostala pokyn načíst Notion, navrhnout tři cílové skupiny, průběžně zapisovat hotovou práci a vytvořit React projekt s dokumentací. Uživatel schválil druhou variantu.

Obsah kontrolujeme proti zadání a schváleným rozhodnutím, zápisy do Notion zpětným načtením a technické změny odpovídajícími kontrolami. Postup a omezení jsou v ai-log/. Dosavadní souhrn není úplný export konverzace; ten je ještě nutné dodat.

## Co zbývá

Zbývá přenos návrhu do React aplikace, bod 6 (interaktivní funkce), ukládání kontaktů a doručení PDF, měření, dvě odložené reklamy a body 9–12. Nabídka je schválená a výběr ETF prověřený. MagicPath formulář je pouze ukázka, PDF a jeho doručení ještě zbývá vytvořit. Produkční aplikace stále obsahuje původní úvodní stránku.


## Ověření základu (2026-10-09)

- npm run lint: úspěšné.
- npm run build: úspěšné, včetně kontroly TypeScriptu.
- npm install: audit hlásil 0 zranitelností při instalaci.
- Git repozitář na větvi main je propojený s https://github.com/Myro685/ETF.git. Úvodní commit c5b6564 je nahraný; hosting zatím není založený.
- Vizuální a koncové testy finální stránky budou provedené při její implementaci.
