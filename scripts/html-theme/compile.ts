// ============================================================
// HTML-THEME COMPILER (Wave 4 / pilar E) — mockup HTML beranotasi →
// (1) renderer TSX bespoke, (2) slots manifest, (3) contrast test,
// (4) sample content. Konvensi anotasi lengkap: scripts/html-theme/README.md.
//
// Jalankan (pola run-gen, tsc+node — aman sandbox):
//   npx tsc -p scripts/html-theme/tsconfig.json
//   node .tmp-html-theme/compile.js <theme>        (mis. corporate-agency)
//
// Input : theme-sources/<theme>/{theme.json, index.html}
// Output: src/app/components/themes/toko-bespoke/<Renderer>.tsx
//         src/app/components/themes/toko-bespoke/slots/<theme>.slots.ts
//         src/app/components/themes/toko-bespoke/<Renderer>.contrast.test.ts
//         src/lib/theme-system/samples/<theme>.sample.ts
//
// Prinsip: output = KODE yang di-commit & direview (regen idempotent — file
// hasil murni fungsi dari input). Hand-tweak DILARANG di file GENERATED;
// edit sumber HTML lalu recompile. Nilai theme_copy SELALU jadi text node
// React (tak pernah dangerouslySetInnerHTML) — permukaan XSS tetap tertutup.
// ============================================================
import { parse } from 'node-html-parser'
import type { HTMLElement as ParsedElement, Node as ParsedNode } from 'node-html-parser'
import * as fs from 'fs'
import * as path from 'path'

// ── Meta tema (theme-sources/<theme>/theme.json) ─────────────
interface ThemeMeta {
  /** Key tema di BESPOKE_RENDERERS, mis. 'corporate-agency'. */
  theme: string
  /** Nama komponen renderer, mis. 'AgencyRenderer'. */
  rendererName: string
  /** Namespace CSS 2-4 huruf, mis. 'ag' → kelas .ag-*, var --ag-*. */
  ns: string
  /** Etalase yang di-fetch SiteRenderer (products/menu/services/blog) — dokumentasi header. */
  source: string
  /** Variant bawaan (id palet dari :root tanpa data-palette). Default 'bawaan'. */
  defaultVariant?: string
  /** Palet tambahan (id → role → nilai) di luar :root[data-palette] HTML. */
  extraPalettes?: Record<string, Record<string, string>>
  /** Satu baris identitas utk header renderer (font/palet/signature — ledger). */
  identity?: string
  /** Field sample yang tak bisa dipanen dari HTML (mis. contact.wa, info.alamat). */
  sampleExtra?: Record<string, unknown>
}

interface SlotDef {
  key: string
  type: 'text' | 'textarea' | 'image' | 'array'
  label: string
  group: string
  max?: number
  default: string | string[]
  hint?: string
}

// ── Binding path ComposableContent dikenal ───────────────────
// Path di data-slot yang BUKAN copy.* wajib terdaftar di sini (aturan plan:
// pipe existing; default mockup men-seed sample). autoSlot = fallback copy
// slot yang ikut terdaftar di manifest (pola Warung hero_cta).
interface KnownPath {
  expr: string
  guard?: string
  edit?: string
  /** Fallback copy slot: expr memakai cp.t(autoSlot); default = teks mockup. */
  autoSlot?: string
  autoSlotLabel?: string
  autoSlotGroup?: string
  /** Binding <img>: expr = src. */
  img?: boolean
  /** Href JSX utk elemen <a> pembawa slot ini ('%MOCK%' = href mockup). */
  hrefExpr?: string
  uses?: UsageFlag[]
}
type UsageFlag = 'hero' | 'items' | 'features' | 'stats' | 'testimonials' | 'faqs' | 'jam' | 'wa' | 'price' | 'team'

const KNOWN_PATHS: Record<string, KnownPath> = {
  'nama': { expr: "c.nama ?? 'Nama Usaha'" },
  'hero.eyebrow': { expr: 'hero.eyebrow', guard: 'hero.eyebrow', edit: 'section:hero_banner.eyebrow', uses: ['hero'] },
  'hero.title': { expr: 'hero.title', guard: 'hero.title', edit: 'section:hero_banner.title', uses: ['hero'] },
  'hero.subtitle': { expr: 'hero.subtitle', guard: 'hero.subtitle', edit: 'section:hero_banner.subtitle', uses: ['hero'] },
  'hero.image': { expr: 'hero.image', img: true, guard: 'hero.image', uses: ['hero'] },
  'hero.ctaText': {
    expr: "hero.ctaText ?? cp.t('copy.hero_cta1')", edit: 'copy.hero_cta1',
    autoSlot: 'copy.hero_cta1', autoSlotLabel: 'Tombol utama hero', autoSlotGroup: 'Tombol & Ajakan',
    hrefExpr: "hero.ctaHref ?? '%MOCK%'", uses: ['hero'],
  },
  'hero.ctaText2': {
    expr: "hero.ctaText2 ?? cp.t('copy.hero_cta2')", edit: 'copy.hero_cta2',
    autoSlot: 'copy.hero_cta2', autoSlotLabel: 'Tombol kedua hero', autoSlotGroup: 'Tombol & Ajakan',
    hrefExpr: "hero.ctaHref2 ?? '%MOCK%'", uses: ['hero'],
  },
  'featuresEyebrow': {
    expr: "c.featuresEyebrow ?? cp.t('copy.features_eyebrow')", edit: 'copy.features_eyebrow',
    autoSlot: 'copy.features_eyebrow', autoSlotLabel: 'Label kecil bagian keunggulan', autoSlotGroup: 'Judul Bagian',
  },
  'featuresTitle': { expr: 'c.featuresTitle', guard: 'c.featuresTitle', edit: 'konten:featuresTitle' },
  'showcase.title': { expr: 'c.showcase?.title', guard: 'c.showcase?.title' },
  'showcase.subtitle': { expr: 'c.showcase?.subtitle', guard: 'c.showcase?.subtitle' },
  'statement.eyebrow': { expr: 'c.statement.eyebrow', guard: 'c.statement.eyebrow' },
  'statement.quote': { expr: 'c.statement.quote' },
  'statement.cite': { expr: 'c.statement.cite', guard: 'c.statement.cite' },
  'about.title': { expr: 'c.about.title', edit: 'section:about.title' },
  'about.body': { expr: 'c.about.body', edit: 'section:about.body' },
  'about.image': { expr: 'c.about.image', img: true, guard: 'c.about.image' },
  'about.ctaText': { expr: "c.about.ctaText ?? 'Pelajari lebih lanjut'", hrefExpr: 'c.about.ctaHref', guard: 'c.about.ctaHref' },
  'cta.title': { expr: 'c.cta.title' },
  'cta.subtitle': { expr: 'c.cta.subtitle', guard: 'c.cta.subtitle' },
  'cta.ctaText': {
    expr: "c.cta.ctaText ?? cp.t('copy.cta_primary')", edit: 'copy.cta_primary',
    autoSlot: 'copy.cta_primary', autoSlotLabel: 'Tombol utama panel ajakan', autoSlotGroup: 'Tombol & Ajakan',
    hrefExpr: "c.cta.ctaHref ?? waUrl", uses: ['wa'],
  },
  'contact.alamat': { expr: 'c.contact?.alamat', guard: 'c.contact?.alamat' },
  'contact.email': { expr: 'c.contact?.email', guard: 'c.contact?.email', hrefExpr: "`mailto:${c.contact?.email ?? ''}`" },
}

