import {chromium} from '/Users/poli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
const base=process.env.GAME_URL||'http://localhost:8097/two-d/';
const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try{
 const p=await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 for(let level=1;level<=12;level++){
  await p.goto(base+(level===1?'':`level-${level}.html`));
  await p.waitForFunction(()=>document.body.classList.contains('has-pixel-dialogue'));
  const result=await p.evaluate(()=>{const arrows=[...document.querySelectorAll('#touch button[data-key],#touch button[data-input]:not([data-input="jump"])')];return {arrows:arrows.map(x=>{const r=x.getBoundingClientRect(),s=getComputedStyle(x);return {label:x.textContent,w:r.width,h:r.height,x:r.x,right:r.right,select:s.webkitUserSelect};}),overflow:document.documentElement.scrollWidth>innerWidth,blocked:!arrows[0].dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true})),selected:!arrows[0].dispatchEvent(new Event('selectstart',{bubbles:true,cancelable:true}))};});
  console.log(`Level ${level}: consistent arrows, no selection or overflow`);
  for(const a of result.arrows){assert.equal(a.w,56);assert.equal(a.h,56);assert.equal(a.select,'none');assert.ok(a.right<=390);}
  assert.ok(result.blocked);assert.ok(result.selected);assert.ok(!result.overflow,'overflow level '+level);
 }
 await p.goto(base);await p.locator('#start:not([disabled])').waitFor();await p.locator('#start').tap();
 const before=await p.evaluate(()=>({x:fright2d.x,y:fright2d.y}));const arrow=p.locator('[data-key="ArrowUp"]');await arrow.scrollIntoViewIfNeeded();const r=await arrow.boundingBox(),cdp=await p.context().newCDPSession(p);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:r.x+r.width/2,y:r.y+r.height/2}]});await p.waitForTimeout(1800);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 const after=await p.evaluate(()=>({x:fright2d.x,y:fright2d.y,selection:getSelection().toString()}));assert.ok(Math.hypot(after.x-before.x,after.y-before.y)>10);assert.equal(after.selection,'');await p.waitForTimeout(350);assert.equal(await p.evaluate(()=>fright2d.y),after.y);console.log('Real touch hold moved and released cleanly',before,after);
 await p.goto(base+'level-2.html');await p.waitForFunction(()=>window.fright2d?.running);await p.locator('#light').tap();await p.waitForFunction(()=>window.frightSoundscape?.scratches>0,{timeout:12000});const scratches=await p.evaluate(()=>frightSoundscape.scratches);await p.locator('#sound').tap();await p.waitForTimeout(1200);assert.equal(await p.evaluate(()=>frightSoundscape.scratches),scratches);console.log('Hall scratching starts after input; mute works');
 const sounds=await p.evaluate(async()=>{const {playBalloonExplosion,playDistantScratch,playWoodenDrawer}=await import('./room-effects.js');const results=[];for(const [name,play]of [['balloon',playBalloonExplosion],['scratch',playDistantScratch],['drawer',playWoodenDrawer]]){const ac=new OfflineAudioContext(2,44100*3,44100);const echo=ac.createGain();echo.gain.value=.2;echo.connect(ac.destination);play(ac,ac.destination,echo);const rendered=await ac.startRendering(),data=rendered.getChannelData(0);let sum=0,peak=0;for(const n of data){sum+=n*n;peak=Math.max(peak,Math.abs(n));}results.push({name,peak,rms:Math.sqrt(sum/data.length)});}return results;});for(const s of sounds){assert.ok(s.peak>0.01);assert.ok(s.peak<1);console.log(s);assert.ok(s.rms>.0001);}console.log('Audio rendered without clipping',sounds);assert.deepEqual(errors,[]);
}finally{await b.close();}
