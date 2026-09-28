# LiteFile — Project Journey

A complete log of how litefile.cloud was designed, built, debugged, and prepared for deployment — from blank folder to production-ready.

---

## The Idea

Build a **100% client-side** multi-tool utility website for processing images and PDFs. The core constraint: nothing ever uploaded to a server. Every tool runs in the browser using JavaScript, Canvas API, WebAssembly, and open-source libraries.

**Stack:** Plain HTML + CSS + vanilla JS. No framework, no build step, no bundler. One file per tool.

**Domain:** litefile.cloud

---

## What Was Built

### 10 Tool Pages

| File | Tool | Key Technology |
|------|------|----------------|
| `compress-image.html` | Compress Image | Canvas API, `toBlob()` quality |
| `resize-image.html` | Resize Image | Canvas API, aspect ratio lock |
| `heic-to-jpg.html` | HEIC to JPG | heic2any@0.0.4 (lazy-loaded) |
| `remove-background.html` | Remove Background | ONNX Runtime Web + RMBG-1.4 model |
| `compress-pdf.html` | Compress PDF | pdf-lib@1.17.1 |
| `merge-pdf.html` | Merge PDF | pdf-lib, drag-to-reorder |
| `split-pdf.html` | Split PDF | pdf-lib, JSZip |
| `convert-image.html` | Convert Image Format | Canvas API + heic2any (HEIC support) |
| `qr-code.html` | QR Code Generator | qrcode@1.5.3, canvas + SVG export |
| `video-to-mp3.html` | Video to MP3 | FFmpeg.wasm @0.12.6, `<script type="module">` |

### 6 Supporting Pages

| File | Purpose |
|------|---------|
| `index.html` | Homepage with tool grid, stats strip, Why LiteFile section |
| `about.html` | Hero, how-it-works, 7-tool grid, FAQ (7 questions), JSON-LD schemas |
| `privacy.html` | Full privacy policy, green "short version" highlight box |
| `terms.html` | Full terms of use in plain language |
| `404.html` | Custom 404 with faded gradient "404" text, tool links |
| `design-system.html` | Internal component reference (noindex) |

### Shared Assets

| File | Contents |
|------|----------|
| `assets/style.css` | ~1,100 lines — design tokens, components, dark/light themes |
| `assets/utils.js` | ~565 lines — Theme, Nav, FileDropZone, ProgressBar, Downloader, Toaster, ScrollAnimations, Analytics, AdSlots, SharedHTML (nav + footer) |
| `assets/favicon.svg` | Bold "L" lettermark on indigo `#6366f1` rounded square |
| `assets/og/*.png` | 12 OG images at 1200×630, generated with Puppeteer + system Chrome |

### Deployment Config

| File | Purpose |
|------|---------|
| `vercel.json` | `cleanUrls: true`, security headers, cache strategy |
| `netlify.toml` | `publish = "."`, matching headers |
| `_redirects` | Clean URL rewrites for Netlify + Cloudflare Pages |
| `_headers` | Cloudflare Pages security/cache headers |
| `sitemap.xml` | All 14 URLs with `lastmod`, `changefreq`, `priority` |
| `robots.txt` | Disallows /404, /design-system, /assets/og/og-generate |

---

## Design System

### Theming
- Two themes: **dark** (default) and **light**, toggled via `data-theme` on `<html>`
- Preference persisted in `localStorage` under key `lf-theme`
- System preference detected on first visit via `prefers-color-scheme`

### Design Tokens (CSS variables)
```
--accent: #6366f1  (indigo)
--bg-base / --bg-elevated / --bg-surface
--text-primary / --text-secondary / --text-muted
--glass-border  (subtle border for cards)
--success: #10b981  --error: #ef4444  --warning: #f59e0b
```

### Key Components
- `.glass-card` — frosted glass card with border + subtle background
- `.upload-zone` — drag-and-drop file zone (`.drag-over` state)
- `.hero` / `.hero--tool` — page hero sections
- `.badge` / `.badge--accent` — pill badges
- `.btn` / `.btn-primary` / `.btn-secondary` / `.btn-ghost` — button variants
- `.progress-wrap` / `.progress-fill` — animated progress bars
- `.faq-item` — `<details>` / `<summary>` FAQ accordion
- `.spinner` — CSS loading spinner
- `.toast` — Toaster notification system (success/error/info)
- `.steps` — 3-step how-it-works grid
- `.tool-grid` — responsive tool card grid
- `stagger-children` — CSS animation stagger on child cards

### Typography Scale
```
--text-xs: 0.75rem   --text-sm: 0.875rem  --text-base: 1rem
--text-md: 1.125rem  --text-lg: 1.25rem   --text-xl: 1.5rem
--text-2xl: 2rem
```

---

## Architecture Decisions

### Why no framework/build step?
Fast iteration, zero dependencies to maintain, works offline from a file:// URL, trivially deployable to any static host. The tradeoff: shared utilities go in `utils.js`, shared styles in `style.css` — both loaded on every page.

### Nav + Footer injection
Rather than duplicating HTML across 16 files, `SharedHTML.nav()` and `SharedHTML.footer()` in `utils.js` return HTML strings that are injected into `#nav-slot` and `#footer-slot` placeholders on DOMContentLoaded. Editing the nav means editing one place.

### Lazy-loading CDN libraries
Heavy libraries are only loaded when a user actually triggers a feature:
- `heic2any` — loaded on first HEIC file drop
- `JSZip` — loaded on first ZIP download
- `qrcode` — loaded on first QR render
- ONNX Runtime + RMBG model — loaded when Remove Background is opened
- FFmpeg core/wasm — loaded when first video is dropped

