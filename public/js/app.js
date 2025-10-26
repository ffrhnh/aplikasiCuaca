const formLokasi = document.querySelector('#form-lokasi');
const inputLokasi = document.querySelector('#input-lokasi');
const pesanLokasi = document.querySelector('#pesan-lokasi');
const kotakPrediksi = document.querySelector('#kotak-prediksi'); // box hasil
const pesanPrediksi = document.querySelector('#pesan-prediksi'); // isi box hasil

function setLoadingState(lokasiUser) {
    pesanLokasi.textContent = lokasiUser
        ? `Mencari cuaca untuk "${lokasiUser}"...`
        : 'Memuat...';

    kotakPrediksi.classList.remove('error');
    kotakPrediksi.style.backgroundColor = 'var(--color-pale-pink)';
    pesanPrediksi.innerHTML = 'Mohon tunggu sebentar...';
}

function setErrorState(pesanError) {
    kotakPrediksi.classList.add('error');
    kotakPrediksi.style.backgroundColor = '#FCDEDE';
    pesanLokasi.textContent = 'Terjadi Kesalahan.';
    pesanPrediksi.innerHTML = `<strong>Error:</strong> ${pesanError}`;
}

function setSuccessState(data) {
    kotakPrediksi.classList.remove('error');
    kotakPrediksi.style.backgroundColor = 'var(--color-pale-pink)';

    // Teks atas
    pesanLokasi.textContent = `Hasil untuk: ${data.lokasi}`;

    // Teks detail
    // prediksiCuaca = string panjang yang sudah disiapkan backend (teks gabungan)
    // detail = objek angka (suhu, kelembapan, dll)
    pesanPrediksi.innerHTML = `
        <p><strong>Prediksi:</strong> ${data.prediksiCuaca}</p>
        <p>Suhu sekarang: ${data.detail.suhu}°C (Feels like ${data.detail.feelsLike}°C)</p>
        <p>Kelembapan: ${data.detail.kelembapan}%</p>
        <p>Kemungkinan hujan: ${data.detail.kemungkinanHujan}%</p>
    `;
}

const ambilDataCuaca = (address) => {
    // 1. Tampilkan state loading
    setLoadingState(address);

    // 2. Fetch API backend kamu
    fetch('/infoCuaca?address=' + encodeURIComponent(address))
        .then((response) => {
            if (!response.ok) {
                throw new Error('Gagal terhubung ke server.');
            }
            return response.json();
        })
        .then((data) => {
            if (data.error) {
                // Error dari backend (misal lokasi tidak ketemu / API key salah / koneksi cuaca gagal)
                setErrorState(data.error);
            } else {
                // Sukses
                setSuccessState(data);
            }
        })
        .catch((error) => {
            // Error jaringan browser-ke-server (misal offline)
            setErrorState(error.message);
        });
};

formLokasi.addEventListener('submit', (e) => {
    e.preventDefault();
    const lokasi = inputLokasi.value.trim();

    if (!lokasi) {
        // User klik submit tapi kosong
        kotakPrediksi.classList.remove('error');
        kotakPrediksi.style.backgroundColor = 'var(--color-pale-pink)';
        pesanLokasi.textContent = 'Mohon masukkan nama lokasi.';
        pesanPrediksi.innerHTML = 'Cari lokasi untuk melihat hasilnya.';
        return;
    }

    // Kalau ada input lokasi → panggil API
    ambilDataCuaca(lokasi);
});
