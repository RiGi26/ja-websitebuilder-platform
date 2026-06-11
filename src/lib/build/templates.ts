// ============================================================
// F1-2 — Template konten per industri (data, bukan prompt).
// Tiap template mengisi data_konten + sections + baris add-on dari briefing
// nyata; kalau field kosong -> generate copy spesifik bisnis (nama + kota),
// BUKAN Lorem ipsum. Nol-opex, deterministik. Lihat build-order skill.
//
// Catatan renderer (penting untuk pilihan tipe section):
//  - rental/klinik/company/sekolah: TIDAK baca sections (render dari
//    data_konten + services/profile). Sections tetap dibuat sbg fallback aman.
//  - restaurant: section-driven; menu via `pricing_table` + tabel menu_items.
//  - toko_online (batik): section-driven; produk via `product_list`.
//  - generic (personal/blog/jastip/custom): SectionRenderer / token-driven.
// ============================================================
import type { TipeIndustri } from '@/types/websitebuilder'
import type { BuildSection, NormalizedBriefing, TemplateFn, TemplateOutput } from './types'
import { asArr, asNum, asObj, asStr, kotaPhrase, waLink } from './briefing'
import { getCopy } from './copyVariants'

// ── shared section builders ────────────────────────────────────
const hero = (b: NormalizedBriefing, title: string, subtitle: string, ctaText: string): BuildSection => ({
  tipe_komponen: 'hero_banner',
  isi_komponen: {
    eyebrow: b.tagline || undefined,
    title,
    subtitle,
    cta_text: ctaText,
    cta_link: waLink(b.wa),
  },
})

const about = (title: string, body: string): BuildSection => ({
  tipe_komponen: 'about',
  isi_komponen: { title, body },
})

const features = (title: string, items: Array<{ title: string; desc: string }>): BuildSection => ({
  tipe_komponen: 'features',
  isi_komponen: { title, items },
})

const serviceList = (title: string): BuildSection => ({
  tipe_komponen: 'service_list',
  isi_komponen: { title },
})

const productList = (title: string): BuildSection => ({
  tipe_komponen: 'product_list',
  isi_komponen: { title },
})

const pricingMenu = (title: string): BuildSection => ({
  tipe_komponen: 'pricing_table',
  isi_komponen: { title },
})

const contact = (b: NormalizedBriefing, title = 'Hubungi Kami'): BuildSection => ({
  tipe_komponen: 'contact_form',
  isi_komponen: {
    title,
    deskripsi: `Hubungi ${b.namaUsaha} untuk pertanyaan, pemesanan, atau konsultasi.`,
  },
})

const cta = (b: NormalizedBriefing, title: string, subtitle: string, ctaText: string): BuildSection => ({
  tipe_komponen: 'cta',
  isi_komponen: { title, subtitle, cta_text: ctaText, cta_link: waLink(b.wa) },
})

// keunggulan (array string) -> items fitur. Judul = potongan ringkas tiap poin.
function keunggulanToFeatures(keunggulan: string[]): Array<{ title: string; desc: string }> {
  return keunggulan.slice(0, 6).map((k) => {
    const clean = k.trim()
    // judul = klausa pertama (sebelum koma/titik) maks 6 kata; desc = kalimat penuh.
    const head = clean.split(/[,.]/)[0].split(/\s+/).slice(0, 6).join(' ')
    return { title: head || 'Keunggulan', desc: clean }
  })
}

// tagline default kalau kosong: spesifik nama + kota.
function fallbackTagline(b: NormalizedBriefing, kata: string): string {
  return b.tagline || `${kata} terpercaya di ${kotaPhrase(b.kotaLayanan)}`
}

function fallbackDeskripsi(b: NormalizedBriefing, kalimat: string): string {
  return b.deskripsi || kalimat
}

