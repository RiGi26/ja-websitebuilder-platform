'use client'
// ============================================================
// Etalase menu yang BISA DIPESAN (storefront cutover Portal). Dirender DI DALAM
// .wr-root oleh WarungRenderer → pakai class wr-* (tema Hangat) + tambah stepper
// keranjang per kartu (usePortalCart). Menggantikan showcase link-only di mode portal.
// Semua pack catalog_mirror ditampilkan (TAK dibatasi 12 spt adapter showcase).
// ============================================================
import { Plus, Minus } from 'lucide-react'
import { formatMoney, moneyFromConfig } from '@/lib/format-money'
import { usePortalCart } from './PortalCartProvider'
import type { PortalCatalogItem } from '@/lib/portal/types'
import type { LocaleConfig } from '@/types/websitebuilder'

export default function PortalMenuSection({
  catalog,
  localeConfig,
  primary = '#C0432E',
  heading = 'Menu Kami',
  subtitle,
}: {
  catalog: PortalCatalogItem[]
  localeConfig?: LocaleConfig
  primary?: string
  heading?: string
  subtitle?: string
}) {
  const { add, inc, dec, qtyOf } = usePortalCart()
  const { locale, currency } = moneyFromConfig(localeConfig)
  const fmt = (n: number) => formatMoney(n, locale, currency)
  const priceText = (n: number) => (n > 0 ? fmt(n) : 'Tanya')

  return (
    <section className="wr-section wr-showcase" id="menu">
      <style dangerouslySetInnerHTML={{ __html: pmenuCss(primary) }} />
      <div className="wr-sec-hdr wr-rv lx-reveal" style={{ textAlign: 'center', margin: '0 auto 3.2rem' }}>
        <p className="wr-eyebrow" style={{ justifyContent: 'center' }}>Menu</p>
        <h2 className="wr-heading">{heading}</h2>
        {subtitle && <p className="wr-subtext" style={{ marginLeft: 'auto', marginRight: 'auto' }}>{subtitle}</p>}
      </div>
      <div className="wr-grid" data-count={catalog.length}>
        {catalog.map((item) => {
          const soldOut = item.avail_status === 'habis'
          const low = item.avail_status === 'menipis'
          const preorder = item.avail_status === 'preorder'
          const ready = item.avail_status === 'tersedia'
          const qty = qtyOf(item.pack_id)
          return (
            <article key={item.pack_id} className={`wr-card${soldOut ? ' is-soldout' : ''}`}>
              <div className="wr-card-frame">
                {item.kategori && <span className="wr-card-cat">{item.kategori}</span>}
                <span className="wr-card-tag">{priceText(item.harga)}</span>
                {soldOut && <span className="wr-card-soldout">Habis</span>}
                {preorder && <span className="wr-card-preorder">PO (Pre-Order)</span>}
                {low && <span className="wr-card-limited">Terbatas</span>}
                {item.foto_url && <img src={item.foto_url} alt={item.product_nama} loading="lazy" />}
              </div>
              <div className="wr-card-body">
                <h3 className="wr-card-name">{item.product_nama}</h3>
                {item.deskripsi && <p className="wr-card-desc">{item.deskripsi}</p>}
                <div className="pmenu-add">
                  {soldOut ? (
                    <span className="pmenu-out">Habis</span>
                  ) : qty === 0 ? (
                    <button
                      className="pmenu-add-btn"
                      onClick={() => add({ pack_id: item.pack_id, nama: item.product_nama, harga: item.harga, kategori: item.kategori, gambar: item.foto_url })}
                      aria-label={`Tambah ${item.product_nama} ke keranjang`}
                    >
                      <Plus size={15} aria-hidden /> {preorder ? 'PO (Pre-Order)' : 'Tambah'}
                    </button>
                  ) : (
                    <div className="pmenu-step">
                      <button onClick={() => dec(item.pack_id)} aria-label={`Kurangi ${item.product_nama}`}><Minus size={15} /></button>
                      <span aria-live="polite">{qty}</span>
                      <button onClick={() => inc(item.pack_id)} aria-label={`Tambah ${item.product_nama}`}><Plus size={15} /></button>
                    </div>
                  )}
                  {low && !soldOut && <span className="pmenu-low">Terbatas</span>}
                  {preorder && <span className="pmenu-po-label">PO (Pre-Order)</span>}
                  {ready && <span className="pmenu-available">Ready</span>}
                </div>
                {preorder && <p className="pmenu-po-note">* Pengiriman mengikuti jadwal PO</p>}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function pmenuCss(primary: string): string {
  return `
.pmenu-add{display:flex;align-items:center;gap:.7rem;margin-top:1rem;min-height:40px}
.pmenu-add-btn{display:inline-flex;align-items:center;gap:.35rem;border:none;border-radius:999px;background:${primary};color:#fff;font:600 .85rem/1 system-ui,sans-serif;padding:.55rem 1.1rem;cursor:pointer;transition:filter .2s,transform .15s}
.pmenu-add-btn:hover{filter:brightness(.93)}
.pmenu-add-btn:active{transform:scale(.96)}
.pmenu-step{display:inline-flex;align-items:center;gap:.6rem;border:1.5px solid ${primary};border-radius:999px;padding:.25rem .45rem;background:#fff}
.pmenu-step button{width:32px;height:32px;border:none;background:${primary}14;color:#2B1A12;border-radius:50%;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
.pmenu-step button:hover{background:${primary};color:#fff}
.pmenu-step span{min-width:1.4ch;text-align:center;font-weight:700;font-variant-numeric:tabular-nums}
.pmenu-out{font:600 .82rem/1 system-ui,sans-serif;color:#8E8E93}
.pmenu-low{font-size:.74rem;color:#FF9500;font-weight:600}
.pmenu-po-label{font-size:.74rem;color:#0071E3;font-weight:600}
.pmenu-available{font-size:.74rem;color:#34C759;font-weight:600}
.pmenu-po-note{font-size:.7rem;color:#8E8E93;margin-top:.45rem;font-style:italic}
.wr-card-preorder{position:absolute;left:.8rem;bottom:.8rem;z-index:4;font-size:.78rem;color:#fff;background:#0071E3;padding:.32rem .85rem;border-radius:999px;letter-spacing:.02em;box-shadow:0 6px 14px rgba(0,113,227,0.3)}
.wr-card-limited{position:absolute;left:.8rem;bottom:.8rem;z-index:4;font-size:.78rem;color:#fff;background:#FF9500;padding:.32rem .85rem;border-radius:999px;letter-spacing:.02em;box-shadow:0 6px 14px rgba(255,149,0,0.3)}
.pmenu-add-btn:focus-visible,.pmenu-step button:focus-visible{outline:3px solid ${primary};outline-offset:2px}
`
}
