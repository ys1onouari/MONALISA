# DESIGN SYSTEM — MONALISA

## 1. Palette de couleurs

Source : `css/variables.css`

### Palette principale (Brand)

| Variable | Valeur | Rôle |
|---|---|---|---|
| `--primary` | `#A86A2A` | Brun caramel — boutons, accents, toggles on, scrollbar, sélection |
| `--primary-dark` | `#5B3718` | Brun foncé — fond du bouton add-cart, badge unavailable, état inactif |
| `--primary-light` | `#8B6035` | Variante claire du brun (réservée) |
| `--secondary` | `#D4A64A` | Doré principal — texte actif, bordures hover, accent nav, section-eyebrow |
| `--secondary-light` | `#E6C55A` | Gold clair — complément du doré (réservé) |
| `--accent` | `#B8842F` | Doré foncé — prix, hero-eyebrow, cart-total-amount |
| `--accent-dim` | `rgba(184,132,47,0.12)` | Accent à faible opacité — fonds subtils |

### Arrière-plans (Backgrounds)

| Variable | Valeur | Rôle |
|---|---|---|
| `--bg` | `#111111` | Noir principal — fond principal de la page & dashboard admin |
| `--bg2` | `#1E1208` | Fond secondaire — inputs, sidebar admin, scrollbar track |
| `--bg3` | `#2A1A0E` | Fond tertiaire — image placeholder, upload label, toggle off |
| `--card` | `rgba(255,255,255,0.04)` | Fond des cartes (dish, catégorie, contact, panier) |
| `--card-hover` | `rgba(255,255,255,0.07)` | Fond des cartes au survol |
| `--glass` | `rgba(17,17,17,0.72)` | Fond vitré — top-nav, bottom-nav, cart-sidebar, toast |
| `--glass-border` | `rgba(212,166,74,0.12)` | Bordure des éléments vitrés (gold tinté) |

### Texte

| Variable | Valeur | Rôle |
|---|---|---|
| `--text` | `#F8F6F0` | Blanc texte — texte principal, titres, noms de plats, body |
| `--text2` | `#EEDDB8` | Beige crème — texte secondaire, labels, infos |
| `--text3` | `#A89070` | Texte tertiaire — nav items inactifs, placeholder, descriptions |

### Statut

| Variable | Valeur | Rôle |
|---|---|---|
| `--success` | `#3A9D5E` | Vert — badge-dot.on, succès |
| `--danger` | `#D78873` | Saumon — badge-dot.off, erreur auth, bouton logout, cart-remove hover |
| `--warning` | `#D4A64A` | Doré — avertissements |

### Bordures

| Variable | Valeur | Rôle |
|---|---|---|
| `--border` | `rgba(212,166,74,0.08)` | Bordure fine générique |
| `--border-strong` | `rgba(212,166,74,0.14)` | Bordure prononcée |

### Ombres (Shadows)

| Variable | Valeur | Rôle |
|---|---|---|
| `--shadow-sm` | `0 4px 16px rgba(0,0,0,0.25)` | Petite ombre — hover wa-btn |
| `--shadow-md` | `0 8px 32px rgba(0,0,0,0.40)` | Ombre moyenne — boutons, toast |
| `--shadow-lg` | `0 16px 48px rgba(0,0,0,0.50)` | Grande ombre — dish-card hover |
| `--shadow-red` | `0 0 40px rgba(168,106,42,0.18)` | Lueur brune (alias `--shadow-glow`) |
| `--shadow-gold` | `0 0 40px rgba(212,166,74,0.15)` | Lueur dorée — hover boutons |

### Dégradés (Gradients)

| Variable | Valeur | Rôle |
|---|---|---|
| `--gradient-primary` | `135deg, #111111 → #A86A2A → #D4A64A` | Boutons principaux (btn-primary, wa-btn, cart-checkout, auth-btn) |
| `--gradient-accent` | `135deg, #D4A64A → #E6C55A → #F0D88A` | Réservé (accent décoratif) |
| `--gradient-dark` | `180deg, #111111 → #1E1208` | Fond de section sombre |

