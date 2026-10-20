'use strict';
// Pruebas automáticas de infraestructura, modos y flujos; no sustituyen partidas humanas.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');

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
  require('./build.js').main(); require('./build.js').main(); require('./scaffold.js').main();
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
    for (const found of fs.readFileSync(file, 'utf8').matchAll(/\b(?:t|text|notify)\(\s*'([A-Za-z]+)'\s*(?:\)|,)/g)) used.add(found[1]);
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
console.log(`${passed} comprobaciones de infraestructura y física superadas.`);
// Regresiones de la sala y del ciclo real de rondas.
function participants(count) { return Array.from({length:count},(_,index)=>({source:{kind:'gamepad',index},color:index % 8})); }
function stationary(count) { return Array.from({length:count},()=>({x:0,y:0,connected:true,action:false})); }
function forceMode(G,mode,count,seed=51) {
  const w=G.maps.create(participants(count),mode==='war'?'lava':'candy',seed);w.mode=mode;G.minigames[mode].start(w);return w;
}
test('cada teclado confirma controles antes de ocupar una plaza y confirma su color',()=>{
  const G=game();G.ui.join({kind:'keyboard',index:0});assert.equal(G.ui.lobby.length,0);assert.equal(G.ui.pendingSource.index,0);
  G.ui.join({kind:'keyboard',index:0},true);G.ui.join({kind:'keyboard',index:1},true);
  assert.equal(G.ui.canStart(),false);G.ui.lobby.forEach(p=>{p.ready=true;p.colorConfirmed=true;});assert.equal(G.ui.canStart(),true);
  G.ui.changeColor(G.ui.lobby[1],1);assert.equal(G.ui.canStart(),false);assert.equal(G.ui.lobby[0].ready,true);
  G.ui.join({kind:'gamepad',index:0});assert.equal(G.ui.lobby.length,2);
});
test('el color de cada participante se conserva en cada ronda sin alterar mecánicas',()=>{
  const G=game(), before=JSON.stringify(G.config), ps=participants(2);ps[0].color=2;ps[1].color=5;
  const m=G.match.create(ps,12);
  for(let n=0;n<8;n++){assert.equal(m.world.players[0].bodyColor,'body2');assert.equal(m.world.players[1].bodyColor,'body5');G.match.next(m);}
  assert.equal(JSON.stringify(G.config),before);
  const a=G.player.create(0,ps[0].source,300,300),b=G.player.create(1,ps[1].source,600,300);a.bodyColor='body2';b.bodyColor='body5';G.player.refresh(a);G.player.refresh(b);assert.equal(a.radius,b.radius);assert.equal(a.speed,b.speed);
});
test('cámara de presentación y bloqueo de simulación hasta GLOMP',()=>{
  const G=game(),m=G.match.create(participants(2),12),p=m.world.players[0],x=p.x,y=p.y;
  const start=G.hud.camera(m);m.phaseElapsed=G.config.round.cinematicSeconds;const end=G.hud.camera(m);assert(start.scale>end.scale);assert(Math.abs(end.scale-Math.min(1920/m.world.width,1080/m.world.height))<1e-9);m.phaseElapsed=0;
  const controls=[{x:1,y:1,connected:true,action:true},{x:-1,y:-1,connected:true}];let steps=0;
  while(m.phase!=='playing'&&steps++<1000){G.match.advance(m,1/60,controls);assert.equal(m.world.elapsed,0);assert.equal(p.x,x);assert.equal(p.y,y);}
  assert.equal(m.phase,'playing');G.match.advance(m,1/60,controls);assert.notEqual(p.x,x);
});
test('reparto se aplica una sola vez y la siguiente ronda cambia de modo y de mapa',()=>{
  const G=game(),m=G.match.create(participants(2),70),previous=m.world.mode,theme=m.world.theme;
  const before=G.save.data.coins;G.match.finishRound(m);const after=G.save.data.coins;assert(after>before);G.match.finishRound(m);assert.equal(G.save.data.coins,after);
  for(let i=0;i<600&&m.round===1;i++)G.match.advance(m,1/60,stationary(2));assert.equal(m.round,2);assert.notEqual(m.world.mode,previous);assert.notEqual(m.world.theme,theme);assert.equal(m.phase,'intro');
});
test('primero en cinco rebanadas termina la copa y todos reciben Glomps',()=>{
  const G=game(),m=G.match.create(participants(6),4);m.participants[0].slices=4;G.match.finishRound(m);assert(m.winners.length>0);assert(m.participants.every(p=>p.coins>=G.config.economy.matchComplete));
  const paid=G.save.data.coins;G.match.payComplete(m);assert.equal(G.save.data.coins,paid);
  for(let i=0;i<600;i++)G.match.advance(m,1/60,stationary(6));assert.equal(m.phase,'final');assert.equal(m.round,1);
});
for(const count of [2,6]) {
  test(`ruleta con ${count} participantes nunca repite minijuego`,()=>{
    const G=game(),m=G.match.create(participants(count),2026);let previous=m.world.mode;
    for(let round=0;round<30;round++){G.match.next(m);assert.notEqual(m.world.mode,previous);assert(G.match.compatible(count).includes(m.world.mode));previous=m.world.mode;}
  });
  test(`Crazy Ingredients con ${count}: antibloqueo y terminación incluso con jugadores perfectos`,()=>{
    const G=game(),w=forceMode(G,'crazy',count);let cycles=0;
    while(!w.over&&cycles++<30){
      const supply=w.food.filter(f=>f.ingredient===w.requested);assert(supply.length<=w.supply);
      if(w.limited)assert(w.supply<=G.maps.alive(w).length-1);
      G.maps.alive(w).forEach((p,i)=>{p.safe=i<supply.length;});
      const before=w.food.filter(f=>f.ingredient===w.requested).length;
      w.orderElapsed=w.stage.seconds+G.config.minigames.crazy.announcementSeconds;w.elapsed+=w.orderElapsed;
      G.minigames.crazy.step(w,G.config.physics.fixedStep,stationary(count));
      assert(before>=0);
    }
    assert(w.over);assert(G.maps.alive(w).length<=1);assert(cycles<=count*(G.config.minigames.crazy.antiStallOrders+1));
  });
}
test('50 rondas POM: portador al azar, mecha de 15 s y una sola explosión',()=>{
  const G=game(),holders=new Set();
  for(let seed=1;seed<=50;seed++) {
    const w=forceMode(G,'pom',6,seed*98123);holders.add(w.holder);const c=G.config.minigames.pom;
    for(let tick=0;tick<c.fuseSeconds*120+2&&!w.over;tick++){w.elapsed+=1/120;G.minigames.pom.step(w,1/120,stationary(6));}
    assert(w.over);assert(w.elapsed>=c.fuseSeconds-G.config.physics.fixedStep);assert(w.elapsed<=c.fuseSeconds+G.config.physics.fixedStep*2);
    assert.equal(G.maps.alive(w).length,5);assert.equal(w.players[w.holder].alive,false);assert.equal(w.fuse,0);
    const rows=G.match.rank(w);assert.equal(rows.filter(r=>r.place===1).length,5);
  }
  assert(holders.size>1);
});
test('POM exige Acción, conserva la mecha y bloquea el pase inmediato de vuelta',()=>{
  const G=game(),w=forceMode(G,'pom',2),a=w.players[0],b=w.players[1],c=G.config.minigames.pom;
  w.obstacles=[];w.circles=[];a.x=900;a.y=1100;b.x=1000;b.y=1100;w.holder=0;w.fuse=7;
  const controls=stationary(2);G.minigames.pom.step(w,1/120,controls);assert.equal(w.holder,0);
  controls[0].action=true;G.minigames.pom.step(w,1/120,controls);assert.equal(w.holder,1);assert(w.fuse<7);assert.equal(a.stats.passes,1);
  controls[0].action=false;controls[1].action=true;b.facingX=-1;G.minigames.pom.step(w,1/120,controls);assert.equal(w.holder,1);assert(w.transferLock>0);
  controls[1].action=false;for(let i=0;i<Math.ceil(c.transferLock*120)+1;i++)G.minigames.pom.step(w,1/120,controls);
  b.actionCooldown=0;controls[1].action=true;G.minigames.pom.step(w,1/120,controls);assert.equal(w.holder,0);assert(w.fuse<7-c.transferLock);
});
test('comida simultánea: gana el centro más cercano y solo se recoge una vez',()=>{
  const G=game(),w=forceMode(G,'crazy',2);w.orderElapsed=2;const f=w.food.find(f=>f.ingredient===w.requested);w.players[0].x=f.x;w.players[0].y=f.y;w.players[1].x=f.x+20;w.players[1].y=f.y;
  // Se comprueba el árbitro antes de la separación física.
  assert.equal(G.maps.nearest(w,f).playerId,0);
  w.players[1].x=w.width-100;G.minigames.crazy.step(w,1/120,stationary(2));assert(w.players[0].safe);assert(!w.food.some(q=>q.id===f.id));
});
test('EatEm devora, reparte masa, reaparece y la Salsa nunca mata a masa cero',()=>{
  const G=game(),w=forceMode(G,'eatEm',2),c=G.config.minigames.eatEm,a=w.players[0],b=w.players[1];
  w.food=[];a.mass=150;b.mass=10;a.immune=0;b.immune=0;w.obstacles=[];w.circles=[];a.x=b.x=w.width/2;a.y=b.y=w.height/2;G.player.refresh(a);G.player.refresh(b);
  for(let t=0;t<60;t++){w.elapsed+=1/120;G.minigames.eatEm.step(w,1/120,stationary(w.players.length));}
  assert.equal(b.alive,false);assert.equal(a.stats.devoured,1);
  a.x=200;a.y=300;for(let t=0;t<300;t++){w.elapsed+=1/120;G.minigames.eatEm.step(w,1/120,stationary(w.players.length));}
  assert(b.alive);assert(b.immune>0);assert(b.mass>=c.minRespawnMass);
  w.elapsed=120;b.mass=0;b.x=90;b.y=300;G.minigames.eatEm.step(w,1/120,stationary(w.players.length));assert(b.alive);assert(b.mass>=0);
});
test('límite absoluto de tres minutos y todas las rondas reales terminan con 2 y 6',()=>{
  for(const count of [2,6])for(const mode of ['eatEm','pom','crazy']){
    const G=game();if(!G.match.compatible(count).includes(mode))continue;
    const m=G.match.create(participants(count),5);m.world=forceMode(G,mode,count,5);m.phase='playing';
    let frames=0;while(m.phase==='playing'&&frames++<G.config.round.maxSeconds*30+2){G.match.advance(m,1/30,stationary(m.world.players.length));}
    assert.equal(m.phase,'results');assert(m.world.elapsed<=G.config.round.maxSeconds+G.config.physics.fixedStep);
  }
});

