const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH,args:['--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
await page.goto(process.env.GAME_URL || 'http://localhost:8087');await page.waitForFunction(()=>window.__READY__===true,{timeout:60000});await page.screenshot({path:'validation/title-desktop.png'});await page.click('#begin');await page.waitForTimeout(400);await page.keyboard.down('KeyW');await page.waitForTimeout(1300);await page.keyboard.up('KeyW');console.log(JSON.stringify({state:await page.evaluate(()=>window.__GAME__),errors}));await page.screenshot({path:'validation/play-desktop.png'});
await browser.close();if(errors.length)process.exit(1);
