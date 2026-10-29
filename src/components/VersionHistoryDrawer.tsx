import React, { useState } from 'react';
import { CodeSnapshot, GeneratedComponent } from '../types';
import {
  History,
  RotateCcw,
  Plus,
  Trash2,
  X,
  FileCode,
  Download,
  Eye,
  Check,
  ChevronRight,
  GitBranch,
  Clock,
  Sparkles
} from 'lucide-react';
import { bundleIntoSingleFile } from '../utils/promptBuilder';

interface VersionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  snapshots: CodeSnapshot[];
  activeSnapshotId: string | null;
  onRestore: (snapshot: CodeSnapshot) => void;
  onSaveManualSnapshot: (label?: string) => void;
  onDeleteSnapshot: (id: string) => void;
  onClearHistory: () => void;
  currentComponent: GeneratedComponent;
}

export const VersionHistoryDrawer: React.FC<VersionHistoryDrawerProps> = ({
  isOpen,
  onClose,
  snapshots,
  activeSnapshotId,
  onRestore,
  onSaveManualSnapshot,
  onDeleteSnapshot,
  onClearHistory,
  currentComponent,
}) => {
  const [selectedSnapshot, setSelectedSnapshot] = useState<CodeSnapshot | null>(null);
  const [newLabelInput, setNewLabelInput] = useState('');
  const [isAddingCheckpoint, setIsAddingCheckpoint] = useState(false);
  const [previewTab, setPreviewTab] = useState<'sandbox' | 'html' | 'css' | 'js'>('sandbox');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeOrPreview = selectedSnapshot || snapshots[0] || null;

  const handleCreateCheckpoint = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveManualSnapshot(newLabelInput.trim() || undefined);
    setNewLabelInput('');
    setIsAddingCheckpoint(false);
  };

  const handleDownloadSnapshot = (snap: CodeSnapshot) => {
    const fullHtml = bundleIntoSingleFile(
      snap.component.title,
      snap.component.html,
      snap.component.css,
      snap.component.js
    );
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${snap.component.id || 'snapshot'}-v${snap.timestamp}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatTimestamp = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getTriggerBadge = (trigger: CodeSnapshot['trigger']) => {
    switch (trigger) {
      case 'generate':
        return { label: 'AI Generated', class: 'text-indigo-400 bg-indigo-950/70 border-indigo-800/60' };
      case 'blueprint':
        return { label: 'Blueprint', class: 'text-cyan-400 bg-cyan-950/70 border-cyan-800/60' };
      case 'manual':
        return { label: 'Checkpoint', class: 'text-emerald-400 bg-emerald-950/70 border-emerald-800/60' };
      case 'edit':
        return { label: 'Code Edit', class: 'text-amber-400 bg-amber-950/70 border-amber-800/60' };
      default:
        return { label: 'Snapshot', class: 'text-slate-400 bg-slate-900 border-slate-700' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs">
      <div className="relative w-full max-w-5xl h-[88vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Version History & Iteration Snapshots</span>
                <span className="text-xs font-mono font-normal text-slate-400 px-2 py-0.5 bg-slate-800 rounded">
                  {snapshots.length} {snapshots.length === 1 ? 'Snapshot' : 'Snapshots'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Toggle between previous iterations, compare diffs, or restore past code states.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isAddingCheckpoint ? (
              <button
                onClick={() => setIsAddingCheckpoint(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Current Checkpoint</span>
              </button>
            ) : null}

            {snapshots.length > 1 && (
              <button
                onClick={onClearHistory}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Clear all snapshot history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Optional Add Checkpoint Form */}
        {isAddingCheckpoint && (
          <form
            onSubmit={handleCreateCheckpoint}
            className="px-6 py-3 bg-slate-950/90 border-b border-indigo-900/40 flex items-center gap-3 shrink-0"
          >
            <input
              type="text"
              value={newLabelInput}
              onChange={(e) => setNewLabelInput(e.target.value)}
              placeholder="Enter snapshot description (e.g. 'Before refactoring password validation')..."
              autoFocus
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
            >
              Save Snapshot
            </button>
            <button
              type="button"
              onClick={() => setIsAddingCheckpoint(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </form>
        )}

        {/* Content: 2-column split (Timeline List on Left, Preview/Inspect on Right) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
          {/* Left Column: Timeline Snapshots (5 cols) */}
          <div className="md:col-span-5 border-r border-slate-800 flex flex-col bg-slate-950/40 overflow-y-auto p-4 space-y-2.5">
            {snapshots.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                <History className="w-8 h-8 mx-auto mb-2 opacity-30" />
                No snapshots saved yet. Generate code or save a checkpoint to start tracking iterations.
              </div>
            ) : (
              snapshots.map((snap, idx) => {
                const isSelected = selectedSnapshot ? selectedSnapshot.id === snap.id : idx === 0;
                const badge = getTriggerBadge(snap.trigger);
                const isCurrentActive = snap.component.html === currentComponent.html && snap.component.css === currentComponent.css && snap.component.js === currentComponent.js;

                return (
                  <div
                    key={snap.id}
                    onClick={() => setSelectedSnapshot(snap)}
                    className={`p-3.5 rounded-xl border transition-all text-left cursor-pointer relative ${
                      isSelected
                        ? 'bg-slate-900 border-indigo-500 ring-1 ring-indigo-500/50 shadow-md'
                        : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${badge.class}`}>
                        {badge.label}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{formatTimestamp(snap.timestamp)}</span>
                      </div>
                    </div>

                    <div className="font-semibold text-xs text-white mb-1 truncate">
                      {snap.label}
                    </div>

                    <div className="text-[11px] text-slate-400 truncate mb-2">
                      {snap.component.title}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                      <div>
                        {snap.stats.htmlLines} HTML · {snap.stats.cssLines} CSS · {snap.stats.jsLines} JS
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onRestore(snap)}
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer ${
                            isCurrentActive
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                              : 'bg-indigo-600 text-white hover:bg-indigo-500'
                          }`}
                          title="Restore this iteration into your active workspace"
                        >
                          {isCurrentActive ? 'Active' : 'Restore'}
                        </button>

                        <button
                          onClick={() => handleDownloadSnapshot(snap)}
                          className="p-1 hover:text-slate-200 text-slate-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                          title="Download this snapshot as HTML bundle"
                        >
                          <Download className="w-3 h-3" />
                        </button>

                        {snapshots.length > 1 && (
                          <button
                            onClick={() => onDeleteSnapshot(snap.id)}
                            className="p-1 hover:text-rose-400 text-slate-500 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Delete this snapshot"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Selected Snapshot Inspector / Preview (7 cols) */}
          <div className="md:col-span-7 flex flex-col bg-slate-950 min-h-0">
            {activeOrPreview ? (
              <>
                {/* Preview Toolbar */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 shrink-0">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPreviewTab('sandbox')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                        previewTab === 'sandbox' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Live Snapshot Preview</span>
                    </button>
                    <button
                      onClick={() => setPreviewTab('html')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                        previewTab === 'html' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>HTML</span>
                    </button>
                    <button
                      onClick={() => setPreviewTab('css')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                        previewTab === 'css' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>CSS</span>
                    </button>
                    <button
                      onClick={() => setPreviewTab('js')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                        previewTab === 'js' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>JavaScript</span>
                    </button>
                  </div>

                  <button
                    onClick={() => onRestore(activeOrPreview)}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore This Version</span>
                  </button>
                </div>

                {/* Body: Live Iframe or Code */}
                <div className="flex-1 min-h-0 overflow-auto bg-slate-950 p-3">
                  {previewTab === 'sandbox' ? (
                    <div className="w-full h-full min-h-[420px] rounded-xl overflow-hidden border border-slate-800 bg-black">
                      <iframe
                        srcDoc={bundleIntoSingleFile(
                          activeOrPreview.component.title,
                          activeOrPreview.component.html,
                          activeOrPreview.component.css,
                          activeOrPreview.component.js
                        )}
                        title="Snapshot Sandbox"
                        sandbox="allow-scripts allow-forms allow-same-origin"
                        className="w-full h-full min-h-[420px] border-none"
                      />
                    </div>
                  ) : (
                    <pre className="font-mono text-xs text-slate-300 leading-relaxed p-4 bg-slate-900/60 rounded-xl border border-slate-800 overflow-auto h-full selection:bg-indigo-600/30">
                      {previewTab === 'html'
                        ? activeOrPreview.component.html
                        : previewTab === 'css'
                        ? activeOrPreview.component.css
                        : activeOrPreview.component.js}
                    </pre>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                Select a snapshot to preview
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
