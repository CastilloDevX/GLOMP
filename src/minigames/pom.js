// Quema la papa: la mecha es global; pasar el chicle nunca vuelve a poner el reloj a cero.
GLOMP.minigames.pom = {
  start: function(w) {
    const alive=GLOMP.maps.alive(w), c=GLOMP.config.minigames.pom;
    w.holder=alive[Math.floor(GLOMP.food.random(w)*alive.length)].playerId;
    w.fuse=c.fuseSeconds; w.transferLock=0; w.transfers=[]; w.burst=null;
  },
  step: function(w,dt,controls) {
    if(w.over)return;
    const c=GLOMP.config.minigames.pom;
    w.transferLock=Math.max(0,w.transferLock-dt);
    w.players.forEach(function(p){p.speedMultiplier=p.playerId===w.holder?c.holderSpeedMultiplier:1;p.expression=p.playerId===w.holder?'gasp':'grit';});
    GLOMP.maps.move(w,dt,controls);
    const holder=w.players.find(function(p){return p.playerId===w.holder;});
    if(holder&&holder.alive&&controls[holder.playerId]?.action&&holder.actionCooldown<=0) {
      holder.actionCooldown=c.tagCooldown; holder.gesture=c.tagCooldown;
      if(w.transferLock<=0) {
        const targets=GLOMP.maps.alive(w).filter(function(p){
          if(p===holder)return false;
          const dx=p.x-holder.x,dy=p.y-holder.y,d=Math.hypot(dx,dy);
          return d<=holder.radius+p.radius+c.tagReach&&(!d||(dx*holder.facingX+dy*holder.facingY)/d>=c.tagArc);
        }).sort(function(a,b){return Math.hypot(a.x-holder.x,a.y-holder.y)-Math.hypot(b.x-holder.x,b.y-holder.y)||a.playerId-b.playerId;});
        if(targets.length) {
          const target=targets[0];w.holder=target.playerId;w.transferLock=c.transferLock;holder.stats.passes++;
          w.transfers.push({from:holder.playerId,to:target.playerId,at:w.elapsed,fuse:w.fuse});
          target.gulp=GLOMP.config.physics.gulpSeconds;target.expression='gasp';
        }
      }
    }
    GLOMP.player.separate(w.players,w);
    w.fuse=Math.max(0,w.fuse-dt);
    if(w.fuse<=c.fuseEpsilon) {
      w.fuse=0;
      const victim=w.players.find(function(p){return p.playerId===w.holder;});
      w.burst={x:victim.x,y:victim.y,at:w.elapsed};GLOMP.maps.eliminate(w,victim);w.over=true;
    }
  },
  score: function(p){return p.alive?1:0;},
};
