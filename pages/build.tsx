import type { NextPage } from 'next';
import Head from 'next/head';
import RateChart from '@/components/RateChart';

const Builder: NextPage = () => {
  return (
    <div className="flex flex-col justify-around">
      <Head>
        <title>My Tax Plan | Builder</title>
      </Head>
      <main className="p-3 mx-auto text-center block">
        <h2 className="text-yellow-500">Builder</h2>
        <RateChart />
      </main>
    </div>
  );
}

export default Builder
