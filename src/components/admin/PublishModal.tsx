import React, { useState } from 'react';
import { useSiteData } from '../../context/SiteContext';
import {
  Globe,
  X,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Eye,
  ShieldCheck,
  Store,
  Sparkles,
  QrCode,
  Smartphone,
  Laptop,
} from 'lucide-react';

export const PublishModal: React.FC = () => {
  const {
    isPublishModalOpen,
    closePublishModal,
    setAdminMode,
    publishWebsite,
    showToast,
    settings,
  } = useSiteData();
  const [copied, setCopied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  if (!isPublishModalOpen) return null;

  // Official Shared / Customer App URL
  const baseUrl =
    typeof window !== 'undefined' && window.location.origin.includes('ais-dev-')
      ? window.location.origin.replace('ais-dev-', 'ais-pre-')
      : typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-uttftlvp4q4wz52om75xvl-856920586610.asia-east1.run.app';

  const customerFriendlyUrl = `${baseUrl}${typeof window !== 'undefined' ? window.location.pathname : '/'}?role=customer`;

  const handleCopyLink = (urlToCopy: string) => {
    navigator.clipboard.writeText(urlToCopy);
    setCopied(true);
    showToast('Link publik toko berhasil disalin ke clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Halo! Kunjungi katalog resmi sparepart laptop Kevin 88 Computer terlengkap dan bergaransi tukar baru: ${customerFriendlyUrl}\n\nTersedia baterai, charger, keyboard, LCD/LED, RAM, SSD, dan fan laptop.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handlePublishNow = async () => {
    setIsPublishing(true);
    try {
      await publishWebsite();
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSwitchToCustomerView = () => {
    setAdminMode(false);
    closePublishModal();
    showToast('Beralih ke Tampilan Customer. Semua tombol edit & builder disembunyikan!', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn my-6">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Publikasikan Website ke Customer
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                  ONLINE & SIAP DILIHAT
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Bagikan link resmi toko kepada pelanggan, pembeli online, teknisi, dan mitra servis
              </p>
            </div>
          </div>

          <button
            onClick={closePublishModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Main Action: Publish and Switch to Customer Mode */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-950 border-2 border-emerald-500/70 shadow-xl shadow-emerald-950/50 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <h4 className="font-extrabold text-white text-sm sm:text-base tracking-tight">
                    Publikasikan Hasil Editan ke Customer
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                    Live Publish
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Simpan permanen seluruh editan Anda (logo, teks, banner, tema warna, katalog produk, harga, dan cabang) lalu beralih otomatis ke <strong>Tampilan Customer</strong> yang bersih.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={isPublishing}
              onClick={handlePublishNow}
              className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:scale-[1.01] active:scale-95 disabled:opacity-50"
            >
              {isPublishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Menyimpan & Mempublikasikan Perubahan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 stroke-[2.5]" />
                  <span>Publikasikan Sekarang & Beralih ke Tampilan Customer</span>
                </>
              )}
            </button>
          </div>

          {/* Status Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Website Anda Sudah Siap Dilihat Pelanggan!</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Toko <strong>{settings.branding?.brandName} {settings.branding?.brandHighlight}</strong> telah aktif. Ketika customer membuka link publik di bawah, mereka akan melihat toko yang bersih, profesional, dan <strong>tanpa tombol edit / garis putus-putus Odoo</strong>.
              </p>
            </div>
          </div>

          {/* URL Sharing Box */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-emerald-400" />
              <span>Link Publik Toko untuk Customer / Pelanggan:</span>
            </label>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl font-mono text-xs text-emerald-400 select-all overflow-x-auto truncate">
                {customerFriendlyUrl}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyLink(customerFriendlyUrl)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                    copied
                      ? 'bg-emerald-400 text-slate-950'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Salin Link</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold border border-emerald-500/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Bagikan link ke WhatsApp"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share WA</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Cards: Preview as Customer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>Lihat Tampilan Customer (Live)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                  Uji tampilan toko bersih tanpa toolbar admin. Anda dapat kembali ke Mode Edit kapan saja dengan mengklik tombol di footer bawah.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSwitchToCustomerView}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Masuk Tampilan Pengunjung</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Buka di HP / Scan QR Code</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                  Coba buka link toko langsung di browser smartphone Anda untuk melihat kecepatan responsif dan pengalaman belanja pelanggan.
                </p>
              </div>

              <a
                href={customerFriendlyUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                <span>Buka di Tab Baru</span>
              </a>
            </div>
          </div>

          {/* Quick Explanation for Kevin as Owner */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Petunjuk untuk Anda sebagai Pemilik Toko:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1 leading-relaxed">
              <li>
                <strong>Pelanggan Umum:</strong> Cukup berikan link di atas. Pelanggan langsung bisa mencari sparepart, cek kompatibilitas, checkout, dan mendapatkan nota otomatis.
              </li>
              <li>
                <strong>Kembali ke Mode Edit:</strong> Jika Anda sedang dalam mode customer, tekan tombol pintasan <strong>Ctrl + Shift + O</strong> (atau tambahkan <code>?admin=true</code> pada URL) untuk mengaktifkan kembali toolbar builder toko.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Kevin 88 Computer · Solusi Sparepart Laptop Sejak 2014
          </span>

          <button
            onClick={closePublishModal}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
