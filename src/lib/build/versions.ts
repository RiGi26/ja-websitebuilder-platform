// ============================================================
// F5-2 — Rollback/versi. Snapshot konten halaman ke page_versions
// (JSON) sebelum rebuild/publish, lalu restore kalau hasil salah.
// Service-role-only (dipanggil dari API admin). Jangan pakai anon.
// ============================================================
import type { SupabaseClient } from '@supabase/supabase-js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = SupabaseClient<any>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>

// Tabel add-on yang ikut di-snapshot (wipe+insert per page saat restore).
const ADDON_TABLES = ['page_sections', 'services', 'menu_items', 'products', 'gallery_images'] as const
// Kolom yang dibiarkan DB regenerate saat restore (jangan ditulis balik).
const VOLATILE = new Set(['created_at', 'updated_at'])

// Berapa versi maksimum disimpan per page (sisanya dipangkas, tertua dulu).
const MAX_VERSIONS_PER_PAGE = 15

export interface PageSnapshot {
  data_konten: unknown
  konfigurasi: unknown
  status: string
  page_sections: Row[]
  services: Row[]
  menu_items: Row[]
  products: Row[]
  gallery_images: Row[]
  tenant_profile: Row | null
}

export interface VersionMeta {
  id: string
  label: string | null
  kind: string
  created_at: string
  nSections: number
}

// Baca state penuh halaman jadi 1 objek snapshot.
async function readSnapshot(client: Client, pageId: string): Promise<PageSnapshot> {
  const { data: page, error: pageErr } = await client
    .from('landing_pages')
    .select('data_konten, konfigurasi, status')
    .eq('id', pageId)
    .single()
  if (pageErr) throw new Error(`readSnapshot landing_pages: ${pageErr.message}`)

  const out: Record<string, Row[]> = {}
  for (const t of ADDON_TABLES) {
    const { data, error } = await client.from(t).select('*').eq('page_id', pageId)
    if (error) throw new Error(`readSnapshot ${t}: ${error.message}`)
    out[t] = (data ?? []) as Row[]
  }

  const { data: profile, error: profErr } = await client
    .from('tenant_profile')
    .select('*')
    .eq('page_id', pageId)
    .maybeSingle()
  if (profErr) throw new Error(`readSnapshot tenant_profile: ${profErr.message}`)

  return {
    data_konten: page.data_konten,
    konfigurasi: page.konfigurasi,
    status: page.status,
    page_sections: out.page_sections,
    services: out.services,
    menu_items: out.menu_items,
    products: out.products,
    gallery_images: out.gallery_images,
    tenant_profile: (profile ?? null) as Row | null,
  }
}

// Simpan versi baru dari state SAAT INI. Skip kalau halaman masih kosong
// (tidak ada section) — tidak ada yang berharga untuk dikembalikan.
export async function snapshotPage(
  client: Client,
  opts: { pageId: string; tenantId: string; label?: string; kind?: string; force?: boolean },
): Promise<{ id: string } | null> {
  const snapshot = await readSnapshot(client, opts.pageId)
  if (!opts.force && snapshot.page_sections.length === 0) return null

  const { data, error } = await client
    .from('page_versions')
    .insert({
      page_id: opts.pageId,
      tenant_id: opts.tenantId,
      label: opts.label ?? null,
      kind: opts.kind ?? 'manual',
      snapshot,
    })
    .select('id')
    .single()
  if (error) throw new Error(`snapshotPage insert: ${error.message}`)

  await pruneVersions(client, opts.pageId)
  return { id: data.id as string }
}

// Pangkas versi lama, sisakan MAX_VERSIONS_PER_PAGE terbaru.
async function pruneVersions(client: Client, pageId: string): Promise<void> {
  const { data, error } = await client
    .from('page_versions')
    .select('id')
    .eq('page_id', pageId)
    .order('created_at', { ascending: false })
    .range(MAX_VERSIONS_PER_PAGE, MAX_VERSIONS_PER_PAGE + 999)
  if (error) throw new Error(`pruneVersions select: ${error.message}`)
  const ids = (data ?? []).map((r: Row) => r.id)
  if (ids.length === 0) return
  const { error: delErr } = await client.from('page_versions').delete().in('id', ids)
  if (delErr) throw new Error(`pruneVersions delete: ${delErr.message}`)
}

// Daftar versi (metadata ringkas, tanpa payload snapshot penuh) untuk UI.
export async function listPageVersions(client: Client, pageId: string): Promise<VersionMeta[]> {
  const { data, error } = await client
    .from('page_versions')
    .select('id, label, kind, created_at, snapshot')
    .eq('page_id', pageId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(`listPageVersions: ${error.message}`)
  return (data ?? []).map((r: Row) => ({
    id: r.id,
    label: r.label,
    kind: r.kind,
    created_at: r.created_at,
    nSections: Array.isArray(r.snapshot?.page_sections) ? r.snapshot.page_sections.length : 0,
  }))
}

function stripVolatile(row: Row): Row {
  const out: Row = {}
  for (const k of Object.keys(row)) {
    if (!VOLATILE.has(k)) out[k] = row[k]
  }
  return out
}

// Kembalikan konten halaman ke versi tertentu. Sebelum restore, snapshot
// state sekarang dulu (kind 'pre_restore') supaya restore pun bisa dibatalkan.
// Status publish TIDAK diubah — admin atur live/draft terpisah.
export async function restorePageVersion(
  client: Client,
  versionId: string,
): Promise<{ pageId: string }> {
  const { data: version, error: vErr } = await client
    .from('page_versions')
    .select('page_id, tenant_id, snapshot')
    .eq('id', versionId)
    .single()
  if (vErr || !version) throw new Error(`restorePageVersion: versi tidak ditemukan`)

  const pageId = version.page_id as string
  const tenantId = version.tenant_id as string
  const snap = version.snapshot as PageSnapshot

  // Jaring pengaman: simpan state sekarang sebelum ditimpa.
  await snapshotPage(client, { pageId, tenantId, kind: 'pre_restore', label: 'Sebelum restore', force: true })

  // 1. landing_pages — konten saja, status dibiarkan.
  const { error: pageErr } = await client
    .from('landing_pages')
    .update({ data_konten: snap.data_konten, konfigurasi: snap.konfigurasi })
    .eq('id', pageId)
  if (pageErr) throw new Error(`restore landing_pages: ${pageErr.message}`)

  // 2. add-on tables — wipe lalu insert ulang dari snapshot.
  for (const t of ADDON_TABLES) {
    const { error: delErr } = await client.from(t).delete().eq('page_id', pageId)
    if (delErr) throw new Error(`restore wipe ${t}: ${delErr.message}`)
    const rows = ((snap as unknown as Record<string, Row[]>)[t] ?? []).map(stripVolatile)
    if (rows.length) {
      const { error: insErr } = await client.from(t).insert(rows)
      if (insErr) throw new Error(`restore insert ${t}: ${insErr.message}`)
    }
  }

  // 3. tenant_profile — upsert (1 baris per page) atau hapus kalau snapshot null.
  if (snap.tenant_profile) {
    const { error } = await client
      .from('tenant_profile')
      .upsert(stripVolatile(snap.tenant_profile), { onConflict: 'page_id' })
    if (error) throw new Error(`restore tenant_profile: ${error.message}`)
  }

  return { pageId }
}
