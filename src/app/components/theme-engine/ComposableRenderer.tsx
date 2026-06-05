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
  ENGINE_CSS, Nav, Footer, About, CTA,
  HeroCentered, HeroSplit, HeroFullbleed,
  ShowcaseMenuList, ShowcaseCardGrid,
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

  return (
    <div className="ce-root" style={vars} data-theme={manifest.id}>
      <style dangerouslySetInnerHTML={{ __html: ENGINE_CSS }} />

      <Nav content={content} />

      {/* Hero — varian dari manifest */}
      {B.hero === 'split' ? (
        <HeroSplit hero={content.hero} nama={content.nama} />
      ) : B.hero === 'fullbleed' ? (
        <HeroFullbleed hero={content.hero} />
      ) : (
        <HeroCentered hero={content.hero} />
      )}

      {/* Showcase produk/menu — varian dari manifest */}
      {content.showcase && content.showcase.items.length > 0 && (
        B.showcase === 'card-grid' ? (
          <ShowcaseCardGrid showcase={content.showcase} />
        ) : (
          <ShowcaseMenuList showcase={content.showcase} />
        )
      )}

      {content.about && <About about={content.about} />}
      {content.cta && <CTA cta={content.cta} />}

      <Footer content={content} />
    </div>
  )
}
