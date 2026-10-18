// Los artículos contienen únicamente referencias visuales; no modifican config.
GLOMP.shop = {
  catalogue: function () {
    return GLOMP.config.art.bodyColors.map(function (color, index) {
      return { id: 'body' + index, category: 'body', index: index, color: color, price: index ? GLOMP.config.economy.prices.bodyColor : 0, nameKey: 'color' + index };
    }).concat(GLOMP.config.art.faces.map(function (asset, index) {
      return { id: 'face' + index, category: 'face', index: index, asset: asset, price: index < GLOMP.config.economy.initialFaces ? 0 : GLOMP.config.economy.prices.face, nameKey: 'face' + index };
    }));
  },
  buy: function (id) {
    const item = GLOMP.shop.catalogue().find(function (item) { return item.id === id; });
    const data = GLOMP.save.data;
    if (!item || data.owned.includes(id)) return false;
    if (data.coins < item.price) return false;
    data.coins -= item.price; data.owned.push(id); GLOMP.save.write(); return true;
  },
  equip: function (id, playerId) {
    const item = GLOMP.shop.catalogue().find(function (item) { return item.id === id; });
    if (!item || !GLOMP.save.data.owned.includes(id)) return false;
    const equipment = GLOMP.save.equipment(playerId);
    equipment[item.category] = id; GLOMP.save.data.equipped[playerId] = equipment; GLOMP.save.write(); return true;
  },
};
