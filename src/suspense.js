// Progress owns the schedule. Only active, narration-free simulation time advances it.
const motifs=['ceiling-creak','distant-movement','failing-light'];
export class Suspense {
 constructor(){this.reset();}
 reset(){this.seen=new Set();this.queue=[];this.active=null;this.quiet=3;this.serial=0;}
 milestone(id){if(this.seen.has(id))return;this.seen.add(id);this.queue.push({id,kind:motifs[(this.seen.size-1)%motifs.length],duration:8});}
 step(dt,{paused=false,busy=false}={}){if(paused||busy)return null;if(this.active){this.active.age+=dt;if(this.active.age>=this.active.duration){this.active=null;this.quiet=14;}return null;}this.quiet=Math.max(0,this.quiet-dt);if(!this.quiet&&this.queue.length){this.active={...this.queue.shift(),age:0,serial:++this.serial};return this.active;}return null;}
 snapshot(){return {active:this.active?{...this.active}:null,queued:this.queue.map(e=>e.id),seen:[...this.seen],quiet:this.quiet};}
}
