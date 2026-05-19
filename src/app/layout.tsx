import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/app/components/Navbar'

export const metadata: Metadata = {
  title: 'WebStudio — Website Profesional untuk Bisnis Anda',
  description:
    'Dari desain hingga launch dalam hitungan hari. Website custom yang benar-benar sesuai dengan bisnis Anda.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-white">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
