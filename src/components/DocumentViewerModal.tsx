import React, { useState, useEffect } from 'react';
import { DocumentItem, DocumentChunk } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { X, FileText, Layers, Search, BookOpen, CircleCheck as CheckCircle, Copy } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-ink-900 border border-ink-800 rounded-xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-ink-850 border-b border-ink-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-500/10 border border-accent-500/20 flex items-center justify-center">
              <FileText className="w-4 h-4 text-accent-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-ink-50 truncate max-w-md sm:max-w-xl">
                {document.title}
              </h3>
              <p className="text-xs text-ink-500 flex items-center gap-2 mt-0.5">
                <span className="text-accent-400 font-medium">{document.institution || 'Document'}</span>
                <span className="text-ink-700">·</span>
                <span>{document.wordCount.toLocaleString()} words</span>
                <span className="text-ink-700">·</span>
                <span>{document.chunks.length} chunks</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyDoc}
              className="px-3 py-1.5 bg-ink-800 hover:bg-ink-700 text-ink-300 rounded-md text-xs font-medium transition-all flex items-center gap-1.5"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-ink-400 hover:text-ink-100 hover:bg-ink-800 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Document text */}
          <div className="md:col-span-7 p-6 overflow-y-auto border-r border-ink-800 space-y-4 bg-ink-900">
            <div className="flex items-center justify-between pb-2 border-b border-ink-800">
              <h4 className="text-xs font-semibold text-ink-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-accent-400" />
                Original Text
              </h4>
              <span className="text-[11px] text-ink-600 font-mono">
                {document.charCount.toLocaleString()} chars
              </span>
            </div>

            <div className="text-ink-300 leading-relaxed text-xs sm:text-sm font-sans">
              <MarkdownRenderer content={document.content} />
            </div>
          </div>

          {/* Chunk inspector */}
          <div className="md:col-span-5 p-4 sm:p-5 overflow-y-auto bg-ink-950 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-ink-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-accent-400" />
                Chunks ({document.chunks.length})
              </h4>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search chunks..."
                className="w-full bg-ink-900 border border-ink-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-ink-100 placeholder-ink-600 focus:outline-none focus:border-accent-500/50 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-ink-600 absolute left-2.5 top-2.5" />
            </div>

            <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
              {filteredChunks.map((chunk) => {
                const isSelected = selectedChunk?.id === chunk.id;
                return (
                  <div
                    id={`chunk-view-${chunk.id}`}
                    key={chunk.id}
                    onClick={() => onSelectChunk(chunk)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-accent-500/10 border-accent-500/40 ring-1 ring-accent-500/20'
                        : 'bg-ink-900 border-ink-800 hover:border-ink-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <span className="font-mono font-bold text-accent-400 bg-accent-500/10 px-2 py-0.5 rounded border border-accent-500/20">
                        #{chunk.chunkIndex + 1}
                      </span>
                      <div className="flex items-center gap-2 text-ink-600 font-mono text-[10px]">
                        <span>~{chunk.tokenEstimate} tok</span>
                        <span>·</span>
                        <span>{chunk.charStart}..{chunk.charEnd}</span>
                      </div>
                    </div>

                    <p className="text-xs text-ink-300 font-mono leading-relaxed line-clamp-4 bg-ink-950 p-2 rounded border border-ink-800">
                      {chunk.text}
                    </p>

                    {isSelected && (
                      <div className="mt-2 pt-2 border-t border-accent-500/20 flex items-center justify-between text-[10px] text-accent-300">
                        <span>256-D vector</span>
                        <span className="font-mono text-emerald-400">L2 norm: 1.000</span>
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
