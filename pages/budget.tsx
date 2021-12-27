import type { NextPage } from 'next';
import Head from 'next/head';
import { PieChart, Pie, Cell} from 'recharts';
import spending from '@/data/spending.json';
import colors from 'tailwindcss/colors';

const Budget: NextPage = () => {
  return (
    <div className="flex flex-col justify-around">
      <Head>
        <title>My Tax Plan | Budget</title>
      </Head>
      <main className="p-3 max-w-xl mx-auto text-center">
        <h2 className="text-yellow-500">Budget</h2>
        <p>
          If you find yourself wondering what all this tax money goes to fund, you can see a high-level overview here:
        </p>
        <BudgetPie data={spending} />
        <p>
          Source: <a href="https://datalab.usaspending.gov/americas-finance-guide/spending/categories/">USASpending.gov</a>
        </p>
      </main>
    </div>
  );
}


function BudgetPie({ data }: { data: Array<object> }) {
  const graphColors = [
    colors.blue[500],
    colors.green[500],
    colors.yellow[500],
    colors.orange[500],
    colors.red[500],
    colors.cyan[500],
    colors.purple[500],
    colors.pink[500],
  ];

  return (
    <PieChart height={400} width={1000}>
      <Pie
        data={data}
        dataKey="federal_spending"
        nameKey="parent"
        cx={200}
        cy={200}
        outerRadius={80}
        label={({ percent, name }) => `${name} - ${Math.round(percent * 100)}%`}
      >
        {
          data.map((entry, index) => (
            <Cell key={index} fill={graphColors[index] || colors.indigo[500]} />
          ))
        }
      </Pie>
    </PieChart>
  );
}
export default Budget
