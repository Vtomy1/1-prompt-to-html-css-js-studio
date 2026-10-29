import React, { useState } from 'react';
import { GeneratedComponent } from '../types';
import { Copy, Check, Download, Eye, Code, FileText, Sparkles, Terminal, History, Plus, ShieldCheck } from 'lucide-react';
import { LiveSandbox } from './LiveSandbox';
import { A11yAuditPanel } from './A11yAuditPanel';
import { bundleIntoSingleFile } from '../utils/promptBuilder';
import { runAccessibilityAudit } from '../utils/a11yAuditor';

interface CodeInspectorProps {
  component: GeneratedComponent;
  onUpdateComponentCode?: (field: 'html' | 'css' | 'js', value: string) => void;
  onOpenHistory?: () => void;
  snapshotCount?: number;
  onSaveSnapshot?: () => void;
  onShowNotice?: (type: 'error' | 'success', msg: string) => void;
}

type TabType = 'preview' | 'html' | 'css' | 'js' | 'bundle' | 'a11y' | 'prompt';

export const CodeInspector: React.FC<CodeInspectorProps> = ({
  component,
  onUpdateComponentCode,
  onOpenHistory,
  snapshotCount = 0,
  onSaveSnapshot,
  onShowNotice,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('preview');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  // Compute live a11y issue count for tab badge
  const a11ySummary = runAccessibilityAudit(component.html);

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

  const handleCopySpecific = (type: 'html' | 'css' | 'js' | 'bundle' | 'prompt') => {
    let textToCopy = '';
    let label = '';
    if (type === 'html') {
      textToCopy = component.html;
      label = 'HTML';
    } else if (type === 'css') {
      textToCopy = component.css;
      label = 'CSS';
    } else if (type === 'js') {
      textToCopy = component.js;
      label = 'JavaScript';
    } else if (type === 'bundle') {
      textToCopy = fullBundle;
      label = 'Single Bundle';
    } else if (type === 'prompt') {
      textToCopy = component.modelPromptOptimized;
      label = 'Model Prompt';
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedTab(type);
    if (onShowNotice) {
      onShowNotice('success', `Copied ${label} to clipboard!`);
    }
    setTimeout(() => setCopiedTab(null), 2200);
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

  const handleApplyA11yFix = (newHtml: string, notice: string) => {
    if (onUpdateComponentCode) {
      onUpdateComponentCode('html', newHtml);
    }
    if (onShowNotice) {
      onShowNotice('success', notice);
    }
  };

  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case 'html':
        return 'HTML';
      case 'css':
        return 'CSS';
      case 'js':
        return 'JavaScript';
      case 'bundle':
        return 'Bundle';
      case 'prompt':
        return 'Prompt';
      default:
        return 'Code';
    }
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
            <span>Single Bundle</span>
          </button>
          <button
            onClick={() => setActiveTab('a11y')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'a11y'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>A11y Audit</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                a11ySummary.totalIssues === 0
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}
            >
              {a11ySummary.totalIssues === 0 ? '✓' : a11ySummary.totalIssues}
            </span>
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
            <span>Model Prompt</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick-copy individual tabs shortcut group */}
          <div className="hidden lg:flex items-center gap-1 border-r border-slate-800 pr-2 mr-0.5">
            <span className="text-[10px] uppercase font-mono text-slate-500 mr-1">Quick:</span>
            <button
              onClick={() => handleCopySpecific('html')}
              className={`px-2 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                copiedTab === 'html'
                  ? 'bg-orange-950/80 text-orange-200 border border-orange-700'
                  : 'text-orange-400 hover:text-orange-300 hover:bg-slate-800/70'
              }`}
              title="Copy HTML to clipboard"
            >
              {copiedTab === 'html' ? '✓ HTML' : 'HTML'}
            </button>
            <button
              onClick={() => handleCopySpecific('css')}
              className={`px-2 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                copiedTab === 'css'
                  ? 'bg-cyan-950/80 text-cyan-200 border border-cyan-700'
                  : 'text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/70'
              }`}
              title="Copy CSS to clipboard"
            >
              {copiedTab === 'css' ? '✓ CSS' : 'CSS'}
            </button>
            <button
              onClick={() => handleCopySpecific('js')}
              className={`px-2 py-1 text-[11px] font-mono rounded transition-colors cursor-pointer ${
                copiedTab === 'js'
                  ? 'bg-yellow-950/80 text-yellow-200 border border-yellow-700'
                  : 'text-yellow-400 hover:text-yellow-300 hover:bg-slate-800/70'
              }`}
              title="Copy JavaScript to clipboard"
            >
              {copiedTab === 'js' ? '✓ JS' : 'JS'}
            </button>
          </div>

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

          {activeTab !== 'preview' && activeTab !== 'a11y' && (
            <>
              <button
                onClick={() => handleCopySpecific(activeTab as any)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-xs"
                title={`Copy current ${getTabLabel(activeTab)} code to clipboard`}
              >
                {copiedTab === activeTab ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied {getTabLabel(activeTab)}!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy {getTabLabel(activeTab)} to Clipboard</span>
                  </>
                )}
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
        ) : activeTab === 'a11y' ? (
          <A11yAuditPanel
            htmlCode={component.html}
            onApplyFix={handleApplyA11yFix}
          />
        ) : (
          <div className="flex-1 relative flex flex-col bg-slate-950 font-mono text-xs">
            {/* Editor Sub-Header Bar with Dedicated Copy to Clipboard button */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-slate-300 font-semibold">{component.title}</span>
                <span className="text-slate-600">·</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-400 font-bold uppercase font-mono">
                  {getTabLabel(activeTab)}
                </span>
                <span className="text-slate-500 text-[10px] hidden sm:inline">
                  ({getCurrentCode().split('\n').length} lines · {new Blob([getCurrentCode()]).size} bytes)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopySpecific(activeTab as any)}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors cursor-pointer"
                  title={`Copy ${getTabLabel(activeTab)} code to clipboard`}
                >
                  {copiedTab === activeTab ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300 font-bold">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Copy {getTabLabel(activeTab)} to Clipboard</span>
                    </>
                  )}
                </button>
              </div>
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
