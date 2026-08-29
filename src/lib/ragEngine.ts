import { DocumentChunk, DocumentItem, RetrievalResult, ChunkingConfig } from '../types';

/**
 * Grounded RAG Algorithmic Engine
 * Engineered with AI Assistance & Algorithmic Design
 * Contains the fundamental algorithmic steps of Retrieval-Augmented Generation:
 * 1. Recursive Character Chunking with Overlap
 * 2. Dense Semantic Vector Embedding & L2 Normalization
 * 3. Sparse Term Frequency (BM25) Vectorization
 * 4. Cosine Similarity & Hybrid Ranked Retrieval
 * 5. Dimensionality Reduction (PCA 2D projection) for Vector Space Mapping
 */

// Step 1: Robust Iterative & Recursive Character Chunking
export function splitTextRecursively(
  text: string,
  docId: string,
  docTitle: string,
  config: ChunkingConfig = { strategy: 'recursive', chunkSize: 600, chunkOverlap: 100, minChunkSize: 80 }
): DocumentChunk[] {
  const chunkSize = Math.max(120, config.chunkSize || 600);
  const chunkOverlap = Math.min(Math.floor(chunkSize * 0.4), Math.max(0, config.chunkOverlap || 100));
  const minChunkSize = Math.max(30, config.minChunkSize || 60);

  if (!text || text.trim().length === 0) return [];

  const chunks: DocumentChunk[] = [];
  const textLength = text.length;
  let currentOffset = 0;

  // Helper to check if an index is inside a $$...$$ display math block
  const isInsideMathBlock = (fullText: string, index: number): boolean => {
    let count = 0;
    let pos = 0;
    while ((pos = fullText.indexOf('$$', pos)) !== -1) {
      if (pos >= index) break;
      count++;
      pos += 2;
    }
    return count % 2 === 1;
  };

  while (currentOffset < textLength) {
    const remainingLength = textLength - currentOffset;

    if (remainingLength <= chunkSize) {
      const remainingText = text.slice(currentOffset).trim();
      if (remainingText.length >= minChunkSize || chunks.length === 0) {
        chunks.push(createChunk(remainingText, currentOffset, docId, docTitle, chunks.length));
      }
      break;
    }

    // Determine target slice
    let targetEnd = currentOffset + chunkSize;
    const targetSlice = text.slice(currentOffset, targetEnd);

    // Natural boundary separators in order of structural priority
    const boundarySeparators = [
      '\n\n',
      '\n### ',
      '\n## ',
      '\n# ',
      '\n- ',
      '\n* ',
      '\n1. ',
      '\n2. ',
      '\n3. ',
      '\n',
      '. ',
      '? ',
      '! ',
      '; ',
      ': ',
      ' ',
    ];

    let splitIndex = -1;
    for (const sep of boundarySeparators) {
      const lastIdx = targetSlice.lastIndexOf(sep);
      if (lastIdx >= minChunkSize) {
        const potentialEnd = currentOffset + lastIdx + sep.length;
        // Ensure split does not cut inside a display math block $$ ... $$
        if (!isInsideMathBlock(text, potentialEnd)) {
          splitIndex = potentialEnd;
          break;
        }
      }
    }

    // If split inside math block or no boundary found, look forward for math closure or fallback
    if (splitIndex === -1 || isInsideMathBlock(text, splitIndex)) {
      const nextMathClose = text.indexOf('$$', currentOffset + minChunkSize);
      if (nextMathClose !== -1 && nextMathClose - currentOffset < chunkSize * 1.5) {
        splitIndex = nextMathClose + 2;
      } else {
        // Fallback: look for space or hard cut
        const nextSpace = text.indexOf(' ', targetEnd);
        splitIndex = (nextSpace !== -1 && nextSpace - currentOffset < chunkSize + 60) ? nextSpace + 1 : targetEnd;
      }
    }

    const chunkContent = text.slice(currentOffset, splitIndex).trim();
    if (chunkContent.length >= minChunkSize || chunks.length === 0) {
      chunks.push(createChunk(chunkContent, currentOffset, docId, docTitle, chunks.length));
    }

    // Calculate next starting offset with overlap snapped to a clean word/sentence boundary
    let idealNextStart = splitIndex - chunkOverlap;
    if (idealNextStart <= currentOffset) {
      idealNextStart = splitIndex;
    }

    if (idealNextStart < textLength) {
      // Find nearest clean starting point (after \n\n, \n, sentence end, or space)
      let snappedStart = idealNextStart;
      const searchWindow = text.slice(Math.max(0, idealNextStart - 80), Math.min(textLength, idealNextStart + 80));
      const relOffset = idealNextStart - Math.max(0, idealNextStart - 80);

      // Prefer starting at a newline or sentence boundary
      const cleanStarts = ['\n\n', '\n- ', '\n* ', '\n', '. ', ' '];
      let bestSnap = -1;
      let minDistance = 999;

      for (const marker of cleanStarts) {
        let idx = searchWindow.indexOf(marker);
        while (idx !== -1) {
          const absPos = Math.max(0, idealNextStart - 80) + idx + marker.length;
          const dist = Math.abs(absPos - idealNextStart);
          if (absPos > currentOffset && absPos < splitIndex && dist < minDistance) {
            if (!isInsideMathBlock(text, absPos)) {
              minDistance = dist;
              bestSnap = absPos;
            }
          }
          idx = searchWindow.indexOf(marker, idx + 1);
        }
      }

      if (bestSnap !== -1) {
        snappedStart = bestSnap;
      }

      // Ensure progress
      currentOffset = Math.max(currentOffset + Math.max(20, Math.floor(chunkSize * 0.3)), snappedStart);
    } else {
      break;
    }
  }

  // Update total chunks count metadata
  const total = chunks.length;
  chunks.forEach((c) => {
    c.totalChunks = total;
  });

  return chunks;
}

