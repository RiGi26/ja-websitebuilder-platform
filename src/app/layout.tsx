import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { SpeedInsights } from '@vercel/speed-insights/next'
import AnalyticsConsent from '@/app/components/AnalyticsConsent'

// Inter remains global for the main application shell. Template display fonts
// are scoped to the route trees that render them, so Store does not preload
// unused display families.
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

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
    <html lang="id" className={inter.variable}>
      <body className="antialiased">
        {children}
        <Toaster position="top-center" richColors />
        <AnalyticsConsent />
        <SpeedInsights />
      </body>
    </html>
  )
}
