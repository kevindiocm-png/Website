import React, { useState, useEffect } from 'react';
import { useSiteData } from '../../context/SiteContext';
import { AboutSettings } from '../../types';
import { X, Check, Plus, Trash2, BookOpen } from 'lucide-react';

export const AboutEditModal: React.FC = () => {
  const { isAboutModalOpen, closeAboutModal, settings, updateAbout } = useSiteData();

  const [formData, setFormData] = useState<AboutSettings>({
    badge: 'Dedikasi Sejak 2014',
    title: 'Solusi Terpercaya Kebutuhan Sparepart Laptop Anda',
    storyParagraphs: ['', '', ''],
    stats: [],
    reasons: [],
  });

  useEffect(() => {
    if (settings?.about) {
      setFormData(settings.about);
    }
  }, [settings, isAboutModalOpen]);

  if (!isAboutModalOpen) return null;

  const handleParagraphChange = (index: number, val: string) => {
    const updated = [...formData.storyParagraphs];
    updated[index] = val;
    setFormData({ ...formData, storyParagraphs: updated });
  };

  const handleStatChange = (index: number, field: 'label' | 'value' | 'desc', val: string) => {
    const updated = [...formData.stats];
    updated[index][field] = val;
    setFormData({ ...formData, stats: updated });
  };

  const handleReasonChange = (index: number, field: 'title' | 'desc', val: string) => {
    const updated = [...formData.reasons];
    updated[index][field] = val;
    setFormData({ ...formData, reasons: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAbout(formData);
    closeAboutModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">
                Edit Bagian "Tentang Kami"
              </h3>
              <p className="text-xs text-slate-400">
                Pembaruan cerita sejarah sejak 2014, statistik pencapaian, dan keunggulan toko.
              </p>
            </div>
          </div>
          <button
            onClick={closeAboutModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Badge Atas
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Judul Utama
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-400"
              />
            </div>
          </div>

          {/* Paragraphs */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-200">
              Paragraf Cerita & Profil Toko (3 Paragraf)
            </label>
            {formData.storyParagraphs.map((para, i) => (
              <textarea
                key={i}
                rows={3}
                value={para}
                onChange={(e) => handleParagraphChange(i, e.target.value)}
                placeholder={`Paragraf ${i + 1}...`}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-400"
              />
            ))}
          </div>

          {/* Stats */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Angka Statistik & Pengalaman
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formData.stats.map((st, i) => (
                <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <input
                    type="text"
                    value={st.value}
                    onChange={(e) => handleStatChange(i, 'value', e.target.value)}
                    placeholder="Nilai (misal: 10+ Tahun)"
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-amber-300 font-bold"
                  />
                  <input
                    type="text"
                    value={st.label}
                    onChange={(e) => handleStatChange(i, 'label', e.target.value)}
                    placeholder="Label (misal: Jaringan Cabang)"
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                  />
                  <input
                    type="text"
                    value={st.desc}
                    onChange={(e) => handleStatChange(i, 'desc', e.target.value)}
                    placeholder="Deskripsi singkat..."
                    className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-[11px] text-slate-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Reasons */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              3 Nilai & Komitmen Utama
            </div>
            {formData.reasons.map((rsn, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={rsn.title}
                  onChange={(e) => handleReasonChange(i, 'title', e.target.value)}
                  placeholder="Judul Komitmen"
                  className="w-1/3 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white font-semibold"
                />
                <input
                  type="text"
                  value={rsn.desc}
                  onChange={(e) => handleReasonChange(i, 'desc', e.target.value)}
                  placeholder="Penjelasan komitmen..."
                  className="flex-1 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-300"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={closeAboutModal}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-400/20"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