// ── data-repeat: koleksi ComposableContent ───────────────────
interface RepeatField {
  expr: (v: string) => string
  guard?: (v: string) => string
  img?: boolean
  /** Nilai harga: lewat priceText() + set flag price. */
  price?: boolean
  numeric?: boolean
  /** Href JSX bila elemen pembawa = <a>. */
  hrefExpr?: (v: string) => string
}
interface RepeatDef {
  listExpr: string
  varName: string
  uses: UsageFlag[]
  /** Path sample (dot) tempat item dipanen. '' = tak dipanen (mis. bands add-on). */
  samplePath: string
  fields: Record<string, RepeatField>
  /** Props ekstra utk root template (mis. data-band). */
  rootProps?: (v: string) => string[]
}
const REPEATS: Record<string, RepeatDef> = {
  'showcase.items': {
    listExpr: 'items', varName: 'item', uses: ['items'], samplePath: 'showcase.items',
    fields: {
      nama: { expr: (v) => `${v}.nama` },
      harga: { expr: (v) => `priceText(${v}.harga)`, price: true },
      desc: { expr: (v) => `${v}.desc`, guard: (v) => `${v}.desc` },
      gambar: { expr: (v) => `${v}.gambar`, img: true, guard: (v) => `${v}.gambar` },
      kategori: { expr: (v) => `${v}.kategori`, guard: (v) => `${v}.kategori` },
      durasi: { expr: (v) => `${v}.durasi`, guard: (v) => `${v}.durasi`, numeric: true },
    },
  },
  features: {
    listExpr: 'features', varName: 'ft', uses: ['features'], samplePath: 'features',
    fields: {
      title: { expr: (v) => `${v}.title` },
      desc: { expr: (v) => `${v}.desc` },
      image: { expr: (v) => `${v}.image`, img: true, guard: (v) => `${v}.image` },
    },
  },
  stats: {
    listExpr: 'stats', varName: 's', uses: ['stats'], samplePath: 'stats',
    fields: { angka: { expr: (v) => `${v}.angka` }, label: { expr: (v) => `${v}.label` } },
  },
  faq: {
    listExpr: 'faqs', varName: 'fq', uses: ['faqs'], samplePath: 'faq',
    fields: { q: { expr: (v) => `${v}.q` }, a: { expr: (v) => `${v}.a` } },
  },
  testimonials: {
    listExpr: 'testimonials', varName: 't', uses: ['testimonials'], samplePath: 'testimonials',
    fields: {
      quote: { expr: (v) => `${v}.quote` },
      nama: { expr: (v) => `${v}.nama` },
      peran: { expr: (v) => `${v}.peran`, guard: (v) => `${v}.peran` },
    },
  },
  team: {
    listExpr: '(c.team ?? [])', varName: 'm', uses: ['team'], samplePath: 'team',
    fields: {
      nama: { expr: (v) => `${v}.nama` },
      peran: { expr: (v) => `${v}.peran`, guard: (v) => `${v}.peran` },
      foto: { expr: (v) => `${v}.foto`, img: true, guard: (v) => `${v}.foto` },
    },
  },
  'info.jam': {
    listExpr: 'jamRows', varName: 'j', uses: ['jam'], samplePath: 'info.jam',
    fields: { hari: { expr: (v) => `${v}.hari` }, jam: { expr: (v) => `${v}.jam` } },
  },
  // Band add-on (career/newsletter) — data dari catalog add-on, bukan sample.
  bands: {
    listExpr: '(c.bands ?? [])', varName: 'b', uses: ['wa'], samplePath: '',
    fields: {
      preset_label: { expr: (v) => `${v}.preset === 'career' ? 'Karier' : ${v}.preset === 'newsletter' ? 'Buletin' : 'Info'` },
      title: { expr: (v) => `${v}.title` },
      subtitle: { expr: (v) => `${v}.subtitle`, guard: (v) => `${v}.subtitle` },
      ctaText: { expr: (v) => `${v}.ctaText`, guard: (v) => `${v}.ctaText`, hrefExpr: (v) => `${v}.ctaHref ?? waUrl` },
    },
    rootProps: (v) => [`data-band={${v}.preset}`],
  },
}

// data-optional="<nama>" → guard presence (kontrak hide-contract.test).
const OPTIONAL_GUARDS: Record<string, { guard: string; uses: UsageFlag[] }> = {
  stats: { guard: 'stats.length > 0', uses: ['stats'] },
  faq: { guard: 'faqs.length > 0', uses: ['faqs'] },
  testimonials: { guard: 'testimonials.length > 0', uses: ['testimonials'] },
  features: { guard: 'features.length > 0', uses: ['features'] },
  team: { guard: '(c.team ?? []).length > 0', uses: ['team'] },
  showcase: { guard: 'items.length > 0', uses: ['items'] },
  statement: { guard: 'c.statement', uses: [] },
  about: { guard: 'c.about', uses: [] },
  cta: { guard: 'c.cta', uses: [] },
}

