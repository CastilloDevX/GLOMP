// Arte original completo y colisiones trazadas sobre sus coordenadas normalizadas.
GLOMP.maps = {
  create: function (participants, theme, seed) {
    const c = GLOMP.config.arena, lava = theme === 'lava';
    const world = { width: lava ? c.lavaWidth : c.width, height: lava ? c.lavaHeight : c.height,
      size: lava ? c.lavaWidth : c.width, wall: c.wall, unbounded: lava,
      theme: theme, players: [], obstacles: [], circles: [], bushes: [], food: [], particles: [], bombs: [], puddles: [],
      elapsed: 0, accumulator: 0, foodElapsed: 0, rng: seed || GLOMP.config.sandbox.testSeed, nextFoodId: 0,
      foodSpacing: GLOMP.config.round.foodSpacing, over: false, notice: '', mode: '', eliminated: 0 };
    const layout = c.layouts[theme];
    layout.obstacles.forEach(function (r,index) { world.obstacles.push({id:index,x:r[0]*world.width,y:r[1]*world.height,width:r[2]*world.width,height:r[3]*world.height}); });
    layout.circles.forEach(function (r) { world.circles.push({x:r[0]*world.width,y:r[1]*world.height,radius:r[2]*world.width}); });
    layout.bushes.forEach(function (r,index) { world.bushes.push({id:index,x:r[0]*world.width,y:r[1]*world.height,width:r[2]*world.width,height:r[3]*world.height}); });
    participants.forEach(function (participant, index) {
      const point = c.spawns[index], player = GLOMP.player.create(index, participant.source, point[0] * world.width, point[1] * world.height);
      player.bodyColor = 'body' + (participant.color === undefined ? index % GLOMP.config.art.bodyColors.length : participant.color);
      player.stats = { eaten: 0, devoured: 0, deaths: 0, dodged: 0, orders: 0, feasts: 0, passes: 0, pushes: 0, shields: 0 };
      player.immune = 0; player.respawn = 0; player.dash = 0; player.boost = 0; player.safe = false;
      GLOMP.player.refresh(player); world.players.push(player);
      GLOMP.maps.place(world,player,point[0]*world.width,point[1]*world.height);
    });
    return world;
  },
  free: function (world, x, y, radius) {
    if (x < world.wall + radius || x > world.width - world.wall - radius || y < world.wall + radius || y > world.height - world.wall - radius) return false;
    if ((world.circles || []).some(function(c){return Math.hypot(x-c.x,y-c.y)<radius+c.radius;})) return false;
    return !world.obstacles.some(function (r) { return x + radius > r.x && x - radius < r.x + r.width && y + radius > r.y && y - radius < r.y + r.height; });
  },
  respawn: function (world, player) {
    const points = GLOMP.config.arena.spawns;
    const p = points[Math.floor(GLOMP.food.random(world)*points.length)];
    GLOMP.maps.place(world,player,p[0]*world.width,p[1]*world.height);
    player.vx = 0; player.vy = 0; player.trailPoints=[];player.knockX = 0; player.knockY = 0; player.alive = true;
  },
  place: function(world,player,x,y) {
    const step = GLOMP.config.sandbox.obstacleGrid;
    for(let ring=0;ring<Math.ceil(Math.max(world.width,world.height)/step);ring++) {
      const count = Math.max(1,Math.ceil(Math.PI*2*ring));
      for(let i=0;i<count;i++) {
        const a=i/count*Math.PI*2,px=x+Math.cos(a)*ring*step,py=y+Math.sin(a)*ring*step;
        if(GLOMP.maps.free(world,px,py,player.radius)&&!world.players.some(function(q){return q!==player&&q.alive&&Math.hypot(q.x-px,q.y-py)<q.radius+player.radius;})) {player.x=px;player.y=py;return;}
      }
    }
    throw new Error('El mapa no tiene un punto libre para reaparecer.');
  },
  eliminate: function (world, player) {
    if (!player.alive) return;
    player.alive = false; player.trailPoints=[]; player.eliminatedAt = world.elapsed; player.stats.deaths++; world.eliminated++;
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
      if(!player.alive)player.trailPoints=[];
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
