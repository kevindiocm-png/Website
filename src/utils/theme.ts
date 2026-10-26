import {
  ThemeSettings,
  ThemeColorPreset,
  BackgroundMode,
  FontFamilyOption,
  CornerRadius,
  HighlightStyleOption,
} from '../types';

export const THEME_COLOR_PRESETS: {
  id: ThemeColorPreset;
  name: string;
  primary: string;
  hover: string;
  textOnPrimary: string;
  description: string;
}[] = [
  {
    id: 'amber',
    name: 'Kevin 88 Gold (Bawaan)',
    primary: '#f59e0b',
    hover: '#fbbf24',
    textOnPrimary: '#020617',
    description: 'Warna emas signature resmi toko Kevin 88 Computer sejak 2014',
  },
  {
    id: 'blue',
    name: 'Electric Tech Blue (Intel)',
    primary: '#2563eb',
    hover: '#3b82f6',
    textOnPrimary: '#ffffff',
    description: 'Nuansa biru teknologi modern bergaya Intel Core & Dell XPS',
  },
  {
    id: 'cyan',
    name: 'Cyber Cyan (Predator)',
    primary: '#06b6d4',
    hover: '#22d3ee',
    textOnPrimary: '#020617',
    description: 'Cyan neon futuristik ala laptop gaming Predator & sci-fi hardware',
  },
  {
    id: 'emerald',
    name: 'GeForce Emerald Green',
    primary: '#10b981',
    hover: '#34d399',
    textOnPrimary: '#020617',
    description: 'Hijau zamrud elegan seperti aksen grafis kartu Nvidia GeForce',
  },
  {
    id: 'red',
    name: 'Gaming Crimson Red (ROG)',
    primary: '#ef4444',
    hover: '#f87171',
    textOnPrimary: '#ffffff',
    description: 'Merah gaming tajam agresif seperti Asus ROG & Legion',
  },
  {
    id: 'purple',
    name: 'Royal Cyberpunk Violet',
    primary: '#8b5cf6',
    hover: '#a78bfa',
    textOnPrimary: '#ffffff',
    description: 'Ungu modern premium dengan aura hardware enthusiasts',
  },
  {
    id: 'orange',
    name: 'Sunset Racing Orange',
    primary: '#f97316',
    hover: '#fb923c',
    textOnPrimary: '#020617',
    description: 'Oranye bertenaga tinggi, hangat, dan sangat mencolok',
  },
  {
    id: 'lime',
    name: 'Neon Lime Matrix',
    primary: '#84cc16',
    hover: '#a3e635',
    textOnPrimary: '#020617',
    description: 'Hijau lime terang mencerminkan presisi dan kecepatan',
  },
];

export const THEME_HIGHLIGHT_PRESETS: {
  id: string;
  name: string;
  color: string;
  secondary: string;
  label: string;
}[] = [
  {
    id: 'gold',
    name: 'Emas Kevin 88',
    color: '#f59e0b',
    secondary: '#fbbf24',
    label: 'Signature Gold',
  },
  {
    id: 'cyan',
    name: 'Cyber Neon Cyan',
    color: '#06b6d4',
    secondary: '#38bdf8',
    label: 'Electric Cyan',
  },
  {
    id: 'emerald',
    name: 'Emerald Green',
    color: '#10b981',
    secondary: '#34d399',
    label: 'Nvidia Green',
  },
  {
    id: 'red',
    name: 'Crimson Gaming Red',
    color: '#ef4444',
    secondary: '#f87171',
    label: 'ROG Red',
  },
  {
    id: 'orange',
    name: 'Sunset Orange',
    color: '#f97316',
    secondary: '#fbbf24',
    label: 'Flame Orange',
  },
  {
    id: 'pink',
    name: 'Hot Magenta Pink',
    color: '#ec4899',
    secondary: '#f472b6',
    label: 'Neon Pink',
  },
  {
    id: 'violet',
    name: 'Cyberpunk Violet',
    color: '#8b5cf6',
    secondary: '#c084fc',
    label: 'Royal Violet',
  },
  {
    id: 'lime',
    name: 'Matrix Neon Lime',
    color: '#84cc16',
    secondary: '#a3e635',
    label: 'Hi-Vis Lime',
  },
  {
    id: 'white',
    name: 'Pure Contrast White',
    color: '#ffffff',
    secondary: '#94a3b8',
    label: 'Minimal Clean',
  },
];

