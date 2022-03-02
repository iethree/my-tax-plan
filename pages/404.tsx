import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className="h-screen flex flex-col justify-around">
      <Head>
        <title>My Tax Plan | Not Found</title>
      </Head>
      <main className="p-3 max-w-4xl mx-auto pb-40">
        <div className="flex items-center">
          <div className="border-r pr-5 mr-5 py-3 text-xl text-yellow-500">
            Not Found
          </div>
          <div>
            <Link href="/">Home</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
