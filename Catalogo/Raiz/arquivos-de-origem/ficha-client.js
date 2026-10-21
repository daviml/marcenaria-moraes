function run(PARTS,SCREWS,CFG){
const {L,D,H,GROUPS,PINFO}=CFG,DOORS=[];
const NS='http://www.w3.org/2000/svg';
let view='frente',hl=null,sel=null,xray=false;
const c=Math.cos(Math.PI/6),s=.5;
const pr=(x,y,z)=>[(x+y)*c,(x-y)*s-z];
const OPEN=Math.PI*0.55;
/* porta aberta: cada uma gira em volta das suas dobradiças; gavetas puxadas 22 cm */
function moveP(p,[x,y,z]){if(view!=='aberta')return[x,y,z];
  if(p.door){const d=DOORS[p.door-1],hx=d.hinge,hy=-0.45,a=d.side==='R'?OPEN:-OPEN,dx=x-hx,dy=y-hy;return[hx+dx*Math.cos(a)-dy*Math.sin(a),hy+dx*Math.sin(a)+dy*Math.cos(a),z]}
  if(p.drawer)return[x,y-20,z];return[x,y,z]}
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
  const col=p.m==='vidro'?null:p.m==='comp'?'comp':(p.peg&&preto())?'k':'w';
  if(p.bow&&col){const [x0,y0,,x1,y1,z1]=p.b,cx=(x0+x1)/2,w=(x1-x0)/2,cw=w*.42,ym=(y0+y1)/2;poly(g,[[x0,y0,z1],[x1,y0,z1],[cx+cw,ym,z1],[x1,y1,z1],[x0,y1,z1],[cx-cw,ym,z1]].map(v=>tp(v)),`var(--${col}-top)`,'var(--stroke)','.12');return}
  for(const [k,idx] of Object.entries(faces)){
    const pts=idx.map(i=>cs[i]);
    const P=pts.map(v=>pr(...v));let a=0;P.forEach((u,i)=>{const w=P[(i+1)%P.length];a+=u[0]*w[1]-w[0]*u[1]});
    if(a<=0.001)continue;
    if(!col){poly(g,pts,'var(--gl-fill)','var(--gl-stroke)','.15');continue}
    const tone=(k==='top'||k==='bot')?'top':(k==='fr'||k==='bk')?'front':'side';
    poly(g,pts,`var(--${col}-${tone})`,'var(--stroke)',p.thin?'.12':'.25');
  }
}
function drawIron(svg){}
const preto=()=>document.querySelector('.wrap').classList.contains('preto');
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


