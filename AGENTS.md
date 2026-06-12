# LUXORA — Digital Menu

## Stack
- Vanilla JS SPA (ES6 modules, no framework, no bundler)
- Supabase (tables: `categories`, `menu_items`, `settings`; bucket: `dish-images`)
- CSS custom properties (dark mode only)
- Auth: `admin@luxora.com`

## Dev server (required for ES6 modules)
```bash
npx serve luxora --listen 3000
```
Opening `index.html` via `file://` will not work.

## Supabase
- Schema: `supabase-schema.sql` — run to create tables, RLS policies, seed data
- Anon key in `js/config.js` (public, safe for client)
- Personal access token: `<your-personal-access-token>`
- Project ref: `<your-project-ref>`
- Management API: `POST https://api.supabase.com/v1/projects/{ref}/database/query` with PAT as Bearer token

## Architecture
- `js/main.js` entrypoint: `initMenu()` → `initNavigation()` → `initAuth()`
- `js/menu.js` — shared state (`MENU_DATA`, `CATEGORIES`, `SETTINGS`, `WA_NUMBER`, `cart`), all rendering, WhatsApp
- `js/supabase.js` — lazy `getClient()` via `esm.sh/@supabase/supabase-js@2` (no top-level `await`). Exports `supabaseReady` promise.
- `js/admin-dashboard.js` — inline dashboard (no separate page), loaded after login
- `js/navigation.js` — SPA routing via `[data-page]` delegation
- `js/auth.js` — login/logout/session via `supabaseReady`
- Dashboard is NOT a separate page — after login, click gear icon → `showPage('admin')` → `initAdmin()`

## Key conventions
- All UI text must be in French
- IDs: `camelCase`; classes: `kebab-case`; data attributes: `kebab-case`
- Currency: `DH` (no symbol)
- No emoji/icons — only inline SVG
- Palette: `#0c0a14` bg, `#d4a847` gold, `#141120` card, glassmorphism with `rgba(212,168,71,0.08)` borders

## Gotchas
- `supabase-js` is dynamically imported from CDN — **never** add top-level `await` in module scope
- Admin-dashboard uses arrow expression-body template literals (no `{ return ... }`) — avoid leftover `;` or `}` after backtick
- `showPage()` matches desktop nav by `textContent.includes(labels[name])` — if nav text changes, update `labels` map in `menu.js:159`
- Fallback data in `menu.js` (FALLBACK_MENU, FALLBACK_CATS) renders when Supabase is unreachable
- Settings table is key-value — `getSettings()` returns `{ key: value }` map
- Categories use `icon_svg` column (stores URL or SVG string), but icon UI has been removed — field still exists for DB compat
- Image upload resizes to 800px via Canvas before sending to Supabase Storage

## Commands
- Run: `npx serve luxora --listen 3000`
- Apply SQL: `POST /v1/projects/{ref}/database/query` with PAT + JSON body `{"query": "..."}`
