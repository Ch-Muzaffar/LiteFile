# LiteFile — Complete Deployment Guide
Everything you need to go fully live, step by step.

---

## What you have (already done — nothing to build)

| File / Folder | Purpose |
|---|---|
| `index.html` | Homepage |
| `compress-image.html` | Image compressor tool |
| `resize-image.html` | Image resizer tool |
| `heic-to-jpg.html` | HEIC converter tool |
| `convert-image.html` | Image format converter |
| `remove-background.html` | AI background remover tool |
| `compress-pdf.html` | PDF compressor tool |
| `merge-pdf.html` | PDF merger tool |
| `split-pdf.html` | PDF splitter tool |
| `qr-code.html` | QR code generator |
| `video-to-mp3.html` | Video to MP3 converter |
| `about.html` | About page |
| `terms.html` | Terms of Service |
| `privacy.html` | Privacy Policy |
| `404.html` | Custom 404 page |
| `assets/style.css` | Design system |
| `assets/utils.js` | Shared utilities |
| `assets/favicon.svg` | Site favicon |
| `assets/og/` | OG images for all pages |
| `robots.txt` | Search engine rules |
| `sitemap.xml` | All page URLs for Google |
| `netlify.toml` | Netlify deployment config |
| `vercel.json` | Vercel deployment config |
| `_headers` | Cloudflare Pages headers |
| `_redirects` | Clean URL rewrites |

**LiteFile is 100% static — no server, no database, no build step.**
Every file is plain HTML/CSS/JS. You just upload and it works.

---

## Choose your host (pick one)

| Host | Free tier | Best for |
|---|---|---|
| **Netlify** | Unlimited sites, 100 GB bandwidth/mo | Easiest setup, drag-and-drop |
| **Vercel** | Unlimited sites, 100 GB bandwidth/mo | Best performance globally |
| **Cloudflare Pages** | Unlimited sites, unlimited bandwidth | Best if you use Cloudflare DNS |

All three are correctly pre-configured in the project files. Pick one below.

---

---

# OPTION A — Deploy on Netlify (Easiest)

### Step 1 — Create a Netlify account
1. Go to **https://netlify.com**
2. Click **Sign up** → sign in with GitHub or email

### Step 2 — Deploy by drag and drop
1. Go to **https://app.netlify.com/drop**
2. Open Finder → navigate to Desktop → open the **Muzaffer** folder
3. Select **all files and folders** inside it (Cmd+A)
4. Drag everything into the Netlify drop zone in your browser
5. Wait 20–30 seconds

> **Important:** Drag the contents of Muzaffer/, not the Muzaffer/ folder itself. The `index.html` must be at the root level of what you drop.

### Step 3 — Verify deployment
Netlify gives you a URL like:
```
https://graceful-morse-a3b4c5.netlify.app
```
Open it. You should see the LiteFile homepage. Click a tool — it should load and work. ✅

### Step 4 — (Better) Deploy via GitHub for auto-updates
Every time you change a file, drag-and-drop re-deploys everything manually. To auto-deploy on save:

1. Create a free account at **https://github.com**
2. Create a new repository called `litefile`
3. Upload all your Muzaffer/ files to the repo
4. In Netlify: **Add new site → Import an existing project → GitHub**
5. Select your `litefile` repo
6. Set **Publish directory** to `.` (a single dot — the repo root)
7. Click **Deploy site**

Now every time you push a change to GitHub, Netlify auto-deploys in ~30 seconds.

---

---

# OPTION B — Deploy on Vercel

### Step 1 — Install Vercel CLI
Open Terminal:
```bash
npm install -g vercel
```

### Step 2 — Deploy
```bash
cd /Users/mac/Desktop/Muzaffer
vercel
```

Follow the prompts:
- Set up and deploy? → **Y**
- Which scope? → select your account
- Link to existing project? → **N**
- Project name → `litefile`
- In which directory is your code? → `.` (press Enter)
- Want to override settings? → **N**

### Step 3 — Verify
Vercel gives you a URL like:
```
https://litefile.vercel.app
```
Open it — homepage should load. ✅

### Step 4 — Production deploy
```bash
vercel --prod
```
This promotes to your main production URL.

---

---

# OPTION C — Deploy on Cloudflare Pages

### Step 1 — Create a Cloudflare account
1. Go to **https://cloudflare.com** → sign up free
2. From the dashboard go to **Workers & Pages → Pages**

### Step 2 — Create a new project
1. Click **Create a project → Direct upload**
2. Name your project: `litefile`
3. Click **Create project**

### Step 3 — Upload files
1. Click **Upload assets**
2. Select all files and folders from your Muzaffer/ folder
3. Click **Deploy site**

### Step 4 — Verify
Cloudflare gives you a URL like:
```
https://litefile.pages.dev
```
Open it — homepage should load. ✅

---

---

# STEP — Connect your custom domain (litefile.cloud)

Do this after deploying to any host above.

### On Netlify:
1. Netlify dashboard → your site → **Domain settings → Add custom domain**
2. Enter `litefile.cloud` → click **Verify**
3. Go to your domain registrar (GoDaddy, Namecheap, etc.)
4. Add these DNS records:

