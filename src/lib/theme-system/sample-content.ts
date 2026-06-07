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
  social: {
    title: 'Ikuti & Pesan di',
    links: [
      { platform: 'instagram', href: '#', label: '@pempekrigizaf' },
      { platform: 'tiktok', href: '#' },
      { platform: 'whatsapp', href: '#wa' },
      { platform: 'shopee', href: '#' },
    ],
  },
  stats: [
    { angka: '4.9', label: 'Rating pelanggan' },
    { angka: '10rb+', label: 'Porsi terjual' },
    { angka: '8 thn', label: 'Melayani' },
    { angka: '100%', label: 'Ikan tenggiri asli' },
  ],
  testimonials: [
    { quote: 'Pempeknya autentik, cukonya nampol. Sudah langganan bertahun-tahun.', nama: 'Bu Hesti', peran: 'Pelanggan setia' },
    { quote: 'Dikirim frozen, sampai Jakarta masih rapi dan rasanya tetap juara.', nama: 'Andi', peran: 'Pelanggan Jakarta' },
    { quote: 'Cuko-nya beda dari yang lain, beneran resep Palembang.', nama: 'Rina', peran: 'Pelanggan' },
  ],
  faq: [
    { q: 'Apakah bisa kirim luar kota?', a: 'Bisa. Pempek dikemas vacuum + frozen, tahan 1 bulan dan aman dikirim ke seluruh Indonesia.' },
    { q: 'Cuko terpisah atau dicampur?', a: 'Cuko selalu dikemas terpisah dalam botol agar pempek tetap kering dan tahan lama.' },
    { q: 'Bagaimana cara pesan?', a: 'Klik tombol WhatsApp, pilih menu dan jumlah, kami konfirmasi ongkir dan total. Mudah.' },
  ],
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
  stats: [
    { angka: '4.8', label: 'Rating' },
    { angka: '5rb+', label: 'Pelanggan' },
    { angka: '48 jam', label: 'Proses kirim' },
    { angka: '30 hari', label: 'Garansi tukar' },
  ],
  testimonials: [
    { quote: 'Bahannya premium, jahitannya rapi. Worth every rupiah.', nama: 'Dinda', peran: 'Pelanggan' },
    { quote: 'Desainnya timeless, dipakai ke kantor maupun acara tetap pas.', nama: 'Maya', peran: 'Profesional' },
    { quote: 'Packaging-nya elegan, cocok untuk hadiah.', nama: 'Sarah', peran: 'Pelanggan' },
  ],
  faq: [
    { q: 'Apakah ada panduan ukuran?', a: 'Ya, setiap produk dilengkapi size chart detail. Tim kami juga siap bantu via WhatsApp.' },
    { q: 'Bagaimana kebijakan tukar?', a: 'Tukar ukuran gratis dalam 30 hari selama label masih terpasang dan belum dicuci.' },
  ],
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
  stats: [
    { angka: '100%', label: 'Tulis tangan' },
    { angka: '20+', label: 'Perajin mitra' },
    { angka: '4.9', label: 'Rating' },
    { angka: '25 thn', label: 'Melestarikan' },
  ],
  testimonials: [
    { quote: 'Kualitas kainnya istimewa, motifnya halus. Bangga pakai wastra asli.', nama: 'Bu Retno', peran: 'Kolektor' },
    { quote: 'Senang bisa mendukung perajin lokal langsung. Ceritanya juga dikirim.', nama: 'Pak Joko', peran: 'Pelanggan' },
    { quote: 'Cocok untuk hadiah, dikemas sangat rapi dan berkelas.', nama: 'Lia', peran: 'Pelanggan' },
  ],
  faq: [
    { q: 'Apakah ini batik tulis asli?', a: 'Ya, seluruh koleksi dicanting tangan oleh perajin mitra kami, bukan cetak printing.' },
    { q: 'Bagaimana cara merawatnya?', a: 'Cuci dengan lerak atau sabun lembut, jangan diperas, dan jemur di tempat teduh.' },
  ],
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
  stats: [
    { angka: 'BPOM', label: 'Terdaftar' },
    { angka: '50rb+', label: 'Pelanggan' },
    { angka: '4.9', label: 'Rating' },
    { angka: '0%', label: 'Bahan berbahaya' },
  ],
  testimonials: [
    { quote: 'Kulit jadi lebih cerah dan lembap setelah 2 minggu. Suka banget!', nama: 'Tari', peran: 'Pelanggan' },
    { quote: 'Teksturnya ringan, tidak lengket, dan wanginya lembut.', nama: 'Nadia', peran: 'Pelanggan' },
    { quote: 'Aman buat kulit sensitif aku. Sudah repurchase 3x.', nama: 'Vina', peran: 'Pelanggan' },
  ],
  faq: [
    { q: 'Apakah produk sudah BPOM?', a: 'Ya, seluruh produk kami terdaftar BPOM dan teruji aman untuk pemakaian harian.' },
    { q: 'Apakah aman untuk kulit sensitif?', a: 'Formula kami bebas alkohol keras dan pewangi berlebih, cocok untuk kulit sensitif. Tetap disarankan patch test.' },
  ],
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
  stats: [
    { angka: '4.8', label: 'Rating' },
    { angka: '30rb+', label: 'Unit terjual' },
    { angka: '1 thn', label: 'Garansi resmi' },
    { angka: '24 jam', label: 'Kirim cepat' },
  ],
  testimonials: [
    { quote: 'Barang ori, garansi resmi, pengiriman ngebut. Recommended.', nama: 'Rio', peran: 'Pelanggan' },
    { quote: 'Harga bersaing dan after-sales-nya responsif.', nama: 'Bayu', peran: 'Pelanggan' },
    { quote: 'Packing aman pakai bubble tebal, gadget sampai mulus.', nama: 'Dewi', peran: 'Pelanggan' },
  ],
  faq: [
    { q: 'Apakah produk bergaransi resmi?', a: 'Ya, semua produk bergaransi resmi distributor Indonesia, bukan sekadar garansi toko.' },
    { q: 'Berapa lama pengiriman?', a: 'Pesanan sebelum jam 3 sore dikirim hari yang sama. Estimasi tiba 1–3 hari kerja.' },
  ],
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
  stats: [
    { angka: '4.9', label: 'Rating' },
    { angka: '3rb+', label: 'Rumah ditata' },
    { angka: 'Solid', label: 'Kayu jati & mahoni' },
    { angka: '5 thn', label: 'Garansi rangka' },
  ],
  testimonials: [
    { quote: 'Furniturnya kokoh dan finishing-nya halus. Ruang tamu jadi hangat.', nama: 'Pak Hendra', peran: 'Pelanggan' },
    { quote: 'Custom ukuran sesuai ruangan, hasilnya pas banget.', nama: 'Bu Sinta', peran: 'Pelanggan' },
    { quote: 'Kayu solid asli, bukan partikel. Awet bertahun-tahun.', nama: 'Andre', peran: 'Pelanggan' },
  ],
  faq: [
    { q: 'Apakah bisa custom ukuran?', a: 'Bisa. Kirim ukuran dan referensi, tim kami buatkan sesuai kebutuhan ruangan Anda.' },
    { q: 'Apakah kayunya solid?', a: 'Ya, kami memakai kayu jati dan mahoni solid berkualitas, bukan kayu olahan/partikel.' },
  ],
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
  stats: [
    { angka: '100%', label: 'Murni alami' },
    { angka: '12rb+', label: 'Pelanggan' },
    { angka: '4.9', label: 'Rating' },
    { angka: 'Lokal', label: 'Dari petani' },
  ],
  testimonials: [
    { quote: 'Badan terasa lebih segar dan tidur lebih nyenyak. Alami tanpa efek aneh.', nama: 'Bu Wati', peran: 'Pelanggan' },
    { quote: 'Racikannya terasa tradisional asli, bukan instan.', nama: 'Pak Slamet', peran: 'Pelanggan' },
    { quote: 'Madunya kental dan murni, beda dari yang di pasaran.', nama: 'Endah', peran: 'Pelanggan' },
  ],
  faq: [
    { q: 'Apakah produk dijamin murni?', a: 'Ya, produk kami alami tanpa campuran gula/pengawet dan lolos uji kualitas lab.' },
    { q: 'Bagaimana aturan konsumsinya?', a: 'Setiap produk dilengkapi aturan pakai. Untuk kondisi medis tertentu, konsultasikan dulu ke dokter.' },
  ],
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
  stats: [
    { angka: 'SNI', label: 'Berstandar' },
    { angka: '4.9', label: 'Rating' },
    { angka: '15rb+', label: 'Keluarga senang' },
    { angka: '0%', label: 'Bahan berbahaya' },
  ],
  testimonials: [
    { quote: 'Mainannya aman, bahannya tebal, anak betah main berjam-jam.', nama: 'Bunda Sasa', peran: 'Orang tua' },
    { quote: 'Edukatif dan warnanya cerah. Anak belajar sambil bermain.', nama: 'Ibu Ratna', peran: 'Orang tua' },
    { quote: 'Pengiriman cepat dan packing rapi. Cocok buat kado.', nama: 'Pak Dimas', peran: 'Pelanggan' },
  ],
  faq: [
    { q: 'Apakah mainannya aman untuk balita?', a: 'Ya, material food-grade/SNI, tidak tajam, dan bebas BPA. Tetap dampingi anak saat bermain.' },
    { q: 'Untuk usia berapa?', a: 'Setiap produk mencantumkan rekomendasi usia — ada pilihan untuk 0–1, 1–3, dan 3 tahun ke atas.' },
  ],
  contact: { wa: '6281296917963', email: 'halo@cilukbakids.id', alamat: 'Surabaya, Jawa Timur' },
}

