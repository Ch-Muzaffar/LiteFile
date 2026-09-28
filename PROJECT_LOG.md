# LiteFile — Project Log
**Domain:** litefile.cloud
**Folder:** ~/Desktop/Muzaffer
**Date started:** 2026-09-27
**Log updated:** 2026-09-27

---

## Project Overview

Building a free, ad-free, 100% client-side multi-tool utility website targeting narrow SEO keywords.
No backend. No uploads. Each tool = one self-contained HTML file.
Deployed on Vercel/Netlify/Cloudflare Pages (zero cost).

**Differentiators vs Smallpdf/iLoveIMG:**
- Genuinely fast
- Clean, distinctive design (NOT generic/AI-looking)
- 100% client-side — files never leave the browser
- Free forever, no sign-up

---

## Tech Stack

- HTML + inline CSS/JS (single-file per tool)
- Shared: `assets/style.css` (design tokens + components), `assets/nav.js` (navigation)
- Libraries (lazy-loaded per tool):
  - Canvas API — image compress/resize
  - heic2any / libheif-js — HEIC to JPG
  - pdf-lib — PDF compress/merge/split
  - pdf.js — PDF rendering
  - onnxruntime-web + RMBG model — background removal
- Font: Inter (Google Fonts)

---

## Design System

**Color palette (dark mode default):**
- `--bg-base: #08090d`
- `--bg-surface: #0f1117`
- `--bg-elevated: #161b27`
- `--accent: #6366f1` (indigo)
- `--accent-hover: #818cf8`
- `--text-primary: #f1f5f9`
- `--text-secondary: #94a3b8`
- `--success: #10b981`
- `--error: #ef4444`

**Light mode:** full token override via `[data-theme="light"]`

**Typography:** Inter — sizes from `--text-xs (11px)` to `--text-3xl (48px)`

**Spacing:** `--s1 (4px)` through `--s9 (96px)`

**Radius:** `--r-sm (8px)`, `--r-md (14px)`, `--r-lg (20px)`, `--r-full`

**Rules:**
- No purple gradients
- No default rounded-everything
- No emoji icons
- Fully responsive
- Dark mode support
- Keyboard nav + ARIA + contrast accessibility

---

## Sessions Summary

### Session 1 — Design System
**Output:** `design-system.html`, `assets/style.css`, `assets/nav.js`

- Defined all CSS custom properties (tokens)
- Built reusable component library: buttons, cards, badges, inputs, dropzones, progress bars, toasts
- Built shared navigation component (logo + tool links + dark/light toggle)
- Reference page `design-system.html` (not deployed — `noindex`)

---

### Session 2 — Homepage
**Output:** `index.html`

- Hero section with tagline + CTA
- Tool grid (6 cards: compress image, HEIC→JPG, resize image, compress PDF, merge PDF, remove background)
- Features section ("Why LiteFile")
- Internal links to all tool pages
- Full SEO meta tags targeting "free online file tools"

---

### Session 3 — Image Tools
**Output:** `compress-image.html`, `resize-image.html`, `heic-to-jpg.html`

**compress-image.html**
- Drag-and-drop + file picker (JPG/PNG/WebP)
- Canvas API compression with quality slider
- Side-by-side before/after preview
- Batch support
- Download compressed file
- SEO: "compress image online free"

**resize-image.html**
- Resize by pixels or percentage
- Maintain aspect ratio toggle
- Output format selector (JPG/PNG/WebP)
- Canvas API rendering
- SEO: "resize image online free"

**heic-to-jpg.html**
- heic2any library (lazy-loaded)
- Batch HEIC → JPG conversion
- Quality control slider
- Download as ZIP for multiple files
- SEO: "HEIC to JPG converter free"

---

### Session 4 — PDF Tools
**Output:** `compress-pdf.html`, `merge-pdf.html`, `split-pdf.html`

