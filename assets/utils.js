/* ============================================================
   LiteFile — Shared Utilities
   utils.js | litefile.cloud
   ============================================================ */

'use strict';

/* ── formatBytes ── */
function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/* ── Theme ── */
const Theme = {
  init() {
    const saved = localStorage.getItem('lf-theme');
    const system = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    this.apply(saved || system);
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('lf-theme', theme);
    this._updateButtons();
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.apply(current === 'light' ? 'dark' : 'light');
  },

  _updateButtons() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.innerHTML = isDark ? Icons.sun() : Icons.moon();
    });
  }
};

/* ── Nav ── */
const Nav = {
  init() {
    const toggle = document.querySelector('.nav-mobile-toggle');
    const menu   = document.querySelector('.nav-mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Mark active page link
    const path = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
    document.querySelectorAll('[data-nav-link]').forEach(link => {
      const href = link.getAttribute('href').replace(/\.html$/, '').replace(/\/$/, '') || '/';
      if (href === path) link.classList.add('active');
    });
  }
};

/* ── FileDropZone ── */
class FileDropZone {
  /**
   * @param {string|Element} element  - selector or DOM element
   * @param {Object} options
   * @param {string[]} [options.accept]    - MIME types, e.g. ['image/jpeg']
   * @param {number}   [options.maxSize]   - max bytes
   * @param {boolean}  [options.multiple]  - allow multiple files
   * @param {Function} [options.onFile]    - called with each valid File
   * @param {Function} [options.onError]   - called with error message string
   */
  constructor(element, options = {}) {
    this.el       = typeof element === 'string' ? document.querySelector(element) : element;
    this.accept   = options.accept   || null;
    this.maxSize  = options.maxSize  || null;
    this.multiple = options.multiple || false;
    this.onFile   = options.onFile   || (() => {});
    this.onError  = options.onError  || (msg => Toaster.error(msg));
    if (this.el) this._bind();
  }

  _bind() {
    const input = this.el.querySelector('input[type="file"]');
    if (input) {
      if (this.accept)   input.setAttribute('accept', this.accept.join(','));
      if (this.multiple) input.setAttribute('multiple', '');
      input.addEventListener('change', e => {
        this._handleFiles(e.target.files);
        e.target.value = ''; // reset so same file can be re-selected
      });
    }

    this.el.addEventListener('dragover',  e => { e.preventDefault(); this.el.classList.add('drag-over'); });
    this.el.addEventListener('dragleave', e => { if (!this.el.contains(e.relatedTarget)) this.el.classList.remove('drag-over'); });
    this.el.addEventListener('drop', e => {
      e.preventDefault();
      this.el.classList.remove('drag-over');
      this._handleFiles(e.dataTransfer.files);
    });
  }

  _handleFiles(fileList) {
    const files = Array.from(fileList);
    for (const file of files) {
      if (this.accept && !this.accept.includes(file.type)) {
        const ext = this.accept.map(t => t.split('/')[1].toUpperCase()).join(', ');
        this.onError(`"${file.name}" is not supported. Please use ${ext}.`);
        continue;
      }
      if (this.maxSize && file.size > this.maxSize) {
        this.onError(`"${file.name}" is ${formatBytes(file.size)} — max allowed is ${formatBytes(this.maxSize)}.`);
        continue;
      }
      this.onFile(file);
    }
  }
}

/* ── ProgressBar ── */
class ProgressBar {
  /**
   * @param {string|Element} element - selector or the .progress-wrap element
   */
  constructor(element) {
    this.wrap  = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.wrap) return;
    this.fill  = this.wrap.querySelector('.progress-fill');
    this.label = this.wrap.querySelector('.progress-label-text');
    this.pct   = this.wrap.querySelector('.progress-pct');
  }

  show() { this.wrap.hidden = false; }
  hide() { this.wrap.hidden = true;  }

  start(text = 'Processing…') {
    this.show();
    if (this.fill)  { this.fill.style.width = '2%'; this.fill.className = 'progress-fill processing'; }
    if (this.label) this.label.textContent = text;
    if (this.pct)   this.pct.textContent = '';
  }

  set(percent, text) {
    const p = Math.min(100, Math.max(0, percent));
    if (this.fill)  { this.fill.style.width = p + '%'; this.fill.className = 'progress-fill' + (p < 100 ? ' processing' : ''); }
    if (this.label && text) this.label.textContent = text;
    if (this.pct)   this.pct.textContent = Math.round(p) + '%';
  }

  complete(text = 'Done') {
    if (this.fill)  { this.fill.style.width = '100%'; this.fill.className = 'progress-fill done'; }
    if (this.label) this.label.textContent = text;
    if (this.pct)   this.pct.textContent = '100%';
  }

  error(text = 'Failed') {
    if (this.fill)  this.fill.className = 'progress-fill error';
    if (this.label) this.label.textContent = text;
    if (this.pct)   this.pct.textContent = '';
  }

  reset() {
    if (this.fill)  { this.fill.style.width = '0%'; this.fill.className = 'progress-fill'; }
    if (this.label) this.label.textContent = '';
    if (this.pct)   this.pct.textContent = '';
    this.hide();
  }
}

