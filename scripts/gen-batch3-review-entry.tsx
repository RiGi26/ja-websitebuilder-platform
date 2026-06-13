// ============================================================
// GENERATOR REVIEW BATCH 3 — HTML untuk UAT visual band add-on +
// fokus hero + artikel blog di bespoke/lux (audit batch 3, PR #138).
// Sample content standar TIDAK punya bands/articles (datang dari add-on),
// jadi di sini di-inject fixture realistis (copy default blueprint
// lib/addons/sections.ts) supaya bisa direview tanpa membeli add-on.
//
// Pakai (jalur tsc→node, sama gen-atelier/gen-lux):
//   npx tsc -p scripts/tsconfig.gen-batch3-review.json
//   node scripts/run-gen.cjs .tmp-gen-batch3 .tmp-gen-batch3/scripts/gen-batch3-review-entry.js
//   (lalu hapus .tmp-gen-batch3)
//
// Output: theme-samples/review-batch3-*.html — artefak review, TIDAK
// diselipkan ke index.html dan boleh dihapus setelah UAT.
// ============================================================
import { writeFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import TokoAtelierRenderer from '../src/app/components/themes/toko-atelier/TokoAtelierRenderer'
import KulinerLuxRenderer from '../src/app/components/themes/toko-bespoke/KulinerLuxRenderer'
import KerajinanLuxRenderer from '../src/app/components/themes/toko-bespoke/KerajinanLuxRenderer'
import RestaurantLuxRenderer from '../src/app/components/themes/restaurant-lux/RestaurantLuxRenderer'
import ComposableRenderer from '../src/app/components/theme-engine/ComposableRenderer'
import { MANIFESTS, type ComposableContent } from '../src/lib/theme-system/manifest'
import { sampleContentForTheme } from '../src/lib/theme-system/sample-content'

// Salinan persis pageDoc() dari gen-samples.test.tsx — jaga paritas output.
function pageDoc(title: string, body: string): string {
  return `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><style>body{margin:0}</style></head><body>${body}</body></html>`
}

// Fixture band = default blueprint B-section (lib/addons/sections.ts).
const BANDS: ComposableContent['bands'] = [
  { preset: 'newsletter', title: 'Tetap Terhubung', subtitle: 'Dapatkan info & promo terbaru dari kami.', ctaText: 'Berlangganan', ctaHref: 'https://wa.me/6281296917963' },
  { preset: 'career', title: 'Bergabung dengan Tim Kami', subtitle: 'Kami selalu terbuka untuk talenta baru. Kirimkan CV dan portofolio Anda.', ctaText: 'Kirim Lamaran', ctaHref: 'https://wa.me/6281296917963' },
]

// Fixture artikel = bentuk hasil articlesFromBlogPosts (add-on blog).
const ARTICLES: ComposableContent['articles'] = {
  title: 'Artikel & Berita',
  items: [
    { nama: 'Lima Pertanyaan Sebelum Memilih Vendor', desc: 'Checklist singkat supaya proyek pertama Anda berjalan mulus.', gambar: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=70', penulis: 'Tim Redaksi', tanggal: '2026-06-01' },
    { nama: 'Studi Kasus: Efisiensi 30% di Lini Produksi', desc: 'Bagaimana otomasi sederhana memangkas waktu tunggu pengiriman.', gambar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&q=70', penulis: 'Admin', tanggal: '2026-05-18' },
    { nama: 'Kabar: Sertifikasi Mutu Diperbarui', desc: 'Komitmen kualitas untuk seluruh klien kami, diaudit ulang tahun ini.', penulis: 'Humas', tanggal: '2026-05-02' },
  ],
}

// Demo fokus hero (foto_hero_focus): geser fokus ke atas (wajah/subjek atas).
const FOCUS = '50% 18%'
const withBatch3 = (c: ComposableContent): ComposableContent => ({
  ...c,
  hero: { ...c.hero, imagePosition: c.hero.image ? FOCUS : undefined },
  bands: BANDS,
})

const out: { file: string; title: string; html: string }[] = [
  {
    file: 'review-batch3-atelier.html',
    title: 'REVIEW B3 — Atelier Noir + band newsletter/career',
    html: renderToStaticMarkup(<TokoAtelierRenderer content={withBatch3(sampleContentForTheme('toko-atelier'))} variant="noir" />),
  },
  {
    file: 'review-batch3-kuliner.html',
    title: 'REVIEW B3 — Kuliner Tungku + band + fokus hero 50% 18%',
    html: renderToStaticMarkup(<KulinerLuxRenderer content={withBatch3(sampleContentForTheme('kuliner-lux'))} variant="tungku" />),
  },
  {
    file: 'review-batch3-kerajinan.html',
    title: 'REVIEW B3 — Tanah Loka + band + fokus hero 50% 18%',
    html: renderToStaticMarkup(<KerajinanLuxRenderer content={withBatch3(sampleContentForTheme('kerajinan-lux'))} variant="tanah" />),
  },
  {
    file: 'review-batch3-restaurantlux.html',
    title: 'REVIEW B3 — RestaurantLux Aurum + band + fokus hero 50% 18%',
    html: renderToStaticMarkup(<RestaurantLuxRenderer content={withBatch3(sampleContentForTheme('finedining-aurum'))} variant="aurum" />),
  },
  {
    file: 'review-batch3-lux-articles.html',
    title: 'REVIEW B3 — Lux Corporate + artikel blog (add-on) + band',
    html: renderToStaticMarkup(
      <ComposableRenderer
        manifest={MANIFESTS['lux-corporate']}
        content={{ ...withBatch3(sampleContentForTheme('lux-corporate')), articles: ARTICLES }}
      />,
    ),
  },
]

for (const o of out) {
  writeFileSync(`theme-samples/${o.file}`, pageDoc(o.title, o.html))
  console.log(`ok theme-samples/${o.file} (${(o.html.length / 1024).toFixed(1)} KB)`)
}
