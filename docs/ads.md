# Dvě verze reklamy — bod 4

Stav: **návrhy připravené v repozitáři, k posouzení uživatelem**. Datum: 2026-10-09. Bod 4 požaduje textové návrhy a návaznost stránky. Kampaň není založená ani spuštěná; grafické kreativy a konkrétní reklamní platforma zatím nejsou zvolené.

## Společné zadání

Česky mluvící člověk před prvním nákupem ETF zaměřeného na americký trh. Má účet u brokera a základní znalost ETF, ale neví, podle čeho porovnat několik kandidátů. Obě reklamy vedou na stejnou stránku Clientelo. Slibují dostupné porovnání a kalkulačku bez e-mailu. PDF není příslib reklamy, protože jeho doručení zatím není aktivní.

## Varianta A — pochopit rozdíly

**Hlavní text:**

VOO, VTI, SCHD. Tři ETF zaměřená na americké akcie, tři různé přístupy. Než uděláte první nákup, porovnejte jejich zaměření a roční nákladovost na jednom místě. Přehled zdarma, bez zadání e-mailu. Dostupnost nákupu si ověřte u svého brokera.

**Nadpis:** Než koupíte ETF, poznejte rozdíly.

**Výzva ke kliknutí:** Porovnat ETF

**Důvod ke kliknutí:** návštěvník získá přehled kandidátů, které už zná, a porozumí jejich rozdílům.

## Varianta B — porozumět nákladům

**Hlavní text:**

Procento je údaj. Kolik ale znamená v korunách? Zadejte ukázkovou hodnotu investice a porovnejte orientační roční náklad fondů VOO, VTI a SCHD. Kalkulačka zdarma, bez e-mailu. Výpočet nezahrnuje další náklady investora ani nepředpovídá výnos.

**Nadpis:** Malé procento. Konkrétní částka.

**Výzva ke kliknutí:** Porovnat náklady v Kč

**Důvod ke kliknutí:** návštěvník převede abstraktní procento na srozumitelnou částku; nejde o příslib úspory nebo výnosu.

## Návaznost na stránku

| Slib | Co návštěvník uvidí hned po příchodu | Cesta k výsledku |
| --- | --- | --- |
| A: rozdíly VOO, VTI, SCHD a přehled bez e-mailu | Tickery, stejný nadpis „Než koupíte ETF, poznejte rozdíly.“ a vysvětlení porovnání zdarma | „Porovnat ETF“ v úvodu → #cl-comparison: zaměření, roční nákladovost, zdroje a podmíněná dostupnost |
| B: orientační roční náklad v Kč bez e-mailu | Úvod výslovně představuje kalkulačku a obsahuje „Porovnat náklady v Kč“ | Stejnojmenný odkaz → #cl-calculator: zadání částky, okamžitý výsledek pro tři fondy a vysvětlení omezení |

Obě varianty mohou vstupovat na kořenovou adresu webu. Pro lokální posouzení: http://127.0.0.1:5173/. Veřejná cílová URL bude doplněná po hostingu v bodu 11. Nepoužíváme vstupní kotvu, která by při načítání React aplikace mohla přeskočení sekce provést před jejím vykreslením.

## Rozlišení a budoucí test

Pro bod 8 navrhujeme označení `utm_campaign=etf_porovnani`, `utm_content=ad_a_rozdily` a `utm_content=ad_b_naklady`. `utm_source` a `utm_medium` se doplní podle skutečného kanálu. Jde o plán; aplikace zatím nezaznamenává zdroj návštěvy ani analytické události.

Hypotéza: A přivede lidi, kteří hledají přehled; B může lépe motivovat k použití kalkulačky díky konkrétnímu výsledku. Úspěch posoudíme podle skutečně získaných kontaktů vůči návštěvám z jednotlivých reklam, nikoli jen podle kliknutí. Zatím nemáme měření ani vítěze. Při budoucím porovnání zachovat stejnou stránku, publikum, kanál a vizuál, aby se lišil zejména text.

## Kontrola návrhů

- Každá varianta má hlavní text, nadpis a CTA; liší se motivem kliknutí.
- Texty odpovídají cílové skupině a dostupným funkcím; nepředpokládají doručení PDF.
- Není slíbená zaručená dostupnost ETF, nejlepší fond, výnos, úspora ani celkové investiční náklady.
- Reklamy neuvádějí sazby, ceny, počty pozic ani výkonnost, které by se musely průběžně aktualizovat. Data na stránce zůstávají ve společném src/data/etfs.json; podklady v [etf-research.md](etf-research.md).
- Úvod stránky a obě cesty ověřené v živém prohlížeči; technická kontrola zaznamenaná v ai-log/2026-10-09.md.

Před případným spuštěním zbývá veřejná adresa, měření a kontrola formátu a pravidel zvoleného reklamního kanálu. Připravené texty nejsou schválením konkrétní platformou.
