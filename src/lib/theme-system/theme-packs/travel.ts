import type { TokenPack } from '@/lib/design-tokens/packs'
import { SANS, SERIF, GROTESK } from './_fonts'

// ════════════════════════════════════════════════════════════
// INDUSTRI: TRAVEL / RENTAL (Sprint 9). 3 sub-kategori × 3 gaya.
// Palet/font ui-ux-pro-max DB; kontras ≥4.5:1. VARIASI gelap↔terang (#6).
// ════════════════════════════════════════════════════════════
export const TRAVEL_PACKS: Record<string, TokenPack> = {
  // ── KENDARAAN (rental mobil/motor) — tegas, otomotif ──────────
  'kendaraan-asphalt': {
    id: 'kendaraan-asphalt', label: 'Kendaraan Asphalt', mood: 'luxury',
    color: {
      page: '#111418', surface: '#1A1F26', ink: '#EDF0F4', muted: '#929BA8',
      border: 'rgba(255,255,255,0.10)', primary: '#FF6A00', onPrimary: '#160A02',
      heroFrom: '#111418', heroTo: '#241A12', heroInk: '#FFF1E6',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 900, bodyWeight: 400, tracking: '-0.035em' },
    radius: { sm: '10px', md: '16px', lg: '22px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(0,0,0,.5)', md: '0 10px 30px rgba(255,106,0,.18)', lg: '0 28px 60px rgba(255,106,0,.24)' },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },
  'kendaraan-bersih': {
    id: 'kendaraan-bersih', label: 'Kendaraan Bersih', mood: 'clean',
    color: {
      page: '#F5F9FF', surface: '#FFFFFF', ink: '#14223B', muted: '#566685',
      border: 'rgba(20,34,59,0.08)', primary: '#2563EB', onPrimary: '#FFFFFF',
      heroFrom: '#E4EDFD', heroTo: '#C7DBF8', heroInk: '#14223B',
    },
    font: { display: SANS, body: SANS, displayWeight: 800, bodyWeight: 400, tracking: '-0.03em' },
    radius: { sm: '12px', md: '18px', lg: '26px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(37,99,235,.07)', md: '0 8px 24px rgba(37,99,235,.12)', lg: '0 24px 50px rgba(37,99,235,.16)' },
    layout: { hero: 'split', features: 'grid', pad: 'normal', align: 'left' },
  },
  'kendaraan-kuning': {
    id: 'kendaraan-kuning', label: 'Kendaraan Kuning', mood: 'bold',
    color: {
      page: '#FFFDF4', surface: '#FFFFFF', ink: '#211B07', muted: '#6F6645',
      border: 'rgba(33,27,7,0.10)', primary: '#A16207', onPrimary: '#FFFFFF',
      heroFrom: '#FFF3CC', heroTo: '#FFE08A', heroInk: '#211B07',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 900, bodyWeight: 400, tracking: '-0.035em' },
    radius: { sm: '14px', md: '22px', lg: '30px', pill: '9999px' },
    shadow: { sm: '0 2px 6px rgba(161,98,7,.12)', md: '0 10px 28px rgba(161,98,7,.20)', lg: '0 28px 60px rgba(161,98,7,.26)' },
    layout: { hero: 'centered', features: 'grid', pad: 'normal', align: 'center' },
  },

  // ── WISATA (tour / open trip) — petualangan, alam ─────────────
  'wisata-tropis': {
    id: 'wisata-tropis', label: 'Wisata Tropis', mood: 'clean',
    color: {
      page: '#F2FBFC', surface: '#FFFFFF', ink: '#0E2A30', muted: '#557076',
      border: 'rgba(14,42,48,0.08)', primary: '#0B7A90', onPrimary: '#FFFFFF',
      heroFrom: '#D5F2F6', heroTo: '#AEE6EC', heroInk: '#0E2A30',
    },
    font: { display: SANS, body: SANS, displayWeight: 700, bodyWeight: 400, tracking: '-0.025em' },
    radius: { sm: '14px', md: '22px', lg: '30px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(11,122,144,.07)', md: '0 8px 24px rgba(11,122,144,.13)', lg: '0 24px 50px rgba(11,122,144,.17)' },
    layout: { hero: 'centered', features: 'grid', pad: 'normal', align: 'center' },
  },
  'wisata-rimba': {
    id: 'wisata-rimba', label: 'Wisata Rimba', mood: 'luxury',
    color: {
      page: '#10201A', surface: '#183026', ink: '#E7F1EA', muted: '#94AC9D',
      border: 'rgba(255,255,255,0.10)', primary: '#5FB389', onPrimary: '#07150E',
      heroFrom: '#10201A', heroTo: '#173E2C', heroInk: '#EDF6EF',
    },
    font: { display: SERIF, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.005em' },
    radius: { sm: '8px', md: '12px', lg: '18px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(0,0,0,.4)', md: '0 8px 28px rgba(0,0,0,.45)', lg: '0 30px 60px rgba(0,0,0,.55)' },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },
  'wisata-senja': {
    id: 'wisata-senja', label: 'Wisata Senja', mood: 'warm',
    color: {
      page: '#FFF8F1', surface: '#FFFFFF', ink: '#2C1A12', muted: '#7C6453',
      border: 'rgba(44,26,18,0.09)', primary: '#C2410C', onPrimary: '#FFFFFF',
      heroFrom: '#FFE6D2', heroTo: '#FFC79E', heroInk: '#2C1A12',
    },
    font: { display: SERIF, body: SANS, displayWeight: 700, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '12px', md: '18px', lg: '26px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(194,65,12,.08)', md: '0 8px 24px rgba(194,65,12,.14)', lg: '0 24px 50px rgba(194,65,12,.18)' },
    layout: { hero: 'split', features: 'grid', pad: 'airy', align: 'left' },
  },

  // ── AKOMODASI (villa / homestay / sewa) — nyaman, lapang ──────
  'akomodasi-resort': {
    id: 'akomodasi-resort', label: 'Akomodasi Resort', mood: 'minimal',
    color: {
      page: '#F1FAF8', surface: '#FFFFFF', ink: '#0F2A27', muted: '#5A7572',
      border: 'rgba(15,42,39,0.08)', primary: '#0F766E', onPrimary: '#FFFFFF',
      heroFrom: '#DBF2EE', heroTo: '#B6E4DC', heroInk: '#0F2A27',
    },
    font: { display: SANS, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.02em' },
    radius: { sm: '14px', md: '20px', lg: '28px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(15,118,110,.07)', md: '0 8px 24px rgba(15,118,110,.12)', lg: '0 24px 50px rgba(15,118,110,.16)' },
    layout: { hero: 'split', features: 'grid', pad: 'airy', align: 'left' },
  },
  'akomodasi-kayu': {
    id: 'akomodasi-kayu', label: 'Akomodasi Kayu', mood: 'warm',
    color: {
      page: '#FBF6EE', surface: '#FFFFFF', ink: '#2E2418', muted: '#7C6C56',
      border: 'rgba(46,36,24,0.09)', primary: '#9C6B3F', onPrimary: '#FFFFFF',
      heroFrom: '#F2E6D2', heroTo: '#E2C7A0', heroInk: '#2E2418',
    },
    font: { display: SERIF, body: SANS, displayWeight: 700, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '12px', md: '18px', lg: '24px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(120,80,40,.07)', md: '0 8px 24px rgba(120,80,40,.11)', lg: '0 24px 50px rgba(120,80,40,.15)' },
    layout: { hero: 'centered', features: 'grid', pad: 'airy', align: 'center' },
  },
  'akomodasi-malam': {
    id: 'akomodasi-malam', label: 'Akomodasi Malam', mood: 'luxury',
    color: {
      page: '#14131A', surface: '#1E1C28', ink: '#EEEAF4', muted: '#A39DB4',
      border: 'rgba(255,255,255,0.10)', primary: '#C9A24A', onPrimary: '#14131A',
      heroFrom: '#14131A', heroTo: '#272235', heroInk: '#F4EEDD',
    },
    font: { display: SERIF, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.005em' },
    radius: { sm: '6px', md: '10px', lg: '16px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(0,0,0,.4)', md: '0 10px 30px rgba(0,0,0,.45)', lg: '0 28px 60px rgba(0,0,0,.55)' },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },
}
