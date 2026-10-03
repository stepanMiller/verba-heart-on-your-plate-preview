'use strict';
(() => {
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const scenes=$$('.scene'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const menu=$('#contents-dialog'),notes=$('#notes-dialog'),film=$('#film-dialog');
 let current=-1,motionPreference=true,motion=false,scrollFrame=0,lastOpener=null,chosenHabit='';
 document.body.classList.add('js');
 $('#contents-list').innerHTML=scenes.map((s,i)=>`<a href="#${s.id}"><span>${String(i+1).padStart(2,'0')}</span><span>${s.dataset.title}</span></a>`).join('');
 function mark(index){
  index=Math.max(0,Math.min(scenes.length-1,index));if(current===index)return;current=index;
  scenes.forEach((s,i)=>s.classList.toggle('active',i===current));
  $('#slide-count').innerHTML=`${String(current+1).padStart(2,'0')} <span class="count-line" aria-hidden="true"></span> ${scenes.length}`;
  $('#prev').disabled=current===0;$('#next').disabled=current===scenes.length-1;
  $('#contents-list').querySelectorAll('a').forEach((a,i)=>a.setAttribute('aria-current',i===current?'true':'false'));
  if(location.hash!=='#'+scenes[current].id)history.replaceState(null,'','#'+scenes[current].id);
  scenes[current+1]?.querySelectorAll('img').forEach(img=>img.loading='eager');
 }
 function readScroll(){
  scrollFrame=0;const h=innerHeight,y=scrollY;let index=0;
  scenes.forEach((s,i)=>{if(s.offsetTop<=y+h*.45)index=i;});mark(index);
  $('#progress-bar').style.width=`${Math.min(100,100*y/Math.max(1,document.documentElement.scrollHeight-h))}%`;
  scenes.forEach(s=>{const r=s.getBoundingClientRect();if(r.top<h&&r.bottom>0){const p=Math.max(-1,Math.min(1,r.top/h));s.style.setProperty('--drift',motion?`${p*20}px`:'0px');s.style.setProperty('--zoom',motion?'1.045':'1');}});
 }
 function scheduleScroll(){if(!scrollFrame)scrollFrame=requestAnimationFrame(readScroll);}
 function go(index,instant=false){scenes[Math.max(0,Math.min(scenes.length-1,index))].scrollIntoView({behavior:motion&&!instant?'smooth':'instant',block:'start'});}
 addEventListener('scroll',scheduleScroll,{passive:true});addEventListener('resize',scheduleScroll);
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');e.target.querySelectorAll('img').forEach(img=>img.loading='eager');}}),{threshold:.12});scenes.forEach(s=>observer.observe(s));
 $('#prev').addEventListener('click',()=>go(current-1));$('#next').addEventListener('click',()=>go(current+1));
 document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#s"]');if(!a)return;const index=scenes.findIndex(s=>'#'+s.id===a.getAttribute('href'));if(index<0)return;e.preventDefault();if(menu.open)menu.close();go(index);});
 addEventListener('hashchange',()=>{const n=scenes.findIndex(s=>'#'+s.id===location.hash);if(n>=0)go(n);});
 function syncDialogLock(){document.body.classList.toggle('dialog-open',!!document.querySelector('dialog[open]'));}
 function openDialog(dialog,opener){lastOpener=opener;dialog.showModal();syncDialogLock();dialog.querySelector('[data-close]')?.focus();}
 $$('dialog').forEach(dialog=>{
  dialog.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>dialog.close()));
  dialog.addEventListener('close',()=>{syncDialogLock();if(!document.querySelector('dialog[open]')&&lastOpener?.isConnected)lastOpener.focus({preventScroll:true});});
  dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
 });
 $('#contents-toggle').addEventListener('click',e=>openDialog(menu,e.currentTarget));
 $$('[data-note]').forEach(button=>button.addEventListener('click',()=>{
  const scene=$('#'+button.dataset.note),template=$('#note-'+button.dataset.note);
  $('#notes-title').textContent=scene.dataset.title;$('#notes-position').textContent=`Сцена ${String(scenes.indexOf(scene)+1).padStart(2,'0')} · Пояснение`;
  $('#notes-body').replaceChildren(template.content.cloneNode(true));if(chosenHabit)paintHabit();openDialog(notes,button);notes.scrollTop=0;
 }));
 function paintHabit(){$('#notes-body').querySelectorAll('[data-habit]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.habit===chosenHabit)));if($('#habit-result'))$('#habit-result').textContent=chosenHabit?`Мой первый шаг: ${chosenHabit.toLowerCase()}.`:'';}
 notes.addEventListener('click',e=>{const b=e.target.closest('[data-habit]');if(!b)return;chosenHabit=b.dataset.habit;paintHabit();$('#habit-summary').textContent=chosenHabit+'.';});
 function setMotion(){motion=motionPreference&&!reduced.matches;document.body.classList.toggle('motion',motion);document.body.classList.toggle('motion-off',!motion);document.documentElement.style.scrollBehavior=motion?'smooth':'auto';document.documentElement.style.scrollSnapType=motion?'y proximity':'none';$('#ambient-toggle').setAttribute('aria-pressed',String(motion));$('#ambient-toggle').textContent=motion?'Анимация: включена':'Анимация: выключена';$('#ambient-toggle').disabled=reduced.matches;scheduleScroll();}
 $('#ambient-toggle').addEventListener('click',()=>{motionPreference=!motionPreference;setMotion();});reduced.addEventListener('change',setMotion);setMotion();
 const initial=Math.max(0,scenes.findIndex(s=>'#'+s.id===location.hash));mark(initial);go(initial,true);scheduleScroll();addEventListener('load',()=>{go(initial,true);scheduleScroll();},{once:true});
 let elapsed=0,playing=false,filmFrame=0,last=0,activeShot=-1;const shots=$$('.film-shot');
 function paintFilm(){const index=Math.min(shots.length-1,Math.floor(elapsed/5));if(index!==activeShot){activeShot=index;shots.forEach((s,i)=>{s.classList.toggle('visible',i===index);s.setAttribute('aria-hidden',String(i!==index));});}$('#film-time').textContent=`0:${String(Math.floor(elapsed)).padStart(2,'0')} / 0:30`;$('#film-progress').value=elapsed;film.classList.toggle('film-paused',!playing);$('#film-pause').textContent=playing?'Пауза':elapsed>=30?'Повторить':'Продолжить';}
 function tick(now){if(!playing)return;elapsed=Math.min(30,elapsed+(now-last)/1000);last=now;if(elapsed>=30)playing=false;paintFilm();if(playing)filmFrame=requestAnimationFrame(tick);}
 function play(){if(elapsed>=30){elapsed=0;activeShot=-1;}playing=true;last=performance.now();cancelAnimationFrame(filmFrame);paintFilm();filmFrame=requestAnimationFrame(tick);}
 function pause(){playing=false;cancelAnimationFrame(filmFrame);paintFilm();}
 $('#film-toggle').addEventListener('click',()=>{menu.close();elapsed=0;activeShot=-1;openDialog(film,$('#contents-toggle'));if(motion)play();else paintFilm();});
 $('#film-pause').addEventListener('click',()=>playing?pause():play());$('#film-restart').addEventListener('click',()=>{elapsed=0;activeShot=-1;play();});film.addEventListener('close',pause);
 document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('is-suspended',document.hidden);if(document.hidden&&playing)pause();});
 document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||e.target.closest('button,a,input,select,textarea'))return;if(e.key==='ArrowRight'){e.preventDefault();go(current+1);}if(e.key==='ArrowLeft'){e.preventDefault();go(current-1);}});
})();
