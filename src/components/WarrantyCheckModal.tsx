import React, { useState, useEffect } from 'react';
import { useSiteData } from '../context/SiteContext';
import { calculateWarrantyDetails, CalculatedWarranty } from '../utils/warranty';
import { createWhatsAppConsultationUrl } from '../utils/format';
import {
  ShieldCheck,
  Search,
  X,
  AlertCircle,
  Clock,
  Calendar,
  MapPin,
  Store,
  CheckCircle2,
  FileText,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  ShieldX,
  Edit2,
} from 'lucide-react';

export const WarrantyCheckModal: React.FC = () => {
  const {
    isWarrantyModalOpen,
    warrantySearchQuery,
    closeWarrantyModal,
    lookupWarranty,
    branches,
    settings,
    isAdminMode,
    openWarrantyEditModal,
  } = useSiteData();

  const [query, setQuery] = useState(warrantySearchQuery || '');
  const [results, setResults] = useState<CalculatedWarranty[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (warrantySearchQuery) {
      setQuery(warrantySearchQuery);
      handleSearch(warrantySearchQuery);
    }
  }, [warrantySearchQuery]);

  if (!isWarrantyModalOpen) return null;

  const handleSearch = (searchKey?: string) => {
    const q = (searchKey !== undefined ? searchKey : query).trim();
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

  const handleQuickChip = (sampleCode: string) => {
    setQuery(sampleCode);
    handleSearch(sampleCode);
  };

  const handleClaimWhatsApp = (item: CalculatedWarranty) => {
    const url = createWhatsAppConsultationUrl({
      laptopBrand: item.record.brand,
      sparepartType: item.record.productName,
      notes: `Halo Kevin 88 Computer, saya ingin klaim garansi untuk produk:
- Sparepart: ${item.record.productName}
- Serial Number (S/N): ${item.record.serialNumber}
- No. Nota / Invoice: ${item.record.invoiceNumber}
- Tanggal Pembelian: ${item.purchaseDateFormatted}
- Masa Berlaku Sampai: ${item.expiryDateFormatted} (${item.statusLabel})
- Cabang: ${item.record.branchName}

Kendala yang dialami: (mohon tuliskan kendala sparepart di sini)`,
    });
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>Cek Garansi Sparepart</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Resmi Kevin 88
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Verifikasi keaslian dan sisa masa garansi resmi suku cadang laptop Anda
              </p>
            </div>
          </div>
          <button
            onClick={closeWarrantyModal}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Search Box */}
          <div className="space-y-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Masukkan Nomor Seri (S/N) atau No. Nota (contoh: INV-2026-0901-001)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-400 focus:outline-hidden text-sm text-white placeholder-slate-500 transition-colors"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setResults([]);
                      setHasSearched(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-all shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Cek Garansi</span>
              </button>
            </form>

            {/* Quick Test Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400">Contoh cek cepat:</span>
                {isAdminMode && (
                  <button
                    type="button"
                    onClick={openWarrantyEditModal}
                    className="p-1 rounded bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 text-[10px] font-bold border border-amber-400/30 cursor-pointer"
                    title="Owner: Edit Contoh Cek Cepat & Ketentuan"
                  >
                    <Edit2 className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
              {(settings?.warrantySettings?.quickChips && settings.warrantySettings.quickChips.length > 0
                ? settings.warrantySettings.quickChips
                : [
                    { label: '🔋 Baterai ROG (Aktif)', code: 'KV88-BAT-ASUS-2026' },
                    { label: '⚡ Charger GaN (12 Bln)', code: 'KV88-CHG-TYPEC-65W' },
                    { label: '🖥️ LCD 14 Slim (Segera Berakhir)', code: 'KV88-LCD-14FHD-8842' },
                    { label: '🧾 No. Nota Pembelian', code: 'INV-2026-0901-001' },
                  ]
              ).map((chip) => (
                <button
                  key={chip.code}
                  type="button"
                  onClick={() => handleQuickChip(chip.code)}
                  className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Area */}
          {hasSearched ? (
            results.length > 0 ? (
              <div className="space-y-4">
                <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Ditemukan {results.length} data garansi resmi:</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Terverifikasi di Database
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
                          ? 'bg-slate-950/60 border-rose-500/30'
                          : isExpiringSoon
                          ? 'bg-slate-950/60 border-amber-500/40'
                          : 'bg-slate-950/80 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                      }`}
                    >
                      {/* Top Status & Badge */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
                        <div className="flex items-center gap-2">
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
                          <span className="text-xs text-slate-400 font-mono">
                            Garansi {item.record.warrantyMonths} Bulan
                          </span>
                        </div>

                        <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-amber-400" />
                          <span>Nota: #{item.record.invoiceNumber}</span>
                        </div>
                      </div>

                      {/* Product Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                        <div className="space-y-1">
                          <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                            Nama Sparepart & Spesifikasi
                          </div>
                          <div className="text-sm font-bold text-white leading-snug">
                            {item.record.productName}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-1">
                            <span className="text-amber-400 font-semibold">{item.record.brand}</span>
                            <span>•</span>
                            <span>P/N: {item.record.partNumber}</span>
                          </div>
                        </div>

                        <div className="space-y-1 bg-slate-900/60 rounded-xl p-3 border border-slate-800/80">
                          <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wider">
                            Nomor Seri Resmi (S/N)
                          </div>
                          <div className="text-sm font-mono font-bold text-amber-300 select-all">
                            {item.record.serialNumber}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span>Cabang: {item.record.branchName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Timeline & Progress Bar */}
                      <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <div className="space-y-0.5">
                            <div className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> Tanggal Pembelian
                            </div>
                            <div className="font-semibold text-slate-200">
                              {item.purchaseDateFormatted}
                            </div>
                          </div>

                          <div className="text-right space-y-0.5">
                            <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                              <Clock className="w-3 h-3" /> Garansi Berakhir
                            </div>
                            <div
                              className={`font-bold ${
                                isExpired ? 'text-rose-400' : 'text-emerald-400'
                              }`}
                            >
                              {item.expiryDateFormatted}
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar Track */}
                        <div className="space-y-1">
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
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                            <span>Masa Pakai: {item.usedDays} hari ({item.percentageUsed}%)</span>
                            <span>
                              {isExpired
                                ? 'Masa garansi telah habis'
                                : `${item.remainingDays} hari tersisa`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Notes / Information */}
                      {item.record.notes && (
                        <div className="mt-3 text-xs text-slate-400 bg-slate-900/40 rounded-lg p-2.5 border border-slate-800/60 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{item.record.notes}</span>
                        </div>
                      )}

                      {/* Claim Action Bar */}
                      <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs text-slate-400">
                          {isExpired ? (
                            <span className="text-rose-300">
                              Garansi habis. Perbaikan tetap bisa dibantu dengan biaya servis diskon.
                            </span>
                          ) : (
                            <span className="text-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Garansi masih berlaku. Siap klaim jika ada kendala suku cadang.
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleClaimWhatsApp(item)}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Klaim Garansi via WhatsApp</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 space-y-3 bg-slate-950/40 rounded-2xl border border-slate-800 p-6">
                <ShieldX className="w-12 h-12 text-rose-400/80 mx-auto" />
                <h4 className="text-sm font-bold text-white">Data Garansi Tidak Ditemukan</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Nomor seri atau nomor nota <span className="text-amber-300 font-mono font-bold">"{query}"</span> tidak terdaftar di sistem online.
                </p>
                <div className="text-xs text-slate-400 max-w-lg mx-auto bg-slate-900 rounded-xl p-3 border border-slate-800 text-left space-y-1.5">
                  <div className="font-semibold text-slate-200">Tips Pengecekan:</div>
                  <ul className="list-disc pl-4 space-y-1 text-[11px]">
                    <li>Periksa kembali huruf besar/kecil atau tanda strip (-) pada Nomor Seri.</li>
                    <li>Untuk nota pembelian baru di website, Anda bisa memasukkan nomor invoice (contoh: <span className="font-mono text-amber-300">INV-2026-0901-001</span>).</li>
                    <li>Jika nota Anda adalah nota fisik toko lawas, tim teknisi kami siap melakukan cek manual di pembukuan cabang.</li>
                  </ul>
                </div>
                <div className="pt-2">
                  <a
                    href="https://wa.me/62895392019488?text=Halo%20Kevin%2088%20Computer,%20saya%20ingin%20cek%20garansi%20sparepart%20secara%20manual"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Hubungi CS Toko untuk Cek Manual</span>
                  </a>
                </div>
              </div>
            )
          ) : (
            /* Initial Guide before search */
            <div className="bg-slate-950/40 rounded-2xl border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    {settings?.warrantySettings?.title || 'Ketentuan Garansi Kevin 88 Computer'}
                  </span>
                </h4>
                {isAdminMode && (
                  <button
                    type="button"
                    onClick={openWarrantyEditModal}
                    className="px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-[10px] font-bold border border-amber-400/40 flex items-center gap-1 cursor-pointer transition-colors"
                    title="Owner: Edit Ketentuan Garansi"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit Ketentuan</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {(settings?.warrantySettings?.pillars && settings.warrantySettings.pillars.length > 0
                  ? settings.warrantySettings.pillars
                  : [
                      {
                        id: 'pillar-1',
                        title: 'Tukar Baru (1-to-1)',
                        description: 'Suku cadang yang bermasalah langsung diganti unit baru tanpa menunggu servis lama.',
                      },
                      {
                        id: 'pillar-2',
                        title: 'Segel Utuh',
                        description: 'Garansi berlaku jika segel hologram Kevin 88 utuh dan bukan akibat tersiram cairan/benturan fisik.',
                      },
                      {
                        id: 'pillar-3',
                        title: 'Seluruh Cabang',
                        description: 'Klaim garansi bisa dilayani langsung di cabang Plasa Simpang Lima maupun cabang kota lainnya.',
                      },
                    ]
                ).map((pillar) => (
                  <div
                    key={pillar.id}
                    className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 space-y-1"
                  >
                    <div className="font-bold text-white flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{pillar.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 leading-relaxed">
                      {pillar.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Pusat Bantuan & Garansi:</span>
            <a
              href={`https://wa.me/${(settings?.warrantySettings?.helpWhatsApp || '62895392019488').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 font-mono font-bold hover:underline"
            >
              {settings?.warrantySettings?.helpPhone || '0895-3920-19488'}
            </a>
          </div>

          <div className="flex items-center gap-2">
            {isAdminMode && (
              <button
                type="button"
                onClick={openWarrantyEditModal}
                className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs font-bold border border-amber-400/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Owner: Edit Ketentuan & Kontak Garansi"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit Garansi</span>
              </button>
            )}

            <button
              onClick={closeWarrantyModal}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
