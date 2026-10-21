// Namespace compartido; los módulos pendientes se implementan en su hito.
GLOMP.player = GLOMP.player || {};
GLOMP.match = GLOMP.match || {};
GLOMP.minigames = GLOMP.minigames || { eatEm: {}, pom: {}, crazy: {}, buffet: {}, war: {} };
GLOMP.boot = {
  pollElapsed: 0,
  gamepadSignature: null,
  diagnostics: { connectedCount: null, indices: [], apiAvailable: false, sixControllersVerified: false },
  onStart: function (scene) {
    if (typeof document !== 'undefined') document.title = GLOMP.i18n.text('bootTitle');
    if (GLOMP.save && typeof GLOMP.save.load === 'function') GLOMP.save.load();
    GLOMP.boot.pollElapsed = 0;
    GLOMP.boot.gamepadSignature = null;
    GLOMP.boot.scanGamepads(scene);
    if (scene.getGame && GLOMP.ui) GLOMP.ui.startBoot(scene);
  },
  scanGamepads: function (scene) {
    let pads = [], available = false;
    try {
      available = typeof navigator !== 'undefined' && typeof navigator.getGamepads === 'function';
      if (available) pads = Array.from(navigator.getGamepads() || []).filter(function (pad) { return pad && pad.connected; });
    } catch (error) { available = false; }
    const indices = pads.map(function (pad) { return pad.index; });
    const signature = String(available) + ':' + indices.join(',');
    const state = GLOMP.boot.diagnostics;
    state.connectedCount = pads.length; state.indices = indices; state.apiAvailable = available;
    if (signature !== GLOMP.boot.gamepadSignature) {
      GLOMP.boot.gamepadSignature = signature;
      console.info(GLOMP.i18n.text(available ? 'gamepadLog' : 'gamepadUnavailable', { count: pads.length, indices: indices.join(', ') }));
    }
  },
  onTick: function (scene, dt) {
    if (!Number.isFinite(dt) || dt < 0) return;
    GLOMP.boot.pollElapsed += dt;
    if (GLOMP.boot.pollElapsed >= GLOMP.config.diagnostics.gamepadPollSeconds) {
      GLOMP.boot.pollElapsed %= GLOMP.config.diagnostics.gamepadPollSeconds;
      GLOMP.boot.scanGamepads(scene);
    }
    if (scene.getGame && GLOMP.ui) GLOMP.ui.tickBoot(scene, dt);
  },
};
