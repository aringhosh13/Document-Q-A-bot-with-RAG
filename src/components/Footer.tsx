import React from 'react';
import { DocumentItem } from '../types';
import { getDocumentColor } from '../lib/documentColors';
import {
  Palette,
  FileText,
  UploadCloud,
  Layers,
  Sparkles,
  ExternalLink,
  Tag,
} from 'lucide-react';

interface FooterProps {
  documents: DocumentItem[];
  onOpenViewer: (doc: DocumentItem) => void;
}

export const Footer: React.FC<FooterProps> = ({ documents, onOpenViewer }) => {
  const userUploads = documents.filter((d) => d.category === 'user_upload');
  const baseDocuments = documents.filter((d) => d.category !== 'user_upload');
  const totalChunks = documents.reduce((acc, d) => acc + d.chunks.length, 0);

  return (
    <footer className="border-t border-ink-800 bg-black text-xs text-ink-400 mt-12 transition-all">
      {/* SECTION 1: Document Color Codes & Knowledge Base Registry */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-b border-ink-850">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-accent-500/10 border border-accent-500/20 text-accent-400">
                <Palette className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-semibold text-white tracking-wide flex items-center gap-2">
                Document Color Registry & Knowledge Base
              </h3>
            </div>
            <p className="text-[11px] text-ink-400 max-w-2xl leading-relaxed">
              Every document uploaded or indexed is assigned a dedicated, distinct colour code.
              This visual signature traces chunks from sliding-window extraction through 256-D vector space projections and chat citations.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <span className="px-2.5 py-1 rounded-md bg-ink-900 border border-ink-800 text-ink-300 flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-accent-400" />
              <strong className="text-white">{documents.length}</strong> Total Files
            </span>
            <span className="px-2.5 py-1 rounded-md bg-ink-900 border border-ink-800 text-ink-300 flex items-center gap-1.5">
              <UploadCloud className="w-3 h-3 text-emerald-400" />
              <strong className="text-white">{userUploads.length}</strong> User Uploads
            </span>
            <span className="px-2.5 py-1 rounded-md bg-ink-900 border border-ink-800 text-ink-300 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <strong className="text-white">{totalChunks}</strong> Vector Chunks
            </span>
          </div>
        </div>

        {/* User Uploads Highlight Callout (if any user uploads exist) */}
        {userUploads.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-ink-900/90 border border-ink-750 shadow-inner">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                User-Uploaded Files ({userUploads.length}) &middot; Unique Colour Codes
              </span>
              <span className="text-[10px] text-ink-400 uppercase tracking-wider font-mono">
                Dynamically Assigned Palettes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {userUploads.map((doc, idx) => {
                const color = getDocumentColor(doc, idx);
                return (
                  <div
                    key={doc.id}
                    onClick={() => onOpenViewer(doc)}
                    role="button"
                    tabIndex={0}
                    className="p-3 rounded-lg bg-ink-850 hover:bg-ink-800 border transition-all text-left flex items-start justify-between gap-3 group cursor-pointer"
                    style={{
                      borderLeftColor: color.hex,
                      borderLeftWidth: '4px',
                      borderColor: `${color.hex}30`,
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-sm"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span
                          className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border"
                          style={{
                            color: color.hex,
                            backgroundColor: `${color.hex}15`,
                            borderColor: `${color.hex}35`,
                          }}
                        >
                          {color.name} &middot; {color.hex}
                        </span>
                      </div>
                      <h4 className="text-xs font-medium text-ink-100 truncate group-hover:text-white transition-colors">
                        {doc.title}
                      </h4>
                      <p className="text-[10px] text-ink-400 font-mono mt-1 flex items-center gap-2">
                        <span>{doc.chunks.length} chunks</span>
                        <span>&middot;</span>
                        <span>{doc.wordCount.toLocaleString()} words</span>
                        <span>&middot;</span>
                        <span className="uppercase text-ink-500">{doc.fileType}</span>
                      </p>
                    </div>

                    <button
                      className="p-1 rounded text-ink-500 group-hover:text-ink-200 transition-colors"
                      title="Inspect uploaded document"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* All Files Colour Code Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] text-ink-400">
            <span className="font-semibold text-ink-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-accent-400" />
              All Indexed Files & Assigned Colour Codes ({documents.length})
            </span>
            <span className="text-[10px] text-ink-500">
              Click any file card to view document content & vector chunks
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {documents.map((doc, idx) => {
              const color = getDocumentColor(doc, idx);
              const isUpload = doc.category === 'user_upload';

              return (
                <div
                  key={doc.id}
                  onClick={() => onOpenViewer(doc)}
                  role="button"
                  tabIndex={0}
                  className="p-2.5 rounded-lg bg-ink-900 hover:bg-ink-850 border border-ink-800 hover:border-ink-700 transition-all text-left flex flex-col justify-between group cursor-pointer"
                  style={{
                    borderTopColor: color.hex,
                    borderTopWidth: '2px',
                  }}
                >
                  <div>
                    {/* Colour Badge & Swatch */}
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full inline-block shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span
                          className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border truncate max-w-[130px]"
                          style={{
                            color: color.hex,
                            backgroundColor: `${color.hex}15`,
                            borderColor: `${color.hex}30`,
                          }}
                          title={`${color.name} (${color.hex})`}
                        >
                          {color.name}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-ink-500">
                        {color.hex}
                      </span>
                    </div>

                    {/* Title */}
                    <h5 className="text-[11px] font-medium text-ink-200 group-hover:text-white line-clamp-2 leading-snug">
                      {doc.title}
                    </h5>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-ink-850 text-[9px] font-mono text-ink-400">
                    <span
                      className={`px-1 py-0.5 rounded text-[8px] uppercase font-bold tracking-wider ${
                        isUpload
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                          : 'bg-ink-800 text-ink-400'
                      }`}
                    >
                      {isUpload ? 'Upload' : doc.institution || 'Base'}
                    </span>
                    <span>{doc.chunks.length} chunks</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 2: Project Attribution & School Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-center space-y-2">
        <p className="font-medium text-ink-200 text-xs sm:text-sm">
          Project Engineered by <strong className="text-white font-semibold">Arin Ghosh</strong> &middot; <strong className="text-white font-semibold">Christ Academy ICSE School</strong>
        </p>
        <p className="text-[11px] text-ink-400">
          Built with the help of AI &middot; Grounded RAG with 256-D Vector Geometry & BM25 Hybrid Retrieval
        </p>
        <p className="text-[10px] text-ink-500 font-mono">
          Each file receives an isolated semantic colour code &middot; 86.7% Citation Accuracy Benchmark (26/30 test queries)
        </p>
      </div>
    </footer>
  );
};
