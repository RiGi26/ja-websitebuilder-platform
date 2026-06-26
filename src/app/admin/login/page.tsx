'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Loader2, AlertCircle, Home } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError('Kata sandi salah. Silakan coba lagi.')
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link 
            href="https://www.webzoka.com"
            className="group flex flex-col items-center gap-4 transition-all"
            title="Kembali ke Portal Utama"
          >
            <div className="relative">
              <Image 
                src="/images/Icon.png" 
                alt="Logo" 
                width={56} height={56} 
                className="mx-auto object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-[8px] px-2 py-0.5 rounded-full whitespace-nowrap pointer-events-none uppercase tracking-widest font-bold">
                Beranda
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl sf-display-heavy text-gray-900 tracking-tight leading-none">Studio Admin</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-2">Webzoka Studio</p>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-[32px] p-8 apple-shadow border border-black/[0.03]">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-xs font-bold border border-red-100">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Master Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-black/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#1D1D1F] hover:bg-black text-white font-bold rounded-2xl transition-all shadow-lg glow-button flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Masuk ke Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
