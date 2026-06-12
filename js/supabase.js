import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

let _supabase = null;

async function getClient() {
  if (!_supabase) {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _supabase;
}

/* ---- expose supabase as a promise for convenience ---- */
export const supabaseReady = getClient();

export async function getCategories() {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data;
}

export async function addCategory(name, iconSvg, sortOrder) {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from('categories')
    .insert({ name, icon_svg: iconSvg, sort_order: sortOrder })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id, updates) {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id) {
  const supabase = await getClient();
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function getMenuItems() {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('id', { ascending: true });
  if (error) throw error;
  return data;
}

export async function addMenuItem(item) {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from('menu_items')
    .insert(item)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateMenuItem(id, updates) {
  const supabase = await getClient();
  const { data, error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMenuItem(id) {
  const supabase = await getClient();
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function uploadImage(file) {
  const supabase = await getClient();
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const resized = await resizeImage(file, 800);
  const { data, error } = await supabase.storage
    .from('dish-images')
    .upload(fileName, resized, {
      contentType: 'image/jpeg',
      upsert: false,
    });
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage
    .from('dish-images')
    .getPublicUrl(data.path);
  return publicUrl;
}

async function resizeImage(file, maxWidth) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.width;
      let h = img.height;
      if (w > maxWidth) {
        h = h * (maxWidth / w);
        w = maxWidth;
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Redimensionnement échoué'));
      }, 'image/jpeg', 0.8);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/* --- Settings --- */
export async function getSettings() {
  const supabase = await getClient();
  const { data, error } = await supabase.from('settings').select('*');
  if (error) throw error;
  const map = {};
  data.forEach(r => { map[r.key] = r.value; });
  return map;
}

export async function upsertSettings(settings) {
  const supabase = await getClient();
  const entries = Object.entries(settings);
  const rows = entries.map(([key, value]) => ({ key, value }));
  const { error } = await supabase.from('settings').upsert(rows, { onConflict: 'key' });
  if (error) throw error;
}
