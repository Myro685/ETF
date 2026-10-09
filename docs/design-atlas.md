# Návrh Atlas — přepracování v MagicPath

Datum: 2026-10-09. Stav: **Atlas implementovaný v hlavní React aplikaci** na navazující pokyn uživatele „přepracuj design v reactu“. Níže uvedená historie prototypu a MagicPath zůstává pro dohledání podkladů.

## Aktuální implementace v Reactu

EtfLanding používá nový úvod s MarketSculpture, styly Atlas.css navazují na existující strukturu. Zachované aktuální komponenty kalkulačky, kvízu, zdrojů a GuideForm i jeho skutečná služba guideService. Data se dále čtou pouze z src/data/etfs.json. Prototypový náhradní service nebyl do aplikace přenesený; původní API může po konfiguraci dál ukládat žádosti a doručovat průvodce. V současném nenastaveném režimu pouze kontroluje formát e-mailu.

Three.js 0.186.1 je přesně připnutá runtime závislost, @types/three 0.186.0 vývojová. MarketSculpture přes IntersectionObserver načte marketScene.ts při přiblížení scény k viewportu. Nadpis a obsah nečekají na 3D; prostor má pevnou výšku a před vykreslením nebo při chybě je viditelná lehká CSS ilustrace. Canvas má aria-hidden, vysvětlení zůstává v textu. Vykreslování po resize se slučuje do jednoho frame, bez průběžné animace. Cleanup odpojí observery, posluchače a plánovaný frame a uvolní geometrii, materiály, stín i renderer. Ověřená jediná canvas instance i s React StrictMode.

V Reactu dokončené i odstranění zaobleného panelu průvodce; sekce zachovává společné okraje obsahu. Theme-color a favicon odpovídají nové paletě. Atlas používá světlý vzhled i při preferenci tmavého systému, včetně nativních formulářových prvků.

Ověření aktuální aplikace:

- npm run lint, npm run build včetně TypeScriptu a všech 9 existujících testů prošly. Install audit 0 zranitelností.
- Živý browser při 320, 390, 768 a 1440 px: bez vodorovného přetékání, také s rozbalenými názvy, zdroji, kvízem a kalkulačkou s hodnotou 1 miliardy Kč. WebGL scéna viditelná a právě jeden canvas.
- Kvíz vrací správné vysvětlení. Formulář při prázdném vstupu vrátí chybu a fokus do pole, při syntakticky platném testovacím vstupu pravdivě hlásí neukládání a neodesílání. Žádný skutečný kontakt nebyl použitý.
- Nový browser náhled bez zachycených chyb a varování. Pořizované screenshoty jsou ve výstupech chatu. Plný screen reader, zvětšení 200 %, fyzické zařízení bez WebGL a skutečné doručení PDF nebyly znovu koncově testované.
- Hlavní JS 256,60 kB / gzip 80,91 kB; samostatný 3D chunk 529,07 kB / gzip 131,40 kB. Build nadále upozorňuje na velikost 3D chunku. Oddělení načítání není měření LCP; výkon na reálném mobilním připojení zbývá ověřit před veřejným spuštěním.

Spuštění hlavní aplikace z kořene projektu: npm run dev; pro API druhý terminál npm run dev:api. Archiv níže slouží pouze jako historický prototyp.

## Směr

Uživatel požádal o méně generický vzhled s využitím nově instalovaných skillů a připustil 3D grafiku. Návrh připomíná finanční atlas: papírový podklad, serifové nadpisy, technické popisky, otevřené porovnání a tenké linky. Většina opakovaných karet a dekorací ustoupila obsahu. Pořadí sekcí, nabídka, reklamní sliby, kalkulačka, kvíz a zdroje zůstaly zachované.

| Token | Hodnota |
| --- | --- |
| Papír | #F4F2E9 |
| Sekundární povrch | #EAE8DC |
| Text | #252A23 |
| Sekundární text | #626557 |
| Olivová | #49572E |
| Linky | #C6C8B8 |
| Typografie | Georgia pro nadpisy, Arial pro text, Courier New pro popisky |

Výpočty kontrastu: hlavní text na papíru 13,06:1, sekundární 5,32:1, olivová 6,97:1. Sekundární text na povrchu 4,85:1. Jde o kontrolu těchto barevných párů, nikoliv úplný audit přístupnosti.

