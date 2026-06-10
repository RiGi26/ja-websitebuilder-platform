// ============================================================
// WORKAROUND GENERATOR — sample HTML toko-atelier TANPA vitest/esbuild.
// Lingkungan shell agen Claude tidak bisa menjalankan binary Go esbuild
// (crash "winmm.dll not found") → `npm run samples` gagal di sana.
// Jalur ini: tsc (pure JS) → node. Output identik gen-samples.test.tsx
// (pageDoc sama persis), hanya untuk 2 entri toko-atelier.
//
// Pakai:
//   npx tsc -p scripts/tsconfig.gen-atelier.json
//   node .tmp-gen-atelier/scripts/gen-atelier-entry.js
//   (lalu hapus .tmp-gen-atelier)
//
// `npm run samples` penuh tetap jadi jalur resmi di mesin owner.
// ============================================================
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import TokoAtelierRenderer from '../src/app/components/themes/toko-atelier/TokoAtelierRenderer'
import { sampleContentForTheme } from '../src/lib/theme-system/sample-content'

const ENTRIES: { id: string; variant: string; primary?: string; label: string; sw: string }[] = [
  { id: 'toko-atelier', variant: 'noir', label: 'Toko Atelier — Noir (flagship fashion)', sw: '#C5A572' },
  { id: 'toko-atelier-brand', variant: 'noir', primary: '#7E1F2D', label: 'Toko Atelier — aksen brand (burgundy)', sw: '#7E1F2D' },
  { id: 'toko-atelier-ivoire', variant: 'ivoire', label: 'Toko Atelier — Ivoire (varian terang)', sw: '#7A5C32' },
]

// Salinan persis pageDoc() dari gen-samples.test.tsx — jaga paritas output.
function pageDoc(title: string, body: string): string {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>body{margin:0}</style></head><body>${body}</body></html>`
}

const content = sampleContentForTheme('toko-atelier')
for (const e of ENTRIES) {
  const html = renderToStaticMarkup(
    <TokoAtelierRenderer content={content} variant={e.variant} primary={e.primary} />,
  )
  writeFileSync(`theme-samples/${e.id}.html`, pageDoc(e.label, html))
  console.log(`ok theme-samples/${e.id}.html (${(html.length / 1024).toFixed(1)} KB)`)
}

// Selipkan kartu ke index.html yang sudah ada (idempoten) agar tampil di galeri
// tanpa harus regenerasi semua tema via vitest.
const idx = 'theme-samples/index.html'
if (existsSync(idx)) {
  let s = readFileSync(idx, 'utf8')
  // Idempoten PER ENTRI — entri baru (mis. ivoire) tetap terselip walau kartu
  // atelier lain sudah ada dari run sebelumnya.
  const missing = ENTRIES.filter((e) => !s.includes(`href="${e.id}.html"`))
  if (missing.length) {
    const cards = missing.map(
      (e) =>
        `<a class="card" href="${e.id}.html"><span class="sw" style="background:${e.sw}"></span><b>${e.label}</b><small>bespoke · ${e.id}</small><p>Renderer premium Opsi A (flagship).</p></a>`,
    ).join('')
    s = s.replace('<div class="grid">', '<div class="grid">' + cards)
    writeFileSync(idx, s)
    console.log(`ok index.html: ${missing.length} kartu atelier ditambahkan`)
  }
}
