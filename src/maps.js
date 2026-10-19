// Mapas ensamblados con piezas independientes; las mismas medidas alimentan dibujo y colisión.
GLOMP.maps = {
  create: function (participants, theme, seed) {
    const c = GLOMP.config.arena, factor = participants.length > 4 ? c.largeMultiplier : 1;
    const world = { width: c.width * factor, height: c.height * factor, size: c.width * factor, wall: c.wall,
      theme: theme, players: [], obstacles: [], bushes: [], food: [], particles: [], bombs: [], puddles: [],
      elapsed: 0, accumulator: 0, foodElapsed: 0, rng: seed || GLOMP.config.sandbox.testSeed, nextFoodId: 0,
      foodSpacing: GLOMP.config.round.foodSpacing, over: false, notice: '', mode: '', eliminated: 0 };
    (c.layouts[theme] || c).obstacles.forEach(function (point, index) {
      world.obstacles.push({ id: index, x: point[0] * world.width - c.obstacleWidth / 2, y: point[1] * world.height - c.obstacleHeight / 2, width: c.obstacleWidth, height: c.obstacleHeight });
    });
    (c.layouts[theme] || c).bushes.forEach(function (point, index) { world.bushes.push({ id: index, x: point[0] * world.width, y: point[1] * world.height, width: c.bushWidth, height: c.bushHeight }); });
    participants.forEach(function (participant, index) {
      const point = c.spawns[index], player = GLOMP.player.create(index, participant.source, point[0] * world.width, point[1] * world.height);
      player.bodyColor = 'body' + (participant.color === undefined ? index % GLOMP.config.art.bodyColors.length : participant.color);
      player.stats = { eaten: 0, devoured: 0, deaths: 0, dodged: 0, orders: 0, feasts: 0 };
      player.immune = 0; player.respawn = 0; player.dash = 0; player.boost = 0; player.safe = false;
      GLOMP.player.refresh(player); world.players.push(player);
    });
    return world;
  },
  free: function (world, x, y, radius) {
    if (x < world.wall + radius || x > world.width - world.wall - radius || y < world.wall + radius || y > world.height - world.wall - radius) return false;
    return !world.obstacles.some(function (r) { return x + radius > r.x && x - radius < r.x + r.width && y + radius > r.y && y - radius < r.y + r.height; });
  },
  respawn: function (world, player) {
    const points = GLOMP.config.arena.spawns;
    const offset = Math.floor(GLOMP.food.random(world) * points.length);
    for (let i = 0; i < points.length; i++) {
      const p = points[(offset + i) % points.length], x = p[0] * world.width, y = p[1] * world.height;
      if (!GLOMP.maps.free(world, x, y, player.radius)) continue;
      player.x = x; player.y = y; player.vx = 0; player.vy = 0; player.alive = true; return;
    }
  },
  eliminate: function (world, player) {
    if (!player.alive) return;
    player.alive = false; player.eliminatedAt = world.elapsed; player.stats.deaths++; world.eliminated++;
  },
  alive: function (world) { return world.players.filter(function (p) { return p.alive && !p.npc; }); },
  drop: function (world, player, amount) {
    const count = Math.min(GLOMP.config.round.maxDrops, Math.floor(amount));
    for (let i = 0; i < count && world.food.length < GLOMP.config.sandbox.maxFood; i++) {
      const angle = GLOMP.food.random(world) * Math.PI * 2, radius = player.radius + GLOMP.config.physics.foodRadius;
      const x = player.x + Math.cos(angle) * radius, y = player.y + Math.sin(angle) * radius;
      if (GLOMP.maps.free(world, x, y, GLOMP.config.physics.foodRadius)) world.food.push({ id: world.nextFoodId++, type: 'bite', x: x, y: y, blockedPlayerId: player.playerId, collectAfter: world.elapsed + GLOMP.config.round.dropOwnerGraceSeconds });
    }
  },
  move: function (world, dt, controls) {
    world.players.forEach(function (player, index) {
      player.immune = Math.max(0, player.immune - dt); player.boost = Math.max(0, player.boost - dt);
      const control = controls[index] || { connected: false };
      player.bot = player.npc || !control.connected;
      let chosen = control;
      if (player.bot) {
        // El mando desconectado conserva su plaza y sus puntos; el bot gris es solo sustituto.
        const angle = Math.floor(world.elapsed / GLOMP.config.round.botSteerSeconds) + index;
        chosen = { x: Math.cos(angle), y: Math.sin(angle) };
      }
      GLOMP.player.step(player, chosen, dt, world);
    });
  },
  nearest: function (world, food, predicate) {
    let winner = null, distance = Infinity;
    world.players.forEach(function (p) {
      if (!p.alive || (food.blockedPlayerId === p.playerId && world.elapsed < food.collectAfter) || (predicate && !predicate(p))) return;
      const d = Math.hypot(p.x - food.x, p.y - food.y);
      if (d <= p.radius + GLOMP.config.physics.foodRadius && (d < distance || (d === distance && p.playerId < winner.playerId))) { winner = p; distance = d; }
    });
    return winner;
  },
};
