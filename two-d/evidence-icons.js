import {drawHighlightedSprite} from './item-highlight.js';
// Small, deliberately ordinary floor objects; no attack-warning flashes.
function drawEvidenceShape(c,item,x,y,scale=1){c.save();c.translate(x,y);c.scale(scale,scale);c.lineWidth=1.5;c.strokeStyle='#bfb9a1';c.fillStyle='#8d9998';switch(item.kind){case 'glasses':c.strokeRect(-7,-2,5,4);c.strokeRect(2,-2,5,4);c.beginPath();c.moveTo(-2,0);c.lineTo(2,0);c.stroke();break;case 'knife':c.fillStyle='#554131';c.fillRect(-7,-1,6,3);c.fillStyle='#bfc7c4';c.beginPath();c.moveTo(-1,-1);c.lineTo(8,-1);c.lineTo(5,2);c.lineTo(-1,2);c.fill();break;case 'photo':c.fillStyle='#c6bda6';c.fillRect(-5,-5,10,10);c.fillStyle='#4a4b43';c.fillRect(-3,-3,6,5);break;case 'ribbon':c.fillStyle='#822c34';c.fillRect(-5,-2,4,4);c.fillRect(1,-2,4,4);c.fillRect(-1,0,2,7);break;case 'key':case 'tag':c.strokeRect(-5,-4,5,5);c.fillRect(-1,0,7,2);c.fillRect(4,1,2,3);break;case 'bracelet':case 'watch':c.beginPath();c.ellipse(0,0,5,3,.5,0,7);c.stroke();if(item.kind==='watch')c.fillRect(-2,-2,4,4);break;case 'button':c.beginPath();c.arc(0,0,3,0,7);c.fill();c.fillStyle='#333';c.fillRect(-1,-1,1,1);c.fillRect(1,1,1,1);break;case 'shoe':c.fillStyle='#71513a';c.fillRect(-5,-1,10,5);c.fillRect(-4,-5,4,6);break;default:c.fillStyle='#506786';c.fillRect(-4,-4,7,8);c.fillRect(3,-1,3,4);}c.restore();}

const evidenceSprites=new Map();
export function drawEvidence(c,item,x,y,scale=1,highlight=false,time=0){
 if(!highlight){drawEvidenceShape(c,item,x,y,scale);return;}
 let sprite=evidenceSprites.get(item.kind);
 if(!sprite){sprite=document.createElement('canvas');sprite.width=sprite.height=32;drawEvidenceShape(sprite.getContext('2d'),item,16,16);evidenceSprites.set(item.kind,sprite);}
 drawHighlightedSprite(c,sprite,x-16*scale,y-16*scale,32*scale,32*scale,time);
}
