'use strict';
// Se clonan plantillas serializadas por GDevelop; nunca se inventa el árbol de eventos.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { root, marker, readJSON, clone, assert, loadReference, validateProject } = require('./schema.js');
function main() {
  const reference = loadReference();
  const manifest = readJSON('tools/project.manifest.json');
  const templates = readJSON('reference/templates.json');
  const gamePath = path.join(root, 'game.json');
  const exists = fs.existsSync(gamePath);
  const game = exists ? readJSON('game.json') : clone(reference);
  if (exists) validateProject(game, reference, { scenes: [] });
  Object.assign(game.properties, manifest.project);
  game.firstLayout = 'Boot';
  for (const specification of manifest.scenes) {
    let scene = game.layouts.find(scene => scene.name === specification.name);
    if (!scene) {
      scene = clone(reference.layouts[0]);
      scene.name = specification.name; scene.mangledName = specification.name;
      scene.events[0].inlineCode = marker(specification.name);
      scene.objects = []; scene.instances = [];
      game.layouts.push(scene);
    }
    Object.assign(scene, specification.background);
    for (const spec of specification.texts || []) {
      const template = templates.objects.find(object => object.type === 'TextObject::Text');
      assert(template, 'Falta plantilla de texto obtenida del editor');
      let object = scene.objects.find(object => object.name === spec.name);
      if (!object) { object = clone(template); object.name = spec.name; scene.objects.push(object); }
      Object.assign(object, { string: '', characterSize: spec.size, bold: !!spec.bold, color: { r: spec.color[0], g: spec.color[1], b: spec.color[2] } });
      Object.assign(object.content, { text: '', characterSize: spec.size, bold: !!spec.bold, color: spec.color.join(';') });
      let instance = scene.instances.find(instance => instance.name === spec.name);
      if (!instance) {
        instance = clone(templates.instance); instance.name = spec.name;
        const hex = crypto.createHash('sha256').update(`${scene.name}/${spec.name}`).digest('hex');
        instance.persistentUuid = `${hex.slice(0,8)}-${hex.slice(8,12)}-4${hex.slice(13,16)}-8${hex.slice(17,20)}-${hex.slice(20,32)}`;
        scene.instances.push(instance);
      }
      Object.assign(instance, { x: spec.x, y: spec.y });
    }
  }
  validateProject(game, reference, manifest);
  const text = JSON.stringify(game, null, 2) + '\n';
  if (exists && fs.readFileSync(gamePath, 'utf8') === text) { console.log('Scaffold sin cambios'); return; }
  if (exists) fs.copyFileSync(gamePath, `${gamePath}.bak.${Date.now()}.${crypto.randomUUID()}`);
  fs.writeFileSync(`${gamePath}.tmp`, text); fs.renameSync(`${gamePath}.tmp`, gamePath);
  console.log(`Scaffold: ${manifest.scenes.length} escena(s), hito ${manifest.milestone}`);
}
try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
