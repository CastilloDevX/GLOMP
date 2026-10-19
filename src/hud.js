// La cámara solo se mueve en la presentación; durante el juego encuadra el mapa entero.
GLOMP.hud = {
  camera: function (m) {
    const c = GLOMP.config.round, w = m.world, u = GLOMP.config.ui;
    const t = m.phase === 'intro' ? Math.min(1,m.phaseElapsed / c.cinematicSeconds) : 1;
    const ease = t * t * (3 - 2 * t), zoom = c.cameraZoom + (c.endZoom - c.cameraZoom) * ease;
    const scale = Math.min(u.width / w.width,u.height / w.height) * zoom;
    return { scale: scale, x: (u.width - w.width * scale) / 2 + Math.sin(t * Math.PI * 2) * u.width * c.cameraPan * (1 - t), y: (u.height - w.height * scale) / 2 };
  },
  world: function (view,m) {
    const draw = GLOMP.view, w = m.world, c = GLOMP.config.arena, camera = GLOMP.hud.camera(m), s = camera.scale;
    const x = function (n) { return camera.x + n * s; }, y = function (n) { return camera.y + n * s; };
    const floor = draw.item(view,'map-floor',function () { return new PIXI.TilingSprite(PIXI.Texture.WHITE,1,1); });
    floor.texture = draw.textures['pixel-' + w.theme + '-floor']; floor.position.set(x(0),y(0)); floor.width = w.width * s; floor.height = w.height * s; floor.zIndex = 1;
    floor.tileScale.set(c.floorTile * s / floor.texture.width,c.floorTile * s / floor.texture.height);
    const ground = draw.graphics(view,'ground',2), effects = draw.graphics(view,'effects',45), rings = draw.graphics(view,'rings',38);
    // Los muros son piezas repetidas, nunca un fondo de mapa horneado.
    const nx = Math.ceil(w.width / c.wallTile), ny = Math.ceil(w.height / c.wallTile);
    for (let i = 0; i < nx; i++) for (let side = 0; side < 2; side++) {
      draw.image(view,'wall-h' + side + ':' + i,'pixel-' + w.theme + '-wall',x((i + 0.5) * c.wallTile),y(side ? w.height - w.wall / 2 : w.wall / 2),c.wallTile * s,w.wall * 2 * s,{fill:true,z:45});
    }
    for (let i = 0; i < ny; i++) for (let side = 0; side < 2; side++) {
      draw.image(view,'wall-v' + side + ':' + i,'pixel-' + w.theme + '-wall',x(side ? w.width - w.wall / 2 : w.wall / 2),y((i + 0.5) * c.wallTile),w.wall * s,c.wallTile * s,{fill:true,z:45});
    }
    draw.image(view,'center','pixel-' + w.theme + '-center',x(w.width / 2),y(w.wall + c.centerSize / 2),c.centerSize * s,c.centerSize * s,{z:20});
    w.obstacles.forEach(function (r,index) {
      ground.beginFill(0x261A32,0.22).drawRoundedRect(x(r.x + 8),y(r.y + 12),r.width * s,r.height * s,10).endFill();
      draw.image(view,'obstacle' + index,'pixel-' + w.theme + '-obstacle',x(r.x + r.width / 2),y(r.y + r.height - r.width / 2),r.width * s,r.width * s,{z:30 + (r.y + r.height) / w.height * 10});
    });
    if (w.mode === 'eatEm') {
      const borderX = w.width * (w.sauce || 0), borderY = w.height * (w.sauce || 0);
      if (borderX) ground.beginFill(0xE75156,0.55).drawRect(x(0),y(0),w.width * s,borderY * s).drawRect(x(0),y(w.height - borderY),w.width * s,borderY * s).drawRect(x(0),y(borderY),borderX * s,(w.height - borderY * 2) * s).drawRect(x(w.width - borderX),y(borderY),borderX * s,(w.height - borderY * 2) * s).endFill();
    }
    if (w.zone) {
      const bx = w.width * w.zone, by = w.height * w.zone;
      effects.beginFill(0x542C86,0.6).drawRect(x(0),y(0),w.width * s,by * s).drawRect(x(0),y(w.height - by),w.width * s,by * s).drawRect(x(0),y(by),bx * s,(w.height - by * 2) * s).drawRect(x(w.width - bx),y(by),bx * s,(w.height - by * 2) * s).endFill();
      effects.lineStyle(4,0xC3ACFF).drawRect(x(bx),y(by),(w.width - bx * 2) * s,(w.height - by * 2) * s).lineStyle(0);
    }
    w.puddles.forEach(function (p) { ground.beginFill(0xC769D4,0.30).drawEllipse(x(p.x),y(p.y),p.rx * s,p.ry * s).endFill(); });
    w.food.forEach(function (f,index) {
      const golden = w.mode === 'crazy' && f.ingredient === w.requested;
      if (golden) ground.lineStyle(4,0xFFE27A).beginFill(0xFFCF32,0.24).drawCircle(x(f.x),y(f.y),GLOMP.config.physics.foodRadius * s * 1.7).endFill().lineStyle(0);
      const foodIds = {tomato:'pixel-food-ingredient1',lettuce:'pixel-food-ingredient2',banana:'pixel-food-banana',gum:'pixel-food-gum',melon:'pixel-food-melon'};
      const id = f.ingredient === undefined ? foodIds[f.type] || 'pixel-food-bite' : f.ingredient === 0 ? 'pixel-food-bite' : 'pixel-food-ingredient' + f.ingredient;
      const size = GLOMP.config.physics.foodRadius * 2 * s * (f.type === 'feast' ? 1.7 : f.type === 'plate' ? 1.3 : 1);
      if (f.type === 'feast') ground.lineStyle(3,0xFFD54F).drawCircle(x(f.x),y(f.y),size * 0.8).lineStyle(0);
      draw.image(view,'pickup' + index,id,x(f.x),y(f.y),size,size,{z:10});
    });
    w.bombs.forEach(function (b,index) {
      const progress = Math.min(1,b.age / b.seconds), color = b.kind === 'small' ? 0x4ABCF4 : b.kind === 'wide' ? 0xF579B8 : 0xAE7EEA;
      if (b.kind === 'mystery') {
        const segments = 32;
        for (let i = 0; i < segments; i += 2) {
          const a = i * Math.PI * 2 / segments, z = (i + 1) * Math.PI * 2 / segments;
          effects.lineStyle(3,0xFFF0BC,0.9).moveTo(x(b.x + Math.cos(a) * b.maxRx),y(b.y + Math.sin(a) * b.maxRy)).lineTo(x(b.x + Math.cos(z) * b.maxRx),y(b.y + Math.sin(z) * b.maxRy));
        }
      }
      effects.lineStyle(4,color,1).beginFill(color,b.hit ? 0.85 : 0.13 + progress * 0.2).drawEllipse(x(b.x),y(b.y),b.rx * s,b.ry * s).endFill().lineStyle(0);
      effects.beginFill(color,0.65).drawCircle(x(b.x),y(b.y),Math.max(6,26 * progress) * s).endFill();
      draw.text(view,'bombTimer' + index,b.hit ? GLOMP.i18n.text('pomBurst') : String(Math.max(1,Math.ceil(b.seconds - b.age))),x(b.x),y(b.y),b.hit ? 22 : 24,0xffffff,{center:true,middle:true,outline:3,z:46});
    });
    if (w.mode === 'war') {
      w.crates.forEach(function (crate,index) { draw.image(view,'crate' + index,'pixel-' + w.theme + '-obstacle',x(crate.x),y(crate.y),76 * s,76 * s,{z:20}); });
      w.projectiles.forEach(function (b,index) {
        const color = GLOMP.config.minigames.war.ammoColors[b.type];
        if (b.delay > 0) effects.lineStyle(3,color,0.7).moveTo(x(b.x),y(b.y)).lineTo(x(b.x + b.vx * GLOMP.config.telegraphSeconds),y(b.y + b.vy * GLOMP.config.telegraphSeconds)).lineStyle(0);
        if (b.type === 'melon') effects.lineStyle(2,color,0.5).drawCircle(x(b.x),y(b.y),GLOMP.config.food.melon.radius * s).lineStyle(0);
        const id = b.type === 'tomato' ? 'pixel-food-ingredient1' : b.type === 'gum' ? 'pixel-food-gum' : 'pixel-food-melon';
        draw.image(view,'projectile' + index,id,x(b.x),y(b.y),28 * s,28 * s,{z:40,rotation:Math.atan2(b.vy,b.vx)});
      });
      w.players.forEach(function (p,index) {
        if (!p.alive) return;
        const length = GLOMP.config.minigames.war.aimArrowLength, start = p.radius;
        rings.lineStyle(4,GLOMP.config.art.markerColors[index],0.9).moveTo(x(p.x + p.aimX * start),y(p.y + p.aimY * start)).lineTo(x(p.x + p.aimX * (start + length)),y(p.y + p.aimY * (start + length))).lineStyle(0);
        for (let n=0;n<GLOMP.config.player.maxAmmo;n++) rings.beginFill(n < p.ammo.length ? GLOMP.config.minigames.war.ammoColors[p.ammo[n]] : 0x332B40,0.95).drawCircle(x(p.x) + (n-1) * 12,y(p.y) + p.radius * s + 12,4).endFill();
        const life = GLOMP.view.graphics(view,'worldLife' + index,43);
        life.beginFill(0x211C38).drawRoundedRect(x(p.x)-32,y(p.y)-p.radius*s-14,64,7,3).endFill().beginFill(0x8CEB78).drawRoundedRect(x(p.x)-32,y(p.y)-p.radius*s-14,64*p.health/GLOMP.config.minigames.war.health,7,3).endFill();
      });
      w.splashes.forEach(function (b) { effects.beginFill(GLOMP.config.minigames.war.ammoColors[b.type],b.life/GLOMP.config.sandbox.particleSeconds).drawCircle(x(b.x),y(b.y),20*s).endFill(); });
    }
    if (w.finalFeast) effects.lineStyle(10,0xFFDA56,0.9).drawRect(x(w.wall),y(w.wall),(w.width-w.wall*2)*s,(w.height-w.wall*2)*s).lineStyle(0);
    w.bushes.forEach(function (b,index) { draw.image(view,'bush' + index,'pixel-' + w.theme + '-bush',x(b.x),y(b.y),b.width * s,b.height * s,{fill:true,z:30 + b.y / w.height * 10,alpha:w.mode !== 'eatEm' && w.players.some(function (p) { return p.alive && Math.abs(p.x-b.x)<b.width/2 && Math.abs(p.y-b.y)<b.height/2; }) ? 0.38 : 0.9}); });
    w.players.forEach(function (p,index) {
      if (!p.alive) return;
      const colorIndex = p.bot ? -1 : Number(p.bodyColor.slice(4));
      const gulp = 1 + Math.sin(p.gulp / GLOMP.config.physics.gulpSeconds * Math.PI) * (GLOMP.config.physics.gulpScale - 1);
      const size = GLOMP.config.physics.baseRadius * 2 * p.visualScale * s * gulp;
      const hidden = w.mode === 'eatEm' && p.scale < GLOMP.config.minigames.eatEm.bushScaleLimit && w.bushes.some(function (b) { return Math.abs(p.x - b.x) < b.width / 2 && Math.abs(p.y - b.y) < b.height / 2; });
      ground.beginFill(0x1D1733,0.25).drawEllipse(x(p.x),y(p.y) + size * 0.32,size * 0.45,size * 0.18).endFill();
      if (!p.npc) rings.lineStyle(3,GLOMP.config.art.markerColors[p.playerId],0.85).drawEllipse(x(p.x),y(p.y) + size * 0.3,p.radius * s,p.radius * s * 0.35).lineStyle(0);
      // Cada anillo nombra la pareja: rojo = este slime amenaza a Jn; verde = Jn puede comerlo.
      if (w.mode === 'eatEm') {
        const ratio = GLOMP.config.minigames.eatEm.eatScaleRatio;
        const targets = w.players.filter(function (q) { return !q.npc && q !== p && q.alive && p.scale >= q.scale * ratio; });
        const attackers = w.players.filter(function (q) { return !q.npc && q !== p && q.alive && q.scale >= p.scale * ratio; });
        if (targets.length || attackers.length) {
          const danger = targets.length > 0;
          rings.lineStyle(3,danger ? 0xFF615E : 0x8FE94A,0.9).drawCircle(x(p.x),y(p.y),(p.radius + 8) * s).lineStyle(0);
          draw.text(view,'aura' + index,(danger ? '→ ' : '← ') + (danger ? targets : attackers).map(function (q) { return GLOMP.config.art.markerIcons[q.playerId]; }).join(' '),x(p.x),y(p.y) + size * 0.55,16, danger ? 0xFFAAA4 : 0xC6FF96,{center:true,outline:3,z:42});
        }
      }
      draw.slime(view,'slime' + index,x(p.x),y(p.y),size,colorIndex,0,p.stretch,1 / p.stretch,hidden ? 0.42 : 1,30 + p.y / w.height * 10);
      if (p.gulp > 0) rings.lineStyle(3,0xFFE28B,p.gulp / GLOMP.config.physics.gulpSeconds).drawCircle(x(p.x),y(p.y),(p.radius + GLOMP.config.physics.foodRadius * (1 - p.gulp / GLOMP.config.physics.gulpSeconds)) * s).lineStyle(0);
      if (p.immune > 0) rings.lineStyle(2,0xFFF4DC,0.75).drawCircle(x(p.x),y(p.y),p.radius * s + 5).lineStyle(0);
      if (w.mode === 'buffet' && p.playerId === w.leader) draw.text(view,'leader',GLOMP.i18n.text('crown'),x(p.x),y(p.y)-size*0.6-50,35,0xFFD24B,{center:true,outline:3,z:44});
      if (!p.npc) {
        draw.text(view,'worldName' + index,GLOMP.config.art.markerIcons[p.playerId] + ' ' + GLOMP.i18n.text('player',{number:p.playerId + 1}),x(p.x),y(p.y) - size * 0.6 - (w.mode === 'war' ? 39 : 14),19,0xffffff,{center:true,outline:4,z:42});
        if (p.safe) draw.text(view,'safe' + index,GLOMP.i18n.text('safe'),x(p.x),y(p.y) - size * 0.65 - 43,29,0xB6FF74,{center:true,outline:4,z:43});
      }
    });
  },
  cards: function (view,m) {
    const draw = GLOMP.view, t = GLOMP.i18n.text, c = GLOMP.config.ui.colors, w = m.world;
    w.players.filter(function (p) { return !p.npc; }).forEach(function (p,index) {
      const right = index % 2 === 1, x = right ? 1620 : 20, y = 20 + Math.floor(index / 2) * 110;
      const camera = GLOMP.hud.camera(m);
      const behind = w.players.some(function (q) { return q.alive && q.x * camera.scale + camera.x + q.radius * camera.scale > x && q.x * camera.scale + camera.x - q.radius * camera.scale < x + 280 && q.y * camera.scale + camera.y + q.radius * camera.scale > y && q.y * camera.scale + camera.y - q.radius * camera.scale < y + 94; });
      const opacity = behind ? 0.38 : 1;
      draw.panel(view,x,y,280,94,0x211C38,12,0.87 * opacity);
      draw.slime(view,'avatar' + index,x + 45,y + 48,64,Number(p.bodyColor.slice(4)),0,1,1,(p.alive ? 1 : 0.4) * opacity,110);
      draw.text(view,'cardName' + index,GLOMP.config.art.markerIcons[index] + ' ' + t('player',{number:index + 1}),x + 85,y + 10,22,c.cream,{alpha:opacity});
      draw.text(view,'cardSlices' + index,t('slices',{count:m.participants[index].slices,goal:GLOMP.config.slicesToWin}),x + 252,y + 10,22,c.yellow,{center:true,alpha:opacity});
      let label = ['eatEm','buffet','practice'].includes(w.mode) ? t('mass',{count:Math.floor(p.mass)}) : p.alive ? (w.mode === 'crazy' && p.safe ? t('safe') : t('ready')) : t('eliminated');
      if (w.mode === 'war') label = t('health',{value:Math.ceil(p.health)}) + ' · ' + t('ammo',{count:p.ammo.length});
      if (p.bot) label = t('autoControl');
      if (p.respawn > 0 && !p.alive) label = t('respawning',{seconds:Math.ceil(p.respawn)});
      draw.text(view,'cardStat' + index,label,x + 85,y + 41,20,p.alive ? c.cream : c.red,{alpha:opacity});
      const bar = ['eatEm','buffet'].includes(w.mode) ? Math.min(1,p.scale / GLOMP.config.player.maxScale) : w.mode === 'war' ? p.health / GLOMP.config.minigames.war.health : p.alive ? 1 : 0;
      view.graphics.beginFill(c.ink,opacity).drawRoundedRect(x + 85,y + 73,170,7,3).endFill().beginFill(GLOMP.config.art.markerColors[index],opacity).drawRoundedRect(x + 85,y + 73,170 * bar,7,3).endFill();
    });
  },
  results: function (view,m) {
    const draw = GLOMP.view,t = GLOMP.i18n.text,c = GLOMP.config.ui.colors, final = m.phase === 'final';
    draw.graphics(view,'resultsShade',180).beginFill(c.dark,0.92).drawRect(0,0,1920,1080).endFill(); view.overlayZ = 100;
    draw.text(view,'resultsTitle',t(final ? 'finalMatch' : 'results'),960,110,56,c.yellow,{center:true,outline:6});
    if (final) {
      draw.text(view,'winner',t(m.winners.length > 1 ? 'sharedWinners' : 'matchWinner',{names:m.winners.map(function (id) { return t('player',{number:id + 1}); }).join(', ')}),960,200,36,c.cream,{center:true});
    }
    m.rows.forEach(function (row,index) {
      const p = m.participants[row.player.playerId], y = 285 + index * 92;
      draw.graphics(view,'resultRow' + index,110).beginFill(row.place === 1 ? 0x76521D : 0x3B3356,0.96).drawRoundedRect(360,y,1200,78,12).endFill();
      draw.slime(view,'resultSlime' + index,420,y + 38,64,p.color,0,1,1,1,115);
      draw.text(view,'resultName' + index,String(row.place) + ' · ' + t('player',{number:p.playerId + 1}),475,y + 12,25,c.cream);
      const key = {eatEm:'resultMass',pom:'resultPom',crazy:'resultCrazy',buffet:'resultBuffet',war:'resultWar'}[m.world.mode];
      draw.text(view,'resultStat' + index,t(key,{value:Math.floor(['eatEm','buffet'].includes(m.world.mode) ? row.player.mass : m.world.mode === 'pom' ? row.player.stats.dodged : m.world.mode === 'war' ? row.player.health : row.player.stats.orders),devoured:row.player.stats.devoured,feasts:row.player.stats.feasts,eaten:row.player.stats.eaten}),475,y + 43,18,c.cream);
      draw.text(view,'resultEarn' + index,final ? t('earned',{coins:p.coins}) : t('roundReward',{slices:row.slices,coins:row.coins}),1030,y + 25,22,c.yellow);
      draw.text(view,'resultSlice' + index,t('slices',{count:p.slices,goal:GLOMP.config.slicesToWin}),1480,y + 22,28,c.cream,{center:true});
    });
    if (final) { GLOMP.ui.focus = 'returnRoom'; draw.button(view,'returnRoom',t('playAgain'),680,920,560,c.yellow); }
    else draw.text(view,'nextRound',t('nextRound',{seconds:Math.max(0,Math.ceil(GLOMP.config.round.resultsSeconds - m.phaseElapsed))}),960,950,30,c.cream,{center:true});
    view.overlayZ = 0;
  },
  render: function (scene,m) {
    const draw = GLOMP.view, view = draw.begin(scene), c = GLOMP.config.ui.colors, t = GLOMP.i18n.text, w = m.world;
    GLOMP.ui.buttons = []; GLOMP.hud.world(view,m); GLOMP.hud.cards(view,m);
    const duration = Math.min(GLOMP.config.round.maxSeconds,(GLOMP.config.minigames[w.mode] || {}).duration || GLOMP.config.round.maxSeconds), remaining = Math.max(0,Math.ceil(duration - w.elapsed));
    draw.panel(view,830,20,260,86,c.dark,12,0.88);
    const timer = draw.text(view,'timer',t('roundTime',{minutes:Math.floor(remaining / 60),seconds:String(remaining % 60).padStart(2,'0')}),960,21,55,remaining < duration / 3 ? c.red : c.cream,{center:true,outline:3});
    timer.scale.set(remaining < duration / 3 ? 1 + Math.sin(w.elapsed * 5) * 0.035 : 1);
    if (w.mode === 'crazy' && m.phase === 'playing') {
      draw.panel(view,620,116,680,60,c.dark,12,0.92);
      draw.text(view,'order',t(w.orderElapsed < GLOMP.config.minigames.crazy.announcementSeconds ? 'requestStarting' : 'request',{name:t('food' + w.requested)}) + ' · ' + Math.max(0,Math.ceil(w.stage.seconds + GLOMP.config.minigames.crazy.announcementSeconds - w.orderElapsed)),960,127,29,c.yellow,{center:true});
    }
    if (m.phase === 'intro') {
      draw.graphics(view,'introShade',90).beginFill(c.dark,0.80).drawRect(0,725,1920,355).endFill();
      const cap = w.mode.charAt(0).toUpperCase() + w.mode.slice(1);
      draw.text(view,'introRound',t('roundLabel',{number:m.round}) + ' · ' + t('map' + w.theme.charAt(0).toUpperCase() + w.theme.slice(1)),960,753,24,c.yellow,{center:true});
      draw.text(view,'introTitle',t('mode' + cap),960,795,58,c.cream,{center:true,outline:5});
      draw.text(view,'introRule',t('rule' + cap),960,877,29,c.cream,{center:true,wrap:1350});
      draw.text(view,'introAction',t('action' + cap),960,960,23,c.yellow,{center:true});
    }
    if (m.phase === 'countdown' || m.phase === 'launch') {
      draw.graphics(view,'countShade',90).beginFill(c.dark,0.20).drawRect(0,0,1920,1080).endFill();
      draw.text(view,'countdown',m.phase === 'launch' ? t('launch') : t('countdown',{number:Math.max(1,Math.ceil(GLOMP.config.round.countdownSeconds - m.phaseElapsed))}),960,420,m.phase === 'launch' ? 150 : 190,c.yellow,{center:true,middle:true,outline:12});
    }
    if (w.mode === 'eatEm' && w.sauce && m.phase === 'playing') draw.text(view,'notice',t('sauceWarning'),960,1020,23,c.cream,{center:true,outline:4});
    if (w.finalFeast && m.phase === 'playing') draw.text(view,'notice',t('finalFeast'),960,1020,26,c.yellow,{center:true,outline:4});
    if (w.mode === 'practice') draw.text(view,'practice',t('practiceBadge'),960,1015,25,c.cream,{center:true,outline:4});
    if (m.phase === 'results' || m.phase === 'final') GLOMP.hud.results(view,m);
    if (m.paused) {
      draw.graphics(view,'pauseShade',190).beginFill(c.dark,0.94).drawRect(0,0,1920,1080).endFill(); view.overlayZ = 100;
      draw.text(view,'pause',t('pauseTitle'),960,300,72,c.yellow,{center:true});
      draw.button(view,'resume',t('resume'),700,460,520,c.green); draw.button(view,'exit',t('playAgain'),700,590,520,c.blue); view.overlayZ = 0;
    }
  },
};
