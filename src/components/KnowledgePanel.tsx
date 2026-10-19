import React, { useState } from 'react';
import { ArrowUpRight, FileSearch, FileText, Plus, Search } from 'lucide-react';
import { DocumentItem } from '../types';

interface KnowledgePanelProps {
  documents: DocumentItem[];
  selectedDocumentId?: string;
  onSelectDocument: (document: DocumentItem) => void;
  onAddDocuments: () => void;
  onManageDocuments: () => void;
}

export function KnowledgePanel({ documents, selectedDocumentId, onSelectDocument, onAddDocuments, onManageDocuments }: KnowledgePanelProps) {
  const [search, setSearch] = useState('');
  const filteredDocuments = documents.filter(doc => doc.title.toLowerCase().includes(search.toLowerCase()));

  return <section className="sources-panel notebook-panel" aria-labelledby="sources-heading">
    <div className="panel-heading"><h2 id="sources-heading">Sources <span className="count-label">{documents.length}</span></h2><button className="icon-button" onClick={onAddDocuments} aria-label="Add sources"><Plus size={17} /></button></div>
    <label className="source-search"><Search size={15} /><input aria-label="Search sources" placeholder="Search your sources" value={search} onChange={event => setSearch(event.target.value)} /></label>
    <div className="source-list">
      {filteredDocuments.map(doc => <button className={'source-item' + (selectedDocumentId === doc.id ? ' is-selected' : '')} aria-pressed={selectedDocumentId === doc.id} key={doc.id} onClick={() => onSelectDocument(doc)}>
        <span className="source-type"><FileText size={16} strokeWidth={1.6} /><span>{doc.fileType === 'md' ? 'MARKDOWN' : doc.fileType.toUpperCase()}</span></span>
        <strong>{doc.title}</strong>
        <p>{doc.summary}</p>
        <small>{doc.chunks.length} passages<span>·</span>{doc.wordCount.toLocaleString()} words<ArrowUpRight size={12} /></small>
      </button>)}
      {filteredDocuments.length === 0 && <div className="source-empty"><FileSearch size={24} /><p>{documents.length ? 'No matching sources' : 'No sources yet'}</p><small>{documents.length ? 'Try another title.' : 'Add a document to start your notebook.'}</small></div>}
    </div>
    <div className="source-panel-footer"><button className="button button-outline" onClick={onAddDocuments}><Plus size={15} />Add documents</button><button className="text-button" onClick={onManageDocuments}>Manage sources<ArrowUpRight size={13} /></button><p>Documents are kept in this browser session.</p></div>
  </section>;
}