console.log(`${passed} comprobaciones totales superadas. Aceptación humana y mandos físicos pendientes.`);
test('Buffet: Zampada suelta masa, aturde y no recoge inmediatamente sus propias migas',()=>{
  const G=game(),w=forceMode(G,'buffet',3),a=w.players[0],b=w.players[1];w.food=[];w.obstacles=[];w.circles=[];a.x=400;a.y=540;b.x=490;b.y=540;b.mass=100;G.player.refresh(b);
  const controls=stationary(3);controls[0]={x:1,y:0,action:true,connected:true};w.elapsed=1;G.minigames.buffet.step(w,1/120,controls);
  assert(b.stun>0);assert(b.immune>0);assert(b.mass<100);const dropped=w.food.find(f=>f.blockedPlayerId===1);assert(dropped);assert.notEqual(G.maps.nearest(w,dropped)?.playerId,1);
});
test('Buffet: Manjar exige un segundo continuo, última comilona y desempate por Manjares',()=>{
  const G=game(),w=forceMode(G,'buffet',3),p=w.players[0];w.food=[{id:500,type:'feast',x:p.x,y:p.y}];w.elapsed=100;
  for(let i=0;i<100;i++)G.minigames.buffet.step(w,1/120,stationary(3));assert.equal(p.stats.feasts,0);
  for(let i=0;i<25;i++)G.minigames.buffet.step(w,1/120,stationary(3));assert.equal(p.stats.feasts,1);assert(p.mass>=20);assert(w.finalFeast);
  w.players.forEach(q=>{q.mass=50;});p.stats.feasts=2;w.players[1].stats.feasts=1;const rows=G.match.rank(w);assert.equal(rows[0].player.playerId,0);assert.equal(rows[1].place,2);
});
test('Lava: el empujón usa dirección y conserva retroceso frente al movimiento contrario',()=>{
  const G=game(),w=forceMode(G,'war',2),a=w.players[0],b=w.players[1];a.x=1400;a.y=900;b.x=1500;b.y=900;
  const controls=stationary(2);controls[0]={x:1,y:0,action:true,connected:true};
  for(let i=0;i<25;i++){w.elapsed+=1/120;G.minigames.war.step(w,1/120,controls);controls[0].action=false;}
  assert(a.stats.pushes>0);assert(b.knockX>0);const previous=b.x;controls[1].x=-1;G.minigames.war.step(w,1/120,controls);assert(b.x>previous);
});
test('Lava: escudo absorbe un golpe, borde elimina y empate simultáneo se conserva',()=>{
  const G=game(),w=forceMode(G,'war',2),a=w.players[0],b=w.players[1];a.x=1400;a.y=900;b.x=1500;b.y=900;b.shield=5;
  G.minigames.war.shock(w,1450,900,600,null);assert.equal(b.shield,0);assert.equal(b.knockX,0);assert(b.immune>0);
  a.x=0;b.x=w.width;w.elapsed=20;G.minigames.war.step(w,1/120,stationary(2));assert(w.over);assert(w.players.every(p=>!p.alive));const rows=G.match.rank(w);assert(rows.every(r=>r.place===1));
});
test('50 arenas de lava: todo objeto avisa y cae dentro de la plataforma',()=>{
  const G=game();let hazards=0;
  for(let seed=1;seed<=50;seed++) {
    const w=forceMode(G,'war',6,seed*30011);
    for(let i=0;i<50;i++){w.drops=[];G.minigames.war.spawn(w);}
    assert(w.dropHistory.length>0);
    w.dropHistory.forEach(d=>{assert(d.notice>=G.config.telegraphSeconds);assert(G.minigames.war.inside(w,d.x,d.y,G.config.minigames.war.dropRadius));if(['melon','gum'].includes(d.type))hazards++;});
  }
  assert(hazards>100);
});
test('Lava: peligros no impactan antes del aviso, plátano y escudo no cambian config',()=>{
  const G=game(),before=JSON.stringify(G.config),w=forceMode(G,'war',2),p=w.players[0],notice=G.config.minigames.war.dropNotice;
  w.drops=[{id:1,type:'melon',x:p.x-80,y:p.y,age:0,notice,landed:false,life:8}];
  const controls=stationary(2);for(let i=0;i<Math.floor((notice-.1)*120);i++)G.minigames.war.step(w,1/120,controls);
  assert.equal(p.knockX,0);for(let i=0;i<20;i++)G.minigames.war.step(w,1/120,controls);assert(p.knockX>0);
  w.drops=[{id:2,type:'banana',x:p.x,y:p.y,age:notice,notice,landed:false,life:8}];G.minigames.war.step(w,1/120,controls);assert(p.boost>0);
  assert.equal(JSON.stringify(G.config),before);
});
test('cámara sigue al grupo y mantiene visibles a todos los humanos, ignorando bots',()=>{
  const G=game(),w=forceMode(G,'eatEm',2),m={world:w,phase:'playing',phaseElapsed:0};
  G.camera.update(w,0);const initial=w.camera.cx;
  w.players[0].x=w.width*.12;w.players[0].y=w.height*.16;w.players[1].x=w.width*.88;w.players[1].y=w.height*.84;
  G.camera.update(w,1/30);let cam=G.camera.get(m);
  G.maps.alive(w).forEach(p=>{const x=p.x*cam.scale+cam.x,y=p.y*cam.scale+cam.y,r=p.radius*cam.scale;assert(x-r>=0&&x+r<=1920&&y-r>=0&&y+r<=1080);});
  w.players[0].x=1800;w.players[1].x=2000;for(let i=0;i<120;i++)G.camera.update(w,1/60);assert(w.camera.cx>initial);
});
test('rig: deformación orientada, gesto y parpadeo sin cambiar cuerpo ni estadísticas',()=>{
  const G=game(),p=G.player.create(0,{kind:'keyboard',index:0},800,800);G.player.refresh(p);p.vx=p.speed;
  const pose=G.rig.pose(p,1,0),top=G.rig.vertex(.5,0,pose),base=G.rig.vertex(.5,1,pose);assert(top.x>base.x);
  p.gulp=G.config.physics.gulpSeconds/2;assert.equal(G.rig.pose(p,1,0).mouth,'gasp');assert(G.rig.pose(p,G.config.animation.blinkSeconds/2,0).blink<.2);
  assert(!Object.keys(G.art).some(id=>id.startsWith('pixel-')));assert(G.art[G.config.art.bodyAsset]);
});
test('todos los minijuegos compatibles terminan dentro de tres minutos con 2 y 6 jugadores',()=>{
  for(const count of [2,6]){
    const G=game();for(const mode of G.match.compatible(count)){
      const m=G.match.create(participants(count),5);m.world=forceMode(G,mode,count,5);m.phase='playing';let frames=0;
      while(m.phase==='playing'&&frames++<G.config.round.maxSeconds*20+2){G.match.advance(m,1/20,stationary(m.world.players.length));}
      assert.equal(m.phase,'results',mode);assert(m.world.elapsed<=G.config.round.maxSeconds+G.config.physics.fixedStep);
    }
  }
});
console.log(`${passed} comprobaciones finales superadas.`);

