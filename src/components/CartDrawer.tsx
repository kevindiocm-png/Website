import React, { useState } from 'react';
import { CartItem } from '../types';
import { formatRupiah, createWhatsAppOrderUrl } from '../utils/format';
import { X, Trash2, Plus, Minus, ShoppingBag, Send, ArrowRight, CreditCard, QrCode } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const { openCheckoutModal } = useSiteData();
  const [customerNote, setCustomerNote] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckoutWhatsApp = () => {
    if (items.length === 0) return;
    const formattedItems = items.map((i) => ({
      name: i.product.name,
      partNumber: i.product.partNumber,
      price: i.product.price,
      quantity: i.quantity,
    }));

    const url = createWhatsAppOrderUrl(formattedItems, subtotal, customerNote.trim());
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Keranjang Belanja</h2>
            <span className="text-xs font-mono text-slate-400">({items.length} item)</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup keranjang"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.product.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex gap-3.5 items-start justify-between"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-cover rounded-lg bg-slate-900 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-mono text-amber-400 truncate">
                    {item.product.partNumber}
                  </div>
                  <h4 className="text-xs font-medium text-white leading-snug line-clamp-2 mt-0.5">
                    {item.product.name}
                  </h4>
                  <div className="text-xs font-bold text-white font-mono tabular-nums mt-1">
                    {formatRupiah(item.product.price)}
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-slate-800 rounded-lg bg-slate-900">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="p-1 hover:text-white text-slate-400 transition-colors cursor-pointer"
                        aria-label="Kurangi jumlah"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-mono font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="p-1 hover:text-white text-slate-400 transition-colors cursor-pointer"
                        aria-label="Tambah jumlah"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-300 font-medium">Keranjang masih kosong</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Silakan pilih sparepart yang sesuai dengan laptop Anda dari katalog kami.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 text-xs font-semibold text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 rounded-lg border border-amber-500/30 transition-colors cursor-pointer"
              >
                Mulai Belanja
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-800 bg-slate-950/80 space-y-4">
            {/* Customer note / laptop type field */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Catatan / Tipe Laptop & Kota Tujuan (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Lenovo Ideapad 330, kirim ke Bandung"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Subtotal calculation */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Total Estimasi</span>
              <span className="text-lg font-bold text-amber-400 font-mono tabular-nums">
                {formatRupiah(subtotal)}
              </span>
            </div>

            {/* QRIS Trust Badge */}
            <div className="p-2 rounded-xl bg-slate-900 border border-rose-500/30 flex items-center justify-between text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.2 rounded bg-rose-600 text-white font-mono text-[9px] font-black">
                  QRIS
                </span>
                <span className="font-semibold text-rose-300">Scan & Transfer Instan 24/7</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold font-mono">Bebas Admin</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  onClose();
                  openCheckoutModal();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-400/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                <CreditCard className="w-4 h-4 stroke-[2.5]" />
                <span>Lanjut ke Pembayaran & Buat Nota Resmi</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleCheckoutWhatsApp}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Pesan Cepat via WhatsApp Langsung</span>
              </button>

              <button
                onClick={onClearCart}
                className="w-full text-center text-[11px] text-slate-500 hover:text-slate-400 py-1 cursor-pointer"
              >
                Kosongkan Keranjang
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
