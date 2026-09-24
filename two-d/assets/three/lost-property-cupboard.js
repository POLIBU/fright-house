// Freestanding oak cupboard. The named drawer is a hollow tray on runners.
export default function generate(THREE){
 const root=new THREE.Group(),wood=new THREE.MeshStandardMaterial({color:0x634c39,roughness:.88}),edge=new THREE.MeshStandardMaterial({color:0x94724d,roughness:.8}),dark=new THREE.MeshStandardMaterial({color:0x261f1a,roughness:1}),brass=new THREE.MeshStandardMaterial({color:0xc49a50,metalness:.65,roughness:.4}),paper=new THREE.MeshStandardMaterial({color:0xd3bc86,roughness:1});
 function box(parent,x,y,z,w,h,d,mat){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);parent.add(m);return m;}
 box(root,0,.73,-.235,.94,1.34,.07,dark);
 for(const x of [-.47,.47]){box(root,x,.75,0,.08,1.38,.54,wood);box(root,x,.08,0,.09,.16,.48,dark);}
 for(const y of [.19,.87,1.39])box(root,0,y,0,1.02,.07,.59,edge);
 box(root,0,.52,.265,.88,.58,.055,wood);box(root,0,.52,.30,.73,.42,.018,edge);box(root,0,.52,.315,.65,.34,.014,wood);
 for(const x of [-.39,.39]){box(root,x,.47,.31,.025,.14,.035,brass);box(root,x,.97,0,.025,.025,.46,brass);}
 const knob=new THREE.Mesh(new THREE.SphereGeometry(.026,10,8),brass);knob.position.set(.30,.59,.34);root.add(knob);
 const drawer=new THREE.Group();drawer.name='drawer';root.add(drawer);
 box(drawer,0,.94,0,.82,.035,.45,dark);for(const x of [-.40,.40])box(drawer,x,1.08,0,.035,.25,.46,wood);box(drawer,0,1.08,-.21,.8,.25,.035,wood);
 box(drawer,0,1.09,.26,.89,.36,.065,edge);box(drawer,0,1.09,.303,.76,.25,.025,wood);
 for(const x of [-.11,.11])box(drawer,x,1.09,.355,.025,.025,.09,brass);box(drawer,0,1.09,.4,.25,.035,.025,brass);
 const note=box(drawer,0,.969,0,.34,.008,.22,paper);note.rotation.y=.16;
 for(let i=0;i<5;i++)box(drawer,-.02,.975,-.07+i*.034,.24-(i%2)*.07,.003,.007,dark);
 for(let i=0;i<7;i++)box(root,-.43+i*.14,.525,.328,.007,.33,.003,dark);
 for(const x of [-.516,.516]){for(const z of [-.19,.19])box(root,x,.76,z,.015,1.12,.035,edge);for(const y of [.22,.85,1.28])box(root,x,y,0,.015,.035,.41,edge);}
 for(let i=0;i<6;i++)box(root,-.39+i*.156,.73,-.276,.008,1.22,.012,wood);
 for(const y of [.28,1.2])box(root,0,y,-.29,.9,.05,.035,edge);
 const bounds=new THREE.Box3().setFromObject(root),center=bounds.getCenter(new THREE.Vector3());root.position.set(-center.x,-bounds.min.y,-center.z);const centered=new THREE.Group();centered.add(root);return centered;
}
