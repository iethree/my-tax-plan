/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';

const Why: NextPage = () => {
  return (
    <div className="flex flex-col justify-around">
      <Head>
        <title>My Tax Plan | Why?</title>
      </Head>
      <main className="p-3 max-w-lg mx-auto">
        <div className="my-5 rounded-lg overflow-none">
          <img
            src="https://media.giphy.com/media/s239QJIh56sRW/giphy.gif"
            className="rounded-lg"
            alt="but why?"
          />
        </div>

        <p className="text-left">
          Because taxes are one of the most important ways ordinary people interact with their government every single day. This project seeks to demistify talk about federal taxation, and let people try their hand at doing a better job than the politicians. You can learn more about the details (and limitations) of this project <Link href="/methodology">here</Link>.
        </p>
        <div className="text-center mt-10">
          <Link href="/">home</Link>
        </div>
      </main>
    </div>
  )
}

export default Why
