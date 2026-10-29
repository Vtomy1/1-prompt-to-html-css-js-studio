import React from 'react';
import { GeneratedComponent } from '../types';
import { CURATED_TEMPLATES } from '../data/templates';
import { ShieldCheck, ArrowRight, Eye, Sparkles } from 'lucide-react';

interface TemplateGalleryViewProps {
  onSelect: (template: GeneratedComponent) => void;
  selectedId: string;
}

export const TemplateGalleryView: React.FC<TemplateGalleryViewProps> = ({ onSelect, selectedId }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="max-w-2xl mb-6">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-4 h-4" />
            Curated Component Blueprints
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Production-Grade HTML, CSS & JavaScript Templates
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Every template is fully engineered with zero external dependencies, responsive layouts across all viewports, and deep interactive client-side form validation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CURATED_TEMPLATES.map((tmpl) => {
            const isCurrent = tmpl.id === selectedId;
            return (
              <div
                key={tmpl.id}
                className={`flex flex-col justify-between p-5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-slate-950/80 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-950/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-medium text-slate-400">
                      {tmpl.category}
                    </span>
                    {isCurrent && (
                      <span className="text-[11px] font-semibold text-indigo-400">
                        Active in Sandbox
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mb-1.5">
                    {tmpl.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {tmpl.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1.5 mb-5">
                    {tmpl.validationHighlights?.slice(0, 3).map((hl, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] text-slate-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="truncate">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">
                    Pure HTML5 + Modern CSS + ES6
                  </span>
                  <button
                    onClick={() => onSelect(tmpl)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-200 hover:bg-indigo-600 hover:text-white'
                    }`}
                  >
                    <span>{isCurrent ? 'Viewing in Sandbox' : 'Load Blueprint'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
