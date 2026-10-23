(() => {
  'use strict';
  const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
  const refs={
    freitas:['Freitas · 2026','https://doi.org/10.1108/JRIM-04-2026-0303'],
    buffer:['Buffer · 2024','https://buffer.com/resources/ai-assistant-post-performance/'],
    riffkit:['Riffkit · 2026','https://riffkit.ai/research/ai-tiktok-results'],
    fron:['Fron & Fleșeriu · 2025','https://hrcak.srce.hr/en/clanak/493427'],
    labels:['Seeger, Wessel & Lehrer · 2026','https://link.springer.com/article/10.1007/s12525-026-00883-2'],
    news:['Toff & Simon · 2025','https://experts.umn.edu/en/publications/or-they-could-just-not-use-it-the-dilemma-of-ai-disclosure-for-au/'],
    audit:['Rijsbosch и соавторы · препринт, 2026','https://arxiv.org/abs/2609.38571'],
    youtube:['Kapwing · YouTube, данные за октябрь 2025','https://www.kapwing.com/blog/ai-slop-report-the-global-rise-of-low-quality-ai-videos/'],
    tiktok:['Kapwing · TikTok, данные за май 2026','https://www.kapwing.com/resources/the-tiktok-ai-slop-report/']
  };
  const platforms={Threads:[11.11,5.56],TikTok:[6.14,4.17],YouTube:[3.9,3.7],LinkedIn:[6.85,6.22]};
  window.createBrainEvidenceChart=figure=>{
    const saved=window.BRAIN_READING_SESSION?.pending?window.BRAIN_READING_SESSION.saved?.chart:null;
    const box=el('div','evidence-chart evidence-v2');figure.append(box);
    let axis=saved?.axis==='trust'?'trust':'behavior';
    let study=['freitas','buffer','riffkit','fron'].includes(saved?.study)?saved.study:'freitas';
    let trust=['labels','news','audit'].includes(saved?.trust)?saved.trust:'labels';
    let platform=platforms[saved?.platform]?saved.platform:'TikTok';
    const intro=el('div','evidence-intro');intro.append(el('div','chart-eyebrow','Внимание ≠ доверие'),el('h3','','Меняется ли внимание, когда контент делает ИИ?'),el('div','evidence-lead','Реакции в ленте и отношение к автору — разные вопросы. Посмотрите, что именно измеряли исследователи.'));
    const axes=el('div','evidence-axes');axes.setAttribute('aria-label','Вопрос исследования');
    const subnav=el('div','evidence-subnav');subnav.setAttribute('aria-label','Исследование');
    const panel=el('div','evidence-panel');panel.setAttribute('aria-live','polite');
    const limitations=el('div','evidence-limits');limitations.append(el('strong','','Что эти данные не показывают'),el('div','','У исследований разные выборки, форматы и методы. Их нельзя складывать в общий рейтинг «ИИ против человека». Связь с метриками не доказывает причину; отсутствие значимого различия не доказывает равенство.'));
    const scroll=el('div','evidence-scroll');scroll.tabIndex=0;scroll.setAttribute('role','region');scroll.setAttribute('aria-label','Результаты исследований. Прокрутите, чтобы увидеть источники и ограничения.');
    scroll.append(panel,limitations);box.append(intro,axes,subnav,scroll);
    function button(label,selected,action){const b=el('button','',label);b.type='button';b.setAttribute('aria-pressed',String(selected));b.addEventListener('click',action);return b;}
    function remember(){Object.assign(box.dataset,{axis,study,trust,platform});document.dispatchEvent(new Event('brain:chartchange'));}
    function cite(parent,key,note){const wrap=el('details','evidence-source');wrap.append(el('summary','','Источник и ограничения'));const body=el('div');const a=el('a','',refs[key][0]);a.href=refs[key][1];a.target='_blank';a.rel='noopener noreferrer';body.append(a,el('div','',note));wrap.append(body);parent.append(wrap);}
    function heading(kicker,title,text){panel.append(el('div','evidence-kicker',kicker),el('h4','',title));if(text)panel.append(el('div','evidence-description',text));}
    function note(text){panel.append(el('div','evidence-note',text));}
    function stats(items){const row=el('div','evidence-numbers');for(const [value,label] of items){const item=el('div');item.append(el('strong','',value),el('span','',label));row.append(item);}panel.append(row);}
    function findingCards(items){const grid=el('div','evidence-findings');const detail=el('div','evidence-finding-detail');detail.setAttribute('role','status');items.forEach(([name,result,text],i)=>{const b=button('',i===0,()=>{grid.querySelectorAll('button').forEach(node=>node.setAttribute('aria-pressed',String(node===b)));detail.textContent=text;});b.append(el('span','',name),el('strong','',result));grid.append(b);});detail.textContent=items[0][2];panel.append(grid,detail);}
    function dots(parent,count,label){const grid=el('div','chart-dot-grid');grid.setAttribute('role','img');grid.setAttribute('aria-label',label);for(let n=0;n<100;n++){const dot=el('i',n<count?'is-above':'');dot.setAttribute('aria-hidden','true');grid.append(dot);}parent.append(grid);}
    function render(){
      axes.replaceChildren(...[['behavior','Что делают зрители'],['trust','Что они думают']].map(([id,label])=>button(label,axis===id,()=>{axis=id;render();})));
      const choices=axis==='behavior'?[['freitas','408 аккаунтов'],['buffer','Помощь ИИ'],['riffkit','ИИ-ролики'],['fron','24 поста']]:[['labels','Метка в Instagram'],['news','Доверие к новостям'],['audit','Видна ли метка?']];
      subnav.replaceChildren(...choices.map(([id,label])=>button(label,(axis==='behavior'?study:trust)===id,()=>{if(axis==='behavior')study=id;else trust=id;render();})));
      scroll.scrollTop=0;panel.replaceChildren();
      if(axis==='behavior'&&study==='freitas'){
        heading('Instagram · сопоставление аккаунтов','Лайкают — без явного преимущества человека','204 пары аккаунтов, сопоставленных по типу контента и размеру аудитории.');
        stats([['408','аккаунтов'],['204','сопоставленные пары']]);
        findingCards([
          ['Вовлечённость','Различия не выявлены','Общая вовлечённость и среднее число лайков статистически не различались между ИИ- и человеческими аккаунтами.'],
          ['Комментарии','Преимущество не доказано','Исследование не нашло подтверждения, что человеческие аккаунты получают больше комментариев. Это не означает, что ИИ получает больше.'],
          ['Подписчики на пост','У ИИ выше','ИИ-аккаунты привлекали больше подписчиков на публикацию. Это эффективность роста, а не число просмотров каждого поста.']
        ]);
        cite(panel,'freitas','Наблюдательное сравнение, не случайный эксперимент. Использована открытая аннотация: абсолютные значения метрик в ней не приведены.');
      }else if(axis==='behavior'&&study==='buffer'){
        heading('Данные пользователей Buffer','Помощь ассистента — не авторство всего поста','Медианная вовлечённость постов с Buffer AI Assistant и без его помощи. Формулы метрики зависят от платформы.');
        const platformsNav=el('div','evidence-platforms');platformsNav.setAttribute('aria-label','Платформа Buffer');Object.keys(platforms).forEach(name=>platformsNav.append(button(name,platform===name,()=>{platform=name;render();})));panel.append(platformsNav);
        const rows=el('div','chart-race');const values=platforms[platform];const scale=12;
        values.forEach((value,i)=>{const row=el('div','evidence-bar');const head=el('div','chart-race-head');head.append(el('span','',i===0?'С помощью ассистента':'Без ассистента'),el('strong','',value.toLocaleString('ru-RU')+'%'));const track=el('div','chart-race-track');const fill=el('span','chart-race-fill');fill.style.setProperty('--bar-width',(value/scale*100)+'%');track.append(fill);row.append(head,track);rows.append(row);});panel.append(rows,el('small','chart-interaction-hint','Общая шкала полос: 0–12%. Сравнивайте два типа постов внутри платформы.'));
        note('Помощь могла касаться идеи, подписи или переработки текста. Эти числа не измеряют преимущество полностью сгенерированных видео.');
        cite(panel,'buffer','1,2 млн постов, 15 000 авторов, публиковавших оба типа. Отдельное число TikTok-постов не указано. Возможен сдвиг в сторону активных пользователей. Buffer продаёт ассистента; частоту публикаций предлагает как гипотезу, а не доказанную причину.');
      }else if(axis==='behavior'&&study==='riffkit'){
        heading('TikTok · собственные видео Riffkit','От сотен просмотров до редкого хита','Распределение результатов ИИ-роликов — без человеческой контрольной группы.');
        stats([['418','медиана просмотров'],['1,5 млн+','просмотры лучшего ролика'],['3,25%','медиана вовлечённости']]);
        dots(panel,20,'20,4% роликов набрали больше 1 000 просмотров; 79,6% остались ниже порога. Схема округлена до целых процентов.');
        panel.append(el('div','evidence-description','20,4% преодолели 1 000 просмотров. Один квадрат ≈ 1% выборки.'));
        note('ИИ-видео способны получать реакции. Но эта выборка не позволяет сказать, успешнее ли они человеческих.');
        cite(panel,'riffkit','1 504 ролика; данные вовлечённости — для 1 446. Ниши преимущественно коммерческие. Riffkit продаёт инструмент, которым созданы видео. Независимой человеческой группы нет.');
      }else if(axis==='behavior'){
        heading('Instagram · небольшой полевой эксперимент','Разные сильные стороны','24 кулинарных поста: 12 человеческих и 12 ИИ, один аккаунт на 770 подписчиков.');
        findingCards([
          ['ИИ-посты','Выход за круг подписчиков','У ИИ-постов было больше визитов в профиль и охвата среди неподписчиков.'],
          ['Человеческие посты','Больше комментариев','Человеческие публикации получили больше комментариев и показов через хештеги.'],
          ['Опрос в Stories','Визуал — 64%','Изображение называли главным фактором реакции чаще, чем рецепт или информацию (26%) и подпись (10%). Подписи ИИ оценивали привлекательнее.']
        ]);
        cite(panel,'fron','Один кулинарный аккаунт и статичные изображения. Общие показатели были сопоставимы; выводы нельзя автоматически переносить на видео и другие темы.');
      }else if(trust==='labels'){
        heading('Эксперименты с Instagram-профилями','Метка меняет восприятие','Участники видели визуальные посты с обозначением человеческого авторства, улучшения ИИ или генерации ИИ.');
        stats([['325','участников первого опыта'],['371','участник второго опыта']]);
        findingCards([
          ['Участие ИИ раскрыто','Вовлечённость ниже','ИИ-метки снижали эмоциональную и заявленную поведенческую вовлечённость относительно человеческой метки, особенно для эмоционального контента.'],
          ['Метка раскрыта позже','Эффект зависит от роли ИИ','Позднее раскрытие смягчало эмоциональную реакцию на ИИ-улучшение, но не на полную ИИ-генерацию.']
        ]);
        cite(panel,'labels','Онлайн-эксперименты на Prolific с имитацией Instagram-профилей. Измерялись ответы участников, а не естественная статистика лайков в ленте.');
      }else if(trust==='news'){
        heading('Эксперимент с новостными материалами','Меньше доверия — при той же оценке точности','ИИ-метка снижала воспринимаемую надёжность новостей, хотя точность и беспристрастность материалов не оценивались хуже.');
        findingCards([
          ['Сообщить об ИИ','Доверие ниже','Результат получен на американской аудитории с реальными ИИ-новостями. Это не замер просмотров TikTok.'],
          ['Показать источники','Негативный эффект слабее','Раскрытие списка источников в значительной степени компенсировало негативный эффект для доверия.']
        ]);
        cite(panel,'news','Toff & Simon, журнальная публикация 2025 года. Вывод относится к доверию к новостям; он не доказывает одинаковую реакцию на любой развлекательный контент.');
      }else{
        heading('Аудит платформ · контролируемые загрузки','Даже имеющиеся сигналы не всегда становятся меткой','Проверяли Instagram, TikTok, X и YouTube: загрузки ИИ-контента со стандартными сигналами происхождения.');
        stats([['61%','загрузок получили метку'],['39%','не получили метку']]);dots(panel,61,'61% контролируемых загрузок получили ИИ-метку; 39% — нет.');
        cite(panel,'audit','Препринт от 29 сентября 2026, без завершённого рецензирования. Это доля тестовых загрузок, а не всего ИИ-контента в интернете. 39% — дополнение до 100%.');
      }
      remember();
    }
    const scope=el('details','evidence-scope');scope.append(el('summary','','А сколько слопа попадает в новую ленту?'));const scopeBody=el('div','evidence-scope-body');scopeBody.append(el('div','evidence-description','Два отдельных теста Kapwing: первые 500 видео новых аккаунтов. Это снимки рекомендательных лент в разные даты, а не доля всего контента платформ.'));
    const grids=el('div','evidence-feed-pair');
    [['youtube','YouTube Shorts','21%',21,'104 из 500 · октябрь 2025'],['tiktok','TikTok','59%',59,'294 из 500 · май 2026']].forEach(([key,label,percent,count,note])=>{const card=el('div','evidence-feed-card');card.append(el('h4','',label),el('strong','evidence-feed-value',percent));dots(card,count,label+': около '+percent+' ИИ-слопа в тестовой ленте.');card.append(el('small','',note));cite(card,key,'Ручная оценка по определению слопа Kapwing; компания продаёт видеоредактор и ИИ-инструменты. Проценты и квадраты округлены.');grids.append(card);});
    scopeBody.append(grids,el('div','evidence-note','ИИ-слоп и брейнрот — разные категории: в тесте YouTube к брейнроту отнесли 33%, к ИИ-слопу — 21%. Эти доли нельзя складывать.'));scope.append(scopeBody);scroll.append(scope);
    render();
  };
})();
