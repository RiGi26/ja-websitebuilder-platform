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

// Sentinel "gaya umum" — TIDAK boleh sama dengan id sub-kategori mana pun (lintas
// industri), supaya getThemes(tipe, ESCAPE) selalu [] → jalur generik. Dulu 'umum'
// dan bentrok dengan sub-kat klinik 'umum' (dua kartu sama-sama aktif). Underscore
// memastikan tak pernah cocok dengan id taksonomi.
const ESCAPE = '__lainnya__'

// Label/microcopy per industri (picker dipakai lintas industri sejak Wave 2 klinik).
function copyFor(tipe: string): { label: string; hint: string } {
  if (tipe === 'klinik') return { label: 'Jenis Klinik', hint: 'Pilih jenis klinikmu — kami tampilkan gaya yang paling cocok.' }
  if (tipe === 'toko_online') return { label: 'Tipe Toko', hint: 'Pilih jenis tokomu — kami tampilkan gaya yang paling cocok.' }
  return { label: 'Kategori', hint: 'Pilih kategori bisnismu — kami tampilkan gaya yang paling cocok.' }
}

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
  const { label, hint } = copyFor(tipe)

  return (
    <div className="animate-fade-in">
      <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">
        {label}
      </label>
      <p className="text-xs text-gray-400 font-medium mb-3">
        {hint}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {subs.map((s) => (
          <SubCard key={s.id} icon={s.icon} nama={s.nama} active={value === s.id} onClick={() => onChange(s.id)} />
        ))}
        {/* Escape hatch: di luar kategori kurasi → gaya umum (variant lama). Sentinel
            ESCAPE (bukan '') supaya state awal "belum pilih" tetap kosong; bukan id
            sub-kat nyata supaya tak bentrok (mis. klinik 'umum'). */}
        <SubCard icon="LayoutGrid" nama="Lainnya (gaya umum)" active={value === ESCAPE} onClick={() => onChange(ESCAPE)} />
      </div>
    </div>
  )
}

function SubCard({ icon, nama, active, onClick }: { icon: string; nama: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
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
        <ThemeIcon name={icon} size={18} strokeWidth={2.25} />
      </div>
      <span className={`font-bold text-sm leading-tight ${active ? 'text-[#0071E3]' : 'text-gray-900'}`}>
        {nama}
      </span>
      {active && <Check size={15} className="text-[#0071E3] ml-auto shrink-0" strokeWidth={3} />}
    </button>
  )
}
