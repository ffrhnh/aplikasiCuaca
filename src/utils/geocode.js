const axios = require('axios'); 

const geocode = async (address) => {
    const place = encodeURIComponent(address);
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
            throw new Error('Tidak dapat menemukan lokasi. Lakukan pencarian lokasi yang lain'); 
        } else {
            console.log('GEOCODE OK. Data[0]:', data[0]);
            return {
                latitude: data[0].lat,
                longitude: data[0].lon,
                location: data[0].display_name,
            };
        }
        
    } catch (err) {
        console.error('GEOCODE ERROR (Axios):', err.message);
        throw new Error('Tidak dapat terkoneksi ke layanan geocoding. Pastikan URL MAP disetel.');
    }
};

module.exports = geocode;
