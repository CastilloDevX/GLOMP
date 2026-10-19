// Generador conservador: reserva una cruz transitable de 120 px y limita el área máxima anunciada.
GLOMP.minigames.pom = {
  start: function (w) { w.bombElapsed = 0; w.bananaElapsed = 0; w.nextBombId = 0; w.zone = 0; w.bombHistory = []; },
  shape: function (kind) {
    const c = GLOMP.config.minigames.pom;
    if (kind === 'small') return { rx: c.bombs.small.radius, ry: c.bombs.small.radius };
    const b = c.bombs[kind]; return { rx: b.width, ry: b.height };
  },
  spawn: function (w) {
    const m = GLOMP.minigames.pom, c = GLOMP.config.minigames.pom;
    if (w.bombs.length >= c.maxBombs) return false;
    const kinds = Object.keys(c.bombs).filter(function (k) { return w.elapsed >= c.bombs[k].availableAt; });
    const kind = kinds[Math.floor(GLOMP.food.random(w) * kinds.length)], mystery = kind === 'mystery';
    const actual = mystery ? kinds.filter(function (k) { return k !== 'mystery'; })[Math.floor(GLOMP.food.random(w) * (kinds.length - 1))] : kind;
    const shape = m.shape(actual), maximum = mystery ? { rx: Math.max(c.bombs.small.radius, c.bombs.wide.width, c.bombs.tall.width), ry: Math.max(c.bombs.small.radius, c.bombs.wide.height, c.bombs.tall.height) } : shape;
    const area = Math.PI * maximum.rx * maximum.ry;
    const activeArea = w.bombs.reduce(function (n,b) { return n + Math.PI * b.maxRx * b.maxRy; }, 0);
    const zoneW = w.width * (1 - w.zone * 2), zoneH = w.height * (1 - w.zone * 2);
    if ((activeArea + area) / (zoneW * zoneH) > c.maxCoverage) return false;
    for (let attempt = 0; attempt < c.spawnAttempts; attempt++) {
      const x = w.width * w.zone + GLOMP.food.random(w) * zoneW;
      const y = w.height * w.zone + GLOMP.food.random(w) * zoneH;
      const route = c.minRouteWidth / 2 + c.routeInset;
      if (Math.abs(x - w.width / 2) < maximum.rx + route || Math.abs(y - w.height / 2) < maximum.ry + route) continue;
      if (!GLOMP.maps.free(w, x, y, GLOMP.config.physics.foodRadius)) continue;
      const seconds = Math.max(GLOMP.config.telegraphSeconds, c.bombs[actual].inflateSeconds);
      const bomb = { id: w.nextBombId++, kind: kind, actual: actual, x: x, y: y, rx: shape.rx, ry: shape.ry, maxRx: maximum.rx, maxRy: maximum.ry, age: 0, seconds: seconds, hit: false };
      w.bombs.push(bomb);
      // El historial contiene solo datos de auditoría, no sprites ni recursos de GPU.
      w.bombHistory.push({ x: x, y: y, maxRx: maximum.rx, maxRy: maximum.ry, seconds: seconds, coverage: (activeArea + area) / (zoneW * zoneH) });
      return true;
    }
    return false;
  },
  inside: function (p, b) { return Math.pow((p.x - b.x) / b.rx, 2) + Math.pow((p.y - b.y) / b.ry, 2) <= 1; },
  step: function (w, dt, controls) {
    const m = GLOMP.minigames.pom, c = GLOMP.config.minigames.pom;
    w.zone = w.elapsed < c.shrinkStart ? 0 : Math.min(1, (w.elapsed - c.shrinkStart) / c.shrinkSeconds) * (1 - c.arenaFinalRatio) / 2;
    w.players.forEach(function (p) { const sticky = w.puddles.some(function (b) { return m.inside(p,b); }); p.speedMultiplier = (sticky ? c.puddleSpeedMultiplier : 1) * (p.boost > 0 ? 1 + c.bananaBoost : 1); });
    GLOMP.maps.move(w, dt, controls); GLOMP.player.separate(w.players, w);
    w.players.forEach(function (p) {
      if (!p.alive) return;
      // El borde es sólido y visible; reducir el suelo no mata sin aviso.
      const minX = w.width * w.zone + p.radius, maxX = w.width * (1 - w.zone) - p.radius;
      const minY = w.height * w.zone + p.radius, maxY = w.height * (1 - w.zone) - p.radius;
      p.x = Math.max(minX, Math.min(maxX, p.x)); p.y = Math.max(minY, Math.min(maxY, p.y));
    });
    const interval = c.frequency.filter(function (f) { return w.elapsed >= f.from; }).slice(-1)[0].interval;
    w.bombElapsed += dt;
    while (w.bombElapsed >= interval) { w.bombElapsed -= interval; m.spawn(w); }
    w.bombs.forEach(function (b) {
      b.age += dt;
      if (!b.hit && b.age >= b.seconds) {
        b.hit = true;
        w.players.forEach(function (p) { if (p.alive && m.inside(p,b)) GLOMP.maps.eliminate(w,p); else if (p.alive) p.stats.dodged++; });
        w.puddles.push({ x: b.x, y: b.y, rx: b.rx, ry: b.ry, life: c.puddleSeconds });
      }
    });
    w.bombs = w.bombs.filter(function (b) { return b.age < b.seconds + c.blastSeconds; });
    w.puddles.forEach(function (p) { p.life -= dt; }); w.puddles = w.puddles.filter(function (p) { return p.life > 0; });
    w.bananaElapsed += dt;
    if (w.bananaElapsed >= c.bananaInterval) {
      w.bananaElapsed %= c.bananaInterval;
      if (GLOMP.food.spawn(w, 'banana')) {
        const f = w.food[w.food.length - 1], b = w.bombs.find(function (b) { return !b.hit; });
        if (b) { f.x = b.x; f.y = b.y; }
      }
    }
    w.food = w.food.filter(function (f) { const p = GLOMP.maps.nearest(w,f); if (p) { p.boost = c.bananaSeconds; p.stats.eaten++; return false; } return true; });
    if (GLOMP.maps.alive(w).length <= 1) w.over = true;
  },
  score: function (p, w) { return p.alive ? w.elapsed + GLOMP.config.physics.fixedStep : p.eliminatedAt || 0; },
};
