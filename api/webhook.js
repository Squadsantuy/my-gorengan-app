// File: api/webhook.js
export default function handler(req, res) {
  if (req.method === 'POST') {
    const { order_id, transaction_status } = req.body;

    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      // Pembayaran BERHASIL
      // Update status pesanan di database dari 'menunggu' -> 'digoreng'
      console.log(`Pesanan #${order_id} berhasil dibayar! Sinyal dikirim ke penjual.`);
      
      return res.status(200).json({ status: 'success', message: 'Status pesanan berhasil diperbarui' });
    }

    return res.status(400).json({ status: 'failed', message: 'Pembayaran belum/gagal diverifikasi' });
  }

  res.status(405).json({ message: 'Method Not Allowed' });
}
