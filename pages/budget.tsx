import type { NextPage } from "next";
import Head from "next/head";
import revenue from "@/data/revenue.json";
import spending from "@/data/spending.json";

import MoneyPie from "@/components/MoneyPie";

const Spending: NextPage = () => {
  return (
    <div className="flex flex-col justify-around">
      <div>
        <Head>
          <title>My Tax Plan | Federal budget</title>
        </Head>
        <div className="p-3 mx-auto text-center max-w-4xl">
          <div className="text-left max-w-lg mx-auto">
            The current federal budget is the starting point for this project.
            Just like in any budget, the long-term goal is to take in at least
            as much money as you spend.
          </div>
          <div className="block md:flex items-center md:text-left">
            <div>
              <h2 className="text-yellow-500">Federal Spending</h2>
              <h6 className="-mt-3">Why collect all this tax money?</h6>
            </div>
            <MoneyPie data={spending} />
          </div>
          <div className="block md:flex items-center md:text-left">
            <div>
              <h2 className="text-yellow-500">Federal Revenue</h2>
              <h6 className="-mt-3">How does the government get its money?</h6>
            </div>
            <MoneyPie data={revenue} />
          </div>
          <div className="text-left max-w-lg mx-auto">
            <p>
              In many ways, 2020 and 2021 have been outliers for the federal
              budget due to the enormous amount of economic stimulus paid to
              companies and invididuals.
            </p>
            <p>
              The White house{" "}
              <a href="https://www.whitehouse.gov/wp-content/uploads/2021/05/budget_fy22.pdf">
                estimates
              </a>{" "}
              that in 2022, federal expenditures will total{" "}
              <span className="text-yellow-500">$5.7 Trillion</span>, and
              receipts will total{" "}
              <span className="text-yellow-500">$4 Trillion</span>. Leaving a
              deficit of <span className="text-yellow-500">$1.7 Trillion</span>{" "}
              for 2022. As the country's economic recovery continues, the
              deficit is projected to decrease to a mere{" "}
              <span className="text-yellow-500">$1 Trillion</span> by 2024.
            </p>
            <p>
              While{" "}
              <a href="https://www.brookings.edu/policy2020/votervital/how-worried-should-you-be-about-the-federal-deficit-and-debt/">
                economists
              </a>{" "}
              and{" "}
              <a href="https://www.foxbusiness.com/economy/us-federal-budget-deficit-2-8t-second-largest">
                politicians
              </a>{" "}
              disagree widely on when and why the government should finance
              itself with debt, everyone agrees that a government cannot remain
              financially stable while continuing to run deficits indefinitely.
            </p>
          </div>
          <div>
            Sources:
            <a
              href="https://datalab.usaspending.gov/americas-finance-guide/revenue/categories/"
              className="mx-3"
            >
              Revenue
            </a>
            <a href="https://datalab.usaspending.gov/americas-finance-guide/spending/categories/">
              Spending
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Spending;
