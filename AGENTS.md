# Instrukce pro práci na Clientelo

Před změnami přečti README.md, .agents/rules/project.md, docs/project.md a docs/decisions.md. Pokyny uživatele mají přednost; rutinní reverzibilní kroky neřeš opakovaným žádáním o potvrzení.

## Průběžná dokumentace

- Po dokončeném kroku aktualizuj README, přehled úkolů a příslušná rozhodnutí.
- Podrobnosti řešení, nabídku, rozhodnutí a další informace zapisuj do projektových souborů. Notion slouží pouze k odškrtávání dokončených bodů: https://app.notion.com/p/3f4e1942c8af80ddacf7c7b070dea863. Nepřidávej tam návrhy, souhrny ani podrobnou dokumentaci.
- Před úpravou načti aktuální stránku a zachovej nesouvisející text a změny uživatele. Označuj jen skutečně dokončené úkoly. Pokud Notion není dostupný, zaznamenej neprovedenou synchronizaci a sděl to uživateli.
- Udržuj pravdivý záznam v ai-log/. Souhrn ani rekonstrukci nikdy nevydávej za úplný export konverzace.
- Ukládej dokončené části průběžnými Git commity. Nevkládej tajné klíče ani osobní kontakty do kódu, dokumentace, logů nebo commitů.

## Skills a rules

Projektové skills patří do .agents/skills/<nazev>/SKILL.md. Vytvářej je podle skutečných opakujících se potřeb. Před použitím přečti daný SKILL.md.

Pravidla v .agents/rules/project.md jsou závazná díky odkazu z tohoto AGENTS.md; nejsou samostatně automaticky načítané. Změny pravidel zdokumentuj. Externí akce prováděj v aktuálně autorizovaném rozsahu, nikoliv automaticky na základě zmínky v zadání.

