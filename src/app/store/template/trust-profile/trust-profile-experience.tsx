import Link from 'next/link'
import { DM_Serif_Display } from 'next/font/google'
import { ArrowLeft, ArrowUpRight, Check, MessageCircle } from 'lucide-react'

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-arta-display',
})

const services = [
  ['01', 'Position & message', 'Clarify the offer, audience, and language before the page tries to persuade anyone.'],
  ['02', 'Editorial website', 'Build a calm, specific site where the right next step is easy to understand.'],
  ['03', 'Working systems', 'Map the handoffs around an enquiry so a good first impression can continue into useful work.'],
]

const selectedWork = [
  ['Professional practice', 'A clearer first conversation', 'A focused website structure for a specialist whose expertise had outgrown a generic introduction.', 'tp-work-stone'],
  ['Founder-led studio', 'An offer with a proper shape', 'A way to organise services, selected work, and the questions a prospective client needs answered.', 'tp-work-oxide'],
  ['Growing advisory', 'A more useful next step', 'A consultation path that explains how the work starts without pretending every engagement is the same.', 'tp-work-ink'],
]

const process = [
  ['01', 'Understand', 'Learn the context, constraints, and decision the work needs to support.'],
  ['02', 'Define', 'Name the core message, the right audience, and the useful boundaries.'],
  ['03', 'Build', 'Turn the direction into a site and system that people can use with confidence.'],
  ['04', 'Improve', 'Review what the work reveals, then make the next adjustment with care.'],
]

const faqs = [
  ['What happens in an initial consultation?', 'We discuss the decision in front of you, the people involved, and whether there is a useful fit. You leave with a clear sense of the next step, even when that step is not a project together.'],
  ['Do you only work on websites?', 'No. A website is often part of a wider piece of work. We can start with positioning, service structure, or the handoffs that support a client relationship.'],
  ['Can you promise a timeline before we talk?', 'Not responsibly. Scope depends on the problem, available material, and the people who need to contribute. We outline timing after the work is understood.'],
  ['Do you build a CRM or client portal?', 'Those can be useful later. This template only explains the upgrade path; it does not simulate a portal, account, or CRM workflow.'],
]

