import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Japan Arena Studio — Solusi Website Bisnis Profesional',
  description: 'Bangun infrastruktur digital bisnismu mulai dari desain, hosting, hingga integrasi pembayaran otomatis. Terima beres, live dalam 7 hari.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
