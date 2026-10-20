'use strict';
// Registra originales sin alterar píxeles; calcula únicamente sus límites alfa.
const fs=require('node:fs'),crypto=require('node:crypto'),png=require('./png.js');
const manifest=JSON.parse(fs.readFileSync('assets/manifest.json','utf8'));
const jobs=JSON.parse(fs.readFileSync('assets/illustrated/prompts.json','utf8')).concat(JSON.parse(fs.readFileSync('assets/illustrated/cosmetic-prompts.json','utf8')));
const art={};
for(const id of ['slime-base-chatgpt-v1','title-glomp','menu-village','food-bite','banner-original']) {
  const a=manifest.assets.find(a=>a.id===id);art[id]={file:a.file,bounds:a.bounds||null};
}
const maps=['candy','cooking','slimegarden'];
const records=jobs.map(a=>({id:a.id.replace('/','-'),file:a.path,prompt:a.prompt,transparent:a.transparent,provider:'openai-built-in',model:'image_gen',status:'generated'}));
for(const name of maps)records.push({id:'map-'+name,file:'assets/illustrated/maps/'+name+'.png',reference:'samples/maps/map-'+(name==='slimegarden'?'slime':name)+'.png',provider:'user-reference',status:'integrated-original',transparent:false});
for(const record of records) {
  if(record.id==='maps-lava')record.id='map-lava';
  if(record.id.startsWith('face-mouth-'))record.id=record.id.slice(5);
  const image=png.read(record.file);let minX=image.width,minY=image.height,maxX=0,maxY=0;
  if(record.transparent)for(let y=0;y<image.height;y++)for(let x=0;x<image.width;x++)if(image.rgba[(y*image.width+x)*4+3]>96){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);}
  const bounds=record.transparent?{x:minX,y:minY,width:maxX-minX+1,height:maxY-minY+1}:null;
  const asset=Object.assign({},record,{width:image.width,height:image.height,bounds,sha256:crypto.createHash('sha256').update(fs.readFileSync(record.file)).digest('hex'),milestone:'illustrated-rework'});
  const index=manifest.assets.findIndex(a=>a.id===asset.id);if(index<0)manifest.assets.push(asset);else manifest.assets[index]=asset;
  art[asset.id]={file:asset.file,bounds:bounds};
}
fs.writeFileSync('assets/manifest.json',JSON.stringify(manifest,null,2)+'\n');
fs.writeFileSync('src/art.js','// Arte ilustrado activo. Los PNG anteriores se conservan como historial.\nGLOMP.art = '+JSON.stringify(art,null,2)+';\n');
const project=JSON.parse(fs.readFileSync('tools/project.manifest.json','utf8'));
project.resources=Object.values(art).map(a=>a.file).concat('assets/fonts/LilitaOne-Regular.ttf');
fs.writeFileSync('tools/project.manifest.json',JSON.stringify(project,null,2)+'\n');
console.log(Object.keys(art).length+' imágenes ilustradas activas y una fuente local.');
