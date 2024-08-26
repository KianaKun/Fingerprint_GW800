import Header from "@/pages/component/Header";
import Head from "next/head";
import Body_mesin from "./component/body_mesin";

export default function InfoMesin() {
  return (
    <>
      <Head>
        <title>Informasi Mesin</title>
        <meta name="description" content="Informasi Tentang Mesin Dan Firmware" />
      </Head>
      <Header />
      <Body_mesin/>
    </>
  );
}
