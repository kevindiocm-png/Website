import React, { useState } from 'react';
import { useSiteData } from '../../context/SiteContext';
import {
  X,
  Layers,
  Palette,
  Settings,
  Edit3,
  Megaphone,
  Store,
  Highlighter,
  Users,
  Sliders,
  MapPin,
  ShieldCheck,
  HelpCircle,
  Star,
  FileText,
  Upload,
  Globe,
  BarChart3,
  Check,
  Sparkles,
  ChevronRight,
  Eye,
  ArrowRight,
  LayoutGrid,
} from 'lucide-react';
import { THEME_HIGHLIGHT_PRESETS, THEME_BACKGROUND_PRESETS } from '../../utils/theme';

export const OdooBuilderDrawer: React.FC = () => {
  const {
    isAdminMode,
    settings,
    updateTheme,
    openBannerModal,
    openBrandingModal,
    openHeroModal,
    openAboutModal,
    openCMSModal,
    openShopeeModal,
    openBranchModal,
    openWarrantyModal,
    openFaqModal,
    openTestimonialsModal,
    openFooterModal,
    openPublishModal,
    openOrdersModal,
    openAnalyticsModal,
    openBackgroundModal,
    showToast,
  } = useSiteData();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'blocks' | 'theme' | 'tools'>('blocks');

  if (!isAdminMode) return null;

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const blocksList = [
    {
      id: 'banner',
      name: 'Pengumuman Banner Atas',
      desc: 'Teks promo, flash sale, dan jam operasional',
      icon: Megaphone,
      action: openBannerModal,
      targetId: 'banner',
    },
    {
      id: 'branding',
      name: 'Header, Logo & Branding',
      desc: 'Logo toko, teks "Kevin 88", badge, dan warna',
      icon: Store,
      action: openBrandingModal,
      targetId: 'navbar',
    },
    {
      id: 'hero',
      name: 'Hero Banner & Kata Kunci',
      desc: 'Judul utama, kata highlight, dan tombol WA',
      icon: Highlighter,
      action: openHeroModal,
      targetId: 'hero',
    },
    {
      id: 'about',
      name: 'Tentang Kevin 88 Computer',
      desc: 'Sejarah, jam terbang, dan pilar komitmen toko',
      icon: Users,
      action: openAboutModal,
      targetId: 'tentang-kami',
    },
    {
      id: 'catalog',
      name: 'Katalog Sparepart & Stok',
      desc: 'Manajemen harga, stok ready, dan filter laptop',
      icon: Sliders,
      action: () => openCMSModal('products'),
      targetId: 'katalog',
    },
    {
      id: 'branches',
      name: 'Cabang Toko Fisik & Maps',
      desc: 'Lokasi Simpang Lima, Java Mall & rute rujukan',
      icon: MapPin,
      action: openBranchModal,
      targetId: 'cabang',
    },
    {
      id: 'warranty',
      name: 'Layanan Garansi & Cek S/N',
      desc: 'Database nomor seri, nota dan jaminan ganti unit',
      icon: ShieldCheck,
      action: () => openWarrantyModal(),
      targetId: 'garansi',
    },
    {
      id: 'faq',
      name: 'Pertanyaan Umum (FAQ)',
      desc: 'Daftar tanya jawab teknis dan pembelian',
      icon: HelpCircle,
      action: openFaqModal,
      targetId: 'faq',
    },
    {
      id: 'testimonials',
      name: 'Testimoni Pelanggan',
      desc: 'Ulasan rating bintang dan pengalaman teknisi',
      icon: Star,
      action: () => openTestimonialsModal(null),
      targetId: 'testimoni',
    },
    {
      id: 'footer',
      name: 'Footer, Alamat & Sosmed',
      desc: 'Instagram, Tokopedia, Shopee & hak cipta',
      icon: LayoutGrid,
      action: openFooterModal,
      targetId: 'footer',
    },
  ];

  return (
    <>
      {/* Floating Toggle Button (Mobile & Desktop Friendly) */}
      <div className="fixed top-24 right-2 sm:right-4 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-700 via-indigo-600 to-cyan-600 hover:from-purple-600 hover:to-cyan-500 text-white font-bold text-xs shadow-xl shadow-purple-950/40 border border-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="Buka Odoo Website Builder Sidebar"
        >
          <Layers className="w-4 h-4 text-cyan-300 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline font-mono tracking-tight">Odoo Builder</span>
          <span className="sm:hidden font-mono text-[11px]">Edit Blok</span>
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 md:hidden animate-in fade-in"
        />
      )}

      {/* Drawer Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-[340px] sm:max-w-[400px] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Odoo Website Builder</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Pilih blok untuk langsung edit konten & visual
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Tutup Panel Builder"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950 text-xs">
          <button
            onClick={() => setActiveTab('blocks')}
            className={`py-2.5 font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'blocks'
                ? 'border-amber-400 text-amber-300 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Blok Web</span>
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`py-2.5 font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'theme'
                ? 'border-amber-400 text-amber-300 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Tema</span>
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`py-2.5 font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'tools'
                ? 'border-amber-400 text-amber-300 bg-slate-900/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Alat Toko</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: BLOK WEB */}
          {activeTab === 'blocks' && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                Daftar Blok Halaman ({blocksList.length} Seksi):
              </div>

              {blocksList.map((block, idx) => {
                const Icon = block.icon;
                return (
                  <div
                    key={block.id}
                    className="p-3 bg-slate-950/80 hover:bg-slate-950 rounded-xl border border-slate-800 hover:border-amber-400/40 transition-all flex items-center justify-between gap-2 group"
                  >
                    <div
                      onClick={() => {
                        scrollTo(block.targetId);
                      }}
                      className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                          {idx + 1}. {block.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {block.desc}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          scrollTo(block.targetId);
                          block.action();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 border border-amber-400/30 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                        title={`Edit ${block.name}`}
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: TEMA & WARNA */}
          {activeTab === 'theme' && (
            <div className="space-y-5">
              {/* Highlight Presets */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Warna Utama (Brand Accent)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {THEME_HIGHLIGHT_PRESETS.map((preset) => {
                    const isSelected = settings.theme?.highlightColor === preset.color;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          updateTheme({
                            highlightColor: preset.color,
                            highlightSecondaryColor: preset.secondary,
                            primaryColor: preset.color,
                          });
                          showToast(`Warna aksen diubah ke ${preset.name}`, 'info');
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800 border-white text-white ring-1 ring-white/40'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: preset.color }}
                        />
                        <span className="text-xs font-medium truncate">{preset.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 ml-auto text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Background Color Presets */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Warna Background Latar</span>
                  <button
                    onClick={openBackgroundModal}
                    className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                  >
                    Atur Manual
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {THEME_BACKGROUND_PRESETS.map((bg) => {
                    const isSelected =
                      settings.theme?.backgroundMode === bg.id ||
                      settings.theme?.customBgColor === bg.bg;
                    return (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => {
                          updateTheme({
                            backgroundMode: bg.id,
                            customBgColor: bg.bg,
                            customCardColor: bg.card,
                            customTextColor: bg.text,
                            navbarBgColor: bg.navbar,
                          });
                          showToast(`Background diubah ke ${bg.name}`, 'info');
                        }}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800 border-indigo-400 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded border border-slate-700 shrink-0"
                          style={{ backgroundColor: bg.bg }}
                        />
                        <span className="text-xs font-medium truncate">{bg.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Corner Radius */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Gaya Sudut Kartu & Tombol
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'sharp', label: 'Kotak (Sharp)' },
                    { id: 'default', label: 'Modern (12px)' },
                    { id: 'soft', label: 'Bulat (Soft)' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        updateTheme({ borderRadius: r.id as any });
                      }}
                      className={`p-2 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                        settings.theme?.borderRadius === r.id
                          ? 'bg-amber-400 text-slate-950 border-amber-300'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ALAT TOKO */}
          {activeTab === 'tools' && (
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                Pusat Pengelolaan & Ekspor:
              </div>

              {/* Shopee Excel Importer */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  openShopeeModal();
                }}
                className="w-full p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/30 hover:border-orange-400 text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Import Produk Shopee</div>
                    <div className="text-[10px] text-slate-400">Upload file .xlsx / .csv Seller Centre</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-orange-400" />
              </button>

              {/* Google Analytics 4 */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  openAnalyticsModal();
                }}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400/40 text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Google Analytics (GA4)</div>
                    <div className="text-[10px] text-slate-400">Pantau pengunjung & produk terpopuler</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Order Invoices Management */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  openOrdersModal();
                }}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400/40 text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Riwayat Nota & Status Bayar</div>
                    <div className="text-[10px] text-slate-400">Ubah status pesanan ke Lunas/Batal</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Publish Store */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  openPublishModal();
                }}
                className="w-full p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-400 text-left transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Publikasikan Toko</div>
                    <div className="text-[10px] text-slate-400">Salin link untuk pelanggan & teknisi</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 text-xs flex items-center justify-between">
          <div className="text-slate-400">
            Mode Editor: <span className="text-emerald-400 font-bold">Aktif</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </aside>
    </>
  );
};
