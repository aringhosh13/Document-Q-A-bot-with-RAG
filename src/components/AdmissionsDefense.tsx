import React, { useState } from 'react';
import { ADMISSIONS_DEFENSE_DATA } from '../data/admissionsData';
import { AdmissionsTopic } from '../types';
import {
  GraduationCap,
  Award,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  School,
  FileCheck,
  TrendingUp,
  Copy,
  Check,
  Zap,
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
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const elevatorPitch = `Project Title: "Algorithmic Retrieval-Augmented Generation (RAG) Engine with Hybrid Vector Retrieval & Zero-Hallucination Grounding"

Problem Statement:
Standard LLMs suffer from severe parametric hallucinations, outdated training cutoffs, and lack of verifiable citations when answering domain-specific queries (e.g. academic admissions policies, curriculum handbooks, and complex technical literature).

My Architectural Solution from Scratch:
1. Implemented a custom recursive character chunking engine with sliding window overlap (15-20%) to preserve semantic discourse boundaries without sentence bisecting.
2. Built a hybrid dual-retrieval pipeline combining Dense Vector Embeddings (Cosine Similarity on unit hypersphere S^(d-1)) and Sparse Inverted Index (BM25 term frequencies) with Reciprocal Rank Fusion to accurately resolve both high-level semantic intents and exact course codes/GPA cutoffs.
3. Designed strict negative-constraint grounding system instructions and automated provenance tracking, mapping generated facts to exact source chunk character offsets.
4. Integrated the RAGAS evaluation framework to benchmark Faithfulness, Answer Relevance, and Context Precision.

Technical Significance for Admissions Committees:
Demonstrates foundational software engineering, linear algebra mastery (eigenvectors, PCA, cosine norms), information retrieval algorithms, and disciplined AI safety engineering beyond blackbox API calls.`;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(elevatorPitch);
    setCopiedPitch(true);
    triggerConfetti();
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                Academic Admissions & Technical Defense Kit
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Curated for Computer Science, AI & Data Science, Information Systems, and Systems Design interviews & portfolio defenses
            </p>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('interview')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'interview'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Interview Q&A (12+)
            </button>
            <button
              onClick={() => setActiveTab('pitch')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'pitch'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Portfolio Pitch Deck
            </button>
            <button
              onClick={() => setActiveTab('ragas')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'ragas'
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              RAGAS Metrics
            </button>
          </div>
        </div>

        {/* Tab 1: Interview Q&A */}
        {activeTab === 'interview' && (
          <div className="mt-4 space-y-4">
            {/* Category Filter */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 mr-1">Filter by Discipline:</span>
                {['ALL', 'Computer Science', 'AI & Data Science', 'Information Systems', 'Systems & Design'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedUni(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedUni === cat
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {filteredTopics.length} Curated Questions
              </span>
            </div>

            {/* Questions Accordion */}
            <div className="space-y-3">
              {filteredTopics.map((topic) => {
                const isExpanded = expandedTopicId === topic.id;
                const uniBadgeColor =
                  topic.university === 'Computer Science'
                    ? 'bg-orange-950 text-orange-400 border-orange-800'
                    : topic.university === 'AI & Data Science'
                    ? 'bg-red-950 text-red-400 border-red-800'
                    : topic.university === 'Information Systems'
                    ? 'bg-blue-950 text-blue-400 border-blue-800'
                    : topic.university === 'Systems & Design'
                    ? 'bg-rose-950 text-rose-400 border-rose-800'
                    : 'bg-cyan-950 text-cyan-400 border-cyan-800';

                return (
                  <div
                    key={topic.id}
                    className={`rounded-xl border transition-all ${
                      isExpanded
                        ? 'bg-slate-950 border-cyan-500/80 shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
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
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${uniBadgeColor}`}
                          >
                            {topic.university}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {topic.category}
                          </span>
                          <span className="text-[10px] font-medium text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/60">
                            {topic.difficulty}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-semibold text-white">
                          {topic.question}
                        </h4>
                      </div>

                      <div className="p-1 rounded bg-slate-900 text-slate-400 mt-1">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-4 sm:p-5 pt-0 border-t border-slate-800/80 space-y-4 animate-in fade-in duration-200">
                        {/* Interviewer perspective insight box */}
                        <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-xs text-cyan-200 flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-cyan-300 font-semibold">
                              What Interviewers & Professors Look For:
                            </strong>{' '}
                            {topic.interviewerPerspective}
                          </div>
                        </div>

                        {/* Model Answer */}
                        <div className="space-y-2">
                          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                            Model Technical Defense Answer:
                          </div>
                          <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed space-y-2 bg-slate-900 p-4 rounded-xl border border-slate-800 font-sans">
                            {topic.answer}
                          </div>
                        </div>

                        {/* Formula if applicable */}
                        {topic.formula && (
                          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-cyan-400 overflow-x-auto">
                            ${topic.formula}$
                          </div>
                        )}

                        {/* Key takeaways bullet tags */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] font-bold text-slate-400 mr-1">
                            Key Buzzwords:
                          </span>
                          {topic.keyTakeaways.map((k, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold bg-slate-900 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700"
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

        {/* Tab 2: Portfolio Pitch Deck */}
        {activeTab === 'pitch' && (
          <div className="mt-4 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  3-Minute Admissions Portfolio Pitch & Personal Statement Abstract
                </h3>
                <p className="text-xs text-slate-400">
                  Ready-to-use project description for university application write-ups and resume portfolio
                </p>
              </div>

              <button
                onClick={handleCopyPitch}
                className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shadow"
              >
                {copiedPitch ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPitch ? 'Copied to Clipboard!' : 'Copy Pitch'}</span>
              </button>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
              {elevatorPitch}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="text-cyan-400 font-bold">1. Motivation</div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Solves the critical parametric memory limits of LLMs without multi-million dollar model retraining.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="text-indigo-400 font-bold">2. Math Foundations</div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Built on Linear Algebra: Unit hypersphere L2 normalization, dot products, and PCA dimensional reduction.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="text-emerald-400 font-bold">3. Hybrid Retrieval</div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Combines Dense Cosine Vectors with Sparse BM25 to catch both semantic intent and exact alphanumeric codes.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="text-rose-400 font-bold">4. Trust & Citations</div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Strict zero-hallucination negative constraints with direct in-line provenance tags down to character slices.
                </p>
              </div>
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
              <p className="text-xs text-slate-400">
                How to objectively measure and benchmark RAG accuracy without subjective human bias
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-400">1. Faithfulness</span>
                  <span className="text-[10px] font-mono text-slate-500">Generator Quality</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Measures whether every single atomic claim in the generated answer is mathematically entailed by the retrieved context chunks.
                </p>
                <div className="text-[11px] font-mono text-slate-400 bg-slate-900 p-2 rounded">
                  Score = (Supported Claims) / (Total Claims)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-cyan-400">2. Answer Relevance</span>
                  <span className="text-[10px] font-mono text-slate-500">End-to-End Metric</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Measures whether the synthesized response directly answers the user query without rambling or introducing extraneous topics.
                </p>
                <div className="text-[11px] font-mono text-slate-400 bg-slate-900 p-2 rounded">
                  Score = cos(Embed(Answer), Embed(Query))
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-indigo-400">3. Context Precision</span>
                  <span className="text-[10px] font-mono text-slate-500">Retriever Quality</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Measures whether the relevant ground-truth chunks were ranked at the very top (Rank #1, #2) rather than buried at the bottom.
                </p>
                <div className="text-[11px] font-mono text-slate-400 bg-slate-900 p-2 rounded">
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
