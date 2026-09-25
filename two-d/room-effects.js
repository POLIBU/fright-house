// Small, locally synthesized effects: no extra audio downloads on mobile.
const noiseBuffers=new WeakMap();
function noise(ac){
 if(!noiseBuffers.has(ac)){const b=ac.createBuffer(1,Math.ceil(ac.sampleRate*3),ac.sampleRate),data=b.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;noiseBuffers.set(ac,b);}
 return noiseBuffers.get(ac);
}
export function playDistantScratch(ac,output,echo){
 const source=ac.createBufferSource(),band=ac.createBiquadFilter(),muffle=ac.createBiquadFilter(),gain=ac.createGain(),pan=ac.createStereoPanner();
 source.buffer=noise(ac);band.type='bandpass';band.frequency.value=900+Math.random()*500;band.Q.value=1.8;muffle.type='lowpass';muffle.frequency.value=1700;pan.pan.value=(Math.random()<.5?-1:1)*(.55+Math.random()*.25);
 const now=ac.currentTime;let end=now;gain.gain.setValueAtTime(.0001,now);
 // Uneven scrape / pause / scrape, muffled as if behind a distant wall.
 for(let i=0;i<3;i++){const start=end+.08+Math.random()*.16,duration=.2+Math.random()*.28;gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(.08+Math.random()*.04,start+.045);gain.gain.exponentialRampToValueAtTime(.0001,start+duration);end=start+duration;}
 source.connect(band).connect(muffle).connect(gain).connect(pan);pan.connect(output);pan.connect(echo);source.start(now);source.stop(end+.02);
 source.onended=()=>{for(const node of [source,band,muffle,gain,pan])node.disconnect();};
}
export function playBalloonExplosion(ac){
 const now=ac.currentTime,source=ac.createBufferSource(),filter=ac.createBiquadFilter(),gain=ac.createGain(),thump=ac.createOscillator(),body=ac.createGain();
 source.buffer=noise(ac);filter.type='lowpass';filter.frequency.setValueAtTime(10000,now);filter.frequency.exponentialRampToValueAtTime(240,now+.48);
 gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.42,now+.003);gain.gain.exponentialRampToValueAtTime(.11,now+.055);gain.gain.exponentialRampToValueAtTime(.0001,now+.55);
 source.connect(filter).connect(gain).connect(ac.destination);source.start(now);source.stop(now+.58);
 thump.type='sine';thump.frequency.setValueAtTime(155,now);thump.frequency.exponentialRampToValueAtTime(38,now+.22);body.gain.setValueAtTime(.0001,now);body.gain.exponentialRampToValueAtTime(.23,now+.005);body.gain.exponentialRampToValueAtTime(.0001,now+.32);
 thump.connect(body).connect(ac.destination);thump.start(now);thump.stop(now+.34);
 source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};thump.onended=()=>{thump.disconnect();body.disconnect();};
}

export function playWoodenDrawer(ac){
 const now=ac.currentTime,source=ac.createBufferSource(),filter=ac.createBiquadFilter(),gain=ac.createGain(),creak=ac.createOscillator(),wood=ac.createGain();
 source.buffer=noise(ac);filter.type='bandpass';filter.frequency.setValueAtTime(600,now);filter.frequency.linearRampToValueAtTime(340,now+.8);filter.Q.value=.7;
 gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.13,now+.05);gain.gain.linearRampToValueAtTime(.07,now+.5);gain.gain.exponentialRampToValueAtTime(.0001,now+.8);
 source.connect(filter).connect(gain).connect(ac.destination);source.start(now);source.stop(now+.86);
 creak.type='triangle';creak.frequency.setValueAtTime(180,now);creak.frequency.linearRampToValueAtTime(240,now+.25);creak.frequency.linearRampToValueAtTime(115,now+.7);wood.gain.setValueAtTime(.0001,now);wood.gain.exponentialRampToValueAtTime(.045,now+.12);wood.gain.exponentialRampToValueAtTime(.0001,now+.72);wood.gain.setValueAtTime(.06,now+.8);wood.gain.exponentialRampToValueAtTime(.0001,now+.88);
 creak.connect(wood).connect(ac.destination);creak.start(now);creak.stop(now+.9);
 source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};creak.onended=()=>{creak.disconnect();wood.disconnect();};
}
