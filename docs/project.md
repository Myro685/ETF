# Zadání a stav projektu

Zdroj: [Clientelo projekt v Notion](https://app.notion.com/p/3f4e1942c8af80ddacf7c7b070dea863). Toto je pracovní souhrn checklistu. Původní e-mail se zadáním B zatím nebyl načten.

Termín: **2026-10-16**. Aktualizace: **2026-10-15**.

Podrobnosti a rozhodnutí vedeme v projektových souborech. Notion slouží pouze k odškrtávání dokončených bodů. Uživatel se vrátil k reklamám: dva návrhy bodu 4 připravené; frontend i bod 6 implementované. Bod 7 dokončený v rozsahu formuláře, doručení a informačního požadavku; samostatné smluvní/provozní mezery jsou evidované v docs/privacy-operations.md.

| Bod | Výsledek | Stav |
| --- | --- | --- |
| 1 | Návštěvník, problém, jazyk a obsah | Hotovo, schválena varianta 2 |
| 2 | Hodnota zdarma, hodnota za e-mail, okamžik žádosti | Hotovo; nabídka schválená v docs/offer.md |
| 3 | ETF, NYSE/Arca, dostupnost, skutečná data a zdroje | Hotovo; VOO, VTI, SCHD, zdroje a omezení v docs/etf-research.md |
| 4 | Dvě reklamy s textem, nadpisem a CTA v repozitáři | Hotovo jako příprava návrhů; docs/ads.md, návaznost úvodu stránky ověřená; kampaň nespuštěná, návrhy k posouzení |
| 5 | Obsah, pořadí sekcí a vlastní vzhled pro mobil | Hotovo; aktuální redesign přímo v Reactu podle tří skillů, ověření v docs/design-2026-10-11.md |
| 6 | Interaktivní funkce s ověřenými výsledky | Hotovo; na výslovné přání uživatele dvě: kalkulačka a kvíz, automatické a browser testy v docs/interactive-feature.md |
| 7 | Formulář, uložení kontaktu, ochrana údajů, doručení | Hotovo v rozsahu zadání: skutečný průchod potvrzený uživatelem, upravitelné pole, chybové stavy, účel a retence u pole, informace o správci a veřejná stránka ochrany údajů dostupná i z patičky. Retence a doručení ověřené. Dokončení checklistu nepotvrzuje vyřešení samostatně evidovaných smluvních podmínek ostrého provozu; docs/privacy-operations.md |
| 8 | Rozlišení reklam, události trychtýře a ověření záznamu | Hotovo: vlastní měření se souhlasem, Supabase RPC, retence a soukromý report; všechny události skutečně zapsané, obě reklamy rozlišené, opakovaná a smyšlená konverze ověřené. Kontrola ovládání živého webu prošla. docs/measurement.md |
| 9 | README, důvody řešení, zdroje, konverze, tři A/B hypotézy, spuštění | Hotovo: aktuální README obsahuje celý požadovaný rozsah; konverze 3 % s rozpětím 2–5 % je výslovně vlastní pracovní odhad, A/B hypotézy nejsou spuštěné |
| 10 | AI pokyny, kontroly, chyby, exporty a metoda exportu | Hotovo v doloženém rozsahu: čtyři místní zdrojové soubory od začátku projektu a dvou pomocných agentů, skutečné veřejné textové zprávy exportované do MD a JSONL. Manifest, redakce a vynechané interní či binární části popsané v ai-log/exports/README.md. |
| 11 | Veřejný GitHub, commity, hosting, mobilní a koncové testy | Hotovo: veřejný repozitář a web, 23 testů/lint/build, mobilní kontrola 320–1440 px, odkazy, živá validace a lokální syntetické stavy formuláře, dříve potvrzené skutečné doručení/PDF, nový produkční zápis měření a audit dosažitelné historie. Důkazy a limity v docs/final-verification.md. |
| 12 | Odpověď na e-mail s GitHub, veřejným webem a omezeními | Nezahájeno |

## Priority

2026-10-11: přepracování přímo v Reactu podle tří vyvolaných skillů. Lokální Manrope, jednotná paleta a ovládání, lepší hierarchie, zachované funkce a ověřená data. Aktuální specifikace a kontroly v docs/design-2026-10-11.md. Neuzavírá žádný další bod checklistu; Notion se nemění.

Přidané plynulé posouvání mezi sekcemi podle pokynu uživatele, s respektováním systémového omezení pohybu. Nejde o dokončení dalšího bodu checklistu.

Na pokyn „přepracuj design v reactu“ Atlas implementovaný v hlavní aplikaci, včetně samostatně načítané 3D studie a zachovaných funkcí a API formuláře. Specifikace a aktuální kontroly v docs/design-atlas.md. Samostatný prototyp a limit API MagicPath patří k historii návrhu; implementace v Reactu na limitu nezávisí. Bod 5 již byl odškrtnutý, nové body v Notion se neodškrtávají.

Jasná nabídka, ověřená data, mobilní stránka, funkční formulář, doručení a měření. Potom vizuální detaily a další interaktivita. Historii commitů a záznam práce s AI vést od začátku.

## Technická příprava

Na žádost uživatele vytvořen projekt C:\Users\miros\Projects\clientelo: React, TypeScript, Vite, instrukce pro AI, rules, místo pro skills a dokumentace. Nyní obsahuje implementovanou stránku. Dokončení frontendu neznamená hotové doručení průvodce, měření ani hosting.

Na pokyn uživatele doplněné střídmé animace úvodních 3D bloků a ovládacích prvků podle emil-design-eng a animate. Specifikace a ověření v docs/motion.md. Jde o doladění bodu 5; nové body v Notion se neodškrtávají.

2026-10-14: nainstalované projektové skilly pro Codex: emilkowalski/skills (15), Impeccable a gpt-taste. Instalace ověřená; žádný další bod Notion checklistu se tím neuzavírá.

15. 10. 2026: SQL nastavení Supabase dokončené podle potvrzení uživatele. API ověření, klíče, retence a koncový test zbývají.