const VOID_TAGS = new Set(['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'area', 'col', 'embed', 'track', 'wbr'])

// HTML attr → JSX prop (aria-*/data-* lolos apa adanya).
const ATTR_MAP: Record<string, string> = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex', srcset: 'srcSet',
  autocomplete: 'autoComplete', crossorigin: 'crossOrigin', spellcheck: 'spellCheck',
  'stroke-width': 'strokeWidth', 'stroke-linecap': 'strokeLinecap', 'stroke-linejoin': 'strokeLinejoin',
  'fill-rule': 'fillRule', 'clip-rule': 'clipRule', 'stop-color': 'stopColor', 'stop-opacity': 'stopOpacity',
  'font-family': 'fontFamily', 'font-size': 'fontSize', 'text-anchor': 'textAnchor',
}

// ── util ─────────────────────────────────────────────────────
function q(s: string): string {
  return `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}'`
}
function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h: string) => String.fromCodePoint(parseInt(h, 16)))
}
function normText(s: string): string {
  return decodeEntities(s).replace(/\s+/g, ' ').trim()
}
function escapeJsxText(s: string): string {
  // {} < > tak boleh telanjang di teks JSX.
  return s.replace(/[{}<>]/g, (ch) => `{${q(ch)}}`)
}
function escapeTemplate(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
}
function isElement(n: ParsedNode): n is ParsedElement {
  return n.nodeType === 1
}
function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
function humanizeKey(key: string): string {
  const last = key.split('.').pop() ?? key
  return cap(last.replace(/_/g, ' '))
}
function styleToObject(style: string): string {
  const parts = style.split(';').map((p) => p.trim()).filter(Boolean)
  const entries = parts.map((pair) => {
    const idx = pair.indexOf(':')
    const prop = pair.slice(0, idx).trim()
    const val = pair.slice(idx + 1).trim()
    const jsProp = prop.startsWith('--') ? q(prop) : prop.replace(/-([a-z])/g, (_, ch: string) => ch.toUpperCase())
    return `${jsProp}: ${q(val)}`
  })
  return `{ ${entries.join(', ')} }`
}
function setDeep(obj: Record<string, unknown>, dotPath: string, value: unknown): void {
  const parts = dotPath.split('.')
  let cur = obj
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof cur[parts[i]] !== 'object' || cur[parts[i]] === null) cur[parts[i]] = {}
    cur = cur[parts[i]] as Record<string, unknown>
  }
  cur[parts[parts.length - 1]] = value
}

// ── state kompilasi ──────────────────────────────────────────
interface CompileState {
  meta: ThemeMeta
  slots: SlotDef[]
  slotKeys: Set<string>
  uses: Set<UsageFlag>
  sample: Record<string, unknown>
  warnings: string[]
}

function addSlot(st: CompileState, def: SlotDef): void {
  if (st.slotKeys.has(def.key)) return
  st.slotKeys.add(def.key)
  st.slots.push(def)
}

function slotFromElement(st: CompileState, el: ParsedElement, key: string, defaultVal: string | string[], groupCtx: string): void {
  const explicitType = el.getAttribute('data-type')
  const isArr = Array.isArray(defaultVal)
  const defLen = isArr ? 0 : (defaultVal as string).length
  const type: SlotDef['type'] = isArr
    ? 'array'
    : el.rawTagName === 'img'
      ? 'image'
      : explicitType === 'textarea' || (!explicitType && defLen > 120)
        ? 'textarea'
        : 'text'
  const maxAttr = el.getAttribute('data-max')
  const max = maxAttr
    ? parseInt(maxAttr, 10)
    : type === 'array'
      ? Math.max(8, (defaultVal as string[]).length + 3)
      : type === 'image'
        ? undefined
        : Math.min(type === 'textarea' ? 400 : 80, Math.max(30, defLen * 2))
  addSlot(st, {
    key, type,
    label: el.getAttribute('data-label') ?? humanizeKey(key),
    group: el.getAttribute('data-group') ?? groupCtx,
    max,
    default: defaultVal,
    hint: el.getAttribute('data-hint') ?? undefined,
  })
}

// ── anotasi anim ─────────────────────────────────────────────
function animClasses(ns: string, anim: string | undefined): { classes: string[]; attrs: string[] } {
  const classes: string[] = []
  const attrs: string[] = []
  if (!anim) return { classes, attrs }
  for (const part of anim.split(/\s+/)) {
    const [name, arg] = part.split(':')
    if (name === 'reveal') {
      classes.push(`${ns}-rv`, 'lx-reveal')
      if (arg) classes.push(`${ns}-rv-d${arg}`)
    } else if (name === 'sentinel') {
      classes.push('lx-sentinel')
    } else if (name === 'countup') {
      attrs.push('data-cu')
    }
    // 'marquee' = CSS murni penulis mockup — tak ada emisi khusus.
  }
  return { classes, attrs }
}

// ── emitter JSX ──────────────────────────────────────────────
const STRIP_ATTRS = new Set([
  'data-slot', 'data-slot-list', 'data-repeat', 'data-optional', 'data-anim',
  'data-group', 'data-label', 'data-max', 'data-hint', 'data-type', 'data-href',
  'data-fallback', 'data-stagger', 'data-expr', 'data-palette', 'data-count',
])

interface EmitCtx {
  st: CompileState
  ns: string
  group: string
  repeat?: { def: RepeatDef; varName: string }
  indent: string
}

function emitAttrs(el: ParsedElement, ctx: EmitCtx, extra: { classes?: string[]; attrs?: string[]; edit?: string; href?: string; skipSrc?: boolean; key?: string; extraProps?: string[] }): string {
  const out: string[] = []
  const anim = animClasses(ctx.ns, el.getAttribute('data-anim'))
  const classes = [...new Set([...(el.getAttribute('class')?.split(/\s+/).filter(Boolean) ?? []), ...anim.classes, ...(extra.classes ?? [])])]
  if (extra.key) out.push(`key=${extra.key}`)
  if (classes.length) out.push(`className="${classes.join(' ')}"`)
  for (const [rawName, rawVal] of Object.entries(el.attributes)) {
    const name = rawName.toLowerCase()
    if (name === 'class' || STRIP_ATTRS.has(name)) continue
    if (name === 'href' && extra.href !== undefined) continue
    if (name === 'src' && extra.skipSrc) continue
    if (name === 'style') { out.push(`style={${styleToObject(rawVal)}}`); continue }
    const jsxName = ATTR_MAP[name] ?? name
    const val = decodeEntities(rawVal)
    if (val === '' && (name === 'hidden' || name === 'disabled' || name === 'open')) { out.push(jsxName); continue }
    if (name === 'aria-hidden' && val === 'true') { out.push('aria-hidden') ; continue }
    out.push(`${jsxName}="${val.replace(/"/g, '&quot;')}"`)
  }
  if (extra.href !== undefined) out.push(`href={${extra.href}}`)
  for (const a of anim.attrs) out.push(a)
  for (const p of extra.extraProps ?? []) out.push(p)
  if (extra.edit) out.push(`data-edit="${extra.edit}"`)
  return out.length ? ' ' + out.join(' ') : ''
}

