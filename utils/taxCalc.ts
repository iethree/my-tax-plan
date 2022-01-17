import {
  TaxRate, TaxRates, TaxScheme,
  IncomeCategory, IncomeBracket,
  FilingStatus,
} from '@/types/taxTypes';

import incomeJson from '../data/income.json';
const incomes: IncomeBracket[] = incomeJson;
// import defaultRates from '../data/rates.json';

const filingStatus: string[] = [
  'single',
  'marriedFilingJointly',
  'marriedFilingSeparately',
  'headOfHousehold'
];

/**
 * calculate the tax payable given taxable income and the given tax rates for a single taxpayer
 * can be used for capital gains or regular income
 *
 * @param {numbeR} taxable the taxable income
 * @param {TaxRate[]} rates the tax rates
 * @returns {number} the tax due for a single taxpayer
 */
export function calculateTax(taxable: number, rates: TaxRate[]): number {

  if (taxable < 1 || !rates.length) return 0;

  let tax: number = 0;
  let cnt: number = 0;
  // calculate tax
  do {
    if (taxable > rates[cnt].max) {
      tax += rates[cnt].rate * (rates[cnt].max - rates[cnt].min);
    } else if (taxable >= rates[cnt].min) {
      tax += rates[cnt].rate * (taxable - rates[cnt].min);
      break;
    }
    cnt++;
  } while (rates[cnt] && taxable > rates[cnt].min);

  return tax;
}

export function calculateGainsTax(totalTaxable: number, taxableGains: number, rates: TaxRate[]): number {

  if (taxableGains < 1) return 0;

  const gainsRate: number = rates.find(bracket => totalTaxable < bracket.max && totalTaxable >= bracket.min)?.rate || 0;
  return taxableGains * gainsRate;
}

export function calculatePayrollTax(income: IncomeCategory, rates: TaxRate[]): number {
  return 0;
}


// calculate tax revenue for an average taxpayer
export function calculateTaxpayerRevenue(income: IncomeCategory, rates: TaxScheme): number {
  const status: FilingStatus | string = income.status;

  const gainsRatio: number = income.avgAgi ? (income.avgGains / income.avgAgi) : 0;
  const incomeDeduction: number = (income.avgDeduction * (1 - gainsRatio));
  const gainsDeduction: number = income.avgDeduction * gainsRatio;

  const incomeTax: number = calculateTax(income.avgOrdinaryIncome - incomeDeduction, rates.income[status]);
  const gainsTax: number = calculateGainsTax(income.avgTaxable, income.avgGains - gainsDeduction, rates.gains[status]);
  // TODO payroll tax

  return (incomeTax + gainsTax + income.avgAMT) - income.avgCredits;
};

// calculate tax revenue for all taxpayers in this status
export function calculateStatusRevenue(income: IncomeCategory, rates: TaxScheme): number {
  const avgTaxpayer: number = calculateTaxpayerRevenue(income, rates);
  const allTaxpayers: number = avgTaxpayer * income.qty;

  return Math.round(allTaxpayers);
};


export function calculateSingleBracketRevenue(rates: TaxScheme, incomeBracket: IncomeBracket): number {
  return Math.round(
    calculateStatusRevenue(incomeBracket.single, rates) +
    calculateStatusRevenue(incomeBracket.marriedFilingJointly, rates) +
    calculateStatusRevenue(incomeBracket.marriedFilingSeparately, rates) +
    calculateStatusRevenue(incomeBracket.headOfHousehold, rates)
  );
}

export function calculateAllBracketsRevenue(rates: TaxScheme): number {
  // don't calcualte the first index, which is all brackets
  const totalRevenue = incomes.slice(1).reduce(
    (acc: number, curr: IncomeBracket) => acc + calculateSingleBracketRevenue(rates, curr), 0
  );

  return totalRevenue;
}

function filterIncomesOver(rates: TaxRate[], maxIncome: number) {
  return rates.filter(bracket => bracket.max <= maxIncome)
};

export function calculateTaxRevenue(rates: TaxScheme, maxIncome: number = 10000000000): number {
  const partialScheme: TaxScheme = {
    income: {
      single: filterIncomesOver(rates.income.single, maxIncome),
      marriedFilingJointly: filterIncomesOver(rates.income.marriedFilingJointly, maxIncome),
      marriedFilingSeparately: filterIncomesOver(rates.income.marriedFilingSeparately, maxIncome),
      headOfHousehold: filterIncomesOver(rates.income.headOfHousehold, maxIncome),
    },
    gains: rates.gains,
  };

  return (
    calculateAllBracketsRevenue(partialScheme)
  );
}