export const HIGHLIGHT_STYLES: {
  id: HighlightStyleOption;
  name: string;
  description: string;
}[] = [
  {
    id: 'gradient',
    name: 'Gradien Modern',
    description: 'Peralihan warna halus elegan yang memikat mata',
  },
  {
    id: 'solid',
    name: 'Warna Solid Tegas',
    description: 'Teks warna solid pekat dan tajam tanpa gradasi',
  },
  {
    id: 'glow',
    name: 'Neon Cyber Glow',
    description: 'Bercahaya menawan dengan efek pendaran lampu LED',
  },
  {
    id: 'marker',
    name: 'Stabilo Highlighter (Odoo)',
    description: 'Latar stabilo cerah seperti pulpen penanda penting',
  },
  {
    id: 'underline',
    name: 'Garis Bawah Aksen',
    description: 'Garis bawah dekoratif berani penekanan kata kunci',
  },
];

export function hexToRgba(hex: string, alpha: number): string {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getContrastTextColor(hex: string): string {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#020617' : '#ffffff';
}

export function adjustBrightness(hex: string, percent: number): string {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  let r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  let g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  let b = parseInt(cleanHex.substring(4, 6), 16) || 0;

  r = Math.min(255, Math.max(0, Math.round(r + (255 - r) * (percent / 100))));
  g = Math.min(255, Math.max(0, Math.round(g + (255 - g) * (percent / 100))));
  b = Math.min(255, Math.max(0, Math.round(b + (255 - b) * (percent / 100))));

  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export const THEME_BACKGROUND_PRESETS = [
  {
    id: 'dark' as BackgroundMode,
    name: 'Deep Slate Dark (Bawaan)',
    bg: '#020617',
    card: '#0f172a',
    text: '#ffffff',
    border: 'rgba(255, 255, 255, 0.12)',
    navbar: 'rgba(2, 6, 23, 0.95)',
    description: 'Nuansa gelap elegan berstandar tinggi ramah mata',
  },
  {
    id: 'black' as BackgroundMode,
    name: 'Pure OLED Pitch Black',
    bg: '#000000',
    card: '#09090b',
    text: '#ffffff',
    border: '#27272a',
    navbar: 'rgba(0, 0, 0, 0.96)',
    description: 'Hitam pekat murni dengan kontras layar maksimal & hemat daya',
  },
  {
    id: 'midnight' as BackgroundMode,
    name: 'Midnight Deep Cyber Blue',
    bg: '#030712',
    card: '#081329',
    text: '#f1f5f9',
    border: '#172b4d',
    navbar: 'rgba(3, 7, 18, 0.95)',
    description: 'Biru malam gelap modern nuansa server & tech gaming',
  },
  {
    id: 'navy' as BackgroundMode,
    name: 'Royal Sapphire Navy',
    bg: '#0a1128',
    card: '#131f42',
    text: '#ffffff',
    border: 'rgba(56, 189, 248, 0.2)',
    navbar: 'rgba(10, 17, 40, 0.96)',
    description: 'Biru navy mewah berwibawa khas pusat servis resmi',
  },
  {
    id: 'charcoal' as BackgroundMode,
    name: 'Studio Deep Charcoal',
    bg: '#121212',
    card: '#1e1e1e',
    text: '#f4f4f5',
    border: '#2a2a2a',
    navbar: 'rgba(18, 18, 18, 0.95)',
    description: 'Abu-abu gelap matte profesional workstation teknisi',
  },
  {
    id: 'emerald' as BackgroundMode,
    name: 'GeForce Tech Cyber Emerald',
    bg: '#041610',
    card: '#08261d',
    text: '#ffffff',
    border: 'rgba(16, 185, 129, 0.22)',
    navbar: 'rgba(4, 22, 16, 0.95)',
    description: 'Hijau gelap presisi ala laboratorium komponen & Nvidia',
  },
  {
    id: 'espresso' as BackgroundMode,
    name: 'Dark Bronze Espresso',
    bg: '#14100c',
    card: '#211b15',
    text: '#ffffff',
    border: 'rgba(245, 158, 11, 0.2)',
    navbar: 'rgba(20, 16, 12, 0.95)',
    description: 'Nuansa gelap tembaga hangat industrial elegan',
  },
  {
    id: 'purple' as BackgroundMode,
    name: 'Cyberpunk Royal Violet',
    bg: '#0d071c',
    card: '#18102e',
    text: '#ffffff',
    border: 'rgba(139, 92, 246, 0.25)',
    navbar: 'rgba(13, 7, 28, 0.95)',
    description: 'Ungu gelap futuristik berenergi tinggi para gamer',
  },
  {
    id: 'light' as BackgroundMode,
    name: 'Clean Crisp Bright White (Light)',
    bg: '#f8fafc',
    card: '#ffffff',
    text: '#0f172a',
    border: '#e2e8f0',
    navbar: 'rgba(255, 255, 255, 0.96)',
    description: 'Terang benderang, bersih, tajam dengan tulisan hitam pekat',
  },
  {
    id: 'cream' as BackgroundMode,
    name: 'Warm Ivory Paper',
    bg: '#fdfbf7',
    card: '#ffffff',
    text: '#1c1917',
    border: '#e7e5e4',
    navbar: 'rgba(253, 251, 247, 0.96)',
    description: 'Krem hangat ramah mata ala katalog cetak premium',
  },
];

export function applyThemeToDom(theme: ThemeSettings) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  const primary = theme.primaryColor || '#f59e0b';
  const hover = theme.primaryHoverColor || adjustBrightness(primary, 25);
  const textOnPrimary = theme.primaryTextColor || getContrastTextColor(primary);
  const primaryLight = hexToRgba(primary, 0.15);
  const primaryBorder = hexToRgba(primary, 0.35);
  const primaryGlow = hexToRgba(primary, 0.35);

  const highlight = theme.highlightColor || primary;
  const highlightSecondary = theme.highlightSecondaryColor || adjustBrightness(highlight, 20);
  const highlightGlow = hexToRgba(highlight, 0.65);
  const highlightMarker = hexToRgba(highlight, 0.28);
  const highlightStyle = theme.highlightStyle || 'gradient';

  // Find preset matching backgroundMode
  const foundPreset = THEME_BACKGROUND_PRESETS.find((p) => p.id === theme.backgroundMode);

  // Dynamic Background, Card, Text, Border, Navbar colors
  let bgColor = theme.customBgColor || foundPreset?.bg || '#020617';
  let cardColor = theme.customCardColor || foundPreset?.card || '#0f172a';
  let textColor = theme.customTextColor || foundPreset?.text || (getContrastTextColor(bgColor) === '#020617' ? '#0f172a' : '#ffffff');
  let borderColor = foundPreset?.border || (textColor === '#0f172a' ? '#e2e8f0' : 'rgba(255, 255, 255, 0.12)');
  let navbarBg = theme.navbarBgColor || foundPreset?.navbar || (textColor === '#0f172a' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(2, 6, 23, 0.95)');

  const brandNameColor = theme.brandNameColor || (textColor === '#0f172a' ? '#0f172a' : '#ffffff');

  root.style.setProperty('--theme-primary', primary);
  root.style.setProperty('--theme-primary-hover', hover);
  root.style.setProperty('--theme-primary-text', textOnPrimary);
  root.style.setProperty('--theme-primary-light', primaryLight);
  root.style.setProperty('--theme-primary-border', primaryBorder);
  root.style.setProperty('--theme-primary-glow', primaryGlow);

  root.style.setProperty('--theme-highlight', highlight);
  root.style.setProperty('--theme-highlight-secondary', highlightSecondary);
  root.style.setProperty('--theme-highlight-glow', highlightGlow);
  root.style.setProperty('--theme-highlight-marker', highlightMarker);
  root.style.setProperty('--theme-brand-name', brandNameColor);
  root.style.setProperty('--theme-navbar-bg', navbarBg);

  root.style.setProperty('--theme-bg-custom', bgColor);
  root.style.setProperty('--theme-card-custom', cardColor);
  root.style.setProperty('--theme-text-custom', textColor);
  root.style.setProperty('--theme-border-custom', borderColor);

  // Set direct body styles to prevent any unstyled flash
  if (document.body) {
    document.body.style.backgroundColor = bgColor;
    document.body.style.color = textColor;
  }

  root.setAttribute('data-theme-mode', theme.backgroundMode || 'dark');
  root.setAttribute('data-theme-font', theme.fontFamily || 'sans');
  root.setAttribute('data-theme-radius', theme.borderRadius || 'medium');
  root.setAttribute('data-theme-highlight-style', highlightStyle);
  root.setAttribute('data-theme-high-contrast', theme.highContrastMode ? 'true' : 'false');
}
