// La sala es la pantalla principal: cada plaza tiene color y confirmación propios.
GLOMP.ui = {
  scene: null, focus: 'addRight', buttons: [], elapsed: 0, bootElapsed: 0, lobby: [],
  toast: '', toastElapsed: 0, pendingSource: null, capture: null, selectedPlayer: 0, selectedItem: 'body0', category: 'body', shopPage: 0, settingsPage: 'general', resetArmed: false,
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
    if(id==='customize'){ui.shopPage=0;ui.category='face';ui.selectedItem=GLOMP.save.equipment(ui.selectedPlayer).face;ui.go(scene,'Shop');return;}
    if (id === 'shop') { ui.shopPage=0;ui.category='featured';ui.selectedItem=GLOMP.shop.featured()[0].id;ui.go(scene,'Shop'); return; }
    if (id === 'settings') { ui.settingsPage = 'general'; ui.go(scene,'Settings'); return; }
    if (id === 'credits') { ui.go(scene,'Credits'); return; }
    if(GLOMP.shop.catalogue().some(function(e){return e.id===id;}))ui.selectedItem=id;
    if(id.startsWith('category:')){ui.shopPage=0;ui.category=id.slice(9);const list=ui.category==='featured'?GLOMP.shop.featured():GLOMP.shop.catalogue().filter(function(e){return e.category===ui.category;});ui.selectedItem=list[0].id;}
    if(id==='unequip')GLOMP.shop.clear(ui.category,ui.selectedPlayer);
    if(id==='buy'){const bought=GLOMP.shop.buy(ui.selectedItem);ui.notify(bought?'purchaseDone':'notEnoughCoins');if(bought)ui.focus='equip';}
    if(id==='equip') {
      const equipped=GLOMP.shop.equip(ui.selectedItem,ui.selectedPlayer);ui.notify(equipped?'equipped':'itemLocked');
      if(equipped&&ui.lobby[ui.selectedPlayer]) {
        const item=GLOMP.shop.catalogue().find(function(e){return e.id===ui.selectedItem;});
        if(['body','sets'].includes(item.category)){const p=ui.lobby[ui.selectedPlayer];p.color=Number(GLOMP.save.equipment(ui.selectedPlayer).body.slice(4));p.ready=false;p.colorConfirmed=false;}
      }
    }
    if(id==='nextPlayer'||id==='prevPlayer'){const count=Math.max(1,ui.lobby.length);ui.selectedPlayer=(ui.selectedPlayer+(id==='nextPlayer'?1:-1)+count)%count;}
    if(id==='pageNext'||id==='pagePrev') {
      const list=ui.shopList(),size=GLOMP.config.ui.cartoon.cardPageSize,pages=Math.ceil(list.length/size);
      ui.shopPage=(ui.shopPage+(id==='pageNext'?1:-1)+pages)%pages;ui.selectedItem=list[ui.shopPage*size].id;
    }
    if (['music','effects','maxPlayers'].includes(id)) ui.adjustSetting(id,1);
    if (id === 'controls') { ui.settingsPage = 'keys'; ui.focus = 'key:0:action'; }
    if (id.startsWith('key:')) { const parts = id.split(':'); ui.capture = {player:Number(parts[1]),action:parts[2]}; }
    if (id === 'fullscreen' && typeof document !== 'undefined') {
      const operation = document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
      if (operation && operation.catch) operation.catch(function () { ui.notify('fullscreenDenied'); });
    }
  },
  renderRoom: function(view) {
    const ui=GLOMP.ui,d=GLOMP.view,t=GLOMP.i18n.text,c=GLOMP.config.ui.colors;
    d.panel(view,365,28,685,120,c.blue,35,.97);
    d.text(view,'profile',t('profile'),535,49,26,0xFFFFFF,{outline:4,stroke:0x103B8C});
    d.title(view,'room',t('localProfile'),770,86,43,c.yellow,{outline:10,stroke:5});
    d.image(view,'brand','title-glomp',247,85,490,164,{z:130});
    d.panel(view,1450,43,435,90,c.blue,38,.98);GLOMP.icons.draw(view,'wallet','coin',1504,89,66,125);
    d.title(view,'coins',t('coins',{count:GLOMP.save.data.coins}),1695,65,35,c.yellow,{outline:8,stroke:5});
    d.panel(view,555,173,810,76,c.blue,35,.78);
    d.text(view,'roomSubtitle',t('roomSubtitle'),960,193,27,0xFFFFFF,{center:true,outline:4,stroke:0x103B8C});
    d.button(view,'shop',t('shop'),28,250,350,c.orange,true,110);
    d.button(view,'customize',t('wardrobe'),28,376,350,c.pink,true,110);
    d.button(view,'settings',t('settings'),28,502,350,c.blue,true,110);
    d.button(view,'credits',t('credits'),1550,250,340,c.purple,true,110);
    d.panel(view,1595,379,290,63,c.dark,30,.92);GLOMP.icons.draw(view,'readyPeople','people',1634,410,40,123);
    d.text(view,'readyCount',t('playersReady',{ready:ui.lobby.filter(function(p){return p.ready;}).length,count:ui.lobby.length||GLOMP.save.data.settings.maxPlayers}),1760,392,27,0xFFFFFF,{center:true,outline:3,stroke:0x103B8C});
    const count=Math.max(1,ui.lobby.length),width=Math.min(480,1260/count),start=960-(count-1)*width/2;
    if(!ui.lobby.length) {
      const equipment=GLOMP.save.equipment(0),size=485;
      d.image(view,'heroPodium','ui-podium',960,791,590,150,{z:22});
      d.slime(view,'hero',960,740-size*GLOMP.config.animation.bodyAspect/2,size,Number(equipment.body.slice(4)),Number(equipment.face.slice(4)),1,1,1,30,null,equipment);
    }
    ui.lobby.forEach(function(p,index){
      const x=start+index*width,connected=GLOMP.input.read(p.source).connected,size=Math.min(365,width*.82),equipment=GLOMP.save.equipment(p.playerId);
      d.text(view,'device'+index,t(p.source.kind==='keyboard'?'keyboardDevice':'gamepadDevice',{number:p.source.index+1}),x,340,count>4?18:22,0xFFFFFF,{center:true,outline:4,stroke:0x103B8C});
      d.image(view,'podium'+index,'ui-podium',x,787,size*1.27,size*.32,{z:22});
      d.slime(view,'roomPlayer'+index,x,740-size*GLOMP.config.animation.bodyAspect/2+Math.sin(ui.elapsed*GLOMP.config.ui.decorationRate+index)*GLOMP.config.ui.decorationBob,size,p.color,Number(equipment.face.slice(4)),1,1,connected?1:.5,30,null,equipment);
      d.text(view,'colorName'+index,t('color'+p.color),x,791,count>4?20:25,0xFFFFFF,{center:true,outline:4,stroke:0x103B8C});
      const bw=Math.min(52,width*.17),left=x-width*.43;
      d.button(view,'left:'+index,'‹',left,833,bw,c.blue,true,55);
      d.button(view,'right:'+index,'›',x+width*.43-bw,833,bw,c.blue,true,55);
      const label=t('playerShort',{number:index+1})+' · '+t(!connected?'disconnected':p.ready?'readyCompact':'confirmCompact');
      d.button(view,'ready:'+index,label,left+bw+6,833,width*.86-bw*2-12,p.ready?c.green:c.yellow,connected,55);
      d.button(view,'remove:'+index,'×',x+width*.40-27,369,28,c.red,true,28);
    });
    const canAdd=ui.lobby.length<GLOMP.save.data.settings.maxPlayers,empty=ui.lobby.length===0;
    if(empty) {
      d.image(view,'joinPodiumLeft','ui-podium',500,791,290,87,{z:22});d.image(view,'joinPodiumRight','ui-podium',1420,791,290,87,{z:22});
    }
    d.button(view,'addLeft',t('addPlayer'),empty?438:270,650,empty?124:82,c.blue,canAdd,empty?118:82);
    d.button(view,'addRight',t('addPlayer'),empty?1358:1568,650,empty?124:82,c.blue,canAdd,empty?118:82);
    d.button(view,'practice',t('practice'),28,900,420,c.blue,true,102);
    d.panel(view,470,900,945,102,c.blue,35,.97);GLOMP.icons.draw(view,'cup','trophy',530,948,68,124);
    d.title(view,'cup',t('cup'),950,913,34,0xFFFFFF,{outline:8,stroke:5});
    d.text(view,'cupRule',t('cupRule',{count:GLOMP.config.slicesToWin}),950,960,22,c.yellow,{center:true,outline:3,stroke:0x103B8C});
    d.button(view,'play',t('play'),1440,900,445,c.yellow,ui.canStart(),102);
    const hint=!ui.lobby.length?t('joinInstructions'):t(ui.lobby.every(function(p){return p.source.kind==='gamepad';})?'roomHintPads':'roomHint',{action1:GLOMP.input.label(GLOMP.save.data.settings.keys[0].action),action2:GLOMP.input.label(GLOMP.save.data.settings.keys[1].action)});
    d.graphics(view,'footerHint',103).beginFill(0x17366F,.66).drawRoundedRect(420,1032,1080,39,20).endFill();
    d.text(view,'roomHint',hint,960,1040,18,0xFFFFFF,{center:true,outline:2,stroke:0x103B8C});
    if(ui.pendingSource)ui.renderControls(view);
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
  shopList: function() {return GLOMP.ui.category==='featured'?GLOMP.shop.featured():GLOMP.shop.catalogue().filter(function(e){return e.category===GLOMP.ui.category;});},
  renderShop: function(view) {
    const ui=GLOMP.ui,d=GLOMP.view,t=GLOMP.i18n.text,c=GLOMP.config.ui.colors;
    const catalogue=GLOMP.shop.catalogue(),item=catalogue.find(function(e){return e.id===ui.selectedItem;})||catalogue[0],equipment=GLOMP.shop.preview(item,ui.selectedPlayer);
    d.panel(view,65,242,550,78,c.blue,30,.96);
    d.text(view,'shopPlayer',t('player',{number:ui.selectedPlayer+1}),340,257,32,0xFFFFFF,{center:true,outline:4,stroke:0x103B8C});
    d.button(view,'prevPlayer','‹',76,251,58,c.orange,ui.lobby.length>1,58);d.button(view,'nextPlayer','›',548,251,58,c.orange,ui.lobby.length>1,58);
    d.image(view,'shopPodium','ui-podium',337,760,560,151,{z:105});
    if(equipment.trail)for(let n=0;n<4;n++)d.image(view,'previewTrail'+n,equipment.trail,105+n*74,745+n*8,45,45,{z:108,alpha:(n+1)/4});
    d.slime(view,'shopPreview',337,695-395*GLOMP.config.animation.bodyAspect/2,395,Number(equipment.body.slice(4)),Number(equipment.face.slice(4)),1,1,1,110,null,equipment);
    d.panel(view,130,804,415,64,c.blue,30,.98);d.text(view,'previewName',t(item.nameKey),337,817,29,0xFFFFFF,{center:true,outline:4,stroke:0x103B8C});
    const categories=['featured','body','face','accessory','particles','trail','sets'];
    categories.forEach(function(category,index){d.button(view,'category:'+category,t('category'+category),682+index*169,242,159,ui.category===category?c.yellow:c.blue,true,76);});
    const list=ui.shopList(),pageSize=GLOMP.config.ui.cartoon.cardPageSize,pages=Math.ceil(list.length/pageSize);
    ui.shopPage=Math.min(ui.shopPage,Math.max(0,pages-1));
    list.slice(ui.shopPage*pageSize,(ui.shopPage+1)*pageSize).forEach(function(e,index){
      const x=696+index%3*398,y=347+Math.floor(index/3)*264,w=374,h=246,selected=ui.selectedItem===e.id;
      d.hit(view,e.id,x,y,w,h,true);
      d.graphics(view,'catalogue'+index,106).lineStyle(6,0x103B8C).beginFill(0x1261CB).drawRoundedRect(x,y,w,h,28).endFill().lineStyle(3,0xD6F8FF).drawRoundedRect(x+4,y+4,w-8,h-8,25).lineStyle(0).beginFill(0x45CEFF,.32).drawRoundedRect(x+10,y+10,w-20,h*.52,20).endFill();
      if(selected||ui.focus===e.id)d.graphics(view,'cardFocus'+index,107).lineStyle(5,0xFFE147).drawRoundedRect(x-3,y-3,w+6,h+6,28).lineStyle(0);
      const preview=GLOMP.shop.preview(e,ui.selectedPlayer);
      d.slime(view,'cardSlime'+index,x+w/2,y+115,151,Number(preview.body.slice(4)),Number(preview.face.slice(4)),1,1,1,110,null,preview);
      d.graphics(view,'cardLabel'+index,113).beginFill(0x0751B4,.96).drawRoundedRect(x+10,y+171,w-20,66,16).endFill();
      d.text(view,'cardName'+index,t(e.nameKey),x+w/2,y+174,26,0xFFFFFF,{center:true,outline:3,stroke:0x103B8C});
      const owned=GLOMP.shop.owned(e);if(!owned)GLOMP.icons.draw(view,'priceCoin'+index,'coin',x+85,y+217,28,124);
      d.text(view,'price'+index,t(owned?'owned':'price',{count:GLOMP.shop.price(e)}),x+w/2+(owned?0:8),y+207,23,owned?0xBEFF93:0xFFFFFF,{center:true,outline:3,stroke:0x103B8C});
    });
    if(pages>1){d.button(view,'pagePrev','‹',1110,883,56,c.blue,true,42);d.button(view,'pageNext','›',1408,883,56,c.blue,true,42);d.text(view,'page',t('cataloguePage',{page:ui.shopPage+1,pages:pages}),1287,889,24,0xFFFFFF,{center:true,outline:3,stroke:0x103B8C});}
    const owned=GLOMP.shop.owned(item);
    d.button(view,owned?'equip':'buy',t(owned?'equip':'buyPrice',{count:GLOMP.shop.price(item)}),740,941,1125,owned?c.green:c.yellow,true,89);
    if(['accessory','particles','trail'].includes(ui.category))d.button(view,'unequip',t('unequip'),130,877,415,c.blue,true,46);
    d.text(view,'cosmetic',t('cosmeticOnly'),1285,1045,19,0xFFFFFF,{center:true,outline:3,stroke:0x103B8C});
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
      draw.graphics(view,'pageShade',2).beginFill(c.dark,name==='Shop'?0.08:0.6).drawRect(0,0,1920,1080).endFill();
      draw.image(view,'smallBrand','title-glomp',190,87,350,125,{z:125});
      draw.heading(view,'heading',t(name.toLowerCase()+'Title'),960,54,770,62);
      draw.panel(view,1495,51,390,83,c.blue,35,.98);GLOMP.icons.draw(view,'wallet','coin',1538,93,54,124);draw.title(view,'wallet',t('coins',{count:GLOMP.save.data.coins}),1712,73,31,c.yellow,{outline:8,stroke:5});
      draw.button(view,'back',t('back'),35,930,310,c.red);
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
