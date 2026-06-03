'use client'

import { useState } from 'react'
import { Loader2, CreditCard } from 'lucide-react'

export default function PelunasanButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePelunasan = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/payment/pelunasan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal membuat transaksi pelunasan')
      window.location.href = data.redirect_url
    } catch (e: any) {
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handlePelunasan}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#0071E3] text-white font-bold text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 shadow-lg shadow-blue-200"
      >
        {loading
          ? <><Loader2 size={16} className="animate-spin" /> Memproses...</>
          : <><CreditCard size={16} /> Lunasi Sekarang</>
        }
      </button>
      {error && <p className="text-xs text-red-500 text-center">{error}</p>}
    </div>
  )
}
