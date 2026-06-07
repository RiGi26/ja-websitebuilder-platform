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
  Stats, TestimoniCards, TestimoniSpotlight, TestimoniMarquee,
  FAQ, InfoLokasiBlock, MasonryGallery, BeforeAfterGallery,
  TeamGrid, TeamSpotlight, TeamHorizontal,
  AboutSplitRight, AboutSplitLeft, AboutStory,
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
    <div className="ce-root" style={vars} data-theme={manifest.id}>
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

      {/* Features (keunggulan / "Mengapa Kami") — varian dari manifest */}
      {content.features && content.features.length > 0 && (
        B.features === 'rows' ? <FeaturesRows features={content.features} /> :
        B.features === 'zigzag' ? <FeaturesZigzag features={content.features} /> :
        <FeaturesGrid features={content.features} />
      )}

      {/* Showcase produk/menu — varian dari manifest */}
      {content.showcase && content.showcase.items.length > 0 && (
        B.showcase === 'lookbook' ? (
          <ShowcaseLookbook showcase={content.showcase} />
        ) : B.showcase === 'card-grid' ? (
          <ShowcaseCardGrid showcase={content.showcase} />
        ) : (
          <ShowcaseMenuList showcase={content.showcase} />
        )
      )}

      {/* ── Balok Sprint 5 — hanya bila manifest mengaktifkan & konten ada ── */}
      {B.stats && content.stats && content.stats.length > 0 && (
        <Stats stats={content.stats} />
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

      {B.faq && content.faq && content.faq.length > 0 && (
        <FAQ faq={content.faq} />
      )}

      {content.cta && <CTA cta={content.cta} />}

      <Footer content={content} motif={motif} motifColor={motifColor} />
      <FloatingWA wa={content.contact?.wa} />
    </div>
  )
}
