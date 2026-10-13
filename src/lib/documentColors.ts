export interface DocumentColorTheme {
  id: string;
  name: string;
  hex: string;
  dot: string;
  badgeBg: string;
  border: string;
  textColor: string;
  ring: string;
  accentGlow: string;
  bgLight: string;
}

export const DOCUMENT_PALETTE: DocumentColorTheme[] = [
  {
    id: 'emerald',
    name: 'Emerald Green',
    hex: '#10b981',
    dot: 'bg-emerald-500',
    badgeBg: 'bg-emerald-950/60',
    border: 'border-emerald-500/40',
    textColor: 'text-emerald-400',
    ring: 'ring-emerald-400/50',
    accentGlow: 'shadow-emerald-500/20',
    bgLight: 'bg-emerald-500/10',
  },
  {
    id: 'violet',
    name: 'Electric Violet',
    hex: '#a855f7',
    dot: 'bg-purple-500',
    badgeBg: 'bg-purple-950/60',
    border: 'border-purple-500/40',
    textColor: 'text-purple-400',
    ring: 'ring-purple-400/50',
    accentGlow: 'shadow-purple-500/20',
    bgLight: 'bg-purple-500/10',
  },
  {
    id: 'cyan',
    name: 'Neon Cyan',
    hex: '#06b6d4',
    dot: 'bg-cyan-500',
    badgeBg: 'bg-cyan-950/60',
    border: 'border-cyan-500/40',
    textColor: 'text-cyan-400',
    ring: 'ring-cyan-400/50',
    accentGlow: 'shadow-cyan-500/20',
    bgLight: 'bg-cyan-500/10',
  },
  {
    id: 'amber',
    name: 'Vibrant Amber',
    hex: '#f59e0b',
    dot: 'bg-amber-500',
    badgeBg: 'bg-amber-950/60',
    border: 'border-amber-500/40',
    textColor: 'text-amber-400',
    ring: 'ring-amber-400/50',
    accentGlow: 'shadow-amber-500/20',
    bgLight: 'bg-amber-500/10',
  },
  {
    id: 'rose',
    name: 'Rose Crimson',
    hex: '#f43f5e',
    dot: 'bg-rose-500',
    badgeBg: 'bg-rose-950/60',
    border: 'border-rose-500/40',
    textColor: 'text-rose-400',
    ring: 'ring-rose-400/50',
    accentGlow: 'shadow-rose-500/20',
    bgLight: 'bg-rose-500/10',
  },
  {
    id: 'indigo',
    name: 'Royal Indigo',
    hex: '#6366f1',
    dot: 'bg-indigo-500',
    badgeBg: 'bg-indigo-950/60',
    border: 'border-indigo-500/40',
    textColor: 'text-indigo-400',
    ring: 'ring-indigo-400/50',
    accentGlow: 'shadow-indigo-500/20',
    bgLight: 'bg-indigo-500/10',
  },
  {
    id: 'lime',
    name: 'Neon Lime',
    hex: '#84cc16',
    dot: 'bg-lime-500',
    badgeBg: 'bg-lime-950/60',
    border: 'border-lime-500/40',
    textColor: 'text-lime-400',
    ring: 'ring-lime-400/50',
    accentGlow: 'shadow-lime-500/20',
    bgLight: 'bg-lime-500/10',
  },
  {
    id: 'fuchsia',
    name: 'Hot Fuchsia',
    hex: '#d946ef',
    dot: 'bg-fuchsia-500',
    badgeBg: 'bg-fuchsia-950/60',
    border: 'border-fuchsia-500/40',
    textColor: 'text-fuchsia-400',
    ring: 'ring-fuchsia-400/50',
    accentGlow: 'shadow-fuchsia-500/20',
    bgLight: 'bg-fuchsia-500/10',
  },
  {
    id: 'sky',
    name: 'Azure Sky',
    hex: '#0ea5e9',
    dot: 'bg-sky-500',
    badgeBg: 'bg-sky-950/60',
    border: 'border-sky-500/40',
    textColor: 'text-sky-400',
    ring: 'ring-sky-400/50',
    accentGlow: 'shadow-sky-500/20',
    bgLight: 'bg-sky-500/10',
  },
  {
    id: 'yellow',
    name: 'Golden Yellow',
    hex: '#eab308',
    dot: 'bg-yellow-500',
    badgeBg: 'bg-yellow-950/60',
    border: 'border-yellow-500/40',
    textColor: 'text-yellow-400',
    ring: 'ring-yellow-400/50',
    accentGlow: 'shadow-yellow-500/20',
    bgLight: 'bg-yellow-500/10',
  },
  {
    id: 'crimson',
    name: 'Coral Crimson',
    hex: '#ef4444',
    dot: 'bg-red-500',
    badgeBg: 'bg-red-950/60',
    border: 'border-red-500/40',
    textColor: 'text-red-400',
    ring: 'ring-red-400/50',
    accentGlow: 'shadow-red-500/20',
    bgLight: 'bg-red-500/10',
  },
  {
    id: 'teal',
    name: 'Deep Teal',
    hex: '#14b8a6',
    dot: 'bg-teal-500',
    badgeBg: 'bg-teal-950/60',
    border: 'border-teal-500/40',
    textColor: 'text-teal-400',
    ring: 'ring-teal-400/50',
    accentGlow: 'shadow-teal-500/20',
    bgLight: 'bg-teal-500/10',
  },
  {
    id: 'pink',
    name: 'Flamingo Pink',
    hex: '#ec4899',
    dot: 'bg-pink-500',
    badgeBg: 'bg-pink-950/60',
    border: 'border-pink-500/40',
    textColor: 'text-pink-400',
    ring: 'ring-pink-400/50',
    accentGlow: 'shadow-pink-500/20',
    bgLight: 'bg-pink-500/10',
  },
  {
    id: 'orange',
    name: 'Sunset Orange',
    hex: '#f97316',
    dot: 'bg-orange-500',
    badgeBg: 'bg-orange-950/60',
    border: 'border-orange-500/40',
    textColor: 'text-orange-400',
    ring: 'ring-orange-400/50',
    accentGlow: 'shadow-orange-500/20',
    bgLight: 'bg-orange-500/10',
  },
  {
    id: 'blue',
    name: 'Sapphire Blue',
    hex: '#3b82f6',
    dot: 'bg-blue-500',
    badgeBg: 'bg-blue-950/60',
    border: 'border-blue-500/40',
    textColor: 'text-blue-400',
    ring: 'ring-blue-400/50',
    accentGlow: 'shadow-blue-500/20',
    bgLight: 'bg-blue-500/10',
  },
  {
    id: 'mint',
    name: 'Spring Mint',
    hex: '#2dd4bf',
    dot: 'bg-emerald-400',
    badgeBg: 'bg-emerald-950/60',
    border: 'border-emerald-400/40',
    textColor: 'text-emerald-300',
    ring: 'ring-emerald-300/50',
    accentGlow: 'shadow-emerald-400/20',
    bgLight: 'bg-emerald-400/10',
  },
];

