import type { FilingStatus, TaxScheme } from "@/types/taxTypes";
import { calculateSpecificTaxPayerRevenue } from "@/utils/taxCalc";
import jsonRates from "../data/rates.json";
const defaultRates: TaxScheme = JSON.parse(JSON.stringify(jsonRates));
import { formatPercent } from "@/utils/formatters";

export default function Examples({ scheme }: { scheme: TaxScheme }) {
  if (!scheme) {
    return null;
  }
  return (
    <div className="flex flex-col">
      <div>under this plan...</div>
      <div className="flex-1 overflow-y-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-1 2xl:grid-cols-2 min-conent">
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
  const tax = Math.round(
    calculateSpecificTaxPayerRevenue(income, filingStatus, scheme)
  );
  const baseTax = Math.round(
    calculateSpecificTaxPayerRevenue(income, filingStatus, defaultRates)
  );
  const change = (tax - baseTax) / baseTax;

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
          value={`$${tax.toLocaleString()} (${formatPercent(tax / income)})`}
        />

        <LabeledData
          label=""
          value={`${change >= 0 ? "+" : ""}${formatPercent(change)}`}
        />
      </div>
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
