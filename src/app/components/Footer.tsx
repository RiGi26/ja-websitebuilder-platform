'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Briefcase } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <Image 
            src="/images/Icon.png" 
            alt="Webzoka Logo"
            width={32} 
            height={32} 
            className="w-8 h-8 object-contain"
          />
          <span className="font-bold text-gray-900">Webzoka Studio</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-500">
          <Link href="/" className="hover:text-apple-blue transition-colors">Track Pesanan</Link>
          <Link href="https://wa.me/6281296917963" className="hover:text-apple-blue transition-colors">Hubungi Kami</Link>
          
          {/* Admin Entry Point (Subtle) */}
          <Link 
            href="/admin" 
            className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-apple-blue transition-all border border-black/[0.03]"
          >
            <Briefcase size={14} />
            Studio Admin
          </Link>
        </div>

        <p className="text-gray-400 text-xs">
          © {new Date().getFullYear()} Webzoka. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
