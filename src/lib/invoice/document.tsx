// Layout PDF faktur via @react-pdf/renderer (pure-JS, jalan di Node runtime Vercel —
// tanpa headless Chrome). Hanya bergantung pada InvoiceData. Logo dikirim sebagai
// data-URL (di-prefetch di generate.ts) agar render tak gagal kalau URL logo mati.
//
// CATATAN react-pdf + Next 16: Next merender elemen pakai React 19 (elemen
// `react.transitional.element`). App memakai react@19 (lihat package.json) supaya
// reconciler react-pdf yang dipilih = React-19 (reconciler-31/33) dan menerima elemen
// itu — kalau react@18, reconciler-23 menolak → "Minified React error #31". Detail di
// next.config (serverExternalPackages) + package.json.
//
// FONT JEPANG (wajib): font bawaan react-pdf (Helvetica) TAK punya glyph CJK, jadi
// tanggal `年月日`, label metode (`銀行振込`/`代引き`/`着払い`), & wave-dash `〜` di
// jam_kirim tampil sebagai sampah. Kita daftarkan Noto Sans JP (Latin + Kana + Kanji)
// dari public/fonts. File font ikut ter-bundle ke fungsi /invoice via
// `outputFileTracingIncludes` di next.config.mjs — tanpa itu ENOENT di Vercel.

import fs from 'node:fs'
import path from 'node:path'
import { Document, Page, View, Text, Image, StyleSheet, Font } from '@react-pdf/renderer'
import { formatMoney } from '@/lib/format-money'
import type { InvoiceData } from './types'

// Daftarkan font sekali saat module load (idempoten — register ulang menimpa).
const FONT = 'NotoSansJP'
;(() => {
  try {
    const dir = path.join(process.cwd(), 'public', 'fonts')
    Font.register({
      family: FONT,
      fonts: [
        { src: path.join(dir, 'NotoSansJP-Regular.otf'), fontWeight: 'normal' },
        { src: path.join(dir, 'NotoSansJP-Bold.otf'), fontWeight: 'bold' },
      ],
    })
    // Hindari pemenggalan kata Latin yang aneh di kolom sempit.
    Font.registerHyphenationCallback((word) => [word])
  } catch (e) {
    console.error('[invoice] font register gagal:', (e as Error)?.message)
  }
})()

const INK = '#2B1A12'
const MUTED = '#6E5240'
const LINE = '#E7DBC9'
const CREAM = '#FFFBF2'
const ON_BAND = '#FFFFFF'
const ON_BAND_SOFT = 'rgba(255,255,255,0.82)'
// Oranye hangat Bakso sebagai fallback bila tenant tak set warna brand.
const DEFAULT_ACCENT = '#E2552A'

function accentOf(d: InvoiceData): string {
  const p = d.seller.primary
  return p && /^#[0-9a-fA-F]{6}$/.test(p) ? p : DEFAULT_ACCENT
}

