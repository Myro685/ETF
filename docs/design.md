# Obsah a design stránky — bod 5

Nový návrh Atlas z 2026-10-09 je samostatně popsaný v [design-atlas.md](design-atlas.md). Následující dokument popisuje dosavadní implementaci; nový návrh zatím není přenesený do hlavní aplikace.

Datum: 2026-10-09. Stav: **návrh z MagicPath na navazující pokyn uživatele implementovaný v React aplikaci**. Web běží místně, veřejný hosting zbývá. Dvě reklamy bodu 4 připravené v docs/ads.md. Následující návrhová měření popisují původní prototyp; aktuální implementace je popsaná samostatně níže.

## Návaznost reklam — aktuální úvod

Po návratu uživatele k bodu 4 úvod výslovně uvádí orientační náklad fondu v Kč a kalkulačku bez e-mailu. Hlavní CTA „Porovnat ETF“ zachované; vedlejší „Co najdu v průvodci“ nahrazené přímým „Porovnat náklady v Kč“. Nabídka průvodce zůstává v navigaci i za užitečným obsahem. Podrobnosti obou textových reklam a jejich návaznosti v docs/ads.md.

## Účel a vizuální směr

Pomoci člověku před prvním nákupem ETF pochopit rozdíly mezi VOO, VTI a SCHD. Výrazným prvkem je společný porovnávací list: stejné kritérium a všechny tři fondy vedle sebe, také na mobilu. Návštěvník nemusí držet údaje v paměti při posouvání tří dlouhých karet.

Použitý skill apple-design je nainstalovaný globálně pro Codex ze zdroje dickwu/apple-design-skill. U webu aplikujeme čitelnost, hierarchii, rozložení, jednoduché ovládání a přístupnost. Nativní navigaci iOS ani macOS na web nepřenášíme. Skill MagicPath řídí práci s živým canvasem a kontrolu sestavených komponent.

První návrh měl na mobilu přibližně 5 361 px. Na žádost uživatele byl vzhled přepracovaný: neutrální povrchy, větší nadpisy, modrá primární akce, sjednocené porovnání a méně dekorací. Přepracovaná stránka při šířce viewportu 390 px měří přibližně 3 700 px se zavřenými podrobnostmi. Formulář začíná kolem 2 576 px místo 4 192 px. Čísla popisují konkrétní náhled, nikoliv garanci všech zařízení nebo konverze.

## Pořadí a texty

| Sekce | Obsah | Důvod pořadí |
| --- | --- | --- |
| Úvod | „Než koupíte ETF, poznejte rozdíly.“; zaměření a roční náklady zdarma bez e-mailu; CTA „Porovnat ETF“ | Ihned sdělit hodnotu a nabídnout jednu hlavní akci |
| Rychlý přehled | VOO — velké firmy, VTI — široký trh, SCHD — dividendy | Vlastní vizuální motiv má skutečný vztah k rozdílům fondů |
| Společné porovnání | Zaměření, roční nákladovost 0,03 / 0,03 / 0,06 %, přesný listing NYSE Arca, datum ověření | Užitečné údaje dostupné před formulářem |
| Podrobnosti a dostupnost | Rozbalitelné názvy a indexy; vysvětlení nákladovosti a závislosti nákupu na brokerovi, účtu a KID | Podrobnosti jsou dostupné; důležité omezení nákupu zůstává viditelné |
| Kalkulačka nákladů | Hodnota v Kč, předvolby a orientační roční náklad všech tří fondů | Převést nákladovost na konkrétní částku po základním porovnání |
| Interpretace | Krátké vysvětlení VOO, VTI a SCHD; bez hodnocení nejlepšího fondu | Samotná čísla nestačí k pochopení rozdílů |
| Volitelný kvíz | Tři otázky, vysvětlení, zdroje a témata k připomenutí | Procvičit pojmy po jejich vysvětlení; ve výchozím stavu zavřený |
| PDF a formulář | Obsah schváleného průvodce, jediné pole e-mail; CTA „Poslat průvodce zdarma“ | Žádost o kontakt až po poskytnuté hodnotě |
| Souvislosti a zdroje | Dostupnost, rizika, náklady, odkazy na emitenty, SEC, NYSE, ČNB, IBKR a Fio | Podložení informací a možnost dohledat jejich kontext |

Názvy a data vycházejí ze src/data/etfs.json a docs/etf-research.md. VTI používá aktuální název Vanguard Morningstar Total Stock Market ETF a Morningstar US Total Market Index. U zdrojů je vysvětlený červnový fact sheet a červencový dodatek. Datum ověření 9. 10. 2026 není vydávané za datum platnosti všech zdrojových dokumentů.

## Tokeny a rozložení

