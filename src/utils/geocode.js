const request = require('postman-request');

const geocode = (address, callback) => {
    const place = encodeURIComponent(address);
    const url = `${process.env.MAP}/search?q=${place}&format=json`;

    console.log('Geocode dipanggil dengan address:', address);
    console.log('Geocode membuat request ke URL:', url);

    request(
        {
            url,
            json: true,
            headers: { 'User-Agent': 'NetworkProgramming-Project/1.0' }
        },
        (err, res) => {
            if (err) {
                console.log('GEOCODE ERROR (err dari request):', err);
                callback('Tidak dapat terkoneksi ke layanan', undefined);
            } else if (!res || !res.body) {
                console.log('GEOCODE ERROR (res/body kosong):', res);
                callback('Respon tidak valid dari layanan geocoding', undefined);
            } else if (res.body.length === 0) {
                console.log('GEOCODE: Lokasi tidak ditemukan untuk:', address);
                callback('Tidak dapat menemukan lokasi. Lakukan pencarian lokasi yang lain', undefined);
            } else {
                console.log('GEOCODE OK. Data[0]:', res.body[0]);
                callback(undefined, {
                    latitude: res.body[0].lat,
                    longitude: res.body[0].lon,
                    location: res.body[0].display_name,
                });
            }
        }
    );
}

module.exports = geocode;
