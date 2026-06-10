// ============================================================
// THEME SYSTEM — Mesin composable.
// Membaca ThemeManifest + ComposableContent → resolve TokenPack (base+override)
// → inject CSS vars → rakit balok (Lapis 2) sesuai pilihan manifest.
//
// Urutan section TENGAH (antara hero & footer) = manifest.sections bila ada,
// else DEFAULT_SECTION_ORDER (urutan lama → tema lama nol regresi). Tema lux
// memakai urutan KHAS per industri (rangka beda, bukan cuma palet) + tiap
// section dibungkus .ce-reveal (scroll-reveal via <CeReveal/> observer).
// ============================================================
import { Fragment, type CSSProperties, type ReactNode } from 'react'
import { packToCssVars } from '@/lib/design-tokens/packs'
import {
  type ThemeManifest,
  type ComposableContent,
  type SectionKey,
  resolveManifestPack,
} from '@/lib/theme-system/manifest'
import {
  ENGINE_CSS, Nav, Footer, About, CTA, FloatingWA,
  HeroCentered, HeroSplit, HeroFullbleed, HeroCinematic,
  FeaturesGrid, FeaturesRows, FeaturesZigzag,
  ShowcaseMenuList, ShowcaseCardGrid, ShowcaseLookbook,
  ShowcaseServiceList, ShowcaseArticleFeed, ShowcaseMenuBoard, ShowcaseSignature,
  Stats, StatsRecognition, TestimoniCards, TestimoniSpotlight, TestimoniMarquee,
  FAQ, InfoLokasiBlock, MasonryGallery, BeforeAfterGallery, GalleryEditorial,
  TeamGrid, TeamSpotlight, TeamHorizontal,
  AboutSplitRight, AboutSplitLeft, AboutStory,
  PricingCards, PricingTable, PricingSingle,
  ProcessHorizontal, ProcessTimeline, ProcessCards,
  CTABanner, CTASplit,
  PartnersGrid, PartnersMarquee, SocialStrip,
  StatementBand,
} from './blocks'
import CeReveal from './CeReveal'

// Urutan section tengah DEFAULT (= perilaku lama). Tema tanpa manifest.sections
// memakai ini → output identik dengan sebelum refactor (nol regresi 96 tema).
const DEFAULT_SECTION_ORDER: SectionKey[] = [
  'features', 'statement', 'showcase', 'process', 'stats', 'partners',
  'team', 'testimoni', 'gallery', 'info', 'about', 'pricing', 'faq', 'cta', 'social',
]
// Anchor scroll (tautan Nav) yang dipasang sebelum section terkait — sama spt lama.
const SECTION_ANCHORS: Partial<Record<SectionKey, string>> = {
  showcase: 'showcase', team: 'tim', gallery: 'galeri', info: 'lokasi', about: 'tentang',
}

