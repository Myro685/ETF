# Zadání a stav projektu

Zdroj: [Clientelo projekt v Notion](https://app.notion.com/p/3f4e1942c8af80ddacf7c7b070dea863). Toto je pracovní souhrn checklistu. Původní e-mail se zadáním B zatím nebyl načten.

Termín: **2026-10-16**. Aktualizace: **2026-10-15**.

Podrobnosti a rozhodnutí vedeme v projektových souborech. Notion slouží pouze k odškrtávání dokončených bodů. Uživatel se vrátil k reklamám: dva návrhy bodu 4 připravené; frontend i bod 6 implementované. Bod 7 zůstává rozpracovaný.

| Bod | Výsledek | Stav |
| --- | --- | --- |
| 1 | Návštěvník, problém, jazyk a obsah | Hotovo, schválena varianta 2 |
| 2 | Hodnota zdarma, hodnota za e-mail, okamžik žádosti | Hotovo; nabídka schválená v docs/offer.md |
| 3 | ETF, NYSE/Arca, dostupnost, skutečná data a zdroje | Hotovo; VOO, VTI, SCHD, zdroje a omezení v docs/etf-research.md |
| 4 | Dvě reklamy s textem, nadpisem a CTA v repozitáři | Hotovo jako příprava návrhů; docs/ads.md, návaznost úvodu stránky ověřená; kampaň nespuštěná, návrhy k posouzení |
| 5 | Obsah, pořadí sekcí a vlastní vzhled pro mobil | Hotovo; aktuální redesign přímo v Reactu podle tří skillů, ověření v docs/design-2026-10-11.md |
| 6 | Interaktivní funkce s ověřenými výsledky | Hotovo; na výslovné přání uživatele dvě: kalkulačka a kvíz, automatické a browser testy v docs/interactive-feature.md |
| 7 | Formulář, uložení kontaktu, ochrana údajů, doručení | Formulář a serverové API implementované a lokálně testované; PDF hotové, správce a kontakt známé, nyní zvoleno odesílání přes Gmail API; OAuth propojené a transport implementovaný, obnovení tokenu ověřené; skutečná zpráva neodeslaná; Supabase připojení a dostupnost obou tabulek i serverových funkcí ověřené přes API; veřejné PDF zveřejněné a ověřené; hodinová retence potvrzená uživatelem, její běh ještě neověřený; finální informace a koncový test stále zbývají; docs/gmail-setup.md |
| 8 | Rozlišení reklam, události trychtýře a ověření záznamu | Nezahájeno |
| 9 | README, důvody řešení, zdroje, konverze, tři A/B hypotézy, spuštění | Rozpracováno; základ README |
| 10 | AI pokyny, kontroly, chyby, exporty a metoda exportu | Rozpracováno; souhrn, úplné exporty chybí |
| 11 | Veřejný GitHub, commity, hosting, mobilní a koncové testy | Rozpracováno; GitHub Myro685/ETF, ověřený responzivní frontend; hosting a koncové testy doručení zbývají |
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
