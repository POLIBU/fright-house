import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.dirname(fileURLToPath(import.meta.url)),dist=path.join(root,'dist');
const stamp=execFileSync('git',['rev-parse','--short=12','HEAD'],{cwd:root,encoding:'utf8'}).trim();
fs.rmSync(dist,{recursive:true,force:true});fs.mkdirSync(dist,{recursive:true});
function publishable(source){const rel=path.relative(root,source).split(path.sep).join('/');return !source.split(path.sep).some(p=>p.startsWith('_'))&&rel!=='two-d/test.html'&&!rel.startsWith('two-d/art-review');}
for(const f of ['legacy.html','src','assets','audio','vendor','licenses','assetlib.js','surfaces.js'])fs.cpSync(path.join(root,f),path.join(dist,f),{recursive:true,filter:publishable});
// Publish the current game directly at the site root; source files stay in two-d.
fs.cpSync(path.join(root,'two-d'),dist,{recursive:true,filter:publishable});
const releaseStyle='<style data-release-ui>.test-return,.note,header>a,#ready,#checkpoint,#load,#ending-links,a[href*="test.html"],a[href*="art-review/"]{display:none!important}</style>';
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){
 const p=path.join(dir,e.name);if(e.isDirectory()){walk(p);continue;}if(!/\.(html|js|css)$/.test(p))continue;
 let s=fs.readFileSync(p,'utf8');
 // Rebase only source-game references that originally reached shared root files.
 const rel=path.relative(dist,p),source=path.join(root,'two-d',rel);
 if(fs.existsSync(source))s=s.replace(/(["'`(])(\.\.\/[^"'`\s)<>]+)/g,(match,quote,reference)=>{
  const [pathname,...suffix]=reference.split(/(?=[?#])/),resolved=path.resolve(path.dirname(source),pathname);
  if(resolved.startsWith(path.join(root,'two-d')+path.sep))return match;
  const target=path.join(dist,path.relative(root,resolved));
  let rebased=path.relative(path.dirname(p),target).split(path.sep).join('/');
  if(!rebased.startsWith('.'))rebased='./'+rebased;
  return quote+rebased+suffix.join('');
 });
 if(e.name.endsWith('.html')){
  s=s.replace('<html lang="en">',`<html lang="en" data-build="${stamp}">`);
  s=s.replace(/((?:src|href)=["'])(\.{1,2}\/[^"'?#]+\.(?:js|css))(["'])/g,`$1$2?v=${stamp}$3`);
  if(path.dirname(p)===dist&&/^(index|level-\d+)\.html$/.test(e.name))s=s.replace('</head>',releaseStyle+'</head>');
 }
 s=s.replace(/((?:from|import)\s*\(?\s*['"])(\.{1,2}\/[^'"?]+\.js)(['"])/g,`$1$2?v=${stamp}$3`);
 fs.writeFileSync(p,s);
}}
walk(dist);
// Preserve old bookmarks while moving every game page to its clean root URL.
const oldPages=path.join(dist,'two-d');fs.mkdirSync(oldPages,{recursive:true});
for(const name of fs.readdirSync(path.join(root,'two-d')).filter(name=>name.endsWith('.html')&&name!=='test.html')){
 const target=name==='index.html'?'../':'../'+name;
 fs.writeFileSync(path.join(oldPages,name),`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Fright House</title><meta http-equiv="refresh" content="0;url=${target}"></head><body><a href="${target}">PLAY FRIGHT HOUSE</a><script>location.replace(${JSON.stringify(target)}+location.search+location.hash);</script></body></html>`);
}
fs.writeFileSync(path.join(dist,'.nojekyll'),'');
fs.writeFileSync(path.join(dist,'build.json'),JSON.stringify({commit:stamp},null,2));console.log(`Built Fright House ${stamp} into dist/`);
