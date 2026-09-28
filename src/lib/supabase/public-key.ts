export function getPublicSupabaseKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!key?.startsWith('sb_publishable_')) {
    throw new Error('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must contain a publishable key')
  }

  return key
}
