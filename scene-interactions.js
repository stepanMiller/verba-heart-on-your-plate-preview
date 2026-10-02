/* Lipid diagram: one lab reading, a corresponding carrier/cargo explanation. */
(() => {
  'use strict';
  const scene = document.querySelector('#s03.vl-scene');
  if (!scene) return;
  const choices = [...scene.querySelectorAll('[data-vl-select]')];
  const copy = {
    ldl: {
      title: 'Холестерин в частицах ЛПНП', tag: 'Холестерин в ЛПНП',
      caption: 'Подсвечен холестерин, переносимый ЛПНП',
      announcement: 'ХС-ЛПНП (LDL-C) — концентрация холестерина, переносимого ЛПНП.',
      description: 'Условные частицы ЛПНП и ЛПВП. В частице ЛПНП подсвечены символы холестерина. Размеры, число и состав символов не соответствуют измерениям.'
    },
    hdl: {
      title: 'Холестерин в частицах ЛПВП', tag: 'Холестерин в ЛПВП',
      caption: 'Подсвечен холестерин, переносимый ЛПВП',
      announcement: 'ХС-ЛПВП (HDL-C) — концентрация холестерина, переносимого ЛПВП.',
      description: 'Условные частицы ЛПНП и ЛПВП. В частице ЛПВП подсвечены символы холестерина. Размеры, число и состав символов не соответствуют измерениям.'
    },
    tg: {
      title: 'Триглицериды в составе липопротеинов', tag: 'Триглицериды',
      caption: 'Триглицериды переносятся в составе липопротеинов',
      announcement: 'ТГ — концентрация триглицеридов, другого вида липидов. Они переносятся в составе липопротеинов. На схеме пример: частица ЛПОНП.',
      description: 'Пример переносчика: условная частица ЛПОНП. Внутри подсвечены символы триглицеридов, другого вида липидов. Триглицериды не являются отдельным видом частиц. Размеры, число и состав символов не соответствуют измерениям.'
    }
  };
  function select(key, announce = true) {
    if (!Object.prototype.hasOwnProperty.call(copy, key)) return;
    scene.dataset.vlState = key;
    choices.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.vlSelect === key)));
    scene.querySelector('#vl-visual-tag').textContent = copy[key].tag;
    scene.querySelector('#vl-caption-text').textContent = copy[key].caption;
    scene.querySelector('#vl-selected-definition').textContent = key === 'tg' ? 'ТГ — концентрация триглицеридов, другого вида липидов.' : copy[key].announcement;
    scene.querySelector('#vl-svg-title').textContent = copy[key].title;
    scene.querySelector('#vl-svg-desc').textContent = copy[key].description;
    const isTg = key === 'tg';
    scene.querySelector('.vl-sterol-view').setAttribute('visibility', isTg ? 'hidden' : 'visible');
    scene.querySelector('.vl-sterol-view').setAttribute('aria-hidden', String(isTg));
    scene.querySelector('.vl-tg-view').setAttribute('visibility', isTg ? 'visible' : 'hidden');
    scene.querySelector('.vl-tg-view').setAttribute('aria-hidden', String(!isTg));
    if (announce) scene.querySelector('#vl-live').textContent = copy[key].announcement;
  }
  choices.forEach((button, index) => {
    button.addEventListener('click', () => select(button.dataset.vlSelect));
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? choices.length - 1 :
        (index + (event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1) + choices.length) % choices.length;
      choices[next].focus();
      select(choices[next].dataset.vlSelect);
    });
  });
  select('ldl', false);
})();

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
