import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.dirname(fileURLToPath(import.meta.url)),dist=path.join(root,'dist');
const stamp=execFileSync('git',['rev-parse','--short=12','HEAD'],{cwd:root,encoding:'utf8'}).trim();
fs.rmSync(dist,{recursive:true,force:true});fs.mkdirSync(dist,{recursive:true});
function publishable(source){const rel=path.relative(root,source).split(path.sep).join('/');return !source.split(path.sep).some(p=>p.startsWith('_'))&&rel!=='two-d/test.html'&&!rel.startsWith('two-d/art-review');}
for(const f of ['index.html','legacy.html','src','assets','audio','vendor','licenses','assetlib.js','surfaces.js','two-d'])fs.cpSync(path.join(root,f),path.join(dist,f),{recursive:true,filter:publishable});
const releaseStyle='<style data-release-ui>.test-return,.note,header>a,#ready,#checkpoint,#load,#ending-links,a[href*="test.html"],a[href*="art-review/"]{display:none!important}</style>';
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){
 const p=path.join(dir,e.name);if(e.isDirectory()){walk(p);continue;}if(!/\.(html|js|css)$/.test(p))continue;
 let s=fs.readFileSync(p,'utf8');
 if(e.name.endsWith('.html')){
  s=s.replace('<html lang="en">',`<html lang="en" data-build="${stamp}">`);
  s=s.replace(/((?:src|href)=["'])(\.{1,2}\/[^"'?#]+\.(?:js|css))(["'])/g,`$1$2?v=${stamp}$3`);
  if(path.dirname(p)===path.join(dist,'two-d')&&/^(index|level-\d+)\.html$/.test(e.name))s=s.replace('</head>',releaseStyle+'</head>');
 }
 s=s.replace(/((?:from|import)\s*\(?\s*['"])(\.{1,2}\/[^'"?]+\.js)(['"])/g,`$1$2?v=${stamp}$3`);
 fs.writeFileSync(p,s);
}}
walk(dist);fs.writeFileSync(path.join(dist,'.nojekyll'),'');
fs.writeFileSync(path.join(dist,'build.json'),JSON.stringify({commit:stamp},null,2));console.log(`Built Fright House ${stamp} into dist/`);
