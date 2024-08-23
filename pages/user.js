import { useEffect, useState } from "react";
import Header from "@/pages/component/Header";
import axios from "axios";
import Head from "next/head";
import { useRouter } from 'next/navigation';

export default function User() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
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
      <main className="flex flex-col items-center min-h-screen">
        <h1 className="text-2xl font-semibold p-4">Daftar Pengguna</h1>
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : users ? (
          <table className="border-collapse border border-gray-400">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2">UID</th>
                <th className="border border-gray-400 px-4 py-2">Nama</th>
                <th className="border border-gray-400 px-4 py-2">User ID</th>
                <th className="border border-gray-400 px-4 py-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.uid}>
                  <td className="border border-gray-400 px-4 py-2">{user.uid}</td>
                  <td className="border border-gray-400 px-4 py-2">{user.name}</td>
                  <td className="border border-gray-400 px-4 py-2">{user.userId}</td>
                  <td className="border border-gray-400 px-4 py-2">{getRoleName(user.role)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </>
  );
}