'use strict';
(()=>{
 const comparison=document.querySelector('#meal-comparison'), range=document.querySelector('#meal-range');
 function setMeal(value,scrubbing=false){
  const v=Math.max(0,Math.min(100,Number(value)));range.value=v;
  comparison.style.setProperty('--replacement',`${v}%`);comparison.classList.toggle('scrubbing',scrubbing);
  comparison.dataset.comparing=String(v>0&&v<100);comparison.dataset.end=v===0?'before':v===100?'after':'mix';
  document.querySelector('#meal-state').textContent=v===0?'Исходный вариант':v===100?'Вариант замены':'Сравните два варианта';
  range.setAttribute('aria-valuetext',v===0?'Исходный вариант со сливочным маслом':v===100?'Вариант с оливковым маслом':'Промежуточное положение сравнения двух фотографий');
  document.querySelectorAll('[data-meal-state]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.mealState)===v)));
 }
 range.addEventListener('input',()=>setMeal(range.value,true));
 document.querySelectorAll('[data-meal-state]').forEach(b=>b.addEventListener('click',()=>setMeal(b.dataset.mealState)));
 setMeal(0);
 const cases={
  smoking:{label:'Курение',a:'Не курит',b:'Курит',takeaway:'При прочих равных курение повышает сердечно-сосудистый риск.',note:'Один фактор помогает увидеть, почему ХС-ЛПНП недостаточно для общей оценки.'},
  pressure:{label:'Давление',a:'При повторных измерениях не повышено',b:'При повторных измерениях повышено',takeaway:'Повышенное давление — ещё один фактор сердечно-сосудистого риска.',note:'Это заданные учебные условия, а не постановка диагноза по одному измерению.'},
  family:{label:'Семейная история',a:'Ранние сердечно-сосудистые события в семье не отмечены',b:'У близкого родственника было раннее сердечно-сосудистое событие',takeaway:'Семейная история может уточнить оценку риска.',note:'Речь о родителях, братьях или сёстрах. Отсутствие известных событий не исключает наследственную предрасположенность.'}
 };
 const risk=document.querySelector('#risk-comparison'),reveal=document.querySelector('#reveal-risk'),reset=document.querySelector('#reset-risk'),explorer=document.querySelector('#context-explorer');let current='smoking';
 function selectContext(key){current=key;const c=cases[key];document.querySelectorAll('.case-context-label').forEach(x=>x.textContent=c.label);document.querySelector('#case-a-fact').textContent=c.a;document.querySelector('#case-b-fact').textContent=c.b;document.querySelector('#risk-observation-text').textContent=c.takeaway;document.querySelector('#risk-context-qualifier').textContent=c.note;document.querySelector('#risk-observation').setAttribute('aria-labelledby',`context-${key}`);document.querySelectorAll('[data-context]').forEach(b=>{const on=b.dataset.context===key;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;});}
 function setReveal(open){risk.dataset.revealed=String(open);reveal.hidden=open;reset.hidden=!open;explorer.hidden=!open;reveal.setAttribute('aria-expanded',String(open));if(open){selectContext(current);reset.focus({preventScroll:true});}else{document.querySelectorAll('.case-context-label').forEach(x=>x.textContent='Контекст пока не раскрыт');document.querySelector('#case-a-fact').textContent='Что ещё важно знать?';document.querySelector('#case-b-fact').textContent='Что ещё важно знать?';current='smoking';reveal.focus({preventScroll:true});}}
 reveal.addEventListener('click',()=>setReveal(true));reset.addEventListener('click',()=>setReveal(false));
 const tabs=[...document.querySelectorAll('[data-context]')];tabs.forEach((b,i)=>{b.addEventListener('click',()=>selectContext(b.dataset.context));b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length;selectContext(tabs[n].dataset.context);tabs[n].focus();});});
})();