### Espacement (Spacing)

| Variable | Valeur |
|---|---|
| `--space-xs` | `4px` |
| `--space-sm` | `8px` |
| `--space-md` | `16px` |
| `--space-lg` | `24px` |
| `--space-xl` | `32px` |
| `--space-2xl` | `48px` |
| `--space-3xl` | `64px` |

### Rayons (Border Radius)

| Variable | Valeur | Usage |
|---|---|---|
| `--radius-md` | `12px` | Cartes, inputs, modaux, sidebar admin |
| `--radius-lg` | `20px` | Cat-card, dish-card, contact-card, modal overlay |
| `--radius-full` | `9999px` | Boutons, badges, toggles, chips, scrollbar |

**Note :** Il n'existe pas de `--radius-sm`. Le radius sm n'est pas défini mais utilisé implicitement dans `.lang-btn` (valeur par défaut du navigateur).

---

## 2. Typographie

### Polices (Google Fonts)

Importées dans `index.html` (ligne 14) :

| Font | Poids | Usage |
|---|---|---|
| **Playfair Display** | 400, 600, 700 (romain), 400 (italique) | Titres premium : hero-title, section-title, dish-name, dish-price, cart-title, auth-title, cart-total-amount, contact-info h3, google-review-score, admin-sidebar-header, admin-view-header h1 |
| **Inter** | 300, 400, 500, 600 | Texte principal : body, nav items, inputs, labels, boutons, tableaux |
| **Cormorant Garamond** | 300, 400 (romain), 300 (italique) | hero-subtitle (italique, élégant) |
| **Tajawal** | 300, 400, 500, 700 | Police RTL/arabe principale — remplace Playfair Display en mode arabe |
| **Noto Naskh Arabic** | 400, 500, 600, 700 | Police RTL/arabe secondaire — fallback de Tajawal |

### Font sizes

| Token | Valeur | Usage typique |
|---|---|---|
| `--text-xs` | `0.75rem` (12px) | Desktop nav, cat-label, section-eyebrow, badge, toast, hero-eyebrow, btn-primary, fadaerif-modal-btn |
| `--text-sm` | `0.875rem` (14px) | Body, chip, inputs, cart-item, auth-sub, google-review-count, no-results |
| `--text-base` | `1rem` (16px) | body par défaut, cart-remove, contact-info h3 |
| `--text-lg` | `1.125rem` (18px) | dish-name, icon-btn, hero-tagline |
| `--text-xl` | `1.25rem` (20px) | cart-title, auth-title, fadaerif-modal-title, close-btn |
| `--text-2xl` | `1.5rem` (24px) | dish-price, auth-title, cart-total-amount, admin-view-header h1 (responsive) |
| `--text-3xl` | `2rem` (32px) | section-title, cart-total-amount |

Font sizes supplémentaires (hardcodées) :
- `.hero-title` : `clamp(36px, 9vw, 76px)` — responsive, Playfair Display 700
- `.hero-subtitle` : `clamp(13px, 3vw, 17px)` — responsive, Cormorant Garamond italique
- `.hero-eyebrow` : `var(--text-xs)` + letter-spacing 0.4em
- `.logo-sub` : `7px` — lettrine sous le logo
- `.nav-item span` : `var(--text-xs)`
- `.google-review-stars` : `32px` — étoiles Google
- `.google-review-score` : `28px` — note Google

### Font weights

| Weight | Usage |
|---|---|
| `300` | Inter (léger), Cormorant Garamond, Tajawal, add-cart-btn |
| `400` | Playfair Display regular, Inter regular, Tajawal, Noto Naskh Arabic |
| `500` | Inter medium, Tajawal, Noto Naskh Arabic — nav items, chips, cat-label |
| `600` | Playfair Display semi-bold, Inter semi-bold — titres, boutons, cart-item |
| `700` | Playfair Display bold, Tajawal bold, Noto Naskh Arabic bold — hero-title, section-title, dish-price, cart-total-amount |

