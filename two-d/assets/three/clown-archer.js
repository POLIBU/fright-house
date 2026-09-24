// Approved original carnival archer: constructor geometry and named animation pivots.
export default function generate(T){
 const g=new T.Group();const mat=c=>new T.MeshStandardMaterial({color:c,roughness:.9});const red=mat(0x982b31),teal=mat(0x355b59),cream=mat(0xc4b78e),skin=mat(0xbdb295),dark=mat(0x221c1b),gold=mat(0x8c6438);
 function ball(parent,x,y,z,a,b,c,m){const o=new T.Mesh(new T.SphereGeometry(1,10,8),m);o.position.set(x,y,z);o.scale.set(a,b,c);parent.add(o);return o;}
 function rod(parent,a,b,r,m){const d=new T.Vector3().subVectors(b,a),o=new T.Mesh(new T.CylinderGeometry(r,r,d.length(),7),m);o.position.copy(a).addScaledVector(d,.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());parent.add(o);return o;}
 const v=(x,y,z)=>new T.Vector3(x,y,z);ball(g,0,.53,0,.22,.27,.14,teal);for(const side of [-1,1]){ball(g,side*.105,.24,0,.09,.17,.10,side<0?red:teal);ball(g,side*.115,.072,.065,.11,.072,.17,dark);ball(g,side*.16,.48,.09,.055,.22,.07,red);}for(let i=0;i<3;i++)ball(g,0,.41+i*.105,.15,.035,.035,.025,red);
 for(let i=0;i<12;i++){const a=i/12*Math.PI*2;ball(g,Math.cos(a)*.17,.78+Math.sin(a)*.013,Math.sin(a)*.11,.055,.04,.055,cream);}
 const head=new T.Group();head.name='head';head.position.y=.87;g.add(head);ball(head,0,.04,0,.135,.17,.115,skin);ball(head,0,.015,.129,.032,.03,.026,red);
 for(const side of [-1,1]){ball(head,side*.052,.075,.099,.043,.047,.02,dark);ball(head,side*.052,.073,.12,.017,.02,.012,cream);ball(head,side*.05,.071,.131,.008,.012,.007,dark);const brow=ball(head,side*.052,.114,.11,.045,.012,.011,dark);brow.rotation.z=side*.32;for(let j=0;j<9;j++){const curl=new T.Mesh(new T.TorusGeometry(.034,.013,5,8),red);curl.position.set(side*(.128+(j%3)*.021),-.047+Math.floor(j/3)*.077,.015+(j%3)*.025);curl.rotation.z=j*.7;head.add(curl);}}
 ball(head,0,-.052,.105,.077,.027,.029,dark);for(let i=0;i<6;i++)ball(head,(i-2.5)*.019,-.045+Math.sin(i)*.007,.133,.009,.013,.008,cream);
 for(let i=0;i<3;i++){const h=new T.Mesh(new T.CylinderGeometry(Math.max(.003,.075-(i+1)*.025),.075-i*.025,.066,9),i%2?teal:cream);h.position.set(-.025+i*.008,.228+i*.066,0);h.rotation.z=-.14;head.add(h);}ball(head,0,.398,0,.028,.028,.028,red);
 for(const side of [-1,1]){const arm=new T.Group();arm.name=side>0?'bow-arm':'draw-arm';arm.position.set(side*.2,.69,0);g.add(arm);ball(arm,side*.035,-.075,.055,.07,.12,.07,side>0?teal:red);ball(arm,side*.025,-.165,.09,.045,.045,.05,skin);}
 const bow=new T.Group();bow.name='bow';bow.position.set(.29,.69,.15);g.add(bow);const curve=new T.QuadraticBezierCurve3(v(0,-.25,0),v(.18,0,0),v(0,.25,0));bow.add(new T.Mesh(new T.TubeGeometry(curve,16,.014,5,false),gold));rod(bow,v(0,-.25,0),v(0,.25,0),.0025,cream);
 const bounds=new T.Box3().setFromObject(g),c=bounds.getCenter(new T.Vector3());for(const child of g.children){child.position.x-=c.x;child.position.y-=bounds.min.y;child.position.z-=c.z;}return g;
}