// ── 3A. Travel / Rental ────────────────────────────────────────
const travelTemplate: TemplateFn = (b) => {
  const c = getCopy(b)
  const keunggulan = asArr(b.konten.keunggulan).map(asStr).filter(Boolean)
  const feat = keunggulan.length ? keunggulanToFeatures(keunggulan) : c.features

  const fleet = asArr(b.konten.fleet)
  const services = (fleet.length
    ? fleet.map((f) => {
        const o = asObj(f)
        const kapasitas = asStr(o.kapasitas)
        const transmisi = asStr(o.transmisi)
        const detail = [kapasitas && `${kapasitas} kursi`, transmisi && `transmisi ${transmisi}`].filter(Boolean).join(', ')
        return {
          nama: asStr(o.nama) || 'Unit Kendaraan',
          deskripsi: asStr(o.deskripsi) || detail || undefined,
          harga: asNum(o.harga),
          kategori: asStr(o.kategori) || undefined,
          gambar: asStr(o.foto_url) || undefined, // foto dari brief form (sebelumnya dibuang)
        }
      })
    : [
        { nama: 'City Car', deskripsi: '4 kursi, transmisi matic — irit untuk dalam kota.', harga: 300000, kategori: 'Harian' },
        { nama: 'MPV Keluarga', deskripsi: '7 kursi, lega untuk keluarga & rombongan.', harga: 450000, kategori: 'Harian' },
        { nama: 'Premium SUV', deskripsi: '7 kursi, nyaman untuk perjalanan jauh.', harga: 650000, kategori: 'Harian' },
      ])

  const dataKonten = {
    nama_usaha: b.namaUsaha,
    tagline: fallbackTagline(b, 'Rental kendaraan'),
    deskripsi: fallbackDeskripsi(b, c.deskripsi),
    kota_layanan: b.kotaLayanan,
    wa: b.wa,
    keunggulan: keunggulan.length ? keunggulan.slice(0, 4) : feat.map((f) => f.desc).slice(0, 4),
    syarat_sewa: b.kebijakan || undefined,
    kontak: { telepon: b.wa || undefined, email: b.email || undefined, alamat: b.alamat || undefined },
    // Pengayaan balok lux/composable (Sprint 2) — non-fabrikasi.
    statement: {
      eyebrow: 'Perjalanan Kami',
      quote: 'Setiap perjalanan layak dimulai tanpa khawatir — armada terawat, harga jelas, dan layanan yang menepati janji.',
      cite: b.namaUsaha,
    },
    stats: [
      { angka: `${services.length}+`, label: 'Pilihan Unit' },
      { angka: '100%', label: 'Unit Terawat' },
      { angka: 'Lokal', label: b.kotaLayanan ? `Area ${b.kotaLayanan}` : 'Layanan Tepercaya' },
    ],
    faq: [
      { q: 'Bagaimana cara memesan?', a: 'Klik WhatsApp, sebutkan tanggal, durasi, dan unit yang diinginkan. Kami cek ketersediaan lalu konfirmasi total biaya.' },
      { q: 'Apa saja syarat sewanya?', a: b.kebijakan ? 'Detail syarat kami sampaikan saat konfirmasi; ringkasnya cukup identitas yang berlaku.' : 'Umumnya cukup identitas yang berlaku. Detail kami sampaikan saat konfirmasi pemesanan.' },
      { q: 'Apakah tersedia dengan sopir?', a: 'Tergantung unit dan paket. Sampaikan kebutuhan Anda saat memesan, kami sesuaikan.' },
    ],
  }

  const sections: BuildSection[] = [
    hero(b, b.namaUsaha, dataKonten.deskripsi, 'Sewa Sekarang'),
    about('Tentang Kami', dataKonten.deskripsi),
    features('Mengapa Memilih Kami', feat),
    serviceList('Pilihan Armada'),
    contact(b, 'Pesan Kendaraan'),
    cta(b, 'Siap Jalan?', c.ctaSubtitle, 'Sewa Sekarang'),
  ]

  return { dataKonten, sections, services }
}