/* ── Downloader ── */
const Downloader = {
  /** Download a Blob as a file */
  download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href = url; a.download = filename; a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  },

  /** Download a data URL (e.g. canvas.toDataURL()) as a file */
  downloadDataURL(dataURL, filename) {
    const a = document.createElement('a');
    a.href = dataURL; a.download = filename; a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },

  /** Generate a download filename based on original name + new extension */
  rename(original, newExt) {
    const base = original.replace(/\.[^.]+$/, '');
    return `${base}.${newExt}`;
  },

  /** Prefix output filename with "litefile-" */
  prefix(original) {
    return original.startsWith('litefile-') ? original : `litefile-${original}`;
  }
};

/* ── Toaster ── */
const Toaster = {
  _container: null,

  _getContainer() {
    if (!this._container) {
      this._container = document.createElement('div');
      this._container.className = 'toast-container';
      this._container.setAttribute('aria-live', 'polite');
      this._container.setAttribute('aria-atomic', 'false');
      document.body.appendChild(this._container);
    }
    return this._container;
  },

  _show(message, type, duration) {
    const container = this._getContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    container.appendChild(toast);

    const dismiss = () => {
      if (!toast.isConnected) return;
      toast.classList.add('dismissing');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
    };

    const timer = setTimeout(dismiss, duration);
    toast.addEventListener('click', () => { clearTimeout(timer); dismiss(); });
  },

  success(msg, duration = 4000) { this._show(msg, 'success', duration); },
  error(msg,   duration = 6000) { this._show(msg, 'error',   duration); },
  info(msg,    duration = 4000) { this._show(msg, 'info',    duration); }
};

/* ── Scroll animations ── */
const ScrollAnimations = {
  init() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  }
};

/* ── Analytics (Plausible) ── */
const Analytics = {
  // ── Activation ──────────────────────────────────────────────────────────
  // 1. Create a free account at https://plausible.io
  // 2. Add "litefile.cloud" as a site
  // 3. Change ENABLED to true — that's it
  ENABLED: false,
  DOMAIN:  'litefile.cloud',
  // ────────────────────────────────────────────────────────────────────────

  init() {
    if (!this.ENABLED) return;
    const s = document.createElement('script');
    s.defer = true;
    s.dataset.domain = this.DOMAIN;
    s.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(s);
  },

  /**
   * Track a custom event. Call this inside tool pages on key actions.
   * @param {string} name    - event name shown in the Plausible dashboard
   * @param {Object} [props] - optional properties (must be pre-registered in Plausible)
   *
   * Recommended events to add in each tool page's download/complete handler:
   *   Analytics.event('Compress Image',     { format: 'jpeg', files: 3 });
   *   Analytics.event('Resize Image',       { format: 'webp' });
   *   Analytics.event('HEIC Convert',       { files: 5 });
   *   Analytics.event('Remove Background');
   *   Analytics.event('Compress PDF');
   *   Analytics.event('Merge PDF',          { files: 3 });
   *   Analytics.event('Split PDF',          { mode: 'range' });
   */
  event(name, props) {
    if (!this.ENABLED || typeof window.plausible !== 'function') return;
    window.plausible(name, props ? { props } : undefined);
  }
};

