import Head from "next/head";
import Body_index from "./component/body_index";

export default function Login() {
  return (
    <>
      <Head>
        <title>Please Login</title>
        <meta name="description" content="Silahkan Login Terlebih Dahulu" />
      </Head>
      <Body_index/>
    </>
  );
}