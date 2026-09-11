'use client'

import Link from 'next/link'
import { Barlow_Condensed, IBM_Plex_Sans } from 'next/font/google'
import { type FormEvent, useState } from 'react'
import {
  ArrowLeft,
  ArrowUpRight,
  CarFront,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Fuel,
  Gauge,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react'

const bookingDisplay = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-booking-display',
})

const bookingBody = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-booking-body',
})

type Mode = 'detail' | 'preview'
type Category = 'Semua' | 'City Car' | 'Family' | 'MPV' | 'Premium'
type VehicleTone = 'teal' | 'sand' | 'amber' | 'sky' | 'ink' | 'mint'

type Vehicle = {
  id: string
  name: string
  category: Exclude<Category, 'Semua'>
  price: string
  tagline: string
  description: string
  seats: string
  transmission: string
  luggage: string
  fuel: string
  terms: string
  pickup: string
  tone: VehicleTone
}

const categories: Category[] = ['Semua', 'City Car', 'Family', 'MPV', 'Premium']

const vehicles: Vehicle[] = [
  {
    id: 'nara-city',
    name: 'Nara City 1.2',
    category: 'City Car',
    price: 'Mulai Rp280.000 / hari',
    tagline: 'Ringkas untuk rute kota.',
    description: 'Pilihan ringkas untuk perjalanan harian, agenda singkat, dan rute kota yang ingin tetap praktis.',
    seats: '5 kursi',
    transmission: 'Automatic',
    luggage: '2 tas kabin',
    fuel: 'Bensin',
    terms: 'Contoh unit harian. Detail waktu dan harga mengikuti konfirmasi admin.',
    pickup: 'Pickup di lokasi penyedia · contoh',
    tone: 'teal',
  },
  {
    id: 'kita-hatchback',
    name: 'Kita Hatchback',
    category: 'City Car',
    price: 'Mulai Rp320.000 / hari',
    tagline: 'Lincah untuk agenda padat.',
    description: 'Bodi kompak dengan ruang yang cukup untuk kebutuhan mobilitas yang berubah sepanjang hari.',
    seats: '5 kursi',
    transmission: 'Automatic',
    luggage: '2 tas kabin',
    fuel: 'Bensin',
    terms: 'Contoh harga dapat diubah sesuai kebijakan bisnis rental.',
    pickup: 'Lokasi pickup menyesuaikan penyedia · contoh',
    tone: 'sand',
  },
  {
    id: 'teras-family',
    name: 'Teras Family',
    category: 'Family',
    price: 'Mulai Rp450.000 / hari',
    tagline: 'Ruang lebih untuk akhir pekan.',
    description: 'Kabin lega untuk agenda keluarga atau perjalanan beberapa hari dengan barang bawaan yang lebih banyak.',
    seats: '7 kursi',
    transmission: 'Automatic',
    luggage: '3 tas kabin',
    fuel: 'Bensin',
    terms: 'Durasi minimum dan detail harga perlu dibicarakan sebelum konfirmasi.',
    pickup: 'Pickup / drop-off mengikuti area layanan · contoh',
    tone: 'amber',
  },
  {
    id: 'raya-mpv',
    name: 'Raya MPV',
    category: 'MPV',
    price: 'Mulai Rp520.000 / hari',
    tagline: 'Siap untuk rombongan kecil.',
    description: 'Pilihan serbaguna untuk rombongan, kebutuhan keluarga, atau rute dengan perlengkapan tambahan.',
    seats: '7 kursi',
    transmission: 'Automatic',
    luggage: '4 tas kabin',
    fuel: 'Bensin',
    terms: 'Spesifikasi dan contoh harga di halaman ini bersifat demo.',
    pickup: 'Detail titik pickup dibahas bersama admin · contoh',
    tone: 'sky',
  },
  {
    id: 'jati-mpv',
    name: 'Jati MPV',
    category: 'MPV',
    price: 'Mulai Rp600.000 / hari',
    tagline: 'Ruang fleksibel untuk perjalanan panjang.',
    description: 'Kabin dengan ruang yang mudah disesuaikan untuk perjalanan bersama dan kebutuhan bagasi yang lebih besar.',
    seats: '7 kursi',
    transmission: 'Manual',
    luggage: '4 tas kabin',
    fuel: 'Bensin',
    terms: 'Kebijakan rental final mengikuti penyedia dan kesepakatan booking.',
    pickup: 'Area layanan perlu dikonfirmasi sebelum rental · contoh',
    tone: 'ink',
  },
  {
    id: 'sora-executive',
    name: 'Sora Executive',
    category: 'Premium',
    price: 'Mulai Rp850.000 / hari',
    tagline: 'Nyaman untuk agenda yang lebih terencana.',
    description: 'Pilihan dengan ruang dan tampilan yang lebih tenang untuk kebutuhan perjalanan atau agenda kerja tertentu.',
    seats: '6 kursi',
    transmission: 'Automatic',
    luggage: '3 tas kabin',
    fuel: 'Bensin',
    terms: 'Ketersediaan, harga final, dan detail layanan dikonfirmasi admin.',
    pickup: 'Pengaturan lokasi dibahas saat konfirmasi · contoh',
    tone: 'mint',
  },
]