test('Acción breve entre dos frames no se pierde ni se repite al mantenerla',()=>{
  const G=game();G.input.press('KeyE');G.input.release('KeyE');G.input.update(1/20);assert(G.input.edges.KeyE);G.input.update(1/20);assert(!G.input.edges.KeyE);G.input.press('KeyE');G.input.update(1/20);assert(G.input.edges.KeyE);G.input.press('KeyE');G.input.update(1/20);assert(!G.input.edges.KeyE);
});
console.log(`${passed} comprobaciones finales superadas.`);

test('31 cosméticos y sets: compra, mezcla, guardado y retirada sin tocar mecánicas',()=>{
  const G=game(),before=JSON.stringify(G.config),catalogue=G.shop.catalogue();
  assert.equal(catalogue.filter(e=>e.category!=='sets').length,31);assert.equal(G.shop.featured().length,6);
  G.save.data.coins=1000;assert(G.shop.buy('set0'));assert(G.shop.equip('set0',0));
  assert.equal(G.save.equipment(0).accessory,'accessory0');assert.equal(G.save.equipment(0).particles,'particles3');assert.equal(G.save.equipment(0).trail,'trail1');
  assert(G.shop.buy('accessory1'));assert(G.shop.equip('accessory1',0));assert.equal(G.save.equipment(0).trail,'trail1');
  G.save.load();assert.equal(G.save.equipment(0).accessory,'accessory1');assert.equal(G.save.equipment(0).trail,'trail1');
  const p=G.player.create(0,{kind:'keyboard',index:0},900,900),q=G.player.create(1,{kind:'keyboard',index:1},900,900);G.player.refresh(p);G.player.refresh(q);assert.equal(p.speed,q.speed);assert.equal(p.radius,q.radius);
  assert(G.shop.clear('accessory',0));assert.equal(G.save.equipment(0).accessory,null);assert.equal(G.save.equipment(0).trail,'trail1');assert.equal(JSON.stringify(G.config),before);
});
console.log(`${passed} comprobaciones finales superadas.`);