// ── 3B. Restaurant ─────────────────────────────────────────────
const restaurantTemplate: TemplateFn = (b) => {
  const c = getCopy(b)
  const menu = asArr(b.konten.menu)
  const menuItems = (menu.length
    ? menu.map((m) => {
        const o = asObj(m)
        return {
          nama: asStr(o.nama) || 'Menu',
          deskripsi: asStr(o.deskripsi) || undefined,
          harga: asNum(o.harga),
          kategori: asStr(o.kategori) || undefined,
          gambar: asStr(o.foto_url) || undefined, // foto menu dari brief form
        }
      })
    : [
        { nama: 'Menu Andalan', deskripsi: 'Hidangan khas favorit pelanggan, porsi puas.', harga: 35000, kategori: 'Utama' },
        { nama: 'Paket Hemat', deskripsi: 'Nasi + lauk + minum, pas untuk makan siang.', harga: 28000, kategori: 'Paket' },
        { nama: 'Menu Keluarga', deskripsi: 'Porsi besar untuk berbagi bersama keluarga.', harga: 95000, kategori: 'Sharing' },
        { nama: 'Minuman Segar', deskripsi: 'Aneka minuman dingin penyegar.', harga: 12000, kategori: 'Minuman' },
      ])

  const dataKonten = {
    nama_resto: b.namaUsaha,
    nama_usaha: b.namaUsaha,
    tagline: fallbackTagline(b, 'Tempat makan'),
    deskripsi: fallbackDeskripsi(b, c.deskripsi),
    wa: b.wa,
    kontak: { telepon: b.wa || undefined, email: b.email || undefined, alamat: b.alamat || undefined },
    // Pengayaan balok (Sprint 1) — isi statement/stats/faq di PRODUKSI (dulu
    // kosong → situs lux/composable sparse). Non-fabrikasi: stats dari jumlah
    // menu NYATA + janji dapur standar (bukan rating/tahun palsu); klien edit
    // via portal. Adapter (content-adapter.ts) memvalidasi ulang & balok yang
    // tak dideklarasi manifest tetap self-hide → aman lintas tema.
    statement: {
      eyebrow: 'Filosofi',
      quote: 'Kami percaya hidangan terbaik lahir dari bahan segar dan masakan yang dibuat sepenuh hati.',
      cite: `Dapur ${b.namaUsaha}`,
    },
    stats: [
      { angka: `${menuItems.length}+`, label: 'Menu Pilihan' },
      { angka: '100%', label: 'Dimasak Segar' },
      { angka: 'Lokal', label: b.kotaLayanan ? `Cita Rasa ${b.kotaLayanan}` : 'Cita Rasa Otentik' },
    ],
    faq: [
      { q: 'Bagaimana cara memesan?', a: 'Klik tombol WhatsApp, sampaikan pesanan dan jumlahnya, lalu kami konfirmasi total beserta estimasi waktu siap.' },
      { q: 'Apakah menerima pesanan untuk acara?', a: 'Bisa. Hubungi kami via WhatsApp untuk porsi besar atau katering acara — sebaiknya beberapa hari sebelum hari-H.' },
      { q: 'Di mana lokasi dan jam buka?', a: `Lihat detail di bagian Lokasi${b.kotaLayanan ? ` (${b.kotaLayanan})` : ''}, atau tanyakan langsung kepada kami via WhatsApp.` },
    ],
  }

  const sections: BuildSection[] = [
    hero(b, b.namaUsaha, dataKonten.deskripsi, 'Lihat Menu'),
    about('Cerita Kami', dataKonten.deskripsi),
    pricingMenu('Menu Kami'),
    contact(b, 'Kunjungi Kami'),
    cta(b, 'Lapar?', c.ctaSubtitle, 'Pesan via WhatsApp'),
  ]

  return { dataKonten, sections, menuItems }
}

