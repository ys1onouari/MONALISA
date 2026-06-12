import {
  getCategories, addCategory, updateCategory, deleteCategory,
  getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem, uploadImage,
  getSettings, upsertSettings,
} from './supabase.js';
import { supabaseReady } from './supabase.js';
import { loadMenuData, renderFeatured, renderFilterChips, renderMenuGrid, renderContact, showToast } from './menu.js';

/* --- Init --- */
let items = [];
let cats = [];

export async function initAdmin() {
  [items, cats] = await Promise.all([getMenuItems(), getCategories()]);
  renderAll();
  bindEvents();
}

function $(id) { return document.getElementById(id); }

/* --- Render --- */
function renderAll() {
  renderItems();
  renderCats();
}

function renderItems() {
  const tbody = $('adminItemsBody');
  if (!tbody) return;
  tbody.innerHTML = items.map(item => {
    const img = item.image_url
      ? `<img src="${item.image_url}" class="item-img" alt="${item.name}"/>`
      : `<div class="item-img-placeholder"></div>`;
    return `<tr>
      <td>${img}</td>
      <td><strong style="color:var(--text)">${item.name}</strong></td>
      <td>${item.category}</td>
      <td>${item.price} DH</td>
      <td><span class="badge-dot ${item.available ? 'on' : 'off'}"></span></td>
      <td>
        <button class="admin-action-btn edit" data-edit-item="${item.id}" title="Modifier">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="admin-action-btn delete" data-delete-item="${item.id}" title="Supprimer">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>
      </td>
    </tr>`;
  }).join('');
}

function renderCats() {
  const tbody = $('adminCatsBody');
  if (!tbody) return;
  tbody.innerHTML = cats.map(cat => `
    <tr>
      <td><strong style="color:var(--text)">${cat.name}</strong></td>
      <td>${cat.sort_order ?? '-'}</td>
      <td>
        <button class="admin-action-btn edit" data-edit-cat="${cat.id}" title="Modifier">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="admin-action-btn delete" data-delete-cat="${cat.id}" title="Supprimer">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>
      </td>
    </tr>`
  ).join('');
}

/* --- Modal --- */
const overlay = $('adminModalOverlay');
const content = $('adminModalContent');

function openModal(html) {
  content.innerHTML = html;
  overlay.classList.add('open');
}

function closeModal() {
  overlay.classList.remove('open');
}

overlay?.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});

