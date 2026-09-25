// Match the dialogue's local pixel font while preserving each scene's title fade.
export function drawPixelTitle(ctx,text,alpha=1){
 ctx.save();ctx.globalAlpha=alpha;ctx.font='84px FrightPixel, monospace';
 ctx.textAlign='center';ctx.textBaseline='middle';
 ctx.fillStyle='#181419';ctx.fillText(text,243,184,420);
 ctx.fillStyle='#f4f0e7';ctx.fillText(text,240,180,420);ctx.restore();
}
