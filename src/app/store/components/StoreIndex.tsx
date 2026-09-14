'use client'

import Link from 'next/link'
import { ArrowRight, Layers3, Search, SlidersHorizontal, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CAPABILITY_TAXONOMY, STORE_INTENT_FILTERS } from '@/lib/store/capabilities'
import {
  STORE_CATEGORY_LABELS,
  STORE_TEMPLATE_REGISTRY,
} from '@/lib/store/templates'
import { STORE_CATEGORY_IDS } from '@/lib/store/types'
import type { CapabilityId, StoreCategoryId } from '@/lib/store/types'
import { matchesStoreFilters } from '@/lib/store/store-filters'
import StoreCard from './StoreCard'
import styles from './StoreIndex.module.css'

function readCategory(value: string | null): StoreCategoryId | '' {
  return STORE_CATEGORY_IDS.find((category) => category === value) ?? ''
}

function readIntent(value: string | null): CapabilityId | '' {
  return STORE_INTENT_FILTERS.some((intent) => intent.id === value) ? value as CapabilityId : ''
}

export default function StoreIndex() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const category = readCategory(searchParams.get('category'))
  const intent = readIntent(searchParams.get('intent'))
  const filters = { query, category, intent }
  const visibleTemplates = STORE_TEMPLATE_REGISTRY.filter((template) => template.storeIndexVisibility === 'visible')
  const filteredTemplates = visibleTemplates.filter((template) => matchesStoreFilters(template, filters))
  const featuredTemplate = visibleTemplates.find((template) => template.featured)
  const hasFilters = Boolean(query || category || intent)

  const updateFilter = (key: 'q' | 'category' | 'intent', value: string) => {
    const next = new URLSearchParams(searchParams.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    router.replace(next.toString() ? `/store?${next.toString()}` : '/store', { scroll: false })
  }

  const resetFilters = () => router.replace('/store', { scroll: false })

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><Layers3 size={15} aria-hidden="true" /> Webzoka Store</p>
          <h1>Pilih fondasi website yang sesuai cara bisnismu bekerja.</h1>
          <p className={styles.heroLede}>
            Enam arah template untuk menjelaskan produk, layanan, jadwal, program, atau unit rental dengan lebih jelas.
          </p>
          <Link className={styles.heroLink} href="#templates">Lihat semua template <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className={styles.heroAside} aria-label="Ringkasan Store">
          <span>06</span>
          <p>arah template</p>
          <small>Preview tersedia untuk setiap arah. Isi dan alur internal dapat dibahas sesuai scope.</small>
        </div>
      </header>

      <section className={styles.discovery} aria-labelledby="discovery-title">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}><Search size={15} aria-hidden="true" /> Cari arah yang tepat</p>
          <h2 id="discovery-title">Mulai dari kebutuhan yang ingin kamu jelaskan.</h2>
        </div>

        <div className={styles.filters} aria-label="Filter template">
          <label className={styles.searchField}>
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Cari template</span>
            <input
              type="search"
              name="q"
              value={query}
              autoComplete="off"
              placeholder="Cari nama, bisnis, atau kemampuan…"
              onChange={(event) => updateFilter('q', event.target.value)}
            />
          </label>

          <div className={styles.selectGroup}>
            <label htmlFor="store-category-filter">
              <span>Kategori bisnis</span>
              <select id="store-category-filter" name="category" value={category} onChange={(event) => updateFilter('category', event.target.value)}>
                <option value="">Semua kategori</option>
                {STORE_CATEGORY_IDS.map((id) => <option key={id} value={id}>{STORE_CATEGORY_LABELS[id]}</option>)}
              </select>
            </label>
            <label htmlFor="store-intent-filter">
              <span>Saya ingin…</span>
              <select id="store-intent-filter" name="intent" value={intent} onChange={(event) => updateFilter('intent', event.target.value)}>
                <option value="">Semua kebutuhan</option>
                {STORE_INTENT_FILTERS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </label>
          </div>
        </div>

        <div className={styles.filterNote}>
          <p><SlidersHorizontal size={15} aria-hidden="true" /> Filter kemampuan mencakup kemampuan dasar dan opsi pengembangan yang dicatat di registry.</p>
          {hasFilters && <button type="button" onClick={resetFilters}><X size={15} aria-hidden="true" /> Reset filter</button>}
        </div>
      </section>

      {featuredTemplate && (
        <section className={styles.featuredSection} aria-labelledby="featured-title">
          <div className={styles.sectionHeadingRow}>
            <div>
              <p className={styles.eyebrow}>Pilihan unggulan</p>
              <h2 id="featured-title">Warm Commerce</h2>
            </div>
            <p>Direction pilihan untuk bisnis kuliner yang ingin membuat menu dan jalur pesan terasa dekat.</p>
          </div>
          <StoreCard template={featuredTemplate} featured />
        </section>
      )}

      <section className={styles.catalog} id="templates" aria-labelledby="templates-title">
        <div className={styles.sectionHeadingRow}>
          <div>
            <p className={styles.eyebrow}>Koleksi template</p>
            <h2 id="templates-title">Enam arah, satu tempat untuk membandingkan.</h2>
          </div>
          <p id="template-results" role="status" aria-live="polite">
            {filteredTemplates.length} dari {visibleTemplates.length} template tampil
          </p>
        </div>

        {filteredTemplates.length > 0 ? (
          <div className={styles.grid}>
            {filteredTemplates.map((template) => <StoreCard key={template.slug} template={template} />)}
          </div>
        ) : (
          <div className={styles.emptyState} role="status" aria-live="polite">
            <Search size={24} aria-hidden="true" />
            <h3>Belum ada template yang cocok.</h3>
            <p>Coba kata kunci atau filter lain. Reset untuk melihat keenam template lagi.</p>
            <button type="button" onClick={resetFilters}>Reset pencarian</button>
          </div>
        )}
      </section>

      <footer className={styles.footer}>
        <span>Webzoka Store · Koleksi template</span>
        <span>Preview demo, bukan checkout atau ketersediaan live.</span>
      </footer>
    </div>
  )
}
