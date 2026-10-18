// 1. Inisialisasi Peta
const map = L.map('map').setView([1.3550, 109.3000], 9);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// FUNGSI PEWARNAAN OTOMATIS (STRING HASHING)
const colorPalette = [
    "#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231", 
    "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe", 
    "#008080", "#e6beff", "#9a6324", "#fffac8", "#800000",
    "#aaffc3", "#808000", "#ffd8b1", "#000075", "#a9a9a9",
    "#ff7f50", "#87cefa", "#ffd700", "#da70d6", "#32cd32",
    "#ff1493"
];
function getColorByName(name) {
    let hash = 0;
    if (!name || name.length === 0) return '#bdc3c7';
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colorPalette[Math.abs(hash) % colorPalette.length];
}

// MEMUAT DATA POLIGON ADMINISTRASI
fetch('assets/data/Kecamatan.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function(feature) {
                return {
                    color: "#2c3e50", weight: 1.5,
                    fillColor: getColorByName(feature.properties.NAMOBJ || ""),
                    fillOpacity: 0.4
                };
            },
            onEachFeature: function(feature, layer) {
                layer.bindTooltip(`<b>Kecamatan ${feature.properties.NAMOBJ || "Tidak Diketahui"}</b>`, { sticky: true });
            }
        }).addTo(map);
    });

// LOGIKA FILTER TITIK API
let allHotspotsData = null;
let hotspotLayerGroup = L.layerGroup().addTo(map); 

fetch('assets/data/Titik_Api.geojson')
    .then(response => response.json())
    .then(data => {
        allHotspotsData = data.features;
        buatFilterDinamis(allHotspotsData);
        perbaruiPetaHotspot();
    });

// Fungsi mengekstrak data unik & membuat checkbox di Sidebar
function buatFilterDinamis(features) {
    let listKecamatan = new Set();
    let listSatelit = new Set();
    let listKepercayaan = new Set();

    features.forEach(f => {
        const kec = f.properties.Kecamatan || f.properties.KECAMATAN || "Tidak Diketahui";
        const sat = f.properties.Satelit || f.properties.SATELIT || "Tidak Diketahui";
        // Antisipasi beberapa nama kolom umum untuk Tingkat Kepercayaan
        const kep = f.properties.Confidence || f.properties.CONFIDENCE || f.properties.Tingkat_Kepercayaan || f.properties.Kepercayaan || "Tidak Diketahui";
        
        listKecamatan.add(kec);
        listSatelit.add(sat);
        listKepercayaan.add(kep);
    });

    const divKec = document.getElementById('filter-kecamatan');
    const divSat = document.getElementById('filter-satelit');
    const divKep = document.getElementById('filter-kepercayaan');

    // Buat checkbox Tingkat Kepercayaan
    Array.from(listKepercayaan).sort().forEach(kep => {
        divKep.innerHTML += `
            <label class="checkbox-item">
                <input type="checkbox" value="${kep}" class="cb-kepercayaan" checked onchange="perbaruiPetaHotspot()"> ${kep}
            </label>`;
    });

    // Buat checkbox Satelit
    Array.from(listSatelit).sort().forEach(sat => {
        divSat.innerHTML += `
            <label class="checkbox-item">
                <input type="checkbox" value="${sat}" class="cb-satelit" checked onchange="perbaruiPetaHotspot()"> ${sat}
            </label>`;
    });

    // Buat checkbox Kecamatan (diurutkan sesuai abjad)
    Array.from(listKecamatan).sort().forEach(kec => {
        divKec.innerHTML += `
            <label class="checkbox-item">
                <input type="checkbox" value="${kec}" class="cb-kecamatan" checked onchange="perbaruiPetaHotspot()"> ${kec}
            </label>`;
    });

    // Pasang Event Listener ke input tanggal
    document.getElementById('filter-start-date').addEventListener('change', perbaruiPetaHotspot);
    document.getElementById('filter-end-date').addEventListener('change', perbaruiPetaHotspot);
}

// Fungsi menyaring data dan menggambar ulang titik di peta
function perbaruiPetaHotspot() {
    hotspotLayerGroup.clearLayers();

    // Ambil nilai yang sedang dicentang/diisi
    const checkedKecamatan = Array.from(document.querySelectorAll('.cb-kecamatan:checked')).map(cb => cb.value);
    const checkedSatelit = Array.from(document.querySelectorAll('.cb-satelit:checked')).map(cb => cb.value);
    const checkedKepercayaan = Array.from(document.querySelectorAll('.cb-kepercayaan:checked')).map(cb => cb.value);
    const startDate = document.getElementById('filter-start-date').value;
    const endDate = document.getElementById('filter-end-date').value;

    // Proses penyaringan (Filtering)
    const dataTersaring = allHotspotsData.filter(f => {
        const kec = f.properties.Kecamatan || f.properties.KECAMATAN || "Tidak Diketahui";
        const sat = f.properties.Satelit || f.properties.SATELIT || "Tidak Diketahui";
        const kep = f.properties.Confidence || f.properties.CONFIDENCE || f.properties.Tingkat_Kepercayaan || f.properties.Kepercayaan || "Tidak Diketahui";
        const tglStr = f.properties.Tanggal || f.properties.TANGGAL || "";

        // Syarat Filter Checkbox
        const lolosKecamatan = checkedKecamatan.includes(kec);
        const lolosSatelit = checkedSatelit.includes(sat);
        const lolosKepercayaan = checkedKepercayaan.includes(kep);
        
        // Syarat Filter Rentang Tanggal
        let lolosTanggal = true;
        if (tglStr && (startDate || endDate)) {
            const tglData = new Date(tglStr);
            if (startDate && tglData < new Date(startDate)) lolosTanggal = false;
            if (endDate && tglData > new Date(endDate)) lolosTanggal = false;
        }

        return lolosKecamatan && lolosSatelit && lolosKepercayaan && lolosTanggal;
    });

    // Gambar ulang data yang sudah disaring ke peta
    L.geoJSON(dataTersaring, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                pane: 'markerPane', radius: 6, fillColor: "#e74c3c", color: "#c0392b", weight: 1, opacity: 1, fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            const lat = feature.properties.Latitude || "-";
            const lng = feature.properties.Longitude || "-";
            const kec = feature.properties.Kecamatan || "-";
            const desa = feature.properties.Desa || "-";
            const tgl = feature.properties.Tanggal || "-";
            const wkt = feature.properties.Waktu || "-";
            const sat = feature.properties.Satelit || "-";
            const kep = feature.properties.Confidence || "-";

            layer.bindPopup(`
                <div class="hotspot-popup">
                    <h4>🔥 Titik Api (Hotspot)</h4>
                    <hr>
                    <p><b>Kecamatan:</b> ${kec}</p>
                    <p><b>Desa:</b> ${desa}</p>
                    <p><b>Tingkat Kepercayaan:</b> ${kep}</p>
                    <p><b>Tanggal:</b> ${tgl}</p>
                    <p><b>Waktu:</b> ${wkt}</p>
                    <p><b>Satelit:</b> ${sat}</p>
                    <p><b>Koordinat:</b> ${lat}, ${lng}</p>
                </div>
            `);
        }
    }).addTo(hotspotLayerGroup);
}