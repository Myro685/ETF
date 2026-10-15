# Nasazení na Vercel

Veřejná adresa: https://etf-gold.vercel.app/
Projekt: myro685s-projects/etf, Hobby, GitHub Myro685/ETF, produkční větev main. Založil a první nasazení provedl uživatel.

## Kontrola 15. 10. 2026

GET bez cookies/přihlášení: hlavní stránka 200 HTML s Clientelo; lokální veřejné vydání PDF 200 application/pdf, 86 902 bytů a platná hlavička. Konfigurační API původně 500 FUNCTION_INVOCATION_FAILED. Vercel runtime log ukázal ERR_MODULE_NOT_FOUND: emitovaný api/guide-config.js importoval neexistující server/http.ts.

Příčina: Vercel nepřebírá TypeScript project references z kořenového tsconfig. Přidané kořenové compilerOptions NodeNext, ES2023 a rewriteRelativeImportExtensions. Lokální Node dál pracuje se zdrojovými .ts; produkční emit přepisuje relativní importy na .js. Nový regresní test přeloží oba API vstupy z kořenové konfigurace a skutečně spustí emitovaný konfigurační handler v samostatném procesu. 17 testů, lint a build úspěšné. Dva první HTTP testy sandbox odmítl EACCES; po povolení loopbacku prošly, bez živého send. Oprava ověřená také na živé doméně po automatickém nasazení: GET /api/guide-config vrací 200 application/json s available=false a privacy=null. Služba se správně hlásí jako dosud nenakonfigurovaná.

## Soukromá produkční konfigurace

Ignorovaný .env.vercel.local je připravený z lokálních serverových proměnných pro tento projekt, APP_ORIGIN=https://etf-gold.vercel.app a GUIDE_ENABLED=false. Soubor obsahuje tajné hodnoty: nevkládat do Gitu, chatu ani screenshotu. Dosud nenahraný do Vercelu.

V nastavení konkrétního projektu otevřít Environment Variables. Importovat/přidat serverové proměnné pouze pro Production; klíče a refresh token ukládat jako Secret, bez prefixu VITE_. Nenastavovat GUIDE_ENABLED=true před finální informační stránkou a akceptačním testem. PRIVACY_POLICY_URL a PRIVACY_NOTICE_VERSION zatím chybí; prázdné hodnoty nepovažovat za hotové. Změny prostředí platí pro nové deploymenty, proto po doplnění provést redeploy.

Podklad: https://vercel.com/docs/environment-variables a https://vercel.com/docs/functions/runtimes/node-js (kontrola 15. 10. 2026).

## Demo po importu a redeployi

Uživatel potvrdil import a redeploy. Read-only ověřený seznam 11 Secret proměnných Production, nikoliv jejich hodnoty; MAIL_PROVIDER chyběl. API odpovídá 200 a zatím available=false.

Uživatel následně zvolil ukázkový projekt pro hodnocení a zavázal se trvale mazat kopie testovacích zpráv z Gmailu nejpozději po 30 dnech. Přidaný GUIDE_DEMO_MODE=true omezuje server na přesnou normalizovanou PRIVACY_CONTACT_EMAIL. UI omezení samo není bezpečnostní kontrola; samostatný test ověřuje odmítnutí cizí adresy i plus aliasu před jakýmkoliv fetch/storage/send.

Veřejná informační stránka: /ochrana-udaju.html, verze 2026-10-15-demo-v1. Lokální .env.local a úplný soukromý export doplněné, ale stále GUIDE_ENABLED=false. Zvláštní ignorovaný .env.vercel-demo.local obsahuje jen čtyři doplňující položky: MAIL_PROVIDER=gmail, GUIDE_DEMO_MODE=true, PRIVACY_POLICY_URL a PRIVACY_NOTICE_VERSION. Na Vercelu je přidat pro Production; teprve potom změnit existující GUIDE_ENABLED na true a redeploy.

Vercel DPA výslovně vymezuje Pro/Enterprise, zatímco obecné podmínky odkazují na DPA; automatickou použitelnost pro Hobby netvrdíme. Ukázka není potvrzením právní připravenosti pro skutečný veřejný sběr. Provozní fakta a omezení jsou přiznaná v informacích.

18 automatických testů, lint/build a vizuální kontrola syntetické demo scény prošly. Zamčené pole, výslovné vysvětlení a přechod do potvrzení s PDF ověřené v prohlížeči bez živého send.

Po automatickém nasazení veřejné GET /ochrana-udaju.html vrací 200 a ověřenou verzi 2026-10-15-demo-v1. V Notion odškrtnuté informace o zpracování pro uživatelem zvolený demo rozsah; skutečné uložení a celá cesta doručení zůstávají otevřené do živého formulářového testu. Nový skutečný e-mail zatím neposlaný.
