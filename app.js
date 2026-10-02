'use strict';

(() => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector('#masthead');
  const progress = document.querySelector('#progress-bar');
  const menuButton = document.querySelector('#contents-toggle');
  const menu = document.querySelector('#contents');
  const motionButton = document.querySelector('#motion-toggle');
  const motionLabel = motionButton.querySelector('.motion-label');
  const chapters = Array.from(document.querySelectorAll('[data-chapter]'));
  const videos = Array.from(document.querySelectorAll('[data-video-src]'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 761px)');
  const connection = navigator.connection;
  const visibleVideos = new Set();
  let paused = reducedMotion.matches || Boolean(connection && connection.saveData);
  let frameRequested = false;
  let currentChapter = '';
  let currentFood = -1;

  function closeMenu(restoreFocus) {
    menu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    if (restoreFocus) menuButton.focus();
  }
  menuButton.hidden = false;
  menuButton.addEventListener('click', () => {
    const opening = menu.hidden;
    menu.hidden = !opening;
    menuButton.setAttribute('aria-expanded', String(opening));
    if (opening) menu.querySelector('a').focus();
  });
  menu.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu(false);
  });
  document.addEventListener('click', event => {
    if (!menu.hidden && !menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) {
      event.preventDefault();
      closeMenu(true);
    }
  });

  function playVideo(video) {
    if (paused || document.hidden || !visibleVideos.has(video) || video.dataset.failed === 'true') return;
    if (!video.getAttribute('src')) {
      video.src = video.dataset.videoSrc;
      video.load();
    }
    const playing = video.play();
    if (playing && playing.then) {
      playing.then(() => {
        if (paused || document.hidden || !visibleVideos.has(video)) video.pause();
      }).catch(() => {
        // A poster stays visible if the browser restricts autoplay.
      });
    }
  }
  function applyMotion() {
    if (reducedMotion.matches) paused = true;
    body.classList.toggle('is-paused', paused);
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.disabled = reducedMotion.matches;
    motionLabel.textContent = reducedMotion.matches ? 'Без движения' : paused ? 'Движение' : 'Пауза';
    motionButton.setAttribute('aria-label', reducedMotion.matches ? 'Движение отключено настройкой устройства' : paused ? 'Включить движение' : 'Остановить движение');
    videos.forEach(video => paused ? video.pause() : playVideo(video));
    scheduleFrame();
  }
  motionButton.hidden = false;
  motionButton.addEventListener('click', () => {
    paused = !paused;
    applyMotion();
  });
  reducedMotion.addEventListener('change', () => {
    paused = reducedMotion.matches;
    applyMotion();
    if (!paused) initReveals();
  });
  videos.forEach(video => {
    video.addEventListener('error', () => { video.dataset.failed = 'true'; });
  });
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          visibleVideos.add(video);
          playVideo(video);
        } else {
          visibleVideos.delete(video);
          video.pause();
        }
      });
    }, { threshold: 0.12 });
    videos.forEach(video => videoObserver.observe(video));
  }
  document.addEventListener('visibilitychange', () => {
    videos.forEach(video => document.hidden ? video.pause() : playVideo(video));
  });

  let revealObserver;
  function initReveals() {
    if (paused || !('IntersectionObserver' in window)) return;
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
    }
    document.querySelectorAll('[data-reveal]:not(.will-reveal)').forEach(element => {
      element.classList.add('will-reveal');
      revealObserver.observe(element);
    });
  }

  const foodSteps = Array.from(document.querySelectorAll('[data-food]'));
  const foodVisual = document.querySelector('.food-visual');
  const foodImage = document.querySelector('.food-image');
  const foodNumber = document.querySelector('#food-number');
  const foodCaption = document.querySelector('#food-caption');
  const captions = [
    ['Больше ', 'разнообразия'],
    ['Клетчатка в ', 'обычных блюдах'],
    ['Разные ', 'источники белка'],
    ['Меняем ', 'качество жиров']
  ];
  const positions = ['72% center', '94% center', '65% center', '80% center'];

  function paintFrame() {
    frameRequested = false;
    const viewport = window.innerHeight;
    const travel = root.scrollHeight - viewport;
    progress.style.transform = 'scaleX(' + (travel > 0 ? Math.min(1, Math.max(0, window.scrollY / travel)) : 1) + ')';
    const headerHeight = header.offsetHeight;
    let active = chapters[0];
    chapters.forEach(chapter => {
      if (chapter.getBoundingClientRect().top <= headerHeight + viewport * 0.25) active = chapter;
    });
    header.classList.toggle('is-dark', active.hasAttribute('data-dark') || (!desktop.matches && active.id === 's01'));
    if (active.id !== currentChapter) {
      currentChapter = active.id;
      menu.querySelectorAll('a').forEach(link => {
        if (link.getAttribute('href') === '#' + currentChapter) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }
    if (!desktop.matches) return;
    const visualRect = foodVisual.getBoundingClientRect();
    if (visualRect.bottom < 0 || visualRect.top > viewport) return;
    let activeStep = 0;
    foodSteps.forEach((step, index) => {
      if (step.getBoundingClientRect().top <= viewport * 0.56) activeStep = index;
    });
    if (activeStep !== currentFood) {
      currentFood = activeStep;
      foodSteps.forEach((step, index) => step.classList.toggle('is-active', index === activeStep));
      foodNumber.textContent = String(activeStep + 1).padStart(2, '0') + ' / 04';
      foodCaption.replaceChildren(document.createTextNode(captions[activeStep][0]));
      const emphasis = document.createElement('em');
      emphasis.textContent = captions[activeStep][1];
      foodCaption.append(emphasis);
      if (!paused) {
        foodImage.style.objectPosition = positions[activeStep];
        foodImage.style.setProperty('--food-scale', String(1 + activeStep * 0.025));
      }
    }
  }
  function scheduleFrame() {
    if (!frameRequested) {
      frameRequested = true;
      requestAnimationFrame(paintFrame);
    }
  }
  window.addEventListener('scroll', scheduleFrame, { passive: true });
  window.addEventListener('resize', scheduleFrame, { passive: true });
  window.addEventListener('load', scheduleFrame);
  document.querySelectorAll('details').forEach(detail => detail.addEventListener('toggle', scheduleFrame));
  document.querySelectorAll('input[name="habit"]').forEach(input => {
    input.addEventListener('change', () => {
      document.querySelector('#habit-result').textContent = 'Мой первый шаг: ' + input.value.toLowerCase() + '.';
    });
  });

  // Existing links to the end of the 14-screen draft keep a useful destination.
  const legacyAnchors = { '#s11': '#s08', '#s12': '#s09', '#s13': '#s09', '#s14': '#s10' };
  if (legacyAnchors[location.hash]) {
    location.replace(legacyAnchors[location.hash]);
  }
  applyMotion();
  initReveals();
  scheduleFrame();
})();