---

## 3. Composants principaux

### Top Navigation (`.top-nav`)

- **Fichier :** `css/components.css` lignes 1–17
- **Structure :** fixed top, height 60px (70px desktop), glassmorphism (`--glass` + `blur(24px)`), `--glass-border` bottom
- **Enfant :** `.logo`, `.desktop-nav` (caché mobile), `.lang-switcher`, `.nav-actions`

### Bottom Navigation (`.bottom-nav`)

- **Fichier :** `css/components.css` lignes 179–251
- **Structure :** fixed bottom, glassmorphism, cachée sur desktop (`>768px`), padding-bottom avec `safe-area-inset-bottom`
- **Enfant :** `.nav-item` (flex 1, column, `--text3` → `--secondary` au hover/active), `.nav-dot` (petit point lumineux)

### Hero Section (`.hero`)

- **Fichier :** `css/components.css` lignes 252–427
- **Structure :** `100dvh`, centré, overflow hidden
- **Enfant :**
  - `.hero-bg` — fond dégradé fixe
  - `.hero-video-wrap` — iframe vidéo plein écran (Streamable)
  - `.hero-video-overlay` — multiple dégradés pour lisibilité + vignette
  - `.hero-glow` / `.hero-glow-2` — lueurs radiales (rouge + gold)
  - `.hero-content` — animé via `fadeUp`
    - `.hero-eyebrow` — `--accent`, letter-spacing 0.4em, `--text-xs`
    - `.hero-title` — `clamp(36px, 9vw, 76px)`, Playfair Display 700, `#f5f5f0`
    - `.hero-subtitle` — `clamp(13px, 3vw, 17px)`, Cormorant Garamond italique
    - `.btn-primary` — CTA vers le menu

### Category Card (`.cat-card`)

- **Fichier :** `css/components.css` lignes 473–562
- **Structure :** grid item, `--card` bg, `--glass-border`, `--radius-lg`
- **États :** hover/active → bordure gold, translateY(-3px), lueur gold, trait bottom animé
- **Enfant :** `.cat-label` (uppercase, `--text-xs`, `--text2` → `--secondary` au hover)

### Dish Card (`.dish-card`)

- **Fichier :** `css/components.css` lignes 564–637
- **Structure :** `--card` bg, `--radius-lg`, overflow hidden
- **États :** hover → bordure gold, shadow-lg + shadow-gold, translateY(-4px)
- **Enfant :**
  - `.dish-img-wrap` — aspect-ratio 4/3, overflow hidden
  - `.dish-img` — cover, scale(1.06) au hover du parent
  - `.badge` — position absolute, `--radius-full`, backdrop-filter
  - `.dish-body` — padding `--space-md`
    - `.dish-name` — Playfair Display, `--text-lg`, `--text`
    - `.dish-footer` — border-top `--glass-border`
      - `.dish-price` — Playfair Display, `--text-2xl` 700, `--accent`
      - `.add-cart-btn` — rond 32px, `--primary-dark`, `--accent`

### Panier (Cart)

- **Fichier :** `css/components.css` lignes 978–1209
- **Structure :**
  - `.cart-overlay` — fixed inset, backdrop-filter blur, opacity toggle
  - `.cart-sidebar` — fixed right, `min(420px, 100%)`, glassmorphism, transition slide
  - `.cart-header` — Playfair Display title + close-btn
  - `.cart-items` — scrollable, gap `--space-sm`
  - `.cart-item` — `--card`, `--radius-md`, flex row
  - `.cart-qty` — `.qty-btn` (rond), `.qty-num`
  - `.cart-footer` — `.cart-total`, `.cart-checkout` (gradient-primary)

