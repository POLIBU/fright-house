import {MACHINE_PAGES,readInstructions} from './campaign/instructions.js';
export function installInstructions(){
 const footer=document.querySelector('footer div');if(!footer)return;
 const b=document.createElement('button');b.textContent='INSTRUCTIONS';footer.append(b);
 const d=document.createElement('dialog');d.id='instructions-menu';d.setAttribute('aria-labelledby','instructions-title');
 d.style.cssText='background:#090a0b;color:#eee;border:2px solid #ddd;width:min(430px,92vw);max-height:85vh;overflow:auto;font:18px FrightPixel,monospace';
 d.innerHTML='<h2 id="instructions-title">MAINTENANCE PAGES</h2><section></section><button>CLOSE</button>';document.body.append(d);let resume=false;
 function open(id){if(d.open)return;const pause=document.querySelector('#pause');resume=pause?.textContent==='PAUSE';if(resume)pause.click();const list=d.querySelector('section');list.replaceChildren();const owned=readInstructions();for(const page of MACHINE_PAGES){const p=document.createElement('p');p.dataset.page=page.id;p.textContent=owned.includes(page.id)?page.title+' — '+page.text:'Missing page · '+page.title;if(page.id===id){p.style.cssText='border-left:3px solid #b73043;padding-left:10px;color:#fff';p.setAttribute('aria-current','true');}list.append(p);}d.showModal();d.querySelector('button').focus();list.querySelector('[aria-current]')?.scrollIntoView({block:'nearest'});}
 b.onclick=()=>open();window.addEventListener('fright-read-instructions',e=>open(e.detail?.id));
 d.addEventListener('keydown',e=>{if(e.key==='Escape')e.stopPropagation();});
 d.querySelector('button').onclick=()=>d.close();d.onclose=()=>{if(resume)document.querySelector('#pause')?.click();resume=false;};
}
export function showCollectedInstruction(id){window.dispatchEvent(new CustomEvent('fright-read-instructions',{detail:{id}}));}
