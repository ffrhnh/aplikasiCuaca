const axios = require('axios'); // Pastikan Anda npm install axios jika belum

const geocode = async (address, callback) => {
    const place = encodeURIComponent(address);
    // PASTIKAN process.env.MAP SUDAH BENAR
    const url = `${process.env.MAP}/search?q=${place}&format=json`;

    console.log('Geocode dipanggil dengan address:', address);
    console.log('Geocode membuat request ke URL:', url);

    try {
        const res = await axios.get(url, {
            headers: { 'User-Agent': 'NetworkProgramming-Project/1.0' }
        });

        const data = res.data;

        if (data.length === 0) {
            console.log('GEOCODE: Lokasi tidak ditemukan untuk:', address);
            callback('Tidak dapat menemukan lokasi. Lakukan pencarian lokasi yang lain', undefined);
        } else {
            console.log('GEOCODE OK. Data[0]:', data[0]);
            callback(undefined, {
                latitude: data[0].lat,
                longitude: data[0].lon,
                location: data[0].display_name,
            });
        }
        
    } catch (err) {
        console.log('GEOCODE ERROR (Axios):', err.message);
        callback('Tidak dapat terkoneksi ke layanan geocoding. Cek variabel MAP.', undefined);
    }
}

module.exports = geocode;