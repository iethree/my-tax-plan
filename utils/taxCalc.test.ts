// const { describe, it } = require('mocha');
import { expect } from 'chai';
import {
  TaxRate, TaxRates,
  IncomeCategory, IncomeBracket
} from '@/types/taxTypes';

import {
  calculateStatusRevenue,
  calculateBracketRevenue,
  calculateCapGainsRevenue,
  calculatePayrollRevenue,
  calculateTaxRevenue,
} from './taxCalc';

import defaultRates from '../data/rates.json';
import income from '../data/income.json';

const myRates: TaxRates = defaultRates;
const myIncomes: IncomeBracket[] = income;

describe('tax calc tests', () => {
  it('can test', () => {
    expect(true).to.equal(true);
  });

  it('can calculate single status revenue for the no income bracket', () => {
    const thisBracket: IncomeCategory = myIncomes[1].single;

    expect(calculateStatusRevenue(thisBracket, myRates.single)).to.equal(0);
  })

  it('can calculate single status revenue for the 50-75k  income bracket', () => {
    const thisBracket: IncomeCategory = myIncomes[10].single;
    expect(calculateStatusRevenue(thisBracket, myRates.single)).to.equal(
      thisBracket.avgAgi * thisBracket.avgRateAfterCredits * thisBracket.qty
    );
  })

  it.skip('can calculate bracket revenue', () => {
    expect(calculateBracketRevenue(myRates)).to.equal(
      myIncomes[0].all.avgTax * myIncomes[0].all.qty
    );
  })
});

export {};