Barvy jsou pojmenované podle role. Kontrast vypočtený ze sRGB hex hodnot; nejde o odhad ze screenshotu.

| Role | Světlá varianta | Tmavá varianta | Kontrola kontrastu |
| --- | --- | --- | --- |
| Pozadí | #FFFFFF | #111A26 | Základní povrch |
| Doplňkový povrch | #F5F6F8 | #1C2939 | Porovnání a nabídka |
| Hlavní text | #182332 | #F3F5FA | 15,85 : 1 / 16,05 : 1 proti pozadí |
| Vedlejší text | #596674 | #B4C1D2 | 5,43 : 1 / 8,07 : 1 proti doplňkovému povrchu |
| Primární akce a odkazy | #2455CE | #A3BAFF | Tlačítko: bílá 6,43 : 1 / tmavý text 9,19 : 1 |
| Dělící čára | #D9DFE7 | #41546C | Dekorativní členění; nenese význam bez textu |

Typografie: systémový sans serif, nadpis 72 px na širokém desktopu, 42 px na mobilu a 36 px pod 360 px. Úvodní text 19 / 16 px, názvy sekcí 36 / 28 px; vysvětlení 14 px, doplňkové údaje 11–13 px. Nákladovost používá tabulární číslice. Při přenosu do aplikace zachovat zoom a otestovat zvětšené písmo.

Šířka desktopového obsahu maximálně 1 080 px. Mobilní okraje 20 px, pod 360 px 16 px. V hlavním porovnání na mobilu stojí název kritéria nad trojicí hodnot. Dlouhé názvy a indexy jsou v rozbalitelných podrobnostech. Dekorativní obálku PDF na mobilu skrýváme; obsah nabídky zůstává úplný.

```text
Mobil                         Desktop
logo          průvodce        logo                 navigace
          slib                           slib
       CTA + odkaz                     CTA + odkaz
     VOO | VTI | SCHD                VOO | VTI | SCHD
      kritérium                 kritérium | VOO | VTI | SCHD
     VOO | VTI | SCHD                 společná tabulka
 podrobnosti / dostupnost          podrobnosti / dostupnost
 vysvětlení rozdílů                tři vysvětlení vedle sebe
 nabídka PDF + formulář            obálka | nabídka + formulář
 souvislosti / zdroje              souvislosti / zdroje
```

Nezavádíme automatické animace ani průhledné povrchy. CSS respektuje reduced motion, tmavou preferenci a režim vynucených barev. Ovládací prvky mají viditelný focus; hlavní CTA alespoň 50 px a formulářové tlačítko 52 px. Symboly jsou dekorativní, význam nesou tickery a texty.

## Kontrola podle apple-design

**Shrnutí: Good.** Struktura odpovídá cíli; vlastní vizuální identitu tvoří schémata zaměření a společná porovnávací plocha. Hodnocení je úsudek návrháře, nikoliv certifikace přístupnosti.

- **High — původní mobilní porovnání:** tři dlouhé samostatné karty komplikovaly porovnávání napříč fondy. Oprava: společná kritéria a tři hodnoty ve stejném řádku. Opora: `layout.md › Visual hierarchy`: „Align elements to make them easier to scan“.
- **Medium — délka a dekorace:** původní samostatný pruh metadat a velká mobilní obálka oddalovaly nabídku. Oprava: metadata u porovnání, dekorativní obálka jen na desktopu. Opora: `branding.md › Best practices`: „Ensure branding always defers to content.“
- **Medium — hustota údajů:** plné názvy a indexy prodlužovaly základní přehled. Oprava: základní údaje viditelné, plné názvy a indexy rozbalitelné. Opora: `layout.md › Visual hierarchy`: „Use progressive disclosure to make layouts cleaner“.
- Zachovat přímý jazyk akcí a popisek pole. Opora: `writing.md › Best practices`: „Be action oriented.“; `text-fields.md › Best practices`: „include a separate label describing the field“.

Otevřené reference: accessibility, layout, typography, color, designing-for-ios, buttons, entering-data, text-fields, lists-and-tables, writing, branding a cross-platform. Uplatnění nativních částí designing-for-ios je pro tento web vyloučené.

Plán byl zkontrolovaný proti tématu ETF: místo univerzálních produktových karet používá stejná kritéria napříč třemi fondy. Odstraněnou dekorací je velká mobilní obálka a druhé logo v patičce. Nezavádíme vítěze, výnosové grafy ani neověřená čísla.

## Ověření a rozsah prototypu

