import type { TokenPack } from '@/lib/design-tokens/packs'
import { SANS, SERIF, GROTESK, ROUNDED } from './_fonts'

export const RESTAURANT_PACKS: Record<string, TokenPack> = {
  // ════════════════════════════════════════════════════════════
  // INDUSTRI: RESTAURANT (Sprint 4). 3 sub-kategori × 3 gaya.
  // Tiap sub-kat WAJIB merentang gelap↔terang + mood beda (prinsip #6).
  // ════════════════════════════════════════════════════════════

  // ── WARUNG / KEDAI — merakyat, hangat, jujur ──────────────────
  // rakyat (kayu terracotta terang) ↔ sambal (merah cabai energik) ↔
  // angkringan (gelap moody lampu amber). VARIASI terang↔gelap.
  'warung-rakyat': {
    id: 'warung-rakyat', label: 'Warung Rakyat', mood: 'warm',
    color: {
      page: '#FBF4E9', surface: '#FFFFFF', ink: '#2D2117', muted: '#6F5F4D',
      border: 'rgba(45,33,23,0.10)', primary: '#C24E2C', onPrimary: '#FFFFFF',
      heroFrom: '#F7E7CF', heroTo: '#EAC79B', heroInk: '#2D2117',
    },
    font: { display: SERIF, body: SANS, displayWeight: 800, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '12px', md: '18px', lg: '26px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(120,60,20,.08)',
      md: '0 6px 20px rgba(120,60,20,.12)',
      lg: '0 24px 50px rgba(120,60,20,.16)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'normal', align: 'center' },
  },
  'warung-sambal': {
    id: 'warung-sambal', label: 'Warung Sambal', mood: 'bold',
    color: {
      page: '#FFFCFA', surface: '#FFF3F0', ink: '#2A1310', muted: '#7A5650',
      border: 'rgba(214,40,40,0.12)', primary: '#D62828', onPrimary: '#FFFFFF',
      heroFrom: '#FFE3DA', heroTo: '#FFD0A8', heroInk: '#2A1310',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 900, bodyWeight: 400, tracking: '-0.03em' },
    radius: { sm: '14px', md: '20px', lg: '28px', pill: '9999px' },
    shadow: {
      sm: '0 2px 6px rgba(214,40,40,.12)',
      md: '0 10px 28px rgba(214,40,40,.20)',
      lg: '0 28px 60px rgba(214,40,40,.26)',
    },
    layout: { hero: 'split', features: 'grid', pad: 'normal', align: 'left' },
  },
  'warung-angkringan': {
    id: 'warung-angkringan', label: 'Warung Angkringan', mood: 'luxury',
    color: {
      page: '#17120E', surface: '#221A14', ink: '#F2E6D6', muted: '#B49E86',
      border: 'rgba(255,255,255,0.10)', primary: '#E8A23D', onPrimary: '#17120E',
      heroFrom: '#17120E', heroTo: '#332315', heroInk: '#F7ECDA',
    },
    font: { display: SERIF, body: SANS, displayWeight: 700, bodyWeight: 400, tracking: '-0.005em' },
    radius: { sm: '8px', md: '14px', lg: '20px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.4)',
      md: '0 8px 28px rgba(0,0,0,.45)',
      lg: '0 30px 60px rgba(0,0,0,.55)',
    },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },

  // ── CAFE / COFFEE SHOP — modern, hangat, instagrammable ───────
  // latte (cream cozy terang) ↔ roastery (espresso gelap industrial) ↔
  // bloom (pastel playful terang). VARIASI terang↔gelap.
  'cafe-latte': {
    id: 'cafe-latte', label: 'Cafe Latte', mood: 'clean',
    color: {
      page: '#FBF7F1', surface: '#FFFFFF', ink: '#2A211B', muted: '#7C6E62',
      border: 'rgba(42,33,27,0.08)', primary: '#9C6B4A', onPrimary: '#FFFFFF',
      heroFrom: '#F3E9DD', heroTo: '#E3CDB5', heroInk: '#2A211B',
    },
    font: { display: SERIF, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '14px', md: '20px', lg: '28px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(80,55,35,.06)',
      md: '0 8px 24px rgba(80,55,35,.10)',
      lg: '0 24px 50px rgba(80,55,35,.13)',
    },
    layout: { hero: 'split', features: 'grid', pad: 'airy', align: 'left' },
  },
  'cafe-roastery': {
    id: 'cafe-roastery', label: 'Cafe Roastery', mood: 'luxury',
    color: {
      page: '#1A1512', surface: '#241D18', ink: '#EDE3D7', muted: '#AD9C8B',
      border: 'rgba(255,255,255,0.09)', primary: '#C98A3E', onPrimary: '#1A1512',
      heroFrom: '#1A1512', heroTo: '#2E231A', heroInk: '#F3E9DB',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 800, bodyWeight: 400, tracking: '-0.03em' },
    radius: { sm: '6px', md: '10px', lg: '16px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.4)',
      md: '0 10px 30px rgba(0,0,0,.45)',
      lg: '0 30px 60px rgba(0,0,0,.55)',
    },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },
  'cafe-bloom': {
    id: 'cafe-bloom', label: 'Cafe Bloom', mood: 'minimal',
    color: {
      page: '#FFF8F4', surface: '#FFFFFF', ink: '#3A2B30', muted: '#917A80',
      border: 'rgba(58,43,48,0.08)', primary: '#E08CA0', onPrimary: '#FFFFFF',
      heroFrom: '#FFEAF0', heroTo: '#FCE2CF', heroInk: '#3A2B30',
    },
    font: { display: ROUNDED, body: ROUNDED, displayWeight: 700, bodyWeight: 400, tracking: '-0.015em' },
    radius: { sm: '18px', md: '26px', lg: '34px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(224,140,160,.10)',
      md: '0 8px 24px rgba(224,140,160,.16)',
      lg: '0 24px 50px rgba(224,140,160,.20)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'airy', align: 'center' },
  },

  // ── FINE DINING / RESTO KELUARGA — elegan, berkelas ───────────
  // aurum (gelap emas mewah) ↔ hearth (hangat keluarga terang) ↔
  // nordic (sage bersih kontemporer terang). VARIASI gelap↔terang.
  'finedining-aurum': {
    id: 'finedining-aurum', label: 'Fine Dining Aurum', mood: 'luxury',
    color: {
      page: '#14110C', surface: '#1F1A12', ink: '#F1E8D6', muted: '#B6A685',
      border: 'rgba(255,255,255,0.10)', primary: '#C7A24A', onPrimary: '#14110C',
      heroFrom: '#14110C', heroTo: '#2C2316', heroInk: '#F6EDD8',
    },
    font: { display: SERIF, body: SERIF, displayWeight: 600, bodyWeight: 400, tracking: '-0.005em' },
    radius: { sm: '3px', md: '6px', lg: '12px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.4)',
      md: '0 10px 30px rgba(0,0,0,.5)',
      lg: '0 30px 70px rgba(0,0,0,.6)',
    },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },
  'finedining-hearth': {
    id: 'finedining-hearth', label: 'Fine Dining Hearth', mood: 'warm',
    color: {
      page: '#FBF5EE', surface: '#FFFFFF', ink: '#2E211A', muted: '#766251',
      border: 'rgba(46,33,26,0.10)', primary: '#B5532A', onPrimary: '#FFFFFF',
      heroFrom: '#F4E6D3', heroTo: '#E6C6A0', heroInk: '#2E211A',
    },
    font: { display: SERIF, body: SANS, displayWeight: 700, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '12px', md: '18px', lg: '24px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(120,60,20,.07)',
      md: '0 6px 20px rgba(120,60,20,.11)',
      lg: '0 24px 50px rgba(120,60,20,.15)',
    },
    layout: { hero: 'split', features: 'grid', pad: 'airy', align: 'left' },
  },
  'finedining-nordic': {
    id: 'finedining-nordic', label: 'Fine Dining Nordic', mood: 'minimal',
    color: {
      page: '#FAFAF8', surface: '#FFFFFF', ink: '#23271F', muted: '#7B8178',
      border: 'rgba(0,0,0,0.07)', primary: '#3E4A42', onPrimary: '#FFFFFF',
      heroFrom: '#EEF0EA', heroTo: '#DCE0D4', heroInk: '#23271F',
    },
    font: { display: SANS, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.02em' },
    radius: { sm: '8px', md: '12px', lg: '18px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(35,39,31,.05)',
      md: '0 8px 24px rgba(35,39,31,.08)',
      lg: '0 24px 50px rgba(35,39,31,.10)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'airy', align: 'center' },
  },
}
