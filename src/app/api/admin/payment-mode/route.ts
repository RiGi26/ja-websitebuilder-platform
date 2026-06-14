import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'
import {
  getMidtransMode,
  getMidtransKeyStatus,
  setMidtransMode,
  type MidtransMode,
} from '@/lib/platform-midtrans'

async function requireAdmin() {
  const cookieStore = await cookies()
  return verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
}

function clientIp(request: Request): string | null {
  const fwd = request.headers.get('x-forwarded-for')
  return fwd ? fwd.split(',')[0].trim() : request.headers.get('x-real-ip')
}

// GET — mode Midtrans platform aktif + status konfigurasi key per-mode.
export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const mode = await getMidtransMode()
  return NextResponse.json({ mode, keys: getMidtransKeyStatus() })
}

// POST { mode: 'sandbox' | 'production' } — ganti mode pembayaran platform.
// Menolak bila key untuk mode tujuan belum dikonfigurasi (cegah 401 senyap).
export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { mode } = (await request.json()) as { mode?: string }
    if (mode !== 'sandbox' && mode !== 'production') {
      return NextResponse.json({ error: "mode harus 'sandbox' atau 'production'" }, { status: 400 })
    }
    const next = mode as MidtransMode

    const keys = getMidtransKeyStatus()
    if (!keys[next]) {
      return NextResponse.json(
        {
          error:
            `Server key untuk mode '${next}' belum di-set. ` +
            `Tambahkan MIDTRANS_SERVER_KEY_${next.toUpperCase()} di environment lalu redeploy sebelum beralih.`,
        },
        { status: 400 },
      )
    }

    const prev = await getMidtransMode()
    if (prev === next) return NextResponse.json({ mode: next, changed: false, keys })

    await setMidtransMode(next)

    // Audit — perubahan ini menyangkut uang nyata, catat siapa/kapan.
    await supabaseAdmin
      .from('security_events')
      .insert({
        kind: 'midtrans_mode_change',
        ip: clientIp(request),
        detail: { from: prev, to: next },
      })
      .then(({ error }) => {
        if (error) console.error('[admin/payment-mode] audit insert failed:', error.message)
      })

    return NextResponse.json({ mode: next, changed: true, keys })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Gagal mengganti mode pembayaran.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
