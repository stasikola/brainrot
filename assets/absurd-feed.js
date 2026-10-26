(() => {
  'use strict';
  window.mountBrainAbsurdFeed=(section,body,paragraphs)=>{
    const make=(tag,cls)=>{const e=document.createElement(tag);e.className=cls;return e;};
    const originals=paragraphs.map(p=>({p,nodes:[...p.childNodes],text:[...p.childNodes].map(n=>n.nodeType===3?n.nodeValue:null)}));
    const first=paragraphs[0],second=paragraphs[1];
    const originalText=first.textContent;const split=originalText.indexOf('Алгоритмическая лента');
    const blocks=Array.from({length:5},()=>make('p','absurd-text'));
    blocks[0].textContent=split>0?originalText.slice(0,split).trim():originalText;
    blocks[1].textContent=split>0?originalText.slice(split):'';
    const secondNodes=[...second.childNodes];let destination=2;
    secondNodes.forEach(node=>{if(node.nodeType===1&&node.matches('[data-fragment]'))destination=node.dataset.fragment==='3'?4:3;blocks[destination].append(node);});
    paragraphs.forEach(p=>p.remove());
    const story=make('div','absurd-story');const scene=make('div','absurd-scene');
    const ui=make('div','absurd-ui');ui.setAttribute('aria-hidden','true');ui.inert=true;
    const paths={
      home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
      reels:'<rect x="3" y="3" width="18" height="18" rx="5"/><path d="m10 8 6 4-6 4Z"/>',
      send:'<path d="m3 4 18 0-7 17-4-7-7-10Z M10 14 21 4"/>',
      search:'<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/>',
      heart:'<path d="M12 21 3.5 13A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 8.5 7Z"/>',
      plus:'<path d="M12 3v18M3 12h18"/>',
      bookmark:'<path d="M5 3h14v19l-7-6-7 6Z"/>',
      menu:'<path d="M3 5h18M3 12h18M3 19h18"/>',
      grid:'<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/>',
      camera:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none"/>'
    };
    function icon(name){const item=make('span','absurd-ui-icon');const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.8');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');svg.innerHTML=paths[name];item.append(svg);return item;}
    const top=make('div','absurd-ui-top');const search=make('div','absurd-ui-search');search.append(icon('search'),document.createTextNode('Поиск'));top.append(search,icon('bookmark'));
    const rail=make('div','absurd-ui-rail');rail.append(icon('camera'));const railItems=make('div','absurd-ui-rail-items');['home','reels','send','search','heart','plus','grid'].forEach(name=>railItems.append(icon(name)));rail.append(railItems,icon('menu'));
    const bottom=make('div','absurd-ui-bottom');['home','reels','send','search'].forEach(name=>{const item=icon(name);if(name==='search')item.classList.add('is-active');if(name==='send')item.classList.add('has-notification');bottom.append(item);});const avatar=make('span','absurd-ui-avatar');bottom.append(avatar);
    ui.append(top,rail,bottom);scene.append(ui);
    const finalRow=make('div','absurd-final-row');
    blocks.forEach((block,i)=>{block.dataset.block=i;if(i<3)scene.append(block);});
    finalRow.append(blocks[4],blocks[3]);scene.append(finalRow);
    const hint=make('span','absurd-scroll-hint');hint.textContent='Листайте. Ленте всё ещё мало. ↓';scene.append(hint);story.append(scene);body.append(story);
    const reduced=matchMedia('(prefers-reduced-motion: reduce)');
    let chars=[],frame=0,disposed=false;
    const observer=new MutationObserver(()=>{decorate();queue();});
    function decorate(){
      observer.disconnect();
      blocks.forEach(block=>{
        block.querySelectorAll('.absurd-char').forEach(span=>span.replaceWith(document.createTextNode(span.textContent)));
        block.normalize();
        const walker=document.createTreeWalker(block,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
        nodes.forEach(text=>{const frag=document.createDocumentFragment();Array.from(text.nodeValue).forEach(letter=>{const span=make('span','absurd-char');span.textContent=letter;frag.append(span);});text.replaceWith(frag);});
      });
      chars=blocks.map(block=>[...block.querySelectorAll('.absurd-char')]);
      blocks.forEach(block=>observer.observe(block,{childList:true,subtree:true,characterData:true}));
    }
    const clamp=n=>Math.max(0,Math.min(1,n));
    function render(){
      frame=0;if(disposed)return;
      const rect=story.getBoundingClientRect();const progress=clamp(-rect.top/Math.max(1,story.offsetHeight-innerHeight));
      scene.dataset.reduced=String(reduced.matches);
      hint.style.opacity=reduced.matches?'0':String(1-clamp(progress/.1));
      const compact=matchMedia('(max-width:1000px)').matches;
      blocks.forEach((block,i)=>{
        // The left ending (4) precedes the upper-right ending (3).
        const start=i<3?.1+i*(compact?.21:.17):i===4?(compact?.73:.61):(compact?.87:.80);
        const duration=i<3?(compact?.2:.29):compact?.13:i===4?.18:.20;
        const local=(progress-start)/duration;
        const shown=reduced.matches?1:clamp(local/.62);
        const fade=reduced.matches?1:1-clamp((local-.82)/.18);
        const visible=reduced.matches||(local>0&&local<1);
        block.style.opacity=String(fade);block.style.visibility=visible?'visible':'hidden';block.inert=!visible;block.setAttribute('aria-hidden',String(!visible));
        const count=Math.floor(shown*chars[i].length);
        chars[i].forEach((char,j)=>{char.style.opacity=j<count?'1':'0';char.classList.toggle('is-cursor',visible&&j===count-1&&shown<1);});
      });
    }
    function queue(){if(!frame&&!disposed)frame=requestAnimationFrame(render);}
    decorate();window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);reduced.addEventListener('change',queue);queue();
    section.brainAbsurdDispose=()=>{
      disposed=true;observer.disconnect();cancelAnimationFrame(frame);window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue);reduced.removeEventListener('change',queue);
      blocks.forEach(block=>{block.querySelectorAll('.absurd-char').forEach(span=>span.replaceWith(document.createTextNode(span.textContent)));block.normalize();});
      for(const item of originals){item.nodes.forEach((node,i)=>{if(item.text[i]!==null)node.nodeValue=item.text[i];});item.p.replaceChildren(...item.nodes);body.append(item.p);}
      story.remove();delete section.brainAbsurdDispose;
    };
  };
})();
