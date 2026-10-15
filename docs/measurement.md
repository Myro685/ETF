# Měření — bod 8

Vlastní měření přes `/api/events` a neveřejnou tabulku `measurement_events` ve stávajícím Supabase. Bez dalšího účtu nebo analytické knihovny. Měření se spouští pouze po souhlasu; odmítnutí neblokuje formulář. Volbu lze změnit v patičce. Informace pro měření mají samostatnou verzi `2026-10-15-m1`; účel a verze doručení průvodce zůstávají stejné.

## Odkazy pro reklamy

- [Reklama A — rozdíly ETF](https://etf-gold.vercel.app/?utm_campaign=etf_porovnani&utm_content=ad_a_rozdily)
- [Reklama B — náklady v Kč](https://etf-gold.vercel.app/?utm_campaign=etf_porovnani&utm_content=ad_b_naklady)

Klasifikace je pevná: `ad_a_rozdily`, `ad_b_naklady`, `direct` (bez UTM) a `other` (jiné UTM). `utm_source`, `utm_medium` mohou být v reklamním odkazu, do měření je nepřebíráme. Neukládáme raw URL, referrer ani neznámé parametry. První rozpoznaná varianta v relaci zůstává zachovaná.

## Události

| Událost | Kdy se započítá |
| --- | --- |
| page_view | Po souhlasu, jednou za relaci v kartě; server ji zajistí i při souběhu dalších událostí |
| calculator_use | První změna na platnou částku nebo použití předvolby; ne výchozí vykreslení |
| quiz_use | První zvolená odpověď; ne pouhé otevření kvízu |
| guide_cta | Kliknutí na odkaz vedoucí k nabídce PDF |
| form_start | První zaměření e-mailového pole |
| form_success | Až po úspěšné odpovědi formuláře; server ověří skutečnou žádost a přítomnost potvrzení o odeslání |
| contact_acquired | Serverově ověřené první úspěšné získání daného kontaktu v uchovávané historii; opakovaná žádost stejného kontaktu není nový kontakt |

Databázový klíč `(session_id,event)` zabraňuje duplicitám při dvojkliku, StrictMode nebo obnovení stránky. Příznaky v kontaktech a žádostech brání opakovanému přičtení stejné konverze z jiné relace. E-mail a identifikátor žádosti se do analytické tabulky neukládají. Ověřovací requestId je pouze součástí volání úspěchu, server jej použije k ověření již existující žádosti. Pseudonymní relace není anonymní osoba.

## Kde výsledky zjistit

V projektové složce spusťte:

```powershell
npm run report:measurement
npm run report:measurement -- 30
```

Výchozí rozsah je 7 dní, maximální 30 dní. Používá soukromé nastavení `.env.local`; nikdy nedávat Supabase secret do `VITE_*` nebo klienta. Výstup obsahuje jen agregované počty pro každou reklamu, nové kontakty / návštěvy × 100 a dokončení / zahájení formuláře × 100. Nulový jmenovatel je „—“, nikoli smyšlené 0 %. Připravený je také soukromý SQL dotaz `supabase/measurement-report.sql` pro SQL Editor; při jeho ručním použití je nutné vyřadit interní testovací relace.

Přehled vybírá relace podle času `page_view` v daném období a připojí jejich zaznamenané kroky. Interní ověřovací relace vypouští podle ignorovaného `private-data/measurement-qc.json`. Tento soubor ponechat lokálně; při přenosu operátorského prostředí jej přenést soukromě, jinak ručně vyřadit kontrolní relace. Surová SQL tabulka testy obsahuje, report je nemá vydávat za návštěvníky kampaně.

## Soukromí, retence a omezení

- Před souhlasem se neposílá žádný měřicí požadavek ani nevytváří identifikátor relace. Pouze rozhodnutí ano/ne a čas se pamatuje v localStorage na 180 dní. SessionStorage drží relaci do uzavření karty. Odvolání zastaví budoucí události a odstraní relaci; nevrací zpět již odeslané požadavky.
- Události se uchovávají 30 dní, hodinový job `clientelo-measurement-retention` v minutě 10 je odstraní. Nejde o mazání infrastrukturních logů poskytovatelů.
- RLS a odebraná oprávnění chrání data před veřejným čtením i zápisem. RPC může volat pouze serverová role, s pevným search_path a povolenými hodnotami. API ověřuje origin, JSON, UUID, velikost a odmítá další vlastnosti včetně e-mailu. Bez veřejného reportovacího endpointu.
- Bez souhlasu nejsou návštěvy ani jejich konverze součástí měření. Výsledky tedy platí pro měřenou část publika, ne pro všechny návštěvníky. Jeden člověk může mít více relací, jedna relace nejvýše jednu konverzi. Po expiraci kontaktní historie může být stejná adresa znovu vyhodnocena jako nová. Nejde o celoživotní počet unikátních lidí.
- Zavření stránky, síťová chyba nebo blokátor mohou událost ztratit. Chyba analytiky nesmí přerušit doručení PDF. Neodesíláme zpětně interakce provedené před souhlasem. Funnel je přehled dosažených kroků, nikoli důkaz povinného pořadí — člověk může přijít rovnou k formuláři.
- Origin není autentizace návštěvníka; automat může vyrobit interakční události. Pevné hodnoty, deduplikace, limit těla 512 B a strop 10 000 nových relací za den omezují dopad. Konverze navíc vyžaduje skutečnou dokončenou žádost. Nejde o ochranu placené kampaně proti všem botům.

Podklad k zabezpečení RPC: [Supabase database functions](https://supabase.com/docs/guides/database/functions). Souhlas je zvolený způsob zapnutí vlastní analytiky, nespoléháme na výjimku: [CNIL — audience measurement](https://www.cnil.fr/fr/node/677). Neuzavírá to dosud nedoložené smluvní/provozní předpoklady bodu 7; ty zůstávají v `privacy-operations.md`.

## Ověření

Automatické testy pokrývají souhlas/odmítnutí/odvolání, StrictMode a reload, atribuci, síťovou chybu, odmítnutí osobních údajů a skutečné PostgreSQL zápisy, deduplikaci, ověření konverze, veřejná oprávnění a retenci. Testy doručení používají syntetická data bez skutečných e-mailů. Produkční ověření se zaznamená do ai-log; kontrolní relace se vyloučí z obchodního reportu.
