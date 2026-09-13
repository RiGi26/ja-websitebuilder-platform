import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import { proxy } from './proxy'

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
})
