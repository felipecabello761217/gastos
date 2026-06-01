// Theme styles and color palettes for the finance app

export type StyleId = 'minimal' | 'dark' | 'glass' | 'neumorphic' | 'vibrant';
export type PaletteId =
  | 'ocean' | 'forest' | 'sunset' | 'royal' | 'mono'
  | 'mint' | 'rosegold' | 'cyber' | 'earth' | 'pastel';

export interface InterfaceStyle {
  id: StyleId;
  name: string;
  description: string;
}

export interface ColorPalette {
  id: PaletteId;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  income: string;
  expense: string;
  swatches: string[];
}

export const STYLES: InterfaceStyle[] = [
  { id: 'minimal', name: 'Minimal', description: 'Líneas limpias y mucho espacio en blanco' },
  { id: 'dark', name: 'Modo Oscuro', description: 'Grises profundos con acentos vivos' },
  { id: 'glass', name: 'Glassmorphism', description: 'Efecto de vidrio esmerilado' },
  { id: 'neumorphic', name: 'Neumórfico', description: 'Sombras suaves y relieves' },
  { id: 'vibrant', name: 'Vibrante', description: 'Degradados audaces y colores intensos' },
];

export const PALETTES: ColorPalette[] = [
  { id: 'ocean', name: 'Azules Océano', primary: '#0284c7', secondary: '#0ea5e9', accent: '#38bdf8', income: '#0d9488', expense: '#dc2626', swatches: ['#0c4a6e', '#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'] },
  { id: 'forest', name: 'Verdes Bosque', primary: '#15803d', secondary: '#16a34a', accent: '#4ade80', income: '#16a34a', expense: '#b91c1c', swatches: ['#14532d', '#15803d', '#16a34a', '#22c55e', '#4ade80', '#86efac'] },
  { id: 'sunset', name: 'Naranjas Atardecer', primary: '#ea580c', secondary: '#f97316', accent: '#fb923c', income: '#059669', expense: '#dc2626', swatches: ['#9a3412', '#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa'] },
  { id: 'royal', name: 'Púrpuras Reales', primary: '#7c3aed', secondary: '#8b5cf6', accent: '#a78bfa', income: '#10b981', expense: '#ef4444', swatches: ['#4c1d95', '#6d28d9', '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd'] },
  { id: 'mono', name: 'Grises Monocromo', primary: '#374151', secondary: '#4b5563', accent: '#6b7280', income: '#059669', expense: '#dc2626', swatches: ['#111827', '#374151', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db'] },
  { id: 'mint', name: 'Menta Fresca', primary: '#0d9488', secondary: '#14b8a6', accent: '#2dd4bf', income: '#14b8a6', expense: '#f43f5e', swatches: ['#134e4a', '#0d9488', '#14b8a6', '#2dd4bf', '#5eead4', '#99f6e4'] },
  { id: 'rosegold', name: 'Oro Rosa', primary: '#be185d', secondary: '#db2777', accent: '#ec4899', income: '#0d9488', expense: '#e11d48', swatches: ['#831843', '#be185d', '#db2777', '#ec4899', '#f472b6', '#f9a8d4'] },
  { id: 'cyber', name: 'Neón Cyber', primary: '#06b6d4', secondary: '#8b5cf6', accent: '#ec4899', income: '#22d3ee', expense: '#f43f5e', swatches: ['#0e7490', '#06b6d4', '#8b5cf6', '#d946ef', '#ec4899', '#f0abfc'] },
  { id: 'earth', name: 'Tonos Tierra', primary: '#92400e', secondary: '#b45309', accent: '#d97706', income: '#65a30d', expense: '#b91c1c', swatches: ['#451a03', '#78350f', '#92400e', '#b45309', '#d97706', '#f59e0b'] },
  { id: 'pastel', name: 'Sueños Pastel', primary: '#a78bfa', secondary: '#f9a8d4', accent: '#7dd3fc', income: '#6ee7b7', expense: '#fda4af', swatches: ['#c4b5fd', '#f9a8d4', '#a5f3fc', '#fde68a', '#bbf7d0', '#fecaca'] },
];

export function getPalette(id: PaletteId): ColorPalette {
  return PALETTES.find((p) => p.id === id) || PALETTES[0];
}

// Returns Tailwind-ish class helpers based on the active style
export interface StyleClasses {
  appBg: string;
  card: string;
  cardHover: string;
  text: string;
  textMuted: string;
  border: string;
  input: string;
  sidebar: string;
  isDark: boolean;
}

export function getStyleClasses(style: StyleId): StyleClasses {
  switch (style) {
    case 'dark':
      return {
        appBg: 'bg-slate-950',
        card: 'bg-slate-900 border border-slate-800 shadow-xl',
        cardHover: 'hover:bg-slate-800/80',
        text: 'text-slate-100',
        textMuted: 'text-slate-400',
        border: 'border-slate-800',
        input: 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500',
        sidebar: 'bg-slate-900 border-slate-800',
        isDark: true,
      };
    case 'glass':
      return {
        appBg: 'bg-gradient-to-br from-slate-100 via-white to-slate-200',
        card: 'bg-white/40 backdrop-blur-xl border border-white/50 shadow-lg',
        cardHover: 'hover:bg-white/60',
        text: 'text-slate-800',
        textMuted: 'text-slate-500',
        border: 'border-white/40',
        input: 'bg-white/50 backdrop-blur border-white/60 text-slate-800 placeholder-slate-400',
        sidebar: 'bg-white/40 backdrop-blur-xl border-white/50',
        isDark: false,
      };
    case 'neumorphic':
      return {
        appBg: 'bg-[#e0e5ec]',
        card: 'bg-[#e0e5ec] shadow-[8px_8px_16px_#b8bcc2,-8px_-8px_16px_#ffffff] border-0',
        cardHover: 'hover:shadow-[4px_4px_8px_#b8bcc2,-4px_-4px_8px_#ffffff]',
        text: 'text-slate-700',
        textMuted: 'text-slate-500',
        border: 'border-transparent',
        input: 'bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bcc2,inset_-4px_-4px_8px_#ffffff] border-0 text-slate-700 placeholder-slate-400',
        sidebar: 'bg-[#e0e5ec] shadow-[8px_0_16px_#b8bcc2]',
        isDark: false,
      };
    case 'vibrant':
      return {
        appBg: 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50',
        card: 'bg-white border border-slate-100 shadow-lg shadow-purple-100',
        cardHover: 'hover:shadow-xl hover:-translate-y-0.5',
        text: 'text-slate-900',
        textMuted: 'text-slate-500',
        border: 'border-slate-100',
        input: 'bg-white border-slate-200 text-slate-900 placeholder-slate-400',
        sidebar: 'bg-white border-slate-100',
        isDark: false,
      };
    case 'minimal':
    default:
      return {
        appBg: 'bg-slate-50',
        card: 'bg-white border border-slate-200 shadow-sm',
        cardHover: 'hover:shadow-md',
        text: 'text-slate-900',
        textMuted: 'text-slate-500',
        border: 'border-slate-200',
        input: 'bg-white border-slate-300 text-slate-900 placeholder-slate-400',
        sidebar: 'bg-white border-slate-200',
        isDark: false,
      };
  }
}
