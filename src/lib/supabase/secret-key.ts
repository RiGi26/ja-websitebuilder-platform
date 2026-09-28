export function getSecretSupabaseKey(): string {
  const key = process.env.SUPABASE_SECRET_KEY

  if (!key?.startsWith('sb_secret_')) {
    throw new Error('SUPABASE_SECRET_KEY must contain a secret key')
  }

  return key
}
