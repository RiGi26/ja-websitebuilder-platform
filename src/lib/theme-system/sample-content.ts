// ============================================================
// THEME SYSTEM — Konten contoh per sub-kategori (UAT preview).
// Dipakai /admin/theme-preview untuk merender tiap gaya dengan
// ComposableRenderer ASLI memakai konten realistis — supaya UAT bisa
// menilai tampilan tema persis seperti situs jadi (bukan mockup brief form).
//
// MURNI data. Tidak menyentuh jalur render produksi. Foto = Unsplash
// (terverifikasi 200) agar hero fullbleed + lookbook fashion tampil hidup.
// ============================================================
import type { ComposableContent } from './manifest'

const IMG = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`

// ── Kuliner (pempek — kasus nyata pemicu Theme System) ─────────
const KULINER: ComposableContent = {
  nama: 'Pempek RIGIZAF',
  hero: {
    eyebrow: 'Kuliner Khas Palembang',
    title: 'Pempek Homemade Asli Palembang',
    subtitle:
      'Dibuat segar tiap hari dari ikan tenggiri pilihan, dengan cuko racikan turun-temurun yang nampol.',
    ctaText: 'Pesan via WhatsApp',
    ctaHref: '#wa',
    image: IMG('photo-1565299624946-b28f40a0ae38'),
  },
  features: [
    { title: 'Homemade Harian', desc: 'Diproduksi segar setiap pagi, bukan stok lama.' },
    { title: 'Cuko Turun-temurun', desc: 'Racikan khas Palembang yang pedas-manis pas.' },
    { title: 'Vacuum & Frozen', desc: 'Tahan 1 bulan, aman dikirim ke seluruh Indonesia.' },
  ],
  showcase: {
    title: 'Menu Andalan',
    subtitle: 'Favorit pelanggan, dibuat dari resep keluarga.',
    items: [
      { nama: 'Pempek Kapal Selam', harga: 15000, desc: 'Telur ayam utuh di dalam, gurih melimpah.', gambar: IMG('photo-1567620905732-2d1ec7ab7445', 800) },
      { nama: 'Pempek Lenjer Besar', harga: 28000, desc: 'Padat kenyal, porsi puas untuk berbagi.', gambar: IMG('photo-1504674900247-0877df9cc836', 800) },
      { nama: 'Paket Campur 1/2 Kg + Cuko', harga: 55000, desc: 'Aneka pempek lengkap dengan cuko botol.', gambar: IMG('photo-1551024506-0bccd828d307', 800) },
    ],
  },
  about: {
    title: 'Cita Rasa Wong Kito',
    body: 'Sejak 2015 kami menjaga resep keluarga: ikan tenggiri segar, sagu pilihan, dan cuko yang diracik tangan. Ribuan pelanggan dari Sabang sampai Merauke sudah mencicipi.',
  },
  cta: {
    title: 'Lapar Pempek Asli?',
    subtitle: 'Pesan sekarang, kami kirim segar ke alamat Anda.',
    ctaText: 'Order via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'halo@pempekrigizaf.id', alamat: 'Palembang, Sumatera Selatan' },
}

// ── Fashion (label busana — lookbook editorial) ────────────────
const FASHION: ComposableContent = {
  nama: 'ARNA Label',
  hero: {
    eyebrow: 'Koleksi Musim Ini',
    title: 'Busana yang Bicara Tanpa Suara',
    subtitle:
      'Potongan modern, bahan premium, dijahit terbatas. Untuk mereka yang tahu detail adalah segalanya.',
    ctaText: 'Lihat Koleksi',
    ctaHref: '#koleksi',
    image: IMG('photo-1490481651871-ab68de25d43d'),
  },
  features: [
    { title: 'Edisi Terbatas', desc: 'Tiap koleksi diproduksi dalam jumlah kecil — tak pasaran.' },
    { title: 'Bahan Premium', desc: 'Katun combed, linen, dan tenun pilihan yang nyaman seharian.' },
    { title: 'Custom Fit', desc: 'Tersedia penyesuaian ukuran agar pas di badan Anda.' },
  ],
  showcase: {
    title: 'Lookbook',
    subtitle: 'Koleksi unggulan musim ini.',
    items: [
      { nama: 'The Charcoal Set', harga: 450000, desc: 'Setelan monokrom, siluet tegas.', gambar: IMG('photo-1490481651871-ab68de25d43d', 900) },
      { nama: 'Linen Overshirt', harga: 320000, desc: 'Ringan, jatuh sempurna.', gambar: IMG('photo-1539109136881-3be0616acf4b', 900) },
      { nama: 'Essential Tee', harga: 180000, desc: 'Basic yang tak pernah salah.', gambar: IMG('photo-1521572163474-6864f9cf17ab', 900) },
      { nama: 'Tailored Trousers', harga: 380000, desc: 'Potongan rapi, nyaman bergerak.', gambar: IMG('photo-1483985988355-763728e1935b', 900) },
    ],
  },
  about: {
    title: 'Tentang ARNA',
    body: 'Kami percaya pakaian terbaik adalah yang tak berteriak. Setiap jahitan dikerjakan perajin lokal, setiap bahan dipilih untuk bertahan bertahun-tahun — bukan satu musim.',
  },
  cta: {
    title: 'Temukan Gayamu',
    subtitle: 'Koleksi terbatas — sekali habis, tak diproduksi ulang.',
    ctaText: 'Belanja Sekarang',
    ctaHref: '#koleksi',
  },
  contact: { wa: '6281296917963', email: 'hello@arnalabel.com', alamat: 'Bandung, Jawa Barat' },
}

// ── Kerajinan / Heritage (batik & wastra — uji motif) ──────────
const KERAJINAN: ComposableContent = {
  nama: 'Wastra Nusantara',
  hero: {
    eyebrow: 'Warisan Wastra Indonesia',
    title: 'Batik Tulis, Dikerjakan Sepenuh Hati',
    subtitle:
      'Tiap helai dicanting tangan oleh perajin Pekalongan — bukan cetakan. Motif klasik yang hidup puluhan tahun.',
    ctaText: 'Lihat Koleksi',
    ctaHref: '#koleksi',
    image: IMG('photo-1528459801416-a9e53bbf4e17'),
  },
  features: [
    { title: 'Canting Tangan', desc: 'Dikerjakan perajin berpengalaman, bukan batik printing pabrik.' },
    { title: 'Pewarna Alami', desc: 'Indigo, soga, dan mengkudu — warna yang makin matang seiring waktu.' },
    { title: 'Edisi Terbatas', desc: 'Tiap motif diproduksi sedikit, jadi koleksi Anda tetap istimewa.' },
  ],
  showcase: {
    title: 'Koleksi Pilihan',
    subtitle: 'Mahakarya wastra dari tangan perajin terbaik.',
    items: [
      { nama: 'Batik Tulis Kawung', harga: 850000, desc: 'Motif klasik keraton, sutra premium.', gambar: IMG('photo-1582738411706-bfc8e691d1c2', 800) },
      { nama: 'Tenun Ikat Sumba', harga: 1250000, desc: 'Pewarna alami, ditenun 3 minggu.', gambar: IMG('photo-1610701596007-11502861dcfa', 800) },
      { nama: 'Selendang Songket', harga: 680000, desc: 'Benang emas, anyaman rapat.', gambar: IMG('photo-1606744837616-56c9a5c6a6eb', 800) },
      { nama: 'Kain Panjang Parang', harga: 720000, desc: 'Motif parang rusak, katun primisima.', gambar: IMG('photo-1528459801416-a9e53bbf4e17', 800) },
    ],
  },
  about: {
    title: 'Menjaga Warisan Leluhur',
    body: 'Sejak 1998 kami merangkul perajin wastra di Pekalongan, Sumba, dan Palembang. Setiap pembelian Anda menghidupi tangan-tangan yang menjaga tradisi tetap bernapas.',
  },
  cta: {
    title: 'Miliki Mahakarya Wastra',
    subtitle: 'Koleksi terbatas — tiap kain punya cerita.',
    ctaText: 'Pesan via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'halo@wastranusantara.id', alamat: 'Pekalongan, Jawa Tengah' },
}

// ── Kecantikan / Skincare ──────────────────────────────────────
const KECANTIKAN: ComposableContent = {
  nama: 'Lumière Skin',
  hero: {
    eyebrow: 'Perawatan Kulit Sehari-hari',
    title: 'Kulit Sehat Mulai dari Rutinitas Sederhana',
    subtitle:
      'Formula lembut berbahan aktif teruji, cocok untuk kulit sensitif. Hasil nyata tanpa janji berlebihan.',
    ctaText: 'Belanja Sekarang',
    ctaHref: '#koleksi',
    image: IMG('photo-1522335789203-aabd1fc54bc9'),
  },
  features: [
    { title: 'BPOM Terdaftar', desc: 'Aman dipakai harian, lolos uji keamanan resmi.' },
    { title: 'Cruelty-Free', desc: 'Tanpa uji pada hewan, ramah & bertanggung jawab.' },
    { title: 'Cocok Kulit Sensitif', desc: 'Bebas alkohol & pewangi keras, pH seimbang.' },
  ],
  showcase: {
    title: 'Produk Terlaris',
    subtitle: 'Rutinitas yang dicintai ribuan pelanggan.',
    items: [
      { nama: 'Gentle Cleanser', harga: 89000, desc: 'Pembersih lembut, tak bikin kulit ketarik.', gambar: IMG('photo-1556228720-195a672e8a03', 800) },
      { nama: 'Vitamin C Serum', harga: 159000, desc: 'Mencerahkan & menyamarkan noda.', gambar: IMG('photo-1571781926291-c477ebfd024b', 800) },
      { nama: 'Hydrating Moisturizer', harga: 129000, desc: 'Lembap seharian, ringan tak lengket.', gambar: IMG('photo-1596462502278-27bfdc403348', 800) },
      { nama: 'Sunscreen SPF 50', harga: 99000, desc: 'Proteksi tinggi, no whitecast.', gambar: IMG('photo-1620916566398-39f1143ab7be', 800) },
    ],
  },
  about: {
    title: 'Kecantikan yang Jujur',
    body: 'Kami percaya kulit indah lahir dari konsistensi, bukan keajaiban semalam. Tiap produk diformulasi bersama dermatolog dan diuji nyata sebelum sampai ke tangan Anda.',
  },
  cta: {
    title: 'Mulai Rutinitas Glowing Anda',
    subtitle: 'Konsultasi gratis untuk jenis kulit Anda.',
    ctaText: 'Chat via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'care@lumiereskin.id', alamat: 'Jakarta Selatan' },
}

// ── Elektronik / Gadget ────────────────────────────────────────
const GADGET: ComposableContent = {
  nama: 'NEXA Gear',
  hero: {
    eyebrow: 'Gadget & Aksesoris Pilihan',
    title: 'Teknologi yang Bikin Hidup Lebih Mudah',
    subtitle:
      'Aksesoris original bergaransi resmi, dikurasi untuk performa dan daya tahan. Bukan barang abal-abal.',
    ctaText: 'Lihat Produk',
    ctaHref: '#koleksi',
    image: IMG('photo-1511707171634-5f897ff02aa9'),
  },
  features: [
    { title: 'Garansi Resmi', desc: '100% original, garansi distributor 1 tahun penuh.' },
    { title: 'Kirim Hari Ini', desc: 'Order sebelum jam 3 sore, langsung kami proses.' },
    { title: 'Uji Sebelum Kirim', desc: 'Tiap unit dicek QC, dijamin nyala & normal.' },
  ],
  showcase: {
    title: 'Produk Unggulan',
    subtitle: 'Gadget terlaris bulan ini.',
    items: [
      { nama: 'TWS Pro ANC', harga: 459000, desc: 'Peredam bising aktif, baterai 30 jam.', gambar: IMG('photo-1505740420928-5e560c06d30e', 800) },
      { nama: 'Powerbank 20.000mAh', harga: 279000, desc: 'Fast charging 22.5W, 3 port.', gambar: IMG('photo-1498049794561-7780e7231661', 800) },
      { nama: 'Smartwatch AMOLED', harga: 699000, desc: 'Pantau detak & tidur, tahan air.', gambar: IMG('photo-1572569511254-d8f925fe2cbb', 800) },
      { nama: 'Keyboard Mekanik', harga: 549000, desc: 'Hot-swap, RGB, switch taktil.', gambar: IMG('photo-1546435770-a3e426bf472b', 800) },
    ],
  },
  about: {
    title: 'Dipercaya 50.000+ Pelanggan',
    body: 'NEXA Gear hadir sejak 2019 sebagai reseller resmi brand teknologi global. Kami hanya menjual yang kami pakai sendiri — itu janji kami.',
  },
  cta: {
    title: 'Upgrade Gadget Anda Hari Ini',
    subtitle: 'Stok terbatas, harga promo akhir bulan.',
    ctaText: 'Order via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'cs@nexagear.id', alamat: 'Bandung, Jawa Barat' },
}

// ── Rumah & Dekor / Furniture ──────────────────────────────────
const RUMAH: ComposableContent = {
  nama: 'Rumah Kayu Studio',
  hero: {
    eyebrow: 'Furnitur & Dekorasi Rumah',
    title: 'Hangatkan Rumah dengan Kayu yang Bercerita',
    subtitle:
      'Furnitur kayu solid buatan pengrajin Jepara, dirancang minimalis untuk hunian modern yang nyaman.',
    ctaText: 'Jelajahi Koleksi',
    ctaHref: '#koleksi',
    image: IMG('photo-1538688525198-9b88f6f53126'),
  },
  features: [
    { title: 'Kayu Solid Pilihan', desc: 'Jati & mahoni bersertifikat, awet lintas generasi.' },
    { title: 'Rakitan Pengrajin', desc: 'Dikerjakan tangan tukang kayu Jepara berpengalaman.' },
    { title: 'Gratis Ongkir Jawa', desc: 'Pengiriman aman, dirakit sampai rapi di rumah.' },
  ],
  showcase: {
    title: 'Koleksi Pilihan',
    subtitle: 'Perabot yang membuat rumah terasa lengkap.',
    items: [
      { nama: 'Sofa Kayu Skandinavia', harga: 4250000, desc: 'Bantal premium, rangka jati.', gambar: IMG('photo-1555041469-a586c61ea9bc', 800) },
      { nama: 'Meja Makan 6 Kursi', harga: 6800000, desc: 'Kayu solid, finishing natural.', gambar: IMG('photo-1567538096630-e0c55bd6374c', 800) },
      { nama: 'Rak Dinding Minimalis', harga: 890000, desc: 'Hemat ruang, kuat menahan beban.', gambar: IMG('photo-1567016432779-094069958ea5', 800) },
      { nama: 'Lemari Pajangan', harga: 3200000, desc: 'Kaca tempered, lampu hangat.', gambar: IMG('photo-1493663284031-b7e3aefcae8e', 800) },
    ],
  },
  about: {
    title: 'Furnitur yang Tumbuh Bersama Anda',
    body: 'Kami merancang perabot yang tak lekang tren — bahan jujur, sambungan kuat, garis bersih. Dibuat untuk dipakai bertahun-tahun, bukan diganti tiap musim.',
  },
  cta: {
    title: 'Wujudkan Rumah Impian Anda',
    subtitle: 'Konsultasi desain interior gratis.',
    ctaText: 'Konsultasi via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'halo@rumahkayustudio.id', alamat: 'Jepara, Jawa Tengah' },
}

// ── Kesehatan & Herbal ─────────────────────────────────────────
const HERBAL: ComposableContent = {
  nama: 'Tanah Herbal',
  hero: {
    eyebrow: 'Produk Herbal Alami',
    title: 'Sehat dari Alam, Diracik dengan Hati',
    subtitle:
      'Madu murni, jamu, dan herbal pilihan langsung dari petani lokal. Tanpa pengawet, tanpa pemanis buatan.',
    ctaText: 'Belanja Herbal',
    ctaHref: '#koleksi',
    image: IMG('photo-1556760544-74068565f05c'),
  },
  features: [
    { title: '100% Murni', desc: 'Tanpa campuran gula atau pengawet kimia apa pun.' },
    { title: 'Dari Petani Lokal', desc: 'Sumber langsung, harga adil untuk petani.' },
    { title: 'Teruji Lab', desc: 'Lolos uji kualitas, aman dikonsumsi keluarga.' },
  ],
  showcase: {
    title: 'Produk Pilihan',
    subtitle: 'Kebaikan alam untuk keluarga Anda.',
    items: [
      { nama: 'Madu Hutan Murni 500g', harga: 145000, desc: 'Panen liar, rasa kaya & alami.', gambar: IMG('photo-1471864190281-a93a3070b6de', 800) },
      { nama: 'Jamu Kunyit Asam', harga: 38000, desc: 'Segar, bantu jaga daya tahan.', gambar: IMG('photo-1597318181409-cf64d0b5d8a2', 800) },
      { nama: 'Teh Herbal Detoks', harga: 65000, desc: 'Racikan daun pilihan, bebas kafein.', gambar: IMG('photo-1564890369478-c89ca6d9cde9', 800) },
      { nama: 'Minyak Esensial Sereh', harga: 89000, desc: 'Aromaterapi menenangkan, 100% alami.', gambar: IMG('photo-1515378791036-0648a3ef77b2', 800) },
    ],
  },
  about: {
    title: 'Kembali ke Alam',
    body: 'Tanah Herbal lahir dari keyakinan bahwa tubuh paling cocok dengan yang alami. Kami bermitra dengan petani di lereng Merbabu untuk menghadirkan herbal terbaik tanpa perantara.',
  },
  cta: {
    title: 'Mulai Hidup Lebih Sehat',
    subtitle: 'Gratis konsultasi pilihan herbal sesuai kebutuhan.',
    ctaText: 'Tanya via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'halo@tanahherbal.id', alamat: 'Magelang, Jawa Tengah' },
}

// ── Bayi & Anak / Mainan ───────────────────────────────────────
const ANAK: ComposableContent = {
  nama: 'Cilukba Kids',
  hero: {
    eyebrow: 'Perlengkapan Bayi & Anak',
    title: 'Teman Tumbuh Kembang si Kecil',
    subtitle:
      'Mainan edukatif & perlengkapan bayi yang aman, ceria, dan bikin belajar jadi menyenangkan.',
    ctaText: 'Lihat Mainan',
    ctaHref: '#koleksi',
    image: IMG('photo-1515488042361-ee00e0ddd4e4'),
  },
  features: [
    { title: 'Bahan Food-Grade', desc: 'Aman digigit, bebas BPA, lolos uji SNI.' },
    { title: 'Merangsang Kreativitas', desc: 'Dirancang bersama psikolog anak.' },
    { title: 'Awet & Tahan Banting', desc: 'Kuat menemani si kecil bermain seharian.' },
  ],
  showcase: {
    title: 'Mainan Favorit',
    subtitle: 'Pilihan terbaik untuk si kecil.',
    items: [
      { nama: 'Balok Susun Kayu', harga: 119000, desc: 'Melatih motorik & warna, cat aman.', gambar: IMG('photo-1522771739844-6a9f6d5f14af', 800) },
      { nama: 'Puzzle Hewan', harga: 75000, desc: 'Kenalkan bentuk & nama hewan seru.', gambar: IMG('photo-1503454537195-1dcabb73ffb9', 800) },
      { nama: 'Boneka Rajut Lembut', harga: 95000, desc: 'Halus dipeluk, jahitan kuat.', gambar: IMG('photo-1545558014-8692077e9b5c', 800) },
      { nama: 'Set Alat Musik Mini', harga: 135000, desc: 'Kenalkan nada & ritme sejak dini.', gambar: IMG('photo-1515488042361-ee00e0ddd4e4', 800) },
    ],
  },
  about: {
    title: 'Bermain Sambil Belajar',
    body: 'Cilukba Kids memilih tiap mainan dengan standar yang sama seperti untuk anak kami sendiri: aman, mendidik, dan menyenangkan. Karena masa kecil cuma sekali.',
  },
  cta: {
    title: 'Bahagiakan si Kecil Hari Ini',
    subtitle: 'Gratis kartu ucapan untuk setiap hadiah.',
    ctaText: 'Pesan via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'halo@cilukbakids.id', alamat: 'Surabaya, Jawa Timur' },
}

// Sub-kategori → konten contoh. Tema diturunkan dari prefix id (mis.
// 'fashion-editorial' → 'fashion'). Catatan: tema Kesehatan memakai id
// berprefix 'herbal-' (branding), jadi kuncinya 'herbal' (bukan 'kesehatan').
const BY_SUBKATEGORI: Record<string, ComposableContent> = {
  kuliner: KULINER,
  fashion: FASHION,
  kerajinan: KERAJINAN,
  kecantikan: KECANTIKAN,
  gadget: GADGET,
  rumah: RUMAH,
  herbal: HERBAL,
  anak: ANAK,
}

export function sampleContentForTheme(themeId: string): ComposableContent {
  const sub = themeId.split('-')[0]
  return BY_SUBKATEGORI[sub] ?? KULINER
}
