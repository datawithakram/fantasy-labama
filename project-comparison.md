# Project Comparison

## Overview

- **frontend** – A minimal React + TypeScript Vite starter. Contains a small set of pages (Auth, Dashboard, etc.) and a basic UI layout. Powered by React 19, uses Tailwind, Zustand, Supabase, etc. Primarily a front‑end client.

- **backend-engine** – A Node.js Express server that provides a health endpoint and API routes for live fantasy actions (captain change, substitution, transfers). Uses Supabase client, CORS, dotenv. Focused on back‑end logic and data persistence.

- **fpl** – A full‑featured Fantasy Premier League front‑end application. Large component hierarchy, theming via `plos` library, Sentry integration, Redux store, many feature modules (team building, transfers, live updates, stats, etc.). Uses TypeScript, React, Redux, Sentry, and many internal utilities.

## Folder Structure

### `frontend`
```
frontend/
├─ .env
├─ .gitignore
├─ dist/
├─ eslint.config.js
├─ index.html
├─ node_modules/
├─ package-lock.json
├─ package.json
├─ public/
├─ README.md
├─ src/
│  ├─ App.css
│  ├─ App.tsx
│  ├─ assets/
│  ├─ components/
│  │   └─ Layout.tsx
│  ├─ index.css
│  ├─ lib/
│  ├─ main.tsx
│  ├─ pages/
│  │   ├─ Auth.tsx
│  │   ├─ Dashboard.tsx
│  │   ├─ History.tsx
│  │   ├─ Leaderboard.tsx
│  │   ├─ Leagues.tsx
│  │   ├─ MatchCenter.tsx
│  │   ├─ Profile.tsx
│  │   ├─ TeamBuilder.tsx
│  │   ├─ Tournament.tsx
│  │   └─ Transfers.tsx
│  ├─ store/
│  └─ types/
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts
```

### `backend-engine`
```
backend-engine/
├─ .env
├─ index.js
├─ node_modules/
├─ package-lock.json
└─ package.json
```

### `fpl`
```
fpl/
├─ __vite-browser-external/
├─ my-team.html
├─ src/
│  ├─ components/ (≈47 files, many subfolders)
│  │   ├─ App.tsx
│  │   ├─ GameHeader/
│  │   ├─ PlayerSheets/ …
│  │   └─ … (team, status, result, etc.)
│  ├─ contexts/
│  ├─ index.tsx
│  ├─ instrument.ts
│  ├─ serviceWorker.ts
│  └─ utils/ (adobe.ts, chips.ts, events.ts, fixtures.ts, money.ts, …)
└─ (additional configuration files not shown)
```

## Key Differences

| Aspect | frontend | backend-engine | fpl |
|--------|----------|----------------|-----|
| Primary purpose | UI demo / client‑side app | API server for fantasy actions | Complete FPL UI with full feature set |
| Language / Framework | React 19, TypeScript, Vite | Node.js (CommonJS), Express | React 19, TypeScript, Vite/webpack, Redux, Sentry |
| Size (files) | ~30 source files | 2 source files + config | >200 source files, dozens of components |
| Dependencies | react, react‑dom, react‑router‑dom, zustand, supabase, tailwind‑css, etc. | express, cors, dotenv, @supabase/supabase‑js, node‑cron | plos, core‑integration, @sentry/react, redux, react‑router, supabase, many UI libs |
| Theme handling | Tailwind + custom CSS | N/A | Uses `plos/src/styles/theme.css` (darkTheme / lightTheme) with custom overrides (`custom-colors.css`) |
| Data layer | Supabase client directly in UI | Supabase client on the server (auth middleware) | Redux store + core‑integration wrappers around Supabase |
| Build tool | Vite | Node runtime (npm start) | Vite (via scripts in package.json) |
| Testing | None (scripts only) | None | Not shown, but likely tests exist |
| Entry point | `src/main.tsx` | `index.js` | `src/index.tsx` (Sentry init, Redux provider, router) |

## Summary

- **frontend** is a lightweight starter for a React application – it contains only the essential pages and a minimal UI layer.
- **backend‑engine** is a small Express service that implements a health check and a handful of fantasy‑related actions. It does not render any UI.
- **fpl** is a comprehensive front‑end implementation of the Fantasy Premier League product. It has a deep component hierarchy, state management, theming, error handling, and integration with many internal libraries.

These differences explain why `frontend` and `backend-engine` are relatively small scaffolds compared with the extensive `fpl` project, which represents the full application logic and UI for the fantasy game.
