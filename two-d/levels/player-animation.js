export const PLAYER_HEIGHT=40;
export function playerPose(s,moving){
 const direction=s.face||'down';
 if(s.grounded===false&&!s.stair)return {kind:'jump',row:direction==='left'?0:1,frame:(s.jumpAge||0)<.09&&s.vy<0?0:s.vy<0?1:2};
 if(s.landingAge>0&&!s.stair)return {kind:'jump',row:direction==='left'?0:1,frame:3};
 return {kind:moving?'walk':'idle',row:({down:0,left:1,up:2,right:3})[direction]??0,frame:moving?Math.floor(((s.walk||0)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)*4/(Math.PI*2)):0};
}
