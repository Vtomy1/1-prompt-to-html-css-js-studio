import React, { useRef, useEffect, useState } from 'react';
import { ViewportMode, GeneratedComponent } from '../types';
import { Monitor, Tablet, Smartphone, RotateCcw, Play, AlertCircle, CheckCircle2, Maximize2 } from 'lucide-react';
import { bundleIntoSingleFile } from '../utils/promptBuilder';

interface LiveSandboxProps {
  component: GeneratedComponent;
}

export const LiveSandbox: React.FC<LiveSandboxProps> = ({ component }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [reloadKey, setReloadKey] = useState(0);

  const fullHtml = bundleIntoSingleFile(
    component.title,
    component.html,
    component.css,
    component.js
  );

  const handleReload = () => {
    setReloadKey((prev) => prev + 1);
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
      console.warn('Sandbox message test error:', e);
    }
  };

  const handleTestFillValid = () => {
    if (!iframeRef.current?.contentWindow) return;
    try {
      const doc = iframeRef.current.contentDocument;
      if (!doc) return;

      // Fill common inputs
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

      const confirmPwInput = doc.querySelector<HTMLInputElement>('#confirmPassword');
      if (confirmPwInput) {
        confirmPwInput.value = 'SecureP@ssw0rd2026!';
        confirmPwInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      const terms = doc.querySelector<HTMLInputElement>('input[type="checkbox"]');
      if (terms) {
        terms.checked = true;
        terms.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Check card checkout
      const cardNum = doc.querySelector<HTMLInputElement>('#cardNumber');
      if (cardNum) {
        cardNum.value = '4532 8192 3819 8921';
        cardNum.dispatchEvent(new Event('input', { bubbles: true }));
      }

      const expiry = doc.querySelector<HTMLInputElement>('#cardExpiry');
      if (expiry) {
        expiry.value = '12/28';
        expiry.dispatchEvent(new Event('input', { bubbles: true }));
      }

      const cvv = doc.querySelector<HTMLInputElement>('#cardCvv');
      if (cvv) {
        cvv.value = '829';
        cvv.dispatchEvent(new Event('input', { bubbles: true }));
      }

      const zip = doc.querySelector<HTMLInputElement>('#billingZip');
      if (zip) {
        zip.value = '90210';
        zip.dispatchEvent(new Event('input', { bubbles: true }));
      }

      // Check date
      const dateInp = doc.querySelector<HTMLInputElement>('input[type="date"]');
      if (dateInp) {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        dateInp.value = d.toISOString().split('T')[0];
        dateInp.dispatchEvent(new Event('input', { bubbles: true }));
      }

      // Check star rating
      const firstStar = doc.querySelector<HTMLButtonElement>('.star-btn[data-val="5"]');
      if (firstStar) firstStar.click();

      // Check feedback
      const feedback = doc.querySelector<HTMLTextAreaElement>('textarea');
      if (feedback) {
        feedback.value = 'Exceptional developer experience, sub-second latency and rock solid interface!';
        feedback.dispatchEvent(new Event('input', { bubbles: true }));
      }
    } catch (e) {
      console.warn('Sandbox message test error:', e);
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

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Sandbox Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
        {/* Viewport switch */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              viewport === 'desktop' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Desktop 100%"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              viewport === 'tablet' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tablet 768px"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              viewport === 'mobile' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Mobile 375px"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Dimension pill */}
        <div className="text-[11px] font-mono text-slate-500 hidden md:inline">
          Viewport: <span className="text-slate-300 font-semibold">{getContainerWidth()}</span>
        </div>

        {/* Sandbox Test Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTestFillValid}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-300 bg-emerald-950/50 hover:bg-emerald-950/80 border border-emerald-800/60 rounded-md transition-colors cursor-pointer"
            title="Automatically populate valid data to test passing state"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Fill Valid</span>
          </button>
          <button
            onClick={handleTestTriggerErrors}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-950/70 border border-amber-800/60 rounded-md transition-colors cursor-pointer"
            title="Simulate submit to test inline error validation"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Test Errors</span>
          </button>
          <button
            onClick={handleReload}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            title="Reload sandbox preview"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sandboxed Frame Canvas */}
      <div className="flex-1 bg-slate-950 flex items-center justify-center p-2 sm:p-4 overflow-auto min-h-[520px]">
        <div
          style={{ width: getContainerWidth() }}
          className={`h-full min-h-[500px] transition-all duration-300 relative ${
            viewport !== 'desktop'
              ? 'border-2 border-slate-700 rounded-2xl shadow-2xl overflow-hidden bg-black'
              : 'w-full'
          }`}
        >
          {viewport !== 'desktop' && (
            <div className="h-4 bg-slate-800 flex items-center justify-center">
              <div className="w-12 h-1 bg-slate-600 rounded-full" />
            </div>
          )}
          <iframe
            key={reloadKey}
            ref={iframeRef}
            srcDoc={fullHtml}
            title={component.title}
            sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
            className="w-full h-full min-h-[490px] border-none bg-slate-950"
          />
        </div>
      </div>
    </div>
  );
};
