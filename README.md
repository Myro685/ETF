# Clientelo

Mobilní stránka pro srozumitelné porovnání ETF zaměřených na americký trh. Pomůže návštěvníkovi pochopit rozdíly mezi fondy a nabídne mu užitečný doplňující obsah výměnou za e-mail.

## Aktuální stav

- Schválená cílová skupina a hlavní problém (bod 1).
- Vytvořený základ React + TypeScript + Vite a jednoduchá česká úvodní stránka.
- Připravené instrukce pro AI, projektová pravidla, místo pro skills a dokumentace.
- Veřejný repozitář [Myro685/ETF](https://github.com/Myro685/ETF), větev main napojená na origin/main; úvodní commit nahraný.
- Další krok: rozhodnout, co nabídneme zdarma a co navíc po zadání e-mailu (bod 2).
- Termín odevzdání: **16. října 2026**.

Zdroj zadání a průběžného stavu: [Clientelo projekt v Notion](https://app.notion.com/p/3f4e1942c8af80ddacf7c7b070dea863).

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
| ai-log/ | Záznam spolupráce s AI a budoucí exporty |

Po dokončeném kroku aktualizujeme README, příslušnou dokumentaci a Notion. Návrhy odlišujeme od schválených rozhodnutí. Práci ukládáme průběžnými commity.

## Data, služby a měření

Konkrétní ETF ani služby zatím nejsou vybrané. Nejsou potřeba žádné proměnné prostředí. Při doplnění služeb vytvoříme .env.example pouze s názvy proměnných a bezpečnými příklady. Tajné klíče a kontakty návštěvníků nepatří do repozitáře.

Před zveřejněním údajů ověříme zdroje a datum platnosti, NYSE versus NYSE Arca a dostupnost pro českého drobného investora. Očekávanou konverzi a tři hypotézy pro A/B testování doplníme po návrhu nabídky a stránky. Skutečná konverze zatím není změřená.

## Spolupráce s AI

Používáme Codex. AI dostala pokyn načíst Notion, navrhnout tři cílové skupiny, průběžně zapisovat hotovou práci a vytvořit React projekt s dokumentací. Uživatel schválil druhou variantu.

Obsah kontrolujeme proti zadání a schváleným rozhodnutím, zápisy do Notion zpětným načtením a technické změny odpovídajícími kontrolami. Postup a omezení jsou v ai-log/. Dosavadní souhrn není úplný export konverzace; ten je ještě nutné dodat.

## Co zbývá

Body 2–12: nabídka, ověřená ETF data, dvě reklamy, obsah a vzhled, interaktivní funkce, ukládání kontaktů a doručení obsahu, měření, doplnění README, úplné AI exporty, hosting a odevzdání. Úvodní stránka je základ projektu; formulář ani porovnávač zatím nejsou implementované.


## Ověření základu (2026-10-09)

- npm run lint: úspěšné.
- npm run build: úspěšné, včetně kontroly TypeScriptu.
- npm install: audit hlásil 0 zranitelností při instalaci.
- Git repozitář na větvi main je propojený s https://github.com/Myro685/ETF.git. Úvodní commit c5b6564 je nahraný; hosting zatím není založený.
- Vizuální a koncové testy finální stránky budou provedené při její implementaci.
