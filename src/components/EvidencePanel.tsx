import React from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, FileText, Quote } from 'lucide-react';
import { DocumentChunk, DocumentItem, RetrievalResult } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';

interface EvidencePanelProps {
  document: DocumentItem | null;
  chunk: DocumentChunk | null;
  results: RetrievalResult[];
  hasQuery: boolean;
  isHistorical: boolean;
  onSelectChunk: (chunk: DocumentChunk) => void;
  onOpenDocument: (document: DocumentItem) => void;
}

export function EvidencePanel({ document, chunk, results, hasQuery, isHistorical, onSelectChunk, onOpenDocument }: EvidencePanelProps) {
  const currentResult = results.find(result => result.chunk.id === chunk?.id);
  const chunkIndex = document?.chunks.findIndex(item => item.id === chunk?.id) ?? -1;
  const previous = chunkIndex > 0 ? document?.chunks[chunkIndex - 1] : undefined;
  const next = chunkIndex >= 0 ? document?.chunks[chunkIndex + 1] : undefined;

  return <section id="evidence-panel" className="evidence-panel notebook-panel" aria-labelledby="evidence-heading">
    <div className="panel-heading"><h2 id="evidence-heading">Evidence</h2><Quote size={16} strokeWidth={1.6} /></div>
    <div className="evidence-subheading"><span>{currentResult ? 'Retrieved passage' : 'Source preview'}</span><span>{results.length ? results.length + ' matches' : 'Read alongside your chat'}</span></div>
    {results.length > 0 && <div className="evidence-references" aria-label="Retrieved passages">{results.map((result, index) => <button key={result.chunk.id} aria-label={'View source ' + (index + 1)} aria-pressed={result.chunk.id === chunk?.id} onClick={() => onSelectChunk(result.chunk)}>{index + 1}<span>Source</span></button>)}</div>}
    {document ? <>
      <div className="evidence-scroll">
        {isHistorical && <p className="evidence-note" role="status">Saved evidence from this answer. The notebook source was removed or re-indexed.</p>}
        <div className="evidence-document-type"><FileText size={14} />{document.fileType === 'md' ? 'Markdown document' : document.fileType.toUpperCase() + ' document'}</div>
        <h3>{document.title}</h3>
        <p className="evidence-document-meta">{document.wordCount.toLocaleString()} words<span>·</span>{document.chunks.length} passages</p>
        {currentResult && <div className="relevance-score"><div><span>Retrieval relevance</span><strong>{(currentResult.similarity * 100).toFixed(1)}%</strong></div><div className="score-track"><span style={{ width: Math.max(0, Math.min(100, currentResult.similarity * 100)) + '%' }} /></div></div>}
        <div className="passage-label"><span className="passage-marker" />Passage {chunkIndex >= 0 ? chunkIndex + 1 : '—'}{currentResult && <span>Selected for this answer</span>}</div>
        {chunk ? <div className="evidence-excerpt"><MarkdownRenderer content={chunk.text} /></div> : <p className="evidence-note">This document has no indexed passages. Add readable text or re-index it in Sources.</p>}
        <p className="evidence-note">{currentResult ? 'Relevance combines vector similarity and keyword matching. It is not a confidence score.' : hasQuery ? results.length ? 'Previewing this source. Select a retrieved passage above to inspect evidence for the latest answer.' : 'No passages matched the last question. This is a preview of your selected source.' : 'This is a preview of your source. After you ask a question, retrieved passages appear here.'}</p>
      </div>
      <div className="evidence-footer"><div className="passage-navigation"><span>Passage {chunkIndex >= 0 ? chunkIndex + 1 : 0} of {document.chunks.length}</span><div><button className="icon-button" disabled={!previous} onClick={() => previous && onSelectChunk(previous)} aria-label="Previous passage"><ChevronLeft size={15} /></button><button className="icon-button" disabled={!next} onClick={() => next && onSelectChunk(next)} aria-label="Next passage"><ChevronRight size={15} /></button></div></div><button className="button button-outline" onClick={() => onOpenDocument(document)}>Open full document<ArrowUpRight size={14} /></button></div>
    </> : <div className="source-empty"><FileText size={25} /><p>Your evidence will appear here</p><small>Add a source, then ask a question to inspect the passages behind the answer.</small></div>}
  </section>;
}
