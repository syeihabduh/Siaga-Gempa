/**
 * SIAGA GEMPA — Map Module v2 (Dashboard Layout)
 * Skema 4 warna risiko + klik marker → slide-in sidebar
 * Tile: CartoDB Dark → fallback OSM
 */

// ─────────────────────────────────────────────────────────────────────────────
// DATA GEMPA INLINE
// ─────────────────────────────────────────────────────────────────────────────
const GEMPA_DATA = [
  { id:1,  nama:'Sesar Lembang',            provinsi:'Jawa Barat',            lat:-6.795, lng:107.612, magnitudo_max:6.8, tingkat:'tinggi',  deskripsi:'Sesar aktif sepanjang ~29 km di utara Bandung. Berpotensi menghasilkan gempa M6.5–6.8 yang dapat berdampak besar pada Kota Bandung.',                                            populasi_terdampak:'±2.4 Juta Jiwa',      terakhir_aktif:'2011' },
  { id:2,  nama:'Sesar Opak',               provinsi:'DI Yogyakarta',         lat:-7.887, lng:110.412, magnitudo_max:6.3, tingkat:'tinggi',  deskripsi:'Sesar Opak adalah penyebab gempa Yogyakarta 2006 berkekuatan M6.3 yang menewaskan lebih dari 5.700 orang.',                                                                    populasi_terdampak:'±1.2 Juta Jiwa',      terakhir_aktif:'2006' },
  { id:3,  nama:'Sunda Megathrust',         provinsi:'Banten / Jawa Barat',   lat:-7.5,   lng:105.5,   magnitudo_max:9.0, tingkat:'ekstrem', deskripsi:'Segmen megathrust paling berbahaya di selatan Jawa. Berpotensi memicu gempa >M9 dan tsunami besar yang dapat mempengaruhi pesisir selatan Jawa hingga Jakarta.',                   populasi_terdampak:'±30 Juta Jiwa',       terakhir_aktif:'1994' },
  { id:4,  nama:'Sesar Palu-Koro',          provinsi:'Sulawesi Tengah',       lat:-0.9,   lng:119.85,  magnitudo_max:7.5, tingkat:'ekstrem', deskripsi:'Salah satu sesar paling aktif di Indonesia. Gempa M7.5 tahun 2018 menyebabkan tsunami dan likuefaksi dahsyat di Kota Palu, menewaskan >4.300 jiwa.',                              populasi_terdampak:'±400 Ribu Jiwa',      terakhir_aktif:'2018' },
  { id:5,  nama:'Subduksi Selat Sunda',     provinsi:'Lampung / Banten',      lat:-6.9,   lng:104.8,   magnitudo_max:8.5, tingkat:'ekstrem', deskripsi:'Zona subduksi di Selat Sunda yang berpotensi memicu gempa besar dan tsunami. Wilayah Lampung Selatan dan Pandeglang masuk zona bahaya tinggi.',                                     populasi_terdampak:'±5 Juta Jiwa',        terakhir_aktif:'2018' },
  { id:6,  nama:'Sesar Sorong',             provinsi:'Papua Barat',           lat:-0.86,  lng:131.25,  magnitudo_max:7.8, tingkat:'ekstrem', deskripsi:'Sesar geser terbesar di Papua yang membentang ratusan kilometer. Salah satu zona tektonik paling aktif di dunia.',                                                               populasi_terdampak:'±300 Ribu Jiwa',      terakhir_aktif:'2020' },
  { id:7,  nama:'Sesar Matano',             provinsi:'Sulawesi Selatan',      lat:-2.45,  lng:121.35,  magnitudo_max:6.5, tingkat:'tinggi',  deskripsi:'Sesar aktif yang melintas di wilayah Sorowako dan Danau Matano, Sulawesi Selatan. Berpotensi menimbulkan gempa merusak.',                                                         populasi_terdampak:'±150 Ribu Jiwa',      terakhir_aktif:'2015' },
  { id:8,  nama:'Subduksi Banda',           provinsi:'Maluku',                lat:-6.0,   lng:127.0,   magnitudo_max:8.5, tingkat:'ekstrem', deskripsi:'Zona subduksi kompleks di Laut Banda, Maluku. Memiliki riwayat gempa besar berulang dan potensi tsunami regional.',                                                               populasi_terdampak:'±800 Ribu Jiwa',      terakhir_aktif:'2019' },
  { id:9,  nama:'Subduksi Flores',          provinsi:'NTT',                   lat:-8.5,   lng:122.0,   magnitudo_max:7.8, tingkat:'tinggi',  deskripsi:'Zona subduksi di bagian utara Flores NTT. Gempa M7.8 pada 1992 memicu tsunami yang menewaskan lebih dari 2.500 jiwa di Flores.',                                                  populasi_terdampak:'±1 Juta Jiwa',        terakhir_aktif:'2021' },
  { id:10, nama:'Sesar Cimandiri',          provinsi:'Jawa Barat',            lat:-6.95,  lng:106.95,  magnitudo_max:6.2, tingkat:'tinggi',  deskripsi:'Sesar aktif yang memanjang dari Pelabuhan Ratu hingga Padalarang. Diduga terkait dengan gempa Cianjur M5.6 tahun 2022.',                                                          populasi_terdampak:'±600 Ribu Jiwa',      terakhir_aktif:'2022' },
  { id:11, nama:'Subduksi Aceh-Andaman',    provinsi:'Aceh',                  lat:4.5,    lng:95.0,    magnitudo_max:9.3, tingkat:'ekstrem', deskripsi:'Lokasi gempa dan tsunami Samudra Hindia 2004 berkekuatan M9.3 — salah satu bencana alam paling mematikan dalam sejarah dengan korban >220.000 jiwa.',                              populasi_terdampak:'±5 Juta Jiwa',        terakhir_aktif:'2004' },
  { id:12, nama:'Sesar Semangko (Sumatra)', provinsi:'Sumatera',              lat:3.5,    lng:98.5,    magnitudo_max:7.7, tingkat:'ekstrem', deskripsi:'Sesar besar Sumatera yang membelah Pulau Sumatera dari Aceh hingga Lampung sepanjang ±1.900 km. Sangat aktif secara seismik.',                                                    populasi_terdampak:'±55 Juta Jiwa',       terakhir_aktif:'2022' },
  { id:13, nama:'Subduksi Jawa Tengah',     provinsi:'Jawa Tengah',           lat:-9.0,   lng:110.5,   magnitudo_max:7.3, tingkat:'tinggi',  deskripsi:'Zona subduksi di selatan Jawa Tengah. Beberapa segmennya belum pernah melepaskan energi sejak berabad-abad lalu.',                                                               populasi_terdampak:'±15 Juta Jiwa',       terakhir_aktif:'2006' },
  { id:14, nama:'Subduksi Timor',           provinsi:'NTT / NTB',             lat:-10.0,  lng:124.5,   magnitudo_max:8.0, tingkat:'tinggi',  deskripsi:'Zona tumbukan lempeng di selatan Timor dan Sumbawa. Berpotensi memicu gempa besar dan tsunami di pesisir NTT dan NTB.',                                                           populasi_terdampak:'±3 Juta Jiwa',        terakhir_aktif:'2018' },
  { id:15, nama:'Sesar Mamuju',             provinsi:'Sulawesi Barat',        lat:-2.65,  lng:118.9,   magnitudo_max:6.2, tingkat:'sedang',  deskripsi:'Sesar aktif di Mamuju yang menjadi penyebab gempa M6.2 pada Januari 2021, merusak ribuan rumah dan bangunan pemerintahan.',                                                       populasi_terdampak:'±280 Ribu Jiwa',      terakhir_aktif:'2021' },
  { id:16, nama:'Sesar Jayapura',           provinsi:'Papua',                 lat:-2.55,  lng:140.7,   magnitudo_max:7.1, tingkat:'tinggi',  deskripsi:'Zona sesar aktif di sekitar Jayapura, Papua. Dipengaruhi oleh interaksi kompleks lempeng Australia dan Pasifik.',                                                                 populasi_terdampak:'±450 Ribu Jiwa',      terakhir_aktif:'2023' },
  { id:17, nama:'Subduksi Mentawai',        provinsi:'Sumatera Barat',        lat:-3.5,   lng:100.5,   magnitudo_max:8.8, tingkat:'ekstrem', deskripsi:'Segmen Mentawai diyakini sebagai "gempa yang menunggu" karena belum melepaskan energinya sejak 1797 dan 1833. Potensi M8.8+ dengan tsunami destruktif.',                           populasi_terdampak:'±5 Juta Jiwa (Padang)',terakhir_aktif:'2010' },
  { id:18, nama:'Subduksi Sulut',           provinsi:'Sulawesi Utara',        lat:1.5,    lng:125.0,   magnitudo_max:7.9, tingkat:'tinggi',  deskripsi:'Zona subduksi aktif di perairan Sulawesi Utara. Manado dan sekitarnya berpotensi terdampak gempa besar dan tsunami dari arah laut.',                                               populasi_terdampak:'±1.5 Juta Jiwa',      terakhir_aktif:'2019' },
  { id:19, nama:'Sesar Kendeng',            provinsi:'Jawa Tengah / Jatim',   lat:-7.5,   lng:112.0,   magnitudo_max:6.5, tingkat:'sedang',  deskripsi:'Sesar naik yang memanjang di bagian utara Jawa Tengah dan Jawa Timur. Diduga terkait dengan gempa Tuban dan Mojokerto.',                                                          populasi_terdampak:'±8 Juta Jiwa',        terakhir_aktif:'2024' },
  { id:20, nama:'Sesar Baribis (Jakarta)',  provinsi:'DKI Jakarta / Jawa Barat', lat:-6.45, lng:107.25, magnitudo_max:6.5, tingkat:'sedang', deskripsi:'Sesar yang melintas di area metropolitan Jakarta. Potensi dampak sangat tinggi mengingat kepadatan penduduk dan infrastruktur kritis di Jakarta.',                                populasi_terdampak:'±30 Juta Jiwa',       terakhir_aktif:'1834' }
];

