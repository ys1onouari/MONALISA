import { getMenuItems, getCategories, getSettings } from './supabase.js';
import { t, localized } from './i18n.js';

let WA_NUMBER = '212630230803';
let SETTINGS = {};

let MENU_DATA = [];
let CATEGORIES = [{ id: null, name: '__all__', icon: '' }];
let CATEGORY_MAP = new Map();

const FALLBACK_MENU = [
  { id: 1, name: { fr: 'Tartare de Thon', en: 'Tuna Tartare', es: 'Tartar de Atún', ar: '' }, category_id: 1, price: 18, description: { fr: 'Thon frais à l\'avocat, sauce yuzu et sésame torréfié.', en: 'Fresh tuna with avocado, yuzu sauce and toasted sesame.', es: 'Atún fresco con aguacate, salsa yuzu y sésamo tostado.', ar: '' }, tags: ['chef'], available: true, popular: true, image: '' },
  { id: 2, name: { fr: 'Foie Gras Maison', en: 'Homemade Foie Gras', es: 'Foie Gras Casero', ar: '' }, category_id: 1, price: 24, description: { fr: 'Foie gras de canard mi-cuit, chutney de figues et brioche toastée.', en: 'Half-cooked duck foie gras, fig chutney and toasted brioche.', es: 'Foie gras de pato semicocido, chutney de higos y brioche tostada.', ar: '' }, tags: ['chef'], available: true, popular: false, image: '' },
  { id: 3, name: { fr: 'Velouté de Homard', en: 'Lobster Velouté', es: 'Velouté de Langosta', ar: '' }, category_id: 1, price: 19, description: { fr: 'Crème de homard au cognac, quenelle de mascarpone et ciboulette.', en: 'Lobster cream with cognac, mascarpone quenelle and chives.', es: 'Crema de langosta al coñac, quenelle de mascarpone y cebollino.', ar: '' }, tags: [], available: true, popular: false, image: '' },
  { id: 4, name: { fr: 'Saint-Jacques Poêlées', en: 'Seared Scallops', es: 'Vieiras Salteadas', ar: '' }, category_id: 1, price: 22, description: { fr: 'Noix de Saint-Jacques, purée de chou-fleur et huile de truffe blanche.', en: 'Scallops, cauliflower purée and white truffle oil.', es: 'Vieiras, puré de coliflor y aceite de trufa blanca.', ar: '' }, tags: ['chef'], available: true, popular: true, image: '' },
  { id: 5, name: { fr: 'Salade Burrata', en: 'Burrata Salad', es: 'Ensalada de Burrata', ar: '' }, category_id: 2, price: 16, description: { fr: 'Burrata crémeuse, tomates heritage, basilic et huile d\'olive extra-vierge.', en: 'Creamy burrata, heritage tomatoes, basil and extra-virgin olive oil.', es: 'Burrata cremosa, tomates heritage, albahaca y aceite de oliva virgen extra.', ar: '' }, tags: ['halal'], available: true, popular: false, image: '' },
  { id: 6, name: { fr: 'César Royal', en: 'Royal Caesar', es: 'César Real', ar: '' }, category_id: 2, price: 17, description: { fr: 'Romaine croquante, parmesan affiné, anchois et croûtons dorés.', en: 'Crisp romaine, aged parmesan, anchovies and golden croutons.', es: 'Lechuga romana crujiente, parmesano curado, anchoas y picatostes dorados.', ar: '' }, tags: [], available: true, popular: true, image: '' },
  { id: 7, name: { fr: 'Salade Niçoise Gastronomique', en: 'Gourmet Niçoise Salad', es: 'Ensalada Nizarda Gastronómica', ar: '' }, category_id: 2, price: 19, description: { fr: 'Thon mi-cuit, œuf mollet, olives taggiasche et vinaigrette aux herbes.', en: 'Seared tuna, soft-boiled egg, taggiasche olives and herb vinaigrette.', es: 'Atún medio cocido, huevo pasado por agua, aceitunas taggiasche y vinagreta de hierbas.', ar: '' }, tags: ['halal'], available: true, popular: false, image: '' },
  { id: 8, name: { fr: 'Wagyu Beef Steak', en: 'Wagyu Beef Steak', es: 'Steak de Wagyu', ar: '' }, category_id: 3, price: 49, description: { fr: 'Wagyu japonais grillé à la perfection, sauce truffe noire, légumes de saison.', en: 'Japanese Wagyu grilled to perfection, black truffle sauce, seasonal vegetables.', es: 'Wagyu japonés a la parrilla a la perfección, salsa de trufa negra, verduras de temporada.', ar: '' }, tags: ['chef', 'halal'], available: true, popular: true, image: '' },
  { id: 9, name: { fr: 'Agneau Rôti aux Herbes', en: 'Herb-Roasted Lamb', es: 'Cordero Asado con Hierbas', ar: '' }, category_id: 3, price: 38, description: { fr: 'Carré d\'agneau en croûte de pistache, jus de viande réduit au thym.', en: 'Rack of lamb in pistachio crust, thyme-reduced meat juice.', es: 'Cordero en costra de pistacho, jugo de carne reducido con tomillo.', ar: '' }, tags: ['halal'], available: true, popular: false, image: '' },
  { id: 10, name: { fr: 'Canard à l\'Orange Moderne', en: 'Modern Duck à l\'Orange', es: 'Pato a la Naranja Moderno', ar: '' }, category_id: 3, price: 36, description: { fr: 'Magret de canard confit, émulsion à l\'orange sanguine, patate douce rôtie.', en: 'Confit duck breast, blood orange emulsion, roasted sweet potato.', es: 'Magret de pato confitado, emulsión de naranja sanguina, boniato asado.', ar: '' }, tags: ['halal'], available: true, popular: false, image: '' },
  { id: 11, name: { fr: 'Filet de Bœuf Wellington', en: 'Beef Wellington', es: 'Solomillo Wellington', ar: '' }, category_id: 3, price: 54, description: { fr: 'Filet de bœuf enrobé de duxelles aux champignons, feuilletage doré.', en: 'Beef fillet wrapped in mushroom duxelles, golden puff pastry.', es: 'Solomillo de ternera envuelto en duxelles de champiñones, hojaldre dorado.', ar: '' }, tags: ['chef', 'halal'], available: true, popular: true, image: '' },
  { id: 12, name: { fr: 'Homard Breton', en: 'Breton Lobster', es: 'Langosta Bretona', ar: '' }, category_id: 4, price: 72, description: { fr: 'Demi-homard breton grillé au beurre à la fleur de sel, mayonnaise citronnée.', en: 'Half Breton lobster grilled with fleur de sel butter, lemon mayonnaise.', es: 'Media langosta bretona a la parrilla con mantequilla de flor de sal, mayonesa de limón.', ar: '' }, tags: ['chef'], available: true, popular: true, image: '' },
  { id: 13, name: { fr: 'Sole Meunière', en: 'Sole Meunière', es: 'Lenguado a la Meunière', ar: '' }, category_id: 4, price: 42, description: { fr: 'Sole entière sautée au beurre noisette, câpres et citron confit.', en: 'Whole sole sautéed in brown butter, capers and confit lemon.', es: 'Lenguado entero salteado con mantequilla avellana, alcaparras y limón confitado.', ar: '' }, tags: [], available: true, popular: false, image: '' },
  { id: 14, name: { fr: 'Crevettes Royales Flambées', en: 'Flambéed Royal Prawns', es: 'Gambas Reales Flambeadas', ar: '' }, category_id: 4, price: 35, description: { fr: 'Grosses crevettes flambées au pastis, ail et persillade provençale.', en: 'Large prawns flambéed with pastis, garlic and Provençal persillade.', es: 'Gambas grandes flambeadas con pastis, ajo y persillada provenzal.', ar: '' }, tags: ['spicy'], available: true, popular: false, image: '' },
  { id: 15, name: { fr: 'Plateau de Fruits de Mer', en: 'Seafood Platter', es: 'Bandeja de Mariscos', ar: '' }, category_id: 4, price: 95, description: { fr: 'Sélection du marché : huîtres, langoustines, crevettes, palourdes.', en: 'Market selection: oysters, langoustines, prawns, clams.', es: 'Selección del mercado: ostras, langostinos, gambas, almejas.', ar: '' }, tags: ['chef'], available: false, popular: false, image: '' },
  { id: 16, name: { fr: 'Entrecôte Maturée 45j', en: '45-Day Aged Ribeye', es: 'Entrecot Madurado 45d', ar: '' }, category_id: 5, price: 46, description: { fr: 'Entrecôte maturée 45 jours, sauce béarnaise, frites maison et salade.', en: '45-day aged ribeye, béarnaise sauce, homemade fries and salad.', es: 'Entrecot madurado 45 días, salsa bearnesa, patatas fritas caseras y ensalada.', ar: '' }, tags: ['halal'], available: true, popular: true, image: '' },
  { id: 17, name: { fr: 'Côtelettes d\'Agneau', en: 'Lamb Chops', es: 'Chuletas de Cordero', ar: '' }, category_id: 5, price: 44, description: { fr: 'Double côtelette d\'agneau marinée au romarin, légumes grillés.', en: 'Double lamb chop marinated in rosemary, grilled vegetables.', es: 'Chuleta doble de cordero marinada en romero, verduras a la parrilla.', ar: '' }, tags: ['halal'], available: true, popular: false, image: '' },
  { id: 18, name: { fr: 'Mixed Grill CHEF HAM&HAM', en: 'Mixed Grill CHEF HAM&HAM', es: 'Mixed Grill CHEF HAM&HAM', ar: '' }, category_id: 5, price: 58, description: { fr: 'Sélection de viandes grillées : bœuf, agneau, poulet, merguez maison.', en: 'Selection of grilled meats: beef, lamb, chicken, homemade merguez.', es: 'Selección de carnes a la parrilla: ternera, cordero, pollo, merguez casero.', ar: '' }, tags: ['chef', 'halal', 'spicy'], available: true, popular: true, image: '' },
  { id: 19, name: { fr: 'Fondant au Chocolat', en: 'Chocolate Fondant', es: 'Fondant de Chocolate', ar: '' }, category_id: 6, price: 12, description: { fr: 'Coulant au chocolat Valrhona 70%, glace vanille bourbon et caramel beurre salé.', en: 'Valrhona 70% chocolate lava cake, bourbon vanilla ice cream and salted butter caramel.', es: 'Coulant de chocolate Valrhona 70%, helado de vainilla bourbon y caramelo de mantequilla salada.', ar: '' }, tags: ['chef'], available: true, popular: true, image: '' },
  { id: 20, name: { fr: 'Crème Brûlée à la Rose', en: 'Rose Crème Brûlée', es: 'Crema Brûlée de Rosa', ar: '' }, category_id: 6, price: 11, description: { fr: 'Crème brûlée infusée à l\'eau de rose, sucre caramélisé à la torche.', en: 'Rose water-infused crème brûlée, torch-caramelized sugar.', es: 'Crema brûlée infusionada con agua de rosas, azúcar caramelizado al soplete.', ar: '' }, tags: [], available: true, popular: false, image: '' },
  { id: 21, name: { fr: 'Mille-Feuille Revisité', en: 'Revisited Mille-Feuille', es: 'Mille-Feuille Revisado', ar: '' }, category_id: 6, price: 14, description: { fr: 'Feuilletage croustillant, crème diplomate à la vanille de Madagascar.', en: 'Crisp puff pastry, Madagascar vanilla diplomat cream.', es: 'Hojaldre crujiente, crema diplomática de vainilla de Madagascar.', ar: '' }, tags: ['chef'], available: true, popular: false, image: '' },
  { id: 22, name: { fr: 'Sorbets Maison', en: 'Homemade Sorbets', es: 'Sorbetes Caseros', ar: '' }, category_id: 6, price: 9, description: { fr: 'Trilogie de sorbets faits maison : mangue, framboise, passion.', en: 'Trilogy of homemade sorbets: mango, raspberry, passion fruit.', es: 'Trilogía de sorbetes caseros: mango, frambuesa, maracuyá.', ar: '' }, tags: [], available: true, popular: false, image: '' },
  { id: 23, name: { fr: 'Jus de Fruits Pressés', en: 'Fresh Juices', es: 'Zumos de Fruta Exprimidos', ar: '' }, category_id: 7, price: 7, description: { fr: 'Orange, citron ou grenadine — pressés à la commande.', en: 'Orange, lemon or pomegranate — freshly squeezed to order.', es: 'Naranja, limón o granada — exprimidos al momento.', ar: '' }, tags: ['halal'], available: true, popular: false, image: '' },
  { id: 24, name: { fr: 'Eau Minérale Premium', en: 'Premium Mineral Water', es: 'Agua Mineral Premium', ar: '' }, category_id: 7, price: 5, description: { fr: 'Eau plate ou pétillante, Evian ou San Pellegrino.', en: 'Still or sparkling, Evian or San Pellegrino.', es: 'Agua sin gas o con gas, Evian o San Pellegrino.', ar: '' }, tags: [], available: true, popular: false, image: '' },
  { id: 25, name: { fr: 'Cocktail Sans Alcool', en: 'Non-Alcoholic Cocktail', es: 'Cóctel Sin Alcohol', ar: '' }, category_id: 7, price: 10, description: { fr: 'Création du bartender : mocktail fruité aux herbes fraîches du jardin.', en: 'Bartender\'s creation: fruity mocktail with fresh garden herbs.', es: 'Creación del bartender: mocktail afrutado con hierbas frescas del jardín.', ar: '' }, tags: ['halal'], available: true, popular: true, image: '' },
  { id: 26, name: { fr: 'Thé à la Menthe Royale', en: 'Royal Mint Tea', es: 'Té a la Menta Real', ar: '' }, category_id: 7, price: 6, description: { fr: 'Thé vert infusé à la menthe fraîche, servi dans notre théière en argent.', en: 'Green tea infused with fresh mint, served in our silver teapot.', es: 'Té verde infusionado con menta fresca, servido en nuestra tetera de plata.', ar: '' }, tags: ['halal'], available: true, popular: false, image: '' },
];

