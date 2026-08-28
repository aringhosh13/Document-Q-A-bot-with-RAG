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
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  RAG From Scratch
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800/80 rounded-full">
                  Portfolio Edition
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Document Q&A Engine &middot; Vector Math &middot; Hybrid Retrieval &middot; Admissions Defense
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'chat'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Live Q&A Bot</span>
            </button>

            <button
              onClick={() => setActiveTab('pipeline')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'pipeline'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Pipeline Lab</span>
            </button>

            <button
              onClick={() => setActiveTab('admissions')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'admissions'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Admissions Defense</span>
              <span className="sm:hidden">Defense</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'code'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Source Code</span>
            </button>
          </nav>

          {/* Quick Metrics */}
          <div className="hidden lg:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/70 border border-slate-700/60 text-slate-300">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                <strong className="text-white font-semibold">{documentCount}</strong> Docs
              </span>
              <span className="text-slate-500">|</span>
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                <strong className="text-white font-semibold">{chunkCount}</strong> Chunks
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/70 border border-slate-700/60 text-slate-300">
              <span
                className={`w-2 h-2 rounded-full ${
                  isGeminiConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-slate-300">
                {isGeminiConnected ? 'Gemini 3.7 Grounded' : 'Local Vector Engine'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
