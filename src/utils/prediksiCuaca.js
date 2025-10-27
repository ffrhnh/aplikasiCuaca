const axios = require('axios');

const forecast = async (latitude, longitude) => {
    const WEATHERSTACK_KEY = process.env.WEATHERSTACK_KEY;

    console.log('DEBUG WEATHERSTACK_KEY (server):', WEATHERSTACK_KEY ? 'ADA' : 'TIDAK ADA');

    if (!WEATHERSTACK_KEY) {
        throw new Error('Kunci API cuaca tidak disetel (WEATHERSTACK_KEY).');
    }

    const url = `http://api.weatherstack.com/current?access_key=${WEATHERSTACK_KEY}&query=${latitude},${longitude}&units=m`;

    try {
        const res = await axios.get(url);
        const data = res.data;

        if (data.error) {
            throw new Error('Lokasi tidak ditemukan atau kunci API salah.');
        }

        const curr = data.current;
        const desc = curr.weather_descriptions && curr.weather_descriptions[0];

        return {
            teks: `Saat ini ${desc}. Suhu ${curr.temperature}°C. Terasa seperti ${curr.feelslike}°C. Kelembapan ${curr.humidity}%. Kemungkinan hujan ${curr.precip}%.`,
            suhu: curr.temperature,
            feelsLike: curr.feelslike,
            kelembapan: curr.humidity,
            kemungkinanHujan: curr.precip,
            deskripsi: desc
        };

    } catch (err) {
        console.error('FORECAST ERROR:', err.message);
        throw new Error('Tidak dapat terkoneksi ke layanan cuaca. Cek koneksi atau API key.');
    }
};

module.exports = forecast;
