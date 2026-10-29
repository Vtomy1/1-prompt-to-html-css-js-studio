import React, { useRef, useEffect, useState } from 'react';
import { GeneratedComponent, ViewportMode } from '../types';
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Zap,
  Code2,
  Palette,
  Columns,
  Maximize2
} from 'lucide-react';
import { bundleIntoSingleFile } from '../utils/promptBuilder';

interface SplitPanePreviewProps {
  component: GeneratedComponent;
  onUpdateComponentCode?: (field: 'html' | 'css' | 'js', value: string) => void;
  onShowNotice?: (type: 'error' | 'success', msg: string) => void;
}

export const SplitPanePreview: React.FC<SplitPanePreviewProps> = ({
  component,
  onUpdateComponentCode,
  onShowNotice,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [editorTab, setEditorTab] = useState<'css' | 'html' | 'js'>('css');
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [copied, setCopied] = useState(false);
  const [splitRatio, setSplitRatio] = useState<'50-50' | '40-60' | '60-40'>('50-50');
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Full HTML for initial load and full resets
  const fullHtml = bundleIntoSingleFile(
    component.title,
    component.html,
    component.css,
    component.js
  );

  // REAL-TIME CSS INJECTION:
  // When component.css changes, we directly update the <style id="live-component-styles"> in the iframe DOM!
  // This updates styling instantaneously in 0ms without reloading the iframe or losing form state.
  useEffect(() => {
    if (!iframeRef.current?.contentDocument) return;
    try {
      const doc = iframeRef.current.contentDocument;
      const styleEl = doc.getElementById('live-component-styles');
      if (styleEl) {
        styleEl.textContent = component.css;
        setIsLiveActive(true);
        const timer = setTimeout(() => setIsLiveActive(false), 800);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn('Real-time CSS injection error:', e);
    }
  }, [component.css]);

  // When HTML or JS is updated, reload iframe if needed
  useEffect(() => {
    // When html changes, reload iframe so new markup is parsed
    setReloadKey((prev) => prev + 1);
  }, [component.html, component.js]);

  const handleCopyCurrent = () => {
    const text = editorTab === 'css' ? component.css : editorTab === 'html' ? component.html : component.js;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onShowNotice) {
      onShowNotice('success', `Copied ${editorTab.toUpperCase()} to clipboard!`);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestFillValid = () => {
    if (!iframeRef.current?.contentWindow) return;
    try {
      const doc = iframeRef.current.contentDocument;
      if (!doc) return;

      const nameInput = doc.querySelector<HTMLInputElement>('input[type="text"], #fullName, #cardName, #attendeeName');
      if (nameInput) {
        nameInput.value = 'Sarah Connor';
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      const emailInput = doc.querySelector<HTMLInputElement>('input[type="email"], #workEmail, #attendeeEmail');
      if (emailInput) {
        emailInput.value = 'sarah.connor@cyberdyne.corp';
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        emailInput.dispatchEvent(new Event('blur', { bubbles: true }));
      }

      const pwInput = doc.querySelector<HTMLInputElement>('input[type="password"]:not(#cardCvv)');
      if (pwInput) {
        pwInput.value = 'SecureP@ssw0rd2026!';
        pwInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      const terms = doc.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (terms) {
        terms.checked = true;
        terms.dispatchEvent(new Event('change', { bubbles: true }));
      }

      const cardNum = doc.querySelector<HTMLInputElement>('#cardNumber');
      if (cardNum) {
        cardNum.value = '4532 8192 3819 8921';
        cardNum.dispatchEvent(new Event('input', { bubbles: true }));
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleTestTriggerErrors = () => {
    if (!iframeRef.current?.contentWindow) return;
    try {
      const doc = iframeRef.current.contentDocument;
      if (!doc) return;
      const form = doc.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // Quick CSS Theme Preset Applicator to demonstrate instant visual changes
  const applyColorTheme = (primaryColor: string, bgColor?: string) => {
    if (!onUpdateComponentCode) return;
    let newCss = component.css;

    // Update primary color variables if present
    if (newCss.includes('--fc-primary:') || newCss.includes('--p-primary:') || newCss.includes('--sb-accent:') || newCss.includes('--s-primary:')) {
      newCss = newCss
        .replace(/--fc-primary:\s*[^;]+;/g, `--fc-primary: ${primaryColor};`)
        .replace(/--fc-primary-hover:\s*[^;]+;/g, `--fc-primary-hover: ${primaryColor};`)
        .replace(/--p-primary:\s*[^;]+;/g, `--p-primary: ${primaryColor};`)
        .replace(/--sb-accent:\s*[^;]+;/g, `--sb-accent: ${primaryColor};`)
        .replace(/--s-primary:\s*[^;]+;/g, `--s-primary: ${primaryColor};`);
    } else {
      newCss = `:root { --primary: ${primaryColor}; }\n` + newCss;
    }

    if (bgColor) {
      newCss = newCss
        .replace(/--fc-bg:\s*[^;]+;/g, `--fc-bg: ${bgColor};`)
        .replace(/--p-bg:\s*[^;]+;/g, `--p-bg: ${bgColor};`)
        .replace(/--sb-bg:\s*[^;]+;/g, `--sb-bg: ${bgColor};`)
        .replace(/--s-bg:\s*[^;]+;/g, `--s-bg: ${bgColor};`);
    }

    onUpdateComponentCode('css', newCss);
    if (onShowNotice) {
      onShowNotice('success', `Applied live theme (${primaryColor})!`);
    }
  };

  const getContainerWidth = () => {
    switch (viewport) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      default:
        return '100%';
    }
  };

  const getLeftColSpan = () => {
    if (splitRatio === '40-60') return 'lg:w-[40%]';
    if (splitRatio === '60-40') return 'lg:w-[60%]';
    return 'lg:w-[50%]';
  };

  const getRightColSpan = () => {
    if (splitRatio === '40-60') return 'lg:w-[60%]';
    if (splitRatio === '60-40') return 'lg:w-[40%]';
    return 'lg:w-[50%]';
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Top Split-Pane Control Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <Columns className="w-3.5 h-3.5 text-indigo-400" />
            <span>Split-Pane Real-Time Studio</span>
          </div>
          <span className="text-slate-600">·</span>
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <span
              className={`w-2 h-2 rounded-full transition-colors ${
                isLiveActive ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500'
              }`}
            />
            <span className="text-emerald-400 font-semibold">Real-Time CSS Synced</span>
          </div>
        </div>

        {/* Quick Styling Themes & Split Ratio */}
        <div className="flex items-center gap-2">
          {/* Quick theme colors */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-slate-400 border-r border-slate-800 pr-2 mr-1">
            <Palette className="w-3.5 h-3.5 text-slate-400 mr-0.5" />
            <button
              onClick={() => applyColorTheme('#4f46e5', '#090d16')}
              className="w-3.5 h-3.5 rounded-full bg-indigo-600 hover:scale-125 transition-transform cursor-pointer"
              title="Indigo Theme"
            />
            <button
              onClick={() => applyColorTheme('#10b981', '#061712')}
              className="w-3.5 h-3.5 rounded-full bg-emerald-500 hover:scale-125 transition-transform cursor-pointer"
              title="Emerald Theme"
            />
            <button
              onClick={() => applyColorTheme('#f59e0b', '#171206')}
              className="w-3.5 h-3.5 rounded-full bg-amber-500 hover:scale-125 transition-transform cursor-pointer"
              title="Amber Theme"
            />
            <button
              onClick={() => applyColorTheme('#ec4899', '#170612')}
              className="w-3.5 h-3.5 rounded-full bg-pink-500 hover:scale-125 transition-transform cursor-pointer"
              title="Pink Theme"
            />
            <button
              onClick={() => applyColorTheme('#38bdf8', '#08111c')}
              className="w-3.5 h-3.5 rounded-full bg-sky-400 hover:scale-125 transition-transform cursor-pointer"
              title="Sky Blue Theme"
            />
          </div>

          {/* Split Ratio toggle */}
          <div className="hidden md:flex items-center gap-1 p-0.5 bg-slate-900 border border-slate-800 rounded-md text-[10px] font-mono">
            <button
              onClick={() => setSplitRatio('50-50')}
              className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                splitRatio === '50-50' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              50/50
            </button>
            <button
              onClick={() => setSplitRatio('40-60')}
              className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                splitRatio === '40-60' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              40/60
            </button>
            <button
              onClick={() => setSplitRatio('60-40')}
              className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                splitRatio === '60-40' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              60/40
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Body: Left Editor Pane + Right Live Preview Pane */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-[580px] overflow-hidden">
        {/* LEFT PANE: Real-Time Code Editor */}
        <div className={`flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950 ${getLeftColSpan()} transition-all duration-200`}>
          {/* Sub-tabs header for Left Editor Pane */}
          <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setEditorTab('css')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  editorTab === 'css'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-cyan-200" />
                <span>CSS (Live Styles)</span>
              </button>
              <button
                onClick={() => setEditorTab('html')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  editorTab === 'html'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>HTML</span>
              </button>
              <button
                onClick={() => setEditorTab('js')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  editorTab === 'js'
                    ? 'bg-yellow-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>JS</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCurrent}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors cursor-pointer"
                title={`Copy ${editorTab.toUpperCase()} code`}
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-indigo-400" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Code input textarea */}
          <div className="flex-1 relative flex flex-col min-h-[260px] lg:min-h-0 bg-slate-950 font-mono text-xs">
            <div className="px-3 py-1 bg-slate-900/40 border-b border-slate-800/80 text-[10px] font-mono text-slate-500 flex justify-between items-center">
              <span>Edit {editorTab.toUpperCase()} below to update preview instantly:</span>
              <span>
                {editorTab === 'css'
                  ? component.css.split('\n').length
                  : editorTab === 'html'
                  ? component.html.split('\n').length
                  : component.js.split('\n').length}{' '}
                lines
              </span>
            </div>
            <textarea
              value={editorTab === 'css' ? component.css : editorTab === 'html' ? component.html : component.js}
              onChange={(e) => {
                if (onUpdateComponentCode) {
                  onUpdateComponentCode(editorTab, e.target.value);
                }
              }}
              spellCheck="false"
              className="flex-1 p-3.5 bg-transparent text-slate-200 focus:outline-none resize-none leading-relaxed selection:bg-indigo-600/30 overflow-auto font-mono text-xs"
            />
          </div>
        </div>

        {/* RIGHT PANE: Real-Time Live Sandbox Preview */}
        <div className={`flex flex-col bg-slate-950/60 ${getRightColSpan()} min-h-[300px] lg:min-h-0 transition-all duration-200`}>
          {/* Preview Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-slate-900/90 border-b border-slate-800 shrink-0">
            {/* Viewport controls */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded-lg">
              <button
                onClick={() => setViewport('desktop')}
                className={`p-1 text-xs rounded transition-colors cursor-pointer ${
                  viewport === 'desktop' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Desktop View (100%)"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport('tablet')}
                className={`p-1 text-xs rounded transition-colors cursor-pointer ${
                  viewport === 'tablet' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`p-1 text-xs rounded transition-colors cursor-pointer ${
                  viewport === 'mobile' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Mobile View (375px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sandbox Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleTestFillValid}
                className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-emerald-300 bg-emerald-950/50 hover:bg-emerald-950/80 border border-emerald-800/60 rounded transition-colors cursor-pointer"
                title="Fill valid test data"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">Fill Valid</span>
              </button>
              <button
                onClick={handleTestTriggerErrors}
                className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-950/70 border border-amber-800/60 rounded transition-colors cursor-pointer"
                title="Trigger validation errors"
              >
                <AlertCircle className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">Errors</span>
              </button>
              <button
                onClick={() => setReloadKey((k) => k + 1)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
                title="Reload preview"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Sandboxed Iframe Container */}
          <div className="flex-1 bg-slate-950 flex items-center justify-center p-2 sm:p-3 overflow-auto min-h-[350px]">
            <div
              style={{ width: getContainerWidth() }}
              className={`h-full min-h-[350px] transition-all duration-200 relative ${
                viewport !== 'desktop'
                  ? 'border-2 border-slate-700 rounded-xl shadow-2xl overflow-hidden bg-black'
                  : 'w-full'
              }`}
            >
              {viewport !== 'desktop' && (
                <div className="h-3.5 bg-slate-800 flex items-center justify-center">
                  <div className="w-10 h-1 bg-slate-600 rounded-full" />
                </div>
              )}
              <iframe
                key={reloadKey}
                ref={iframeRef}
                srcDoc={fullHtml}
                title="Split Preview Sandbox"
                sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
                className="w-full h-full min-h-[340px] border-none bg-slate-950"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
