# Formulář a doručení — bod 7

Datum: 2026-10-09. **Hotová implementace formuláře a připravené serverové napojení; skutečné služby a doručení zatím nejsou aktivované.** Uživatel požádal zaměřit se na formulář. K úplnému bodu 7 zbývá skutečný Supabase projekt, Resend s ověřeným odesílatelem, PDF, údaje správce, publikované informace o zpracování a koncový test.

## Chování návštěvníka

Jedno pole e-mail po užitečném porovnání. Validace při opuštění vyplněného pole a při odeslání, mezery na okrajích se odstraní. Přijímáme běžné ASCII adresy včetně plus aliasů; mezinárodní adresy s neASCII lokální částí nejsou podporované. Chyba zaměří pole. Při odesílání text „Odesíláme…“, readonly pole a deaktivované tlačítko; synchronní zámek zabrání i dvěma kliknutím před překreslením.

Samostatné stavy pro chybu uložení, chybu odeslání, timeout, přerušenou síť, limit žádostí a změnu informací o zpracování. Při nejasném síťovém výsledku netvrdíme, že žádost nebyla uložená. Retry používá stejný identifikátor; změna adresy vytvoří nový. Identifikátor ani e-mail se neukládají do localStorage, měření nebo logů.

Potvrzení vznikne až po uložení kontaktu, přijetí e-mailu poskytovatelem a zapsání jeho ID. Text říká „předali k odeslání“, nepotvrzuje doručení do schránky. Poté je dostupný odkaz ke stažení skutečného PDF. Adresa se z pole vymaže a focus přejde na potvrzení. Marketingový odběr nevzniká.

Nenastavená instalace nabízí pouze místní kontrolu formátu e-mailu; viditelně uvádí, že nic neukládá. Tlačítko zní „Zkontrolovat e-mail“. Server rovněž vrací unavailable. Neexistuje přepínač falešného úspěchu na hlavní stránce.

## Připravené služby

Výchozí návrh: Supabase pro kontakty, Resend pro transakční e-mail. Uživatel byl požádán o preferenci; tuto volbu lze před aktivací změnit. V aplikaci nejsou nové produkční závislosti, REST volání probíhají jen na serveru. Tajné klíče nemají VITE_ prefix a public config je nikdy nevrací.

POST /api/guide validuje adresu, UUID žádosti, aktuální verzi informací o zpracování, Content-Type, velikost těla a shodu Origin s nastavenou adresou aplikace. Před záznamem kontroluje dostupnost PDF, MIME a podpis %PDF-. Supabase RPC atomicky registruje jedinečný kontakt a žádost. Stejná žádost vrátí původní neměnný e-mailový payload; Resend dostává stejný Idempotency-Key. Úspěšné opakování vrátí již zaznamenané doručení poskytovateli. Nevyřízené žádosti starší 23 hodin se neodesílají pod starým klíčem. Pro jednu adresu nejvýše 3 nové žádosti za hodinu; veřejné nasazení musí doplnit i ochranu před hromadnými robotickými požadavky na úrovni hostingu.

Schéma v supabase/001-guide.sql. RLS zapnuté, anonymní a přihlášení uživatelé nemají čtení tabulek ani execute RPC. Server má jediný potřebný vstup přes service_role. Ukládáme e-mail, časy, verzi informace o zpracování a stav žádosti, bez IP a výsledků kvízu. Výmaz kontaktního záznamu smaže navázané žádosti.

Návrh doby uchování v implementaci je 30 dní od nové žádosti, poté výmaz při hodinové údržbě; musí být sladěný se skutečnými informacemi a nastaveným Cronem. Při opakování stejné žádosti se lhůta neprodlužuje. Existuje funkce purge_expired_guide_contacts; její běh v Supabase Cron je nutné nastavit a ověřit. Uchování u e-mailového poskytovatele, zálohy, zpracovatelské podmínky a případné předávání musí popsat provozovatel podle skutečně zvolených služeb. Nejde o dokončené právní posouzení.

