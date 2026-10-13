import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  GraduationCap,
  Sparkles,
  School,
  User,
  ShieldCheck,
  AlertTriangle,
  Award,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthorStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthorStatementModal: React.FC<AuthorStatementModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'statement' | 'resume' | 'bragsheet' | 'interview'>('statement');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    try {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.8 },
      });
    } catch {
      // ignore
    }
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const personalStatementRAGParagraph = `Investigating hallucination mitigation and citation fidelity in Retrieval-Augmented Generation (RAG), I designed and evaluated an end-to-end document question-answering architecture using AI-assisted scaffolding in Google AI Studio. Rather than delegating logic to black-box frameworks, I engineered the underlying components from first principles: deterministic recursive chunking with sliding token windows, dense TF-IDF vector projections normalized on unit hyperspheres, cosine similarity indexing, and BM25 hybrid ranking with Reciprocal Rank Fusion (RRF). I then implemented strict token-level provenance constraints that require the model to ground generated assertions directly in retrieved source spans with exact page and offset citations. In rigorous evaluation across a 30-query test suite, citations traced correctly to source spans in 26 of 30 test questions (86.7% citation accuracy); however, tracing fidelity degraded significantly when presented with multi-document cross-reference conflicts and contradictory source statements, highlighting a key limitation that motivates my current research into cross-document coreference resolution and claim-level contradiction filtering.`;

  const resumeBullets = `• Engineered a full-stack Retrieval-Augmented Generation (RAG) engine from foundational algorithms with AI-assisted scaffolding in Google AI Studio, utilizing React, TypeScript, and Google Gemini API.
• Designed deterministic text chunking with sliding token windows, BM25 keyword search, and dense hypersphere vector representations with cosine similarity retrieval.
• Formulated token-level provenance verification constraints requiring assertions to trace back to verified chunk offsets and citation references.
• Evaluated system retrieval quality across 30 benchmark test questions, attaining 86.7% verified citation accuracy (26/30 correct citation traces); documented edge-case failure modes under cross-document contradictory source conditions.`;

  const bragSheetText = `Project: Grounded Retrieval-Augmented Generation (RAG) Engine with Hybrid Vector Retrieval & Token-Level Provenance
Lead Student: Arin Ghosh (Christ Academy ICSE School)
Development Mode: Guided AI-assisted workflow in Google AI Studio with custom algorithmic architecture
Target Institutions: University of Hong Kong (HKU), Hong Kong University of Science and Technology (HKUST), National University of Singapore (NUS), Nanyang Technological University (NTU), Singapore Management University (SMU), Chinese University of Hong Kong (CUHK), Hong Kong Polytechnic University (PolyU), City University of Hong Kong (CityU).

Key Achievements:
1. Algorithmic Scaffolding: Formulated chunking, TF-IDF / vector hypersphere projection, cosine similarity, and BM25 hybrid search algorithms.
2. Citation Fidelity Verification: Implemented prompt-engineering constraints and post-retrieval verification preventing ungrounded hallucinations.
3. Empirical Evaluation: 86.7% citation accuracy on 30 test questions (26/30 traced correctly).
4. Honest Limitation Statement: Documented vulnerability to multi-document claim contradictions, formulating a clear hypothesis for future research into cross-document contradiction resolution.`;

  const interviewAnswers = `Q: Did you build this entire application from scratch, or did you use AI?
A: "I developed this project using AI-assisted scaffolding in Google AI Studio. While AI assisted with UI scaffolding and boilerplate generation, I formulated the underlying engineering logic: selecting recursive chunking with sliding overlap windows, engineering the dense vector projection and BM25 hybrid retrieval pipeline, defining the strict token-level citation tracing constraints, and designing the benchmark evaluation. I believe authentic technical leadership means understanding the algorithmic internals and transparently communicating both system outcomes and failure modes."

Q: What was the empirical outcome of your RAG pipeline?
A: "In a benchmark test suite of 30 diverse document-grounded queries, the system correctly resolved and traced exact citation offsets for 26 out of 30 questions (86.7% citation accuracy)."

Q: What is the main limitation of your system?
A: "When documents contain contradictory factual statements on the same entity (e.g., conflicting dates or policy revisions across versions), the reciprocal rank fusion mechanism often surfaces contradictory chunks, which can lead to hallucinated reconciliations. Addressing this requires cross-document contradiction detection and temporal claim validation, which forms my future research proposal."`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-ink-950 border border-ink-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-ink-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-800 bg-ink-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent-500/10 text-accent-400 border border-accent-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Undergraduate Admissions & Project Attribution
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-accent-950 text-accent-300 border border-accent-800 rounded-full">
                  Verified Statement
                </span>
              </h2>
              <p className="text-xs text-ink-300">
                Arin Ghosh &middot; Christ Academy ICSE School &middot; Built with AI assistance in Google AI Studio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-400 hover:text-white hover:bg-ink-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student & School Info Bar */}
        <div className="px-6 py-3 bg-black/60 border-b border-ink-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 text-ink-200">
            <User className="w-4 h-4 text-accent-400 flex-shrink-0" />
            <span>
              Author: <strong className="text-white">Arin Ghosh</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-ink-200">
            <School className="w-4 h-4 text-accent-400 flex-shrink-0" />
            <span>
              School: <strong className="text-white">Christ Academy ICSE School</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-ink-200">
            <Sparkles className="w-4 h-4 text-accent-400 flex-shrink-0" />
            <span>
              Tooling: <strong className="text-white">Google AI Studio (AI-Assisted)</strong>
            </span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-ink-800 bg-ink-900/40 overflow-x-auto">
          <button
            onClick={() => setActiveTab('statement')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'statement'
                ? 'border-accent-400 text-accent-300'
                : 'border-transparent text-ink-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Personal Statement (RAG Paragraph)
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'resume'
                ? 'border-accent-400 text-accent-300'
                : 'border-transparent text-ink-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Resume Bullet Points
          </button>
          <button
            onClick={() => setActiveTab('bragsheet')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'bragsheet'
                ? 'border-accent-400 text-accent-300'
                : 'border-transparent text-ink-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Brag Sheet Summary
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'interview'
                ? 'border-accent-400 text-accent-300'
                : 'border-transparent text-ink-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Admissions Interview Q&A
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: Personal Statement */}
          {activeTab === 'statement' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-accent-950/20 border border-accent-800/40 text-xs text-ink-200 space-y-2">
                <div className="flex items-center gap-2 text-accent-300 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Honesty-Gap Compliant & Outcome-Validated Statement</span>
                </div>
                <p className="text-ink-300 leading-relaxed">
                  Tailored for undergraduate admissions and scholarships at <strong>HKU, HKUST, NUS, NTU, SMU, CUHK, PolyU, and CityU</strong>.
                  Accurately discloses AI-assisted scaffolding while emphasizing your architectural design, empirical outcome (86.7% citation accuracy on 30 test questions), and nuanced limitation analysis.
                </p>
              </div>

              <div className="relative p-5 rounded-xl bg-black border border-ink-800 font-sans text-sm text-ink-100 leading-relaxed">
                <p className="whitespace-pre-line">{personalStatementRAGParagraph}</p>
                <button
                  onClick={() => copyToClipboard(personalStatementRAGParagraph, 'statement')}
                  className="mt-4 px-4 py-2 bg-accent-500 hover:bg-accent-400 text-black font-semibold rounded-lg text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  {copiedKey === 'statement' ? (
                    <>
                      <Check className="w-4 h-4 text-black" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-black" />
                      <span>Copy Personal Statement Paragraph</span>
                    </>
                  )}
                </button>
              </div>

              {/* Outcome & Limitation Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-ink-900 border border-ink-800">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Empirical Outcome</span>
                  </div>
                  <p className="text-xs text-ink-200 leading-relaxed">
                    <strong>26 of 30 test questions (86.7%)</strong> correctly traced citations directly to retrieved document spans with exact chunk offsets and source grounding.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-ink-900 border border-ink-800">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Documented Limitation</span>
                  </div>
                  <p className="text-xs text-ink-200 leading-relaxed">
                    Citation tracing degraded when presented with cross-document contradictory source statements, motivating future research into claim-level contradiction resolution.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Resume Bullets */}
          {activeTab === 'resume' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-ink-900 border border-ink-800 text-xs text-ink-300">
                <span className="font-bold text-white block mb-1">
                  Ready-to-Paste Resume Bullets (Undergraduate CV / Activities Sheet):
                </span>
                Include under &ldquo;Technical Projects&rdquo; or &ldquo;Computer Science Research&rdquo;.
              </div>

              <div className="p-5 rounded-xl bg-black border border-ink-800 font-mono text-xs text-ink-200 leading-relaxed">
                <pre className="whitespace-pre-line font-mono">{resumeBullets}</pre>
                <button
                  onClick={() => copyToClipboard(resumeBullets, 'resume')}
                  className="mt-4 px-4 py-2 bg-accent-500 hover:bg-accent-400 text-black font-semibold rounded-lg text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  {copiedKey === 'resume' ? (
                    <>
                      <Check className="w-4 h-4 text-black" />
                      <span>Copied Bullets!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-black" />
                      <span>Copy Resume Bullets</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Brag Sheet */}
          {activeTab === 'bragsheet' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-ink-900 border border-ink-800 text-xs text-ink-300">
                <span className="font-bold text-white block mb-1">
                  Counselor & Teacher Recommendation Brag Sheet:
                </span>
                Share this with your school counselor and recommender teachers at Christ Academy ICSE School so they can reference your work in letters of recommendation.
              </div>

              <div className="p-5 rounded-xl bg-black border border-ink-800 font-mono text-xs text-ink-200 leading-relaxed">
                <pre className="whitespace-pre-line font-mono">{bragSheetText}</pre>
                <button
                  onClick={() => copyToClipboard(bragSheetText, 'bragsheet')}
                  className="mt-4 px-4 py-2 bg-accent-500 hover:bg-accent-400 text-black font-semibold rounded-lg text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  {copiedKey === 'bragsheet' ? (
                    <>
                      <Check className="w-4 h-4 text-black" />
                      <span>Copied Brag Sheet!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-black" />
                      <span>Copy Brag Sheet Summary</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Interview Q&A */}
          {activeTab === 'interview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-ink-900 border border-ink-800 text-xs text-ink-300">
                <span className="font-bold text-white block mb-1">
                  Admissions & Scholarship Interview Preparation:
                </span>
                How to handle questions about AI-assisted engineering with clarity, intellectual honesty, and confidence during admissions interviews.
              </div>

              <div className="p-5 rounded-xl bg-black border border-ink-800 text-xs text-ink-200 leading-relaxed space-y-4">
                <div className="whitespace-pre-line font-sans text-sm">{interviewAnswers}</div>
                <button
                  onClick={() => copyToClipboard(interviewAnswers, 'interview')}
                  className="mt-4 px-4 py-2 bg-accent-500 hover:bg-accent-400 text-black font-semibold rounded-lg text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  {copiedKey === 'interview' ? (
                    <>
                      <Check className="w-4 h-4 text-black" />
                      <span>Copied Interview Notes!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-black" />
                      <span>Copy Interview Q&A Preparation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-ink-800 bg-ink-900/80 flex items-center justify-between text-xs text-ink-400">
          <span>Target Institutions: HKU &middot; HKUST &middot; NUS &middot; NTU &middot; SMU &middot; CUHK &middot; PolyU &middot; CityU</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-ink-800 hover:bg-ink-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
