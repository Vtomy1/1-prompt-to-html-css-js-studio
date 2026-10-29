import React, { useState } from 'react';
import { GeneratedComponent } from '../types';
import { Copy, Check, Download, Eye, Code, FileText, Sparkles, Terminal, History, Plus } from 'lucide-react';
import { LiveSandbox } from './LiveSandbox';
import { bundleIntoSingleFile } from '../utils/promptBuilder';

interface CodeInspectorProps {
  component: GeneratedComponent;
  onUpdateComponentCode?: (field: 'html' | 'css' | 'js', value: string) => void;
  onOpenHistory?: () => void;
  snapshotCount?: number;
  onSaveSnapshot?: () => void;
}

type TabType = 'preview' | 'html' | 'css' | 'js' | 'bundle' | 'prompt';

export const CodeInspector: React.FC<CodeInspectorProps> = ({
  component,
  onUpdateComponentCode,
  onOpenHistory,
  snapshotCount = 0,
  onSaveSnapshot,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('preview');
  const [copied, setCopied] = useState(false);

  const fullBundle = bundleIntoSingleFile(
    component.title,
    component.html,
    component.css,
    component.js
  );

  const getCurrentCode = () => {
    switch (activeTab) {
      case 'html':
        return component.html;
      case 'css':
        return component.css;
      case 'js':
        return component.js;
      case 'bundle':
        return fullBundle;
      case 'prompt':
        return component.modelPromptOptimized;
      default:
        return fullBundle;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `${component.id || 'component'}.${activeTab === 'css' ? 'css' : activeTab === 'js' ? 'js' : 'html'}`;
    const blob = new Blob([getCurrentCode()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Tab Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Interactive Sandbox</span>
          </button>
          <button
            onClick={() => setActiveTab('html')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'html'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-orange-400" />
            <span>HTML</span>
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'css'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span>CSS</span>
          </button>
          <button
            onClick={() => setActiveTab('js')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'js'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-yellow-400" />
            <span>JavaScript</span>
          </button>
          <button
            onClick={() => setActiveTab('bundle')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'bundle'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Single-File Bundle</span>
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'prompt'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Model Prompt Spec</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors cursor-pointer"
              title="Open iteration version history"
            >
              <History className="w-3.5 h-3.5 text-indigo-400" />
              <span>History</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 text-indigo-300 rounded border border-slate-700">
                {snapshotCount}
              </span>
            </button>
          )}

          {onSaveSnapshot && (
            <button
              onClick={onSaveSnapshot}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors cursor-pointer"
              title="Save a snapshot checkpoint of the current code"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Checkpoint</span>
            </button>
          )}

          {activeTab !== 'preview' && (
            <>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Download this code file"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 flex flex-col min-h-[520px]">
        {activeTab === 'preview' ? (
          <LiveSandbox component={component} />
        ) : (
          <div className="flex-1 relative flex flex-col bg-slate-950 font-mono text-xs">
            <div className="flex items-center justify-between px-4 py-1.5 bg-slate-900/60 border-b border-slate-800 text-[11px] text-slate-400">
              <span>{component.title} · {activeTab.toUpperCase()}</span>
              <span>{getCurrentCode().split('\n').length} lines · {new Blob([getCurrentCode()]).size} bytes</span>
            </div>
            <textarea
              readOnly={!onUpdateComponentCode || activeTab === 'bundle' || activeTab === 'prompt'}
              value={getCurrentCode()}
              onChange={(e) => {
                if (onUpdateComponentCode && (activeTab === 'html' || activeTab === 'css' || activeTab === 'js')) {
                  onUpdateComponentCode(activeTab, e.target.value);
                }
              }}
              spellCheck="false"
              className="flex-1 p-4 bg-transparent text-slate-200 focus:outline-none resize-none leading-relaxed selection:bg-indigo-600/30 overflow-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
};
