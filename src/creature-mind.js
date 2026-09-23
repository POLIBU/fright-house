import {cellAt,pathfind,point,neighbors,SIZE} from './model.js';
export class CreatureMind {
 constructor(){this.reset();}
 reset(){this.mode='dormant';this.target=null;this.lastSeen=null;this.source=null;this.searchAge=0;this.searchStep=0;this.revision=0;}
 aim(target,mode,source){if(!this.target||Math.hypot(target.x-this.target.x,target.z-this.target.z)>.35||this.mode!==mode)this.revision++;this.target={x:target.x,z:target.z};this.mode=mode;this.source=source;}
 hear(position,origin,gates,radius,kind){const route=pathfind(cellAt(position.x,position.z),cellAt(origin.x,origin.z),gates);const travel=route.length===1?Math.hypot(position.x-origin.x,position.z-origin.z):Math.max(0,route.length-1)*SIZE;if(!route.length||travel>radius)return false;if(this.mode==='pursue')return false;this.aim(origin,'investigate',kind);this.searchAge=0;this.searchStep=0;return true;}
 step(dt,{position,player,visible,gates}){
  if(visible){this.lastSeen={...player};this.aim(player,'pursue','sight');this.searchAge=0;this.searchStep=0;return;}
  if(this.mode==='pursue'&&this.lastSeen)this.aim(this.lastSeen,'investigate','last-seen');
  if(!this.target)return;
  const distance=Math.hypot(position.x-this.target.x,position.z-this.target.z);
  if(distance<.28){if(this.mode!=='search'){this.mode='search';this.searchAge=0;}this.searchAge+=dt;
   if(this.searchAge>1.8){this.searchAge=0;const options=neighbors(cellAt(position.x,position.z),gates);if(options.length&&this.searchStep<3){this.aim(point(options[this.searchStep%options.length]),'search','search');this.searchStep++;}else{this.mode='listen';this.target=null;this.source=null;this.revision++;}}
  }
 }
 snapshot(){return {mode:this.mode,target:this.target?{...this.target}:null,lastSeen:this.lastSeen?{...this.lastSeen}:null,source:this.source,searchAge:this.searchAge,searchStep:this.searchStep,revision:this.revision};}
}
