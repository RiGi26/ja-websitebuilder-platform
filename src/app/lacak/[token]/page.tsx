import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { rateLimit } from '@/lib/rate-limit'
import { formatMoney } from '@/lib/format-money'
import type { MetodeBayar } from '@/lib/portal/types'
import { STATUS_BAYAR, STATUS_FULFILLMENT, METODE, STEPS, VISIBLE_STEPS, isPaidStatus } from '@/lib/portal/labels'
import AutoRefresh from './AutoRefresh'

// ============================================================
// Halaman lacak pesanan Portal (Bakso Fase 1, BAKSO_PORTAL_CONTRACT.md §5).
// EXACT-token only — TANPA cabang prefix/range 8-char (api/track:52-62 dilarang
// di-port → token enumerable). Service-role baca order_projection (tanpa anon §8),
// whitelist field aman (no email/telp/HPP/alamat). Rate-limit 60/min/IP.
// ============================================================
export const dynamic = 'force-dynamic'

// Whitelist §5 (+ pembeli_nama: satu-satunya field pelanggan di proyeksi, token-gated).
// instruksi_bayar.rekening = rekening tujuan (publik, memang utk ditampilkan ke pembeli).
const SELECT_FIELDS =
  'order_code, tenant_slug, pembeli_nama, status_bayar, status_fulfillment, metode_bayar, ringkasan_items, subtotal, ongkir, total_online, total_courier, total_gross, biaya_kurir, instruksi_bayar, ongkir_status, resi, tgl_kirim, jam_kirim, created_at'

type RingkasanItem = { nama: string; qty: number; harga: number }
type InstruksiBayar = { metode?: string; nominal?: number | string | null; rekening?: string | null; catatan?: string | null }
type Projection = {
  order_code: string
  tenant_slug: string
  pembeli_nama: string | null
  status_bayar: string
  status_fulfillment: string
  metode_bayar: MetodeBayar
  ringkasan_items: RingkasanItem[] | null
  subtotal: number | string | null
  ongkir: number | string | null
  total_online: number | string | null
  total_courier: number | string | null
  total_gross: number | string | null
  biaya_kurir: number | string | null
  instruksi_bayar: InstruksiBayar | null
  ongkir_status: string | null
  resi: string | null
  tgl_kirim: string | null
  jam_kirim: string | null
  created_at: string | null
}

// Label maps (STATUS_BAYAR/STATUS_FULFILLMENT/METODE/STEPS) di @/lib/portal/labels
// — dipakai bersama engine invoice agar istilah konsisten lintas tracking ↔ faktur.

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
  const konfig = (data?.konfigurasi ?? {}) as {
    localeConfig?: { locale?: string; currency?: string }
    preorder?: { wa_admin?: string }
  }
  return {
    nama: (data?.nama_website as string) || 'Toko',
    locale: konfig.localeConfig?.locale || 'id-ID',
    currency: konfig.localeConfig?.currency || 'IDR',
    waAdmin: waDigits(konfig.preorder?.wa_admin),
  }
}

// Normalisasi nomor WA tenant ke format internasional utk tautan wa.me (0… → 62…).
function waDigits(n?: string | null): string | null {
  if (!n) return null
  let d = String(n).replace(/\D/g, '')
  if (!d) return null
  if (d.startsWith('0')) d = '62' + d.slice(1)
  return d
}

/** Bangun tautan wa.me ke nomor admin tenant + teks pesan terisi (chat langsung,
 *  pembeli tak perlu ketik nomor manual). null bila tenant tak set nomor WA. */
