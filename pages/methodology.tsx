import type { NextPage } from "next";
import Head from "next/head";
import links from "@/constants/links";

import Link from "next/link";

const Methodology: NextPage = () => {
  return (
    <div className="flex flex-col justify-around mt-10">
      <Head>
        <title>My Tax Plan | Resources</title>
      </Head>
      <main className="p-3 max-w-xl mx-auto">
        <h2 className="text-yellow-500">Methodology</h2>
        <p>
          Think of this tax plan creator as a back-of-the-napkin sort of
          calculation. It's a great place to start, but there are much more
          precise methods for calculating the complex effects of changes to the
          tax code.
        </p>
        <p>
          The way the IRS and the Congressional budget office actually simulate
          tax code changes is by using a{" "}
          <a href="https://www.urban.org/research/data-methods/data-analysis/quantitative-data-analysis/microsimulation">
            microsimulation
          </a>{" "}
          of the effects of any changes. This means they actually calculate
          taxes for approximately 144,000 representative taxpayers, and use that
          specific data to extrapolate the effects on the whole tax base.
        </p>
        <p>
          In the future, I would love to update this calculator to run on-demand
          microsimulations, but for the time being, this simulation is based on
          broader generalizations of the tax base.
        </p>
        <p>
          If you would like to learn more about microsimulating the tax code,
          and check out projects doing much more detailed analysis: check out
          these resources:
          <ul className="ml-3">
            {links.map(({ title, url }) => (
              <Resource key={title} title={title} url={url} />
            ))}
          </ul>
        </p>
        <div className="text-center mt-10">
          <Link href="/">
            <a>home</a>
          </Link>
        </div>
      </main>
    </div>
  );
};

const Resource = ({ title, url }: { title: string; url: string }) => {
  return (
    <li className="my-2">
      <a
        href={url}
        className="no-underline text-yellow-500 hover:text-yellow-600"
      >
        {title}
      </a>
    </li>
  );
};

export default Methodology;
