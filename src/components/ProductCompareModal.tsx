import React, { useMemo } from 'react';
import { useSiteData } from '../context/SiteContext';
import { Product } from '../types';
import { formatRupiah, createWhatsAppConsultationUrl } from '../utils/format';
import {
  X,
  Scale,
  ShoppingBag,
  MessageCircle,
  Eye,
  CheckCircle2,
  Trash2,
  Plus,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ProductCompareModalProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCompareModal: React.FC<ProductCompareModalProps> = ({
  onSelectProduct,
  onAddToCart,
}) => {
  const {
    products,
    comparedProducts,
    isCompareModalOpen,
    closeCompareModal,
    removeCompareProduct,
    clearCompareProducts,
    toggleCompareProduct,
    showToast,
  } = useSiteData();

  const [isPickerOpen, setIsPickerOpen] = React.useState(false);

  // Extract all unique technical specification labels across all compared items
  const allSpecLabels = useMemo(() => {
    const labelSet = new Set<string>();
    comparedProducts.forEach((p) => {
      (p.specs || []).forEach((s) => {
        if (s.label?.trim()) {
          labelSet.add(s.label.trim());
        }
      });
    });
    return Array.from(labelSet);
  }, [comparedProducts]);

  // Find lowest price and highest warranty for visual highlighting
  const lowestPrice = useMemo(() => {
    if (comparedProducts.length === 0) return 0;
    return Math.min(...comparedProducts.map((p) => p.price));
  }, [comparedProducts]);

  const longestWarranty = useMemo(() => {
    if (comparedProducts.length === 0) return 0;
    return Math.max(...comparedProducts.map((p) => p.warrantyMonths || 0));
  }, [comparedProducts]);

  if (!isCompareModalOpen) return null;

  const handleWhatsAppConsult = (product: Product) => {
    const url = createWhatsAppConsultationUrl({
      laptopBrand: product.brand,
      laptopModel: product.compatibleModels?.[0] || '',
      sparepartType: product.name,
      notes: `Halo Kevin 88 Computer, saya sedang membandingkan sparepart ${product.name} (Part: ${product.partNumber}). Apakah cocok untuk laptop saya dan stoknya ready?`,
    });
    window.open(url, '_blank');
  };

  const availableProductsToPick = products.filter(
    (p) => !comparedProducts.some((cp) => cp.id === p.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 text-amber-400 border border-amber-400/30">
              <Scale className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  Perbandingan Spesifikasi Sparepart
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30">
                  {comparedProducts.length} / 3 Produk
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Bandingkan spesifikasi teknis, voltase, kompatibilitas, harga, dan garansi secara berdampingan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comparedProducts.length > 0 && (
              <button
                onClick={clearCompareProducts}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Hapus semua perbandingan"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bersihkan</span>
              </button>
            )}
            <button
              onClick={closeCompareModal}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Tutup Modal Perbandingan"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Comparison Table */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {comparedProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Scale className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-white">Belum ada produk yang dipilih</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Silakan centang tombol "Bandingkan" pada kartu produk di katalog untuk melihat rincian spesifikasi teknis secara berdampingan.
              </p>
              <button
                onClick={closeCompareModal}
                className="mt-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs cursor-pointer transition-all"
              >
                Lihat Katalog Produk
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <div
                className="grid gap-4 min-w-[680px]"
                style={{
                  gridTemplateColumns: `220px repeat(${Math.max(comparedProducts.length, 1)}, minmax(220px, 1fr)) ${
                    comparedProducts.length < 3 ? 'minmax(180px, 220px)' : ''
                  }`,
                }}
              >
                {/* COLUMN 0: ROW LABELS */}
                <div className="space-y-4 pt-4 shrink-0">
                  <div className="h-[210px] flex flex-col justify-end pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800/80">
                    Informasi Produk
                  </div>

                  {/* Price Label */}
                  <div className="h-14 flex items-center text-xs font-bold text-slate-300 border-b border-slate-800/60">
                    Harga Sparepart
                  </div>

                  {/* Stock Label */}
                  <div className="h-10 flex items-center text-xs font-bold text-slate-300 border-b border-slate-800/60">
                    Status Ketersediaan
                  </div>

                  {/* Warranty Label */}
                  <div className="h-12 flex items-center text-xs font-bold text-slate-300 border-b border-slate-800/60">
                    Masa Garansi Resmi
                  </div>

                  {/* Condition Label */}
                  <div className="h-10 flex items-center text-xs font-bold text-slate-300 border-b border-slate-800/60">
                    Kualitas / Kondisi
                  </div>

                  {/* Part Number Label */}
                  <div className="h-10 flex items-center text-xs font-bold text-slate-300 border-b border-slate-800/60">
                    Nomor Part (P/N)
                  </div>

                  {/* Compatible Models Label */}
                  <div className="min-h-[70px] flex items-center text-xs font-bold text-slate-300 border-b border-slate-800/60">
                    Kecocokan Model Laptop
                  </div>

                  {/* Dynamic Technical Specs Labels Header */}
                  {allSpecLabels.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>Spesifikasi Teknis</span>
                      </div>
                      {allSpecLabels.map((label) => (
                        <div
                          key={label}
                          className="h-12 flex items-center text-xs font-semibold text-slate-400 border-b border-slate-800/60"
                        >
                          {label}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions Row Label */}
                  <div className="h-28 flex items-center text-xs font-bold text-slate-300 pt-3">
                    Aksi Pembelian
                  </div>
                </div>

                {/* COLUMNS 1..N: PRODUCT DATA */}
                {comparedProducts.map((product) => {
                  const isBestPrice = product.price === lowestPrice && comparedProducts.length > 1;
                  const isBestWarranty =
                    product.warrantyMonths === longestWarranty && comparedProducts.length > 1;

                  return (
                    <div
                      key={product.id}
                      className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition-all flex flex-col space-y-4 relative"
                    >
                      {/* Remove Button */}
                      <button
                        onClick={() => removeCompareProduct(product.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors z-10 cursor-pointer"
                        title="Hapus dari perbandingan"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Header Box: Image + Title */}
                      <div className="h-[210px] flex flex-col justify-between border-b border-slate-800/80 pb-3">
                        <div className="relative aspect-[4/3] bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center p-2 border border-slate-800">
                          <img
                            src={product.image}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover rounded"
                          />
                          <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950/90 text-amber-300 border border-slate-800">
                            {product.brand}
                          </span>
                        </div>

                        <div className="mt-2">
                          <h4
                            onClick={() => {
                              onSelectProduct(product);
                              closeCompareModal();
                            }}
                            className="text-xs font-bold text-white line-clamp-2 hover:text-amber-300 transition-colors cursor-pointer"
                            title={product.name}
                          >
                            {product.name}
                          </h4>
                          <span className="text-[11px] text-slate-400 capitalize">
                            Kategori: {product.category}
                          </span>
                        </div>
                      </div>

                      {/* Price Row */}
                      <div className="h-14 flex flex-col justify-center border-b border-slate-800/60">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-white font-mono">
                            {formatRupiah(product.price)}
                          </span>
                          {isBestPrice && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5">
                              <Sparkles className="w-3 h-3" />
                              Paling Hemat
                            </span>
                          )}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-[11px] text-slate-500 line-through font-mono">
                            {formatRupiah(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Stock Row */}
                      <div className="h-10 flex items-center border-b border-slate-800/60">
                        <span
                          className={`text-xs font-semibold flex items-center gap-1.5 ${
                            product.stock > 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              product.stock > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                            }`}
                          />
                          <span>
                            {product.stock > 0 ? `Ready (${product.stock} unit)` : 'Stok Habis'}
                          </span>
                        </span>
                      </div>

                      {/* Warranty Row */}
                      <div className="h-12 flex items-center border-b border-slate-800/60">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="text-xs font-bold text-slate-200">
                            {product.warrantyMonths >= 12
                              ? `${product.warrantyMonths / 12} Tahun`
                              : `${product.warrantyMonths} Bulan`}
                          </span>
                          {isBestWarranty && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/30">
                              Garansi Terpanjang
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Condition Row */}
                      <div className="h-10 flex items-center border-b border-slate-800/60 text-xs font-medium text-slate-200">
                        {product.condition || 'Baru (Original)'}
                      </div>

                      {/* Part Number Row */}
                      <div className="h-10 flex items-center border-b border-slate-800/60 text-xs font-mono text-amber-300 truncate">
                        {product.partNumber || '-'}
                      </div>

                      {/* Compatible Models Row */}
                      <div className="min-h-[70px] flex items-center border-b border-slate-800/60 text-xs text-slate-300">
                        <div className="line-clamp-3 leading-relaxed">
                          {product.compatibleModels && product.compatibleModels.length > 0
                            ? product.compatibleModels.join(', ')
                            : 'Universal / Sesuai Part Number'}
                        </div>
                      </div>

                      {/* Dynamic Specs Row */}
                      {allSpecLabels.length > 0 && (
                        <div className="pt-2">
                          <div className="h-4 mb-2"></div>
                          {allSpecLabels.map((label) => {
                            const spec = (product.specs || []).find(
                              (s) => s.label?.trim().toLowerCase() === label.toLowerCase()
                            );
                            return (
                              <div
                                key={label}
                                className="h-12 flex items-center border-b border-slate-800/60 text-xs font-medium text-white"
                              >
                                {spec?.value ? (
                                  <span className="text-slate-200 font-semibold">{spec.value}</span>
                                ) : (
                                  <span className="text-slate-600 font-mono">-</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Direct Actions Column */}
                      <div className="h-28 flex flex-col justify-end space-y-2 pt-3">
                        <button
                          disabled={product.stock <= 0}
                          onClick={() => {
                            onAddToCart(product);
                            showToast(`"${product.name}" dimasukkan ke keranjang!`, 'success');
                          }}
                          className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            product.stock <= 0
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-500/10'
                          }`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>+ Keranjang</span>
                        </button>

                        <button
                          onClick={() => handleWhatsAppConsult(product)}
                          className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Tanya via WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* EMPTY SLOT: ADD ANOTHER PRODUCT TO COMPARE (UP TO 3) */}
                {comparedProducts.length < 3 && (
                  <div className="bg-slate-950/30 rounded-xl p-6 border-2 border-dashed border-slate-800 hover:border-amber-400/40 transition-colors flex flex-col items-center justify-center text-center space-y-3">
                    <div className="p-3.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400">
                      <Plus className="w-6 h-6" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white">Tambah Produk Lain</h5>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Pilih hingga {3 - comparedProducts.length} sparepart lagi untuk dibandingkan
                      </p>
                    </div>

                    <button
                      onClick={() => setIsPickerOpen(!isPickerOpen)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs border border-slate-700 transition-colors cursor-pointer"
                    >
                      {isPickerOpen ? 'Tutup Pilihan' : '+ Pilih dari Katalog'}
                    </button>

                    {/* Quick Inline Picker */}
                    {isPickerOpen && (
                      <div className="w-full mt-3 bg-slate-900 border border-slate-800 rounded-xl p-2 text-left max-h-56 overflow-y-auto space-y-1">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                          Pilih Produk:
                        </div>
                        {availableProductsToPick.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              toggleCompareProduct(item);
                              setIsPickerOpen(false);
                            }}
                            className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer group"
                          >
                            <img
                              src={item.image}
                              alt=""
                              className="w-7 h-7 rounded object-cover border border-slate-700 shrink-0"
                            />
                            <div className="overflow-hidden">
                              <div className="text-xs font-semibold text-white group-hover:text-amber-300 truncate">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {formatRupiah(item.price)}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80 text-xs">
          <div className="text-slate-400">
            {comparedProducts.length} dari maksimal 3 produk dipilih untuk perbandingan
          </div>
          <button
            onClick={closeCompareModal}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
