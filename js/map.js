/**
 * SIAGA GEMPA - Map Module (FIXED)
 * Perbaikan:
 * 1. Ganti tile URL ke OpenStreetMap standar (bekerja tanpa CDN khusus)
 * 2. Tambah map.invalidateSize() setelah init untuk fix ukuran container
 * 3. Data gempa di-embed langsung sebagai GEMPA_DATA const (tidak fetch)
 *    sehingga berjalan 100% dari file:// maupun localhost
 * 4. Fallback tile OSM jika tile utama gagal dimuat
 */

// ─────────────────────────────────────────────────────────────────────────────
// DATA GEMPA INLINE (tidak bergantung fetch/CORS/server)
// ─────────────────────────────────────────────────────────────────────────────
const GEMPA_DATA = [
  {
    id: 1, nama: 'Sesar Lembang', provinsi: 'Jawa Barat',
    lat: -6.795, lng: 107.612, magnitudo_max: 6.8, tingkat: 'tinggi',
    deskripsi: 'Sesar aktif sepanjang ~29 km di utara Bandung. Berpotensi menghasilkan gempa M6.5–6.8 yang dapat berdampak besar pada Kota Bandung.',
    populasi_terdampak: '±2.4 Juta Jiwa', terakhir_aktif: '2011'
  },
  {
    id: 2, nama: 'Sesar Opak', provinsi: 'DI Yogyakarta',
    lat: -7.887, lng: 110.412, magnitudo_max: 6.3, tingkat: 'tinggi',
    deskripsi: 'Sesar Opak adalah penyebab gempa Yogyakarta 2006 berkekuatan M6.3 yang menewaskan lebih dari 5.700 orang.',
    populasi_terdampak: '±1.2 Juta Jiwa', terakhir_aktif: '2006'
  },
  {
    id: 3, nama: 'Zona Subduksi Sunda Megathrust', provinsi: 'Banten / Jawa Barat',
    lat: -7.5, lng: 105.5, magnitudo_max: 9.0, tingkat: 'ekstrem',
    deskripsi: 'Segmen megathrust paling berbahaya di selatan Jawa. Berpotensi memicu gempa >M9 dan tsunami besar yang dapat mempengaruhi pesisir selatan Jawa hingga Jakarta.',
    populasi_terdampak: '±30 Juta Jiwa', terakhir_aktif: '1994'
  },
  {
    id: 4, nama: 'Sesar Palu-Koro', provinsi: 'Sulawesi Tengah',
    lat: -0.9, lng: 119.85, magnitudo_max: 7.5, tingkat: 'ekstrem',
    deskripsi: 'Salah satu sesar paling aktif di Indonesia. Gempa M7.5 tahun 2018 menyebabkan tsunami dan likuefaksi dahsyat di Kota Palu, menewaskan >4.300 jiwa.',
    populasi_terdampak: '±400 Ribu Jiwa', terakhir_aktif: '2018'
  },
  {
    id: 5, nama: 'Subduksi Selat Sunda', provinsi: 'Lampung / Banten',
    lat: -6.9, lng: 104.8, magnitudo_max: 8.5, tingkat: 'ekstrem',
    deskripsi: 'Zona subduksi di Selat Sunda yang berpotensi memicu gempa besar dan tsunami. Wilayah Lampung Selatan dan Pandeglang masuk zona bahaya tinggi.',
    populasi_terdampak: '±5 Juta Jiwa', terakhir_aktif: '2018'
  },
  {
    id: 6, nama: 'Sesar Sorong', provinsi: 'Papua Barat',
    lat: -0.86, lng: 131.25, magnitudo_max: 7.8, tingkat: 'ekstrem',
    deskripsi: 'Sesar geser terbesar di Papua yang membentang ratusan kilometer. Salah satu zona tektonik paling aktif di dunia.',
    populasi_terdampak: '±300 Ribu Jiwa', terakhir_aktif: '2020'
  },
  {
    id: 7, nama: 'Sesar Matano', provinsi: 'Sulawesi Selatan',
    lat: -2.45, lng: 121.35, magnitudo_max: 6.5, tingkat: 'tinggi',
    deskripsi: 'Sesar aktif yang melintas di wilayah Sorowako dan Danau Matano, Sulawesi Selatan. Berpotensi menimbulkan gempa merusak.',
    populasi_terdampak: '±150 Ribu Jiwa', terakhir_aktif: '2015'
  },
  {
    id: 8, nama: 'Subduksi Banda', provinsi: 'Maluku',
    lat: -6.0, lng: 127.0, magnitudo_max: 8.5, tingkat: 'ekstrem',
    deskripsi: 'Zona subduksi kompleks di Laut Banda, Maluku. Memiliki riwayat gempa besar berulang dan potensi tsunami regional.',
    populasi_terdampak: '±800 Ribu Jiwa', terakhir_aktif: '2019'
  },
  {
    id: 9, nama: 'Zona Subduksi Flores', provinsi: 'NTT',
    lat: -8.5, lng: 122.0, magnitudo_max: 7.8, tingkat: 'tinggi',
    deskripsi: 'Zona subduksi di bagian utara Flores NTT. Gempa M7.8 pada 1992 memicu tsunami yang menewaskan lebih dari 2.500 jiwa di Flores.',
    populasi_terdampak: '±1 Juta Jiwa', terakhir_aktif: '2021'
  },
  {
    id: 10, nama: 'Sesar Cimandiri', provinsi: 'Jawa Barat',
    lat: -6.95, lng: 106.95, magnitudo_max: 6.2, tingkat: 'tinggi',
    deskripsi: 'Sesar aktif yang memanjang dari Pelabuhan Ratu hingga Padalarang. Diduga terkait dengan gempa Cianjur M5.6 tahun 2022.',
    populasi_terdampak: '±600 Ribu Jiwa', terakhir_aktif: '2022'
  },
  {
    id: 11, nama: 'Subduksi Aceh - Andaman', provinsi: 'Aceh',
    lat: 4.5, lng: 95.0, magnitudo_max: 9.3, tingkat: 'ekstrem',
    deskripsi: 'Lokasi gempa dan tsunami Samudra Hindia 2004 berkekuatan M9.3 — salah satu bencana alam paling mematikan dalam sejarah dengan korban >220.000 jiwa.',
    populasi_terdampak: '±5 Juta Jiwa', terakhir_aktif: '2004'
  },
  {
    id: 12, nama: 'Sesar Semangko (Sumatera)', provinsi: 'Sumatera',
    lat: 3.5, lng: 98.5, magnitudo_max: 7.7, tingkat: 'ekstrem',
    deskripsi: 'Sesar besar Sumatera yang membelah Pulau Sumatera dari Aceh hingga Lampung sepanjang ±1.900 km. Sangat aktif secara seismik.',
    populasi_terdampak: '±55 Juta Jiwa', terakhir_aktif: '2022'
  },
  {
    id: 13, nama: 'Zona Subduksi Jawa Tengah', provinsi: 'Jawa Tengah',
    lat: -9.0, lng: 110.5, magnitudo_max: 7.3, tingkat: 'tinggi',
    deskripsi: 'Zona subduksi di selatan Jawa Tengah. Beberapa segmennya belum pernah melepaskan energi sejak berabad-abad lalu.',
    populasi_terdampak: '±15 Juta Jiwa', terakhir_aktif: '2006'
  },
  {
    id: 14, nama: 'Zona Subduksi Timor', provinsi: 'NTT / NTB',
    lat: -10.0, lng: 124.5, magnitudo_max: 8.0, tingkat: 'tinggi',
    deskripsi: 'Zona tumbukan lempeng di selatan Timor dan Sumbawa. Berpotensi memicu gempa besar dan tsunami di pesisir NTT dan NTB.',
    populasi_terdampak: '±3 Juta Jiwa', terakhir_aktif: '2018'
  },
  {
    id: 15, nama: 'Sesar Naik Mamuju', provinsi: 'Sulawesi Barat',
    lat: -2.65, lng: 118.9, magnitudo_max: 6.2, tingkat: 'sedang',
    deskripsi: 'Sesar aktif di Mamuju yang menjadi penyebab gempa M6.2 pada Januari 2021, merusak ribuan rumah dan bangunan pemerintahan.',
    populasi_terdampak: '±280 Ribu Jiwa', terakhir_aktif: '2021'
  },
  {
    id: 16, nama: 'Sesar Jayapura', provinsi: 'Papua',
    lat: -2.55, lng: 140.7, magnitudo_max: 7.1, tingkat: 'tinggi',
    deskripsi: 'Zona sesar aktif di sekitar Jayapura, Papua. Dipengaruhi oleh interaksi kompleks lempeng Australia dan Pasifik.',
    populasi_terdampak: '±450 Ribu Jiwa', terakhir_aktif: '2023'
  },
  {
    id: 17, nama: 'Subduksi Mentawai', provinsi: 'Sumatera Barat',
    lat: -3.5, lng: 100.5, magnitudo_max: 8.8, tingkat: 'ekstrem',
    deskripsi: 'Segmen Mentawai diyakini sebagai "gempa yang menunggu" karena belum melepaskan energinya sejak 1797 dan 1833. Potensi M8.8+ dengan tsunami destruktif.',
    populasi_terdampak: '±5 Juta Jiwa (Padang)', terakhir_aktif: '2010'
  },
  {
    id: 18, nama: 'Zona Subduksi Sulawesi Utara', provinsi: 'Sulawesi Utara',
    lat: 1.5, lng: 125.0, magnitudo_max: 7.9, tingkat: 'tinggi',
    deskripsi: 'Zona subduksi aktif di perairan Sulawesi Utara. Manado dan sekitarnya berpotensi terdampak gempa besar dan tsunami dari arah laut.',
    populasi_terdampak: '±1.5 Juta Jiwa', terakhir_aktif: '2019'
  },
  {
    id: 19, nama: 'Sesar Kendeng', provinsi: 'Jawa Tengah / Jawa Timur',
    lat: -7.5, lng: 112.0, magnitudo_max: 6.5, tingkat: 'sedang',
    deskripsi: 'Sesar naik yang memanjang di bagian utara Jawa Tengah dan Jawa Timur. Diduga terkait dengan gempa Tuban dan beberapa gempa di Mojokerto.',
    populasi_terdampak: '±8 Juta Jiwa', terakhir_aktif: '2024'
  },
  {
    id: 20, nama: 'Sesar Baribis (Jakarta)', provinsi: 'DKI Jakarta / Jawa Barat',
    lat: -6.45, lng: 107.25, magnitudo_max: 6.5, tingkat: 'sedang',
    deskripsi: 'Sesar yang melintas di area metropolitan Jakarta. Potensi dampak sangat tinggi mengingat kepadatan penduduk dan infrastruktur kritis di Jakarta.',
    populasi_terdampak: '±30 Juta Jiwa', terakhir_aktif: '1834'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────────────────────────────────
let map         = null;
let markerLayer = null;
let gempaData   = [];

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const LEVEL_CONFIG = {
  ekstrem: { color: '#7c3aed', glow: 'rgba(124,58,237,0.5)', glowSize: 36, size: 22, pulseColor: 'rgba(124,58,237,0.25)', label: 'Ekstrem' },
  tinggi:  { color: '#ef4444', glow: 'rgba(239,68,68,0.45)',  glowSize: 30, size: 18, pulseColor: 'rgba(239,68,68,0.2)',   label: 'Tinggi'  },
  sedang:  { color: '#f97316', glow: 'rgba(249,115,22,0.4)',  glowSize: 26, size: 14, pulseColor: 'rgba(249,115,22,0.15)', label: 'Sedang'  },
  rendah:  { color: '#eab308', glow: 'rgba(234,179,8,0.35)',  glowSize: 22, size: 12, pulseColor: 'rgba(234,179,8,0.12)',  label: 'Rendah'  }
};

// ─────────────────────────────────────────────────────────────────────────────
// INISIALISASI PETA
// ─────────────────────────────────────────────────────────────────────────────
function initMap() {
  // Guard: pastikan elemen ada dan Leaflet sudah dimuat
  const mapEl = document.getElementById('map');
  if (!mapEl || typeof L === 'undefined') {
    console.error('Leaflet belum dimuat atau elemen #map tidak ditemukan!');
    return;
  }

  // Guard: jangan inisialisasi ulang jika sudah ada
  if (map !== null) return;

  // ── Buat instance peta ────────────────────────────────────────────────────
  map = L.map('map', {
    center: [-2.5, 118.0],
    zoom: 5,
    zoomControl: false,        // kita buat sendiri di posisi bottomright
    attributionControl: true,
    preferCanvas: true         // render marker via Canvas → lebih cepat & stabil
  });

  // ── Tile Layer Utama: OpenStreetMap standar (100% gratis, tanpa API key) ──
  // FIX: CartoDB memerlukan referrer tertentu; OSM tidak.
  const osmTile = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      maxZoom: 19,
      subdomains: 'abc'
    }
  );

  // ── Tile Layer Alternatif: OSM dengan tema gelap (CARTO, tanpa {r}) ───────
  const cartoTile = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_matter_all/{z}/{x}/{y}.png',
    {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19,
      subdomains: 'abcd'
    }
  );

  // Coba CARTO dark dulu, fallback ke OSM jika gagal
  cartoTile.addTo(map);
  cartoTile.on('tileerror', function() {
    // Hapus carto jika error, pasang OSM standar
    map.removeLayer(cartoTile);
    if (!map.hasLayer(osmTile)) {
      osmTile.addTo(map);
    }
  });

  // ── Zoom control di kanan bawah ───────────────────────────────────────────
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // ── Layer group untuk semua marker ───────────────────────────────────────
  markerLayer = L.layerGroup().addTo(map);

  // ── FIX KRITIS: invalidateSize() memaksa Leaflet recalculate ukuran ───────
  // Diperlukan jika container peta sempat display:none atau belum final size
  setTimeout(function() {
    map.invalidateSize({ animate: false });
  }, 100);

  // Panggil lagi setelah semua aset selesai
  window.addEventListener('load', function() {
    if (map) map.invalidateSize({ animate: false });
  });

  // ── Load data gempa (inline, tanpa fetch) ────────────────────────────────
  gempaData = GEMPA_DATA;
  renderMarkers(gempaData);
  updateCounters();

  // Coba juga fetch JSON (jika pakai server); tidak akan error jika gagal
  tryFetchGempaData();
}

