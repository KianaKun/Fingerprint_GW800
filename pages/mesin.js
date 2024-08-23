import { useEffect, useState } from "react";
import Header from "@/pages/component/Header";
import axios from "axios";
import { useRouter } from 'next/navigation';
import Head from "next/head";

export default function Dashboard() {
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

      try {
        const ip = localStorage.getItem("machineIp");
        const port = localStorage.getItem("machinePort");

        if (ip && port) {
          const response = await axios.post("/api/mesin", { ip, port });

          // Format data yang diterima
          const cleanString = (str) => str.replace(/[^\x20-\x7E]/g, '').trim();

          const formattedInfo = {
            time: new Date(response.data.time).toLocaleString('id-ID', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
            serialNumber: cleanString(response.data.serialNumber.replace(/=+$/, '')),
            firmwareVersion: cleanString(response.data.firmwareVersion),
          };

          setInfo(formattedInfo);
        } else {
          setError("No machine configuration found. Please login again.");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchInfo();
  }, [router]);

  return (
    <>
      <Head>
        <title>Informasi Mesin</title>
        <meta name="description" content="Informasi Tentang Mesin Dan Firmware" />
      </Head>
      <Header />
      <main className="flex flex-col items-center min-h-screen">
        <h1 className="text-2xl font-semibold p-4">Informasi Mesin</h1>
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : info ? (
          <div>
            <p>Waktu: {info.time}</p>
            <p>Serial Number: {info.serialNumber}</p>
            <p>Versi Firmware: {info.firmwareVersion}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </>
  );
}