// ── 3C. Corporate ──────────────────────────────────────────────
const corporateTemplate: TemplateFn = (b) => {
  const c = getCopy(b)
  const layanan = asArr(b.konten.layanan)
  const services = (layanan.length
    ? layanan.map((l) => {
        const o = asObj(l)
        return {
          nama: asStr(o.nama) || asStr(l) || 'Layanan',
          deskripsi: asStr(o.deskripsi) || undefined,
          harga: asNum(o.harga),
          kategori: asStr(o.kategori) || undefined,
          gambar: asStr(o.foto_url) || undefined, // foto layanan dari brief form
        }
      })
    : [
        { nama: 'Konsultasi', deskripsi: 'Sesi konsultasi untuk memetakan kebutuhan dan solusi terbaik.', harga: 0, kategori: 'Layanan' },
        { nama: 'Implementasi', deskripsi: 'Eksekusi solusi end-to-end oleh tim berpengalaman.', harga: 0, kategori: 'Layanan' },
        { nama: 'Pendampingan', deskripsi: 'Dukungan berkelanjutan agar hasil tetap optimal.', harga: 0, kategori: 'Layanan' },
      ])

  const feat = asArr(b.konten.keunggulan).map(asStr).filter(Boolean)
  const features_ = feat.length ? keunggulanToFeatures(feat) : c.features

  const dataKonten = {
    nama_perusahaan: b.namaUsaha,
    tagline: b.tagline || `Mitra ${b.namaUsaha} untuk pertumbuhan bisnis Anda`,
    deskripsi: fallbackDeskripsi(b, c.deskripsi),
    bidang_usaha: asStr(b.konten.bidang_usaha) || 'Layanan Profesional',
    layanan_utama: services.map((s) => s.nama),
    kontak: { email: b.email || undefined, telepon: b.wa || undefined, alamat: b.alamat || undefined },
    // Pengayaan balok lux/composable (Sprint 2) — non-fabrikasi.
    statement: {
      eyebrow: 'Visi Kami',
      quote: 'Kami percaya solusi terbaik lahir dari mendengarkan lebih dulu, lalu mengeksekusi dengan disiplin dan integritas.',
      cite: `Tim ${b.namaUsaha}`,
    },
    stats: [
      { angka: `${services.length}+`, label: 'Layanan Utama' },
      { angka: '100%', label: 'Berorientasi Hasil' },
      { angka: 'Pro', label: 'Tim Berpengalaman' },
    ],
    faq: [
      { q: 'Bagaimana cara memulai kerja sama?', a: 'Hubungi kami via WhatsApp atau email untuk konsultasi awal. Kami petakan kebutuhan Anda, lalu ajukan proposal yang sesuai.' },
      { q: 'Apakah layanan bisa disesuaikan?', a: 'Bisa. Setiap layanan kami rancang sesuai skala dan tujuan bisnis Anda — bukan paket yang kaku.' },
      { q: 'Bagaimana menghubungi tim Anda?', a: 'Kontak kami tertera di bagian bawah halaman; untuk respons cepat, kirim pesan langsung via WhatsApp.' },
    ],
  }

  const sections: BuildSection[] = [
    hero(b, b.namaUsaha, dataKonten.deskripsi, 'Konsultasi Gratis'),
    about('Tentang Perusahaan', dataKonten.deskripsi),
    features('Mengapa Kami', features_),
    serviceList('Layanan Kami'),
    contact(b, 'Hubungi Tim Kami'),
    cta(b, 'Mari Berkolaborasi', c.ctaSubtitle, 'Konsultasi Gratis'),
  ]

  return { dataKonten, sections, services }
}

