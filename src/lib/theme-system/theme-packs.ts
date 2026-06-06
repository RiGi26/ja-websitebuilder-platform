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
// Rounded ramah untuk gaya playful (Anak) & lembut (Kecantikan blush).
const ROUNDED = "'SF Pro Rounded', ui-rounded, 'Hiragino Maru Gothic ProN', 'Quicksand', 'Segoe UI', system-ui, sans-serif"

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

  // ════════════════════════════════════════════════════════════
  // KERAJINAN / HERITAGE — motif & tekstur (panen BatikTokoRenderer).
  // pusaka (gelap pusaka indigo+emas, kawung) ↔ tenun (hangat terracotta,
  // anyaman) ↔ galeri (terang minimal, biarkan karya bernapas). VARIASI.
  // ════════════════════════════════════════════════════════════
  'kerajinan-pusaka': {
    id: 'kerajinan-pusaka', label: 'Kerajinan Pusaka', mood: 'luxury',
    color: {
      page: '#14102E', surface: '#1E1640', ink: '#F3E9D6', muted: '#B7A98C',
      border: 'rgba(255,255,255,0.10)', primary: '#C8922A', onPrimary: '#14102E',
      heroFrom: '#14102E', heroTo: '#2A1B4D', heroInk: '#F5E6C8',
    },
    font: { display: SERIF, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.005em' },
    radius: { sm: '4px', md: '8px', lg: '14px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.4)',
      md: '0 8px 28px rgba(0,0,0,.45)',
      lg: '0 30px 60px rgba(0,0,0,.55)',
    },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },
  'kerajinan-tenun': {
    id: 'kerajinan-tenun', label: 'Kerajinan Tenun', mood: 'warm',
    color: {
      page: '#F7EEE2', surface: '#FFFFFF', ink: '#3A2A1E', muted: '#7A6450',
      border: 'rgba(58,42,30,0.10)', primary: '#A8512C', onPrimary: '#FFFFFF',
      heroFrom: '#F3E2CE', heroTo: '#E4C39B', heroInk: '#3A2A1E',
    },
    font: { display: SERIF, body: SANS, displayWeight: 700, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '10px', md: '16px', lg: '22px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(120,53,15,.08)',
      md: '0 6px 20px rgba(120,53,15,.12)',
      lg: '0 24px 50px rgba(120,53,15,.16)',
    },
    layout: { hero: 'split', features: 'grid', pad: 'normal', align: 'left' },
  },
  'kerajinan-galeri': {
    id: 'kerajinan-galeri', label: 'Kerajinan Galeri', mood: 'minimal',
    color: {
      page: '#FAF8F4', surface: '#FFFFFF', ink: '#211D18', muted: '#837C71',
      border: 'rgba(0,0,0,0.07)', primary: '#8A6D3B', onPrimary: '#FFFFFF',
      heroFrom: '#F2EEE7', heroTo: '#E6DFD2', heroInk: '#211D18',
    },
    font: { display: SANS, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.02em' },
    radius: { sm: '8px', md: '14px', lg: '20px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(33,29,24,.05)',
      md: '0 8px 24px rgba(33,29,24,.08)',
      lg: '0 24px 50px rgba(33,29,24,.10)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'airy', align: 'center' },
  },

  // ════════════════════════════════════════════════════════════
  // KECANTIKAN / SKINCARE — lembut, elegan, pastel.
  // blush (rose pastel terang) ↔ glow (putih champagne bersih) ↔
  // noir (plum gelap rose-gold, parfum premium). VARIASI gelap↔terang.
  // ════════════════════════════════════════════════════════════
  'kecantikan-blush': {
    id: 'kecantikan-blush', label: 'Kecantikan Blush', mood: 'clean',
    color: {
      page: '#FFF6F4', surface: '#FFFFFF', ink: '#3D2B30', muted: '#927B80',
      border: 'rgba(61,43,48,0.08)', primary: '#D98A9E', onPrimary: '#FFFFFF',
      heroFrom: '#FFE9EC', heroTo: '#FBD7DE', heroInk: '#3D2B30',
    },
    font: { display: SERIF, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '16px', md: '24px', lg: '32px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(217,138,158,.10)',
      md: '0 8px 24px rgba(217,138,158,.16)',
      lg: '0 24px 50px rgba(217,138,158,.20)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'airy', align: 'center' },
  },
  'kecantikan-glow': {
    id: 'kecantikan-glow', label: 'Kecantikan Glow', mood: 'minimal',
    color: {
      page: '#FFFFFF', surface: '#FAF7F2', ink: '#2A2622', muted: '#8A8278',
      border: 'rgba(0,0,0,0.06)', primary: '#BD9A5F', onPrimary: '#2A2622',
      heroFrom: '#FFFFFF', heroTo: '#F4ECDD', heroInk: '#2A2622',
    },
    font: { display: SANS, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.02em' },
    radius: { sm: '10px', md: '16px', lg: '22px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.05)',
      md: '0 8px 24px rgba(0,0,0,.07)',
      lg: '0 24px 50px rgba(0,0,0,.10)',
    },
    layout: { hero: 'split', features: 'grid', pad: 'airy', align: 'left' },
  },
  'kecantikan-noir': {
    id: 'kecantikan-noir', label: 'Kecantikan Noir', mood: 'luxury',
    color: {
      page: '#17121A', surface: '#221A26', ink: '#F1E7EC', muted: '#B49FAE',
      border: 'rgba(255,255,255,0.10)', primary: '#D8A7A0', onPrimary: '#17121A',
      heroFrom: '#17121A', heroTo: '#34203A', heroInk: '#F6ECF0',
    },
    font: { display: SERIF, body: SANS, displayWeight: 500, bodyWeight: 400, tracking: '-0.005em' },
    radius: { sm: '4px', md: '8px', lg: '14px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.4)',
      md: '0 10px 30px rgba(0,0,0,.5)',
      lg: '0 30px 70px rgba(0,0,0,.6)',
    },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },

  // ════════════════════════════════════════════════════════════
  // ELEKTRONIK / GADGET — modern, gelap, tech.
  // onyx (gelap cyan elektrik) ↔ studio (terang Apple-clean) ↔
  // neon (gelap magenta gamer). VARIASI gelap↔terang + 2 nuansa gelap beda.
  // ════════════════════════════════════════════════════════════
  'gadget-onyx': {
    id: 'gadget-onyx', label: 'Gadget Onyx', mood: 'luxury',
    color: {
      page: '#0B0E14', surface: '#131822', ink: '#E8EDF4', muted: '#8A96A8',
      border: 'rgba(255,255,255,0.10)', primary: '#22D3EE', onPrimary: '#04141A',
      heroFrom: '#0B0E14', heroTo: '#11202B', heroInk: '#EAF6FA',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 800, bodyWeight: 400, tracking: '-0.03em' },
    radius: { sm: '8px', md: '14px', lg: '20px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.5)',
      md: '0 10px 30px rgba(34,211,238,.16)',
      lg: '0 28px 60px rgba(34,211,238,.22)',
    },
    layout: { hero: 'fullbleed', features: 'grid', pad: 'normal', align: 'left' },
  },
  'gadget-studio': {
    id: 'gadget-studio', label: 'Gadget Studio', mood: 'clean',
    color: {
      page: '#FFFFFF', surface: '#F5F6F8', ink: '#111316', muted: '#6B7280',
      border: 'rgba(0,0,0,0.07)', primary: '#0071E3', onPrimary: '#FFFFFF',
      heroFrom: '#FFFFFF', heroTo: '#EEF2F7', heroInk: '#111316',
    },
    font: { display: SANS, body: SANS, displayWeight: 800, bodyWeight: 400, tracking: '-0.03em' },
    radius: { sm: '12px', md: '18px', lg: '26px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.06)',
      md: '0 8px 24px rgba(0,0,0,.08)',
      lg: '0 24px 50px rgba(0,0,0,.10)',
    },
    layout: { hero: 'split', features: 'grid', pad: 'airy', align: 'left' },
  },
  'gadget-neon': {
    id: 'gadget-neon', label: 'Gadget Neon', mood: 'bold',
    color: {
      page: '#0A0712', surface: '#160F22', ink: '#F2ECFB', muted: '#9D8FB5',
      border: 'rgba(168,85,247,0.18)', primary: '#D946EF', onPrimary: '#FFFFFF',
      heroFrom: '#1A0B2E', heroTo: '#3B0A45', heroInk: '#FBEFFF',
    },
    font: { display: GROTESK, body: SANS, displayWeight: 900, bodyWeight: 400, tracking: '-0.035em' },
    radius: { sm: '12px', md: '20px', lg: '28px', pill: '9999px' },
    shadow: {
      sm: '0 2px 6px rgba(217,70,239,.14)',
      md: '0 10px 30px rgba(217,70,239,.24)',
      lg: '0 28px 60px rgba(217,70,239,.30)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'normal', align: 'center' },
  },

  // ════════════════════════════════════════════════════════════
  // RUMAH & DEKOR / FURNITURE — natural, lapang.
  // natural (kayu hangat terang) ↔ japandi (greige minimal lapang) ↔
  // walnut (walnut gelap moody premium). VARIASI gelap↔terang.
  // ════════════════════════════════════════════════════════════
  'rumah-natural': {
    id: 'rumah-natural', label: 'Rumah Natural', mood: 'warm',
    color: {
      page: '#F8F4EC', surface: '#FFFFFF', ink: '#322A1F', muted: '#7C7060',
      border: 'rgba(50,42,31,0.09)', primary: '#9C6B3F', onPrimary: '#FFFFFF',
      heroFrom: '#F1E7D4', heroTo: '#DFC9A6', heroInk: '#322A1F',
    },
    font: { display: SERIF, body: SANS, displayWeight: 700, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '12px', md: '18px', lg: '24px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(80,60,30,.07)',
      md: '0 6px 20px rgba(80,60,30,.10)',
      lg: '0 24px 50px rgba(80,60,30,.13)',
    },
    layout: { hero: 'split', features: 'grid', pad: 'airy', align: 'left' },
  },
  'rumah-japandi': {
    id: 'rumah-japandi', label: 'Rumah Japandi', mood: 'minimal',
    color: {
      page: '#F4F3EF', surface: '#FFFFFF', ink: '#2B2A26', muted: '#847F75',
      border: 'rgba(0,0,0,0.06)', primary: '#6B6657', onPrimary: '#FFFFFF',
      heroFrom: '#ECEAE3', heroTo: '#DAD6CB', heroInk: '#2B2A26',
    },
    font: { display: SANS, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.02em' },
    radius: { sm: '6px', md: '10px', lg: '16px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(43,42,38,.05)',
      md: '0 8px 24px rgba(43,42,38,.07)',
      lg: '0 24px 50px rgba(43,42,38,.09)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'airy', align: 'center' },
  },
  'rumah-walnut': {
    id: 'rumah-walnut', label: 'Rumah Walnut', mood: 'luxury',
    color: {
      page: '#16130F', surface: '#211C16', ink: '#ECE3D5', muted: '#ADA08C',
      border: 'rgba(255,255,255,0.09)', primary: '#C49A6C', onPrimary: '#16130F',
      heroFrom: '#16130F', heroTo: '#2E2419', heroInk: '#F2E8D8',
    },
    font: { display: SERIF, body: SANS, displayWeight: 600, bodyWeight: 400, tracking: '-0.005em' },
    radius: { sm: '4px', md: '8px', lg: '14px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(0,0,0,.4)',
      md: '0 8px 28px rgba(0,0,0,.45)',
      lg: '0 30px 60px rgba(0,0,0,.55)',
    },
    layout: { hero: 'fullbleed', features: 'rows', pad: 'airy', align: 'left' },
  },

  // ════════════════════════════════════════════════════════════
  // KESEHATAN & HERBAL — natural, hijau, trust.
  // daun (hijau segar terang) ↔ jamu (amber kunyit hangat tradisional) ↔
  // botani (emerald gelap emas, esensial premium). VARIASI gelap↔terang.
  // ════════════════════════════════════════════════════════════
  'herbal-daun': {
    id: 'herbal-daun', label: 'Herbal Daun', mood: 'clean',
    color: {
      page: '#F4F8EF', surface: '#FFFFFF', ink: '#1F2A1C', muted: '#69755F',
      border: 'rgba(31,42,28,0.08)', primary: '#4E944F', onPrimary: '#FFFFFF',
      heroFrom: '#E8F2DD', heroTo: '#CDE4B8', heroInk: '#1F2A1C',
    },
    font: { display: SANS, body: SANS, displayWeight: 700, bodyWeight: 400, tracking: '-0.02em' },
    radius: { sm: '12px', md: '18px', lg: '24px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(40,80,40,.07)',
      md: '0 6px 20px rgba(40,80,40,.10)',
      lg: '0 24px 50px rgba(40,80,40,.13)',
    },
    layout: { hero: 'split', features: 'grid', pad: 'normal', align: 'left' },
  },
  'herbal-jamu': {
    id: 'herbal-jamu', label: 'Herbal Jamu', mood: 'warm',
    color: {
      page: '#FBF3E4', surface: '#FFFFFF', ink: '#3A2A14', muted: '#826B49',
      border: 'rgba(58,42,20,0.10)', primary: '#C97A1B', onPrimary: '#FFFFFF',
      heroFrom: '#F6E4C2', heroTo: '#E9C079', heroInk: '#3A2A14',
    },
    font: { display: SERIF, body: SANS, displayWeight: 700, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '12px', md: '18px', lg: '26px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(120,80,15,.08)',
      md: '0 6px 20px rgba(120,80,15,.12)',
      lg: '0 24px 50px rgba(120,80,15,.16)',
    },
    layout: { hero: 'centered', features: 'rows', pad: 'normal', align: 'center' },
  },
  'herbal-botani': {
    id: 'herbal-botani', label: 'Herbal Botani', mood: 'luxury',
    color: {
      page: '#0E1A14', surface: '#16241C', ink: '#E7F0E7', muted: '#97AC9C',
      border: 'rgba(255,255,255,0.09)', primary: '#C9AE6A', onPrimary: '#0E1A14',
      heroFrom: '#0E1A14', heroTo: '#173626', heroInk: '#EDF5EC',
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

  // ════════════════════════════════════════════════════════════
  // BAYI & ANAK / MAINAN — playful, ramah (gelap tak cocok untuk anak).
  // pastel (mint-peach lembut) ↔ ceria (sky-sunny seimbang) ↔
  // pop (candy hot-pink lantang). VARIASI saturasi lembut↔lantang.
  // ════════════════════════════════════════════════════════════
  'anak-pastel': {
    id: 'anak-pastel', label: 'Anak Pastel', mood: 'minimal',
    color: {
      page: '#FBF7FF', surface: '#FFFFFF', ink: '#4A4458', muted: '#948CA6',
      border: 'rgba(74,68,88,0.08)', primary: '#8FC9C2', onPrimary: '#233B38',
      heroFrom: '#E8F7F4', heroTo: '#FDE6E9', heroInk: '#4A4458',
    },
    font: { display: ROUNDED, body: ROUNDED, displayWeight: 700, bodyWeight: 400, tracking: '-0.01em' },
    radius: { sm: '18px', md: '26px', lg: '34px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(74,68,88,.06)',
      md: '0 8px 24px rgba(143,201,194,.18)',
      lg: '0 24px 50px rgba(143,201,194,.22)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'airy', align: 'center' },
  },
  'anak-ceria': {
    id: 'anak-ceria', label: 'Anak Ceria', mood: 'clean',
    color: {
      page: '#F6FBFF', surface: '#FFFFFF', ink: '#1F2A44', muted: '#6B7689',
      border: 'rgba(31,42,68,0.08)', primary: '#2BA8E0', onPrimary: '#FFFFFF',
      heroFrom: '#DFF1FF', heroTo: '#FFF0C9', heroInk: '#1F2A44',
    },
    font: { display: ROUNDED, body: ROUNDED, displayWeight: 800, bodyWeight: 400, tracking: '-0.02em' },
    radius: { sm: '16px', md: '24px', lg: '30px', pill: '9999px' },
    shadow: {
      sm: '0 1px 3px rgba(43,168,224,.10)',
      md: '0 8px 24px rgba(43,168,224,.18)',
      lg: '0 24px 50px rgba(43,168,224,.22)',
    },
    layout: { hero: 'split', features: 'grid', pad: 'normal', align: 'left' },
  },
  'anak-pop': {
    id: 'anak-pop', label: 'Anak Pop', mood: 'bold',
    color: {
      page: '#FFFFFF', surface: '#FFF4FA', ink: '#2A0E22', muted: '#7A5C70',
      border: 'rgba(229,49,143,0.12)', primary: '#E5318F', onPrimary: '#FFFFFF',
      heroFrom: '#FFE0F0', heroTo: '#FFF3C4', heroInk: '#2A0E22',
    },
    font: { display: ROUNDED, body: ROUNDED, displayWeight: 900, bodyWeight: 400, tracking: '-0.025em' },
    radius: { sm: '18px', md: '28px', lg: '36px', pill: '9999px' },
    shadow: {
      sm: '0 2px 6px rgba(229,49,143,.12)',
      md: '0 10px 28px rgba(229,49,143,.22)',
      lg: '0 28px 60px rgba(229,49,143,.28)',
    },
    layout: { hero: 'centered', features: 'grid', pad: 'normal', align: 'center' },
  },

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
