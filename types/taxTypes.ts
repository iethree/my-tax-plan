export interface TaxRate {
  rate: number;
  min: number;
  max: number;
};

export interface TaxRates {
  marriedFilingJointly: TaxRate[];
  marriedFilingSeparately: TaxRate[];
  headOfHousehold: TaxRate[];
  single: TaxRate[];
};

export interface IncomeCategory {
  qty: number,
  avgAgi: number,
  avgDeduction: number,
  avgTaxable: number,
  avgTax: number,
  avgCredits: number,
  avgRate: number,
  avgRateAfterCredits: number
};

export interface IncomeBracket {
  qty: number,
  description: string,
  minAgi: number | null,
  maxAgi: number | null,
  avgAgi: number,
  all: IncomeCategory,
  single: IncomeCategory,
  marriedFilingJointly: IncomeCategory,
  marriedFilingSeparately: IncomeCategory,
  headOfHousehold: IncomeCategory,
};
