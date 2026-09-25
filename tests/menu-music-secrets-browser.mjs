import {chromium} from '/Users/poli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';import assert from 'node:assert/strict';
const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try{const p=await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),errors=[];p.on('pageerror',e=>errors.push(e.message));
for(const level of [1,7,11]){
 await p.goto('http://localhost:8089/two-d/'+(level===1?'index.html':`level-${level}.html`));await p.locator('#start:not([disabled])').waitFor({state:'attached'});if(level===1)await p.locator('#start').tap();else await p.locator('header span').tap();
 await p.waitForFunction(()=>frightSoundscape.music.audible);for(let i=0;i<3;i++)await p.keyboard.press('e');
 const world=()=>p.evaluate(()=>{const s=window.fright2d||window.frightMezzanine||window.frightFinale;return {time:s.time,paused:s.paused,music:frightSoundscape.music.currentTime,audible:frightSoundscape.music.audible};});
 for(const [name,id] of [['POCKETS','pockets-menu'],['INSTRUCTIONS','instructions-menu']]){
  await p.getByRole('button',{name,exact:true}).tap();await p.locator('#'+id).waitFor({state:'visible'});const before=await world();assert.ok(before.paused);await p.waitForTimeout(600);const after=await world();assert.equal(after.time,before.time);assert.ok(after.audible);assert.ok(after.music>before.music+.3);await p.locator('#'+id+' button').tap();await p.waitForTimeout(80);assert.equal((await world()).paused,false);
 }
 if(level===1){await p.locator('#journal').tap();const before=await world();await p.waitForTimeout(600);assert.ok((await world()).music>before.music+.3);await p.keyboard.press('e');}
 await p.locator('#pause').tap();await p.waitForTimeout(300);assert.equal((await world()).audible,false);await p.getByRole('button',{name:'POCKETS',exact:true}).tap();await p.waitForTimeout(300);assert.equal((await world()).audible,false);await p.locator('#pockets-menu button').tap();await p.waitForTimeout(80);assert.ok((await world()).paused);await p.locator('#pause').tap();
 assert.equal(await p.locator('#secret-count').textContent(),level===1?'SECRETS 0 / 11':'SECRETS 2 / 11');
 if(level===1){await p.evaluate(async()=>{const m=await import('./campaign/secrets.js');m.collectEvidence('ribbon');m.collectEvidence('glasses');m.collectEvidence('ribbon');});assert.equal(await p.locator('#secret-count').textContent(),'SECRETS 2 / 11');}
 assert.equal(await p.locator('#hud').evaluate(h=>getComputedStyle(h.children[h.children.length-2]).display),'none');console.log(`Room ${level}: menu music uninterrupted; manual pause preserved; shared secret total visible.`);
}
await p.goto('http://localhost:8089/two-d/index.html');await p.locator('#start:not([disabled])').waitFor({state:'attached'});await p.locator('#start').tap();assert.equal(await p.locator('#secret-count').textContent(),'SECRETS 0 / 11');assert.deepEqual(errors,[]);
}finally{await b.close();}