// ─────────────────────────────────────────────────────────────────────────────
// SKEMA 4 WARNA RISIKO (Hijau / Kuning / Oranye / Merah)
// normal  = Aman / Normal
// rendah  = Risiko Rendah
// tinggi  = Risiko Tinggi
// ekstrem = Risiko Ekstrem
// ─────────────────────────────────────────────────────────────────────────────
const RISK_CONFIG = {
  normal:  {
    cssClass: 'risk-normal',
    color:    '#22c55e',
    glow:     'rgba(34,197,94,0.45)',
    pulseColor:'rgba(34,197,94,0.2)',
    glowSize: 22, size: 12,
    label:    'Normal / Aman',
    meterPct: 15,
    icon:     '🟢',
    filterCls:'f-normal'
  },
  rendah:  {
    cssClass: 'risk-rendah',
    color:    '#eab308',
    glow:     'rgba(234,179,8,0.45)',
    pulseColor:'rgba(234,179,8,0.2)',
    glowSize: 26, size: 14,
    label:    'Risiko Rendah',
    meterPct: 35,
    icon:     '🟡',
    filterCls:'f-rendah'
  },
  sedang:  {   // mapped → tinggi in display
    cssClass: 'risk-tinggi',
    color:    '#f97316',
    glow:     'rgba(249,115,22,0.45)',
    pulseColor:'rgba(249,115,22,0.2)',
    glowSize: 30, size: 18,
    label:    'Risiko Tinggi',
    meterPct: 65,
    icon:     '🟠',
    filterCls:'f-tinggi'
  },
  tinggi:  {   // mapped → tinggi
    cssClass: 'risk-tinggi',
    color:    '#f97316',
    glow:     'rgba(249,115,22,0.45)',
    pulseColor:'rgba(249,115,22,0.2)',
    glowSize: 30, size: 18,
    label:    'Risiko Tinggi',
    meterPct: 65,
    icon:     '🟠',
    filterCls:'f-tinggi'
  },
  ekstrem: {
    cssClass: 'risk-ekstrem',
    color:    '#ef4444',
    glow:     'rgba(239,68,68,0.5)',
    pulseColor:'rgba(239,68,68,0.25)',
    glowSize: 36, size: 22,
    label:    'Risiko Ekstrem',
    meterPct: 100,
    icon:     '🔴',
    filterCls:'f-ekstrem'
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────────────────────────────────
var map             = null;
var markerLayer     = null;
var gempaData       = [];
var activeFilter    = 'all';
var activeSidebarId = null;

// ─────────────────────────────────────────────────────────────────────────────
// INIT MAP
// ─────────────────────────────────────────────────────────────────────────────
function initMap() {
  var mapEl = document.getElementById('map');
  if (!mapEl || typeof L === 'undefined') {
    console.error('[SiagaGempa] Leaflet atau #map tidak ditemukan.');
    return;
  }
  if (map !== null) return;

  map = L.map('map', {
    center: [-2.5, 118.0],
    zoom: 5,
    zoomControl: false,
    attributionControl: true,
    preferCanvas: false   // SVG mode untuk popup yang lebih baik
  });

  // ── Tile: CartoDB Dark (tanpa {r}) → fallback OSM ────────────────────────
  var cartoTile = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_matter_all/{z}/{x}/{y}.png',
    { attribution: '&copy; OSM contributors &copy; CARTO', maxZoom: 19, subdomains: 'abcd' }
  );
  var osmTile = L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { attribution: '&copy; OpenStreetMap contributors', maxZoom: 19 }
  );

  cartoTile.addTo(map);
  cartoTile.on('tileerror', function() {
    if (map.hasLayer(cartoTile)) map.removeLayer(cartoTile);
    if (!map.hasLayer(osmTile))  osmTile.addTo(map);
  });

  L.control.zoom({ position: 'bottomright' }).addTo(map);
  markerLayer = L.layerGroup().addTo(map);

  // ── invalidateSize: forza recalculate dopo il render ─────────────────────
  setTimeout(function() { map.invalidateSize({ animate: false }); }, 150);
  window.addEventListener('load', function() { if (map) map.invalidateSize({ animate: false }); });

  // ── Load data ─────────────────────────────────────────────────────────────
  gempaData = GEMPA_DATA;
  renderMarkers(gempaData);
  updatePetaStats();
  tryFetchGempaData();
}

