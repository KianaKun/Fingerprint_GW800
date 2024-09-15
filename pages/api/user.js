// pages/api/user.js

import ZKLib from 'zklib-js';

export default async function handler(req, res) {
  const { ip, port } = req.body;

  if (req.method === 'POST') {
    try {
      const zkInstance = new ZKLib(ip, port, 5200, 5000);
      await zkInstance.createSocket();

      const users = await zkInstance.getUsers();
      
      await zkInstance.disconnect();

      // Mengirimkan data yang diformat ke frontend
      return res.status(200).json({
        users
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error connecting to fingerprint machine', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