### video-to-mp3.html module pattern
`utils.js` is loaded as a synchronous `<script>` first (making `Toaster`, `Downloader`, `formatBytes`, `Analytics` available as globals), then the tool code runs as `<script type="module">` to use ES module `import` syntax for FFmpeg.wasm.

### FFmpeg.wasm — no COEP/COOP headers needed
Uses `@ffmpeg/core@0.12.6` (non-threaded, no SharedArrayBuffer required), avoiding the need for `Cross-Origin-Embedder-Policy` and `Cross-Origin-Opener-Policy` headers that would break CDN resource loading on most static hosts.

### Analytics (disabled by default)
`Analytics` object in `utils.js` wraps Plausible. `ENABLED: false` by default — flip to `true` after creating a Plausible account and the script auto-injects. Custom events (`Analytics.event(name, props)`) are already placed in every tool's download handler, ready to start tracking on enable.

### Monetization (disabled by default)
`AdSlots` object supports Google AdSense, Carbon Ads, or a Ko-fi link. `ENABLED: false` by default. When enabled, a `.monetize-bar` is injected between the main content and the footer site-wide.

---

## Navigation Structure

```
Image Tools ▾              PDF Tools ▾          More Tools ▾
  Compress Image             Compress PDF          Remove Background
  Resize Image               Merge PDF             QR Code Generator
  HEIC to JPG                Split PDF             Video to MP3
  Convert Format
```

Mobile: same structure as collapsible sections in a fullscreen drawer.

---

## Bugs Fixed During Build

### 1. merge-pdf.html — null-reference crash on drag-drop
**Root cause:** Session 10 changed the inner tool card from `role="main"` to `role="region"` (correct ARIA), but the JS drag-drop handlers still used `document.querySelector('[role="main"]')`, which returned `null` and threw a `TypeError` that broke all drag-drop functionality.

**Fix:** Changed both querySelector calls to `document.querySelector('[aria-label="Merge PDF tool"]')` — specific and immune to future role changes.

### 2. heic-to-jpg, compress-pdf, split-pdf — wrong ARIA role
**Root cause:** Inner tool card divs had `role="main"` — but a page can only have one `main` landmark, and that's the `<main>` element.

**Fix:** Changed all three to `role="region"` with matching `aria-label`.

### 3. privacy.html + terms.html — missing og:image
These pages were created without `og:image` tags, meaning social media shares would have no preview image.

**Fix:** Added `og:image` pointing to `/assets/og/about.png` (shared fallback — appropriate for legal pages).

---

## SEO Implementation

Every tool page has:
- `<title>` with keyword-first pattern: `"Tool Name Free — Qualifier | LiteFile"`
- `<meta name="description">` under 160 characters
- `<link rel="canonical">` with clean URL (no `.html`)
- Full Open Graph block (`og:title`, `og:description`, `og:url`, `og:type`, `og:image`)
- `twitter:card: summary_large_image`
- JSON-LD `FAQPage` schema (4–5 questions per tool page)
- `BreadcrumbList` schema on legal pages
- `WebSite` + `ItemList` schema on homepage

`sitemap.xml` has all 14 public URLs with lastmod, changefreq, and priority. `robots.txt` disallows internal/utility pages.

---

## OG Image Generation

12 OG cards at 1200×630 px, dark background (`#08090d`), indigo accent (`#6366f1`).

Each card has:
- LiteFile logo (SVG "L" lettermark + wordmark)
- Category label (indigo, uppercase)
- Large title (2 lines, 68px)
- Description (24px, slate)
- URL bottom-left, 3 badge pills bottom-right
- Background: radial indigo glow + subtle grid pattern

Generated programmatically with **Puppeteer** (headless Chrome) using the system Chrome install at `/Applications/Google Chrome.app`. Script was `assets/og/generate.mjs`, cleaned up after generation.

---

## Deployment

Ready for: **Vercel**, **Netlify**, **Cloudflare Pages**

### Vercel
- `cleanUrls: true` in `vercel.json` handles all `.html` → clean URL rewrites automatically
- Security headers on all pages, 1-day cache for CSS/JS, 1-year immutable for favicon + OG images

### Netlify / Cloudflare Pages
- `_redirects` handles clean URL rewrites (200 rewrites, 404 fallback)
- `netlify.toml` sets `publish = "."`
- `_headers` sets Cloudflare Pages cache/security headers

### To go live
1. Push the project folder to a Git repository
2. Connect the repo to Vercel / Netlify / Cloudflare Pages
3. Set the custom domain `litefile.cloud`
4. Done — no build command, no environment variables

### To enable analytics (when ready)
1. Create account at plausible.io, add `litefile.cloud`
2. In `assets/utils.js`: set `Analytics.ENABLED = true`

### To enable ads/monetization (when ready)
1. In `assets/utils.js`: set `AdSlots.ENABLED = true`, fill in credentials
2. Set `AdSlots.PROVIDER` to `'adsense'` or `'carbon'`

---

## Project Stats at Completion

| Metric | Count |
|--------|-------|
| HTML files | 16 |
| Tool pages | 10 |
| Lines of CSS | ~1,100 |
| Lines of shared JS | ~565 |
| OG images | 12 |
| Sitemap URLs | 14 |
| Clean URL redirect rules | 14 |
| CDN libraries used | 6 |
| Sessions to build | 13+ |

---

*Built entirely with Claude Code — litefile.cloud*
