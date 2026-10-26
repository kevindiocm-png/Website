import React, { useState, useMemo } from 'react';
import { CATEGORIES, BRANDS } from '../data/products';
import { Product } from '../types';
import { formatRupiah } from '../utils/format';
import {
  Search,
  ShoppingBag,
  Eye,
  Shield,
  Check,
  SlidersHorizontal,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Palette,
  Scale,
  Star,
  BatteryCharging,
  Zap,
  Keyboard,
  Monitor,
  Cpu,
  HardDrive,
  Wind,
  LayoutGrid,
  Filter,
  RotateCcw,
  X,
  Tag,
} from 'lucide-react';
import { useSiteData } from '../context/SiteContext';
import { OdooBlockControl } from './admin/OdooBlockControl';

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  semua: LayoutGrid,
  baterai: BatteryCharging,
  charger: Zap,
  keyboard: Keyboard,
  lcd: Monitor,
  ram: Cpu,
  ssd: HardDrive,
  fan: Wind,
};

interface ProductCatalogProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  initialSearchQuery?: string;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onSelectProduct,
  onAddToCart,
  initialSearchQuery = '',
}) => {
  const {
    products,
    settings,
    isAdminMode,
    openProductModal,
    openShopeeModal,
    openBackgroundModal,
    openSectionHeadersModal,
    openCMSModal,
    deleteProduct,
    quickUpdateStock,
    quickToggleStock,
    quickUpdatePrice,
    comparedProducts,
    toggleCompareProduct,
    openCompareModal,
    openWarrantyModal,
  } = useSiteData();

  const sectionHeaders = settings.sectionHeaders;

  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [selectedBrand, setSelectedBrand] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'warranty' | 'rating'>('default');
  const [addedId, setAddedId] = useState<string | null>(null);

  // Sync if initialSearchQuery changes externally
  React.useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Calculate dynamic real-time product count for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { semua: products.length };
    products.forEach((p) => {
      const cat = (p.category || '').toLowerCase().trim();
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'semua') {
          const prodCat = (product.category || '').toLowerCase().trim();
          const targetCat = selectedCategory.toLowerCase().trim();
          if (prodCat !== targetCat) {
            return false;
          }
        }
        // Brand filter
        if (selectedBrand !== 'Semua' && product.brand !== selectedBrand && product.brand !== 'Universal') {
          return false;
        }
        // Search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchesName = product.name.toLowerCase().includes(query);
          const matchesPartNum = product.partNumber ? product.partNumber.toLowerCase().includes(query) : false;
          const matchesModels = (product.compatibleModels || []).some((m) => m.toLowerCase().includes(query));
          const matchesCategory = product.category.toLowerCase().includes(query);
          if (!matchesName && !matchesPartNum && !matchesModels && !matchesCategory) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'warranty') return b.warrantyMonths - a.warrantyMonths;
        return 0;
      });
  }, [products, selectedCategory, selectedBrand, searchQuery, sortBy]);

  const handleAdd = (product: Product) => {
    onAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => {
      setAddedId(null);
    }, 1500);
  };

  const handleInlinePriceChange = (product: Product) => {
    const promptVal = window.prompt(`Ubah harga untuk ${product.name}:`, String(product.price));
    if (promptVal !== null) {
      const parsed = parseInt(promptVal.replace(/\D/g, ''), 10);
      if (!isNaN(parsed) && parsed > 0) {
        quickUpdatePrice(product.id, parsed);
      }
    }
  };

  return (
    <section id="katalog" className={`py-16 bg-slate-950 ${isAdminMode ? 'odoo-editable-block' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Odoo Standard Block Control */}
        {isAdminMode && (
          <OdooBlockControl
            blockId="katalog"
            blockName="Katalog Sparepart & Stok"
            onEdit={() => openCMSModal('products')}
            onCustomizeBg={openBackgroundModal}
            extraActions={[
              { label: 'Upload Shopee', onClick: openShopeeModal, icon: Upload, variant: 'warning' },
              { label: '+ Tambah Produk', onClick: () => openProductModal(null), icon: Plus, variant: 'primary' },
              { label: 'Judul Seksi', onClick: openSectionHeadersModal, icon: Edit2 },
            ]}
          />
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-2">
              <span>{sectionHeaders?.catalogBadge || 'Katalog Lengkap Bergaransi'}</span>
              {isAdminMode && (
                <button
                  onClick={openSectionHeadersModal}
                  className="px-2 py-0.5 rounded-lg bg-amber-400/20 text-amber-300 text-[11px] font-bold hover:bg-amber-400/30 border border-amber-400/40 cursor-pointer flex items-center gap-1 shadow-sm"
                  title="Ubah judul & deskripsi katalog langsung"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>✏️ Edit Judul Katalog</span>
                </button>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {sectionHeaders?.catalogTitle || 'Sparepart & Komponen Laptop'}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {sectionHeaders?.catalogDesc || 'Baterai, charger, keyboard, LCD/LED, RAM, SSD, hingga fan laptop dengan jaminan kualitas terbaik.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isAdminMode && (
              <>
                <button
                  onClick={openShopeeModal}
                  className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 text-xs font-extrabold rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                  title="Upload / kirim file Excel atau CSV produk dari Shopee Seller Centre"
                >
                  <Upload className="w-4 h-4 stroke-[2.5]" />
                  <span>📥 Upload Shopee</span>
                </button>

                <button
                  onClick={openBackgroundModal}
                  className="px-3.5 py-2 bg-indigo-600/90 hover:bg-indigo-500 text-white border border-indigo-400/40 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-105 active:scale-95"
                  title="Kustomisasi warna background halaman & kartu produk (rata & seragam)"
                >
                  <Palette className="w-4 h-4" />
                  <span>🎨 Warna Background</span>
                </button>

                <button
                  onClick={() => openProductModal(null)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/40 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Tambah sparepart baru manual satu per satu"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Tambah Manual</span>
                </button>
              </>
            )}

            <button
              onClick={() => openWarrantyModal()}
              className="px-3.5 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
              title="Periksa sisa masa garansi suku cadang laptop Anda (S/N atau Nota)"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cek Garansi Part</span>
            </button>

            {comparedProducts.length > 0 && (
              <button
                onClick={openCompareModal}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer animate-pulse"
                title="Buka panel perbandingan spesifikasi teknis"
              >
                <Scale className="w-4 h-4" />
                <span>Bandingkan ({comparedProducts.length}/3)</span>
              </button>
            )}

            <div className="text-xs text-slate-400 font-mono">
              Menampilkan <span className="text-amber-400 font-bold tabular-nums">{filteredProducts.length}</span> produk
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-4 mb-8">
          {/* 1. Category Visual Filter Bar */}
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-3.5 sm:p-4 backdrop-blur-sm space-y-3 shadow-xl shadow-black/20">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-slate-800/70">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-400 border border-amber-400/30">
                  <Filter className="w-4 h-4" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                      Filter Kategori Sparepart
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700/60 font-bold">
                      {CATEGORIES.length - 1} Kategori Komponen
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 hidden sm:block">
                    Pilih jenis suku cadang di bawah untuk memfilter baterai, charger, keyboard, LCD, RAM, SSD, atau fan
                  </p>
                </div>
              </div>

              {selectedCategory !== 'semua' && (
                <button
                  onClick={() => setSelectedCategory('semua')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-amber-300 hover:text-white border border-amber-400/30 flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Lihat Semua Kategori</span>
                </button>
              )}
            </div>

            {/* Category Segmented Buttons with Icons & Real-time Counts */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const Icon = CATEGORY_ICONS[cat.id] || LayoutGrid;
                const count = categoryCounts[cat.id] || 0;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25 ring-2 ring-amber-400/50 scale-[1.02]'
                        : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950 stroke-[2.5]' : 'text-amber-400/90'}`} />
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-black/20 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Sub Filters: Search, Brand selector & Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari sparepart, part number (misal: L19M2PB0, 40-pin, 144Hz)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-white cursor-pointer"
                  title="Hapus pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Brand Dropdown */}
            <div className="sm:col-span-3">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                aria-label="Pilih Merk Laptop"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 cursor-pointer"
              >
                {BRANDS.map((brand) => (
                  <option key={brand} value={brand}>
                    Merk: {brand}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="sm:col-span-3 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Urutan Produk"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 cursor-pointer"
              >
                <option value="default">Urutan: Rekomendasi</option>
                <option value="rating">Rating Ulasan Tertinggi (⭐ 5.0)</option>
                <option value="price-asc">Harga: Termurah</option>
                <option value="price-desc">Harga: Tertinggi</option>
                <option value="warranty">Garansi Terpanjang</option>
              </select>
            </div>
          </div>

          {/* 3. Active Filter Pills Summary Bar */}
          {(selectedCategory !== 'semua' || selectedBrand !== 'Semua' || searchQuery.trim() !== '') && (
            <div className="flex flex-wrap items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1.5 text-[11px]">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Filter Aktif:</span>
              </span>

              {selectedCategory !== 'semua' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-bold">
                  <span>Kategori: {CATEGORIES.find((c) => c.id === selectedCategory)?.label || selectedCategory}</span>
                  <button
                    onClick={() => setSelectedCategory('semua')}
                    className="hover:text-white cursor-pointer"
                    title="Hapus filter kategori"
                  >
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </span>
              )}

              {selectedBrand !== 'Semua' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-bold">
                  <span>Merk: {selectedBrand}</span>
                  <button
                    onClick={() => setSelectedBrand('Semua')}
                    className="hover:text-white cursor-pointer"
                    title="Hapus filter merk"
                  >
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </span>
              )}

              {searchQuery.trim() !== '' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold">
                  <span>Cari: &quot;{searchQuery}&quot;</span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:text-white cursor-pointer"
                    title="Hapus kata kunci pencarian"
                  >
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </button>
                </span>
              )}

              <button
                onClick={() => {
                  setSelectedCategory('semua');
                  setSelectedBrand('Semua');
                  setSearchQuery('');
                }}
                className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 cursor-pointer transition-colors"
                title="Hapus semua filter"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filter</span>
              </button>
            </div>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-xl overflow-hidden flex flex-col h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40 relative"
              >
                {/* Admin Quick Action Controls On Card */}
                {isAdminMode && (
                  <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-slate-950/90 p-1 rounded-lg border border-amber-500/40 backdrop-blur-sm">
                    <button
                      onClick={() => openProductModal(product)}
                      className="p-1 text-amber-300 hover:text-white hover:bg-amber-500/20 rounded cursor-pointer"
                      title="Edit Detail Produk"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus produk "${product.name}"?`)) {
                          deleteProduct(product.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 rounded cursor-pointer"
                      title="Hapus Produk"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Product Image Slot with Fallback Container */}
                <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden flex items-center justify-center p-3 border-b border-slate-800/60 shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-lg group-hover:scale-103 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />

                  {/* Top Subtle Status Tag */}
                  <div className="absolute top-2.5 left-2.5 text-[10px] font-medium text-slate-300 bg-slate-950/80 backdrop-blur-xs px-2 py-0.5 rounded border border-slate-800">
                    {product.condition}
                  </div>

                  {!isAdminMode && (
                    <div className="absolute top-2.5 right-2.5 text-[10px] font-medium text-amber-300 bg-amber-950/60 backdrop-blur-xs px-2 py-0.5 rounded border border-amber-800/40 font-mono">
                      Garansi {product.warrantyMonths >= 12 ? `${product.warrantyMonths / 12} Thn` : `${product.warrantyMonths} Bln`}
                    </div>
                  )}

                  {/* Compare Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCompareProduct(product);
                    }}
                    className={`absolute bottom-2.5 right-2.5 text-[10px] font-semibold px-2 py-1 rounded-lg backdrop-blur-md transition-all flex items-center gap-1 cursor-pointer border shadow-sm ${
                      comparedProducts.some((p) => p.id === product.id)
                        ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-amber-500/30'
                        : 'bg-slate-950/80 text-slate-300 hover:text-white border-slate-700/80 hover:bg-slate-900'
                    }`}
                    title={
                      comparedProducts.some((p) => p.id === product.id)
                        ? 'Hapus dari perbandingan'
                        : 'Bandingkan spesifikasi produk ini (maks 3)'
                    }
                  >
                    <Scale className="w-3 h-3" />
                    <span>
                      {comparedProducts.some((p) => p.id === product.id)
                        ? 'Dibandingkan'
                        : 'Bandingkan'}
                    </span>
                  </button>
                </div>

                {/* Card Content - flex-1 and justify-between for perfect horizontal alignment */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    {/* Unboxed Metadata Line with separators & Clickable Category Pill */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                      <span className="text-amber-400 font-semibold">{product.brand}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory(product.category);
                          const el = document.getElementById('katalog');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-slate-300 hover:text-amber-300 hover:underline cursor-pointer truncate max-w-[115px]"
                        title={`Filter katalog untuk kategori ${product.category}`}
                      >
                        {CATEGORIES.find((c) => c.id === product.category)?.label || product.category}
                      </button>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="truncate">{product.partNumber}</span>
                    </div>

                    {/* Product Title: Exact fixed height for 100% Rata Alignment across rows */}
                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="text-sm font-semibold text-white leading-snug line-clamp-2 hover:text-amber-300 transition-colors cursor-pointer min-h-[2.65rem] h-[2.65rem] flex items-start"
                      title={product.name}
                    >
                      {product.name}
                    </h3>

                    {/* Star Rating & Reviews Badge */}
                    <div
                      onClick={() => onSelectProduct(product)}
                      className="flex items-center gap-1.5 text-xs cursor-pointer group/rating py-0.5"
                      title={`${(product.rating || 4.9).toFixed(1)} dari 5 bintang (${product.reviewCount || (product.reviews?.length || 24)} ulasan pembeli)`}
                    >
                      <div className="flex items-center text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                        <span className="ml-1 font-bold text-white text-xs font-mono">
                          {(product.rating || 4.9).toFixed(1)}
                        </span>
                      </div>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400 text-[11px] group-hover/rating:text-amber-300 transition-colors">
                        {product.reviewCount || (product.reviews?.length || 24)} ulasan
                      </span>
                      {product.soldCount && (
                        <>
                          <span className="text-slate-600">·</span>
                          <span className="text-slate-400 text-[10px] bg-slate-800/90 px-1.5 py-0.2 rounded font-mono border border-slate-700/60">
                            {product.soldCount}+ terjual
                          </span>
                        </>
                      )}
                    </div>

                    {/* Key Spec Line: Fixed height so spec line is perfectly level */}
                    <div className="text-xs text-slate-400 line-clamp-1 h-5 flex items-center">
                      <span className="text-slate-400">{product.specs?.[0]?.label || 'Garansi'}:</span>
                      <span className="text-slate-200 ml-1 truncate">{product.specs?.[0]?.value || `${product.warrantyMonths} Bulan`}</span>
                    </div>
                  </div>

                  {/* Price & Action Module - mt-auto ensures bottom alignment */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-2 mt-auto">
                    {/* In Admin Mode: Quick Stock & Price Adjusters */}
                    {isAdminMode ? (
                      <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs min-h-[76px] flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => handleInlinePriceChange(product)}
                            className="text-base font-bold text-amber-400 font-mono tabular-nums hover:underline cursor-pointer"
                            title="Klik untuk ubah harga cepat"
                          >
                            {formatRupiah(product.price)}
                          </button>
                          <span className="text-[10px] text-slate-500">✏️ Klik harga</span>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-850">
                          <span className="text-[11px] text-slate-400">Stok:</span>
                          <div className="flex items-center gap-1 font-mono">
                            <button
                              type="button"
                              onClick={() => quickUpdateStock(product.id, -1)}
                              className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs"
                              title="Kurang 1"
                            >
                              -
                            </button>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                                product.stock > 0
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-rose-500/20 text-rose-400'
                              }`}
                            >
                              {product.stock}
                            </span>
                            <button
                              type="button"
                              onClick={() => quickUpdateStock(product.id, 1)}
                              className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs"
                              title="Tambah 1"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => quickToggleStock(product.id)}
                              className="ml-1 text-[10px] text-slate-400 hover:text-amber-300 underline"
                            >
                              {product.stock > 0 ? 'Habis' : 'Ready'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-baseline justify-between mb-3 min-h-[40px]">
                        <div>
                          <div className="text-base font-bold text-white font-mono tabular-nums">
                            {formatRupiah(product.price)}
                          </div>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="text-[11px] text-slate-500 line-through font-mono tabular-nums">
                              {formatRupiah(product.originalPrice)}
                            </div>
                          )}
                        </div>
                        <div
                          className={`text-[11px] flex items-center gap-1 font-medium ${
                            product.stock > 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              product.stock > 0 ? 'bg-emerald-400' : 'bg-rose-400'
                            }`}
                          ></span>
                          <span>{product.stock > 0 ? 'Stok Ready' : 'Stok Habis'}</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="py-2 px-2.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>Detail</span>
                      </button>

                      <button
                        disabled={product.stock <= 0}
                        onClick={() => handleAdd(product)}
                        className={`py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          product.stock <= 0
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : addedId === product.id
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                        }`}
                      >
                        {product.stock <= 0 ? (
                          <span>Habis</span>
                        ) : addedId === product.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Masuk!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Beli</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="text-center py-16 px-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
              <Filter className="w-7 h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Tidak Ada Sparepart yang Sesuai Filter
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {selectedCategory !== 'semua' ? (
                <>
                  Belum ada produk untuk kategori <strong className="text-amber-300">{CATEGORIES.find((c) => c.id === selectedCategory)?.label || selectedCategory}</strong>
                  {selectedBrand !== 'Semua' && <> merk <strong className="text-white">{selectedBrand}</strong></>}
                  {searchQuery && <> dengan kata kunci &quot;<strong className="text-white">{searchQuery}</strong>&quot;</>}.
                </>
              ) : searchQuery ? (
                <>Tidak ditemukan sparepart dengan kata kunci &quot;<strong className="text-white">{searchQuery}</strong>&quot;.</>
              ) : (
                <>Tidak ada sparepart untuk merk <strong className="text-white">{selectedBrand}</strong>.</>
              )}
              <br className="hidden sm:inline" />
              {' '}Kevin 88 Computer memiliki akses ke ribuan part number laptop di gudang cabang. Hubungi kami untuk cek ketersediaan.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('semua');
                  setSelectedBrand('Semua');
                }}
                className="px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Lihat Semua Sparepart</span>
              </button>

              <a
                href={`https://wa.me/${settings.contacts?.whatsappNumber || '6281288880014'}?text=${encodeURIComponent(
                  `Halo Kevin 88 Computer, saya ingin tanya ketersediaan sparepart laptop ${selectedCategory !== 'semua' ? `kategori ${selectedCategory}` : ''} ${selectedBrand !== 'Semua' ? selectedBrand : ''} ${searchQuery ? `tipe ${searchQuery}` : ''}:`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 text-xs font-semibold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Tanya Stok Part via WA</span>
              </a>

              {isAdminMode && (
                <button
                  onClick={() => openProductModal(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  + Tambah Produk Manual
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
