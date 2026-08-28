import React, { useState, useMemo } from 'react';
import { DocumentChunk, RetrievalResult } from '../types';
import { projectVectorsTo2D, cosineSimilarity, generateLocalEmbedding } from '../lib/ragEngine';
import { Compass, Search } from 'lucide-react';

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

  const topRetrievedChunkIds = new Set(lastRetrievedResults.map((r) => r.chunk.id));

  const nodeColor = (chunk: DocumentChunk, isRetrieved: boolean) => {
    if (isRetrieved) return 'bg-accent-400 ring-4 ring-accent-500/30 shadow-lg shadow-accent-500/30 scale-125';
    const title = chunk.docTitle.toLowerCase();
    if (title.includes('computer science')) return 'bg-orange-500';
    if (title.includes('data science') || title.includes('artificial intelligence')) return 'bg-red-500';
    if (title.includes('information systems')) return 'bg-blue-500';
    if (title.includes('design') || title.includes('systems')) return 'bg-rose-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-ink-900 rounded-xl border border-ink-800 p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-ink-800">
        <div>
          <h3 className="text-sm font-semibold text-ink-50 flex items-center gap-2">
            <Compass className="w-4 h-4 text-accent-400" />
            Vector Space Projection
          </h3>
          <p className="text-xs text-ink-500 mt-0.5">
            PCA from 256-D to 2-D Cartesian plane
          </p>
        </div>

        <div className="relative">
          <input
            type="text"
            value={testQuery}
            onChange={(e) => setTestQuery(e.target.value)}
            placeholder="Test query position..."
            className="bg-ink-850 border border-ink-800 rounded-lg pl-7 pr-3 py-1 text-xs text-ink-100 placeholder-ink-600 focus:outline-none focus:border-accent-500/50 w-56 transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-ink-600 absolute left-2 top-2" />
        </div>
      </div>

      {/* Canvas */}
      <div className="relative w-full h-[400px] bg-ink-950 rounded-lg border border-ink-800 overflow-hidden select-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a202920_1px,transparent_1px),linear-gradient(to_bottom,#1a202920_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 rounded-full border border-ink-800/40" />
          <div className="w-80 h-80 rounded-full border border-ink-800/30" />
        </div>

        <div className="absolute left-3 bottom-2 text-[10px] font-mono text-ink-600">PC1</div>
        <div className="absolute left-2 top-3 text-[10px] font-mono text-ink-600 [writing-mode:vertical-lr]">PC2</div>

        {/* Connection rays */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {chunkCoords.map((coord, idx) => {
            const chunk = allChunks[idx];
            if (!chunk) return null;
            if (!topRetrievedChunkIds.has(chunk.id)) return null;
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
                strokeOpacity="0.6"
              />
            );
          })}
        </svg>

        {/* Chunk nodes */}
        {chunkCoords.map((coord, idx) => {
          const chunk = allChunks[idx];
          if (!chunk) return null;
          const isRetrieved = topRetrievedChunkIds.has(chunk.id);
          const chunkVec = chunk.vector || generateLocalEmbedding(chunk.text);
          const similarity = queryVec.length > 0 ? cosineSimilarity(queryVec, chunkVec) : 0;

          return (
            <div
              key={chunk.id}
              style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
              onMouseEnter={() => setHoveredChunk({ chunk, x: coord.x, y: coord.y, dist: similarity })}
              onMouseLeave={() => setHoveredChunk(null)}
              className={`absolute w-3 h-3 -ml-1.5 -mt-1.5 rounded-full cursor-pointer transition-all duration-200 z-10 hover:scale-125 ${nodeColor(chunk, isRetrieved)}`}
            />
          );
        })}

        {/* Query node */}
        <div
          style={{ left: `${queryCoord.x}%`, top: `${queryCoord.y}%` }}
          className="absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full bg-gradient-to-tr from-amber-400 to-amber-300 ring-4 ring-amber-400/30 shadow-lg shadow-amber-500/30 flex items-center justify-center text-ink-950 font-bold text-[9px] z-20 animate-pulse cursor-pointer"
          title={`Query: "${testQuery}"`}
        >
          Q
        </div>

        {/* Tooltip */}
        {hoveredChunk && (
          <div
            style={{
              left: `${Math.min(75, Math.max(10, hoveredChunk.x))}%`,
              top: `${Math.min(70, Math.max(10, hoveredChunk.y - 12))}%`,
            }}
            className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-full w-64 bg-ink-900/95 backdrop-blur border border-accent-500/30 rounded-lg p-3 shadow-2xl space-y-1.5 text-xs animate-fade-in"
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-accent-400 truncate max-w-[140px]">
                {hoveredChunk.chunk.docTitle}
              </span>
              <span className="font-mono text-emerald-400 font-semibold">
                {((hoveredChunk.dist || 0) * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-[11px] text-ink-300 font-mono line-clamp-3 bg-ink-950 p-1.5 rounded border border-ink-800">
              {hoveredChunk.chunk.text}
            </p>
            <div className="flex items-center justify-between text-[10px] text-ink-500 pt-0.5">
              <span>Chunk #{hoveredChunk.chunk.chunkIndex + 1}</span>
              <span>~{hoveredChunk.chunk.tokenEstimate} tok</span>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink-400 pt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" /> Query
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-400 ring-2 ring-accent-500/40" /> Retrieved
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-500" /> CS
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500" /> AI
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" /> IS
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" /> Systems
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Research
        </span>
        <span className="ml-auto text-[11px] font-mono text-accent-400 bg-accent-500/10 px-2 py-0.5 rounded border border-accent-500/20">
          cos(θ) = (u·v) / (‖u‖·‖v‖)
        </span>
      </div>
    </div>
  );
};
