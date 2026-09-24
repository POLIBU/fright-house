import {projectedVolume} from './projected-volume.js';
// Original 404-style relief geometry for the fixed top-down camera.
// The scene loader projects the approved painting onto these independent solids.
export default function generate(THREE){
 const root=new THREE.Group(),material=new THREE.MeshStandardMaterial({color:0x736551,roughness:.95});const unit=.05;
 function layer(name,floor){const g=new THREE.Group();g.name=name;g.userData.floor=floor;root.add(g);return g;}
 function box(g,x,y,w,h,d=.16){const m=new THREE.Mesh(new THREE.BoxGeometry(w*unit,h*unit,d),material);m.position.set((x+w/2-240)*unit,(360-y-h/2)*unit,d/2);g.add(m);return m;}
 function profile(g,points,d=.18){const s=new THREE.Shape();points.forEach(([x,y],i)=>s[i?'lineTo':'moveTo']((x-240)*unit,(360-y)*unit));s.closePath();const m=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:false}),material);g.add(m);return m;}
 const bench=layer('bench',260);for(let i=0;i<5;i++)profile(bench,[[21,239+i*3],[79,223+i*3],[80,226+i*3],[22,242+i*3]],.12);profile(bench,[[21,254],[84,235],[89,239],[26,259]],.25);box(bench,26,255,3,10);box(bench,78,242,3,13);
 const board=layer('noticeboard',241);box(board,60,183,56,45,.25);box(board,62,222,4,18);box(board,107,222,4,17);profile(board,[[56,184],[62,178],[117,178],[119,184]],.35);
 const kiosk=layer('kiosk',245);box(kiosk,378,216,101,23,.7);box(kiosk,378,180,101,4,.7);profile(kiosk,[[369,162],[403,145],[451,148],[480,170],[478,183],[376,183]],.95);box(kiosk,377,183,6,54,.8);box(kiosk,473,181,6,56,.8);box(kiosk,381,218,95,4,.9);
 function interior(x,y,w,h,color,d=.65){const m=box(kiosk,x,y,w,h,d);m.material=new THREE.MeshBasicMaterial({color});m.userData.keepMaterial=true;return m;}
 interior(385,184,87,32,0x101510,.5);
 for(let i=0;i<14;i++){interior(386+i*6,185,5,30,i%3===0?0x25291f:0x1c221b,.55);for(let j=0;j<4;j++)interior(387+i*6,188+j*6,1,3,0x343429,.58);}
 for(const y of [197,209]){interior(388,y,80,2,0x514637,.7);interior(388,y+2,80,1,0x090e0c,.7);}
 for(let i=0;i<5;i++){interior(391+i*5,193-i%2,4,4+i%2,0x61563c,.71);interior(392+i*5,194,2,1,0x373a2b,.73);}
 for(let i=0;i<6;i++){interior(437+i*5,187,1,7,0x625c45,.72);interior(437+i*5,193,3,1,0x625c45,.72);}
 interior(414,201,10,7,0x817253,.72);interior(416,203,6,1,0x4a4332,.73);interior(416,206,4,1,0x4a4332,.73);
 interior(444,203,15,5,0x3b3328,.73);interior(445,202,13,1,0x6a5a40,.74);
 const shutter=box(kiosk,385,184,87,32,.95);shutter.name='kiosk-shutter';shutter.userData.baseY=shutter.position.y;
 const fenceLeft=layer('left-gate',329),fenceRight=layer('right-gate',329);
 box(fenceLeft,66,306,104,22,.38);box(fenceLeft,157,294,16,34,.5);box(fenceLeft,169,311,38,3,.15);for(let i=0;i<6;i++)box(fenceLeft,174+i*5,287-i*1.7,1,43,.1);
 box(fenceRight,303,305,105,23,.38);box(fenceRight,303,294,16,34,.5);box(fenceRight,279,311,24,3,.15);for(let i=0;i<5;i++)box(fenceRight,282+i*5,287+i,1,41,.1);
 for(const [name,x,y]of [['west-lamp',166,286],['east-lamp',316,286],['kiosk-lamp',323,189]]){const g=layer(name,y+19);box(g,x-3,y-7,6,12,.13);box(g,x-1,y+5,2,13,.12);profile(g,[[x-5,y-7],[x,y-11],[x+5,y-7]],.18);}
 const bin=layer('litter-bin',247);profile(bin,[[126,232],[139,231],[140,244],[128,246]],.35);profile(bin,[[125,231],[132,227],[141,231],[135,234]],.4);
 const barrel=layer('rusted-drum',257);profile(barrel,[[451,231],[458,228],[468,231],[467,253],[459,256],[451,252]],.45);
 const car=layer('abandoned-cart',293);profile(car,[[391,257],[404,251],[425,258],[438,255],[461,267],[459,282],[445,290],[412,291],[398,281]],.65);
 projectedVolume(THREE,bench,material,[[22,253],[84,235],[89,240],[27,259]],4);
 projectedVolume(THREE,kiosk,material,[[378,233],[479,233],[479,244],[378,244]],25);
 projectedVolume(THREE,car,material,[[402,280],[441,291],[461,281],[425,265]],15);
 return root;
}
