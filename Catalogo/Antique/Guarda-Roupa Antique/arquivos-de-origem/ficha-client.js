function run(PARTS,SCREWS,CFG){
const {L,D,H,HINGES,DOORS,LATCHES,PULLS,DOOR_PULLS,ZD,ZC,DOOR_OPEN,GROUPS,PINFO,LT}=CFG;
const NS='http://www.w3.org/2000/svg';
let view='frente',hl=null,sel=null,xray=false;
const c=Math.cos(Math.PI/6),s=.5;
const pr=(x,y,z)=>[(x+y)*c,(x-y)*s-z];
const OPEN=Math.PI*0.55;
/* porta aberta: cada uma gira em volta das suas dobradiças; gavetas puxadas 22 cm */
function moveP(p,[x,y,z]){if(view!=='aberta')return[x,y,z];
  if(p.door){const d=DOORS[p.door-1],hx=d.hinge,hy=-0.45,a=d.side==='R'?OPEN:-OPEN,dx=x-hx,dy=y-hy;return[hx+dx*Math.cos(a)-dy*Math.sin(a),hy+dx*Math.sin(a)+dy*Math.cos(a),z]}
  if(p.drawer)return[x,y-22,z];return[x,y,z]}
function tp([x,y,z]){if(view==='tras')return[L-x,D-y,z];return[x,y,z]}
function corners(p){const [x0,y0,z0,x1,y1,z1]=p.b;const out=[];for(const x of[x0,x1])for(const y of[y0,y1])for(const z of[z0,z1])out.push(tp(moveP(p,[x,y,z])));return out}
function bbox(p){const cs=corners(p);const b=[1e9,1e9,1e9,-1e9,-1e9,-1e9];cs.forEach(v=>{for(let i=0;i<3;i++){b[i]=Math.min(b[i],v[i]);b[i+3]=Math.max(b[i+3],v[i])}});return b}
const T=.3;
function behind(A,B){ // A desenha antes de B (está mais longe: mais atrás, mais à esquerda ou mais embaixo)
  if(A[3]<=B[0]+T)return true; if(B[3]<=A[0]+T)return false;
  if(A[1]>=B[4]-T)return true; if(B[1]>=A[4]-T)return false;
  if(A[5]<=B[2]+T)return true; if(B[5]<=A[2]+T)return false;
  return null}
function order(items){const n=items.length,adj=items.map(()=>[]),indeg=new Array(n).fill(0);
  for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){const r=behind(items[i].t,items[j].t);if(r===true){adj[i].push(j);indeg[j]++}else if(r===false){adj[j].push(i);indeg[i]++}}
  const key=t=>(t[1]+t[4])-(t[0]+t[3])-(t[2]+t[5]);
  const done=new Array(n).fill(false),out=[];
  while(out.length<n){let best=-1;
    for(let i=0;i<n;i++)if(!done[i]&&indeg[i]===0&&(best<0||key(items[i].t)>key(items[best].t)))best=i;
    if(best<0)for(let i=0;i<n;i++)if(!done[i]&&(best<0||indeg[i]<indeg[best]||(indeg[i]===indeg[best]&&key(items[i].t)>key(items[best].t))))best=i;
    done[best]=true;out.push(items[best]);adj[best].forEach(j=>indeg[j]--)}
  return out}
const key=p=>p.u||p.id;
const grp=p=>p.g==='baguetes'?'vidros':p.g;
function active(p){return sel?key(p)===sel:(!hl||grp(p)===hl)}
function pick(p){const k=key(p);sel=sel===k?null:k;hl=null;document.querySelectorAll('#chips button').forEach(b=>b.setAttribute('aria-pressed','false'));showInfo();drawIso()}
function showInfo(){const box=document.getElementById('pinfo');
  if(!sel||!PINFO[sel]){box.hidden=true;box.innerHTML='';return}
  const [n,d,q,o]=PINFO[sel];
  box.innerHTML='<b class="pn"></b><span class="pd"></span><span class="pm q"></span><span class="pm o"></span><button type="button">Fechar</button>';
  box.querySelector('.pn').textContent=n;box.querySelector('.pd').textContent=d+' cm';
  box.querySelector('.q').textContent='Quantidade: '+q;box.querySelector('.o').textContent=o;
  box.querySelector('button').onclick=()=>{sel=null;showInfo();drawIso()};box.hidden=false}
