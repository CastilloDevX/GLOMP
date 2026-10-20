// Una tabla común y un único tipo de entidad, diferenciado por type.
GLOMP.food = {
  random: function (world) {
    let state = world.rng >>> 0; state ^= state << 13; state ^= state >>> 17; state ^= state << 5;
    world.rng = state >>> 0; return world.rng / 4294967296;
  },
  spawn: function (world, type) {
    const config = GLOMP.config.sandbox;
    if (world.food.length >= (world.maxFood || config.maxFood)) return false;
    for (let attempt = 0; attempt < config.spawnAttempts; attempt++) {
      const x = config.spawnPadding + GLOMP.food.random(world) * ((world.width || world.size) - config.spawnPadding * 2);
      const y = config.spawnPadding + GLOMP.food.random(world) * ((world.height || world.size) - config.spawnPadding * 2);
      if (world.food.some(function (food) { return Math.hypot(food.x - x, food.y - y) < (world.foodSpacing || config.foodSpacing); })) continue;
      if (GLOMP.maps && !GLOMP.maps.pickupFree(world,x,y,GLOMP.config.physics.foodRadius)) continue;
      world.food.push({ id: world.nextFoodId++, type: type, x: x, y: y }); return true;
    }
    return false;
  },
  collect: function (world) {
    const remaining = [];
    world.food.forEach(function (food) {
      let winner = null, closest = Infinity;
      world.players.forEach(function (player) {
        if (!player.alive) return;
        const distance = Math.hypot(food.x - player.x, food.y - player.y);
        if (distance > player.radius + GLOMP.config.physics.foodRadius) return;
        if (distance < closest || (distance === closest && winner && player.playerId < winner.playerId)) { winner = player; closest = distance; }
      });
      if (!winner) { remaining.push(food); return; }
      GLOMP.player.eat(winner, GLOMP.config.food[food.type].mass || 0);
      for (let index = 0; index < GLOMP.config.physics.gulpParticles; index++) {
        const angle = index * Math.PI * 2 / GLOMP.config.physics.gulpParticles;
        world.particles.push({ x: food.x, y: food.y, vx: Math.cos(angle) * GLOMP.config.sandbox.particleSpeed, vy: Math.sin(angle) * GLOMP.config.sandbox.particleSpeed, life: GLOMP.config.sandbox.particleSeconds });
      }
    });
    world.food = remaining;
  },
};
