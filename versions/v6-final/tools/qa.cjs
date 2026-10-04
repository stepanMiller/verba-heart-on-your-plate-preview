const { chromium, webkit } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const url = process.env.VERBA_URL || 'http://127.0.0.1:4173/versions/v6-final/';
const output = process.env.VERBA_QA_OUTPUT || path.resolve(__dirname, '../review/qa');
fs.mkdirSync(output, { recursive: true });
const sizes = [[320,780],[390,844],[844,390],[768,1024],[1024,768],[1440,936],[1920,1080]];
const report = { date: '2026-10-04', url, viewportResults: [], checks: [], errors: [], failedAssets: [], browserResults: [] };
async function check(name, fn) { try { await fn(); report.checks.push({ name, passed: true }); } catch (e) { report.checks.push({ name, passed: false, error: e.message }); } }
async function jump(page, id) { await page.evaluate(id => document.getElementById(id).scrollIntoView({ behavior: 'instant', block: 'start' }), id); await page.waitForTimeout(80); }
async function inspect(browser, label, screenshots = true) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 936 } });
  const page = await context.newPage();
  page.on('pageerror', e => report.errors.push({ browser: label, error: e.message }));
  page.on('response', r => { if (r.status() >= 400 && r.url().startsWith(url)) report.failedAssets.push({ browser: label, url: r.url(), status: r.status() }); });
  await page.goto(url, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('#lecture > .scene').count(), 14);
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height });
    for (let i = 1; i <= 14; i++) {
      const id = 's' + String(i).padStart(2, '0'); await jump(page, id);
      const result = await page.locator('#' + id).evaluate(scene => {
        const r = scene.getBoundingClientRect();
        const text = [...scene.querySelectorAll('h1,h2,.scene-lead,.eyebrow,.switches,.scene-foot,#question-text,.habit-options,.fibre-path,.hepatic-path,.risk-context')].filter(el => el.offsetWidth > 0);
        return { scene: scene.id, sceneHeight: Math.round(r.height), horizontalOverflow: document.documentElement.scrollWidth > innerWidth + 1,
          clippedText: text.filter(el => { const b = el.getBoundingClientRect(); return b.left < -.5 || b.right > innerWidth + .5 || b.top < r.top - .5 || b.bottom > r.bottom + .5 || el.scrollWidth > el.clientWidth + 1; }).map(el => el.id || el.className || el.tagName),
          brokenImages: [...scene.querySelectorAll('img')].filter(img => img.complete && !img.naturalWidth).map(img => img.getAttribute('src')) };
      });
      report.viewportResults.push({ browser: label, width, height, ...result });
      if (screenshots && process.env.VERBA_SCREENSHOTS !== '0' && [390,1440].includes(width)) await page.locator('#' + id).screenshot({ path: path.join(output, id + '-' + width + '.png') });
    }
  }
  await page.setViewportSize({ width: 1440, height: 936 });
  await check(label + ': carrier, cargo and ApoB beats', async () => {
    await jump(page, 's03');
    for (let i = 0; i < 3; i++) { await page.locator('[data-lipid="' + i + '"]').click(); assert.equal(await page.locator('[data-lipid="' + i + '"]').getAttribute('aria-pressed'), 'true'); }
    assert.equal(await page.locator('#apob-beat').isVisible(), true);
    assert.match(await page.locator('.science-caption').innerText(), /Концептуальный разрез ЛПНП/);
    assert.match(await page.locator('#particle-name').innerText(), /эфиры холестерина и ТГ/);
  });
  await check(label + ': source dialog, Escape, focus return', async () => {
    await page.locator('[data-note="s03"]').click(); assert.equal(await page.locator('#note-dialog').evaluate(el => el.open), true);
    assert.match(await page.locator('#note-content').innerText(), /ApoB/); assert.ok(await page.locator('#note-content a').count() >= 2);
    await page.keyboard.press('Escape'); assert.equal(await page.evaluate(() => document.activeElement.dataset.note), 's03');
  });
  await check(label + ': package repeated flip and every label', async () => {
    await jump(page, 's09'); await page.locator('#package-turn').click(); await page.waitForTimeout(1200);
    assert.equal(await page.locator('.package-back').evaluate(el => el.inert), false);
    for (let i = 0; i < 4; i++) { await page.locator('[data-label="' + i + '"]').click(); assert.equal(await page.locator('[data-label="' + i + '"]').getAttribute('aria-pressed'), 'true'); }
    await page.locator('#package-turn').click(); assert.equal(await page.locator('.package-back').evaluate(el => el.inert), true);
    await page.locator('[data-label-step="2"]').click(); assert.equal(await page.locator('#package-turn').getAttribute('aria-pressed'), 'true'); assert.match(await page.locator('#label-message').innerText(), /сахара/);
    await page.locator('#package-turn').click();
  });
  await check(label + ': fixed portrait, changing risk factors', async () => {
    await jump(page, 's10'); const src = await page.locator('#s10 img').getAttribute('src');
    for (let i = 0; i < 3; i++) { await page.locator('[data-risk="' + i + '"]').click(); assert.equal(await page.locator('[data-risk="' + i + '"]').getAttribute('aria-pressed'), 'true'); assert.equal(await page.locator('#s10 img').getAttribute('src'), src); }
    assert.match(await page.locator('#risk-b').innerText(), /семейные/);
  });
  await check(label + ': exact doctor question and all three states', async () => {
    await jump(page, 's12'); assert.equal(await page.locator('#question-text').innerText(), 'Каков мой общий сердечно-сосудистый риск?');
    for (let i = 0; i < 3; i++) { await page.locator('[data-question="' + i + '"]').click(); assert.equal(await page.locator('#question-number').innerText(), String(i + 1).padStart(2, '0')); }
  });
  await check(label + ': habits and reversible practice marks', async () => {
    await jump(page, 's13'); for (let i = 0; i < 3; i++) { await page.locator('[data-habit="' + i + '"]').click(); assert.equal(await page.locator('[data-habit="' + i + '"]').getAttribute('aria-pressed'), 'true'); }
    assert.match(await page.locator('#habit-message').innerText(), /несладкий/);
    await page.locator('[data-day="1"]').click(); assert.equal(await page.locator('[data-day="1"]').getAttribute('aria-pressed'), 'true');
    await page.locator('[data-day="1"]').click(); assert.equal(await page.locator('[data-day="1"]').getAttribute('aria-pressed'), 'false');
  });
  await check(label + ': contents and native anchors', async () => {
    await page.locator('#menu-toggle').click(); assert.equal(await page.locator('#contents-list a').count(), 14);
    await page.locator('#contents-list a[href="#s05"]').click(); await page.waitForFunction(() => document.querySelector('#scene-number').textContent === '05');
    assert.equal(await page.locator('#contents-dialog').evaluate(el => el.open), false);
  });
  await check(label + ': ambient playback and offscreen pause', async () => {
    await jump(page, 's04'); await page.waitForTimeout(700); assert.equal(await page.locator('#s04 video').evaluate(v => v.paused), false);
    await jump(page, 's06'); await page.waitForTimeout(200); assert.equal(await page.locator('#s04 video').evaluate(v => v.paused), true);
  });
  await check(label + ': dialogs pause ambient video', async () => {
    await jump(page, 's11'); await page.waitForTimeout(500); await page.locator('[data-note="s11"]').click(); assert.equal(await page.locator('#s11 video').evaluate(v => v.paused), true); await page.keyboard.press('Escape');
  });
  await check(label + ': manual pause and hidden-document lifecycle', async () => {
    await page.locator('#motion-toggle').click(); assert.equal(await page.locator('#motion-toggle').getAttribute('aria-pressed'), 'false'); assert.equal(await page.locator('#s11 video').evaluate(v => v.paused), true);
    await page.locator('#motion-toggle').click(); await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); });
    assert.equal(await page.locator('#s11 video').evaluate(v => v.paused), true); assert.equal(await page.locator('body').evaluate(el => el.classList.contains('motion-paused')), true);
    await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
  });
  await check(label + ': foyer duration, close and focus return', async () => {
    await page.locator('[data-open-film]').first().click(); await page.waitForFunction(() => Number.isFinite(document.querySelector('#showreel').duration));
    assert.equal(await page.locator('#showreel').evaluate(v => Math.round(v.duration)), 26); await page.keyboard.press('Escape');
    assert.equal(await page.locator('#showreel').evaluate(v => v.paused), true); assert.equal(await page.evaluate(() => document.activeElement.hasAttribute('data-open-film')), true);
  });
  await check(label + ': accepted S03 clip and single final foyer film', async () => {
    await jump(page, 's03');
    await page.locator('[data-open-film][data-film="s03"]').last().click();
    await page.waitForFunction(() => Math.round(document.querySelector('#showreel').duration) === 2);
    assert.match(await page.locator('#showreel source').getAttribute('src'), /s03-lipoprotein-motion-web\.mp4$/);
    assert.match(await page.locator('.film-caption').innerText(), /Концептуальный|концептуальный/);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#showreel').evaluate(v => v.paused), true);
    assert.equal(await page.evaluate(() => document.activeElement.dataset.film), 's03');
    await page.locator('[data-open-film]').first().click();
    await page.waitForFunction(() => Math.round(document.querySelector('#showreel').duration) === 26);
    assert.match(await page.locator('#showreel source').getAttribute('src'), /foyer-film\.mp4$/);
    assert.equal(await page.locator('[data-film="animatic"]').count(), 0);
    assert.doesNotMatch(await page.locator('.film-caption').innerText(), /prototype|аниматик/i);
    await page.keyboard.press('Escape');
  });
  await check(label + ': all four generated shots play once and explicitly replay', async () => {
    for (const [id, duration] of [['s01',5],['s03',2],['s06',3],['s14',5]]) {
      await jump(page, id);
      const video = page.locator('#' + id + '-ambient');
      assert.equal(await video.evaluate(v => v.loop), false);
      await page.waitForFunction(id => document.getElementById(id + '-ambient').ended, id, { timeout: 30000 });
      assert.equal(await video.evaluate(v => Math.round(v.duration)), duration);
      assert.equal(await video.evaluate(v => v.paused && v.classList.contains('ready')), true);
      await page.locator('[data-ambient-replay="' + id + '-ambient"]').click();
      await page.waitForFunction(id => !document.getElementById(id + '-ambient').paused, id);
      await jump(page, 's02');
      assert.equal(await video.evaluate(v => v.paused), true);
    }
  });
  await check(label + ': mobile touch targets, readable science and native anchor offset', async () => {
    for (const [width, height] of [[320,780],[390,844],[844,390]]) {
      await page.setViewportSize({ width, height });
      for (let i = 1; i <= 14; i++) {
        const id = 's' + String(i).padStart(2, '0'); await jump(page, id);
        const small = await page.locator('#' + id).evaluate(scene => [...scene.querySelectorAll('button')].filter(el => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && !el.closest('[inert],[aria-hidden="true"]') && (r.width < 43.5 || r.height < 43.5);
        }).map(el => el.id || el.textContent.trim()));
        assert.deepEqual(small, [], width + 'px / ' + id + ': small touch targets');
      }
      await jump(page, 's03');
      for (const selector of ['.science-caption','.carrier-label','.cargo-label']) assert.ok(await page.locator('#s03 ' + selector).evaluate(el => parseFloat(getComputedStyle(el).fontSize)) >= 12);
      await jump(page, 's14');
      const positioned = await page.evaluate(() => document.querySelector('#h14').getBoundingClientRect().top >= document.querySelector('.site-header').getBoundingClientRect().bottom - 1);
      assert.equal(positioned, true, width + 'px / final heading must clear header');
      for (const selector of ['#previous-scene','#next-scene']) {
        const r = await page.locator(selector).boundingBox(); assert.ok(r.width >= 44 && r.height >= 44);
        assert.equal(await page.locator(selector + ' svg').count(), 1);
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
    }
    await page.setViewportSize({ width: 1440, height: 936 });
  });
  await check(label + ': reduced motion removes ambient sources', async () => {
    await page.emulateMedia({ reducedMotion: 'reduce' }); await jump(page, 's04');
    await page.waitForFunction(() => document.querySelector('#motion-toggle').getAttribute('aria-pressed') === 'false');
    assert.equal(await page.locator('video[data-ambient] source[src]').count(), 0); assert.equal(await page.locator('#motion-toggle').getAttribute('aria-pressed'), 'false');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  });
  await check(label + ': arrows and keyboard scene navigation', async () => {
    await jump(page, 's01'); await page.locator('#next-scene').click();
    await page.waitForFunction(() => document.querySelector('#scene-number').textContent === '02');
    await page.locator('#previous-scene').click();
    await page.waitForFunction(() => document.querySelector('#scene-number').textContent === '01');
    await page.locator('body').click({position:{x:3,y:500}});
    await page.keyboard.press('PageDown');
    await page.waitForFunction(() => document.querySelector('#scene-number').textContent === '02');
  });
  await check(label + ': interactive states on mobile and tablet', async () => {
    await page.goto(url);
    for (const [width,height] of [[320,780],[390,844],[844,390],[1024,768]]) {
      await page.setViewportSize({width,height});
      for (const [id,attribute,count] of [['s03','data-lipid',3],['s10','data-risk',3],['s12','data-question',3],['s13','data-habit',3]]) {
        await jump(page,id);
        for(let i=0;i<count;i++) {
          await page.locator('['+attribute+'="'+i+'"]').click();
          assert.equal(await page.locator('['+attribute+'="'+i+'"]').getAttribute('aria-pressed'),'true');
          const bad = await page.locator('#'+id).evaluate(scene=>[...scene.querySelectorAll('h2,.scene-lead,.risk-context,#question-text,.cargo-branch,.apob-beat')].filter(el=>{
            const r=el.getBoundingClientRect();return r.width>0&&(el.scrollWidth>el.clientWidth+1||r.left<-.5||r.right>innerWidth+.5);
          }).map(el=>el.id||el.className));
          assert.deepEqual(bad,[],width+' / '+id+' / '+i);
        }
      }
      await jump(page,'s09');
      for(let repeat=0;repeat<3;repeat++) {
        await page.locator('#package-turn').click(); await page.waitForTimeout(1150);
        for(let i=0;i<4;i++) {
          await page.locator('[data-label="'+i+'"]').click();
          assert.equal(await page.locator('[data-label="'+i+'"]').getAttribute('aria-pressed'),'true');
          const r=await page.locator('[data-label="'+i+'"]').boundingBox(); assert.ok(r.width>=44&&r.height>=44);
        }
        await page.locator('#package-turn').click(); await page.waitForTimeout(1150);
      }
      await page.locator('#menu-toggle').click();
      await page.locator('[data-close-dialog]').filter({visible:true}).click();
      assert.equal(await page.evaluate(()=>document.activeElement.id),'menu-toggle');
      await jump(page,'s03'); await page.locator('[data-note="s03"]').click();
      assert.equal(await page.locator('#note-dialog').evaluate(el=>el.scrollWidth<=el.clientWidth+1),true);
      await page.keyboard.press('Escape');
      assert.equal(await page.evaluate(()=>document.activeElement.dataset.note),'s03');
    }
    await page.setViewportSize({width:1440,height:936});
  });
  await check(label + ': only current media loads on initial visit', async () => {
    await page.goto(url); await jump(page,'s01');
    await page.waitForFunction(() => !!document.querySelector('#s01-ambient source[src]'));
    assert.equal(await page.locator('video[data-ambient] source[src]').count(), 1);
    assert.equal(await page.locator('#showreel source[src]').count(), 0);
  });
  await check(label + ': public UI has no production controls or animatic', async () => {
    assert.equal(await page.locator('[data-film="animatic"],.film-versions,.review-status').count(),0);
    assert.doesNotMatch(await page.locator('body').innerText(),/Creative prototype|QA notes|Исходный аниматик|Контролируемый макет/i);
    await page.goto(url + '?review'); assert.equal(await page.locator('.review-status').count(),1);
  });
  await check(label + ': no clipped scene text at 200 percent enlargement', async () => {
    await page.goto(url); await page.setViewportSize({width:1440,height:936});
    await page.evaluate(() => {
      const text=[...document.querySelectorAll('h1,h2,p,button,a,summary,span,strong,small,figcaption')];
      const sizes=text.map(el=>[el,parseFloat(getComputedStyle(el).fontSize)]);
      sizes.forEach(([el,size])=>el.style.setProperty('font-size',size*2+'px','important'));
    });
    await page.waitForTimeout(300);
    for(let i=1;i<=14;i++) {
      const id='s'+String(i).padStart(2,'0'); await jump(page,id);
      const clipped=await page.locator('#'+id).evaluate(scene=>{
        const r=scene.getBoundingClientRect();
        return [...scene.querySelectorAll('h1,h2,.scene-lead,.eyebrow,.scene-foot,#question-text,.habit-options,.fibre-path,.hepatic-path,.risk-context')].filter(el=>{
          const b=el.getBoundingClientRect();return b.width>0&&(b.left<-.5||b.right>innerWidth+.5||b.top<r.top-.5||b.bottom>r.bottom+.5||el.scrollWidth>el.clientWidth+1);
        }).map(el=>el.id||el.className||el.tagName);
      });
      assert.deepEqual(clipped,[],id+': enlarged text clips');
      const overlaps=await page.locator('#'+id).evaluate(scene=>{
        const pairs=[['.scene-copy','.fibre-path'],['.scene-copy','.hepatic-path'],['.scene-copy','.risk-context'],['.consultation-heading','.question-paper']];
        return pairs.filter(([a,b])=>{
          const x=scene.querySelector(a),y=scene.querySelector(b);if(!x||!y||getComputedStyle(x).display==='contents')return false;
          const r=x.getBoundingClientRect(),s=y.getBoundingClientRect();return Math.min(r.right,s.right)-Math.max(r.left,s.left)>2&&Math.min(r.bottom,s.bottom)-Math.max(r.top,s.top)>2;
        });
      });
      assert.deepEqual(overlaps,[],id+': enlarged editorial text overlaps');
    }
  });
  report.browserResults.push({ browser: label, version: browser.version(), sceneViews: sizes.length * 14 });
  await context.close();
}
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.VERBA_CHROMIUM || '/usr/bin/chromium', args: ['--no-sandbox','--no-zygote','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader'] });
  await inspect(browser, 'Chromium');
  for (const mode of ['Save-Data', 'Reduced motion']) await check(mode + ': initial visit never requests ambient videos', async () => {
    const c = await browser.newContext(mode === 'Reduced motion' ? { reducedMotion: 'reduce' } : {});
    if (mode === 'Save-Data') await c.addInitScript(() => Object.defineProperty(navigator, 'connection', { value: { saveData: true, addEventListener() {} } }));
    const p = await c.newPage(); const requests = []; p.on('request', r => { if (r.url().endsWith('.mp4')) requests.push(r.url()); });
    await p.goto(url); for (const id of ['s04', 's11']) await jump(p, id);
    assert.equal(await p.locator('video[data-ambient] source[src]').count(), 0); assert.equal(requests.length, 0); await c.close();
  });
  await check('Autoplay rejection keeps poster visible', async () => {
    const c = await browser.newContext(); await c.addInitScript(() => { HTMLMediaElement.prototype.play = function () { return Promise.reject(new Error('Blocked')); }; });
    const p = await c.newPage(); await p.goto(url); await jump(p, 's04'); await p.waitForTimeout(200);
    assert.equal(await p.locator('#s04 video').evaluate(v => v.classList.contains('ready')), false); assert.equal(await p.locator('#s04 img').evaluate(img => img.naturalWidth > 0), true); await c.close();
  });
  await check('No JavaScript: 14 scenes, details and source links', async () => {
    const c = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const p = await c.newPage(); await p.goto(url); assert.equal(await p.locator('#lecture > .scene').count(), 14);
    await p.locator('#note-s05 summary').click(); assert.equal(await p.locator('#note-s05').evaluate(el => el.open), true); assert.ok(await p.locator('#note-s05 a').count()); await c.close();
  });
  await check('Render route is deterministic and normal route stays 14 scenes', async () => {
    const p = await browser.newPage({ viewport: { width: 1440, height: 936 } }); await p.goto(url + '?render=s12');
    await p.waitForSelector('body[data-render-ready="s12"]');
    assert.equal(await p.locator('.render-active').getAttribute('id'), 's12'); await p.evaluate(() => window.verbaFrame('s03')); assert.equal(await p.locator('.render-active').getAttribute('id'), 's03'); await p.close();
  });
  await browser.close();
  if (process.env.VERBA_WEBKIT === '1') { try { const wk = process.env.VERBA_WEBKIT_ROOT; const b = await webkit.launch(wk ? { executablePath: wk + '/bin/MiniBrowser', env: { ...process.env, WEBKIT_EXEC_PATH: wk + '/bin', WEBKIT_INJECTED_BUNDLE_PATH: wk + '/lib', WEBKIT_INSPECTOR_RESOURCES_PATH: wk + '/share', LD_LIBRARY_PATH: wk + '/lib:' + wk + '/sys/lib:' + (process.env.VERBA_WEBKIT_LIBS || ''), GST_PLUGIN_SYSTEM_PATH_1_0: process.env.VERBA_GST_PLUGINS || '', GST_PLUGIN_SCANNER: process.env.VERBA_GST_SCANNER || '' } } : {}); await inspect(b, 'WebKit', false); await b.close(); } catch (e) { report.browserResults.push({ browser: 'WebKit', blocked: e.message }); } }
  report.passed = report.checks.every(c => c.passed) && !report.errors.length && !report.failedAssets.length && report.viewportResults.every(r => !r.horizontalOverflow && !r.clippedText.length && !r.brokenImages.length);
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ passed: report.passed, sceneViews: report.viewportResults.length, checks: report.checks, errors: report.errors, failedAssets: report.failedAssets, browserResults: report.browserResults, layoutFailures: report.viewportResults.filter(r => r.horizontalOverflow || r.clippedText.length || r.brokenImages.length) }, null, 2));
  if (!report.passed) process.exitCode = 1;
})().catch(e => {
  report.passed = false; report.blocked = e.message;
  fs.writeFileSync(path.join(output, 'results.json'), JSON.stringify(report, null, 2) + '\n');
  console.error(e); process.exitCode = 1;
});
