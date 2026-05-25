'use client'

import { useState } from 'react'
import { Plus, Check, Loader2, Sparkles, ShoppingBag } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

const ADDONS = [
  { id: 'blog', name: 'Blog / Artikel', price: 99000, yearlyMaint: 50000 },
  { id: 'shop', name: 'Online Shop', price: 299000, yearlyMaint: 199000 },
  { id: 'admin', name: 'Dashboard Admin', price: 199000, yearlyMaint: 99000 },
  { id: 'member', name: 'Login Member', price: 199000, yearlyMaint: 99000 },
  { id: 'lms', name: 'LMS / E-learning', price: 399000, yearlyMaint: 299000 },
  { id: 'quiz', name: 'Quiz Online', price: 249000, yearlyMaint: 99000 },
  { id: 'portal', name: 'Portal Siswa', price: 299000, yearlyMaint: 149000 },
  { id: 'gsheets', name: 'Google Sheets Integration', price: 149000, yearlyMaint: 49000 },
  { id: 'midtrans', name: 'Midtrans Payment', price: 299000, yearlyMaint: 99000 },
  { id: 'wa', name: 'WhatsApp Automation', price: 199000, yearlyMaint: 99000 },
  { id: 'invoice', name: 'Invoice Automation', price: 199000, yearlyMaint: 99000 },
  { id: 'seo', name: 'SEO Optimization', price: 149000, yearlyMaint: 49000 },
  { id: 'booking', name: 'Booking System', price: 249000, yearlyMaint: 99000 },
  { id: 'chat', name: 'Live Chat', price: 99000, yearlyMaint: 49000 },
]

const CONVENIENCE_FEE = 50000

interface Props {
  existingOrder: any
  onSuccess?: () => void
}

export default function AddonMarketplace({ existingOrder, onSuccess }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const currentAddons = existingOrder.selected_addons || []
  const availableAddons = ADDONS.filter(a => !currentAddons.includes(a.id))

  const toggleAddon = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const subtotal = selectedIds.reduce((acc, id) => {
    const addon = ADDONS.find(a => a.id === id)
    return acc + (addon?.price || 0)
  }, 0)

  const total = subtotal > 0 ? subtotal + CONVENIENCE_FEE : 0

  const handleUpgrade = async () => {
    if (selectedIds.length === 0) return
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          type: 'upgrade',
          parent_order_id: existingOrder.id,
          nomor_wa: existingOrder.nomor_wa,
          nama_usaha: existingOrder.nama_usaha,
          domain: existingOrder.domain || '',
          selected_addons: selectedIds,
          total_estimasi: total,
          total_maintenance: selectedIds.reduce((acc, id) => acc + (ADDONS.find(a => a.id === id)?.yearlyMaint || 0), 0),
          status: 'pending',
          progress_step: 4 // Langsung ke tahap development/integrasi
        }])
        .select()
        .single()

      if (error) throw error

      toast.success('Upgrade Berhasil Dipesan!', {
        description: 'Tim kami akan segera menghubungi Anda via WhatsApp.'
      })
      
      if (onSuccess) onSuccess()
      setSelectedIds([])
    } catch (err) {
      console.error('Upgrade error:', err)
      toast.error('Gagal memesan upgrade. Coba lagi nanti.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 py-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-apple-blue">
            <Sparkles size={20} />
        </div>
        <div>
            <h3 className="text-xl font-bold text-gray-900">Add-on Marketplace</h3>
            <p className="text-sm text-gray-500">Tingkatkan performa website Anda dengan fitur premium.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {availableAddons.map(addon => {
          const isSelected = selectedIds.includes(addon.id)
          return (
            <button
              key={addon.id}
              onClick={() => toggleAddon(addon.id)}
              className={`flex items-center justify-between p-5 rounded-[24px] border-2 transition-all text-left ${
                isSelected 
                  ? 'border-apple-blue bg-blue-50/50' 
                  : 'border-black/[0.03] bg-white hover:border-black/10'
              }`}
            >
              <div>
                <p className="font-bold text-gray-900">{addon.name}</p>
                <p className="text-sm text-apple-blue font-bold">Rp {addon.price.toLocaleString('id-ID')}</p>
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isSelected ? 'bg-apple-blue text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {isSelected ? <Check size={16} strokeWidth={3} /> : <Plus size={16} />}
              </div>
            </button>
          )
        })}
      </div>

      {selectedIds.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-[32px] p-8 text-white shadow-2xl"
        >
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Rincian Upgrade</p>
              <h4 className="text-2xl font-bold">Total Pembayaran</h4>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">Subtotal: Rp {subtotal.toLocaleString('id-ID')}</p>
              <p className="text-xs text-gray-400 mb-2">Instalasi: Rp {CONVENIENCE_FEE.toLocaleString('id-ID')}</p>
              <p className="text-3xl sf-display-heavy text-apple-blue">Rp {total.toLocaleString('id-ID')}</p>
            </div>
          </div>
          
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-apple-blue hover:bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <ShoppingBag size={20} />}
            Pesan Fitur Tambahan
          </button>
          <p className="text-[10px] text-center text-gray-500 mt-4 leading-relaxed uppercase tracking-tighter">
            *Biaya instalasi Rp {CONVENIENCE_FEE.toLocaleString('id-ID')} dikenakan untuk proses integrasi ke website yang sudah berjalan.
          </p>
        </motion.div>
      )}
    </div>
  )
}
