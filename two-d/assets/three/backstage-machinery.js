// Original mechanical set: toothed flywheels, belt drive and reciprocating pump.
export default function generate(THREE){
 const root=new THREE.Group(),iron=new THREE.MeshStandardMaterial({color:0x364547,metalness:.7,roughness:.6}),rust=new THREE.MeshStandardMaterial({color:0x805238,metalness:.4,roughness:.8}),brass=new THREE.MeshStandardMaterial({color:0xad874f,metalness:.7,roughness:.4}),black=new THREE.MeshStandardMaterial({color:0x161b19,roughness:.9});
 function box(g,x,y,z,w,h,d,m=iron){const a=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);a.position.set(x,y,z);g.add(a);return a;}
 function wheel(name,x,y,r,teeth){const g=new THREE.Group();g.name=name;g.position.set(x,y,.12);root.add(g);const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.035,6,28),rust);g.add(ring);const hub=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.14,12),brass);hub.rotation.x=Math.PI/2;g.add(hub);for(let i=0;i<teeth;i++){const a=i*Math.PI*2/teeth,t=box(g,Math.cos(a)*r,Math.sin(a)*r,0,.065,.06,.08,brass);t.rotation.z=a;}for(let i=0;i<4;i++){const spoke=box(g,0,0,0,r*1.8,.026,.045);spoke.rotation.z=i*Math.PI/4;}return g;}
 box(root,0,.065,0,3.1,.13,.5);for(const x of [-1.45,0,1.45]){box(root,x,.65,-.14,.08,1.22,.1);for(const y of [.15,1.13])box(root,x,y,-.04,.15,.12,.06,rust);}box(root,0,1.23,-.12,3.1,.07,.12);
 wheel('flywheel',-1,.64,.38,20);wheel('idler',-.51,.95,.19,12);wheel('drive',.05,.45,.27,16);wheel('pulley',.05,1,.14,10);
 for(let i=0;i<24;i++){const a=i*Math.PI*2/24;const link=box(root,.05+.27*Math.cos(a),.72+.48*Math.sin(a),.20,.028,.06,.03,black);link.name='belt-'+i;}
 box(root,.94,.37,0,.6,.39,.36,rust);box(root,.94,.92,0,.3,.35,.28,iron);const piston=new THREE.Group();piston.name='piston';piston.position.set(.94,.56,.08);root.add(piston);box(piston,0,.12,0,.07,.46,.07,brass);box(piston,0,0,.02,.3,.09,.14,iron);
 const crank=wheel('crank',.94,.34,.21,12);crank.position.z=.30;
 for(const x of [-1.37,.5,1.33]){const pipe=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.98,8),rust);pipe.position.set(x,.69,-.19);root.add(pipe);}
 return root;
}
