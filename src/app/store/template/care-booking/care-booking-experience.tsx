'use client'

import Link from 'next/link'
import { Manrope, Newsreader } from 'next/font/google'
import { FormEvent, useState } from 'react'
import { storeWhatsAppUrl } from '@/lib/store/whatsapp'
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ClipboardList,
  MapPin,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'

const careDisplay = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-care-display',
})

const careBody = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-care-body',
})

type Mode = 'detail' | 'preview'

type Service = {
  number: string
  name: string
  audience: string
  description: string
  duration: string
  preparation: string
  practitioner: string
  tone: string
}

const services: Service[] = [
  {
    number: '01',
    name: 'Konsultasi Awal',
    audience: 'Untuk kamu yang ingin memahami langkah pertama dengan lebih tenang.',
    description: 'Percakapan singkat untuk mengenali kebutuhan, pilihan layanan, dan pertanyaan yang ingin kamu bawa ke kunjungan.',
    duration: '± 30 menit · demo',
    preparation: 'Bawa pertanyaan atau hal yang ingin kamu pahami. Tidak perlu menyiapkan diagnosis atau riwayat kesehatan.',
    practitioner: 'Maya Pradana · profil demo',
    tone: 'cb-service-sand',
  },
  {
    number: '02',
    name: 'Sesi Perawatan',
    audience: 'Untuk kamu yang sudah tahu jenis sesi yang ingin diajukan.',
    description: 'Sesi terarah bersama praktisi sesuai layanan yang dipilih. Detail kunjungan dibicarakan setelah waktu tersedia.',
    duration: '± 60 menit · demo',
    preparation: 'Pilih waktu yang kamu inginkan dan beri ruang untuk admin mengonfirmasi detail kunjungan.',
    practitioner: 'Raka Putra · profil demo',
    tone: 'cb-service-sage',
  },
  {
    number: '03',
    name: 'Follow-up / Evaluasi',
    audience: 'Untuk kamu yang ingin meninjau pengalaman sebelumnya dan menentukan langkah berikutnya.',
    description: 'Percakapan lanjutan untuk merangkum hal yang perlu diperhatikan dan menyepakati arah kunjungan berikutnya.',
    duration: '± 45 menit · demo',
    preparation: 'Ceritakan singkat apa yang ingin dibahas. Admin dapat membantu bila kamu belum yakin memilih layanan.',
    practitioner: 'Maya Pradana · profil demo',
    tone: 'cb-service-blue',
  },
]

const practitioners = [
  {
    initials: 'MP',
    name: 'Maya Pradana',
    role: 'Praktisi pendamping · profil demo',
    focus: 'Mendampingi percakapan awal dan membantu menyusun langkah kunjungan yang lebih terarah.',
    tone: 'cb-practitioner-sage',
  },
  {
    initials: 'RP',
    name: 'Raka Putra',
    role: 'Praktisi perawatan · profil demo',
    focus: 'Membantu sesi berjalan dengan ritme yang nyaman dan ruang untuk bertanya.',
    tone: 'cb-practitioner-blue',
  },
]

const schedule = [
  ['Senin', '09.00–15.00'],
  ['Rabu', '12.00–18.00'],
  ['Sabtu', '09.00–13.00'],
]

const bookingSteps = [
  ['01', 'Pilih layanan', 'Mulai dari layanan yang paling dekat dengan kebutuhanmu saat ini.'],
  ['02', 'Ajukan waktu', 'Pilih hari dan waktu yang kamu inginkan lewat formulir singkat.'],
  ['03', 'Admin konfirmasi', 'Tim menghubungi kamu melalui WhatsApp untuk mencocokkan ketersediaan.'],
  ['04', 'Datang sesuai jadwal', 'Simpan waktu yang sudah disepakati dan datang ke lokasi demo.'],
]

