// ============================================================
// Email sender (Resend) — server-only. NO-OP aman bila RESEND_API_KEY belum diset
// (pola sama fonnte.ts: warn + skip), jadi fitur bisa rilis sebelum domain Resend
// siap; aktif otomatis begitu key ada di Vercel env.
// Docs: https://resend.com/docs/api-reference/emails/send-email
// ============================================================

const RESEND_API = 'https://api.resend.com/emails'

export type EmailResult =
  | { ok: true; id?: string }
  | { ok: false; skipped: true } // RESEND_API_KEY belum ada → inert
  | { ok: false; error: string }

export async function sendEmail(to: string, subject: string, html: string): Promise<EmailResult> {
  const key = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM ?? 'Japan Arena <onboarding@resend.dev>'
  if (!key) {
    console.warn('[email] RESEND_API_KEY belum diset — skip kirim email')
    return { ok: false, skipped: true }
  }
  if (!to || !to.includes('@')) return { ok: false, error: 'invalid_recipient' }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)
  try {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, subject, html }),
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    const data = await res.json().catch(() => ({} as Record<string, unknown>))
    if (!res.ok) {
      console.error('[email] gagal kirim:', { http: res.status, body: data })
      return { ok: false, error: (data as { message?: string })?.message ?? `http_${res.status}` }
    }
    return { ok: true, id: (data as { id?: string })?.id }
  } catch (err) {
    clearTimeout(timeoutId)
    const message = err instanceof Error ? err.message : 'network_error'
    console.error('[email] error:', message)
    return { ok: false, error: message }
  }
}

// Template HTML: login portal customer saat website LIVE (Feature C).
export function portalLoginEmailHtml(args: {
  clientName: string
  loginUrl: string
  email: string
  password: string
  websiteUrl?: string | null
}): string {
  const { clientName, loginUrl, email, password, websiteUrl } = args
  return `<!doctype html><html><body style="margin:0;background:#f5f5f7;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#0f172a">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:520px;background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,.06)">
        <tr><td style="padding:32px 32px 8px">
          <h1 style="margin:0 0 8px;font-size:22px">Website Anda sudah live 🎉</h1>
          <p style="margin:0;color:#64748b;font-size:14px;line-height:1.6">Halo ${clientName}, selamat! Website Anda sudah aktif. Berikut akses untuk mengelola kontennya sendiri kapan saja.</p>
        </td></tr>
        ${websiteUrl ? `<tr><td style="padding:8px 32px"><a href="${websiteUrl}" style="color:#0071E3;font-size:14px;font-weight:600;text-decoration:none">🌐 ${websiteUrl}</a></td></tr>` : ''}
        <tr><td style="padding:16px 32px">
          <div style="background:#f5f5f7;border-radius:16px;padding:18px;font-size:14px">
            <p style="margin:0 0 10px;font-weight:700">Login Dashboard</p>
            <p style="margin:0 0 4px"><strong>URL:</strong> <a href="${loginUrl}" style="color:#0071E3;text-decoration:none">${loginUrl}</a></p>
            <p style="margin:0 0 4px"><strong>Email:</strong> ${email}</p>
            <p style="margin:0"><strong>Password:</strong> ${password}</p>
          </div>
        </td></tr>
        <tr><td style="padding:8px 32px 32px">
          <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6">Demi keamanan, ganti password Anda setelah login pertama. Butuh bantuan? Balas email ini.</p>
        </td></tr>
      </table>
      <p style="margin:16px 0 0;color:#94a3b8;font-size:11px">Japan Arena Studio</p>
    </td></tr>
  </table></body></html>`
}
