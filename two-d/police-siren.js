// Original synthesized, slow vintage siren. Scene time keeps it in step with pause.
export function createPoliceSiren(ac,output){
 let voices=null,level=0,frequency=0;
 function stop(){if(voices){for(const o of voices.oscillators){o.stop();o.disconnect();}voices.filter.disconnect();voices.gain.disconnect();voices.pan.disconnect();voices=null;}level=0;}
 function tick(s,muted=false){
  const active=s.branch==='arrest'&&['approach','cuff','reaction','escort','crouch','police-drive'].includes(s.phase);
  if(!active||muted){stop();return;}
  if(s.paused||ac.state!=='running')return;
  if(!voices){const gain=ac.createGain(),filter=ac.createBiquadFilter(),pan=ac.createStereoPanner();gain.gain.value=0;filter.type='lowpass';filter.frequency.value=1900;filter.Q.value=.4;const oscillators=['triangle','sine'].map(type=>{const o=ac.createOscillator();o.type=type;o.connect(filter);o.start();return o;});filter.connect(gain).connect(pan).connect(output);voices={oscillators,filter,gain,pan};}
  const drive=s.phase==='police-drive'?s.age:0;
  const fadeIn=s.phase==='approach'?Math.min(1,s.age/1.2):1;
  level=.24*fadeIn*Math.exp(-drive*.65);
  frequency=540+390*(.5-.5*Math.cos(s.time*Math.PI*2/3.8));
  voices.oscillators[0].frequency.setTargetAtTime(frequency*(drive? .92:1),ac.currentTime,.025);
  voices.oscillators[1].frequency.setTargetAtTime(frequency*1.007*(drive? .92:1),ac.currentTime,.025);
  voices.gain.gain.setTargetAtTime(level,ac.currentTime,.08);
  voices.pan.pan.setTargetAtTime(Math.min(.95,.25+drive*.15),ac.currentTime,.1);
 }
 return {tick,stop,snapshot:()=>({playing:!!voices&&ac.state==='running',level,frequency})};
}
