import { GeneratedComponent } from '../types';

export const CURATED_TEMPLATES: GeneratedComponent[] = [
  {
    id: 'saas-registration',
    title: 'SaaS Workspace Onboarding & Enterprise Signup',
    description: 'Split-view modern onboarding form with real-time password strength meter, email domain detection, slug preview, and accessible error handling.',
    category: 'Enterprise Auth',
    validationHighlights: [
      'Real-time RFC 5322 work email validation with domain check',
      'Dynamic 4-tier password entropy meter (length, uppercase, number, symbol)',
      'Live workspace slug generation and regex sanitization',
      'Synchronized confirm-password verification on keystroke',
      'Accessible ARIA live error announcements and focus management',
    ],
    modelPromptOptimized: `Create a modern SaaS workspace registration page with a responsive 2-column split layout.
Left column: brand value proposition, 3 animated feature highlights, and trust indicators.
Right column: high-elevation glass/slate signup card.
Include interactive validation:
- Name (min 3 chars)
- Work Email (RFC regex, real-time validation, custom message if consumer email is used)
- Password (interactive 4-rule strength meter with visual progress bar)
- Confirm Password (instant equality check)
- Workspace Subdomain (live preview from name, slug format ^[a-z0-9-]+$)
- Terms checkbox
Provide pure HTML5, CSS3 with CSS custom properties, and vanilla ES6+ JavaScript. On submit, simulate an API call with button loading spinner and display a success confirmation.`,
    explanation: 'Employs a responsive CSS Grid split layout on desktop (>900px) that stacks cleanly on mobile (<768px). Uses modern CSS variables for uniform color palettes, interactive focus rings, and pure vanilla JS event listeners for immediate tactile feedback before submission.',
    html: `<!-- SaaS Registration Split Container -->
<div class="fc-wrapper">
  <div class="fc-container">
    <!-- Left Column: Value Prop & Trust -->
    <aside class="fc-hero-side">
      <div class="fc-brand">
        <div class="fc-logo-mark">⚡</div>
        <span class="fc-brand-title">Synthetix Cloud</span>
      </div>
      <h1 class="fc-hero-headline">Build faster with continuous cloud intelligence.</h1>
      <p class="fc-hero-subtext">Join over 14,000 engineering teams deploying serverless compute, global databases, and automated microservices in seconds.</p>

      <div class="fc-feature-list">
        <div class="fc-feature-item">
          <div class="fc-feature-icon">✓</div>
          <div>
            <strong>Instant Global Rollouts</strong>
            <p>Deploy to 35+ edge regions with automatic SSL and zero cold starts.</p>
          </div>
        </div>
        <div class="fc-feature-item">
          <div class="fc-feature-icon">✓</div>
          <div>
            <strong>Automated Team Roles</strong>
            <p>Granular RBAC, audit trails, and Single Sign-On (SAML/Okta) built-in.</p>
          </div>
        </div>
        <div class="fc-feature-item">
          <div class="fc-feature-icon">✓</div>
          <div>
            <strong>14-Day Free Evaluation</strong>
            <p>Full enterprise features unlocked. No credit card required upfront.</p>
          </div>
        </div>
      </div>

      <div class="fc-social-proof">
        <span class="fc-proof-metric">99.99%</span>
        <span class="fc-proof-label">Uptime SLA verified · ISO-27001 Certified · SOC2 Type II</span>
      </div>
    </aside>

    <!-- Right Column: Registration Card -->
    <main class="fc-form-side">
      <div class="fc-card" id="signupCard">
        <div class="fc-card-header">
          <h2 class="fc-card-title">Create your workspace</h2>
          <p class="fc-card-subtitle">Get started with your free 14-day team trial.</p>
        </div>

        <form id="registrationForm" novalidate autocomplete="off">
          <!-- Full Name Field -->
          <div class="fc-field-group">
            <label for="fullName" class="fc-label">Full Name <span class="fc-required">*</span></label>
            <div class="fc-input-wrap">
              <input type="text" id="fullName" name="fullName" class="fc-input" placeholder="Sarah Connor" required minlength="3" aria-describedby="fullNameError" aria-invalid="false">
              <span class="fc-field-icon" aria-hidden="true">👤</span>
            </div>
            <div id="fullNameError" class="fc-error-msg" role="alert" aria-live="polite"></div>
          </div>

          <!-- Work Email Field -->
          <div class="fc-field-group">
            <label for="workEmail" class="fc-label">Work Email <span class="fc-required">*</span></label>
            <div class="fc-input-wrap">
              <input type="email" id="workEmail" name="workEmail" class="fc-input" placeholder="sarah@acme.corp" required aria-describedby="workEmailError" aria-invalid="false">
              <span class="fc-field-icon" aria-hidden="true">✉</span>
            </div>
            <div id="workEmailError" class="fc-error-msg" role="alert" aria-live="polite"></div>
          </div>

          <!-- Workspace Slug Field -->
          <div class="fc-field-group">
            <label for="workspaceSlug" class="fc-label">Workspace Subdomain <span class="fc-required">*</span></label>
            <div class="fc-slug-wrap">
              <span class="fc-slug-prefix">https://</span>
              <input type="text" id="workspaceSlug" name="workspaceSlug" class="fc-input fc-slug-input" placeholder="acme-engineering" required aria-describedby="workspaceSlugError" aria-invalid="false">
              <span class="fc-slug-suffix">.synthetix.io</span>
            </div>
            <div id="workspaceSlugError" class="fc-error-msg" role="alert" aria-live="polite"></div>
          </div>

          <!-- Password Field & Strength Meter -->
          <div class="fc-field-group">
            <label for="password" class="fc-label">Password <span class="fc-required">*</span></label>
            <div class="fc-input-wrap">
              <input type="password" id="password" name="password" class="fc-input" placeholder="••••••••••••" required aria-describedby="passwordError" aria-invalid="false">
              <button type="button" id="togglePasswordBtn" class="fc-toggle-pw" aria-label="Toggle password visibility">👁</button>
            </div>
            <!-- Dynamic Strength Bar -->
            <div class="fc-strength-bar" aria-hidden="true">
              <div id="strengthSegment" class="fc-strength-fill"></div>
            </div>
            <div class="fc-strength-labels">
              <span id="strengthText">Enter password</span>
              <span id="strengthScore">0 / 4</span>
            </div>
            <!-- Checklist Criteria -->
            <ul class="fc-pw-checklist">
              <li id="ruleLength" class="fc-pw-rule"><span class="fc-rule-dot"></span> At least 8 characters</li>
              <li id="ruleUpper" class="fc-pw-rule"><span class="fc-rule-dot"></span> One uppercase letter</li>
              <li id="ruleNumber" class="fc-pw-rule"><span class="fc-rule-dot"></span> One numeric digit (0-9)</li>
              <li id="ruleSpecial" class="fc-pw-rule"><span class="fc-rule-dot"></span> One special character (!@#$%^&*)</li>
            </ul>
            <div id="passwordError" class="fc-error-msg" role="alert" aria-live="polite"></div>
          </div>

          <!-- Confirm Password -->
          <div class="fc-field-group">
            <label for="confirmPassword" class="fc-label">Confirm Password <span class="fc-required">*</span></label>
            <div class="fc-input-wrap">
              <input type="password" id="confirmPassword" name="confirmPassword" class="fc-input" placeholder="••••••••••••" required aria-describedby="confirmPasswordError" aria-invalid="false">
            </div>
            <div id="confirmPasswordError" class="fc-error-msg" role="alert" aria-live="polite"></div>
          </div>

          <!-- Terms Checkbox -->
          <div class="fc-field-group fc-checkbox-group">
            <label class="fc-checkbox-label">
              <input type="checkbox" id="agreeTerms" name="agreeTerms" required aria-describedby="agreeTermsError">
              <span class="fc-custom-box"></span>
              <span class="fc-checkbox-text">I agree to the <a href="#terms" class="fc-link">Terms of Service</a> and <a href="#privacy" class="fc-link">Privacy Policy</a></span>
            </label>
            <div id="agreeTermsError" class="fc-error-msg" role="alert" aria-live="polite"></div>
          </div>

          <!-- Submit Button -->
          <button type="submit" id="submitBtn" class="fc-btn-primary">
            <span class="fc-btn-text">Create Free Workspace</span>
            <span class="fc-btn-spinner" aria-hidden="true"></span>
          </button>
        </form>

        <!-- Success Confirmation State (Hidden by default) -->
        <div id="successPanel" class="fc-success-panel" style="display: none;">
          <div class="fc-success-icon">✓</div>
          <h3 class="fc-success-title">Workspace Created!</h3>
          <p class="fc-success-body">We've sent an activation link to <strong id="confirmedEmail">your email</strong>. Your custom domain <code id="confirmedSlug"></code> is provisioned.</p>
          <button type="button" id="resetFormBtn" class="fc-btn-secondary">Register Another Account</button>
        </div>
      </div>
    </main>
  </div>
</div>`,
    css: `/* Modern CSS Reset & Theme Tokens */
:root {
  --fc-bg: #090d16;
  --fc-surface: #111827;
  --fc-surface-hover: #1f2937;
  --fc-border: #374151;
  --fc-border-focus: #6366f1;
  --fc-primary: #4f46e5;
  --fc-primary-hover: #4338ca;
  --fc-text-main: #f9fafb;
  --fc-text-muted: #9ca3af;
  --fc-error: #ef4444;
  --fc-error-bg: rgba(239, 68, 68, 0.1);
  --fc-success: #10b981;
  --fc-radius-md: 10px;
  --fc-radius-lg: 16px;
  --fc-transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  --fc-font-display: 'Plus Jakarta Sans', system-ui, sans-serif;
  --fc-font-body: 'DM Sans', system-ui, sans-serif;
  --fc-font-mono: 'JetBrains Mono', monospace;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--fc-font-body);
  background-color: var(--fc-bg);
  color: var(--fc-text-main);
  line-height: 1.5;
  min-height: 100vh;
}

.fc-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
}

.fc-container {
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 3.5rem;
  align-items: center;
}

/* Hero / Brand Column */
.fc-hero-side {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.fc-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.fc-logo-mark {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: linear-gradient(135deg, #4f46e5, #06b6d4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
}

.fc-brand-title {
  font-family: var(--fc-font-display);
  font-weight: 700;
  font-size: 1.35rem;
  letter-spacing: -0.02em;
  color: #fff;
}

.fc-hero-headline {
  font-family: var(--fc-font-display);
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.03em;
  text-wrap: balance;
  color: #fff;
}

.fc-hero-subtext {
  font-size: 1.05rem;
  color: var(--fc-text-muted);
  max-width: 50ch;
  line-height: 1.6;
}

.fc-feature-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1rem;
}

.fc-feature-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.fc-feature-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: bold;
  flex-shrink: 0;
  margin-top: 2px;
}

.fc-feature-item strong {
  display: block;
  font-size: 0.95rem;
  color: #f3f4f6;
  margin-bottom: 0.2rem;
}

.fc-feature-item p {
  font-size: 0.85rem;
  color: var(--fc-text-muted);
}

.fc-social-proof {
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
}

.fc-proof-metric {
  font-family: var(--fc-font-mono);
  font-size: 1.2rem;
  font-weight: 700;
  color: #34d399;
}

.fc-proof-label {
  font-size: 0.8rem;
  color: var(--fc-text-muted);
}

/* Form Card Container */
.fc-card {
  background: var(--fc-surface);
  border: 1px solid var(--fc-border);
  border-radius: var(--fc-radius-lg);
  padding: 2.25rem;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
}

.fc-card-header {
  margin-bottom: 1.75rem;
}

.fc-card-title {
  font-family: var(--fc-font-display);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 0.35rem;
}

.fc-card-subtitle {
  font-size: 0.9rem;
  color: var(--fc-text-muted);
}

/* Fields & Inputs */
.fc-field-group {
  margin-bottom: 1.25rem;
  position: relative;
}

.fc-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #e5e7eb;
  margin-bottom: 0.45rem;
}

.fc-required {
  color: var(--fc-error);
}

.fc-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.fc-input {
  width: 100%;
  height: 44px;
  background: #1e293b;
  border: 1px solid var(--fc-border);
  border-radius: var(--fc-radius-md);
  padding: 0 2.5rem 0 1rem;
  color: var(--fc-text-main);
  font-size: 0.95rem;
  font-family: inherit;
  transition: var(--fc-transition);
}

.fc-input:focus {
  outline: none;
  border-color: var(--fc-border-focus);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
  background: #243048;
}

.fc-input[aria-invalid="true"] {
  border-color: var(--fc-error);
  background: rgba(239, 68, 68, 0.05);
}

.fc-field-icon {
  position: absolute;
  right: 1rem;
  color: var(--fc-text-muted);
  font-size: 0.9rem;
  pointer-events: none;
}

.fc-toggle-pw {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: var(--fc-text-muted);
  cursor: pointer;
  padding: 0.35rem;
  font-size: 1rem;
}

/* Slug wrap */
.fc-slug-wrap {
  display: flex;
  align-items: center;
  background: #1e293b;
  border: 1px solid var(--fc-border);
  border-radius: var(--fc-radius-md);
  overflow: hidden;
  height: 44px;
}

.fc-slug-prefix, .fc-slug-suffix {
  padding: 0 0.75rem;
  font-size: 0.85rem;
  color: var(--fc-text-muted);
  font-family: var(--fc-font-mono);
  background: rgba(0, 0, 0, 0.2);
  height: 100%;
  display: flex;
  align-items: center;
}

.fc-slug-input {
  border: none;
  background: transparent;
  padding: 0 0.5rem;
  font-family: var(--fc-font-mono);
  font-size: 0.9rem;
}

.fc-slug-wrap:focus-within {
  border-color: var(--fc-border-focus);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
}

/* Strength Meter */
.fc-strength-bar {
  width: 100%;
  height: 5px;
  background: #243048;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 0.6rem;
}

.fc-strength-fill {
  height: 100%;
  width: 0%;
  background: #64748b;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.fc-strength-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--fc-text-muted);
  margin-top: 0.35rem;
}

.fc-pw-checklist {
  list-style: none;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.35rem;
  margin-top: 0.75rem;
  padding: 0.6rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.fc-pw-rule {
  font-size: 0.75rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: var(--fc-transition);
}

.fc-rule-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #475569;
}

.fc-pw-rule.is-valid {
  color: var(--fc-success);
}

.fc-pw-rule.is-valid .fc-rule-dot {
  background: var(--fc-success);
}

/* Error messages */
.fc-error-msg {
  font-size: 0.78rem;
  color: var(--fc-error);
  margin-top: 0.35rem;
  min-height: 1.1rem;
  display: flex;
  align-items: center;
  transition: var(--fc-transition);
}

/* Checkbox */
.fc-checkbox-group {
  margin-top: 1rem;
}

.fc-checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: #d1d5db;
}

.fc-checkbox-label input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.fc-custom-box {
  width: 18px;
  height: 18px;
  border: 1px solid var(--fc-border);
  border-radius: 4px;
  background: #1e293b;
  flex-shrink: 0;
  margin-top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--fc-transition);
}

.fc-checkbox-label input[type="checkbox"]:checked + .fc-custom-box {
  background: var(--fc-primary);
  border-color: var(--fc-primary);
}

.fc-checkbox-label input[type="checkbox"]:checked + .fc-custom-box::after {
  content: "✓";
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
}

.fc-link {
  color: #818cf8;
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* Buttons */
.fc-btn-primary {
  width: 100%;
  height: 48px;
  background: var(--fc-primary);
  border: none;
  border-radius: var(--fc-radius-md);
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: var(--fc-transition);
  margin-top: 1.5rem;
}

.fc-btn-primary:hover:not(:disabled) {
  background: var(--fc-primary-hover);
  transform: translateY(-1px);
}

.fc-btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.fc-btn-spinner {
  display: none;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: fc-spin 0.8s linear infinite;
}

@keyframes fc-spin {
  to { transform: rotate(360deg); }
}

/* Success Confirmation Panel */
.fc-success-panel {
  text-align: center;
  padding: 2rem 1rem;
}

.fc-success-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.15);
  color: var(--fc-success);
  font-size: 1.8rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
}

.fc-success-title {
  font-family: var(--fc-font-display);
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.fc-success-body {
  font-size: 0.9rem;
  color: var(--fc-text-muted);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.fc-success-body code {
  background: #1e293b;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: var(--fc-font-mono);
  color: #a5b4fc;
}

.fc-btn-secondary {
  padding: 0.65rem 1.25rem;
  background: #1e293b;
  border: 1px solid var(--fc-border);
  border-radius: var(--fc-radius-md);
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: var(--fc-transition);
}

.fc-btn-secondary:hover {
  background: #334155;
}

/* Responsive Breakpoints */
@media (max-width: 900px) {
  .fc-container {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  .fc-hero-side {
    text-align: center;
    align-items: center;
  }
  .fc-feature-list {
    align-items: center;
    text-align: left;
  }
  .fc-social-proof {
    justify-content: center;
  }
}

@media (max-width: 500px) {
  .fc-wrapper {
    padding: 1rem;
  }
  .fc-card {
    padding: 1.5rem;
  }
  .fc-pw-checklist {
    grid-template-columns: 1fr;
  }
  .fc-slug-wrap {
    font-size: 0.8rem;
  }
}`,
    js: `// SaaS Registration Interactive Form Validation Engine
(function() {
  const form = document.getElementById('registrationForm');
  if (!form) return;

  const fullNameInput = document.getElementById('fullName');
  const workEmailInput = document.getElementById('workEmail');
  const workspaceSlugInput = document.getElementById('workspaceSlug');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  const agreeTermsCheckbox = document.getElementById('agreeTerms');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const submitBtn = document.getElementById('submitBtn');
  const signupCard = document.getElementById('signupCard');
  const successPanel = document.getElementById('successPanel');
  const confirmedEmail = document.getElementById('confirmedEmail');
  const confirmedSlug = document.getElementById('confirmedSlug');
  const resetFormBtn = document.getElementById('resetFormBtn');

  // Password rules
  const ruleLength = document.getElementById('ruleLength');
  const ruleUpper = document.getElementById('ruleUpper');
  const ruleNumber = document.getElementById('ruleNumber');
  const ruleSpecial = document.getElementById('ruleSpecial');
  const strengthSegment = document.getElementById('strengthSegment');
  const strengthText = document.getElementById('strengthText');
  const strengthScore = document.getElementById('strengthScore');

  // Helper: Set input error
  function setError(input, errorElementId, message) {
    input.setAttribute('aria-invalid', 'true');
    const errorEl = document.getElementById(errorElementId);
    if (errorEl) {
      errorEl.textContent = message;
    }
    return false;
  }

  // Helper: Clear input error
  function clearError(input, errorElementId) {
    input.setAttribute('aria-invalid', 'false');
    const errorEl = document.getElementById(errorElementId);
    if (errorEl) {
      errorEl.textContent = '';
    }
    return true;
  }

  // 1. Validate Full Name
  function validateFullName() {
    const val = fullNameInput.value.trim();
    if (!val) {
      return setError(fullNameInput, 'fullNameError', 'Full name is required.');
    }
    if (val.length < 3) {
      return setError(fullNameInput, 'fullNameError', 'Name must be at least 3 characters.');
    }
    return clearError(fullNameInput, 'fullNameError');
  }

  // 2. Validate Work Email
  function validateEmail() {
    const val = workEmailInput.value.trim();
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$/;
    if (!val) {
      return setError(workEmailInput, 'workEmailError', 'Email address is required.');
    }
    if (!emailRegex.test(val)) {
      return setError(workEmailInput, 'workEmailError', 'Please enter a valid email address.');
    }
    // Check for consumer emails
    const consumerDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
    const domain = val.split('@')[1]?.toLowerCase();
    if (domain && consumerDomains.includes(domain)) {
      return setError(workEmailInput, 'workEmailError', 'Please use your corporate work email (e.g. name@company.com).');
    }
    return clearError(workEmailInput, 'workEmailError');
  }

  // 3. Auto-populate slug from company/name if user has not typed one manually
  let slugUserEdited = false;
  fullNameInput.addEventListener('input', () => {
    validateFullName();
    if (!slugUserEdited && !workspaceSlugInput.value) {
      const slugVal = fullNameInput.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      workspaceSlugInput.value = slugVal.replace(/^-|-$/g, '');
      validateSlug();
    }
  });

  workspaceSlugInput.addEventListener('input', () => {
    slugUserEdited = true;
    validateSlug();
  });

  function validateSlug() {
    const val = workspaceSlugInput.value.trim();
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!val) {
      return setError(workspaceSlugInput, 'workspaceSlugError', 'Subdomain is required.');
    }
    if (val.length < 3 || val.length > 30) {
      return setError(workspaceSlugInput, 'workspaceSlugError', 'Subdomain must be between 3 and 30 characters.');
    }
    if (!slugRegex.test(val)) {
      return setError(workspaceSlugInput, 'workspaceSlugError', 'Only lowercase letters, numbers, and single hyphens allowed.');
    }
    return clearError(workspaceSlugInput, 'workspaceSlugError');
  }

  // 4. Password validation and entropy checking
  function checkPasswordEntropy(pw) {
    let score = 0;
    const hasLen = pw.length >= 8;
    const hasUpper = /[A-Z]/.test(pw);
    const hasNum = /[0-9]/.test(pw);
    const hasSpec = /[!@#$%^&*(),.?":{}|<>]/.test(pw);

    ruleLength.classList.toggle('is-valid', hasLen);
    ruleUpper.classList.toggle('is-valid', hasUpper);
    ruleNumber.classList.toggle('is-valid', hasNum);
    ruleSpecial.classList.toggle('is-valid', hasSpec);

    if (hasLen) score++;
    if (hasUpper) score++;
    if (hasNum) score++;
    if (hasSpec) score++;

    strengthScore.textContent = score + ' / 4';

    if (score === 0) {
      strengthSegment.style.width = '0%';
      strengthSegment.style.backgroundColor = '#64748b';
      strengthText.textContent = 'Enter password';
    } else if (score <= 1) {
      strengthSegment.style.width = '25%';
      strengthSegment.style.backgroundColor = '#ef4444';
      strengthText.textContent = 'Very weak';
    } else if (score === 2) {
      strengthSegment.style.width = '50%';
      strengthSegment.style.backgroundColor = '#f59e0b';
      strengthText.textContent = 'Moderate';
    } else if (score === 3) {
      strengthSegment.style.width = '75%';
      strengthSegment.style.backgroundColor = '#3b82f6';
      strengthText.textContent = 'Strong';
    } else {
      strengthSegment.style.width = '100%';
      strengthSegment.style.backgroundColor = '#10b981';
      strengthText.textContent = 'Enterprise grade';
    }

    return score >= 3;
  }

  function validatePassword() {
    const pw = passwordInput.value;
    const isValid = checkPasswordEntropy(pw);
    if (!pw) {
      return setError(passwordInput, 'passwordError', 'Password is required.');
    }
    if (!isValid) {
      return setError(passwordInput, 'passwordError', 'Please fulfill at least 3 security criteria.');
    }
    clearError(passwordInput, 'passwordError');
    if (confirmPasswordInput.value) {
      validateConfirmPassword();
    }
    return true;
  }

  // 5. Confirm Password Validation
  function validateConfirmPassword() {
    const pw = passwordInput.value;
    const confirmPw = confirmPasswordInput.value;
    if (!confirmPw) {
      return setError(confirmPasswordInput, 'confirmPasswordError', 'Please confirm your password.');
    }
    if (pw !== confirmPw) {
      return setError(confirmPasswordInput, 'confirmPasswordError', 'Passwords do not match.');
    }
    return clearError(confirmPasswordInput, 'confirmPasswordError');
  }

  // 6. Terms Validation
  function validateTerms() {
    if (!agreeTermsCheckbox.checked) {
      return setError(agreeTermsCheckbox, 'agreeTermsError', 'You must agree to the Terms to continue.');
    }
    return clearError(agreeTermsCheckbox, 'agreeTermsError');
  }

  // Event Listeners for real-time validation
  workEmailInput.addEventListener('blur', validateEmail);
  workEmailInput.addEventListener('input', () => {
    if (workEmailInput.getAttribute('aria-invalid') === 'true') validateEmail();
  });

  passwordInput.addEventListener('input', validatePassword);
  confirmPasswordInput.addEventListener('input', validateConfirmPassword);
  agreeTermsCheckbox.addEventListener('change', validateTerms);

  // Toggle Password Visibility
  togglePasswordBtn.addEventListener('click', () => {
    const isPw = passwordInput.type === 'password';
    passwordInput.type = isPw ? 'text' : 'password';
    togglePasswordBtn.textContent = isPw ? '🔒' : '👁';
  });

  // Form Submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const isNameValid = validateFullName();
    const isEmailValid = validateEmail();
    const isSlugValid = validateSlug();
    const isPwValid = validatePassword();
    const isConfirmValid = validateConfirmPassword();
    const isTermsValid = validateTerms();

    if (!isNameValid || !isEmailValid || !isSlugValid || !isPwValid || !isConfirmValid || !isTermsValid) {
      // Focus first invalid element
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Submit state: Loading spinner
    submitBtn.disabled = true;
    const btnText = submitBtn.querySelector('.fc-btn-text');
    const btnSpinner = submitBtn.querySelector('.fc-btn-spinner');
    btnText.textContent = 'Provisioning Cluster...';
    btnSpinner.style.display = 'inline-block';

    setTimeout(() => {
      // Simulated server success
      form.style.display = 'none';
      successPanel.style.display = 'block';
      confirmedEmail.textContent = workEmailInput.value;
      confirmedSlug.textContent = 'https://' + workspaceSlugInput.value + '.synthetix.io';
    }, 1200);
  });

  // Reset form
  resetFormBtn.addEventListener('click', () => {
    form.reset();
    form.style.display = 'block';
    successPanel.style.display = 'none';
    submitBtn.disabled = false;
    submitBtn.querySelector('.fc-btn-text').textContent = 'Create Free Workspace';
    submitBtn.querySelector('.fc-btn-spinner').style.display = 'none';
    checkPasswordEntropy('');
  });
})();`,
  },
  {
    id: 'smart-checkout',
    title: 'Fintech Smart Checkout & Payment Card Form',
    description: 'High-security checkout with real-time Luhn algorithm validation, automatic card brand recognition (Visa/MC/Amex), dynamic CVV hints, and postal code verification.',
    category: 'Fintech & Payments',
    validationHighlights: [
      'Real-time Luhn checksum algorithm for valid card number checks',
      'Automatic card brand logo detection (Visa, Mastercard, Amex, Discover)',
      'Smart spacing and numeric input mask for 16-digit card and MM/YY expiration',
      'Dynamic year/month validation preventing expired cards',
      'Live subtotal recalculation with promo code test engine ("SAVE20")',
    ],
    modelPromptOptimized: `Create a responsive checkout and credit card payment form.
Features:
- Credit Card Number input with automatic Luhn algorithm validation, auto 4-digit formatting, and instant card issuer detection (Visa, Mastercard, Amex).
- Expiration date (MM/YY) with real-time check against current date.
- CVV (3-4 digits based on card type) with interactive flip help.
- Cardholder Name (alpha spaces only, min 2 words).
- Billing Postal/ZIP Code.
- Modern dark financial styling with bank-grade encryption badges.
- Return pure HTML5, modern CSS3 with custom properties, and vanilla JavaScript.`,
    explanation: 'Demonstrates mathematically rigorous client-side validation using the Luhn algorithm, input masking with cursor preservation, and smooth visual feedback on card brand discovery.',
    html: `<div class="fc-pay-wrap">
  <div class="fc-pay-container">
    <!-- Order Summary Panel -->
    <div class="fc-pay-summary">
      <div class="fc-summary-header">
        <h3>Order Summary</h3>
        <span class="fc-order-id">INV-84920</span>
      </div>
      <div class="fc-item-row">
        <div>
          <div class="fc-item-name">Pro Architecture Plan</div>
          <div class="fc-item-desc">Annual billing · 10 team seats</div>
        </div>
        <div class="fc-item-price">$240.00</div>
      </div>
      <div class="fc-item-row">
        <div>
          <div class="fc-item-name">Dedicated Dedicated Cloud VPC</div>
          <div class="fc-item-desc">High-bandwidth peering add-on</div>
        </div>
        <div class="fc-item-price">$60.00</div>
      </div>

      <!-- Promo Code Field -->
      <div class="fc-promo-wrap">
        <input type="text" id="promoInput" placeholder="Promo code (try SAVE20)" class="fc-promo-input">
        <button type="button" id="applyPromoBtn" class="fc-promo-btn">Apply</button>
      </div>
      <div id="promoNotice" class="fc-promo-notice"></div>

      <div class="fc-divider"></div>
      <div class="fc-total-row">
        <span>Total Due Today</span>
        <span id="totalDisplay" class="fc-total-amount">$300.00</span>
      </div>
      <div class="fc-guarantee">
        <span>🔒 256-Bit SSL Encrypted Payment</span>
      </div>
    </div>

    <!-- Payment Form -->
    <div class="fc-pay-card">
      <div class="fc-pay-title-row">
        <h2>Payment Details</h2>
        <div id="cardBrandBadge" class="fc-brand-badge">💳 Standard Card</div>
      </div>

      <form id="paymentForm" novalidate>
        <!-- Cardholder Name -->
        <div class="fc-field">
          <label for="cardName">Cardholder Name <span class="req">*</span></label>
          <input type="text" id="cardName" class="fc-text-input" placeholder="Alexander Hamilton" required>
          <div id="cardNameError" class="fc-field-error"></div>
        </div>

        <!-- Card Number -->
        <div class="fc-field">
          <label for="cardNumber">Card Number <span class="req">*</span></label>
          <div class="fc-card-num-box">
            <input type="text" id="cardNumber" class="fc-text-input fc-mono-input" placeholder="4532 •••• •••• 8921" maxlength="19" required>
            <span id="luhnStatus" class="fc-luhn-status"></span>
          </div>
          <div id="cardNumberError" class="fc-field-error"></div>
        </div>

        <!-- Expiry & CVV Row -->
        <div class="fc-two-col">
          <div class="fc-field">
            <label for="cardExpiry">Expires (MM/YY) <span class="req">*</span></label>
            <input type="text" id="cardExpiry" class="fc-text-input fc-mono-input" placeholder="12/28" maxlength="5" required>
            <div id="cardExpiryError" class="fc-field-error"></div>
          </div>
          <div class="fc-field">
            <label for="cardCvv">Security Code (CVV) <span class="req">*</span></label>
            <input type="password" id="cardCvv" class="fc-text-input fc-mono-input" placeholder="•••" maxlength="4" required>
            <div id="cardCvvError" class="fc-field-error"></div>
          </div>
        </div>

        <!-- Billing ZIP -->
        <div class="fc-field">
          <label for="billingZip">Billing ZIP / Postal Code <span class="req">*</span></label>
          <input type="text" id="billingZip" class="fc-text-input" placeholder="10001 or W1A 1AA" required>
          <div id="billingZipError" class="fc-field-error"></div>
        </div>

        <button type="submit" id="paySubmitBtn" class="fc-pay-btn">
          <span class="btn-lbl">Pay $300.00 Securely</span>
          <span class="btn-spin" style="display:none;"></span>
        </button>
      </form>

      <div id="paymentSuccess" class="fc-pay-success" style="display:none;">
        <div class="success-check">✓</div>
        <h3>Payment Authorized</h3>
        <p>Transaction ID: <code id="txnId">TXN-719302</code></p>
        <p class="receipt-note">Receipt sent to your billing email address.</p>
        <button type="button" id="payAnotherBtn" class="fc-reset-btn">Make Another Transaction</button>
      </div>
    </div>
  </div>
</div>`,
    css: `:root {
  --p-bg: #0b0f19;
  --p-card: #131c2e;
  --p-border: #23304a;
  --p-primary: #10b981;
  --p-primary-hover: #059669;
  --p-accent: #3b82f6;
  --p-text: #f8fafc;
  --p-muted: #94a3b8;
  --p-error: #f43f5e;
}

.fc-pay-wrap {
  min-height: 100vh;
  background: var(--p-bg);
  color: var(--p-text);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'DM Sans', system-ui, sans-serif;
}

.fc-pay-container {
  width: 100%;
  max-width: 960px;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 2rem;
  background: var(--p-card);
  border: 1px solid var(--p-border);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
}

.fc-pay-summary {
  background: #0f172a;
  padding: 2.25rem;
  border-right: 1px solid var(--p-border);
  display: flex;
  flex-direction: column;
}

.fc-summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.fc-summary-header h3 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
}

.fc-order-id {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--p-muted);
}

.fc-item-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.fc-item-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.fc-item-desc {
  font-size: 0.8rem;
  color: var(--p-muted);
}

.fc-item-price {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
}

.fc-promo-wrap {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.fc-promo-input {
  flex: 1;
  background: #1e293b;
  border: 1px solid var(--p-border);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  color: #fff;
  font-size: 0.85rem;
}

.fc-promo-btn {
  background: #334155;
  border: none;
  color: #fff;
  padding: 0 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
}

.fc-promo-notice {
  font-size: 0.8rem;
  margin-top: 0.4rem;
  min-height: 1.2rem;
}

.fc-divider {
  height: 1px;
  background: var(--p-border);
  margin: 1.5rem 0;
}

.fc-total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 700;
}

.fc-total-amount {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  color: var(--p-primary);
}

.fc-guarantee {
  margin-top: auto;
  padding-top: 1.5rem;
  font-size: 0.8rem;
  color: var(--p-muted);
  text-align: center;
}

/* Payment Form Side */
.fc-pay-card {
  padding: 2.25rem;
}

.fc-pay-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.fc-pay-title-row h2 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.35rem;
  font-weight: 700;
}

.fc-brand-badge {
  font-size: 0.8rem;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  background: #1e293b;
  border: 1px solid var(--p-border);
  font-weight: 600;
}

.fc-field {
  margin-bottom: 1.15rem;
}

.fc-field label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #cbd5e1;
}

.req { color: var(--p-error); }

.fc-text-input {
  width: 100%;
  height: 42px;
  background: #0f172a;
  border: 1px solid var(--p-border);
  border-radius: 8px;
  padding: 0 0.85rem;
  color: #fff;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.fc-mono-input {
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.05em;
}

.fc-text-input:focus {
  outline: none;
  border-color: var(--p-accent);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.fc-two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.fc-card-num-box {
  position: relative;
}

.fc-luhn-status {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.85rem;
}

.fc-field-error {
  font-size: 0.78rem;
  color: var(--p-error);
  margin-top: 0.3rem;
  min-height: 1.1rem;
}

.fc-pay-btn {
  width: 100%;
  height: 46px;
  background: var(--p-primary);
  border: none;
  border-radius: 8px;
  color: #0b0f19;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.fc-pay-btn:hover {
  background: var(--p-primary-hover);
}

.btn-spin {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(0,0,0,0.3);
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.fc-pay-success {
  text-align: center;
  padding: 2rem 1rem;
}

.success-check {
  width: 52px;
  height: 52px;
  background: rgba(16, 185, 129, 0.2);
  color: var(--p-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 1rem;
}

.receipt-note {
  font-size: 0.85rem;
  color: var(--p-muted);
  margin: 0.5rem 0 1.5rem;
}

.fc-reset-btn {
  background: #1e293b;
  border: 1px solid var(--p-border);
  color: #fff;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .fc-pay-container {
    grid-template-columns: 1fr;
  }
  .fc-pay-summary {
    border-right: none;
    border-bottom: 1px solid var(--p-border);
  }
}`,
    js: `// Fintech Checkout Validation Engine with Luhn Check
(function() {
  const form = document.getElementById('paymentForm');
  if (!form) return;

  const cardName = document.getElementById('cardName');
  const cardNumber = document.getElementById('cardNumber');
  const cardExpiry = document.getElementById('cardExpiry');
  const cardCvv = document.getElementById('cardCvv');
  const billingZip = document.getElementById('billingZip');
  const cardBrandBadge = document.getElementById('cardBrandBadge');
  const luhnStatus = document.getElementById('luhnStatus');
  const paySubmitBtn = document.getElementById('paySubmitBtn');
  const paymentSuccess = document.getElementById('paymentSuccess');
  const payAnotherBtn = document.getElementById('payAnotherBtn');

  // Promo Engine
  const promoInput = document.getElementById('promoInput');
  const applyPromoBtn = document.getElementById('applyPromoBtn');
  const promoNotice = document.getElementById('promoNotice');
  const totalDisplay = document.getElementById('totalDisplay');
  let currentTotal = 300.00;

  applyPromoBtn.addEventListener('click', () => {
    const code = promoInput.value.trim().toUpperCase();
    if (code === 'SAVE20') {
      currentTotal = 240.00;
      totalDisplay.textContent = '$240.00';
      paySubmitBtn.querySelector('.btn-lbl').textContent = 'Pay $240.00 Securely';
      promoNotice.style.color = '#10b981';
      promoNotice.textContent = 'Promo applied: 20% discount saved $60.00!';
      applyPromoBtn.disabled = true;
    } else {
      promoNotice.style.color = '#f43f5e';
      promoNotice.textContent = 'Invalid promo code. Try "SAVE20".';
    }
  });

  // Card Brand Detection & Format
  cardNumber.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\\D/g, '');
    let formatted = '';

    // Detect issuer
    if (/^4/.test(value)) {
      cardBrandBadge.textContent = '💳 Visa';
      cardBrandBadge.style.color = '#60a5fa';
    } else if (/^5[1-5]/.test(value)) {
      cardBrandBadge.textContent = '💳 Mastercard';
      cardBrandBadge.style.color = '#f97316';
    } else if (/^3[47]/.test(value)) {
      cardBrandBadge.textContent = '💳 Amex';
      cardBrandBadge.style.color = '#38bdf8';
    } else if (/^6(?:011|5)/.test(value)) {
      cardBrandBadge.textContent = '💳 Discover';
      cardBrandBadge.style.color = '#fbbf24';
    } else {
      cardBrandBadge.textContent = '💳 Standard Card';
      cardBrandBadge.style.color = '#94a3b8';
    }

    // Auto format in 4s
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += value[i];
    }
    e.target.value = formatted;

    // Check Luhn if full length (16 digits)
    if (value.length >= 15) {
      if (isValidLuhn(value)) {
        luhnStatus.textContent = '✓';
        luhnStatus.style.color = '#10b981';
        document.getElementById('cardNumberError').textContent = '';
      } else {
        luhnStatus.textContent = '✗';
        luhnStatus.style.color = '#f43f5e';
        document.getElementById('cardNumberError').textContent = 'Invalid card number checksum.';
      }
    } else {
      luhnStatus.textContent = '';
    }
  });

  // Luhn Algorithm Implementation
  function isValidLuhn(numStr) {
    let sum = 0;
    let shouldDouble = false;
    for (let i = numStr.length - 1; i >= 0; i--) {
      let digit = parseInt(numStr.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  }

  // Format Expiration MM/YY
  cardExpiry.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\\D/g, '');
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    e.target.value = val;
    validateExpiry();
  });

  function validateExpiry() {
    const val = cardExpiry.value.trim();
    const err = document.getElementById('cardExpiryError');
    if (!/^\\d{2}\\/\\d{2}$/.test(val)) {
      err.textContent = 'Format must be MM/YY';
      return false;
    }
    const [month, year] = val.split('/').map(Number);
    if (month < 1 || month > 12) {
      err.textContent = 'Invalid month (01-12)';
      return false;
    }
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      err.textContent = 'Card has expired';
      return false;
    }
    err.textContent = '';
    return true;
  }

  // Form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    // Name check
    if (!cardName.value.trim() || cardName.value.trim().length < 4) {
      document.getElementById('cardNameError').textContent = 'Enter full cardholder name';
      valid = false;
    } else {
      document.getElementById('cardNameError').textContent = '';
    }

    // Card number check
    const rawCard = cardNumber.value.replace(/\\s/g, '');
    if (rawCard.length < 15 || !isValidLuhn(rawCard)) {
      document.getElementById('cardNumberError').textContent = 'Valid card number is required';
      valid = false;
    }

    // Expiry
    if (!validateExpiry()) valid = false;

    // CVV
    if (!cardCvv.value || cardCvv.value.length < 3) {
      document.getElementById('cardCvvError').textContent = 'Enter 3 or 4 digit CVV';
      valid = false;
    } else {
      document.getElementById('cardCvvError').textContent = '';
    }

    // Zip
    if (!billingZip.value || billingZip.value.trim().length < 3) {
      document.getElementById('billingZipError').textContent = 'Enter valid postal code';
      valid = false;
    } else {
      document.getElementById('billingZipError').textContent = '';
    }

    if (!valid) return;

    // Simulate submission
    paySubmitBtn.disabled = true;
    paySubmitBtn.querySelector('.btn-lbl').textContent = 'Authorizing...';
    paySubmitBtn.querySelector('.btn-spin').style.display = 'inline-block';

    setTimeout(() => {
      form.style.display = 'none';
      paymentSuccess.style.display = 'block';
      document.getElementById('txnId').textContent = 'TXN-' + Math.floor(100000 + Math.random() * 900000);
    }, 1400);
  });

  payAnotherBtn.addEventListener('click', () => {
    form.reset();
    form.style.display = 'block';
    paymentSuccess.style.display = 'none';
    paySubmitBtn.disabled = false;
    paySubmitBtn.querySelector('.btn-lbl').textContent = 'Pay $' + currentTotal.toFixed(2) + ' Securely';
    paySubmitBtn.querySelector('.btn-spin').style.display = 'none';
    cardBrandBadge.textContent = '💳 Standard Card';
    luhnStatus.textContent = '';
  });
})();`,
  },
  {
    id: 'event-booking',
    title: 'Multi-Step Interactive Event Reservation & Ticket Stepper',
    description: 'Progressive disclosure multi-step form with step gating, real-time ticket calculation, date constraints, and instant attendee verification.',
    category: 'Booking & Stepper',
    validationHighlights: [
      'Multi-step progressive gating (Step 1 required before Step 2 unlocked)',
      'Real-time price & tier calculator dynamically updating subtotals',
      'HTML5 date validation preventing past date reservations',
      'Attendee seat counter with min/max range constraints',
      'Accessible keyboard stepper navigation and status feedback',
    ],
    modelPromptOptimized: `Build a 3-step modern event reservation wizard.
Step 1: Ticket Tier (Standard $99, VIP $249, Backstage $499) + Attendee Count + Date selector.
Step 2: Primary Attendee information (Name, Email, Phone, Dietary requirements).
Step 3: Summary Review & Confirmation.
Requirements:
- Stepper indicator showing active and completed steps.
- Validate Step 1 completely before allowing transition to Step 2.
- Total price auto-updates upon changing quantity or tier.
- Mobile-first responsive layout with clean cards and zero horizontal overflow.
- Return pure HTML, CSS variables, and vanilla JavaScript.`,
    explanation: 'Uses a state machine in vanilla JavaScript to manage multi-step form state, validate individual step boundaries, and calculate running subtotals smoothly without page refreshes.',
    html: `<div class="fc-step-wrap">
  <div class="fc-step-card">
    <div class="fc-stepper-header">
      <div class="fc-step-pill active" id="pill1"><span>1</span> Ticket Tier</div>
      <div class="fc-step-connector"></div>
      <div class="fc-step-pill" id="pill2"><span>2</span> Attendee Info</div>
      <div class="fc-step-connector"></div>
      <div class="fc-step-pill" id="pill3"><span>3</span> Confirm</div>
    </div>

    <form id="bookingForm" novalidate>
      <!-- STEP 1: Select Tier & Quantity -->
      <div class="fc-step-view active" id="stepView1">
        <h3 class="step-title">Select Tickets & Event Date</h3>
        
        <div class="tier-grid">
          <label class="tier-card selected">
            <input type="radio" name="ticketTier" value="99" checked>
            <span class="tier-name">General Admission</span>
            <span class="tier-cost">$99</span>
            <span class="tier-desc">Main stage access & swag bag</span>
          </label>
          <label class="tier-card">
            <input type="radio" name="ticketTier" value="249">
            <span class="tier-name">VIP Pass</span>
            <span class="tier-cost">$249</span>
            <span class="tier-desc">Priority lounge, speaker Q&A & catered lunch</span>
          </label>
        </div>

        <div class="field-row">
          <div class="field-item">
            <label for="eventDate">Select Date <span class="req">*</span></label>
            <input type="date" id="eventDate" class="step-input" required>
            <div id="dateError" class="step-err"></div>
          </div>
          <div class="field-item">
            <label for="ticketQty">Quantity (1-5) <span class="req">*</span></label>
            <input type="number" id="ticketQty" class="step-input" min="1" max="5" value="1" required>
            <div id="qtyError" class="step-err"></div>
          </div>
        </div>

        <div class="calc-strip">
          <span>Estimated Total:</span>
          <strong id="livePrice">$99.00</strong>
        </div>

        <div class="step-actions">
          <button type="button" id="toStep2Btn" class="step-next-btn">Continue to Details →</button>
        </div>
      </div>

      <!-- STEP 2: Attendee Details -->
      <div class="fc-step-view" id="stepView2">
        <h3 class="step-title">Primary Attendee Details</h3>
        
        <div class="field-item">
          <label for="attendeeName">Full Name <span class="req">*</span></label>
          <input type="text" id="attendeeName" class="step-input" placeholder="Jordan Vance">
          <div id="nameError" class="step-err"></div>
        </div>

        <div class="field-item">
          <label for="attendeeEmail">Email Address <span class="req">*</span></label>
          <input type="email" id="attendeeEmail" class="step-input" placeholder="jordan@domain.com">
          <div id="emailError" class="step-err"></div>
        </div>

        <div class="field-item">
          <label for="attendeePhone">Phone Number <span class="req">*</span></label>
          <input type="tel" id="attendeePhone" class="step-input" placeholder="+1 (555) 019-2834">
          <div id="phoneError" class="step-err"></div>
        </div>

        <div class="step-actions split">
          <button type="button" id="backToStep1Btn" class="step-back-btn">← Back</button>
          <button type="button" id="toStep3Btn" class="step-next-btn">Review Order →</button>
        </div>
      </div>

      <!-- STEP 3: Review & Final Submit -->
      <div class="fc-step-view" id="stepView3">
        <h3 class="step-title">Review & Confirm Reservation</h3>
        <div class="summary-box">
          <div class="summary-line"><span>Ticket Type:</span> <strong id="sumTier">General Admission</strong></div>
          <div class="summary-line"><span>Quantity:</span> <strong id="sumQty">1</strong></div>
          <div class="summary-line"><span>Date:</span> <strong id="sumDate">Not selected</strong></div>
          <div class="summary-line"><span>Primary Guest:</span> <strong id="sumName">Jordan Vance</strong></div>
          <div class="summary-line highlight"><span>Total Payable:</span> <strong id="sumTotal">$99.00</strong></div>
        </div>

        <div class="step-actions split">
          <button type="button" id="backToStep2Btn" class="step-back-btn">← Modify</button>
          <button type="submit" id="finalSubmitBtn" class="step-next-btn finish">Confirm & Reserve</button>
        </div>
      </div>
    </form>

    <div id="bookingSuccess" class="step-success" style="display:none;">
      <div class="badge-icon">🎉</div>
      <h3>Reservation Confirmed!</h3>
      <p>Your tickets have been issued. Booking reference <code id="refCode">EVT-9281</code>.</p>
      <button type="button" id="newBookingBtn" class="step-next-btn" style="margin-top:1rem;">Book Another</button>
    </div>
  </div>
</div>`,
    css: `:root {
  --sb-bg: #0d1117;
  --sb-card: #161b22;
  --sb-border: #30363d;
  --sb-accent: #58a6ff;
  --sb-success: #238636;
  --sb-text: #c9d1d9;
}

.fc-step-wrap {
  min-height: 100vh;
  background: var(--sb-bg);
  color: var(--sb-text);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'DM Sans', system-ui, sans-serif;
}

.fc-step-card {
  width: 100%;
  max-width: 640px;
  background: var(--sb-card);
  border: 1px solid var(--sb-border);
  border-radius: 14px;
  padding: 2rem;
  box-shadow: 0 16px 36px rgba(0,0,0,0.4);
}

.fc-stepper-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.fc-step-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #8b949e;
}

.fc-step-pill span {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #21262d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
}

.fc-step-pill.active {
  color: #58a6ff;
}

.fc-step-pill.active span {
  background: #1f6feb;
  color: #fff;
}

.fc-step-pill.completed {
  color: #3fb950;
}

.fc-step-pill.completed span {
  background: #238636;
  color: #fff;
}

.fc-step-connector {
  flex: 1;
  height: 2px;
  background: #21262d;
  margin: 0 0.5rem;
}

.fc-step-view {
  display: none;
}

.fc-step-view.active {
  display: block;
}

.step-title {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.25rem;
  margin-bottom: 1.25rem;
  color: #f0f6fc;
}

.tier-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.tier-card {
  border: 1px solid var(--sb-border);
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  background: #0d1117;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}

.tier-card input { display: none; }

.tier-card.selected {
  border-color: #58a6ff;
  background: rgba(31, 111, 235, 0.1);
}

.tier-name { font-weight: 700; color: #fff; margin-bottom: 0.25rem; font-size: 0.95rem; }
.tier-cost { font-family: 'JetBrains Mono', monospace; font-size: 1.2rem; color: #58a6ff; margin-bottom: 0.35rem; }
.tier-desc { font-size: 0.75rem; color: #8b949e; }

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.field-item {
  margin-bottom: 1rem;
}

.field-item label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.35rem;
  color: #c9d1d9;
}

.step-input {
  width: 100%;
  height: 40px;
  background: #0d1117;
  border: 1px solid var(--sb-border);
  border-radius: 6px;
  padding: 0 0.75rem;
  color: #fff;
  font-size: 0.9rem;
}

.step-err {
  font-size: 0.75rem;
  color: #f85149;
  margin-top: 0.25rem;
  min-height: 1rem;
}

.calc-strip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #0d1117;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-size: 0.9rem;
}

.calc-strip strong {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.15rem;
  color: #3fb950;
}

.step-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.step-actions.split {
  justify-content: space-between;
}

.step-next-btn {
  background: #238636;
  color: #fff;
  border: none;
  padding: 0.65rem 1.25rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.step-next-btn.finish {
  background: #1f6feb;
}

.step-back-btn {
  background: #21262d;
  color: #c9d1d9;
  border: 1px solid var(--sb-border);
  padding: 0.65rem 1.25rem;
  border-radius: 6px;
  cursor: pointer;
}

.summary-box {
  background: #0d1117;
  border: 1px solid var(--sb-border);
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  padding: 0.4rem 0;
  font-size: 0.9rem;
}

.summary-line.highlight {
  border-top: 1px solid var(--sb-border);
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  font-size: 1rem;
  color: #3fb950;
}

.step-success {
  text-align: center;
  padding: 2rem 0;
}

.badge-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

@media (max-width: 500px) {
  .tier-grid, .field-row { grid-template-columns: 1fr; }
}`,
    js: `// Multi-Step Reservation Validation Engine
(function() {
  let currentStep = 1;
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const pill1 = document.getElementById('pill1');
  const pill2 = document.getElementById('pill2');
  const pill3 = document.getElementById('pill3');
  const stepView1 = document.getElementById('stepView1');
  const stepView2 = document.getElementById('stepView2');
  const stepView3 = document.getElementById('stepView3');

  const tierCards = document.querySelectorAll('.tier-card');
  const ticketQty = document.getElementById('ticketQty');
  const eventDate = document.getElementById('eventDate');
  const livePrice = document.getElementById('livePrice');

  // Disable past dates on calendar
  const today = new Date().toISOString().split('T')[0];
  eventDate.min = today;

  // Tier selection
  let selectedPrice = 99;
  let selectedTierName = 'General Admission';

  tierCards.forEach(card => {
    card.addEventListener('click', () => {
      tierCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input');
      radio.checked = true;
      selectedPrice = parseInt(radio.value, 10);
      selectedTierName = card.querySelector('.tier-name').textContent;
      updatePrice();
    });
  });

  ticketQty.addEventListener('input', updatePrice);

  function updatePrice() {
    let qty = parseInt(ticketQty.value, 10) || 1;
    if (qty < 1) qty = 1;
    if (qty > 5) qty = 5;
    const total = selectedPrice * qty;
    livePrice.textContent = '$' + total.toFixed(2);
  }

  // STEP 1 -> STEP 2
  document.getElementById('toStep2Btn').addEventListener('click', () => {
    let valid = true;
    if (!eventDate.value) {
      document.getElementById('dateError').textContent = 'Please select a date.';
      valid = false;
    } else {
      document.getElementById('dateError').textContent = '';
    }

    const qty = parseInt(ticketQty.value, 10);
    if (!qty || qty < 1 || qty > 5) {
      document.getElementById('qtyError').textContent = 'Quantity must be between 1 and 5.';
      valid = false;
    } else {
      document.getElementById('qtyError').textContent = '';
    }

    if (!valid) return;

    // Switch view
    currentStep = 2;
    stepView1.classList.remove('active');
    stepView2.classList.add('active');
    pill1.classList.add('completed');
    pill2.classList.add('active');
  });

  // STEP 2 -> STEP 1
  document.getElementById('backToStep1Btn').addEventListener('click', () => {
    currentStep = 1;
    stepView2.classList.remove('active');
    stepView1.classList.add('active');
    pill2.classList.remove('active');
  });

  // STEP 2 -> STEP 3
  document.getElementById('toStep3Btn').addEventListener('click', () => {
    const name = document.getElementById('attendeeName').value.trim();
    const email = document.getElementById('attendeeEmail').value.trim();
    const phone = document.getElementById('attendeePhone').value.trim();
    let valid = true;

    if (!name || name.length < 3) {
      document.getElementById('nameError').textContent = 'Name must be at least 3 characters.';
      valid = false;
    } else {
      document.getElementById('nameError').textContent = '';
    }

    if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      document.getElementById('emailError').textContent = 'Valid email is required.';
      valid = false;
    } else {
      document.getElementById('emailError').textContent = '';
    }

    if (!phone || phone.length < 7) {
      document.getElementById('phoneError').textContent = 'Valid phone is required.';
      valid = false;
    } else {
      document.getElementById('phoneError').textContent = '';
    }

    if (!valid) return;

    // Populate review summary
    document.getElementById('sumTier').textContent = selectedTierName;
    document.getElementById('sumQty').textContent = ticketQty.value;
    document.getElementById('sumDate').textContent = eventDate.value;
    document.getElementById('sumName').textContent = name;
    document.getElementById('sumTotal').textContent = livePrice.textContent;

    currentStep = 3;
    stepView2.classList.remove('active');
    stepView3.classList.add('active');
    pill2.classList.add('completed');
    pill3.classList.add('active');
  });

  // STEP 3 -> STEP 2
  document.getElementById('backToStep2Btn').addEventListener('click', () => {
    currentStep = 2;
    stepView3.classList.remove('active');
    stepView2.classList.add('active');
    pill3.classList.remove('active');
  });

  // FINAL SUBMISSION
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.style.display = 'none';
    const successBox = document.getElementById('bookingSuccess');
    successBox.style.display = 'block';
    document.getElementById('refCode').textContent = 'EVT-' + Math.floor(1000 + Math.random() * 9000);
  });

  document.getElementById('newBookingBtn').addEventListener('click', () => {
    form.reset();
    form.style.display = 'block';
    document.getElementById('bookingSuccess').style.display = 'none';
    stepView3.classList.remove('active');
    stepView1.classList.add('active');
    pill1.className = 'fc-step-pill active';
    pill2.className = 'fc-step-pill';
    pill3.className = 'fc-step-pill';
    updatePrice();
  });
})();`,
  },
  {
    id: 'feedback-survey',
    title: 'Customer Experience & Quality Audit Survey',
    description: 'Accessible interactive survey with dynamic 5-star rating, character constraint meter, tag selection requirements, and file size validation.',
    category: 'Feedback & UX',
    validationHighlights: [
      'Interactive 5-star rating with hover state and keyboard accessibility',
      'Dynamic multi-select category tags (enforcing min 1 tag selected)',
      'Real-time character counter (min 20, max 300) with color thresholds',
      'Client-side file attachment validation (size < 4MB and allowed MIME types)',
      'Net Promoter Score 0-10 radio scale with aria-checked bindings',
    ],
    modelPromptOptimized: `Create an interactive customer experience feedback survey.
Components:
- 5-Star visual rating with hover effects and keyboard navigation.
- Category pills (Support, Speed, Quality, Design) requiring at least 1 selection.
- Detailed comments textarea with real-time character count and min/max length indicators.
- Optional screenshot/log file upload with client-side file size (<4MB) validation.
- NPS (0-10) score selector.
- Return pure semantic HTML5, modern CSS with CSS custom properties, and vanilla JS.`,
    explanation: 'Combines multiple rich input paradigms (interactive stars, custom checkbox tag pills, drag-and-drop file inspection) with immediate client-side validation.',
    html: `<div class="fc-survey-wrap">
  <div class="fc-survey-card">
    <div class="fc-survey-head">
      <h2>Product Feedback & Quality Audit</h2>
      <p>Help us improve your developer workspace experience.</p>
    </div>

    <form id="surveyForm" novalidate>
      <!-- Star Rating -->
      <div class="survey-group">
        <label class="survey-label">Overall Experience Rating <span class="req">*</span></label>
        <div class="star-rating" id="starContainer" role="radiogroup" aria-label="Rating out of 5">
          <button type="button" class="star-btn" data-val="1" aria-label="1 star">★</button>
          <button type="button" class="star-btn" data-val="2" aria-label="2 stars">★</button>
          <button type="button" class="star-btn" data-val="3" aria-label="3 stars">★</button>
          <button type="button" class="star-btn" data-val="4" aria-label="4 stars">★</button>
          <button type="button" class="star-btn" data-val="5" aria-label="5 stars">★</button>
        </div>
        <input type="hidden" id="ratingValue" name="rating" required>
        <div id="ratingError" class="survey-err"></div>
      </div>

      <!-- Category Pills -->
      <div class="survey-group">
        <label class="survey-label">What areas did you evaluate? (Select at least 1) <span class="req">*</span></label>
        <div class="tag-row" id="tagGroup">
          <label class="tag-pill"><input type="checkbox" name="category" value="performance"><span>⚡ Performance</span></label>
          <label class="tag-pill"><input type="checkbox" name="category" value="developer_api"><span>🛠 Developer API</span></label>
          <label class="tag-pill"><input type="checkbox" name="category" value="documentation"><span>📚 Documentation</span></label>
          <label class="tag-pill"><input type="checkbox" name="category" value="security"><span>🔒 Security & RBAC</span></label>
        </div>
        <div id="categoryError" class="survey-err"></div>
      </div>

      <!-- Feedback Textarea -->
      <div class="survey-group">
        <label for="feedbackText" class="survey-label">Detailed Impressions <span class="req">*</span></label>
        <textarea id="feedbackText" class="survey-textarea" placeholder="Tell us what impressed you or what we could improve (min 20 characters)..." rows="4" maxlength="400"></textarea>
        <div class="char-counter">
          <span id="charCount">0</span> / 400 characters (minimum 20)
        </div>
        <div id="feedbackError" class="survey-err"></div>
      </div>

      <!-- File Attachment -->
      <div class="survey-group">
        <label class="survey-label">Attach Diagnostic Screenshot (Optional, max 4MB)</label>
        <div class="file-dropzone" id="dropzone">
          <span class="drop-icon">📎</span>
          <span id="dropText">Drag & drop or click to upload (PNG, JPG, PDF)</span>
          <input type="file" id="fileInput" accept="image/png, image/jpeg, application/pdf" style="display:none;">
        </div>
        <div id="fileError" class="survey-err"></div>
      </div>

      <button type="submit" id="surveySubmitBtn" class="survey-submit-btn">Submit Feedback</button>
    </form>

    <div id="surveyThanks" class="survey-thanks" style="display:none;">
      <div class="thanks-icon">✨</div>
      <h3>Thank You for Your Feedback!</h3>
      <p>Your diagnostic notes have been shared directly with our engineering team.</p>
      <button type="button" id="surveyResetBtn" class="survey-submit-btn" style="margin-top:1rem; width:auto; padding:0.6rem 1.5rem;">Submit Another Response</button>
    </div>
  </div>
</div>`,
    css: `:root {
  --s-bg: #090c10;
  --s-card: #151b23;
  --s-border: #30363d;
  --s-gold: #f59e0b;
  --s-primary: #38bdf8;
  --s-text: #e6edf3;
  --s-muted: #8b949e;
}

.fc-survey-wrap {
  min-height: 100vh;
  background: var(--s-bg);
  color: var(--s-text);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  font-family: 'DM Sans', system-ui, sans-serif;
}

.fc-survey-card {
  width: 100%;
  max-width: 620px;
  background: var(--s-card);
  border: 1px solid var(--s-border);
  border-radius: 16px;
  padding: 2.25rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}

.fc-survey-head h2 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
}

.fc-survey-head p {
  font-size: 0.9rem;
  color: var(--s-muted);
  margin-top: 0.25rem;
  margin-bottom: 1.5rem;
}

.survey-group {
  margin-bottom: 1.35rem;
}

.survey-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.45rem;
  color: #c9d1d9;
}

.req { color: #f85149; }

.star-rating {
  display: flex;
  gap: 0.5rem;
}

.star-btn {
  background: none;
  border: none;
  font-size: 1.85rem;
  color: #30363d;
  cursor: pointer;
  transition: transform 0.15s ease, color 0.15s ease;
  line-height: 1;
}

.star-btn:hover, .star-btn.active {
  color: var(--s-gold);
  transform: scale(1.15);
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-pill {
  cursor: pointer;
}

.tag-pill input { display: none; }

.tag-pill span {
  display: inline-block;
  padding: 0.45rem 0.85rem;
  background: #0d1117;
  border: 1px solid var(--s-border);
  border-radius: 999px;
  font-size: 0.82rem;
  color: #c9d1d9;
  transition: all 0.2s ease;
}

.tag-pill input:checked + span {
  background: rgba(56, 189, 248, 0.15);
  border-color: var(--s-primary);
  color: var(--s-primary);
  font-weight: 600;
}

.survey-textarea {
  width: 100%;
  background: #0d1117;
  border: 1px solid var(--s-border);
  border-radius: 8px;
  padding: 0.75rem;
  color: #fff;
  font-family: inherit;
  font-size: 0.9rem;
  resize: vertical;
}

.survey-textarea:focus {
  outline: none;
  border-color: var(--s-primary);
}

.char-counter {
  font-size: 0.75rem;
  color: var(--s-muted);
  text-align: right;
  margin-top: 0.25rem;
}

.file-dropzone {
  border: 2px dashed var(--s-border);
  border-radius: 8px;
  padding: 1.25rem;
  text-align: center;
  background: #0d1117;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--s-muted);
  transition: border-color 0.2s;
}

.file-dropzone:hover {
  border-color: var(--s-primary);
}

.drop-icon { font-size: 1.3rem; }

.survey-err {
  font-size: 0.75rem;
  color: #f85149;
  margin-top: 0.3rem;
  min-height: 1.1rem;
}

.survey-submit-btn {
  width: 100%;
  height: 44px;
  background: var(--s-primary);
  color: #090c10;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: opacity 0.2s ease;
}

.survey-submit-btn:hover {
  opacity: 0.9;
}

.survey-thanks {
  text-align: center;
  padding: 2.5rem 1rem;
}

.thanks-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }`,
    js: `// Survey Interactive Validation Engine
(function() {
  const form = document.getElementById('surveyForm');
  if (!form) return;

  const starBtns = document.querySelectorAll('.star-btn');
  const ratingInput = document.getElementById('ratingValue');
  const feedbackText = document.getElementById('feedbackText');
  const charCount = document.getElementById('charCount');
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const dropText = document.getElementById('dropText');
  const surveyThanks = document.getElementById('surveyThanks');
  const surveyResetBtn = document.getElementById('surveyResetBtn');

  // Star Rating Interaction
  starBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = parseInt(btn.dataset.val, 10);
      ratingInput.value = val;
      updateStars(val);
      document.getElementById('ratingError').textContent = '';
    });

    btn.addEventListener('mouseenter', () => {
      const val = parseInt(btn.dataset.val, 10);
      highlightStars(val);
    });
  });

  document.getElementById('starContainer').addEventListener('mouseleave', () => {
    const val = parseInt(ratingInput.value, 10) || 0;
    highlightStars(val);
  });

  function updateStars(val) {
    starBtns.forEach(btn => {
      const bVal = parseInt(btn.dataset.val, 10);
      btn.classList.toggle('active', bVal <= val);
    });
  }

  function highlightStars(val) {
    starBtns.forEach(btn => {
      const bVal = parseInt(btn.dataset.val, 10);
      btn.style.color = bVal <= val ? '#f59e0b' : '#30363d';
    });
  }

  // Character counter
  feedbackText.addEventListener('input', () => {
    const len = feedbackText.value.length;
    charCount.textContent = len;
    if (len >= 20) {
      charCount.style.color = '#38bdf8';
      document.getElementById('feedbackError').textContent = '';
    } else {
      charCount.style.color = '#8b949e';
    }
  });

  // File Upload Handlers
  dropzone.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
      const maxMb = 4;
      if (file.size > maxMb * 1024 * 1024) {
        document.getElementById('fileError').textContent = 'File exceeds maximum 4MB limit.';
        fileInput.value = '';
        dropText.textContent = 'Drag & drop or click to upload';
      } else {
        document.getElementById('fileError').textContent = '';
        dropText.textContent = '✓ ' + file.name + ' (' + (file.size / 1024).toFixed(1) + ' KB)';
      }
    }
  });

  // Submission validation
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    if (!ratingInput.value) {
      document.getElementById('ratingError').textContent = 'Please choose an overall rating.';
      valid = false;
    }

    const checkedTags = document.querySelectorAll('input[name="category"]:checked');
    if (checkedTags.length === 0) {
      document.getElementById('categoryError').textContent = 'Please select at least 1 evaluation area.';
      valid = false;
    } else {
      document.getElementById('categoryError').textContent = '';
    }

    if (feedbackText.value.trim().length < 20) {
      document.getElementById('feedbackError').textContent = 'Please provide at least 20 characters of feedback.';
      valid = false;
    }

    if (!valid) return;

    form.style.display = 'none';
    surveyThanks.style.display = 'block';
  });

  surveyResetBtn.addEventListener('click', () => {
    form.reset();
    form.style.display = 'block';
    surveyThanks.style.display = 'none';
    ratingInput.value = '';
    updateStars(0);
    charCount.textContent = '0';
    dropText.textContent = 'Drag & drop or click to upload (PNG, JPG, PDF)';
  });
})();`,
  },
];
