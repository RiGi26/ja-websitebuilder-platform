// ============================================================
// F3-2 — Template varian copy (nol-opex, deterministik).
// Tiap industri punya 3 register copy fallback (warm / energetic / elegant)
// untuk deskripsi & CTA subtitle, dipilih berdasarkan TONE variant klien
// (mis. luxury/premium → elegant/formal, bold/editorial → energetic), plus
// 3 set feature card yang DIROTASI per nama bisnis supaya dua situs di
// industri yang sama tidak kembar persis.
//
// Aturan: ini hanya FALLBACK. Konten briefing nyata (b.deskripsi, b.tagline,
// b.konten.keunggulan) tetap menang — lihat templates.ts. Register index tone
// default tiap industri sengaja dipetakan ke copy yang ekuivalen versi lama
// sehingga build variant default ~tidak berubah (no-regression).
//
// Cakupan (keputusan user): BODY COPY saja (deskripsi, feature cards, CTA
// subtitle). Label section & teks tombol aksi tetap di templates.ts.
// ============================================================
import type { TipeIndustri } from '@/types/websitebuilder'
import type { NormalizedBriefing } from './types'
import { kotaPhrase } from './briefing'

export type Tone = 'warm' | 'energetic' | 'elegant' | 'clean'

// variant klien -> tone. Selaras dengan website-variants.ts.
const VARIANT_TONE: Record<string, Record<string, Tone>> = {
  travel: { bold: 'energetic', fresh: 'clean', luxury: 'elegant' },
  restaurant: { rustic: 'warm', modern: 'elegant' },
  corporate: { editorial: 'energetic', clean: 'clean', minimal: 'clean' },
  klinik: { warm: 'warm', clean: 'clean', premium: 'elegant' },
  sekolah: { warm: 'warm', clean: 'clean' },
  toko_online: { batik: 'warm', modern: 'clean' },
  personal: { minimal: 'clean', bold: 'energetic' },
}

// tone default per industri (kalau variant kosong). Dipetakan ke register lama.
const DEFAULT_TONE: Record<TipeIndustri, Tone> = {
  travel: 'energetic', restaurant: 'warm', corporate: 'energetic', klinik: 'warm',
  sekolah: 'warm', toko_online: 'warm', personal: 'clean', blog: 'clean',
  jastip: 'warm', custom: 'clean',
}

// register index dalam bank: 0=warm, 1=energetic/clean (percaya diri, lugas), 2=elegant.
const TONE_INDEX: Record<Tone, number> = { warm: 0, energetic: 1, clean: 1, elegant: 2 }

export function resolveTone(tipe: TipeIndustri, variant?: string): Tone {
  if (variant && VARIANT_TONE[tipe]?.[variant]) return VARIANT_TONE[tipe][variant]
  return DEFAULT_TONE[tipe] ?? 'clean'
}

// hash deterministik nama bisnis -> rotasi feature trio.
// Rolling hash + avalanche finalizer (mix bit) supaya sebaran mod-n rata.
function hashSeed(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0
  h ^= h >>> 16
  h = Math.imul(h, 0x45d9f3b)
  h ^= h >>> 16
  return h >>> 0
}

type Feat = { title: string; desc: string }
interface CopyBank {
  // [warm, energetic/clean, elegant] — (nama, kota) => kalimat
  deskripsi: Array<(nama: string, kota: string) => string>
  // [warm, energetic/clean, elegant] — (nama) => subtitle CTA penutup
  ctaSub: Array<(nama: string) => string>
  // >=2 trio feature; dirotasi per nama bisnis
  features: Feat[][]
}

const pickByTone = (arr: Array<(...a: string[]) => string>, ri: number) => arr[ri] ?? arr[0]

