import { useEffect, useState } from "react";
import Header from "@/pages/component/Header";
import { useRouter } from 'next/navigation';
import Head from "next/head";

export default function Absensi() {
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
        <title>Absensi Logs</title>
        <meta name="description" content="Berisi log absensi yang sudah diisi" />
      </Head>
      <Header />
      <p>Ini Absensi</p>
    </>
  );
}
