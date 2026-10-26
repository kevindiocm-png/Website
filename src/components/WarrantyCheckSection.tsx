import React, { useState } from 'react';
import { useSiteData } from '../context/SiteContext';
import { calculateWarrantyDetails, CalculatedWarranty } from '../utils/warranty';
import { createWhatsAppConsultationUrl } from '../utils/format';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  FileText,
  MessageCircle,
  X,
  AlertCircle,
  Sparkles,
  ShieldX,
  ShieldAlert,
  Edit2,
} from 'lucide-react';
import { OdooBlockControl } from './admin/OdooBlockControl';

export const WarrantyCheckSection: React.FC = () => {
  const {
    lookupWarranty,
    settings,
    openWarrantyModal,
    openWarrantyEditModal,
    openBackgroundModal,
    isAdminMode,
  } = useSiteData();

  const [inputQuery, setInputQuery] = useState('');
  const [results, setResults] = useState<CalculatedWarranty[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (searchKey?: string) => {
    const q = (searchKey !== undefined ? searchKey : inputQuery).trim();
    if (!q) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    const matches = lookupWarranty(q);
    const calculated = matches.map((m) => calculateWarrantyDetails(m));
    setResults(calculated);
    setHasSearched(true);
  };

  const handleQuickChip = (code: string) => {
    setInputQuery(code);
    handleSearch(code);
  };

  const handleClaimWhatsApp = (item: CalculatedWarranty) => {
    const url = createWhatsAppConsultationUrl({
      laptopBrand: item.record.brand,
      sparepartType: item.record.productName,
      notes: `Halo Kevin 88 Computer, saya ingin konfirmasi klaim garansi untuk:
- Sparepart: ${item.record.productName}
- Serial Number (S/N): ${item.record.serialNumber}
- No. Nota: ${item.record.invoiceNumber}
- Garansi Sampai: ${item.expiryDateFormatted} (${item.statusLabel})
- Cabang: ${item.record.branchName}`,
    });
    window.open(url, '_blank');
  };

  return (
    <section id="garansi" className={`py-16 sm:py-20 border-t border-slate-800/80 relative ${isAdminMode ? 'odoo-editable-block' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Odoo Standard Block Control */}
        {isAdminMode && (
          <OdooBlockControl
            blockId="garansi"
            blockName="Layanan Garansi & Cek S/N"
            onEdit={() => openWarrantyModal()}
            onCustomizeBg={openBackgroundModal}
            extraActions={[
              { label: 'Buka Cek Garansi', onClick: () => openWarrantyModal(), icon: ShieldCheck, variant: 'emerald' },
            ]}
          />
        )}

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>Layanan Purna Jual & Verifikasi Resmi</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cek Sisa Garansi Sparepart Laptop Anda
          </h2>

          <p className="text-sm text-slate-400 leading-relaxed">
            Masukkan Nomor Seri (S/N) pada stiker segel atau Nomor Nota pembelian untuk memeriksa masa aktif garansi, tanggal kedaluwarsa, dan status penggantian unit baru.
          </p>
        </div>

        {/* Main Search Panel */}
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ketik Nomor Seri (S/N) atau No. Nota (contoh: INV-2026-0901-001)..."
                className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-hidden text-sm text-white placeholder-slate-500 transition-colors"
              />
              {inputQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setInputQuery('');
                    setResults([]);
                    setHasSearched(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all hover:scale-102 active:scale-98 shrink-0"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verifikasi Garansi</span>
            </button>
          </form>

          {/* Quick Demo Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-400">
            <span className="text-[11px] font-medium">Contoh kode uji:</span>
            {[
              { label: '🔋 Baterai ROG (Aktif)', code: 'KV88-BAT-ASUS-2026' },
              { label: '⚡ Charger GaN (12 Bln)', code: 'KV88-CHG-TYPEC-65W' },
              { label: '🖥️ LCD Slim 14 (Segera Berakhir)', code: 'KV88-LCD-14FHD-8842' },
              { label: '🧾 No. Nota', code: 'INV-2026-0901-001' },
            ].map((chip) => (
              <button
                key={chip.code}
                type="button"
                onClick={() => handleQuickChip(chip.code)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-950 hover:bg-slate-800 text-amber-300 border border-slate-800 transition-colors cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Search Result Display */}
          {hasSearched && (
            <div className="pt-4 border-t border-slate-800/80">
              {results.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span>Hasil Pencarian ({results.length} data):</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi Resmi
                    </span>
                  </div>

                  {results.map((item) => {
                    const isExpired = item.status === 'expired';
                    const isExpiringSoon = item.status === 'expiring_soon';

                    return (
                      <div
                        key={item.record.id}
                        className={`rounded-2xl p-5 border transition-all ${
                          isExpired
                            ? 'bg-slate-950/80 border-rose-500/40'
                            : isExpiringSoon
                            ? 'bg-slate-950/80 border-amber-500/50'
                            : 'bg-slate-950 border-emerald-500/40 shadow-xl'
                        }`}
                      >
                        {/* Status Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${item.statusBg} ${item.statusColor} ${item.statusBorder}`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isExpired
                                  ? 'bg-rose-400'
                                  : isExpiringSoon
                                  ? 'bg-amber-400 animate-pulse'
                                  : 'bg-emerald-400 animate-pulse'
                              }`}
                            />
                            <span>{item.statusLabel}</span>
                          </span>

                          <div className="text-xs font-mono text-slate-400 flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-amber-400" />
                            <span>Nota: #{item.record.invoiceNumber}</span>
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="my-3 space-y-1">
                          <h4 className="text-sm sm:text-base font-bold text-white">
                            {item.record.productName}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                            <span className="text-amber-400 font-semibold">{item.record.brand}</span>
                            <span>•</span>
                            <span>P/N: {item.record.partNumber}</span>
                            <span>•</span>
                            <span className="text-slate-300">S/N: {item.record.serialNumber}</span>
                          </div>
                        </div>

                        {/* Progress Bar & Dates */}
                        <div className="bg-slate-900 rounded-xl p-3.5 border border-slate-800 space-y-2.5">
                          <div className="flex justify-between text-xs">
                            <div className="space-y-0.5">
                              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> Tanggal Beli
                              </span>
                              <div className="font-semibold text-slate-200">
                                {item.purchaseDateFormatted}
                              </div>
                            </div>
                            <div className="text-right space-y-0.5">
                              <span className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                                <Clock className="w-3 h-3" /> Masa Garansi Berakhir
                              </span>
                              <div
                                className={`font-bold ${
                                  isExpired ? 'text-rose-400' : 'text-emerald-400'
                                }`}
                              >
                                {item.expiryDateFormatted}
                              </div>
                            </div>
                          </div>

                          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                isExpired
                                  ? 'bg-rose-500'
                                  : isExpiringSoon
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-400'
                              }`}
                              style={{ width: `${item.percentageUsed}%` }}
                            />
                          </div>

                          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                            <span>Masa Pakai: {item.usedDays} hari</span>
                            <span>
                              {isExpired ? 'Kedaluwarsa' : `${item.remainingDays} hari tersisa`}
                            </span>
                          </div>
                        </div>

                        {/* Claim WhatsApp Button */}
                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                          <div className="text-xs text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            <span>Cabang: {item.record.branchName}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleClaimWhatsApp(item)}
                            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Klaim Garansi via WhatsApp</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 space-y-2">
                  <ShieldX className="w-10 h-10 text-rose-400 mx-auto" />
                  <div className="text-sm font-bold text-white">Nomor Tidak Ditemukan</div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Nomor seri atau nota "{inputQuery}" belum terdaftar di sistem online. Silakan periksa kembali ketikan Anda atau hubungi admin WhatsApp kami.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 3 Pillars of Kevin 88 Warranty */}
        <div className="max-w-4xl mx-auto mt-10">
          {isAdminMode && (
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={openWarrantyEditModal}
                className="px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs font-bold border border-amber-400/40 flex items-center gap-1 cursor-pointer transition-colors"
                title="Owner: Edit Ketentuan Garansi"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit Ketentuan Garansi</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {(settings?.warrantySettings?.pillars && settings.warrantySettings.pillars.length > 0
              ? settings.warrantySettings.pillars
              : [
                  {
                    id: 'pillar-1',
                    title: 'Tukar Unit Baru Langsung',
                    description: 'Jika sparepart cacat produksi dalam masa garansi, kami ganti unit baru tanpa menunggu perbaikan pabrik.',
                    badge: '1-to-1',
                  },
                  {
                    id: 'pillar-2',
                    title: 'Klaim Cepat di Toko Fisik',
                    description: 'Bawa laptop & struk ke Plasa Simpang Lima atau cabang kota lainnya, teknisi kami cek di tempat.',
                    badge: '⚡ Cepat',
                  },
                  {
                    id: 'pillar-3',
                    title: 'Segel Hologram Resmi',
                    description: 'Setiap suku cadang dipasang segel hologram resmi Kevin 88 Computer yang menjamin keaslian dan validitas purna jual.',
                    badge: '🛡️ Segel',
                  },
                ]
            ).map((p, idx) => (
              <div key={p.id || idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-center sm:text-left">
                <div className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center font-bold font-mono mx-auto sm:mx-0 text-xs">
                  {p.badge || `${idx + 1}`}
                </div>
                <div className="font-bold text-white text-sm">{p.title}</div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