// Turunkan tint transparan dari warna accent (mengikuti brand tenant apa pun).
function tint(hex: string, alpha: number): string {
  const m = /^#([0-9a-fA-F]{6})$/.exec(hex)
  if (!m) return `rgba(226,85,42,${alpha})`
  const n = parseInt(m[1], 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

function fmtTanggal(iso: string | null, locale: string): string {
  if (!iso) return '-'
  const dt = new Date(iso)
  if (isNaN(dt.getTime())) return '-'
  try {
    return dt.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return dt.toISOString().slice(0, 10)
  }
}

const styles = StyleSheet.create({
  page: { paddingTop: 36, paddingBottom: 52, paddingHorizontal: 38, fontSize: 10, color: INK, fontFamily: FONT },

  // Header band ber-brand
  band: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 14, paddingVertical: 20, paddingHorizontal: 22 },
  bandLeft: { flexDirection: 'row', alignItems: 'center', maxWidth: 320 },
  logoChip: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 5, marginRight: 12 },
  logo: { width: 60, maxHeight: 40, objectFit: 'contain' },
  sellerName: { fontSize: 17, fontWeight: 'bold', color: ON_BAND },
  sellerMeta: { fontSize: 8.5, color: ON_BAND_SOFT, marginTop: 3, lineHeight: 1.45 },
  bandRight: { flexDirection: 'column', alignItems: 'flex-end' },
  title: { fontSize: 22, fontWeight: 'bold', letterSpacing: 2, color: ON_BAND },
  bandMeta: { fontSize: 9, color: ON_BAND_SOFT, marginTop: 4 },
  bandMetaStrong: { color: ON_BAND, fontWeight: 'bold' },

  // Baris bill-to + status
  subRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 22 },
  label: { fontSize: 8, color: MUTED, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  buyer: { fontSize: 13, fontWeight: 'bold' },
  statusCol: { alignItems: 'flex-end' },
  pill: { paddingVertical: 4, paddingHorizontal: 11, borderRadius: 11, color: ON_BAND, fontSize: 9, fontWeight: 'bold' },

  // Tabel
  table: { marginTop: 20, borderRadius: 10, borderWidth: 1, borderColor: LINE, overflow: 'hidden' },
  tHead: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 12 },
  tRow: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 12, borderTopWidth: 1, borderTopColor: LINE },
  cItem: { flex: 1, paddingRight: 8 },
  cQty: { width: 38, textAlign: 'right' },
  cHarga: { width: 84, textAlign: 'right' },
  cSub: { width: 92, textAlign: 'right' },
  thText: { fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  num: { fontSize: 10 },

  // Totals
  totalsWrap: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 14 },
  totals: { width: 248 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  grandBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
  grandLabel: { fontSize: 11, fontWeight: 'bold' },
  grandVal: { fontSize: 15, fontWeight: 'bold' },
  muted: { color: MUTED },

  // Panel pembayaran + pengiriman
  panel: { marginTop: 18, padding: 14, backgroundColor: CREAM, borderWidth: 1, borderColor: LINE, borderRadius: 10 },
  panelTitle: { fontSize: 8, color: MUTED, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  panelRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  strong: { fontWeight: 'bold', color: INK },

  footer: { position: 'absolute', bottom: 26, left: 38, right: 38, textAlign: 'center', fontSize: 8, color: MUTED, borderTopWidth: 1, borderTopColor: LINE, paddingTop: 8 },
})

