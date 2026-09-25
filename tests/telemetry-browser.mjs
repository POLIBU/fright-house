import {observer} from './telemetry-observer.mjs';
import {chromium} from '/Users/poli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';import fs from 'node:fs/promises';
const base=(process.env.GAME_URL||'http://localhost:8089/two-d').replace(/\/$/,''),out=process.env.PLAYTEST_OUT||'validation/telemetry';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),results=[];
// Independent command observer installed before production instrumentation.

try{
 for(const mobile of [false,true]){const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1100,height:1000},isMobile:mobile,hasTouch:mobile});await context.addInitScript(observer);
 for(let room=1;room<=12;room++){const p=await context.newPage(),errors=[],missing=[];p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});p.on('response',r=>{if(r.status()>=400)missing.push(r.url());});await p.goto(base+'/'+(room===1?'index.html':`level-${room}.html`));await p.waitForFunction(()=>window.__READY__);if(room===1){if(mobile)await p.locator('#start').tap();else await p.locator('#start').click();}
 await p.waitForTimeout(550);const before=await p.evaluate(()=>__GAME__);assert.equal(before.room,room);assert.ok(before.running);assert.ok(before.frame>1);assert.equal(before.assets.pending,0);assert.ok(before.fps>0);assert.ok(before.draws>0);assert.ok(before.tris>=0);assert.equal(before.over,false);
 if([1,4,5,6,7,8,9,10,11,12].includes(room)){await p.locator('#pause').click();await p.waitForTimeout(150);const frozen=await p.evaluate(()=>__GAME__);if(frozen.paused){assert.ok(frozen.frame>before.frame);assert.equal(frozen.speed,0);}await p.locator('#pause').click();}
 await p.locator('#stage').screenshot({path:`${out}/room-${room}-${mobile?'mobile':'desktop'}.png`});
 const audit=await p.evaluate(()=>__audit);assert.deepEqual(audit.mismatches,[]);assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);results.push({room,mobile,frames:audit.samples.length,peakDraws:Math.max(...audit.samples.map(s=>s.draws)),peakTriangles:Math.max(...audit.samples.map(s=>s.tris)),independentCountsMatch:true});await p.close();}
 await context.close();}
 // Delay and then fail an essential player asset: never advertise readiness early.
 for(const broken of [false,true]){const p=await browser.newPage();let release;const wait=new Promise(r=>release=r);await p.route('**/investigator-walk-v2.png',async r=>{await wait;if(broken)await r.abort();else await r.continue();});await p.goto(base+'/index.html',{waitUntil:'domcontentloaded'});await p.waitForTimeout(700);assert.equal(await p.evaluate(()=>__READY__),false);assert.equal(await p.locator('#start').isDisabled(),true);release();if(broken){await p.waitForTimeout(400);assert.equal(await p.evaluate(()=>__READY__),false);assert.ok(await p.evaluate(()=>__GAME__.assets.failures.length));}else await p.waitForFunction(()=>__READY__);await p.close();}
 console.log(results);
}finally{await browser.close();await fs.writeFile(out+'/rooms.json',JSON.stringify(results,null,2));}
