'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    Tawk_API?: object
    Tawk_LoadStart?: Date
  }
}

export default function LiveChatWidget({ propertyId }: { propertyId: string }) {
  useEffect(() => {
    if (!propertyId) return
    window.Tawk_API = window.Tawk_API ?? {}
    window.Tawk_LoadStart = new Date()

    const s = document.createElement('script')
    s.async = true
    s.src = `https://embed.tawk.to/${propertyId}/default`
    s.charset = 'UTF-8'
    s.setAttribute('crossorigin', '*')
    document.head.appendChild(s)

    return () => {
      document.head.removeChild(s)
    }
  }, [propertyId])

  return null
}
