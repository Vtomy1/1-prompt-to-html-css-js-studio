export interface A11yIssue {
  id: string;
  ruleId: string;
  title: string;
  description: string;
  wcagCriterion: string;
  severity: 'critical' | 'serious' | 'moderate' | 'info';
  elementSnippet: string;
  recommendation: string;
  autoFixType?: 'add-alt' | 'add-btn-label' | 'add-aria-live' | 'add-input-describedby' | 'add-novalidate';
}

export interface PassedCheck {
  ruleId: string;
  title: string;
  description: string;
  wcagCriterion: string;
}

export interface A11yAuditResult {
  totalIssues: number;
  criticalCount: number;
  seriousCount: number;
  moderateCount: number;
  infoCount: number;
  passedCount: number;
  score: number; // 0 - 100
  issues: A11yIssue[];
  passedChecks: PassedCheck[];
}

export function runAccessibilityAudit(htmlString: string): A11yAuditResult {
  const issues: A11yIssue[] = [];
  const passedChecks: PassedCheck[] = [];

  if (!htmlString || !htmlString.trim()) {
    return {
      totalIssues: 0,
      criticalCount: 0,
      seriousCount: 0,
      moderateCount: 0,
      infoCount: 0,
      passedCount: 0,
      score: 100,
      issues: [],
      passedChecks: [],
    };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<!DOCTYPE html><html><body>${htmlString}</body></html>`, 'text/html');

  // Rule 1: Form Inputs have Accessible Labels (WCAG 1.3.1, 4.1.2)
  const formControls = doc.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), select, textarea');
  let missingLabelFound = false;

  formControls.forEach((el, idx) => {
    const id = el.getAttribute('id');
    const ariaLabel = el.getAttribute('aria-label');
    const ariaLabelledby = el.getAttribute('aria-labelledby');
    const title = el.getAttribute('title');
    const placeholder = el.getAttribute('placeholder');

    let hasLabel = false;
    if (ariaLabel && ariaLabel.trim()) hasLabel = true;
    if (ariaLabelledby && doc.getElementById(ariaLabelledby)) hasLabel = true;
    if (title && title.trim()) hasLabel = true;

    if (id) {
      const explicitLabel = doc.querySelector(`label[for="${id}"]`);
      if (explicitLabel && explicitLabel.textContent?.trim()) hasLabel = true;
    }

    // Check parent label
    if (el.closest('label')) hasLabel = true;

    if (!hasLabel) {
      missingLabelFound = true;
      const tag = el.tagName.toLowerCase();
      const type = el.getAttribute('type') || 'text';
      issues.push({
        id: `label-missing-${idx}`,
        ruleId: 'form-control-has-label',
        title: `Form control <${tag}> is missing an accessible label`,
        description: `Screen readers cannot identify what this ${type} input is for because it lacks an associated <label for="...">, aria-label, or aria-labelledby. ${placeholder ? 'Note: placeholder text does not replace a label.' : ''}`,
        wcagCriterion: 'WCAG 1.3.1 & 4.1.2 (Level A)',
        severity: 'critical',
        elementSnippet: el.outerHTML.slice(0, 140),
        recommendation: id
          ? `Add <label for="${id}">Label text</label> or add aria-label="Descriptive name".`
          : `Add an id attribute and a matching <label for="...">, or add aria-label="Descriptive name".`,
      });
    }
  });

  if (!missingLabelFound && formControls.length > 0) {
    passedChecks.push({
      ruleId: 'form-control-has-label',
      title: 'All form controls have accessible labels',
      description: 'Every interactive form field has a matching label or accessible name.',
      wcagCriterion: 'WCAG 1.3.1 & 4.1.2 (Level A)',
    });
  }

  // Rule 2: Images have alt attributes (WCAG 1.1.1)
  const images = doc.querySelectorAll('img');
  let missingAltFound = false;
  let genericAltFound = false;

  images.forEach((img, idx) => {
    if (!img.hasAttribute('alt')) {
      missingAltFound = true;
      issues.push({
        id: `img-missing-alt-${idx}`,
        ruleId: 'image-alt-missing',
        title: 'Image is missing an alt attribute',
        description: 'Every <img> tag must provide an alt attribute so screen reader users understand its context. Use alt="" if decorative.',
        wcagCriterion: 'WCAG 1.1.1 Non-text Content (Level A)',
        severity: 'critical',
        elementSnippet: img.outerHTML.slice(0, 140),
        recommendation: 'Add alt="Descriptive text" or alt="" if the image is purely decorative.',
        autoFixType: 'add-alt',
      });
    } else {
      const altVal = (img.getAttribute('alt') || '').trim().toLowerCase();
      const suspiciousWords = ['image', 'photo', 'picture', 'icon', 'graphic'];
      if (suspiciousWords.includes(altVal)) {
        genericAltFound = true;
        issues.push({
          id: `img-generic-alt-${idx}`,
          ruleId: 'image-alt-generic',
          title: `Image has generic alt="${altVal}"`,
          description: `Avoid using generic placeholder words like "${altVal}" in alt text. Describe the subject matter or leave empty (alt="") if decorative.`,
          wcagCriterion: 'WCAG 1.1.1 Non-text Content (Level A)',
          severity: 'moderate',
          elementSnippet: img.outerHTML.slice(0, 140),
          recommendation: 'Provide meaningful descriptive text or set alt="" if the image is decorative.',
        });
      }
    }
  });

  if (!missingAltFound && !genericAltFound && images.length > 0) {
    passedChecks.push({
      ruleId: 'image-alt-present',
      title: 'Images provide descriptive alt text',
      description: 'All <img> elements contain valid non-generic alt attributes.',
      wcagCriterion: 'WCAG 1.1.1 Non-text Content (Level A)',
    });
  }

  // Rule 3: Interactive Buttons have Accessible Names (WCAG 4.1.2)
  const buttons = doc.querySelectorAll('button');
  let emptyButtonFound = false;

  buttons.forEach((btn, idx) => {
    const text = (btn.textContent || '').trim();
    const ariaLabel = btn.getAttribute('aria-label');
    const ariaLabelledby = btn.getAttribute('aria-labelledby');
    const title = btn.getAttribute('title');

    // Check if button only contains emoji or symbols without aria-label
    const isOnlySymbol = /^[\s\p{Emoji}\u2000-\u3300\uD800-\uDFFF\u25A0-\u25FF\u2700-\u27BF!@#$%^&*()_+=\-[\]{};:'",.<>/?\\|`~★☆✓✗✕👁🔒🔍]+$/u.test(text);

    if (!ariaLabel && !ariaLabelledby && !title && (!text || isOnlySymbol)) {
      emptyButtonFound = true;
      issues.push({
        id: `btn-no-label-${idx}`,
        ruleId: 'button-accessible-name',
        title: `Button has no discernible accessible name for screen readers`,
        description: `This button ${text ? `only contains symbol/icon "${text}"` : 'has empty text'} without an aria-label or accessible text. Screen readers announce this as "button, unlabelled".`,
        wcagCriterion: 'WCAG 4.1.2 Name, Role, Value (Level A)',
        severity: 'serious',
        elementSnippet: btn.outerHTML.slice(0, 140),
        recommendation: `Add aria-label="Action description" (e.g. aria-label="Toggle password visibility").`,
        autoFixType: 'add-btn-label',
      });
    }
  });

  if (!emptyButtonFound && buttons.length > 0) {
    passedChecks.push({
      ruleId: 'button-accessible-name',
      title: 'Buttons have clear accessible names',
      description: 'All buttons provide readable text or explicit aria-label descriptions.',
      wcagCriterion: 'WCAG 4.1.2 (Level A)',
    });
  }

  // Rule 4: Dynamic Error Containers have ARIA Live or Alert Role (WCAG 4.1.3, 3.3.1)
  const errorContainers = doc.querySelectorAll('[id*="error"], [id*="Error"], [class*="error"], [class*="Error"], [class*="err"], [role="alert"]');
  let missingLiveFound = false;

  errorContainers.forEach((errEl, idx) => {
    // Exclude input fields themselves that may have error classes
    if (['input', 'select', 'textarea'].includes(errEl.tagName.toLowerCase())) return;

    const role = errEl.getAttribute('role');
    const ariaLive = errEl.getAttribute('aria-live');

    if (!role && !ariaLive) {
      missingLiveFound = true;
      issues.push({
        id: `error-live-missing-${idx}`,
        ruleId: 'error-aria-live',
        title: 'Error message container missing aria-live or role="alert"',
        description: `Dynamic validation error messages inserted into <${errEl.tagName.toLowerCase()} id="${errEl.getAttribute('id') || ''}"> will not be automatically announced to screen reader users when validation fails.`,
        wcagCriterion: 'WCAG 4.1.3 Status Messages (Level AA)',
        severity: 'serious',
        elementSnippet: errEl.outerHTML.slice(0, 140),
        recommendation: 'Add role="alert" and aria-live="polite" to the error container.',
        autoFixType: 'add-aria-live',
      });
    }
  });

  if (!missingLiveFound && errorContainers.length > 0) {
    passedChecks.push({
      ruleId: 'error-aria-live',
      title: 'Error containers support live assistive announcements',
      description: 'Validation error containers feature role="alert" or aria-live="polite".',
      wcagCriterion: 'WCAG 4.1.3 Status Messages (Level AA)',
    });
  }

  // Rule 5: Inputs with validation link to errors via aria-describedby and aria-invalid (WCAG 3.3.1)
  formControls.forEach((input, idx) => {
    const id = input.getAttribute('id');
    if (!id) return;

    const potentialError = doc.getElementById(`${id}Error`) || doc.getElementById(`${id}-error`);
    if (potentialError) {
      const describedby = input.getAttribute('aria-describedby');
      const errId = potentialError.getAttribute('id');

      if (!describedby || !describedby.includes(errId || '')) {
        issues.push({
          id: `input-aria-desc-${idx}`,
          ruleId: 'input-aria-describedby',
          title: `Input #${id} is not linked to its error container #${errId}`,
          description: `When validation fails, screen readers will not read the error explanation unless linked via aria-describedby="${errId}".`,
          wcagCriterion: 'WCAG 3.3.1 Error Identification (Level A)',
          severity: 'moderate',
          elementSnippet: input.outerHTML.slice(0, 140),
          recommendation: `Add aria-describedby="${errId}" and aria-invalid="false" to the input.`,
          autoFixType: 'add-input-describedby',
        });
      }
    }
  });

  // Rule 6: Interactive elements inside aria-hidden="true" (WCAG 4.1.2)
  const ariaHiddenContainers = doc.querySelectorAll('[aria-hidden="true"]');
  ariaHiddenContainers.forEach((hiddenEl, idx) => {
    const interactiveChildren = hiddenEl.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (interactiveChildren.length > 0) {
      issues.push({
        id: `hidden-interactive-${idx}`,
        ruleId: 'aria-hidden-interactive-child',
        title: 'Focusable element placed inside aria-hidden="true"',
        description: `Elements with aria-hidden="true" contain focusable controls (${interactiveChildren[0].tagName.toLowerCase()}). Keyboard users can focus these, but screen reader users will hear nothing.`,
        wcagCriterion: 'WCAG 4.1.2 Name, Role, Value (Level A)',
        severity: 'critical',
        elementSnippet: hiddenEl.outerHTML.slice(0, 140),
        recommendation: 'Remove aria-hidden="true" from the parent or add tabindex="-1" to non-interactive elements.',
      });
    }
  });

  // Rule 7: Heading structure hierarchy (WCAG 1.3.1)
  const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  let prevLevel = 0;
  let headingSkipFound = false;

  headings.forEach((h, idx) => {
    const currentLevel = parseInt(h.tagName.substring(1), 10);
    if (prevLevel > 0 && currentLevel > prevLevel + 1) {
      headingSkipFound = true;
      issues.push({
        id: `heading-skip-${idx}`,
        ruleId: 'heading-order-skipped',
        title: `Heading level skipped: <${h.tagName.toLowerCase()}> follows <h${prevLevel}>`,
        description: `Heading levels should not be skipped (e.g. going directly from <h${prevLevel}> to <${h.tagName.toLowerCase()}>). Screen reader users rely on consistent heading hierarchy to navigate sections.`,
        wcagCriterion: 'WCAG 1.3.1 Info and Relationships (Level A)',
        severity: 'moderate',
        elementSnippet: h.outerHTML.slice(0, 140),
        recommendation: `Change <${h.tagName.toLowerCase()}> to <h${prevLevel + 1}> or adjust previous headings to maintain level hierarchy.`,
      });
    }
    prevLevel = currentLevel;
  });

  if (!headingSkipFound && headings.length > 0) {
    passedChecks.push({
      ruleId: 'heading-order-valid',
      title: 'Heading hierarchy is orderly and sequential',
      description: 'Headings do not skip levels, ensuring predictable document navigation.',
      wcagCriterion: 'WCAG 1.3.1 (Level A)',
    });
  }

  // Rule 8: Links have accessible text and href (WCAG 2.4.4)
  const links = doc.querySelectorAll('a');
  let badLinkFound = false;

  links.forEach((link, idx) => {
    const text = (link.textContent || '').trim();
    const href = link.getAttribute('href');
    const ariaLabel = link.getAttribute('aria-label');

    if (!href || href === '#' || href === 'javascript:void(0)') {
      badLinkFound = true;
      issues.push({
        id: `link-href-invalid-${idx}`,
        ruleId: 'link-valid-href',
        title: 'Link <a> lacks a valid destination href',
        description: 'Links with href="#" or missing href should be <button> elements if they trigger client-side actions.',
        wcagCriterion: 'WCAG 2.4.4 Link Purpose (Level A)',
        severity: 'moderate',
        elementSnippet: link.outerHTML.slice(0, 140),
        recommendation: 'Use a <button type="button"> for script-driven actions, or provide a valid anchor URL.',
      });
    }

    if (!text && !ariaLabel && !link.querySelector('img[alt], svg[aria-label]')) {
      issues.push({
        id: `link-no-text-${idx}`,
        ruleId: 'link-accessible-name',
        title: 'Link <a> is empty with no accessible text',
        description: 'Screen reader users cannot determine the target of an empty link.',
        wcagCriterion: 'WCAG 2.4.4 Link Purpose (Level A)',
        severity: 'critical',
        elementSnippet: link.outerHTML.slice(0, 140),
        recommendation: 'Provide link text or add aria-label="Target description".',
      });
    }
  });

  if (!badLinkFound && links.length > 0) {
    passedChecks.push({
      ruleId: 'link-valid-href',
      title: 'Links have valid destinations and text',
      description: 'Anchor links provide meaningful targets and readable text content.',
      wcagCriterion: 'WCAG 2.4.4 (Level A)',
    });
  }

  // Rule 9: Positive Tabindex Check (WCAG 2.4.3)
  const positiveTabIndex = doc.querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])');
  positiveTabIndex.forEach((el, idx) => {
    const val = parseInt(el.getAttribute('tabindex') || '0', 10);
    if (val > 0) {
      issues.push({
        id: `tabindex-positive-${idx}`,
        ruleId: 'avoid-positive-tabindex',
        title: `Element uses positive tabindex="${val}"`,
        description: 'Positive tabindex disrupts natural reading order and confuses keyboard navigation.',
        wcagCriterion: 'WCAG 2.4.3 Focus Order (Level A)',
        severity: 'serious',
        elementSnippet: el.outerHTML.slice(0, 140),
        recommendation: 'Use tabindex="0" to insert into normal tab flow, or rely on native DOM order.',
      });
    }
  });

  // Rule 10: Duplicate ID Check (WCAG 4.1.1)
  const allWithId = doc.querySelectorAll('[id]');
  const seenIds = new Set<string>();
  const duplicateIds = new Set<string>();

  allWithId.forEach((el) => {
    const id = el.getAttribute('id');
    if (!id) return;
    if (seenIds.has(id)) {
      duplicateIds.add(id);
    } else {
      seenIds.add(id);
    }
  });

  if (duplicateIds.size > 0) {
    duplicateIds.forEach((dupId) => {
      issues.push({
        id: `duplicate-id-${dupId}`,
        ruleId: 'duplicate-element-id',
        title: `Duplicate id="${dupId}" detected in markup`,
        description: `Multiple elements share the id "${dupId}". This breaks <label for="${dupId}"> associations, aria-describedby, and getElementById calls.`,
        wcagCriterion: 'WCAG 4.1.1 Parsing & 1.3.1 (Level A)',
        severity: 'serious',
        elementSnippet: `id="${dupId}" (shared by multiple elements)`,
        recommendation: `Ensure every id attribute is completely unique within the document.`,
      });
    });
  } else if (allWithId.length > 0) {
    passedChecks.push({
      ruleId: 'unique-ids',
      title: 'All element IDs are unique in the document',
      description: 'Zero duplicate IDs found; label and ARIA bindings will resolve accurately.',
      wcagCriterion: 'WCAG 4.1.1 (Level A)',
    });
  }

  // Rule 11: Form novalidate for Custom Validation Engine
  const forms = doc.querySelectorAll('form');
  forms.forEach((form, idx) => {
    if (!form.hasAttribute('novalidate')) {
      issues.push({
        id: `form-novalidate-${idx}`,
        ruleId: 'form-novalidate-missing',
        title: '<form> element is missing novalidate attribute',
        description: 'When building custom interactive form validation, missing novalidate causes default browser bubble popups to clash with your custom ARIA live alerts.',
        wcagCriterion: 'WCAG 3.3.1 Error Identification (Level A Best Practice)',
        severity: 'moderate',
        elementSnippet: form.outerHTML.slice(0, 120),
        recommendation: 'Add novalidate to <form> to let custom JavaScript error messages take precedence.',
        autoFixType: 'add-novalidate',
      });
    } else {
      passedChecks.push({
        ruleId: 'form-novalidate-present',
        title: 'Form specifies novalidate for custom validation control',
        description: 'Browser native popups are disabled in favor of accessible ARIA live feedback.',
        wcagCriterion: 'WCAG 3.3.1 (Best Practice)',
      });
    }
  });

  // Calculate overall compliance score
  const criticalCount = issues.filter((i) => i.severity === 'critical').length;
  const seriousCount = issues.filter((i) => i.severity === 'serious').length;
  const moderateCount = issues.filter((i) => i.severity === 'moderate').length;
  const infoCount = issues.filter((i) => i.severity === 'info').length;

  const penalty = criticalCount * 25 + seriousCount * 15 + moderateCount * 8 + infoCount * 3;
  const score = Math.max(0, Math.min(100, 100 - penalty));

  return {
    totalIssues: issues.length,
    criticalCount,
    seriousCount,
    moderateCount,
    infoCount,
    passedCount: passedChecks.length,
    score,
    issues,
    passedChecks,
  };
}

