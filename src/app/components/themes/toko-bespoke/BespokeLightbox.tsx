// ============================================================
// TOKO-BESPOKE — dialog quick-look bersama (SSR tunggal, diisi LUX_JS dari
// data-* trigger ber-kelas `.lx-lb-open`). Markup netral (hook `.lx-lb*`);
// STYLING-nya milik tiap renderer (di CSS inline-nya) supaya rasa tetap bespoke.
// ============================================================

const CHEV_L = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
)
const CHEV_R = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
)

export default function BespokeLightbox({ ctaText = 'Pesan via WhatsApp' }: { ctaText?: string }) {
  return (
    <div className="lx-lb" role="dialog" aria-modal="true" aria-label="Pratinjau produk" hidden>
      <div className="lx-lb-back" data-lb-close aria-hidden />
      <figure className="lx-lb-panel">
        <button type="button" className="lx-lb-x" data-lb-close aria-label="Tutup pratinjau">×</button>
        <div className="lx-lb-media"><img alt="" /></div>
        <figcaption className="lx-lb-body">
          <span className="lx-lb-cat" />
          <span className="lx-lb-title" />
          <span className="lx-lb-price" />
          <p className="lx-lb-desc" />
          <a className="lx-lb-cta" href="#" target="_blank" rel="noopener noreferrer">{ctaText}</a>
        </figcaption>
        <button type="button" className="lx-lb-prev" aria-label="Item sebelumnya">{CHEV_L}</button>
        <button type="button" className="lx-lb-next" aria-label="Item berikutnya">{CHEV_R}</button>
      </figure>
    </div>
  )
}
