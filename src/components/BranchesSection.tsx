import React, { useState, useEffect } from 'react';
import { useSiteData } from '../context/SiteContext';
import {
  MapPin,
  Phone,
  MessageSquare,
  ExternalLink,
  Clock,
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Navigation,
  Compass,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { OdooBlockControl } from './admin/OdooBlockControl';

export const BranchesSection: React.FC = () => {
  const {
    branches,
    settings,
    isAdminMode,
    openBranchModal,
    openSectionHeadersModal,
    openCMSModal,
    openBackgroundModal,
    deleteBranch,
  } = useSiteData();
  const sectionHeaders = settings.sectionHeaders;

  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0]?.id || '');

  // Keep selected branch valid if branches change
  useEffect(() => {
    if (!branches.some((b) => b.id === selectedBranchId) && branches.length > 0) {
      setSelectedBranchId(branches[0].id);
    }
  }, [branches, selectedBranchId]);

  const activeBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];

  // Google Maps Grounding State
  const [userOrigin, setUserOrigin] = useState('');
  const [isGroundingLoading, setIsGroundingLoading] = useState(false);
  const [groundingResult, setGroundingResult] = useState<{
    text: string;
    groundingMetadata?: any;
  } | null>(null);
  const [showGroundingPanel, setShowGroundingPanel] = useState(false);

  // Reset grounding result if branch changes
  useEffect(() => {
    setGroundingResult(null);
  }, [selectedBranchId]);

  const handleFetchMapsGrounding = async (customOrigin?: string) => {
    if (!activeBranch) return;
    const originToUse = customOrigin !== undefined ? customOrigin : userOrigin;
    setIsGroundingLoading(true);
    setShowGroundingPanel(true);
    try {
      const res = await fetch('/api/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchCity: activeBranch.city,
          branchMall: activeBranch.mallName,
          branchAddress: activeBranch.address,
          userOrigin: originToUse || 'Pusat Kota / Stasiun Terdekat',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGroundingResult({
          text: data.text,
          groundingMetadata: data.groundingMetadata,
        });
      } else {
        setGroundingResult({
          text: data.error || 'Petunjuk rute navigasi cabang tersedia melalui tautan Google Maps resmi.',
        });
      }
    } catch (err: any) {
      console.error('Error fetching maps grounding:', err);
      setGroundingResult({
        text: 'Lokasi cabang kami berada di pusat perbelanjaan komputer terkemuka dan mudah dijangkau dari segala penjuru kota.',
      });
    } finally {
      setIsGroundingLoading(false);
    }
  };

  return (
    <section id="cabang" className={`py-16 bg-slate-950 border-b border-slate-800 ${isAdminMode ? 'odoo-editable-block' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Odoo Standard Block Control */}
        {isAdminMode && (
          <OdooBlockControl
            blockId="cabang"
            blockName="Cabang Fisik & Maps"
            onEdit={() => openBranchModal(null)}
            onCustomizeBg={openBackgroundModal}
            extraActions={[
              { label: '+ Tambah Cabang', onClick: () => openBranchModal(null), icon: Plus, variant: 'primary' },
              { label: 'Judul Seksi', onClick: openSectionHeadersModal, icon: Edit2 },
            ]}
          />
        )}

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-2">
              <span>{sectionHeaders?.branchesBadge || 'Jaringan Cabang Fisik & Online'}</span>
              {isAdminMode && (
                <button
                  onClick={openSectionHeadersModal}
                  className="px-2 py-0.5 rounded-lg bg-amber-400/20 text-amber-300 text-[11px] font-bold hover:bg-amber-400/30 border border-amber-400/40 cursor-pointer shadow-sm"
                  title="Edit judul seksi cabang ini"
                >
                  ✏️ Edit Judul Cabang
                </button>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {sectionHeaders?.branchesTitle || 'Kunjungi Cabang Toko Kevin 88 Computer'}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {sectionHeaders?.branchesDesc || 'Kami melayani pembelian langsung di toko fisik kami di beberapa kota besar untuk konsultasi tatap muka, pengecekan, dan pemasangan sparepart langsung oleh teknisi.'}
            </p>
          </div>

          {isAdminMode && (
            <button
              onClick={() => openBranchModal(null)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Cabang Baru</span>
            </button>
          )}
        </div>

        {/* Branch Selector Tabs */}
        {branches.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
            {branches.map((branch) => {
              const isSelected = branch.id === selectedBranchId;
              return (
                <button
                  key={branch.id}
                  onClick={() => setSelectedBranchId(branch.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{branch.city}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Active Branch Display Detail Card */}
        {activeBranch ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative">
            {/* Admin In-place actions for active branch */}
            {isAdminMode && (
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <button
                  onClick={() => openBranchModal(activeBranch)}
                  className="px-3 py-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                  title="Edit data cabang toko ini"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Cabang</span>
                </button>
                {branches.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm(`Yakin ingin menghapus cabang ${activeBranch.city}?`)) {
                        deleteBranch(activeBranch.id);
                      }
                    }}
                    className="p-2 bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 rounded-lg transition-all cursor-pointer"
                    title="Hapus Cabang Ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Toko Resmi Cabang {activeBranch.city}</span>
              </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {activeBranch.mallName}
                </h3>

                <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 pt-1">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>{activeBranch.address}</span>
                </div>

                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{activeBranch.operationalHours}</span>
                </div>

                {activeBranch.phone && (
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="font-mono">{activeBranch.phone}</span>
                  </div>
                )}

                <div className="pt-2 flex flex-wrap gap-2 text-xs text-slate-300">
                  {activeBranch.hasTechnicianOnSite && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>Teknisi Siap Pasang di Tempat</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cek Voltase & Ampere Gratis</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-4">
                  <a
                    href={`https://wa.me/${activeBranch.whatsapp}?text=${encodeURIComponent(`Halo Kevin 88 Computer Cabang ${activeBranch.city}, saya ingin menanyakan ketersediaan sparepart laptop:`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Cabang {activeBranch.city}</span>
                  </a>

                  {activeBranch.mapsUrl && (
                    <a
                      href={activeBranch.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-medium flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                      <span>Buka Google Maps</span>
                    </a>
                  )}

                  {/* Google Maps Live Grounding Assistant Trigger */}
                  <button
                    onClick={() => {
                      if (!showGroundingPanel && !groundingResult) {
                        handleFetchMapsGrounding();
                      } else {
                        setShowGroundingPanel(!showGroundingPanel);
                      }
                    }}
                    className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 hover:from-amber-500/30 hover:to-orange-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Panduan Akses & Rute (Maps Live)</span>
                    {showGroundingPanel ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Google Maps Grounding Interactive Panel */}
                {showGroundingPanel && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-amber-500/30 shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <Navigation className="w-4 h-4 text-amber-400" />
                        <span>Live Google Maps Grounding – {activeBranch.city}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                        Google Maps Grounded
                      </span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] text-slate-300 block">
                        Pilih atau ketik titik keberangkatan Anda untuk rekomendasi rute tercepat:
                      </label>
                      <div className="flex flex-wrap gap-1.5 pb-1">
                        {[
                          'Pusat Kota / Alun-alun',
                          'Stasiun KA Terdekat',
                          'Terminal Bus',
                          'Bandara',
                        ].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              setUserOrigin(preset);
                              handleFetchMapsGrounding(preset);
                            }}
                            className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                              userOrigin === preset
                                ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold'
                                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-amber-400/50'
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={userOrigin}
                          onChange={(e) => setUserOrigin(e.target.value)}
                          placeholder="Atau ketik nama daerah / jalan asal Anda..."
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                        />
                        <button
                          onClick={() => handleFetchMapsGrounding()}
                          disabled={isGroundingLoading}
                          className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          {isGroundingLoading ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Mencari...</span>
                            </>
                          ) : (
                            <>
                              <Compass className="w-3.5 h-3.5" />
                              <span>Cek Rute</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Result Content */}
                    {isGroundingLoading && (
                      <div className="py-6 flex flex-col items-center justify-center gap-2 text-center text-xs text-amber-300/80">
                        <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                        <span>Mengambil petunjuk navigasi terverifikasi Google Maps...</span>
                      </div>
                    )}

                    {!isGroundingLoading && groundingResult && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-2.5 text-xs text-slate-200">
                        <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 leading-relaxed whitespace-pre-line">
                          {groundingResult.text}
                        </div>

                        {/* Grounding Source Attribution */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <span>Sumber Data: Google Maps & Kevin 88 Verified Locations</span>
                          </span>

                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                              `${activeBranch.mallName}, ${activeBranch.address}`
                            )}${userOrigin ? `&origin=${encodeURIComponent(userOrigin)}` : ''}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-semibold underline"
                          >
                            <span>Buka Navigasi Rute Langsung di App Maps →</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 bg-slate-900 rounded-xl border border-slate-800">
            Belum ada cabang terdaftar.
          </div>
        )}
      </div>
    </section>
  );
};
