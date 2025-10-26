const axios = require('axios'); // KUNCI: Pastikan AXIOS diimpor di sini

const forecast = async (latitude, longitude, callback) => {
    // Pastikan kunci ini disetel di .env atau dashboard hosting Anda
    const WEATHERSTACK_KEY = process.env.WEATHERSTACK_KEY; 
    
    if (!WEATHERSTACK_KEY) {
        // Mengubah menjadi Error agar ditangkap oleh Promise di app.js
        return callback('Kunci API cuaca tidak disetel (WEATHERSTACK_KEY)', undefined); 
    }
    
    // Gunakan HTTPS untuk koneksi yang lebih andal 
    const url = `http://api.weatherstack.com/current?access_key=${WEATHERSTACK_KEY}&query=${latitude},${longitude}&units=m`;
    
    try {
        const res = await axios.get(url);
        const data = res.data;

        if (data.error) {
            return callback('Lokasi tidak ditemukan atau kunci API cuaca salah', undefined);
        }
        
        const curr = data.current;
        const desc = curr.weather_descriptions && curr.weather_descriptions[0];

        const resultTeks = `Saat ini ${desc}. Suhu ${curr.temperature}°C. Terasa seperti ${curr.feelslike}°C. Kelembapan ${curr.humidity}%. Kemungkinan hujan ${curr.precip}%.`;

        // callback sukses
        callback(undefined, resultTeks);

    } catch (err) {
        callback('Tidak dapat terkoneksi ke layanan cuaca. Cek koneksi.', undefined);
    }
}

module.exports = forecast;