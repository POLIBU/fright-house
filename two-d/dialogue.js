import {createDialoguePages} from './dialogue-pages.js';
import {createTypewriter} from './typewriter.js';
// Shared in-game text presentation. Existing level dialogue callbacks keep control
// of puzzles and pause state; notices stay non-modal during action sequences.
const $=s=>document.querySelector(s),stage=$('#stage');
if(stage){document.body.classList.add('has-pixel-dialogue');const legacy=$('#dialog');if(legacy)stage.append(legacy);
 const panel=document.createElement('section');panel.id='story-overlay';panel.className='pixel-box';panel.hidden=true;panel.setAttribute('aria-live','polite');panel.innerHTML='<span class="speaker">FIELD NOTES</span><p class="story-text"></p><button class="advance" aria-label="Dismiss message">▼</button>';stage.append(panel);
 let lastText='',lastLegacy='',lastNotice='',lastObjective='',lastIntro='',lastModal='',timer=0;
 const writer=createTypewriter(()=>$('#sound')?.textContent.includes('OFF'));const stop=()=>writer.finish(),speak=()=>{};const advance=panel.querySelector('.advance'),legacyAdvance=legacy?.querySelector('#continue');advance.textContent='CONTINUE ▼';let openingShown=false;
 const panelPages=createDialoguePages(panel,panel.querySelector('.story-text'),advance,writer),legacyPages=legacy?createDialoguePages(legacy,$('#line'),legacyAdvance,writer):null;
 function dismiss(){panel.hidden=true;clearTimeout(timer);stop();}advance.onclick=()=>{if(!panelPages.next())dismiss();};
 document.addEventListener('click',e=>{if(e.target.closest?.('#continue')&&legacy&&!legacy.hidden){if(writer.typing){e.preventDefault();e.stopImmediatePropagation();writer.finish();}else if(legacyPages.next()){e.preventDefault();e.stopImmediatePropagation();}}},true);
 function show(text,speaker='FIELD NOTES'){text=text.trim();if(!text||text===lastText)return;lastText=text;panel.querySelector('.story-text').textContent=text;panel.querySelector('.speaker').textContent=speaker;panel.hidden=false;clearTimeout(timer);panelPages.show(text);if(!panelPages.multiple)timer=setTimeout(()=>{panel.hidden=true;},Math.max(6500,Math.min(18000,text.length*78)));}
 window.addEventListener('fright-story',e=>{if(e.detail?.text)show(e.detail.text,e.detail.speaker||'FIELD NOTES');});
 window.addEventListener('keydown',e=>{
  if(!['e','Enter'].includes(e.key.length===1?e.key.toLowerCase():e.key)||document.querySelector('dialog[open]')||e.target.closest?.('input,textarea,select,[contenteditable="true"]'))return;
  const button=legacy&&!legacy.hidden?legacyAdvance:!panel.hidden?advance:null;
  if(!button)return;
  // A dialogue key press must never also open a door, collect an item or attack.
  e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)button.click();
 },true);
 let scheduled=false;function refresh(){scheduled=false;const modal=document.querySelector('dialog[open]'),veil=$('#veil'),legacyOpen=legacy&&!legacy.hidden;
 if(modal){panel.hidden=true;const id=modal.id;if(id!==lastModal){lastModal=id;const text=[...modal.querySelectorAll('section p,blockquote')].map(n=>n.textContent.trim()).filter(Boolean).slice(0,2).join(' ');if(text)speak(text);}return;}lastModal='';
 if(legacyOpen){panel.hidden=true;const visible=$('#line').textContent,body=visible===legacyPages.current?legacyPages.source:visible;const text=[$('#speaker')?.textContent,$('#headline')?.hidden?'':$('#headline')?.textContent,body].filter(Boolean).join('\n');if(text!==lastLegacy){lastLegacy=text;lastText=text;legacyPages.show(body);}return;}if(lastLegacy){lastLegacy='';stop();}
 if(veil&&!veil.hidden){panel.hidden=true;const text=$('#intro')?.textContent||'';if(text!==lastIntro){lastIntro=text;lastText=text;speak(text);}return;}
 if(document.body.dataset.dialogue==='opening-only'){if(!openingShown){openingShown=true;show('Four floors. Three missing fuses. Solve the wall riddle, then pull the red lever. Keep moving when the alarm sounds.','THE UPPER ATTRACTION');}return;}
 const notice=$('#notice')?.textContent.trim()||'',objective=$('#objective')?.textContent.trim()||'';
 if(document.body.hasAttribute('data-quiet-notices')){if(!panel.hidden)dismiss();lastNotice=notice;lastObjective=objective;return;}
 if(!panel.hidden&&panelPages.multiple)return;
 if(notice&&notice!==lastNotice){lastNotice=notice;lastObjective=objective;show(notice,'THE FUNHOUSE');}else if(objective&&objective!==lastObjective){lastObjective=objective;show(objective);}if(!notice)lastNotice='';
 }
 const observer=new MutationObserver(()=>{if(!scheduled){scheduled=true;queueMicrotask(refresh);}});for(const selector of ['#dialog','#notice','#objective','#veil']){const node=$(selector);if(node)observer.observe(node,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['hidden']});}for(const modal of document.querySelectorAll('dialog'))observer.observe(modal,{attributes:true,attributeFilter:['open']});
 observer.observe(document.body,{attributes:true,attributeFilter:['data-quiet-notices']});
 // Inspectors are created by the level modules after this shared module loads.
 const discover=new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)if(node.nodeType===1){for(const dialog of [node,...node.querySelectorAll('dialog')])if(dialog.matches?.('dialog'))observer.observe(dialog,{attributes:true,attributeFilter:['open']});}});discover.observe(document.body,{childList:true,subtree:true});
 for(const id of ['start','restart','retry','ready','load'])$('#'+id)?.addEventListener('click',()=>{lastNotice='';lastObjective='';lastText='';lastIntro='';stop();queueMicrotask(refresh);},true);refresh();Object.defineProperty(window,'frightDialogue',{get:()=>({overlay:!panel.hidden,insideStage:panel.parentElement===stage,legacyInsideStage:!legacy||legacy.parentElement===stage,text:lastText,narrationAvailable:false,pixelFont:'FrightPixel',voiceStyle:'none',typing:writer.typing,typewriterTaps:writer.taps,passage:(legacy&&!legacy.hidden?legacyPages:panelPages).snapshot()})});
}
