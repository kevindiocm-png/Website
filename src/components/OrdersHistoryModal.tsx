import React, { useState } from 'react';
import { useSiteData } from '../context/SiteContext';
import { OrderInvoice, OrderTrackingStatus, TrackingLogItem } from '../types';
import { formatRupiah } from '../utils/format';
import {
  FileText,
  X,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  MessageCircle,
  Truck,
  ExternalLink,
  ShoppingBag,
  CreditCard,
  QrCode,
  Building2,
  Banknote,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Wrench,
  Package,
  MapPin,
  User,
  Copy,
  Check,
  Plus,
  Send,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

const TRACKING_STEPS: {
  status: OrderTrackingStatus;
  label: string;
  shortLabel: string;
  icon: any;
  color: string;
}[] = [
  {
    status: 'pending',
    label: 'Pesanan Diterima',
    shortLabel: 'Diterima',
    icon: FileText,
    color: 'text-amber-400 border-amber-400 bg-amber-400/10',
  },
  {
    status: 'confirmed',
    label: 'Pembayaran Dikonfirmasi',
    shortLabel: 'Lunas',
    icon: CheckCircle2,
    color: 'text-blue-400 border-blue-400 bg-blue-400/10',
  },
  {
    status: 'qc_testing',
    label: 'QC & Uji Hardware Lab',
    shortLabel: 'QC Lab',
    icon: Wrench,
    color: 'text-cyan-400 border-cyan-400 bg-cyan-400/10',
  },
  {
    status: 'packed',
    label: 'Pengemasan & Segel Hologram',
    shortLabel: 'Dikemas',
    icon: Package,
    color: 'text-indigo-400 border-indigo-400 bg-indigo-400/10',
  },
  {
    status: 'shipping',
    label: 'Dalam Pengiriman Kurir',
    shortLabel: 'Dikirim',
    icon: Truck,
    color: 'text-amber-400 border-amber-400 bg-amber-400/10',
  },
  {
    status: 'ready_pickup',
    label: 'Siap Diambil di Cabang',
    shortLabel: 'Siap Ambil',
    icon: MapPin,
    color: 'text-emerald-400 border-emerald-400 bg-emerald-400/10',
  },
  {
    status: 'completed',
    label: 'Pesanan Selesai / Diterima',
    shortLabel: 'Selesai',
    icon: ShieldCheck,
    color: 'text-emerald-400 border-emerald-400 bg-emerald-400/10',
  },
];

export const OrdersHistoryModal: React.FC = () => {
  const {
    isOrdersModalOpen,
    closeOrdersModal,
    orders,
    openInvoiceModal,
    openQrisPaymentModal,
    updateInvoicePaymentStatus,
    updateOrderTracking,
    isAdminMode,
    settings,
    showToast,
  } = useSiteData();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPayment, setFilterPayment] = useState<'all' | 'unpaid' | 'paid'>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderInvoice | null>(null);
  const [copiedResi, setCopiedResi] = useState(false);

  // Admin Quick Edit Tracking States
  const [adminStatus, setAdminStatus] = useState<OrderTrackingStatus>('pending');
  const [adminResi, setAdminResi] = useState('');
  const [adminCourier, setAdminCourier] = useState('');
  const [adminTech, setAdminTech] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [newLogTitle, setNewLogTitle] = useState('');
  const [newLogDesc, setNewLogDesc] = useState('');
  const [newLogLocation, setNewLogLocation] = useState('');

  if (!isOrdersModalOpen) return null;

  // Sync selected order state if orders array updates
  const activeOrder = selectedOrder
    ? orders.find((o) => o.invoiceNumber === selectedOrder.invoiceNumber) || selectedOrder
    : null;

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      order.invoiceNumber.toLowerCase().includes(q) ||
      order.customer.name.toLowerCase().includes(q) ||
      order.customer.phone.includes(searchQuery) ||
      (order.customer.city && order.customer.city.toLowerCase().includes(q)) ||
      (order.trackingNumber && order.trackingNumber.toLowerCase().includes(q)) ||
      order.items.some((i) => i.product.name.toLowerCase().includes(q));

    const matchPayment =
      filterPayment === 'all' || order.paymentStatus === filterPayment;

    return matchQuery && matchPayment;
  });

  const getPaymentBadge = (method: string) => {
    switch (method) {
      case 'qris':
        return { label: 'QRIS', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'bca':
        return { label: 'Bank BCA', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'mandiri':
        return { label: 'Bank Mandiri', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'bri':
        return { label: 'Bank BRI', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' };
      case 'bni':
        return { label: 'Bank BNI', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' };
      case 'cod':
        return { label: 'COD / Ambil Toko', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      default:
        return { label: method.toUpperCase(), color: 'bg-slate-700 text-slate-300 border-slate-600' };
    }
  };

  const getTrackingBadgeInfo = (status?: OrderTrackingStatus, shippingMethod?: string) => {
    const isPickup = shippingMethod === 'pickup';
    switch (status) {
      case 'pending':
        return {
          label: 'Menunggu Verifikasi',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          stepIndex: 0,
        };
      case 'confirmed':
        return {
          label: 'Pembayaran Lunas',
          color: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          stepIndex: 1,
        };
      case 'qc_testing':
        return {
          label: 'QC & Uji Hardware Lab',
          color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
          stepIndex: 2,
        };
      case 'packed':
        return {
          label: 'Dikemas & Segel Hologram',
          color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
          stepIndex: 3,
        };
      case 'shipping':
        return {
          label: 'Dalam Pengiriman Kurir',
          color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          stepIndex: 4,
        };
      case 'ready_pickup':
        return {
          label: 'Siap Diambil di Cabang',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          stepIndex: 4,
        };
      case 'completed':
        return {
          label: 'Selesai / Diterima',
          color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          stepIndex: 5,
        };
      default:
        return {
          label: isPickup ? 'Siap di Cabang' : 'Diproses',
          color: 'bg-slate-800 text-slate-300 border-slate-700',
          stepIndex: 1,
        };
    }
  };

  const handleOpenTrackingDetails = (order: OrderInvoice) => {
    setSelectedOrder(order);
    setAdminStatus(order.trackingStatus || 'pending');
    setAdminResi(order.trackingNumber || '');
    setAdminCourier(order.courierName || '');
    setAdminTech(order.technicianName || '');
    setAdminNotes(order.repairOrNotes || '');
    setNewLogTitle('');
    setNewLogDesc('');
    setNewLogLocation('');
  };

  const handleCopyResi = (resi: string) => {
    navigator.clipboard.writeText(resi);
    setCopiedResi(true);
    showToast('Nomor resi pengiriman berhasil disalin!', 'success');
    setTimeout(() => setCopiedResi(false), 2000);
  };

  const handleSaveTrackingUpdates = () => {
    if (!activeOrder) return;

    updateOrderTracking(activeOrder.invoiceNumber, {
      trackingStatus: adminStatus,
      trackingNumber: adminResi,
      courierName: adminCourier,
      technicianName: adminTech,
      repairOrNotes: adminNotes,
      newLog: newLogTitle.trim()
        ? {
            status: adminStatus,
            title: newLogTitle.trim(),
            description: newLogDesc.trim() || 'Pembaruan status operasional suku cadang.',
            location: newLogLocation.trim() || 'Lab Servis Kevin 88',
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            completed: true,
          }
        : undefined,
    });

    setNewLogTitle('');
    setNewLogDesc('');
    setNewLogLocation('');
  };

  const handleOpenWhatsAppTracking = (order: OrderInvoice) => {
    const waNum = settings.contacts?.whatsappNumber || '6281288880014';
    const text = encodeURIComponent(
      `Halo Admin & Teknisi Kevin 88 Computer!\n\nSaya ingin menanyakan update pesanan/servis:\n- No. Nota: ${order.invoiceNumber}\n- Pemesan: ${order.customer.name}\n- Laptop: ${order.customer.laptopModel || 'Standar'}\n- Status Terkini: ${order.trackingStatus || 'Pending'}\n- Resi/Pickup: ${order.trackingNumber || '-'}\n\nMohon info estimasi selesainya ya mas. Terima kasih!`
    );
    window.open(`https://wa.me/${waNum.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {activeOrder ? (
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 flex items-center justify-center transition-colors cursor-pointer"
                title="Kembali ke Daftar Nota"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
                <FileText className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {activeOrder ? `Pelacakan Pesanan & Status Servis` : 'Riwayat Nota & Lacak Pesanan'}
                </h3>
                {activeOrder ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {activeOrder.invoiceNumber}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {orders.length} NOTA TERCATAT
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">
                {activeOrder
                  ? `Pantau pengujian hardware, nomor resi kurir, dan catatan teknisi secara real-time.`
                  : 'Lacak status kirim, hasil uji QC teknisi, cetak ulang nota, atau verifikasi invoice.'}
              </p>
            </div>
          </div>

          <button
            onClick={closeOrdersModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* VIEW 1: Interactive Live Tracking Timeline of Selected Order */}
        {activeOrder ? (
          <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-5 animate-in fade-in">
            {/* Top Status Hero Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="text-[11px] font-mono text-slate-400">STATUS PENGIRIMAN & SERVIS</div>
                  <div className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                    <span>{getTrackingBadgeInfo(activeOrder.trackingStatus, activeOrder.shippingMethod).label}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        getTrackingBadgeInfo(activeOrder.trackingStatus, activeOrder.shippingMethod).color
                      }`}
                    >
                      {activeOrder.trackingStatus ? activeOrder.trackingStatus.toUpperCase() : 'PENDING'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Copy Resi / Pickup Code Button */}
                  {activeOrder.trackingNumber && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-amber-300">
                      <span>Resi: <strong>{activeOrder.trackingNumber}</strong></span>
                      <button
                        type="button"
                        onClick={() => handleCopyResi(activeOrder.trackingNumber || '')}
                        className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Salin Nomor Resi"
                      >
                        {copiedResi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  )}

                  {/* QRIS Instant Payment button if unpaid */}
                  {activeOrder.paymentStatus !== 'paid' && activeOrder.paymentMethod === 'qris' && (
                    <button
                      type="button"
                      onClick={() => {
                        closeOrdersModal();
                        openQrisPaymentModal(activeOrder);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-rose-600/25 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>⚡ Bayar QRIS Sekarang</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      closeOrdersModal();
                      openInvoiceModal(activeOrder);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Lihat Nota</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenWhatsAppTracking(activeOrder)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Chat Teknisi</span>
                  </button>
                </div>
              </div>

              {/* Visual Multi-step Progress Bar */}
              <div className="pt-2">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                  {TRACKING_STEPS.slice(0, activeOrder.shippingMethod === 'pickup' ? 5 : 6).map((step, idx) => {
                    const stepIdx = getTrackingBadgeInfo(activeOrder.trackingStatus, activeOrder.shippingMethod).stepIndex;
                    const isPassed = idx <= stepIdx;
                    const isCurrent = idx === stepIdx;
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.status}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isCurrent
                            ? 'bg-amber-400/10 border-amber-400/80 ring-1 ring-amber-400/30'
                            : isPassed
                            ? 'bg-slate-900 border-emerald-500/40 text-slate-300'
                            : 'bg-slate-900/40 border-slate-800 text-slate-500'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg mx-auto mb-1.5 flex items-center justify-center ${
                            isCurrent
                              ? 'bg-amber-400 text-slate-950 font-bold'
                              : isPassed
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-[11px] font-bold text-white truncate">
                          {activeOrder.shippingMethod === 'pickup' && step.status === 'shipping'
                            ? 'Siap di Cabang'
                            : step.shortLabel}
                        </div>
                        <div className="text-[9px] text-slate-400 mt-0.5 font-mono">
                          {isCurrent ? '● Sedang Berjalan' : isPassed ? '✓ Selesai' : 'Antrian'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Hardware QC & Technician Report Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Logistics & Delivery Details */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                <div className="font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>Informasi Logistik & Pengambilan</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Ekspedisi / Metode:</span>
                  <div className="font-semibold text-white mt-0.5">
                    {activeOrder.courierName || 'JNE / J&T Express'}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Estimasi Sampai:</span>
                  <div className="font-semibold text-amber-300 mt-0.5">
                    {activeOrder.estimatedDelivery || '1-2 Hari Kerja'}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Alamat Tujuan:</span>
                  <div className="text-slate-300 leading-relaxed mt-0.5">
                    {activeOrder.customer.address}, {activeOrder.customer.city}
                  </div>
                </div>
                {activeOrder.customer.notes && (
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 italic">
                    Catatan Pembeli: "{activeOrder.customer.notes}"
                  </div>
                )}
              </div>

              {/* Card 2: Hardware QC Lab Report */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                <div className="font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
                  <Wrench className="w-4 h-4 text-cyan-400" />
                  <span>Laporan QC & Meja Teknisi</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Teknisi Penanggung Jawab:</span>
                  <div className="font-semibold text-white mt-0.5">
                    {activeOrder.technicianName || 'Tim QC Hardware Lab Kevin 88'}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Tipe Laptop Pengguna:</span>
                  <div className="font-semibold text-amber-300 font-mono mt-0.5">
                    {activeOrder.customer.laptopModel || 'Tipe Standar Universal'}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Catatan Uji Hardware & Segel:</span>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-[11px] leading-relaxed mt-1">
                    {activeOrder.repairOrNotes ||
                      'Unit sparepart telah diinspeksi voltase & kompatibilitas hardware, segel hologram garansi resmi tertempel utuh.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Chronological Tracking Event History */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Riwayat Perjalanan & Riwayat Log Servis</span>
              </h4>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {(activeOrder.trackingHistory && activeOrder.trackingHistory.length > 0
                  ? activeOrder.trackingHistory
                  : [
                      {
                        id: 'init-1',
                        status: 'pending' as OrderTrackingStatus,
                        title: 'Pesanan Diterima di Sistem',
                        description: 'Invoice pesanan telah masuk dan tercatat di server Kevin 88 Computer.',
                        timestamp: new Date(activeOrder.createdAt).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        }),
                        location: 'Sistem Toko Pusat',
                        completed: true,
                      },
                    ]
                ).map((log, idx) => (
                  <div key={log.id || idx} className="relative group">
                    <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-amber-400 ring-4 ring-slate-950 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-950"></span>
                    </span>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 group-hover:border-slate-700 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                        <div className="font-bold text-white">{log.title}</div>
                        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                          {log.location && <span className="text-amber-400/90">{log.location}</span>}
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                        {log.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* OWNER EXCLUSIVE CONTROL PANEL: Live Tracking Manager */}
            {isAdminMode && (
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/40 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs">
                      👑
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Panel Owner: Update Status Pelacakan Real-time
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Ubah status paket/servis ini agar pelanggan dapat memantau perjalanannya langsung dari web.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                    Live Sync
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Status Tahapan Pengiriman / Servis:
                    </label>
                    <select
                      value={adminStatus}
                      onChange={(e) => setAdminStatus(e.target.value as OrderTrackingStatus)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                    >
                      <option value="pending">1. Pending / Menunggu Verifikasi</option>
                      <option value="confirmed">2. Pembayaran Lunas (Confirmed)</option>
                      <option value="qc_testing">3. QC & Uji Hardware Lab</option>
                      <option value="packed">4. Dikemas & Segel Hologram (Packed)</option>
                      <option value="shipping">5. Sedang Dikirim Kurir (Shipping)</option>
                      <option value="ready_pickup">5. Siap Diambil di Cabang Toko</option>
                      <option value="completed">6. Selesai / Diterima Pembeli</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Nomor Resi / Kode Pickup:
                    </label>
                    <input
                      type="text"
                      value={adminResi}
                      onChange={(e) => setAdminResi(e.target.value)}
                      placeholder="JNE-882910398 atau PICKUP-8801"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Nama Kurir / Cabang:
                    </label>
                    <input
                      type="text"
                      value={adminCourier}
                      onChange={(e) => setAdminCourier(e.target.value)}
                      placeholder="JNE YES / Plasa Simpang Lima"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Nama Teknisi QC:
                    </label>
                    <input
                      type="text"
                      value={adminTech}
                      onChange={(e) => setAdminTech(e.target.value)}
                      placeholder="Budi Santoso (QC Lab Hardware)"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Catatan Hardware & QC:
                    </label>
                    <input
                      type="text"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Voltase normal, zero dead pixel, segel utuh..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Optional add new step log */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-amber-300 block">
                    + Tambahkan Update Peristiwa / Milestone Baru (Opsional):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={newLogTitle}
                      onChange={(e) => setNewLogTitle(e.target.value)}
                      placeholder="Judul (misal: Melewati Gateway Solo)"
                      className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                    />
                    <input
                      type="text"
                      value={newLogDesc}
                      onChange={(e) => setNewLogDesc(e.target.value)}
                      placeholder="Rincian status..."
                      className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                    />
                    <input
                      type="text"
                      value={newLogLocation}
                      onChange={(e) => setNewLogLocation(e.target.value)}
                      placeholder="Lokasi (misal: Hub Semarang)"
                      className="px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleSaveTrackingUpdates}
                    className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Simpan Perubahan Status</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* VIEW 2: Order Invoices List & Quick Filters */
          <>
            {/* Filter & Search Bar */}
            <div className="p-4 sm:px-6 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari no. nota, resi, nama, WA, atau sparepart..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                {(
                  [
                    { id: 'all', label: 'Semua Nota' },
                    { id: 'unpaid', label: 'Menunggu Pembayaran' },
                    { id: 'paid', label: 'Sudah Lunas' },
                  ] as const
                ).map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setFilterPayment(st.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      filterPayment === st.id
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const isPaid = order.paymentStatus === 'paid';
                  const pBadge = getPaymentBadge(order.paymentMethod);
                  const trackBadge = getTrackingBadgeInfo(order.trackingStatus, order.shippingMethod);

                  return (
                    <div
                      key={order.invoiceNumber}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-amber-400 text-sm">
                            {order.invoiceNumber}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${pBadge.color}`}>
                            {pBadge.label}
                          </span>
                          {isPaid ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>LUNAS</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>MENUNGGU PEMBAYARAN</span>
                            </span>
                          )}

                          {/* Tracking status chip */}
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${trackBadge.color}`}
                          >
                            <Truck className="w-3 h-3" />
                            <span>{trackBadge.label}</span>
                          </span>

                          <span className="text-[11px] text-slate-500 font-mono">
                            {new Date(order.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <div className="text-xs text-slate-300 space-y-0.5">
                          <div className="font-semibold text-white">
                            Pemesan: {order.customer.name} (WA: {order.customer.phone})
                          </div>
                          <div className="text-slate-400">
                            Alamat: {order.customer.address}, {order.customer.city} · Laptop:{' '}
                            <strong className="text-slate-200">{order.customer.laptopModel || 'Standar'}</strong>
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            Rincian: {order.items.map((it) => `${it.product.name} (x${it.quantity})`).join(', ')}
                          </div>
                          {order.trackingNumber && (
                            <div className="text-[11px] text-amber-400 font-mono font-semibold pt-0.5">
                              Resi: {order.trackingNumber} ({order.courierName || 'Ekspedisi'})
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-800 gap-2 shrink-0">
                        <div className="text-right">
                          <div className="text-[10px] uppercase font-mono text-slate-500">Total Tagihan</div>
                          <div className="text-base font-extrabold text-amber-400 font-mono">
                            {formatRupiah(order.total)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          {/* Live Tracking Modal Trigger */}
                          <button
                            type="button"
                            onClick={() => handleOpenTrackingDetails(order)}
                            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                            title="Lacak proses pengujian hardware dan resi kirim"
                          >
                            <Truck className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Lacak Status</span>
                          </button>

                          <button
                            onClick={() => {
                              closeOrdersModal();
                              openInvoiceModal(order);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Buka Nota</span>
                          </button>

                          {isAdminMode && (
                            <button
                              onClick={() =>
                                updateInvoicePaymentStatus(
                                  order.invoiceNumber,
                                  isPaid ? 'unpaid' : 'paid'
                                )
                              }
                              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold border border-slate-700 transition-colors cursor-pointer"
                              title="Owner: Ubah status bayar lunas/belum"
                            >
                              {isPaid ? 'Set Belum Bayar' : 'Set Lunas'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16 px-4">
                  <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-white mb-1">Belum Ada Nota Pesanan</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    Ketika customer melakukan pemesanan dan checkout dari website, nota otomatis bergaransi
                    resmi Kevin 88 beserta instruksi pembayaran dan pelacakan akan otomatis tercatat di sini.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
