'use client'

import { useState } from 'react'
import { Check, ChevronRight } from 'lucide-react'

const STEPS = [
  { val: 1, label: 'Briefing' },
  { val: 2, label: 'Analysis' },
  { val: 3, label: 'Design' },
  { val: 4, label: 'Dev' },
  { val: 5, label: 'Launch' },
]

export default function OrderStatusControl({ orderId, currentStep, currentStatus }: { orderId: string, currentStep: number, currentStatus: string }) {
  const [step, setStep] = useState(currentStep)
  const [loading, setLoading] = useState(false)

  const update = async (newStep: number, newStatus: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus, progress_step: newStep }),
      })
      if (res.ok) {
        setStep(newStep)
      } else {
        alert('Gagal update status')
      }
    } catch {
      alert('Error koneksi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Update Progress Pengerjaan</p>
      <div className="flex items-center gap-1.5 bg-gray-50 p-1.5 rounded-2xl border border-black/5">
        {STEPS.map((s) => (
          <button
            key={s.val}
            disabled={loading}
            onClick={() => update(s.val, s.val === 5 ? 'completed' : 'active')}
            className={`flex-1 py-2 px-1 rounded-xl text-[10px] font-bold transition-all ${
              step === s.val 
                ? 'bg-white apple-shadow text-apple-blue border border-black/5' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
          <button 
            disabled={loading}
            onClick={() => update(step, 'cancelled')}
            className="flex-1 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold hover:bg-red-100 transition-colors uppercase"
          >
            Cancel Project
          </button>
      </div>
    </div>
  )
}
