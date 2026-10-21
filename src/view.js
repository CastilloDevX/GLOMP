// Dibujo mediante el renderizador incluido en GDevelop; sin otro bucle de juego.
GLOMP.view = {
  assets: {}, textures: {}, ready: false, error: false,
  attach: function (scene) {
    const view = { root: new PIXI.Container(), graphics: new PIXI.Graphics(), items: {}, scene: scene };
    view.root.eventMode = 'none'; view.root.interactiveChildren = false; view.root.sortableChildren = true; view.graphics.zIndex = 100; view.root.addChild(view.graphics);
    scene.getLayer('').getRenderer().getRendererObject().addChild(view.root);
    scene.__glompView = view;
    return view;
  },
  load: function (scene) {
    const manager = scene.getGame().getImageManager();
    GLOMP.view.ready = false; GLOMP.view.error = false;
    const fonts=scene.getGame().getFontManager();
    const fontPromise=fonts.loadResource('assets/fonts/LilitaOne-Regular.ttf').then(function(){
      GLOMP.view.fontFamily=fonts.getFontFamily('assets/fonts/LilitaOne-Regular.ttf');
      return document.fonts.load('32px "'+GLOMP.view.fontFamily+'"');
    });
    Promise.all([fontPromise].concat(Object.keys(GLOMP.art).map(function (id) {
      const asset = GLOMP.art[id];
      return manager.loadResource(asset.file).then(function () {
        const texture = manager.getPIXITexture(asset.file);
        if (!texture.valid || texture.width <= 1) throw new Error('Recurso no disponible: ' + id);
        if (asset.pixel) texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        GLOMP.view.textures[id] = asset.bounds ? new PIXI.Texture(texture.baseTexture, new PIXI.Rectangle(asset.bounds.x, asset.bounds.y, asset.bounds.width, asset.bounds.height)) : texture;
      });
    }))).then(function () { GLOMP.view.ready = true; }).catch(function (error) { GLOMP.view.error = true; console.error(GLOMP.i18n.text('assetError'),error); });
  },
  begin: function (scene) {
    const view = scene.__glompView;
    view.graphics.clear(); view.overlayZ = 0; view.panelIndex=0;
    Object.keys(view.items).forEach(function (key) { view.items[key].visible = false; });
    const game = scene.getGame(), config = GLOMP.config.ui;
    const scale = Math.min(game.getGameResolutionWidth() / config.width, game.getGameResolutionHeight() / config.height);
    view.root.scale.set(scale);
    view.root.position.set((game.getGameResolutionWidth() - config.width * scale) / 2, (game.getGameResolutionHeight() - config.height * scale) / 2);
    return view;
  },
  item: function (view, key, factory) {
    if (!view.items[key]) { view.items[key] = factory(); view.root.addChild(view.items[key]); }
    view.items[key].visible = true;
    return view.items[key];
  },
  text: function (view, key, text, x, y, size, color, options) {
    options = options || {};
    const item = GLOMP.view.item(view, 'text:' + key, function () { return new PIXI.Text('', { fontFamily: GLOMP.view.fontFamily || 'Lilita One, DejaVu Sans, sans-serif', fontWeight: '900', lineJoin: 'round' }); });
    if (item.text !== String(text)) item.text = String(text);
    item.style.fontSize = size; item.style.fill = color;
    item.style.stroke = options.stroke || GLOMP.config.ui.colors.chocolate;
    item.style.strokeThickness = options.outline || 0;
    item.style.align = options.align || 'left';
    item.style.fontWeight = options.weight || '400';
    item.style.fontFamily = options.body ? 'DejaVu Sans, sans-serif' : (GLOMP.view.fontFamily || 'Lilita One, DejaVu Sans, sans-serif');
    item.style.wordWrap = !!options.wrap; item.style.wordWrapWidth = options.wrap || GLOMP.config.ui.width;
    item.anchor.set(options.center ? 0.5 : 0, options.middle ? 0.5 : 0);
    item.zIndex = (view.overlayZ || 0) + (options.z === undefined ? 120 : options.z);
    item.position.set(x, y); item.alpha = options.alpha === undefined ? 1 : options.alpha;
    return item;
  },
  image: function (view, key, id, x, y, width, height, options) {
    if (!GLOMP.view.textures[id]) return null;
    options = options || {};
    const sprite = GLOMP.view.item(view, 'image:' + key, function () { const item = new PIXI.Sprite(); item.anchor.set(0.5); return item; });
    sprite.texture = GLOMP.view.textures[id];
    const scale = Math.min(width / sprite.texture.width, height / sprite.texture.height);
    sprite.scale.set(scale * (options.scaleX || 1), scale * (options.scaleY || 1));
    sprite.position.set(x, y); sprite.rotation = options.rotation || 0; sprite.tint = options.tint === undefined ? 0xffffff : options.tint;
    sprite.alpha = options.alpha === undefined ? 1 : options.alpha;
    sprite.zIndex = (view.overlayZ || 0) + (options.z === undefined ? (id === 'menu-village' ? 0 : 30) : options.z);
    if (options.fill) sprite.scale.set(width / sprite.texture.width, height / sprite.texture.height);
    return sprite;
  },
  panel: function(view,x,y,width,height,color,radius,alpha) {
    const key='panel:'+(view.panelIndex++);
    if(GLOMP.view.textures['ui-panel'])GLOMP.view.nine(view,key,'ui-panel',x,y,width,height,0xffffff,alpha,105);
    else view.graphics.beginFill(color,alpha===undefined?1:alpha).drawRoundedRect(x,y,width,height,radius||20).endFill();
  },
  hit: function(view,id,x,y,width,height,enabled) {
    GLOMP.ui.buttons.push({id:id,x:x+width/2,y:y+height/2,width:width,height:height,enabled:enabled!==false});
  },
  mix: function(color,target,amount) {
    const channel=function(shift){return Math.round((color>>shift&255)*(1-amount)+(target>>shift&255)*amount);};
    return channel(16)<<16|channel(8)<<8|channel(0);
  },
  surfaceTexture: function(width,height,color,focused) {
    const d=GLOMP.view;d.skinCache=d.skinCache||{};
    const key=[Math.round(width),Math.round(height),color,focused].join(':');if(d.skinCache[key])return d.skinCache[key];
    const canvas=document.createElement('canvas');canvas.width=Math.ceil(width);canvas.height=Math.ceil(height);
    const board=width>1000&&height>400;
    const g=canvas.getContext('2d'),edge=Math.max(1,Math.min(4,height/18)),radius=Math.min(height/2,width/2,36);
    const hex=function(n){return '#'+n.toString(16).padStart(6,'0');};
    const path=function(inset,offset){const x=inset,y=inset+offset,w=width-inset*2,h=height-inset*2-offset,r=Math.max(1,Math.min(radius-inset,h/2,w/2));g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();};
    path(0,0);g.fillStyle='#092B63';g.fill();
    path(edge,0);g.fillStyle=focused?'#FFE974':'#D9F7FF';g.fill();
    path(edge*1.65,0);g.fillStyle='#0D417D';g.fill();
    path(edge*2.3,0);const gradient=g.createLinearGradient(0,0,0,height);gradient.addColorStop(0,hex(d.mix(color,0xFFFFFF,board?.08:.38)));gradient.addColorStop(.38,hex(d.mix(color,0xFFFFFF,board?0:.08)));gradient.addColorStop(1,hex(d.mix(color,0x082951,.32)));g.fillStyle=gradient;g.fill();
    g.save();path(edge*2.4,0);g.clip();g.beginPath();g.ellipse(width*.47,-height*.18,width*.7,height*.63,0,0,Math.PI*2);g.fillStyle=board?'rgba(255,255,255,.025)':'rgba(255,255,255,.16)';g.fill();g.restore();
    d.skinCache[key]=PIXI.Texture.from(canvas);return d.skinCache[key];
  },
  surface: function(view,key,x,y,width,height,color,focused,z) {
    const item=GLOMP.view.item(view,'surface:'+key,function(){return new PIXI.Sprite();});
    item.texture=GLOMP.view.surfaceTexture(width,height,color,!!focused);item.position.set(x,y);item.width=width;item.height=height;
    item.zIndex=(view.overlayZ||0)+(z===undefined?150:z);item.alpha=1;return item;
  },
  button: function(view,id,label,x,y,width,color,enabled,height,icon) {
    const d=GLOMP.view,c=GLOMP.config.ui.colors,ui=GLOMP.ui;height=height||GLOMP.config.ui.buttonHeight;
    d.hit(view,id,x,y,width,height,enabled);
    const active=enabled!==false,focused=active&&ui.focus===id;
    const pressed=active&&GLOMP.input.pointerHeld===id,offset=pressed?GLOMP.config.ui.polish.pressOffset:0;
    const symbols=id==='addLeft'||id==='addRight'?'plus':id.startsWith('remove:')?'close':id.startsWith('left:')||id==='prevPlayer'||id==='pagePrev'?'left':id.startsWith('right:')||id==='nextPlayer'||id==='pageNext'?'right':null;
    if(symbols){
      const size=Math.min(width,height)-(pressed?GLOMP.config.ui.polish.pressOffset*2:0);
      const mark=GLOMP.icons.draw(view,'button:'+id,symbols,x+width/2,y+height/2+offset,size,153);if(mark)mark.alpha=active?1:.42;
      if(focused)d.graphics(view,'buttonFocus:'+id,154).lineStyle(3,0xFFE76B,.9).drawRoundedRect(x+1,y+1,width-2,height-2,Math.min(width,height)*.27).lineStyle(0);
      return;
    }
    const skin=d.surface(view,'button:'+id,x,y+offset,width,height-offset,active?color:d.mix(color,0x7788A2,.8),focused,150);
    skin.alpha=active?1:.85;
    const icons={shop:'shop',customize:'shirt',settings:'gear',credits:'credits',practice:'gamepad',play:'play',buy:'coin',equip:'check',back:'back',returnRoom:'gamepad',resume:'play',exit:'back',music:'music',effects:'sound',maxPlayers:'people',fullscreen:'fullscreen',controls:'keyboard',changeAction:'keyboard',confirmControls:'check',cancel:'close',unequip:'close'};
    icon=icon||icons[id];if(id.startsWith('key:'))icon='keyboard';
    if(id.startsWith('category:')) {
      icon={featured:'star',body:'color',face:'face',accessory:'hat',particles:'particles',trail:'trail',sets:'gift'}[id.slice(9)];
      const mark=GLOMP.icons.draw(view,'button:'+id,icon,x+width/2,y+height*.32+offset,Math.min(52,height*.54),153);if(mark)mark.alpha=active?1:.65;
      const text=d.text(view,'button:'+id,label,x+width/2,y+height*.79+offset,20,0xFFFFFF,{center:true,middle:true,z:154,outline:3,stroke:0x123B88});
      if(text.width>width-14)text.style.fontSize=Math.max(14,Math.floor(20*(width-14)/text.width));return;
    }
    const hasIcon=icon&&width>=132,iconSize=Math.min(height*.80,84),left=hasIcon?height*.94:12;
    if(hasIcon){const mark=GLOMP.icons.draw(view,'button:'+id,icon,x+height*.52,y+height/2+offset,iconSize,153);if(mark)mark.alpha=active?1:.65;}
    const font=Math.min(width<132?44:38,height*.42),available=width-left-12;
    const text=d.text(view,'button:'+id,label,x+left+available/2,y+height/2+offset,font,0xFFFFFF,{center:true,middle:true,z:154,outline:Math.min(4,height*.05),stroke:0x123B88});
    if(text.width>available)text.style.fontSize=Math.max(12,Math.floor(font*available/text.width));text.alpha=active?1:.8;
  },
  graphics: function (view,key,z) {
    const g = GLOMP.view.item(view,'graphics:' + key,function () { return new PIXI.Graphics(); });
    g.clear(); g.zIndex = (view.overlayZ || 0) + z; return g;
  },
  nine: function(view,key,id,x,y,width,height,tint,alpha,z) {
    const texture=GLOMP.view.textures[id];if(!texture)return null;
    const border=Math.min(texture.width,texture.height)*0.32;
    const item=GLOMP.view.item(view,'nine:'+key,function(){return new PIXI.NineSlicePlane(texture,border,border,border,border);});
    item.position.set(x,y);item.width=width;item.height=height;item.tint=tint===undefined?0xffffff:tint;
    item.alpha=alpha===undefined?1:alpha;item.zIndex=(view.overlayZ||0)+(z===undefined?110:z);return item;
  },
  title: function(view,key,label,x,y,size,color,options) {
    options=options||{};
    const item=GLOMP.view.item(view,'title:'+key,function(){const root=new PIXI.Container();root.inner=new PIXI.Text('');root.addChild(root.inner);return root;});
    const text=item.inner;
    text.style={fontFamily:GLOMP.view.fontFamily,fontSize:size,fontWeight:'400',lineJoin:'round',fill:color,align:'center',stroke:0x102D6D,strokeThickness:options.stroke||6,dropShadow:true,dropShadowColor:0x051B48,dropShadowDistance:2,dropShadowBlur:0,dropShadowAlpha:.7};
    text.text=String(label);text.anchor.set(.5,options.middle?.5:0);
    const fit=Math.min(1,options.maxWidth?options.maxWidth/text.width:1,options.maxHeight?options.maxHeight/text.height:1);
    if(fit<1)text.style.fontSize=Math.max(12,Math.floor(size*fit));
    item.position.set(x,y);item.scale.set(options.scale||1);item.rotation=0;item.alpha=options.alpha===undefined?1:options.alpha;
    item.zIndex=(view.overlayZ||0)+(options.z===undefined?122:options.z);return item;
  },
  heading: function(view,key,label,x,y,width,size) {
    const ribbon=GLOMP.view.image(view,'ribbon:'+key,'ui-ribbon',x,y+size*.65,width,size*2.7,{fill:true,z:111});
    const height=ribbon?ribbon.height:size*2.7;
    return GLOMP.view.title(view,key,label,x,y+size*.65,size,0xFFFFFF,{z:112,middle:true,stroke:6,maxWidth:(ribbon?ribbon.width:width)*.72,maxHeight:height*.48});
  },
  slime: function(view,key,x,y,size,bodyIndex,faceIndex,sx,sy,alpha,z,player,equipment) {
    return GLOMP.rig.draw(view,key,x,y,size,bodyIndex,faceIndex,alpha,z,player,equipment);
  },
};