// ─────────────────────────────────────────────────────────────────────────────
// OPTIONAL FETCH
// ─────────────────────────────────────────────────────────────────────────────
function tryFetchGempaData() {
  fetch('./data/gempaterkini.json')
    .then(function(r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function(data) {
      if (data && Array.isArray(data.gempa_rawan) && data.gempa_rawan.length > 0) {
        gempaData = data.gempa_rawan;
        filterMarkers(activeFilter, true);
      }
    })
    .catch(function() { /* silent fallback */ });
}

// ─────────────────────────────────────────────────────────────────────────────
// CREATE SVG MARKER ICON
// ─────────────────────────────────────────────────────────────────────────────
function createMarkerIcon(tingkat) {
  var cfg   = RISK_CONFIG[tingkat] || RISK_CONFIG.tinggi;
  var total = cfg.size + cfg.glowSize;
  var cx    = total / 2;

  var svg = [
    '<svg width="' + total + '" height="' + total + '" viewBox="0 0 ' + total + ' ' + total + '" xmlns="http://www.w3.org/2000/svg">',
    '<circle cx="' + cx + '" cy="' + cx + '" r="' + (total/2 - 2) + '" fill="' + cfg.pulseColor + '"/>',
    '<circle cx="' + cx + '" cy="' + cx + '" r="' + (cfg.size/2 + 8) + '" fill="' + cfg.glow + '"/>',
    '<circle cx="' + cx + '" cy="' + cx + '" r="' + (cfg.size/2) + '" fill="' + cfg.color + '"/>',
    '<circle cx="' + (cx - 2) + '" cy="' + (cx - 2) + '" r="' + (cfg.size/4) + '" fill="rgba(255,255,255,0.35)"/>',
    '</svg>'
  ].join('');

  return L.divIcon({
    html:        '<div class="sg-marker" data-level="' + tingkat + '">' + svg + '</div>',
    className:   '',
    iconSize:    [total, total],
    iconAnchor:  [total/2, total/2],
    popupAnchor: [0, -(total/2 + 6)]
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// CREATE MINI POPUP CONTENT (on hover / click before sidebar opens)
// ─────────────────────────────────────────────────────────────────────────────
function createMiniPopup(g) {
  var cfg = RISK_CONFIG[g.tingkat] || RISK_CONFIG.tinggi;
  return '<div class="map-minipopup">'
    + '<span class="risk-badge ' + cfg.cssClass + '">' + cfg.label + '</span>'
    + '<div class="loc-name">' + g.nama + '</div>'
    + '<div class="loc-prov">📍 ' + g.provinsi + '</div>'
    + '<div class="click-hint" onclick="openSidebar(' + g.id + ')">'
    + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>'
    + 'Lihat Detail Lengkap'
    + '</div></div>';
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDER MARKERS
// ─────────────────────────────────────────────────────────────────────────────
function renderMarkers(data) {
  if (!markerLayer) return;
  markerLayer.clearLayers();

  data.forEach(function(g) {
    var icon   = createMarkerIcon(g.tingkat);
    var marker = L.marker([g.lat, g.lng], { icon: icon });

    // Mini popup bound to marker
    marker.bindPopup(createMiniPopup(g), {
      className:   'sg-popup',
      maxWidth:    240,
      closeButton: false,
      offset:      [0, -4]
    });

    // Click → open sidebar directly
    marker.on('click', function() {
      marker.openPopup();
      openSidebar(g.id);
    });

    marker.addTo(markerLayer);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE PETA STATS (top bar)
// ─────────────────────────────────────────────────────────────────────────────
function updatePetaStats() {
  var total   = gempaData.length;
  var ekstrem = gempaData.filter(function(g) { return g.tingkat === 'ekstrem'; }).length;
  var tinggi  = gempaData.filter(function(g) { return g.tingkat === 'tinggi' || g.tingkat === 'sedang'; }).length;

  var elT = document.getElementById('stat-total-zona');
  var elE = document.getElementById('stat-ekstrem');
  var elH = document.getElementById('stat-tinggi');
  if (elT) elT.textContent = total;
  if (elE) elE.textContent = ekstrem;
  if (elH) elH.textContent = tinggi;
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER MARKERS
// ─────────────────────────────────────────────────────────────────────────────
window.filterMarkers = function(level, silent) {
  activeFilter = level;

  // Update chip states
  document.querySelectorAll('.filter-chip').forEach(function(el) {
    el.classList.remove('active');
  });
  var chip = document.querySelector('[data-filter="' + level + '"]');
  if (chip) chip.classList.add('active');

  var filtered = level === 'all'
    ? gempaData
    : gempaData.filter(function(g) {
        // Map display levels: sedang & tinggi → Risiko Tinggi chip
        if (level === 'tinggi') return g.tingkat === 'tinggi' || g.tingkat === 'sedang';
        return g.tingkat === level;
      });

  renderMarkers(filtered);
};

// ─────────────────────────────────────────────────────────────────────────────
// OPEN SIDEBAR — dipanggil oleh klik marker & popup link
// ─────────────────────────────────────────────────────────────────────────────
window.openSidebar = function(id) {
  var g = gempaData.find(function(item) { return item.id === id; });
  if (!g) return;

  activeSidebarId = id;

  var cfg    = RISK_CONFIG[g.tingkat] || RISK_CONFIG.tinggi;
  var sidebar = document.getElementById('detail-sidebar');
  var mapCont = document.getElementById('map-container');

  // ── Populate sidebar ──────────────────────────────────────────────────────
  // Head
  var metaEl = sidebar.querySelector('.sidebar-head-meta');
  var titleEl = sidebar.querySelector('.sidebar-title');
  var subEl   = sidebar.querySelector('.sidebar-subtitle');
  if (metaEl)  metaEl.textContent  = 'ZONA RAWAN GEMPA';
  if (titleEl) titleEl.textContent = g.nama;
  if (subEl)   subEl.textContent   = g.provinsi;

  // Badge row
  var badgeRow = sidebar.querySelector('.sidebar-badge-row');
  if (badgeRow) {
    badgeRow.innerHTML =
      '<span class="risk-badge ' + cfg.cssClass + '">' +
      '<svg width="8" height="8" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="currentColor"/></svg>' +
      cfg.label + '</span>' +
      '<span class="magnitude-badge">M ' + g.magnitudo_max + ' Maks</span>';
  }

  // Body — Profil tab content
  var bodyEl = sidebar.querySelector('#sidebar-panel-profil');
  if (bodyEl) {
    bodyEl.innerHTML = buildProfilPanel(g, cfg);
    // Animate risk meter after DOM insertion
    setTimeout(function() {
      var fill = bodyEl.querySelector('.risk-meter-fill');
      if (fill) fill.style.width = cfg.meterPct + '%';
    }, 80);
  }

  // Breadcrumb
  updateBreadcrumb('Indonesia', g.provinsi, g.nama);

  // ── Open sidebar & shift map ───────────────────────────────────────────────
  sidebar.classList.add('open');
  if (mapCont) mapCont.classList.add('sidebar-open');
  if (map) {
    setTimeout(function() {
      map.invalidateSize({ animate: true });
      // Pan to marker
      map.panTo([g.lat, g.lng], { animate: true, duration: 0.6 });
    }, 180);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// BUILD PROFIL PANEL HTML
// ─────────────────────────────────────────────────────────────────────────────
function buildProfilPanel(g, cfg) {
  var meterColor = cfg.color;
  var pct        = cfg.meterPct;

  return '<div class="sidebar-section">'
    + '<div class="sidebar-section-title">Sekilas</div>'
    + '<div class="info-row">'
    +   '<span class="info-label">Lokasi</span>'
    +   '<span class="info-value"><span class="verified-pill"><svg width="7" height="7" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4" fill="#22c55e"/></svg> Terverifikasi</span></span>'
    + '</div>'
    + '<div class="info-row">'
    +   '<span class="info-label">Wilayah</span>'
    +   '<span class="info-value">' + g.provinsi + '</span>'
    + '</div>'
    + '<div class="info-row">'
    +   '<span class="info-label">Magnitudo Maks</span>'
    +   '<span class="info-value" style="color:' + meterColor + '">M ' + g.magnitudo_max + '</span>'
    + '</div>'
    + '<div class="info-row">'
    +   '<span class="info-label">Populasi Terdampak</span>'
    +   '<span class="info-value">' + g.populasi_terdampak + '</span>'
    + '</div>'
    + '<div class="info-row">'
    +   '<span class="info-label">Terakhir Aktif</span>'
    +   '<span class="info-value">' + g.terakhir_aktif + '</span>'
    + '</div>'
    + '</div>'

    // Risk meter
    + '<div class="sidebar-section">'
    + '<div class="sidebar-section-title">Indeks Tingkat Risiko</div>'
    + '<div class="sidebar-stat-grid">'
    +   '<div class="sidebar-stat-card">'
    +     '<div class="sidebar-stat-label">Tingkat</div>'
    +     '<div class="sidebar-stat-value" style="color:' + meterColor + '">' + cfg.label + '</div>'
    +   '</div>'
    +   '<div class="sidebar-stat-card">'
    +     '<div class="sidebar-stat-label">Magnitudo</div>'
    +     '<div class="sidebar-stat-value" style="color:' + meterColor + '">M ' + g.magnitudo_max + '</div>'
    +   '</div>'
    + '</div>'
    + '<div class="risk-meter">'
    +   '<div style="display:flex;justify-content:space-between;align-items:center;">'
    +     '<span style="font-size:11px;color:var(--text-muted);">Indeks Bahaya</span>'
    +     '<span style="font-size:11px;font-weight:700;color:' + meterColor + '">' + pct + '%</span>'
    +   '</div>'
    +   '<div class="risk-meter-track">'
    +     '<div class="risk-meter-fill" style="background:' + meterColor + ';width:0%;box-shadow:0 0 8px ' + meterColor + '40;"></div>'
    +   '</div>'
    + '</div>'
    + '</div>'

    // Description
    + '<div class="sidebar-section">'
    + '<div class="sidebar-section-title">Deskripsi Zona</div>'
    + '<p class="sidebar-desc">' + g.deskripsi + '</p>'
    + '</div>'

    // External links
    + '<div class="sidebar-section">'
    + '<div class="sidebar-section-title">Informasi Lebih Lanjut</div>'
    + '<div style="display:flex;flex-direction:column;gap:7px;">'
    +   '<a href="https://www.bmkg.go.id/gempabumi/" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:var(--bg-card);border:1px solid var(--border);border-radius:9px;text-decoration:none;font-size:12px;color:var(--text-secondary);transition:all 0.2s;" onmouseover="this.style.borderColor=\'var(--border-hover)\';this.style.color=\'var(--text-primary)\'" onmouseout="this.style.borderColor=\'var(--border)\';this.style.color=\'var(--text-secondary)\'">'
    +     '<span>🌐 BMKG — Katalog Gempa</span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>'
    +   '</a>'
    +   '<a href="https://inarisk.bnpb.go.id/" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;background:var(--bg-card);border:1px solid var(--border);border-radius:9px;text-decoration:none;font-size:12px;color:var(--text-secondary);transition:all 0.2s;" onmouseover="this.style.borderColor=\'var(--border-hover)\';this.style.color=\'var(--text-primary)\'" onmouseout="this.style.borderColor=\'var(--border)\';this.style.color=\'var(--text-secondary)\'">'
    +     '<span>🌐 InaRISK BNPB</span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>'
    +   '</a>'
    + '</div></div>';
}

// ─────────────────────────────────────────────────────────────────────────────
// CLOSE SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────
window.closeSidebar = function() {
  var sidebar = document.getElementById('detail-sidebar');
  var mapCont = document.getElementById('map-container');

  sidebar.classList.remove('open');
  if (mapCont) mapCont.classList.remove('sidebar-open');
  activeSidebarId = null;

  // Clear breadcrumb
  var bc = document.getElementById('nav-breadcrumb');
  if (bc) bc.classList.remove('visible');

  setTimeout(function() {
    if (map) map.invalidateSize({ animate: true });
  }, 420);
};

// ─────────────────────────────────────────────────────────────────────────────
// BREADCRUMB
// ─────────────────────────────────────────────────────────────────────────────
function updateBreadcrumb(country, province, name) {
  var bc = document.getElementById('nav-breadcrumb');
  if (!bc) return;

  var prov  = bc.querySelector('#bc-province');
  var curr  = bc.querySelector('#bc-current');
  if (prov) prov.textContent = province;
  if (curr) curr.textContent = name;
  bc.classList.add('visible');
}

// ─────────────────────────────────────────────────────────────────────────────
// SIDEBAR TAB SWITCHING
// ─────────────────────────────────────────────────────────────────────────────
window.switchSidebarTab = function(tabName) {
  document.querySelectorAll('.sidebar-tab').forEach(function(t) { t.classList.remove('active'); });
  var tab = document.querySelector('[data-tab="' + tabName + '"]');
  if (tab) tab.classList.add('active');

  // Show only profil for now; extend as needed
  var profil = document.getElementById('sidebar-panel-profil');
  if (profil) profil.style.display = 'block';
};

// ─────────────────────────────────────────────────────────────────────────────
// RESET MAP VIEW
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
      setTimeout(function() { if (map) map.invalidateSize(); }, 300);
    }).catch(function(err) { console.warn('Fullscreen gagal:', err); });
  } else {
    document.exitFullscreen();
    setTimeout(function() { if (map) map.invalidateSize(); }, 300);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  initMap();
});
