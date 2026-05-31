'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

// Kotak kredensial login customer dengan tombol salin per-field (Email,
// Password) + "Salin Semua" (blok siap-kirim via WhatsApp). Dipakai di
// modal BuildButton (provisioning) & ClientAccountButton (Buat Akun/Reset).
export default function CredentialBox({ email, password }: { email: string; password: string }) {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (key: string, text: string) => {
    try { await navigator.clipboard.writeText(text) } catch { return }
    setCopied(key)
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000)
  }

  const allText = () =>
    `Login dashboard website Anda:\nURL: ${location.origin}/portal/login\nEmail: ${email}\nPassword: ${password}`

  const btn = 'shrink-0 p-2 rounded-lg hover:bg-white text-gray-500 border border-black/10 transition-colors'

  return (
    <div>
      <div className="bg-gray-50 rounded-2xl p-4 border border-black/5 space-y-3 text-sm font-mono">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-gray-400 text-[10px] uppercase tracking-widest font-sans">Email</span>
            <p className="truncate">{email}</p>
          </div>
          <button onClick={() => copy('email', email)} title="Salin Email" className={btn}>
            {copied === 'email' ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
          </button>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-black/5 pt-3">
          <div className="min-w-0">
            <span className="text-gray-400 text-[10px] uppercase tracking-widest font-sans">Password</span>
            <p className="truncate">{password}</p>
          </div>
          <button onClick={() => copy('password', password)} title="Salin Password" className={btn}>
            {copied === 'password' ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
          </button>
        </div>
      </div>
      <button
        onClick={() => copy('all', allText())}
        className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white rounded-xl text-[11px] font-bold uppercase hover:bg-gray-800"
      >
        {copied === 'all' ? <Check size={14} /> : <Copy size={14} />} {copied === 'all' ? 'Tersalin' : 'Salin Semua'}
      </button>
    </div>
  )
}
