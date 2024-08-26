import Header from "@/pages/component/Header";
import Head from "next/head";
import Body_absensi from "./component/body_absensi";

export default function Absensi() {
  return (
    <>
      <Head>
        <title>Absensi Logs</title>
        <meta name="description" content="Berisi log absensi yang sudah diisi" />
      </Head>
      <Header />
      <Body_absensi/>
    </>
  );
}
