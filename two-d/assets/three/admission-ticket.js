// 404 recipe: a perforated paper ticket with a bent stub with geometry-built ink on both sides.
export default function generate(THREE){
 const root=new THREE.Group(),paper=new THREE.MeshStandardMaterial({color:0xc5ad78,roughness:1,side:THREE.DoubleSide}),ink=new THREE.MeshStandardMaterial({color:0x752f2c,roughness:1}),faded=new THREE.MeshStandardMaterial({color:0x695538,roughness:1});
 const w=.132,h=.066,t=.00065,shape=new THREE.Shape();shape.moveTo(-w/2,0);shape.lineTo(w/2,0);shape.lineTo(w/2,h*.4);shape.quadraticCurveTo(w/2-.004,h*.5,w/2,h*.6);shape.lineTo(w/2,h);shape.lineTo(-w/2,h);shape.lineTo(-w/2,h*.6);shape.quadraticCurveTo(-w/2+.004,h*.5,-w/2,h*.4);shape.closePath();
 for(let i=0;i<14;i++){const hole=new THREE.Path();hole.absellipse(.046,.004+i*.00445,.00065,.0008,0,Math.PI*2,true);shape.holes.push(hole);}
 const curve=x=>Math.max(0,x-.046)*.22;
 const card=new THREE.ExtrudeGeometry(shape,{depth:t,bevelEnabled:false,curveSegments:12,steps:1});const p=card.attributes.position;for(let i=0;i<p.count;i++)p.setZ(i,p.getZ(i)+curve(p.getX(i)));card.computeVertexNormals();root.add(new THREE.Mesh(card,paper));
 // Original compact block lettering, not an imported font or mesh payload.
 const font={A:'01110/10001/10001/11111/10001/10001/10001',B:'11110/10001/10001/11110/10001/10001/11110',C:'01111/10000/10000/10000/10000/10000/01111',D:'11110/10001/10001/10001/10001/10001/11110',E:'11111/10000/10000/11110/10000/10000/11111',F:'11111/10000/10000/11110/10000/10000/10000',G:'01111/10000/10000/10111/10001/10001/01111',H:'10001/10001/10001/11111/10001/10001/10001',I:'11111/00100/00100/00100/00100/00100/11111',K:'10001/10010/10100/11000/10100/10010/10001',L:'10000/10000/10000/10000/10000/10000/11111',M:'10001/11011/10101/10101/10001/10001/10001',N:'10001/11001/10101/10011/10001/10001/10001',O:'01110/10001/10001/10001/10001/10001/01110',P:'11110/10001/10001/11110/10000/10000/10000',R:'11110/10001/10001/11110/10100/10010/10001',S:'01111/10000/10000/01110/00001/00001/11110',T:'11111/00100/00100/00100/00100/00100/00100',U:'10001/10001/10001/10001/10001/10001/01110',Y:'10001/10001/01010/00100/00100/00100/00100','0':'01110/10001/10011/10101/11001/10001/01110','1':'00100/01100/00100/00100/00100/00100/01110','7':'11111/00001/00010/00100/01000/01000/01000','8':'01110/10001/10001/01110/10001/10001/01110','9':'01110/10001/10001/01111/00001/00001/01110'};
 const blocks=[];
 function text(label,cx,y,size,back=false){const start=cx-(label.length*6-1)*size/2;for(let n=0;n<label.length;n++){const rows=(font[label[n]]||'').split('/');rows.forEach((row,r)=>{for(let c=0;c<row.length;c++)if(row[c]==='1')blocks.push({x:(start+(n*6+c)*size)*(back?-1:1),y:y-r*size,s:size,back});});}}
 text('FRIGHT HOUSE',-.009,.053,.0013);text('ADMIT ONE',-.009,.039,.00105);text('OCT 17 1987',-.009,.022,.001);text('087',.056,.033,.00082);
 text('KEEP YOUR STUB',0,.048,.0011,true);text('NO REFUNDS',0,.029,.00095,true);text('087',0,.012,.0008,true);
 const letters=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),ink,blocks.length),dummy=new THREE.Object3D();blocks.forEach((b,i)=>{dummy.position.set(b.x,b.y,curve(b.x)+(b.back?-.00005:t+.00005));dummy.rotation.set(0,0,0);dummy.scale.set(b.s*.9,b.s*.9,.00009);dummy.updateMatrix();letters.setMatrixAt(i,dummy.matrix);});root.add(letters);
 for(const y of [.008,.059]){const g=new THREE.BoxGeometry(.102,.0006,.00008);const mesh=new THREE.Mesh(g,ink);mesh.position.set(-.01,y,t+.00012);root.add(mesh);}
 // Raised crease and worn fibres at the edge; all remain thin paper geometry.
 for(let i=0;i<24;i++){const x=-.061+i*.0052,g=new THREE.BoxGeometry(.0012,.0005,.00012),m=new THREE.Mesh(g,faded);m.position.set(x,.001+(i%3)*.0003,curve(x)+t+.0001);root.add(m);}
 const bounds=new THREE.Box3().setFromObject(root),center=bounds.getCenter(new THREE.Vector3());for(const c of root.children){c.position.x-=center.x;c.position.z-=center.z;c.position.y-=bounds.min.y;}
 return root;
}
