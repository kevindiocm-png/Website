import React from 'react';
import { useSiteData } from '../context/SiteContext';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';
import { formatRupiah } from '../utils/format';

export const ProductCompareBar: React.FC = () => {
  const {
    comparedProducts,
    openCompareModal,
    removeCompareProduct,
    clearCompareProducts,
    isAdminMode,
  } = useSiteData();

  if (comparedProducts.length === 0) return null;

  return (
    <div
      className={`fixed z-40 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl transition-all duration-300 animate-in slide-in-from-bottom-6 ${
        isAdminMode ? 'bottom-24 sm:bottom-28' : 'bottom-6'
      }`}
    >
      <div className="bg-slate-900/95 backdrop-blur-md border border-amber-400/40 rounded-2xl p-3 sm:p-4 shadow-2xl shadow-black/60 flex items-center justify-between gap-3 text-white">
        {/* Left: Indicator & Thumbnails */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/30 shrink-0 hidden sm:flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {comparedProducts.map((p) => (
              <div
                key={p.id}
                className="relative group shrink-0 bg-slate-950 rounded-xl p-1 border border-slate-800 flex items-center gap-2 pr-2"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div className="max-w-[100px] sm:max-w-[130px] hidden sm:block">
                  <div className="text-[11px] font-semibold text-white truncate">{p.name}</div>
                  <div className="text-[10px] text-amber-400 font-mono">{formatRupiah(p.price)}</div>
                </div>
                <button
                  onClick={() => removeCompareProduct(p.id)}
                  className="p-1 rounded-full bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                  title="Hapus item"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Empty Slot Placeholder */}
            {comparedProducts.length < 3 && (
              <div className="text-[11px] text-slate-400 font-medium px-2 py-1.5 rounded-xl border border-dashed border-slate-800 hidden md:block">
                +{3 - comparedProducts.length} slot lagi
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearCompareProducts}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            title="Bersihkan Semua"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={openCompareModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer transition-all hover:scale-102 active:scale-98"
          >
            <Scale className="w-3.5 h-3.5 sm:hidden" />
            <span>Bandingkan ({comparedProducts.length})</span>
            <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
          </button>
        </div>
      </div>
    </div>
  );
};
