'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const RECOVERY_SESSION_KEY = 'websitebuilder:portal-password-recovery'

type PageState = 'loading' | 'ready' | 'invalid' | 'success'

export default function ResetPasswordPage() {
  const [pageState, setPageState] = useState<PageState>('loading')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()
    let active = true
    const search = new URLSearchParams(window.location.search)
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const hasRecoveryError = search.has('error_code') || hash.has('error_code')

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return
      if (event === 'PASSWORD_RECOVERY' && session) {
        window.sessionStorage.setItem(RECOVERY_SESSION_KEY, '1')
        setPageState('ready')
      } else if (event === 'SIGNED_OUT') {
        window.sessionStorage.removeItem(RECOVERY_SESSION_KEY)
        setPageState('invalid')
      }
    })

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return
      if (hasRecoveryError) {
        window.sessionStorage.removeItem(RECOVERY_SESSION_KEY)
        setPageState('invalid')
        return
      }
      const hasPendingRecovery = window.sessionStorage.getItem(RECOVERY_SESSION_KEY) === '1'
      setPageState(session && hasPendingRecovery ? 'ready' : 'invalid')
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi belum sama.')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) {
        setError('Kata sandi belum bisa diperbarui. Periksa aturan kata sandi, lalu coba lagi.')
        return
      }

      window.sessionStorage.removeItem(RECOVERY_SESSION_KEY)
      setPageState('success')
      setPassword('')
      setConfirmPassword('')
    } catch {
      setError('Kata sandi belum bisa diperbarui. Periksa koneksi, lalu coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm">
        <header className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sf-display-heavy text-gray-900 tracking-tight">
            {pageState === 'success' ? 'Kata sandi diperbarui' : 'Buat kata sandi baru'}
          </h1>
          <p className="text-sm text-gray-500 mt-3 leading-6">
            {pageState === 'success'
              ? 'Kata sandi akun Portal Anda sudah diperbarui.'
              : 'Gunakan kata sandi baru untuk akun Portal Anda.'}
          </p>
        </header>

        <section className="bg-white rounded-[32px] p-6 sm:p-8 apple-shadow border border-black/[0.03]">
          {pageState === 'loading' ? (
            <div role="status" aria-live="polite" className="flex min-h-32 items-center justify-center text-sm text-gray-600">
              <Loader2 className="mr-2 animate-spin text-[#0071E3]" size={18} aria-hidden="true" />
              Memeriksa tautan pemulihan…
            </div>
          ) : pageState === 'ready' ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div role="alert" className="flex items-start gap-2 bg-red-50 text-red-700 p-4 rounded-2xl text-sm border border-red-100">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="new-password" className="block text-sm font-semibold text-gray-700">Kata sandi baru</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
                  <input
                    id="new-password"
                    type="password"
                    name="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    required
                    className="w-full min-h-12 pl-11 pr-4 text-base bg-gray-50 border border-black/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700">Ulangi kata sandi baru</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
                  <input
                    id="confirm-password"
                    type="password"
                    name="confirm-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="new-password"
                    required
                    className="w-full min-h-12 pl-11 pr-4 text-base bg-gray-50 border border-black/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-14 px-5 bg-[#0071E3] hover:bg-[#005BB5] text-white text-base font-bold rounded-2xl transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3]"
              >
                {loading ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : 'Simpan kata sandi baru'}
              </button>
            </form>
          ) : pageState === 'success' ? (
            <div role="status" aria-live="polite" className="text-center">
              <CheckCircle2 className="mx-auto text-green-600" size={32} aria-hidden="true" />
              <Link href="/portal" className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[#0071E3] px-5 text-base font-bold text-white hover:bg-[#005BB5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3]">
                Masuk ke Portal
              </Link>
            </div>
          ) : (
            <div role="status" aria-live="polite" className="text-center">
              <AlertCircle className="mx-auto text-amber-600" size={30} aria-hidden="true" />
              <p className="mt-4 text-sm leading-6 text-gray-700">
                Tautan pemulihan sudah kedaluwarsa atau tidak valid. Minta tautan baru untuk melanjutkan.
              </p>
              <Link href="/portal/forgot-password" className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[#0071E3] px-5 text-base font-bold text-white hover:bg-[#005BB5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3]">
                Minta tautan baru
              </Link>
            </div>
          )}
        </section>

        <Link href="/portal/login" className="mx-auto mt-4 inline-flex min-h-11 items-center justify-center gap-2 px-3 text-sm font-semibold text-gray-600 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3]">
          <ArrowLeft size={16} aria-hidden="true" />
          Kembali ke login
        </Link>
      </div>
    </main>
  )
}
