'use strict';
// Pruebas del hito actual. No representan partidas de minijuegos aún inexistentes.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const child = require('node:child_process');
const { root, readJSON, clone, loadReference, validateProject } = require('./schema.js');
const png = require('./png.js');
const { removeBackground } = require('./chroma.js');
process.chdir(root);
let passed = 0;
function test(name, callback) { callback(); passed++; console.log(`OK · ${name}`); }
const reference = loadReference(), manifest = readJSON('tools/project.manifest.json'), project = readJSON('game.json');
function setup(pads, available = true) {
  const strings = {}, logs = [];
  const context = vm.createContext({ console: { info: message => logs.push(message) } });
  context.globalThis = context;
  if (available) context.navigator = { getGamepads: () => pads };
  vm.runInContext('globalThis.GLOMP = {};', context);
  for (const file of manifest.sources) vm.runInContext(fs.readFileSync(file, 'utf8'), context);
  const scene = {
    getObjects: name => [{ setString: text => { strings[name] = text; } }],
    getTimeManager: () => ({ getElapsedTime: () => 1000 / 60 }),
  };
  return { context, scene, strings, logs };
}
test('esquema real y referencia de versión', () => validateProject(project, reference, manifest));
test('rechazo de formato de evento distinto', () => {
  const invalid = clone(project); invalid.layouts[0].events[0].inlineCode = [];
  assert.throws(() => validateProject(invalid, reference, manifest));
});
test('rechazo de eventos visuales adicionales', () => {
  const invalid = clone(project); invalid.layouts[0].events.push({ type: 'BuiltinCommonInstructions::Standard' });
  assert.throws(() => validateProject(invalid, reference, manifest));
});
for (const count of [2, 6]) {
  test(`diagnóstico con ${count} mandos simulados`, () => {
    const pads = Array.from({ length: count }, (_, index) => ({ index, connected: true }));
    const { context, scene, strings } = setup(pads);
    context.GLOMP.config.maxPlayers = count;
    context.GLOMP.boot.onStart(scene);
    assert.equal(context.GLOMP.boot.diagnostics.connectedCount, count);
    assert(strings.BootStatus.includes(String(count)));
    assert.equal(context.GLOMP.boot.diagnostics.sixControllersVerified, false);
  });
}
test('mandos dispersos, desconectados y hot-plug', () => {
  const pads = [null, { index: 1, connected: true }, null, { index: 3, connected: false }];
  const { context, scene } = setup(pads);
  context.GLOMP.boot.onStart(scene);
  assert.equal(context.GLOMP.boot.diagnostics.connectedCount, 1);
  pads[5] = { index: 5, connected: true };
  context.GLOMP.boot.onTick(scene, 1);
  assert.equal(context.GLOMP.boot.diagnostics.connectedCount, 2);
  pads[1] = null;
  context.GLOMP.boot.onTick(scene, 1);
  assert.equal(context.GLOMP.boot.diagnostics.connectedCount, 1);
});
test('ausencia y error de la API de mandos', () => {
  const { context, scene, strings } = setup([], false);
  context.GLOMP.boot.onStart(scene);
  assert.equal(context.GLOMP.boot.diagnostics.apiAvailable, false);
  assert(strings.BootStatus.includes('no está disponible'));
  context.navigator = { getGamepads: () => { throw new Error('Prueba'); } };
  assert.doesNotThrow(() => context.GLOMP.boot.scanGamepads(scene));
});
for (const fps of [30, 144]) {
  test(`acumulador y logs estables a ${fps} fps`, () => {
    const { context, scene, logs } = setup([]);
    context.GLOMP.boot.onStart(scene);
    for (let tick = 0; tick < fps * 5; tick++) context.GLOMP.boot.onTick(scene, 1 / fps);
    assert.equal(logs.length, 1);
    assert(context.GLOMP.boot.pollElapsed >= 0 && context.GLOMP.boot.pollElapsed < 1);
    const elapsed = context.GLOMP.boot.pollElapsed;
    for (const dt of [NaN, Infinity, -1]) context.GLOMP.boot.onTick(scene, dt);
    assert.equal(context.GLOMP.boot.pollElapsed, elapsed);
  });
}
test('módulos se cargan una vez y no reinician el namespace por tick', () => {
  const { context, scene } = setup([]); context.runtimeScene = scene;
  vm.runInContext(project.layouts[0].events[0].inlineCode, context);
  const config = context.GLOMP.config;
  vm.runInContext(project.layouts[0].events[0].inlineCode, context);
  assert.equal(context.GLOMP.config, config);
  assert.equal(scene.__glompReady, true);
});
test('PNG RGBA: ida/vuelta y detección de corrupción', () => {
  const image = { width: 2, height: 2, rgba: Buffer.from([255,0,255,255, 80,80,80,128, 0,0,0,0, 255,255,255,255]) };
  const encoded = png.encode(image), decoded = png.decode(encoded);
  assert.deepEqual(decoded, image);
  const damaged = Buffer.from(encoded); damaged[20] ^= 1;
  assert.throws(() => png.decode(damaged), /CRC/);
});
test('chroma conserva magenta interior y transparencia exterior', () => {
  const rgba = Buffer.alloc(9 * 9 * 4);
  for (let i = 0; i < 81; i++) rgba.set([255, 0, 255, 255], i * 4);
  for (let y = 2; y <= 6; y++) for (let x = 2; x <= 6; x++) rgba.set([100,100,100,255], (y * 9 + x) * 4);
  rgba.set([255,0,255,255], (4 * 9 + 4) * 4);
  const result = removeBackground({ width: 9, height: 9, rgba });
  assert.equal(result.rgba[3], 0);
  assert.equal(result.rgba[(4 * 9 + 4) * 4 + 3], 255);
  assert.equal(result.rgba[(2 * 9 + 2) * 4 + 3], 255);
});
test('build y scaffold idempotentes', () => {
  const hash = () => crypto.createHash('sha256').update(fs.readFileSync('game.json')).digest('hex');
  const before = hash();
  const backups = () => fs.readdirSync(root).filter(file => file.startsWith('game.json.bak.')).length;
  const previousBackups = backups();
  for (const script of ['tools/build.js', 'tools/build.js', 'tools/scaffold.js']) child.execFileSync(process.execPath, [script]);
  assert.equal(hash(), before); assert.equal(backups(), previousBackups);
});
function game() {
  const store = {};
  const context = vm.createContext({ console, localStorage: { getItem: key => store[key] || null, setItem: (key, value) => { store[key] = value; } }, navigator: { getGamepads: () => [] } });
  context.globalThis = context;
  vm.runInContext('globalThis.GLOMP = {};', context);
  for (const file of manifest.sources) vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  context.GLOMP.save.load();
  return context.GLOMP;
}
test('todas las claves de i18n usadas por UI y sandbox existen', () => {
  const G = game(), used = new Set();
  for (const file of ['src/ui.js', 'src/sandbox.js', 'src/shop.js']) {
    for (const found of fs.readFileSync(file, 'utf8').matchAll(/\b(?:t|text|notify)\(\s*'([A-Za-z]+)'/g)) used.add(found[1]);
  }
  ['lobby', 'customize', 'shop', 'settings', 'credits'].forEach(name => used.add(`${name}Title`));
  G.config.art.bodyColors.forEach((_, index) => used.add(`color${index}`));
  G.config.art.faces.forEach((_, index) => used.add(`face${index}`));
  ['up', 'down', 'left', 'right', 'action'].forEach(key => used.add(key));
  const missing = [...used].filter(key => !G.i18n.es[key]);
  assert.deepEqual(missing, []);
});
for (const count of [2, 6]) {
  test(`sandbox con ${count} jugadores: física estable y dentro de la arena`, () => {
    const G = game();
    const world = G.sandbox.createWorld(Array.from({ length: count }, (_, index) => ({ source: { kind: index < 2 ? 'keyboard' : 'gamepad', index } })), 99);
    for (let tick = 0; tick < 60 * 30; tick++) {
      const controls = world.players.map((_, index) => ({ x: Math.cos(tick / 45 + index), y: Math.sin(tick / 31 + index), connected: true }));
      G.sandbox.advance(world, 1 / 30, controls);
      for (const player of world.players) assert(Number.isFinite(player.x) && player.x > 0 && player.x < world.size && player.y > 0 && player.y < world.size);
    }
    assert(world.players.every(player => player.mass > 0));
  });
}
test('sandbox idéntico a 30 y a 144 fps', () => {
  const position = fps => {
    const G = game(), world = G.sandbox.createWorld([{ source: { kind: 'keyboard', index: 0 } }], 7);
    for (let frame = 0; frame < fps * 5; frame++) G.sandbox.advance(world, 1 / fps, [{ x: 1, y: 0, connected: true }]);
    return world.players[0].x.toFixed(1);
  };
  assert.equal(position(30), position(144));
});
test('la tienda no modifica config y solo equipa lo comprado', () => {
  const G = game(), before = JSON.stringify(G.config);
  assert.equal(G.shop.equip('body3', 0), false);
  G.save.data.coins = 40;
  assert.equal(G.shop.buy('body3'), true);
  assert.equal(G.shop.buy('body3'), false);
  assert.equal(G.shop.equip('body3', 0), true);
  assert.equal(JSON.stringify(G.config), before);
});
console.log(`${passed} comprobaciones superadas (Hitos 0 y 0.5, sin render). Minijuegos y mandos físicos: pendientes, sin simular aceptación.`);
