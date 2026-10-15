# Aktivace doručení průvodce

Stav 14. 10. 2026: uživatel zvolil Supabase + Resend, účty ještě nemá. Správce a zveřejnitelný kontakt jsou známé. Uživatel potvrdil, že zatím nemá vlastní odesílací doménu. Formulář zůstává vypnutý, dokud není možné pravdivě potvrdit celý proces.

## 1. Účty a přístupy

Provozovatel založí účet na [Supabase](https://supabase.com/dashboard) a [Resend](https://resend.com/signup). Hesla, přihlášení a smluvní souhlasy vyřídí ve svém prohlížeči. Do chatu neposílat tajné klíče. Výběr případného placeného tarifu není touto přípravou autorizovaný.

V Supabase vytvořit projekt, přednostně v odpovídajícím evropském regionu, a zaznamenat skutečný region. Do soukromého `.env.local` doplnit URL projektu a serverový secret key. Používáme `SUPABASE_SECRET_KEY`, nikoliv veřejný publishable key. Klíč se nikdy nepředává Reactu.

## 2. Databáze a retence

V SQL editoru vybraného projektu spustit jednou `supabase/001-guide.sql`. Migrace vytváří dvě tabulky s RLS a tři serverové funkce; anonymní klient nemá přístup ke kontaktům. Nespouštět naslepo nad dříve vytvořenými tabulkami.

Zapnout Supabase Cron a vytvořit hodinovou úlohu:

```sql
select cron.schedule(
  'clientelo-contact-retention',
  '0 * * * *',
  'select public.purge_expired_guide_contacts()'
);
```

Ověřit úspěšný běh a výmaz syntetického expirovaného záznamu včetně navázaných žádostí. Reálné adresy nekopírovat do logů ani dokumentace. Zálohy a uchování u poskytovatelů řeší samostatně informace o zpracování.

## 3. Odesílatel

V Resend přidat vlastní doménu, vložit požadované DNS záznamy a počkat na ověření. `GUIDE_FROM_EMAIL` musí být adresa na ověřené doméně. Gmail kontakt správce lze použít pro odpovědi, ale nelze tím doložit vlastnictví gmail.com jako odesílací domény v Resend.

Testovací odesílatel `onboarding@resend.dev` slouží omezenému testování na vlastní účet; není řešením veřejného doručování libovolným návštěvníkům. Provozní kontrola jej proto označí jako nepřipravený. DNS ani nákup domény dosud neproběhly.

## 4. PDF a informace

Hotové čtyřstránkové PDF je v `public/guides/pruvodce-etf-2026-10-14.pdf`. Vite build ho kopíruje do `dist/guides/`. Po nasazení nastavit `GUIDE_DOWNLOAD_URL` na skutečnou HTTPS adresu tohoto souboru. Původní vydání později nepřepisovat jiným obsahem; nové vydání má nové jméno, aby staré e-maily dál vedly na stejnou verzi.

Podklad `docs/privacy-notice-draft.md` obsahuje poskytnuté jméno a kontakt, ale čeká na skutečné služby, hosting, uchování a právní základ. Finální stránku publikovat až po doplnění. Její HTTPS URL a verzi nastavit jako `PRIVACY_POLICY_URL` a `PRIVACY_NOTICE_VERSION`.

## 5. Kontrola a zapnutí

```powershell
npm run check:guide
```

Kontrola nevypisuje hodnoty ani neposílá požadavky poskytovatelům. Kontroluje přítomnost hodnot, formát konfigurace podle serveru, známé nevhodné produkční odesílatele, HTTPS origin a podpis lokálního PDF. Neověřuje DNS, klíče, oprávnění, existenci tabulek ani doručení. Exit 1 znamená zbývající lokální nastavení; exit 0 není důkazem hotového bodu 7.

Po přípravě všeho výše nastavit `GUIDE_ENABLED=true`, restartovat API a otevřít formulář znovu. Aplikace potřebuje Node API vedle frontendu. Samotný statický hosting nestačí. Veřejný hosting spadá do bodu 11; zatím není vytvořený.

## 6. Akceptační test a Notion

- S provozovatelem určit konkrétní kontrolovanou testovací adresu a oprávnění poslat na ni průvodce. Zveřejnitelný kontakt správce sám o sobě není žádostí o zaslání testu.
- Vyplnit formulář, ověřit jedinou žádost při dvojkliku, jeden kontakt v Supabase a zapsané přijetí zprávy poskytovatelem.
- Otevřít skutečně přijatý e-mail, kliknout na PDF, ověřit jeho čtyři strany. Samotné API ID od Resend není potvrzením doručení do schránky.
- Ověřit okamžitý download v potvrzení, chybu, bezpečné opakování a postup odstranění testovacího kontaktu. Výmaz reálného záznamu provést až v autorizovaném rozsahu.
- Ověřit finální zveřejněné informace a retenci. Teprve poté odškrtnout zbývající tři checkboxy bodu 7 v Notion.

Oficiální dokumentace: [Supabase API keys](https://supabase.com/docs/guides/api/api-keys), [Supabase Cron](https://supabase.com/docs/guides/cron), [Supabase backups](https://supabase.com/docs/guides/platform/backups), [Resend domains](https://resend.com/docs/dashboard/domains/introduction), [Resend errors a omezení testovacího odesílání](https://resend.com/docs/api-reference/errors). Zkontrolováno 14. 10. 2026.

## Navazující změna 15. 10. 2026

Uživatel nemá vlastní doménu a pokračuje cestou Gmail API. Místní propojení připravené v docs/gmail-setup.md. Původní Resend kroky výše jsou alternativní cesta; pro zvolenou Gmail cestu není ověření vlastní domény podmínkou. Supabase, informace o zpracování a živé ověření stále zbývají.

Gmail OAuth je nyní skutečně propojené a obnovení tokenu ověřené. Nový Gmail transport i kontrola konfigurace připravené. V Supabase jsou potřeba dvě migrace v pořadí: 001-guide.sql, 002-gmail.sql. Původní Resend doména není podmínkou zvolené Gmail cesty. GUIDE_ENABLED zůstává false; nebyl odeslaný žádný skutečný e-mail.

## Supabase projekt vytvořený — 15. 10. 2026

Uživatel potvrdil vytvoření nového Supabase projektu. Pro první nastavení je připravený jediný `supabase/setup-new-project.sql`, který spojuje 001 a 002 do transakce. Použít buď tento soubor, nebo původní dvě migrace; nikoliv oba postupy. Kontrola existujících tabulek brání omylu při opakovaném spuštění. Soubor neobsahuje osobní kontakty ani klíče, neodesílá poštu a sám neplánuje Cron.

V SQL editoru nového projektu vytvořit nový dotaz, vložit celý obsah a spustit Run. Úspěch: Success / No rows returned, v public dvě nové tabulky guide_contacts a guide_requests. Teprve potvrzení výsledku znamená provedenou migraci; zatím je zaznamenané pouze vytvoření projektu podle uživatele. Potom doplnit serverový secret key soukromě do konfigurace a nastavit/ověřit hodinovou retenci.

Uživatel 15. 10. 2026 potvrdil úspěšné spuštění SQL. Schéma zatím nebylo ověřené přes API; dalším krokem je soukromé doplnění SUPABASE_URL a SUPABASE_SECRET_KEY do .env.local. Formulář zůstává vypnutý.

## Živé připojení ověřené — 15. 10. 2026

Uživatel doplnil URL a serverový klíč do .env.local. Read-only načtení OpenAPI schématu přes serverový klíč vrátilo HTTP 200 a potvrdilo dostupnost obou tabulek a funkcí register_gmail_guide_request, claim_gmail_guide_request, complete_guide_request a purge_expired_guide_contacts. Hodnoty klíčů ani kontakty se nevypsaly. Nebyl vložený kontakt ani odeslaná zpráva.

Dalším ručním krokem je v Integrations > Cron zapnout pg_cron a v SQL editoru naplánovat:

```sql
select cron.schedule(
  'clientelo-contact-retention',
  '0 * * * *',
  'select public.purge_expired_guide_contacts()'
);
```

Úloha každou hodinu trvale odstraňuje kontakty, jejichž 30denní expirace uplynula, a navázané žádosti. Neodstraňuje odeslané zprávy z Gmailu. Zatím není doložené její vytvoření nebo úspěšný běh; nelze ji uvádět jako aktivní. Zdroj: https://supabase.com/docs/guides/cron/install a https://supabase.com/docs/guides/cron/quickstart (kontrola 15. 10. 2026).

## Veřejné PDF a retence — 15. 10. 2026

Uživatel výslovně schválil publikaci průvodce v samostatném veřejném bucketu clientelo-public svého Supabase projektu. Skript `node --env-file=.env.local scripts/publish-guide.ts` vytvořil tento bucket pouze pro PDF a nahrál připravené vydání bez přepisování. Stažení bez přihlášení ověřilo MIME i shodný SHA-256; GUIDE_DOWNLOAD_URL je uložené v ignorované konfiguraci. Kontaktní tabulky ani jejich oprávnění nebyly změněné.

Uživatel potvrdil nastavení hodinového Cronu a region Europe. Samostatné ověření aktivní úlohy a historie čeká na výsledek read-only `supabase/verify-retention.sql`; navigace do Cron přehledu v prohlížeči se vracela do Database. Výmaz syntetického expirovaného kontaktu dosud neověřený. GUIDE_ENABLED zůstává false; žádný e-mail neodeslaný.
