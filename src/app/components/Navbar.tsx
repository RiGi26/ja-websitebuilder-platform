'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { ChevronLeft, LogIn } from 'lucide-react'
import Image from 'next/image'

const CORP_URL = 'https://ja-landingpage-platform.vercel.app'

export default function Navbar() {
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
          ? 'bg-white/80 backdrop-blur-xl border-b border-black/5 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image 
            src="/images/Icon.png" 
            alt="Japan Arena" 
            width={32} height={32} 
            className="w-8 h-8 object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
          />
          <span className="text-xl sf-display-heavy tracking-tight text-gray-900">
            Japan Arena <span className="text-apple-blue">Studio</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/template" className="text-sm font-semibold text-gray-500 hover:text-apple-blue transition-colors sf-display">Template</Link>
          <Link href="/pricing" className="text-sm font-semibold text-gray-500 hover:text-apple-blue transition-colors sf-display">Harga</Link>
          <Link href="/track" className="text-sm font-semibold text-gray-500 hover:text-apple-blue transition-colors sf-display">Track Pesanan</Link>
          <a href={CORP_URL} className="text-sm font-semibold text-gray-500 hover:text-apple-blue transition-colors sf-display inline-flex items-center gap-1">
            <ChevronLeft size={14}/> Japan Arena Corp
          </a>
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
            <Button asChild className="bg-[#1D1D1F] hover:bg-black text-white rounded-full px-6 shadow-md transition-all active:scale-95">
                <Link href="https://wa.me/6281296917963?text=Halo%20Japan%20Arena%20Studio%2C%20saya%20tertarik%20dengan%20layanan%20pembuatan%20website.">
                    Mulai Proyek
                </Link>
            </Button>
        </div>
      </div>
    </nav>
  )
}
