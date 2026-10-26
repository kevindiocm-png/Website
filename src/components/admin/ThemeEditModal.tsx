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
  Type,
  Maximize2,
  Highlighter,
  Eye,
} from 'lucide-react';
import {
  THEME_COLOR_PRESETS,
  THEME_HIGHLIGHT_PRESETS,
  THEME_BACKGROUND_PRESETS,
  HIGHLIGHT_STYLES,
  getContrastTextColor,
  adjustBrightness,
} from '../../utils/theme';
import {
  ThemeColorPreset,
  BackgroundMode,
  FontFamilyOption,
  CornerRadius,
  HighlightStyleOption,
} from '../../types';

export const ThemeEditModal: React.FC = () => {
  const { isThemeModalOpen, closeThemeModal, settings, updateTheme, showToast } = useSiteData();

  const [colorPreset, setColorPreset] = useState<ThemeColorPreset>('amber');
  const [primaryColor, setPrimaryColor] = useState('#f59e0b');
  const [primaryHoverColor, setPrimaryHoverColor] = useState('#fbbf24');
  const [highlightColor, setHighlightColor] = useState('#f59e0b');
  const [highlightSecondaryColor, setHighlightSecondaryColor] = useState('#fbbf24');
  const [highlightStyle, setHighlightStyle] = useState<HighlightStyleOption>('gradient');
  const [brandNameColor, setBrandNameColor] = useState('#ffffff');
  const [navbarBgColor, setNavbarBgColor] = useState('#020617');
  const [customBgColor, setCustomBgColor] = useState('#020617');
  const [customCardColor, setCustomCardColor] = useState('#0f172a');
  const [customTextColor, setCustomTextColor] = useState('#ffffff');
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('dark');
  const [fontFamily, setFontFamily] = useState<FontFamilyOption>('sans');
  const [borderRadius, setBorderRadius] = useState<CornerRadius>('medium');

  useEffect(() => {
    if (settings?.theme) {
      setColorPreset(settings.theme.colorPreset || 'amber');
      setPrimaryColor(settings.theme.primaryColor || '#f59e0b');
      setPrimaryHoverColor(settings.theme.primaryHoverColor || '#fbbf24');
      setHighlightColor(settings.theme.highlightColor || settings.theme.primaryColor || '#f59e0b');
      setHighlightSecondaryColor(settings.theme.highlightSecondaryColor || '#fbbf24');
      setHighlightStyle(settings.theme.highlightStyle || 'gradient');
      setBrandNameColor(settings.theme.brandNameColor || settings.branding?.brandNameColor || '#ffffff');
      setNavbarBgColor(settings.theme.navbarBgColor || settings.branding?.navbarBgColor || '#020617');
      setBackgroundMode(settings.theme.backgroundMode || 'dark');
      setFontFamily(settings.theme.fontFamily || 'sans');
      setBorderRadius(settings.theme.borderRadius || 'medium');
      setCustomBgColor(settings.theme.customBgColor || '#020617');
      setCustomCardColor(settings.theme.customCardColor || '#0f172a');
      setCustomTextColor(settings.theme.customTextColor || '#ffffff');
      setHighContrastMode(Boolean(settings.theme.highContrastMode));
    }
  }, [settings, isThemeModalOpen]);

  if (!isThemeModalOpen) return null;

  const handleSelectPreset = (presetId: ThemeColorPreset) => {
    setColorPreset(presetId);
    const found = THEME_COLOR_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setPrimaryColor(found.primary);
      setPrimaryHoverColor(found.hover);
      setHighlightColor(found.primary);
      setHighlightSecondaryColor(found.hover);
      // Instant real-time preview
      updateTheme({
        colorPreset: presetId,
        primaryColor: found.primary,
        primaryHoverColor: found.hover,
        primaryTextColor: found.textOnPrimary,
        highlightColor: found.primary,
        highlightSecondaryColor: found.hover,
        highlightStyle,
        backgroundMode,
        fontFamily,
        borderRadius,
      });
    }
  };

  const handleCustomColorChange = (hex: string) => {
    setColorPreset('custom');
    setPrimaryColor(hex);
    const hover = adjustBrightness(hex, 20);
    setPrimaryHoverColor(hover);
    const textColor = getContrastTextColor(hex);
    // Instant real-time preview
    updateTheme({
      colorPreset: 'custom',
      primaryColor: hex,
      primaryHoverColor: hover,
      primaryTextColor: textColor,
      highlightColor,
      highlightSecondaryColor,
      highlightStyle,
      backgroundMode,
      fontFamily,
      borderRadius,
    });
  };

  const handleSelectHighlightPreset = (color: string, secondary: string) => {
    setHighlightColor(color);
    setHighlightSecondaryColor(secondary);
    updateTheme({
      highlightColor: color,
      highlightSecondaryColor: secondary,
      highlightStyle,
    });
  };

  const handleCustomHighlightChange = (hex: string) => {
    setHighlightColor(hex);
    const secondary = adjustBrightness(hex, 20);
    setHighlightSecondaryColor(secondary);
    updateTheme({
      highlightColor: hex,
      highlightSecondaryColor: secondary,
      highlightStyle,
    });
  };

  const handleHighlightStyleChange = (style: HighlightStyleOption) => {
    setHighlightStyle(style);
    updateTheme({
      highlightStyle: style,
      highlightColor,
      highlightSecondaryColor,
    });
  };

  const handleBackgroundChange = (mode: BackgroundMode) => {
    setBackgroundMode(mode);
    const found = THEME_BACKGROUND_PRESETS.find((p) => p.id === mode);
    if (found) {
      setCustomBgColor(found.bg);
      setCustomCardColor(found.card);
      setCustomTextColor(found.text);
      setNavbarBgColor(found.navbar);
      updateTheme({
        backgroundMode: mode,
        customBgColor: found.bg,
        customCardColor: found.card,
        customTextColor: found.text,
        navbarBgColor: found.navbar,
      });
    } else {
      updateTheme({
        backgroundMode: mode,
      });
    }
  };

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

  const handleFontChange = (font: FontFamilyOption) => {
    setFontFamily(font);
    updateTheme({
      fontFamily: font,
    });
  };

  const handleRadiusChange = (radius: CornerRadius) => {
    setBorderRadius(radius);
    updateTheme({
      borderRadius: radius,
    });
  };

  const handleResetToDefault = () => {
    const defaultColor = '#f59e0b';
    setColorPreset('amber');
    setPrimaryColor(defaultColor);
    setPrimaryHoverColor('#fbbf24');
    setHighlightColor('#f59e0b');
    setHighlightSecondaryColor('#fbbf24');
    setHighlightStyle('gradient');
    setBrandNameColor('#ffffff');
    setNavbarBgColor('#020617');
    setBackgroundMode('dark');
    setFontFamily('sans');
    setBorderRadius('medium');
    updateTheme({
      colorPreset: 'amber',
      primaryColor: defaultColor,
      primaryHoverColor: '#fbbf24',
      primaryTextColor: '#020617',
      highlightColor: '#f59e0b',
      highlightSecondaryColor: '#fbbf24',
      highlightStyle: 'gradient',
      brandNameColor: '#ffffff',
      navbarBgColor: '#020617',
      backgroundMode: 'dark',
      fontFamily: 'sans',
      borderRadius: 'medium',
    });
  };

  const handleSaveAndClose = (e: React.FormEvent) => {
    e.preventDefault();
    const textColor = getContrastTextColor(primaryColor);
    updateTheme({
      colorPreset,
      primaryColor,
      primaryHoverColor,
      primaryTextColor: textColor,
      highlightColor,
      highlightSecondaryColor,
      highlightStyle,
      brandNameColor,
      navbarBgColor,
      customBgColor,
      customCardColor,
      customTextColor,
      highContrastMode,
      backgroundMode,
      fontFamily,
      borderRadius,
    });
    closeThemeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-950 font-bold shadow-md transition-colors"
              style={{ backgroundColor: primaryColor }}
            >
              <Palette className="w-5 h-5 text-slate-950" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Kustomisasi Warna, Latar & Tampilan Website</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE PREVIEW
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Ubah palet warna tombol, aksen teks, latar belakang, font, dan sudut tombol seketika.
              </p>
            </div>
          </div>
          <button
            onClick={closeThemeModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSaveAndClose} className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* Section 1: Color Presets */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                <span>1. Pilih Palet Warna Aksen Utama</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                Hex aktif:{' '}
                <strong className="text-white uppercase">{primaryColor}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {THEME_COLOR_PRESETS.map((preset) => {
                const isSelected = colorPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between group cursor-pointer ${
                      isSelected
                        ? 'border-white bg-slate-800/90 ring-2 ring-white/40 shadow-lg'
                        : 'border-slate-800 bg-slate-950 hover:bg-slate-800/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="w-5 h-5 rounded-full shadow-md flex items-center justify-center"
                        style={{ backgroundColor: preset.primary }}
                      >
                        {isSelected && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {preset.primary}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-white leading-snug">
                      {preset.name}
                    </div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {preset.description}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Hex Color Picker */}
            <div className="mt-3.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-700 bg-transparent p-0"
                    title="Klik untuk memilih warna bebas dengan roda warna"
                  />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">
                    Pilih Warna Bebas (Custom Color Picker)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Bebas memilih kode warna hex apa saja untuk aksen situs Anda
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Kode HEX:</span>
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => {
                    if (e.target.value.startsWith('#') || e.target.value.length <= 7) {
                      handleCustomColorChange(e.target.value);
                    }
                  }}
                  placeholder="#f59e0b"
                  maxLength={7}
                  className="w-24 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-white text-center uppercase focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Section 2: TEKS HIGHLIGHT & GAYA SOROTAN (ODOO STYLE) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Highlighter className="w-4 h-4 text-amber-400" />
                <span>2. Atur Warna Teks Highlight & Gaya Sorotan (Odoo Builder)</span>
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                Warna Highlight:{' '}
                <strong className="text-white uppercase">{highlightColor}</strong>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Pilih warna khusus untuk kata-kata sorotan penting seperti nama toko, diskon, poin keunggulan, serta gaya tampilan teks (gradasi warna, solid pekat, neon pendar, atau stabilo penanda ala Odoo).
            </p>

            {/* Presets Grid */}
            <div>
              <span className="text-[11px] font-semibold text-slate-300 block mb-2">
                Pilihan Palet Warna Highlight:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {THEME_HIGHLIGHT_PRESETS.map((item) => {
                  const isSelected = highlightColor.toLowerCase() === item.color.toLowerCase();
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectHighlightPreset(item.color, item.secondary)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'border-white bg-slate-800 ring-2 ring-white/40 shadow-lg'
                          : 'border-slate-800 bg-slate-900/80 hover:bg-slate-800/60 hover:border-slate-700'
                      }`}
                    >
                      <span
                        className="w-6 h-6 rounded-full shadow-md flex items-center justify-center border border-white/20"
                        style={{
                          background: `linear-gradient(135deg, ${item.color}, ${item.secondary})`,
                        }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />}
                      </span>
                      <span className="text-[11px] font-semibold text-white text-center line-clamp-1">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Color Pickers for Highlight & Gradient Stop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={highlightColor}
                    onChange={(e) => handleCustomHighlightChange(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-700 bg-transparent p-0"
                    title="Pilih warna highlight bebas"
                  />
                  <div>
                    <div className="text-xs font-semibold text-white">Warna Highlight Utama</div>
                    <div className="text-[10px] text-slate-400">Kode HEX bebas</div>
                  </div>
                </div>
                <input
                  type="text"
                  value={highlightColor}
                  onChange={(e) => handleCustomHighlightChange(e.target.value)}
                  maxLength={7}
                  className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-white text-center uppercase"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={highlightSecondaryColor}
                    onChange={(e) => {
                      setHighlightSecondaryColor(e.target.value);
                      updateTheme({
                        highlightColor,
                        highlightSecondaryColor: e.target.value,
                        highlightStyle,
                      });
                    }}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-700 bg-transparent p-0"
                    title="Pilih warna gradasi kedua"
                  />
                  <div>
                    <div className="text-xs font-semibold text-white">Warna Gradasi Kedua</div>
                    <div className="text-[10px] text-slate-400">Untuk gaya gradien</div>
                  </div>
                </div>
                <input
                  type="text"
                  value={highlightSecondaryColor}
                  onChange={(e) => {
                    setHighlightSecondaryColor(e.target.value);
                    updateTheme({
                      highlightColor,
                      highlightSecondaryColor: e.target.value,
                      highlightStyle,
                    });
                  }}
                  maxLength={7}
                  className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-white text-center uppercase"
                />
              </div>
            </div>

            {/* Highlight Style Selection */}
            <div>
              <span className="text-[11px] font-semibold text-slate-300 block mb-2">
                Pilih Gaya Tampilan Sorotan Teks (Highlight Style):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {HIGHLIGHT_STYLES.map((style) => {
                  const isSelected = highlightStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => handleHighlightStyleChange(style.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400/10 text-white ring-1 ring-amber-400/50 shadow-md'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-white mb-0.5">{style.name}</div>
                      <div className="text-[10px] text-slate-400 leading-tight">
                        {style.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Interactive Preview for Highlight Text */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Pratinjau Langsung Efek Teks Sorotan:
              </span>
              <div className="text-lg sm:text-xl font-extrabold text-white">
                Selamat Datang di{' '}
                <span
                  className={
                    highlightStyle === 'gradient'
                      ? 'highlight-text-gradient'
                      : highlightStyle === 'solid'
                      ? 'highlight-text-solid'
                      : highlightStyle === 'glow'
                      ? 'highlight-text-glow'
                      : highlightStyle === 'marker'
                      ? 'highlight-text-marker'
                      : 'highlight-text-underline'
                  }
                  style={{
                    '--theme-highlight': highlightColor,
                    '--theme-highlight-secondary': highlightSecondaryColor,
                    '--theme-highlight-glow': `${highlightColor}aa`,
                    '--theme-highlight-marker': `${highlightColor}44`,
                  } as React.CSSProperties}
                >
                  Kevin 88 Computer
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Spesialis sparepart laptop dengan{' '}
                <span
                  className={
                    highlightStyle === 'marker'
                      ? 'highlight-text-marker'
                      : highlightStyle === 'gradient'
                      ? 'highlight-text-gradient font-bold'
                      : 'highlight-text-solid font-bold'
                  }
                  style={{
                    '--theme-highlight': highlightColor,
                    '--theme-highlight-secondary': highlightSecondaryColor,
                    '--theme-highlight-glow': `${highlightColor}aa`,
                    '--theme-highlight-marker': `${highlightColor}44`,
                  } as React.CSSProperties}
                >
                  Garansi Tukar Baru
                </span>{' '}
                dan stok terlengkap siap kirim.
              </div>
            </div>
          </div>

          {/* Section 3: Warna Teks Nama Toko & Latar Navbar Header */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>🎨 3. Warna Teks Brand ("Kevin 88") & Latar Navbar Header</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Pastikan teks kontras dan tidak tenggelam dengan latar
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Brand Name Color */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-white">Warna Teks "Kevin 88"</div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">{brandNameColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandNameColor}
                    onChange={(e) => {
                      setBrandNameColor(e.target.value);
                      updateTheme({
                        brandNameColor: e.target.value,
                      });
                    }}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-700 bg-transparent p-0"
                    title="Pilih warna teks nama brand"
                  />
                  <div className="flex items-center gap-1.5 flex-1">
                    {['#ffffff', '#f8fafc', '#f59e0b', '#38bdf8', '#34d399', '#f87171', '#c084fc'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setBrandNameColor(c);
                          updateTheme({ brandNameColor: c });
                        }}
                        className="w-5 h-5 rounded-full border border-slate-700 hover:scale-110 transition-transform cursor-pointer"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <input
                    type="text"
                    value={brandNameColor}
                    onChange={(e) => {
                      setBrandNameColor(e.target.value);
                      updateTheme({ brandNameColor: e.target.value });
                    }}
                    maxLength={7}
                    className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-white text-center uppercase"
                  />
                </div>
              </div>

              {/* Navbar Background Color */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-white">Warna Latar Navbar / Menu Atas</div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">{navbarBgColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={navbarBgColor}
                    onChange={(e) => {
                      setNavbarBgColor(e.target.value);
                      updateTheme({
                        navbarBgColor: e.target.value,
                      });
                    }}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-700 bg-transparent p-0"
                    title="Pilih warna latar navbar"
                  />
                  <div className="flex items-center gap-1.5 flex-1">
                    {['#020617', '#000000', '#081329', '#0f172a', '#ffffff'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          setNavbarBgColor(c);
                          updateTheme({ navbarBgColor: c });
                        }}
                        className="w-5 h-5 rounded-full border border-slate-700 hover:scale-110 transition-transform cursor-pointer"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <input
                    type="text"
                    value={navbarBgColor}
                    onChange={(e) => {
                      setNavbarBgColor(e.target.value);
                      updateTheme({ navbarBgColor: e.target.value });
                    }}
                    maxLength={7}
                    className="w-20 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-white text-center uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Live Header Wordmark Preview */}
            <div
              className="p-3 rounded-xl border border-slate-700/80 flex items-center justify-between transition-colors shadow-sm"
              style={{ backgroundColor: navbarBgColor }}
            >
              <div className="flex items-center gap-2 text-base font-extrabold">
                {settings.branding?.logoImageUrl && (
                  <img
                    src={settings.branding.logoImageUrl}
                    alt="Logo"
                    className="w-7 h-7 rounded object-contain bg-white p-0.5 border border-slate-700 shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
                <span style={{ color: brandNameColor }}>Kevin 88</span>
                <span
                  className={
                    highlightStyle === 'gradient'
                      ? 'highlight-text-gradient'
                      : highlightStyle === 'solid'
                      ? 'highlight-text-solid'
                      : highlightStyle === 'glow'
                      ? 'highlight-text-glow'
                      : highlightStyle === 'marker'
                      ? 'highlight-text-marker'
                      : 'highlight-text-underline'
                  }
                  style={{
                    '--theme-highlight': highlightColor,
                    '--theme-highlight-secondary': highlightSecondaryColor,
                    '--theme-highlight-glow': `${highlightColor}aa`,
                    '--theme-highlight-marker': `${highlightColor}44`,
                  } as React.CSSProperties}
                >
                  Computer
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30">
                Teks Jelas Terbaca
              </span>
            </div>
          </div>

          {/* Section 4: Latar Belakang, Permukaan Kartu & Kontras Teks */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Monitor className="w-4 h-4" style={{ color: primaryColor }} />
                <span>4. Atur Warna Latar Belakang, Kartu & Kontras Teks</span>
              </label>
              <span className="text-[11px] text-slate-400">
                Ubah warna semua elemen agar 100% terbaca jelas
              </span>
            </div>

            {/* Fitur Ratakan Background Seluruh Seksi */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-indigo-950/70 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Fitur Ratakan Background Website (Semua Seksi Rata & Seragam)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Menyelaraskan warna latar belakang di seluruh website (Hero, Kompatibilitas, Katalog, Tentang Kami, Teknisi, Cabang, FAQ, dan Footer) agar 100% rata, satu warna seragam tanpa belang-belang.
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

            {/* Solusi Langsung: Toggle Mode Kontras Ekstra Tinggi */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>⚡ Mode Teks Kontras Ekstra Tinggi (100% Terlihat Jelas & Tajam)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Aktifkan fitur ini jika tulisan di website terlihat kurang jelas atau redup di layar Anda. Menajamkan seluruh teks abu-abu menjadi putih pekat / hitam tajam dan menebalkan label sehingga tidak ada tulisan yang "tenggelam".
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const nextVal = !highContrastMode;
                  setHighContrastMode(nextVal);
                  updateTheme({
                    highContrastMode: nextVal,
                  });
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shrink-0 ${
                  highContrastMode
                    ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 ring-2 ring-emerald-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {highContrastMode ? '✓ KONTRAS TINGGI AKTIF' : 'Aktifkan Kontras Tinggi'}
              </button>
            </div>

            {/* Background Canvas Mode Presets */}
            <div>
              <span className="text-[11px] font-semibold text-slate-300 block mb-2">
                Pilihan Mode Latar Belakang Standar:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {THEME_BACKGROUND_PRESETS.map((preset) => {
                  const isSelected = backgroundMode === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleBackgroundChange(preset.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 bg-slate-800/90 ring-2 ring-amber-400/30 shadow-md'
                          : 'border-slate-800 bg-slate-900/80 hover:bg-slate-800/50 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-700 shadow-sm"
                            style={{ backgroundColor: preset.bg }}
                          />
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-slate-700 shadow-sm -ml-2"
                            style={{ backgroundColor: preset.card }}
                          />
                        </div>
                        {isSelected && (
                          <span className="text-[9px] font-bold text-amber-400 font-mono">AKTIF</span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-white truncate">{preset.name}</div>
                      <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                        {preset.bg}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom HEX Pickers for Background & Card Surfaces */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-300 block mb-2">
                Atur Warna HEX Bebas (Latar, Kartu & Teks):
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Custom Background Color */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-white">Warna Latar Halaman</div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{customBgColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customBgColor}
                      onChange={(e) => {
                        setCustomBgColor(e.target.value);
                        updateTheme({ customBgColor: e.target.value });
                      }}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-700 bg-transparent p-0"
                      title="Pilih warna latar belakang bebas"
                    />
                    <input
                      type="text"
                      value={customBgColor}
                      onChange={(e) => {
                        setCustomBgColor(e.target.value);
                        updateTheme({ customBgColor: e.target.value });
                      }}
                      maxLength={7}
                      className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-white text-center uppercase"
                    />
                  </div>
                </div>

                {/* Custom Card Surface Color */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-white">Warna Kotak / Kartu</div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{customCardColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customCardColor}
                      onChange={(e) => {
                        setCustomCardColor(e.target.value);
                        updateTheme({ customCardColor: e.target.value });
                      }}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-700 bg-transparent p-0"
                      title="Pilih warna kartu / kontainer bebas"
                    />
                    <input
                      type="text"
                      value={customCardColor}
                      onChange={(e) => {
                        setCustomCardColor(e.target.value);
                        updateTheme({ customCardColor: e.target.value });
                      }}
                      maxLength={7}
                      className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-white text-center uppercase"
                    />
                  </div>
                </div>

                {/* Custom Text Color */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-white">Warna Teks Utama</div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">{customTextColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customTextColor}
                      onChange={(e) => {
                        setCustomTextColor(e.target.value);
                        updateTheme({ customTextColor: e.target.value });
                      }}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-700 bg-transparent p-0"
                      title="Pilih warna teks utama bebas"
                    />
                    <input
                      type="text"
                      value={customTextColor}
                      onChange={(e) => {
                        setCustomTextColor(e.target.value);
                        updateTheme({ customTextColor: e.target.value });
                      }}
                      maxLength={7}
                      className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-white text-center uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Font Family & Corner Radius in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Font Family */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                <span>3. Gaya Font Tulisan</span>
              </label>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {[
                  { id: 'sans' as FontFamilyOption, name: 'Sans Modern', sub: 'Plus Jakarta' },
                  { id: 'geometric' as FontFamilyOption, name: 'Geometris', sub: 'Clean Display' },
                  { id: 'mono' as FontFamilyOption, name: 'Tech Mono', sub: 'JetBrains' },
                  { id: 'serif' as FontFamilyOption, name: 'Serif Elegan', sub: 'Editorial' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => handleFontChange(f.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      fontFamily === f.id
                        ? 'border-white bg-slate-800 text-white ring-1 ring-white/30'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-semibold text-white">{f.name}</div>
                    <div className="text-[10px] text-slate-500">{f.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Corner Radius */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                <span>4. Sudut Lengkungan (Radius)</span>
              </label>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {[
                  { id: 'sharp' as CornerRadius, name: 'Kotak Presisi', desc: '0px (Sharp)' },
                  { id: 'medium' as CornerRadius, name: 'Rounded Normal', desc: '12px (Bawaan)' },
                  { id: 'soft' as CornerRadius, name: 'Extra Soft', desc: '20px (Melengkung)' },
                  { id: 'pill' as CornerRadius, name: 'Pill / Kapsul', desc: 'Bulat Maksimal' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRadiusChange(r.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      borderRadius === r.id
                        ? 'border-white bg-slate-800 text-white ring-1 ring-white/30'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-semibold text-white">{r.name}</div>
                    <div className="text-[10px] text-slate-500">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Live Component Preview Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Pratinjau Komponen Langsung (Live Interactive Preview)
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold rounded-lg transition-transform hover:scale-105 cursor-pointer shadow-md"
                style={{
                  backgroundColor: primaryColor,
                  color: getContrastTextColor(primaryColor),
                }}
              >
                Tombol Utama
              </button>

              <button
                type="button"
                className="px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer"
                style={{
                  backgroundColor: `${primaryColor}20`,
                  color: primaryColor,
                  borderColor: `${primaryColor}50`,
                }}
              >
                Tombol Sekunder
              </button>

              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                style={{
                  backgroundColor: `${primaryColor}15`,
                  color: primaryColor,
                  borderColor: `${primaryColor}40`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: primaryColor }}
                />
                Badge Promo Aktif
              </span>

              <span
                className="text-sm font-extrabold"
                style={{ color: primaryColor }}
              >
                Rp 450.000 (Harga Promo)
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kembalikan ke Emas Kevin 88</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeThemeModal}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-lg transition-transform hover:scale-102 cursor-pointer"
                style={{
                  backgroundColor: primaryColor,
                  color: getContrastTextColor(primaryColor),
                }}
              >
                <Check className="w-4 h-4" />
                <span>Simpan & Terapkan Perubahan</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
