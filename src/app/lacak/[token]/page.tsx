import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { rateLimit } from '@/lib/rate-limit'
import { formatMoney } from '@/lib/format-money'
import type { MetodeBayar } from '@/lib/portal/types'

// ============================================================
// Halaman lacak pesanan Portal (Bakso Fase 1, BAKSO_PORTAL_CONTRACT.md §5).
// EXACT-token only — TANPA cabang prefix/range 8-char (api/track:52-62 dilarang
// di-port → token enumerable). Service-role baca order_projection (tanpa anon §8),
// whitelist field aman (no email/telp/HPP/alamat). Rate-limit 60/min/IP.
// ============================================================
export const dynamic = 'force-dynamic'

// Whitelist §5 (+ pembeli_nama: satu-satunya field pelanggan di proyeksi, token-gated).
const SELECT_FIELDS =
  'order_code, tenant_slug, pembeli_nama, status_bayar, status_fulfillment, metode_bayar, ringkasan_items, total_online, total_courier, total_gross, biaya_kurir, resi, tgl_kirim, jam_kirim, created_at'

type RingkasanItem = { nama: string; qty: number; harga: number }
type Projection = {
  order_code: string
  tenant_slug: string
  pembeli_nama: string | null
  status_bayar: string
  status_fulfillment: string
  metode_bayar: MetodeBayar
  ringkasan_items: RingkasanItem[] | null
  total_online: number | string | null
  total_courier: number | string | null
  total_gross: number | string | null
  biaya_kurir: number | string | null
  resi: string | null
  tgl_kirim: string | null
  jam_kirim: string | null
  created_at: string | null
}

const STATUS_BAYAR: Record<string, string> = {
  belum_bayar: 'Belum bayar', menunggu_verifikasi: 'Menunggu verifikasi', lunas: 'Lunas',
  cod: 'Bayar di kurir (COD)', gagal: 'Gagal', refund: 'Refund',
}
const STATUS_FULFILLMENT: Record<string, string> = {
  menunggu: 'Menunggu', dikonfirmasi: 'Dikonfirmasi', diproduksi: 'Diproduksi', dikemas: 'Dikemas',
  dikirim: 'Dikirim', selesai: 'Selesai', batal: 'Dibatalkan',
}
const METODE: Record<MetodeBayar, string> = {
  transfer_jp: 'Transfer Bank (銀行振込)', transfer_id: 'Transfer Bank Indonesia', paypay: 'PayPay',
  cod_full: '代引き (COD penuh)', cod_ongkir: '着払い (ongkir di kurir)',
}
// Langkah fulfillment utk timeline.
const STEPS = ['menunggu', 'dikonfirmasi', 'diproduksi', 'dikemas', 'dikirim', 'selesai'] as const

async function getProjection(token: string) {
  // EXACT match — satu query, tanpa normalisasi displayId/prefix/range.
  const { data } = await supabaseAdmin
    .from('order_projection')
    .select(SELECT_FIELDS)
    .eq('tracking_token', token)
    .maybeSingle()
  return (data as unknown as Projection | null) ?? null
}

async function getTenantMeta(slug: string) {
  const { data } = await supabaseAdmin
    .from('landing_pages')
    .select('nama_website, konfigurasi')
    .eq('slug', slug)
    .maybeSingle()
  const konfig = (data?.konfigurasi ?? {}) as { localeConfig?: { locale?: string; currency?: string } }
  return {
    nama: (data?.nama_website as string) || 'Toko',
    locale: konfig.localeConfig?.locale || 'id-ID',
    currency: konfig.localeConfig?.currency || 'IDR',
  }
}

