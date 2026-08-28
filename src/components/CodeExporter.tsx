import React, { useState } from 'react';
import { Code2, Copy, Check, Download, Sparkles, Terminal } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CodeExporter: React.FC = () => {
  const [activeLang, setActiveLang] = useState<'python' | 'typescript'>('python');
  const [copied, setCopied] = useState(false);

  const pythonCode = `"""
Document Q&A Bot with Retrieval-Augmented Generation (RAG)
Engineered with AI Assistance & Algorithmic Design

Features:
- Pure algorithmic implementation with Zero Third-Party Framework Lock-in
- Recursive Character Chunking with Sliding Window Overlap
- Dense Vector Cosine Similarity & L2 Hypersphere Normalization
- Sparse Inverted Index with BM25 Scoring & Hybrid Rank Fusion
- Strict Grounding Prompt Assembly & Citation Provenance
"""

import math
import re
from typing import List, Dict, Any, Tuple

# ==============================================================================
# Step 1: Recursive Character Chunking
# ==============================================================================
class DocumentChunk:
    def __init__(self, chunk_id: str, doc_title: str, text: str, chunk_index: int, char_start: int, char_end: int):
        self.id = chunk_id
        self.doc_title = doc_title
        self.text = text
        self.chunk_index = chunk_index
        self.char_start = char_start
        self.char_end = char_end
        self.vector: List[float] = []
        self.sparse_terms: Dict[str, int] = self._compute_tf(text)

    def _compute_tf(self, text: str) -> Dict[str, int]:
        tokens = re.findall(r'\\b[a-z0-9_]{2,}\\b', text.lower())
        tf = {}
        for t in tokens:
            tf[t] = tf.get(t, 0) + 1
        return tf

def recursive_character_split(
    text: str,
    doc_title: str,
    chunk_size: int = 600,
    chunk_overlap: int = 100,
    min_chunk_size: int = 80
) -> List[DocumentChunk]:
    chunks: List[DocumentChunk] = []
    separators = ["\\n\\n", "\\n", ". ", "? ", "! ", " ", ""]

    def _split(content: str, start_offset: int):
        if len(content) <= chunk_size:
            if len(content.strip()) >= min_chunk_size:
                cid = f"{doc_title}-chunk-{len(chunks) + 1}"
                chunks.append(DocumentChunk(cid, doc_title, content.strip(), len(chunks), start_offset, start_offset + len(content)))
            return

        chosen_sep = ""
        split_idx = -1
        for sep in separators:
            if sep in content:
                parts = content.split(sep)
                running = 0
                for part in parts:
                    part_len = len(part) + len(sep)
                    if running + part_len > chunk_size:
                        if running >= min_chunk_size:
                            split_idx = running
                            chosen_sep = sep
                        break
                    running += part_len
                if split_idx > 0:
                    break

        if split_idx == -1:
            split_idx = chunk_size

        first_slice = content[:split_idx].strip()
        if len(first_slice) >= min_chunk_size:
            cid = f"{doc_title}-chunk-{len(chunks) + 1}"
            chunks.append(DocumentChunk(cid, doc_title, first_slice, len(chunks), start_offset, start_offset + len(first_slice)))

        # Sliding overlap advancement
        next_start = max(0, split_idx - chunk_overlap)
        if next_start < len(content) and split_idx < len(content):
            _split(content[next_start:], start_offset + next_start)

    _split(text, 0)
    return chunks

# ==============================================================================
# Step 2: Dense Vector Algebra (Cosine Similarity & Normalization)
# ==============================================================================
def l2_normalize(vec: List[float]) -> List[float]:
    norm = math.sqrt(sum(x * x for x in vec))
    if norm == 0:
        return vec
    return [x / norm for x in vec]

def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    if not vec_a or not vec_b or len(vec_a) != len(vec_b):
        return 0.0
    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)

# ==============================================================================
# Step 3: Sparse BM25 Scoring
# ==============================================================================
def compute_bm25_score(
    query_tokens: List[str],
    doc_chunk: DocumentChunk,
    corpus: List[DocumentChunk],
    k1: float = 1.5,
    b: float = 0.75
) -> float:
    N = len(corpus)
    if N == 0:
        return 0.0
    avg_dl = sum(len(c.text.split()) for c in corpus) / N
    doc_len = len(doc_chunk.text.split())

    score = 0.0
    for token in query_tokens:
        df = sum(1 for c in corpus if token in c.sparse_terms)
        idf = math.log(1.0 + (N - df + 0.5) / (df + 0.5))
        tf = doc_chunk.sparse_terms.get(token, 0)
        numerator = tf * (k1 + 1.0)
        denominator = tf + k1 * (1.0 - b + b * (doc_len / avg_dl)) if avg_dl > 0 else 1.0
        score += idf * (numerator / denominator)
    return score

# ==============================================================================
# Step 4: Hybrid Dual-Retrieval & RRF Fusion
# ==============================================================================
def hybrid_retrieve(
    query: str,
    query_vec: List[float],
    corpus: List[DocumentChunk],
    top_k: int = 4,
    dense_weight: float = 0.7,
    sparse_weight: float = 0.3
) -> List[Tuple[DocumentChunk, float]]:
    query_tokens = re.findall(r'\\b[a-z0-9_]{2,}\\b', query.lower())
    scored_candidates = []

    for chunk in corpus:
        dense_sim = cosine_similarity(query_vec, chunk.vector) if chunk.vector else 0.0
        bm25_sim = compute_bm25_score(query_tokens, chunk, corpus)
        hybrid_score = (dense_weight * dense_sim) + (sparse_weight * min(bm25_sim / 10.0, 1.0))
        scored_candidates.append((chunk, hybrid_score))

    scored_candidates.sort(key=lambda x: x[1], reverse=True)
    return scored_candidates[:top_k]

# ==============================================================================
# Step 5: Strict Negative-Constraint Prompt Grounding
# ==============================================================================
def assemble_grounded_prompt(query: str, retrieved_chunks: List[Tuple[DocumentChunk, float]]) -> Tuple[str, str]:
    context_blocks = []
    for idx, (chunk, score) in enumerate(retrieved_chunks):
        context_blocks.append(f"[Source {idx+1}] ({chunk.doc_title} - Chunk #{chunk.chunk_index + 1}):\\n{chunk.text}")

    context_str = "\\n\\n".join(context_blocks)
    system_prompt = (
        "You are an authoritative factual research AI assistant. "
        "Answer the user's question using ONLY the provided context sources below. "
        "Strictly adhere to the facts: if the information is not present, explicitly state that it cannot be answered from the provided documents. "
        "Cite every factual claim using [Source X] format."
    )
    user_prompt = f"CONTEXT:\\n{context_str}\\n\\nQUESTION:\\n{query}"
    return system_prompt, user_prompt
`;

  const tsCode = `/**
 * Document Q&A Bot with Retrieval-Augmented Generation (RAG)
 * Pure Algorithmic Implementation in TypeScript
 */

export interface DocumentChunk {
  id: string;
  docTitle: string;
  text: string;
  chunkIndex: number;
  charStart: number;
  charEnd: number;
  vector?: number[];
  sparseTerms?: Record<string, number>;
}

// 1. Recursive Character Chunking
export function recursiveCharacterSplit(
  text: string,
  docTitle: string,
  chunkSize: number = 600,
  chunkOverlap: number = 100
): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  const separators = ['\\n\\n', '\\n', '. ', '? ', '! ', ' ', ''];

  function splitRecursive(content: string, startOffset: number) {
    if (content.length <= chunkSize) {
      if (content.trim().length >= 80) {
        chunks.push({
          id: \`\${docTitle}-chunk-\${chunks.length + 1}\`,
          docTitle,
          text: content.trim(),
          chunkIndex: chunks.length,
          charStart: startOffset,
          charEnd: startOffset + content.length,
        });
      }
      return;
    }

    let splitIndex = -1;
    for (const sep of separators) {
      if (content.includes(sep)) {
        const parts = content.split(sep);
        let running = 0;
        for (const part of parts) {
          const len = part.length + sep.length;
          if (running + len > chunkSize) {
            if (running >= 80) splitIndex = running;
            break;
          }
          running += len;
        }
        if (splitIndex > 0) break;
      }
    }

    if (splitIndex === -1) splitIndex = chunkSize;
    const slice = content.slice(0, splitIndex).trim();
    if (slice.length >= 80) {
      chunks.push({
        id: \`\${docTitle}-chunk-\${chunks.length + 1}\`,
        docTitle,
        text: slice,
        chunkIndex: chunks.length,
        charStart: startOffset,
        charEnd: startOffset + slice.length,
      });
    }

    const nextStart = Math.max(0, splitIndex - chunkOverlap);
    if (nextStart < content.length && splitIndex < content.length) {
      splitRecursive(content.slice(nextStart), startOffset + nextStart);
    }
  }

  splitRecursive(text, 0);
  return chunks;
}

// 2. Cosine Similarity & Vector Norms
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}
`;

  const handleCopyCode = () => {
    const code = activeLang === 'python' ? pythonCode : tsCode;
    navigator.clipboard.writeText(code);
    setCopied(true);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const code = activeLang === 'python' ? pythonCode : tsCode;
    const filename = activeLang === 'python' ? 'rag_from_scratch.py' : 'ragPipeline.ts';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-ink-900 rounded-xl border border-ink-800 p-5 sm:p-6 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ink-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2 font-sans">
            <Code2 className="w-5 h-5 text-accent-400" />
            Complete RAG Source Code Exporter
          </h2>
          <p className="text-xs text-ink-400 mt-0.5">
            Zero external library lock-in &middot; Transparent algorithmic code engineered with clean principles
          </p>
        </div>

        {/* Language selector & actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-black p-1 rounded-lg border border-ink-800 text-xs">
            <button
              onClick={() => setActiveLang('python')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeLang === 'python'
                  ? 'bg-accent-600 text-white shadow'
                  : 'text-ink-400 hover:text-white'
              }`}
            >
              Python (.py)
            </button>
            <button
              onClick={() => setActiveLang('typescript')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeLang === 'typescript'
                  ? 'bg-accent-600 text-white shadow'
                  : 'text-ink-400 hover:text-white'
              }`}
            >
              TypeScript (.ts)
            </button>
          </div>

          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 bg-ink-800 hover:bg-ink-700 text-ink-200 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border border-ink-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-accent-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-1.5 bg-accent-600 hover:bg-accent-500 text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Code Viewer */}
      <div className="relative bg-black border border-ink-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-ink-950 border-b border-ink-800 text-xs text-ink-400 font-mono">
          <span>{activeLang === 'python' ? 'rag_from_scratch.py' : 'ragPipeline.ts'}</span>
          <span>{activeLang === 'python' ? 'Python 3.10+ (Standard Library)' : 'TypeScript (ES2022)'}</span>
        </div>

        <pre className="p-4 text-xs font-mono text-ink-300 overflow-x-auto whitespace-pre leading-relaxed max-h-[520px]">
          {activeLang === 'python' ? pythonCode : tsCode}
        </pre>
      </div>
    </div>
  );
};
