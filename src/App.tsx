import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptWorkbench } from './components/PromptWorkbench';
import { CodeInspector } from './components/CodeInspector';
import { ValidationAuditor } from './components/ValidationAuditor';
import { PromptArchitectView } from './components/PromptArchitectView';
import { TemplateGalleryView } from './components/TemplateGalleryView';
import { CURATED_TEMPLATES } from './data/templates';
import { TargetModel, StylingTechnique, LayoutStructure, GeneratedComponent, CodeSnapshot } from './types';
import { bundleIntoSingleFile } from './utils/promptBuilder';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { VersionHistoryDrawer } from './components/VersionHistoryDrawer';

const createSnapshotObject = (
  comp: GeneratedComponent,
  label: string,
  trigger: CodeSnapshot['trigger']
): CodeSnapshot => ({
  id: 'snap-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
  timestamp: Date.now(),
  label,
  trigger,
  component: { ...comp },
  stats: {
    htmlLines: comp.html.split('\n').length,
    cssLines: comp.css.split('\n').length,
    jsLines: comp.js.split('\n').length,
    totalBytes: new Blob([comp.html + comp.css + comp.js]).size,
  },
});

export default function App() {
  const [activeView, setActiveView] = useState<'workbench' | 'templates' | 'prompt-architect' | 'diagnostics'>('workbench');
  const [currentComponent, setCurrentComponent] = useState<GeneratedComponent>(CURATED_TEMPLATES[0]);
  const [currentPrompt, setCurrentPrompt] = useState(
    'Modern SaaS registration split layout with email check and 4-tier password strength meter'
  );
  const [targetModel, setTargetModel] = useState<TargetModel>('Universal (All Models)');
  const [styling, setStyling] = useState<StylingTechnique>('Modern CSS Grid & Flexbox (Zero Dependencies)');
  const [layout, setLayout] = useState<LayoutStructure>('Responsive Split (Media / Info + Form)');
  const [selectedRules, setSelectedRules] = useState<string[]>([
    'rfc-email',
    'entropy-password',
    'realtime-feedback',
    'aria-live',
    'async-spinner',
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notification, setNotification] = useState<{ type: 'error' | 'success'; message: string } | null>(null);
  const [hasApiKey, setHasApiKey] = useState(true);

  // Version History State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [snapshots, setSnapshots] = useState<CodeSnapshot[]>(() => {
    try {
      const saved = localStorage.getItem('formcraft_snapshots');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    // Initial snapshot from default template
    return [createSnapshotObject(CURATED_TEMPLATES[0], 'Initial: SaaS Workspace Onboarding', 'blueprint')];
  });

  // Sync snapshots to local storage
  useEffect(() => {
    try {
      localStorage.setItem('formcraft_snapshots', JSON.stringify(snapshots));
    } catch (e) {
      console.warn('Failed to save snapshots to localStorage:', e);
    }
  }, [snapshots]);

  // Check backend server status
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.hasApiKey === 'boolean') {
          setHasApiKey(data.hasApiKey);
        }
      })
      .catch(() => {
        // Dev server fallback
      });
  }, []);

  const toggleRule = (ruleId: string) => {
    setSelectedRules((prev) =>
      prev.includes(ruleId) ? prev.filter((r) => r !== ruleId) : [...prev, ruleId]
    );
  };

  const addSnapshot = (
    comp: GeneratedComponent,
    label: string,
    trigger: CodeSnapshot['trigger']
  ) => {
    const snap = createSnapshotObject(comp, label, trigger);
    setSnapshots((prev) => [snap, ...prev.slice(0, 29)]);
  };

  const handleSaveManualSnapshot = (customLabel?: string) => {
    const label = customLabel || `Checkpoint: ${currentComponent.title}`;
    addSnapshot(currentComponent, label, 'manual');
    showNotification('success', `Saved checkpoint: "${label}"`);
  };

  const handleRestoreSnapshot = (snapshot: CodeSnapshot) => {
    setCurrentComponent({ ...snapshot.component });
    setIsHistoryOpen(false);
    showNotification('success', `Restored to version: "${snapshot.label}"`);
  };

  const handleDeleteSnapshot = (id: string) => {
    setSnapshots((prev) => prev.filter((s) => s.id !== id));
    showNotification('success', 'Snapshot removed.');
  };

  const handleClearHistory = () => {
    const currentSnap = createSnapshotObject(currentComponent, `Active: ${currentComponent.title}`, 'manual');
    setSnapshots([currentSnap]);
    showNotification('success', 'Snapshot history cleared.');
  };

  const handleExportBundle = () => {
    const fullHtml = bundleIntoSingleFile(
      currentComponent.title,
      currentComponent.html,
      currentComponent.css,
      currentComponent.js
    );
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentComponent.id || 'component'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('success', 'Full HTML bundle downloaded successfully.');
  };

  const showNotification = (type: 'error' | 'success', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentPrompt,
          targetModel,
          stylingStyle: styling,
          layoutType: layout,
          validationRules: selectedRules,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error generating code.');
      }

      const data = await response.json();
      const newComp: GeneratedComponent = {
        id: 'ai-generated-' + Date.now(),
        title: data.title || 'AI Generated Component',
        description: data.description || 'Generated from prompt: ' + currentPrompt,
        category: 'AI Generated',
        html: data.html,
        css: data.css,
        js: data.js,
        explanation: data.explanation || '',
        modelPromptOptimized: data.modelPromptOptimized || '',
        validationHighlights: data.validationHighlights || [],
      };

      setCurrentComponent(newComp);
      addSnapshot(newComp, `AI Iteration: ${newComp.title}`, 'generate');
      showNotification('success', 'Component generated & saved to version history!');
      setActiveView('workbench');
    } catch (err: any) {
      console.warn('AI generation error, falling back to blueprint generator:', err);
      // If server error or no key, match closest curated template or synthesize
      const matched = CURATED_TEMPLATES.find(
        (t) =>
          currentPrompt.toLowerCase().includes(t.category.toLowerCase()) ||
          currentPrompt.toLowerCase().includes(t.title.toLowerCase())
      ) || CURATED_TEMPLATES[0];

      setCurrentComponent(matched);
      addSnapshot(matched, `Blueprint: ${matched.title}`, 'blueprint');
      showNotification(
        'error',
        err.message || 'Could not generate with Gemini. Loaded matching production blueprint.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateComponentCode = (field: 'html' | 'css' | 'js', value: string) => {
    setCurrentComponent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLoadPromptIntoWorkbench = (
    prompt: string,
    model: TargetModel,
    stylingStyle: StylingTechnique,
    layoutStyle: LayoutStructure
  ) => {
    setCurrentPrompt(prompt);
    setTargetModel(model);
    setStyling(stylingStyle);
    setLayout(layoutStyle);
    setActiveView('workbench');
    showNotification('success', 'Prompt loaded into workbench ready for generation!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Header
        onExportBundle={handleExportBundle}
        activeView={activeView}
        setActiveView={setActiveView}
        snapshotCount={snapshots.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Version History Drawer Modal */}
      <VersionHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        snapshots={snapshots}
        activeSnapshotId={currentComponent.id}
        onRestore={handleRestoreSnapshot}
        onSaveManualSnapshot={handleSaveManualSnapshot}
        onDeleteSnapshot={handleDeleteSnapshot}
        onClearHistory={handleClearHistory}
        currentComponent={currentComponent}
      />

      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-md transition-all text-xs font-medium ${
            notification.type === 'error'
              ? 'bg-rose-950/90 border-rose-800 text-rose-200'
              : 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="p-1 hover:bg-white/10 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main App Container */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* VIEW 1: Workbench (Split: Generator Left + Inspector/Sandbox Right) */}
        {activeView === 'workbench' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Prompt Workbench & Controls (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <PromptWorkbench
                currentPrompt={currentPrompt}
                setCurrentPrompt={setCurrentPrompt}
                targetModel={targetModel}
                setTargetModel={setTargetModel}
                styling={styling}
                setStyling={setStyling}
                layout={layout}
                setLayout={setLayout}
                selectedRules={selectedRules}
                toggleRule={toggleRule}
                onGenerateAI={handleGenerateAI}
                isGenerating={isGenerating}
                onSelectTemplate={(tmpl) => {
                  setCurrentComponent(tmpl);
                  addSnapshot(tmpl, `Blueprint: ${tmpl.title}`, 'blueprint');
                  showNotification('success', `Loaded "${tmpl.title}" into sandbox.`);
                }}
                selectedTemplateId={currentComponent.id}
                hasApiKey={hasApiKey}
              />

              <ValidationAuditor component={currentComponent} />
            </div>

            {/* Right Column: Code Inspector & Live Sandbox (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <CodeInspector
                component={currentComponent}
                onUpdateComponentCode={handleUpdateComponentCode}
                onOpenHistory={() => setIsHistoryOpen(true)}
                snapshotCount={snapshots.length}
                onSaveSnapshot={() => handleSaveManualSnapshot()}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: Template Blueprints Gallery */}
        {activeView === 'templates' && (
          <TemplateGalleryView
            onSelect={(tmpl) => {
              setCurrentComponent(tmpl);
              addSnapshot(tmpl, `Blueprint: ${tmpl.title}`, 'blueprint');
              setActiveView('workbench');
              showNotification('success', `Loaded "${tmpl.title}" into sandbox.`);
            }}
            selectedId={currentComponent.id}
          />
        )}

        {/* VIEW 3: Multi-Model Prompt Master */}
        {activeView === 'prompt-architect' && (
          <PromptArchitectView onLoadIntoWorkbench={handleLoadPromptIntoWorkbench} />
        )}

        {/* VIEW 4: Dedicated Diagnostics View */}
        {activeView === 'diagnostics' && (
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
            <ValidationAuditor component={currentComponent} />
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-xs text-slate-300">
              <h3 className="text-sm font-bold text-white mb-2">About Universal Model Compatibility</h3>
              <p className="leading-relaxed text-slate-400 mb-4">
                Different Large Language Models (LLMs) have varied defaults for code generation. When prompted without explicit guardrails, models frequently hallucinate non-existent NPM packages or omit critical validation event listeners. FormCraft Studio's prompt architecture enforces standard HTML5 Constraint Validation APIs, CSS Custom Properties, and ES6+ event listeners so that every model produces immediately runnable, zero-dependency code.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-indigo-400 font-bold mb-1">HTML5 Standard</div>
                  <div className="text-slate-500">novalidate + ARIA Live + semantic inputs</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-cyan-400 font-bold mb-1">CSS3 Token System</div>
                  <div className="text-slate-500">--variables + clamp() + Grid/Flex</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-yellow-400 font-bold mb-1">ES6+ Vanilla</div>
                  <div className="text-slate-500">addEventListener + Regex + Luhn check</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-900 px-6 py-4 text-center text-xs text-slate-500">
        FormCraft Studio · Prompt to HTML, CSS & JavaScript with Responsive Layout & Interactive Form Validation · Universal Model Standard
      </footer>
    </div>
  );
}
