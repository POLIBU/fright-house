// Fixed mounting plate and housing; only the ram and crushing head travel.
export default function generate(THREE){
 const root=new THREE.Group(),iron=new THREE.MeshStandardMaterial({color:0x343b3a,metalness:.7,roughness:.45}),steel=new THREE.MeshStandardMaterial({color:0xbac4be,metalness:.85,roughness:.3}),brass=new THREE.MeshStandardMaterial({color:0xaa8844,metalness:.5,roughness:.55});
 function box(parent,x,y,w,h,d,material){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,0);parent.add(m);return m;}
 box(root,0,0,68,10,12,iron);box(root,0,-19,26,30,16,iron);
 for(const x of [-27,27]){const bolt=box(root,x,0,4,4,3,brass);bolt.position.z=7;}
 const head=new THREE.Group();root.add(head);box(head,0,0,50,18,20,iron);box(head,0,-9,54,4,22,steel);
 for(const x of [-18,-6,6,18]){const stripe=box(head,x,0,5,12,1,brass);stripe.position.z=11;stripe.rotation.z=-.35;}
 const rods=[-17,0,17].map(x=>box(root,x,-42,x===0?8:3,1,5,steel));
 root.userData.setHeadY=distance=>{head.position.y=-distance;const top=-distance+9,start=-32,length=Math.max(1,start-top);for(const rod of rods){rod.position.y=(start+top)/2;rod.scale.y=length;}root.userData.headDistance=distance;};root.userData.setHeadY(58);return root;
}
