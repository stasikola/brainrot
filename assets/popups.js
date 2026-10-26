(() => {
  'use strict';
  const article = document.getElementById('interactive');
  function syncTheme() {
    document.body.dataset.popupTheme = article.dataset.theme || 'default';
  }
  syncTheme();
  document.addEventListener('brain:themechange', syncTheme);
})();