function emitChildren(el: ParsedElement, ctx: EmitCtx): string {
  const parts: string[] = []
  for (const child of el.childNodes) {
    if (isElement(child)) {
      parts.push(emitNode(child, { ...ctx, indent: ctx.indent + '  ' }))
    } else {
      const t = normText(child.rawText)
      if (t) parts.push(`${ctx.indent}  ${escapeJsxText(t)}`)
    }
  }
  return parts.join('\n')
}

function wrapGuard(guard: string | undefined, inner: string, indent: string): string {
  if (!guard) return inner
  const body = inner.replace(new RegExp('^' + indent, 'gm'), indent + '  ')
  return `${indent}{${guard} && (\n${body}\n${indent})}`
}

function emitNode(el: ParsedElement, ctx: EmitCtx, skipOptional = false): string {
  const { st, ns } = ctx
  const ind = ctx.indent
  const tag = el.rawTagName
  const group = el.getAttribute('data-group') ?? ctx.group
  const childCtx: EmitCtx = { ...ctx, group }

  // data-expr — escape hatch mini (year).
  const expr = el.getAttribute('data-expr')
  if (expr === 'year') {
    return `${ind}<${tag}${emitAttrs(el, ctx, {})}>{new Date().getFullYear()}</${tag}>`
  }

  // data-optional → guard presence.
  const optional = el.getAttribute('data-optional')
  if (optional && !skipOptional) {
    const g = OPTIONAL_GUARDS[optional]
    if (!g) throw new Error(`data-optional="${optional}" tidak dikenal (pilihan: ${Object.keys(OPTIONAL_GUARDS).join(', ')})`)
    g.uses.forEach((u) => st.uses.add(u))
    const inner = emitNode(el, childCtx, true)
    return wrapGuard(g.guard, inner, ind)
  }

  // data-slot-list → array copy slot (marquee/badge).
  const slotList = el.getAttribute('data-slot-list')
  if (slotList) {
    if (!slotList.startsWith('copy.')) throw new Error(`data-slot-list="${slotList}" wajib namespace copy.*`)
    const kids = el.childNodes.filter(isElement)
    if (!kids.length) throw new Error(`data-slot-list="${slotList}" butuh minimal 1 anak elemen sebagai template`)
    const defaults = kids.map((k) => normText(k.text)).filter(Boolean)
    slotFromElement(st, el, slotList, defaults, group)
    const tpl = kids[0]
    const itemTag = tpl.rawTagName
    const itemAttrs = emitAttrs(tpl, childCtx, { key: '{i}' })
    const listVar = `cp.list('${slotList}')`
    return [
      `${ind}<${tag}${emitAttrs(el, ctx, { edit: slotList })}>`,
      `${ind}  {${listVar}.map((m, i) => (`,
      `${ind}    <${itemTag}${itemAttrs}>{m}</${itemTag}>`,
      `${ind}  ))}`,
      `${ind}</${tag}>`,
    ].join('\n')
  }

  // data-repeat → koleksi konten.
  const repeat = el.getAttribute('data-repeat')
  if (repeat) {
    const def = REPEATS[repeat]
    if (!def) throw new Error(`data-repeat="${repeat}" tidak dikenal (pilihan: ${Object.keys(REPEATS).join(', ')})`)
    def.uses.forEach((u) => st.uses.add(u))
    const kids = el.childNodes.filter(isElement)
    if (!kids.length) throw new Error(`data-repeat="${repeat}" butuh minimal 1 anak elemen sebagai template item`)

    // Panen sample dari SEMUA anak (mockup kurasi = konten default draft).
    if (def.samplePath) {
      const sampleItems = kids.map((k) => harvestRepeatItem(k, def))
      setDeep(st.sample, def.samplePath, sampleItems)
    }

    const tpl = kids[0]
    const v = def.varName
    const stagger = tpl.getAttribute('data-stagger')
    const staggerProp = [
      ...(stagger ? [`style={{ transitionDelay: \`\${(i % ${stagger}) * 0.08}s\` }}`] : []),
      ...(def.rootProps ? def.rootProps(v) : []),
    ]
    const tplInner = emitRepeatTemplate(tpl, { ...childCtx, repeat: { def, varName: v }, indent: ind + '    ' }, staggerProp)
    const containerAttrs: { edit?: string; extraProps?: string[] } = {}
    if (repeat === 'stats') containerAttrs.edit = 'konten:stats'
    if (el.hasAttribute('data-count')) containerAttrs.extraProps = [`data-count={${def.listExpr}.length}`]

    const fallback = el.getAttribute('data-fallback')
    let mapExpr = [
      `${ind}  {${def.listExpr}.map((${v}, i) => (`,
      tplInner,
      `${ind}  ))}`,
    ].join('\n')
    if (fallback) {
      const eq = fallback.indexOf('=')
      if (eq < 0) throw new Error(`data-fallback wajib format "copy.key=Teks bawaan" (dapat: "${fallback}")`)
      const fbKey = fallback.slice(0, eq)
      const fbDefault = fallback.slice(eq + 1)
      slotFromElement(st, el, fbKey, fbDefault, group)
      const fbTag = tpl.rawTagName
      const fbClass = tpl.getAttribute('class')
      mapExpr = [
        `${ind}  {${def.listExpr}.length`,
        `${ind}    ? ${def.listExpr}.map((${v}, i) => (`,
        tplInner.replace(new RegExp('^' + ind + '    ', 'gm'), ind + '      '),
        `${ind}    ))`,
        `${ind}    : <${fbTag}${fbClass ? ` className="${fbClass}"` : ''} data-edit="${fbKey}">{cp.t('${fbKey}')}</${fbTag}>}`,
      ].join('\n')
    }
    return [
      `${ind}<${tag}${emitAttrs(el, ctx, containerAttrs)}>`,
      mapExpr,
      `${ind}</${tag}>`,
    ].join('\n')
  }

  // data-slot → nilai tunggal (copy.* atau path konten dikenal).
  const slot = el.getAttribute('data-slot')
  if (slot) {
    if (ctx.repeat) return emitRepeatSlot(el, ctx, slot)
    return emitScalarSlot(el, childCtx, slot)
  }

  if (VOID_TAGS.has(tag)) return `${ind}<${tag}${emitAttrs(el, ctx, {})} />`

  const kids = emitChildren(el, childCtx)
  if (!kids) {
    // Elemen kosong (spacer/ikon CSS) — pertahankan.
    return `${ind}<${tag}${emitAttrs(el, ctx, {})} />`
  }
  return `${ind}<${tag}${emitAttrs(el, ctx, {})}>\n${kids}\n${ind}</${tag}>`
}

