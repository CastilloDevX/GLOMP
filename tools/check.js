'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { root, readJSON, assert, loadReference, validateProject } = require('./schema.js');
const { compose } = require('./build.js');
const png = require('./png.js');
function main() {
  const reference = loadReference(), manifest = readJSON('tools/project.manifest.json'), game = readJSON('game.json');
  validateProject(game, reference, manifest);
  const templates = readJSON('reference/templates.json');
  for (const scene of game.layouts) {
    new vm.Script(scene.events[0].inlineCode, { filename: scene.name });
    const spec = manifest.scenes.find(spec => spec.name === scene.name);
    assert(spec, `Escena sin despachador en manifest: ${scene.name}`);
    assert(scene.events[0].inlineCode === compose(manifest, spec), `${scene.name}: build desactualizado`);
    for (const object of scene.objects) {
      const template = templates.objects.find(template => template.type === object.type);
      assert(template, `Objeto sin plantilla verificada: ${object.name}`);
      for (const [key, value] of Object.entries(template)) {
        assert(Object.hasOwn(object, key) && (Array.isArray(value) ? Array.isArray(object[key]) : typeof object[key] === typeof value), `${object.name}: formato distinto en ${key}`);
      }
    }
  }
  for (const resource of game.resources.resources) {
    if (!resource.file) continue;
    assert(resource.file.startsWith('assets/') && !resource.file.includes('..'), `Ruta de recurso inválida: ${resource.name}`);
    assert(fs.existsSync(path.join(root, resource.file)), `Recurso inexistente: ${resource.file}`);
    if(resource.kind==='font') {
      const template=readJSON('reference/font-resource.json').resource;
      for(const key of Object.keys(template))assert(Object.hasOwn(resource,key)&&typeof resource[key]===typeof template[key],`Formato de fuente distinto: ${key}`);
    }
  }
  const context = vm.createContext({ globalThis: {} });
  context.globalThis = context;
  vm.runInContext('globalThis.GLOMP = {};', context);
  for (const file of manifest.sources) vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
  assert(context.GLOMP.config.maxPlayers >= 2 && context.GLOMP.config.maxPlayers <= 6, 'maxPlayers fuera de rango');
  const allAssets = readJSON('assets/manifest.json').assets;
  for (const [id,asset] of Object.entries(context.GLOMP.art)) {
    const resource = game.resources.resources.find(resource => resource.name === asset.file);
    assert(resource, 'Asset sin registrar en GDevelop: ' + id);
    if (asset.pixel) assert(resource.smoothed === false, 'Pixel art con suavizado: ' + id);
    if (asset.bounds) {
      const recorded = allAssets.find(recorded => recorded.file === asset.file), b = asset.bounds;
      assert(recorded && b.width > 0 && b.height > 0 && b.x >= 0 && b.y >= 0 && b.x + b.width <= recorded.width && b.y + b.height <= recorded.height, 'Recorte de asset inválido: ' + id);
    }
  }
  assert(game.properties.windowWidth === context.GLOMP.config.ui.width && game.properties.windowHeight === context.GLOMP.config.ui.height, 'Resolución desincronizada entre proyecto y UI');
  for (const asset of allAssets) {
    const file = path.join(root, asset.file);
    if (['planned', 'blocked_quota', 'blocked_provider'].includes(asset.status)) continue;
    assert(fs.existsSync(file), `Falta asset generado: ${asset.id}`);
    const image = png.read(file);
    assert(image.width === asset.width && image.height === asset.height, `Dimensiones incorrectas: ${asset.id}`);
  }
  console.log(`Check OK: formato GDevelop ${reference.gdVersion.major}.${reference.gdVersion.minor}.${reference.gdVersion.build}, ${game.layouts.length} escena(s), JS válido y assets existentes`);
  console.log('La apertura, los seis mandos físicos y la aceptación humana se verifican aparte.');
}
try { main(); } catch (error) { console.error(`Check FALLÓ: ${error.message}`); process.exitCode = 1; }
