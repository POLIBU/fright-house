// Original cheerful C-major waltz: piano melody, light string harmony and bass.
export function createSunriseMusic(ac,destination){let bus=null,nodes=[],notes=0;
 const melody=[76,79,84,83,81,79,77,81,84,83,79,74,76,79,84,86,84,81,79,77,74,72,76,72];
 const harmony=[[48,64,67],[48,64,67],[53,65,69],[55,62,67],[48,64,67],[53,65,69],[55,62,65],[48,64,67]];
 function stop(){for(const n of nodes){try{n.stop();}catch{}}nodes=[];bus?.disconnect();bus=null;notes=0;}
 function play(){stop();bus=ac.createGain();bus.gain.value=.44;bus.connect(destination);const begin=ac.currentTime+.035,beat=.3;
 function note(midi,at,length,volume,type='triangle'){const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=440*2**((midi-69)/12);g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(volume,at+.012);g.gain.exponentialRampToValueAtTime(Math.max(.001,volume*.24),at+length*.65);g.gain.linearRampToValueAtTime(0,at+length);o.connect(g).connect(bus);o.start(at);o.stop(at+length+.025);o.onended=()=>{o.disconnect();g.disconnect();};nodes.push(o);notes++;}
 for(let bar=0;bar<8;bar++){const t=begin+bar*beat*3,chord=harmony[bar];note(chord[0],t,.28,.2,'sine');for(const off of [1,2])for(const pitch of chord.slice(1))note(pitch,t+off*beat,.24,.085);for(let j=0;j<3;j++){const pitch=melody[bar*3+j];note(pitch,t+j*beat,bar===7&&j===2?.85:.27,.23);note(pitch+12,t+j*beat,.18,.035,'sine');}}
 bus.gain.setValueAtTime(.44,begin+7);bus.gain.linearRampToValueAtTime(0,begin+7.8);return notes;}
 return {play,stop,snapshot:()=>({notes,playing:!!bus})};}
