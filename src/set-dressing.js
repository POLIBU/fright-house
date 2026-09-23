import * as THREE from 'three';

const wood=new THREE.MeshStandardMaterial({color:0x594334,roughness:.93}),paint=new THREE.MeshStandardMaterial({color:0x314740,roughness:.83}),red=new THREE.MeshStandardMaterial({color:0x703d35,roughness:.86}),brass=new THREE.MeshStandardMaterial({color:0x8e7548,metalness:.52,roughness:.64}),iron=new THREE.MeshStandardMaterial({color:0x404843,metalness:.43,roughness:.76}),black=new THREE.MeshStandardMaterial({color:0x242822,roughness:.9});
function mesh(parent,geo,mat,x=0,y=0,z=0){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m;}
function box(p,w,h,d,m,x,y,z){return mesh(p,new THREE.BoxGeometry(w,h,d),m,x,y,z);}
function rod(p,a,b,r,m){a=new THREE.Vector3(...a);b=new THREE.Vector3(...b);const d=b.clone().sub(a),q=mesh(p,new THREE.CylinderGeometry(r,r,d.length(),10),m,...a.clone().add(b).multiplyScalar(.5).toArray());q.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return q;}

export function evidenceStand(parent,id,x,z){
 const root=new THREE.Group();root.position.set(x,0,z);parent.add(root);root.userData.design=id;
 if(id==='bag'){
  // A worn reception desk: two drawers, shaped legs, dovetail corners and repaired top.
  for(const side of [-1,1]){const profile=[[.06,0],[.055,.12],[.035,.20],[.037,.57],[.060,.69]].map(p=>new THREE.Vector2(...p));for(const zz of [-.24,.24])mesh(root,new THREE.LatheGeometry(profile,12),wood,side*.40,.03,zz);}
  box(root,.94,.26,.57,paint,0,.84,0);box(root,1,.09,.65,wood,0,1.025,0);
  for(const side of [-1,1]){box(root,.43,.19,.025,wood,side*.235,.85,-.301);box(root,.28,.025,.025,brass,side*.235,.85,-.337);for(const x of [-.08,.08])box(root,.025,.052,.031,iron,side*.235+x,.85,-.322);}
  for(let i=0;i<7;i++)box(root,.008,.008,.50,black,-.42+i*.127,1.073,0);for(const side of [-1,1])for(const y of [.76,.83,.90])box(root,.043,.027,.05,wood,side*.47,y,-.28);
  const repair=box(root,.24,.012,.19,paint,.30,1.076,.15);repair.rotation.y=.06;
 }else if(id==='shoe'){
  // A narrow steel prize trolley with castors, wire rack and one bent handle.
  for(const xx of [-.42,.42])for(const zz of [-.24,.24]){rod(root,[xx,.13,zz],[xx,1.0,zz],.024,iron);const wheel=mesh(root,new THREE.CylinderGeometry(.065,.065,.038,14),black,xx,.067,zz);wheel.rotation.z=Math.PI/2;box(root,.07,.09,.05,brass,xx,.14,zz);}
  box(root,.99,.055,.65,iron,0,1.04,0);for(let i=0;i<8;i++){rod(root,[-.44,.30,-.26+i*.075],[.44,.30,-.26+i*.075],.009,iron);}
  for(const side of [-1,1]){rod(root,[side*.42,.30,-.25],[side*.42,.30,.25],.015,iron);rod(root,[side*.42,1.0,.26],[side*.42,1.20,.23],.022,brass);}rod(root,[-.42,1.20,.23],[.42,1.17,.23],.023,brass);
  for(let i=0;i<4;i++)box(root,.18,.008,.025,brass,-.34+i*.23,1.071,-.21);
 }else{
  // A reclaimed carnival cabinet, split door, carved scallops and a warped plinth.
  box(root,.93,.76,.57,red,0,.53,0);box(root,.99,.13,.64,wood,0,.12,0);box(root,1,.075,.65,wood,0,1.03,0);
  for(const side of [-1,1]){box(root,.40,.57,.035,paint,side*.22,.55,-.302);box(root,.018,.57,.020,brass,side*.38,.55,-.33);mesh(root,new THREE.SphereGeometry(.023,12,8),brass,side*.07,.59,-.355);}
  for(let i=0;i<6;i++){const arch=mesh(root,new THREE.TorusGeometry(.075,.014,6,14,Math.PI),brass,-.375+i*.15,.90,-.325);arch.rotation.z=Math.PI;}
  const brace=box(root,.055,.67,.028,wood,.18,.55,-.36);brace.rotation.z=.23;box(root,.43,.026,.034,black,-.22,.28,-.329);
 }
 return root;
}