**compress-pdf.html**
- pdf-lib for re-encoding
- Compression level selector (low/medium/high)
- File size before/after display
- SEO: "compress PDF online free"

**merge-pdf.html**
- Drag-and-drop multiple PDFs
- Reorder pages before merge
- pdf-lib merge output
- SEO: "merge PDF files free"

**split-pdf.html**
- pdf.js for preview
- Select page range or extract individual pages
- Download as separate PDFs or ZIP
- SEO: "split PDF online free"

---

### Session 5 — Background Remover
**Output:** `remove-background.html`

- onnxruntime-web + RMBG-1.4 model (lazy-loaded from CDN)
- 100% client-side inference — no server upload
- Drag-and-drop image input
- Side-by-side original vs transparent output
- Download as PNG with transparency
- Progress indicator during model load + inference
- SEO: "remove background from image free"

---

### Session 6 — SEO Pages
**Output:** `sitemap.xml`, `robots.txt`

**sitemap.xml** — All tool pages listed for search engine indexing
**robots.txt** — Allow all crawlers, sitemap reference, block design-system.html

---

### Session 7 — Image Resizer
**Output:** `resize-image.html`

- Two-column layout: 272px settings panel + flex preview panel
- Aspect ratio lock button with SVG padlock icon
- Presets update both dimensions AND aspectRatio variable
- Quality slider hidden for PNG output
- Preview canvas capped at 560px; separate temp canvas for size estimate
- Download: `canvas.toBlob()` at full resolution, filename `base-WxH.ext`

---

### Session 8 — PDF Splitter
**Output:** `split-pdf.html`

- States: upload → loading → configure → processing → result → error
- Mode selector: ALL pages, page range, custom ranges
- `parseRanges(input, max)` returns `[{from, to}]` or null on error
- Zero-padded page filenames
- pdf-lib lazy-loaded; JSZip lazy-loaded only when multiple output files
- Warning banner for totalPages > 30 in ALL mode

---

### Session 9 — Image Compressor
**Output:** `compress-image.html`

- Batch processing: `items[]` array with status per file
- `resolveFormat()` handles "same as original" logic
- White background fill before drawImage for JPEG output
- `renderItem()` updates DOM per file without full re-render
- Download All staggers 150ms apart
- Auto-compress fires 400ms after last file added (debounced)

---

### Session 10 — Accessibility & Consistency Pass
**Files changed:** `assets/style.css`, `assets/utils.js`, `remove-background.html`, `resize-image.html`, `compress-image.html`, `merge-pdf.html`, `split-pdf.html`

- `style.css`: added global `.section-label` and `.skip-link` classes
- `utils.js`: skip link injected into nav HTML; auto-assigns `id="main-content"` to `<main>`
- All tool pages: `role="main"` → `role="region"` on inner glass-card divs
- All tool pages: inline section label styles → `.section-label` class

---

### Session 11 — Legal, Trust & About Pages
**Output:** `about.html`, `privacy.html`, `terms.html`, `404.html`

**about.html**
- Hero with 4 trust badges (No uploads / No account / No tracking / Free forever)
- "Why we built LiteFile" prose section (max-width: 800px)
- How it works — 3 steps (glass-card stepped layout)
- Trust features — 4-up grid with inline SVG icons (no server upload / no account / no tracking / free forever)
- All tools — link grid to all 7 tools
- FAQ — 6 questions with JSON-LD FAQPage schema
- Organization JSON-LD schema + BreadcrumbList
- SEO: "about LiteFile", "free browser-based tools"

**privacy.html** and **terms.html**
- Shared `.prose` layout: max-width 720px, `h2` with border-bottom, `ul li` with em-dash bullets
- privacy.html: green highlight box for "short version", sections covering files/personal info/cookies/analytics/CDN libraries/hosting/children/rights/changes/contact
- terms.html: sections covering permitted use/your files/no warranties/limitation of liability/third-party libraries/IP/changes/governing law/contact
- Both: BreadcrumbList JSON-LD, canonical URLs, OG meta

