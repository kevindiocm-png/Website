import React, { useState } from 'react';
import { useSiteData } from '../context/SiteContext';
import { CartItem, OrderInvoice, PaymentMethodType, ShippingMethodType, PaymentMethodConfig } from '../types';
import { formatRupiah } from '../utils/format';
import {
  CreditCard,
  X,
  Check,
  Truck,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  QrCode,
  Building2,
  Banknote,
  MapPin,
  Laptop,
  Phone,
  User,
  AlertCircle,
  Edit2,
} from 'lucide-react';

interface CheckoutModalProps {
  items: CartItem[];
  onClearCart: () => void;
}

const SHIPPING_OPTIONS: {
  id: ShippingMethodType;
  name: string;
  desc: string;
  fee: number;
}[] = [
  {
    id: 'regular',
    name: 'Ekspedisi Reguler (JNE / J&T / SiCepat)',
    desc: 'Estimasi 2-3 hari kerja dengan asuransi & packing bubble tebal',
    fee: 15000,
  },
  {
    id: 'express',
    name: 'Ekspedisi Kilat / Next Day (JNE YES / SiCepat BEST)',
    desc: 'Estimasi 1 hari sampai tujuan untuk kebutuhan darurat',
    fee: 28000,
  },
  {
    id: 'instant',
    name: 'Kurir Instant / Sameday (GoSend / GrabExpress)',
    desc: 'Pengiriman langsung hitungan jam (khusus area dalam kota)',
    fee: 30000,
  },
  {
    id: 'pickup',
    name: 'Ambil Sendiri di Toko Cabang Terdekat',
    desc: 'Gratis ambil di cabang Semarang, Solo, Madiun, Jogja + tes unit langsung',
    fee: 0,
  },
];

