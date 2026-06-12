/* ========================================
   MENU.JS — Données, état et logique métier
   Rôle : Données du menu, gestion du panier,
   filtres, rendu des plats, WhatsApp et
   scroll reveal.
   ======================================== */

import { getMenuItems, getCategories, getSettings } from './supabase.js';

/* --- Données --- */

let WA_NUMBER = '212630230803';
let SETTINGS = {};

let MENU_DATA = [];
let CATEGORIES = [{ name: 'Tout', icon: '' }];

const FALLBACK_MENU = [
  { id: 1, name: 'Tartare de Thon', category: 'Entrées', price: 18, description: 'Thon frais à l\'avocat, sauce yuzu et sésame torréfié.', tags: ['chef'], available: true, popular: true, image: '' },
  { id: 2, name: 'Foie Gras Maison', category: 'Entrées', price: 24, description: 'Foie gras de canard mi-cuit, chutney de figues et brioche toastée.', tags: ['chef'], available: true, popular: false, image: '' },
  { id: 3, name: 'Velouté de Homard', category: 'Entrées', price: 19, description: 'Crème de homard au cognac, quenelle de mascarpone et ciboulette.', tags: [], available: true, popular: false, image: '' },
  { id: 4, name: 'Saint-Jacques Poêlées', category: 'Entrées', price: 22, description: 'Noix de Saint-Jacques, purée de chou-fleur et huile de truffe blanche.', tags: ['chef'], available: true, popular: true, image: '' },
  { id: 5, name: 'Salade Burrata', category: 'Salades', price: 16, description: 'Burrata crémeuse, tomates heritage, basilic et huile d\'olive extra-vierge.', tags: ['halal'], available: true, popular: false, image: '' },
  { id: 6, name: 'César Royal', category: 'Salades', price: 17, description: 'Romaine croquante, parmesan affiné, anchois et croûtons dorés.', tags: [], available: true, popular: true, image: '' },
  { id: 7, name: 'Salade Niçoise Gastronomique', category: 'Salades', price: 19, description: 'Thon mi-cuit, œuf mollet, olives taggiasche et vinaigrette aux herbes.', tags: ['halal'], available: true, popular: false, image: '' },
  { id: 8, name: 'Wagyu Beef Steak', category: 'Plats Principaux', price: 49, description: 'Wagyu japonais grillé à la perfection, sauce truffe noire, légumes de saison.', tags: ['chef', 'halal'], available: true, popular: true, image: '' },
  { id: 9, name: 'Agneau Rôti aux Herbes', category: 'Plats Principaux', price: 38, description: 'Carré d\'agneau en croûte de pistache, jus de viande réduit au thym.', tags: ['halal'], available: true, popular: false, image: '' },
  { id: 10, name: 'Canard à l\'Orange Moderne', category: 'Plats Principaux', price: 36, description: 'Magret de canard confit, émulsion à l\'orange sanguine, patate douce rôtie.', tags: ['halal'], available: true, popular: false, image: '' },
  { id: 11, name: 'Filet de Bœuf Wellington', category: 'Plats Principaux', price: 54, description: 'Filet de bœuf enrobé de duxelles aux champignons, feuilletage doré.', tags: ['chef', 'halal'], available: true, popular: true, image: '' },
  { id: 12, name: 'Homard Breton', category: 'Fruits de Mer', price: 72, description: 'Demi-homard breton grillé au beurre à la fleur de sel, mayonnaise citronnée.', tags: ['chef'], available: true, popular: true, image: '' },
  { id: 13, name: 'Sole Meunière', category: 'Fruits de Mer', price: 42, description: 'Sole entière sautée au beurre noisette, câpres et citron confit.', tags: [], available: true, popular: false, image: '' },
  { id: 14, name: 'Crevettes Royales Flambées', category: 'Fruits de Mer', price: 35, description: 'Grosses crevettes flambées au pastis, ail et persillade provençale.', tags: ['spicy'], available: true, popular: false, image: '' },
  { id: 15, name: 'Plateau de Fruits de Mer', category: 'Fruits de Mer', price: 95, description: 'Sélection du marché : huîtres, langoustines, crevettes, palourdes.', tags: ['chef'], available: false, popular: false, image: '' },
  { id: 16, name: 'Entrecôte Maturée 45j', category: 'Grillades', price: 46, description: 'Entrecôte maturée 45 jours, sauce béarnaise, frites maison et salade.', tags: ['halal'], available: true, popular: true, image: '' },
  { id: 17, name: 'Côtelettes d\'Agneau', category: 'Grillades', price: 44, description: 'Double côtelette d\'agneau marinée au romarin, légumes grillés.', tags: ['halal'], available: true, popular: false, image: '' },
  { id: 18, name: 'Mixed Grill Luxora', category: 'Grillades', price: 58, description: 'Sélection de viandes grillées : bœuf, agneau, poulet, merguez maison.', tags: ['chef', 'halal', 'spicy'], available: true, popular: true, image: '' },
  { id: 19, name: 'Fondant au Chocolat', category: 'Desserts', price: 12, description: 'Coulant au chocolat Valrhona 70%, glace vanille bourbon et caramel beurre salé.', tags: ['chef'], available: true, popular: true, image: '' },
  { id: 20, name: 'Crème Brûlée à la Rose', category: 'Desserts', price: 11, description: 'Crème brûlée infusée à l\'eau de rose, sucre caramélisé à la torche.', tags: [], available: true, popular: false, image: '' },
  { id: 21, name: 'Mille-Feuille Revisité', category: 'Desserts', price: 14, description: 'Feuilletage croustillant, crème diplomate à la vanille de Madagascar.', tags: ['chef'], available: true, popular: false, image: '' },
  { id: 22, name: 'Sorbets Maison', category: 'Desserts', price: 9, description: 'Trilogie de sorbets faits maison : mangue, framboise, passion.', tags: [], available: true, popular: false, image: '' },
  { id: 23, name: 'Jus de Fruits Pressés', category: 'Boissons', price: 7, description: 'Orange, citron ou grenadine — pressés à la commande.', tags: ['halal'], available: true, popular: false, image: '' },
  { id: 24, name: 'Eau Minérale Premium', category: 'Boissons', price: 5, description: 'Eau plate ou pétillante, Evian ou San Pellegrino.', tags: [], available: true, popular: false, image: '' },
  { id: 25, name: 'Cocktail Sans Alcool', category: 'Boissons', price: 10, description: 'Création du bartender : mocktail fruité aux herbes fraîches du jardin.', tags: ['halal'], available: true, popular: true, image: '' },
  { id: 26, name: 'Thé à la Menthe Royale', category: 'Boissons', price: 6, description: 'Thé vert infusé à la menthe fraîche, servi dans notre théière en argent.', tags: ['halal'], available: true, popular: false, image: '' },
];

