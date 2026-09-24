import drum from './paint-drum.js';
// Connected service rack: a spring ram feeds a ribbed steel drum onto roller rails.
export default function generate(THREE){
 const asset=new THREE.Group(),root=new THREE.Group();asset.add(root);
 const iron=new THREE.MeshStandardMaterial({color:0x424843,metalness:.72,roughness:.6}),rust=new THREE.MeshStandardMaterial({color:0x6b3627,metalness:.3,roughness:.85}),wood=new THREE.MeshStandardMaterial({color:0x64422a,roughness:.88}),brass=new THREE.MeshStandardMaterial({color:0xc29b48,metalness:.7,roughness:.35}),red=new THREE.MeshStandardMaterial({color:0x8d1a12,emissive:0xff3009,emissiveIntensity:.15,roughness:.25});
 function mesh(p,g,m,x=0,y=0,z=0){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);p.add(o);return o;}
 function box(p,x,y,z,w,h,d,m=iron){return mesh(p,new THREE.BoxGeometry(w,h,d),m,x,y,z);}
 function beam(p,a,b,r=.045,m=iron){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),o=mesh(p,new THREE.CylinderGeometry(r,r,start.distanceTo(end),10),m);o.position.copy(start).add(end).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),end.sub(start).normalize());return o;}
 // The same connected frame carries the hopper, ram, launch bed and warning light.
 for(const x of [-.7,.7])for(const z of [-.62,.25]){box(root,x,1.2,z,.13,2.4,.13);box(root,x,.055,z,.33,.11,.29);for(const dx of [-.11,.11])mesh(root,new THREE.CylinderGeometry(.023,.023,.019,6),brass,x+dx,.12,z);}
 for(const y of [.35,1.2,2.25]){box(root,0,y,-.62,1.55,.12,.14,wood);for(const x of [-.7,.7])box(root,x,y,-.18,.12,.1,.88);}
 beam(root,[-.7,.38,-.68],[.7,2.22,-.68],.055,rust);beam(root,[.7,.38,-.68],[-.7,2.22,-.68],.055,rust);
 for(const x of [-.49,.49]){beam(root,[x,1.25,-.62],[x,.32,1.48],.065);beam(root,[x,1.5,-.12],[x,.55,1.48],.036);beam(root,[x,.15,1.3],[x,.43,1.3],.06);}
 for(let i=0;i<12;i++){const t=i/11,y=1.24-.92*t,z=-.6+2.08*t;const roller=mesh(root,new THREE.CylinderGeometry(.044,.044,1.01,12),i%3?iron:rust,0,y,z);roller.rotation.z=Math.PI/2;}
 // Closely fitted plank bed supports the rollers; no disconnected chute panels.
 const bed=box(root,0,.725,.42,1.02,.07,2.31,wood);bed.rotation.x=Math.atan2(.92,2.08);
 const ram=new THREE.Group();ram.name='launch-ram';ram.position.set(0,1.52,-.42);root.add(ram);box(ram,0,0,0,.84,.46,.10,rust);
 beam(root,[0,1.52,-.65],[0,1.52,-.18],.075,brass);box(root,0,1.52,-.64,.40,.29,.15);
 const latch=new THREE.Group();latch.name='launch-latch';latch.position.set(.53,.7,.60);root.add(latch);box(latch,-.53,0,0,1.12,.07,.055,rust);
 // Two stored drums are supported by the upper crossbars.
 for(const [i,x]of [-.33,.33].entries()){const d=drum(THREE);d.userData.setColors(i?0x273f88:0xac2922,i?0x35c6af:0xf0c328);d.scale.setScalar(.73);d.position.set(x,1.30,-.2);root.add(d);}
 box(root,0,2.31,-.09,1.58,.16,.82,wood);for(const x of [-.68,.68])for(const z of [-.41,.21])mesh(root,new THREE.SphereGeometry(.026,8,6),brass,x,2.405,z);
 beam(root,[.68,2.33,.14],[.68,2.72,.14],.033);mesh(root,new THREE.CylinderGeometry(.12,.12,.06,16),iron,.68,2.69,.14);mesh(root,new THREE.SphereGeometry(.11,16,10,0,Math.PI*2,0,Math.PI/2),red,.68,2.72,.14);for(let i=0;i<4;i++){const a=i*Math.PI/2;beam(root,[.68+Math.cos(a)*.12,2.7,.14+Math.sin(a)*.12],[.68+Math.cos(a)*.10,2.85,.14+Math.sin(a)*.10],.008);}
 asset.userData.ram=ram;asset.userData.latch=latch;asset.userData.warningMaterial=red;const bounds=new THREE.Box3().setFromObject(root),center=bounds.getCenter(new THREE.Vector3());root.position.set(-center.x,-bounds.min.y,-center.z);asset.userData.launchStart=new THREE.Vector3(0,1.19,.25).add(root.position);asset.userData.launchEnd=new THREE.Vector3(0,.63,1.48).add(root.position);return asset;
}
