import React, { useState } from 'react';
import { Search, ShieldCheck, Cpu, ArrowRight, MessageCircle, Edit3, Palette, Highlighter } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';
import { THEME_HIGHLIGHT_PRESETS, HIGHLIGHT_STYLES } from '../utils/theme';
import { HighlightStyleOption } from '../types';
import { OdooBlockControl } from './admin/OdooBlockControl';

interface HeroProps {
  onSearch: (query: string) => void;
  onOpenConsultation: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch, onOpenConsultation }) => {
  const [searchInput, setSearchInput] = useState('');
  const {
    settings,
    isAdminMode,
    openHeroModal,
    openBackgroundModal,
    openWarrantyModal,
    updateTheme,
    updateHero,
    updateBranding,
  } = useSiteData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      const el = document.getElementById('katalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickPicks = settings.hero?.quickPicks || ['Baterai Asus', 'Charger Lenovo', 'Layar 14 Slim FHD', 'SSD NVMe 1TB', 'Keyboard TUF'];

  const heroHighlightStyle = settings.hero?.highlightStyle || settings.theme?.highlightStyle || 'gradient';
  const heroHighlightColor = settings.hero?.highlightColor || settings.theme?.highlightColor || settings.theme?.primaryColor || '#f59e0b';
  const heroHighlightSecondary = settings.hero?.highlightSecondaryColor || settings.theme?.highlightSecondaryColor || '#fbbf24';

  const handleQuickHighlightChange = (color: string, secondary: string) => {
    updateHero({
      highlightColor: color,
      highlightSecondaryColor: secondary,
    });
    updateTheme({
      highlightColor: color,
      highlightSecondaryColor: secondary,
    });
    updateBranding({
      brandHighlightColor: color,
    });
  };

  const handleQuickStyleChange = (style: HighlightStyleOption) => {
    updateHero({
      highlightStyle: style,
    });
    updateTheme({
      highlightStyle: style,
    });
  };

  return (
    <section id="hero" className={`relative overflow-hidden bg-slate-950 pt-8 pb-16 lg:pt-14 lg:pb-20 border-b border-slate-800/80 ${isAdminMode ? 'odoo-editable-block' : ''}`}>
      {/* Subtle ambient gradient mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(245,158,11,0.08),rgba(255,255,255,0))] pointer-events-none" />

      {/* Odoo Standard Block Control */}
      {isAdminMode && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <OdooBlockControl
            blockId="hero"
            blockName="Hero Banner & Kata Kunci"
            onEdit={openHeroModal}
            onCustomizeBg={openBackgroundModal}
          />
        </div>
      )}

      {/* Admin Odoo Quick Highlight Color Switcher Toolbar */}
      {isAdminMode && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">
          <div className="p-2.5 sm:p-3 bg-slate-900/90 border border-amber-500/40 rounded-xl shadow-lg backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
                <Highlighter className="w-3.5 h-3.5" />
              </span>
              <span className="font-bold text-white">Atur Warna Teks Highlight Langsung:</span>
            </div>

            {/* Instant Color Swatches */}
            <div className="flex flex-wrap items-center gap-1.5">
              {THEME_HIGHLIGHT_PRESETS.slice(0, 7).map((preset) => {
                const isCurrent = heroHighlightColor.toLowerCase() === preset.color.toLowerCase();
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleQuickHighlightChange(preset.color, preset.secondary)}
                    title={`Ubah highlight ke ${preset.name}`}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer border ${
                      isCurrent
                        ? 'border-white bg-slate-800 text-white shadow-sm ring-1 ring-white/40'
                        : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className="hidden sm:inline">{preset.name.split(' ')[0]}</span>
                  </button>
                );
              })}

              {/* Style selector chips */}
              <div className="hidden lg:flex items-center gap-1 pl-2 border-l border-slate-800">
                {HIGHLIGHT_STYLES.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => handleQuickStyleChange(st.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                      heroHighlightStyle === st.id
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {st.name}
                  </button>
                ))}
              </div>

              <button
                onClick={openBackgroundModal}
                className="ml-1 px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1 shadow transition-all cursor-pointer"
                title="Kustomisasi warna background halaman & kartu toko"
              >
                <Palette className="w-3 h-3" />
                <span>Warna Background</span>
              </button>

              <button
                onClick={openHeroModal}
                className="ml-1 px-2.5 py-1 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-bold flex items-center gap-1 shadow transition-all cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit Hero Lengkap</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Editorial Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>{settings.hero?.badge || 'Solusi Sparepart Terpercaya Sejak 2014 · Garansi Tukar Baru'}</span>
              
              {/* Direct In-place Edit Button when in Admin Mode */}
              {isAdminMode && (
                <button
                  onClick={openHeroModal}
                  className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-[11px] font-bold cursor-pointer transition-all"
                  title="Klik untuk langsung edit judul dan kontak"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Info Hero</span>
                </button>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight text-balance">
              {settings.hero?.titlePrefix || 'Selamat Datang di'}{' '}
              <span
                onClick={isAdminMode ? openHeroModal : undefined}
                className={`highlight-text cursor-pointer transition-all relative group ${
                  heroHighlightStyle === 'gradient'
                    ? 'highlight-text-gradient'
                    : heroHighlightStyle === 'solid'
                    ? 'highlight-text-solid'
                    : heroHighlightStyle === 'glow'
                    ? 'highlight-text-glow'
                    : heroHighlightStyle === 'marker'
                    ? 'highlight-text-marker'
                    : 'highlight-text-underline'
                }`}
                style={{
                  '--theme-highlight': heroHighlightColor,
                  '--theme-highlight-secondary': heroHighlightSecondary,
                  '--theme-highlight-glow': `${heroHighlightColor}aa`,
                  '--theme-highlight-marker': `${heroHighlightColor}44`,
                } as React.CSSProperties}
                title={isAdminMode ? 'Klik untuk mengubah teks highlight dan warnanya' : undefined}
              >
                {settings.hero?.titleHighlight || 'Kevin 88 Computer'}
                {isAdminMode && (
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-0 text-[10px] bg-slate-900 border border-amber-400 text-amber-300 px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-20 font-sans font-semibold">
                    ✏️ Klik untuk edit kata sorotan & warna
                  </span>
                )}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              {settings.hero?.description || 'Toko spesialis sparepart laptop untuk kebutuhan penggantian dan upgrade performa: baterai, charger, keyboard, LCD/LED, RAM, SSD, hingga fan pendingin. Kualitas terjamin dengan harga bersahabat dan konsultasi kecocokan gratis.'}
            </p>

            {/* Quick Model Search Box */}
            <form onSubmit={handleSubmit} className="pt-2 max-w-xl">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Ketik tipe laptop atau part number (misal: Ideapad 330, Vivobook, L19M2PB0)..."
                  className="w-full pl-11 pr-28 py-3.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Cari Part
                </button>
              </div>

              {/* Quick suggestions */}
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-400">
                <span className="text-slate-500">Pencarian cepat:</span>
                {quickPicks.map((pick) => (
                  <button
                    key={pick}
                    type="button"
                    onClick={() => {
                      setSearchInput(pick);
                      onSearch(pick);
                      const el = document.getElementById('katalog');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-amber-300 underline decoration-slate-600 hover:decoration-amber-400 underline-offset-2 transition-colors cursor-pointer"
                  >
                    {pick}
                  </button>
                ))}
              </div>
            </form>

            {/* CTA Action Pair */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('katalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:border-slate-600"
              >
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>{settings.hero?.ctaButton1Text || 'Lihat Katalog Sparepart'}</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => openWarrantyModal()}
                className="px-5 py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-500/10 hover:scale-102 active:scale-98"
                title="Periksa sisa hari masa garansi suku cadang Anda secara online"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Cek Masa Garansi</span>
              </button>

              <button
                onClick={onOpenConsultation}
                className="px-5 py-3 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-500/40 text-amber-300 font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-amber-400" />
                <span>{settings.hero?.ctaButton2Text || 'Konsultasi WhatsApp Gratis'}</span>
              </button>
            </div>

            {/* Guarantees list */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-400">
              <button
                type="button"
                onClick={() => openWarrantyModal()}
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer transition-colors"
                title="Buka panel verifikasi nomor seri garansi"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="underline decoration-emerald-500/40 underline-offset-2">
                  {settings.hero?.guarantees?.[0] || 'Garansi Resmi Toko s/d 3 Tahun (Cek di Sini)'}
                </span>
              </button>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{settings.hero?.guarantees?.[1] || '100% Tes Sebelum Kirim'}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{settings.hero?.guarantees?.[2] || 'Siap Kirim se-Indonesia'}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{settings.hero?.guarantees?.[3] || 'Harga Grosir untuk Teknisi'}</span>
            </div>
          </div>

          {/* Right Column: Hero High-Fidelity Asset */}
          <div className="lg:col-span-5 relative">
            <div
              onClick={isAdminMode ? openHeroModal : undefined}
              className={`relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group ${
                isAdminMode ? 'cursor-pointer hover:border-amber-400/60' : ''
              }`}
            >
              <img
                src={settings.hero?.imageUrl || '/assets/images/hero_laptop_spareparts_1790149123693.jpg'}
                alt="Koleksi sparepart laptop Kevin 88 Computer: baterai, RAM, SSD, kipas pendingin, dan keyboard"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover aspect-[16/10] group-hover:scale-102 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/hero_laptop_spareparts_1790149123693.jpg';
                }}
              />
              
              {/* Measured contrast scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Stok Terlengkap Ready Siap Kirim</div>
                  <div className="text-[11px] text-slate-400">Baterai · Charger · Keyboard · LCD · RAM · SSD · Fan</div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 px-2 py-1 bg-amber-400/10 rounded border border-amber-400/20">
                  Ready 500+ Part
                </span>
              </div>

              {isAdminMode && (
                <div className="absolute top-3 right-3 bg-slate-900/90 border border-amber-400/50 text-amber-300 text-[10px] font-bold px-2 py-1 rounded shadow">
                  📷 Klik untuk ganti foto hero
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
