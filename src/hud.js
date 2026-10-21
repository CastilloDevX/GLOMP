// HUD en coordenadas de pantalla; el escenario usa la cámara compartida del grupo.
GLOMP.hud = {
  camera: function(m) { return GLOMP.camera.get(m); },
  world: function(view,m) {
    const d=GLOMP.view,w=m.world,camera=GLOMP.camera.get(m),s=camera.scale;
    const x=function(n){return camera.x+n*s;},y=function(n){return camera.y+n*s;};
    const ambient=d.image(view,'ambient','map-'+w.theme,960,540,1920,1080,{fill:true,z:0,tint:0x635775});
    if(ambient)ambient.alpha=0.35;
    d.image(view,'map','map-'+w.theme,x(w.width/2),y(w.height/2),w.width*s,w.height*s,{fill:true,z:2});
    const ground=d.graphics(view,'ground',3),rings=d.graphics(view,'rings',6),effects=d.graphics(view,'effects',55);
    if(w.theme!=='lava') {
      const block='map-'+w.theme+'-block';
      w.obstacles.forEach(function(r,index){
        const texture=d.textures[block];if(!texture)return;
        const height=r.width*texture.height/texture.width;
        ground.beginFill(0x30253E,.22).drawEllipse(x(r.x+r.width/2),y(r.y+r.height),r.width*s*.5,r.height*s*.34).endFill();
        d.image(view,'block'+index,block,x(r.x+r.width/2),y(r.y+r.height-height/2),r.width*s,height*s,{fill:true,z:20+(r.y+r.height)/w.height*10});
      });
      (w.circles||[]).forEach(function(circle,index){
        const id='map-'+w.theme+'-center',texture=d.textures[id];if(!texture)return;
        const art=GLOMP.config.arena.centerArt,width=circle.radius*art.width,height=width*texture.height/texture.width;
        d.image(view,'center'+index,id,x(circle.x),y(circle.y+circle.radius*art.bottom-height/2),width*s,height*s,{fill:true,z:20+(circle.y+circle.radius*art.bottom)/w.height*10});
      });
      w.bushes.forEach(function(b,index){
        const occupied=w.players.some(function(p){return p.alive&&Math.abs(p.x-b.x)<b.width/2&&Math.abs(p.y-b.y)<b.height/2;});
        d.image(view,'bush'+index,'map-'+w.theme+'-bush',x(b.x),y(b.y),b.width*s,b.height*s,{z:20+(b.y+b.height/3)/w.height*10,alpha:occupied?.45:1});
      });
    }

    if(w.mode==='eatEm'&&w.sauce) {
      const bx=w.width*w.sauce,by=w.height*w.sauce;
      ground.beginFill(0xDF4E53,0.52).drawRect(x(0),y(0),w.width*s,by*s).drawRect(x(0),y(w.height-by),w.width*s,by*s).drawRect(x(0),y(by),bx*s,(w.height-by*2)*s).drawRect(x(w.width-bx),y(by),bx*s,(w.height-by*2)*s).endFill();
    }
    if(w.mode==='war') {
      const platform=GLOMP.minigames.war.platform(w),original=GLOMP.config.minigames.war.platform;
      if(w.elapsed>GLOMP.config.minigames.war.shrinkStart) {
        const g=d.graphics(view,'risingLava',4);
        g.beginFill(0xFF6515,0.82).drawRect(x(w.width*original.x),y(w.height*original.y),w.width*original.width*s,(platform.y-w.height*original.y)*s).drawRect(x(w.width*original.x),y(platform.y+platform.height),w.width*original.width*s,(w.height*(original.y+original.height)-platform.y-platform.height)*s).drawRect(x(w.width*original.x),y(platform.y),(platform.x-w.width*original.x)*s,platform.height*s).drawRect(x(platform.x+platform.width),y(platform.y),(w.width*(original.x+original.width)-platform.x-platform.width)*s,platform.height*s).endFill();
        g.lineStyle(5,0xFFE8A8,0.85).drawRoundedRect(x(platform.x),y(platform.y),platform.width*s,platform.height*s,platform.radius*s).lineStyle(0);
      }
      w.drops.forEach(function(drop){
        const progress=Math.min(1,drop.age/drop.notice),bad=['gum','melon'].includes(drop.type),color=bad?0xFF6F67:0x7DFFD2;
        ground.lineStyle(3,color,0.95).beginFill(color,0.12).drawCircle(x(drop.x),y(drop.y),GLOMP.config.minigames.war.dropRadius*s).endFill().lineStyle(0);
        ground.beginFill(0x241F37,0.25).drawEllipse(x(drop.x),y(drop.y),30*s*(0.4+progress),12*s).endFill();
        const py=y(drop.y)-(drop.landed?0:(1-progress)*320*s);
        if(drop.type==='shield') {
          const a=d.graphics(view,'shieldDrop'+drop.id,40);a.lineStyle(5,0xDAFFFF).beginFill(0x3BCDBF).drawPolygon([x(drop.x)-23*s,py-24*s,x(drop.x)+23*s,py-24*s,x(drop.x)+19*s,py+10*s,x(drop.x),py+30*s,x(drop.x)-19*s,py+10*s]).endFill().lineStyle(0);
        } else d.image(view,'falling'+drop.id,'food-'+drop.type,x(drop.x),py,58*s,58*s,{z:40,rotation:drop.landed?0:(1-progress)*Math.PI});
      });
      w.shocks.forEach(function(q){const progress=1-q.life/GLOMP.config.sandbox.particleSeconds;effects.lineStyle(7,0xFFF0A9,1-progress).drawCircle(x(q.x),y(q.y),GLOMP.config.minigames.war.shockRadius*s*progress).lineStyle(0);});
    }
    w.puddles.forEach(function(p){ground.lineStyle(3,0xFFE1F7,0.7).beginFill(0xD964C3,0.65).drawEllipse(x(p.x),y(p.y),p.rx*s,p.ry*s*0.6).endFill().lineStyle(0);});
    w.food.forEach(function(f){
      const golden=w.mode==='crazy'&&f.ingredient===w.requested;
      const size=GLOMP.config.physics.foodRadius*2*s*(f.type==='feast'?1.8:f.type==='plate'?1.4:1);
      if(golden||f.type==='feast')ground.lineStyle(3,0xFFF1A2).beginFill(0xFFD65A,0.22).drawCircle(x(f.x),y(f.y),size*0.8).endFill().lineStyle(0);
      const id=f.ingredient===undefined?'food-'+f.type:f.ingredient===0?'food-bite':'food-ingredient'+f.ingredient;
      ground.beginFill(0x39243F,0.2).drawEllipse(x(f.x),y(f.y)+size*0.4,size*0.35,size*0.13).endFill();
      d.image(view,'pickup'+f.id,id,x(f.x),y(f.y)+Math.sin(w.elapsed*GLOMP.config.sandbox.foodBobRate+f.id)*GLOMP.config.sandbox.foodBobPixels*s,size,size,{z:8});
    });
    (w.particles||[]).forEach(function(p){ground.beginFill(0xFFE298,p.life/GLOMP.config.sandbox.particleSeconds).drawCircle(x(p.x),y(p.y),5*s).endFill();});
    w.players.forEach(function(p,index){
      (p.trailPoints||[]).forEach(function(point,n){if(p.trail)d.image(view,'trail'+index+':'+n,p.trail,x(point.x),y(point.y),GLOMP.config.animation.cosmetics.trailSize*s,GLOMP.config.animation.cosmetics.trailSize*s,{alpha:point.life/GLOMP.config.animation.cosmetics.trailSeconds,z:5});});
      if(!p.alive&&!(p.fall>0))return;
      const falling=p.fall>0?p.fall/GLOMP.config.minigames.war.fallSeconds:1;
      const size=GLOMP.config.physics.baseRadius*2*p.visualScale*s*falling;
      const hidden=w.mode==='eatEm'&&p.scale<GLOMP.config.minigames.eatEm.bushScaleLimit&&w.bushes.some(function(b){return Math.abs(p.x-b.x)<b.width/2&&Math.abs(p.y-b.y)<b.height/2;});
      ground.beginFill(0x1B1A34,0.26*falling).drawEllipse(x(p.x),y(p.y)+size*0.32,size*0.45,size*0.15).endFill();
      if(!p.npc)rings.lineStyle(3,GLOMP.config.art.markerColors[p.playerId],0.8).drawEllipse(x(p.x),y(p.y)+size*0.3,p.radius*s,p.radius*s*0.35).lineStyle(0);
      if(w.mode==='eatEm') {
        const ratio=GLOMP.config.minigames.eatEm.eatScaleRatio;
        const prey=w.players.filter(function(q){return !q.npc&&q!==p&&q.alive&&p.scale>=q.scale*ratio;});
        const threats=w.players.filter(function(q){return !q.npc&&q!==p&&q.alive&&q.scale>=p.scale*ratio;});
        if(prey.length||threats.length) {
          const danger=prey.length>0,color=danger?0xFF5D63:0x8DEA5A;
          rings.lineStyle(3,color,0.9).drawCircle(x(p.x),y(p.y),(p.radius+10)*s).lineStyle(0);
          d.text(view,'aura'+index,(danger?'→ ':'← ')+(danger?prey:threats).map(function(q){return GLOMP.config.art.markerIcons[q.playerId];}).join(' '),x(p.x),y(p.y)+size*0.55,16,color,{center:true,outline:3,z:44});
        }
      }
      const face=Number((p.face||'face0').slice(4));
      d.slime(view,'slime'+index,x(p.x),y(p.y),size,p.bot?-1:Number(p.bodyColor.slice(4)),face,1,1,(hidden?0.42:1)*falling,20+p.y/w.height*10,p);
      if(p.immune>0||p.shield>0)rings.lineStyle(p.shield>0?5:2,p.shield>0?0x8CFFFF:0xFFF4DC,0.85).drawCircle(x(p.x),y(p.y),p.radius*s+6).lineStyle(0);
      if(p.gesture>0) {
        const radius=(p.radius+GLOMP.config.minigames.war.shoveReach)*s;
        effects.lineStyle(6,0xFFF5C9,0.7).arc(x(p.x),y(p.y),radius,Math.atan2(p.facingY,p.facingX)-0.6,Math.atan2(p.facingY,p.facingX)+0.6).lineStyle(0);
      }
      if(w.mode==='buffet'&&p.playerId===w.leader)GLOMP.icons.draw(view,'leader','crown',x(p.x),y(p.y)-size*.6-28,46,44);
      if(!p.npc&&p.alive) {
        d.text(view,'worldName'+index,GLOMP.config.art.markerIcons[p.playerId]+' '+GLOMP.i18n.text('playerShort',{number:p.playerId+1}),x(p.x),y(p.y)-size*(p.accessory?0.8:0.52)-22,Math.max(17,22*s),0xFFFFFF,{center:true,outline:4,z:42});
        if(p.safe)GLOMP.icons.draw(view,'safe'+index,'check',x(p.x),y(p.y)-size*.7-25,38,43);
      }
      if(w.mode==='pom'&&p.playerId===w.holder&&p.alive) {
        const remaining=w.fuse/GLOMP.config.minigames.pom.fuseSeconds;
        effects.lineStyle(6,0xFF84D4,0.85).arc(x(p.x),y(p.y),p.radius*s+13,-Math.PI/2,-Math.PI/2+Math.PI*2*remaining).lineStyle(0);
        d.image(view,'carriedGum','food-gum',x(p.x)+size*0.32,y(p.y)-size*0.28,Math.max(28,size*0.55),Math.max(28,size*0.55),{z:43});
      }
    });
    if(w.burst) {
      const burst=Math.min(1,(m.endingElapsed||0)/GLOMP.config.minigames.pom.burstSeconds);
      effects.lineStyle(10,0xFFACE5,1-burst).beginFill(0xF876CF,(1-burst)*0.6).drawCircle(x(w.burst.x),y(w.burst.y),GLOMP.config.minigames.war.shockRadius*s*burst).endFill().lineStyle(0);
      d.text(view,'burst',GLOMP.i18n.text('pomBurst'),x(w.burst.x),y(w.burst.y),60,0xFFF3D3,{center:true,middle:true,outline:6,z:60});
    }
  },
  cards: function(view,m) {
    const d=GLOMP.view,t=GLOMP.i18n.text,c=GLOMP.config.ui.colors,w=m.world,camera=GLOMP.camera.get(m);
    w.players.filter(function(p){return !p.npc;}).forEach(function(p,index){
      const right=index%2===1,x=right?1540:22,y=18+Math.floor(index/2)*116,width=358,height=104;
      const behind=w.players.some(function(q){const px=q.x*camera.scale+camera.x,py=q.y*camera.scale+camera.y,r=q.radius*camera.scale;return q.alive&&px+r>x&&px-r<x+width&&py+r>y&&py-r<y+height;});
      const alpha=behind?.38:.97;
      d.panel(view,x,y,width,height,c.blue,35,alpha);
      const avatarX=right?x+305:x+51,textX=right?x+28:x+100;
      d.graphics(view,'portraitFrame'+index,108).lineStyle(4,0xA9F8FF,alpha).beginFill(0x064CAA,alpha).drawCircle(avatarX,y+51,44).endFill().lineStyle(0);
      d.slime(view,'avatar'+index,avatarX,y+53,74,Number(p.bodyColor.slice(4)),Number(p.face.slice(4)),1,1,(p.alive?1:.5)*alpha,110,p);
      d.text(view,'cardName'+index,GLOMP.config.art.markerIcons[index]+' '+t('player',{number:index+1}),textX,y+12,26,0xFFFFFF,{outline:4,stroke:0x103B8C,alpha:alpha});
      d.text(view,'cardSlices'+index,t('slices',{count:m.participants[index].slices,goal:GLOMP.config.slicesToWin}),right?x+230:x+312,y+15,22,c.yellow,{center:true,outline:3,stroke:0x103B8C,alpha:alpha});
      let label=['eatEm','buffet','practice'].includes(w.mode)?t('mass',{count:Math.floor(p.mass)}):p.alive?(w.mode==='crazy'&&p.safe?t('safe'):t('ready')):t('eliminated');
      if(w.mode==='war'&&p.alive)label=t(p.shield>0?'shieldActive':'pushes',{count:p.stats.pushes});
      if(w.mode==='pom'&&p.alive)label=t(p.playerId===w.holder?'gumHolder':'gumSafe');
      if(p.bot)label=t('autoControl');if(p.respawn>0&&!p.alive)label=t('respawning',{seconds:Math.ceil(p.respawn)});
      const status=d.text(view,'cardStat'+index,label,textX,y+49,24,p.alive?c.yellow:0xFF9DA8,{outline:3,stroke:0x103B8C,alpha:alpha});
      if(status.width>236)status.style.fontSize=Math.floor(24*236/status.width);
      const bar=['eatEm','buffet'].includes(w.mode)?Math.min(1,p.scale/GLOMP.config.player.maxScale):w.mode==='war'?Math.max(0,1-p.actionCooldown/GLOMP.config.minigames.war.shoveCooldown):p.alive?1:0;
      view.graphics.beginFill(0x133A83,alpha).drawRoundedRect(textX,y+84,210,7,3).endFill().beginFill(GLOMP.config.art.markerColors[index],alpha).drawRoundedRect(textX,y+84,210*bar,7,3).endFill();
    });
  },
  results: function(view,m) { GLOMP.results.render(view,m); },
  render: function (scene,m) {
    const draw = GLOMP.view, view = draw.begin(scene), c = GLOMP.config.ui.colors, t = GLOMP.i18n.text, w = m.world;
    GLOMP.ui.buttons = [];
    if(m.phase==='results'||m.phase==='final'){GLOMP.hud.results(view,m);if(m.paused)GLOMP.hud.pause(view);return;}
    GLOMP.hud.world(view,m); GLOMP.hud.cards(view,m);
    const duration = Math.min(GLOMP.config.round.maxSeconds,(GLOMP.config.minigames[w.mode] || {}).duration || GLOMP.config.round.maxSeconds), remaining = Math.max(0,Math.ceil(w.mode==='pom'?w.fuse:duration-w.elapsed));
    draw.panel(view,790,14,340,112,c.blue,48,.98);GLOMP.icons.draw(view,'clock','clock',843,69,65,124);
    const timer = draw.title(view,'timer',t('roundTime',{minutes:Math.floor(remaining / 60),seconds:String(remaining % 60).padStart(2,'0')}),987,27,68,remaining<duration/3?0xFF6B85:0xFFFFFF,{outline:12,stroke:7});
    timer.scale.set(remaining < duration / 3 ? 1 + Math.sin(w.elapsed * 5) * 0.035 : 1);
    if(w.mode==='pom'&&m.phase==='playing') {
      draw.panel(view,630,118,660,62,c.dark,15,0.9);
      draw.text(view,'holder',t('gumNotice',{number:w.holder+1}),960,130,29,c.pink,{center:true});
    }
    if(w.mode==='war'&&m.phase==='playing'&&w.elapsed>=GLOMP.config.minigames.war.shrinkStart)draw.text(view,'notice',t('lavaRising'),960,1020,25,c.cream,{center:true,outline:4});
    if (w.mode === 'crazy' && m.phase === 'playing') {
      draw.panel(view,620,116,680,60,c.dark,12,0.92);
      draw.text(view,'order',t(w.orderElapsed < GLOMP.config.minigames.crazy.announcementSeconds ? 'requestStarting' : 'request',{name:t('food' + w.requested)}) + ' · ' + Math.max(0,Math.ceil(w.stage.seconds + GLOMP.config.minigames.crazy.announcementSeconds - w.orderElapsed)),960,127,29,c.yellow,{center:true});
    }
    if(m.phase==='intro') {
      const intro=draw.graphics(view,'introShade',90);intro.lineStyle(4,0x6DE7FF).beginFill(0x083684,.91).drawRoundedRect(38,772,1844,280,44).endFill().lineStyle(0);
      const cap=w.mode.charAt(0).toUpperCase()+w.mode.slice(1);
      draw.text(view,'introRound',t('roundLabel',{number:m.round})+' · '+t('map'+w.theme.charAt(0).toUpperCase()+w.theme.slice(1)),960,789,24,c.yellow,{center:true,outline:3,stroke:0x103B8C});
      draw.title(view,'introTitle',t('mode'+cap),960,824,65,0xFFFFFF,{z:122,outline:13,stroke:7});
      draw.text(view,'introRule',t('rule'+cap),960,908,27,0xFFFFFF,{center:true,wrap:1740,outline:3,stroke:0x103B8C});
      const banner=draw.graphics(view,'introAction',115);banner.beginFill(0xFFD52E).drawRoundedRect(420,985,1080,52,26).endFill();
      draw.text(view,'introAction',t('action'+cap),960,994,24,0x0C2C63,{center:true});
    }
    if(m.phase==='countdown'||m.phase==='launch') {
      draw.graphics(view,'countShade',90).beginFill(c.dark,.13).drawRect(0,0,1920,1080).endFill();
      const launch=m.phase==='launch',progress=launch?m.phaseElapsed/GLOMP.config.round.launchSeconds:m.phaseElapsed%1;
      const pop=1+Math.sin(Math.min(1,progress)*Math.PI)*(launch?GLOMP.config.ui.cartoon.launchPop:GLOMP.config.ui.cartoon.countdownPop);
      const title=draw.title(view,'countdown',launch?t('launch'):t('countdown',{number:Math.max(1,Math.ceil(GLOMP.config.round.countdownSeconds-m.phaseElapsed))}),960,487,launch?155:195,launch?0xFFD92E:0xFFFFFF,{middle:true,scale:pop,outline:20,stroke:11,z:125});
      title.rotation=launch?Math.sin(progress*Math.PI)*-.035:0;
      if(launch)for(let i=0;i<8;i++){const a=i*Math.PI/4;GLOMP.icons.draw(view,'launchStar'+i,'star',960+Math.cos(a)*(240+progress*190),487+Math.sin(a)*(130+progress*90),30*(1-progress)+12,121);}
    }
    if (w.mode === 'eatEm' && w.sauce && m.phase === 'playing') draw.text(view,'notice',t('sauceWarning'),960,1020,23,c.cream,{center:true,outline:4});
    if (w.finalFeast && m.phase === 'playing') draw.text(view,'notice',t('finalFeast'),960,1020,26,c.yellow,{center:true,outline:4});
    if (w.mode === 'practice') draw.text(view,'practice',t('practiceBadge'),960,1015,25,c.cream,{center:true,outline:4});
    if(m.paused)GLOMP.hud.pause(view);
  },
  pause: function(view) {
    const draw=GLOMP.view,t=GLOMP.i18n.text,c=GLOMP.config.ui.colors;
    GLOMP.ui.buttons=[];draw.graphics(view,'pauseShade',400).beginFill(c.dark,.94).drawRect(0,0,1920,1080).endFill();view.overlayZ=300;
    draw.title(view,'pause',t('pauseTitle'),960,330,72,c.yellow,{middle:true});
    draw.button(view,'resume',t('resume'),700,460,520,c.green);draw.button(view,'exit',t('playAgain'),700,590,520,c.blue);view.overlayZ=0;
  },
};
