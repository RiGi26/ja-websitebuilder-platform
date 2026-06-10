// ============================================================
// B-section — injeksi SECTION struktural dari add-on (kelas 'structural').
// Add-on tertentu (catalog.sections blueprint) menambah section yang TIDAK ada
// di template industri. Nilai sejatinya = CROSS-INDUSTRI (mis. corporate beli
// 'blog' → dapat blog_list yang base-nya tak punya). Untuk industri aslinya,
// section add-on REDUNDAN dengan base (resto sudah punya menu, toko punya produk)
// → di-DEDUPE (native menang). Lihat ADDON_ARCHITECTURE_PLAN §A/§D.
//
// Section hasil merge masuk ke plan.sections → ditulis persist.ts apa adanya
// (nol perubahan write-path). tipe WAJIB ∈ CHECK page_sections.tipe_komponen.
// ============================================================
import type { BuildSection } from '@/lib/build/types'
import type { TipeKomponen } from '@/types/websitebuilder'
import { getAddon, aliasToId, type SectionBlueprint } from './catalog'

// Kumpulkan SectionBlueprint dari add-on terpilih (resolve alias corp/marketplace).
export function addonSectionBlueprints(addons: string[] | null | undefined): SectionBlueprint[] {
  const alias = aliasToId()
  const out: SectionBlueprint[] = []
  for (const raw of addons ?? []) {
    const k = (raw ?? '').toLowerCase().trim()
    if (!k) continue
    const id = getAddon(k) ? k : alias[k]
    const def = id ? getAddon(id) : undefined
    for (const s of def?.sections ?? []) out.push(s)
  }
  return out
}

// Bangun BuildSection (isi_komponen default) dari blueprint. HANYA tipe yang
// didukung renderer + punya bentuk isi jelas; tipe tak dikenal → null (di-skip,
// aman dari insert gagal CHECK). Bentuk isi mengikuti templates.ts.
function blueprintToSection(bp: SectionBlueprint): BuildSection | null {
  switch (bp.tipe) {
    case 'blog_list':
      return { tipe_komponen: 'blog_list', isi_komponen: { title: 'Artikel & Berita' } }
    case 'product_list':
      return { tipe_komponen: 'product_list', isi_komponen: { title: 'Produk Kami' } }
    case 'service_list':
      return { tipe_komponen: 'service_list', isi_komponen: { title: 'Layanan Kami' } }
    case 'contact_form':
      return { tipe_komponen: 'contact_form', isi_komponen: { title: 'Hubungi Kami' } }
    case 'cta':
      // Band ber-`preset` — `preset` ikut tersimpan di isi_komponen supaya:
      // (1) dedupe bisa membedakannya dari CTA penutup template, dan
      // (2) adapter composable memetakannya ke content.bands (bukan CTA utama).
      if (bp.preset === 'career') {
        return {
          tipe_komponen: 'cta',
          isi_komponen: { preset: 'career', title: 'Bergabung dengan Tim Kami', subtitle: 'Kami selalu terbuka untuk talenta baru. Kirimkan CV dan portofolio Anda.', cta_text: 'Kirim Lamaran' },
        }
      }
      return {
        tipe_komponen: 'cta',
        isi_komponen: { preset: 'newsletter', title: 'Tetap Terhubung', subtitle: 'Dapatkan info & promo terbaru dari kami.', cta_text: 'Berlangganan' },
      }
    default:
      return null
  }
}

// Posisi insert sesuai anchor blueprint (jatuh aman bila anchor tak ketemu).
function anchorIndex(sections: BuildSection[], anchor?: SectionBlueprint['anchor']): number {
  const SHOWCASE: TipeKomponen[] = ['product_list', 'service_list', 'pricing_table', 'blog_list']
  if (anchor === 'after-showcase') {
    const idx = sections.findIndex((s) => SHOWCASE.includes(s.tipe_komponen))
    if (idx >= 0) return idx + 1
  }
  // 'before-cta', 'end', atau anchor tak match → sebelum cta bila ada, else akhir.
  const ctaIdx = sections.findIndex((s) => s.tipe_komponen === 'cta')
  return ctaIdx >= 0 ? ctaIdx : sections.length
}

/**
 * Gabung section template + blueprint add-on. DEDUPE per tipe+preset: bila
 * template SUDAH punya kombinasi itu, blueprint di-skip (native menang) — resto/
 * toko tak dobel showcase. Kunci menyertakan `preset` supaya band cta add-on
 * (newsletter/career) TIDAK tertelan CTA penutup template — dulu dedupe per-tipe
 * murni membuat newsletter selalu ter-skip (semua template punya `cta`).
 * Additive, urutan template dipertahankan.
 */
const keyOf = (tipe: TipeKomponen, isi: Record<string, unknown> | undefined): string =>
  `${tipe}:${typeof isi?.preset === 'string' ? isi.preset : ''}`

export function mergeAddonSections(template: BuildSection[], blueprints: SectionBlueprint[]): BuildSection[] {
  const result = [...template]
  const existing = new Set<string>(template.map((s) => keyOf(s.tipe_komponen, s.isi_komponen)))
  for (const bp of blueprints) {
    const sec = blueprintToSection(bp)
    if (!sec || existing.has(keyOf(sec.tipe_komponen, sec.isi_komponen))) continue
    result.splice(anchorIndex(result, bp.anchor), 0, sec)
    existing.add(keyOf(sec.tipe_komponen, sec.isi_komponen))
  }
  return result
}
