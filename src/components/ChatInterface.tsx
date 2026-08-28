import React, { useState } from 'react';
import {
  ChatMessage,
  RetrievalConfig,
  RetrievalResult,
  DocumentChunk,
  DocumentItem,
} from '../types';
import { Send, Sparkles, Bot, User, FileSliders as Sliders, ChevronDown, ChevronUp, FileSearch, ExternalLink, ShieldCheck, Zap, Code, Layers, Copy, Check, RefreshCw } from 'lucide-react';

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
    'What are the high school subject prerequisites for Computer Science?',
    'What Deep Learning modules and GPU labs are in the AI & Data Science degree?',
    'How does Information Systems integrate cloud architecture with consulting?',
    'Explain the difference between RAG-Sequence and RAG-Token (Lewis et al. 2020).',
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
    <div className="flex flex-col h-[740px] bg-ink-900 rounded-xl border border-ink-800 overflow-hidden">
      {/* Header bar */}
      <div className="px-4 py-3 bg-ink-850 border-b border-ink-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent-500/10 border border-accent-500/20 flex items-center justify-center">
            <FileSearch className="w-3.5 h-3.5 text-accent-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink-50">
              Document Q&A
            </h3>
            <p className="text-[11px] text-ink-500">
              Grounded retrieval with citations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
              showConfig
                ? 'bg-accent-500/10 text-accent-300 border-accent-500/30'
                : 'bg-ink-800 text-ink-300 border-ink-700 hover:bg-ink-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tune</span>
            <span className="font-mono text-[10px] text-ink-500">K={retrievalConfig.topK}</span>
            {showConfig ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {messages.length > 0 && (
            <button
              onClick={onClearChat}
              className="p-1.5 text-ink-500 hover:text-ink-200 hover:bg-ink-800 rounded-md transition-colors"
              title="Clear chat"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* RAG Parameter Tuning Drawer */}
      {showConfig && (
        <div className="p-4 bg-ink-850 border-b border-ink-800 text-xs space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <div className="flex justify-between text-ink-300 mb-1.5">
                <span>Top-K Chunks</span>
                <span className="font-mono font-semibold text-accent-400">{retrievalConfig.topK}</span>
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
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-ink-300 mb-1.5">
                <span>Dense / BM25</span>
                <span className="font-mono font-semibold text-ink-200">
                  {(retrievalConfig.hybridAlpha * 100).toFixed(0)}/{((1 - retrievalConfig.hybridAlpha) * 100).toFixed(0)}
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
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between text-ink-300 mb-1.5">
                <span>Min Threshold</span>
                <span className="font-mono font-semibold text-ink-200">
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
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-8">
            <div className="w-10 h-10 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-accent-400" />
            </div>
            <h4 className="text-sm font-semibold text-ink-100">
              Ask about admissions, curriculum, or RAG research
            </h4>
            <p className="text-xs text-ink-500 mt-1 mb-5">
              Answers are grounded in the indexed documents with inline citations.
            </p>

            <div className="w-full space-y-1.5">
              <span className="text-[10px] font-semibold text-ink-600 uppercase tracking-wider block mb-1.5">
                Try a question
              </span>
              {sampleQueries.map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(query)}
                  className="w-full p-2.5 rounded-lg bg-ink-850 hover:bg-ink-800 border border-ink-800 hover:border-accent-500/30 text-left text-xs text-ink-300 hover:text-ink-100 transition-all group"
                >
                  <span className="flex items-start gap-2">
                    <span className="text-accent-500 font-mono text-[10px] mt-0.5">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="flex-1 group-hover:translate-x-0.5 transition-transform">{query}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-accent-500/10 border border-accent-500/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-accent-400" />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[82%] rounded-xl p-3.5 text-xs leading-relaxed space-y-3 ${
                  msg.role === 'user'
                    ? 'bg-accent-600 text-white rounded-br-sm'
                    : 'bg-ink-850 text-ink-200 border border-ink-800 rounded-bl-sm'
                }`}
              >
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap text-sm font-medium">{msg.content}</p>
                ) : (
                  <>
                    {/* Metadata bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-ink-800 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          <ShieldCheck className="w-3 h-3" />
                          {msg.ragMetrics?.overallVerdict || 'Grounded'}
                        </span>
                        {msg.latencyMs && (
                          <span className="text-ink-500 flex items-center gap-1 font-mono">
                            <Zap className="w-3 h-3 text-amber-400" />
                            {msg.latencyMs}ms
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="text-ink-500 hover:text-ink-200 flex items-center gap-1 text-[11px] transition-colors"
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

                    {/* Answer body */}
                    <div className="text-ink-200 whitespace-pre-wrap leading-relaxed">
                      {renderAnswerWithCitationBadges(
                        msg.content,
                        msg.retrievedChunks || [],
                        onOpenViewerWithChunk
                      )}
                    </div>

                    {/* Sources accordion */}
                    {msg.retrievedChunks && msg.retrievedChunks.length > 0 && (
                      <div className="pt-2 border-t border-ink-800">
                        <button
                          onClick={() =>
                            setExpandedSourcesMsgId(
                              expandedSourcesMsgId === msg.id ? null : msg.id
                            )
                          }
                          className="w-full flex items-center justify-between text-[11px] font-medium text-accent-400 hover:text-accent-300 py-1 transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5" />
                            <span>Retrieved context ({msg.retrievedChunks.length})</span>
                          </span>
                          {expandedSourcesMsgId === msg.id ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {expandedSourcesMsgId === msg.id && (
                          <div className="mt-2 space-y-2 animate-fade-in">
                            {msg.retrievedChunks.map((res, i) => (
                              <div
                                key={i}
                                className="bg-ink-900 border border-ink-800 rounded-lg p-2.5 space-y-1.5"
                              >
                                <div className="flex items-center justify-between text-[10px]">
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-1.5 py-0.5 rounded bg-accent-500/10 text-accent-400 font-mono font-bold border border-accent-500/20">
                                      S{i + 1}
                                    </span>
                                    <span className="font-medium text-ink-300 truncate max-w-[200px]">
                                      {res.chunk.docTitle}
                                    </span>
                                    <span className="text-ink-600 font-mono">
                                      #{res.chunk.chunkIndex + 1}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className="text-emerald-400 font-mono font-medium">
                                      {(res.similarity * 100).toFixed(1)}%
                                    </span>
                                    <button
                                      onClick={() => onOpenViewerWithChunk(res.chunk)}
                                      className="text-accent-400 hover:text-accent-300 transition-colors"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>

                                <p className="text-[11px] text-ink-400 font-mono bg-ink-950 p-2 rounded leading-relaxed line-clamp-3">
                                  {res.chunk.text}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Prompt inspector */}
                    {msg.rawPrompt && (
                      <div className="pt-1">
                        <button
                          onClick={() =>
                            setExpandedPromptMsgId(
                              expandedPromptMsgId === msg.id ? null : msg.id
                            )
                          }
                          className="flex items-center gap-1 text-[10px] text-ink-600 hover:text-ink-400 font-mono transition-colors"
                        >
                          <Code className="w-3 h-3" />
                          <span>
                            {expandedPromptMsgId === msg.id
                              ? 'Hide prompt payload'
                              : 'Inspect prompt'}
                          </span>
                        </button>

                        {expandedPromptMsgId === msg.id && (
                          <div className="mt-2 p-2.5 bg-ink-950 border border-ink-800 rounded-md text-[10px] font-mono text-ink-400 whitespace-pre-wrap max-h-48 overflow-y-auto">
                            {msg.rawPrompt}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-accent-600 border border-accent-500 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-lg bg-accent-500/10 border border-accent-500/20 flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-accent-400" />
            </div>
            <div className="bg-ink-850 border border-ink-800 rounded-xl rounded-bl-sm p-3.5 text-xs space-y-2">
              <div className="flex items-center gap-2 text-accent-400 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-ping" />
                <span>Computing embeddings and querying index...</span>
              </div>
              <p className="text-[11px] text-ink-500">
                Retrieving Top-{retrievalConfig.topK} passages and synthesizing grounded response.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 sm:p-4 bg-ink-850 border-t border-ink-800">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading || documents.length === 0}
            placeholder={
              documents.length === 0
                ? 'Index documents above first...'
                : 'Ask about curriculum, admissions, or RAG research...'
            }
            className="w-full bg-ink-900 border border-ink-800 rounded-lg pl-3.5 pr-20 py-2.5 text-sm text-ink-100 placeholder-ink-600 focus:outline-none focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/30 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim() || documents.length === 0}
            className="absolute right-1.5 px-3.5 py-1.5 bg-accent-600 hover:bg-accent-500 disabled:bg-ink-800 disabled:text-ink-600 text-white font-medium text-xs rounded-md transition-all flex items-center gap-1.5"
          >
            <span>Send</span>
            <Send className="w-3 h-3" />
          </button>
        </form>
        <div className="flex items-center justify-between text-[10px] text-ink-600 mt-1.5 px-1">
          <span>Enter to query · Cosine ranking</span>
          <span>Zero hallucination guardrail</span>
        </div>
      </div>
    </div>
  );
};

function renderAnswerWithCitationBadges(
  text: string,
  chunks: RetrievalResult[],
  onOpenViewer: (chunk: DocumentChunk) => void
) {
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
          className="inline-flex items-center gap-0.5 mx-0.5 px-1.5 py-0.5 rounded bg-accent-500/10 hover:bg-accent-500/20 border border-accent-500/30 text-accent-300 font-mono text-[10px] font-medium transition-colors cursor-pointer"
          title={`View Source #${sourceNum}`}
        >
          {part}
        </button>
      );
    }
    return <span key={index}>{part}</span>;
  });
}
