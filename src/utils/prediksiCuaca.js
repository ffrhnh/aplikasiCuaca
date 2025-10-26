const axios = require('axios');

const forecast = async (latitude, longitude, callback) => {
    const WEATHERSTACK_KEY = process.env.WEATHERSTACK_KEY;

    if (!WEATHERSTACK_KEY) {
        return callback('Kunci API cuaca tidak disetel (WEATHERSTACK_KEY)', undefined);
    }

    const url = `https://api.weatherstack.com/current?access_key=${WEATHERSTACK_KEY}&query=${latitude},${longitude}&units=m`;

    try {
        const res = await axios.get(url);
        const data = res.data;

        if (data.error) {
            return callback('Lokasi tidak ditemukan atau kunci API salah.', undefined);
        }

        const curr = data.current;
        const desc = curr.weather_descriptions && curr.weather_descriptions[0];

        const resultTeks = `Saat ini ${desc}. Suhu ${curr.temperature}°C. Terasa seperti ${curr.feelslike}°C. Kelembapan ${curr.humidity}%. Kemungkinan hujan ${curr.precip}%.`;

        callback(undefined, resultTeks);
    } catch (err) {
        callback('Tidak dapat terkoneksi ke layanan cuaca. Cek koneksi atau API key.', undefined);
    }
};

module.exports = forecast;
