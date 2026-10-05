'use strict';
(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const scenes = $$('#lecture > .scene');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection;
  const mobileReading = matchMedia('(max-width:1100px)');
  const motionButton = $('#motion-toggle');
  const ambient = $$('video[data-ambient]');
  const film = $('#film-dialog');
  const reel = $('#showreel');
  const notes = $('#note-dialog');
  const contents = $('#contents-dialog');
  const origins = new Map();
  const visibleVideos = new Set();
  const reducedData = () => reduced.matches || !!connection?.saveData;
  let motion = false;
  let userPaused = false;
  let activeIndex = 0;
  let scrollFrame = 0;
  let turned = false;
  let labelIndex = 0;
  let labelTimers = [];
  const completedDays = new Set();
  const params = new URLSearchParams(location.search);
  const renderMode = params.has('render');
  const reviewMode = params.has('review');
  document.documentElement.classList.toggle('review-mode', reviewMode);
  document.documentElement.classList.add('js');
  $$('.fibre-path>div').forEach((el, i) => el.style.setProperty('--index', i));
  // Keep the portrait composition; only the order of its quiet context reveal changes.
  $$('.context-term').forEach((el, i) => el.style.setProperty('--index', [1,0,3,2,4,5][i]));
  const hasDialog = () => !!$('dialog[open]');

  function loadVideo(video) {
    const source = $('source', video);
    if (source && !source.getAttribute('src')) {
      source.src = source.dataset.src;
      video.load();
    }
  }
  function isOneShot(video) { return video.dataset.playback === 'once'; }
  function allowedToPlay(video) {
    return motion && !video.ended && visibleVideos.has(video) && !document.hidden && !hasDialog() && !renderMode;
  }
  function syncVideos() {
    ambient.forEach(video => {
      if (!allowedToPlay(video)) { video.pause(); return; }
      loadVideo(video);
      if (!video.paused) return;
      video.play().then(() => {
        if (!allowedToPlay(video)) { video.pause(); return; }
        video.classList.add('ready');
        if (isOneShot(video)) video.dataset.playbackState = 'playing';
      }).catch(() => {
        video.classList.remove('ready');
      });
    });
  }
  ambient.forEach(video => {
    const failed = () => {
      video.classList.remove('ready');
    };
    video.addEventListener('error', failed);
    $('source', video)?.addEventListener('error', failed);
    if (isOneShot(video)) {
      video.loop = false;
      video.addEventListener('ended', () => {
        // Hold the final frame while the scene is visible. A later visit starts
        // the action again automatically, so the story never asks for a replay.
        video.dataset.playbackState = 'complete';
        video.pause();
        video.classList.add('ready');
      });
    }
  });
  const mediaObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const video = entry.target;
      const wasVisible = visibleVideos.has(video);
      if (entry.isIntersecting) {
        visibleVideos.add(video);
        if (motion && !wasVisible && isOneShot(video)) {
          loadVideo(video);
          try { video.currentTime = 0; } catch { /* Metadata may still be loading. */ }
          video.dataset.playbackState = 'ready';
        }
      } else {
        visibleVideos.delete(video);
        video.pause();
        if (isOneShot(video) && $('source', video)?.getAttribute('src')) {
          try { video.currentTime = 0; } catch { /* Reset after metadata arrives. */ }
          video.dataset.playbackState = 'ready';
        }
      }
    });
    syncVideos();
  }, { threshold: .28 });
  ambient.forEach(video => mediaObserver.observe(video));
  const sceneObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('in-view', entry.isIntersecting));
  }, { threshold: .05 });
  scenes.forEach(scene => sceneObserver.observe(scene));

  function applyMotion() {
    motion = !userPaused && !reducedData() && !renderMode;
    document.documentElement.classList.toggle('motion-on', motion);
    document.body.classList.toggle('motion-paused', !motion || document.hidden);
    motionButton.setAttribute('aria-pressed', String(motion));
    motionButton.setAttribute('aria-label', motion ? 'Остановить анимацию' : 'Включить анимацию');
    motionButton.disabled = reducedData();
    motionButton.title = motionButton.disabled ? 'Движение отключено системной настройкой' : '';
    $('#motion-state').textContent = reducedData() ? 'Статично' : (motion ? 'Вкл' : 'Выкл');
    $('#motion-status').hidden = !reducedData();
    document.documentElement.classList.toggle('device-static', reducedData());
    if (reducedData()) motionButton.setAttribute('aria-label', 'Статичный режим устройства: анимация отключена');
    $('path', motionButton).setAttribute('d', motion ? 'M9 6v12M15 6v12' : 'm9 6 9 6-9 6Z');
    if (reducedData()) ambient.forEach(video => {
      const source = $('source', video);
      if (source?.hasAttribute('src')) {
        video.pause(); source.removeAttribute('src'); video.load(); video.classList.remove('ready');
      }
    });
    if (!motion) stopLabelSequence();
    syncVideos();
  }
  motionButton.addEventListener('click', () => { userPaused = !userPaused; applyMotion(); });
  reduced.addEventListener('change', applyMotion);
  connection?.addEventListener('change', applyMotion);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { reel.pause(); stopLabelSequence(); }
    applyMotion();
  });

  function openDialog(dialog, invoker) {
    if (dialog.open) return;
    origins.set(dialog, invoker);
    dialog.showModal();
    document.body.classList.add('dialog-open');
    stopLabelSequence(); syncVideos();
  }
  function closeDialog(dialog) {
    if (!dialog.open) return;
    if (dialog === film) reel.pause();
    dialog.close();
  }
  $$('[data-close-dialog]').forEach(button => button.addEventListener('click', () => closeDialog(button.closest('dialog'))));
  $$('dialog').forEach(dialog => {
    dialog.addEventListener('cancel', () => { if (dialog === film) reel.pause(); });
    dialog.addEventListener('close', () => {
      if (dialog === film) reel.pause();
      if (!hasDialog()) document.body.classList.remove('dialog-open');
      origins.get(dialog)?.focus({ preventScroll: true });
      syncVideos();
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
    const number = document.createElement('span');
    link.href = '#' + scene.id; number.textContent = String(index + 1).padStart(2, '0');
    link.append(number, scene.dataset.title);
    link.addEventListener('click', () => {
      closeDialog(contents);
      setTimeout(() => { scene.tabIndex = -1; scene.focus({ preventScroll: true }); }, 0);
    });
    return link;
  });
  $('#contents-list').replaceChildren(...contentsLinks);
  $$('[data-note]').forEach(link => link.addEventListener('click', event => {
    const source = $('#note-' + link.dataset.note);
    if (!source) return;
    event.preventDefault();
    $('#note-title').textContent = $('summary', source).textContent;
    $('#note-content').replaceChildren(...[...source.children].filter(child => child.tagName !== 'SUMMARY').map(child => child.cloneNode(true)));
    openDialog(notes, link);
  }));
  const films = {
    foyer: {
      src: 'assets/foyer-film.mp4', poster: '../v5-astra/assets/s01-hero-motion-poster.webp',
      title: 'Внутри обычного дня',
      label: 'Фильм VERBA для фойе, 26 секунд, без звука',
      caption: 'VERBA · Внутри обычного дня · 00:26 · Без звука'
    },
    s03: {
      src: '../v5-astra/assets/s03-lipoprotein-motion-web.mp4', poster: '../v5-astra/assets/s03-lipoprotein-motion-poster.webp',
      title: 'Холестерин не плавает сам',
      label: 'Концептуальный разрез ЛПНП, 2 секунды',
      caption: '00:02 · Сгенерированный концептуальный разрез ЛПНП · Цвет, форма и масштаб условны'
    }
  };
  $$('[data-open-film]').forEach(button => button.addEventListener('click', () => {
    // No film receives a src until an explicit request, including Save-Data mode.
    const selected = films[button.dataset.film] || films.foyer;
    const source = $('source', reel);
    reel.pause();
    if (reel.readyState >= 1) reel.currentTime = 0;
    source.removeAttribute('src');
    source.dataset.src = selected.src;
    reel.poster = selected.poster;
    reel.setAttribute('aria-label', selected.label);
    $('#film-title').textContent = selected.title;
    $('.film-caption', film).textContent = selected.caption;
    $('#film-error').hidden = true;
    openDialog(film, button); loadVideo(reel);

    reel.play().catch(() => { /* Native controls remain available. */ });
  }));
  const filmError = () => { $('#film-error').hidden = false; };
  reel.addEventListener('error', filmError);
  $('source', reel).addEventListener('error', filmError);

  function actionLabel(button, label, iconName) {
    const paths = {
      external: 'M6 18 18 6M6 6h12v12',
      return: 'M18 6 6 18M6 6v12h12',
      rotate: 'M20 7v5h-5M20 12a8 8 0 1 0-2.3 5.7'
    };
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'ui-icon'); svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', paths[iconName]); svg.append(path);
    button.replaceChildren(document.createTextNode(label + ' '), svg);
  }
  function selectGroup(attribute, index) {
    $$('[' + attribute + ']').forEach(button => button.setAttribute('aria-pressed', String(Number(button.getAttribute(attribute)) === index)));
  }
  function beat(scene) {
    scene.classList.remove('change-beat');
    requestAnimationFrame(() => scene.classList.add('change-beat'));
  }
  const lipidStates = [
    ['carrier', 'Ему нужен переносчик.\nЛПНП и ЛПВП — классы липопротеинов.'],
    ['cargo', 'ХС-ЛПНП и ХС-ЛПВП показывают\nхолестерин в соответствующих переносчиках.'],
    ['apob', 'Холестерин и число переносчиков —\nразные вопросы. ApoB помогает увидеть второй.']
  ];
  function showLipidLayer(index, detail = true) {
    const scene = $('#s03');
    scene.dataset.beat = lipidStates[index][0];
    scene.dataset.detail = String(detail);
    $('.carrier-label', scene).hidden = index !== 0;
    $('.cargo-label', scene).hidden = index !== 1;
    $('.cargo-branch', scene).hidden = index !== 1;
    $('.lipid-key', scene).hidden = index !== 0 || !detail;
    $('#apob-beat').hidden = index !== 2;
  }
  showLipidLayer(0, false);
  $$('[data-lipid]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.lipid);
    selectGroup('data-lipid', index);
    showLipidLayer(index);
    $('#lipid-message').textContent = lipidStates[index][1];
    // The picture remains an LDL cutaway, never relabelled as an HDL particle.
    beat($('#s03'));
  }));
  $('#swap-toggle').addEventListener('click', () => {
    const active = $('#swap-toggle').getAttribute('aria-pressed') !== 'true';
    $('#swap-toggle').setAttribute('aria-pressed', String(active));
    actionLabel($('#swap-toggle'), active ? 'Вернуться к общей картине' : 'Показать принцип замены', active ? 'return' : 'external');
    $('#swap-note').hidden = !active;
    $('#s04').classList.toggle('swap-active', active);
  });
  const proteinMessages = ['Рыба сегодня.\nБобовые в другой день.', 'Бобовые сегодня.\nРыба в другой день.'];
  $$('[data-protein]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.protein); selectGroup('data-protein', index);
    $('#protein-message').textContent = proteinMessages[index]; beat($('#s07'));
  }));

  const labelMessages = [
    'Насыщенные жиры — отдельно\nот общего количества жира.',
    'Соль сравнивайте с солью,\nнатрий — с натрием.',
    'Добавленные сахара: если строки нет,\nпроверьте сахар и сиропы в составе.',
    'Сравнивайте одинаковое количество.\nУчитывайте свою реальную порцию.'
  ];
  function stopLabelSequence() { labelTimers.forEach(clearTimeout); labelTimers = []; }
  function setLabel(index) {
    labelIndex = index;
    selectGroup('data-label', index); selectGroup('data-label-step', index);
    if (turned) $('#label-message').textContent = labelMessages[index];
  }
  function setTurn(value, guided = false) {
    stopLabelSequence(); turned = value;
    $('#package').classList.toggle('turned', value);
    $('#package-turn').setAttribute('aria-pressed', String(value));
    actionLabel($('#package-turn'), value ? 'Вернуть лицевую сторону' : 'Повернуть упаковку', 'rotate');
    $('.package-front').inert = value; $('.package-back').inert = !value;
    $('.package-front').setAttribute('aria-hidden', String(value));
    $('.package-back').setAttribute('aria-hidden', String(!value));
    $('#label-message').textContent = value ? labelMessages[labelIndex] : 'Обещание — спереди.\nИнформация — на обороте.';
    if (value && guided && motion && !document.hidden && !mobileReading.matches) {
      setLabel(0);
      for (let index = 1; index < 4; index++) labelTimers.push(setTimeout(() => {
        if (turned && $('#s09').classList.contains('in-view') && !hasDialog() && !document.hidden) setLabel(index);
      }, 950 + index * 1600));
    }
  }
  $('#package-turn').addEventListener('click', () => setTurn(!turned));
  $$('[data-label],[data-label-step]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.label ?? button.dataset.labelStep);
    stopLabelSequence(); if (!turned) setTurn(true); setLabel(index);
  }));
  // A keyboard user can inspect each row without an automatic sequence changing it.
  $('.label-fields').addEventListener('focusin', stopLabelSequence);
  $('.label-index').addEventListener('focusin', stopLabelSequence);

  const riskStates = [
    ['Клинический контекст / курение', 'Без курения', 'Курение', 'Наличие курения меняет оценку общего риска.'],
    ['Клинический контекст / давление', 'Давление в цели', 'Повышенное давление', 'Артериальное давление учитывают вместе с остальными факторами.'],
    ['Клинический контекст / наследственность', 'Без ранних событий', 'Ранние семейные события', 'Ранняя семейная история сердечно-сосудистых событий важна для оценки.']
  ];
  $$('[data-risk]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.risk); selectGroup('data-risk', index);
    ['risk-factor', 'risk-a', 'risk-b', 'risk-message'].forEach((id, i) => $('#' + id).textContent = riskStates[index][i]);
    beat($('#s10'));
  }));
  const questions = [
    'Каков мой общий сердечно-сосудистый риск?',
    'Какая цель по ХС-ЛПНП подходит мне?',
    'Что изменить и когда оценить результат?'
  ];
  $$('[data-question]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.question); selectGroup('data-question', index);
    $('#question-number').textContent = String(index + 1).padStart(2, '0');
    $('#question-text').textContent = questions[index]; beat($('#s12'));
  }));
  const habits = [
    ['Заменять часть сливочного масла\nрастительным в привычном блюде.', 'Меняю источник жира'],
    ['Добавлять овёс или бобовые\nв привычный рацион с учётом переносимости.', 'Выбираю овёс или бобовые'],
    ['Выбирать воду или несладкий напиток\nвместо привычного сладкого.', 'Выбираю несладкий напиток']
  ];
  $$('[data-habit]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.habit); selectGroup('data-habit', index);
    $('#habit-message').textContent = habits[index][0]; $('#habit-title').textContent = habits[index][1];
    beat($('#s13'));
  }));
  $$('[data-day]').forEach(button => button.addEventListener('click', () => {
    const day = Number(button.dataset.day);
    if (completedDays.has(day)) completedDays.delete(day); else completedDays.add(day);
    const checked = completedDays.has(day);
    button.setAttribute('aria-pressed', String(checked));
    button.setAttribute('aria-label', (checked ? 'Убрать отметку за день ' : 'Отметить день ') + day);
    $('#practice-status').textContent = completedDays.size ? 'Отметок практики: ' + completedDays.size + ' из 14. Это не показатель изменения анализов.' : 'Период практики, не срок изменения анализов.';
  }));

  const previous = $('#previous-scene'); const next = $('#next-scene');
  addEventListener('keydown', event => {
    if (hasDialog() || renderMode || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target.closest('button,a,input,textarea,select,summary,[contenteditable]')) return;
    const delta = { ArrowRight: 1, PageDown: 1, ArrowLeft: -1, PageUp: -1 }[event.key];
    if (!delta) return;
    event.preventDefault();
    const target = scenes[Math.max(0, Math.min(scenes.length - 1, activeIndex + delta))];
    location.hash = target.id;
  });
  function updateScroll() {
    scrollFrame = 0;
    // Reconcile the device policy on layout/scroll as well as MediaQueryList change.
    if (motion !== (!userPaused && !reducedData() && !renderMode)) applyMotion();
    const target = innerHeight * .46;
    let distance = Infinity;
    scenes.forEach((scene, index) => {
      if (getComputedStyle(scene).display === 'none') return;
      const rect = scene.getBoundingClientRect();
      const gap = rect.top <= target && rect.bottom >= target ? 0 : Math.min(Math.abs(rect.top - target), Math.abs(rect.bottom - target));
      if (gap < distance) { distance = gap; activeIndex = index; }
    });
    $('#scene-number').textContent = String(activeIndex + 1).padStart(2, '0');
    previous.href = '#' + scenes[Math.max(0, activeIndex - 1)].id;
    next.href = '#' + scenes[Math.min(scenes.length - 1, activeIndex + 1)].id;
    previous.setAttribute('aria-disabled', String(activeIndex === 0));
    next.setAttribute('aria-disabled', String(activeIndex === scenes.length - 1));
    previous.tabIndex = activeIndex === 0 ? -1 : 0; next.tabIndex = activeIndex === scenes.length - 1 ? -1 : 0;
    contentsLinks.forEach((link, index) => {
      if (index === activeIndex) link.setAttribute('aria-current', 'step'); else link.removeAttribute('aria-current');
    });
    const appendix = $('#sources').getBoundingClientRect().top < innerHeight * .35;
    document.body.classList.toggle('dark-ui', !appendix && scenes[activeIndex].classList.contains('dark'));
    const total = document.documentElement.scrollHeight - innerHeight;
    $('#page-progress').style.transform = 'scaleX(' + Math.min(1, Math.max(0, scrollY / Math.max(1, total))) + ')';
    if (activeIndex !== 8) stopLabelSequence();
  }
  function requestScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }
  addEventListener('scroll', requestScroll, { passive: true });
  addEventListener('resize', requestScroll);
  addEventListener('hashchange', requestScroll);
  // Fit unusually enlarged text without clipping the outer scene.
  function fitReadingMode() {
    if (renderMode || mobileReading.matches) return;
    const expected = Math.min(124, Math.max(68, innerWidth * .0645));
    const enlarged = parseFloat(getComputedStyle($('#h01')).fontSize) > expected * 1.45;
    document.documentElement.classList.toggle('text-enlarged', enlarged);
  }
  const pendingText = new Set();
  let fitFrame = 0;
  const textObserver = new ResizeObserver(entries => {
    entries.forEach(({target}) => pendingText.add(target));
    if (fitFrame) return;
    // Read and write on the next frame, outside ResizeObserver's delivery cycle.
    fitFrame = requestAnimationFrame(() => {
      fitFrame = 0; fitReadingMode();
      const targets = [...pendingText]; pendingText.clear();
      targets.forEach(target => {
        const scene = target.closest('.scene');
        if (!scene || renderMode || document.body.classList.contains('render-mode') || document.documentElement.classList.contains('text-enlarged') || getComputedStyle(target).display === 'contents') return;
        const padding = parseFloat(getComputedStyle(scene).paddingTop);
        const available = scene.clientHeight - padding - 115;
        if (target.scrollHeight > available) scene.style.minHeight = (target.scrollHeight + padding + 140) + 'px';
      });
    });
  });
  $$('.scene-copy,.question-paper,h1,h2').forEach(copy => textObserver.observe(copy));
  if (reviewMode) {
    const status = document.createElement('p'); status.className = 'review-status';
    status.textContent = 'V6 · Review · Медицинское согласование не завершено';
    document.body.append(status);
  }
  applyMotion(); updateScroll();

  // Browser fragment restoration can precede the final image/font layout.
  // Real deep links receive one settled alignment, unless the user has taken over.
  function alignInitialDeepLink() {
    if (renderMode || !/^#s(0[1-9]|1[0-4])$/.test(location.hash)) return;
    if (performance.getEntriesByType('navigation')[0]?.type === 'back_forward') return;
    const initialHash = location.hash;
    const target = $(initialHash);
    if (!target) return;
    let cancelled = false;
    const listeners = new AbortController();
    const cancel = () => { cancelled = true; listeners.abort(); };
    for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown']) {
      addEventListener(event, cancel, { capture: true, passive: true, signal: listeners.signal });
    }
    addEventListener('hashchange', () => { if (location.hash !== initialHash) cancel(); }, { signal: listeners.signal });
    addEventListener('popstate', cancel, { signal: listeners.signal });
    const pageLoaded = document.readyState === 'complete' ? Promise.resolve() : new Promise(resolve => addEventListener('load', resolve, { once: true }));
    const fontsReady = document.fonts?.ready || Promise.resolve();
    const picturesReady = Promise.all($$('img', target).map(img => img.decode().catch(() => {})));
    const twoFrames = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    Promise.all([pageLoaded, fontsReady, picturesReady]).then(twoFrames).then(() => {
      if (cancelled || location.hash !== initialHash || hasDialog()) return;
      target.scrollIntoView({ behavior: 'instant', block: 'start' });
      document.body.dataset.initialAnchorAligned = target.id;
      updateScroll();
    }).catch(() => {}).finally(() => listeners.abort());
  }
  alignInitialDeepLink();

  // Deterministic still capture only. The separate animatic is not a screen recording.
  window.verbaFrame = async (id, time = 0) => {
    delete document.body.dataset.renderReady;
    const scene = $('#' + id);
    if (!scene || !scenes.includes(scene)) throw new Error('Unknown scene: ' + id);
    document.body.classList.add('render-mode');
    scenes.forEach(item => item.classList.toggle('render-active', item === scene));
    scene.classList.add('in-view');
    scene.scrollIntoView({ behavior: 'instant', block: 'start' });
    await Promise.all($$('img', scene).map(img => img.decode().catch(() => {})));
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    scene.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time * 1000; });
    updateScroll();
    document.body.dataset.renderReady = id;
  };
  if (renderMode) {
    const requested = new URLSearchParams(location.search).get('render');
    const id = /^s\d\d$/.test(requested || '') ? requested : (location.hash.slice(1) || 's01');
    window.verbaFrame(id).catch(() => window.verbaFrame('s01'));
  }
})();
