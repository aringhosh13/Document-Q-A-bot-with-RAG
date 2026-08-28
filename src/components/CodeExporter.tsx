import React, { useState } from 'react';
import { Copy, Check, Download, Terminal } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CodeExporter: React.FC = () => {
  const [activeLang, setActiveLang] = useState<'python' | 'typescript'>('python');
  const [copied, setCopied] = useState(false);

  const pythonCode = `"""
Document Q&A Bot with Retrieval-Augmented Generation (RAG) From Scratch
Portfolio Project for University Applications (NUS / NTU / SMU / SUTD)

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

        next_start = max(0, split_idx - chunk_overlap)
        if next_start < len(content) and split_idx < len(content):
            _split(content[next_start:], start_offset + next_start)

    _split(text, 0)
    return chunks

# ==============================================================================
# Step 2: Dense Vector Math & Cosine Similarity
# ==============================================================================
def l2_normalize(vec: List[float]) -> List[float]:
    norm = math.sqrt(sum(x * x for x in vec))
    if norm == 0:
        return vec
    return [x / norm for x in vec]

def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    if len(vec_a) != len(vec_b):
        return 0.0
    dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))
    denom = norm_a * norm_b
    return dot_product / denom if denom > 0 else 0.0

# ==============================================================================
# Step 3: Sparse Term Frequency (BM25)
# ==============================================================================
def compute_bm25_score(query: str, chunk: DocumentChunk, corpus: List[DocumentChunk], k1: float = 1.5, b: float = 0.75) -> float:
    q_tokens = re.findall(r'\\b[a-z0-9_]{2,}\\b', query.lower())
    if not q_tokens or not chunk.sparse_terms:
        return 0.0

    N = max(1, len(corpus))
    avg_len = sum(len(c.text.split()) for c in corpus) / N
    doc_len = len(chunk.text.split())

    score = 0.0
    for token in q_tokens:
        fq = chunk.sparse_terms.get(token, 0)
        if fq == 0:
            continue
        n_q = sum(1 for c in corpus if token in c.sparse_terms)
        idf = math.log((N - n_q + 0.5) / (n_q + 0.5) + 1.0)
        tf = (fq * (k1 + 1)) / (fq + k1 * (1 - b + b * (doc_len / avg_len)))
        score += idf * tf

    return min(1.0, max(0.0, score / (len(q_tokens) * 3.0)))

# ==============================================================================
# Step 4: Hybrid Dual Retrieval
# ==============================================================================
def hybrid_retrieve(
    query: str,
    query_vec: List[float],
    corpus: List[DocumentChunk],
    top_k: int = 4,
    alpha: float = 0.7
) -> List[Tuple[DocumentChunk, float]]:
    scored = []
    for chunk in corpus:
        dense_score = cosine_similarity(query_vec, chunk.vector) if chunk.vector else 0.0
        sparse_score = compute_bm25_score(query, chunk, corpus)
        combined = alpha * dense_score + (1.0 - alpha) * sparse_score
        scored.append((chunk, combined))

    scored.sort(key=lambda x: x[1], reverse=True)
    return scored[:top_k]

# ==============================================================================
# Step 5: Grounded Prompt Assembly
# ==============================================================================
def build_grounded_rag_prompt(question: str, retrieved_chunks: List[Tuple[DocumentChunk, float]]) -> Dict[str, str]:
    formatted_context = ""
    for idx, (chunk, score) in enumerate(retrieved_chunks):
        formatted_context += f"[Source {idx+1}] (Doc: '{chunk.doc_title}', Chunk #{chunk.chunk_index+1}, Relevance: {score*100:.1f}%):\\n{chunk.text}\\n---\\n"

    system_instruction = (
        "You are an academic Q&A Assistant built on strict RAG.\\n"
        "Rules:\\n"
        "1. Base your answer strictly on the provided Context sources.\\n"
        "2. Cite your sources in-line using brackets e.g. [Source 1].\\n"
        "3. If the context does not contain sufficient details, explicitly state the missing information."
    )

    user_prompt = f"CONTEXT SOURCES:\\n{formatted_context}\\n\\nQUESTION:\\n{question}\\n\\nAnswer:"

    return {"system_instruction": system_instruction, "user_prompt": user_prompt}

if __name__ == "__main__":
    sample_doc = "The Bachelor of Computing in Computer Science at NUS requires good passes in H2 Mathematics..."
    chunks = recursive_character_split(sample_doc, "NUS_CS_Handbook")
    print(f"[OK] Ingested & Chunked into {len(chunks)} chunks.")
`;

  const tsCode = `/**
 * Document Q&A Bot with RAG from Scratch (TypeScript)
 * Production-ready modular engine
 */
export interface DocumentChunk {
  id: string;
  docTitle: string;
  chunkIndex: number;
  text: string;
  charStart: number;
  charEnd: number;
  vector?: number[];
  sparseTerms?: Record<string, number>;
}

// 1. Recursive Character Splitter
export function recursiveSplit(text: string, title: string, chunkSize = 600, overlap = 100): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  const separators = ['\\n\\n', '\\n', '. ', ' '];

  function split(content: string, start: number) {
    if (content.length <= chunkSize) {
      chunks.push({
        id: \`\${title}-chunk-\${chunks.length + 1}\`,
        docTitle: title,
        chunkIndex: chunks.length,
        text: content.trim(),
        charStart: start,
        charEnd: start + content.length
      });
      return;
    }
    let splitIdx = chunkSize;
    for (const sep of separators) {
      const idx = content.lastIndexOf(sep, chunkSize);
      if (idx > chunkSize * 0.3) {
        splitIdx = idx + sep.length;
        break;
      }
    }
    chunks.push({
      id: \`\${title}-chunk-\${chunks.length + 1}\`,
      docTitle: title,
      chunkIndex: chunks.length,
      text: content.slice(0, splitIdx).trim(),
      charStart: start,
      charEnd: start + splitIdx
    });
    const nextStart = Math.max(0, splitIdx - overlap);
    if (nextStart < content.length && splitIdx < content.length) {
      split(content.slice(nextStart), start + nextStart);
    }
  }
  split(text, 0);
  return chunks;
}

// 2. Cosine Similarity
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}
`;

  const handleCopyCode = () => {
    const code = activeLang === 'python' ? pythonCode : tsCode;
    navigator.clipboard.writeText(code);
    setCopied(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
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
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-ink-900 rounded-xl border border-ink-800 p-5 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ink-800">
        <div>
          <h2 className="text-base font-bold text-ink-50 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-accent-400" />
            Source Code Exporter
          </h2>
          <p className="text-xs text-ink-500 mt-0.5">
            Self-contained algorithmic code for your GitHub portfolio
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 bg-ink-850 p-0.5 rounded-lg border border-ink-800 text-xs">
            <button
              onClick={() => setActiveLang('python')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeLang === 'python' ? 'bg-accent-500/15 text-accent-300' : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              Python
            </button>
            <button
              onClick={() => setActiveLang('typescript')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeLang === 'typescript' ? 'bg-accent-500/15 text-accent-300' : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              TypeScript
            </button>
          </div>

          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 bg-ink-800 hover:bg-ink-700 text-ink-200 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 border border-ink-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-1.5 bg-accent-600 hover:bg-accent-500 text-white rounded-md text-xs font-medium transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="relative bg-ink-950 border border-ink-800 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-ink-900 border-b border-ink-800 text-xs text-ink-500 font-mono">
          <span>{activeLang === 'python' ? 'rag_from_scratch.py' : 'ragPipeline.ts'}</span>
          <span>{activeLang === 'python' ? 'Python 3.10+' : 'TypeScript ES2022'}</span>
        </div>

        <pre className="p-4 text-xs font-mono text-ink-300 overflow-x-auto whitespace-pre leading-relaxed max-h-[520px]">
          {activeLang === 'python' ? pythonCode : tsCode}
        </pre>
      </div>
    </div>
  );
};
