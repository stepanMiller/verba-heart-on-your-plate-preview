'use strict';
(() => {
 const root=document.documentElement,body=document.body,header=document.querySelector('#masthead'),progress=document.querySelector('#progress-bar');
 const menu=document.querySelector('#contents'),menuButton=document.querySelector('#contents-toggle'),motionButton=document.querySelector('#motion-toggle');
 const chapters=Array.from(document.querySelectorAll('[data-chapter]')),steps=Array.from(document.querySelectorAll('[data-food]')),videos=Array.from(document.querySelectorAll('[data-video-src]'));
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),desktop=matchMedia('(min-width:761px)'),visibleVideos=new Set();
 const foodImage=document.querySelector('.food-image'),foodVisual=document.querySelector('.food-visual'),foodPin=document.querySelector('.food-pin');
 let paused=reduced.matches||Boolean(navigator.connection?.saveData),scheduled=false,foodIndex=-1;
 function closeMenu(focus=false){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');if(focus)menuButton.focus();}
 menuButton.hidden=false;
 menuButton.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));if(open)menu.querySelector('a').focus();});
 menu.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
 document.addEventListener('click',e=>{if(!menu.hidden&&!menu.contains(e.target)&&!menuButton.contains(e.target))closeMenu();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){e.preventDefault();closeMenu(true);}});
 function play(v){if(paused||document.hidden||!visibleVideos.has(v))return;if(!v.getAttribute('src')){v.src=v.dataset.videoSrc;v.load();}v.play().then(()=>{if(paused||document.hidden||!visibleVideos.has(v))v.pause();}).catch(()=>{});}
 function motion(){if(reduced.matches)paused=true;body.classList.toggle('is-paused',paused);motionButton.setAttribute('aria-pressed',String(paused));motionButton.disabled=reduced.matches;motionButton.setAttribute('aria-label',reduced.matches?'Движение отключено настройкой устройства':paused?'Включить движение':'Остановить движение');motionButton.querySelector('.motion-label').textContent=reduced.matches?'Без движения':paused?'Движение':'Пауза';videos.forEach(v=>paused?v.pause():play(v));schedule();}
 motionButton.hidden=false;motionButton.addEventListener('click',()=>{paused=!paused;motion();});reduced.addEventListener('change',()=>{paused=reduced.matches;motion();reveals();});
 if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){visibleVideos.add(e.target);play(e.target);}else{visibleVideos.delete(e.target);e.target.pause();}});},{threshold:.15});videos.forEach(v=>observer.observe(v));}
 document.addEventListener('visibilitychange',()=>videos.forEach(v=>document.hidden?v.pause():play(v)));
 function reveals(){if(paused||!('IntersectionObserver'in window))return;const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{threshold:.05});document.querySelectorAll('[data-reveal]:not(.will-reveal)').forEach(el=>{el.classList.add('will-reveal');observer.observe(el);});}
 const captions=[['Качество ','жиров'],['Цельные ','злаки'],['Овощи и ','бобовые'],['Разные ','источники белка']];
 const positions=['95% 90%','30% 15%','72% 50%','75% 34%'];
 function paint(){scheduled=false;const height=innerHeight,travel=root.scrollHeight-height;progress.style.transform='scaleX('+Math.min(1,Math.max(0,scrollY/(travel||1)))+')';let active=chapters[0];chapters.forEach(c=>{if(c.getBoundingClientRect().top<=header.offsetHeight+height*.23)active=c;});menu.querySelectorAll('a').forEach(a=>{if(a.hash==='#'+active.id)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});if(!paused){const hero=document.querySelector('.hero');const fraction=Math.max(0,Math.min(1,scrollY/hero.offsetHeight));hero.style.setProperty('--hero-drift',fraction*3+'%');}
 if(!desktop.matches)return;const rect=foodVisual.getBoundingClientRect();if(rect.bottom<0||rect.top>height)return;let index=0;steps.forEach((s,i)=>{if(s.getBoundingClientRect().top<=height*.52)index=i;});if(index!==foodIndex){foodIndex=index;steps.forEach((s,i)=>s.classList.toggle('is-active',i===index));document.querySelector('#food-number').textContent=String(index+1).padStart(2,'0')+' / 04';const caption=document.querySelector('#food-caption');caption.replaceChildren(document.createTextNode(captions[index][0]));const em=document.createElement('em');em.textContent=captions[index][1];caption.append(em);foodPin.dataset.ingredient=String(index);if(!paused){foodImage.style.objectPosition=positions[index];foodImage.style.setProperty('--food-scale',String(index===1?1.03:1.16));}}}
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(paint);}}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});addEventListener('load',schedule);document.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',schedule));
 document.querySelectorAll('input[name="habit"]').forEach(input=>input.addEventListener('change',()=>{document.querySelector('#habit-result').textContent='Мой первый шаг: '+input.value.toLowerCase()+'.';}));
 const old={'#s02':'#s13','#s03':'#s13','#s06':'#s04','#s07':'#s04','#s10':'#s13','#s11':'#s13','#s12':'#s13'};if(old[location.hash])location.replace(old[location.hash]);
 motion();reveals();schedule();
})();
