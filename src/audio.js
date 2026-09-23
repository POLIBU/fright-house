export class Soundscape{
 constructor(){this.enabled=true;this.ctx=null;this.nextStep=0;this.nextBell=0;this.nextLaugh=12;this.nextMonsterLaugh=0;this.buffers=new Map();this.sources=new Map();this.files={};}
 async load(){this.files=await (await fetch('./audio/manifest.json?v='+(document.documentElement.dataset.build||'dev'))).json();for(const [name,file] of Object.entries(this.files)){const response=await fetch('./audio/'+file+'?v='+(document.documentElement.dataset.build||'dev'));if(!response.ok)throw new Error('Audio did not load: '+file);this.buffers.set(name,await response.arrayBuffer());}}
 async decode(){for(const [name,data] of this.buffers){if(data instanceof ArrayBuffer){try{const decoded=await this.ctx.decodeAudioData(data.slice(0));if(name==='laughter'){let peak=0;for(let c=0;c<decoded.numberOfChannels;c++){const a=decoded.getChannelData(c);for(const v of a)peak=Math.max(peak,Math.abs(v));}if(peak>0){const lift=Math.min(100,.45/peak);for(let c=0;c<decoded.numberOfChannels;c++){const a=decoded.getChannelData(c);for(let i=0;i<a.length;i++)a[i]*=lift;}}}this.buffers.set(name,decoded);}catch(e){console.warn('Audio decode failed',name);}}}if(this.buffers.has('ambience')&&!this.sources.has('ambience'))this.play('ambience',true,.25);}
 play(name,loop=false,volume=.7){if(!this.ctx)return false;const b=this.buffers.get(name);if(!b||b instanceof ArrayBuffer)return false;if(['recording','phoneVoice'].includes(name)){for(const n of ['recording','phoneVoice'])this.stop(n);this.stop('laughter');}else this.stop(name);const source=this.ctx.createBufferSource();source.buffer=b;source.loop=loop;const gain=this.ctx.createGain();gain.gain.value=volume;source.connect(gain).connect(this.master);source.start();this.sources.set(name,source);source.onended=()=>{if(this.sources.get(name)===source)this.sources.delete(name);};return true;}
 resetAtmosphere(){this.nextStep=0;this.nextBell=0;this.nextLaugh=12;this.nextMonsterLaugh=0;this.nextCart=0;this.stop('laughter');this.stop('monsterLaugh');}
 stop(name){if(name==='monsterLaugh'&&this.monsterVoice){for(const n of this.monsterVoice.nodes)n.disconnect();this.monsterVoice=null;}const s=this.sources.get(name);if(s){try{s.stop();}catch{}this.sources.delete(name);}}
 pause(){this.ctx?.suspend();}
 start(){if(!this.ctx){this.ctx=new AudioContext();this.master=this.ctx.createGain();this.master.gain.value=.26;this.master.connect(this.ctx.destination);for(const freq of [42,63]){const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type='sine';o.frequency.value=freq;g.gain.value=.055;o.connect(g).connect(this.master);o.start();}const length=this.ctx.sampleRate*3,b=this.ctx.createBuffer(1,length,this.ctx.sampleRate),a=b.getChannelData(0);let v=0;for(let i=0;i<length;i++){v=(v+Math.random()*.025-.0125)*.985;a[i]=v;}const s=this.ctx.createBufferSource();s.buffer=b;s.loop=true;const f=this.ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=550;const g=this.ctx.createGain();g.gain.value=.32;s.connect(f).connect(g).connect(this.master);s.start();}this.ctx.resume();this.decode();this.master.gain.setTargetAtTime(this.enabled?.26:0,this.ctx.currentTime,.1);}
 toggle(){this.enabled=!this.enabled;if(this.ctx)this.master.gain.setTargetAtTime(this.enabled?.26:0,this.ctx.currentTime,.1);return this.enabled;}
 tone(freq,dur=.25,vol=.25,type='sine',to=freq){if(!this.ctx)return;const t=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(Math.max(1,to),t+dur);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.001,vol),t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g).connect(this.master);o.start(t);o.stop(t+dur+.02);}
 knock(){this.tone(85,.24,.5,'triangle',25);this.tone(330,.12,.08,'square',80);}
 grind(){if(this.play('wall',false,.5))return;this.tone(74,.9,.24,'sawtooth',35);this.tone(135,.6,.13,'triangle',58);}
 ring(){if(this.play('phone',false,.5))return;this.tone(780,.7,.18,'sine',790);this.tone(1040,.7,.12,'sine',1035);}
 tick(){this.tone(600,.05,.08,'triangle',150);}
 cart(t,speed){if(t>(this.nextCart||0)){this.nextCart=t+Math.max(.12,.9/Math.max(1,speed));this.tone(42+speed*2,.11,.06,'triangle',24);}}
 monster(t,active,distance,pan=0,blocked=false){
  if(!active){this.stop('monsterLaugh');return;}
  if(!this.ctx)return;
  const b=this.buffers.get('laughter');
  if(!this.sources.has('monsterLaugh')&&t>=this.nextMonsterLaugh&&b&&!(b instanceof ArrayBuffer)&&!this.sources.has('phoneVoice')){
   this.stop('laughter');const source=this.ctx.createBufferSource();source.buffer=b;source.playbackRate.value=.72+Math.random()*.10;
   const gain=this.ctx.createGain(),filter=this.ctx.createBiquadFilter(),panner=this.ctx.createStereoPanner(),delay=this.ctx.createDelay(1),echo=this.ctx.createGain();
   filter.type='lowpass';gain.gain.value=0;delay.delayTime.value=.29;echo.gain.value=.28;
   source.connect(filter).connect(gain).connect(panner).connect(this.master);gain.connect(delay).connect(echo).connect(panner);
   this.monsterVoice={gain,filter,panner,nodes:[source,filter,gain,panner,delay,echo]};this.sources.set('monsterLaugh',source);source.start();
   const duration=b.duration/source.playbackRate.value;this.nextMonsterLaugh=t+duration+3+Math.random()*4;
   source.onended=()=>{if(this.sources.get('monsterLaugh')===source)this.stop('monsterLaugh');};
  }
  if(this.monsterVoice){const v=this.monsterVoice,now=this.ctx.currentTime;v.gain.gain.setTargetAtTime((.18+1.1/(1+(distance/4)**2))*(blocked?.3:1),now,.25);v.filter.frequency.setTargetAtTime(blocked?650:2300,now,.25);v.panner.pan.setTargetAtTime(Math.max(-1,Math.min(1,pan)),now,.15);}
 }
 update(t,moving,sprinting,chase,near,phone){if(!chase&&t>this.nextLaugh&&!phone&&!this.sources.has('recording')&&!this.sources.has('phoneVoice')){this.nextLaugh=t+38+Math.random()*22;this.play('laughter',false,.23);}if(moving&&t>this.nextStep){this.nextStep=t+(sprinting?.32:.51);this.tone(90+Math.random()*20,.11,.11,'triangle',35);}if(phone&&t>this.nextBell){this.nextBell=t+2.5;this.ring();}if(chase&&near<12&&t>this.nextBell){this.nextBell=t+Math.max(.4,near/8);this.knock();}}
}
