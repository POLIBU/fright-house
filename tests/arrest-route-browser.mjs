import {chromium} from '/Users/poli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const out='validation/arrest-route';await fs.mkdir(out,{recursive:true});
const b=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try{const p=await b.newPage({viewport:{width:1100,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.route('**/epilogue.js',async r=>{const res=await r.fetch();await r.fulfill({response:res,body:await res.text()+`\nwindow.__scene=(phase,age)=>{s.phase=phase;s.age=age;s.paused=true;render();};window.__audio=(phase,age)=>{s.phase=phase;s.age=age;s.time=age;s.paused=false;siren.tick(s,muted);render();};`});});
await p.goto('http://localhost:8089/two-d/level-12.html?preview=arrest');await p.waitForFunction(()=>frightEpilogue?.running);await p.locator('#pause').click();await p.locator('#pause').click();await p.waitForFunction(()=>frightEpilogue.siren.playing);
await p.evaluate(()=>__audio('approach',5));const loud=await p.evaluate(()=>frightEpilogue.siren.level);assert.ok(loud>.2);await p.locator('#sound').click();await p.waitForFunction(()=>!frightEpilogue.siren.playing);await p.locator('#sound').click();await p.evaluate(()=>__audio('police-drive',4));assert.ok(await p.evaluate(()=>frightEpilogue.siren.level)<loud*.1);await p.evaluate(()=>__audio('bedroom',1));assert.equal(await p.evaluate(()=>frightEpilogue.siren.playing),false);
for(const [name,phase,age] of [['rear-bumper','escort',1.5],['alongside','escort',3],['door','crouch',.3],['boarding','crouch',2.2]]){await p.evaluate(([phase,age])=>__scene(phase,age),[phase,age]);await p.locator('#game').screenshot({path:`${out}/${name}.png`});}
assert.deepEqual(errors,[]);console.log('Arrest route screenshots, siren activation, mute, departure fade and silence in bedroom pass.');
}finally{await b.close();}
