'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const eventType = 'BuiltinCommonInstructions::JsCode';
const marker = name => `// GLOMP:INJECT scene=${name}`;
const readJSON = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const clone = object => JSON.parse(JSON.stringify(object));
const inlineSource = event => Array.isArray(event.inlineCode) ? event.inlineCode.join('\n') : event.inlineCode;
function assert(condition, message) { if (!condition) throw new Error(message); }
function compareShape(value, template, label) {
  assert(value !== null && typeof value === 'object' && !Array.isArray(value), `${label}: se esperaba objeto`);
  for (const [key, expected] of Object.entries(template)) {
    assert(Object.hasOwn(value, key), `${label}: falta ${key}`);
    const actual = value[key];
    assert(Array.isArray(expected) ? Array.isArray(actual) : typeof actual === typeof expected, `${label}.${key}: tipo distinto de la referencia`);
  }
}
function loadReference() {
  assert(fs.existsSync(path.join(root, 'reference/empty.json')), 'Falta reference/empty.json guardado desde GDevelop; no se inventará el formato');
  const provenance = readJSON('reference/provenance.json');
  for (const [file, hash] of Object.entries(provenance.files)) {
    assert(['empty.json', 'templates.json', 'multiline-event.json'].includes(file), 'Archivo de referencia no permitido');
    const actual = crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'reference', file))).digest('hex');
    assert(actual === hash, `reference/${file} cambió: detener y verificar el formato en el editor`);
  }
  const reference = readJSON('reference/empty.json');
  const multiline = readJSON('reference/multiline-event.json');
  assert(JSON.stringify(multiline.gdVersion) === JSON.stringify(reference.gdVersion), 'La muestra multilínea pertenece a otra versión');
  assert(multiline.event.type === eventType && Array.isArray(multiline.event.inlineCode) && multiline.event.inlineCode.length > 1 && multiline.event.inlineCode.every(line => typeof line === 'string'), 'La muestra nativa multilínea no es válida');
  assert(reference.gdVersion?.major === 5, 'La referencia no pertenece a GDevelop 5');
  const scene = reference.layouts?.find(scene => scene.name === 'Boot');
  assert(scene && scene.events?.length === 1, 'La referencia debe tener Boot con un único JsCode');
  const event = scene.events[0];
  assert(event.type === eventType && typeof event.inlineCode === 'string', 'El formato JsCode no coincide con la referencia documentada');
  assert(event.inlineCode.split('\n')[0] === marker('Boot'), 'La referencia no contiene el marcador Boot');
  assert(Array.isArray(scene.layers) && Array.isArray(scene.objects) && Array.isArray(scene.instances), 'Falta estructura de escena en la referencia');
  return reference;
}
function validateProject(project, reference, manifest) {
  compareShape(project, reference, 'proyecto');
  assert(JSON.stringify(project.gdVersion) === JSON.stringify(reference.gdVersion), 'Versión de formato distinta; detener y verificar en el editor');
  assert(project.firstLayout === 'Boot', 'Boot debe ser la primera escena');
  const names = project.layouts.map(scene => scene.name);
  assert(new Set(names).size === names.length, 'Hay escenas duplicadas');
  const sceneTemplate = reference.layouts.find(scene => scene.name === 'Boot');
  for (const expected of manifest.scenes) {
    const scene = project.layouts.find(scene => scene.name === expected.name);
    assert(scene, `Falta la escena ${expected.name}`);
  }
  for (const scene of project.layouts) {
    compareShape(scene, sceneTemplate, `escena ${scene.name}`);
    assert(scene.events.length === 1, `${scene.name}: debe tener exactamente un evento`);
    const event = scene.events[0];
    const source = inlineSource(event);
    assert(!Array.isArray(event.inlineCode) || event.inlineCode.every(line => typeof line === 'string'), `${scene.name}: líneas de código no válidas`);
    compareShape(Object.assign({}, event, { inlineCode: source }), sceneTemplate.events[0], `JsCode de ${scene.name}`);
    assert(Object.keys(event).every(key => Object.hasOwn(sceneTemplate.events[0], key)), `${scene.name}: campos de evento no verificados`);
    assert(event.type === eventType, `${scene.name}: tipo de evento no permitido`);
    assert(source.split('\n')[0] === marker(scene.name), `${scene.name}: marcador ausente o incorrecto`);
    assert(!event.parameterObjects && event.useStrict === true, `${scene.name}: parámetros JsCode distintos de la referencia`);
    assert(scene.layers.some(layer => layer.name === ''), `${scene.name}: falta capa base`);
    const objects = [...project.objects, ...scene.objects];
    assert(new Set(objects.map(object => object.name)).size === objects.length, `${scene.name}: objetos duplicados`);
    for (const instance of scene.instances) {
      assert(objects.some(object => object.name === instance.name), `${scene.name}: instancia de objeto inexistente`);
      assert(scene.layers.some(layer => layer.name === instance.layer), `${scene.name}: instancia en capa inexistente`);
    }
  }
}
module.exports = { root, eventType, marker, readJSON, clone, assert, compareShape, loadReference, validateProject };
