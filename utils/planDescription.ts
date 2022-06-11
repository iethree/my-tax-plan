import type { TaxScheme, IncomeClass } from "@/types/taxTypes";
import * as taxPlans from "../constants/taxPlans";
import { formatBigMoney } from "./formatters";
import { calculateTaxRevenue } from "./taxCalc";

const { newPlan } = taxPlans;

const defaultScheme = newPlan().scheme;

export function getPlanDescription(scheme: TaxScheme): string[] {
  return [];
}

export function getDeficitEffect(scheme: TaxScheme, years = 10): string {
  const defaultRevenue = calculateTaxRevenue(defaultScheme);
  const currentRevenue = calculateTaxRevenue(scheme);

  const deficitEffect = currentRevenue.total - defaultRevenue.total;

  return deficitEffect > 0
    ? `reduces the federal deficit by ${formatBigMoney(
        deficitEffect * years
      )} over ${years} years`
    : `increases the federal deficit by ${
        -deficitEffect * years
      } over ${years} years`;
}

export function getClassEffect(
  scheme: TaxScheme,
  incomeClass: IncomeClass
): string {
  return "";
}
