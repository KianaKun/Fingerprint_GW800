import { useEffect, useState } from "react";
import Header from "@/pages/component/Header";
import axios from "axios";
import Head from "next/head";
import { useRouter } from 'next/navigation';

export default function User() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
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
    return role === 0 ? "User Biasa" : role === 1 ? "Admin" : "Tidak Diketahui";
  };

  return (
    <>
      <Head>
        <title>User Terdaftar</title>
        <meta name="description" content="Berisi User yang terdaftar di mesin fingerprint" />
      </Head>
      <Header />
      <main className="flex flex-col items-center min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Daftar Pengguna</h1>
        {error ? (
          <p className="text-red-500 bg-red-100 p-4 rounded-md">{error}</p>
        ) : users ? (
          <div className={`fade-in ${isVisible ? 'visible' : ''} bg-white shadow-md rounded-lg overflow-x-auto w-full max-w-4xl`}>
            <table className="min-w-full divide-y divide-gray-200 table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={user.uid} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.uid}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.userId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getRoleName(user.role)}</td>
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
