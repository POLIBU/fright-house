// Each room has its own authored score. Existing controllers keep pause/mute ownership.
export const ROOM_SCORES=[null,'park','hall','circus','toys','library','factory','mezzanine','boss','fall','bones','cart'];
const playing=new Map();
export function createRoomMusic(level){
 const audio=new Audio(new URL(`./audio/atlas-score-${ROOM_SCORES[level]}.mp3`,import.meta.url));
 audio.loop=true;audio.preload='none';audio.volume=.14;audio.preservesPitch=false;audio.playbackRate=[1,.9,.86,.78,.87,.88,.8,.9,.96,.84,.9,1][level];playing.set(level,audio);return audio;
}
export function musicSnapshot(level){const audio=playing.get(level);return {score:ROOM_SCORES[level],loaded:!!audio&&audio.readyState>=2,playing:!!audio&&!audio.paused,volume:audio?.volume||0,muted:!!audio?.muted};}
