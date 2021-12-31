const papa = require('papaparse');
const fs = require('fs');
const revenueCSV = fs.readFileSync(__dirname + '/../raw/federal_revenue_categories.csv', 'utf8');

const revenueJSON = papa.parse(revenueCSV, { header: true, ignoreBlankLines: true  }).data;

// filter to only include the top level categories
// combine lesser categories
const categories = revenueJSON
  .filter(({ child }) => !child )
  .map((data) => ({
    ...data,
    value: Number(data.federal_revenue),
  }))
  .reduce((acc, curr) => {
    if (Number(curr.percent_total) < 1) {
      acc[0].value += curr.value;
    } else if(curr.percent_total) {
      acc.push(curr);
    }
    return acc;
  }, [{ parent_plain: 'Other', value: 0 }])
  .sort((a, b) => b.value - a.value)

  const fileName = __dirname + '/../revenue.json';
  fs.writeFileSync(fileName, JSON.stringify(categories, null, 2));
  console.log(`✅ wrote: ${fileName}`);
