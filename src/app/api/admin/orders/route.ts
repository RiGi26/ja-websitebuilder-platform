import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function PATCH(request: Request) {
  // 1. Security Check
  const cookieStore = await cookies()
  const isAuth = cookieStore.get('admin_auth')?.value === 'true'
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, status, progress_step, progress_note } = await request.json()

    const payload: Record<string, unknown> = {
      status,
      progress_step,
      last_updated_at: new Date().toISOString(),
    }
    // progress_note opsional — hanya kirim kalau key-nya ada di request body
    if (progress_note !== undefined) {
      payload.progress_note = progress_note
    }

    const { error } = await supabaseAdmin
      .from('orders')
      .update(payload)
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
