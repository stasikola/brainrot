(() => {
  'use strict';
  const article=document.getElementById('interactive');
  const trigger=document.getElementById('fontPickerTrigger');
  const dialog=document.getElementById('fontPicker');
  const backdrop=document.getElementById('fontBackdrop');
  const buttons=[...dialog.querySelectorAll('[data-font-choice]')];
  function apply(group,value){
    if(group==='title'&&['supermolot','baltica'].includes(value))article.dataset.titleFont=value;
    else if(group==='heading'&&['supermolot','baltica'].includes(value))article.dataset.headingFont=value;
    else if(group==='body'&&value==='pragmatica')article.dataset.bodyFont=value;
    else return;
    buttons.filter(b=>b.dataset.fontGroup===group).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.fontChoice===value)));
    document.dispatchEvent(new Event('brain:fontchange'));
  }
  function open(){
    dialog.hidden=false;backdrop.hidden=false;trigger.setAttribute('aria-expanded','true');
    document.body.classList.add('editor-open');document.querySelectorAll('body > section').forEach(s=>{s.inert=true;});
    dialog.querySelector('.editor-close').focus({preventScroll:true});
  }
  function close(){
    dialog.hidden=true;backdrop.hidden=true;trigger.setAttribute('aria-expanded','false');
    document.body.classList.remove('editor-open');document.querySelectorAll('body > section').forEach(s=>{s.inert=false;});trigger.focus({preventScroll:true});
  }
  trigger.addEventListener('click',open);dialog.querySelector('.editor-close').addEventListener('click',close);backdrop.addEventListener('click',close);
  buttons.forEach(b=>b.addEventListener('click',()=>apply(b.dataset.fontGroup,b.dataset.fontChoice)));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!dialog.hidden){event.preventDefault();close();}});
  dialog.addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;const controls=[...dialog.querySelectorAll('button')];const first=controls[0],last=controls[controls.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  const session=window.BRAIN_READING_SESSION;
  if(session?.pending){apply('title',session.saved?.titleFont??session.saved?.headingFont);apply('heading',session.saved?.headingFont);apply('body',session.saved?.bodyFont);}
})();
