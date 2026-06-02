// ============================================================
// Tema "rental" — Warm Drive.
// Palet stone-950 + orange-600. Bold grid, embedded booking form.
// Industri: travel_rental. Theme key: 'rental'.
// Data armada dari tabel services. Profile (wa, kontak) dari tenant_profile.
// ============================================================

import type { PageSection, Service, TenantProfile, FeatureFlags } from '@/types/websitebuilder'
import type { DataKontenRental } from '@/types/websitebuilder'

// ── Palette ──────────────────────────────────────────────────
const ORG   = '#EA580C' // orange-600
const ORG_D = '#9A3412' // orange-900
const ORG_L = '#FED7AA' // orange-200
const STN   = '#1C1917' // stone-900
const MUTED = '#78716C' // stone-500
const BDR   = '#E7E5E4' // stone-200
const PAGE  = '#FFFBF7'

// ── Static fallback fleet (jika services kosong) ─────────────
const FALLBACK_FLEET: Array<{
  emoji: string; name: string; category: string;
  capacity: string; transmission: string; year: string;
  price: number; available: boolean;
}> = [
  { emoji: '🚗', name: 'Toyota Avanza',  category: 'MPV',          capacity: '7 Kursi', transmission: 'Manual',   year: '2022', price: 350_000, available: true },
  { emoji: '🚙', name: 'Toyota Innova',  category: 'Premium MPV',  capacity: '8 Kursi', transmission: 'Otomatis', year: '2023', price: 550_000, available: true },
  { emoji: '🏍️', name: 'Yamaha NMAX',   category: 'Skutik Premium',capacity: '2 Orang', transmission: 'Otomatis', year: '2023', price: 120_000, available: true },
  { emoji: '🛵', name: 'Honda Vario 160',category: 'Skutik',        capacity: '2 Orang', transmission: 'Otomatis', year: '2022', price: 95_000,  available: false },
  { emoji: '🚐', name: 'Toyota HiAce',  category: 'Minibus',       capacity: '15 Kursi',transmission: 'Manual',   year: '2021', price: 950_000, available: true },
  { emoji: '🚘', name: 'Honda HRV',     category: 'SUV',           capacity: '5 Kursi', transmission: 'Otomatis', year: '2023', price: 480_000, available: true },
]

// ── Category → emoji map ──────────────────────────────────────
function vehicleEmoji(kategori: string | null): string {
  const k = (kategori ?? '').toLowerCase()
  if (k.includes('motor') || k.includes('skutik') || k.includes('nmax') || k.includes('vario') || k.includes('beat')) return '🏍️'
  if (k.includes('minibus') || k.includes('hiace') || k.includes('elf')) return '🚐'
  if (k.includes('suv') || k.includes('fortuner') || k.includes('hrv')) return '🚘'
  if (k.includes('premium') || k.includes('innova') || k.includes('alphard')) return '🚙'
  return '🚗'
}

// ── WA float button ───────────────────────────────────────────
function FloatingWA({ wa }: { wa?: string | null }) {
  if (!wa) return null
  return (
    <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
      style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 999, width: 56, height: 56, borderRadius: '50%', backgroundColor: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,211,102,.35)', textDecoration: 'none' }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.535 5.845L.057 23.492a.5.5 0 00.618.618l5.647-1.478A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.917 0-3.71-.504-5.263-1.385l-.378-.217-3.922 1.027 1.027-3.922-.217-.378A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
    </a>
  )
}

// ── Props ─────────────────────────────────────────────────────
interface RentalRendererProps {
  nama: string
  sections: PageSection[]
  services: Service[]
  profile: TenantProfile | null
  wa?: string
  slug: string
  primary?: string
  konten?: DataKontenRental
  features?: FeatureFlags
}

