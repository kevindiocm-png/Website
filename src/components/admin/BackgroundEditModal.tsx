import React, { useState, useEffect } from 'react';
import { useSiteData } from '../../context/SiteContext';
import {
  Palette,
  X,
  Check,
  RotateCcw,
  Sparkles,
  Sun,
  Moon,
  Monitor,
  Eye,
  Sliders,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import {
  THEME_BACKGROUND_PRESETS,
  getContrastTextColor,
  adjustBrightness,
} from '../../utils/theme';
import { BackgroundMode } from '../../types';

export const BackgroundEditModal: React.FC = () => {
  const {
    isBackgroundModalOpen,
    closeBackgroundModal,
    settings,
    updateTheme,
    showToast,
  } = useSiteData();

  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('dark');
  const [customBgColor, setCustomBgColor] = useState('#020617');
  const [customCardColor, setCustomCardColor] = useState('#0f172a');
  const [customTextColor, setCustomTextColor] = useState('#ffffff');
  const [navbarBgColor, setNavbarBgColor] = useState('rgba(2, 6, 23, 0.95)');
  const [highContrastMode, setHighContrastMode] = useState(false);

  useEffect(() => {
    if (settings?.theme) {
      const mode = settings.theme.backgroundMode || 'dark';
      setBackgroundMode(mode);
      setCustomBgColor(settings.theme.customBgColor || '#020617');
      setCustomCardColor(settings.theme.customCardColor || '#0f172a');
      setCustomTextColor(settings.theme.customTextColor || '#ffffff');
      setNavbarBgColor(settings.theme.navbarBgColor || 'rgba(2, 6, 23, 0.95)');
      setHighContrastMode(Boolean(settings.theme.highContrastMode));
    }
  }, [settings, isBackgroundModalOpen]);

  if (!isBackgroundModalOpen) return null;

  // Apply preset
  const handleSelectPreset = (preset: typeof THEME_BACKGROUND_PRESETS[number]) => {
    setBackgroundMode(preset.id);
    setCustomBgColor(preset.bg);
    setCustomCardColor(preset.card);
    setCustomTextColor(preset.text);
    setNavbarBgColor(preset.navbar);

    updateTheme({
      backgroundMode: preset.id,
      customBgColor: preset.bg,
      customCardColor: preset.card,
      customTextColor: preset.text,
      navbarBgColor: preset.navbar,
    });
    showToast(`Warna background diubah ke: ${preset.name}`, 'success');
  };

  // Custom Page Background Change
  const handleBgColorChange = (hex: string) => {
    setCustomBgColor(hex);
    setBackgroundMode('custom');

    // Auto-calculate suggested card surface and text colors for harmony
    const isDark = getContrastTextColor(hex) === '#ffffff';
    const autoCard = isDark ? adjustBrightness(hex, 12) : adjustBrightness(hex, -5);
    const autoText = isDark ? '#ffffff' : '#0f172a';
    const autoNavbar = hex;

    setCustomCardColor(autoCard);
    setCustomTextColor(autoText);

    updateTheme({
      backgroundMode: 'custom',
      customBgColor: hex,
      customCardColor: autoCard,
      customTextColor: autoText,
      navbarBgColor: autoNavbar,
    });
  };

  // Custom Card Surface Change
  const handleCardColorChange = (hex: string) => {
    setCustomCardColor(hex);
    setBackgroundMode('custom');
    updateTheme({
      backgroundMode: 'custom',
      customCardColor: hex,
    });
  };

  // Custom Text Color Change
  const handleTextColorChange = (hex: string) => {
    setCustomTextColor(hex);
    updateTheme({
      customTextColor: hex,
    });
  };

  // Custom Navbar Color Change
  const handleNavbarColorChange = (hex: string) => {
    setNavbarBgColor(hex);
    updateTheme({
      navbarBgColor: hex,
    });
  };

  // Fitur Ratakan Semua Seksi & Background: Meratakan warna seluruh website agar 100% rata & seragam
  const handleRatakanBackground = () => {
    const isDark = getContrastTextColor(customBgColor) === '#ffffff';
    const autoCard = isDark ? adjustBrightness(customBgColor, 10) : adjustBrightness(customBgColor, -4);
    const autoText = isDark ? '#ffffff' : '#0f172a';
    const autoNavbar = customBgColor;

    setCustomCardColor(autoCard);
    setCustomTextColor(autoText);
    setNavbarBgColor(autoNavbar);

    updateTheme({
      backgroundMode: 'custom',
      customBgColor,
      customCardColor: autoCard,
      customTextColor: autoText,
      navbarBgColor: autoNavbar,
    });
    showToast('Background seluruh seksi website berhasil diratakan 100% seragam!', 'success');
  };

  // Reset to Kevin 88 Official Default
  const handleResetToDefault = () => {
    const defaultPreset = THEME_BACKGROUND_PRESETS[0];
    handleSelectPreset(defaultPreset);
    setHighContrastMode(false);
    updateTheme({
      highContrastMode: false,
    });
    showToast('Background dikembalikan ke warna resmi bawaan Kevin 88', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-fadeIn my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Kustomisasi Warna Background & Latar Website
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  LIVE PREVIEW
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Pilih palet tema latar belakang siap pakai atau gunakan kode warna HEX bebas
              </p>
            </div>
          </div>

          <button
            onClick={closeBackgroundModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
          {/* 1. Live Interactive Visual Canvas Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Monitor className="w-4 h-4 text-amber-400" />
                <span>Pratinjau Langsung Warna Latar:</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Halaman: <strong className="text-amber-400">{customBgColor.toUpperCase()}</strong> · Kartu:{' '}
                <strong className="text-amber-400">{customCardColor.toUpperCase()}</strong>
              </span>
            </div>

            <div
              className="p-4 sm:p-5 rounded-2xl border transition-all shadow-xl space-y-3"
              style={{
                backgroundColor: customBgColor,
                color: customTextColor,
                borderColor: highContrastMode ? '#ffffff' : 'rgba(255,255,255,0.15)',
              }}
            >
              {/* Mini Topbar Mock */}
              <div
                className="p-2.5 rounded-xl flex items-center justify-between border"
                style={{
                  backgroundColor: navbarBgColor,
                  borderColor: 'rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black">
                    88
                  </span>
                  <span>Kevin 88 Computer</span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="opacity-80">Katalog</span>
                  <span className="opacity-80">Cek Kompatibilitas</span>
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold">
                    Keranjang
                  </span>
                </div>
              </div>

              {/* Mini Card & Typography Mock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div
                  className="p-3.5 rounded-xl border space-y-1.5"
                  style={{
                    backgroundColor: customCardColor,
                    borderColor: 'rgba(255,255,255,0.12)',
                  }}
                >
                  <div className="text-[10px] font-mono uppercase opacity-75 font-semibold">
                    Contoh Kartu Produk
                  </div>
                  <div className="text-sm font-bold">Baterai Asus Vivobook A412</div>
                  <div className="text-xs font-mono font-bold text-amber-400">Rp 385.000</div>
                  <div className="text-[11px] opacity-75 line-clamp-1">
                    Garansi 3 Bulan Tukar Baru · Segel Resmi Toko
                  </div>
                </div>

                <div
                  className="p-3.5 rounded-xl border flex flex-col justify-between"
                  style={{
                    backgroundColor: customCardColor,
                    borderColor: 'rgba(255,255,255,0.12)',
                  }}
                >
                  <div>
                    <div className="text-[10px] font-mono uppercase opacity-75 font-semibold">
                      Uji Keterbacaan Teks
                    </div>
                    <div className="text-xs font-semibold mt-1">
                      Semua teks diatur agar kontras & nyaman dibaca
                    </div>
                  </div>
                  <div className="pt-2 flex items-center gap-2 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                      ✓ Kontras Sempurna
                    </span>
                    <span className="opacity-75">WCAG AA Standard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fitur Ratakan Background Seluruh Seksi */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-indigo-950/70 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Fitur Ratakan Background Website (Semua Seksi Rata & Seragam)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Menyelaraskan warna latar belakang di seluruh website (Hero, Kompatibilitas, Katalog, Tentang Kami, Teknisi, Cabang, FAQ, dan Footer) agar 100% rata, satu warna seragam tanpa belang-belang, dengan kartu produk yang mengapung rapi.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRatakanBackground}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all cursor-pointer shadow-md shrink-0 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Ratakan Background Sekarang</span>
            </button>
          </div>

          {/* 2. High Contrast Quick Booster */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Mode Kontras Tinggi (Menajamkan Teks)</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Menebalkan kontras teks dan garis batas sehingga semua tulisan 100% tampak terang dan
                tidak tenggelam pada layar Anda.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const next = !highContrastMode;
                setHighContrastMode(next);
                updateTheme({ highContrastMode: next });
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shrink-0 ${
                highContrastMode
                  ? 'bg-emerald-400 text-slate-950 ring-2 ring-emerald-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {highContrastMode ? '✓ KONTRAS TINGGI ON' : 'Aktifkan Kontras'}
            </button>
          </div>

          {/* 3. Preset Pilihan Warna Background Populer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Pilihan Preset Warna Background Populer:</span>
              </label>
              <span className="text-[11px] text-slate-400">Klik untuk langsung terapkan</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {THEME_BACKGROUND_PRESETS.map((preset) => {
                const isSelected = backgroundMode === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer group ${
                      isSelected
                        ? 'border-amber-400 bg-slate-800/90 ring-2 ring-amber-400/40 shadow-lg'
                        : 'border-slate-800 bg-slate-950/80 hover:bg-slate-800/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        {/* Swatch circle */}
                        <span
                          className="w-4 h-4 rounded-full border border-slate-700 shadow-sm shrink-0"
                          style={{ backgroundColor: preset.bg }}
                        />
                        <span
                          className="w-3 h-3 rounded-full border border-slate-700 shadow-sm shrink-0 -ml-2"
                          style={{ backgroundColor: preset.card }}
                        />
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-white truncate">{preset.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {preset.bg}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Pemilih Warna Bebas (Custom Color Picker & HEX Input) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Atur Warna HEX Bebas (Color Picker & Keyboard):</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Pilih warna apapun menggunakan palet warna atau ketik kode HEX
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Field 1: Warna Latar Halaman */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-white">Latar Halaman</div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase">
                    {customBgColor}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customBgColor.startsWith('#') ? customBgColor : '#020617'}
                    onChange={(e) => handleBgColorChange(e.target.value)}
                    className="w-9 h-9 rounded-lg cursor-pointer border border-slate-700 bg-transparent p-0 shrink-0"
                    title="Buka palet warna untuk latar halaman"
                  />
                  <input
                    type="text"
                    value={customBgColor}
                    onChange={(e) => handleBgColorChange(e.target.value)}
                    maxLength={7}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white uppercase focus:outline-none focus:border-amber-400"
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Background utama website
                </p>
              </div>

              {/* Field 2: Warna Kartu / Kontainer */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-white">Latar Kartu / Box</div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase">
                    {customCardColor}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customCardColor.startsWith('#') ? customCardColor : '#0f172a'}
                    onChange={(e) => handleCardColorChange(e.target.value)}
                    className="w-9 h-9 rounded-lg cursor-pointer border border-slate-700 bg-transparent p-0 shrink-0"
                    title="Buka palet warna untuk kartu produk"
                  />
                  <input
                    type="text"
                    value={customCardColor}
                    onChange={(e) => handleCardColorChange(e.target.value)}
                    maxLength={7}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white uppercase focus:outline-none focus:border-amber-400"
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Permukaan kotak & katalog
                </p>
              </div>

              {/* Field 3: Warna Header / Navbar */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-white">Bilah Menu (Navbar)</div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase truncate max-w-[80px]">
                    {navbarBgColor}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={navbarBgColor.startsWith('#') ? navbarBgColor : '#020617'}
                    onChange={(e) => handleNavbarColorChange(e.target.value)}
                    className="w-9 h-9 rounded-lg cursor-pointer border border-slate-700 bg-transparent p-0 shrink-0"
                    title="Buka palet warna untuk header navbar"
                  />
                  <input
                    type="text"
                    value={navbarBgColor}
                    onChange={(e) => handleNavbarColorChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Background bilah atas
                </p>
              </div>

              {/* Field 4: Warna Teks Utama */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-white">Teks Utama</div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase">
                    {customTextColor}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customTextColor.startsWith('#') ? customTextColor : '#ffffff'}
                    onChange={(e) => handleTextColorChange(e.target.value)}
                    className="w-9 h-9 rounded-lg cursor-pointer border border-slate-700 bg-transparent p-0 shrink-0"
                    title="Buka palet warna teks utama"
                  />
                  <input
                    type="text"
                    value={customTextColor}
                    onChange={(e) => handleTextColorChange(e.target.value)}
                    maxLength={7}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white uppercase focus:outline-none focus:border-amber-400"
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Warna teks dan judul
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset ke Bawaan Toko</span>
          </button>

          <button
            type="button"
            onClick={() => {
              closeBackgroundModal();
              showToast('Perubahan warna background berhasil disimpan!', 'success');
            }}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-400/20"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Selesai & Simpan Warna</span>
          </button>
        </div>
      </div>
    </div>
  );
};
