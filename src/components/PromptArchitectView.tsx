import React, { useState } from 'react';
import { TargetModel, StylingTechnique, LayoutStructure } from '../types';
import { Copy, Check, Sparkles, Terminal, Cpu, Layers } from 'lucide-react';
import { buildUniversalPrompt } from '../utils/promptBuilder';

interface PromptArchitectViewProps {
  onLoadIntoWorkbench: (prompt: string, model: TargetModel, styling: StylingTechnique, layout: LayoutStructure) => void;
}

export const PromptArchitectView: React.FC<PromptArchitectViewProps> = ({ onLoadIntoWorkbench }) => {
  const [model, setModel] = useState<TargetModel>('Universal (All Models)');
  const [styling, setStyling] = useState<StylingTechnique>('Modern CSS Grid & Flexbox (Zero Dependencies)');
  const [layout, setLayout] = useState<LayoutStructure>('Responsive Split (Media / Info + Form)');
  const [concept, setConcept] = useState('Enterprise team signup with work email validation and 4-tier password strength');
  const [copied, setCopied] = useState(false);

  const rules = [
    'RFC email syntax check',
    '4-level password strength entropy meter',
    'Real-time input and blur feedback',
    'WCAG AA accessible error announcements',
    'Simulated button spinner on submission',
  ];

  const generatedPrompt = buildUniversalPrompt({
    userPrompt: concept,
    targetModel: model,
    styling,
    layout,
    validationRules: rules,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modelSpecs: Record<TargetModel, { bestFor: string; instructions: string }> = {
    'Universal (All Models)': {
      bestFor: 'Guaranteed execution across Claude, GPT-4o, Gemini, DeepSeek, and Llama 3 with zero hallucinated imports.',
      instructions: 'Enforces pure vanilla JavaScript (ES6+), standard CSS custom properties, and semantic HTML5 without requiring external React or npm packages.',
    },
    'Claude 3.5 Sonnet': {
      bestFor: 'Excels at complex typographic layout balance, micro-animations, and complete CSS architectural systems.',
      instructions: 'Requires exact separation of concerns and semantic token architecture with full accessible ARIA live states.',
    },
    'GPT-4o': {
      bestFor: 'Robust algorithmic validation (Luhn checksums, regex matching, postal codes, state machines).',
      instructions: 'Prevents omission of repetitive validation rules or truncated handler blocks.',
    },
    'Gemini 3.8 Flash': {
      bestFor: 'Lightning-fast generation of clean, modern Web Standards and CSS Grid responsive breakpoints.',
      instructions: 'Strict schema adherence and native Constraint Validation API implementations.',
    },
    'DeepSeek-Coder V2': {
      bestFor: 'Complex client-side validation logic and edge-case testing.',
      instructions: 'Emphasizes defensive validation (trimming, prototype safety, null-checks).',
    },
    'Llama 3.3 70B': {
      bestFor: 'Self-hosted or local open-weights LLMs needing clear prompt boundaries.',
      instructions: 'Explicit file boundary markers and zero external CDN assumptions.',
    },
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="max-w-2xl mb-6">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-4 h-4" />
            Universal Prompt Architect
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Craft the Infallible Prompt for Any AI Model
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            AI models often fail by inventing dependencies or producing half-baked validation. This architect formats your request with the exact constraints and system instructions proven to generate bug-free, responsive HTML, CSS, and JavaScript.
          </p>
        </div>

        {/* Configuration Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              Target LLM Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as TargetModel)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="Universal (All Models)">Universal (All Models)</option>
              <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
              <option value="GPT-4o">GPT-4o</option>
              <option value="Gemini 3.8 Flash">Gemini 3.8 Flash</option>
              <option value="DeepSeek-Coder V2">DeepSeek-Coder V2</option>
              <option value="Llama 3.3 70B">Llama 3.3 70B</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Styling Method
            </label>
            <select
              value={styling}
              onChange={(e) => setStyling(e.target.value as StylingTechnique)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="Modern CSS Grid & Flexbox (Zero Dependencies)">CSS Grid & Flexbox (Zero Deps)</option>
              <option value="CSS Custom Properties (Design Tokens Architecture)">CSS Design Tokens (--vars)</option>
              <option value="Glassmorphism & High-Contrast Dark Slate">Dark Slate & Subtle Glow</option>
              <option value="Clean Minimalist Light (SaaS Aesthetic)">Clean Minimalist Light</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Layout Structure
            </label>
            <select
              value={layout}
              onChange={(e) => setLayout(e.target.value as LayoutStructure)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="Responsive Split (Media / Info + Form)">Responsive Split</option>
              <option value="Centered Floating Card with Micro-Animations">Centered Floating Card</option>
              <option value="Multi-Step Stepper Navigation">Multi-Step Stepper</option>
              <option value="Full-Width Workspace Console">Full-Width Console</option>
            </select>
          </div>
        </div>

        {/* Concept Input */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Your Interface Concept / Goal
          </label>
          <input
            type="text"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            placeholder="e.g. Multi-currency donation form with custom preset buttons and email validation"
          />
        </div>

        {/* Model Spec Card */}
        <div className="p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-lg mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-indigo-300">{model} Tuning:</span>{' '}
            <span className="text-slate-400">{modelSpecs[model]?.bestFor}</span>
          </div>
          <button
            onClick={() => onLoadIntoWorkbench(concept, model, styling, layout)}
            className="px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/60 rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            Load Into Workbench →
          </button>
        </div>

        {/* Generated Meta-Prompt Code Box */}
        <div className="relative bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-slate-400" />
              Engineered Prompt Preview (Ready to Paste)
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Prompt!' : 'Copy to Clipboard'}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-auto selection:bg-indigo-600/30">
            {generatedPrompt}
          </pre>
        </div>
      </div>
    </div>
  );
};
