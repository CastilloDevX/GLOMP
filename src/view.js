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
    }))).then(function () { GLOMP.view.ready = true; }).catch(function () { GLOMP.view.error = true; });
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
  button: function(view,id,label,x,y,width,color,enabled,height,icon) {
    const c=GLOMP.config.ui.colors,ui=GLOMP.ui; height=height||GLOMP.config.ui.buttonHeight;
    GLOMP.view.hit(view,id,x,y,width,height,enabled);
    const focused=ui.focus===id,active=enabled!==false,alpha=active?1:.55;
    const g=GLOMP.view.graphics(view,'button:'+id,150),radius=Math.min(height/2,34);
    if(focused)g.lineStyle(6,0xFFE766,.95).drawRoundedRect(x-5,y-5,width+10,height+10,radius+5).lineStyle(0);
    g.lineStyle(6,0x113A86).beginFill(0x143D8A,.85).drawRoundedRect(x,y+6,width,height,radius).endFill();
    if(width>=132)GLOMP.view.image(view,'button:'+id,'ui-button',x+width/2,y+height/2,width,height,{fill:true,tint:active?color:c.muted,alpha:alpha,z:151});
    else {g.beginFill(active?color:c.muted).drawRoundedRect(x,y,width,height,radius).endFill();g.beginFill(0xFFFFFF,.24).drawRoundedRect(x+5,y+5,Math.max(1,width-10),height*.30,Math.min(radius,10)).endFill();}
    g.lineStyle(3,0xFFFFFF,.95).drawRoundedRect(x+2,y+2,width-4,height-4,radius).lineStyle(0);g.alpha=alpha;
    const icons={shop:'shop',customize:'shirt',settings:'gear',credits:'star',practice:'gamepad',play:'play',buy:'coin',equip:'star',back:'back'};
    icon=icon||icons[id];if(id.startsWith('category:'))icon={featured:'star',body:'color',face:'face',accessory:'hat',particles:'particles',trail:'trail',sets:'gift'}[id.slice(9)];
    const hasIcon=icon&&width>=132,iconSize=Math.min(height*(id.startsWith('category:')?.4:.6),66);
    if(hasIcon&&GLOMP.icons) {
      const item=GLOMP.icons.draw(view,'button:'+id,icon,x+height*.58,y+height/2,iconSize,153);item.alpha=alpha;
    }
    const font=Math.min(38,height*.39),available=width-(hasIcon?height*.85:20)-18;
    const text=GLOMP.view.text(view,'button:'+id,label,x+width/2+(hasIcon?height*.22:0),y+height/2,font,0xFFFFFF,{center:true,middle:true,z:154,outline:4,stroke:0x123B88});
    if(text.width>available)text.style.fontSize=Math.max(13,Math.floor(font*available/text.width));text.alpha=alpha;
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
    const item=GLOMP.view.item(view,'title:'+key,function(){const root=new PIXI.Container();root.outer=new PIXI.Text('');root.inner=new PIXI.Text('');root.addChild(root.outer,root.inner);return root;});
    const style={fontFamily:GLOMP.view.fontFamily,fontSize:size,fontWeight:'400',lineJoin:'round',fill:color,align:'center'};
    item.outer.style=Object.assign({},style,{stroke:0xFFFFFF,strokeThickness:options.outline||13});
    item.inner.style=Object.assign({},style,{stroke:0x103B8C,strokeThickness:options.stroke||7});
    item.outer.text=String(label);item.inner.text=String(label);
    item.outer.anchor.set(.5,options.middle?.5:0);item.inner.anchor.set(.5,options.middle?.5:0);
    item.position.set(x,y);item.scale.set(options.scale||1);item.alpha=options.alpha===undefined?1:options.alpha;
    item.zIndex=(view.overlayZ||0)+(options.z===undefined?122:options.z);return item;
  },
  heading: function(view,key,label,x,y,width,size) {
    GLOMP.view.image(view,'ribbon:'+key,'ui-ribbon',x,y+size*.6,width,size*2.5,{fill:true,z:111});
    return GLOMP.view.title(view,key,label,x,y,size,0xFFFFFF,{z:112,outline:11,stroke:6});
  },
  slime: function(view,key,x,y,size,bodyIndex,faceIndex,sx,sy,alpha,z,player,equipment) {
    return GLOMP.rig.draw(view,key,x,y,size,bodyIndex,faceIndex,alpha,z,player,equipment);
  },
};
