'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { ChevronLeft } from 'lucide-react'

const CORP_URL = process.env.NEXT_PUBLIC_CORP_URL ?? 'https://japanarenacorp.com'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md border-b border-gray-200'
          : 'bg-transparent'
      }`}
    >
      {/* Top micro-bar — back to JA Corp */}
      <div className="bg-gray-900 text-white text-xs py-1.5 px-6 flex items-center justify-center gap-2">
        <a
          href={CORP_URL}
          className="inline-flex items-center gap-1 text-gray-300 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-3 h-3" />
          Kembali ke Japan Arena Corp
        </a>
        <span className="text-gray-600 mx-2">|</span>
        <span className="text-gray-400">Portal Website Builder</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-semibold">
          WebStudio
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm hover:text-gray-600 transition-colors">Layanan</Link>
          <Link href="/template" className="text-sm hover:text-gray-600 transition-colors">Template</Link>
          <Link href="/portfolio" className="text-sm hover:text-gray-600 transition-colors">Portofolio</Link>
          <Link href="/pricing" className="text-sm hover:text-gray-600 transition-colors">Harga</Link>
          <Link href="/" className="text-sm hover:text-gray-600 transition-colors">Blog</Link>
        </div>

        {/* CTA Button */}
        <Button asChild>
          <Link href="/order">Mulai Gratis</Link>
        </Button>
      </div>
    </nav>
  )
}
