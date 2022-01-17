import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div className="h-screen flex flex-col justify-around">
      <Head>
        <title>My Tax Plan | Home</title>
      </Head>
      <main className="p-3 max-w-4xl mx-auto pb-40">

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
        <p>
          <Link href="/about">but why?</Link>
        </p>
      </main>
    </div>
  )
}

export default Home