const FALLBACK_CATS = [
  { name: 'Tout', icon: '' },
  { name: 'Entrées', icon: '<svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' },
  { name: 'Salades', icon: '<svg viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>' },
  { name: 'Plats Principaux', icon: '<svg viewBox="0 0 24 24"><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"/><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2"/><line x1="12" y1="5" x2="12" y2="19"/></svg>' },
  { name: 'Fruits de Mer', icon: '<svg viewBox="0 0 24 24"><path d="M2 16s3-7 10-7 10 7 10 7"/><circle cx="12" cy="9" r="3"/><path d="M12 12v10"/><path d="M8 22h8"/></svg>' },
  { name: 'Grillades', icon: '<svg viewBox="0 0 24 24"><path d="M12 2v4"/><path d="M8 6h8"/><path d="M6 10c0-3 2.7-5 6-5s6 2 6 5"/><path d="M7 22l2-6h6l2 6"/><path d="M12 16v6"/><path d="M10 10v2"/><path d="M14 10v2"/></svg>' },
  { name: 'Desserts', icon: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-10 10h20A10 10 0 0 0 12 2z"/><path d="M5 14c2 4 5 6 7 6s5-2 7-6"/><path d="M8 9h8"/></svg>' },
  { name: 'Boissons', icon: '<svg viewBox="0 0 24 24"><path d="M18 8h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1.5"/><path d="M6 2L4 18c0 2.2 1.8 4 4 4h8c2.2 0 4-1.8 4-4L18 2"/><path d="M12 22v-8"/><path d="M8 10h8"/></svg>' },
];

export async function loadMenuData() {
  try {
    const items = await getMenuItems();
    const cats = await getCategories();
    if (items.length > 0 && cats.length > 0) {
      MENU_DATA = items.map(item => ({
        id: item.id, name: item.name, category: item.category,
        price: item.price, description: item.description || '',
        tags: item.tags || [], available: item.available,
        popular: item.popular, image: item.image_url || '',
      }));
      CATEGORIES = [
        { name: 'Tout', icon: '' },
        ...cats.map(c => ({ name: c.name, icon: c.icon_svg || '' })),
      ];
    }
  } catch (e) {
    console.warn('Supabase indisponible, utilisation des données locales :', e);
  }
  if (!MENU_DATA.length) MENU_DATA = FALLBACK_MENU;
  if (CATEGORIES.length <= 1) CATEGORIES = FALLBACK_CATS;
}

export async function loadSettings() {
  try {
    SETTINGS = await getSettings();
    if (SETTINGS.wa_number) WA_NUMBER = SETTINGS.wa_number;
  } catch (e) {
    console.warn('Impossible de charger la configuration :', e);
  }
}

export function renderContact() {
  const wrap = $('contactWrap');
  if (!wrap) return;
  const s = SETTINGS;
  wrap.innerHTML = `
    <div class="contact-card">
      <div class="contact-info"><h3>Adresse</h3><p>${s.address || '12 Avenue des Saveurs<br/>Tanger, Maroc'}</p></div>
    </div>
    <div class="contact-card">
      <div class="contact-info"><h3>Horaires</h3><p>${s.hours || 'Lun–Sam : 12h–15h · 19h–23h<br/>Dim : 12h–16h'}</p></div>
    </div>
    <div class="contact-card">
      <div class="contact-info"><h3>Téléphone</h3><a href="tel:${s.phone_raw || '+212630230803'}">${s.phone || '+212 630 230 803'}</a></div>
    </div>
    <div class="contact-card">
      <div class="contact-info"><h3>Email</h3><a href="mailto:${s.email || 'contact@luxora.ma'}">${s.email || 'contact@luxora.ma'}</a></div>
    </div>
    <div class="contact-card">
      <div class="contact-info"><h3>Instagram</h3><a href="#">${s.instagram || '@luxora.finedining'}</a></div>
    </div>
    <a class="wa-cta" href="https://wa.me/${s.wa_number || '212630230803'}?text=${encodeURIComponent('Bonjour, je voudrais avoir des informations sur ' + (s.restaurant_name || 'Luxora') + '.')}" target="_blank">
      <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.561 4.14 1.541 5.87L0 24l6.268-1.508A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.939 0-3.765-.494-5.353-1.359l-.373-.21-3.863.929.972-3.756-.235-.391A9.963 9.963 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
      Contacter via WhatsApp
    </a>`;
}

/* --- État --- */

let cart = [];
let activeFilter = 'Tout';

/* --- Utilitaires --- */

function $(id) {
  return document.getElementById(id);
}

function qsa(sel, ctx) {
  return (ctx || document).querySelectorAll(sel);
}

/* --- Toast --- */

let toastTimer;

export function showToast(msg) {
  const t = $('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

/* --- Navigation de pages --- */

export function showPage(name) {
  qsa('.page').forEach(p => p.classList.remove('active'));
  const page = $('page-' + name);
  if (page) page.classList.add('active');

  qsa('.nav-item').forEach(n => n.classList.remove('active'));
  const bn = $('bnav-' + name);
  if (bn) bn.classList.add('active');

  qsa('.desktop-nav-item').forEach(n => n.classList.remove('active'));
  qsa('.desktop-nav-item').forEach(n => {
    const text = n.textContent.toLowerCase();
    const labels = { home: 'home', menu: 'menu', contact: 'contact', admin: 'admin' };
    const match = labels[name] || '';
    if (match && text.includes(match)) n.classList.add('active');
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (name === 'admin') {
    document.body.classList.add('admin-mode');
  } else {
    document.body.classList.remove('admin-mode');
  }
}

/* --- Helper: render icon (SVG string or image URL) --- */
/* --- Rendu des catégories (home) --- */

function renderHomeCats() {
  const el = $('homeCatGrid');
  if (!el) return;
  el.innerHTML = CATEGORIES.slice(1).map(c => `
    <div class="cat-card" data-category="${c.name}">
      <span class="cat-label">${c.name}</span>
    </div>
  `).join('');
}

/* --- Rendu des plats à la une --- */

export function renderFeatured() {
  const el = $('featuredGrid');
  if (!el) return;
  const featured = MENU_DATA.filter(d => d.popular).slice(0, 6);
  el.innerHTML = featured.map(d => dishCard(d)).join('');
  setupReveal();
}

/* --- Carte d'un plat --- */

function dishCard(dish) {
  const badges = [];

  badges.push(`<span class="badge badge-category">${dish.category}</span>`);

  if (!dish.available) {
    badges.push('<span class="badge badge-unavail">Indisponible</span>');
  }

  const imgHtml = dish.image
    ? `<img src="${dish.image}" alt="${dish.name}" class="dish-img"/>`
    : `<div class="dish-img-placeholder"></div>`;

  return `
  <div class="dish-card" data-id="${dish.id}">
    <div class="dish-img-wrap">
      ${imgHtml}
      ${badges.join('')}
    </div>
    <div class="dish-body">
      <div class="dish-name">${dish.name}</div>
      <div class="dish-footer">
        <div>
          <span class="dish-price">${dish.price} DH</span>
        </div>
        <div class="dish-actions">
          ${dish.available ? `<button class="add-cart-btn" data-action="cart">+</button>` : ''}
        </div>
      </div>
      ${dish.available ? `
      <button class="wa-btn" data-action="order" style="width:100%;margin-top:10px;justify-content:center;">
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.561 4.14 1.541 5.87L0 24l6.268-1.508A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.939 0-3.765-.494-5.353-1.359l-.373-.21-3.863.929.972-3.756-.235-.391A9.963 9.963 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
        Commander via WhatsApp
      </button>` : '<div style="text-align:center;font-size:12px;color:var(--text3);margin-top:10px;padding:8px;background:rgba(255,255,255,.04);border-radius:8px">Temporairement indisponible</div>'}
    </div>
  </div>`;
}

/* --- Filtres --- */

export function renderFilterChips() {
  const el = $('filterChips');
  if (!el) return;
  el.innerHTML = CATEGORIES.map(c => `
    <button class="chip ${activeFilter === c.name ? 'active' : ''}" data-category="${c.name}">${c.name}</button>
  `).join('');
}

function setFilter(name) {
  activeFilter = name;
  renderFilterChips();
  renderMenuGrid();
}

/* --- Grille du menu --- */

export function renderMenuGrid(items) {
  if (!items) {
    items = MENU_DATA.filter(d => {
      return activeFilter === 'Tout' || d.category === activeFilter;
    });
  }

  const grid = $('menuGrid');
  const noRes = $('noResults');
  if (!grid) return;

  if (!items.length) {
    grid.innerHTML = '';
    if (noRes) noRes.style.display = 'block';
    return;
  }

  if (noRes) noRes.style.display = 'none';
  grid.innerHTML = items.map(d => dishCard(d)).join('');
  setupReveal();
}

/* --- Panier --- */

function addToCart(id) {
  const dish = MENU_DATA.find(d => d.id === id);
  if (!dish) return;
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...dish, qty: 1 });
  }
  updateCartBadge();
  showToast(`${dish.name} ajouté`);
  const badge = $('cartBadge');
  if (badge) {
    badge.classList.remove('show');
    void badge.offsetWidth;
    badge.classList.add('show');
  }
}

function updateCartBadge() {
  const total = cart.reduce((s, c) => s + c.qty, 0);
  const badge = $('cartBadge');
  if (!badge) return;
  badge.textContent = total;
  if (total > 0) {
    badge.classList.add('show');
  } else {
    badge.classList.remove('show');
  }
}

export function openCart() {
  const overlay = $('cartOverlay');
  const sidebar = $('cartSidebar');
  if (overlay) overlay.classList.add('open');
  if (sidebar) sidebar.classList.add('open');
  renderCartItems();
}

export function closeCart() {
  const overlay = $('cartOverlay');
  const sidebar = $('cartSidebar');
  if (overlay) overlay.classList.remove('open');
  if (sidebar) sidebar.classList.remove('open');
}

function renderCartItems() {
  const container = $('cartItems');
  const footer = $('cartFooter');
  const empty = $('cartEmpty');
  if (!container) return;

  if (!cart.length) {
    if (empty) empty.style.display = 'flex';
    if (footer) footer.style.display = 'none';
    container.innerHTML = '';
    if (empty) container.appendChild(empty);
    return;
  }

  if (empty) empty.style.display = 'none';
  if (footer) footer.style.display = 'block';

  container.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${(item.price * item.qty).toFixed(2)} DH</div>
        <div class="cart-qty">
          <button class="qty-btn" data-action="qty" data-delta="-1">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" data-action="qty" data-delta="1">+</button>
        </div>
      </div>
      <button class="cart-remove" data-action="remove">✕</button>
    </div>
  `).join('');

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const totalEl = $('cartTotal');
  if (totalEl) totalEl.textContent = `${total.toFixed(2)} DH`;
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== id);
  }
  updateCartBadge();
  renderCartItems();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartBadge();
  renderCartItems();
}

/* --- WhatsApp --- */

function orderWhatsApp(id) {
  const dish = MENU_DATA.find(d => d.id === id);
  if (!dish) return;
  const msg = `Bonjour, je souhaite commander :\n\nPlat : ${dish.name}\nPrix : ${dish.price} DH\n\nMerci de confirmer la disponibilité.`;
  openWhatsApp(msg);
}

export function checkoutWhatsApp() {
  if (!cart.length) return;
  const lines = cart.map(c => `${c.qty}x ${c.name} — ${(c.price * c.qty).toFixed(2)} DH`).join('\n');
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const msg = `Bonjour, je souhaite commander :\n\n${lines}\n\nTotal : ${total.toFixed(2)} DH\n\nNom client :\nTéléphone :\n\nMerci de confirmer ma commande.`;
  openWhatsApp(msg);
}

function openWhatsApp(msg) {
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

/* --- Scroll Reveal --- */

function setupReveal() {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* --- Event Listeners (non-navigation) --- */

function setupMenuEventListeners() {
  // Filtres
  $('filterChips')?.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (chip?.dataset.category) {
      setFilter(chip.dataset.category);
    }
  });

  // Actions dans les dish cards (panier, commande)
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.dish-card');
    if (!card) return;
    const id = parseInt(card.dataset.id, 10);
    if (isNaN(id)) return;

    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    e.stopPropagation();

    if (action === 'cart') {
      addToCart(id);
    } else if (action === 'order') {
      orderWhatsApp(id);
    }
  });

  // Actions dans le panier (qty, remove)
  $('cartItems')?.addEventListener('click', (e) => {
    const item = e.target.closest('.cart-item');
    if (!item) return;
    const id = parseInt(item.dataset.id, 10);
    if (isNaN(id)) return;

    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    if (btn.dataset.action === 'qty') {
      changeQty(id, parseInt(btn.dataset.delta, 10));
    } else if (btn.dataset.action === 'remove') {
      removeFromCart(id);
    }
  });
}

/* --- Initialisation --- */

export async function initMenu() {
  await loadMenuData();
  await loadSettings();
  renderHomeCats();
  renderFeatured();
  renderFilterChips();
  renderMenuGrid();
  renderContact();
  updateCartBadge();
  setupReveal();
  setupMenuEventListeners();
}
