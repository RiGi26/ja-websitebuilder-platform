'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
  MessageCircle,
  Search,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'

type Category = 'All' | 'Seating' | 'Lighting' | 'Tables' | 'Objects'
type ProductKind = 'lamp' | 'chair' | 'table' | 'vessel' | 'shelf' | 'stool'

type Product = {
  id: string
  name: string
  category: Exclude<Category, 'All'>
  price: string
  description: string
  material: string
  detail: string
  variants: string[]
  tone: 'cobalt' | 'chalk' | 'stone' | 'moss' | 'tomato' | 'plum'
  kind: ProductKind
  badge?: string
}

const categories: Category[] = ['All', 'Seating', 'Lighting', 'Tables', 'Objects']

const products: Product[] = [
  {
    id: 'arc-01', name: 'Arc 01 Lamp', category: 'Lighting', price: 'Rp1.850.000',
    description: 'A softened line of light for late tables and early starts.', material: 'Powder-coated steel · opal globe',
    detail: 'A compact table lamp with a dimmable warm-white bulb included.', variants: ['Cobalt', 'Chalk', 'Tomato'], tone: 'cobalt', kind: 'lamp', badge: 'New',
  },
  {
    id: 'fold-03', name: 'Fold 03 Chair', category: 'Seating', price: 'Rp3.400.000',
    description: 'A low, generous seat with a folded profile and an easy posture.', material: 'Ash frame · woven webbing',
    detail: 'Made for dining tables, reading corners, and rooms that change shape.', variants: ['Natural ash', 'Charcoal webbing'], tone: 'chalk', kind: 'chair',
  },
  {
    id: 'plane-02', name: 'Plane 02 Table', category: 'Tables', price: 'Rp4.950.000',
    description: 'A quiet surface, cut to make the objects on it feel intentional.', material: 'Oiled oak veneer · steel base',
    detail: 'A 90 cm side table with a low shelf for the things that stay nearby.', variants: ['Oak', 'Smoked oak'], tone: 'stone', kind: 'table',
  },
  {
    id: 'field-06', name: 'Field Vessel', category: 'Objects', price: 'Rp680.000',
    description: 'A hand-finished shape for branches, fruit, and nothing at all.', material: 'Glazed stoneware',
    detail: 'Every vessel carries small variation from the firing and finishing process.', variants: ['Moss', 'Ink', 'Warm white'], tone: 'moss', kind: 'vessel', badge: 'Small batch',
  },
  {
    id: 'line-04', name: 'Line 04 Shelf', category: 'Objects', price: 'Rp2.250.000',
    description: 'A precise place for the books, objects, and small rituals you keep.', material: 'Folded aluminium · concealed bracket',
    detail: 'A wall shelf with a 60 cm span and concealed mounting hardware.', variants: ['Tomato', 'Cobalt', 'Stone'], tone: 'tomato', kind: 'shelf',
  },
  {
    id: 'block-01', name: 'Block 01 Stool', category: 'Seating', price: 'Rp1.950.000',
    description: 'A useful extra seat with the weight and clarity of a small sculpture.', material: 'Solid rubberwood · satin finish',
    detail: 'Sized to move between a desk, a table, and the edge of a room.', variants: ['Plum', 'Natural', 'Ink'], tone: 'plum', kind: 'stool',
  },
]

function ProductObject({ product, compact = false }: { product: Product; compact?: boolean }) {
  return (
    <div className={`mc-product-object mc-object-${product.kind} ${compact ? 'mc-object-compact' : ''}`} aria-hidden="true">
      <span className="mc-object-shadow" />
      <span className="mc-object-piece mc-object-piece-a" />
      <span className="mc-object-piece mc-object-piece-b" />
      <span className="mc-object-piece mc-object-piece-c" />
    </div>
  )
}