const processSteps = [
  ['01', 'Pilih unit', 'Bandingkan kategori, spesifikasi, dan contoh harga yang paling dekat dengan kebutuhanmu.'],
  ['02', 'Ajukan tanggal', 'Kirim rentang tanggal serta preferensi pickup yang ingin kamu tanyakan.'],
  ['03', 'Admin konfirmasi', 'Admin mengecek ketersediaan unit, detail rental, dan harga final bersama kamu.'],
  ['04', 'Rental dimulai', 'Gunakan unit sesuai waktu dan kesepakatan yang sudah dikonfirmasi.'],
]

const faqs = [
  ['Apakah unit langsung terkonfirmasi setelah request?', 'Belum. Form ini adalah permintaan booking. Admin perlu mengonfirmasi ketersediaan unit, detail rental, dan harga final terlebih dahulu.'],
  ['Bagaimana jika tanggal berubah?', 'Sampaikan perubahan melalui percakapan dengan admin. Admin akan membantu mengecek pilihan tanggal yang bisa dibicarakan.'],
  ['Apakah ada minimum rental?', 'Kebijakan minimum rental dapat berbeda menurut unit dan penyedia. Tanyakan detailnya saat admin menindaklanjuti permintaanmu.'],
  ['Bagaimana proses pickup atau drop-off?', 'Pilihan lokasi dan area layanan mengikuti kebijakan penyedia. Form ini hanya mencatat preferensi awal, bukan menjanjikan layanan tertentu.'],
  ['Bagaimana jika unit pilihan tidak tersedia?', 'Admin dapat membantu membandingkan unit lain yang memiliki kategori atau spesifikasi yang mendekati kebutuhanmu.'],
]

const initialForm = {
  vehicle: '',
  startDate: '',
  endDate: '',
  pickup: '',
  name: '',
  whatsapp: '',
  note: '',
}

function VehicleIllustration({ vehicle, compact = false }: { vehicle: Vehicle; compact?: boolean }) {
  return (
    <div className={`eb-vehicle-visual eb-tone-${vehicle.tone} ${compact ? 'eb-vehicle-visual-compact' : ''}`} aria-hidden="true">
      <div className="eb-vehicle-grid" />
      <div className="eb-road-line eb-road-line-one" />
      <div className="eb-road-line eb-road-line-two" />
      <div className="eb-car-shape">
        <span className="eb-car-cabin" />
        <span className="eb-car-body" />
        <span className="eb-car-window eb-car-window-one" />
        <span className="eb-car-window eb-car-window-two" />
        <span className="eb-car-wheel eb-car-wheel-one" />
        <span className="eb-car-wheel eb-car-wheel-two" />
        <span className="eb-car-light eb-car-light-one" />
        <span className="eb-car-light eb-car-light-two" />
      </div>
      {!compact && <span className="eb-vehicle-mark">RJ / DEMO</span>}
    </div>
  )
}

