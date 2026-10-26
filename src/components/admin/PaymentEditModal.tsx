import React, { useState, useEffect } from 'react';
import { useSiteData } from '../../context/SiteContext';
import {
  CreditCard,
  Building2,
  QrCode,
  Banknote,
  X,
  Check,
  Plus,
  Trash2,
  Edit2,
  ShieldCheck,
  Sparkles,
  Info,
  CheckCircle2,
  Upload,
  Download,
  RefreshCw,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { PaymentMethodConfig } from '../../types';
import {
  buildBankQRISPayload,
  getPublicQrCodeUrl,
  PublicQrApiProvider,
} from '../../utils/qrisGenerator';

export const PaymentEditModal: React.FC = () => {
  const {
    isPaymentModalOpen,
    closePaymentModal,
    settings,
    updatePaymentSettings,
    showToast,
  } = useSiteData();

  const [activeTab, setActiveTab] = useState<'banks' | 'qris' | 'cod' | 'general'>('banks');

  // General titles
  const [sectionTitle, setSectionTitle] = useState('3. METODE PEMBAYARAN');
  const [sectionSubtitle, setSectionSubtitle] = useState('Resmi & Aman');

  // Methods copy
  const [methods, setMethods] = useState<PaymentMethodConfig[]>([]);

  // QRIS Specific
  const [qrisNmid, setQrisNmid] = useState('ID1020038814-KV88');
  const [qrisImageUrl, setQrisImageUrl] = useState('');

  // Automatic Public API QRIS Generator State
  const [genBankAcc, setGenBankAcc] = useState('0123 456 789');
  const [genBankName, setGenBankName] = useState('BCA (Bank Central Asia)');
  const [genMerchantName, setGenMerchantName] = useState('KEVIN 88 COMPUTER');
  const [genCity, setGenCity] = useState('SEMARANG');
  const [genApiProvider, setGenApiProvider] = useState<PublicQrApiProvider>('qrserver');
  const [generatedQrUrl, setGeneratedQrUrl] = useState<string>('');
  const [generatedPayload, setGeneratedPayload] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Add Bank Form Modal State
  const [showAddBank, setShowAddBank] = useState(false);
  const [newBankName, setNewBankName] = useState('');
  const [newAccountNum, setNewAccountNum] = useState('');
  const [newHolderName, setNewHolderName] = useState('KEVIN 88 COMPUTER');
  const [newBranchName, setNewBranchName] = useState('KCU Semarang Simpang Lima');
  const [newBadge, setNewBadge] = useState('VERIFIKASI CEPAT');

  useEffect(() => {
    if (settings && isPaymentModalOpen) {
      const ps = settings.paymentSettings;
      setSectionTitle(ps?.title || '3. METODE PEMBAYARAN');
      setSectionSubtitle(ps?.subtitle || 'Resmi & Aman');
      setQrisNmid(ps?.qrisNmid || 'ID1020038814-KV88');
      setQrisImageUrl(ps?.qrisImageUrl || '');
      setMethods(ps?.methods ? JSON.parse(JSON.stringify(ps.methods)) : []);
    }
  }, [settings, isPaymentModalOpen]);

  if (!isPaymentModalOpen) return null;

  const handleGenerateQrisFromBank = () => {
    if (!genBankAcc.trim()) {
      showToast('Mohon masukkan nomor rekening bank.', 'error');
      return;
    }
    if (!genMerchantName.trim()) {
      showToast('Mohon masukkan nama merchant toko.', 'error');
      return;
    }

    setIsGenerating(true);
    const payload = buildBankQRISPayload({
      bankName: genBankName,
      accountNumber: genBankAcc,
      merchantName: genMerchantName,
      city: genCity,
      apiProvider: genApiProvider,
    });
    const url = getPublicQrCodeUrl(payload, genApiProvider);

    setTimeout(() => {
      setGeneratedPayload(payload);
      setGeneratedQrUrl(url);
      setIsGenerating(false);
      showToast(
        `QRIS berhasil di-generate secara dinamis via ${
          genApiProvider === 'quickchart' ? 'QuickChart API' : 'QR Server API'
        }!`,
        'success'
      );
    }, 350);
  };

  const handleApplyGeneratedQris = () => {
    if (!generatedQrUrl) return;
    setQrisImageUrl(generatedQrUrl);
    const cleanAcc = genBankAcc.replace(/[^0-9]/g, '');
    const autoNmid = `ID10200${cleanAcc.slice(-6).padStart(6, '0')}-KV88`;
    setQrisNmid(autoNmid);
    setMethods((prev) =>
      prev.map((m) =>
        m.category === 'qris'
          ? {
              ...m,
              qrisMerchantName: genMerchantName.trim(),
              accountNumber: genBankAcc.trim(),
              bankName: genBankName.trim(),
              qrisImageUrl: generatedQrUrl,
              qrisNmid: autoNmid,
            }
          : m
      )
    );
    showToast('Barcode QRIS hasil generator berhasil diterapkan ke toko!', 'success');
  };

  const handleToggleMethod = (id: string) => {
    setMethods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const handleUpdateMethodField = (id: string, field: keyof PaymentMethodConfig, value: any) => {
    setMethods((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const updated = { ...m, [field]: value };
        // If updating account or holder, update desc automatically for clarity
        if (field === 'accountNumber' || field === 'accountHolder') {
          const acc = field === 'accountNumber' ? value : m.accountNumber || '';
          const hld = field === 'accountHolder' ? value : m.accountHolder || '';
          updated.desc = `No. Rekening ${acc} a/n ${hld}`;
        }
        return updated;
      })
    );
  };

  const handleDeleteMethod = (id: string) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddBank = () => {
    if (!newBankName.trim()) {
      showToast('Mohon isi nama bank.', 'error');
      return;
    }
    if (!newAccountNum.trim()) {
      showToast('Mohon isi nomor rekening bank.', 'error');
      return;
    }

    const bankId = `bank-${Date.now()}`;
    const newMethod: PaymentMethodConfig = {
      id: bankId,
      name: `Transfer ${newBankName.trim()}`,
      badge: newBadge.trim() || 'TERSEDIA',
      desc: `No. Rekening ${newAccountNum.trim()} a/n ${newHolderName.trim() || 'KEVIN 88 COMPUTER'}`,
      bankName: newBankName.trim(),
      branchName: newBranchName.trim() || 'KCU Semarang',
      accountNumber: newAccountNum.trim(),
      accountHolder: newHolderName.trim() || 'KEVIN 88 COMPUTER',
      enabled: true,
      category: 'bank',
    };

    setMethods((prev) => [...prev, newMethod]);
    setShowAddBank(false);
    setNewBankName('');
    setNewAccountNum('');
    showToast(`Bank ${newBankName} berhasil ditambahkan!`, 'success');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updatePaymentSettings({
      title: sectionTitle.trim() || '3. METODE PEMBAYARAN',
      subtitle: sectionSubtitle.trim() || 'Resmi & Aman',
      qrisNmid: qrisNmid.trim(),
      qrisImageUrl: qrisImageUrl.trim(),
      methods,
    });

    showToast('Semua metode pembayaran toko berhasil disimpan & diperbarui!', 'success');
    closePaymentModal();
  };

  const bankMethods = methods.filter((m) => m.category === 'bank');
  const qrisMethod = methods.find((m) => m.category === 'qris');
  const codMethod = methods.find((m) => m.category === 'cod');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Kelola Rekening & Metode Pembayaran Toko
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                  Owner Setting
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Atur nomor rekening transfer bank (BCA, Mandiri, BRI, BNI), QRIS, COD, dan instruksi nota untuk pembeli.
              </p>
            </div>
          </div>
          <button
            onClick={closePaymentModal}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 pb-2 bg-slate-950 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('banks')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'banks'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>1. Rekening Bank Transfer ({bankMethods.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qris')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'qris'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>2. Pembayaran QRIS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cod')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'cod'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <Banknote className="w-3.5 h-3.5" />
            <span>3. COD / Bayar di Cabang</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'general'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>4. Judul & Label Seksi</span>
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* TAB 1: Bank Accounts */}
          {activeTab === 'banks' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Daftar Rekening Bank Toko</span>
                    <span className="text-xs font-normal text-slate-400">
                      (Tampil di opsi checkout dan otomatis tertera di nota resmi)
                    </span>
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddBank(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Bank Baru</span>
                </button>
              </div>

              {/* Add Bank Inline Card */}
              {showAddBank && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/50 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <span>Form Tambah Rekening Bank</span>
                    <button
                      type="button"
                      onClick={() => setShowAddBank(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      Batal
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Nama Bank (misal: Bank Syariah Indonesia / BSI)
                      </label>
                      <input
                        type="text"
                        value={newBankName}
                        onChange={(e) => setNewBankName(e.target.value)}
                        placeholder="Contoh: Bank BSI / CIMB Niaga"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Nomor Rekening
                      </label>
                      <input
                        type="text"
                        value={newAccountNum}
                        onChange={(e) => setNewAccountNum(e.target.value)}
                        placeholder="Contoh: 712-3456-789"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Nama Pemilik Rekening (Atas Nama)
                      </label>
                      <input
                        type="text"
                        value={newHolderName}
                        onChange={(e) => setNewHolderName(e.target.value)}
                        placeholder="KEVIN 88 COMPUTER"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Badge / Label Tambahan
                      </label>
                      <input
                        type="text"
                        value={newBadge}
                        onChange={(e) => setNewBadge(e.target.value)}
                        placeholder="VERIFIKASI CEPAT / RESMI"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleAddBank}
                      className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 cursor-pointer"
                    >
                      Simpan & Tambahkan ke Daftar
                    </button>
                  </div>
                </div>
              )}

              {/* List of Banks */}
              <div className="space-y-3">
                {bankMethods.map((bank) => (
                  <div
                    key={bank.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      bank.enabled
                        ? 'bg-slate-950/90 border-slate-800'
                        : 'bg-slate-950/40 border-slate-800/40 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400 font-bold">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs flex items-center gap-2">
                            <span>{bank.name}</span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/30 font-mono">
                              {bank.badge}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {bank.desc}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status Toggle Switch */}
                        <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={bank.enabled}
                            onChange={() => handleToggleMethod(bank.id)}
                            className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400"
                          />
                          <span>{bank.enabled ? 'Aktif' : 'Nonaktif'}</span>
                        </label>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteMethod(bank.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Hapus Metode Bank"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Editable fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">
                          Nomor Rekening:
                        </label>
                        <input
                          type="text"
                          value={bank.accountNumber || ''}
                          onChange={(e) =>
                            handleUpdateMethodField(bank.id, 'accountNumber', e.target.value)
                          }
                          placeholder="Nomor rekening"
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">
                          Atas Nama (Holder):
                        </label>
                        <input
                          type="text"
                          value={bank.accountHolder || ''}
                          onChange={(e) =>
                            handleUpdateMethodField(bank.id, 'accountHolder', e.target.value)
                          }
                          placeholder="KEVIN 88 COMPUTER"
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">
                          Badge / Teks Label:
                        </label>
                        <input
                          type="text"
                          value={bank.badge || ''}
                          onChange={(e) =>
                            handleUpdateMethodField(bank.id, 'badge', e.target.value)
                          }
                          placeholder="VERIFIKASI CEPAT"
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: QRIS Settings */}
          {activeTab === 'qris' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  QRIS mendukung pembayaran instan dari seluruh bank di Indonesia (BCA, Mandiri, BRI, BNI) serta dompet digital (GoPay, OVO, Dana, ShopeePay).
                </span>
              </div>

              {qrisMethod && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center font-bold">
                        <QrCode className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">
                          {qrisMethod.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {qrisMethod.desc}
                        </div>
                      </div>
                    </div>

                    <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={qrisMethod.enabled}
                        onChange={() => handleToggleMethod(qrisMethod.id)}
                        className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400"
                      />
                      <span>{qrisMethod.enabled ? 'Aktif di Checkout' : 'Nonaktif'}</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Nama Metode di Layar Checkout:
                      </label>
                      <input
                        type="text"
                        value={qrisMethod.name}
                        onChange={(e) =>
                          handleUpdateMethodField(qrisMethod.id, 'name', e.target.value)
                        }
                        placeholder="QRIS (Semua E-Wallet & Mobile Banking)"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Badge / Label:
                      </label>
                      <input
                        type="text"
                        value={qrisMethod.badge}
                        onChange={(e) =>
                          handleUpdateMethodField(qrisMethod.id, 'badge', e.target.value)
                        }
                        placeholder="INSTANT & OTOMATIS"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Nama Merchant QRIS:
                      </label>
                      <input
                        type="text"
                        value={qrisMethod.qrisMerchantName || qrisMethod.accountHolder || 'KEVIN 88 COMPUTER'}
                        onChange={(e) =>
                          handleUpdateMethodField(qrisMethod.id, 'qrisMerchantName', e.target.value)
                        }
                        placeholder="KEVIN 88 COMPUTER"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Tampil di aplikasi nasabah saat barcode QRIS discan
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Nomor ID Merchant (NMID):
                      </label>
                      <input
                        type="text"
                        value={qrisNmid}
                        onChange={(e) => setQrisNmid(e.target.value)}
                        placeholder="ID1020038814-KV88"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:border-amber-400"
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        Nomor identitas merchant QRIS resmi dari Bank Indonesia
                      </span>
                    </div>
                  </div>

                  {/* Interactive Public API QRIS Generator Tool */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/5 border border-amber-500/30 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                      <div>
                        <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>Generator Barcode QRIS Otomatis (Public API)</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Generate barcode QRIS instan dari nomor rekening bank & nama merchant Anda menggunakan Public QR API.
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30 w-fit">
                        Auto API
                      </span>
                    </div>

                    {/* Pre-fill Chips from Registered Banks */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-semibold block">
                        Pilih Cepat dari Rekening Bank Toko:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {bankMethods.map((bm) => (
                          <button
                            key={bm.id}
                            type="button"
                            onClick={() => {
                              if (bm.accountNumber) setGenBankAcc(bm.accountNumber);
                              if (bm.bankName) setGenBankName(bm.bankName);
                              if (bm.accountHolder) setGenMerchantName(bm.accountHolder);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors border cursor-pointer ${
                              genBankAcc === bm.accountNumber
                                ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-amber-400/50'
                            }`}
                          >
                            {bm.bankName || bm.name} ({bm.accountNumber || '-'})
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Nomor Rekening Bank:
                        </label>
                        <input
                          type="text"
                          value={genBankAcc}
                          onChange={(e) => setGenBankAcc(e.target.value)}
                          placeholder="0123 456 789"
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Nama Merchant Toko:
                        </label>
                        <input
                          type="text"
                          value={genMerchantName}
                          onChange={(e) => setGenMerchantName(e.target.value)}
                          placeholder="KEVIN 88 COMPUTER"
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Pilihan Public QR API:
                        </label>
                        <select
                          value={genApiProvider}
                          onChange={(e) => setGenApiProvider(e.target.value as PublicQrApiProvider)}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:border-amber-400"
                        >
                          <option value="qrserver">QR Server API (api.qrserver.com)</option>
                          <option value="quickchart">QuickChart API (quickchart.io)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleGenerateQrisFromBank}
                        disabled={isGenerating}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Meng-generate via API...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 fill-current" />
                            <span>Generate QRIS via Public API</span>
                          </>
                        )}
                      </button>

                      {generatedQrUrl && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleApplyGeneratedQris}
                            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Terapkan Sebagai QRIS Toko</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Live Preview Standee Card if generated */}
                    {generatedQrUrl && (
                      <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 flex flex-col sm:flex-row items-center gap-4 animate-in fade-in">
                        <div className="w-40 bg-white rounded-xl p-2.5 shadow-md flex flex-col items-center shrink-0 border border-slate-200">
                          <div className="w-full flex items-center justify-between pb-1 border-b border-slate-200">
                            <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white font-mono font-black text-[9px]">
                              QRIS
                            </span>
                            <span className="text-[8px] font-bold text-slate-600">GPN</span>
                          </div>
                          <div className="text-[9px] font-extrabold text-slate-900 mt-1 truncate max-w-[140px]">
                            {genMerchantName}
                          </div>
                          <img
                            src={generatedQrUrl}
                            alt="Hasil Generate QRIS"
                            className="w-32 h-32 object-contain my-1 rounded"
                          />
                          <div className="text-[8px] font-mono text-slate-500 text-center">
                            Rek: {genBankAcc}
                          </div>
                        </div>

                        <div className="space-y-2 text-xs text-slate-300 flex-1">
                          <div className="text-sm font-bold text-white flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>QRIS Siap Digunakan!</span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Barcode ini telah dikonversi secara resmi ke standar EMVCo/ASPI melalui <strong>{genApiProvider === 'quickchart' ? 'QuickChart API' : 'api.qrserver.com'}</strong>.
                          </p>
                          <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-amber-300 break-all line-clamp-2">
                            {generatedPayload}
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <a
                              href={generatedQrUrl}
                              download={`QRIS-${genMerchantName.replace(/\s+/g, '-')}.png`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                            >
                              <Download className="w-3 h-3 text-amber-400" />
                              <span>Unduh Gambar</span>
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(generatedQrUrl);
                                showToast('URL gambar barcode berhasil disalin!', 'success');
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Salin URL API</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Generator Otomatis QRIS Dinamis Aktif</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Sistem Kevin 88 otomatis men-generate barcode QRIS berstandar nasional (EMVCo/ASPI) dengan nominal pas dan nomor nota transaksi terkunci secara real-time. Customer tidak perlu memasukkan nominal manual.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Keterangan / Subtext di Checkout:
                    </label>
                    <input
                      type="text"
                      value={qrisMethod.desc}
                      onChange={(e) =>
                        handleUpdateMethodField(qrisMethod.id, 'desc', e.target.value)
                      }
                      placeholder="BCA Mobile, Livin Mandiri, BRImo, BNI, GoPay, OVO, Dana, ShopeePay"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COD / Pay at Store */}
          {activeTab === 'cod' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Opsi ini memungkinkan pembeli memesan sparepart secara online lalu membayar di tempat (tunai / EDC / QRIS) saat mengambil di cabang toko fisik.
                </span>
              </div>

              {codMethod && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400 font-bold">
                        <Banknote className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">{codMethod.name}</div>
                        <div className="text-[11px] text-slate-400">{codMethod.desc}</div>
                      </div>
                    </div>

                    <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={codMethod.enabled}
                        onChange={() => handleToggleMethod(codMethod.id)}
                        className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400"
                      />
                      <span>{codMethod.enabled ? 'Aktif' : 'Nonaktif'}</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Nama Metode:
                      </label>
                      <input
                        type="text"
                        value={codMethod.name}
                        onChange={(e) =>
                          handleUpdateMethodField(codMethod.id, 'name', e.target.value)
                        }
                        placeholder="COD / Bayar di Tempat Toko Cabang"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Badge / Label:
                      </label>
                      <input
                        type="text"
                        value={codMethod.badge}
                        onChange={(e) =>
                          handleUpdateMethodField(codMethod.id, 'badge', e.target.value)
                        }
                        placeholder="BAYAR DI TOKO"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Deskripsi Singkat:
                    </label>
                    <input
                      type="text"
                      value={codMethod.desc}
                      onChange={(e) =>
                        handleUpdateMethodField(codMethod.id, 'desc', e.target.value)
                      }
                      placeholder="Bayar tunai / gesek kartu saat ambil barang di cabang Kevin 88"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: General Section Titles */}
          {activeTab === 'general' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Judul Utama Bagian Pembayaran:
                  </label>
                  <input
                    type="text"
                    value={sectionTitle}
                    onChange={(e) => setSectionTitle(e.target.value)}
                    placeholder="3. METODE PEMBAYARAN"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Subjudul / Label Kanan:
                  </label>
                  <input
                    type="text"
                    value={sectionSubtitle}
                    onChange={(e) => setSectionSubtitle(e.target.value)}
                    placeholder="Resmi & Aman"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Perubahan langsung aktif di layar Checkout & Invoice Nota Pelanggan.
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={closePaymentModal}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-400/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Simpan Metode Pembayaran</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