// ── Bank per industri ─────────────────────────────────────────
const TRAVEL: CopyBank = {
  deskripsi: [
    (n, k) => `${n} siap nemenin perjalananmu di ${k} — armada bersih, terawat, dan selalu siap jalan kapan pun kamu butuh.`,
    (n, k) => `${n} melayani sewa kendaraan di ${k} dengan armada terawat dan harga transparan.`,
    (n, k) => `${n} menghadirkan layanan sewa kendaraan premium di ${k} — armada terkurasi, pelayanan presisi, kenyamanan tanpa kompromi.`,
  ],
  ctaSub: [
    (n) => `Tinggal chat, unit ${n} siap meluncur ke lokasimu.`,
    (n) => `Booking unit ${n} sekarang lewat WhatsApp.`,
    (n) => `Reservasikan kendaraan pilihan Anda bersama ${n} hari ini.`,
  ],
  features: [
    [
      { title: 'Armada Terawat', desc: 'Setiap unit dicek rutin dan selalu siap jalan — bersih, prima, tanpa drama.' },
      { title: 'Harga Transparan', desc: 'Tarif jelas di depan, tanpa biaya tersembunyi.' },
      { title: 'Respons Cepat', desc: 'Booking lewat WhatsApp, dibalas cepat, unit siap sesuai jadwal Anda.' },
    ],
    [
      { title: 'Siap 24 Jam', desc: 'Butuh mendadak? Tim kami sigap melayani kapan pun rencana berubah.' },
      { title: 'Unit Lengkap', desc: 'Dari city car irit sampai SUV keluarga — pilih yang pas untuk perjalananmu.' },
      { title: 'Antar-Jemput', desc: 'Unit bisa diantar ke lokasi, beres tanpa repot datang ke kantor.' },
    ],
    [
      { title: 'Sopir Berpengalaman', desc: 'Opsi sopir ramah dan paham rute, perjalanan jadi tenang.' },
      { title: 'Asuransi Tercover', desc: 'Setiap unit terlindungi, kamu jalan tanpa was-was.' },
      { title: 'Proses Simpel', desc: 'Syarat ringkas, konfirmasi cepat, langsung jalan.' },
    ],
  ],
}

const RESTAURANT: CopyBank = {
  deskripsi: [
    (n, k) => `${n} menyajikan hidangan lezat dengan bahan segar di ${k}. Suasana nyaman untuk keluarga & teman.`,
    (n, k) => `${n} di ${k} — racikan menggugah selera, porsi memuaskan, tempat asik buat nongkrong dan makan bareng.`,
    (n, k) => `${n} menghadirkan pengalaman bersantap istimewa di ${k} — bahan pilihan, cita rasa terkurasi, suasana yang berkesan.`,
  ],
  ctaSub: [
    (n) => `Pesan sekarang atau kunjungi ${n} hari ini.`,
    (n) => `Lapar? Meluncur aja ke ${n} atau pesan lewat WhatsApp sekarang.`,
    (n) => `Reservasikan meja Anda di ${n} untuk momen bersantap yang berkesan.`,
  ],
  features: [
    [
      { title: 'Bahan Segar', desc: 'Diolah dari bahan pilihan setiap hari demi rasa yang konsisten.' },
      { title: 'Suasana Nyaman', desc: 'Tempat yang pas untuk keluarga, teman, maupun makan sendiri.' },
      { title: 'Pelayanan Ramah', desc: 'Disambut hangat, dilayani cepat, dibuat betah.' },
    ],
    [
      { title: 'Menu Andalan', desc: 'Hidangan khas favorit pelanggan yang selalu bikin kangen.' },
      { title: 'Harga Bersahabat', desc: 'Porsi puas dengan harga yang masuk akal.' },
      { title: 'Bisa Pesan Antar', desc: 'Tinggal chat, makanan hangat sampai ke tempatmu.' },
    ],
    [
      { title: 'Resep Otentik', desc: 'Cita rasa yang dijaga dari resep turun-temurun.' },
      { title: 'Cocok untuk Acara', desc: 'Tersedia paket untuk arisan, ulang tahun, dan kumpul keluarga.' },
      { title: 'Tempat Instagramable', desc: 'Sudut-sudut cantik yang sayang untuk dilewatkan.' },
    ],
  ],
}

