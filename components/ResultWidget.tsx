import useStore from '../utils/useStore';
import jsonRates from '../data/rates.json';
import { TaxScheme } from '@/types/taxTypes';
import { calculateTaxRevenue } from '@/utils/taxCalc';
import { formatBigMoney, formatPercent } from '@/utils/formatters';

const defaultRates: TaxScheme = JSON.parse(JSON.stringify(jsonRates));
const baseline = calculateTaxRevenue(defaultRates);

export default function ResultWidget() {
  const revenue = useStore(state => state.taxRevenue);
  const change = (revenue - baseline) / baseline;
  return (
    <div className="bg-indigo-600 rounded-lg px-5 py-2 mt-5 flex w-48 md:w-64 items-center justify-around">
      <div className="text-lg md:text-4xl">
        <div className="font-bold ">{formatBigMoney(revenue)}</div>
        <div className="uppercase text-xs md:text-sm text-indigo-300">Total Revenue</div>
      </div>
      <div className="text-lg md:text-2xl text-indigo-300">
        {change > 0 && '+'}
        {formatPercent(change)}
      </div>
    </div>
  );
}