// Práctica explícita. Usa el mismo mapa y el mismo movimiento que la copa, sin premios.
GLOMP.sandbox = {
  practice: true, world: null,
  createWorld: function (participants,seed) {
    const w = GLOMP.maps.create(participants,'candy',seed); w.mode = 'practice';
    for (let i = 0; i < GLOMP.config.round.initialFood; i++) GLOMP.food.spawn(w,'bite');
    return w;
  },
  step: function (w,dt,controls) {
    w.elapsed += dt; GLOMP.maps.move(w,dt,controls); GLOMP.player.separate(w.players,w); GLOMP.food.collect(w);
    w.foodElapsed += dt;
    while (w.foodElapsed >= GLOMP.config.round.foodInterval) { w.foodElapsed -= GLOMP.config.round.foodInterval; GLOMP.food.spawn(w,'bite'); }
    w.particles.forEach(function (p) { p.life -= dt; }); w.particles = w.particles.filter(function (p) { return p.life > 0; });
  },
  advance: function (w,dt,controls) {
    if (!Number.isFinite(dt) || dt < 0) return;
    w.accumulator += Math.min(dt,GLOMP.config.physics.maxFrameSeconds);
    const step = GLOMP.config.physics.fixedStep;
    while (w.accumulator + Number.EPSILON >= step) { GLOMP.sandbox.step(w,step,controls); w.accumulator = Math.max(0,w.accumulator - step); }
  },
  onStart: function (scene) {
    const participants = GLOMP.ui.lobby.length ? GLOMP.ui.lobby : [{source:{kind:'keyboard',index:0},color:0}];
    GLOMP.sandbox.world = GLOMP.sandbox.createWorld(participants,Date.now() >>> 0);
    GLOMP.input.bind(); GLOMP.view.attach(scene);
  },
  onTick: function (scene,dt) {
    const input = GLOMP.input,w = GLOMP.sandbox.world;
    input.update(dt); if (input.back) { GLOMP.ui.go(scene,'Menu'); return; }
    GLOMP.sandbox.advance(w,dt,w.players.map(function (p) { return input.read(p.source); }));
    GLOMP.hud.render(scene,{world:w,phase:'playing',phaseElapsed:0,participants:w.players.map(function () { return {slices:0}; }),round:0});
  },
};
