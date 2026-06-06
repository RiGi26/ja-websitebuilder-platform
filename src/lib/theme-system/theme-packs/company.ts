import type { TokenPack } from '@/lib/design-tokens/packs'
import { SANS, SERIF, GROTESK } from './_fonts'

// ════════════════════════════════════════════════════════════
// INDUSTRI: COMPANY / CORPORATE (Sprint 8b). 3 sub-kategori × 3 gaya.
// Palet/font dikurasi via ui-ux-pro-max DB; kontras teks/bg ≥4.5:1.
// VARIASI gelap↔terang tiap sub-kat (#6). tipe industri = 'corporate'.
// ════════════════════════════════════════════════════════════
export const COMPANY_PACKS: Record<string, TokenPack> = {
  // ── STARTUP / TECH / SAAS — modern, gradient, bersih ──────────
  // aurora (indigo→cyan terang) ↔ midnight (tech gelap, sky accent) ↔
  // mint (emerald bersih terang). VARIASI terang↔gelap.
  'startup-aurora': {
    id: 'startup-aurora', label: 'Startup Aurora', mood: 'clean',
    color: {
      page: '#F6F7FF', surface: '#FFFFFF', ink: '#15183A', muted: '#5B6080',
      border: 'rgba(21,24,58,0.08)', primary: '#4F46E5', onPrimary: '#FFFFFF',
      heroFrom: '#E6E9FF', heroTo: '#CFFAFE', heroInk: '#15183A',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 800, bodyWeight: 400, tracking: '-0.03em' },
    radius: { sm: '12px', md: '18px', lg: '26px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(79,70,229,.08)',
      md: '0 8px 24px rgba(79,70,229,.14)',
      lg: '0 24px 50px rgba(79,70,229,.18)',
    },
    layout: { hero: 'split', features: 'grid', pad: 'normal', align: 'left' },
  },
  'startup-midnight': {
    id: 'startup-midnight', label: 'Startup Midnight', mood: 'luxury',
    color: {
      page: '#0B1220', surface: '#131C2E', ink: '#E7EEF8', muted: '#8D9CB5',
      border: 'rgba(255,255,255,0.10)', primary: '#38BDF8', onPrimary: '#04121F',
      heroFrom: '#0B1220', heroTo: '#0E2540', heroInk: '#EAF4FF',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 800, bodyWeight: 400, tracking: '-0.03em' },
    radius: { sm: '10px', md: '14px', lg: '20px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.5)',
      md: '0 10px 30px rgba(56,189,248,.16)',
      lg: '0 28px 60px rgba(56,189,248,.22)',
    },
    layout: { hero: 'fullbleed', features: 'grid', pad: 'normal', align: 'left' },
  },
  'startup-mint': {
    id: 'startup-mint', label: 'Startup Mint', mood: 'minimal',
    color: {
      page: '#F3FBF7', surface: '#FFFFFF', ink: '#0F2A20', muted: '#5C7568',
      border: 'rgba(15,42,32,0.08)', primary: '#0C7A52', onPrimary: '#FFFFFF',
      heroFrom: '#DDF5EA', heroTo: '#BBEBD6', heroInk: '#0F2A20',
    },
    font: { display: SANS, body: SANS, displayWeight: 700, bodyWeight: 400, tracking: '-0.025em' },
    radius: { sm: '12px', md: '18px', lg: '24px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(12,122,82,.07)',
      md: '0 8px 24px rgba(12,122,82,.12)',
      lg: '0 24px 50px rgba(12,122,82,.16)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'airy', align: 'center' },
  },

  // ── AGENCY / KREATIF — berani, ekspresif ──────────────────────
  // bold (hitam+lime terang) ↔ noir (editorial gelap) ↔
  // prisma (pink→peach vibrant terang). VARIASI terang↔gelap.
  'agency-bold': {
    id: 'agency-bold', label: 'Agency Bold', mood: 'bold',
    color: {
      page: '#FAFAF7', surface: '#FFFFFF', ink: '#121212', muted: '#6B6B66',
      border: 'rgba(0,0,0,0.10)', primary: '#4D7C0F', onPrimary: '#FFFFFF',
      heroFrom: '#ECF5D9', heroTo: '#DDEBC0', heroInk: '#121212',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 900, bodyWeight: 400, tracking: '-0.04em' },
    radius: { sm: '8px', md: '12px', lg: '18px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.07)',
      md: '0 8px 24px rgba(0,0,0,.10)',
      lg: '0 24px 50px rgba(0,0,0,.13)',
    },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },
  'agency-noir': {
    id: 'agency-noir', label: 'Agency Noir', mood: 'luxury',
    color: {
      page: '#121212', surface: '#1C1C1C', ink: '#F2F0EA', muted: '#9C988E',
      border: 'rgba(255,255,255,0.11)', primary: '#F2F0EA', onPrimary: '#121212',
      heroFrom: '#121212', heroTo: '#222020', heroInk: '#F6F4EE',
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
  'agency-prisma': {
    id: 'agency-prisma', label: 'Agency Prisma', mood: 'clean',
    color: {
      page: '#FFFFFF', surface: '#FFF5FA', ink: '#1A0A14', muted: '#6E5560',
      border: 'rgba(219,39,119,0.12)', primary: '#DB2777', onPrimary: '#FFFFFF',
      heroFrom: '#FFE0EF', heroTo: '#FFE6C7', heroInk: '#1A0A14',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 900, bodyWeight: 400, tracking: '-0.035em' },
    radius: { sm: '16px', md: '24px', lg: '32px', pill: '9999px' },
    shadow: {
      sm: '0 2px 6px rgba(219,39,119,.10)',
      md: '0 10px 28px rgba(219,39,119,.20)',
      lg: '0 28px 60px rgba(219,39,119,.26)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'normal', align: 'center' },
  },

  // ── KORPORAT / MANUFAKTUR / B2B — mapan, terpercaya ───────────
  // biru (korporat biru terang) ↔ slate (slate gelap premium) ↔
  // netral (taupe hangat terang). VARIASI terang↔gelap.
  'korporat-biru': {
    id: 'korporat-biru', label: 'Korporat Biru', mood: 'clean',
    color: {
      page: '#F5F8FF', surface: '#FFFFFF', ink: '#13233F', muted: '#57667F',
      border: 'rgba(19,35,63,0.08)', primary: '#1D4ED8', onPrimary: '#FFFFFF',
      heroFrom: '#E5EDFB', heroTo: '#C9DCF6', heroInk: '#13233F',
    },
    font: { display: SANS, body: SANS, displayWeight: 800, bodyWeight: 400, tracking: '-0.03em' },
    radius: { sm: '8px', md: '14px', lg: '20px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(29,78,216,.07)',
      md: '0 8px 24px rgba(29,78,216,.12)',
      lg: '0 24px 50px rgba(29,78,216,.16)',
    },
    layout: { hero: 'split', features: 'grid', pad: 'normal', align: 'left' },
  },
  'korporat-slate': {
    id: 'korporat-slate', label: 'Korporat Slate', mood: 'luxury',
    color: {
      page: '#0F172A', surface: '#1A2436', ink: '#E8EEF6', muted: '#94A3B8',
      border: 'rgba(255,255,255,0.10)', primary: '#7DB8FF', onPrimary: '#0A1424',
      heroFrom: '#0F172A', heroTo: '#1B2A45', heroInk: '#EAF1FB',
    },
    font: { display: SANS, body: SANS, displayWeight: 700, bodyWeight: 400, tracking: '-0.02em' },
    radius: { sm: '6px', md: '10px', lg: '16px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.4)',
      md: '0 10px 30px rgba(0,0,0,.45)',
      lg: '0 28px 60px rgba(0,0,0,.55)',
    },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },
  'korporat-netral': {
    id: 'korporat-netral', label: 'Korporat Netral', mood: 'warm',
    color: {
      page: '#FAF8F4', surface: '#FFFFFF', ink: '#2B2620', muted: '#786F60',
      border: 'rgba(43,38,32,0.09)', primary: '#5C5347', onPrimary: '#FFFFFF',
      heroFrom: '#F0ECE3', heroTo: '#DED7C8', heroInk: '#2B2620',
    },
    font: { display: SERIF, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '8px', md: '14px', lg: '20px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(60,50,30,.06)',
      md: '0 8px 24px rgba(60,50,30,.10)',
      lg: '0 24px 50px rgba(60,50,30,.13)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'airy', align: 'center' },
  },
}
