// Ribbed steel paint drum: continuous lathed shell, separate releasable lid and paint.
export default function generate(THREE){
 const root=new THREE.Group(),body=new THREE.Group();root.add(body);
 const enamel=new THREE.MeshStandardMaterial({color:0xad2523,metalness:.55,roughness:.31,side:THREE.DoubleSide}),steel=new THREE.MeshStandardMaterial({color:0xbbb8a6,metalness:.8,roughness:.3}),dark=new THREE.MeshStandardMaterial({color:0x302e2b,metalness:.5,roughness:.6}),paint=new THREE.MeshStandardMaterial({color:0xf3bc25,roughness:.2,metalness:.04});
 function mesh(p,g,m,x=0,y=0,z=0){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);p.add(o);return o;}
 function ring(p,y,r=.301,t=.007,mat=enamel){const o=mesh(p,new THREE.TorusGeometry(r,t,8,48),mat,0,y);o.rotation.x=Math.PI/2;return o;}
 const profile=[];for(let i=0;i<=86;i++){const y=i*.01;const rib=Math.exp(-(((y-.265)/.017)**2))+Math.exp(-(((y-.59)/.017)**2));profile.push(new THREE.Vector2(.287+.015*rib,y));}
 mesh(body,new THREE.LatheGeometry(profile,48),enamel);mesh(body,new THREE.CylinderGeometry(.285,.285,.014,40),dark,0,.01);ring(body,.01,.29,.009);ring(body,.851,.293,.009,steel);
 const seam=mesh(body,new THREE.BoxGeometry(.004,.81,.008),enamel,0,.43,-.288);seam.name='rolled-seam';
 const liquid=mesh(body,new THREE.CircleGeometry(.279,40),paint,0,.818);liquid.rotation.x=-Math.PI/2;liquid.name='paint-surface';
 const lid=new THREE.Group();lid.name='drum-lid';lid.position.y=.86;body.add(lid);mesh(lid,new THREE.CylinderGeometry(.286,.286,.012,48),enamel);ring(lid,.001,.294,.008,steel);
 for(const [x,z,r]of [[-.12,-.10,.03],[.125,.10,.018]]){mesh(lid,new THREE.CylinderGeometry(r,r,.012,8),steel,x,.013,z);mesh(lid,new THREE.BoxGeometry(r*1.4,.003,.004),dark,x,.021,z);}
 mesh(lid,new THREE.BoxGeometry(.106,.025,.028),steel,0,0,.299);mesh(lid,new THREE.CylinderGeometry(.009,.009,.095,8),dark,.034,0,.31).rotation.z=Math.PI/2;
 root.userData.lid=lid;root.userData.paint=paint;root.userData.enamel=enamel;root.userData.lidRest=lid.position.clone();root.userData.radius=.311;root.userData.setColors=(shellColor,paintColor)=>{enamel.color.set(shellColor);paint.color.set(paintColor);};
 const box=new THREE.Box3().setFromObject(body),center=box.getCenter(new THREE.Vector3());body.position.set(-center.x,-box.min.y,-center.z);return root;
}
