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
      <div className="p-3 mx-auto text-center w-full lg:max-h-[calc(100vh-100px)] overflow-hidden flex flex-col relative">
        {!!plans?.length && (
          <div className="flex flex-col sm:flex-row justify-center items-center mb-2">
            <div className="mx-2 w-3/4 sm:w-48">
              <PlanSelect />
            </div>
            <div className="flex">
              <button
                title="advanced options"
                className="button yellow small m-1"
                onClick={() => setShowOptions((v) => !v)}
              >
                <i className="fas fa-wrench" />
              </button>
              {currentPlan.created_at && (
                <CopyButton
                  content={`Check out my tax plan: ${currentPlan.title}\n${
                    window.location.origin
                  }/view/${encode(currentPlan.id)}`}
                  className="button small green m-1"
                  icon="share-alt"
                  title="Share Plan"
                />
              )}
              <PlanActions />
            </div>
          </div>
        )}

        <div className="block lg:flex overflow-hidden justify-around min-content">
          {showOptions && (
            <AdvancedBuilder close={() => setShowOptions(false)} />
          )}
          <div className="flex flex-col w-full lg:w-1/2 2xl:w-1/2 ">
            <RateChart rates={currentPlan?.scheme} setRates={setRates} />
          </div>
          <Examples scheme={currentPlan?.scheme} />
        </div>
      </div>
    </div>
  );
};

export default Builder;
