/* eslint-disable prettier/prettier */

import papa from 'papaparse';
import fs from 'fs';
import { TaxRates, TaxRate, TaxScheme } from '@/types/taxTypes';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const rateCSV: any = fs.readFileSync(__dirname + '/../raw/income_tax_rates.csv', 'utf8');
const gainsRateCSV: any = fs.readFileSync(__dirname + '/../raw/gains_tax_rates.csv', 'utf8');
const payrollRateCSV: any = fs.readFileSync(__dirname + '/../raw/payroll_tax_rates.csv', 'utf8');

// @ts-ignore
const rateJSON: any = papa.parse(rateCSV, { header: true, ignoreBlankLines: true, dynamicTyping: true }).data;
// @ts-ignore
const gainsRateJSON: any = papa.parse(gainsRateCSV, { header: true, ignoreBlankLines: true, dynamicTyping: true }).data;
// @ts-ignore
const payrollRateJSON: any = papa.parse(payrollRateCSV, { header: true, ignoreBlankLines: true, dynamicTyping: true }).data;

// group by status
const incomeRatesByStatus: TaxRates = rateJSON.reduce((acc: any, curr: any) => {
  acc[curr.filingStatus] && acc[curr.filingStatus].push({
    rate: curr.rate,
    min: curr.min,
    max: curr.max,
  });

  return acc;
}, {
  single: [],
  marriedFilingJointly: [],
  marriedFilingSeparately: [],
  headOfHousehold: [],
});

const gainsRatesByStatus: TaxRates = gainsRateJSON.reduce((acc: any, curr: any) => {
  acc[curr.filingStatus] && acc[curr.filingStatus].push({
    rate: curr.rate,
    min: curr.min,
    max: curr.max,
  });

  return acc;
}, {
  single: [],
  marriedFilingJointly: [],
  marriedFilingSeparately: [],
  headOfHousehold: [],
});

const payrollRates = payrollRateJSON.reduce((acc: any, curr: any) =>{
  acc[curr.type].push({
    rate: curr.rate,
    min: curr.min,
    max: curr.max,
  });
  return acc;
}, { socialSecurity: [], medicare: [] });

const allRates: TaxScheme = {
  income: incomeRatesByStatus,
  gains: gainsRatesByStatus,
  payroll: payrollRates,
};

const fileName = __dirname + '/../rates.json';

fs.writeFileSync(fileName, JSON.stringify(allRates, null, 2));
console.log(`✅ wrote: ${fileName}`);
