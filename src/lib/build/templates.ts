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
  const kota = kotaPhrase(b.kotaLayanan)
  const keunggulan = asArr(b.konten.keunggulan).map(asStr).filter(Boolean)
  const feat = keunggulan.length
    ? keunggulanToFeatures(keunggulan)
    : [
        { title: 'Armada Terawat', desc: 'Setiap unit dicek rutin dan selalu siap jalan — bersih, prima, tanpa drama.' },
        { title: 'Harga Transparan', desc: `Tarif jelas di depan untuk wilayah ${kota}, tanpa biaya tersembunyi.` },
        { title: 'Respons Cepat', desc: 'Booking lewat WhatsApp, dibalas cepat, unit siap sesuai jadwal Anda.' },
      ]

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
    deskripsi: fallbackDeskripsi(b, `${b.namaUsaha} melayani sewa kendaraan di ${kota} dengan armada terawat dan harga transparan.`),
    kota_layanan: b.kotaLayanan,
    wa: b.wa,
    keunggulan: keunggulan.length ? keunggulan.slice(0, 4) : feat.map((f) => f.desc).slice(0, 4),
    syarat_sewa: b.kebijakan || undefined,
    kontak: { telepon: b.wa || undefined, email: b.email || undefined, alamat: b.alamat || undefined },
  }

  const sections: BuildSection[] = [
    hero(b, b.namaUsaha, dataKonten.deskripsi, 'Sewa Sekarang'),
    about('Tentang Kami', dataKonten.deskripsi),
    features('Mengapa Memilih Kami', feat),
    serviceList('Pilihan Armada'),
    contact(b, 'Pesan Kendaraan'),
    cta(b, 'Siap Jalan?', `Booking unit ${b.namaUsaha} sekarang lewat WhatsApp.`, 'Sewa Sekarang'),
  ]

  return { dataKonten, sections, services }
}

