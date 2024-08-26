import axios from "axios";
import { useEffect, useState } from "react";

export default function Body_index(){
    const [ip, setIp] = useState("");
    const [port, setPort] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
        window.location.href = "/mesin";
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
        const response = await axios.post("/api/login/", { ip, port });
        const { token } = response.data;

        localStorage.setItem("authToken", token);
        localStorage.setItem("machineIp", ip);
        localStorage.setItem("machinePort", port);

        window.location.href = "/mesin";
        } catch (error) {
        setMessage("Gagal terkoneksi. Mohon periksa kembali IP dan port mesin fingerprint Anda.");
        } finally {
        setIsLoading(false);
        }
    };
    return(
        <>
        <main className="flex justify-center items-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('background.webp')" }}>
            <div className="bg-gradient-to-br from-teal-500 to-cyan-500 bg-opacity-80 p-8 rounded-lg shadow-lg max-w-md w-full backdrop-blur-sm">
                <h1 className="text-xl font-semibold text-center mb-6 text-white">Login Mesin Fingerprint</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">IP Address:</label>
                        <input
                            type="text"
                            value={ip}
                            onChange={(e) => setIp(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Contoh: 192.168.1.1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Port:</label>
                        <input
                            type="text"
                            value={port}
                            onChange={(e) => setPort(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Contoh: 5000" />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? "Menghubungkan..." : "Login"}
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
            </div>
        </main><div className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center transition-opacity duration-300 ${isLoading ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div className={`bg-white p-6 rounded-lg shadow-lg transition-all duration-300 transform ${isLoading ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                    <p className="text-lg font-semibold mb-4">Menghubungkan ke mesin fingerprint...</p>
                    <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
                </div>
            </div></>
    )
}