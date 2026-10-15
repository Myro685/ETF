# Clientelo

[Veřejný web](https://etf-gold.vercel.app/) · [GitHub](https://github.com/Myro685/ETF) · [Checklist zadání](https://app.notion.com/p/3f4e1942c8af80ddacf7c7b070dea863)

Česká responzivní stránka pro porovnání ETF VOO, VTI a SCHD. Nabízí společnou tabulku, kalkulačku ročního nákladu v Kč, krátký kvíz a čtyřstránkový PDF průvodce s checklistem za e-mail. React 19, TypeScript, Vite a samostatně načítaná ilustrace v Three.js.

Aktualizováno **15. 10. 2026**. Termín zadání: **16. 10. 2026**. Podrobnosti řešení vedeme v souborech; Notion slouží pouze k odškrtávání dokončených úkolů.

## Pro koho a jaký problém řešíme

Česky mluvící člověk před prvním nákupem ETF zaměřeného na americký trh. Má účet u brokera, ví, že ETF sdružuje více akcií, a našel několik podobně vypadajících kandidátů. Na reklamu klikne kvůli konkrétním rozdílům fondů nebo srozumitelnému vysvětlení nákladů.

Hlavní problém: **neví, podle čeho několik ETF porovnat**. Používáme krátké věty, vysvětlujeme pojmy a oddělujeme údaje o fondu od nákladů a omezení konkrétního investora. Stránka neurčuje nejlepší fond pro osobní situaci.

Zdarma bez e-mailu je celé základní porovnání, kalkulačka i kvíz. Za e-mail návštěvník získá PDF s vysvětlením, příkladem poplatků a checklistem před nákupem. Formulář přichází až po užitečném obsahu; nevzniká přihlášení k newsletteru. Podrobnosti: [nabídka](docs/offer.md), [dvě textové reklamy](docs/ads.md).

## Proč jsou sekce v tomto pořadí

| Sekce | Co návštěvník řeší a proč následuje právě zde |
| --- | --- |
| Úvod | Během několika sekund vysvětlí porovnání a kalkulačku zdarma. Navazuje na obě reklamy a nabídne přímé odkazy k výsledku. |
| Společné porovnání | Dodá slíbenou hodnotu před žádostí o kontakt. Stejná kritéria vedle sebe usnadňují porovnání fondů i na mobilu. |
| Kalkulačka nákladu | Převede abstraktní procenta na částky v Kč a zapojí návštěvníka. Zobrazuje omezení modelu a neprezentuje výpočet jako výnos. |
| Vysvětlení rozdílů | Zabrání závěru, že stejný poplatek znamená stejný fond nebo že nejlevnější fond je automaticky vhodný. |
| Dobrovolný krátký kvíz | Ověří porozumění bez překážky v hlavní cestě; je ve sbalené sekci. |
| PDF a formulář | Po předvedení hodnoty nabídne materiál k pozdějšímu použití. Jediné pole snižuje námahu a jasný účel omezuje nejistotu. |
| Souvislosti a zdroje | Umožní ověřit dostupnost, rizika a původ údajů. Klíčová omezení jsou také přímo u tabulky a kalkulačky, nejsou schovaná jen na konci. |

Struktura sleduje cestu **příslib → užitečný výsledek → pochopení → důvod uložit si obsah → kontakt**. Současný vzhled: [design](docs/design-2026-10-11.md), [střídmé animace a omezení pohybu](docs/motion.md). Dřívější návrhy v MagicPath a Atlas jsou historické podklady.

## Data a rozhodnutí při nejasnostech

Jednotným zdrojem údajů pro web je [src/data/etfs.json](src/data/etfs.json), typování a formátování zajišťuje [src/data/etfs.ts](src/data/etfs.ts). U údajů jsou zdroje a datum ověření. Webový datový podklad uvádí **9. 10. 2026**; primární podklady PDF byly znovu prověřené **14. 10. 2026**. Tyto odlišné kontroly nezaměňujeme za automatickou každodenní aktualizaci.

| ETF | Úloha v porovnání | Roční nákladovost fondu |
| --- | --- | --- |
| VOO | Velké americké společnosti, S&P 500 | 0,03 % |
| VTI | Široký americký akciový trh včetně menších společností | 0,03 % |
| SCHD | Výběr amerických dividendových společností | 0,06 % |

Nákladovost není celkový náklad investora: model nezahrnuje brokera, spread, měnovou konverzi a daně. Nepředpovídá výnos a používá konstantní hodnotu investice.

Všechny tři fondy mají listing na **NYSE Arca**, samostatné burze skupiny NYSE. Striktní požadavek na hlavní trh NYSE tím není splněný; při takovém výkladu zadání je nutné výběr změnit. Dostupnost pro český retail závisí na brokerovi, účtu, dokumentu KID a způsobu služby. Konkrétní nákup těchto tickerů na účtu nebyl ověřený. CFD nepovažujeme za přímé vlastnictví ETF.

VTI používá aktuální název Vanguard Morningstar Total Stock Market ETF a Morningstar US Total Market Index, účinné od 29. 7. 2026. Primární zdroje emitentů, burzy, ČNB a brokerů a důvody výběru jsou v [ETF rešerši](docs/etf-research.md). Neuvádíme rychle zastarávající ceny ani smyšlené výnosy.

## Očekávaná konverze a jak ji ověřit

**Pracovní hypotéza je 3 % získaných kontaktů z relevantních návštěv, s plánovacím rozpětím 2–5 %. Jde o vlastní odhad, nikoliv oborový benchmark nebo naměřený výsledek.** Předpokládáme české publikum odpovídající popsané cílové skupině a návštěvy z tematicky souvisejících reklam.

Ilustrativní model: z 1 000 návštěv se 200 lidí dostane k nabídce PDF, 60 začne vyplňovat formulář a 30 úspěšně získá průvodce. Výsledkem je 30 / 1 000 × 100 = 3 %. Hodnoty modelu jsou předpoklady. Přehled zdarma, konkrétní příklad nákladů a jediné pole mají pomáhat konverzi; úzký obsah, důvěra k novému webu a omezená dostupnost amerických ETF ji mohou snížit. Pět procent je příznivý scénář, dvě procenta opatrnější scénář; ani jedno není slib.

Konverze = **počet nově získaných unikátních kontaktů / počet návštěv × 100**. Opakované odeslání stejného kontaktu se nepočítá jako další nový kontakt. Vlastní testy je nutné z vyhodnocení vyřadit. Jeden úspěšný technický test není obchodní konverze.

**Skutečná konverze zatím není známá.** Bod 8 (měření návštěv, zdrojů a událostí) není implementovaný; nemáme odpovídající jmenovatel a nelze uvést ani poctivých 0 %. Po zavedení měření budeme porovnávat reklamy, průchod ke kalkulačce, nabídce a formuláři a počet nových kontaktů. Případný souhlas a informace pro analytiku je potřeba vyřešit před jejím zapnutím.

## Tři A/B hypotézy podle očekávaného dopadu

Pořadí je odhad, ne výsledek testování. Varianty zatím nejsou nasazené.

| Pořadí | Co a jak porovnat | Hypotéza a důvod pořadí | Vyhodnocení |
| --- | --- | --- | --- |
| 1 — nejvyšší očekávaný dopad | A: současná nabídka „Rozdíly si uložte. Checklist vezměte s sebou.“ B: „4 strany, které vám usnadní porovnání ETF před nákupem.“ Ostatní obsah a formulář zachovat. | Konkrétní rozsah a výsledek mají snížit nejistotu před poskytnutím e-mailu. Test zasahuje přímo důvod kontakt zanechat. | Primárně nové kontakty / návštěvy; podpůrně zahájení a dokončení formuláře u lidí, kteří nabídku viděli. |
| 2 — střední očekávaný dopad | A: současná výzva pod kalkulačkou „Jak náklady číst? Podívejte se, co bude v průvodci“. B: „Získat vysvětlení nákladů a checklist zdarma“. Pozici odkazu zachovat. | Návštěvník právě získal vlastní výsledek. Přímější pojmenování navazující hodnoty může zvýšit přechody k formuláři. | Primárně nové kontakty / návštěvy; podpůrně kliknutí z kalkulačky na nabídku. |
| 3 — nižší očekávaný dopad | A: současný úvod „Než koupíte ETF, poznejte rozdíly.“ B: „VOO, VTI, nebo SCHD? Porovnejte rozdíly a náklady v Kč.“ Ostatní prvky zachovat. | Konkrétní tickery a výsledek mohou rychleji potvrdit shodu s reklamou. Dopad na kontakty je vzdálenější než změna samotné nabídky. | Primárně nové kontakty / návštěvy; podpůrně použití kalkulačky a dosažení nabídky. |

Více kliknutí bez více získaných kontaktů není samo vítězství.

Spouštět vždy jeden test, návštěvníky náhodně rozdělit 50/50 a držet variantu pro stejného návštěvníka. Vyvážit zdroje reklam; neměnit současně text, publikum a pozici formuláře. Před startem určit délku a potřebný vzorek podle výchozí konverze a minimálního zajímavého rozdílu, zahrnout celé týdenní cykly a neukončovat po několika úspěších. Malý nebo neprůkazný rozdíl označit jako neprůkazný. Kontrolovat chyby odeslání a doručování, aby technická porucha nebyla vydávána za horší nabídku. Návrh neznamená spuštění placené kampaně.

## Spuštění projektu

Vyžaduje **Node.js 24 LTS a npm**. Závislosti určuje package-lock.json.

```powershell
cd C:\Users\miros\Projects\clientelo
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Kopírování konfigurace platí pro nové nastavení; existující soukromou konfiguraci nepřepisovat. Vite standardně běží na http://127.0.0.1:5173. Ve druhém terminálu spustit:

```powershell
npm run dev:api
```

Místní Node API běží na portu 5174, Vite předává /api na tento server. Samotné npm run preview poskytuje pouze statický frontend. Bez kompletní konfigurace formulář pouze ověří formát adresy a výslovně hlásí, že nic neukládá ani neposílá.

### Služby a serverové proměnné

Skutečné hodnoty patří do ignorované .env.local nebo prostředí hostingu. **Žádný tajný klíč nemá prefix VITE_ a neposílá se do klientského bundlu.**

| Proměnné | Nastavení |
| --- | --- |
| APP_ORIGIN | Přesný origin bez koncového lomítka: místně http://127.0.0.1:5173, produkčně https://etf-gold.vercel.app. |
| SUPABASE_URL, SUPABASE_SECRET_KEY | URL vlastního projektu a serverový secret key; publishable key nestačí. |
| MAIL_PROVIDER | gmail pro současnou cestu; resend zůstává připravená alternativa. |
| GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN | Soukromé OAuth údaje pro Gmail; minimální rozsah pouze gmail.send. |
| GUIDE_FROM_EMAIL | Adresa připojeného odesílacího účtu. |
| GUIDE_DOWNLOAD_URL | Veřejná HTTPS adresa vydání PDF, které se později nepřepisuje jiným obsahem. |
| PRIVACY_CONTROLLER_NAME, PRIVACY_CONTACT_EMAIL | Správce a zveřejnitelný kontakt. |
| PRIVACY_POLICY_URL, PRIVACY_NOTICE_VERSION | Aktuálně https://etf-gold.vercel.app/ochrana-udaju.html a 2026-10-15-v1; verze se mění vědomě s obsahem. |
| GUIDE_DEMO_MODE | false umožní zadat jinou platnou adresu; true přijme pouze kontaktní adresu správce a zamkne pole. |
| GUIDE_ENABLED | Výchozí false. true až po přípravě databáze, odesílatele, informací a provozních podmínek. |
| RESEND_API_KEY | Jen pro alternativní provider resend; vyžaduje odpovídající ověřeného odesílatele. |

V novém prázdném Supabase projektu spustit **buď** [setup-new-project.sql](supabase/setup-new-project.sql), **nebo** postupně 001-guide.sql a 002-gmail.sql; ne oba postupy. Schéma má neveřejné tabulky, RLS a serverové funkce. Nastavit hodinový Cron pro purge_expired_guide_contacts; kontakt a navázané žádosti expirují po 30 dnech od poslední nové žádosti. Kontrola úlohy je v [verify-retention.sql](supabase/verify-retention.sql). Provozní postup: [ochrana a uchování údajů](docs/privacy-operations.md).

Pro Gmail použít npm run connect:gmail podle [návodu](docs/gmail-setup.md), schválení účtu provádí uživatel. Přístupové údaje zůstávají v ignorované private-data a .env.local. OAuth helper nic neodesílá. Refresh token v testovacím OAuth režimu může mít omezenou platnost; podmínky produkčního OAuth jsou součástí tohoto návodu.

### Produkční nasazení

Vercel projekt je napojený na main repozitáře Myro685/ETF. Změny z main spouštějí automatické nasazení. V projektu použít Vite, build npm run build, výstup dist a Node.js 24; adresář api obsahuje serverové funkce. Kořenový tsconfig přepisuje relativní .ts importy na .js pro produkční API; regresní test spouští skutečný JavaScriptový výstup.

Serverové proměnné nastavit pro Production, klíče jako Secret. Změny prostředí platí pro nové deploymenty, po jejich úpravě je nutný redeploy. API GET /api/guide-config vrací dostupnost a veřejné informace o správci; žádné klíče. [Podrobný postup a evidence nasazení](docs/deployment.md).

### Kontroly

```powershell
npm run lint
npm run test
npm run build
npm run check:guide
```

check:guide vypisuje jen názvy chybějících kontrol bez hodnot. Kontroluje místní konfiguraci, neposílá e-mail ani neověřuje skutečné doručení. Build obsahuje kontrolu TypeScriptu; jeho úspěch nenahrazuje vizuální a koncový test.

## Co je ověřené a co zbývá

- Frontend, kalkulačka, kvíz, informace o fondech a čtyřstránkové PDF jsou implementované. PDF má české znaky a klikatelné primární zdroje; [generátor](scripts/generate-guide.py) používá data projektu, vyžaduje Python, reportlab a Arial. PDF není nutné generovat při každém buildu.
- **18 automatických testů prošlo** při poslední změně kódu 15. 10. 2026. Pokrývají výpočty, vstupy, klientské chyby, HTTP, OAuth, MIME, skutečné PostgreSQL migrace v PGlite, kvóty, souběh, nejistý výsledek, výmaz, soukromí konfigurace, režimy formuláře a kompilovaný Vercel handler. Simulovaný provider v testech není doklad příjmu zprávy.
- Skutečný formulářový test uživatel potvrdil včetně potvrzení, e-mailu a PDF. V Supabase následně ověřený jeden kontakt, jedna žádost a zaznamenané přijetí Gmailem. Interní test nepočítáme do konverze.
- Produkční API 200, available=true, demoOnly=false, aktuální informační stránka dostupná. Na živém webu ověřené prázdné upravitelné pole; následná kontrola se syntetickou adresou nebyla odeslaná.
- Dřívější browser kontrola šířek 320, 390, 768 a 1 440 px je zaznamenaná v docs/design.md; neznamená dokončené testování měření ani plný screen reader audit. Pohyb respektuje prefers-reduced-motion.
- **Bod 7:** technické ukládání a doručení funguje. Zbývá uzavřít doložení provozních a smluvních podmínek pro veřejný sběr; publikovaný informační text je nenahrazuje. Konkrétní stav a další kroky jsou v docs/privacy-operations.md.
- **Bod 8:** měření není implementované. Skutečná konverze není známá; A/B hypotézy nejsou spuštěné.
- **Body 10–12:** úplné exporty AI konverzací, závěrečná kontrola tajných údajů v historii, souhrnný test nasazeného webu včetně měření a odevzdání ještě nejsou hotové. Původní zadávací e-mail nebyl načtený a odevzdávací zpráva nebyla odeslaná.
- Vite upozorňuje na samostatný 3D chunk přibližně 530 kB. Mobilní LCP v reálné síti není změřené. Žádná placená reklama neběží.

## Spolupráce s AI a orientace v repozitáři

Používáme Codex. AI dostala pokyny načíst Notion zadání, připravit varianty cílové skupiny, vytvořit React projekt, rozvíjet schválený vzhled, průběžně ověřovat fakta a zapisovat stav do souborů. Uživatel schvaloval cílovou skupinu, nabídku, vzhled a změny režimu formuláře. Projektové instrukce jsou v AGENTS.md a .agents/rules/project.md; před použitím konkrétního skillu čteme jeho SKILL.md.

Výstupy kontrolujeme proti zadání, primárním zdrojům, automatickým testům a v prohlížeči; skutečné doručení potvrzuje uživatel, databázové přijetí ověřujeme samostatně. Konkrétní opravy AI (například politika Origin u OAuth nebo přípony importů na Vercelu) a omezení kontrol jsou v [ai-log](ai-log/). Zápisy jsou pravdivé pracovní souhrny, **ne úplný export konverzace**. Úplné exporty a způsob jejich pořízení zbývají v bodu 10. Historii instalací a použitých designových skillů zachovávají ai-log a docs/design-2026-10-11.md.

| Umístění | Účel |
| --- | --- |
| src/ | React stránka, kalkulačka, kvíz a formulář |
| src/data/etfs.json | Jednotná data, zdroje a datum ověření |
| server/, api/, supabase/ | Doručovací proces, HTTP handlery a migrace |
| public/guides/, public/ochrana-udaju.html | PDF a aktuální informace o zpracování |
| docs/project.md, docs/decisions.md | Přehled požadavků a rozhodnutí |
| docs/ | Podrobnosti nabídky, reklam, dat, vzhledu, formuláře a provozu |
| tests/ | Syntetické automatické testy a lokální náhled formuláře |
| .agents/, AGENTS.md | Pravidla a projektové skilly |
| ai-log/ | Souhrny spolupráce a místo pro budoucí exporty |

Tajné konfigurace, OAuth soubory, soukromé záznamy zpráv a data kontaktů se do repozitáře neukládají. Podrobný stav všech bodů je v [přehledu projektu](docs/project.md).
