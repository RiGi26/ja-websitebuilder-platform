// ============================================================
// Kontrak tipe integrasi Website ⇄ Portal Operasi (BAKSO_PORTAL_CONTRACT.md v1.1 §4.1).
// Dipakai bersama oleh: portal client (outbound), Portal stub (Fase 1), WB intake
// route, dan UI checkout. SATU sumber tipe → request/response tak boleh drift.
// ============================================================

export type MetodeBayar = 'transfer_jp' | 'transfer_id' | 'paypay' | 'cod_full' | 'cod_ongkir'
export const METODE_BAYAR: MetodeBayar[] = ['transfer_jp', 'transfer_id', 'paypay', 'cod_full', 'cod_ongkir']

export type FulfillmentMode = 'IMMEDIATE' | 'PREORDER'
export type StatusBayar = 'belum_bayar' | 'menunggu_verifikasi' | 'lunas' | 'cod' | 'gagal' | 'refund'
export type StatusFulfillment =
  | 'menunggu' | 'dikonfirmasi' | 'diproduksi' | 'dikemas' | 'dikirim' | 'selesai' | 'batal'

export interface PortalPembeli {
  nama: string
  telp: string
  email?: string | null
  ig?: string | null
  kode_pos?: string | null
  alamat?: string | null
  catatan?: string | null
}

/** Add-on di-scaffold di tipe (item.addons / order_addons) supaya tinggal colok
 *  saat F1.5; UI add-on belum dibangun (keputusan owner 2026-06-18 — tunda add-on). */
export interface PortalAddonRef { addon_id: string; qty: number }

export interface PortalOrderItemReq {
  product_pack_id: string
  qty: number
  addons?: PortalAddonRef[]
}

/** Body POST {PORTAL}/api/orders (contract §4.1). */
export interface PortalOrderRequest {
  tenant_slug: string
  pembeli: PortalPembeli
  metode_bayar: MetodeBayar
  fulfillment_mode: FulfillmentMode
  tgl_kirim?: string | null
  items: PortalOrderItemReq[]
  order_addons?: PortalAddonRef[]
  /** Estimasi ongkir website (kode_pos→region); Portal recompute otoritatif (§4.1). */
  ongkir?: number
}

export interface InstruksiBayar {
  metode: MetodeBayar
  nominal: number
  rekening?: string | null
  catatan?: string | null
}

/** Response 201 (sukses) / 200 (replay idempoten — body identik aslinya) (contract §4.1). */
export interface PortalOrderResponse {
  ok: true
  order_code: string
  tracking_token: string
  status_bayar: StatusBayar
  status_fulfillment: StatusFulfillment
  metode_bayar: MetodeBayar
  total_online: number
  total_courier: number
  total_gross: number
  biaya_kurir: number
  instruksi_bayar: InstruksiBayar
  created_at?: string
}

/** Entri konflik stok (pack ATAU addon), menyertakan `nama` (contract §4.1). */
export interface StockConflictEntry {
  kind: 'pack' | 'addon'
  ref_id: string
  nama: string
  tersedia: number
  diminta: number
}

/** Body error Portal (4xx) (contract §4.1 tabel error). */
export interface PortalErrorBody {
  ok: false
  error: string // invalid_payload · bad_signature · unknown_tenant · unknown_pack · stock_conflict · closed · rate_limited
  conflicts?: StockConflictEntry[]
}

/** Ringkasan baris utk order_projection.ringkasan_items + struk WA. */
export interface RingkasanItem { nama: string; qty: number; harga: number }

export type AvailStatus = 'tersedia' | 'menipis' | 'habis' | 'preorder'

/** Baris catalog_mirror yg dibaca storefront (server-side; mirror tanpa akses anon §3/§8). */
export interface PortalCatalogItem {
  pack_id: string
  product_nama: string
  kategori?: string | null
  deskripsi?: string | null
  foto_url?: string | null
  harga: number
  avail_status: AvailStatus
}

/** Baris keranjang storefront (client). Add-on di-scaffold (tunda F1.5) — line key = pack_id. */
export interface CartLine {
  pack_id: string
  nama: string
  harga: number
  qty: number
  kategori?: string | null
  gambar?: string | null
}