/* Self-contained, conceptual orbital field. No quantities or particle dimensions are encoded. */
(() => {
  'use strict';
  const scene = document.querySelector('#s03.vo-scene');
  if (!scene || scene.dataset.voReady === 'true') return;
  scene.dataset.voReady = 'true';
  const buttons = [...scene.querySelectorAll('[data-vo-select]')];
  const canvas = scene.querySelector('#vo-orbital-canvas');
  const ctx = canvas.getContext('2d');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const states = {
    ldl: {
      name: 'Холестерин', carrier: 'в составе ЛПНП', caption: 'холестерин, переносимый ЛПНП',
      teaching: ['ЛПНП — частицы-переносчики.', 'ХС-ЛПНП — концентрация в крови холестерина, переносимого ими.'],
      definition: 'ХС-ЛПНП (LDL-C) — концентрация холестерина, переносимого ЛПНП.',
      rgb: [231, 179, 126], phase: 0, index: 0
    },
    hdl: {
      name: 'Холестерин', carrier: 'в составе ЛПВП', caption: 'холестерин, переносимый ЛПВП',
      teaching: ['ЛПВП — частицы-переносчики.', 'ХС-ЛПВП — концентрация в крови холестерина, переносимого ими.'],
      definition: 'ХС-ЛПВП (HDL-C) — концентрация холестерина, переносимого ЛПВП.',
      rgb: [202, 214, 167], phase: 2.1, index: 1
    },
    tg: {
      name: 'Триглицериды', carrier: 'в составе липопротеинов', caption: 'триглицериды в составе липопротеинов',
      teaching: ['Триглицериды — другой вид липидов.', 'Их тоже переносят липопротеины.'],
      definition: 'ТГ — концентрация триглицеридов, другого вида липидов. Триглицериды переносятся в составе липопротеинов; это липиды, а не отдельный класс частиц.',
      rgb: [225, 197, 138], phase: 4.2, index: 2
    }
  };
  let selected = 'ldl';
  let width = 500, height = 500, visible = false, frame = 0, previous = 0, angle = 0, lastPaint = 0;
  const particles = Array.from({ length: 220 }, (_, i) => {
    const phi = Math.acos(1 - 2 * (i + .5) / 220);
    const theta = Math.PI * (3 - Math.sqrt(5)) * i;
    return { x: Math.sin(phi) * Math.cos(theta), y: Math.cos(phi), z: Math.sin(phi) * Math.sin(theta), radius: 1 + (i % 5) * .27, index: i };
  });
  function canMove() {
    return !!ctx && visible && !document.hidden && !reduce.matches &&
      document.body.classList.contains('motion') && !document.body.classList.contains('motion-off');
  }
  function paint() {
    if (!ctx) return;
    const state = states[selected];
    const rgb = state.rgb.join(',');
    const cx = width / 2, cy = height * .48;
    const radius = Math.min(width * .335, height * .325);
    ctx.clearRect(0, 0, width, height);
    const glow = ctx.createRadialGradient(cx, cy, radius * .06, cx, cy, radius * 1.7);
    glow.addColorStop(0, 'rgba(' + rgb + ',.12)');
    glow.addColorStop(.56, 'rgba(145,170,90,.04)');
    glow.addColorStop(1, 'rgba(145,170,90,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
    // Orbit-like strokes are a visual metaphor. They are not molecular paths or circulation data.
    for (let i = 0; i < 3; i++) {
      const tilt = -.55 + i * .69 + angle * .12;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * (1.25 + i * .12), radius * (.40 + i * .12), tilt, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(190,204,157,.17)'; ctx.lineWidth = .75; ctx.stroke();
      ctx.beginPath();
      const start = angle * .42 + state.phase + i * .8;
      ctx.ellipse(cx, cy, radius * (1.25 + i * .12), radius * (.40 + i * .12), tilt, start, start + .64);
      ctx.strokeStyle = 'rgba(' + rgb + ',.53)'; ctx.lineWidth = 1.1; ctx.stroke();
    }
    const projected = particles.map(p => {
      const x = p.x * Math.cos(angle) - p.z * Math.sin(angle);
      const z = p.x * Math.sin(angle) + p.z * Math.cos(angle);
      const perspective = 1.5 / (1.5 + z * .35);
      const emphasis = (Math.sin(p.index * .77 + state.phase) + 1) / 2;
      return { x: cx + x * radius * perspective, y: cy + p.y * radius * perspective, z, r: p.radius * perspective, emphasis };
    }).sort((a, b) => b.z - a.z);
    projected.forEach(p => {
      const alpha = Math.min(.96, .26 + (1 - p.z) * .24 + p.emphasis * .15);
      const dotRadius = p.r * (.92 + p.emphasis * .16);
      if (p.z < 0 && p.emphasis > .84) {
        ctx.beginPath(); ctx.arc(p.x, p.y, dotRadius * 3.6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + rgb + ',.055)'; ctx.fill();
      }
      ctx.beginPath(); ctx.arc(p.x, p.y, dotRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + rgb + ',' + alpha + ')'; ctx.fill();
    });
    ctx.beginPath(); ctx.arc(cx, cy, radius * .55, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(' + rgb + ',.25)'; ctx.lineWidth = .65; ctx.stroke();
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    width = rect.width; height = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paint();
  }
  function tick(now) {
    frame = 0;
    if (!canMove()) { previous = 0; return; }
    if (previous) angle += Math.min(now - previous, 80) * .00010;
    previous = now;
    const interval = width < 450 ? 40 : 30;
    if (now - lastPaint >= interval) { paint(); lastPaint = now; }
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (canMove()) {
      if (!frame) { previous = 0; frame = requestAnimationFrame(tick); }
    } else {
      if (frame) cancelAnimationFrame(frame);
      frame = 0; previous = 0; paint();
    }
  }
  function select(key, announce = true) {
    if (!Object.prototype.hasOwnProperty.call(states, key)) return;
    selected = key;
    const state = states[key];
    scene.dataset.voState = key;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.voSelect === key)));
    scene.querySelector('#vo-centre-name').textContent = state.name;
    scene.querySelector('#vo-centre-carrier').textContent = state.carrier;
    scene.querySelector('#vo-caption-lipid').textContent = state.caption;
    const teaching = scene.querySelector('#vo-teaching');
    teaching.replaceChildren(document.createTextNode(state.teaching[0]), document.createElement('br'), document.createTextNode(state.teaching[1]));
    scene.querySelector('#vo-definition-copy').textContent = state.definition;
    scene.querySelectorAll('.vo-field-index span').forEach((span, i) => span.classList.toggle('is-active', i === state.index));
    if (announce) scene.querySelector('#vo-live').textContent = state.definition;
    paint();
  }
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(button.dataset.voSelect));
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault(); event.stopPropagation();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 :
        (index + (event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1) + buttons.length) % buttons.length;
      buttons[next].focus(); select(buttons[next].dataset.voSelect);
    });
  });
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (visible) resize(); sync(); }, { threshold: .01 }).observe(canvas);
  } else {
    const check = () => { const r = canvas.getBoundingClientRect(); visible = r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight; sync(); };
    window.addEventListener('scroll', check, { passive: true }); window.addEventListener('resize', check, { passive: true }); check();
  }
  new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  reduce.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pageshow', () => { resize(); sync(); });
  window.addEventListener('pagehide', () => { if (frame) cancelAnimationFrame(frame); frame = 0; previous = 0; });
  select('ldl', false); resize(); sync();
})();

