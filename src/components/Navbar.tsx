import React, { useState } from 'react';
import {
  ShoppingBag,
  MessageSquare,
  Menu,
  X,
  Settings,
  Edit2,
  FileText,
  Globe,
  Eye,
  ShieldCheck,
  Lock,
  User,
  LogOut,
  ChevronDown,
  BarChart3,
  TrendingUp,
} from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenConsultation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onOpenConsultation }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const {
    settings,
    isAdminMode,
    isOwner,
    setAdminMode,
    openStoreOverviewOpen,
    openCMSModal,
    openBrandingModal,
    openOrdersModal,
    openPublishModal,
    openAnalyticsModal,
    openWarrantyModal,
    openOwnerAuthModal,
    publishWebsite,
    showToast,
    currentUser,
    loginWithGoogle,
    logout,
  } = useSiteData();

  const rawBranding = settings.branding || {
    logoMode: 'both',
    logoImageUrl: '/assets/images/kevin88_logo.jpg',
    badgeText: '',
    brandName: 'Kevin 88',
    brandHighlight: 'Computer',
    tagline: 'Spesialis Sparepart Laptop Sejak 2014',
  };

  const branding = {
    ...rawBranding,
    brandName: (rawBranding.brandName || 'Kevin 88').replace(/[\r\n]+/g, ' ').trim(),
    brandHighlight: (rawBranding.brandHighlight || 'Computer').replace(/[\r\n]+/g, ' ').trim(),
  };

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md border-b border-slate-800/80 transition-colors"
      style={{
        backgroundColor: branding.navbarBgColor || settings.theme?.navbarBgColor || 'rgba(2, 6, 23, 0.94)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Logo & Brand Name with direct In-Place Edit Trigger - GUARANTEED MENDATAR (HORIZONTAL) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div
              onClick={isAdminMode ? openBrandingModal : undefined}
              className={`text-base sm:text-lg lg:text-xl font-bold tracking-tight inline-flex items-center gap-1.5 sm:gap-2 flex-nowrap whitespace-nowrap shrink-0 group ${
                isAdminMode ? 'cursor-pointer' : ''
              }`}
              title={isAdminMode ? 'Klik untuk mengganti logo, teks merk, atau warna nama toko' : undefined}
            >
              {/* Image Logo */}
              {branding.logoImageUrl && (
                <img
                  src={branding.logoImageUrl}
                  alt={branding.brandName}
                  className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 rounded-lg object-contain shrink-0 border border-slate-700/60 group-hover:border-amber-400/50 transition-colors shadow-sm bg-white p-0.5"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              )}

              {/* Brand Wordmark with guaranteed horizontal inline flat alignment (MENDATAR SATU BARIS) */}
              {branding.logoMode !== 'image' && (
                <span className="inline-flex items-center flex-nowrap whitespace-nowrap gap-1.5 font-extrabold leading-none shrink-0">
                  <span
                    className="brand-wordmark-title font-extrabold whitespace-nowrap inline-flex items-center leading-none shrink-0"
                    style={{
                      color: branding.brandNameColor || 'var(--theme-brand-name, #ffffff)',
                    }}
                  >
                    {branding.brandName}
                  </span>
                  <span
                    className="highlight-text font-extrabold whitespace-nowrap inline-flex items-center leading-none shrink-0"
                    style={{
                      color: branding.brandHighlightColor || 'var(--theme-highlight, #f59e0b)',
                    }}
                  >
                    {branding.brandHighlight}
                  </span>
                </span>
              )}
            </div>

            {/* In-place Logo & Brand Edit Trigger when Admin Mode is ON */}
            {isAdminMode && (
              <button
                onClick={openBrandingModal}
                className="ml-0.5 sm:ml-1 shrink-0 inline-flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold hover:bg-amber-400/30 transition-colors cursor-pointer shadow-sm"
                title="Ganti logo, warna nama 'Kevin 88', dan warna highlight"
              >
                <Edit2 className="w-3 h-3 shrink-0" />
                <span className="hidden sm:inline">Warna & Logo</span>
              </button>
            )}
          </div>

          {/* Zone 2: clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => scrollTo('tentang-kami')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Tentang Kami
            </button>
            <button
              onClick={() => scrollTo('katalog')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Katalog Produk
            </button>
            <button
              onClick={() => scrollTo('cabang')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Cabang
            </button>
            <button
              onClick={() => scrollTo('faq')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollTo('testimoni')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Testimoni
            </button>
          </nav>

          {/* Zone 3: Actions + Role Switcher + Google Auth + Cek Nota */}
          <div className="flex items-center gap-2">
            {/* Google Authentication Account / Sign-In Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-colors cursor-pointer"
                  title={currentUser.displayName || currentUser.email || 'Akun Google'}
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Akun'}
                      className="w-5 h-5 rounded-full object-cover border border-amber-400/50"
                    />
                  ) : (
                    <User className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span className="hidden xl:inline text-xs font-medium max-w-[80px] truncate">
                    {currentUser.displayName?.split(' ')[0] || 'Akun'}
                  </span>
                  {isAdminMode && currentUser.role === 'admin' && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                      Owner
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 z-50 space-y-2">
                    <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover border border-amber-400/50"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 font-bold">
                          {(currentUser.displayName || 'U')[0]}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-white truncate">
                          {currentUser.displayName || 'Pengguna'}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {currentUser.email}
                        </div>
                        <div className="text-[10px] font-semibold text-amber-400 mt-0.5">
                          {isAdminMode && currentUser.role === 'admin' ? '👑 Owner / Admin' : '👤 Pelanggan'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        openOrdersModal();
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>Riwayat Nota & Pembelian</span>
                    </button>

                    {(isAdminMode || isOwner) && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          openStoreOverviewOpen();
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-amber-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition-colors font-bold"
                      >
                        <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                        <span>Dasbor Toko (Recharts)</span>
                      </button>
                    )}

                    {isAdminMode && currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          openAnalyticsModal();
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-blue-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                        <span>Google Analytics & Trafik</span>
                      </button>
                    )}

                    {isAdminMode && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setAdminMode(false);
                          showToast('Beralih ke Tampilan Customer (Mode Bersih)', 'info');
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-amber-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>Lihat Tampilan Customer</span>
                      </button>
                    )}

                    {isOwner && !isAdminMode && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setAdminMode(true);
                          showToast('Beralih ke Mode Kelola Owner', 'success');
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-amber-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition-colors font-bold"
                      >
                        <Settings className="w-3.5 h-3.5 text-amber-400" />
                        <span>👑 Mode Kelola Owner</span>
                      </button>
                    )}

                    {!isOwner && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          openOwnerAuthModal();
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Login Pemilik (PIN Owner)</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 flex items-center gap-2 cursor-pointer transition-colors pt-2 border-t border-slate-800/80"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-900 shadow-sm transition-all cursor-pointer"
                title="Masuk dengan akun Google untuk simpan nota & pesanan"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="hidden sm:inline">Masuk</span>
              </button>
            )}

            {/* Cek Nota / Pesanan Saya (for both Customer and Owner) */}
            <button
              onClick={openOrdersModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-700/80 transition-colors cursor-pointer"
              title="Cek Riwayat Nota & Status Pembayaran Pesanan Anda"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Cek Nota</span>
            </button>

            {/* Cek Garansi Modal Trigger (Always Visible) */}
            <button
              onClick={() => openWarrantyModal()}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer shadow-sm shadow-emerald-500/10 active:scale-95 shrink-0"
              title="Verifikasi S/N atau No. Nota untuk Periksa Masa Garansi"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-bold text-[11px] sm:text-xs">Cek Garansi</span>
            </button>

            {/* Owner Mode Actions */}
            {isAdminMode ? (
              <>
                {/* Publish to Customer Button */}
                <button
                  onClick={publishWebsite}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
                  title="Simpan editan & langsung beralih ke Tampilan Customer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Publikasi Toko</span>
                </button>

                {/* Switch to Customer Mode Pill */}
                <button
                  onClick={() => {
                    setAdminMode(false);
                    showToast('Beralih ke Tampilan Customer (Tombol editor disembunyikan)', 'info');
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/40 transition-colors cursor-pointer"
                  title="Lihat website persis seperti yang dilihat pelanggan"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Lihat Customer</span>
                </button>

                {/* Live CMS Trigger */}
                <button
                  onClick={() => openCMSModal('branding')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                  title="Kelola & Update Semua Bagian Website Langsung"
                >
                  <Settings className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Kelola Web</span>
                </button>

                {/* Store Overview Dashboard Trigger (Recharts) */}
                <button
                  onClick={openStoreOverviewOpen}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-400/20 to-orange-400/20 hover:from-amber-400/30 hover:to-orange-400/30 text-amber-300 border border-amber-400/40 transition-colors cursor-pointer"
                  title="Lihat Dasbor Toko, Tren Omset Recharts & Konsultasi"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline">Dasbor Toko</span>
                </button>

                {/* Google Analytics & Trafik Trigger */}
                <button
                  onClick={openAnalyticsModal}
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 transition-colors cursor-pointer"
                  title="Lihat Statistik Kunjungan Google Analytics & Halaman Terpopuler"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden xl:inline">Trafik & GA4</span>
                </button>
              </>
            ) : isOwner ? (
              <button
                onClick={() => {
                  setAdminMode(true);
                  showToast('Beralih ke Mode Kelola Owner', 'success');
                }}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 transition-colors cursor-pointer"
                title="Beralih kembali ke Mode Kelola Owner"
              >
                <Settings className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden lg:inline">Kelola Toko</span>
              </button>
            ) : null}

            <button
              onClick={onOpenCart}
              className="relative p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Buka Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center font-mono">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenConsultation}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm shadow-amber-500/10"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Konsultasi</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-900/95 px-4 pt-2 pb-4 space-y-2 text-sm font-medium">
          {/* Mobile User Profile & Google Login */}
          <div className="pt-1 pb-2 border-b border-slate-800">
            {currentUser ? (
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-850 border border-slate-800">
                <div className="flex items-center gap-2 overflow-hidden">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover border border-amber-400/50"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 font-bold text-xs">
                      {(currentUser.displayName || 'U')[0]}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white truncate">
                      {currentUser.displayName || 'Pengguna'}
                    </div>
                    <div className="text-[10px] text-amber-400">
                      {currentUser.role === 'admin' ? 'Owner / Admin' : 'Pelanggan'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold text-rose-400 hover:bg-rose-950/40 rounded border border-rose-500/30"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  loginWithGoogle();
                }}
                className="w-full py-2 px-3 rounded-lg bg-white text-slate-900 font-bold text-xs flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Masuk dengan Google</span>
              </button>
            )}
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openOrdersModal();
            }}
            className="w-full text-left py-2 px-3 text-amber-300 hover:bg-slate-800 rounded-md flex items-center gap-2 font-semibold"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Cek Nota & Riwayat Pesanan</span>
          </button>

          {isAdminMode && (
            <>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  publishWebsite();
                }}
                className="w-full text-left py-2 px-3 text-emerald-400 hover:bg-slate-800 rounded-md flex items-center gap-2 font-semibold"
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Publikasikan Toko ke Customer</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAdminMode(false);
                  showToast('Beralih ke Tampilan Customer', 'info');
                }}
                className="w-full text-left py-2 px-3 text-amber-400 hover:bg-slate-800 rounded-md flex items-center gap-2"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Lihat Tampilan Customer</span>
              </button>
            </>
          )}

          {isOwner && !isAdminMode && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setAdminMode(true);
                showToast('Beralih ke Mode Kelola Owner', 'success');
              }}
              className="w-full text-left py-2 px-3 text-amber-300 hover:bg-slate-800 rounded-md flex items-center gap-2 font-bold"
            >
              <Settings className="w-4 h-4 text-amber-400" />
              <span>👑 Buka Mode Kelola Owner</span>
            </button>
          )}

          {!isOwner && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openOwnerAuthModal();
              }}
              className="w-full text-left py-2 px-3 text-slate-300 hover:bg-slate-800 rounded-md flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Login Pemilik Toko (PIN)</span>
            </button>
          )}

          <button
            onClick={() => scrollTo('tentang-kami')}
            className="w-full text-left py-2 px-3 text-slate-200 hover:bg-slate-800 rounded-md"
          >
            Tentang Kami
          </button>
          <button
            onClick={() => scrollTo('katalog')}
            className="w-full text-left py-2 px-3 text-slate-200 hover:bg-slate-800 rounded-md"
          >
            Katalog Produk
          </button>
          <button
            onClick={() => scrollTo('cabang')}
            className="w-full text-left py-2 px-3 text-slate-200 hover:bg-slate-800 rounded-md"
          >
            Cabang
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openWarrantyModal();
            }}
            className="w-full text-left py-2.5 px-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold rounded-lg flex items-center gap-2 shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>🛡️ Cek Masa Garansi Sparepart</span>
          </button>
          <button
            onClick={() => scrollTo('faq')}
            className="w-full text-left py-2 px-3 text-slate-200 hover:bg-slate-800 rounded-md"
          >
            FAQ
          </button>
        </div>
      )}
    </header>
  );
};
