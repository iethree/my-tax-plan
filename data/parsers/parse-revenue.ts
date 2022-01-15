import papa from 'papaparse';
import fs from 'fs';
import { RevenueCategory } from '@/types/budgetTypes';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const revenueCSV: any = fs.readFileSync(__dirname + '/../raw/federal_revenue_categories.csv', 'utf8');

const revenueJson: RevenueCategory[] = papa.parse(revenueCSV, {
  header: true,
  // @ts-ignore
  ignoreBlankLines: true,
  dynamicTyping: true,
  // @ts-ignore
}).data;

// filter to only include the top level categories
// combine lesser categories
const categories = revenueJson
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
  .sort((a: RevenueCategory, b: RevenueCategory) => b.value - a.value)

  const fileName = __dirname + '/../revenue.json';
  fs.writeFileSync(fileName, JSON.stringify(categories, null, 2));
  console.log(`✅ wrote: ${fileName}`);
