import React, { useState, useMemo } from 'react';
import { DocumentChunk, RetrievalResult } from '../types';
import { projectVectorsTo2D, cosineSimilarity, generateLocalEmbedding } from '../lib/ragEngine';
import { Network, Compass, Sparkles, Search, Layers, Zap } from 'lucide-react';

interface VectorSpaceVisualizerProps {
  allChunks: DocumentChunk[];
  lastQuery: string;
  lastRetrievedResults: RetrievalResult[];
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
  } | null>(null);

  const [testQuery, setTestQuery] = useState(lastQuery || 'Admissions requirements and machine learning');

  // Compute 2D coordinates for all chunks + query
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

    return {
      chunkCoords: cCoords,
      queryCoord: qCoord,
      queryVec: qVec,
    };
  }, [allChunks, testQuery]);

  const topRetrievedChunkIds = new Set(
    lastRetrievedResults.map((r) => r.chunk.id)
  );

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            2D Semantic Vector Space Projection
          </h3>
          <p className="text-xs text-slate-400">
            PCA Dimensionality Reduction from 256-D space onto 2D Cartesian plane (R^256 &rarr; R^2)
          </p>
        </div>

        {/* Live Test Query input */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              placeholder="Test query semantic position..."
              className="bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-64"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
          </div>
        </div>
      </div>

      {/* Visual Canvas Area */}
      <div className="relative w-full h-[400px] bg-slate-950 rounded-xl border border-slate-800 overflow-hidden select-none">
        {/* Background Grid & Polar Guides */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 rounded-full border border-slate-800/40" />
          <div className="w-80 h-80 rounded-full border border-slate-800/30" />
        </div>

        {/* Axis markers */}
        <div className="absolute left-3 bottom-2 text-[10px] font-mono text-slate-600">
          Principal Component 1 (PC1)
        </div>
        <div className="absolute left-2 top-3 text-[10px] font-mono text-slate-600 [writing-mode:vertical-lr]">
          Principal Component 2 (PC2)
        </div>

        {/* SVG connection rays to retrieved chunks */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {chunkCoords.map((coord, idx) => {
            const chunk = allChunks[idx];
            if (!chunk) return null;
            const isRetrieved = topRetrievedChunkIds.has(chunk.id);
            if (!isRetrieved) return null;

            return (
              <line
                key={`line-${chunk.id}`}
                x1={`${queryCoord.x}%`}
                y1={`${queryCoord.y}%`}
                x2={`${coord.x}%`}
                y2={`${coord.y}%`}
                stroke="#06b6d4"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                strokeOpacity="0.7"
              />
            );
          })}
        </svg>

        {/* Render Chunk Vector Nodes */}
        {chunkCoords.map((coord, idx) => {
          const chunk = allChunks[idx];
          if (!chunk) return null;
          const isRetrieved = topRetrievedChunkIds.has(chunk.id);
          const chunkVec = chunk.vector || generateLocalEmbedding(chunk.text);
          const similarity = queryVec.length > 0 ? cosineSimilarity(queryVec, chunkVec) : 0;

          // Color by academic discipline
          const nodeColor = isRetrieved
            ? 'bg-cyan-400 ring-4 ring-cyan-500/40 shadow-lg shadow-cyan-500/50 scale-125'
            : chunk.docTitle.toLowerCase().includes('computer science')
            ? 'bg-orange-500 hover:scale-125'
            : chunk.docTitle.toLowerCase().includes('data science') || chunk.docTitle.toLowerCase().includes('artificial intelligence')
            ? 'bg-red-500 hover:scale-125'
            : chunk.docTitle.toLowerCase().includes('information systems')
            ? 'bg-blue-500 hover:scale-125'
            : chunk.docTitle.toLowerCase().includes('design') || chunk.docTitle.toLowerCase().includes('systems')
            ? 'bg-rose-500 hover:scale-125'
            : 'bg-emerald-500 hover:scale-125';

          return (
            <div
              key={chunk.id}
              style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
              onMouseEnter={() =>
                setHoveredChunk({
                  chunk,
                  x: coord.x,
                  y: coord.y,
                  dist: similarity,
                })
              }
              onMouseLeave={() => setHoveredChunk(null)}
              className={`absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full cursor-pointer transition-all duration-200 z-10 ${nodeColor}`}
            />
          );
        })}

        {/* Query Vector Node */}
        <div
          style={{ left: `${queryCoord.x}%`, top: `${queryCoord.y}%` }}
          className="absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 ring-4 ring-amber-400/40 shadow-xl shadow-amber-500/50 flex items-center justify-center text-slate-950 font-bold text-[9px] z-20 animate-pulse cursor-pointer"
          title={`Query Vector: "${testQuery}"`}
        >
          Q
        </div>

        {/* Hovered Tooltip Card */}
        {hoveredChunk && (
          <div
            style={{
              left: `${Math.min(75, Math.max(10, hoveredChunk.x))}%`,
              top: `${Math.min(70, Math.max(10, hoveredChunk.y - 12))}%`,
            }}
            className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-full w-64 bg-slate-900/95 backdrop-blur border border-cyan-500/50 rounded-xl p-3 shadow-2xl space-y-1.5 text-xs animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-cyan-400 truncate max-w-[140px]">
                {hoveredChunk.chunk.docTitle}
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                {((hoveredChunk.dist || 0) * 100).toFixed(1)}% Cosine
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono line-clamp-3 bg-slate-950 p-1.5 rounded border border-slate-800">
              {hoveredChunk.chunk.text}
            </p>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span>Chunk #{hoveredChunk.chunk.chunkIndex + 1}</span>
              <span>~{hoveredChunk.chunk.tokenEstimate} Tokens</span>
            </div>
          </div>
        )}
      </div>

      {/* Legend & Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-1">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-slate-300">Cluster Legend:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" /> Query Vector (Q)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-cyan-500/50" /> Top-K Retrieved
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500" /> Computer Science
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500" /> AI & Data Science
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Information Systems
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Systems & Design
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Research Foundations
          </span>
        </div>

        <div className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
          cos(&theta;) = (u &middot; v) / (||u|| &times; ||v||)
        </div>
      </div>
    </div>
  );
};
