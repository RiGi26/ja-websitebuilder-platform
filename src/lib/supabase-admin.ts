import { createClient } from '@supabase/supabase-js'
import { getSecretSupabaseKey } from './supabase/secret-key'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const secretKey = getSecretSupabaseKey()

export const supabaseAdmin = createClient(supabaseUrl, secretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
