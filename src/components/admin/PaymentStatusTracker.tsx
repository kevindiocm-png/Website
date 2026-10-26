import React, { useState, useMemo } from 'react';
import {
  QrCode,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Phone,
  ExternalLink,
  MessageSquare,
  FileText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Info,
  DollarSign,
  Maximize2,
  Image,
} from 'lucide-react';
import { useSiteData } from '../../context/SiteContext';
import { OrderInvoice, QrisVerificationStatus, QrisValidationRecord } from '../../types';
import { formatRupiah } from '../../utils/format';

interface PaymentStatusTrackerProps {
  onSelectInvoice?: (invoice: OrderInvoice) => void;
}

export const PaymentStatusTracker: React.FC<PaymentStatusTrackerProps> = ({ onSelectInvoice }) => {
  const {
    orders,
    updateQrisValidation,
    openInvoiceModal,
    showToast,
  } = useSiteData();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProofPreview, setSelectedProofPreview] = useState<OrderInvoice | null>(null);
  const [rejectingOrder, setRejectingOrder] = useState<OrderInvoice | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Nominal di struk transfer tidak sesuai');
  const [customRejectionReason, setCustomRejectionReason] = useState('');
  const [approvingOrder, setApprovingOrder] = useState<OrderInvoice | null>(null);
  const [approvalNote, setApprovalNote] = useState('Mutasi QRIS telah masuk dan sesuai');

  // Filter only QRIS transactions or orders with QRIS proof
  const qrisOrders = useMemo(() => {
    return orders.filter(
      (ord) => ord.paymentMethod === 'qris' || Boolean(ord.qrisValidation)
    );
  }, [orders]);

  // Calculate KPI metrics
  const {
    totalQrisCount,
    totalQrisAmount,
    pendingCount,
    pendingAmount,
    verifiedCount,
    verifiedAmount,
    rejectedCount,
  } = useMemo(() => {
    let tCount = qrisOrders.length;
    let tAmount = 0;
    let pCount = 0;
    let pAmount = 0;
    let vCount = 0;
    let vAmount = 0;
    let rCount = 0;

    qrisOrders.forEach((ord) => {
      const amt = ord.total || 0;
      tAmount += amt;

      const vStatus = ord.qrisValidation?.verificationStatus;
      if (vStatus === 'verified_paid' || ord.paymentStatus === 'paid') {
        vCount += 1;
        vAmount += amt;
      } else if (vStatus === 'rejected') {
        rCount += 1;
      } else {
        // pending review
        pCount += 1;
        pAmount += amt;
      }
    });

    return {
      totalQrisCount: tCount,
      totalQrisAmount: tAmount,
      pendingCount: pCount,
      pendingAmount: pAmount,
      verifiedCount: vCount,
      verifiedAmount: vAmount,
      rejectedCount: rCount,
    };
  }, [qrisOrders]);

  // Filtered & searched orders
  const filteredOrders = useMemo(() => {
    return qrisOrders.filter((ord) => {
      const vStatus = ord.qrisValidation?.verificationStatus;
      const isPaid = ord.paymentStatus === 'paid';

      // Status Filter
      if (activeFilter === 'pending') {
        if (vStatus === 'verified_paid' || isPaid || vStatus === 'rejected') return false;
      } else if (activeFilter === 'verified') {
        if (vStatus !== 'verified_paid' && !isPaid) return false;
      } else if (activeFilter === 'rejected') {
        if (vStatus !== 'rejected') return false;
      }

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const invMatch = ord.invoiceNumber.toLowerCase().includes(q);
        const nameMatch = ord.customer?.name.toLowerCase().includes(q);
        const phoneMatch = (ord.customer?.phone || '').includes(q);
        const fileMatch = (ord.qrisValidation?.fileName || '').toLowerCase().includes(q);
        return invMatch || nameMatch || phoneMatch || fileMatch;
      }

      return true;
    });
  }, [qrisOrders, activeFilter, searchQuery]);

  // Handlers
  const handleConfirmApproval = (ord: OrderInvoice) => {
    const now = new Date().toISOString();
    updateQrisValidation(
      ord.invoiceNumber,
      {
        verificationStatus: 'verified_paid',
        verifiedAt: now,
        verifiedBy: 'Owner (Manual Verifikasi)',
        manualNotes: approvalNote || 'Mutasi QRIS valid dan telah masuk.',
      },
      true // Mark as paid
    );
    setApprovingOrder(null);
    setApprovalNote('Mutasi QRIS telah masuk dan sesuai');
  };

  const handleConfirmRejection = (ord: OrderInvoice) => {
    const finalReason = rejectionReason === 'Lainnya' ? customRejectionReason : rejectionReason;
    const now = new Date().toISOString();
    updateQrisValidation(
      ord.invoiceNumber,
      {
        verificationStatus: 'rejected',
        verifiedAt: now,
        verifiedBy: 'Owner (Ditolak)',
        rejectionReason: finalReason || 'Bukti transfer tidak dapat divalidasi.',
      },
      false // Keep as unpaid
    );
    setRejectingOrder(null);
    setRejectionReason('Nominal di struk transfer tidak sesuai');
    setCustomRejectionReason('');
  };

  const handleOpenWhatsApp = (ord: OrderInvoice, type: 'verified' | 'rejected' | 'inquiry') => {
    const phone = (ord.customer?.phone || '').replace(/[^0-9]/g, '');
    const cleanPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;

    let text = '';
    if (type === 'verified') {
      text = `Halo Kak ${ord.customer?.name || 'Pelanggan'}, terima kasih! Pembayaran QRIS Anda untuk Nota #${ord.invoiceNumber} sebesar ${formatRupiah(ord.total)} telah KAMI VERIFIKASI LUNAS. Pesanan sedang dipersiapkan oleh tim teknis Kevin 88 Computer.`;
    } else if (type === 'rejected') {
      const reason = ord.qrisValidation?.rejectionReason || 'Bukti transfer buram atau nominal tidak sesuai';
      text = `Halo Kak ${ord.customer?.name || 'Pelanggan'}, terkait bukti pembayaran QRIS untuk Nota #${ord.invoiceNumber} sebesar ${formatRupiah(ord.total)}, tim kami belum dapat memvalidasinya dikarenakan: ${reason}. Mohon bantuannya untuk mengirimkan ulang screenshot bukti mutasi yang jelas ya kak.`;
    } else {
      text = `Halo Kak ${ord.customer?.name || 'Pelanggan'}, kami dari Kevin 88 Computer ingin mengonfirmasi pembayaran QRIS untuk Nota #${ord.invoiceNumber} sebesar ${formatRupiah(ord.total)}. Apakah sudah berhasil transfer?`;
    }

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. KPI Metric Headline Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Total QRIS */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Transaksi QRIS</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-white font-mono">
            {totalQrisCount}{' '}
            <span className="text-xs font-normal text-slate-400">Order</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-0.5">
            Total {formatRupiah(totalQrisAmount)}
          </div>
        </div>

        {/* Menunggu Verifikasi Manual (Action Needed) */}
        <div
          onClick={() => setActiveFilter('pending')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            pendingCount > 0
              ? 'bg-amber-950/20 border-amber-500/50 shadow-md shadow-amber-500/10 hover:border-amber-400'
              : 'bg-slate-950 border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <span>Menunggu Verifikasi</span>
              {pendingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              )}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-amber-300 font-mono">
            {pendingCount}{' '}
            <span className="text-xs font-normal text-slate-400">Perlu Dicek</span>
          </div>
          <div className="text-[11px] font-mono text-amber-400/90 mt-0.5 font-semibold">
            {formatRupiah(pendingAmount)}
          </div>
        </div>

        {/* Terverifikasi Lunas */}
        <div
          onClick={() => setActiveFilter('verified')}
          className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400">Terverifikasi Lunas</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-emerald-400 font-mono">
            {verifiedCount}{' '}
            <span className="text-xs font-normal text-slate-400">Lunas</span>
          </div>
          <div className="text-[11px] font-mono text-emerald-400/80 mt-0.5">
            {formatRupiah(verifiedAmount)}
          </div>
        </div>

        {/* Bukti Ditolak */}
        <div
          onClick={() => setActiveFilter('rejected')}
          className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/40 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400">Bukti Ditolak</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-black text-rose-400 font-mono">
            {rejectedCount}{' '}
            <span className="text-xs font-normal text-slate-400">Ditolak</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Perlu upload ulang oleh customer
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Cari No. Nota, nama pemesan, nomor HP, atau nama file..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {[
            { id: 'all', label: `Semua (${totalQrisCount})` },
            { id: 'pending', label: `Perlu Verifikasi (${pendingCount})`, highlight: pendingCount > 0 },
            { id: 'verified', label: `Lunas (${verifiedCount})` },
            { id: 'rejected', label: `Ditolak (${rejectedCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : tab.highlight
                  ? 'bg-amber-400/10 text-amber-300 border border-amber-400/40 hover:bg-amber-400/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Orders QRIS List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 p-6 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 space-y-2">
            <QrCode className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">
              Tidak ada riwayat pembayaran QRIS pada filter ini.
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Saat customer checkout dengan QRIS atau mengunggah bukti pembayaran, data validasi otomatis tersinkronisasi di sini secara real-time.
            </p>
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const vRecord = ord.qrisValidation;
            const isPaid = ord.paymentStatus === 'paid' || vRecord?.verificationStatus === 'verified_paid';
            const isRejected = vRecord?.verificationStatus === 'rejected';
            const isPending = !isPaid && !isRejected;

            return (
              <div
                key={ord.invoiceNumber}
                className={`p-4 rounded-2xl border transition-all ${
                  isPending
                    ? 'bg-gradient-to-r from-amber-950/20 via-slate-950 to-slate-950 border-amber-500/50 shadow-md shadow-amber-500/5'
                    : isPaid
                    ? 'bg-slate-950 border-slate-800/90 hover:border-emerald-500/40'
                    : 'bg-slate-950 border-rose-900/50 hover:border-rose-500/40'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  {/* Left Column: Invoice, Customer, and Items summary */}
                  <div className="space-y-2 flex-1 min-w-[280px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openInvoiceModal(ord)}
                        className="text-amber-400 hover:text-amber-300 font-mono font-black text-sm flex items-center gap-1 cursor-pointer"
                        title="Buka Nota Resmi"
                      >
                        <span>#{ord.invoiceNumber}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                      {/* Status Badge */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black tracking-wide uppercase ${
                          isPending
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50 animate-pulse'
                            : isPaid
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {isPending
                          ? '⏳ MENUNGGU VERIFIKASI'
                          : isPaid
                          ? '✅ TERVERIFIKASI LUNAS'
                          : '❌ BUKTI DITOLAK'}
                      </span>

                      <span className="text-[11px] text-slate-500 font-mono">
                        {new Date(ord.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Customer & Location */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                      <span className="font-bold text-white">{ord.customer?.name}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-400 font-mono">{ord.customer?.phone}</span>
                      <span className="text-slate-500">·</span>
                      <span className="text-slate-400">
                        {ord.customer?.city || 'Semarang'} (
                        {ord.shippingMethod === 'pickup' ? 'Ambil di Toko' : 'Kirim Ekspedisi'})
                      </span>
                    </div>

                    {/* Items ordered preview */}
                    <div className="text-xs text-slate-400">
                      <span className="font-medium text-slate-300">
                        {(ord.items || []).map((it) => `${it.quantity}x ${it.product.name}`).join(', ')}
                      </span>
                    </div>

                    {/* QRIS Validation History & Proof Details */}
                    <div className="mt-2 pt-2 border-t border-slate-900 bg-slate-900/60 p-3 rounded-xl space-y-1.5 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <QrCode className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span className="font-semibold text-white">Validasi Bukti Unggahan:</span>
                          <span className="font-mono text-slate-400">
                            {vRecord?.fileName || 'bukti_transfer_qris.jpg'}
                          </span>
                        </div>

                        {vRecord?.matchScore && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                            Akurasi Scanner: {vRecord.matchScore}%
                          </span>
                        )}
                      </div>

                      {vRecord?.decodedPayload && (
                        <div className="p-1.5 rounded bg-slate-950 font-mono text-[10px] text-amber-300 break-all select-all border border-slate-800">
                          Payload QRIS: {vRecord.decodedPayload}
                        </div>
                      )}

                      {/* Audit Trail Note */}
                      <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2">
                        {vRecord?.verifiedBy && (
                          <span>
                            Diverifikasi oleh: <strong className="text-slate-300">{vRecord.verifiedBy}</strong>
                          </span>
                        )}
                        {vRecord?.verifiedAt && (
                          <span>
                            pada{' '}
                            {new Date(vRecord.verifiedAt).toLocaleTimeString('id-ID', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                        {vRecord?.manualNotes && (
                          <span className="text-emerald-400 font-medium">
                            — "{vRecord.manualNotes}"
                          </span>
                        )}
                        {vRecord?.rejectionReason && (
                          <span className="text-rose-400 font-medium">
                            — Alasan Tolak: "{vRecord.rejectionReason}"
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Amount & Action Buttons */}
                  <div className="flex flex-col items-end justify-between gap-3 shrink-0 self-stretch">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">
                        Nominal Transfer QRIS
                      </span>
                      <span className="text-lg font-black text-amber-400 font-mono tracking-tight">
                        {formatRupiah(ord.total)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-end gap-1.5 pt-2">
                      {/* WhatsApp Button */}
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenWhatsApp(ord, isPaid ? 'verified' : isRejected ? 'rejected' : 'inquiry')
                        }
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Chat WhatsApp dengan Pelanggan"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>

                      {/* Preview Proof Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedProofPreview(ord)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Buka Preview Gambar Bukti Transfer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span className="hidden sm:inline">Lihat Bukti</span>
                      </button>

                      {/* If Pending: Show Approve & Reject Buttons */}
                      {isPending && (
                        <>
                          <button
                            type="button"
                            onClick={() => setRejectingOrder(ord)}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            title="Tolak Bukti Pembayaran"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Tolak</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setApprovingOrder(ord)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
                            title="Konfirmasi Lunas & Mutasi Valid"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Verifikasi Lunas</span>
                          </button>
                        </>
                      )}

                      {/* If already verified or rejected, allow owner to toggle or re-verify */}
                      {isPaid && (
                        <button
                          type="button"
                          onClick={() => setRejectingOrder(ord)}
                          className="px-2 py-1 text-[11px] text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Ubah kembali jika mutasi bermasalah"
                        >
                          Ubah Status
                        </button>
                      )}

                      {isRejected && (
                        <button
                          type="button"
                          onClick={() => setApprovingOrder(ord)}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold cursor-pointer"
                          title="Verifikasi Lunas Ulang"
                        >
                          Verifikasi Lunas
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: PREVIEW BUKTI LENGKAP & DETAIL MUTASI */}
      {selectedProofPreview && (
        <div
          role="dialog"
          aria-labelledby="proof-preview-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn"
        >
          <div className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-4">
            <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
                  <Image className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="proof-preview-title" className="text-sm font-bold text-white">
                    Inspeksi Bukti QRIS #{selectedProofPreview.invoiceNumber}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Bandingkan nominal bukti transfer pelanggan dengan tagihan toko
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProofPreview(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Proof Visual Container */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-semibold text-slate-400">Visual Bukti / Struk Transfer</span>
                  
                  {selectedProofPreview.qrisValidation?.proofPreviewUrl ? (
                    <img
                      src={selectedProofPreview.qrisValidation.proofPreviewUrl}
                      alt="Bukti Transfer"
                      className="max-h-64 rounded-lg object-contain border border-slate-700 shadow-md"
                    />
                  ) : (
                    <div className="w-full h-48 rounded-lg bg-slate-900 border border-dashed border-slate-700 flex flex-col items-center justify-center gap-2 text-slate-400 p-4">
                      <QrCode className="w-12 h-12 text-rose-400" />
                      <div className="text-xs font-semibold text-white">
                        {selectedProofPreview.qrisValidation?.fileName || 'bukti_transfer_qris.jpg'}
                      </div>
                      <span className="text-[10px] text-slate-500">
                        File transfer divalidasi via QRIS Auto-Detector
                      </span>
                    </div>
                  )}

                  <div className="text-[11px] font-mono text-slate-400 pt-1">
                    Waktu Upload:{' '}
                    {new Date(
                      selectedProofPreview.qrisValidation?.uploadedAt || selectedProofPreview.createdAt
                    ).toLocaleString('id-ID')}
                  </div>
                </div>

                {/* Match Details */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Detail Tagihan Toko
                    </span>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Nomor Nota:</span>
                      <span className="font-mono font-bold text-amber-400">
                        #{selectedProofPreview.invoiceNumber}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Nama Pelanggan:</span>
                      <span className="font-bold text-white">
                        {selectedProofPreview.customer?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Total Tagihan:</span>
                      <span className="font-mono font-black text-white text-base">
                        {formatRupiah(selectedProofPreview.total)}
                      </span>
                    </div>
                  </div>

                  {/* Verification Status Card */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Status Saat Ini
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                          selectedProofPreview.paymentStatus === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {selectedProofPreview.paymentStatus === 'paid'
                          ? '✅ LUNAS / TERVERIFIKASI'
                          : '⏳ MENUNGGU VERIFIKASI OWNER'}
                      </span>
                    </div>
                    {selectedProofPreview.qrisValidation?.manualNotes && (
                      <p className="text-slate-300 text-[11px] pt-1">
                        Catatan: {selectedProofPreview.qrisValidation.manualNotes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedProofPreview(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const ord = selectedProofPreview;
                    setSelectedProofPreview(null);
                    setRejectingOrder(ord);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-bold cursor-pointer"
                >
                  Tolak Bukti
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const ord = selectedProofPreview;
                    setSelectedProofPreview(null);
                    setApprovingOrder(ord);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  Verifikasi Lunas Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: KONFIRMASI APPROVAL DENGAN CATATAN OWNER */}
      {approvingOrder && (
        <div
          role="dialog"
          aria-labelledby="approve-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn"
        >
          <div className="relative w-full max-w-md bg-slate-900 border border-emerald-500/50 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span id="approve-modal-title">Verifikasi Pembayaran QRIS Lunas</span>
              </div>
              <button
                type="button"
                onClick={() => setApprovingOrder(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Anda akan memverifikasi bahwa pembayaran transfer QRIS untuk nota{' '}
              <strong className="text-amber-400">#{approvingOrder.invoiceNumber}</strong> sebesar{' '}
              <strong className="text-emerald-400 font-mono">{formatRupiah(approvingOrder.total)}</strong> a/n{' '}
              <strong className="text-white">{approvingOrder.customer?.name}</strong> telah masuk ke mutasi rekening toko.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Catatan Verifikasi (Opsional):
              </label>
              <input
                type="text"
                value={approvalNote}
                onChange={(e) => setApprovalNote(e.target.value)}
                placeholder="Contoh: Mutasi BCA QRIS masuk Rp 585.000 jam 14:15"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setApprovingOrder(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleConfirmApproval(approvingOrder)}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                Konfirmasi Lunas & Kirim Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: PENOLAKAN BUKTI TRANSFER & ALASAN */}
      {rejectingOrder && (
        <div
          role="dialog"
          aria-labelledby="reject-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn"
        >
          <div className="relative w-full max-w-md bg-slate-900 border border-rose-500/50 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertCircle className="w-5 h-5" />
                <span id="reject-modal-title">Tolak Bukti Transfer QRIS</span>
              </div>
              <button
                type="button"
                onClick={() => setRejectingOrder(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Nota <strong className="text-amber-400">#{rejectingOrder.invoiceNumber}</strong> akan ditandai belum lunas dan customer diminta mengunggah ulang bukti pembayaran yang valid.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Pilih Alasan Penolakan:</label>
              {[
                'Nominal di struk transfer tidak sesuai',
                'Gambar buram / bukti transfer terpotong',
                'Bukan bukti transfer resmi Bank / QRIS',
                'Nama rekening tujuan tidak sesuai dengan toko',
                'Lainnya',
              ].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2 text-xs text-slate-300 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700"
                >
                  <input
                    type="radio"
                    name="rejectionReason"
                    checked={rejectionReason === reason}
                    onChange={() => setRejectionReason(reason)}
                    className="text-rose-500 focus:ring-rose-400"
                  />
                  <span>{reason}</span>
                </label>
              ))}

              {rejectionReason === 'Lainnya' && (
                <textarea
                  rows={2}
                  value={customRejectionReason}
                  onChange={(e) => setCustomRejectionReason(e.target.value)}
                  placeholder="Ketikkan alasan spesifik untuk customer..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-rose-400"
                />
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setRejectingOrder(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleConfirmRejection(rejectingOrder)}
                className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold cursor-pointer shadow-md shadow-rose-500/20"
              >
                Tolak & Minta Upload Ulang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
