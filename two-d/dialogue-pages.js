// Measure passages using the actual pixel font and available dialogue-box height.
export function createDialoguePages(box,node,button,writer){
 let pages=[],index=0,source='';
 box.dataset.paged='';
 function split(text){
  const sample=box.cloneNode(true);sample.hidden=false;sample.style.cssText+=';position:fixed!important;left:-10000px!important;top:0!important;bottom:auto!important;right:auto!important;visibility:hidden!important;max-height:none!important;height:auto!important;min-height:0!important;';sample.style.width=box.getBoundingClientRect().width+'px';
  const copy=sample.querySelector(node.id?'#'+node.id:'.story-text');
  const style=getComputedStyle(box),limit=style.maxHeight.endsWith('%')?box.parentElement.clientHeight*parseFloat(style.maxHeight)/100:parseFloat(style.maxHeight);
  box.parentElement.append(sample);const result=[];let page='';
  const fits=t=>{copy.textContent=t;return sample.getBoundingClientRect().height<=limit-2;};
  for(const paragraph of text.trim().split(/\n\s*\n/)){
   const combined=page?page+'\n\n'+paragraph:paragraph;
   if(fits(combined)){page=combined;continue;}
   if(page){result.push(page);page='';}
   for(const word of paragraph.split(/\s+/)){const next=page?page+' '+word:word;if(page&&!fits(next)){result.push(page);page=word;}else page=next;}
  }
  if(page)result.push(page);sample.remove();return result.length?result:[''];
 }
 function render(){node.textContent=pages[index];button.textContent='CONTINUE ▼';button.setAttribute('aria-label',index<pages.length-1?'Next passage':'Continue');box.dataset.page=String(index+1);box.dataset.pages=String(pages.length);box.scrollTop=0;writer.start(node,button);}
 function reflow(){if(!pages.length||box.hidden)return;pages=[...pages.slice(0,index),...split(pages.slice(index).join('\n\n'))];render();}
 let resizeFrame=0;window.addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(reflow);});document.fonts?.ready.then(reflow);
 return {show(text){source=text;pages=split(text);index=0;render();},next(){if(index>=pages.length-1)return false;index++;render();return true;},get current(){return pages[index]||'';},get source(){return source;},get multiple(){return pages.length>1;},snapshot(){return {page:index+1,pages:pages.length};}};
}
