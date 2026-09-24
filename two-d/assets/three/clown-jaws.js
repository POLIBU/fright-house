// Two continuous, opaque jaw panels. Their tooth edges share one closing seam.
export default function generate(THREE){
 const root=new THREE.Group(),red=new THREE.MeshStandardMaterial({color:0x742a2b,roughness:.96}),bone=new THREE.MeshStandardMaterial({color:0xbda985,roughness:.92});
 const seam=new THREE.MeshStandardMaterial({color:0x493429,roughness:1});
 const lower=new THREE.Group(),upper=new THREE.Group();root.add(lower,upper);upper.position.y=1.6;
 const depth=.24,width=1.96;
 for(const [group,sign]of [[lower,1],[upper,-1]]){
  // Extending the gum behind each row prevents the original doorway showing
  // beneath the rising jaw or between neighboring teeth. The scene clips the
  // panels to the doorway silhouette.
  const backing=new THREE.Mesh(new THREE.BoxGeometry(width,2.4,.14),red);backing.position.set(0,sign*(depth-1.2),-.06);group.add(backing);
  for(let i=0;i<8;i++){
   const left=-width/2+i*width/8,right=left+width/8,tip=sign*depth;
   const shape=new THREE.Shape();shape.moveTo(left,0);shape.lineTo(right,0);shape.lineTo(right,tip);shape.lineTo(left,tip);shape.closePath();
   const tooth=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.055,bevelEnabled:true,bevelSize:.003,bevelThickness:.008,bevelSegments:2,steps:1}),bone);tooth.position.z=.06;group.add(tooth);
   if(i>0){const line=new THREE.Mesh(new THREE.BoxGeometry(.025,depth,.004),seam);line.position.set(left,sign*depth/2,.132);group.add(line);}
   const biteLine=new THREE.Mesh(new THREE.BoxGeometry(width/8,.035,.004),seam);biteLine.position.set((left+right)/2,tip,.133);group.add(biteLine);
   // Narrow stains sit on the tooth, never open into the doorway.
   if(i%3===0){const stain=new THREE.Mesh(new THREE.BoxGeometry(.018,.055,.002),red);stain.position.set(left+.036,sign*.04,.123);group.add(stain);}
  }
  const lip=new THREE.Mesh(new THREE.BoxGeometry(width+.04,.105,.18),red);lip.position.set(0,-sign*.035,.05);group.add(lip);
 }
 const bounds=new THREE.Box3().setFromObject(root),center=bounds.getCenter(new THREE.Vector3());for(const c of root.children){c.position.x-=center.x;c.position.z-=center.z;c.position.y-=bounds.min.y;}
 root.userData.joints={lower,upper};root.userData.motion={lowerY:lower.position.y,upperY:upper.position.y,travel:.56,toothDepth:depth};return root;
}
