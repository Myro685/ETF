# Návrh Clientelo v MagicPath

Uložený zdroj návrhu z bodu 5, nikoliv produkční aplikace. Podrobný popis, kontrola, tokeny, stav schválení a MagicPath identifikátory jsou v ../../docs/design.md.

ClienteloSrovnNETF.tsx importuje ClienteloApple.css. Oba soubory představují jeden responzivní návrh. Data jsou v návrhu fixovaná k ověření 2026-10-09; při přenosu do aplikace použít src/data/etfs.json jako společný zdroj, včetně přesných názvů, jednotek a odkazů.

Formulář pouze ukazuje validační chybu a označený náhled potvrzení. E-mail drží jen v paměti komponenty. Kontakty neukládá ani nic neposílá. Návrh neobsahuje PDF, produkční souhlasy, backend, měření ani kalkulačku.

React aplikace v src/ tento návrh zatím neimportuje. MagicPath build byl úspěšný; hlavní aplikace a tento návrh mají odlišný způsob sestavení.