- Obě MagicPath komponenty sestavené úspěšně a kontrolované v živém prohlížeči.
- Samostatná přísná TypeScript kontrola uloženého návrhu, lint projektu a build hlavní aplikace prošly. Názvy, indexy a nákladovosti porovnané s src/data/etfs.json. Build hlavní aplikace nepotvrzuje nasazení návrhu.
- Zobrazení při šířkách 320, 390 a 1 440 px: bez zjištěného vodorovného přetékání; na 320 px kontrolovaná hranice všech viditelných prvků.
- Vyzkoušené kotvy, rozbalení názvů a indexů, chyba při prázdném e-mailu a ukázkové potvrzení po syntakticky platném e-mailu.
- Semantická tabulka v DOM zachovává sloupcové a řádkové hlavičky. Focus a reduced motion jsou v CSS; plný test screen readeru, zvětšení 200 %, všech zařízení a vizuální test nové tmavé varianty nejsou dokončené. Kontrast tmavých tokenů je spočítaný.
- Formulář neukládá kontakty ani neodesílá e-mail. Potvrzení výslovně označuje náhled. PDF, backend, informace o správci údajů, chyba doručení, opakované odeslání a měření patří do dalších bodů.

Návrh naplňuje šest návrhových úkolů bodu 5. Původní podklady jsou v designs/magicpath/; následnou implementaci zachycuje další sekce. Návrhové ověření samo nepotvrzuje dokončení bodů 6–8.

Šest návrhových úkolů bodu 5 odškrtnuto v Notion a ověřeno zpětným načtením. Bod 4 ponechaný nehotový. Náhledy z živého prohlížeče uložené v designs/magicpath/clientelo-design-desktop.jpg a clientelo-design-mobile.jpg.

## Implementace webu a ověření

Aktualizace bodu 7: původní ukázkový formulář nahrazený GuideForm se skutečným API kontraktem, čekáním, chybami a bezpečným retry. Nenastavený režim pouze kontroluje formát; potvrzení a PDF se zobrazí až po úspěšném serverovém výsledku. Vizuální testy těchto stavů proběhly na oddělené označené testovací stránce, živé služby nejsou aktivované. Aktuální podrobnosti v docs/form.md; níže uvedené starší kontroly popisují první implementaci.

EtfLanding v src/components/ nahrazuje původní úvodní stránku. Styly jsou převzaté z návrhu a upravené pro skutečná data. Data čte src/data/etfs.ts z JSON; SourceList zobrazuje všech devět zdrojů s datem dokumentu odděleným od data ověření. Plné zaměření VTI je delší než v prototypu, zůstává ale čitelné ve společném porovnání.

Formulář používá nativní kontrolu email inputu, vrací focus na chybné pole a oznamuje stav přes role=status. Před zadáním e-mailu je viditelné, že služba není zapojená. Platný vstup zobrazí „E-mail nebyl uložen ani odeslán.“ PDF není vytvořené. Neexistuje endpoint, úložiště kontaktů ani analytika.

| Kontrola | Výsledek |
| --- | --- |
| npm run lint, npm run build, git diff --check | Úspěšné; build zahrnuje TypeScript |
| Viewporty 320, 390, 768 a 1440 px | Bez vodorovného přetékání i při otevřených detailech a zdrojích |
| Kotvy a rozbalovací prvky | Porovnání a nabídka dostupné; podrobnosti otevřené také klávesou Enter |
| Data | Zobrazené nákladovosti 0,03 / 0,03 / 0,06 %, aktuální Morningstar index VTI, přesný listing NYSE Arca |
| Zdroje | Všech 9 položek z JSON a poznámky k jejich rozsahu |
| Formulář | Prázdný vstup: chyba a focus; testovací syntakticky platný vstup: nedostupné doručení, žádný zápis ani odeslání |
| Klávesnice | Vyzkoušené Tab a Enter, viditelný focus |
| Vzhled a konzole | Tmavá varianta zkontrolovaná na desktopu i mobilu, bez zachycených chyb a varování v konzoli |

Na 320 px způsobovala původní minimální šířka body přetékání o šířku systémového scrollbar. Opraveno odstraněním této minimální šířky; následně prošly všechny čtyři šířky. Zvětšení 200 %, screen reader a koncový proces skutečného doručení zbývají. Světlá varianta zachovává tokeny již ověřeného návrhu; aktuální browser testy proběhly s tmavou systémovou preferencí.

## MagicPath identifikátory

Projekt: **459239012931100672**, „Clientelo — ETF porovnání“.

| Náhled | Component ID | Generated name |
| --- | --- | --- |
| Desktop | 459239065498304512 | quietly-second-2404 |
| Mobil | 459240433747386368 | soft-dawn-9296 |

Tyto identifikátory zachovat pro navazující úpravy. Nepoužívat dočasné upload URL jako odkazy v dokumentaci. Canonical zdroj uložený v designs/magicpath/ClienteloSrovnNETF.tsx a ClienteloApple.css; mobilní komponenta zobrazuje totožný návrh při úzké šířce.