const PAYMENT_OPTIONS: PaymentMethodConfig[] = [
  {
    id: 'qris',
    name: 'QRIS (Semua E-Wallet & Mobile Banking)',
    badge: 'INSTANT & OTOMATIS',
    desc: 'BCA Mobile, Livin Mandiri, BRImo, BNI, GoPay, OVO, Dana, ShopeePay',
    qrisNmid: 'ID1020038814-KV88',
    enabled: true,
    category: 'qris',
  },
  {
    id: 'bca',
    name: 'Transfer Bank BCA',
    badge: 'VERIFIKASI CEPAT',
    desc: 'No. Rekening 0123-456-789 a/n Kevin 88 Computer',
    accountNumber: '0123 456 789',
    accountHolder: 'KEVIN 88 COMPUTER',
    enabled: true,
    category: 'bank',
  },
  {
    id: 'mandiri',
    name: 'Transfer Bank Mandiri',
    badge: 'RESMI TOKO',
    desc: 'No. Rekening 136-00-1234567-8 a/n Kevin 88 Computer',
    accountNumber: '136 00 1234567 8',
    accountHolder: 'KEVIN 88 COMPUTER',
    enabled: true,
    category: 'bank',
  },
  {
    id: 'bri',
    name: 'Transfer Bank BRI',
    badge: 'TERSEDIA',
    desc: 'No. Rekening 0083-01-002345-50-1 a/n Kevin 88 Computer',
    accountNumber: '0083 01 002345 50 1',
    accountHolder: 'KEVIN 88 COMPUTER',
    enabled: true,
    category: 'bank',
  },
  {
    id: 'bni',
    name: 'Transfer Bank BNI',
    badge: 'TERSEDIA',
    desc: 'No. Rekening 0812-3456-7890 a/n Kevin 88 Computer',
    accountNumber: '0812 3456 7890',
    accountHolder: 'KEVIN 88 COMPUTER',
    enabled: true,
    category: 'bank',
  },
  {
    id: 'cod',
    name: 'COD / Bayar di Tempat Toko Cabang',
    badge: 'BAYAR DI TOKO',
    desc: 'Bayar tunai / gesek kartu saat ambil barang di cabang Kevin 88',
    enabled: true,
    category: 'cod',
  },
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ items, onClearCart }) => {
  const {
    isCheckoutModalOpen,
    closeCheckoutModal,
    openInvoiceModal,
    openQrisPaymentModal,
    openPaymentModal,
    addOrder,
    isAdminMode,
    settings,
    branches,
    showToast,
  } = useSiteData();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [laptopModel, setLaptopModel] = useState('');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodType>('regular');
  const [pickupBranchId, setPickupBranchId] = useState(branches[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('qris');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isCheckoutModalOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const selectedShipping = SHIPPING_OPTIONS.find((s) => s.id === shippingMethod);
  const shippingFee = selectedShipping ? selectedShipping.fee : 15000;
  const grandTotal = subtotal + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Mohon isi nama lengkap pemesan.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setError('Mohon isi nomor WhatsApp aktif untuk pengiriman nota & update resi.');
      return;
    }
    if (shippingMethod !== 'pickup' && !address.trim()) {
      setError('Mohon isi alamat lengkap pengiriman sparepart.');
      return;
    }

    setError(null);

    // Generate Official Invoice Number: INV/KV88/YYYYMMDD/XXXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `INV/KV88/${dateStr}/${randomSuffix}`;

    const newInvoice: OrderInvoice = {
      invoiceNumber,
      createdAt: now.toISOString(),
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        address: shippingMethod === 'pickup' ? 'Ambil di Toko Cabang' : address.trim(),
        city: shippingMethod === 'pickup' ? (branches.find((b) => b.id === pickupBranchId)?.city || 'Semarang') : (city.trim() || 'Indonesia'),
        laptopModel: laptopModel.trim(),
        pickupBranchId: shippingMethod === 'pickup' ? pickupBranchId : undefined,
        notes: notes.trim(),
      },
      items: [...items],
      subtotal,
      shippingFee,
      shippingMethod,
      discount: 0,
      total: grandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'processing' : 'unpaid',
    };

    // Save order to state & Firestore
    addOrder(newInvoice);

    // Open dedicated payment modal or invoice
    if (paymentMethod === 'qris') {
      openQrisPaymentModal(newInvoice);
      closeCheckoutModal();
      onClearCart();
      showToast(
        `Silakan scan QRIS untuk menyelesaikan transfer Rp ${grandTotal.toLocaleString('id-ID')}`,
        'info'
      );
    } else {
      openInvoiceModal(newInvoice);
      closeCheckoutModal();
      onClearCart();
      showToast(`Nota resmi #${invoiceNumber} berhasil diterbitkan!`, 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-fadeIn my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Checkout & Pembayaran Sparepart
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  GARANSI TUKAR BARU
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Lengkapi data pemesan untuk otomatis menerbitkan Nota & Bukti Garansi Resmi Kevin 88
              </p>
            </div>
          </div>

          <button
            onClick={closeCheckoutModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Batal Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Col Left: Customer Information & Delivery (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* 1. Customer Information */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>1. Data Pemesan / Customer</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Nama Lengkap <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Budi Prasetyo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      No. WhatsApp / HP <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 08123456789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Merk & Tipe Laptop Anda (Penting untuk Cek Kompatibilitas)</span>
                    <span className="text-[10px] text-amber-400/80">Sangat Disarankan</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Asus VivoBook 14 A412DA / Lenovo IdeaPad Slim 3"
                    value={laptopModel}
                    onChange={(e) => setLaptopModel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Tim teknisi Kevin 88 akan memverifikasi ulang soket/voltase sparepart sebelum dikirim.
                  </span>
                </div>
              </div>

              {/* 2. Shipping Method */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>2. Metode Pengiriman</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    PACKING BUBBLE AMAN & ASURANSI
                  </span>
                </div>

                <div className="space-y-2">
                  {SHIPPING_OPTIONS.map((opt) => {
                    const isSelected = shippingMethod === opt.id;
                    return (
                      <label
                        key={opt.id}
                        className={`p-3 rounded-xl border flex items-start justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'border-amber-400 bg-slate-900/90 ring-1 ring-amber-400/40 shadow-md'
                            : 'border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={isSelected}
                            onChange={() => setShippingMethod(opt.id)}
                            className="mt-0.5 text-amber-500 focus:ring-amber-400"
                          />
                          <div>
                            <div className="text-xs font-semibold text-white">{opt.name}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</div>
                          </div>
                        </div>

                        <div className="text-xs font-mono font-bold text-amber-400 shrink-0 pl-2">
                          {opt.fee === 0 ? 'GRATIS' : formatRupiah(opt.fee)}
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Conditional Fields depending on Shipping Method */}
                {shippingMethod === 'pickup' ? (
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 space-y-1.5 pt-2">
                    <label className="block text-[11px] font-semibold text-white">
                      Pilih Toko Cabang untuk Pengambilan:
                    </label>
                    <select
                      value={pickupBranchId}
                      onChange={(e) => setPickupBranchId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          Cabang {b.city} - {b.mallName} ({b.address})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Alamat Lengkap Pengiriman <span className="text-amber-400">*</span>
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, patokan..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Kota / Kabupaten <span className="text-amber-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Contoh: Semarang, Bandung, Jakarta"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          Catatan Kurir (Opsional)
                        </label>
                        <input
                          type="text"
                          placeholder="Titip di pos satpam / hubungi sebelum antar"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Col Right: Payment Method & Order Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* 3. Payment Method */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    <span>{settings.paymentSettings?.title || '3. Metode Pembayaran'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {settings.paymentSettings?.subtitle || 'Resmi & Aman'}
                    </span>
                    {isAdminMode && (
                      <button
                        type="button"
                        onClick={openPaymentModal}
                        className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold hover:bg-amber-400/30 border border-amber-400/40 cursor-pointer flex items-center gap-1 transition-colors"
                        title="Owner: Edit nomor rekening, nama bank, dan QRIS"
                      >
                        <Edit2 className="w-2.5 h-2.5" />
                        <span>Edit</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {(settings.paymentSettings?.methods?.filter((m) => m.enabled) || PAYMENT_OPTIONS).map((opt) => {
                    const isSelected = paymentMethod === opt.id;
                    const Icon =
                      opt.category === 'qris'
                        ? QrCode
                        : opt.category === 'cod'
                        ? Banknote
                        : Building2;

                    return (
                      <label
                        key={opt.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'border-amber-400 bg-slate-900/95 ring-1 ring-amber-400/40 shadow-md'
                            : 'border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={isSelected}
                            onChange={() => setPaymentMethod(opt.id as PaymentMethodType)}
                            className="text-amber-500 focus:ring-amber-400"
                          />
                          <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                          <div>
                            <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                              <span>{opt.name}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 line-clamp-1">{opt.desc}</div>
                          </div>
                        </div>

                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold shrink-0">
                          {opt.badge}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* QRIS Automatic Generation Notice */}
                {paymentMethod === 'qris' && (
                  <div className="p-3 rounded-xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-rose-950/30 border border-rose-500/40 text-xs text-slate-300 space-y-1 animate-in fade-in">
                    <div className="flex items-center gap-2 text-rose-300 font-bold">
                      <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono text-[9px] font-black tracking-wider">
                        QRIS
                      </span>
                      <span>Otomatis Dibuatkan Barcode QRIS Nominal Pas</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Sistem Kevin 88 akan langsung men-generate barcode QRIS resmi dengan nominal tepat{' '}
                      <strong className="text-amber-400 font-mono">{formatRupiah(grandTotal)}</strong> tanpa biaya admin. Langsung scan dengan BCA Mobile, Livin, BRImo, GoPay, OVO, ShopeePay, dll.
                    </p>
                  </div>
                )}
              </div>

              {/* 4. Order Summary Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-white border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ringkasan Pesanan ({items.length} item)</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">GARANSI RESMI</span>
                </div>

                {/* Items preview list */}
                <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                  {items.map((it) => (
                    <div
                      key={it.product.id}
                      className="flex items-center justify-between gap-2 text-xs py-1 border-b border-slate-900/80"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={it.product.image}
                          alt={it.product.name}
                          className="w-8 h-8 rounded object-cover bg-slate-800 shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="truncate">
                          <div className="text-white font-medium truncate">{it.product.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {it.quantity}x @ {formatRupiah(it.product.price)}
                          </div>
                        </div>
                      </div>

                      <div className="font-mono text-white text-right tabular-nums shrink-0">
                        {formatRupiah(it.product.price * it.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cost Calculations */}
                <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subtotal Sparepart</span>
                    <span className="font-mono text-white tabular-nums">{formatRupiah(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ongkos Kirim ({shippingMethod.toUpperCase()})</span>
                    <span className="font-mono text-white tabular-nums">
                      {shippingFee === 0 ? 'GRATIS' : formatRupiah(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold text-white">
                    <span>Total Pembayaran</span>
                    <span className="text-amber-400 font-mono text-base tabular-nums">
                      {formatRupiah(grandTotal)}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-xs transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                      paymentMethod === 'qris'
                        ? 'bg-gradient-to-r from-rose-500 via-amber-400 to-rose-500 hover:from-rose-400 hover:to-amber-300 text-slate-950 shadow-rose-500/25 ring-2 ring-rose-400/40'
                        : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-400/20'
                    }`}
                  >
                    {paymentMethod === 'qris' ? (
                      <>
                        <QrCode className="w-4 h-4 stroke-[2.5]" />
                        <span>⚡ Bayar Sekarang via QRIS Dinamis (Scan Langsung)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                        <span>Konfirmasi & Terbitkan Nota Resmi</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-slate-400 mt-2">
                    {paymentMethod === 'qris'
                      ? 'Barcode QRIS resmi Bank Indonesia dengan nominal pas otomatis langsung muncul untuk dipindai.'
                      : 'Nota resmi pembelian, no. rekening, & bukti garansi akan langsung tampil setelah konfirmasi.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
