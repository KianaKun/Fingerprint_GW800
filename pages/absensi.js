import { useEffect, useState } from "react";
import Header from "@/pages/component/Header";
import axios from "axios";
import Head from "next/head";
import { useRouter } from 'next/navigation';

export default function Absensi() {
  const [logs, setLogs] = useState(null);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const router = useRouter();

  const fetchLogs = async (date = "") => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const ip = localStorage.getItem("machineIp");
      const port = localStorage.getItem("machinePort");

      if (ip && port) {
        const response = await axios.post("/api/absensi", { ip, port, date });

        if (response.data && response.data.logs && Array.isArray(response.data.logs.data)) {
          setLogs(response.data.logs.data);
          setTimeout(() => setIsVisible(true), 100);
        } else {
          console.error("Unexpected data format:", response.data);
          setError("Unexpected data format received from server");
        }
      } else {
        setError("No machine configuration found. Please login again.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [router]);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    fetchLogs(date);
  };

  return (
    <>
      <Head>
        <title>Absensi Logs</title>
        <meta name="description" content="Berisi log absensi yang sudah diisi" />
        <style>{`
          .fade-in {
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
          }
          .fade-in.visible {
            opacity: 1;
          }
        `}</style>
      </Head>
      <Header />
      <main className="flex flex-col items-center min-h-screen bg-gray-100 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Log Absensi</h1>
        <div className="mb-6 flex items-center bg-white p-4 rounded-lg shadow-md">
          <label htmlFor="date-filter" className="mr-3 text-gray-700 font-medium">Filter berdasarkan tanggal:</label>
          <div className="relative">
            <input
              type="date"
              id="date-filter"
              value={selectedDate}
              onChange={handleDateChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        {error ? (
          <p className="text-red-500 bg-red-100 p-4 rounded-md">{error}</p>
        ) : logs ? (
          <div className={`fade-in ${isVisible ? 'visible' : ''} bg-white shadow-md rounded-lg overflow-hidden`}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Log</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal dan Jam</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Mesin</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.userSn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.deviceUserId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.userName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.recordTime).toLocaleString('id-ID', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 bg-gray-100 p-4 rounded-md">Loading...</p>
        )}
      </main>
    </>
  );
}