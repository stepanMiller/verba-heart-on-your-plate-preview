'use strict';
(() => {
  const videos = [...document.querySelectorAll('[data-ambient-video]')];
  const visible = new Set();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 760px)');
  const film = document.querySelector('#film-dialog');
  const hero = document.querySelector('#s01');
  const heroVideo = document.querySelector('#hero-video');
  function syncVideos() {
    const allowed = !document.body.classList.contains('motion-paused') && !reduced.matches && !film.open && !document.hidden && !navigator.connection?.saveData;
    videos.forEach(video => {
      if (!allowed || !visible.has(video)) { video.pause(); return; }
      const source = video.querySelector('source');
      const selected = mobile.matches && source.dataset.mobileSrc ? source.dataset.mobileSrc : source.dataset.src;
      if (source.getAttribute('src') !== selected) { source.src = selected; video.muted = true; video.load(); }
      video.play().then(() => video.classList.add('live')).catch(() => video.classList.remove('live'));
    });
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
    syncVideos();
  }, {threshold: .12});
  videos.forEach(video => observer.observe(video));
  new IntersectionObserver(entries => {
    const inView = entries[0].isIntersecting;
    const allowed = !reduced.matches && !document.body.classList.contains('motion-paused') && !film.open && !document.hidden && !navigator.connection?.saveData;
    if (!inView || !allowed) heroVideo.pause();
    else if (heroVideo.querySelector('source').getAttribute('src')) heroVideo.play().catch(() => {});
  }, {threshold:.08}).observe(hero);
  reduced.addEventListener('change',syncVideos);
  mobile.addEventListener('change',syncVideos);
  document.addEventListener('verba:motion',syncVideos);
  document.addEventListener('visibilitychange',syncVideos);
  let frame = 0;
  function update() {
    frame = 0;
    const progress = Math.min(1, Math.max(0, scrollY / hero.offsetHeight));
    hero.style.setProperty('--hero-progress', reduced.matches ? '0' : progress.toFixed(4));
    if (hero.getBoundingClientRect().bottom <= 0) heroVideo.pause();
  }
  addEventListener('scroll',() => { if (!frame) frame = requestAnimationFrame(update); },{passive:true});
  update();
})();
