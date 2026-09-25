// Continuous stamped-tin shell and joined ride assembly; constructor-built geometry.
export default function generate(THREE){
 const root=new THREE.Group(),mat=(color,metalness=.45)=>new THREE.MeshStandardMaterial({color,metalness,roughness:.45,side:THREE.DoubleSide}),red=mat(0xb83927),yellow=mat(0xdbb347),blue=mat(0x367697),cream=mat(0xded1af),black=mat(0x252726),brass=mat(0xbda368,.75),paper=mat(0xc4af7c,0);
 function mesh(g,m,x,y,z,parent=root){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);parent.add(o);return o;}
 mesh(new THREE.CylinderGeometry(.195,.20,.062,48),red,0,.031,0);mesh(new THREE.CylinderGeometry(.19,.19,.018,48),blue,0,.067,0);
 for(const y of [.015,.054]){const rim=mesh(new THREE.TorusGeometry(.197,.005,8,48),red,0,y,0);rim.rotation.x=Math.PI/2;}
 mesh(new THREE.BoxGeometry(.09,.002,.075),paper,0,.079,.055);
 for(let i=0;i<4;i++)mesh(new THREE.BoxGeometry(.063,.0006,.003),black,0,.0805,.031+i*.012);
 const lid=new THREE.Group();lid.position.set(0,.082,-.15);root.add(lid);mesh(new THREE.CylinderGeometry(.19,.19,.014,48),yellow,0,0,.15,lid);
 const carousel=new THREE.Group();carousel.position.set(0,.008,.15);lid.add(carousel);const fragments=[];
 const column=new THREE.Group();carousel.add(column);mesh(new THREE.CylinderGeometry(.057,.06,.237,32),blue,0,.118,0,column);
 for(let i=0;i<12;i++){const a=i*Math.PI/6;const pipe=mesh(new THREE.CylinderGeometry(.003,.003,.085-(i%3)*.012,6),brass,Math.cos(a)*.059,.076,Math.sin(a)*.059,column);}
 fragments.push(column);
 const roof=new THREE.Group();carousel.add(roof);const profile=[[0,.335],[.045,.331],[.09,.317],[.14,.293],[.181,.26],[.205,.233],[.206,.222],[.20,.215],[0,.215]].map(([r,y])=>new THREE.Vector2(r,y));mesh(new THREE.LatheGeometry([...profile].reverse(),64),yellow,0,0,0,roof);
 // Paint lies directly on the continuous canopy; it is not a collection of detached wedges.
 const paintProfile=profile.slice(0,6).map(v=>new THREE.Vector2(v.x+.0005,v.y+.0005));for(let i=0;i<12;i++)mesh(new THREE.LatheGeometry([...paintProfile].reverse(),8,i*Math.PI/6,Math.PI/6),i%3===0?red:i%3===1?blue:yellow,0,0,0,roof);
 for(const y of [.218,.231]){const rim=mesh(new THREE.TorusGeometry(.205,.006,8,64),red,0,y,0,roof);rim.rotation.x=Math.PI/2;}
 mesh(new THREE.CylinderGeometry(.017,.022,.01,20),black,0,.337,0,roof);fragments.push(roof);
 for(let i=0;i<6;i++){const a=i*Math.PI/3,x=Math.cos(a)*.131,z=Math.sin(a)*.131;const pole=mesh(new THREE.CylinderGeometry(.0035,.0035,.231,8),brass,x,.115,z,carousel);fragments.push(pole);
 const horse=new THREE.Group();horse.position.set(x,.083,z);horse.rotation.y=-a;carousel.add(horse);
 const shape=new THREE.Shape();shape.moveTo(-.042,0);shape.bezierCurveTo(-.055,.012,-.051,.03,-.031,.03);shape.lineTo(.005,.031);shape.lineTo(.02,.061);shape.lineTo(.033,.067);shape.lineTo(.05,.044);shape.lineTo(.034,.035);shape.lineTo(.029,.012);shape.lineTo(.018,-.004);shape.lineTo(.033,-.033);shape.lineTo(.02,-.038);shape.lineTo(.005,-.01);shape.lineTo(-.02,-.01);shape.lineTo(-.035,-.036);shape.lineTo(-.047,-.032);shape.lineTo(-.034,-.003);shape.closePath();
 const horseWood=mat(0xbc9360,0);horseWood.roughness=.83;horseWood.onBeforeCompile=shader=>{shader.vertexShader='varying vec3 vWoodLocal;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvWoodLocal=position;');shader.fragmentShader='varying vec3 vWoodLocal;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>\nfloat grain=sin(vWoodLocal.x*320.0+sin(vWoodLocal.y*180.0)*2.8);diffuseColor.rgb*=.83+.17*grain;`);};
 mesh(new THREE.ExtrudeGeometry(shape,{depth:.006,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.001,bevelThickness:.001}),horseWood,0,0,-.003,horse);
 mesh(new THREE.BoxGeometry(.028,.014,.01),red,-.007,.03,0,horse);mesh(new THREE.SphereGeometry(.008,8,6),black,.034,.049,.005,horse).scale.set(.3,.3,.3);
 const rider=mesh(new THREE.SphereGeometry(.014,10,8),blue,-.012,.052,0,horse);rider.scale.set(.75,1.2,.55);mesh(new THREE.SphereGeometry(.010,10,8),cream,-.011,.074,0,horse);fragments.push(horse);
 }
 const key=new THREE.Group();key.position.set(.224,.035,0);root.add(key);const shaft=mesh(new THREE.CylinderGeometry(.006,.006,.08,10),brass,0,0,0,key);shaft.rotation.z=Math.PI/2;for(const y of [-.014,.014]){const loop=mesh(new THREE.TorusGeometry(.018,.005,8,16),brass,.037,y,0,key);loop.rotation.y=Math.PI/2;}
 for(let i=0;i<16;i++){const a=i*Math.PI/8;mesh(new THREE.SphereGeometry(.003,6,4),brass,Math.cos(a)*.199,.032,Math.sin(a)*.199);}
 root.userData.joints={lid,carousel,key,fragments};for(const [i,f]of fragments.entries())f.userData.burst={index:i,position:f.position.clone(),rotation:f.rotation.clone()};
 const bounds=new THREE.Box3().setFromObject(root),center=bounds.getCenter(new THREE.Vector3());for(const child of root.children){child.position.x-=center.x;child.position.z-=center.z;}return root;
}
