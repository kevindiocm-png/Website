import React, { useState } from 'react';
import { ChevronDown, Plus, Edit2, Trash2 } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';
import { FaqItem } from '../types';
import { OdooBlockControl } from './admin/OdooBlockControl';

export const FaqSection: React.FC = () => {
  const {
    settings,
    isAdminMode,
    openFaqModal,
    openSectionHeadersModal,
    openCMSModal,
    openBackgroundModal,
    deleteFaq,
  } = useSiteData();
  const sectionHeaders = settings.sectionHeaders;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = settings.faqs || [];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className={`py-16 bg-slate-950 border-b border-slate-800 relative ${isAdminMode ? 'odoo-editable-block' : ''}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Odoo Standard Block Control */}
        {isAdminMode && (
          <OdooBlockControl
            blockId="faq"
            blockName="Pertanyaan Umum (FAQ)"
            onEdit={openFaqModal}
            onCustomizeBg={openBackgroundModal}
            extraActions={[
              { label: '+ Tambah Pertanyaan', onClick: () => openFaqModal(null), icon: Plus, variant: 'primary' },
              { label: 'Judul Seksi', onClick: openSectionHeadersModal, icon: Edit2 },
            ]}
          />
        )}

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-2">
              <span>{sectionHeaders?.faqBadge || 'Pertanyaan Umum'}</span>
              {isAdminMode && (
                <button
                  onClick={openSectionHeadersModal}
                  className="px-2 py-0.5 rounded-lg bg-amber-400/20 text-amber-300 text-[11px] font-bold hover:bg-amber-400/30 border border-amber-400/40 cursor-pointer shadow-sm"
                  title="Edit judul seksi FAQ ini"
                >
                  ✏️ Edit Judul FAQ
                </button>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {sectionHeaders?.faqTitle || 'Frequently Asked Questions (FAQ)'}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {sectionHeaders?.faqDesc || 'Hal-hal yang sering ditanyakan seputar pembelian, garansi, dan pengiriman sparepart di Kevin 88 Computer.'}
            </p>
          </div>

          {isAdminMode && (
            <button
              onClick={() => openFaqModal(null)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-lg shadow-amber-400/20 flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah FAQ Baru</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id || idx}
                className="bg-slate-900 border border-slate-800/80 rounded-xl overflow-hidden transition-colors"
              >
                <div className="flex items-center justify-between p-4 sm:p-5">
                  <button
                    onClick={() => toggle(idx)}
                    className="flex-1 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm font-semibold text-white">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-amber-400' : ''
                      }`}
                    />
                  </button>

                  {/* Admin inline controls */}
                  {isAdminMode && (
                    <div className="ml-3 pl-3 border-l border-slate-800 flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openFaqModal(faq)}
                        className="p-1 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                        title="Edit Pertanyaan & Jawaban Ini"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus pertanyaan FAQ ini?`)) {
                            deleteFaq(faq.id);
                          }
                        }}
                        className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                        title="Hapus FAQ Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-850">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
