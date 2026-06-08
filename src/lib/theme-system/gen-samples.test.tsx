// ============================================================
// THEME VISUAL PIPELINE — generator HTML sample (seam §3.1).
// SSR ComposableRenderer tiap tema → theme-samples/<id>.html (self-contained,
// CSS inline) + index.html. Dipakai `scripts/shoot-themes.mjs` (file://) +
// review visual user. Output di-gitignore (theme-samples/).
//
// GATED via env GEN_SAMPLES supaya TAK jalan saat `npm test` biasa (tetap cepat):
//   GEN_SAMPLES=all  npx vitest run src/lib/theme-system/gen-samples.test.tsx
//   GEN_SAMPLES=reguler-cerdas,islami-hijau npx vitest run .../gen-samples.test.tsx
// 'all' = semua tema di registry THEMES (lintas industri). Selain itu = daftar id.
// ============================================================
import { it } from 'vitest'
import { writeFileSync, mkdirSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import ComposableRenderer from '@/app/components/theme-engine/ComposableRenderer'
import RestaurantLuxRenderer from '@/app/components/themes/restaurant-lux/RestaurantLuxRenderer'
import { MANIFESTS } from '@/lib/theme-system/manifest'
import { THEMES, type ThemeOption } from '@/lib/theme-system/taxonomy'
import { sampleContentForTheme } from '@/lib/theme-system/sample-content'

// Renderer bespoke premium (Opsi A). id sintetik → render renderer khusus dgn
// sample-content kaya. `restaurant-lux-brand` mendemokan aksen ikut warna brand.
const LUX: Record<string, { sample: string; variant?: string; primary?: string; label: string }> = {
  'restaurant-lux': { sample: 'finedining-aurum', variant: 'aurum', label: 'Restaurant Lux — Aurum' },
  'restaurant-lux-noir': { sample: 'finedining-aurum', variant: 'noir', label: 'Restaurant Lux — Noir' },
  'restaurant-lux-brand': { sample: 'finedining-aurum', variant: 'aurum', primary: '#7FA06B', label: 'Restaurant Lux — aksen brand (hijau)' },
}

const GEN = process.env.GEN_SAMPLES

function allThemes(): ThemeOption[] {
  const out: ThemeOption[] = []
  for (const byCat of Object.values(THEMES)) {
    for (const list of Object.values(byCat ?? {})) out.push(...list)
  }
  return out
}

function pageDoc(title: string, body: string): string {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>body{margin:0}</style></head><body>${body}</body></html>`
}

it.skipIf(!GEN)('generate theme sample HTML', () => {
  const dir = 'theme-samples'
  mkdirSync(dir, { recursive: true })

  const wanted =
    !GEN || GEN === 'all' || GEN === '1'
      ? allThemes()
      : allThemes().filter((t) => GEN.split(',').map((s) => s.trim()).includes(t.id))

  const cards: string[] = []
  for (const t of wanted) {
    const manifest = MANIFESTS[t.manifest]
    if (!manifest) continue
    const html = renderToStaticMarkup(<ComposableRenderer manifest={manifest} content={sampleContentForTheme(t.id)} />)
    writeFileSync(`${dir}/${t.id}.html`, pageDoc(`${t.nama} — ${t.subKategori}`, html))
    cards.push(
      `<a class="card" href="${t.id}.html"><span class="sw" style="background:${t.mood}"></span><b>${t.nama}</b><small>${t.subKategori} · ${t.id}</small><p>${t.deskripsi}</p></a>`,
    )
  }

  // ── Bespoke premium renderers (Opsi A) ──
  const luxIds = GEN === 'all' || GEN === '1' ? Object.keys(LUX) : (GEN ?? '').split(',').map((s) => s.trim())
  for (const id of luxIds) {
    const cfg = LUX[id]
    if (!cfg) continue
    const html = renderToStaticMarkup(<RestaurantLuxRenderer content={sampleContentForTheme(cfg.sample)} variant={cfg.variant} primary={cfg.primary} />)
    writeFileSync(`${dir}/${id}.html`, pageDoc(cfg.label, html))
    cards.push(`<a class="card" href="${id}.html"><span class="sw" style="background:#C9A24B"></span><b>${cfg.label}</b><small>bespoke · ${id}</small><p>Renderer premium Opsi A.</p></a>`)
  }

  const index = pageDoc(
    'Theme Samples',
    `<style>body{font-family:system-ui,sans-serif;background:#0B0B0C;color:#fff;padding:40px}h1{font-size:28px;margin:0 0 4px}.sub{color:#888;margin:0 0 28px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}.card{display:block;text-decoration:none;color:#fff;background:#16161a;border:1px solid #ffffff1a;border-radius:16px;padding:18px;transition:.2s}.card:hover{background:#1e1e24;border-color:#ffffff33}.sw{display:inline-block;width:28px;height:28px;border-radius:8px;margin-bottom:10px}.card b{display:block;font-size:15px}.card small{color:#888;font-size:11px}.card p{color:#aaa;font-size:12px;line-height:1.5;margin:8px 0 0}</style><h1>Theme Samples</h1><p class="sub">${cards.length} tema. Klik untuk render penuh.</p><div class="grid">${cards.join('')}</div>`,
  )
  writeFileSync(`${dir}/index.html`, index)
  // eslint-disable-next-line no-console
  console.log(`\n✓ generated ${cards.length} sample(s) → ${dir}/`)
})