### Toast (`.toast`)

- **Fichier :** `css/components.css` lignes 1211–1235
- **Structure :** fixed bottom center (mobile) / bottom right (desktop), glassmorphism, `--radius-full`, transition fade+translate
- **États :** `.show` → opacity 1, translateY(0)

### Auth Modal

- **Fichier :** `css/components.css` lignes 1258–1445
- **Structure :** `.auth-overlay` (fixed, backdrop), `.auth-modal` (`--card`, `--radius-lg`, `scaleIn` animation)
- **Enfant :** `.auth-title`, `.auth-input` (`--bg2`, focus secondary), `.auth-toggle`, `.auth-btn` (gradient-primary), `.auth-lock` (danger)

### Admin Dashboard

- **Fichier :** `css/components.css` lignes 1447–end
- **Structure :** `.admin-dashboard` → `.admin-scaffold` (flex) → `.admin-sidebar` (200px, collapsible mobile) + `.admin-main`
- **Tables :** `.admin-tbl` — responsive, card layout on `<480px`
- **Modaux :** `.admin-modal` — `scaleIn`, `--radius-lg`, inputs gold focus

### MONALISA Modal (Confirm / Alert / Prompt)

- **Fichier :** `css/components.css` lignes 1924–2070
- **Structure :** `.fadaerif-modal-overlay` (backdrop blur), `.fadaerif-modal` (scale transition), accent line top
- **Enfant :** `.fadaerif-modal-icon`, `.fadaerif-modal-title` (Playfair), `.fadaerif-modal-message`, `.fadaerif-modal-field`, `.fadaerif-modal-actions` → `.fadaerif-modal-btn-confirm` (gradient-primary) / `.fadaerif-modal-btn-cancel`

### Chips (filtres)

- **Fichier :** `css/components.css` lignes 806–846
- **Structure :** `.filter-chips` (grid 3 colonnes mobile → 6 desktop), `.chip` (pill, `--card`, `--radius-full`, `--glass-border`)
- **États :** hover/active → bordure gold, fond gold tinté, shadow gold
- **Mobile :** (`<768px`) flex wrap, centrés, 3 premiers items 100% width

### Contact Cards

- **Fichier :** `css/components.css` lignes 848–976
- **Structure :** `.contact-grid` (2 colonnes), `.contact-card` (`--card`, `--glass-border`, `--radius-lg`)
- **Google Review Block :** fond glass, animation hover, étoiles `#FFB800`, bouton gradient primary→secondary

---

## 4. Procédures de modification rapide

### Changer la palette de couleurs complète

1. Ouvrir `css/variables.css`
2. Modifier les variables `--primary`, `--primary-dark`, `--primary-light`, `--secondary`, `--secondary-light`, `--accent`, `--accent-dim`
3. Mettre à jour les dégradés `--gradient-primary`, `--gradient-accent`, `--gradient-dark` si nécessaire
4. Les ombres `--shadow-red`, `--shadow-gold` référencent les couleurs — les ajuster si besoin
5. Les alias dépréciés (`--gold`, `--gold2`, etc.) pointent vers les nouvelles variables — pas besoin de les modifier
6. Les 5 autres fichiers CSS (`base.css`, `layout.css`, `components.css`, `responsive.css`, `rtl.css`) utilisent tous des `var(...)` — ils s'adaptent automatiquement

### Changer la police principale

1. Modifier le lien Google Fonts dans `index.html` ligne 14
2. Remplacer `'Inter', sans-serif` par la nouvelle police dans `css/base.css` ligne 16 (`body`)
3. Mettre à jour la variable `--font-body` si elle est créée (actuellement non définie — les polices sont hardcodées dans chaque classe)
4. Remplacer `'Playfair Display', serif` dans tous les composants qui l'utilisent (hero-title, section-title, dish-name, dish-price, cart-title, etc.)
5. Répercuter dans `css/rtl.css` pour les polices arabes (`Tajawal`, `Noto Naskh Arabic`)

