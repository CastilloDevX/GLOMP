// Patio de juego para comprobar movimiento, comida, capas y controles locales.
GLOMP.sandbox = {
  practice: true, world: null, paused: false, resumeWorld: false,
  createWorld: function (participants, seed) {
    const count = participants.length, sizes = GLOMP.config.arenaSizes;
    const size = count <= 2 ? sizes.s : count <= 4 ? sizes.m : sizes.l;
    const world = { size: size, players: [], obstacles: [], food: [], particles: [], elapsed: 0, accumulator: 0, foodElapsed: 0, rng: seed || GLOMP.config.sandbox.testSeed, nextFoodId: 0 };
    participants.forEach(function (participant, index) {
      const angle = index * Math.PI * 2 / count;
      const radius = size / 2 - GLOMP.config.sandbox.spawnPadding;
      const player = GLOMP.player.create(index, participant.source, size / 2 + Math.cos(angle) * radius, size / 2 + Math.sin(angle) * radius);
      GLOMP.player.refresh(player); GLOMP.player.resolveBounds(player, world); world.players.push(player);
    });
    for (let index = 0; index < GLOMP.config.sandbox.initialFood; index++) GLOMP.food.spawn(world, 'bite');
    return world;
  },
  onStart: function (scene) {
    const sandbox = GLOMP.sandbox;
    if (!sandbox.resumeWorld || !sandbox.world) {
      const participants = sandbox.practice ? [{ source: { kind: 'keyboard', index: 0 } }] : GLOMP.ui.lobby;
      sandbox.world = sandbox.createWorld(participants, Date.now() >>> 0);
    }
    sandbox.resumeWorld = false; sandbox.paused = false;
    GLOMP.ui.scene = scene; GLOMP.ui.focus = 'resume'; GLOMP.ui.buttons = [];
    GLOMP.input.bind(); GLOMP.view.attach(scene); sandbox.render(scene);
  },
  step: function (world, dt, controls) {
    world.elapsed += dt;
    world.players.forEach(function (player, index) {
      const control = controls[index]; player.bot = !control.connected;
      if (player.bot) {
        const angle = Math.floor(world.elapsed / GLOMP.config.sandbox.botTurnSeconds) + player.playerId;
        GLOMP.player.step(player, { x: Math.cos(angle), y: Math.sin(angle) }, dt, world);
      } else GLOMP.player.step(player, control, dt, world);
    });
    GLOMP.player.separate(world.players, world);
    GLOMP.food.collect(world);
    world.foodElapsed += dt;
    while (world.foodElapsed >= GLOMP.config.sandbox.foodInterval) { world.foodElapsed -= GLOMP.config.sandbox.foodInterval; GLOMP.food.spawn(world, 'bite'); }
    world.particles = world.particles.filter(function (particle) {
      particle.life -= dt; particle.x += particle.vx * dt; particle.y += particle.vy * dt; return particle.life > 0;
    });
  },
  advance: function (world, dt, controls) {
    if (!Number.isFinite(dt) || dt < 0) return;
    world.accumulator += Math.min(dt, GLOMP.config.physics.maxFrameSeconds);
    const step = GLOMP.config.physics.fixedStep;
    while (world.accumulator + Number.EPSILON >= step) { GLOMP.sandbox.step(world, step, controls); world.accumulator = Math.max(0, world.accumulator - step); }
  },
  onTick: function (scene, dt) {
    const sandbox = GLOMP.sandbox, ui = GLOMP.ui, input = GLOMP.input;
    if (!Number.isFinite(dt) || dt < 0) return;
    input.update(dt);
    if (input.back) { sandbox.paused = !sandbox.paused; ui.focus = 'resume'; }
    if (sandbox.paused) {
      if (input.nav) ui.moveFocus(input.nav);
      const id = input.pointerClick || (input.confirm ? ui.focus : null); input.pointerClick = null;
      if (id === 'resume') sandbox.paused = false;
      if (id === 'restart') { sandbox.world = sandbox.createWorld(sandbox.world.players, Date.now() >>> 0); sandbox.paused = false; }
      if (id === 'exit') { sandbox.resumeWorld = false; ui.go(scene, 'Menu'); return; }
    } else sandbox.advance(sandbox.world, dt, sandbox.world.players.map(function (player) { return input.read(player.source); }));
    sandbox.render(scene);
  },
  render: function (scene) {
    const sandbox = GLOMP.sandbox, world = sandbox.world, draw = GLOMP.view, ui = GLOMP.ui, c = GLOMP.config.ui.colors, t = GLOMP.i18n.text;
    const view = draw.begin(scene); ui.buttons = [];
    draw.image(view, 'background', 'menu-village', 800, 450, 1600, 900);
    view.graphics.beginFill(c.dark, 0.85).drawRect(0, 0, 1600, 900).endFill();
    draw.image(view, 'logo', 'title-glomp', 170, 76, 265, 105);
    draw.text(view, 'arenaTitle', t('sandboxTitle'), 800, 30, 42, c.yellow, { center: true, outline: 6 });
    draw.text(view, 'objective', t('sandboxObjective'), 800, 91, 23, c.cream, { center: true });
    const available = Math.min(GLOMP.config.ui.height - 180, GLOMP.config.ui.width - 650);
    const scale = available / (world.size + GLOMP.config.sandbox.cameraMargin);
    const size = world.size * scale, left = (GLOMP.config.ui.width - size) / 2, top = 145;
    draw.panel(view, left - 12, top - 12, size + 24, size + 24, c.chocolate, 30);
    view.graphics.beginFill(0xF5BC73).drawRoundedRect(left, top, size, size, 20).endFill();
    const tile = GLOMP.config.sandbox.obstacleGrid * 2 * scale;
    for (let row = 0; row < Math.ceil(size / tile); row++) for (let col = 0; col < Math.ceil(size / tile); col++) {
      if ((row + col) % 2) view.graphics.beginFill(c.cream, 0.13).drawRect(left + col * tile, top + row * tile, Math.min(tile, size - col * tile), Math.min(tile, size - row * tile)).endFill();
    }
    world.food.forEach(function (food) {
      draw.image(view, 'food' + food.id, 'food-bite', left + food.x * scale, top + food.y * scale + Math.sin(world.elapsed * GLOMP.config.sandbox.foodBobRate + food.id) * GLOMP.config.sandbox.foodBobPixels * scale, GLOMP.config.physics.foodRadius * 2 * scale, GLOMP.config.physics.foodRadius * 2 * scale);
    });
    world.players.forEach(function (player) {
      const x = left + player.x * scale, y = top + player.y * scale;
      const gulp = 1 + Math.sin(player.gulp / GLOMP.config.physics.gulpSeconds * Math.PI) * (GLOMP.config.physics.gulpScale - 1);
      const size = GLOMP.config.physics.baseRadius * 2 * player.visualScale * scale * gulp;
      draw.slime(view, 'player' + player.playerId, x, y, size, player.bot ? 7 : Number(player.bodyColor.slice(4)), Number(player.face.slice(4)), player.stretch, 1 / player.stretch);
      draw.text(view, 'marker' + player.playerId, GLOMP.config.art.markerIcons[player.playerId], x, y - size / 2 - 21, 25, player.bot ? 0x9AA1AB : GLOMP.config.art.markerColors[player.playerId], { center: true, outline: 3 });
      const cardX = player.playerId < 3 ? 35 : 1300, cardY = 185 + (player.playerId % 3) * 198;
      draw.panel(view, cardX, cardY, 265, 167, c.cream, 24);
      draw.text(view, 'cardName' + player.playerId, t('player', { number: player.playerId + 1 }), cardX + 24, cardY + 16, 26, c.chocolate);
      draw.slime(view, 'cardSlime' + player.playerId, cardX + 65, cardY + 100, 90, Number(player.bodyColor.slice(4)), Number(player.face.slice(4)));
      draw.text(view, 'cardMass' + player.playerId, t('mass', { count: Math.floor(player.mass) }), cardX + 127, cardY + 66, 26, c.chocolate);
      draw.text(view, 'cardScale' + player.playerId, t(player.bot ? 'autoControl' : 'scale', { value: player.scale.toFixed(2) }), cardX + 127, cardY + 110, 19, c.chocolate);
    });
    world.particles.forEach(function (particle) { view.graphics.beginFill(c.yellow, particle.life / GLOMP.config.sandbox.particleSeconds).drawCircle(left + particle.x * scale, top + particle.y * scale, 4).endFill(); });
    draw.text(view, 'controls', t('sandboxControls'), 800, 865, 23, c.cream, { center: true });
    if (sandbox.paused) {
      const overlay = draw.item(view, 'pauseOverlay', function () { return new PIXI.Graphics(); });
      overlay.clear().beginFill(c.dark, 0.91).drawRect(0, 0, 1600, 900).endFill();
      view.root.setChildIndex(overlay, view.root.children.length - 1);
      const title = draw.text(view, 'pauseTitle', t('pauseTitle'), 800, 235, 65, c.yellow, { center: true, outline: 7 });
      view.root.setChildIndex(title, view.root.children.length - 1);
      [['resume', 'resume', c.green], ['restart', 'restart', c.yellow], ['exit', 'toMenu', c.red]].forEach(function (button, index) {
        draw.button(view, button[0], t(button[1]), 580, 360 + index * 133, 440, button[2]);
        [view.items['button:' + button[0]], view.items['text:button:' + button[0]]].forEach(function (item) { view.root.setChildIndex(item, view.root.children.length - 1); });
      });
    }
  },
};