function poly(g,pts,fill,stroke,w){const e=document.createElementNS(NS,'polygon');e.setAttribute('points',pts.map(v=>pr(...v).map(n=>n.toFixed(2)).join(',')).join(' '));e.style.fill=fill;e.style.stroke=stroke;e.setAttribute('stroke-width',w||'.25');e.setAttribute('stroke-linejoin','round');g.appendChild(e)}
function drawBox(g,p){
  const cs=corners(p);
  const faces={top:[1,5,7,3],bot:[0,2,6,4],fr:[0,4,5,1],bk:[2,3,7,6],lf:[0,1,3,2],rt:[4,6,7,5]};
  const col=p.m==='vidro'?null:p.m==='comp'?'comp':'w';
  for(const [k,idx] of Object.entries(faces)){
    const pts=idx.map(i=>cs[i]);
    const P=pts.map(v=>pr(...v));let a=0;P.forEach((u,i)=>{const w=P[(i+1)%P.length];a+=u[0]*w[1]-w[0]*u[1]});
    if(a<=0.001)continue;
    if(!col){poly(g,pts,'var(--gl-fill)','var(--gl-stroke)','.15');continue}
    const tone=(k==='top'||k==='bot')?'top':(k==='fr'||k==='bk')?'front':'side';
    poly(g,pts,`var(--${col}-${tone})`,'var(--stroke)',p.thin?'.12':'.25');
  }
}
function drawIron(svg){
  const P=(x,y,z)=>pr(...tp([x,y,z]));
  const pathOf=(arr)=>arr.map((v,i)=>(i?'L':'M')+P(...v).map(n=>n.toFixed(2)).join(' ')).join('')+'Z';
  const add=d=>{const e=document.createElementNS(NS,'path');e.setAttribute('d',d);e.setAttribute('class','p-iron');svg.appendChild(e)};
  if(view==='tras')return;
  DOORS.forEach((d,k)=>{const o=d.side==='R'?1:-1,h=d.hinge,dp={door:k+1};
    HINGES.forEach(z=>{
      add(pathOf([[h,-0.3,z-3.2],[h+3.7*o,-0.3,z-3.2],[h+3.7*o,-0.3,z+3.2],[h,-0.3,z+3.2]]));
      add(pathOf([[h,-0.3,z-2.5],[h-5.5*o,-0.3,z-2.5],[h-5.5*o,-0.3,z+2.5],[h,-0.3,z+2.5]].map(v=>moveP(dp,v))));
    })});
  LATCHES.forEach(l=>{const e=document.createElementNS(NS,'path');e.setAttribute('d',pathOf([[l.x-0.9,-0.8,l.z-3.5],[l.x+0.9,-0.8,l.z-3.5],[l.x+0.9,-0.8,l.z+3.5],[l.x-0.9,-0.8,l.z+3.5]]));e.setAttribute('class','p-w2');e.style.fill='var(--w-side)';e.style.stroke='var(--stroke)';e.setAttribute('stroke-width','.2');svg.appendChild(e)});
  const ring=(g,x,z)=>add(pathOf([[x-1.5,-0.3,z-3.5],[x+1.5,-0.3,z-3.5],[x+1.5,-0.3,z+1.5],[x-1.5,-0.3,z+1.5]].map(v=>moveP(g,v))));
  PULLS.forEach(pl=>ring({drawer:pl.drawer},pl.x,pl.z+1));
  DOOR_PULLS.forEach(pl=>ring({door:pl.door},pl.x,pl.z));
}
function drawScrews(svg){
  SCREWS.forEach(sc=>{if(view==='aberta')return;const a=pr(...tp(sc.a)),b=pr(...tp(sc.b));const vis=sc.t.startsWith('vis');const col=vis?'var(--scr-vis)':'var(--scr)';
    const ln=document.createElementNS(NS,'line');[['x1',a[0]],['y1',a[1]],['x2',b[0]],['y2',b[1]]].forEach(([k,v])=>ln.setAttribute(k,v.toFixed(2)));
    ln.style.stroke=col;ln.setAttribute('stroke-width','.5');ln.setAttribute('stroke-linecap','round');svg.appendChild(ln);
    const hd=document.createElementNS(NS,'circle');hd.setAttribute('cx',a[0].toFixed(2));hd.setAttribute('cy',a[1].toFixed(2));hd.setAttribute('r',vis?'.9':'.65');
    hd.style.fill=col;hd.style.stroke='var(--paper)';hd.setAttribute('stroke-width','.15');svg.appendChild(hd)})}
