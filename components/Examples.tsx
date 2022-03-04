import { useState } from "react";
import type { FilingStatus, RevenueDetail, TaxScheme } from "@/types/taxTypes";
import { calculateSpecificTaxPayerRevenue } from "@/utils/taxCalc";
import jsonRates from "../data/rates.json";
import { formatPercent } from "@/utils/formatters";
const defaultRates: TaxScheme = JSON.parse(JSON.stringify(jsonRates));

export default function Examples({ scheme }: { scheme: TaxScheme }) {
  if (!scheme) {
    return null;
  }
  return (
    <div className="flex flex-col">
      <div>under this plan...</div>
      <div className="flex-1 overflow-y-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 min-conent">
          <Example
            scheme={scheme}
            filingStatus="single"
            title="Single Person"
            income={20000}
          />
          <Example
            scheme={scheme}
            filingStatus="marriedFilingJointly"
            title="Family"
            icon="user-friends"
            income={50000}
          />
          <Example
            scheme={scheme}
            filingStatus="headOfHousehold"
            title="Single Parent"
            icon="users"
            income={85000}
          />
          <Example
            scheme={scheme}
            filingStatus="marriedFilingJointly"
            title="Wealthy Family"
            icon="users"
            income={150000}
          />
          <Example
            scheme={scheme}
            filingStatus="marriedFilingJointly"
            title="Wealthier Family"
            icon="users"
            income={500000}
          />
          <Example
            scheme={scheme}
            filingStatus="marriedFilingJointly"
            title="Top 0.1% Family"
            icon="users"
            income={2800000}
          />
        </div>
      </div>
    </div>
  );
}

function Example({
  scheme,
  title,
  income,
  filingStatus,
  icon,
}: {
  scheme: TaxScheme;
  title: string;
  income: number;
  filingStatus: FilingStatus;
  icon?: string;
}) {
  const [showDetail, setShowDetail] = useState(false);

  const revenue = calculateSpecificTaxPayerRevenue(
    income,
    filingStatus,
    scheme
  );

  const baseRevenue = calculateSpecificTaxPayerRevenue(
    income,
    filingStatus,
    defaultRates
  );

  const change = (revenue.total - baseRevenue.total) / baseRevenue.total;

  return (
    <div className="m-5 bg-indigo-600 rounded-lg p-3 shadow-lg shadow-gray-900">
      <div className="flex items-center text-2xl">
        <i className={`fas fa-${icon || "user"} fa-2x fa-fw text-indigo-300`} />
        <div className="text-left leading-tight mx-auto">
          <div>
            {title} <br />@ ${income.toLocaleString()}/yr
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center pt-2 mt-3 border-t">
        <div className="text-2xl text-indigo-300 mx-3">Tax</div>
        <LabeledData
          label="my plan"
          value={`$${Math.round(
            revenue.total
          ).toLocaleString()} (${formatPercent(revenue.total / income)})`}
        />

        <LabeledData
          label=""
          value={`${change >= 0 ? "+" : ""}${formatPercent(change)}`}
        />
      </div>
      <button
        title="show details"
        onClick={() => setShowDetail((d) => !d)}
        className="small mt-2 w-full hover:bg-indigo-700"
      >
        <i className="fas fa-ellipsis fa-fw text-indigo-300" />
      </button>
      {showDetail && <ExampleDetail revenue={revenue} />}
    </div>
  );
}

function LabeledData({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="mx-5">
      <div className="text-xl font-bold">{value}</div>
      <div className="uppercase text-sm text-indigo-300">{label}</div>
    </div>
  );
}

function ExampleDetail({ revenue }: { revenue: RevenueDetail }) {
  return (
    <div className="text-indigo-200 border border-indigo-400 px-5 py-2 mt-2 rounded-md pr-16">
      <table className="mx-auto text-right">
        <tbody>
          <tr>
            <td className="pr-5">Payroll Tax</td>
            <td>${revenue.payrollTax.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="pr-5">Income Tax</td>
            <td>${revenue.incomeTax.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="pr-5">Capital Gains Tax</td>
            <td>${revenue.gainsTax.toLocaleString()}</td>
          </tr>
          <tr>
            <td className="pr-5">Credits</td>
            <td>$({revenue.credits.toLocaleString()})</td>
          </tr>
          <tr className="font-bold text-white">
            <td className="pr-5">Total Tax</td>
            <td>${revenue.total.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
