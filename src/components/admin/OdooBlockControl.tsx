import React from 'react';
import { useSiteData } from '../../context/SiteContext';
import { Edit3, Palette, Plus } from 'lucide-react';

interface ExtraAction {
  label: string;
  onClick: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'primary' | 'secondary' | 'warning' | 'emerald';
}

interface OdooBlockControlProps {
  blockId: string;
  blockName: string;
  onEdit: () => void;
  onCustomizeBg?: () => void;
  extraActions?: ExtraAction[];
  className?: string;
}

export const OdooBlockControl: React.FC<OdooBlockControlProps> = ({
  blockName,
  onEdit,
  onCustomizeBg,
  extraActions = [],
  className = '',
}) => {
  const { isAdminMode, openBackgroundModal } = useSiteData();

  if (!isAdminMode) return null;

  return (
    <div
      className={`odoo-block-toolbar mb-4 flex flex-wrap items-center justify-between gap-2 p-2 sm:px-3 sm:py-2 bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 rounded-xl shadow-lg shadow-cyan-950/20 text-xs animate-in fade-in duration-200 ${className}`}
    >
      {/* Left: Odoo Block Tag */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-600/30 to-blue-600/30 text-cyan-300 font-bold border border-cyan-500/30 text-[10px] sm:text-[11px] font-mono tracking-tight shrink-0">
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>BLOK: {blockName}</span>
        </span>
        <span className="text-[10px] text-slate-400 hidden lg:inline">
          (Klik tombol untuk kustomisasi)
        </span>
      </div>

      {/* Right: Quick Action Buttons (Touch-friendly & Responsive) */}
      <div className="flex items-center gap-1.5 flex-wrap ml-auto">
        {extraActions.map((action, idx) => {
          const Icon = action.icon || Plus;
          let colorClass = 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700';
          if (action.variant === 'primary') {
            colorClass = 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold border-amber-300';
          } else if (action.variant === 'emerald') {
            colorClass = 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold border-emerald-500';
          } else if (action.variant === 'warning') {
            colorClass = 'bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold border-orange-400';
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={action.onClick}
              className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border text-[11px] sm:text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95 ${colorClass}`}
            >
              <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>{action.label}</span>
            </button>
          );
        })}

        {/* Customize Background Button */}
        <button
          type="button"
          onClick={onCustomizeBg || openBackgroundModal}
          className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 text-[11px] sm:text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
          title="Ubah warna latar belakang blok ini"
        >
          <Palette className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-400" />
          <span className="hidden xs:inline">Warna</span>
        </button>

        {/* Primary Edit Button */}
        <button
          type="button"
          onClick={onEdit}
          className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 text-[11px] sm:text-xs font-extrabold flex items-center gap-1 shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95 shrink-0"
          title={`Buka formulir editor untuk ${blockName}`}
        >
          <Edit3 className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5]" />
          <span>Edit</span>
        </button>
      </div>
    </div>
  );
};