| Type | Name | Value |
|---|---|---|
| `A` | `@` | `75.2.60.5` |
| `CNAME` | `www` | `graceful-morse-a3b4c5.netlify.app` |

5. Back in Netlify → **Domain settings → HTTPS → Verify DNS** → **Provision certificate**
6. Wait 5–30 minutes for DNS to propagate. Done. ✅

### On Vercel:
1. Vercel dashboard → your project → **Settings → Domains**
2. Enter `litefile.cloud` → **Add**
3. Vercel shows you the exact DNS records to add
4. Add them at your registrar
5. SSL is automatic. Done. ✅

### On Cloudflare Pages:
1. Cloudflare dashboard → your Pages project → **Custom domains → Set up a custom domain**
2. Enter `litefile.cloud`
3. If your domain is already on Cloudflare DNS (recommended): it auto-configures
4. If not: add the CNAME record Cloudflare shows you at your registrar
5. SSL is automatic. Done. ✅

> **Tip:** If you move your domain's nameservers to Cloudflare (free), you get DNS, SSL, CDN, and DDoS protection all in one place — and custom domain setup becomes two clicks.

---

---

# STEP — Submit to Google Search Console

Do this right after your domain is live so Google starts indexing.

1. Go to **https://search.google.com/search-console**
2. Click **Add property → URL prefix**
3. Enter `https://litefile.cloud`
4. Verify ownership — easiest method: **HTML file** (download the file, upload it to your Muzaffer/ folder, re-deploy)
5. After verified: **Sitemaps → Add a new sitemap**
6. Enter `sitemap.xml` → Submit
7. Google will index your pages within 1–7 days

---

---

# Final Checklist

Go through every item before sharing the link publicly:

- [ ] Site loads at your Netlify/Vercel/Cloudflare URL
- [ ] Homepage shows all tool cards correctly
- [ ] Every tool page opens and works (test at least 3)
- [ ] Remove Background tool loads the AI model (first load downloads ~176 MB — normal)
- [ ] Dark/light mode toggle works
- [ ] Mobile layout looks correct (check on your phone)
- [ ] Custom domain (`litefile.cloud`) resolves and shows HTTPS padlock
- [ ] `https://litefile.cloud/sitemap.xml` is accessible
- [ ] `https://litefile.cloud/robots.txt` is accessible
- [ ] Submitted sitemap to Google Search Console
- [ ] 404 page works — visit `https://litefile.cloud/doesnotexist`
- [ ] All clean URLs work: `/compress-image`, `/merge-pdf`, `/remove-background` (no `.html`)

---

---

# Troubleshooting

### Clean URLs not working (getting 404 on /compress-image)
- **Netlify:** Make sure `netlify.toml` is in the root of what you uploaded. Check **Site settings → Build & deploy → Publish directory** is set to `.`
- **Vercel:** Make sure `vercel.json` is in the root. Run `vercel --prod` again.
- **Cloudflare:** Upload `_redirects` file — Cloudflare Pages uses it for URL rewrites.

### Remove Background tool not loading
- The AI model is 176 MB and downloads on first use. This is expected behaviour.
- It won't work if the browser blocks WASM. Chrome and Firefox work best.
- Safari on iOS has WASM memory limits — the model may fail on older iPhones.

### Site loads but CSS looks broken
- The `assets/` folder must be uploaded alongside `index.html` — not just the HTML files.
- Confirm `assets/style.css` and `assets/utils.js` are accessible at your deployed URL.

### OG images not showing on social media
- Social platforms cache OG data. Use the **Facebook Sharing Debugger** (`developers.facebook.com/tools/debug`) and **Twitter Card Validator** to force a refresh.
- Make sure `assets/og/` folder was uploaded.

### Domain not resolving after adding DNS records
- DNS propagation takes 5 minutes to 48 hours depending on your registrar.
- Use **https://dnschecker.org** to check propagation status globally.
- Make sure you removed any conflicting A or CNAME records that were there before.

### Google not indexing pages
- After submitting the sitemap, wait 3–7 days.
- Use **URL Inspection** in Google Search Console to force-crawl specific pages.
- Make sure `robots.txt` doesn't accidentally block pages.

---

---

# Quick Reference

| Item | Value |
|---|---|
| Domain | `litefile.cloud` |
| Publish directory | `.` (repo root — all files at root level) |
| Build command | None (static site, no build step) |
| Netlify config | `netlify.toml` |
| Vercel config | `vercel.json` |
| Cloudflare config | `_headers` + `_redirects` |
| Sitemap | `https://litefile.cloud/sitemap.xml` |
| robots.txt | `https://litefile.cloud/robots.txt` |
| Analytics config | `assets/utils.js` → set `Analytics.ENABLED = true` and `Analytics.DOMAIN` |
| Ad slots config | `assets/utils.js` → set `AdSlots.ENABLED = true` when ready |

---

*Once all checklist items are ticked, LiteFile is fully live.*
