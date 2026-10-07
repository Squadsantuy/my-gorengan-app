// Konfigurasi Supabase
const SUPABASE_URL = 'https://nibxqxbvwrnvgjbncvys.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pYnhxeGJ2d3JudmdqYm5jdnlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzNzcxMDQsImV4cCI6MjEwNjk1MzEwNH0.p0FtDSXBIOLRMzal8sg4YHpf__cjxD9V9XmAxHIRJ84';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const HARGA_GORENGAN = { 'qty-tahu': 2000 };
let pesananState = { 'qty-tahu': 0 };
let selectedCrispy = 'Standard 🟡';
let currentOrderId = null;

function updateQty(id, change) {
    pesananState[id] = Math.max(0, pesananState[id] + change);
    document.getElementById(id).innerText = pesananState[id];
    hitungTotal();
}

function hitungTotal() {
    let total = 0;
    for (let key in pesananState) total += pesananState[key] * HARGA_GORENGAN[key];
    document.getElementById('total-harga').innerText = 'Rp ' + total.toLocaleString('id-ID');
    return total;
}

function selectCrispy(button) {
    document.querySelectorAll('.crispy-btn').forEach(btn => {
        btn.className = 'crispy-btn border border-gray-800 bg-gray-800 text-gray-400 py-2 rounded-xl text-xs font-bold';
    });
    button.className = 'crispy-btn border border-amber-500 bg-amber-500/10 text-amber-400 py-2 rounded-xl text-xs font-bold';
    selectedCrispy = button.innerText.trim();
}

async function prosesCheckout() {
    const totalHarga = hitungTotal();
    if (totalHarga === 0) return alert('Pilih minimal 1 gorengan!');

    // Simpan Langsung ke Supabase
    const { data, error } = await supabaseClient
        .from('pesanan')
        .insert([{
            items: pesananState,
            crispy_level: selectedCrispy,
            total: totalHarga
        }])
        .select();

    if (error) {
        alert('Gagal membuat pesanan: ' + error.message);
        return;
    }

    if (data && data.length > 0) {
        currentOrderId = data[0].id;
        document.getElementById('nomor-antrean').innerText = `#A-0${currentOrderId}`;
        document.getElementById('modal-status').classList.remove('hidden');
        
        // Mulai dengar notifikasi realtime status
        listenRealtimeStatus(currentOrderId);
    }
}

function listenRealtimeStatus(orderId) {
    supabaseClient
        .channel('pembeli_channel')
        .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'pesanan', filter: `id=eq.${orderId}` },
            (payload) => {
                if (payload.new.status === 'siap_ambil') {
                    playNotifSound();
                    document.getElementById('status-text').innerText = '✅ Siap Diambil!';
                    alert('🔔 Gorengan Kamu Sudah Ready & Hangat!');
                }
            }
        )
        .subscribe();
}

function playNotifSound() {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log('Izin audio dibutuhkan'));
}

function closeModal() {
    document.getElementById('modal-status').classList.add('hidden');
}
