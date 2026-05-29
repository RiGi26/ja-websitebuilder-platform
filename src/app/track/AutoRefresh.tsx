'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Auto-refresh halaman track tiap N detik supaya customer tidak perlu reload manual
// untuk lihat update progress dari admin
export default function AutoRefresh({ intervalMs = 30000 }: { intervalMs?: number }) {
  const router = useRouter()

  useEffect(() => {
    const t = setInterval(() => {
      router.refresh()
    }, intervalMs)
    return () => clearInterval(t)
  }, [intervalMs, router])

  return null
}
