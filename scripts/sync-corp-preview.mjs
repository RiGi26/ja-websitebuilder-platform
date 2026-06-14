// ============================================================
// FASE 1 (PREVIEW_MODEL_ANALYSIS.md §9.2) — materialisasi preview tema ke repo CORP.
//
// Baca `theme-samples/theme-registry.json` (hasil build:theme-registry) → untuk
// tiap tema berstatus `live`, konversi 3 PNG screenshot → webp (≤~120KB) ke
//   ../ja-corp-landing/public/theme-previews/<tipe>/<subkat>/<themeId>-<vp>.webp
// lalu salin registry JSON apa adanya ke
//   ../ja-corp-landing/data/theme-registry.json
// CORP (static export, images.unoptimized) menyajikannya via <img> biasa — cepat
// & deterministik (alasan B mengalahkan iframe-per-tema, §4).
//
// ⚠️ OWNER-RUN (lokal). Butuh:
//   - `sharp` terpasang (npm i -D sharp) untuk encode webp.
//   - PNG screenshot hasil `npm run shoot:chrome -- <id>` di theme-samples/.
// Sandbox TAK BISA menjalankan ini (sharp = binary native + esbuild winmm crash) →
// di-skrip tapi diverifikasi hanya via `node --check`. Jalankan: `npm run sync:corp-preview`.
//
// Alur owner: shoot tema → `npm run sync:corp-preview` → review diff repo CORP → commit (Fase 2).
// ============================================================
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const REGISTRY_SRC = 'theme-samples/theme-registry.json'
const CORP_ROOT = resolve('..', 'ja-corp-landing')
const CORP_PUBLIC = resolve(CORP_ROOT, 'public')
const CORP_DATA = resolve(CORP_ROOT, 'data')
const VIEWPORTS = ['mobile', 'tablet', 'desktop']
const WEBP_QUALITY = 82
const MAX_KB = 120
// Screenshot = full-page (sangat tinggi). Untuk kartu galeri kita crop region
// HERO (dari atas) ke rasio kartu 4:3 + resize ke cap lebar → webp ringan & fokus
// (bukan gambar 8000px). Cap per-viewport menjaga ukuran file.
const CARD_ASPECT = 4 / 3
const WIDTH_CAP = { mobile: 440, tablet: 720, desktop: 1000 }

function die(msg) {
  console.error(`✗ ${msg}`)
  process.exit(1)
}

if (!existsSync(REGISTRY_SRC)) die(`${REGISTRY_SRC} tak ada — jalankan dulu: npm run build:theme-registry`)
if (!existsSync(CORP_ROOT)) die(`repo CORP tak ditemukan di ${CORP_ROOT}`)

let sharp
try {
  sharp = (await import('sharp')).default
} catch {
  die('paket `sharp` belum terpasang. Jalankan: npm i -D sharp')
}

/** Crop hero (atas, rasio kartu) → resize ke cap → webp; turunkan kualitas
 *  bertahap sampai ≤ MAX_KB (lantai q40). */
async function encodeWebp(pngPath, vp) {
  const meta = await sharp(pngPath).metadata()
  const w = meta.width ?? WIDTH_CAP[vp]
  const h = meta.height ?? w
  const cropH = Math.min(h, Math.round(w / CARD_ASPECT)) // region hero dari atas
  const targetW = Math.min(w, WIDTH_CAP[vp] ?? 1000)
  const pipe = () =>
    sharp(pngPath)
      .extract({ left: 0, top: 0, width: w, height: cropH })
      .resize({ width: targetW, withoutEnlargement: true })
  let q = WEBP_QUALITY
  let buf = await pipe().webp({ quality: q }).toBuffer()
  while (buf.length / 1024 > MAX_KB && q > 40) {
    q -= 10
    buf = await pipe().webp({ quality: q }).toBuffer()
  }
  return { buf, q }
}

const registry = JSON.parse(readFileSync(REGISTRY_SRC, 'utf8'))

let converted = 0
let noshot = 0
let missing = 0

for (const ip of Object.values(registry)) {
  for (const sub of ip.subKategori) {
    for (const t of sub.themes) {
      if (t.status !== 'live' || !t.thumbs) {
        noshot++
        console.log(`  · ${t.themeId} → ${t.status} (tanpa gambar)`)
        continue
      }
      // _shootId = id file PNG (≠ themeId utk tema legacy spt Atelier); di-set build:theme-registry.
      const shootId = t._shootId ?? t.themeId
      for (const vp of VIEWPORTS) {
        const png = `theme-samples/${shootId}-${vp}.png`
        if (!existsSync(png)) {
          missing++
          console.warn(`  ! PNG hilang: ${png} (status registry 'live' tapi file tak ada)`)
          continue
        }
        // t.thumbs[vp] = URL publik (mis. /theme-previews/toko_online/gadget/gadget-onyx-desktop.webp)
        const out = resolve(CORP_PUBLIC, t.thumbs[vp].replace(/^\//, ''))
        mkdirSync(dirname(out), { recursive: true })
        const { buf, q } = await encodeWebp(png, vp)
        writeFileSync(out, buf)
        converted++
        console.log(`  ✓ ${t.thumbs[vp]}  (${(buf.length / 1024).toFixed(0)}KB, q${q})`)
      }
    }
  }
}

mkdirSync(CORP_DATA, { recursive: true })
const corpRegistryPath = resolve(CORP_DATA, 'theme-registry.json')
// Strip field internal `_shootId` (WB-only) → registry CORP bersih dari konsep build.
writeFileSync(corpRegistryPath, JSON.stringify(registry, (k, v) => (k === '_shootId' ? undefined : v), 2) + '\n')

console.log('')
console.log(`✓ registry → ${corpRegistryPath}`)
console.log(`✓ ${converted} webp · ${noshot} tema live-noshot · ${missing} PNG hilang`)
if (missing) console.warn('⚠ ada PNG hilang — shoot ulang tema terkait sebelum commit.')
console.log('→ review diff di repo CORP (data/ + public/theme-previews/) lalu commit (Fase 2).')
