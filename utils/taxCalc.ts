import {
  TaxRate, TaxRates,
  IncomeCategory, IncomeBracket
} from '@/types/taxTypes';

import incomeJson from '../data/income.json';
const incomes: IncomeBracket[] = incomeJson;
import defaultRates from '../data/rates.json';

const filingStatus: string[] = [
  'single',
  'marriedFilingJointly',
  'marriedFilingSeparately',
  'headOfHousehold'
];

export function calculateStatusRevenue(income: IncomeCategory, rates: TaxRate[]): number {
  if (income.avgTaxable < 1) return 0;

  // find applicable tax rate
  let tax: number = 0;
  let cnt: number = 0;

  // calculate tax
  do {
    if (income.avgTaxable > rates[cnt].max) {
      tax += rates[cnt].rate * (rates[cnt].max - rates[cnt].min);
    } else if (income.avgTaxable >= rates[cnt].min) {
      tax += rates[cnt].rate * (income.avgTaxable - rates[cnt].min);
    }
    console.log('tax', tax);
    cnt++;
  } while (income.avgTaxable > rates[cnt].min);


  const avgTaxpayer = tax - income.avgCredits;
  const allTaxpayers = avgTaxpayer * income.qty;
  console.log(tax, avgTaxpayer, allTaxpayers);
  return allTaxpayers;
};

export function calculateBracketRevenue(rates: TaxRates): number {
  let totalRevenue = 0;

  // for each income bracket
  incomes.forEach((incomeBracket: IncomeBracket) => {
    if (incomeBracket.maxAgi === null) return;

    // calculate the revenue for eachfiling status
    totalRevenue += (
      calculateStatusRevenue(incomeBracket.single, rates.single) // +
      // calculateStatusRevenue(incomeBracket.marriedFilingJointly, rates.marriedFilingJointly) +
      // calculateStatusRevenue(incomeBracket.marriedFilingSeparately, rates.marriedFilingSeparately) +
      // calculateStatusRevenue(incomeBracket.headOfHousehold, rates.headOfHousehold)
    );
  });

  return Math.round(totalRevenue);
}

export function calculateCapGainsRevenue(rates: TaxRates): number {
  return 1;
}

export function calculatePayrollRevenue(rates: TaxRates): number {
  return 1;
}

export function calculateTaxRevenue(rates: TaxRates): number {
  return (
    calculateBracketRevenue(rates) +
    calculateCapGainsRevenue(rates) +
    calculatePayrollRevenue(rates)
  );
}
