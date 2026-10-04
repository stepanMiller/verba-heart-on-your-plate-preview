// Deterministic contact-sheet frames from the final presentation, using approved stills.
const {chromium} = require('playwright');
const path = require('node:path');
const fs = require('node:fs');
const output = process.env.VERBA_CAPTURE_OUTPUT || path.resolve(__dirname,'../review/frames');
const url = process.env.VERBA_CAPTURE_URL || 'file://' + path.resolve(__dirname,'../index.html');
fs.mkdirSync(output,{recursive:true});
(async()=>{
  const browser=await chromium.launch({executablePath:process.env.VERBA_CHROMIUM || '/usr/bin/chromium',args:['--no-sandbox','--no-zygote','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader']});
  try {
    const page=await browser.newPage({viewport:{width:1440,height:936}});
    await page.goto(url+'?render=s01');
    const frames=[];
    for(let i=1;i<=14;i++) {
      const id='s'+String(i).padStart(2,'0');
      await page.evaluate(async id=>await window.verbaFrame(id),id);
      await page.waitForFunction(id=>document.body.dataset.renderReady===id,id);
      await page.screenshot({path:path.join(output,id+'.jpg'),type:'jpeg',quality:92});
      frames.push({id,title:await page.locator('#'+id).getAttribute('data-title'),file:id+'.jpg'});
    }
    fs.writeFileSync(path.join(output,'manifest.json'),JSON.stringify({viewport:[1440,936],route:'deterministic still capture; UI hidden; all approved source images',frames},null,2));
    console.log('Captured 14 final scenes.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
