'use strict';
(()=>{
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const slides=$$('.slide'), count=$('#slide-count'), progress=$('#progress-bar'), prev=$('#prev'), next=$('#next'), contents=$('#contents'), contentsToggle=$('#contents-toggle'), lecture=$('#lecture');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 let current=0,userMotion=true,motion=false;
 document.body.classList.add('js');
 $('#contents-list').innerHTML=slides.map((s,i)=>`<a href="#${s.id}" data-index="${i}"><span>${String(i+1).padStart(2,'0')}</span><span>${s.dataset.title}</span></a>`).join('');
 function closeContents(){contents.hidden=true;contentsToggle.setAttribute('aria-expanded','false');}
 // The lecture is a continuous document. Navigation scrolls to sections;
 // it never hides content or takes ownership of vertical wheel gestures.
 slides.forEach(s=>{s.setAttribute('aria-hidden','false');s.inert=false;});
 function markCurrent(index,updateHash=true){
  current=Math.max(0,Math.min(slides.length-1,index));
  slides.forEach((s,i)=>s.classList.toggle('active',i===current));
  document.body.classList.toggle('on-dark',slides[current].classList.contains('dark'));
  count.textContent=`${String(current+1).padStart(2,'0')} / ${slides.length}`;
  $('#scene-chapter').textContent=slides[current].dataset.chapter;
  prev.disabled=current===0;next.disabled=current===slides.length-1;
  contents.querySelectorAll('a').forEach((a,i)=>a.setAttribute('aria-current',String(i===current)));
  if(updateHash&&location.hash!==`#${slides[current].id}`)history.replaceState(null,'',`#${slides[current].id}`);
  const upcoming=slides[current+1];if(upcoming)upcoming.querySelectorAll('img').forEach(img=>{img.loading='eager';});
 }
 function showSlide(index,updateHash=true){
  markCurrent(index,updateHash);closeContents();
  window.scrollTo({top:slides[current].offsetTop,behavior:motion?'smooth':'instant'});
 }
 let scrollFrame=0;
 function readScroll(){
  scrollFrame=0;const y=window.scrollY,h=window.innerHeight;
  let index=0;slides.forEach((s,i)=>{if(s.offsetTop<=y+h*.4)index=i;});
  if(index!==current)markCurrent(index);
  const extent=Math.max(1,document.documentElement.scrollHeight-h);
  progress.style.width=`${Math.min(100,Math.max(0,y/extent*100))}%`;
  slides.forEach(s=>{const r=s.getBoundingClientRect();if(r.top<h&&r.bottom>0){s.style.setProperty('--scene-p',String(Math.min(1,Math.max(0,(h-r.top)/(h+r.height)))));}});
 }
 function scheduleScroll(){if(!scrollFrame)scrollFrame=requestAnimationFrame(readScroll);}
 window.addEventListener('scroll',scheduleScroll,{passive:true});
 window.addEventListener('resize',scheduleScroll);
 window.addEventListener('load',scheduleScroll);
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');e.target.querySelectorAll('img').forEach(img=>img.loading='eager');}}),{threshold:.08});
 slides.forEach(s=>observer.observe(s));
 const hashIndex=()=>Math.max(0,slides.findIndex(s=>`#${s.id}`===location.hash));
 prev.addEventListener('click',()=>showSlide(current-1));next.addEventListener('click',()=>showSlide(current+1));
 contentsToggle.addEventListener('click',()=>{contents.hidden=!contents.hidden;contentsToggle.setAttribute('aria-expanded',String(!contents.hidden));});
 contents.addEventListener('click',e=>{const link=e.target.closest('[data-index]');if(link){e.preventDefault();showSlide(Number(link.dataset.index));contentsToggle.focus();}});
 window.addEventListener('hashchange',()=>showSlide(hashIndex(),false));
 $('.brand').addEventListener('click',e=>{e.preventDefault();showSlide(0);});
 $('.skip').addEventListener('click',e=>{e.preventDefault();lecture.focus({preventScroll:true});});
 $$('[data-go]').forEach(b=>b.addEventListener('click',()=>{showSlide(slides.findIndex(s=>s.id===b.dataset.go));lecture.focus({preventScroll:true});}));
 document.addEventListener('click',e=>{if(!contents.hidden&&!contents.contains(e.target)&&!contentsToggle.contains(e.target))closeContents();});
 $$('.reveal-row').forEach(b=>b.addEventListener('click',()=>{
  const wasOpen=b.getAttribute('aria-expanded')==='true';
  // One answer at a time keeps the slide readable while the lecturer explains it.
  $$('.reveal-row').forEach(other=>{const open=other===b&&!wasOpen;other.setAttribute('aria-expanded',String(open));other.querySelector('b').textContent=open?'−':'+';$('#'+other.getAttribute('aria-controls')).hidden=!open;});
 }));
 const swaps=[
  ['Части сливочного масла','Жидкое растительное масло','Подходящее масло и количество зависят от блюда.'],
  ['Привычного сладкого перекуса','Несолёные орехи или фрукт','Вариант и порцию подбирают с учётом рациона и переносимости.'],
  ['Части мясных блюд','Фасоль, нут или чечевицу','Попробуйте привычный рецепт с другим источником белка.']
 ];
 function selectSwap(n){
  $$('[data-swap]').forEach((b,i)=>{b.setAttribute('aria-selected',String(i===n));b.tabIndex=i===n?0:-1;});
  $('#swap-from').textContent=swaps[n][0];$('#swap-to').textContent=swaps[n][1];$('#swap-explain').textContent=swaps[n][2];
  $('#swap-panel').setAttribute('aria-labelledby',`swap-tab-${n}`);$('#s05').dataset.choice=String(n);
  $('.swap-circle-before').textContent=n===1?'Сладкий перекус':n===2?'Мясное блюдо':'';
  $('.swap-circle-after').textContent=n===1?'Орехи или фрукт':n===2?'Блюдо с бобовыми':'';
  $('#swap-panel').classList.remove('is-changing');void $('#swap-panel').offsetWidth;$('#swap-panel').classList.add('is-changing');
 }
 $$('[data-swap]').forEach(b=>{b.addEventListener('click',()=>selectSwap(Number(b.dataset.swap)));b.addEventListener('keydown',e=>{
  if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();e.stopPropagation();const n=e.key==='Home'?0:e.key==='End'?2:(Number(b.dataset.swap)+(e.key==='ArrowRight'?1:2))%3;selectSwap(n);$(`[data-swap="${n}"]`).focus();}
 });});
 const labelDetails=[
  'Сравните содержание в одинаковом количестве продукта, если оно указано.',
  'Посмотрите содержание соли или натрия. Сравнивайте одинаковые единицы.',
  'Проверьте состав: сахар и сиропы могут входить в продукт под разными названиями.',
  'Сопоставляйте похожие продукты и обращайте внимание на размер вашей порции.'
 ];
 $$('[data-label]').forEach(b=>b.addEventListener('click',()=>{$$('[data-label]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('#label-detail').textContent=labelDetails[Number(b.dataset.label)];}));
 const riskDetails=[
  'Были ли ранние сердечно-сосудистые события у близких родственников?',
  'Каково давление при корректных повторных измерениях?',
  'Есть ли курение сейчас или в прошлом?',
  'Как возраст меняет оценку общего риска?'
 ];
 $$('[data-risk]').forEach(b=>b.addEventListener('click',()=>{$$('[data-risk]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('#risk-detail').textContent=riskDetails[Number(b.dataset.risk)];}));
 $$('[data-habit]').forEach(b=>b.addEventListener('click',()=>{
  $$('[data-habit]').forEach(x=>{const selected=x===b;x.classList.toggle('selected',selected);x.setAttribute('aria-pressed',String(selected));x.querySelector('b').textContent=selected?'✓':'+';});
  $('#habit-result').textContent=b.dataset.habit+'.';$('#s13').classList.add('is-chosen');
 }));
 $('#sources-toggle').addEventListener('click',()=>{const open=$('#sources').hidden;$('#sources').hidden=!open;$('#sources-toggle').setAttribute('aria-expanded',String(open));$('#sources-toggle>span').textContent=open?'−':'+';});
 function setMotion(){
  motion=userMotion&&!reduced.matches;
  document.body.classList.toggle('motion',motion);document.body.classList.toggle('motion-off',!motion);
  $('#ambient-toggle').setAttribute('aria-pressed',String(motion));
  $('#ambient-toggle').setAttribute('aria-label',motion?'Выключить анимацию':'Включить анимацию');
  $('#ambient-toggle').title=reduced.matches?'Анимация выключена настройкой устройства':motion?'Выключить анимацию':'Включить анимацию';
  $('#ambient-toggle').disabled=reduced.matches;
  $('#motion-label').textContent=motion?'Анимация':'Без анимации';
 }
 $('#ambient-toggle').addEventListener('click',()=>{userMotion=!userMotion;setMotion();});reduced.addEventListener('change',setMotion);
 setMotion();showSlide(hashIndex());scheduleScroll();
 const film=$('#film-dialog'), filmToggle=$('#film-toggle'), pause=$('#film-pause'), shots=$$('.film-shot');
 const duration=30;let elapsed=0,playing=false,frame=0,last=0,activeShot=-1;
 function paintFilm(){
  const shot=Math.min(shots.length-1,Math.floor(elapsed/5));
  if(shot!==activeShot){activeShot=shot;shots.forEach((s,i)=>{s.classList.toggle('visible',i===shot);s.setAttribute('aria-hidden',String(i!==shot));});}
  $('#film-time').textContent=`0:${String(Math.floor(elapsed)).padStart(2,'0')} / 0:30`;
  $('#film-progress').value=elapsed;film.classList.toggle('film-paused',!playing);pause.textContent=playing?'Пауза':elapsed>=duration?'Повторить':'Продолжить';
 }
 function tick(now){if(!playing)return;elapsed=Math.min(duration,elapsed+(now-last)/1000);last=now;if(elapsed>=duration){playing=false;paintFilm();return;}paintFilm();frame=requestAnimationFrame(tick);}
 function play(){if(elapsed>=duration){elapsed=0;activeShot=-1;}playing=true;last=performance.now();cancelAnimationFrame(frame);paintFilm();frame=requestAnimationFrame(tick);}
 function stopFilm(){playing=false;cancelAnimationFrame(frame);paintFilm();}
 filmToggle.addEventListener('click',()=>{elapsed=0;activeShot=-1;shots.forEach(s=>s.querySelectorAll('img').forEach(img=>img.loading='eager'));film.showModal();if(reduced.matches){playing=false;paintFilm();}else play();$('#film-close').focus();});
 $('#film-close').addEventListener('click',()=>film.close());film.addEventListener('close',()=>{stopFilm();filmToggle.focus();});
 film.addEventListener('click',e=>{if(e.target===film){const r=film.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)film.close();}});
 pause.addEventListener('click',()=>{if(playing)stopFilm();else play();});$('#film-restart').addEventListener('click',()=>{elapsed=0;activeShot=-1;play();});
 document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('is-suspended',document.hidden);if(document.hidden&&playing)stopFilm();});
 document.addEventListener('keydown',e=>{
  if(film.open)return;
  if(e.key==='Escape'){closeContents();return;}
  if(!contents.hidden||e.target.closest('input,textarea,select,[role=tab]'))return;
  if(e.target.closest('button,a')&&[' ','Enter'].includes(e.key))return;
  if(e.key==='ArrowRight'){e.preventDefault();showSlide(current+1);}
  if(e.key==='ArrowLeft'){e.preventDefault();showSlide(current-1);}
  if(e.key==='Home'){e.preventDefault();showSlide(0);}if(e.key==='End'){e.preventDefault();showSlide(slides.length-1);}
 });
 let startX=0,startY=0,startTarget=null;
 lecture.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX;startY=e.changedTouches[0].clientY;startTarget=e.target;},{passive:true});
 lecture.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX,dy=e.changedTouches[0].clientY-startY;if(!startTarget.closest('button,a,[role=tab]')&&Math.abs(dx)>85&&Math.abs(dx)>Math.abs(dy)*1.7)showSlide(current+(dx<0?1:-1));},{passive:true});
})();