// ── Main renderer ─────────────────────────────────────────────
export default function RentalRenderer({ nama, services, profile, wa, primary = ORG, konten, features = {} }: RentalRendererProps) {
  const accent = primary || ORG
  const waNum = wa ?? profile?.wa ?? null

  // Feature flags — default false jika tidak di-set (belum order add-on tsb)
  const hasBooking  = !!features.hasBooking   // form booking real + kalender
  const hasPayment  = !!features.hasPayment   // tombol bayar Midtrans
  const hasWA       = !!features.hasWhatsApp  // floating WA + CTA WA
  const hasTracking = !!features.hasTracking  // section GPS/tracking
  const hasLiveChat = !!features.hasLiveChat  // live chat widget

  // Build fleet dari services, fallback ke static
  const fleet = services.length > 0
    ? services.map((s) => ({
        emoji: vehicleEmoji(s.kategori),
        name: s.nama,
        category: s.kategori ?? 'Kendaraan',
        capacity: '',
        transmission: '',
        year: '',
        price: s.harga,
        available: s.is_active,
        desc: s.deskripsi ?? '',
      }))
    : FALLBACK_FLEET.map(f => ({ ...f, desc: '' }))

  const kota = konten?.kota_layanan?.join(', ') ?? 'Jakarta, Bandung, Surabaya, Bali'
  const tagline = konten?.tagline ?? 'Perjalanan Lebih Nyaman,\nHarga Lebih Hemat.'
  const deskripsi = konten?.deskripsi ?? 'Armada lengkap — mobil MPV, SUV, hingga motor premium. Siap antar ke tujuan Anda di seluruh Indonesia.'
  const telepon = konten?.kontak?.telepon ?? profile?.wa ?? ''
  const email = konten?.kontak?.email ?? profile?.email ?? ''
  const alamat = konten?.kontak?.alamat ?? profile?.alamat ?? kota

  const taglineLines = tagline.split('\n')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: PAGE, fontFamily: 'system-ui, -apple-system, sans-serif', fontVariantNumeric: 'tabular-nums' }}>

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, backgroundColor: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${BDR}`, zIndex: 50, boxShadow: '0 1px 4px rgba(0,0,0,.04)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, backgroundColor: accent, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 12, flexShrink: 0 }}>
              {nama.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p style={{ fontWeight: 900, color: STN, fontSize: 14, lineHeight: 1.2, margin: 0 }}>{nama}</p>
              <p style={{ fontSize: 10, color: MUTED, fontWeight: 500, margin: 0 }}>Premium Rental</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 32 }}>
            {['Armada', 'Cara Pesan', 'Kontak'].map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`} style={{ fontSize: 14, fontWeight: 600, color: '#57534E', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
          {waNum && (
            <a href={`https://wa.me/${waNum}`} target="_blank" rel="noopener noreferrer"
              style={{ backgroundColor: accent, color: '#fff', fontSize: 13, fontWeight: 700, padding: '10px 20px', borderRadius: 999, textDecoration: 'none', boxShadow: `0 4px 12px ${accent}40` }}>
              Booking Sekarang
            </a>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: `linear-gradient(135deg, #1C0A00, ${ORG_D}, #7C2D12)`, color: '#fff', padding: '80px 24px 120px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 20% 80%, ${accent}30 0%, transparent 50%), radial-gradient(circle at 80% 20%, #D9770630 0%, transparent 50%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 48, alignItems: 'center', position: 'relative', zIndex: 1 }}>
          {/* Copy */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: `${accent}30`, border: `1px solid ${accent}50`, color: ORG_L, fontSize: 11, fontWeight: 900, padding: '7px 16px', borderRadius: 999, marginBottom: 24, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              🏆 #1 Rental Terpercaya
            </div>
            <h1 style={{ fontSize: 56, fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.02em', margin: '0 0 20px', color: '#fff' }}>
              {taglineLines.map((line, i) => (
                <span key={i} style={{ display: 'block', color: i === 1 ? '#FB923C' : '#fff' }}>{line}</span>
              ))}
            </h1>
            <p style={{ color: '#D6D3D1', fontSize: 17, lineHeight: 1.6, marginBottom: 28, fontWeight: 500 }}>{deskripsi}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['500+ Armada', '10.000+ Pelanggan', 'Driver Profesional', 'Asuransi Inklusif'].map((b) => (
                <span key={b} style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,.10)', border: '1px solid rgba(255,255,255,.15)', color: 'rgba(255,255,255,.9)', fontSize: 12, fontWeight: 700, padding: '7px 12px', borderRadius: 999 }}>
                  ✓ {b}
                </span>
              ))}
            </div>
          </div>

          {/* Booking form */}
          <div style={{ backgroundColor: 'rgba(255,255,255,.10)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 28, padding: 28 }}>
            <p style={{ color: '#fff', fontWeight: 900, fontSize: 18, margin: '0 0 4px' }}>Cari Kendaraan</p>
            <p style={{ color: '#A8A29E', fontSize: 13, fontWeight: 500, margin: '0 0 24px' }}>Tersedia hari ini</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Lokasi Penjemputan', placeholder: 'Pilih kota...', options: ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Bali', 'Medan'] },
                { label: 'Jenis Kendaraan', placeholder: 'Semua jenis', options: ['MPV (Avanza, Innova)', 'SUV (HRV, Fortuner)', 'Minibus (HiAce)', 'Motor Skutik', 'Motor Premium'] },
              ].map((f) => (
                <div key={f.label}>
                  <p style={{ color: '#A8A29E', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{f.label}</p>
                  <select defaultValue="" style={{ width: '100%', backgroundColor: 'rgba(255,255,255,.10)', border: '1px solid rgba(255,255,255,.20)', color: '#fff', borderRadius: 14, padding: '12px 16px', fontSize: 14, fontWeight: 500, outline: 'none' }}>
                    <option value="" disabled style={{ color: '#1C1917' }}>{f.placeholder}</option>
                    {f.options.map((o) => <option key={o} style={{ color: '#1C1917' }}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {['Tanggal Mulai', 'Tanggal Selesai'].map((l) => (
                  <div key={l}>
                    <p style={{ color: '#A8A29E', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{l}</p>
                    <input type="date" style={{ width: '100%', boxSizing: 'border-box', backgroundColor: 'rgba(255,255,255,.10)', border: '1px solid rgba(255,255,255,.20)', color: '#fff', borderRadius: 14, padding: '12px 16px', fontSize: 14, outline: 'none' }} />
                  </div>
                ))}
              </div>
              {hasBooking ? (
                <button style={{ width: '100%', backgroundColor: accent, color: '#fff', fontWeight: 900, fontSize: 14, padding: '16px 0', borderRadius: 999, border: 'none', cursor: 'pointer', boxShadow: `0 8px 24px ${ORG_D}60` }}>
                  📅 Cek Ketersediaan & Booking
                </button>
              ) : waNum ? (
                <a href={`https://wa.me/${waNum}?text=${encodeURIComponent(`Halo, saya ingin booking kendaraan di ${nama}.`)}`} target="_blank" rel="noopener noreferrer"
                  style={{ width: '100%', backgroundColor: accent, color: '#fff', fontWeight: 900, fontSize: 14, padding: '16px 0', borderRadius: 999, border: 'none', cursor: 'pointer', boxShadow: `0 8px 24px ${ORG_D}60`, textAlign: 'center', textDecoration: 'none', display: 'block', letterSpacing: '0.02em' }}>
                  🔍 Tanya Ketersediaan via WhatsApp
                </a>
              ) : (
                <button style={{ width: '100%', backgroundColor: accent, color: '#fff', fontWeight: 900, fontSize: 14, padding: '16px 0', borderRadius: 999, border: 'none', cursor: 'pointer', boxShadow: `0 8px 24px ${ORG_D}60` }}>
                  🔍 Cari Kendaraan Tersedia
                </button>
              )}
            </div>
            <p style={{ textAlign: 'center', fontSize: 10, color: '#78716C', fontWeight: 500, marginTop: 12 }}>Konfirmasi dalam 5 menit via WhatsApp</p>
          </div>
        </div>
        {/* Wave bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, backgroundColor: PAGE, clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
      </section>

      {/* Stats */}
      <section style={{ backgroundColor: '#fff', borderTop: `1px solid ${BDR}`, borderBottom: `1px solid ${BDR}`, padding: '24px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, textAlign: 'center' }}>
          {[
            { num: '500+', label: 'Unit Armada' },
            { num: '10rb+', label: 'Pelanggan Puas' },
            { num: '50+', label: 'Kota Layanan' },
            { num: '4.9★', label: 'Rating Google' },
          ].map((s) => (
            <div key={s.label}>
              <p style={{ fontSize: 28, fontWeight: 900, color: STN, letterSpacing: '-0.02em', margin: '0 0 4px' }}>{s.num}</p>
              <p style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fleet */}
      <section id="armada" style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 900, color: accent, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Katalog Kendaraan</p>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: STN, letterSpacing: '-0.02em', margin: '0 0 12px' }}>Pilih Armada Favorit Anda</h2>
          <p style={{ color: MUTED, fontWeight: 500, maxWidth: 480, margin: 0 }}>Semua kendaraan terawat rutin, bersih, dan siap mengantarkan Anda ke mana saja.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {fleet.slice(0, 6).map((v, i) => (
            <div key={i} style={{ backgroundColor: '#fff', border: `1px solid ${BDR}`, borderRadius: 20, padding: 20, display: 'flex', flexDirection: 'column', transition: 'box-shadow .2s' }}>
              <div style={{ width: '100%', aspectRatio: '4/3', backgroundColor: '#FFF7ED', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <span style={{ fontSize: 56 }}>{v.emoji}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 900, color: accent, textTransform: 'uppercase', letterSpacing: '0.08em', backgroundColor: '#FFF7ED', padding: '4px 10px', borderRadius: 999 }}>{v.category}</span>
                <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 10px', borderRadius: 999, backgroundColor: v.available ? '#F0FDF4' : '#FEF2F2', color: v.available ? '#16A34A' : '#DC2626' }}>
                  {v.available ? '✓ Tersedia' : '✗ Habis'}
                </span>
              </div>
              <h3 style={{ fontWeight: 900, color: STN, fontSize: 18, margin: '8px 0 8px', lineHeight: 1.2 }}>{v.name}</h3>
              {v.capacity && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {[v.capacity, v.transmission, v.year].filter(Boolean).map((spec) => (
                    <span key={spec} style={{ fontSize: 10, fontWeight: 700, color: MUTED, backgroundColor: '#F5F5F4', padding: '4px 10px', borderRadius: 999 }}>{spec}</span>
                  ))}
                </div>
              )}
              <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: MUTED }}>Mulai</span>
                  <span style={{ fontSize: 22, fontWeight: 900, color: accent }}>Rp {v.price.toLocaleString('id-ID')}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: MUTED }}>/hari</span>
                </div>
                {!v.available ? (
                  <button disabled style={{ width: '100%', padding: '12px 0', borderRadius: 999, fontSize: 13, fontWeight: 900, border: 'none', cursor: 'default', backgroundColor: '#E7E5E4', color: '#A8A29E' }}>
                    Tidak Tersedia
                  </button>
                ) : hasPayment ? (
                  <button style={{ width: '100%', padding: '12px 0', borderRadius: 999, fontSize: 13, fontWeight: 900, border: 'none', cursor: 'pointer', backgroundColor: accent, color: '#fff', boxShadow: `0 4px 12px ${accent}40` }}>
                    💳 Pesan & Bayar Online
                  </button>
                ) : hasBooking ? (
                  <button style={{ width: '100%', padding: '12px 0', borderRadius: 999, fontSize: 13, fontWeight: 900, border: 'none', cursor: 'pointer', backgroundColor: accent, color: '#fff', boxShadow: `0 4px 12px ${accent}40` }}>
                    📅 Booking Sekarang
                  </button>
                ) : waNum ? (
                  <a href={`https://wa.me/${waNum}?text=${encodeURIComponent(`Halo, saya ingin booking *${v.name}* — Rp ${v.price.toLocaleString('id-ID')}/hari.`)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ display: 'block', width: '100%', textAlign: 'center', padding: '12px 0', borderRadius: 999, fontSize: 13, fontWeight: 900, textDecoration: 'none', boxSizing: 'border-box', backgroundColor: accent, color: '#fff', boxShadow: `0 4px 12px ${accent}40` }}>
                    Hubungi via WhatsApp
                  </a>
                ) : (
                  <button style={{ width: '100%', padding: '12px 0', borderRadius: 999, fontSize: 13, fontWeight: 900, border: 'none', cursor: 'pointer', backgroundColor: accent, color: '#fff', boxShadow: `0 4px 12px ${accent}40` }}>
                    Tanya Ketersediaan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Us */}
      <section style={{ backgroundColor: '#0C0A09', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 900, color: '#FB923C', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Mengapa Kami</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>Bukan Sekadar Rental Biasa</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
            {[
              { emoji: '🔧', title: 'Armada Terawat', desc: 'Setiap kendaraan melalui pemeriksaan teknis menyeluruh sebelum dan sesudah penyewaan.', show: true },
              { emoji: '👨‍✈️', title: 'Driver Profesional', desc: 'Tersedia opsi driver berpengalaman, ramah, dan menguasai rute terbaik di daerah Anda.', show: true },
              { emoji: '📍', title: 'GPS Real-Time', desc: 'Pantau posisi kendaraan Anda secara real-time. Aman dan transparan selama perjalanan.', show: hasTracking },
              { emoji: '🕐', title: 'Support 24/7', desc: 'Tim kami siaga 24 jam. Hubungi kami kapan saja jika ada kendala di perjalanan.', show: true },
            ].filter(r => r.show).map((r) => (
              <div key={r.title} style={{ backgroundColor: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.10)', borderRadius: 20, padding: 28 }}>
                <div style={{ fontSize: 36, marginBottom: 20 }}>{r.emoji}</div>
                <h3 style={{ color: '#fff', fontWeight: 900, fontSize: 17, margin: '0 0 8px', lineHeight: 1.2 }}>{r.title}</h3>
                <p style={{ color: '#78716C', fontSize: 13, fontWeight: 500, lineHeight: 1.6, margin: 0 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="cara-pesan" style={{ backgroundColor: '#FFFBEB', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 900, color: accent, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Mudah & Cepat</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: STN, letterSpacing: '-0.02em', margin: 0 }}>Cara Pesan Hanya 3 Langkah</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 40 }}>
            {[
              { num: '01', emoji: '🔍', title: 'Pilih Kendaraan', desc: 'Pilih kendaraan sesuai kebutuhan dan budget dari katalog lengkap kami.' },
              { num: '02', emoji: '💳', title: 'Bayar & Konfirmasi', desc: 'Lakukan pembayaran DP via transfer atau dompet digital. Konfirmasi otomatis via WhatsApp.' },
              { num: '03', emoji: '🚀', title: 'Jemput & Berangkat', desc: 'Kendaraan diantar ke lokasi Anda tepat waktu. Selamat menikmati perjalanan!' },
            ].map((s) => (
              <div key={s.num} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
                  <div style={{ width: 96, height: 96, backgroundColor: '#fff', border: `4px solid ${ORG_L}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: `0 8px 24px ${accent}20` }}>
                    <span style={{ fontSize: 40 }}>{s.emoji}</span>
                  </div>
                  <div style={{ position: 'absolute', top: -8, right: -8, backgroundColor: accent, color: '#fff', fontSize: 10, fontWeight: 900, padding: '4px 10px', borderRadius: 999 }}>{s.num}</div>
                </div>
                <h3 style={{ fontWeight: 900, color: STN, fontSize: 19, margin: '0 0 8px' }}>{s.title}</h3>
                <p style={{ color: MUTED, fontSize: 14, fontWeight: 500, lineHeight: 1.6, margin: 0, maxWidth: 240, marginLeft: 'auto', marginRight: 'auto' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ backgroundColor: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 900, color: accent, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>Testimoni</p>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: STN, letterSpacing: '-0.02em', margin: 0 }}>Mereka Sudah Merasakan Manfaatnya</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {[
              { name: 'Budi Santoso', city: 'Jakarta', role: 'Pengusaha', text: 'Avanza-nya bersih dan AC dingin. Driver tepat waktu, sangat membantu selama perjalanan bisnis ke Bandung.' },
              { name: 'Siti Rahayu', city: 'Surabaya', role: 'Content Creator', text: 'Booking mudah, respon cepat. NMAX yang kami sewa dalam kondisi prima. Pasti balik lagi!' },
              { name: 'Ahmad Fauzi', city: 'Yogyakarta', role: 'Dokter', text: 'Sewa Innova untuk family trip 3 hari. Harga sangat terjangkau dengan kualitas kendaraan yang luar biasa.' },
            ].map((t) => (
              <div key={t.name} style={{ backgroundColor: PAGE, border: `1px solid ${BDR}`, borderRadius: 20, padding: 28 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {Array.from({ length: 5 }).map((_, i) => <span key={i} style={{ color: '#F59E0B', fontSize: 18 }}>★</span>)}
                </div>
                <p style={{ color: '#44403C', fontSize: 14, fontWeight: 500, lineHeight: 1.65, fontStyle: 'italic', marginBottom: 20 }}>&ldquo;{t.text}&rdquo;</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, backgroundColor: `${accent}20`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, color: accent }}>{t.name[0]}</div>
                  <div>
                    <p style={{ fontWeight: 900, color: STN, fontSize: 14, margin: '0 0 2px' }}>{t.name}</p>
                    <p style={{ fontSize: 11, color: MUTED, fontWeight: 500, margin: 0 }}>{t.role} · {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: `linear-gradient(135deg, ${accent}, #D97706)`, padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 10% 50%, rgba(255,255,255,.15) 0%, transparent 40%), radial-gradient(circle at 90% 50%, rgba(255,255,255,.15) 0%, transparent 40%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 56, marginBottom: 24 }}>🚗</div>
          <h2 style={{ fontSize: 44, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 16px', lineHeight: 1 }}>Siap Melakukan Perjalanan?</h2>
          <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 17, fontWeight: 500, marginBottom: 36, lineHeight: 1.6 }}>
            Pesan sekarang dan dapatkan konfirmasi dalam 5 menit. Lebih dari 10.000 pelanggan telah mempercayai kami.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            {hasPayment ? (
              <button style={{ backgroundColor: '#fff', color: accent, fontWeight: 900, padding: '16px 36px', borderRadius: 999, fontSize: 14, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,.15)' }}>
                💳 Pesan & Bayar Online
              </button>
            ) : hasBooking ? (
              <button style={{ backgroundColor: '#fff', color: accent, fontWeight: 900, padding: '16px 36px', borderRadius: 999, fontSize: 14, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,.15)' }}>
                📅 Booking Sekarang
              </button>
            ) : waNum ? (
              <a href={`https://wa.me/${waNum}?text=${encodeURIComponent(`Halo ${nama}, saya ingin booking kendaraan.`)}`} target="_blank" rel="noopener noreferrer"
                style={{ backgroundColor: '#fff', color: accent, fontWeight: 900, padding: '16px 36px', borderRadius: 999, fontSize: 14, textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,.15)' }}>
                Hubungi Kami
              </a>
            ) : null}
            {(hasWA && waNum) && (
              <a href={`https://wa.me/${waNum}`} target="_blank" rel="noopener noreferrer"
                style={{ border: '2px solid rgba(255,255,255,.5)', color: '#fff', fontWeight: 700, padding: '16px 36px', borderRadius: 999, fontSize: 14, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                💬 Chat WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontak" style={{ backgroundColor: '#0C0A09', color: '#78716C', padding: '56px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, backgroundColor: accent, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 11 }}>{nama.slice(0, 2).toUpperCase()}</div>
                <p style={{ fontWeight: 900, color: '#fff', fontSize: 14, margin: 0 }}>{nama}</p>
              </div>
              <p style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.6, margin: 0 }}>Solusi rental kendaraan premium untuk perjalanan bisnis maupun wisata di seluruh Indonesia.</p>
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 900, color: '#57534E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Layanan</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {['Rental Mobil', 'Rental Motor', 'Paket Wisata', 'Antar Jemput Bandara', 'Rental Minibus'].map((item) => (
                  <li key={item} style={{ marginBottom: 10 }}>
                    <a href="#" style={{ fontSize: 13, fontWeight: 500, color: '#78716C', textDecoration: 'none' }}>{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 900, color: '#57534E', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Kontak</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13, fontWeight: 500, lineHeight: 2 }}>
                {telepon && <li>📞 {telepon}</li>}
                {email && <li>📧 {email}</li>}
                <li>📍 {alamat}</li>
                {waNum && (
                  <li style={{ marginTop: 12 }}>
                    <a href={`https://wa.me/${waNum}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: '#16A34A', color: '#fff', fontSize: 12, fontWeight: 700, padding: '8px 16px', borderRadius: 999, textDecoration: 'none' }}>
                      💬 WhatsApp Kami
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #292524', paddingTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, fontWeight: 500 }}>
            <p style={{ margin: 0 }}>© 2024 {nama}. Semua hak dilindungi.</p>
            <p style={{ margin: 0, color: '#44403C' }}>Dibuat dengan <a href="https://japanarena.com" style={{ color: '#FB923C', textDecoration: 'none', fontWeight: 700 }}>Japan Arena Website Builder</a></p>
          </div>
        </div>
      </footer>

      {hasWA && <FloatingWA wa={waNum} />}
    </div>
  )
}
