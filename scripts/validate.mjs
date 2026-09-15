import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const root = new URL('../', import.meta.url).pathname;
const dist = path.join(root, 'dist');
const errors = [];
for (const file of ['index.html']) {
 const html = fs.readFileSync(path.join(dist, file), 'utf8');
 const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
 if(new Set(ids).size !== ids.length) errors.push(`${file}: duplicate ids`);
 for(const m of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  const url=m[1];if(/^(https?:|data:|mailto:|javascript:)/.test(url)) continue;
  const rel=url.split(/[?#]/)[0];if(rel&&!fs.existsSync(path.resolve(dist,rel))) errors.push(`${file}: missing ${url}`);
 }
 for(const m of html.matchAll(/href="#([^"]+)"/g)) if(!ids.includes(m[1])) errors.push(`${file}: broken anchor ${m[1]}`);
}
const css = fs.readFileSync(path.join(dist,'style.css'),'utf8');
for(const m of css.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g)) if(!fs.existsSync(path.resolve(dist,m[1])))errors.push(`missing CSS asset ${m[1]}`);
execFileSync(process.execPath,['--check',path.join(dist,'app.js')]);
const config=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));
if(config.outputDirectory!=='dist'||config.framework!==null) errors.push('Unexpected Vercel static configuration');
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log('Validated public page, assets, anchors, JS syntax and Vercel configuration.');
