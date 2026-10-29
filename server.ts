import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Endpoint: Check API Key status
app.get('/api/status', (req, res) => {
  res.json({
    hasApiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    model: 'gemini-3.8-flash',
  });
});

// Endpoint: Generate HTML/CSS/JS from user prompt
app.post('/api/generate-code', async (req, res) => {
  try {
    const {
      prompt,
      targetModel = 'Universal (All Models)',
      stylingStyle = 'Modern CSS Grid & Flexbox (Zero Dependencies)',
      layoutType = 'Responsive Split Desktop/Mobile',
      validationRules = ['required', 'email', 'password-strength', 'realtime-feedback'],
    } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check Settings > Secrets or choose from the curated templates.',
      });
    }

    const systemInstruction = `You are a Principal Frontend Architect specializing in generating production-grade, accessible, modern web interfaces with pure semantic HTML5, modern CSS3, and vanilla modern JavaScript (ES6+).

The user is asking you to generate code for a specific form/layout request that can be used across all LLM models and web environments.

Key Technical Directives:
1. SEMANTIC HTML:
   - Use <form novalidate>, semantic inputs (<input type="email">, <input type="password">, <select>, etc.).
   - Include ARIA attributes: aria-invalid="false", aria-describedby="[field]-error", aria-live="polite", and role="status" or role="alert".
   - Each input must have a clear <label for="..."> with visible indicators.

2. MODERN CSS:
   - Must use modern CSS variables (--bg, --primary, --text, --error, --success, --radius, --shadow).
   - Use modern layout: CSS Grid / Flexbox, container queries or clean media queries (mobile-first, tablet, desktop).
   - Smooth transition states: focus-visible rings (never remove outline without focus ring replacement), invalid shake/glow effects, interactive active buttons.
   - Zero external CSS libraries required (pure modern CSS that works out-of-the-box).

3. INTERACTIVE JAVASCRIPT VALIDATION:
   - Vanilla modern ES6+ JavaScript.
   - Real-time inline feedback: validate on 'input' or 'blur', plus exhaustive validation on form 'submit'.
   - Clear visual error messages underneath inputs with icon or text, updating aria-invalid immediately.
   - If password is included, include a multi-criteria strength meter (length >= 8, uppercase, number, special char).
   - On successful validation, display an accessible success toast or animated confirmation card with reset options.
   - Prevent default form submission and simulate network submission state (loading spinner, disabled button, then success message).

4. UNIVERSAL COMPATIBILITY:
   - Provide standard clean HTML (the <body> contents or entire page component), CSS (pure stylesheet rules), and JavaScript (pure client script).
   - Output must be strict JSON matching the schema.`;

    const userPromptText = `Generate a complete responsive layout with interactive form validation and modern styling for:
PROMPT: "${prompt}"

Target Model Compatibility: ${targetModel}
Styling Technique: ${stylingStyle}
Layout Structure: ${layoutType}
Validation Requirements: ${validationRules.join(', ')}

Return clean, production-ready, beautifully styled code with full interactive form validation.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPromptText,
      config: {
        systemInstruction,
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Short descriptive title of the generated UI' },
            description: { type: Type.STRING, description: '1-sentence overview of the component' },
            html: { type: Type.STRING, description: 'Clean semantic HTML markup' },
            css: { type: Type.STRING, description: 'Modern CSS stylesheet without markdown blocks' },
            js: { type: Type.STRING, description: 'Vanilla ES6+ JavaScript logic with validation' },
            explanation: { type: Type.STRING, description: 'Explanation of layout and validation architecture' },
            modelPromptOptimized: {
              type: Type.STRING,
              description: 'The optimal meta-prompt formatted for any LLM model to replicate this',
            },
            validationHighlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of 3-5 key validation techniques implemented',
            },
          },
          required: ['title', 'description', 'html', 'css', 'js', 'explanation', 'modelPromptOptimized', 'validationHighlights'],
        },
      },
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error('Model returned empty response.');
    }

    const parsed = JSON.parse(outputText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating code:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred while generating code.',
    });
  }
});

// Setup Vite in Dev or Static Serving in Production
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
