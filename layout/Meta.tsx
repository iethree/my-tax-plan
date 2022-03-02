import { NextSeo } from "next-seo";
import Head from "next/head";
import { useRouter } from "next/router";

type MetaProps = {
  title: string;
  description?: string;
  canonical?: string;
};

const Meta = (props: MetaProps) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <meta charSet="UTF-8" key="charset" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
          key="viewport"
        />
        <link
          rel="apple-touch-icon"
          href={`${router.basePath}/apple-touch-icon.png`}
          key="apple"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${router.basePath}/favicon-32x32.png`}
          key="icon32"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${router.basePath}/favicon-16x16.png`}
          key="icon16"
        />
        <link
          rel="icon"
          href={`${router.basePath}/favicon.ico`}
          key="favicon"
        />
        <NextSeo
          title={"My Tax Plan | " + props.title}
          description={
            props.description || "Revamp the federal tax system in minutes"
          }
          canonical={props.canonical}
          openGraph={{
            type: "website",
            title: props.title,
            description: props.description,
            url: props.canonical || "https://www.mytaxplan.app",
            locale: "US",
            site_name: "My Tax Plan",
          }}
        />
      </Head>
    </>
  );
};

export default Meta;
