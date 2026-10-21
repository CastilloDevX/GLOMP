// Iconos generados individualmente. La geometría de estrella solo se usa como decoración.
GLOMP.icons = {
  star: function(g,x,y,outer,inner,points) {
    const coordinates=[];
    for(let i=0;i<points*2;i++){const a=-Math.PI/2+i*Math.PI/points,r=i%2?inner:outer;coordinates.push(x+Math.cos(a)*r,y+Math.sin(a)*r);}
    g.drawPolygon(coordinates);
  },
  draw: function(view,key,type,x,y,size,z) {
    return GLOMP.view.image(view,'icon:'+key,GLOMP.config.ui.icons[type],x,y,size,size,{z:z===undefined?153:z});
  },
};