### Passer en light mode

1. Dans `css/variables.css`, inverser les paires :
   - `--bg` (`#090909`) → couleur claire (ex: `#FAFAFA`)
   - `--text` (`#FFFFFF`) → couleur foncée (ex: `#1A1A1A`)
   - `--bg2` (`#121212`) → gris clair
   - `--text2` (`#D0D0D0`) → gris foncé
   - `--bg3` (`#1A1A1A`) → gris très clair
   - `--text3` (`#888888`) → gris moyen
   - `--card` (`rgba(255,255,255,0.04)`) → ombre légère (ex: `rgba(0,0,0,0.03)`)
   - `--card-hover` → plus prononcé
   - `--glass` → blanc semi-transparent (ex: `rgba(255,255,255,0.85)`)
2. Vérifier les contrastes, notamment :
   - `--accent` (`#F3D98A`) sur fond clair — peut devenir illisible
   - `--secondary` (`#C79A3B`) sur fond clair
   - Dégradés `--gradient-primary` — vérifier le contraste du texte blanc dessus
3. Ajuster `body` transition dans `css/base.css` ligne 20 — déjà présent (`transition: background 0.5s ease, color 0.5s ease`)

### Modifier les espacements

- Modifier les variables `--space-*` dans `css/variables.css` lignes 116–122
- Tous les composants utilisent ces variables — l'adaptation est globale

### Modifier les rayons

- Modifier `--radius-md`, `--radius-lg`, `--radius-full` dans `css/variables.css` lignes 125–127
- Applique à tous les composants arrondis

---

## 5. Breakpoints responsives

Source : `css/responsive.css`

| Breakpoint | Cible | Changements |
|---|---|---|
| `≥ 768px` | Desktop/tablette | `body` padding-bottom supprimé, `.bottom-nav` caché, `.top-nav` height 70px, `.desktop-nav` affiché, `.section` padding étendu, `.hero` padding-top 70px, `.toast` passe en bottom right fixe |
| `≤ 767px` | Mobile | `.hero` padding-top 40px, `.hero-content` translaté vers le haut de 110px, `.hero-logo` width 170px, espacements héro réduits |
| `≤ 768px` | Admin mobile | `.admin-scaffold` column, `.admin-sidebar` horizontal scroll, `.admin-main` padding réduit, `.admin-view-header` column, `.admin-btn-add` full width, `.admin-table-wrap` overflow-x auto |
| `≤ 480px` | Petit mobile | `.admin-tbl` passe en mode carte (thead caché, td block), `.form-row` / `.config-grid` column, `.form-actions` column, padding réduit |
| `≤ 540px` | Contact mobile | `.contact-grid` passe en 1 colonne |

Breakpoints de grille supplémentaires (dans `css/layout.css`) :

| Grille | Breakpoints |
|---|---|
| `.cat-grid` | 3 colonnes défaut → 4 (`≥640px`) → 5 (`≥1024px`) → 6 (`≥1280px`) |
| `.featured-grid` | 1 colonne défaut → 2 (`≥640px`) → 3 (`≥1024px`) |
| `.menu-grid` | 1 colonne défaut → 2 (`≥540px`) → 3 (`≥860px`) → 4 (`≥1200px`) |
| `.filter-chips` | 3 colonnes défaut → 4 (`≥600px`) → 5 (`≥900px`) → 6 (`≥1200px`) ; sur mobile `<768px`: flex wrap centré |

---

## 6. Animations et effets

### Keyframes (définis dans `css/variables.css` lignes 139–162)

