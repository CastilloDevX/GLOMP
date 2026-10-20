// La sala es la pantalla principal: cada plaza tiene color y confirmación propios.
GLOMP.ui = {
  scene: null, focus: 'addRight', buttons: [], elapsed: 0, bootElapsed: 0, lobby: [],
  toast: '', toastElapsed: 0, pendingSource: null, capture: null, selectedPlayer: 0, selectedItem: 'body0', category: 'body', settingsPage: 'general', resetArmed: false,
  startBoot: function (scene) { GLOMP.input.bind(); GLOMP.view.load(scene); GLOMP.ui.bootElapsed = 0; },
  tickBoot: function (scene,dt) {
    GLOMP.ui.bootElapsed += dt;
    if (GLOMP.view.error) scene.getObjects('BootStatus').forEach(function (o) { o.setString(GLOMP.i18n.text('assetError')); });
    else if (GLOMP.view.ready && GLOMP.ui.bootElapsed >= GLOMP.config.ui.bootSeconds) GLOMP.ui.go(scene,'Menu');
  },
  go: function (scene,name) { GLOMP.input.pointerClick = null; gdjs.evtTools.runtimeScene.replaceScene(scene,name,false); },
  notify: function (key) { GLOMP.ui.toast = GLOMP.i18n.text(key); GLOMP.ui.toastElapsed = GLOMP.config.ui.toastSeconds; },
  onStart: function (scene) {
    const ui = GLOMP.ui; ui.scene = scene; ui.buttons = []; ui.elapsed = 0; ui.pendingSource = null; ui.capture = null;
    ui.focus = ['Menu','Lobby','Customize'].includes(scene.getName()) ? 'addRight' : 'back';
    if (!GLOMP.save.data) GLOMP.save.load();
    GLOMP.input.bind(); GLOMP.view.attach(scene); ui.render(scene);
  },
  moveFocus: function (direction) {
    const ui = GLOMP.ui, buttons = ui.buttons.filter(function (b) { return b.enabled; });
    const current = buttons.find(function (b) { return b.id === ui.focus; });
    if (!current) { if (buttons.length) ui.focus = buttons[0].id; return; }
    let best = null, score = Infinity;
    buttons.forEach(function (b) {
      const dx = b.x - current.x, dy = b.y - current.y;
      const main = direction === 'left' ? -dx : direction === 'right' ? dx : direction === 'up' ? -dy : dy;
      const cross = ['left','right'].includes(direction) ? Math.abs(dy) : Math.abs(dx);
      const cost = Math.hypot(dx,dy) + cross;
      if (main > 0 && cost < score) { best = b; score = cost; }
    });
    if (best) ui.focus = best.id;
  },
  sameSource: function (a,b) { return a.kind === b.kind && a.index === b.index; },
  join: function (source,confirmed) {
    const ui = GLOMP.ui;
    const existing = ui.lobby.find(function (p) { return ui.sameSource(p.source,source); });
    if (existing) { existing.ready = !existing.ready; existing.colorConfirmed = true; return; }
    if (ui.lobby.length >= GLOMP.save.data.settings.maxPlayers) { ui.notify('lobbyFull'); return; }
    if (ui.lobby.length >= GLOMP.config.player.maxKeyboardPlayers && (source.kind === 'keyboard' || ui.lobby.some(function (p) { return p.source.kind === 'keyboard'; }))) { ui.notify('controllersRequired'); return; }
    if (source.kind === 'keyboard' && !confirmed) { ui.pendingSource = source; ui.focus = 'confirmControls'; return; }
    ui.lobby.push({ playerId: ui.lobby.length, source: Object.assign({},source), color: GLOMP.save.data.equipped[ui.lobby.length]?.body ? Number(GLOMP.save.equipment(ui.lobby.length).body.slice(4)) : ui.lobby.length % GLOMP.config.art.bodyColors.length, colorConfirmed: false, ready: false, previousX: 0 });
    ui.pendingSource = null; ui.focus = 'ready:' + (ui.lobby.length - 1);
  },
  addKeyboard: function () {
    const ui = GLOMP.ui;
    for (let index = 0; index < GLOMP.config.player.maxKeyboardPlayers; index++) {
      if (!ui.lobby.some(function (p) { return p.source.kind === 'keyboard' && p.source.index === index; })) { ui.join({kind:'keyboard',index:index}); return; }
    }
    ui.notify('controllersRequired');
  },
  changeColor: function (player,delta) { player.color = (player.color + delta + GLOMP.config.art.bodyColors.length) % GLOMP.config.art.bodyColors.length; player.ready = false; player.colorConfirmed = false; },
  canStart: function () { return GLOMP.ui.lobby.length >= 2 && GLOMP.ui.lobby.every(function (p) { return p.ready && p.colorConfirmed && GLOMP.input.read(p.source).connected; }); },
  back: function (scene) {
    const ui = GLOMP.ui;
    if (ui.capture) { ui.capture = null; return; }
    if (ui.pendingSource) { ui.pendingSource = null; ui.focus = 'addRight'; return; }
    if (ui.settingsPage === 'keys') { ui.settingsPage = 'general'; return; }
    if (scene.getName() !== 'Menu') ui.go(scene,'Menu');
  },
  onTick: function (scene,dt) {
    if (!Number.isFinite(dt) || dt < 0) return;
    const ui = GLOMP.ui, input = GLOMP.input, room = ['Menu','Lobby','Customize'].includes(scene.getName());
    ui.elapsed += dt; ui.toastElapsed = Math.max(0,ui.toastElapsed - dt); input.update(dt);
    if (input.back) { ui.back(scene); ui.render(scene); return; }
    if (ui.capture) {
      input.pointerClick = null;
      const code = input.pressedCodes[0];
      if (code) {
        const keys = GLOMP.save.data.settings.keys;
        const duplicate = keys.some(function (mapping,index) { return Object.keys(mapping).some(function (action) { return !(index === ui.capture.player && action === ui.capture.action) && mapping[action] === code; }); });
        if (duplicate || ['Enter','Space','Escape'].includes(code)) ui.notify('keyUsed');
        else { keys[ui.capture.player][ui.capture.action] = code; GLOMP.save.write(); ui.capture = null; }
      }
      ui.render(scene); return;
    }
    let id = input.pointerClick; input.pointerClick = null;
    if (ui.pendingSource) {
      if (input.nav) ui.moveFocus(input.nav);
      if (input.confirm) id = ui.focus;
    } else if (room) {
      // Cada dispositivo mueve únicamente el selector de su jugador.
      ui.lobby.forEach(function (p) {
        const control = input.read(p.source), horizontal = control.x < -GLOMP.config.input.menuAxisThreshold ? -1 : control.x > GLOMP.config.input.menuAxisThreshold ? 1 : 0;
        if (horizontal && horizontal !== p.previousX) ui.changeColor(p,horizontal);
        if (horizontal && horizontal !== p.previousX) ui.focus = 'ready:' + p.playerId;
        p.previousX = horizontal;
        const vertical = control.y < -GLOMP.config.input.menuAxisThreshold ? -1 : control.y > GLOMP.config.input.menuAxisThreshold ? 1 : 0;
        if (p.playerId === 0 && vertical && vertical !== p.previousY) {
          const order = ['shop','customize','settings','credits','practice','play'];
          const current = order.indexOf(ui.focus);
          ui.focus = order[(current + vertical + order.length) % order.length];
        }
        p.previousY = vertical;
      });
      const host = ui.lobby[0], navigation = host && ['shop','customize','settings','credits','practice','play'].includes(ui.focus) && input.joining().some(function (source) { return ui.sameSource(source,host.source); });
      if (navigation) id = ui.focus;
      const startWithPad = ui.canStart() && host && host.source.kind === 'gamepad' && input.joining().some(function (source) { return ui.sameSource(source,host.source); });
      if (startWithPad && !navigation) id = 'play';
      input.joining().forEach(function (source) { if (!(host && (navigation || startWithPad) && ui.sameSource(source,host.source))) ui.join(source); });
      if (input.edges.Enter && ui.canStart()) id = 'play';
      else if ((input.edges.Enter || input.edges.Space) && !ui.lobby.length) id = ui.focus;
      // El mando usa A para confirmar su color; Enter es el inicio explícito del anfitrión.

      if (!ui.lobby.length && input.nav) ui.moveFocus(input.nav);
    } else {
      if (input.nav && scene.getName() === 'Settings' && ['music','effects','maxPlayers'].includes(ui.focus) && ['left','right'].includes(input.nav)) ui.adjustSetting(ui.focus,input.nav === 'right' ? 1 : -1);
      else if (input.nav) ui.moveFocus(input.nav);
      if (input.confirm) id = ui.focus;
    }
    if (id) {
      const button = ui.buttons.find(function (b) { return b.id === id && b.enabled; });
      if (button) ui.activate(scene,id);
    }
    ui.render(scene);
  },
  adjustSetting: function (id,delta) {
    const s = GLOMP.save.data.settings;
    s[id] = id === 'maxPlayers' ? Math.max(2,GLOMP.ui.lobby.length,Math.min(GLOMP.config.maxPlayers,s[id] + delta)) : Math.max(0,Math.min(1,Math.round((s[id] + delta * GLOMP.config.ui.volumeStep) * 100) / 100));
    if (id === 'effects' && GLOMP.ui.scene) GLOMP.ui.scene.getGame().getSoundManager().setGlobalVolume(s.effects * 100);
    GLOMP.save.write();
  },
  activate: function (scene,id) {
    const ui = GLOMP.ui;
    if (id === 'cancel') { ui.pendingSource = null; ui.focus = 'addRight'; return; }
    if (id === 'confirmControls' && ui.pendingSource) {
      const source = ui.pendingSource, keys = GLOMP.save.data.settings.keys[source.index], preset = GLOMP.config.input.keyboard[source.index];
      ['up','down','left','right'].forEach(function (action) { keys[action] = preset[action]; });
      GLOMP.save.write(); ui.join(source,true); return;
    }
    if (id === 'changeAction' && ui.pendingSource) { ui.capture = {player:ui.pendingSource.index,action:'action'}; return; }
    if (id === 'back') { ui.back(scene); return; }
    if (id === 'addLeft' || id === 'addRight') { ui.addKeyboard(); return; }
    if (id === 'play') { if (ui.canStart()) ui.go(scene,'Arena'); else ui.notify(ui.lobby.length < 2 ? 'needPlayers' : 'needReady'); return; }
    if (id.startsWith('left:') || id.startsWith('right:')) { const p = ui.lobby[Number(id.split(':')[1])]; if (p) ui.changeColor(p,id.startsWith('left') ? -1 : 1); return; }
    if (id.startsWith('ready:')) { const p = ui.lobby[Number(id.split(':')[1])]; if (p) { p.colorConfirmed = true; p.ready = !p.ready; } return; }
    if (id.startsWith('remove:')) { ui.lobby.splice(Number(id.split(':')[1]),1); ui.lobby.forEach(function (p,i) { p.playerId = i; p.ready = false; }); return; }
    if (id === 'practice') { GLOMP.sandbox.practice = true; ui.go(scene,'Sandbox'); return; }
    if(id==='customize'){ui.category='face';ui.selectedItem=GLOMP.save.equipment(ui.selectedPlayer).face;ui.go(scene,'Shop');return;}
    if (id === 'shop') { ui.category='featured';ui.selectedItem=GLOMP.shop.featured()[0].id;ui.go(scene,'Shop'); return; }
    if (id === 'settings') { ui.settingsPage = 'general'; ui.go(scene,'Settings'); return; }
    if (id === 'credits') { ui.go(scene,'Credits'); return; }
    if(GLOMP.shop.catalogue().some(function(e){return e.id===id;}))ui.selectedItem=id;
    if(id.startsWith('category:')){ui.category=id.slice(9);const list=ui.category==='featured'?GLOMP.shop.featured():GLOMP.shop.catalogue().filter(function(e){return e.category===ui.category;});ui.selectedItem=list[0].id;}
    if(id==='unequip')GLOMP.shop.clear(ui.category,ui.selectedPlayer);
    if(id==='buy'){const bought=GLOMP.shop.buy(ui.selectedItem);ui.notify(bought?'purchaseDone':'notEnoughCoins');if(bought)ui.focus='equip';}
    if(id==='equip') {
      const equipped=GLOMP.shop.equip(ui.selectedItem,ui.selectedPlayer);ui.notify(equipped?'equipped':'itemLocked');
      if(equipped&&ui.lobby[ui.selectedPlayer]) {
        const item=GLOMP.shop.catalogue().find(function(e){return e.id===ui.selectedItem;});
        if(['body','sets'].includes(item.category)){const p=ui.lobby[ui.selectedPlayer];p.color=Number(GLOMP.save.equipment(ui.selectedPlayer).body.slice(4));p.ready=false;p.colorConfirmed=false;}
      }
    }
    if (id === 'nextPlayer') ui.selectedPlayer = (ui.selectedPlayer + 1) % Math.max(1,ui.lobby.length);
    if (['music','effects','maxPlayers'].includes(id)) ui.adjustSetting(id,1);
    if (id === 'controls') { ui.settingsPage = 'keys'; ui.focus = 'key:0:action'; }
    if (id.startsWith('key:')) { const parts = id.split(':'); ui.capture = {player:Number(parts[1]),action:parts[2]}; }
    if (id === 'fullscreen' && typeof document !== 'undefined') {
      const operation = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
      if (operation && operation.catch) operation.catch(function () { ui.notify('fullscreenDenied'); });
    }
  },
  renderRoom: function (view) {
    const ui = GLOMP.ui, draw = GLOMP.view, t = GLOMP.i18n.text, c = GLOMP.config.ui.colors;
    draw.graphics(view,'roomShade',2).beginFill(0x102039,0.32).drawRect(0,0,1920,1080).endFill().beginFill(0x121D32,0.78).drawRect(0,0,1920,125).drawRect(0,891,1920,189).endFill();
    draw.image(view,'brand','title-glomp',190,63,300,100,{z:110});
    draw.text(view,'profile',t('profile'),395,27,21,c.cream);
    draw.text(view,'room',t('localProfile'),395,58,35,c.yellow,{outline:3});
    draw.panel(view,1460,24,420,74,c.dark,12,0.9);
    draw.text(view,'coins',t('coins',{count:GLOMP.save.data.coins}),1670,42,30,c.yellow,{center:true});
    draw.text(view,'roomSubtitle',t('roomSubtitle'),960,161,30,c.cream,{center:true,outline:4});
    draw.button(view,'shop',t('shop'),30,290,208,c.orange,true,80);
    draw.button(view,'customize',t('wardrobe'),30,395,208,c.pink,true,80);
    draw.button(view,'settings',t('settings'),30,500,208,c.blue,true,80);
    draw.button(view,'credits',t('credits'),1682,290,208,c.purple,true,80);
    draw.text(view,'readyCount',t('playersReady',{ready:ui.lobby.filter(function (p) { return p.ready; }).length,count:ui.lobby.length}),1785,405,25,c.cream,{center:true,outline:4});
    const count = Math.max(1,ui.lobby.length), width = Math.min(480,1260 / count), start = 960 - (count - 1) * width / 2;
    if (!ui.lobby.length) {
      draw.image(view,'heroPodium','ui-podium',960,708,560,175,{z:20});
      draw.slime(view,'hero',960,530,430,0,0,1,1,1,30);
      draw.text(view,'emptyHint',t('joinInstructions'),960,782,29,c.cream,{center:true,outline:4});
    }
    ui.lobby.forEach(function (p,index) {
      const x = start + index * width, connected = GLOMP.input.read(p.source).connected;
      const size = Math.min(340,width * 0.82), marker = GLOMP.config.art.markerIcons[index];
      draw.panel(view,x - width * 0.43,245,width * 0.86,69,c.dark,12,0.88);
      draw.text(view,'playerName' + index,marker + ' ' + t(count > 4 ? 'playerShort' : 'player',{number:index + 1}),x,255,count > 4 ? 22 : 29,c.cream,{center:true});
      draw.text(view,'device' + index,t(p.source.kind === 'keyboard' ? 'keyboardDevice' : 'gamepadDevice',{number:p.source.index + 1}),x,324,20,c.cream,{center:true,outline:3});
      draw.image(view,'podium'+index,'ui-podium',x,694,size*1.35,size*0.4,{z:22});
      draw.slime(view,'roomPlayer' + index,x,669 - size * 0.42 + Math.sin(ui.elapsed * GLOMP.config.ui.decorationRate + index) * GLOMP.config.ui.decorationBob,size,p.color,Number(GLOMP.save.equipment(p.playerId).face.slice(4)),1,1,connected ? 1 : 0.5,30,null,GLOMP.save.equipment(p.playerId));
      draw.text(view,'colorName' + index,t('color' + p.color),x,705,25,c.cream,{center:true,outline:3});
      const bw = Math.min(70,width * 0.19), left = x - width * 0.43;
      draw.button(view,'left:' + index,'‹',left,752,bw,c.blue,true,66);
      draw.button(view,'right:' + index,'›',x + width * 0.43 - bw,752,bw,c.blue,true,66);
      draw.button(view,'ready:' + index,t(!connected ? 'disconnected' : p.ready ? count > 4 ? 'readyCompact' : 'readyShort' : count > 4 ? 'confirmCompact' : 'notReadyShort'),left + bw + 6,752,width * 0.86 - bw * 2 - 12,p.ready ? c.green : c.yellow,connected,66);
      draw.button(view,'remove:' + index,'×',x + width * 0.43 - 34,247,32,c.red,true,32);
    });
    const canAdd = ui.lobby.length < GLOMP.save.data.settings.maxPlayers;
    draw.button(view,'addLeft',t('addPlayer'),255,645,82,c.blue,canAdd,82);
    draw.button(view,'addRight',t('addPlayer'),1583,645,82,c.blue,canAdd,82);
    draw.button(view,'practice',t('practice'),35,917,330,c.blue,true,84);
    draw.panel(view,400,927,935,124,c.dark,12,0.96);
    draw.text(view,'cup',t('cup'),440,941,32,c.cream);
    draw.text(view,'cupRule',t('cupRule',{count:GLOMP.config.slicesToWin}),440,991,22,c.yellow);
    draw.button(view,'play',t('play'),1380,929,500,c.yellow,ui.canStart(),118);
    draw.text(view,'roomHint',t(ui.lobby.length && ui.lobby.every(function (p) { return p.source.kind === 'gamepad'; }) ? 'roomHintPads' : 'roomHint',{action1:GLOMP.input.label(GLOMP.save.data.settings.keys[0].action),action2:GLOMP.input.label(GLOMP.save.data.settings.keys[1].action)}),960,855,21,c.cream,{center:true,outline:3});
    if (ui.pendingSource) ui.renderControls(view);
  },
  renderControls: function (view) {
    const draw = GLOMP.view, ui = GLOMP.ui, t = GLOMP.i18n.text, c = GLOMP.config.ui.colors, source = ui.pendingSource;
    // Los botones de debajo del modal no participan en foco ni en activación.
    ui.buttons = [];
    draw.graphics(view,'controlsShade',190).beginFill(c.dark,0.94).drawRect(0,0,1920,1080).endFill(); view.overlayZ = 100;
    const keys = GLOMP.save.data.settings.keys[source.index], preset = GLOMP.config.input.keyboard[source.index];
    draw.heading(view,'controlTitle',t('addTitle'),960,232,1100,45);
    draw.text(view,'controlPlayer',t('keyboardDevice',{number:source.index + 1}),960,325,32,c.cream,{center:true});
    draw.text(view,'controlKeys',t('keysPreset',{keys:[preset.up,preset.left,preset.down,preset.right].map(function (key) { return GLOMP.input.label(key); }).join(' / ')}),960,412,34,c.cream,{center:true});
    draw.text(view,'controlAction',t('actionPreset',{key:GLOMP.input.label(keys.action)}),960,475,30,c.cream,{center:true});
    draw.button(view,'changeAction',t('changeAction'),650,560,620,c.blue);
    draw.button(view,'confirmControls',t('confirmControls'),650,670,620,c.green);
    draw.button(view,'cancel',t('cancel'),650,780,620,c.red); view.overlayZ = 0;
  },
  renderShop: function(view) {
    const ui=GLOMP.ui,draw=GLOMP.view,t=GLOMP.i18n.text,c=GLOMP.config.ui.colors;
    const catalogue=GLOMP.shop.catalogue(),item=catalogue.find(function(e){return e.id===ui.selectedItem;})||catalogue[0];
    const equipment=GLOMP.shop.preview(item,ui.selectedPlayer);
    draw.image(view,'shopPodium','ui-podium',430,714,530,160,{z:105});
    if(equipment.trail)for(let n=0;n<4;n++)draw.image(view,'previewTrail'+n,equipment.trail,200+n*70,670+n*10,50,50,{z:108,alpha:(n+1)/4});
    draw.slime(view,'shopPreview',430,520,390,Number(equipment.body.slice(4)),Number(equipment.face.slice(4)),1,1,1,110,null,equipment);
    draw.text(view,'previewName',t(item.nameKey),430,790,32,c.cream,{center:true,outline:3});
    draw.button(view,'nextPlayer',t('player',{number:ui.selectedPlayer+1}),240,240,380,c.yellow);
    const categories=['featured','body','face','accessory','particles','trail','sets'];
    categories.forEach(function(category,index){draw.button(view,'category:'+category,t('category'+category),740+index*150,242,140,ui.category===category?c.yellow:c.blue,true,72);});
    const list=ui.category==='featured'?GLOMP.shop.featured():catalogue.filter(function(e){return e.category===ui.category;});
    list.forEach(function(e,index){
      const x=760+index%4*250,y=365+Math.floor(index/4)*145;
      draw.button(view,e.id,t(e.nameKey),x,y,220,e.color||c.purple,true,78);
      draw.text(view,'price'+index,t(GLOMP.shop.owned(e)?'owned':'price',{count:GLOMP.shop.price(e)}),x+110,y+88,20,c.cream,{center:true});
    });
    const owned=GLOMP.shop.owned(item);
    draw.button(view,owned?'equip':'buy',t(owned?'equip':'buyPrice',{count:GLOMP.shop.price(item)}),760,825,970,owned?c.green:c.yellow);
    if(['accessory','particles','trail'].includes(ui.category))draw.button(view,'unequip',t('unequip'),240,855,380,c.blue,true,70);
    draw.text(view,'cosmetic',t('cosmeticOnly'),1230,965,22,c.cream,{center:true});
  },
  renderSettings: function (view) {
    const ui = GLOMP.ui, draw = GLOMP.view, t = GLOMP.i18n.text, c = GLOMP.config.ui.colors, s = GLOMP.save.data.settings;
    if (ui.settingsPage === 'keys') {
      s.keys.forEach(function (keys,index) {
        draw.text(view,'preset' + index,t('keyboardDevice',{number:index + 1}),530 + index * 850,330,32,c.cream,{center:true});
        draw.text(view,'fixedKeys' + index,t('keysPreset',{keys:[keys.up,keys.left,keys.down,keys.right].map(GLOMP.input.label).join(' / ')}),530 + index * 850,430,25,c.cream,{center:true});
        draw.button(view,'key:' + index + ':action',t('actionPreset',{key:keys.action}),220 + index * 850,540,620,c.blue);
      });
    } else {
      [['music','musicVolume',Math.round(s.music * 100)],['effects','effectsVolume',Math.round(s.effects * 100)],['maxPlayers','maxPlayers',s.maxPlayers]].forEach(function (entry,index) {
        draw.button(view,entry[0],t(entry[1],{value:entry[2],count:entry[2]}),260,300 + index * 145,620,c.blue);
      });
      draw.button(view,'fullscreen',t('fullscreen'),1040,300,620,c.green); draw.button(view,'controls',t('remapKeyboard'),1040,445,620,c.yellow);
      draw.text(view,'settingsHint',t('settingsHints'),960,805,25,c.cream,{center:true});
    }
  },
  render: function (scene) {
    const ui = GLOMP.ui, draw = GLOMP.view, t = GLOMP.i18n.text, c = GLOMP.config.ui.colors, view = draw.begin(scene), name = scene.getName(); ui.buttons = [];
    draw.image(view,'background','menu-village',960,540,1920,1080,{fill:true,z:0});
    if (['Menu','Lobby','Customize'].includes(name)) ui.renderRoom(view);
    else {
      draw.graphics(view,'pageShade',2).beginFill(c.dark,0.86).drawRect(0,0,1920,1080).endFill();
      draw.image(view,'smallBrand','title-glomp',170,75,270,110,{z:110});
      draw.heading(view,'heading',t(name.toLowerCase()+'Title'),960,55,720,48);
      draw.text(view,'wallet',t('coins',{count:GLOMP.save.data.coins}),1720,65,28,c.cream,{center:true});
      draw.button(view,'back',t('back'),40,910,260,c.red);
      if (name === 'Shop') ui.renderShop(view);
      if (name === 'Settings') ui.renderSettings(view);
      if(name==='Credits'){draw.image(view,'banner','banner-original',1000,520,1200,675,{z:110});draw.text(view,'credits',t('creditsBody'),1000,895,28,c.cream,{center:true});draw.text(view,'fontCredit',t('fontCredit'),1000,950,22,c.cream,{center:true});}
    }
    if (ui.toastElapsed > 0) {
      draw.graphics(view,'toast',300).beginFill(c.cream,0.98).drawRoundedRect(430,150,1060,78,12).endFill();
      draw.text(view,'toast',ui.toast,960,170,25,c.chocolate,{center:true,z:310});
    }
    if (ui.capture) {
      draw.graphics(view,'capture',400).beginFill(c.dark,0.98).drawRoundedRect(400,390,1120,270,16).endFill();
      draw.text(view,'capture',t('pressNewKey'),960,485,36,c.cream,{center:true,z:410});
    }
  },
};
