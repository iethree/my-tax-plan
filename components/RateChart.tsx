import { useEffect } from 'react';
import {
  ResponsiveContainer, ComposedChart, XAxis, YAxis, Area,
  Tooltip, LabelList, Label, Bar, Legend,
} from 'recharts';
import colors from 'tailwindcss/colors';
import { calculateTaxRevenue } from '@/utils/taxCalc';
import useStore from '../utils/useStore';
import { formatBigMoney, formatPercent } from '@/utils/formatters';
import ResultWidget from './ResultWidget';
import { newPlan } from '@/constants/taxPlans';

const formatters = {
  revenue: formatBigMoney,
  rate: formatPercent,
};

export default function BracketChart() {
  const {
    setRates,
    setTaxRevenue,
    currentPlan,
  } = useStore();

  const rates = currentPlan()?.scheme;

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
      mouseEvent.preventDefault();
      const currentPos = mouseEvent.clientY || mouseEvent.touches[0].clientY;
      if (startYPos === null) {
        startYPos = currentPos;
        return;
      }
      const moveDistance = startYPos - currentPos;
      const moveAmount = Math.round(moveDistance / 3) * .01;

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
    rates && setTaxRevenue(calculateTaxRevenue(rates));
  }, [rates, setTaxRevenue]);

  if (!rates) {
    // TODO empty state
    return <EmptyRateChart />;
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="h-[70vh] md:h-auto md:flex-1 touch-none relative">
        <div className="absolute top-0 left-0 mt-10 ml-5">
          <ResultWidget />
        </div>
        <ResponsiveContainer height="100%">
          <ComposedChart data={rates.income.single}>
            <Legend
              verticalAlign="top"
            />
            <YAxis
              yAxisId='left'
              domain={[0,1]}
              hide
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 2500000000000]}
              hide
            />
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
            >
              <LabelList
                position="top"
                fill={colors.green[300]}
                z={90000}
                formatter={(value: number) => formatBigMoney(value)}
              />
            </Area>
            <Bar
              dataKey="rate"
              yAxisId="left"
              stroke={colors.emerald[800]}
              fill={colors.emerald[500]}
              fillOpacity={0.9}
              onMouseDown={handleBarDrag}
              onTouchStart={handleBarDrag}
              className="cursor-ns-resize touch-none"
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
      <div className="flex justify-around mx-auto w-full">
        {rates.income.single.map((rate, index) => (
          <RateChangeWidget
            key={rate.max}
            adjust={((amount: number) => adjust(index, amount))}
          />
        ))}
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

function EmptyRateChart() {
  const plans = useStore((store) => store.plans);
  const setPlans = useStore(state => state.setPlans);

  const addPlan = () => {
    setPlans([...plans, newPlan()]);
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col justify-center pb-40">
      <div>
        Get started by creating a new tax plan
      </div>
      <button className="button green mt-10" onClick={addPlan}>
        <i className="fas fa-chart-column mr-2" />
        Create a Tax Plan
      </button>
    </div>
  );
}

