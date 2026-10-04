/* Offline rendering of the actual V4 scenes. Requires Playwright and ffmpeg. */
const {chromium} = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const {spawn,execFileSync} = require('node:child_process');
const root = path.resolve(__dirname,'..');
const url = process.env.VERBA_URL || 'http://127.0.0.1:4173/versions/v4/';
const fps = 24;
const shots = ['s01','s03','s04','s05','s06','s09','s11','s14'];
const wait = ms => new Promise(resolve=>setTimeout(resolve,ms));
(async()=> {
  const browser = await chromium.launch({executablePath:process.env.VERBA_CHROMIUM || '/usr/bin/chromium',args:['--no-sandbox']});
  const page = await browser.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1});
  await page.goto(url+'?render=1',{waitUntil:'networkidle'});
  await page.evaluate(()=>{
    const macro=document.querySelector('#s08 video').cloneNode(true);
    document.querySelector('#s01 .bleed').append(macro);
  });
  // Permit causal CSS animations for deterministic time sampling; keep them paused.
  await page.evaluate(()=>document.documentElement.classList.add('motion-on'));
  await page.evaluate(()=>document.body.classList.remove('motion-paused'));
  await page.addStyleTag({content:'.render-mode .scene *{animation-play-state:paused!important}'});
  const film = path.join(root,'assets/showreel-v4.mp4');
  const encoder = spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-vcodec','png','-framerate',String(fps),'-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',film],{stdio:['pipe','ignore','inherit']});
  const done = new Promise((resolve,reject)=>{encoder.on('error',reject);encoder.on('exit',code=>code===0?resolve():reject(new Error('ffmpeg exit '+code)));});
  for(let shot=0;shot<shots.length;shot++) {
    const id=shots[shot];
    console.log('Rendering',id,(shot+1)+'/'+shots.length);
    for(let frame=0;frame<3*fps;frame++) {
      const time=frame/fps;
      await page.evaluate(async ({id,time})=>await window.verbaFrame(id,time),{id,time});
      await page.evaluate(()=>new Promise(requestAnimationFrame));
      const opacity=Math.min(1,(time+.05)/.22,(3-time)/.22);
      await page.evaluate(value=>{document.querySelector('.render-active').style.opacity=value;},opacity);
      const buffer = await page.screenshot({type:'png'});
      if(!encoder.stdin.write(buffer)) await new Promise(resolve=>encoder.stdin.once('drain',resolve));
    }
  }
  encoder.stdin.end();await done;await browser.close();
  execFileSync('ffmpeg',['-y','-ss','1','-i',film,'-frames:v','1','-quality','88',path.join(root,'assets/showreel-poster.webp'),'-loglevel','error']);
  console.log('24s film and poster ready');
})().catch(error=>{console.error(error);process.exit(1);});
