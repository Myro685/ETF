# Gmail sender: místní propojení

Stav 15. 10. 2026: uživatel nemá vlastní doménu a pokračuje cestou Gmail API. Google Cloud projekt, Gmail API, OAuth obrazovka a testovací uživatel jsou podle jeho potvrzení nastavené. Stažený webový OAuth klient má očekávanou návratovou adresu. Připravené propojení dosud neznamená odesílající formulář.

## Co je připravené

- `private-data/google-oauth-client.json`: zkopírovaný a strukturálně ověřený JSON. Složka je ignorovaná Gitem; obsah se nevypisuje. Původní stažený soubor zůstal zachovaný.
- `npm run connect:gmail`: jednorázová místní utilita na `http://127.0.0.1:5175/`, poslouchá pouze na loopback. Po 15 minutách se vypne. Návratová adresa v Google Cloud je přesně `http://127.0.0.1:5175/oauth/callback`.
- Oficiální `google-auth-library` 11.3.0, připnutá závislost. PKCE S256, náhodný state s platností 10 minut, ochrana Host a Origin, jednorázový callback, no-store a no-referrer. Autorizační kód se po zpracování odstraní z viditelné adresy přesměrováním na úvod.
- Žádá pouze `https://www.googleapis.com/auth/gmail.send` s offline přístupem. Nežádá čtení doručené pošty ani přístup k jiným službám. Návrat s dalšími scopes se neukládá.
- Přístup se po ručním schválení uloží do `private-data/gmail-tokens.json`, bez výpisu do logu či chatu. Ukládá se jen refresh token a scope, nikoliv krátkodobý access token. Existující soubor se nepřepisuje. Soubor není šifrovaný; Windows ochrana závisí na oprávněních soukromého uživatelského adresáře (Unix mode 0600 sám o sobě není Windows ACL).
- Utilita neobsahuje endpoint pro odeslání zprávy. Přihlášení samo nic neodešle a neaktivuje formulář.

## Postup pro provozovatele

1. Spustit `npm run connect:gmail` z kořene projektu.
2. Otevřít místní adresu a stisknout „Pokračovat ke Googlu“.
3. Vybrat vlastní účet přidaný mezi testovací uživatele a sám rozhodnout o povolení odesílání pro Clientelo.
4. Po návratu očekávat „Gmail je propojený“. Tajné údaje ani autorizační URL neposílat do chatu. Pokud Google vrátí chybu, popsat její text bez kódu a tokenů.

U OAuth aplikace External ve stavu Testing mají refresh tokeny pro tento Gmail scope podle Googlu omezenou platnost typicky 7 dní. Pro trvalý provoz je nutné vyřešit publikační stav a příslušné požadavky Googlu. Nejde o příslib neomezeného přístupu ani neomezené kvóty odesílání.

## Co ještě zbývá

Po skutečném schválení ověřit existenci soukromého tokenu a doplnit samostatný Gmail transport do formulářového API. Nynější `server/guide.ts` a `check:guide` stále používají připravenou variantu Resend; Gmail propojení samo tuto cestu nenahrazuje. Při implementaci Gmail transportu znovu vyřešit opakování a nejasný síťový výsledek: Gmail API send nenabízí stejný Idempotency-Key jako dosavadní Resend cesta, nelze jen zaměnit URL a tvrdit totožné garance.

Dále zbývá Supabase, skutečné ukládání kontaktů, finální informace o zpracování se skutečnými poskytovateli, veřejná adresa PDF a akceptační test s výslovně určeným adresátem. Bod 7 zůstává otevřený, žádné kontakty ani e-maily nebyly tímto krokem odeslané.

## Ověření

13 testů včetně dosavadních funkcí. Nové testy ověřují minimální scope, PKCE/state/offline parametry, kanonický endpoint, Host/Origin, prošlý a neplatný callback, odmítnutí širšího přístupu, neuložení access tokenu a odmítnutí replay. Používají syntetické údaje, bez skutečného Google token exchange. První HTTP test předával Host přes fetch, které jej nepřeneslo; opravená testovací doprava používá nativní HTTP. Lint a TypeScript build prošly. Živý souhlas musí provést uživatel.

Podklady: [Google web-server OAuth](https://developers.google.com/identity/protocols/oauth2/web-server), [Gmail scopes](https://developers.google.com/workspace/gmail/api/auth/scopes), [platnost refresh tokenů](https://developers.google.com/identity/protocols/oauth2#expiration). Kontrola 15. 10. 2026.
