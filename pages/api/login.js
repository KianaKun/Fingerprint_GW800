import ZKLib from 'zklib-js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { ip, port } = req.body;
    const zkInstance = new ZKLib(ip, port, 5200, 5000); // Sesuaikan timeout jika diperlukan

    try {
      await zkInstance.createSocket();

      const response = await zkInstance.getUsers();
      const users = response.data; // Ambil data pengguna dari properti data

      //console.log("Users data:", users); // Tambahkan log untuk memeriksa struktur data

      if (!Array.isArray(users)) {
        throw new Error("Data pengguna tidak dalam format array");
      }

      // Filter users with role 14 (admin)
      const adminUsers = users.filter(user => user.role === 14);

      // Kirim respons dengan data admin
      res.status(200).json({ success: true, users: adminUsers });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Gagal menghubungi mesin fingerprint' });
    } finally {
      // Pastikan untuk menutup koneksi jika diperlukan
      zkInstance.disconnect();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
