const path = require('path')
const express = require('express')
const hbs = require('hbs')
const axios = require('axios'); // kita pakai axios buat HTTP call
const geocode = require('./utils/geocode') 
const forecast = require('./utils/prediksiCuaca')
// Pastikan file .env dimuat di awal file
require('dotenv').config(); 

const app = express();
const port = process.env.PORT || 4000

// Kunci utama untuk mendebug (akan menunjukkan nilai dari .env atau hosting)
console.log('MAP sekarang adalah:', process.env.MAP)

// ====================================================================
// FUNGSI PEMBANTU (Helper)
// Mengubah fungsi forecast berbasis callback menjadi Promise berbasis async/await
// ====================================================================

const forecastPromise = (latitude, longitude) => {
    return new Promise((resolve, reject) => {
        forecast(latitude, longitude, (error, dataPrediksi) => {
            if (error) {
                return reject(new Error(error)); // Bungkus error agar ditangkap catch
            }
            resolve(dataPrediksi);
        });
    });
};

// ====================================================================
// KONFIGURASI EXPRESS
// ====================================================================

// Jalur untuk folder 'public' (static assets)
const direktoriPublic = path.join(__dirname, '../public') 

// Jalur untuk folder 'views' (templates)
const direktoriViews = path.join(__dirname, '../templates/views') 

// Jalur untuk folder 'partials' (Reusable HTML parts)
const direktoriPartials = path.join(__dirname, '../templates/partials')

// setup handlebars engine dan lokasi folder views
app.set('view engine', 'hbs')
app.set('views', direktoriViews)
hbs.registerPartials(direktoriPartials)

// setup direktori statis
app.use(express.static(direktoriPublic))

// ====================================================================
// ROUTE HANDLERS
// ====================================================================

// halaman utama
app.get('', (req, res) => {
    res.render('index', {
        judul: 'Aplikasi Cek Cuaca',
        nama: 'Aisyah Farhanah'
    })
})

// HALAMAN: Berita
app.get('/berita', async (req, res) => {
    // Gunakan process.env.MEDIASTACK_KEY
    const API_KEY_VALUE = process.env.MEDIASTACK_KEY || '12ff93a43ec22bac95f6fbbb8cfc499b'; 
    
    const endpoint = `https://api.mediastack.com/v1/news?access_key=${API_KEY_VALUE}&languages=en&limit=10`;

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
        
        res.render('berita', {
            judul: 'Berita Terkini',
            articles: data.data // Array berita dari Mediastack
        });

    } catch (e) {
        console.error('Network Fetch Error:', e.message);
        res.render('berita', {
            judul: 'Berita Terkini',
            error: 'Gagal terhubung ke layanan berita. (Cek koneksi internet/HTTPS/kunci API).'
        });
    }
});

// halaman bantuan
app.get('/bantuan', (req, res) => {
    res.render('bantuan', {
        judul: 'Halaman Bantuan',
        nama: 'Aisyah Farhanah',
        teksBantuan: 'ini adalah teks bantuan'
    })
})

// halaman tentang
app.get('/tentang', (req, res) => {
    res.render('tentang', {
        judul: 'Tentang Saya',
        nama: 'Aisyah Farhanah'
    })
})

// endpoint infoCuaca (API JSON) - PERBAIKAN UTAMA
app.get('/infoCuaca', async (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Kamu harus memasukan lokasi yang ingin dicari'
        });
    }
    
    const address = req.query.address;

    try {
        // 1. Ambil data Geocoding (menggunakan fungsi geocode yang sudah diubah menjadi async/await)
        // Pastikan geocode.js Anda menggunakan async/await dan melempar error
        const { latitude, longitude, location } = await geocode(address);

        // 2. Ambil data Prediksi Cuaca (menggunakan Promise Helper)
        const dataPrediksi = await forecastPromise(latitude, longitude);

        // 3. Kirim respons sukses
        res.send({
            prediksiCuaca: dataPrediksi,
            lokasi: location,
            address: address
        });

    } catch (error) {
        // Tangani semua error dari geocode atau forecast
        console.error('FINAL API ERROR:', error.message);
        res.send({
            error: error.message || 'Terjadi kesalahan tidak terduga di server.'
        });
    }
});

// khusus bantuan/*
app.get('/bantuan/*', (req, res) => {
    res.render('404', {
        title: '404',
        judul: '404',
        nama: 'Aisyah Farhanah',
        pesanKesalahan: 'Artikel yang dicari tidak ditemukan.'
    })
})

// fallback semua route lain
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        judul: '404',
        nama: 'Aisyah Farhanah',
        pesanKesalahan: 'Halaman tidak ditemukan.'
    })
})

app.listen(port, () => {
    console.log('Server berjalan pada port '+ port)
})