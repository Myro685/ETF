# Návrhy interaktivní funkce — bod 6

Datum: 2026-10-09. Stav: **uživatel vybral varianty 1 a 3; obě jsou implementované a ověřené**. Na jeho přímý pokyn realizujeme dvě funkce místo původně navrhované jedné. Varianta 2 zůstává nevybraná. Níže zachovaný popis variant doplňuje záznam skutečné implementace.

## 1. Kolik znamená nákladovost v korunách? — doporučený návrh

Návštěvník zadá ilustrativní hodnotu investice v Kč. U každého ETF uvidí orientační roční náklad fondu při této konstantní hodnotě a rozdíl mezi fondy. Hodnota × nákladovost v procentech / 100. Základní příklad pro 100 000 Kč podle současných projektových dat: VOO 30 Kč, VTI 30 Kč, SCHD 60 Kč.

Výsledek převádí malé procento na srozumitelnou částku a vysvětluje, že stejné náklady neznamenají stejnou strategii. Náklad je promítnutý do hodnoty fondu, není samostatnou fakturou. Výpočet není predikce výnosu, celkových nákladů ani přesné skutečné roční částky při kolísající hodnotě. Nezahrnuje brokera, směnu, spread ani daně. Nepotřebuje živý kurz, protože jde o ilustrativní korunovou hodnotu a poměrný náklad.

Vazba na současné PDF: po výsledku nabídnout podrobnější vysvětlení nákladů a checklist brokera. Základní výsledek zůstává bez e-mailu; neslibovat osobní PDF, které není součástí schválené nabídky.

Plán ověření: vstup 100 000 Kč → 30/30/60 Kč a rozdíl 30 Kč, nulová hodnota, desetinné částky, neplatný a záporný vstup, limity vstupu a české formátování. Sazby číst výhradně z src/data/etfs.json. Testovat nezávislé očekávané hodnoty, ne pouze opsaný vzorec. Rozsah: malý.

## 2. Vyberte dvojici a pochopte rozdíl

Návštěvník zvolí dvě různá ETF z VOO, VTI a SCHD. Uvidí společné porovnání a krátkou odpověď na „Co mají společné?“ a „V čem se liší?“. Například VOO a VTI: stejná zveřejněná nákladovost, odlišná šíře pokrytí trhu. SCHD přidává odlišnou strategii výběru dividendových společností. Nezavádět skóre nejlepšího fondu.

Výsledek soustředí pozornost na konkrétní kandidáty. Vazba na PDF: nabídnout podrobnosti ke všem třem fondům a checklist před nákupem. Stále půjde o schválený obecný průvodce, ne automaticky vytvořené osobní PDF.

Plán ověření: všechny tři možné dvojice, správné přiřazení údajů a zdrojů, nemožnost vybrat stejný fond dvakrát, ovládání klávesnicí a mobilní zobrazení. Rozsah: malý až střední. Nevýhoda: současná tabulka již všechny tři fondy srovnává, takže přidanou hodnotu musí tvořit interpretace rozdílů.

## 3. Tři otázky k porovnání ETF

Krátký vzdělávací kvíz: znamenají stejné poplatky stejnou strategii, zahrnuje nákladovost poplatky brokera, znamená širší pokrytí zaručený vyšší výnos? Po každé odpovědi vysvětlení; na konci přehled témat, ke kterým se návštěvník může vrátit v porovnání.

Výsledek pomáhá odhalit nepochopené pojmy, nevybírá konkrétní investici ani nehodnotí vhodnost produktu pro člověka. Vazba na PDF: nabídnout vysvětlení a checklist pro pozdější návrat.

Plán ověření: správné odpovědi a vysvětlení proti projektovým zdrojům, všechny odpovědní větve, návrat k předchozí otázce a restart, klávesnice a oznamování výsledku. Rozsah: střední. Nevýhoda: méně přímé porovnání konkrétních fondů než u prvních dvou návrhů.

## Doporučení a stav

AI původně doporučila variantu 1. Uživatel následně zadal „Udělej bod 1 a 3“, tedy kalkulačku a kvíz. Jeho volba má přednost před pravidlem preferovat jedinou funkci. Kalkulačka následuje za tabulkou, kvíz za vysvětlením fondů. Kvíz je ve výchozím stavu zavřený, aby oba nástroje zbytečně neprodlužovaly hlavní cestu k průvodci. Obě funkce nabízí odkaz na současnou nabídku PDF; základní výsledky jsou bez e-mailu. Doručení PDF stále čeká na bod 7.

## Skutečná implementace a ověření

CostCalculator čte sazby z JSON přes etfs.ts. parseAmount přijímá českou desetinnou čárku, tečku, správné seskupení tisíců a běžné nedělitelné mezery. Rozsah 0–1 miliarda Kč a maximálně dvě desetinná místa; horní hranice je limit ukázky, nikoliv investiční doporučení. Neplatný vstup skryje výsledky a zobrazí vysvětlení, nevydává starý výsledek za nový. Tři předvolby zrychlují vyzkoušení. Částky v Kč mají dvě desetinná místa; zaokrouhlení na displeji nezaměňuje malé nenulové náklady s nulovou sazbou.

EtfQuiz používá tři otázky z quiz.ts. Nativní radio skupiny, ověření před přechodem, okamžité textové vysvětlení správné i chybné odpovědi, zdroje podkladů, návrat a změna odpovědi, závěrečné skóre a témata k připomenutí. Restart vymaže odpovědi i stav ověření. Kvíz nepřisuzuje návštěvníkovi investiční profil. Při přechodu jde focus na nadpis otázky, chybějící volba zaměří první radio; stav je přístupný přes role=status.

Automatické testy (npm run test, nativní Node.js test runner bez nové závislosti) ověřily nezávislé očekávané výsledky 3/3/6, 30/30/60 a 300/300/600 Kč, rozdíl 30 Kč, desetinnou částku, nulu, limity a chybný vstup včetně neplatného seskupení tisíců, neplatné sazby a české formátování. Kvíz: všech osm kombinací odpovědí, neúplné či neplatné odpovědi a existující vazby na zdroje. Klíč odpovědí ručně posouzený proti vysvětlením a projektovým podkladům: stejné náklady neznamenají stejnou strategii; náklady brokera jsou zvlášť; širší trh nezaručuje výnos.

Browser kontrola: 320, 390, 768, 1024 a 1440 px bez vodorovného přetékání i s maximální částkou a otevřeným kvízem. Vyzkoušený záporný vstup, nula, předvolba 100 000 Kč, chybějící odpověď, správná a chybná odpověď, návrat a změna odpovědi, skóre 2/3, seznam k připomenutí a restart. Radio Space a ověření Enter fungují; přechod otázky přenese focus na nadpis. Konzole bez zachycených chyb či varování. Lint a build včetně TypeScriptu prošly. Plný screen reader a zvětšení 200 % nadále zbývají.

Vizuální kontrola podle apple-design: principy pro web, současné tokeny a společné výsledky; textový stav nezávisí na barvě. Nové předvolby mají minimálně 44 px na výšku, odpovědi 56 px. Nové prvky používají stávající kontrastní role (text 15,85/16,05 : 1, sekundární text 5,43/8,07 : 1 dle docs/design.md). `feedback.md › Best practices`: „Consider integrating status feedback into your interface.“ Na 320 px původně velká částka lámala číslo mezi řádky; opraveno řádkovým rozložením výsledků na mobilu a zachováním čísla vcelku. Nové grafy, animace ani dekorace nebyly potřeba.
