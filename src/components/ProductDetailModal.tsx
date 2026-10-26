import React, { useState } from 'react';
import { Product, ProductReview } from '../types';
import { formatRupiah, createWhatsAppConsultationUrl } from '../utils/format';
import {
  X,
  ShieldCheck,
  Truck,
  Check,
  ShoppingBag,
  MessageCircle,
  Scale,
  Star,
  UserCheck,
  Send,
  MessageSquare,
  ThumbsUp,
  Sparkles,
} from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product: initialProduct,
  onClose,
  onAddToCart,
}) => {
  const { products, comparedProducts, toggleCompareProduct, addProductReview, showToast } = useSiteData();

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerLaptop, setReviewerLaptop] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Always resolve the latest live product state from context (for immediate review & rating sync)
  const product = initialProduct
    ? products.find((p) => p.id === initialProduct.id) || initialProduct
    : null;

  if (!product) return null;

  const isCompared = comparedProducts.some((p) => p.id === product.id);
  const reviews: ProductReview[] = product.reviews || [];
  const currentRating = product.rating || 4.9;
  const reviewCount = product.reviewCount || reviews.length || 24;

  const handleConsult = () => {
    const url = createWhatsAppConsultationUrl({
      laptopBrand: product.brand,
      laptopModel: product.compatibleModels[0] || '',
      sparepartType: product.name,
      notes: `Saya tertarik dengan produk ${product.name} (Part No: ${product.partNumber}). Apakah stok ready dan cocok untuk laptop saya?`,
    });
    window.open(url, '_blank');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim()) {
      showToast('Mohon tulis nama Anda.', 'error');
      return;
    }
    if (!reviewComment.trim()) {
      showToast('Mohon tulis ulasan atau komentar pengalaman Anda.', 'error');
      return;
    }

    setIsSubmitting(true);
    addProductReview(product.id, {
      userName: reviewerName.trim(),
      rating: reviewRating,
      laptopModel: reviewerLaptop.trim() || product.compatibleModels[0] || undefined,
      comment: reviewComment.trim(),
      verifiedPurchase: true,
      source: 'website',
    });

    setIsSubmitting(false);
    setShowReviewForm(false);
    setReviewComment('');
    setReviewerName('');
    setReviewerLaptop('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-amber-400 font-bold">{product.brand}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="truncate max-w-[200px] sm:max-w-none">{product.partNumber}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Main info flex */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            <div className="sm:col-span-5 bg-slate-950 rounded-2xl p-3 border border-slate-800 flex flex-col items-center">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover rounded-xl aspect-square"
              />
              <div className="mt-3 text-center text-xs text-slate-400">
                Kondisi: <span className="text-slate-200 font-semibold">{product.condition}</span>
              </div>
            </div>

            <div className="sm:col-span-7 space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {product.name}
              </h2>

              {/* Star Rating Overview Pill */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= Math.round(currentRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-white text-xs font-mono ml-1">
                    {currentRating.toFixed(1)}
                  </span>
                </div>

                <span className="text-xs text-slate-400 font-medium">
                  ({reviewCount} Ulasan Pembeli)
                </span>

                {product.soldCount && (
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono border border-emerald-500/20">
                    {product.soldCount}+ Terjual
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
                  {formatRupiah(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs sm:text-sm text-slate-500 line-through font-mono tabular-nums">
                    {formatRupiah(product.originalPrice)}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {product.description}
              </p>

              <div className="pt-2 flex flex-col gap-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Garansi Resmi Kevin 88:{' '}
                    <strong className="text-white font-mono">
                      {product.warrantyMonths >= 12
                        ? `${product.warrantyMonths / 12} Tahun`
                        : `${product.warrantyMonths} Bulan`}
                    </strong>{' '}
                    (Ganti Unit Baru)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pengiriman Aman: Bubble wrap tebal + kardus khusus</span>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications Table */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Spesifikasi Detail Komponen
            </h3>
            <div className="bg-slate-950 rounded-2xl border border-slate-800/80 divide-y divide-slate-800/60 text-xs">
              {product.specs.map((spec) => (
                <div key={spec.label} className="grid grid-cols-12 px-4 py-2.5">
                  <div className="col-span-5 text-slate-400">{spec.label}</div>
                  <div className="col-span-7 text-slate-200 font-mono font-medium">{spec.value}</div>
                </div>
              ))}
              <div className="grid grid-cols-12 px-4 py-2.5">
                <div className="col-span-5 text-slate-400">Part Number Cocok</div>
                <div className="col-span-7 text-amber-400 font-mono text-[11px]">{product.partNumber}</div>
              </div>
            </div>
          </div>

          {/* Compatible Laptop Series */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Kompatibel untuk Seri Laptop Berikut:
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {product.compatibleModels.map((model) => (
                <span
                  key={model}
                  className="px-2.5 py-1 text-xs bg-slate-950 border border-slate-800 text-slate-300 rounded-lg font-mono"
                >
                  {model}
                </span>
              ))}
            </div>
          </div>

          {/* Section: Customer Star Ratings & Reviews */}
          <div className="pt-2 border-t border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Penilaian & Ulasan Pelanggan</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    ⭐ {currentRating.toFixed(1)} / 5.0
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ulasan asli dari pembeli di toko fisik, Shopee, Tokopedia, dan website
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto active:scale-95"
              >
                <Star className="w-3.5 h-3.5 fill-slate-950" />
                <span>{showReviewForm ? 'Tutup Formulir' : 'Tulis Ulasan & Rating'}</span>
              </button>
            </div>

            {/* Interactive Review Form */}
            {showReviewForm && (
              <form
                onSubmit={handleReviewSubmit}
                className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-4 shadow-xl animate-in fade-in duration-200"
              >
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Tulis Penilaian untuk: {product.name}</span>
                </div>

                {/* Star Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Pilih Nilai Bintang:
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (reviewHoverRating || reviewRating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setReviewHoverRating(star)}
                          onMouseLeave={() => setReviewHoverRating(0)}
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-115 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              isFilled
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-700 hover:text-amber-400'
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="ml-2 text-xs font-bold text-amber-300 font-mono">
                      {reviewRating} Bintang ({reviewRating === 5 ? 'Sangat Puas' : reviewRating === 4 ? 'Puas' : reviewRating === 3 ? 'Cukup' : 'Kurang'})
                    </span>
                  </div>
                </div>

                {/* User Info inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Nama Anda / Teknisi: *
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="Contoh: Rian (Semarang)"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Model Laptop yang Digunakan:
                    </label>
                    <input
                      type="text"
                      value={reviewerLaptop}
                      onChange={(e) => setReviewerLaptop(e.target.value)}
                      placeholder={`Contoh: ${product.compatibleModels[0] || 'Asus Vivobook'}`}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Comment Textarea */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ulasan Pengalaman Anda: *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Ceritakan kecocokan part, suhu, packing pengiriman, dan respon toko..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-xl bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 text-xs font-bold text-slate-950 rounded-xl bg-amber-400 hover:bg-amber-300 flex items-center gap-1.5 transition-all shadow-md shadow-amber-400/20 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Ulasan</span>
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-3">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-white">{rev.userName}</span>
                          {rev.verifiedPurchase && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <UserCheck className="w-3 h-3 text-emerald-400" />
                              <span>Pembeli Terverifikasi</span>
                            </span>
                          )}
                          {rev.source && (
                            <span className="text-[10px] text-slate-400 uppercase font-mono px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800">
                              {rev.source === 'tokopedia'
                                ? 'Tokopedia'
                                : rev.source === 'shopee'
                                ? 'Shopee'
                                : rev.source === 'toko'
                                ? 'Toko Fisik'
                                : 'Website'}
                            </span>
                          )}
                        </div>
                        {rev.laptopModel && (
                          <div className="text-[11px] text-amber-300/90 font-mono mt-0.5">
                            Dipasang pada: {rev.laptopModel}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <div className="flex items-center text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-800'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono mt-0.5">{rev.date}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                  <p className="text-xs text-slate-300">Belum ada ulasan untuk produk ini.</p>
                  <p className="text-[11px] text-slate-500">
                    Jadilah pembeli pertama yang memberikan ulasan dan rating bintang!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Stok Ready ({product.stock} unit di gudang)</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => toggleCompareProduct(product)}
              className={`flex-1 sm:flex-initial px-3.5 py-2.5 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isCompared
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title="Bandingkan spesifikasi dengan sparepart lain"
            >
              <Scale className="w-4 h-4" />
              <span>{isCompared ? 'Dibandingkan' : 'Bandingkan'}</span>
            </button>

            <button
              onClick={handleConsult}
              className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Tanya Admin WA</span>
            </button>

            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="flex-1 sm:flex-initial px-5 py-2.5 text-xs font-bold rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-400/20 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>+ Tambah ke Keranjang</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