// ── 3D. Klinik ─────────────────────────────────────────────────
const klinikTemplate: TemplateFn = (b) => {
  const c = getCopy(b)
  const dokter = asArr(b.konten.dokter)
  const fasilitas = asArr(b.konten.fasilitas).map(asStr).filter(Boolean)
  const asuransi = asArr(b.konten.asuransi).map(asStr).filter(Boolean)

  const services = (dokter.length
    ? dokter.map((d) => {
        const o = asObj(d)
        const spesialis = asStr(o.spesialis)
        const jadwal = asStr(o.jadwal)
        return {
          nama: asStr(o.nama) || 'Dokter',
          deskripsi: [spesialis, jadwal].filter(Boolean).join(' · ') || undefined,
          harga: asNum(o.biaya) || 150000,
          dp_amount: 0,
          kategori: spesialis || 'Konsultasi',
          gambar: asStr(o.foto_url) || undefined, // foto dokter dari brief form
        }
      })
    : [
        { nama: 'Konsultasi Umum', deskripsi: 'Pemeriksaan kesehatan umum oleh dokter.', harga: 100000, dp_amount: 0, kategori: 'Umum' },
        { nama: 'Konsultasi Spesialis', deskripsi: 'Konsultasi dengan dokter spesialis sesuai kebutuhan.', harga: 200000, dp_amount: 0, kategori: 'Spesialis' },
      ])

  const feat = asArr(b.konten.keunggulan).map(asStr).filter(Boolean)
  const features_ = feat.length ? keunggulanToFeatures(feat) : c.features

  const dataKonten = {
    nama_klinik: b.namaUsaha,
    deskripsi: fallbackDeskripsi(b, c.deskripsi),
    spesialisasi: dokter.map((d) => asStr(asObj(d).spesialis)).filter(Boolean),
    dokter: dokter.map((d) => {
      const o = asObj(d)
      return { nama: asStr(o.nama), spesialis: asStr(o.spesialis), jadwal: asStr(o.jadwal), foto: asStr(o.foto_url) || undefined }
    }),
    jam_operasional: b.jamOperasional || undefined,
    fasilitas,
    asuransi_diterima: asuransi,
    kontak: { telepon: b.wa || '', email: b.email || undefined, alamat: b.alamat || '', wa: b.wa || undefined },
    // Pengayaan balok (Sprint 1) — statement/stats/faq di PRODUKSI. Non-fabrikasi:
    // stats dari jumlah layanan/fasilitas NYATA + janji standar (bukan jumlah
    // pasien/tahun palsu); klien edit via portal. Balok tak-dideklarasi self-hide.
    statement: {
      eyebrow: 'Komitmen Kami',
      quote: 'Kesehatan Anda prioritas kami — dilayani dengan ramah, teliti, dan menjaga kenyamanan Anda di setiap kunjungan.',
      cite: `Tim ${b.namaUsaha}`,
    },
    stats: [
      { angka: `${services.length}+`, label: 'Layanan' },
      { angka: '100%', label: 'Tenaga Profesional' },
      ...(fasilitas.length
        ? [{ angka: `${fasilitas.length}+`, label: 'Fasilitas' }]
        : [{ angka: 'Bersih', label: 'Ruang Terjaga' }]),
    ],
    faq: [
      { q: 'Bagaimana cara membuat janji?', a: 'Klik tombol WhatsApp atau Buat Janji, pilih layanan dan waktu yang Anda inginkan, lalu tim kami mengonfirmasi jadwal.' },
      { q: 'Apakah perlu reservasi sebelum datang?', a: 'Sangat disarankan agar Anda tidak menunggu lama. Pasien walk-in tetap kami layani sesuai ketersediaan.' },
      { q: 'Di mana lokasi dan jam praktiknya?', a: `Jadwal praktik tertera di bagian Lokasi${b.alamat ? `; kami berada di ${b.alamat}` : ''}. Untuk kepastian, hubungi kami via WhatsApp.` },
    ],
  }

  const sections: BuildSection[] = [
    hero(b, b.namaUsaha, dataKonten.deskripsi, 'Buat Janji'),
    about('Tentang Klinik', dataKonten.deskripsi),
    features('Mengapa Pasien Memilih Kami', features_),
    serviceList('Layanan & Dokter'),
    contact(b, 'Buat Janji Temu'),
    cta(b, 'Jaga Kesehatan Keluarga Anda', c.ctaSubtitle, 'Buat Janji'),
  ]

  return { dataKonten, sections, services }
}

