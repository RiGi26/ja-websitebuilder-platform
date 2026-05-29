import { supabaseAdmin } from '@/lib/supabase-admin'
import { 
  Briefcase, 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  MessageCircle, 
  Package, 
  CheckCircle2, 
  Clock, 
  User, 
  Building2,
  ExternalLink,
  Zap,
  DollarSign,
  LogOut
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import OrderStatusControl from './OrderStatusControl'

export const dynamic = 'force-dynamic'

async function getOrders() {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }
  return data
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Force redeploy to verify fixed helpers
export default async function StudioAdminPage() {
  const cookieStore = await cookies()
  const isAuth = cookieStore.get('admin_auth')?.value === 'true'

  if (!isAuth) {
    redirect('/admin/login')
  }

  const orders = await getOrders()

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Navbar />
      
      <main className="pt-32 pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12 animate-fade-in">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-apple-blue px-3 py-1 bg-blue-50 rounded-lg inline-block">
                    Studio Management
                </p>
                <Link href="/" className="text-[10px] font-bold text-gray-400 hover:text-apple-blue transition-colors flex items-center gap-1 uppercase tracking-widest">
                    <ChevronLeft size={12} /> Kembali ke Beranda
                </Link>
              </div>
              <h1 className="text-4xl md:text-5xl sf-display-heavy text-[#1D1D1F] tracking-tight">
                Brief Website Masuk
              </h1>
              <p className="text-gray-500 mt-2 font-medium">Pantau dan kelola semua calon klien yang telah mengisi brief.</p>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="bg-white px-6 py-4 rounded-3xl apple-shadow border border-black/5 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Leads</p>
                    <p className="text-3xl sf-display-heavy text-apple-blue">{orders.length}</p>
               </div>
               <a href="/api/admin/logout" className="p-4 bg-white rounded-2xl apple-shadow border border-black/5 text-red-500 hover:bg-red-50 transition-colors" title="Logout">
                  <LogOut size={20} />
               </a>
            </div>
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 gap-6">
            {orders.length === 0 ? (
              <div className="bg-white rounded-[40px] p-24 text-center apple-shadow border border-black/[0.03]">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package size={48} className="text-gray-200" />
                </div>
                <h2 className="text-2xl sf-display-heavy text-gray-900 mb-2">Belum ada brief masuk</h2>
                <p className="text-gray-500">Semua data pendaftaran dari website utama akan muncul di sini.</p>
              </div>
            ) : (
              orders.map((order, index) => (
                <div 
                  key={order.id}
                  className="bg-white rounded-[32px] p-6 md:p-10 apple-shadow border border-black/[0.03] transition-all duration-300 hover:scale-[1.005] group"
                >
                  <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* Client Info & Status */}
                    <div className="lg:w-1/3 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${order.client_type === 'perusahaan' ? 'bg-indigo-500' : 'bg-apple-blue'}`}>
                          {order.client_type === 'perusahaan' ? <Building2 size={24} /> : <User size={24} />}
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{order.client_type}</p>
                          <h3 className="text-xl sf-display-heavy text-gray-900 truncate max-w-[200px]">
                            {order.nama_perusahaan || order.nama_usaha || 'Unnamed Client'}
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-black/[0.02]">
                          <MessageCircle size={18} className="text-green-500" />
                          <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">WhatsApp</p>
                            <a href={`https://wa.me/${order.nomor_wa}`} target="_blank" className="text-sm font-bold text-gray-900 hover:text-apple-blue underline">
                              {order.nomor_wa}
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-black/[0.02]">
                          <Clock size={18} className="text-apple-blue" />
                          <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Terkirim Pada</p>
                            <p className="text-sm font-bold text-gray-900">{formatDate(order.created_at)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.status === 'pending' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                           Status: {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Brief & Requirements */}
                    <div className="flex-1 space-y-6 lg:border-l lg:border-black/[0.05] lg:pl-10">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Rincian Kebutuhan Website</p>
                        <div className="bg-[#F9F9FB] rounded-2xl p-6 border border-black/[0.02]">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-bold text-gray-900 bg-white px-3 py-1 rounded-lg border border-black/5">Industri: {order.industri || '-'}</span>
                            <span className="text-xs font-bold text-apple-blue bg-blue-50 px-3 py-1 rounded-lg border border-apple-blue/10">Template ID: {order.template_id || 'Manual'}</span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {order.referensi_manual || 'User memilih template dari katalog tanpa tambahan deskripsi manual.'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Fitur Tambahan (Add-ons)</p>
                        <div className="flex flex-wrap gap-2">
                          {order.selected_addons && order.selected_addons.length > 0 ? (
                            order.selected_addons.map((addonId: string) => (
                              <span key={addonId} className="px-3 py-1 bg-white border border-black/5 rounded-full text-[11px] font-bold text-gray-600 flex items-center gap-1.5">
                                <Zap size={10} className="text-apple-blue fill-apple-blue" /> {addonId.toUpperCase()}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 italic">Tidak ada add-on dipilih</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Financial Summary & Controls */}
                    <div className="lg:w-1/4 space-y-6 shrink-0">
                      <div className="bg-[#1D1D1F] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-apple-blue opacity-20 rounded-full blur-2xl" />
                        <div className="relative z-10">
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Estimasi Project</p>
                            <p className="text-3xl sf-display-heavy text-white mb-6 tabular-nums">{formatPrice(order.total_estimasi)}</p>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">Maintenance / Thn</p>
                            <p className="text-lg font-bold text-apple-blue tabular-nums">{formatPrice(order.total_maintenance)}</p>
                        </div>
                      </div>

                      {/* NEW: Admin Progress Control */}
                      <div className="px-1">
                        <OrderStatusControl
                            orderId={order.id}
                            currentStep={order.progress_step || 1}
                            currentStatus={order.status || 'pending'}
                            currentNote={order.progress_note ?? null}
                            currentDeliveredUrl={order.delivered_url ?? null}
                            currentDeliveredCredentials={order.delivered_credentials ?? null}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
