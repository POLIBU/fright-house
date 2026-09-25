import {chromium} from '/Users/poli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'}),cdp=await page.context().newCDPSession(page),errors=[];
page.on('pageerror',e=>errors.push(e.message));
async function touch(type,points=[]){await cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points.map(([x,y,id=1])=>({x,y,id,radiusX:8,radiusY:8}))});}
try{
 for(let level=1;level<=12;level++){
  await page.goto('http://localhost:8089/two-d/'+(level===1?'index.html':`level-${level}.html`));
  await page.locator('#start:not([disabled])').waitFor({state:'attached'});if(level===1)await page.locator('#start').tap();
  const stick=page.locator('#touch-joystick');await stick.scrollIntoViewIfNeeded();const r=await stick.boundingBox();assert.equal(r.width,132);assert.equal(r.height,132);
  assert.equal(await page.locator('#touch [data-key]:visible').count(),0);
  if(level!==12)assert.ok(await page.locator('#action').isVisible());
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow '+level);
  assert.equal(await page.locator('#intro').evaluate(el=>getComputedStyle(el).userSelect),'none');
  assert.equal(await page.evaluate(()=>document.body.dispatchEvent(new Event('selectstart',{bubbles:true,cancelable:true}))),false);
  await page.evaluate(()=>{window.__directions=[];for(const type of ['keydown','keyup'])window.addEventListener(type,e=>{if(e.key.startsWith('Arrow'))__directions.push(type+':'+e.key)});});
  const x=r.x+66,y=r.y+66,before=level===1?await page.evaluate(()=>({x:fright2d.x,y:fright2d.y})):null;
  await touch('touchStart',[[x,y]]);await touch('touchMove',[[x+40,y]]);await page.waitForTimeout(400);
  if(level===1){const moved=await page.evaluate(()=>({x:fright2d.x,y:fright2d.y}));assert.ok(Math.hypot(moved.x-before.x,moved.y-before.y)>5,'real finger moves investigator');}
  await touch('touchMove',[[x+30,y-30]]);await touch('touchEnd');
  const keys=await page.evaluate(()=>__directions);assert.ok(keys.includes('keydown:ArrowRight'));assert.ok(keys.includes('keyup:ArrowRight'));
  if(level!==9&&level!==11)assert.ok(keys.includes('keydown:ArrowUp'),'diagonal supported '+level);
  await touch('touchStart',[[x-40,y]]);await touch('touchCancel');assert.ok((await page.evaluate(()=>__directions)).includes('keyup:ArrowLeft'));
  assert.equal(await stick.evaluate(el=>el.classList.contains('held')),false);
  if(level===3){
   const jump=await page.locator('[data-input="jump"]').boundingBox();
   await page.evaluate(()=>{window.__jumpTouches=0;document.querySelector('[data-input="jump"]').addEventListener('pointerdown',e=>{if(e.isTrusted)__jumpTouches++;});});
   await touch('touchStart',[[x+40,y,1]]);await touch('touchStart',[[x+40,y,1],[jump.x+jump.width/2,jump.y+jump.height/2,2]]);
   await touch('touchEnd',[[jump.x+jump.width/2,jump.y+jump.height/2,2]]);assert.equal(await page.evaluate(()=>__jumpTouches),1);assert.equal(await stick.evaluate(el=>el.classList.contains('held')),true);await touch('touchEnd');
  }
  if(level===4)await page.screenshot({path:'/tmp/fright-joystick-mobile.png'});
  console.log('Room '+level+': real finger drag, release, cancellation, layout and selection pass');
 }
 const desktop=await browser.newPage({viewport:{width:1100,height:900}});await desktop.goto('http://localhost:8089/two-d/index.html');await desktop.locator('#start:not([disabled])').waitFor();assert.equal(await desktop.locator('#touch-joystick').count(),0);await desktop.locator('#start').click();const initial=await desktop.evaluate(()=>fright2d.x);await desktop.keyboard.down('ArrowRight');await desktop.waitForTimeout(300);await desktop.keyboard.up('ArrowRight');assert.ok(await desktop.evaluate(x=>fright2d.x>x+5,initial));await desktop.close();
 assert.deepEqual(errors,[]);
}finally{await browser.close();}
