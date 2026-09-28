import { NextRequest } from 'next/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { proxy } from './proxy'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

function makeRequest(host: string, pathname: string) {
  return new NextRequest(`https://${host}${pathname}`, {
    headers: { host },
  })
}

function rewrittenPath(response: Response) {
  const rewrite = response.headers.get('x-middleware-rewrite')
  return rewrite ? new URL(rewrite).pathname : null
}

describe('proxy host routing', () => {
  it('redirects the Store host root to the canonical Store path', async () => {
    const response = await proxy(makeRequest('store.webzoka.com', '/?utm_source=cutover-test&foo=bar'))

    expect(response.status).toBe(308)
    expect(response.headers.get('location')).toBe(
      'https://store.webzoka.com/store?utm_source=cutover-test&foo=bar',
    )
  })

  it.each(['/store', '/store/template/warm-commerce'])('keeps Store paths unchanged on the Store host: %s', async (pathname) => {
    const response = await proxy(makeRequest('store.webzoka.com', pathname))

    expect(rewrittenPath(response)).toBeNull()
  })

  it('keeps existing reserved subdomains out of tenant rewrites', async () => {
    const response = await proxy(makeRequest('wb.webzoka.com', '/store'))

    expect(rewrittenPath(response)).toBeNull()
  })

  it('rewrites tenant subdomains into their tenant namespace', async () => {
    const response = await proxy(makeRequest('acme.webzoka.com', '/store'))

    expect(rewrittenPath(response)).toBe('/acme/store')
  })

  it('uses only the publishable key header for custom-domain lookup', async () => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://chjgijlwhozeevrvhejt.supabase.co')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'sb_publishable_test')
    const fetchMock = vi.fn(async (_url: string, _options?: RequestInit) =>
      new Response(JSON.stringify([{ slug: 'acme' }]), { status: 200 }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const response = await proxy(makeRequest('example.com', '/'))

    expect(rewrittenPath(response)).toBe('/acme')
    expect(fetchMock).toHaveBeenCalledOnce()
    const options = fetchMock.mock.calls[0][1] as RequestInit
    expect(options.headers).toEqual({ apikey: 'sb_publishable_test' })
  })
})