// ── 3E. Sekolah ────────────────────────────────────────────────
const sekolahTemplate: TemplateFn = (b) => {
  const c = getCopy(b)
  const program = asArr(b.konten.program).length ? asArr(b.konten.program) : asArr(b.konten.program_unggulan)
  const services = (program.length
    ? program.map((p) => {
        const o = asObj(p)
        return {
          nama: asStr(o.nama) || asStr(p) || 'Program',
          deskripsi: asStr(o.deskripsi) || undefined,
          harga: asNum(o.biaya),
          dp_amount: 0,
          kategori: 'Program',
          gambar: asStr(o.foto_url) || undefined, // foto program dari brief form
        }
      })
    : [
        { nama: 'Program Unggulan', deskripsi: 'Kurikulum terstruktur untuk perkembangan optimal.', harga: 0, dp_amount: 0, kategori: 'Program' },
        { nama: 'Kegiatan Ekstrakurikuler', deskripsi: 'Mengasah bakat dan minat di luar kelas.', harga: 0, dp_amount: 0, kategori: 'Program' },
      ])

  const dataKonten = {
    nama_sekolah: b.namaUsaha,
    akreditasi: asStr(b.konten.akreditasi) || undefined,
    deskripsi: fallbackDeskripsi(b, c.deskripsi),
    visi: asStr(b.konten.visi) || undefined,
    program_unggulan: services.map((s) => s.nama),
    ppdb_aktif: true,
    kontak: { telepon: b.wa || undefined, email: b.email || undefined, alamat: b.alamat || '' },
    // Pengayaan balok lux/composable (Sprint 2) — pakai visi/akreditasi NYATA bila ada.
    statement: {
      eyebrow: 'Visi Kami',
      quote: asStr(b.konten.visi) || 'Kami mendidik bukan sekadar untuk nilai, tetapi untuk karakter, rasa ingin tahu, dan keberanian melangkah.',
      cite: `Keluarga ${b.namaUsaha}`,
    },
    stats: [
      { angka: `${services.length}+`, label: 'Program Unggulan' },
      { angka: '100%', label: 'Pendampingan Siswa' },
      ...(asStr(b.konten.akreditasi)
        ? [{ angka: asStr(b.konten.akreditasi) as string, label: 'Akreditasi' }]
        : [{ angka: 'Aktif', label: 'PPDB Dibuka' }]),
    ],
    faq: [
      { q: 'Bagaimana cara mendaftar (PPDB)?', a: 'Klik tombol Daftar atau hubungi kami via WhatsApp. Tim kami memandu alur pendaftaran, syarat, dan jadwalnya.' },
      { q: 'Apa saja program unggulannya?', a: 'Lihat bagian Program untuk daftar lengkap. Untuk penjelasan detail, jadwalkan kunjungan atau tanya via WhatsApp.' },
      { q: 'Di mana lokasi dan cara menghubungi?', a: 'Alamat dan kontak tertera di bawah. Kami dengan senang hati menerima kunjungan calon siswa dan orang tua.' },
    ],
  }

  const feat = asArr(b.konten.keunggulan).map(asStr).filter(Boolean)
  const sections: BuildSection[] = [
    hero(b, b.namaUsaha, dataKonten.deskripsi, 'Daftar Sekarang'),
    about('Tentang Sekolah', dataKonten.deskripsi),
    features('Keunggulan Kami', feat.length ? keunggulanToFeatures(feat) : c.features),
    serviceList('Program Kami'),
    contact(b, 'Informasi Pendaftaran'),
    cta(b, 'Bergabung Bersama Kami', c.ctaSubtitle, 'Daftar Sekarang'),
  ]

  return { dataKonten, sections, services }
}

// ── 3F. Toko Online (batik) ────────────────────────────────────
const tokoOnlineTemplate: TemplateFn = (b) => {
  const c = getCopy(b)
  const produk = asArr(b.konten.produk_unggulan).length ? asArr(b.konten.produk_unggulan) : asArr(b.konten.produk)
  const products = (produk.length
    ? produk.map((p) => {
        const o = asObj(p)
        return {
          nama: asStr(o.nama) || 'Produk',
          deskripsi: asStr(o.deskripsi) || undefined,
          harga: asNum(o.harga),
          kategori: asStr(o.kategori) || undefined,
          stok: asNum(o.stok) || 10,
          gambar: asStr(o.foto_url) || undefined, // foto produk dari brief form
        }
      })
    : [
        { nama: 'Produk Terlaris', deskripsi: 'Favorit pelanggan, stok cepat habis.', harga: 150000, kategori: 'Unggulan', stok: 20 },
        { nama: 'Koleksi Baru', deskripsi: 'Rilisan terbaru dengan desain eksklusif.', harga: 200000, kategori: 'Baru', stok: 15 },
        { nama: 'Paket Bundle', deskripsi: 'Lebih hemat beli sekaligus.', harga: 350000, kategori: 'Bundle', stok: 10 },
      ])

  const dataKonten = {
    nama_toko: b.namaUsaha,
    tagline: fallbackTagline(b, 'Toko'),
    deskripsi: fallbackDeskripsi(b, c.deskripsi),
    kategori_produk: [...new Set(products.map((p) => p.kategori).filter(Boolean))] as string[],
    kontak: { wa: b.wa || undefined, email: b.email || undefined, alamat: b.alamat || undefined },
    sosial_media: { instagram: b.sosial.instagram, tiktok: b.sosial.tiktok, shopee: b.sosial.shopee },
    // Pengayaan balok lux/composable (Sprint 2) — non-fabrikasi.
    statement: {
      eyebrow: 'Tentang Kami',
      quote: 'Kami memilih tiap produk dengan standar yang sama seperti untuk diri sendiri — kualitas dulu, selalu.',
      cite: b.namaUsaha,
    },
    stats: [
      { angka: `${products.length}+`, label: 'Pilihan Produk' },
      { angka: '100%', label: 'Kualitas Terjaga' },
      { angka: 'Cepat', label: 'Respons & Kirim' },
    ],
    faq: [
      { q: 'Bagaimana cara memesan?', a: 'Pilih produk, lalu klik tombol WhatsApp untuk konfirmasi ketersediaan, total, dan ongkir. Admin kami memandu pembayaran.' },
      { q: 'Apakah barang sesuai deskripsi?', a: 'Ya, kami hanya menjual produk sesuai deskripsi. Bila ada ketidaksesuaian, hubungi kami untuk solusi.' },
      { q: 'Berapa lama pengiriman?', a: 'Pesanan diproses cepat setelah pembayaran. Estimasi tiba mengikuti ekspedisi dan lokasi Anda — admin info detailnya.' },
    ],
  }

  const feat = asArr(b.konten.keunggulan).map(asStr).filter(Boolean)
  const sections: BuildSection[] = [
    hero(b, b.namaUsaha, dataKonten.deskripsi, 'Belanja Sekarang'),
    features('Kenapa Belanja di Sini', feat.length ? keunggulanToFeatures(feat) : c.features),
    productList('Produk Kami'),
    contact(b, 'Hubungi Kami'),
    cta(b, 'Temukan Favorit Anda', c.ctaSubtitle, 'Belanja Sekarang'),
  ]

  return { dataKonten, sections, products }
}

