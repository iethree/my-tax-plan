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
        <h2 className="text-yellow-500 flex items-center justify-center">
          Builder
          <span className="badge indigo ml-5">
            <i className="fas fa-wrench mr-2" />
            work in progress
          </span>
        </h2>
        <RateChart />
      </main>
    </div>
  );
}

export default Builder
