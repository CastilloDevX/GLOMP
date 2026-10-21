// Presentación del reparto: solo lee los premios ya acreditados por match.
GLOMP.results = {
  progress: function(time,start,duration) { return Math.max(0,Math.min(1,(time-start)/duration)); },
  ease: function(value) { return 1-Math.pow(1-value,3); },
  columns: function(count) {
    const width=Math.min(620,1580/count);
    return Array.from({length:count},function(_,index){return {x:960+(index-(count-1)/2)*width,width:width};});
  },
  rows: function(m) {
    if(m.phase!=='final')return m.rows;
    return m.rows.slice().sort(function(a,b){return Number(m.winners.includes(b.player.playerId))-Number(m.winners.includes(a.player.playerId))||m.participants[b.player.playerId].slices-m.participants[a.player.playerId].slices||a.place-b.place;}).map(function(row,index){return Object.assign({},row,{displayPlace:m.winners.includes(row.player.playerId)?1:index+1});});
  },
  sample: function(m,row,index,time) {
    const c=GLOMP.config.ui.polish,p=m.participants[row.player.playerId],goal=GLOMP.config.slicesToWin;
    const before=Math.max(0,p.slices-row.slices),earned=GLOMP.results.progress(time,c.sliceStart+index*c.staggerSeconds,c.sliceSeconds*Math.max(1,row.slices));
    const visible=Math.min(goal,before+Math.floor(row.slices*earned+Number.EPSILON));
    const coins=m.phase==='final'?p.coins:row.coins;
    return {entry:GLOMP.results.ease(GLOMP.results.progress(time,index*c.staggerSeconds,c.entrySeconds)),slices:visible,goal:goal,
      displayedSlices:before+Math.floor(row.slices*earned+Number.EPSILON),coins:Math.round(coins*GLOMP.results.ease(GLOMP.results.progress(time,c.coinStart+index*c.staggerSeconds,c.coinSeconds))),remaining:Math.max(0,goal-p.slices)};
  },
  statistic: function(m,row) {
    const p=row.player,key={eatEm:'resultMass',pom:'resultPom',crazy:'resultCrazy',buffet:'resultBuffet',war:'resultWar'}[m.world.mode];
    return GLOMP.i18n.text(key,{value:Math.floor(['eatEm','buffet'].includes(m.world.mode)?p.mass:m.world.mode==='pom'?p.stats.passes:m.world.mode==='war'?p.stats.pushes:p.stats.orders),devoured:p.stats.devoured,feasts:p.stats.feasts,eaten:p.stats.eaten});
  },
  podium: function(view,key,x,y,width,height,color) {
    const d=GLOMP.view,g=d.graphics(view,'podium:'+key,111),edge=width*.12;
    g.beginFill(0x071B55,.3).drawEllipse(x,y+height+14,width*.56,edge).endFill();
    g.lineStyle(4,0x0C3479).beginFill(d.mix(color,0x061F5C,.30)).drawRoundedRect(x-width/2,y,width,height,18).endFill();
    for(let i=0;i<16;i++){const amount=.12+Math.sin(i/15*Math.PI)*.40;g.lineStyle(0).beginFill(d.mix(color,0xFFFFFF,amount)).drawRect(x-width/2+3+i*(width-6)/16,y+4,(width-6)/16+1,height-8).endFill();}
    g.beginFill(d.mix(color,0x14235E,.15)).drawEllipse(x,y+height-3,width/2-2,edge*.43).endFill();
    g.lineStyle(4,0xFFF5C3).beginFill(d.mix(color,0xFFFFFF,.40)).drawEllipse(x,y,width/2,edge).endFill();
    g.lineStyle(2,d.mix(color,0xFFFFFF,.8)).beginFill(color).drawEllipse(x,y-3,width*.43,edge*.68).endFill().lineStyle(0);
  },
  render: function(view,m) {
    const d=GLOMP.view,t=GLOMP.i18n.text,c=GLOMP.config.ui.polish,final=m.phase==='final',time=m.resultsElapsed||0;
    const background=d.image(view,'resultsBackground','map-'+m.world.theme,960,540,1980,1120,{fill:true,z:0});
    if(background&&!background.filters){const Blur=PIXI.BlurFilter||(PIXI.filters&&PIXI.filters.BlurFilter);if(Blur)background.filters=[new Blur(7,3)];}
    d.graphics(view,'resultsShade',90).beginFill(0x0A173F,.52).drawRect(0,0,1920,1080).endFill();
    view.overlayZ=100;
    const entry=GLOMP.results.ease(GLOMP.results.progress(time,0,c.entrySeconds)),offset=(1-entry)*60;
    d.surface(view,'resultsBoard',140,170+offset,1640,795,0x06459F,false,101).alpha=entry;
    const decor=d.graphics(view,'resultsDecor',102);
    for(let i=0;i<16;i++){decor.beginFill(0x74D8FF,.07*entry);GLOMP.icons.star(decor,225+(i%8)*210,310+Math.floor(i/8)*390,28,14,5);decor.endFill();}
    d.heading(view,'resultsTitle',t(final?'finalMatch':'results'),960,100+offset,1420,64);
    GLOMP.icons.draw(view,'resultsCrest','star',960,68+offset,78,115);
    const rows=GLOMP.results.rows(m),columns=GLOMP.results.columns(rows.length),compact=rows.length>3;
    rows.forEach(function(row,index){
      const p=m.participants[row.player.playerId],sample=GLOMP.results.sample(m,row,index,time),column=columns[index],x=column.x;
      const place=row.displayPlace||row.place,gold=place===1,color=gold?0xFFBF23:place===2?0xB8CEEF:place===3?0xDD9372:0x799FEC;
      const podiumWidth=Math.min(470,column.width*.88),rise=(1-sample.entry)*125;
      const top=(compact?730:680)+Math.min(place-1,1)*(compact?12:28)+rise;
      const size=Math.min(compact?215:300,column.width*.82),bounce=gold?Math.sin(time*c.cheerRate)*c.cheerHeight*sample.entry:Math.sin(time*c.cheerRate+index)*c.cheerHeight*.35;
      GLOMP.results.podium(view,'result'+index,x,top,podiumWidth,840-top+rise,color);
      const avatar=d.slime(view,'resultSlime'+index,x,top-10-size*GLOMP.config.animation.bodyAspect/2-bounce,size,Number(row.player.bodyColor.slice(4)),gold?1:Number(row.player.face.slice(4)),1,1,sample.entry,113,null,row.player);
      if(avatar)avatar.scale.set(1+(1-sample.entry)*.10);
      const cakeWidth=compact?78:110,cakeHeight=cakeWidth*.94,step=compact?22:26,cakeBottom=(compact?558:432)+Math.min(place-1,4)*(compact?8:18)+rise;
      const platter=d.graphics(view,'cakePlatter'+index,114);platter.lineStyle(3,0xFFFFD7).beginFill(color).drawEllipse(x,cakeBottom+6,cakeWidth*.66,12).endFill().lineStyle(0);
      for(let slice=0;slice<sample.slices;slice++){
        const start=c.sliceStart+index*c.staggerSeconds+Math.max(0,slice-(p.slices-row.slices))*c.sliceSeconds;
        const pop=1+Math.sin(GLOMP.results.progress(time,start,c.sliceSeconds)*Math.PI)*.12;
        d.image(view,'cake'+index+':'+slice,'reward-cake',x,cakeBottom-cakeHeight/2-slice*step,cakeWidth*pop,cakeHeight*pop,{z:116+slice});
      }
      d.surface(view,'resultScore'+index,x+cakeWidth*.6,cakeBottom-135,compact?100:140,64,color,false,122);
      d.title(view,'resultSlice'+index,t('slices',{count:sample.displayedSlices,goal:sample.goal}),x+cakeWidth*.6+(compact?50:70),cakeBottom-104,compact?30:38,0xFFFFFF,{middle:true,maxWidth:compact?85:125,maxHeight:48,z:123});
      const badge=GLOMP.icons.draw(view,'rank'+index,'star',x,(compact?780:760)+rise,compact?60:78,124);if(badge)badge.tint=0xFFFFFF;
      d.title(view,'rank'+index,String(place),x,(compact?782:762)+rise,compact?29:35,0xFFFFFF,{middle:true,z:125,stroke:4});
      const labelWidth=Math.min(470,column.width*.91);
      d.surface(view,'resultName'+index,x-labelWidth/2,852,labelWidth,68,gold?0xA7620C:0x58309E,false,126);
      d.title(view,'resultName'+index,t('rankPlayer',{place:place,number:p.playerId+1}),x,873,compact?26:35,0xFFFFFF,{middle:true,z:127,maxWidth:labelWidth-22,maxHeight:40,stroke:4});
      const stats=d.text(view,'resultStat'+index,GLOMP.results.statistic(m,row),x,906,compact?16:21,0xDAF4FF,{center:true,middle:true,z:128,outline:2,stroke:0x103B8C});if(stats.width>labelWidth-18)stats.style.fontSize=Math.floor(stats.style.fontSize*(labelWidth-18)/stats.width);
      const coinY=829,coinSize=compact?42:55,maxTextWidth=Math.min(compact?170:260,column.width*.64);
      const reward=d.title(view,'resultEarn'+index,t(final?'totalGlomps':'rewardGlomps',{coins:sample.coins}),x,coinY+rise,compact?21:29,0xFFFFFF,{middle:true,z:124,maxWidth:maxTextWidth,maxHeight:48,stroke:4});
      const textWidth=reward.inner.width,rewardWidth=coinSize+12+textWidth;
      reward.x=x-rewardWidth/2+coinSize+12+textWidth/2;
      GLOMP.icons.draw(view,'rewardCoin'+index,'coin',x-rewardWidth/2+coinSize/2,coinY+rise,coinSize,123);
      d.text(view,'resultRemaining'+index,t(sample.remaining===1?'sliceRemaining':sample.remaining?'slicesRemaining':'goalReached',{count:sample.remaining}),x,943,compact?18:23,gold?0xFFDF73:0xD7EEFF,{center:true,middle:true,z:123,outline:3,stroke:0x103B8C});
    });
    const confetti=d.graphics(view,'resultsConfetti',129);
    for(let i=0;i<c.confettiCount;i++){
      const age=time-i/c.confettiCount*c.entrySeconds;if(age<0||age>c.confettiSeconds)continue;
      const alpha=Math.min(1,(c.confettiSeconds-age)*2),x=190+(i*137%1540)+Math.sin(age*2+i)*35,y=180+age*135+(i*43%130);
      confetti.beginFill([0xFFE05B,0xFF7DCA,0x8DEEFF,0xFFFFFF][i%4],alpha).drawPolygon([x,y,x+8*Math.cos(age*5+i),y+4,x+6,y+15,x-2,y+10]).endFill();
    }
    if(final){
      if(!GLOMP.ui.buttons.some(function(b){return b.id===GLOMP.ui.focus;}))GLOMP.ui.focus='returnRoom';
      d.button(view,'returnRoom',t('playAgain'),680,990,560,0xFFC92F,true,78);
    } else {
      const remaining=Math.max(0,Math.ceil(GLOMP.config.round.resultsSeconds-m.phaseElapsed));
      d.surface(view,'nextRound',580,990,760,78,0x0775C7,false,130);GLOMP.icons.draw(view,'nextRoundClock','clock',634,1028,54,133);
      d.title(view,'nextRound',t('nextRound',{seconds:remaining}),985,1029,31,0xFFFFFF,{middle:true,z:134,maxWidth:620,maxHeight:51});
      const bar=d.graphics(view,'nextRoundProgress',132);bar.beginFill(0x7EECFF).drawRoundedRect(620,1060,680*Math.max(0,1-m.phaseElapsed/GLOMP.config.round.resultsSeconds),4,2).endFill();
    }
    view.overlayZ=0;
  },
};