function createChunk(
  text: string,
  start: number,
  docId: string,
  docTitle: string,
  index: number
): DocumentChunk {
  const tokenEstimate = Math.ceil(text.length / 4);
  const sparseTerms = computeTermFrequencies(text);
  const vector = generateLocalEmbedding(text);
  const norm = calculateL2Norm(vector);

  return {
    id: `${docId}-chunk-${index + 1}`,
    docId,
    docTitle,
    chunkIndex: index,
    totalChunks: 0,
    text,
    charStart: start,
    charEnd: start + text.length,
    tokenEstimate,
    vector,
    norm,
    sparseTerms,
  };
}

// Step 2: Dense Embedding & Math Operations
export function generateLocalEmbedding(text: string, dim = 256): number[] {
  const vec = new Float64Array(dim);
  const clean = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const words = clean.split(/\s+/).filter(Boolean);

  // Semantic frequency hashing with sinusoidal spatial distribution
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    let h1 = 5381;
    let h2 = 2166136261;
    for (let c = 0; c < word.length; c++) {
      const code = word.charCodeAt(c);
      h1 = ((h1 << 5) + h1) ^ code;
      h2 = (h2 * 16777619) ^ code;
    }
    const idx1 = Math.abs(h1) % dim;
    const idx2 = Math.abs(h2) % dim;
    const positionWeight = 1.0 / (1.0 + Math.log(1 + i));
    vec[idx1] += positionWeight * Math.sin(codeHash(word));
    vec[idx2] += positionWeight * Math.cos(codeHash(word));
  }

  // Character n-grams for subword morphology
  for (let i = 0; i < text.length - 3; i++) {
    const trigram = text.slice(i, i + 3).toLowerCase();
    const hash = Math.abs(codeHash(trigram)) % dim;
    vec[hash] += 0.35;
  }

  // L2-Normalize
  let sumSq = 0;
  for (let i = 0; i < dim; i++) {
    sumSq += vec[i] * vec[i];
  }
  const norm = Math.sqrt(sumSq);
  if (norm > 0) {
    for (let i = 0; i < dim; i++) {
      vec[i] /= norm;
    }
  }

  return Array.from(vec);
}

export function calculateL2Norm(vec: number[]): number {
  let sum = 0;
  for (let i = 0; i < vec.length; i++) {
    sum += vec[i] * vec[i];
  }
  return Math.sqrt(sum);
}

// Cosine Similarity Formula: cos(theta) = (A . B) / (||A|| * ||B||)
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (denom === 0) return 0;
  return Math.max(0, Math.min(1, dotProduct / denom));
}

// Step 3: Sparse Term Frequency (BM25)
function computeTermFrequencies(text: string): Record<string, number> {
  const counts: Record<string, number> = {};
  const tokens = text.toLowerCase().match(/\b[a-z0-9_]{2,}\b/g) || [];
  for (const t of tokens) {
    counts[t] = (counts[t] || 0) + 1;
  }
  return counts;
}

export function computeBM25Score(
  query: string,
  chunk: DocumentChunk,
  corpusChunks: DocumentChunk[]
): number {
  const qTokens = query.toLowerCase().match(/\b[a-z0-9_]{2,}\b/g) || [];
  if (qTokens.length === 0 || !chunk.sparseTerms) return 0;

  const N = Math.max(1, corpusChunks.length);
  const avgDocLen =
    corpusChunks.reduce((acc, c) => acc + (c.tokenEstimate || 1), 0) / N;
  const docLen = chunk.tokenEstimate || 1;
  const k1 = 1.5;
  const b = 0.75;

  let score = 0;
  for (const token of qTokens) {
    const fq = chunk.sparseTerms[token] || 0;
    if (fq === 0) continue;

    // Number of docs containing token
    let n_q = 0;
    for (const c of corpusChunks) {
      if (c.sparseTerms && c.sparseTerms[token]) n_q++;
    }

    // IDF formula
    const idf = Math.log((N - n_q + 0.5) / (n_q + 0.5) + 1);
    const tf = (fq * (k1 + 1)) / (fq + k1 * (1 - b + b * (docLen / avgDocLen)));
    score += idf * tf;
  }

  // Normalize between 0 and 1
  return Math.min(1.0, Math.max(0.0, score / (qTokens.length * 3.5)));
}

