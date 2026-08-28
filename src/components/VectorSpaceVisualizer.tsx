import React, { useState, useMemo } from 'react';
import { DocumentChunk, RetrievalResult } from '../types';
import { projectVectorsTo2D, cosineSimilarity, generateLocalEmbedding } from '../lib/ragEngine';
import { Compass, Search, Filter, Sparkles, Layers, RefreshCw } from 'lucide-react';

interface VectorSpaceVisualizerProps {
  allChunks: DocumentChunk[];
  lastQuery: string;
  lastRetrievedResults: RetrievalResult[];
}

export interface ColorTheme {
  id: string;
  label: string;
  dotBg: string;
  ringColor: string;
  badgeBg: string;
  textColor: string;
  border: string;
  hex: string;
}

export const COLOR_PALETTE: ColorTheme[] = [
  {
    id: 'rag',
    label: 'RAG Foundations (Lewis et al.)',
    dotBg: 'bg-purple-500',
    ringColor: 'ring-purple-400/50',
    badgeBg: 'bg-purple-950/60',
    textColor: 'text-purple-300',
    border: 'border-purple-500/30',
    hex: '#a855f7',
  },
  {
    id: 'transformers',
    label: 'Transformers & Attention (Vaswani et al.)',
    dotBg: 'bg-emerald-500',
    ringColor: 'ring-emerald-400/50',
    badgeBg: 'bg-emerald-950/60',
    textColor: 'text-emerald-300',
    border: 'border-emerald-500/30',
    hex: '#10b981',
  },
  {
    id: 'ml',
    label: 'ML Foundations & Optimization (AdamW)',
    dotBg: 'bg-orange-500',
    ringColor: 'ring-orange-400/50',
    badgeBg: 'bg-orange-950/60',
    textColor: 'text-orange-300',
    border: 'border-orange-500/30',
    hex: '#f97316',
  },
  {
    id: 'ds',
    label: 'Statistics & PCA (Data Science)',
    dotBg: 'bg-blue-500',
    ringColor: 'ring-blue-400/50',
    badgeBg: 'bg-blue-950/60',
    textColor: 'text-blue-300',
    border: 'border-blue-500/30',
    hex: '#3b82f6',
  },
  {
    id: 'vectors',
    label: 'Dense Vector Search & HNSW Indexing',
    dotBg: 'bg-cyan-500',
    ringColor: 'ring-cyan-400/50',
    badgeBg: 'bg-cyan-950/60',
    textColor: 'text-cyan-300',
    border: 'border-cyan-500/30',
    hex: '#06b6d4',
  },
  {
    id: 'custom-1',
    label: 'Custom Documents (Set A)',
    dotBg: 'bg-rose-500',
    ringColor: 'ring-rose-400/50',
    badgeBg: 'bg-rose-950/60',
    textColor: 'text-rose-300',
    border: 'border-rose-500/30',
    hex: '#f43f5e',
  },
  {
    id: 'custom-2',
    label: 'Custom Documents (Set B)',
    dotBg: 'bg-indigo-500',
    ringColor: 'ring-indigo-400/50',
    badgeBg: 'bg-indigo-950/60',
    textColor: 'text-indigo-300',
    border: 'border-indigo-500/30',
    hex: '#6366f1',
  },
];

// Helper to determine or assign color style based on document title / ID
export function getChunkColorStyle(chunk: DocumentChunk, allDocTitles: string[]): ColorTheme {
  const t = (chunk.docTitle || '').toLowerCase();
  
  if (t.includes('lewis') || t.includes('retrieval-augmented') || t.includes('rag')) {
    return COLOR_PALETTE[0];
  }
  if (t.includes('transformer') || t.includes('attention') || t.includes('vaswani') || t.includes('deep learning')) {
    return COLOR_PALETTE[1];
  }
  if (t.includes('machine learning') || t.includes('optimization') || t.includes('loss') || t.includes('adamw')) {
    return COLOR_PALETTE[2];
  }
  if (t.includes('data science') || t.includes('pca') || t.includes('statistics') || t.includes('svd')) {
    return COLOR_PALETTE[3];
  }
  if (t.includes('hnsw') || t.includes('faiss') || t.includes('vector search') || t.includes('nlp') || t.includes('metric')) {
    return COLOR_PALETTE[4];
  }

  // Fallback hashing for uploaded / custom documents
  const docIdx = allDocTitles.indexOf(chunk.docTitle);
  const paletteIdx = docIdx >= 0 ? 5 + (docIdx % 2) : 5;
  return COLOR_PALETTE[paletteIdx] || COLOR_PALETTE[5];
}

