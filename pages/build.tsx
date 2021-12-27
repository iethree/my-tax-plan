import type { NextPage } from 'next'
import Head from 'next/head'

const Builder: NextPage = () => {
  return (
    <div className="flex flex-col justify-around mt-10">
      <Head>
        <title>My Tax Plan | Builder</title>
      </Head>
      <main className="p-3 max-w-xl mx-auto text-center">
        <h2 className="text-yellow-500">Builder</h2>
        <div className="badge indigo inline-block mt-20">coming soon</div>
      </main>
    </div>
  );
}

export default Builder
