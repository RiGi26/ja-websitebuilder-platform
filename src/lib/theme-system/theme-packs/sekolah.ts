import type { TokenPack } from '@/lib/design-tokens/packs'
import { SANS, SERIF, GROTESK, ROUNDED } from './_fonts'

export const SEKOLAH_PACKS: Record<string, TokenPack> = {
  // ════════════════════════════════════════════════════════════
  // INDUSTRI: SEKOLAH (Sprint 7). 3 sub-kategori × 3 gaya.
  // Palet + pairing dikurasi via ui-ux-pro-max (DB, bukan invent);
  // kontras teks/bg ≥4.5:1. VARIASI gelap↔terang tiap sub-kat (#6).
  // ════════════════════════════════════════════════════════════

  // ── SEKOLAH REGULER (SD/SMP/SMA) — terpercaya, akademik ───────
  // cerdas (biru akademik terang) ↔ ceria (amber ramah, SD playful) ↔
  // prestasi (navy+emas gelap, SMA berprestasi). VARIASI terang↔gelap.
  'reguler-cerdas': {
    id: 'reguler-cerdas', label: 'Sekolah Cerdas', mood: 'clean',
    color: {
      page: '#F5F8FF', surface: '#FFFFFF', ink: '#142A4D', muted: '#566685',
      border: 'rgba(20,42,77,0.08)', primary: '#2563EB', onPrimary: '#FFFFFF',
      heroFrom: '#E3EDFF', heroTo: '#C5D8FB', heroInk: '#142A4D',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 800, bodyWeight: 400, tracking: '-0.03em' },
    radius: { sm: '12px', md: '18px', lg: '26px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(37,99,235,.07)',
      md: '0 8px 24px rgba(37,99,235,.12)',
      lg: '0 24px 50px rgba(37,99,235,.16)',
    },
    layout: { hero: 'split', features: 'grid', pad: 'normal', align: 'left' },
  },
  'reguler-ceria': {
    id: 'reguler-ceria', label: 'Sekolah Ceria', mood: 'warm',
    color: {
      page: '#FFFDF5', surface: '#FFFFFF', ink: '#2A2113', muted: '#7A6A4C',
      border: 'rgba(42,33,19,0.08)', primary: '#C2680C', onPrimary: '#FFFFFF',
      heroFrom: '#FFF1D2', heroTo: '#FFDDA6', heroInk: '#2A2113',
    },
    font: { display: ROUNDED, body: ROUNDED, displayWeight: 800, bodyWeight: 400, tracking: '-0.02em' },
    radius: { sm: '18px', md: '26px', lg: '34px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(194,104,12,.10)',
      md: '0 8px 24px rgba(194,104,12,.16)',
      lg: '0 24px 50px rgba(194,104,12,.20)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'normal', align: 'center' },
  },
  'reguler-prestasi': {
    id: 'reguler-prestasi', label: 'Sekolah Prestasi', mood: 'luxury',
    color: {
      page: '#111A2E', surface: '#1A2740', ink: '#ECF1F8', muted: '#94A4C0',
      border: 'rgba(255,255,255,0.10)', primary: '#C9A24A', onPrimary: '#111A2E',
      heroFrom: '#111A2E', heroTo: '#1E2F50', heroInk: '#F6EFD9',
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

  // ── SEKOLAH ISLAMI / PESANTREN — tenang, hijau/emas, spiritual ─
  // hijau (emerald segar terang) ↔ emas (krem+emas elegan hangat) ↔
  // malam (emerald gelap+emas, khusyuk). VARIASI terang↔gelap.
  'islami-hijau': {
    id: 'islami-hijau', label: 'Islami Hijau', mood: 'clean',
    color: {
      page: '#F1FAF5', surface: '#FFFFFF', ink: '#14271D', muted: '#5A7064',
      border: 'rgba(20,39,29,0.08)', primary: '#0F7A4E', onPrimary: '#FFFFFF',
      heroFrom: '#DDF3E6', heroTo: '#B6E3C9', heroInk: '#14271D',
    },
    font: { display: SERIF, body: SANS, displayWeight: 700, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '12px', md: '18px', lg: '24px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(15,122,78,.08)',
      md: '0 8px 24px rgba(15,122,78,.12)',
      lg: '0 24px 50px rgba(15,122,78,.16)',
    },
    layout: { hero: 'split', features: 'grid', pad: 'normal', align: 'left' },
  },
  'islami-emas': {
    id: 'islami-emas', label: 'Islami Emas', mood: 'warm',
    color: {
      page: '#FBF6EA', surface: '#FFFFFF', ink: '#2E2614', muted: '#7C6C49',
      border: 'rgba(46,38,20,0.10)', primary: '#936A1A', onPrimary: '#FFFFFF',
      heroFrom: '#F6E9C9', heroTo: '#E7CE94', heroInk: '#2E2614',
    },
    font: { display: SERIF, body: SERIF, displayWeight: 600, bodyWeight: 400, tracking: '-0.005em' },
    radius: { sm: '8px', md: '14px', lg: '20px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(120,90,20,.08)',
      md: '0 6px 20px rgba(120,90,20,.12)',
      lg: '0 24px 50px rgba(120,90,20,.16)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'airy', align: 'center' },
  },
  'islami-malam': {
    id: 'islami-malam', label: 'Islami Malam', mood: 'luxury',
    color: {
      page: '#0E2018', surface: '#163024', ink: '#ECF3EC', muted: '#92AC9C',
      border: 'rgba(255,255,255,0.10)', primary: '#CBA35A', onPrimary: '#0E2018',
      heroFrom: '#0E2018', heroTo: '#163E2C', heroInk: '#F3ECD7',
    },
    font: { display: SERIF, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.005em' },
    radius: { sm: '6px', md: '10px', lg: '16px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.4)',
      md: '0 8px 28px rgba(0,0,0,.45)',
      lg: '0 30px 60px rgba(0,0,0,.55)',
    },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },

  // ── KURSUS / BIMBEL — energik, modern, hasil ──────────────────
  // fokus (indigo modern terang) ↔ energi (coral semangat terang) ↔
  // malam (violet gelap, course online premium). VARIASI terang↔gelap.
  'kursus-fokus': {
    id: 'kursus-fokus', label: 'Kursus Fokus', mood: 'minimal',
    color: {
      page: '#F6F7FF', surface: '#FFFFFF', ink: '#16182E', muted: '#5C6080',
      border: 'rgba(22,24,46,0.08)', primary: '#4F46E5', onPrimary: '#FFFFFF',
      heroFrom: '#E8E9FF', heroTo: '#CFD1FB', heroInk: '#16182E',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 800, bodyWeight: 400, tracking: '-0.03em' },
    radius: { sm: '12px', md: '18px', lg: '24px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(79,70,229,.08)',
      md: '0 8px 24px rgba(79,70,229,.14)',
      lg: '0 24px 50px rgba(79,70,229,.18)',
    },
    layout: { hero: 'split', features: 'grid', pad: 'normal', align: 'left' },
  },
  'kursus-energi': {
    id: 'kursus-energi', label: 'Kursus Energi', mood: 'bold',
    color: {
      page: '#FFFFFF', surface: '#FFF6F3', ink: '#1F1410', muted: '#6E574F',
      border: 'rgba(220,66,32,0.12)', primary: '#DC4220', onPrimary: '#FFFFFF',
      heroFrom: '#FFE6DC', heroTo: '#FFD0B0', heroInk: '#1F1410',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 900, bodyWeight: 400, tracking: '-0.035em' },
    radius: { sm: '14px', md: '22px', lg: '30px', pill: '9999px' },
    shadow: {
      sm: '0 2px 6px rgba(220,66,32,.12)',
      md: '0 10px 28px rgba(220,66,32,.20)',
      lg: '0 28px 60px rgba(220,66,32,.26)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'normal', align: 'center' },
  },
  'kursus-malam': {
    id: 'kursus-malam', label: 'Kursus Malam', mood: 'luxury',
    color: {
      page: '#0E0A1A', surface: '#171127', ink: '#F1ECFB', muted: '#A99CC4',
      border: 'rgba(255,255,255,0.10)', primary: '#A855F7', onPrimary: '#FFFFFF',
      heroFrom: '#160C2C', heroTo: '#2C1452', heroInk: '#F4ECFF',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 800, bodyWeight: 400, tracking: '-0.03em' },
    radius: { sm: '12px', md: '18px', lg: '26px', pill: '9999px' },
    shadow: {
      sm: '0 2px 6px rgba(168,85,247,.16)',
      md: '0 10px 30px rgba(168,85,247,.24)',
      lg: '0 28px 60px rgba(168,85,247,.30)',
    },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },
}
