import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import axios from "axios";
import { useEffect, useState } from "react";

export default function Body_absensi() {
    const [logs, setLogs] = useState([]);
    const [error, setError] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
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
                    const logs = response.data.logs.data;
                    const processedLogs = processLogs(logs);
                    setLogs(processedLogs);
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

    const processLogs = (logs) => {
        let statusLogs = [];
        logs.forEach(log => {
            const existingLog = statusLogs.find(l => l.deviceUserId === log.deviceUserId);
            if (existingLog) {
                if (!existingLog.checkIn) {
                    existingLog.checkIn = log.recordTime;
                } else {
                    existingLog.checkOut = log.recordTime;
                }
            } else {
                statusLogs.push({
                    ...log,
                    checkIn: log.recordTime,
                    checkOut: null
                });
            }
        });
        return statusLogs;
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
            "Check-In",
            "Check-Out",
            "IP Mesin"
        ];

        // Persiapkan data untuk file Excel
        const dataForExcel = logs.map(log => ({
            "ID Log": log.userSn,
            "ID User": log.deviceUserId,
            "Nama User": log.userName,
            "Check-In": log.checkIn ? new Date(log.checkIn).toLocaleString('id-ID') : "N/A",
            "Check-Out": log.checkOut ? new Date(log.checkOut).toLocaleString('id-ID') : "N/A",
            "IP Mesin": log.ip
        }));

        // Buat worksheet dari data
        const worksheet = XLSX.utils.json_to_sheet(dataForExcel, { header: headers });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Absensi Logs");

        // Simpan file Excel
        XLSX.writeFile(workbook, `absensi_logs_${selectedDate || "all"}.xlsx`);
    };

    // Hitung total halaman
    const totalPages = Math.ceil(logs.length / itemsPerPage);

    // Ambil data untuk halaman saat ini
    const currentLogs = logs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Navigasi halaman
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <main className="flex flex-col items-center min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Log Absensi</h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 w-full">
                <div className="flex flex-1 justify-end gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-md flex items-center w-full sm:w-auto">
                        <input
                            type="date"
                            id="date-filter"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="block w-full pl-2 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                    </div>
                    <button
                        onClick={exportToExcel}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Export to Excel
                    </button>
                </div>
            </div>
            {error ? (
                <p className="text-red-500 bg-red-100 p-4 rounded-md">{error}</p>
            ) : currentLogs.length > 0 ? (
                <div className={`fade-in ${isVisible ? 'visible' : ''} bg-white shadow-md rounded-lg overflow-x-auto w-full`}>
                    <table className="min-w-full divide-y divide-gray-200 table-auto">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Log</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID User</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama User</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-In</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-Out</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Mesin</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentLogs.map((log, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.userSn}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.deviceUserId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.userName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {log.checkIn ? new Date(log.checkIn).toLocaleString('id-ID') : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {log.checkOut ? new Date(log.checkOut).toLocaleString('id-ID') : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ip}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4 flex justify-center z-10">
                        <nav className="relative z-10 inline-flex rounded-md shadow-sm -space-x-px gap-3 p-2" aria-label="Pagination">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                                Previous
                            </button>
                            {[...Array(totalPages).keys()].map(page => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page + 1)}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${currentPage === page + 1 ? 'text-blue-600 bg-blue-50 border-blue-500' : 'text-gray-500 bg-white border-gray-300'} border rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                                >
                                    {page + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                </div>
            ) : (
                <p className="text-gray-600 bg-gray-100 p-4 rounded-md">Loading...</p>
            )}
        </main>
    );
}
