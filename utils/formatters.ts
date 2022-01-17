
export function formatBigMoney(num: number): string {
  if (num === 0) return '$0';
  if (num > 1000000000000000) return `infinity`;
  if (num >= 1000000000000) return `$${Math.round(num / 100000000000) / 10 }T`;
  if (num >= 1000000000) return `$${Math.round(num / 1000000000)}B`;
  if (num >= 1000000) return `$${Math.round(num / 1000000)}M`;
  return `$${Math.round(num / 1000)}K`;
}

export function formatPercent(num: number): string {
  return `${Math.round(num * 100)}%`;
}
