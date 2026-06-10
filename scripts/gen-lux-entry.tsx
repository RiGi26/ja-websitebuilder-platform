// ============================================================
// WORKAROUND GENERATOR — sample HTML 9 tema LUX tanpa vitest/esbuild
// (lingkungan shell agen crash winmm.dll; jalur resmi `npm run samples`
// tetap di mesin owner). Output identik gen-samples.test.tsx: pageDoc
// disalin persis + render ComposableRenderer dgn sampleContentForTheme.
//
// Pakai:
//   npx tsc -p scripts/tsconfig.gen-lux.json
//   node scripts/run-gen.cjs .tmp-gen-lux .tmp-gen-lux/scripts/gen-lux-entry.js
//   (lalu hapus .tmp-gen-lux)
// ============================================================
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import ComposableRenderer from '../src/app/components/theme-engine/ComposableRenderer'
import { MANIFESTS } from '../src/lib/theme-system/manifest'
import { INDUSTRY_VARIANTS } from '../src/lib/website-variants'
import { sampleContentForTheme } from '../src/lib/theme-system/sample-content'

// Salinan persis pageDoc() dari gen-samples.test.tsx — jaga paritas output.
function pageDoc(title: string, body: string): string {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>body{margin:0}</style></head><body>${body}</body></html>`
}

// Kartu index dari INDUSTRY_VARIANTS (id/nama/deskripsi/mood lux per industri).
const LUX = Object.entries(INDUSTRY_VARIANTS).flatMap(([tipe, vars]) =>
  vars.filter((v) => v.id.startsWith('lux-')).map((v) => ({ tipe, ...v })),
)

const cards: string[] = []
for (const v of LUX) {
  const manifest = MANIFESTS[v.id]
  if (!manifest) {
    console.warn(`skip ${v.id}: manifest tidak ditemukan`)
    continue
  }
  const html = renderToStaticMarkup(
    <ComposableRenderer manifest={manifest} content={sampleContentForTheme(v.id)} />,
  )
  writeFileSync(`theme-samples/${v.id}.html`, pageDoc(`${manifest.label} — ${v.tipe}`, html))
  console.log(`ok theme-samples/${v.id}.html (${(html.length / 1024).toFixed(1)} KB)`)
  cards.push(
    `<a class="card" href="${v.id}.html"><span class="sw" style="background:${v.mood}"></span><b>${manifest.label}</b><small>${v.tipe} · ${v.id}</small><p>${v.deskripsi}</p></a>`,
  )
}

// Selipkan kartu ke index.html (idempoten per entri) tanpa regenerasi penuh.
const idx = 'theme-samples/index.html'
if (existsSync(idx)) {
  let s = readFileSync(idx, 'utf8')
  const missing = LUX.filter((v) => MANIFESTS[v.id] && !s.includes(`href="${v.id}.html"`))
  if (missing.length) {
    const add = cards.filter((c) => missing.some((v) => c.includes(`href="${v.id}.html"`))).join('')
    s = s.replace('<div class="grid">', '<div class="grid">' + add)
    writeFileSync(idx, s)
    console.log(`ok index.html: ${missing.length} kartu lux ditambahkan`)
  }
}
