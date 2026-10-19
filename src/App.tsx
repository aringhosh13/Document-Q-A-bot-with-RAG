import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  DocumentItem,
  DocumentChunk,
  ChatMessage,
  ChunkingConfig,
  RetrievalConfig,
  RetrievalResult,
} from './types';
import {
  splitTextRecursively,
  generateLocalEmbedding,
  performHybridRetrieval,
} from './lib/ragEngine';
import { Header, WorkspaceTab } from './components/Header';
import { KnowledgePanel } from './components/KnowledgePanel';
import { EvidencePanel } from './components/EvidencePanel';
import { ChevronRight, Plus } from 'lucide-react';
import { DocumentManager } from './components/DocumentManager';
import { ChatInterface } from './components/ChatInterface';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { PipelineVisualizer } from './components/PipelineVisualizer';
import { VectorSpaceVisualizer } from './components/VectorSpaceVisualizer';
import { AdmissionsDefense } from './components/AdmissionsDefense';
import { CodeExporter } from './components/CodeExporter';
import { assignColorToDocument } from './lib/documentColors';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('chat');

  const [documentView, setDocumentView] = useState<'list' | 'upload'>('list');
  const [serviceStatus, setServiceStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const [selectedEvidence, setSelectedEvidence] = useState<DocumentChunk | null>(null);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [selectedSnapshot, setSelectedSnapshot] = useState<DocumentItem | null>(null);
  const [evidenceResults, setEvidenceResults] = useState<RetrievalResult[]>([]);
  const [mobilePanel, setMobilePanel] = useState<'sources' | 'chat' | 'evidence'>('chat');

  // Chunking & Retrieval Configurations
  const [chunkingConfig, setChunkingConfig] = useState<ChunkingConfig>({
    strategy: 'recursive',
    chunkSize: 650,
    chunkOverlap: 120,
    minChunkSize: 80,
  });

  const [retrievalConfig, setRetrievalConfig] = useState<RetrievalConfig>({
    topK: 4,
    similarityThreshold: 0.2,
    hybridAlpha: 0.75, // 75% Dense Semantic, 25% BM25 Sparse
    rerankEnabled: true,
    strictGrounding: true,
    temperature: 0.2,
  });

  // State: Documents & Indexed Chunks
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeminiConnected, setIsGeminiConnected] = useState(false);

  // Document & Chunk Modal Viewer State
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerDoc, setViewerDoc] = useState<DocumentItem | null>(null);
  const [viewerChunk, setViewerChunk] = useState<DocumentChunk | null>(null);

  // Check health / server connection on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => { if (!res.ok) throw new Error('Server unavailable'); return res.json(); })
      .then((data) => {
        setIsGeminiConnected(Boolean(data.hasGeminiKey));
        setServiceStatus('online');
      })
      .catch(() => {
        setIsGeminiConnected(false);
        setServiceStatus('offline');
      });
  }, []);

  // Re-chunk all documents when chunking configuration changes
  const handleRechunkAll = useCallback(() => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc, idx) => {
        const colorTheme = assignColorToDocument(idx);
        return {
          ...doc,
          colorTheme,
          color: colorTheme.hex,
          colorName: colorTheme.name,
          chunks: splitTextRecursively(
            doc.content,
            doc.id,
            doc.title,
            chunkingConfig,
            colorTheme.hex,
            colorTheme.name
          ),
        };
      })
    );
  }, [chunkingConfig]);

  // Add a newly uploaded/pasted document
  const handleAddDocument = (newDoc: Partial<DocumentItem>) => {
    const id = newDoc.id || `doc-${Date.now()}`;
    const title = newDoc.title || 'Untitled Document';
    const content = newDoc.content || '';

    const colorTheme = assignColorToDocument(documents.length);
    const color = colorTheme.hex;
    const colorName = colorTheme.name;

    const chunks = splitTextRecursively(
      content,
      id,
      title,
      chunkingConfig,
      color,
      colorName
    );

    const fullDoc: DocumentItem = {
      id,
      title,
      category: newDoc.category || 'user_upload',
      institution: newDoc.institution || (newDoc.category === 'user_upload' ? 'User Upload' : 'Document'),
      summary: newDoc.summary || `Document containing ${newDoc.wordCount || 0} words.`,
      content,
      fileType: newDoc.fileType || 'txt',
      pageCount: newDoc.pageCount || 1,
      wordCount: newDoc.wordCount || content.split(/\s+/).length,
      charCount: newDoc.charCount || content.length,
      dateAdded: newDoc.dateAdded || new Date().toISOString().split('T')[0],
      colorTheme,
      color,
      colorName,
      chunks,
    };

    setDocuments((prev) => [fullDoc, ...prev]);
  };

  // Delete a document from vector index
  const handleDeleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  // Open Document Viewer modal
  const handleOpenViewer = (doc: DocumentItem) => {
    setViewerDoc(doc);
    setViewerChunk(doc.chunks[0] || null);
    setIsViewerOpen(true);
  };

  // Flattened array of all vectorized chunks across all documents
  const allIndexedChunks = useMemo(() => {
    return documents.flatMap((d) => d.chunks);
  }, [documents]);

  // Execute RAG Query
  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim() || isLoading || documents.length === 0) return;

    const userMessageId = `msg-${Date.now()}-user`;
    const botMessageId = `msg-${Date.now()}-bot`;
    const startTime = performance.now();

    // Add user message to state
    const userMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Step 1: Vectorize query
      const queryVector = generateLocalEmbedding(queryText);

      // Step 2: Retrieve Top-K chunks via Hybrid Search (Cosine + BM25)
      const retrievalStart = performance.now();
      const retrieved = performHybridRetrieval(
        queryText,
        queryVector,
        allIndexedChunks,
        retrievalConfig.topK,
        retrievalConfig.similarityThreshold,
        retrievalConfig.hybridAlpha
      );
      const retrievalLatencyMs = Math.round(performance.now() - retrievalStart);

      // Step 3: Call Server Grounding API
      const response = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: queryText,
          retrievedChunks: retrieved.map((r) => ({
            id: r.chunk.id,
            docTitle: r.chunk.docTitle,
            chunkIndex: r.chunk.chunkIndex,
            text: r.chunk.text,
            similarity: r.similarity,
          })),
          strictGrounding: retrievalConfig.strictGrounding,
          temperature: retrievalConfig.temperature,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to answer this question');
      const totalLatencyMs = Math.round(performance.now() - startTime);
      const generationLatencyMs = Math.max(1, totalLatencyMs - retrievalLatencyMs);

      // Construct Assistant Message with Provenance
      const botMsg: ChatMessage = {
        id: botMessageId,
        role: 'assistant',
        content: data.answer || 'No response synthesized.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        retrievedChunks: retrieved,
        sourceDocuments: documents.filter(doc => retrieved.some(result => result.chunk.docId === doc.id)),
        citedIndices: data.citedIndices || [1],
        latencyMs: totalLatencyMs,
        retrievalLatencyMs,
        generationLatencyMs,
        modelUsed: data.modelUsed || 'unknown',
        rawPrompt: data.rawPrompt,
        systemInstruction: data.systemInstruction,
      };

      setMessages((prev) => [...prev, botMsg]);
      setSelectedEvidence(retrieved[0]?.chunk || null);
      setSelectedSourceId(retrieved[0]?.chunk.docId || null);
      setSelectedSnapshot(documents.find(doc => doc.id === retrieved[0]?.chunk.docId) || null);
      setEvidenceResults(retrieved);
    } catch (error: any) {
      console.error('RAG query error:', error);
      setEvidenceResults([]);
      const errorMsg: ChatMessage = {
        id: botMessageId,
        role: 'assistant',
        content: `Error synthesizing response: ${error.message || 'Network error'}. Please check if the server is running.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setEvidenceResults([]);
    setSelectedSnapshot(null);
    setSelectedEvidence(null);
  };

  // Last retrieved results for vector visualizer
  const lastBotMsg = [...messages].reverse().find((m) => m.role === 'assistant');
  const lastRetrieved = lastBotMsg?.retrievedChunks || [];
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
  const lastQuery = lastUserMsg?.content || '';

  const evidenceDocument = selectedSnapshot || documents.find(doc => doc.id === selectedSourceId)
    || documents.find(doc => doc.id === lastRetrieved[0]?.chunk.docId)
    || documents[0] || null;
  // Answers retain their source snapshot so later indexing cannot rewrite a citation.
  const evidenceChunk = evidenceDocument?.chunks.find(chunk => chunk.id === selectedEvidence?.id)
    || evidenceDocument?.chunks[0] || null;
  const selectEvidence = (chunk: DocumentChunk) => {
    const answer = messages.find(message => message.retrievedChunks?.some(result => result.chunk === chunk));
    const source = answer?.sourceDocuments?.find(doc => doc.id === chunk.docId)
      || (selectedSnapshot?.chunks.includes(chunk) ? selectedSnapshot : null)
      || documents.find(doc => doc.id === chunk.docId) || null;
    setSelectedSnapshot(source);
    if (answer) setEvidenceResults(answer.retrievedChunks || []);
    setSelectedEvidence(chunk);
    setSelectedSourceId(chunk.docId);
    setMobilePanel('evidence');
  };
  const openDocuments = (view: 'list' | 'upload') => {
    setDocumentView(view);
    setActiveTab('documents');
  };
  const pageDetails = {
    chat: { title: 'Research notebook', description: 'Ask questions across your documents. Read the evidence alongside each answer.' },
    documents: { title: 'Sources', description: 'Add and inspect the documents available to your notebook.' },
    pipeline: { title: 'Retrieval lab', description: 'Explore how documents become searchable passages.' },
    admissions: { title: 'Architecture guide', description: 'The concepts and mechanics behind the retrieval pipeline.' },
    code: { title: 'Code export', description: 'Implementation examples for your own projects.' },
  }[activeTab];

  return (
    <div className="workspace-shell">
      <Header activeTab={activeTab} setActiveTab={tab => { if (tab === 'documents') setDocumentView('list'); setActiveTab(tab); }} documentCount={documents.length} isGeminiConnected={isGeminiConnected} isBusy={isLoading}
        onNewChat={() => { if (!isLoading) { handleClearChat(); setActiveTab('chat'); setMobilePanel('chat'); } }} />
      <main id="main-content" className="workspace-content">
        <div className="notebook-breadcrumb"><span>Workspace</span><ChevronRight size={12} /><span>Document Q&A</span></div>
        <section className="notebook-heading"><div><h1>{pageDetails.title}</h1><p>{pageDetails.description}</p></div><button className="button button-primary" onClick={() => openDocuments('upload')}><Plus size={16} />Add documents</button></section>
        {activeTab === 'chat' && <>
          <div className="mobile-panel-switcher" aria-label="Notebook panels">{(['sources', 'chat', 'evidence'] as const).map(panel => <button key={panel} aria-pressed={mobilePanel === panel} onClick={() => setMobilePanel(panel)}>{panel === 'sources' ? 'Sources (' + documents.length + ')' : panel === 'chat' ? 'Conversation' : 'Evidence'}</button>)}</div>
          <div className="research-grid" data-mobile-panel={mobilePanel}>
            <KnowledgePanel documents={documents} selectedDocumentId={evidenceDocument?.id} onSelectDocument={doc => { setSelectedSnapshot(null); setSelectedSourceId(doc.id); setSelectedEvidence(doc.chunks[0] || null); setMobilePanel('evidence'); }} onAddDocuments={() => openDocuments('upload')} onManageDocuments={() => openDocuments('list')} />
            <ChatInterface messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} retrievalConfig={retrievalConfig} setRetrievalConfig={setRetrievalConfig} onOpenViewerWithChunk={selectEvidence} onClearChat={handleClearChat} documents={documents} />
            <EvidencePanel document={evidenceDocument} chunk={evidenceChunk} results={evidenceResults} hasQuery={Boolean(lastBotMsg?.retrievedChunks)} isHistorical={Boolean(selectedSnapshot && documents.find(doc => doc.id === selectedSnapshot.id) !== selectedSnapshot)} onSelectChunk={selectEvidence} onOpenDocument={doc => { setViewerDoc(doc); setViewerChunk(evidenceChunk); setIsViewerOpen(true); }} />
          </div>
        </>}
        <div className="legacy-surface">
          {activeTab === 'documents' && <DocumentManager key={documentView} initialTab={documentView} documents={documents} onAddDocument={handleAddDocument} onDeleteDocument={handleDeleteDocument} onSelectDocument={handleOpenViewer} onRechunkAll={handleRechunkAll} chunkingConfig={chunkingConfig} setChunkingConfig={setChunkingConfig} onOpenViewer={handleOpenViewer} />}
          {activeTab === 'pipeline' && <div className="space-y-6"><PipelineVisualizer docCount={documents.length} chunkCount={allIndexedChunks.length} /><VectorSpaceVisualizer allChunks={allIndexedChunks} lastQuery={lastQuery} lastRetrievedResults={lastRetrieved} /></div>}
          {activeTab === 'admissions' && <AdmissionsDefense />}
          {activeTab === 'code' && <CodeExporter />}
        </div>
        <footer className="notebook-footer"><span><span className={'connection-dot ' + (serviceStatus === 'online' ? '' : 'connection-muted')} />{serviceStatus === 'checking' ? 'Connecting' : serviceStatus === 'online' ? 'Connected' : 'Server unavailable'}<span className="footer-divider">/</span>{documents.length} sources<span className="footer-divider">/</span>{allIndexedChunks.length} indexed passages</span><span>Built by Arin Ghosh · In-memory session</span></footer>
      </main>
      <DocumentViewerModal isOpen={isViewerOpen} onClose={() => setIsViewerOpen(false)} document={viewerDoc} selectedChunk={viewerChunk} onSelectChunk={setViewerChunk} />
    </div>
  );
}
