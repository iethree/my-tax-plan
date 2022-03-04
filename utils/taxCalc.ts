import {
  TaxRate,
  TaxScheme,
  PayrollTaxRates,
  IncomeCategory,
  IncomeBracket,
  FilingStatus,
  RevenueDetail,
} from "@/types/taxTypes";

import incomeJson from "../data/income.json";
// remove the 'all' bracket
const actualIncomes: IncomeBracket[] = incomeJson.slice(1);

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

  let tax = 0;
  let cnt = 0;
  // calculate tax
  do {
    if (taxable > rates[cnt].max) {
      tax += rates[cnt].rate * (rates[cnt].max - (rates[cnt].min - 1));
    } else if (taxable >= rates[cnt].min) {
      tax += rates[cnt].rate * (taxable - (rates[cnt].min - 1));
      break;
    }
    cnt++;
  } while (rates[cnt] && taxable > rates[cnt].min);

  return tax;
}

export function calculateGainsTax(
  totalTaxable: number,
  taxableGains: number,
  rates: TaxRate[]
): number {
  if (taxableGains < 1) return 0;

  const gainsRate: number =
    rates.find(
      (bracket) => totalTaxable < bracket.max && totalTaxable >= bracket.min
    )?.rate || 0;
  return taxableGains * gainsRate;
}

export function calculatePayrollTax(
  wages: number,
  rates: PayrollTaxRates
): number {
  const socialSecurity = calculateTax(wages, rates.socialSecurity);
  const medicare = calculateTax(wages, rates.medicare);

  return socialSecurity + medicare;
}

// calculate tax revenue for an average taxpayer
export function calculateTaxpayerRevenue(
  income: IncomeCategory,
  rates: TaxScheme
): RevenueDetail {
  const status: FilingStatus | string = income.status;

  const gainsRatio: number = income.avgAgi
    ? income.avgGains / income.avgAgi
    : 0;
  const incomeDeduction: number = income.avgDeduction * (1 - gainsRatio);
  const gainsDeduction: number = income.avgDeduction * gainsRatio;

  const gainsIncome =
    income.avgOrdinaryIncome * gainsRatio > 0
      ? income.avgOrdinaryIncome * gainsRatio
      : 0;

  const incomeTax: number = rates.gainsAsIncome
    ? calculateTax(
        income.avgOrdinaryIncome + gainsIncome - income.avgDeduction,
        rates.income[status]
      )
    : calculateTax(
        income.avgOrdinaryIncome - incomeDeduction,
        rates.income[status]
      );

  const gainsTax: number = rates.gainsAsIncome
    ? 0
    : calculateGainsTax(
        income.avgTaxable,
        income.avgGains - gainsDeduction,
        rates.gains[status]
      );

  const payrollTax: number = calculatePayrollTax(
    income.avgWages,
    rates.payroll
  );

  const totalRevenue =
    incomeTax + gainsTax + payrollTax + income.avgAMT - income.avgCredits;

  return {
    total: totalRevenue - income.avgAMT > 0 ? totalRevenue : 0,
    incomeTax: incomeTax > 0 ? incomeTax : 0,
    gainsTax: gainsTax > 0 ? gainsTax : 0,
    payrollTax: payrollTax > 0 ? payrollTax : 0,
    credits: income.avgCredits > 0 ? income.avgCredits : 0,
  };
}

