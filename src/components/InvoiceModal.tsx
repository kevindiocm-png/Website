import React, { useState, useRef } from 'react';
import { useSiteData } from '../context/SiteContext';
import { formatRupiah, createWhatsAppInvoiceUrl } from '../utils/format';
import {
  Printer,
  X,
  Check,
  Copy,
  MessageCircle,
  QrCode,
  Building2,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  Share2,
  Sparkles,
  Laptop,
  Truck,
  MapPin,
  HelpCircle,
  ExternalLink,
  Edit2,
} from 'lucide-react';

import { DynamicQrisCard } from './common/DynamicQrisCard';

export const InvoiceModal: React.FC = () => {
  const {
    isInvoiceModalOpen,
    closeInvoiceModal,
    currentInvoice,
    settings,
    showToast,
    openWarrantyModal,
    openPaymentModal,
    openQrisPaymentModal,
    openOrdersModal,
    updateInvoicePaymentStatus,
    isAdminMode,
  } = useSiteData();
  const [copiedBank, setCopiedBank] = useState(false);
  const [copiedInvoice, setCopiedInvoice] = useState(false);
  const [isSimulatedPaid, setIsSimulatedPaid] = useState(false);

  const invoicePrintRef = useRef<HTMLDivElement>(null);

  if (!isInvoiceModalOpen || !currentInvoice) return null;

  const invoice = currentInvoice;
  const isPaid = isSimulatedPaid || invoice.paymentStatus === 'paid';

  // Resolve configured payment methods from settings
  const configuredMethods = settings.paymentSettings?.methods || [];
  const selectedConfig = configuredMethods.find((m) => m.id === invoice.paymentMethod);
  const qrisNmid = settings.paymentSettings?.qrisNmid || selectedConfig?.qrisNmid || 'ID1020038814-KV88';
  const qrisImageUrl = settings.paymentSettings?.qrisImageUrl || selectedConfig?.qrisImageUrl || '';

  const bankDetails: Record<string, { bank: string; account: string; holder: string; color: string }> = {
    bca: {
      bank: 'BCA (Bank Central Asia)',
      account: '0123 456 789',
      holder: 'KEVIN 88 COMPUTER',
      color: 'bg-blue-600',
    },
    mandiri: {
      bank: 'Bank Mandiri',
      account: '136 00 1234567 8',
      holder: 'KEVIN 88 COMPUTER',
      color: 'bg-amber-600',
    },
    bri: {
      bank: 'BRI (Bank Rakyat Indonesia)',
      account: '0083 01 002345 50 1',
      holder: 'KEVIN 88 COMPUTER',
      color: 'bg-blue-700',
    },
    bni: {
      bank: 'BNI (Bank Negara Indonesia)',
      account: '0812 3456 7890',
      holder: 'KEVIN 88 COMPUTER',
      color: 'bg-emerald-600',
    },
  };

  const activeBank = {
    bank: selectedConfig?.bankName || selectedConfig?.name || bankDetails[invoice.paymentMethod]?.bank || 'Transfer Bank Resmi',
    account: selectedConfig?.accountNumber || bankDetails[invoice.paymentMethod]?.account || '0123 456 789',
    holder: selectedConfig?.accountHolder || bankDetails[invoice.paymentMethod]?.holder || 'KEVIN 88 COMPUTER',
  };

  const handleCopyText = (text: string, type: 'bank' | 'invoice') => {
    navigator.clipboard.writeText(text);
    if (type === 'bank') {
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
      showToast('Nomor rekening berhasil disalin!', 'success');
    } else {
      setCopiedInvoice(true);
      setTimeout(() => setCopiedInvoice(false), 2000);
      showToast('Teks nota pesanan berhasil disalin!', 'success');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    const originalTitle = document.title;
    // Set official filename so browser defaults to clean PDF name when saving
    const cleanFileName = `Nota-Kevin88-${invoice.invoiceNumber}`;
    document.title = cleanFileName;

    showToast(
      "Menyiapkan dokumen PDF... Pilih tujuan 'Save as PDF' / 'Simpan sebagai PDF' pada dialog.",
      'info'
    );

    setTimeout(() => {
      window.print();
      // Restore page title after printing
      setTimeout(() => {
        document.title = originalTitle;
      }, 1200);
    }, 200);
  };

  const handleSendWhatsApp = () => {
    const url = createWhatsAppInvoiceUrl(invoice);
    window.open(url, '_blank');
  };

  return (
    <div
      id="invoice-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static"
    >
      <div
        id="invoice-printable-card"
        className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-fadeIn my-6 print:border-none print:shadow-none print:max-h-none print:m-0 print:bg-white print:text-black"
      >
        {/* Top Floating Action Bar (Hidden during Print) */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-white tracking-wide">
              Nota Otomatis & Bukti Garansi Resmi
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
              #{invoice.invoiceNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Download as PDF Button */}
            <button
              onClick={handleDownloadPdf}
              type="button"
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/20 active:scale-95"
              title="Download Nota Resmi dalam format PDF untuk arsip pelanggan"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Download as PDF</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              type="button"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              title="Cetak Nota langsung ke printer fisik"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Cetak</span>
            </button>

            {/* WhatsApp Send */}
            <button
              onClick={handleSendWhatsApp}
              type="button"
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
              title="Kirim Nota ke WhatsApp Admin Kevin 88"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Kirim ke WA Toko</span>
            </button>

            <button
              onClick={closeInvoiceModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer ml-1"
              title="Tutup Nota"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div
          ref={invoicePrintRef}
          id="invoice-print-sheet"
          className="overflow-y-auto flex-1 p-5 sm:p-8 space-y-6 bg-slate-900 text-slate-200 font-sans print:bg-white print:text-black print:p-6 print:overflow-visible"
        >
          {/* 1. Official Receipt Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-5 print:border-black">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {settings.branding?.logoImageUrl && (
                  <img
                    src={settings.branding.logoImageUrl}
                    alt="Logo Kevin 88"
                    className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 border border-amber-500/30 print:border-black shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
                <span className="text-xl font-black text-white tracking-tight print:text-black">
                  KEVIN 88 COMPUTER
                </span>
              </div>
              <p className="text-xs font-semibold text-amber-400 print:text-black">
                Pusat Spesialis Sparepart & Servis Komponen Laptop
              </p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-sm leading-relaxed print:text-gray-700">
                Semarang · Solo · Madiun · Yogyakarta · Siap Kirim Seluruh Indonesia
                <br />
                WhatsApp CS: +{settings.contacts?.whatsappNumber || '6281288880014'} · Telp: 024-8458-888
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="text-xs uppercase font-mono font-bold text-slate-400 tracking-wider print:text-gray-800">
                FAKTUR / NOTA PEMBELIAN
              </div>
              <div className="text-sm font-mono font-extrabold text-amber-400 print:text-black">
                {invoice.invoiceNumber}
              </div>
              <div className="text-[11px] text-slate-400 font-mono print:text-gray-700">
                Tgl: {new Date(invoice.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>

              {/* Status Badge */}
              <div className="pt-1 flex items-center sm:justify-end gap-1.5">
                {isPaid ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 print:border print:border-black print:text-black">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>LUNAS / SIAP KIRIM</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1 print:border print:border-black print:text-black">
                    <Clock className="w-3.5 h-3.5 animate-pulse print:hidden" />
                    <span>MENUNGGU PEMBAYARAN</span>
                  </span>
                )}

                {/* Owner simulate toggle for demo */}
                <button
                  type="button"
                  onClick={() => setIsSimulatedPaid(!isSimulatedPaid)}
                  className="text-[10px] text-slate-500 hover:text-slate-300 underline cursor-pointer print:hidden ml-1"
                  title="Simulasikan status lunas untuk demonstrasi transaksi"
                >
                  [{isPaid ? 'Set Belum Bayar' : 'Simulasi Lunas'}]
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Order & Repair Tracking Banner */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-950 to-cyan-950/30 border border-cyan-500/30 print:border-black flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-mono text-cyan-400 font-bold">
                  Status Pelacakan Paket & Servis:
                </div>
                <div className="text-xs font-bold text-white flex items-center gap-2 mt-0.5 print:text-black">
                  <span>
                    {invoice.trackingStatus === 'qc_testing'
                      ? '🔬 QC & Uji Hardware Lab'
                      : invoice.trackingStatus === 'packed'
                      ? '📦 Dikemas & Segel Hologram'
                      : invoice.trackingStatus === 'shipping'
                      ? `🚚 Sedang Dikirim (${invoice.courierName || 'Kurir'})`
                      : invoice.trackingStatus === 'ready_pickup'
                      ? '🏪 Siap Diambil di Cabang Toko'
                      : invoice.trackingStatus === 'completed'
                      ? '✓ Pesanan Selesai / Diterima'
                      : 'Menunggu Verifikasi & Alokasi Barang'}
                  </span>
                  {invoice.trackingNumber && (
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-amber-300 print:text-black">
                      Resi: {invoice.trackingNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                closeInvoiceModal();
                openOrdersModal();
              }}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer print:hidden shrink-0"
              title="Lihat riwayat tahapan pelacakan lengkap"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lacak Status & Servis Lengkap</span>
            </button>
          </div>

          {/* 2. Customer & Shipping Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 print:border print:border-black print:bg-white text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block print:text-gray-800">
                Ditujukan Kepada:
              </span>
              <div className="font-bold text-white text-sm print:text-black">{invoice.customer.name}</div>
              <div className="text-slate-300 font-mono print:text-gray-800">
                WhatsApp: {invoice.customer.phone}
              </div>
              <div className="text-slate-400 print:text-gray-700 leading-relaxed">
                Alamat: {invoice.customer.address}, {invoice.customer.city}
              </div>
            </div>

            <div className="space-y-1 sm:border-l sm:border-slate-800 sm:pl-4 print:border-black">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block print:text-gray-800">
                Informasi Pengiriman & Hardware:
              </span>
              <div className="flex items-center gap-1.5 text-white font-medium print:text-black">
                <Laptop className="w-3.5 h-3.5 text-amber-400 print:hidden shrink-0" />
                <span>Laptop: <strong>{invoice.customer.laptopModel || 'Tipe Standar Universal'}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300 print:text-gray-800">
                <Truck className="w-3.5 h-3.5 text-amber-400 print:hidden shrink-0" />
                <span>
                  Pengiriman: <strong>{invoice.shippingMethod.toUpperCase()}</strong> ({formatRupiah(invoice.shippingFee)})
                </span>
              </div>
              {invoice.customer.notes && (
                <div className="text-[11px] text-slate-400 italic print:text-gray-700">
                  Catatan: "{invoice.customer.notes}"
                </div>
              )}
            </div>
          </div>

          {/* 3. Items Table */}
          <div className="border border-slate-800 rounded-xl overflow-hidden print:border print:border-black">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950 text-slate-300 font-mono text-[11px] border-b border-slate-800 print:bg-gray-100 print:text-black print:border-black">
                <tr>
                  <th className="py-2.5 px-3 w-8 text-center">No</th>
                  <th className="py-2.5 px-3">Nama Sparepart Laptop</th>
                  <th className="py-2.5 px-3 w-28">Part Number / Garansi</th>
                  <th className="py-2.5 px-3 w-16 text-center">Qty</th>
                  <th className="py-2.5 px-3 w-28 text-right">Harga</th>
                  <th className="py-2.5 px-3 w-28 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-black text-slate-200 print:text-black font-sans">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/40">
                    <td className="py-3 px-3 text-center font-mono text-slate-400 print:text-black">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white print:text-black">{item.product.name}</div>
                      <div className="text-[10px] text-emerald-400 font-mono mt-0.5 print:text-gray-800">
                        ✓ Segel Hologram QC Passed · Grade Original
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <div className="text-slate-300 text-[11px] print:text-black">{item.product.partNumber}</div>
                      <div className="text-[10px] text-amber-400 font-bold print:text-black">
                        Garansi {item.product.warrantyMonths} Bln
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-white print:text-black">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300 print:text-black tabular-nums">
                      {formatRupiah(item.product.price)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white print:text-black tabular-nums">
                      {formatRupiah(item.product.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 4. Total Calculation Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 print:border print:border-black max-w-sm text-[11px] text-slate-400 print:text-gray-800 space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5 print:text-black">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 print:hidden" />
                <span>Ketentuan Garansi Tukar Baru Kevin 88:</span>
              </div>
              <p className="leading-relaxed">
                1. Simpan nota ini atau screenshot bukti pembelian sebagai kartu garansi resmi.
                <br />
                2. Garansi berlaku tukar unit baru jika ada kerusakan fungsional (baterai drop, tombol mati, layar bergaris).
                <br />
                3. Segel hologram toko tidak boleh robek atau terbakar.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400 print:text-gray-700">
                <span>Subtotal Barang:</span>
                <span className="font-mono text-white print:text-black tabular-nums">{formatRupiah(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400 print:text-gray-700">
                <span>Ongkos Kirim:</span>
                <span className="font-mono text-white print:text-black tabular-nums">
                  {invoice.shippingFee === 0 ? 'GRATIS' : formatRupiah(invoice.shippingFee)}
                </span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Diskon Promo:</span>
                  <span className="font-mono tabular-nums">-{formatRupiah(invoice.discount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-slate-800 print:border-black text-sm font-bold">
                <span className="text-white print:text-black">Total Tagihan:</span>
                <span className="text-lg font-mono font-black text-amber-400 print:text-black tabular-nums">
                  {formatRupiah(invoice.total)}
                </span>
              </div>
            </div>
          </div>

          {/* 5. Interactive Payment Instructions Box (Tampilkan Pembayaran) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/40 print:border print:border-black print:bg-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 print:border-black">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold">
                  Rp
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white print:text-black">
                    Instruksi Pembayaran Resmi Toko Kevin 88
                  </h4>
                  <p className="text-[11px] text-slate-400 print:text-gray-700">
                    Selesaikan pembayaran sebesar <strong className="text-amber-400 font-mono print:text-black">{formatRupiah(invoice.total)}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 uppercase print:border-black print:text-black">
                  {selectedConfig?.name ||
                    (invoice.paymentMethod === 'qris'
                      ? 'QRIS ALL PAYMENT'
                      : invoice.paymentMethod === 'cod'
                      ? 'BAYAR DI TOKO CABANG'
                      : `TRANSFER BANK ${invoice.paymentMethod.toUpperCase()}`)}
                </span>
                {isAdminMode && (
                  <button
                    type="button"
                    onClick={openPaymentModal}
                    className="px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 text-[10px] font-bold hover:bg-amber-400/30 border border-amber-400/40 cursor-pointer flex items-center gap-1 transition-colors print:hidden"
                    title="Owner: Edit nomor rekening dan QRIS toko"
                  >
                    <Edit2 className="w-2.5 h-2.5" />
                    <span>Edit Rekening / QRIS</span>
                  </button>
                )}
              </div>
            </div>

            {/* Automatic Dynamic QRIS Display */}
            {invoice.paymentMethod === 'qris' && (
              <div className="space-y-2">
                {!isPaid && (
                  <div className="flex justify-end print:hidden">
                    <button
                      type="button"
                      onClick={() => openQrisPaymentModal(invoice)}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>⚡ Buka Modal QRIS Dinamis (Layar Penuh & Timer)</span>
                    </button>
                  </div>
                )}
                <DynamicQrisCard
                  invoiceNumber={invoice.invoiceNumber}
                  amount={invoice.total}
                  merchantName={selectedConfig?.qrisMerchantName || 'KEVIN 88 COMPUTER'}
                  nmid={qrisNmid}
                  isPaid={isPaid}
                  onVerifyPayment={() => {
                    setIsSimulatedPaid(true);
                    updateInvoicePaymentStatus(invoice.invoiceNumber, 'paid');
                    showToast(
                      `Pembayaran QRIS sebesar ${formatRupiah(invoice.total)} berhasil diverifikasi otomatis!`,
                      'success'
                    );
                  }}
                  showInstructions={true}
                />
              </div>
            )}

            {/* Bank Transfer Display (Works for all bank IDs: bca, mandiri, bri, bni, or custom banks) */}
            {invoice.paymentMethod !== 'qris' && invoice.paymentMethod !== 'cod' && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 print:border-black">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">
                      Transfer ke Rekening Resmi Toko:
                    </span>
                    <div className="text-base font-bold text-white print:text-black">
                      {activeBank.bank}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Atas Nama: <strong className="text-slate-200">{activeBank.holder}</strong>
                    </div>
                  </div>

                  {/* Account Number with 1-click Copy */}
                  <div className="flex items-center gap-2">
                    <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-base font-black text-amber-400 select-all tracking-wider print:text-black">
                      {activeBank.account}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(activeBank.account.replace(/\s/g, ''), 'bank')
                      }
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer print:hidden ${
                        copiedBank
                          ? 'bg-emerald-400 text-slate-950'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {copiedBank ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Rekening</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Cantumkan No. Nota <strong>#{invoice.invoiceNumber}</strong> pada berita transfer</span>
                  <span className="text-emerald-400 font-semibold">Verifikasi Cepat 1-5 Menit</span>
                </div>
              </div>
            )}

            {/* COD Display */}
            {invoice.paymentMethod === 'cod' && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300 print:border-black">
                <div className="font-bold text-white flex items-center gap-1.5 print:text-black">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>Pengambilan & Pembayaran di Cabang Kevin 88:</span>
                </div>
                <p className="leading-relaxed text-slate-300">
                  Silakan tunjukkan nomor nota <strong>#{invoice.invoiceNumber}</strong> saat berkunjung ke cabang toko. Teknisi kami akan membantu melakukan pemasangan dan pengujian fisik sparepart sebelum pembayaran dilakukan.
                </p>
              </div>
            )}
          </div>

          {/* Official Verification Watermark Stamp for Customer Records during Print */}
          <div className="hidden print:flex items-center justify-between p-3.5 my-2 border-2 border-slate-900 rounded-xl bg-slate-50 text-slate-900 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-slate-900 flex items-center justify-center shrink-0">
                <Check className="w-6 h-6 text-slate-900 stroke-[3]" />
              </div>
              <div>
                <div className="text-sm font-black font-mono tracking-wider text-slate-900 uppercase">
                  {isPaid
                    ? 'DOKUMEN RESMI PELANGGAN · STATUS LUNAS'
                    : 'INVOICE TRANSAKSI RESMI · MENUNGGU PEMBAYARAN'}
                </div>
                <div className="text-[10px] text-slate-700 font-mono mt-0.5">
                  ID Faktur: #{invoice.invoiceNumber} · Dokumen sah garansi resmi Kevin 88 Computer
                </div>
              </div>
            </div>
            <div className="text-right font-mono text-[10px] text-slate-600">
              Dicetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>

          {/* 6. Signature / Footer Confirmation Stamp */}
          <div className="flex flex-col sm:flex-row justify-between items-end gap-6 pt-4 border-t border-slate-800 print:border-black text-[11px] text-slate-400 print:text-gray-800">
            <div>
              <div className="font-semibold text-white print:text-black">Kevin 88 Computer Warranty Center</div>
              <p className="text-[10px] mt-0.5">
                Dokumen ini merupakan bukti transaksi yang sah dan terdaftar di sistem inventaris Kevin 88.
              </p>
              <div className="hidden print:block text-[9px] text-slate-600 mt-1 font-mono">
                Terima kasih atas kepercayaan Anda berbelanja suku cadang & servis di Kevin 88 Computer.
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="text-[10px] text-slate-500 font-mono mb-2">Tanda Terima & QC Passed:</div>
              <div className="w-32 h-10 border-b border-dashed border-slate-600 print:border-black inline-block"></div>
              <div className="font-mono text-white text-[11px] font-bold mt-1 print:text-black">
                ( Petugas QC Kevin 88 )
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar (Hidden during Print) */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Garansi resmi toko aktif setelah pembayaran diverifikasi.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* Download as PDF Button (Primary Action) */}
            <button
              onClick={handleDownloadPdf}
              type="button"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
              title="Download Nota Resmi dalam format PDF untuk arsip pelanggan"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Download as PDF</span>
            </button>

            <button
              onClick={() => {
                closeInvoiceModal();
                openWarrantyModal(invoice.invoiceNumber);
              }}
              type="button"
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-500/30"
              title="Periksa sisa masa garansi resmi suku cadang pada nota ini"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Cek Garansi</span>
            </button>

            <button
              onClick={handlePrint}
              type="button"
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
              title="Cetak nota langsung menggunakan printer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Cetak Nota</span>
            </button>

            <button
              onClick={handleSendWhatsApp}
              type="button"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Konfirmasi via WhatsApp</span>
            </button>

            <button
              onClick={closeInvoiceModal}
              type="button"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
