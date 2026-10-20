// Catálogo exclusivamente visual. Equipar nunca toca física ni balance.
GLOMP.shop = {
  catalogue: function() {
    const c=GLOMP.config,e=c.economy;
    const items=c.art.bodyColors.map(function(color,index){return {id:'body'+index,category:'body',index:index,color:color,price:index?e.prices.bodyColor:0,nameKey:'color'+index};});
    c.art.faces.forEach(function(asset,index){items.push({id:'face'+index,category:'face',index:index,asset:asset,price:index<e.initialFaces?0:e.prices.face,nameKey:'face'+index});});
    ['accessory','particles','trail'].forEach(function(category){
      for(let index=0;index<e.pieces[category==='accessory'?'accessories':category==='particles'?'particles':'trails'];index++)items.push({id:category+index,category:category,index:index,asset:category+index,price:e.prices[category],nameKey:category+index});
    });
    c.art.sets.forEach(function(set,index){items.push({id:'set'+index,category:'sets',index:index,equipment:set,price:e.prices.set,nameKey:'set'+index});});
    return items;
  },
  featured: function() {
    const items=GLOMP.shop.catalogue(),day=new Date().toLocaleDateString('en-CA');
    let seed=0;for(let i=0;i<day.length;i++)seed=(seed*31+day.charCodeAt(i))>>>0;
    return items.map(function(item,index){return {item:item,order:Math.sin(seed+index)*10000};}).sort(function(a,b){return a.order-b.order;}).slice(0,GLOMP.config.economy.rotatingItems).map(function(row){return row.item;});
  },
  pieces: function(item) {return item.category==='sets'?Object.values(item.equipment).filter(Boolean):[item.id];},
  owned: function(item) {return GLOMP.shop.pieces(item).every(function(id){return GLOMP.save.data.owned.includes(id);});},
  price: function(item) {
    if(item.category!=='sets')return item.price;
    const catalogue=GLOMP.shop.catalogue();
    return Math.min(item.price,GLOMP.shop.pieces(item).reduce(function(total,id){const p=catalogue.find(function(p){return p.id===id;});return total+(GLOMP.save.data.owned.includes(id)?0:p.price);},0));
  },
  preview: function(item,playerId) {
    const equipment=Object.assign({},GLOMP.save.equipment(playerId));
    if(item.category==='sets')Object.assign(equipment,item.equipment);else equipment[item.category]=item.id;
    return equipment;
  },
  buy: function(id) {
    const item=GLOMP.shop.catalogue().find(function(item){return item.id===id;}),data=GLOMP.save.data;
    if(!item||GLOMP.shop.owned(item))return false;
    const price=GLOMP.shop.price(item);if(data.coins<price)return false;
    data.coins-=price;
    GLOMP.shop.pieces(item).forEach(function(piece){if(!data.owned.includes(piece))data.owned.push(piece);});
    GLOMP.save.write();return true;
  },
  equip: function(id,playerId) {
    const item=GLOMP.shop.catalogue().find(function(item){return item.id===id;});
    if(!item||!GLOMP.shop.owned(item))return false;
    GLOMP.save.data.equipped[playerId]=GLOMP.shop.preview(item,playerId);GLOMP.save.write();return true;
  },
  clear: function(category,playerId) {
    if(!['accessory','particles','trail'].includes(category))return false;
    const equipment=Object.assign({},GLOMP.save.equipment(playerId));equipment[category]=null;
    GLOMP.save.data.equipped[playerId]=equipment;GLOMP.save.write();return true;
  },
};
