// Iconografía propia de la interfaz: geometría limpia y legible a cualquier escala.
GLOMP.icons = {
  star: function(g,x,y,outer,inner,points) {
    const coordinates=[];
    for(let i=0;i<points*2;i++){const a=-Math.PI/2+i*Math.PI/points,r=i%2?inner:outer;coordinates.push(x+Math.cos(a)*r,y+Math.sin(a)*r);}
    g.drawPolygon(coordinates);
  },
  draw: function(view,key,type,x,y,size,z) {
    const g=GLOMP.view.graphics(view,'icon:'+key,z===undefined?153:z),ink=0x133D8D,white=0xFFFFFF;
    g.position.set(x,y);g.scale.set(size/100);g.lineStyle(5,ink,1);
    if(type==='shop') {
      g.beginFill(0xFFF2CD).drawRoundedRect(-32,-14,64,52,8).endFill();g.beginFill(0x9D623C).drawRoundedRect(7,8,16,30,4).endFill();
      g.beginFill(0xFFC53A).drawPolygon([-37,-12,-27,-40,27,-40,37,-12]).endFill();
      for(let i=0;i<4;i++)g.lineStyle(0).beginFill(i%2?white:0xFF5C72).drawRoundedRect(-37+i*19,-13,20,23,7).endFill();
    } else if(type==='shirt') {
      g.beginFill(0xFF8AE5).drawPolygon([-16,-35,-39,-22,-25,0,-15,-6,-15,38,19,38,19,-6,29,0,42,-22,18,-35,10,-24,-8,-24]).endFill();
      g.lineStyle(3,white,.7).moveTo(-9,-20).lineTo(-9,24);
    } else if(type==='gear') {
      g.beginFill(white);GLOMP.icons.star(g,0,0,42,32,10);g.endFill();g.beginFill(0x65D7FF).drawCircle(0,0,19).endFill();g.lineStyle(0).beginFill(0xB5F4FF).drawCircle(-5,-6,6).endFill();
    } else if(type==='back') {
      g.beginFill(white).drawPolygon([18,-34,-24,0,18,34]).endFill();
    } else if(type==='play') {
      g.beginFill(white).drawRoundedRect(-34,-34,68,68,18).endFill();g.beginFill(0xFFAF24).drawPolygon([-10,-22,24,0,-10,22]).endFill();
    } else if(type==='gamepad') {
      g.beginFill(0xF4FAFF).drawRoundedRect(-42,-26,84,58,22).endFill();g.lineStyle(7,ink).moveTo(-23,-13).lineTo(-23,12).moveTo(-35,0).lineTo(-10,0);
      g.lineStyle(2,ink).beginFill(0xFF6F91).drawCircle(25,-7,7).endFill().beginFill(0x44C7F4).drawCircle(12,9,7).endFill();
    } else if(type==='coin') {
      g.beginFill(0xFFCA26).drawRoundedRect(-35,-26,70,57,12).endFill();g.beginFill(0xFFF28D).drawPolygon([-34,-26,-9,-41,36,-26,12,-10]).endFill();
      g.lineStyle(0).beginFill(0xE68B16).drawCircle(-15,3,7).drawCircle(15,13,9).drawCircle(0,-27,5).endFill();
    } else if(type==='trophy') {
      g.lineStyle(8,0xBF791D).drawRoundedRect(-42,-30,84,35,14);g.lineStyle(4,ink).beginFill(0xFFD438).drawRoundedRect(-28,-40,56,61,13).drawRoundedRect(-7,18,14,22,4).drawRoundedRect(-30,37,60,12,5).endFill();
      g.lineStyle(0).beginFill(0xFFF9BE,.8).drawRoundedRect(-20,-32,7,30,3).endFill();
    } else if(type==='people') {
      g.beginFill(white).drawCircle(-17,-20,12).drawCircle(20,-18,12).drawRoundedRect(-36,-4,37,33,12).drawRoundedRect(2,-2,37,31,12).endFill();
    } else if(type==='hat') {
      g.beginFill(0x8CB9FF).drawRoundedRect(-25,-36,50,60,12).drawEllipse(0,23,44,13).endFill();g.lineStyle(0).beginFill(0xFFCC36).drawRect(-24,0,48,11).endFill();
    } else if(type==='gift') {
      g.beginFill(0xEC7BFF).drawRoundedRect(-31,-18,62,55,8).drawRoundedRect(-37,-28,74,18,5).endFill();g.lineStyle(0).beginFill(0xFFE68B).drawRect(-6,-26,13,63).endFill();
      g.lineStyle(5,0xFFE68B).drawEllipse(-13,-39,13,9).drawEllipse(13,-39,13,9);
    } else if(type==='clock') {
      g.beginFill(white).drawCircle(0,4,35).drawRoundedRect(-11,-45,22,12,5).endFill();g.lineStyle(6,0x2E95F5).moveTo(0,-18).lineTo(0,5).lineTo(16,5);
    } else if(type==='color') {
      g.beginFill(0x6BE0AE).drawCircle(-7,5,28).endFill().beginFill(0xFF85CD).drawCircle(17,-18,20).endFill();
    } else if(type==='face') {
      g.beginFill(0x8AE4FF).drawCircle(0,0,36).endFill();g.lineStyle(0).beginFill(ink).drawCircle(-12,-8,5).drawCircle(12,-8,5).endFill();g.lineStyle(5,ink).arc(0,2,18,0,Math.PI);
    } else if(type==='trail') {
      g.lineStyle(10,0xA4F4FF).arc(0,0,32,0,Math.PI*1.6).arc(0,0,15,Math.PI*1.6,Math.PI*3.1);
    } else {
      g.beginFill(type==='star'?0xFFD83D:0xC1F5FF);GLOMP.icons.star(g,0,0,42,20,5);g.endFill();g.lineStyle(0).beginFill(white,.6);GLOMP.icons.star(g,-5,-9,19,8,5);g.endFill();
    }
    g.lineStyle(0);return g;
  },
};
