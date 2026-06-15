// ============================================================
// WORKAROUND GENERATOR — sample HTML sekolah-reguler TANPA vitest/esbuild.
//   npx tsc -p scripts/tsconfig.gen-sekolah.json
//   node scripts/run-gen.cjs .tmp-gen-sekolah .tmp-gen-sekolah/scripts/gen-sekolah-entry.js
// ============================================================
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import SekolahAlmamaterRenderer from '../src/app/components/themes/toko-bespoke/SekolahAlmamaterRenderer'
import { sampleContentForTheme } from '../src/lib/theme-system/sample-content'

const ENTRIES: { id: string; variant: string; label: string; sw: string }[] = [
  { id: 'reguler-almamater', variant: 'almamater', label: 'Sekolah — Almamater (collegiate prestige, lencana/crest)', sw: '#15294B' },
]

function pageDoc(title: string, body: string): string {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>body{margin:0}</style></head><body>${body}</body></html>`
}

const content = sampleContentForTheme('sekolah-lux')
for (const e of ENTRIES) {
  const html = renderToStaticMarkup(<SekolahAlmamaterRenderer content={content} variant={e.variant} />)
  writeFileSync(`theme-samples/${e.id}.html`, pageDoc(e.label, html))
  console.log(`ok theme-samples/${e.id}.html (${(html.length / 1024).toFixed(1)} KB)`)
}

const idx = 'theme-samples/index.html'
if (existsSync(idx)) {
  let s = readFileSync(idx, 'utf8')
  const missing = ENTRIES.filter((e) => !s.includes(`href="${e.id}.html"`))
  if (missing.length) {
    const cards = missing.map(
      (e) => `<a class="card" href="${e.id}.html"><span class="sw" style="background:${e.sw}"></span><b>${e.label}</b><small>bespoke · ${e.id}</small><p>Renderer premium bespoke (Wave 3 edukasi).</p></a>`,
    ).join('')
    s = s.replace('<div class="grid">', '<div class="grid">' + cards)
    writeFileSync(idx, s)
    console.log(`ok index.html: ${missing.length} kartu sekolah ditambahkan`)
  }
}
