import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

const LAST_UPDATED = '28 Mei 2025'
const COMPANY = 'Webzoka Studio'
const WA = '6281296917963'

const sections = [
  {
    id: '1',
    title: 'Definisi & Pihak yang Terlibat',
    items: [
      `"${COMPANY}" (selanjutnya disebut "Studio") adalah penyedia layanan pembuatan website yang beroperasi di bawah Japan Arena Corp.`,
      '"Client" adalah individu, UMKM, atau perusahaan yang mengajukan order dan menyetujui ketentuan ini.',
      '"Proyek" adalah ruang lingkup pekerjaan yang disepakati berdasarkan brief yang diisi pada form order.',
      '"Brief" adalah dokumen kebutuhan awal yang menjadi acuan pengerjaan, termasuk tujuan website, referensi desain, dan fitur yang diminta.',
    ],
  },
  {
    id: '2',
    title: 'Lingkup Pekerjaan',
    items: [
      'Studio mengerjakan proyek sesuai brief yang disetujui bersama pada sesi Onboarding & Video Call Consultation.',
      'Penambahan fitur atau perubahan signifikan di luar brief awal (scope creep) akan dikenakan biaya tambahan yang disepakati sebelum dikerjakan.',
      'Studio berhak menolak permintaan yang bertentangan dengan hukum, norma, atau nilai perusahaan.',
      'Estimasi waktu pengerjaan adalah 7–14 hari kerja sejak brief final dikunci, tergantung kompleksitas proyek.',
    ],
  },
  {
    id: '3',
    title: 'Pembayaran & DP',
    items: [
      'Pembayaran dilakukan dalam 2 termin: Down Payment (DP) sebesar 50% sebelum pengerjaan dimulai, dan pelunasan 50% sebelum website diluncurkan (go-live).',
      'DP bersifat non-refundable setelah proses pengerjaan dimulai (setelah sesi Onboarding selesai).',
      'Jika pelunasan tidak dilakukan dalam 7 hari kerja setelah notifikasi siap launch, Studio berhak menunda peluncuran tanpa ganti rugi.',
      'Keterlambatan pembayaran lebih dari 14 hari kalender dapat mengakibatkan penghentian sementara pengerjaan proyek.',
      'Seluruh pembayaran dilakukan melalui rekening/metode resmi yang dikonfirmasi oleh Studio. Studio tidak bertanggung jawab atas pembayaran ke pihak yang tidak diverifikasi.',
    ],
  },
  {
    id: '4',
    title: 'Revisi & Perubahan',
    items: [
      'Setiap tahap pengerjaan (Desain/Mockup dan Development) mendapat jatah 2x revisi yang sudah termasuk dalam harga paket.',
      'Revisi dihitung per sesi feedback tertulis (via WhatsApp atau email), bukan per item perubahan dalam satu sesi.',
      'Revisi yang melebihi batas akan dikenakan biaya tambahan mulai dari Rp 150.000 per sesi revisi.',
      'Perubahan yang bersifat penggantian konsep desain total atau perubahan brief utama tidak termasuk dalam kuota revisi dan diperlakukan sebagai proyek baru.',
      'Feedback revisi wajib dikirimkan dalam format tertulis yang jelas. Studio tidak memproses revisi lisan.',
    ],
  },
  {
    id: '5',
    title: 'Kewajiban Client',
    items: [
      'Client wajib menyediakan seluruh materi yang diperlukan (logo, foto, teks konten, akses domain/hosting) maksimal 3 hari kerja setelah Onboarding.',
      'Keterlambatan penyerahan materi oleh Client dapat memperpanjang estimasi waktu pengerjaan tanpa dianggap sebagai wanprestasi dari pihak Studio.',
      'Client bertanggung jawab penuh atas legalitas dan keaslian konten (teks, gambar, merek dagang) yang diberikan kepada Studio.',
      'Client wajib memberikan feedback/approval dalam 3 hari kerja setelah hasil kerja dikirimkan. Melewati batas ini dianggap sebagai persetujuan (approved by default).',
    ],
  },
  {
    id: '6',
    title: 'Hak Kekayaan Intelektual',
    items: [
      'Seluruh aset desain, kode, dan konten yang dibuat Studio untuk proyek ini menjadi milik penuh Client setelah pelunasan 100% terbayarkan.',
      'Sebelum pelunasan, seluruh hasil karya tetap menjadi milik Studio dan tidak dapat digunakan, dipublikasikan, atau didistribusikan oleh Client.',
      'Studio berhak mencantumkan proyek yang telah selesai sebagai bagian dari portofolio, kecuali Client mengajukan permintaan kerahasiaan secara tertulis.',
      'Studio tidak menggunakan source code, database, atau data Client untuk keperluan pihak ketiga tanpa izin.',
    ],
  },
  {
    id: '7',
    title: 'Garansi & Support Pasca-Launch',
    items: [
      'Studio memberikan garansi perbaikan bug teknis selama 30 hari kalender setelah website go-live, gratis.',
      'Garansi mencakup: error fungsional, tampilan yang tidak sesuai brief final, dan bug pada fitur yang sudah disepakati.',
      'Garansi tidak mencakup: kerusakan akibat modifikasi oleh pihak ketiga, perubahan desain, penambahan konten, atau masalah pada server/hosting pihak ketiga.',
      'Setelah masa garansi, layanan support dan pemeliharaan tersedia melalui paket maintenance tahunan.',
    ],
  },
  {
    id: '8',
    title: 'Pembatalan Proyek',
    items: [
      'Pembatalan oleh Client setelah DP dibayarkan dan pengerjaan dimulai: DP tidak dapat dikembalikan.',
      'Pembatalan oleh Client sebelum pengerjaan dimulai (sebelum Onboarding): DP dapat dikembalikan 100% dalam 7 hari kerja.',
      'Pembatalan oleh Studio karena alasan yang dapat dipertanggungjawabkan (force majeure, pelanggaran etika berat oleh Client): DP dikembalikan secara proporsional sesuai progress pekerjaan.',
      'Pembatalan mendadak tanpa alasan dari Studio tidak termasuk dalam force majeure dan menjadi tanggung jawab penuh Studio.',
    ],
  },
  {
    id: '9',
    title: 'Kerahasiaan & Data Pribadi',
    items: [
      'Studio menjaga kerahasiaan seluruh informasi bisnis, data operasional, dan strategi yang disampaikan Client selama berlangsungnya proyek.',
      'Data pribadi Client (nama, nomor WA, email) hanya digunakan untuk keperluan komunikasi proyek dan tidak dijual atau diserahkan kepada pihak ketiga.',
      'Studio menggunakan infrastruktur Supabase (server terenkrip) untuk menyimpan data order. Client dengan ini memberikan persetujuan penyimpanan data tersebut.',
    ],
  },
  {
    id: '10',
    title: 'Penyelesaian Sengketa & Hukum yang Berlaku',
    items: [
      'Ketentuan ini tunduk pada dan ditafsirkan berdasarkan hukum yang berlaku di Republik Indonesia.',
      'Segala sengketa yang timbul diselesaikan terlebih dahulu melalui musyawarah mufakat dalam jangka waktu 14 hari kalender.',
      'Apabila musyawarah tidak mencapai kesepakatan, para pihak sepakat untuk menyelesaikan sengketa melalui Pengadilan Negeri yang berwenang di wilayah hukum Studio.',
    ],
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Navbar />

      <main className="pt-32 pb-24 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-12">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#0071E3] mb-4 px-3 py-1 bg-blue-50 rounded-lg">
              Legal
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4 sf-display-heavy">
              Syarat & Ketentuan Layanan
            </h1>
            <p className="text-gray-500 text-base leading-relaxed">
              Dengan mengisi form order dan mencentang persetujuan, Client dianggap telah membaca, memahami, dan menyetujui seluruh ketentuan di bawah ini.
            </p>
            <p className="text-gray-400 text-sm mt-3">Terakhir diperbarui: {LAST_UPDATED}</p>
          </div>

          {/* Callout */}
          <div className="bg-amber-50 border border-amber-200 rounded-[24px] p-6 mb-10 flex gap-4">
            <div className="text-2xl shrink-0">⚡</div>
            <div>
              <p className="font-bold text-amber-900 text-sm mb-1">Ringkasan Singkat</p>
              <p className="text-amber-800 text-sm leading-relaxed">
                DP 50% non-refundable setelah pengerjaan dimulai · 2x revisi per tahap termasuk di harga ·
                Hak cipta berpindah ke Client setelah pelunasan · Garansi bug 30 hari gratis pasca-launch ·
                Feedback wajib 3 hari kerja atau dianggap approved.
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section) => (
              <div
                key={section.id}
                className="bg-white rounded-[32px] p-8 border border-black/[0.04] shadow-sm"
              >
                <h2 className="text-lg font-black text-gray-900 mb-5 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#0071E3] text-white text-xs font-black flex items-center justify-center shrink-0">
                    {section.id}
                  </span>
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0 mt-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm mb-4">
              Ada pertanyaan tentang ketentuan ini?
            </p>
            <a
              href={`https://wa.me/${WA}?text=Halo%20Japan%20Arena%20Studio%2C%20saya%20ingin%20bertanya%20mengenai%20Syarat%20%26%20Ketentuan%20layanan.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#1D1D1F] text-white rounded-full font-bold text-sm hover:bg-black transition-all"
            >
              💬 Hubungi Kami via WhatsApp
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
