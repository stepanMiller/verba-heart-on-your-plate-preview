'use strict';
(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const sections = $$('main > section');
  const header = $('#masthead');
  const contents = $('#contents');
  const contentsToggle = $('#contents-toggle');
  const motionButton = $('#ambient-toggle');
  const heroVideo = $('#hero-video');
  const film = $('#film-dialog');
  const introVideo = $('#intro-film');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 760px)');
  let motion = !reduce.matches;
  let userPaused = false;
  let activeSection = 0;
  let framePending = false;
  let lipidIndex = 0;
  let foodIndex = 0;

  $('#contents-links').replaceChildren(...sections.map((section, i) => {
    const a = document.createElement('a');
    a.href = '#' + section.id;
    const number = document.createElement('span');
    number.textContent = String(i + 1).padStart(2, '0');
    a.append(number, section.dataset.title);
    return a;
  }));
  $('#chapter-rail').replaceChildren(...sections.map((section, i) => {
    const a = document.createElement('a');
    a.href = '#' + section.id;
    a.setAttribute('aria-label', `${i + 1}. ${section.dataset.title}`);
    a.title = section.dataset.title;
    return a;
  }));
  const menuLinks = $$('#contents-links a');
  const railLinks = $$('#chapter-rail a');
  function setMenu(open, restoreFocus = false) {
    contents.hidden = !open;
    contentsToggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
    if (open) menuLinks[activeSection]?.focus({ preventScroll: true });
    if (!open && restoreFocus) contentsToggle.focus({ preventScroll: true });
  }
  contentsToggle.addEventListener('click', () => setMenu(contents.hidden));
  contents.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', e => {
    if (!contents.hidden && !contents.contains(e.target) && !contentsToggle.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !contents.hidden) { setMenu(false, true); return; }
    if (e.key !== 'Tab' || contents.hidden) return;
    const controls = [contentsToggle, ...menuLinks];
    const i = controls.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); controls.at(-1).focus(); }
    else if (!e.shiftKey && i === controls.length - 1) { e.preventDefault(); controls[0].focus(); }
  });
  // Native wheel, keyboard, touch and anchors remain untouched. There is no slide switcher.
  const revealNodes = $$('[data-reveal]');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: .08, rootMargin: '0px 0px -35px 0px' });
  revealNodes.forEach(node => revealObserver.observe(node));

  function loadVideo(video) {
    const source = $('source', video);
    if (!source.src && source.dataset.src) { source.src = source.dataset.src; video.load(); }
  }
  function syncHeroVideo() {
    // Keep mobile data use small; CSS still animates the poster on narrow screens.
    const shouldPlay = motion && !narrow.matches && activeSection === 0 && !document.hidden;
    if (shouldPlay) {
      loadVideo(heroVideo);
      heroVideo.play().then(() => heroVideo.classList.add('ready')).catch(() => { heroVideo.classList.remove('ready'); });
    } else { heroVideo.pause(); heroVideo.classList.remove('ready'); }
  }
  function applyMotion() {
    motion = !userPaused && !reduce.matches;
    document.documentElement.classList.toggle('motion-enabled', motion);
    document.body.classList.toggle('motion-paused', !motion);
    motionButton.setAttribute('aria-pressed', String(motion));
    motionButton.setAttribute('aria-label', motion ? 'Остановить анимацию' : 'Включить анимацию');
    $('path', motionButton).setAttribute('d', motion ? 'M8 6v12M16 6v12' : 'm9 6 9 6-9 6Z');
    motionButton.disabled = reduce.matches;
    motionButton.title = reduce.matches ? 'Анимация выключена настройкой уменьшения движения' : '';
    if (!motion) revealNodes.forEach(node => node.classList.add('revealed'));
    syncHeroVideo();
    syncCanvas();
    requestUpdate();
  }
  motionButton.addEventListener('click', () => { userPaused = !userPaused; applyMotion(); });
  reduce.addEventListener('change', applyMotion);
  narrow.addEventListener('change', () => { resizeCanvas(); syncHeroVideo(); requestUpdate(); });

  const swaps = [
    ['Часть сливочного масла', 'Жидкое растительное масло', 'Подходящее масло и количество зависят от блюда.'],
    ['Привычный сладкий перекус', 'Несолёные орехи или фрукт', 'Вариант и порцию выбирают с учётом рациона и переносимости.'],
    ['Часть мясных блюд', 'Фасоль, нут или чечевица', 'Попробуйте привычный рецепт с другим источником белка.']
  ];
  function selectSwap(index) {
    $$('[data-swap]').forEach((b, i) => { b.setAttribute('aria-selected', String(i === index)); b.tabIndex = i === index ? 0 : -1; });
    $('#swap-from').textContent = swaps[index][0];
    $('#swap-to').textContent = swaps[index][1];
    $('#swap-explain').textContent = swaps[index][2];
    $('#swap-panel').setAttribute('aria-labelledby', `swap-tab-${index}`);
  }
  $$('[data-swap]').forEach(button => {
    button.addEventListener('click', () => selectSwap(Number(button.dataset.swap)));
    button.addEventListener('keydown', e => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      let i = Number(button.dataset.swap);
      i = e.key === 'Home' ? 0 : e.key === 'End' ? 2 : (i + (e.key === 'ArrowRight' ? 1 : 2)) % 3;
      selectSwap(i); $(`[data-swap="${i}"]`).focus();
    });
  });
  const labelDetails = [
    'Сравните содержание в одинаковом количестве продукта, если оно указано.',
    'Посмотрите содержание соли или натрия. Сравнивайте одинаковые единицы.',
    'Проверьте состав: сахар и сиропы могут входить в продукт под разными названиями.',
    'Сопоставляйте похожие продукты и обращайте внимание на размер вашей порции.'
  ];
  $$('[data-label]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.label);
    $$('[data-label]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    $$('[data-label-line]').forEach((line, i) => line.classList.toggle('highlighted', i === index));
    $('#label-detail').textContent = labelDetails[index];
  }));
  const riskDetails = [
    'Были ли ранние сердечно-сосудистые события у близких родственников?',
    'Каково давление при корректных повторных измерениях?',
    'Есть ли курение сейчас или в прошлом?',
    'Как возраст меняет оценку общего риска?'
  ];
  $$('[data-risk]').forEach(button => button.addEventListener('click', () => {
    $$('[data-risk]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    $('#risk-detail').textContent = riskDetails[Number(button.dataset.risk)];
  }));
  $$('[data-habit]').forEach(button => button.addEventListener('click', () => {
    $$('[data-habit]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    $('#habit-result').textContent = `Мой шаг на две недели: ${button.dataset.habit.toLowerCase()}.`;
  }));

  $('#film-toggle').addEventListener('click', () => {
    setMenu(false);
    film.showModal();
    loadVideo(introVideo);
    introVideo.currentTime = 0;
    introVideo.play().catch(() => {});
    $('#film-close').focus();
  });
  $('#film-close').addEventListener('click', () => film.close());
  film.addEventListener('close', () => { introVideo.pause(); $('#film-toggle').focus({ preventScroll: true }); });
  film.addEventListener('click', e => {
    if (e.target !== film) return;
    const r = film.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) film.close();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) introVideo.pause();
    syncHeroVideo(); syncCanvas();
  });

  // A conceptual spherical particle field. No measured quantities or forecast are encoded.
  const canvas = $('#lipid-canvas');
  const ctx = canvas.getContext('2d');
  let cw = 500, ch = 650, canvasVisible = false, canvasFrame = 0, lastPaint = 0;
  const particles = Array.from({ length: 220 }, (_, i) => {
    const phi = Math.acos(1 - 2 * (i + .5) / 220), theta = Math.PI * (3 - Math.sqrt(5)) * i;
    return { x: Math.sin(phi) * Math.cos(theta), y: Math.cos(phi), z: Math.sin(phi) * Math.sin(theta), r: 1 + (i % 5) * .28 };
  });
  function resizeCanvas() {
    const bounds = canvas.getBoundingClientRect();
    cw = bounds.width || 500; ch = bounds.height || 650;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintParticles(motion ? performance.now() : 0);
  }
  function paintParticles(now) {
    if (!ctx) return;
    const t = now * .00013, cx = cw / 2, cy = ch * .48;
    const radius = Math.min(cw * .35, ch * .32), rotation = t + lipidIndex * .5;
    ctx.clearRect(0, 0, cw, ch);
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 1.65);
    glow.addColorStop(0, ['#db94592c', '#adba7d20', '#c0ae7024'][lipidIndex]);
    glow.addColorStop(.65, '#91aa5a0a'); glow.addColorStop(1, '#91aa5a00');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, cw, ch);
    for (let i = 0; i < 3; i++) {
      ctx.beginPath(); ctx.ellipse(cx, cy, radius * (1.22 + i * .15), radius * (.42 + i * .14), rotation * .2 + i * .65, 0, Math.PI * 2);
      ctx.strokeStyle = '#b7c79626'; ctx.lineWidth = .6; ctx.stroke();
    }
    const projected = particles.map(p => {
      const x = p.x * Math.cos(rotation) - p.z * Math.sin(rotation), z = p.x * Math.sin(rotation) + p.z * Math.cos(rotation);
      const perspective = 1.5 / (1.5 + z * .35);
      return { x: cx + x * radius * perspective, y: cy + p.y * radius * perspective, z, r: p.r * perspective };
    }).sort((a, b) => b.z - a.z);
    projected.forEach(p => {
      const alpha = .32 + (1 - p.z) * .27;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${lipidIndex === 0 ? '232,177,124' : lipidIndex === 1 ? '196,208,158' : '218,198,141'},${alpha})`;
      ctx.fill();
    });
    const pulse = 1 + Math.sin(now * .0015) * .018;
    ctx.beginPath(); ctx.arc(cx, cy, radius * .55 * pulse, 0, Math.PI * 2);
    ctx.strokeStyle = '#d2cfa94f'; ctx.lineWidth = .6; ctx.stroke();
  }
  function canvasTick(now) {
    canvasFrame = 0;
    if (!motion || !canvasVisible || document.hidden || !ctx) return;
    if (now - lastPaint > (narrow.matches ? 35 : 25)) { paintParticles(now); lastPaint = now; }
    canvasFrame = requestAnimationFrame(canvasTick);
  }
  function syncCanvas() {
    if (motion && canvasVisible && !document.hidden && ctx) { if (!canvasFrame) canvasFrame = requestAnimationFrame(canvasTick); }
    else { cancelAnimationFrame(canvasFrame); canvasFrame = 0; paintParticles(0); }
  }
  new ResizeObserver(resizeCanvas).observe(canvas);
  new IntersectionObserver(entries => {
    canvasVisible = entries[0].isIntersecting; syncCanvas();
  }, { threshold: 0 }).observe(canvas);

  const lipidBeats = $$('[data-lipid]');
  const foodBeats = $$('[data-food]');
  function nearestBeat(beats) {
    let index = 0, distance = Infinity;
    beats.forEach((beat, i) => { const r = beat.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - innerHeight / 2); if (d < distance) { distance = d; index = i; } });
    return index;
  }
  function update() {
    framePending = false;
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    $('#progress-bar').style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    let current = 0;
    sections.forEach((section, i) => { if (section.getBoundingClientRect().top <= innerHeight * .4) current = i; });
    if (current !== activeSection) { activeSection = current; syncHeroVideo(); }
    header.classList.toggle('light', !sections[current].classList.contains('inverse'));
    header.classList.toggle('dark', sections[current].classList.contains('inverse') && current !== 0);
    menuLinks.forEach((a, i) => { if (i === current) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
    railLinks.forEach((a, i) => { if (i === current) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
    const lipid = nearestBeat(lipidBeats);
    if (lipid !== lipidIndex) {
      lipidIndex = lipid;
      const name = ['ЛПНП', 'ЛПВП', 'ТГ'][lipid];
      $('#orbital-name').textContent = name; $('#lipid-stage-label').textContent = `${name} · липидный профиль`;
      $$('.orbital-index span').forEach((s, i) => s.classList.toggle('active', i === lipid));
      if (!motion) paintParticles(0);
    }
    foodIndex = nearestBeat(foodBeats);
    $$('.food-pin').forEach((pin, i) => pin.classList.toggle('active', i === foodIndex));
    const pattern = $('#s08').getBoundingClientRect();
    if (motion && pattern.top < innerHeight && pattern.bottom > 0) {
      const p = (innerHeight - pattern.top) / (innerHeight + pattern.height);
      $('.pattern-photo').style.transform = `translateY(${(p - .5) * 35}px) scale(1.08)`;
    } else if (!motion) $('.pattern-photo').style.transform = 'none';
  }
  function requestUpdate() { if (!framePending) { framePending = true; requestAnimationFrame(update); } }
  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', requestUpdate, { passive: true });
  addEventListener('hashchange', () => { setMenu(false); requestUpdate(); });
  addEventListener('pageshow', requestUpdate);
  resizeCanvas(); applyMotion(); update();
})();
