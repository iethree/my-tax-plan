import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import colors from "tailwindcss/colors";

export default function MoneyPie({ data }: { data: Array<object> }) {
  const graphColors = [
    colors.red[500],
    colors.orange[500],
    colors.yellow[500],
    colors.lime[500],
    colors.green[500],
    colors.teal[500],
    colors.cyan[500],
    colors.sky[500],
    colors.blue[500],
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart className="mx-auto">
        <text x="50%" y="50%" textAnchor="middle" fill="#fff" dy=".5em">
          $
          {Math.round(
            data.reduce((acc: number, cur: any) => acc + cur?.value, 0) /
              100000000000
          ) / 10}{" "}
          Trillion
        </text>
        <Pie
          data={data}
          dataKey="value"
          paddingAngle={5}
          innerRadius={60}
          nameKey="parent_plain"
          outerRadius={80}
          label={({ percent, name }) =>
            `${
              name.length > 24 ? name.slice(0, 24) + "..." : name
            } - ${Math.round(percent * 100)}%`
          }
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={graphColors[index] || colors.gray[500]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload, label }) => (
            <PieTooltip active={active} payload={payload} label={label} />
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function PieTooltip({
  active,
  payload,
  label,
}: {
  active: boolean | undefined;
  payload: any;
  label: string;
}) {
  const amount: number = Math.round((payload?.[0]?.value || 0) / 1000000000);
  const name: string = payload?.[0]?.name || "";

  return (
    <span className="bg-white bg-opacity-75 text-black p-2 rounded-lg">
      {name} - ${active ? amount : label} B
    </span>
  );
}
