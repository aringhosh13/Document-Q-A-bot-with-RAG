import React, { useState } from 'react';
import { ADMISSIONS_DEFENSE_DATA } from '../data/admissionsData';
import {
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdmissionsDefense: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'interview' | 'pitch' | 'ragas'>('interview');
  const [selectedUni, setSelectedUni] = useState<string>('ALL');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(
    ADMISSIONS_DEFENSE_DATA[0].id
  );
  const [copiedPitch, setCopiedPitch] = useState(false);

  const filteredTopics = ADMISSIONS_DEFENSE_DATA.filter(
    (t) => selectedUni === 'ALL' || t.university === selectedUni || t.university === 'General'
  );

  const triggerConfetti = () => {
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  const elevatorPitch = `Project: "Algorithmic RAG Engine with Hybrid Vector Retrieval & Zero-Hallucination Grounding"

Problem:
Standard LLMs suffer from parametric hallucinations, outdated training cutoffs, and lack of verifiable citations when answering domain-specific queries.

My Solution (built from scratch):
1. Custom recursive character chunking with sliding window overlap (15-20%) to preserve semantic boundaries.
2. Hybrid dual-retrieval: Dense Vector Embeddings (Cosine Similarity on unit hypersphere) + Sparse BM25 with Reciprocal Rank Fusion.
3. Strict negative-constraint grounding with automated provenance tracking to exact source chunk offsets.
4. RAGAS evaluation framework benchmarking Faithfulness, Answer Relevance, and Context Precision.

Technical Significance:
Demonstrates software engineering, linear algebra mastery (eigenvectors, PCA, cosine norms), information retrieval algorithms, and disciplined AI safety engineering beyond black-box API calls.`;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(elevatorPitch);
    setCopiedPitch(true);
    triggerConfetti();
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  const uniBadgeColor = (uni: string) => {
    switch (uni) {
      case 'Computer Science': return 'text-orange-400 border-orange-500/20 bg-orange-500/5';
      case 'AI & Data Science': return 'text-red-400 border-red-500/20 bg-red-500/5';
      case 'Information Systems': return 'text-blue-400 border-blue-500/20 bg-blue-500/5';
      case 'Systems & Design': return 'text-rose-400 border-rose-500/20 bg-rose-500/5';
      default: return 'text-accent-400 border-accent-500/20 bg-accent-500/5';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-ink-900 rounded-xl border border-ink-800 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ink-800">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-accent-400" />
              <h2 className="text-base font-bold text-ink-50">Admissions Defense Kit</h2>
            </div>
            <p className="text-xs text-ink-500 mt-0.5">
              Interview Q&A, portfolio pitch, and RAGAS metrics for CS / AI / IS / Systems
            </p>
          </div>

          <div className="flex items-center gap-0.5 bg-ink-850 p-0.5 rounded-lg border border-ink-800 text-xs">
            {([
              ['interview', 'Interview Q&A'],
              ['pitch', 'Portfolio Pitch'],
              ['ragas', 'RAGAS Metrics'],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  activeTab === key ? 'bg-accent-500/15 text-accent-300' : 'text-ink-400 hover:text-ink-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Interview Q&A */}
        {activeTab === 'interview' && (
          <div className="mt-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-ink-500 mr-1">Filter:</span>
                {['ALL', 'Computer Science', 'AI & Data Science', 'Information Systems', 'Systems & Design'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedUni(cat)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                      selectedUni === cat
                        ? 'bg-accent-500/15 text-accent-300 border border-accent-500/30'
                        : 'bg-ink-850 text-ink-400 hover:text-ink-200 border border-ink-800'
                    }`}
                  >
                    {cat === 'ALL' ? 'All' : cat}
                  </button>
                ))}
              </div>
              <span className="text-xs text-ink-600 font-mono">{filteredTopics.length} questions</span>
            </div>

            <div className="space-y-3">
              {filteredTopics.map((topic) => {
                const isExpanded = expandedTopicId === topic.id;
                return (
                  <div
                    key={topic.id}
                    className={`rounded-lg border transition-all ${
                      isExpanded
                        ? 'bg-ink-850 border-accent-500/40'
                        : 'bg-ink-850/60 border-ink-800 hover:border-ink-700'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                      className="w-full p-4 text-left flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${uniBadgeColor(topic.university)}`}>
                            {topic.university}
                          </span>
                          <span className="text-[10px] font-mono text-ink-500 bg-ink-900 px-2 py-0.5 rounded border border-ink-800">
                            {topic.category}
                          </span>
                          <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {topic.difficulty}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-semibold text-ink-100">{topic.question}</h4>
                      </div>
                      <div className="p-1 rounded bg-ink-900 text-ink-500 mt-1">
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-accent-400" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-4 sm:p-5 pt-0 border-t border-ink-800 space-y-4 animate-fade-in">
                        <div className="p-3 rounded-lg bg-accent-500/5 border border-accent-500/20 text-xs text-accent-200 flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-accent-300 font-semibold">What interviewers look for:</strong>{' '}
                            {topic.interviewerPerspective}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-ink-400 uppercase tracking-wider">Model Answer</div>
                          <div className="text-xs sm:text-sm text-ink-200 whitespace-pre-wrap leading-relaxed bg-ink-900 p-4 rounded-lg border border-ink-800">
                            {topic.answer}
                          </div>
                        </div>

                        {topic.formula && (
                          <div className="p-3 bg-ink-950 border border-ink-800 rounded-lg text-xs font-mono text-accent-400 overflow-x-auto">
                            ${topic.formula}$
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-semibold text-ink-500 mr-1">Key terms:</span>
                          {topic.keyTakeaways.map((k, idx) => (
                            <span key={idx} className="text-[10px] font-medium bg-ink-900 text-ink-300 px-2 py-0.5 rounded-full border border-ink-700">
                              {k}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Pitch */}
        {activeTab === 'pitch' && (
          <div className="mt-4 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-ink-50">3-Minute Portfolio Pitch</h3>
                <p className="text-xs text-ink-500">Ready-to-use project description for applications</p>
              </div>
              <button
                onClick={handleCopyPitch}
                className="px-3.5 py-1.5 bg-accent-600 hover:bg-accent-500 text-white rounded-md text-xs font-medium transition-all flex items-center gap-1.5"
              >
                {copiedPitch ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPitch ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="bg-ink-950 p-5 rounded-lg border border-ink-800 font-mono text-xs text-ink-300 whitespace-pre-wrap leading-relaxed">
              {elevatorPitch}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {[
                { title: '1. Motivation', color: 'text-accent-400', desc: 'Solves parametric memory limits of LLMs without expensive retraining.' },
                { title: '2. Math', color: 'text-ink-200', desc: 'Linear algebra: unit hypersphere L2 norms, dot products, PCA reduction.' },
                { title: '3. Hybrid Retrieval', color: 'text-emerald-400', desc: 'Dense Cosine + Sparse BM25 catches semantic intent and exact codes.' },
                { title: '4. Trust', color: 'text-rose-400', desc: 'Zero-hallucination constraints with inline provenance to character offsets.' },
              ].map((card, i) => (
                <div key={i} className="p-3.5 bg-ink-850 rounded-lg border border-ink-800 space-y-1">
                  <div className={`font-bold ${card.color}`}>{card.title}</div>
                  <p className="text-ink-500 leading-relaxed text-[11px]">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: RAGAS */}
        {activeTab === 'ragas' && (
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-ink-50">RAGAS Evaluation Framework</h3>
              <p className="text-xs text-ink-500">Objective measurement of RAG accuracy without subjective bias</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: '1. Faithfulness', tag: 'Generator', color: 'text-emerald-400', desc: 'Whether every atomic claim in the answer is entailed by retrieved context.', formula: 'Supported / Total Claims' },
                { title: '2. Answer Relevance', tag: 'End-to-End', color: 'text-accent-400', desc: 'Whether the response directly answers the query without tangents.', formula: 'cos(Embed(A), Embed(Q))' },
                { title: '3. Context Precision', tag: 'Retriever', color: 'text-ink-200', desc: 'Whether relevant chunks ranked at top (Rank #1, #2) not buried.', formula: 'Mean Average Precision' },
              ].map((metric, i) => (
                <div key={i} className="p-4 rounded-lg bg-ink-850 border border-ink-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-xs ${metric.color}`}>{metric.title}</span>
                    <span className="text-[10px] font-mono text-ink-600">{metric.tag}</span>
                  </div>
                  <p className="text-xs text-ink-300 leading-relaxed">{metric.desc}</p>
                  <div className="text-[11px] font-mono text-ink-400 bg-ink-950 p-2 rounded border border-ink-800">{metric.formula}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
