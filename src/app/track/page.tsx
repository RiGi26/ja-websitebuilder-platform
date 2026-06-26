import { supabaseAdmin } from '@/lib/supabase-admin'
import Navbar from '@/app/components/Navbar'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import AutoRefresh from './AutoRefresh'
import RetryPaymentButton from './RetryPaymentButton'
import PelunasanButton from './PelunasanButton'
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
  ExternalLink,
  KeyRound,
  PartyPopper,
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
  lunas: { label: 'Lunas ✓', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
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
    // Path 1: full UUID — direct equality
    if (UUID_RE.test(probe)) {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('id', probe.toLowerCase())
        .maybeSingle()
      if (error) console.error('[track/getOrder] UUID query error:', error.message)
      return data
    }

    // Path 2: 8-char shortId — range query
    // Kenapa range, bukan ILIKE: kolom `id` bertipe `uuid`. PostgreSQL tidak
    // punya operator `uuid ~~* text`, jadi `.ilike()` selalu error silent.
    // Range comparison di-cast otomatis oleh PostgreSQL dan cocok untuk prefix.
    if (/^[0-9a-f]{8}$/i.test(probe)) {
      const prefix = probe.toLowerCase()
      const minUuid = `${prefix}-0000-0000-0000-000000000000`
      const maxUuid = `${prefix}-ffff-ffff-ffff-ffffffffffff`
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .gte('id', minUuid)
        .lte('id', maxUuid)
        .limit(1)
        .maybeSingle()
      if (error) console.error('[track/getOrder] range query error:', error.message)
      return data
    }

    // Format tidak dikenal
    return null
  } catch (err) {
    console.error('[track/getOrder] exception:', err)
    return null
  }
}

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; token?: string }>
}) {
  const { id, token } = await searchParams
  const order = id ? await getOrder(id) : null

  // IDOR hardening (audit 2026-06-13): /track dapat diakses lewat prefix order-id
  // 8-char yang mudah ditebak (dan ditampilkan publik). RAHASIA — delivered_
  // credentials (login situs) & tracking_token (kunci briefing) — TIDAK boleh
  // bocor ke request ber-id saja. Tampilkan hanya bila request membawa
  // tracking_token yang cocok (link WA pelanggan membawanya). Status/progress
  // tetap bisa dilihat lewat id.
  if (order) {
    let revealSecrets = false
    if (token) {
      const { data: match } = await supabaseAdmin
        .from('orders')
        .select('id')
        .eq('id', order.id)
        .eq('tracking_token', token)
        .maybeSingle()
      revealSecrets = !!match
    }
    if (!revealSecrets) {
      ;(order as Record<string, unknown>).delivered_credentials = null
      ;(order as Record<string, unknown>).tracking_token = null
    }
  }

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
                    `Halo Webzoka, saya tidak bisa menemukan order saya dengan ID ${id}.`,
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
  const deliveredUrl: string | null = order.delivered_url ?? null
  const deliveredCredentials: string | null = order.delivered_credentials ?? null
  const lastUpdatedAt: string | null = order.last_updated_at ?? order.created_at
  const relativeTime = lastUpdatedAt
    ? formatDistanceToNow(new Date(lastUpdatedAt), {
        addSuffix: true,
        locale: idLocale,
      })
    : null
  const waMsg = encodeURIComponent(
    `Halo Webzoka, saya ingin tanya progress order ${displayId}`,
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
            <div className="border-t border-black/[0.04] pt-4 grid grid-cols-2 gap-3 text-sm">
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

          {/* Banner Retry — muncul saat gagal bayar */}
          {order.payment_status === 'failed' && (
            <div className="bg-red-50 border border-red-200 rounded-[24px] p-6 mb-4">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center shrink-0 text-2xl">
                  ❌
                </div>
                <div>
                  <p className="font-black text-red-900 text-base leading-tight">Pembayaran Gagal</p>
                  <p className="text-red-700 text-sm font-medium mt-0.5">
                    Transaksi tidak berhasil. Coba lagi dengan metode pembayaran yang sama atau berbeda.
                  </p>
                </div>
              </div>
              <RetryPaymentButton orderId={order.id} />
            </div>
          )}

          {/* Banner Sudah Bayar — muncul saat unpaid, bantu customer konfirmasi */}
          {order.payment_status === 'unpaid' && (
            <div className="bg-amber-50 border border-amber-200 rounded-[24px] p-6 mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0 text-2xl">
                💳
              </div>
              <div className="flex-1">
                <p className="font-black text-amber-900 text-base leading-tight">Sudah Selesai Bayar?</p>
                <p className="text-amber-800 text-sm font-medium mt-0.5">
                  Konfirmasi ke tim kami via WhatsApp dengan menyebutkan Order ID <span className="font-black">{displayId}</span>. Status akan diupdate dalam 1×24 jam.
                </p>
              </div>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(`Halo Webzoka, saya sudah bayar untuk order ${displayId}. Mohon dikonfirmasi. Terima kasih.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 bg-amber-600 text-white font-black text-xs px-5 py-3 rounded-full hover:bg-amber-700 transition-colors whitespace-nowrap"
              >
                Konfirmasi Bayar →
              </a>
            </div>
          )}

          {/* Banner Briefing — muncul saat dp_paid + belum submit briefing */}
          {order.payment_status === 'dp_paid' && !(order as any).briefing_submitted_at && (order as any).tracking_token && (
            <div className="bg-amber-400 rounded-[24px] p-6 mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-10 h-10 bg-amber-900/20 rounded-2xl flex items-center justify-center shrink-0 text-amber-900 text-xl">
                📋
              </div>
              <div className="flex-1">
                <p className="font-black text-amber-950 text-base leading-tight">Satu Langkah Lagi!</p>
                <p className="text-amber-900 text-sm font-medium mt-0.5">
                  DP sudah diterima. Isi Form Briefing agar tim kami bisa segera membangun website Anda.
                </p>
              </div>
              <a
                href={`/order/briefing/${(order as any).tracking_token}`}
                className="shrink-0 bg-amber-950 text-amber-50 font-black text-xs px-5 py-3 rounded-full hover:bg-amber-800 transition-colors whitespace-nowrap"
              >
                Isi Form Briefing →
              </a>
            </div>
          )}

          {/* Banner Tahap 2 — muncul saat briefing done + website sudah draft/published, tapi detail belum */}
          {(order as any).briefing_submitted_at &&
           !(order as any).briefing_data?.tahap_2 &&
           (order as any).tracking_token &&
           ['pending','active','completed'].includes(order.status as string) && (
            <div className="bg-blue-50 border border-blue-100 rounded-[24px] p-6 mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0 text-blue-600 text-xl">
                🖼️
              </div>
              <div className="flex-1">
                <p className="font-black text-blue-900 text-base leading-tight">Lengkapi Website Anda</p>
                <p className="text-blue-700 text-sm font-medium mt-0.5">
                  Tambahkan foto asli dan testimoni nyata agar website lebih menarik dan terpercaya.
                </p>
              </div>
              <a
                href={`/order/briefing/${(order as any).tracking_token}/detail`}
                className="shrink-0 bg-[#0071E3] text-white font-black text-xs px-5 py-3 rounded-full hover:bg-blue-600 transition-colors whitespace-nowrap"
              >
                Lengkapi Detail →
              </a>
            </div>
          )}

          {/* Hero: Website Live — muncul saat admin sudah isi delivered_url */}
          {deliveredUrl && (
            <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-[32px] p-8 shadow-lg mb-4 text-white">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <PartyPopper size={20} />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white/80">
                    Website Live
                  </p>
                </div>
                <h2 className="text-2xl font-black tracking-tight mb-1">
                  Website Anda Sudah Siap! 🎉
                </h2>
                <p className="text-sm text-white/80 mb-5">
                  Klik tombol di bawah untuk membuka website Anda.
                </p>

                <a
                  href={deliveredUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-green-700 font-bold text-sm px-5 py-3 rounded-2xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all break-all max-w-full"
                >
                  <ExternalLink size={16} className="shrink-0" />
                  <span className="truncate">{deliveredUrl}</span>
                </a>

                {deliveredCredentials && (
                  <div className="mt-5 bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <KeyRound size={14} className="text-white/80" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                        Detail Akses
                      </p>
                    </div>
                    <p className="text-xs text-white whitespace-pre-wrap break-words font-mono leading-relaxed">
                      {deliveredCredentials}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Banner Pelunasan — muncul saat dp_paid + website sudah live + bukan order lunas */}
          {order.payment_status === 'dp_paid' &&
           deliveredUrl &&
           Number(order.dp_amount) < Number(order.total_estimasi) && (
            <div className="bg-blue-50 border border-blue-200 rounded-[24px] p-6 mb-4">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0 text-2xl">
                  💳
                </div>
                <div className="flex-1">
                  <p className="font-black text-blue-900 text-base leading-tight">Satu Langkah Lagi — Lunasi Pembayaran</p>
                  <p className="text-blue-700 text-sm font-medium mt-0.5">
                    Website Anda sudah live! Selesaikan pelunasan untuk mengaktifkan domain dan akses penuh.
                  </p>
                  <p className="text-blue-600 text-sm font-black mt-1.5">
                    Sisa: {formatPrice(Number(order.total_estimasi) - Number(order.dp_amount))}
                  </p>
                </div>
              </div>
              <PelunasanButton orderId={order.id} />
            </div>
          )}

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
                  <span className="text-gray-500">
                    {order.dp_amount === order.total_estimasi ? 'Dibayar Lunas' : 'DP 50%'}
                  </span>
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