// ── 3B. Restaurant ─────────────────────────────────────────────
const restaurantTemplate: TemplateFn = (b) => {
  const kota = kotaPhrase(b.kotaLayanan)
  const menu = asArr(b.konten.menu)
  const menuItems = (menu.length
    ? menu.map((m) => {
        const o = asObj(m)
        return {
          nama: asStr(o.nama) || 'Menu',
          deskripsi: asStr(o.deskripsi) || undefined,
          harga: asNum(o.harga),
          kategori: asStr(o.kategori) || undefined,
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
    deskripsi: fallbackDeskripsi(b, `${b.namaUsaha} menyajikan hidangan lezat dengan bahan segar di ${kota}. Suasana nyaman untuk keluarga & teman.`),
    wa: b.wa,
    kontak: { telepon: b.wa || undefined, email: b.email || undefined, alamat: b.alamat || undefined },
  }

  const sections: BuildSection[] = [
    hero(b, b.namaUsaha, dataKonten.deskripsi, 'Lihat Menu'),
    about('Cerita Kami', dataKonten.deskripsi),
    pricingMenu('Menu Kami'),
    contact(b, 'Kunjungi Kami'),
    cta(b, 'Lapar?', `Pesan sekarang atau kunjungi ${b.namaUsaha} hari ini.`, 'Pesan via WhatsApp'),
  ]

  return { dataKonten, sections, menuItems }
}

// ── 3C. Corporate ──────────────────────────────────────────────
const corporateTemplate: TemplateFn = (b) => {
  const kota = kotaPhrase(b.kotaLayanan)
  const layanan = asArr(b.konten.layanan)
  const services = (layanan.length
    ? layanan.map((l) => {
        const o = asObj(l)
        return {
          nama: asStr(o.nama) || asStr(l) || 'Layanan',
          deskripsi: asStr(o.deskripsi) || undefined,
          harga: asNum(o.harga),
          kategori: asStr(o.kategori) || undefined,
        }
      })
    : [
        { nama: 'Konsultasi', deskripsi: 'Sesi konsultasi untuk memetakan kebutuhan dan solusi terbaik.', harga: 0, kategori: 'Layanan' },
        { nama: 'Implementasi', deskripsi: 'Eksekusi solusi end-to-end oleh tim berpengalaman.', harga: 0, kategori: 'Layanan' },
        { nama: 'Pendampingan', deskripsi: 'Dukungan berkelanjutan agar hasil tetap optimal.', harga: 0, kategori: 'Layanan' },
      ])

  const feat = asArr(b.konten.keunggulan).map(asStr).filter(Boolean)
  const features_ = feat.length
    ? keunggulanToFeatures(feat)
    : [
        { title: 'Berpengalaman', desc: 'Tim profesional dengan rekam jejak menangani beragam klien.' },
        { title: 'Solusi Terukur', desc: 'Pendekatan berbasis data, hasil yang bisa dipertanggungjawabkan.' },
        { title: 'Mitra Jangka Panjang', desc: 'Kami tumbuh bersama klien, bukan sekadar proyek sesaat.' },
      ]

  const dataKonten = {
    nama_perusahaan: b.namaUsaha,
    tagline: b.tagline || `Mitra ${b.namaUsaha} untuk pertumbuhan bisnis Anda`,
    deskripsi: fallbackDeskripsi(b, `${b.namaUsaha} adalah perusahaan yang berfokus memberikan layanan profesional dan terpercaya di ${kota}.`),
    bidang_usaha: asStr(b.konten.bidang_usaha) || 'Layanan Profesional',
    layanan_utama: services.map((s) => s.nama),
    kontak: { email: b.email || undefined, telepon: b.wa || undefined, alamat: b.alamat || undefined },
  }

  const sections: BuildSection[] = [
    hero(b, b.namaUsaha, dataKonten.deskripsi, 'Konsultasi Gratis'),
    about('Tentang Perusahaan', dataKonten.deskripsi),
    features('Mengapa Kami', features_),
    serviceList('Layanan Kami'),
    contact(b, 'Hubungi Tim Kami'),
    cta(b, 'Mari Berkolaborasi', `Diskusikan kebutuhan Anda dengan tim ${b.namaUsaha}.`, 'Konsultasi Gratis'),
  ]

  return { dataKonten, sections, services }
}

// ── 3D. Klinik ─────────────────────────────────────────────────
const klinikTemplate: TemplateFn = (b) => {
  const kota = kotaPhrase(b.kotaLayanan)
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
        }
      })
    : [
        { nama: 'Konsultasi Umum', deskripsi: 'Pemeriksaan kesehatan umum oleh dokter.', harga: 100000, dp_amount: 0, kategori: 'Umum' },
        { nama: 'Konsultasi Spesialis', deskripsi: 'Konsultasi dengan dokter spesialis sesuai kebutuhan.', harga: 200000, dp_amount: 0, kategori: 'Spesialis' },
      ])

  const feat = asArr(b.konten.keunggulan).map(asStr).filter(Boolean)
  const features_ = feat.length
    ? keunggulanToFeatures(feat)
    : [
        { title: 'Dokter Berpengalaman', desc: 'Ditangani tenaga medis tersertifikasi yang ramah dan profesional.' },
        { title: 'Pelayanan Cepat', desc: 'Antrean tertata, waktu tunggu singkat, proses jelas.' },
        { title: 'Fasilitas Lengkap', desc: 'Peralatan medis modern untuk diagnosis yang akurat.' },
      ]

  const dataKonten = {
    nama_klinik: b.namaUsaha,
    deskripsi: fallbackDeskripsi(b, `${b.namaUsaha} melayani kesehatan keluarga di ${kota} dengan dokter berpengalaman dan fasilitas modern.`),
    spesialisasi: dokter.map((d) => asStr(asObj(d).spesialis)).filter(Boolean),
    dokter: dokter.map((d) => {
      const o = asObj(d)
      return { nama: asStr(o.nama), spesialis: asStr(o.spesialis), jadwal: asStr(o.jadwal) }
    }),
    jam_operasional: b.jamOperasional || undefined,
    fasilitas,
    asuransi_diterima: asuransi,
    kontak: { telepon: b.wa || '', email: b.email || undefined, alamat: b.alamat || '', wa: b.wa || undefined },
  }

  const sections: BuildSection[] = [
    hero(b, b.namaUsaha, dataKonten.deskripsi, 'Buat Janji'),
    about('Tentang Klinik', dataKonten.deskripsi),
    features('Mengapa Pasien Memilih Kami', features_),
    serviceList('Layanan & Dokter'),
    contact(b, 'Buat Janji Temu'),
    cta(b, 'Jaga Kesehatan Keluarga Anda', `Buat janji dengan ${b.namaUsaha} sekarang.`, 'Buat Janji'),
  ]

  return { dataKonten, sections, services }
}

