(() => {
  'use strict';
  const root = document.getElementById('interactive');
  const picker = document.getElementById('visualPicker');
  const backdrop = document.getElementById('visualBackdrop');
  const options = document.getElementById('visualOptions');
  const triggers = [...root.querySelectorAll('[data-visual-block]')];
  let active = null;
  const heroTrigger=document.getElementById('heroStartTrigger');
  const heroPresets=[{title:'Название в движении',kind:'start-research',image:'assets/figma/hero-research.gif',detail:'Три слова появляются при прокрутке'},{title:'Взгляд изнутри',kind:'start-explain',image:'assets/figma/brain-scans.png',detail:'Заголовок и снимки мозга'},{title:'Абсурд',kind:'start-absurd',image:'assets/figma/hero-absurd.gif',detail:'Слова появляются и гаснут вокруг мозга'}];
  const presets = [
    [{title:'Слово как диагноз',kind:'word',detail:'Термин и его история'}, {title:'Слово и объяснение',kind:'definition',detail:'Текстовый блок из макета'}, {title:'Слово — абсурд',kind:'absurd-word',detail:'Зелёное окно · текст печатается по буквам'}],
    [{title:'Бесконечная лента',kind:'phone',detail:'Три видео · листайте вверх и вниз'}, {title:'Поток образов',kind:'feed',image:'assets/figma/feed.png',detail:'Лента из макета'}, {title:'Лента, которая пишет себя',kind:'absurd-feed',detail:'Текст печатается и исчезает при прокрутке'}],
    [{title:'Что говорят данные',kind:'chart',detail:'Поведение зрителей и восприятие ИИ'}, {title:'Кто здесь автор?',kind:'authorship',image:'assets/figma/authorship.png',detail:'Иллюстрация из макета'}, {title:'Это не я, это нейросеть',kind:'absurd-authorship',detail:'Абсурд · каждое нажатие оставляет след'}],
    [{title:'Каждый становится участником',kind:'people',image:'assets/people/00-restored.webp',detail:'Подсветка людей при наведении'}, {title:'Сообщество создаёт смысл',kind:'community',image:'assets/figma/community.png',detail:'Иллюстрация из макета'}, {title:'У мема своя жизнь',kind:'absurd-community',image:'assets/absurd/community-cups.webp',detail:'Персонажи, которым интернет придумал историю'}]
  ];
  function image(src,alt){ const img = document.createElement('img'); img.src = src; img.alt = alt; img.decoding = 'async'; return img; }
  function element(tag,className,text){const el = document.createElement(tag);if(className) el.className=className;if(text)el.textContent=text;return el;}
  function word(){const el=element('div','visual-brain');el.append(element('strong','', 'BRAINROT'), element('small','','1854 → 2024\nОт «Уолдена» до слова года'));return el;}
  function miniChart(){const el=element('div','chart-mini evidence-mini');el.append(element('small','','Внимание ≠ доверие'),element('strong','','408'),element('span','','аккаунтов в исследовании Instagram'));return el;}
  function preview(preset){
    if(preset.kind.startsWith('start-')){const el=element('div','start-preview '+preset.kind.replace('start-','start-preview-'));el.append(image(preset.kind==='start-absurd'?'assets/figma/hero-absurd-still.png':preset.image,''));const title=element('strong');if(preset.kind==='start-absurd'){['Мозг.','Гниёт.','Красиво.'].forEach(text=>title.append(element('span','',text)));}else{title.innerHTML=preset.kind==='start-research'?'Мозг.':'Мозг.<br>Гниёт.<br>Красиво.';}el.append(title);return el;}
    if(preset.kind==='absurd-feed'){const card=element('div','absurd-preview');card.append(element('span','absurd-preview-search','⌕  Поиск'),element('strong','','Лента, которую некому заполнить'),element('small','','Текст появляется. Лента остаётся.'));return card;}
    if(preset.kind==='absurd-authorship'){const el=element('div','authorship-preview');el.append(element('span','','Это не я, это нейросеть'),element('small','','Но промпт написал ты'));return el;}
    if(preset.kind==='word')return word();
    if(preset.kind==='absurd-word'){const el=element('div','absurd-word-preview');el.append(element('small','','1854 → 2026'),element('strong','','Слово, которое стало диагнозом эпохи'),element('span','','‹  ›'));return el;}
    if(preset.kind==='chart')return miniChart();
    if(preset.kind==='definition'){const el=element('div','definition-preview');el.append(element('strong','','Слово, которое стало официальным диагнозом эпохи'),element('span','','От Торо до бесконечной ленты.'));return el;}
    if(preset.kind==='phone'){const img=image('assets/figma/phone-frame.png','Телефон');img.className='phone-thumbnail';return img;}
    return image(preset.image,preset.title);
  }
  function close(restore=true){
    const previous=active; active=null;picker.hidden=true;backdrop.hidden=true;
    document.body.classList.remove('editor-open');
    document.querySelectorAll('body > section').forEach(s=>{s.inert=false;});
    if(previous){previous.setAttribute('aria-expanded','false');previous.closest('.reveal-section')?.querySelector('.section-visual-trigger')?.setAttribute('aria-expanded','false');if(restore){const target=previous.hidden?previous.closest('.reveal-section').querySelector('.visual-slot'):previous;target?.focus({preventScroll:true});}}
  }
  function show(trigger){
    if(active)return;
    active=trigger; const i=Number(trigger.dataset.visualBlock);options.replaceChildren();
    const isHero=trigger===heroTrigger;
    document.getElementById('visualPickerHeading').textContent=isHero?'Выберите стартовый экран':'Выберите иллюстрацию';
    (isHero?heroPresets:presets[i]).forEach((preset,j)=>{
      const button=element('button','visual-option');button.type='button';button.setAttribute('aria-pressed',String(trigger.dataset.selected===String(j)));
      const labels={'start-research':'Анимация при прокрутке','start-explain':'Иллюстрация','start-absurd':'Анимация',word:'Типографика',definition:'Текст', 'absurd-word':'Анимация текста',phone:'Видео',feed:'Иллюстрация','absurd-feed':'Анимация при прокрутке',chart:'Интерактивная статистика',authorship:'Иллюстрация','absurd-authorship':'Интерактивная анимация',people:'Интерактивная фотография',community:'Иллюстрация','absurd-community':'Иллюстрация'};
      const frame=element('span','visual-option-preview');frame.setAttribute('aria-hidden','true');frame.append(preview(preset));
      const caption=element('span','visual-option-caption',labels[preset.kind]||'Иллюстрация');
      button.append(frame,caption);button.addEventListener('click',()=>{
        if(isHero){mountHero(preset);trigger.dataset.selected=String(j);close();}
        else{mount(trigger,preset);trigger.dataset.selected=String(j);trigger.hidden=true;close(false);const heading=trigger.closest('.reveal-section').querySelector('h2');heading.tabIndex=-1;heading.focus({preventScroll:true});}
      });options.append(button);
    });
    trigger.setAttribute('aria-expanded','true');trigger.closest('.reveal-section')?.querySelector('.section-visual-trigger')?.setAttribute('aria-expanded','true');picker.hidden=false;backdrop.hidden=false;
    document.body.classList.add('editor-open');document.querySelectorAll('body > section').forEach(s=>{s.inert=true;});
    picker.querySelector('.editor-close').focus({preventScroll:true});
  }
  function mount(trigger,preset){
    const section=trigger.closest('.reveal-section'); const body=section.querySelector('.section-body');
    section.brainWordDispose?.();
    section.brainAbsurdDispose?.();
    section.brainAbsurdWordDispose?.();
    section.brainAbsurdAuthorshipDispose?.();
    section.classList.add('visual-selected');
    section.dataset.visualKind=preset.kind;
    // Reuse the article nodes; remove the previous composition before rebuilding it.
    body.querySelectorAll('.phone-demo').forEach(phone=>phone.brainFeedDispose?.());
    const heading=body.querySelector('h2');
    const paragraphs=[...body.querySelectorAll('p')].filter(el=>!el.closest('.visual-slot'));
    const copy=element('div','visual-copy');copy.append(heading,...paragraphs);
    body.replaceChildren(copy);
    if(preset.kind==='absurd-feed'){window.mountBrainAbsurdFeed(section,body,paragraphs);return;}
    if(preset.kind==='absurd-authorship'){window.mountBrainAbsurdAuthorship(section,body,paragraphs);return;}
    if(preset.kind==='definition')return;
    if(preset.kind==='absurd-word'){window.mountBrainAbsurdWord(section,body,paragraphs);return;}
    const slot=element('div','visual-slot');
    slot.tabIndex=0;
    slot.setAttribute('role',['people','chart','definition','phone'].includes(preset.kind)?'group':'button');
    slot.setAttribute('aria-label','Изменить иллюстрацию');
    slot.setAttribute('aria-haspopup','dialog');
    slot.setAttribute('aria-controls','visualPicker');
    slot.addEventListener('click',event=>{
      if(event.target.closest('.phone-feed,.evidence-chart,.word-specimen'))return;
      const control=event.target.closest('button:not(.people-focus),a,input,select,textarea,[role="button"]');
      if(control&&control!==slot)return;
      event.preventDefault();event.stopPropagation();show(trigger);
    },true);
    slot.addEventListener('keydown',event=>{
      if(event.target===slot&&(event.key==='Enter'||event.key===' ')){event.preventDefault();show(trigger);}
    });
    const figure=element('figure');slot.append(figure);
    if(preset.kind==='phone')body.prepend(slot);
    else if(preset.kind==='chart')copy.querySelector('h2').after(slot);
    else if(preset.kind==='word'){
      const row=element('div','word-layout');const paragraphs=element('div','word-copy');
      [...copy.children].filter(el=>el.tagName!=='H2').forEach(el=>paragraphs.append(el));
      row.append(slot,paragraphs);copy.append(row);paragraphs.hidden=true;paragraphs.id='wordArticleCopy';slot.setAttribute('role','group');slot.removeAttribute('aria-haspopup');slot.removeAttribute('aria-controls');
    }else body.prepend(slot);
    if(preset.kind==='word'){
      const button=element('button','word-specimen');button.type='button';const label=element('span','','BRAINROT');button.append(label);button.setAttribute('aria-label','BRAINROT — открыть текст раздела');button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls','wordArticleCopy');figure.append(button);
      const row=copy.querySelector('.word-layout'),text=row.querySelector('.word-copy');
      [...text.querySelectorAll(':scope>p')].forEach((p,i)=>p.style.setProperty('--paragraph-delay',(i*.75)+'s'));
      function fit(){if(slot.hidden)return;label.style.fontSize='100px';const width=label.getBoundingClientRect().width;if(width)label.style.fontSize=(button.clientWidth/width*98)+'px';}
      const resize=new ResizeObserver(fit);resize.observe(button);document.fonts.ready.then(fit);document.addEventListener('brain:fontchange',fit);
      function reveal(animate=true){section.dataset.wordOpened='true';text.hidden=false;slot.hidden=true;row.classList.toggle('word-revealed',animate);button.setAttribute('aria-expanded','true');if(animate){text.tabIndex=-1;text.focus({preventScroll:true});document.dispatchEvent(new Event('brain:wordchange'));}}
      button.addEventListener('click',()=>reveal());
      if(window.BRAIN_READING_SESSION?.pending&&window.BRAIN_READING_SESSION.saved?.wordOpened)reveal(false);else section.dataset.wordOpened='false';
      section.brainWordDispose=()=>{resize.disconnect();document.removeEventListener('brain:fontchange',fit);delete section.dataset.wordOpened;delete section.brainWordDispose;};
    }
    else if(preset.kind==='people')crowd(figure);
    else if(preset.kind==='chart')chart(figure);
    else if(preset.kind==='phone'){
      const phone=element('div','phone-demo');phone.append(image('assets/figma/phone-frame.png','Рамка телефона из макета'));
      figure.append(phone);window.createBrainVideoFeed(phone);
    }else{
      const frame=element('div',preset.kind==='feed'?'visual-feed':preset.kind==='authorship'?'visual-authorship':'visual-frame');
      const img=image(preset.image,preset.title);img.className='visual-photo';frame.append(img);figure.append(frame);
    }
  }
  let scrollHero=null, heroFrame=0;
  const reducedHero=window.matchMedia('(prefers-reduced-motion: reduce)');
  function updateAbsurdImage(){
    const img=root.querySelector('.start-absurd .start-scene>img');
    if(img)img.src=reducedHero.matches?'assets/figma/hero-absurd-still.png':'assets/figma/hero-absurd.gif';
  }
  function updateHero(){
    heroFrame=0;if(!scrollHero||reducedHero.matches)return;
    const bounds=scrollHero.getBoundingClientRect();
    const duration=scrollHero.offsetHeight-window.innerHeight;
    const progress=Math.max(0,Math.min(1,-bounds.top/Math.max(1,duration)));
    [...heroTrigger.children].forEach((word,index)=>{
      const start=index*.33;
      const enter=Math.max(0,Math.min(1,(progress-start)/.16));
      const exit=index===2?0:Math.max(0,Math.min(1,(progress-(start+.23))/.10));
      word.style.opacity=String(enter*(1-exit));
      word.style.transform='translateY(calc(-50% + '+((1-enter)*40-exit*40)+'px))';
    });
  }
  function queueHero(){if(!heroFrame)heroFrame=requestAnimationFrame(updateHero);}
  function mountHero(preset,restore=false){
    const hero=root.querySelector('.reveal-hero');
    const title=document.getElementById('interactiveTitle');
    const dek=hero.querySelector('.hero-dek');
    scrollHero=null;
    hero.className='reveal-hero start-selected '+preset.kind;
    const scene=element('div','start-scene');scene.append(image(preset.image,preset.kind==='start-research'?'Человек на фоне оранжевого диска':preset.kind==='start-absurd'?'Синий мозг на чёрном фоне':'Снимки мозга'));
    heroTrigger.replaceChildren();
    ['Мозг.','Гниёт.','Красиво.'].forEach(text=>heroTrigger.append(element('span',preset.kind==='start-research'?'start-word':'',text)));
    scene.append(title);
    if(preset.kind==='start-research'){
      const sequence=element('div','start-scroll');sequence.append(scene);hero.replaceChildren(sequence,dek);scrollHero=sequence;
    }else if(preset.kind==='start-absurd'){hero.replaceChildren(scene,dek);updateAbsurdImage();}
    else{scene.append(dek);hero.replaceChildren(scene);}
    if(!restore)hero.scrollIntoView({behavior:'instant',block:'start'});queueHero();
  }
  heroTrigger.addEventListener('click',()=>show(heroTrigger));
  window.addEventListener('scroll',queueHero,{passive:true});
  window.addEventListener('resize',queueHero);
  reducedHero.addEventListener('change',queueHero);
  reducedHero.addEventListener('change',updateAbsurdImage);
  triggers.forEach(trigger=>{
    trigger.addEventListener('click',()=>show(trigger));
    const heading=trigger.closest('.reveal-section').querySelector('h2');
    const button=element('button','section-visual-trigger');button.type='button';
    button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls','visualPicker');button.setAttribute('aria-expanded','false');
    button.title='Выбрать иллюстрацию к разделу';
    button.append(...heading.childNodes);heading.append(button);
    button.addEventListener('click',()=>show(trigger));
  });
  picker.querySelector('.editor-close').addEventListener('click',()=>close());
  backdrop.addEventListener('click',()=>close());
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&active){event.preventDefault();close();}});
  picker.addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;const buttons=[...picker.querySelectorAll('button')];const first=buttons[0],last=buttons[buttons.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  const positions=[[.055,.11],[.19,.01],[.21,.16],[.33,.04],[.4,.24],[.51,.09],[.58,.24],[.65,.09],[.83,.20],[.85,.01],[.995,.175],[.81,.36],[.985,.39],[.99,.655],[.77,.58],[.75,.96],[.51,.78],[.245,.79],[.33,.44],[.12,.30],[.045,.55],[.53,.44],[.99,.97]];
  const map=window.BRAIN_PEOPLE_MAP;
  const pixels=Uint8Array.from(atob(map.pixels),c=>c.charCodeAt(0));
  const peopleCache=[];
  let preloaded=false;
  function preloadPeople(){if(preloaded)return;preloaded=true;for(let n=1;n<=23;n++){const img=new Image();img.src=personSource(n);peopleCache.push(img);}}
  function personSource(n){return 'assets/people/'+(n?String(n).padStart(2,'0'):'00-restored')+'.webp';}
  function crowd(figure){
    const stage=element('div','people-stage');const img=image(personSource(0),'Зрители в стереоочках. Выберите человека, чтобы выделить его красным.');
    img.width=1200;img.height=716;stage.append(img);figure.append(stage);
    let selected=0, shown=0;
    const display=n=>{if(shown!==n){shown=n;img.src=personSource(n);}};
    const at=event=>{const r=stage.getBoundingClientRect();const x=Math.max(0,Math.min(map.width-1,Math.floor((event.clientX-r.left)/r.width*map.width)));const y=Math.max(0,Math.min(map.height-1,Math.floor((event.clientY-r.top)/r.height*map.height)));return pixels[y*map.width+x];};
    stage.addEventListener('pointermove',event=>{if(event.pointerType==='mouse'){const n=at(event);display(n||selected);stage.style.cursor=n?'pointer':'default';}});
    stage.addEventListener('pointerleave',()=>display(selected));
    stage.addEventListener('click',event=>{const n=at(event);selected=selected===n?0:n;display(selected);});
    positions.forEach(([x,y],i)=>{
      const button=element('button','people-focus');button.type='button';button.setAttribute('aria-label','Выделить человека '+(i+1));button.style.left=(Math.min(.975,Math.max(.025,x))*100)+'%';button.style.top=(Math.min(.975,Math.max(.025,y))*100)+'%';
      button.addEventListener('focus',()=>display(i+1));button.addEventListener('blur',()=>display(selected));
      button.addEventListener('click',event=>{event.stopPropagation();selected=selected===i+1?0:i+1;display(selected);});stage.append(button);
    });
    if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){preloadPeople();observer.disconnect();}},{rootMargin:'300px'});observer.observe(stage);}else preloadPeople();
  }
  function chart(figure){window.createBrainEvidenceChart(figure);}
  const readingSession=window.BRAIN_READING_SESSION;
  if(readingSession?.pending){
    const saved=readingSession.saved;
    if(Number.isInteger(saved.hero)&&heroPresets[saved.hero]){mountHero(heroPresets[saved.hero],true);heroTrigger.dataset.selected=String(saved.hero);}
    for(const item of saved.visuals||[]){
      const trigger=triggers.find(t=>Number(t.dataset.visualBlock)===item.block);
      const preset=presets[item.block]?.[item.choice];
      if(trigger&&preset){mount(trigger,preset);trigger.dataset.selected=String(item.choice);trigger.hidden=true;}
    }
  }
})();
