# Clientelo

Veřejná stránka: https://etf-gold.vercel.app/ (Vercel Hobby). Frontend a PDF ověřené bez přihlášení 15. 10. 2026. Uživatel zvolil ukázku pro hodnocení: formulář je aktivní v demo režimu a přijímá pouze testovací adresu správce; [nasazení a ověření](docs/deployment.md).

Mobilní stránka pro srozumitelné porovnání ETF zaměřených na americký trh. Pomůže návštěvníkovi pochopit rozdíly mezi fondy a nabídne mu užitečný doplňující obsah výměnou za e-mail.

## Aktuální stav

- **Jemné animace (2026-10-11):** jednorázové vysunutí 3D bloků, 50ms stagger, 650 ms na blok, celkem 1,35 s. Hover barvy a šipky 160 ms, stisk 140 ms; omezení pohybu a okamžité klávesové ovládání respektované. [Specifikace a ověření](docs/motion.md).

- Odkazy mezi sekcemi používají nativní smooth scrolling; při systémovém omezení pohybu zůstává okamžitý přesun.
- **Design přepracovaný přímo v Reactu (2026-10-11)** podle emil-design-eng, design-taste-frontend a impeccable: Manrope, zelenobílá paleta, nový úvod, kalkulačka a jednotné ovládání. Skutečná Three.js studie a API formuláře zachované. [Aktuální návrh a ověření](docs/design-2026-10-11.md); Atlas a MagicPath jsou historické podklady v [docs/design-atlas.md](docs/design-atlas.md).
- Schválená cílová skupina a hlavní problém (bod 1).
- Implementovaná responzivní stránka v React + TypeScript + Vite podle přepracovaného návrhu MagicPath: porovnání, vysvětlení, nabídka PDF a zdroje.
- Připravené instrukce pro AI, projektová pravidla, místo pro skills a dokumentace.
- Veřejný repozitář [Myro685/ETF](https://github.com/Myro685/ETF), větev main napojená na origin/main; úvodní commit nahraný.
- Schválená nabídka (bod 2): porovnání zdarma a PDF průvodce s checklistem za e-mail; formulář až po porovnání. Podrobnosti v [docs/offer.md](docs/offer.md).
- Bod 3 hotový: pro vzdělávací porovnání vybrané VOO, VTI a SCHD. Data a zdroje v [src/data/etfs.json](src/data/etfs.json), zdůvodnění a omezení v [docs/etf-research.md](docs/etf-research.md).
- Bod 5 hotový; aktuální přepracování v [docs/design-2026-10-11.md](docs/design-2026-10-11.md), historie struktury v [docs/design.md](docs/design.md).
- Bod 4 hotový jako příprava návrhů: [dvě textové reklamy](docs/ads.md) s nadpisem a CTA, zaměřené na rozdíly fondů a náklady v Kč. Úvod stránky navazuje na oba sliby; kampaň není spuštěná a návrhy čekají na posouzení uživatelem.
- Bod 6 hotový: na přání uživatele implementovaná kalkulačka ročního nákladu v Kč a tříotázkový kvíz. [Popis a ověření funkcí](docs/interactive-feature.md).
- Bod 7 rozpracovaný: formulář s validačními a síťovými stavy, ochranou proti dvojkliku a připraveným Supabase/Resend API. [Nastavení a zbývající kroky](docs/form.md). Čtyřstránkové PDF je hotové; správce a kontakt jsou známé. Uživatel nyní volí Gmail API bez vlastní domény; Gmail OAuth propojené, obnovení tokenu ověřené a serverový transport implementovaný; Uživatel potvrdil příjem jedné schválené testovací zprávy; otevření PDF z e-mailu zatím výslovně nepotvrdil. Supabase API je připojené a veřejné PDF ověřené. Zbývají ověření retence, finální informace o zpracování a skutečný koncový test. [Propojení Gmailu](docs/gmail-setup.md). [Aktivace](docs/guide-activation.md).
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

Pro formulář spusť ve druhém terminálu také `npm run dev:api`. API běží místně na portu 5174, Vite jej předává pod /api. Nastavení podle .env.example patří do ignorovaného .env.local. Bez nastavení zůstává formulář v režimu místní kontroly e-mailu. npm run preview spouští pouze statický frontend.

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
| .agents/skills/ | Nainstalované projektové skilly pro Codex |
| docs/project.md | Zadání, priority a stav všech bodů |
| docs/decisions.md | Rozhodnutí a jejich důvody |
| docs/offer.md | Schválená nabídka výměnou za e-mail |
| docs/ads.md | Dvě verze reklamy, návaznost stránky a plán rozlišení v bodu 8 |
| docs/etf-research.md | Výběr ETF, primární zdroje, burza a dostupnost |
| docs/design.md | Obsah, pořadí sekcí, design tokeny a kontrola návrhu |
| docs/design-atlas.md | Nový návrh Atlas, 3D studie, ověření a stav MagicPath |
| docs/form.md | Stav formuláře, serverové napojení, konfigurace a limity testů |
| server/ a api/ | Místní API a připravené serverless handlery |
| supabase/001-guide.sql | Schéma kontaktů, žádostí, oprávnění a výmaz |
| designs/magicpath/ | Uložené TSX a CSS návrhu v MagicPath |
| src/data/etfs.json | Ověřená data ETF a odkazy na zdroje |
| src/data/etfs.ts | Typované použití dat, české formátování a vysvětlující texty |
| src/components/ | Stránka EtfLanding, seznam zdrojů a responzivní styly |
| src/components/Atlas.css, MarketSculpture.tsx a marketScene.ts | Vzhled Atlas a samostatně načítaná 3D scéna |
| ai-log/ | Záznam spolupráce s AI a budoucí exporty |

Po dokončeném kroku aktualizujeme README a příslušnou dokumentaci; v Notion pouze odškrtneme splněné body. Návrhy odlišujeme od schválených rozhodnutí. Práci ukládáme průběžnými commity.

## Data, služby a měření

ETF pro porovnání: **VOO (0,03 %), VTI (0,03 %) a SCHD (0,06 %)** roční zveřejněné nákladovosti fondu. Nejde o celkové náklady investora. Všechny mají listing na **NYSE Arca**, která je samostatnou burzou skupiny NYSE; striktní NYSE main market výběr nesplňuje. Data ověřena 9. 10. 2026, včetně oddělených dat zdrojových dokumentů. Úplné zdroje a interpretace jsou v docs/etf-research.md a src/data/etfs.json.

Dostupnost pro český retail je **podmíněná podle brokera a účtu**: IBKR uvádí omezení bez KID, Fio umožňuje přístup k americkým ETF a ČNB rozlišuje execution-only přístup. Konkrétní nákup jednotlivých tickerů na klientském účtu nebyl otestován. Tuto informaci zobrazujeme přímo u porovnání. VTI používá aktuální název Vanguard Morningstar Total Stock Market ETF a Morningstar US Total Market Index, účinné od 29. 7. 2026.

Pro bod 7 je implementované serverové napojení na Supabase a Gmail API; Resend zůstává alternativou. Gmail OAuth a Supabase API jsou propojené. Čtyřstránkové PDF je zveřejněné v samostatném veřejném Storage bucketu a ověřené stažením bez autentizace včetně SHA-256. Formulář zůstává vypnutý do ověření retence, doplnění informací o zpracování a autorizovaného testu doručení. Aplikace nepoužívá analytiku. Skutečné klíče patří do ignorované .env.local nebo prostředí hostingu.

Před spuštěním zopakujeme kontrolu nákladovosti a dostupnosti. Očekávanou konverzi a tři hypotézy pro A/B testování doplníme po návrhu stránky. Skutečná konverze zatím není změřená.

## Spolupráce s AI

Dne 2026-10-11 nainstalované také emilkowalski/skills (15 skillů, původní adresa emilkowalski/skill přesměrovává) a Leonxlnx/taste-skill (13 skillů) do C:\Users\miros\.codex\skills. Použitý skill-installer s přímým stažením po selhání klonování v npx skills. Emilův apple-design je pod názvem emil-apple-design, aby zachoval stávající apple-design. Ověřených 28 nových SKILL.md. Podrobnosti v ai-log/2026-10-11.md. Instalace nezměnila web ani jeho závislosti.


Globálně pro Codex jsou nainstalované apple-design a na pokyn uživatele také ibelick/ui-skills (7 skillů), vercel-react-view-transitions a CloudAI-X/threejs-skills (10 skillů). Jsou v C:\Users\miros\.agents\skills, nikoliv v repozitáři nebo závislostech aplikace. Instalace a omezení automatického hodnocení zaznamenané v ai-log/2026-10-09.md. Před použitím čteme konkrétní SKILL.md; instalace sama nezměnila web.

Používáme Codex. AI dostala pokyn načíst Notion, navrhnout tři cílové skupiny, průběžně zapisovat hotovou práci a vytvořit React projekt s dokumentací. Uživatel schválil druhou variantu.

Obsah kontrolujeme proti zadání a schváleným rozhodnutím, zápisy do Notion zpětným načtením a technické změny odpovídajícími kontrolami. Postup a omezení jsou v ai-log/. Dosavadní souhrn není úplný export konverzace; ten je ještě nutné dodat.

## Co zbývá

PDF je vytvořené; zbývá aktivace skutečného ukládání kontaktů a doručení (bod 7), měření a dokončení bodů 9–12. Dvě reklamy jsou připravené k posouzení. Frontend včetně kalkulačky a kvízu je implementovaný; veřejný frontend je nasazený; celý proces získání průvodce ještě není hotový.


## Ověření webu (2026-10-09)

- npm run lint: úspěšné.
- npm run test: 9 úspěšných testů; kalkulačka, kvíz, email a API chyby, PostgreSQL schéma, retry, kvóty, oprávnění a výmaz. Nativní Node.js 24 runner; PGlite je jen vývojová závislost pro skutečné SQL testy.
- npm run build: úspěšné, včetně kontroly TypeScriptu.
- npm install: audit hlásil 0 zranitelností při instalaci.
- Git repozitář na větvi main je propojený s https://github.com/Myro685/ETF.git; hosting zatím není založený.
- Browser kontrola při 320, 390, 768 a 1 440 px: bez vodorovného přetékání i s rozbalenými názvy a zdroji.
- Ověřené kotvy, detaily, zdroje, údaje a klávesnice. Nový formulář: samostatné testovací scénáře pro čekání a dvojklik, potvrzení, chybu a retry, bez skutečného odesílání. Hlavní web ověřený v nenastaveném režimu; skutečné uložení v Supabase a doručení e-mailu ještě nejsou ověřené.
- Atlas používá světlou papírovou paletu; předchozí automatická tmavá varianta se nepoužívá. Konzole bez zachycených chyb a varování. Zvětšení 200 % a plný test screen readeru zbývají. Doručení PDF nelze koncově otestovat před bodem 7.
- Hlavní JS Atlasu 256,60 kB / gzip 80,91 kB; 3D chunk 529,07 kB / gzip 131,40 kB se načítá odděleně. Vite stále upozorňuje na velikost 3D chunku. LCP na skutečném mobilním připojení zatím nebylo změřené.

## Projektové skilly (2026-10-14)

Pro Codex jsou v `.agents/skills` nainstalované všechny skilly z `emilkowalski/skills` (15), Impeccable s enginem 0.1.14 a `gpt-taste` z `Leonxlnx/taste-skill`. Impeccable má projektové hooks v `.codex/hooks.json`; zdroje a hashe skills CLI eviduje `skills-lock.json`. Lokální binární engine se neukládá do Gitu. Obnovení instalace z kořene projektu:

```powershell
npx skills add emilkowalski/skills -a codex --yes
npx impeccable install --providers=codex --scope=project
npx skills add https://github.com/Leonxlnx/taste-skill --skill gpt-taste -a codex --yes
```

Projektový `apple-design` pochází z Emilova balíčku; dřívější globální skill stejného jména má jiný původ. Instalace neprovádí redesign ani inicializaci stávajícího designového kontextu.

### Kontrola doručení a PDF

`npm run check:guide` načte soukromou `.env.local` a vypíše chybějící nastavení bez hodnot klíčů. Jde o místní kontrolu, nikoliv důkaz skutečného doručení. [Postup aktivace](docs/guide-activation.md) a [návrh informací o zpracování](docs/privacy-notice-draft.md) popisují zbývající kroky.

Průvodce je v `public/guides/pruvodce-etf-2026-10-14.pdf` a build jej kopíruje do `dist/guides/`. Čtyři strany obsahují interpretaci fondů, příklady poplatků, checklist a klikatelné zdroje. Zdrojový generátor `scripts/generate-guide.py` používá stejná data jako web; vyžaduje Python + reportlab a Arial (`--font-dir` určuje adresář s arial.ttf/arialbd.ttf). PDF není nutné generovat při každém buildu. Vydání a data ověření nejsou automaticky dnešní; při změně obsahu aktualizovat zdroje, datum i název souboru vědomě.

Ověření 14. 10. 2026: 11 testů prošlo, PDF vykresleno a zkontrolováno na všech čtyřech stranách včetně českých znaků a 8 odkazů. Živý test Supabase/Resend čeká na založení účtů. Lint ignoruje externí skripty nainstalovaných skillů; aplikační, serverový a vlastní skriptový kód zůstává kontrolovaný.

Pro jednorázové propojení odesílacího Gmail účtu slouží npm run connect:gmail. Podrobný postup a omezení testovacího OAuth jsou v docs/gmail-setup.md. Tento příkaz neodešle žádný e-mail a sám neaktivuje formulář.

Oprava 15. 10. 2026: spuštění Gmail OAuth ověřené i skutečným formulářovým POSTem v Chromu, nejen HTTP testem. Podrobnosti v docs/gmail-setup.md.

Gmail transport je implementovaný (15. 10. 2026); vyžaduje obě SQL migrace v supabase/ v pořadí 001 a 002. MAIL_PROVIDER=gmail používá soukromé GMAIL_* klíče. Příkaz check:guide nyní rozlišuje Gmail a Resend; Gmail nevyžaduje vlastní doménu. 16 testů prošlo, nový nejistý stav ověřený v prohlížeči. Podrobnosti a záměrná absence automatického opakování po nejasném send v docs/gmail-setup.md.

Pro nový prázdný Supabase projekt lze místo samostatného spouštění dvou migrací vložit do SQL editoru celý supabase/setup-new-project.sql. Je atomický, neobsahuje klíče a odmítne opakované vytvoření existujících tabulek. Nespouštějte oba postupy.

Supabase připojení ověřené 15. 10. 2026: API schématu HTTP 200, tabulky a potřebné serverové funkce dostupné. Živé uložení kontaktu a doručení čekají na retenci, finální informace, veřejné URL a akceptační test.

15. 10. 2026: uživatel potvrdil úspěšné spuštění kontroly retence; konkrétní řádky výsledku nebyly předané. Připravený `node --env-file=.env.local scripts/test-gmail.ts` zobrazí náhled zprávy bez síťových požadavků. Varianta `--send` je pouze pro výslovně schválený jednorázový test na kontaktní adresu správce, s lokální ochranou proti opakování. Po výslovném pokynu uživatele Gmail přijal jednu skutečnou testovací zprávu; uživatel následně potvrdil příjem ve schránce; otevření PDF z e-mailu zatím výslovně nepotvrdil. Sběr zůstává vypnutý.

## Ukázkový provoz pro hodnocení (15. 10. 2026)

Uživatel zvolil demo, nikoliv veřejný sběr kontaktů. GUIDE_DEMO_MODE=true serverově přijímá jen PRIVACY_CONTACT_EMAIL; jinou adresu odmítne před databází i poskytovatelem. Formulář předvyplní tuto zveřejněnou adresu správce a zamkne pole, vysvětlí omezení a po úspěchu nabídne PDF. Veřejné informace jsou v /ochrana-udaju.html, verze 2026-10-15-demo-v1. Při změně režimu je nutné znovu vyřešit smluvní podmínky a informační povinnosti pro skutečné návštěvníky. Gmail kopie bude provozovatel podle svého potvrzení trvale mazat nejpozději po 30 dnech.

Produkční API po uživatelském importu proměnných a redeployi vrací HTTP 200, available=false. V UI zkontrolovaná existence 11 Secret položek Production bez čtení hodnot; chyběl MAIL_PROVIDER. Čtyři doplňující položky jsou připravené v ignorované .env.vercel-demo.local; aktivace GUIDE_ENABLED je zvláštní poslední krok. Následuje skutečný test celého formuláře s databázovým zápisem.

Produkční kontrola 15. 10. 2026: config API 200, available=true, demoOnly=true, správná informační URL /ochrana-udaju.html a verze 2026-10-15-demo-v1. Přímý požadavek se syntetickou cizí adresou odmítnutý HTTP 403 demo_only. Read-only kontrola před skutečným formulářovým testem: žádný uložený kontakt ani žádost provozovatele. Následuje uživatelské odeslání přes živý formulář, kontrola databáze a potvrzení přijetí PDF.
