// Visual-pipeline capture (THEME_VISUAL_PIPELINE.md §3.1).
// Screenshots a self-contained theme sample HTML across the 3 system breakpoints
// so the ui-ux-pro-max scorecard (§3.2) can run on real pixels, not vibes.
//
// The sample HTML in theme-samples/<id>.html is fully self-contained (inline CSS +
// tokens), so we load it via file:// — no dev server, no admin auth needed.
//
// Usage:
//   node scripts/shoot-themes.mjs umum-bluecare
//   node scripts/shoot-themes.mjs umum-bluecare estetik-rosegold wellness-forest
//
// Output: theme-samples/<id>-{mobile,tablet,desktop}.png  (git-ignored, local UAT)

import { chromium } from 'playwright'
import { pathToFileURL } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const VIEWPORTS = { mobile: 375, tablet: 768, desktop: 1440 }
const SAMPLES_DIR = path.resolve('theme-samples')

const ids = process.argv.slice(2)
if (ids.length === 0) {
  console.error('usage: node scripts/shoot-themes.mjs <themeId> [<themeId> ...]')
  console.error('  (themeId must have a matching theme-samples/<themeId>.html)')
  process.exit(1)
}

const browser = await chromium.launch()
let shot = 0
let missing = 0

for (const id of ids) {
  const htmlPath = path.join(SAMPLES_DIR, `${id}.html`)
  if (!fs.existsSync(htmlPath)) {
    console.warn(`⚠ skip ${id}: ${path.relative(process.cwd(), htmlPath)} not found`)
    missing++
    continue
  }
  const url = pathToFileURL(htmlPath).href

  for (const [name, width] of Object.entries(VIEWPORTS)) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      deviceScaleFactor: 1, // keep 1 — crisp enough for review, smaller files/tokens
    })
    await page.goto(url, { waitUntil: 'networkidle' })
    // Freeze CSS entrance animations (stagger fade-up starts at opacity:0) so the
    // screenshot captures the settled state, not a mid-transition frame.
    await page.addStyleTag({
      content: '*,*::before,*::after{animation:none!important;transition:none!important}.ce-stagger>*{opacity:1!important;transform:none!important}',
    })
    const out = path.join(SAMPLES_DIR, `${id}-${name}.png`)
    await page.screenshot({ path: out, fullPage: true })
    await page.close()
    shot++
    console.log(`✓ ${path.relative(process.cwd(), out)} (${width}px)`)
  }
}

await browser.close()
console.log(`\nDone: ${shot} screenshot(s)${missing ? `, ${missing} theme(s) missing HTML` : ''}.`)
