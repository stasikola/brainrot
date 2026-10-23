(() => {
  'use strict';
  window.createBrainVideoFeed=(phone)=>{
    const create=(tag,className)=>{const el=document.createElement(tag);el.className=className;return el;};
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const feed=create('div','phone-feed');feed.tabIndex=0;feed.setAttribute('role','region');feed.setAttribute('aria-label','Лента из трёх видео. Листайте вверх и вниз.');
    const slides=[],videos=[];
    for(let n=1;n<=3;n++){
      const slide=create('div','phone-slide');slide.setAttribute('role','group');slide.setAttribute('aria-label','Видео '+n+' из 3');
      const video=create('video','phone-video');video.src='assets/videos/'+String(n).padStart(2,'0')+'.mp4';video.poster='assets/videos/'+String(n).padStart(2,'0')+'.png';
      video.preload='metadata';video.loop=true;video.muted=true;video.defaultMuted=true;video.playsInline=true;video.setAttribute('playsinline','');video.setAttribute('webkit-playsinline','');
      video.setAttribute('aria-label','Видео '+n);slide.append(video);feed.append(slide);slides.push(slide);videos.push(video);
    }
    phone.append(feed);
    const controls=create('div','phone-video-controls');
    const makeButton=(text,label,action)=>{const b=create('button','phone-video-button');b.type='button';b.textContent=text;b.setAttribute('aria-label',label);b.title=label;b.addEventListener('click',action);return b;};
    let active=0,muted=true,paused=reduced,inView=false,disposed=false;
    const pause=makeButton('▶','Продолжить воспроизведение',()=>{paused=false;sync();});
    pause.classList.add('phone-center-play');phone.append(pause);
    const sound=makeButton('♪','Включить звук',()=>{muted=!muted;sync();});
    sound.setAttribute('aria-pressed','false');
    controls.append(sound);phone.append(controls);
    function sync(){
      if(disposed)return;
      const allowed=inView&&!paused&&!document.hidden&&!document.body.classList.contains('editor-open')&&phone.isConnected;
      videos.forEach((video,i)=>{video.muted=muted;if(i===active&&allowed){video.play().catch(error=>{if(!disposed&&i===active&&error.name==='NotAllowedError'){paused=true;pause.hidden=false;}});}else video.pause();});
      pause.hidden=!paused;feed.setAttribute('aria-label','Лента из трёх видео. Листайте вверх и вниз. '+(paused?'Видео на паузе. Нажмите, чтобы продолжить.':'Нажмите на видео, чтобы поставить на паузу.'));
      sound.textContent=muted?'♪̸':'♪';sound.setAttribute('aria-label',muted?'Включить звук':'Выключить звук');sound.setAttribute('aria-pressed',String(!muted));
      phone.dataset.videoIndex=String(active);
    }
    function move(index){
      const target=((index%3)+3)%3;
      const wraps=index<0||index>2;
      feed.scrollTo({top:target*feed.clientHeight,behavior:reduced||wraps?'instant':'smooth'});
    }
    function track(){
      const index=Math.max(0,Math.min(2,Math.round(feed.scrollTop/Math.max(1,feed.clientHeight))));
      if(index!==active){active=index;sync();document.dispatchEvent(new Event('brain:videochange'));}
    }
    feed.addEventListener('scroll',track,{passive:true});
    feed.addEventListener('click',event=>{if(event.target.tagName==='VIDEO'){paused=!paused;sync();}});
    feed.addEventListener('keydown',event=>{
      if(['ArrowDown','PageDown','ArrowUp','PageUp','Home','End',' '].includes(event.key)){
        event.preventDefault();event.stopPropagation();
        if(event.key===' '){paused=!paused;sync();}
        else move(event.key==='Home'?0:event.key==='End'?2:active+(['ArrowDown','PageDown'].includes(event.key)?1:-1));
      }
    });
    // Native touch scrolling handles the middle clips; boundary swipes wrap the feed.
    let touchStart=null;
    feed.addEventListener('touchstart',event=>{
      if(event.touches.length!==1){touchStart=null;return;}
      touchStart={x:event.touches[0].clientX,y:event.touches[0].clientY,index:active,top:feed.scrollTop};
    },{passive:true});
    feed.addEventListener('touchend',event=>{
      if(!touchStart)return;
      const start=touchStart;touchStart=null;const touch=event.changedTouches[0];if(!touch)return;
      const dy=start.y-touch.clientY,dx=start.x-touch.clientX;
      if(Math.abs(dy)<50||Math.abs(dy)<=Math.abs(dx))return;
      if(start.index===2&&dy>0&&Math.abs(start.top-2*feed.clientHeight)<3)move(3);
      else if(start.index===0&&dy<0&&start.top<3)move(-1);
    },{passive:true});
    feed.addEventListener('touchcancel',()=>{touchStart=null;},{passive:true});
    let wheelLocked=false,wheelTotal=0,wheelTimer;
    feed.addEventListener('wheel',event=>{
      if(Math.abs(event.deltaY)<=Math.abs(event.deltaX))return;
      event.preventDefault();event.stopPropagation();if(wheelLocked)return;
      wheelTotal+=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?feed.clientHeight:1);
      if(Math.abs(wheelTotal)<24)return;
      move(active+Math.sign(wheelTotal));wheelTotal=0;wheelLocked=true;
      clearTimeout(wheelTimer);wheelTimer=setTimeout(()=>{wheelLocked=false;},450);
    },{passive:false});
    const observer=new IntersectionObserver(entries=>{inView=entries[0].isIntersecting&&entries[0].intersectionRatio>=.2;sync();},{threshold:[0,.2,.6]});observer.observe(phone);
    const modalObserver=new MutationObserver(sync);modalObserver.observe(document.body,{attributes:true,attributeFilter:['class']});
    const visibility=()=>sync();document.addEventListener('visibilitychange',visibility);
    const resize=new ResizeObserver(()=>{feed.scrollTop=active*feed.clientHeight;});resize.observe(feed);
    const saved=window.BRAIN_READING_SESSION;
    if(saved?.pending&&Number.isInteger(saved.saved?.videoIndex)){active=Math.max(0,Math.min(2,saved.saved.videoIndex));requestAnimationFrame(()=>{feed.scrollTop=active*feed.clientHeight;});}
    videos.forEach(video=>video.addEventListener('error',()=>{video.setAttribute('aria-label','Не удалось загрузить видео');}));
    phone.brainFeedDispose=()=>{disposed=true;observer.disconnect();modalObserver.disconnect();resize.disconnect();clearTimeout(wheelTimer);document.removeEventListener('visibilitychange',visibility);videos.forEach(video=>{video.pause();video.removeAttribute('src');video.load();});};
    sync();
  };
})();