// ── 3E. Sekolah ────────────────────────────────────────────────
const sekolahTemplate: TemplateFn = (b) => {
  const kota = kotaPhrase(b.kotaLayanan)
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
        }
      })
    : [
        { nama: 'Program Unggulan', deskripsi: 'Kurikulum terstruktur untuk perkembangan optimal.', harga: 0, dp_amount: 0, kategori: 'Program' },
        { nama: 'Kegiatan Ekstrakurikuler', deskripsi: 'Mengasah bakat dan minat di luar kelas.', harga: 0, dp_amount: 0, kategori: 'Program' },
      ])

  const dataKonten = {
    nama_sekolah: b.namaUsaha,
    akreditasi: asStr(b.konten.akreditasi) || undefined,
    deskripsi: fallbackDeskripsi(b, `${b.namaUsaha} hadir di ${kota} dengan pendidikan berkualitas dan lingkungan belajar yang mendukung.`),
    visi: asStr(b.konten.visi) || undefined,
    program_unggulan: services.map((s) => s.nama),
    ppdb_aktif: true,
    kontak: { telepon: b.wa || undefined, email: b.email || undefined, alamat: b.alamat || '' },
  }

  const feat = asArr(b.konten.keunggulan).map(asStr).filter(Boolean)
  const sections: BuildSection[] = [
    hero(b, b.namaUsaha, dataKonten.deskripsi, 'Daftar Sekarang'),
    about('Tentang Sekolah', dataKonten.deskripsi),
    features('Keunggulan Kami', feat.length ? keunggulanToFeatures(feat) : [
      { title: 'Pendidik Berkualitas', desc: 'Tenaga pengajar berdedikasi yang peduli pada tiap siswa.' },
      { title: 'Lingkungan Mendukung', desc: 'Suasana belajar aman, nyaman, dan menumbuhkan karakter.' },
      { title: 'Prestasi Terbukti', desc: 'Rekam jejak siswa berprestasi di bidang akademik & non-akademik.' },
    ]),
    serviceList('Program Kami'),
    contact(b, 'Informasi Pendaftaran'),
    cta(b, 'Bergabung Bersama Kami', `Daftarkan putra-putri Anda di ${b.namaUsaha}.`, 'Daftar Sekarang'),
  ]

  return { dataKonten, sections, services }
}

// ── 3F. Toko Online (batik) ────────────────────────────────────
const tokoOnlineTemplate: TemplateFn = (b) => {
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
    deskripsi: fallbackDeskripsi(b, `${b.namaUsaha} menghadirkan produk pilihan dengan kualitas terjaga. Belanja mudah, pengiriman ke seluruh Indonesia.`),
    kategori_produk: [...new Set(products.map((p) => p.kategori).filter(Boolean))] as string[],
    kontak: { wa: b.wa || undefined, email: b.email || undefined, alamat: b.alamat || undefined },
    sosial_media: { instagram: b.sosial.instagram, tiktok: b.sosial.tiktok, shopee: b.sosial.shopee },
  }

  const feat = asArr(b.konten.keunggulan).map(asStr).filter(Boolean)
  const sections: BuildSection[] = [
    hero(b, b.namaUsaha, dataKonten.deskripsi, 'Belanja Sekarang'),
    features('Kenapa Belanja di Sini', feat.length ? keunggulanToFeatures(feat) : [
      { title: 'Kualitas Terjaga', desc: 'Setiap produk dikurasi, dikemas rapi, sampai dengan aman.' },
      { title: 'Pengiriman Cepat', desc: 'Diproses cepat dan dikirim ke seluruh Indonesia.' },
      { title: 'Belanja Mudah', desc: 'Pesan langsung via WhatsApp, respons ramah dan cepat.' },
    ]),
    productList('Produk Kami'),
    contact(b, 'Hubungi Kami'),
    cta(b, 'Temukan Favorit Anda', `Belanja koleksi ${b.namaUsaha} sekarang.`, 'Belanja Sekarang'),
  ]

  return { dataKonten, sections, products }
}

// ── 3G. Generic (personal/blog/jastip/custom) ──────────────────
const genericTemplate: TemplateFn = (b) => {
  const kota = kotaPhrase(b.kotaLayanan)
  const dataKonten = {
    nama_usaha: b.namaUsaha,
    tagline: fallbackTagline(b, b.namaUsaha),
    deskripsi: fallbackDeskripsi(b, `${b.namaUsaha} hadir untuk Anda di ${kota}.`),
    wa: b.wa,
    kontak: { telepon: b.wa || undefined, email: b.email || undefined, alamat: b.alamat || undefined },
  }
  const feat = asArr(b.konten.keunggulan).map(asStr).filter(Boolean)
  const sections: BuildSection[] = [
    hero(b, b.namaUsaha, dataKonten.deskripsi, 'Hubungi Saya'),
    about('Tentang', dataKonten.deskripsi),
    features('Yang Saya Tawarkan', feat.length ? keunggulanToFeatures(feat) : [
      { title: 'Profesional', desc: 'Dikerjakan serius dengan standar yang Anda harapkan.' },
      { title: 'Komunikatif', desc: 'Mudah dihubungi, responsif, dan transparan.' },
      { title: 'Tepat Waktu', desc: 'Komitmen pada hasil dan tenggat yang disepakati.' },
    ]),
    contact(b, 'Hubungi Saya'),
    cta(b, 'Mari Terhubung', `Sampaikan kebutuhan Anda ke ${b.namaUsaha}.`, 'Hubungi Saya'),
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
