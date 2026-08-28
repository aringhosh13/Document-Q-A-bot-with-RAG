import React from 'react';
import { Bot, Cpu, GraduationCap, Code2, Database, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'chat' | 'pipeline' | 'admissions' | 'code';
  setActiveTab: (tab: 'chat' | 'pipeline' | 'admissions' | 'code') => void;
  documentCount: number;
  chunkCount: number;
  isGeminiConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  documentCount,
  chunkCount,
  isGeminiConnected,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-black/95 backdrop-blur border-b border-ink-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent-500/10 border border-accent-500/30 flex items-center justify-center shadow-lg shadow-accent-500/10 ring-1 ring-accent-400/20">
              <Bot className="w-5 h-5 text-accent-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white font-sans">
                  Grounded RAG Lab
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-accent-950 text-accent-400 border border-accent-800 rounded-full">
                  AI-Assisted Engine
                </span>
              </div>
              <p className="text-xs text-ink-400 hidden sm:block">
                Document Q&A Engine &middot; Vector Math &middot; Hybrid Retrieval &middot; Technical Architecture
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-ink-900 p-1 rounded-xl border border-ink-800">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'chat'
                  ? 'bg-accent-500 text-black font-semibold shadow-sm'
                  : 'text-ink-400 hover:text-white hover:bg-ink-800'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Live Q&A Bot</span>
            </button>

            <button
              onClick={() => setActiveTab('pipeline')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'pipeline'
                  ? 'bg-accent-500 text-black font-semibold shadow-sm'
                  : 'text-ink-400 hover:text-white hover:bg-ink-800'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Pipeline Lab</span>
            </button>

            <button
              onClick={() => setActiveTab('admissions')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'admissions'
                  ? 'bg-accent-500 text-black font-semibold shadow-sm'
                  : 'text-ink-400 hover:text-white hover:bg-ink-800'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Technical Defense</span>
              <span className="sm:hidden">Defense</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'code'
                  ? 'bg-accent-500 text-black font-semibold shadow-sm'
                  : 'text-ink-400 hover:text-white hover:bg-ink-800'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Source Code</span>
            </button>
          </nav>

          {/* Quick Metrics */}
          <div className="hidden lg:flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-ink-900 border border-ink-800 text-ink-300">
              <FileText className="w-3.5 h-3.5 text-accent-400" />
              <span>
                <strong className="text-white font-semibold">{documentCount}</strong> Docs
              </span>
              <span className="text-ink-700">|</span>
              <Database className="w-3.5 h-3.5 text-accent-400" />
              <span>
                <strong className="text-white font-semibold">{chunkCount}</strong> Chunks
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-ink-900 border border-ink-800 text-ink-300">
              <span
                className={`w-2 h-2 rounded-full ${
                  isGeminiConnected ? 'bg-accent-400 animate-pulse' : 'bg-ink-500'
                }`}
              />
              <span className="text-ink-200">
                {isGeminiConnected ? 'Gemini Grounded' : 'Local Vector Engine'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
