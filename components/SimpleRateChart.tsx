import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Area,
  Tooltip,
} from "recharts";
import { TaxScheme } from "@/types/taxTypes";
import colors from "tailwindcss/colors";
import { calculateTaxRevenue } from "@/utils/taxCalc";
import { formatBigMoney, formatPercent } from "@/utils/formatters";

const formatters = {
  revenue: formatBigMoney,
  rate: formatPercent,
};

export default function BracketChart({ rates }: { rates: TaxScheme }) {
  if (!rates) {
    return null;
  }

  return (
    <ResponsiveContainer height="100%">
      <ComposedChart data={rates.income.single}>
        <YAxis yAxisId="right" orientation="right" hide />
        <XAxis
          dataKey="min"
          tickFormatter={(value: number) => `> ${formatBigMoney(value)}`}
          hide
        />
        <Area
          type="natural"
          yAxisId="right"
          stackId="revenue"
          name="payroll taxes"
          strokeWidth={3}
          dataKey={(data) => calculateTaxRevenue(rates, data.max).payrollTax}
          stroke={colors.yellow[600]}
          fill={colors.yellow[700]}
          fillOpacity={0.4}
          connectNulls={true}
        />
        <Area
          type="natural"
          yAxisId="right"
          stackId="revenue"
          name="income taxes"
          strokeWidth={3}
          dataKey={(data) => calculateTaxRevenue(rates, data.max).incomeTax}
          stroke={colors.emerald[600]}
          fill={colors.emerald[700]}
          fillOpacity={0.4}
          connectNulls={true}
        />
        <Area
          type="natural"
          yAxisId="right"
          stackId="revenue"
          name="capital gains taxes"
          strokeWidth={3}
          dataKey={(data) => calculateTaxRevenue(rates, data.max).gainsTax}
          stroke={colors.red[600]}
          fill={colors.red[700]}
          fillOpacity={0.4}
          connectNulls={true}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