export function maintenanceDetail(parent,x,z){
 // Reinforced tool bench, drawers, a shelf, bolted angle brackets and a compact vise.
 const root=new THREE.Group();root.position.set(x,0,z);parent.add(root);
 box(root,2.5,.075,.53,wood,0,.24,0);for(const xx of [-1.15,1.15]){box(root,.13,.78,.10,iron,xx,.50,-.23);box(root,.13,.78,.10,iron,xx,.50,.23);for(const y of [.32,.80])for(const zz of [-.30,.30])mesh(root,new THREE.SphereGeometry(.022,8,6),brass,xx,y,zz);}
 for(let i=0;i<3;i++){box(root,.45,.19,.038,paint,-.83+i*.48,.79,-.365);box(root,.16,.026,.025,brass,-.83+i*.48,.79,-.394);}
 box(root,.24,.07,.20,iron,-1.05,1.08,.0);for(const side of [-1,1])box(root,.09,.18,.14,iron,-1.05+side*.073,1.20,0);rod(root,[-1.25,1.13,0],[-.87,1.13,0],.013,brass);rod(root,[-1.25,1.04,0],[-1.25,1.24,0],.008,iron);
 return root;
}

export function lampFixture(index,color,dark){
 const root=new THREE.Group(),kind=index%5,drop=.22+index*.009+(index%3)*.11,radius=.13+(index%7)*.014,cap=new THREE.MeshStandardMaterial({color:new THREE.Color().setHSL(.095+index*.003,.18,.20+(index%4)*.022),metalness:.35,roughness:.7,side:THREE.DoubleSide});
 box(root,.019,drop,.019,black,0,-drop/2,0);const hanger=new THREE.Group();hanger.position.y=-drop;root.add(hanger);hanger.rotation.z=((index%5)-2)*.035;const bulbY=-.09;
 if(kind===0){mesh(hanger,new THREE.ConeGeometry(radius,.12,18,1,true),cap);mesh(hanger,new THREE.TorusGeometry(radius,.015,6,24),brass,0,-.055,0).rotation.x=Math.PI/2;}
 if(kind===1){mesh(hanger,new THREE.CylinderGeometry(radius*.72,radius*.9,.27,10,1,true),cap,0,-.07,0);for(let i=0;i<6;i++){const a=i/6*Math.PI*2;rod(hanger,[Math.sin(a)*radius*.75,-.24,Math.cos(a)*radius*.75],[Math.sin(a)*radius*.75,.09,Math.cos(a)*radius*.75],.008,brass);}for(const y of [-.22,.07])mesh(hanger,new THREE.TorusGeometry(radius*.76,.013,6,18),brass,0,y,0).rotation.x=Math.PI/2;}
 if(kind===2){mesh(hanger,new THREE.CylinderGeometry(radius*.8,radius*1.30,.075,20,1,true),cap,0,.02,0);const glass=mesh(hanger,new THREE.SphereGeometry(radius*.65,20,12),new THREE.MeshStandardMaterial({color:0xb3b797,transparent:true,opacity:.22,roughness:.34,depthWrite:false}),0,-.08,0);glass.scale.y=1.3;for(const side of [-1,1])rod(hanger,[side*radius,.02,0],[side*radius*.75,-.22,0],.008,iron);}
 if(kind===3){const shape=new THREE.Shape();for(let i=0;i<=40;i++){const a=i/40*Math.PI*2,r=radius*(1+.18*Math.cos(a*8));const x=Math.cos(a)*r,z=Math.sin(a)*r;i?shape.lineTo(x,z):shape.moveTo(x,z);}const shade=mesh(hanger,new THREE.ExtrudeGeometry(shape,{depth:.035,bevelEnabled:true,bevelThickness:.007,bevelSize:.007,bevelSegments:1}),cap);shade.rotation.x=Math.PI/2;mesh(hanger,new THREE.CylinderGeometry(.042,.06,.10,12),brass,0,.025,0);}
 if(kind===4){box(hanger,.08,.08,.08,cap,0,.0,0);for(const side of [-1,1]){const points=[new THREE.Vector3(side*.04,.015,0),new THREE.Vector3(side*.10,-.08,.015),new THREE.Vector3(side*.065,-.17,0)];mesh(hanger,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),12,.008,5,false),iron);}mesh(hanger,new THREE.TorusGeometry(radius,.008,5,20,Math.PI*1.35),cap,0,-.05,0).rotation.x=Math.PI/2;}
 const bulb=mesh(hanger,new THREE.SphereGeometry(.035+(index%4)*.004,12,8),new THREE.MeshBasicMaterial({color:dark?0x332c24:color}),0,bulbY,0);bulb.castShadow=false;
 return {root,bulb,hanger,drop,signature:`${kind}:${drop.toFixed(3)}:${radius.toFixed(3)}:${index}`,kind};
}
