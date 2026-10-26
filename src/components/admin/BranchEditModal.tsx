import React, { useState, useEffect } from 'react';
import { useSiteData } from '../../context/SiteContext';
import { Branch } from '../../types';
import { X, Check } from 'lucide-react';

export const BranchEditModal: React.FC = () => {
  const { isBranchModalOpen, closeBranchModal, editingBranch, addBranch, updateBranch } = useSiteData();

  const [formData, setFormData] = useState<Omit<Branch, 'id'>>({
    city: 'Semarang',
    mallName: 'Kevin 88 Comp Cabang Baru',
    address: 'Jl. Pemuda No. 88, Kota Semarang',
    phone: '024-8888-888',
    whatsapp: '6281288880014',
    operationalHours: 'Senin - Sabtu: 09.30 - 18.00 WIB',
    mapsUrl: 'https://maps.google.com/?q=Semarang',
    hasTechnicianOnSite: true,
  });

  useEffect(() => {
    if (editingBranch) {
      setFormData({
        city: editingBranch.city,
        mallName: editingBranch.mallName,
        address: editingBranch.address,
        phone: editingBranch.phone,
        whatsapp: editingBranch.whatsapp,
        operationalHours: editingBranch.operationalHours,
        mapsUrl: editingBranch.mapsUrl,
        hasTechnicianOnSite: editingBranch.hasTechnicianOnSite,
      });
    } else {
      setFormData({
        city: '',
        mallName: '',
        address: '',
        phone: '',
        whatsapp: '6281288880014',
        operationalHours: 'Senin - Sabtu: 09.30 - 18.00 WIB',
        mapsUrl: 'https://maps.google.com',
        hasTechnicianOnSite: true,
      });
    }
  }, [editingBranch, isBranchModalOpen]);

  if (!isBranchModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.city.trim() || !formData.mallName.trim()) return;

    if (editingBranch) {
      updateBranch(editingBranch.id, formData);
    } else {
      addBranch(formData);
    }
    closeBranchModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              🏢
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">
                {editingBranch ? 'Edit Data Cabang Toko' : 'Tambah Cabang Toko Baru'}
              </h3>
              <p className="text-xs text-slate-400">
                Pembaruan alamat & nomor kontak cabang langsung terlihat di website.
              </p>
            </div>
          </div>
          <button
            onClick={closeBranchModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Kota / Wilayah *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Contoh: Semarang (Simpang Lima), Solo, Madiun"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Nama Toko / Mall / Gedung *
              </label>
              <input
                type="text"
                required
                value={formData.mallName}
                onChange={(e) => setFormData({ ...formData, mallName: e.target.value })}
                placeholder="Matahari Plasa Simpang Lima Lt. 3"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Alamat Lengkap Cabang
            </label>
            <textarea
              rows={2}
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Jl. Ahmad Yani No. 1, Simpang Lima, Semarang Tengah..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                No. Telepon Toko
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="024-8458-888"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                WhatsApp Cabang (Format 62...)
              </label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="6281288880017"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Jam Operasional
              </label>
              <input
                type="text"
                value={formData.operationalHours}
                onChange={(e) => setFormData({ ...formData, operationalHours: e.target.value })}
                placeholder="Senin - Sabtu: 09.30 - 18.00 WIB"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Google Maps Link
              </label>
              <input
                type="url"
                value={formData.mapsUrl}
                onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
                placeholder="https://maps.google.com/..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasTechnicianOnSite}
                onChange={(e) => setFormData({ ...formData, hasTechnicianOnSite: e.target.checked })}
                className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-xs text-slate-300">
                Ada Teknisi Pasang di Tempat (Ready On-Site Repair)
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={closeBranchModal}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-400/20"
            >
              <Check className="w-4 h-4" />
              <span>{editingBranch ? 'Simpan Perubahan Cabang' : 'Tambahkan Cabang'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
