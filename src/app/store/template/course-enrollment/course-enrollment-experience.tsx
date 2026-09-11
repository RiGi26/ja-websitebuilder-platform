'use client'

import Link from 'next/link'
import { DM_Sans, Rubik } from 'next/font/google'
import { type FormEvent, useState } from 'react'
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpenCheck,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Compass,
  Menu,
  Route,
  Send,
  Sparkles,
  X,
} from 'lucide-react'

const courseDisplay = Rubik({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-course-display',
})

const courseBody = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-course-body',
})

type Mode = 'detail' | 'preview'

type Program = {
  number: string
  name: string
  audience: string
  level: string
  duration: string
  frequency: string
  format: string
  summary: string
  learn: string[]
  includes: string[]
  prepare: string
  tone: string
}

const programs: Program[] = [
  {
    number: '01',
    name: 'Bahasa Jepang Dasar',
    audience: 'Untuk pemula yang ingin membangun fondasi dengan urutan yang lebih jelas.',
    level: 'Pemula',
    duration: '6 minggu · contoh',
    frequency: '2x per minggu · contoh',
    format: 'Kelas online atau tatap muka',
    summary: 'Mulai dari ungkapan sehari-hari, pola kalimat dasar, dan latihan membaca yang dapat disesuaikan dengan tujuan belajar.',
    learn: ['Perkenalan dan percakapan sehari-hari', 'Pola kalimat dan kosakata dasar', 'Latihan membaca dengan ritme bertahap'],
    includes: ['Rencana belajar per minggu', 'Latihan yang bisa ditinjau ulang', 'Sesi tanya jawab bersama pengajar'],
    prepare: 'Tidak perlu pengalaman sebelumnya. Ceritakan tujuan belajar saat konsultasi awal.',
    tone: 'ce-program-indigo',
  },
  {
    number: '02',
    name: 'English Conversation',
    audience: 'Untuk kamu yang ingin lebih siap menggunakan bahasa Inggris dalam percakapan praktis.',
    level: 'Dasar–menengah',
    duration: '8 minggu · contoh',
    frequency: '1x per minggu · contoh',
    format: 'Kelas online',
    summary: 'Latihan percakapan dengan topik yang dekat dengan keseharian, dibangun dari konteks, kosakata, dan ruang untuk mencoba.',
    learn: ['Menyampaikan ide dengan lebih terstruktur', 'Kosakata untuk situasi sehari-hari', 'Latihan mendengarkan dan merespons'],
    includes: ['Topik percakapan bertahap', 'Catatan kosakata per sesi', 'Ruang untuk bertanya dan mencoba'],
    prepare: 'Pilih situasi yang ingin kamu latih agar admin bisa membantu mengarahkan program.',
    tone: 'ce-program-yellow',
  },
  {
    number: '03',
    name: 'Digital Skills Foundation',
    audience: 'Untuk pemula yang ingin memahami alat kerja digital tanpa mulai dari istilah yang rumit.',
    level: 'Pemula',
    duration: '4 minggu · contoh',
    frequency: '2x per minggu · contoh',
    format: 'Workshop kelompok kecil',
    summary: 'Kenali alur kerja digital dasar, mulai dari mengatur informasi sampai menyusun hasil kerja yang mudah dipahami.',
    learn: ['Merapikan file dan informasi kerja', 'Menyusun dokumen yang mudah dibaca', 'Memilih alat digital sesuai kebutuhan'],
    includes: ['Contoh alur kerja praktis', 'Lembar persiapan sebelum kelas', 'Sesi review untuk pertanyaan umum'],
    prepare: 'Bawa satu contoh aktivitas yang ingin dibuat lebih teratur. Tidak perlu menyiapkan materi khusus.',
    tone: 'ce-program-mint',
  },
]

const scheduleOptions = [
  ['Kelas malam', 'Senin & Rabu · 19.00–20.30'],
  ['Kelas weekend', 'Sabtu · 09.00–11.00'],
  ['Waktu fleksibel', 'Dibicarakan bersama penyelenggara'],
]

const journeySteps = [
  ['01', 'Pilih program', 'Mulai dari tujuan dan tingkat pengalamanmu saat ini.'],
  ['02', 'Konsultasi / cek kecocokan', 'Admin membantu menjelaskan format, materi, dan pilihan jadwal.'],
  ['03', 'Konfirmasi jadwal', 'Kamu dan penyelenggara menyepakati detail langkah berikutnya.'],
  ['04', 'Mulai belajar', 'Gunakan website sebagai titik awal menuju pengalaman belajar yang sesuai.'],
]

