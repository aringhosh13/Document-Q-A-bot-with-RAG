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

// Shared with the application's green accent; documents are identified by title.
export const DOCUMENT_THEME: DocumentColorTheme = {
  id: 'notebook',
  name: 'Notebook green',
  hex: '#315f47',
  dot: 'bg-accent-500',
  badgeBg: 'bg-accent-950',
  border: 'border-accent-800',
  textColor: 'text-accent-400',
  ring: 'ring-accent-500/30',
  accentGlow: 'shadow-accent-500/10',
  bgLight: 'bg-accent-950',
};

export function assignColorToDocument(_index: number): DocumentColorTheme {
  return DOCUMENT_THEME;
}
