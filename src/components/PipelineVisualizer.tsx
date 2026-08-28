import React, { useState } from 'react';
import {
  FileText,
  Scissors,
  Binary,
  Database,
  Search,
  FileCode2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  Sliders,
  Code2,
} from 'lucide-react';

interface PipelineVisualizerProps {
  chunkCount: number;
  docCount: number;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({
  chunkCount,
  docCount,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      id: 1,
      title: '1. Document Ingestion',
      subtitle: 'Parsing & Extraction',
      icon: FileText,
      tag: 'Raw Data',
      color: 'from-blue-500 to-cyan-500',
      description:
        'Raw PDFs, Markdown handbooks, or plain text are ingested. Extract text streams, normalize whitespace, strip noisy formatting, and record document-level metadata (institution, word count, timestamps).',
      mathNote: 'D = \\{d_1, d_2, \\dots, d_M\\}',
      codeSample: `// Ingestion Pipeline
const rawText = await parsePdfFile(uploadedFile);
const sanitized = rawText.replace(/\\r\\n/g, '\\n').trim();
const document = { id: generateId(), content: sanitized, meta: { category: 'academic' } };`,
      bullets: [
        'Supports PDF token extraction via canvas/pdf.js',
        'Unicode sanitization & punctuation standardization',
        'Metadata attachment (Document ID, Title, Source URL)',
      ],
    },
    {
      id: 2,
      title: '2. Recursive Chunking',
      subtitle: 'Sliding Window Overlap',
      icon: Scissors,
      tag: 'Preprocessing',
      color: 'from-cyan-500 to-teal-500',
      description:
        'Splitting long documents into semantically coherent chunks using hierarchical separators: Paragraphs (\\n\\n) -> Sentences (\\n, . ) -> Words. A sliding overlap (15-20%) preserves boundary context across consecutive chunks.',
      mathNote: '\\text{Chunk}_{i} = \\text{Text}[s_i : s_i + L], \\quad s_{i+1} = s_i + L - \\text{Overlap}',
      codeSample: `// Recursive Character Chunking
function splitTextRecursively(text, chunkSize=600, overlap=100) {
  const separators = ['\\n\\n', '\\n', '. ', ' '];
  // Recursively bisect at largest semantic separator <= chunkSize
  return chunks;
}`,
      bullets: [
        'Preserves complete semantic units (paragraphs & bullet lists)',
        'Sliding window prevents named entities from getting cut in half',
        'Tracks character offsets [start..end] for exact UI highlighting',
      ],
    },
    {
      id: 3,
      title: '3. Vector Embedding',
      subtitle: 'Semantic Vectorization',
      icon: Binary,
      tag: 'Embedding Model',
      color: 'from-teal-500 to-emerald-500',
      description:
        'Each text chunk is mapped into a high-dimensional continuous vector space. Vectors capture deep semantic meaning so that synonyms ("tuition grant" and "financial fee subsidy") map to nearby coordinates.',
      mathNote: '\\mathbf{v} = \\text{Embed}(\\text{Chunk}), \\quad \\mathbf{u} = \\frac{\\mathbf{v}}{\\|\\mathbf{v}\\|_2} \\in \\mathbb{S}^{d-1}',
      codeSample: `// Dense Embedding & L2 Normalization
const vector = await ai.models.embedContent({
  model: 'gemini-embedding-2-preview',
  contents: chunk.text
});
const normalizedVector = vector / Math.sqrt(vector.reduce((a,b) => a + b*b, 0));`,
      bullets: [
        '256-D or 768-D dense representations',
        'L2 normalization standardizes vector lengths onto unit hypersphere',
        'Enables ultra-fast inner-product calculations',
      ],
    },
    {
      id: 4,
      title: '4. Vector Store & Indexing',
      subtitle: 'Nearest Neighbor Index',
      icon: Database,
      tag: 'Vector Storage',
      color: 'from-emerald-500 to-indigo-500',
      description:
        'Store chunk vectors alongside an inverted keyword index (BM25). At scale, Approximate Nearest Neighbor (ANN) graphs like HNSW (Hierarchical Navigable Small World) enable sub-10ms logarithmic query retrieval.',
      mathNote: '\\text{Search Complexity} = \\mathcal{O}(\\log N) \\quad \\text{[HNSW Index]}',
      codeSample: `// In-Memory Vector Store Index
class VectorStore {
  chunks: DocumentChunk[] = [];
  index: Float32Array; // Flattened matrix for matrix-vector multiplication
  search(queryVec, topK=4) { /* Cosine similarity ranking */ }
}`,
      bullets: [
        'Stores vector embeddings + sparse term frequency maps',
        'Zero external database lock-in: runs in-memory or on cloud vector databases',
        'Instant re-indexing when documents are updated',
      ],
    },
    {
      id: 5,
      title: '5. Hybrid Retrieval',
      subtitle: 'Cosine + BM25 Fusion',
      icon: Search,
      tag: 'Retrieval Engine',
      color: 'from-indigo-500 to-purple-500',
      description:
        'When the user asks a question, compute its query vector $\\mathbf{q}$. Retrieve Top-K chunks by combining Dense Cosine Similarity with Sparse BM25 keyword matching to catch exact course codes (e.g. "CS2103T") and GPA numbers.',
      mathNote: '\\text{Score} = \\alpha \\cdot \\cos(\\mathbf{q}, \\mathbf{v}) + (1-\\alpha) \\cdot \\text{BM25}(q, c)',
      codeSample: `// Hybrid Cosine & BM25 Scoring
const denseScore = dotProduct(queryVec, chunkVec); // (Cosine similarity)
const sparseScore = computeBM25(query, chunk, corpus);
const finalScore = 0.7 * denseScore + 0.3 * sparseScore;`,
      bullets: [
        'Solves dense bi-encoder blindness to exact alphanumeric codes',
        'Filters out irrelevant noise using minimum cosine thresholds',
        'Reranks top candidates to place highest signals at context edges',
      ],
    },
    {
      id: 6,
      title: '6. Prompt Grounding',
      subtitle: 'Hallucination Defense',
      icon: FileCode2,
      tag: 'Context Injection',
      color: 'from-purple-500 to-pink-500',
      description:
        'Assemble the retrieved Top-K chunks into a structured prompt wrapped with strict negative constraints ("Answer using ONLY the provided sources. Do not extrapolate.") and citation numbering.',
      mathNote: '\\mathcal{P} = \\text{SystemPrompt} \\oplus \\sum_{i=1}^K [\\text{Source } i: \\text{Chunk}_i] \\oplus \\text{UserQuery}',
      codeSample: `// Prompt Assembly with Zero-Hallucination Guardrails
const systemInstruction = \`Answer strictly using the provided context chunks.
Cite sources in brackets e.g. [Source 1]. If missing, admit lack of information.\`;
const userPrompt = \`CONTEXT:\\n\${formattedChunks}\\n\\nQUESTION:\\n\${question}\`;`,
      bullets: [
        'Zero-knowledge prompting prevents LLM confabulation',
        'Injects explicit document titles and chunk IDs',
        'Applies low generation temperature (T = 0.1 - 0.2)',
      ],
    },
    {
      id: 7,
      title: '7. Synthesis & Evaluation',
      subtitle: 'Grounded Output & RAGAS',
      icon: Sparkles,
      tag: 'Gemini 3.7 & Metrics',
      color: 'from-pink-500 to-rose-500',
      description:
        'Gemini generates a structured, factual answer with clickable citation tags. The output is evaluated using the RAG Triad: Faithfulness Score (no hallucinations), Answer Relevance, and Context Precision.',
      mathNote: '\\text{Faithfulness} = \\frac{\\text{Claims Supported by Context}}{\\text{Total Atomic Claims Generated}}',
      codeSample: `// LLM Generation with Telemetry
const response = await ai.models.generateContent({
  model: 'gemini-3.7-flash',
  contents: userPrompt,
  config: { systemInstruction, temperature: 0.2 }
});
// Automated Ragas Faithfulness verification`,
      bullets: [
        'Interactive citation badges linking directly to raw text in document viewer',
        'Automated Faithfulness and Context Precision scorecard',
        'Full latency telemetry: Retrieval ms vs Generation ms',
      ],
    },
  ];