function emitScalarSlot(el: ParsedElement, ctx: EmitCtx, slot: string): string {
  const { st, ns } = ctx
  const ind = ctx.indent
  const tag = el.rawTagName

  if (slot.startsWith('copy.')) {
    const def = normText(el.rawTagName === 'img' ? (el.getAttribute('src') ?? '') : el.text)
    slotFromElement(st, el, slot, def, ctx.group)
    if (tag === 'img') {
      if (!def.startsWith('https://')) st.warnings.push(`slot image ${slot}: src mockup bukan https:// (validator portal menolak nilai non-https)`)
      return `${ind}<${tag}${emitAttrs(el, ctx, { skipSrc: true, edit: slot })} src={cp.t('${slot}')} />`
    }
    const href = el.getAttribute('data-href') === 'wa' ? (st.uses.add('wa'), 'waUrl') : undefined
    return `${ind}<${tag}${emitAttrs(el, ctx, { edit: slot, href })}>{cp.t('${slot}')}</${tag}>`
  }

  const known = KNOWN_PATHS[slot]
  if (!known) throw new Error(`data-slot="${slot}" bukan copy.* dan bukan path ComposableContent dikenal (lihat README §binding)`)
  known.uses?.forEach((u) => st.uses.add(u))

  // Panen sample + default autoSlot dari teks mockup.
  const mockText = normText(tag === 'img' ? (el.getAttribute('alt') ?? '') : el.text)
  if (known.img) {
    const src = el.getAttribute('src') ?? ''
    if (src) setDeep(st.sample, slot, src)
  } else if (mockText && !known.autoSlot) {
    setDeep(st.sample, slot, mockText)
  }
  if (known.autoSlot) {
    addSlot(st, {
      key: known.autoSlot, type: 'text',
      label: known.autoSlotLabel ?? humanizeKey(known.autoSlot),
      group: known.autoSlotGroup ?? ctx.group,
      max: 40, default: mockText,
      hint: 'Dipakai bila konten tidak menyetel teksnya sendiri.',
    })
  }

  if (known.img) {
    const inner = `${ind}<${tag}${emitAttrs(el, ctx, { skipSrc: true, edit: known.edit })} src={${known.expr}} />`
    return wrapGuard(known.guard, inner, ind)
  }

  let href: string | undefined
  if (known.hrefExpr && tag === 'a') {
    const mockHref = el.getAttribute('href') ?? '#'
    href = known.hrefExpr.replace("'%MOCK%'", q(mockHref))
  } else if (el.getAttribute('data-href') === 'wa') {
    st.uses.add('wa')
    href = 'waUrl'
  }

  const inner = `${ind}<${tag}${emitAttrs(el, ctx, { edit: known.edit, href })}>{${known.expr}}</${tag}>`
  return wrapGuard(known.guard, inner, ind)
}

function emitRepeatSlot(el: ParsedElement, ctx: EmitCtx, slot: string): string {
  const { st } = ctx
  const ind = ctx.indent
  const tag = el.rawTagName
  const rep = ctx.repeat
  if (!rep) throw new Error('emitRepeatSlot dipanggil di luar repeat')

  if (slot.startsWith('copy.')) return emitScalarSlot(el, ctx, slot)

  const field = rep.def.fields[slot]
  if (!field) throw new Error(`data-slot="${slot}" tidak dikenal utk data-repeat (field valid: ${Object.keys(rep.def.fields).join(', ')})`)
  if (field.price) st.uses.add('price')
  const exprStr = field.expr(rep.varName)

  if (field.img) {
    const inner = `${ind}<${tag}${emitAttrs(el, ctx, { skipSrc: true })} src={${exprStr}} />`
    return wrapGuard(field.guard?.(rep.varName), inner, ind)
  }
  const href = field.hrefExpr && tag === 'a' ? field.hrefExpr(rep.varName) : undefined
  const inner = `${ind}<${tag}${emitAttrs(el, ctx, { href })}>{${exprStr}}</${tag}>`
  return wrapGuard(field.guard?.(rep.varName), inner, ind)
}

function emitRepeatTemplate(tpl: ParsedElement, ctx: EmitCtx, extraProps: string[]): string {
  const rep = ctx.repeat
  if (!rep) throw new Error('template repeat tanpa konteks')
  const ind = ctx.indent
  const tag = tpl.rawTagName
  const attrs = emitAttrs(tpl, ctx, { key: '{i}', extraProps })
  const kids: string[] = []
  for (const child of tpl.childNodes) {
    if (isElement(child)) kids.push(emitNode(child, { ...ctx, indent: ind + '  ' }))
    else {
      const t = normText(child.rawText)
      if (t) kids.push(`${ind}  ${escapeJsxText(t)}`)
    }
  }
  return `${ind}<${tag}${attrs}>\n${kids.join('\n')}\n${ind}</${tag}>`
}

function harvestRepeatItem(el: ParsedElement, def: RepeatDef): Record<string, unknown> {
  const item: Record<string, unknown> = {}
  const walk = (n: ParsedElement): void => {
    const s = n.getAttribute('data-slot')
    if (s && def.fields[s]) {
      const f = def.fields[s]
      if (f.img) {
        const src = n.getAttribute('src')
        if (src) item[s] = src
      } else {
        const t = normText(n.text)
        if (t) {
          if (f.price) {
            const digits = t.replace(/[^\d]/g, '')
            if (digits) item[s] = parseInt(digits, 10)
          } else if (f.numeric) {
            const digits = t.replace(/[^\d]/g, '')
            if (digits) item[s] = parseInt(digits, 10)
          } else {
            item[s] = t
          }
        }
      }
    }
    n.childNodes.filter(isElement).forEach(walk)
  }
  walk(el)
  return item
}

