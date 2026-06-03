'use client'

// ============================================================
// /token-lab — preview POC token-pack system.
// Satu TokenDrivenRenderer, tukar pack → tampilan berubah total.
// Termasuk demo override warna brand klien (primary).
// ============================================================
import { useState } from 'react'
import { PACKS, resolveTokenPack } from '@/lib/design-tokens/packs'
import TokenDrivenRenderer, { type SiteContent } from '@/app/components/themes/universal/TokenDrivenRenderer'

const DEMO: SiteContent = {
  nama: 'Nusantara Drive',
  hero: {
    eyebrow: 'Rental Mobil & Motor',
    title: 'Perjalanan Lebih Nyaman, Tanpa Ribet.',
    subtitle: 'Armada lengkap, booking online, antar-jemput. Pesan sekarang, kami siapkan kendaraannya.',
    ctaText: 'Booking Sekarang',
    ctaHref: '#',
  },
  features: [
    { title: 'Armada Terawat', desc: 'Semua kendaraan dicek rutin dan bersih sebelum sampai ke tangan Anda.' },
    { title: 'Booking Online', desc: 'Pilih kendaraan, tentukan tanggal, konfirmasi otomatis lewat WhatsApp.' },
    { title: 'Antar-Jemput', desc: 'Kami antar ke lokasi Anda — bandara, hotel, atau rumah, tanpa biaya tersembunyi.' },
  ],
  about: {
    title: 'Tentang Kami',
    body: 'Sejak 2018 melayani ribuan perjalanan di seluruh Indonesia. Fokus kami sederhana: kendaraan siap pakai, harga jelas, dan layanan yang bikin Anda tenang.',
  },
  cta: {
    title: 'Siap Jalan Hari Ini?',
    subtitle: 'Pesan sekarang, kendaraan siap dalam hitungan jam.',
    ctaText: 'Booking via WhatsApp',
    ctaHref: '#',
  },
  contact: { wa: '6281296917963', email: 'halo@nusantaradrive.com', alamat: 'Jakarta, Indonesia' },
}

const PACK_IDS = Object.keys(PACKS)

export default function TokenLabPage() {
  const [packId, setPackId] = useState(PACK_IDS[0])
  const [brand, setBrand] = useState('')

  // Resolve langsung dari pack id; brand override mensimulasikan primary klien.
  const pack = brand
    ? { ...PACKS[packId], color: { ...PACKS[packId].color, primary: brand } }
    : PACKS[packId]
  // demonstrasi resolver lengkap (theme:variant → pack + brand):
  const resolvedNote = resolveTokenPack('rental', 'luxury', brand || undefined).id

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Control bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: '#0B0B0C', color: '#fff', padding: '12px 20px', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <strong style={{ fontSize: 13, letterSpacing: '.04em' }}>TOKEN LAB</strong>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {PACK_IDS.map((id) => (
            <button
              key={id}
              onClick={() => setPackId(id)}
              style={{
                padding: '6px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                border: '1px solid rgba(255,255,255,.2)',
                background: packId === id ? '#fff' : 'transparent',
                color: packId === id ? '#0B0B0C' : '#fff',
              }}
            >
              {PACKS[id].label}
            </button>
          ))}
        </div>
        <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
          Brand color
          <input type="color" value={brand || PACKS[packId].color.primary} onChange={(e) => setBrand(e.target.value)} style={{ width: 32, height: 24, border: 'none', background: 'none', cursor: 'pointer' }} />
          {brand && <button onClick={() => setBrand('')} style={{ fontSize: 11, color: '#fca5a5', background: 'none', border: 'none', cursor: 'pointer' }}>reset</button>}
        </label>
        <span style={{ fontSize: 11, opacity: .5 }}>resolve(rental,luxury)→{resolvedNote}</span>
      </div>

      <TokenDrivenRenderer content={DEMO} pack={pack} />
    </div>
  )
}
