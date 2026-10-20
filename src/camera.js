// Cámara compartida: encuadra exclusivamente a los humanos vivos, con margen para el HUD.
GLOMP.camera = {
  target: function(w) {
    const c=GLOMP.config.camera,u=GLOMP.config.ui;
    const players=GLOMP.maps.alive(w);
    if(!players.length)return {cx:w.width/2,cy:w.height/2,scale:Math.min(u.width/w.width,u.height/w.height)};
    const minX=Math.min.apply(null,players.map(function(p){return p.x-p.radius;})),maxX=Math.max.apply(null,players.map(function(p){return p.x+p.radius;}));
    const minY=Math.min.apply(null,players.map(function(p){return p.y-p.radius;})),maxY=Math.max.apply(null,players.map(function(p){return p.y+p.radius;}));
    const fit=Math.min(u.width/w.width,u.height/w.height);
    const scale=Math.max(fit,Math.min(w.mode==='war'?GLOMP.config.minigames.war.cameraMaxScale:c.maxScale,(u.width-c.paddingX*2)/(maxX-minX||1),(u.height-c.paddingTop-c.paddingBottom)/(maxY-minY||1)));
    return {cx:(minX+maxX)/2,cy:(minY+maxY)/2,scale:scale};
  },
  update: function(w,dt) {
    const c=GLOMP.config.camera,target=GLOMP.camera.target(w);
    if(!w.camera){w.camera=Object.assign({},target);return;}
    const a=1-Math.exp(-c.followRate*dt),z=1-Math.exp(-c.zoomRate*dt);
    w.camera.cx+=(target.cx-w.camera.cx)*a;w.camera.cy+=(target.cy-w.camera.cy)*a;
    w.camera.scale=Math.min(target.scale,w.camera.scale+(target.scale-w.camera.scale)*z);
    // La suavidad nunca puede sacar del encuadre a un jugador recién separado del grupo.
    const u=GLOMP.config.ui,players=GLOMP.maps.alive(w);
    players.forEach(function(p){
      const halfX=(u.width/2-c.paddingX)/w.camera.scale,halfY=(u.height-c.paddingTop-c.paddingBottom)/2/w.camera.scale;
      w.camera.cx=Math.max(p.x+p.radius-halfX,Math.min(p.x-p.radius+halfX,w.camera.cx));
      w.camera.cy=Math.max(p.y+p.radius-halfY,Math.min(p.y-p.radius+halfY,w.camera.cy));
    });
  },
  get: function(m) {
    const w=m.world,u=GLOMP.config.ui,c=GLOMP.config.camera;
    const fit=Math.min(u.width/w.width,u.height/w.height);
    if(m.phase==='intro') {
      const t=Math.min(1,m.phaseElapsed/GLOMP.config.round.cinematicSeconds),ease=t*t*(3-2*t);
      const scale=fit*(c.introZoom+(1-c.introZoom)*ease);
      return GLOMP.camera.limit({scale:scale,x:(u.width-w.width*scale)/2+Math.sin(t*Math.PI*2)*u.width*c.introPan*(1-t),y:(u.height-w.height*scale)/2},w);
    }
    const camera=w.camera||GLOMP.camera.target(w),scale=camera.scale;
    const target={scale:scale,x:u.width/2-camera.cx*scale,y:(u.height+c.paddingTop-c.paddingBottom)/2-camera.cy*scale};
    if(m.phase==='countdown') {
      const t=Math.min(1,m.phaseElapsed/GLOMP.config.round.countdownSeconds),a=t*t*(3-2*t);
      return GLOMP.camera.limit({scale:fit+(scale-fit)*a,x:(u.width-w.width*fit)/2*(1-a)+target.x*a,y:(u.height-w.height*fit)/2*(1-a)+target.y*a},w);
    }
    return GLOMP.camera.limit(target,w);
  },
  limit: function(frame,w) {
    const u=GLOMP.config.ui,scale=frame.scale;
    frame.x=w.width*scale>=u.width?Math.max(u.width-w.width*scale,Math.min(0,frame.x)):(u.width-w.width*scale)/2;
    frame.y=w.height*scale>=u.height?Math.max(u.height-w.height*scale,Math.min(0,frame.y)):(u.height-w.height*scale)/2;
    return frame;
  },
};
