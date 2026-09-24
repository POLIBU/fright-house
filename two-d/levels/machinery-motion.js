// One simulation clock drives all visible mechanics; paused world time freezes them.
export function machineryPose(time,power){const t=power?time:0;return {flywheel:-t*1.7,idler:t*3.4,drive:t*2.2,pulley:t*4.4,crank:-t*2.2,piston:.56+Math.sin(t*2.2)*.13,beltPhase:t*2.2};}
