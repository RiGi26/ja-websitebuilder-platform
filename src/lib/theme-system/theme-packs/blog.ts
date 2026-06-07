import type { TokenPack } from '@/lib/design-tokens/packs'
import { SANS, SERIF, GROTESK } from './_fonts'

// ════════════════════════════════════════════════════════════
// INDUSTRI: BLOG / MEDIA (Sprint 9). 3 sub-kategori × 3 gaya.
// Palet/font ui-ux-pro-max DB; kontras ≥4.5:1. VARIASI gelap↔terang (#6).
// ════════════════════════════════════════════════════════════
export const BLOG_PACKS: Record<string, TokenPack> = {
  // ── JURNAL (blog pribadi) — hangat, intim ─────────────────────
  'jurnal-hangat': {
    id: 'jurnal-hangat', label: 'Blog Jurnal', mood: 'warm',
    color: {
      page: '#FBF8F2', surface: '#FFFFFF', ink: '#2A2118', muted: '#7A6C58',
      border: 'rgba(42,33,24,0.09)', primary: '#9A3412', onPrimary: '#FFFFFF',
      heroFrom: '#F3E9D9', heroTo: '#E6D2B6', heroInk: '#2A2118',
    },
    font: { display: SERIF, body: SERIF, displayWeight: 600, bodyWeight: 400, tracking: '-0.005em' },
    radius: { sm: '8px', md: '14px', lg: '20px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(120,80,40,.07)', md: '0 8px 24px rgba(120,80,40,.10)', lg: '0 24px 50px rgba(120,80,40,.13)' },
    layout: { hero: 'centered', features: 'grid', pad: 'airy', align: 'center' },
  },
  'jurnal-mono': {
    id: 'jurnal-mono', label: 'Blog Mono', mood: 'minimal',
    color: {
      page: '#FAFAFA', surface: '#FFFFFF', ink: '#141414', muted: '#737373',
      border: 'rgba(0,0,0,0.08)', primary: '#141414', onPrimary: '#FFFFFF',
      heroFrom: '#F1F1F1', heroTo: '#E3E3E3', heroInk: '#141414',
    },
    font: { display: GROTESK, body: SERIF, displayWeight: 700, bodyWeight: 400, tracking: '-0.03em' },
    radius: { sm: '6px', md: '10px', lg: '14px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(0,0,0,.06)', md: '0 8px 24px rgba(0,0,0,.08)', lg: '0 24px 50px rgba(0,0,0,.10)' },
    layout: { hero: 'split', features: 'grid', pad: 'airy', align: 'left' },
  },
  'jurnal-senja': {
    id: 'jurnal-senja', label: 'Blog Senja', mood: 'luxury',
    color: {
      page: '#16131A', surface: '#201B27', ink: '#EFEAF2', muted: '#A99FB2',
      border: 'rgba(255,255,255,0.10)', primary: '#E0A458', onPrimary: '#16131A',
      heroFrom: '#16131A', heroTo: '#2A2030', heroInk: '#F6EFE3',
    },
    font: { display: SERIF, body: SERIF, displayWeight: 600, bodyWeight: 400, tracking: '-0.005em' },
    radius: { sm: '6px', md: '10px', lg: '16px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(0,0,0,.4)', md: '0 10px 30px rgba(0,0,0,.45)', lg: '0 28px 60px rgba(0,0,0,.55)' },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },

  // ── MEDIA (berita / majalah) — informatif, padat ──────────────
  'media-merah': {
    id: 'media-merah', label: 'Media Merah', mood: 'bold',
    color: {
      page: '#FFFFFF', surface: '#FBF5F5', ink: '#1A1212', muted: '#6E5A5A',
      border: 'rgba(200,30,30,0.12)', primary: '#C81E1E', onPrimary: '#FFFFFF',
      heroFrom: '#FCE3E3', heroTo: '#F7C9C9', heroInk: '#1A1212',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 900, bodyWeight: 400, tracking: '-0.03em' },
    radius: { sm: '6px', md: '10px', lg: '14px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(200,30,30,.08)', md: '0 8px 24px rgba(200,30,30,.14)', lg: '0 24px 50px rgba(200,30,30,.18)' },
    layout: { hero: 'split', features: 'grid', pad: 'normal', align: 'left' },
  },
  'media-biru': {
    id: 'media-biru', label: 'Media Biru', mood: 'clean',
    color: {
      page: '#F6F8FB', surface: '#FFFFFF', ink: '#13233F', muted: '#57667F',
      border: 'rgba(19,35,63,0.08)', primary: '#1D4ED8', onPrimary: '#FFFFFF',
      heroFrom: '#E5EDFB', heroTo: '#C9DCF6', heroInk: '#13233F',
    },
    font: { display: SANS, body: SANS, displayWeight: 800, bodyWeight: 400, tracking: '-0.03em' },
    radius: { sm: '8px', md: '12px', lg: '18px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(29,78,216,.07)', md: '0 8px 24px rgba(29,78,216,.12)', lg: '0 24px 50px rgba(29,78,216,.16)' },
    layout: { hero: 'split', features: 'grid', pad: 'normal', align: 'left' },
  },
  'media-malam': {
    id: 'media-malam', label: 'Media Malam', mood: 'luxury',
    color: {
      page: '#0F1115', surface: '#181B22', ink: '#E8ECF2', muted: '#8E97A6',
      border: 'rgba(255,255,255,0.10)', primary: '#60A5FA', onPrimary: '#061121',
      heroFrom: '#0F1115', heroTo: '#172230', heroInk: '#EAF1FB',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 800, bodyWeight: 400, tracking: '-0.03em' },
    radius: { sm: '8px', md: '12px', lg: '16px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(0,0,0,.5)', md: '0 10px 30px rgba(0,0,0,.45)', lg: '0 28px 60px rgba(0,0,0,.55)' },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'normal', align: 'left' },
  },

  // ── NICHE (food/tech/lifestyle blog) — fokus tema ─────────────
  'niche-hijau': {
    id: 'niche-hijau', label: 'Niche Hijau', mood: 'clean',
    color: {
      page: '#F4FBF4', surface: '#FFFFFF', ink: '#13261A', muted: '#5A7062',
      border: 'rgba(19,38,26,0.08)', primary: '#15803D', onPrimary: '#FFFFFF',
      heroFrom: '#DDF3E0', heroTo: '#B9E5C0', heroInk: '#13261A',
    },
    font: { display: SERIF, body: SANS, displayWeight: 700, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '12px', md: '18px', lg: '24px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(21,128,61,.07)', md: '0 8px 24px rgba(21,128,61,.12)', lg: '0 24px 50px rgba(21,128,61,.16)' },
    layout: { hero: 'centered', features: 'grid', pad: 'airy', align: 'center' },
  },
  'niche-pop': {
    id: 'niche-pop', label: 'Niche Pop', mood: 'bold',
    color: {
      page: '#FFFFFF', surface: '#F8F5FF', ink: '#170A26', muted: '#5F5570',
      border: 'rgba(124,58,237,0.12)', primary: '#7C3AED', onPrimary: '#FFFFFF',
      heroFrom: '#EFE6FF', heroTo: '#FCE0F2', heroInk: '#170A26',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 900, bodyWeight: 400, tracking: '-0.035em' },
    radius: { sm: '14px', md: '22px', lg: '30px', pill: '9999px' },
    shadow: { sm: '0 2px 6px rgba(124,58,237,.10)', md: '0 10px 28px rgba(124,58,237,.20)', lg: '0 28px 60px rgba(124,58,237,.26)' },
    layout: { hero: 'centered', features: 'grid', pad: 'normal', align: 'center' },
  },
  'niche-gelap': {
    id: 'niche-gelap', label: 'Niche Gelap', mood: 'luxury',
    color: {
      page: '#0D1117', surface: '#161C24', ink: '#E6EDF3', muted: '#8B98A8',
      border: 'rgba(255,255,255,0.10)', primary: '#2DD4BF', onPrimary: '#04201C',
      heroFrom: '#0D1117', heroTo: '#11252A', heroInk: '#EAF7F4',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 800, bodyWeight: 400, tracking: '-0.03em' },
    radius: { sm: '8px', md: '12px', lg: '18px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(0,0,0,.5)', md: '0 10px 30px rgba(45,212,191,.16)', lg: '0 28px 60px rgba(45,212,191,.22)' },
    layout: { hero: 'fullbleed', features: 'grid', pad: 'normal', align: 'left' },
  },
}
