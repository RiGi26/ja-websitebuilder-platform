'use client'

import { useState } from 'react'

const STEPS = [
  { val: 1, label: 'Briefing' },
  { val: 2, label: 'Analysis' },
  { val: 3, label: 'Design' },
  { val: 4, label: 'Dev' },
  { val: 5, label: 'Launch' },
]

type Props = {
  orderId: string
  currentStep: number
  currentStatus: string
  currentNote: string | null
  currentDeliveredUrl: string | null
  currentDeliveredCredentials: string | null
}

export default function OrderStatusControl({
  orderId,
  currentStep,
  currentStatus,
  currentNote,
  currentDeliveredUrl,
  currentDeliveredCredentials,
}: Props) {
  const [step, setStep] = useState(currentStep)
  const [note, setNote] = useState(currentNote ?? '')
  const [savedNote, setSavedNote] = useState(currentNote ?? '')
  const [deliveredUrl, setDeliveredUrl] = useState(currentDeliveredUrl ?? '')
  const [savedDeliveredUrl, setSavedDeliveredUrl] = useState(currentDeliveredUrl ?? '')
  const [deliveredCredentials, setDeliveredCredentials] = useState(currentDeliveredCredentials ?? '')
  const [savedDeliveredCredentials, setSavedDeliveredCredentials] = useState(currentDeliveredCredentials ?? '')
  const [loading, setLoading] = useState(false)
  const [savedToast, setSavedToast] = useState(false)

  const noteChanged = note !== savedNote
  const deliveryChanged =
    deliveredUrl !== savedDeliveredUrl ||
    deliveredCredentials !== savedDeliveredCredentials

  const update = async (newStep: number, newStatus: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: orderId,
          status: newStatus,
          progress_step: newStep,
          progress_note: note,
          delivered_url: deliveredUrl,
          delivered_credentials: deliveredCredentials,
        }),
      })
      if (res.ok) {
        setStep(newStep)
        setSavedNote(note)
        setSavedDeliveredUrl(deliveredUrl)
        setSavedDeliveredCredentials(deliveredCredentials)
        setSavedToast(true)
        setTimeout(() => setSavedToast(false), 1800)
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
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Update Progress Pengerjaan
        </p>
        {savedToast && (
          <span className="text-[10px] font-bold text-green-600">✓ Tersimpan & WA terkirim</span>
        )}
      </div>

      {/* Step pipeline */}
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

      {/* Note input — visible ke customer di /track */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          Catatan untuk Customer
        </p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={loading}
          rows={3}
          placeholder="Contoh: Mockup desain selesai, link preview..."
          className="w-full text-xs rounded-xl border border-black/10 p-3 focus:border-apple-blue focus:outline-none resize-none disabled:opacity-50"
        />
        {noteChanged && (
          <button
            disabled={loading}
            onClick={() => update(step, step === 5 ? 'completed' : 'active')}
            className="w-full py-2 bg-apple-blue text-white rounded-xl text-[10px] font-bold hover:bg-blue-600 transition-colors uppercase disabled:opacity-50"
          >
            Simpan Catatan
          </button>
        )}
      </div>

      {/* Final Deliverables — visible ke customer sebagai hero card di /track saat step Launch */}
      <div className="space-y-2 p-3 bg-green-50/40 rounded-2xl border border-green-100">
        <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest">
          🚀 Final Deliverables (untuk step Launch)
        </p>
        <input
          type="url"
          value={deliveredUrl}
          onChange={(e) => setDeliveredUrl(e.target.value)}
          disabled={loading}
          placeholder="https://website-customer.com"
          className="w-full text-xs rounded-xl border border-black/10 p-3 focus:border-green-500 focus:outline-none disabled:opacity-50"
        />
        <textarea
          value={deliveredCredentials}
          onChange={(e) => setDeliveredCredentials(e.target.value)}
          disabled={loading}
          rows={2}
          placeholder="Catatan akses tambahan (opsional). Login portal customer dikirim OTOMATIS via WA + email saat step Launch."
          className="w-full text-xs rounded-xl border border-black/10 p-3 focus:border-green-500 focus:outline-none resize-none disabled:opacity-50"
        />
        {deliveryChanged && (
          <button
            disabled={loading}
            onClick={() => update(step, step === 5 ? 'completed' : 'active')}
            className="w-full py-2 bg-green-600 text-white rounded-xl text-[10px] font-bold hover:bg-green-700 transition-colors uppercase disabled:opacity-50"
          >
            Simpan Deliverables
          </button>
        )}
      </div>

      {/* Cancel */}
      <button
        disabled={loading}
        onClick={() => update(step, 'cancelled')}
        className="w-full py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold hover:bg-red-100 transition-colors uppercase disabled:opacity-50"
      >
        Cancel Project
      </button>
    </div>
  )
}
