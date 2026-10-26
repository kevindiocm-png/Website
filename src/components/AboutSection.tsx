import React from 'react';
import { Clock, ShieldCheck, HeartHandshake, Award } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';
import { OdooBlockControl } from './admin/OdooBlockControl';

export const AboutSection: React.FC = () => {
  const { settings, isAdminMode, openAboutModal, openBackgroundModal } = useSiteData();
  const about = settings.about;

  const statIcons = [Clock, ShieldCheck, Award, HeartHandshake];

  return (
    <section
      id="tentang-kami"
      className={`py-16 bg-slate-950 border-b border-slate-800/80 relative ${
        isAdminMode ? 'odoo-editable-block' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Odoo Standard Block Control */}
        <OdooBlockControl
          blockId="about"
          blockName="Tentang Kevin 88 Computer"
          onEdit={openAboutModal}
          onCustomizeBg={openBackgroundModal}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brand Story & Values */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              {about?.badge || 'Dedikasi Sejak 2014'}
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {about?.title || 'Solusi Terpercaya Kebutuhan Sparepart Laptop Anda'}
            </h2>

            <div className="space-y-4">
              {(about?.storyParagraphs || []).map((paragraph, index) => (
                <p
                  key={index}
                  className={`leading-relaxed ${
                    index === 0
                      ? 'text-sm sm:text-base text-slate-200 font-medium'
                      : 'text-sm text-slate-400'
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Editorial Numbering */}
            {about?.reasons && about.reasons.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                {about.reasons.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="text-xs font-mono font-bold text-amber-400">
                      {item.number}. {item.title}
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed">
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Experience Showcase Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {(about?.stats || []).map((stat, idx) => {
              const IconComponent = statIcons[idx % statIcons.length];
              return (
                <div
                  key={idx}
                  className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-2 hover:border-slate-700 transition-colors h-full flex flex-col justify-between"
                >
                  <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
                      {stat.value}
                    </div>
                    <div className="text-xs font-semibold text-slate-300">
                      {stat.label}
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 leading-snug">
                    {stat.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
