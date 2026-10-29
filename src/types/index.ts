export interface GeneratedComponent {
  id: string;
  title: string;
  description: string;
  category: string;
  html: string;
  css: string;
  js: string;
  explanation: string;
  modelPromptOptimized: string;
  validationHighlights: string[];
}

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export type TargetModel =
  | 'Universal (All Models)'
  | 'Claude 3.5 Sonnet'
  | 'GPT-4o'
  | 'Gemini 3.8 Flash'
  | 'DeepSeek-Coder V2'
  | 'Llama 3.3 70B';

export type StylingTechnique =
  | 'Modern CSS Grid & Flexbox (Zero Dependencies)'
  | 'CSS Custom Properties (Design Tokens Architecture)'
  | 'Glassmorphism & High-Contrast Dark Slate'
  | 'Clean Minimalist Light (SaaS Aesthetic)';

export type LayoutStructure =
  | 'Responsive Split (Media / Info + Form)'
  | 'Centered Floating Card with Micro-Animations'
  | 'Multi-Step Stepper Navigation'
  | 'Full-Width Workspace Console';

export interface ValidationRuleOption {
  id: string;
  label: string;
  description: string;
}

export interface CodeSnapshot {
  id: string;
  timestamp: number;
  label: string;
  trigger: 'generate' | 'blueprint' | 'manual' | 'edit';
  component: GeneratedComponent;
  stats: {
    htmlLines: number;
    cssLines: number;
    jsLines: number;
    totalBytes: number;
  };
}