// ── 3G. Generic (personal/blog/jastip/custom) ──────────────────
const genericTemplate: TemplateFn = (b) => {
  const c = getCopy(b)
  const dataKonten = {
    nama_usaha: b.namaUsaha,
    tagline: fallbackTagline(b, b.namaUsaha),
    deskripsi: fallbackDeskripsi(b, c.deskripsi),
    wa: b.wa,
    kontak: { telepon: b.wa || undefined, email: b.email || undefined, alamat: b.alamat || undefined },
    // Pengayaan balok lux/composable (Sprint 2) — netral lintas personal/blog/
    // jastip/custom (template generik), non-fabrikasi.
    statement: {
      eyebrow: 'Tentang',
      quote: 'Kami percaya hal-hal baik lahir dari ketekunan dan perhatian pada detail.',
      cite: b.namaUsaha,
    },
    stats: [
      { angka: '100%', label: 'Sepenuh Hati' },
      { angka: 'Cepat', label: 'Respons' },
      { angka: 'Ramah', label: 'Pelayanan' },
    ],
    faq: [
      { q: 'Bagaimana cara menghubungi?', a: 'Klik tombol WhatsApp atau lihat kontak di bagian bawah halaman. Kami usahakan membalas secepatnya.' },
      { q: 'Apa saja yang ditawarkan?', a: 'Lihat bagian di atas untuk gambaran lengkapnya. Bila ada yang ingin ditanyakan, jangan ragu menghubungi kami.' },
      { q: 'Apakah bisa permintaan khusus?', a: 'Bisa. Sampaikan kebutuhan Anda via WhatsApp dan kami bantu sebisa mungkin.' },
    ],
  }
  const feat = asArr(b.konten.keunggulan).map(asStr).filter(Boolean)
  const sections: BuildSection[] = [
    hero(b, b.namaUsaha, dataKonten.deskripsi, 'Hubungi Saya'),
    about('Tentang', dataKonten.deskripsi),
    features('Yang Saya Tawarkan', feat.length ? keunggulanToFeatures(feat) : c.features),
    contact(b, 'Hubungi Saya'),
    cta(b, 'Mari Terhubung', c.ctaSubtitle, 'Hubungi Saya'),
  ]
  return { dataKonten, sections }
}

// ── registry ───────────────────────────────────────────────────
const REGISTRY: Record<TipeIndustri, TemplateFn> = {
  travel: travelTemplate,
  restaurant: restaurantTemplate,
  corporate: corporateTemplate,
  klinik: klinikTemplate,
  sekolah: sekolahTemplate,
  toko_online: tokoOnlineTemplate,
  personal: genericTemplate,
  blog: genericTemplate,
  jastip: genericTemplate,
  custom: genericTemplate,
}

export function runTemplate(b: NormalizedBriefing): TemplateOutput {
  return (REGISTRY[b.tipe] ?? genericTemplate)(b)
}
