// Un perfil local compartido: compras y saldo; equipo independiente por jugador.
GLOMP.save = {
  data: null,
  storageAvailable: true,
  defaults: function () {
    return {
      version: 1, coins: 0, owned: ['body0', 'face0', 'face1', 'face2'], equipped: {},
      settings: { music: 0.8, effects: 0.8, maxPlayers: GLOMP.config.maxPlayers, keys: GLOMP.config.input.keyboard.map(function (keys) { return Object.assign({}, keys); }) },
    };
  },
  load: function () {
    const defaults = GLOMP.save.defaults();
    let stored;
    try { stored = JSON.parse(localStorage.getItem('glomp.save.v1') || 'null'); } catch (error) { GLOMP.save.storageAvailable = false; }
    if (stored && stored.version === defaults.version) {
      defaults.lastDailyMatch = typeof stored.lastDailyMatch === 'string' ? stored.lastDailyMatch : null;
      defaults.coins = Number.isSafeInteger(stored.coins) && stored.coins >= 0 ? stored.coins : 0;
      defaults.owned = Array.from(new Set(defaults.owned.concat(Array.isArray(stored.owned) ? stored.owned.filter(function (id) { return typeof id === 'string'; }) : [])));
      if (stored.equipped && typeof stored.equipped === 'object') defaults.equipped = stored.equipped;
      const settings = stored.settings || {};
      ['music', 'effects'].forEach(function (key) { if (Number.isFinite(settings[key])) defaults.settings[key] = Math.max(0, Math.min(1, settings[key])); });
      if (Number.isInteger(settings.maxPlayers)) defaults.settings.maxPlayers = Math.max(2, Math.min(GLOMP.config.maxPlayers, settings.maxPlayers));
      if (Array.isArray(settings.keys)) settings.keys.slice(0, GLOMP.config.player.maxKeyboardPlayers).forEach(function (keys, index) {
        Object.keys(defaults.settings.keys[index]).forEach(function (action) { if (typeof keys[action] === 'string' && /^[A-Za-z0-9]+$/.test(keys[action])) defaults.settings.keys[index][action] = keys[action]; });
      });
    }
    GLOMP.save.data = defaults;
    return defaults;
  },
  write: function () {
    try { localStorage.setItem('glomp.save.v1', JSON.stringify(GLOMP.save.data)); return true; }
    catch (error) { GLOMP.save.storageAvailable = false; return false; }
  },
  equipment: function (playerId) {
    const data = GLOMP.save.data;
    const saved = data.equipped[playerId] || {};
    return { body: data.owned.includes(saved.body) ? saved.body : 'body0', face: data.owned.includes(saved.face) ? saved.face : 'face0' };
  },
  reset: function () { GLOMP.save.data = GLOMP.save.defaults(); GLOMP.save.write(); },
};