test('POM en el flujo real elimina exactamente al portador antes de repartir',()=>{
  const G=game(),m=G.match.create(participants(2),98123);m.world=forceMode(G,'pom',2);m.phase='playing';
  for(let i=0;i<500&&m.phase==='playing';i++)G.match.advance(m,1/30,stationary(2));
  assert.equal(m.phase,'results');assert.equal(G.maps.alive(m.world).length,1);assert.equal(m.rows[0].place,1);assert.equal(m.rows[1].place,2);assert.equal(m.world.fuse,0);
});
console.log(`${passed} comprobaciones finales superadas.`);

test('Acción remapeada confirma también los accesos de menú',()=>{
  const G=game();G.save.data.settings.keys[0].action='KeyQ';G.input.press('KeyQ');G.input.release('KeyQ');G.input.update(1/60);assert(G.input.confirm);
  G.input.update(1/60);assert(!G.input.confirm);
});
console.log(`${passed} comprobaciones finales superadas.`);

test('mapas panorámicos: fuente 16:9 y cámara cubre toda la pantalla sin deformar',()=>{
  const G=game();
  for(const theme of ['candy','cooking','slimegarden','lava']) {
    const b=fs.readFileSync(G.art['map-'+theme].file);assert(Math.abs(b.readUInt32BE(16)/b.readUInt32BE(20)-16/9)<.003,theme);
    const w=G.maps.create(participants(6),theme,98);assert.equal(w.width/w.height,16/9);
    for(const phase of ['intro','countdown','playing'])for(const phaseElapsed of [0,1,3,5]) {
      const c=G.camera.get({world:w,phase,phaseElapsed});assert(c.x<=.001&&c.y<=.001);
      assert(w.width*c.scale+c.x>=1920-.001&&w.height*c.scale+c.y>=1080-.001);
    }
  }
});
test('galería: cambiar página y previsualizar no compra ni cambia el equipo',()=>{
  const G=game(),scene={getName:()=> 'Shop'},before=JSON.stringify(G.save.data);
  G.ui.category='accessory';G.ui.shopPage=0;G.ui.selectedItem='accessory0';
  G.ui.activate(scene,'pageNext');assert.equal(G.ui.shopPage,1);assert.equal(G.ui.selectedItem,'accessory6');
  G.ui.activate(scene,'accessory9');assert.equal(G.ui.selectedItem,'accessory9');
  assert.equal(JSON.stringify(G.save.data),before);G.ui.activate(scene,'pageNext');assert.equal(G.ui.shopPage,0);
});
test('comida visible: evita también la parte elevada de cada obstáculo',()=>{
  const G=game();for(const theme of ['candy','cooking','slimegarden']) {
    const w=G.maps.create(participants(2),theme,90),r=w.obstacles[0];
    assert(!G.maps.pickupFree(w,r.x+r.width/2,r.y-5,10));
    const c=w.circles[0],art=G.config.arena.centerArt,top=c.y+c.radius*art.bottom-c.radius*art.width*art.ratios[theme];
    assert(G.maps.free(w,c.x,top+c.radius*.1,10));assert(!G.maps.pickupFree(w,c.x,top+c.radius*.1,10));
    for(let i=0;i<120;i++)G.food.spawn(w,'bite');
    w.food.forEach(f=>assert(G.maps.pickupFree(w,f.x,f.y,G.config.physics.foodRadius)));
  }
});
console.log(`${passed} comprobaciones superadas; aceptación humana pendiente.`);
