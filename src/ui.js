// Pantallas compartidas; la navegación y los botones se actualizan por dt.
GLOMP.ui = {
  scene: null, focus: 'play', buttons: [], elapsed: 0, bootElapsed: 0,
  lobby: [], toast: '', toastElapsed: 0, selectedPlayer: 0, selectedItem: 'body0', category: 'body',
  returnFromCustomize: 'Menu', capture: null, settingsPage: 'general', resetArmed: false,
  startBoot: function (scene) { GLOMP.input.bind(); GLOMP.view.load(scene); GLOMP.ui.bootElapsed = 0; },
  tickBoot: function (scene, dt) {
    GLOMP.ui.bootElapsed += dt;
    if (GLOMP.view.error) scene.getObjects('BootStatus').forEach(function (object) { object.setString(GLOMP.i18n.text('assetError')); });
    else if (GLOMP.view.ready && GLOMP.ui.bootElapsed >= GLOMP.config.ui.bootSeconds) GLOMP.ui.go(scene, 'Menu');
  },
  go: function (scene, name) { GLOMP.input.pointerClick = null; gdjs.evtTools.runtimeScene.replaceScene(scene, name, false); },
  notify: function (key) { GLOMP.ui.toast = GLOMP.i18n.text(key); GLOMP.ui.toastElapsed = GLOMP.config.ui.toastSeconds; },
  onStart: function (scene) {
    const ui = GLOMP.ui;
    ui.scene = scene; ui.buttons = []; ui.elapsed = 0; ui.capture = null; ui.resetArmed = false;
    const name = scene.getName();
    ui.focus = ({ Menu: 'play', Lobby: 'start', Customize: 'body0', Shop: 'body0', Settings: 'music', Credits: 'back' })[name] || 'back';
    if (!GLOMP.save.data) GLOMP.save.load();
    GLOMP.input.bind(); GLOMP.view.attach(scene); ui.render(scene);
  },
  moveFocus: function (direction) {
    const ui = GLOMP.ui, buttons = ui.buttons.filter(function (button) { return button.enabled; });
    const current = buttons.find(function (button) { return button.id === ui.focus; });
    if (!current) { if (buttons.length) ui.focus = buttons[0].id; return; }
    let best = null, bestScore = Infinity;
    buttons.forEach(function (button) {
      if (button === current) return;
      const dx = button.x - current.x, dy = button.y - current.y;
      const main = direction === 'right' ? dx : direction === 'left' ? -dx : direction === 'down' ? dy : -dy;
      const cross = direction === 'right' || direction === 'left' ? Math.abs(dy) : Math.abs(dx);
      const score = Math.hypot(dx, dy) + cross;
      if (main > 0 && score < bestScore) { best = button; bestScore = score; }
    });
    if (best) ui.focus = best.id;
  },
  join: function (source) {
    const ui = GLOMP.ui;
    const existing = ui.lobby.find(function (player) { return player.source.kind === source.kind && player.source.index === source.index; });
    if (existing) { existing.ready = !existing.ready; return; }
    if (ui.lobby.length >= GLOMP.save.data.settings.maxPlayers) { ui.notify('lobbyFull'); return; }
    if (ui.lobby.length >= 2 && (source.kind === 'keyboard' || ui.lobby.some(function (player) { return player.source.kind === 'keyboard'; }))) { ui.notify('controllersRequired'); return; }
    ui.lobby.push({ playerId: ui.lobby.length, source: source, ready: false });
  },
  canStart: function () { return GLOMP.ui.lobby.length >= 2 && GLOMP.ui.lobby.every(function (player) { return player.ready && GLOMP.input.read(player.source).connected; }); },
  onTick: function (scene, dt) {
    if (!Number.isFinite(dt) || dt < 0) return;
    const ui = GLOMP.ui, input = GLOMP.input;
    ui.elapsed += dt; ui.toastElapsed = Math.max(0, ui.toastElapsed - dt);
    input.update(dt);
    const name = scene.getName();
    if (ui.capture) {
      const code = input.pressedCodes[0];
      if (input.edges.Escape) ui.capture = null;
      else if (code) {
        const captured = ui.capture, keys = GLOMP.save.data.settings.keys;
        const duplicate = keys.some(function (mapping, player) { return Object.keys(mapping).some(function (action) { return !(player === captured.player && action === captured.action) && mapping[action] === code; }); });
        if (duplicate) ui.notify('keyUsed');
        else { keys[captured.player][captured.action] = code; GLOMP.save.write(); ui.capture = null; }
      }
      ui.render(scene); return;
    }
    if (input.back) { ui.back(scene); return; }
    if (name === 'Settings' && ['music', 'effects', 'maxPlayers'].includes(ui.focus) && ['left', 'right'].includes(input.nav)) ui.adjustSetting(ui.focus, input.nav === 'right' ? 1 : -1);
    else if (input.nav) ui.moveFocus(input.nav);
    let activation = input.pointerClick; input.pointerClick = null;
    const readyToStart = name === 'Lobby' && ui.canStart();
    if (name === 'Lobby') {
      if (readyToStart && input.confirm && ui.focus === 'start') activation = 'start';
      else input.joining().forEach(ui.join);
      if (input.edges.Enter && ui.canStart()) activation = 'start';
    } else if (input.confirm) activation = ui.focus;
    const button = ui.buttons.find(function (button) { return button.id === activation && button.enabled; });
    if (button) ui.activate(scene, button.id);
    ui.render(scene);
  },
  back: function (scene) {
    const ui = GLOMP.ui, name = scene.getName();
    if (name === 'Settings' && ui.settingsPage === 'keys') { ui.settingsPage = 'general'; ui.focus = 'controls'; return; }
    if (name === 'Customize') ui.go(scene, ui.returnFromCustomize);
    else if (name === 'Menu') { ui.focus = 'credits'; }
    else ui.go(scene, 'Menu');
  },
  adjustSetting: function (id, delta) {
    const settings = GLOMP.save.data.settings;
    if (id === 'maxPlayers') settings[id] = Math.max(Math.max(2, GLOMP.ui.lobby.length), Math.min(GLOMP.config.maxPlayers, settings[id] + delta));
    else settings[id] = Math.max(0, Math.min(1, Math.round((settings[id] + delta * GLOMP.config.ui.volumeStep) * 100) / 100));
    if (GLOMP.ui.scene) {
      const game = GLOMP.ui.scene.getGame(), sound = game.getSoundManager();
      if (sound && sound.setGlobalVolume) sound.setGlobalVolume(settings.effects * 100);
    }
    GLOMP.save.write();
  },
  activate: function (scene, id) {
    const ui = GLOMP.ui, name = scene.getName();
    if (id === 'back') { ui.back(scene); return; }
    if (name === 'Menu') {
      if (id === 'play') ui.go(scene, 'Lobby');
      if (id === 'practice') { GLOMP.sandbox.practice = true; ui.go(scene, 'Sandbox'); }
      if (id === 'shop') { ui.selectedItem = 'body0'; ui.go(scene, 'Shop'); }
      if (id === 'customize') { ui.returnFromCustomize = 'Menu'; ui.go(scene, 'Customize'); }
      if (id === 'settings') { ui.settingsPage = 'general'; ui.go(scene, 'Settings'); }
      if (id === 'credits') ui.go(scene, 'Credits');
    } else if (name === 'Lobby') {
      if (id.startsWith('slot')) { const player = ui.lobby[Number(id.slice(4))]; if (player) player.ready = !player.ready; }
      if (id === 'start' && ui.canStart()) { ui.returnFromCustomize = 'Lobby'; ui.selectedPlayer = 0; ui.go(scene, 'Customize'); }
    } else if (name === 'Customize' || name === 'Shop') {
      if (id.startsWith('body') || id.startsWith('face')) ui.selectedItem = id;
      if (id === 'tabBody') { ui.category = 'body'; ui.focus = 'body0'; }
      if (id === 'tabFace') { ui.category = 'face'; ui.focus = 'face0'; }
      if (id === 'nextPlayer') ui.selectedPlayer = (ui.selectedPlayer + 1) % Math.max(1, ui.lobby.length);
      if (id === 'buy') ui.notify(GLOMP.shop.buy(ui.selectedItem) ? 'purchaseDone' : 'notEnoughCoins');
      if (id === 'equip') ui.notify(GLOMP.shop.equip(ui.selectedItem, ui.selectedPlayer) ? 'equipped' : 'itemLocked');
      if (id === 'continue') { GLOMP.sandbox.practice = false; ui.go(scene, 'Sandbox'); }
    } else if (name === 'Settings') {
      if (['music', 'effects', 'maxPlayers'].includes(id)) ui.adjustSetting(id, 1);
      if (id === 'fullscreen' && typeof document !== 'undefined') {
        const operation = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
        if (operation && operation.catch) operation.catch(function () { ui.notify('fullscreenDenied'); });
      }
      if (id === 'controls') { ui.settingsPage = 'keys'; ui.focus = 'key:0:up'; }
      if (id.startsWith('key:')) { const parts = id.split(':'); ui.capture = { player: Number(parts[1]), action: parts[2] }; }
      if (id === 'reset') {
        if (ui.resetArmed) { GLOMP.save.reset(); ui.resetArmed = false; ui.notify('saveReset'); }
        else { ui.resetArmed = true; ui.notify('resetConfirm'); }
      }
    }
  },
  render: function (scene) {
    const ui = GLOMP.ui, draw = GLOMP.view, c = GLOMP.config.ui.colors;
    const view = draw.begin(scene), name = scene.getName(), text = GLOMP.i18n.text;
    ui.buttons = [];
    draw.image(view, 'background', 'menu-village', 800, 450, 1600, 900);
    if (name !== 'Menu') {
      view.graphics.beginFill(c.dark, 0.64).drawRect(0, 0, 1600, 900).endFill();
      draw.image(view, 'smallLogo', 'title-glomp', 195, 87, 300, 116);
      draw.text(view, 'heading', text(name.toLowerCase() + 'Title'), 820, 55, 52, c.yellow, { center: true, outline: 7 });
      draw.button(view, 'back', text('back'), 36, 760, 220, c.red);
    }
    draw.panel(view, 1320, 28, 240, 76, c.cream, 25);
    draw.text(view, 'coins', text('coins', { count: GLOMP.save.data.coins }), 1440, 49, 29, c.chocolate, { center: true });
    if (name === 'Menu') ui.renderMenu(view);
    if (name === 'Lobby') ui.renderLobby(view);
    if (name === 'Customize' || name === 'Shop') ui.renderCustomize(view, name);
    if (name === 'Settings') ui.renderSettings(view);
    if (name === 'Credits') {
      draw.image(view, 'originalBanner', 'banner-original', 900, 420, 1090, 605);
      draw.text(view, 'credit', text('creditsBody'), 930, 770, 24, c.cream, { center: true, wrap: 1000, weight: '600' });
    }
    draw.text(view, 'hints', text(name === 'Lobby' ? 'lobbyHints' : 'menuHints'), 800, 865, 22, name === 'Menu' ? c.chocolate : c.cream, { center: true, weight: '700' });
    if (ui.toastElapsed > 0) {
      draw.panel(view, 350, 650, 900, 82, c.cream, 20);
      draw.text(view, 'toast', ui.toast, 800, 673, 24, c.chocolate, { center: true });
    }
  },
  renderMenu: function (view) {
    const draw = GLOMP.view, ui = GLOMP.ui, c = GLOMP.config.ui.colors, t = GLOMP.i18n.text;
    draw.image(view, 'logo', 'title-glomp', 800, 260, 1040, 390);
    draw.text(view, 'tagline', t('tagline'), 800, 452, 35, c.cream, { center: true, outline: 6 });
    draw.panel(view, 656, 508, 288, 56, c.cream, 22);
    draw.text(view, 'local', t('localPlayers'), 800, 518, 24, c.chocolate, { center: true });
    GLOMP.config.art.bodyColors.slice(0, 4).forEach(function (color, index) {
      const x = index < 2 ? 150 + index * 160 : 1290 + (index - 2) * 160;
      draw.slime(view, 'decor' + index, x, 600 + Math.sin(ui.elapsed * GLOMP.config.ui.decorationRate + index) * GLOMP.config.ui.decorationBob, 150, index, 0);
    });
    draw.button(view, 'play', t('play'), 390, 590, 380, c.green);
    draw.button(view, 'practice', t('practice'), 830, 590, 380, c.yellow);
    draw.button(view, 'customize', t('customize'), 280, 731, 240, c.pink);
    draw.button(view, 'shop', t('shop'), 548, 731, 240, c.orange);
    draw.button(view, 'settings', t('settings'), 816, 731, 240, c.blue);
    draw.button(view, 'credits', t('credits'), 1084, 731, 240, c.purple);
  },
  renderLobby: function (view) {
    const ui = GLOMP.ui, draw = GLOMP.view, c = GLOMP.config.ui.colors, t = GLOMP.i18n.text;
    draw.text(view, 'lobbySubtitle', t('lobbySubtitle'), 800, 132, 24, c.cream, { center: true });
    for (let index = 0; index < GLOMP.config.maxPlayers; index++) {
      const player = ui.lobby[index], x = 236 + (index % 3) * 390, y = 204 + Math.floor(index / 3) * 256;
      draw.panel(view, x, y, 350, 224, c.cream, 25);
      draw.text(view, 'slotTitle' + index, t('player', { number: index + 1 }), x + 28, y + 15, 25, c.chocolate);
      draw.text(view, 'slotMarker' + index, GLOMP.config.art.markerIcons[index], x + 308, y + 17, 27, GLOMP.config.art.markerColors[index], { center: true, outline: 2 });
      if (player) {
        draw.slime(view, 'slotSlime' + index, x + 94, y + 132, 112, index, 0);
        const connected = GLOMP.input.read(player.source).connected;
        draw.text(view, 'slotDevice' + index, t(player.source.kind === 'keyboard' ? 'keyboardDevice' : 'gamepadDevice', { number: player.source.index + 1 }), x + 165, y + 66, 19, c.chocolate);
        draw.button(view, 'slot' + index, t(!connected ? 'disconnected' : player.ready ? 'ready' : 'notReady'), x + 162, y + 102, 166, player.ready && connected ? c.green : c.yellow, connected);
      } else {
        draw.text(view, 'slotEmpty' + index, t(index >= GLOMP.save.data.settings.maxPlayers ? 'slotDisabled' : 'joinPrompt'), x + 175, y + 113, 26, c.chocolate, { center: true, middle: true });
      }
    }
    draw.button(view, 'start', t('start'), 610, 760, 480, c.green, ui.canStart());
    draw.text(view, 'padCount', t('connectedPads', { count: GLOMP.input.pads.length }), 1450, 780, 23, c.cream, { center: true });
  },
  renderCustomize: function (view, name) {
    const ui = GLOMP.ui, draw = GLOMP.view, c = GLOMP.config.ui.colors, t = GLOMP.i18n.text;
    const equipment = GLOMP.save.equipment(ui.selectedPlayer);
    const item = GLOMP.shop.catalogue().find(function (item) { return item.id === ui.selectedItem; }) || GLOMP.shop.catalogue()[0];
    const body = item.category === 'body' ? item.index : Number(equipment.body.slice(4));
    const face = item.category === 'face' ? item.index : Number(equipment.face.slice(4));
    draw.panel(view, 290, 208, 474, 504, c.cream, 30);
    draw.slime(view, 'previewSlime', 527, 445, 310, body, face);
    draw.text(view, 'previewName', t(item.nameKey), 527, 615, 32, c.chocolate, { center: true });
    draw.button(view, 'nextPlayer', t('player', { number: ui.selectedPlayer + 1 }), 365, 205, 324, c.yellow);
    draw.button(view, 'tabBody', t('bodyTab'), 810, 192, 310, ui.category === 'body' ? c.yellow : c.cream);
    draw.button(view, 'tabFace', t('faceTab'), 1150, 192, 310, ui.category === 'face' ? c.yellow : c.cream);
    const items = GLOMP.shop.catalogue().filter(function (item) { return item.category === ui.category; });
    items.forEach(function (entry, index) {
      const x = 810 + (index % 4) * 166, y = 328 + Math.floor(index / 4) * 140;
      const owned = GLOMP.save.data.owned.includes(entry.id);
      draw.button(view, entry.id, entry.category === 'body' ? '' : t(entry.nameKey), x, y, 144, entry.color || c.cream);
      if (entry.category === 'body') draw.slime(view, 'itemSlime' + index, x + 72, y + 47, 76, entry.index, face);
      draw.text(view, 'itemPrice' + index, owned ? t('owned') : t('price', { count: entry.price }), x + 72, y + 103, 18, c.cream, { center: true });
    });
    const owned = GLOMP.save.data.owned.includes(item.id);
    draw.button(view, owned ? 'equip' : 'buy', t(owned ? 'equip' : 'buyPrice', { count: item.price }), 835, 637, 610, owned ? c.green : c.yellow);
    if (name === 'Customize' && ui.returnFromCustomize === 'Lobby') draw.button(view, 'continue', t('toArena'), 1060, 760, 480, c.green);
    draw.text(view, 'cosmeticOnly', t('cosmeticOnly'), 885, 770, 21, c.cream, { center: true, wrap: 300 });
  },
  renderSettings: function (view) {
    const ui = GLOMP.ui, draw = GLOMP.view, c = GLOMP.config.ui.colors, t = GLOMP.i18n.text, settings = GLOMP.save.data.settings;
    if (ui.settingsPage === 'keys') {
      ['up', 'down', 'left', 'right', 'action'].forEach(function (action, row) {
        settings.keys.forEach(function (keys, player) {
          const id = 'key:' + player + ':' + action;
          draw.button(view, id, t('binding', { player: player + 1, action: t(action), key: keys[action] }), 300 + player * 620, 180 + row * 108, 580, c.cream);
        });
      });
      if (ui.capture) draw.text(view, 'capture', t('pressNewKey'), 900, 795, 28, c.yellow, { center: true, outline: 3 });
      return;
    }
    draw.button(view, 'music', t('musicVolume', { value: Math.round(settings.music * 100) }), 310, 235, 580, c.cream);
    draw.button(view, 'effects', t('effectsVolume', { value: Math.round(settings.effects * 100) }), 940, 235, 580, c.cream);
    draw.button(view, 'maxPlayers', t('maxPlayers', { count: settings.maxPlayers }), 310, 385, 580, c.cream);
    draw.button(view, 'fullscreen', t('fullscreen'), 940, 385, 580, c.yellow);
    draw.button(view, 'controls', t('remapKeyboard'), 310, 535, 580, c.blue);
    draw.button(view, 'reset', t(ui.resetArmed ? 'confirmReset' : 'resetSave'), 940, 535, 580, c.red);
    draw.text(view, 'settingHints', t('settingsHints'), 920, 700, 25, c.cream, { center: true });
  },
};
