export const MAX_AMOUNT = 1_000_000_000;

export function parseAmount(input: string): {
  value: number | null;
  error: string;
} {
  const text = input.trim().replace(/[\u00a0\u202f]/g, " ");
  if (!text) return { value: null, error: "Zadejte částku v Kč." };
  if (text.startsWith("-"))
    return { value: null, error: "Částka nemůže být záporná." };
  if (!/^(?:\d+|\d{1,3}(?: \d{3})+)(?:[,.]\d{1,2})?$/.test(text)) {
    return {
      value: null,
      error: "Použijte číslo, například 100 000 nebo 100 000,50.",
    };
  }
  const value = Number(text.replace(/ /g, "").replace(",", "."));
  if (!Number.isFinite(value) || value > MAX_AMOUNT) {
    return { value: null, error: "Zadejte nejvýše 1 000 000 000 Kč." };
  }
  return { value, error: "" };
}

export function annualFundCost(
  amount: number,
  expenseRatioPercent: number,
): number {
  if (
    !Number.isFinite(amount) ||
    amount < 0 ||
    amount > MAX_AMOUNT ||
    !Number.isFinite(expenseRatioPercent) ||
    expenseRatioPercent < 0 ||
    expenseRatioPercent > 100
  ) {
    throw new RangeError("Neplatná částka nebo nákladovost.");
  }
  return (amount * expenseRatioPercent) / 100;
}

const currencyFormat = new Intl.NumberFormat("cs-CZ", {
  style: "currency",
  currency: "CZK",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
export const formatCurrency = (amount: number) => currencyFormat.format(amount);