## Spuštění a aktivace

1. Založit/vybrat skutečné služby; smluvní či účtové kroky řeší provozovatel. V Supabase spustit SQL migraci a nastavit hodinovou údržbu.
2. Ověřit odesílací doménu v Resend. Připravit skutečné PDF na stabilní veřejné HTTPS adrese.
3. Doplnit skutečné jméno/název správce a kontaktní e-mail; připravit a publikovat informace o zpracování. Uvést účel, právní základ, příjemce, uchování, případné předávání, práva a kontakt podle skutečného provozu. Bez těchto údajů neposkytujeme smyšlenou hotovou informační stránku.
4. .env.example zkopírovat do ignorovaného .env.local. Nastavit APP_ORIGIN přesně podle použité adresy a ostatní proměnné, GUIDE_ENABLED=true až při připraveném obsahu a službách. Klíče zadat soukromě do prostředí; ne do chatu nebo Gitu. SUPABASE_SECRET_KEY je serverový sb_secret_ klíč, podporovaný také starší service_role JWT.
5. Dva terminály: npm run dev:api a npm run dev. API poslouchá jen na 127.0.0.1:5174, Vite proxy předává /api. Samostatné api/ handlery jsou připravené pro Node serverless hosting; veřejné nasazení nebylo provedeno. Static npm run preview API samo nespouští.
6. S kontrolovanou testovací adresou ověřit skutečný záznam, přijetí do schránky, funkční PDF a mazání; poté lze dokončit zbývající checkboxy bodu 7. Souhlas uživatele s konkrétním testovacím adresátem musí předcházet skutečnému odeslání.

## Ověření

9 automatických testů prošlo spolu s dosavadními interaktivními funkcemi. PGlite jako výhradně vývojová závislost spouští skutečné PostgreSQL schéma v paměti se syntetickými adresami: uložení, retry, jedinečnost kontaktu, kvóta, expirovaná žádost, oprávnění a kaskádový výmaz. Testy klienta a serveru pokrývají chybějící konfiguraci, validaci, Origin, verzi informací, neexistující PDF, chybu databáze, poskytovatele a dokončení, timeout a neplatné potvrzení. Poskytovatelé jsou simulovaní; testy nepředstavují ověření živého Supabase ani doručení přes Resend.

Oddělená tests/form-preview.html (pouze Vite vývoj, není vstupem do produkčního buildu) zkontrolovaná v prohlížeči: chybná adresa a focus, skutečný dvojklik při čekání → jeden požadavek, deaktivace a readonly pole, potvrzení a focus, zachování pole po chybě a opakování, výpadek. Je viditelně označená jako test; nevytváří kontakt ani mail. Šířky 320/390/768/1440 px bez přetékání i s dlouhými chybami. Hlavní web ověřený v nenastaveném režimu. Vstupy po kontrole vymazané. Lint a build zahrnují i serverové TypeScript soubory. Plný screen reader a 200% zvětšení zůstávají neověřené.

## Primární podklady

- [Resend: Send Email](https://resend.com/docs/api-reference/emails/send-email) — API formát a přijetí k odeslání.
- [Resend: Idempotency Keys](https://resend.com/docs/dashboard/emails/idempotency-keys) — okno 24 hodin a stejný payload.
- [Supabase: API keys](https://supabase.com/docs/guides/getting-started/api-keys) — serverové secret klíče a service_role.
- [Supabase: Database functions](https://supabase.com/docs/guides/database/functions) — oprávnění funkcí a search_path.
- [Supabase: Cron](https://supabase.com/docs/guides/cron) — pravidelný výmaz.
- [GDPR, článek 13 — EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj) — požadované informace při získávání údajů; konkrétní znění musí odpovídat provozovateli.
- [PGlite](https://pglite.dev/docs/) — PostgreSQL pro lokální integrační testy, ne úložiště návštěvníků.