/* ── Ad Slots ── */
const AdSlots = {
  // ── Activation ──────────────────────────────────────────────────────────
  // Option A — Google AdSense (apply at adsense.google.com, needs ~50+ daily visitors):
  //   1. Get approved, then replace ADSENSE_CLIENT and ADSENSE_SLOT
  //   2. Set PROVIDER: 'adsense' and ENABLED: true
  //
  // Option B — Carbon Ads (better CPM for dev/tech audiences):
  //   1. Apply at https://www.carbonads.net
  //   2. Set PROVIDER: 'carbon' and CARBON_SERVE to your serve code
  //   3. Set ENABLED: true
  //
  // Ko-fi support link (alternative to ads — works at any traffic level):
  //   Set KOFI_URL to your Ko-fi page URL to show a "Buy a coffee" link
  ENABLED:      false,
  PROVIDER:     'adsense',                  // 'adsense' | 'carbon'
  ADSENSE_CLIENT: 'ca-pub-XXXXXXXXXXXXXXXXX',
  ADSENSE_SLOT:   'XXXXXXXXXX',
  CARBON_SERVE: 'XXXXXXXX',                 // serve code from carbonads.net
  KOFI_URL:     '',                         // e.g. 'https://ko-fi.com/litefile'
  // ────────────────────────────────────────────────────────────────────────

  init() {
    if (!this.ENABLED) return;
    if (this.PROVIDER === 'adsense') {
      const s = document.createElement('script');
      s.async = true;
      s.crossOrigin = 'anonymous';
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.ADSENSE_CLIENT}`;
      document.head.appendChild(s);
    } else if (this.PROVIDER === 'carbon') {
      const s = document.createElement('script');
      s.async = true;
      s.id = '_carbonads_js';
      s.src = `//cdn.carbonads.com/carbon.js?serve=${this.CARBON_SERVE}&placement=litefilecloud`;
      document.head.appendChild(s);
    }
  },

  /** HTML for the bar between main content and footer. */
  barHTML() {
    if (!this.ENABLED) {
      const kofi = this.KOFI_URL
        ? `<span class="support-sep" aria-hidden="true">·</span><a href="${this.KOFI_URL}" class="support-link" target="_blank" rel="noopener noreferrer">Buy a coffee</a>`
        : '';
      const tweetURL = encodeURIComponent('https://litefile.cloud');
      const tweetText = encodeURIComponent('Free browser-based file tools — no uploads, no sign-up, no ads.');
      return `
      <div class="support-inner">
        <p class="support-text">LiteFile is free — no ads, no sign-up.</p>
        <div class="support-links">
          <a href="https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetURL}"
             class="support-link" target="_blank" rel="noopener noreferrer">Share on Twitter</a>
          ${kofi}
        </div>
      </div>`;
    }
    if (this.PROVIDER === 'adsense') {
      return `
      <div class="ad-inner">
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="${this.ADSENSE_CLIENT}"
             data-ad-slot="${this.ADSENSE_SLOT}"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>`;
    }
    // Carbon Ads: the injected script auto-renders into #carbonads
    return `<div id="carbonads" class="ad-inner"></div>`;
  }
};

/* ── Icons (inline SVG strings) ── */
const Icons = {
  sun: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  moon: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  upload: () => `<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
  download: () => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  warning: () => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex-shrink:0;margin-top:1px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  check: () => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`
};

