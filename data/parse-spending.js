const papa = require('papaparse');
const fs = require('fs');
const spendingCSV = fs.readFileSync(__dirname + '/federal_spending_categories.csv', 'utf8');

const spendingJSON = papa.parse(spendingCSV, { header: true, ignoreBlankLines: true }).data;

// filter to only include the top level categories
// combine lesser categories
const categories = spendingJSON
  .filter(({ function: f, child }) => (f === 'category' && !child) )
  .map((data) => ({
    ...data,
    value: Number(data.federal_spending),
  }))
  .reduce((acc, curr) => {
    if (Number(curr.percent_total) < 4) {
      acc[0].value += curr.value;
    } else {
      acc.push(curr);
    }
    return acc;
  }, [{ parent_plain: 'Other', value: 0 }])
  .sort((a, b) => b.value - a.value)

fs.writeFileSync(__dirname + '/spending.json', JSON.stringify(categories, null, 2));
