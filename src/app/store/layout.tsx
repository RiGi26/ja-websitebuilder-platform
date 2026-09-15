import type { Metadata } from 'next'
import { Newsreader, Plus_Jakarta_Sans, Syne } from 'next/font/google'
import { STORE_METADATA_BASE } from '@/lib/store/metadata'
import './store.css'

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-warm-display',
  weight: ['400', '500', '600'],
  display: 'swap',
  adjustFontFallback: false,
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: STORE_METADATA_BASE,
  title: 'Webzoka Store',
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <div className={`wz-store ${newsreader.variable} ${syne.variable} ${jakarta.variable}`}>{children}</div>
}