export const VectorSpaceVisualizer: React.FC<VectorSpaceVisualizerProps> = ({
  allChunks,
  lastQuery,
  lastRetrievedResults,
}) => {
  const [hoveredChunk, setHoveredChunk] = useState<{
    chunk: DocumentChunk;
    x: number;
    y: number;
    dist?: number;
    style: ColorTheme;
  } | null>(null);

  const [testQuery, setTestQuery] = useState(
    lastQuery || 'Retrieval mechanisms and dense vector embeddings'
  );
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  // Sync test query if lastQuery changes externally
  React.useEffect(() => {
    if (lastQuery) {
      setTestQuery(lastQuery);
    }
  }, [lastQuery]);

  // Unique document titles for consistent color hashing
  const uniqueDocTitles = useMemo(() => {
    return Array.from(new Set(allChunks.map((c) => c.docTitle)));
  }, [allChunks]);

  // Dimensionality reduction: 256-D -> 2D
  const { chunkCoords, queryCoord, queryVec } = useMemo(() => {
    if (allChunks.length === 0) {
      return { chunkCoords: [], queryCoord: { x: 50, y: 50 }, queryVec: [] };
    }

    const qVec = generateLocalEmbedding(testQuery || 'test');
    const vectors = allChunks.map((c) => c.vector || generateLocalEmbedding(c.text));
    vectors.push(qVec);

    const projected = projectVectorsTo2D(vectors);
    const qCoord = projected[projected.length - 1] || { x: 50, y: 50 };
    const cCoords = projected.slice(0, projected.length - 1);

    return { chunkCoords: cCoords, queryCoord: qCoord, queryVec: qVec };
  }, [allChunks, testQuery]);

  const topRetrievedChunkIds = useMemo(() => {
    return new Set(lastRetrievedResults.map((r) => r.chunk.id));
  }, [lastRetrievedResults]);

  // Group chunks by color style for legend counters
  const categoryStats = useMemo(() => {
    const map = new Map<string, { theme: ColorTheme; count: number; docTitles: Set<string> }>();
    
    for (const chunk of allChunks) {
      const theme = getChunkColorStyle(chunk, uniqueDocTitles);
      if (!map.has(theme.id)) {
        map.set(theme.id, { theme, count: 0, docTitles: new Set() });
      }
      const entry = map.get(theme.id)!;
      entry.count++;
      entry.docTitles.add(chunk.docTitle);
    }

    return Array.from(map.values());
  }, [allChunks, uniqueDocTitles]);

  return (
    <div className="bg-ink-900 rounded-xl border border-ink-800 p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Header with Title & Query Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-ink-800">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-accent-400" />
            <h3 className="text-sm font-semibold text-white font-sans">
              2D Vector Space Projection & Semantic Manifold
            </h3>
          </div>
          <p className="text-xs text-ink-400 mt-0.5">
            PCA projection from 256-D embedding hypersphere &middot; Color-coded by topic cluster
          </p>
        </div>

        {/* Query Input Box */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="Test query position..."
              className="bg-black border border-ink-800 rounded-lg pl-7 pr-3 py-1.5 text-xs text-ink-100 placeholder-ink-600 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500 w-56 sm:w-64 transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-ink-500 absolute left-2.5 top-2.5" />
          </div>

          {selectedCategoryFilter && (
            <button
              onClick={() => setSelectedCategoryFilter(null)}
              className="p-1.5 bg-ink-800 hover:bg-ink-700 text-accent-400 rounded-lg text-xs flex items-center gap-1 border border-ink-700 transition-colors"
              title="Clear active cluster filter"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="text-[10px]">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Projection Canvas */}
      <div className="relative w-full h-[400px] bg-black rounded-lg border border-ink-800 overflow-hidden select-none">
        {/* Background Coordinate Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#17191e_1px,transparent_1px),linear-gradient(to_bottom,#17191e_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Radial Hypersphere Cross-Sections */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-36 h-36 rounded-full border border-ink-800/40" />
          <div className="w-64 h-64 rounded-full border border-ink-800/60" />
          <div className="w-96 h-96 rounded-full border border-ink-800/30" />
          {/* Axis Crosshairs */}
          <div className="absolute w-full h-[1px] bg-ink-800/50" />
          <div className="absolute h-full w-[1px] bg-ink-800/50" />
        </div>

        {/* Axis Labels */}
        <div className="absolute left-3 bottom-2 text-[10px] font-mono text-ink-500 flex items-center gap-1">
          <span>PC₁ (First Principal Component)</span>
        </div>
        <div className="absolute left-2 top-3 text-[10px] font-mono text-ink-500 [writing-mode:vertical-lr] flex items-center gap-1">
          <span>PC₂ (Second Principal Component)</span>
        </div>

        {/* Connection Rays from Query to Top-K Retrieved Nodes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {chunkCoords.map((coord, idx) => {
            const chunk = allChunks[idx];
            if (!chunk) return null;
            if (!topRetrievedChunkIds.has(chunk.id)) return null;
            
            const theme = getChunkColorStyle(chunk, uniqueDocTitles);
            return (
              <g key={`line-group-${chunk.id}`}>
                <line
                  x1={`${queryCoord.x}%`}
                  y1={`${queryCoord.y}%`}
                  x2={`${coord.x}%`}
                  y2={`${coord.y}%`}
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  strokeOpacity="0.8"
                />
                <circle
                  cx={`${coord.x}%`}
                  cy={`${coord.y}%`}
                  r="12"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeOpacity="0.5"
                  className="animate-ping"
                />
              </g>
            );
          })}
        </svg>

        {/* Chunk Vector Nodes */}
        {chunkCoords.map((coord, idx) => {
          const chunk = allChunks[idx];
          if (!chunk) return null;

          const isRetrieved = topRetrievedChunkIds.has(chunk.id);
          const style = getChunkColorStyle(chunk, uniqueDocTitles);
          const chunkVec = chunk.vector || generateLocalEmbedding(chunk.text);
          const similarity = queryVec.length > 0 ? cosineSimilarity(queryVec, chunkVec) : 0;

          // Filter logic: if a category filter is active and this chunk doesn't belong, dim it
          const isDimmed = selectedCategoryFilter !== null && style.id !== selectedCategoryFilter;
          const isHighlighted = selectedCategoryFilter !== null && style.id === selectedCategoryFilter;

          return (
            <div
              key={chunk.id}
              style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
              onMouseEnter={() =>
                setHoveredChunk({ chunk, x: coord.x, y: coord.y, dist: similarity, style })
              }
              onMouseLeave={() => setHoveredChunk(null)}
              onClick={() => {
                // Set as active test query preview or highlight
                setHoveredChunk({ chunk, x: coord.x, y: coord.y, dist: similarity, style });
              }}
              className={`absolute -ml-2 -mt-2 rounded-full cursor-pointer transition-all duration-200 ${
                isRetrieved
                  ? `w-4 h-4 z-20 ${style.dotBg} ring-4 ring-amber-400 shadow-lg shadow-amber-500/50 scale-125`
                  : isHighlighted
                  ? `w-4 h-4 z-20 ${style.dotBg} ring-4 ring-white/60 shadow-lg shadow-white/20 scale-125`
                  : isDimmed
                  ? `w-3 h-3 z-0 ${style.dotBg} opacity-20 border border-black/40`
                  : `w-3.5 h-3.5 z-10 ${style.dotBg} border border-black/60 hover:scale-135 hover:ring-2 hover:ring-white/80`
              }`}
            />
          );
        })}

        {/* Query Node (Q) */}
        <div
          style={{ left: `${queryCoord.x}%`, top: `${queryCoord.y}%` }}
          className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full bg-white text-black ring-4 ring-amber-400 shadow-xl shadow-amber-500/40 flex items-center justify-center font-black text-[10px] z-30 animate-pulse cursor-pointer border border-black"
          title={`Active Query: "${testQuery}"`}
        >
          Q
        </div>

        {/* Hover Tooltip Card */}
        {hoveredChunk && (
          <div
            style={{
              left: `${Math.min(78, Math.max(12, hoveredChunk.x))}%`,
              top: `${Math.min(70, Math.max(10, hoveredChunk.y - 10))}%`,
            }}
            className="absolute z-40 pointer-events-none -translate-x-1/2 -translate-y-full w-72 bg-black/95 backdrop-blur border border-ink-700 rounded-xl p-3.5 shadow-2xl space-y-2 text-xs animate-fade-in"
          >
            {/* Header with Category Badge & Similarity */}
            <div className="flex items-center justify-between gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold border flex items-center gap-1.5 ${hoveredChunk.style.badgeBg} ${hoveredChunk.style.textColor} ${hoveredChunk.style.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${hoveredChunk.style.dotBg}`} />
                <span className="truncate max-w-[130px]">{hoveredChunk.style.label.split(' (')[0]}</span>
              </span>

              <span className="font-mono text-amber-400 font-bold text-xs bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
                {((hoveredChunk.dist || 0) * 100).toFixed(1)}% Cosine
              </span>
            </div>

            {/* Document Title */}
            <div className="text-[11px] font-semibold text-white leading-tight">
              {hoveredChunk.chunk.docTitle}
            </div>

            {/* Snippet text */}
            <p className="text-[11px] text-ink-300 font-mono line-clamp-3 bg-ink-950 p-2 rounded-lg border border-ink-800 leading-relaxed">
              "{hoveredChunk.chunk.text}"
            </p>

            {/* Chunk offset metadata */}
            <div className="flex items-center justify-between text-[10px] text-ink-400 pt-0.5 border-t border-ink-800/80 font-mono">
              <span>Chunk #{hoveredChunk.chunk.chunkIndex + 1} of {hoveredChunk.chunk.totalChunks || '?'}</span>
              <span>~{hoveredChunk.chunk.tokenEstimate} tokens</span>
            </div>
          </div>
        )}
      </div>

      {/* COMPREHENSIVE MULTI-COLOR LEGEND */}
      <div className="space-y-3 pt-1 border-t border-ink-800">
        <div className="flex items-center justify-between text-xs">
          <span className="text-ink-400 font-medium flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-accent-400" />
            <span>Interactive Cluster Legend (Click to filter):</span>
          </span>

          <span className="text-[11px] font-mono text-accent-400 bg-accent-950 px-2 py-0.5 rounded border border-accent-800">
            cos(θ) = (u·v) / (||u|| ||v||)
          </span>
        </div>

        {/* System Node Markers */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-black px-2.5 py-1 rounded-lg border border-ink-800">
            <span className="w-3 h-3 rounded-full bg-white text-black font-black text-[8px] flex items-center justify-center ring-2 ring-amber-400">
              Q
            </span>
            <span className="text-ink-200 text-xs font-medium">Active Query Position (Q)</span>
          </div>

          <div className="flex items-center gap-1.5 bg-black px-2.5 py-1 rounded-lg border border-amber-800/40 text-amber-300">
            <span className="w-3 h-3 rounded-full bg-amber-400 ring-2 ring-amber-500/50" />
            <span className="text-xs font-medium">Top-K Retrieved Passages ({topRetrievedChunkIds.size})</span>
          </div>
        </div>

        {/* Topic Cluster Color Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {categoryStats.map(({ theme, count }) => {
            const isSelected = selectedCategoryFilter === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() =>
                  setSelectedCategoryFilter(isSelected ? null : theme.id)
                }
                className={`p-2 rounded-lg border text-left transition-all flex items-center justify-between gap-2 text-xs ${
                  isSelected
                    ? `${theme.badgeBg} ${theme.border} ring-1 ring-white/50 shadow-md`
                    : 'bg-black border-ink-800 hover:border-ink-700 hover:bg-ink-850'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${theme.dotBg}`} />
                  <span className={`truncate font-medium ${isSelected ? 'text-white' : 'text-ink-300'}`}>
                    {theme.label.split(' (')[0]}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    isSelected
                      ? `${theme.textColor} ${theme.badgeBg} ${theme.border}`
                      : 'text-ink-400 bg-ink-900 border-ink-800'
                  }`}
                >
                  {count} chunks
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

