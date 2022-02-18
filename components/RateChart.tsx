import { useState, useEffect } from 'react';
import {
  ResponsiveContainer, ComposedChart, XAxis, YAxis, Area,
  Tooltip, LabelList, Label, Bar, Legend,
} from 'recharts';
import colors from 'tailwindcss/colors';
import { TaxScheme } from '@/types/taxTypes';
import { calculateTaxRevenue } from '@/utils/taxCalc';

import jsonRates from '../data/rates.json';
const defaultRates: TaxScheme = JSON.parse(JSON.stringify(jsonRates));

const baselineRevenue = calculateTaxRevenue(defaultRates);

import { formatBigMoney, formatPercent } from '@/utils/formatters';
import Examples from './Examples';

const formatters = {
  revenue: formatBigMoney,
  rate: formatPercent,
};

export default function BracketChart() {
  const [rates, setRates]: [TaxScheme, Function] = useState({ ...defaultRates });
  const [taxRevenue, setTaxRevenue]: [number, Function] = useState(0);

  const adjust = (bracketIndex: number, amount: number) => {
    const newRates = { ...rates };
    Object.keys(newRates.income).forEach((filingStatus) => {
      const prevRate = newRates.income[filingStatus][bracketIndex].rate;
      if (prevRate + amount < 0) {
        newRates.income[filingStatus][bracketIndex].rate = 0;
      } else if ( prevRate + amount > 1) {
        newRates.income[filingStatus][bracketIndex].rate = 1;
      } else {
        newRates.income[filingStatus][bracketIndex].rate += amount;
      }
    });
    setRates(newRates);
  };


  function handleBarDrag(chartEvent: any) {

    const { rate: startingRate } = chartEvent.payload;
    const rateIndex = rates.income.single.findIndex((bracket) => bracket.rate === startingRate);
    let startYPos: number | null = null;

    const mouseMove = (mouseEvent: any) => {
      console.log({ mouseEvent });

      const currentPos = mouseEvent.clientY || mouseEvent.touches[0].clientY;
      if (startYPos === null) {
        startYPos = currentPos;
        return;
      }
      const moveDistance = startYPos - currentPos;
      const moveAmount = Math.round(moveDistance / 2) * .01;

      adjust(rateIndex, moveAmount);

      startYPos = currentPos;
    }

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('touchmove', mouseMove);

    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('touchmove', mouseMove);
    });

    document.addEventListener('touchend', () => {
      document.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('touchmove', mouseMove);
    });
  }

  useEffect(() => {
    setTaxRevenue(calculateTaxRevenue(rates));
  }, [rates]);

  return (
    <div className="block md:flex md:h-full overflow-hidden justify-around">
      <div className="w-full md:w-1/2 2xl:w-1/2 md:max-h-[calc(100vh-200px)] flex flex-col min-content">
        <ResultWidget revenue={taxRevenue} baseline={baselineRevenue} />
        <div className="h-[60vh] md:h-auto md:flex-1 flex-col">
          <ResponsiveContainer height="100%">
            <ComposedChart data={rates.income.single}>
              <Legend
                verticalAlign="top"
              />
              <YAxis
                yAxisId='left'
                domain={[0,1]}
                tickFormatter={(value) => `${value * 100}%`}
              >
                <Label
                  orientation="left"
                  value="Tax Rate"
                  position="insideLeft"
                  angle={270}
                  fill={colors.white}
                />
              </YAxis>
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 3000000000000]}
                tickFormatter={(value) => formatBigMoney(value)}
              >
                <Label
                  value="Total Revenue"
                  position="insideRight"
                  angle={90}
                  fill={colors.white}
                />
              </YAxis>
              <XAxis
                dataKey="min"
                tickFormatter={(value: number) => `> ${formatBigMoney(value)}`}
              >
                <Label
                  value="Income"
                  position="bottom"
                  fill={colors.white}
                />
              </XAxis>
              <Tooltip
                formatter={(value: number, label: 'revenue' | 'rate') => formatters[label](value)}
                labelStyle={ { color: colors.black } }
                labelFormatter={(value: number) => `taxable income above ${formatBigMoney(value)}`}
              />
              <Area
                type="natural"
                yAxisId="right"
                name="revenue"
                strokeWidth={3}
                dataKey={(data) => calculateTaxRevenue(rates, data.max)}
                stroke={colors.emerald[600]}
                fill={colors.emerald[700]}
                fillOpacity={0.4}
                connectNulls={true}

              />
              <Bar
                dataKey="rate"
                yAxisId="left"
                stroke={colors.emerald[800]}
                fill={colors.emerald[500]}
                fillOpacity={0.9}
                onMouseDown={handleBarDrag}
                onTouchStart={handleBarDrag}
                className="cursor-ns-resize"
              >
                <LabelList
                  dataKey="rate"
                  position="top"
                  fill={colors.white}
                  formatter={(value: number) => formatters.rate(value)}
                />
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between mx-auto w-3/4">
          {rates.income.single.map((rate, index) => (
            <RateChangeWidget
              key={rate.max}
              adjust={((amount: number) => adjust(index, amount))}
            />
          ))}
        </div>
      </div>
      <div>
        <Examples scheme={rates} />
      </div>
    </div>
  );
}

function RateChangeWidget({ adjust }: { adjust: Function }) {
  return (
    <div className="rounded-md bg-emerald-600 inline-block overflow-hidden mb-2">
      <button className="block border-b border-emerald-700 hover:bg-emerald-500 px-1" onClick={() => adjust(0.01)}>
        <i className="fas fa-chevron-up" />
      </button>
      <button className="block hover:bg-emerald-500 px-1" onClick={() => adjust(-0.01)}>
        <i className="fas fa-chevron-down" />
      </button>
    </div>
  );
}

function ResultWidget({ revenue, baseline } : { revenue: number, baseline: number }) {
  const change = (revenue - baseline) / baseline;
  return (
    <div className="bg-indigo-600 rounded-lg px-5 py-2 mt-5 flex w-64 mx-auto items-center justify-around">
      <div className="text-2xl md:text-4xl">
        <div className="font-bold text-4xl">{formatBigMoney(revenue)}</div>
        <div className="uppercase text-sm text-indigo-300">Total Revenue</div>
      </div>
      <div className="text-2xl text-indigo-300">
        {change > 0 && '+'}
        {formatPercent(change)}
      </div>
    </div>
  );
}