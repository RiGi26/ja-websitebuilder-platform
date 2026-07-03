// Click-to-edit (Wave 2) — util fokus field bersama panel-panel tab Konten.
// Dipanggil SETELAH accordion pemilik dibuka (state), tunggu sebentar supaya
// DOM ter-render, lalu scroll + focus + kilat sorot biru sesaat.
export function focusEditTarget(selector: string, fallbackSelector?: string) {
  window.setTimeout(() => {
    const el =
      document.querySelector<HTMLElement>(selector) ??
      (fallbackSelector ? document.querySelector<HTMLElement>(fallbackSelector) : null)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) el.focus({ preventScroll: true })
    const ring = el.closest<HTMLElement>('[data-slot-key],[data-field-key],[data-brand-group]') ?? el
    ring.style.transition = 'box-shadow .3s'
    ring.style.boxShadow = '0 0 0 3px rgba(0,113,227,.45)'
    ring.style.borderRadius = '10px'
    window.setTimeout(() => { ring.style.boxShadow = '' }, 1600)
  }, 120)
}
