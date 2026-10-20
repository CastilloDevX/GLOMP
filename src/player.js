// Simulación de círculos independiente de GDevelop y del aspecto equipado.
GLOMP.player = {
  create: function (playerId, source, x, y) {
    const equipment = GLOMP.save.equipment(playerId);
    return {
      playerId: playerId, source: source, x: x, y: y, vx: 0, vy: 0,
      bodyColor: equipment.body, face: equipment.face, accessory: equipment.accessory, particles: equipment.particles, trail: equipment.trail, trailPoints: [], trailElapsed: 0,
      slices: 0, mass: 0, scale: 1, visualScale: 1, health: GLOMP.config.player.initialHealth,
      ammo: [], actionCooldown: 0, state: 'normal', alive: true, gulp: 0,
      knockX: 0, knockY: 0, facingX: 1, facingY: 0, animationTime: 0, expression: 'smile', stretch: 1, stretchVelocity: 0, brake: 0, previousSpeed: 0, bot: false,
    };
  },
  refresh: function (player) {
    const config = GLOMP.config.player;
    player.scale = Math.min(config.maxScale, 1 + config.scalePerMass * player.mass);
    player.speed = config.baseSpeed * (1 - config.speedPenalty * (player.scale - 1));
    player.radius = GLOMP.config.physics.baseRadius * player.scale;
  },
  step: function (player, control, dt, arena) {
    if (!player.alive) return;
    const config = GLOMP.config.physics;
    GLOMP.player.refresh(player);
    const multiplier = player.speedMultiplier === undefined ? 1 : player.speedMultiplier;
    let targetX = control.x * player.speed * multiplier, targetY = control.y * player.speed * multiplier;
    if (player.state === 'stunned' || player.state === 'stuck') { targetX = 0; targetY = 0; }
    const before = Math.hypot(player.vx, player.vy);
    const changing = targetX * player.vx + targetY * player.vy < 0;
    if (changing && before > 0) {
      const length = Math.hypot(targetX, targetY);
      if (length) {
        const nx = targetX / length, ny = targetY / length;
        const along = player.vx * nx + player.vy * ny;
        player.vx = along * nx + (player.vx - along * nx) * config.lateralRetention;
        player.vy = along * ny + (player.vy - along * ny) * config.lateralRetention;
      }
    }
    const dx = targetX - player.vx, dy = targetY - player.vy;
    const difference = Math.hypot(dx, dy), acceleration = (targetX || targetY) ? config.acceleration : config.friction;
    const fraction = difference ? Math.min(1, acceleration * dt / difference) : 0;
    player.vx += dx * fraction; player.vy += dy * fraction;
    const heading = Math.hypot(control.x || 0, control.y || 0);
    if (heading) { player.facingX = control.x / heading; player.facingY = control.y / heading; }
    player.animationTime += dt;
    const visual=GLOMP.config.animation.cosmetics;
    player.trailPoints.forEach(function(point){point.life-=dt;});player.trailPoints=player.trailPoints.filter(function(point){return point.life>0;});
    player.trailElapsed+=dt;
    if(player.trail&&player.trailElapsed>=visual.trailInterval&&before>visual.trailMinSpeed) {
      player.trailElapsed%=visual.trailInterval;player.trailPoints.push({x:player.x,y:player.y,life:visual.trailSeconds});
      if(player.trailPoints.length>visual.trailMax)player.trailPoints.shift();
    }
    player.x += (player.vx + player.knockX) * dt; player.y += (player.vy + player.knockY) * dt;
    const drag = Math.exp(-config.knockbackDrag * dt);
    player.knockX *= drag; player.knockY *= drag;
    GLOMP.player.resolveBounds(player, arena);
    arena.obstacles.forEach(function (rectangle) { GLOMP.player.resolveRectangle(player, rectangle); });
    (arena.circles || []).forEach(function (circle) { GLOMP.player.resolveCircle(player, circle); });
    const speed = Math.hypot(player.vx, player.vy);
    if (before > 0 && speed === 0) player.brake = config.brakeSeconds;
    player.brake = Math.max(0, player.brake - dt);
    const directional = player.speed ? (Math.abs(player.vx) - Math.abs(player.vy)) / player.speed : 0;
    const targetStretch = player.brake ? config.brakeSquash : 1 + config.stretchAmount * directional;
    player.stretchVelocity += ((targetStretch - player.stretch) * config.springK - player.stretchVelocity * config.springC) * dt;
    player.stretch += player.stretchVelocity * dt;
    player.visualScale += (player.scale - player.visualScale) * (1 - Math.exp(-config.growLerp * dt));
    player.gulp = Math.max(0, player.gulp - dt);
    player.gesture = Math.max(0,(player.gesture || 0)-dt);
    player.actionCooldown = Math.max(0, player.actionCooldown - dt);
    player.previousSpeed = speed;
  },
  resolveBounds: function (player, arena) {
    if (arena.unbounded) return;
    const margin = (arena.wall === undefined ? GLOMP.config.sandbox.wallPadding : arena.wall) + player.radius;
    const width = arena.width || arena.size, height = arena.height || arena.size;
    if (player.x < margin) { player.x = margin; player.vx = Math.max(0, player.vx); }
    if (player.x > width - margin) { player.x = width - margin; player.vx = Math.min(0, player.vx); }
    if (player.y < margin) { player.y = margin; player.vy = Math.max(0, player.vy); }
    if (player.y > height - margin) { player.y = height - margin; player.vy = Math.min(0, player.vy); }
  },
  resolveRectangle: function (player, rectangle) {
    const x = Math.max(rectangle.x, Math.min(rectangle.x + rectangle.width, player.x));
    const y = Math.max(rectangle.y, Math.min(rectangle.y + rectangle.height, player.y));
    const dx = player.x - x, dy = player.y - y, distance = Math.hypot(dx, dy);
    if (distance >= player.radius) return;
    let nx, ny, penetration;
    if (distance) { nx = dx / distance; ny = dy / distance; penetration = player.radius - distance; }
    else {
      const sides = [
        { distance: player.x - rectangle.x, nx: -1, ny: 0 },
        { distance: rectangle.x + rectangle.width - player.x, nx: 1, ny: 0 },
        { distance: player.y - rectangle.y, nx: 0, ny: -1 },
        { distance: rectangle.y + rectangle.height - player.y, nx: 0, ny: 1 },
      ].sort(function (a, b) { return a.distance - b.distance; });
      nx = sides[0].nx; ny = sides[0].ny; penetration = sides[0].distance + player.radius;
    }
    player.x += nx * penetration; player.y += ny * penetration;
    const normalVelocity = player.vx * nx + player.vy * ny;
    if (normalVelocity < 0) { player.vx -= normalVelocity * nx; player.vy -= normalVelocity * ny; }
  },
  impulse: function (player, x, y, strength) {
    const length = Math.hypot(x,y) || 1;
    player.knockX += x / length * strength; player.knockY += y / length * strength;
  },
  resolveCircle: function (player, circle) {
    const dx = player.x-circle.x, dy = player.y-circle.y, distance = Math.hypot(dx,dy);
    const overlap = player.radius + circle.radius - distance;
    if (overlap > 0) { const nx = distance ? dx/distance : 1, ny = distance ? dy/distance : 0; player.x += nx*overlap; player.y += ny*overlap; }
  },
  separate: function (players, arena) {
    for (let i = 0; i < players.length; i++) for (let j = i + 1; j < players.length; j++) {
      const a = players[i], b = players[j];
      if (!a.alive || !b.alive) continue;
      const dx = b.x - a.x, dy = b.y - a.y, distance = Math.hypot(dx, dy);
      const overlap = a.radius + b.radius - distance;
      if (overlap <= 0) continue;
      const nx = distance ? dx / distance : 1, ny = distance ? dy / distance : 0;
      const correction = overlap * GLOMP.config.physics.separationDamping;
      const aShare = b.scale / (a.scale + b.scale), bShare = 1 - aShare;
      a.x -= nx * correction * aShare; a.y -= ny * correction * aShare;
      b.x += nx * correction * bShare; b.y += ny * correction * bShare;
      GLOMP.player.resolveBounds(a, arena); GLOMP.player.resolveBounds(b, arena);
      [a,b].forEach(function(p){ arena.obstacles.forEach(function(r){GLOMP.player.resolveRectangle(p,r);}); (arena.circles || []).forEach(function(r){GLOMP.player.resolveCircle(p,r);}); });
    }
  },
  eat: function (player, mass) {
    player.mass += mass; player.gulp = GLOMP.config.physics.gulpSeconds;
    GLOMP.player.refresh(player);
  },
};
