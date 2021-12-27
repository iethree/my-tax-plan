const papa = require('papaparse');
const fs = require('fs');
const spendingCSV = fs.readFileSync(__dirname + '/federal_spending_categories.csv', 'utf8');

const spendingJSON = papa.parse(spendingCSV, { header: true }).data;

// filter to only include the top level categories
// combine lesser categories
const categories = spendingJSON
  .filter(({ function: f, child }) => (f === 'category' && !child) )
  .map((data) => ({
    ...data,
    federal_spending: Number(data.federal_spending),
  }))
  .reduce((acc, curr) => {
    if (Number(curr.percent_total) < 5) {
      acc[0].federal_spending += curr.federal_spending;
    } else {
      acc.push(curr);
    }
    return acc;
  }, [{ parent: 'Other', federal_spending: 0 }])
  .sort((a, b) => b.federal_spending - a.federal_spending)

fs.writeFileSync('./spending.json', JSON.stringify(categories, null, 2));
