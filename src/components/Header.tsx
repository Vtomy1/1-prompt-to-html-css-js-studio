import React from 'react';
import { Download } from 'lucide-react';

interface HeaderProps {
  onExportBundle: () => void;
  activeView: 'workbench' | 'templates' | 'prompt-architect' | 'diagnostics';
  setActiveView: (view: 'workbench' | 'templates' | 'prompt-architect' | 'diagnostics') => void;
  snapshotCount: number;
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onExportBundle,
  activeView,
  setActiveView,
  snapshotCount,
  onOpenHistory,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-900/90 border-b border-slate-800 backdrop-blur sticky top-0 z-50">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2.5 shrink-0">
        <a
          href="/"
          className="text-lg font-bold tracking-tight text-white flex items-center gap-2 whitespace-nowrap shrink-0 hover:text-indigo-400 transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white text-xs font-black shadow-sm">
            FC
          </div>
          <span>FormCraft Studio</span>
        </a>
      </div>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
        <button
          onClick={() => setActiveView('workbench')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeView === 'workbench' ? 'text-indigo-400 font-semibold' : ''
          }`}
        >
          Workbench
        </button>
        <button
          onClick={onOpenHistory}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
        >
          <span>History</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 text-indigo-300 rounded-full border border-slate-700">
            {snapshotCount}
          </span>
        </button>
        <button
          onClick={() => setActiveView('templates')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeView === 'templates' ? 'text-indigo-400 font-semibold' : ''
          }`}
        >
          Template Blueprints
        </button>
        <button
          onClick={() => setActiveView('prompt-architect')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeView === 'prompt-architect' ? 'text-indigo-400 font-semibold' : ''
          }`}
        >
          Multi-Model Prompt Master
        </button>
        <button
          onClick={() => setActiveView('diagnostics')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeView === 'diagnostics' ? 'text-indigo-400 font-semibold' : ''
          }`}
        >
          Validation Audit
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onExportBundle}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-indigo-900/40 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Bundle (.html)</span>
        </button>
      </div>
    </header>
  );
};
