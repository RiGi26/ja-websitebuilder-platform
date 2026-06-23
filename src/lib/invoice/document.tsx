// Layout PDF faktur via @react-pdf/renderer (pure-JS, jalan di Node runtime Vercel —
// tanpa headless Chrome). Hanya bergantung pada InvoiceData. Logo dikirim sebagai
// data-URL (di-prefetch di generate.ts) agar render tak gagal kalau URL logo mati.
//
// CATATAN react-pdf + Next 16: Next merender elemen pakai React 19 (elemen
// `react.transitional.element`). App memakai react@19 (lihat package.json) supaya
// reconciler react-pdf yang dipilih = React-19 (reconciler-31/33) dan menerima elemen
// itu — kalau react@18, reconciler-23 menolak → "Minified React error #31". Detail di
// next.config (serverExternalPackages) + package.json.

import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { formatMoney } from '@/lib/format-money'
import type { InvoiceData } from './types'

const INK = '#2B1A12'
const MUTED = '#6E5240'
const LINE = '#E7DBC9'
const DEFAULT_ACCENT = '#9A3322'

function accentOf(d: InvoiceData): string {
  const p = d.seller.primary
  return p && /^#[0-9a-fA-F]{6}$/.test(p) ? p : DEFAULT_ACCENT
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
  page: { paddingTop: 40, paddingBottom: 48, paddingHorizontal: 40, fontSize: 10, color: INK, fontFamily: 'Helvetica' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  sellerBox: { flexDirection: 'column', maxWidth: 300 },
  logo: { width: 92, maxHeight: 46, objectFit: 'contain', marginBottom: 8 },
  sellerName: { fontSize: 16, fontFamily: 'Helvetica-Bold' },
  sellerMeta: { fontSize: 9, color: MUTED, marginTop: 3, lineHeight: 1.4 },
  titleBox: { flexDirection: 'column', alignItems: 'flex-end' },
  title: { fontSize: 22, fontFamily: 'Helvetica-Bold', letterSpacing: 1 },
  metaLine: { fontSize: 9, color: MUTED, marginTop: 3 },
  metaStrong: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: INK },
  rule: { height: 2, marginTop: 16, marginBottom: 16, borderRadius: 2 },
  billTo: { marginBottom: 14 },
  label: { fontSize: 8, color: MUTED, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  buyer: { fontSize: 12, fontFamily: 'Helvetica-Bold' },
  tHead: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: INK },
  tRow: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: LINE },
  cItem: { flex: 1, paddingRight: 6 },
  cQty: { width: 38, textAlign: 'right' },
  cHarga: { width: 80, textAlign: 'right' },
  cSub: { width: 90, textAlign: 'right' },
  thText: { fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  totalsWrap: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
  totals: { width: 230 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  grandRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, marginTop: 4, borderTopWidth: 1, borderTopColor: INK },
  grandLabel: { fontSize: 11, fontFamily: 'Helvetica-Bold' },
  grandVal: { fontSize: 13, fontFamily: 'Helvetica-Bold' },
  muted: { color: MUTED },
  panel: { marginTop: 18, padding: 12, borderWidth: 1, borderColor: LINE, borderRadius: 8 },
  panelRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  badge: { alignSelf: 'flex-end', marginTop: 6, paddingVertical: 3, paddingHorizontal: 9, borderRadius: 10, color: '#FFFFFF', fontSize: 9, fontFamily: 'Helvetica-Bold' },
  footer: { position: 'absolute', bottom: 24, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: MUTED, borderTopWidth: 1, borderTopColor: LINE, paddingTop: 8 },
})

export function InvoiceDocument({ data, logoDataUrl }: { data: InvoiceData; logoDataUrl?: string | null }) {
  const accent = accentOf(data)
  const fmt = (n: number) => formatMoney(n, data.locale, data.currency)
  const hasDelivery = !!(data.tglKirim || data.jamKirim || data.resi)

  return (
    <Document title={`Faktur ${data.orderCode}`} author={data.seller.nama}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.sellerBox}>
            {logoDataUrl ? <Image src={logoDataUrl} style={styles.logo} /> : null}
            <Text style={[styles.sellerName, { color: accent }]}>{data.seller.nama}</Text>
            {data.seller.alamat ? <Text style={styles.sellerMeta}>{data.seller.alamat}</Text> : null}
            {(data.seller.wa || data.seller.email) ? (
              <Text style={styles.sellerMeta}>
                {[data.seller.wa, data.seller.email].filter(Boolean).join('  ·  ')}
              </Text>
            ) : null}
          </View>
          <View style={styles.titleBox}>
            <Text style={[styles.title, { color: accent }]}>FAKTUR</Text>
            <Text style={styles.metaLine}>No. <Text style={styles.metaStrong}>{data.orderCode}</Text></Text>
            <Text style={styles.metaLine}>{fmtTanggal(data.tanggal, data.locale)}</Text>
            <Text style={[styles.badge, { backgroundColor: accent }]}>{data.statusBayarLabel}</Text>
          </View>
        </View>

        <View style={[styles.rule, { backgroundColor: accent }]} />

        {/* Ditagihkan kepada */}
        <View style={styles.billTo}>
          <Text style={styles.label}>Ditagihkan kepada</Text>
          <Text style={styles.buyer}>{data.buyerNama || 'Pelanggan'}</Text>
        </View>

        {/* Tabel item */}
        <View style={styles.tHead}>
          <Text style={[styles.cItem, styles.thText]}>Item</Text>
          <Text style={[styles.cQty, styles.thText]}>Qty</Text>
          <Text style={[styles.cHarga, styles.thText]}>Harga</Text>
          <Text style={[styles.cSub, styles.thText]}>Subtotal</Text>
        </View>
        {data.items.length === 0 ? (
          <View style={styles.tRow}><Text style={[styles.cItem, styles.muted]}>—</Text><Text style={styles.cQty} /><Text style={styles.cHarga} /><Text style={styles.cSub} /></View>
        ) : (
          data.items.map((it, i) => (
            <View key={i} style={styles.tRow} wrap={false}>
              <Text style={styles.cItem}>{it.nama}</Text>
              <Text style={styles.cQty}>{it.qty}</Text>
              <Text style={styles.cHarga}>{fmt(it.harga)}</Text>
              <Text style={styles.cSub}>{fmt(it.subtotal)}</Text>
            </View>
          ))
        )}

        {/* Totals */}
        <View style={styles.totalsWrap}>
          <View style={styles.totals}>
            {data.biayaKurir > 0 ? (
              <View style={styles.totalRow}><Text style={styles.muted}>Ongkos kirim</Text><Text>{fmt(data.biayaKurir)}</Text></View>
            ) : null}
            <View style={styles.grandRow}>
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
          <View style={styles.panelRow}><Text style={styles.muted}>Metode pembayaran</Text><Text style={styles.metaStrong}>{data.metodeLabel}</Text></View>
          <View style={styles.panelRow}><Text style={styles.muted}>Status pembayaran</Text><Text style={styles.metaStrong}>{data.statusBayarLabel}</Text></View>
          {hasDelivery ? (
            <>
              {data.tglKirim ? <View style={styles.panelRow}><Text style={styles.muted}>Tanggal kirim</Text><Text>{data.tglKirim}</Text></View> : null}
              {data.jamKirim ? <View style={styles.panelRow}><Text style={styles.muted}>Jam kirim</Text><Text>{data.jamKirim}</Text></View> : null}
              {data.resi ? <View style={styles.panelRow}><Text style={styles.muted}>No. resi</Text><Text style={styles.metaStrong}>{data.resi}</Text></View> : null}
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
