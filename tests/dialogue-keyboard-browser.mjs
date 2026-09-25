import {chromium} from '/Users/poli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}),page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.route('**/hall.js',async r=>{const res=await r.fetch();await r.fulfill({response:res,body:await res.text()+`\nwindow.__drawer=()=>showDrawer();window.__nearItem=()=>{s.x=338;s.y=187;s.drawer=true;};window.__worldKeys=0;window.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='e')__worldKeys++;});`});});
 await page.goto('http://localhost:8089/two-d/level-2.html');await page.waitForFunction(()=>fright2d?.running);await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>__drawer());await page.waitForFunction(()=>frightDialogue.typing);const initial=await page.evaluate(()=>frightDialogue.passage);assert.ok(initial.pages>1);
 await page.keyboard.press('e');assert.equal(await page.evaluate(()=>frightDialogue.typing),false);assert.equal(await page.evaluate(()=>frightDialogue.passage.page),initial.page);
 await page.keyboard.down('e');await page.keyboard.down('e');await page.keyboard.up('e');assert.equal(await page.evaluate(()=>frightDialogue.passage.page),initial.page+1);assert.equal(await page.evaluate(()=>frightDialogue.typing),true,'holding E must not skip the next passage');
 for(let n=0;n<30&&await page.locator('#dialog').isVisible();n++){await page.keyboard.press(n%2?'Enter':'e');await page.waitForTimeout(30);}
 assert.equal(await page.locator('#dialog').isVisible(),false);assert.equal(await page.evaluate(()=>__worldKeys),0);
 await page.evaluate(()=>{__nearItem();window.dispatchEvent(new CustomEvent('fright-story',{detail:{text:'A distant sound comes from behind the cupboard. Nothing moves.'}}));});await page.waitForFunction(()=>frightDialogue.typing);
 await page.keyboard.press('e');assert.equal(await page.evaluate(()=>frightDialogue.typing),false);assert.equal(await page.locator('#story-overlay').isVisible(),true);assert.equal(await page.evaluate(()=>frightSecrets.items.includes('glasses')),false);
 await page.keyboard.press('e');assert.equal(await page.locator('#story-overlay').isVisible(),false);assert.equal(await page.evaluate(()=>frightSecrets.items.includes('glasses')),false);assert.equal(await page.evaluate(()=>__worldKeys),0);
 await page.keyboard.press('e');assert.equal(await page.evaluate(()=>frightSecrets.items.includes('glasses')),true,'E still picks up items after dialogue closes');
 assert.deepEqual(errors,[]);console.log('E reveals typing, advances passages, dismisses dialogue, ignores key repeat and preserves later pickup without triggering world actions. Enter still advances.');
}finally{await browser.close();}
