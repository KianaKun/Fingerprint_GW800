import { useRouter } from 'next/navigation';
import axios from "axios";
import { useEffect, useState } from "react";

export default function Body_user() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Maksimal 5 item per halaman
    const router = useRouter();

    useEffect(() => {
        const fetchInfo = async () => {
            const token = localStorage.getItem("authToken");
            if (!token) {
                router.push("/");
                return;
            }

            try {
                const ip = localStorage.getItem("machineIp");
                const port = localStorage.getItem("machinePort");

                if (ip && port) {
                    const response = await axios.post("/api/user", { ip, port });

                    console.log("API Response:", response.data);

                    if (response.data && response.data.users && Array.isArray(response.data.users.data)) {
                        setUsers(response.data.users.data);
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

        fetchInfo();
    }, [router]);

    const getRoleName = (role) => {
        return role === 0 ? "User Biasa" : role === 14 ? "Admin" : "Tidak Diketahui";
    };

    // Pagination logic
    const totalPages = Math.ceil(users.length / itemsPerPage);
    const currentUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <main className="flex flex-col items-center min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Daftar Pengguna</h1>
            {error ? (
                <p className="text-red-500 bg-red-100 p-4 rounded-md">{error}</p>
            ) : users ? (
                <div className={`fade-in ${isVisible ? 'visible' : ''} bg-white shadow-md rounded-lg overflow-x-auto w-full max-w-4xl`}>
                    <table className="min-w-full divide-y divide-gray-200 table-auto">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentUsers.map((user, index) => (
                                <tr key={user.uid} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.uid}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.userId}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getRoleName(user.role)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4 flex justify-center">
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px gap-3 p-2" aria-label="Pagination">
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
