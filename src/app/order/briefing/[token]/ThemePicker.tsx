'use client'
// ============================================================
// THEME SYSTEM — selector tema ter-filter (S0-3).
// Menampilkan 3 gaya untuk sub-kategori terpilih. Ikon lucide diwarnai `mood`
// tema + swatch — meniru selector variant eksisting. Dipakai di Branding step
// menggantikan grid variant lama saat sub-kategori dipilih.
// ============================================================
import { Check } from 'lucide-react'
import { getThemes } from '@/lib/theme-system/taxonomy'
import { ThemeIcon } from './ThemeIcon'

export default function ThemePicker({
  tipe,
  subKategori,
  value,
  onChange,
}: {
  tipe: string
  subKategori: string
  value: string
  onChange: (id: string) => void
}) {
  const themes = getThemes(tipe, subKategori)
  if (themes.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-3">
      {themes.map((t) => {
        const active = value === t.id
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            aria-pressed={active}
            className={`flex items-center gap-4 p-4 rounded-[16px] border-2 text-left transition-[border-color,background-color,transform] duration-200 active:scale-[0.98] ${
              active ? 'border-[#0071E3] bg-blue-50/40' : 'border-black/[0.06] hover:border-blue-200 bg-white'
            }`}
          >
            <div
              className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
              style={{ backgroundColor: `${t.mood}20`, border: `2px solid ${t.mood}`, color: t.mood }}
            >
              <ThemeIcon name={t.icon} size={18} strokeWidth={2.25} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-sm ${active ? 'text-[#0071E3]' : 'text-gray-900'}`}>{t.nama}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{t.deskripsi}</p>
            </div>
            {active && <Check size={16} className="text-[#0071E3] shrink-0" strokeWidth={3} />}
          </button>
        )
      })}
    </div>
  )
}