// ─────────────────────────────────────────────────────────────────────────────
// FETCH JSON (opsional, hanya berjalan jika ada HTTP server)
// ─────────────────────────────────────────────────────────────────────────────
function tryFetchGempaData() {
  fetch('./data/gempaterkini.json')
    .then(function(r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(data) {
      if (data && Array.isArray(data.gempa_rawan) && data.gempa_rawan.length > 0) {
        gempaData = data.gempa_rawan;
        renderMarkers(gempaData);   // re-render dengan data JSON (lebih lengkap)
        if (data.statistik) updateCounters(data.statistik);
      }
    })
    .catch(function() {
      // Senyap: data inline sudah dipakai sebagai fallback
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOM SVG MARKER ICON
// ─────────────────────────────────────────────────────────────────────────────
function createCustomIcon(tingkat) {
  const cfg   = LEVEL_CONFIG[tingkat] || LEVEL_CONFIG.sedang;
  const total = cfg.size + cfg.glowSize;
  const cx    = total / 2;

  const svgHtml = [
    '<svg width="' + total + '" height="' + total + '"',
    ' viewBox="0 0 ' + total + ' ' + total + '"',
    ' xmlns="http://www.w3.org/2000/svg">',
    '<circle cx="' + cx + '" cy="' + cx + '" r="' + (total / 2 - 2) + '"',
    ' fill="' + cfg.pulseColor + '"/>',
    '<circle cx="' + cx + '" cy="' + cx + '" r="' + (cfg.size / 2 + 8) + '"',
    ' fill="' + cfg.glow + '"/>',
    '<circle cx="' + cx + '" cy="' + cx + '" r="' + (cfg.size / 2) + '"',
    ' fill="' + cfg.color + '"/>',
    '<circle cx="' + (cx - 2) + '" cy="' + (cx - 2) + '" r="' + (cfg.size / 4) + '"',
    ' fill="rgba(255,255,255,0.35)"/>',
    '</svg>'
  ].join('');

  return L.divIcon({
    html:        '<div class="sg-marker" data-level="' + tingkat + '">' + svgHtml + '</div>',
    className:   '',
    iconSize:    [total, total],
    iconAnchor:  [total / 2, total / 2],
    popupAnchor: [0, -(total / 2 + 4)]
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// POPUP CONTENT
// ─────────────────────────────────────────────────────────────────────────────
function createPopupContent(g) {
  const cfg = LEVEL_CONFIG[g.tingkat] || LEVEL_CONFIG.sedang;
  return '<div class="popup-inner">'
    + '<span class="popup-badge ' + g.tingkat + '">' + cfg.label + '</span>'
    + '<div class="popup-title">' + g.nama + '</div>'
    + '<div class="popup-prov">'
    + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">'
    + '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>'
    + '<circle cx="12" cy="10" r="3"/></svg>'
    + g.provinsi
    + '</div>'
    + '<div class="popup-desc">' + g.deskripsi + '</div>'
    + '<div class="popup-stats">'
    + '<div class="popup-stat"><div class="label">Magnitudo Maks</div><div class="value" style="color:' + cfg.color + '">M ' + g.magnitudo_max + '</div></div>'
    + '<div class="popup-stat"><div class="label">Populasi Terdampak</div><div class="value">' + g.populasi_terdampak + '</div></div>'
    + '<div class="popup-stat"><div class="label">Terakhir Aktif</div><div class="value">' + g.terakhir_aktif + '</div></div>'
    + '<div class="popup-stat"><div class="label">Tingkat Bahaya</div><div class="value" style="color:' + cfg.color + '">' + cfg.label + '</div></div>'
    + '</div></div>';
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDER MARKERS
// ─────────────────────────────────────────────────────────────────────────────
function renderMarkers(data) {
  if (!markerLayer) return;
  markerLayer.clearLayers();

  data.forEach(function(g) {
    var icon   = createCustomIcon(g.tingkat);
    var marker = L.marker([g.lat, g.lng], { icon: icon });

    marker.bindPopup(createPopupContent(g), {
      className:   'custom-popup',
      maxWidth:    320,
      closeButton: true
    });

    marker.addTo(markerLayer);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE COUNTER STATS
// ─────────────────────────────────────────────────────────────────────────────
function updateCounters(stat) {
  var total   = stat ? stat.total_zona_rawan : GEMPA_DATA.length;
  var ekstrem = stat ? stat.zona_ekstrem     : GEMPA_DATA.filter(function(g){ return g.tingkat === 'ekstrem'; }).length;
  var tinggi  = stat ? stat.zona_tinggi      : GEMPA_DATA.filter(function(g){ return g.tingkat === 'tinggi';  }).length;

  var elTotal   = document.getElementById('stat-total-zona');
  var elEkstrem = document.getElementById('stat-ekstrem');
  var elTinggi  = document.getElementById('stat-tinggi');

  if (elTotal)   elTotal.textContent   = total;
  if (elEkstrem) elEkstrem.textContent = ekstrem;
  if (elTinggi)  elTinggi.textContent  = tinggi;
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER MARKERS (dipanggil dari HTML onclick)
// ─────────────────────────────────────────────────────────────────────────────
window.filterMarkers = function(level) {
  // Update chip styles
  document.querySelectorAll('.filter-chip').forEach(function(el) {
    el.classList.remove('active-all', 'active-ekstrem', 'active-tinggi', 'active-sedang');
  });
  var chip = document.querySelector('[data-filter="' + level + '"]');
  if (chip) {
    chip.classList.add(level === 'all' ? 'active-all' : 'active-' + level);
  }

  var filtered = level === 'all'
    ? gempaData
    : gempaData.filter(function(g) { return g.tingkat === level; });

  renderMarkers(filtered);
};

// ─────────────────────────────────────────────────────────────────────────────
// RESET VIEW
// ─────────────────────────────────────────────────────────────────────────────
window.resetMapView = function() {
  if (!map) return;
  map.flyTo([-2.5, 118.0], 5, { duration: 1.5 });
};

// ─────────────────────────────────────────────────────────────────────────────
// TOGGLE FULLSCREEN
// ─────────────────────────────────────────────────────────────────────────────
window.toggleFullscreen = function() {
  var el = document.getElementById('map');
  if (!el) return;
  if (!document.fullscreenElement) {
    el.requestFullscreen().then(function() {
      setTimeout(function() { map.invalidateSize(); }, 300);
    }).catch(function(err) { console.warn('Fullscreen gagal:', err); });
  } else {
    document.exitFullscreen();
    setTimeout(function() { map.invalidateSize(); }, 300);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ENTRY POINT — DOMContentLoaded
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  initMap();
});
