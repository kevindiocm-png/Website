import React, { useState, useEffect, useRef } from 'react';
import { useSiteData } from '../../context/SiteContext';
import { X, Check, Upload, Image as ImageIcon, Sparkles, RefreshCw } from 'lucide-react';

export const BrandingEditModal: React.FC = () => {
  const { isBrandingModalOpen, closeBrandingModal, settings, updateBranding, updateTheme } = useSiteData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    logoMode: 'both' as 'image' | 'badge' | 'both',
    logoImageUrl: '/assets/images/kevin88_logo.jpg',
    badgeText: '',
    brandName: 'Kevin 88',
    brandHighlight: 'Computer',
    brandNameColor: '#ffffff',
    brandHighlightColor: '#f59e0b',
    navbarBgColor: 'rgba(2, 6, 23, 0.95)',
    tagline: 'Spesialis Sparepart Laptop Sejak 2014',
  });

  useEffect(() => {
    if (settings?.branding) {
      setFormData({
        logoMode: settings.branding.logoMode || 'both',
        logoImageUrl: settings.branding.logoImageUrl || '/assets/images/kevin88_logo.jpg',
        badgeText: settings.branding.badgeText || '',
        brandName: settings.branding.brandName || 'Kevin 88',
        brandHighlight: settings.branding.brandHighlight || 'Computer',
        brandNameColor: settings.branding.brandNameColor || settings.theme?.brandNameColor || '#ffffff',
        brandHighlightColor:
          settings.branding.brandHighlightColor ||
          settings.theme?.highlightColor ||
          '#f59e0b',
        navbarBgColor: settings.branding.navbarBgColor || settings.theme?.navbarBgColor || 'rgba(2, 6, 23, 0.95)',
        tagline: settings.branding.tagline || 'Spesialis Sparepart Laptop Sejak 2014',
      });
    }
  }, [settings, isBrandingModalOpen]);

  if (!isBrandingModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file to base64 Data URL for instant live rendering and persistence
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setFormData((prev) => ({
          ...prev,
          logoImageUrl: dataUrl,
          logoMode: prev.logoMode === 'badge' ? 'both' : prev.logoMode,
        }));
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBranding(formData);
    updateTheme({
      brandNameColor: formData.brandNameColor,
      navbarBgColor: formData.navbarBgColor,
      highlightColor: formData.brandHighlightColor,
    });
    closeBrandingModal();
  };

  const presetLogos = [
    {
      name: 'Logo Resmi Kevin 88 (Microchip 88)',
      url: '/assets/images/kevin88_logo.jpg',
    },
    {
      name: 'Logo Spareparts Gold',
      url: '/assets/images/hero_laptop_spareparts_1790149123693.jpg',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm shadow-md">
              🎨
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">
                Edit Logo & Identitas Brand Toko
              </h3>
              <p className="text-xs text-slate-400">
                Ubah gambar logo, tulisan merk, badge 88, dan slogan toko secara instan.
              </p>
            </div>
          </div>
          <button
            onClick={closeBrandingModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Box */}
        <div className="px-6 py-4 bg-slate-950/70 border-b border-slate-800/80">
          <div className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
            Pratinjau Tampilan Header Navbar Saat Ini:
          </div>
          <div
            className="p-3.5 border border-slate-700/80 rounded-xl flex items-center justify-between shadow-md transition-colors"
            style={{ backgroundColor: formData.navbarBgColor || 'rgba(2, 6, 23, 0.95)' }}
          >
            <div className="flex items-center gap-3">
              {formData.logoImageUrl && (
                <img
                  src={formData.logoImageUrl}
                  alt="Logo Preview"
                  className="w-9 h-9 rounded-lg object-contain border border-slate-700 shadow-sm bg-white p-0.5"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              )}
              {formData.logoMode !== 'image' && (
                <div className="text-base font-extrabold flex items-center gap-1.5">
                  <span
                    style={{
                      color: formData.brandNameColor || '#ffffff',
                      textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                    }}
                  >
                    {formData.brandName || 'Kevin 88'}
                  </span>
                  <span
                    style={{
                      color: formData.brandHighlightColor || '#f59e0b',
                      textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                    }}
                  >
                    {formData.brandHighlight || 'Computer'}
                  </span>
                </div>
              )}
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
              Live Preview
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* Logo Mode Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-2">
              Gaya Tampilan di Navbar
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, logoMode: 'both' })}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                  formData.logoMode === 'both'
                    ? 'border-amber-400 bg-amber-400/15 text-amber-300 font-bold'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                Gambar Logo + Nama Toko
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, logoMode: 'image' })}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                  formData.logoMode === 'image'
                    ? 'border-amber-400 bg-amber-400/15 text-amber-300 font-bold'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                Hanya Gambar Logo
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, logoMode: 'badge' })}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                  formData.logoMode === 'badge'
                    ? 'border-amber-400 bg-amber-400/15 text-amber-300 font-bold'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                Hanya Teks Nama Toko
              </button>
            </div>
          </div>

          {/* Logo Image Upload / URL */}
          <div className="space-y-2 p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Upload Logo Toko Baru</span>
              </label>
              <span className="text-[11px] text-slate-400">PNG / JPG / WEBP</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                id="brand-logo-file-input"
                className="hidden"
              />
              <label
                htmlFor="brand-logo-file-input"
                className="flex-1 py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Pilih Foto Logo dari Laptop / HP</span>
              </label>
            </div>

            {/* Presets */}
            <div className="pt-2">
              <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                Atau pilih preset logo:
              </span>
              <div className="flex flex-wrap gap-2">
                {presetLogos.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, logoImageUrl: p.url })}
                    className="text-[11px] px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-1">
              <input
                type="text"
                value={formData.logoImageUrl}
                onChange={(e) => setFormData({ ...formData, logoImageUrl: e.target.value })}
                placeholder="Atau tempel URL gambar logo (https://...)"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-white placeholder-slate-500 font-mono"
              />
            </div>
          </div>

          {/* Brand Name & Highlight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Nama Utama Toko
              </label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                placeholder="Kevin 88"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-400 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Teks Highlight Merk
              </label>
              <input
                type="text"
                value={formData.brandHighlight}
                onChange={(e) => setFormData({ ...formData, brandHighlight: e.target.value })}
                placeholder="Computer"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-bold focus:border-amber-400"
                style={{ color: formData.brandHighlightColor }}
              />
            </div>
          </div>

          {/* Brand Name & Highlight Text Colors */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Pewarnaan Teks & Latar Header Toko (Agar Selalu Kontras & Terlihat Jelas)
            </div>

            {/* Brand Name Color */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={formData.brandNameColor || '#ffffff'}
                  onChange={(e) => setFormData({ ...formData, brandNameColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-700 bg-transparent p-0"
                  title="Pilih warna teks nama toko"
                />
                <div>
                  <div className="text-xs font-semibold text-white">Warna Teks Nama Toko (Kevin 88)</div>
                  <div className="text-[10px] text-slate-400">Pastikan kontras dengan latar navbar</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {['#ffffff', '#f8fafc', '#f59e0b', '#38bdf8', '#34d399', '#f87171', '#c084fc'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, brandNameColor: c })}
                    className="w-5 h-5 rounded-full border border-slate-700 hover:scale-110 transition-transform cursor-pointer"
                    style={{ backgroundColor: c }}
                  />
                ))}
                <input
                  type="text"
                  value={formData.brandNameColor || '#ffffff'}
                  onChange={(e) => setFormData({ ...formData, brandNameColor: e.target.value })}
                  maxLength={7}
                  className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-white text-center uppercase"
                />
              </div>
            </div>

            {/* Brand Highlight Color */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={formData.brandHighlightColor || '#f59e0b'}
                  onChange={(e) => setFormData({ ...formData, brandHighlightColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-700 bg-transparent p-0"
                  title="Pilih warna teks highlight merk"
                />
                <div>
                  <div className="text-xs font-semibold text-white">Warna Highlight Merk (Computer)</div>
                  <div className="text-[10px] text-slate-400">Pewarnaan kata aksen</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {['#f59e0b', '#06b6d4', '#10b981', '#ef4444', '#8b5cf6', '#ffffff'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, brandHighlightColor: c })}
                    className="w-5 h-5 rounded-full border border-slate-700 hover:scale-110 transition-transform cursor-pointer"
                    style={{ backgroundColor: c }}
                  />
                ))}
                <input
                  type="text"
                  value={formData.brandHighlightColor || '#f59e0b'}
                  onChange={(e) => setFormData({ ...formData, brandHighlightColor: e.target.value })}
                  maxLength={7}
                  className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-white text-center uppercase"
                />
              </div>
            </div>

            {/* Navbar Background Color */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-slate-900 border border-slate-800 rounded-lg">
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={formData.navbarBgColor || '#020617'}
                  onChange={(e) => setFormData({ ...formData, navbarBgColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-700 bg-transparent p-0"
                  title="Pilih warna latar navbar header"
                />
                <div>
                  <div className="text-xs font-semibold text-white">Warna Latar Navbar / Header</div>
                  <div className="text-[10px] text-slate-400">Ubah warna bilah menu atas</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {[
                  { name: 'Dark Navy', color: '#020617' },
                  { name: 'Hitam OLED', color: '#000000' },
                  { name: 'Midnight', color: '#081329' },
                  { name: 'Slate', color: '#0f172a' },
                  { name: 'Light White', color: '#ffffff' },
                ].map((item) => (
                  <button
                    key={item.color}
                    type="button"
                    onClick={() => setFormData({ ...formData, navbarBgColor: item.color })}
                    title={item.name}
                    className="w-5 h-5 rounded-full border border-slate-700 hover:scale-110 transition-transform cursor-pointer shadow-xs"
                    style={{ backgroundColor: item.color }}
                  />
                ))}
                <input
                  type="text"
                  value={formData.navbarBgColor || '#020617'}
                  onChange={(e) => setFormData({ ...formData, navbarBgColor: e.target.value })}
                  maxLength={7}
                  className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-white text-center uppercase"
                />
              </div>
            </div>
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Slogan / Tagline Toko
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Spesialis Sparepart Laptop Sejak 2014"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-400"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={closeBrandingModal}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-400/20"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Logo & Nama Toko</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
