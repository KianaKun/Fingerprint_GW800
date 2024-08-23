import ZKLib from 'zklib-js';

// API route untuk login ke mesin fingerprint
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { ip, port } = req.body;

    const zkInstance = new ZKLib(ip, port, 5200, 5000); // Sesuaikan timeout jika diperlukan

    try {
      await zkInstance.createSocket();
      
      // Kirim respons bahwa koneksi berhasil
      res.status(200).json({ success: true });
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
