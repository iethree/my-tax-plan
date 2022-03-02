import { useState } from "react";
import type { NextPage } from "next";

import useStore from "@/utils/useStore";

import PlanSelect from "@/components/PlanSelect";
import PlanActions from "@/components/PlanActions";
import Head from "next/head";
import RateChart from "@/components/RateChart";
import Examples from "@/components/Examples";
import AdvancedBuilder from "@/components/AdvancedBuilder";
import CopyButton from "@/components/CopyButton";
import { encode } from "@/utils/hash";

const Builder: NextPage = () => {
  const [showOptions, setShowOptions] = useState(false);
  const plans = useStore((state) => state.plans);
  const currentPlan = useStore((state) => state.currentPlan());
  const setRates = useStore((state) => state.setRates);

  return (
    <div className="flex flex-col justify-around mx-auto">
      <Head>
        <title>My Tax Plan | Builder</title>
      </Head>
      <div className="p-3 mx-auto text-center w-full md:max-h-[calc(100vh-100px)] overflow-hidden flex flex-col relative">
        {!!plans?.length && (
          <div className="absolute top-0 right-0 lg:left-0 p-5 md:flex">
            <div className="flex">
              <button
                title="advanced options"
                className="button yellow small"
                onClick={() => setShowOptions((v) => !v)}
              >
                <i className="fas fa-wrench" />
              </button>
              {currentPlan.created_at && (
                <CopyButton
                  content={`Check out my tax Plan: ${currentPlan.title}\n${
                    window.location.origin
                  }/view/${encode(currentPlan.id)}`}
                  className="button small mx-2"
                  icon="share-alt"
                  title="Share Plan"
                />
              )}
              <div className="mx-2 md:w-48">
                <PlanSelect />
              </div>
            </div>
            <div className="ml-2">
              <PlanActions />
            </div>
          </div>
        )}
        <h2 className="text-yellow-500 text-left lg:text-center mb-10 md:mb-2">
          Builder
        </h2>
        <div className="block md:flex overflow-hidden justify-around min-content">
          {showOptions && (
            <AdvancedBuilder close={() => setShowOptions(false)} />
          )}
          <div className="flex flex-col w-full md:w-1/2 2xl:w-1/2 ">
            <RateChart rates={currentPlan?.scheme} setRates={setRates} />
          </div>
          <Examples />
        </div>
      </div>
    </div>
  );
};

export default Builder;
