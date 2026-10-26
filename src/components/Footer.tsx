import React from 'react';
import {
  Mail,
  Phone,
  Edit2,
  MapPin,
  Instagram,
  ShoppingBag,
  Globe,
  Share2,
  Layers,
  HelpCircle,
  ShieldCheck,
  Truck,
  CreditCard,
} from 'lucide-react';
import { useSiteData } from '../context/SiteContext';
import { OdooBlockControl } from './admin/OdooBlockControl';

export const Footer: React.FC = () => {
  const {
    settings,
    isAdminMode,
    toggleAdminMode,
    openBrandingModal,
    openFooterModal,
    openPublishModal,
    openWarrantyModal,
    openBackgroundModal,
    requestAdminMode,
    openOwnerAuthModal,
  } = useSiteData();

  const branding = settings.branding;
  const footer = settings.footer;
  const whatsappNum = settings.contacts?.whatsappNumber || '6281288880014';
  const emailAddr = settings.contacts?.email || 'kevindiocm@gmail.com';
  const phoneCS = settings.contacts?.phone || '024-8458-888';
  const socials = footer?.socialLinks;

  // Dynamic Categories (Column 2)
  const categoriesTitle = footer?.categoriesTitle || 'Kategori Sparepart';
  const categoriesList =
    footer?.categoriesList && footer.categoriesList.length > 0
      ? footer.categoriesList
      : [
          'Baterai Laptop Original',
          'Charger & Adaptor Laptop',
          'Keyboard Standar & Backlight',
          'Layar LCD / LED Slim 144Hz',
          'RAM SODIMM DDR4 & DDR5',
          'SSD M.2 NVMe PCIe 4.0',
          'Fan Pendingin & Heatsink',
        ];

  // Dynamic Services (Column 3)
  const servicesTitle = footer?.servicesTitle || 'Layanan Pelanggan';
  const servicesList =
    footer?.servicesList && footer.servicesList.length > 0
      ? footer.servicesList
      : [
          { label: 'Tentang Kevin 88', actionId: 'tentang-kami' },
          { label: 'Katalog Sparepart Lengkap', actionId: 'katalog' },
          { label: 'Lokasi Cabang Toko', actionId: 'cabang' },
          { label: 'Tanya Jawab (FAQ)', actionId: 'faq' },
          { label: 'Testimoni Pelanggan', actionId: 'testimoni' },
          { label: 'Cek Garansi Sparepart', actionId: 'warranty' },
        ];

  // Dynamic Warranty & Payment (Column 4)
  const warrantyTitle = footer?.warrantyTitle || 'Garansi & Pengiriman';
  const warrantyDesc =
    footer?.warrantyDescription ||
    'Setiap pembelian sparepart dilengkapi nota resmi dan segel hologram toko. Garansi tukar unit baru jika ada cacat pabrik.';
  const warrantyBtnText = footer?.warrantyButtonText || 'Verifikasi Garansi Online';
  const couriers =
    footer?.courierList && footer.courierList.length > 0
      ? footer.courierList
      : ['JNE', 'J&T', 'SiCepat', 'GoSend'];
  const banks =
    footer?.bankList && footer.bankList.length > 0
      ? footer.bankList
      : ['BCA', 'Mandiri', 'BRI', 'QRIS'];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleServiceClick = (actionId?: string) => {
    if (actionId === 'warranty') {
      openWarrantyModal();
    } else if (actionId) {
      scrollTo(actionId);
    } else {
      scrollTo('katalog');
    }
  };

  return (
    <footer className={`bg-slate-950 text-slate-400 text-xs border-t border-slate-800 relative ${isAdminMode ? 'odoo-editable-block' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Odoo Standard Block Control */}
        {isAdminMode && (
          <OdooBlockControl
            blockId="footer"
            blockName="Footer, Alamat & Sosmed"
            onEdit={() => openFooterModal('profile')}
            onCustomizeBg={openBackgroundModal}
            extraActions={[
              { label: 'Ganti Logo', onClick: openBrandingModal, variant: 'secondary' },
              { label: 'Edit Kategori', onClick: () => openFooterModal('categories'), variant: 'secondary' },
              { label: 'Edit Layanan', onClick: () => openFooterModal('services'), variant: 'secondary' },
              { label: 'Edit Garansi & Bank', onClick: () => openFooterModal('warranty'), variant: 'secondary' },
            ]}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1-2: Brand, Address & Socials */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 text-white text-base font-bold">
                {branding?.logoImageUrl && (
                  <img
                    src={branding.logoImageUrl}
                    alt={branding.brandName}
                    className="w-7 h-7 rounded object-cover border border-amber-500/30 bg-white p-0.5"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                )}
                <span>
                  {branding?.brandName || 'Kevin 88'}{' '}
                  <span
                    className="highlight-text font-bold"
                    style={{
                      color: branding?.brandHighlightColor || 'var(--theme-highlight, #f59e0b)',
                    }}
                  >
                    {branding?.brandHighlight || 'Computer'}
                  </span>
                </span>
              </div>

              {isAdminMode && (
                <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                  <button
                    onClick={openBrandingModal}
                    className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold hover:bg-amber-400/30 border border-amber-400/40 cursor-pointer"
                    title="Ganti Logo Toko"
                  >
                    <Edit2 className="w-3 h-3 inline mr-1" />
                    Edit Logo
                  </button>
                  <button
                    onClick={() => openFooterModal('profile')}
                    className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-[10px] font-semibold hover:bg-slate-700 border border-slate-700 cursor-pointer"
                    title="Edit Profil & Kontak Toko"
                  >
                    <Edit2 className="w-3 h-3 inline mr-1" />
                    Edit Info
                  </button>
                </div>
              )}
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              {footer?.description ||
                'Toko spesialis sparepart laptop terpercaya sejak 2014. Menyediakan baterai, charger, keyboard, LCD/LED, RAM, SSD, dan fan laptop bergaransi resmi untuk end-user, teknisi, dan bengkel servis.'}
            </p>

            <div className="pt-1 space-y-1.5 text-slate-300">
              {footer?.address && (
                <div className="flex items-start gap-2 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{footer.address}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <a href={`mailto:${emailAddr}`} className="hover:text-white transition-colors">
                  {emailAddr}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <a href={`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}`} className="hover:text-white transition-colors font-mono">
                  +{whatsappNum} (WhatsApp Admin)
                </a>
              </div>
              {phoneCS && (
                <div className="text-[11px] text-slate-500 font-mono pl-5.5">
                  Telp Kantor: {phoneCS}
                </div>
              )}
            </div>

            {/* Social Media & Marketplace Chips */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              {socials?.instagram && (
                <a
                  href={socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-pink-400 hover:text-white hover:border-pink-500/50 transition-colors"
                  title="Instagram Kevin 88 Computer"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {socials?.tokopedia && (
                <a
                  href={socials.tokopedia}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 hover:text-white hover:border-emerald-500/50 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  title="Tokopedia Toko"
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>Tokopedia</span>
                </a>
              )}
              {socials?.shopee && (
                <a
                  href={socials.shopee}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-orange-400 hover:text-white hover:border-orange-500/50 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  title="Shopee Toko"
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>Shopee</span>
                </a>
              )}
              {socials?.tiktok && (
                <a
                  href={socials.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors"
                  title="TikTok Toko"
                >
                  <span>TikTok</span>
                </a>
              )}
              {socials?.googleMaps && (
                <a
                  href={socials.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  title="Google Maps Lokasi"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Maps</span>
                </a>
              )}
              {isAdminMode && (
                <button
                  type="button"
                  onClick={() => openFooterModal('socials')}
                  className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                  title="Edit Link Sosmed & Toko Online"
                >
                  <Edit2 className="w-2.5 h-2.5 text-amber-400" />
                  <span>Edit Sosmed</span>
                </button>
              )}
            </div>
          </div>

          {/* Col 3: Kategori Part (Column 2) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-white uppercase tracking-wider">
                {categoriesTitle}
              </div>
              {isAdminMode && (
                <button
                  type="button"
                  onClick={() => openFooterModal('categories')}
                  className="p-1 rounded bg-slate-850 hover:bg-slate-800 text-amber-400 border border-slate-700 text-[10px] cursor-pointer flex items-center gap-1"
                  title="Ubah Daftar Kategori Sparepart"
                >
                  <Edit2 className="w-2.5 h-2.5" />
                  <span>Edit</span>
                </button>
              )}
            </div>
            <ul className="space-y-2">
              {categoriesList.map((cat, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => scrollTo('katalog')}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left truncate max-w-full"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Layanan Pelanggan (Column 3) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-white uppercase tracking-wider">
                {servicesTitle}
              </div>
              {isAdminMode && (
                <button
                  type="button"
                  onClick={() => openFooterModal('services')}
                  className="p-1 rounded bg-slate-850 hover:bg-slate-800 text-amber-400 border border-slate-700 text-[10px] cursor-pointer flex items-center gap-1"
                  title="Ubah Daftar Layanan Pelanggan"
                >
                  <Edit2 className="w-2.5 h-2.5" />
                  <span>Edit</span>
                </button>
              )}
            </div>
            <ul className="space-y-2">
              {servicesList.map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleServiceClick(item.actionId)}
                    className={`hover:text-amber-400 transition-colors cursor-pointer text-left truncate max-w-full flex items-center gap-1 ${
                      item.actionId === 'warranty' ? 'text-emerald-400 font-semibold hover:text-emerald-300' : ''
                    }`}
                  >
                    {item.actionId === 'warranty' && <span className="text-xs">🛡️</span>}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Garansi & Pengiriman (Column 4) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-white uppercase tracking-wider">
                {warrantyTitle}
              </div>
              {isAdminMode && (
                <button
                  type="button"
                  onClick={() => openFooterModal('warranty')}
                  className="p-1 rounded bg-slate-850 hover:bg-slate-800 text-amber-400 border border-slate-700 text-[10px] cursor-pointer flex items-center gap-1"
                  title="Ubah Garansi, Kurir, dan Bank"
                >
                  <Edit2 className="w-2.5 h-2.5" />
                  <span>Edit</span>
                </button>
              )}
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              {warrantyDesc}
            </p>
            <button
              onClick={() => openWarrantyModal()}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 font-semibold border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
            >
              <span>{warrantyBtnText}</span>
            </button>

            {/* Courier Badges */}
            <div className="pt-2 flex flex-wrap gap-1.5 font-mono text-[10px] text-slate-300">
              {couriers.map((c, idx) => (
                <span key={idx} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">
                  {c}
                </span>
              ))}
            </div>

            {/* Payment & Bank Badges */}
            <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-slate-300">
              {banks.map((b, idx) => (
                <span key={idx} className="px-2 py-1 bg-slate-900 border border-slate-800 rounded">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar with Metadata and Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              onClick={(e) => {
                if (e.detail === 3) {
                  requestAdminMode();
                }
              }}
              className="cursor-default select-none"
            >
              {footer?.copyright || '© 2014 - 2026 Kevin 88 Computer. Hak cipta dilindungi undang-undang.'}
            </span>
            {isAdminMode && (
              <button
                type="button"
                onClick={() => openFooterModal('warranty')}
                className="text-amber-400 hover:underline text-[10px] ml-1 cursor-pointer"
              >
                (Ubah Copyright)
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-amber-400/80 font-mono">
              {footer?.tagline || 'Spesialis Sparepart Laptop Sejak 2014'}
            </span>

            {isAdminMode ? (
              <>
                <button
                  type="button"
                  onClick={openPublishModal}
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Bagikan link toko untuk pelanggan"
                >
                  <Globe className="w-3 h-3 text-emerald-400" />
                  <span>Link Toko Customer</span>
                </button>

                <button
                  type="button"
                  onClick={toggleAdminMode}
                  className="hover:text-amber-400 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Beralih ke Tampilan Pengunjung (Sembunyikan Tombol Edit)"
                >
                  <span>👁️ Tampilan Customer</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={openOwnerAuthModal}
                className="hover:text-amber-400 text-slate-500 hover:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer text-[11px]"
                title="Masuk sebagai Pemilik Toko untuk mengelola website & katalog"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500/80" />
                <span>Portal Pemilik Toko (Login Owner)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
