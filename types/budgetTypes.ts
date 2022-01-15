export interface SpendingCategory {
  parent_plain: string,
  value: number,
  function?: string,
  child?: string,
  federal_spending?: number,
  percent_total?: number,
};

export interface RevenueCategory {
  parent_plain: string,
  value: number,
  function?: string,
  child?: string,
  federal_revenue?: number,
  percent_total?: number,
};