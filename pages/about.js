import { useEffect, useState } from "react";
import Header from "@/pages/component/Header";
import { useRouter } from 'next/navigation';
import Head from "next/head";

export default function About() {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchInfo = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/"); // Redirect ke halaman login jika token tidak ada
        return;
      }

      // Tambahkan logika untuk mendapatkan informasi jika token ada
      // Contoh: fetch data dari API
    };

    fetchInfo();
  }, [router]);

  return (
    <>
      <Head>
        <title>Tentang Saya</title>
        <meta name="description" content="Creator Website" />
      </Head>
      <Header />
      <p>Ini About</p>
    </>
  );
}
