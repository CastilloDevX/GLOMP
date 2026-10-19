// Reutiliza el cuerpo y la comida; el liderazgo y el Manjar hacen visible la disputa.
GLOMP.minigames.buffet = {
  start: function (w) {
    const c=GLOMP.config.minigames.buffet;
    w.maxFood=c.maxFood;w.biteElapsed=0;w.plateElapsed=0;w.feastElapsed=-c.firstFeastAt;w.nextFeast=c.firstFeastAt;w.bananaElapsed=0;
    for(let i=0;i<GLOMP.config.round.initialFood;i++)GLOMP.food.spawn(w,'bite');
  },
  feast: function (w) {
    const c=GLOMP.config.minigames.buffet;
    const leader=w.players.slice().sort(function(a,b){return b.mass-a.mass;})[0];let best=null;
    for(let i=0;i<c.feastSpawnAttempts;i++){
      if(!GLOMP.food.spawn(w,'feast'))break;
      const food=w.food.pop(),distance=Math.hypot(food.x-leader.x,food.y-leader.y);
      if(!best||distance>best.distance)best={food:food,distance:distance};
    }
    if(best)w.food.push(best.food);
  },
  step: function (w,dt,controls) {
    const c=GLOMP.config.minigames.buffet;w.finalFeast=w.elapsed>=c.finalFeastAt;
    w.players.forEach(function(p,index){
      const control=controls[index]||{};
      if(control.x||control.y){p.directionX=control.x;p.directionY=control.y;}
      if(control.action&&p.actionCooldown<=0&&p.state!=='stunned'){
        p.dash=c.dashSeconds;p.actionCooldown=c.dashCooldown;p.hitTargets=[];
        const dx=p.directionX===undefined?1:p.directionX,dy=p.directionY||0,length=Math.hypot(dx,dy)||1;p.dashX=dx/length;p.dashY=dy/length;
      }
      p.dash=Math.max(0,(p.dash||0)-dt);p.stun=Math.max(0,(p.stun||0)-dt);p.state=p.stun>0?'stunned':p.dash>0?'dashing':'normal';
      p.speedMultiplier=p.dash>0?c.dashDistance/c.dashSeconds/p.speed:p.boost>0?1+c.bananaBoost:1;
    });
    const movement=controls.map(function(control,index){const p=w.players[index];return p.dash>0?Object.assign({},control,{x:p.dashX,y:p.dashY}):control;});
    GLOMP.maps.move(w,dt,movement);
    w.players.forEach(function(a){
      if(a.dash<=0)return;
      w.players.forEach(function(b){
        if(a===b||b.immune>0||a.hitTargets.includes(b.playerId)||Math.hypot(a.x-b.x,a.y-b.y)>a.radius+b.radius)return;
        a.hitTargets.push(b.playerId);b.immune=c.hitImmunity;b.stun=c.stunSeconds;b.feastTime=0;
        const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1;
        b.x+=dx/d*c.pushDistance;b.y+=dy/d*c.pushDistance;GLOMP.player.resolveBounds(b,w);w.obstacles.forEach(function(r){GLOMP.player.resolveRectangle(b,r);});
        const lost=Math.min(b.mass,Math.max(c.minDroppedMass,Math.min(c.maxDroppedMass,b.mass*c.droppedMassRatio)));
        b.mass-=lost;GLOMP.maps.drop(w,b,lost);
      });
    });
    GLOMP.player.separate(w.players,w);
    const remaining=[];
    w.food.forEach(function(f){
      const p=GLOMP.maps.nearest(w,f);if(!p){remaining.push(f);return;}
      if(f.type==='feast'){
        if(p.feastId!==f.id){p.feastId=f.id;p.feastTime=0;}
        p.feastTouched=true;if(p.stun>0){p.feastTime=0;remaining.push(f);return;}p.feastTime+=dt;
        if(p.feastTime<c.feastEatSeconds||p.stun>0){remaining.push(f);return;}
        p.stats.feasts++;
      }
      if(f.type==='banana')p.boost=c.bananaSeconds;
      else GLOMP.player.eat(p,GLOMP.config.food[f.type].mass*(w.finalFeast?c.finalValueMultiplier:1));
      p.stats.eaten++;
    });
    w.food=remaining;w.players.forEach(function(p){if(!p.feastTouched)p.feastTime=0;p.feastTouched=false;});
    const frequency=w.finalFeast?c.finalSpawnMultiplier:1;
    w.biteElapsed+=dt*frequency;w.plateElapsed+=dt*frequency;w.bananaElapsed+=dt;
    while(w.biteElapsed>=1/c.biteRate){w.biteElapsed-=1/c.biteRate;if(w.food.filter(function(f){return f.type==='bite';}).length<c.maxBites)GLOMP.food.spawn(w,'bite');}
    while(w.plateElapsed>=c.plateInterval){w.plateElapsed-=c.plateInterval;if(w.food.filter(function(f){return f.type==='plate';}).length<c.maxPlates)GLOMP.food.spawn(w,'plate');}
    if(w.elapsed>=w.nextFeast){GLOMP.minigames.buffet.feast(w);w.nextFeast+=c.feastInterval;}
    if(w.bananaElapsed>=c.bananaInterval){w.bananaElapsed%=c.bananaInterval;GLOMP.food.spawn(w,'banana');}
    const leaders=w.players.slice().sort(function(a,b){return b.mass-a.mass||b.stats.feasts-a.stats.feasts;});w.leader=leaders[0].playerId;
  },
  score: function(p){return p.mass;},
};
