import React from 'react';
import { FileText } from 'lucide-react';
import { DocumentItem } from '../types';

interface FooterProps {
  documents: DocumentItem[];
  onOpenViewer: (doc: DocumentItem) => void;
}

export const Footer: React.FC<FooterProps> = ({ documents, onOpenViewer }) => (
  <footer className="border-t border-ink-800 bg-ink-950 text-ink-400 p-5 text-xs">
    <p className="font-medium text-ink-200">Documents in this session ({documents.length})</p>
    <div className="flex flex-wrap gap-2 mt-3">
      {documents.map(doc => <button key={doc.id} onClick={() => onOpenViewer(doc)} className="flex items-center gap-2 px-3 py-2 bg-ink-900 border border-ink-800 rounded text-ink-300 hover:border-accent-800 hover:text-accent-400"><FileText size={13} />{doc.title}</button>)}
    </div>
    <p className="mt-4">Built by Arin Ghosh with AI assistance · Christ Academy ICSE School</p>
  </footer>
);