function drawDims(svg){
  const ps=PARTS.filter(p=>key(p)===sel);if(!ps.length)return;
  const p0=ps[0];let b=bbox(p0); // cota de uma peça só (a primeira do grupo)
  const [x0,y0,z0,x1,y1,z1]=b,o=3,fmt=v=>String(Math.round(v*10)/10).replace('.',',');
  const seg=(A3,C3,val,off)=>{const A=pr(...A3),C=pr(...C3);
    const ln=document.createElementNS(NS,'line');[['x1',A[0]],['y1',A[1]],['x2',C[0]],['y2',C[1]]].forEach(([k,v])=>ln.setAttribute(k,v.toFixed(2)));ln.style.stroke='var(--amora)';ln.setAttribute('stroke-width','.45');svg.appendChild(ln);
    const mx=(A[0]+C[0])/2+off[0],my=(A[1]+C[1])/2+off[1];
    const tx=document.createElementNS(NS,'text');tx.setAttribute('x',mx.toFixed(2));tx.setAttribute('y',(my+1.5).toFixed(2));tx.setAttribute('text-anchor','middle');tx.style.fill='var(--paper)';tx.style.font='600 4.2px var(--f-mono)';tx.textContent=fmt(val);
    svg.appendChild(tx);const bb=tx.getBBox();
    const bg=document.createElementNS(NS,'rect');bg.setAttribute('x',(bb.x-1.2).toFixed(2));bg.setAttribute('y',(bb.y-.6).toFixed(2));bg.setAttribute('width',(bb.width+2.4).toFixed(2));bg.setAttribute('height',(bb.height+1.2).toFixed(2));bg.setAttribute('rx','1.2');bg.style.fill='var(--amora)';
    svg.insertBefore(bg,tx)};
  seg([x0,y0-o,z0],[x1,y0-o,z0],x1-x0,[-3,4.5]);
  seg([x1+o,y0,z0],[x1+o,y1,z0],y1-y0,[3,4.5]);
  seg([x1+o,y0-o,z0],[x1+o,y0-o,z1],z1-z0,[6,0]);
}
function drawIso(){
  const svg=document.getElementById('iso');svg.innerHTML='';
  const items=PARTS.map(p=>({p,t:bbox(p)}));
  let minx=1e9,miny=1e9,maxx=-1e9,maxy=-1e9;
  items.forEach(({p})=>corners(p).forEach(v=>{const [a,b]=pr(...v);minx=Math.min(minx,a);maxx=Math.max(maxx,a);miny=Math.min(miny,b);maxy=Math.max(maxy,b)}));
  const pad=10;svg.setAttribute('viewBox',`${minx-pad} ${miny-pad} ${maxx-minx+2*pad} ${maxy-miny+2*pad}`);
  order(items).forEach(({p})=>{
    const g=document.createElementNS(NS,'g');g.setAttribute('class','piece');
    g.style.opacity=xray?(p.m==='vidro'?.5:.16):(active(p)?1:.14);
    drawBox(g,p);g.style.cursor='pointer';g.addEventListener('click',()=>pick(p));svg.appendChild(g)});
  if(!xray)drawIron(svg);
  if(xray)drawScrews(svg);
  if(sel)drawDims(svg);
}
function setHl(h){hl=h;sel=null;showInfo();document.querySelectorAll('#chips button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.g===hl?'true':'false'));drawIso()}
const chips=document.getElementById('chips');
GROUPS.forEach(([g,n])=>{const b=document.createElement('button');b.type='button';b.dataset.g=g;b.textContent=n;b.setAttribute('aria-pressed','false');b.onclick=()=>setHl(hl===g?null:g);chips.appendChild(b)});
document.querySelectorAll('.views button[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;document.querySelectorAll('.views button[data-view]').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));drawIso()});
document.getElementById('xray').onclick=e=>{xray=!xray;e.currentTarget.setAttribute('aria-pressed',xray?'true':'false');document.getElementById('xleg').hidden=!xray;drawIso()};
document.querySelectorAll('.fin button').forEach(b=>b.onclick=()=>{document.querySelector('.wrap').classList.toggle('jat',b.dataset.fin==='jat');document.querySelectorAll('.fin button').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'))});
document.getElementById('copyBtn').onclick=e=>{const t=document.getElementById('copyTxt').textContent;
  try{navigator.clipboard.writeText(t).then(()=>{e.target.textContent='Copiado!';setTimeout(()=>e.target.textContent='Copiar texto',1600)})}catch(_){}};
drawIso();

/* vistas ortográficas, desenhadas a partir das mesmas peças: unidades = cm */
const el=(svg,tag,attrs,txt)=>{const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(txt!=null)e.textContent=txt;svg.appendChild(e);return e};
const R=(svg,x,y,w,h,cls)=>el(svg,'rect',{x,y,width:Math.max(w,.05),height:Math.max(h,.05),class:cls});
const f1=v=>String(Math.round(v*10)/10).replace('.',',');
function dimH(svg,x0,x1,y,t){el(svg,'line',{x1:x0,y1:y,x2:x1,y2:y,class:'d-line'});[x0,x1].forEach(x=>el(svg,'line',{x1:x-1,y1:y+1,x2:x+1,y2:y-1,class:'d-line'}));el(svg,'text',{x:(x0+x1)/2,y:y-1.2,'text-anchor':'middle',class:'d-text'},t)}
function dimV(svg,y0,y1,x,t){el(svg,'line',{x1:x,y1:y0,x2:x,y2:y1,class:'d-line'});[y0,y1].forEach(y=>el(svg,'line',{x1:x-1,y1:y+1,x2:x+1,y2:y-1,class:'d-line'}));const ty=(y0+y1)/2;el(svg,'text',{x:x-1.5,y:ty,'text-anchor':'middle',class:'d-text',transform:`rotate(-90 ${x-1.5} ${ty})`},t)}
const lbl=(svg,x,y,t,a='middle')=>el(svg,'text',{x,y,'text-anchor':a,class:'lbl'},t);
const cls=(p,alt)=>p.m==='vidro'?'p-gl':alt?'p-w2':'p-w';
const hinge=(v,X,Z,d,z)=>{const o=d.side==='R'?1:-1,h=d.hinge;R(v,Math.min(X(h),X(h+3.7*o)),Z(z)-3.2,3.7,6.4,'p-iron');R(v,Math.min(X(h),X(h-5.5*o)),Z(z)-2.5,5.5,5,'p-iron')};
const ringV=(v,X,Z,x,z)=>{el(v,'circle',{cx:X(x),cy:Z(z),r:1.5,class:'p-iron'});el(v,'circle',{cx:X(x),cy:Z(z)+2.2,r:1.9,style:'fill:none;stroke:#1D1B1C;stroke-width:.5'})};

/* FRENTE: peças da face da frente, de trás para a frente */
(function(){const v=document.getElementById('vFront');const ml=34,mr=22,oy=8,Z=z=>oy+H-z,X=x=>ml+x;
  v.setAttribute('viewBox',`0 0 ${ml+L+mr} ${H+(CFG.bays.length>1?30:24)}`);
  const ps=PARTS.filter(p=>p.b[1]<4.5&&p.g!=='interno'&&!p.thin).sort((a,b)=>b.b[1]-a.b[1]);
  ps.forEach(p=>{const [x0,y0,z0,x1,y1,z1]=p.b;R(v,X(x0),Z(z1),x1-x0,z1-z0,cls(p,p.g==='chapeu'&&p.id!=='topo'||p.g==='gaveta'||p.u==='almA'||p.u==='almB'||p.g==='base'))});
  DOORS.forEach(d=>HINGES.forEach(z=>hinge(v,X,Z,d,z)));
  LATCHES.forEach(l=>R(v,X(l.x-0.9),Z(l.z+3.5),1.8,7,'p-w2'));
  PULLS.forEach(pl=>ringV(v,X,Z,pl.x,pl.z+1));DOOR_PULLS.forEach(pl=>ringV(v,X,Z,pl.x,pl.z));
  el(v,'line',{x1:X(-10),y1:Z(0),x2:X(L+10),y2:Z(0),style:'stroke:var(--hid);stroke-width:.4'});
  dimH(v,X(0),X(L),Z(0)+6,f1(L));dimH(v,X(-3),X(L+3),Z(H)-4,f1(LT));
  dimV(v,Z(H),Z(0),X(-3)-14,f1(H));dimV(v,Z(ZD[1]+0.2),Z(ZD[0]-0.2),X(-3)-6,f1(ZD[1]-ZD[0]+0.4)+' portas');dimV(v,Z(43),Z(12),X(-3)-6,'31 gavetas');
  dimV(v,Z(12),Z(0),X(L)+6,'12');dimV(v,Z(47),Z(43),X(L)+6,'4');dimV(v,Z(ZC),Z(ZC-10),X(L)+6,'10');
  if(CFG.bays.length>1)CFG.bays.forEach(b=>dimH(v,X(b.x0),X(b.x1),Z(0)+13,f1(b.w)+' vão'));
})();
/* LATERAL direita (frente à esquerda) */
(function(){const v=document.getElementById('vSide');const ox=26,oy=8,Z=z=>oy+H-z,Y=y=>ox+y;
  v.setAttribute('viewBox',`0 0 ${D+52} ${H+24}`);
  const ps=PARTS.filter(p=>p.b[3]>L-4.5&&p.g!=='interno'&&!p.door&&!p.drawer&&!p.thin).sort((a,b)=>a.b[3]-b.b[3]);
  ps.forEach(p=>{const [x0,y0,z0,x1,y1,z1]=p.b;R(v,Y(y0),Z(z1),y1-y0,z1-z0,cls(p,p.g==='fundo'||p.g==='base'||p.g==='chapeu'&&p.id!=='topo'))});
  el(v,'line',{x1:Y(-8),y1:Z(0),x2:Y(D+8),y2:Z(0),style:'stroke:var(--hid);stroke-width:.4'});
  dimH(v,Y(0),Y(D),Z(0)+6,f1(D));dimH(v,Y(-3),Y(D),Z(H)-4,f1(D+3));
  dimV(v,Z(12),Z(0),Y(D)+6,'12');dimV(v,Z(47),Z(43),Y(D)+6,'4');dimV(v,Z(ZC),Z(ZC-5),Y(D)+6,'5');
  lbl(v,Y(1),Z(0)+11,'frente','start');lbl(v,Y(D-1),Z(0)+11,'fundo','end');
})();
/* PORTA (a primeira), vista de frente: almofadas aparecem atrás do quadro */
(function(){const v=document.getElementById('vDoor');const d=DOORS[0],w=d.x1-d.x0,hh=ZD[1]-ZD[0];const ox=24,oy=6,Z=z=>oy+ZD[1]-z,X=x=>ox+x-d.x0;
  v.setAttribute('viewBox',`0 0 ${w+50} ${hh+12}`);
  PARTS.filter(p=>p.door===1&&p.u!=='mj').sort((a,b)=>b.b[1]-a.b[1]).forEach(p=>{const [x0,y0,z0,x1,y1,z1]=p.b;R(v,X(x0),Z(z1),x1-x0,z1-z0,cls(p,p.u==='almA'||p.u==='almB'))});
  const [a,cc]=DOOR_OPEN[0],[a2,c2]=DOOR_OPEN[1],st=CFG.ST;
  dimH(v,X(d.x0),X(d.x1),Z(ZD[0])+6,f1(w));dimH(v,X(d.x0+st),X(d.x1-st),Z(ZD[1])-3,f1(w-2*st)+' vão');
  dimV(v,Z(ZD[1]),Z(ZD[0]),X(d.x0)-8,f1(hh));dimV(v,Z(cc),Z(a),X(d.x1)+6,f1(cc-a));dimV(v,Z(c2),Z(a2),X(d.x1)+6,f1(c2-a2));
  dimV(v,Z(a),Z(ZD[0]),X(d.x1)+12,'10');dimV(v,Z(a2),Z(cc),X(d.x1)+12,'10');dimV(v,Z(ZD[1]),Z(c2),X(d.x1)+12,'10');
  lbl(v,X((d.x0+d.x1)/2),Z((a+cc)/2),'almofada atrás');
})();
/* CORTE POR CIMA, logo acima da prateleira do meio */
(function(){const v=document.getElementById('vPlan');const ox=16,oy=8,X=x=>ox+x,Y=y=>oy+y,zc=CFG.zcut;
  v.setAttribute('viewBox',`0 0 ${L+34} ${D+24}`);
  const ps=PARTS.filter(p=>(p.b[2]<zc&&p.b[5]>zc&&!p.thin)||(p.u==='prat'&&p.b[2]===CFG.shelfZ)).sort((a,b)=>(a.u==='prat'?-1:0)-(b.u==='prat'?-1:0)||a.b[5]-b.b[5]);
  ps.forEach(p=>{const [x0,y0,z0,x1,y1,z1]=p.b;R(v,X(x0),Y(y0),x1-x0,y1-y0,p.g==='colunas'||p.u==='almA'||p.u==='almB'?'p-w2':'p-w')});
  const pr0=PARTS.find(p=>p.u==='prat'&&p.b[2]===CFG.shelfZ),rd=PARTS.find(p=>p.u==='rod');
  dimH(v,X(0),X(L),Y(D)+6,f1(L));dimV(v,Y(0),Y(D),X(L)+6,f1(D));dimH(v,X(pr0.b[0]),X(pr0.b[3]),Y(8)-2,f1(pr0.b[3]-pr0.b[0]));
  lbl(v,X(L/2),Y(-2),'FRENTE (portas)');lbl(v,X((pr0.b[0]+pr0.b[3])/2),Y(30),'prateleira '+f1(pr0.b[3]-pr0.b[0])+' × 46');
  if(rd)lbl(v,X((rd.b[0]+rd.b[3])/2),Y(30),'cabideiro (varão abaixo)');
})();
}