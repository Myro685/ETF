# Projektová pravidla

## Rozsah a kvalita

- Postupuj po bodech zadání. Bod 1 je schválený, nabídka z bodu 2 ještě není rozhodnutá.
- Navrhuj pro mobil, používej sémantické HTML, přístupné popisky a čitelný kontrast.
- Používej React s TypeScriptem. Závislosti přidávej s konkrétním důvodem a používej npm s lockfilem.
- Po relevantních změnách spusť npm run lint a npm run build. Další testy přidávej podle dopadu, zejména pro výpočty, formulář, chyby, doručení obsahu a měření. Build není vizuální ani koncový test.

## ETF a konverze

- Nevymýšlej fondy, poplatky, výnosy ani dostupnost. Údaje ověř z primárních zdrojů a ulož zdroj i datum ověření.
- Vyřeš NYSE versus NYSE Arca a dostupnost pro české drobné investory.
- Jedna dotažená interaktivní funkce má přednost před několika nedokončenými.
- Formulář je hotový až při skutečném uložení kontaktu a získání slíbeného obsahu. Zpracuj neplatný e-mail, chybu a opakované kliknutí.
- Měření musí rozlišovat reklamy a ověřit záznam návštěvy, interakce, CTA, zahájení formuláře a získání kontaktu. Odhad konverze odlišuj od skutečného výsledku.

## Informace a bezpečnost

- README obsahuje stav, spuštění, služby, omezení a další krok. Podrobnosti patří do docs/.
- Rozhodnutí zapisuj s datem, důvodem a stavem schválení. Návrhy neoznačuj jako schválené.
- Tajné klíče patří pouze do neveřejných proměnných prostředí. Klíč v klientském bundlu není tajný.
- E-maily návštěvníků nepatří do Gitu ani měřicích událostí. Použití kontaktu a ochranu údajů vyřeš před sběrem.
- Návrhy reklam neznamenají autorizaci placené kampaně. Odevzdávací e-mail odešli na výslovný pokyn uživatele.

