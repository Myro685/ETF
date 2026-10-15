# Aktivace a ověření doručení průvodce

Aktuální stav 15. 10. 2026: [veřejný web](https://etf-gold.vercel.app/) i Gmail/Supabase formulář jsou aktivní. Režim umožňuje libovolnou platnou adresu. Test doručení a PDF potvrdil uživatel; kontakt a přijetí zprávy jsou ověřené v databázi. Poslední nedokončenou částí bodu 7 je doložení podmínek veřejného zpracování podle [provozního přehledu](privacy-operations.md).

## Nové prostředí

1. Node.js 24, npm ci, vlastní soukromá .env.local podle .env.example. Existující soukromé soubory nepřepisovat. Podrobný přehled proměnných je v README.
2. V novém prázdném Supabase projektu spustit setup-new-project.sql, nebo jednotlivě 001 a 002. Vytvoří neveřejné tabulky a serverové funkce; nepoužívat oba postupy nad stejným projektem. Uložit URL a serverový secret key, nikoliv publishable key.
3. Nastavit hodinový Cron pro public.purge_expired_guide_contacts(). Ověřit active, schedule a historii pomocí verify-retention.sql. Při problému se schedulerem zastavit příslib automatického výmazu a opravit úlohu.
4. Pro Gmail provést npm run connect:gmail podle gmail-setup.md. Propojit správný účet, jen gmail.send. Získat případné odpovídající smluvní/provozní pokrytí. Alternativa Resend vyžaduje svůj klíč a ověřeného odesílatele; není aktivní současnou cestou.
5. Zveřejnit konkrétní vydání PDF a odpovídající informační stránku. Nastavit její verzi; neodkazovat na pracovní návrh. GUIDE_DEMO_MODE=true je omezený test jen na kontakt správce, false veřejné zadání.
6. Spustit npm run check:guide. Kontroluje formáty a přítomnost konfigurace bez výpisu klíčů, neposílá test. Teprve po vyřešení celého nastavení a podmínek zapnout GUIDE_ENABLED=true. Ve Vercelu použít Production a nový deployment; u lokálního běhu restartovat dev:api.

## Kontrolovaný koncový test

Použít pouze adresu, jejíž příjemce test výslovně vyžádal. Zveřejněný kontakt nebo klíče nejsou samy oprávněním poslat další zprávu. Dosavadní skutečný test již proběhl a není nutné jej kvůli editaci dokumentace opakovat.

- Otevřít formulář s aktuální konfigurací a informacemi. Odeslat jednu žádost; souběžný dvojklik nemá vytvořit druhý pokus.
- Ověřit jeden kontakt a žádost v Supabase, přijetí zprávy a navázaný mail_id. Adresy ani mail ID nekopírovat do dokumentace.
- Příjemce potvrdí zprávu ve své schránce a otevře čtyřstránkové PDF z odkazu. Samotný stav poskytovatele není důkaz příjmu.
- Ověřit potvrzení a přímé stažení na stránce. Chyby a opakování ověřovat syntetickými testy, které neodesílají reálné zprávy.
- Při delivery_uncertain automaticky neopakovat Gmail send. Provozovatel musí ověřit skutečný výsledek ve své schránce.

## Doložené výsledky

| Kontrola | Výsledek |
| --- | --- |
| Veřejná stránka, API a PDF | Dostupné bez přihlášení, API 200. |
| Úspěšný průchod formulářem | Potvrzený uživatelem 15. 10. 2026 včetně e-mailu a PDF. |
| Databáze po testu | 1 kontakt, 1 žádost, zapsané přijetí Gmailem; osobní údaje nevystavené. |
| Veřejný režim | available=true, demoOnly=false, prázdné upravitelné pole. Syntetická browser kontrola pole nebyla odeslaná. |
| Informace o zpracování | /ochrana-udaju.html, verze 2026-10-15-v1; doplněný text nenahrazuje doložení podmínek poskytovatelů. |
| Retence | Aktivní hodinový Cron 0 * * * *; přímo ověřený běh 15. 10. 2026 12:00 Europe/Prague Succeeded. |
| Automatické kontroly | 23 testů, lint a build při poslední změně kódu prošly. |
| Konečné uzavření bodu 7 | Čeká na doložení/posouzení smluvních a provozních podmínek podle privacy-operations.md. |

## Notion

Ukládání, potvrzení a doručení jsou odškrtnuté podle skutečných důkazů. Poslední checkbox se uzavře až po vyřešení otevřených podmínek pro současný veřejný rozsah, ne pouhým přepsáním dokumentu. Detailní evidence patří do souborů, Notion obsahuje jen checklist.
