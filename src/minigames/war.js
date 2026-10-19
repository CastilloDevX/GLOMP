// La mano tiene tres huecos. Curarse también consume un disparo y un hueco de munición.
GLOMP.minigames.war = {
  start: function(w){
    const c=GLOMP.config.minigames.war;
    w.projectiles=[];w.splashes=[];w.nextProjectile=0;w.zone=0;
    w.crates=c.crates.slice(0,c.maxCrates).map(function(p,index){return {id:index,x:p[0]*w.width,y:p[1]*w.height,elapsed:c.crateInterval};});
    w.players.forEach(function(p){p.health=c.health;p.ammo=[];p.aimX=1;p.aimY=0;p.zoneElapsed=0;});
  },
  pick: function(w,crate){
    const c=GLOMP.config.minigames.war,weights=Object.assign({},c.foodWeights);
    const alive=GLOMP.maps.alive(w).slice().sort(function(a,b){return a.health-b.health;});
    if(alive.length){const nearest=w.crates.slice().sort(function(a,b){return Math.hypot(a.x-alive[0].x,a.y-alive[0].y)-Math.hypot(b.x-alive[0].x,b.y-alive[0].y);})[0];if(nearest===crate)weights.lettuce*=c.comebackLettuceMultiplier;}
    let value=GLOMP.food.random(w)*Object.values(weights).reduce(function(a,b){return a+b;},0);
    for(const type of Object.keys(weights)){value-=weights[type];if(value<=0)return type;}return 'tomato';
  },
  hurt: function(w,p,damage,dx,dy){
    const c=GLOMP.config.minigames.war;if(!p.alive||p.immune>0)return;
    p.health=Math.max(0,p.health-damage);p.immune=c.hitImmunity;
    const length=Math.hypot(dx,dy)||1;p.x+=dx/length*c.knockback;p.y+=dy/length*c.knockback;
    GLOMP.player.resolveBounds(p,w);w.obstacles.forEach(function(r){GLOMP.player.resolveRectangle(p,r);});
    if(p.health<=0)GLOMP.maps.eliminate(w,p);
  },
  step: function(w,dt,controls){
    const m=GLOMP.minigames.war,c=GLOMP.config.minigames.war;
    w.zone=w.elapsed<c.zoneStart?0:Math.min(1,(w.elapsed-c.zoneStart)/c.zoneSeconds)*(1-c.arenaFinalRatio)/2;
    w.players.forEach(function(p,index){
      const control=controls[index]||{};
      p.speedMultiplier=(p.boost>0?1+GLOMP.config.food.banana.speedBoost:1)*(w.puddles.some(function(b){return Math.hypot(p.x-b.x,p.y-b.y)<b.rx;})?GLOMP.config.food.gum.slowMultiplier:1);
      let ax=control.aimX||0,ay=control.aimY||0;
      if(p.source.kind==='keyboard'&&p.source.index===0&&GLOMP.input.mouse?.active){ax=GLOMP.input.mouse.x*w.width/GLOMP.config.ui.width-p.x;ay=GLOMP.input.mouse.y*w.height/GLOMP.config.ui.height-p.y;}
      else if(!ax&&!ay&&(control.x||control.y)){ax=control.x;ay=control.y;}
      const length=Math.hypot(ax,ay);if(length){p.aimX=ax/length;p.aimY=ay/length;}
      if(p.source.kind==='keyboard'&&p.source.index===1){
        const angle=Math.atan2(p.aimY,p.aimX),step=Math.PI*2/c.keyboardAimDirections;
        p.aimX=Math.cos(Math.round(angle/step)*step);p.aimY=Math.sin(Math.round(angle/step)*step);
        const target=w.players.filter(function(q){return q!==p&&q.alive;}).map(function(q){const a=Math.atan2(q.y-p.y,q.x-p.x),delta=Math.atan2(Math.sin(a-Math.atan2(p.aimY,p.aimX)),Math.cos(a-Math.atan2(p.aimY,p.aimX)));return {p:q,delta:Math.abs(delta)};}).sort(function(a,b){return a.delta-b.delta;})[0];
        if(target&&target.delta<=c.aimAssistDegrees*Math.PI/180){const d=Math.hypot(target.p.x-p.x,target.p.y-p.y);p.aimX=(target.p.x-p.x)/d;p.aimY=(target.p.y-p.y)/d;}
      }
      if(p.alive&&control.action&&p.actionCooldown<=0&&p.ammo.length){
        const type=p.ammo.shift(),food=GLOMP.config.food[type];p.actionCooldown=c.fireInterval;
        if(type==='lettuce')p.health=Math.min(c.health,p.health+food.heal);
        else if(type==='banana')p.boost=food.boostSeconds;
        else w.projectiles.push({id:w.nextProjectile++,owner:p.playerId,type:type,x:p.x+p.aimX*(p.radius+c.projectileRadius),y:p.y+p.aimY*(p.radius+c.projectileRadius),vx:p.aimX*food.speed,vy:p.aimY*food.speed,life:c.projectileLifetime,dead:false,age:0,delay:GLOMP.config.telegraphSeconds});
      }
    });
    GLOMP.maps.move(w,dt,controls);GLOMP.player.separate(w.players,w);
    w.crates.forEach(function(crate){crate.elapsed+=dt;if(crate.elapsed<c.crateInterval)return;crate.elapsed%=c.crateInterval;const type=m.pick(w,crate);
      if(w.food.some(function(f){return f.crate===crate.id;}))return;
      w.food.push({id:w.nextFoodId++,type:type,x:crate.x,y:crate.y,crate:crate.id});
    });
    w.food=w.food.filter(function(f){const p=GLOMP.maps.nearest(w,f,function(q){return q.ammo.length<GLOMP.config.player.maxAmmo;});if(p){p.ammo.push(f.type);p.stats.eaten++;return false;}return true;});
    w.projectiles.forEach(function(b){b.age+=dt;if(b.delay>0){b.delay=Math.max(0,b.delay-dt);return;}b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;
      const wall=!GLOMP.maps.free(w,b.x,b.y,c.projectileRadius);
      const victim=w.players.find(function(p){return p.alive&&p.playerId!==b.owner&&Math.hypot(p.x-b.x,p.y-b.y)<=p.radius+c.projectileRadius;});
      if(wall||victim||b.life<=0){b.dead=true;
        if(b.type==='melon'){
          // El área de la sandía está anunciada desde el disparo; nunca impacta antes del aviso mínimo.
          if(b.age<GLOMP.config.telegraphSeconds){b.dead=false;b.vx=0;b.vy=0;b.pending=true;return;}
          w.players.forEach(function(p){const d=Math.hypot(p.x-b.x,p.y-b.y),f=GLOMP.config.food.melon;if(d<=f.radius)m.hurt(w,p,d<=f.radius/2?f.damage:f.edgeDamage,p.x-b.x,p.y-b.y);});
        }else if(victim)m.hurt(w,victim,GLOMP.config.food[b.type].damage,b.vx,b.vy);
        if(b.type==='gum')w.puddles.push({x:b.x,y:b.y,rx:GLOMP.config.food.gum.radius,ry:GLOMP.config.food.gum.radius,life:GLOMP.config.food.gum.puddleSeconds});
        w.splashes.push({x:b.x,y:b.y,type:b.type,life:GLOMP.config.sandbox.particleSeconds});
      }
    });
    for(let i=0;i<w.projectiles.length;i++)for(let j=i+1;j<w.projectiles.length;j++){
      const a=w.projectiles[i],b=w.projectiles[j];if(a.dead||b.dead||a.owner===b.owner||a.type==='melon'||b.type==='melon')continue;
      if(Math.hypot(a.x-b.x,a.y-b.y)<c.projectileRadius*2){a.dead=true;b.dead=true;}
    }
    w.projectiles=w.projectiles.filter(function(b){return !b.dead;});
    w.puddles.forEach(function(p){p.life-=dt;});w.puddles=w.puddles.filter(function(p){return p.life>0;});
    w.splashes.forEach(function(p){p.life-=dt;});w.splashes=w.splashes.filter(function(p){return p.life>0;});
    w.players.forEach(function(p){
      if(!p.alive)return;
      const outside=p.x<w.width*w.zone||p.x>w.width*(1-w.zone)||p.y<w.height*w.zone||p.y>w.height*(1-w.zone);
      p.zoneElapsed=outside?p.zoneElapsed+dt:0;
      if(p.zoneElapsed>=c.zoneDamageInterval){p.zoneElapsed%=c.zoneDamageInterval;p.health=Math.max(0,p.health-c.zoneDamage);if(p.health<=0)GLOMP.maps.eliminate(w,p);}
    });
    if(GLOMP.maps.alive(w).length<=1)w.over=true;
  },
  score: function(p,w){return p.alive?GLOMP.config.round.maxSeconds+p.health:(p.eliminatedAt||0);},
};
