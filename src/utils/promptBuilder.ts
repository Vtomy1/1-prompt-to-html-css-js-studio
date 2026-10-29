import { TargetModel, StylingTechnique, LayoutStructure } from '../types';

export function buildUniversalPrompt(options: {
  userPrompt: string;
  targetModel: TargetModel;
  styling: StylingTechnique;
  layout: LayoutStructure;
  validationRules: string[];
}): string {
  const { userPrompt, targetModel, styling, layout, validationRules } = options;

  let modelDirective = '';
  switch (targetModel) {
    case 'Claude 3.5 Sonnet':
      modelDirective = 'Format response with crisp technical precision. Provide production-ready, zero-placeholder code in distinct ```html, ```css, and ```javascript blocks or a single unified HTML file.';
      break;
    case 'GPT-4o':
      modelDirective = 'Write complete, executable vanilla ES6+ code. Do not truncate or omit any validation event handlers or CSS rules.';
      break;
    case 'Gemini 3.8 Flash':
      modelDirective = 'Return structured code with high accessibility standards (WCAG AA), adhering strictly to HTML5 validation and modern CSS3 custom properties.';
      break;
    case 'DeepSeek-Coder V2':
      modelDirective = 'Focus on robust error handling, edge cases (empty strings, whitespace trimming, regex boundary testing), and modular event listener architecture.';
      break;
    case 'Llama 3.3 70B':
      modelDirective = 'Output pure standard web technologies without external dependencies (no jQuery, no React, no external CSS CDNs).';
      break;
    default:
      modelDirective = 'Universal Model Standard: Works reliably across Claude, ChatGPT, Gemini, Llama, and DeepSeek. Requires zero external npm packages or CDNs.';
  }

  return `### SYSTEM / DEVELOPER INSTRUCTION:
You are an expert Frontend Architect. Generate a production-grade, fully working, responsive web component using ONLY pure semantic HTML5, modern CSS3, and vanilla modern JavaScript (ES6+).

### SPECIFICATIONS & ARCHITECTURE:
1. TARGET GOAL:
   "${userPrompt}"

2. MODEL OPTIMIZATION DIRECTIVE:
   ${modelDirective}

3. RESPONSIVE LAYOUT & STRUCTURE:
   - Layout Architecture: ${layout}
   - Must be fully responsive across mobile (320px-480px), tablet (768px), and desktop (1024px-1440px+).
   - Use CSS Grid, Flexbox, and CSS clamp() for fluid typography.
   - Container outer padding must be >= inner child padding. Ensure zero layout breaks or horizontal overflow.

4. MODERN STYLING TECHNIQUES:
   - Technique: ${styling}
   - Define a cohesive CSS custom property token system (--bg, --surface, --primary, --text-main, --text-muted, --border, --error, --success, --radius, --shadow).
   - Touch targets must be at least 44px on interactive controls.
   - Smooth transition states (<= 200ms) on :hover, :focus-visible, and :active.
   - High-contrast accessible focus indicators (visible outline or ring).

5. INTERACTIVE FORM VALIDATION & LOGIC:
   - Rules Enforced: ${validationRules.join(', ')}
   - Validate on both user 'input' / 'blur' events (instant inline feedback) AND comprehensive on 'submit'.
   - Use <form novalidate> with proper ARIA attributes (aria-invalid, aria-describedby, role="alert" / role="status").
   - Display clear, helpful error states adjacent to the invalid input.
   - When fields become valid, clear error states and apply subtle positive feedback.
   - On successful submission: prevent default, simulate asynchronous submit (loading indicator / spinner on submit button), and display a friendly success state / confirmation toast with reset capability.

### REQUIRED CODE OUTPUT:
Provide complete, functional code without any placeholders or TODOs.
Include:
1. HTML (Semantic markup)
2. CSS (Modern scoped styling)
3. JavaScript (Vanilla ES6+ validation logic)`;
}

export function bundleIntoSingleFile(title: string, html: string, css: string, js: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'Generated Component'}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
${css}
  </style>
</head>
<body>
${html}

  <script>
${js}
  </script>
</body>
</html>`;
}
