import { expect } from "chai";
import {
  getPlanDescription,
  getDeficitEffect,
  getClassEffect,
} from "./planDescription";
import * as plans from "../constants/taxPlans";
const { newPlan } = plans;

describe("plan descriptions", () => {
  const defaultScheme = newPlan().scheme;

  it("gets a positive deficit description", () => {
    defaultScheme.payroll.socialSecurity[0].rate = 0.3;
    const result = getDeficitEffect(defaultScheme, 2);
    console.log(result);
    expect(result).to.include("reduces the federal deficit by");
    expect(result).to.include("over 2 years");
  });

  it("gets a negative deficit description", () => {
    defaultScheme.payroll.socialSecurity[0].rate = 0.01;
    const result = getDeficitEffect(defaultScheme, 2);
    console.log(result);
    expect(result).to.include("increases the federal deficit by");
    expect(result).to.include("over 2 years");
  });
});

export {};
