(() => {
  'use strict';
  const article=document.getElementById('interactive');
  const buttons=[...article.querySelectorAll('[data-background]')];
  function select(theme){
    if(theme!=='light'&&theme!=='dark')return;
    article.dataset.theme=theme;
    buttons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.background===theme)));
    document.dispatchEvent(new Event('brain:themechange'));
  }
  buttons.forEach(button=>button.addEventListener('click',()=>select(button.dataset.background)));
  const session=window.BRAIN_READING_SESSION;
  if(session?.pending)select(session.saved?.theme);
})();
