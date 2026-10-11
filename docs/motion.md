# Animace — 2026-10-11

Pokyn uživatele: použít emil-design-eng a animate, přidat střídmé přechody a hover; úvodní bloky nechat postupně vyjíždět nahoru.

## Rozsah

Úvodní ilustrace patří do vzácného prvního zobrazení marketingové stránky; účel je delight. Každý 3D blok roste ze své pevné základny na původní výšku. Podstavce, kamera, popisky a obsah stránky se nepohybují. Pořadí bloků má rozestupy 50 ms, skupiny začínají v 0/150/300 ms. Pohyb bloku trvá 650 ms, celá sekvence 1 350 ms; bez odskoku. Easing je stejný jako existující `--cl-ease`: cubic-bezier(.23, 1, .32, 1), vyhodnocený pro skutečné transformace Three.js meshů.

CSS by změnilo celý canvas; proto skutečné bloky řídí konečná requestAnimationFrame sekvence. Žádná nová knihovna. Scéna začíná při vstupu do viewportu, mimo něj a ve skryté kartě se pozastaví. Při návratu pokračuje z předchozího okamžiku, po dokončení se při scrollování neopakuje. Po dokončení se renderuje jen na vyžádání, např. při změně velikosti; měření layoutu a renderer.setSize neběží každý animační snímek. Obsluha ztráty WebGL kontextu a úklid zdrojů zachované.

Tlačítka: přechod barvy pozadí a rámečku 160 ms ease, stisk scale(.97) 140 ms se stávajícím easingem. Šipka hlavní CTA na hover posun 3 px / 160 ms, navigace jemný barevný přechod. Hover vyžaduje přesný ukazatel s možností hover. Focus-visible vypíná přechod tlačítek a posun šipky; změny výpočtů a kvízu jsou okamžité.

`prefers-reduced-motion: reduce` zobrazuje okamžitě finální 3D scénu. Zapnutí preference během animace ji dokončí, vypnutí ji neopakuje. CSS přechody i smooth scrolling respektují existující omezení pohybu. Statická náhrada zůstává pro nedostupné WebGL; text ani ovládání nečekají na animaci.

## Ověření

- TypeScript + produkční build a oxlint úspěšné.
- Všech 9 existujících testů prošlo. První sandboxový běh blokoval localhost API test (EACCES); opakování mimo sandbox úspěšné.
- Samostatný dočasný harness se stuby rendereru ověřil: pevnou základnu, konečnou smyčku, pause/resume bez skoku, jediný resize v průběhu, žádné opakování při scrollu, obnovu WebGL kontextu, obě varianty omezení pohybu a úklid listenerů/rAF. Nejde o měření výkonu skutečného GPU ani systémový test přístupnosti.
- Prohlížeč: zachycený rozjezd i finální scéna, právě jeden canvas, computed přechody odpovídají specifikaci. Při 390 px a výchozích 1 280 px bez horizontálního přetékání. Na mobilním rozložení ověřený průběh vysunutí. Hover ověřený stylem, pocit při pohybu myši a skutečný mobilní výkon nejsou fyzicky změřené.
- Hlavní JS 258,57 kB / gzip 81,60 kB; samostatný 3D chunk přibližně 530,07 kB / gzip 131,89 kB. Stávající Vite varování přes 500 kB přetrvává. Bez nových závislostí.

Notion se nemění: jde o doladění již hotového bodu 5, nikoliv uzavření dalšího úkolu. Bod 7 zůstává rozpracovaný.