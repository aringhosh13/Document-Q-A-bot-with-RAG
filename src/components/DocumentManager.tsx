import React, { useState, useRef } from 'react';
import { DocumentItem, ChunkingConfig } from '../types';
import { parseFileToText } from '../lib/documentParser';
import {
  FileText,
  UploadCloud,
  Plus,
  Trash2,
  Eye,
  Sparkles,
  Layers,
} from 'lucide-react';

interface DocumentManagerProps {
  documents: DocumentItem[];
  onAddDocument: (doc: Partial<DocumentItem>) => void;
  onDeleteDocument: (docId: string) => void;
  onSelectDocument: (doc: DocumentItem) => void;
  onRechunkAll: () => void;
  chunkingConfig: ChunkingConfig;
  setChunkingConfig: React.Dispatch<React.SetStateAction<ChunkingConfig>>;
  onOpenViewer: (doc: DocumentItem) => void;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  documents,
  onAddDocument,
  onDeleteDocument,
  onRechunkAll,
  chunkingConfig,
  setChunkingConfig,
  onOpenViewer,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'upload' | 'paste' | 'settings'>('list');
  const [pasteTitle, setPasteTitle] = useState('');
  const [pasteContent, setPasteContent] = useState('');
  const [pasteCategory, setPasteCategory] = useState<'academic' | 'research' | 'user_upload'>('user_upload');
  const [institution, setInstitution] = useState<'AI & Deep Learning' | 'Machine Learning' | 'Data Science' | 'NLP & Embeddings' | 'RAG Research'>('AI & Deep Learning');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadStatus('Extracting text...');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const { text, pageCount } = await parseFileToText(file);
        const wordCount = text.trim().split(/\s+/).length;

