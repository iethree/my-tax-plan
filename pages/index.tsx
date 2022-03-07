import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import SimpleRateChart from "@/components/SimpleRateChart";
import { newPlan } from "@/constants/taxPlans";

const defaultPlan = newPlan();

const Home: NextPage = () => {
  return (
    <div className="h-[calc(100vh-120px)]">
      <Head>
        <title>My Tax Plan | Home</title>
      </Head>
      <main className="flex flex-col lg:flex-row items-center justify-center p-3 max-w-4xl mx-auto pb-10 h-full">
        <div>
          <h1 className="mb-0">
            My Tax Plan
            <span className="badge indigo ml-5">
              <i className="fas fa-wrench mr-2" />
              work in progress
            </span>
          </h1>

          <h5 className="text-yellow-500">
            Revamp the federal tax system in minutes
          </h5>
          <div className="mt-10 hidden lg:block">
            <Link href="/about">but why?</Link>
          </div>
        </div>
        <div className="lg:ml-20 text-center">
          <div className="w-64 h-32">
            <SimpleRateChart rates={defaultPlan.scheme} />
          </div>
          <button className="button large yellow no-underline my-10">
            <Link href="/build">
              <a className="no-underline hover:text-gray-900">
                Build Your Tax Plan
              </a>
            </Link>
          </button>

          <div className="mt-10  text-center lg:hidden">
            <Link href="/about">but why?</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