  const currentStep = steps.find((s) => s.id === activeStep) || steps[0];

  return (
    <div className="space-y-6">
      {/* Interactive Step Navigator Banner */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-cyan-400" />
              RAG Architecture Pipeline & Mechanics
            </h2>
            <p className="text-xs text-slate-400">
              Interactive 7-stage walkthrough of the Grounded Retrieval-Augmented Generation pipeline
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1.5 rounded-lg border border-cyan-800">
            <span>{docCount} Documents</span>
            <span>&rarr;</span>
            <span>{chunkCount} Vectorized Chunks</span>
          </div>
        </div>

        {/* Step Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mt-4">
          {steps.map((step) => {
            const Icon = step.icon;
            const isSelected = activeStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/90 border-cyan-500 shadow-md ring-1 ring-cyan-500/40'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-bold font-mono ${
                      isSelected ? 'text-cyan-400' : 'text-slate-500'
                    }`}
                  >
                    0{step.id}
                  </span>
                </div>

                <div className="mt-3">
                  <div
                    className={`text-xs font-bold leading-tight ${
                      isSelected ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {step.title.split('. ')[1]}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                    {step.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Step Details Card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Explanation & Formula (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
              Stage 0{currentStep.id} / 07
            </span>
            <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
              {currentStep.tag}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white">{currentStep.title}: {currentStep.subtitle}</h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentStep.description}
          </p>

          {/* Mathematical formulation card */}
          {currentStep.mathNote && (
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <div className="text-[10px] font-bold font-mono uppercase text-slate-400 tracking-wider">
                Mathematical Formalism
              </div>
              <div className="text-xs sm:text-sm font-mono text-cyan-400 py-1 overflow-x-auto">
                ${currentStep.mathNote}$
              </div>
            </div>
          )}

          {/* Key Bullet Points */}
          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Key Engineering Implementation Details:
            </h4>
            <div className="space-y-1.5">
              {currentStep.bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next / Previous Controls */}
          <div className="flex items-center gap-3 pt-3">
            <button
              disabled={activeStep === 1}
              onClick={() => setActiveStep(activeStep - 1)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs text-slate-300 font-medium transition-all"
            >
              &larr; Previous Stage
            </button>
            <button
              disabled={activeStep === steps.length}
              onClick={() => setActiveStep(activeStep + 1)}
              className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-xs text-white font-medium transition-all flex items-center gap-1 shadow"
            >
              <span>Next Stage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Code Snippet (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Implementation Blueprint</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">TypeScript / Python</span>
          </div>

          <pre className="text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed flex-1 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
            {currentStep.codeSample}
          </pre>

          <div className="text-[11px] text-slate-500 font-mono">
            Zero third-party framework lock-in &middot; Pure algorithmic implementation
          </div>
        </div>
      </div>
    </div>
  );
};
