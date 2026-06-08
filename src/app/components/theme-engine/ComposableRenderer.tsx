// ============================================================
// THEME SYSTEM — Mesin composable (Sprint 0, S0-2).
// Membaca ThemeManifest + ComposableContent → resolve TokenPack (base+override)
// → inject CSS vars → rakit balok (Lapis 2) sesuai pilihan manifest.
//
// Berdiri SENDIRI, belum di-wire ke SiteRenderer/brief form (S0-3/S0-4) →
// nol regresi terhadap renderer yang sudah live.
// ============================================================
import type { CSSProperties } from 'react'
import { packToCssVars } from '@/lib/design-tokens/packs'
import {
  type ThemeManifest,
  type ComposableContent,
  resolveManifestPack,
} from '@/lib/theme-system/manifest'
import {
  ENGINE_CSS, Nav, Footer, About, CTA, FloatingWA,
  HeroCentered, HeroSplit, HeroFullbleed,
  FeaturesGrid, FeaturesRows, FeaturesZigzag,
  ShowcaseMenuList, ShowcaseCardGrid, ShowcaseLookbook,
  ShowcaseServiceList, ShowcaseArticleFeed, ShowcaseMenuBoard,
  Stats, TestimoniCards, TestimoniSpotlight, TestimoniMarquee,
  FAQ, InfoLokasiBlock, MasonryGallery, BeforeAfterGallery,
  TeamGrid, TeamSpotlight, TeamHorizontal,
  AboutSplitRight, AboutSplitLeft, AboutStory,
  PricingCards, PricingTable, PricingSingle,
  ProcessHorizontal, ProcessTimeline, ProcessCards,
  CTABanner, CTASplit,
  PartnersGrid, PartnersMarquee, SocialStrip,
  StatementBand,
} from './blocks'

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

  return (
    <div className="ce-root" style={vars} data-theme={manifest.id} data-mood={pack.mood}>
      <style dangerouslySetInnerHTML={{ __html: ENGINE_CSS }} />

      <Nav content={content} />

      {/* Hero — varian dari manifest */}
      {B.hero === 'split' ? (
        <HeroSplit hero={content.hero} nama={content.nama} motif={motif} motifColor={motifColor} />
      ) : B.hero === 'fullbleed' ? (
        <HeroFullbleed hero={content.hero} motif={motif} motifColor={motifColor} />
      ) : (
        <HeroCentered hero={content.hero} motif={motif} motifColor={motifColor} />
      )}

      {/* Features (keunggulan) — varian + heading dari konten (bukan generik) */}
      {content.features && content.features.length > 0 && (() => {
        const heading = { eyebrow: content.featuresEyebrow, title: content.featuresTitle, subtitle: content.featuresSubtitle }
        return B.features === 'rows' ? <FeaturesRows features={content.features} heading={heading} /> :
          B.features === 'zigzag' ? <FeaturesZigzag features={content.features} heading={heading} /> :
          <FeaturesGrid features={content.features} heading={heading} />
      })()}

      {/* Signature statement band (craft) — 1 beat editorial, setelah features */}
      {B.statement && content.statement && (
        <StatementBand statement={content.statement} />
      )}

      {/* Showcase produk/menu — varian dari manifest. Varian khas-industri
          (service-list/article-feed/menu-board) mengonsumsi field industri. */}
      {content.showcase && content.showcase.items.length > 0 && (
        B.showcase === 'lookbook' ? (
          <ShowcaseLookbook showcase={content.showcase} />
        ) : B.showcase === 'card-grid' ? (
          <ShowcaseCardGrid showcase={content.showcase} />
        ) : B.showcase === 'service-list' ? (
          <ShowcaseServiceList showcase={content.showcase} />
        ) : B.showcase === 'article-feed' ? (
          <ShowcaseArticleFeed showcase={content.showcase} />
        ) : B.showcase === 'menu-board' ? (
          <ShowcaseMenuBoard showcase={content.showcase} />
        ) : (
          <ShowcaseMenuList showcase={content.showcase} />
        )
      )}

      {/* Process / Cara Kerja (Sprint B) — setelah showcase, sebelum stats */}
      {B.process && content.process && content.process.steps.length > 0 && (
        B.process === 'timeline' ? <ProcessTimeline process={content.process} /> :
        B.process === 'cards' ? <ProcessCards process={content.process} /> :
        <ProcessHorizontal process={content.process} />
      )}

      {/* ── Balok Sprint 5 — hanya bila manifest mengaktifkan & konten ada ── */}
      {B.stats && content.stats && content.stats.length > 0 && (
        <Stats stats={content.stats} />
      )}

      {/* Partner/Logo strip (Sprint C) — setelah stats (klaster kredibilitas) */}
      {B.partners && content.partners && content.partners.logos.length > 0 && (
        B.partners === 'marquee' ? <PartnersMarquee partners={content.partners} /> :
        <PartnersGrid partners={content.partners} />
      )}

      {/* Team/People — Trust layer (Sprint A) */}
      {B.team && content.team && content.team.length > 0 && (
        B.team === 'spotlight' ? <TeamSpotlight team={content.team} /> :
        B.team === 'horizontal' ? <TeamHorizontal team={content.team} /> :
        <TeamGrid team={content.team} />
      )}

      {B.testimoni && content.testimonials && content.testimonials.length > 0 && (
        B.testimoni === 'spotlight' ? (
          <TestimoniSpotlight testimonials={content.testimonials} />
        ) : B.testimoni === 'marquee' ? (
          <TestimoniMarquee testimonials={content.testimonials} />
        ) : (
          <TestimoniCards testimonials={content.testimonials} />
        )
      )}

      {/* Galeri (Sprint 5b) — masonry fasilitas / before-after */}
      {B.gallery === 'before-after' && content.gallery?.pairs && content.gallery.pairs.length > 0 && (
        <BeforeAfterGallery gallery={content.gallery} />
      )}
      {B.gallery === 'masonry' && content.gallery?.images && content.gallery.images.length > 0 && (
        <MasonryGallery gallery={content.gallery} />
      )}

      {B.info && content.info && (
        <InfoLokasiBlock info={content.info} />
      )}

      {/* About — dispatch ke varian (Sprint A); default 'text' = perilaku lama */}
      {content.about && (
        B.about === 'split-right' ? <AboutSplitRight about={content.about} /> :
        B.about === 'split-left' ? <AboutSplitLeft about={content.about} /> :
        B.about === 'story' ? <AboutStory about={content.about} /> :
        <About about={content.about} />
      )}

      {/* Pricing / Paket (Sprint B) — setelah about, sebelum FAQ (objection→harga→FAQ) */}
      {B.pricing && content.pricing && content.pricing.plans.length > 0 && (
        B.pricing === 'table' ? <PricingTable pricing={content.pricing} /> :
        B.pricing === 'single' ? <PricingSingle pricing={content.pricing} /> :
        <PricingCards pricing={content.pricing} />
      )}

      {B.faq && content.faq && content.faq.length > 0 && (
        <FAQ faq={content.faq} />
      )}

      {/* CTA — dispatch ke varian (Sprint B); default 'card' = perilaku lama */}
      {content.cta && (
        B.cta === 'banner' ? <CTABanner cta={content.cta} /> :
        B.cta === 'split' ? <CTASplit cta={content.cta} /> :
        <CTA cta={content.cta} />
      )}

      {/* Social strip (Sprint C) — "Ikuti Kami", dekat footer */}
      {B.social && content.social && content.social.links.length > 0 && (
        <SocialStrip social={content.social} />
      )}

      <Footer content={content} motif={motif} motifColor={motifColor} />
      <FloatingWA wa={content.contact?.wa} />
    </div>
  )
}
