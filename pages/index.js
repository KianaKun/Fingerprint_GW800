import { useEffect, useState } from "react";
import Head from "next/head";
import axios from "axios";

export default function Login() {
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      window.location.href = "/mesin"; // Redirect ke mesin
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login/", { ip, port });
      const { token } = response.data;

      // Simpan token dan konfigurasi mesin di localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("machineIp", ip);
      localStorage.setItem("machinePort", port);

      // Redirect ke dashboard setelah login berhasil
      window.location.href = "/mesin";
    } catch (error) {
      setMessage(error.response?.data?.message || "Gagal login ke mesin, silakan coba lagi.");
    }
  };

  return (
    <>
      <Head>
        <title>Please Login</title>
        <meta name="description" content="Silahkan Login Terlebih Dahulu" />
      </Head>
      <main className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-semibold text-center mb-6">Login Mesin Fingerprint</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">IP Address:</label>
              <input
                type="text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Contoh: 192.168.1.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Port:</label>
              <input
                type="text"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Contoh: 4370"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Login
            </button>
          </form>
          {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
        </div>
      </main>
    </>
  );
}
