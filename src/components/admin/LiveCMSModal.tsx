import React, { useState, useRef } from 'react';
import { useSiteData, CMSTabType } from '../../context/SiteContext';
import { Product } from '../../types';
import { formatRupiah } from '../../utils/format';
import { THEME_COLOR_PRESETS, getContrastTextColor } from '../../utils/theme';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Search,
  Package,
  Store,
  Megaphone,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  BookOpen,
  Wrench,
  HelpCircle,
  Eye,
  Sliders,
  Palette,
  Layout,
  FileText,
  Check,
  CreditCard,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react';

export const LiveCMSModal: React.FC = () => {
  const {
    isCMSModalOpen,
    closeCMSModal,
    cmsActiveTab,
    setCMSActiveTab,
    products,
    branches,
    settings,
    openThemeModal,
    updateTheme,
    openProductModal,
    openShopeeModal,
    deleteProduct,
    quickUpdateStock,
    quickToggleStock,
    quickUpdatePrice,
    openBranchModal,
    deleteBranch,
    openBrandingModal,
    openBannerModal,
    openHeroModal,
    openAboutModal,
    openTechnicianModal,
    openFaqModal,
    deleteFaq,
    openFooterModal,
    openPaymentModal,
    updateSectionHeaders,
    updateFooter,
    resetToDefault,
    exportBackup,
    importBackup,
    showToast,
  } = useSiteData();

  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [importJsonText, setImportJsonText] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isCMSModalOpen) return null;

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchPart = p.partNumber?.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      return matchName || matchPart || matchBrand;
    }
    return true;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importBackup(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const tabs: { id: CMSTabType; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'theme', label: 'Warna & Gaya', icon: <Palette className="w-4 h-4" /> },
    { id: 'branding', label: 'Logo & Brand', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'banner', label: 'Banner & Hero', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'products', label: 'Sparepart', icon: <Package className="w-4 h-4" />, count: products.length },
    { id: 'branches', label: 'Cabang Toko', icon: <Store className="w-4 h-4" />, count: branches.length },
    { id: 'sections', label: 'Judul Seksi', icon: <Layout className="w-4 h-4" /> },
    { id: 'about', label: 'Tentang Kami', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'faqs', label: 'FAQ', icon: <HelpCircle className="w-4 h-4" />, count: settings.faqs?.length || 0 },
    { id: 'footer', label: 'Footer & Kontak', icon: <FileText className="w-4 h-4" /> },
    { id: 'backup', label: 'Cadangan', icon: <Download className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm shadow-md">
              88
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Pusat Kelola & Pembaruan Website Langsung (Live CMS)
                </h3>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  LANGSUNG TERSIMPAN
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pembaruan logo, produk, cabang, cerita tentang kami, FAQ, dan banner tanpa reload.
              </p>
            </div>
          </div>
          <button
            onClick={closeCMSModal}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 sm:px-6 border-b border-slate-800 bg-slate-950/60 overflow-x-auto scrollbar-none shrink-0">
          {tabs.map((tab) => {
            const isActive = cmsActiveTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCMSActiveTab(tab.id)}
                className={`py-3 px-3.5 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'border-amber-400 text-amber-400 font-bold bg-amber-400/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900/90">
          {/* TAB 0: WARNA & TEMA */}
          {cmsActiveTab === 'theme' && (
            <div className="space-y-6 max-w-3xl">
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Palette className="w-4 h-4 text-amber-400" />
                      <span>Kustomisasi Warna, Latar Belakang & Gaya Tampilan</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Ubah palet warna aksen, mode latar belakang (OLED / Navy / Light), dan font situs seketika.
                    </p>
                  </div>
                  <button
                    onClick={openThemeModal}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Buka Pengaturan Lengkap Warna</span>
                  </button>
                </div>

                {/* Quick Color Swatches */}
                <div className="pt-2">
                  <div className="text-xs font-semibold text-slate-300 mb-2">
                    Pilih Cepat Palet Warna Aksen:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {THEME_COLOR_PRESETS.map((preset) => {
                      const isCurrent = (settings.theme?.colorPreset || 'amber') === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            updateTheme({
                              colorPreset: preset.id,
                              primaryColor: preset.primary,
                              primaryHoverColor: preset.hover,
                              primaryTextColor: preset.textOnPrimary,
                            });
                          }}
                          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                            isCurrent
                              ? 'border-white bg-slate-800 ring-2 ring-white/30 shadow-md'
                              : 'border-slate-800 bg-slate-900 hover:bg-slate-850 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className="w-5 h-5 rounded-full shadow flex items-center justify-center"
                              style={{ backgroundColor: preset.primary }}
                            >
                              {isCurrent && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {preset.primary}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-white">{preset.name}</div>
                          <div className="text-[10px] text-slate-400">{preset.description}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Background Mode */}
                <div className="pt-3 border-t border-slate-800">
                  <div className="text-xs font-semibold text-slate-300 mb-2">
                    Mode Latar Belakang (Canvas Mode):
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'dark', name: 'Dark Slate', desc: 'Bawaan Elegan', icon: Moon, color: '#0f172a' },
                      { id: 'black', name: 'True Black OLED', desc: '100% Hitam Pekat', icon: Moon, color: '#000000' },
                      { id: 'midnight', name: 'Deep Midnight', desc: 'Biru Laut Malam', icon: Monitor, color: '#081329' },
                      { id: 'light', name: 'Clean Light', desc: 'Terang & Bersih', icon: Sun, color: '#f8fafc' },
                    ].map((mode) => {
                      const isActive = (settings.theme?.backgroundMode || 'dark') === mode.id;
                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => updateTheme({ backgroundMode: mode.id as any })}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isActive
                              ? 'border-white bg-slate-800 ring-1 ring-white/30 text-white'
                              : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-slate-700"
                              style={{ backgroundColor: mode.color }}
                            />
                            <span className="text-xs font-bold text-white">{mode.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-500">{mode.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Preview Box */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Contoh Tombol & Aksen Aktif:
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-xs font-bold rounded-lg shadow"
                      style={{
                        backgroundColor: settings.theme?.primaryColor || '#f59e0b',
                        color: settings.theme?.primaryTextColor || '#020617',
                      }}
                    >
                      Beli Sparepart Sekarang
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-xs font-semibold rounded-lg border"
                      style={{
                        backgroundColor: `${settings.theme?.primaryColor || '#f59e0b'}20`,
                        color: settings.theme?.primaryColor || '#f59e0b',
                        borderColor: `${settings.theme?.primaryColor || '#f59e0b'}50`,
                      }}
                    >
                      Cek Kompatibilitas
                    </button>
                    <span
                      className="text-sm font-extrabold"
                      style={{ color: settings.theme?.primaryColor || '#f59e0b' }}
                    >
                      Rp 450.000 (Garansi 6 Bulan)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: LOGO & BRANDING */}
          {cmsActiveTab === 'branding' && (
            <div className="space-y-6 max-w-3xl">
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Identitas Brand & Logo Toko Saat Ini</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Pengaturan ini langsung tampil di Header Navbar dan Footer bawah.
                    </p>
                  </div>
                  <button
                    onClick={openBrandingModal}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Ubah Logo & Nama Sekarang</span>
                  </button>
                </div>

                {/* Current Display Preview */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Tampilan Logo di Website:
                  </div>
                  <div className="flex items-center gap-3">
                    {settings.branding?.logoImageUrl && (
                      <img
                        src={settings.branding.logoImageUrl}
                        alt="Logo"
                        className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-slate-700 shadow-md"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <div className="text-lg font-extrabold text-white">
                        {settings.branding?.brandName || 'Kevin 88'}{' '}
                        <span className="text-amber-400">
                          {settings.branding?.brandHighlight || 'Computer'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">
                        {settings.branding?.tagline || 'Spesialis Sparepart Laptop Sejak 2014'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">Mode Tampilan Navbar</span>
                    <span className="text-white font-semibold capitalize">
                      {settings.branding?.logoMode === 'both'
                        ? 'Gambar Logo + Teks Nama'
                        : settings.branding?.logoMode === 'image'
                        ? 'Hanya Gambar Logo'
                        : 'Badge Angka (88) + Teks'}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">Foto Logo Tersimpan</span>
                    <span className="text-amber-300 font-mono text-[11px] truncate block">
                      {settings.branding?.logoImageUrl ? 'Tersedia (Custom/Preset)' : 'Belum ada gambar'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS */}
          {cmsActiveTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari sparepart berdasarkan nama, part number, merk..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={openShopeeModal}
                    className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 text-xs font-extrabold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                    title="Upload file ekspor produk dari Shopee Seller Centre"
                  >
                    <Upload className="w-4 h-4 stroke-[2.5]" />
                    <span>Import Shopee (.xlsx / .csv)</span>
                  </button>

                  <button
                    onClick={() => openProductModal(null)}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Tambah Sparepart Baru</span>
                  </button>
                </div>
              </div>

              {/* Table of Products */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 font-mono">
                      <tr>
                        <th className="py-2.5 px-3">Produk & Part Number</th>
                        <th className="py-2.5 px-3">Kategori & Merk</th>
                        <th className="py-2.5 px-3">Harga</th>
                        <th className="py-2.5 px-3">Stok</th>
                        <th className="py-2.5 px-3">Garansi</th>
                        <th className="py-2.5 px-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-8 h-8 rounded object-cover bg-slate-800 shrink-0"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                              <div>
                                <div className="font-semibold text-white line-clamp-1 max-w-xs">
                                  {p.name}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  PN: {p.partNumber || '-'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="capitalize text-slate-300">{p.category}</span>
                            <span className="text-slate-500 font-mono text-[10px] block">
                              {p.brand}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-amber-400 tabular-nums">
                            {formatRupiah(p.price)}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => quickUpdateStock(p.id, -1)}
                                className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold"
                              >
                                -
                              </button>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[11px] font-bold font-mono ${
                                  p.stock > 0
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : 'bg-rose-500/20 text-rose-400'
                                }`}
                              >
                                {p.stock}
                              </span>
                              <button
                                onClick={() => quickUpdateStock(p.id, 1)}
                                className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center font-bold"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">
                            {p.warrantyMonths} Bln
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => openProductModal(p)}
                                className="p-1.5 text-amber-300 hover:bg-amber-400/20 rounded cursor-pointer"
                                title="Edit Produk"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Hapus produk "${p.name}"?`)) {
                                    deleteProduct(p.id);
                                  }
                                }}
                                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/20 rounded cursor-pointer"
                                title="Hapus Produk"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BRANCHES */}
          {cmsActiveTab === 'branches' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Daftar Cabang Toko Fisik</h4>
                  <p className="text-xs text-slate-400">
                    Cabang toko resmi tempat pelanggan dapat konsultasi dan pasang langsung.
                  </p>
                </div>
                <button
                  onClick={() => openBranchModal(null)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Cabang Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {branches.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 font-mono">
                        Cabang {b.city}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openBranchModal(b)}
                          className="p-1.5 text-amber-300 hover:bg-slate-800 rounded cursor-pointer"
                          title="Edit Cabang"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus cabang ${b.city}?`)) {
                              deleteBranch(b.id);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded cursor-pointer"
                          title="Hapus Cabang"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm font-bold text-white">{b.mallName}</div>
                    <div className="text-xs text-slate-400">{b.address}</div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-850 font-mono">
                      <span>WA: {b.whatsapp}</span>
                      <span>Jam: {b.operationalHours}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BANNER & HERO */}
          {cmsActiveTab === 'banner' && (
            <div className="space-y-6 max-w-3xl">
              {/* Announcement Bar */}
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-amber-400" />
                    <span>Banner Pengumuman Toko Paling Atas</span>
                  </h4>
                  <button
                    onClick={openBannerModal}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Banner</span>
                  </button>
                </div>
                <div className="p-3 bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg">
                  {settings.announcement?.enabled ? settings.announcement.text : '(Banner dinonaktifkan)'}
                </div>
              </div>

              {/* Hero Section */}
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">Banner Utama & Kontak Toko</h4>
                  <button
                    onClick={openHeroModal}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Banner Utama & WhatsApp</span>
                  </button>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <div>
                    <strong>Judul:</strong> {settings.hero.titlePrefix} {settings.hero.titleHighlight}
                  </div>
                  <div>
                    <strong>Badge:</strong> {settings.hero.badge}
                  </div>
                  <div>
                    <strong>Deskripsi:</strong> {settings.hero.description}
                  </div>
                  <div>
                    <strong>WhatsApp Admin:</strong> +{settings.contacts.whatsappNumber}
                  </div>
                  <div>
                    <strong>Email:</strong> {settings.contacts.email}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ABOUT */}
          {cmsActiveTab === 'about' && (
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Bagian "Tentang Kevin 88 Computer"</h4>
                  <p className="text-xs text-slate-400">
                    Cerita sejarah sejak 2014, statistik pengalaman, dan 3 komitmen utama.
                  </p>
                </div>
                <button
                  onClick={openAboutModal}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Teks Cerita & Statistik</span>
                </button>
              </div>

              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="text-sm font-bold text-white">{settings.about?.title}</div>
                {(settings.about?.storyParagraphs || []).map((p, idx) => (
                  <p key={idx} className="text-xs text-slate-400 leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* TAB: FAQS */}
          {cmsActiveTab === 'faqs' && (
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Pertanyaan Sering Diajukan (FAQ)</h4>
                  <p className="text-xs text-slate-400">
                    Bantu pelanggan memahami garansi, konsultasi, dan pengiriman sparepart.
                  </p>
                </div>
                <button
                  onClick={() => openFaqModal(null)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Tanya Jawab FAQ</span>
                </button>
              </div>

              <div className="space-y-2">
                {(settings.faqs || []).map((faq) => (
                  <div
                    key={faq.id}
                    className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{faq.question}</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => openFaqModal(faq)}
                          className="p-1.5 text-amber-300 hover:bg-slate-800 rounded cursor-pointer"
                          title="Edit FAQ"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Hapus pertanyaan FAQ ini?')) {
                              deleteFaq(faq.id);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded cursor-pointer"
                          title="Hapus FAQ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: JUDUL SEKSI */}
          {cmsActiveTab === 'sections' && (
            <div className="space-y-6 max-w-3xl">
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Layout className="w-4 h-4 text-amber-400" />
                      <span>Kustomisasi Judul & Deskripsi Seksi Website</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Ubah judul besar, teks badge kecil, dan kalimat pengantar setiap seksi secara langsung.
                    </p>
                  </div>
                </div>

                {/* Section 1: Catalog */}
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-amber-400">1. Seksi Katalog Sparepart</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Badge Kecil</label>
                      <input
                        type="text"
                        value={settings.sectionHeaders?.catalogBadge || ''}
                        onChange={(e) => updateSectionHeaders({ catalogBadge: e.target.value })}
                        placeholder="Katalog Lengkap Bergaransi"
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Judul Utama</label>
                      <input
                        type="text"
                        value={settings.sectionHeaders?.catalogTitle || ''}
                        onChange={(e) => updateSectionHeaders({ catalogTitle: e.target.value })}
                        placeholder="Sparepart & Komponen Laptop"
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Deskripsi Seksi</label>
                    <input
                      type="text"
                      value={settings.sectionHeaders?.catalogDesc || ''}
                      onChange={(e) => updateSectionHeaders({ catalogDesc: e.target.value })}
                      placeholder="Baterai, charger, keyboard, LCD..."
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                {/* Section 2: Compatibility Checker */}
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-amber-400">2. Seksi Alat Cek Kompatibilitas</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Badge Kecil</label>
                      <input
                        type="text"
                        value={settings.sectionHeaders?.checkerBadge || ''}
                        onChange={(e) => updateSectionHeaders({ checkerBadge: e.target.value })}
                        placeholder="Pengecekan Akurat & Presisi"
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Judul Utama</label>
                      <input
                        type="text"
                        value={settings.sectionHeaders?.checkerTitle || ''}
                        onChange={(e) => updateSectionHeaders({ checkerTitle: e.target.value })}
                        placeholder="Cek Kompatibilitas Sparepart Laptop"
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Deskripsi Seksi</label>
                    <input
                      type="text"
                      value={settings.sectionHeaders?.checkerDesc || ''}
                      onChange={(e) => updateSectionHeaders({ checkerDesc: e.target.value })}
                      placeholder="Hindari salah beli voltase, pin soket..."
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                {/* Section 3: Branches */}
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-amber-400">3. Seksi Cabang Toko</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Badge Kecil</label>
                      <input
                        type="text"
                        value={settings.sectionHeaders?.branchesBadge || ''}
                        onChange={(e) => updateSectionHeaders({ branchesBadge: e.target.value })}
                        placeholder="Jaringan Cabang Fisik & Online"
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Judul Utama</label>
                      <input
                        type="text"
                        value={settings.sectionHeaders?.branchesTitle || ''}
                        onChange={(e) => updateSectionHeaders({ branchesTitle: e.target.value })}
                        placeholder="Kunjungi Cabang Toko Kevin 88 Computer"
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Deskripsi Seksi</label>
                    <input
                      type="text"
                      value={settings.sectionHeaders?.branchesDesc || ''}
                      onChange={(e) => updateSectionHeaders({ branchesDesc: e.target.value })}
                      placeholder="Kami melayani pembelian langsung di toko fisik..."
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                {/* Section 4: FAQ */}
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-amber-400">4. Seksi Pertanyaan Umum (FAQ)</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Badge Kecil</label>
                      <input
                        type="text"
                        value={settings.sectionHeaders?.faqBadge || ''}
                        onChange={(e) => updateSectionHeaders({ faqBadge: e.target.value })}
                        placeholder="Pertanyaan Umum"
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Judul Utama</label>
                      <input
                        type="text"
                        value={settings.sectionHeaders?.faqTitle || ''}
                        onChange={(e) => updateSectionHeaders({ faqTitle: e.target.value })}
                        placeholder="Frequently Asked Questions (FAQ)"
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Deskripsi Seksi</label>
                    <input
                      type="text"
                      value={settings.sectionHeaders?.faqDesc || ''}
                      onChange={(e) => updateSectionHeaders({ faqDesc: e.target.value })}
                      placeholder="Hal-hal yang sering ditanyakan seputar pembelian..."
                      className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FOOTER & KONTAK */}
          {cmsActiveTab === 'footer' && (
            <div className="space-y-6 max-w-3xl">
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <span>Pengaturan Footer, Alamat & Sosial Media</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Ubah ringkasan profil toko, alamat kantor pusat, tautan marketplace, dan hak cipta.
                    </p>
                  </div>
                  <button
                    onClick={() => openFooterModal('profile')}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Lengkap Footer</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Deskripsi Profil Toko di Footer
                    </label>
                    <textarea
                      rows={2}
                      value={settings.footer?.description || ''}
                      onChange={(e) => updateFooter({ description: e.target.value })}
                      placeholder="Toko spesialis sparepart laptop terpercaya sejak 2014..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Alamat Kantor Pusat / Toko Fisik Utama
                    </label>
                    <input
                      type="text"
                      value={settings.footer?.address || ''}
                      onChange={(e) => updateFooter({ address: e.target.value })}
                      placeholder="Jl. Mataram No. 88, Semarang & Orion Dusit Mangga Dua, Jakarta"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Teks Hak Cipta (Copyright)
                    </label>
                    <input
                      type="text"
                      value={settings.footer?.copyright || ''}
                      onChange={(e) => updateFooter({ copyright: e.target.value })}
                      placeholder="© 2014 - 2026 Kevin 88 Computer. Hak cipta dilindungi undang-undang."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <label className="block text-xs font-bold text-amber-400 mb-2">
                      Tautan Toko Online / Sosial Media
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">Instagram URL</span>
                        <input
                          type="text"
                          value={settings.footer?.socialLinks?.instagram || ''}
                          onChange={(e) =>
                            updateFooter({
                              socialLinks: {
                                ...(settings.footer?.socialLinks || {}),
                                instagram: e.target.value,
                              },
                            })
                          }
                          placeholder="https://instagram.com/kevin88computer"
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">Tokopedia URL</span>
                        <input
                          type="text"
                          value={settings.footer?.socialLinks?.tokopedia || ''}
                          onChange={(e) =>
                            updateFooter({
                              socialLinks: {
                                ...(settings.footer?.socialLinks || {}),
                                tokopedia: e.target.value,
                              },
                            })
                          }
                          placeholder="https://tokopedia.com/kevin88"
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">Shopee URL</span>
                        <input
                          type="text"
                          value={settings.footer?.socialLinks?.shopee || ''}
                          onChange={(e) =>
                            updateFooter({
                              socialLinks: {
                                ...(settings.footer?.socialLinks || {}),
                                shopee: e.target.value,
                              },
                            })
                          }
                          placeholder="https://shopee.co.id/kevin88computer"
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block mb-1">Google Maps URL</span>
                        <input
                          type="text"
                          value={settings.footer?.socialLinks?.googleMaps || ''}
                          onChange={(e) =>
                            updateFooter({
                              socialLinks: {
                                ...(settings.footer?.socialLinks || {}),
                                googleMaps: e.target.value,
                              },
                            })
                          }
                          placeholder="https://maps.google.com/?q=Kevin+88+Computer"
                          className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods Quick Management */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                        <CreditCard className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="font-bold text-white text-xs">
                          Metode Pembayaran, Rekening Bank & QRIS
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Atur nomor rekening BCA, Mandiri, BRI, BNI, QRIS, dan COD untuk checkout & nota.
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        closeCMSModal();
                        openPaymentModal();
                      }}
                      className="px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0"
                    >
                      Kelola Rekening & Pembayaran
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: BACKUP & RESTORE */}
          {cmsActiveTab === 'backup' && (
            <div className="space-y-6 max-w-3xl">
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Cadangkan Seluruh Data Toko (Export JSON)</h4>
                    <p className="text-xs text-slate-400">
                      Unduh file JSON berisi semua data logo, produk, cabang, dan teks website.
                    </p>
                  </div>
                </div>
                <button
                  onClick={exportBackup}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Backup Database Sekarang (.json)</span>
                </button>
              </div>

              {/* Import */}
              <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Pulihkan Data dari File Cadangan (Import JSON)</h4>
                    <p className="text-xs text-slate-400">
                      Pilih file .json cadangan untuk mengembalikan data toko Anda.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    id="cms-backup-file"
                    className="hidden"
                  />
                  <label
                    htmlFor="cms-backup-file"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 cursor-pointer border border-slate-700"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Pilih File Backup JSON</span>
                  </label>
                </div>
              </div>

              {/* Reset to Factory default */}
              <div className="p-5 bg-slate-950 rounded-2xl border border-rose-950/60 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-rose-300">Kembalikan ke Setelan Awal Pabrik</h4>
                    <p className="text-xs text-slate-400">
                      Hapus semua perubahan dan pulihkan data bawaan awal Kevin 88 Computer.
                    </p>
                  </div>
                </div>

                {showResetConfirm ? (
                  <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-lg flex items-center justify-between gap-3">
                    <span className="text-xs text-rose-300 font-semibold">
                      Yakin ingin mereset seluruh website ke awal?
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowResetConfirm(false)}
                        className="px-3 py-1 bg-slate-800 text-white text-xs rounded hover:bg-slate-700"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => {
                          resetToDefault();
                          setShowResetConfirm(false);
                        }}
                        className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded hover:bg-rose-500"
                      >
                        Ya, Reset Semua
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="px-4 py-2 bg-slate-900 hover:bg-rose-950/50 text-rose-400 border border-rose-800/40 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Data Toko</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span className="font-mono text-[11px]">
            Kevin 88 Computer · Sistem Pembaruan Langsung
          </span>
          <button
            onClick={closeCMSModal}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Tutup Panel
          </button>
        </div>
      </div>
    </div>
  );
};
