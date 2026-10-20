// Un cuerpo de gelatina y una cara cartoon articulada; el color nunca toca ojos ni sonrisa.
GLOMP.rig = {
  pose: function(player,time,faceIndex) {
    const c=GLOMP.config.animation,speed=player?Math.min(1,Math.hypot(player.vx,player.vy)/(player.speed||1)):0;
    const vx=player?player.vx/(player.speed||1):0,vy=player?player.vy/(player.speed||1):0;
    const phase=time*c.moveRate+(player?player.playerId:faceIndex||0),breath=Math.sin(time*c.idleRate)*c.idleAmount;
    const bounce=Math.sin(phase)*c.moveBounce*speed;
    const gulp=player?Math.sin(player.gulp/GLOMP.config.physics.gulpSeconds*Math.PI)*(GLOMP.config.physics.gulpScale-1):0;
    const blinkTime=(time+(player?player.playerId:faceIndex||0))%c.blinkPeriod;
    const blink=blinkTime<c.blinkSeconds?Math.max(0.08,Math.abs(blinkTime/c.blinkSeconds*2-1)):1;
    let mouth=player?.expression&&player.expression!=='smile'?player.expression:GLOMP.config.art.faces[faceIndex||0];
    if(player?.gulp>0)mouth='gasp';else if(player?.gesture>0)mouth='grit';
    return {vx:vx,vy:vy,speed:speed,breath:breath,bounce:bounce,gulp:gulp,blink:blink,mouth:mouth};
  },
  vertex: function(u,v,pose) {
    const c=GLOMP.config.animation,top=1-v,stretch=pose.breath+pose.bounce+pose.gulp;
    return {x:(u-0.5)*(1-stretch*0.55)+pose.vx*c.lean*top*top,
      y:(v-0.5)*(1+stretch)-Math.abs(pose.bounce)*top+pose.vy*c.lean*top*top};
  },
  face: function(parts,size,pose,faceIndex) {
    const c=GLOMP.config.animation,ink=0x101F48;
    const anchor=GLOMP.rig.vertex(.5,.52,pose),faceX=(anchor.x-pose.vx*c.faceLag)*size;
    const faceY=(pose.bounce+pose.vy*c.faceLag)*size,gazeX=pose.vx*c.eyeGaze*size,gazeY=pose.vy*c.eyeGaze*size;
    const happy=pose.mouth==='cheer',sleepy=faceIndex===4,wink=faceIndex===5;
    const cheeks=parts.cheeks;cheeks.clear().beginFill(0xFF9AA9,.6).drawEllipse(faceX-size*.235,faceY+size*.09,size*.045,size*.025).drawEllipse(faceX+size*.235,faceY+size*.09,size*.045,size*.025).endFill();
    [parts.left,parts.right].forEach(function(eye,index){
      const width=size*c.eyeWidth,height=size*c.eyeHeight*(sleepy?.65:1),closed=happy||(wink&&index===1);
      eye.clear();eye.position.set(faceX+(index?1:-1)*size*c.eyeGap+gazeX,faceY+size*c.eyesY+gazeY);
      if(closed)eye.lineStyle({width:size*.017,color:ink,cap:'round'}).moveTo(-width*.55,height*.1).quadraticCurveTo(0,-height*.55,width*.55,height*.1).lineStyle(0);
      else {
        eye.beginFill(ink).drawEllipse(0,0,width/2,height*pose.blink/2).endFill();
        if(pose.blink>.3)eye.beginFill(0xFFFFFF).drawCircle(-width*.17,-height*.21,width*.14).endFill();
      }
    });
    const mouth=parts.mouth,w=size*c.mouthWidth,h=size*c.mouthHeight*(happy?1.15:1);
    mouth.clear();mouth.position.set(faceX+gazeX*.4,faceY+size*c.mouthY);
    if(pose.mouth==='grit')mouth.lineStyle({width:size*.012,color:ink,cap:'round'}).moveTo(-w*.42,-h*.05).quadraticCurveTo(-w*.2,h*.25,0,0).quadraticCurveTo(w*.2,h*.25,w*.42,-h*.05).lineStyle(0);
    else if(pose.mouth==='gasp')mouth.beginFill(0x41203D).drawEllipse(0,0,w*.30,h*.53).endFill().beginFill(0xFF82A5).drawEllipse(0,h*.24,w*.17,h*.16).endFill();
    else {
      mouth.beginFill(0x4C203C).moveTo(-w/2,-h*.38).quadraticCurveTo(0,-h*.06,w/2,-h*.38).bezierCurveTo(w*.44,h*.50,-w*.44,h*.50,-w/2,-h*.38).endFill();
      mouth.beginFill(0xFF7DA1).drawEllipse(0,h*.17,w*.27,h*.19).endFill();
    }
    parts.brows.clear();
    if(pose.mouth==='grit')[-1,1].forEach(function(side){
      const bx=faceX+side*size*c.eyeGap;parts.brows.lineStyle({width:size*.012,color:ink,cap:'round'}).moveTo(bx-side*size*.045,faceY-size*.09).lineTo(bx+side*size*.045,faceY-size*.13).lineStyle(0);
    });
  },
  draw: function(view,key,x,y,size,bodyIndex,faceIndex,alpha,z,player,equipment) {
    const d=GLOMP.view,c=GLOMP.config.animation,texture=d.textures[GLOMP.config.art.bodyAsset]||d.textures['slime-base-chatgpt-v1'];
    if(!texture)return null;
    const root=d.item(view,'rig:'+key,function(){
      const container=new PIXI.Container(),body=new PIXI.SimplePlane(texture,c.meshColumns,c.meshRows);
      const left=new PIXI.Graphics(),right=new PIXI.Graphics(),mouth=new PIXI.Graphics(),brows=new PIXI.Graphics(),cheeks=new PIXI.Graphics();
      const sparkles=new PIXI.Container(),hat=new PIXI.Sprite();hat.anchor.set(.5,.8);
      const color=GLOMP.config.ui.cartoon;
      const filter=new PIXI.Filter(undefined,'varying vec2 vTextureCoord; uniform sampler2D uSampler; uniform vec3 bodyColor; uniform float highlightStart; uniform float highlightEnd; uniform float gloss; uniform float bodyShading; void main(void){vec4 p=texture2D(uSampler,vTextureCoord);vec3 rgb=p.rgb/max(p.a,0.001);float l=dot(rgb,vec3(0.2126,0.7152,0.0722));float shine=smoothstep(highlightStart,highlightEnd,l)*gloss;vec3 shaded=bodyColor*(bodyShading+(1.0-bodyShading)*l);vec3 outColor=mix(shaded,vec3(1.0),shine);gl_FragColor=vec4(outColor*p.a,p.a);}',{bodyColor:[1,1,1],highlightStart:color.highlightStart,highlightEnd:color.highlightEnd,gloss:color.gloss,bodyShading:color.bodyShading});
      body.filters=[filter];
      container.addChild(sparkles,body,cheeks,left,right,mouth,brows,hat);container.parts={body:body,left:left,right:right,mouth:mouth,brows:brows,cheeks:cheeks,hat:hat,sparkles:sparkles,filter:filter};return container;
    });
    const time=player?player.animationTime:GLOMP.ui.elapsed,pose=GLOMP.rig.pose(player,time,faceIndex);
    const p=root.parts,height=size*c.bodyAspect;
    root.position.set(x,y);root.zIndex=(view.overlayZ||0)+(z===undefined?110:z);root.alpha=alpha===undefined?1:alpha;
    const color=bodyIndex===-1?GLOMP.config.art.botColor:GLOMP.config.art.bodyColors[bodyIndex]===undefined?GLOMP.config.art.bodyColors[0]:GLOMP.config.art.bodyColors[bodyIndex];
    p.body.tint=0xFFFFFF;p.filter.uniforms.bodyColor=[(color>>16&255)/255,(color>>8&255)/255,(color&255)/255];
    const buffer=p.body.geometry.getBuffer('aVertexPosition'),vertices=buffer.data;
    for(let row=0;row<c.meshRows;row++)for(let col=0;col<c.meshColumns;col++) {
      const offset=(row*c.meshColumns+col)*2,point=GLOMP.rig.vertex(col/(c.meshColumns-1),row/(c.meshRows-1),pose);
      vertices[offset]=point.x*size;vertices[offset+1]=point.y*height;
    }
    buffer.update();GLOMP.rig.face(p,size,pose,faceIndex);
    const gear=equipment||player||{},cos=c.cosmetics;
    p.hat.visible=!!(gear.accessory&&d.textures[gear.accessory]);
    if(p.hat.visible) {
      p.hat.texture=d.textures[gear.accessory];p.hat.anchor.set(.5,.8);
      const scale=Math.min(size*cos.hatWidth/p.hat.texture.width,size*cos.hatHeight/p.hat.texture.height);
      p.hat.scale.set(scale);const mount=GLOMP.rig.vertex(.5,.08,pose);p.hat.position.set(mount.x*size,mount.y*height);
      p.hat.rotation=pose.vx*c.lean;p.hat.tint=0xFFFFFF;
    }
    while(p.sparkles.children.length<cos.particleCount){const star=new PIXI.Sprite();star.anchor.set(.5);p.sparkles.addChild(star);}
    p.sparkles.children.forEach(function(star,index){
      star.visible=!!(gear.particles&&d.textures[gear.particles]);
      if(star.visible){star.texture=d.textures[gear.particles];const angle=time*cos.orbitRate+index/cos.particleCount*Math.PI*2;star.position.set(Math.cos(angle)*size*cos.particleRadius,Math.sin(angle)*height*cos.particleRadius);star.width=size*cos.particleSize;star.height=size*cos.particleSize;star.alpha=.5+Math.sin(angle)*.3;star.rotation=angle;}
    });
    root.pose=pose;return root;
  },
};
