// ============================================================
// WORKAROUND GENERATOR — sample HTML toko-kecantikan TANPA vitest/esbuild.
// Lingkungan shell agen Claude tidak bisa menjalankan binary Go esbuild
// (crash "winmm.dll not found") → `npm run samples` gagal di sana.
// Jalur ini: tsc (pure JS) → node. Output identik gen-samples.test.tsx (pageDoc sama).
//
// Pakai:
//   npx tsc -p scripts/tsconfig.gen-kecantikan.json
//   node scripts/run-gen.cjs .tmp-gen-kecantikan .tmp-gen-kecantikan/scripts/gen-kecantikan-entry.js
//   (lalu hapus .tmp-gen-kecantikan)
//
// `npm run samples` penuh tetap jadi jalur resmi di mesin owner.
// ============================================================
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import KecantikanLuxRenderer from '../src/app/components/themes/toko-bespoke/KecantikanLuxRenderer'
import { sampleContentForTheme } from '../src/lib/theme-system/sample-content'

const ENTRIES: { id: string; variant: string; primary?: string; label: string; sw: string }[] = [
  { id: 'kecantikan-embun', variant: 'embun', label: 'Toko Kecantikan — Embun (skincare luminous glow)', sw: '#B5566B' },
  { id: 'kecantikan-embun-brand', variant: 'embun', primary: '#7C3A8D', label: 'Toko Kecantikan — Embun (aksen brand ungu)', sw: '#7C3A8D' },
]

// Salinan persis pageDoc() dari gen-samples.test.tsx — jaga paritas output.
function pageDoc(title: string, body: string): string {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>body{margin:0}</style></head><body>${body}</body></html>`
}

const content = sampleContentForTheme('kecantikan-lux')
for (const e of ENTRIES) {
  const html = renderToStaticMarkup(
    <KecantikanLuxRenderer content={content} variant={e.variant} primary={e.primary} />,
  )
  writeFileSync(`theme-samples/${e.id}.html`, pageDoc(e.label, html))
  console.log(`ok theme-samples/${e.id}.html (${(html.length / 1024).toFixed(1)} KB)`)
}

// Selipkan kartu ke index.html (idempoten per entri) agar tampil di galeri.
const idx = 'theme-samples/index.html'
if (existsSync(idx)) {
  let s = readFileSync(idx, 'utf8')
  const missing = ENTRIES.filter((e) => !s.includes(`href="${e.id}.html"`))
  if (missing.length) {
    const cards = missing.map(
      (e) =>
        `<a class="card" href="${e.id}.html"><span class="sw" style="background:${e.sw}"></span><b>${e.label}</b><small>bespoke · ${e.id}</small><p>Renderer premium Opsi A (flagship).</p></a>`,
    ).join('')
    s = s.replace('<div class="grid">', '<div class="grid">' + cards)
    writeFileSync(idx, s)
    console.log(`ok index.html: ${missing.length} kartu kecantikan ditambahkan`)
  }
}
