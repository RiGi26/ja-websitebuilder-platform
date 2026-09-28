import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'
import { getPublicSupabaseKey } from './public-key'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getPublicSupabaseKey()
  )
}
