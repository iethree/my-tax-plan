const papa = require('papaparse');
const fs = require('fs');
const assert = require('assert');

// the income file wihtout filing status has more detailed income on sources of income that we might use later
const incomeCSV = fs.readFileSync(__dirname + '/../raw/soi_income_stats.csv', 'utf8');
const statusCSV = fs.readFileSync(__dirname + '/../raw/soi_income_stats_by_status.csv', 'utf8');

const inputTransformer = (value) => value
  .replace(/\n/ig, ' ')
  .replace(/\s\s+/ig, ' ')
  .replace(/\[\d+\]|/ig, '')
  .replace(/\*/ig, '')
  .replace(/,(\d+)/ig, '$1')
  .trim();

const incomeJson = papa.parse(incomeCSV, {
  ignoreBlankLines: true,
  dynamicTyping: true,
  transform: inputTransformer,
}).data;

const statusJson = papa.parse(statusCSV, {
  ignoreBlankLines: true,
  dynamicTyping: true,
  transform: inputTransformer,
}).data;

function getIncomeStats(row, startingIndex) {
  const totalCnt = row[startingIndex];
  const totalAgi = row[startingIndex + 1] * 1000;
  const totalTaxable = row[startingIndex + 7] * 1000;
  const totalDeductions = totalAgi - totalTaxable;
  const totalTaxAfterCredits = row[startingIndex + 8] * 1000;
  const totalTax = row[startingIndex + 9] * 1000;
  const totalCredits = totalTax - totalTaxAfterCredits;

  if (!totalCnt) {
    return {
      qty: 0,
      avgAgi: 0,
      avgDeduction: 0,
      avgTaxable: 0,
      avgTax: 0,
      avgCredits: 0,
      avgRate: 0,
      avgRateAfterCredits: 0,
    };
  }

  return {
    qty: totalCnt,
    avgAgi: Math.round(totalAgi / totalCnt),
    avgDeduction: Math.round(totalDeductions / totalCnt),
    avgTaxable: Math.round(totalTaxable / totalCnt),
    avgTax: Math.round(totalTax / totalCnt),
    avgCredits: Math.round(totalCredits / totalCnt),
    avgRate: Math.round((totalTax / totalAgi) * 1000) / 1000,
    avgRateAfterCredits: Math.round(((totalTax - totalCredits) / totalAgi) * 1000) / 1000,
  };
}

const statusData = statusJson.slice(8,28).map((row, i) => ({
  all: getIncomeStats(row, 1),
  marriedFilingJointly: getIncomeStats(row, 13),
  marriedFilingSeparately: getIncomeStats(row, 24),
  headOfHousehold: getIncomeStats(row, 37),
  single: getIncomeStats(row, 49),
}));

const headers = ['minAgi', 'maxAgi', 'avgAgi'];

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

const incomeData = incomeJson.slice(8,28).map((row, i) => ({
  qty: row[1],
  description: row[0],
  minAgi: amounts[i][0],
  maxAgi: amounts[i][1],
  avgAgi: Math.round((row[2] * 1000) / row[1]),
  ...statusData[i]
}));

incomeData.forEach((row) => {
  if (row.min > 0) {
    // test that averages are in range
    assert((row.minAgi < row.avgAgi) && (row.avgAgi < row.maxAgi), `${row.minAgi} < ${row.avgAgi} < ${row.maxAgi}`);
    // test that taxable averages are derivable from AGI and deductions
    assert((row.avgAgi - row.avgDeduction) === row.avgTaxable, `${row.avgAgi} - ${row.avgDeduction} == ${row.avgTaxable}`);
  }
});

const fileName = __dirname + '/../income.json';
fs.writeFileSync(fileName, JSON.stringify(incomeData, null, 2));
console.log(`✅ wrote: ${fileName}`);