/**
 * Automatically applies non-destructive A11y fixes to HTML string
 */
export function applyA11yAutoFix(htmlString: string, issue: A11yIssue): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<!DOCTYPE html><html><body>${htmlString}</body></html>`, 'text/html');

  if (issue.autoFixType === 'add-alt') {
    const images = doc.querySelectorAll('img:not([alt])');
    images.forEach((img) => img.setAttribute('alt', ''));
  } else if (issue.autoFixType === 'add-btn-label') {
    const buttons = doc.querySelectorAll('button');
    buttons.forEach((btn) => {
      const text = (btn.textContent || '').trim();
      if (!btn.getAttribute('aria-label') && (!text || text === '👁' || text === '🔒' || text === '×')) {
        const inferred = text === '👁' ? 'Toggle password visibility' : text === '🔒' ? 'Password locked' : text === '×' ? 'Close dialog' : 'Perform action';
        btn.setAttribute('aria-label', inferred);
      }
    });
  } else if (issue.autoFixType === 'add-aria-live') {
    const errorContainers = doc.querySelectorAll('[id*="error"], [id*="Error"], [class*="error"], [class*="Error"]');
    errorContainers.forEach((errEl) => {
      if (!['input', 'select', 'textarea'].includes(errEl.tagName.toLowerCase())) {
        errEl.setAttribute('role', 'alert');
        errEl.setAttribute('aria-live', 'polite');
      }
    });
  } else if (issue.autoFixType === 'add-input-describedby') {
    const inputs = doc.querySelectorAll('input[id], select[id], textarea[id]');
    inputs.forEach((inp) => {
      const id = inp.getAttribute('id');
      const errorEl = doc.getElementById(`${id}Error`) || doc.getElementById(`${id}-error`);
      if (errorEl) {
        inp.setAttribute('aria-describedby', errorEl.id);
        if (!inp.hasAttribute('aria-invalid')) {
          inp.setAttribute('aria-invalid', 'false');
        }
      }
    });
  } else if (issue.autoFixType === 'add-novalidate') {
    const forms = doc.querySelectorAll('form');
    forms.forEach((f) => f.setAttribute('novalidate', ''));
  }

  return doc.body.innerHTML;
}
