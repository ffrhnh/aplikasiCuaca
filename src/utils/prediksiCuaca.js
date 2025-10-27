// File: src/utils/prediksiCuaca.js (versi Open-Meteo)
const axios = require('axios');

const forecast = async (latitude, longitude) => {
    // Open-Meteo tidak perlu API key, cukup latitude & longitude
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,precipitation,weather_code,relative_humidity_2m`;

    try {
        const res = await axios.get(url);
        const curr = res.data.current;

        if (!curr) {
            throw new Error('Data cuaca tidak ditemukan untuk lokasi ini.');
        }

        // Deskripsi sederhana dari kode cuaca (weather_code)
        const kodeCuaca = curr.weather_code;
        const deskripsiCuaca = getDeskripsiCuaca(kodeCuaca);

        // Format hasil dalam bentuk teks
        const teks = `Saat ini ${deskripsiCuaca}. Suhu ${curr.temperature_2m}°C. Terasa seperti ${curr.apparent_temperature}°C. Kelembapan ${curr.relative_humidity_2m}%. Curah hujan ${curr.precipitation} mm.`;

        return {
            teks,
            suhu: curr.temperature_2m,
            feelsLike: curr.apparent_temperature,
            kelembapan: curr.relative_humidity_2m,
            hujan: curr.precipitation,
            deskripsi: deskripsiCuaca
        };

    } catch (err) {
        console.error('FORECAST ERROR (Open-Meteo):', err.message);
        throw new Error('Tidak dapat mengambil data cuaca dari layanan Open-Meteo.');
    }
};

// Fungsi tambahan: ubah weather_code menjadi deskripsi teks
function getDeskripsiCuaca(code) {
    const mapping = {
        0: 'cerah',
        1: 'sebagian berawan',
        2: 'berawan',
        3: 'mendung',
        45: 'berkabut',
        48: 'kabut beku',
        51: 'gerimis ringan',
        53: 'gerimis sedang',
        55: 'gerimis lebat',
        61: 'hujan ringan',
        63: 'hujan sedang',
        65: 'hujan lebat',
        71: 'salju ringan',
        73: 'salju sedang',
        75: 'salju lebat',
        80: 'hujan singkat ringan',
        81: 'hujan singkat sedang',
        82: 'hujan singkat lebat',
        95: 'badai petir',
        99: 'badai petir hebat'
    };
    return mapping[code] || 'kondisi tidak diketahui';
}

module.exports = forecast;
