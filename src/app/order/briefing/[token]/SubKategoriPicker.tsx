'use client'
// ============================================================
// THEME SYSTEM — mini-step "Tipe Toko" (S0-3).
// Customer memilih sub-kategori → mem-filter daftar tema di selector Branding.
// DORMANT: hanya merender sub-kategori yang `ready`. Sekarang nol → produksi
// tak berubah (nol regresi). Aktif saat Sprint 1 menandai sub-kategori ready.
// Bahasa kartu meniru selector variant eksisting (Apple-clean).
// ============================================================
import { Check } from 'lucide-react'
import { getReadySubKategori } from '@/lib/theme-system/taxonomy'
import { ThemeIcon } from './ThemeIcon'

export default function SubKategoriPicker({
  tipe,
  value,
  onChange,
}: {
  tipe: string
  value: string
  onChange: (id: string) => void
}) {
  const subs = getReadySubKategori(tipe)
  if (subs.length === 0) return null

  return (
    <div className="animate-fade-in">
      <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">
        Tipe Toko
      </label>
      <p className="text-xs text-gray-400 font-medium mb-3">
        Pilih jenis tokomu — kami tampilkan gaya yang paling cocok.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {subs.map((s) => {
          const active = value === s.id
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange(s.id)}
              aria-pressed={active}
              className={`flex items-center gap-3 p-4 rounded-[16px] border-2 text-left transition-[border-color,background-color,transform] duration-200 active:scale-[0.98] ${
                active ? 'border-[#0071E3] bg-blue-50/40' : 'border-black/[0.06] hover:border-blue-200 bg-white'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${
                  active ? 'bg-[#0071E3] text-white' : 'bg-blue-50 text-[#0071E3]'
                }`}
              >
                <ThemeIcon name={s.icon} size={18} strokeWidth={2.25} />
              </div>
              <span className={`font-bold text-sm leading-tight ${active ? 'text-[#0071E3]' : 'text-gray-900'}`}>
                {s.nama}
              </span>
              {active && <Check size={15} className="text-[#0071E3] ml-auto shrink-0" strokeWidth={3} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
