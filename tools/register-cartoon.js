'use strict';
// Los originales previos se conservan; este índice selecciona la nueva dirección cartoon.
const fs=require('node:fs'),vm=require('node:vm'),crypto=require('node:crypto'),png=require('./png.js');
require('./register-illustrated.js');
const context={GLOMP:{}};vm.runInNewContext(fs.readFileSync('src/art.js','utf8'),context);
const art=context.GLOMP.art,manifest=JSON.parse(fs.readFileSync('assets/manifest.json','utf8'));
const jobs=JSON.parse(fs.readFileSync('assets/cartoon/prompts.json','utf8'));
for(const id of ['slime-base-chatgpt-v1','face-eye','mouth-smile','mouth-gasp','mouth-grit','mouth-cheer'])delete art[id];
const aliases={'cartoon-village':'menu-village','cartoon-podium':'ui-podium','cartoon-button':'ui-button','cartoon-panel':'ui-panel','cartoon-ribbon':'ui-ribbon'};
for(const job of jobs) {
  if(!fs.existsSync(job.path))throw new Error('Falta terminar el asset: '+job.path);
  const image=png.read(job.path);let x0=image.width,y0=image.height,x1=0,y1=0;
  if(job.transparent)for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++)if(image.rgba[(y*image.width+x)*4+3]>96){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
  const bounds=job.transparent?{x:x0,y:y0,width:x1-x0+1,height:y1-y0+1}:null;
  const record={id:job.id,file:job.path,prompt:job.prompt,references:job.references,width:image.width,height:image.height,bounds:bounds,provider:'openai-built-in',model:'image_gen',status:'generated',milestone:'cartoon-panorama',sha256:crypto.createHash('sha256').update(fs.readFileSync(job.path)).digest('hex')};
  const found=manifest.assets.findIndex(a=>a.id===job.id);if(found<0)manifest.assets.push(record);else manifest.assets[found]=record;
  let id=aliases[job.id]||job.id;
  if(id.startsWith('cartoon-map-'))id=id.slice(8);
  if(/^cartoon-(candy|cooking|slimegarden)-/.test(id))id='map-'+id.slice(8);
  art[id]={file:job.path,bounds:bounds};
}
fs.writeFileSync('assets/manifest.json',JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync('src/art.js','// Arte cartoon activo: base, escenarios 16:9 y piezas con transparencia.\nGLOMP.art = '+JSON.stringify(art,null,2)+';\n');
const project=JSON.parse(fs.readFileSync('tools/project.manifest.json','utf8'));project.resources=Object.values(art).map(a=>a.file).concat('assets/fonts/LilitaOne-Regular.ttf');
fs.writeFileSync('tools/project.manifest.json',JSON.stringify(project,null,2)+'\n');console.log(Object.keys(art).length+' imágenes activas, cuerpo cartoon y mapas horizontales.');
