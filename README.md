# WebGIS Persebaran Titik Api Kabupaten Sambas

WebGIS untuk memvisualisasikan persebaran titik api (hotspot) di Kabupaten Sambas pada peta interaktif berbasis Leaflet.

## Sumber dan Periode Data

Data kebakaran yang digunakan dalam aplikasi ini diambil dari **SiPongi** dan mencakup rentang waktu:

**1 Juli 2026 - 7 September 2026**

Data disimpan dalam format GeoJSON dan digunakan untuk menampilkan titik hotspot beserta informasi terkait, seperti:

- Kecamatan
- Desa
- Tingkat kepercayaan
- Tanggal
- Waktu
- Tipe satelit
- Koordinat

## Fitur

- Menampilkan peta Kabupaten Sambas menggunakan Leaflet.
- Menampilkan batas administrasi kecamatan.
- Menampilkan titik api pada peta.
- Filter berdasarkan rentang tanggal.
- Filter berdasarkan tingkat kepercayaan.
- Filter berdasarkan tipe satelit.
- Filter berdasarkan kecamatan.
- Popup informasi pada setiap titik api.
- Pewarnaan otomatis pada wilayah kecamatan.

## Teknologi

- HTML5
- CSS3
- JavaScript ES Modules
- Leaflet 1.9.4
- GeoJSON
- OpenStreetMap

## Struktur Proyek

```text
persebaran_titik_api/
├── index.html
├── README.md
│
├── assets/
│   ├── css/
│   │   └── style.css
│   │
│   ├── data/
│   │   ├── Hotspot.geojson
│   │   ├── Kecamatan.geojson
│   │   └── Titik_Api.geojson
│   │
│   └── js/
│       ├── app.js
│       ├── config.js
│       ├── data.js
│       ├── filters.js
│       ├── map.js
│       └── ui.js
```

### Penjelasan Modul JavaScript

- `app.js`  
  Entry point aplikasi dan pengatur alur inisialisasi.
- `config.js`  
  Konfigurasi peta dan lokasi file data.
- `data.js`  
  Memuat serta memvalidasi data GeoJSON.
- `filters.js`  
  Menangani normalisasi data dan penyaringan hotspot.
- `map.js`  
  Mengatur peta Leaflet, layer kecamatan, dan layer titik api.
- `ui.js`  
  Mengatur checkbox filter, input tanggal, popup, dan pesan error.

## Cara Menjalankan

### Menggunakan XAMPP

1. Pastikan XAMPP sudah terpasang.
2. Letakkan folder proyek di direktori `htdocs`:

   ```text
   C:\xampp\htdocs\persebaran_titik_api
   ```

3. Jalankan modul **Apache** melalui XAMPP Control Panel.
4. Buka alamat berikut pada browser:

   ```text
   http://localhost/persebaran_titik_api/
   ```

Data GeoJSON perlu dimuat melalui web server karena aplikasi menggunakan `fetch()`. Membuka `index.html` secara langsung melalui skema `file://` dapat menyebabkan pembatasan akses browser.

## Data GeoJSON

File data berada di direktori `assets/data/`.

- `Titik_Api.geojson`  
  Data titik kebakaran/hotspot yang ditampilkan dan difilter pada peta.
- `Kecamatan.geojson`  
  Data batas wilayah kecamatan untuk layer administrasi.
- `Hotspot.geojson`  
  Dataset hotspot tambahan atau sumber data yang tersedia dalam proyek.

Apabila struktur atribut data diperbarui, penyesuaian dapat dilakukan pada modul [filters.js](assets/js/filters.js) dan [ui.js](assets/js/ui.js).

## Catatan Penggunaan

- Filter checkbox secara default aktif untuk seluruh nilai yang tersedia.
- Filter tanggal dapat digunakan dengan hanya mengisi tanggal awal, hanya tanggal akhir, atau keduanya.
- Perubahan pada file GeoJSON akan langsung digunakan saat halaman dimuat ulang.
- Layer peta menggunakan tile OpenStreetMap dan mengikuti atribusi yang ditampilkan pada peta.

## Lisensi dan Atribusi

Proyek ini menggunakan:

- Leaflet, dengan lisensi open source.
- OpenStreetMap sebagai sumber tile peta.
- Data kebakaran dari SiPongi untuk periode **1 Juli 2026 - 7 September 2026**.

Pastikan penggunaan dan distribusi data tetap mengikuti ketentuan dan atribusi dari sumber data masing-masing.
