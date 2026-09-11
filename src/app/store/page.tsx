import Link from 'next/link'
import { ArrowUpRight, CalendarDays, Layers3, Search, ShieldCheck } from 'lucide-react'

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
          Each direction starts with a different customer decision. Choose a product-led catalog
          or a credibility-led professional-services site, then make the direction your own.
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

        <article className="mc-store-card mc-store-card-trust">
          <div className="mc-store-card-art mc-art-trust" aria-hidden="true">
            <span className="mc-art-label">NEW / 03</span>
            <div className="mc-trust-card-index">ARTA<br />STUDIO</div>
            <div className="mc-trust-card-line" />
            <div className="mc-trust-card-copy"><span>CLARITY</span><strong>MAKES<br />TRUST.</strong></div>
          </div>
          <div className="mc-store-card-copy">
            <div>
              <p className="mc-eyebrow"><ShieldCheck size={14} aria-hidden="true" /> Template #3</p>
              <h2>Trust Profile</h2>
              <p>For professional services that earn a conversation through clarity, process, and considered work.</p>
            </div>
            <Link className="mc-arrow-link" href="/store/template/trust-profile">
              Explore direction <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </article>

        <article className="mc-store-card mc-store-card-care">
          <div className="mc-store-card-art mc-art-care" aria-hidden="true">
            <span className="mc-art-label">NEW / 04</span>
            <div className="mc-care-card-orbit mc-care-card-orbit-one" />
            <div className="mc-care-card-orbit mc-care-card-orbit-two" />
            <div className="mc-care-card-note"><CalendarDays size={18} aria-hidden="true" /><span>REQUEST PATH</span><strong>Choose a time.<br />Confirm together.</strong></div>
            <div className="mc-care-card-copy"><span>CARE BOOKING</span><strong>CLARITY<br />BEFORE<br />ARRIVAL.</strong></div>
          </div>
          <div className="mc-store-card-copy">
            <div>
              <p className="mc-eyebrow"><CalendarDays size={14} aria-hidden="true" /> Template #4</p>
              <h2>Care Booking</h2>
              <p>For clinics, practitioners, wellness, and care services that need a clear appointment request path.</p>
            </div>
            <Link className="mc-arrow-link" href="/store/template/care-booking">
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
            Modern Catalog preview. Care Booking adds an appointment request path with admin
            confirmation. Purchase, payment, and accounts are intentionally absent.
          </p>
          <p className="mc-store-note-foot">Warm Commerce remains outside this prototype round.</p>
        </aside>
      </section>
    </main>
  )
}
