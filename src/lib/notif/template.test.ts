import { describe, it, expect } from 'vitest'
import { validateTemplate, renderTemplate, NOTIF_EVENTS, type NotifVars } from './template'

const vars: NotifVars = {
  nama: 'Budi',
  bisnis: 'Bakso Tini',
  kode: 'BT-2606-0042',
  items: 'Bakso Campur ×2, Es Teh ×1',
  total: '¥1.800',
  bayar: 'Transfer Bank',
  lacak: 'https://x/lacak/abc',
  alamat: 'Shibuya 1-2-3',
  catatan: 'pedas',
  tanggal: '2026-06-25',
}

describe('validateTemplate (gerbang save)', () => {
  it('terima template valid', () => {
    expect(validateTemplate('order_receipt', 'Halo {nama}, order {kode} total {total}').ok).toBe(true)
  })
  it('tolak placeholder tak dikenal', () => {
    const r = validateTemplate('order_receipt', 'Halo {namaa} {kode}')
    expect(r.ok).toBe(false)
    expect(r.errors.join(' ')).toMatch(/namaa/)
  })
  it('tolak placeholder wajib hilang ({kode} di struk)', () => {
    expect(validateTemplate('order_receipt', 'Halo {nama} apa kabar').ok).toBe(false)
  })
  it('tolak template kosong', () => {
    expect(validateTemplate('order_receipt', '   ').ok).toBe(false)
  })
  it('tolak kurawal tak seimbang', () => {
    expect(validateTemplate('order_receipt', 'Halo {nama {kode}').ok).toBe(false)
  })
  it('tolak kepanjangan', () => {
    expect(validateTemplate('order_admin', 'x'.repeat(5000)).ok).toBe(false)
  })
  it('admin tak mewajibkan {kode}', () => {
    expect(validateTemplate('order_admin', 'Ada order baru dari {nama}').ok).toBe(true)
  })
  it('warning lembut bila {total} absen di struk (tetap ok)', () => {
    const r = validateTemplate('order_receipt', 'Order {kode} diterima ya {nama}')
    expect(r.ok).toBe(true)
    expect(r.warnings.length).toBeGreaterThan(0)
  })
})

describe('renderTemplate — anti-rusak', () => {
  it('render template tenant normal', () => {
    const out = renderTemplate('order_receipt', 'Halo {nama}, order {kode}: {items} = {total}', vars)
    expect(out).toBe('Halo Budi, order BT-2606-0042: Bakso Campur ×2, Es Teh ×1 = ¥1.800')
  })

  it('drop baris placeholder opsional yang kosong (alamat/catatan)', () => {
    const v2: NotifVars = { ...vars, alamat: null, catatan: '' }
    const out = renderTemplate('order_admin', '👤 {nama}\n📍 {alamat}\n📝 {catatan}\n✅ selesai', v2)
    expect(out).toContain('👤 Budi')
    expect(out).not.toContain('📍') // baris alamat kosong → terbuang utuh
    expect(out).not.toContain('📝') // baris catatan kosong → terbuang utuh
    expect(out).toContain('✅ selesai')
  })

  it('template kosong → fallback default (tetap koheren, ada kode + bisnis)', () => {
    const out = renderTemplate('order_receipt', '', vars)
    expect(out).toContain('BT-2606-0042')
    expect(out).toContain('Bakso Tini')
  })

  it('template invalid (unknown + malformed) → fallback default, tak kirim sampah', () => {
    const out = renderTemplate('order_receipt', 'rusak {xyz} {kode', vars)
    expect(out).not.toMatch(/\{/) // tak ada kurawal bocor
    expect(out).toContain('BT-2606-0042') // default terpakai
  })

  it('output TAK PERNAH mengandung placeholder mentah', () => {
    const out = renderTemplate('order_admin', '{nama} {kode} {items} {total} {bayar} {lacak} {alamat} {catatan} {tanggal}', vars)
    expect(out).not.toMatch(/\{[a-z]+\}/)
  })

  it('default + semua field opsional kosong → baris inti tetap utuh', () => {
    const sparse: NotifVars = { ...vars, alamat: null, catatan: null, tanggal: null }
    const out = renderTemplate('order_receipt', NOTIF_EVENTS.order_receipt.default, sparse)
    expect(out).toContain('BT-2606-0042')
    expect(out).toContain('Total: *¥1.800*')
    expect(out).not.toContain('📍') // baris alamat kosong terbuang
  })

  it('kompres baris kosong beruntun', () => {
    const out = renderTemplate('order_admin', 'A {kode}\n\n\n\nB selesai', vars)
    expect(out).not.toMatch(/\n{3,}/)
  })
})
