import React, { useState } from 'react';
import { TargetModel, StylingTechnique, LayoutStructure, GeneratedComponent } from '../types';
import { Sparkles, Copy, Check, Wand2, ShieldCheck, Layers, Cpu, Compass } from 'lucide-react';
import { CURATED_TEMPLATES } from '../data/templates';
import { buildUniversalPrompt } from '../utils/promptBuilder';

interface PromptWorkbenchProps {
  currentPrompt: string;
  setCurrentPrompt: (val: string) => void;
  targetModel: TargetModel;
  setTargetModel: (val: TargetModel) => void;
  styling: StylingTechnique;
  setStyling: (val: StylingTechnique) => void;
  layout: LayoutStructure;
  setLayout: (val: LayoutStructure) => void;
  selectedRules: string[];
  toggleRule: (ruleId: string) => void;
  onGenerateAI: () => void;
  isGenerating: boolean;
  onSelectTemplate: (template: GeneratedComponent) => void;
  selectedTemplateId: string;
  hasApiKey: boolean;
}

const QUICK_PROMPTS = [
  'Modern SaaS registration split layout with email check and 4-tier password strength meter',
  'Fintech card checkout with Luhn checksum validation and auto brand detection',
  'Multi-step booking wizard with ticket counter and live price calculation',
  'Customer satisfaction survey with 5-star rating, character counter, and file validation',
  'Developer API token generator with scope checkboxes and expiry validation',
];

const RULE_OPTIONS = [
  { id: 'rfc-email', label: 'RFC Email & Domain Filter' },
  { id: 'entropy-password', label: '4-Tier Password Strength' },
  { id: 'realtime-feedback', label: 'Instant Keystroke Feedback' },
  { id: 'aria-live', label: 'ARIA Live & Screen Reader Focus' },
  { id: 'luhn-card', label: 'Luhn Card Checksum' },
  { id: 'async-spinner', label: 'Simulated Async Submit Spinner' },
];

export const PromptWorkbench: React.FC<PromptWorkbenchProps> = ({
  currentPrompt,
  setCurrentPrompt,
  targetModel,
  setTargetModel,
  styling,
  setStyling,
  layout,
  setLayout,
  selectedRules,
  toggleRule,
  onGenerateAI,
  isGenerating,
  onSelectTemplate,
  selectedTemplateId,
  hasApiKey,
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleCopyMetaPrompt = () => {
    const metaPrompt = buildUniversalPrompt({
      userPrompt: currentPrompt,
      targetModel,
      styling,
      layout,
      validationRules: selectedRules,
    });
    navigator.clipboard.writeText(metaPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5 p-5 bg-slate-900 border border-slate-800 rounded-xl">
      {/* Blueprint Selector Strip */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            Curated Working Blueprints
          </span>
          <span className="text-[11px] text-slate-500">100% Client-Side Ready</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {CURATED_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => onSelectTemplate(tmpl)}
              className={`p-2.5 text-left rounded-lg border text-xs transition-all cursor-pointer ${
                selectedTemplateId === tmpl.id
                  ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-sm'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="font-semibold truncate">{tmpl.title}</div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">{tmpl.category}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-800" />

      {/* Natural Language Prompt Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="userPrompt" className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
            Describe What You Want to Build
          </label>
        </div>
        <textarea
          id="userPrompt"
          value={currentPrompt}
          onChange={(e) => setCurrentPrompt(e.target.value)}
          rows={3}
          placeholder="e.g. A responsive SaaS signup form with instant work email validation, a 4-rule password strength bar, workspace subdomain preview, and dark modern styling..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
        />

        {/* Quick prompt suggestions */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPrompt(qp)}
              className="text-[11px] px-2.5 py-1 bg-slate-800/70 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50 rounded-md transition-colors text-left truncate max-w-full cursor-pointer"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Target Model Selector & Styling Technique */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            Target Model Compatibility
          </label>
          <select
            value={targetModel}
            onChange={(e) => setTargetModel(e.target.value as TargetModel)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="Universal (All Models)">Universal (Claude, GPT, Gemini, Llama)</option>
            <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Anthropic)</option>
            <option value="GPT-4o">GPT-4o (OpenAI)</option>
            <option value="Gemini 3.8 Flash">Gemini 3.8 Flash (Google)</option>
            <option value="DeepSeek-Coder V2">DeepSeek-Coder V2</option>
            <option value="Llama 3.3 70B">Llama 3.3 70B (Meta)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Styling Technique
          </label>
          <select
            value={styling}
            onChange={(e) => setStyling(e.target.value as StylingTechnique)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="Modern CSS Grid & Flexbox (Zero Dependencies)">CSS Grid & Flexbox (Zero Deps)</option>
            <option value="CSS Custom Properties (Design Tokens Architecture)">CSS Design Tokens (--vars)</option>
            <option value="Glassmorphism & High-Contrast Dark Slate">Dark Slate & Subtle Glow</option>
            <option value="Clean Minimalist Light (SaaS Aesthetic)">Clean Minimalist Light SaaS</option>
          </select>
        </div>
      </div>

      {/* Layout Structure */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          Responsive Layout Architecture
        </label>
        <select
          value={layout}
          onChange={(e) => setLayout(e.target.value as LayoutStructure)}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="Responsive Split (Media / Info + Form)">Responsive Split (Brand Column + Form Card)</option>
          <option value="Centered Floating Card with Micro-Animations">Centered Floating Card with Elevation</option>
          <option value="Multi-Step Stepper Navigation">Multi-Step Stepper Flow (1 → 2 → 3)</option>
          <option value="Full-Width Workspace Console">Full-Width Developer Console</option>
        </select>
      </div>

      {/* Interactive Validation Rules */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Active Form Validation Rules
        </label>
        <div className="grid grid-cols-2 gap-2">
          {RULE_OPTIONS.map((rule) => {
            const isChecked = selectedRules.includes(rule.id);
            return (
              <button
                key={rule.id}
                type="button"
                onClick={() => toggleRule(rule.id)}
                className={`flex items-center gap-2 p-2 rounded-lg border text-xs text-left transition-colors cursor-pointer ${
                  isChecked
                    ? 'bg-emerald-950/40 border-emerald-600/70 text-emerald-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    isChecked ? 'bg-emerald-500 text-slate-950' : 'border border-slate-700'
                  }`}
                >
                  {isChecked && '✓'}
                </div>
                <span className="truncate">{rule.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
        <button
          onClick={onGenerateAI}
          disabled={isGenerating}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all cursor-pointer"
        >
          {isGenerating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating Code...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{hasApiKey ? 'Generate with Gemini' : 'Generate Component'}</span>
            </>
          )}
        </button>

        <button
          onClick={handleCopyMetaPrompt}
          className="flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
          title="Copies the expertly engineered prompt optimized for any LLM model"
        >
          {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedPrompt ? 'Copied Prompt!' : 'Copy Model Prompt'}</span>
        </button>
      </div>
    </div>
  );
};