**404.html**
- `noindex` meta
- Large faded "404" number (CSS gradient text, 140px)
- Two CTAs: "Go to homepage" (btn-primary) + "About LiteFile" (btn-secondary)
- 2-column grid of 6 popular tool links
- No footer scroll — centered full-viewport layout

---

## File Map

```
Muzaffer/
├── index.html              # Homepage
├── compress-image.html     # Tool
├── heic-to-jpg.html        # Tool
├── resize-image.html       # Tool
├── compress-pdf.html       # Tool
├── merge-pdf.html          # Tool
├── split-pdf.html          # Tool
├── remove-background.html  # Tool
├── about.html              # Trust
├── privacy.html            # Legal
├── terms.html              # Legal
├── 404.html                # Error
├── sitemap.xml             # SEO
├── robots.txt              # SEO
├── vercel.json             # Vercel deployment config
├── netlify.toml            # Netlify deployment config
├── _redirects              # Clean URLs (Netlify + Cloudflare Pages)
├── _headers                # Security + cache headers (Cloudflare Pages)
├── design-system.html      # Reference (noindex)
├── PROJECT_LOG.md          # This file
└── assets/
    ├── style.css           # Shared design tokens + components
    ├── utils.js            # Shared utilities (nav, footer, theme, etc.)
    ├── favicon.svg         # Site favicon (injected by utils.js)
    └── og/
        ├── og-generate.html  # OG image generator (noindex, local use only)
        └── *.png             # Generated OG images (create via og-generate.html)
```

---

## Build Stages Status

| Stage | Description | Status |
|-------|-------------|--------|
| 1 | Design system | Done |
| 2 | Homepage | Done |
| 3 | Each tool | Done (6/6) |
| 4 | Site-wide nav/performance/accessibility | Pending |
| 5 | Legal/trust pages | Done (Session 11) |
| 6 | Monetization setup | Pending |
| 7 | Final QA and deployment | Pending (deployment config done) |

---

### Session 12 — Favicon, OG Images, Deployment Config
**Output:** `assets/favicon.svg`, `vercel.json`, `netlify.toml`, `_redirects`, `_headers`, `assets/og/og-generate.html`
**Updated:** `assets/utils.js`, `sitemap.xml`, `robots.txt`

**Favicon**
- `assets/favicon.svg` — bold "L" lettermark on indigo `#6366f1` rounded square, 32×32
- Injected dynamically via `utils.js` DOMContentLoaded (avoids editing all HTML files)
- Uses `<link rel="icon" type="image/svg+xml">` — supported by all modern browsers

**OG images**
- `assets/og/og-generate.html` — opens in browser, renders all 9 OG cards (1200×630) scaled at 50%, uses html2canvas to download each as a PNG
- Cards designed with site's dark background, radial glow, Inter font, indigo accents
- 9 variants: home, compress-image, resize-image, heic-to-jpg, remove-background, compress-pdf, merge-pdf, split-pdf, about
- **Action needed:** open `assets/og/og-generate.html` locally and click "Download All PNGs", then move PNGs to `assets/og/`

**Deployment configs (deploy on any one platform)**
- `vercel.json` — `cleanUrls: true`, `trailingSlash: false`, security + cache headers
- `netlify.toml` — build publish dir, security + cache headers (works with `_redirects`)
- `_redirects` — clean URL rewrites for Netlify + Cloudflare Pages, 404 fallback
- `_headers` — security + cache headers for Cloudflare Pages

**Cache strategy:**
- HTML pages: `max-age=0, must-revalidate` (always fresh after deploy)
- `style.css`, `utils.js`: 1 day (`max-age=86400`)
- `favicon.svg`, `assets/og/*`: 1 year immutable (`max-age=31536000, immutable`)

