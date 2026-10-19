import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowUpRight, Check, ChevronDown, Clock3, Copy, FileText, LoaderCircle, MessageSquare, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { ChatMessage, DocumentChunk, DocumentItem, RetrievalConfig } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

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

const suggestions = [
  { topic: 'Attention Is All You Need', question: 'How does multi-head attention work in a Transformer?' },
  { topic: 'Retrieval-Augmented Generation', question: 'What is the difference between RAG-Sequence and RAG-Token?' },
  { topic: 'Dense Vector Embeddings', question: 'How does cosine similarity help find relevant document passages?' },
];

export function ChatInterface({ messages, onSendMessage, isLoading, retrievalConfig, setRetrievalConfig, onOpenViewerWithChunk, onClearChat, documents }: ChatInterfaceProps) {
  const [inputQuery, setInputQuery] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copyError, setCopyError] = useState(false);
  const streamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stream = streamRef.current;
    if (stream) stream.scrollTop = messages.length || isLoading ? stream.scrollHeight : 0;
    if (!messages.length) {
      setInputQuery('');
      setCopiedId(null);
      setExpandedPrompt(null);
    }
  }, [messages, isLoading]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!inputQuery.trim() || isLoading || !documents.length) return;
    onSendMessage(inputQuery.trim());
    setInputQuery('');
  };

  const copyAnswer = async (message: ChatMessage) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(message.id);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  };

  return <section className="conversation-panel notebook-panel" aria-labelledby="conversation-heading">
    <div className="panel-heading"><h2 id="conversation-heading">Conversation</h2><div className="conversation-actions"><button className={'icon-button' + (showConfig ? ' is-active' : '')} aria-label="Retrieval settings" aria-expanded={showConfig} onClick={() => setShowConfig(!showConfig)}><SlidersHorizontal size={16} /></button><button className="icon-button" aria-label="Clear conversation" disabled={!messages.length || isLoading} onClick={onClearChat}><RotateCcw size={15} /></button></div></div>
    {showConfig && <div className="retrieval-settings">
      <div className="settings-title"><strong>Retrieval settings</strong><span>Applied to your next question</span></div>
      <label htmlFor="retrieval-top-k">Passages per answer<output>{retrievalConfig.topK}</output></label>
      <input id="retrieval-top-k" type="range" min={1} max={8} value={retrievalConfig.topK} onChange={event => setRetrievalConfig(previous => ({ ...previous, topK: Number(event.target.value) }))} />
      <label htmlFor="retrieval-balance">Vector / keyword balance<output>{Math.round(retrievalConfig.hybridAlpha * 100)} / {Math.round((1 - retrievalConfig.hybridAlpha) * 100)}</output></label>
      <input id="retrieval-balance" type="range" min={0} max={1} step={0.05} value={retrievalConfig.hybridAlpha} onChange={event => setRetrievalConfig(previous => ({ ...previous, hybridAlpha: Number(event.target.value) }))} />
      <label htmlFor="retrieval-threshold">Minimum relevance threshold<output>{Math.round(retrievalConfig.similarityThreshold * 100)}%</output></label>
      <input id="retrieval-threshold" type="range" min={0.1} max={0.7} step={0.05} value={retrievalConfig.similarityThreshold} onChange={event => setRetrievalConfig(previous => ({ ...previous, similarityThreshold: Number(event.target.value) }))} />
    </div>}
    <div className="conversation-stream" ref={streamRef} role="log" aria-label="Research conversation" aria-live="polite" aria-relevant="additions">
      {!messages.length ? <div className="conversation-empty">
        <span className="notebook-label"><MessageSquare size={17} strokeWidth={1.5} /> YOUR NOTEBOOK</span>
        <h2>Ask your sources.</h2>
        <p>{documents.length ? 'Explore an idea, compare findings, or ask a specific question. Answers draw on the documents in this notebook.' : 'Add a document to the notebook, then ask a question about it.'}</p>
        <div className="suggested-questions"><h3>Try a question</h3>{suggestions.map(suggestion => <button key={suggestion.topic} disabled={!documents.length || isLoading} onClick={() => onSendMessage(suggestion.question)}><span><small>{suggestion.topic}</small><strong>{suggestion.question}</strong></span><ArrowUpRight size={16} /></button>)}</div>
        <p className="empty-help">Select a source on the left to read it alongside your conversation.</p>
      </div> : messages.map(message => <article key={message.id} className={'conversation-message ' + (message.role === 'user' ? 'user-message' : 'assistant-message')}>
        {message.role === 'user' ? <><div className="message-byline"><strong>You</strong><span>{message.timestamp}</span></div><p>{message.content}</p></> : <>
          <div className="message-byline"><strong>Grounded</strong><span>{message.modelUsed === 'deterministic-rag-synthesizer' ? 'Local synthesis' : message.modelUsed && message.modelUsed !== 'unknown' ? message.modelUsed : 'Response'}</span>{message.latencyMs !== undefined && <span className="message-latency"><Clock3 size={12} />{message.latencyMs < 1000 ? message.latencyMs + ' ms' : (message.latencyMs / 1000).toFixed(1) + ' s'}</span>}</div>
          <MarkdownRenderer content={message.content} chunks={message.retrievedChunks || []} onOpenViewer={onOpenViewerWithChunk} />
          {Boolean(message.retrievedChunks?.length) && <div className="answer-sources"><span>Sources</span>{message.retrievedChunks!.map((result, index) => <button key={result.chunk.id} onClick={() => onOpenViewerWithChunk(result.chunk)} title={result.chunk.docTitle}><span>{index + 1}</span><FileText size={12} /><span>{result.chunk.docTitle}</span></button>)}</div>}
          <div className="answer-actions"><button onClick={() => copyAnswer(message)}>{copiedId === message.id ? <Check size={14} /> : <Copy size={14} />}{copiedId === message.id ? 'Copied' : 'Copy answer'}</button>{message.rawPrompt && <button aria-expanded={expandedPrompt === message.id} onClick={() => setExpandedPrompt(expandedPrompt === message.id ? null : message.id)}>View prompt<ChevronDown size={13} /></button>}</div>
          {expandedPrompt === message.id && <pre className="prompt-preview">{message.rawPrompt}</pre>}
        </>}
      </article>)}
      {isLoading && <div className="loading-answer" role="status"><LoaderCircle size={17} className="loading-spinner" /><div><strong>Reading your sources…</strong><p>Finding relevant passages and composing an answer.</p></div></div>}
    </div>
    <div className="conversation-composer"><form onSubmit={handleSubmit}><label htmlFor="research-question" className="sr-only">Ask a question about your documents</label><textarea id="research-question" rows={3} value={inputQuery} onChange={event => setInputQuery(event.target.value)} disabled={isLoading || !documents.length} placeholder={documents.length ? 'Ask a question about your sources…' : 'Add a source to begin…'} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} /><div className="composer-toolbar"><span><FileText size={13} />{documents.length} sources<span className="composer-shortcut">Enter to send · Shift + Enter for a new line</span></span><button type="submit" disabled={isLoading || !documents.length || !inputQuery.trim()} aria-label="Send question"><ArrowUp size={18} /></button></div></form><p className="composer-disclaimer" role={copyError ? 'alert' : undefined}>{copyError ? 'Copy failed. You can select the answer text and copy it manually.' : 'Check cited passages for important details. AI-generated answers can be incomplete.'}</p></div>
  </section>;
}
