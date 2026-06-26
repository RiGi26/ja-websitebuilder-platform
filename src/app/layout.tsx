import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { SpeedInsights } from '@vercel/speed-insights/next'

// Font app-wide (admin/portal/landing/template) di-self-host via next/font →
// zero render-block. Sebelumnya dimuat lewat CSS @import di globals.css (Inter +
// Fraunces) yang render-blocking di SETIAP route, termasuk storefront [slug]
// (padahal di sana Fraunces sudah dimuat next/font sendiri & Inter tak terpakai).
// Variabel di-pasang di <html> → dirujuk var(--font-inter)/var(--font-fraunces).
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap', axes: ['opsz'] })

export const metadata: Metadata = {
  title: 'Webzoka Studio — Solusi Website Bisnis Profesional',
  description: 'Bangun infrastruktur digital bisnismu mulai dari desain, hosting, hingga integrasi pembayaran otomatis. Terima beres, live dalam 7 hari.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster position="top-center" richColors />
        <SpeedInsights />
      </body>
    </html>
  )
}
