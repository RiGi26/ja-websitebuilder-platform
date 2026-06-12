#!/usr/bin/env node
// scripts/shoot-chrome.mjs — capture theme-samples/<id>.html memakai Chrome terpasang.
// Alternatif zero-dependency dari shoot-themes.mjs (Playwright). Dipakai saat agen
// perlu melihat pixel secara mandiri: vitest/playwright crash di sandbox Windows
// (winmm.dll), tapi spawn chrome.exe + node berjalan normal.
//
//   node scripts/shoot-chrome.mjs <id> [<id> ...] [--full]
//   npm run shoot:chrome -- <id> [--full]
//
// Output: theme-samples/<id>-{mobile,tablet,desktop}.png (lebar 375/768/1440).
// Default = tinggi viewport perangkat nyata (above-the-fold). --full = tinggi
// ~5000-6500px untuk menangkap seluruh halaman; pada mode ini 100vh/100svh/100dvh
// di salinan SEMENTARA dipatok 820px supaya hero tidak ikut membesar setinggi window.

import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  `${process.env.LOCALAPPDATA ?? ''}/Google/Chrome/Application/chrome.exe`,
]
const chrome = CHROME_CANDIDATES.find((p) => p && existsSync(p))
if (!chrome) {
  console.error('Chrome tidak ditemukan di lokasi standar — install Chrome atau pakai npm run shoot (Playwright).')
  process.exit(1)
}

const argv = process.argv.slice(2)
const full = argv.includes('--full')
const ids = argv.filter((a) => !a.startsWith('--'))
if (!ids.length) {
  console.error('Pakai: node scripts/shoot-chrome.mjs <themeId> [<themeId> ...] [--full]')
  process.exit(1)
}

const DIR = resolve('theme-samples')
const VIEWPORTS = [
  { name: 'mobile', w: 375, h: full ? 6500 : 812 },
  { name: 'tablet', w: 768, h: full ? 5500 : 1024 },
  { name: 'desktop', w: 1440, h: full ? 5000 : 900 },
]

// Bekukan animasi/transisi supaya tiap shot menangkap keadaan settled
// (paritas dengan anim-freeze di shoot-themes.mjs).
const FREEZE =
  '<style data-shot-freeze>*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}</style>'

let fail = 0
for (const id of ids) {
  const src = join(DIR, `${id}.html`)
  if (!existsSync(src)) {
    console.error(`lewat: ${src} tidak ada — jalankan generator sample dulu`)
    fail++
    continue
  }
  let html = readFileSync(src, 'utf8')
  if (full) {
    html = html.replaceAll('100svh', '820px').replaceAll('100dvh', '820px').replaceAll('100vh', '820px')
  }
  html = html.includes('</head>') ? html.replace('</head>', `${FREEZE}</head>`) : FREEZE + html
  const tmp = join(DIR, `.shot-${id}.html`)
  writeFileSync(tmp, html)
  try {
    for (const v of VIEWPORTS) {
      const out = join(DIR, `${id}-${v.name}.png`)
      execFileSync(
        chrome,
        [
          '--headless=new',
          '--disable-gpu',
          '--hide-scrollbars',
          '--mute-audio',
          '--force-device-scale-factor=1',
          `--window-size=${v.w},${v.h}`,
          `--screenshot=${out}`,
          // beri waktu webfont + foto remote settle sebelum capture
          '--virtual-time-budget=5000',
          pathToFileURL(tmp).href,
        ],
        { stdio: 'ignore', timeout: 90_000 },
      )
      console.log(`✓ ${id}-${v.name}.png (${v.w}x${v.h}${full ? ', full' : ''})`)
    }
  } catch (e) {
    console.error(`✗ ${id}: ${e.message}`)
    fail++
  } finally {
    rmSync(tmp, { force: true })
  }
}
process.exit(fail ? 1 : 0)
