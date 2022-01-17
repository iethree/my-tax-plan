import { useState, useEffect } from 'react';
import {
  ResponsiveContainer, ComposedChart, XAxis, YAxis, Area,
  Tooltip, LabelList, Label, Line, Bar, Legend,
 } from 'recharts';
import colors from 'tailwindcss/colors';
import { TaxScheme } from '@/types/taxTypes';
import { calculateTaxRevenue } from '@/utils/taxCalc';

import defaultRates from '../data/rates.json';

const baselineRevenue = calculateTaxRevenue(defaultRates);

import { formatBigMoney, formatPercent } from '@/utils/formatters';

const formatters = {
  revenue: formatBigMoney,
  rate: formatPercent,
};

export default function BracketChart() {
  const [rates, setRates]: [TaxScheme, Function] = useState(defaultRates);
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

      if (startYPos === null) {
        startYPos = mouseEvent.clientY;
        return;
      }
      const moveDistance = startYPos - mouseEvent.clientY;
      const moveAmount = Math.round(moveDistance / 2) * .01;

      adjust(rateIndex, moveAmount);

      startYPos = mouseEvent.clientY;
    }

    document.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', mouseMove);
    });
  }

  useEffect(() => {
    setTaxRevenue(calculateTaxRevenue(rates));
  }, [rates]);

  return (
    <>
      <ComposedChart data={rates.income.single} width={600}  height={400}>
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
          dataKey="max"
          tickFormatter={(value: number) => `< ${formatBigMoney(value)}`}
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
          labelFormatter={(value: number) => `income below ${formatBigMoney(value)}`}
        />
        <Area
          type="natural"
          yAxisId="right"
          name="revenue"
          strokeWidth={3}
          dataKey={(data) => calculateTaxRevenue(rates, data.max)}
          stroke={colors.green[600]}
          fill={colors.green[500]}
          fillOpacity={0.2}
          connectNulls={true}

        />
        <Bar
          dataKey="rate"
          yAxisId="left"
          fill={colors.blue[400]}
          onMouseDown={handleBarDrag}
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
      <div className="flex justify-between mx-20">
        {rates.income.single.map((rate, index) => (
          <RateChangeWidget
            key={rate.max}
            adjust={((amount: number) => adjust(index, amount))}
          />
        ))}
      </div>
      <ResultWidget revenue={taxRevenue} baseline={baselineRevenue} />
    </>
  );
}

function RateChangeWidget({ adjust }: { adjust: Function }) {


  return (
    <div className="rounded-md bg-indigo-700 inline-block overflow-hidden mb-2">
      <button className="block border-b border-indigo-500 hover:bg-indigo-600 px-1" onClick={() => adjust(0.01)}>
        <i className="fas fa-chevron-up" />
      </button>
      <button className="block hover:bg-indigo-600 px-1" onClick={() => adjust(-0.01)}>
        <i className="fas fa-chevron-down" />
      </button>
    </div>
  );
}

function ResultWidget({ revenue, baseline } : { revenue: number, baseline: number }) {
  const change = (revenue - baseline) / baseline;
  return (
    <div className="bg-green-600 rounded-lg bg-opacity-50 inline-block px-5 py-2">
      <div className="text-4xl">
        Total Revenue: <strong>{formatBigMoney(revenue)}</strong>
      </div>
      <div className="flex justify-around">
        <div>
          Goal Revenue: <strong>$3T</strong>
        </div>
        <div>
          Change: <strong>
            {change > 0 && '+'}
            {formatPercent(change)}
          </strong>
        </div>
      </div>
    </div>
  );
}