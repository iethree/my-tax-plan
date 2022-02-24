import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import RateChart from '@/components/RateChart';
import Examples from '@/components/Examples';
import AdvancedBuilder from '@/components/AdvancedBuilder';

const Builder: NextPage = () => {
  const [view, setView] = useState('simple');

  return (
    <div className="flex flex-col justify-around mx-auto">
      <Head>
        <title>My Tax Plan | Builder</title>
      </Head>
      <div className="p-3 mx-auto text-center w-full md:max-h-[calc(100vh-100px)] overflow-hidden flex flex-col relative">
        <div className="absolute top-0 left-0 p-5">
          <button
            title="advanced options"
            className="button yellow small"
            onClick={() => setView(v => v === 'simple' ? 'advanced' : 'simple')}
          >
            <i className="fas fa-brain" />
          </button>
        </div>
        <h2 className="text-yellow-500 flex items-center justify-center">
          Builder
          <span className="badge indigo ml-5">
            <i className="fas fa-wrench mr-2" />
            work in progress
          </span>
        </h2>
        <div className="block md:flex overflow-hidden justify-around min-content">
          {view === 'advanced' && <AdvancedBuilder close={() => setView('simple')}/>}
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
