# Exporty skutečných konverzací Codexu

Toto jsou **exportované uložené textové zprávy**, nikoli generovaný přepis nebo pracovní souhrn. Souhrny v nadřazené složce `ai-log` jsou vedené samostatně.

## Obsah a původ

- `clientelo-start.md` / `.jsonl`: původní část hlavní konverzace od prvního pokynu „Ahoj, budeme tvořit nový projekt“ dne 9. 10. 2026. Obsahuje cílovou skupinu, nabídku, založení projektu, GitHub a výběr ETF.
- `clientelo-main.md` / `.jsonl`: navazující uložená část stejného projektu, návrh a implementace, formulář, hosting, měření a dokončování zadání.
- `finish-review.md` / `.jsonl` a `design-documenter.md` / `.jsonl`: konverzace dvou pomocných agentů použitých 11. 10. 2026. Položka `user` v těchto souborech je zadání předané hlavním agentem, ne další samostatný lidský pokyn.
- `manifest.json`: datum pořízení, názvy zdrojových souborů, jejich SHA-256 v okamžiku čtení, rozsah časů, počty zpráv, redakcí, vynechaných záznamů a kontrolní součty exportů.

Časové údaje jsou zachované v UTC; místní čas práce je Europe/Prague. Obě části hlavní konverzace se na přechodu překrývají v požadavku na bod 5. Zprávy kvůli tomu nebyly přepisované nebo uměle spojované. Soubory se čtou v uvedeném pořadí. Export je snímek k času v manifestu; pozdější zprávy této stále probíhající konverzace v něm přirozeně nejsou.

## Použitá metoda místo Claude Code `/export`

Použitý nástroj byl **Codex desktop**. Neuvádíme, že byl spuštěný příkaz Claude Code `/export`, ani že existuje totožný podporovaný exportní příkaz Codexu. Oficiální [dokumentace Codex CLI](https://learn.chatgpt.com/docs/codex/cli) popisuje návrat k uložené konverzaci pomocí `codex resume`; zde použitý převod místních souborů je vlastní projektový postup ověřený na skutečně dostupných záznamech, nikoli tvrzení o garantovaném veřejném formátu aplikace.

Postup:

1. Jen pro tento projekt byla v místním indexu Codexu dohledána hlavní konverzace a její dvě pomocné konverzace. Vedle pokračujícího souboru byl nalezen i původní záznam se začátkem projektu. Jiné chaty ani interní schvalovací konverzace nebyly exportované.
2. Skript `scripts/export-ai.py` čte výslovně zvolené soubory JSONL v `.codex/sessions` bez změny originálů.
3. Z položek `response_item` vybírá skutečné zprávy `user` a veřejné zprávy `assistant` s fází `commentary`, `final` nebo `final_answer`. Zachovává pořadí, čas i původní číslo řádku. Nepoužívá model k doplnění žádného textu.
4. Z textů odstraní e-mailové adresy, známé aplikační klíče z neveřejné lokální konfigurace a vzory tokenů. Redakce označí `[REDACTED:typ]` a spočítá v manifestu. Automatický kontext prohlížeče je označený jako vynechaný, automatické kontextové zprávy bez lidského obsahu se vypouštějí.
5. Zapisuje Markdown pro čtení a JSONL pro kontrolu. Následuje bezpečnostní kontrola exportů, pracovních souborů, dosažitelné historie Gitu a buildu.

Opakování nad konkrétními místními soubory:

```powershell
python scripts/export-ai.py --source "clientelo-start=C:\cesta\k\puvodnimu-rollout.jsonl" --source "clientelo-main=C:\cesta\k\pokracovani-rollout.jsonl"
```

Při opakování zahrnout také původní pomocné zdroje, mají-li být znovu uvedené v manifestu. Změny interního formátu Codexu vyžadují kontrolu parseru; skript není univerzální exportér všech verzí aplikace.

## Co export vědomě neobsahuje

Systémové a vývojářské instrukce, interní uvažování, surové argumenty a výstupy nástrojů, provozní události a jejich duplicitní kopie. Tyto záznamy mohou obsahovat přístupové údaje a soukromá data a nejsou veřejným dialogem. Počty vynechaných druhů jsou v manifestu. Obrázky a jiné binární přílohy jsou zastoupené textovou značkou; jejich úplný binární archiv není součástí exportu. Samostatný úplný export případné konverzace v jiném designovém nástroji nebyl dodaný.

Jde tedy o úplný výběr uložených veřejných textových zpráv ze čtyř uvedených zdrojových souborů k danému okamžiku, **ne úplný surový protokol všech interních operací, příloh a všech možných dalších nástrojů**. Dřívější jednotlivá tvrzení v konverzaci zachováváme v původním znění; jejich pozdější opravy jsou součástí dalších zpráv a pracovních souhrnů. Export neznamená, že každé historické tvrzení AI bylo správné.
