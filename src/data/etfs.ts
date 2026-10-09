import data from "./etfs.json";

export const etfData = data;
export const sources = data.sources;

const numberFormat = new Intl.NumberFormat("cs-CZ", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const dateFormat = new Intl.DateTimeFormat("cs-CZ", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export const formatExpenseRatio = (percent: number) =>
  numberFormat.format(percent / 100);
export const formatDate = (date: string) =>
  dateFormat.format(new Date(`${date}T12:00:00Z`));

export function getSource(id: string) {
  const source = sources.find((source) => source.id === id);
  if (!source) throw new Error(`Chybí datový zdroj: ${id}`);
  return source;
}

type Editorial = { short: string; dots: string; note: string; detail: string };
const editorial: Record<string, Editorial> = {
  VOO: {
    short: "Velké firmy",
    dots: "large",
    note: "Výchozí pohled na velké americké firmy.",
    detail:
      "Sleduje index S&P 500. Proti VTI se soustředí na velké společnosti.",
  },
  VTI: {
    short: "Široký trh",
    dots: "broad",
    note: "Širší záběr při stejné nákladovosti.",
    detail:
      "Zahrnuje také menší společnosti. Širší pokrytí samo o sobě neslibuje vyšší výnos.",
  },
  SCHD: {
    short: "Dividendy",
    dots: "dividend",
    note: "Odlišná strategie výběru společností.",
    detail:
      "Vybírá dividendové firmy podle fundamentálních ukazatelů. Dividendy nezaručují vyšší celkový výnos ani menší riziko.",
  },
};

export const funds = data.funds.map((fund) => ({
  ...fund,
  ...editorial[fund.ticker],
  fee: formatExpenseRatio(fund.expenseRatioPercent),
  source: getSource(fund.expenseRatioSourceId),
}));
