'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'

export default function FloatingTrackButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling down 400px
      if (window.scrollY > 400) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Link
            href="/track"
            className="flex items-center gap-3 bg-[#1D1D1F] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md hover:bg-black transition-all group active:scale-95"
          >
            <div className="relative">
              <Search size={18} className="group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-apple-blue rounded-full animate-pulse" />
            </div>
            <span className="text-sm font-bold tracking-tight pr-1">
              Pantau Progress Websitemu
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
