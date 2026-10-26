import React, { useEffect, useState } from 'react';
import { generateQRISDataUrl, generateQRISPayload } from '../../utils/qrisGenerator';
import { formatRupiah } from '../../utils/format';
import {
  Download,
  Copy,
  Check,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

interface DynamicQrisCardProps {
  invoiceNumber: string;
  amount: number;
  merchantName?: string;
  nmid?: string;
  isPaid?: boolean;
  onVerifyPayment?: () => void;
  showInstructions?: boolean;
}

export const DynamicQrisCard: React.FC<DynamicQrisCardProps> = ({
  invoiceNumber,
  amount,
  merchantName = 'KEVIN 88 COMPUTER',
  nmid = 'ID1020038814-KV88',
  isPaid = false,
  onVerifyPayment,
  showInstructions = true,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    generateQRISDataUrl({
      merchantName,
      nmid,
      invoiceNumber,
      amount,
    })
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error generating QRIS', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [invoiceNumber, amount, merchantName, nmid]);

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `QRIS-${merchantName.replace(/\s+/g, '-')}-${invoiceNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyPayload = () => {
    const payload = generateQRISPayload({
      merchantName,
      nmid,
      invoiceNumber,
      amount,
    });
    navigator.clipboard.writeText(payload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleSimulateVerification = () => {
    if (isPaid || !onVerifyPayment) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerifyPayment();
    }, 1200);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row items-center gap-6 p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 print:border-black print:bg-white">
      {/* Official Indonesian QRIS Standee Card */}
      <div className="w-full max-w-[270px] bg-white rounded-2xl p-4 shadow-xl border border-slate-200 text-slate-900 flex flex-col items-center shrink-0 relative overflow-hidden print:border-black">
        {/* Paid Stamp Overlay */}
        {isPaid && (
          <div className="absolute inset-0 bg-emerald-950/85 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-4 text-center animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mb-2 shadow-lg ring-4 ring-emerald-400/40">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <span className="text-white font-extrabold text-sm tracking-wider uppercase font-mono">
              PEMBAYARAN LUNAS
            </span>
            <span className="text-emerald-200 text-[11px] mt-1 font-mono">
              Terverifikasi Otomatis
            </span>
          </div>
        )}

        {/* Top Header: Official QRIS + GPN Emblem */}
        <div className="w-full flex items-center justify-between pb-2.5 border-b border-slate-200">
          <div className="flex items-center gap-1.5">
            <div className="px-2 py-0.5 rounded bg-rose-600 text-white font-black text-xs font-mono tracking-widest shadow-xs">
              QRIS
            </div>
            <span className="text-[9px] font-bold text-slate-600 tracking-tight font-sans">
              STANDAR NASIONAL
            </span>
          </div>

          <div className="px-1.5 py-0.5 rounded bg-blue-700 text-white font-black text-[9px] font-mono tracking-wider">
            GPN
          </div>
        </div>

        {/* Merchant & NMID Info */}
        <div className="w-full text-center py-2">
          <div className="font-extrabold text-xs text-slate-900 tracking-tight truncate">
            {merchantName}
          </div>
          <div className="text-[9px] text-slate-500 font-mono">
            NMID: {nmid}
          </div>
          <div className="text-[9px] text-slate-400 font-mono mt-0.5">
            Nota: {invoiceNumber}
          </div>
        </div>

        {/* The Dynamic Generated Barcode Container */}
        <div className="relative w-48 h-48 bg-slate-50 border border-slate-200 rounded-xl p-1 flex items-center justify-center overflow-hidden my-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-2 text-center p-3">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full animate-spin" viewBox="0 0 50 50">
                  <circle
                    className="stroke-amber-100"
                    cx="25"
                    cy="25"
                    r="20"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    className="stroke-amber-500"
                    cx="25"
                    cy="25"
                    r="20"
                    strokeWidth="4"
                    strokeDasharray="90, 150"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-amber-600">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-700 font-mono">
                Menyiapkan QRIS Dinamis...
              </span>
            </div>
          ) : qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QRIS ${merchantName} ${invoiceNumber}`}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <span className="text-xs text-rose-500 font-mono">Gagal membuat QR</span>
          )}
        </div>

        {/* Fixed Nominal Amount Badge */}
        <div className="w-full bg-slate-100 rounded-xl p-2.5 text-center mt-1 border border-slate-200">
          <div className="text-[9px] uppercase font-mono font-bold text-slate-500">
            Nominal Tagihan Pas
          </div>
          <div className="text-sm font-extrabold text-rose-600 font-mono mt-0.5">
            {formatRupiah(amount)}
          </div>
          <div className="text-[8px] text-emerald-700 font-semibold mt-0.5">
            ✓ Bebas Biaya Admin · Otomatis Terkunci
          </div>
        </div>

        {/* Card Action Buttons (Download & Copy) */}
        <div className="w-full flex items-center gap-1.5 pt-3 print:hidden">
          <button
            type="button"
            onClick={handleDownloadQR}
            disabled={isLoading || !qrDataUrl}
            className="flex-1 py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
            title="Unduh QRIS untuk discan di HP"
          >
            <Download className="w-3 h-3 text-amber-400" />
            <span>Unduh QR</span>
          </button>

          <button
            type="button"
            onClick={handleCopyPayload}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold border border-slate-200 transition-colors cursor-pointer"
            title="Salin data mentah EMVCo"
          >
            {copiedPayload ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Right Column: Instructions, Supported Apps & Instant Verification */}
      {showInstructions && (
        <div className="flex-1 space-y-4 text-xs text-slate-300 print:text-gray-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                OTOMATIS DIBUAT SISTEM
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Dynamic QRIS v2.0
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-1 print:text-black">
              Cara Pembayaran Otomatis dengan QRIS:
            </h4>
          </div>

          <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed print:text-gray-800 text-xs">
            <li>
              Buka aplikasi m-Banking atau dompet digital kesayangan Anda:
              <div className="flex flex-wrap gap-1 mt-1 text-[10px] font-mono print:hidden">
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-blue-300">BCA Mobile</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300">Livin Mandiri</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-sky-300">BRImo</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-teal-300">BNI Mobile</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-300">GoPay</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-purple-300">OVO</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-blue-300">Dana</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-orange-300">ShopeePay</span>
              </div>
            </li>
            <li>Pilih menu <strong>Scan / Bayar QRIS</strong> di aplikasi Anda.</li>
            <li>Arahkan kamera smartphone ke kode QRIS di samping.</li>
            <li>
              Pastikan nama merchant: <strong className="text-white print:text-black">{merchantName}</strong>.
            </li>
            <li>
              Nominal <strong className="text-amber-400 font-mono print:text-black">{formatRupiah(amount)}</strong> otomatis terisi tanpa perlu mengetik manual.
            </li>
            <li>Masukkan PIN Anda untuk menyelesaikan transaksi.</li>
          </ol>

          {/* Instant Verification Trigger Button for Customer / Owner */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 print:hidden">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verifikasi Transaksi QRIS:</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {isPaid ? 'Status: LUNAS' : 'Menunggu Scan'}
              </span>
            </div>

            {isPaid ? (
              <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Pembayaran QRIS Berhasil Diverifikasi! Nota Telah Lunas.</span>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <button
                  type="button"
                  onClick={handleSimulateVerification}
                  disabled={isVerifying}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Memeriksa Mutasi QRIS...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                      <span>Cek Status / Saya Sudah Bayar</span>
                    </>
                  )}
                </button>

                <span className="text-[11px] text-slate-400 text-center sm:text-left">
                  Sistem otomatis mengubah status nota menjadi <strong>LUNAS</strong> dan meneruskan order ke meja teknisi QC.
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
