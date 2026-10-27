(() => {
  'use strict';
  const article=document.getElementById('interactive');
  const settings=article.querySelector('.background-switch');
  const create=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
  const wrap=create('div','reader-result-action');
  const trigger=create('button','reader-result-trigger','Подвести итог');trigger.type='button';trigger.setAttribute('aria-haspopup','dialog');wrap.append(trigger);settings.after(wrap);
  const dialog=create('dialog','reader-result-dialog');dialog.id='readerResult';dialog.setAttribute('aria-labelledby','readerResultHeading');trigger.setAttribute('aria-controls',dialog.id);
  const close=create('button','reader-result-close','×');close.type='button';close.setAttribute('aria-label','Закрыть итог');
  const eyebrow=create('div','reader-result-eyebrow','Ваша редакция');const title=create('h3','','');title.id='readerResultHeading';
  const caption=create('p','reader-result-caption');const graph=create('div','reader-result-graph');
  const legend=create('div','reader-result-legend');
  const back=create('button','reader-result-back','Начать сначала');back.type='button';
  dialog.append(close,eyebrow,title,caption,graph,legend,back);document.body.append(dialog);
  function collect(){
    const counts=[0,0,0,0];let chosen=0;const groups=[];
    function add(values,label){let done=0;values.forEach(value=>{if(value==='balanced'){counts[0]+=.5;counts[1]+=.5;chosen++;done++;}else if(value==='neutral'){chosen++;done++;}else if(Number.isInteger(value)&&value>=0&&value<=2){counts[value]++;chosen++;done++;}else counts[3]++;});groups.push([label,done,values.length]);}
    const fragments=new Map([...article.querySelectorAll('[data-fragment]')].map(node=>[node.dataset.fragment,node]));
    add(Array.from({length:12},(_,i)=>{const value=fragments.get(String(i))?.dataset.position;return /^[012]$/.test(value||'')?Number(value):null;}),'Формулировки');
    add(Array.from({length:4},(_,i)=>{const value=article.querySelector('[data-visual-block="'+i+'"]')?.dataset.selected;return /^[012]$/.test(value||'')?Number(value):null;}),'Иллюстрации');
    const hero=article.querySelector('#heroStartTrigger')?.dataset.selected;
    add([/^[012]$/.test(hero||'')?Number(hero):null],'Стартовый экран');
    add([article.dataset.theme==='dark'?2:article.dataset.theme==='light'?'balanced':null],'Фон');
    add([article.dataset.titleFont,article.dataset.headingFont,article.dataset.bodyFont].map(font=>font==='supermolot'?'balanced':font==='baltica'?2:font==='pragmatica'?'neutral':null),'Шрифты');
    const total=counts.reduce((a,b)=>a+b,0);
    const percentages=counts.map(value=>Math.round(value/total*1000)/10);
    const decisionsTotal=groups.reduce((sum,group)=>sum+group[2],0);
    return {counts,percentages,chosen,total,decisionsTotal,groups};
  }
  function render(){
    const data=collect();const names=['Исследовательская','Просветительская','Абсурдистская','ИИ-основа'];
    const max=Math.max(...data.counts.slice(0,3));const winners=data.counts.slice(0,3).map((n,i)=>n===max?i:-1).filter(i=>i>=0);
    title.textContent=!data.chosen?'Пока это исходная ИИ-основа':winners.length>1?'Вы собрали смешанную редакцию':['В ваших выборах больше исследования','В ваших выборах больше объяснения','В ваших выборах больше абсурда'][winners[0]];
    caption.textContent='Принято решений: '+data.chosen+' из '+data.decisionsTotal+'.';
    graph.replaceChildren();legend.replaceChildren();
    graph.setAttribute('role','img');graph.setAttribute('aria-label',names.map((name,i)=>name+': '+data.percentages[i].toLocaleString('ru-RU')+'%').join('. '));
    names.forEach((name,i)=>{const stripe=create('span','reader-result-segment category-'+i);stripe.style.flexGrow=String(data.counts[i]);stripe.hidden=data.counts[i]===0;stripe.setAttribute('aria-hidden','true');graph.append(stripe);const row=create('div','reader-result-row category-'+i);row.append(create('i'),create('span','',name),create('strong','',data.percentages[i].toLocaleString('ru-RU')+'%'));legend.append(row);});
    dialog.dataset.theme=article.dataset.theme||'default';
    dialog.style.setProperty('--result-heading',getComputedStyle(article).getPropertyValue('--reader-heading').trim()||"'Manrope',Arial,sans-serif");
    dialog.style.setProperty('--result-body',article.dataset.bodyFont==='pragmatica'?"'Reader Pragmatica',Arial,sans-serif":"'Manrope',Arial,sans-serif");
  }
  function open(){render();dialog.showModal();document.body.classList.add('editor-open');}
  function dismiss(){dialog.close();}
  dialog.addEventListener('close',()=>{document.body.classList.remove('editor-open');trigger.focus({preventScroll:true});});
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dismiss();});
  trigger.addEventListener('click',open);close.addEventListener('click',dismiss);back.addEventListener('click',()=>window.BRAIN_READING_SESSION.restart());
})();
