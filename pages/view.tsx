import type { NextPage } from "next";

import useStore from "@/utils/useStore";
import Head from "next/head";
import RateChart from "@/components/RateChart";
import Examples from "@/components/Examples";

const Builder: NextPage = () => {
  const currentPlan = useStore((state) => state.currentPlan());

  return (
    <div className="flex flex-col justify-around mx-auto">
      <Head>
        <title>My Tax Plan | View</title>
      </Head>
      <div className="p-3 mx-auto text-center w-full md:max-h-[calc(100vh-100px)] overflow-hidden flex flex-col relative">
        <h2 className="text-yellow-500 text-left lg:text-center mb-10 md:mb-2">
          {currentPlan.title}
        </h2>
        <div className="block md:flex overflow-hidden justify-around min-content">
          <div className="flex flex-col w-full md:w-1/2 2xl:w-1/2 ">
            <RateChart rates={currentPlan?.scheme} />
          </div>
          <Examples />
        </div>
      </div>
    </div>
  );
};

export default Builder;
