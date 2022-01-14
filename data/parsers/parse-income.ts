import papa from 'papaparse';
import fs from 'fs';
import assert from 'assert';
import { FilingStatus, IncomeBracket, IncomeCategory } from '@/types/taxTypes';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

// the income file wihtout filing status has more detailed income on sources of income that we might use later
const incomeCSV: any = fs.readFileSync(__dirname + '/../raw/soi_income_stats.csv', 'utf8');
const statusCSV: any = fs.readFileSync(__dirname + '/../raw/soi_income_stats_by_status.csv', 'utf8');

const inputTransformer = (value: string) => value
  .replace(/\n/ig, ' ')
  .replace(/\s\s+/ig, ' ')
  .replace(/\[\d+\]|/ig, '')
  .replace(/\*/ig, '')
  .replace(/,(\d+)/ig, '$1')
  .trim();

const incomeJson: any[][] = papa.parse(incomeCSV, {
  // @ts-ignore
  ignoreBlankLines: true,
  dynamicTyping: true,
  transform: inputTransformer,
  // @ts-ignore
}).data;

const statusJson: any[][] = papa.parse(statusCSV, {
  // @ts-ignore
  ignoreBlankLines: true,
  dynamicTyping: true,
  transform: inputTransformer,
  // @ts-ignore
}).data;

function round(x: number, precision: number = 1000) {
  return Math.round(x * precision) / precision;
}

function getIncomeStats(
  statusRow: any[], startingIndex: number, filingStatus: FilingStatus, detailRow?: any[] | undefined,
): IncomeCategory {
  const totalCnt = statusRow[startingIndex];

  if (!totalCnt) {
    return {
      status: filingStatus,
      qty: 0,
      avgAgi: 0,
      avgWages: 0,
      avgOrdinaryIncome: 0,
      avgDeduction: 0,
      avgTaxable: 0,
      avgAMT: 0,
      avgGains: 0,
      avgTax: 0,
      avgCredits: 0,
      avgRate: 0,
      avgRateAfterCredits: 0,
      avgTaxAfterCredits: 0,
    };
  }

  const totalAgi = statusRow[startingIndex + 1] * 1000;
  const avgAgi = round(totalAgi / totalCnt);
  const totalTaxable = statusRow[startingIndex + 7] * 1000;
  const totalDeductions = totalAgi - totalTaxable;
  const totalTaxAfterCredits = statusRow[startingIndex + 9] * 1000;
  const avgTaxAfterCredits = totalTaxAfterCredits / totalCnt;
  const totalTax = statusRow[startingIndex + 11] * 1000;
  const totalCredits = totalTax - totalTaxAfterCredits;

  // we only have thes figures for all returns, not broken down by filing status
  const totalWages = detailRow ? (detailRow[6] * 1000) : 0;

  // these categories end up making lower incomes less accurate
  const totalOtherOrdinaryIncome = (avgAgi > 100000 && detailRow) ? (
    detailRow[8]  * 1000 + // taxable interest
    detailRow[12] * 1000 + // taxable dividends
    detailRow[18] * 1000 + // alimony
    detailRow[20] * 1000 + // business net income
    detailRow[30] * 1000 + // non-capital asset sales
    detailRow[34] * 1000 + // taxable IRA distributions
    // detailRow[38] * 1000 + // taxable pensions and annuities
    detailRow[52] * 1000 + // taxable rents and toyalties
    detailRow[56] * 1000 + // parntership and s corp income
    detailRow[76] * 1000   // other income
  ) : 0;

  const totalOrdinaryIncome = totalWages + totalOtherOrdinaryIncome;
  const totalAMT = detailRow ? (detailRow[144] * 1000) : 0;
  const totalGains = totalAgi - totalOrdinaryIncome;

  return {
    status: filingStatus,
    qty: totalCnt,
    avgAgi,
    avgWages: round(totalWages / totalCnt),
    avgOrdinaryIncome: round(totalOrdinaryIncome / totalCnt),
    avgGains: round(totalGains / totalCnt),
    avgDeduction: round(totalDeductions / totalCnt),
    avgTaxable: round(totalTaxable / totalCnt),
    avgTax: round(totalTax / totalCnt),
    avgAMT: round(totalAMT / totalCnt),
    avgTaxAfterCredits: round(avgTaxAfterCredits),
    avgCredits: round(totalCredits / totalCnt),
    avgRate: round((totalTax / totalAgi), 1000),
    avgRateAfterCredits: round(((totalTax - totalCredits) / totalAgi), 1000),
  };
}

