import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function PATCH(request: Request) {
  // 1. Security Check
  const cookieStore = await cookies()
  const isAuth = cookieStore.get('admin_auth')?.value === 'true'
  if (!isAuth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, status, progress_step } = await request.json()
    
    const { error } = await supabaseAdmin
      .from('orders')
      .update({ status, progress_step })
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
