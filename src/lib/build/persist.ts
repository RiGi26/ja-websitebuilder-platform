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
    // B-cap: capabilities = turunan dari order (rebuild regenerasi penuh).
    capabilities: plan.capabilities,
    // Opsi C: tandai konten contoh (briefing inti kosong) → banner onboarding portal.
    content_is_sample: plan.contentIsSample,
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

  // 2. Regenerasi baris turunan (sections + services/menu/products). Atomik-per-
  //    tabel: insert baris BARU dulu, baru hapus yang LAMA (audit 2026-06-13, #10).
  //    Kalau insert gagal di tengah, konten lama tetap ada — page tak pernah kosong
  //    diam-diam. Tetap idempoten (panggil 2x = hasil sama). Urutan = index.
  await replaceRows(
    client,
    'page_sections',
    pageId,
    plan.sections.map((s, i) => ({
      page_id: pageId,
      tenant_id: tenantId,
      urutan: i,
      tipe_komponen: s.tipe_komponen,
      is_visible: true,
      isi_komponen: s.isi_komponen,
    })),
  )

  await replaceRows(
    client,
    'services',
    pageId,
    plan.services.map((s, i) => ({
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
    })),
  )

  await replaceRows(
    client,
    'menu_items',
    pageId,
    plan.menuItems.map((m, i) => ({
      tenant_id: tenantId,
      page_id: pageId,
      nama: m.nama,
      deskripsi: m.deskripsi ?? null,
      harga: m.harga,
      kategori: m.kategori ?? null,
      gambar_url: m.gambar ?? null,
      is_active: true,
      urutan: i,
    })),
  )

  await replaceRows(
    client,
    'products',
    pageId,
    plan.products.map((p, i) => ({
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
    })),
  )

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

// Ganti baris generate lama dengan yang baru secara aman: insert BARU dulu, lalu
// hapus LAMA (by id yang ditangkap sebelum insert). Kalau insert gagal, baris lama
// tetap utuh → page tak pernah kosong diam-diam (audit 2026-06-13, #10). Supabase JS
// tak punya transaksi multi-statement; urutan insert→delete ini menurunkan risiko
// jauh tanpa perlu RPC/postgres function (codebase belum memakainya).
async function replaceRows(
  client: Client,
  table: string,
  pageId: string,
  rows: Record<string, unknown>[],
): Promise<void> {
  // Tangkap id baris lama SEBELUM insert (baris baru juga ber-page_id sama, jadi
  // tak bisa dihapus pakai filter page_id setelah insert).
  const { data: oldRows, error: selErr } = await client
    .from(table)
    .select('id')
    .eq('page_id', pageId)
  if (selErr) throw new Error(`read ${table}: ${selErr.message}`)
  const oldIds = (oldRows ?? []).map((r) => r.id as string)

  // Insert baris baru dulu — kalau gagal, lempar; baris lama belum disentuh.
  if (rows.length) {
    const { error: insErr } = await client.from(table).insert(rows)
    if (insErr) throw new Error(`insert ${table}: ${insErr.message}`)
  }

  // Baru hapus baris lama setelah baris baru aman tersimpan.
  if (oldIds.length) {
    const { error: delErr } = await client.from(table).delete().in('id', oldIds)
    if (delErr) throw new Error(`delete old ${table}: ${delErr.message}`)
  }
}
