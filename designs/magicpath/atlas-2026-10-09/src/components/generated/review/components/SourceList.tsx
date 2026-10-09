import { sources, formatDate } from "../data/etfs";

const notes: Record<string, string> = {
  "schd-profile": "Datum účinnosti poplatku neuvedeno.",
  "vti-factsheet":
    "Červnový fact sheet používá původní název. Aktuální název fondu a indexu uvádí červencový dodatek.",
  "vti-name-supplement":
    "Dodatek k názvu fondu a indexu účinný od 29. 7. 2026.",
  "nyse-etp":
    "NYSE Arca je samostatná burza skupiny NYSE, nikoliv NYSE main market.",
  "cnb-priips":
    "Část B.2 rozlišuje execution-only přístup; nezaručuje nákup konkrétního tickeru.",
  "ibkr-priips": "Odpověď IBKR k omezením retailových nákupů bez KID.",
  "fio-etf":
    "Přístup k americkým ETF nezaručuje dostupnost každého instrumentu na konkrétním účtu.",
  "fio-vti-directory":
    "VTI je v katalogu pod původním názvem. Přítomnost v katalogu není záruka nákupu.",
};

export function SourceList() {
  return (
    <div className="cl-source-content">
      <ul>
        {sources.map((source) => (
          <li key={source.id}>
            <a href={source.url} target="_blank" rel="noreferrer">
              {source.title} ↗
            </a>
            <span>
              {source.documentAsOf && (
                <>
                  Dokument k{" "}
                  <time dateTime={source.documentAsOf}>
                    {formatDate(source.documentAsOf)}
                  </time>
                  .{" "}
                </>
              )}
              Ověřeno{" "}
              <time dateTime={source.verifiedOn}>
                {formatDate(source.verifiedOn)}
              </time>
              .
            </span>
            {notes[source.id] && <span>{notes[source.id]}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
