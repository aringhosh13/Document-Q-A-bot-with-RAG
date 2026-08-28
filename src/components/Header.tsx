import React from 'react';
import { Bot, Cpu, GraduationCap, Code as Code2, Database, FileText } from 'lucide-react';

interface HeaderProps {
  activeTab: 'chat' | 'pipeline' | 'admissions' | 'code';
  setActiveTab: (tab: 'chat' | 'pipeline' | 'admissions' | 'code') => void;
  documentCount: number;
  chunkCount: number;
  isGeminiConnected: boolean;
}

const TABS = [
  { key: 'chat', label: 'Live Q&A', icon: Bot },
  { key: 'pipeline', label: 'Pipeline', icon: Cpu },
  { key: 'admissions', label: 'Defense Kit', icon: GraduationCap },
  { key: 'code', label: 'Source', icon: Code2 },
] as const;

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  documentCount,
  chunkCount,
  isGeminiConnected,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-800 bg-ink-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-accent-500/15 border border-accent-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4 text-accent-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-sm tracking-tight text-ink-50">
                RAG Engine
              </span>
              <span className="text-[10px] font-mono text-ink-500 hidden sm:inline">
                from scratch
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-0.5 bg-ink-900 p-0.5 rounded-lg border border-ink-800">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-accent-500/15 text-accent-300'
                      : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-ink-900 border border-ink-800 text-ink-300">
              <FileText className="w-3 h-3 text-ink-500" />
              <span className="font-medium text-ink-200">{documentCount}</span>
              <span className="text-ink-500">docs</span>
              <span className="text-ink-700">·</span>
              <Database className="w-3 h-3 text-ink-500" />
              <span className="font-medium text-ink-200">{chunkCount}</span>
              <span className="text-ink-500">chunks</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-ink-900 border border-ink-800">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isGeminiConnected ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span className="text-ink-300 text-[11px]">
                {isGeminiConnected ? 'Gemini' : 'Local'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
