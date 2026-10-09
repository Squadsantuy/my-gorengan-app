import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nibxqxbvwrnvgjbncvys.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pYnhxeGJ2d3JudmdqYm5jdnlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzNzcxMDQsImV4cCI6MjEwNjk1MzEwNH0.p0FtDSXBIOLRMzal8sg4YHpf__cjxD9V9XmAxHIRJ84';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { order_id, payment_status } = req.body;

    if (!order_id) {
      return res.status(400).json({ success: false, message: 'ID Pesanan tidak ditemukan' });
    }

    // Update status pesanan di database Supabase
    const { data, error } = await supabase
      .from('pesanan')
      .update({ status: 'lagi_digoreng' })
      .eq('id', order_id)
      .select();

    if (error) {
      console.error('Supabase Error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.status(200).json({ success: true, message: 'Pembayaran berhasil dikonfirmasi', data });
  } catch (err) {
    console.error('Server Error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Gagal memproses webhook' });
  }
}
