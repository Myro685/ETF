# Návrhy interaktivní funkce — bod 6

Datum: 2026-10-09. Stav: tři návrhy k výběru; žádný není schválený ani implementovaný. Zadání z Notion vyžaduje jednu dotaženou funkci, vazbu na nabídku průvodce a ověření správnosti výsledků.

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

AI doporučuje variantu 1: přináší nový výsledek oproti současné tabulce, navazuje na slíbený příklad poplatků v PDF a její správnost jde jasně ověřit. Jde o návrh produktu, nikoliv doporučení ETF. Volba uživatele čeká; v Notion zatím není odškrtnutý žádný úkol bodu 6. Vybranou variantu realizovat samostatně, nepřidávat zároveň všechny tři.
