const papa = require('papaparse');
const fs = require('fs');
const rateCSV = fs.readFileSync(__dirname + '/../raw/income_tax_rates.csv', 'utf8');

const rateJSON = papa.parse(rateCSV, { header: true, ignoreBlankLines: true, dynamicTyping: true }).data;

// group by status
const ratesByStatus = rateJSON.reduce((acc, curr) => {
  if (acc[curr.filingStatus]) {
    acc[curr.filingStatus].push({
      rate: curr.rate,
      min: curr.min,
      max: curr.max,
    });
  } else {
    acc[curr.filingStatus] = [{
      rate: curr.rate,
      min: curr.min,
      max: curr.max,
    }];
  }
  return acc;
}, {});

const fileName = __dirname + '/../rates.json';
fs.writeFileSync(fileName, JSON.stringify(ratesByStatus, null, 2));
console.log(`✅ wrote: ${fileName}`);