/* --- Forms --- */
function itemFormHtml(item) {
  const isEdit = !!item;
  return `<h2>${isEdit ? 'Modifier' : 'Nouveau'} plat</h2>
    <form id="adminItemForm">
      <div class="form-group">
        <label>Nom</label><input name="name" value="${item?.name ?? ''}" required/>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Catégorie</label>
          <select name="category" required>
            ${cats.map(c => `<option value="${c.name}" ${item?.category === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Prix (DH)</label>
          <input name="price" type="number" step="0.5" min="0" value="${item?.price ?? ''}" required/>
        </div>
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea name="description">${item?.description ?? ''}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Image</label>
          <div class="admin-upload">
            <input name="image" type="file" accept="image/*" id="adminFileInput" ${isEdit ? '' : 'required'}/>
            <label for="adminFileInput" class="admin-upload-label">Choisir une image</label>
            ${item?.image_url ? `<img src="${item.image_url}" class="image-preview show" id="adminPreview"/>` : '<img class="image-preview" id="adminPreview"/>'}
          </div>
        </div>
        <div class="form-group">
          <label>Disponibilité</label>
          <div class="toggle-wrap">
            <button type="button" class="toggle ${item?.available !== false ? 'on' : ''}" id="adminAvailToggle"></button>
            <span class="toggle-label">${item?.available !== false ? 'Disponible' : 'Indisponible'}</span>
          </div>
        </div>
      </div>
      <div class="form-actions">
        <button type="button" class="btn-cancel" data-admin-close>Annuler</button>
        <button type="submit" class="btn-save">${isEdit ? 'Enregistrer' : 'Ajouter'}</button>
      </div>
    </form>`;
}

function catFormHtml(cat) {
  const isEdit = !!cat;
  return `<h2>${isEdit ? 'Modifier' : 'Nouvelle'} catégorie</h2>
    <form id="adminCatForm">
      <div class="form-group"><label>Nom</label><input name="name" value="${cat?.name ?? ''}" required/></div>
      <div class="form-group"><label>Ordre</label><input name="sortOrder" type="number" min="0" value="${cat?.sort_order ?? ''}"/></div>
      <div class="form-actions">
        <button type="button" class="btn-cancel" data-admin-close>Annuler</button>
        <button type="submit" class="btn-save">${isEdit ? 'Enregistrer' : 'Ajouter'}</button>
      </div>
    </form>`;
}

/* --- Event binding --- */
function bindEvents() {

  document.querySelectorAll('[data-admin-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-admin-view]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.admin-view').forEach(v => v.classList.remove('active'));
      document.querySelector(`.admin-view[data-admin-view="${btn.dataset.adminView}"]`)?.classList.add('active');
    });
  });

  $('adminAddItemBtn')?.addEventListener('click', () => {
    openModal(itemFormHtml());
    setupItemForm();
  });

  $('adminAddCatBtn')?.addEventListener('click', () => {
    openModal(catFormHtml());
    setupCatForm();
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-admin-close]')) closeModal();
  });

  document.addEventListener('click', async (e) => {
    const ei = e.target.closest('[data-edit-item]');
    if (ei) {
      const id = Number(ei.dataset.editItem);
      const item = items.find(i => i.id === id);
      if (item) { openModal(itemFormHtml(item)); setupItemForm(item); }
      return;
    }
    const di = e.target.closest('[data-delete-item]');
    if (di) {
      const id = Number(di.dataset.deleteItem);
      if (confirm('Supprimer ce plat ?')) { await deleteMenuItem(id); await refresh(); }
      return;
    }
    const ec = e.target.closest('[data-edit-cat]');
    if (ec) {
      const id = Number(ec.dataset.editCat);
      const cat = cats.find(c => c.id === id);
      if (cat) { openModal(catFormHtml(cat)); setupCatForm(cat); }
      return;
    }
    const dc = e.target.closest('[data-delete-cat]');
    if (dc) {
      const id = Number(dc.dataset.deleteCat);
      if (confirm('Supprimer cette catégorie ?')) { await deleteCategory(id); await refresh(); }
    }
  });
}

function setupItemForm(item) {
  const form = document.getElementById('adminItemForm');
  if (!form) return;
  const toggle = document.getElementById('adminAvailToggle');
  const label = toggle?.nextElementSibling;
  let available = item?.available !== false;

  toggle?.addEventListener('click', () => {
    available = !available;
    toggle.classList.toggle('on', available);
    label.textContent = available ? 'Disponible' : 'Indisponible';
  });

  const fileInput = form.querySelector('input[type="file"]');
  const fileLabel = document.querySelector('label[for="adminFileInput"]');
  fileInput?.addEventListener('change', () => {
    const preview = document.getElementById('adminPreview');
    if (preview && fileInput.files[0]) {
      preview.src = URL.createObjectURL(fileInput.files[0]);
      preview.classList.add('show');
    }
    if (fileLabel && fileInput.files[0]) {
      fileLabel.textContent = fileInput.files[0].name;
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    let imageUrl = item?.image_url || '';
    const file = fd.get('image');
    if (file && file.size > 0) imageUrl = await uploadImage(file);
    const payload = {
      name: fd.get('name'), category: fd.get('category'),
      price: Number(fd.get('price')), description: fd.get('description') || '',
      available, image_url: imageUrl,
    };
    if (item) await updateMenuItem(item.id, payload);
    else await addMenuItem(payload);
    closeModal();
    await refresh();
  });
}

function setupCatForm(cat) {
  const form = document.getElementById('adminCatForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = fd.get('name');
    const sortOrder = fd.get('sortOrder') ? Number(fd.get('sortOrder')) : 0;
    if (cat) await updateCategory(cat.id, { name, sort_order: sortOrder });
    else await addCategory(name, '', sortOrder);
    closeModal();
    await refresh();
  });
}

async function refresh() {
  [items, cats] = await Promise.all([getMenuItems(), getCategories()]);
  renderAll();
  await loadMenuData();
  renderFeatured();
  renderFilterChips();
  renderMenuGrid();
  loadConfig();
}

/* --- Config --- */
let configData = {};
const CONFIG_KEYS = ['restaurant_name','restaurant_subtitle','address','hours','phone','phone_raw','email','instagram','wa_number'];

async function loadConfig() {
  try {
    configData = await getSettings();
    const form = document.getElementById('adminConfigForm');
    if (!form) return;
    CONFIG_KEYS.forEach(key => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) input.value = configData[key] || '';
    });
  } catch (e) {
    console.warn('Échec du chargement de la configuration :', e);
  }
}

$('adminSaveConfig')?.addEventListener('click', async () => {
  const form = document.getElementById('adminConfigForm');
  if (!form) return;
  const fd = new FormData(form);
  const updates = {};
  CONFIG_KEYS.forEach(key => { updates[key] = fd.get(key) || ''; });
  try {
    await upsertSettings(updates);
    configData = updates;
    const { loadSettings } = await import('./menu.js');
    await loadSettings();
    renderContact();
    showToast('Configuration enregistrée');
  } catch (e) {
    showToast('Erreur : ' + e.message);
  }
});

/* --- Logout --- */
$('adminLogoutBtn')?.addEventListener('click', async () => {
  const supabase = await supabaseReady;
  await supabase.auth.signOut();
  window.location.reload();
});
