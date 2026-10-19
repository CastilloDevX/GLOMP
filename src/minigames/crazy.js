// Un pedido consume cada pieza una sola vez; el presupuesto antibloqueo no se repone al recoger.
GLOMP.minigames.crazy = {
  start: function (w) { w.order = 0; w.stall = 0; w.orderElapsed = 0; w.spawnElapsed = 0; w.maxFood = GLOMP.config.minigames.crazy.maxFood; GLOMP.minigames.crazy.next(w); },
  next: function (w) {
    const c = GLOMP.config.minigames.crazy;
    w.order++; w.orderElapsed = 0;
    w.stage = c.stages.filter(function (s) { return w.order >= s.fromOrder; }).slice(-1)[0];
    w.requested = Math.floor(GLOMP.food.random(w) * w.stage.types);
    w.orderAlive = GLOMP.maps.alive(w).length;
    w.limited = w.stall >= c.antiStallOrders;
    w.supply = w.limited ? Math.max(0, w.orderAlive - 1) : w.orderAlive;
    w.players.forEach(function (p) { p.safe = false; }); w.food = [];
    for (let i = 0; i < w.supply; i++) GLOMP.minigames.crazy.spawn(w, w.requested);
    for (let i = w.food.length; i < c.initialFood; i++) {
      let type = Math.floor(GLOMP.food.random(w) * (w.stage.types - 1)); if (type >= w.requested) type++;
      GLOMP.minigames.crazy.spawn(w, type);
    }
  },
  spawn: function (w, type) {
    if (!GLOMP.food.spawn(w,'bite')) return false;
    w.food[w.food.length - 1].ingredient = type; return true;
  },
  step: function (w, dt, controls) {
    const c = GLOMP.config.minigames.crazy, m = GLOMP.minigames.crazy;
    w.players.forEach(function (p) { p.speedMultiplier = 1; });
    GLOMP.maps.move(w, dt, controls); GLOMP.player.separate(w.players, w);
    w.orderElapsed += dt;
    // El anuncio no consume el reloj ni permite asegurar la comida antes de tiempo.
    if (w.orderElapsed >= c.announcementSeconds) {
      w.food = w.food.filter(function (f) {
        if (f.ingredient !== w.requested) return true;
        const winner = GLOMP.maps.nearest(w, f, function (p) { return !p.safe && !p.npc; });
        if (!winner) return true;
        winner.safe = true; winner.stats.orders++; return false;
      });
    }
    w.spawnElapsed += dt;
    if (w.spawnElapsed >= c.spawnInterval) {
      w.spawnElapsed %= c.spawnInterval;
      let type = Math.floor(GLOMP.food.random(w) * (w.stage.types - 1)); if (type >= w.requested) type++;
      m.spawn(w,type); // Nunca repone el alimento pedido: se conserva el presupuesto completo del pedido.
    }
    if (w.orderElapsed >= c.announcementSeconds + w.stage.seconds) {
      const failed = GLOMP.maps.alive(w).filter(function (p) { return !p.safe; });
      failed.forEach(function (p) { GLOMP.maps.eliminate(w,p); });
      w.stall = failed.length ? 0 : w.stall + 1;
      if (GLOMP.maps.alive(w).length <= 1) w.over = true; else m.next(w);
    }
  },
  score: function (p,w) { return p.alive ? w.elapsed + GLOMP.config.physics.fixedStep : p.eliminatedAt || 0; },
};
