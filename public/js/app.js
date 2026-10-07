// Data Harga & State Pesanan
const HARGA_GORENGAN = {
    'qty-tahu': 2000,
    'qty-tempe': 2000,
    'qty-bakwan': 1500
};

const MENU_ID_MAP = {
    'qty-tahu': 1,
    'qty-tempe': 2,
    'qty-bakwan': 3
};

let pesananState = {
    'qty-tahu': 0,
    'qty-tempe': 0,
    'qty-bakwan': 0
};

let selectedCrispy = 'Standard 🟡';

// 1. Fungsi Mengubah Jumlah Pesanan
function updateQty(id, change) {
    pesananState[id] = Math.max(0, pesananState[id] + change);
    const element = document.getElementById(id);
    if (element) {
        element.innerText = pesananState[id];
    }
    hitungTotal();
}

// 2. Fungsi Menghitung Total Harga
function hitungTotal() {
    let total = 0;
    for (let key in pesananState) {
        total += pesananState[key] * HARGA_GORENGAN[key];
    }
    const totalElement = document.getElementById('total-harga');
    if (totalElement) {
        totalElement.innerText = 'Rp ' + total.toLocaleString('id-ID');
    }
    return total;
}

// 3. Fungsi Memilih Level Crispy
function selectCrispy(button) {
    document.querySelectorAll('.crispy-btn').forEach(btn => {
        btn.classList.remove('border-brand', 'bg-brand/10', 'text-brand');
        btn.classList.add('border-gray-800', 'bg-cardBg', 'text-gray-400');
    });
    button.classList.remove('border-gray-800', 'bg-cardBg', 'text-gray-400');
    button.classList.add('border-brand', 'bg-brand/10', 'text-brand');
    selectedCrispy = button.innerText.trim();
}

// 4. Fungsi Kirim Pesanan ke Backend Vercel API
async function prosesCheckout() {
    const totalHarga = hitungTotal();
    
    if (totalHarga === 0) {
        alert('Pilih minimal 1 gorengan dulu ya!');
        return;
    }

    // Susun item yang dipesan
    let itemsToOrder = [];
    for (let key in pesananState) {
        if (pesananState[key] > 0) {
            itemsToOrder.push({
                menu_id: MENU_ID_MAP[key],
                jumlah: pesananState[key]
            });
        }
    }

    try {
        // Panggil Serverless Function di Vercel (/api/pesanan)
        const response = await fetch('/api/pesanan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pembeli_id: 1,
                items: itemsToOrder,
                crispy_level: selectedCrispy,
                total: totalHarga
            })
        });

        const result = await response.json();

        if (result.success) {
            // Tampilkan Modal Status & Nomor Antrean
            document.getElementById('nomor-antrean').innerText = `#A-${result.data.id_pesanan}`;
            document.getElementById('modal-status').classList.remove('hidden');
        } else {
            alert(result.message || 'Gagal membuat pesanan');
        }
    } catch (error) {
        console.error('Error saat checkout:', error);
        alert('Gagal terhubung ke server. Pastikan backend aktif!');
    }
}

// 5. Tutup Modal Status
function closeModal() {
    document.getElementById('modal-status').classList.add('hidden');
}