const CORPORATE: CopyBank = {
  deskripsi: [
    (n, k) => `${n} mendampingi pertumbuhan bisnis Anda di ${k} dengan layanan yang personal, jujur, dan berorientasi hasil.`,
    (n, k) => `${n} adalah perusahaan yang berfokus memberikan layanan profesional dan terpercaya di ${k}.`,
    (n, k) => `${n} menghadirkan solusi profesional terukur di ${k} — pendekatan strategis, eksekusi presisi, kemitraan jangka panjang.`,
  ],
  ctaSub: [
    (n) => `Ngobrol santai dulu yuk soal kebutuhan Anda bareng tim ${n}.`,
    (n) => `Diskusikan kebutuhan Anda dengan tim ${n} sekarang.`,
    (n) => `Jadwalkan konsultasi strategis bersama ${n} untuk langkah berikutnya.`,
  ],
  features: [
    [
      { title: 'Berpengalaman', desc: 'Tim profesional dengan rekam jejak menangani beragam klien.' },
      { title: 'Solusi Terukur', desc: 'Pendekatan berbasis data, hasil yang bisa dipertanggungjawabkan.' },
      { title: 'Mitra Jangka Panjang', desc: 'Kami tumbuh bersama klien, bukan sekadar proyek sesaat.' },
    ],
    [
      { title: 'Respons Cepat', desc: 'Komunikasi lancar dan tanggap di setiap tahap kerja sama.' },
      { title: 'Transparan', desc: 'Lingkup, biaya, dan progres jelas dari awal sampai selesai.' },
      { title: 'Tim Spesialis', desc: 'Ditangani orang yang tepat sesuai bidang kebutuhan Anda.' },
    ],
    [
      { title: 'Pendekatan Strategis', desc: 'Memetakan akar masalah sebelum menawarkan solusi.' },
      { title: 'Standar Profesional', desc: 'Proses kerja rapi dengan kualitas yang konsisten.' },
      { title: 'Dukungan Penuh', desc: 'Pendampingan berkelanjutan agar hasil tetap optimal.' },
    ],
  ],
}

const KLINIK: CopyBank = {
  deskripsi: [
    (n, k) => `${n} melayani kesehatan keluarga di ${k} dengan dokter berpengalaman dan fasilitas modern.`,
    (n, k) => `${n} hadir di ${k} dengan pelayanan kesehatan yang cepat, ramah, dan tepercaya untuk seluruh keluarga.`,
    (n, k) => `${n} menghadirkan layanan kesehatan premium di ${k} — penanganan teliti, fasilitas modern, kenyamanan setiap pasien.`,
  ],
  ctaSub: [
    (n) => `Buat janji dengan ${n} sekarang, kesehatan keluarga prioritas kami.`,
    (n) => `Jadwalkan kunjungan Anda ke ${n} sekarang.`,
    (n) => `Reservasikan konsultasi Anda bersama ${n} untuk penanganan terbaik.`,
  ],
  features: [
    [
      { title: 'Dokter Berpengalaman', desc: 'Ditangani tenaga medis tersertifikasi yang ramah dan profesional.' },
      { title: 'Pelayanan Cepat', desc: 'Antrean tertata, waktu tunggu singkat, proses jelas.' },
      { title: 'Fasilitas Lengkap', desc: 'Peralatan medis modern untuk diagnosis yang akurat.' },
    ],
    [
      { title: 'Janji Temu Mudah', desc: 'Atur jadwal lewat WhatsApp tanpa antre lama di tempat.' },
      { title: 'Penanganan Menyeluruh', desc: 'Dari pemeriksaan awal hingga tindak lanjut, semua terpantau.' },
      { title: 'Lingkungan Bersih', desc: 'Standar kebersihan dan kenyamanan yang terjaga.' },
    ],
    [
      { title: 'Konsultasi Personal', desc: 'Setiap pasien didengarkan dan ditangani sesuai kebutuhan.' },
      { title: 'Biaya Transparan', desc: 'Estimasi biaya jelas di depan, tanpa kejutan.' },
      { title: 'Lokasi Strategis', desc: 'Mudah dijangkau dengan akses yang nyaman.' },
    ],
  ],
}

