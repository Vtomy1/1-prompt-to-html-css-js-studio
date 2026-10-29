import React, { useState } from 'react';
import { CssAnalysisResult, CssIssue, analyzeCss, applyCssAutoFix, autoFixAllCss } from '../utils/cssAnalyzer';
import {
  Palette,
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Wand2,
  RefreshCw,
  Code2,
  Layers,
  Sparkles,
  Zap,
  Scissors
} from 'lucide-react';

interface CssAnalyzerPanelProps {
  cssCode: string;
  htmlCode: string;
  onApplyCssFix: (newCss: string, notice: string) => void;
}

export const CssAnalyzerPanel: React.FC<CssAnalyzerPanelProps> = ({
  cssCode,
  htmlCode,
  onApplyCssFix,
}) => {
  const [filter, setFilter] = useState<'all' | 'unused-selector' | 'specificity' | 'vendor-prefix' | 'best-practice' | 'passed'>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  // Run analysis against current CSS and HTML
  const analysis: CssAnalysisResult = analyzeCss(cssCode, htmlCode);

  const handleFixOne = (issue: CssIssue) => {
    const fixed = applyCssAutoFix(cssCode, issue);
    onApplyCssFix(fixed, `Auto-fixed issue: "${issue.title}".`);
  };

  const handleFixAll = () => {
    const fixed = autoFixAllCss(cssCode, analysis.issues);
    const fixableCount = analysis.issues.filter((i) => i.autoFixType).length;
    onApplyCssFix(fixed, `Auto-fixed ${fixableCount} CSS issue(s)!`);
  };

  const filteredIssues = analysis.issues.filter((issue) => {
    if (filter === 'all') return true;
    return issue.category === filter;
  });

  const getCategoryBadge = (category: CssIssue['category']) => {
    switch (category) {
      case 'unused-selector':
        return { label: 'Unused Selector', class: 'text-amber-400 bg-amber-950/60 border-amber-800/80', icon: Scissors };
      case 'specificity':
        return { label: 'Specificity / !important', class: 'text-rose-400 bg-rose-950/60 border-rose-800/80', icon: AlertTriangle };
      case 'vendor-prefix':
        return { label: 'Vendor Prefix', class: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/80', icon: Layers };
      default:
        return { label: 'Best Practice', class: 'text-indigo-400 bg-indigo-950/60 border-indigo-800/80', icon: Sparkles };
    }
  };

  const hasFixable = analysis.issues.some((i) => i.autoFixType);

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
      {/* Header Bar */}
      <div className="p-5 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono font-bold text-base border shrink-0 ${
              analysis.score >= 90
                ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300'
                : analysis.score >= 70
                ? 'bg-amber-950/60 border-amber-500/80 text-amber-300'
                : 'bg-rose-950/60 border-rose-500/80 text-rose-300'
            }`}
          >
            <span>{analysis.score}</span>
            <span className="text-[9px] font-normal opacity-70">Score</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-cyan-400" />
                CSS Style & Architecture Analyzer
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {analysis.stats.totalRules} Rules · {analysis.stats.customPropertiesCount} Tokens
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Scans stylesheet for dead selectors, specificity collision risks, missing Safari Webkit prefixes, and layout performance.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {hasFixable && (
            <button
              onClick={handleFixAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-sm"
              title="Apply non-destructive CSS fixes automatically"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Auto-Fix All Available</span>
            </button>
          )}

          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Re-run CSS style analysis"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Category Filter Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 px-5 py-3 bg-slate-950/40 border-b border-slate-800 text-xs font-mono shrink-0">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-2 rounded-lg text-left border transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-slate-800 border-slate-600 text-white'
              : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/60'
          }`}
        >
          <div className="text-[10px] uppercase text-slate-500 font-sans font-semibold">Total Issues</div>
          <div className="text-sm font-bold text-slate-200 mt-0.5">{analysis.totalIssues}</div>
        </button>

        <button
          onClick={() => setFilter('unused-selector')}
          className={`px-3 py-2 rounded-lg text-left border transition-colors cursor-pointer ${
            filter === 'unused-selector'
              ? 'bg-amber-950/60 border-amber-600 text-amber-200'
              : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/60'
          }`}
        >
          <div className="text-[10px] uppercase text-amber-400/80 font-sans font-semibold">Unused Selectors</div>
          <div className="text-sm font-bold text-amber-400 mt-0.5">{analysis.unusedCount}</div>
        </button>

        <button
          onClick={() => setFilter('specificity')}
          className={`px-3 py-2 rounded-lg text-left border transition-colors cursor-pointer ${
            filter === 'specificity'
              ? 'bg-rose-950/60 border-rose-600 text-rose-200'
              : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/60'
          }`}
        >
          <div className="text-[10px] uppercase text-rose-400/80 font-sans font-semibold">Specificity & !imp</div>
          <div className="text-sm font-bold text-rose-400 mt-0.5">{analysis.specificityCount}</div>
        </button>

        <button
          onClick={() => setFilter('vendor-prefix')}
          className={`px-3 py-2 rounded-lg text-left border transition-colors cursor-pointer ${
            filter === 'vendor-prefix'
              ? 'bg-cyan-950/60 border-cyan-600 text-cyan-200'
              : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/60'
          }`}
        >
          <div className="text-[10px] uppercase text-cyan-400/80 font-sans font-semibold">Vendor Prefixes</div>
          <div className="text-sm font-bold text-cyan-400 mt-0.5">{analysis.prefixCount}</div>
        </button>

        <button
          onClick={() => setFilter('best-practice')}
          className={`px-3 py-2 rounded-lg text-left border transition-colors cursor-pointer ${
            filter === 'best-practice'
              ? 'bg-indigo-950/60 border-indigo-600 text-indigo-200'
              : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/60'
          }`}
        >
          <div className="text-[10px] uppercase text-indigo-400/80 font-sans font-semibold">Best Practices</div>
          <div className="text-sm font-bold text-indigo-400 mt-0.5">{analysis.bestPracticeCount}</div>
        </button>

        <button
          onClick={() => setFilter('passed')}
          className={`px-3 py-2 rounded-lg text-left border transition-colors cursor-pointer ${
            filter === 'passed'
              ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200'
              : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/60'
          }`}
        >
          <div className="text-[10px] uppercase text-emerald-400/80 font-sans font-semibold">Passed Checks</div>
          <div className="text-sm font-bold text-emerald-400 mt-0.5">{analysis.passedCount}</div>
        </button>
      </div>

      {/* Main Issue List or Passed Rules List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {filter === 'passed' ? (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Passed CSS Architectural Checks ({analysis.passedChecks.length})</span>
            </div>

            {analysis.passedChecks.map((check) => (
              <div
                key={check.id}
                className="p-3.5 bg-slate-950/50 border border-emerald-900/40 rounded-xl flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-200">{check.title}</div>
                  <p className="text-xs text-slate-400 mt-1">{check.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">
              Zero {filter !== 'all' ? filter.replace('-', ' ') : ''} Issues Found!
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your CSS stylesheet adheres to clean cascade principles, maintains zero dead rules, and supports cross-browser WebKit rendering.
            </p>
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const badge = getCategoryBadge(issue.category);
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
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                        Severity: <span className="uppercase font-semibold text-slate-400">{issue.severity}</span>
                      </div>
                    </div>
                  </div>

                  {issue.autoFixType && (
                    <button
                      onClick={() => handleFixOne(issue)}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-indigo-300 bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-800/60 rounded-md transition-colors cursor-pointer shrink-0"
                      title="Apply automatic fix to this CSS rule"
                    >
                      <Wand2 className="w-3 h-3" />
                      <span>Auto-Fix</span>
                    </button>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">{issue.description}</p>

                {/* CSS Snippet */}
                {issue.cssSnippet && (
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 overflow-x-auto">
                    <div className="text-[10px] font-mono text-slate-500 mb-1 flex items-center gap-1">
                      <Code2 className="w-3 h-3" />
                      <span>Rule Snippet:</span>
                    </div>
                    <code className="text-[11px] font-mono text-cyan-300 whitespace-pre">
                      {issue.cssSnippet}
                    </code>
                  </div>
                )}

                {/* Recommendation */}
                <div className="p-2.5 bg-slate-900/40 border border-slate-800/80 rounded-lg text-xs text-slate-300 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200">Recommendation: </strong>
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