// ── CSS: ekstraksi palet + font ──────────────────────────────
interface CssExtract {
  css: string
  importUrl: string
  display: string
  body: string
  palettes: Record<string, Record<string, string>>
  roles: string[]
}

function extractCss(rawCss: string, ns: string, defaultVariant: string): CssExtract {
  let css = rawCss

  const importMatch = css.match(/@import\s+url\(['"]?([^'")]+)['"]?\);?/)
  if (!importMatch) throw new Error('CSS mockup wajib punya @import url(...) Google Fonts')
  const importUrl = importMatch[1]
  css = css.replace(/@import\s+url\([^)]*\);?\s*/g, '')

  const palettes: Record<string, Record<string, string>> = {}
  let display = ''
  let body = ''
  const rootRe = /:root(?:\[data-palette=["']([^"']+)["']\])?\s*\{([^}]*)\}/g
  css = css.replace(rootRe, (_m, palId: string | undefined, bodyCss: string) => {
    const id = palId ?? defaultVariant
    const roles: Record<string, string> = {}
    const propRe = new RegExp(`--${ns}-([A-Za-z][A-Za-z0-9]*)\\s*:\\s*([^;]+);?`, 'g')
    let pm: RegExpExecArray | null
    while ((pm = propRe.exec(bodyCss))) {
      const role = pm[1]
      const val = pm[2].trim()
      if (role === 'display') { if (!palId) display = val; continue }
      if (role === 'body') { if (!palId) body = val; continue }
      roles[role] = val
    }
    palettes[id] = { ...(palettes[id] ?? {}), ...roles }
    return ''
  })
  if (!display || !body) throw new Error(`:root wajib mendeklarasikan --${ns}-display dan --${ns}-body`)
  if (!palettes[defaultVariant] || !Object.keys(palettes[defaultVariant]).length) {
    throw new Error(`:root wajib mendeklarasikan palet bawaan (--${ns}-<role>)`)
  }
  const roles = Object.keys(palettes[defaultVariant])
  for (const [id, pal] of Object.entries(palettes)) {
    for (const r of roles) if (!(r in pal)) throw new Error(`palet "${id}" tidak mendefinisikan role "${r}" (semua palet wajib role set sama)`)
  }
  return { css: css.trim(), importUrl, display, body, palettes, roles }
}

// ── emit file: renderer ──────────────────────────────────────
function emitRenderer(meta: ThemeMeta, cssX: CssExtract, bodyJsx: string, st: CompileState, slotsConst: string): string {
  const ns = meta.ns
  const palType = `${cap(ns)}Pal`
  const uses = st.uses
  const roles = cssX.roles

  const palEntries = Object.entries(cssX.palettes).map(([id, pal]) => {
    const rows = roles.map((r) => `    ${r}: ${q(pal[r])},`).join('\n')
    return `  ${/^[a-z][a-z0-9]*$/i.test(id) ? id : q(id)}: {\n${rows}\n  },`
  }).join('\n')

  const rootVars = roles.map((r) => `    '--${ns}-${r}': p.${r},`).join('\n')

  const prelude: string[] = []
  prelude.push(`  const p = PALETTES[variant] ?? PALETTES.${meta.defaultVariant ?? 'bawaan'}`)
  prelude.push('  const fx = font ?? DEFAULT_FONT')
  prelude.push(`  const cp = copyGetter(c.themeCopy, ${slotsConst})`)
  if (uses.has('hero')) prelude.push('  const hero = c.hero ?? {}')
  if (uses.has('items')) prelude.push('  const items = c.showcase?.items ?? []')
  if (uses.has('features')) prelude.push('  const features = c.features ?? []')
  if (uses.has('stats')) prelude.push('  const stats = c.stats ?? []')
  if (uses.has('testimonials')) prelude.push('  const testimonials = c.testimonials ?? []')
  if (uses.has('faqs')) prelude.push('  const faqs = c.faq ?? []')
  if (uses.has('jam')) prelude.push('  const jamRows = c.info?.jam ?? []')
  if (uses.has('wa')) {
    prelude.push('  const wa = c.contact?.wa')
    prelude.push("  const waUrl = wa ? `https://wa.me/${wa}` : '#kontak'")
  }
  if (uses.has('price')) {
    prelude.push('  const { locale, currency } = moneyFromConfig(localeConfig)')
    prelude.push('  const fmt = (n: number) => formatMoney(n, locale, currency)')
    prelude.push("  const priceText = (n?: number) => (typeof n === 'number' && n > 0 ? fmt(n) : 'Tanya')")
  }

  const moneyImport = uses.has('price') ? "\nimport { formatMoney, moneyFromConfig } from '@/lib/format-money'" : ''

  return `'use client'
// ============================================================
// GENERATED — jangan edit manual. Sumber: theme-sources/${meta.theme}/index.html
// Regenerasi: npx tsc -p scripts/html-theme/tsconfig.json && node .tmp-html-theme/compile.js ${meta.theme}
// ${meta.identity ?? `Tema bespoke '${meta.theme}' (source: ${meta.source})`}
// Interaksi via LUX_JS bersama (hook .lx-*); styling namespace .${ns}-*.
// ============================================================
import type { BespokeProps } from './types'
import { LUX_JS } from './lux-script'
import { copyGetter } from '@/lib/theme-system/theme-copy'
import { ${slotsConst} } from './slots/${meta.theme}.slots'${moneyImport}

export interface ${palType} {
${roles.map((r) => `  ${r}: string`).join('\n')}
}

export const PALETTES: Record<string, ${palType}> = {
${palEntries}
}

const FONT_IMPORT = ${q(cssX.importUrl)}
const DISPLAY = ${q(cssX.display)}
const BODY = ${q(cssX.body)}
type ThemeFont = { importUrl: string; display: string; body: string }
const DEFAULT_FONT: ThemeFont = { importUrl: FONT_IMPORT, display: DISPLAY, body: BODY }

function themeCss(f: ThemeFont): string {
  return \`
@import url('\${f.importUrl}');
${escapeTemplate(cssX.css)}
\`
}

export default function ${meta.rendererName}({ content: c, variant = ${q(meta.defaultVariant ?? 'bawaan')}, localeConfig, font }: BespokeProps) {
${prelude.join('\n')}

  const rootStyle = {
${rootVars}
    '--${ns}-display': fx.display,
    '--${ns}-body': fx.body,
  } as React.CSSProperties

  return (
    <div className="${ns}-root lx-root" data-variant={variant} style={rootStyle}>
      <style dangerouslySetInnerHTML={{ __html: themeCss(fx) }} />
${bodyJsx}
      <script dangerouslySetInnerHTML={{ __html: LUX_JS }} />
    </div>
  )
}
`
}

