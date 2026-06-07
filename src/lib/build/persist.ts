// ============================================================
// F1-3 (tulis) — terapkan BuildPlan ke DB lewat supabaseAdmin (service-role).
// IDEMPOTEN: hapus dulu baris generate sebelumnya (sections + add-on rows)
// untuk page ini, lalu insert ulang. Dipanggil 2x = hasil sama, tidak dobel.
// ⚠️ Rebuild menimpa sections/services/menu/products page tsb — ini memang
//    "regenerate konten" (bukan merge dengan edit customer). Untuk build awal
//    dari order, aman. Edit halus dilakukan customer/admin via builder setelah.
// ============================================================
import type { SupabaseClient } from '@supabase/supabase-js'
import type { KonfigurasiWebsite } from '@/types/websitebuilder'
import type { BuildPlan } from './types'
import { snapshotPage } from './versions'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = SupabaseClient<any>

export interface ApplyParams {
  pageId: string
  tenantId: string
  currentKonfigurasi: KonfigurasiWebsite
  plan: BuildPlan
  publish: boolean
}

export interface ApplyResult {
  status: 'published' | 'draft'
  nSections: number
  nServices: number
  nMenu: number
  nProducts: number
}

export async function applyBuildPlan(client: Client, params: ApplyParams): Promise<ApplyResult> {
  const { pageId, tenantId, currentKonfigurasi, plan, publish } = params

  // 0. F5-2 — snapshot state SEKARANG sebelum ditimpa (auto-versi). Skip kalau
  //    halaman masih kosong. Best-effort: jangan gagalkan build kalau snapshot error.
  try {
    await snapshotPage(client, { pageId, tenantId, kind: 'pre_build', label: 'Sebelum build ulang' })
  } catch (e) {
    console.error('applyBuildPlan snapshot (non-fatal):', e instanceof Error ? e.message : e)
  }

  // 1. Merge konfigurasi: pertahankan addons & branding lama, timpa theme/variant/
  //    primary/design_tokens + features hasil generate. (additive, tidak destruktif)
  const konfigurasi: KonfigurasiWebsite = {
    ...currentKonfigurasi,
    features: { ...(currentKonfigurasi.features ?? {}), ...plan.features },
    branding: {
      ...(currentKonfigurasi.branding ?? {}),
      theme: plan.theme,
      ...(plan.variant ? { variant: plan.variant } : {}),
      ...(plan.primary ? { primary: plan.primary } : {}),
      design_tokens: plan.designTokens,
    },
  }

  const { error: pageErr } = await client
    .from('landing_pages')
    .update({
      data_konten: plan.dataKonten,
      konfigurasi,
      ...(publish ? { status: 'published' } : {}),
    })
    .eq('id', pageId)
  if (pageErr) throw new Error(`update landing_pages: ${pageErr.message}`)

  // 2. Bersihkan baris generate lama (idempoten), lalu insert ulang.
  await wipe(client, 'page_sections', pageId)
  await wipe(client, 'services', pageId)
  await wipe(client, 'menu_items', pageId)
  await wipe(client, 'products', pageId)

  // 3. Sections — urutan = index.
  if (plan.sections.length) {
    const rows = plan.sections.map((s, i) => ({
      page_id: pageId,
      tenant_id: tenantId,
      urutan: i,
      tipe_komponen: s.tipe_komponen,
      is_visible: true,
      isi_komponen: s.isi_komponen,
    }))
    const { error } = await client.from('page_sections').insert(rows)
    if (error) throw new Error(`insert page_sections: ${error.message}`)
  }

  // 4. Services / menu_items / products.
  if (plan.services.length) {
    const rows = plan.services.map((s, i) => ({
      tenant_id: tenantId,
      page_id: pageId,
      nama: s.nama,
      deskripsi: s.deskripsi ?? null,
      harga: s.harga,
      dp_amount: s.dp_amount ?? 0,
      durasi_menit: s.durasi_menit ?? null,
      kategori: s.kategori ?? null,
      gambar_url: s.gambar ?? null,
      is_active: true,
      urutan: i,
    }))
    const { error } = await client.from('services').insert(rows)
    if (error) throw new Error(`insert services: ${error.message}`)
  }

  if (plan.menuItems.length) {
    const rows = plan.menuItems.map((m, i) => ({
      tenant_id: tenantId,
      page_id: pageId,
      nama: m.nama,
      deskripsi: m.deskripsi ?? null,
      harga: m.harga,
      kategori: m.kategori ?? null,
      gambar_url: m.gambar ?? null,
      is_active: true,
      urutan: i,
    }))
    const { error } = await client.from('menu_items').insert(rows)
    if (error) throw new Error(`insert menu_items: ${error.message}`)
  }

  if (plan.products.length) {
    const rows = plan.products.map((p, i) => ({
      tenant_id: tenantId,
      page_id: pageId,
      nama: p.nama,
      deskripsi: p.deskripsi ?? null,
      harga: p.harga,
      kategori: p.kategori ?? null,
      stok: p.stok ?? null,
      gambar_url: p.gambar ?? null,
      is_active: true,
      urutan: i,
    }))
    const { error } = await client.from('products').insert(rows)
    if (error) throw new Error(`insert products: ${error.message}`)
  }

  // 5. tenant_profile (1 baris per page) — upsert.
  const tp = plan.tenantProfile
  if (tp.wa || tp.email || tp.alamat || tp.jam || tp.instagram) {
    const { error } = await client.from('tenant_profile').upsert(
      {
        page_id: pageId,
        tenant_id: tenantId,
        wa: tp.wa ?? null,
        email: tp.email ?? null,
        alamat: tp.alamat ?? null,
        jam: tp.jam ?? null,
        instagram: tp.instagram ?? null,
      },
      { onConflict: 'page_id' },
    )
    if (error) throw new Error(`upsert tenant_profile: ${error.message}`)
  }

  return {
    status: publish ? 'published' : 'draft',
    nSections: plan.sections.length,
    nServices: plan.services.length,
    nMenu: plan.menuItems.length,
    nProducts: plan.products.length,
  }
}

async function wipe(client: Client, table: string, pageId: string): Promise<void> {
  const { error } = await client.from(table).delete().eq('page_id', pageId)
  if (error) throw new Error(`wipe ${table}: ${error.message}`)
}
