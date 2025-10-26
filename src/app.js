const path = require('path');
const express = require('express');
const hbs = require('hbs');
const axios = require('axios');

require('dotenv').config(); // load .env PALING AWAL

const geocode = require('./utils/geocode');
const forecast = require('./utils/prediksiCuaca');

const app = express();
const port = process.env.PORT || 4000;

// Debug env
console.log('MAP sekarang adalah:', process.env.MAP);

// ====================================================================
// KONFIGURASI EXPRESS
// ====================================================================

// direktori static public
const direktoriPublic = path.join(__dirname, '../public');

// direktori views hbs
const direktoriViews = path.join(__dirname, '../templates/views');

// direktori partials hbs
const direktoriPartials = path.join(__dirname, '../templates/partials');

// setup handlebars engine dan lokasi folder views
app.set('view engine', 'hbs');
app.set('views', direktoriViews);
hbs.registerPartials(direktoriPartials);

// serve file statis
app.use(express.static(direktoriPublic));

// ====================================================================
// ROUTES HALAMAN
// ====================================================================

// halaman utama
app.get('', (req, res) => {
    res.render('index', {
        judul: 'Aplikasi Cek Cuaca',
        nama: 'Aisyah Farhanah'
    });
});

// halaman bantuan
app.get('/bantuan', (req, res) => {
    res.render('bantuan', {
        judul: 'Halaman Bantuan',
        nama: 'Aisyah Farhanah',
        teksBantuan: 'ini adalah teks bantuan'
    });
});

// halaman tentang
app.get('/tentang', (req, res) => {
    res.render('tentang', {
        judul: 'Tentang Saya',
        nama: 'Aisyah Farhanah'
    });
});

// halaman berita (render template hbs)
app.get('/berita', async (req, res) => {
    const API_KEY_VALUE = process.env.MEDIASTACK_KEY || 'ISI_API_KEY_KAMU_DI_SINI';

    // kamu bisa tambahin filter negara kalo mau: &countries=id
    const endpoint = `http://api.mediastack.com/v1/news?access_key=${API_KEY_VALUE}&languages=en&limit=10`;

    try {
        const response = await axios.get(endpoint);
        const data = response.data;

        if (data.error) {
            console.error('Mediastack Error:', data.error.message);
            return res.render('berita', {
                judul: 'Berita Terkini',
                error: `Mediastack Error: ${data.error.message}`
            });
        }

        // data.data = array artikel
        res.render('berita', {
            judul: 'Berita Terkini',
            articles: data.data
        });

    } catch (e) {
        console.error('Network Fetch Error:', e.message);
        res.render('berita', {
            judul: 'Berita Terkini',
            error: 'Gagal terhubung ke layanan berita. (Cek koneksi internet/HTTPS/kunci API).'
        });
    }
});

// ====================================================================
// ROUTE API JSON UNTUK FRONTEND FETCH CUACA
// ====================================================================

app.get('/infoCuaca', async (req, res) => {
    // user harus kirim ?address=pekanbaru
    if (!req.query.address) {
        return res.send({
            error: 'Kamu harus memasukan lokasi yang ingin dicari'
        });
    }

    const address = req.query.address;

    try {
        // 1. geocoding nama lokasi -> koordinat
        const { latitude, longitude, location } = await geocode(address);

        // 2. fetch info cuaca berdasarkan koordinat
        const dataPrediksi = await forecast(latitude, longitude);

        // 3. kirim response sukses ke browser (frontend JS akan baca ini)
        res.send({
            lokasi: location,
            latitude,
            longitude,
            prediksiCuaca: dataPrediksi.teks,
            detail: dataPrediksi
        });

    } catch (error) {
        console.error('FINAL API ERROR:', error.message);

        res.send({
            error: error.message || 'Terjadi kesalahan tidak terduga di server.'
        });
    }
});

// ====================================================================
// ROUTE 404
// ====================================================================

app.get('/bantuan/*', (req, res) => {
    res.render('404', {
        title: '404',
        judul: '404',
        nama: 'Aisyah Farhanah',
        pesanKesalahan: 'Artikel yang dicari tidak ditemukan.'
    });
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        judul: '404',
        nama: 'Aisyah Farhanah',
        pesanKesalahan: 'Halaman tidak ditemukan.'
    });
});

app.listen(port, () => {
    console.log('Server berjalan pada port ' + port);
});
