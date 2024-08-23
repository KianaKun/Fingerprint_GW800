import ZKLib from 'zklib-js';

export default async function handler(req, res) {
  const { ip, port, date } = req.body;

  if (req.method === 'POST') {
    try {
      const zkInstance = new ZKLib(ip, port, 5200, 5000);
      await zkInstance.createSocket();

      const logs = await zkInstance.getAttendances();
      const users = await zkInstance.getUsers();

      await zkInstance.disconnect();

      // Membuat map dari ID pengguna ke nama pengguna
      const userMap = {};
      users.data.forEach(user => {
        userMap[user.userId] = user.name;
      });

      // Menambahkan nama pengguna ke setiap log dan filter berdasarkan tanggal
      const logsWithNames = logs.data
        .map(log => ({
          ...log,
          userName: userMap[log.deviceUserId] || 'Unknown'
        }))
        .filter(log => {
          if (!date) return true; // Jika tidak ada filter tanggal, tampilkan semua
          const logDate = new Date(log.recordTime);
          const filterDate = new Date(date);
          return logDate.toDateString() === filterDate.toDateString();
        });

      // Mengirimkan data yang diformat ke frontend
      return res.status(200).json({
        logs: { data: logsWithNames }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error connecting to fingerprint machine', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}