'use client'

interface BrandingPreviewProps {
  bg: 'dark' | 'light' | 'warm'
  primaryColor: string
  namaUsaha: string
  tagline?: string
  emoji: string
  variantNama: string
}

export default function BrandingPreview({
  bg,
  primaryColor,
  namaUsaha,
  tagline,
  emoji,
  variantNama,
}: BrandingPreviewProps) {
  const isDark = bg === 'dark'
  const isWarm = bg === 'warm'

  const heroBg = isDark
    ? 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)'
    : isWarm
    ? 'linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%)'
    : 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)'

  const textPrimary = isDark ? '#FFFFFF' : '#0F172A'
  const textMuted = isDark ? 'rgba(255,255,255,0.45)' : '#64748B'
  const navBg = isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.85)'
  const cardBg = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.95)'
  const cardBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'

  const displayName = namaUsaha.trim() || 'Nama Bisnis'
  const displayTagline = tagline?.trim() || 'Tagline bisnis Anda yang berkesan dan mudah diingat'

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-black/[0.08] shadow-sm select-none"
      style={{ background: heroBg, transition: 'background 400ms ease' }}
    >
      {/* Live badge */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: primaryColor }}
        />
        <span
          className="text-[9px] font-black uppercase tracking-[0.12em] px-2 py-0.5 rounded-full"
          style={{
            background: primaryColor + '18',
            color: primaryColor,
            transition: 'all 300ms ease',
          }}
        >
          Live Preview
        </span>
      </div>

      {/* Navbar */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{
          background: navBg,
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
          transition: 'background 400ms ease',
        }}
      >
        <div className="flex items-center gap-1.5">
          <div
            className="w-4 h-4 rounded-[5px] shrink-0"
            style={{ background: primaryColor, transition: 'background 300ms ease' }}
          />
          <span
            className="text-[10px] font-black truncate max-w-[80px]"
            style={{ color: textPrimary, transition: 'color 400ms ease' }}
          >
            {displayName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {['Beranda', 'Layanan'].map(item => (
            <span
              key={item}
              className="text-[8px] font-bold hidden sm:block"
              style={{ color: textMuted, transition: 'color 400ms ease' }}
            >
              {item}
            </span>
          ))}
          <div
            className="px-2.5 py-1 rounded-full text-[8px] font-black text-white"
            style={{
              background: primaryColor,
              transition: 'background 300ms ease',
            }}
          >
            Hubungi
          </div>
        </div>
      </div>

      {/* Hero section */}
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Eyebrow */}
            <div
              className="text-[8px] font-black uppercase tracking-[0.14em] mb-2"
              style={{ color: primaryColor, transition: 'color 300ms ease' }}
            >
              {variantNama}
            </div>

            {/* Headline */}
            <div
              className="text-[18px] font-black leading-tight mb-2 truncate"
              style={{ color: textPrimary, transition: 'color 400ms ease' }}
            >
              {displayName}
            </div>

            {/* Tagline */}
            <div
              className="text-[9px] font-medium leading-relaxed mb-4 line-clamp-2"
              style={{ color: textMuted, transition: 'color 400ms ease' }}
            >
              {displayTagline}
            </div>

            {/* CTA */}
            <div
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[9px] font-black text-white"
              style={{
                background: primaryColor,
                boxShadow: `0 4px 16px ${primaryColor}45`,
                transition: 'background 300ms ease, box-shadow 300ms ease',
              }}
            >
              <span>{emoji}</span>
              <span>Mulai Sekarang</span>
            </div>
          </div>

          {/* Visual accent block */}
          <div
            className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
            style={{
              background: primaryColor + '18',
              border: `1.5px solid ${primaryColor}28`,
              transition: 'background 300ms ease, border-color 300ms ease',
            }}
          >
            {emoji}
          </div>
        </div>
      </div>

      {/* Cards row */}
      <div className="grid grid-cols-3 gap-2 px-4 pb-4">
        {[
          { label: 'Layanan', desc: 'Kualitas terjamin' },
          { label: 'Promo', desc: 'Harga terbaik' },
          { label: 'Kontak', desc: 'Siap melayani' },
        ].map((item, i) => (
          <div
            key={i}
            className="rounded-[10px] p-2.5"
            style={{
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              transition: 'background 400ms ease, border-color 400ms ease',
            }}
          >
            <div
              className="w-5 h-5 rounded-[6px] mb-1.5"
              style={{
                background: primaryColor + '28',
                transition: 'background 300ms ease',
              }}
            />
            <div
              className="text-[9px] font-black"
              style={{ color: textPrimary, transition: 'color 400ms ease' }}
            >
              {item.label}
            </div>
            <div
              className="text-[8px] mt-0.5"
              style={{ color: textMuted, transition: 'color 400ms ease' }}
            >
              {item.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div
        className="px-4 py-2 flex items-center justify-between"
        style={{
          background: isDark ? 'rgba(0,0,0,0.4)' : isWarm ? 'rgba(0,0,0,0.04)' : 'rgba(0,0,0,0.03)',
          borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`,
          transition: 'background 400ms ease',
        }}
      >
        <span className="text-[8px] font-bold" style={{ color: textMuted }}>
          © {displayName}
        </span>
        <div className="flex items-center gap-1">
          {['IG', 'WA'].map(s => (
            <div
              key={s}
              className="w-4 h-4 rounded-full text-[6px] font-black flex items-center justify-center text-white"
              style={{ background: primaryColor + '80', transition: 'background 300ms ease' }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
