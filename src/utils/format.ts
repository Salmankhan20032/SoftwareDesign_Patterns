export function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPrice(value: number): { whole: string; frac: string } {
  const [whole, frac] = value.toFixed(2).split('.');
  return { whole, frac };
}
