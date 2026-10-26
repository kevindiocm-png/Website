import React, { useState } from 'react';
import { X, Send, MessageSquare, CheckCircle, ShieldCheck, Phone } from 'lucide-react';
import { createWhatsAppConsultationUrl } from '../utils/format';
import { useSiteData } from '../context/SiteContext';
import { ConsultationRequest } from '../types';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
  const { addConsultation, showToast } = useSiteData();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [brand, setBrand] = useState('Lenovo');
  const [laptopModel, setLaptopModel] = useState('');
  const [sparepartType, setSparepartType] = useState('Baterai Laptop');
  const [issueDetails, setIssueDetails] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newConsultation: ConsultationRequest = {
      id: `c-${Date.now()}`,
      name: name.trim() || 'Pelanggan Toko',
      phone: phone.trim() || undefined,
      brand,
      laptopModel: laptopModel.trim() || 'Belum tahu model persis',
      sparepartType,
      issueDetails: issueDetails.trim() || 'Ingin cek tipe sparepart yang cocok dan estimasi biaya.',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    addConsultation(newConsultation);
    showToast('Permintaan konsultasi Anda tercatat di sistem & diteruskan ke teknisi!', 'success');

    const url = createWhatsAppConsultationUrl({
      laptopBrand: brand,
      laptopModel: laptopModel.trim() || 'Belum tahu model persis',
      sparepartType: sparepartType,
      notes: `${name ? `Nama: ${name}. ` : ''}${phone ? `No. HP: ${phone}. ` : ''}${issueDetails.trim() || 'Ingin cek tipe sparepart yang cocok dan estimasi biaya.'}`,
    });
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Konsultasi Sparepart Gratis</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Bingung menentukan tipe baterai, charger, atau LCD yang cocok? Tim teknis Kevin 88 Computer siap membantu mengecek secara gratis dalam hitungan menit.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nama Anda (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                No. WhatsApp / HP (Opsional)
              </label>
              <input
                type="tel"
                placeholder="Contoh: 081234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Merk Laptop
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Lenovo">Lenovo</option>
                <option value="Asus">Asus</option>
                <option value="Acer">Acer</option>
                <option value="HP">HP</option>
                <option value="Dell">Dell</option>
                <option value="Apple">Apple / MacBook</option>
                <option value="MSI">MSI</option>
                <option value="Axioo">Axioo / Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Kebutuhan Sparepart
              </label>
              <select
                value={sparepartType}
                onChange={(e) => setSparepartType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Baterai Laptop">Baterai Laptop</option>
                <option value="Charger & Adaptor">Charger & Adaptor</option>
                <option value="Keyboard Laptop">Keyboard</option>
                <option value="Layar LCD/LED">Layar LCD / LED</option>
                <option value="RAM Upgrade">RAM Upgrade</option>
                <option value="SSD Storage">SSD NVMe / SATA</option>
                <option value="Fan Pendingin">Kipas Fan Laptop</option>
                <option value="Lainnya / Cek Total">Lainnya / Konsultasi Total</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tipe / Seri Lengkap Laptop
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: IdeaPad Slim 3 14ARE05 / Vivobook A412FA / Nitro 5"
              value={laptopModel}
              onChange={(e) => setLaptopModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Tip: Tipe lengkap biasanya tertulis pada stiker di bagian bawah laptop.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Gejala Kerusakan / Part Number Lama (Opsional)
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Baterai cuma tahan 10 menit, colokan charger goyang, atau tombol spasi macet..."
              value={issueDetails}
              onChange={(e) => setIssueDetails(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-[11px] text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Konsultasi 100% gratis tanpa paksaan beli. Kami bantu pandu sampai ketemu tipe yang tepat.
            </span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              <Send className="w-4 h-4" />
              <span>Mulai Konsultasi WhatsApp Sekarang</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
