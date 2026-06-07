import type { TokenPack } from '@/lib/design-tokens/packs'
import { SANS, SERIF, GROTESK, ROUNDED } from './_fonts'

// ════════════════════════════════════════════════════════════
// INDUSTRI: JASTIP (Sprint 9). 3 sub-kategori × 3 gaya.
// Palet/font ui-ux-pro-max DB; kontras ≥4.5:1. VARIASI gelap↔terang (#6).
// ════════════════════════════════════════════════════════════
export const JASTIP_PACKS: Record<string, TokenPack> = {
  // ── LUAR (jastip luar negeri) — global, premium ───────────────
  'luar-global': {
    id: 'luar-global', label: 'Jastip Global', mood: 'clean',
    color: {
      page: '#F5F9FF', surface: '#FFFFFF', ink: '#14223B', muted: '#566685',
      border: 'rgba(20,34,59,0.08)', primary: '#2563EB', onPrimary: '#FFFFFF',
      heroFrom: '#E4EDFD', heroTo: '#C7DBF8', heroInk: '#14223B',
    },
    font: { display: SANS, body: SANS, displayWeight: 800, bodyWeight: 400, tracking: '-0.03em' },
    radius: { sm: '12px', md: '18px', lg: '24px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(37,99,235,.07)', md: '0 8px 24px rgba(37,99,235,.12)', lg: '0 24px 50px rgba(37,99,235,.16)' },
    layout: { hero: 'split', features: 'grid', pad: 'normal', align: 'left' },
  },
  'luar-premium': {
    id: 'luar-premium', label: 'Jastip Premium', mood: 'luxury',
    color: {
      page: '#15131A', surface: '#1F1C28', ink: '#EFEAF3', muted: '#A89FB4',
      border: 'rgba(255,255,255,0.10)', primary: '#C9A24A', onPrimary: '#15131A',
      heroFrom: '#15131A', heroTo: '#272034', heroInk: '#F5EFDD',
    },
    font: { display: SERIF, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.005em' },
    radius: { sm: '6px', md: '10px', lg: '16px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(0,0,0,.4)', md: '0 10px 30px rgba(0,0,0,.45)', lg: '0 28px 60px rgba(0,0,0,.55)' },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },
  'luar-pop': {
    id: 'luar-pop', label: 'Jastip Pop', mood: 'bold',
    color: {
      page: '#FFFFFF', surface: '#FFF5FA', ink: '#1A0A14', muted: '#6E5560',
      border: 'rgba(219,39,119,0.12)', primary: '#DB2777', onPrimary: '#FFFFFF',
      heroFrom: '#FFE0EF', heroTo: '#FFE6C7', heroInk: '#1A0A14',
    },
    font: { display: ROUNDED, body: ROUNDED, displayWeight: 800, bodyWeight: 400, tracking: '-0.02em' },
    radius: { sm: '16px', md: '24px', lg: '32px', pill: '9999px' },
    shadow: { sm: '0 2px 6px rgba(219,39,119,.10)', md: '0 10px 28px rgba(219,39,119,.20)', lg: '0 28px 60px rgba(219,39,119,.26)' },
    layout: { hero: 'centered', features: 'grid', pad: 'normal', align: 'center' },
  },

  // ── LOKAL (jastip lokal / UMKM) — hangat, dekat ───────────────
  'lokal-hangat': {
    id: 'lokal-hangat', label: 'Jastip Hangat', mood: 'warm',
    color: {
      page: '#FFFBF5', surface: '#FFFFFF', ink: '#241809', muted: '#7C6648',
      border: 'rgba(36,24,9,0.09)', primary: '#C2410C', onPrimary: '#FFFFFF',
      heroFrom: '#FFE8D2', heroTo: '#FFD0A2', heroInk: '#241809',
    },
    font: { display: SERIF, body: SANS, displayWeight: 700, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '14px', md: '20px', lg: '28px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(194,65,12,.08)', md: '0 8px 24px rgba(194,65,12,.14)', lg: '0 24px 50px rgba(194,65,12,.18)' },
    layout: { hero: 'centered', features: 'grid', pad: 'normal', align: 'center' },
  },
  'lokal-segar': {
    id: 'lokal-segar', label: 'Jastip Segar', mood: 'clean',
    color: {
      page: '#F4FBF4', surface: '#FFFFFF', ink: '#13261A', muted: '#5A7062',
      border: 'rgba(19,38,26,0.08)', primary: '#15803D', onPrimary: '#FFFFFF',
      heroFrom: '#DDF3E0', heroTo: '#B9E5C0', heroInk: '#13261A',
    },
    font: { display: SANS, body: SANS, displayWeight: 700, bodyWeight: 400, tracking: '-0.025em' },
    radius: { sm: '12px', md: '18px', lg: '24px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(21,128,61,.07)', md: '0 8px 24px rgba(21,128,61,.12)', lg: '0 24px 50px rgba(21,128,61,.16)' },
    layout: { hero: 'split', features: 'grid', pad: 'normal', align: 'left' },
  },
  'lokal-gelap': {
    id: 'lokal-gelap', label: 'Jastip Lokal Gelap', mood: 'luxury',
    color: {
      page: '#141318', surface: '#1E1C24', ink: '#ECEAF0', muted: '#A09BA8',
      border: 'rgba(255,255,255,0.10)', primary: '#E0A458', onPrimary: '#141318',
      heroFrom: '#141318', heroTo: '#262230', heroInk: '#F4EEDF',
    },
    font: { display: SERIF, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.005em' },
    radius: { sm: '8px', md: '12px', lg: '18px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(0,0,0,.4)', md: '0 10px 30px rgba(0,0,0,.45)', lg: '0 28px 60px rgba(0,0,0,.55)' },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },

  // ── PREORDER (PO barang) — modern, terjadwal ──────────────────
  'preorder-fokus': {
    id: 'preorder-fokus', label: 'PO Fokus', mood: 'minimal',
    color: {
      page: '#F6F7FF', surface: '#FFFFFF', ink: '#16182E', muted: '#5C6080',
      border: 'rgba(22,24,46,0.08)', primary: '#4F46E5', onPrimary: '#FFFFFF',
      heroFrom: '#E8E9FF', heroTo: '#CFD1FB', heroInk: '#16182E',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 800, bodyWeight: 400, tracking: '-0.03em' },
    radius: { sm: '12px', md: '18px', lg: '24px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(79,70,229,.08)', md: '0 8px 24px rgba(79,70,229,.14)', lg: '0 24px 50px rgba(79,70,229,.18)' },
    layout: { hero: 'split', features: 'grid', pad: 'normal', align: 'left' },
  },
  'preorder-energi': {
    id: 'preorder-energi', label: 'PO Energi', mood: 'bold',
    color: {
      page: '#FFFFFF', surface: '#FFF6F3', ink: '#1F1410', muted: '#6E574F',
      border: 'rgba(220,66,32,0.12)', primary: '#DC4220', onPrimary: '#FFFFFF',
      heroFrom: '#FFE6DC', heroTo: '#FFD0B0', heroInk: '#1F1410',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 900, bodyWeight: 400, tracking: '-0.035em' },
    radius: { sm: '14px', md: '22px', lg: '30px', pill: '9999px' },
    shadow: { sm: '0 2px 6px rgba(220,66,32,.12)', md: '0 10px 28px rgba(220,66,32,.20)', lg: '0 28px 60px rgba(220,66,32,.26)' },
    layout: { hero: 'centered', features: 'grid', pad: 'normal', align: 'center' },
  },
  'preorder-malam': {
    id: 'preorder-malam', label: 'PO Malam', mood: 'luxury',
    color: {
      page: '#0E0A1A', surface: '#171127', ink: '#F1ECFB', muted: '#A99CC4',
      border: 'rgba(255,255,255,0.10)', primary: '#A855F7', onPrimary: '#FFFFFF',
      heroFrom: '#160C2C', heroTo: '#2C1452', heroInk: '#F4ECFF',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 800, bodyWeight: 400, tracking: '-0.03em' },
    radius: { sm: '12px', md: '18px', lg: '26px', pill: '9999px' },
    shadow: { sm: '0 2px 6px rgba(168,85,247,.16)', md: '0 10px 30px rgba(168,85,247,.24)', lg: '0 28px 60px rgba(168,85,247,.30)' },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },
}
