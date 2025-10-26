const formLokasi = document.querySelector('#form-lokasi');
const inputLokasi = document.querySelector('#input-lokasi');
const pesanLokasi = document.querySelector('#pesan-lokasi');
const kotakPrediksi = document.querySelector('#kotak-prediksi'); // Target kotak estetik
const pesanPrediksi = document.querySelector('#pesan-prediksi'); // Target teks di dalam kotak

const ambilDataCuaca = (address) => {
    // 1. Reset Tampilan
    pesanLokasi.textContent = 'Memuat...';
    kotakPrediksi.style.backgroundColor = 'var(--color-pale-pink)'; // Warna loading
    pesanPrediksi.innerHTML = 'Mohon tunggu sebentar...'; 
    kotakPrediksi.classList.remove('error'); // Hapus class error jika ada

    // 2. Fetch Data
    fetch('/infoCuaca?address='+ location).then((response)=>{
        response.json().then((data)=>{
            if (data.error) {
                // Tampilan Error
                kotakPrediksi.classList.add('error');
                kotakPrediksi.style.backgroundColor = '#FCDEDE'; // Warna error
                pesanLokasi.textContent = 'Gagal menemukan lokasi.';
                pesanPrediksi.innerHTML = `<strong>Error:</strong> ${data.error}`;
            } else {
                // Tampilan Sukses
                kotakPrediksi.classList.remove('error');
                kotakPrediksi.style.backgroundColor = 'var(--color-pale-pink)'; // Warna sukses
                pesanLokasi.textContent = `Hasil untuk: ${data.lokasi}`;
                
                // Format Prediksi agar lebih mudah dibaca
                pesanPrediksi.innerHTML = `
                    <p><strong>Prediksi:</strong> ${data.prediksiCuaca}</p>
                `;
            }
        })
        .catch(error => {
            // Tampilan Error Jaringan
            kotakPrediksi.classList.add('error');
            kotakPrediksi.style.backgroundColor = '#FCDEDE'; // Warna error
            pesanLokasi.textContent = 'Terjadi Kesalahan Jaringan.';
            pesanPrediksi.innerHTML = `<strong>Kesalahan:</strong> ${error.message}`;
        });
};

formLokasi.addEventListener('submit', (e) => {
    e.preventDefault(); 
    const lokasi = inputLokasi.value.trim(); 
    
    if (lokasi) {
        ambilDataCuaca(lokasi);
    } else {
        pesanLokasi.textContent = 'Mohon masukkan nama lokasi.';
        kotakPrediksi.style.backgroundColor = 'var(--color-pale-pink)';
        pesanPrediksi.innerHTML = 'Cari lokasi untuk melihat hasilnya.';
    }
});