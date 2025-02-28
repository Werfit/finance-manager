export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "UAH",
    currencyDisplay: "symbol",
  }).format(amount);
};
