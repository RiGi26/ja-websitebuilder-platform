'use client'

import ImageUploadField from './ImageUploadField'

// Field foto hero gabungan: unggah + pengatur titik fokus dalam SATU preview besar.
// Foto hero dirender "cover" (mengisi penuh layar) sehingga sebagian terpotong;
// customer memilih bagian yang HARUS selalu terlihat. Dipakai form briefing,
// form detail (Lengkapi Website), dan tab Tampilan portal.
// focus = CSS position "x% y%" (background/object-position di renderer).
const FOCUS_POSITIONS = [
  { pos: '0% 0%', label: 'kiri atas' },
  { pos: '50% 0%', label: 'atas' },
  { pos: '100% 0%', label: 'kanan atas' },
  { pos: '0% 50%', label: 'kiri' },
  { pos: '50% 50%', label: 'tengah' },
  { pos: '100% 50%', label: 'kanan' },
  { pos: '0% 100%', label: 'kiri bawah' },
  { pos: '50% 100%', label: 'bawah' },
  { pos: '100% 100%', label: 'kanan bawah' },
]

export default function HeroImageField({
  value, focus, onChange, onFocusChange, uploadUrl, extraFields,
}: {
  value: string
  focus: string
  onChange: (url: string) => void
  onFocusChange: (pos: string) => void
  uploadUrl?: string
  extraFields?: Record<string, string>
}) {
  const cur = focus || '50% 50%'
  const curLabel = FOCUS_POSITIONS.find((p) => p.pos === cur)?.label ?? 'tengah'

  // Fokus selalu punya nilai eksplisit begitu ada foto; ikut terhapus saat foto dihapus.
  const handleUrl = (url: string) => {
    onChange(url)
    if (url && !focus) onFocusChange('50% 50%')
    if (!url) onFocusChange('')
  }

  return (
    <div>
      <ImageUploadField value={value} onChange={handleUrl} hidePreview uploadUrl={uploadUrl} extraFields={extraFields} />
      <p className="text-[11px] text-gray-500 font-medium mt-1.5">
        Terbaik: foto suasana / landscape resolusi tinggi. Foto produk berlatar putih kurang cocok jadi latar layar penuh.
      </p>
      {value && (
        <div className="mt-3">
          <p className="text-xs font-bold text-gray-700">Atur titik fokus foto</p>
          <p className="text-[11px] text-gray-500 font-medium mt-0.5">
            Klik bagian foto yang harus selalu terlihat — fokus saat ini:{' '}
            <span className="font-bold text-gray-700">{curLabel}</span>
          </p>
          <div
            className="relative w-full rounded-[14px] overflow-hidden border border-black/10 bg-gray-100 mt-2"
            style={{ aspectRatio: '16 / 9', backgroundImage: `url(${value})`, backgroundSize: 'cover', backgroundPosition: cur }}
          >
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
              {FOCUS_POSITIONS.map(({ pos, label }) => (
                <button
                  key={pos}
                  type="button"
                  aria-label={`Fokus ${label}`}
                  aria-pressed={cur === pos}
                  onClick={() => onFocusChange(pos)}
                  className="group flex items-center justify-center hover:bg-black/10 focus-visible:bg-black/10 transition-colors"
                >
                  <span
                    className={`w-4 h-4 rounded-full border-2 shadow transition-transform ${
                      cur === pos
                        ? 'bg-white border-[#0071E3] scale-125'
                        : 'bg-white/25 border-white/70 group-hover:bg-white/60'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
