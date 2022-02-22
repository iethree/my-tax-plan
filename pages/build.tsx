import type { NextPage } from 'next';
import Head from 'next/head';
import RateChart from '@/components/RateChart';
import Examples from '@/components/Examples';

const Builder: NextPage = () => {
  return (
    <div className="flex flex-col justify-around mx-auto">
      <Head>
        <title>My Tax Plan | Builder</title>
      </Head>
      <div className="p-3 mx-auto text-center inline-block w-full md:max-h-[calc(100vh-100px)] overflow-hidden flex flex-col">
        <h2 className="text-yellow-500 flex items-center justify-center">
          Builder
          <span className="badge indigo ml-5">
            <i className="fas fa-wrench mr-2" />
            work in progress
          </span>
        </h2>
        <div className="block md:flex overflow-hidden justify-around min-content">
          <div className="flex flex-col w-full md:w-1/2 2xl:w-1/2 ">
            <RateChart />
          </div>
          <Examples />
        </div>
      </div>
    </div>
  );
}

export default Builder