## 3D studie

Three.js zobrazuje tři skupiny fyzických dílků: velké bloky VOO, širší mozaiku VTI a vybrané olivové bloky SCHD. Počet a velikost dílků nejsou skutečné počty pozic, váhy ani výnosy; toto omezení je přímo v popisku.

Scéna se vykreslí při načtení a změně rozměrů. Nemá nekonečnou animační smyčku. DPR je omezený na 1,5, jedna mapa stínu má 1024 px, geometrie a materiály se sdílejí a při odpojení uvolní. Při chybě WebGL je dostupná statická náhrada; popisky fondů zůstávají čitelné.

Použité skills: MagicPath pro živý canvas; ui-skills-root pro výběr kontextu přes CLI; baseline-ui pro hierarchii, typografii a rozložení; threejs-fundamentals pro scénu; fixing-motion-performance pro omezení vykreslování. vercel-react-view-transitions byl načtený, ale stránka nemá přechod mezi obrazovkami, který by jeho použití odůvodnil. Experimentální React nebyl přidaný. improve-ui byl přečtený, jeho samostatný auditní postup nebyl aplikovaný na implementaci.

## Funkce a data

Archiv obsahuje snapshot aktuálních komponent a dat z hlavní aplikace, včetně aktuálního názvu VTI. Při pozdější implementaci se musí znovu použít společný src/data/etfs.json; snapshot není další autoritativní zdroj.

Formulář v návrhu používá výslovně nedostupnou službu. Kontroluje formát lokálně, nic neodesílá a nepředstírá doručení PDF. Zůstává vysvětlení dostupnosti ETF podle brokera a účtu.

## Ověření a omezení

- MagicPath dokončil desktopovou revizi 459304598692335616 a mobilní revizi 459304607835885568 v projektu 459239012931100672. Sestavené náhledy byly vizuálně zkontrolované; skutečná mobilní šířka byla ověřená v místním prohlížeči.
- Samostatný prototyp: kontrola TypeScriptu a Vite build prošly. Místní viewporty 320, 390, 768 a 1440 px bez vodorovného přetékání v kontrolovaných stavech; opravené mobilní záhlaví a zkontrolované rozbalené názvy fondů.
- Kalkulačka zkontrolovaná i s hodnotou 1 miliardy Kč; formulář s prázdným a syntakticky platným testovacím vstupem. Nově otevřený finální náhled nezachytil varování ani chyby konzole.
- Prototyp má JS přibližně 755 kB, gzip 204 kB; build upozorňuje na velký chunk. Před přenosem do webu vyřešit načítání 3D, alternativně předrenderovaný obraz, a změřit LCP na mobilu. Zatím nejde o ověřenou produkční výkonnost. Kompletní screen reader, 200% zvětšení a koncové doručení nebyly testované.
- Po dokončení obou revizí MagicPath vyčerpal limit 50 API volání. Poslední drobný pokus o odstranění zaobleného panelu průvodce se nepodařilo sestavit. Archiv odpovídá dokončenému návrhu, v němž panel zůstává. Desktopová doplňující session mcs_1122ee71-acc8-4e9d-9901-259445fdf370 zůstala neodeslaná do buildu; nedokončená session nesmí být vydávána za novou revizi.

## Zdroj a spuštění

Samostatný prototyp v designs/magicpath/atlas-2026-10-09 má vlastní package.json a lockfile. Nezměnil závislosti hlavní aplikace. Three.js je 0.186.1. Návrh má světlý vzhled; tmavá varianta nebyla navržena.

```powershell
cd C:\Users\miros\Projects\clientelo\designs\magicpath\atlas-2026-10-09
npm ci
npm run dev
```

Spouští se na portu 5175. Kontrola sestavení: npx vite build. preview.tsx je samostatný vstup; src/App.tsx a generovaný wrapper zachovávají scaffold MagicPath. Explicitní pořadí importů CSS ve wrapperu je důležité: Editorial.css musí přijít po původních stylech.

Bod 5 byl již odškrtnutý. Tato revize neuzavírá další bod checklistu, proto nebyl Notion změněný.
