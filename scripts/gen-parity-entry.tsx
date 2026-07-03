// ============================================================
// GENERATOR FIXTURE PARITY — tema migrasi zero-hardcode Wave 5.
// Menulis __fixtures__/<tema>.parity.html = renderToStaticMarkup dengan props
// PERSIS sama dengan <Tema>.parity.test.tsx (content sample + variant bawaan,
// tanpa slug/capabilities/CartButton). Tahun dinormalkan "© YYYY".
//
// Pakai (regen fixture saat perubahan visual DISENGAJA, di PR yang sama):
//   node node_modules/typescript/bin/tsc -p scripts/tsconfig.gen-parity.json
//   node scripts/run-gen.cjs .tmp-gen-parity .tmp-gen-parity/scripts/gen-parity-entry.js
// Baseline pra-migrasi: jalankan di commit SEBELUM menyentuh renderer, simpan
// hasilnya, lalu bandingkan dengan hasil pasca-migrasi minus atribut data-edit.
// ============================================================
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import RestaurantLuxRenderer from '../src/app/components/themes/restaurant-lux/RestaurantLuxRenderer'
import KlinikFisioRenderer from '../src/app/components/themes/toko-bespoke/KlinikFisioRenderer'
import TokoAtelierRenderer from '../src/app/components/themes/toko-atelier/TokoAtelierRenderer'
import { sampleContentForTheme } from '../src/lib/theme-system/sample-content'

const normalizeYear = (s: string) => s.replace(/© \d{4}/g, '© YYYY')

const OUT = process.env.PARITY_OUT // override dir utk baseline pra-migrasi

const ENTRIES: { file: string; render: () => string }[] = [
  {
    file: 'src/app/components/themes/restaurant-lux/__fixtures__/restaurant-lux-aurum.parity.html',
    render: () =>
      renderToStaticMarkup(
        <RestaurantLuxRenderer content={sampleContentForTheme('finedining-aurum')} variant="aurum" />,
      ),
  },
  {
    file: 'src/app/components/themes/toko-bespoke/__fixtures__/klinik-fisio-gerak.parity.html',
    render: () =>
      renderToStaticMarkup(
        <KlinikFisioRenderer content={sampleContentForTheme('fisio-lux')} variant="gerak" />,
      ),
  },
  {
    file: 'src/app/components/themes/toko-atelier/__fixtures__/toko-atelier-noir.parity.html',
    render: () =>
      renderToStaticMarkup(
        <TokoAtelierRenderer content={sampleContentForTheme('toko-atelier')} variant="noir" />,
      ),
  },
]

for (const e of ENTRIES) {
  const html = normalizeYear(e.render())
  const target = OUT ? `${OUT}/${e.file.split('/').pop()}` : e.file
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, html)
  console.log(`ok ${target} (${(html.length / 1024).toFixed(1)} KB)`)
}
