'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, Loader2, PencilRuler, KeyRound, Wand2, Eye } from 'lucide-react'
import CredentialBox from './CredentialBox'

type Props = {
  orderId: string
  hasTenant: boolean
  pageId: string | null
}

type Cred = { email: string; password: string }

// Tombol di kartu order:
//  - belum ada website  -> "Buatkan Website" (POST provisioning + auto akun)
//  - sudah ada           -> "Kelola Website" (ke editor)
export default function BuildButton({ orderId, hasTenant, pageId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [building, setBuilding] = useState(false)
  const [cred, setCred] = useState<Cred | null>(null)
  const [nextPageId, setNextPageId] = useState<string | null>(null)

  // F1-4 + F5-1 — bangun konten otomatis dari briefing order sebagai DRAFT,
  // lalu arahkan admin ke halaman Preview untuk review sebelum Publish.
  const autoBuild = async () => {
    if (!confirm('Bangun konten website otomatis dari briefing order ini? Hasil dibuat sebagai DRAFT — kamu review di Preview lalu Publish. Konten lama hasil build akan ditimpa.')) return
    setBuilding(true)
    try {
      const res = await fetch(`/api/admin/build-order/${orderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publish: false }),
      })
      const json = await res.json()
      if (!res.ok) {
        alert(`Gagal: ${json.error ?? 'unknown'}`)
        return
      }
      // Sukses → buka Preview (review hasil build, publish dari sana).
      const pid = json.pageId ?? pageId
      if (pid) {
        router.push(`/admin/preview/${pid}`)
        return
      }
      router.refresh()
    } catch {
      alert('Error koneksi')
    } finally {
      setBuilding(false)
    }
  }

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
      const pid = json.page?.id ?? null
      // Akun customer baru dibuat -> tampilkan kredensial dulu (sekali tampil).
      if (json.clientAccount?.created) {
        setCred({ email: json.clientAccount.email, password: json.clientAccount.password })
        setNextPageId(pid)
        return
      }
      if (pid) router.push(`/admin/build/${pid}`)
      else router.refresh()
    } catch {
      alert('Error koneksi')
    } finally {
      setLoading(false)
    }
  }

  const closeCred = () => {
    const pid = nextPageId
    setCred(null)
    if (pid) router.push(`/admin/build/${pid}`)
    else router.refresh()
  }

  if (cred) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={closeCred}>
        <div className="bg-white rounded-[28px] p-8 max-w-md w-full apple-shadow" onClick={(e) => e.stopPropagation()}>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-apple-blue flex items-center justify-center mb-4">
            <KeyRound size={22} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Akun Login Customer Dibuat</h3>
          <p className="text-sm text-gray-500 mb-5">
            Simpan & kirim ke customer via WhatsApp. <strong>Password hanya tampil sekali ini.</strong>
          </p>
          <CredentialBox email={cred.email} password={cred.password} />
          <button onClick={closeCred} className="w-full mt-2 py-2.5 bg-apple-blue text-white rounded-xl text-[11px] font-bold uppercase hover:bg-blue-600">
            Lanjut ke Editor
          </button>
        </div>
      </div>
    )
  }

  if (hasTenant && pageId) {
    return (
      <div className="flex flex-col gap-2">
        <button
          disabled={building}
          onClick={autoBuild}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl text-[11px] font-bold hover:bg-emerald-700 transition-colors uppercase tracking-widest disabled:opacity-50"
        >
          {building ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
          {building ? 'Membangun…' : 'Bangun Draft'}
        </button>
        <div className="flex gap-2">
          <a
            href={`/admin/preview/${pageId}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white rounded-xl text-[11px] font-bold hover:bg-gray-700 transition-colors uppercase tracking-widest"
          >
            <Eye size={14} /> Preview
          </a>
          <a
            href={`/admin/build/${pageId}`}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl text-[11px] font-bold hover:bg-indigo-700 transition-colors uppercase tracking-widest"
          >
            <PencilRuler size={14} /> Kelola
          </a>
        </div>
      </div>
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
