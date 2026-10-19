'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { root, marker, readJSON, assert, loadReference, validateProject } = require('./schema.js');
function compose(manifest, scene) {
  const sources = manifest.sources.map(file => {
    assert(/^src\/[a-z0-9_/.]+\.js$/.test(file) && !file.includes('..'), 'Ruta de módulo inválida');
    const code = fs.readFileSync(path.join(root, file), 'utf8');
    new vm.Script(code, { filename: file });
    return `// Módulo: ${file}\n${code.trim()}`;
  });
  const output = `${marker(scene.name)}\n// Generado por tools/build.js. Editar src/, no este evento.\nglobalThis.GLOMP = globalThis.GLOMP || {};\nif (!GLOMP.__loaded) {\n${sources.join('\n\n')}\nGLOMP.__loaded = true;\n}\n${scene.dispatcher}\n`;
  new vm.Script(output, { filename: scene.name });
  return output;
}
function main() {
  const reference = loadReference(), manifest = readJSON('tools/project.manifest.json'), game = readJSON('game.json');
  validateProject(game, reference, manifest);
  for (const scene of manifest.scenes) game.layouts.find(layout => layout.name === scene.name).events[0].inlineCode = compose(manifest, scene);
  validateProject(game, reference, manifest);
  const file = path.join(root, 'game.json'), before = fs.readFileSync(file, 'utf8'), after = JSON.stringify(game, null, 2) + '\n';
  if (before === after) { console.log('Build sin cambios (idempotente)'); return; }
  fs.copyFileSync(file, `${file}.bak.${Date.now()}.${crypto.randomUUID()}`);
  fs.writeFileSync(`${file}.tmp`, after); fs.renameSync(`${file}.tmp`, file);
  console.log(`Build: ${manifest.sources.length} módulos, ${manifest.scenes.length} escena(s); copia de seguridad creada`);
}
if (require.main === module) { try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; } }
module.exports = { compose, main };
