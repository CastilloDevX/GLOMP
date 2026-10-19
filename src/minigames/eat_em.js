// Crecimiento, cobertura acumulada, reaparición y Salsa; nunca elimina por masa cero.
GLOMP.minigames = GLOMP.minigames || {};
GLOMP.minigames.eatEm = {
  start: function (w) {
    const c = GLOMP.config.minigames.eatEm;
    w.cover = {}; w.botElapsed = 0;
    w.players.forEach(function (p) { p.immune = c.spawnImmunity; });
    for (let i = 0; i < c.botCount; i++) GLOMP.minigames.eatEm.addBot(w);
    for (let i = 0; i < GLOMP.config.round.initialFood; i++) GLOMP.food.spawn(w, 'bite');
  },
  addBot: function (w) {
    const c = GLOMP.config.minigames.eatEm, id = w.players.length;
    const p = GLOMP.player.create(id, { kind: 'npc', index: id }, w.width / 2, w.height / 2);
    p.npc = true; p.bot = true; p.mass = c.botMass; p.stats = { eaten: 0, devoured: 0, deaths: 0 }; p.immune = c.botRespawnImmunity; p.boost = 0; p.dash = 0;
    GLOMP.player.refresh(p); GLOMP.maps.respawn(w, p); w.players.push(p);
  },
  step: function (w, dt, controls) {
    const mode = GLOMP.minigames.eatEm, c = GLOMP.config.minigames.eatEm;
    w.sauce = w.elapsed < c.sauceStart ? 0 : Math.min(c.maxSauceFraction, c.sauceStep * (1 + Math.floor((w.elapsed - c.sauceStart) / c.sauceInterval)));
    w.players.forEach(function (p, index) {
      if (!p.alive) {
        if (!p.npc) { p.respawn -= dt; if (p.respawn <= 0) { p.mass = Math.max(c.minRespawnMass, p.mass * c.respawnMassRatio); GLOMP.player.refresh(p); GLOMP.maps.respawn(w, p); p.immune = c.spawnImmunity; } }
        return;
      }
      const control = controls[index] || {};
      if (control.action && p.mass >= c.dashMassCost && p.actionCooldown <= 0) { p.mass -= c.dashMassCost; p.dash = c.dashSeconds; p.actionCooldown = c.dashCooldown; GLOMP.maps.drop(w, p, c.dashMassCost); }
      p.dash = Math.max(0, (p.dash || 0) - dt);
      const inSauce = p.x < w.width * w.sauce || p.x > w.width * (1 - w.sauce) || p.y < w.height * w.sauce || p.y > w.height * (1 - w.sauce);
      p.speedMultiplier = (p.dash > 0 ? 1 + c.dashSpeedBoost : 1) * (inSauce ? c.sauceSpeedMultiplier : 1);
      if (inSauce) p.mass = Math.max(0, p.mass - c.sauceMassPerSecond * dt);
    });
    GLOMP.maps.move(w, dt, controls);
    const remaining = [];
    w.food.forEach(function (food) { const p = GLOMP.maps.nearest(w, food); if (p) { GLOMP.player.eat(p, GLOMP.config.food[food.type].mass || 0); p.stats.eaten++; } else remaining.push(food); });
    w.food = remaining;
    const covers = {};
    w.players.forEach(function (prey) {
      if (!prey.alive || prey.immune > 0) return;
      const eligible = w.players.filter(function (predator) { return predator !== prey && predator.alive && predator.scale >= prey.scale * c.eatScaleRatio && Math.hypot(predator.x - prey.x, predator.y - prey.y) + prey.radius <= predator.radius; });
      // Conserva al primer atacante que consiguió cubrirlo; el empate inicial se resuelve por id.
      eligible.sort(function (a, b) { return (w.cover[prey.playerId + ':' + b.playerId] || 0) - (w.cover[prey.playerId + ':' + a.playerId] || 0) || a.playerId - b.playerId; });
      if (!eligible.length) return;
      const predator = eligible[0], key = prey.playerId + ':' + predator.playerId;
      covers[key] = (w.cover[key] || 0) + dt;
      if (covers[key] >= c.coverSeconds) {
        GLOMP.player.eat(predator, prey.mass * c.absorbedMassRatio); predator.stats.devoured++;
        GLOMP.maps.drop(w, prey, prey.mass * c.droppedMassRatio);
        prey.alive = false; prey.respawn = c.respawnSeconds; prey.stats.deaths++; delete covers[key];
      }
    });
    w.cover = covers;
    // Solo se separan tamaños que no pueden devorarse; separar todos impediría cubrir a la presa.
    for (let i = 0; i < w.players.length; i++) for (let j = i + 1; j < w.players.length; j++) {
      const a = w.players[i], b = w.players[j];
      if (Math.max(a.scale, b.scale) < Math.min(a.scale, b.scale) * c.eatScaleRatio) GLOMP.player.separate([a,b], w);
    }
    w.botElapsed += dt;
    if (w.botElapsed >= c.botRespawnSeconds) {
      w.botElapsed %= c.botRespawnSeconds;
      const dead = w.players.filter(function (p) { return p.npc && !p.alive; });
      dead.forEach(function (p) { p.mass = c.botMass; GLOMP.player.refresh(p); GLOMP.maps.respawn(w, p); p.immune = c.botRespawnImmunity; });
    }
    w.foodElapsed += dt;
    while (w.foodElapsed >= GLOMP.config.round.foodInterval) { w.foodElapsed -= GLOMP.config.round.foodInterval; GLOMP.food.spawn(w, 'bite'); }
  },
  score: function (p) { return p.mass; },
};
