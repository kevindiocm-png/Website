import React, { useState, useEffect } from 'react';
import { useSiteData } from '../../context/SiteContext';
import { WarrantyPillarItem, WarrantyQuickChipItem } from '../../types';
import {
  ShieldCheck,
  X,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
  Phone,
  MessageCircle,
  FileText,
  Sliders,
} from 'lucide-react';

export const WarrantyEditModal: React.FC = () => {
  const {
    isWarrantyEditModalOpen,
    closeWarrantyEditModal,
    settings,
    updateWarrantySettings,
    showToast,
  } = useSiteData();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [helpPhone, setHelpPhone] = useState('');
  const [helpWhatsApp, setHelpWhatsApp] = useState('');
  const [pillars, setPillars] = useState<WarrantyPillarItem[]>([]);
  const [quickChips, setQuickChips] = useState<WarrantyQuickChipItem[]>([]);

  useEffect(() => {
    if (isWarrantyEditModalOpen && settings?.warrantySettings) {
      const ws = settings.warrantySettings;
      setTitle(ws.title || 'KETENTUAN GARANSI KEVIN 88 COMPUTER');
      setSubtitle(ws.subtitle || 'Garansi Resmi & Layanan Purna Jual Terpercaya Sejak 2014');
      setHelpPhone(ws.helpPhone || '0895-3920-19488');
      setHelpWhatsApp(ws.helpWhatsApp || '62895392019488');
      setPillars(ws.pillars ? JSON.parse(JSON.stringify(ws.pillars)) : []);
      setQuickChips(ws.quickChips ? JSON.parse(JSON.stringify(ws.quickChips)) : []);
    }
  }, [isWarrantyEditModalOpen, settings]);

  if (!isWarrantyEditModalOpen) return null;

  // Pillar management
  const handleUpdatePillar = (id: string, field: keyof WarrantyPillarItem, val: string) => {
    setPillars((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const handleAddPillar = () => {
    const newPillar: WarrantyPillarItem = {
      id: `pillar-${Date.now()}`,
      title: 'Ketentuan Baru',
      description: 'Penjelasan syarat dan ketentuan garansi toko.',
      badge: 'Garansi',
    };
    setPillars((prev) => [...prev, newPillar]);
  };

  const handleDeletePillar = (id: string) => {
    if (pillars.length <= 1) {
      showToast('Minimal harus ada 1 ketentuan garansi.', 'error');
      return;
    }
    setPillars((prev) => prev.filter((p) => p.id !== id));
  };

  // Quick Chips management
  const handleUpdateChip = (id: string, field: keyof WarrantyQuickChipItem, val: string) => {
    setQuickChips((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: val } : c))
    );
  };

  const handleAddChip = () => {
    const newChip: WarrantyQuickChipItem = {
      id: `qc-${Date.now()}`,
      label: '⚡ Contoh Produk',
      code: 'KV88-SN-CONTOH',
    };
    setQuickChips((prev) => [...prev, newChip]);
  };

  const handleDeleteChip = (id: string) => {
    setQuickChips((prev) => prev.filter((c) => c.id !== id));
  };

  const handleResetDefault = () => {
    if (confirm('Kembalikan ketentuan garansi dan contoh cek cepat ke setelan awal default?')) {
      setTitle('KETENTUAN GARANSI KEVIN 88 COMPUTER');
      setSubtitle('Garansi Resmi & Layanan Purna Jual Terpercaya Sejak 2014');
      setHelpPhone('0895-3920-19488');
      setHelpWhatsApp('62895392019488');
      setPillars([
        {
          id: 'pillar-1',
          title: 'Tukar Baru (1-to-1)',
          description: 'Suku cadang yang bermasalah langsung diganti unit baru tanpa menunggu servis lama.',
          badge: '1-to-1',
        },
        {
          id: 'pillar-2',
          title: 'Segel Utuh',
          description: 'Garansi berlaku jika segel hologram Kevin 88 utuh dan bukan akibat tersiram cairan/benturan fisik.',
          badge: 'Segel',
        },
        {
          id: 'pillar-3',
          title: 'Seluruh Cabang',
          description: 'Klaim garansi bisa dilayani langsung di cabang Plasa Simpang Lima maupun cabang kota lainnya.',
          badge: 'Toko',
        },
      ]);
      setQuickChips([
        { id: 'qc-1', label: '🔋 Baterai ROG (Aktif)', code: 'KV88-BAT-ASUS-2026' },
        { id: 'qc-2', label: '⚡ Charger GaN (12 Bln)', code: 'KV88-CHG-TYPEC-65W' },
        { id: 'qc-3', label: '🖥️ LCD 14 Slim (Segera Berakhir)', code: 'KV88-LCD-14FHD-8842' },
        { id: 'qc-4', label: '🧾 No. Nota Pembelian', code: 'INV-2026-0901-001' },
      ]);
      showToast('Form telah diisi dengan ketentuan standar default.', 'info');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateWarrantySettings({
      title: title.trim() || 'KETENTUAN GARANSI KEVIN 88 COMPUTER',
      subtitle: subtitle.trim(),
      helpPhone: helpPhone.trim() || '0895-3920-19488',
      helpWhatsApp: helpWhatsApp.trim() || '62895392019488',
      pillars,
      quickChips,
    });

    closeWarrantyEditModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Edit Ketentuan Garansi & Contoh Cek Cepat
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Owner Mode
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Atur judul, kartu ketentuan garansi, kontak bantuan CS, dan tombol contoh serial cepat.
              </p>
            </div>
          </div>

          <button
            onClick={closeWarrantyEditModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
          {/* Section 1: Header & Kontak CS */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              <span>1. Judul & Pusat Bantuan Garansi</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Judul Ketentuan Garansi:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="KETENTUAN GARANSI KEVIN 88 COMPUTER"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Nomor Telepon / Tampilan Bantuan:
                </label>
                <input
                  type="text"
                  value={helpPhone}
                  onChange={(e) => setHelpPhone(e.target.value)}
                  placeholder="0895-3920-19488"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  WhatsApp CS Garansi (Format Angka 62...):
                </label>
                <input
                  type="text"
                  value={helpWhatsApp}
                  onChange={(e) => setHelpWhatsApp(e.target.value)}
                  placeholder="62895392019488"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Kartu Ketentuan Garansi (Pillars) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>2. Kartu Ketentuan Garansi ({pillars.length} Kartu)</span>
              </h4>

              <button
                type="button"
                onClick={handleAddPillar}
                className="px-3 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Ketentuan</span>
              </button>
            </div>

            <div className="space-y-3">
              {pillars.map((pillar, idx) => (
                <div
                  key={pillar.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-mono font-bold text-amber-300">
                      Poin #{idx + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeletePillar(pillar.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Hapus ketentuan ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-slate-400 mb-1">
                        Judul Ketentuan:
                      </label>
                      <input
                        type="text"
                        value={pillar.title}
                        onChange={(e) => handleUpdatePillar(pillar.id, 'title', e.target.value)}
                        placeholder="Contoh: Tukar Baru (1-to-1)"
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">
                        Badge / Label Singkat:
                      </label>
                      <input
                        type="text"
                        value={pillar.badge || ''}
                        onChange={(e) => handleUpdatePillar(pillar.id, 'badge', e.target.value)}
                        placeholder="Contoh: 1-to-1 / Segel"
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-400"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[10px] text-slate-400 mb-1">
                        Deskripsi / Penjelasan Ketentuan:
                      </label>
                      <textarea
                        rows={2}
                        value={pillar.description}
                        onChange={(e) => handleUpdatePillar(pillar.id, 'description', e.target.value)}
                        placeholder="Jelaskan detail garansi secara rinci..."
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Contoh Cek Cepat (Quick Chips) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>3. Tombol "Contoh Cek Cepat" ({quickChips.length} Tombol)</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Tombol cepat yang muncul di atas kolom input pencarian garansi untuk demo atau contoh.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddChip}
                className="px-3 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Tombol</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickChips.map((chip, idx) => (
                <div
                  key={chip.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">Tombol #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteChip(chip.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Hapus tombol ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Teks Label:</label>
                    <input
                      type="text"
                      value={chip.label}
                      onChange={(e) => handleUpdateChip(chip.id, 'label', e.target.value)}
                      placeholder="Contoh: 🔋 Baterai ROG"
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Kode Serial / No. Nota:</label>
                    <input
                      type="text"
                      value={chip.code}
                      onChange={(e) => handleUpdateChip(chip.id, 'code', e.target.value)}
                      placeholder="Contoh: KV88-BAT-ASUS-2026"
                      className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono focus:border-amber-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetDefault}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer w-full sm:w-auto justify-center"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kembalikan ke Default</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={closeWarrantyEditModal}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer flex-1 sm:flex-none"
              >
                Batal
              </button>

              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer flex-1 sm:flex-none"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
