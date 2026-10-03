'use strict';
(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const scenes = $$('main > .scene');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 720px)');
  const motionButton = $('#motion-toggle');
  const film = $('#film-dialog');
  const reel = $('#intro-film');
  const contents = $('#contents-dialog');
  const noteDialog = $('#note-dialog');
  const ambient = $$('video[data-ambient]');
  const visibleVideos = new Set();
  const returnFocus = new Map();
  let userPaused = false;
  let motion = !reduce.matches;
  let activeIndex = -1;
  let scrollFrame = 0;
  let lipidIndex = 0;
  let canvasFrame = 0;
  let lastCanvasTime = 0;
  let canvasWidth = 1;
  let canvasHeight = 1;
  let particleAngle = 0;
  const canvas = $('#lipid-canvas');
  const ctx = canvas.getContext('2d');
  const stage = canvas.parentElement;
  const particleScene = $('#s03');

  function hasDialog() { return !!$('dialog[open]'); }
  function loadVideo(video) {
    const source = $('source', video);
    const next = narrow.matches && source.dataset.mobileSrc ? source.dataset.mobileSrc : source.dataset.src;
    if (source.getAttribute('src') !== next) {
      source.src = next;
      video.muted = video !== reel;
      video.load();
    }
  }
  function syncVideos() {
    ambient.forEach(video => {
      const play = motion && visibleVideos.has(video) && !document.hidden && !hasDialog() && !navigator.connection?.saveData;
      if (!play) { video.pause(); return; }
      loadVideo(video);
      video.play().then(() => {
        if (video.paused) return;
        video.classList.add('ready');
      }).catch(() => video.classList.remove('ready'));
    });
  }
  ambient.forEach(video => video.addEventListener('error', () => video.classList.remove('ready')));
  const mediaObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleVideos.add(entry.target);
      else visibleVideos.delete(entry.target);
    });
    syncVideos();
  }, { threshold: .15 });
  ambient.forEach(video => mediaObserver.observe(video));

  function openDialog(dialog, invoker) {
    returnFocus.set(dialog, invoker);
    dialog.showModal();
    document.body.classList.add('dialog-open');
    syncVideos();
    syncCanvas();
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
      returnFocus.get(dialog)?.focus({ preventScroll: true });
      syncVideos();
      syncCanvas();
    });
    dialog.addEventListener('click', e => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeDialog(dialog);
    });
  });
  $('#menu-toggle').addEventListener('click', e => openDialog(contents, e.currentTarget));
  $$('a', contents).forEach(link => link.addEventListener('click', () => closeDialog(contents)));
  $$('[data-open-film]').forEach(button => button.addEventListener('click', () => {
    loadVideo(reel);
    openDialog(film, button);
    reel.play().catch(() => {});
  }));
  $$('[data-note]').forEach(link => link.addEventListener('click', e => {
    const source = $('#note-' + link.dataset.note);
    if (!source) return;
    e.preventDefault();
    $('#note-title').textContent = $('summary', source).textContent;
    $('#note-content').replaceChildren(...$$('p', source).map(p => p.cloneNode(true)));
    openDialog(noteDialog, link);
  }));

  function selectGroup(attribute, selected, update) {
    $$('[' + attribute + ']').forEach(button => {
      button.setAttribute('aria-pressed', String(Number(button.getAttribute(attribute)) === selected));
    });
    update(selected);
  }
  const lipidMessages = [
    'ЛПНП — один из ключевых\nориентиров профилактики.',
    'ЛПВП — часть картины.\nНе защитный щит.',
    'Триглицериды — другая сторона\nлипидного обмена.'
  ];
  $$('[data-lipid]').forEach(button => button.addEventListener('click', () => selectGroup('data-lipid', Number(button.dataset.lipid), index => {
    lipidIndex = index;
    $('#lipid-message').textContent = lipidMessages[index];
    $('#particle-name').textContent = ['ЛПНП', 'ЛПВП', 'ТГ'][index];
    drawParticle();
  })));
  const swaps = [
    ['Часть сливочного масла', 'Растительное масло', 'assets/swap.webp', 'Сливочное и растительное масло'],
    ['Привычный сладкий перекус', 'Орехи или фрукт', 'assets/food.webp', 'Орехи рядом с овощным блюдом'],
    ['Часть мясных блюд', 'Фасоль, нут, чечевица', 'assets/food.webp', 'Блюдо с нутом']
  ];
  $$('[data-swap]').forEach(button => button.addEventListener('click', () => selectGroup('data-swap', Number(button.dataset.swap), index => {
    $('#swap-from').textContent = swaps[index][0];
    $('#swap-to').textContent = swaps[index][1];
    $('#swap-image').src = swaps[index][2];
    $('#swap-image').alt = swaps[index][3];
  })));
  const fibreMessages = [
    'Нут, фасоль, чечевица.\nВ супе, салате или гарнире.',
    'Овощи и фрукты.\nРазнообразие в течение дня.',
    'Овёс и цельные злаки.\nВ привычном завтраке или гарнире.'
  ];
  $$('[data-fibre]').forEach(button => button.addEventListener('click', () => selectGroup('data-fibre', Number(button.dataset.fibre), index => {
    $('#fibre-message').textContent = fibreMessages[index];
  })));
  $$('[data-label]').forEach(button => button.addEventListener('click', () => selectGroup('data-label', Number(button.dataset.label), index => {
    $$('[data-label-line]').forEach((line, i) => line.classList.toggle('active', i === index));
  })));
  const questions = [
    ['Каков мой', 'общий риск?'],
    ['Какая цель по ЛПНП', 'подходит мне?'],
    ['Что изменить и когда', 'оценить результат?']
  ];
  $$('[data-question]').forEach(button => button.addEventListener('click', () => selectGroup('data-question', Number(button.dataset.question), index => {
    $('#question-number').textContent = String(index + 1).padStart(2, '0');
    const br = document.createElement('br');
    const em = document.createElement('em');
    em.textContent = questions[index][1];
    $('#question-text').replaceChildren(questions[index][0], br, em);
  })));
  const habits = [
    'Добавлять овощи\nк обычному блюду.',
    'Чаще выбирать\nфасоль, нут или чечевицу.',
    'Заменить часть\nнасыщенных жиров.'
  ];
  $$('[data-habit]').forEach(button => button.addEventListener('click', () => selectGroup('data-habit', Number(button.dataset.habit), index => {
    $('#habit-message').textContent = habits[index];
  })));
  $$('.calendar-dots i').forEach((dot, index) => dot.style.setProperty('--dot-index', index));

  function updateScroll() {
    scrollFrame = 0;
    const midpoint = innerHeight * .5;
    let index = scenes.length - 1;
    scenes.forEach((scene, i) => {
      const r = scene.getBoundingClientRect();
      if (r.top <= midpoint && r.bottom > midpoint) index = i;
      const visible = r.top < innerHeight * .9 && r.bottom > innerHeight * .1;
      scene.classList.toggle('in-view', visible);
      if (motion && visible && scene.classList.contains('photo')) {
        const progress = Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight + r.height)));
        scene.style.setProperty('--photo-scale', (1.012 + progress * .035).toFixed(4));
      }
    });
    if (index !== activeIndex) {
      activeIndex = index;
      $('#scene-number').textContent = String(index + 1).padStart(2, '0');
      const prev = $('#previous-scene');
      const next = $('#next-scene');
      prev.href = '#' + scenes[Math.max(0, index - 1)].id;
      next.href = '#' + scenes[Math.min(scenes.length - 1, index + 1)].id;
      prev.setAttribute('aria-disabled', String(index === 0));
      next.setAttribute('aria-disabled', String(index === scenes.length - 1));
      prev.tabIndex = index === 0 ? -1 : 0;
      next.tabIndex = index === scenes.length - 1 ? -1 : 0;
    }
    const scene = scenes[index];
    document.body.classList.toggle('dark-ui', scene.classList.contains('dark') && scene.getBoundingClientRect().bottom > innerHeight * .3);
    const total = document.documentElement.scrollHeight - innerHeight;
    $('#page-progress').style.transform = 'scaleX(' + Math.min(1, Math.max(0, scrollY / total)) + ')';
    syncCanvas();
  }
  function requestScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }
  addEventListener('scroll', requestScroll, { passive: true });
  addEventListener('resize', () => { resizeCanvas(); requestScroll(); });
  addEventListener('hashchange', requestScroll);

  const points = Array.from({ length: 1450 }, (_, i) => {
    const y = 1 - (i / 1449) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = Math.PI * (3 - Math.sqrt(5)) * i;
    return { x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius, bump: Math.sin(i * 2.19) * .028 };
  });
  const palettes = [[183,147,89], [114,139,109], [153,140,121]];
  function resizeCanvas() {
    const r = stage.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvasWidth = Math.max(1, r.width);
    canvasHeight = Math.max(1, r.height);
    canvas.width = Math.round(canvasWidth * dpr);
    canvas.height = Math.round(canvasHeight * dpr);
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawParticle();
  }
  function drawParticle() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const cx = canvasWidth * .51, cy = canvasHeight * .43;
    const radius = Math.min(canvasWidth, canvasHeight) * .34;
    const color = palettes[lipidIndex];
    const shadow = ctx.createRadialGradient(cx, cy + radius * .95, 0, cx, cy + radius * .95, radius * 1.2);
    shadow.addColorStop(0, 'rgba(86,94,59,.11)'); shadow.addColorStop(1, 'rgba(86,94,59,0)');
    ctx.fillStyle = shadow; ctx.beginPath(); ctx.ellipse(cx, cy + radius * .95, radius * 1.18, radius * .18, 0, 0, Math.PI * 2); ctx.fill();
    const body = ctx.createRadialGradient(cx - radius * .45, cy - radius * .5, radius * .05, cx, cy, radius);
    body.addColorStop(0, 'rgb(' + color.map(c => Math.min(250, c + 80)).join(',') + ')');
    body.addColorStop(.5, 'rgb(' + color.map(c => Math.min(250, c + 26)).join(',') + ')');
    body.addColorStop(1, 'rgba(' + color.map(c => Math.max(20, c - 32)).join(',') + ',.8)');
    ctx.fillStyle = body; ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.fill();
    const c = Math.cos(particleAngle), s = Math.sin(particleAngle);
    const projected = points.map(p => {
      const x = p.x * c + p.z * s, z = p.z * c - p.x * s;
      const scale = 1 + p.bump;
      return { x: cx + x * radius * scale, y: cy + p.y * radius * scale, z, size: 1.3 + (z + 1) * 1.1 };
    }).sort((a, b) => a.z - b.z);
    projected.forEach(p => {
      if (p.z < -.12) return;
      const light = .38 + .55 * (p.z + 1) / 2;
      ctx.fillStyle = 'rgba(' + color.map(v => Math.round(v * light + 50)).join(',') + ',.9)';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,230,' + (light * .4) + ')';
      ctx.beginPath(); ctx.arc(p.x - p.size * .24, p.y - p.size * .3, p.size * .38, 0, Math.PI * 2); ctx.fill();
    });
    stage.classList.add('canvas-ready');
  }
  function animateParticle(time) {
    canvasFrame = 0;
    if (!shouldAnimateCanvas()) return;
    if (time - lastCanvasTime > 32) {
      particleAngle += .0035;
      drawParticle();
      lastCanvasTime = time;
    }
    canvasFrame = requestAnimationFrame(animateParticle);
  }
  function shouldAnimateCanvas() {
    return ctx && motion && particleScene.classList.contains('in-view') && !document.hidden && !hasDialog();
  }
  function syncCanvas() {
    if (shouldAnimateCanvas() && !canvasFrame) canvasFrame = requestAnimationFrame(animateParticle);
    if (!shouldAnimateCanvas() && canvasFrame) { cancelAnimationFrame(canvasFrame); canvasFrame = 0; }
  }
  function applyMotion() {
    motion = !userPaused && !reduce.matches;
    document.documentElement.classList.toggle('motion-on', motion);
    document.body.classList.toggle('motion-paused', !motion);
    motionButton.setAttribute('aria-pressed', String(motion));
    motionButton.setAttribute('aria-label', motion ? 'Остановить анимацию' : 'Включить анимацию');
    motionButton.disabled = reduce.matches;
    motionButton.title = reduce.matches ? 'Движение отключено системной настройкой' : '';
    $('path', motionButton).setAttribute('d', motion ? 'M9 6v12M15 6v12' : 'm9 6 9 6-9 6Z');
    if (!motion) scenes.forEach(scene => scene.style.removeProperty('--photo-scale'));
    syncVideos(); syncCanvas(); requestScroll();
  }
  motionButton.addEventListener('click', () => { userPaused = !userPaused; applyMotion(); });
  reduce.addEventListener('change', applyMotion);
  narrow.addEventListener('change', syncVideos);
  document.addEventListener('visibilitychange', () => { syncVideos(); syncCanvas(); if (document.hidden) reel.pause(); });
  // Wheel, touch, PageDown and arrow keys retain their native browser behavior.
  resizeCanvas();
  updateScroll();
  applyMotion();
})();