// ── emit file: slots manifest ────────────────────────────────
function emitSlots(meta: ThemeMeta, st: CompileState, slotsConst: string): string {
  // SEO selalu tersedia (dibaca generateMetadata [slug]/page.tsx).
  addSlot(st, { key: 'copy.seo_title', type: 'text', label: 'Judul tab browser (SEO)', group: 'SEO', max: 70, default: '', hint: 'Kosong = pakai judul bawaan situs.' })
  addSlot(st, { key: 'copy.seo_description', type: 'textarea', label: 'Deskripsi hasil pencarian (SEO)', group: 'SEO', max: 160, default: '' })

  const byGroup = new Map<string, SlotDef[]>()
  for (const s of st.slots) {
    const arr = byGroup.get(s.group) ?? []
    arr.push(s)
    byGroup.set(s.group, arr)
  }
  const blocks: string[] = []
  for (const [group, defs] of byGroup) {
    blocks.push(`    // ── ${group} ──`)
    for (const d of defs) {
      const parts = [
        `key: ${q(d.key)}`, `type: ${q(d.type)}`, `label: ${q(d.label)}`, `group: ${q(d.group)}`,
      ]
      if (d.max !== undefined && !Number.isNaN(d.max)) parts.push(`max: ${d.max}`)
      const defStr = Array.isArray(d.default) ? `[${d.default.map(q).join(', ')}]` : q(d.default)
      parts.push(`default: ${defStr}`)
      if (d.hint) parts.push(`hint: ${q(d.hint)}`)
      blocks.push(`    { ${parts.join(', ')} },`)
    }
  }
  return `// ============================================================
// GENERATED — jangan edit manual. Sumber: theme-sources/${meta.theme}/index.html
// Manifest slot tema '${meta.theme}': default = copy mockup verbatim (mockup =
// draft klien; teks kosong di portal = kembali ke bawaan ini).
// ============================================================
import type { ThemeSlotManifest } from '@/lib/theme-system/slot-schema'

export const ${slotsConst}: ThemeSlotManifest = {
  theme: ${q(meta.theme)},
  fields: [
${blocks.join('\n')}
  ],
}
`
}

// ── emit file: contrast test ─────────────────────────────────
function emitContrastTest(meta: ThemeMeta, cssX: CssExtract): string {
  const surfaces = ['bg', 'bg2', 'surface', 'surface2'].filter((r) => cssX.roles.includes(r))
  const isHex = (v: string) => /^#[0-9a-fA-F]{3,8}$/.test(v)
  // Role teks yang diuji hanya bila hex solid di SEMUA palet.
  const testable = (role: string) => cssX.roles.includes(role) && Object.values(cssX.palettes).every((p) => isHex(p[role]))
  const lines: string[] = []
  if (testable('ink')) lines.push(`      it('ink AAA (>=7) di semua permukaan', () => { for (const s of SURFACES) expect(cr(p.ink, p[s])).toBeGreaterThanOrEqual(7) })`)
  if (testable('inkDim')) lines.push(`      it('inkDim AA (>=4.5) di semua permukaan', () => { for (const s of SURFACES) expect(cr(p.inkDim, p[s])).toBeGreaterThanOrEqual(4.5) })`)
  if (testable('muted')) lines.push(`      it('muted AA (>=4.5) di semua permukaan', () => { for (const s of SURFACES) expect(cr(p.muted, p[s])).toBeGreaterThanOrEqual(4.5) })`)
  if (testable('accentDeep')) lines.push(`      it('accentDeep AA (>=4.5) di semua permukaan', () => { for (const s of SURFACES) expect(cr(p.accentDeep, p[s])).toBeGreaterThanOrEqual(4.5) })`)
  if (testable('onAccent') && testable('accentDeep')) lines.push(`      it('onAccent AA (>=4.5) di atas accentDeep (bg tombol solid)', () => { expect(cr(p.onAccent, p.accentDeep)).toBeGreaterThanOrEqual(4.5) })`)

  return `// ============================================================
// GENERATED — jangan edit manual. Sumber: theme-sources/${meta.theme}/index.html
// Contrast gate WCAG utk semua palet ${meta.rendererName} (aturan tema LIGHT
// wajib contrast.test — DESIGN_LEDGER).
// ============================================================
import { describe, it, expect } from 'vitest'
import { PALETTES } from './${meta.rendererName}'

function chan(v: number): number {
  const s = v / 255
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
}
function lum(hex: string): number {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map((ch) => ch + ch).join('') : h
  const n = parseInt(full.slice(0, 6), 16)
  return 0.2126 * chan((n >> 16) & 255) + 0.7152 * chan((n >> 8) & 255) + 0.0722 * chan(n & 255)
}
function cr(a: string, b: string): number {
  const L1 = Math.max(lum(a), lum(b))
  const L2 = Math.min(lum(a), lum(b))
  return (L1 + 0.05) / (L2 + 0.05)
}

const SURFACES = [${surfaces.map(q).join(', ')}] as const

describe('${meta.rendererName} PALETTES — WCAG contrast', () => {
  for (const [name, p] of Object.entries(PALETTES)) {
    describe(\`palet "\${name}"\`, () => {
${lines.join('\n')}
    })
  }
})
`
}