/* Food and label scenes only; load after the consolidated document. */
(() => {
 'use strict';
 const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
 const motionAllowed = () => !reduced.matches && !document.body.classList.contains('motion-off');
 const fibreScene = document.querySelector('#s06.fibre-workbench');
 if (fibreScene) {
  const choices = [...fibreScene.querySelectorAll('[data-fibre]')];
  const windowEl = fibreScene.querySelector('#fibre-window');
  // Crops are based on inspected pixels of the existing 1672 × 941 photo.
  // Each rectangle is 3:2; none invents a product or a nutrient quantity.
  const foods = [
   { label: 'Овощи', crop: [1100, 0, 570, 380], alt: 'Крупный план овощей: зелень и помидоры на тарелке', use: 'Добавьте овощи к привычному обеду.' },
   { label: 'Бобовые', crop: [936, 156, 438, 292], alt: 'Крупный план нута рядом с помидорами на тарелке', use: 'Попробуйте нут в супе или основном блюде.' },
   { label: 'Цельные злаки', crop: [1336, 657, 336, 224], alt: 'Крупный план цельнозернового хлеба в нижнем правом углу стола', use: 'Выберите цельнозерновой хлеб к завтраку.' }
  ];
  let crop = foods[0].crop.slice();
  let frame = 0;
  const paint = values => { crop = values; windowEl.setAttribute('viewBox', values.map(v => v.toFixed(2)).join(' ')); };
  function moveTo(target) {
   cancelAnimationFrame(frame);
   if (!motionAllowed()) { paint(target.slice()); return; }
   const start = crop.slice();
   const begin = performance.now();
   function tick(now) {
    if (!motionAllowed()) { paint(target.slice()); frame = 0; return; }
    const progress = Math.min(1, (now - begin) / 750);
    const eased = 1 - Math.pow(1 - progress, 3);
    paint(start.map((value, i) => value + (target[i] - value) * eased));
    if (progress < 1) frame = requestAnimationFrame(tick); else frame = 0;
   }
   frame = requestAnimationFrame(tick);
  }
  function chooseFood(index) {
   const food = foods[index];
   if (!food) return;
   choices.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
   fibreScene.querySelector('#fibre-image-label').textContent = food.label;
   fibreScene.querySelector('#fibre-image-number').textContent = String(index + 1).padStart(2, '0');
   fibreScene.querySelector('#fibre-image-title').textContent = food.alt;
   fibreScene.querySelector('#fibre-use').textContent = food.use;
   moveTo(food.crop);
  }
  choices.forEach(button => button.addEventListener('click', () => chooseFood(Number(button.dataset.fibre))));
 }
 const packageBench = document.querySelector('#label-workbench');
 if (packageBench) {
  const front = packageBench.querySelector('#package-front');
  const back = packageBench.querySelector('#package-back');
  const turn = packageBench.querySelector('#package-turn');
  const detail = packageBench.querySelector('#package-detail');
  const guide = packageBench.querySelector('#package-front-guide');
  const fields = [...packageBench.querySelectorAll('[data-package-field]')];
  // Exact review-approved explanation copy from V1.3.
  const details = [
   ['Насыщенные жиры', 'Сравните содержание в одинаковом количестве продукта, если оно указано.'],
   ['Соль', 'Посмотрите содержание соли или натрия. Сравнивайте одинаковые единицы.'],
   ['Добавленные сахара', 'Проверьте состав: сахар и сиропы могут входить в продукт под разными названиями.'],
   ['Состав и порция', 'Сопоставляйте похожие продукты и обращайте внимание на размер вашей порции.']
  ];
  let reverse = false;
  function showSide() {
   packageBench.dataset.packageSide = reverse ? 'back' : 'front';
   front.setAttribute('aria-hidden', String(reverse));
   back.setAttribute('aria-hidden', String(!reverse));
   front.inert = reverse;
   back.inert = !reverse;
   fields.forEach(button => { button.tabIndex = reverse ? 0 : -1; });
   turn.setAttribute('aria-pressed', String(reverse));
   packageBench.querySelector('#package-turn-label').textContent = reverse ? 'Повернуть лицевой стороной' : 'Повернуть упаковку';
   detail.hidden = !reverse;
   guide.hidden = reverse;
  }
  fields.forEach(button => button.addEventListener('click', () => {
   const index = Number(button.dataset.packageField);
   if (!details[index]) return;
   fields.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
   packageBench.querySelector('#package-detail-number').textContent = String(index + 1).padStart(2, '0');
   packageBench.querySelector('#package-detail-title').textContent = details[index][0];
   packageBench.querySelector('#package-detail-copy').textContent = details[index][1];
  }));
  turn.addEventListener('click', () => { reverse = !reverse; showSide(); });
  showSide();
  packageBench.classList.add('is-enhanced');
  turn.hidden = false;
 }
})();

