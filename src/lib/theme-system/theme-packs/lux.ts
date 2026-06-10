import type { TokenPack } from '@/lib/design-tokens/packs'
import { SANS, SERIF } from './_fonts'

// ════════════════════════════════════════════════════════════
// LUX TIER — palet flagship-fidelity, DEFAULT premium per industri
// ("website luar biasa, harga murah"). Tiap pack membawa sub-objek `lux`
// → ComposableRenderer memberi atribut data-lux pada .ce-root (gerbang craft
// di blocks.tsx: motion deliberate, eyebrow divider, hero sinematik) TERLEPAS
// dari mood gelap/terang. Mood HERITAGE: serif display (Fraunces), radius
// tajam-terkendali, ornamen hemat. Kontras AA dijaga contrast.test.ts.
//
// PILOT (Sprint 1): restaurant (gelap, seed flagship aurum) + klinik (terang,
// clinical-premium). Industri lain menyusul (Sprint 2) — pola sama, palet
// industry-fit (terang/gelap sesuai sektor), semua bawa lux:{}.
// ════════════════════════════════════════════════════════════
export const LUX_PACKS: Record<string, TokenPack> = {
  // ── lux-restaurant — near-black hangat + emas (seed RestaurantLux aurum) ──
  // Benchmark visual = RestaurantLuxRenderer aurum. Nada lux dipanen verbatim
  // dari flagship (--rl-bg2/-inkDim/-line2) supaya parametrik ≥ flagship.
  'lux-restaurant': {
    id: 'lux-restaurant', label: 'Lux Restaurant', mood: 'luxury',
    color: {
      page: '#100C0A', surface: '#1C1714', ink: '#F3ECE1', muted: '#A1937F',
      border: 'rgba(243,236,225,0.10)', primary: '#C9A24B', onPrimary: '#16120A',
      heroFrom: '#100C0A', heroTo: '#2A2014', heroInk: '#F6EDD8',
    },
    font: { display: SERIF, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.005em' },
    radius: { sm: '3px', md: '6px', lg: '12px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.4)',
      md: '0 10px 30px rgba(0,0,0,.5)',
      lg: '0 30px 70px rgba(0,0,0,.6)',
    },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
    lux: {
      surface2: '#15100D', inkDim: '#D9CDBC', border2: 'rgba(243,236,225,0.06)',
      ease: 'cubic-bezier(.16,1,.3,1)', durFast: '.35s', durSlow: '.9s',
    },
  },

  // ── lux-klinik — ivory hangat + petrol-teal dalam (heritage clinical) ──
  // Premium TAPI terang/terpercaya (medis butuh terang). Aksen petrol-teal
  // dalam #134E48 (lebih dalam & heritage dari freshteal cerah → variasi
  // intra-industri). Serif Fraunces utk kehangatan, body sans utk keterbacaan.
  'lux-klinik': {
    id: 'lux-klinik', label: 'Lux Klinik', mood: 'clean',
    color: {
      page: '#FBF8F3', surface: '#FFFFFF', ink: '#1A2421', muted: '#5C6B64',
      border: 'rgba(26,36,33,0.10)', primary: '#134E48', onPrimary: '#FFFFFF',
      heroFrom: '#EDE7DC', heroTo: '#DDE6E1', heroInk: '#1A2421',
    },
    font: { display: SERIF, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.005em' },
    radius: { sm: '6px', md: '10px', lg: '16px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(19,78,72,.06)',
      md: '0 10px 30px rgba(19,78,72,.10)',
      lg: '0 30px 60px rgba(19,78,72,.13)',
    },
    layout: { hero: 'split', features: 'rows', pad: 'airy', align: 'left' },
    lux: {
      surface2: '#F4EFE7', inkDim: '#3C4742', border2: 'rgba(26,36,33,0.06)',
      ease: 'cubic-bezier(.16,1,.3,1)', durFast: '.3s', durSlow: '.7s',
    },
  },

  // ════════════════════════════════════════════════════════════
  // SPRINT 2 — 7 industri sisa. Palet INDUSTRY-FIT (terang/gelap sesuai
  // sektor), tiap warna distinct lintas 9 industri, semua bawa lux:{}.
  // Kontras 6-pasang (contrast.test.ts) dijaga; mood heritage (serif display).
  // ════════════════════════════════════════════════════════════

  // ── lux-corporate — TERANG sejuk + navy dalam (premium consulting/B2B) ──
  'lux-corporate': {
    id: 'lux-corporate', label: 'Lux Corporate', mood: 'clean',
    color: {
      page: '#F6F7F9', surface: '#FFFFFF', ink: '#16202E', muted: '#586478',
      border: 'rgba(22,32,46,0.10)', primary: '#1B3A6B', onPrimary: '#FFFFFF',
      heroFrom: '#E9EEF4', heroTo: '#DBE3ED', heroInk: '#16202E',
    },
    font: { display: SERIF, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.015em' },
    radius: { sm: '4px', md: '8px', lg: '14px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(22,32,46,.06)', md: '0 10px 30px rgba(22,32,46,.10)', lg: '0 30px 60px rgba(22,32,46,.13)' },
    layout: { hero: 'split', features: 'rows', pad: 'airy', align: 'left' },
    lux: { surface2: '#EEF1F5', inkDim: '#3A4556', border2: 'rgba(22,32,46,0.06)', ease: 'cubic-bezier(.16,1,.3,1)', durFast: '.3s', durSlow: '.7s' },
  },

  // ── lux-sekolah — TERANG hangat + crimson akademik (heritage kampus) ──
  'lux-sekolah': {
    id: 'lux-sekolah', label: 'Lux Sekolah', mood: 'warm',
    color: {
      page: '#FBF7EF', surface: '#FFFFFF', ink: '#241F22', muted: '#6A5F61',
      border: 'rgba(36,31,34,0.10)', primary: '#7A2230', onPrimary: '#FFFFFF',
      heroFrom: '#F6EAD9', heroTo: '#EFE0DF', heroInk: '#241F22',
    },
    font: { display: SERIF, body: SANS, displayWeight: 700, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '8px', md: '12px', lg: '18px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(120,40,40,.07)', md: '0 10px 28px rgba(120,40,40,.11)', lg: '0 28px 56px rgba(120,40,40,.15)' },
    layout: { hero: 'split', features: 'rows', pad: 'airy', align: 'left' },
    lux: { surface2: '#F4EDE0', inkDim: '#463E40', border2: 'rgba(36,31,34,0.06)', ease: 'cubic-bezier(.16,1,.3,1)', durFast: '.3s', durSlow: '.7s' },
  },

  // ── lux-toko — TERANG monokrom boutique (ink, editorial fashion-retail) ──
  'lux-toko': {
    id: 'lux-toko', label: 'Lux Toko', mood: 'minimal',
    color: {
      page: '#FAF8F5', surface: '#FFFFFF', ink: '#1C1916', muted: '#6E655E',
      border: 'rgba(28,25,22,0.10)', primary: '#1C1916', onPrimary: '#FFFFFF',
      heroFrom: '#F1ECE5', heroTo: '#E6DED4', heroInk: '#1C1916',
    },
    font: { display: SERIF, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.02em' },
    radius: { sm: '4px', md: '10px', lg: '16px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(28,25,22,.06)', md: '0 10px 30px rgba(28,25,22,.10)', lg: '0 30px 60px rgba(28,25,22,.12)' },
    layout: { hero: 'split', features: 'grid', pad: 'airy', align: 'left' },
    lux: { surface2: '#F2ECE4', inkDim: '#46403B', border2: 'rgba(28,25,22,0.06)', ease: 'cubic-bezier(.16,1,.3,1)', durFast: '.3s', durSlow: '.7s' },
  },

  // ── lux-travel — GELAP indigo malam + amber senja (sinematik wanderlust) ──
  'lux-travel': {
    id: 'lux-travel', label: 'Lux Travel', mood: 'luxury',
    color: {
      page: '#0E1424', surface: '#18202F', ink: '#ECF1F6', muted: '#93A2B3',
      border: 'rgba(236,241,246,0.10)', primary: '#E0954A', onPrimary: '#16110A',
      heroFrom: '#0E1424', heroTo: '#213048', heroInk: '#F1F6FB',
    },
    font: { display: SERIF, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '6px', md: '10px', lg: '16px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(0,0,0,.4)', md: '0 10px 30px rgba(0,0,0,.5)', lg: '0 30px 70px rgba(0,0,0,.6)' },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
    lux: { surface2: '#121A2A', inkDim: '#C5D0DB', border2: 'rgba(236,241,246,0.06)', ease: 'cubic-bezier(.16,1,.3,1)', durFast: '.35s', durSlow: '.9s' },
  },

  // ── lux-personal — GELAP netral + clay-rose (spotlight kreator/portfolio) ──
  'lux-personal': {
    id: 'lux-personal', label: 'Lux Personal', mood: 'luxury',
    color: {
      page: '#131214', surface: '#1D1B1F', ink: '#F0EEF2', muted: '#9D98A3',
      border: 'rgba(240,238,242,0.10)', primary: '#C2766B', onPrimary: '#17110F',
      heroFrom: '#131214', heroTo: '#2A2326', heroInk: '#F4F1F0',
    },
    font: { display: SERIF, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '4px', md: '10px', lg: '16px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(0,0,0,.4)', md: '0 10px 30px rgba(0,0,0,.5)', lg: '0 30px 70px rgba(0,0,0,.6)' },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
    lux: { surface2: '#181619', inkDim: '#CFCAD0', border2: 'rgba(240,238,242,0.06)', ease: 'cubic-bezier(.16,1,.3,1)', durFast: '.35s', durSlow: '.9s' },
  },

  // ── lux-blog — TERANG kertas + plum sastrawi (reading editorial, all-serif) ──
  'lux-blog': {
    id: 'lux-blog', label: 'Lux Blog', mood: 'minimal',
    color: {
      page: '#FCFAF6', surface: '#FFFFFF', ink: '#211E22', muted: '#6B636A',
      border: 'rgba(33,30,34,0.10)', primary: '#5E3A5B', onPrimary: '#FFFFFF',
      heroFrom: '#F3ECEF', heroTo: '#EAE2E6', heroInk: '#211E22',
    },
    font: { display: SERIF, body: SERIF, displayWeight: 600, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '6px', md: '12px', lg: '18px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(33,30,34,.06)', md: '0 10px 30px rgba(33,30,34,.10)', lg: '0 30px 60px rgba(33,30,34,.12)' },
    layout: { hero: 'centered', features: 'rows', pad: 'airy', align: 'left' },
    lux: { surface2: '#F3EFEA', inkDim: '#45404A', border2: 'rgba(33,30,34,0.06)', ease: 'cubic-bezier(.16,1,.3,1)', durFast: '.3s', durSlow: '.7s' },
  },

  // ── lux-jastip — GELAP charcoal + jade (premium global, aspirational) ──
  'lux-jastip': {
    id: 'lux-jastip', label: 'Lux Jastip', mood: 'luxury',
    color: {
      page: '#121212', surface: '#1C1C1E', ink: '#F2F1EF', muted: '#9C9A97',
      border: 'rgba(242,241,239,0.10)', primary: '#18684E', onPrimary: '#FFFFFF',
      heroFrom: '#121212', heroTo: '#1C2E28', heroInk: '#F2F6F3',
    },
    font: { display: SERIF, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '4px', md: '8px', lg: '14px', pill: '9999px' },
    shadow: { sm: '0 1px 3px rgba(0,0,0,.4)', md: '0 10px 30px rgba(0,0,0,.5)', lg: '0 30px 70px rgba(0,0,0,.6)' },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
    lux: { surface2: '#161616', inkDim: '#CFCDCA', border2: 'rgba(242,241,239,0.06)', ease: 'cubic-bezier(.16,1,.3,1)', durFast: '.35s', durSlow: '.9s' },
  },
}