const statusData = statusJson.slice(8,28).map((row: any, i: number) => ({
  all: getIncomeStats(row, 1, 'all', incomeJson[i + 8]),
  marriedFilingJointly: getIncomeStats(row, 13, 'marriedFilingJointly'),
  marriedFilingSeparately: getIncomeStats(row, 25, 'marriedFilingSeparately'),
  headOfHousehold: getIncomeStats(row, 37, 'headOfHousehold'),
  single: getIncomeStats(row, 49, 'single'),
}));


const amounts = [
  [null, null],
  [0, 0],
  [1, 4999],
  [5000, 9999],
  [10000, 14999],
  [15000, 19999],
  [20000, 24999],
  [25000, 29999],
  [30000, 39999],
  [40000, 49999],
  [50000, 74999],
  [75000, 99999],
  [100000, 199999],
  [200000, 499999],
  [500000, 999999],
  [1000000, 1499999],
  [1500000, 1999999],
  [2000000, 4999999],
  [5000000, 9999999],
  [10000000, 999999999999],
];

const incomeData: IncomeBracket[] = incomeJson.slice(8,28).map((row: any, i: number) => ({
  qty: row[1],
  description: row[0],
  minAgi: amounts[i][0],
  maxAgi: amounts[i][1],
  avgAgi: Math.round((row[2] * 1000) / row[1]),
  ...statusData[i]
}));


function condenseStatusData(data: IncomeCategory[]) {
  const totalQty = data.reduce((acc, { qty }) => acc + qty, 0);
  const status = data[0].status;

  const condensedData = data.reduce((acc: IncomeCategory, row: IncomeCategory) => {
    acc.avgAgi += row.avgAgi * row.qty / totalQty;
    acc.avgWages += row.avgWages * row.qty / totalQty;
    acc.avgOrdinaryIncome += row.avgOrdinaryIncome * row.qty / totalQty;
    acc.avgDeduction += row.avgDeduction * row.qty / totalQty;
    acc.avgTaxable += row.avgTaxable * row.qty / totalQty;
    acc.avgAMT += row.avgAMT * row.qty / totalQty;
    acc.avgGains += row.avgGains * row.qty / totalQty;
    acc.avgTax += row.avgTax * row.qty / totalQty;
    acc.avgCredits += row.avgCredits * row.qty / totalQty;
    acc.avgRate += row.avgRate * row.qty / totalQty;
    acc.avgRateAfterCredits += row.avgRateAfterCredits * row.qty / totalQty;
    acc.avgTaxAfterCredits += row.avgTaxAfterCredits * row.qty / totalQty;
    return acc;
  }, {
    status: status,
    qty: totalQty,
    avgAgi: 0,
    avgWages: 0,
    avgOrdinaryIncome: 0,
    avgDeduction: 0,
    avgTaxable: 0,
    avgAMT: 0,
    avgGains: 0,
    avgTax: 0,
    avgCredits: 0,
    avgRate: 0,
    avgRateAfterCredits: 0,
    avgTaxAfterCredits: 0,
  });

  return {
    status: status,
    qty: totalQty,
    avgAgi: round(condensedData.avgAgi),
    avgWages: round(condensedData.avgWages),
    avgOrdinaryIncome: round(condensedData.avgOrdinaryIncome),
    avgDeduction: round(condensedData.avgDeduction),
    avgTaxable: round(condensedData.avgTaxable),
    avgAMT: round(condensedData.avgAMT),
    avgGains: round(condensedData.avgGains),
    avgTax: round(condensedData.avgTax),
    avgCredits: round(condensedData.avgCredits),
    avgRate: round(condensedData.avgRate),
    avgRateAfterCredits: round(condensedData.avgRateAfterCredits),
    avgTaxAfterCredits: round(condensedData.avgTaxAfterCredits),
  }
}

// condense the given income brackets into a single bracket
function condenseIncomeData(data: IncomeBracket[]) {
  const totalQty = data.reduce((acc, { qty }) => acc + qty, 0)
  return {
    qty: totalQty,
    description: `$${data[0].minAgi} under $${data[data.length - 1].maxAgi}`,
    minAgi: data[0].minAgi,
    maxAgi: data[data.length - 1].maxAgi,
    avgAgi: round(data.reduce((acc, { qty, avgAgi }) => acc + (avgAgi * qty), 0) / totalQty),
    all: condenseStatusData(data.map((d) => d.all)),
    single: condenseStatusData(data.map((d) => d.single)),
    marriedFilingJointly: condenseStatusData(data.map((d) => d.marriedFilingJointly)),
    marriedFilingSeparately: condenseStatusData(data.map((d) => d.marriedFilingSeparately)),
    headOfHousehold: condenseStatusData(data.map((d) => d.headOfHousehold)),
  };
}