document.getElementById('pretoBtn').onclick=e=>{const on=!preto();document.querySelector('.wrap').classList.toggle('preto',on);e.currentTarget.setAttribute('aria-pressed',on?'true':'false');drawIso()};
/* vistas ortográficas, desenhadas a partir das mesmas peças: unidades = cm */
const el=(svg,tag,attrs,txt)=>{const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(txt!=null)e.textContent=txt;svg.appendChild(e);return e};
const f1=v=>String(Math.round(v*10)/10).replace('.',',');
const R=(svg,x,y,w,h,p,alt)=>el(svg,'rect',{x,y,width:Math.max(w,.05),height:Math.max(h,.05),class:(p.m==='comp'?'p-w2':alt?'p-w2':'p-w')+(p.peg&&preto()?' bk':'')});
function dimH(svg,x0,x1,y,t){el(svg,'line',{x1:x0,y1:y,x2:x1,y2:y,class:'d-line'});[x0,x1].forEach(x=>el(svg,'line',{x1:x-1,y1:y+1,x2:x+1,y2:y-1,class:'d-line'}));el(svg,'text',{x:(x0+x1)/2,y:y-1.2,'text-anchor':'middle',class:'d-text'},t)}
function dimV(svg,y0,y1,x,t){el(svg,'line',{x1:x,y1:y0,x2:x,y2:y1,class:'d-line'});[y0,y1].forEach(y=>el(svg,'line',{x1:x-1,y1:y+1,x2:x+1,y2:y-1,class:'d-line'}));const ty=(y0+y1)/2;el(svg,'text',{x:x-1.5,y:ty,'text-anchor':'middle',class:'d-text',transform:`rotate(-90 ${x-1.5} ${ty})`},t)}
const lbl=(svg,x,y,t,a='middle')=>el(svg,'text',{x,y,'text-anchor':a,class:'lbl'},t);
const solid=PARTS.filter(p=>!p.thin);
/* FRENTE: todas as peças, de trás para a frente */
(function(){const v=document.getElementById('vFront');const ml=26,mr=18,oy=8,Z=z=>oy+H-z,X=x=>ml+x;
  v.setAttribute('viewBox',`0 0 ${ml+L+mr} ${H+24}`);
  [...solid].sort((a,b)=>b.b[1]-a.b[1]).forEach(p=>{const [x0,y0,z0,x1,y1,z1]=p.b;R(v,X(x0),Z(z1),x1-x0,z1-z0,p,p.g==='gaveta'||p.g==='tampo')});
  el(v,'line',{x1:X(-8),y1:Z(0),x2:X(L+8),y2:Z(0),style:'stroke:var(--hid);stroke-width:.4'});
  dimH(v,X(0),X(L),Z(0)+6,f1(L));dimV(v,Z(H),Z(0),X(0)-10,f1(H));
  (CFG.fdims||[]).forEach(([a,b,t])=>dimV(v,Z(b),Z(a),X(L)+6,t));
})();
/* LATERAL: todas as peças, da esquerda para a direita */
(function(){const v=document.getElementById('vSide');const ox=20,oy=8,Z=z=>oy+H-z,Y=y=>ox+y;
  v.setAttribute('viewBox',`0 0 ${D+40} ${H+24}`);
  [...solid].sort((a,b)=>a.b[3]-b.b[3]).forEach(p=>{const [x0,y0,z0,x1,y1,z1]=p.b;R(v,Y(y0),Z(z1),y1-y0,z1-z0,p,p.g==='tampo')});
  el(v,'line',{x1:Y(-8),y1:Z(0),x2:Y(D+8),y2:Z(0),style:'stroke:var(--hid);stroke-width:.4'});
  dimH(v,Y(0),Y(D),Z(0)+6,f1(D));dimV(v,Z(H),Z(0),Y(D)+6,f1(H));
  lbl(v,Y(1),Z(0)+11,'frente','start');lbl(v,Y(D-1),Z(0)+11,'fundo','end');
})();
/* POR BAIXO: o que fica embaixo do tampo (vigas, sarrafos, pernas) */
(function(){const v=document.getElementById('vPlan');const ox=12,oy=10,X=x=>ox+x,Y=y=>oy+y;
  v.setAttribute('viewBox',`0 0 ${L+26} ${D+22}`);
  [...solid].filter(p=>!p.drawer&&p.g!=='prateleira').sort((a,b)=>b.b[5]-a.b[5]||b.b[2]-a.b[2]).forEach(p=>{const [x0,y0,z0,x1,y1,z1]=p.b;R(v,X(x0),Y(y0),x1-x0,y1-y0,p,p.g==='pernas'||p.g==='sarrafos')});
  dimH(v,X(0),X(L),Y(D)+6,f1(L));dimV(v,Y(0),Y(D),X(L)+6,f1(D));lbl(v,X(L/2),Y(-3),'FRENTE');
})();
/* DETALHE: o lado esquerdo da peça (cavalete ou lateral), olhando de fora; cavilhas no eixo x viram círculos */
function drawDet(){const v=document.getElementById('vDet');v.innerHTML='';
  const ps=PARTS.filter(p=>CFG.det.gs.includes(p.g)&&p.b[3]<=L/2+0.01&&!p.drawer);
  const y0=Math.min(...ps.map(p=>p.b[1])),y1=Math.max(...ps.map(p=>p.b[4])),zt=Math.max(...ps.map(p=>p.b[5]));
  const ox=16,oy=8,Y=y=>ox+y-y0,Z=z=>oy+zt-z;v.setAttribute('viewBox',`0 0 ${y1-y0+40} ${zt+22}`);
  [...ps].sort((a,b)=>b.b[0]-a.b[0]).forEach(p=>{const [,a,c0,,b,d]=p.b;
    if(p.cyl==='x'){el(v,'circle',{cx:Y((a+b)/2),cy:Z((c0+d)/2),r:(b-a)/2,class:'p-w'+(p.peg&&preto()?' bk':'')});return}
    R(v,Y(a),Z(d),b-a,d-c0,p)});
  dimH(v,Y(y0),Y(y1),Z(0)+7,f1(y1-y0));dimV(v,Z(zt),Z(0),Y(y1)+7,f1(zt));lbl(v,Y((y0+y1)/2),Z(0)+14,CFG.det.lab)}
drawDet();
document.getElementById('pretoBtn').addEventListener('click',()=>{drawDet()});
}