export function InvoiceDocument({ data, logoDataUrl }: { data: InvoiceData; logoDataUrl?: string | null }) {
  const accent = accentOf(data)
  const fmt = (n: number) => formatMoney(n, data.locale, data.currency)
  const hasDelivery = !!(data.tglKirim || data.jamKirim || data.resi)
  const contact = [data.seller.wa, data.seller.email].filter(Boolean).join('  ·  ')

  return (
    <Document title={`Faktur ${data.orderCode}`} author={data.seller.nama}>
      <Page size="A4" style={styles.page}>
        {/* Header band */}
        <View style={[styles.band, { backgroundColor: accent }]}>
          <View style={styles.bandLeft}>
            {logoDataUrl ? (
              <View style={styles.logoChip}>
                <Image src={logoDataUrl} style={styles.logo} />
              </View>
            ) : null}
            <View>
              <Text style={styles.sellerName}>{data.seller.nama}</Text>
              {data.seller.alamat ? <Text style={styles.sellerMeta}>{data.seller.alamat}</Text> : null}
              {contact ? <Text style={styles.sellerMeta}>{contact}</Text> : null}
            </View>
          </View>
          <View style={styles.bandRight}>
            <Text style={styles.title}>FAKTUR</Text>
            <Text style={styles.bandMeta}>No. <Text style={styles.bandMetaStrong}>{data.orderCode}</Text></Text>
            <Text style={styles.bandMeta}>{fmtTanggal(data.tanggal, data.locale)}</Text>
          </View>
        </View>

        {/* Ditagihkan kepada + status */}
        <View style={styles.subRow}>
          <View>
            <Text style={styles.label}>Ditagihkan kepada</Text>
            <Text style={styles.buyer}>{data.buyerNama || 'Pelanggan'}</Text>
          </View>
          <View style={styles.statusCol}>
            <Text style={styles.label}>Status pembayaran</Text>
            <Text style={[styles.pill, { backgroundColor: accent }]}>{data.statusBayarLabel}</Text>
          </View>
        </View>

        {/* Tabel item */}
        <View style={styles.table}>
          <View style={[styles.tHead, { backgroundColor: tint(accent, 0.1) }]}>
            <Text style={[styles.cItem, styles.thText, { color: accent }]}>Item</Text>
            <Text style={[styles.cQty, styles.thText, { color: accent }]}>Qty</Text>
            <Text style={[styles.cHarga, styles.thText, { color: accent }]}>Harga</Text>
            <Text style={[styles.cSub, styles.thText, { color: accent }]}>Subtotal</Text>
          </View>
          {data.items.length === 0 ? (
            <View style={styles.tRow}>
              <Text style={[styles.cItem, styles.muted]}>—</Text>
              <Text style={styles.cQty} />
              <Text style={styles.cHarga} />
              <Text style={styles.cSub} />
            </View>
          ) : (
            data.items.map((it, i) => (
              <View key={i} style={[styles.tRow, ...(i % 2 === 1 ? [{ backgroundColor: tint(accent, 0.035) }] : [])]} wrap={false}>
                <Text style={styles.cItem}>{it.nama}</Text>
                <Text style={[styles.cQty, styles.num]}>{it.qty}</Text>
                <Text style={[styles.cHarga, styles.num]}>{fmt(it.harga)}</Text>
                <Text style={[styles.cSub, styles.num]}>{fmt(it.subtotal)}</Text>
              </View>
            ))
          )}
        </View>

        {/* Totals */}
        <View style={styles.totalsWrap}>
          <View style={styles.totals}>
            {data.biayaKurir > 0 ? (
              <View style={styles.totalRow}><Text style={styles.muted}>Ongkos kirim</Text><Text>{fmt(data.biayaKurir)}</Text></View>
            ) : null}
            <View style={[styles.grandBox, { backgroundColor: tint(accent, 0.1) }]}>
              <Text style={styles.grandLabel}>Total</Text>
              <Text style={[styles.grandVal, { color: accent }]}>{fmt(data.totalGross)}</Text>
            </View>
            {data.totalOnline > 0 ? (
              <View style={styles.totalRow}><Text style={styles.muted}>Dibayar online</Text><Text>{fmt(data.totalOnline)}</Text></View>
            ) : null}
            {data.totalCourier > 0 ? (
              <View style={styles.totalRow}><Text style={styles.muted}>Dibayar ke kurir</Text><Text>{fmt(data.totalCourier)}</Text></View>
            ) : null}
          </View>
        </View>

        {/* Pembayaran + Pengiriman */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Pembayaran & Pengiriman</Text>
          <View style={styles.panelRow}><Text style={styles.muted}>Metode pembayaran</Text><Text style={styles.strong}>{data.metodeLabel}</Text></View>
          <View style={styles.panelRow}><Text style={styles.muted}>Status pembayaran</Text><Text style={styles.strong}>{data.statusBayarLabel}</Text></View>
          {hasDelivery ? (
            <>
              {data.tglKirim ? <View style={styles.panelRow}><Text style={styles.muted}>Tanggal kirim</Text><Text>{data.tglKirim}</Text></View> : null}
              {data.jamKirim ? <View style={styles.panelRow}><Text style={styles.muted}>Jam kirim</Text><Text>{data.jamKirim}</Text></View> : null}
              {data.resi ? <View style={styles.panelRow}><Text style={styles.muted}>No. resi</Text><Text style={styles.strong}>{data.resi}</Text></View> : null}
            </>
          ) : null}
        </View>

        <Text style={styles.footer} fixed>
          Terima kasih telah berbelanja di {data.seller.nama}. Dokumen ini dibuat otomatis dan sah tanpa tanda tangan.
        </Text>
      </Page>
    </Document>
  )
}
