// Estado y callbacks bajo GLOMP; sin temporizadores del navegador.
GLOMP.input = {
  keys: {}, previousKeys: {}, edges: {}, pads: [], previousPads: {}, pressedCodes: [], initialized: false,
  navTime: 0, navDirection: '', nav: '', confirm: false, back: false, pointerClick: null,
  bind: function () {
    if (GLOMP.input.initialized || typeof window === 'undefined') return;
    GLOMP.input.initialized = true;
    GLOMP.input.onDown = function (event) {
      GLOMP.input.keys[event.code] = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Tab'].includes(event.code)) event.preventDefault();
    };
    GLOMP.input.onUp = function (event) { delete GLOMP.input.keys[event.code]; };
    GLOMP.input.onBlur = function () { GLOMP.input.keys = {}; GLOMP.input.previousKeys = {}; };
    window.addEventListener('keydown', GLOMP.input.onDown);
    window.addEventListener('keyup', GLOMP.input.onUp);
    window.addEventListener('blur', GLOMP.input.onBlur);
  },
  update: function (dt) {
    const input = GLOMP.input, config = GLOMP.config.input;
    input.edges = {}; input.pressedCodes = [];
    Object.keys(input.keys).forEach(function (code) { if (!input.previousKeys[code]) { input.edges[code] = true; input.pressedCodes.push(code); } });
    input.previousKeys = Object.assign({}, input.keys);
    let pads = [];
    try { if (typeof navigator !== 'undefined' && navigator.getGamepads) pads = Array.from(navigator.getGamepads() || []).filter(function (pad) { return pad && pad.connected; }); } catch (error) { pads = []; }
    input.pads = pads.map(function (pad) {
      const before = input.previousPads[pad.index] || [];
      const buttons = Array.from(pad.buttons, function (button) { return !!button.pressed; });
      return { index: pad.index, axes: Array.from(pad.axes), buttons: buttons, edges: buttons.map(function (down, index) { return down && !before[index]; }) };
    });
    input.previousPads = {};
    input.pads.forEach(function (pad) { input.previousPads[pad.index] = pad.buttons; });
    input.confirm = !!(input.edges.Enter || input.edges.Space || input.edges.KeyE || input.pads.some(function (pad) { return pad.edges[config.confirmButton]; }));
    input.back = !!(input.edges.Escape || input.pads.some(function (pad) { return pad.edges[config.backButton]; }));
    let direction = '';
    if (input.keys.ArrowUp || input.keys.KeyW) direction = 'up';
    if (input.keys.ArrowDown || input.keys.KeyS) direction = 'down';
    if (input.keys.ArrowLeft || input.keys.KeyA) direction = 'left';
    if (input.keys.ArrowRight || input.keys.KeyD) direction = 'right';
    input.pads.forEach(function (pad) {
      if (pad.buttons[12] || pad.axes[1] < -config.menuAxisThreshold) direction = 'up';
      if (pad.buttons[13] || pad.axes[1] > config.menuAxisThreshold) direction = 'down';
      if (pad.buttons[14] || pad.axes[0] < -config.menuAxisThreshold) direction = 'left';
      if (pad.buttons[15] || pad.axes[0] > config.menuAxisThreshold) direction = 'right';
    });
    input.nav = '';
    if (direction !== input.navDirection) { input.navTime = 0; input.navDirection = direction; input.nav = direction; }
    else if (direction) {
      input.navTime += dt;
      if (input.navTime >= config.menuRepeatDelay) { input.nav = direction; input.navTime -= config.menuRepeatInterval; }
    }
  },
  axis: function (x, y) {
    const length = Math.hypot(x, y), config = GLOMP.config.input;
    if (length <= config.deadZone) return { x: 0, y: 0 };
    const strength = Math.pow(Math.min(1, (length - config.deadZone) / (1 - config.deadZone)), config.responsePower);
    return { x: x / length * strength, y: y / length * strength };
  },
  read: function (source) {
    const input = GLOMP.input;
    if (source.kind === 'keyboard') {
      const keys = GLOMP.save.data.settings.keys[source.index];
      let x = (input.keys[keys.right] ? 1 : 0) - (input.keys[keys.left] ? 1 : 0);
      let y = (input.keys[keys.down] ? 1 : 0) - (input.keys[keys.up] ? 1 : 0);
      const length = Math.hypot(x, y);
      if (length > 1) { x /= length; y /= length; }
      return { x: x, y: y, action: !!input.edges[keys.action], held: !!input.keys[keys.action], connected: true };
    }
    const pad = input.pads.find(function (pad) { return pad.index === source.index; });
    if (!pad) return { x: 0, y: 0, action: false, held: false, connected: false };
    return Object.assign(input.axis(pad.axes[0] || 0, pad.axes[1] || 0), { action: !!pad.edges[GLOMP.config.input.confirmButton], held: !!pad.buttons[GLOMP.config.input.confirmButton], connected: true });
  },
  joining: function () {
    const sources = [];
    GLOMP.save.data.settings.keys.forEach(function (keys, index) { if (GLOMP.input.edges[keys.action]) sources.push({ kind: 'keyboard', index: index }); });
    GLOMP.input.pads.forEach(function (pad) { if (pad.edges[GLOMP.config.input.confirmButton]) sources.push({ kind: 'gamepad', index: pad.index }); });
    return sources;
  },
};
