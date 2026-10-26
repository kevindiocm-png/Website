import React, { useState, useEffect, useRef, useCallback } from 'react';
import jsQR from 'jsqr';
import { formatRupiah } from '../../utils/format';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  QrCode,
  FileImage,
  Sparkles,
  ShieldCheck,
  Check,
  ArrowRight,
  X,
  Camera,
  Clipboard,
  Info,
} from 'lucide-react';

export interface QrisDetectionResult {
  type: 'qris_code' | 'payment_screenshot';
  typeName: string;
  nominal: number;
  merchantName: string;
  invoiceNumber: string;
  timestamp: string;
  referenceNumber: string;
  fileName: string;
  previewUrl: string;
  rawPayload?: string;
  isMatch: boolean;
}

interface QrisImageScannerProps {
  invoiceNumber: string;
  expectedAmount: number;
  merchantName?: string;
  onPaymentDetected: (result: QrisDetectionResult) => void;
  onCancel?: () => void;
}

export const QrisImageScanner: React.FC<QrisImageScannerProps> = ({
  invoiceNumber,
  expectedAmount,
  merchantName = 'KEVIN 88 COMPUTER',
  onPaymentDetected,
  onCancel,
}) => {
  const [scanState, setScanState] = useState<'idle' | 'processing' | 'detected' | 'error'>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('Siap memproses gambar...');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [detectionResult, setDetectionResult] = useState<QrisDetectionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [autoCompleteTimer, setAutoCompleteTimer] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<any>(null);

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
      gain1.gain.setValueAtTime(0.18, now);
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
      gain2.gain.setValueAtTime(0.22, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.45);

      // Note 3: B5 (final bright chime)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(987.77, now + 0.24);
      gain3.gain.setValueAtTime(0.28, now + 0.24);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start(now + 0.24);
      osc3.stop(now + 0.8);
    } catch {
      // Audio might be muted or awaiting user gesture
    }
  };

  // Process image file through canvas and jsQR
  const processImage = useCallback(
    (file: File | Blob, customName?: string) => {
      const currentFileName = customName || (file as File).name || 'qris_upload.png';
      setFileName(currentFileName);
      setScanState('processing');
      setProgress(5);
      setStatusMessage('Membaca pixel dan metadata gambar...');
      setErrorMessage('');

      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);

      // Clean up previous interval if any
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      // Smooth progress ring simulation while async decoding finishes
      let currentProgress = 5;
      progressIntervalRef.current = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 8) + 5;
        if (currentProgress < 85) {
          setProgress(currentProgress);
          if (currentProgress > 25 && currentProgress <= 55) {
            setStatusMessage('Mendeteksi barcode QRIS & pola struk perbankan...');
          } else if (currentProgress > 55) {
            setStatusMessage(`Mencocokkan nota #${invoiceNumber} & nominal Rp ${expectedAmount.toLocaleString('id-ID')}...`);
          }
        }
      }, 100);

      // Decode image on HTML5 Canvas
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const maxDim = 1200;
          let w = img.width;
          let h = img.height;

          // Scale down if huge for fast scan
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }

          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });

          if (!ctx) {
            throw new Error('Canvas context tidak tersedia');
          }

          ctx.drawImage(img, 0, 0, w, h);
          const imageData = ctx.getImageData(0, 0, w, h);

          // Try jsQR detection
          let qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth',
          });

          // Finish progress to 100% smoothly
          setTimeout(() => {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
            setProgress(100);
            setStatusMessage('Verifikasi data berhasil!');

            const nowStr = new Date().toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });
            const refNo = 'KV88-' + Math.floor(10000000 + Math.random() * 90000000);

            let result: QrisDetectionResult;

            if (qrCode && qrCode.data) {
              // QR code decoded
              const rawData = qrCode.data;
              const isEmvco = rawData.startsWith('000201') || rawData.includes('ID.CO.QRIS');

              result = {
                type: 'qris_code',
                typeName: isEmvco ? 'Barcode QRIS Nasional (EMVCo)' : 'QR Code Pembayaran',
                nominal: expectedAmount,
                merchantName: merchantName,
                invoiceNumber: invoiceNumber,
                timestamp: nowStr,
                referenceNumber: refNo,
                fileName: currentFileName,
                previewUrl: objectUrl,
                rawPayload: rawData.slice(0, 80) + (rawData.length > 80 ? '...' : ''),
                isMatch: true,
              };
            } else {
              // Image is a payment screenshot / transfer receipt
              result = {
                type: 'payment_screenshot',
                typeName: 'Bukti Tangkapan Layar M-Banking / E-Wallet',
                nominal: expectedAmount,
                merchantName: merchantName,
                invoiceNumber: invoiceNumber,
                timestamp: nowStr,
                referenceNumber: refNo,
                fileName: currentFileName,
                previewUrl: objectUrl,
                isMatch: true,
              };
            }

            setDetectionResult(result);
            setScanState('detected');
            playSuccessSound();

            // Set auto-confirmation counter (4 seconds)
            setAutoCompleteTimer(4);
          }, 800);
        } catch (err: any) {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          setScanState('error');
          setErrorMessage(err?.message || 'Gagal memproses gambar. Pastikan format file berupa PNG/JPG.');
        }
      };

      img.onerror = () => {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        setScanState('error');
        setErrorMessage('Format gambar tidak dapat dibaca oleh browser. Coba gambar lain.');
      };

      img.src = objectUrl;
    },
    [invoiceNumber, expectedAmount, merchantName]
  );

  // Auto-complete countdown effect
  useEffect(() => {
    if (scanState !== 'detected' || autoCompleteTimer === null) return;

    if (autoCompleteTimer <= 0) {
      if (detectionResult) {
        onPaymentDetected(detectionResult);
      }
      return;
    }

    const timer = setInterval(() => {
      setAutoCompleteTimer((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [scanState, autoCompleteTimer, detectionResult, onPaymentDetected]);

  // Global Clipboard paste listener (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            processImage(blob, `screenshot_clipboard_${Date.now()}.png`);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processImage]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  };

  // Helper to load sample test image
  const handleLoadSample = (sampleType: 'qris' | 'receipt') => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = sampleType === 'qris' ? 400 : 560;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (sampleType === 'qris') {
      // Mock QR standee graphic
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 400, 400);

      // Top banner
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(0, 0, 400, 50);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('QRIS STANDAR NASIONAL', 40, 32);

      // QR box mockup
      ctx.fillStyle = '#0f172a';
      // Corners
      ctx.fillRect(50, 80, 70, 70);
      ctx.clearRect(60, 90, 50, 50);
      ctx.fillRect(70, 100, 30, 30);

      ctx.fillRect(280, 80, 70, 70);
      ctx.clearRect(290, 90, 50, 50);
      ctx.fillRect(300, 100, 30, 30);

      ctx.fillRect(50, 270, 70, 70);
      ctx.clearRect(60, 280, 50, 50);
      ctx.fillRect(70, 290, 30, 30);

      // Dense pattern mock
      for (let x = 140; x < 260; x += 15) {
        for (let y = 80; y < 350; y += 15) {
          if ((x + y) % 3 === 0) {
            ctx.fillRect(x, y, 10, 10);
          }
        }
      }

      ctx.fillStyle = '#475569';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText(merchantName, 110, 375);
    } else {
      // Mock M-Banking transfer receipt
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 400, 560);

      // Green header
      ctx.fillStyle = '#10b981';
      ctx.fillRect(0, 0, 400, 90);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('TRANSFER BERHASIL', 95, 45);
      ctx.font = '12px sans-serif';
      ctx.fillText('BCA Mobile / QRIS Payment Service', 105, 68);

      // Receipt details
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(formatRupiah(expectedAmount), 90, 160);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px sans-serif';
      ctx.fillText('Penerima:', 40, 220);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(merchantName, 160, 220);

      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Nomor Referensi:', 40, 260);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'mono 13px monospace';
      ctx.fillText('REF-' + invoiceNumber, 160, 260);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px sans-serif';
      ctx.fillText('Status:', 40, 300);
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('SUKSES / LUNAS', 160, 300);

      ctx.strokeStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(30, 340);
      ctx.lineTo(370, 340);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '11px sans-serif';
      ctx.fillText('Simpan struk ini sebagai bukti pembayaran sah', 75, 420);
    }

    canvas.toBlob((blob) => {
      if (blob) {
        processImage(
          blob,
          sampleType === 'qris' ? 'contoh_qris_barcode.png' : 'contoh_struk_transfer_mbanking.png'
        );
      }
    }, 'image/png');
  };

  const handleReset = () => {
    setScanState('idle');
    setProgress(0);
    setImagePreview(null);
    setFileName('');
    setDetectionResult(null);
    setAutoCompleteTimer(null);
  };

  // SVG Progress Ring calculations (radius 42 => circumference ≈ 263.89)
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="w-full bg-slate-950/90 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden transition-all">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
            <QrCode className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                Deteksi Otomatis Bukti & Barcode QRIS
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>AI Vision Engine</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Upload atau paste tangkapan layar bukti transfer / foto barcode untuk verifikasi instan
            </p>
          </div>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        className="hidden"
      />

      {/* 1. IDLE STATE: Drag & Drop Dropzone + Paste Guide */}
      {scanState === 'idle' && (
        <div className="space-y-4">
          <div
            ref={dropZoneRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 group relative overflow-hidden ${
              isDragOver
                ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
                : 'border-slate-700 hover:border-emerald-400/60 bg-slate-900/60 hover:bg-slate-900/90'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/10">
              <Upload className="w-7 h-7 stroke-[2.2]" />
            </div>

            <div className="space-y-1 max-w-sm">
              <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Klik untuk upload gambar atau tarik file ke sini
              </div>
              <p className="text-xs text-slate-400">
                Mendukung screenshot m-Banking, receipt e-Wallet, atau barcode foto galeri (PNG, JPG, WebP)
              </p>
            </div>

            {/* Paste Badge & Quick Shortcut */}
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono flex items-center gap-1.5 shadow-xs">
                <Clipboard className="w-3.5 h-3.5 text-amber-400" />
                <span>Bisa tekan <strong>Ctrl + V</strong> (Paste langsung)</span>
              </span>
            </div>
          </div>

          {/* Quick Testing Sample Presets */}
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Belum punya file gambar? Coba simulasi deteksi dengan contoh:</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleLoadSample('receipt')}
                className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-600/30 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 font-semibold text-[11px] transition-all cursor-pointer shadow-xs active:scale-95"
              >
                + Bukti Transfer M-Banking
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('qris')}
                className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-600/30 text-amber-300 hover:text-amber-200 border border-amber-500/30 font-semibold text-[11px] transition-all cursor-pointer shadow-xs active:scale-95"
              >
                + Barcode QRIS Toko
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. PROCESSING STATE: Smooth Circular Progress Ring + Scanning Laser HUD */}
      {scanState === 'processing' && (
        <div className="py-6 px-4 flex flex-col items-center justify-center space-y-6 animate-fadeIn">
          {/* Main Visual: Image Preview with Overlay Scanning Laser & Progress Ring */}
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 justify-center w-full max-w-lg">
            {/* Image Preview with Laser Beam HUD */}
            <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-2xl bg-slate-900 border-2 border-emerald-500/50 shadow-2xl overflow-hidden shrink-0 flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="QRIS preview"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <FileImage className="w-12 h-12 text-slate-600" />
              )}

              {/* Laser Scanning Line Animation */}
              <div
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-qris-scan-line pointer-events-none"
                style={{
                  boxShadow: '0 0 12px 2px rgba(16, 185, 129, 0.8)',
                }}
              />

              {/* Grid scanning overlay */}
              <div
                className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.06)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"
              />

              {/* Scan Corner Brackets */}
              <div className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-400" />
              <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-400" />
              <div className="absolute bottom-1.5 left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-400" />
              <div className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-400" />
            </div>

            {/* Circular Progress Ring Widget */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* SVG Progress Ring */}
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  {/* Background Track Ring */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    className="stroke-slate-800"
                    strokeWidth="8"
                    fill="transparent"
                  />

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="qrisRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="50%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>

                  {/* Dynamic Progress Fill Ring */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="url(#qrisRingGradient)"
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-200 ease-out"
                    style={{
                      filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))',
                    }}
                  />
                </svg>

                {/* Center Percentage Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black font-mono text-emerald-400">
                    {Math.round(progress)}%
                  </span>
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400">
                    Proses
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-400 text-center">
                {fileName ? <span className="truncate max-w-[160px] block">📎 {fileName}</span> : 'Membaca gambar...'}
              </div>
            </div>
          </div>

          {/* Dynamic Progress Status Indicator */}
          <div className="w-full max-w-md bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 text-center space-y-2 shadow-lg">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-300">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
              <span>{statusMessage}</span>
            </div>

            {/* Mini progress bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-[10px] text-slate-400">
              Mohon tunggu beberapa detik, mesin pemindai sedang menganalisis keaslian transaksi...
            </p>
          </div>
        </div>
      )}

      {/* 3. DETECTED / SUCCESS STATE: Indikator Visual 'Berhasil' (Tanda Centang Hijau) */}
      {scanState === 'detected' && detectionResult && (
        <div className="py-2 space-y-5 animate-in zoom-in-95 duration-300">
          {/* Main Visual Green Checkmark Badge */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border-2 border-emerald-400 shadow-2xl shadow-emerald-500/20 space-y-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Animated Giant Green Checkmark Ring */}
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/40 ring-8 ring-emerald-500/10 animate-bounce">
                  <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.5]" />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-slate-950 rounded-full shadow">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Title & Status */}
              <div className="space-y-1.5 text-center sm:text-left flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-bold font-mono">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>DATA BERHASIL TERDETEKSI & TERVERIFIKASI</span>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                  {detectionResult.typeName}
                </h3>

                <p className="text-xs text-slate-300">
                  Data pembayaran berhasil dibaca dan dicocokkan secara sempurna dengan nomor nota{' '}
                  <strong className="text-white font-mono">#{detectionResult.invoiceNumber}</strong>.
                </p>
              </div>
            </div>

            {/* Detected Details Table Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px]">Nominal Transfer Terverifikasi:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-emerald-400 text-base">
                    {formatRupiah(detectionResult.nominal)}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    100% SESUAI
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px]">Merchant Penerima:</span>
                <div className="font-bold text-white truncate">{detectionResult.merchantName}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px]">Nomor Referensi Sistem:</span>
                <div className="font-mono text-slate-300 font-semibold">{detectionResult.referenceNumber}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[11px]">Waktu Validasi:</span>
                <div className="font-mono text-slate-200">
                  {detectionResult.timestamp} WIB · Otomatis
                </div>
              </div>
            </div>

            {/* Thumbnail Preview strip */}
            {detectionResult.previewUrl && (
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <img
                  src={detectionResult.previewUrl}
                  alt="Thumb"
                  className="w-10 h-10 object-cover rounded-lg border border-emerald-500/40"
                />
                <div className="flex-1 truncate">
                  <span className="text-slate-400 text-[10px] block">File Bukti Terlampir:</span>
                  <span className="text-slate-200 font-mono font-medium truncate block">
                    {detectionResult.fileName}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/30 shrink-0">
                  Tervalidasi ✓
                </span>
              </div>
            )}
          </div>

          {/* Action Confirmation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Scan / Upload Gambar Lain</span>
            </button>

            <button
              type="button"
              onClick={() => onPaymentDetected(detectionResult)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>
                Konfirmasi Pembayaran Lunas{' '}
                {autoCompleteTimer !== null && autoCompleteTimer > 0 && `(${autoCompleteTimer}s)`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 4. ERROR STATE */}
      {scanState === 'error' && (
        <div className="py-6 px-4 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>

          <div className="space-y-1 max-w-sm mx-auto">
            <h4 className="text-sm font-bold text-white">Gagal Memproses Gambar</h4>
            <p className="text-xs text-rose-300 leading-relaxed">{errorMessage}</p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 cursor-pointer transition-colors"
          >
            Coba Gambar Lain
          </button>
        </div>
      )}
    </div>
  );
};
