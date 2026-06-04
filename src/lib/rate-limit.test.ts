import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { rateLimit, clientIp } from './rate-limit'

describe('rateLimit (fixed window)', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('mengizinkan sampai limit, lalu menolak', () => {
    const key = `t:${Math.random()}`
    for (let i = 0; i < 5; i++) {
      expect(rateLimit(key, 5, 1000).allowed, `hit ${i + 1}`).toBe(true)
    }
    const blocked = rateLimit(key, 5, 1000)
    expect(blocked.allowed).toBe(false)
    expect(blocked.remaining).toBe(0)
    expect(blocked.retryAfter).toBeGreaterThan(0)
  })

  it('reset setelah window lewat', () => {
    const key = `t:${Math.random()}`
    for (let i = 0; i < 5; i++) rateLimit(key, 5, 1000)
    expect(rateLimit(key, 5, 1000).allowed).toBe(false)
    vi.advanceTimersByTime(1001)
    expect(rateLimit(key, 5, 1000).allowed).toBe(true) // window baru
  })

  it('key berbeda dihitung terpisah', () => {
    const a = `a:${Math.random()}`
    const b = `b:${Math.random()}`
    for (let i = 0; i < 5; i++) rateLimit(a, 5, 1000)
    expect(rateLimit(a, 5, 1000).allowed).toBe(false)
    expect(rateLimit(b, 5, 1000).allowed).toBe(true) // b belum kena
  })
})

describe('clientIp', () => {
  it('ambil IP pertama dari x-forwarded-for', () => {
    const req = new Request('http://x', { headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' } })
    expect(clientIp(req)).toBe('1.2.3.4')
  })
  it('fallback x-real-ip lalu unknown', () => {
    expect(clientIp(new Request('http://x', { headers: { 'x-real-ip': '9.9.9.9' } }))).toBe('9.9.9.9')
    expect(clientIp(new Request('http://x'))).toBe('unknown')
  })
})
