import Header from "@/pages/component/Header";
import Head from "next/head";
import Body_user from "./component/body_user";

export default function User() {


  return (
    <>
      <Head>
        <title>User Terdaftar</title>
        <meta name="description" content="Berisi User yang terdaftar di mesin fingerprint" />
      </Head>
      <Header />
      <Body_user/>
    </>
  );
}
