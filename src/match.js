// Partida completa: ninguna escena de sala despacha al patio de práctica.
GLOMP.match = {
  current: null,
  compatible: function (count) {
    return ['eatEm','pom','crazy','buffet','war'].filter(function (id) { const c = GLOMP.config.minigames[id]; return count >= c.minPlayers && count <= c.maxPlayers; });
  },
  create: function (participants, seed) {
    const m = { participants: participants.map(function (p,index) { return { playerId: index, source: Object.assign({},p.source), color: p.color === undefined ? index : p.color, slices: 0, coins: 0 }; }),
      rng: seed || GLOMP.config.sandbox.testSeed, round: 0, previous: null, phase: 'intro', phaseElapsed: 0, paused: false, rows: [], winners: [], completePaid: false };
    GLOMP.match.next(m); return m;
  },
  next: function (m) {
    const options = GLOMP.match.compatible(m.participants.length).filter(function (id) { return id !== m.previous; });
    if (!options.length) throw new Error('No hay dos minijuegos compatibles para alternar.');
    const mode = options[Math.floor(GLOMP.food.random(m) * options.length)];
    m.round++; m.previous = mode; m.phase = 'intro'; m.phaseElapsed = 0; m.rows = []; m.roundPaid = false; m.endingElapsed=0;
    let themes = GLOMP.config.arena.modeThemes[mode];
    if(themes.length>1)themes=themes.filter(function(t){return t!==m.previousTheme;});
    const theme=themes[Math.floor(GLOMP.food.random(m)*themes.length)];m.previousTheme=theme;
    m.world = GLOMP.maps.create(m.participants, theme, Math.floor(GLOMP.food.random(m) * 4294967296));
    m.world.mode = mode; m.world.round = m.round;
    GLOMP.minigames[mode].start(m.world);
    GLOMP.camera.update(m.world,0);
    m.world.players.forEach(function (p) { if (!p.npc) p.slices = m.participants[p.playerId].slices; });
  },
  rank: function (w) {
    const mode = GLOMP.minigames[w.mode], precision = GLOMP.config.round.tiePrecision;
    const rows = w.players.filter(function (p) { return !p.npc; }).map(function (p) { return { player: p, score: Math.round(mode.score(p,w) * precision) / precision }; });
    rows.sort(function (a,b) { return b.score - a.score || (w.mode === 'buffet' ? b.player.stats.feasts - a.player.stats.feasts : 0) || a.player.playerId - b.player.playerId; });
    rows.forEach(function (row,index) { row.place = index && row.score === rows[index-1].score && (w.mode !== 'buffet' || row.player.stats.feasts === rows[index-1].player.stats.feasts) ? rows[index-1].place : index + 1; });
    return rows;
  },
  finishRound: function (m) {
    if (m.roundPaid) return;
    m.roundPaid = true; m.rows = GLOMP.match.rank(m.world);
    const c = GLOMP.config, multiplier = m.participants.length >= c.economy.groupMinPlayers ? c.economy.groupMultiplier : 1;
    m.rows.forEach(function (row) {
      const p = m.participants[row.player.playerId];
      row.slices = row.place === 1 ? c.slices.first : row.place === 2 ? c.slices.second : 0;
      row.coins = Math.round((row.place === 1 ? c.economy.roundFirst : row.place === 2 ? c.economy.roundSecond : 0) * multiplier);
      p.slices += row.slices; p.coins += row.coins;
      GLOMP.save.data.coins += row.coins;
    });
    const eligible = m.rows.filter(function (r) { return m.participants[r.player.playerId].slices >= c.slicesToWin; });
    if (eligible.length) {
      const place = eligible[0].place;
      m.winners = eligible.filter(function (r) { return r.place === place; }).map(function (r) { return r.player.playerId; });
      GLOMP.match.payComplete(m);
    }
    GLOMP.save.write(); m.phase = 'results'; m.phaseElapsed = 0; m.resultsElapsed = 0;
  },
  payComplete: function (m) {
    if (m.completePaid) return;
    m.completePaid = true;
    const c = GLOMP.config.economy, multiplier = m.participants.length >= c.groupMinPlayers ? c.groupMultiplier : 1;
    m.participants.forEach(function (p) { const reward = Math.round((c.matchComplete + (m.winners.includes(p.playerId) ? c.matchWin : 0)) * multiplier); p.coins += reward; GLOMP.save.data.coins += reward; });
    const today = new Date().toLocaleDateString('en-CA');
    if (GLOMP.save.data.lastDailyMatch !== today) { GLOMP.save.data.coins += Math.round(c.firstDailyMatch * multiplier); GLOMP.save.data.lastDailyMatch = today; }
  },
  advance: function (m, dt, controls) {
    if (!Number.isFinite(dt) || dt < 0 || m.paused || m.phase === 'final') return;
    const c = GLOMP.config.round;
    dt = Math.min(dt, GLOMP.config.physics.maxFrameSeconds); m.phaseElapsed += dt;
    if (m.phase === 'intro' && m.phaseElapsed >= c.cinematicSeconds) { m.phase = 'countdown'; m.phaseElapsed = 0; }
    else if (m.phase === 'countdown' && m.phaseElapsed >= c.countdownSeconds) { m.phase = 'launch'; m.phaseElapsed = 0; }
    else if (m.phase === 'launch' && m.phaseElapsed >= c.launchSeconds) { m.phase = 'playing'; m.phaseElapsed = 0; m.world.accumulator = 0; }
    else if (m.phase === 'results' && m.phaseElapsed >= c.resultsSeconds) {
      if (m.winners.length) { m.phase = 'final'; m.phaseElapsed = 0; }
      else GLOMP.match.next(m);
    } else if (m.phase === 'playing') {
      const w = m.world, step = GLOMP.config.physics.fixedStep;
      w.pendingActions = w.pendingActions || [];
      controls.forEach(function (control,index) { w.pendingActions[index] = w.pendingActions[index] || !!control.action; });
      w.accumulator += dt;
      let first = true;
      while (w.accumulator + Number.EPSILON >= step && !w.over) {
        const sampled = controls.map(function (control,index) { return Object.assign({}, control, { action: first && w.pendingActions[index] }); });
        w.elapsed += step; GLOMP.minigames[w.mode].step(w,step,sampled);
        w.accumulator = Math.max(0,w.accumulator - step);
        if (first) w.pendingActions.fill(false); first = false;
        if (w.elapsed + Number.EPSILON >= Math.min(c.maxSeconds,GLOMP.config.minigames[w.mode].duration)) w.over = true;
      }
      if(w.over) {
        const feedback=w.mode==='pom'?GLOMP.config.minigames.pom.burstSeconds:w.mode==='war'?GLOMP.config.minigames.war.fallSeconds:0;
        m.endingElapsed+=dt;
        if(w.mode==='war')w.players.forEach(function(p){p.fall=Math.max(0,p.fall-dt);});
        if(m.endingElapsed>=feedback)GLOMP.match.finishRound(m);
      }
    }
    GLOMP.camera.update(m.world,dt);
  },
  onStart: function (scene) {
    if (!GLOMP.ui.canStart()) { GLOMP.ui.go(scene,'Menu'); return; }
    GLOMP.match.current = GLOMP.match.create(GLOMP.ui.lobby,Date.now() >>> 0);
    GLOMP.ui.scene = scene; GLOMP.ui.focus = 'resume'; GLOMP.ui.buttons = [];
    GLOMP.input.bind(); GLOMP.view.attach(scene); GLOMP.hud.render(scene,GLOMP.match.current);
  },
  onTick: function (scene,dt) {
    if (!Number.isFinite(dt) || dt < 0) return;
    const m = GLOMP.match.current, input = GLOMP.input, ui = GLOMP.ui;
    if (!m) return;
    ui.elapsed+=dt;input.update(dt);
    if(!m.paused&&(m.phase==='results'||m.phase==='final'))m.resultsElapsed=(m.resultsElapsed||0)+dt;
    if (input.back && m.phase !== 'final') { m.paused = !m.paused; ui.focus = 'resume'; }
    if (m.paused || m.phase === 'final') {
      if (input.nav) ui.moveFocus(input.nav);
      const id = input.pointerClick || (input.confirm ? ui.focus : null); input.pointerClick = null;
      if (id === 'resume') m.paused = false;
      if (id === 'exit' || id === 'returnRoom') { ui.lobby.forEach(function (p) { p.ready = false; }); ui.go(scene,'Menu'); return; }
    } else {
      input.pointerClick = null;
      const controls = m.world.players.map(function (p) { return p.npc ? { connected: false } : input.read(p.source); });
      GLOMP.match.advance(m,dt,controls);
    }
    GLOMP.hud.render(scene,m);
  },
};
