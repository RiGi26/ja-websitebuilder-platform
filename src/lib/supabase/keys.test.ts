import { afterEach, describe, expect, it, vi } from 'vitest'
import { getPublicSupabaseKey } from './public-key'
import { getSecretSupabaseKey } from './secret-key'

afterEach(() => vi.unstubAllEnvs())

describe('Supabase API key selection', () => {
  it('selects the modern publishable key, not the legacy anon key', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'sb_publishable_test')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'legacy-anon')

    expect(getPublicSupabaseKey()).toBe('sb_publishable_test')
  })

  it('rejects a missing or legacy-form public key', () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', '')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'legacy-anon')
    expect(getPublicSupabaseKey).toThrow(/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/)

    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'legacy-anon')
    expect(getPublicSupabaseKey).toThrow(/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/)
  })

  it('selects the modern secret key, not the legacy service role key', () => {
    vi.stubEnv('SUPABASE_SECRET_KEY', 'sb_secret_test')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'legacy-service-role')

    expect(getSecretSupabaseKey()).toBe('sb_secret_test')
  })

  it('fails closed when the modern server secret is missing or invalid', () => {
    vi.stubEnv('SUPABASE_SECRET_KEY', '')
    vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'legacy-service-role')
    expect(getSecretSupabaseKey).toThrow(/SUPABASE_SECRET_KEY/)

    vi.stubEnv('SUPABASE_SECRET_KEY', 'legacy-service-role')
    expect(getSecretSupabaseKey).toThrow(/SUPABASE_SECRET_KEY/)
  })
})