const faqs = [
  ['Apakah jadwal langsung terkonfirmasi setelah formulir dikirim?', 'Belum. Formulir ini adalah permintaan jadwal. Admin akan menghubungi kamu melalui WhatsApp untuk mengonfirmasi waktu kunjungan yang tersedia.'],
  ['Kalau perlu reschedule, apa yang harus dilakukan?', 'Hubungi admin melalui percakapan yang sama dan sampaikan waktu baru yang kamu inginkan. Admin akan membantu mengecek pilihan yang tersedia.'],
  ['Bolehkah memilih praktisi?', 'Boleh mengajukan preferensi praktisi di formulir. Permintaan tersebut tetap perlu dikonfirmasi oleh admin berdasarkan jadwal umum dan ketersediaan saat itu.'],
  ['Kapan sebaiknya datang?', 'Datang setelah admin mengonfirmasi waktu kunjungan. Untuk pertama kali, sisakan beberapa menit agar kamu bisa tiba dengan tenang.'],
  ['Bagaimana jika saya belum tahu layanan yang tepat?', 'Ajukan Konsultasi Awal atau tanyakan langsung kepada admin. Tim dapat membantu menjelaskan pilihan layanan tanpa menebak kondisi atau memberi diagnosis.'],
]

const initialForm = {
  service: '',
  practitioner: '',
  day: '',
  time: '',
  name: '',
  whatsapp: '',
  note: '',
}

const whatsappMessage = 'Halo Ruang Pulih, saya ingin bertanya tentang layanan dan jadwal.'

