import type { TokenPack } from '@/lib/design-tokens/packs'
import { SANS, SERIF } from './_fonts'

export const KLINIK_PACKS: Record<string, TokenPack> = {
  // ════════════════════════════════════════════════════════════
  // INDUSTRI: KLINIK (Sprint 6). 3 sub-kategori × 3 gaya.
  // Tiap sub-kat WAJIB merentang gelap↔terang + mood beda (prinsip #6).
  // ════════════════════════════════════════════════════════════

  // ── KLINIK UMUM / GIGI — bersih, terpercaya, medis ────────────
  // bluecare (biru klinis terang) ↔ freshteal (teal segar terang) ↔
  // trustnavy (navy gelap profesional). VARIASI terang↔gelap.
  'umum-bluecare': {
    id: 'umum-bluecare', label: 'Klinik Bluecare', mood: 'clean',
    color: {
      page: '#F4F9FF', surface: '#FFFFFF', ink: '#14233A', muted: '#5E7088',
      border: 'rgba(20,35,58,0.08)', primary: '#1E6FE0', onPrimary: '#FFFFFF',
      heroFrom: '#E2EEFF', heroTo: '#C3DCFB', heroInk: '#14233A',
    },
    font: { display: SANS, body: SANS, displayWeight: 700, bodyWeight: 400, tracking: '-0.02em' },
    radius: { sm: '12px', md: '18px', lg: '26px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(30,111,224,.07)',
      md: '0 8px 24px rgba(30,111,224,.12)',
      lg: '0 24px 50px rgba(30,111,224,.16)',
    },
    layout: { hero: 'split', features: 'grid', pad: 'normal', align: 'left' },
  },
  'umum-freshteal': {
    id: 'umum-freshteal', label: 'Klinik Freshteal', mood: 'minimal',
    color: {
      page: '#F1FAF9', surface: '#FFFFFF', ink: '#102B2A', muted: '#5A7574',
      border: 'rgba(16,43,42,0.08)', primary: '#0E9E96', onPrimary: '#FFFFFF',
      heroFrom: '#DBF3F0', heroTo: '#B6E6E0', heroInk: '#102B2A',
    },
    font: { display: SANS, body: SANS, displayWeight: 700, bodyWeight: 400, tracking: '-0.02em' },
    radius: { sm: '14px', md: '20px', lg: '28px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(14,158,150,.07)',
      md: '0 8px 24px rgba(14,158,150,.12)',
      lg: '0 24px 50px rgba(14,158,150,.16)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'airy', align: 'center' },
  },
  'umum-trustnavy': {
    id: 'umum-trustnavy', label: 'Klinik Trustnavy', mood: 'luxury',
    color: {
      page: '#0E1A2B', surface: '#16243B', ink: '#E6EEF8', muted: '#94A6BE',
      border: 'rgba(255,255,255,0.10)', primary: '#4FA3F0', onPrimary: '#06121F',
      heroFrom: '#0E1A2B', heroTo: '#18304F', heroInk: '#EAF2FB',
    },
    font: { display: SANS, body: SANS, displayWeight: 800, bodyWeight: 400, tracking: '-0.03em' },
    radius: { sm: '10px', md: '14px', lg: '20px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.4)',
      md: '0 10px 30px rgba(0,0,0,.45)',
      lg: '0 28px 60px rgba(0,0,0,.55)',
    },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },

  // ── KLINIK ESTETIK / SKINCARE — lembut, elegan, hasil ─────────
  // rosegold (rose-gold hangat terang) ↔ derma (putih klinis pink lembut) ↔
  // noir (plum gelap mewah). VARIASI terang↔gelap. Pakai before-after.
  'estetik-rosegold': {
    id: 'estetik-rosegold', label: 'Estetik Rosegold', mood: 'warm',
    color: {
      page: '#FFF6F3', surface: '#FFFFFF', ink: '#3A2A2A', muted: '#917573',
      border: 'rgba(58,42,42,0.08)', primary: '#C58B6B', onPrimary: '#FFFFFF',
      heroFrom: '#FBE7DD', heroTo: '#F3CDBE', heroInk: '#3A2A2A',
    },
    font: { display: SERIF, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '16px', md: '24px', lg: '32px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(197,139,107,.10)',
      md: '0 8px 24px rgba(197,139,107,.16)',
      lg: '0 24px 50px rgba(197,139,107,.20)',
    },
    layout: { hero: 'split', features: 'grid', pad: 'airy', align: 'left' },
  },
  'estetik-derma': {
    id: 'estetik-derma', label: 'Estetik Derma', mood: 'clean',
    color: {
      page: '#FFFFFF', surface: '#F8FAFB', ink: '#1F2A30', muted: '#74828A',
      border: 'rgba(0,0,0,0.06)', primary: '#E0789C', onPrimary: '#FFFFFF',
      heroFrom: '#FFFFFF', heroTo: '#FBEAF0', heroInk: '#1F2A30',
    },
    font: { display: SANS, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.02em' },
    radius: { sm: '12px', md: '18px', lg: '24px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.05)',
      md: '0 8px 24px rgba(224,120,156,.12)',
      lg: '0 24px 50px rgba(224,120,156,.16)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'airy', align: 'center' },
  },
  'estetik-noir': {
    id: 'estetik-noir', label: 'Estetik Noir', mood: 'luxury',
    color: {
      page: '#1A1016', surface: '#251823', ink: '#F2E6EC', muted: '#B79FAC',
      border: 'rgba(255,255,255,0.10)', primary: '#D6A4B6', onPrimary: '#1A1016',
      heroFrom: '#1A1016', heroTo: '#35202E', heroInk: '#F7ECF1',
    },
    font: { display: SERIF, body: SANS, displayWeight: 500, bodyWeight: 400, tracking: '-0.005em' },
    radius: { sm: '6px', md: '10px', lg: '16px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.4)',
      md: '0 10px 30px rgba(0,0,0,.5)',
      lg: '0 30px 70px rgba(0,0,0,.6)',
    },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },

  // ── FISIO / WELLNESS — natural, tenang, menyembuhkan ──────────
  // sage (sage hijau lembut terang) ↔ terra (earth terracotta hangat) ↔
  // forest (hijau hutan gelap spa). VARIASI terang↔gelap.
  'wellness-sage': {
    id: 'wellness-sage', label: 'Wellness Sage', mood: 'minimal',
    color: {
      page: '#F4F7F1', surface: '#FFFFFF', ink: '#232B20', muted: '#6E7A63',
      border: 'rgba(35,43,32,0.08)', primary: '#6E8B5A', onPrimary: '#FFFFFF',
      heroFrom: '#E6EFDD', heroTo: '#CDDFC0', heroInk: '#232B20',
    },
    font: { display: SANS, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.02em' },
    radius: { sm: '14px', md: '20px', lg: '28px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(60,80,40,.06)',
      md: '0 8px 24px rgba(60,80,40,.10)',
      lg: '0 24px 50px rgba(60,80,40,.13)',
    },
    layout: { hero: 'split', features: 'grid', pad: 'airy', align: 'left' },
  },
  'wellness-terra': {
    id: 'wellness-terra', label: 'Wellness Terra', mood: 'warm',
    color: {
      page: '#FBF5EE', surface: '#FFFFFF', ink: '#2E241B', muted: '#7E6B57',
      border: 'rgba(46,36,27,0.09)', primary: '#B07A4E', onPrimary: '#FFFFFF',
      heroFrom: '#F3E5D3', heroTo: '#E4C8A6', heroInk: '#2E241B',
    },
    font: { display: SERIF, body: SANS, displayWeight: 700, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '12px', md: '18px', lg: '26px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(120,80,40,.07)',
      md: '0 6px 20px rgba(120,80,40,.11)',
      lg: '0 24px 50px rgba(120,80,40,.15)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'normal', align: 'center' },
  },
  'wellness-forest': {
    id: 'wellness-forest', label: 'Wellness Forest', mood: 'luxury',
    color: {
      page: '#0F1A14', surface: '#17241C', ink: '#E7F0E8', muted: '#96AC9B',
      border: 'rgba(255,255,255,0.09)', primary: '#5FB389', onPrimary: '#06140D',
      heroFrom: '#0F1A14', heroTo: '#163525', heroInk: '#EDF5EE',
    },
    font: { display: SERIF, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.005em' },
    radius: { sm: '8px', md: '12px', lg: '18px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.4)',
      md: '0 8px 28px rgba(0,0,0,.45)',
      lg: '0 30px 60px rgba(0,0,0,.55)',
    },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },
}
