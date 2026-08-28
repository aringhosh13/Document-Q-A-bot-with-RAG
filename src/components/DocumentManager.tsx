import React, { useState, useRef } from 'react';
import { DocumentItem, ChunkingConfig } from '../types';
import { parseFileToText } from '../lib/documentParser';
import {
  FileText,
  UploadCloud,
  Plus,
  Trash2,
  Eye,
  FileCode,
  Sparkles,
  Layers,
  Check,
  AlertCircle,
  School,
  BookOpen,
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
  const [institution, setInstitution] = useState<'Computer Science' | 'AI & Data Science' | 'Information Systems' | 'Systems & Design' | 'General AI'>('Computer Science');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadStatus('Processing and extracting text...');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const { text, pageCount } = await parseFileToText(file);
        const title = file.name.replace(/\.[^/.]+$/, '');
        const wordCount = text.trim().split(/\s+/).length;
        const charCount = text.length;

        onAddDocument({
          id: `doc-${Date.now()}-${i}`,
          title: file.name,
          category: 'user_upload',
          institution: 'General AI',
          summary: `Uploaded document (${file.type || 'text'}) with ${wordCount} words and ${pageCount} pages.`,
          content: text,
          fileType: file.name.endsWith('.pdf') ? 'pdf' : 'txt',
          pageCount,
          wordCount,
          charCount,
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
    const charCount = pasteContent.length;
    const pageCount = Math.max(1, Math.ceil(pasteContent.split('\n').length / 40));

    onAddDocument({
      id: `doc-${Date.now()}`,
      title: pasteTitle.trim(),
      category: pasteCategory,
      institution: pasteCategory === 'academic' ? institution : 'General AI',
      summary: `User provided document containing ${wordCount} words.`,
      content: pasteContent.trim(),
      fileType: 'txt',
      pageCount,
      wordCount,
      charCount,
      dateAdded: new Date().toISOString().split('T')[0],
      chunks: [],
    });

    setPasteTitle('');
    setPasteContent('');
    setActiveTab('list');
  };

  const totalWords = documents.reduce((acc, d) => acc + d.wordCount, 0);
  const totalChunks = documents.reduce((acc, d) => acc + d.chunks.length, 0);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Knowledge Base & Documents
          </h2>
          <p className="text-xs text-slate-400">
            {documents.length} documents &middot; {totalChunks} indexed chunks &middot; {totalWords.toLocaleString()} words
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/80 text-xs">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'list' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Docs ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'upload' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Upload PDF/TXT
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'paste' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Paste Text
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'settings' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Chunking
          </button>
        </div>
      </div>

      {/* Tab 1: Document List */}
      {activeTab === 'list' && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
            {documents.map((doc) => {
              const institutionColor =
                doc.institution === 'Computer Science'
                  ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                  : doc.institution === 'AI & Data Science'
                  ? 'bg-red-500/10 text-red-400 border-red-500/30'
                  : doc.institution === 'Information Systems'
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                  : doc.institution === 'Systems & Design'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

              return (
                <div
                  key={doc.id}
                  className="bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3.5 flex flex-col justify-between transition-all group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${institutionColor}`}
                        >
                          {doc.institution || 'DOC'}
                        </span>
                        <span className="text-[11px] text-slate-400 uppercase font-mono">
                          {doc.fileType}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={() => onOpenViewer(doc)}
                          className="p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded"
                          title="View Full Document & Chunks"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteDocument(doc.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded"
                          title="Remove Document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xs font-semibold text-slate-200 mt-2 line-clamp-2">
                      {doc.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {doc.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3 text-cyan-400" />
                      <strong className="text-slate-200 font-semibold">{doc.chunks.length}</strong> chunks
                    </span>
                    <span>{doc.wordCount.toLocaleString()} words</span>
                    <span>~{doc.pageCount} pgs</span>
                  </div>
                </div>
              );
            })}
          </div>

          {documents.length === 0 && (
            <div className="text-center py-10 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
              <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-300 font-medium">No documents in index</p>
              <p className="text-xs text-slate-500 mt-1">Upload a PDF or paste text to start querying.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: File Upload */}
      {activeTab === 'upload' && (
        <div className="mt-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFileUpload(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-cyan-500 bg-cyan-950/20'
                : 'border-slate-700/80 hover:border-cyan-500/60 bg-slate-950/40'
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
            <div className="w-12 h-12 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center mx-auto mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200">
              Click to browse or drag & drop files
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Supports PDF, TXT, Markdown, CSV, and Source Code files
            </p>
            <div className="flex justify-center gap-2 mt-4 text-[11px] text-slate-400">
              <span className="bg-slate-800 px-2 py-0.5 rounded">.PDF</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded">.TXT</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded">.MD</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded">.CSV</span>
            </div>
          </div>
          {uploadStatus && (
            <p className="text-xs text-cyan-400 text-center mt-3 animate-pulse">
              {uploadStatus}
            </p>
          )}
        </div>
      )}

      {/* Tab 3: Paste Text */}
      {activeTab === 'paste' && (
        <form onSubmit={handlePasteSubmit} className="mt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Document Title
              </label>
              <input
                type="text"
                required
                value={pasteTitle}
                onChange={(e) => setPasteTitle(e.target.value)}
                placeholder="e.g., Computer Science Honors Programme Overview"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Academic Discipline / Category
              </label>
              <select
                value={institution}
                onChange={(e) => setInstitution(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="Computer Science">Computer Science & Engineering</option>
                <option value="AI & Data Science">AI & Data Science</option>
                <option value="Information Systems">Information Systems & Cloud</option>
                <option value="Systems & Design">Systems Design & Architecture</option>
                <option value="General AI">Technical Research & Foundations</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Document Text Content
            </label>
            <textarea
              required
              rows={5}
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
              placeholder="Paste article, handbook syllabus, admission criteria, or research notes here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs rounded-lg shadow transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Index Document
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Chunking Engine Configuration */}
      {activeTab === 'settings' && (
        <div className="mt-4 space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              Chunking Engine Parameters (Live Tuning)
            </h3>
            <button
              onClick={onRechunkAll}
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-medium transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              Re-Chunk & Re-Index All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Target Chunk Size</span>
                <span className="font-mono text-cyan-400 font-semibold">
                  {chunkingConfig.chunkSize} characters (~{Math.ceil(chunkingConfig.chunkSize / 4)} tokens)
                </span>
              </div>
              <input
                type="range"
                min={200}
                max={1500}
                step={50}
                value={chunkingConfig.chunkSize}
                onChange={(e) =>
                  setChunkingConfig((prev) => ({
                    ...prev,
                    chunkSize: parseInt(e.target.value, 10),
                  }))
                }
                className="w-full accent-cyan-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Larger chunks retain broader context; smaller chunks produce tighter, high-precision embeddings.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Sliding Window Overlap</span>
                <span className="font-mono text-amber-400 font-semibold">
                  {chunkingConfig.chunkOverlap} characters ({((chunkingConfig.chunkOverlap / chunkingConfig.chunkSize) * 100).toFixed(0)}%)
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={300}
                step={25}
                value={chunkingConfig.chunkOverlap}
                onChange={(e) =>
                  setChunkingConfig((prev) => ({
                    ...prev,
                    chunkOverlap: parseInt(e.target.value, 10),
                  }))
                }
                className="w-full accent-amber-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Prevents critical sentences and definitions from being cut off at chunk boundaries.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
