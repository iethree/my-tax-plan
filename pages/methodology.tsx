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
          Everyone agrees that our tax code is too complex. Few agree on how it
          should be simplified. It's the product of many years of political and
          bureaucratic processes, and as such, it is full of handouts to special
          interests, loopholes, and inconsistencies that make the whole thing
          difficult to understand and even more difficult to fix. Simplifying or
          fundamentally changing how we tax individuals is a very worthwhile
          project, but beyond the scope of this web application (for now).
        </p>
        <p>
          Think of this tax plan creator as a back-of-the-napkin sort of
          calculation. It's a great place to start thinking about who and how
          much we tax, but there are much more precise methods for calculating
          the complex effects of changes to the tax code, and many more things
          that could (and should) be done to the tax code besides changing tax
          rates.
        </p>
        <p>
          For example: to calculate the tax burden on the average taxpayer who
          earns $20,000 per year, we don't calculate specific deductions or
          credits, we simply calculate the average amount of credits and
          deductions for that income level, and calculate taxes from there. One
          should not understand this calculator to say that under such-and-such
          a tax plan, a taxpayer will certainly owe X. Rather, on the whole,
          taxpayers with a certain income will pay an average of X.
        </p>
        <p>
          The way the IRS and the Congressional budget office actually simulate
          tax code changes is by using a{" "}
          <a href="https://www.urban.org/research/data-methods/data-analysis/quantitative-data-analysis/microsimulation">
            microsimulation
          </a>{" "}
          of the effects of any changes. This means they actually calculate
          taxes for approximately 144,000 representative taxpayers, and use that
          specific data to extrapolate the effects on the whole tax base. This
          gives a far more accurate picture of both individual effects as well
          as aggregate effects on the entire tax base.
        </p>
        <p>
          In the future, I would love to update this calculator to run on-demand
          microsimulations, but for the time being, this simulation is based on
          broader generalizations of the tax base synthesized from the IRS's{" "}
          <a href="https://www.irs.gov/statistics/soi-tax-stats-individual-income-tax-returns-complete-report-publication-1304">
            Statistics of Individual Income.
          </a>
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
