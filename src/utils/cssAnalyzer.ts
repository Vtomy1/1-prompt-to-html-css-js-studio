export interface CssIssue {
  id: string;
  ruleId: string;
  category: 'unused-selector' | 'specificity' | 'vendor-prefix' | 'best-practice';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  selector?: string;
  cssSnippet: string;
  recommendation: string;
  autoFixType?: 'remove-unused' | 'add-prefix' | 'strip-important' | 'add-focus-ring';
  property?: string;
  fixValue?: string;
}

export interface CssPassedCheck {
  id: string;
  title: string;
  description: string;
}

export interface CssAnalysisResult {
  totalIssues: number;
  unusedCount: number;
  specificityCount: number;
  prefixCount: number;
  bestPracticeCount: number;
  passedCount: number;
  score: number; // 0 - 100
  issues: CssIssue[];
  passedChecks: CssPassedCheck[];
  stats: {
    totalRules: number;
    totalSelectors: number;
    customPropertiesCount: number;
    byteSize: number;
  };
}

/**
 * Analyzes CSS rules against HTML document to identify unused selectors,
 * specificity collisions, missing vendor prefixes, and styling anti-patterns.
 */
export function analyzeCss(css: string, html: string): CssAnalysisResult {
  const issues: CssIssue[] = [];
  const passedChecks: CssPassedCheck[] = [];

  if (!css || !css.trim()) {
    return {
      totalIssues: 0,
      unusedCount: 0,
      specificityCount: 0,
      prefixCount: 0,
      bestPracticeCount: 0,
      passedCount: 0,
      score: 100,
      issues: [],
      passedChecks: [],
      stats: { totalRules: 0, totalSelectors: 0, customPropertiesCount: 0, byteSize: 0 },
    };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<!DOCTYPE html><html><body>${html}</body></html>`, 'text/html');

  // Strip comments for analysis
  const cleanCss = css.replace(/\/\*[\s\S]*?\*\//g, '');

  // 1. Check for CSS Custom Properties Token System
  const customProps = cleanCss.match(/--[a-zA-Z0-9_-]+:/g) || [];
  if (customProps.length >= 4) {
    passedChecks.push({
      id: 'custom-properties-tokens',
      title: 'CSS Custom Properties token system established',
      description: `Detected ${customProps.length} design tokens (--variables) promoting maintainable theming.`,
    });
  } else {
    issues.push({
      id: 'few-custom-properties',
      ruleId: 'css-variables-token-system',
      category: 'best-practice',
      title: 'Limited CSS Custom Properties defined',
      description: 'Modern styling should establish a centralized CSS custom property token system (--primary, --bg, --radius, --border) in :root.',
      severity: 'low',
      cssSnippet: ':root { ... }',
      recommendation: 'Define color, typography, and spacing variables in :root for clean theme switching.',
    });
  }

  // 2. Parse individual rules: selector { declarations }
  // Regex to extract standard rule blocks (excluding @keyframes and @media blocks)
  const ruleRegex = /([^{}@]+)\{([^}]+)\}/g;
  let match;
  let totalRules = 0;
  const selectorList: string[] = [];

  while ((match = ruleRegex.exec(cleanCss)) !== null) {
    totalRules++;
    const rawSelector = match[1].trim();
    const declarations = match[2].trim();

    // Skip @rules like @charset, @import, @namespace
    if (rawSelector.startsWith('@')) continue;

    // Split compound selectors (e.g. .btn, .btn-primary)
    const subSelectors = rawSelector.split(',').map((s) => s.trim());

    subSelectors.forEach((sel) => {
      selectorList.push(sel);

      // Clean pseudo-classes and pseudo-elements for HTML matching: :hover, ::before, :focus-within, etc.
      const matchableSel = sel
        .replace(/:(?:hover|focus|focus-visible|focus-within|active|visited|disabled|checked|invalid|valid|required|optional)/g, '')
        .replace(/::?(?:before|after|placeholder|first-letter|first-line|selection)/g, '')
        .trim();

      // Check for UNUSED SELECTOR
      // Exclude universal selector *, :root, html, body, and pseudo-elements
      if (
        matchableSel &&
        matchableSel !== '*' &&
        matchableSel !== ':root' &&
        matchableSel !== 'html' &&
        matchableSel !== 'body' &&
        !matchableSel.includes('@')
      ) {
        try {
          const matched = doc.querySelector(matchableSel);
          if (!matched) {
            // Confirm it's not a JS-dynamically created class commonly used in validation states
            const dynamicKeywords = ['is-valid', 'is-invalid', 'has-error', 'completed', 'active', 'selected', 'spin', 'shake'];
            const isDynamicClass = dynamicKeywords.some((kw) => matchableSel.includes(kw));

            if (!isDynamicClass) {
              issues.push({
                id: `unused-${issues.length}`,
                ruleId: 'unused-css-selector',
                category: 'unused-selector',
                title: `Unused CSS selector "${sel}"`,
                description: `Selector "${sel}" does not match any element in the HTML markup. Unused CSS bloats payload and slows style recalculation.`,
                severity: 'medium',
                selector: sel,
                cssSnippet: `${sel} { ${declarations.slice(0, 50)}... }`,
                recommendation: `Remove the unused "${sel}" rule block or verify if the corresponding HTML element was omitted.`,
                autoFixType: 'remove-unused',
              });
            }
          }
        } catch {
          // Selector might be browser-specific or complex pseudo
        }
      }

      // Check for SPECIFICITY OVER-QUALIFICATION (Over 3 levels of nesting or tag + id qualification)
      const segments = sel.split(/[\s>+~]+/);
      if (segments.length > 4) {
        issues.push({
          id: `specificity-nested-${issues.length}`,
          ruleId: 'excessive-selector-depth',
          category: 'specificity',
          title: `Excessive selector nesting depth (${segments.length} levels)`,
          description: `Selector "${sel}" has high specificity depth. Deeply nested selectors make overrides difficult and harm CSS engine matching performance.`,
          severity: 'medium',
          selector: sel,
          cssSnippet: `${sel} { ... }`,
          recommendation: 'Refactor into a single clean class name (e.g. .fc-input instead of .wrapper div form .field input).',
        });
      }

      // Over-qualified ID: e.g. div#myId or input#password
      if (/[a-zA-Z0-9_-]+#[a-zA-Z0-9_-]+/.test(sel)) {
        issues.push({
          id: `overqualified-id-${issues.length}`,
          ruleId: 'overqualified-id-selector',
          category: 'specificity',
          title: `Over-qualified ID selector "${sel}"`,
          description: `IDs are already unique in the document. Qualifying an ID with a tag name (e.g. div#id) unnecessarily inflates specificity.`,
          severity: 'low',
          selector: sel,
          cssSnippet: sel,
          recommendation: `Use #${sel.split('#')[1]} directly without tag qualification.`,
        });
      }
    });

    // 3. Check for !important Usage (Specificity Collisions)
    if (declarations.includes('!important')) {
      issues.push({
        id: `important-${issues.length}`,
        ruleId: 'no-important-rule',
        category: 'specificity',
        title: `Anti-pattern !important used in "${rawSelector}"`,
        description: '!important breaks the natural CSS cascade and creates specificity wars. Prefer proper selector specificity or cascade order.',
        severity: 'high',
        selector: rawSelector,
        cssSnippet: `${rawSelector} { ${declarations.slice(0, 70)}... }`,
        recommendation: 'Remove !important and increase selector specificity naturally if necessary.',
        autoFixType: 'strip-important',
      });
    }

    // 4. Check for MISSING VENDOR PREFIXES
    // Check backdrop-filter
    if (/backdrop-filter\s*:/i.test(declarations) && !/-webkit-backdrop-filter\s*:/i.test(declarations)) {
      issues.push({
        id: `prefix-backdrop-${issues.length}`,
        ruleId: 'missing-webkit-backdrop-filter',
        category: 'vendor-prefix',
        title: 'Missing -webkit-backdrop-filter prefix',
        description: 'backdrop-filter requires -webkit-backdrop-filter for support in Safari / iOS WebKit.',
        severity: 'medium',
        selector: rawSelector,
        cssSnippet: declarations.match(/backdrop-filter\s*:[^;]+;/)?.[0] || 'backdrop-filter',
        recommendation: 'Add -webkit-backdrop-filter before backdrop-filter for Safari compatibility.',
        autoFixType: 'add-prefix',
        property: 'backdrop-filter',
      });
    }

    // Check user-select
    if (/user-select\s*:/i.test(declarations) && !/-webkit-user-select\s*:/i.test(declarations)) {
      issues.push({
        id: `prefix-user-select-${issues.length}`,
        ruleId: 'missing-webkit-user-select',
        category: 'vendor-prefix',
        title: 'Missing -webkit-user-select prefix',
        description: 'user-select requires -webkit-user-select for complete cross-browser and mobile web support.',
        severity: 'low',
        selector: rawSelector,
        cssSnippet: declarations.match(/user-select\s*:[^;]+;/)?.[0] || 'user-select',
        recommendation: 'Add -webkit-user-select before user-select.',
        autoFixType: 'add-prefix',
        property: 'user-select',
      });
    }

    // Check appearance: none
    if (/appearance\s*:\s*none/i.test(declarations) && !/-webkit-appearance\s*:\s*none/i.test(declarations)) {
      issues.push({
        id: `prefix-appearance-${issues.length}`,
        ruleId: 'missing-webkit-appearance',
        category: 'vendor-prefix',
        title: 'Missing -webkit-appearance: none',
        description: 'Custom form inputs with appearance: none require -webkit-appearance: none for iOS Safari resets.',
        severity: 'medium',
        selector: rawSelector,
        cssSnippet: declarations.match(/appearance\s*:[^;]+;/)?.[0] || 'appearance: none',
        recommendation: 'Add -webkit-appearance: none alongside appearance: none.',
        autoFixType: 'add-prefix',
        property: 'appearance',
      });
    }

    // 5. Accessibility Focus Anti-Pattern: outline: none without focus ring
    if (/outline\s*:\s*(?:none|0)(?:;|\s)/i.test(declarations)) {
      const hasBoxShadow = /box-shadow\s*:/i.test(declarations);
      const isInput = /:focus|input|button|select|textarea/i.test(rawSelector);

      if (isInput && !hasBoxShadow) {
        issues.push({
          id: `outline-none-a11y-${issues.length}`,
          ruleId: 'focus-outline-missing',
          category: 'best-practice',
          title: `Keyboard focus outline stripped in "${rawSelector}"`,
          description: 'outline: none removes visible keyboard navigation focus indicators. Keyboard users will lose track of where their cursor is.',
          severity: 'high',
          selector: rawSelector,
          cssSnippet: `${rawSelector} { ${declarations.slice(0, 60)}... }`,
          recommendation: 'Replace outline: none with a visible focus ring via box-shadow or :focus-visible.',
          autoFixType: 'add-focus-ring',
        });
      }
    }

    // 6. Performance Anti-Pattern: Layout Thrashing Transitions / Animations
    if (/transition\s*:.*?(?:width|height|top|left|margin|padding)(?:;|\s)/i.test(declarations)) {
      issues.push({
        id: `layout-transition-${issues.length}`,
        ruleId: 'expensive-layout-animation',
        category: 'best-practice',
        title: `Animating layout geometry property in "${rawSelector}"`,
        description: 'Animating width, height, top, left, or margins triggers expensive browser layout recalculations. Animate transform (translate, scale) and opacity instead.',
        severity: 'medium',
        selector: rawSelector,
        cssSnippet: declarations.match(/transition\s*:[^;]+;/)?.[0] || 'transition',
        recommendation: 'Replace layout animations with transform: translate() or scale() for 60fps GPU acceleration.',
      });
    }
  }

  // Record Passed Checks
  const unusedIssues = issues.filter((i) => i.category === 'unused-selector');
  if (unusedIssues.length === 0 && selectorList.length > 0) {
    passedChecks.push({
      id: 'all-selectors-matched',
      title: 'Zero unused CSS selectors detected',
      description: 'Every CSS rule corresponds to active markup in the HTML component.',
    });
  }

  const prefixIssues = issues.filter((i) => i.category === 'vendor-prefix');
  if (prefixIssues.length === 0 && cleanCss.length > 0) {
    passedChecks.push({
      id: 'vendor-prefixes-complete',
      title: 'Vendor prefix coverage is complete',
      description: 'Webkit prefixes for backdrop-filter, user-select, and appearance are present.',
    });
  }

  const specificityIssues = issues.filter((i) => i.category === 'specificity');
  if (specificityIssues.length === 0) {
    passedChecks.push({
      id: 'clean-cascade-specificity',
      title: 'Clean cascade with zero !important rules',
      description: 'Zero !important overrides detected; cascading rules follow natural specificity.',
    });
  }

  // Count summaries
  const unusedCount = unusedIssues.length;
  const specificityCount = specificityIssues.length;
  const prefixCount = prefixIssues.length;
  const bestPracticeCount = issues.filter((i) => i.category === 'best-practice').length;

  const penalty = unusedCount * 8 + specificityCount * 12 + prefixCount * 6 + bestPracticeCount * 10;
  const score = Math.max(0, Math.min(100, 100 - penalty));

  return {
    totalIssues: issues.length,
    unusedCount,
    specificityCount,
    prefixCount,
    bestPracticeCount,
    passedCount: passedChecks.length,
    score,
    issues,
    passedChecks,
    stats: {
      totalRules,
      totalSelectors: selectorList.length,
      customPropertiesCount: customProps.length,
      byteSize: new Blob([css]).size,
    },
  };
}

