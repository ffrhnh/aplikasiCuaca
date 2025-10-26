const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode') 
const forecast = require('./utils/prediksiCuaca')
require('dotenv').config();
const axios = require('axios'); // kita pakai axios buat HTTP call

const app = express();
const port = process.env.PORT || 4000

console.log('MAP sekarang adalah:', process.env.MAP)

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

// halaman utama
app.get('', (req, res) => {
    res.render('index', {
        judul: 'Aplikasi Cek Cuaca',
        nama: 'Aisyah Farhanah'
    })
})

// HALAMAN BARU: Berita
app.get('/berita', async (req, res) => {
    const API_KEY_VALUE = '12ff93a43ec22bac95f6fbbb8cfc499b'; 
    
    // 2. PERBAIKAN ENDPOINT (Menggunakan variabel API_KEY_VALUE dengan benar)
    const endpoint = `https://api.mediastack.com/v1/news?access_key=${API_KEY_VALUE}&languages=en&limit=10&`;

    try {
        // Menggunakan axios yang sudah Anda impor di atas
        const response = await axios.get(endpoint);
        const data = response.data; // Axios otomatis mengurai JSON ke .data

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

// ... (Sisa kode app.js tetap sama) ...
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

// endpoint infoCuaca (API JSON)
app.get('/infoCuaca', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Kamu harus memasukan lokasi yang ingin dicari'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, dataPrediksi) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                prediksiCuaca: dataPrediksi,
                lokasi: location,
                address: req.query.address
            })
        })
    })
})

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