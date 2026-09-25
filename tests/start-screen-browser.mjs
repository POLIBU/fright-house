import {chromium} from '/Users/poli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
const base=process.env.GAME_URL||'http://localhost:8097/two-d/';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try{for(const mobile of [false,true]){
 const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1100,height:900},isMobile:mobile,hasTouch:mobile});const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 async function loaded(){await page.locator('#start:not([disabled])').waitFor();}
 await page.goto(base);await loaded();assert.equal(await page.locator('#resume').isVisible(),false);assert.equal(await page.evaluate(()=>localStorage.length),0);
 await page.reload();await loaded();assert.equal(await page.locator('#resume').isVisible(),false);
 if(mobile)await page.locator('#start').tap();else await page.locator('#start').click();await page.waitForFunction(()=>fright2d.running);
 // Begin writes a checkpoint before exploration. That alone must not offer Continue.
 await page.reload();await loaded();assert.equal(await page.locator('#resume').isVisible(),false);
 // Retain old saves with real discoveries, without needing a new schema/version.
 await page.evaluate(()=>{const key='fright-house-2d-campaign-v1',save=JSON.parse(localStorage.getItem(key));save.street.newspaper=true;save.journal.push({id:'park-newspaper',text:'A newspaper found on the bench.'});localStorage.setItem(key,JSON.stringify(save));});
 await page.reload();await loaded();assert.equal(await page.locator('#resume').isVisible(),true);if(mobile)await page.locator('#resume').tap();else await page.locator('#resume').click();await page.waitForFunction(()=>fright2d.running);assert.equal(await page.evaluate(()=>fright2d.newspaper),true);
 await page.evaluate(()=>localStorage.setItem('fright-house-2d-campaign-v1','broken save'));await page.reload();await loaded();assert.equal(await page.locator('#resume').isVisible(),false);assert.deepEqual(errors,[]);console.log(`${mobile?'Mobile':'Desktop'}: first visit, revisit, empty checkpoint, valid resume and invalid save pass.`);await context.close();
}}finally{await browser.close();}
