import React, { useState, useEffect } from 'react';
import { useSiteData } from '../../context/SiteContext';
import { X, Check, Edit3, Image as ImageIcon, Sparkles, ShieldCheck, Highlighter } from 'lucide-react';
import { PRESET_IMAGES } from '../../data/defaultSettings';
import { THEME_HIGHLIGHT_PRESETS, HIGHLIGHT_STYLES, adjustBrightness } from '../../utils/theme';
import { HighlightStyleOption } from '../../types';

export const HeroEditModal: React.FC = () => {
  const { isHeroModalOpen, closeHeroModal, settings, updateHero, updateContacts, updateTheme } = useSiteData();

  const [badge, setBadge] = useState('');
  const [titlePrefix, setTitlePrefix] = useState('');
  const [titleHighlight, setTitleHighlight] = useState('');
  const [highlightColor, setHighlightColor] = useState('#f59e0b');
  const [highlightSecondaryColor, setHighlightSecondaryColor] = useState('#fbbf24');
  const [highlightStyle, setHighlightStyle] = useState<HighlightStyleOption>('gradient');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ctaButton1Text, setCtaButton1Text] = useState('');
  const [ctaButton2Text, setCtaButton2Text] = useState('');
  const [quickPicksStr, setQuickPicksStr] = useState('');
  const [guarantee1, setGuarantee1] = useState('');
  const [guarantee2, setGuarantee2] = useState('');
  const [guarantee3, setGuarantee3] = useState('');
  const [guarantee4, setGuarantee4] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (settings) {
      setBadge(settings.hero?.badge || '');
      setTitlePrefix(settings.hero?.titlePrefix || 'Selamat Datang di');
      setTitleHighlight(settings.hero?.titleHighlight || 'Kevin 88 Computer');
      setHighlightColor(
        settings.hero?.highlightColor ||
        settings.theme?.highlightColor ||
        settings.theme?.primaryColor ||
        '#f59e0b'
      );
      setHighlightSecondaryColor(
        settings.hero?.highlightSecondaryColor ||
        settings.theme?.highlightSecondaryColor ||
        '#fbbf24'
      );
      setHighlightStyle(settings.hero?.highlightStyle || settings.theme?.highlightStyle || 'gradient');
      setDescription(settings.hero?.description || '');
      setImageUrl(settings.hero?.imageUrl || '/assets/images/hero_laptop_spareparts_1790149123693.jpg');
      setCtaButton1Text(settings.hero?.ctaButton1Text || 'Cek Kompatibilitas Tipe');
      setCtaButton2Text(settings.hero?.ctaButton2Text || 'Konsultasi WhatsApp Gratis');
      setQuickPicksStr((settings.hero?.quickPicks || []).join(', '));

      const guarantees = settings.hero?.guarantees || [
        'Garansi Resmi Toko s/d 3 Tahun',
        '100% Tes Sebelum Kirim',
        'Siap Kirim se-Indonesia',
        'Harga Grosir untuk Teknisi',
      ];
      setGuarantee1(guarantees[0] || 'Garansi Resmi Toko s/d 3 Tahun');
      setGuarantee2(guarantees[1] || '100% Tes Sebelum Kirim');
      setGuarantee3(guarantees[2] || 'Siap Kirim se-Indonesia');
      setGuarantee4(guarantees[3] || 'Harga Grosir untuk Teknisi');

      setWhatsapp(settings.contacts?.whatsappNumber || '6281288880014');
      setPhone(settings.contacts?.phone || '024-8458-888');
      setEmail(settings.contacts?.email || 'kevindiocm@gmail.com');
    }
  }, [settings, isHeroModalOpen]);

  if (!isHeroModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const quickPicks = quickPicksStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    updateHero({
      badge,
      titlePrefix,
      titleHighlight,
      highlightColor,
      highlightSecondaryColor,
      highlightStyle,
      description,
      imageUrl,
      ctaButton1Text,
      ctaButton2Text,
      quickPicks,
      guarantees: [guarantee1, guarantee2, guarantee3, guarantee4].filter(Boolean),
    });

    // Also sync to global theme so whole site stays consistent
    updateTheme({
      highlightColor,
      highlightSecondaryColor,
      highlightStyle,
    });

    updateContacts({
      whatsappNumber: whatsapp,
      phone,
      email,
    });

    closeHeroModal();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Edit3 className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">
                Edit Banner Utama (Hero), Gambar & Keunggulan
              </h3>
              <p className="text-xs text-slate-400">
                Ubah judul besar, deskripsi, gambar header hero, tombol CTA, dan poin jaminan toko.
              </p>
            </div>
          </div>
          <button
            onClick={closeHeroModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* Badge & Titles */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Badge Slogan Atas (Pill)
            </label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="Solusi Sparepart Terpercaya Sejak 2014 · Garansi Tukar Baru"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Awalan Judul
              </label>
              <input
                type="text"
                value={titlePrefix}
                onChange={(e) => setTitlePrefix(e.target.value)}
                placeholder="Selamat Datang di"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Kata / Teks Sorotan (Highlight)
              </label>
              <input
                type="text"
                value={titleHighlight}
                onChange={(e) => setTitleHighlight(e.target.value)}
                placeholder="Kevin 88 Computer"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
              />
            </div>
          </div>

          {/* Odoo Style Highlight Color & Style Customization for Hero */}
          <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Highlighter className="w-3.5 h-3.5" />
                <span>Kustomisasi Warna & Gaya Highlight Judul</span>
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                HEX: <strong className="text-white uppercase">{highlightColor}</strong>
              </span>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5">
              {THEME_HIGHLIGHT_PRESETS.map((p) => {
                const isSelected = highlightColor.toLowerCase() === p.color.toLowerCase();
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setHighlightColor(p.color);
                      setHighlightSecondaryColor(p.secondary);
                    }}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-white bg-slate-800 text-white ring-1 ring-white/40'
                        : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span>{p.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Pickers & Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-lg">
                <input
                  type="color"
                  value={highlightColor}
                  onChange={(e) => {
                    setHighlightColor(e.target.value);
                    setHighlightSecondaryColor(adjustBrightness(e.target.value, 20));
                  }}
                  className="w-7 h-7 rounded cursor-pointer border border-slate-700 bg-transparent p-0"
                />
                <div className="flex-1">
                  <div className="text-[11px] font-semibold text-white">Warna Custom</div>
                  <input
                    type="text"
                    value={highlightColor}
                    onChange={(e) => setHighlightColor(e.target.value)}
                    maxLength={7}
                    className="w-full text-[11px] font-mono text-slate-300 bg-transparent border-none p-0 focus:outline-none uppercase"
                  />
                </div>
              </div>

              {/* Style selector */}
              <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto">
                {HIGHLIGHT_STYLES.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setHighlightStyle(st.id)}
                    className={`px-2 py-1 rounded text-[10px] font-semibold whitespace-nowrap transition-all cursor-pointer flex-1 text-center ${
                      highlightStyle === st.id
                        ? 'bg-amber-400 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Hero Preview text */}
            <div className="pt-1 text-sm font-bold text-slate-200">
              Pratinjau Judul:{' '}
              <span className="text-white">{titlePrefix || 'Selamat Datang di'} </span>
              <span
                className={
                  highlightStyle === 'gradient'
                    ? 'highlight-text-gradient'
                    : highlightStyle === 'solid'
                    ? 'highlight-text-solid'
                    : highlightStyle === 'glow'
                    ? 'highlight-text-glow'
                    : highlightStyle === 'marker'
                    ? 'highlight-text-marker'
                    : 'highlight-text-underline'
                }
                style={{
                  '--theme-highlight': highlightColor,
                  '--theme-highlight-secondary': highlightSecondaryColor,
                  '--theme-highlight-glow': `${highlightColor}aa`,
                  '--theme-highlight-marker': `${highlightColor}44`,
                } as React.CSSProperties}
              >
                {titleHighlight || 'Kevin 88 Computer'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1">
              Paragraf Deskripsi Toko
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Toko spesialis sparepart laptop untuk kebutuhan penggantian..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Hero Image Section */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Gambar Utama Hero (Banner Kanan)</span>
            </label>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-32 h-20 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                <img
                  src={imageUrl}
                  alt="Hero Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/hero_laptop_spareparts_1790149123693.jpg';
                  }}
                />
              </div>

              <div className="flex-1 w-full space-y-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="URL gambar (http://... atau /assets/images/...)"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                />

                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer border border-slate-700 transition-colors">
                    <span>Upload Foto Lokal</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Atau gunakan preset gambar toko di bawah:
                  </span>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_IMAGES.map((img) => (
                <button
                  key={img.name}
                  type="button"
                  onClick={() => setImageUrl(img.url)}
                  className="text-[11px] px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
                >
                  {img.name}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons & Quick Picks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Teks Tombol CTA 1
              </label>
              <input
                type="text"
                value={ctaButton1Text}
                onChange={(e) => setCtaButton1Text(e.target.value)}
                placeholder="Cek Kompatibilitas Tipe"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Teks Tombol CTA 2
              </label>
              <input
                type="text"
                value={ctaButton2Text}
                onChange={(e) => setCtaButton2Text(e.target.value)}
                placeholder="Konsultasi WhatsApp Gratis"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Quick Pick Keyword Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-1 flex items-center justify-between">
              <span>Keyword Pencarian Cepat (Pisahkan dengan koma)</span>
              <span className="text-[11px] text-slate-400 font-normal">Contoh: Baterai Asus, SSD NVMe</span>
            </label>
            <input
              type="text"
              value={quickPicksStr}
              onChange={(e) => setQuickPicksStr(e.target.value)}
              placeholder="Baterai Asus, Charger Lenovo, Layar 14 Slim FHD, SSD NVMe 1TB, Keyboard TUF"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* 4 Guarantee / Trust Points */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>4 Poin Jaminan Toko (Di Bawah Hero)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Poin 1</label>
                <input
                  type="text"
                  value={guarantee1}
                  onChange={(e) => setGuarantee1(e.target.value)}
                  placeholder="Garansi Resmi Toko s/d 3 Tahun"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Poin 2</label>
                <input
                  type="text"
                  value={guarantee2}
                  onChange={(e) => setGuarantee2(e.target.value)}
                  placeholder="100% Tes Sebelum Kirim"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Poin 3</label>
                <input
                  type="text"
                  value={guarantee3}
                  onChange={(e) => setGuarantee3(e.target.value)}
                  placeholder="Siap Kirim se-Indonesia"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Poin 4</label>
                <input
                  type="text"
                  value={guarantee4}
                  onChange={(e) => setGuarantee4(e.target.value)}
                  placeholder="Harga Grosir untuk Teknisi"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Contacts */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Nomor Kontak & WhatsApp Toko
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  WhatsApp Admin (62...)
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="6281288880014"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  No Telepon CS
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="024-8458-888"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Email Toko
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kevindiocm@gmail.com"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={closeHeroModal}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-400/20"
            >
              <Check className="w-4 h-4" />
              <span>Simpan & Terapkan Langsung</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
