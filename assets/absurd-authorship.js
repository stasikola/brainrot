(() => {
  'use strict';
  window.mountBrainAbsurdAuthorship = (section, body, paragraphs) => {
    const make = (tag, cls, text) => {
      const node = document.createElement(tag);
      node.className = cls;
      if (text) node.textContent = text;
      return node;
    };
    const facts = ['Но промпт написал ты', 'Из двадцати вариантов этот выбрал ты', 'Звук погромче добавил ты', 'Опубликовал тоже ты'];
    const stage = make('div', 'authorship-stage');
    const button = make('button', 'authorship-denial', 'Это не я, это нейросеть');
    button.type = 'button';
    button.dataset.text = button.textContent;
    button.setAttribute('aria-label', button.textContent);
    const field = make('div', 'authorship-facts');
    field.setAttribute('aria-live', 'polite');
    field.setAttribute('aria-relevant', 'additions');
    stage.append(field, button);
    const copy = body.querySelector('.visual-copy');
    const textCopy = make('div', 'visual-copy');
    textCopy.append(...paragraphs);
    copy.after(stage, textCopy);
    let count = 0;
    const enter = () => {
      if (stage.dataset.entered === 'true') return;
      stage.dataset.entered = 'true';
      button.classList.add('is-entering');
      observer?.disconnect();
    };
    let observer = null;
    if ('IntersectionObserver' in window) {
      stage.dataset.entered = 'false';
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) enter();
      }, { threshold: 0.5 });
      observer.observe(button);
    } else enter();
    const reveal = () => {
      if (count === facts.length) {
        field.replaceChildren();
        count = 0;
      } else {
        const fact = make('div', 'authorship-fact', facts[count]);
        fact.dataset.text = facts[count];
        fact.dataset.position = String(count);
        field.append(fact);
        count += 1;
      }
      button.classList.remove('is-glitching');
      void button.offsetWidth;
      button.classList.add('is-glitching');
    };
    button.addEventListener('focus', enter);
    button.addEventListener('click', reveal);
    section.brainAbsurdAuthorshipDispose = () => {
      button.removeEventListener('click', reveal);
      button.removeEventListener('focus', enter);
      observer?.disconnect();
      copy.append(...paragraphs);
      textCopy.remove();
      stage.remove();
      delete section.brainAbsurdAuthorshipDispose;
    };
  };
})();