        onAddDocument({
          id: `doc-${Date.now()}-${i}`,
          title: file.name,
          category: 'user_upload',
          institution: 'AI & Deep Learning',
          summary: `Uploaded ${file.type || 'text'} · ${wordCount} words · ${pageCount} pages`,
          content: text,
          fileType: file.name.endsWith('.pdf') ? 'pdf' : 'txt',
          pageCount,
          wordCount,
          charCount: text.length,
          dateAdded: new Date().toISOString().split('T')[0],
          chunks: [],
        });
      } catch (err: any) {
        console.error('File parse error:', err);
      }
    }

    setUploadStatus(null);
    setActiveTab('list');
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pasteTitle.trim() || !pasteContent.trim()) return;

    const wordCount = pasteContent.trim().split(/\s+/).length;
    const pageCount = Math.max(1, Math.ceil(pasteContent.split('\n').length / 40));

    onAddDocument({
      id: `doc-${Date.now()}`,
      title: pasteTitle.trim(),
      category: pasteCategory,
      institution: institution,
      summary: `User document · ${wordCount} words`,
      content: pasteContent.trim(),
      fileType: 'txt',
      pageCount,
      wordCount,
      charCount: pasteContent.length,
      dateAdded: new Date().toISOString().split('T')[0],
      chunks: [],
    });

    setPasteTitle('');
    setPasteContent('');
    setActiveTab('list');
  };

  const totalWords = documents.reduce((acc, d) => acc + d.wordCount, 0);
  const totalChunks = documents.reduce((acc, d) => acc + d.chunks.length, 0);

  const institutionColor = (inst?: string) => {
    switch (inst) {
      case 'AI & Deep Learning': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
      case 'Machine Learning': return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
      case 'Data Science': return 'text-blue-400 border-blue-500/20 bg-blue-500/5';
      case 'NLP & Embeddings': return 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5';
      case 'RAG Research': return 'text-purple-400 border-purple-500/20 bg-purple-500/5';
      default: return 'text-teal-400 border-teal-500/20 bg-teal-500/5';
    }
  };

  return (
    <div className="bg-ink-900 rounded-xl border border-ink-800 p-4 sm:p-5">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ink-800">
        <div>
          <h2 className="text-sm font-semibold text-ink-50 flex items-center gap-2">
            <Layers className="w-4 h-4 text-accent-400" />
            Knowledge Base
          </h2>
          <p className="text-xs text-ink-500 mt-0.5">
            {documents.length} docs · {totalChunks} chunks · {totalWords.toLocaleString()} words
          </p>
        </div>

        <div className="flex items-center gap-0.5 bg-ink-850 p-0.5 rounded-lg border border-ink-800 text-xs">
          {([
            ['list', `All (${documents.length})`],
            ['upload', 'Upload'],
            ['paste', 'Paste'],
            ['settings', 'Chunking'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                activeTab === key ? 'bg-accent-500/15 text-accent-300' : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Document List */}
      {activeTab === 'list' && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-ink-850 hover:bg-ink-800 border border-ink-800 hover:border-ink-700 rounded-lg p-3.5 flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${institutionColor(doc.institution)}`}>
                        {doc.institution || 'DOC'}
                      </span>
                      <span className="text-[10px] text-ink-500 uppercase font-mono">
                        {doc.fileType}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onOpenViewer(doc)}
                        className="p-1 text-ink-400 hover:text-accent-400 hover:bg-ink-700 rounded transition-colors"
                        title="View document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteDocument(doc.id)}
                        className="p-1 text-ink-500 hover:text-rose-400 hover:bg-ink-700 rounded transition-colors"
                        title="Remove document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xs font-semibold text-ink-100 mt-2 line-clamp-2">
                    {doc.title}
                  </h3>
                  <p className="text-[11px] text-ink-500 mt-1 line-clamp-2 leading-relaxed">
                    {doc.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-ink-800 text-[10px] text-ink-500 font-mono">
                  <span>
                    <strong className="text-ink-300">{doc.chunks.length}</strong> chunks
                  </span>
                  <span>{doc.wordCount.toLocaleString()} words</span>
                  <span>~{doc.pageCount}pg</span>
                </div>
              </div>
            ))}
          </div>

          {documents.length === 0 && (
            <div className="text-center py-10 bg-ink-850 rounded-lg border border-dashed border-ink-700">
              <FileText className="w-7 h-7 text-ink-600 mx-auto mb-2" />
              <p className="text-sm text-ink-300 font-medium">No documents indexed</p>
              <p className="text-xs text-ink-500 mt-1">Upload a PDF or paste text to start.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: File Upload */}
      {activeTab === 'upload' && (
        <div className="mt-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFileUpload(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-accent-500 bg-accent-500/5'
                : 'border-ink-700 hover:border-accent-500/40 bg-ink-850'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileUpload(e.target.files)}
              multiple
              accept=".pdf,.txt,.md,.json,.csv,.py,.ts"
              className="hidden"
            />
            <div className="w-10 h-10 rounded-lg bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mx-auto mb-3">
              <UploadCloud className="w-5 h-5 text-accent-400" />
            </div>
            <h3 className="text-sm font-semibold text-ink-100">
              Drag & drop or click to browse
            </h3>
            <p className="text-xs text-ink-500 mt-1">
              PDF, TXT, Markdown, CSV, source code
            </p>
            <div className="flex justify-center gap-1.5 mt-4 text-[10px] text-ink-500 font-mono">
              {['.PDF', '.TXT', '.MD', '.CSV'].map((ext) => (
                <span key={ext} className="bg-ink-800 px-2 py-0.5 rounded">{ext}</span>
              ))}
            </div>
          </div>
          {uploadStatus && (
            <p className="text-xs text-accent-400 text-center mt-3 animate-pulse">{uploadStatus}</p>
          )}
        </div>
      )}

      {/* Tab 3: Paste Text */}
      {activeTab === 'paste' && (
        <form onSubmit={handlePasteSubmit} className="mt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-300 mb-1">Title</label>
              <input
                type="text"
                required
                value={pasteTitle}
                onChange={(e) => setPasteTitle(e.target.value)}
                placeholder="e.g., CS Honors Programme Overview"
                className="w-full bg-ink-850 border border-ink-800 rounded-lg px-3 py-2 text-xs text-ink-100 placeholder-ink-600 focus:outline-none focus:border-accent-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-300 mb-1">Discipline</label>
              <select
                value={institution}
                onChange={(e) => setInstitution(e.target.value as any)}
                className="w-full bg-ink-850 border border-ink-800 rounded-lg px-3 py-2 text-xs text-ink-100 focus:outline-none focus:border-accent-500/50 transition-colors"
              >
                <option value="AI & Deep Learning">AI & Deep Learning</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Data Science">Data Science</option>
                <option value="NLP & Embeddings">NLP & Embeddings</option>
                <option value="RAG Research">RAG Research</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-300 mb-1">Content</label>
            <textarea
              required
              rows={5}
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
              placeholder="Paste article, handbook, or research notes..."
              className="w-full bg-ink-850 border border-ink-800 rounded-lg p-3 text-xs text-ink-100 placeholder-ink-600 focus:outline-none focus:border-accent-500/50 transition-colors font-mono"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className="px-3 py-1.5 text-xs text-ink-400 hover:text-ink-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-accent-600 hover:bg-accent-500 text-white font-medium text-xs rounded-lg transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Index Document
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Chunking */}
      {activeTab === 'settings' && (
        <div className="mt-4 space-y-4 bg-ink-850 p-4 rounded-lg border border-ink-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-ink-100 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-accent-400" />
              Chunking Parameters
            </h3>
            <button
              onClick={onRechunkAll}
              className="px-3 py-1 bg-accent-600 hover:bg-accent-500 text-white rounded-md text-xs font-medium transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              Re-index All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <div className="flex justify-between text-xs text-ink-300 mb-1.5">
                <span>Chunk Size</span>
                <span className="font-mono text-accent-400 font-semibold">
                  {chunkingConfig.chunkSize} chars
                </span>
              </div>
              <input
                type="range"
                min={200}
                max={1500}
                step={50}
                value={chunkingConfig.chunkSize}
                onChange={(e) =>
                  setChunkingConfig((prev) => ({ ...prev, chunkSize: parseInt(e.target.value, 10) }))
                }
                className="w-full"
              />
              <p className="text-[10px] text-ink-600 mt-1">
                Larger retains broader context; smaller yields tighter embeddings.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs text-ink-300 mb-1.5">
                <span>Overlap</span>
                <span className="font-mono text-amber-400 font-semibold">
                  {chunkingConfig.chunkOverlap} ({((chunkingConfig.chunkOverlap / chunkingConfig.chunkSize) * 100).toFixed(0)}%)
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={300}
                step={25}
                value={chunkingConfig.chunkOverlap}
                onChange={(e) =>
                  setChunkingConfig((prev) => ({ ...prev, chunkOverlap: parseInt(e.target.value, 10) }))
                }
                className="w-full"
              />
              <p className="text-[10px] text-ink-600 mt-1">
                Prevents sentences from being cut at chunk boundaries.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
