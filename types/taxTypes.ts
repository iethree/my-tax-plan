export interface TaxRate {
  rate: number;
  min: number;
  max: number;
}

export type FilingStatus = 'all' | 'single' | 'marriedFilingJointly' | 'marriedFilingSeparately' | 'headOfHousehold';

export interface TaxRates {
  marriedFilingJointly: TaxRate[];
  marriedFilingSeparately: TaxRate[];
  headOfHousehold: TaxRate[];
  single: TaxRate[];
  [key: string]: TaxRate[];
}

export interface PayrollTaxRates {
  socialSecurity: TaxRate[];
  medicare: TaxRate[];
}
export interface TaxScheme {
  income: TaxRates;
  gains: TaxRates;
  payroll: PayrollTaxRates;
  gainsAsIncome?: boolean;
}

export interface TaxPlan {
  id: number;
  hash: string;
  user_id: string | null;
  title: string | null;
  description: string | null;
  scheme: TaxScheme;
}

export interface IncomeCategory {
  status: FilingStatus | string;
  qty: number;
  avgAgi: number;
  avgWages: number;
  avgOrdinaryIncome: number;
  avgGains: number;
  avgDeduction: number;
  avgTaxable: number;
  avgTax: number;
  avgAMT: number;
  avgCredits: number;
  avgRate: number;
  avgRateAfterCredits: number;
  avgTaxAfterCredits: number;
}

export interface IncomeBracket {
  qty: number;
  description: string;
  minAgi: number | null;
  maxAgi: number | null;
  avgAgi: number;
  all: IncomeCategory;
  single: IncomeCategory;
  marriedFilingJointly: IncomeCategory;
  marriedFilingSeparately: IncomeCategory;
  headOfHousehold: IncomeCategory;
}

