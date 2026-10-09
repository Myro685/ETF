# Clientelo

Mobilní stránka pro srozumitelné porovnání ETF zaměřených na americký trh. Pomůže návštěvníkovi pochopit rozdíly mezi fondy a nabídne mu užitečný doplňující obsah výměnou za e-mail.

## Aktuální stav

- Schválená cílová skupina a hlavní problém (bod 1).
- Implementovaná responzivní stránka v React + TypeScript + Vite podle přepracovaného návrhu MagicPath: porovnání, vysvětlení, nabídka PDF a zdroje.
- Připravené instrukce pro AI, projektová pravidla, místo pro skills a dokumentace.
- Veřejný repozitář [Myro685/ETF](https://github.com/Myro685/ETF), větev main napojená na origin/main; úvodní commit nahraný.
- Schválená nabídka (bod 2): porovnání zdarma a PDF průvodce s checklistem za e-mail; formulář až po porovnání. Podrobnosti v [docs/offer.md](docs/offer.md).
- Bod 3 hotový: pro vzdělávací porovnání vybrané VOO, VTI a SCHD. Data a zdroje v [src/data/etfs.json](src/data/etfs.json), zdůvodnění a omezení v [docs/etf-research.md](docs/etf-research.md).
- Bod 5 hotový; na navazující pokyn uživatele převedený návrh podle apple-design do aplikace. Specifikace a ověření v [docs/design.md](docs/design.md), původní podklady v designs/magicpath/.
- Bod 6 hotový: na přání uživatele implementovaná kalkulačka ročního nákladu v Kč a tříotázkový kvíz. [Popis a ověření funkcí](docs/interactive-feature.md). Reklamy (bod 4) zůstávají odložené.
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
npm run test
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
| src/data/etfs.ts | Typované použití dat, české formátování a vysvětlující texty |
| src/components/ | Stránka EtfLanding, seznam zdrojů a responzivní styly |
| ai-log/ | Záznam spolupráce s AI a budoucí exporty |

Po dokončeném kroku aktualizujeme README a příslušnou dokumentaci; v Notion pouze odškrtneme splněné body. Návrhy odlišujeme od schválených rozhodnutí. Práci ukládáme průběžnými commity.

## Data, služby a měření

ETF pro porovnání: **VOO (0,03 %), VTI (0,03 %) a SCHD (0,06 %)** roční zveřejněné nákladovosti fondu. Nejde o celkové náklady investora. Všechny mají listing na **NYSE Arca**, která je samostatnou burzou skupiny NYSE; striktní NYSE main market výběr nesplňuje. Data ověřena 9. 10. 2026, včetně oddělených dat zdrojových dokumentů. Úplné zdroje a interpretace jsou v docs/etf-research.md a src/data/etfs.json.

Dostupnost pro český retail je **podmíněná podle brokera a účtu**: IBKR uvádí omezení bez KID, Fio umožňuje přístup k americkým ETF a ČNB rozlišuje execution-only přístup. Konkrétní nákup jednotlivých tickerů na klientském účtu nebyl otestován. Tuto informaci zobrazujeme přímo u porovnání. VTI používá aktuální název Vanguard Morningstar Total Stock Market ETF a Morningstar US Total Market Index, účinné od 29. 7. 2026.

Externí služby zatím nejsou vybrané. Formulář kontroluje formát e-mailu, ale nic neukládá ani neodesílá; omezení je viditelné před zadáním e-mailu i po odeslání. PDF zatím není vytvořené. Aplikace nepoužívá analytiku ani úložiště pro kontakty. Nejsou potřeba žádné proměnné prostředí. Při doplnění služeb vytvoříme .env.example pouze s názvy proměnných a bezpečnými příklady. Tajné klíče a kontakty návštěvníků nepatří do repozitáře.

Před spuštěním zopakujeme kontrolu nákladovosti a dostupnosti. Očekávanou konverzi a tři hypotézy pro A/B testování doplníme po návrhu stránky. Skutečná konverze zatím není změřená.

## Spolupráce s AI

Používáme Codex. AI dostala pokyn načíst Notion, navrhnout tři cílové skupiny, průběžně zapisovat hotovou práci a vytvořit React projekt s dokumentací. Uživatel schválil druhou variantu.

Obsah kontrolujeme proti zadání a schváleným rozhodnutím, zápisy do Notion zpětným načtením a technické změny odpovídajícími kontrolami. Postup a omezení jsou v ai-log/. Dosavadní souhrn není úplný export konverzace; ten je ještě nutné dodat.

## Co zbývá

Zbývá vytvoření PDF, ukládání kontaktů a doručení (bod 7), měření, dvě odložené reklamy a dokončení bodů 9–12. Frontend včetně kalkulačky a kvízu je implementovaný; veřejný hosting a celý proces získání průvodce ještě nejsou hotové.


## Ověření webu (2026-10-09)

- npm run lint: úspěšné.
- npm run test: úspěšné; nezávislé výsledky kalkulačky, české vstupy a všech 8 kombinací odpovědí kvízu. Nativní test runner Node.js 24, bez nové závislosti.
- npm run build: úspěšné, včetně kontroly TypeScriptu.
- npm install: audit hlásil 0 zranitelností při instalaci.
- Git repozitář na větvi main je propojený s https://github.com/Myro685/ETF.git; hosting zatím není založený.
- Browser kontrola při 320, 390, 768 a 1 440 px: bez vodorovného přetékání i s rozbalenými názvy a zdroji.
- Ověřené kotvy, rozbalení detailů, všech 9 zdrojů, poplatky z JSON, klávesnice a viditelný focus, prázdný i platný e-mail. Platný e-mail zobrazí dostupnost služby, nikoliv úspěšné doručení.
- Tmavá varianta vizuálně zkontrolovaná; konzole bez zachycených chyb a varování. Zvětšení 200 % a plný test screen readeru zbývají. Doručení PDF nelze koncově otestovat před bodem 7.
