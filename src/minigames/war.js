// Sumo de lava. Mover y empujar; todos comparten los mismos impulsos y efectos.
GLOMP.minigames.war = {
  start: function(w) {
    const c=GLOMP.config.minigames.war;
    w.unbounded=true;w.drops=[];w.dropHistory=[];w.shocks=[];w.nextDrop=0;w.dropElapsed=-c.firstDrop+c.dropInterval;
    w.platformScale=1;
    w.players.forEach(function(p){p.shield=0;p.shove=0;p.shoveHits=[];p.gesture=0;p.fall=0;});
  },
  platform: function(w) {
    const c=GLOMP.config.minigames.war, p=c.platform;
    const progress=Math.max(0,Math.min(1,(w.elapsed-c.shrinkStart-c.shrinkNotice)/c.shrinkSeconds));
    const ratio=1-progress*(1-c.finalPlatformRatio);
    const width=w.width*p.width*ratio,height=w.height*p.height*ratio;
    return {x:w.width/2-width/2,y:w.height*(p.y+p.height/2)-height/2,width:width,height:height,radius:w.width*p.radius*ratio};
  },
  inside: function(w,x,y,inset) {
    const r=GLOMP.minigames.war.platform(w),radius=Math.max(0,r.radius-inset);
    const dx=Math.max(0,Math.abs(x-(r.x+r.width/2))-(r.width/2-r.radius));
    const dy=Math.max(0,Math.abs(y-(r.y+r.height/2))-(r.height/2-r.radius));
    return Math.abs(x-(r.x+r.width/2))<=r.width/2-inset&&Math.abs(y-(r.y+r.height/2))<=r.height/2-inset&&dx*dx+dy*dy<=radius*radius;
  },
  spawn: function(w) {
    const c=GLOMP.config.minigames.war,m=GLOMP.minigames.war;
    if(w.drops.length>=c.maxDrops)return false;
    const weights=c.dropWeights;let roll=GLOMP.food.random(w)*Object.values(weights).reduce(function(a,b){return a+b;},0),type=Object.keys(weights)[0];
    for(const key of Object.keys(weights)){roll-=weights[key];if(roll<=0){type=key;break;}}
    const platform=m.platform(w);
    for(let i=0;i<GLOMP.config.sandbox.spawnAttempts;i++) {
      const x=platform.x+GLOMP.food.random(w)*platform.width,y=platform.y+GLOMP.food.random(w)*platform.height;
      if(!m.inside(w,x,y,c.dropRadius)||w.drops.some(function(d){return Math.hypot(d.x-x,d.y-y)<c.dropRadius*2;}))continue;
      const notice=Math.max(GLOMP.config.telegraphSeconds,c.dropNotice);
      w.drops.push({id:w.nextDrop++,type:type,x:x,y:y,age:0,notice:notice,landed:false,life:c.pickupLifetime});
      w.dropHistory.push({type:type,notice:notice,x:x,y:y,announcedAt:w.elapsed});return true;
    }
    return false;
  },
  shock: function(w,x,y,strength,owner) {
    const c=GLOMP.config.minigames.war;
    w.shocks.push({x:x,y:y,life:GLOMP.config.sandbox.particleSeconds});
    w.players.forEach(function(p){
      const distance=Math.hypot(p.x-x,p.y-y);
      if(!p.alive||distance>c.shockRadius||p.immune>0)return;
      if(p.shield>0){p.shield=0;p.immune=c.hitImmunity;return;}
      GLOMP.player.impulse(p,p.x-x,p.y-y,strength);p.lastPusher=owner;p.immune=c.hitImmunity;
    });
  },
  step: function(w,dt,controls) {
    if(w.over)return;
    const c=GLOMP.config.minigames.war,m=GLOMP.minigames.war;
    w.players.forEach(function(p,index){
      p.fall=Math.max(0,p.fall-dt);p.shield=Math.max(0,p.shield-dt);
      const sticky=w.puddles.some(function(b){return Math.hypot(p.x-b.x,p.y-b.y)<b.rx;});
      p.speedMultiplier=(p.boost>0?1+c.speedBoost:1)*(sticky?c.slowMultiplier:1);
      p.expression=p.shove>0?'grit':sticky?'gasp':'smile';
      if(p.alive&&controls[index]?.action&&p.actionCooldown<=0) {
        p.shove=c.shoveWindup+c.shoveActive;p.actionCooldown=c.shoveCooldown;p.shoveHits=[];
        const control=controls[index],length=Math.hypot(control.x||0,control.y||0);
        p.shoveX=length?control.x/length:p.facingX;p.shoveY=length?control.y/length:p.facingY;p.gesture=p.shove;
      }
      if(p.shove>0) {
        const before=p.shove;p.shove=Math.max(0,p.shove-dt);
        if(before>c.shoveActive&&p.shove<=c.shoveActive)GLOMP.player.impulse(p,p.shoveX,p.shoveY,c.shoveLunge);
      }
    });
    GLOMP.maps.move(w,dt,controls);
    w.players.forEach(function(p){
      if(!p.alive||p.shove<=0||p.shove>c.shoveActive)return;
      w.players.forEach(function(q){
        if(q===p||!q.alive||q.immune>0||p.shoveHits.includes(q.playerId))return;
        const dx=q.x-p.x,dy=q.y-p.y,d=Math.hypot(dx,dy);
        if(d>p.radius+q.radius+c.shoveReach||(d&&(dx*p.shoveX+dy*p.shoveY)/d<c.shoveCone))return;
        p.shoveHits.push(q.playerId);q.immune=c.hitImmunity;
        if(q.shield>0){q.shield=0;return;}
        GLOMP.player.impulse(q,p.shoveX,p.shoveY,c.shoveImpulse);q.lastPusher=p.playerId;p.stats.pushes++;
      });
    });
    GLOMP.player.separate(w.players,w);
    w.dropElapsed+=dt;
    if(w.dropElapsed>=c.dropInterval){w.dropElapsed%=c.dropInterval;m.spawn(w);}
    w.drops=w.drops.filter(function(d){
      d.age+=dt;
      if(!d.landed&&d.age>=d.notice) {
        d.landed=true;d.landedAt=w.elapsed;
        if(d.type==='gum'){w.puddles.push({x:d.x,y:d.y,rx:c.dropRadius,ry:c.dropRadius,life:c.puddleSeconds});return false;}
        if(d.type==='melon'){m.shock(w,d.x,d.y,c.shockImpulse,null);return false;}
      }
      if(!d.landed)return true;
      d.life-=dt;
      const p=GLOMP.maps.nearest(w,d);
      if(p){if(d.type==='banana')p.boost=c.boostSeconds;else{p.shield=c.shieldSeconds;p.stats.shields++;}p.gulp=GLOMP.config.physics.gulpSeconds;return false;}
      return d.life>0&&m.inside(w,d.x,d.y,0);
    });
    w.puddles.forEach(function(p){p.life-=dt;});w.puddles=w.puddles.filter(function(p){return p.life>0;});
    w.shocks.forEach(function(p){p.life-=dt;});w.shocks=w.shocks.filter(function(p){return p.life>0;});
    w.players.forEach(function(p){
      if(p.alive&&!m.inside(w,p.x,p.y,p.radius*c.edgeTolerance)) {p.fall=c.fallSeconds;p.expression='gasp';GLOMP.maps.eliminate(w,p);}
    });
    if(GLOMP.maps.alive(w).length<=1)w.over=true;
  },
  score: function(p,w){return p.alive?GLOMP.config.round.maxSeconds+GLOMP.config.physics.fixedStep:p.eliminatedAt||0;},
};
