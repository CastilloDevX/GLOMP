// Un cuerpo canónico, deformación de malla y piezas faciales que nunca reciben tinte.
GLOMP.rig = {
  pose: function(player,time,faceIndex) {
    const c=GLOMP.config.animation;
    const speed=player?Math.min(1,Math.hypot(player.vx,player.vy)/player.speed):0;
    const vx=player?player.vx/(player.speed||1):0,vy=player?player.vy/(player.speed||1):0;
    const phase=time*c.moveRate+(player?player.playerId:faceIndex||0);
    const breath=Math.sin(time*c.idleRate)*c.idleAmount;
    const bounce=Math.sin(phase)*c.moveBounce*speed;
    const gulp=player?Math.sin(player.gulp/GLOMP.config.physics.gulpSeconds*Math.PI)*(GLOMP.config.physics.gulpScale-1):0;
    const blinkTime=(time+(player?player.playerId:faceIndex||0))%c.blinkPeriod;
    const blink=blinkTime<c.blinkSeconds?Math.max(0.08,Math.abs(blinkTime/c.blinkSeconds*2-1)):1;
    let mouth=player?.expression||GLOMP.config.art.faces[faceIndex||0];
    if(player?.gulp>0)mouth='gasp';else if(player?.gesture>0)mouth='grit';
    return {vx:vx,vy:vy,speed:speed,breath:breath,bounce:bounce,gulp:gulp,blink:blink,mouth:mouth};
  },
  vertex: function(u,v,pose) {
    const c=GLOMP.config.animation,top=1-v;
    // La base se ensancha al apoyar; la coronilla y la cara se inclinan hacia la marcha.
    const stretch=pose.breath+pose.bounce+pose.gulp;
    return {x:(u-0.5)*(1-stretch*0.55)+pose.vx*c.lean*top*top,
      y:(v-0.5)*(1+stretch)-Math.abs(pose.bounce)*top+pose.vy*c.lean*top*top};
  },
  draw: function(view,key,x,y,size,bodyIndex,faceIndex,alpha,z,player,equipment) {
    const d=GLOMP.view,c=GLOMP.config.animation,texture=d.textures['slime-base-chatgpt-v1'];
    if(!texture)return null;
    const root=d.item(view,'rig:'+key,function(){
      const container=new PIXI.Container();
      const body=new PIXI.SimplePlane(texture,c.meshColumns,c.meshRows);
      const left=new PIXI.Sprite(),right=new PIXI.Sprite(),mouth=new PIXI.Sprite(),brows=new PIXI.Graphics();
      [left,right,mouth].forEach(function(s){s.anchor.set(0.5);s.tint=0xffffff;});
      const sparkles=new PIXI.Container(),hat=new PIXI.Sprite();hat.anchor.set(0.5,0.8);
      container.addChild(sparkles,body,left,right,mouth,brows,hat);container.parts={body:body,left:left,right:right,mouth:mouth,brows:brows,hat:hat,sparkles:sparkles};return container;
    });
    const time=player?player.animationTime:GLOMP.ui.elapsed,pose=GLOMP.rig.pose(player,time,faceIndex);
    const p=root.parts,height=size*c.bodyAspect;
    root.position.set(x,y);root.zIndex=(view.overlayZ||0)+(z===undefined?110:z);root.alpha=alpha===undefined?1:alpha;
    p.body.tint=bodyIndex===-1?GLOMP.config.art.botColor:GLOMP.config.art.bodyColors[bodyIndex]===undefined?GLOMP.config.art.bodyColors[0]:GLOMP.config.art.bodyColors[bodyIndex];
    const buffer=p.body.geometry.getBuffer('aVertexPosition'),vertices=buffer.data;
    for(let row=0;row<c.meshRows;row++)for(let col=0;col<c.meshColumns;col++) {
      const offset=(row*c.meshColumns+col)*2,point=GLOMP.rig.vertex(col/(c.meshColumns-1),row/(c.meshRows-1),pose);
      vertices[offset]=point.x*size;vertices[offset+1]=point.y*height;
    }
    buffer.update();
    const anchor=GLOMP.rig.vertex(0.5,c.faceDepth+0.5,pose);
    const faceX=(anchor.x-pose.vx*c.faceLag)*size,faceY=pose.bounce*height+pose.vy*c.faceLag*size;
    const gazeX=pose.vx*c.eyeGaze*size,gazeY=pose.vy*c.eyeGaze*size;
    const sleepy=faceIndex===4?0.45:1,cheeky=faceIndex===5;
    [p.left,p.right].forEach(function(eye,index){
      eye.texture=d.textures['face-eye'];eye.width=size*c.eyeWidth;eye.height=size*c.eyeHeight*pose.blink*(cheeky&&index===1?0.2:sleepy);
      eye.position.set(faceX+(index?1:-1)*size*c.eyeGap+gazeX,faceY+size*c.eyesY+gazeY);eye.tint=0xffffff;
    });
    const mouthId=['gasp','grit','cheer'].includes(pose.mouth)?pose.mouth:'smile';
    p.mouth.texture=d.textures['mouth-'+mouthId];p.mouth.width=size*c.mouthWidth;p.mouth.height=size*c.mouthHeight*(pose.mouth==='gasp'?1.2:1);
    p.mouth.position.set(faceX+gazeX*0.5,faceY+size*c.mouthY);p.mouth.tint=0xffffff;
    p.brows.clear();
    if(pose.mouth==='grit') {
      p.brows.lineStyle(Math.max(1,size*0.018),0x33203F,1);
      [-1,1].forEach(function(side){const bx=faceX+side*size*c.eyeGap;p.brows.moveTo(bx-side*size*c.eyebrowWidth/2,faceY-size*0.105).lineTo(bx+side*size*c.eyebrowWidth/2,faceY-size*0.15);});
    }
    const gear=equipment||player||{},cos=c.cosmetics;
    p.hat.visible=!!(gear.accessory&&d.textures[gear.accessory]);
    if(p.hat.visible) {
      p.hat.texture=d.textures[gear.accessory];const scale=Math.min(size*cos.hatWidth/p.hat.texture.width,size*cos.hatHeight/p.hat.texture.height);
      p.hat.scale.set(scale);const mount=GLOMP.rig.vertex(.5,.08,pose);p.hat.position.set(mount.x*size,mount.y*height);p.hat.rotation=pose.vx*c.lean;p.hat.tint=0xffffff;
    }
    while(p.sparkles.children.length<cos.particleCount){const star=new PIXI.Sprite();star.anchor.set(.5);p.sparkles.addChild(star);}
    p.sparkles.children.forEach(function(star,index){
      star.visible=!!(gear.particles&&d.textures[gear.particles]);
      if(star.visible){star.texture=d.textures[gear.particles];const angle=time*cos.orbitRate+index/cos.particleCount*Math.PI*2;star.position.set(Math.cos(angle)*size*cos.particleRadius,Math.sin(angle)*height*cos.particleRadius);star.width=size*cos.particleSize;star.height=size*cos.particleSize;star.alpha=.5+Math.sin(angle)*.3;star.rotation=angle;}
    });
    root.pose=pose;return root;
  },
};
