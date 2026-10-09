# Návrh Atlas — přepracování v MagicPath

Datum: 2026-10-09. Stav: nový návrh k posouzení uživatelem. Dosavadní React aplikace používá předchozí design. Přenos tohoto návrhu do hlavní aplikace je další krok.

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
