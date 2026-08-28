import React, { useState } from 'react';
import {
  ChatMessage,
  RetrievalConfig,
  RetrievalResult,
  DocumentChunk,
  DocumentItem,
} from '../types';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Sliders,
  ChevronDown,
  ChevronUp,
  FileSearch,
  ExternalLink,
  ShieldCheck,
  Zap,
  Code,
  Layers,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (query: string) => void;
  isLoading: boolean;
  retrievalConfig: RetrievalConfig;
  setRetrievalConfig: React.Dispatch<React.SetStateAction<RetrievalConfig>>;
  onOpenViewerWithChunk: (chunk: DocumentChunk) => void;
  onClearChat: () => void;
  documents: DocumentItem[];
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  retrievalConfig,
  setRetrievalConfig,
  onOpenViewerWithChunk,
  onClearChat,
  documents,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [expandedPromptMsgId, setExpandedPromptMsgId] = useState<string | null>(null);
  const [expandedSourcesMsgId, setExpandedSourcesMsgId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sampleQueries = [
    {
      uni: 'CS',
      label: 'CS Admissions & Prereqs',
      query: 'What are the exact high school subject prerequisites and indicative grade profiles for Computer Science?',
    },
    {
      uni: 'AI',
      label: 'AI Curriculum & GPU Labs',
      query: 'What AI and Deep Learning modules and GPU research facilities are available in the AI & Data Science degree?',
    },
    {
      uni: 'IS',
      label: 'Enterprise Cloud Tracks',
      query: 'How does the Information Systems curriculum integrate cloud enterprise architectures with consulting projects?',
    },
    {
      uni: 'Systems',
      label: 'Systems Design Capstone',
      query: 'What is the multi-disciplinary Systems Design and Engineering capstone project and how is it structured?',
    },
    {
      uni: 'RAG',
      label: 'Lewis et al. RAG Math',
      query: 'Explain the mathematical difference between RAG-Sequence and RAG-Token models according to Lewis et al. 2020.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;
    onSendMessage(inputQuery.trim());
    setInputQuery('');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[740px] bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Header bar */}
      <div className="px-5 py-3.5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <FileSearch className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Grounded Document Q&A Agent
            </h3>
            <p className="text-[11px] text-slate-400">
              Retrieval-Augmented Generation with strict provenance & citation verification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              showConfig
                ? 'bg-cyan-950 text-cyan-400 border-cyan-700'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>RAG Tuning (Top-K: {retrievalConfig.topK})</span>
            {showConfig ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {messages.length > 0 && (
            <button
              onClick={onClearChat}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg text-xs"
              title="Clear Chat History"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* RAG Parameter Tuning Drawer */}
      {showConfig && (
        <div className="p-4 bg-slate-950 border-b border-slate-800 text-xs space-y-3 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Top-K Retrieved Chunks</span>
                <span className="font-semibold text-cyan-400">{retrievalConfig.topK}</span>
              </div>
              <input
                type="range"
                min={1}
                max={8}
                value={retrievalConfig.topK}
                onChange={(e) =>
                  setRetrievalConfig((prev) => ({
                    ...prev,
                    topK: parseInt(e.target.value, 10),
                  }))
                }
                className="w-full accent-cyan-500"
              />
              <span className="text-[10px] text-slate-500">
                Number of highest-cosine chunks injected into prompt.
              </span>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Hybrid Balance (Dense vs BM25)</span>
                <span className="font-semibold text-indigo-400">
                  {(retrievalConfig.hybridAlpha * 100).toFixed(0)}% Vector / {((1 - retrievalConfig.hybridAlpha) * 100).toFixed(0)}% BM25
                </span>
              </div>
              <input
                type="range"
                min={0.0}
                max={1.0}
                step={0.05}
                value={retrievalConfig.hybridAlpha}
                onChange={(e) =>
                  setRetrievalConfig((prev) => ({
                    ...prev,
                    hybridAlpha: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-indigo-500"
              />
              <span className="text-[10px] text-slate-500">
                1.0 = Pure Semantic Embeddings, 0.0 = Pure Keyword BM25.
              </span>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Min Cosine Threshold</span>
                <span className="font-semibold text-emerald-400">
                  {(retrievalConfig.similarityThreshold * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min={0.1}
                max={0.7}
                step={0.05}
                value={retrievalConfig.similarityThreshold}
                onChange={(e) =>
                  setRetrievalConfig((prev) => ({
                    ...prev,
                    similarityThreshold: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-emerald-500"
              />
              <span className="text-[10px] text-slate-500">
                Filters out noisy irrelevant chunks below threshold.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-lg shadow-cyan-500/10">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-200">
              Test Document Retrieval & Synthesis
            </h4>
            <p className="text-xs text-slate-400 mt-1 mb-5 leading-relaxed">
              Ask any question about academic admissions, curriculum details, or technical RAG research papers.
            </p>

            {/* Quick Sample Queries */}
            <div className="w-full space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Suggested Admissions & Research Prompts
              </span>
              <div className="grid grid-cols-1 gap-1.5 text-left">
                {sampleQueries.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSendMessage(item.query)}
                    className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-xs text-slate-300 hover:text-white transition-all flex items-start gap-2.5 group"
                  >
                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-bold">
                      {item.uni}
                    </span>
                    <span className="flex-1 group-hover:translate-x-0.5 transition-transform">
                      {item.query}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-700/60 flex-shrink-0 flex items-center justify-center text-cyan-400 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                  msg.role === 'user'
                    ? 'bg-cyan-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-950/90 text-slate-200 border border-slate-800 rounded-bl-none shadow-md'
                }`}
              >
                {/* User Message */}
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap text-sm font-medium">{msg.content}</p>
                ) : (
                  <>
                    {/* Assistant Metadata & Grounding Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                          <ShieldCheck className="w-3 h-3" />
                          {msg.ragMetrics?.overallVerdict || 'Grounded in Sources'}
                        </span>
                        {msg.latencyMs && (
                          <span className="text-slate-400 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-400" />
                            {msg.latencyMs}ms total
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="text-slate-400 hover:text-slate-200 flex items-center gap-1 text-[11px]"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Answer Body with Highlighted Citations */}
                    <div className="prose prose-invert prose-xs max-w-none text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                      {renderAnswerWithCitationBadges(
                        msg.content,
                        msg.retrievedChunks || [],
                        onOpenViewerWithChunk
                      )}
                    </div>

                    {/* Retrieved Sources Accordion */}
                    {msg.retrievedChunks && msg.retrievedChunks.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80">
                        <button
                          onClick={() =>
                            setExpandedSourcesMsgId(
                              expandedSourcesMsgId === msg.id ? null : msg.id
                            )
                          }
                          className="w-full flex items-center justify-between text-[11px] font-medium text-cyan-400 hover:text-cyan-300 py-1"
                        >
                          <span className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5" />
                            <span>
                              Retrieved Context ({msg.retrievedChunks.length} Top-K Chunks)
                            </span>
                          </span>
                          {expandedSourcesMsgId === msg.id ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {expandedSourcesMsgId === msg.id && (
                          <div className="mt-2 space-y-2 animate-in fade-in duration-150">
                            {msg.retrievedChunks.map((res, i) => (
                              <div
                                key={i}
                                className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-1.5"
                              >
                                <div className="flex items-center justify-between text-[10px]">
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 font-bold border border-cyan-800">
                                      Source {i + 1}
                                    </span>
                                    <span className="font-semibold text-slate-300 truncate max-w-[200px]">
                                      {res.chunk.docTitle}
                                    </span>
                                    <span className="text-slate-500 font-mono">
                                      #Chunk {res.chunk.chunkIndex + 1}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className="text-emerald-400 font-semibold font-mono">
                                      {(res.similarity * 100).toFixed(1)}% Cosine
                                    </span>
                                    <button
                                      onClick={() => onOpenViewerWithChunk(res.chunk)}
                                      className="text-cyan-400 hover:text-cyan-200 underline text-[10px] flex items-center gap-0.5"
                                    >
                                      Inspect <ExternalLink className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                </div>

                                <p className="text-[11px] text-slate-400 font-mono bg-slate-950 p-2 rounded-lg leading-relaxed line-clamp-3">
                                  {res.chunk.text}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Raw Grounded Prompt Inspector */}
                    {msg.rawPrompt && (
                      <div className="pt-1">
                        <button
                          onClick={() =>
                            setExpandedPromptMsgId(
                              expandedPromptMsgId === msg.id ? null : msg.id
                            )
                          }
                          className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300 font-mono"
                        >
                          <Code className="w-3 h-3" />
                          <span>
                            {expandedPromptMsgId === msg.id
                              ? 'Hide Injected Prompt Payload'
                              : 'Inspect Injected System & Augmented Prompt'}
                          </span>
                        </button>

                        {expandedPromptMsgId === msg.id && (
                          <div className="mt-2 p-3 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-mono text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto">
                            {msg.rawPrompt}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-cyan-700 border border-cyan-500 flex-shrink-0 flex items-center justify-center text-white mt-0.5 shadow-sm">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-3 items-start animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl rounded-bl-none p-4 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-medium">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Computing dense vector embeddings & querying cosine index...</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Retrieving Top-{retrievalConfig.topK} relevant passages and synthesizing strictly grounded response.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 sm:p-4 bg-slate-950/80 border-t border-slate-800">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading || documents.length === 0}
            placeholder={
              documents.length === 0
                ? 'Upload or index documents above first...'
                : 'Ask anything about curriculum, admissions criteria, or RAG research...'
            }
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-4 pr-24 py-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim() || documents.length === 0}
            className="absolute right-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium text-xs rounded-lg transition-all flex items-center gap-1.5 shadow"
          >
            <span>Query</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
          <span>Press Enter to query with vector search &middot; Real-time Cosine Ranking</span>
          <span>Zero Hallucination Guardrail Active</span>
        </div>
      </div>
    </div>
  );
};

// Helper: Highlight citation tags in the answer text and make them interactive
function renderAnswerWithCitationBadges(
  text: string,
  chunks: RetrievalResult[],
  onOpenViewer: (chunk: DocumentChunk) => void
) {
  // Split on [Source X] or [Chunk #Y]
  const regex = /(\[(?:Source\s*\d+|Chunk\s*#?\d+|Doc:[^\]]+)\])/gi;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (regex.test(part)) {
      const matchNum = part.match(/\d+/);
      const sourceNum = matchNum ? parseInt(matchNum[0], 10) : 1;
      const targetChunk = chunks[sourceNum - 1]?.chunk || chunks[0]?.chunk;

      return (
        <button
          key={index}
          onClick={() => targetChunk && onOpenViewer(targetChunk)}
          className="inline-flex items-center gap-0.5 mx-0.5 px-1.5 py-0.2 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/80 text-cyan-300 font-mono text-[10px] font-bold transition-colors cursor-pointer"
          title={`Click to view Source #${sourceNum} in document viewer`}
        >
          {part}
        </button>
      );
    }
    return <span key={index}>{part}</span>;
  });
}
