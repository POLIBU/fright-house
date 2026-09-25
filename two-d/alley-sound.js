// Original Atlas Foley follows movement and scene events, never a constant loop.
const FILES={step:'atlas-alley-footstep.mp3',leaves:'atlas-alley-leaf-whoosh.mp3',laugh:'atlas-alley-children-echo.mp3',tape:'atlas-alley-tape-rip.mp3'};
// Keep the Atlas ribbon snap, with a longer dry friction layer so the cue reads as tearing.
function ribbonFriction(ac,original,offset){
 const rate=original.sampleRate,buffer=ac.createBuffer(1,Math.ceil(rate*1.25),rate),out=buffer.getChannelData(0),snap=original.getChannelData(0);let seed=87012,low=0;
 for(let i=0;i<out.length;i++){const t=i/rate;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const noise=seed/2147483648-1;low=low*.72+noise*.28;
  const tear=t<.9?Math.sin(Math.PI*t/.9)**.65:0,teeth=.45+.55*Math.abs(Math.sin(t*155+Math.sin(t*23)*3)),flutter=t>.84?Math.exp(-(t-.84)*9)*Math.abs(Math.sin(t*42))*.11:0;
  const source=Math.floor((offset+Math.max(0,t-.78))*rate),crack=t>=.78&&t<.98?(snap[source]||0)*.32:0;
  out[i]=(noise*.5+low*.5)*(tear*teeth*.38+flutter)+crack;
 }return buffer;
}
export function createAlleySound(ac,output){
 const clips={},failed=[],voices=new Set(),counts={step:0,leaves:0,laugh:0,tape:0};let previous=null,distance=22,nextLeaves=0,nextLaugh=0,lastLeaves=0,lastTape=false,inAlley=false;
 for(const [kind,file]of Object.entries(FILES))fetch(new URL('./audio/'+file,import.meta.url)).then(r=>{if(!r.ok)throw Error(file);return r.arrayBuffer();}).then(b=>ac.decodeAudioData(b)).then(buffer=>{const data=buffer.getChannelData(0);let peak=0,first=0;for(const v of data)peak=Math.max(peak,Math.abs(v));while(first<data.length&&Math.abs(data[first])<peak*.025)first++;const offset=Math.max(0,first/buffer.sampleRate-.008);clips[kind]=kind==='tape'?{buffer:ribbonFriction(ac,buffer,offset),offset:0}:{buffer,offset};}).catch(()=>failed.push(kind));
 function play(kind,volume,pan=0,rate=1,echo=false){const clip=clips[kind];if(!clip||ac.state!=='running')return false;
  function voice(level,delay){const source=ac.createBufferSource(),gain=ac.createGain(),filter=ac.createBiquadFilter(),panner=ac.createStereoPanner();source.buffer=clip.buffer;source.playbackRate.value=rate;filter.type='lowpass';filter.frequency.value=kind==='laugh'?2000:kind==='step'?2800:kind==='leaves'?4200:8500;filter.Q.value=kind==='step'||kind==='leaves'?.5:1;panner.pan.value=pan;const start=ac.currentTime+delay,duration=Math.min((clip.buffer.duration-clip.offset)/rate,kind==='step'?.65:kind==='leaves'?1.2:Infinity);gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(level,start+(kind==='step'?.025:.008));gain.gain.setValueAtTime(level,start+Math.max(.01,duration-(kind==='step'?.15:.09)));gain.gain.linearRampToValueAtTime(0,start+duration);source.connect(filter).connect(gain).connect(panner).connect(output);const entry={kind,source,gain,filter,panner};voices.add(entry);source.onended=()=>{voices.delete(entry);for(const node of [source,gain,filter,panner])node.disconnect();};source.start(start,clip.offset,duration*rate);}
  voice(volume,0);if(echo)voice(volume*.22,.38);counts[kind]++;return true;
 }
 function stop(kind){for(const entry of [...voices])if(!kind||entry.kind===kind){try{entry.source.stop();}catch{}for(const node of [entry.source,entry.gain,entry.filter,entry.panner])node.disconnect();voices.delete(entry);}}
 function reset(){stop();previous=null;distance=22;nextLeaves=nextLaugh=lastLeaves=0;lastTape=inAlley=false;for(const kind of Object.keys(counts))counts[kind]=0;}
 function tick(s,muted=false){const active=['unload','alley'].includes(s.phase),travel=previous?Math.hypot(s.x-previous.x,s.y-previous.y):0;previous={x:s.x,y:s.y};
  if(s.paused||muted||ac.state!=='running'){stop();lastLeaves=s.leafFlights;lastTape=s.tapeBroken;return;}
  if(s.tapeBroken&&!lastTape)play('tape',.8);lastTape=s.tapeBroken;
  if(!active){stop('step');stop('leaves');stop('laugh');inAlley=false;lastLeaves=s.leafFlights;return;}
  if(!inAlley){nextLaugh=s.time+4;inAlley=true;}
  if(s.moving&&travel>0&&travel<30){distance+=travel;if(distance>=27&&play('step',.42,counts.step%2?.12:-.12,.96+(counts.step%3)*.035))distance%=27;}else distance=22;
  if(s.leafFlights>lastLeaves&&s.time>=nextLeaves){if(play('leaves',.32,Math.max(-.5,Math.min(.5,(s.x-240)/100)),.94+(counts.leaves%3)*.06))nextLeaves=s.time+.55;}lastLeaves=s.leafFlights;
  if(s.phase==='alley'&&s.time>=nextLaugh&&play('laugh',.29,counts.laugh%2?-.65:.65,.94,true))nextLaugh=s.time+13+Math.random()*5;
 }
 return {tick,stop,reset,snapshot:()=>({loaded:Object.keys(clips),failed:[...failed],...counts,active:voices.size,playing:ac.state==='running'&&voices.size>0})};
}
