# RESTAURANT CHEF HAM&HAM — Digital Menu

## Stack
- Vanilla JS SPA (ES6 modules, no framework, no bundler)
- Supabase (tables: `categories`, `menu_items`, `settings`; bucket: `dish-images`)
- CSS custom properties (dark mode only)
- Auth: `admin@fadaerif.com` / `fadaerif2026`
- i18n: `i18next` + `i18next-browser-languagedetector` (loaded from esm.sh CDN). Langues : `fr`, `en`, `es`, `ar` — configurées dans `js/locales/config.js`

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
- `.env` file at root with `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY`, `SUPABASE_SBP`

## Architecture
- `js/main.js` entrypoint: `await i18nReady` → `translatePage()` → `initMenu()` → `initNavigation()` → `initAuth()`
- `js/menu.js` — shared state (`MENU_DATA`, `CATEGORIES`, `CATEGORY_MAP`, `SETTINGS`, `WA_NUMBER`, `cart`), all rendering, WhatsApp. Filters by `category_id` (not text).
- `js/supabase.js` — lazy `getClient()` via `esm.sh/@supabase/supabase-js@2` (no top-level `await`). Exports `supabaseReady` promise.
- `js/admin-dashboard.js` — inline dashboard (no separate page), loaded after login. Forms use language fields dynamically from `LANGUAGES` config. XLSX export/import uses `Nom (FR)`/`Nom (EN)`/`Nom (ES)`/`Nom (AR)` multi-column headers (dynamic from `LANGUAGES`).
- `js/navigation.js` — SPA routing via `[data-page]` delegation
- `js/auth.js` — login/logout/session via `supabaseReady`
- `js/i18n.js` — i18next config, exports `t()`, `localized()`, `i18nReady`, `translatePage()`, `changeLanguage()`. `changeLanguage()` définit `dir="rtl"` sur `<html>` pour l'arabe
- `js/locales/config.js` — `LANGUAGES` array (`['fr','en','es','ar']`), `LANG_LABELS`, `LANG_NAMES`
- `js/locales/{fr,en,es,ar}.js` — translation dictionaries
- Dashboard is NOT a separate page — after login, click gear icon → `showPage('admin')` → `initAdmin()`

## Key conventions
- All UI text must be in French
- IDs: `camelCase`; classes: `kebab-case`; data attributes: `kebab-case`
- Currency: `DH` (no symbol)
- No emoji/icons — only inline SVG
- Palette: `#090909` bg, `#D4AF37` primary (gold), `#F25928` secondary (fire-orange), `#8C6A17` dark gold, `#FFE08A` light gold, glassmorphism with `rgba(255,255,255,0.08)` borders
- i18n: use `t('key')` in JS, `data-i18n="key"` in HTML, `data-i18n-placeholder`/`data-i18n-title`/`data-i18n-alt`/`data-i18n-content` for attributes
- Add new keys to all locale files (`fr.js`, `en.js`, `es.js`, `ar.js`) when adding text
- RTL: `[dir="rtl"]` CSS overrides in `css/rtl.css` for Arabic — flip margins, borders, sidebar, cart, form labels, badges, nav elements
- Polices arabes : `Tajawal` (principale) + `Noto Naskh Arabic` (fallback) chargées via Google Fonts dans `index.html`

## Gotchas
- `supabase-js` is dynamically imported from CDN — **never** add top-level `await` in module scope
- Admin-dashboard uses arrow expression-body template literals (no `{ return ... }`) — avoid leftover `;` or `}` after backtick
- `showPage()` matches desktop nav by `data-page` attribute (not textContent) after i18n migration
- Fallback data in `menu.js` (FALLBACK_MENU, FALLBACK_CATS) renders when Supabase is unreachable
- Settings table is key-value — `getSettings()` returns `{ key: value }` map
- Categories use `icon_svg` column (stores URL or SVG string), but icon UI has been removed — field still exists for DB compat
- Image upload resizes to 800px via Canvas before sending to Supabase Storage
- i18next is dynamically imported from CDN — always `await i18nReady` before calling `translatePage()`
- XLSX export/import headers are fixed in French to preserve compatibility across language switches
- DB text fields (`categories.name`, `menu_items.name`, `menu_items.description`) are JSONB: `{fr: "...", en: "...", es: "...", ar: "..."}` — always use `localized(value)` to display, pass whole object to Supabase when saving
- `menu_items.category_id` references `categories.id` (FK with `ON DELETE RESTRICT`) — all filtering/forms use `category_id`, never text
- Admin forms and XLSX columns are generated dynamically from `LANGUAGES` config (`js/locales/config.js`) — adding a new language requires only adding to the config array and creating a locale file
- XLSX import is backward-compatible: old files with only FR/EN/ES columns still work (missing language columns default to empty)<｜end▁of▁thinking｜>



## Commands
- Run: `npx serve luxora --listen 3000`
- Apply SQL: `POST /v1/projects/{ref}/database/query` with PAT + JSON body `{"query": "..."}`

## Migration v1 (TEXT → JSONB + category_id)
- Migration: `supabase-migration-v1.sql` — migre les colonnes TEXT vers JSONB (conserve les valeurs dans `fr`), remplace `category` (TEXT) par `category_id` (FK), crée une backup automatique dans `_backup_*`
- Rollback: `supabase-rollback-v1.sql` — restaure l'ancien schéma TEXT + `category` à partir des sauvegardes
- **Procédure** : (1) Sauvegarde via dashboard, (2) Exécuter migration dans SQL Editor, (3) Valider les logs, (4) Si erreur → rollback

## Migration v2 (Ajout clé `ar` aux JSONB)
- Migration: `supabase-migration-v2.sql` — ajoute la clé `"ar":""` dans toutes les colonnes JSONB existantes (`categories.name`, `menu_items.name`, `menu_items.description`, `settings.value` pour `restaurant_name` et `restaurant_subtitle`)
- **Non-destructive** : utilise `|| '{"ar":""}'` avec condition `WHERE NOT (name ? 'ar')` — ne modifie pas les clés existantes
- **Procédure** : Exécuter dans SQL Editor ou via Management API (compatible avec données existantes)
- **Validation** : la dernière requête du fichier vérifie que toutes les lignes ont la clé `ar`