// calculate tax revenue for a specific taxpayer
export function calculateSpecificTaxPayerRevenue(
  income: number,
  status: FilingStatus,
  rates: TaxScheme
): RevenueDetail {
  const incomeBracket: IncomeBracket | undefined = actualIncomes.find(
    (bracket) => income < (bracket.maxAgi || 0)
  );

  if (!incomeBracket) {
    return {
      total: 0,
      incomeTax: 0,
      gainsTax: 0,
      payrollTax: 0,
      credits: 0,
    };
  }

  const incomeCategory: IncomeCategory = incomeBracket[status];

  const incomeRatio: number = income / incomeCategory.avgAgi;

  const gainsRatio: number = incomeCategory.avgAgi
    ? incomeCategory.avgGains / incomeCategory.avgAgi
    : 0;
  const wageRatio: number = incomeCategory.avgWages
    ? incomeCategory.avgWages / incomeCategory.avgAgi
    : 0;
  const incomeDeduction: number =
    incomeCategory.avgDeduction * (1 - gainsRatio);
  const gainsDeduction: number = incomeCategory.avgDeduction * gainsRatio;

  const ordinaryIncome = income * (1 - gainsRatio);
  const gainsIncome = income * gainsRatio > 0 ? income * gainsRatio : 0;
  const taxableIncome = ordinaryIncome - (incomeDeduction + gainsDeduction);
  const wages = income * wageRatio;

  const incomeTax: number = rates.gainsAsIncome
    ? calculateTax(income - incomeCategory.avgDeduction, rates.income[status])
    : calculateTax(ordinaryIncome - incomeDeduction, rates.income[status]);

  const gainsTax: number = rates.gainsAsIncome
    ? 0
    : calculateGainsTax(
        taxableIncome,
        gainsIncome - gainsDeduction,
        rates.gains[status]
      );

  const payrollTax: number = calculatePayrollTax(wages, rates.payroll);

  const amtTax: number = incomeCategory.avgAMT * incomeRatio;
  const credits: number = incomeCategory.avgCredits * incomeRatio;

  const totalRevenue = incomeTax + gainsTax + amtTax + payrollTax - credits;

  const result = {
    total: Math.round(totalRevenue > 0 ? totalRevenue : 0),
    incomeTax: Math.round(incomeTax + amtTax > 0 ? incomeTax + amtTax : 0),
    gainsTax: Math.round(gainsTax > 0 ? gainsTax : 0),
    payrollTax: Math.round(payrollTax > 0 ? payrollTax : 0),
    credits: Math.round(credits > 0 ? credits : 0),
  };

  if (result.total > income) {
    result.total = income;
  }
  return result;
}

// calculate tax revenue for all taxpayers in this status
export function calculateStatusRevenue(
  income: IncomeCategory,
  rates: TaxScheme
): RevenueDetail {
  const avgTaxpayer: RevenueDetail = calculateTaxpayerRevenue(income, rates);
  const allTaxpayers: RevenueDetail = {
    total: avgTaxpayer.total * income.qty,
    incomeTax: avgTaxpayer.incomeTax * income.qty,
    gainsTax: avgTaxpayer.gainsTax * income.qty,
    payrollTax: avgTaxpayer.payrollTax * income.qty,
    credits: avgTaxpayer.credits * income.qty,
  };

  return allTaxpayers;
}

export function calculateSingleBracketRevenue(
  rates: TaxScheme,
  incomeBracket: IncomeBracket
): RevenueDetail {
  return addRevenueDetails([
    calculateStatusRevenue(incomeBracket.single, rates),
    calculateStatusRevenue(incomeBracket.marriedFilingJointly, rates),
    calculateStatusRevenue(incomeBracket.marriedFilingSeparately, rates),
    calculateStatusRevenue(incomeBracket.headOfHousehold, rates),
  ]);
}

export function calculateAllBracketsRevenue(
  rates: TaxScheme,
  incomes: IncomeBracket[] = actualIncomes
): RevenueDetail {
  const startingRevenue = {
    total: 0,
    incomeTax: 0,
    gainsTax: 0,
    payrollTax: 0,
    credits: 0,
  };
  const totalRevenue = incomes.reduce(
    (acc: RevenueDetail, curr: IncomeBracket) =>
      addRevenueDetails([acc, calculateSingleBracketRevenue(rates, curr)]),
    startingRevenue
  );

  if (totalRevenue.total < 0) {
    totalRevenue.total = 0;
  }

  return totalRevenue;
}

// filter incomes by average taxable single income
function filterIncomesOver(
  incomes: IncomeBracket[],
  maxIncome: number
): IncomeBracket[] {
  return incomes.filter(
    (bracket) =>
      bracket.minAgi !== null && bracket.single.avgTaxable <= maxIncome
  );
}

export function calculateTaxRevenue(
  rates: TaxScheme,
  maxIncome = null
): RevenueDetail {
  const incomes = filterIncomesOver(actualIncomes, maxIncome || 99999999999);

  return calculateAllBracketsRevenue(rates, incomes);
}

export const addRevenueDetails = (revenue: RevenueDetail[]): RevenueDetail => ({
  total: revenue.reduce((acc, curr) => acc + curr.total, 0),
  incomeTax: revenue.reduce((acc, curr) => acc + curr.incomeTax, 0),
  gainsTax: revenue.reduce((acc, curr) => acc + curr.gainsTax, 0),
  payrollTax: revenue.reduce((acc, curr) => acc + curr.payrollTax, 0),
  credits: revenue.reduce((acc, curr) => acc + curr.credits, 0),
});
