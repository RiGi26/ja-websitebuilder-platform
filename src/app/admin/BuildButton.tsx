'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, Loader2, PencilRuler } from 'lucide-react'

type Props = {
  orderId: string
  hasTenant: boolean
  pageId: string | null
}

// Tombol di kartu order:
//  - belum ada website  -> "Buatkan Website" (POST provisioning)
//  - sudah ada           -> "Kelola Website" (ke editor)
export default function BuildButton({ orderId, hasTenant, pageId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const provision = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      const json = await res.json()
      if (!res.ok) {
        alert(`Gagal: ${json.error ?? 'unknown'}`)
        return
      }
      if (json.page?.id) {
        router.push(`/admin/build/${json.page.id}`)
      } else {
        router.refresh()
      }
    } catch {
      alert('Error koneksi')
    } finally {
      setLoading(false)
    }
  }

  if (hasTenant && pageId) {
    return (
      <a
        href={`/admin/build/${pageId}`}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl text-[11px] font-bold hover:bg-indigo-700 transition-colors uppercase tracking-widest"
      >
        <PencilRuler size={14} /> Kelola Website
      </a>
    )
  }

  return (
    <button
      disabled={loading}
      onClick={provision}
      className="w-full flex items-center justify-center gap-2 py-2.5 bg-apple-blue text-white rounded-xl text-[11px] font-bold hover:bg-blue-600 transition-colors uppercase tracking-widest disabled:opacity-50"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
      {loading ? 'Membuat…' : 'Buatkan Website'}
    </button>
  )
}
