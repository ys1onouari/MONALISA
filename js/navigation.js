import { showPage, openCart, closeCart, checkoutWhatsApp } from './menu.js';

function $(id) {
  return document.getElementById(id);
}

export function initNavigation() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-page]');
    if (target) {
      e.preventDefault();
      showPage(target.dataset.page);
    }
  });

  $('cartOpenBtn')?.addEventListener('click', openCart);
  $('cartOverlay')?.addEventListener('click', closeCart);
  $('cartCloseBtn')?.addEventListener('click', closeCart);

  $('checkoutBtn')?.addEventListener('click', checkoutWhatsApp);
}
