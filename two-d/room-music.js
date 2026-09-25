export const musicMenuActive=()=>!!document.querySelector('[data-keep-music]');
// All room scores use a decoded, crossfaded loop and short playback envelopes.
export const ROOM_SCORES=[null,'park','hall','circus','toys','library','factory','mezzanine','boss','fall','bones','cart'];
const playing=new Map();
export function createLoopBuffer(ac,source,seconds=1.8){
 const overlap=Math.min(Math.floor(seconds*source.sampleRate),Math.floor(source.length/4)),core=source.length-2*overlap;
 const loop=ac.createBuffer(source.numberOfChannels,source.length-overlap,source.sampleRate);let peak=0;
 for(let c=0;c<source.numberOfChannels;c++){
  const src=source.getChannelData(c),dst=loop.getChannelData(c);dst.set(src.subarray(overlap,source.length-overlap));
  for(let i=0;i<overlap;i++){const t=i/(overlap-1);dst[core+i]=src[source.length-overlap+i]*Math.cos(t*Math.PI/2)+src[i]*Math.sin(t*Math.PI/2);}
  for(const v of dst)peak=Math.max(peak,Math.abs(v));
 }
 if(peak>.98)for(let c=0;c<loop.numberOfChannels;c++){const d=loop.getChannelData(c);for(let i=0;i<d.length;i++)d[i]*=.98/peak;}
 return loop;
}
export function createRoomMusic(level){
 let ac,master,buffer,loading,voice,offset=0,startedAt=0,volume=.14,muted=false,wanted=false,epoch=0,error=null;
 let rate=[1,.9,.86,.78,.87,.88,.8,.9,.96,.84,.9,1][level];
 const url=new URL(`./audio/atlas-score-${ROOM_SCORES[level]}.mp3`,import.meta.url);url.search=new URL(import.meta.url).search;
 function context(){if(!ac){ac=new AudioContext();master=ac.createGain();master.gain.value=muted?0:volume;master.connect(ac.destination);}return ac;}
 function levelGain(){if(!master)return;const p=master.gain;p.cancelAndHoldAtTime(ac.currentTime);p.linearRampToValueAtTime(muted?0:volume,ac.currentTime+.12);}
 async function load(){if(!loading)loading=fetch(url).then(r=>{if(!r.ok)throw Error(`Score ${r.status}`);return r.arrayBuffer();}).then(b=>ac.decodeAudioData(b)).then(b=>buffer=createLoopBuffer(ac,b)).catch(e=>{error={code:4,message:e.message};loading=null;throw e;});return loading;}
 function position(){return buffer?(offset+(voice?(ac.currentTime-startedAt)*rate:0))%buffer.duration:offset;}
 function stopVoice(seconds=.18){if(!voice)return;offset=position();const old=voice;voice=null;old.gain.gain.cancelAndHoldAtTime(ac.currentTime);old.gain.gain.linearRampToValueAtTime(0,ac.currentTime+seconds);old.source.stop(ac.currentTime+seconds+.01);}
 const audio={loop:true,preload:'none',preservesPitch:false,
  async play(){wanted=true;const token=epoch;context();const unlock=ac.resume();try{await Promise.all([unlock,load()]);}catch(e){if(token===epoch)wanted=false;throw e;}if(!wanted||token!==epoch||voice)return;error=null;const source=ac.createBufferSource(),gain=ac.createGain();source.buffer=buffer;source.loop=true;source.playbackRate.value=rate;gain.gain.setValueAtTime(0,ac.currentTime);gain.gain.linearRampToValueAtTime(1,ac.currentTime+.65);const nodes=[];if(level===1){const tone=ac.createBiquadFilter(),echo=ac.createDelay(2),feedback=ac.createGain(),wet=ac.createGain();tone.type='lowpass';tone.frequency.value=2800;echo.delayTime.value=.63;feedback.gain.value=.28;wet.gain.value=.22;source.connect(tone);tone.connect(gain);tone.connect(echo);echo.connect(feedback).connect(echo);echo.connect(wet).connect(gain);nodes.push(tone,echo,feedback,wet);}else source.connect(gain);gain.connect(master);startedAt=ac.currentTime;voice={source,gain};source.onended=()=>{source.disconnect();gain.disconnect();nodes.forEach(n=>n.disconnect());};source.start(0,offset%buffer.duration);},
  pause(force=false){if(!force&&musicMenuActive()&&!document.hidden)return;wanted=false;epoch++;stopVoice();},
  get paused(){return !wanted;},get readyState(){return buffer?4:0;},get error(){return error;},
  get currentTime(){return position();},set currentTime(value){const resume=wanted;stopVoice();offset=Math.max(0,Number(value)||0);if(resume)audio.play().catch(()=>{});},
  get volume(){return volume;},set volume(value){const v=Math.max(0,Math.min(1,Number(value)||0));if(v!==volume){volume=v;levelGain();}},
  get muted(){return muted;},set muted(value){muted=!!value;levelGain();},
  get playbackRate(){return rate;},set playbackRate(value){const time=position();rate=Math.max(.25,Math.min(4,Number(value)||1));offset=time;startedAt=ac?.currentTime||0;if(voice)voice.source.playbackRate.value=rate;},
  snapshot:()=>({loopDuration:buffer?.duration||0,crossfade:1.8,context:ac?.state||'locked',currentTime:position(),gain:master?.gain.value||0,audible:!!voice&&ac?.state==='running'&&!muted})
 };
 window.addEventListener('pagehide',()=>{audio.pause(true);ac?.close();},{once:true});playing.set(level,audio);return audio;
}
export function fadeRoomMusic(){for(const audio of playing.values())audio.pause(true);}
export function musicSnapshot(level){const audio=playing.get(level);return {score:ROOM_SCORES[level],loaded:!!audio&&audio.readyState>=2,playing:!!audio&&!audio.paused,volume:audio?.volume||0,muted:!!audio?.muted,...audio?.snapshot()};}
