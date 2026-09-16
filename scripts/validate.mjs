import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const root = new URL('../', import.meta.url).pathname;
const dist = path.join(root, 'dist');
const errors = [];
for (const file of ['index.html', 'guide/index.html']) {
 const html = fs.readFileSync(path.join(dist, file), 'utf8');
 const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
 if(new Set(ids).size !== ids.length) errors.push(`${file}: duplicate ids`);
 for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  const url=m[1];if(/^(https?:|data:|mailto:|tel:)/.test(url)) continue;
  const rel=url.split(/[?#]/)[0];const local=path.resolve(dist,path.dirname(file),rel);
  if(rel&&!fs.existsSync(local)) errors.push(`${file}: missing ${url}`);
  if(url.includes('#') && rel && fs.existsSync(local)) {
   const target=fs.statSync(local).isDirectory()?path.join(local,'index.html'):local;
   const id=url.split('#')[1];
   if(id&&!fs.readFileSync(target,'utf8').includes(`id="${id}"`)) errors.push(`${file}: missing target ${url}`);
  }
 }
 for(const m of html.matchAll(/href="#([^"]+)"/g)) if(!ids.includes(m[1])) errors.push(`${file}: broken anchor ${m[1]}`);
}
const css = ['style.css','trust.css'].map(file=>fs.readFileSync(path.join(dist,file),'utf8')).join('\n');
for(const m of css.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)) if(!fs.existsSync(path.resolve(dist,m[1])))errors.push(`missing CSS asset ${m[1]}`);
execFileSync(process.execPath,['--check',path.join(dist,'app.js')]);
const siteConfig=path.join(root,'.openai/hosting.json');
if(fs.existsSync(siteConfig)) {
 const config=JSON.parse(fs.readFileSync(siteConfig,'utf8'));
 if(config.project_id!=='appgprj_6aa8eb4e84888191998a0ba2320b16ae'||config.static.directory!=='dist') errors.push('Site identity/static directory changed');
} else {
 const config=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));
 if(config.outputDirectory!=='dist') errors.push('Vercel output directory changed');
}
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
for (const file of ['index.html','guide/index.html']) {
 const html=fs.readFileSync(path.join(dist,file),'utf8');
 for (const required of ['ドレッドノート株式会社','NPO法人DANKAIプロジェクト','167-0041','東京都杉並区善福寺2-24-8','03-6336-7291','tel:+81363367291']) {
  if(!html.includes(required)) throw new Error(`${file}: missing operational information ${required}`);
 }
 if(/<form\b|<input\b/.test(html)) throw new Error(`${file}: unexpected collection form`);
}
const home=fs.readFileSync(path.join(dist,'index.html'),'utf8');
if(!home.includes('その人の「できる」が、')||!home.includes('誰かのうれしいになる。')) throw new Error('Missing approved headline');
console.log('Validated 2 public routes, assets, cross-page anchors, JS syntax, operations information, headline and hosting configuration.');