/**
 * Assign a color theme based on an index or hash.
 */
export function assignColorToDocument(index: number): DocumentColorTheme {
  const safeIdx = Math.abs(index) % DOCUMENT_PALETTE.length;
  return DOCUMENT_PALETTE[safeIdx];
}

/**
 * Stable string hash to pick a consistent color for any document ID or title.
 */
export function hashStringToColorIndex(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % DOCUMENT_PALETTE.length;
}

/**
 * Retrieve the color theme for a document given its properties or index.
 */
export function getDocumentColor(
  doc: {
    colorTheme?: DocumentColorTheme;
    color?: string;
    id?: string;
    title?: string;
  },
  index?: number
): DocumentColorTheme {
  if (doc.colorTheme) return doc.colorTheme;
  if (doc.color) {
    const found = DOCUMENT_PALETTE.find((c) => c.hex.toLowerCase() === doc.color?.toLowerCase());
    if (found) return found;
  }
  if (typeof index === 'number' && index >= 0) {
    return assignColorToDocument(index);
  }
  if (doc.id) {
    return assignColorToDocument(hashStringToColorIndex(doc.id));
  }
  if (doc.title) {
    return assignColorToDocument(hashStringToColorIndex(doc.title));
  }
  return DOCUMENT_PALETTE[0];
}
