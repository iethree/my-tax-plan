// pages/_document.js

import { Html, Head, Main, NextScript } from 'next/document'
import MenuBar from '@/components/MenuBar';

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="description" content="Revamp the federal tax system in minutes" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,700,800&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>
      <body>
        <MenuBar />
        <Main />
        <NextScript />
        <footer className="text-center text-gray-200">
        </footer>
      </body>
    </Html>
  )
}