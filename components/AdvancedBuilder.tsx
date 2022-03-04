import { ChangeEvent } from "react";
import useStore from "../utils/useStore";
import { formatBigMoney } from "@/utils/formatters";
import { TaxRate } from "@/types/taxTypes";

export default function AdvancedBuilder({ close }: { close: () => void }) {
  const rates = useStore((state) => state.currentPlan()?.scheme);
  const plan = useStore((state) => state.currentPlan());
  const setCurrentPlan = useStore((state) => state.setCurrentPlan);

  const setRates = useStore((state) => state.setRates);

  const setTitle = (newTitle: string) =>
    setCurrentPlan({ ...plan, title: newTitle });
  const setDescription = (newDescription: string) =>
    setCurrentPlan({ ...plan, description: newDescription });

  const adjustGainsRate = (bracketIndex: number, amount: number) => {
    const newRates = { ...rates };
    Object.keys(newRates.gains).forEach((filingStatus) => {
      if (amount < 0) {
        newRates.gains[filingStatus][bracketIndex].rate = 0;
      } else if (amount > 100) {
        newRates.gains[filingStatus][bracketIndex].rate = 100;
      } else {
        newRates.gains[filingStatus][bracketIndex].rate = amount;
      }
    });
    setRates(newRates);
  };

  const adjustPayrollRate = (
    type: "socialSecurity" | "medicare",
    bracketIndex: number,
    amount: number
  ) => {
    const newRates = { ...rates };
    if (amount < 0) {
      newRates.payroll[type][bracketIndex].rate = 0;
    } else if (amount > 100) {
      newRates.payroll[type][bracketIndex].rate = 100;
    } else {
      newRates.payroll[type][bracketIndex].rate = amount;
    }
    setRates(newRates);
  };

  if (!plan) {
    return null;
  }

  return (
    <div className="rounded-lg border-indigo-500 bg-indigo-600 bg-opacity-50 p-3 flex flex-col flex-shrink-0 mx-2">
      <div className="flex justify-between items-start text-left">
        <h5>Plan Settings</h5>
        <button className="text-yellow-500 ml-5">
          <i className="fas fa-times" onClick={close} />
        </button>
      </div>
      <form className="text-left overflow-y-auto p-2">
        <fieldset>
          <div>
            <label className="block">Title</label>
            <input
              type="text"
              className="w-full"
              value={plan.title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="my-5">
            <label className="block">Description</label>
            <textarea
              className="w-full"
              value={plan.description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </fieldset>
        <fieldset className="border border-indigo-500 rounded-md px-5 py-2">
          <legend className="px-1">Capital Gains</legend>

          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={!!rates.gainsAsIncome}
              onChange={(e) =>
                setRates({ ...rates, gainsAsIncome: !!e.target.checked })
              }
            />
            Tax gains as income
          </label>

          <fieldset
            className="inline-block mt-2"
            disabled={!!rates.gainsAsIncome}
          >
            {rates.gains.single.map((r: TaxRate, i: number) => (
              <label key={i} className="mb-2 flex justify-end items-end">
                <span className="mr-2">
                  {formatBigMoney(r.min)}
                  {i === rates.gains.single.length - 1
                    ? "+"
                    : " - " + formatBigMoney(r.max)}
                </span>
                <span>
                  <input
                    type="number"
                    className="text-right mx-1 w-14"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      adjustGainsRate(i, Number(e.target.value) / 100);
                    }}
                    max={100}
                    min={0}
                    step={0.1}
                    value={Math.round(r.rate * 10000) / 100}
                  />
                  %
                </span>
              </label>
            ))}
          </fieldset>
        </fieldset>

        <fieldset className="border border-indigo-500 rounded-md px-5 py-2">
          <legend className="px-1">Payroll Taxes</legend>

          <fieldset className="inline-block">
            <strong className="text-yellow-500">Social Security</strong>
            {rates.payroll.socialSecurity.map((r: TaxRate, i: number) => (
              <label key={r.min} className="mb-2 flex justify-end items-end">
                <span className="mr-2">
                  {formatBigMoney(r.min)}
                  {i === rates.payroll.socialSecurity.length - 1
                    ? "+"
                    : " - " + formatBigMoney(r.max)}
                </span>
                <span>
                  <input
                    type="number"
                    className="text-right mx-2 w-14"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      adjustPayrollRate(
                        "socialSecurity",
                        i,
                        Number(e.target.value) / 100
                      );
                    }}
                    max={100}
                    min={0}
                    step={0.05}
                    value={Math.round(r.rate * 100 * 100) / 100}
                  />
                  %
                </span>
              </label>
            ))}

            <strong className="text-yellow-500">Medicare</strong>
            {rates.payroll.medicare.map((r: TaxRate, i: number) => (
              <label key={r.min} className="mb-2 flex justify-end items-end">
                <span className="mr-2">
                  {formatBigMoney(r.min)}
                  {i === rates.payroll.medicare.length - 1
                    ? "+"
                    : " - " + formatBigMoney(r.max)}
                </span>
                <span>
                  <input
                    type="number"
                    className="text-right mx-2 w-14"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      adjustPayrollRate(
                        "medicare",
                        i,
                        Number(e.target.value) / 100
                      );
                    }}
                    max={100}
                    min={0}
                    step={0.05}
                    value={Math.round(r.rate * 100 * 100) / 100}
                  />
                  %
                </span>
              </label>
            ))}
          </fieldset>
        </fieldset>
      </form>
    </div>
  );
}
