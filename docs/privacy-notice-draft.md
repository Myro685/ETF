# Informace o zpracování kontaktu - návrh před aktivací

Datum přípravy: 14. 10. 2026. Tento dokument zatím není publikovaná informační stránka. Před aktivací doplnit provozní skutečnosti uvedené na konci; nevkládat jeho cestu do PRIVACY_POLICY_URL jako hotovou veřejnou stránku.

## Správce a kontakt

Správcem bude Miroslav Grund. Kontaktní e-mail pro otázky a uplatnění práv: miroslavgrund68@gmail.com. Jméno a kontakt poskytl uživatel výslovně pro zveřejnění u správce.

## Účel a rozsah

E-mail použijeme k doručení vyžádaného Průvodce porovnáním ETF, vyřízení žádosti a řešení opakovaného odeslání či technické chyby. Vyžádání PDF nezakládá odběr newsletteru ani souhlas s marketingem.

V aplikační databázi ukládáme e-mail, čas žádosti, identifikátor žádosti, verzi informace o zpracování, datum expirace a identifikátor přijetí zprávy e-mailovým poskytovatelem. Neukládáme výsledky kvízu ani IP do těchto tabulek. Provozní logy hostingu a poskytovatelů je třeba popsat podle skutečné konfigurace; tento popis neslibuje, že nevznikají.

Navržený právní základ pro vyřízení výslovně vyžádaného doručení je čl. 6 odst. 1 písm. b) GDPR, pokud tento bezplatný vztah odpovídá plnění služby na žádost návštěvníka. Provozovatel musí před publikací potvrdit jeho použitelnost pro skutečný způsob provozu. Samostatné účely (např. bezpečnostní logy) potřebují vlastní posouzení. Marketing se tímto formulářem nezavádí.

Poskytnutí e-mailu je dobrovolné a základní porovnání zůstává přístupné bez něj. Bez e-mailu nelze vyžádaný průvodce doručit do schránky. Po úspěšné žádosti je rovněž dostupné přímé stažení PDF.

## Poskytovatelé a uchování

Zvolené služby jsou Supabase pro databázi a Google Gmail API pro vyžádaný e-mail. Gmail účet je propojený, Supabase projekt je vytvořený a serverové připojení ověřené. Před publikací posoudit konkrétní roli a podmínky Googlu pro zvolený osobní účet; nepředpokládat automaticky stejné zpracovatelské podmínky jako u firemní služby. Před zveřejněním doplnit skutečné smluvní subjekty, zvolený region Supabase, poskytovatele hostingu, relevantní další zpracovatele a případné předávání mimo EHP včetně použitého mechanismu a způsobu získání jeho kopie.

Implementace navrhuje výmaz kontaktu a souvisejících žádostí po 30 dnech od poslední nové žádosti; hodinová údržba znamená výmaz při nejbližším následujícím běhu. Opakování stejného identifikátoru žádosti lhůtu neprodlužuje. Tento příslib lze publikovat teprve po aktivaci a ověření údržby. Doby uchování odeslané pošty v Gmailu, hostingu, logách a zálohách je nutné doplnit samostatně podle skutečného tarifu a konfigurace. Výmaz v hlavní databázi neznamená okamžitý výmaz záloh nebo již doručené zprávy z cizí schránky.

## Práva návštěvníka

Za podmínek GDPR můžete žádat o přístup ke svým údajům, jejich opravu, výmaz, omezení zpracování a případně přenositelnost. Právo vznést námitku se vztahuje na zpracování založené na oprávněném zájmu, pokud takový účel bude zaveden. Je-li některé zpracování založeno na souhlasu, lze jej odvolat. Žádost pošlete na výše uvedený kontakt; při vyřízení může být potřeba přiměřeně ověřit totožnost. Máte právo podat stížnost k Úřadu pro ochranu osobních údajů (https://uoou.gov.cz/).

Tento formulář neprovádí automatizované rozhodování s právními nebo obdobně významnými účinky ani profilování pro takové rozhodování.

## Před publikací zbývá

- Potvrdit právní základ pro vyřízení žádosti a vyřešit případné samostatné bezpečnostní logy.
- Založit účty, potvrdit smluvní subjekty/zpracovatelské podmínky a region.
- Doplnit hosting, uchování u všech poskytovatelů a případná předávání.
- Aktivovat retenci a ověřit její běh na syntetickém expirovaném kontaktu.
- Z dokumentu odstranit pracovní instrukce a publikovat finální informace na HTTPS URL. Nastavit identickou verzi v prostředí; změny verze odmítnou starý otevřený formulář.

Podklad: [GDPR, zejména články 6, 12, 13 a 15-22](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng). Jde o návrh pro konkrétní implementaci, nikoliv potvrzení splnění všech povinností provozovatele.