// ── RESTAURANT · Warung / Kedai (masakan rumahan) ──────────────
const WARUNG: ComposableContent = {
  nama: 'Warung Bu Tatik',
  hero: {
    eyebrow: 'Masakan Rumahan Sejak 1998',
    title: 'Masakan Rumahan yang Bikin Kangen Rumah',
    subtitle:
      'Dimasak dadakan tiap pagi pakai resep nenek. Porsi mengenyangkan, harga kaki lima, rasa bintang lima.',
    ctaText: 'Lihat Menu',
    ctaHref: '#menu',
    image: IMG('photo-1555126634-323283e090fa'),
  },
  features: [
    { title: 'Dimasak Dadakan', desc: 'Bukan masakan kemarin. Kami masak segar tiap pagi sebelum buka.' },
    { title: 'Porsi Mengenyangkan', desc: 'Nasi boleh nambah. Kami tak hitung sendok, kami hitung kenyang.' },
    { title: 'Harga Bersahabat', desc: 'Makan lengkap mulai 15 ribu. Cocok untuk kantong harian.' },
  ],
  showcase: {
    title: 'Menu Andalan',
    subtitle: 'Yang paling dicari pelanggan tiap hari.',
    items: [
      { nama: 'Ayam Goreng Lengkuas + Nasi', harga: 18000, desc: 'Ayam ungkep bumbu meresap, kremes gurih.' },
      { nama: 'Soto Daging Bening', harga: 20000, desc: 'Kuah kaldu rebus 4 jam, segar tak bikin enek.' },
      { nama: 'Sayur Lodeh Komplit', harga: 13000, desc: 'Santan segar, sayur dari pasar pagi.' },
      { nama: 'Es Teh Poci Gula Batu', harga: 5000, desc: 'Teh tubruk wangi, manis pas.' },
    ],
  },
  stats: [
    { angka: '25+', label: 'Tahun melayani' },
    { angka: '300', label: 'Porsi terjual/hari' },
    { angka: '15rb', label: 'Mulai dari' },
    { angka: '4.8', label: 'Rating Google' },
  ],
  testimonials: [
    { quote: 'Rasanya persis masakan ibu saya dulu. Tiap pulang kampung pasti mampir ke sini.', nama: 'Pak Hendra', peran: 'Pelanggan sejak 2005' },
    { quote: 'Porsinya jujur, harganya jujur. Anak kos terselamatkan tiap akhir bulan.', nama: 'Rina', peran: 'Mahasiswa' },
    { quote: 'Sotonya juara. Kuahnya bening tapi rasanya dalam. Langganan kantor kami.', nama: 'Bu Sari', peran: 'Karyawan' },
  ],
  faq: [
    { q: 'Jam berapa buka?', a: 'Setiap hari pukul 07.00 sampai habis, biasanya sekitar 16.00. Datang lebih awal agar menu masih lengkap.' },
    { q: 'Bisa pesan untuk acara atau kantor?', a: 'Bisa. Untuk nasi kotak dan prasmanan, pesan minimal H-1 lewat WhatsApp.' },
    { q: 'Terima pesan antar?', a: 'Ya, lewat GoFood dan GrabFood, atau WhatsApp untuk antar sekitar warung.' },
  ],
  info: {
    jam: [
      { hari: 'Senin – Jumat', jam: '07.00 – 16.00' },
      { hari: 'Sabtu – Minggu', jam: '07.00 – 17.00' },
    ],
    alamat: 'Jl. Kaliurang KM 5 No. 12, Sleman, Yogyakarta',
    mapsQuery: 'Jl. Kaliurang KM 5 Sleman Yogyakarta',
    telp: '081296917963',
    reservasiText: 'Pesan via WhatsApp',
    reservasiHref: '#wa',
  },
  about: {
    title: 'Dari Dapur Bu Tatik',
    body: 'Berawal dari gerobak kecil tahun 1998, kini Warung Bu Tatik sudah menemani tiga generasi pelanggan. Yang tak pernah berubah: resep, takaran, dan niat menyuguhkan makanan seperti untuk keluarga sendiri.',
  },
  cta: {
    title: 'Lapar? Mampir Sekarang',
    subtitle: 'Pesan antar atau makan di tempat, sama enaknya.',
    ctaText: 'Pesan via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'halo@warungbutatik.id', alamat: 'Sleman, Yogyakarta' },
}

// ── RESTAURANT · Cafe / Coffee Shop ───────────────────────────
const CAFE: ComposableContent = {
  nama: 'Kopi Senja',
  hero: {
    eyebrow: 'Specialty Coffee & Ruang Nyaman',
    title: 'Tempat Kopimu Bertemu Cerita',
    subtitle:
      'Biji single-origin dari petani lokal, diseduh barista bersertifikat. Ruang yang dibuat untuk berlama-lama.',
    ctaText: 'Lihat Menu',
    ctaHref: '#menu',
    image: IMG('photo-1554118811-1e0d58224f24'),
  },
  features: [
    { title: 'Biji Single-Origin', desc: 'Dipanggang mingguan dari petani Gayo, Kintamani, dan Toraja.' },
    { title: 'Barista Bersertifikat', desc: 'Setiap cangkir diseduh tangan yang paham takaran dan suhu.' },
    { title: 'WiFi Kencang & Stop Kontak', desc: 'Banyak colokan, internet stabil. Nyaman kerja seharian.' },
  ],
  showcase: {
    title: 'Menu Favorit',
    subtitle: 'Yang paling sering dipesan tamu.',
    items: [
      { nama: 'Es Kopi Susu Senja', harga: 22000, desc: 'Signature kami. Manis gula aren, kopi tebal.', gambar: IMG('photo-1461023058943-07fcbe16d735', 800) },
      { nama: 'Caffe Latte', harga: 28000, desc: 'Espresso lembut, susu segar steamed.', gambar: IMG('photo-1572442388796-11668a67e53d', 800) },
      { nama: 'Butter Croissant', harga: 25000, desc: 'Dipanggang tiap pagi, renyah berlapis.', gambar: IMG('photo-1555507036-ab1f4038808a', 800) },
      { nama: 'Manual Brew V60', harga: 30000, desc: 'Pilih bijimu, kami seduh di depanmu.', gambar: IMG('photo-1495474472287-4d71bcdd2085', 800) },
    ],
  },
  testimonials: [
    { quote: 'Kopi susunya nagih, tempatnya tenang buat kerja. Sudah jadi kantor kedua saya.', nama: 'Dimas', peran: 'Freelancer' },
    { quote: 'Baristanya ramah dan tahu betul soal kopi. Direkomendasikan untuk yang mau belajar manual brew.', nama: 'Anita', peran: 'Pengunjung' },
    { quote: 'Estetik tanpa bikin kantong jebol. Croissant-nya wajib coba.', nama: 'Bella', peran: 'Mahasiswa' },
  ],
  info: {
    jam: [
      { hari: 'Senin – Jumat', jam: '08.00 – 22.00' },
      { hari: 'Sabtu – Minggu', jam: '09.00 – 23.00' },
    ],
    alamat: 'Jl. Cihampelas No. 88, Bandung',
    mapsQuery: 'Jl. Cihampelas Bandung',
    telp: '081296917963',
    reservasiText: 'Reservasi Meja',
    reservasiHref: '#wa',
  },
  about: {
    title: 'Tentang Kopi Senja',
    body: 'Kami percaya kopi terbaik lahir dari kedekatan: dekat dengan petani, dekat dengan tamu. Sejak 2019 kami menyeduh dengan biji yang kami kenal asalnya, di ruang yang sengaja dibuat untuk memperlambat hari.',
  },
  cta: {
    title: 'Ngopi Dulu, Yuk',
    subtitle: 'Pesan di tempat atau bungkus untuk jalan.',
    ctaText: 'Reservasi via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'halo@kopisenja.id', alamat: 'Bandung, Jawa Barat' },
}

// ── RESTAURANT · Fine Dining / Resto Keluarga ─────────────────
const FINEDINING: ComposableContent = {
  nama: 'Meja Nusantara',
  hero: {
    eyebrow: 'Fine Dining Cita Rasa Indonesia',
    title: 'Hidangan Nusantara, Disajikan Istimewa',
    subtitle:
      'Resep warisan diolah chef berpengalaman, bahan terbaik dari penjuru negeri. Untuk momen yang pantas dirayakan.',
    ctaText: 'Reservasi Meja',
    ctaHref: '#reservasi',
    image: IMG('photo-1414235077428-338989a2e8c0'),
  },
  features: [
    { title: 'Chef Berpengalaman', desc: 'Dipimpin chef dengan 20 tahun mengolah masakan Nusantara.' },
    { title: 'Bahan Pilihan', desc: 'Rempah segar dan bahan premium, dipilih langsung tiap hari.' },
    { title: 'Suasana Berkelas', desc: 'Ruang elegan untuk rapat, ulang tahun, dan jamuan spesial.' },
  ],
  showcase: {
    title: 'Signature Menu',
    subtitle: 'Hidangan kebanggaan dapur kami.',
    items: [
      { nama: 'Iga Bakar Madu Kecombrang', harga: 145000, desc: 'Iga empuk, bumbu meresap, aroma kecombrang.' },
      { nama: 'Bebek Betutu Bali', harga: 165000, desc: 'Diungkep 6 jam dengan base genep otentik.' },
      { nama: 'Gurame Bakar Rica', harga: 135000, desc: 'Gurame segar, sambal rica pedas menggugah.' },
      { nama: 'Es Selendang Mayang', harga: 35000, desc: 'Pencuci mulut klasik Betawi, segar dan legit.' },
    ],
  },
  stats: [
    { angka: '20', label: 'Tahun pengalaman chef' },
    { angka: '50rb+', label: 'Tamu terlayani' },
    { angka: '4.9', label: 'Rating Google' },
    { angka: '120', label: 'Kapasitas kursi' },
  ],
  testimonials: [
    { quote: 'Tempat favorit keluarga untuk merayakan ulang tahun. Pelayanannya hangat, masakannya tak pernah mengecewakan.', nama: 'Keluarga Wijaya', peran: 'Pelanggan setia' },
    { quote: 'Kami adakan jamuan klien di sini. Suasananya pas, hidangannya membanggakan untuk disuguhkan.', nama: 'Bp. Surya', peran: 'Direktur perusahaan' },
    { quote: 'Bebek betutu-nya terbaik yang pernah saya cicipi di luar Bali.', nama: 'Maria', peran: 'Food blogger' },
  ],
  faq: [
    { q: 'Apakah perlu reservasi?', a: 'Untuk akhir pekan dan jam makan malam, kami sangat menyarankan reservasi agar meja terjamin.' },
    { q: 'Bisa untuk acara ulang tahun atau jamuan kantor?', a: 'Tentu. Kami menyediakan ruang semi-privat dan paket jamuan. Hubungi kami untuk pengaturan.' },
    { q: 'Apakah ada pilihan menu tanpa daging?', a: 'Ada beberapa hidangan sayur dan seafood. Beri tahu kami pantangan Anda saat memesan.' },
  ],
  info: {
    jam: [
      { hari: 'Selasa – Minggu', jam: '11.00 – 22.00' },
      { hari: 'Senin', jam: 'Tutup' },
    ],
    alamat: 'Jl. Senopati No. 45, Jakarta Selatan',
    mapsQuery: 'Jl. Senopati Jakarta Selatan',
    telp: '081296917963',
    reservasiText: 'Reservasi Sekarang',
    reservasiHref: '#wa',
  },
  about: {
    title: 'Filosofi Meja Nusantara',
    body: 'Kami menghadirkan kekayaan rasa Nusantara dengan penyajian yang layak dirayakan. Setiap hidangan adalah penghormatan pada resep warisan, diolah dengan ketelitian dan bahan terbaik yang bisa kami dapatkan.',
  },
  cta: {
    title: 'Rayakan Momen Anda Bersama Kami',
    subtitle: 'Meja terbatas tiap malam. Pastikan tempat Anda.',
    ctaText: 'Reservasi via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'reservasi@mejanusantara.id', alamat: 'Jakarta Selatan' },
}

// ── KLINIK · Umum / Gigi ───────────────────────────────────────
const KLINIK_UMUM: ComposableContent = {
  nama: 'Klinik Sehat Sentosa',
  hero: {
    eyebrow: 'Klinik Keluarga Terpercaya',
    title: 'Layanan Kesehatan yang Mengutamakan Anda',
    subtitle:
      'Dokter berpengalaman, antrean online, dan suasana yang menenangkan. Sehat tak perlu menunggu lama.',
    ctaText: 'Buat Janji',
    ctaHref: '#janji',
    image: IMG('photo-1519494026892-80bbd2d6fd0d'),
  },
  features: [
    { title: 'Dokter Berpengalaman', desc: 'Ditangani dokter umum dan spesialis berlisensi resmi.' },
    { title: 'Antrean Online', desc: 'Daftar dari rumah, datang tepat giliran. Tanpa antre lama.' },
    { title: 'Terima BPJS & Asuransi', desc: 'Bekerja sama dengan BPJS dan asuransi swasta utama.' },
  ],
  showcase: {
    title: 'Layanan Kami',
    subtitle: 'Perawatan lengkap untuk seluruh keluarga.',
    items: [
      { nama: 'Pemeriksaan Umum', harga: 50000, desc: 'Konsultasi dokter umum, diagnosa & resep.', gambar: IMG('photo-1579684385127-1ef15d508118', 800) },
      { nama: 'Perawatan Gigi', harga: 150000, desc: 'Scaling, tambal, cabut oleh dokter gigi.', gambar: IMG('photo-1606811841689-23dfddce3e95', 800) },
      { nama: 'Vaksinasi', harga: 200000, desc: 'Imunisasi anak & dewasa, stok lengkap.', gambar: IMG('photo-1612277795421-9bc7706a4a34', 800) },
      { nama: 'Cek Laboratorium', harga: 100000, desc: 'Tes darah, gula, kolesterol. Hasil cepat.', gambar: IMG('photo-1582719508461-905c673771fd', 800) },
    ],
  },
  stats: [
    { angka: '15rb+', label: 'Pasien terlayani' },
    { angka: '12', label: 'Dokter & spesialis' },
    { angka: '4.9', label: 'Rating Google' },
    { angka: '7', label: 'Hari buka/minggu' },
  ],
  testimonials: [
    { quote: 'Dokternya sabar menjelaskan, antreannya rapi. Sekarang seluruh keluarga periksa di sini.', nama: 'Ibu Dewi', peran: 'Pasien keluarga' },
    { quote: 'Daftar online benar-benar hemat waktu. Datang langsung dipanggil.', nama: 'Pak Anton', peran: 'Pasien' },
    { quote: 'Klinik bersih, ramah, dan terima BPJS. Sangat membantu.', nama: 'Sari', peran: 'Pasien BPJS' },
  ],
  gallery: {
    title: 'Fasilitas Kami',
    subtitle: 'Ruang yang bersih dan nyaman untuk pemulihan Anda.',
    images: [
      { src: IMG('photo-1538108149393-fbbd81895907', 700), caption: 'Ruang tunggu nyaman' },
      { src: IMG('photo-1629909613654-28e377c37b09', 700), caption: 'Ruang periksa' },
      { src: IMG('photo-1631217868264-e5b90bb7e133', 700), caption: 'Tim medis' },
      { src: IMG('photo-1666214280557-f1b5022eb634', 700), caption: 'Laboratorium' },
      { src: IMG('photo-1516549655169-df83a0774514', 700), caption: 'Apotek internal' },
    ],
  },
  faq: [
    { q: 'Apakah perlu daftar dulu?', a: 'Disarankan daftar online agar tak menunggu lama, tapi pasien walk-in tetap kami layani sesuai antrean.' },
    { q: 'Apakah menerima BPJS?', a: 'Ya, kami melayani BPJS Kesehatan dan beberapa asuransi swasta. Bawa kartu saat berkunjung.' },
    { q: 'Jam berapa klinik buka?', a: 'Senin sampai Sabtu pukul 08.00 hingga 21.00, Minggu 08.00 hingga 14.00.' },
  ],
  info: {
    jam: [
      { hari: 'Senin – Sabtu', jam: '08.00 – 21.00' },
      { hari: 'Minggu', jam: '08.00 – 14.00' },
    ],
    alamat: 'Jl. Diponegoro No. 21, Semarang',
    mapsQuery: 'Jl. Diponegoro Semarang',
    telp: '081296917963',
    reservasiText: 'Buat Janji via WhatsApp',
    reservasiHref: '#wa',
  },
  about: {
    title: 'Tentang Klinik Sehat Sentosa',
    body: 'Sejak 2010 kami hadir sebagai klinik keluarga di jantung kota. Filosofi kami sederhana: setiap pasien dilayani seperti keluarga sendiri, dengan waktu yang cukup untuk mendengar dan menjelaskan.',
  },
  cta: {
    title: 'Jaga Kesehatan Keluarga Anda',
    subtitle: 'Buat janji hari ini, kami siap melayani.',
    ctaText: 'Buat Janji via WhatsApp',
    ctaHref: '#wa',
  },
  team: [
    { nama: 'dr. Andini Pratiwi', peran: 'Dokter Umum', bio: 'Berpengalaman 12 tahun menangani kesehatan keluarga.' },
    { nama: 'drg. Rio Saputra', peran: 'Dokter Gigi', bio: 'Perawatan gigi modern yang nyaman dan tanpa cemas.' },
    { nama: 'dr. Lina Marlina, Sp.A', peran: 'Spesialis Anak', bio: 'Sabar mendampingi tumbuh kembang si kecil.' },
    { nama: 'Ns. Bayu Anggara', peran: 'Kepala Perawat', bio: 'Memastikan setiap pasien dilayani dengan hangat.' },
  ],
  contact: { wa: '6281296917963', email: 'halo@kliniksehatsentosa.id', alamat: 'Semarang, Jawa Tengah' },
}

// ── KLINIK · Estetik / Skincare (before-after) ─────────────────
const KLINIK_ESTETIK: ComposableContent = {
  nama: 'Klinik Estetika Luna',
  hero: {
    eyebrow: 'Klinik Kecantikan & Dermatologi',
    title: 'Kulit Sehat Bercahaya, Ditangani Ahlinya',
    subtitle:
      'Perawatan berbasis ilmu dermatologi oleh dokter bersertifikat. Hasil nyata, aman, tanpa janji berlebihan.',
    ctaText: 'Konsultasi Gratis',
    ctaHref: '#konsultasi',
    image: IMG('photo-1570172619644-dfd03ed5d881'),
  },
  features: [
    { title: 'Dokter Bersertifikat', desc: 'Ditangani dokter estetika berpengalaman, bukan terapis biasa.' },
    { title: 'Alat Berteknologi', desc: 'Laser dan perangkat modern berstandar medis internasional.' },
    { title: 'Konsultasi Personal', desc: 'Program perawatan disesuaikan dengan kondisi kulit Anda.' },
  ],
  showcase: {
    title: 'Perawatan Unggulan',
    subtitle: 'Pilihan perawatan favorit pasien kami.',
    items: [
      { nama: 'Facial Brightening', harga: 250000, desc: 'Mencerahkan & melembapkan, kulit segar.', gambar: IMG('photo-1512290923902-8a9f81dc236c', 800) },
      { nama: 'Chemical Peeling', harga: 450000, desc: 'Mengangkat sel mati, samarkan noda.', gambar: IMG('photo-1596462502278-27bfdc403348', 800) },
      { nama: 'Laser Rejuvenation', harga: 850000, desc: 'Meremajakan kulit, pori mengecil.', gambar: IMG('photo-1620916566398-39f1143ab7be', 800) },
      { nama: 'Acne Treatment', harga: 350000, desc: 'Program tuntas atasi jerawat membandel.', gambar: IMG('photo-1556228720-195a672e8a03', 800) },
    ],
  },
  testimonials: [
    { quote: 'Jerawat saya yang bertahun-tahun akhirnya membaik. Dokternya jujur soal ekspektasi.', nama: 'Nadia', peran: 'Pasien acne treatment' },
    { quote: 'Wajah terasa lebih cerah setelah beberapa sesi. Tempatnya nyaman dan higienis.', nama: 'Tika', peran: 'Pasien facial' },
    { quote: 'Konsultasinya detail, tidak menjual paket yang tak perlu. Saya percaya di sini.', nama: 'Rani', peran: 'Pasien' },
  ],
  gallery: {
    title: 'Hasil Perawatan',
    subtitle: 'Foto asli pasien, dipublikasikan atas persetujuan.',
    pairs: [
      { before: IMG('photo-1556228578-8c89e6adf883', 600), after: IMG('photo-1556228720-195a672e8a03', 600), label: 'Acne Treatment — 8 minggu' },
      { before: IMG('photo-1612349317150-e413f6a5b16d', 600), after: IMG('photo-1570172619644-dfd03ed5d881', 600), label: 'Brightening — 6 sesi' },
    ],
  },
  faq: [
    { q: 'Apakah aman untuk kulit sensitif?', a: 'Setiap perawatan diawali konsultasi dan analisa kulit. Dokter menyesuaikan tindakan dengan kondisi Anda.' },
    { q: 'Berapa kali perawatan untuk hasil terlihat?', a: 'Bergantung kondisi kulit. Umumnya hasil mulai terlihat setelah 3 sampai 6 sesi, dijelaskan saat konsultasi.' },
    { q: 'Apakah konsultasi berbayar?', a: 'Konsultasi awal gratis. Anda baru memutuskan perawatan setelah memahami pilihan dan biayanya.' },
  ],
  info: {
    jam: [
      { hari: 'Senin – Sabtu', jam: '10.00 – 20.00' },
      { hari: 'Minggu', jam: 'Dengan perjanjian' },
    ],
    alamat: 'Jl. Kemang Raya No. 8, Jakarta Selatan',
    mapsQuery: 'Jl. Kemang Raya Jakarta Selatan',
    telp: '081296917963',
    reservasiText: 'Konsultasi via WhatsApp',
    reservasiHref: '#wa',
  },
  about: {
    title: 'Filosofi Klinik Luna',
    body: 'Kami percaya kecantikan sejati lahir dari kulit yang sehat. Pendekatan kami berbasis bukti ilmiah, mengutamakan keamanan dan kenyamanan, bukan sekadar hasil instan yang tak bertahan.',
  },
  cta: {
    title: 'Mulai Perjalanan Kulit Sehat Anda',
    subtitle: 'Konsultasi gratis dengan dokter kami hari ini.',
    ctaText: 'Konsultasi via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'halo@klinikluna.id', alamat: 'Jakarta Selatan' },
}

// ── KLINIK · Fisio / Wellness ──────────────────────────────────
const KLINIK_WELLNESS: ComposableContent = {
  nama: 'Rumah Terapi Hasta',
  hero: {
    eyebrow: 'Fisioterapi & Pusat Wellness',
    title: 'Pulih Lebih Cepat, Bergerak Tanpa Nyeri',
    subtitle:
      'Terapis tersertifikasi membantu Anda pulih dari cedera dan nyeri kronis, dengan program yang ramah dan terukur.',
    ctaText: 'Jadwalkan Terapi',
    ctaHref: '#jadwal',
    image: IMG('photo-1600334129128-685c5582fd35'),
  },
  features: [
    { title: 'Terapis Tersertifikasi', desc: 'Ditangani fisioterapis berlisensi, bukan pijat biasa.' },
    { title: 'Program Terukur', desc: 'Rencana terapi bertahap dengan evaluasi tiap sesi.' },
    { title: 'Suasana Menenangkan', desc: 'Ruang terapi tenang yang mendukung pemulihan tubuh & pikiran.' },
  ],
  showcase: {
    title: 'Layanan Terapi',
    subtitle: 'Penanganan menyeluruh untuk tubuh yang sehat.',
    items: [
      { nama: 'Fisioterapi', harga: 200000, desc: 'Pemulihan cedera otot, sendi, pascaoperasi.', gambar: IMG('photo-1571019613454-1cb2f99b2d8b', 800) },
      { nama: 'Pijat Terapi', harga: 175000, desc: 'Meredakan nyeri otot & ketegangan.', gambar: IMG('photo-1600334129128-685c5582fd35', 800) },
      { nama: 'Akupunktur', harga: 250000, desc: 'Terapi titik tubuh untuk keseimbangan.', gambar: IMG('photo-1512290923902-8a9f81dc236c', 800) },
      { nama: 'Konsultasi Postur', harga: 150000, desc: 'Analisa postur & saran latihan harian.', gambar: IMG('photo-1544161515-4ab6ce6db874', 800) },
    ],
  },
  stats: [
    { angka: '8rb+', label: 'Sesi terapi' },
    { angka: '95%', label: 'Pasien membaik' },
    { angka: '4.9', label: 'Rating Google' },
    { angka: '6', label: 'Terapis ahli' },
  ],
  testimonials: [
    { quote: 'Setelah cedera lutut, terapi di sini membuat saya bisa jalan normal lagi. Terapisnya telaten.', nama: 'Pak Joko', peran: 'Pasien pascaoperasi' },
    { quote: 'Nyeri punggung saya jauh berkurang. Programnya jelas dan ada evaluasi tiap minggu.', nama: 'Bu Lina', peran: 'Pasien nyeri kronis' },
    { quote: 'Tempatnya tenang, bikin rileks. Pulang badan terasa enteng.', nama: 'Adit', peran: 'Pasien' },
  ],
  gallery: {
    title: 'Ruang Terapi Kami',
    subtitle: 'Tempat yang dirancang untuk ketenangan dan pemulihan.',
    images: [
      { src: IMG('photo-1540555700478-4be289fbecef', 700), caption: 'Ruang terapi' },
      { src: IMG('photo-1571019613454-1cb2f99b2d8b', 700), caption: 'Sesi fisioterapi' },
      { src: IMG('photo-1544161515-4ab6ce6db874', 700), caption: 'Ruang pijat' },
      { src: IMG('photo-1571019614242-c5c5dee9f50b', 700), caption: 'Area latihan' },
      { src: IMG('photo-1545205597-3d9d02c29597', 700), caption: 'Ruang relaksasi' },
    ],
  },
  faq: [
    { q: 'Apakah perlu rujukan dokter?', a: 'Tidak wajib. Anda bisa langsung datang untuk konsultasi awal, kami akan menilai kebutuhan terapi Anda.' },
    { q: 'Berapa lama satu sesi terapi?', a: 'Umumnya 45 sampai 60 menit per sesi, tergantung program yang disusun untuk Anda.' },
  ],
  info: {
    jam: [
      { hari: 'Senin – Jumat', jam: '08.00 – 20.00' },
      { hari: 'Sabtu', jam: '08.00 – 16.00' },
    ],
    alamat: 'Jl. Ahmad Yani No. 17, Surabaya',
    mapsQuery: 'Jl. Ahmad Yani Surabaya',
    telp: '081296917963',
    reservasiText: 'Jadwalkan via WhatsApp',
    reservasiHref: '#wa',
  },
  about: {
    title: 'Tentang Rumah Terapi Hasta',
    body: 'Kami percaya pemulihan terbaik datang dari kombinasi keahlian dan kesabaran. Setiap pasien mendapat program yang disusun khusus, dengan terapis yang menemani sampai Anda benar-benar pulih.',
  },
  cta: {
    title: 'Saatnya Bebas dari Nyeri',
    subtitle: 'Jadwalkan sesi pertama Anda bersama terapis kami.',
    ctaText: 'Jadwalkan via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'halo@terapihasta.id', alamat: 'Surabaya, Jawa Timur' },
}

// ── SEKOLAH · Reguler (SD/SMP/SMA) ─────────────────────────────
const SEKOLAH_REGULER: ComposableContent = {
  nama: 'SMA Bina Bangsa',
  hero: {
    eyebrow: 'Penerimaan Siswa Baru 2026/2027',
    title: 'Tempat Tumbuh Generasi Berprestasi',
    subtitle:
      'Kurikulum modern, guru berdedikasi, dan lingkungan yang menumbuhkan karakter. Siapkan masa depan anak Anda di sini.',
    ctaText: 'Daftar PPDB',
    ctaHref: '#ppdb',
    image: IMG('photo-1571260899304-425eee4c7efc'),
  },
  features: [
    { title: 'Guru Berkompeten', desc: 'Pengajar bersertifikat dengan pendampingan personal tiap siswa.' },
    { title: 'Fasilitas Lengkap', desc: 'Laboratorium, perpustakaan, dan ruang kelas ber-AC yang nyaman.' },
    { title: 'Karakter & Akademik', desc: 'Seimbang membangun nilai akademik dan budi pekerti.' },
  ],
  showcase: {
    title: 'Program Unggulan',
    subtitle: 'Jurusan dan kegiatan yang menyiapkan masa depan.',
    items: [
      { nama: 'Jurusan IPA', desc: 'Fokus sains, persiapan kuliah kedokteran & teknik.', gambar: IMG('photo-1503676260728-1c00da094a0b', 800) },
      { nama: 'Jurusan IPS', desc: 'Ekonomi, sosial, persiapan hukum & bisnis.', gambar: IMG('photo-1427504494785-3a9ca7044f45', 800) },
      { nama: 'Kelas Bahasa', desc: 'Inggris, Jepang, Mandarin dengan native speaker.', gambar: IMG('photo-1546410531-bb4caa6b424d', 800) },
      { nama: 'Ekstrakurikuler', desc: 'Robotik, olahraga, seni, dan kepemimpinan.', gambar: IMG('photo-1509062522246-3755977927d7', 800) },
    ],
  },
  stats: [
    { angka: 'A', label: 'Akreditasi BAN-S/M' },
    { angka: '1.200', label: 'Siswa aktif' },
    { angka: '92%', label: 'Lulus PTN' },
    { angka: '85', label: 'Guru & staf' },
  ],
  testimonials: [
    { quote: 'Anak saya berkembang pesat, bukan hanya nilainya tapi juga kepercayaan dirinya. Gurunya benar-benar peduli.', nama: 'Ibu Ratna', peran: 'Orang tua siswa' },
    { quote: 'Bekal dari sini membuat saya siap kuliah di ITB. Pembelajarannya menantang tapi menyenangkan.', nama: 'Fauzan', peran: 'Alumni 2024' },
    { quote: 'Fasilitasnya lengkap dan lingkungannya positif. Saya tenang menyekolahkan anak di sini.', nama: 'Pak Bambang', peran: 'Orang tua siswa' },
  ],
  gallery: {
    title: 'Kegiatan Sekolah',
    subtitle: 'Momen belajar, berkarya, dan berprestasi.',
    images: [
      { src: IMG('photo-1577896851231-70ef18881754', 700), caption: 'Suasana kelas' },
      { src: IMG('photo-1509062522246-3755977927d7', 700), caption: 'Kegiatan siswa' },
      { src: IMG('photo-1513258496099-48168024aec0', 700), caption: 'Wisuda angkatan' },
      { src: IMG('photo-1503676260728-1c00da094a0b', 700), caption: 'Belajar kelompok' },
      { src: IMG('photo-1571260899304-425eee4c7efc', 700), caption: 'Kebersamaan' },
    ],
  },
  faq: [
    { q: 'Kapan jadwal PPDB dibuka?', a: 'Pendaftaran gelombang 1 dibuka Januari sampai Maret. Kuota terbatas, daftar lebih awal lebih baik.' },
    { q: 'Apakah ada beasiswa?', a: 'Ya, tersedia beasiswa prestasi akademik dan beasiswa untuk keluarga kurang mampu. Tanyakan saat pendaftaran.' },
    { q: 'Bagaimana sistem seleksinya?', a: 'Seleksi meliputi tes akademik dasar dan wawancara. Detail jadwal diberikan setelah pendaftaran.' },
  ],
  info: {
    jam: [
      { hari: 'Senin – Jumat', jam: '07.00 – 16.00' },
      { hari: 'Sabtu', jam: '07.00 – 12.00' },
    ],
    alamat: 'Jl. Pendidikan No. 10, Bandung',
    mapsQuery: 'Jl. Pendidikan Bandung',
    telp: '081296917963',
    reservasiText: 'Daftar PPDB via WhatsApp',
    reservasiHref: '#wa',
  },
  about: {
    title: 'Tentang SMA Bina Bangsa',
    body: 'Berdiri sejak 1995, kami berkomitmen mencetak lulusan yang cerdas, berkarakter, dan siap berkontribusi. Ribuan alumni kami kini berkarya di berbagai bidang di dalam dan luar negeri.',
  },
  cta: {
    title: 'Wujudkan Masa Depan Cerah Anak Anda',
    subtitle: 'Kuota PPDB terbatas. Amankan kursi sekarang.',
    ctaText: 'Daftar via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'ppdb@binabangsa.sch.id', alamat: 'Bandung, Jawa Barat' },
}

// ── SEKOLAH · Islami / Pesantren ───────────────────────────────
const SEKOLAH_ISLAMI: ComposableContent = {
  nama: 'Pesantren Modern Al-Hikmah',
  hero: {
    eyebrow: 'Penerimaan Santri Baru 1448 H',
    title: 'Menjaga Iman, Meraih Ilmu, Meraih Dunia',
    subtitle:
      'Memadukan pendidikan agama yang kokoh dengan sains modern. Mencetak generasi Qurani yang siap menghadapi zaman.',
    ctaText: 'Daftar Santri Baru',
    ctaHref: '#daftar',
    image: IMG('photo-1564769662533-4f00a87b4056'),
  },
  features: [
    { title: 'Tahfidz Terbimbing', desc: 'Program hafalan Al-Qur’an dengan musyrif berpengalaman.' },
    { title: 'Kurikulum Terpadu', desc: 'Ilmu agama dan umum berjalan seimbang, terakreditasi.' },
    { title: 'Asrama Nyaman', desc: 'Lingkungan tertib dan aman, membentuk kemandirian santri.' },
  ],
  showcase: {
    title: 'Program Pendidikan',
    subtitle: 'Membentuk santri yang berilmu dan berakhlak.',
    items: [
      { nama: 'Tahfidz Al-Qur’an', desc: 'Target hafalan terukur dengan metode talaqqi.', gambar: IMG('photo-1585036156171-384164a8c675', 800) },
      { nama: 'Kajian Kitab Kuning', desc: 'Memahami turats dengan bimbingan asatidz.', gambar: IMG('photo-1542816417-0983c9c9ad53', 800) },
      { nama: 'Sains & Teknologi', desc: 'Laboratorium dan literasi digital modern.', gambar: IMG('photo-1503676260728-1c00da094a0b', 800) },
      { nama: 'Asrama 24 Jam', desc: 'Pembinaan ibadah dan adab sepanjang hari.', gambar: IMG('photo-1609599006353-e629aaabfeae', 800) },
    ],
  },
  stats: [
    { angka: '800', label: 'Santri mukim' },
    { angka: '50', label: 'Ustadz & ustadzah' },
    { angka: '30+', label: 'Hafidz per tahun' },
    { angka: 'A', label: 'Akreditasi madrasah' },
  ],
  testimonials: [
    { quote: 'Anak saya menjadi lebih mandiri dan rajin ibadah. Hafalannya terus bertambah dengan bimbingan yang sabar.', nama: 'Ibu Halimah', peran: 'Wali santri' },
    { quote: 'Di sini saya belajar agama sekaligus sains. Bekal yang membuat saya percaya diri melanjutkan ke universitas.', nama: 'Yusuf', peran: 'Alumni' },
    { quote: 'Lingkungannya menjaga adab dan akhlak. Saya tenang menitipkan pendidikan anak di sini.', nama: 'Pak Idris', peran: 'Wali santri' },
  ],
  gallery: {
    title: 'Kehidupan Pesantren',
    subtitle: 'Belajar, beribadah, dan tumbuh bersama.',
    images: [
      { src: IMG('photo-1564769662533-4f00a87b4056', 700), caption: 'Masjid pesantren' },
      { src: IMG('photo-1585036156171-384164a8c675', 700), caption: 'Halaqah tahfidz' },
      { src: IMG('photo-1609599006353-e629aaabfeae', 700), caption: 'Suasana ibadah' },
      { src: IMG('photo-1542816417-0983c9c9ad53', 700), caption: 'Kajian kitab' },
      { src: IMG('photo-1577896851231-70ef18881754', 700), caption: 'Kelas santri' },
    ],
  },
  faq: [
    { q: 'Apakah menerima santri dari luar kota?', a: 'Ya, kami pesantren mukim dengan asrama. Santri dari seluruh Indonesia kami terima.' },
    { q: 'Apakah ada program tahfidz intensif?', a: 'Ada. Tersedia kelas reguler dan kelas tahfidz intensif dengan target hafalan khusus.' },
    { q: 'Bagaimana biaya dan keringanannya?', a: 'Rincian biaya diberikan saat pendaftaran. Tersedia beasiswa untuk santri berprestasi dan yatim.' },
  ],
  info: {
    jam: [
      { hari: 'Senin – Sabtu', jam: '08.00 – 16.00' },
      { hari: 'Ahad', jam: 'Kunjungan dengan perjanjian' },
    ],
    alamat: 'Jl. Pesantren No. 7, Bogor',
    mapsQuery: 'Pesantren Bogor',
    telp: '081296917963',
    reservasiText: 'Daftar via WhatsApp',
    reservasiHref: '#wa',
  },
  about: {
    title: 'Tentang Al-Hikmah',
    body: 'Sejak 1990 kami mendidik generasi yang menyeimbangkan iman, ilmu, dan amal. Alumni kami tersebar sebagai hafidz, akademisi, dan profesional yang menjaga nilai-nilai Islam.',
  },
  cta: {
    title: 'Daftarkan Putra-Putri Anda',
    subtitle: 'Kuota santri baru terbatas tiap tahun ajaran.',
    ctaText: 'Daftar via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'psb@alhikmah.sch.id', alamat: 'Bogor, Jawa Barat' },
}

// ── SEKOLAH · Kursus / Bimbel ──────────────────────────────────
const SEKOLAH_KURSUS: ComposableContent = {
  nama: 'Bimbel Cerdas Juara',
  hero: {
    eyebrow: 'Bimbingan Belajar & Persiapan Ujian',
    title: 'Dari Bingung Jadi Juara',
    subtitle:
      'Tutor ahli, metode terbukti, dan kelas kecil yang fokus. Naikkan nilai dan tembus kampus impian.',
    ctaText: 'Coba Kelas Gratis',
    ctaHref: '#trial',
    image: IMG('photo-1522202176988-66273c2fd55f'),
  },
  features: [
    { title: 'Tutor Berpengalaman', desc: 'Pengajar lulusan PTN top dengan metode yang mudah dipahami.' },
    { title: 'Kelas Kecil', desc: 'Maksimal 10 siswa per kelas, perhatian lebih personal.' },
    { title: 'Garansi Naik Nilai', desc: 'Pendampingan sampai target tercapai, atau ulang gratis.' },
  ],
  showcase: {
    title: 'Pilihan Program',
    subtitle: 'Kelas yang dirancang sesuai kebutuhanmu.',
    items: [
      { nama: 'Bimbel SD – SMP', desc: 'Penguatan konsep dasar semua mata pelajaran.', gambar: IMG('photo-1503676260728-1c00da094a0b', 800) },
      { nama: 'Persiapan UTBK', desc: 'Drilling soal & strategi tembus PTN favorit.', gambar: IMG('photo-1546410531-bb4caa6b424d', 800) },
      { nama: 'English Course', desc: 'Speaking & TOEFL bersama tutor profesional.', gambar: IMG('photo-1516321318423-f06f85e504b3', 800) },
      { nama: 'Coding Bootcamp', desc: 'Belajar ngoding dari nol sampai bikin aplikasi.', gambar: IMG('photo-1531545514256-b1400bc00f31', 800) },
    ],
  },
  stats: [
    { angka: '5.000+', label: 'Alumni' },
    { angka: '95%', label: 'Lulus PTN' },
    { angka: '40', label: 'Tutor ahli' },
    { angka: '12', label: 'Cabang' },
  ],
  testimonials: [
    { quote: 'Nilai matematika saya naik drastis dalam 3 bulan. Tutornya sabar menjelaskan sampai paham.', nama: 'Salsa', peran: 'Siswa SMA' },
    { quote: 'Berkat persiapan UTBK di sini, saya lolos di UGM. Strategi mengerjakan soalnya sangat membantu.', nama: 'Rangga', peran: 'Alumni, kini di UGM' },
    { quote: 'Anak saya jadi semangat belajar. Laporannya rutin, jadi saya tahu perkembangannya.', nama: 'Ibu Yanti', peran: 'Orang tua siswa' },
  ],
  faq: [
    { q: 'Apakah ada kelas coba gratis?', a: 'Ada. Kamu bisa ikut satu sesi coba gratis untuk merasakan metode belajar kami sebelum mendaftar.' },
    { q: 'Apakah kelas tersedia online?', a: 'Ya, tersedia kelas tatap muka di cabang maupun kelas online interaktif. Pilih sesuai kebutuhanmu.' },
    { q: 'Bagaimana garansi naik nilainya?', a: 'Jika target nilai belum tercapai di akhir program, kamu berhak mengulang kelas terkait tanpa biaya tambahan.' },
  ],
  info: {
    jam: [
      { hari: 'Senin – Jumat', jam: '13.00 – 21.00' },
      { hari: 'Sabtu – Minggu', jam: '09.00 – 17.00' },
    ],
    alamat: 'Jl. Sudirman No. 99, Jakarta Pusat',
    mapsQuery: 'Jl. Sudirman Jakarta Pusat',
    telp: '081296917963',
    reservasiText: 'Daftar Kelas Gratis',
    reservasiHref: '#wa',
  },
  about: {
    title: 'Tentang Cerdas Juara',
    body: 'Kami percaya setiap anak bisa juara dengan metode dan pendampingan yang tepat. Sejak 2014, ribuan siswa kami antar menuju kampus impian dan nilai yang membanggakan.',
  },
  cta: {
    title: 'Mulai Perjalanan Juaramu',
    subtitle: 'Ikuti kelas coba gratis minggu ini.',
    ctaText: 'Coba Gratis via WhatsApp',
    ctaHref: '#wa',
  },
  process: {
    title: 'Cara Mulai Belajar',
    subtitle: 'Empat langkah menuju nilai juara.',
    steps: [
      { judul: 'Coba Kelas Gratis', desc: 'Rasakan metode belajar kami tanpa biaya.' },
      { judul: 'Tes Penempatan', desc: 'Kami petakan level dan kebutuhanmu.' },
      { judul: 'Pilih Paket', desc: 'Ambil program yang paling sesuai targetmu.' },
      { judul: 'Mulai & Pantau', desc: 'Belajar rutin dengan laporan progres berkala.' },
    ],
  },
  pricing: {
    title: 'Pilih Paket Belajar',
    subtitle: 'Harga transparan, hasil yang terukur.',
    plans: [
      { nama: 'Reguler', harga: 'Rp350rb', periode: '/bulan', desc: 'Kelas grup, fondasi kuat.', fitur: ['8x pertemuan/bulan', 'Modul & latihan soal', 'Kelas maks. 10 siswa', 'Laporan bulanan'], ctaText: 'Daftar Reguler', ctaHref: '#wa' },
      { nama: 'Intensif UTBK', harga: 'Rp650rb', periode: '/bulan', desc: 'Persiapan tembus PTN.', fitur: ['12x pertemuan/bulan', 'Try out + pembahasan', 'Konsultasi jurusan', 'Garansi naik nilai', 'Grup diskusi tutor'], unggulan: true, ctaText: 'Daftar Intensif', ctaHref: '#wa' },
      { nama: 'Privat', harga: 'Rp1,2jt', periode: '/bulan', desc: 'Belajar 1-on-1 fleksibel.', fitur: ['8x pertemuan privat', 'Jadwal fleksibel', 'Materi disesuaikan', 'Fokus penuh tutor'], ctaText: 'Daftar Privat', ctaHref: '#wa' },
    ],
  },
  contact: { wa: '6281296917963', email: 'halo@cerdasjuara.id', alamat: 'Jakarta Pusat' },
}

// ── PERSONAL · Kreator / Influencer ────────────────────────────
const PERSONAL_KREATOR: ComposableContent = {
  nama: 'Rara Creative',
  hero: {
    eyebrow: 'Content Creator & Storyteller',
    title: 'Cerita yang Menggerakkan, Konten yang Dikenang',
    subtitle:
      'Bantu brand bicara ke audiens lewat konten yang jujur dan relatable. Sudah dipercaya puluhan brand lokal & nasional.',
    ctaText: 'Ajak Kolaborasi',
    ctaHref: '#kolaborasi',
    image: IMG('photo-1517841905240-472988babdf9'),
  },
  features: [
    { title: 'Audiens Loyal', desc: 'Komunitas aktif yang benar-benar mendengar, bukan sekadar angka.' },
    { title: 'Konsep Orisinal', desc: 'Tiap konten dirancang khusus, bukan template pasaran.' },
    { title: 'Hasil Terukur', desc: 'Laporan performa transparan tiap kampanye selesai.' },
  ],
  showcase: {
    title: 'Layanan Saya',
    subtitle: 'Cara kita bisa bekerja bareng.',
    items: [
      { nama: 'Paid Promote', desc: 'Konten promosi yang nyatu dengan gaya feed.', gambar: IMG('photo-1554151228-14d9def656e4', 800) },
      { nama: 'Brand Ambassador', desc: 'Kerja sama jangka panjang membangun brand.', gambar: IMG('photo-1600486913747-55e5470d6f40', 800) },
      { nama: 'Kelas Konten', desc: 'Belajar bikin konten dari nol sampai jadi.', gambar: IMG('photo-1542744173-8e7e53415bb0', 800) },
      { nama: 'Konten Custom', desc: 'Video & foto produk siap pakai untuk brand.', gambar: IMG('photo-1522071820081-009f0129c71c', 800) },
    ],
  },
  stats: [
    { angka: '250rb', label: 'Pengikut' },
    { angka: '8jt+', label: 'Tayangan/bulan' },
    { angka: '60+', label: 'Brand partner' },
    { angka: '4.9', label: 'Rating klien' },
  ],
  testimonials: [
    { quote: 'Kontennya natural dan engagement-nya nyata. Penjualan kami naik signifikan setelah kampanye.', nama: 'Dina', peran: 'Owner brand fashion' },
    { quote: 'Profesional, tepat waktu, dan hasilnya melebihi ekspektasi. Pasti repeat order.', nama: 'Yoga', peran: 'Marketing manager' },
    { quote: 'Bukan cuma cantik, tapi paham audiens. Itu yang bikin beda.', nama: 'Putri', peran: 'Brand owner' },
  ],
  gallery: {
    title: 'Portofolio',
    subtitle: 'Beberapa karya pilihan.',
    images: [
      { src: IMG('photo-1492691527719-9d1e07e534b4', 700), caption: 'Campaign produk' },
      { src: IMG('photo-1539571696357-5a69c17a67c6', 700), caption: 'Sesi foto brand' },
      { src: IMG('photo-1494790108377-be9c29b29330', 700), caption: 'Konten lifestyle' },
      { src: IMG('photo-1600880292203-757bb62b4baf', 700), caption: 'Behind the scene' },
      { src: IMG('photo-1559523161-0fc0d8b38a7a', 700), caption: 'Event & talkshow' },
    ],
  },
  info: {
    jam: [{ hari: 'Respon DM/Email', jam: 'Senin – Jumat, 09.00 – 18.00' }],
    alamat: 'Jakarta, Indonesia (open remote)',
    telp: '081296917963',
    reservasiText: 'Ajak Kolaborasi via WhatsApp',
    reservasiHref: '#wa',
  },
  about: {
    title: 'Halo, Saya Rara',
    body: 'Saya percaya konten terbaik lahir dari cerita yang jujur. Sejak 2018 saya membantu brand terhubung dengan audiens lewat konten yang terasa manusiawi, bukan iklan yang dipaksakan.',
  },
  cta: {
    title: 'Punya Brand yang Ingin Bersinar?',
    subtitle: 'Ceritakan idemu, kita wujudkan bareng.',
    ctaText: 'Hubungi via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'hello@raracreative.id', alamat: 'Jakarta' },
}

// ── PERSONAL · Profesional / Expert ────────────────────────────
const PERSONAL_PROFESIONAL: ComposableContent = {
  nama: 'Andi Pratama, S.H., M.H.',
  hero: {
    eyebrow: 'Konsultan Hukum Bisnis',
    title: 'Solusi Hukum yang Jernih untuk Bisnis Anda',
    subtitle:
      'Pendampingan hukum yang mudah dipahami, bukan jargon membingungkan. Lindungi bisnis Anda sejak langkah pertama.',
    ctaText: 'Jadwalkan Konsultasi',
    ctaHref: '#konsultasi',
    image: IMG('photo-1560250097-0b93528c311a'),
  },
  features: [
    { title: '15 Tahun Pengalaman', desc: 'Menangani ratusan kasus korporasi dan kontrak bisnis.' },
    { title: 'Bahasa yang Jelas', desc: 'Menjelaskan hukum dengan bahasa yang Anda mengerti.' },
    { title: 'Respons Cepat', desc: 'Tanggap menangani urgensi hukum bisnis Anda.' },
  ],
  showcase: {
    title: 'Layanan Saya',
    subtitle: 'Pendampingan hukum untuk setiap kebutuhan.',
    items: [
      { nama: 'Konsultasi Hukum', desc: 'Sesi 1-on-1 membahas masalah hukum Anda.', gambar: IMG('photo-1551836022-d5d88e9218df', 800) },
      { nama: 'Drafting Kontrak', desc: 'Penyusunan & review perjanjian yang aman.', gambar: IMG('photo-1573497019940-1c28c88b4f3e', 800) },
      { nama: 'Pendirian Badan Usaha', desc: 'Urus legalitas PT/CV dari awal sampai sah.', gambar: IMG('photo-1542744173-8e7e53415bb0', 800) },
      { nama: 'Pendampingan Sengketa', desc: 'Mediasi & litigasi melindungi hak Anda.', gambar: IMG('photo-1600880292203-757bb62b4baf', 800) },
    ],
  },
  stats: [
    { angka: '15', label: 'Tahun praktik' },
    { angka: '400+', label: 'Klien terbantu' },
    { angka: '95%', label: 'Kasus selesai baik' },
    { angka: '24 jam', label: 'Respons konsultasi' },
  ],
  testimonials: [
    { quote: 'Penjelasannya jelas dan menenangkan. Kontrak bisnis kami jadi jauh lebih aman.', nama: 'Bp. Hartono', peran: 'Direktur PT' },
    { quote: 'Responsif dan teliti. Membantu kami menghindari masalah hukum sejak awal.', nama: 'Ibu Vina', peran: 'Founder startup' },
    { quote: 'Profesional dan jujur soal peluang. Saya merasa benar-benar didampingi.', nama: 'Rudi', peran: 'Pengusaha' },
  ],
  faq: [
    { q: 'Bagaimana cara konsultasi pertama?', a: 'Jadwalkan lewat WhatsApp. Konsultasi awal 30 menit untuk memahami kebutuhan Anda sebelum melangkah.' },
    { q: 'Apakah melayani konsultasi online?', a: 'Ya, tersedia sesi online via video call maupun tatap muka di kantor.' },
    { q: 'Bagaimana sistem biayanya?', a: 'Transparan sejak awal. Biaya disampaikan jelas setelah memahami lingkup kebutuhan Anda.' },
  ],
  info: {
    jam: [
      { hari: 'Senin – Jumat', jam: '09.00 – 17.00' },
      { hari: 'Sabtu', jam: 'Dengan perjanjian' },
    ],
    alamat: 'Gedung Graha Hukum Lt. 5, Jl. Sudirman, Jakarta',
    mapsQuery: 'Jl. Sudirman Jakarta',
    telp: '081296917963',
    reservasiText: 'Jadwalkan via WhatsApp',
    reservasiHref: '#wa',
  },
  about: {
    title: 'Tentang Saya',
    body: 'Saya mendampingi pelaku usaha agar bisa fokus mengembangkan bisnis tanpa khawatir soal hukum. Bagi saya, hukum yang baik adalah hukum yang bisa dipahami dan melindungi, bukan menakuti.',
  },
  cta: {
    title: 'Lindungi Bisnis Anda Sekarang',
    subtitle: 'Konsultasi awal untuk memahami kebutuhan Anda.',
    ctaText: 'Konsultasi via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'andi@pratamalegal.id', alamat: 'Jakarta' },
}

// ── PERSONAL · Coach / Mentor ──────────────────────────────────
const PERSONAL_COACH: ComposableContent = {
  nama: 'Coach Maya',
  hero: {
    eyebrow: 'Business & Life Coach',
    title: 'Bantu Kamu Bertumbuh, Bukan Sekadar Bermimpi',
    subtitle:
      'Pendampingan personal untuk membuka potensi dan mencapai target nyata. Ratusan klien sudah membuktikan.',
    ctaText: 'Mulai Sesi Pertama',
    ctaHref: '#sesi',
    image: IMG('photo-1573496359142-b8d87734a5a2'),
  },
  features: [
    { title: 'Tersertifikasi', desc: 'Coach bersertifikat dengan metode yang teruji.' },
    { title: 'Program Personal', desc: 'Rencana disusun sesuai tujuan dan ritme kamu.' },
    { title: 'Pendampingan Nyata', desc: 'Bukan motivasi sesaat, tapi langkah konkret tiap minggu.' },
  ],
  showcase: {
    title: 'Layanan Saya',
    subtitle: 'Pilih cara bertumbuh yang paling pas.',
    items: [
      { nama: '1-on-1 Coaching', desc: 'Sesi privat fokus pada tujuanmu.', gambar: IMG('photo-1556761175-5973dc0f32e7', 800) },
      { nama: 'Group Class', desc: 'Bertumbuh bareng komunitas yang sevisi.', gambar: IMG('photo-1522071820081-009f0129c71c', 800) },
      { nama: 'Workshop', desc: 'Sesi intensif untuk skill spesifik.', gambar: IMG('photo-1542744173-8e7e53415bb0', 800) },
      { nama: 'Webinar', desc: 'Belajar dari mana saja, materi terstruktur.', gambar: IMG('photo-1600486913747-55e5470d6f40', 800) },
    ],
  },
  stats: [
    { angka: '1.500+', label: 'Klien terbantu' },
    { angka: '4.9', label: 'Rating peserta' },
    { angka: '50+', label: 'Workshop digelar' },
    { angka: '8', label: 'Tahun mendampingi' },
  ],
  testimonials: [
    { quote: 'Setelah 3 bulan coaching, saya akhirnya berani memulai bisnis sendiri. Arahnya jelas dan terukur.', nama: 'Sandra', peran: 'Klien coaching' },
    { quote: 'Coach Maya jujur dan menantang cara berpikir saya. Hasilnya nyata di karier saya.', nama: 'Bayu', peran: 'Profesional' },
    { quote: 'Bukan sekadar motivasi, tapi langkah yang bisa langsung dijalankan. Worth it.', nama: 'Lia', peran: 'Peserta workshop' },
  ],
  faq: [
    { q: 'Apakah cocok untuk pemula?', a: 'Sangat cocok. Program disesuaikan dengan titik awal kamu, tanpa perlu pengalaman sebelumnya.' },
    { q: 'Sesinya online atau offline?', a: 'Keduanya tersedia. Sesi 1-on-1 fleksibel via video call atau tatap muka sesuai kesepakatan.' },
    { q: 'Berapa lama satu program?', a: 'Umumnya 3 bulan dengan sesi mingguan, namun bisa disesuaikan dengan tujuanmu.' },
  ],
  info: {
    jam: [{ hari: 'Sesi & konsultasi', jam: 'Senin – Sabtu, 09.00 – 20.00' }],
    alamat: 'Bandung, Indonesia (online & offline)',
    telp: '081296917963',
    reservasiText: 'Booking Sesi via WhatsApp',
    reservasiHref: '#wa',
  },
  about: {
    title: 'Kenalan dengan Coach Maya',
    body: 'Saya percaya setiap orang punya potensi besar yang sering terhalang keraguan. Tugas saya menemani kamu menemukan arah, menyusun langkah, dan bertanggung jawab atas pertumbuhanmu sendiri.',
    image: IMG('photo-1573496359142-b8d87734a5a2'),
  },
  cta: {
    title: 'Saatnya Bertumbuh Serius',
    subtitle: 'Booking sesi pertama dan rasakan bedanya.',
    ctaText: 'Booking via WhatsApp',
    ctaHref: '#wa',
  },
  team: [
    { nama: 'Maya Anggraini', peran: 'Lead Coach (ICF Certified)', bio: 'Mendampingi 1.500+ klien menemukan arah dan bertindak.' },
    { nama: 'Reza Pratama', peran: 'Career Coach', bio: 'Spesialis transisi karier dan pengembangan diri.' },
    { nama: 'Dina Saraswati', peran: 'Program Manager', bio: 'Menjaga perjalanan coaching-mu tetap on-track.' },
  ],
  pricing: {
    title: 'Pilih Cara Bertumbuh',
    subtitle: 'Investasi terbaik adalah pada dirimu sendiri.',
    plans: [
      { nama: 'Paket Transformasi 3 Bulan', harga: 'Rp4,5jt', periode: '/program', desc: 'Pendampingan intensif untuk perubahan yang nyata dan terukur.', fitur: ['12 sesi 1-on-1 (mingguan)', 'Asesmen tujuan & rencana aksi', 'Akses WhatsApp antar-sesi', 'Materi & worksheet eksklusif', 'Garansi puas di sesi pertama'], unggulan: true, badge: 'Paling Direkomendasikan', ctaText: 'Booking Sesi Pertama', ctaHref: '#wa' },
    ],
  },
  contact: { wa: '6281296917963', email: 'halo@coachmaya.id', alamat: 'Bandung' },
}

// ── COMPANY · Startup / Tech / SaaS ────────────────────────────
const COMPANY_STARTUP: ComposableContent = {
  nama: 'TechFlow',
  hero: {
    eyebrow: 'Platform Manajemen Bisnis',
    title: 'Kelola Bisnis Lebih Cepat, Tanpa Ribet',
    subtitle:
      'Satu dashboard untuk operasional, tim, dan laporan. Dipakai 2.000+ bisnis untuk tumbuh lebih efisien.',
    ctaText: 'Coba Gratis',
    ctaHref: '#trial',
    image: IMG('photo-1551434678-e076c223a692'),
  },
  features: [
    { title: 'Hemat Waktu', desc: 'Otomatiskan tugas berulang, fokus ke hal yang penting.' },
    { title: 'Data Real-time', desc: 'Pantau performa bisnis kapan saja, dari mana saja.' },
    { title: 'Aman & Andal', desc: 'Enkripsi standar industri, uptime 99,9% terjamin.' },
  ],
  showcase: {
    title: 'Fitur Unggulan',
    subtitle: 'Semua yang bisnismu butuhkan dalam satu tempat.',
    items: [
      { nama: 'Dashboard Analitik', desc: 'Laporan visual yang mudah dipahami.', gambar: IMG('photo-1551434678-e076c223a692', 800) },
      { nama: 'Manajemen Tim', desc: 'Atur peran & tugas tim dengan rapi.', gambar: IMG('photo-1522071820081-009f0129c71c', 800) },
      { nama: 'Integrasi API', desc: 'Hubungkan dengan tools yang sudah kamu pakai.', gambar: IMG('photo-1581091226825-a6a2a5aee158', 800) },
      { nama: 'Support 24/7', desc: 'Tim kami siap membantu kapan pun.', gambar: IMG('photo-1556761175-b413da4baf72', 800) },
    ],
  },
  stats: [
    { angka: '2.000+', label: 'Bisnis pengguna' },
    { angka: '99,9%', label: 'Uptime' },
    { angka: '40%', label: 'Hemat waktu rata-rata' },
    { angka: '4.8', label: 'Rating pengguna' },
  ],
  testimonials: [
    { quote: 'Operasional kami jadi jauh lebih rapi. Laporan yang dulu seharian, kini hitungan menit.', nama: 'Reza', peran: 'COO, retail' },
    { quote: 'Onboarding-nya mudah dan support-nya responsif. Tim langsung nyaman pakai.', nama: 'Maya', peran: 'Ops manager' },
    { quote: 'ROI-nya terasa dalam sebulan. Worth setiap rupiah.', nama: 'Bagus', peran: 'Founder' },
  ],
  faq: [
    { q: 'Apakah ada masa coba gratis?', a: 'Ya, 14 hari gratis tanpa kartu kredit. Bisa upgrade kapan saja.' },
    { q: 'Apakah data kami aman?', a: 'Data dienkripsi dan disimpan di server berstandar keamanan industri, dengan backup rutin.' },
    { q: 'Bisa integrasi dengan tools lain?', a: 'Bisa. Kami menyediakan API dan integrasi siap pakai dengan layanan populer.' },
  ],
  info: {
    jam: [{ hari: 'Support', jam: '24/7 via chat & email' }],
    alamat: 'Cyber 2 Tower, Jl. HR Rasuna Said, Jakarta',
    mapsQuery: 'Cyber 2 Tower Jakarta',
    telp: '081296917963',
    reservasiText: 'Coba Gratis via WhatsApp',
    reservasiHref: '#wa',
  },
  about: {
    title: 'Tentang TechFlow',
    body: 'Kami membangun TechFlow karena percaya bisnis kecil pun berhak punya alat sekelas korporasi. Sejak 2020, misi kami sederhana: bikin teknologi yang benar-benar memudahkan, bukan menambah ribet.',
    image: IMG('photo-1522071820081-009f0129c71c'),
  },
  cta: {
    title: 'Siap Bikin Bisnis Lebih Efisien?',
    subtitle: 'Mulai gratis hari ini, rasakan bedanya.',
    ctaText: 'Mulai via WhatsApp',
    ctaHref: '#wa',
  },
  team: [
    { nama: 'Arya Wibowo', peran: 'CEO & Co-founder', bio: 'Membangun produk yang dipakai ribuan bisnis.' },
    { nama: 'Nadia Putri', peran: 'CTO', bio: 'Memimpin engineering dengan obsesi pada keandalan.' },
    { nama: 'Doni Kurnia', peran: 'Head of Product', bio: 'Menerjemahkan kebutuhan pengguna jadi fitur nyata.' },
    { nama: 'Sinta Lestari', peran: 'Head of Customer Success', bio: 'Memastikan setiap pelanggan benar-benar berhasil.' },
  ],
  process: {
    title: 'Mulai dalam 3 Langkah',
    subtitle: 'Dari daftar sampai jalan, kurang dari 10 menit.',
    steps: [
      { judul: 'Daftar Gratis', desc: 'Buat akun tanpa kartu kredit, langsung aktif.' },
      { judul: 'Hubungkan Data', desc: 'Impor data atau sambungkan tools yang sudah dipakai.' },
      { judul: 'Pantau & Tumbuh', desc: 'Lihat performa real-time, ambil keputusan lebih cepat.' },
    ],
  },
  pricing: {
    title: 'Harga yang Tumbuh Bersamamu',
    subtitle: 'Mulai gratis, upgrade kapan pun. Tanpa biaya tersembunyi.',
    plans: [
      { nama: 'Starter', harga: 'Gratis', periode: 'selamanya', desc: 'Untuk coba-coba & tim kecil.', fitur: ['1 pengguna', '100 transaksi/bln', 'Dashboard dasar', 'Dukungan email'], ctaText: 'Mulai Gratis', ctaHref: '#trial' },
      { nama: 'Growth', harga: 'Rp299rb', periode: '/bulan', desc: 'Untuk bisnis yang berkembang.', fitur: ['10 pengguna', 'Transaksi tanpa batas', 'Dashboard lengkap', 'Integrasi API', 'Dukungan prioritas'], unggulan: true, ctaText: 'Coba 14 Hari', ctaHref: '#trial' },
      { nama: 'Enterprise', harga: 'Custom', desc: 'Untuk skala besar & kebutuhan khusus.', fitur: ['Pengguna tanpa batas', 'SLA & keamanan lanjutan', 'Onboarding khusus', 'Account manager'], ctaText: 'Hubungi Sales', ctaHref: '#wa' },
    ],
  },
  partners: {
    title: 'Dipercaya Tim Hebat',
    logos: [
      { nama: 'Tokopedia' }, { nama: 'Gojek' }, { nama: 'Ruangguru' }, { nama: 'Sirclo' }, { nama: 'Xendit' }, { nama: 'Mekari' },
    ],
  },
  contact: { wa: '6281296917963', email: 'halo@techflow.id', alamat: 'Jakarta' },
}

// ── COMPANY · Agency / Kreatif ─────────────────────────────────
const COMPANY_AGENCY: ComposableContent = {
  nama: 'Loop Studio',
  hero: {
    eyebrow: 'Creative & Digital Agency',
    title: 'Ide Berani untuk Brand yang Berani',
    subtitle:
      'Kami merancang brand dan kampanye yang diingat. Dari strategi sampai eksekusi, semua dalam satu tim.',
    ctaText: 'Mulai Proyek',
    ctaHref: '#proyek',
    image: IMG('photo-1552581234-26160f608093'),
  },
  features: [
    { title: 'Strategi Dulu', desc: 'Setiap karya berangkat dari riset dan tujuan yang jelas.' },
    { title: 'Tim Multidisiplin', desc: 'Desainer, copywriter, dan strategist dalam satu atap.' },
    { title: 'Hasil Terukur', desc: 'Kreativitas yang kami buat untuk mencapai angka nyata.' },
  ],
  showcase: {
    title: 'Layanan Kami',
    subtitle: 'Solusi kreatif menyeluruh untuk brand.',
    items: [
      { nama: 'Branding & Identity', desc: 'Logo, visual, dan panduan brand lengkap.', gambar: IMG('photo-1600880292089-90a7e086ee0c', 800) },
      { nama: 'Social Media', desc: 'Strategi & konten yang bikin brand hidup.', gambar: IMG('photo-1542744173-8e7e53415bb0', 800) },
      { nama: 'Web & App Design', desc: 'Desain digital yang cantik dan fungsional.', gambar: IMG('photo-1581091226825-a6a2a5aee158', 800) },
      { nama: 'Video Production', desc: 'Dari konsep sampai produksi video yang memikat.', gambar: IMG('photo-1486406146926-c627a92ad1ab', 800) },
    ],
  },
  stats: [
    { angka: '320+', label: 'Proyek selesai' },
    { angka: '120', label: 'Brand klien' },
    { angka: '18', label: 'Penghargaan' },
    { angka: '9', label: 'Tahun berkarya' },
  ],
  testimonials: [
    { quote: 'Mereka paham brand kami lebih dari kami sendiri. Hasilnya tajam dan tepat sasaran.', nama: 'Tari', peran: 'Brand manager' },
    { quote: 'Prosesnya kolaboratif dan transparan. Kampanye kami viral berkat ide mereka.', nama: 'Eka', peran: 'Marketing lead' },
    { quote: 'Tim paling kreatif yang pernah kami ajak kerja sama. Sangat direkomendasikan.', nama: 'Dimas', peran: 'CEO' },
  ],
  gallery: {
    title: 'Karya Pilihan',
    subtitle: 'Sebagian proyek yang kami banggakan.',
    images: [
      { src: IMG('photo-1600880292089-90a7e086ee0c', 700), caption: 'Rebranding korporat' },
      { src: IMG('photo-1486406146926-c627a92ad1ab', 700), caption: 'Produksi video' },
      { src: IMG('photo-1454165804606-c3d57bc86b40', 700), caption: 'Kampanye sosial' },
      { src: IMG('photo-1517245386807-bb43f82c33c4', 700), caption: 'Web design' },
      { src: IMG('photo-1542744173-8e7e53415bb0', 700), caption: 'Sesi brainstorming' },
    ],
  },
  info: {
    jam: [{ hari: 'Senin – Jumat', jam: '09.00 – 18.00' }],
    alamat: 'Jl. Kemang Selatan No. 12, Jakarta',
    mapsQuery: 'Jl. Kemang Selatan Jakarta',
    telp: '081296917963',
    reservasiText: 'Mulai Proyek via WhatsApp',
    reservasiHref: '#wa',
  },
  about: {
    title: 'Tentang Loop Studio',
    body: 'Kami sekelompok orang yang percaya ide baik bisa mengubah bisnis. Sejak 2016 kami membantu brand lokal dan nasional bicara dengan cara yang jujur, berani, dan diingat.',
  },
  cta: {
    title: 'Punya Brand yang Mau Naik Level?',
    subtitle: 'Ceritakan tantanganmu, kami racik solusinya.',
    ctaText: 'Diskusi via WhatsApp',
    ctaHref: '#wa',
  },
  contact: { wa: '6281296917963', email: 'hello@loopstudio.id', alamat: 'Jakarta' },
}

// ── COMPANY · Korporat / Manufaktur / B2B ──────────────────────
const COMPANY_KORPORAT: ComposableContent = {
  nama: 'PT Maju Bersama',
  hero: {
    eyebrow: 'Mitra Industri Terpercaya',
    title: 'Membangun Masa Depan Industri Indonesia',
    subtitle:
      'Lebih dari tiga dekade melayani mitra di seluruh nusantara dengan produk berkualitas dan layanan tepat waktu.',
    ctaText: 'Hubungi Kami',
    ctaHref: '#kontak',
    image: IMG('photo-1497366754035-f200968a6e72'),
  },
  features: [
    { title: 'Kualitas Tersertifikasi', desc: 'Standar ISO dan kontrol mutu di setiap tahap produksi.' },
    { title: 'Jaringan Luas', desc: 'Distribusi ke seluruh Indonesia, tepat waktu dan andal.' },
    { title: 'Tim Profesional', desc: 'Didukung tenaga ahli berpengalaman di bidangnya.' },
  ],
  showcase: {
    title: 'Layanan Kami',
    subtitle: 'Solusi menyeluruh untuk kebutuhan industri Anda.',
    items: [
      { nama: 'Manufaktur', desc: 'Produksi presisi dengan kapasitas besar.', gambar: IMG('photo-1581091226825-a6a2a5aee158', 800) },
      { nama: 'Distribusi', desc: 'Logistik andal ke seluruh penjuru negeri.', gambar: IMG('photo-1556761175-b413da4baf72', 800) },
      { nama: 'Konsultasi B2B', desc: 'Pendampingan solusi sesuai kebutuhan mitra.', gambar: IMG('photo-1497366754035-f200968a6e72', 800) },
      { nama: 'Purna Jual', desc: 'Dukungan teknis dan garansi yang terjamin.', gambar: IMG('photo-1521737604893-d14cc237f11d', 800) },
    ],
  },
  stats: [
    { angka: '32', label: 'Tahun pengalaman' },
    { angka: '1.500+', label: 'Mitra bisnis' },
    { angka: '24', label: 'Cabang nasional' },
    { angka: 'ISO', label: 'Tersertifikasi 9001' },
  ],
  testimonials: [
    { quote: 'Mitra yang konsisten menjaga mutu dan ketepatan waktu. Sudah belasan tahun kami bekerja sama.', nama: 'Bp. Wijaya', peran: 'Direktur distributor' },
    { quote: 'Pelayanan profesional dan komunikatif. Solusi mereka membantu efisiensi pabrik kami.', nama: 'Ibu Sri', peran: 'Procurement manager' },
    { quote: 'Kualitas produk stabil dan after-sales-nya bagus. Mitra yang bisa diandalkan.', nama: 'Bp. Hadi', peran: 'Pemilik usaha' },
  ],
  faq: [
    { q: 'Apakah melayani pesanan dalam jumlah besar?', a: 'Ya, kami berpengalaman menangani pesanan skala industri dengan kapasitas produksi besar.' },
    { q: 'Bagaimana jangkauan distribusinya?', a: 'Kami memiliki 24 cabang dan jaringan logistik yang menjangkau seluruh Indonesia.' },
    { q: 'Apakah bisa kerja sama jangka panjang?', a: 'Tentu. Kami terbuka untuk kemitraan strategis jangka panjang dengan skema yang fleksibel.' },
  ],
  info: {
    jam: [
      { hari: 'Senin – Jumat', jam: '08.00 – 17.00' },
      { hari: 'Sabtu', jam: '08.00 – 13.00' },
    ],
    alamat: 'Kawasan Industri MM2100, Bekasi, Jawa Barat',
    mapsQuery: 'Kawasan Industri MM2100 Bekasi',
    telp: '081296917963',
    reservasiText: 'Hubungi via WhatsApp',
    reservasiHref: '#wa',
  },
  about: {
    title: 'Tentang PT Maju Bersama',
    body: 'Berdiri sejak 1992, kami tumbuh bersama industri Indonesia. Komitmen kami tidak berubah: kualitas yang konsisten, layanan yang tepat waktu, dan kemitraan yang saling menumbuhkan.',
  },
  cta: {
    title: 'Mari Bertumbuh Bersama',
    subtitle: 'Diskusikan kebutuhan industri Anda dengan tim kami.',
    ctaText: 'Hubungi via WhatsApp',
    ctaHref: '#wa',
  },
  process: {
    title: 'Cara Kami Bekerja',
    subtitle: 'Proses teruji, dari diskusi awal sampai purna jual.',
    steps: [
      { judul: 'Konsultasi Kebutuhan', desc: 'Memahami spesifikasi dan target Anda secara detail.' },
      { judul: 'Penawaran & Perencanaan', desc: 'Menyusun solusi, jadwal, dan estimasi yang transparan.' },
      { judul: 'Produksi & Quality Control', desc: 'Pengerjaan presisi dengan kontrol mutu berstandar ISO.' },
      { judul: 'Distribusi Tepat Waktu', desc: 'Pengiriman andal ke seluruh jaringan nasional.' },
      { judul: 'Dukungan Purna Jual', desc: 'Garansi dan dukungan teknis yang berkelanjutan.' },
    ],
  },
  partners: {
    title: 'Mitra & Klien Kami',
    logos: [
      { nama: 'Astra' }, { nama: 'Pertamina' }, { nama: 'Wijaya Karya' }, { nama: 'Pupuk Indonesia' }, { nama: 'Semen Gresik' }, { nama: 'Krakatau Steel' }, { nama: 'PLN' },
    ],
  },
  contact: { wa: '6281296917963', email: 'corporate@majubersama.co.id', alamat: 'Bekasi, Jawa Barat' },
}

// ── TRAVEL · Rental Kendaraan ──────────────────────────────────
const TRAVEL_KENDARAAN: ComposableContent = {
  nama: 'AutoRent',
  hero: { eyebrow: 'Rental Mobil & Motor Terpercaya', title: 'Sewa Kendaraan, Gampang & Tanpa Ribet', subtitle: 'Armada terawat, harga transparan, antar-jemput. Lepas kunci atau dengan sopir, semua siap.', ctaText: 'Pesan Sekarang', ctaHref: '#booking', image: IMG('photo-1503376780353-7e6692767b70') },
  features: [
    { title: 'Armada Terawat', desc: 'Servis rutin & bersih, siap pakai setiap saat.' },
    { title: 'Harga Transparan', desc: 'Tanpa biaya tersembunyi, semua jelas di awal.' },
    { title: 'Antar-Jemput', desc: 'Diantar ke lokasi Anda, gratis area kota.' },
  ],
  showcase: { title: 'Pilihan Kami', subtitle: 'Armada untuk setiap kebutuhan.', items: [
    { nama: 'Toyota Avanza', harga: 350000, desc: 'Per hari, cocok keluarga.', gambar: IMG('photo-1568605117036-5fe5e7bab0b7', 800) },
    { nama: 'Honda Brio', harga: 300000, desc: 'Irit & lincah untuk kota.', gambar: IMG('photo-1502877338535-766e1452684a', 800) },
    { nama: 'Innova Reborn', harga: 550000, desc: 'Nyaman untuk perjalanan jauh.', gambar: IMG('photo-1485291571150-772bcfc10da5', 800) },
    { nama: 'Motor Vario', harga: 90000, desc: 'Praktis keliling kota.', gambar: IMG('photo-1449965408869-eaa3f722e40d', 800) },
  ] },
  stats: [{ angka: '120+', label: 'Unit armada' }, { angka: '10', label: 'Tahun melayani' }, { angka: '5', label: 'Kota layanan' }, { angka: '4.9', label: 'Rating Google' }],
  testimonials: [
    { quote: 'Mobilnya bersih, prosesnya cepat. Antar-jemputnya tepat waktu.', nama: 'Rian', peran: 'Pelanggan' },
    { quote: 'Harga jelas tanpa kejutan. Sudah langganan tiap mudik.', nama: 'Bu Endah', peran: 'Pelanggan setia' },
    { quote: 'Sopirnya ramah dan paham jalan. Recommended.', nama: 'Pak Yusuf', peran: 'Pelanggan' },
  ],
  faq: [
    { q: 'Apa syarat sewanya?', a: 'KTP dan SIM aktif. Untuk lepas kunci ada jaminan tambahan yang dijelaskan saat booking.' },
    { q: 'Bisa antar ke bandara?', a: 'Bisa. Layanan antar-jemput bandara tersedia dengan biaya sesuai jarak.' },
    { q: 'Apakah ada sopir?', a: 'Tersedia opsi lepas kunci maupun dengan sopir berpengalaman.' },
  ],
  info: { jam: [{ hari: 'Setiap hari', jam: '06.00 – 22.00' }], alamat: 'Jl. Diponegoro No. 45, Yogyakarta', mapsQuery: 'Jl. Diponegoro Yogyakarta', telp: '081296917963', reservasiText: 'Pesan via WhatsApp', reservasiHref: '#wa' },
  about: { title: 'Tentang AutoRent', body: 'Sejak 2014 kami melayani ribuan perjalanan dengan armada terawat dan layanan yang jujur. Tujuan kami sederhana: bikin sewa kendaraan jadi tenang, bukan bikin pusing.' },
  cta: { title: 'Siap Jalan? Pesan Sekarang', subtitle: 'Cek ketersediaan unit untuk tanggalmu.', ctaText: 'Pesan via WhatsApp', ctaHref: '#wa' },
  contact: { wa: '6281296917963', email: 'halo@autorent.id', alamat: 'Yogyakarta' },
}

// ── TRAVEL · Wisata / Tour ─────────────────────────────────────
const TRAVEL_WISATA: ComposableContent = {
  nama: 'Pesona Trip',
  hero: { eyebrow: 'Open Trip & Paket Wisata', title: 'Jelajah Indonesia, Bikin Kenangan', subtitle: 'Paket wisata hemat dengan guide lokal berpengalaman. Tinggal berangkat, sisanya kami urus.', ctaText: 'Lihat Paket', ctaHref: '#paket', image: IMG('photo-1502602898657-3e91760cbb34') },
  features: [
    { title: 'Guide Lokal', desc: 'Pemandu ramah yang paham tiap destinasi.' },
    { title: 'Harga Hemat', desc: 'Open trip patungan, lebih terjangkau.' },
    { title: 'Itinerary Jelas', desc: 'Jadwal rapi, tanpa drama, anti molor.' },
  ],
  showcase: { title: 'Pilihan Kami', subtitle: 'Petualangan yang menanti.', items: [
    { nama: 'Open Trip Bromo', harga: 350000, desc: 'Sunrise & lautan pasir.', gambar: IMG('photo-1501785888041-af3ef285b470', 800) },
    { nama: 'Private Tour Bali', harga: 1200000, desc: 'Custom sesuai maumu.', gambar: IMG('photo-1502602898657-3e91760cbb34', 800) },
    { nama: 'Snorkeling Komodo', harga: 2500000, desc: '3D2N kapal phinisi.', gambar: IMG('photo-1469854523086-cc02fe5d8800', 800) },
    { nama: 'City Tour Jogja', harga: 250000, desc: 'Keraton, Malioboro, candi.', gambar: IMG('photo-1528127269322-539801943592', 800) },
  ] },
  stats: [{ angka: '8rb+', label: 'Peserta trip' }, { angka: '40+', label: 'Destinasi' }, { angka: '4.9', label: 'Rating' }, { angka: '9', label: 'Tahun jalan' }],
  testimonials: [
    { quote: 'Tripnya seru, guide-nya asik, jadwalnya tepat. Pasti ikut lagi!', nama: 'Sasa', peran: 'Peserta open trip' },
    { quote: 'Harga ramah kantong tapi pelayanan maksimal. Salut.', nama: 'Doni', peran: 'Backpacker' },
    { quote: 'Honeymoon kami diurus sempurna. Terima kasih Pesona Trip.', nama: 'Pasangan Wira', peran: 'Private tour' },
  ],
  gallery: { title: 'Galeri Perjalanan', subtitle: 'Momen dari trip-trip kami.', images: [
    { src: IMG('photo-1501785888041-af3ef285b470', 700), caption: 'Bromo' },
    { src: IMG('photo-1469854523086-cc02fe5d8800', 700), caption: 'Pantai' },
    { src: IMG('photo-1528127269322-539801943592', 700), caption: 'Hutan' },
    { src: IMG('photo-1502602898657-3e91760cbb34', 700), caption: 'Sunset' },
    { src: IMG('photo-1455587734955-081b22074882', 700), caption: 'Resort' },
  ] },
  info: { jam: [{ hari: 'Senin – Sabtu', jam: '08.00 – 20.00' }], alamat: 'Jl. Kaliurang KM 7, Yogyakarta', mapsQuery: 'Jl. Kaliurang Yogyakarta', telp: '081296917963', reservasiText: 'Tanya Paket via WhatsApp', reservasiHref: '#wa' },
  about: { title: 'Tentang Pesona Trip', body: 'Kami percaya jalan-jalan harusnya menyenangkan dari awal sampai pulang. Sejak 2016 kami merancang trip yang rapi, hemat, dan penuh cerita bersama guide lokal terbaik.' },
  cta: { title: 'Yuk, Rencanakan Tripmu', subtitle: 'Slot open trip terbatas tiap keberangkatan.', ctaText: 'Tanya via WhatsApp', ctaHref: '#wa' },
  contact: { wa: '6281296917963', email: 'halo@pesonatrip.id', alamat: 'Yogyakarta' },
}

// ── TRAVEL · Akomodasi / Sewa ──────────────────────────────────
const TRAVEL_AKOMODASI: ComposableContent = {
  nama: 'Villa Serenity',
  hero: { eyebrow: 'Villa & Penginapan Nyaman', title: 'Tempat Singgah yang Terasa Seperti Rumah', subtitle: 'Kamar bersih, suasana tenang, lokasi strategis. Liburan nyaman tanpa khawatir.', ctaText: 'Cek Ketersediaan', ctaHref: '#booking', image: IMG('photo-1571896349842-33c89424de2d') },
  features: [
    { title: 'Bersih & Nyaman', desc: 'Kamar rapi, seprai segar tiap tamu.' },
    { title: 'Lokasi Strategis', desc: 'Dekat tempat wisata & pusat kota.' },
    { title: 'Check-in Mudah', desc: 'Proses cepat, ramah, fleksibel.' },
  ],
  showcase: { title: 'Pilihan Kami', subtitle: 'Pilih tipe yang paling pas.', items: [
    { nama: 'Deluxe Room', harga: 450000, desc: 'Per malam, untuk 2 orang.', gambar: IMG('photo-1571003123894-1f0594d2b5d9', 800) },
    { nama: 'Private Villa', harga: 1500000, desc: 'Kolam pribadi, 3 kamar.', gambar: IMG('photo-1566073771259-6a8506099945', 800) },
    { nama: 'Family Suite', harga: 850000, desc: 'Luas untuk keluarga.', gambar: IMG('photo-1582719478250-c89cae4dc85b', 800) },
    { nama: 'Garden Bungalow', harga: 600000, desc: 'View taman asri.', gambar: IMG('photo-1455587734955-081b22074882', 800) },
  ] },
  stats: [{ angka: '4.9', label: 'Rating tamu' }, { angka: '12', label: 'Unit kamar' }, { angka: '6rb+', label: 'Tamu menginap' }, { angka: '24 jam', label: 'Resepsionis' }],
  testimonials: [
    { quote: 'Kamarnya bersih banget, pemandangannya juara. Pasti balik lagi.', nama: 'Mira', peran: 'Tamu' },
    { quote: 'Pelayanan ramah, lokasi dekat ke mana-mana. Recommended.', nama: 'Pak Gun', peran: 'Tamu keluarga' },
    { quote: 'Villanya cozy, cocok buat healing. Worth it.', nama: 'Nadia', peran: 'Tamu' },
  ],
  gallery: { title: 'Galeri Penginapan', subtitle: 'Intip suasananya.', images: [
    { src: IMG('photo-1566073771259-6a8506099945', 700), caption: 'Eksterior' },
    { src: IMG('photo-1571003123894-1f0594d2b5d9', 700), caption: 'Kamar deluxe' },
    { src: IMG('photo-1582719478250-c89cae4dc85b', 700), caption: 'Ruang keluarga' },
    { src: IMG('photo-1571896349842-33c89424de2d', 700), caption: 'Kolam' },
    { src: IMG('photo-1455587734955-081b22074882', 700), caption: 'Taman' },
  ] },
  faq: [
    { q: 'Jam berapa check-in?', a: 'Check-in mulai pukul 14.00, check-out pukul 12.00. Early check-in menyesuaikan ketersediaan.' },
    { q: 'Apakah termasuk sarapan?', a: 'Beberapa tipe kamar sudah termasuk sarapan. Detailnya tertera saat pemesanan.' },
  ],
  info: { jam: [{ hari: 'Resepsionis', jam: '24 jam' }], alamat: 'Jl. Pantai Batu Bolong, Canggu, Bali', mapsQuery: 'Batu Bolong Canggu Bali', telp: '081296917963', reservasiText: 'Booking via WhatsApp', reservasiHref: '#wa' },
  about: { title: 'Tentang Villa Serenity', body: 'Kami merancang setiap sudut untuk kenyamanan tamu. Dari seprai bersih sampai senyum resepsionis, tujuan kami satu: membuat Anda merasa di rumah, di mana pun Anda berlibur.' },
  cta: { title: 'Liburan Nyaman Menanti', subtitle: 'Cek tanggal & amankan kamarmu.', ctaText: 'Booking via WhatsApp', ctaHref: '#wa' },
  contact: { wa: '6281296917963', email: 'stay@villaserenity.id', alamat: 'Canggu, Bali' },
}

// ── BLOG · Jurnal / Pribadi ────────────────────────────────────
const BLOG_JURNAL: ComposableContent = {
  nama: 'Catatan Senja',
  hero: { eyebrow: 'Jurnal & Cerita Sehari-hari', title: 'Menulis Pelan, Membaca Dalam', subtitle: 'Catatan tentang hidup, buku, dan perjalanan kecil. Tempat berpikir tanpa terburu-buru.', ctaText: 'Baca Tulisan', ctaHref: '#tulisan', image: IMG('photo-1455390582262-044cdead277a') },
  features: [
    { title: 'Cerita Jujur', desc: 'Ditulis dari pengalaman, bukan template.' },
    { title: 'Terbit Rutin', desc: 'Tulisan baru tiap minggu, konsisten.' },
    { title: 'Tanpa Iklan', desc: 'Fokus membaca, bebas gangguan.' },
  ],
  showcase: { title: 'Artikel Terbaru', subtitle: 'Beberapa tulisan pilihan.', items: [
    { nama: 'Belajar Pelan dari Hujan', desc: 'Refleksi sore yang basah.', gambar: IMG('photo-1504711434969-e33886168f5c', 800) },
    { nama: 'Buku yang Mengubah Cara Pandang', desc: 'Catatan bacaan bulan ini.', gambar: IMG('photo-1486312338219-ce68d2c6f44d', 800) },
    { nama: 'Perjalanan Kecil ke Timur', desc: 'Cerita dari jalan sunyi.', gambar: IMG('photo-1469854523086-cc02fe5d8800', 800) },
    { nama: 'Tentang Memulai Lagi', desc: 'Sedikit soal keberanian.', gambar: IMG('photo-1455390582262-044cdead277a', 800) },
  ] },
  faq: [
    { q: 'Seberapa sering terbit?', a: 'Tulisan baru rilis setiap minggu, biasanya akhir pekan.' },
    { q: 'Bisa berlangganan?', a: 'Bisa. Tinggalkan email lewat tombol kontak untuk dapat kabar tulisan baru.' },
  ],
  about: { title: 'Halo, Saya Penulisnya', body: 'Catatan Senja lahir dari kebiasaan menulis di penghujung hari. Tak ada target muluk, hanya keinginan merekam pikiran dan berbagi dengan siapa pun yang mampir.' },
  cta: { title: 'Suka Tulisan Pelan?', subtitle: 'Berlangganan, gratis selamanya.', ctaText: 'Hubungi via WhatsApp', ctaHref: '#wa' },
  contact: { wa: '6281296917963', email: 'halo@catatansenja.id', alamat: 'Indonesia' },
}

// ── BLOG · Media / Berita ──────────────────────────────────────
const BLOG_MEDIA: ComposableContent = {
  nama: 'Kabar Hari Ini',
  hero: { eyebrow: 'Portal Berita Tepercaya', title: 'Berita Cepat, Jelas, dan Berimbang', subtitle: 'Liputan terkini dari ekonomi, teknologi, sampai gaya hidup. Tanpa hoaks, tanpa bertele-tele.', ctaText: 'Baca Berita', ctaHref: '#berita', image: IMG('photo-1542435503-956c469947f6') },
  features: [
    { title: 'Update 24 Jam', desc: 'Kabar terbaru sepanjang hari.' },
    { title: 'Terverifikasi', desc: 'Setiap berita dicek sebelum tayang.' },
    { title: 'Beragam Rubrik', desc: 'Dari headline sampai opini.' },
  ],
  showcase: { title: 'Artikel Terbaru', subtitle: 'Sorotan hari ini.', items: [
    { nama: 'Ekonomi Tumbuh di Kuartal Ini', desc: 'Analisis & data terbaru.', gambar: IMG('photo-1486312338219-ce68d2c6f44d', 800) },
    { nama: 'Tren Teknologi Tahun Depan', desc: 'Apa yang perlu disimak.', gambar: IMG('photo-1504711434969-e33886168f5c', 800) },
    { nama: 'Panduan Gaya Hidup Sehat', desc: 'Tips dari para ahli.', gambar: IMG('photo-1499750310107-5fef28a66643', 800) },
    { nama: 'Sorotan Olahraga Pekan Ini', desc: 'Hasil & jadwal lengkap.', gambar: IMG('photo-1542435503-956c469947f6', 800) },
  ] },
  stats: [{ angka: '2jt+', label: 'Pembaca/bulan' }, { angka: '150+', label: 'Artikel/minggu' }, { angka: '12', label: 'Rubrik' }, { angka: '24/7', label: 'Liputan' }],
  faq: [
    { q: 'Apakah beritanya berbayar?', a: 'Sebagian besar gratis. Konten premium tertentu memerlukan langganan.' },
    { q: 'Bagaimana memastikan akurasi?', a: 'Setiap berita melalui proses verifikasi dan editorial sebelum dipublikasikan.' },
  ],
  about: { title: 'Tentang Kabar Hari Ini', body: 'Kami hadir untuk menyajikan informasi yang cepat tanpa mengorbankan akurasi. Redaksi kami berkomitmen pada jurnalisme yang berimbang dan bebas dari kepentingan.' },
  cta: { title: 'Tetap Update Setiap Hari', subtitle: 'Berlangganan kabar terbaru.', ctaText: 'Hubungi via WhatsApp', ctaHref: '#wa' },
  contact: { wa: '6281296917963', email: 'redaksi@kabarhariini.id', alamat: 'Jakarta' },
}

// ── BLOG · Niche (food/lifestyle) ──────────────────────────────
const BLOG_NICHE: ComposableContent = {
  nama: 'Dapur Kita',
  hero: { eyebrow: 'Blog Resep & Kuliner', title: 'Masak Enak, Mulai dari Dapur Rumah', subtitle: 'Resep praktis anti-gagal, tips dapur, dan cerita di balik tiap hidangan. Yuk, masak bareng!', ctaText: 'Lihat Resep', ctaHref: '#resep', image: IMG('photo-1504674900247-0877df9cc836') },
  features: [
    { title: 'Resep Anti-Gagal', desc: 'Langkah jelas, takaran pas, foto tiap step.' },
    { title: 'Bahan Mudah', desc: 'Pakai bahan yang ada di pasar dekat rumah.' },
    { title: 'Dicoba Sendiri', desc: 'Setiap resep kami masak & cicipi dulu.' },
  ],
  showcase: { title: 'Artikel Terbaru', subtitle: 'Resep yang lagi ramai dimasak.', items: [
    { nama: 'Ayam Geprek Sambal Bawang', desc: 'Pedasnya nampol, gampang dibuat.', gambar: IMG('photo-1504674900247-0877df9cc836', 800) },
    { nama: 'Brownies Kukus Lembut', desc: 'Tanpa oven, tetap legit.', gambar: IMG('photo-1490645935967-10de6ba17061', 800) },
    { nama: 'Es Kopi Susu Rumahan', desc: 'Hemat, rasa kafe.', gambar: IMG('photo-1461023058943-07fcbe16d735', 800) },
    { nama: 'Tips Menyimpan Sayur', desc: 'Biar segar lebih lama.', gambar: IMG('photo-1542435503-956c469947f6', 800) },
  ] },
  testimonials: [
    { quote: 'Resepnya selalu berhasil! Keluarga di rumah suka semua.', nama: 'Bunda Ratih', peran: 'Pembaca setia' },
    { quote: 'Penjelasannya detail, cocok buat pemula seperti saya.', nama: 'Fina', peran: 'Pembaca' },
    { quote: 'Foto step by step-nya sangat membantu. Terima kasih!', nama: 'Oki', peran: 'Pembaca' },
  ],
  faq: [
    { q: 'Apakah resepnya gratis?', a: 'Semua resep gratis dibaca. Kamu bisa langsung praktik di rumah.' },
    { q: 'Bisa request resep?', a: 'Bisa! Kirim permintaan lewat kontak, kami usahakan bahas di tulisan berikutnya.' },
  ],
  about: { title: 'Tentang Dapur Kita', body: 'Dapur Kita berawal dari kebiasaan berbagi resep keluarga. Kini kami ingin setiap orang berani masak sendiri, dengan panduan yang jujur dan mudah diikuti.' },
  cta: { title: 'Lapar? Yuk Masak!', subtitle: 'Dapatkan resep baru tiap minggu.', ctaText: 'Hubungi via WhatsApp', ctaHref: '#wa' },
  contact: { wa: '6281296917963', email: 'halo@dapurkita.id', alamat: 'Indonesia' },
}

// ── JASTIP · Luar Negeri ───────────────────────────────────────
const JASTIP_LUAR: ComposableContent = {
  nama: 'GlobalJastip',
  hero: { eyebrow: 'Jasa Titip Luar Negeri', title: 'Barang Impian dari Luar, Sampai ke Tanganmu', subtitle: 'Titip beli produk original dari LN: skincare, branded, gadget. Aman, terpercaya, harga jujur.', ctaText: 'Mulai Titip', ctaHref: '#titip', image: IMG('photo-1521791136064-7986c2920216') },
  features: [
    { title: '100% Original', desc: 'Dibeli langsung dari toko resmi.' },
    { title: 'Update Real-time', desc: 'Foto bukti beli & resi dikirim.' },
    { title: 'Harga Transparan', desc: 'Rate & fee jelas sejak awal.' },
  ],
  showcase: { title: 'Katalog Titipan', subtitle: 'Yang paling sering dititip.', items: [
    { nama: 'Skincare Korea', harga: 250000, desc: 'Dari Olive Young & toko resmi.', gambar: IMG('photo-1556909212-d5b604d0c90d', 800) },
    { nama: 'Tas Branded', harga: 5000000, desc: 'Boutique Eropa, bukti lengkap.', gambar: IMG('photo-1556910103-1c02745aae4d', 800) },
    { nama: 'Sneakers Hype', harga: 2800000, desc: 'Rilis terbatas, langsung gas.', gambar: IMG('photo-1607082348824-0a96f2a4b9da', 800) },
    { nama: 'Vitamin & Suplemen', harga: 350000, desc: 'Dari US & Australia.', gambar: IMG('photo-1607083206869-4c7672e72a8a', 800) },
  ] },
  stats: [{ angka: '12rb+', label: 'Pesanan' }, { angka: '15', label: 'Negara' }, { angka: '4.9', label: 'Rating' }, { angka: '100%', label: 'Original' }],
  testimonials: [
    { quote: 'Amanah banget, dikabarin tiap tahap. Barang ori sampai aman.', nama: 'Vina', peran: 'Pelanggan' },
    { quote: 'Rate-nya jujur, fee jelas. Skincare-ku selalu titip sini.', nama: 'Tata', peran: 'Pelanggan setia' },
    { quote: 'Dapat sneakers limited yang susah dicari. Mantap!', nama: 'Reno', peran: 'Pelanggan' },
  ],
  faq: [
    { q: 'Bagaimana sistem pembayarannya?', a: 'DP saat order, pelunasan setelah barang dibeli dan bukti dikirim. Aman dan jelas.' },
    { q: 'Berapa lama sampai?', a: 'Tergantung negara & jadwal, umumnya 1–3 minggu. Estimasi diberikan saat order.' },
  ],
  info: { jam: [{ hari: 'Admin online', jam: 'Setiap hari, 09.00 – 21.00' }], alamat: 'Jakarta (open trip jastip rutin)', telp: '081296917963', reservasiText: 'Titip via WhatsApp', reservasiHref: '#wa' },
  about: { title: 'Tentang GlobalJastip', body: 'Kami bantu kamu mendapatkan produk original dari luar negeri tanpa repot. Sejak 2019, kepercayaan ribuan pelanggan kami jaga lewat transparansi di setiap langkah.' },
  cta: { title: 'Mau Titip Barang dari Luar?', subtitle: 'Cek jadwal trip jastip terdekat.', ctaText: 'Titip via WhatsApp', ctaHref: '#wa' },
  process: {
    title: 'Cara Titip',
    subtitle: 'Empat langkah, barang impian sampai ke tangan.',
    steps: [
      { judul: 'Kirim Wishlist', desc: 'Share link atau foto produk yang kamu mau.' },
      { judul: 'Konfirmasi & DP', desc: 'Kami kabari harga total dan fee, lalu DP.' },
      { judul: 'Kami Belikan', desc: 'Dibeli dari toko resmi, bukti dikirim ke kamu.' },
      { judul: 'Barang Dikirim', desc: 'Pelunasan, lalu barang meluncur ke alamatmu.' },
    ],
  },
  pricing: {
    title: 'Pilihan Layanan Titip',
    subtitle: 'Fee jujur, tanpa biaya kejutan.',
    plans: [
      { nama: 'Reguler', harga: 'Fee 10%', periode: '/barang', desc: 'Untuk titipan santai.', fitur: ['Pembelian produk original', 'Foto bukti beli', 'Update resi', 'Estimasi 2–3 minggu'], ctaText: 'Titip Reguler', ctaHref: '#wa' },
      { nama: 'Express', harga: 'Fee 18%', periode: '/barang', desc: 'Untuk yang butuh cepat.', fitur: ['Prioritas pembelian', 'Foto & video bukti', 'Pengiriman tercepat', 'Estimasi 7–10 hari', 'Asuransi pengiriman'], unggulan: true, ctaText: 'Titip Express', ctaHref: '#wa' },
      { nama: 'Borongan', harga: 'Nego', desc: 'Untuk reseller & jumlah besar.', fitur: ['Rate khusus volume', 'Dedicated admin', 'Skema pembayaran fleksibel'], ctaText: 'Hubungi Admin', ctaHref: '#wa' },
    ],
  },
  social: {
    title: 'Ikuti & Belanja di',
    links: [
      { platform: 'instagram', href: '#', label: '@globaljastip' },
      { platform: 'tiktok', href: '#' },
      { platform: 'whatsapp', href: '#wa' },
      { platform: 'shopee', href: '#' },
      { platform: 'tokopedia', href: '#' },
    ],
  },
  contact: { wa: '6281296917963', email: 'halo@globaljastip.id', alamat: 'Jakarta' },
}

// ── JASTIP · Lokal / UMKM ──────────────────────────────────────
const JASTIP_LOKAL: ComposableContent = {
  nama: 'Titip Lokal',
  hero: { eyebrow: 'Jasa Titip Produk Lokal', title: 'Oleh-Oleh & Produk Lokal, Tanpa Harus ke Sana', subtitle: 'Titip beli makanan khas, frozen food, dan produk UMKM dari berbagai kota. Dukung lokal, dimudahkan.', ctaText: 'Mulai Titip', ctaHref: '#titip', image: IMG('photo-1556740738-b6a63e27c4df') },
  features: [
    { title: 'Produk Lokal Pilihan', desc: 'Kurasi UMKM terbaik dari tiap daerah.' },
    { title: 'Fresh & Aman', desc: 'Frozen dikemas rapi dengan ice pack.' },
    { title: 'Dukung UMKM', desc: 'Tiap titipan menghidupi usaha kecil.' },
  ],
  showcase: { title: 'Katalog Titipan', subtitle: 'Favorit pelanggan.', items: [
    { nama: 'Oleh-oleh Khas Daerah', harga: 75000, desc: 'Camilan & kue tradisional.', gambar: IMG('photo-1504674900247-0877df9cc836', 800) },
    { nama: 'Frozen Food Rumahan', harga: 55000, desc: 'Dimsum, nugget, bakso.', gambar: IMG('photo-1490645935967-10de6ba17061', 800) },
    { nama: 'Kopi Lokal', harga: 90000, desc: 'Single origin nusantara.', gambar: IMG('photo-1461023058943-07fcbe16d735', 800) },
    { nama: 'Kerajinan UMKM', harga: 120000, desc: 'Produk tangan perajin lokal.', gambar: IMG('photo-1556740738-b6a63e27c4df', 800) },
  ] },
  stats: [{ angka: '8rb+', label: 'Pesanan' }, { angka: '200+', label: 'UMKM mitra' }, { angka: '20', label: 'Kota' }, { angka: '4.9', label: 'Rating' }],
  testimonials: [
    { quote: 'Bisa dapat oleh-oleh kampung tanpa pulang. Seneng banget!', nama: 'Wati', peran: 'Perantau' },
    { quote: 'Frozen-nya sampai masih beku rapi. Packing aman.', nama: 'Bu Sari', peran: 'Pelanggan' },
    { quote: 'Senang bisa dukung UMKM sekaligus belanja gampang.', nama: 'Andre', peran: 'Pelanggan' },
  ],
  info: { jam: [{ hari: 'Admin online', jam: 'Setiap hari, 08.00 – 20.00' }], alamat: 'Bandung (jangkauan nasional)', telp: '081296917963', reservasiText: 'Titip via WhatsApp', reservasiHref: '#wa' },
  about: { title: 'Tentang Titip Lokal', body: 'Kami menjembatani kamu dengan produk lokal terbaik dari seluruh nusantara. Setiap titipan bukan cuma soal belanja, tapi juga menghidupi usaha kecil di daerah.' },
  cta: { title: 'Kangen Produk Daerah?', subtitle: 'Titip sekarang, kami carikan.', ctaText: 'Titip via WhatsApp', ctaHref: '#wa' },
  contact: { wa: '6281296917963', email: 'halo@titiplokal.id', alamat: 'Bandung' },
}

// ── JASTIP · Preorder / PO ─────────────────────────────────────
const JASTIP_PREORDER: ComposableContent = {
  nama: 'PO Station',
  hero: { eyebrow: 'Sistem Preorder Terjadwal', title: 'Preorder Rapi, Stok Pasti, Tanpa Drama', subtitle: 'Sistem PO terstruktur dengan jadwal jelas dan update batch. Belanja barang incaran jadi tenang.', ctaText: 'Lihat Batch', ctaHref: '#batch', image: IMG('photo-1556742049-0cfed4f6a45d') },
  features: [
    { title: 'Jadwal Jelas', desc: 'Open & close PO transparan, tanpa PHP.' },
    { title: 'Update Batch', desc: 'Progres tiap tahap dikabarkan rutin.' },
    { title: 'Harga Grup', desc: 'Patungan batch, lebih hemat.' },
  ],
  showcase: { title: 'Katalog Titipan', subtitle: 'Batch yang sedang dibuka.', items: [
    { nama: 'PO Skincare Batch 12', harga: 180000, desc: 'Close 5 hari lagi.', gambar: IMG('photo-1556909212-d5b604d0c90d', 800) },
    { nama: 'PO Merch Limited', harga: 220000, desc: 'Kuota terbatas.', gambar: IMG('photo-1607082348824-0a96f2a4b9da', 800) },
    { nama: 'PO Gadget Aksesoris', harga: 150000, desc: 'Ready 2 minggu.', gambar: IMG('photo-1556910103-1c02745aae4d', 800) },
    { nama: 'PO Snack Impor', harga: 95000, desc: 'Grup buy hemat.', gambar: IMG('photo-1607083206869-4c7672e72a8a', 800) },
  ] },
  stats: [{ angka: '500+', label: 'Batch selesai' }, { angka: '15rb+', label: 'Peserta PO' }, { angka: '4.9', label: 'Rating' }, { angka: '0', label: 'Batch gagal' }],
  testimonials: [
    { quote: 'Sistemnya rapi, jadwalnya ditepati. Gak deg-degan nunggu barang.', nama: 'Lala', peran: 'Peserta PO' },
    { quote: 'Update tiap tahap bikin tenang. Adminnya komunikatif.', nama: 'Bima', peran: 'Pelanggan' },
    { quote: 'Harga grup beneran hemat. Sering ikut batch di sini.', nama: 'Citra', peran: 'Pelanggan setia' },
  ],
  faq: [
    { q: 'Apa itu sistem batch?', a: 'PO dibuka per periode (batch). Setelah kuota/jadwal tercapai, pesanan diproses bersama agar efisien.' },
    { q: 'Kalau barang tidak ready?', a: 'Jika batch batal karena stok, dana dikembalikan penuh. Kami jaga kepercayaanmu.' },
  ],
  info: { jam: [{ hari: 'Admin online', jam: 'Setiap hari, 09.00 – 21.00' }], alamat: 'Surabaya (pengiriman nasional)', telp: '081296917963', reservasiText: 'Ikut PO via WhatsApp', reservasiHref: '#wa' },
  about: { title: 'Tentang PO Station', body: 'Kami bikin preorder jadi pengalaman yang menyenangkan: jadwal jelas, komunikasi rutin, dan komitmen yang ditepati. Tak ada lagi PO yang bikin cemas.' },
  cta: { title: 'Incer Barang Lewat PO?', subtitle: 'Cek batch yang sedang dibuka.', ctaText: 'Ikut PO via WhatsApp', ctaHref: '#wa' },
  contact: { wa: '6281296917963', email: 'halo@postation.id', alamat: 'Surabaya' },
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
  // Restaurant (Sprint 4): prefix id tema 'warung-' / 'cafe-' / 'finedining-'
  warung: WARUNG,
  cafe: CAFE,
  finedining: FINEDINING,
  // Klinik (Sprint 6): prefix id tema 'umum-' / 'estetik-' / 'wellness-'
  umum: KLINIK_UMUM,
  estetik: KLINIK_ESTETIK,
  wellness: KLINIK_WELLNESS,
  // Sekolah (Sprint 7): prefix id tema 'reguler-' / 'islami-' / 'kursus-'
  reguler: SEKOLAH_REGULER,
  islami: SEKOLAH_ISLAMI,
  kursus: SEKOLAH_KURSUS,
  // Personal (Sprint 8a): prefix id tema 'kreator-' / 'profesional-' / 'coach-'
  kreator: PERSONAL_KREATOR,
  profesional: PERSONAL_PROFESIONAL,
  coach: PERSONAL_COACH,
  // Company (Sprint 8b): prefix id tema 'startup-' / 'agency-' / 'korporat-'
  startup: COMPANY_STARTUP,
  agency: COMPANY_AGENCY,
  korporat: COMPANY_KORPORAT,
  // Travel (Sprint 9): prefix 'kendaraan-' / 'wisata-' / 'akomodasi-'
  kendaraan: TRAVEL_KENDARAAN,
  wisata: TRAVEL_WISATA,
  akomodasi: TRAVEL_AKOMODASI,
  // Blog (Sprint 9): prefix 'jurnal-' / 'media-' / 'niche-'
  jurnal: BLOG_JURNAL,
  media: BLOG_MEDIA,
  niche: BLOG_NICHE,
  // Jastip (Sprint 9): prefix 'luar-' / 'lokal-' / 'preorder-'
  luar: JASTIP_LUAR,
  lokal: JASTIP_LOKAL,
  preorder: JASTIP_PREORDER,
}

export function sampleContentForTheme(themeId: string): ComposableContent {
  const sub = themeId.split('-')[0]
  return BY_SUBKATEGORI[sub] ?? KULINER
}
