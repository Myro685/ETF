# Provozní uzavření bodu 7

Stav k 15. 10. 2026. Technický průchod formulář → Supabase → Gmail → PDF je ověřený. Poslední otevřený checkbox se týká doložení podmínek veřejného sběru. Tento dokument odlišuje hotovou implementaci od jednání, která nelze nahradit editací kódu nebo odškrtnutím úkolu.

## Hotové části

- Jediné pole, validace, čekání, chyby, ochrana dvojkliku a bezpečné opakování žádosti.
- Neveřejné kontaktní tabulky, RLS, serverové funkce a soukromé klíče mimo frontend a Git.
- Živý test potvrzený uživatelem včetně e-mailu a PDF; read-only kontrola ověřila 1 kontakt, 1 žádost a identifikátor přijetí Gmailem, bez zveřejnění údajů.
- Otevřené zadání jiné adresy na výslovný pokyn uživatele. Test pokrývá veřejný i omezený režim; žádné automatické odesílání na náhodné testovací adresy.
- [Veřejné informace](https://etf-gold.vercel.app/ochrana-udaju.html), verze 2026-10-15-v1: správce, kontakt, účel a rozsah, právní základy, dobrovolnost, poskytovatelé, uchování, práva a dozorový úřad. Původní demo verze archivovaná.
- Expirace hlavního kontaktu po 30 dnech od nové žádosti, kaskádové odstranění žádostí; stejný request ID lhůtu neprodlužuje. SQL výmaz i vazby testované ve skutečném PostgreSQL přes PGlite. Hodinový Cron přímo ověřený 15. 10. 2026: clientelo-contact-retention, schedule 0 * * * *, active=true, poslední běh 15. 10. 2026 ve 12:00 Europe/Prague Succeeded.
- Uživatel se výslovně zavázal trvale mazat kopie odeslaných zpráv v Gmailu nejpozději po 30 dnech. Aplikace má jen send scope a tento výmaz neprovádí.

## Co je potřeba doložit pro konečné uzavření

| Oblast | Ověřená skutečnost | Co ještě nelze tvrdit |
| --- | --- | --- |
| Vercel Hobby | Veřejný DPA výslovně vymezuje zpracování v roli zpracovatele pro Pro a Enterprise; obecné podmínky na něj odkazují. | Nemáme doložené použitelné smluvní pokrytí zpracování formulářových údajů na současném Hobby tarifu. Nestačí přidat odkaz na DPA nebo změnit text na stránce. |
| Osobní Gmail | Google výslovně uvádí, že spotřebitelský Gmail nemá DPA a Google pro něj nevystupuje jako zpracovatel. | Nelze osobní Gmail automaticky označit jako smluvního zpracovatele podle podmínek Workspace. Je nutné posoudit konkrétní role a předání, nebo zvolit službu s použitelnými podmínkami. Samotná absence DPA není právní posouzení všech možných způsobů použití. |
| Supabase | Projekt Europe, soukromé schéma; zveřejněný DPA upravuje role a předávání. | Přesná smluvní dokumentace konkrétního účtu a doby uchování všech infrastrukturních údajů nebyly od provozovatele doložené. |
| Retence a zálohy | Aplikační expirace a výmaz mají testy; aktivní hodinový Cron a úspěšný běh dnes ve 12:00 přímo ověřené v Supabase. Snímek bez kontaktních údajů uložený mimo repo. | Výmaz v hlavní databázi není garance současného vymazání záloh a infrastrukturních záznamů. Konkrétní poskytovatelské lhůty je nutné doložit. |

Možnosti uzavření: doložit a posoudit použitelné podmínky stávajícího uspořádání, nebo upravit poskytovatele/tarify tak, aby odpovídaly zamýšlenému veřejnému provozu, a podle skutečnosti upravit informační stránku. Google má také nabídky Workspace používající osobní účet; jejich dostupnost, rozsah DPA a použitelnost pro tento účet je nutné ověřit před volbou. Zde žádný upgrade ani nová smlouva neproběhly.

Podpis nebo přijetí smluv a případného placeného tarifu musí provést provozovatel ve svém účtu. Uživatel zatím neautorizoval konkrétní nákup. Potvrzení „hotovo“ v checklistu tyto skutečnosti nedoplňuje.

## Evidence a provozní postup

1. Pro kontrolu údržby použít supabase/verify-retention.sql. Z výsledků zaznamenat jen jobname, schedule, active, status a čas posledního úspěšného běhu, bez adres a klíčů. Při chybě úlohy ověřit Cron a funkci před slibováním automatického výmazu.
2. Při žádosti o výmaz přiměřeně ověřit identitu, najít odpovídající kontakt v Supabase a nevratný výmaz provést až po výslovném potvrzení konkrétního rozsahu. Kaskáda smaže související žádosti. Samostatně řešit kopie v Gmailu a případné zálohy podle doložených podmínek. Není zavedený automatický export kontaktů.
3. Při nejistém výsledku Gmail send neodemykat žádost automaticky. Zkontrolovat Odeslané podle soukromého záznamu; nový pokus jen po vyjasnění výsledku. Přijetí poskytovatelem není automatický důkaz příjmu do schránky.
4. Při změně poskytovatele nebo účelu nejprve aktualizovat informace a PRIVACY_NOTICE_VERSION, zachovat archiv, nasadit a zopakovat kontrolovaný test. Starý otevřený formulář vrátí privacy_changed. Newsletter ani další marketing nejsou součástí nynějšího účelu.
5. Před širším provozem ověřit životnost OAuth oprávnění a očekávaný objem e-mailů podle skutečného účtu. Soukromé refresh tokeny neukládat do protokolů. Vypnutí formuláře je GUIDE_ENABLED=false a nový deployment; nelze tím smazat existující údaje.

## Primární podklady

Kontrola 15. 10. 2026:

- [Vercel DPA](https://vercel.com/legal/dpa), oddíly 1 a 4: rozsah Pro/Enterprise.
- [Google Privacy Help Center](https://support.google.com/policies/answer/9581826/privacy-help-center), Enterprise customer requests & resources: spotřebitelský Gmail, absence DPA a role Googlu.
- [Workspace Individual – použitelnost podmínek zpracování](https://support.google.com/google-workspace-individual/answer/10757067): podmíněná možnost pro příslušnou službu, nikoliv důkaz sjednání na tomto účtu.
- [Supabase DPA](https://supabase.com/legal/customer-resources/data-processing-addendum), [zálohy](https://supabase.com/docs/guides/platform/backups).
- [Vercel runtime logy](https://vercel.com/docs/logs/runtime), [Google předávání](https://policies.google.com/privacy/frameworks).

Tato evidence není právní stanovisko. Otevřené položky se nesmějí prezentovat jako splněné jen proto, že odesílací API funguje.
