'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { LayoutGrid, Menu, X, MapPin } from 'lucide-react'
import Image from 'next/image'

const CORP_URL = 'https://ja-landingpage-platform.vercel.app'

const NAV_LINKS = [
  { label: 'Template', href: '/template' },
  { label: 'Harga', href: '/pricing' },
  { label: 'Track Pesanan', href: '/track' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change / outside click via scroll lock
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || menuOpen
            ? 'bg-white/95 backdrop-blur-xl border-b border-black/5 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 group transition-all active:scale-95">
            <Image
              src="/images/Icon.png"
              alt="Japan Arena"
              width={32} height={32}
              className="w-8 h-8 object-contain drop-shadow-sm group-hover:rotate-12 transition-transform duration-300"
            />
            <span className="text-xl sf-display-heavy tracking-tight text-gray-900 group-hover:text-[#0071E3] transition-colors">
              Japan Arena <span className="text-[#0071E3]">Studio</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} className="text-sm font-semibold text-gray-500 hover:text-[#0071E3] transition-colors sf-display">
                {link.label}
              </Link>
            ))}
            <div className="w-[1px] h-4 bg-black/10 mx-2" />
            <a
              href={CORP_URL}
              className="flex items-center gap-2 px-4 py-1.5 bg-gray-50 border border-black/[0.03] rounded-full text-[11px] font-bold text-gray-500 hover:bg-white hover:text-[#0071E3] transition-all group"
            >
              <LayoutGrid size={14} className="group-hover:rotate-90 transition-transform duration-500" />
              Portal Utama
            </a>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Button asChild className="hidden md:inline-flex bg-[#1D1D1F] hover:bg-black text-white rounded-full px-6 shadow-md transition-all active:scale-95">
              <Link href="https://wa.me/6281296917963?text=Halo%20Japan%20Arena%20Studio%2C%20saya%20tertarik%20dengan%20layanan%20pembuatan%20website.">
                Mulai Proyek
              </Link>
            </Button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-16 left-0 right-0 z-40 md:hidden transition-all duration-300 ease-out ${
          menuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="mx-4 mt-2 bg-white rounded-[24px] shadow-xl border border-black/[0.06] overflow-hidden">
          <div className="p-4 space-y-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center px-4 py-3.5 rounded-2xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[#0071E3] transition-colors"
              >
                {link.label}
                {link.href === '/track' && (
                  <span className="ml-auto text-[10px] font-bold text-[#0071E3] bg-blue-50 px-2 py-0.5 rounded-full">Cek Status</span>
                )}
              </Link>
            ))}
            <div className="h-px bg-gray-100 my-2" />
            <a
              href={CORP_URL}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3.5 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <LayoutGrid size={15} />
              Portal Utama
            </a>
          </div>
          <div className="px-4 pb-4">
            <Link
              href="https://wa.me/6281296917963?text=Halo%20Japan%20Arena%20Studio%2C%20saya%20tertarik%20dengan%20layanan%20pembuatan%20website."
              onClick={() => setMenuOpen(false)}
              className="block w-full bg-[#1D1D1F] text-white text-center py-3.5 rounded-2xl font-bold text-sm hover:bg-black transition-colors"
            >
              Mulai Proyek
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
