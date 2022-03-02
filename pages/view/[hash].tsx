import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";

import Head from "next/head";
import RateChart from "@/components/RateChart";
import Examples from "@/components/Examples";
import { supabase } from "@/utils/api";
import { TaxPlan } from "@/types/taxTypes";
import { decode } from "@/utils/hash";
import Spinner from "@/components/Spinner";
import Meta from "@/layout/Meta";

import type { AlertMessage } from "@/types/appTypes";
import Alert from "@/components/Alert";

const Viewer: NextPage = () => {
  const [plan, setPlan] = useState<TaxPlan | null>(null);
  const [message, setMessage] = useState<AlertMessage | null>(null);
  const router = useRouter();
  const { hash } = router.query;

  useEffect(() => {
    setMessage(null);
    const id = decode(hash as string);
    if (!id) {
      setMessage({
        level: "error",
        text: "Invalid Plan Url",
      });
      return;
    }
    supabase
      .from("tax_plans")
      .select()
      .eq("id", id)
      .then((res) => {
        if (!res.error && res?.data?.length) {
          setPlan(res.data[0]);
        } else {
          setMessage({
            level: "error",
            text: "Invalid Plan Data",
          });
        }
      });
  }, [hash]);

  if (message || !plan) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        {message && <Alert level={message.level}>{message.text}</Alert>}
        {!message && <Spinner className="h-20 w-20" />}
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-around mx-auto">
      <Head>
        <title>My Tax Plan | {plan.title}</title>
        <Meta title={plan.title || ""} description={plan.description || ""} />
      </Head>
      <div className="p-3 mx-auto text-center w-full md:max-h-[calc(100vh-100px)] overflow-hidden flex flex-col relative">
        <h2 className="text-yellow-500 text-center">{plan.title}</h2>
        <div className="block md:flex overflow-hidden justify-around min-content">
          <div className="flex flex-col w-full md:w-1/2 2xl:w-1/2 ">
            <RateChart rates={plan.scheme} />
          </div>
          <Examples scheme={plan.scheme} />
        </div>
      </div>
    </div>
  );
};

export default Viewer;
