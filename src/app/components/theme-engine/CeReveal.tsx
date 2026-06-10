'use client'
// ============================================================
// LUX — scroll-reveal ringan (tanpa library). Satu IntersectionObserver untuk
// seluruh `.ce-reveal` di .ce-root: tambah `.ce-in` saat masuk viewport (CSS
// transisi opacity/transform = GPU, bukan layout). Menandai `.ce-js` lebih dulu
// supaya TANPA JS konten tetap tampil (CSS hanya menyembunyikan saat .ce-js).
// Hormati prefers-reduced-motion (langsung tampilkan semua). <1KB, nol regresi
// (hanya tema lux yang menanam <CeReveal/> + kelas .ce-reveal).
// ============================================================
import { useEffect } from 'react'

export default function CeReveal() {
  useEffect(() => {
    const root = document.querySelector('.ce-root')
    if (!root) return
    root.classList.add('ce-js')
    const els = Array.from(root.querySelectorAll<HTMLElement>('.ce-reveal'))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('ce-in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('ce-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return null
}
