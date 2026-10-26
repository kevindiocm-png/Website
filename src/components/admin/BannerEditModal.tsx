import React, { useState, useEffect } from 'react';
import { useSiteData } from '../../context/SiteContext';
import { X, Check, Megaphone, Palette } from 'lucide-react';

export const BannerEditModal: React.FC = () => {
  const { isBannerModalOpen, closeBannerModal, settings, updateAnnouncement } = useSiteData();

  const [text, setText] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [bgColor, setBgColor] = useState('#f59e0b');
  const [textColor, setTextColor] = useState('#020617');
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (settings?.announcement) {
      setText(settings.announcement.text || '');
      setBadgeText(settings.announcement.badgeText || 'PENGUMUMAN TOKO');
      setBgColor(settings.announcement.bgColor || '#f59e0b');
      setTextColor(settings.announcement.textColor || '#020617');
      setEnabled(settings.announcement.enabled ?? true);
    }
  }, [settings, isBannerModalOpen]);

  if (!isBannerModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAnnouncement(text, enabled, bgColor, textColor);
    closeBannerModal();
  };

  const quickPresets = [
    'Spesialis Sparepart Laptop Sejak 2014 · Siap Kirim Seluruh Indonesia · Konsultasi Kompatibilitas Gratis',
    '🎉 PROMO BULAN INI: Gratis Pengecekan & Pasang Baterai di Semua Cabang Semarang, Solo, Madiun & Jogja!',
    '⚡ READY STOCK: Baterai Original Asus & Lenovo, Garansi 6 Bulan Tukar Baru Langsung!',
    '🚚 Kirim Hari Ini: Pengiriman Cepat J&T, JNE, SiCepat ke Seluruh Indonesia dengan Packing Aman Berlapis Bubble!',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Megaphone className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">
                Edit Banner Pengumuman & Warna
              </h3>
              <p className="text-xs text-slate-400">
                Ubah teks pengumuman, badge, dan warna latar banner di bagian paling atas.
              </p>
            </div>
          </div>
          <button
            onClick={closeBannerModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Badge & Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Teks Badge / Label Kiri
              </label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="PENGUMUMAN TOKO"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>Warna Latar Banner</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border border-slate-700 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white font-mono uppercase"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1.5">
              Isi Teks Pengumuman Banner
            </label>
            <textarea
              rows={3}
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tuliskan pengumuman diskon, informasi toko, atau layanan..."
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Live Mini Preview */}
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 font-semibold">Pratinjau Banner:</span>
            <div
              className="p-2.5 rounded-lg text-xs font-medium flex items-center gap-2 shadow-inner"
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/20 uppercase">
                {badgeText || 'PENGUMUMAN'}
              </span>
              <span className="truncate">{text || 'Teks pengumuman banner...'}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 font-semibold">
              Pilihan Contoh Teks Cepat:
            </span>
            <div className="space-y-1.5">
              {quickPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setText(preset)}
                  className="w-full text-left text-[11px] p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-400/50 text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  "{preset}"
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-xs text-slate-300">
                Tampilkan banner pengumuman ini di website
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={closeBannerModal}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-400/20"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Pengumuman</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
