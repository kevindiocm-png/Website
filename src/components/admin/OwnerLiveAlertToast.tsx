import React from 'react';
import { ShoppingBag, MessageSquare, X, ArrowRight, Bell, Sparkles } from 'lucide-react';
import { useSiteData } from '../../context/SiteContext';
import { formatRupiah } from '../../utils/format';

export const OwnerLiveAlertToast: React.FC = () => {
  const {
    activeOwnerAlert,
    dismissOwnerAlert,
    openStoreOverviewOpen,
    openOrdersModal,
    isAdminMode,
    isOwner,
  } = useSiteData();

  // Only display to Owner or in Admin Mode
  if (!activeOwnerAlert || (!isAdminMode && !isOwner)) {
    return null;
  }

  const isOrder = activeOwnerAlert.type === 'order';

  return (
    <aside
      aria-label="Notifikasi Real-time Pemilik Toko"
      className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full animate-bounce-short pointer-events-auto"
    >
      <div
        className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-300 relative overflow-hidden ${
          isOrder
            ? 'bg-slate-900/95 border-amber-400 text-white shadow-amber-500/20 ring-1 ring-amber-400/50'
            : 'bg-slate-900/95 border-rose-400 text-white shadow-rose-500/20 ring-1 ring-rose-400/50'
        }`}
      >
        {/* Subtle Top Glow Line */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 ${
            isOrder
              ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 animate-pulse'
              : 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 animate-pulse'
          }`}
        />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                isOrder
                  ? 'bg-amber-400 text-slate-950 shadow-amber-400/30'
                  : 'bg-rose-500 text-white shadow-rose-500/30'
              }`}
            >
              {isOrder ? (
                <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
              ) : (
                <MessageSquare className="w-5 h-5 stroke-[2.5]" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-white/10 text-amber-300">
                  REAL-TIME ALERT
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>

              <h4 className="text-xs font-black text-white tracking-tight flex items-center gap-1">
                <span>{activeOwnerAlert.title}</span>
              </h4>

              <p className="text-[11px] text-slate-300 leading-snug">
                {activeOwnerAlert.message}
              </p>

              {activeOwnerAlert.amount && (
                <div className="text-xs font-mono font-black text-amber-400 pt-0.5">
                  Total: {formatRupiah(activeOwnerAlert.amount)}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={dismissOwnerAlert}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup Notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-end gap-2 text-xs">
          {isOrder ? (
            <button
              type="button"
              onClick={() => {
                dismissOwnerAlert();
                openOrdersModal();
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
            >
              Lihat Nota
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => {
              dismissOwnerAlert();
              openStoreOverviewOpen();
            }}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition-all cursor-pointer shadow-md ${
              isOrder
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
                : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
            }`}
          >
            <span>Buka Dasbor Toko</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};