const FALLBACK_CATS = [
  { id: null, name: { fr: 'Tout', en: 'All', es: 'Todo', ar: '' }, icon: '' },
  { id: 1, name: { fr: 'Entrées', en: 'Starters', es: 'Entrantes', ar: '' }, icon: '<svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' },
  { id: 2, name: { fr: 'Salades', en: 'Salads', es: 'Ensaladas', ar: '' }, icon: '<svg viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>' },
  { id: 3, name: { fr: 'Plats Principaux', en: 'Main Courses', es: 'Platos Principales', ar: '' }, icon: '<svg viewBox="0 0 24 24"><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"/><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2"/><line x1="12" y1="5" x2="12" y2="19"/></svg>' },
  { id: 4, name: { fr: 'Fruits de Mer', en: 'Seafood', es: 'Mariscos', ar: '' }, icon: '<svg viewBox="0 0 24 24"><path d="M2 16s3-7 10-7 10 7 10 7"/><circle cx="12" cy="9" r="3"/><path d="M12 12v10"/><path d="M8 22h8"/></svg>' },
  { id: 5, name: { fr: 'Grillades', en: 'Grilled Dishes', es: 'Parrilladas', ar: '' }, icon: '<svg viewBox="0 0 24 24"><path d="M12 2v4"/><path d="M8 6h8"/><path d="M6 10c0-3 2.7-5 6-5s6 2 6 5"/><path d="M7 22l2-6h6l2 6"/><path d="M12 16v6"/><path d="M10 10v2"/><path d="M14 10v2"/></svg>' },
  { id: 6, name: { fr: 'Desserts', en: 'Desserts', es: 'Postres', ar: '' }, icon: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-10 10h20A10 10 0 0 0 12 2z"/><path d="M5 14c2 4 5 6 7 6s5-2 7-6"/><path d="M8 9h8"/></svg>' },
  { id: 7, name: { fr: 'Boissons', en: 'Drinks', es: 'Bebidas', ar: '' }, icon: '<svg viewBox="0 0 24 24"><path d="M18 8h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1.5"/><path d="M6 2L4 18c0 2.2 1.8 4 4 4h8c2.2 0 4-1.8 4-4L18 2"/><path d="M12 22v-8"/><path d="M8 10h8"/></svg>' },
];

export async function loadMenuData() {
  try {
    const items = await getMenuItems();
    const cats = await getCategories();
    if (items.length > 0 && cats.length > 0) {
      MENU_DATA = items.map(item => ({
        id: item.id, name: item.name, category_id: item.category_id,
        price: item.price, description: item.description || '',
        tags: item.tags || [], available: item.available,
        popular: item.popular, image: item.image_url || '',
      }));
      CATEGORIES = [
        { id: null, name: '__all__', icon: '' },
        ...cats.map(c => ({ id: c.id, name: c.name, icon: c.icon_svg || '' })),
      ];
    }
  } catch (e) {
    console.warn('Supabase indisponible, utilisation des données locales :', e);
  }
  if (!MENU_DATA.length) MENU_DATA = FALLBACK_MENU;
  if (CATEGORIES.length <= 1) CATEGORIES = FALLBACK_CATS;
  buildCategoryMap();
}

function buildCategoryMap() {
  CATEGORY_MAP.clear();
  CATEGORIES.forEach(c => {
    if (c.id !== null) CATEGORY_MAP.set(c.id, c);
  });
}

function getCategoryName(categoryId) {
  const cat = CATEGORY_MAP.get(categoryId);
  return cat ? localized(cat.name) : '';
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
    <div class="contact-grid">
      <div class="contact-card">
        <div class="contact-info"><h3>${t('contact.addressTitle')}</h3><p>${s.address || '12 Avenue des Saveurs<br/>Tanger, Maroc'}</p></div>
      </div>
      <div class="contact-card">
        <div class="contact-info"><h3>${t('contact.hoursTitle')}</h3><p>${s.hours || 'Lun–Sam : 12h–15h · 19h–23h<br/>Dim : 12h–16h'}</p></div>
      </div>
      <div class="contact-card">
        <div class="contact-info"><h3>${t('contact.phoneTitle')}</h3><a href="tel:${s.phone_raw || '+212630230803'}">${s.phone || '+212 630 230 803'}</a></div>
      </div>
      <div class="contact-card">
        <div class="contact-info"><h3>${t('contact.emailTitle')}</h3><a href="mailto:${s.email || 'contact@fadaerif.ma'}">${s.email || 'contact@fadaerif.ma'}</a></div>
      </div>
      <div class="contact-card">
        <div class="contact-info"><h3>${t('contact.instagramTitle')}</h3><a href="#">${s.instagram || '@fadaerif.marrakech'}</a></div>
      </div>
    </div>
    <div class="google-review-block">
      <div class="google-review-stars">${t('contact.reviewStars')}</div>
      <div class="google-review-score">${t('contact.reviewScore')}</div>
      <div class="google-review-count">${t('contact.reviewCount')}</div>
      <p class="google-review-msg">${t('contact.reviewMsg')}</p>
      <a class="google-review-btn" href="https://maps.app.goo.gl/YVrDEyhoaB1JkEJXA" target="_blank">
        <svg class="google-icon" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
        ${t('contact.reviewBtn')}
      </a>
    </div>`;
}

let cart = [];
let activeFilterId = null;

function $(id) {
  return document.getElementById(id);
}

function qsa(sel, ctx) {
  return (ctx || document).querySelectorAll(sel);
}

let toastTimer;

export function showToast(msg) {
  const t = $('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

export function showPage(name) {
  qsa('.page').forEach(p => p.classList.remove('active'));
  const page = $('page-' + name);
  if (page) page.classList.add('active');

  qsa('.nav-item').forEach(n => n.classList.remove('active'));
  const bn = $('bnav-' + name);
  if (bn) bn.classList.add('active');

  qsa('.desktop-nav-item').forEach(n => n.classList.remove('active'));
  qsa('.desktop-nav-item').forEach(n => {
    if (n.getAttribute('data-page') === name) n.classList.add('active');
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (name === 'admin') {
    document.body.classList.add('admin-mode');
  } else {
    document.body.classList.remove('admin-mode');
  }
}

function renderHomeCats() {
  const el = $('homeCatGrid');
  if (!el) return;
  el.innerHTML = CATEGORIES.slice(1).map(c => `
    <div class="cat-card" data-category-id="${c.id}">
      <span class="cat-label">${localized(c.name)}</span>
    </div>
  `).join('');
}

export function renderFeatured() {
  const el = $('featuredGrid');
  if (!el) return;
  const featured = MENU_DATA.filter(d => d.popular).slice(0, 6);
  el.innerHTML = featured.map(d => dishCard(d)).join('');
  setupReveal();
}

function dishCard(dish) {
  const badges = [];

  badges.push(`<span class="badge badge-category">${getCategoryName(dish.category_id)}</span>`);

  if (!dish.available) {
    badges.push(`<span class="badge badge-unavail">${t('dish.unavailable')}</span>`);
  }

  const imgHtml = dish.image
    ? `<img src="${dish.image}" alt="${localized(dish.name)}" class="dish-img"/>`
    : `<div class="dish-img-placeholder"></div>`;

  return `
  <div class="dish-card" data-id="${dish.id}">
    <div class="dish-img-wrap">
      ${imgHtml}
      ${badges.join('')}
    </div>
    <div class="dish-body">
      <div class="dish-name">${localized(dish.name)}</div>
      <div class="dish-footer">
        <div>
          <span class="dish-price">${t('dish.price', { price: dish.price })}</span>
        </div>
        <div class="dish-actions">
          ${dish.available ? `<button class="add-cart-btn" data-action="cart">+</button>` : ''}
        </div>
      </div>
      ${dish.available
        ? `<button class="wa-btn" data-action="order" style="width:100%;margin-top:10px;justify-content:center;">
        <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.561 4.14 1.541 5.87L0 24l6.268-1.508A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.939 0-3.765-.494-5.353-1.359l-.373-.21-3.863.929.972-3.756-.235-.391A9.963 9.963 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
        ${t('dish.orderBtn')}
      </button>`
        : `<div style="text-align:center;font-size:12px;color:var(--text3);margin-top:10px;padding:8px;background:rgba(255,255,255,.04);border-radius:8px">${t('dish.unavailableMsg')}</div>`}
    </div>
  </div>`;
}

export function renderFilterChips() {
  const el = $('filterChips');
  if (!el) return;
  el.innerHTML = CATEGORIES.map(c => `
    <button class="chip ${activeFilterId === c.id ? 'active' : ''}" data-category-id="${c.id ?? '__all__'}">${c.id === null ? t('filter.all') : localized(c.name)}</button>
  `).join('');
}

function setFilter(id) {
  activeFilterId = id;
  renderFilterChips();
  renderMenuGrid();
}

export function renderMenuGrid(items) {
  if (!items) {
    items = MENU_DATA.filter(d => {
      return activeFilterId === null || d.category_id === activeFilterId;
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
  showToast(t('dish.added', { name: localized(dish.name) }));
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
        <div class="cart-item-name">${localized(item.name)}</div>
        <div class="cart-item-price">${t('dish.price', { price: (item.price * item.qty).toFixed(2) })}</div>
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
  if (totalEl) totalEl.textContent = t('dish.price', { price: total.toFixed(2) });
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

function generateTicket() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const rand = String(Math.floor(Math.random() * 100)).padStart(2, '0');
  return `T-${y}${m}${d}-${hh}${mm}${ss}-${rand}`;
}

function orderWhatsApp(id) {
  const dish = MENU_DATA.find(d => d.id === id);
  if (!dish) return;
  const ticket = generateTicket();
  const msg = t('wa.orderMsg', { name: localized(dish.name), price: dish.price, ticket });
  openWhatsApp(msg);
}

export function checkoutWhatsApp() {
  if (!cart.length) return;
  const ticket = generateTicket();
  const lines = cart.map(c => `${c.qty}x ${localized(c.name)} — ${t('dish.price', { price: (c.price * c.qty).toFixed(2) })}`).join('\n');
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const msg = t('wa.cartMsg', { lines, total: total.toFixed(2), ticket });
  openWhatsApp(msg);
}

function openWhatsApp(msg) {
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

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

function setupMenuEventListeners() {
  $('filterChips')?.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (chip?.dataset.categoryId) {
      const id = chip.dataset.categoryId;
      setFilter(id === '__all__' ? null : Number(id));
    }
  });

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