// Step 4: Hybrid Search Retrieval (Dense Cosine + Sparse BM25 Fusion)
export function performHybridRetrieval(
  query: string,
  queryVector: number[],
  allChunks: DocumentChunk[],
  topK = 4,
  minThreshold = 0.25,
  alpha = 0.7 // 0.7 = 70% Dense Embedding, 30% BM25 Sparse
): RetrievalResult[] {
  if (allChunks.length === 0) return [];

  const scored: Array<{
    chunk: DocumentChunk;
    denseScore: number;
    sparseScore: number;
    combinedScore: number;
  }> = [];

  for (const chunk of allChunks) {
    const chunkVec = chunk.vector || generateLocalEmbedding(chunk.text);
    const denseScore = cosineSimilarity(queryVector, chunkVec);
    const sparseScore = computeBM25Score(query, chunk, allChunks);
    const combinedScore = alpha * denseScore + (1 - alpha) * sparseScore;

    if (combinedScore >= minThreshold || denseScore >= minThreshold) {
      scored.push({
        chunk,
        denseScore,
        sparseScore,
        combinedScore,
      });
    }
  }

  // Sort descending by combined score
  scored.sort((a, b) => b.combinedScore - a.combinedScore);

  return scored.slice(0, topK).map((item, idx) => ({
    chunk: item.chunk,
    similarity: item.combinedScore,
    denseScore: item.denseScore,
    sparseScore: item.sparseScore,
    rank: idx + 1,
  }));
}

// Step 5: 2D Principal Component Analysis (PCA) for Vector Space Visualizer
export function projectVectorsTo2D(
  vectors: number[][]
): Array<{ x: number; y: number }> {
  if (vectors.length === 0) return [];
  const dim = vectors[0].length;
  const n = vectors.length;

  if (n === 1) return [{ x: 50, y: 50 }];

  // 1. Mean center the vectors
  const mean = new Float64Array(dim);
  for (let i = 0; i < n; i++) {
    for (let d = 0; d < dim; d++) {
      mean[d] += vectors[i][d];
    }
  }
  for (let d = 0; d < dim; d++) {
    mean[d] /= n;
  }

  const centered: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row = new Array(dim);
    for (let d = 0; d < dim; d++) {
      row[d] = vectors[i][d] - mean[d];
    }
    centered.push(row);
  }

  // 2. Power iteration to find top 2 principal eigenvectors
  const pc1 = powerIteration(centered, dim, 15);
  const pc2 = powerIterationOrthogonal(centered, dim, pc1, 15);

  // 3. Project data onto pc1 and pc2
  const rawCoords: Array<{ x: number; y: number }> = [];
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (let i = 0; i < n; i++) {
    let px = 0;
    let py = 0;
    for (let d = 0; d < dim; d++) {
      px += centered[i][d] * pc1[d];
      py += centered[i][d] * pc2[d];
    }
    rawCoords.push({ x: px, y: py });
    if (px < minX) minX = px;
    if (px > maxX) maxX = px;
    if (py < minY) minY = py;
    if (py > maxY) maxY = py;
  }

  // 4. Normalize to [10, 90] percentage range for visual canvas
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  return rawCoords.map((c) => ({
    x: 15 + ((c.x - minX) / rangeX) * 70,
    y: 15 + ((c.y - minY) / rangeY) * 70,
  }));
}

function powerIteration(data: number[][], dim: number, iters: number): number[] {
  let v = new Float64Array(dim);
  for (let i = 0; i < dim; i++) v[i] = Math.sin(i + 1);
  v = normalize(v);

  for (let iter = 0; iter < iters; iter++) {
    const nextV = new Float64Array(dim);
    for (const row of data) {
      let dot = 0;
      for (let d = 0; d < dim; d++) dot += row[d] * v[d];
      for (let d = 0; d < dim; d++) nextV[d] += row[d] * dot;
    }
    v = normalize(nextV);
  }
  return Array.from(v);
}

function powerIterationOrthogonal(
  data: number[][],
  dim: number,
  pc1: number[],
  iters: number
): number[] {
  let v = new Float64Array(dim);
  for (let i = 0; i < dim; i++) v[i] = Math.cos(i + 2);
  v = gramSchmidt(v, pc1);
  v = normalize(v);

  for (let iter = 0; iter < iters; iter++) {
    const nextV = new Float64Array(dim);
    for (const row of data) {
      let dot = 0;
      for (let d = 0; d < dim; d++) dot += row[d] * v[d];
      for (let d = 0; d < dim; d++) nextV[d] += row[d] * dot;
    }
    v = gramSchmidt(nextV, pc1);
    v = normalize(v);
  }
  return Array.from(v);
}

function gramSchmidt(v: Float64Array, u: number[]): Float64Array {
  let dot = 0;
  for (let i = 0; i < v.length; i++) dot += v[i] * u[i];
  const out = new Float64Array(v.length);
  for (let i = 0; i < v.length; i++) out[i] = v[i] - dot * u[i];
  return out;
}

function normalize(v: Float64Array): Float64Array {
  let norm = 0;
  for (let i = 0; i < v.length; i++) norm += v[i] * v[i];
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < v.length; i++) v[i] /= norm;
  }
  return v;
}

function codeHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
