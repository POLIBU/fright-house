import {chromium} from '/Users/poli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';import assert from 'node:assert/strict';
const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try{const p=await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),errors=[],tracks=new Set();p.on('pageerror',e=>errors.push(e.message));
for(let level=1;level<=11;level++){
 await p.goto('http://localhost:8089/two-d/'+(level===1?'index.html':`level-${level}.html`));await p.locator('#start:not([disabled])').waitFor({state:'attached'});if(level===1)await p.locator('#start').tap();else await p.locator('header span').tap();
 await p.waitForFunction(()=>window.frightSoundscape?.music.loaded&&frightSoundscape.music.playing,null,{timeout:8000}).catch(async e=>{console.log(await p.evaluate(()=>({sound:frightSoundscape,button:document.querySelector('#sound').textContent,stored:sessionStorage.getItem('fright-house-muted'),paused:window.fright2d?.paused})));throw e;});const music=await p.evaluate(()=>frightSoundscape.music);assert.ok(!tracks.has(music.score));tracks.add(music.score);
 await p.locator('#pause').tap();await p.waitForTimeout(350);assert.equal(await p.evaluate(()=>frightSoundscape.music.playing),false);
 await p.locator('#pause').tap();await p.waitForFunction(()=>frightSoundscape.music.playing);await p.locator('#sound').tap();await p.waitForTimeout(350);assert.ok(await p.evaluate(()=>!frightSoundscape.music.playing||frightSoundscape.music.muted));await p.locator('#sound').tap();await p.waitForFunction(()=>document.querySelector('#sound').textContent==='SOUND ON'&&sessionStorage.getItem('fright-house-muted')==='false');
 if(level===4)assert.equal(await p.locator('#awake').count(),0);console.log('Room '+level+': '+music.score+' loads, plays, pauses and mutes.');
}
assert.deepEqual(errors,[]);
}finally{await b.close();}