export function EasyBookingExperience({ mode }: { mode: Mode }) {
  const [activeCategory, setActiveCategory] = useState<Category>('Semua')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(vehicles[0].id)
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const selected = vehicles.find((vehicle) => vehicle.id === selectedId) ?? vehicles[0]
  const normalizedQuery = query.trim().toLowerCase()
  const visibleVehicles = vehicles.filter((vehicle) => {
    const categoryMatches = activeCategory === 'Semua' || vehicle.category === activeCategory
    const queryMatches = !normalizedQuery || [vehicle.name, vehicle.category, vehicle.tagline, vehicle.description]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery)
    return categoryMatches && queryMatches
  })

  const updateField = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const chooseVehicle = (vehicle: Vehicle) => {
    setSelectedId(vehicle.id)
    updateField('vehicle', vehicle.id)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)
  }

  const resetForm = () => {
    setForm(initialForm)
    setSubmitted(false)
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <main className={`eb-shell ${bookingDisplay.variable} ${bookingBody.variable}`}>
      <a className="eb-skip-link" href="#easy-booking-main">Lewati ke konten</a>
      {mode === 'preview' && (
        <div className="eb-preview-strip">
          <span>Webzoka Store V2 · Easy Booking preview</span>
          <Link href="/store/template/easy-booking">Lihat arah template <ArrowUpRight size={14} aria-hidden="true" /></Link>
        </div>
      )}

      <header className="eb-topbar">
        <Link className="eb-brand" href="/store" aria-label="Kembali ke Webzoka Store">
          <span className="eb-brand-mark" aria-hidden="true"><CarFront size={18} /></span>
          <span>Ruang Jalan Rental</span>
        </Link>
        <nav id="easy-booking-navigation" className={`eb-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navigasi Ruang Jalan Rental">
          <a href="#unit" onClick={closeMenu}>Unit</a>
          <a href="#kategori" onClick={closeMenu}>Kategori</a>
          <a href="#cara-rental" onClick={closeMenu}>Cara Rental</a>
          <a href="#syarat" onClick={closeMenu}>Syarat</a>
          <a href="#lokasi" onClick={closeMenu}>Lokasi</a>
          <a href="#faq" onClick={closeMenu}>FAQ</a>
        </nav>
        <div className="eb-topbar-actions">
          <a className="eb-topbar-action" href="#booking">Ajukan Booking <ArrowUpRight size={16} aria-hidden="true" /></a>
          <button className="eb-menu-button" type="button" aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={menuOpen} aria-controls="easy-booking-navigation" onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </header>

      <div id="easy-booking-main">
        <section className="eb-hero" aria-labelledby="easy-booking-title">
          <div className="eb-hero-copy">
            <p className="eb-eyebrow"><CarFront size={15} aria-hidden="true" /> Pilihan unit untuk kebutuhanmu</p>
            <h1 id="easy-booking-title">Temukan unit yang tepat, lalu ajukan waktu rental dengan <em>mudah.</em></h1>
            <p className="eb-hero-summary">Bandingkan unit, lihat spesifikasi dan contoh harga, lalu kirim preferensi tanggal. Admin akan mengonfirmasi ketersediaan dan harga final bersama kamu.</p>
            <div className="eb-hero-actions">
              <a className="eb-button eb-button-primary" href="#unit">Lihat Unit <ChevronRight size={18} aria-hidden="true" /></a>
              <a className="eb-button eb-button-quiet" href="#cara-rental">Cara Rental <ArrowUpRight size={17} aria-hidden="true" /></a>
            </div>
            <p className="eb-hero-note"><ShieldCheck size={16} aria-hidden="true" /> Preview ini membantu mengirim inquiry. Ketersediaan unit tidak ditampilkan secara live.</p>
          </div>
          <div className="eb-hero-visual-wrap">
            <div className="eb-hero-visual-top"><span>UNIT 01 / 06</span><span>RUTE HARIAN</span></div>
            <VehicleIllustration vehicle={vehicles[0]} />
            <div className="eb-hero-vehicle-card"><span>{vehicles[0].category} · contoh</span><strong>{vehicles[0].name}</strong><small>{vehicles[0].price}</small></div>
            <div className="eb-hero-stamp"><Gauge size={15} aria-hidden="true" /><span>PILIH · TANYAKAN · KONFIRMASI</span></div>
          </div>
        </section>

        <section className="eb-category-section" id="kategori" aria-labelledby="category-title">
          <div className="eb-section-heading">
            <div><p className="eb-eyebrow"><CarFront size={15} aria-hidden="true" /> Mulai dari kebutuhanmu</p><h2 id="category-title">Kategori yang mudah dipindai.</h2></div>
            <p>Pilih tipe kendaraan yang paling dekat dengan rute dan jumlah penumpangmu. Semua unit di bawah adalah contoh konten yang dapat dikonfigurasi.</p>
          </div>
          <div className="eb-category-grid">
            {categories.filter((category) => category !== 'Semua').map((category, index) => {
              const firstVehicle = vehicles.find((vehicle) => vehicle.category === category) ?? vehicles[0]
              return (
                <button className={`eb-category-card ${activeCategory === category ? 'is-active' : ''}`} type="button" key={category} aria-pressed={activeCategory === category} onClick={() => { setActiveCategory(category); setQuery('') }}>
                  <span className="eb-category-index">0{index + 1}</span>
                  <span className="eb-category-name">{category}</span>
                  <span className="eb-category-copy">{firstVehicle.tagline}</span>
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              )
            })}
          </div>
          <button className="eb-category-reset" type="button" onClick={() => { setActiveCategory('Semua'); setQuery('') }}>Lihat semua unit <ArrowUpRight size={16} aria-hidden="true" /></button>
        </section>

        <section className="eb-featured" aria-labelledby="featured-title">
          <div className="eb-section-heading eb-section-heading-light">
            <div><p className="eb-eyebrow">Pilihan untuk mulai membandingkan</p><h2 id="featured-title">Unit yang membantu keputusan jadi lebih cepat.</h2></div>
            <p>Mulai dari dua contoh berikut, lalu buka detail unit untuk melihat informasi yang lebih praktis sebelum mengirim request.</p>
          </div>
          <div className="eb-featured-grid">
            {vehicles.slice(0, 2).map((vehicle) => (
              <article className="eb-featured-card" key={vehicle.id}>
                <VehicleIllustration vehicle={vehicle} compact />
                <div className="eb-featured-card-copy"><span>{vehicle.category} · contoh</span><h3>{vehicle.name}</h3><p>{vehicle.tagline}</p><strong>{vehicle.price}</strong><button className="eb-inline-action" type="button" onClick={() => chooseVehicle(vehicle)}>Lihat detail <ArrowUpRight size={16} aria-hidden="true" /></button></div>
              </article>
            ))}
          </div>
        </section>

        <section className="eb-catalog" id="unit" aria-labelledby="catalog-title">
          <div className="eb-section-heading">
            <div><p className="eb-eyebrow"><Search size={15} aria-hidden="true" /> Unit catalog</p><h2 id="catalog-title">Pilih dengan informasi yang cukup.</h2></div>
            <p>Filter kategori atau cari nama unit. Harga yang tampil adalah contoh awal, bukan harga final atau jaminan ketersediaan.</p>
          </div>
          <div className="eb-catalog-tools">
            <div className="eb-category-rail" aria-label="Kategori unit">
              {categories.map((category) => (
                <button className={activeCategory === category ? 'is-active' : ''} type="button" key={category} aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>
              ))}
            </div>
            <label className="eb-search-field"><Search size={18} aria-hidden="true" /><span className="sr-only">Cari unit</span><input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Cari unit atau kategori" /></label>
          </div>
          <div className="eb-result-summary" aria-live="polite"><span>{visibleVehicles.length} unit ditampilkan</span><span>Availability dikonfirmasi admin.</span></div>
          {visibleVehicles.length > 0 ? (
            <div className="eb-unit-grid">
              {visibleVehicles.map((vehicle) => (
                <article className={`eb-unit-card ${selected.id === vehicle.id ? 'is-selected' : ''}`} key={vehicle.id}>
                  <VehicleIllustration vehicle={vehicle} compact />
                  <div className="eb-unit-card-copy"><div className="eb-unit-card-top"><span>{vehicle.category}</span><span>DEMO</span></div><h3>{vehicle.name}</h3><p>{vehicle.tagline}</p><dl><div><dt>Kursi</dt><dd>{vehicle.seats}</dd></div><div><dt>Transmisi</dt><dd>{vehicle.transmission}</dd></div></dl><div className="eb-unit-card-bottom"><strong>{vehicle.price}</strong><button className="eb-inline-action" type="button" onClick={() => chooseVehicle(vehicle)}>Lihat detail <ChevronRight size={16} aria-hidden="true" /></button></div></div>
                </article>
              ))}
            </div>
          ) : (
            <div className="eb-empty-state"><Search size={24} aria-hidden="true" /><h3>Unit belum ditemukan.</h3><p>Coba kata kunci lain atau kembalikan filter ke semua kategori.</p><button className="eb-category-reset" type="button" onClick={() => { setQuery(''); setActiveCategory('Semua') }}>Reset pencarian <ArrowUpRight size={16} aria-hidden="true" /></button></div>
          )}
        </section>

        <section className="eb-detail" id="detail" aria-labelledby="detail-title">
          <div className="eb-detail-visual"><div className="eb-detail-label"><span>UNIT TERPILIH</span><strong>{selected.category}</strong></div><VehicleIllustration vehicle={selected} /><div className="eb-detail-visual-foot"><span>{selected.name}</span><span>01 / 06</span></div></div>
          <div className="eb-detail-copy">
            <p className="eb-eyebrow">Detail unit · contoh yang dapat dikonfigurasi</p>
            <h2 id="detail-title">{selected.name}</h2>
            <p className="eb-detail-price">{selected.price}</p>
            <p className="eb-detail-description">{selected.description}</p>
            <dl className="eb-spec-grid"><div><dt><Users size={15} aria-hidden="true" /> Kursi</dt><dd>{selected.seats}</dd></div><div><dt><Settings2 size={15} aria-hidden="true" /> Transmisi</dt><dd>{selected.transmission}</dd></div><div><dt><Gauge size={15} aria-hidden="true" /> Bagasi</dt><dd>{selected.luggage}</dd></div><div><dt><Fuel size={15} aria-hidden="true" /> Bahan bakar</dt><dd>{selected.fuel}</dd></div></dl>
            <div className="eb-detail-terms"><div><strong>Syarat rental</strong><p>{selected.terms}</p></div><div><strong>Pickup / drop-off</strong><p>{selected.pickup}</p></div></div>
            <a className="eb-button eb-button-primary" href="#booking" onClick={() => updateField('vehicle', selected.id)}>Ajukan Booking <ArrowUpRight size={17} aria-hidden="true" /></a>
            <p className="eb-detail-disclaimer">Permintaan ini belum menjadi reservasi. Admin perlu mengonfirmasi ketersediaan, detail rental, dan harga final.</p>
            <div className="eb-related"><span>Bandingkan unit lain</span><div>{vehicles.filter((vehicle) => vehicle.id !== selected.id).slice(0, 3).map((vehicle) => <button type="button" key={vehicle.id} onClick={() => chooseVehicle(vehicle)}>{vehicle.name}<ChevronRight size={15} aria-hidden="true" /></button>)}</div></div>
          </div>
        </section>

        <section className="eb-process" id="cara-rental" aria-labelledby="process-title">
          <div className="eb-section-heading eb-section-heading-light"><div><p className="eb-eyebrow">Cara rental</p><h2 id="process-title">Jelas sejak request pertama.</h2></div><p>Alurnya membantu pengunjung tahu mana yang bisa dilakukan di website dan mana yang perlu dikonfirmasi bersama admin.</p></div>
          <ol className="eb-process-grid">{processSteps.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
        </section>

        <section className="eb-terms" id="syarat" aria-labelledby="terms-title">
          <div className="eb-section-heading"><div><p className="eb-eyebrow"><ShieldCheck size={15} aria-hidden="true" /> Informasi sebelum request</p><h2 id="terms-title">Syarat disiapkan dengan jujur.</h2></div><p>Contoh informasi di bawah memberi ruang untuk dikonfigurasi oleh setiap penyedia rental. Tidak ada janji legal, deposit, atau layanan yang dipaksakan di preview ini.</p></div>
          <div className="eb-terms-grid"><article><span>01</span><h3>Identitas</h3><p>Dokumen identitas dapat diminta saat proses final, sesuai kebijakan penyedia.</p></article><article><span>02</span><h3>Deposit</h3><p>Detail deposit, bila ada, menyesuaikan kebijakan penyedia dan perlu dijelaskan sebelum sepakat.</p></article><article><span>03</span><h3>Area layanan</h3><p>Lokasi pickup atau drop-off mengikuti area layanan yang dapat dikonfirmasi admin.</p></article></div>
          <p className="eb-terms-note"><Check size={17} aria-hidden="true" /> Jangan unggah dokumen identitas atau data sensitif melalui prototype ini.</p>
        </section>

        <section className="eb-booking" id="booking" aria-labelledby="booking-title">
          <div className="eb-booking-intro"><p className="eb-eyebrow">Ajukan Booking</p><h2 id="booking-title">Tentukan preferensimu.</h2><p>Isi singkat agar admin dapat mengecek unit, tanggal, dan detail rental yang paling relevan untuk dibicarakan.</p><div className="eb-form-boundary"><ShieldCheck size={17} aria-hidden="true" /><span>Form demo ini tidak mengunci unit, menerima pembayaran, atau mengonfirmasi reservasi.</span></div></div>
          <div className="eb-form-panel">
            {submitted ? (
              <div className="eb-confirmation" role="status" aria-live="polite"><div className="eb-confirmation-icon"><Check size={28} aria-hidden="true" /></div><p className="eb-eyebrow">Inquiry tercatat di preview</p><h3>Permintaan booking sudah dicatat.</h3><p>Admin akan menghubungi kamu untuk mengonfirmasi ketersediaan unit, detail rental, dan harga final. Preview ini tidak mengirim data ke layanan eksternal.</p><button className="eb-button eb-button-secondary" type="button" onClick={resetForm}>Ajukan request lain</button></div>
            ) : (
              <form className="eb-form" autoComplete="off" onSubmit={handleSubmit}><div className="eb-form-heading"><div><p className="eb-form-kicker"><Send size={15} aria-hidden="true" /> Percakapan awal</p><h3>Mulai dari informasi yang kamu punya.</h3></div><span>* wajib diisi</span></div><div className="eb-field-grid">
                <label className="eb-field"><span>Unit <small>*</small></span><select name="vehicle" required value={form.vehicle} onChange={(event) => { const vehicle = vehicles.find((item) => item.id === event.target.value); if (vehicle) setSelectedId(vehicle.id); updateField('vehicle', event.target.value) }}><option value="" disabled>Pilih unit…</option>{vehicles.map((vehicle) => <option value={vehicle.id} key={vehicle.id}>{vehicle.name} · {vehicle.category}</option>)}</select></label>
                <label className="eb-field"><span>Preferensi pickup <small>*</small></span><select name="pickup" required value={form.pickup} onChange={(event) => updateField('pickup', event.target.value)}><option value="" disabled>Pilih preferensi…</option><option value="Ambil di lokasi contoh">Ambil di lokasi contoh</option><option value="Tanyakan opsi lokasi">Tanyakan opsi lokasi</option><option value="Belum yakin">Belum yakin</option></select></label>
                <label className="eb-field"><span>Tanggal mulai <small>*</small></span><input name="startDate" required type="date" value={form.startDate} onChange={(event) => updateField('startDate', event.target.value)} /></label>
                <label className="eb-field"><span>Tanggal selesai <small>*</small></span><input name="endDate" required type="date" value={form.endDate} onChange={(event) => updateField('endDate', event.target.value)} /></label>
                <label className="eb-field"><span>Nama <small>*</small></span><input name="name" required autoComplete="name" value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Nama lengkap…" /></label>
                <label className="eb-field"><span>WhatsApp <small>*</small></span><input name="whatsapp" required autoComplete="tel" inputMode="tel" type="tel" value={form.whatsapp} onChange={(event) => updateField('whatsapp', event.target.value)} placeholder="08xx xxxx xxxx…" /></label>
                <label className="eb-field eb-field-full"><span>Catatan atau kebutuhan khusus <small>(opsional)</small></span><textarea name="note" rows={4} value={form.note} onChange={(event) => updateField('note', event.target.value)} placeholder="Contoh: ingin membandingkan dengan unit lain…" /><small className="eb-field-help">Tulis konteks umum. Jangan kirim dokumen identitas atau data sensitif.</small></label>
              </div><button className="eb-button eb-button-primary eb-submit" type="submit">Ajukan Booking <Send size={17} aria-hidden="true" /></button><p className="eb-form-footnote">Dengan mengirim form demo, kamu melihat contoh state konfirmasi. Belum ada reservasi yang dibuat.</p></form>
            )}
          </div>
        </section>

        <section className="eb-location" id="lokasi" aria-labelledby="location-title">
          <div className="eb-map-card" aria-hidden="true"><div className="eb-map-grid" /><div className="eb-map-route eb-map-route-one" /><div className="eb-map-route eb-map-route-two" /><div className="eb-map-pin"><MapPin size={24} /></div><span className="eb-map-label">LOKASI CONTOH</span></div>
          <div className="eb-location-copy"><p className="eb-eyebrow"><MapPin size={15} aria-hidden="true" /> Lokasi & area layanan</p><h2 id="location-title">Temui admin di titik yang disepakati.</h2><address><strong>Ruang Jalan Rental</strong><span>Jl. Taman Sore No. 21, Cilandak</span><span>Jakarta Selatan · alamat demo</span></address><p className="eb-location-area"><Clock3 size={16} aria-hidden="true" /><span><strong>Area layanan contoh</strong>Jakarta Selatan dan sekitarnya, menyesuaikan kebijakan penyedia.</span></p><a className="eb-text-link" href="#booking">Tanyakan lokasi pickup <ArrowUpRight size={16} aria-hidden="true" /></a></div>
        </section>

        <section className="eb-faq" id="faq" aria-labelledby="faq-title">
          <div className="eb-section-heading"><div><p className="eb-eyebrow"><CircleHelp size={15} aria-hidden="true" /> Pertanyaan umum</p><h2 id="faq-title">Sebelum mengirim request.</h2></div><p>Jawaban singkat untuk membantu pengunjung memahami batas antara inquiry dan konfirmasi rental.</p></div>
          <div className="eb-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
        </section>

        <section className="eb-final" aria-labelledby="final-title"><div><p className="eb-eyebrow">Sudah menemukan unit yang cocok?</p><h2 id="final-title">Ajukan tanggal yang kamu inginkan.</h2><p>Admin Ruang Jalan akan membantu mengonfirmasi ketersediaan dan detail rental sebelum ada kesepakatan.</p></div><div className="eb-final-actions"><a className="eb-button eb-button-light" href="#booking">Ajukan Booking <ArrowUpRight size={17} aria-hidden="true" /></a><a className="eb-button eb-button-outline" href="https://wa.me/?text=Halo%20Ruang%20Jalan%20Rental%2C%20saya%20ingin%20bertanya%20tentang%20unit%20dan%20tanggal%20rental." target="_blank" rel="noreferrer">Hubungi Admin <MessageCircle size={17} aria-hidden="true" /></a><span>Kontak WhatsApp di preview perlu diganti dengan nomor bisnis sebelum production.</span></div></section>
      </div>

      <footer className="eb-footer"><span>Ruang Jalan Rental · Easy Booking prototype</span><Link href="/store"><ArrowLeft size={15} aria-hidden="true" /> Kembali ke Webzoka Store</Link></footer>
    </main>
  )
}
