/* =========================================================
   main.js — Abbey Insurance LLC
   Shared JavaScript for all pages
   ========================================================= */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     1. MOBILE HAMBURGER & NAV
  ───────────────────────────────────────────── */
  const hamburger = document.getElementById('nav-hamburger');
  const mobileNav = document.getElementById('nav-mobile');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      mobileNav.classList.toggle('open', !expanded);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('open');
      }
    });

    // Close on non-dropdown link click inside mobile nav
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('open');
      });
    });
  }

  /* ─────────────────────────────────────────────
     2. DESKTOP DROPDOWN TOGGLE
  ───────────────────────────────────────────── */
  const ddToggles = document.querySelectorAll('.nav-dropdown-toggle');
  ddToggles.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const li = this.closest('li');
      const isOpen = li.classList.contains('dd-open');
      // Close all dropdowns
      document.querySelectorAll('.nav-links li.dd-open').forEach(function (el) {
        el.classList.remove('dd-open');
      });
      if (!isOpen) { li.classList.add('dd-open'); }
    });
  });

  // Mobile dropdown toggle
  const mobileDropdownBtns = document.querySelectorAll('.mobile-dd-toggle');
  mobileDropdownBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = document.getElementById(this.dataset.target);
      if (target) { target.classList.toggle('open'); }
    });
  });

  // Close desktop dropdown on outside click
  document.addEventListener('click', function () {
    document.querySelectorAll('.nav-links li.dd-open').forEach(function (el) {
      el.classList.remove('dd-open');
    });
  });

  /* ─────────────────────────────────────────────
     3. ACTIVE NAV LINK DETECTION
  ───────────────────────────────────────────── */
  (function setActiveNav() {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    const page = path.split('/').pop() || 'index.html';

    const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) { return; }
      const hrefPage = href.split('/').pop();
      if (
        hrefPage === page ||
        (page === '' && (href === '/' || hrefPage === 'index.html')) ||
        (page === 'index.html' && (href === '/' || hrefPage === 'index.html'))
      ) {
        link.classList.add('active');
      }
    });
  })();

  /* ─────────────────────────────────────────────
     4. FAQ ACCORDION (button/div version)
  ───────────────────────────────────────────── */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const item = this.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
      document.querySelectorAll('.faq-q').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        this.setAttribute('aria-expanded', 'true');
        // Analytics hook (placeholder)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'faq_open', { question: this.querySelector('[itemprop="name"]') ? this.querySelector('[itemprop="name"]').textContent : this.textContent.trim() });
        }
      }
    });
  });

  /* ─────────────────────────────────────────────
     5. SMOOTH SCROLL FOR ANCHOR LINKS
  ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─────────────────────────────────────────────
     6. SCROLL FADE-IN OBSERVER
  ───────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll(
      '.cov-card, .review-card, .why-point, .family-agent, .sandy-stat, .card, .process-step, .fade-in'
    ).forEach(function (el) {
      el.classList.add('fade-in');
      observer.observe(el);
    });
  }

  /* ─────────────────────────────────────────────
     7. QUOTE MULTI-STEP FORM (quote.html)
  ───────────────────────────────────────────── */
  (function initQuoteForm() {
    const form = document.getElementById('quote-form');
    if (!form) { return; }

    const TOTAL_STEPS = 5;
    let currentStep = 1;
    const formData = {};

    // ── Progress update
    function updateProgress(step) {
      const pct = ((step - 1) / (TOTAL_STEPS - 1)) * 100;
      const fill = document.getElementById('progress-fill');
      const label = document.getElementById('progress-label');
      const stepNames = ['Coverage Type', 'Personal Info', 'Coverage Details', 'Current Coverage', 'Review & Submit'];
      if (fill)  { fill.style.width = pct + '%'; }
      if (label) { label.textContent = 'Step ' + step + ' of ' + TOTAL_STEPS + ' — ' + stepNames[step - 1]; }

      // Step indicator dots
      for (let i = 1; i <= TOTAL_STEPS; i++) {
        const dot  = document.getElementById('step-dot-' + i);
        const line = document.getElementById('step-line-' + i);
        if (dot) {
          dot.classList.remove('active', 'done');
          if (i < step)  { dot.classList.add('done'); }
          if (i === step){ dot.classList.add('active'); }
        }
        if (line) {
          line.classList.toggle('done', i < step);
        }
      }
    }

    // ── Show step
    function showStep(step) {
      document.querySelectorAll('.quote-step').forEach(function (s) {
        s.classList.remove('active');
      });
      const el = document.getElementById('step-' + step);
      if (el) { el.classList.add('active'); }
      currentStep = step;
      updateProgress(step);
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // ── Coverage type checkboxes → show/hide conditional fields
    function updateCoverageFields() {
      const checkboxes = form.querySelectorAll('.coverage-type-check');
      const selected = [];
      checkboxes.forEach(function (cb) {
        const btn = cb.closest('.type-checkbox-btn');
        if (cb.checked) {
          selected.push(cb.value);
          if (btn) { btn.classList.add('selected'); }
        } else {
          if (btn) { btn.classList.remove('selected'); }
        }
      });
      // Show/hide coverage detail sections
      const sections = { auto: 'auto-fields', home: 'home-fields', business: 'business-fields', renters: 'renters-fields' };
      Object.keys(sections).forEach(function (key) {
        const sec = document.getElementById(sections[key]);
        if (sec) {
          const show = selected.some(function (v) { return v.toLowerCase().indexOf(key) > -1; });
          sec.classList.toggle('show', show);
        }
      });
      return selected;
    }

    // Wire up coverage type checkboxes
    form.querySelectorAll('.coverage-type-check').forEach(function (cb) {
      cb.addEventListener('change', updateCoverageFields);
    });

    // ── Inline validation helpers
    function validateEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
    function validatePhone(v) { return /^[\d\s\-\(\)\+]{7,15}$/.test(v); }

    function markField(field, valid) {
      field.classList.toggle('error', !valid);
      field.classList.toggle('valid', valid);
      let msg = field.parentElement.querySelector('.field-error');
      if (!valid) {
        if (!msg) {
          msg = document.createElement('span');
          msg.className = 'field-error';
          field.parentElement.appendChild(msg);
        }
        msg.textContent = field.dataset.errorMsg || 'This field is required.';
      } else {
        if (msg) { msg.remove(); }
      }
    }

    // Blur validation (mark touched)
    form.querySelectorAll('input[required], select[required], textarea[required]').forEach(function (field) {
      field.addEventListener('blur', function () {
        if (this.type === 'email') { markField(this, validateEmail(this.value)); }
        else if (this.type === 'tel') { markField(this, validatePhone(this.value)); }
        else { markField(this, this.value.trim() !== ''); }
      });
    });

    // ── Validate a step's required fields
    function validateStep(step) {
      if (step === 1) {
        const checked = form.querySelectorAll('.coverage-type-check:checked');
        if (checked.length === 0) {
          alert('Please select at least one coverage type to continue.');
          return false;
        }
        return true;
      }
      const stepEl = document.getElementById('step-' + step);
      if (!stepEl) { return true; }
      let valid = true;
      stepEl.querySelectorAll('input[required], select[required], textarea[required]').forEach(function (field) {
        if (field.type === 'checkbox') {
          if (!field.checked) { valid = false; markField(field, false); }
        } else if (field.type === 'email') {
          const ok = validateEmail(field.value);
          if (!ok) { valid = false; markField(field, false); }
        } else if (field.type === 'tel') {
          const ok = validatePhone(field.value);
          if (!ok) { valid = false; markField(field, false); }
        } else {
          const ok = field.value.trim() !== '';
          if (!ok) { valid = false; markField(field, false); }
        }
      });
      return valid;
    }

    // ── Collect all form values into formData object
    function collectFormData() {
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(function (el) {
        if (!el.name) { return; }
        if (el.type === 'checkbox') {
          if (!formData[el.name]) { formData[el.name] = []; }
          if (el.checked) { formData[el.name].push(el.value); }
        } else if (el.type === 'radio') {
          if (el.checked) { formData[el.name] = el.value; }
        } else {
          formData[el.name] = el.value;
        }
      });
    }

    // ── Populate review summary (step 5)
    function populateReview() {
      collectFormData();
      const container = document.getElementById('review-summary-content');
      if (!container) { return; }

      function row(label, val) {
        if (!val || (Array.isArray(val) && val.length === 0)) { return ''; }
        const display = Array.isArray(val) ? val.join(', ') : val;
        return '<div class="summary-row"><span class="label">' + label + '</span><span class="value">' + display + '</span></div>';
      }

      let html = '';

      // Coverage types
      const types = formData['coverage_types'] || [];
      if (types.length) {
        html += '<div class="summary-section"><h5>Coverage Types</h5>' + row('Selected', types) + '</div>';
      }

      // Personal
      html += '<div class="summary-section"><h5>Personal Information</h5>';
      html += row('Name', (formData['first_name'] || '') + ' ' + (formData['last_name'] || ''));
      html += row('Email', formData['email']);
      html += row('Phone', formData['phone']);
      html += row('Address', (formData['street_address'] || '') + ', ' + (formData['city'] || '') + ', ' + (formData['state'] || '') + ' ' + (formData['zip'] || ''));
      html += row('Marital Status', formData['marital_status']);
      html += row('Best Time to Call', formData['best_time_to_call']);
      html += '</div>';

      // Current coverage
      html += '<div class="summary-section"><h5>Current Coverage</h5>';
      html += row('Currently Insured', formData['currently_insured']);
      html += row('Current Carrier', formData['primary_carrier']);
      html += row('Shopping Reason', formData['shopping_reason']);
      html += row('Desired Start Date', formData['start_date']);
      html += '</div>';

      container.innerHTML = html;
    }

    // ── High-value items conditional show
    const highValueRadios = form.querySelectorAll('input[name="high_value_items"]');
    const highValueDesc = document.getElementById('high-value-description-group');
    highValueRadios.forEach(function (radio) {
      radio.addEventListener('change', function () {
        if (highValueDesc) {
          highValueDesc.classList.toggle('hidden', this.value !== 'Yes');
        }
      });
    });

    // ── Currently insured conditional
    const insuredRadios = form.querySelectorAll('input[name="currently_insured"]');
    const carrierGroup = document.getElementById('primary-carrier-group');
    insuredRadios.forEach(function (radio) {
      radio.addEventListener('change', function () {
        if (carrierGroup) {
          carrierGroup.classList.toggle('hidden', this.value !== 'Yes');
        }
      });
    });

    // ── NEXT / BACK buttons (wired via data-attributes)
    document.querySelectorAll('[data-next-step]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const next = parseInt(this.dataset.nextStep, 10);
        if (!validateStep(currentStep)) { return; }
        if (next === 5) { populateReview(); }
        showStep(next);
      });
    });
    document.querySelectorAll('[data-prev-step]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        showStep(parseInt(this.dataset.prevStep, 10));
      });
    });

    // Initialize
    showStep(1);
  })();

  /* ─────────────────────────────────────────────
     8. CONTACT FORM (contact.html)
  ───────────────────────────────────────────── */
  (function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) { return; }
    // Netlify handles submission — just add client-side validation
    form.addEventListener('submit', function (e) {
      let valid = true;
      form.querySelectorAll('input[required], select[required], textarea[required]').forEach(function (field) {
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });
      if (!valid) {
        e.preventDefault();
        form.querySelector('.error').focus();
      }
    });
  })();

})();
