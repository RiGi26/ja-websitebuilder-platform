// ============================================================
// WORKAROUND GENERATOR — sample HTML corporate-agency TANPA vitest/esbuild.
//   npx tsc -p scripts/tsconfig.gen-agency.json
//   node scripts/run-gen.cjs .tmp-gen-agency .tmp-gen-agency/scripts/gen-agency-entry.js
// ============================================================
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import AgencyPosterRenderer from '../src/app/components/themes/toko-bespoke/AgencyPosterRenderer'
import { sampleContentForTheme } from '../src/lib/theme-system/sample-content'

const ENTRIES: { id: string; variant: string; label: string; sw: string }[] = [
  { id: 'agency-poster', variant: 'bawaan', label: 'Corporate Agency — Poster (Swiss typographic, Garis Proses)', sw: '#1B2AB8' },
  { id: 'agency-poster-arang', variant: 'arang', label: 'Corporate Agency — Poster Arang (gelap)', sw: '#93A2FF' },
]

function pageDoc(title: string, body: string): string {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>body{margin:0}</style></head><body>${body}</body></html>`
}

mkdirSync('theme-samples', { recursive: true })
const content = sampleContentForTheme('corporate-agency')
for (const e of ENTRIES) {
  const html = renderToStaticMarkup(<AgencyPosterRenderer content={content} variant={e.variant} />)
  writeFileSync(`theme-samples/${e.id}.html`, pageDoc(e.label, html))
  console.log(`ok theme-samples/${e.id}.html (${(html.length / 1024).toFixed(1)} KB)`)
}

const idx = 'theme-samples/index.html'
if (existsSync(idx)) {
  let s = readFileSync(idx, 'utf8')
  const missing = ENTRIES.filter((e) => !s.includes(`href="${e.id}.html"`))
  if (missing.length) {
    const cards = missing.map(
      (e) => `<a class="card" href="${e.id}.html"><span class="sw" style="background:${e.sw}"></span><b>${e.label}</b><small>bespoke · ${e.id}</small><p>Renderer bespoke Wave 4 (compiler HTML-first).</p></a>`,
    ).join('')
    s = s.replace('<div class="grid">', '<div class="grid">' + cards)
    writeFileSync(idx, s)
    console.log(`ok index.html: ${missing.length} kartu agency ditambahkan`)
  }
}
