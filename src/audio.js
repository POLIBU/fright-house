export class Soundscape{
 constructor(){this.enabled=true;this.ctx=null;this.nextStep=0;this.nextBell=0;}
 start(){if(!this.ctx){this.ctx=new AudioContext();this.master=this.ctx.createGain();this.master.gain.value=.26;this.master.connect(this.ctx.destination);for(const freq of [42,63]){const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type='sine';o.frequency.value=freq;g.gain.value=.055;o.connect(g).connect(this.master);o.start();}const length=this.ctx.sampleRate*3,b=this.ctx.createBuffer(1,length,this.ctx.sampleRate),a=b.getChannelData(0);let v=0;for(let i=0;i<length;i++){v=(v+Math.random()*.025-.0125)*.985;a[i]=v;}const s=this.ctx.createBufferSource();s.buffer=b;s.loop=true;const f=this.ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=550;const g=this.ctx.createGain();g.gain.value=.32;s.connect(f).connect(g).connect(this.master);s.start();}this.ctx.resume();this.master.gain.setTargetAtTime(this.enabled?.26:0,this.ctx.currentTime,.1);}
 toggle(){this.enabled=!this.enabled;if(this.ctx)this.master.gain.setTargetAtTime(this.enabled?.26:0,this.ctx.currentTime,.1);return this.enabled;}
 tone(freq,dur=.25,vol=.25,type='sine',to=freq){if(!this.ctx)return;const t=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(Math.max(1,to),t+dur);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.001,vol),t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g).connect(this.master);o.start(t);o.stop(t+dur+.02);}
 knock(){this.tone(85,.24,.5,'triangle',25);this.tone(330,.12,.08,'square',80);}
 grind(){this.tone(74,.9,.24,'sawtooth',35);this.tone(135,.6,.13,'triangle',58);}
 ring(){this.tone(780,.7,.18,'sine',790);this.tone(1040,.7,.12,'sine',1035);}
 tick(){this.tone(600,.05,.08,'triangle',150);}
 update(t,moving,sprinting,chase,near,phone){if(moving&&t>this.nextStep){this.nextStep=t+(sprinting?.32:.51);this.tone(90+Math.random()*20,.11,.11,'triangle',35);}if(phone&&t>this.nextBell){this.nextBell=t+2.5;this.ring();}if(chase&&near<12&&t>this.nextBell){this.nextBell=t+Math.max(.4,near/8);this.knock();}}
}