export function CareBookingExperience({ mode, showPreviewStrip = true }: { mode: Mode; showPreviewStrip?: boolean }) {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const whatsappHref = storeWhatsAppUrl(whatsappMessage)

  const updateField = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  const resetForm = () => {
    setForm(initialForm)
    setSubmitted(false)
  }

  return (
    <main className={`cb-shell ${careDisplay.variable} ${careBody.variable}`}>
      <a className="cb-skip-link" href="#care-main">Lewati ke konten</a>
      {mode === 'preview' && showPreviewStrip && (
        <div className="cb-preview-strip">
          <span>Webzoka Store V2 · Care Booking preview</span>
          <Link href="/store/template/care-booking">Lihat arah template <ArrowUpRight size={14} aria-hidden="true" /></Link>
        </div>
      )}

      <header className="cb-topbar">
        <Link className="cb-brand" href="/store" aria-label="Kembali ke Webzoka Store">
          <span className="cb-brand-mark" aria-hidden="true">R</span>
          <span>Ruang Pulih</span>
        </Link>
        <nav className="cb-nav" aria-label="Navigasi Ruang Pulih">
          <a href="#layanan">Layanan</a>
          <a href="#praktisi">Praktisi</a>
          <a href="#cara-booking">Cara Booking</a>
          <a href="#lokasi">Lokasi</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="cb-topbar-action" href="#appointment">Ajukan Jadwal <ArrowUpRight size={16} aria-hidden="true" /></a>
      </header>

      <div id="care-main">
        <section className="cb-hero" aria-labelledby="care-booking-title">
          <div className="cb-hero-copy">
            <p className="cb-eyebrow"><Sparkles size={14} aria-hidden="true" /> Ruang Pulih · layanan yang terarah</p>
            <h1 id="care-booking-title">Perawatan yang lebih terarah, <em>dimulai dari langkah yang sederhana.</em></h1>
            <p className="cb-hero-summary">Pahami layanan, kenali praktisi, lalu ajukan waktu kunjungan yang terasa tepat untukmu.</p>
            <div className="cb-hero-actions">
              <a className="cb-button cb-button-primary" href="#layanan">Lihat Layanan <ChevronRight size={18} aria-hidden="true" /></a>
              <a className="cb-button cb-button-quiet" href="#appointment">Ajukan Jadwal <ArrowUpRight size={17} aria-hidden="true" /></a>
            </div>
            <p className="cb-hero-note"><Clock3 size={15} aria-hidden="true" /> Pilih waktu yang kamu inginkan → kirim permintaan jadwal → admin mengonfirmasi ketersediaan.</p>
          </div>
          <div className="cb-hero-visual" aria-hidden="true">
            <div className="cb-hero-glow" />
            <div className="cb-hero-orbit cb-hero-orbit-one" />
            <div className="cb-hero-orbit cb-hero-orbit-two" />
            <div className="cb-request-card">
              <div className="cb-request-card-top"><span>REQUEST PATH</span><span>04 / 04</span></div>
              <div className="cb-request-card-mark"><Check size={20} aria-hidden="true" /></div>
              <p>Waktu kunjungan</p>
              <strong>Dipilih bersama,<br />dikonfirmasi admin.</strong>
              <div className="cb-request-card-line" />
              <span className="cb-request-card-caption">Ruang Pulih · prototype 2026</span>
            </div>
            <div className="cb-hero-float cb-hero-float-top"><CalendarDays size={17} aria-hidden="true" /><span>Jadwal umum</span></div>
            <div className="cb-hero-float cb-hero-float-bottom"><MapPin size={17} aria-hidden="true" /><span>Cipete · Jakarta</span></div>
          </div>
        </section>

        <section className="cb-services" id="layanan" aria-labelledby="services-title">
          <div className="cb-section-heading">
            <div><p className="cb-eyebrow">Mulai dari yang paling jelas</p><h2 id="services-title">Layanan yang memberi ruang untuk memahami.</h2></div>
            <p>Pilih berdasarkan langkah yang ingin kamu ambil. Durasi di bawah adalah contoh yang dapat dikonfigurasi saat website digunakan.</p>
          </div>
          <div className="cb-service-list">
            {services.map((service) => (
              <article className={`cb-service ${service.tone}`} key={service.number}>
                <div className="cb-service-index">{service.number}</div>
                <div className="cb-service-main"><h3>{service.name}</h3><p className="cb-service-audience">{service.audience}</p><p>{service.description}</p></div>
                <dl className="cb-service-detail"><div><dt>Durasi contoh</dt><dd>{service.duration}</dd></div><div><dt>Praktisi</dt><dd>{service.practitioner}</dd></div><div><dt>Siapkan</dt><dd>{service.preparation}</dd></div></dl>
                <a className="cb-inline-link" href="#appointment">Ajukan layanan <ArrowUpRight size={17} aria-hidden="true" /></a>
              </article>
            ))}
          </div>
        </section>

        <section className="cb-practitioners" id="praktisi" aria-labelledby="practitioner-title">
          <div className="cb-section-heading cb-section-heading-light">
            <div><p className="cb-eyebrow">Kenali pendampingnya</p><h2 id="practitioner-title">Praktisi yang hadir untuk mendengarkan lebih dulu.</h2></div>
            <p>Profil di sini adalah profil demo berbasis peran. Identitas dan detail nyata dapat diisi saat website diadaptasi untuk bisnis kamu.</p>
          </div>
          <div className="cb-practitioner-grid">
            {practitioners.map((practitioner) => (
              <article className={`cb-practitioner-card ${practitioner.tone}`} key={practitioner.name}>
                <div className="cb-practitioner-avatar"><UserRound size={26} aria-hidden="true" /><span>{practitioner.initials}</span></div>
                <p className="cb-practitioner-role">{practitioner.role}</p>
                <h3>{practitioner.name}</h3>
                <p>{practitioner.focus}</p>
                <a className="cb-inline-link" href="#appointment">Ajukan preferensi <ArrowUpRight size={17} aria-hidden="true" /></a>
              </article>
            ))}
          </div>
        </section>

        <section className="cb-schedule" aria-labelledby="schedule-title">
          <div className="cb-schedule-copy"><p className="cb-eyebrow">Jadwal umum</p><h2 id="schedule-title">Rencanakan waktu, lalu biarkan admin membantu mencocokkannya.</h2><p>Jam di bawah hanya informasi operasional umum. Ini bukan kalender live dan belum menunjukkan slot yang tersedia.</p><a className="cb-text-link" href="#appointment">Pilih waktu yang diinginkan <ArrowUpRight size={17} aria-hidden="true" /></a></div>
          <div className="cb-schedule-card"><div className="cb-schedule-card-top"><CalendarDays size={20} aria-hidden="true" /><span>INFORMASI SAJA · BUKAN LIVE AVAILABILITY</span></div>{schedule.map(([day, hours]) => <div className="cb-schedule-row" key={day}><strong>{day}</strong><span>{hours}</span><span className="cb-schedule-status">Jam umum</span></div>)}<p className="cb-schedule-footnote">Ketersediaan final dikonfirmasi admin setelah permintaan dikirim.</p></div>
        </section>

        <section className="cb-booking-steps" id="cara-booking" aria-labelledby="booking-steps-title">
          <div className="cb-section-heading"><div><p className="cb-eyebrow">Cara Booking</p><h2 id="booking-steps-title">Empat langkah, tanpa menebak-nebak.</h2></div><p>Alurnya sederhana: kamu mengajukan, admin mengonfirmasi, lalu kamu datang sesuai waktu yang disepakati.</p></div>
          <ol className="cb-step-grid">{bookingSteps.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
        </section>

        <section className="cb-appointment" id="appointment" aria-labelledby="appointment-title">
          <div className="cb-appointment-intro"><p className="cb-eyebrow">Ajukan Jadwal</p><h2 id="appointment-title">Mulai dari waktu yang kamu inginkan.</h2><p>Isi singkat agar admin bisa memahami permintaanmu dan menghubungi kamu untuk konfirmasi.</p><div className="cb-form-boundary"><ShieldCheck size={18} aria-hidden="true" /><span>Form demo ini tidak meminta diagnosis, riwayat kesehatan, nomor identitas, foto, atau dokumen medis.</span></div></div>
          <div className="cb-form-panel">
            {submitted ? (
              <div className="cb-confirmation" role="status" aria-live="polite">
                <div className="cb-confirmation-icon"><CheckCircle2 size={28} aria-hidden="true" /></div>
                <p className="cb-eyebrow">Permintaan diterima di preview</p>
                <h3>Permintaan jadwal sudah dicatat.</h3>
                <p>Tim akan menghubungi kamu melalui WhatsApp untuk mengonfirmasi waktu kunjungan. Preview ini tidak mengirim data ke layanan eksternal.</p>
                <button className="cb-button cb-button-secondary" type="button" onClick={resetForm}>Ajukan permintaan lain</button>
              </div>
            ) : (
              <form className="cb-form" onSubmit={handleSubmit}>
                <div className="cb-form-heading"><div><p className="cb-form-kicker"><ClipboardList size={15} aria-hidden="true" /> Permintaan kunjungan</p><h3>Ceritakan sedikit, kami bantu langkah berikutnya.</h3></div><span>Demo form</span></div>
                <div className="cb-field-grid">
                  <label className="cb-field"><span>Layanan</span><select required value={form.service} onChange={(event) => updateField('service', event.target.value)}><option value="" disabled>Pilih layanan</option>{services.map((service) => <option key={service.name} value={service.name}>{service.name}</option>)}</select></label>
                  <label className="cb-field"><span>Praktisi <small>(opsional)</small></span><select value={form.practitioner} onChange={(event) => updateField('practitioner', event.target.value)}><option value="">Belum menentukan</option>{practitioners.map((practitioner) => <option key={practitioner.name} value={practitioner.name}>{practitioner.name}</option>)}</select></label>
                  <label className="cb-field"><span>Hari yang diinginkan</span><select required value={form.day} onChange={(event) => updateField('day', event.target.value)}><option value="" disabled>Pilih hari</option>{schedule.map(([day]) => <option key={day} value={day}>{day}</option>)}</select></label>
                  <label className="cb-field"><span>Waktu</span><select required value={form.time} onChange={(event) => updateField('time', event.target.value)}><option value="" disabled>Pilih waktu</option><option value="Pagi">Pagi</option><option value="Siang">Siang</option><option value="Sore">Sore</option></select></label>
                  <label className="cb-field"><span>Nama</span><input required autoComplete="name" value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Nama kamu" /></label>
                  <label className="cb-field"><span>WhatsApp</span><input required autoComplete="tel" inputMode="tel" type="tel" value={form.whatsapp} onChange={(event) => updateField('whatsapp', event.target.value)} placeholder="08xx xxxx xxxx" /></label>
                  <label className="cb-field cb-field-full"><span>Catatan singkat <small>(opsional)</small></span><textarea value={form.note} onChange={(event) => updateField('note', event.target.value)} placeholder="Hal yang ingin kamu tanyakan atau siapkan..." rows={4} /><small className="cb-field-help">Tulis pertanyaan umum saja. Tidak perlu menulis diagnosis atau riwayat kesehatan.</small></label>
                </div>
                <button className="cb-button cb-button-primary cb-submit" type="submit">Ajukan Jadwal <Send size={17} aria-hidden="true" /></button>
                <p className="cb-form-footnote">Dengan mengirim form demo, kamu melihat contoh state konfirmasi. Tidak ada akun atau appointment nyata yang dibuat.</p>
              </form>
            )}
          </div>
        </section>

        <section className="cb-location" id="lokasi" aria-labelledby="location-title">
          <div className="cb-map-card" aria-hidden="true"><div className="cb-map-grid" /><div className="cb-map-route cb-map-route-one" /><div className="cb-map-route cb-map-route-two" /><div className="cb-map-stamp">DEMO<br />LOCATION</div><div className="cb-map-pin"><MapPin size={25} aria-hidden="true" /></div><span className="cb-map-label">Ruang Pulih</span></div>
          <div className="cb-location-copy"><p className="cb-eyebrow">Lokasi</p><h2 id="location-title">Datang ke ruang yang disiapkan untuk percakapan yang tenang.</h2><p>Lokasi berikut adalah contoh fiktif untuk preview. Ganti alamat, petunjuk, dan detail akses saat website digunakan.</p><address><strong>Ruang Pulih · lokasi demo</strong><span>Jl. Sawo Kecil No. 18<br />Cipete, Jakarta Selatan</span></address><div className="cb-location-hours"><Clock3 size={18} aria-hidden="true" /><span>Senin–Sabtu · mengikuti jadwal umum di atas</span></div></div>
        </section>

        <section className="cb-trust" aria-labelledby="trust-title">
          <div className="cb-section-heading cb-section-heading-light"><div><p className="cb-eyebrow">Kejelasan sebelum kunjungan</p><h2 id="trust-title">Kepercayaan tumbuh dari hal-hal yang bisa kamu pahami.</h2></div><p>Ruang Pulih tidak memakai angka pasien, rating, sertifikasi, atau janji hasil yang tidak bisa dibuktikan.</p></div>
          <div className="cb-trust-grid"><article><Check size={20} aria-hidden="true" /><h3>Layanan jelas</h3><p>Setiap pilihan menjelaskan siapa yang cocok memulainya dan apa yang perlu disiapkan.</p></article><article><Check size={20} aria-hidden="true" /><h3>Proses transparan</h3><p>Kamu tahu kapan mengajukan waktu dan kapan admin perlu mengonfirmasi.</p></article><article><Check size={20} aria-hidden="true" /><h3>Batasan aman</h3><p>Website membantu memilih langkah awal. Pertanyaan yang lebih spesifik dibahas bersama admin atau praktisi.</p></article></div>
        </section>

        <section className="cb-faq" id="faq" aria-labelledby="faq-title">
          <div className="cb-section-heading"><div><p className="cb-eyebrow">Pertanyaan umum</p><h2 id="faq-title">Sebelum mengajukan jadwal.</h2></div><p>Jawaban singkat untuk mengurangi keraguan di langkah pertama.</p></div>
          <div className="cb-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
        </section>

        <section className="cb-final" aria-labelledby="final-title">
          <div><p className="cb-eyebrow">Mulai dengan pertanyaanmu</p><h2 id="final-title">Belum yakin harus mulai dari layanan yang mana?</h2><p>Tanyakan ke admin atau kirim permintaan jadwal. Kamu tidak perlu menebak semuanya sendiri.</p></div>
          <div className="cb-final-actions">{whatsappHref ? <a className="cb-button cb-button-light" target="_blank" rel="noreferrer" href={whatsappHref}>Hubungi Admin <MessageCircle size={18} aria-hidden="true" /></a> : <button className="cb-button cb-button-light" type="button" disabled>Hubungi Admin <MessageCircle size={18} aria-hidden="true" /></button>}<a className="cb-button cb-button-outline" href="#appointment">Ajukan Jadwal <ArrowUpRight size={17} aria-hidden="true" /></a><span>{whatsappHref ? 'WhatsApp membuka pesan inquiry yang sudah disiapkan. Periksa kembali isinya sebelum mengirim.' : 'WhatsApp belum dikonfigurasi untuk preview ini. CTA akan aktif setelah NEXT_PUBLIC_WEBZOKA_WHATSAPP_NUMBER tersedia.'}</span></div>
        </section>
      </div>

      <footer className="cb-footer"><span>Ruang Pulih · Care Booking prototype</span><Link href="/store"><ArrowLeft size={16} aria-hidden="true" /> Kembali ke Webzoka Store</Link></footer>
    </main>
  )
}
