(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let target = 0;
  let previousTime = 0;
  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
  }
  function animate(time) {
    const current = window.scrollY;
    const elapsed = previousTime ? Math.min(time - previousTime, 50) : 16;
    previousTime = time;
    target = Math.max(0, Math.min(target, document.documentElement.scrollHeight - window.innerHeight));
    const next = current + (target - current) * (1 - Math.exp(-elapsed / 90));
    window.scrollTo({top: Math.abs(target - next) < .5 ? target : next, behavior: 'instant'});
    if (Math.abs(target - window.scrollY) < .5) stop();
    else frame = requestAnimationFrame(animate);
  }
  window.addEventListener('wheel', event => {
    if (event.defaultPrevented || reduced.matches || event.ctrlKey || event.metaKey || event.shiftKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    // Let embedded feeds, dialogs and other scrolling panels handle their own input.
    if (document.body.classList.contains('editor-open')) return;
    for (let node = event.target instanceof Element ? event.target : null; node && node !== document.body; node = node.parentElement) {
      if (node.matches('.phone-demo, .phone-feed, dialog, input, textarea, select, [contenteditable="true"]')) return;
      if (/(auto|scroll)/.test(getComputedStyle(node).overflowY) && node.scrollHeight > node.clientHeight + 1) return;
    }
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
    if (!frame) target = window.scrollY;
    const limit = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const nextTarget = Math.max(0, Math.min(limit, target + delta));
    if (nextTarget === target && !frame) return;
    event.preventDefault();
    target = nextTarget;
    if (!frame) frame = requestAnimationFrame(animate);
  }, {passive: false});
  window.addEventListener('pointerdown', stop, {passive: true});
  window.addEventListener('touchstart', stop, {passive: true});
  window.addEventListener('keydown', event => {
    if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' ','Escape'].includes(event.key)) stop();
  });
  window.addEventListener('hashchange', stop);
  window.addEventListener('pagehide', stop);
  reduced.addEventListener('change', stop);
})();
