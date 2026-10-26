import React, { useState } from 'react';
import { useSiteData } from '../../context/SiteContext';
import {
  Settings,
  Plus,
  Megaphone,
  Sliders,
  EyeOff,
  Palette,
  Highlighter,
  ChevronDown,
  Layers,
  MapPin,
  HelpCircle,
  Users,
  Store,
  Compass,
  Download,
  Eye,
  Check,
  FileSpreadsheet,
  Upload,
  Globe,
  Share2,
  FileText,
  BarChart3,
  Star,
  ShieldCheck,
  TrendingUp,
  Bell,
  MessageSquare,
  QrCode,
} from 'lucide-react';
import { THEME_HIGHLIGHT_PRESETS, THEME_BACKGROUND_PRESETS, HIGHLIGHT_STYLES } from '../../utils/theme';
import { HighlightStyleOption } from '../../types';

export const AdminStatusBar: React.FC = () => {
  const {
    isAdminMode,
    toggleAdminMode,
    setAdminMode,
    openStoreOverviewOpen,
    orders,
    consultations,
    ownerNotifications,
    openThemeModal,
    openBackgroundModal,
    openShopeeModal,
    openPublishModal,
    publishWebsite,
    openOrdersModal,
    openProductModal,
    openBrandingModal,
    openBannerModal,
    openHeroModal,
    openAboutModal,
    openTechnicianModal,
    openBranchModal,
    openFaqModal,
    openTestimonialsModal,
    openAnalyticsModal,
    openWarrantyModal,
    openFooterModal,
    openSectionHeadersModal,
    openCMSModal,
    exportBackup,
    settings,
    updateTheme,
  } = useSiteData();

  const [isMinimized, setIsMinimized] = useState(false);
  const [showBlockMenu, setShowBlockMenu] = useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);

  const currentHighlight =
    settings.theme?.highlightColor || settings.theme?.primaryColor || '#f59e0b';
  const currentStyle = settings.theme?.highlightStyle || 'gradient';

  const pendingQrisCount = (orders || []).filter(
    (ord) =>
      (ord.paymentMethod === 'qris' || Boolean(ord.qrisValidation)) &&
      (ord.qrisValidation?.verificationStatus === 'pending_review' ||
        (!ord.qrisValidation && ord.paymentStatus !== 'paid'))
  ).length;

  if (!isAdminMode) {
    return null;
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-xl shadow-amber-400/30 transition-transform hover:scale-105 cursor-pointer"
          title="Buka toolbar editor Odoo"
        >
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse"></span>
          <span>Buka Toolbar Builder (Odoo)</span>
        </button>
        <button
          onClick={toggleAdminMode}
          className="p-2.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-white shadow-lg cursor-pointer"
          title="Matikan Mode Edit"
        >
          <EyeOff className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Toolbar Editor Website Ala Odoo"
      className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 z-40 max-w-4xl"
    >
      <div className="bg-slate-900/98 backdrop-blur-xl border border-amber-400/60 rounded-2xl p-2 sm:p-2.5 shadow-2xl shadow-black/90 space-y-2 text-xs">
        {/* Top Mini-Row: Odoo Brand + Quick Highlight Color Swatches */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 pt-0.5 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="font-extrabold text-white tracking-tight flex items-center gap-1.5">
              <span>Mode Kelola Owner</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">
                ACTIVE
              </span>
            </span>
            <span className="hidden md:flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Cloud Real-time Sync</span>
            </span>

            <button
              type="button"
              onClick={openStoreOverviewOpen}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/10 hover:bg-amber-400/25 text-amber-300 border border-amber-400/40 text-[10px] font-black cursor-pointer transition-colors shadow-sm"
              title="Buka Dasbor Toko & Performa Penjualan"
            >
              <TrendingUp className="w-3 h-3 text-amber-400" />
              <span>Dasbor Toko</span>
              {ownerNotifications.length > 0 && (
                <span className="px-1 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black">
                  {ownerNotifications.length}
                </span>
              )}
            </button>
          </div>

          {/* Quick Highlight Swatches Bar right on Toolbar */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
              <Highlighter className="w-3 h-3 text-amber-400" />
              <span>Warna Highlight:</span>
            </span>
            {THEME_HIGHLIGHT_PRESETS.slice(0, 8).map((preset) => {
              const isSelected = currentHighlight.toLowerCase() === preset.color.toLowerCase();
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() =>
                    updateTheme({
                      highlightColor: preset.color,
                      highlightSecondaryColor: preset.secondary,
                    })
                  }
                  title={`Ubah warna teks highlight ke ${preset.name}`}
                  className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform hover:scale-125 cursor-pointer shadow-sm ${
                    isSelected ? 'ring-2 ring-white scale-110 shadow-md' : 'opacity-85 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: preset.color }}
                >
                  {isSelected && <Check className="w-3 h-3 text-slate-950 stroke-[3]" />}
                </button>
              );
            })}

            {/* Quick Highlight Style Pill */}
            <div className="flex items-center gap-1 pl-1.5 border-l border-slate-800">
              {['gradient', 'solid', 'glow', 'marker'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => updateTheme({ highlightStyle: st as HighlightStyleOption })}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                    currentStyle === st
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {st === 'gradient'
                    ? 'Gradien'
                    : st === 'solid'
                    ? 'Solid'
                    : st === 'glow'
                    ? 'Glow'
                    : 'Stabilo'}
                </button>
              ))}

              {/* Quick Contrast Booster Toggle */}
              <button
                type="button"
                onClick={() =>
                  updateTheme({
                    highContrastMode: !settings.theme?.highContrastMode,
                  })
                }
                className={`ml-1 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  settings.theme?.highContrastMode
                    ? 'bg-emerald-400 text-slate-950 shadow-sm'
                    : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-700'
                }`}
                title="Menajamkan dan memperjelas seluruh teks di layar jika ada yang kurang terlihat"
              >
                <Eye className="w-3 h-3" />
                <span>{settings.theme?.highContrastMode ? 'Kontras: ON' : 'Kontras Teks'}</span>
              </button>
            </div>

            {/* Quick Background Color Swatches Bar */}
            <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                <Palette className="w-3 h-3 text-amber-400" />
                <span>Background:</span>
              </span>
              {THEME_BACKGROUND_PRESETS.slice(0, 6).map((bgP) => {
                const isSelected =
                  settings.theme?.backgroundMode === bgP.id ||
                  settings.theme?.customBgColor?.toLowerCase() === bgP.bg.toLowerCase();
                return (
                  <button
                    key={bgP.id}
                    type="button"
                    onClick={() =>
                      updateTheme({
                        backgroundMode: bgP.id,
                        customBgColor: bgP.bg,
                        customCardColor: bgP.card,
                        customTextColor: bgP.text,
                        navbarBgColor: bgP.navbar,
                      })
                    }
                    title={`Ubah background ke: ${bgP.name}`}
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform hover:scale-125 cursor-pointer shadow-sm border border-slate-700 ${
                      isSelected ? 'ring-2 ring-amber-400 scale-110 shadow-md' : 'opacity-85 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: bgP.bg }}
                  >
                    {isSelected && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: bgP.text === '#ffffff' ? '#ffffff' : '#020617' }}
                      />
                    )}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={openBackgroundModal}
                className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors cursor-pointer"
                title="Buka panel lengkap kustomisasi warna background"
              >
                +Warna
              </button>
            </div>
          </div>
        </div>

        {/* Main Action Bar Row */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-0.5">
          {/* Section Jumper Dropdown (Odoo Block Navigator) */}
          <div className="relative">
            <button
              onClick={() => setShowBlockMenu(!showBlockMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all cursor-pointer shadow-sm"
              title="Pilih bagian website yang ingin diedit langsung"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Edit Blok / Seksi</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showBlockMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 space-y-1">
                <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Klik untuk Langsung Edit:
                </div>
                {[
                  { name: '1. Pengumuman Banner Atas', action: openBannerModal, icon: Megaphone },
                  { name: '2. Logo, Merk & Identitas', action: openBrandingModal, icon: Store },
                  { name: '3. Hero Banner & Kata Highlight', action: openHeroModal, icon: Highlighter },
                  { name: '4. 🎨 Warna Background & Latar Toko', action: openBackgroundModal, icon: Palette },
                  { name: '5. Judul Seluruh Seksi Web', action: openSectionHeadersModal, icon: Compass },
                  { name: '6. Katalog & Data Produk', action: () => openCMSModal('products'), icon: Sliders },
                  { name: '7. 📦 Upload Produk Shopee (.xlsx/.csv)', action: openShopeeModal, icon: FileSpreadsheet },
                  { name: '8. Tentang Kevin 88', action: openAboutModal, icon: Users },
                  { name: '9. Cabang Toko Fisik', action: openBranchModal, icon: MapPin },
                  { name: '10. Pertanyaan Umum (FAQ)', action: openFaqModal, icon: HelpCircle },
                  { name: '11. 🛡️ Cek & Verifikasi Garansi', action: () => openWarrantyModal(), icon: ShieldCheck },
                  { name: '12. ⭐ Testimoni Pelanggan', action: () => openTestimonialsModal(null), icon: Star },
                  { name: '13. 📊 Analytics Penjualan & Revenue', action: openAnalyticsModal, icon: BarChart3 },
                  { name: '14. Footer, Alamat & Sosmed', action: openFooterModal, icon: Compass },
                  { name: '15. 🌐 Publikasikan / Link Customer', action: openPublishModal, icon: Globe },
                  { name: '16. 🧾 Nota Pesanan & Status Bayar', action: openOrdersModal, icon: FileText },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        item.action();
                        setShowBlockMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-amber-400 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5">
            {/* Publish & Switch to Customer Button */}
            <button
              onClick={publishWebsite}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold shadow-md shadow-emerald-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Publikasikan Website & Langsung Beralih ke Tampilan Customer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Publikasi Toko</span>
            </button>

            {/* Store Overview Dashboard (Recharts: Daily Sales Trends, Top Products, Live Consultations) */}
            <button
              onClick={openStoreOverviewOpen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-extrabold shadow-md shadow-amber-400/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Buka Dasbor Toko: Tren Penjualan Harian (Recharts), Sparepart Terlaris & Konsultasi Pelanggan Aktif"
            >
              <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Dasbor Toko</span>
              {consultations.filter((c) => c.status === 'pending').length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-amber-400 text-[10px] font-black animate-pulse">
                  {consultations.filter((c) => c.status === 'pending').length}
                </span>
              )}
            </button>

            {/* Payment Status Tracker (QRIS Validation) */}
            <button
              onClick={() => openStoreOverviewOpen('qris_tracker')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                pendingQrisCount > 0
                  ? 'bg-amber-400 text-slate-950 font-extrabold shadow-md shadow-amber-400/30 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30'
              }`}
              title="Buka Tracker Status Pembayaran QRIS & Riwayat Bukti Transfer"
            >
              <QrCode className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Validasi QRIS</span>
              {pendingQrisCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-amber-400 text-[10px] font-black">
                  {pendingQrisCount}
                </span>
              )}
            </button>

            {/* Orders & Invoices History */}
            <button
              onClick={openOrdersModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold border border-amber-400/30 transition-all cursor-pointer"
              title="Lihat semua nota pesanan yang masuk dan verifikasi pembayaran"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Nota Pesanan</span>
            </button>

            {/* Analytics Dashboard Button */}
            <button
              onClick={openAnalyticsModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold shadow-md shadow-amber-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Buka Dasbor Analytics: Total Revenue, Sparepart Terlaris & Grafik Penjualan Bulanan"
            >
              <BarChart3 className="w-3.5 h-3.5 text-slate-950" />
              <span>Analytics</span>
            </button>

            {/* Switch to Customer View */}
            <button
              onClick={() => {
                setAdminMode(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white font-bold border border-amber-400/40 transition-all cursor-pointer shadow-sm active:scale-95"
              title="Pratinjau toko bersih persis seperti yang diakses pelanggan"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>Lihat Tampilan Customer</span>
            </button>

            {/* Shopee Button */}
            <button
              onClick={openShopeeModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-extrabold shadow-md shadow-orange-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Upload file Excel atau CSV produk dari Shopee Seller Centre"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Upload Shopee</span>
            </button>
            {/* Background Button */}
            <button
              onClick={openBackgroundModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold shadow-md shadow-indigo-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
              title="Kustomisasi Warna Background Halaman, Kartu & Latar Toko"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Warna Background</span>
            </button>

            <button
              onClick={openThemeModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold border border-amber-400/40 transition-all cursor-pointer"
              title="Kustomisasi Warna, Latar & Gaya Lengkap"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Warna & Tema</span>
            </button>

            <button
              onClick={() => openProductModal(null)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 transition-all cursor-pointer"
              title="Tambah produk sparepart baru"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">+ Produk</span>
            </button>

            <button
              onClick={() => openBranchModal(null)}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 transition-all cursor-pointer"
              title="Tambah cabang baru"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ Cabang</span>
            </button>

            <button
              onClick={() => openFaqModal(null)}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 transition-all cursor-pointer"
              title="Tambah pertanyaan FAQ baru"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              <span>+ FAQ</span>
            </button>

            <button
              onClick={() => openCMSModal('products')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 transition-all cursor-pointer"
              title="Buka Pusat Kontrol Live CMS Lengkap"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Pusat Kontrol</span>
            </button>

            <button
              onClick={exportBackup}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Unduh Backup Database JSON"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Kecilkan toolbar editor"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
