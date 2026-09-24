// 404 recipe asset: metres, +Z front, procedural constructors only.
export default function generate(THREE) {
  const root=new THREE.Group();
  const steel=new THREE.MeshStandardMaterial({color:0x665f50,metalness:.78,roughness:.52});
  const dark=new THREE.MeshStandardMaterial({color:0x293132,metalness:.55,roughness:.8});
  const paint=new THREE.MeshStandardMaterial({color:0x763627,roughness:.86});
  const brass=new THREE.MeshStandardMaterial({color:0xae9161,metalness:.7,roughness:.48});
  const mesh=(g,m,x,y,z,parent=root)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);parent.add(o);return o;};
  mesh(new THREE.BoxGeometry(.39,.1,.52),dark,-.58,.05,0);
  mesh(new THREE.BoxGeometry(.27,.92,.32),paint,-.58,.56,0);
  mesh(new THREE.BoxGeometry(.42,.16,.5),steel,-.58,1.1,0);
  for(let i=0;i<5;i++)mesh(new THREE.BoxGeometry(.29,.018,.012),dark,-.58,.38+i*.095,.166);
  for(const x of [-.72,-.44])for(const z of [-.18,.18])mesh(new THREE.SphereGeometry(.025,6,4),brass,x,1.185,z);
  mesh(new THREE.BoxGeometry(.14,.008,.028),dark,-.58,1.185,.02);
  const spindle=new THREE.Group();spindle.position.set(-.4,.89,0);root.add(spindle);
  const hub=mesh(new THREE.CylinderGeometry(.095,.095,.13,12),brass,0,0,0,spindle);hub.rotation.z=Math.PI/2;
  // One intact horizontal arm and a visibly snapped lower arm.
  const arm=mesh(new THREE.CylinderGeometry(.035,.035,1.02,10),steel,.51,0,0,spindle);arm.rotation.z=Math.PI/2;
  const grip=mesh(new THREE.CylinderGeometry(.046,.046,.17,10),dark,.89,0,0,spindle);grip.rotation.z=Math.PI/2;
  const broken=mesh(new THREE.CylinderGeometry(.032,.027,.27,8),steel,.06,-.18,.05,spindle);broken.rotation.z=-.4;
  for(const z of [-.38,.38]){mesh(new THREE.CylinderGeometry(.045,.045,1.06,10),steel,.77,.53,z);mesh(new THREE.SphereGeometry(.048,8,6),brass,.77,1.06,z);}
  const rail=mesh(new THREE.CylinderGeometry(.034,.034,.76,10),steel,.77,.98,0);rail.rotation.x=Math.PI/2;
  root.userData.joints={spindle};const bounds=new THREE.Box3().setFromObject(root),center=bounds.getCenter(new THREE.Vector3());
  for(const child of root.children){child.position.x-=center.x;child.position.z-=center.z;child.position.y-=bounds.min.y;}
  return root;
}
