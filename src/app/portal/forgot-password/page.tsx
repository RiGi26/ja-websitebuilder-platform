'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const PRODUCTION_PASSWORD_RESET_URL = 'https://store.webzoka.com/portal/reset-password'

function getPasswordResetRedirectTo() {
  if (process.env.NODE_ENV === 'production') return PRODUCTION_PASSWORD_RESET_URL
  return `${window.location.origin}/portal/reset-password`
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: getPasswordResetRedirectTo(),
      })

      if (resetError) {
        setError(
          resetError.code === 'over_email_send_rate_limit'
            ? 'Batas pengiriman email pemulihan tercapai. Tunggu satu jam, lalu coba lagi.'
            : 'Tautan pemulihan belum bisa diminta. Periksa koneksi, lalu coba lagi.'
        )
        return
      }

      setSent(true)
    } catch {
      setError('Tautan pemulihan belum bisa diminta. Periksa koneksi, lalu coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm">
        <header className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sf-display-heavy text-gray-900 tracking-tight">Lupa kata sandi?</h1>
          <p className="text-sm text-gray-500 mt-3 leading-6">
            Masukkan email akun Portal. Jika terdaftar, instruksi pemulihan akan dikirim.
          </p>
        </header>

        <section className="bg-white rounded-[32px] p-6 sm:p-8 apple-shadow border border-black/[0.03]">
          {sent ? (
            <div role="status" aria-live="polite" className="text-center">
              <CheckCircle2 className="mx-auto text-green-600" size={32} aria-hidden="true" />
              <p className="text-sm text-gray-700 mt-4 leading-6">
                Jika email tersebut terhubung dengan akun Portal, tautan pemulihan akan dikirim. Periksa kotak masuk dan folder spam.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-5 min-h-11 px-4 rounded-full text-sm font-semibold text-[#0071E3] hover:text-[#005BB5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3]"
              >
                Kirim tautan lagi
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div role="alert" className="flex items-start gap-2 bg-red-50 text-red-700 p-4 rounded-2xl text-sm border border-red-100">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="recovery-email" className="block text-sm font-semibold text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} aria-hidden="true" />
                  <input
                    id="recovery-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    placeholder="email@bisnis.com"
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
                {loading ? <Loader2 className="animate-spin" size={18} aria-hidden="true" /> : 'Kirim tautan reset'}
              </button>
            </form>
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
