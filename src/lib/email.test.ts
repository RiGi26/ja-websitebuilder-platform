import { describe, it, expect } from 'vitest'
import { sendEmail, portalLoginEmailHtml } from './email'

describe('email — sendEmail no-op tanpa RESEND_API_KEY', () => {
  it('skip (inert) bila key belum diset', async () => {
    const prev = process.env.RESEND_API_KEY
    delete process.env.RESEND_API_KEY
    const r = await sendEmail('a@b.com', 'Subjek', '<p>hi</p>')
    expect(r).toEqual({ ok: false, skipped: true })
    if (prev !== undefined) process.env.RESEND_API_KEY = prev
  })
})

describe('email — portalLoginEmailHtml (template murni)', () => {
  const html = portalLoginEmailHtml({
    clientName: 'Budi',
    loginUrl: 'https://x.test/portal/login',
    email: 'budi@toko.com',
    password: 'Abc123xyz',
    websiteUrl: 'https://toko-budi.com',
  })

  it('memuat URL login, email, dan password', () => {
    expect(html).toContain('https://x.test/portal/login')
    expect(html).toContain('budi@toko.com')
    expect(html).toContain('Abc123xyz')
  })

  it('memuat URL website bila diberikan', () => {
    expect(html).toContain('https://toko-budi.com')
  })

  it('menyapa nama klien', () => {
    expect(html).toContain('Budi')
  })

  it('website opsional — tetap valid tanpa websiteUrl', () => {
    const h = portalLoginEmailHtml({
      clientName: 'Sari', loginUrl: 'https://x/portal/login', email: 's@a.com', password: 'p', websiteUrl: null,
    })
    expect(h).toContain('s@a.com')
    expect(h).toContain('<html>')
  })
})
