'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// ============================================================
// Auto-refresh halaman lacak pesanan. Halaman /lacak/[token] = server component
// `force-dynamic`, jadi router.refresh() me-render ulang di server & menyuntik
// status terbaru tanpa full reload (scroll/posisi terjaga). Berhenti otomatis
// di status terminal (selesai/batal) lewat prop `active`, dan hanya jalan saat
// tab terlihat agar hemat kuota (rate-limit lacak 60/min/IP) & baterai.
// ============================================================
export default function AutoRefresh({
  active = true,
  intervalMs = 20_000,
}: {
  active?: boolean
  intervalMs?: number
}) {
  const router = useRouter()

  useEffect(() => {
    if (!active) return
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') router.refresh()
    }, intervalMs)
    return () => clearInterval(id)
  }, [active, intervalMs, router])

  return null
}
