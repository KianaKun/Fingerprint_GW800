import Header from "@/pages/component/Header";
import Head from "next/head";
import Body_about from "./component/body_about";

export default function About() {
  return (
    <>
      <Head>
        <title>Tentang Saya</title>
        <meta name="description" content="Creator Website" />
      </Head>
      <Header />
      <Body_about/>
    </>
  );
}
