import React, { useState } from 'react';
import { A11yAuditResult, A11yIssue, applyA11yAutoFix, runAccessibilityAudit } from '../utils/a11yAuditor';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Wand2,
  RefreshCw,
  Code2,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface A11yAuditPanelProps {
  htmlCode: string;
  onApplyFix: (newHtml: string, notice: string) => void;
}

export const A11yAuditPanel: React.FC<A11yAuditPanelProps> = ({ htmlCode, onApplyFix }) => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'serious' | 'moderate' | 'passed'>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  // Run audit against the current HTML code
  const auditResult: A11yAuditResult = runAccessibilityAudit(htmlCode);

  const handleFixIssue = (issue: A11yIssue) => {
    const fixedHtml = applyA11yAutoFix(htmlCode, issue);
    onApplyFix(fixedHtml, `Applied auto-fix for "${issue.title}".`);
  };

  const handleFixAll = () => {
    let current = htmlCode;
    const fixable = auditResult.issues.filter((i) => i.autoFixType);
    fixable.forEach((issue) => {
      current = applyA11yAutoFix(current, issue);
    });
    onApplyFix(current, `Auto-fixed ${fixable.length} accessibility violation(s).`);
  };

  const filteredIssues = auditResult.issues.filter((issue) => {
    if (filter === 'all') return true;
    return issue.severity === filter;
  });

  const getSeverityBadge = (severity: A11yIssue['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          label: 'Critical',
          class: 'text-rose-400 bg-rose-950/60 border-rose-800/80',
          icon: ShieldAlert,
        };
      case 'serious':
        return {
          label: 'Serious',
          class: 'text-amber-400 bg-amber-950/60 border-amber-800/80',
          icon: AlertTriangle,
        };
      case 'moderate':
        return {
          label: 'Moderate',
          class: 'text-sky-400 bg-sky-950/60 border-sky-800/80',
          icon: Info,
        };
      default:
        return {
          label: 'Notice',
          class: 'text-slate-400 bg-slate-900 border-slate-700',
          icon: Info,
        };
    }
  };

  const hasAutoFixable = auditResult.issues.some((i) => i.autoFixType);

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Panel Header & Score Bar */}
      <div className="p-5 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono font-bold text-base border shrink-0 ${
              auditResult.score >= 90
                ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300'
                : auditResult.score >= 70
                ? 'bg-amber-950/60 border-amber-500/80 text-amber-300'
                : 'bg-rose-950/60 border-rose-500/80 text-rose-300'
            }`}
          >
            <span>{auditResult.score}</span>
            <span className="text-[9px] font-normal opacity-70">/ 100</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Automated A11y Accessibility Audit
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                WCAG 2.1 AA
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Analyzes HTML for missing alt tags, label associations, aria-live alerts, and keyboard order.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {hasAutoFixable && (
            <button
              onClick={handleFixAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-sm"
              title="Apply non-destructive fixes to code automatically"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Auto-Fix All Available</span>
            </button>
          )}

          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Re-run accessibility analysis"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 px-5 py-3 bg-slate-950/40 border-b border-slate-800 text-xs font-mono shrink-0">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-2 rounded-lg text-left border transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-slate-800 border-slate-600 text-white'
              : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/60'
          }`}
        >
          <div className="text-[10px] uppercase text-slate-500 font-sans font-semibold">Total Issues</div>
          <div className="text-sm font-bold text-slate-200 mt-0.5">{auditResult.totalIssues}</div>
        </button>

        <button
          onClick={() => setFilter('critical')}
          className={`px-3 py-2 rounded-lg text-left border transition-colors cursor-pointer ${
            filter === 'critical'
              ? 'bg-rose-950/60 border-rose-600 text-rose-200'
              : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/60'
          }`}
        >
          <div className="text-[10px] uppercase text-rose-400/80 font-sans font-semibold">Critical</div>
          <div className="text-sm font-bold text-rose-400 mt-0.5">{auditResult.criticalCount}</div>
        </button>

        <button
          onClick={() => setFilter('serious')}
          className={`px-3 py-2 rounded-lg text-left border transition-colors cursor-pointer ${
            filter === 'serious'
              ? 'bg-amber-950/60 border-amber-600 text-amber-200'
              : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/60'
          }`}
        >
          <div className="text-[10px] uppercase text-amber-400/80 font-sans font-semibold">Serious</div>
          <div className="text-sm font-bold text-amber-400 mt-0.5">{auditResult.seriousCount}</div>
        </button>

        <button
          onClick={() => setFilter('moderate')}
          className={`px-3 py-2 rounded-lg text-left border transition-colors cursor-pointer ${
            filter === 'moderate'
              ? 'bg-sky-950/60 border-sky-600 text-sky-200'
              : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/60'
          }`}
        >
          <div className="text-[10px] uppercase text-sky-400/80 font-sans font-semibold">Moderate</div>
          <div className="text-sm font-bold text-sky-400 mt-0.5">{auditResult.moderateCount}</div>
        </button>

        <button
          onClick={() => setFilter('passed')}
          className={`px-3 py-2 rounded-lg text-left border transition-colors cursor-pointer ${
            filter === 'passed'
              ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200'
              : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/60'
          }`}
        >
          <div className="text-[10px] uppercase text-emerald-400/80 font-sans font-semibold">Passed Rules</div>
          <div className="text-sm font-bold text-emerald-400 mt-0.5">{auditResult.passedCount}</div>
        </button>
      </div>

      {/* Main Issue List or Passed Rules List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {filter === 'passed' ? (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Passed Accessibility Checks ({auditResult.passedChecks.length})</span>
            </div>

            {auditResult.passedChecks.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No passed checks recorded.
              </div>
            ) : (
              auditResult.passedChecks.map((check, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-slate-950/50 border border-emerald-900/40 rounded-xl flex items-start gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-bold text-slate-200">{check.title}</div>
                      <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60">
                        {check.wcagCriterion}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{check.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">
              Zero {filter !== 'all' ? filter : ''} Accessibility Violations Found!
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your HTML code meets high WCAG 2.1 AA standards for form inputs, ARIA live announcements, button names, and image alternatives.
            </p>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const badge = getSeverityBadge(issue.severity);
            const BadgeIcon = badge.icon;

            return (
              <div
                key={issue.id}
                className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col gap-3 transition-colors hover:border-slate-700"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-0.5 rounded border shrink-0 ${badge.class}`}
                    >
                      <BadgeIcon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{issue.title}</h4>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">{issue.wcagCriterion}</div>
                    </div>
                  </div>

                  {issue.autoFixType && (
                    <button
                      onClick={() => handleFixIssue(issue)}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-indigo-300 bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-800/60 rounded-md transition-colors cursor-pointer shrink-0"
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>Auto-Fix</span>
                    </button>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">{issue.description}</p>

                {/* Element Snippet */}
                {issue.elementSnippet && (
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 overflow-x-auto">
                    <div className="text-[10px] font-mono text-slate-500 mb-1 flex items-center gap-1">
                      <Code2 className="w-3 h-3" />
                      <span>Violating Element Snippet:</span>
                    </div>
                    <code className="text-[11px] font-mono text-amber-300 whitespace-pre">
                      {issue.elementSnippet}
                    </code>
                  </div>
                )}

                {/* Recommendation */}
                <div className="p-2.5 bg-slate-900/40 border border-slate-800/80 rounded-lg text-xs text-slate-300 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200">How to Fix: </strong>
                    <span className="text-slate-400">{issue.recommendation}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
