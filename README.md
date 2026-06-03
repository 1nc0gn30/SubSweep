<div align="center">

# 🧹 SubSweep

**Sweep away subscription clutter — track every charge, catch every free trial, see your spend in 3D.**

[![Day 2 of #30Days30Apps](https://img.shields.io/badge/30Days30Apps-Day%202-0ea5e9?style=flat-square)](https://subsweep-day2.netlify.app)
[![Live](https://img.shields.io/badge/live-subsweep-day2.netlify.app-22c55e?style=flat-square)](https://subsweep-day2.netlify.app)
[![Stack](https://img.shields.io/badge/React%2019-%2320232a?logo=react&style=flat-square)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-r184-black?logo=three.js&style=flat-square)](https://threejs.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&style=flat-square)](https://vitejs.dev)
[![Netlify](https://img.shields.io/badge/Netlify-deployed-00AD9F?logo=netlify&style=flat-square)](https://netlify.com)
[![No accounts](https://img.shields.io/badge/privacy-100%25%20local-f59e0b?style=flat-square)](#-privacy)

A privacy-first subscription and free-trial tracker with an **interactive 3D solar system**, a **draggable 12-month spending planner**, and a **stacking comparison shelf** — all rendered with WebGL behind the actual UI. No login, no bank connection, no tracking. Data stays in your browser.

</div>

---

## ✨ Features

- 🌌 **Spending solar system** — every subscription is a planet on its own orbit. Bigger cost = larger planet. Click a planet to focus it. Trials glow red and pulse.
- ⏱️ **3D trial countdown clock** — a glowing orbit ring for the nearest expiring trial, with a ticking hand and urgent red pulse.
- 📊 **12-month spending ribbon** — 3D bar chart of your projected yearly spend with a **draggable cyan budget cap**. Months over the cap glow red.
- 🧱 **Stacking comparison shelf** — 3D shelves where each comparison item (☕, 🍕, 🎬) physically stacks up based on your monthly spend.
- 🌠 **Cosmic background** — full-page starfield, nebula blobs, and shooting stars (always-on, behind the content, doesn't block interaction).
- 🧹 **Classic tracker UI** — category filters, animated cards, urgent-trial banners, and the "what else could this buy?" comparison tiles.
- 🔒 **Privacy by default** — everything stored in `localStorage`. Zero network calls after first paint. Falls back to 2D if WebGL is unavailable.
- ♿ **Accessible** — keyboard-navigable modals, `role="dialog"` / `aria-modal`, focus management, reduced-motion friendly camera.

---

## 🛠️ Tech Stack

| Layer        | Tool |
|--------------|------|
| Framework    | [React 19](https://react.dev) + [Vite 8](https://vitejs.dev) |
| Styling      | [Tailwind CSS v4](https://tailwindcss.com) (via `@tailwindcss/vite`) |
| 3D           | [three.js](https://threejs.org) + [`@react-three/fiber`](https://r3f.docs.pmnd.rs) + [`@react-three/drei`](https://drei.docs.pmnd.rs) |
| Persistence  | Browser `localStorage` (key: `subsweep_subs`) |
| Deployment   | [Netlify](https://netlify.com) (static `dist/`) |
| Lint         | [ESLint 10](https://eslint.org) flat config |

---

## 📦 Project Structure

```
src/
├── App.jsx                      # Thin shell — composes components, owns layout
├── main.jsx                     # Vite/React entry
├── index.css                    # Tailwind v4 + dark glass-card theme
├── constants.js                 # CATEGORIES, ICONS, COMPARISONS, DEFAULT_SUBS
├── utils.js                     # monthCost, daysUntil, formatDate, toMonthly
│
├── hooks/
│   ├── useSubscriptions.js      # State + CRUD + localStorage persistence
│   └── useWebGL.js              # WebGL feature detect (via useSyncExternalStore)
│
├── components/                  # 2D UI
│   ├── Modal.jsx
│   ├── AddEditModal.jsx
│   ├── DeleteModal.jsx
│   ├── SubCard.jsx
│   ├── StatCard.jsx
│   ├── CategoryFilter.jsx
│   ├── CategoryBreakdown.jsx
│   ├── ComparisonShelf.jsx
│   ├── UrgentTrialsBanner.jsx
│   └── ThreeLayer.jsx           # Lazy + Suspense + WebGL fallback wrapper
│
└── three/                       # 3D scenes (each code-split into its own chunk)
    ├── CosmicCanvas.jsx         # Starfield + nebula + shooting stars (background)
    ├── SolarSystem.jsx          # Sun + orbit rings + planet per subscription
    ├── TrialClock.jsx           # 3D countdown clock for nearest trial
    ├── SpendingRibbon.jsx       # 12-month bars + draggable budget cap
    └── ComparisonShelf3D.jsx    # Stacking comparison shelves
```

The `three/` folder is fully isolated. Every scene is lazy-loaded and wrapped in `<Suspense>`, so the 2D UI shows up immediately while the WebGL chunks hydrate. If `useWebGL()` reports no WebGL, the 2D fallback (cards + breakdown + comparison tiles) takes over automatically.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js ≥ 20** (the project uses Vite 8 + React 19, which both require modern Node)
- **npm** (or `pnpm` / `yarn` — npm scripts are vanilla)

### Install

```bash
npm install
```

### Develop

```bash
npm run dev          # starts Vite at http://localhost:5173
```

### Lint

```bash
npm run lint
```

### Build

```bash
npm run build        # outputs static site to dist/
npm run preview      # serves the built site locally
```

---

## 🌐 Deployment

This project is pre-configured for **Netlify**:

- `netlify.toml` → builds with `npm run build`, publishes `dist/`, and SPA-redirects everything to `index.html`.
- Security headers are set: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
- SEO: `robots.txt`, `sitemap.xml`, canonical URL, Open Graph + Twitter card metadata all in `public/` and `index.html`.

To deploy: connect the repo in Netlify. No env vars, no functions, no backend.

---

## 🔒 Privacy

SubSweep is **100% local**:

- All subscription data lives in `localStorage` under the key `subsweep_subs`.
- No analytics, no telemetry, no cookies.
- No backend, no API calls at runtime.
- No bank or card connection — you type in costs by hand.
- The only outbound request is the initial page load (HTML, CSS, JS, fonts).

To wipe all data: clear site data in your browser, or run `localStorage.removeItem('subsweep_subs')` in DevTools.

---

## 🎮 Interactions Cheat-Sheet

| Where | What you can do |
|-------|-----------------|
| Hero "Spending Solar System" | Drag to rotate · scroll to zoom · click a planet to focus · click empty space to deselect |
| Trial Countdown | Auto-rotates · drag to inspect · pulses faster the closer the trial |
| 12-Month Planner | Drag the cyan bar up/down to set a budget · months over the cap glow red |
| Comparison Shelf | Watch the stacks grow when you add subscriptions · drag to rotate |
| Subscription cards | Edit / Remove · urgent trials have a red pulsing badge |
| Category pills | Filter the grid and the breakdown chart by category |

---

## 📚 Day 2 of #30Days30Apps

SubSweep is **Day 2** of my [#30Days30Apps](https://subsweep-day2.netlify.app) challenge — one app, every day, for thirty days. Built solo by **Neal Frazier**.

- 🐦 Twitter / X: [@neal_frazier](https://twitter.com/neal_frazier)
- 🌐 Other days: [subsweep-day2.netlify.app](https://subsweep-day2.netlify.app)

---

## 📄 License

This is a personal portfolio project. All rights reserved by Neal Frazier.
