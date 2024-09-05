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

      // Filter dan format logs dengan status Masuk dan Keluar
      const filteredLogs = logs.data
        .map(log => ({
          ...log,
          userName: userMap[log.deviceUserId] || 'Unknown',
          recordDate: new Date(log.recordTime).toDateString()
        }))
        .filter(log => !date || new Date(log.recordTime).toDateString() === new Date(date).toDateString());

      // Kelompokkan logs berdasarkan userId dan recordDate
      const groupedLogs = filteredLogs.reduce((acc, log) => {
        const key = `${log.deviceUserId}-${log.recordDate}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(log);
        return acc;
      }, {});

      // Format data untuk ditampilkan dengan status Masuk dan Keluar
      const formattedLogs = Object.values(groupedLogs).map(group => {
        // Urutkan berdasarkan waktu
        group.sort((a, b) => new Date(a.recordTime) - new Date(b.recordTime));
        if (group.length === 0) return [];

        const first = group[0];
        const last = group[group.length - 1];
        return [
          {
            ...first,
            status: 'Masuk'
          },
          {
            ...last,
            status: 'Keluar'
          }
        ];
      }).flat();

      return res.status(200).json({
        logs: { data: formattedLogs }
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error connecting to fingerprint machine', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