const scheduleCards = [
  ['Kelas malam', 'Senin & Rabu', '19.00–20.30', 'Untuk kamu yang ingin belajar setelah aktivitas utama.'],
  ['Kelas weekend', 'Sabtu', '09.00–11.00', 'Pilihan contoh untuk ritme belajar di akhir pekan.'],
  ['Waktu fleksibel', 'Menyesuaikan', 'Dibicarakan bersama', 'Cocok untuk kebutuhan yang perlu dibahas lebih dulu.'],
]

const faqs = [
  ['Bagaimana memilih program yang sesuai?', 'Mulai dari tujuan dan tingkat pengalamanmu. Jika masih ragu, kirim Daftar Minat dan admin akan membantu membandingkan pilihan yang tersedia.'],
  ['Apakah bisa konsultasi sebelum daftar?', 'Bisa. Permintaan minat adalah langkah awal untuk membicarakan program, format, jadwal, dan hal yang ingin kamu capai.'],
  ['Apakah jadwal bisa berubah?', 'Jadwal di preview ini adalah contoh informasi intake. Penyelenggara dapat menyesuaikannya berdasarkan format dan kebutuhan kelas.'],
  ['Apa yang perlu disiapkan sebelum kelas?', 'Kebutuhan tiap program berbeda. Admin akan menjelaskan persiapan yang relevan setelah memahami pilihan program dan format belajar.'],
  ['Bagaimana proses setelah mengirim minat?', 'Preview akan menampilkan konfirmasi bahwa minat sudah dicatat. Dalam penggunaan nyata, admin perlu menghubungi kamu untuk menjelaskan langkah berikutnya.'],
]

const initialForm = {
  program: '',
  schedule: '',
  name: '',
  whatsapp: '',
  email: '',
  level: '',
  note: '',
}

