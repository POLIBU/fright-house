import {chromium} from '/Users/poli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const base='http://localhost:8089/two-d/';
const files=['street','hall','platform','toystore','library','barrel','mezzanine','workshop','fall','finale'];
const globals=['fright2d','fright2d','frightPlatform','frightStore','frightLibrary','frightBarrelRun','frightMezzanine','frightWorkshop','frightFall','frightFinale','frightFinale'];
const results=[];
try{for(const mobile of [false,true]){
 const context=await browser.newContext({viewport:mobile?{width:430,height:932}:{width:1200,height:1000},isMobile:mobile,hasTouch:mobile});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 // Exercise the actual finish handlers without replaying all puzzles in this routing regression.
 await page.route(/\/two-d\/(street|hall|platform|toystore|library|barrel|mezzanine|workshop|fall|finale)\.js(?:\?.*)?$/,async route=>{
  const response=await route.fetch();let text=await response.text();const name=new URL(route.request().url()).pathname.split('/').pop().replace('.js','');
  const finish=name==='street'?'enterHall()':name==='hall'?"s.ledger=true;s.drawer=true;Object.assign(s,HALL_OBJECTS.find(o=>o.id==='onward'));interact('onward')":name==='platform'?"s.status='escaped'":`s.phase='${['fall','finale'].includes(name)?'complete':'escaped'}'`;
  text+=`\nwindow.__flowTestFinish=()=>{${finish}};\nwindow.__flowTestFail=()=>{${name==='platform'?"s.status='caught'":"s.phase='caught'"}};`;
  await route.fulfill({response,body:text});
 });
 for(let room=1;room<=11;room++){
  await page.goto(base+(room===1?'index.html':`level-${room}.html`),{waitUntil:'domcontentloaded'});
  if(room===1){await page.waitForFunction(()=>window.fright2d?.ready);assert.equal(await page.evaluate(()=>fright2d.running),false);assert.equal(await page.locator('#veil').isVisible(),true);await page.locator('#start').click();}
  const global=globals[room-1];await page.waitForFunction(g=>window[g]?.running,global,{timeout:20000});
  await page.waitForFunction(()=>!document.body.hasAttribute('data-room-loading'));
  assert.equal(await page.locator('#veil').isVisible(),false,`room ${room} intro visible`);
  // A real touch/key must unlock audio after a direct URL, without a start menu.
  if(mobile)await page.locator('#pause').tap();else await page.keyboard.press('Escape');
  await page.locator('#pause').click();
  if(room===8){await page.waitForFunction(()=>frightWorkshop.audio.laughterLoaded&&frightWorkshop.audio.gruntLoaded);await page.waitForFunction(()=>frightWorkshop.audio.context==='running');}
  if(room===1){await page.waitForFunction(()=>fright2d.audio.music.readyState===4&&!fright2d.audio.music.paused);await page.locator('#sound').click();}
  if(room===2)assert.equal(await page.locator('#sound').textContent(),'SOUND OFF');
  if(room===2)await page.locator('#sound').click();
  if(room>=3){await page.locator('#retry').click();assert.equal(await page.locator('#veil').isVisible(),false);}
  if(room<=10){await page.evaluate(()=>__flowTestFinish());const next=room+1;await page.waitForURL(`**/level-${next}.html?arrival=*`,{timeout:12000,waitUntil:'domcontentloaded'});await page.waitForFunction(g=>window[g]?.running,globals[next-1]);assert.equal(await page.locator('#veil').isVisible(),false);}
  results.push({mobile,room,autoEntry:room!==1,passed:true});
 }
 // Failure still offers a retry; it must not be mistaken for a successful transition.
 await page.goto(base+'level-8.html',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.frightWorkshop?.running);await page.evaluate(()=>__flowTestFail());await page.waitForFunction(()=>!document.querySelector('#veil').hidden);assert.equal(await page.locator('#start').textContent(),'RETRY BOSS');await page.locator('#start').click();assert.equal(await page.locator('#veil').isVisible(),false);
 assert.deepEqual(errors,[]);await context.close();
}
}finally{await browser.close();await fs.mkdir('validation/continuous-rooms',{recursive:true});await fs.writeFile('validation/continuous-rooms/results.json',JSON.stringify(results,null,2));}
console.log(`Verified ${results.length} desktop/touch room entries, automatic exits, mute continuity and boss retry.`);