export default function ComposableRenderer({
  manifest,
  content,
}: {
  manifest: ThemeManifest
  content: ComposableContent
}) {
  const pack = resolveManifestPack(manifest)
  const vars = packToCssVars(pack) as CSSProperties
  const B = manifest.blocks
  // Motif/tekstur otentik (Kerajinan) — ditint warna primary tema final.
  const motif = manifest.motif
  const motifColor = pack.color.primary
  const lux = !!pack.lux

  // Renderer per section — tiap fungsi memeriksa manifest+konten (return null bila
  // tak aktif/kosong → section self-hide). Identik dgn dispatch lama, hanya
  // dipecah supaya bisa di-urutkan oleh manifest.sections.
  const featHeading = { eyebrow: content.featuresEyebrow, title: content.featuresTitle, subtitle: content.featuresSubtitle }
  const teamHeading = { eyebrow: content.teamEyebrow, title: content.teamTitle }
  const renderers: Record<SectionKey, () => ReactNode> = {
    features: () => (content.features && content.features.length > 0)
      ? (B.features === 'rows' ? <FeaturesRows features={content.features} heading={featHeading} />
        : B.features === 'zigzag' ? <FeaturesZigzag features={content.features} heading={featHeading} />
        : <FeaturesGrid features={content.features} heading={featHeading} />)
      : null,
    statement: () => (B.statement && content.statement) ? <StatementBand statement={content.statement} /> : null,
    showcase: () => (content.showcase && content.showcase.items.length > 0)
      ? (B.showcase === 'signature' ? <ShowcaseSignature showcase={content.showcase} />
        : B.showcase === 'lookbook' ? <ShowcaseLookbook showcase={content.showcase} />
        : B.showcase === 'card-grid' ? <ShowcaseCardGrid showcase={content.showcase} />
        : B.showcase === 'service-list' ? <ShowcaseServiceList showcase={content.showcase} />
        : B.showcase === 'article-feed' ? <ShowcaseArticleFeed showcase={content.showcase} />
        : B.showcase === 'menu-board' ? <ShowcaseMenuBoard showcase={content.showcase} />
        : <ShowcaseMenuList showcase={content.showcase} />)
      : null,
    process: () => (B.process && content.process && content.process.steps.length > 0)
      ? (B.process === 'timeline' ? <ProcessTimeline process={content.process} />
        : B.process === 'cards' ? <ProcessCards process={content.process} />
        : <ProcessHorizontal process={content.process} />)
      : null,
    stats: () => (B.stats && content.stats && content.stats.length > 0)
      ? (B.stats === 'recognition' ? <StatsRecognition stats={content.stats} /> : <Stats stats={content.stats} />)
      : null,
    partners: () => (B.partners && content.partners && content.partners.logos.length > 0)
      ? (B.partners === 'marquee' ? <PartnersMarquee partners={content.partners} /> : <PartnersGrid partners={content.partners} />)
      : null,
    team: () => (B.team && content.team && content.team.length > 0)
      ? (B.team === 'spotlight' ? <TeamSpotlight team={content.team} heading={teamHeading} />
        : B.team === 'horizontal' ? <TeamHorizontal team={content.team} heading={teamHeading} />
        : <TeamGrid team={content.team} heading={teamHeading} />)
      : null,
    testimoni: () => (B.testimoni && content.testimonials && content.testimonials.length > 0)
      ? (B.testimoni === 'spotlight' ? <TestimoniSpotlight testimonials={content.testimonials} />
        : B.testimoni === 'marquee' ? <TestimoniMarquee testimonials={content.testimonials} />
        : <TestimoniCards testimonials={content.testimonials} />)
      : null,
    gallery: () => {
      if (B.gallery === 'before-after' && content.gallery?.pairs && content.gallery.pairs.length > 0) return <BeforeAfterGallery gallery={content.gallery} />
      if (B.gallery === 'masonry' && content.gallery?.images && content.gallery.images.length > 0) return <MasonryGallery gallery={content.gallery} />
      if (B.gallery === 'editorial' && content.gallery?.images && content.gallery.images.length > 0) return <GalleryEditorial gallery={content.gallery} />
      return null
    },
    info: () => (B.info && content.info) ? <InfoLokasiBlock info={content.info} /> : null,
    about: () => content.about
      ? (B.about === 'split-right' ? <AboutSplitRight about={content.about} />
        : B.about === 'split-left' ? <AboutSplitLeft about={content.about} />
        : B.about === 'story' ? <AboutStory about={content.about} />
        : <About about={content.about} />)
      : null,
    pricing: () => (B.pricing && content.pricing && content.pricing.plans.length > 0)
      ? (B.pricing === 'table' ? <PricingTable pricing={content.pricing} />
        : B.pricing === 'single' ? <PricingSingle pricing={content.pricing} />
        : <PricingCards pricing={content.pricing} />)
      : null,
    faq: () => (B.faq && content.faq && content.faq.length > 0) ? <FAQ faq={content.faq} /> : null,
    cta: () => content.cta
      ? (B.cta === 'banner' ? <CTABanner cta={content.cta} />
        : B.cta === 'split' ? <CTASplit cta={content.cta} />
        : <CTA cta={content.cta} />)
      : null,
    social: () => (B.social && content.social && content.social.links.length > 0) ? <SocialStrip social={content.social} /> : null,
  }

  const order = manifest.sections ?? DEFAULT_SECTION_ORDER

  return (
    <div className="ce-root" style={vars} data-theme={manifest.id} data-mood={pack.mood} data-lux={lux ? '' : undefined}>
      <style dangerouslySetInnerHTML={{ __html: ENGINE_CSS }} />

      <Nav content={content} />

      {/* Hero — varian dari manifest (cinematic/fullbleed/split/centered) */}
      {B.hero === 'split' ? (
        <HeroSplit hero={content.hero} nama={content.nama} motif={motif} motifColor={motifColor} />
      ) : B.hero === 'fullbleed' ? (
        <HeroFullbleed hero={content.hero} motif={motif} motifColor={motifColor} />
      ) : B.hero === 'cinematic' ? (
        <HeroCinematic hero={content.hero} motif={motif} motifColor={motifColor} />
      ) : (
        <HeroCentered hero={content.hero} motif={motif} motifColor={motifColor} />
      )}

      {/* Section tengah — urutan dari manifest (atau default). Anchor scroll
          dipasang sebelum section terkait (selalu, spt lama). Lux: tiap section
          dibungkus .ce-reveal (scroll-reveal); non-lux: Fragment (nol regresi). */}
      {order.flatMap((key) => {
        const out: ReactNode[] = []
        const anchorId = SECTION_ANCHORS[key]
        if (anchorId) out.push(<div id={anchorId} aria-hidden key={`a-${key}`} />)
        const node = renderers[key]()
        if (node != null) {
          out.push(
            lux
              ? <div className="ce-reveal" key={key}>{node}</div>
              : <Fragment key={key}>{node}</Fragment>,
          )
        }
        return out
      })}

      <Footer content={content} motif={motif} motifColor={motifColor} />
      <FloatingWA wa={content.contact?.wa} />
      {lux && <CeReveal />}
    </div>
  )
}