const SEKOLAH: CopyBank = {
  deskripsi: [
    (n, k) => `${n} hadir di ${k} dengan pendidikan berkualitas dan lingkungan belajar yang mendukung.`,
    (n, k) => `${n} di ${k} membentuk generasi unggul lewat pembelajaran aktif dan pendampingan yang sepenuh hati.`,
    (n, k) => `${n} menyelenggarakan pendidikan bermutu di ${k} — kurikulum terarah, tenaga pendidik berdedikasi, karakter yang dibangun matang.`,
  ],
  ctaSub: [
    (n) => `Daftarkan putra-putri Anda di ${n}, kami siap menyambut.`,
    (n) => `Daftarkan putra-putri Anda di ${n} sekarang.`,
    (n) => `Bergabunglah bersama ${n} untuk masa depan pendidikan yang lebih baik.`,
  ],
  features: [
    [
      { title: 'Pendidik Berkualitas', desc: 'Tenaga pengajar berdedikasi yang peduli pada tiap siswa.' },
      { title: 'Lingkungan Mendukung', desc: 'Suasana belajar aman, nyaman, dan menumbuhkan karakter.' },
      { title: 'Prestasi Terbukti', desc: 'Rekam jejak siswa berprestasi di bidang akademik & non-akademik.' },
    ],
    [
      { title: 'Kurikulum Terarah', desc: 'Materi terstruktur yang menyiapkan siswa untuk jenjang berikutnya.' },
      { title: 'Beragam Ekstrakurikuler', desc: 'Wadah mengasah bakat dan minat di luar kelas.' },
      { title: 'Pendaftaran Mudah', desc: 'Proses PPDB yang ringkas dan informasi yang jelas.' },
    ],
    [
      { title: 'Pembinaan Karakter', desc: 'Membentuk pribadi disiplin, mandiri, dan berakhlak.' },
      { title: 'Fasilitas Memadai', desc: 'Ruang belajar dan sarana penunjang yang representatif.' },
      { title: 'Komunikasi Aktif', desc: 'Sekolah dan orang tua berjalan seiring memantau perkembangan anak.' },
    ],
  ],
}

const TOKO: CopyBank = {
  deskripsi: [
    (n) => `${n} menghadirkan produk pilihan dengan kualitas terjaga. Belanja mudah, pengiriman ke seluruh Indonesia.`,
    (n) => `${n} menyediakan koleksi terkurasi yang siap kamu bawa pulang — pesan praktis, kirim cepat ke seluruh Indonesia.`,
    (n) => `${n} mempersembahkan koleksi eksklusif dengan kualitas terjaga — dikurasi cermat, dikemas rapi, dikirim ke seluruh Indonesia.`,
  ],
  ctaSub: [
    (n) => `Belanja koleksi ${n} sekarang, favoritmu menunggu.`,
    (n) => `Belanja koleksi ${n} sekarang.`,
    (n) => `Temukan koleksi pilihan ${n} dan miliki yang terbaik hari ini.`,
  ],
  features: [
    [
      { title: 'Kualitas Terjaga', desc: 'Setiap produk dikurasi, dikemas rapi, sampai dengan aman.' },
      { title: 'Pengiriman Cepat', desc: 'Diproses cepat dan dikirim ke seluruh Indonesia.' },
      { title: 'Belanja Mudah', desc: 'Pesan langsung via WhatsApp, respons ramah dan cepat.' },
    ],
    [
      { title: 'Produk Original', desc: 'Dijamin asli dengan kualitas yang sesuai gambar.' },
      { title: 'Stok Selalu Update', desc: 'Koleksi baru rutin hadir, ketinggalan tinggal pesan.' },
      { title: 'Pembayaran Fleksibel', desc: 'Beragam metode bayar yang memudahkan transaksimu.' },
    ],
    [
      { title: 'Harga Bersaing', desc: 'Kualitas premium dengan harga yang tetap masuk akal.' },
      { title: 'Kemasan Aman', desc: 'Dikemas berlapis agar produk sampai dalam kondisi prima.' },
      { title: 'Pelayanan Responsif', desc: 'Pertanyaan dibalas cepat, belanja jadi tenang.' },
    ],
  ],
}

