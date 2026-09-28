import { createClient } from '@supabase/supabase-js'
import { getPublicSupabaseKey } from './supabase/public-key'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = getPublicSupabaseKey()

export const supabase = createClient(supabaseUrl, supabaseKey)
