import { supabaseAdmin } from '@/lib/supabase-admin'
import Navbar from '@/app/components/Navbar'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import AutoRefresh from './AutoRefresh'
import {
  CheckCircle2,
  Loader2,
  MessageCircle,
  Search,
  ArrowLeft,
  Sparkles,
  Palette,
  Code2,
  Rocket,
  ClipboardList,
  Package,
  XCircle,
  MessageSquareText,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? '6281296917963'

const STEPS = [
  { val: 1, label: 'Briefing', desc: 'Tim review brief & dokumen Anda', icon: ClipboardList },
  { val: 2, label: 'Analysis', desc: 'Konfirmasi kebutuhan & konten', icon: Sparkles },
  { val: 3, label: 'Design', desc: 'Mockup & wireframe disiapkan', icon: Palette },
  { val: 4, label: 'Dev', desc: 'Website sedang dibangun', icon: Code2 },
  { val: 5, label: 'Launch', desc: 'Website live, project selesai', icon: Rocket },
]

const PAYMENT_LABELS: Record<string, { label: string; color: string }> = {
  unpaid: { label: 'Belum Bayar', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  awaiting_payment: { label: 'Menunggu Pembayaran', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  dp_paid: { label: 'DP Terbayar', color: 'bg-green-50 text-green-700 border-green-100' },
  failed: { label: 'Gagal Bayar', color: 'bg-red-50 text-red-700 border-red-100' },
}

const STATUS_LABELS: Record<string, string> = {
  pending_payment: 'Menunggu Pembayaran',
  pending: 'Diproses Tim',
  active: 'Dalam Pengerjaan',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
}

function formatPrice(p: number | null | undefined) {
  if (p == null) return '-'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(p)
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function getOrder(rawId: string) {
  // Customer bisa kirim:
  //  - UUID lengkap (dari callbacks.finish Midtrans → /thank-you?id=<uuid>)
  //  - 8-char shortId (bagian visible dari display ID JA-2025-XXXXXXXX)
  //  - displayId penuh "JA-2025-XXXXXXXX" (kalau diketik manual)
  const cleaned = rawId.trim()
  if (!cleaned) return null

  // Normalisasi: kalau format displayId, ambil bagian shortId-nya
  let probe = cleaned
  const displayMatch = cleaned.match(/^JA-\d{4}-([0-9a-f]{8})$/i)
  if (displayMatch) probe = displayMatch[1]

  try {
    if (UUID_RE.test(probe)) {
      const { data } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('id', probe)
        .maybeSingle()
      return data
    }

    // shortId path — match 8 char prefix UUID
    const { data } = await supabaseAdmin
      .from('orders')
      .select('*')
      .ilike('id', `${probe.toLowerCase()}%`)
      .limit(1)
      .maybeSingle()
    return data
  } catch (err) {
    console.error('[track/getOrder]', err)
    return null
  }
}

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams
  const order = id ? await getOrder(id) : null

  // ── Empty state: tidak ada ?id= → tampilkan form input
  if (!id) {
    return (
      <div className="min-h-screen bg-[#F5F5F7]">
        <Navbar />
        <main className="pt-32 pb-24 px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-[32px] p-10 shadow-sm border border-black/[0.04]">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <Search size={28} className="text-[#0071E3]" />
              </div>
              <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">
                Lacak Project Anda
              </h1>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                Masukkan Order ID Anda untuk melihat progress pengerjaan website.
              </p>

              <form action="/track" method="get" className="space-y-4">
                <input
                  name="id"
                  required
                  placeholder="JA-2025-XXXXXXXX"
                  className="w-full px-5 py-4 rounded-2xl border border-black/10 focus:border-[#0071E3] focus:outline-none text-sm font-medium"
                />
                <button
                  type="submit"
                  className="w-full py-4 bg-[#0071E3] text-white font-bold rounded-2xl hover:bg-blue-600 transition-colors"
                >
                  Cek Progress
                </button>
              </form>

              <p className="text-xs text-gray-400 mt-6 text-center">
                Belum pesan?{' '}
                <Link href="/order" className="text-[#0071E3] font-bold hover:underline">
                  Mulai dari sini
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ── Not found state
  if (!order) {
    return (
      <div className="min-h-screen bg-[#F5F5F7]">
        <Navbar />
        <main className="pt-32 pb-24 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-[32px] p-10 shadow-sm border border-black/[0.04]">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Package size={28} className="text-red-500" />
              </div>
              <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
                Order Tidak Ditemukan
              </h1>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                ID order <span className="font-mono font-bold">{id}</span> tidak cocok dengan data kami.
                Pastikan Order ID Anda benar.
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/track"
                  className="py-3 px-6 bg-[#0071E3] text-white font-bold rounded-2xl hover:bg-blue-600 transition-colors text-sm"
                >
                  Coba ID Lain
                </Link>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
                    `Halo Japan Arena, saya tidak bisa menemukan order saya dengan ID ${id}.`,
                  )}`}
                  target="_blank"
                  className="py-3 px-6 bg-white border border-gray-200 text-gray-900 font-bold rounded-2xl hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <MessageCircle size={14} className="text-green-500" /> Bantuan via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ── Order ditemukan
  const year = new Date(order.created_at).getFullYear()
  const displayId = `JA-${year}-${order.id.slice(0, 8).toUpperCase()}`
  const currentStep: number = order.progress_step ?? 1
  const isCancelled = order.status === 'cancelled'
  const isCompleted = order.status === 'completed'
  const payment =
    PAYMENT_LABELS[order.payment_status as string] ?? PAYMENT_LABELS.unpaid
  const statusLabel = STATUS_LABELS[order.status as string] ?? order.status
  const clientName = order.nama_perusahaan || order.nama_usaha || 'Customer'
  const progressNote: string | null = order.progress_note ?? null
  const lastUpdatedAt: string | null = order.last_updated_at ?? order.created_at
  const relativeTime = lastUpdatedAt
    ? formatDistanceToNow(new Date(lastUpdatedAt), {
        addSuffix: true,
        locale: idLocale,
      })
    : null
  const waMsg = encodeURIComponent(
    `Halo Japan Arena, saya ingin tanya progress order ${displayId}`,
  )

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Navbar />
      <main className="pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Header card */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/[0.04] mb-4">
            <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Order ID
                </p>
                <p className="text-xl font-black text-gray-900 tracking-wide">{displayId}</p>
              </div>
              <span
                className={`px-4 py-1.5 rounded-full text-[11px] font-bold border ${payment.color}`}
              >
                {payment.label}
              </span>
            </div>
            <div className="border-t border-black/[0.04] pt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Nama
                </p>
                <p className="font-bold text-gray-900 truncate">{clientName}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                  Tanggal Order
                </p>
                <p className="font-bold text-gray-900">{formatDate(order.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Progress timeline */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/[0.04] mb-4">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <h2 className="text-lg font-black text-gray-900 tracking-tight">
                Progress Pengerjaan
              </h2>
              {isCancelled ? (
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-red-50 text-red-700 flex items-center gap-1.5">
                  <XCircle size={11} /> Dibatalkan
                </span>
              ) : (
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    isCompleted
                      ? 'bg-green-50 text-green-700'
                      : 'bg-blue-50 text-[#0071E3]'
                  }`}
                >
                  {statusLabel}
                </span>
              )}
            </div>

            {/* Relative timestamp — kapan terakhir admin update */}
            {relativeTime && (
              <p className="text-xs text-gray-400 font-medium mb-5">
                Update terakhir {relativeTime}
              </p>
            )}

            {/* Note dari admin untuk customer */}
            {progressNote && progressNote.trim().length > 0 && (
              <div className="mb-6 bg-blue-50/60 border border-blue-100 rounded-2xl p-4 flex gap-3">
                <div className="shrink-0 w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                  <MessageSquareText size={16} className="text-[#0071E3]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-[#0071E3] uppercase tracking-widest mb-1">
                    Catatan dari Tim
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                    {progressNote}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-0">
              {STEPS.map((s, i) => {
                const Icon = s.icon
                const isDone =
                  (isCompleted && s.val <= 5) ||
                  (!isCancelled && currentStep > s.val)
                const isActive =
                  !isCancelled && !isCompleted && currentStep === s.val
                const isPending = !isDone && !isActive
                const isLast = i === STEPS.length - 1

                return (
                  <div key={s.val} className={`flex gap-4 relative ${isLast ? '' : 'pb-6'}`}>
                    {!isLast && (
                      <div
                        className={`absolute left-[19px] top-10 w-0.5 h-[calc(100%-32px)] ${
                          isDone ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                    <div
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isCancelled && isPending
                          ? 'bg-gray-100 text-gray-300'
                          : isDone
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-[#0071E3] text-white ring-4 ring-blue-100'
                          : 'bg-gray-100 text-gray-300'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 size={20} />
                      ) : isActive ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Icon size={18} />
                      )}
                    </div>
                    <div className="flex-1 pt-1.5">
                      <p
                        className={`font-bold text-sm ${
                          isDone || isActive ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {s.label}
                      </p>
                      <p
                        className={`text-xs leading-relaxed ${
                          isDone || isActive ? 'text-gray-500' : 'text-gray-300'
                        }`}
                      >
                        {s.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Order details */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/[0.04] mb-4">
            <h3 className="text-sm font-black text-gray-900 mb-4 tracking-tight">
              Detail Pesanan
            </h3>
            <div className="space-y-3 text-sm divide-y divide-gray-50">
              <div className="flex justify-between items-center pb-3">
                <span className="text-gray-500">Industri</span>
                <span className="font-bold text-gray-900 capitalize">
                  {order.industri || '-'}
                </span>
              </div>
              {order.template_id && (
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-500">Template</span>
                  <span className="font-bold text-gray-900">{order.template_id}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-500">Total Estimasi</span>
                <span className="font-bold text-gray-900">
                  {formatPrice(order.total_estimasi)}
                </span>
              </div>
              {order.dp_amount != null && (
                <div className="flex justify-between items-center pt-3">
                  <span className="text-gray-500">DP 50%</span>
                  <span className="font-bold text-green-600">
                    {formatPrice(order.dp_amount)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <a
              href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
              target="_blank"
              className="w-full bg-white border border-gray-200 text-gray-900 text-center py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
            >
              <MessageCircle size={16} className="text-green-500" /> Tanya Progress via WhatsApp
            </a>
            <Link
              href="/"
              className="w-full bg-transparent text-gray-500 text-center py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={14} /> Kembali ke Beranda
            </Link>
          </div>

        </div>
      </main>

      {/* Auto-refresh tiap 30 detik supaya update progress dari admin keliahatan tanpa reload manual */}
      <AutoRefresh intervalMs={30000} />
    </div>
  )
}
