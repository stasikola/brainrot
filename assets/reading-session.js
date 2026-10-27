(() => {
  'use strict';
  const key='brainrot-reading-session-v1:'+location.pathname;
  let saved=null;
  try{saved=JSON.parse(sessionStorage.getItem(key)||'null');}catch(_){/* Storage may be disabled. */}
  if(!saved){try{saved=history.state?.brainReadingSession||null;}catch(_){}}
  const navigation=performance.getEntriesByType('navigation')[0];
  const restoring=navigation?.type==='reload'&&saved&&Number.isFinite(saved.y);
  const state=window.BRAIN_READING_SESSION={pending:!!restoring,saved:restoring?saved:null};
  if(restoring&&'scrollRestoration' in history)history.scrollRestoration='manual';
  let timer;
  state.restart = () => {
    // Freeze autosave before reloading so pagehide cannot restore the old choices.
    state.pending = true;
    clearTimeout(timer);
    document.activeElement?.blur();
    if('scrollRestoration' in history)history.scrollRestoration='manual';
    const article = document.getElementById('interactive');
    const clean = {restart:true,y: article ? article.getBoundingClientRect().top + window.scrollY : 0};
    try{sessionStorage.removeItem(key);sessionStorage.setItem(key,JSON.stringify(clean));}catch(_){}
    try{history.replaceState({...history.state,brainReadingSession:clean},'',location.pathname+location.search+'#interactive');}catch(_){}
    location.reload();
  };
  function save(){
    if(state.pending)return;
    const root=document.getElementById('interactive');if(!root)return;
    const fragments=[...root.querySelectorAll('[data-fragment][data-position]')].map(el=>({id:el.dataset.fragment,position:el.dataset.position,text:el.textContent}));
    const visuals=[...root.querySelectorAll('[data-visual-block][data-selected]')].map(el=>({block:Number(el.dataset.visualBlock),choice:Number(el.dataset.selected)}));
    const hero=root.querySelector('#heroStartTrigger');
    const chart=root.querySelector('.evidence-chart');
    const data={wordOpened:root.querySelector('[data-visual-kind="word"]')?.dataset.wordOpened==='true',videoIndex:Number(root.querySelector('.phone-demo')?.dataset.videoIndex)||0,y:window.scrollY,theme:root.dataset.theme||null,titleFont:root.dataset.titleFont||null,headingFont:root.dataset.headingFont||null,bodyFont:root.dataset.bodyFont||null,fragments,visuals,hero:hero?.hasAttribute('data-selected')?Number(hero.dataset.selected):null,chart:chart?{axis:chart.dataset.axis,study:chart.dataset.study,trust:chart.dataset.trust,platform:chart.dataset.platform}:null};
    try{sessionStorage.setItem(key,JSON.stringify(data));}catch(_){}
    try{history.replaceState({...history.state,brainReadingSession:data},'');}catch(_){}
  }
  window.addEventListener('scroll',()=>{clearTimeout(timer);timer=setTimeout(save,150);},{passive:true});
  window.addEventListener('pagehide',save);
  document.addEventListener('brain:themechange',save);
  document.addEventListener('brain:fontchange',save);
  document.addEventListener('brain:videochange',save);
  document.addEventListener('brain:chartchange',save);
  document.addEventListener('brain:wordchange',save);
  window.addEventListener('beforeunload',save);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')save();});
  document.addEventListener('DOMContentLoaded',()=>{
    if(!restoring)return;
    for(const item of saved.fragments||[]){
      const el=[...document.querySelectorAll('#interactive [data-fragment]')].find(node=>node.dataset.fragment===item.id);
      if(el&&['0','1','2'].includes(item.position)&&typeof item.text==='string'){
        // Older reading sessions may still contain ordinary spaces after conjunctions and prepositions.
        el.textContent=item.text.replace(/(?<![\p{L}\p{N}_-])(в|во|на|с|со|к|ко|у|о|об|обо|от|ото|до|по|из|изо|за|без|безо|для|при|про|под|подо|над|надо|перед|передо|через|между|не|ни|бы|же|ли|и|а|но|да|или|либо|что|чтобы|как|если|когда|хотя|пока|чем|зато|будто|словно|потому|также|тоже|причём|притом)[ \t]+(?=[«„“"'(]*[\p{L}\p{N}])/giu,'$1\u00a0').replace(/(?<![\p{L}\p{N}_-])(так)[ \t]+(?=как(?:$|[^\p{L}\p{N}_-]))/giu,'$1\u00a0');
        el.dataset.position=item.position;
      }
    }
    let interrupted=false;
    const stop=()=>{interrupted=true;};
    window.addEventListener('wheel',stop,{once:true,passive:true});
    window.addEventListener('touchstart',stop,{once:true,passive:true});
    window.addEventListener('keydown',stop,{once:true});
    const restore=()=>{if(!interrupted){const article=document.getElementById('interactive');const top=saved.restart&&article?article.getBoundingClientRect().top+window.scrollY:saved.y;window.scrollTo({top,left:0,behavior:'instant'});}};
    restore();
    if(saved.restart)window.addEventListener('load',()=>requestAnimationFrame(restore),{once:true});
    const images=[...document.images].filter(img=>!img.complete).map(img=>new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true});}));
    const ready=Promise.all([document.fonts?.ready,...images]);
    Promise.race([ready,new Promise(resolve=>setTimeout(resolve,2000))]).then(()=>requestAnimationFrame(()=>{
      restore();state.pending=false;
      window.removeEventListener('wheel',stop);window.removeEventListener('touchstart',stop);window.removeEventListener('keydown',stop);
      if('scrollRestoration' in history)history.scrollRestoration='auto';
      save();
    }));
  });
})();
