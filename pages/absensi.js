import { useEffect, useState } from "react";
import Header from "@/pages/component/Header";
import axios from "axios";
import Head from "next/head";
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

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

  const exportToExcel = () => {
    if (!logs || logs.length === 0) {
      setError("No data available to export");
      return;
    }

    // Definisikan header kolom untuk file Excel
    const headers = [
      "ID Log",
      "ID User",
      "Nama User",
      "Tanggal dan Jam",
      "IP Mesin"
    ];

    // Persiapkan data untuk file Excel
    const dataForExcel = logs.map(log => ({
      "ID Log": log.userSn,
      "ID User": log.deviceUserId,
      "Nama User": log.userName,
      "Tanggal dan Jam": new Date(log.recordTime).toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      "IP Mesin": log.ip
    }));

    // Buat worksheet dari data
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Absensi Logs");

    // Simpan file Excel
    XLSX.writeFile(workbook, `absensi_logs_${selectedDate || "all"}.xlsx`);
  };

  return (
    <>
      <Head>
        <title>Absensi Logs</title>
        <meta name="description" content="Berisi log absensi yang sudah diisi" />
      </Head>
      <Header />
      <main className="flex flex-col items-center min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Log Absensi</h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 mb-6 w-full">
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-1 sm:max-w-xs">
            <div className="flex items-center space-x-3">
              <label htmlFor="date-filter" className="text-gray-700 font-medium">Filter berdasarkan tanggal:</label>
              <input
                type="date"
                id="date-filter"
                value={selectedDate}
                onChange={handleDateChange}
                className="block w-full pl-2 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <button
            onClick={exportToExcel}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Export to Excel
          </button>
        </div>
        {error ? (
          <p className="text-red-500 bg-red-100 p-4 rounded-md">{error}</p>
        ) : logs ? (
          <div className={`fade-in ${isVisible ? 'visible' : ''} bg-white shadow-md rounded-lg overflow-x-auto w-full`}>
            <table className="min-w-full divide-y divide-gray-200 table-auto">
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