/* ── Shared nav/footer HTML ── */
const SharedHTML = {
  nav() {
    return `
<a href="#main-content" class="skip-link">Skip to main content</a>
<nav class="nav" role="navigation" aria-label="Main navigation">
  <div class="nav-inner">
    <a href="/" class="nav-logo">Lite<span>File</span></a>
    <div class="nav-links" role="menubar">
      <div class="nav-dropdown" role="none">
        <button class="nav-dropdown-trigger" aria-haspopup="true" aria-expanded="false">Image Tools</button>
        <div class="nav-dropdown-menu" role="menu">
          <a href="/compress-image"  data-nav-link role="menuitem">Compress Image</a>
          <a href="/resize-image"    data-nav-link role="menuitem">Resize Image</a>
          <a href="/heic-to-jpg"     data-nav-link role="menuitem">HEIC to JPG</a>
          <a href="/convert-image"   data-nav-link role="menuitem">Convert Format</a>
        </div>
      </div>
      <div class="nav-dropdown" role="none">
        <button class="nav-dropdown-trigger" aria-haspopup="true" aria-expanded="false">PDF Tools</button>
        <div class="nav-dropdown-menu" role="menu">
          <a href="/compress-pdf" data-nav-link role="menuitem">Compress PDF</a>
          <a href="/merge-pdf"    data-nav-link role="menuitem">Merge PDF</a>
          <a href="/split-pdf"    data-nav-link role="menuitem">Split PDF</a>
        </div>
      </div>
      <div class="nav-dropdown" role="none">
        <button class="nav-dropdown-trigger" aria-haspopup="true" aria-expanded="false">More Tools</button>
        <div class="nav-dropdown-menu" role="menu">
          <a href="/remove-background" data-nav-link role="menuitem">Remove Background</a>
          <a href="/qr-code"           data-nav-link role="menuitem">QR Code Generator</a>
          <a href="/video-to-mp3"      data-nav-link role="menuitem">Video to MP3</a>
        </div>
      </div>
    </div>
    <div class="nav-actions">
      <button class="theme-toggle" aria-label="Toggle theme"></button>
      <button class="nav-mobile-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
  <div class="nav-mobile-menu" id="mobile-menu" role="dialog" aria-label="Navigation menu">
    <div class="nav-mobile-section">
      <div class="nav-mobile-section-title">Image Tools</div>
      <a href="/compress-image">Compress Image</a>
      <a href="/resize-image">Resize Image</a>
      <a href="/heic-to-jpg">HEIC to JPG</a>
      <a href="/convert-image">Convert Format</a>
    </div>
    <div class="nav-mobile-section">
      <div class="nav-mobile-section-title">PDF Tools</div>
      <a href="/compress-pdf">Compress PDF</a>
      <a href="/merge-pdf">Merge PDF</a>
      <a href="/split-pdf">Split PDF</a>
    </div>
    <div class="nav-mobile-section">
      <div class="nav-mobile-section-title">More Tools</div>
      <a href="/remove-background">Remove Background</a>
      <a href="/qr-code">QR Code Generator</a>
      <a href="/video-to-mp3">Video to MP3</a>
    </div>
    <div class="nav-mobile-section">
      <div class="nav-mobile-section-title">Company</div>
      <a href="/about">About</a>
      <a href="/privacy">Privacy</a>
      <a href="/terms">Terms</a>
    </div>
  </div>
</nav>`;
  },

  footer() {
    return `
<footer class="footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <a href="/" class="footer-logo">Lite<span>File</span></a>
      <p class="footer-tagline">Free browser-based tools for images and PDFs. Your files never leave your device.</p>
    </div>
    <div class="footer-links">
      <div class="footer-col">
        <h4>Image Tools</h4>
        <a href="/compress-image">Compress Image</a>
        <a href="/resize-image">Resize Image</a>
        <a href="/heic-to-jpg">HEIC to JPG</a>
        <a href="/convert-image">Convert Format</a>
        <a href="/remove-background">Remove Background</a>
      </div>
      <div class="footer-col">
        <h4>PDF Tools</h4>
        <a href="/compress-pdf">Compress PDF</a>
        <a href="/merge-pdf">Merge PDF</a>
        <a href="/split-pdf">Split PDF</a>
      </div>
      <div class="footer-col">
        <h4>More Tools</h4>
        <a href="/qr-code">QR Code Generator</a>
        <a href="/video-to-mp3">Video to MP3</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="/about">About</a>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© ${new Date().getFullYear()} LiteFile — All tools run entirely in your browser. Nothing is ever uploaded.</p>
    <p><a href="/about" style="color:var(--text-muted);transition:color var(--t) var(--ease);" onmouseover="this.style.color='var(--text-secondary)'" onmouseout="this.style.color='var(--text-muted)'">litefile.cloud</a></p>
  </div>
</footer>`;
  }
};

/* ── Auto-render shared nav + footer if placeholders exist ── */
document.addEventListener('DOMContentLoaded', () => {
  // Render nav placeholder
  const navSlot = document.getElementById('nav-slot');
  if (navSlot) navSlot.outerHTML = SharedHTML.nav();

  // Render footer placeholder
  const footerSlot = document.getElementById('footer-slot');
  if (footerSlot) footerSlot.outerHTML = SharedHTML.footer();

  // Init everything
  Theme.init();
  Nav.init();
  ScrollAnimations.init();

  // Ensure main landmark has an ID for the skip link
  const mainEl = document.querySelector('main');
  if (mainEl && !mainEl.id) mainEl.id = 'main-content';

  // Wire theme toggles
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => Theme.toggle());
  });

  // Inject favicon (SVG) if not already in <head>
  if (!document.querySelector('link[rel="icon"]')) {
    const link = document.createElement('link');
    link.rel  = 'icon';
    link.type = 'image/svg+xml';
    link.href = '/assets/favicon.svg';
    document.head.appendChild(link);
  }

  // Analytics
  Analytics.init();

  // Monetization bar — inject between main content and footer
  AdSlots.init();
  const footerEl = document.querySelector('footer.footer');
  if (footerEl) {
    const bar = document.createElement('div');
    bar.className = AdSlots.ENABLED ? 'monetize-bar ads-enabled' : 'monetize-bar';
    bar.innerHTML = AdSlots.barHTML();
    footerEl.parentNode.insertBefore(bar, footerEl);
    // AdSense: trigger ad fill after <ins> is in the DOM
    if (AdSlots.ENABLED && AdSlots.PROVIDER === 'adsense') {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    }
  }
});
