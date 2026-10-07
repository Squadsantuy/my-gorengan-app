// File: api/pesanan.js
let menu = [
  { id: 1, nama: 'Tahu Isi Crispy', harga: 2000, stok: 20 },
  { id: 2, nama: 'Tempe Mendoan', harga: 2000, stok: 15 },
  { id: 3, nama: 'Bakwan Sayur', harga: 1500, stok: 10 }
];

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { menu_id, jumlah } = req.body;
    const itemMenu = menu.find(m => m.id === menu_id);

    if (!itemMenu || itemMenu.stok < jumlah) {
      return res.status(400).json({ success: false, message: 'Stok habis!' });
    }

    itemMenu.stok -= jumlah;
    return res.status(200).json({
      success: true,
      data: {
        id_pesanan: Math.floor(Math.random() * 1000),
        item: itemMenu.nama,
        jumlah,
        total_harga: itemMenu.harga * jumlah,
        status: 'lagi_digoreng'
      }
    });
  }

  res.status(405).json({ message: 'Method Not Allowed' });
}
