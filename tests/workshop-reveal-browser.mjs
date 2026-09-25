import {chromium} from '/Users/poli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const out=process.env.PLAYTEST_OUT||'validation/rabbit-phone-fix';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try {
 for(const mobile of [false,true]) {
  const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1100,height:1000},isMobile:mobile,hasTouch:mobile});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:8089/two-d/level-8.html');
  await page.waitForFunction(()=>window.frightWorkshop?.running);
  const box=await page.locator('#game').boundingBox();
  if(mobile)await page.touchscreen.tap(box.x+box.width/2,box.y+box.height*.8);
  else await page.mouse.click(box.x+box.width/2,box.y+box.height*.8);
  for(const age of [6,8,8.7,9.1]) {
   await page.waitForFunction(age=>frightWorkshop.age>=age,age);
   await page.locator('#stage').screenshot({path:`${out}/rig-${mobile?'mobile':'desktop'}-${age}.png`});
  }
  const result=await page.evaluate(async()=>{
   const {createWorkshopSprites}=await import('./workshop-sprites.js');
   const {newWorkshop,REVEAL,HATCH}=await import('./levels/workshop-model.js');
   const sprites=await createWorkshopSprites(),s=newWorkshop(),canvas=document.createElement('canvas');
   canvas.width=720;canvas.height=540;const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;
   const render=age=>{s.age=age;ctx.clearRect(0,0,720,540);sprites.draw(ctx,s);return ctx.getImageData(0,0,720,540).data;};
   const hidden=render(REVEAL.riseAt),rising=render(REVEAL.riseAt+REVEAL.riseDuration-.001),raised=render(REVEAL.riseAt+REVEAL.riseDuration);
   let hiddenPixels=0,upperArmPixels=0,missingPixels=0,belowFloorPixels=0;
   for(let i=3;i<rising.length;i+=4){const y=Math.floor((i-3)/4/720);if(hidden[i])hiddenPixels++;if(rising[i]&&y<HATCH.y)upperArmPixels++;if(raised[i]>128&&rising[i]<128)missingPixels++;if(rising[i]&&y>=HATCH.y+HATCH.h)belowFloorPixels++;}
   return {hiddenPixels,upperArmPixels,missingPixels,belowFloorPixels};
  });
  assert.equal(result.hiddenPixels,0,'Rig must stay below the floor before the lift starts');
  assert.ok(result.upperArmPixels>50,'Upper arm must extend above the back edge of the hatch');
  assert.ok(result.missingPixels<10,'No body parts should pop into view when the lift completes');
  assert.equal(result.belowFloorPixels,0,'Front floor must still hide submerged body parts');
  assert.deepEqual(errors,[]);console.log({mobile,...result});await page.close();
 }
} finally {await browser.close();}
