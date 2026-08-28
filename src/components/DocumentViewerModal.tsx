import React, { useState, useEffect } from 'react';
import { DocumentItem, DocumentChunk } from '../types';
import {
  X,
  FileText,
  Layers,
  Sparkles,
  Search,
  BookOpen,
  CheckCircle,
  Copy,
} from 'lucide-react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentItem | null;
  selectedChunk: DocumentChunk | null;
  onSelectChunk: (chunk: DocumentChunk) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  document,
  selectedChunk,
  onSelectChunk,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (selectedChunk) {
      // scroll to selected chunk if needed
      const elem = window.document.getElementById(`chunk-view-${selectedChunk.id}`);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedChunk]);

  if (!isOpen || !document) return null;

  const filteredChunks = (document.chunks || []).filter(
    (c) =>
      c.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.chunkIndex.toString() === searchTerm
  );

  const handleCopyDoc = () => {
    navigator.clipboard.writeText(document.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-white truncate max-w-md sm:max-w-xl">
                {document.title}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="text-cyan-400 font-semibold">{document.institution || 'Document'}</span>
                <span>&middot;</span>
                <span>{document.wordCount.toLocaleString()} words</span>
                <span>&middot;</span>
                <span>{document.chunks.length} vectorized chunks</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyDoc}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Content'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: Full Document Text (7 cols) */}
          <div className="md:col-span-7 p-6 overflow-y-auto border-r border-slate-800 space-y-4 bg-slate-900">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                Original Document Text
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">
                {document.charCount.toLocaleString()} Characters
              </span>
            </div>

            <div className="prose prose-invert prose-sm max-w-none text-slate-300 font-sans leading-relaxed whitespace-pre-wrap text-xs sm:text-sm">
              {document.content}
            </div>
          </div>

          {/* Right Column: Chunk Inspector (5 cols) */}
          <div className="md:col-span-5 p-4 sm:p-5 overflow-y-auto bg-slate-950 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                Indexed Vector Chunks ({document.chunks.length})
              </h4>
            </div>

            {/* Chunk search */}
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search chunks by keyword..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>

            {/* Chunk list */}
            <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
              {filteredChunks.map((chunk) => {
                const isSelected = selectedChunk?.id === chunk.id;
                return (
                  <div
                    id={`chunk-view-${chunk.id}`}
                    key={chunk.id}
                    onClick={() => onSelectChunk(chunk)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-500 shadow-md ring-1 ring-cyan-500/30'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                        Chunk #{chunk.chunkIndex + 1}
                      </span>
                      <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px]">
                        <span>~{chunk.tokenEstimate} tokens</span>
                        <span>&middot;</span>
                        <span>Chars {chunk.charStart}..{chunk.charEnd}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-mono leading-relaxed line-clamp-4 bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                      {chunk.text}
                    </p>

                    {isSelected && (
                      <div className="mt-2 pt-2 border-t border-cyan-800/60 flex items-center justify-between text-[10px] text-cyan-300">
                        <span>Vector Dimensions: 256-D</span>
                        <span className="font-semibold text-emerald-400">L2 Norm: 1.000</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