**Security headers on all pages:** `X-Content-Type-Options`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`

**Sitemap:** Added `<lastmod>`, `<changefreq>` to all URLs

**robots.txt:** Added `Disallow: /design-system` and `Disallow: /assets/og/og-generate`

---

### Session 13 — Analytics + Monetization Scaffolding
**Updated:** `assets/utils.js`, `assets/style.css`

**Analytics — Plausible**
- `Analytics` object added to utils.js
- Single flag: `Analytics.ENABLED = false` → change to `true` to activate
- Script injected dynamically into `<head>` — no HTML file edits needed
- `Analytics.event(name, props)` helper for custom events (documented with recommended events per tool)
- Plausible is cookieless, GDPR-compliant, does not share data with advertisers

**Monetization — Support bar + Ad scaffolding**
- `AdSlots` object added to utils.js with provider selection (`'adsense'` | `'carbon'`)
- Injected automatically between `<main>` and `<footer>` on every page (no HTML edits needed)
- When `ENABLED = false` (now): shows a subtle support bar — "LiteFile is free — Share on Twitter · Buy a coffee"
- When `ENABLED = true`: shows a responsive AdSense/Carbon Ads unit in the same slot
- `KOFI_URL` config: set to your Ko-fi URL to show a "Buy a coffee" link in the support bar
- CSS added to style.css: `.monetize-bar`, `.support-inner`, `.support-text`, `.support-links`, `.support-sep`, `.ad-inner`

**Activation checklist (when traffic exists):**
1. Plausible: create account → add domain → set `Analytics.ENABLED = true`
2. AdSense: apply at adsense.google.com → wait for approval → fill `ADSENSE_CLIENT` + `ADSENSE_SLOT` → set `AdSlots.ENABLED = true`
3. Carbon Ads (alternative, higher CPM for dev audience): apply at carbonads.net → set `CARBON_SERVE` → set `AdSlots.PROVIDER = 'carbon'` → `ENABLED = true`
4. Ko-fi: create page → set `KOFI_URL = 'https://ko-fi.com/yourname'`

**Custom event tracking** — add to each tool page's download handler (documented in Analytics.event() JSDoc):
```javascript
Analytics.event('Compress Image', { format: 'jpeg', files: 3 });
Analytics.event('Split PDF',      { mode: 'range' });
// etc.
```

---

## Pending — Final Steps

- [x] Site-wide navigation (Sessions 7–10)
- [x] Accessibility pass (Session 10)
- [x] Legal/trust pages (Session 11)
- [x] Favicon + deployment config (Session 12)
- [x] Analytics + monetization scaffolding (Session 13)
- [ ] **Generate OG PNGs** — open `assets/og/og-generate.html` locally, click "Download All PNGs", move PNGs to `assets/og/`
- [ ] **Add Analytics events to tool pages** — call `Analytics.event(...)` in each download handler
- [ ] **Set Ko-fi URL** — `AdSlots.KOFI_URL = 'https://ko-fi.com/yourname'` in utils.js
- [ ] Final QA — test all 7 tools end-to-end in Chrome + Firefox + Safari
- [ ] Deploy to Vercel / Netlify / Cloudflare Pages
  - Push to GitHub → connect repo in hosting dashboard
  - Set custom domain `litefile.cloud`
- [ ] Submit sitemap to Google Search Console
- [ ] When traffic reaches ~50/day: apply to Google AdSense
- [ ] When traffic is tech-focused: apply to Carbon Ads (higher CPM)

---

## Key Decisions Made

1. **Single HTML files** — no build step, zero-dependency deployment, easy hosting
2. **Dark mode default** — matches power-user audience, distinctive look
3. **Indigo accent (#6366f1)** — professional, not purple-gradient-cliché
4. **Inter font** — clean, modern, system-adjacent
5. **No mock/placeholder tool** — every page has working functionality
6. **Client-side only** — privacy differentiator + zero infrastructure cost
7. **One focused session per feature** — avoids scope creep, keeps code clean
