# HTML-First Theme Pipeline (pilar E)

Desain tema sebagai **satu file HTML self-contained** (`theme-sources/<theme>/index.html`) → compiler meng-emit renderer TSX + slots manifest + contrast test + sample content. Keputusan arsitektur: **build-time codegen ke TSX**, BUKAN runtime templating (XSS cliff, island tak bisa hydrate, test suite parametrik butuh komponen nyata). Output = kode yang di-commit & direview.

## Menjalankan

```bash
npx tsc -p scripts/html-theme/tsconfig.json
node .tmp-html-theme/compile.js <theme>       # mis. corporate-agency
```

Output:

| File | Isi |
|---|---|
| `src/app/components/themes/toko-bespoke/<Renderer>.tsx` | Renderer bespoke (JSX + guard + `data-edit` + LUX_JS) |
| `.../toko-bespoke/slots/<theme>.slots.ts` | Manifest slot — default = copy mockup **verbatim** |
| `.../toko-bespoke/<Renderer>.contrast.test.ts` | Gate WCAG semua palet |
| `src/lib/theme-system/samples/<theme>.sample.ts` | Sample content dipanen dari mockup |

**File GENERATED dilarang diedit manual** — edit HTML sumber lalu recompile (regen idempotent). Wiring manual setelah compile (resep ROADMAP_BESPOKE): registry, taxonomy, sample-content, baris DESIGN_LEDGER.

## Struktur sumber

```
theme-sources/<theme>/
  theme.json    ← meta
  index.html    ← mockup self-contained (inline <style>, copy kurasi ASLI, @import font)
```

### theme.json

```json
{
  "theme": "corporate-agency",          // key BESPOKE_RENDERERS
  "rendererName": "AgencyRenderer",     // nama komponen
  "ns": "ag",                           // namespace CSS: .ag-*, --ag-*
  "source": "services",                 // etalase SiteRenderer
  "defaultVariant": "bawaan",           // id palet :root tanpa data-palette
  "identity": "satu baris identitas (font/palet/signature) utk header renderer",
  "extraPalettes": { "<id>": { "bg": "#…", "...": "role set sama" } },
  "sampleExtra": { "contact.wa": "6281234567890" }
}
```

### CSS (di `<style>`)

- **Wajib** `@import url(…)` Google Fonts (jadi `FONT_IMPORT`, parametrik utk font pairing Wave 3).
- **Wajib** `:root{ --<ns>-display:…; --<ns>-body:…; --<ns>-bg:…; … }` — `display`/`body` = font stack; sisanya = **role palet** (dipindah compiler ke `rootStyle`, CSS pakai `var(--<ns>-role)`).
- Palet alternatif: `:root[data-palette="<id>"]{ … }` — role set wajib sama dengan bawaan.
- Role yang diuji contrast test (bila hex solid): `ink`/`inkDim`/`muted`/`accentDeep` ≥ ambang di atas `bg`/`bg2`/`surface`/`surface2`; `onAccent` ≥4.5 di atas `accentDeep`. **Tombol solid wajib pakai `accentDeep` sebagai background.**
- Animasi: state tersembunyi-awal WAJIB digate `.lx-js` (kontrak no-JS #138): `.lx-js .<ns>-rv{opacity:0;…}` + `.lx-js .<ns>-rv.lx-in{opacity:1}`.

## Anotasi HTML

| Atribut | Arti |
|---|---|
| `data-slot="copy.x"` | teks elemen = default slot; emit `{cp.t('copy.x')}` + `data-edit`. Di `<img>`: bind `src` (type `image`, wajib https). |
| `data-slot="<path dikenal>"` | bind pipe ComposableContent existing (lihat daftar di bawah); teks mockup men-seed sample content |
| `data-slot-list="copy.x"` | array string (pita/marquee); anak-anak elemen = default list, anak pertama = template |
| `data-repeat="<koleksi>"` | anak pertama = template item (`data-slot` relatif); SEMUA anak dipanen jadi sample |
| `data-optional="<blok>"` | bungkus guard kehadiran (kontrak hide-contract) |
| `data-anim="reveal"` / `reveal:2` / `sentinel` / `countup` | map ke primitive lux-script (`.lx-*`); `marquee` = CSS murni penulis |
| `data-group` / `data-label` / `data-max` / `data-hint` / `data-type` | metadata manifest (group accordion portal, dsb); `data-group` di section berlaku ke slot di dalamnya |
| `data-href="wa"` | `href={waUrl}` (WhatsApp dari `contact.wa`) |
| `data-stagger="3"` | template repeat: `transitionDelay` `(i % 3) * 0.08s` |
| `data-count` | container repeat: emit `data-count={list.length}` (grid sparse mode) |
| `data-fallback="copy.x=Teks"` | container repeat kosong → render fallback slot (tag+class template) |
| `data-expr="year"` | `{new Date().getFullYear()}` |

**Aturan binding**: path yang BUKAN `copy.*` wajib path ComposableContent dikenal — `nama`, `hero.eyebrow|title|subtitle|image|ctaText|ctaText2`, `featuresEyebrow|featuresTitle`, `showcase.title|subtitle`, `statement.eyebrow|quote|cite`, `about.title|body|image|ctaText`, `cta.title|subtitle|ctaText`, `contact.alamat|email`. Koleksi `data-repeat`: `showcase.items` (nama/harga/desc/gambar/kategori/durasi), `features` (title/desc/image), `stats` (angka/label), `faq` (q/a), `testimonials` (quote/nama/peran), `team` (nama/peran/foto), `info.jam` (hari/jam). Sisanya → `copy.*`.

`hero.ctaText`, `hero.ctaText2`, `cta.ctaText`, `featuresEyebrow` otomatis dapat fallback copy slot (`copy.hero_cta1` dst) — pola Warung. Slot `copy.seo_title`/`copy.seo_description` selalu ditambahkan otomatis.

**Copy kurasi mockup = default manifest = konten draft klien** → gap "mockup ≠ live" tertutup by construction; owner approve via URL draft preview-token (#240), bukan file HTML statik.

## Batasan (pilot Wave 4)

- `data-cart-slot` (tema toko ber-keranjang) **belum didukung** — tema products/cart tetap jalur hand-written dulu.
- Slot type `link` (href editabel) belum didukung.
- Interaktivitas React stateful (FAQ accordion useState dsb) tidak di-emit — pakai `<details>/<summary>` + CSS, atau primitive lux-script.
- Hand-tweak output = dilarang; kalau butuh penyimpangan, itu bug konvensi → perbaiki compiler/HTML.