/**
 * Applies automated CSS fixes
 */
export function applyCssAutoFix(css: string, issue: CssIssue): string {
  let updated = css;

  if (issue.autoFixType === 'remove-unused' && issue.selector) {
    // Escape selector for regex
    const escapedSel = issue.selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\n?\\s*${escapedSel}\\s*\\{[^}]*\\}\\s*`, 'g');
    updated = updated.replace(regex, '\n');
  } else if (issue.autoFixType === 'strip-important') {
    updated = updated.replace(/\s*!important/g, '');
  } else if (issue.autoFixType === 'add-prefix') {
    if (issue.property === 'backdrop-filter') {
      updated = updated.replace(/(\n?\s*)(backdrop-filter\s*:\s*([^;]+);)/g, '$1-webkit-backdrop-filter: $3;\n$1$2');
    } else if (issue.property === 'user-select') {
      updated = updated.replace(/(\n?\s*)(user-select\s*:\s*([^;]+);)/g, '$1-webkit-user-select: $3;\n$1$2');
    } else if (issue.property === 'appearance') {
      updated = updated.replace(/(\n?\s*)(appearance\s*:\s*([^;]+);)/g, '$1-webkit-appearance: $3;\n$1$2');
    }
  } else if (issue.autoFixType === 'add-focus-ring') {
    updated = updated.replace(/outline\s*:\s*(?:none|0)\s*;/g, 'outline: none;\n  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);');
  }

  return updated;
}

/**
 * Batch auto-fixes all resolvable issues
 */
export function autoFixAllCss(css: string, issues: CssIssue[]): string {
  let result = css;
  const fixable = issues.filter((i) => i.autoFixType);
  fixable.forEach((issue) => {
    result = applyCssAutoFix(result, issue);
  });
  return result;
}
