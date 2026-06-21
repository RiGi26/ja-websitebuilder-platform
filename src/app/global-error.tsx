'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

// Menangkap error yang terjadi di root layout (yang TIDAK tertangkap error.tsx biasa)
// lalu mengirimnya ke Sentry. Hanya muncul pada kegagalan paling fatal → fallback netral.
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="id">
      <body style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', textAlign: 'center' }}>
        <h2>Terjadi kesalahan.</h2>
        <p>Maaf, ada gangguan tak terduga. Silakan muat ulang halaman.</p>
      </body>
    </html>
  )
}