export default async function LacakPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0].trim() || h.get('x-real-ip') || 'unknown'
  const rl = rateLimit(`lacak:${ip}`, 60, 60_000)
  if (!rl.allowed) {
    return <Shell><p style={msg}>Terlalu banyak permintaan. Coba lagi sebentar.</p></Shell>
  }

  const order = (token && /^[a-f0-9]{32}$/i.test(token)) ? await getProjection(token) : null
  if (!order) {
    return (
      <Shell>
        <h1 style={h1}>Pesanan tidak ditemukan</h1>
        <p style={msg}>Tautan lacak tidak valid atau sudah kedaluwarsa. Periksa kembali tautan dari WhatsApp Anda.</p>
      </Shell>
    )
  }

  const meta = await getTenantMeta(order.tenant_slug as string)
  const fmt = (n: number) => formatMoney(Number(n) || 0, meta.locale, meta.currency)
  const items = (order.ringkasan_items as RingkasanItem[] | null) ?? []
  const metode = order.metode_bayar as MetodeBayar
  const sf = order.status_fulfillment as string
  const stepIdx = STEPS.indexOf(sf as (typeof STEPS)[number])
  const cancelled = sf === 'batal'

  return (
    <Shell>
      <p style={{ ...eyebrow }}>{meta.nama}</p>
      <h1 style={h1}>Pesanan {String(order.order_code)}</h1>
      {order.pembeli_nama ? <p style={msg}>Halo {String(order.pembeli_nama)} 👋 Berikut status pesananmu.</p> : null}

      <div style={badges}>
        <span style={badge('#fff3e0', '#9A3322')}>Bayar: {STATUS_BAYAR[order.status_bayar as string] ?? String(order.status_bayar)}</span>
        <span style={badge('#eef4ff', '#1d4ed8')}>Status: {STATUS_FULFILLMENT[sf] ?? sf}</span>
        <span style={badge('#f3f0ea', '#4A3326')}>{METODE[metode] ?? metode}</span>
      </div>

      {/* Timeline fulfillment */}
      {!cancelled && (
        <ol style={timeline}>
          {STEPS.slice(0, 5).map((s, i) => {
            const reached = stepIdx >= i || sf === 'selesai'
            return (
              <li key={s} style={tlItem}>
                <span style={tlDot(reached)} aria-hidden />
                <span style={{ fontSize: 13, fontWeight: reached ? 700 : 400, color: reached ? '#2B1A12' : '#9b8a7d' }}>
                  {STATUS_FULFILLMENT[s]}
                </span>
              </li>
            )
          })}
        </ol>
      )}
      {cancelled && <p style={{ ...msg, color: '#9A3322', fontWeight: 600 }}>Pesanan ini dibatalkan.</p>}

      {/* Ringkasan item */}
      <div style={card}>
        <h2 style={h2}>Rincian</h2>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {items.map((it, i) => (
            <li key={i} style={rowLine}>
              <span>{it.nama} ×{it.qty}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{fmt(it.harga * it.qty)}</span>
            </li>
          ))}
        </ul>
        <hr style={hr} />
        <div style={rowLine}><span>Total barang + ongkir</span><strong>{fmt(Number(order.total_gross))}</strong></div>
        {Number(order.total_online) > 0 && <div style={rowLine}><span>Dibayar online</span><span>{fmt(Number(order.total_online))}</span></div>}
        {Number(order.total_courier) > 0 && <div style={rowLine}><span>Dibayar ke kurir</span><span>{fmt(Number(order.total_courier))}</span></div>}
      </div>

      {(order.resi || order.tgl_kirim || order.jam_kirim) && (
        <div style={card}>
          <h2 style={h2}>Pengiriman</h2>
          {order.tgl_kirim ? <div style={rowLine}><span>Tanggal kirim</span><span>{String(order.tgl_kirim)}</span></div> : null}
          {order.jam_kirim ? <div style={rowLine}><span>Jam kirim</span><span>{String(order.jam_kirim)}</span></div> : null}
          {order.resi ? <div style={rowLine}><span>No. resi</span><strong>{String(order.resi)}</strong></div> : null}
        </div>
      )}
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ minHeight: '100dvh', background: '#FBF3E4', padding: '2.5rem 1.2rem', fontFamily: 'system-ui,sans-serif', color: '#2B1A12' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>{children}</div>
    </main>
  )
}

// inline styles (server component, halaman ringan tanpa CSS framework)
const eyebrow: React.CSSProperties = { fontSize: 13, fontWeight: 700, color: '#9A3322', margin: '0 0 .3rem' }
const h1: React.CSSProperties = { fontSize: '1.7rem', fontWeight: 800, margin: '0 0 .5rem', lineHeight: 1.2 }
const h2: React.CSSProperties = { fontSize: '1rem', fontWeight: 700, margin: '0 0 .7rem' }
const msg: React.CSSProperties = { fontSize: 14, color: '#6E5240', lineHeight: 1.6, margin: '0 0 1rem' }
const badges: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', gap: '.5rem', margin: '1.2rem 0' }
const timeline: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', gap: '.3rem', listStyle: 'none', margin: '1.4rem 0', padding: 0 }
const tlItem: React.CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.4rem', textAlign: 'center' }
const card: React.CSSProperties = { background: '#FFFBF2', border: '1px solid rgba(43,26,18,.1)', borderRadius: 16, padding: '1.1rem 1.2rem', margin: '0 0 1rem' }
const rowLine: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', gap: '1rem', fontSize: 14, padding: '.25rem 0' }
const hr: React.CSSProperties = { border: 0, borderTop: '1px dashed rgba(43,26,18,.2)', margin: '.6rem 0' }
function badge(bg: string, fg: string): React.CSSProperties {
  return { background: bg, color: fg, fontSize: 12, fontWeight: 700, padding: '.35rem .8rem', borderRadius: 999 }
}
function tlDot(on: boolean): React.CSSProperties {
  return { width: 14, height: 14, borderRadius: '50%', background: on ? '#C0432E' : '#e4d8c4', border: on ? 'none' : '1px solid rgba(43,26,18,.2)' }
}