function waLink(waAdmin: string | null, text: string): string | null {
  if (!waAdmin) return null
  return `https://wa.me/${waAdmin}?text=${encodeURIComponent(text)}`
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

  // Auto-refresh status sampai pesanan mencapai status terminal (selesai/batal).
  const terminal = cancelled || sf === 'selesai'

  // Tautan WA langsung ke admin tenant (pembeli tak perlu ketik nomor manual).
  const waProofUrl = waLink(
    meta.waAdmin,
    `Halo ${meta.nama}, saya sudah transfer untuk pesanan ${order.order_code} (Total ${fmt(Number(order.total_gross))}). Berikut bukti transfernya 🙏`,
  )
  const waAskUrl = waLink(meta.waAdmin, `Halo ${meta.nama}, saya mau tanya soal pesanan ${order.order_code}.`)

  return (
    <Shell>
      <AutoRefresh active={!terminal} />
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
          {VISIBLE_STEPS.map((s) => {
            const reached = stepIdx >= STEPS.indexOf(s) || sf === 'selesai'
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
        {order.ongkir_status === 'pending' ? (
          // ID — ongkir belum dihitung admin: tampilkan subtotal, JANGAN klaim total final.
          <>
            <div style={rowLine}><span>Subtotal barang</span><strong>{fmt(Number(order.subtotal ?? order.total_gross))}</strong></div>
            <div style={rowLine}><span>Ongkir</span><span style={{ color: '#9A6A22' }}>dihitung admin</span></div>
          </>
        ) : order.ongkir_status === 'set' ? (
          // ID — ongkir sudah final.
          <>
            <div style={rowLine}><span>Subtotal barang</span><span>{fmt(Number(order.subtotal ?? (Number(order.total_gross) - Number(order.ongkir))))}</span></div>
            {Number(order.ongkir) > 0 && <div style={rowLine}><span>Ongkir</span><span>{fmt(Number(order.ongkir))}</span></div>}
            <div style={rowLine}><span>Total</span><strong>{fmt(Number(order.total_gross))}</strong></div>
            {Number(order.total_online) > 0 && <div style={rowLine}><span>Dibayar online</span><span>{fmt(Number(order.total_online))}</span></div>}
            {Number(order.total_courier) > 0 && <div style={rowLine}><span>Dibayar ke kurir</span><span>{fmt(Number(order.total_courier))}</span></div>}
          </>
        ) : (
          // JP / legacy ('n/a') — perilaku lama, tak berubah.
          <>
            <div style={rowLine}><span>Total barang + ongkir</span><strong>{fmt(Number(order.total_gross))}</strong></div>
            {Number(order.total_online) > 0 && <div style={rowLine}><span>Dibayar online</span><span>{fmt(Number(order.total_online))}</span></div>}
            {Number(order.total_courier) > 0 && <div style={rowLine}><span>Dibayar ke kurir</span><span>{fmt(Number(order.total_courier))}</span></div>}
          </>
        )}
      </div>

      {/* Status ongkir / instruksi bayar (model "operator finalisasi ongkir", ID). */}
      {order.ongkir_status === 'pending' && !isPaidStatus(order.status_bayar) && (
        <div style={{ ...card, background: '#FFF7E6', border: '1px solid #F4C892' }}>
          <h2 style={h2}>⏳ Menunggu ongkir</h2>
          <p style={{ ...msg, margin: 0 }}>
            Admin sedang menghitung ongkir pengiriman. <strong>Total final + cara pembayaran</strong> akan muncul di sini
            dan dikirim via WhatsApp. Mohon <strong>jangan transfer dulu</strong> sampai total final keluar. 🙏
          </p>
          {waAskUrl && (
            <a href={waAskUrl} target="_blank" rel="noopener noreferrer" style={{ ...waBtn, marginTop: '.9rem' }}>
              <WaIcon /> Chat WhatsApp
            </a>
          )}
        </div>
      )}
      {order.ongkir_status === 'set' && !isPaidStatus(order.status_bayar) && order.metode_bayar !== 'cod_full' && order.instruksi_bayar?.rekening && (
        <div style={{ ...card, background: '#EAF4FF', border: '1px solid #9DC3F0' }}>
          <h2 style={h2}>💳 Cara Pembayaran</h2>
          <p style={{ ...msg, marginBottom: '.4rem' }}>
            Silakan transfer <strong>{fmt(Number(order.instruksi_bayar.nominal ?? order.total_online))}</strong> ke:
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#1d4ed8', margin: '0 0 .6rem', wordBreak: 'break-word' }}>
            {String(order.instruksi_bayar.rekening)}
          </p>
          <p style={{ ...msg, marginBottom: waProofUrl ? '.9rem' : 0 }}>Sudah transfer? Kirim bukti via WhatsApp untuk verifikasi. Terima kasih! 🙏</p>
          {waProofUrl && (
            <a href={waProofUrl} target="_blank" rel="noopener noreferrer" style={waBtn}>
              <WaIcon /> Kirim bukti via WhatsApp
            </a>
          )}
        </div>
      )}
      {/* Bayar di Tempat (COD lokal): ongkir 0, total final → bayar tunai saat terima. */}
      {order.ongkir_status === 'set' && !isPaidStatus(order.status_bayar) && order.metode_bayar === 'cod_full' && (
        <div style={{ ...card, background: '#EAF7EE', border: '1px solid #A6D9B8' }}>
          <h2 style={h2}>💵 Bayar di Tempat (COD)</h2>
          <p style={{ ...msg, margin: 0 }}>
            Bayar tunai <strong>{fmt(Number(order.total_gross))}</strong> saat pesanan kamu diterima. Terima kasih! 🙏
          </p>
        </div>
      )}

      {/* Invoice PDF — hanya saat pembayaran sudah terverifikasi (lunas/COD). */}
      {isPaidStatus(order.status_bayar) && (
        <a href={`/invoice/${token}`} target="_blank" rel="noopener noreferrer" style={invoiceBtn}>
          📄 Unduh Invoice (PDF)
        </a>
      )}

      {(order.resi || order.jam_kirim) && (
        <div style={card}>
          <h2 style={h2}>Pengiriman</h2>
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

// Ikon WhatsApp inline (hindari dependensi; halaman lacak ringan).
function WaIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01c-1.52 0-3.01-.41-4.31-1.18l-.31-.18-3.2.84.85-3.12-.2-.32a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43-.14 0-.31-.01-.48-.01a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z"/>
    </svg>
  )
}

const waBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
  background: '#25D366', color: '#fff', fontSize: 14, fontWeight: 700,
  textDecoration: 'none', padding: '.8rem 1rem', borderRadius: 12,
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
const invoiceBtn: React.CSSProperties = {
  display: 'block', textAlign: 'center', background: '#2B1A12', color: '#FFFBF2',
  fontSize: 14, fontWeight: 700, textDecoration: 'none', padding: '.85rem 1rem',
  borderRadius: 12, margin: '0 0 1rem',
}
function tlDot(on: boolean): React.CSSProperties {
  return { width: 14, height: 14, borderRadius: '50%', background: on ? '#C0432E' : '#e4d8c4', border: on ? 'none' : '1px solid rgba(43,26,18,.2)' }
}
