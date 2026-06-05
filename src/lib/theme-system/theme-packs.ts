// ============================================================
// THEME SYSTEM — token pack otentik per gaya (Sprint 1, S1-1).
// Berbeda dari packs.ts (token generik per-industri): file ini berisi token
// yang DIRACIK khusus tiap gaya tema sub-kategori. Manifest mereferensikan id
// di sini lebih dulu (resolveManifestPack), fallback ke PACKS generik.
//
// Font: pakai stack sistem/generik dulu (konsisten dgn packs.ts). Ganti ke font
// asli per gaya (next/font) = polish berikutnya.
// ============================================================
import type { TokenPack } from '@/lib/design-tokens/packs'

const SANS = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
const SERIF = "'Iowan Old Style', 'Palatino Linotype', Georgia, 'Times New Roman', serif"
// Grotesque tegas untuk gaya editorial/streetwear (fallback sistem, ganti next/font = polish lanjut).
const GROTESK = "'Helvetica Neue', 'Arial Narrow', Helvetica, Arial, sans-serif"

export const THEME_PACKS: Record<string, TokenPack> = {
  // ── KULINER · Rustic Hangat — warung homemade, hangat, menggugah ──────
  'kuliner-rustic': {
    id: 'kuliner-rustic', label: 'Kuliner Rustic Hangat', mood: 'warm',
    color: {
      page: '#FBF6EE', surface: '#FFFFFF', ink: '#2B1D14', muted: '#6B5848',
      border: 'rgba(43,29,20,0.10)', primary: '#B5532A', onPrimary: '#FFFFFF',
      heroFrom: '#FCEFE0', heroTo: '#F6D9B8', heroInk: '#2B1D14',
    },
    font: { display: SERIF, body: SANS, displayWeight: 800, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '14px', md: '22px', lg: '30px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(120,53,15,.08)',
      md: '0 6px 20px rgba(120,53,15,.12)',
      lg: '0 24px 50px rgba(120,53,15,.16)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'normal', align: 'center' },
  },

  // ── KULINER · Modern Appetite — brand F&B kekinian, bersih, cerah ─────
  'kuliner-modern': {
    id: 'kuliner-modern', label: 'Kuliner Modern Appetite', mood: 'bold',
    color: {
      page: '#FFFFFF', surface: '#FAF7F5', ink: '#1A1A1A', muted: '#6B6B6B',
      border: 'rgba(0,0,0,0.07)', primary: '#E2582B', onPrimary: '#FFFFFF',
      heroFrom: '#FFFFFF', heroTo: '#FFE3D4', heroInk: '#1A1A1A',
    },
    font: { display: SANS, body: SANS, displayWeight: 900, bodyWeight: 400, tracking: '-0.03em' },
    radius: { sm: '12px', md: '18px', lg: '24px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.06)',
      md: '0 6px 20px rgba(226,88,43,.16)',
      lg: '0 24px 50px rgba(226,88,43,.20)',
    },
    layout: { hero: 'split', features: 'grid', pad: 'normal', align: 'left' },
  },

  // ── KULINER · Heritage — premium/tradisional, gelap-hangat maroon+gold ─
  'kuliner-heritage': {
    id: 'kuliner-heritage', label: 'Kuliner Heritage', mood: 'luxury',
    color: {
      page: '#1A1011', surface: '#241619', ink: '#F4E9DE', muted: '#B9A89B',
      border: 'rgba(255,255,255,0.10)', primary: '#C8A24B', onPrimary: '#1A1011',
      heroFrom: '#1A1011', heroTo: '#3D1F23', heroInk: '#FDF6EC',
    },
    font: { display: SERIF, body: SANS, displayWeight: 700, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '6px', md: '10px', lg: '16px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.4)',
      md: '0 8px 28px rgba(0,0,0,.45)',
      lg: '0 30px 60px rgba(0,0,0,.55)',
    },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },

  // ── FASHION · Editorial — magazine/lookbook, mono dingin, gelap ───────
  // Distinct dari kuliner-heritage: dingin & monokrom (bukan maroon+gold hangat).
  // Tombol ivory di atas charcoal → kontras tinggi, rasa high-fashion.
  'fashion-editorial': {
    id: 'fashion-editorial', label: 'Fashion Editorial', mood: 'luxury',
    color: {
      page: '#0E0E0F', surface: '#16161A', ink: '#F2EFEA', muted: '#9A958C',
      border: 'rgba(255,255,255,0.12)', primary: '#F2EFEA', onPrimary: '#0E0E0F',
      heroFrom: '#0E0E0F', heroTo: '#1F1F24', heroInk: '#F7F4EE',
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

  // ── FASHION · Minimalis — Scandinavian, greige lapang, terang & kalem ─
  'fashion-minimal': {
    id: 'fashion-minimal', label: 'Fashion Minimalis', mood: 'minimal',
    color: {
      page: '#FAFAF8', surface: '#FFFFFF', ink: '#1C1B19', muted: '#8A857C',
      border: 'rgba(0,0,0,0.07)', primary: '#1C1B19', onPrimary: '#FFFFFF',
      heroFrom: '#F4F1EC', heroTo: '#E8E2D8', heroInk: '#1C1B19',
    },
    font: { display: SANS, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.02em' },
    radius: { sm: '10px', md: '16px', lg: '20px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(28,27,25,.05)',
      md: '0 8px 24px rgba(28,27,25,.08)',
      lg: '0 24px 50px rgba(28,27,25,.10)',
    },
    layout: { hero: 'split', features: 'grid', pad: 'airy', align: 'left' },
  },

  // ── FASHION · Vibrant — streetwear, indigo elektrik, playful & ramai ──
  'fashion-vibrant': {
    id: 'fashion-vibrant', label: 'Fashion Vibrant', mood: 'bold',
    color: {
      page: '#FFFFFF', surface: '#F6F3FF', ink: '#0A0A0A', muted: '#5C5560',
      border: 'rgba(91,43,232,0.12)', primary: '#5B2BE8', onPrimary: '#FFFFFF',
      heroFrom: '#EFE8FF', heroTo: '#FFE4F2', heroInk: '#16091F',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 900, bodyWeight: 400, tracking: '-0.035em' },
    radius: { sm: '16px', md: '24px', lg: '32px', pill: '9999px' },
    shadow: {
      sm: '0 2px 6px rgba(91,43,232,.10)',
      md: '0 10px 28px rgba(91,43,232,.20)',
      lg: '0 28px 60px rgba(91,43,232,.26)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'normal', align: 'center' },
  },
}
