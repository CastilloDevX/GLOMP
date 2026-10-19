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
    Promise.all(Object.keys(GLOMP.art).map(function (id) {
      const asset = GLOMP.art[id];
      return manager.loadResource(asset.file).then(function () {
        const texture = manager.getPIXITexture(asset.file);
        if (!texture.valid || texture.width <= 1) throw new Error('Recurso no disponible: ' + id);
        if (asset.pixel) texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        GLOMP.view.textures[id] = asset.bounds ? new PIXI.Texture(texture.baseTexture, new PIXI.Rectangle(asset.bounds.x, asset.bounds.y, asset.bounds.width, asset.bounds.height)) : texture;
      });
    })).then(function () { GLOMP.view.ready = true; }).catch(function () { GLOMP.view.error = true; });
  },
  begin: function (scene) {
    const view = scene.__glompView;
    view.graphics.clear(); view.overlayZ = 0;
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
    const item = GLOMP.view.item(view, 'text:' + key, function () { return new PIXI.Text('', { fontFamily: 'Trebuchet MS, DejaVu Sans, sans-serif', fontWeight: '900', lineJoin: 'round' }); });
    if (item.text !== String(text)) item.text = String(text);
    item.style.fontSize = size; item.style.fill = color;
    item.style.stroke = options.stroke || GLOMP.config.ui.colors.chocolate;
    item.style.strokeThickness = options.outline || 0;
    item.style.align = options.align || 'left';
    item.style.fontWeight = options.weight || '900';
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
  panel: function (view, x, y, width, height, color, radius, alpha) {
    const g = view.graphics, c = GLOMP.config.ui.colors;
    g.lineStyle(4, c.chocolate).beginFill(c.chocolate, alpha === undefined ? 1 : alpha).drawRoundedRect(x, y + 6, width, height, radius || 22).endFill();
    g.beginFill(color, alpha === undefined ? 1 : alpha).drawRoundedRect(x, y, width, height, radius || 22).endFill().lineStyle(0);
  },
  button: function (view, id, label, x, y, width, color, enabled, height) {
    const config = GLOMP.config.ui, ui = GLOMP.ui;
    height = height || config.buttonHeight;
    const focused = ui.focus === id, c = config.colors;
    ui.buttons.push({ id: id, x: x + width / 2, y: y + height / 2, enabled: enabled !== false, width: width, height: height });
    const graphic = GLOMP.view.item(view, 'button:' + id, function () {
      return new PIXI.Graphics();
    });
    graphic.zIndex = (view.overlayZ || 0) + 150;
    graphic.__enabled = enabled !== false; graphic.alpha = graphic.__enabled ? 1 : 0.55;
    graphic.clear().lineStyle(focused ? 7 : 4, focused ? c.cream : c.chocolate);
    graphic.beginFill(c.chocolate).drawRoundedRect(x, y + 7, width, height, 23).endFill();
    graphic.beginFill(graphic.__enabled ? color : c.muted).drawRoundedRect(x, y, width, height, 23).endFill();
    graphic.lineStyle(0).beginFill(0xffffff, 0.2).drawRoundedRect(x + 9, y + 7, width - 18, height / 3, 16).endFill();
    const text = GLOMP.view.text(view, 'button:' + id, label, x + width / 2, y + height / 2, 27, c.chocolate, { center: true, middle: true, z: 151 });
    if (text.width > width - 20) text.style.fontSize = Math.max(14,Math.floor(27 * (width - 20) / text.width));
    text.alpha = graphic.alpha;
  },
  graphics: function (view,key,z) {
    const g = GLOMP.view.item(view,'graphics:' + key,function () { return new PIXI.Graphics(); });
    g.clear(); g.zIndex = (view.overlayZ || 0) + z; return g;
  },
  slimeTier: function (size) {
    const thresholds = GLOMP.config.art.tierThresholds;
    return size < thresholds[0] ? 0 : size < thresholds[1] ? 1 : 2;
  },
  slime: function (view, key, x, y, size, bodyIndex, faceIndex, sx, sy, alpha, z) {
    const c = GLOMP.config.art, tier = GLOMP.view.slimeTier(size);
    const id = c.pixelTiers[tier];
    GLOMP.view.image(view, key + ':body', id, x, y, size, size, { tint: bodyIndex === -1 ? c.botColor : c.bodyColors[bodyIndex] === undefined ? c.bodyColors[0] : c.bodyColors[bodyIndex], scaleX: sx || 1, scaleY: sy || 1, alpha: alpha, z: z === undefined ? 110 : z });
  },
};