// ── emit file: sample content ────────────────────────────────
function serialize(v: unknown, indent: string): string {
  if (typeof v === 'string') return q(v)
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  if (Array.isArray(v)) {
    if (!v.length) return '[]'
    const rows = v.map((x) => `${indent}  ${serialize(x, indent + '  ')},`)
    return `[\n${rows.join('\n')}\n${indent}]`
  }
  if (v && typeof v === 'object') {
    const entries = Object.entries(v as Record<string, unknown>)
    if (!entries.length) return '{}'
    const rows = entries.map(([k, val]) => {
      const key = /^[A-Za-z_][A-Za-z0-9_]*$/.test(k) ? k : q(k)
      return `${indent}  ${key}: ${serialize(val, indent + '  ')},`
    })
    return `{\n${rows.join('\n')}\n${indent}}`
  }
  return 'undefined'
}

function emitSample(meta: ThemeMeta, st: CompileState): string {
  const constName = meta.theme.replace(/-/g, '_').toUpperCase() + '_SAMPLE'
  const json = serialize(st.sample, '')
  return `// ============================================================
// GENERATED — jangan edit manual. Sumber: theme-sources/${meta.theme}/index.html
// Sample content '${meta.theme}' — dipanen dari copy kurasi mockup (mockup =
// draft build klien, gap mockup≠live tertutup by construction). Wire manual:
// import + daftarkan di sample-content.ts (BY_SUBKATEGORI / LUX_SAMPLE_ALIAS).
// ============================================================
import type { ComposableContent } from '../manifest'

export const ${constName}: ComposableContent = ${json} as ComposableContent
`
}

// ── main ─────────────────────────────────────────────────────
function main(): void {
  const themeArg = process.argv[2]
  if (!themeArg) {
    console.error('usage: node compile.js <theme>   (folder di theme-sources/)')
    process.exit(1)
  }
  const repoRoot = path.resolve(__dirname, '..', '..')
  // Saat dijalankan dari .tmp-html-theme hasil tsc, __dirname = .tmp-html-theme → naik 1.
  const root = fs.existsSync(path.join(repoRoot, 'theme-sources')) ? repoRoot : path.resolve(__dirname, '..')
  const srcDir = path.join(root, 'theme-sources', themeArg)
  const metaPath = path.join(srcDir, 'theme.json')
  const htmlPath = path.join(srcDir, 'index.html')
  if (!fs.existsSync(metaPath) || !fs.existsSync(htmlPath)) {
    console.error(`theme-sources/${themeArg}/ wajib berisi theme.json + index.html`)
    process.exit(1)
  }
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8')) as ThemeMeta
  for (const req of ['theme', 'rendererName', 'ns', 'source'] as const) {
    if (!meta[req]) throw new Error(`theme.json wajib field "${req}"`)
  }
  const defaultVariant = meta.defaultVariant ?? 'bawaan'
  if (!/^[a-z][a-zA-Z0-9]*$/.test(defaultVariant)) throw new Error('defaultVariant wajib identifier sederhana (a-z…)')
  meta.defaultVariant = defaultVariant

  const html = fs.readFileSync(htmlPath, 'utf8')
  const rootNode = parse(html, { comment: false })

  const styleEls = rootNode.querySelectorAll('style')
  if (!styleEls.length) throw new Error('index.html wajib punya <style> inline (self-contained)')
  const rawCss = styleEls.map((s) => s.text).join('\n')
  const cssX = extractCss(rawCss, meta.ns, defaultVariant)
  for (const [id, pal] of Object.entries(meta.extraPalettes ?? {})) {
    for (const r of cssX.roles) if (!(r in pal)) throw new Error(`extraPalettes.${id} tidak mendefinisikan role "${r}"`)
    cssX.palettes[id] = pal
  }

  const bodyEl = rootNode.querySelector('body')
  if (!bodyEl) throw new Error('index.html wajib punya <body>')

  const st: CompileState = {
    meta, slots: [], slotKeys: new Set(), uses: new Set(), sample: {}, warnings: [],
  }
  // nama sample dari data-slot="nama" pertama.
  const namaEl = bodyEl.querySelector('[data-slot="nama"]')
  if (namaEl) st.sample.nama = normText(namaEl.text)

  const sections: string[] = []
  for (const child of bodyEl.childNodes) {
    if (isElement(child)) {
      sections.push(emitNode(child, { st, ns: meta.ns, group: 'Umum', indent: '      ' }))
    }
  }
  const bodyJsx = sections.join('\n\n')

  // Sample field yang tak terpanen dari HTML (contact.wa dsb) dari theme.json.
  for (const [k, v] of Object.entries(meta.sampleExtra ?? {})) setDeep(st.sample, k, v)

  const slotsConst = meta.theme.replace(/-/g, '_').toUpperCase() + '_SLOTS'
  const rendererOut = emitRenderer(meta, cssX, bodyJsx, st, slotsConst)
  const slotsOut = emitSlots(meta, st, slotsConst)
  const contrastOut = emitContrastTest(meta, cssX)
  const sampleOut = emitSample(meta, st)

  const bespokeDir = path.join(root, 'src', 'app', 'components', 'themes', 'toko-bespoke')
  const samplesDir = path.join(root, 'src', 'lib', 'theme-system', 'samples')
  fs.mkdirSync(path.join(bespokeDir, 'slots'), { recursive: true })
  fs.mkdirSync(samplesDir, { recursive: true })

  const outputs: [string, string][] = [
    [path.join(bespokeDir, `${meta.rendererName}.tsx`), rendererOut],
    [path.join(bespokeDir, 'slots', `${meta.theme}.slots.ts`), slotsOut],
    [path.join(bespokeDir, `${meta.rendererName}.contrast.test.ts`), contrastOut],
    [path.join(samplesDir, `${meta.theme}.sample.ts`), sampleOut],
  ]
  for (const [file, content] of outputs) {
    fs.writeFileSync(file, content, 'utf8')
    console.log(`  ✓ ${path.relative(root, file)}`)
  }
  for (const w of st.warnings) console.warn(`  ⚠ ${w}`)
  console.log(`
Selesai. Wiring manual (resep ROADMAP_BESPOKE):
  1. registry.ts    → BESPOKE_RENDERERS['${meta.theme}'] = { Renderer, source: '${meta.source}', slots: ${slotsConst}, design: {...} }
  2. taxonomy.ts    → SubKategoriOption ready:true + ThemeOption
  3. sample-content.ts → daftarkan ${meta.theme.replace(/-/g, '_').toUpperCase()}_SAMPLE
  4. DESIGN_LEDGER.md → tambah baris tema (WAJIB dalam PR yang sama)`)
}

main()
