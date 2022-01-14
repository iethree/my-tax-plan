// const { describe, it } = require('mocha');
import { expect, assert } from 'chai';
import {
  TaxRate, TaxRates, TaxScheme,
  IncomeCategory, IncomeBracket,
} from '../types/taxTypes';

import {
  calculateTax,
  calculateStatusRevenue,
  calculateAllBracketsRevenue,
  calculateSingleBracketRevenue,
} from './taxCalc';

import defaultRates from '../data/rates.json';
import income from '../data/income.json';

const BRACKET_ERROR_MARGIN: number = 0.12;
const TOTAL_ERROR_MARGIN: number = 0.02;

const actualScheme: TaxScheme = defaultRates;
const myIncomes: IncomeBracket[] = income;

const simpleRates: TaxRate[] = [
  { rate: 0.10, min: 0, max: 10000 },
  { rate: 0.20, min: 10001, max: 50000 },
  { rate: 0.30, min: 50001, max: 100000000000000 },
];

const flatRates : TaxRate[] = [
  { rate: 0.10, min: 0, max: 100000000000000 },
];

const simpleScheme: TaxScheme = {
  income: {
    marriedFilingJointly: simpleRates,
    marriedFilingSeparately: simpleRates,
    headOfHousehold: simpleRates,
    single: simpleRates,
  },
  gains: {
    marriedFilingJointly: flatRates,
    marriedFilingSeparately: flatRates,
    headOfHousehold: flatRates,
    single: flatRates,
  },
};