'use strict';
(()=>{
 const oil=document.querySelector('#oil-video'), oilButton=document.querySelector('#oil-play'), frame=oil.closest('.fat-cinematic-media')||oil.parentElement;let visible=false,userStopped=false;
 function allowed(){return document.body.classList.contains('motion')&&!document.hidden&&!matchMedia('(prefers-reduced-motion: reduce)').matches;}
 function load(v){const s=v.querySelector('source');if(s?.dataset.src&&!s.getAttribute('src')){s.src=s.dataset.src;v.load();}}
 function paint(){const playing=!oil.paused&&!oil.ended;frame.classList.toggle('is-playing',playing);oilButton.textContent=playing?'Пауза':oil.ended?'Повторить':'Смотреть';oilButton.setAttribute('aria-label',playing?'Остановить наливание масла':'Смотреть наливание масла');}
 function play(){load(oil);if(oil.ended)oil.currentTime=0;oil.play().then(()=>{oil.classList.add('ready');paint();}).catch(paint);}
 function sync(){if(!visible||!allowed()){oil.pause();paint();}else if(!userStopped&&!oil.ended)play();}
 oilButton.addEventListener('click',()=>{if(!oil.paused){userStopped=true;oil.pause();paint();}else{userStopped=false;play();}});oil.addEventListener('ended',paint);oil.addEventListener('pause',paint);oil.addEventListener('play',paint);
 new IntersectionObserver(es=>{visible=es[0].isIntersecting;sync();},{threshold:.35}).observe(oil);
 new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});document.addEventListener('visibilitychange',sync);

 const hero=document.querySelector('#hero-motion'),replay=document.querySelector('#hero-replay');let heroVisible=false;
 function heroSync(){if(!heroVisible||!allowed()){hero.pause();return;}if(!hero.ended){load(hero);hero.play().then(()=>hero.classList.add('ready')).catch(()=>{});}}
 replay.addEventListener('click',()=>{hero.currentTime=0;load(hero);hero.play().then(()=>hero.classList.add('ready')).catch(()=>{});});
 new IntersectionObserver(es=>{heroVisible=es[0].isIntersecting;heroSync();},{threshold:.4}).observe(hero);new MutationObserver(heroSync).observe(document.body,{attributes:true,attributeFilter:['class']});document.addEventListener('visibilitychange',heroSync);
 const film=document.querySelector('#film-dialog'),clipVideos=[...film.querySelectorAll('video')];
 function syncFilm(){for(const v of clipVideos){const shot=v.closest('.film-shot'),active=film.open&&shot.classList.contains('visible');if(!active){v.pause();v.currentTime=0;}else if(film.classList.contains('film-paused')||document.hidden){v.pause();}else{load(v);if(!v.ended)v.play().catch(()=>{});}}}
 new MutationObserver(syncFilm).observe(film,{attributes:true,subtree:true,attributeFilter:['class','open']});film.addEventListener('close',syncFilm);document.addEventListener('visibilitychange',syncFilm);
})();
