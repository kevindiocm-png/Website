import React, { useState, useEffect } from 'react';
import { useSiteData } from '../../context/SiteContext';
import { Layout, X, Check } from 'lucide-react';
import { DEFAULT_SETTINGS } from '../../data/defaultSettings';

interface SectionHeadersEditModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const SectionHeadersEditModal: React.FC<SectionHeadersEditModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    isSectionHeadersModalOpen,
    closeSectionHeadersModal,
    settings,
    updateSectionHeaders,
  } = useSiteData();

  const activeIsOpen = isOpen !== undefined ? isOpen : isSectionHeadersModalOpen;
  const handleClose = onClose || closeSectionHeadersModal;

  const [catalogBadge, setCatalogBadge] = useState('');
  const [catalogTitle, setCatalogTitle] = useState('');
  const [catalogDesc, setCatalogDesc] = useState('');

  const [checkerBadge, setCheckerBadge] = useState('');
  const [checkerTitle, setCheckerTitle] = useState('');
  const [checkerDesc, setCheckerDesc] = useState('');

  const [branchesBadge, setBranchesBadge] = useState('');
  const [branchesTitle, setBranchesTitle] = useState('');
  const [branchesDesc, setBranchesDesc] = useState('');

  const [faqBadge, setFaqBadge] = useState('');
  const [faqTitle, setFaqTitle] = useState('');
  const [faqDesc, setFaqDesc] = useState('');

  useEffect(() => {
    const headers = settings?.sectionHeaders || DEFAULT_SETTINGS.sectionHeaders!;
    setCatalogBadge(headers.catalogBadge || 'Katalog Komponen');
    setCatalogTitle(headers.catalogTitle || 'Pilihan Sparepart Laptop Bergaransi');
    setCatalogDesc(headers.catalogDesc || 'Komponen pengganti dan upgrade kualitas original serta OEM Grade A+.');

    setCheckerBadge(headers.checkerBadge || 'Pengecekan Kompatibilitas');
    setCheckerTitle(headers.checkerTitle || 'Cek Kecocokan Sparepart dengan Laptop Anda');
    setCheckerDesc(headers.checkerDesc || 'Pilih merk dan seri laptop Anda untuk melihat rekomendasi tipe baterai, charger, RAM, dan layar yang tepat.');

    setBranchesBadge(headers.branchesBadge || 'Jaringan Toko Fisik');
    setBranchesTitle(headers.branchesTitle || 'Kunjungi Cabang Kevin 88 Computer Terdekat');
    setBranchesDesc(headers.branchesDesc || 'Tersedia layanan pasang langsung di tempat, konsultasi kerusakan hardware, dan klaim garansi tanpa ribet.');

    setFaqBadge(headers.faqBadge || 'Pertanyaan Umum');
    setFaqTitle(headers.faqTitle || 'Frequently Asked Questions (FAQ)');
    setFaqDesc(headers.faqDesc || 'Hal-hal yang sering ditanyakan seputar pembelian, garansi, dan pengiriman sparepart di Kevin 88 Computer.');
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSectionHeaders({
      catalogBadge,
      catalogTitle,
      catalogDesc,
      checkerBadge,
      checkerTitle,
      checkerDesc,
      branchesBadge,
      branchesTitle,
      branchesDesc,
      faqBadge,
      faqTitle,
      faqDesc,
    });
    handleClose();
  };

  if (!activeIsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Layout className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Edit Judul & Subtitle Seluruh Seksi Website</h3>
              <p className="text-xs text-slate-400">
                Ubah judul besar, badge, dan deskripsi seksi Katalog, Kompatibilitas, Cabang, dan FAQ.
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Katalog */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              1. Seksi Katalog Produk
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Badge Atas</label>
                <input
                  type="text"
                  value={catalogBadge}
                  onChange={(e) => setCatalogBadge(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Judul Utama</label>
                <input
                  type="text"
                  value={catalogTitle}
                  onChange={(e) => setCatalogTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Deskripsi Seksi</label>
              <input
                type="text"
                value={catalogDesc}
                onChange={(e) => setCatalogDesc(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
              />
            </div>
          </div>

          {/* Section 2: Cek Kompatibilitas */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              2. Seksi Cek Kompatibilitas
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Badge Atas</label>
                <input
                  type="text"
                  value={checkerBadge}
                  onChange={(e) => setCheckerBadge(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Judul Utama</label>
                <input
                  type="text"
                  value={checkerTitle}
                  onChange={(e) => setCheckerTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Deskripsi Seksi</label>
              <input
                type="text"
                value={checkerDesc}
                onChange={(e) => setCheckerDesc(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
              />
            </div>
          </div>

          {/* Section 3: Cabang Toko */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              3. Seksi Cabang Toko Fisik
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Badge Atas</label>
                <input
                  type="text"
                  value={branchesBadge}
                  onChange={(e) => setBranchesBadge(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Judul Utama</label>
                <input
                  type="text"
                  value={branchesTitle}
                  onChange={(e) => setBranchesTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Deskripsi Seksi</label>
              <input
                type="text"
                value={branchesDesc}
                onChange={(e) => setBranchesDesc(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
              />
            </div>
          </div>

          {/* Section 4: FAQ */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              4. Seksi Pertanyaan Umum (FAQ)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Badge Atas</label>
                <input
                  type="text"
                  value={faqBadge}
                  onChange={(e) => setFaqBadge(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Judul Utama</label>
                <input
                  type="text"
                  value={faqTitle}
                  onChange={(e) => setFaqTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Deskripsi Seksi</label>
              <input
                type="text"
                value={faqDesc}
                onChange={(e) => setFaqDesc(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-400/20"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Judul Seksi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
