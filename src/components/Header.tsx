import React from 'react';
import { BookOpen, Database, GitBranch, MessageSquare, Code2, ArrowUpRight, Plus } from 'lucide-react';

export type WorkspaceTab = 'chat' | 'documents' | 'pipeline' | 'admissions' | 'code';

interface HeaderProps {
  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;
  documentCount: number;
  isGeminiConnected: boolean;
  onNewChat: () => void;
  isBusy: boolean;
}

const navigation = [
  { id: 'chat', label: 'Research', icon: MessageSquare },
  { id: 'documents', label: 'Sources', icon: Database },
  { id: 'pipeline', label: 'Retrieval lab', icon: GitBranch },
  { id: 'admissions', label: 'Guide', icon: BookOpen },
  { id: 'code', label: 'Code', icon: Code2 },
] as const;

export function Header({ activeTab, setActiveTab, documentCount, isGeminiConnected, onNewChat, isBusy }: HeaderProps) {
  return <header className="app-header">
    <a href="#main-content" className="skip-link">Skip to notebook</a>
    <button className="app-brand" onClick={() => setActiveTab('chat')} aria-label="Grounded home"><BookOpen size={23} strokeWidth={1.7} /><span>Grounded</span></button>
    <nav className="app-navigation" aria-label="Workspace navigation">
      {navigation.map(({ id, label, icon: Icon }) => <button key={id} aria-current={activeTab === id ? 'page' : undefined} onClick={() => setActiveTab(id)}><Icon size={15} strokeWidth={1.6} /><span>{label}</span>{id === 'documents' && <small>{documentCount}</small>}</button>)}
    </nav>
    <div className="header-actions"><span className="model-label"><span className="connection-dot" />{isGeminiConnected ? 'Gemini configured' : 'Local synthesis'}</span><button className="button button-outline new-conversation" onClick={onNewChat} disabled={isBusy}><Plus size={15} />New conversation<ArrowUpRight size={13} /></button></div>
  </header>;
}
