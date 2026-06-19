'use client'
// ============================================================
// Etalase menu yang BISA DIPESAN (storefront cutover Portal).
// Desain premium & modern: minimalis, glassmorphism, sticky category capsule bar,
// pulsing glowing status indicators, and smooth micro-animations.
// ============================================================
import { useState } from 'react'
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
  variant,
}: {
  catalog: PortalCatalogItem[]
  localeConfig?: LocaleConfig
  primary?: string
  heading?: string
  subtitle?: string
  variant?: string
}) {
  const { add, inc, dec, qtyOf } = usePortalCart()
  const { locale, currency } = moneyFromConfig(localeConfig)
  const fmt = (n: number) => formatMoney(n, locale, currency)
  const priceText = (n: number) => (n > 0 ? fmt(n) : 'Tanya')

  // Get unique categories dynamically
  const categories = ['Semua', ...Array.from(new Set(catalog.map((item) => item.kategori).filter(Boolean))) as string[]]
  const [activeCategory, setActiveCategory] = useState('Semua')

  const filteredCatalog = activeCategory === 'Semua'
    ? catalog
    : catalog.filter((item) => item.kategori === activeCategory)

  return (
    <section className="wr-section pmenu-section-container" id="menu">
      <style dangerouslySetInnerHTML={{ __html: pmenuCss(primary, variant) }} />
      
      <div className="wr-sec-hdr pmenu-header" style={{ textAlign: 'center', margin: '0 auto 2.5rem' }}>
        <p className="wr-eyebrow" style={{ justifyContent: 'center' }}>Menu</p>
        <h2 className="wr-heading">{heading}</h2>
        {subtitle && <p className="wr-subtext" style={{ marginLeft: 'auto', marginRight: 'auto' }}>{subtitle}</p>}
      </div>

      {/* STICKY CATEGORY CAPSULE BAR */}
      <div className="pmenu-cat-bar-wrapper">
        <div className="pmenu-cat-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`pmenu-cat-btn${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="wr-grid pmenu-grid" data-count={filteredCatalog.length}>
        {filteredCatalog.map((item) => {
          const soldOut = item.avail_status === 'habis'
          const low = item.avail_status === 'menipis'
          const preorder = item.avail_status === 'preorder'
          const ready = item.avail_status === 'tersedia'
          const qty = qtyOf(item.pack_id)
          return (
            <article key={item.pack_id} className={`wr-card pmenu-card${soldOut ? ' is-soldout' : ''}`}>
              <div className="wr-card-frame pmenu-card-frame">
                {item.kategori && <span className="wr-card-cat pmenu-card-cat">{item.kategori}</span>}
                <span className="wr-card-tag pmenu-card-tag">{priceText(item.harga)}</span>
                
                {/* Visual badges on frame */}
                {soldOut && <span className="wr-card-soldout pmenu-badge-soldout">Habis</span>}
                {preorder && <span className="wr-card-preorder pmenu-badge-preorder">PO (Pre-Order)</span>}
                {low && <span className="wr-card-limited pmenu-badge-limited">Terbatas</span>}
                
                {item.foto_url && <img src={item.foto_url} alt={item.product_nama} loading="lazy" className="pmenu-card-img" />}
              </div>
              <div className="wr-card-body pmenu-card-body">
                <h3 className="wr-card-name pmenu-card-name">{item.product_nama}</h3>
                {item.deskripsi && <p className="wr-card-desc pmenu-card-desc">{item.deskripsi}</p>}
                
                <div className="pmenu-add-section">
                  <div className="pmenu-add">
                    {soldOut ? (
                      <div className="pmenu-status-container">
                        <span className="pmenu-status-dot pmenu-status-dot-grey"></span>
                        <span className="pmenu-out">Habis</span>
                      </div>
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

                    {/* Glowing pulse status indicators next to buttons */}
                    {ready && (
                      <div className="pmenu-status-container">
                        <span className="pmenu-status-dot pmenu-status-dot-green pulsing"></span>
                        <span className="pmenu-available">Ready</span>
                      </div>
                    )}
                    {low && !soldOut && (
                      <div className="pmenu-status-container">
                        <span className="pmenu-status-dot pmenu-status-dot-amber pulsing"></span>
                        <span className="pmenu-low">Terbatas</span>
                      </div>
                    )}
                    {preorder && !soldOut && qty > 0 && (
                      <div className="pmenu-status-container">
                        <span className="pmenu-status-dot pmenu-status-dot-blue pulsing"></span>
                        <span className="pmenu-po-label">PO (Pre-Order)</span>
                      </div>
                    )}
                  </div>
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

function pmenuCss(primary: string, variant?: string): string {
  const isBiru = variant === 'biru'
  const bg = isBiru ? '#F5F5F7' : '#FBF3E4'
  const cardBg = isBiru ? '#FFFFFF' : '#FFFBF2'
  const ink = isBiru ? '#1D1D1F' : '#2B1A12'
  const inkDim = isBiru ? '#475569' : '#6E5240'
  const cardBorder = isBiru ? 'rgba(0, 0, 0, 0.05)' : 'rgba(43, 26, 18, 0.04)'
  const cardShadow = isBiru ? '0 8px 30px rgba(0, 0, 0, 0.03)' : '0 10px 30px rgba(43, 26, 18, 0.03)'
  const cardHoverShadow = isBiru ? '0 25px 50px rgba(0, 0, 0, 0.06)' : '0 25px 50px rgba(43, 26, 18, 0.08)'
  const priceBg = isBiru ? 'rgba(0, 113, 227, 0.95)' : 'rgba(224, 169, 60, 0.95)'
  const priceText = isBiru ? '#FFFFFF' : '#2B1A12'
  const catBtnBorder = isBiru ? 'rgba(0, 0, 0, 0.06)' : 'rgba(43, 26, 18, 0.08)'
  const catBtnColor = isBiru ? '#475569' : '#6E5240'
  const catBtnHoverBg = isBiru ? 'rgba(0, 0, 0, 0.03)' : 'rgba(43, 26, 18, 0.04)'
  const catBtnHoverColor = isBiru ? '#1D1D1F' : '#2B1A12'
  const catBtnActiveBg = isBiru ? primary : '#2B1A12'
  const catBtnActiveColor = isBiru ? '#FFFFFF' : '#FFFBF2'
  const catBtnActiveBorder = isBiru ? primary : '#2B1A12'
  const catBarBg = isBiru ? 'rgba(255, 255, 255, 0.85)' : 'rgba(251, 243, 228, 0.85)'
  const catBarBorder = isBiru ? 'rgba(0, 0, 0, 0.05)' : 'rgba(43, 26, 18, 0.05)'

  return `
/* SECTION STYLING */
.pmenu-section-container {
  background: ${bg};
}

/* STICKY CATEGORY CAPSULE BAR */
.pmenu-cat-bar-wrapper {
  position: sticky;
  top: 75px;
  z-index: 50;
  display: flex;
  justify-content: center;
  margin-bottom: 2.5rem;
  padding: 0.5rem 0;
  background: ${catBarBg};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 999px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid ${catBarBorder};
}
@media (max-width: 640px) {
  .pmenu-cat-bar-wrapper {
    top: 60px;
    border-radius: 0;
    max-width: 100%;
    margin-left: -7vw;
    margin-right: -7vw;
    padding: 0.5rem 1rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  }
}
.pmenu-cat-bar {
  display: flex;
  gap: 0.6rem;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  padding: 2px;
  width: 100%;
  justify-content: center;
}
.pmenu-cat-bar::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}
@media (max-width: 640px) {
  .pmenu-cat-bar {
    justify-content: flex-start;
  }
}
.pmenu-cat-btn {
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${catBtnColor};
  background: transparent;
  border: 1px solid ${catBtnBorder};
  padding: 0.5rem 1.2rem;
  border-radius: 999px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.pmenu-cat-btn:hover {
  background: ${catBtnHoverBg};
  color: ${catBtnHoverColor};
}
.pmenu-cat-btn.active {
  background: ${catBtnActiveBg};
  color: ${catBtnActiveColor};
  border-color: ${catBtnActiveBorder};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

/* PREMIUM ELEVATED CARDS */
.pmenu-card {
  border-radius: 28px !important;
  background: ${cardBg} !important;
  border: 1px solid ${cardBorder} !important;
  box-shadow: ${cardShadow} !important;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
}
.pmenu-card:hover {
  transform: translateY(-8px) scale(1.015) !important;
  box-shadow: ${cardHoverShadow} !important;
  border-color: ${isBiru ? 'rgba(0, 113, 227, 0.25)' : 'rgba(192, 67, 46, 0.15)'} !important;
}
.pmenu-card-frame {
  border-radius: 24px 24px 0 0 !important;
  overflow: hidden;
}
.pmenu-card-img {
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.pmenu-card:hover .pmenu-card-img {
  transform: scale(1.05) !important;
}

/* GLASSMORPHIC PRICE TAG & BADGES */
.pmenu-card-cat {
  background: rgba(255, 255, 255, 0.88) !important;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: ${ink} !important;
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.pmenu-card-tag {
  background: ${priceBg} !important;
  color: ${priceText} !important;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: ${isBiru ? '0 4px 12px rgba(0, 113, 227, 0.15)' : '0 4px 12px rgba(224, 169, 60, 0.2)'} !important;
  border-radius: 999px 0 0 999px;
}
.pmenu-badge-soldout {
  background: rgba(29, 29, 31, 0.9) !important;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.pmenu-badge-preorder {
  background: rgba(0, 113, 227, 0.95) !important;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 6px 15px rgba(0, 113, 227, 0.25) !important;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.pmenu-badge-limited {
  background: rgba(255, 149, 0, 0.95) !important;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 6px 15px rgba(255, 149, 0, 0.25) !important;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* CARD BODY */
.pmenu-card-body {
  padding: 1.5rem !important;
}
.pmenu-card-name {
  font-size: 1.35rem !important;
  color: ${ink} !important;
  margin-bottom: 0.5rem !important;
}
.pmenu-card-desc {
  font-size: 0.88rem !important;
  color: ${inkDim} !important;
  line-height: 1.6 !important;
}

/* BUTTONS & STEPPER */
.pmenu-add-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.25rem;
}
.pmenu-add {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
  min-height: 44px;
}
.pmenu-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  border: none;
  border-radius: 999px;
  background: ${primary};
  color: #fff;
  font: 600 0.85rem/1 system-ui, sans-serif;
  padding: 0.65rem 1.3rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 113, 227, 0.15);
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pmenu-add-btn:hover {
  filter: brightness(1.08);
  transform: scale(1.04);
  box-shadow: 0 6px 16px rgba(0, 113, 227, 0.25);
}
.pmenu-add-btn:active {
  transform: scale(0.96);
}
.pmenu-step {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  border: 1.5px solid ${primary};
  border-radius: 999px;
  padding: 0.3rem 0.5rem;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 113, 227, 0.05);
  animation: pmenu-pop-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pmenu-step button {
  width: 30px;
  height: 30px;
  border: none;
  background: ${primary}14;
  color: ${ink};
  border-radius: 50%;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.pmenu-step button:hover {
  background: ${primary};
  color: #fff;
}
.pmenu-step span {
  min-width: 1.4ch;
  text-align: center;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  font-size: 0.95rem;
}

/* GLOWING PULSING STATUS INDICATORS */
.pmenu-status-container {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-left: auto;
  padding: 0.35rem 0.75rem;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.02);
}
.pmenu-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}
.pmenu-status-dot.pulsing {
  animation: pmenu-pulse-glow 1.4s infinite alternate;
}
.pmenu-status-dot-green {
  background-color: #34C759;
  box-shadow: 0 0 6px #34C759;
}
.pmenu-status-dot-amber {
  background-color: #FF9500;
  box-shadow: 0 0 6px #FF9500;
}
.pmenu-status-dot-blue {
  background-color: #0071E3;
  box-shadow: 0 0 6px #0071E3;
}
.pmenu-status-dot-grey {
  background-color: #8E8E93;
}

/* STATUS LABELS */
.pmenu-out {
  font: 700 0.76rem/1 system-ui, sans-serif;
  color: #8E8E93;
}
.pmenu-low {
  font-size: 0.76rem;
  color: #FF9500;
  font-weight: 700;
}
.pmenu-po-label {
  font-size: 0.76rem;
  color: #0071E3;
  font-weight: 700;
}
.pmenu-available {
  font-size: 0.76rem;
  color: #34C759;
  font-weight: 700;
}
.pmenu-po-note {
  font-size: 0.74rem;
  color: #8E8E93;
  margin-top: 0.65rem;
  font-style: italic;
  line-height: 1;
}

/* KEYFRAMES */
@keyframes pmenu-pulse-glow {
  0% { transform: scale(0.85); opacity: 0.6; box-shadow: 0 0 4px currentColor; }
  100% { transform: scale(1.2); opacity: 1; box-shadow: 0 0 10px currentColor; }
}
@keyframes pmenu-pop-in {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.pmenu-add-btn:focus-visible, .pmenu-step button:focus-visible {
  outline: 3px solid ${primary};
  outline-offset: 2px;
}
`;
}
