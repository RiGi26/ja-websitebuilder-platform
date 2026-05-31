'use client'

import { useState } from 'react'
import { KeyRound, Loader2, RotateCw } from 'lucide-react'
import CredentialBox from './CredentialBox'

type Props = {
  tenantId: string
  hasAccount: boolean
  email: string | null
}

type Cred = { email: string; password: string }

// Tombol di seksi "Semua Website": buat akun login customer untuk website
// yang sudah ada (mis. dibuat manual), atau reset password akun existing.
export default function ClientAccountButton({ tenantId, hasAccount, email }: Props) {
  const [loading, setLoading] = useState(false)
  const [cred, setCred] = useState<Cred | null>(null)
  const [done, setDone] = useState(hasAccount)

  const run = async (method: 'POST' | 'PATCH') => {
    if (method === 'POST' && !email) {
      const m = prompt('Tenant belum punya email. Masukkan email untuk akun login:')
      if (!m) return
      return doCall(method, m)
    }
    return doCall(method)
  }

  const doCall = async (method: 'POST' | 'PATCH', emailOverride?: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/client-accounts', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, ...(emailOverride ? { email: emailOverride } : {}) }),
      })
      const json = await res.json()
      if (!res.ok) { alert(`Gagal: ${json.error ?? 'unknown'}`); return }
      if (json.account?.password) {
        setCred({ email: json.account.email, password: json.account.password })
        setDone(true)
      } else if (json.account?.reason === 'exists') {
        alert('Akun sudah ada. Gunakan Reset Password jika perlu.')
        setDone(true)
      }
    } catch { alert('Error koneksi') } finally { setLoading(false) }
  }

  return (
    <>
      {!done ? (
        <button onClick={() => run('POST')} disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/10 text-gray-600 text-[11px] font-bold uppercase hover:border-apple-blue/30 hover:text-apple-blue transition-colors disabled:opacity-50" title="Buat akun login untuk customer">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />} Buat Akun
        </button>
      ) : (
        <button onClick={() => run('PATCH')} disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/10 text-gray-400 text-[11px] font-bold uppercase hover:border-amber-400/40 hover:text-amber-500 transition-colors disabled:opacity-50" title="Reset password akun">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <RotateCw size={14} />} Reset
        </button>
      )}

      {cred && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setCred(null)}>
          <div className="bg-white rounded-[28px] p-8 max-w-md w-full apple-shadow" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-apple-blue flex items-center justify-center mb-4"><KeyRound size={22} /></div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Akun Login Customer</h3>
            <p className="text-sm text-gray-500 mb-5">Kirim ke customer via WhatsApp. <strong>Password hanya tampil sekali.</strong></p>
            <CredentialBox email={cred.email} password={cred.password} />
            <button onClick={() => setCred(null)} className="w-full mt-2 py-2.5 bg-apple-blue text-white rounded-xl text-[11px] font-bold uppercase hover:bg-blue-600">Tutup</button>
          </div>
        </div>
      )}
    </>
  )
}
