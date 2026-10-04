const {chromium,webkit} = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const url=process.env.VERBA_URL || 'http://127.0.0.1:4173/versions/v4/';
const output=path.resolve(__dirname,'../../../docs/qa-v4');
fs.mkdirSync(output,{recursive:true});
const sizes=[[320,780],[390,844],[768,1024],[1024,768],[1440,936],[1920,1080]];
const report={date:'2026-10-04',url,viewportResults:[],checks:[],errors:[],failedAssets:[],browserResults:[]};
async function check(name,fn){try{await fn();report.checks.push({name,passed:true});}catch(e){report.checks.push({name,passed:false,error:e.message});}}
async function jump(page,id){await page.evaluate(id=>{document.querySelector('#'+id).scrollIntoView({behavior:'instant',block:'start'});},id);await page.waitForTimeout(140);}
async function inspect(browser,label,screenshots=true){
  const context=await browser.newContext({viewport:{width:1440,height:936}});
  const page=await context.newPage();
  page.on('pageerror',e=>report.errors.push({browser:label,error:e.message}));
  page.on('response',r=>{if(r.status()>=400 && r.url().startsWith(url))report.failedAssets.push({browser:label,url:r.url(),status:r.status()});});
  await page.goto(url,{waitUntil:'networkidle'});
  assert.equal(await page.locator('#lecture>.scene').count(),14);
  for(const [width,height] of sizes){
    await page.setViewportSize({width,height});
    for(let i=1;i<=14;i++){
      const id='s'+String(i).padStart(2,'0');
      await jump(page,id);
      const result=await page.locator('#'+id).evaluate(scene=>{
        const r=scene.getBoundingClientRect();
        const text=[...scene.querySelectorAll('h1,h2,.scene-lead,.eyebrow,.switches,.effect-line,.scene-foot')].filter(el=>el.offsetWidth>0);
        return {scene:scene.id,horizontalOverflow:document.documentElement.scrollWidth>innerWidth+1,clippedText:text.filter(el=>{const b=el.getBoundingClientRect();return b.left<-.5 || b.right>innerWidth+.5 || b.top<r.top-.5 || b.bottom>r.bottom+.5 || el.scrollWidth>el.clientWidth+1;}).map(el=>el.className||el.tagName),height:Math.round(r.height),brokenImages:[...scene.querySelectorAll('img')].filter(img=>img.complete&&!img.naturalWidth).map(img=>img.getAttribute('src'))};
      });
      report.viewportResults.push({browser:label,width,height,...result});
      if(screenshots && [320,390,1440].includes(width))await page.locator('#'+id).screenshot({path:path.join(output,id+'-'+width+'.png')});
    }
  }
  await page.setViewportSize({width:1440,height:936});
  await check(label+': lipid states',async()=>{await jump(page,'s03');for(let i=0;i<3;i++){await page.locator('[data-lipid="'+i+'"]').click();assert.equal(await page.locator('[data-lipid="'+i+'"]').getAttribute('aria-pressed'),'true');assert.match(await page.locator('#lipid-message').innerText(),i===2?/другой тип/:/холестерин|ЛПВП/);}});
  await check(label+': ApoB dialog, sources and focus return',async()=>{await page.locator('[data-note="s03"]').click();assert.equal(await page.locator('#note-dialog').evaluate(el=>el.open),true);assert.match(await page.locator('#note-content').innerText(),/ApoB/);assert.ok(await page.locator('#note-content a').count()>=2);await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>document.activeElement.dataset.note),'s03');});
  await check(label+': package turn and four fields',async()=>{await jump(page,'s09');await page.locator('#package-turn').click();await page.waitForTimeout(900);assert.equal(await page.locator('.package-back').evaluate(el=>el.inert),false);for(let i=0;i<4;i++){await page.locator('[data-label="'+i+'"]').click();assert.equal(await page.locator('[data-label="'+i+'"]').getAttribute('aria-pressed'),'true');}await page.locator('#package-turn').click();assert.equal(await page.locator('.package-back').evaluate(el=>el.inert),true);});
  await check(label+': three clinical contexts',async()=>{await jump(page,'s10');for(let i=0;i<3;i++){await page.locator('[data-risk="'+i+'"]').click();assert.equal(await page.locator('[data-risk="'+i+'"]').getAttribute('aria-pressed'),'true');}assert.match(await page.locator('#risk-b').textContent(),/семейные/);});
  await check(label+': all doctor questions and habits',async()=>{await jump(page,'s12');for(let i=0;i<3;i++){await page.locator('[data-question="'+i+'"]').click();assert.equal(await page.locator('#question-number').innerText(),String(i+1).padStart(2,'0'));}await jump(page,'s13');for(let i=0;i<3;i++){await page.locator('[data-habit="'+i+'"]').click();assert.equal(await page.locator('[data-habit="'+i+'"]').getAttribute('aria-pressed'),'true');}assert.match(await page.locator('#habit-message').innerText(),/несладкий/);});
  await check(label+': contents navigation and native scroll',async()=>{await page.locator('#menu-toggle').click();assert.equal(await page.locator('#contents-list a').count(),14);await page.locator('#contents-list a[href="#s05"]').click();await page.waitForFunction(()=>document.querySelector('#scene-number').textContent==='05');assert.equal(await page.locator('#scene-number').innerText(),'05');});
  await check(label+': ambient playback and offscreen pause',async()=>{await jump(page,'s04');await page.waitForTimeout(500);assert.equal(await page.locator('#s04 video').evaluate(v=>v.paused),false);await jump(page,'s06');await page.waitForTimeout(300);assert.equal(await page.locator('#s04 video').evaluate(v=>v.paused),true);});
  await check(label+': dialog pauses ambient media',async()=>{await jump(page,'s11');await page.waitForTimeout(400);await page.locator('[data-note="s11"]').click();assert.equal(await page.locator('#s11 video').evaluate(v=>v.paused),true);await page.keyboard.press('Escape');});
  await check(label+': manual global pause',async()=>{await page.locator('#motion-toggle').click();assert.equal(await page.locator('#motion-toggle').getAttribute('aria-pressed'),'false');assert.equal(await page.locator('#s11 video').evaluate(v=>v.paused),true);await page.locator('#motion-toggle').click();});
  await check(label+': hidden-document lifecycle pauses media',async()=>{await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});assert.equal(await page.locator('#s11 video').evaluate(v=>v.paused),true);assert.equal(await page.locator('body').evaluate(el=>el.classList.contains('motion-paused')),true);await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});});
  await check(label+': showreel load, close and focus return',async()=>{await page.locator('[data-open-film]').first().click();await page.waitForFunction(()=>Number.isFinite(document.querySelector('#showreel').duration));assert.equal(await page.locator('#showreel').evaluate(v=>Math.round(v.duration)),24);await page.keyboard.press('Escape');assert.equal(await page.locator('#showreel').evaluate(v=>v.paused),true);assert.equal(await page.evaluate(()=>document.activeElement.hasAttribute('data-open-film')),true);});
  await check(label+': reduced motion static mode',async()=>{await page.emulateMedia({reducedMotion:'reduce'});await jump(page,'s04');assert.equal(await page.locator('#motion-toggle').getAttribute('aria-pressed'),'false');assert.equal(await page.locator('#s04 video').evaluate(v=>v.paused),true);await page.emulateMedia({reducedMotion:'no-preference'});});
  await check(label+': enlarged text 200%',async()=>{await page.setViewportSize({width:320,height:780});await page.evaluate(()=>document.querySelectorAll('h1,h2,.scene-lead,.switches button').forEach(el=>{el.style.fontSize=parseFloat(getComputedStyle(el).fontSize)*2+'px';}));for(const id of ['s02','s03','s09','s12','s13']){await jump(page,id);const invalid=await page.locator('#'+id+' .scene-copy').evaluate(copy=>[...copy.querySelectorAll('h2,.scene-lead,.switches')].some(el=>el.scrollWidth>el.clientWidth+1));assert.equal(invalid,false);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);}});
  report.browserResults.push({browser:label,version:browser.version(),sceneViews:sizes.length*14});
  await context.close();
}
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.VERBA_CHROMIUM||'/usr/bin/chromium',args:['--no-sandbox']});
  await inspect(browser,'Chromium');
  await check('Save-Data: no ambient src or video request',async()=>{const c=await browser.newContext();await c.addInitScript(()=>Object.defineProperty(navigator,'connection',{value:{saveData:true,addEventListener(){}}}));const p=await c.newPage();const requests=[];p.on('request',r=>{if(r.url().endsWith('.mp4'))requests.push(r.url());});await p.goto(url);for(const id of ['s04','s08','s11'])await jump(p,id);assert.equal(await p.locator('video[data-ambient] source[src]').count(),0);assert.equal(requests.length,0);await c.close();});
  await check('Initial reduced motion: no ambient src or video request',async()=>{const c=await browser.newContext({reducedMotion:'reduce'});const p=await c.newPage();const requests=[];p.on('request',r=>{if(r.url().endsWith('.mp4'))requests.push(r.url());});await p.goto(url);for(const id of ['s04','s08','s11'])await jump(p,id);assert.equal(await p.locator('video[data-ambient] source[src]').count(),0);assert.equal(requests.length,0);await c.close();});
  await check('Autoplay rejection: poster remains',async()=>{const c=await browser.newContext();await c.addInitScript(()=>{HTMLMediaElement.prototype.play=function(){return Promise.reject(new Error('autoplay blocked'));};});const p=await c.newPage();await p.goto(url);await jump(p,'s04');await p.waitForTimeout(300);assert.equal(await p.locator('#s04 video').evaluate(v=>v.classList.contains('ready')),false);assert.equal(await p.locator('#s04 img').evaluate(img=>img.naturalWidth>0),true);await c.close();});
  await check('No JavaScript: 14 scenes and sources remain readable',async()=>{const c=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const p=await c.newPage();await p.goto(url);assert.equal(await p.locator('#lecture>.scene').count(),14);await p.locator('#note-s05 summary').click();assert.equal(await p.locator('#note-s05').evaluate(el=>el.open),true);assert.ok(await p.locator('#note-s05 a').count());await c.close();});
  await browser.close();
  if(process.env.VERBA_WEBKIT==='1'){try{const wk=await webkit.launch();await inspect(wk,'WebKit',false);await wk.close();}catch(error){report.browserResults.push({browser:'WebKit',blocked:error.message});}}
  report.passed=report.checks.every(c=>c.passed)&&!report.errors.length&&!report.failedAssets.length&&report.viewportResults.every(r=>!r.horizontalOverflow&&!r.clippedText.length&&!r.brokenImages.length);
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({passed:report.passed,sceneViews:report.viewportResults.length,checks:report.checks,errors:report.errors,failedAssets:report.failedAssets,browserResults:report.browserResults,layoutFailures:report.viewportResults.filter(r=>r.horizontalOverflow||r.clippedText.length||r.brokenImages.length)},null,2));
  if(!report.passed)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1);});
