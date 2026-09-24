// Original wind-up toy, built through the 404 geometry-as-code recipe.
export default function generate(THREE) {
  const root=new THREE.Group(), M=(c,metalness=0)=>new THREE.MeshStandardMaterial({color:c,metalness,roughness:.62});
  const red=M(0x873c36),cream=M(0xc4b58b),gold=M(0xb49551,.65),dark=M(0x252d2b,.55),blue=M(0x487878),paper=M(0xddc79a);
  function mesh(g,m,x,y,z,parent=root){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);parent.add(o);return o;}
  mesh(new THREE.CylinderGeometry(.19,.18,.065,24),red,0,.0325,0);
  for(const y of [.015,.062])mesh(new THREE.TorusGeometry(.187,.009,6,32),gold,0,y,0).rotation.x=Math.PI/2;
  mesh(new THREE.CylinderGeometry(.172,.172,.016,24),dark,0,.078,0);
  // Hinged display deck opens to expose the concealed compartment.
  const lid=new THREE.Group();lid.position.set(0,.085,-.155);root.add(lid);
  mesh(new THREE.CylinderGeometry(.175,.175,.012,24),cream,0,0,.155,lid);
  mesh(new THREE.BoxGeometry(.1,.006,.065),paper,0,.087,.055);
  // Physical raised numerals 03 on a brass plate beneath the lid.
  mesh(new THREE.BoxGeometry(.1,.005,.047),gold,0,.085,-.018);
  const segments=[[[0,1],[1,1]],[[1,1],[1,0]],[[1,0],[1,-1]],[[0,-1],[1,-1]],[[0,0],[0,-1]],[[0,1],[0,0]],[[0,0],[1,0]]];
  for(const [digit,indices]of [[0,[0,1,2,3,4,5]],[1,[0,1,2,3,6]]])for(const i of indices){const [a,b]=segments[i],dx=b[0]-a[0],dz=b[1]-a[1];const p=mesh(new THREE.BoxGeometry(dx?.019:.003,.003,dz?.014:.003),dark,-.031+digit*.034+(a[0]+b[0])*.0095,.089,-.018+(a[1]+b[1])*.007);}
  const carousel=new THREE.Group();carousel.position.set(0,.015,.155);lid.add(carousel);
  mesh(new THREE.CylinderGeometry(.012,.015,.24,10),gold,0,.12,0,carousel);
  for(let i=0;i<6;i++){const a=i*Math.PI/3;const pole=mesh(new THREE.CylinderGeometry(.003,.003,.19,6),gold,Math.cos(a)*.125,.11,Math.sin(a)*.125,carousel);
    const bird=new THREE.Group();bird.position.set(pole.position.x,.09,pole.position.z);bird.rotation.y=-a;carousel.add(bird);
    const body=mesh(new THREE.SphereGeometry(.026,10,6),i%2?cream:blue,0,0,0,bird);body.scale.set(1.4,.7,.65);
    mesh(new THREE.SphereGeometry(.014,8,6),cream,.025,.018,0,bird);
    const beak=mesh(new THREE.ConeGeometry(.008,.018,6),gold,.041,.018,0,bird);beak.rotation.z=-Math.PI/2;
    mesh(new THREE.SphereGeometry(.0025,6,4),dark,.03,.022,.012,bird);
  }
  mesh(new THREE.ConeGeometry(.2,.105,24),red,0,.27,0,carousel);
  mesh(new THREE.TorusGeometry(.196,.008,6,32),gold,0,.219,0,carousel).rotation.x=Math.PI/2;
  for(let i=0;i<12;i++){const a=i*Math.PI/6;mesh(new THREE.SphereGeometry(.009,6,4),cream,Math.cos(a)*.19,.218,Math.sin(a)*.19,carousel);}
  mesh(new THREE.SphereGeometry(.015,8,6),gold,0,.33,0,carousel);
  const key=new THREE.Group();key.position.set(0,.045,-.22);root.add(key);
  const shaft=mesh(new THREE.CylinderGeometry(.006,.006,.09,8),gold,0,0,.015,key);shaft.rotation.x=Math.PI/2;
  for(const x of [-.025,.025])mesh(new THREE.TorusGeometry(.024,.006,6,12),gold,x,0,-.03,key);
  // Scratches and offset rivets give each side authored detail without image textures.
  for(let i=0;i<12;i++){const a=i*Math.PI/6;mesh(new THREE.SphereGeometry(.004,6,4),gold,Math.cos(a)*.188,.033,Math.sin(a)*.188);}
  root.userData.joints={lid,carousel,key};const bounds=new THREE.Box3().setFromObject(root),center=bounds.getCenter(new THREE.Vector3());
  for(const child of root.children){child.position.x-=center.x;child.position.z-=center.z;child.position.y-=bounds.min.y;}
  return root;
}
