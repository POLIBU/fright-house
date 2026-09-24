import {NEWSPAPER} from './levels/street-model.js';
const ART={
  notices:{title:'Missing-children noticeboard',src:'./assets/inspection/missing-board.png',alt:'Three weathered missing-child posters beneath a lamp on a wooden noticeboard.',summary:'Three photographs. Three families waiting for news. Select a poster to look closer.',ratio:'4 / 3',details:[
    {label:'Left poster',box:[12,26,24,48],center:[.235,.50],zoom:2.05,text:'MISSING\nLast seen: Fright House, October 17, 1987.\n\nRain has blurred the small print. The photograph is still attached with two rusty nails.'},
    {label:'Middle poster',box:[39,26,23,48],center:[.505,.50],zoom:2.05,text:'MISSING\nLast seen: Fright House, October 17, 1987.\n\nSomeone has pinned this notice directly beneath the lamp, where it can still be read after dark.'},
    {label:'Torn poster',box:[65,26,24,48],center:[.77,.50],zoom:2.05,text:'MISSING\nLast seen: Fright House, October 17, 1987.\n\nA tear crosses the photograph. All three notices point to the same attraction.'},
  ]},
  ticket:{title:'Old admission ticket',src:'./assets/inspection/admission-ticket.png',alt:'A worn Fright House admission ticket marked ADMIT ONE, stamped OCT 17 1987, with serial 087.',summary:'FRIGHT HOUSE · ADMIT ONE\nA recent date on a ticket from a supposedly closed attraction. Select the stamp or stub to inspect it.',ratio:'3 / 2',details:[
    {label:'Date stamp',box:[51,57,34,23],center:[.68,.69],zoom:2,text:'OCT 17 1987\n\nThe date is still legible beneath the fold. According to the newspaper, the attraction should have been closed that evening.'},
    {label:'Ticket stub',box:[85,17,13,64],center:[.895,.53],zoom:1.65,text:'SERIAL 087\n\nThe perforated stub is still attached. The paper is damp, and the red ink has begun to fade.'},
  ]},
};
export function createInspector({onClose}){
  const modal=document.createElement('dialog');modal.id='inspection';modal.setAttribute('aria-labelledby','inspection-title');
  modal.innerHTML=`<div class="inspect-shell"><header class="inspect-header"><div><small>LOOK CLOSER</small><h2 id="inspection-title"></h2></div><button id="inspection-close" autofocus>BACK TO STREET <span>ESC</span></button></header><div class="inspect-body"><div class="inspect-visual"><div id="inspect-viewport"><img id="inspect-image" alt=""><div id="inspect-hotspots"></div></div><article id="inspect-paper" hidden><div class="paper-masthead"></div><p class="paper-date"></p><h3></h3><div class="paper-columns"><p class="paper-body"></p><blockquote></blockquote></div><p class="paper-saved">Clipping saved in your field notes.</p></article></div><aside class="inspect-notes"><small id="inspect-caption">OBJECT DETAILS</small><p id="inspect-transcript" aria-live="polite"></p><div id="inspect-choices"></div><div class="inspect-tools"><button id="inspect-fit">WHOLE OBJECT</button><button id="inspect-zoom" aria-pressed="false">ZOOM IN</button></div><p class="inspect-help">Move the pointer over the artwork, or drag its frame, to look around. Select a detail to read it. Close this view to return to the street.</p></aside></div><footer class="inspect-footer">INVESTIGATION PAUSED · Your discoveries are saved automatically.</footer></div>`;
  document.body.append(modal);
  const $=q=>modal.querySelector(q),image=$('#inspect-image'),viewport=$('#inspect-viewport');let active=null,detail=null,zoom=1,focusBefore=null;
  let tilt={x:0,y:0},dragging=false;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resetTilt(){tilt={x:0,y:0};viewport.style.setProperty('--rx','0deg');viewport.style.setProperty('--ry','0deg');}
  function tiltAt(e){if(reduced||!active||active==='newspaper')return;const r=viewport.getBoundingClientRect(),x=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1)),y=Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1));tilt={x:-y*4,y:x*5};viewport.style.setProperty('--rx',tilt.x+'deg');viewport.style.setProperty('--ry',tilt.y+'deg');viewport.style.setProperty('--shine-x',(50+x*35)+'%');}
  viewport.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'||dragging)tiltAt(e);});
  viewport.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;dragging=true;viewport.setPointerCapture(e.pointerId);tiltAt(e);});
  for(const name of ['pointerup','pointercancel','lostpointercapture','pointerleave'])viewport.addEventListener(name,()=>{dragging=false;resetTilt();});
  function transform(z=1,center=[.5,.5]){zoom=z;image.style.transform=`translate(${(0.5-center[0]*z)*100}%, ${(0.5-center[1]*z)*100}%) scale(${z})`;$('#inspect-hotspots').hidden=z!==1;$('#inspect-zoom').textContent=z===1?'ZOOM IN':'ZOOM OUT';$('#inspect-zoom').setAttribute('aria-pressed',String(z!==1));}
  function fit(){resetTilt();if(!active||active==='newspaper')return;detail=null;transform();$('#inspect-caption').textContent='OBJECT DETAILS';$('#inspect-transcript').textContent=ART[active].summary;for(const b of $('#inspect-choices').children)b.setAttribute('aria-pressed','false');}
  function select(i){const item=ART[active]?.details[i];if(!item)return;detail=i;transform(item.zoom,item.center);$('#inspect-caption').textContent=item.label.toUpperCase();$('#inspect-transcript').textContent=item.text;for(const [n,b]of [...$('#inspect-choices').children].entries())b.setAttribute('aria-pressed',String(n===i));}
  function close(){if(!active)return;active=null;detail=null;zoom=1;resetTilt();modal.close();document.body.classList.remove('inspection-open');onClose();if(focusBefore?.isConnected)focusBefore.focus({preventScroll:true});}
  modal.addEventListener('cancel',e=>{e.preventDefault();close();});

  $('#inspection-close').onclick=close;$('#inspect-fit').onclick=fit;$('#inspect-zoom').onclick=()=>{if(zoom!==1){fit();return;}detail=null;transform(1.55);};
  image.onerror=()=>{$('#inspect-caption').textContent='ARTWORK UNAVAILABLE';$('#inspect-transcript').textContent=ART[active]?.summary||'';};
  function open(id){if(id!=='newspaper'&&!ART[id])return false;if(modal.open)close();focusBefore=document.activeElement;active=id;detail=null;zoom=1;resetTilt();
    $('#inspect-choices').replaceChildren();$('#inspect-hotspots').replaceChildren();const paper=id==='newspaper';$('#inspect-paper').hidden=!paper;viewport.hidden=paper;modal.classList.toggle('inspecting-paper',paper);$('.inspect-tools').hidden=paper;
    $('#inspection-title').textContent=paper?'Newspaper from the bench':ART[id].title;
    $('#inspect-caption').textContent=paper?'THE CIRCLED SENTENCE':'OBJECT DETAILS';
    if(paper){$('.paper-masthead').textContent=NEWSPAPER.title;$('.paper-date').textContent=NEWSPAPER.date;$('#inspect-paper h3').textContent=NEWSPAPER.headline;$('.paper-body').textContent=NEWSPAPER.body;$('#inspect-paper blockquote').textContent='“A witness reported lights inside after midnight.”';$('#inspect-transcript').textContent=NEWSPAPER.clue+'\n\nThe park was supposed to be closed. Someone was still inside.';}
    else{const art=ART[id];viewport.style.aspectRatio=art.ratio;image.src=art.src;image.alt=art.alt;transform();$('#inspect-transcript').textContent=art.summary;
      art.details.forEach((d,i)=>{const b=document.createElement('button');b.textContent=d.label;b.setAttribute('aria-pressed','false');b.onclick=()=>select(i);$('#inspect-choices').append(b);const hit=document.createElement('button');hit.className='inspect-hotspot';hit.setAttribute('aria-label',d.label);hit.title=d.label;const [x,y,w,h]=d.box;Object.assign(hit.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});hit.onclick=()=>select(i);$('#inspect-hotspots').append(hit);});
    }
    modal.showModal();document.body.classList.add('inspection-open');$('#inspection-close').focus({preventScroll:true});modal.scrollTop=0;return true;
  }
  return {open,close,get active(){return active;},snapshot:()=>({object:active,detail:active&&detail!==null?ART[active].details[detail].label:null,zoom,tilt:{...tilt}})};
}
