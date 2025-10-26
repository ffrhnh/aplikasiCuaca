const request = require('postman-request')

const forecast = (latitude, longitude, callback) => {
    // IMPORTANT: Weatherstack free plan pakai HTTP, bukan HTTPS
    const url = 'http://api.weatherstack.com/current?access_key=76fb2cb70d55ee6f756d3213b5e22c1a&query=' 
        + latitude + ',' + longitude + '&units=m'

    request({ url, json: true }, (err, res) => {
        if (err) {
            // Gagal koneksi ke weatherstack (internet / DNS / dsb)
            return callback('Tidak dapat terkoneksi ke layanan cuaca', undefined)
        } else if (res.body.error) {
            // Weatherstack balikin error (misal: key salah / quota habis)
            return callback('Lokasi tidak ditemukan oleh layanan cuaca', undefined)
        } else {
            // Ambil data cuaca
            const curr = res.body.current
            const desc = curr.weather_descriptions && curr.weather_descriptions[0]

            const resultTeks = `Saat ini ${desc}. Suhu ${curr.temperature}°C. Terasa seperti ${curr.feelslike}°C. Kelembapan ${curr.humidity}%. Kemungkinan hujan ${curr.precip}%.`

            // callback sukses
            callback(undefined, resultTeks)
        }
    })
}

module.exports = forecast
