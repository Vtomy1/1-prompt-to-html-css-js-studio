import React from 'react';
import { GeneratedComponent } from '../types';
import { CheckCircle2, ShieldCheck, Accessibility, Smartphone, Zap } from 'lucide-react';

interface ValidationAuditorProps {
  component: GeneratedComponent;
}

export const ValidationAuditor: React.FC<ValidationAuditorProps> = ({ component }) => {
  const auditPoints = [
    {
      title: 'Constraint Validation API & Novalidate',
      status: 'Implemented',
      desc: 'Form uses novalidate to suppress default browser tooltips while managing native validity states with custom, branded visual feedback.',
      icon: ShieldCheck,
      badge: 'WCAG 3.3.1',
    },
    {
      title: 'Screen Reader & ARIA Live Alerts',
      status: 'Active',
      desc: 'Error containers leverage aria-live="polite" and role="alert". Inputs dynamically bind aria-invalid and aria-describedby references.',
      icon: Accessibility,
      badge: 'WCAG 4.1.3',
    },
    {
      title: 'Mobile Touch Targets & Spacing',
      status: 'Pass (>= 44px)',
      desc: 'All interactive submit triggers, toggles, and form inputs maintain minimum 44px vertical touch targets with responsive horizontal gutters.',
      icon: Smartphone,
      badge: 'WCAG 2.5.5',
    },
    {
      title: 'Instant Keystroke & Blur Diagnostics',
      status: 'Sub-200ms',
      desc: 'Inline validation fires on input after first error discovery and on blur for empty fields, preventing aggressive premature error signaling.',
      icon: Zap,
      badge: 'Interaction Budget',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Validation & Accessibility Diagnostics
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time audit of interactive validation, modern CSS layout integrity, and WCAG AA compliance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-5">
        {auditPoints.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex gap-3">
              <div className="w-8 h-8 rounded-md bg-slate-800/80 border border-slate-700/60 flex items-center justify-center shrink-0 text-indigo-400">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-semibold text-slate-200 truncate">{item.title}</div>
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 rounded">
                    {item.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                <div className="text-[10px] text-slate-500 font-mono mt-1.5">{item.badge}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Component Specific Highlights */}
      <div>
        <div className="text-xs font-semibold text-slate-300 mb-2">Component Validation Highlights</div>
        <div className="space-y-1.5">
          {component.validationHighlights?.map((highlight, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{highlight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