describe('tax calc tests', () => {

  describe('single status in single bracket calculations', () => {
    it('can calculate very simple rates', () => {
      const rates: TaxRate[] = [
        { rate: 0.10, min: 0, max: 100000000000000 },
      ];

      const incomeCategory: IncomeCategory = {
        status: 'single',
        qty: 1,
        avgAgi: 1000,
        avgWages: 1000,
        avgOrdinaryIncome: 1000,
        avgDeduction: 0,
        avgTaxable: 1000,
        avgTax: 0,
        avgGains: 0,
        avgAMT: 0,
        avgCredits: 0,
        avgRate: 0,
        avgRateAfterCredits: 0,
        avgTaxAfterCredits: 0,
      };

      const calculatedRevenue = calculateStatusRevenue(
        incomeCategory,
        simpleScheme,
      );

      expect(calculatedRevenue).to.equal(100);
    });

    it('can calculate multiple brackets', () => {


      const incomeCategory: IncomeCategory = {
        status: 'single',
        qty: 1,
        avgAgi: 100000,
        avgWages: 100000,
        avgOrdinaryIncome: 100000,
        avgDeduction: 0,
        avgTaxable: 100000,
        avgTax: 0,
        avgGains: 0,
        avgAMT: 0,
        avgCredits: 0,
        avgRate: 0,
        avgRateAfterCredits: 0,
        avgTaxAfterCredits: 0,
      };

      const calculatedRevenue = calculateStatusRevenue(
        incomeCategory,
        simpleScheme,
      );

      expect(calculatedRevenue).to.equal(1000 + 8000 + 15000);
    });

    it('can calculate a population', () => {
      const incomeCategory: IncomeCategory = {
        status: 'single',
        qty: 3,
        avgAgi: 100000,
        avgWages: 100000,
        avgOrdinaryIncome: 100000,
        avgDeduction: 0,
        avgTaxable: 100000,
        avgTax: 0,
        avgGains: 0,
        avgAMT: 0,
        avgCredits: 0,
        avgRate: 0,
        avgRateAfterCredits: 0,
        avgTaxAfterCredits: 0,
      };

      const calculatedRevenue = calculateStatusRevenue(
        incomeCategory,
        simpleScheme,
      );

      assert.approximately(calculatedRevenue, incomeCategory.qty * (1000 + 8000 + 15000), 1);
    });

    it('can account for credits', () => {

      const incomeCategory: IncomeCategory = {
        status: 'single',
        qty: 2,
        avgAgi: 100,
        avgWages: 100,
        avgOrdinaryIncome: 100,
        avgDeduction: 0,
        avgTaxable: 100,
        avgTax: 0,
        avgGains: 0,
        avgAMT: 0,
        avgCredits: 3,
        avgRate: 0,
        avgRateAfterCredits: 0,
        avgTaxAfterCredits: 0,
      };

      const calculatedRevenue = calculateStatusRevenue(
        incomeCategory,
        simpleScheme,
      );

      expect(calculatedRevenue).to.equal(7 * incomeCategory.qty);
    });
  });

  describe('all statuses in single bracket revenue', () => {
    it('can calculate revenue for all statuses in a single bracket', () => {
      const incomeCategory: IncomeCategory = {
        status: 'single',
        qty: 2,
        avgAgi: 100,
        avgWages: 100,
        avgOrdinaryIncome: 100,
        avgDeduction: 0,
        avgTaxable: 100,
        avgTax: 0,
        avgGains: 0,
        avgAMT: 0,
        avgCredits: 3,
        avgRate: 0,
        avgRateAfterCredits: 0,
        avgTaxAfterCredits: 0,
      };

      const incomeBracket: IncomeBracket = {
        qty: 8,
        description: 'single',
        minAgi: null,
        maxAgi: null,
        avgAgi: 100,
        all: { ...incomeCategory, qty: 8 },
        single: incomeCategory,
        marriedFilingJointly: incomeCategory,
        marriedFilingSeparately: incomeCategory,
        headOfHousehold: incomeCategory,
      };

      const calculatedRevenue = calculateSingleBracketRevenue(
        simpleScheme, incomeBracket
      );

      expect(calculatedRevenue).to.equal(7 * incomeBracket.qty);
    });
  });

  describe('actual tax revenue checks', () => {
    it(`can calculate each bracket revenue within ${BRACKET_ERROR_MARGIN * 100}% margin of error`, () => {
      const calculations: object[] = [];

      myIncomes.slice(1).forEach((thisBracket: IncomeBracket) => {
        const calculatedRevenue: number = calculateSingleBracketRevenue(actualScheme, thisBracket);
        const actualRevenue: number  = thisBracket.all.avgTaxAfterCredits * thisBracket.all.qty;

        const revenueDiff: number = calculatedRevenue - actualRevenue;
        const variance:number = Math.round((revenueDiff / actualRevenue) * 1000) / 1000;

        calculations.push({
          description: thisBracket.description,
          taxable: thisBracket.all.avgTaxable.toLocaleString(),
          calculatedRevenue: calculatedRevenue.toLocaleString(),
          actualRevenue: actualRevenue.toLocaleString(),
          revenueDiff: revenueDiff.toLocaleString(),
          variance,
        });
      });

      // console.table(calculations);

      calculations.forEach((calc) => {
        //@ts-ignore
        assert.approximately(calc.variance, 0, BRACKET_ERROR_MARGIN, `${calc.description}`);
      })
    });

    it(`can calculate all bracket revenues within ${TOTAL_ERROR_MARGIN * 100}% margin of error`, () => {

      const calculatedRevenue = calculateAllBracketsRevenue(actualScheme);

      const actualRevenue = myIncomes[0].all.avgTax * myIncomes[0].all.qty;
      const revenueDiff = calculatedRevenue - actualRevenue;
      const variance = Math.round((revenueDiff / actualRevenue) * 1000) / 1000;

      // console.log(`actual revenue: ${actualRevenue.toLocaleString()}`);
      // console.log(`calculated revenue: ${calculatedRevenue.toLocaleString()}`);
      // console.log(`variance: ${variance.toLocaleString()}`);

      assert.approximately(
        variance,
        0,
        TOTAL_ERROR_MARGIN,
      );
    })
  });


});

export {};