function formatWhatsAppMessage(product: Product, variant: string) {
  return encodeURIComponent(`Hello, I would like to ask about ${product.name} in ${variant}. Please share current availability and delivery options.`)
}

export function ModernCatalogExperience({ mode }: { mode: 'detail' | 'preview' }) {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(products[0].id)
  const [selectedVariant, setSelectedVariant] = useState(products[0].variants[0])

  const selected = products.find((product) => product.id === selectedId) ?? products[0]
  const normalizedQuery = query.trim().toLowerCase()
  const visibleProducts = products.filter((product) => {
    const categoryMatches = activeCategory === 'All' || product.category === activeCategory
    const searchMatches = !normalizedQuery || [product.name, product.category, product.description, product.material]
      .join(' ').toLowerCase().includes(normalizedQuery)
    return categoryMatches && searchMatches
  })

  const selectProduct = (product: Product) => {
    setSelectedId(product.id)
    setSelectedVariant(product.variants[0])
  }

  return (
    <main className="mc-shell">
      {mode === 'preview' && (
        <div className="mc-preview-strip">
          <span>Webzoka Store V2 · interactive template preview</span>
          <Link href="/store/template/modern-catalog">View detail <ArrowUpRight size={14} aria-hidden="true" /></Link>
        </div>
      )}

      <header className="mc-topbar">
        <Link className="mc-brand" href="/store" aria-label="Back to Webzoka Store">
          <span className="mc-brand-mark" aria-hidden="true">W</span>
          <span>Obliq Objects</span>
        </Link>
        <nav className="mc-nav" aria-label="Catalog navigation">
          <a href="#collection">Collection</a>
          <a href="#object-detail">Object detail</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="mc-contact-link" href="#contact">Make an enquiry <ArrowUpRight size={15} aria-hidden="true" /></a>
      </header>

      <section className="mc-hero" aria-labelledby="modern-catalog-title">
        <div className="mc-hero-copy">
          <p className="mc-eyebrow"><Sparkles size={14} aria-hidden="true" /> New collection · 2026</p>
          <h1 id="modern-catalog-title">Objects that<br /><em>hold attention.</em></h1>
          <p className="mc-hero-description">A measured collection of furniture and objects, designed to make one considered choice feel easy.</p>
          <a className="mc-primary-action" href="#collection">Explore the collection <ChevronRight size={18} aria-hidden="true" /></a>
          <p className="mc-hero-footnote">Prototype collection · availability is confirmed by enquiry.</p>
        </div>
        <div className="mc-hero-object" aria-label="Arc 01 Lamp, featured object">
          <div className="mc-hero-grid" aria-hidden="true" />
          <span className="mc-hero-index">01 / 06</span>
          <ProductObject product={products[0]} />
          <div className="mc-hero-caption"><span>Arc 01 Lamp</span><strong>Soft light, sharp line.</strong></div>
        </div>
      </section>

      <section className="mc-discovery" aria-labelledby="collection">
        <div className="mc-section-heading">
          <div>
            <p className="mc-eyebrow" id="collection"><SlidersHorizontal size={14} aria-hidden="true" /> Browse the collection</p>
            <h2>Find the right<br />place to begin.</h2>
          </div>
          <p>Filter by how an object works in the room, or search by name, material, or category.</p>
        </div>

        <div className="mc-catalog-tools">
          <div className="mc-category-rail" aria-label="Product categories">
            {categories.map((category) => (
              <button
                className={activeCategory === category ? 'is-active' : ''}
                type="button"
                key={category}
                aria-pressed={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <label className="mc-search-field">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Search the catalog</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search objects" />
          </label>
        </div>

        <div className="mc-result-summary" aria-live="polite">
          <span>{visibleProducts.length} {visibleProducts.length === 1 ? 'object' : 'objects'} shown</span>
          <span>Every selection opens an enquiry, never a checkout.</span>
        </div>

        {visibleProducts.length > 0 ? (
          <div className="mc-product-grid">
            {visibleProducts.map((product) => (
              <button
                className={`mc-product-card ${selected.id === product.id ? 'is-selected' : ''}`}
                type="button"
                key={product.id}
                aria-pressed={selected.id === product.id}
                onClick={() => selectProduct(product)}
              >
                <span className={`mc-product-visual mc-tone-${product.tone}`}><ProductObject product={product} compact /></span>
                <span className="mc-product-meta">
                  <span className="mc-product-meta-top"><span>{product.category}</span>{product.badge && <b>{product.badge}</b>}</span>
                  <strong>{product.name}</strong>
                  <span>{product.price}</span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="mc-empty-state">
            <Search size={24} aria-hidden="true" />
            <h3>No objects match that search.</h3>
            <p>Try a material, product name, or return to every category.</p>
            <button type="button" onClick={() => { setQuery(''); setActiveCategory('All') }}>Clear search</button>
          </div>
        )}
      </section>

      <section className="mc-detail-section" id="object-detail" aria-labelledby="detail-title">
        <div className={`mc-detail-visual mc-tone-${selected.tone}`}><ProductObject product={selected} /></div>
        <div className="mc-detail-copy">
          <p className="mc-eyebrow">Selected object · {selected.category}</p>
          <h2 id="detail-title">{selected.name}</h2>
          <p className="mc-detail-price">{selected.price}</p>
          <p>{selected.description}</p>
          <p>{selected.detail}</p>
          <dl className="mc-spec-list"><div><dt>Material</dt><dd>{selected.material}</dd></div><div><dt>Inquiry</dt><dd>Availability and delivery confirmed by the studio</dd></div></dl>
          <fieldset className="mc-variant-field">
            <legend>Choose a finish</legend>
            <div>{selected.variants.map((variant) => <button className={selectedVariant === variant ? 'is-active' : ''} type="button" key={variant} aria-pressed={selectedVariant === variant} onClick={() => setSelectedVariant(variant)}>{variant}</button>)}</div>
          </fieldset>
          <a className="mc-primary-action" target="_blank" rel="noreferrer" href={`https://wa.me/?text=${formatWhatsAppMessage(selected, selectedVariant)}`}>
            Ask via WhatsApp <MessageCircle size={18} aria-hidden="true" />
          </a>
          <p className="mc-detail-disclaimer">WhatsApp opens with this item prefilled. Choose the contact before sending; this prototype does not collect or transmit an order.</p>
        </div>
      </section>

      <section className="mc-new-collection" aria-labelledby="new-collection-title">
        <div><p className="mc-eyebrow">Curated for now</p><h2 id="new-collection-title">Small pieces,<br />strong presence.</h2></div>
        <div className="mc-new-collection-list">
          {products.filter((product) => product.badge).map((product, index) => (
            <button type="button" key={product.id} onClick={() => selectProduct(product)}>
              <span>0{index + 1}</span><strong>{product.name}</strong><ChevronRight size={18} aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      <section className="mc-contact-band" id="contact" aria-labelledby="contact-title">
        <div><p className="mc-eyebrow"><Check size={14} aria-hidden="true" /> Clear before committed</p><h2 id="contact-title">Need dimensions,<br />lead time, or a second look?</h2></div>
        <div><p>We confirm current availability, finish options, delivery coverage, and final pricing in the conversation. Nothing is reserved by this preview.</p><a className="mc-secondary-action" target="_blank" rel="noreferrer" href={`https://wa.me/?text=${formatWhatsAppMessage(selected, selectedVariant)}`}>Start a WhatsApp inquiry <ArrowUpRight size={18} aria-hidden="true" /></a></div>
      </section>

      <footer className="mc-footer"><span>Obliq Objects · Modern Catalog prototype</span><Link href="/store"><ArrowLeft size={15} aria-hidden="true" /> Back to Webzoka Store</Link></footer>
    </main>
  )
}
