import Link from 'next/link'
import { ArrowUpRight, Layers3, Search } from 'lucide-react'

export default function StorePage() {
  return (
    <main className="mc-shell mc-store-index">
      <header className="mc-topbar">
        <Link className="mc-brand" href="/store" aria-label="Webzoka Store home">
          <span className="mc-brand-mark" aria-hidden="true">W</span>
          <span>Webzoka Store</span>
        </Link>
        <span className="mc-topbar-note">Prototype collection · V2</span>
      </header>

      <section className="mc-store-intro">
        <p className="mc-eyebrow"><Layers3 size={14} aria-hidden="true" /> Template directions</p>
        <h1>Choose a point of view,<br />then make it yours.</h1>
        <p>
          Each direction starts with a different customer decision. This round adds a crisp,
          product-led catalog for brands that need their collection to lead the conversation.
        </p>
      </section>

      <section className="mc-store-grid" aria-label="Available template directions">
        <article className="mc-store-card mc-store-card-featured">
          <div className="mc-store-card-art mc-art-catalog" aria-hidden="true">
            <span className="mc-art-label">NEW / 02</span>
            <div className="mc-mini-object mc-mini-lamp"><i /><b /></div>
            <div className="mc-mini-copy"><span>MODERN</span><strong>OBJECTS<br />FOR NOW.</strong></div>
          </div>
          <div className="mc-store-card-copy">
            <div>
              <p className="mc-eyebrow">Template #2</p>
              <h2>Modern Catalog</h2>
              <p>For considered objects, tight collections, and enquiries that need context.</p>
            </div>
            <Link className="mc-arrow-link" href="/store/template/modern-catalog">
              Explore direction <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </article>

        <aside className="mc-store-note">
          <Search size={21} aria-hidden="true" />
          <p className="mc-eyebrow">This round</p>
          <h2>One route, one job.</h2>
          <p>
            Search, category discovery, product context, and a direct enquiry path live in the
            Modern Catalog preview. Purchase, payment, and accounts are intentionally absent.
          </p>
          <p className="mc-store-note-foot">Warm Commerce remains outside this prototype round.</p>
        </aside>
      </section>
    </main>
  )
}
