import React, { useState, useMemo } from 'react';
import { useSiteData } from '../context/SiteContext';
import { TestimonialItem, ReviewSource } from '../types';
import {
  Star,
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Quote,
  MessageSquare,
  ShoppingBag,
  MapPin,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { OdooBlockControl } from './admin/OdooBlockControl';

export const TestimonialsSection: React.FC = () => {
  const {
    settings,
    isAdminMode,
    openTestimonialsModal,
    openBackgroundModal,
    deleteTestimonial,
  } = useSiteData();

  const testimonials = settings.testimonials || {
    badge: 'Ulasan Terverifikasi Pelanggan',
    title: 'Apa Kata Mereka Tentang Kevin 88 Computer?',
    description:
      'Kutipan review asli dari pembeli di Google Maps, Tokopedia, Shopee, dan pelanggan yang datang langsung ke toko fisik kami di berbagai kota.',
    overallRating: 4.9,
    totalReviewsCount: 2480,
    reviews: [],
  };

  const [activeFilter, setActiveFilter] = useState<'all' | ReviewSource>('all');

  const filteredReviews = useMemo(() => {
    const list = testimonials.reviews || [];
    if (activeFilter === 'all') return list;
    return list.filter((r) => r.source === activeFilter);
  }, [testimonials.reviews, activeFilter]);

  const renderSourceBadge = (source: ReviewSource) => {
    switch (source) {
      case 'google_maps':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/>
            </svg>
            <span>Google Maps</span>
          </span>
        );
      case 'shopee':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/30">
            <ShoppingBag className="w-3 h-3" />
            <span>Shopee Star Seller</span>
          </span>
        );
      case 'tokopedia':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <ShoppingBag className="w-3 h-3" />
            <span>Tokopedia Official</span>
          </span>
        );
      case 'store_visit':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <MapPin className="w-3 h-3" />
            <span>Toko Fisik Walk-in</span>
          </span>
        );
      case 'whatsapp':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <MessageSquare className="w-3 h-3" />
            <span>WhatsApp Order</span>
          </span>
        );
      case 'website':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <CheckCircle className="w-3 h-3 text-amber-400" />
            <span>Nota Web Terverifikasi</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section
      id="testimoni"
      className={`py-16 bg-slate-950 border-b border-slate-800/80 relative ${
        isAdminMode ? 'odoo-editable-block' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Odoo Standard Block Control */}
        {isAdminMode && (
          <OdooBlockControl
            blockId="testimoni"
            blockName="Testimoni Pelanggan"
            onEdit={() => openTestimonialsModal(null)}
            onCustomizeBg={openBackgroundModal}
            extraActions={[
              { label: '+ Tambah Ulasan', onClick: () => openTestimonialsModal(null), icon: Plus, variant: 'primary' },
            ]}
          />
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>{testimonials.badge || 'Ulasan Terverifikasi Pelanggan'}</span>

              {isAdminMode && (
                <button
                  onClick={() => openTestimonialsModal(null)}
                  className="px-2 py-0.5 rounded-lg bg-amber-400/20 text-amber-300 text-[11px] font-bold hover:bg-amber-400/30 border border-amber-400/40 cursor-pointer shadow-sm ml-1"
                  title="Edit judul & total ulasan seksi testimoni"
                >
                  ✏️ Edit Judul Seksi
                </button>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {testimonials.title || 'Apa Kata Mereka Tentang Kevin 88 Computer?'}
            </h2>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              {testimonials.description ||
                'Kutipan review asli dari pembeli di Google Maps, Tokopedia, Shopee, dan pelanggan yang datang langsung ke toko fisik kami di berbagai kota.'}
            </p>
          </div>

          {/* Admin Action: Add New Testimonial */}
          {isAdminMode && (
            <button
              onClick={() => openTestimonialsModal(null)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Ulasan Baru</span>
            </button>
          )}
        </div>

        {/* Credibility Trust Banner */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">
                {testimonials.overallRating ?? 4.9}
              </span>
              <div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Berdasarkan {testimonials.totalReviewsCount?.toLocaleString('id-ID') || '2.480'}+ Ulasan
                </div>
              </div>
            </div>

            <div className="hidden sm:block h-8 w-px bg-slate-800" />

            <div className="text-xs text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Review Asli dari Pembeli Resmi & Pengunjung Cabang</span>
            </div>
          </div>

          {/* Marketplace Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>Google Maps <strong>4.9 / 5</strong></span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              <span>Shopee <strong>Star Seller</strong></span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Tokopedia <strong>Official</strong></span>
            </div>
          </div>
        </div>

        {/* Source Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {[
            { id: 'all', label: 'Semua Ulasan' },
            { id: 'google_maps', label: 'Google Maps' },
            { id: 'shopee', label: 'Shopee' },
            { id: 'tokopedia', label: 'Tokopedia' },
            { id: 'store_visit', label: 'Toko Offline / Cabang' },
          ].map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Testimonials Grid */}
        {filteredReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800/90 hover:border-slate-700/80 rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between relative group"
              >
                {/* Admin Actions */}
                {isAdminMode && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 bg-slate-950/80 backdrop-blur-sm p-1 rounded-lg border border-slate-800 shadow">
                    <button
                      onClick={() => openTestimonialsModal(item)}
                      className="p-1 text-amber-400 hover:bg-slate-800 rounded transition-colors"
                      title="Edit Ulasan Ini"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus ulasan dari ${item.customerName}?`)) {
                          deleteTestimonial(item.id);
                        }
                      }}
                      className="p-1 text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
                      title="Hapus Ulasan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Top Bar: Source Badge & Rating */}
                  <div className="flex items-center justify-between gap-2">
                    {renderSourceBadge(item.source)}

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(item.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Product purchased tag */}
                  {item.productPurchased && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-[11px] text-amber-300 font-medium">
                      <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{item.productPurchased}</span>
                    </div>
                  )}

                  {/* Quote Body */}
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                    "{item.quote}"
                  </p>
                </div>

                {/* Reviewer Meta */}
                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{item.customerName}</span>
                      {item.isVerified && (
                        <span title="Pembeli Terverifikasi">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        </span>
                      )}
                    </div>
                    {item.city && (
                      <div className="text-[11px] text-slate-400">
                        {item.city}
                      </div>
                    )}
                  </div>

                  {item.dateText && (
                    <span className="text-[11px] text-slate-500 font-mono">
                      {item.dateText}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 bg-slate-900 rounded-2xl border border-slate-800">
            Belum ada ulasan untuk kategori ini.
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-bold text-white">
              Punya Pengalaman Berbelanja di Kevin 88 Computer?
            </h3>
            <p className="text-xs text-slate-400">
              Ulasan Anda sangat berarti bagi calon pembeli lain yang sedang mencari sparepart laptop bergaransi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {settings.footer?.socialLinks?.googleMaps && (
              <a
                href={settings.footer.socialLinks.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>Beri Ulasan di Google Maps</span>
              </a>
            )}
            <a
              href={`https://wa.me/${settings.contacts?.whatsappNumber || '6281288880014'}?text=${encodeURIComponent('Halo Kevin 88 Computer, saya ingin konsultasi atau memberikan feedback:')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Kirim Feedback WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
