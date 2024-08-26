import axios from "axios";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function Body_mesin(){
    const [info, setInfo] = useState(null);
    const [error, setError] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
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
            setTimeout(() => setIsVisible(true), 100);
          } else {
            setError("No machine configuration found. Please login again.");
          }
        } catch (err) {
          setError(err.message);
        }
      };
  
      fetchInfo();
    }, [router]);

    return(
        <main className="flex flex-col items-center min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Informasi Mesin</h1>
        {error ? (
          <p className="text-red-500 bg-red-100 p-4 rounded-md">{error}</p>
        ) : info ? (
          <div className={`fade-in ${isVisible ? 'visible' : ''} bg-white shadow-md rounded-lg overflow-x-auto w-full max-w-4xl`}>
            <table className="min-w-full divide-y divide-gray-200 table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detail</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Informasi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="bg-white">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Waktu</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{info.time}</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Serial Number</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{info.serialNumber}</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Versi Firmware</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{info.firmwareVersion}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 bg-gray-100 p-4 rounded-md">Loading...</p>
        )}
      </main>
    )
}