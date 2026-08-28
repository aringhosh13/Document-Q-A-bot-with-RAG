import React, { useState } from 'react';
import { ADMISSIONS_DEFENSE_DATA } from '../data/admissionsData';
import {
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdmissionsDefense: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'foundations' | 'ragas'>('overview');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('ALL');
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(
    ADMISSIONS_DEFENSE_DATA[0]?.id || null
  );
  const [copiedPitch, setCopiedPitch] = useState(false);

  const filteredTopics = ADMISSIONS_DEFENSE_DATA.filter(
    (t) => selectedDiscipline === 'ALL' || t.university === selectedDiscipline || t.university === 'General'
  );

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const projectAbstract = `Project Title: "Algorithmic Retrieval-Augmented Generation (RAG) Engine with Hybrid Vector Retrieval & Grounded Provenance"

Engineering & Research Statement:
This pipeline is engineered from foundational principles to understand, design, and validate core information retrieval and linear algebra mechanisms in real time.

Problem Statement:
Standard LLMs suffer from parametric hallucinations, outdated training cutoffs, and lack of verifiable citations when answering domain-specific queries across dense literature and technical document sets.

Architectural Solution & Engineering Breakdown:
1. Implemented a recursive character chunking engine with sliding window overlap (15-20%) to preserve semantic discourse boundaries without sentence bisecting.
2. Built a hybrid dual-retrieval pipeline combining Dense Vector Embeddings (Cosine Similarity on unit hypersphere S^(d-1)) and Sparse Inverted Index (BM25 term frequencies) to accurately resolve both high-level semantic intents and exact keyword/acronym matches.
3. Designed strict negative-constraint grounding system instructions and automated provenance tracking, mapping generated facts to exact source chunk character offsets.
4. Integrated the RAGAS evaluation framework to benchmark Faithfulness, Answer Relevance, and Context Precision.

Technical Significance:
Demonstrates software engineering rigor, linear algebra concepts (unit hyperspheres, vector norms, cosine angles), hybrid information retrieval algorithms (Dense + BM25), and disciplined AI safety engineering beyond blackbox API calls.`;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(projectAbstract);
    setCopiedPitch(true);
    triggerConfetti();
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-ink-900 rounded-xl border border-ink-800 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ink-800">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-accent-400" />
              <h2 className="text-base sm:text-lg font-bold text-white font-sans">
                Academic Project Defense & System Architecture
              </h2>
            </div>
            <p className="text-xs text-ink-400 mt-0.5">
              Theoretical foundations, algorithmic design, mathematical formalisms, and RAGAS benchmark evaluation
            </p>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-1 bg-black p-1 rounded-lg border border-ink-800 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-accent-600 text-white shadow'
                  : 'text-ink-400 hover:text-white'
              }`}
            >
              Project Overview & Abstract
            </button>
            <button
              onClick={() => setActiveTab('foundations')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'foundations'
                  ? 'bg-accent-600 text-white shadow'
                  : 'text-ink-400 hover:text-white'
              }`}
            >
              Theoretical Foundations
            </button>
            <button
              onClick={() => setActiveTab('ragas')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'ragas'
                  ? 'bg-accent-600 text-white shadow'
                  : 'text-ink-400 hover:text-white'
              }`}
            >
              RAGAS Benchmarks
            </button>
          </div>
        </div>

        {/* Tab 1: Project Overview & Abstract */}
        {activeTab === 'overview' && (
          <div className="mt-4 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Academic Project Abstract & Engineering Specification
                </h3>
                <p className="text-xs text-ink-400">
                  Comprehensive summary of system design, algorithmic motivations, and information retrieval mechanics
                </p>
              </div>

              <button
                onClick={handleCopyPitch}
                className="px-3.5 py-1.5 bg-accent-600 hover:bg-accent-500 text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shadow"
              >
                {copiedPitch ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPitch ? 'Copied to Clipboard!' : 'Copy Abstract'}</span>
              </button>
            </div>

            <div className="bg-black p-5 rounded-xl border border-ink-800 font-mono text-xs text-ink-300 whitespace-pre-wrap leading-relaxed">
              {projectAbstract}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-black rounded-xl border border-ink-800 space-y-1">
                <div className="text-accent-400 font-bold">1. Problem Formulation</div>
                <p className="text-ink-400 leading-relaxed text-[11px]">
                  Mitigates parametric memory limits and hallucinations in LLMs without prohibitive GPU model retraining costs.
                </p>
              </div>

              <div className="p-3.5 bg-black rounded-xl border border-ink-800 space-y-1">
                <div className="text-accent-400 font-bold">2. Mathematical Rigor</div>
                <p className="text-ink-400 leading-relaxed text-[11px]">
                  Rooted in linear algebra: L2 unit hypersphere normalization, inner product angles, and PCA projection.
                </p>
              </div>

              <div className="p-3.5 bg-black rounded-xl border border-ink-800 space-y-1">
                <div className="text-accent-400 font-bold">3. Hybrid Retrieval</div>
                <p className="text-ink-400 leading-relaxed text-[11px]">
                  Dual retrieval fusion: dense vector embeddings with sparse BM25 term weighting to capture intent and exact identifiers.
                </p>
              </div>

              <div className="p-3.5 bg-black rounded-xl border border-ink-800 space-y-1">
                <div className="text-accent-400 font-bold">4. Verifiable Provenance</div>
                <p className="text-ink-400 leading-relaxed text-[11px]">
                  Strict negative constraints with verifiable in-line citation tags linked directly to source character spans.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Theoretical Foundations & Architecture Analysis */}
        {activeTab === 'foundations' && (
          <div className="mt-4 space-y-4">
            {/* Discipline Filter */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-ink-400 mr-1">Filter by Discipline:</span>
                {['ALL', 'Computer Science', 'AI & Data Science', 'Information Systems', 'Systems & Design'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedDiscipline(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedDiscipline === cat
                        ? 'bg-accent-600 text-white'
                        : 'bg-black text-ink-400 hover:text-white border border-ink-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <span className="text-xs text-ink-500 font-mono">
                {filteredTopics.length} Core Analysis Modules
              </span>
            </div>

            {/* Topics Accordion */}
            <div className="space-y-3">
              {filteredTopics.map((topic) => {
                const isExpanded = expandedTopicId === topic.id;

                return (
                  <div
                    key={topic.id}
                    className={`rounded-xl border transition-all ${
                      isExpanded
                        ? 'bg-black border-accent-500/80 shadow-lg'
                        : 'bg-black/60 border-ink-800 hover:border-ink-700'
                    }`}
                  >
                    <button
                      onClick={() =>
                        setExpandedTopicId(isExpanded ? null : topic.id)
                      }
                      className="w-full p-4 text-left flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-accent-950 text-accent-400 border-accent-800">
                            {topic.university}
                          </span>
                          <span className="text-[10px] font-mono text-ink-400 bg-ink-900 px-2 py-0.5 rounded border border-ink-800">
                            {topic.category}
                          </span>
                          <span className="text-[10px] font-medium text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                            {topic.difficulty}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-semibold text-white">
                          {topic.question}
                        </h4>
                      </div>

                      <div className="p-1 rounded bg-ink-900 text-ink-400 mt-1">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-accent-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-4 sm:p-5 pt-0 border-t border-ink-800 space-y-4 animate-fade-in">
                        {/* Research Focus & Key Architectural Insight */}
                        <div className="p-3 rounded-lg bg-accent-950/40 border border-accent-800/50 text-xs text-accent-200 flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-accent-300 font-semibold">
                              Academic Significance & Core Principles:
                            </strong>{' '}
                            {topic.academicSignificance}
                          </div>
                        </div>

                        {/* Model Technical Analysis */}
                        <div className="space-y-2">
                          <div className="text-xs font-bold text-ink-300 uppercase tracking-wider">
                            Theoretical & Architectural Formulation:
                          </div>
                          <div className="text-xs sm:text-sm text-ink-200 whitespace-pre-wrap leading-relaxed space-y-2 bg-ink-900 p-4 rounded-xl border border-ink-800 font-sans">
                            {topic.answer}
                          </div>
                        </div>

                        {/* Formula if applicable */}
                        {topic.formula && (
                          <div className="p-3 bg-ink-900 border border-ink-800 rounded-lg text-xs font-mono text-accent-400 overflow-x-auto">
                            ${topic.formula}$
                          </div>
                        )}

                        {/* Key concepts bullet tags */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-bold text-ink-400 mr-1">
                            Key Theoretical Takeaways:
                          </span>
                          {topic.keyTakeaways.map((k, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold bg-ink-900 text-ink-300 px-2 py-0.5 rounded-full border border-ink-800"
                            >
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

        {/* Tab 3: RAGAS Benchmark Suite */}
        {activeTab === 'ragas' && (
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white">
                RAGAS (Retrieval Augmented Generation Assessment) Framework
              </h3>
              <p className="text-xs text-ink-400">
                Objective evaluation metrics and benchmark methodologies for quantifying RAG accuracy
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-black border border-ink-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-accent-400">1. Faithfulness</span>
                  <span className="text-[10px] font-mono text-ink-500">Generator Quality</span>
                </div>
                <p className="text-xs text-ink-300 leading-relaxed">
                  Measures whether every single atomic claim in the generated answer is mathematically entailed by the retrieved context chunks.
                </p>
                <div className="text-[11px] font-mono text-ink-400 bg-ink-900 p-2 rounded border border-ink-800">
                  Score = (Supported Claims) / (Total Claims)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black border border-ink-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-accent-400">2. Answer Relevance</span>
                  <span className="text-[10px] font-mono text-ink-500">End-to-End Metric</span>
                </div>
                <p className="text-xs text-ink-300 leading-relaxed">
                  Measures whether the synthesized response directly answers the user query without rambling or introducing extraneous topics.
                </p>
                <div className="text-[11px] font-mono text-ink-400 bg-ink-900 p-2 rounded border border-ink-800">
                  Score = cos(Embed(Answer), Embed(Query))
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black border border-ink-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-accent-400">3. Context Precision</span>
                  <span className="text-[10px] font-mono text-ink-500">Retriever Quality</span>
                </div>
                <p className="text-xs text-ink-300 leading-relaxed">
                  Measures whether the relevant ground-truth chunks were ranked at the very top (Rank #1, #2) rather than buried at the bottom.
                </p>
                <div className="text-[11px] font-mono text-ink-400 bg-ink-900 p-2 rounded border border-ink-800">
                  Score = Mean Average Precision (mAP)
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
