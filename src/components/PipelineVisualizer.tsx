import React, { useState } from 'react';
import { FileText, Scissors, Binary, Database, Search, FileCode2, Sparkles, ArrowRight, CircleCheck as CheckCircle2, Code as Code2 } from 'lucide-react';

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
      title: 'Document Ingestion',
      subtitle: 'Parsing & Extraction',
      icon: FileText,
      tag: 'Raw Data',
      description:
        'Raw PDFs, Markdown handbooks, or plain text are ingested. Text streams are extracted, whitespace normalized, and metadata recorded (institution, word count, timestamps).',
      mathNote: 'D = \\{d_1, d_2, \\dots, d_M\\}',
      codeSample: `const rawText = await parsePdfFile(uploadedFile);
const sanitized = rawText.replace(/\\r\\n/g, '\\n').trim();
const document = { id, content: sanitized, meta };`,
      bullets: [
        'PDF extraction via pdf.js canvas rendering',
        'Unicode sanitization & punctuation normalization',
        'Metadata attachment (ID, title, source)',
      ],
    },
    {
      id: 2,
      title: 'Recursive Chunking',
      subtitle: 'Sliding Window Overlap',
      icon: Scissors,
      tag: 'Preprocessing',
      description:
        'Documents are split into semantically coherent chunks using hierarchical separators: paragraphs (\\n\\n) → sentences (\\n, . ) → words. A 15-20% sliding overlap preserves boundary context.',
      mathNote: '\\text{Chunk}_{i} = \\text{Text}[s_i : s_i + L]',
      codeSample: `function splitTextRecursively(text, size=600, overlap=100) {
  const seps = ['\\n\\n', '\\n', '. ', ' '];
  // Bisect at largest semantic separator <= size
  return chunks;
}`,
      bullets: [
        'Preserves complete semantic units',
        'Sliding window prevents entity bisection',
        'Tracks character offsets for highlighting',
      ],
    },
    {
      id: 3,
      title: 'Vector Embedding',
      subtitle: 'Semantic Vectorization',
      icon: Binary,
      tag: 'Embedding',
      description:
        'Each chunk is mapped into a high-dimensional continuous vector space. Vectors capture semantic meaning so synonyms like "tuition grant" and "fee subsidy" land at nearby coordinates.',
      mathNote: '\\mathbf{u} = \\frac{\\text{Embed}(\\text{chunk})}{\\|\\text{Embed}(\\text{chunk})\\|_2} \\in \\mathbb{S}^{d-1}',
      codeSample: `const vector = await ai.models.embedContent({
  model: 'gemini-embedding-2-preview',
  contents: chunk.text
});
const normalized = vector / l2norm(vector);`,
      bullets: [
        '256-D dense semantic representations',
        'L2 normalization onto unit hypersphere',
        'Enables fast inner-product similarity',
      ],
    },
    {
      id: 4,
      title: 'Vector Store',
      subtitle: 'Nearest Neighbor Index',
      icon: Database,
      tag: 'Storage',
      description:
        'Chunk vectors are stored alongside an inverted keyword index (BM25). At scale, ANN graphs like HNSW enable sub-10ms logarithmic retrieval.',
      mathNote: '\\text{Search} = \\mathcal{O}(\\log N) \\quad \\text{[HNSW]}',
      codeSample: `class VectorStore {
  chunks: DocumentChunk[] = [];
  search(queryVec, topK=4) {
    // Cosine similarity ranking
  }
}`,
      bullets: [
        'Dense vectors + sparse term frequency maps',
        'In-memory or cloud vector database',
        'Instant re-indexing on updates',
      ],
    },
    {
      id: 5,
      title: 'Hybrid Retrieval',
      subtitle: 'Cosine + BM25 Fusion',
      icon: Search,
      tag: 'Retrieval',
      description:
        'The query vector retrieves Top-K chunks by combining Dense Cosine Similarity with Sparse BM25 keyword matching — catching both semantic intent and exact course codes or GPA numbers.',
      mathNote: '\\text{Score} = \\alpha \\cdot \\cos(\\mathbf{q}, \\mathbf{v}) + (1-\\alpha) \\cdot \\text{BM25}(q, c)',
      codeSample: `const dense = cosineSimilarity(queryVec, chunkVec);
const sparse = computeBM25(query, chunk, corpus);
const score = 0.7 * dense + 0.3 * sparse;`,
      bullets: [
        'Dense excels at conceptual matching',
        'BM25 catches exact alphanumeric codes',
        'Reciprocal Rank Fusion combines lists',
      ],
    },
    {
      id: 6,
      title: 'Prompt Grounding',
      subtitle: 'Hallucination Defense',
      icon: FileCode2,
      tag: 'Context Injection',
      description:
        'Retrieved Top-K chunks are assembled into a structured prompt wrapped with strict constraints: "Answer using ONLY the provided sources. Do not extrapolate." Citations are numbered.',
      mathNote: '\\mathcal{P} = \\text{System} \\oplus \\sum_{i=1}^K [\\text{Source } i] \\oplus \\text{Query}',
      codeSample: `const system = \`Answer strictly using provided context.
Cite sources as [Source 1]. If missing, say so.\`;
const prompt = \`CONTEXT:\\n\${chunks}\\n\\nQ:\\n\${question}\`;`,
      bullets: [
        'Zero-knowledge prompting prevents confabulation',
        'Injects document titles and chunk IDs',
        'Low temperature (T = 0.1–0.2)',
      ],
    },
    {
      id: 7,
      title: 'Synthesis & Evaluation',
      subtitle: 'Grounded Output & RAGAS',
      icon: Sparkles,
      tag: 'Generation',
      description:
        'Gemini generates a structured answer with clickable citation tags. Output is evaluated using the RAG Triad: Faithfulness, Answer Relevance, and Context Precision.',
      mathNote: '\\text{Faithfulness} = \\frac{\\text{Supported Claims}}{\\text{Total Claims}}',
      codeSample: `const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: prompt,
  config: { systemInstruction, temperature: 0.2 }
});`,
      bullets: [
        'Interactive citation badges link to source text',
        'Automated Faithfulness scorecard',
        'Full latency telemetry',
      ],
    },
  ];

  const currentStep = steps.find((s) => s.id === activeStep) || steps[0];

  return (
    <div className="space-y-6">
      {/* Step Navigator */}
      <div className="bg-ink-900 rounded-xl border border-ink-800 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-ink-800">
          <div>
            <h2 className="text-sm font-bold text-ink-50 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-accent-400" />
              RAG Pipeline Architecture
            </h2>
            <p className="text-xs text-ink-500 mt-0.5">
              7-stage walkthrough of retrieval-augmented generation
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-accent-400 bg-accent-500/10 px-3 py-1.5 rounded-md border border-accent-500/20">
            <span>{docCount} docs</span>
            <span className="text-ink-600">→</span>
            <span>{chunkCount} chunks</span>
          </div>
        </div>

        {/* Step buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mt-4">
          {steps.map((step) => {
            const Icon = step.icon;
            const isSelected = activeStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-accent-500/10 border-accent-500/40 ring-1 ring-accent-500/20'
                    : 'bg-ink-850 border-ink-800 hover:border-ink-700 hover:bg-ink-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
                    isSelected ? 'bg-accent-500 text-ink-950' : 'bg-ink-800 text-ink-400'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-accent-400' : 'text-ink-600'}`}>
                    0{step.id}
                  </span>
                </div>
                <div className="mt-2.5">
                  <div className={`text-xs font-semibold leading-tight ${isSelected ? 'text-ink-50' : 'text-ink-300'}`}>
                    {step.title}
                  </div>
                  <div className="text-[10px] text-ink-500 mt-0.5 truncate">{step.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Detail */}
      <div className="bg-ink-900 rounded-xl border border-ink-800 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-accent-500/10 text-accent-400 border border-accent-500/20">
              Stage 0{currentStep.id}/07
            </span>
            <span className="text-xs text-ink-500 font-mono uppercase tracking-wider">{currentStep.tag}</span>
          </div>

          <h3 className="text-base font-bold text-ink-50">{currentStep.title}: {currentStep.subtitle}</h3>

          <p className="text-sm text-ink-300 leading-relaxed">{currentStep.description}</p>

          {currentStep.mathNote && (
            <div className="p-3.5 bg-ink-950 border border-ink-800 rounded-lg">
              <div className="text-[10px] font-mono uppercase text-ink-600 tracking-wider mb-1">Formalism</div>
              <div className="text-sm font-mono text-accent-400 overflow-x-auto">${currentStep.mathNote}$</div>
            </div>
          )}

          <div className="space-y-2 pt-1">
            <h4 className="text-xs font-semibold text-ink-400 uppercase tracking-wider">Implementation Details</h4>
            <div className="space-y-1.5">
              {currentStep.bullets.map((b, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-ink-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-3">
            <button
              disabled={activeStep === 1}
              onClick={() => setActiveStep(activeStep - 1)}
              className="px-3.5 py-1.5 rounded-md bg-ink-800 hover:bg-ink-700 disabled:opacity-40 text-xs text-ink-300 font-medium transition-all"
            >
              ← Previous
            </button>
            <button
              disabled={activeStep === steps.length}
              onClick={() => setActiveStep(activeStep + 1)}
              className="px-4 py-1.5 rounded-md bg-accent-600 hover:bg-accent-500 disabled:opacity-40 text-xs text-white font-medium transition-all flex items-center gap-1"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Code panel */}
        <div className="lg:col-span-5 bg-ink-950 border border-ink-800 rounded-lg p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-ink-800">
            <div className="flex items-center gap-2 text-xs font-mono text-ink-400">
              <Code2 className="w-3.5 h-3.5 text-accent-400" />
              <span>Implementation</span>
            </div>
            <span className="text-[10px] font-mono text-ink-600">TS / Python</span>
          </div>

          <pre className="text-xs font-mono text-ink-300 overflow-x-auto whitespace-pre-wrap leading-relaxed flex-1 bg-ink-900/60 p-3 rounded border border-ink-800">
            {currentStep.codeSample}
          </pre>

          <div className="text-[11px] text-ink-600 font-mono">
            Zero framework lock-in · Pure algorithmic implementation
          </div>
        </div>
      </div>
    </div>
  );
};
