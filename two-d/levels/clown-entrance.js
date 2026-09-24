export function clownEntrance(s){const t=s.power?(s.powerAge??10):0;return {door:Math.min(1,t/.9),visible:s.power&&t>.55&&t<5,x:835-Math.max(0,t-.9)*38,y:690,walk:Math.max(0,t-.9)*9,emerging:t<1.4};}
