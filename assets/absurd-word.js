(() => {
  'use strict';
  window.mountBrainAbsurdWord=(section,body,paragraphs)=>{
    const make=(tag,cls,text)=>{const el=document.createElement(tag);el.className=cls;if(text)el.textContent=text;return el;};
    const copy=body.querySelector('.visual-copy');
    const panel=make('div','absurd-word-window');
    panel.setAttribute('role','group');panel.setAttribute('aria-label','История слова brain rot');
    const label=make('div','absurd-word-label','1854 → 2026');
    const pages=make('div','absurd-word-pages');paragraphs.forEach(p=>pages.append(p));
    const navigation=make('div','absurd-word-navigation');
    const count=make('span','absurd-word-count');
    const previous=make('button','absurd-word-arrow','‹');previous.type='button';previous.setAttribute('aria-label','Предыдущий абзац');
    const next=make('button','absurd-word-arrow','›');next.type='button';next.setAttribute('aria-label','Следующий абзац');
    navigation.append(count,previous,next);panel.append(label,pages,navigation);copy.append(panel);
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    let index=0,chars=[],frame=0,start=0,visible=false,disposed=false,entered=false,entering=false;
    panel.dataset.entered='false';
    function finishEntrance(){
      entering=false;panel.classList.remove('is-entering');
      if(visible&&!frame)frame=requestAnimationFrame(paint);
    }
    panel.addEventListener('animationend',event=>{
      if(event.target===panel&&event.animationName==='absurd-word-glitch-in')finishEntrance();
    });
    function paint(time){
      frame=0;if(disposed||entering)return;
      if(!start)start=time;
      const shown=reduced.matches?chars.length:Math.min(chars.length,Math.floor((time-start)/24));
      chars.forEach((char,i)=>{char.style.opacity=i<shown?'1':'0';char.classList.toggle('is-cursor',i===shown-1&&shown<chars.length);});
      if(shown<chars.length&&visible)frame=requestAnimationFrame(paint);
    }
    const observer=new MutationObserver(()=>select(index));
    function select(value){
      cancelAnimationFrame(frame);frame=0;start=0;observer.disconnect();
      index=value;
      paragraphs.forEach((p,i)=>{
        p.querySelectorAll('.absurd-word-char').forEach(char=>char.replaceWith(document.createTextNode(char.textContent)));p.normalize();
        const active=i===index;p.hidden=false;p.style.visibility=active?'visible':'hidden';p.inert=!active;p.setAttribute('aria-hidden',String(!active));
      });
      const walker=document.createTreeWalker(paragraphs[index],NodeFilter.SHOW_TEXT);const nodes=[];
      while(walker.nextNode())nodes.push(walker.currentNode);
      nodes.forEach(node=>{const fragment=document.createDocumentFragment();for(const letter of node.nodeValue){fragment.append(make('span','absurd-word-char',letter));}node.replaceWith(fragment);});
      chars=[...paragraphs[index].querySelectorAll('.absurd-word-char')];
      count.textContent=String(index+1).padStart(2,'0')+' / '+String(paragraphs.length).padStart(2,'0');
      previous.disabled=index===0;next.disabled=index===paragraphs.length-1;
      if((visible||reduced.matches)&&!entering)frame=requestAnimationFrame(paint);
      observer.observe(pages,{childList:true,characterData:true,subtree:true});
    }
    previous.addEventListener('click',()=>select(Math.max(0,index-1)));
    next.addEventListener('click',()=>select(Math.min(paragraphs.length-1,index+1)));
    function motionChange(){if(reduced.matches&&entering)finishEntrance();select(index);}
    reduced.addEventListener('change',motionChange);
    const intersection=new IntersectionObserver(entries=>{
      visible=entries.some(entry=>entry.isIntersecting);
      if(visible&&!entered){
        entered=true;panel.dataset.entered='true';entering=!reduced.matches;
        if(entering)panel.classList.add('is-entering');
      }
      if(visible&&!frame&&!entering)frame=requestAnimationFrame(paint);
      if(!visible){cancelAnimationFrame(frame);frame=0;}
    },{threshold:.15});
    select(0);intersection.observe(panel);
    section.brainAbsurdWordDispose=()=>{
      disposed=true;cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();reduced.removeEventListener('change',motionChange);
      paragraphs.forEach(p=>{p.querySelectorAll('.absurd-word-char').forEach(char=>char.replaceWith(document.createTextNode(char.textContent)));p.normalize();p.style.removeProperty('visibility');p.inert=false;p.removeAttribute('aria-hidden');copy.append(p);});
      panel.remove();delete section.brainAbsurdWordDispose;
    };
  };
})();
