// Bentuk data ternormalisasi untuk satu invoice/faktur. Engine invoice (document +
// generate) HANYA bergantung pada tipe ini — bukan pada sumbernya. Itu sebabnya
// adapter terpisah (from-projection.ts untuk tenant Portal; nanti from-shop-order.ts
// untuk tenant legacy) bisa ditambah tanpa menyentuh layout PDF.

export interface InvoiceItem {
  nama: string
  qty: number
  harga: number      // harga satuan
  subtotal: number   // harga * qty
}

export interface InvoiceSeller {
  nama: string
  alamat?: string | null
  wa?: string | null
  email?: string | null
  logoUrl?: string | null
  primary?: string | null   // hex warna brand untuk aksen header
}

export interface InvoiceData {
  seller: InvoiceSeller
  buyerNama: string | null

  orderCode: string
  /** ISO string tanggal order dibuat (dari order_projection.created_at). */
  tanggal: string | null

  items: InvoiceItem[]
  totalGross: number
  totalOnline: number
  totalCourier: number
  biayaKurir: number

  metodeLabel: string
  statusBayarLabel: string

  tglKirim?: string | null
  jamKirim?: string | null
  resi?: string | null

  // Format mata uang per-tenant.
  locale: string
  currency: string
}