| Keyframe | Effet | Usage |
|---|---|---|
| `shimmer` | Background-position slide (skeleton) | Réservé (chargement) |
| `fadeUp` | Opacity 0→1 + translateY(24px)→0 | `.hero-content`, `.page.active` |
| `scaleIn` | Opacity 0→1 + scale(0.9)→1 | `.auth-modal`, `.admin-modal`, `.fadaerif-modal` |
| `slideIn` | translateX(100%)→0 + opacity 0→1 | `.cart-sidebar.open` |
| `cartBounce` | scale 1→1.3→1 | `.cart-badge.show` |

Keyframes supplémentaires :

| Keyframe (dans components.css) | Effet | Usage |
|---|---|---|
| `adminFade` (ligne 1559) | Opacity 0→1 + translateY(6px)→0 | `.admin-view.active` |
| `slideInRtl` (dans `rtl.css` ligne 45) | translateX(-100%)→0 + opacity 0→1 | `.cart-sidebar.open` en mode RTL |

### Transitions

| Composant | Propriété | Durée | Easing |
|---|---|---|---|
| `body` | background, color | 0.5s | ease |
| `.top-nav` | background, border-color | 0.5s | ease |
| `.bottom-nav` | background, border-color | 0.5s | ease |
| `.desktop-nav-item` | all | 0.3s | ease |
| `.lang-btn` | all | 0.25s | ease |
| `.icon-btn` | all | 0.3s | ease |
| `.nav-item` | all | 0.3s | ease |
| `.btn-primary` | all | 0.3s | ease |
| `.cat-card` | all | 0.4s | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` |
| `.dish-card` | all | 0.4s | ease |
| `.dish-img` | transform | 0.6s | ease |
| `.add-cart-btn` | all | 0.3s | ease |
| `.wa-btn` | all | 0.3s | ease |
| `.chip` | all | 0.3s | ease |
| `.cart-overlay` | opacity | 0.4s | ease |
| `.cart-sidebar` | right | 0.4s | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `.toast` | all | 0.4s | ease |
| `.reveal` | opacity, transform | 0.6s | ease (intersection observer) |
| `.auth-overlay` | opacity | 0.3s | ease |
| `.auth-input` | all | 0.3s | ease |
| `.auth-toggle` | background, border-color | 0.3s | ease |
| `.auth-toggle::after` | transform, background | 0.3s | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| `.auth-btn` | all | 0.3s | ease |
| `.fadaerif-modal-overlay` | opacity | 0.3s | ease |
| `.fadaerif-modal` | transform | 0.3s | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `.fadaerif-modal-btn` | all | 0.3s | ease |
| `.google-review-block` | all | 0.4s | ease |
| `.contact-card` | all | 0.3s | ease |

### Ripple effect

`.btn-primary:active::after` — crée un cercle blanc expansif au clic (lignes 455–471 de `components.css`).

---

## 7. Architecture CSS

```
css/main.css             → Point d'entrée (imports)
├── css/variables.css    → Couleurs, espacements, radius, ombres, keyframes
├── css/base.css         → Reset, body, scrollbar, sélection
├── css/layout.css       → Grilles (cat, featured, menu), sections, pages
├── css/components.css   → Tous les composants (nav, hero, cards, cart, modaux, admin, toast)
├── css/responsive.css   → Breakpoints (768px, 767px, 540px, 480px)
└── css/rtl.css          → Overrides RTL (arabe) — polices, flipped UI, keyframe slideInRtl
```

### Ordre de chargement

`index.html` ligne 17 → `css/main.css` → `@import` les 6 fichiers dans l'ordre ci-dessus.

### RTL (arabe)

Activé par `dir="rtl"` sur `<html>` (géré par JS/i18n dans `js/i18n.js`). Le fichier `css/rtl.css` :
- Remplace `Playfair Display` par `Tajawal, 'Noto Naskh Arabic'` sur tous les titres
- Inverse les positions (left ↔ right) pour sidebar, badge, cart, modal close
- Définit `slideInRtl` pour le panier
- Inverse les flèches SVG sur les boutons CTA (`scaleX(-1)`)
- Ajuste les espacements du lang-switcher et admin logout
