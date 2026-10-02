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
    requestUpdate();
  }
  motionButton.addEventListener('click', () => { userPaused = !userPaused; applyMotion(); });
  reduce.addEventListener('change', applyMotion);
  narrow.addEventListener('change', () => { syncHeroVideo(); requestUpdate(); });

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
    syncHeroVideo();
  });

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
  applyMotion(); update();
})();
