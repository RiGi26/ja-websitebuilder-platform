import type { TokenPack } from '@/lib/design-tokens/packs'
import { SANS, SERIF, GROTESK, ROUNDED } from './_fonts'

// TOKO ONLINE (Sprint 1-3) — 8 sub-kategori × 3 gaya = 24 tema.
export const TOKO_PACKS: Record<string, TokenPack> = {
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
      page: '#FAFAF8', surface: '#FFFFFF', ink: '#1C1B19', muted: '#706C63',
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
      page: '#FAF8F4', surface: '#FFFFFF', ink: '#211D18', muted: '#736D62',
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
      page: '#FFF6F4', surface: '#FFFFFF', ink: '#3D2B30', muted: '#7C656C',
      border: 'rgba(61,43,48,0.08)', primary: '#D98A9E', onPrimary: '#1A1A1A',
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
      page: '#FFFFFF', surface: '#FAF7F2', ink: '#2A2622', muted: '#756E64',
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
      page: '#FFFFFF', surface: '#F5F6F8', ink: '#111316', muted: '#686F7D',
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
      page: '#F8F4EC', surface: '#FFFFFF', ink: '#322A1F', muted: '#776B57',
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
      page: '#F4F3EF', surface: '#FFFFFF', ink: '#2B2A26', muted: '#6E6A60',
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
      page: '#FBF7FF', surface: '#FFFFFF', ink: '#4A4458', muted: '#6E6788',
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
      page: '#F6FBFF', surface: '#FFFFFF', ink: '#1F2A44', muted: '#646E81',
      border: 'rgba(31,42,68,0.08)', primary: '#2BA8E0', onPrimary: '#1A1A1A',
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
}
