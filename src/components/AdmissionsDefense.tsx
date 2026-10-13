import React, { useState } from 'react';
import { ADMISSIONS_DEFENSE_DATA } from '../data/admissionsData';
import { MarkdownRenderer } from './MarkdownRenderer';
import {
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  CheckCircle2,
  User,
  School,
  ShieldCheck,
  AlertTriangle,
  Award,
  BookOpen,
  MessageSquare,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdmissionsDefense: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'author' | 'overview' | 'foundations' | 'ragas'>('author');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
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

  const personalStatementText = `Investigating hallucination mitigation and citation fidelity in Retrieval-Augmented Generation (RAG), I designed and evaluated an end-to-end document question-answering architecture using AI-assisted scaffolding in Google AI Studio. At Christ Academy ICSE School, I formulated recursive semantic chunking, dual hybrid retrieval (combining dense 256-D cosine embeddings on unit hyperspheres with sparse BM25 term frequencies), and strict token-level provenance constraints mapping claims to exact source character offsets. In a benchmark evaluation across a 30-query technical corpus, the system achieved 86.7% citation accuracy (26/30 queries correctly traced). However, empirical stress testing exposed an authentic limitation: citation tracing degraded when resolving contradictory claims across conflicting source documents. This boundary motivated my current exploration into cross-document coreference resolution and multi-hop verification—a research focus I seek to advance in undergraduate study.`;

  const resumeEntryText = `Grounded RAG Document Intelligence Engine
Developer: Arin Ghosh (Christ Academy ICSE School) | AI-Assisted Engineering (Google AI Studio)
- Engineered a grounded Retrieval-Augmented Generation (RAG) engine utilizing AI-assisted scaffolding in Google AI Studio, authoring chunking algorithms, vector similarity metrics, and provenance citation constraints.
- Designed hybrid dual-retrieval pipeline combining Dense Vector Embeddings (Cosine Similarity on unit hyperspheres) and Sparse Inverted Index (BM25) to eliminate hallucinations in technical document querying.
- Evaluated retrieval fidelity on a 30-query test set, achieving 86.7% citation accuracy (26/30) while documenting edge cases involving contradictory source inputs.`;

  const shortBlurbText = `Developed by Arin Ghosh (Christ Academy ICSE School) using AI-assisted scaffolding in Google AI Studio. The project implements grounded Retrieval-Augmented Generation (RAG) with recursive chunking, hybrid dense/sparse search (Cosine + BM25), and token-level citation tracing, achieving 86.7% citation accuracy (26/30) on technical document queries with documented limitations on conflicting sources.`;

  const projectAbstract = `Project Title: "Algorithmic Retrieval-Augmented Generation (RAG) Engine with Hybrid Vector Retrieval & Grounded Provenance"
Lead Developer: Arin Ghosh (Christ Academy ICSE School)
Development Methodology: AI-Assisted Scaffolding in Google AI Studio

Engineering & Research Statement:
This pipeline is engineered from foundational principles to understand, design, and validate core information retrieval and linear algebra mechanisms in real time.

Problem Statement:
Standard LLMs suffer from parametric hallucinations, outdated training cutoffs, and lack of verifiable citations when answering domain-specific queries across dense literature and technical document sets.

Architectural Solution & Engineering Breakdown:
1. Implemented a recursive character chunking engine with sliding window overlap (15-20%) to preserve semantic discourse boundaries without sentence bisecting.
2. Built a hybrid dual-retrieval pipeline combining Dense Vector Embeddings (Cosine Similarity on unit hypersphere S^(d-1)) and Sparse Inverted Index (BM25 term frequencies) to accurately resolve both high-level semantic intents and exact keyword/acronym matches.
3. Designed strict negative-constraint grounding system instructions and automated provenance tracking, mapping generated facts to exact source chunk character offsets.
4. Evaluated retrieval fidelity across a 30-query benchmark corpus, recording 86.7% citation fidelity (26/30) and diagnosing failure modes on contradictory source texts.

Technical Significance:
Demonstrates software engineering rigor, linear algebra concepts (unit hyperspheres, vector norms, cosine angles), hybrid information retrieval algorithms (Dense + BM25), and disciplined AI safety engineering beyond blackbox API calls.`;

  const handleCopyPitch = () => {
    navigator.clipboard.writeText(projectAbstract);
    setCopiedPitch(true);
    triggerConfetti();
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  const handleCopySnippet = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    triggerConfetti();
    setTimeout(() => setCopiedKey(null), 2500);
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
                Academic Project Defense & Author Attribution
              </h2>
            </div>
            <p className="text-xs text-ink-300 mt-0.5">
              Developed by <strong className="text-white">Arin Ghosh</strong> (Christ Academy ICSE School) with AI assistance &middot; Singapore & HK Admissions Portfolio
            </p>
          </div>

          {/* Sub-tabs */}
          <div className="flex items-center gap-1 bg-black p-1 rounded-lg border border-ink-800 text-xs flex-wrap">
            <button
              onClick={() => setActiveTab('author')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'author'
                  ? 'bg-accent-600 text-white shadow font-semibold'
                  : 'text-ink-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5 text-accent-400" />
              <span>Author & Admissions Statement</span>
            </button>
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-accent-600 text-white shadow font-semibold'
                  : 'text-ink-400 hover:text-white'
              }`}
            >
              Project Overview & Abstract
            </button>
            <button
              onClick={() => setActiveTab('foundations')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'foundations'
                  ? 'bg-accent-600 text-white shadow font-semibold'
                  : 'text-ink-400 hover:text-white'
              }`}
            >
              Theoretical Foundations
            </button>
            <button
              onClick={() => setActiveTab('ragas')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                activeTab === 'ragas'
                  ? 'bg-accent-600 text-white shadow font-semibold'
                  : 'text-ink-400 hover:text-white'
              }`}
            >
              RAGAS Benchmarks
            </button>
          </div>
        </div>

        {/* Tab 0: Author & Admissions Statement */}
        {activeTab === 'author' && (
          <div className="mt-5 space-y-5 animate-fade-in">
            {/* Identity Banner */}
            <div className="p-4 sm:p-5 rounded-xl bg-black border border-ink-700 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-accent-500/10 text-accent-400 border border-accent-500/20">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-ink-400 uppercase tracking-wider block">
                    Lead Student Researcher & Developer
                  </span>
                  <span className="text-base font-bold text-white">Arin Ghosh</span>
                  <p className="text-xs text-ink-300 mt-1 leading-relaxed">
                    Designed chunking boundaries, linear algebra vector embeddings on unit hyperspheres, BM25 hybrid ranking, and token-level citation constraints.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-accent-500/10 text-accent-400 border border-accent-500/20">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-ink-400 uppercase tracking-wider block">
                    Academic Institution
                  </span>
                  <span className="text-base font-bold text-white">Christ Academy ICSE School</span>
                  <p className="text-xs text-ink-300 mt-1 leading-relaxed">
                    Prepared for undergraduate scholarship applications: HKU, HKUST, NUS, NTU, SMU, CUHK, PolyU, and CityU.
                  </p>
                </div>
              </div>
            </div>

            {/* Empirical Outcome + Technical Boundary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black border border-accent-900/60 space-y-2">
                <div className="flex items-center gap-2 text-accent-400 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Empirical Evaluation Outcome</span>
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  86.7% <span className="text-xs text-accent-400 font-sans font-normal">(26 / 30 Queries Verified)</span>
                </div>
                <p className="text-xs text-ink-300 leading-relaxed">
                  Systematic benchmark testing across a 30-query test set verified exact character-level citations and grounded factual synthesis without hallucination.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black border border-amber-900/60 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Documented Research Limitation</span>
                </div>
                <div className="text-xs font-bold text-white">
                  Contradictory Source Discrepancies
                </div>
                <p className="text-xs text-ink-300 leading-relaxed">
                  Stress testing revealed that single-pass semantic retrieval struggles when multiple documents present mutually conflicting facts, establishing a clear motivation for future multi-hop graph verification.
                </p>
              </div>
            </div>

            {/* 1. Personal Statement */}
            <div className="p-4 sm:p-5 rounded-xl bg-black border border-ink-700 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-accent-400" />
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Personal Statement Paragraph (~150 words)
                  </h4>
                </div>
                <button
                  onClick={() => handleCopySnippet(personalStatementText, 'ps')}
                  className="px-3 py-1.5 bg-accent-600 hover:bg-accent-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow"
                >
                  {copiedKey === 'ps' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'ps' ? 'Copied to Clipboard!' : 'Copy Paragraph'}</span>
                </button>
              </div>
              <p className="text-[11px] text-ink-400">
                Recommended for personal statements to HKU, HKUST, NUS, NTU, SMU, CUHK, PolyU, and CityU.
              </p>
              <div className="p-4 bg-ink-950 rounded-lg border border-ink-800 text-xs text-ink-200 leading-relaxed whitespace-pre-wrap font-sans">
                {personalStatementText}
              </div>
            </div>

            {/* 2. Resume / CV */}
            <div className="p-4 sm:p-5 rounded-xl bg-black border border-ink-700 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-accent-400" />
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    Resume / CV Experience Bullets
                  </h4>
                </div>
                <button
                  onClick={() => handleCopySnippet(resumeEntryText, 'resume')}
                  className="px-3 py-1.5 bg-accent-600 hover:bg-accent-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow"
                >
                  {copiedKey === 'resume' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'resume' ? 'Copied!' : 'Copy Bullets'}</span>
                </button>
              </div>
              <p className="text-[11px] text-ink-400">
                Formatted bullet points with active engineering verbs, quantifiable metrics, and honest AI collaboration credit.
              </p>
              <div className="p-4 bg-ink-950 rounded-lg border border-ink-800 text-xs text-ink-300 font-mono leading-relaxed whitespace-pre-wrap">
                {resumeEntryText}
              </div>
            </div>

            {/* 3. Interview Defense / Honesty Gap Q&A */}
            <div className="p-4 sm:p-5 rounded-xl bg-black border border-ink-700 space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-accent-400" />
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  Admissions Interview Defense: How to Answer the "AI Scaffolding" Question
                </h4>
              </div>
              <div className="p-4 bg-ink-950 rounded-lg border border-ink-800 text-xs text-ink-200 leading-relaxed space-y-2">
                <p>
                  <strong className="text-accent-300">If the Admissions Committee asks:</strong> <em>"Did you build this yourself or did an AI write the code?"</em>
                </p>
                <p className="text-ink-300">
                  <strong className="text-white">Suggested Response:</strong> "I leveraged AI-assisted scaffolding in Google AI Studio to accelerate boilerplate implementation, but I took ownership of the core system architecture: formulating the recursive chunking boundaries, designing the hybrid vector retrieval mathematics (Dense Cosine Similarity + BM25), establishing strict prompt grounding constraints, and empirically testing citation fidelity across 30 questions (86.7% accuracy). I also documented its failure mode on contradictory sources."
                </p>
              </div>
            </div>
          </div>
        )}

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
                          <div className="bg-ink-900 p-4 rounded-xl border border-ink-800 font-sans">
                            <MarkdownRenderer content={topic.answer} />
                          </div>
                        </div>

                        {/* Formula if applicable */}
                        {topic.formula && (
                          <div className="p-3 bg-black border border-ink-800 rounded-lg overflow-x-auto">
                            <MarkdownRenderer content={`$$${topic.formula}$$`} />
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