export function CourseEnrollmentExperience({ mode }: { mode: Mode }) {
  const [selectedId, setSelectedId] = useState(programs[0].number)
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const selected = programs.find((program) => program.number === selectedId) ?? programs[0]

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

  const chooseProgram = (program: Program) => {
    setSelectedId(program.number)
    updateField('program', program.name)
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <main className={`ce-shell ${courseDisplay.variable} ${courseBody.variable}`}>
      <a className="ce-skip-link" href="#course-main">Lewati ke konten</a>
      {mode === 'preview' && (
        <div className="ce-preview-strip">
          <span>Webzoka Store V2 · Course Enrollment preview</span>
          <Link href="/store/template/course-enrollment">Lihat arah template <ArrowUpRight size={14} aria-hidden="true" /></Link>
        </div>
      )}

      <header className="ce-topbar">
        <Link className="ce-brand" href="/store" aria-label="Kembali ke Webzoka Store">
          <span className="ce-brand-mark" aria-hidden="true">K</span>
          <span>Kelas Reka</span>
        </Link>
        <nav id="course-navigation" className={`ce-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navigasi Kelas Reka">
          <a href="#program" onClick={closeMenu}>Program</a>
          <a href="#jadwal" onClick={closeMenu}>Jadwal</a>
          <a href="#cara-belajar" onClick={closeMenu}>Cara Belajar</a>
          <a href="#tentang" onClick={closeMenu}>Tentang</a>
          <a href="#faq" onClick={closeMenu}>FAQ</a>
        </nav>
        <div className="ce-topbar-actions">
          <a className="ce-topbar-action" href="#enrollment">Daftar Minat <ArrowUpRight size={16} aria-hidden="true" /></a>
          <button className="ce-menu-button" type="button" aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={menuOpen} aria-controls="course-navigation" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </header>

      <div id="course-main">
        <section className="ce-hero" aria-labelledby="course-enrollment-title">
          <div className="ce-hero-copy">
            <p className="ce-eyebrow"><Sparkles size={14} aria-hidden="true" /> Belajar dengan arah yang lebih jelas</p>
            <h1 id="course-enrollment-title">Temukan program yang cocok untuk <em>langkah berikutnya.</em></h1>
            <p className="ce-hero-summary">Kenali pilihan program, bandingkan cara belajar, lalu kirim minatmu dengan informasi yang cukup untuk memulai percakapan.</p>
            <div className="ce-hero-actions">
              <a className="ce-button ce-button-primary" href="#program">Lihat Program <ChevronRight size={18} aria-hidden="true" /></a>
              <a className="ce-button ce-button-quiet" href="#cara-belajar">Cara Belajar <ArrowUpRight size={17} aria-hidden="true" /></a>
            </div>
            <p className="ce-hero-note"><Route size={16} aria-hidden="true" /> Program, jadwal, dan langkah pendaftaran dijelaskan sebelum admin menindaklanjuti.</p>
          </div>
          <div className="ce-hero-visual" aria-hidden="true">
            <div className="ce-hero-grid" />
            <div className="ce-hero-route-board">
              <div className="ce-route-header"><span>PROGRAM ROUTE</span><span>CONTOH / 01</span></div>
              <div className="ce-route-line" />
              <div className="ce-route-step ce-route-step-active"><span>01</span><strong>Kenali tujuan</strong><small>Mulai dari yang ingin kamu pelajari.</small></div>
              <div className="ce-route-step"><span>02</span><strong>Pilih program</strong><small>Bandingkan ritme dan format belajar.</small></div>
              <div className="ce-route-step"><span>03</span><strong>Mulai dengan minat</strong><small>Admin membantu langkah berikutnya.</small></div>
              <div className="ce-route-stamp"><Compass size={16} aria-hidden="true" /><span>Kelas Reka · learning path</span></div>
            </div>
            <div className="ce-hero-tag ce-hero-tag-top"><BookOpenCheck size={16} aria-hidden="true" /><span>Struktur jelas</span></div>
            <div className="ce-hero-tag ce-hero-tag-bottom"><span>01 / 04</span><strong>Find your<br />next step.</strong></div>
          </div>
        </section>

        <section className="ce-programs" id="program" aria-labelledby="program-title">
          <div className="ce-section-heading">
            <div><p className="ce-eyebrow">Program yang bisa kamu jelajahi</p><h2 id="program-title">Mulai dari tujuan, bukan dari istilah yang rumit.</h2></div>
            <p>Pilih satu program untuk melihat target peserta, contoh durasi, format, hal yang dipelajari, dan persiapan awal.</p>
          </div>
          <div className="ce-program-workbench">
            <div className="ce-program-list" aria-label="Daftar program contoh">
              {programs.map((program) => (
                <button className={`ce-program-picker ${selected.number === program.number ? 'is-active' : ''}`} type="button" key={program.number} aria-pressed={selected.number === program.number} onClick={() => chooseProgram(program)}>
                  <span className="ce-program-picker-index">{program.number}</span>
                  <span className="ce-program-picker-copy"><strong>{program.name}</strong><small>{program.audience}</small></span>
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              ))}
              <p className="ce-demo-note">Semua program, durasi, dan format di sini adalah konten demo yang dapat dikonfigurasi.</p>
            </div>
            <article className={`ce-program-detail ${selected.tone}`} aria-live="polite">
              <div className="ce-program-detail-top"><p className="ce-eyebrow">Program terpilih · contoh</p><span>{selected.number} / 03</span></div>
              <h3>{selected.name}</h3>
              <p className="ce-program-summary">{selected.summary}</p>
              <p className="ce-program-audience"><strong>Cocok untuk siapa</strong>{selected.audience}</p>
              <dl className="ce-program-meta"><div><dt>Level</dt><dd>{selected.level}</dd></div><div><dt>Durasi</dt><dd>{selected.duration}</dd></div><div><dt>Frekuensi</dt><dd>{selected.frequency}</dd></div><div><dt>Format</dt><dd>{selected.format}</dd></div></dl>
              <div className="ce-program-detail-columns">
                <div><h4>Yang akan dipelajari</h4><ul>{selected.learn.map((item) => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul></div>
                <div><h4>Termasuk dalam contoh</h4><ul>{selected.includes.map((item) => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul></div>
              </div>
              <div className="ce-program-prepare"><Clock3 size={17} aria-hidden="true" /><p><strong>Sebelum mulai</strong>{selected.prepare}</p></div>
              <a className="ce-button ce-button-dark" href="#enrollment" onClick={() => updateField('program', selected.name)}>Daftar Minat <ArrowUpRight size={17} aria-hidden="true" /></a>
            </article>
          </div>
        </section>

        <section className="ce-featured" aria-labelledby="featured-title">
          <div className="ce-featured-copy"><p className="ce-eyebrow">Satu contoh learning path</p><h2 id="featured-title">Belajar lebih mudah ketika langkahnya terlihat.</h2><p>Kelas Reka membantu penyelenggara menjelaskan urutan belajar tanpa mengubah website menjadi dashboard siswa. Struktur ini adalah contoh komposisi yang bisa diganti sesuai program.</p><a className="ce-text-link ce-text-link-light" href="#enrollment">Tanyakan tentang program <ArrowUpRight size={17} aria-hidden="true" /></a></div>
          <div className="ce-featured-board">
            <div className="ce-featured-board-head"><span>BAHASA JEPANG DASAR</span><span>CONTOH STRUKTUR</span></div>
            <div className="ce-featured-path"><div><span>01</span><strong>Fondasi</strong><small>Ungkapan & pola dasar</small></div><div><span>02</span><strong>Latihan</strong><small>Percakapan bertahap</small></div><div><span>03</span><strong>Review</strong><small>Tinjau pertanyaan</small></div></div>
            <p className="ce-featured-footnote">Urutan materi dapat disesuaikan oleh penyelenggara.</p>
          </div>
        </section>

        <section className="ce-journey" id="cara-belajar" aria-labelledby="journey-title">
          <div className="ce-section-heading"><div><p className="ce-eyebrow">Cara belajar</p><h2 id="journey-title">Empat langkah yang mudah diikuti.</h2></div><p>Pengunjung memahami apa yang terjadi setelah memilih program, tanpa perlu membuat akun atau membayar di dalam preview.</p></div>
          <ol className="ce-journey-grid">{journeySteps.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
        </section>

        <section className="ce-schedule" id="jadwal" aria-labelledby="schedule-title">
          <div className="ce-schedule-copy"><p className="ce-eyebrow">Jadwal & intake</p><h2 id="schedule-title">Pilih ritme yang terasa masuk akal.</h2><p>Contoh di bawah membantu calon peserta membayangkan pilihan waktu. Jadwal dapat berubah dan perlu dikonfirmasi bersama penyelenggara.</p><p className="ce-schedule-disclaimer"><Clock3 size={16} aria-hidden="true" /> Jadwal contoh — dapat disesuaikan dengan penyelenggara.</p></div>
          <div className="ce-schedule-list">{scheduleCards.map(([label, day, time, copy]) => <article key={label}><div className="ce-schedule-card-top"><span>{label}</span><span>CONTOH</span></div><strong>{day}</strong><b>{time}</b><p>{copy}</p><a className="ce-inline-link" href="#enrollment">Tanyakan kecocokan <ArrowUpRight size={16} aria-hidden="true" /></a></article>)}</div>
        </section>

        <section className="ce-trust" id="tentang" aria-labelledby="trust-title">
          <div className="ce-section-heading"><div><p className="ce-eyebrow">Tentang Kelas Reka</p><h2 id="trust-title">Kejelasan adalah bagian dari pengalaman belajar.</h2></div><p>Kepercayaan dimulai dari informasi yang bisa dipahami, bukan dari angka atau klaim yang belum punya sumber.</p></div>
          <div className="ce-trust-grid"><article><BookOpenCheck size={20} aria-hidden="true" /><h3>Program detail jelas</h3><p>Peserta bisa melihat tujuan, contoh struktur, durasi, dan format sebelum mengirim minat.</p></article><article><Clock3 size={20} aria-hidden="true" /><h3>Jadwal transparan</h3><p>Informasi intake ditampilkan sebagai contoh dan tidak berpura-pura menjadi ketersediaan live.</p></article><article><Compass size={20} aria-hidden="true" /><h3>Format terbaca</h3><p>Pilihan online, tatap muka, atau workshop dijelaskan sesuai kebutuhan program.</p></article><article><CircleHelp size={20} aria-hidden="true" /><h3>Admin mudah dihubungi</h3><p>Minat yang dikirim menjadi titik awal percakapan, bukan status pendaftaran yang sudah pasti.</p></article></div>
        </section>

        <section className="ce-enrollment" id="enrollment" aria-labelledby="enrollment-title">
          <div className="ce-enrollment-intro"><p className="ce-eyebrow">Daftar Minat</p><h2 id="enrollment-title">Ceritakan tujuan belajarmu.</h2><p>Isi singkat agar admin dapat membantu memilih program, ritme, dan langkah berikutnya.</p><div className="ce-form-boundary"><Check size={17} aria-hidden="true" /><span>Preview ini tidak membuat akun, menerima pembayaran, atau mengonfirmasi enrollment.</span></div></div>
          <div className="ce-form-panel">
            {submitted ? (
              <div className="ce-confirmation" role="status" aria-live="polite">
                <div className="ce-confirmation-icon"><Check size={28} aria-hidden="true" /></div>
                <p className="ce-eyebrow">Minat diterima di preview</p>
                <h3>Pendaftaran minat sudah dicatat.</h3>
                <p>Admin akan menghubungi kamu untuk memastikan program, jadwal, dan langkah berikutnya. Preview ini tidak mengirim data ke layanan eksternal.</p>
                <button className="ce-button ce-button-secondary" type="button" onClick={resetForm}>Kirim minat lain</button>
              </div>
            ) : (
              <form className="ce-form" autoComplete="off" onSubmit={handleSubmit}>
                <div className="ce-form-heading"><div><p className="ce-form-kicker"><Send size={15} aria-hidden="true" /> Percakapan awal</p><h3>Mulai dari informasi yang sudah kamu punya.</h3></div><span>* wajib diisi</span></div>
                <div className="ce-field-grid">
                  <label className="ce-field"><span>Program <small>*</small></span><select name="program" required value={form.program} onChange={(event) => updateField('program', event.target.value)}><option value="" disabled>Pilih program…</option>{programs.map((program) => <option key={program.name} value={program.name}>{program.name}</option>)}</select></label>
                  <label className="ce-field"><span>Preferensi jadwal <small>*</small></span><select name="schedule" required value={form.schedule} onChange={(event) => updateField('schedule', event.target.value)}><option value="" disabled>Pilih ritme…</option>{scheduleOptions.map(([label, detail]) => <option key={label} value={label}>{label} · {detail}</option>)}</select></label>
                  <label className="ce-field"><span>Nama <small>*</small></span><input name="name" required autoComplete="name" value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Nama lengkap…" /></label>
                  <label className="ce-field"><span>WhatsApp <small>*</small></span><input name="whatsapp" required autoComplete="tel" inputMode="tel" type="tel" value={form.whatsapp} onChange={(event) => updateField('whatsapp', event.target.value)} placeholder="08xx xxxx xxxx…" /></label>
                  <label className="ce-field"><span>Email <small>(opsional)</small></span><input name="email" autoComplete="email" spellCheck={false} type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} placeholder="nama@contoh.com…" /></label>
                  <label className="ce-field"><span>Level saat ini <small>*</small></span><select name="level" required value={form.level} onChange={(event) => updateField('level', event.target.value)}><option value="" disabled>Pilih level…</option><option value="Pemula">Pemula</option><option value="Pernah belajar sebelumnya">Pernah belajar sebelumnya</option><option value="Belum yakin">Belum yakin</option></select></label>
                  <label className="ce-field ce-field-full"><span>Tujuan atau catatan singkat <small>(opsional)</small></span><textarea name="note" value={form.note} onChange={(event) => updateField('note', event.target.value)} placeholder="Ceritakan tujuan belajar kamu…" rows={4} /><small className="ce-field-help">Tulis konteks umum yang membantu admin memahami kebutuhanmu.</small></label>
                </div>
                <button className="ce-button ce-button-primary ce-submit" type="submit">Daftar Minat <Send size={17} aria-hidden="true" /></button>
                <p className="ce-form-footnote">Dengan mengirim form demo, kamu melihat contoh state konfirmasi. Tidak ada akun atau enrollment nyata yang dibuat.</p>
              </form>
            )}
          </div>
        </section>

        <section className="ce-faq" id="faq" aria-labelledby="faq-title">
          <div className="ce-section-heading"><div><p className="ce-eyebrow">Pertanyaan umum</p><h2 id="faq-title">Sebelum mengirim minat.</h2></div><p>Jawaban singkat untuk membantu calon peserta memahami alur awalnya.</p></div>
          <div className="ce-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
        </section>

        <section className="ce-final" aria-labelledby="final-title">
          <div><p className="ce-eyebrow">Mulai dengan pertanyaanmu</p><h2 id="final-title">Belum yakin program mana yang paling sesuai?</h2><p>Ceritakan tujuan belajarmu. Admin akan membantu menentukan langkah berikutnya.</p></div>
          <div className="ce-final-actions"><a className="ce-button ce-button-dark" href="#enrollment">Konsultasi Program <ArrowUpRight size={17} aria-hidden="true" /></a><a className="ce-text-link" href="#enrollment">Daftar Minat <ArrowUpRight size={17} aria-hidden="true" /></a></div>
        </section>
      </div>

      <footer className="ce-footer"><span>Kelas Reka · Course Enrollment prototype</span><Link href="/store"><ArrowLeft size={15} aria-hidden="true" /> Kembali ke Webzoka Store</Link></footer>
    </main>
  )
}
