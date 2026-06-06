import type { TokenPack } from '@/lib/design-tokens/packs'
import { SANS, SERIF, GROTESK, ROUNDED } from './_fonts'

// ════════════════════════════════════════════════════════════
// INDUSTRI: PERSONAL / PORTFOLIO (Sprint 8a). 3 sub-kategori × 3 gaya.
// Palet/font dikurasi via ui-ux-pro-max DB; kontras teks/bg ≥4.5:1.
// VARIASI gelap↔terang tiap sub-kat (#6).
// ════════════════════════════════════════════════════════════
export const PERSONAL_PACKS: Record<string, TokenPack> = {
  // ── KREATOR (content creator / influencer) — ekspresif, personal ──
  // spotlight (gelap violet, panggung) ↔ pop (pink terang, playful) ↔
  // clean (mono minimal terang). VARIASI gelap↔terang.
  'kreator-spotlight': {
    id: 'kreator-spotlight', label: 'Kreator Spotlight', mood: 'luxury',
    color: {
      page: '#0F0E14', surface: '#191722', ink: '#F2EFF9', muted: '#A79FBE',
      border: 'rgba(255,255,255,0.10)', primary: '#C084FC', onPrimary: '#160B22',
      heroFrom: '#140B26', heroTo: '#2E1248', heroInk: '#F4ECFF',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 900, bodyWeight: 400, tracking: '-0.035em' },
    radius: { sm: '12px', md: '18px', lg: '26px', pill: '9999px' },
    shadow: {
      sm: '0 2px 6px rgba(192,132,252,.16)',
      md: '0 10px 30px rgba(192,132,252,.24)',
      lg: '0 28px 60px rgba(192,132,252,.30)',
    },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },
  'kreator-pop': {
    id: 'kreator-pop', label: 'Kreator Pop', mood: 'bold',
    color: {
      page: '#FFFFFF', surface: '#FFF6FB', ink: '#1A0A14', muted: '#7A5C6E',
      border: 'rgba(214,32,106,0.12)', primary: '#D6206A', onPrimary: '#FFFFFF',
      heroFrom: '#FFE0F0', heroTo: '#EAD9FF', heroInk: '#1A0A14',
    },
    font: { display: ROUNDED, body: ROUNDED, displayWeight: 900, bodyWeight: 400, tracking: '-0.025em' },
    radius: { sm: '18px', md: '28px', lg: '36px', pill: '9999px' },
    shadow: {
      sm: '0 2px 6px rgba(214,32,106,.12)',
      md: '0 10px 28px rgba(214,32,106,.22)',
      lg: '0 28px 60px rgba(214,32,106,.28)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'normal', align: 'center' },
  },
  'kreator-clean': {
    id: 'kreator-clean', label: 'Kreator Clean', mood: 'minimal',
    color: {
      page: '#FAFAFA', surface: '#FFFFFF', ink: '#111111', muted: '#737373',
      border: 'rgba(0,0,0,0.08)', primary: '#111111', onPrimary: '#FFFFFF',
      heroFrom: '#F2F2F2', heroTo: '#E4E4E4', heroInk: '#111111',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 800, bodyWeight: 400, tracking: '-0.04em' },
    radius: { sm: '8px', md: '12px', lg: '18px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.06)',
      md: '0 8px 24px rgba(0,0,0,.08)',
      lg: '0 24px 50px rgba(0,0,0,.10)',
    },
    layout: { hero: 'split', features: 'grid', pad: 'airy', align: 'left' },
  },

  // ── PROFESIONAL (konsultan / expert / freelancer) — terpercaya ──
  // korporat (biru bersih terang) ↔ mono (editorial gelap) ↔
  // warm (cokelat hangat terang). VARIASI gelap↔terang.
  'profesional-korporat': {
    id: 'profesional-korporat', label: 'Profesional Korporat', mood: 'clean',
    color: {
      page: '#F6F8FC', surface: '#FFFFFF', ink: '#13213B', muted: '#566480',
      border: 'rgba(19,33,59,0.08)', primary: '#1E40AF', onPrimary: '#FFFFFF',
      heroFrom: '#E5ECFA', heroTo: '#C9D8F5', heroInk: '#13213B',
    },
    font: { display: SANS, body: SANS, displayWeight: 800, bodyWeight: 400, tracking: '-0.03em' },
    radius: { sm: '10px', md: '16px', lg: '22px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(30,64,175,.07)',
      md: '0 8px 24px rgba(30,64,175,.12)',
      lg: '0 24px 50px rgba(30,64,175,.16)',
    },
    layout: { hero: 'split', features: 'grid', pad: 'normal', align: 'left' },
  },
  'profesional-mono': {
    id: 'profesional-mono', label: 'Profesional Mono', mood: 'luxury',
    color: {
      page: '#131316', surface: '#1D1D21', ink: '#ECEAE4', muted: '#9D988E',
      border: 'rgba(255,255,255,0.11)', primary: '#E8E6E1', onPrimary: '#131316',
      heroFrom: '#131316', heroTo: '#222226', heroInk: '#F4F2EC',
    },
    font: { display: SERIF, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.02em' },
    radius: { sm: '2px', md: '4px', lg: '8px', pill: '9999px' },
    shadow: {
      sm: '0 1px 2px rgba(0,0,0,.5)',
      md: '0 10px 30px rgba(0,0,0,.5)',
      lg: '0 30px 70px rgba(0,0,0,.6)',
    },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },
  'profesional-warm': {
    id: 'profesional-warm', label: 'Profesional Warm', mood: 'warm',
    color: {
      page: '#FBF7F1', surface: '#FFFFFF', ink: '#2C2418', muted: '#7A6C56',
      border: 'rgba(44,36,24,0.09)', primary: '#B45309', onPrimary: '#FFFFFF',
      heroFrom: '#F4E8D6', heroTo: '#E6CDA6', heroInk: '#2C2418',
    },
    font: { display: SERIF, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '10px', md: '16px', lg: '24px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(120,80,20,.07)',
      md: '0 8px 24px rgba(120,80,20,.11)',
      lg: '0 24px 50px rgba(120,80,20,.15)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'airy', align: 'center' },
  },

  // ── COACH (coach / mentor / trainer) — motivasional, hangat ──────
  // energi (oranye semangat terang) ↔ tenang (teal kalem terang) ↔
  // prestige (emas gelap premium). VARIASI gelap↔terang.
  'coach-energi': {
    id: 'coach-energi', label: 'Coach Energi', mood: 'bold',
    color: {
      page: '#FFFBF5', surface: '#FFFFFF', ink: '#23160A', muted: '#7C6450',
      border: 'rgba(194,65,12,0.12)', primary: '#C2410C', onPrimary: '#FFFFFF',
      heroFrom: '#FFE8D4', heroTo: '#FFD0A2', heroInk: '#23160A',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 900, bodyWeight: 400, tracking: '-0.035em' },
    radius: { sm: '14px', md: '22px', lg: '30px', pill: '9999px' },
    shadow: {
      sm: '0 2px 6px rgba(194,65,12,.12)',
      md: '0 10px 28px rgba(194,65,12,.20)',
      lg: '0 28px 60px rgba(194,65,12,.26)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'normal', align: 'center' },
  },
  'coach-tenang': {
    id: 'coach-tenang', label: 'Coach Tenang', mood: 'minimal',
    color: {
      page: '#F2FAF9', surface: '#FFFFFF', ink: '#0F2A28', muted: '#5A7572',
      border: 'rgba(15,42,40,0.08)', primary: '#0C7A70', onPrimary: '#FFFFFF',
      heroFrom: '#DBF2EF', heroTo: '#B6E4DE', heroInk: '#0F2A28',
    },
    font: { display: SANS, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.02em' },
    radius: { sm: '14px', md: '20px', lg: '28px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(12,122,112,.07)',
      md: '0 8px 24px rgba(12,122,112,.12)',
      lg: '0 24px 50px rgba(12,122,112,.16)',
    },
    layout: { hero: 'split', features: 'grid', pad: 'airy', align: 'left' },
  },
  'coach-prestige': {
    id: 'coach-prestige', label: 'Coach Prestige', mood: 'luxury',
    color: {
      page: '#14130F', surface: '#1F1D16', ink: '#F1ECDE', muted: '#B3A98E',
      border: 'rgba(255,255,255,0.10)', primary: '#C9A24A', onPrimary: '#14130F',
      heroFrom: '#14130F', heroTo: '#2A2516', heroInk: '#F6F0DC',
    },
    font: { display: SERIF, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.005em' },
    radius: { sm: '6px', md: '10px', lg: '16px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.4)',
      md: '0 10px 30px rgba(0,0,0,.45)',
      lg: '0 28px 60px rgba(0,0,0,.55)',
    },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },
}
