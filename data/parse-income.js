const papa = require('papaparse');
const fs = require('fs');
const assert = require('assert');
const _ = require('lodash');

console.log('loading data...');
const incomeCSV = fs.readFileSync(__dirname + '/soi_income_stats.csv', 'utf8');
const incomeJson = papa.parse(incomeCSV, {
  ignoreBlankLines: true,
  dynamicTyping: true,
  transform: (value) => value
    .replace(/\n/ig, ' ')
    .replace(/\s\s+/ig, ' ')
    .replace(/\[\d+\]|/ig, '')
    .replace(/\*/ig, '')
    .replace(/,(\d+)/ig, '$1'),
}).data;

console.log('parsing data...');
const header1 = incomeJson[2];
const header2 = incomeJson[5];

const headers = ['min', 'max', 'avg'];

for (let i = 0; i < header1.length; i++) {
  let thisHeader = '';
  if (header1[i] && !header2[i]) {
    thisHeader = header1[i];
  } else if (header1[i] && header2[i]) {
    thisHeader = `${header1[i]} - ${header2[i]}`;
  } else if (!header1[i] && header2[i]) {
    thisHeader = `${header1[i-1] || ''} - ${header2[i] || ''}`;
  }

  headers.push(thisHeader);
}

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

const data = incomeJson.slice(8,28).map((row, i) => [
  ...amounts[i],
  Math.round((row[2] * 1000) / row[1]),
  ...row,
]);

const objectifiedData = data.map(row => _.zipObject(headers, row));

objectifiedData.forEach(row => {
  // test that averages are in range
  if (row.min > 0) {
    assert((row.min < row.avg) && (row.avg < row.max), `${row.min} < ${row.avg} < ${row.max}`);
  }
})

console.log('writing data...');

const fileName = __dirname + '/income.json';

fs.writeFileSync(fileName, JSON.stringify(objectifiedData, null, 2));
console.log(`✅ wrote: ${fileName}`);