export function TrustProfileExperience({ mode }: { mode: 'detail' | 'preview' }) {
  return (
    <main className={`tp-shell ${dmSerif.variable}`}>
      <a className="tp-skip-link" href="#arta-main">Skip to content</a>
      {mode === 'preview' && <div className="tp-preview-strip"><span>Webzoka Store V2 · Trust Profile preview</span><Link href="/store/template/trust-profile">View the template direction <ArrowUpRight size={14} aria-hidden="true" /></Link></div>}

      <header className="tp-topbar">
        <Link className="tp-brand" href="/store" aria-label="Back to Webzoka Store"><span className="tp-brand-mark" aria-hidden="true">A</span><span>Arta Studio</span></Link>
        <nav className="tp-nav" aria-label="Arta Studio navigation"><a href="#services">Services</a><a href="#work">Selected work</a><a href="#approach">Approach</a><a href="#faq">FAQ</a></nav>
        <a className="tp-topbar-action" href="#consultation">Start a conversation <ArrowUpRight size={16} aria-hidden="true" /></a>
      </header>

      <div id="arta-main">
        <section className="tp-hero" aria-labelledby="trust-profile-title">
          <div className="tp-hero-copy">
            <p className="tp-kicker">Independent practice · Jakarta & beyond</p>
            <h1 id="trust-profile-title">Make the<br /><em>next decision</em><br />clear.</h1>
            <p className="tp-hero-summary">Arta Studio helps professional services turn real expertise into a website, message, and working path people can trust.</p>
            <div className="tp-hero-actions"><a className="tp-button tp-button-primary" href="#consultation">Start a consultation <ArrowUpRight size={18} aria-hidden="true" /></a><a className="tp-text-link" href="#work">See selected work <span aria-hidden="true">↓</span></a></div>
            <p className="tp-hero-note">No inflated claims. No invented social proof. A clear conversation about the work in front of you.</p>
          </div>
          <div className="tp-hero-portrait" aria-label="Editorial Arta Studio brand composition">
            <div className="tp-hero-number" aria-hidden="true">03</div>
            <div className="tp-hero-card"><span className="tp-card-rule" aria-hidden="true" /><p>Arta Studio</p><strong>Structure<br />for useful<br />work.</strong><span className="tp-card-caption">Practice note / 2026</span></div>
            <p className="tp-hero-side-note">A website should make expertise easier to recognise, not louder than it is.</p>
          </div>
        </section>

        <section className="tp-statement" aria-labelledby="statement-title"><p className="tp-kicker">A credibility-led direction</p><h2 id="statement-title">Trust grows when a business explains what it does, how it works, and what it will not promise.</h2><p>That is the job of this template: give a considered professional practice a calm, credible first conversation before a meeting is booked.</p></section>

        <section className="tp-services" id="services" aria-labelledby="services-title">
          <div className="tp-section-heading"><p className="tp-kicker">What the work can hold</p><h2 id="services-title">Services with a reason to exist.</h2></div>
          <div className="tp-service-list">{services.map(([number, title, copy]) => <article className="tp-service" key={number}><span className="tp-service-number">{number}</span><div><h3>{title}</h3><p>{copy}</p></div><a href="#consultation" aria-label={`Discuss ${title}`}>Discuss <ArrowUpRight size={18} aria-hidden="true" /></a></article>)}</div>
        </section>

        <section className="tp-work" id="work" aria-labelledby="work-title">
          <div className="tp-work-intro"><p className="tp-kicker">Selected work</p><h2 id="work-title">Chosen for relevance, not decoration.</h2><p>These short studies show the kind of business question the work can help resolve. They do not use invented results, client logos, or endorsements.</p></div>
          <div className="tp-work-grid">{selectedWork.map(([type, title, copy, accent], index) => <article className={`tp-work-card ${accent}`} key={title}><div className="tp-work-art" aria-hidden="true"><span>0{index + 1}</span><i /></div><p>{type}</p><h3>{title}</h3><p>{copy}</p></article>)}</div>
        </section>

        <section className="tp-process" id="approach" aria-labelledby="process-title"><div className="tp-section-heading"><p className="tp-kicker">A small, deliberate process</p><h2 id="process-title">The work moves in four clear steps.</h2></div><ol className="tp-process-grid">{process.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol></section>

        <section className="tp-about" aria-labelledby="about-title"><div><p className="tp-kicker">About & expertise</p><h2 id="about-title">A practical editorial eye for work that needs to hold up in the room.</h2></div><div className="tp-about-copy"><p>Arta Studio works with independent specialists and small teams when the business has become more capable than the way it is currently described.</p><p>We combine writing, information structure, and digital design so clients can recognise the point of the work before they decide to ask for it.</p><ul aria-label="Areas of expertise"><li><Check size={16} aria-hidden="true" /> Positioning & service architecture</li><li><Check size={16} aria-hidden="true" /> Editorial website direction</li><li><Check size={16} aria-hidden="true" /> Consultation & handoff design</li></ul></div></section>

        <section className="tp-expectations" aria-labelledby="expectations-title"><p className="tp-kicker">A straightforward expectation</p><h2 id="expectations-title">A consultation is a working conversation, not a sales performance.</h2><p>We will ask focused questions, name what is still unclear, and explain the next step. A portal, CRM, booking workflow, or internal system can become a sensible upgrade later, when the business actually needs one.</p></section>

        <section className="tp-faq" id="faq" aria-labelledby="faq-title"><div className="tp-section-heading"><p className="tp-kicker">Professional-services FAQ</p><h2 id="faq-title">Questions worth answering before a call.</h2></div><div className="tp-faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></section>

        <section className="tp-final" id="consultation" aria-labelledby="consultation-title"><p className="tp-kicker">Start with the real question</p><h2 id="consultation-title">What needs to become easier to understand?</h2><p>Tell us where a potential client gets stuck, what has changed in the business, or what the next version of the work needs to support.</p><a className="tp-button tp-button-light" href="mailto:hello@artastudio.example?subject=Arta%20Studio%20consultation">Start a consultation <MessageCircle size={18} aria-hidden="true" /></a><span className="tp-final-note">This opens your email app. It does not create an account or submit data to a portal.</span></section>
      </div>

      <footer className="tp-footer"><span>Arta Studio · Trust Profile prototype</span><Link href="/store"><ArrowLeft size={16} aria-hidden="true" /> Back to Webzoka Store</Link></footer>
    </main>
  )
}
