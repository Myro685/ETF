# Clientelo

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Česky mluvící člověk před prvním nákupem ETF na americký trh. Má účet u brokera a základní znalost ETF, potřebuje porovnat několik kandidátů. Schválená cílová skupina: docs/decisions.md.

## Product Purpose

Vysvětlit rozdíly VOO, VTI a SCHD, umožnit bez e-mailu porovnání a ilustrativní výpočet ročního nákladu v Kč. Navazující nabídka je PDF průvodce za e-mail (docs/offer.md).

## Capabilities and Constraints

React a TypeScript. Sdílená ověřená data v src/data/etfs.json, včetně zdrojů a data ověření. Kalkulačka a vzdělávací kvíz fungují. Formulář a serverové API existují; služby, PDF a údaje správce dosud nejsou nastavené. Nedostupné doručení nesmí vykázat falešný úspěch. Burza je NYSE Arca, dostupnost závisí na brokerovi a účtu. Bez predikcí výnosu a individuálních doporučení.

## Brand Commitments

Clientelo, český praktický jazyk. Dosavadní wordmark zachováváme. Uživatel autorizoval redesign přímo v Reactu s emil-design-eng, design-taste-frontend a impeccable dne 2026-10-11.

## Evidence on Hand

docs/etf-research.md, docs/offer.md, docs/form.md a skutečné interaktivní komponenty. Žádné reference zákazníků ani údaje o výnosech nejsou dodané. Notion pouze pro checklist, dokumentace v repozitáři.

## Accessibility & Inclusion

Mobilní rozložení, sémantické HTML, klávesnice, viditelný focus a respektování omezeného pohybu.
