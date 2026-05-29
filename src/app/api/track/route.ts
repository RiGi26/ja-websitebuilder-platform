import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

// Server-side order lookup untuk halaman publik (landing search + /track).
// Sebelumnya halaman landing query `orders` langsung via anon client dgn RLS
// `using (true)` → siapa pun dgn anon key bisa dump SELURUH tabel + PII.
// Sekarang read lewat service role di server, hanya field aman yg dikembalikan,
// dan policy anon SELECT pada orders di-drop (lihat supabase/add_hardening.sql).

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Hanya field yg dibutuhkan UI publik. JANGAN expose email, midtrans_order_id,
// delivered_credentials, dp_amount, dll.
const SELECT_FIELDS =
  'id, created_at, status, progress_step, total_estimasi, selected_addons, nomor_wa, nama_usaha, domain'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q) {
    return NextResponse.json({ error: 'missing query' }, { status: 400 })
  }

  // Normalisasi displayId "JA-YYYY-xxxxxxxx" → ambil shortId-nya.
  let probe = q
  const displayMatch = q.match(/^JA-\d{4}-([0-9a-f]{8})$/i)
  if (displayMatch) probe = displayMatch[1]

  try {
    let order = null

    if (UUID_RE.test(probe)) {
      // Full UUID — direct equality.
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select(SELECT_FIELDS)
        .eq('id', probe.toLowerCase())
        .maybeSingle()
      if (error) console.error('[api/track] uuid query:', error.message)
      order = data
    } else if (/^[0-9a-f]{8}$/i.test(probe)) {
      // 8-char shortId — range query (kolom id bertipe uuid, ILIKE tidak valid).
      const prefix = probe.toLowerCase()
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select(SELECT_FIELDS)
        .gte('id', `${prefix}-0000-0000-0000-000000000000`)
        .lte('id', `${prefix}-ffff-ffff-ffff-ffffffffffff`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) console.error('[api/track] range query:', error.message)
      order = data
    } else {
      // Selain itu: anggap nomor WhatsApp.
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select(SELECT_FIELDS)
        .eq('nomor_wa', q)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) console.error('[api/track] wa query:', error.message)
      order = data
    }

    if (!order) {
      return NextResponse.json({ order: null }, { status: 404 })
    }
    return NextResponse.json({ order })
  } catch (err) {
    console.error('[api/track] exception:', err)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
