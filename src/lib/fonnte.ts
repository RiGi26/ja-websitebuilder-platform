// Fonnte WhatsApp gateway client
// Docs: https://docs.fonnte.com/

const FONNTE_API = 'https://api.fonnte.com/send'

// Normalisasi nomor WA Indonesia → format 62XXX (tanpa +, tanpa spasi, tanpa 0 di depan)
// Mendukung input "0812...", "+62812...", "62812...", "0812-3456-7890" dll.
export function normalizeWa(phone: string): string {
  let cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('0')) cleaned = '62' + cleaned.substring(1)
  if (!cleaned.startsWith('62')) cleaned = '62' + cleaned
  return cleaned
}

export type FonnteResult = { ok: true; id?: string } | { ok: false; error: string }

export async function sendWhatsApp(target: string, message: string): Promise<FonnteResult> {
  const token = process.env.FONNTE_TOKEN
  if (!token) {
    console.warn('[fonnte] FONNTE_TOKEN tidak diset — skip kirim WA')
    return { ok: false, error: 'no_token' }
  }

  const phone = normalizeWa(target)
  if (!phone || phone.length < 10) {
    console.warn('[fonnte] nomor WA invalid:', target)
    return { ok: false, error: 'invalid_phone' }
  }

  // x-www-form-urlencoded lebih reliable di Vercel/undici dibanding FormData
  const body = new URLSearchParams({ target: phone, message })

  // 15s timeout supaya tidak hang ke API function timeout limit
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)

  try {
    const res = await fetch(FONNTE_API, {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    const text = await res.text()
    let data: any = {}
    try { data = JSON.parse(text) } catch { /* keep text */ }

    // Fonnte returns { status: true/false, reason: "...", id: [...] }
    if (!res.ok || data.status === false) {
      console.error('[fonnte] gagal kirim:', {
        http: res.status,
        reason: data?.reason ?? res.statusText,
        body: data,
        raw: data && Object.keys(data).length === 0 ? text.slice(0, 300) : undefined,
      })
      return { ok: false, error: data?.reason ?? `http_${res.status}` }
    }
    return { ok: true, id: Array.isArray(data.id) ? data.id[0] : data.id }
  } catch (err: any) {
    clearTimeout(timeoutId)
    // err.cause sering berisi root cause network error (ENOTFOUND/ECONNREFUSED/ETIMEDOUT)
    console.error('[fonnte] error:', JSON.stringify({
      name: err?.name,
      message: err?.message,
      cause_code: err?.cause?.code,
      cause_msg: err?.cause?.message,
      cause_errno: err?.cause?.errno,
    }))
    return { ok: false, error: err?.message ?? 'network_error' }
  }
}

// ── Template pesan per step transition ──────────────────────────────────────
type NotifContext = {
  clientName: string
  displayId: string
  trackUrl: string
  note?: string | null
  deliveredUrl?: string | null
  deliveredCredentials?: string | null
  briefingUrl?: string | null
  industri?: string | null
  adminUrl?: string | null
  paymentUrl?: string | null
}

const STEP_TEMPLATES: Record<number, (ctx: NotifContext) => string> = {
  2: (c) => [
    `Halo ${c.clientName}! 👋`,
    ``,
    `Project Anda *${c.displayId}* naik ke step *Analysis*. Tim sedang review brief & menyiapkan dokumen kebutuhan.`,
    c.note ? `\nCatatan tim:\n${c.note}` : '',
    `\nLacak progress: ${c.trackUrl}`,
  ].filter(Boolean).join('\n'),

  3: (c) => [
    `Update Project ${c.displayId} 🎨`,
    ``,
    `Mockup desain sedang dikerjakan! Tim akan kirim preview saat siap untuk review.`,
    c.note ? `\nCatatan tim:\n${c.note}` : '',
    `\nLacak progress: ${c.trackUrl}`,
  ].filter(Boolean).join('\n'),

  4: (c) => [
    `Update Project ${c.displayId} ⚙️`,
    ``,
    `Desain di-approve, coding dimulai! 🚀`,
    c.note ? `\nCatatan tim:\n${c.note}` : '',
    `\nLacak progress: ${c.trackUrl}`,
  ].filter(Boolean).join('\n'),
}

function launchTemplate(c: NotifContext): string {
  const lines = [
    `🎉 *Website Anda LIVE!*`,
    ``,
    `Selamat ${c.clientName}, project *${c.displayId}* sudah selesai dan siap diakses.`,
  ]
  if (c.deliveredUrl) {
    lines.push('', `🌐 ${c.deliveredUrl}`)
  }
  if (c.deliveredCredentials) {
    lines.push('', `🔐 Detail akses:`, c.deliveredCredentials)
  }
  if (c.note) {
    lines.push('', `Catatan tim:`, c.note)
  }
  lines.push('', `Lacak: ${c.trackUrl}`)
  lines.push('', `Mohon review dalam 3×24 jam. Revisi & pertanyaan bisa langsung reply pesan ini. Terima kasih telah mempercayai Japan Arena! 🙏`)
  return lines.join('\n')
}

function cancelledTemplate(c: NotifContext): string {
  return [
    `Halo ${c.clientName},`,
    ``,
    `Project *${c.displayId}* telah dibatalkan.`,
    c.note ? `\nAlasan:\n${c.note}` : '',
    `\nUntuk informasi lebih lanjut termasuk refund DP, silakan reply pesan ini.`,
  ].filter(Boolean).join('\n')
}

// ── Public API: kirim notifikasi berdasarkan event ──────────────────────────
export type NotifyEvent =
  | { type: 'step'; step: 2 | 3 | 4 }
  | { type: 'launch' }
  | { type: 'cancelled' }
  | { type: 'dp_confirmed' }
  | { type: 'briefing_received' }
  | { type: 'order_created' }
  | { type: 'briefing_submitted' }
  | { type: 'payment_lunas' }

function paymentLunasTemplate(c: NotifContext): string {
  return [
    `Halo ${c.clientName}! 🎉`,
    ``,
    `Pembayaran lunas untuk project *${c.displayId}* sudah kami terima.`,
    ``,
    `Website Anda sepenuhnya aktif dan siap digunakan.`,
    c.deliveredUrl ? `\n🌐 ${c.deliveredUrl}` : '',
    ``,
    `Terima kasih telah mempercayai Japan Arena Studio!`,
    `Untuk pertanyaan atau bantuan, balas pesan ini. 🙏`,
  ].filter(Boolean).join('\n')
}

function briefingSubmittedTemplate(c: NotifContext): string {
  return [
    `Halo ${c.clientName}! 🎉`,
    ``,
    `Briefing website Anda *${c.displayId}* sudah kami terima!`,
    ``,
    `Tim kami akan segera mulai membangun website Anda.`,
    `Estimasi: *3–5 hari kerja* setelah briefing diterima.`,
    ``,
    `📍 Pantau progress kapan saja:`,
    c.trackUrl,
    ``,
    `Ada pertanyaan? Balas pesan ini 🙌`,
  ].join('\n')
}

function orderCreatedTemplate(c: NotifContext): string {
  return [
    `Halo ${c.clientName}! 👋`,
    ``,
    `Pesanan website Anda berhasil dibuat di Japan Arena Studio.`,
    ``,
    `📋 *Order ID: ${c.displayId}*`,
    `Simpan ID ini — gunakan untuk cek progress kapan saja.`,
    ``,
    `💳 Lanjutkan pembayaran:`,
    c.paymentUrl ?? '-',
    ``,
    `📍 Lacak progress:`,
    c.trackUrl,
    ``,
    `Ada pertanyaan? Balas pesan ini. Tim kami siap membantu 🚀`,
  ].join('\n')
}

function dpConfirmedTemplate(c: NotifContext): string {
  return [
    `Halo ${c.clientName}! 👋`,
    ``,
    `DP project *${c.displayId}* sudah kami terima. Terima kasih!`,
    ``,
    `Satu langkah lagi — mohon isi *Form Briefing Website* Anda:`,
    `📋 ${c.briefingUrl ?? c.trackUrl}`,
    ``,
    `Form ini ~5–10 menit. Makin detail, makin akurat website Anda!`,
    ``,
    `Lacak progress: ${c.trackUrl}`,
  ].join('\n')
}

function briefingReceivedTemplate(c: NotifContext): string {
  return [
    `📋 *Briefing baru masuk!*`,
    ``,
    `Dari: *${c.clientName}*`,
    `Industri: ${c.industri ?? '-'}`,
    `Order: ${c.displayId}`,
    ``,
    `Buka admin: ${c.adminUrl ?? 'https://ja-websitebuilder-platform-nfoa.vercel.app/admin'}`,
  ].join('\n')
}

export async function notifyCustomer(
  event: NotifyEvent,
  phone: string,
  ctx: NotifContext,
): Promise<FonnteResult> {
  let message: string
  switch (event.type) {
    case 'step':
      message = STEP_TEMPLATES[event.step](ctx)
      break
    case 'launch':
      message = launchTemplate(ctx)
      break
    case 'cancelled':
      message = cancelledTemplate(ctx)
      break
    case 'dp_confirmed':
      message = dpConfirmedTemplate(ctx)
      break
    case 'briefing_received':
      message = briefingReceivedTemplate(ctx)
      break
    case 'order_created':
      message = orderCreatedTemplate(ctx)
      break
    case 'briefing_submitted':
      message = briefingSubmittedTemplate(ctx)
      break
    case 'payment_lunas':
      message = paymentLunasTemplate(ctx)
      break
  }
  return sendWhatsApp(phone, message)
}
