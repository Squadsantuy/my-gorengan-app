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

    if (!order_id || payment_status !== 'PAID') {
      return res.status(400).json({ success: false, message: 'Payload pembayaran tidak valid' });
    }

    // Update status pesanan di Supabase menjadi "lagi_digoreng"
    const { data, error } = await supabase
      .from('pesanan')
      .update({ status: 'lagi_digoreng' })
      .eq('id', order_id)
      .select();

    if (error) {
      throw error;
    }

    return res.status(200).json({
      success: true,
      message: 'Webhook diterima, status pesanan berhasil diperbarui!',
      data
    });
  } catch (err) {
    console.error('Webhook Payment Error:', err);
    return res.status(500).json({ success: false, message: 'Gagal memproses webhook' });
  }
}
