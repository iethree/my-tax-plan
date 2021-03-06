/* eslint-disable no-undef */
// const { describe, it } = require('mocha');
import { expect, assert } from "chai";
import {
  TaxRate,
  TaxScheme,
  PayrollTaxRates,
  IncomeCategory,
  IncomeBracket,
} from "../types/taxTypes";

import {
  calculatePayrollTax,
  calculateStatusRevenue,
  calculateAllBracketsRevenue,
  calculateSingleBracketRevenue,
} from "./taxCalc";

import defaultRates from "../data/rates.json";
import income from "../data/income.json";
import revenue from "../data/revenue.json";

const BRACKET_ERROR_MARGIN = 0.12;
const TOTAL_ERROR_MARGIN = 0.02;
const PAYROLL_ERROR_MARGIN = 0.09;

const actualScheme: TaxScheme = defaultRates;
const myIncomes: IncomeBracket[] = income;

const simpleRates: TaxRate[] = [
  { rate: 0.1, min: 1, max: 10000 },
  { rate: 0.2, min: 10001, max: 50000 },
  { rate: 0.3, min: 50001, max: 100000000000000 },
];

const flatRates: TaxRate[] = [{ rate: 0.1, min: 0, max: 100000000000000 }];

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
  payroll: {
    socialSecurity: [],
    medicare: [],
  },
};

describe("tax calc tests", () => {
  describe("single status in single bracket calculations", () => {
    it("can calculate very simple rates", () => {
      const rates: TaxRate[] = [{ rate: 0.1, min: 0, max: 100000000000000 }];

      const incomeCategory: IncomeCategory = {
        status: "single",
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
        simpleScheme
      );

      expect(calculatedRevenue.total).to.equal(100);
    });

    it("can calculate multiple brackets", () => {
      const incomeCategory: IncomeCategory = {
        status: "single",
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
        simpleScheme
      );

      expect(calculatedRevenue.total).to.equal(1000 + 8000 + 15000);
    });

    it("can calculate a population", () => {
      const incomeCategory: IncomeCategory = {
        status: "single",
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
        simpleScheme
      );

      assert.approximately(
        calculatedRevenue.total,
        incomeCategory.qty * (1000 + 8000 + 15000),
        2
      );
    });

    it("can account for credits", () => {
      const incomeCategory: IncomeCategory = {
        status: "single",
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
        simpleScheme
      );

      expect(calculatedRevenue.total).to.equal(7 * incomeCategory.qty);
    });
  });

  describe("all statuses in single bracket revenue", () => {
    it("can calculate revenue for all statuses in a single bracket", () => {
      const incomeCategory: IncomeCategory = {
        status: "single",
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
        description: "single",
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
        simpleScheme,
        incomeBracket
      );

      expect(calculatedRevenue.total).to.equal(7 * incomeBracket.qty);
    });
  });

  describe.skip("single taxpayer revenue", () => {
    it("can calculate revenue for an average taxpayer", () => {
      throw new Error("not implemented");
    });

    it("can calculate revenue for a specific taxpayer", () => {
      throw new Error("not implemented");
    });
  });

  describe("actual tax revenue checks", () => {
    const actualSchemeWithoutPayroll = {
      ...actualScheme,
      payroll: {
        socialSecurity: [],
        medicare: [],
      },
    };

    it(`can calculate each bracket revenue within ${
      BRACKET_ERROR_MARGIN * 100
    }% margin of error`, () => {
      const calculations: any[] = [];

      // we don't check the no-income bracket because AMT messes it up
      myIncomes.slice(2).forEach((thisBracket: IncomeBracket) => {
        const calculatedRevenue: number = calculateSingleBracketRevenue(
          actualSchemeWithoutPayroll,
          thisBracket
        ).total;
        const actualRevenue: number =
          thisBracket.all.avgTaxAfterCredits * thisBracket.all.qty;

        const revenueDiff: number = calculatedRevenue - actualRevenue;
        const variance: number =
          Math.round((revenueDiff / actualRevenue) * 1000) / 1000;

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
        assert.approximately(
          calc.variance,
          0,
          BRACKET_ERROR_MARGIN,
          `${calc.description} calculated: ${calc.calculatedRevenue} actual: ${calc.actualRevenue}`
        );
      });
    });

    it(`can calculate all bracket revenues within ${
      TOTAL_ERROR_MARGIN * 100
    }% margin of error`, () => {
      const calculatedRevenue = calculateAllBracketsRevenue(
        actualSchemeWithoutPayroll
      );

      const actualRevenue = myIncomes[0].all.avgTax * myIncomes[0].all.qty;
      const revenueDiff = calculatedRevenue.total - actualRevenue;
      const variance = Math.round((revenueDiff / actualRevenue) * 1000) / 1000;

      // console.log(`actual revenue: ${actualRevenue.toLocaleString()}`);
      // console.log(`calculated revenue: ${calculatedRevenue.toLocaleString()}`);
      // console.log(`variance: ${variance.toLocaleString()}`);

      assert.approximately(variance, 0, TOTAL_ERROR_MARGIN);
    });
  });

  describe("calculates payroll taxes", () => {
    const simplePayrollTaxes: PayrollTaxRates = {
      socialSecurity: [
        {
          min: 1,
          max: 1000,
          rate: 0.2,
        },
      ],
      medicare: [
        {
          min: 1,
          max: 2000,
          rate: 0.1,
        },
      ],
    };

    const incomeCategory: IncomeCategory = {
      status: "single",
      qty: 2,
      avgAgi: 100,
      avgWages: 3000,
      avgOrdinaryIncome: 3000,
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

    it("can calculate simple payroll taxes", () => {
      const tax = calculatePayrollTax(
        incomeCategory.avgWages,
        simplePayrollTaxes
      );
      expect(tax).to.equal(200 + 200);
    });

    it(`can calculate actual payroll tax revenues within ${
      PAYROLL_ERROR_MARGIN * 100
    }%`, () => {
      // we divide by 2 because half of payroll taxes are paid by employers
      const actualRevenue =
        (revenue.find(
          (type) => type.parent_plain === "Social Security and Medicare Taxes"
        )?.federal_revenue || 0) / 2;

      let payrollTaxRevenue = 0;
      myIncomes.slice(1).forEach((thisBracket: IncomeBracket) => {
        const tax = calculatePayrollTax(
          thisBracket.all.avgWages,
          actualScheme.payroll
        );
        payrollTaxRevenue += tax * thisBracket.all.qty;
      });

      const revenueDiff = payrollTaxRevenue - actualRevenue;
      const variance = Math.round((revenueDiff / actualRevenue) * 1000) / 1000;

      assert.approximately(variance, 0, PAYROLL_ERROR_MARGIN);
    });
  });
});

export {};
