import React, { useState, useEffect } from 'react';
import { useSiteData } from '../../context/SiteContext';
import {
  FileText,
  X,
  Check,
  Instagram,
  Phone,
  MapPin,
  ShoppingBag,
  Share2,
  Layers,
  HelpCircle,
  ShieldCheck,
  Truck,
  CreditCard,
  Plus,
  Trash2,
  Sparkles,
  Info,
} from 'lucide-react';
import { FooterServiceItem } from '../../types';

export const FooterEditModal: React.FC = () => {
  const {
    isFooterModalOpen,
    closeFooterModal,
    footerModalTab,
    setFooterModalTab,
    settings,
    updateFooter,
    updateContacts,
    showToast,
  } = useSiteData();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'profile' | 'socials' | 'categories' | 'services' | 'warranty'>('profile');

  // Tab 1: Profile & Contacts
  const [description, setDescription] = useState('');
  const [copyright, setCopyright] = useState('');
  const [address, setAddress] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [operationalHours, setOperationalHours] = useState('');
  const [tagline, setTagline] = useState('');

  // Tab 2: Social Media & Marketplaces
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [tokopedia, setTokopedia] = useState('');
  const [shopee, setShopee] = useState('');
  const [facebook, setFacebook] = useState('');
  const [maps, setMaps] = useState('');

  // Tab 3: Sparepart Categories (Column 2)
  const [categoriesTitle, setCategoriesTitle] = useState('Kategori Sparepart');
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [newCategoryInput, setNewCategoryInput] = useState('');

  // Tab 4: Customer Services (Column 3)
  const [servicesTitle, setServicesTitle] = useState('Layanan Pelanggan');
  const [servicesList, setServicesList] = useState<FooterServiceItem[]>([]);
  const [newServiceLabel, setNewServiceLabel] = useState('');
  const [newServiceAction, setNewServiceAction] = useState('katalog');

  // Tab 5: Warranty, Couriers & Payment (Column 4)
  const [warrantyTitle, setWarrantyTitle] = useState('Garansi & Pengiriman');
  const [warrantyDescription, setWarrantyDescription] = useState('');
  const [warrantyButtonText, setWarrantyButtonText] = useState('Verifikasi Garansi Online');
  const [courierText, setCourierText] = useState('JNE, J&T, SiCepat, GoSend');
  const [bankText, setBankText] = useState('BCA, Mandiri, BRI, QRIS');

  // Sync state whenever modal opens or settings change
  useEffect(() => {
    if (footerModalTab) {
      setActiveTab(footerModalTab);
    }
  }, [footerModalTab, isFooterModalOpen]);

  useEffect(() => {
    if (settings) {
      const f = settings.footer;
      const c = settings.contacts;

      setDescription(
        f?.description ||
          'Toko spesialis sparepart laptop terpercaya sejak 2014. Menyediakan baterai, charger, keyboard, LCD/LED, RAM, SSD, dan fan laptop bergaransi resmi untuk end-user, teknisi, dan bengkel servis.'
      );
      setCopyright(f?.copyright || '© 2014 - 2026 Kevin 88 Computer. Hak cipta dilindungi undang-undang.');
      setAddress(f?.address || 'Plasa Simpang Lima Lt. 2 Blok CC 15-16, Kota Semarang, Jawa Tengah');
      setTagline(f?.tagline || 'Spesialis Sparepart Laptop Sejak 2014');

      setWhatsapp(c?.whatsappNumber || '6281288880014');
      setPhone(c?.phone || '024-8458-888');
      setEmail(c?.email || 'kevindiocm@gmail.com');
      setOperationalHours(c?.operationalHours || 'Senin - Sabtu: 09.30 - 18.00 WIB');

      const socials = f?.socialLinks;
      setInstagram(socials?.instagram || 'https://instagram.com/kevin88computer');
      setTiktok(socials?.tiktok || 'https://tiktok.com/@kevin88computer');
      setTokopedia(socials?.tokopedia || 'https://tokopedia.com/kevin88computer');
      setShopee(socials?.shopee || 'https://shopee.co.id/kevin88computer');
      setFacebook(socials?.facebook || 'https://facebook.com/kevin88computer');
      setMaps(socials?.googleMaps || 'https://maps.google.com/?q=Kevin+88+Computer+Semarang');

      // Categories
      setCategoriesTitle(f?.categoriesTitle || 'Kategori Sparepart');
      setCategoriesList(
        f?.categoriesList && f.categoriesList.length > 0
          ? f.categoriesList
          : [
              'Baterai Laptop Original',
              'Charger & Adaptor Laptop',
              'Keyboard Standar & Backlight',
              'Layar LCD / LED Slim 144Hz',
              'RAM SODIMM DDR4 & DDR5',
              'SSD M.2 NVMe PCIe 4.0',
              'Fan Pendingin & Heatsink',
            ]
      );

      // Services
      setServicesTitle(f?.servicesTitle || 'Layanan Pelanggan');
      setServicesList(
        f?.servicesList && f.servicesList.length > 0
          ? f.servicesList
          : [
              { label: 'Tentang Kevin 88', actionId: 'tentang-kami' },
              { label: 'Katalog Sparepart Lengkap', actionId: 'katalog' },
              { label: 'Lokasi Cabang Toko', actionId: 'cabang' },
              { label: 'Tanya Jawab (FAQ)', actionId: 'faq' },
              { label: 'Testimoni Pelanggan', actionId: 'testimoni' },
              { label: 'Cek Garansi Sparepart', actionId: 'warranty' },
            ]
      );

      // Warranty & Payment
      setWarrantyTitle(f?.warrantyTitle || 'Garansi & Pengiriman');
      setWarrantyDescription(
        f?.warrantyDescription ||
          'Setiap pembelian sparepart dilengkapi nota resmi dan segel hologram toko. Garansi tukar unit baru jika ada cacat pabrik.'
      );
      setWarrantyButtonText(f?.warrantyButtonText || 'Verifikasi Garansi Online');
      setCourierText((f?.courierList || ['JNE', 'J&T', 'SiCepat', 'GoSend']).join(', '));
      setBankText((f?.bankList || ['BCA', 'Mandiri', 'BRI', 'QRIS']).join(', '));
    }
  }, [settings, isFooterModalOpen]);

  if (!isFooterModalOpen) return null;

  // Add Category Handler
  const handleAddCategory = () => {
    if (!newCategoryInput.trim()) return;
    setCategoriesList((prev) => [...prev, newCategoryInput.trim()]);
    setNewCategoryInput('');
  };

  const handleRemoveCategory = (index: number) => {
    setCategoriesList((prev) => prev.filter((_, i) => i !== index));
  };

  // Add Service Handler
  const handleAddService = () => {
    if (!newServiceLabel.trim()) return;
    setServicesList((prev) => [
      ...prev,
      { label: newServiceLabel.trim(), actionId: newServiceAction },
    ]);
    setNewServiceLabel('');
  };

  const handleRemoveService = (index: number) => {
    setServicesList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Parse comma-separated couriers and banks
    const parsedCouriers = courierText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedBanks = bankText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    updateFooter({
      description,
      copyright,
      address,
      tagline,
      categoriesTitle,
      categoriesList,
      servicesTitle,
      servicesList,
      warrantyTitle,
      warrantyDescription,
      warrantyButtonText,
      courierList: parsedCouriers.length > 0 ? parsedCouriers : ['JNE', 'J&T', 'SiCepat', 'GoSend'],
      bankList: parsedBanks.length > 0 ? parsedBanks : ['BCA', 'Mandiri', 'BRI', 'QRIS'],
      socialLinks: {
        whatsapp: whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}` : undefined,
        instagram: instagram || undefined,
        tiktok: tiktok || undefined,
        tokopedia: tokopedia || undefined,
        shopee: shopee || undefined,
        facebook: facebook || undefined,
        googleMaps: maps || undefined,
      },
    });

    updateContacts({
      whatsappNumber: whatsapp.replace(/[^0-9]/g, ''),
      phone,
      email,
      operationalHours,
    });

    showToast('Semua informasi Footer berhasil disimpan dan diperbarui!', 'success');
    closeFooterModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold border border-amber-500/30">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Pengaturan Footer & Informasi Toko</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  Live Sync
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Ubah semua teks profil, kontak, daftar kategori, layanan, garansi, kurir & bank di footer.
              </p>
            </div>
          </div>
          <button
            onClick={closeFooterModal}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 pb-2 bg-slate-950 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => {
              setActiveTab('profile');
              setFooterModalTab('profile');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>1. Profil & Kontak</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('socials');
              setFooterModalTab('socials');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'socials'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>2. Sosmed & Marketplace</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('categories');
              setFooterModalTab('categories');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3. Kategori Sparepart</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('services');
              setFooterModalTab('services');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'services'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>4. Layanan Pelanggan</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('warranty');
              setFooterModalTab('warranty');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'warranty'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>5. Garansi, Kurir & Bank</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* TAB 1: Profile & Contacts */}
          {activeTab === 'profile' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Informasi di bawah ini muncul pada Kolom 1 Footer toko serta digunakan untuk tombol chat WhatsApp dan petunjuk kontak pengunjung.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Deskripsi Singkat Toko (Kolom 1):
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Toko spesialis sparepart laptop terpercaya sejak 2014..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Alamat Utama Toko / Kantor Pusat:</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Plasa Simpang Lima Lt. 2 Blok CC 15-16, Kota Semarang, Jawa Tengah"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    No. WhatsApp Admin Toko:
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="6281288880014"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Format: 62812xxxx (tanpa tanda +)</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Telepon Kantor / CS:
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="024-8458-888"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Resmi Toko:
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kevindiocm@gmail.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Jam Operasional Toko:
                </label>
                <input
                  type="text"
                  value={operationalHours}
                  onChange={(e) => setOperationalHours(e.target.value)}
                  placeholder="Senin - Sabtu: 09.30 - 18.00 WIB"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Socials & Marketplace */}
          {activeTab === 'socials' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Tautan ini tampil sebagai tombol ikon cepat di bawah alamat pada Kolom 1 Footer. Pelanggan dapat langsung mengklik untuk mengunjungi akun Anda.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-pink-400" />
                    <span>Link Akun Instagram:</span>
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/kevin88computer"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Link Toko Tokopedia:</span>
                  </label>
                  <input
                    type="text"
                    value={tokopedia}
                    onChange={(e) => setTokopedia(e.target.value)}
                    placeholder="https://tokopedia.com/kevin88computer"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
                    <span>Link Toko Shopee:</span>
                  </label>
                  <input
                    type="text"
                    value={shopee}
                    onChange={(e) => setShopee(e.target.value)}
                    placeholder="https://shopee.co.id/kevin88computer"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-slate-300" />
                    <span>Link TikTok Toko:</span>
                  </label>
                  <input
                    type="text"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    placeholder="https://tiktok.com/@kevin88computer"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Link Google Maps Lokasi:</span>
                  </label>
                  <input
                    type="text"
                    value={maps}
                    onChange={(e) => setMaps(e.target.value)}
                    placeholder="https://maps.google.com/?q=Kevin+88+Computer+Semarang"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Link Akun Facebook (Opsional):</span>
                  </label>
                  <input
                    type="text"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="https://facebook.com/kevin88computer"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Categories (Column 2) */}
          {activeTab === 'categories' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Judul Kolom Kategori (Kolom 2):
                </label>
                <input
                  type="text"
                  value={categoriesTitle}
                  onChange={(e) => setCategoriesTitle(e.target.value)}
                  placeholder="Kategori Sparepart"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-2">
                  Daftar Item Kategori yang Ditampilkan:
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {categoriesList.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                    >
                      <span className="font-medium truncate">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(idx)}
                        className="p-1 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Category Item */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCategory();
                    }
                  }}
                  placeholder="Ketik nama kategori baru (misal: Baterai Original Asus)..."
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Services (Column 3) */}
          {activeTab === 'services' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Judul Kolom Layanan (Kolom 3):
                </label>
                <input
                  type="text"
                  value={servicesTitle}
                  onChange={(e) => setServicesTitle(e.target.value)}
                  placeholder="Layanan Pelanggan"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-2">
                  Daftar Tautan Layanan Pelanggan:
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {servicesList.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                    >
                      <div>
                        <span className="font-medium text-white">{item.label}</span>
                        <span className="text-[10px] text-amber-400 font-mono ml-2">
                          → Scroll ke: #{item.actionId || 'katalog'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveService(idx)}
                        className="p-1 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
                        title="Hapus Menu Layanan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Service Item */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                <input
                  type="text"
                  value={newServiceLabel}
                  onChange={(e) => setNewServiceLabel(e.target.value)}
                  placeholder="Nama menu (misal: Cek Status Servis)..."
                  className="sm:col-span-6 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-400"
                />
                <select
                  value={newServiceAction}
                  onChange={(e) => setNewServiceAction(e.target.value)}
                  className="sm:col-span-4 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:border-amber-400"
                >
                  <option value="katalog">Buka Katalog Produk</option>
                  <option value="tentang-kami">Buka Tentang Kami</option>
                  <option value="cabang">Buka Lokasi Cabang</option>
                  <option value="faq">Buka Tanya Jawab (FAQ)</option>
                  <option value="testimoni">Buka Testimoni</option>
                  <option value="warranty">Buka Modal Cek Garansi</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddService}
                  className="sm:col-span-2 py-2 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: Warranty, Couriers & Payment (Column 4 + Bottom) */}
          {activeTab === 'warranty' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    Judul Garansi & Pengiriman (Kolom 4):
                  </label>
                  <input
                    type="text"
                    value={warrantyTitle}
                    onChange={(e) => setWarrantyTitle(e.target.value)}
                    placeholder="Garansi & Pengiriman"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1">
                    Teks Tombol Garansi:
                  </label>
                  <input
                    type="text"
                    value={warrantyButtonText}
                    onChange={(e) => setWarrantyButtonText(e.target.value)}
                    placeholder="Verifikasi Garansi Online"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white mb-1">
                  Deskripsi / Keterangan Garansi (Kolom 4):
                </label>
                <textarea
                  rows={2}
                  value={warrantyDescription}
                  onChange={(e) => setWarrantyDescription(e.target.value)}
                  placeholder="Setiap pembelian sparepart dilengkapi nota resmi dan segel hologram toko. Garansi tukar unit baru jika ada cacat pabrik."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Daftar Kurir Ekspedisi (Pisahkan koma):</span>
                  </label>
                  <input
                    type="text"
                    value={courierText}
                    onChange={(e) => setCourierText(e.target.value)}
                    placeholder="JNE, J&T, SiCepat, GoSend, Grab"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Akan tampil sebagai lencana logo kurir di kolom 4
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white mb-1 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                    <span>Daftar Bank & Pembayaran (Pisahkan koma):</span>
                  </label>
                  <input
                    type="text"
                    value={bankText}
                    onChange={(e) => setBankText(e.target.value)}
                    placeholder="BCA, Mandiri, BRI, QRIS, BNI"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Akan tampil sebagai lencana logo pembayaran di kolom 4
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Teks Hak Cipta (Copyright Baris Bawah):
                  </label>
                  <input
                    type="text"
                    value={copyright}
                    onChange={(e) => setCopyright(e.target.value)}
                    placeholder="© 2014 - 2026 Kevin 88 Computer..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tagline Toko (Baris Bawah Kanan):
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="Spesialis Sparepart Laptop Sejak 2014"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Submit Bar */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Semua perubahan otomatis tersimpan di browser & database.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closeFooterModal}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-400/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Simpan Perubahan Footer</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
