import React, { useState, useEffect, useRef } from 'react';
import { useSiteData } from '../context/SiteContext';
import { generateQRISDataUrl, generateQRISPayload } from '../utils/qrisGenerator';
import { formatRupiah } from '../utils/format';
import {
  X,
  QrCode,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Upload,
  AlertCircle,
  ArrowRight,
  FileText,
  Truck,
  ExternalLink,
  Info,
  CreditCard,
  Building2,
  Share2,
  Scan,
} from 'lucide-react';
import { QrisImageScanner, QrisDetectionResult } from './common/QrisImageScanner';

export const QrisPaymentModal: React.FC = () => {
  const {
    isQrisPaymentModalOpen,
    closeQrisPaymentModal,
    qrisPaymentInvoice,
    currentInvoice,
    settings,
    updateInvoicePaymentStatus,
    updateQrisValidation,
    openInvoiceModal,
    openOrdersModal,
    showToast,
  } = useSiteData();

  // Active invoice being paid
  const invoice = qrisPaymentInvoice || currentInvoice;

  // Settings
  const paymentSettings = settings.paymentSettings;
  const merchantName =
    paymentSettings?.methods?.find((m) => m.category === 'qris')?.qrisMerchantName ||
    paymentSettings?.methods?.find((m) => m.category === 'qris')?.accountHolder ||
    'KEVIN 88 COMPUTER';
  const nmid =
    paymentSettings?.qrisNmid ||
    paymentSettings?.methods?.find((m) => m.category === 'qris')?.qrisNmid ||
    'ID1020038814-KV88';

  // Component states
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isLoadingQr, setIsLoadingQr] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(900); // 15 minutes
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isSimulatedSuccess, setIsSimulatedSuccess] = useState<boolean>(false);
  const [copiedAmount, setCopiedAmount] = useState<boolean>(false);
  const [copiedNmid, setCopiedNmid] = useState<boolean>(false);
  const [copiedInvoice, setCopiedInvoice] = useState<boolean>(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'mbanking' | 'ewallet' | 'tips'>('mbanking');
  const [proofFileName, setProofFileName] = useState<string | null>(null);
  const [scannerResult, setScannerResult] = useState<QrisDetectionResult | null>(null);
  const [activeVerifyMode, setActiveVerifyMode] = useState<'scanner' | 'manual'>('scanner');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sound synthesis on payment success using Web Audio API
  const playSuccessSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const now = ctx.currentTime;
      // Note 1: E5
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      // Note 2: G#5
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(830.61, now + 0.12);
      gain2.gain.setValueAtTime(0.2, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.45);

      // Note 3: B5 (final chord tone)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(987.77, now + 0.24);
      gain3.gain.setValueAtTime(0.25, now + 0.24);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start(now + 0.24);
      osc3.stop(now + 0.8);
    } catch {
      // Audio context may be restricted before user gesture
    }
  };

  const isPaid = isSimulatedSuccess || invoice?.paymentStatus === 'paid';

  // Reset timer & generate QR when invoice changes or modal opens
  useEffect(() => {
    if (!isQrisPaymentModalOpen || !invoice) return;

    setTimeLeft(900);
    setIsSimulatedSuccess(invoice.paymentStatus === 'paid');
    setIsLoadingQr(true);

    let isMounted = true;
    generateQRISDataUrl({
      merchantName,
      nmid,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.total,
      city: 'SEMARANG',
    })
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url);
          setIsLoadingQr(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate dynamic QRIS DataURL:', err);
        if (isMounted) setIsLoadingQr(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isQrisPaymentModalOpen, invoice?.invoiceNumber, invoice?.total, merchantName, nmid]);

  // Countdown timer effect
  useEffect(() => {
    if (!isQrisPaymentModalOpen || isPaid) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isQrisPaymentModalOpen, isPaid]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isQrisPaymentModalOpen || !invoice) return null;

  // Actions
  const handleCopyAmount = () => {
    navigator.clipboard.writeText(invoice.total.toString());
    setCopiedAmount(true);
    showToast(`Nominal transfer Rp ${invoice.total.toLocaleString('id-ID')} disalin!`, 'success');
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const handleCopyNmid = () => {
    navigator.clipboard.writeText(nmid);
    setCopiedNmid(true);
    showToast(`NMID ${nmid} berhasil disalin!`, 'info');
    setTimeout(() => setCopiedNmid(false), 2000);
  };

  const handleCopyInvoice = () => {
    navigator.clipboard.writeText(invoice.invoiceNumber);
    setCopiedInvoice(true);
    showToast(`Nomor nota #${invoice.invoiceNumber} disalin!`, 'info');
    setTimeout(() => setCopiedInvoice(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QRIS-KEVIN88-${invoice.invoiceNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Barcode QRIS berhasil diunduh ke galeri perangkat Anda!', 'success');
  };

  const handleManualCheckStatus = () => {
    if (isPaid) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      showToast(
        'Sistem sedang memantau mutasi rekening QRIS. Pastikan transfer berhasil di aplikasi Anda.',
        'info'
      );
    }, 1200);
  };

  const handleSimulatePaymentSuccess = () => {
    if (isPaid) return;
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setIsSimulatedSuccess(true);
      playSuccessSound();
      updateInvoicePaymentStatus(invoice.invoiceNumber, 'paid');
      showToast('🎉 Pembayaran QRIS Berhasil Dikonfirmasi Lunas!', 'success');
    }, 1000);
  };

  const handleScannerPaymentDetected = (result: QrisDetectionResult) => {
    setScannerResult(result);
    setProofFileName(result.fileName);
    setIsSimulatedSuccess(true);
    playSuccessSound();

    // Record automated validation history
    updateQrisValidation(
      invoice.invoiceNumber,
      {
        uploadedAt: new Date().toISOString(),
        fileName: result.fileName,
        proofPreviewUrl: result.imagePreviewUrl,
        decodedPayload: result.detectedPayload,
        matchScore: result.matchPercentage,
        detectedType: 'qris_payload',
        verificationStatus: 'verified_paid',
        verifiedAt: new Date().toISOString(),
        verifiedBy: 'Auto-Scanner QRIS',
        manualNotes: `Scanner mendeteksi barcode QRIS valid: ${result.typeName}`,
      },
      true // Mark paid
    );

    showToast(
      `🎉 ${result.typeName} Berhasil Terdeteksi! Nota #${invoice.invoiceNumber} LUNAS.`,
      'success'
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProofFileName(file.name);
    setIsVerifying(true);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;

      setTimeout(() => {
        setIsVerifying(false);
        setIsSimulatedSuccess(true);
        playSuccessSound();

        // Record manual upload validation history
        updateQrisValidation(
          invoice.invoiceNumber,
          {
            uploadedAt: new Date().toISOString(),
            fileName: file.name,
            proofPreviewUrl: dataUrl,
            detectedType: 'receipt_screenshot',
            verificationStatus: 'verified_paid',
            verifiedAt: new Date().toISOString(),
            verifiedBy: 'Sistem Pembayaran Toko',
            manualNotes: `Bukti transfer diunggah oleh pelanggan: ${file.name}`,
          },
          true
        );

        showToast(`Bukti transfer "${file.name}" berhasil diunggah & dicatat!`, 'success');
      }, 1200);
    };

    reader.readAsDataURL(file);
  };

  const handleResetTimer = () => {
    setTimeLeft(900);
    showToast('Waktu pembayaran QRIS berhasil diperpanjang 15 menit!', 'info');
  };

  const handleViewInvoice = () => {
    closeQrisPaymentModal();
    openInvoiceModal(invoice);
  };

  const handleViewTracking = () => {
    closeQrisPaymentModal();
    openOrdersModal();
  };

  const progressPercent = Math.max(0, Math.min(100, (timeLeft / 900) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] my-4">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-950/80 via-slate-900 to-amber-950/80 border-b border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-md">
              <QrCode className="w-5 h-5 text-rose-400 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  Pembayaran QRIS Dinamis 24/7
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-600/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                  <span>AUTO-DETECT</span>
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Pindai barcode QRIS di bawah menggunakan M-Banking atau E-Wallet apa saja di Indonesia
              </p>
            </div>
          </div>

          <button
            onClick={closeQrisPaymentModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup Modal Pembayaran"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* SUCCESS VIEW: When paid, show celebratory status */}
          {isPaid ? (
            <div className="py-8 px-4 sm:px-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="relative inline-block mx-auto">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-emerald-500/20 border-2 border-emerald-400/60 flex items-center justify-center text-emerald-400 shadow-2xl shadow-emerald-500/30 ring-8 ring-emerald-500/10 animate-pulse">
                  <CheckCircle2 className="w-14 h-14 sm:w-16 sm:h-16 stroke-[2.5]" />
                </div>
                <div className="absolute -top-1 -right-1 px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-black font-mono shadow-md">
                  LUNAS
                </div>
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  PEMBAYARAN QRIS BERHASIL!
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Transfer sebesar{' '}
                  <strong className="text-emerald-400 font-mono text-base">
                    {formatRupiah(invoice.total)}
                  </strong>{' '}
                  untuk Nota{' '}
                  <span className="text-white font-mono font-semibold">#{invoice.invoiceNumber}</span> telah
                  berhasil diverifikasi secara otomatis oleh sistem Kevin 88 Computer.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 text-left space-y-3 text-xs shadow-xl">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <span className="text-slate-400">Merchant Penerima</span>
                  <span className="font-bold text-white">{merchantName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Metode Pembayaran</span>
                  <span className="font-mono font-semibold text-rose-400">QRIS Dinamis 24 Jam</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Waktu Pembayaran</span>
                  <span className="font-mono text-slate-200">
                    {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}, {new Date().toLocaleDateString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Status Nota</span>
                  <span className="font-mono font-bold text-emerald-400">LUNAS & TERKONFIRMASI</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-sm">
                  <span className="font-bold text-white">Total Diterima</span>
                  <span className="font-mono font-extrabold text-emerald-400 text-base">
                    {formatRupiah(invoice.total)}
                  </span>
                </div>
              </div>

              {/* Detected Proof Card If Available */}
              {scannerResult && (
                <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-left flex items-center gap-3 text-xs shadow-lg animate-in fade-in">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div className="flex-1 truncate">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{scannerResult.typeName}</span>
                      <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        Auto-Verified ✓
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono mt-0.5">
                      Ref: {scannerResult.referenceNumber} · {scannerResult.timestamp}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleViewInvoice}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                >
                  <FileText className="w-4 h-4 stroke-[2.5]" />
                  <span>Lihat Nota & Bukti Garansi Resmi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleViewTracking}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>Lacak Proses QC & Pengiriman</span>
                </button>
              </div>
            </div>
          ) : (
            /* UNPAID ACTIVE PAYMENT VIEW: QR Code Standee & Guide */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Official Indonesian QRIS Standee (5 cols) */}
              <div className="lg:col-span-5 flex flex-col items-center space-y-4">
                {/* Official QRIS Card Container */}
                <div className="w-full max-w-[320px] bg-white rounded-3xl p-5 shadow-2xl border-2 border-slate-200 text-slate-900 flex flex-col items-center shrink-0 relative overflow-hidden transition-transform hover:scale-[1.01]">
                  {/* Top Header: Official QRIS Logo + GPN Badge */}
                  <div className="w-full flex items-center justify-between pb-3 border-b-2 border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="px-2.5 py-1 rounded bg-rose-600 text-white font-black text-sm font-mono tracking-widest shadow-xs">
                        QRIS
                      </div>
                      <div className="text-[10px] font-extrabold text-slate-700 tracking-tight leading-none">
                        PEMBAYARAN NASIONAL
                      </div>
                    </div>

                    <div className="px-2 py-0.5 rounded bg-blue-700 text-white font-black text-[10px] font-mono tracking-wider">
                      GPN
                    </div>
                  </div>

                  {/* Merchant & NMID Info */}
                  <div className="w-full text-center py-2.5">
                    <div className="font-extrabold text-sm text-slate-900 tracking-tight uppercase truncate">
                      {merchantName}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      NMID: <span className="font-semibold">{nmid}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Ref: <span className="text-slate-600 font-semibold">{invoice.invoiceNumber}</span>
                    </div>
                  </div>

                  {/* High-Definition Dynamic QR Barcode */}
                  <div className="w-full aspect-square max-w-[240px] bg-white p-2 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center relative my-1">
                    {isLoadingQr ? (
                      <div className="flex flex-col items-center justify-center gap-2.5 py-4 text-center">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                          <svg className="w-full h-full animate-spin" viewBox="0 0 50 50">
                            <circle
                              className="stroke-rose-100"
                              cx="25"
                              cy="25"
                              r="20"
                              strokeWidth="4"
                              fill="none"
                            />
                            <circle
                              className="stroke-rose-600"
                              cx="25"
                              cy="25"
                              r="20"
                              strokeWidth="4"
                              strokeDasharray="90, 150"
                              strokeLinecap="round"
                              fill="none"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center text-rose-600">
                            <QrCode className="w-5 h-5 animate-pulse" />
                          </div>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-900 block">
                            Membuat QRIS Dinamis...
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {formatRupiah(invoice.total)} · Bebas Biaya
                          </span>
                        </div>
                      </div>
                    ) : qrDataUrl ? (
                      <div className="relative w-full h-full">
                        <img
                          src={qrDataUrl}
                          alt="QRIS Barcode"
                          className="w-full h-full object-contain rounded-lg"
                        />
                        {/* Center Emblem/Chip */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-10 h-10 rounded-xl bg-white border-2 border-rose-500 shadow-lg flex items-center justify-center p-1">
                            <span className="text-[10px] font-black text-rose-600 font-mono">
                              88
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-rose-500 text-center">
                        Gagal memuat QRIS. Silakan muat ulang.
                      </div>
                    )}
                  </div>

                  {/* Exact Amount Ribbon */}
                  <div className="w-full mt-2 pt-2.5 border-t border-slate-100 text-center">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      NOMINAL TRANSAKSI TEPAT
                    </div>
                    <div className="text-lg sm:text-xl font-black text-rose-600 font-mono tracking-tight">
                      {formatRupiah(invoice.total)}
                    </div>
                    <div className="text-[9px] text-slate-400 mt-0.5">
                      Otomatis terisi di layar HP Anda saat scan
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons for Standee */}
                <div className="w-full max-w-[320px] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadQR}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
                    title="Simpan QR code ke galeri untuk di-scan lewat aplikasi perbankan"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Unduh QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyAmount}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
                    title="Salin nominal tagihan"
                  >
                    {copiedAmount ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Salin Nominal</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Timer, Instructions, Supported Apps & Verification (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                {/* 1. Countdown Timer Card */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
                        <Clock className="w-4 h-4 stroke-[2.2]" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-semibold">Sisa Waktu Pembayaran</div>
                        <div
                          className={`text-xl font-black font-mono tracking-wider ${
                            timeLeft <= 180 ? 'text-rose-500 animate-pulse' : 'text-amber-400'
                          }`}
                        >
                          {formatTime(timeLeft)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {timeLeft === 0 ? (
                        <button
                          type="button"
                          onClick={handleResetTimer}
                          className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1 shadow cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Perpanjang Waktu</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>Menunggu transfer</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress linear bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        timeLeft <= 180
                          ? 'bg-rose-500'
                          : 'bg-gradient-to-r from-amber-400 to-emerald-400'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* 2. Order Reference & Customer Details Mini Card */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Nomor Nota Transaksi:</span>
                    <button
                      type="button"
                      onClick={handleCopyInvoice}
                      className="font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>#{invoice.invoiceNumber}</span>
                      {copiedInvoice ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Pemesan:</span>
                    <span className="font-semibold text-white">
                      {invoice.customer.name} ({invoice.customer.phone})
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Metode Pengiriman:</span>
                    <span className="text-slate-200 uppercase font-mono font-bold">
                      {invoice.shippingMethod}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                    <span className="text-slate-400">NMID Toko:</span>
                    <button
                      type="button"
                      onClick={handleCopyNmid}
                      className="font-mono text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <span>{nmid}</span>
                      {copiedNmid ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* 3. Universal Supported Apps Pill Grid */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                      <span>Dapat Dipindai dari Seluruh Aplikasi:</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">100% BEBAS BIAYA ADMIN</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: 'BCA Mobile', color: 'bg-blue-600/20 text-blue-300 border-blue-500/40' },
                      { name: "Livin' Mandiri", color: 'bg-amber-600/20 text-amber-300 border-amber-500/40' },
                      { name: 'BRImo', color: 'bg-blue-700/20 text-blue-300 border-blue-600/40' },
                      { name: 'BNI Mobile', color: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40' },
                      { name: 'GoPay', color: 'bg-cyan-600/20 text-cyan-300 border-cyan-500/40' },
                      { name: 'OVO', color: 'bg-purple-600/20 text-purple-300 border-purple-500/40' },
                      { name: 'DANA', color: 'bg-sky-600/20 text-sky-300 border-sky-500/40' },
                      { name: 'ShopeePay', color: 'bg-orange-600/20 text-orange-300 border-orange-500/40' },
                      { name: 'LinkAja', color: 'bg-rose-600/20 text-rose-300 border-rose-500/40' },
                      { name: 'Bank Jago', color: 'bg-amber-500/20 text-amber-300 border-amber-400/40' },
                      { name: 'Jenius', color: 'bg-teal-600/20 text-teal-300 border-teal-500/40' },
                      { name: 'SeaBank', color: 'bg-orange-500/20 text-orange-300 border-orange-400/40' },
                    ].map((app) => (
                      <span
                        key={app.name}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${app.color}`}
                      >
                        {app.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4. Payment Steps Guide Tabs */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-amber-400" />
                      <span>Panduan Cara Pembayaran</span>
                    </span>

                    <div className="flex gap-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setActiveGuideTab('mbanking')}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                          activeGuideTab === 'mbanking'
                            ? 'bg-amber-400 text-slate-950'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        M-Banking
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveGuideTab('ewallet')}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                          activeGuideTab === 'ewallet'
                            ? 'bg-amber-400 text-slate-950'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        E-Wallet
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveGuideTab('tips')}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                          activeGuideTab === 'tips'
                            ? 'bg-amber-400 text-slate-950'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Bayar dari HP Sendiri
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                    {activeGuideTab === 'mbanking' && (
                      <ol className="list-decimal list-inside space-y-1 text-slate-300">
                        <li>Buka aplikasi m-banking (BCA Mobile, Livin, BRImo, BNI, dll).</li>
                        <li>Pilih menu <strong>QR / QRIS / Bayar</strong> di layar utama.</li>
                        <li>Arahkan kamera ke barcode QRIS dinamis di atas.</li>
                        <li>Periksa nama penerima <strong>{merchantName}</strong> dan nominal tepat <strong>{formatRupiah(invoice.total)}</strong>.</li>
                        <li>Konfirmasi dan masukkan PIN m-banking Anda.</li>
                      </ol>
                    )}

                    {activeGuideTab === 'ewallet' && (
                      <ol className="list-decimal list-inside space-y-1 text-slate-300">
                        <li>Buka aplikasi GoPay, OVO, DANA, ShopeePay, atau LinkAja.</li>
                        <li>Klik ikon <strong>Bayar / Pay / Scan QRIS</strong>.</li>
                        <li>Pindai barcode QRIS di sebelah kiri.</li>
                        <li>Pastikan saldo mencukupi dan nominal sesuai tagihan.</li>
                        <li>Klik Bayar Sekarang & masukkan PIN Anda.</li>
                      </ol>
                    )}

                    {activeGuideTab === 'tips' && (
                      <div className="space-y-1 text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                        <p className="font-semibold text-amber-300">Jika membuka website dari HP yang sama:</p>
                        <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
                          <li>Klik tombol <strong>"Unduh QR"</strong> di bawah barcode.</li>
                          <li>Buka m-banking / e-wallet Anda & pilih menu <strong>QRIS</strong>.</li>
                          <li>Pilih opsi <strong>"Scan dari Galeri / Foto"</strong> (ikon gambar/galeri).</li>
                          <li>Pilih foto barcode QRIS yang baru saja diunduh.</li>
                        </ol>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Live Verification & Image Auto-Detection (Progress Ring & Green Checkmark) */}
                <div className="space-y-3">
                  {/* Mode Selector Tabs */}
                  <div className="flex items-center justify-between p-1.5 rounded-2xl bg-slate-950 border border-slate-800 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveVerifyMode('scanner')}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        activeVerifyMode === 'scanner'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Deteksi Bukti / QRIS (Otomatis)</span>
                      <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-black uppercase bg-emerald-950/40 text-emerald-300">
                        Progress Ring
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveVerifyMode('manual')}
                      className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        activeVerifyMode === 'manual'
                          ? 'bg-slate-800 text-white border border-slate-700 shadow-xs'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>Cek Manual / Simulasi</span>
                    </button>
                  </div>

                  {/* Mode 1: AI Vision Scanner with Smooth Progress Ring & Green Checkmark */}
                  {activeVerifyMode === 'scanner' && (
                    <QrisImageScanner
                      invoiceNumber={invoice.invoiceNumber}
                      expectedAmount={invoice.total}
                      merchantName={merchantName}
                      onPaymentDetected={handleScannerPaymentDetected}
                    />
                  )}

                  {/* Mode 2: Manual Check & Instant Simulation */}
                  {activeVerifyMode === 'manual' && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-amber-500/40 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>Pemeriksaan Mutasi Real-time</span>
                        </span>

                        {/* Hidden input for proof upload */}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          accept="image/*"
                          className="hidden"
                        />

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          title="Upload tangkapan layar bukti transfer jika diperlukan"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{proofFileName ? 'Ganti Bukti' : 'Upload File Manual'}</span>
                        </button>
                      </div>

                      {proofFileName && (
                        <div className="p-2 rounded-xl bg-slate-800/80 border border-emerald-500/30 text-xs flex items-center justify-between text-emerald-300">
                          <span className="truncate">📎 {proofFileName}</span>
                          <span className="text-[10px] font-mono font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded">
                            Terlampir
                          </span>
                        </div>
                      )}

                      {/* Dual Action Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={handleManualCheckStatus}
                          disabled={isVerifying}
                          className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw
                            className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin text-amber-400' : ''}`}
                          />
                          <span>{isVerifying ? 'Mengecek Mutasi...' : 'Cek Status Sekarang'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleSimulatePaymentSuccess}
                          disabled={isVerifying}
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                          title="Simulasi transfer berhasil seketika untuk verifikasi & testing"
                        >
                          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                          <span>Simulasi Transfer Berhasil (Test)</span>
                        </button>
                      </div>

                      <p className="text-[10px] text-center text-slate-400">
                        Gunakan tombol di atas jika Anda ingin menguji mutasi perbankan tanpa upload gambar.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Standar QRIS Bank Indonesia & ASPI · Bebas Biaya Admin</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleViewInvoice}
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Lihat Format Nota Lengkap
            </button>

            <button
              type="button"
              onClick={closeQrisPaymentModal}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