const GENERIC: CopyBank = {
  deskripsi: [
    (n, k) => `${n} hadir untuk Anda di ${k} dengan layanan yang personal dan sepenuh hati.`,
    (n, k) => `${n} siap membantu kebutuhan Anda di ${k} — profesional, responsif, dan tepat waktu.`,
    (n, k) => `${n} menghadirkan layanan berkualitas di ${k} dengan standar yang dapat Anda andalkan.`,
  ],
  ctaSub: [
    (n) => `Sampaikan kebutuhan Anda ke ${n}, kami senang membantu.`,
    (n) => `Sampaikan kebutuhan Anda ke ${n} sekarang.`,
    (n) => `Mari terhubung dengan ${n} untuk mewujudkan kebutuhan Anda.`,
  ],
  features: [
    [
      { title: 'Profesional', desc: 'Dikerjakan serius dengan standar yang Anda harapkan.' },
      { title: 'Komunikatif', desc: 'Mudah dihubungi, responsif, dan transparan.' },
      { title: 'Tepat Waktu', desc: 'Komitmen pada hasil dan tenggat yang disepakati.' },
    ],
    [
      { title: 'Solusi Personal', desc: 'Disesuaikan dengan kebutuhan Anda, bukan template seragam.' },
      { title: 'Proses Jelas', desc: 'Setiap langkah dikomunikasikan dengan terbuka.' },
      { title: 'Hasil Memuaskan', desc: 'Fokus pada kualitas yang membuat Anda kembali.' },
    ],
    [
      { title: 'Andal', desc: 'Bisa diandalkan untuk hasil yang konsisten.' },
      { title: 'Fleksibel', desc: 'Menyesuaikan dengan permintaan dan situasi Anda.' },
      { title: 'Ramah', desc: 'Pelayanan hangat yang membuat nyaman.' },
    ],
  ],
}

const BANKS: Record<TipeIndustri, CopyBank> = {
  travel: TRAVEL,
  restaurant: RESTAURANT,
  corporate: CORPORATE,
  klinik: KLINIK,
  sekolah: SEKOLAH,
  toko_online: TOKO,
  personal: GENERIC,
  blog: GENERIC,
  jastip: GENERIC,
  custom: GENERIC,
}

export interface ResolvedCopy {
  tone: Tone
  deskripsi: string
  ctaSubtitle: string
  features: Feat[]
}

// Pilih copy fallback untuk briefing ini. deskripsi & ctaSubtitle by tone
// (honor variant), features dirotasi by nama bisnis (mecah kembar).
export function getCopy(b: NormalizedBriefing): ResolvedCopy {
  const bank = BANKS[b.tipe] ?? GENERIC
  const tone = resolveTone(b.tipe, b.variant)
  const ri = TONE_INDEX[tone]
  const kota = kotaPhrase(b.kotaLayanan)
  return {
    tone,
    deskripsi: pickByTone(bank.deskripsi, ri)(b.namaUsaha, kota),
    ctaSubtitle: pickByTone(bank.ctaSub, ri)(b.namaUsaha),
    features: bank.features[hashSeed(b.namaUsaha) % bank.features.length],
  }
}
