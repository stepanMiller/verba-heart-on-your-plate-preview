'use strict';
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const scenes = $$('#lecture > .scene');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  const motionButton = $('#motion-toggle');
  const ambient = $$('video[data-ambient]');
  const film = $('#film-dialog');
  const reel = $('#showreel');
  const contents = $('#contents-dialog');
  const notes = $('#note-dialog');
  const visibleVideos = new Set();
  const focusOrigins = new Map();
  const canvas = $('#lipid-canvas');
  const ctx = canvas.getContext('2d');
  const stage = canvas.parentElement;
  let userPaused = false;
  let motion = false;
  let activeIndex = 0;
  let scrollFrame = 0;
  let canvasFrame = 0;
  let lastTime = 0;
  let width = 1;
  let height = 1;
  let angle = .25;
  let lipidIndex = 0;
  let packageTurned = false;
  document.documentElement.classList.add('js');

  const hasDialog = () => !!$('dialog[open]');
  function loadVideo(video) {
    const source = $('source', video);
    if (!source.getAttribute('src')) {
      source.src = source.dataset.src;
      video.load();
    }
  }
  function shouldPlay(video) {
    return motion && visibleVideos.has(video) && !document.hidden && !hasDialog();
  }
  function syncVideos() {
    ambient.forEach(video => {
      if (!shouldPlay(video)) { video.pause(); return; }
      loadVideo(video);
      if (!video.paused) return;
      video.play().then(() => {
        if (!shouldPlay(video)) { video.pause(); return; }
        video.classList.add('ready');
      }).catch(() => video.classList.remove('ready'));
    });
  }
  ambient.forEach(video => {
    video.addEventListener('error', () => video.classList.remove('ready'));
    $('source', video).addEventListener('error', () => video.classList.remove('ready'));
  });
  const mediaObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleVideos.add(entry.target);
      else visibleVideos.delete(entry.target);
    });
    syncVideos();
  }, { threshold: .15 });
  ambient.forEach(video => mediaObserver.observe(video));

  function openDialog(dialog, invoker) {
    focusOrigins.set(dialog, invoker);
    dialog.showModal();
    document.body.classList.add('dialog-open');
    syncVideos(); syncCanvas();
  }
  function closeDialog(dialog) {
    if (dialog === film) reel.pause();
    dialog.close();
  }
  $$('[data-close-dialog]').forEach(button => button.addEventListener('click', () => closeDialog(button.closest('dialog'))));
  $$('dialog').forEach(dialog => {
    dialog.addEventListener('cancel', () => { if (dialog === film) reel.pause(); });
    dialog.addEventListener('close', () => {
      if (dialog === film) reel.pause();
      if (!hasDialog()) document.body.classList.remove('dialog-open');
      focusOrigins.get(dialog)?.focus({ preventScroll: true });
      syncVideos(); syncCanvas();
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(dialog);
    });
  });
  $('#menu-toggle').addEventListener('click', event => openDialog(contents, event.currentTarget));
  const contentsLinks = scenes.map((scene, index) => {
    const link = document.createElement('a');
    link.href = '#' + scene.id;
    const number = document.createElement('span');
    number.textContent = String(index + 1).padStart(2, '0');
    link.append(number, scene.dataset.title);
    link.addEventListener('click', () => closeDialog(contents));
    return link;
  });
  $('#contents-list').replaceChildren(...contentsLinks);
  $$('[data-open-film]').forEach(button => button.addEventListener('click', () => {
    // Explicit user playback is available even with reduced motion or Save-Data.
    loadVideo(reel);
    openDialog(film, button);
    reel.play().catch(() => {});
  }));
  $$('[data-note]').forEach(link => link.addEventListener('click', event => {
    const source = $('#note-' + link.dataset.note);
    if (!source) return;
    event.preventDefault();
    $('#note-title').textContent = $('summary', source).textContent;
    $('#note-content').replaceChildren(...[...source.children].filter(child => child.tagName !== 'SUMMARY').map(child => child.cloneNode(true)));
    openDialog(notes, link);
  }));
  $$('a[href^="#note-"]').forEach(link => {
    if (link.dataset.note) return;
    link.addEventListener('click', () => { $(link.getAttribute('href')).open = true; });
  });

  function selectGroup(attribute, index) {
    $$('[' + attribute + ']').forEach(button => button.setAttribute('aria-pressed', String(Number(button.getAttribute(attribute)) === index)));
  }
  const lipidStates = [
    ['Холестерин', 'в составе ЛПНП', 'ЛПНП переносит холестерин в крови.\nХС-ЛПНП — количество этого холестерина.'],
    ['Холестерин', 'в составе ЛПВП', 'ЛПВП участвует в обратном переносе.\nХС-ЛПВП — часть картины риска.'],
    ['Триглицериды', 'в составе липопротеинов', 'ТГ — другой тип липидов.\nИх тоже переносят липопротеины.']
  ];
  $$('[data-lipid]').forEach(button => button.addEventListener('click', () => {
    lipidIndex = Number(button.dataset.lipid);
    selectGroup('data-lipid', lipidIndex);
    const state = lipidStates[lipidIndex];
    $('#particle-name').textContent = state[0];
    $('#particle-carrier').textContent = state[1];
    $('#lipid-message').textContent = state[2];
    drawParticle();
  }));
  const labelMessages = [
    'Насыщенные жиры — отдельно\nот общего количества жира.',
    'Соль сравнивайте с солью,\nнатрий — с натрием.',
    'Ищите добавленные сахара.\nЕсли строки нет — проверьте состав.',
    'Сравнивайте одинаковое количество.\nУчитывайте свою порцию.'
  ];
  $('#package-turn').addEventListener('click', () => {
    packageTurned = !packageTurned;
    $('#package').classList.toggle('turned', packageTurned);
    $('#package-turn').setAttribute('aria-pressed', String(packageTurned));
    $('#package-turn').textContent = packageTurned ? 'Вернуть лицевую сторону ↻' : 'Повернуть упаковку ↻';
    const front = $('.package-front'); const back = $('.package-back');
    front.inert = packageTurned; back.inert = !packageTurned;
    front.setAttribute('aria-hidden', String(packageTurned));
    back.setAttribute('aria-hidden', String(!packageTurned));
    $('#label-message').textContent = packageTurned ? labelMessages[Number($('[data-label][aria-pressed="true"]').dataset.label)] : 'Состав важнее обещаний\nна лицевой стороне.';
  });
  $$('[data-label]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.label);
    selectGroup('data-label', index);
    $('#label-message').textContent = labelMessages[index];
  }));
  const risks = [['Без курения','Курение'],['Без повышенного АД','Повышенное АД'],['Нет известной истории','Ранние семейные события']];
  $$('[data-risk]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.risk);
    selectGroup('data-risk', index);
    $('#risk-a').textContent = risks[index][0]; $('#risk-b').textContent = risks[index][1];
    $('.risk-hero').setAttribute('aria-label', 'Два учебных досье: одинаковый ХС-ЛПНП; ' + risks[index].join(' и '));
  }));
  const questions = [['Каков мой','общий риск?'],['Какая цель по ХС-ЛПНП','подходит мне?'],['Что изменить и когда','оценить результат?']];
  $$('[data-question]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.question);
    selectGroup('data-question', index);
    $('#question-number').textContent = String(index + 1).padStart(2,'0');
    const em = document.createElement('em'); em.textContent = questions[index][1];
    $('#question-text').replaceChildren(questions[index][0], document.createElement('br'), em);
  }));
  const habits = ['Заменять часть сливочного масла\nрастительным в привычном блюде.','Чаще выбирать овёс или бобовые\nв привычном завтраке или гарнире.','Выбирать несладкий напиток\nвместо привычного сладкого.'];
  $$('[data-habit]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.habit);
    selectGroup('data-habit', index);
    $('#habit-message').textContent = habits[index];
  }));

  function updateScroll() {
    scrollFrame = 0;
    const midpoint = innerHeight * .5;
    let index = scenes.length - 1;
    scenes.forEach((scene, i) => {
      const rect = scene.getBoundingClientRect();
      if (rect.top <= midpoint && rect.bottom > midpoint) index = i;
      const visible = rect.top < innerHeight * .9 && rect.bottom > innerHeight * .1;
      scene.classList.toggle('in-view', visible);
      if (motion && visible && scene.classList.contains('photo')) {
        const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)));
        scene.style.setProperty('--photo-scale', (1.012 + progress * .025).toFixed(4));
      }
    });
    activeIndex = index;
    $('#scene-number').textContent = String(index + 1).padStart(2,'0');
    const prev = $('#previous-scene'); const next = $('#next-scene');
    prev.href = '#' + scenes[Math.max(0,index - 1)].id;
    next.href = '#' + scenes[Math.min(scenes.length - 1,index + 1)].id;
    prev.setAttribute('aria-disabled', String(index === 0));
    next.setAttribute('aria-disabled', String(index === scenes.length - 1));
    prev.tabIndex = index === 0 ? -1 : 0; next.tabIndex = index === scenes.length - 1 ? -1 : 0;
    contentsLinks.forEach((link,i) => { if (i === index) link.setAttribute('aria-current','step'); else link.removeAttribute('aria-current'); });
    document.body.classList.toggle('dark-ui', scenes[index].classList.contains('dark'));
    const total = document.documentElement.scrollHeight - innerHeight;
    $('#page-progress').style.transform = 'scaleX(' + Math.min(1,Math.max(0,scrollY / Math.max(1,total))) + ')';
    syncCanvas();
  }
  function requestScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }
  addEventListener('scroll',requestScroll,{passive:true});
  addEventListener('resize',requestScroll);
  addEventListener('hashchange',requestScroll);

  // V3 surface points + Hero Lecture orbital transport, explicitly conceptual.
  const points = Array.from({length:720},(_,i) => {
    const y = 1 - 2 * (i + .5) / 720;
    const radius = Math.sqrt(1 - y*y); const theta = Math.PI * (3 - Math.sqrt(5)) * i;
    return {x:Math.cos(theta)*radius,y,z:Math.sin(theta)*radius};
  });
  const palettes = [[163,139,86],[112,138,105],[158,127,107]];
  function resizeCanvas() {
    const rect = stage.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1,1.5);
    width = Math.max(1,rect.width); height = Math.max(1,rect.height);
    canvas.width = Math.round(width*dpr); canvas.height = Math.round(height*dpr);
    ctx?.setTransform(dpr,0,0,dpr,0,0);
    drawParticle();
  }
  function drawParticle() {
    if (!ctx) return;
    ctx.clearRect(0,0,width,height);
    const cx = width*.5, cy = height*.43, radius = Math.min(width,height)*.29;
    const color = palettes[lipidIndex];
    for (let i=0;i<3;i++) {
      ctx.beginPath(); ctx.ellipse(cx,cy,radius*(1.4+i*.1),radius*(.46+i*.11),-.65+i*.7+angle*.08,0,Math.PI*2);
      ctx.strokeStyle='rgba('+color.join(',')+',.28)';ctx.lineWidth=.8;ctx.stroke();
    }
    const body = ctx.createRadialGradient(cx-radius*.25,cy-radius*.28,0,cx,cy,radius);
    body.addColorStop(0,'rgba('+color.map(c=>Math.min(255,c+65)).join(',')+',.25)');
    body.addColorStop(1,'rgba('+color.join(',')+',.10)');
    ctx.fillStyle=body;ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);ctx.fill();
    const core = ctx.createRadialGradient(cx-radius*.13,cy-radius*.15,0,cx,cy,radius*.5);
    core.addColorStop(0,'rgba('+color.map(c=>Math.min(255,c+60)).join(',')+',.9)');
    core.addColorStop(1,'rgba('+color.join(',')+',.45)');
    ctx.fillStyle=core;ctx.beginPath();ctx.arc(cx,cy,radius*.49,0,Math.PI*2);ctx.fill();
    const c=Math.cos(angle),s=Math.sin(angle);
    const projected=points.map(p=>({x:p.x*c+p.z*s,y:p.y,z:p.z*c-p.x*s})).sort((a,b)=>a.z-b.z);
    projected.forEach(p=> {
      const depth=(p.z+1)/2;
      ctx.fillStyle='rgba('+color.join(',')+','+(.16+depth*.64)+')';
      ctx.beginPath();ctx.arc(cx+p.x*radius,cy+p.y*radius,1+depth*1.8,0,Math.PI*2);ctx.fill();
    });
    ctx.strokeStyle='rgba('+color.join(',')+',.3)';ctx.lineWidth=.8;
    ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);ctx.stroke();
    stage.classList.add('canvas-ready');
  }
  function shouldAnimateCanvas() { return ctx && motion && $('#s03').classList.contains('in-view') && !document.hidden && !hasDialog(); }
  function tick(time) {
    canvasFrame=0;
    if (!shouldAnimateCanvas()) { lastTime=0; return; }
    if (time-lastTime>=40) { angle+=.006;drawParticle();lastTime=time; }
    canvasFrame=requestAnimationFrame(tick);
  }
  function syncCanvas() {
    if (shouldAnimateCanvas() && !canvasFrame) canvasFrame=requestAnimationFrame(tick);
    else if (!shouldAnimateCanvas() && canvasFrame) { cancelAnimationFrame(canvasFrame);canvasFrame=0;lastTime=0; }
  }
  function applyMotion() {
    motion=!userPaused && !reduced.matches && !connection?.saveData;
    document.documentElement.classList.toggle('motion-on',motion);
    document.body.classList.toggle('motion-paused',!motion || document.hidden);
    motionButton.setAttribute('aria-pressed',String(motion));
    motionButton.setAttribute('aria-label',motion?'Остановить анимацию':'Включить анимацию');
    motionButton.disabled=reduced.matches || !!connection?.saveData;
    motionButton.title=motionButton.disabled?'Движение отключено системной настройкой':'';
    $('path',motionButton).setAttribute('d',motion?'M9 6v12M15 6v12':'m9 6 9 6-9 6Z');
    if (!motion) scenes.forEach(scene=>scene.style.removeProperty('--photo-scale'));
    syncVideos();syncCanvas();requestScroll();
  }
  motionButton.addEventListener('click',()=>{userPaused=!userPaused;applyMotion();});
  reduced.addEventListener('change',applyMotion);
  connection?.addEventListener('change',applyMotion);
  document.addEventListener('visibilitychange',()=> {applyMotion();if(document.hidden)reel.pause();});
  new ResizeObserver(resizeCanvas).observe(stage);
  resizeCanvas();updateScroll();applyMotion();

  // Deterministic offline film rendering uses the actual presentation, no CDN.
  if (new URLSearchParams(location.search).has('render')) {
    userPaused=true;applyMotion();
    document.body.classList.add('render-mode');
    window.verbaFrame = async (id,time) => {
      const scene=$('#'+id);
      document.body.dataset.renderScene=id;
      scenes.forEach(item=>item.classList.toggle('render-active',item===scene));
      scene.classList.add('in-view');
      if(scene.classList.contains('photo')) scene.style.setProperty('--photo-scale',String(1.012+time*.007));
      angle=time*.15;drawParticle();
      scene.getAnimations({subtree:true}).forEach(animation=>{animation.pause();animation.currentTime=time*1000;});
      const video=$('video[data-ambient]',scene);
      if(video){
        loadVideo(video);
        if(video.readyState<1) await new Promise(resolve=>video.addEventListener('loadedmetadata',resolve,{once:true}));
        video.pause();
        const target=(time+(id==='s01'?8:0))%video.duration;
        if(Math.abs(video.currentTime-target)>.015) await new Promise(resolve=>{video.addEventListener('seeked',resolve,{once:true});video.currentTime=target;});
        video.classList.add('ready');
      }
      if(id==='s09') $('#package').style.transform='rotate(2deg) rotateY('+(-12+Math.min(1,time/2)*180)+'deg)';
    };
  }
})();
