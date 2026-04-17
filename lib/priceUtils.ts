// Fixed exchange rate — update as needed
export const IDR_PER_USD = 17000;

/** 190_000_000 → "190 M"  |  5_500_000 → "5.5 M"  |  500_000 → "500 K" */
export function toMillions(idr: number): string {
  if (idr >= 1_000_000) {
    const m = idr / 1_000_000;
    return m % 1 === 0 ? `${m} M` : `${m.toFixed(1)} M`;
  }
  return `${Math.round(idr / 1_000)} K`;
}

/** Format IDR amount in millions */
export function fmtIDR(idr: number): string {
  return `${toMillions(idr)} IDR`;
}

/** Format USD amount */
export function fmtUSD(usd: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(usd);
}

/** Given a price + currency, return { main, approx } strings for dual display.
 *  suffix = "/month" | "/are" | "" */
export function dualPrice(price: number, currency: 'USD' | 'IDR' | string, suffix = ''): { main: string; approx: string } {
  if (currency === 'USD') {
    const idr = price * IDR_PER_USD;
    return { main: fmtUSD(price) + suffix, approx: `≈ ${toMillions(idr)} IDR${suffix}` };
  }
  // IDR
  const usd = price / IDR_PER_USD;
  return { main: fmtIDR(price) + suffix, approx: `≈ ${fmtUSD(usd)}${suffix}` };
}
