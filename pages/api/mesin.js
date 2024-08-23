// pages/api/dashboard.js

import ZKLib from 'zklib-js';

export default async function handler(req, res) {
  const { ip, port } = req.body;

  if (req.method === 'POST') {
    try {
      const zkInstance = new ZKLib(ip, port, 5200, 5000);
      await zkInstance.createSocket();

      const time = await zkInstance.getTime();
      const serialNumber = await zkInstance.getSerialNumber();
      const firmwareVersion = await zkInstance.getFirmware();

      await zkInstance.disconnect();

      // Mengirimkan data yang diformat ke frontend
      return res.status(200).json({
        time,
        serialNumber,
        firmwareVersion,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error connecting to fingerprint machine', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