// collapse some of the lower income brackets
const oneToTwentyFive = condenseIncomeData(incomeData.slice(2,7));
const twentyFiveToFifty = condenseIncomeData(incomeData.slice(7,10));

incomeData.splice(2, 8, oneToTwentyFive, twentyFiveToFifty);

incomeData.forEach((income: IncomeBracket) => {
  const bracketPercent = {
    marriedFilingJointly: income.marriedFilingJointly.avgAgi / income.all.avgAgi,
    marriedFilingSeparately: income.marriedFilingSeparately.avgAgi / income.all.avgAgi,
    headOfHousehold: income.headOfHousehold.avgAgi / income.all.avgAgi,
    single: income.single.avgAgi / income.all.avgAgi,
  };

  // estimate wages for each filing status as proportional to AGI
  income.single.avgWages = round(
    income.all.avgWages * bracketPercent.single
  );
  income.marriedFilingJointly.avgWages = round(
    income.all.avgWages * bracketPercent.marriedFilingJointly
  );
  income.marriedFilingSeparately.avgWages = round(
    income.all.avgWages * bracketPercent.marriedFilingSeparately
  );
  income.headOfHousehold.avgWages = round(
    income.all.avgWages * bracketPercent.headOfHousehold
  );

  // estimate ordinary income for each filing status as proportional to AGI
  income.single.avgOrdinaryIncome = round(
    income.all.avgOrdinaryIncome * bracketPercent.single
  );
  income.marriedFilingJointly.avgOrdinaryIncome = round(
    income.all.avgOrdinaryIncome * bracketPercent.marriedFilingJointly
  );
  income.marriedFilingSeparately.avgOrdinaryIncome = round(
    income.all.avgOrdinaryIncome * bracketPercent.marriedFilingSeparately
  );
  income.headOfHousehold.avgOrdinaryIncome = round(
    income.all.avgOrdinaryIncome * bracketPercent.headOfHousehold
  );


  // estimate AMT for each filing status as proportional to AGI
  income.single.avgAMT = round(
    income.all.avgAMT * bracketPercent.single
  );
  income.marriedFilingJointly.avgAMT = round(
    income.all.avgAMT * bracketPercent.marriedFilingJointly
  );
  income.marriedFilingSeparately.avgAMT = round(
    income.all.avgAMT * bracketPercent.marriedFilingSeparately
  );
  income.headOfHousehold.avgAMT = round(
    income.all.avgAMT * bracketPercent.headOfHousehold
  );

  // estimate capital gains for each filing status as proportional to AGI
  income.single.avgGains = round(
    income.all.avgGains * bracketPercent.single
  );
  income.marriedFilingJointly.avgGains = round(
    income.all.avgGains * bracketPercent.marriedFilingJointly
  );
  income.marriedFilingSeparately.avgGains = round(
    income.all.avgGains * bracketPercent.marriedFilingSeparately
  );
  income.headOfHousehold.avgGains = round(
    income.all.avgGains * bracketPercent.headOfHousehold
  );

});

const plusOrMinus = (x: number, y: number, variance: number) => (
  (x >= (y - variance))
  && (x <= (y + variance))
);


// tests
incomeData.forEach((row) => {
  if (row.minAgi && row.maxAgi && row.minAgi > 0 && row.qty > 0) {
    // test that averages are in range
    assert(
      (row.minAgi < row.avgAgi) && (row.avgAgi < row.maxAgi),
      `${row.minAgi} < ${row.avgAgi} < ${row.maxAgi}`
    );

    // test that taxable averages are derivable from AGI and deductions
    assert(
      plusOrMinus((row.all.avgAgi - row.all.avgDeduction), row.all.avgTaxable, 1),
      `${row.all.avgAgi} - ${row.all.avgDeduction} == ${row.all.avgTaxable}`
    );

    // test that credits are properly calculated
    assert(
      plusOrMinus((row.all.avgTax - row.all.avgCredits), row.all.avgTaxAfterCredits, 1),
      `${row.all.avgTax} - ${row.all.avgCredits} == ${row.all.avgTaxAfterCredits}`
    );
  }
});

const writeIncomes: IncomeBracket[] = incomeData;

const fileName: string = __dirname + '/../income.json';
fs.writeFileSync(fileName, JSON.stringify(writeIncomes, null, 2));
console.log(`✅ wrote: ${fileName}`);
