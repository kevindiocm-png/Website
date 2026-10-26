import React, { useState, useEffect } from 'react';
import { useSiteData } from '../../context/SiteContext';
import { TestimonialItem, ReviewSource } from '../../types';
import { X, Star, Trash2, Plus, MessageSquare, ShieldCheck, Check } from 'lucide-react';

export const TestimonialsEditModal: React.FC = () => {
  const {
    isTestimonialsModalOpen,
    closeTestimonialsModal,
    editingTestimonial,
    settings,
    updateTestimonials,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
  } = useSiteData();

  const testimonialsSettings = settings.testimonials || {
    badge: 'Ulasan Terverifikasi Pelanggan',
    title: 'Apa Kata Mereka Tentang Kevin 88 Computer?',
    description: 'Kutipan review asli dari pembeli di Google Maps, Tokopedia, Shopee, dan pelanggan toko fisik kami.',
    overallRating: 4.9,
    totalReviewsCount: 2480,
    reviews: [],
  };

  // Section Header Form State
  const [badge, setBadge] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [overallRating, setOverallRating] = useState(4.9);
  const [totalReviewsCount, setTotalReviewsCount] = useState(2480);

  // Single Review Form State (for Add / Edit review)
  const [activeTab, setActiveTab] = useState<'review' | 'section'>('review');
  const [customerName, setCustomerName] = useState('');
  const [city, setCity] = useState('');
  const [rating, setRating] = useState(5);
  const [source, setSource] = useState<ReviewSource>('google_maps');
  const [productPurchased, setProductPurchased] = useState('');
  const [dateText, setDateText] = useState('Baru saja');
  const [quote, setQuote] = useState('');
  const [isVerified, setIsVerified] = useState(true);

  // Sync state when modal opens
  useEffect(() => {
    if (isTestimonialsModalOpen) {
      setBadge(testimonialsSettings.badge || 'Ulasan Terverifikasi Pelanggan');
      setTitle(testimonialsSettings.title || 'Apa Kata Mereka Tentang Kevin 88 Computer?');
      setDescription(testimonialsSettings.description || '');
      setOverallRating(testimonialsSettings.overallRating ?? 4.9);
      setTotalReviewsCount(testimonialsSettings.totalReviewsCount ?? 2480);

      if (editingTestimonial) {
        setActiveTab('review');
        setCustomerName(editingTestimonial.customerName || '');
        setCity(editingTestimonial.city || '');
        setRating(editingTestimonial.rating || 5);
        setSource(editingTestimonial.source || 'google_maps');
        setProductPurchased(editingTestimonial.productPurchased || '');
        setDateText(editingTestimonial.dateText || 'Baru saja');
        setQuote(editingTestimonial.quote || '');
        setIsVerified(editingTestimonial.isVerified ?? true);
      } else {
        // Reset single review fields for new entry
        setCustomerName('');
        setCity('');
        setRating(5);
        setSource('google_maps');
        setProductPurchased('');
        setDateText('Baru saja');
        setQuote('');
        setIsVerified(true);
      }
    }
  }, [isTestimonialsModalOpen, editingTestimonial, settings.testimonials]);

  if (!isTestimonialsModalOpen) return null;

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    updateTestimonials({
      badge,
      title,
      description,
      overallRating: Number(overallRating),
      totalReviewsCount: Number(totalReviewsCount),
    });
    closeTestimonialsModal();
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !quote.trim()) {
      alert('Nama pelanggan dan isi ulasan wajib diisi.');
      return;
    }

    if (editingTestimonial) {
      updateTestimonial(editingTestimonial.id, {
        customerName,
        city,
        rating: Number(rating),
        source,
        productPurchased,
        dateText,
        quote,
        isVerified,
      });
    } else {
      addTestimonial({
        customerName,
        city,
        rating: Number(rating),
        source,
        productPurchased,
        dateText,
        quote,
        isVerified,
      });
    }

    closeTestimonialsModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <Star className="w-5 h-5 fill-amber-400" />
            </span>
            <div>
              <h3 className="font-bold text-base text-white">
                {editingTestimonial
                  ? 'Edit Ulasan Pelanggan'
                  : activeTab === 'review'
                  ? 'Tambah Ulasan Testimoni Baru'
                  : 'Edit Judul & Statistik Testimoni'}
              </h3>
              <p className="text-xs text-slate-400">
                Kelola review pembeli marketplace & Google Maps toko Kevin 88
              </p>
            </div>
          </div>
          <button
            onClick={closeTestimonialsModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher if not directly editing single item */}
        {!editingTestimonial && (
          <div className="flex border-b border-slate-800 px-6 bg-slate-900/50">
            <button
              onClick={() => setActiveTab('review')}
              className={`py-3 text-xs font-bold border-b-2 mr-6 transition-colors ${
                activeTab === 'review'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              + Tambah Review Baru
            </button>
            <button
              onClick={() => setActiveTab('section')}
              className={`py-3 text-xs font-bold border-b-2 transition-colors ${
                activeTab === 'section'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Judul Seksi & Total Rating
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'review' ? (
            <form id="review-form" onSubmit={handleSaveReview} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Nama Pelanggan / Reviewer *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Hendra Prasetyo"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Kota / Asal
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Contoh: Semarang / Surabaya"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Platform Sumber Review
                  </label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as ReviewSource)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="google_maps">Google Maps Review</option>
                    <option value="shopee">Shopee Star Seller</option>
                    <option value="tokopedia">Tokopedia Official</option>
                    <option value="store_visit">Toko Fisik / Offline Walk-in</option>
                    <option value="whatsapp">WhatsApp Konsultasi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Rating Bintang (1 - 5)
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Bintang)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Bintang)</option>
                    <option value={3}>⭐⭐⭐ (3 Bintang)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Waktu / Tanggal
                  </label>
                  <input
                    type="text"
                    value={dateText}
                    onChange={(e) => setDateText(e.target.value)}
                    placeholder="Contoh: 3 hari lalu"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Produk / Layanan Yang Dibeli
                </label>
                <input
                  type="text"
                  value={productPurchased}
                  onChange={(e) => setProductPurchased(e.target.value)}
                  placeholder="Contoh: Baterai Asus ROG Strix / Layar LCD 14.0 FHD Slim"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Isi Kutipan Ulasan Review *
                </label>
                <textarea
                  required
                  rows={4}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Tuliskan ulasan review pelanggan di sini..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="verified-check"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700"
                />
                <label htmlFor="verified-check" className="text-xs text-slate-300 cursor-pointer">
                  Tampilkan lencana <strong>Pembeli Terverifikasi (Verified Purchase)</strong>
                </label>
              </div>
            </form>
          ) : (
            <form id="section-form" onSubmit={handleSaveSection} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Badge Seksi
                </label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="Ulasan Terverifikasi Pelanggan"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Judul Seksi Testimoni
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Apa Kata Mereka Tentang Kevin 88 Computer?"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Deskripsi / Subjudul
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kutipan review asli dari pembeli di Google Maps, Tokopedia, Shopee..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Rating Rata-rata Keseluruhan
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={overallRating}
                    onChange={(e) => setOverallRating(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Total Jumlah Ulasan
                  </label>
                  <input
                    type="number"
                    value={totalReviewsCount}
                    onChange={(e) => setTotalReviewsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          {editingTestimonial ? (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Yakin ingin menghapus ulasan dari ${editingTestimonial.customerName}?`)) {
                  deleteTestimonial(editingTestimonial.id);
                  closeTestimonialsModal();
                }
              }}
              className="px-3 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Review</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeTestimonialsModal}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              form={activeTab === 'review' ? 'review-form' : 'section-form'}
              className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/10 cursor-pointer"
            >
              {editingTestimonial ? 'Simpan Perubahan Review' : activeTab === 'review' ? 'Tambahkan Review' : 'Simpan Info Seksi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
