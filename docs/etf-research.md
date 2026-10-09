# ETF pro porovnání — bod 3

Stav: **výběr a rešerše dokončené na pokyn uživatele**. Ověřeno **9. října 2026** z veřejných primárních zdrojů. Údaje nejsou živý datový feed. Strojově čitelný podklad: [src/data/etfs.json](../src/data/etfs.json).

## Výběr

| ETF | Zaměření | Benchmark | Roční nákladovost fondu | Primární burza | Zdroj |
| --- | --- | --- | --- | --- | --- |
| VOO | Velké americké firmy | S&P 500 Index | 0,03 % | NYSE Arca | [Vanguard fact sheet](https://workplace.vanguard.com/assets/corp/fund_communications/pdf_publish/us-products/fact-sheet/F0968.pdf) |
| VTI | Široký americký trh včetně menších firem | Morningstar US Total Market Index | 0,03 % | NYSE Arca | [Vanguard fact sheet](https://workplace.vanguard.com/assets/corp/fund_communications/pdf_publish/us-products/fact-sheet/F0970.pdf), [dodatek o názvu](https://www.sec.gov/Archives/edgar/data/36405/000003640526000386/f45788d1.htm) |
| SCHD | Výběr amerických dividendových firem | Dow Jones U.S. Dividend 100 Index | 0,06 % | NYSE Arca | [Schwab profil](https://www.schwabassetmanagement.com/products/schd) |

Vanguard dokumenty jsou datované k 30. 6. 2026; datum jejich načtení je 9. 10. 2026. Schwab veřejný profil byl ověřen 9. 10. 2026; u samotné nákladovosti neuvádí zvláštní datum účinnosti. Nezaměňovat datum ověření s datem platnosti všech údajů. Před spuštěním stránky tyto hodnoty znovu zkontrolovat.

## Proč právě tato trojice

Jde o redakční výběr pro vzdělávací stránku, nikoliv tvrzení, že jsou to nejlepší fondy pro každého investora. VOO slouží jako výchozí bod, VTI rozšiřuje pokrytí trhu a SCHD přidává odlišnou dividendovou strategii. Návštěvník tak porovná skutečné rozdíly místo tří produktů se stejným indexem.

Záměrně nepřidáváme sektorové, pákové ani inverzní produkty. Výběr není portfoliový návrh. Fondy mohou držet stejné firmy; jejich společný nákup neznamená automaticky další diverzifikaci. Stránka nebude označovat fond s nejnižším poplatkem jako automatického vítěze. Dividendové zaměření nebudeme prezentovat jako garanci vyššího výnosu nebo menšího rizika.

## NYSE versus NYSE Arca

[NYSE Regulation](https://www.nyse.com/regulation/exchange-traded-products) rozlišuje ETP zalistované na NYSE, NYSE Arca a dalších burzách skupiny. Zvolená trojice má **NYSE Arca** potvrzenou přímo u emitentů.

Pracovní interpretace zadání: „NYSE“ zahrnuje skupinu NYSE včetně její ETF burzy Arca. Na stránce i v datech uvedeme přesné označení NYSE Arca. **Striktní požadavek na primární listing přímo na NYSE main market tato trojice nesplňuje.** Původní e-mail se zadáním B nemáme, proto jde o výslovně dokumentovanou implementační interpretaci, nikoliv potvrzení od zadavatele.

## Dostupnost pro českého drobného investora

Výsledek prověření: **podmíněná podle brokera a účtu**, nikoliv obecné ano/ne.

- [IBKR](https://www.interactivebrokers.com/campus/trading-lessons/us-taxes-for-us-non-residents-3/) v oficiální odpovědi z 19. 11. 2025 uvádí, že pro retailové klienty EHP/UK blokuje nákup PRIIP bez dostupného KID. Toto je veřejné pravidlo brokera, ne výsledek testu na konkrétním účtu.
- [ČNB, část B.2](https://www.cnb.cz/cs/dohled-financni-trh/legislativni-zakladna/stanoviska-k-regulaci-financniho-trhu/RS2018-12/) rozlišuje aktivní nabízení či poradenství a čistý execution-only přístup na podnět investora. Samotné americké ETF tedy neoznačujeme za plošně zakázané českým investorům.
- [Fio](https://www.fio.cz/akcie-investice/etf) výslovně uvádí možnost obchodovat americká ETF a odlišuje přístup na trh od nabízení produktu. Ve [veřejném výpisu](https://www.fio.cz/akcie-investice/etf/vypis-etf?offset=870) je VTI pod starším názvem. Výpis však není záruka, že lze právě teď zadat nákupní pokyn na každém retailovém účtu.

**VOO, VTI ani SCHD nebyly otestovány zadáním nákupu na českém účtu.** Nepotvrdili jsme individuální dostupnost ani konkrétní KID pro každý ticker. U všech proto datový podklad obsahuje příznak broker-dependent a tickerSpecificAvailabilityVerified = false. Přítomnost VTI v katalogu má zvláštní zdroj, ale nemění ji na garantované ano. Nevyvozujeme dostupnost VOO nebo SCHD z katalogu VTI.

### Text připravený pro stránku

„Dostupnost závisí na brokerovi a vašem účtu. U amerických ETF může nákup omezovat požadavek na dokument KID. Před nákupem ověřte přesný fond a možnost přímého nákupu u svého brokera.“

Tento kontext umístit u porovnání před formulářem. Nedávat návštěvníkovi univerzální tlačítko „Koupit“. CFD neprezentovat jako přímé vlastnictví ETF. Pokud broker daný fond nezpřístupní, lze řešit evropskou UCITS variantu; ta ovšem není stejný fond ani NYSE Arca listing a v tomto bodu jsme konkrétní varianty nevybírali.

## Význam nákladovosti

Přebíráme zveřejněný expense ratio / total expense ratio. V JSON je jednotka procenta za rok: 0.03 znamená 0,03 %, nikoliv 3 %. Jde o nákladovost fondu, nikoliv veškeré náklady investora; brokerské poplatky, spread, měnová konverze a daně jsou samostatné.

Příklad pro vysvětlení: při modelové neměnné hodnotě 100 000 Kč je 0,03 % přibližně 30 Kč za rok a 0,06 % přibližně 60 Kč. Je to aritmetický příklad, ne předpověď investice ani samostatně účtovaný účet za poplatek. VOO a VTI mají stejnou publikovanou nákladovost, takže srovnání musí vysvětlovat i rozdíl zaměření.

## Přejmenování VTI a kontrola zdrojů

Červnový fact sheet uvádí Vanguard Total Stock Market ETF a CRSP US Total Market Index. [Dodatek emitenta uložený v SEC EDGAR](https://www.sec.gov/Archives/edgar/data/36405/000003640526000386/f45788d1.htm) stanoví změnu na **Vanguard Morningstar Total Stock Market ETF** a **Morningstar US Total Market Index** s účinností 29. 7. 2026; investiční cíl a strategie zůstaly beze změny. JSON používá aktuální názvy a zachovává starší aliasy.

Dynamické HTML některých Vanguard profilů nevrátilo čitelný obsah; hlavní fakta jsme proto ověřili ve vydaných PDF a změnu názvu v právním dodatku. Vyhledávací náhledy někdy ukazovaly starší verzi PDF. Přednost dostal přímo načtený dokument s uvedeným datem. Výnosy, cenu, AUM a přesné počty pozic do dat nepřebíráme: pro základní porovnání nejsou nutné a rychle zastarávají.

## Vazba na checklist

1. Menší smysluplná skupina: VOO, VTI, SCHD.
2. Listing: emitenti potvrzují NYSE Arca, odlišnost od NYSE main market vysvětlena.
3. Dostupnost: prověřena veřejná pravidla brokera, ČNB a katalog Fio; omezení a nejistota jednotlivých účtů uvedené.
4. Data: názvy, zaměření, indexy, nákladovost a burza doložené.
5. Zdroje a data: u každého fondu přiřazené zdroje; datum ověření a datum zdrojového dokumentu oddělené.

Bod 3 je dokončený jako výběr a prověření. Neznamená to garanci nákupu ani potvrzení striktní interpretace hlavní burzy NYSE. Další krok: dvě varianty reklamy (bod 4).
