import papa from 'papaparse';
import fs from 'fs';
import { SpendingCategory} from '@/types/budgetTypes';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));



const spendingCSV: any = fs.readFileSync(__dirname + '/../raw/federal_spending_categories.csv', 'utf8');

const spendingJSON: SpendingCategory[] = papa.parse(spendingCSV, {
  header: true,
  // @ts-ignore
  ignoreBlankLines: true,
  dynamicTyping: true,
  // @ts-ignore
}).data;

// filter to only include the top level categories
// combine lesser categories
const categories: SpendingCategory[] = spendingJSON
  .filter(({ function: f, child }) => (f === 'category' && !child) )
  .map((data: SpendingCategory) => ({
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

  const fileName = __dirname + '/../spending.json';
  fs.writeFileSync(fileName, JSON.stringify(categories, null, 2));
  console.log(`✅ wrote: ${fileName}`);
