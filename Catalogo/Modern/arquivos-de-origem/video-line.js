// Linha Modern: vídeo da linha inteira, peça a peça (38 s) e textos por cima da cena, nos 3 formatos: 45 (4:5), 916 (9:16) e 169 (16:9)
import * as S from './scene.js';

const ov = () => document.getElementById('ov');
const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const sm = t => { t = cl(t); return t * t * (3 - 2 * t); };
const lerp = (a, b, k) => a + (b - a) * k;
const win = (t, a, b, f = 0.45) => cl(Math.min((t - a) / f, (b - t) / f)); // 0→1→0 dentro da janela [a, b]

const IDS = ['es', 'mc', 'ap'];
let FMT = '45', W = 1080, H = 1350, FIN0 = 'nog';
const FNAME = { nog: ['Nogueira', 'Cambará tingido, tom de chocolate'], jat: ['Jatobá', 'Madeira de lei escura, sem tingidor'] };
const CSS = `
#ov .cap{position:absolute;display:flex;flex-direction:column;gap:.35em}
#ov .eb{font:500 calc(var(--u)*1.05) "IBM Plex Mono",monospace;letter-spacing:.32em;text-transform:uppercase;color:#DDAE62;display:flex;align-items:center;gap:.9em;white-space:nowrap}
#ov .eb i{display:block;height:1px;width:calc(var(--u)*4);background:#DDAE62;opacity:.7}
#ov .tt{font:500 calc(var(--u)*3.6) "Instrument Sans",sans-serif;line-height:1.08;color:#F6F1EC;letter-spacing:-.01em}
#ov .st{font:400 calc(var(--u)*1.45) "Instrument Sans",sans-serif;color:#CFC6CC;line-height:1.35}
#ov .end{position:absolute;left:0;right:0;text-align:center;display:flex;flex-direction:column;align-items:center;gap:.4em}
#ov .end .tt{font-size:calc(var(--u)*4.4)}
#ov .tag{position:absolute;transform:translate(-50%,-50%);font:500 calc(var(--u)*1.05) "IBM Plex Mono",monospace;color:#F6F1EC;background:rgba(20,18,20,.82);padding:.25em .6em;border-radius:.35em;white-space:nowrap;letter-spacing:.04em}
#ov .tag b{color:#DDAE62;font-weight:500}
#ov svg.dim{position:absolute;inset:0;width:100%;height:100%}
#ov .logo{position:absolute;inset:0;background:#000;display:flex;align-items:center;justify-content:center}
#ov .logo svg{position:absolute;overflow:visible}
#ov .fade{position:absolute;inset:0;background:#000}
#ov .scrim{position:absolute;inset:0}
`;

export async function setup({ fmt = '45', fin = 'nog' }) {
  FMT = fmt; FIN0 = fin;
  [W, H] = { '45': [1080, 1350], '916': [1080, 1920], '169': [1920, 1080] }[fmt];
  S.init({ w: W, h: H, fin, dpr: 1.5, ids: IDS });
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  const u = Math.min(W, H) / (fmt === '45' ? 40 : fmt === '169' ? 39 : 36); ov().style.setProperty('--u', u + 'px');
  ov().innerHTML = `
    <div class="scrim" id="scrim"></div>
    <div class="cap" id="cap"><div class="eb"><span id="eb"></span><i></i></div><div class="tt" id="tt"></div><div class="st" id="st"></div></div>
    <svg class="dim" id="dim"></svg><div id="tags"></div>
    <div class="end" id="end"><div class="eb" style="justify-content:center"><span>Linha Modern · Marcenaria Moraes</span></div><div class="tt">Linha Modern</div><div class="st" id="endst">Sob encomenda · valor sob consulta · Uberlândia</div></div>
    <div class="logo" id="logo"></div>
    <div class="fade" id="fade"></div>`;
  // posição dos textos por formato
  const cap = document.getElementById('cap');
  if (fmt === '169') Object.assign(cap.style, { left: `${W * 0.07}px`, top: `${H * 0.36}px`, maxWidth: `${W * 0.38}px` });
  else Object.assign(cap.style, { left: `${W * 0.08}px`, top: `${H * (fmt === '916' ? 0.17 : 0.09)}px`, maxWidth: `${W * (fmt === '916' ? 0.8 : 0.84)}px` });
  document.getElementById('scrim').style.background = fmt === '169' ? 'linear-gradient(90deg,rgba(8,8,10,.78) 0%,rgba(8,8,10,.45) 32%,rgba(8,8,10,0) 52%)' : 'linear-gradient(180deg,rgba(8,8,10,.82) 0%,rgba(8,8,10,.5) 20%,rgba(8,8,10,0) 36%)';
  const end = document.getElementById('end'); end.style.top = `${H * (fmt === '169' ? 0.38 : fmt === '916' ? 0.17 : 0.09)}px`;
  if (fmt === '169') { Object.assign(end.style, { left: `${W * 0.07}px`, right: 'auto', textAlign: 'left', alignItems: 'flex-start' }); end.querySelector('.eb').style.justifyContent = 'flex-start'; }
  const m = Math.min(W, H);
  // selo da abertura, igual ao modelo: disco amora fixo, anel de fora se desenhando, depois os detalhes
  const src = await (await fetch('brand/moraes-selo-branco.svg')).text();
  const doc = new DOMParser().parseFromString(src, 'image/svg+xml').documentElement;
  const NS = 'http://www.w3.org/2000/svg', CR = '#F3ECEF';
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 200 200');
  const sz = m * 0.46; svg.setAttribute('width', sz); svg.setAttribute('height', sz); svg.id = 'lsvg';
  svg.innerHTML = `<defs><radialGradient id="dg" cx="50%" cy="42%" r="62%"><stop offset="0" stop-color="#66305A"/><stop offset=".75" stop-color="#43183A"/><stop offset="1" stop-color="#38132F"/></radialGradient>
    <linearGradient id="sh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <clipPath id="dc"><circle cx="100" cy="100" r="97"/></clipPath></defs>
    <circle id="ldisc" cx="100" cy="100" r="97" fill="url(#dg)"/>`;
  const g = doc.querySelector('g'), kids = [...g.children];
  const ring = kids[0].cloneNode(true); ring.id = 'lring'; ring.setAttribute('stroke', CR); ring.setAttribute('transform', 'rotate(-90 100 100)');
  const L = 2 * Math.PI * 92; ring.style.strokeDasharray = L; ring.dataset.len = L;
  const det = document.createElementNS(NS, 'g'); det.id = 'ldet'; det.setAttribute('fill', CR);
  kids.slice(1).forEach(k => { const c = k.cloneNode(true); if (c.getAttribute('stroke')) c.setAttribute('stroke', CR); det.appendChild(c); });
  svg.appendChild(ring); svg.appendChild(det);
  [...doc.children].filter(n => n !== g).forEach(n => { const c = n.cloneNode(true); svg.appendChild(c); });
  svg.querySelectorAll('g[fill="#FFFFFF"], path[stroke="#FFFFFF"]').forEach(e => { if (e.getAttribute('fill') === '#FFFFFF') e.setAttribute('fill', CR); if (e.getAttribute('stroke') === '#FFFFFF') e.setAttribute('stroke', CR); });
  const shine = document.createElementNS(NS, 'g'); shine.setAttribute('clip-path', 'url(#dc)');
  shine.innerHTML = '<rect id="lshine" x="-60" y="-40" width="50" height="280" fill="url(#sh)" transform="rotate(20 100 100)"/>';
  svg.appendChild(shine);
  document.getElementById('logo').appendChild(svg);
}


// abertura com o selo, igual em todos os vídeos
function logoAt(t) {
  const logo = document.getElementById('logo');
  if (t < 3.3) {
    logo.style.display = 'flex';
    logo.style.opacity = 1 - sm((t - 2.6) / 0.6);
    const svg = document.getElementById('lsvg'), ring = document.getElementById('lring'), det = document.getElementById('ldet');
    const a = sm(t / 0.5);
    svg.style.opacity = a; svg.style.transform = `scale(${lerp(0.9, 1, a) + 0.02 * sm((t - 1.9) / 1.2)})`;
    svg.style.filter = `drop-shadow(0 0 ${Math.min(W, H) * 0.03}px rgba(170,95,150,${0.55 * a}))`;
    ring.style.strokeDashoffset = +ring.dataset.len * (1 - sm((t - 0.25) / 1.15));
    det.style.opacity = sm((t - 1.25) / 0.6);
    document.getElementById('lshine').setAttribute('x', lerp(-70, 230, sm((t - 1.85) / 0.75)));
  } else logo.style.display = 'none';
}
// ---------- a linha Modern inteira, peça a peça (~40 s) ----------
const AREA = { '45': [0.07, 0.4, 0.9, 0.9], '916': [0.07, 0.42, 0.9, 0.78], '169': [0.44, 0.14, 0.93, 0.86] };
const AREA_ROW = { '45': [0.04, 0.44, 0.96, 0.88], '916': [0.03, 0.46, 0.97, 0.74], '169': [0.42, 0.18, 0.97, 0.84] };
const HERO = ['ap', 'es', 'mc'];
const CAM = {};
function computeCams() {
  const set = (k, ids, area, az, el) => { S.setLayout(ids, { gap: 45 }); CAM[k] = S.fit(area, { az, el }); };
  set('hero', HERO, AREA_ROW[FMT], 20, 12);
  set('es', ['es'], AREA[FMT], 24, 14); set('mc', ['mc'], AREA[FMT], 24, 16); set('ap', ['ap'], AREA[FMT], 24, 12);
  S.setLayout(HERO, { gap: 45 });
  const w = S.world(150, 0, 74, 'es');
  CAM.close = { az: 36, el: 8, dist: 120, ty: w.y - 10, tx: w.x - 14, tz: w.z, fov: 28 };
}
const SEG = [
  [3.4, 7.9, 'Nova linha · Marcenaria Moraes', 'Modern', 'Madeira maciça, linhas retas, nada à vista'],
  [8.2, 10.6, 'O que une a linha', 'Borda de 4 cm', 'Pernas de painel e nenhum parafuso à vista'],
  [11.2, 15.0, 'Escritório', 'Escrivaninha Cerne', '150 × 60 cm · desmonta em 4 partes'],
  [15.6, 19.4, 'Sala', 'Mesa de Centro Modern', '100 × 60 cm · prateleira embaixo'],
  [20.0, 23.8, 'Hall', 'Aparador Modern', 'Gavetas com cava, sem puxador'],
  [24.4, 28.0, 'Opção', 'Detalhes pretos', 'Base em preto fosco, tampo em madeira'],
  [28.6, 30.3, 'Madeira · 1', '', ''],
  [30.5, 32.2, 'Madeira · 2', '', ''],
];
const mix = (a, b, k) => ({ az: lerp(a.az, b.az, k), el: lerp(a.el, b.el, k), dist: lerp(a.dist, b.dist, k), ty: lerp(a.ty, b.ty, k), tx: lerp(a.tx, b.tx, k), tz: lerp(a.tz || 0, b.tz || 0, k), fov: 28 });
const spin = (c, t, a, b, az0, az1) => ({ ...c, tz: 0, az: lerp(az0, az1, sm((t - a) / (b - a))) });
const SHOTS = [[0, 10.95, HERO], [10.95, 15.35, ['es']], [15.35, 19.75, ['mc']], [19.75, 24.15, ['ap']], [24.15, 99, HERO]];
function camAt(t) {
  const k = (a, c) => sm((t - a) / (c - a));
  if (t < 8.1) return spin(CAM.hero, t, 2.5, 8.1, 34, 18);
  if (t < 10.95) return mix({ ...CAM.hero, az: 18 }, CAM.close, k(8.1, 9.4));
  if (t < 15.35) return spin(CAM.es, t, 10.95, 15.35, 34, 14);
  if (t < 19.75) return spin(CAM.mc, t, 15.35, 19.75, 34, 14);
  if (t < 24.15) return spin(CAM.ap, t, 19.75, 24.15, 34, 14);
  return { ...spin(CAM.hero, t, 24.15, 38, 24, 14), dist: CAM.hero.dist * lerp(1, 1.05, sm((t - 24.15) / 13)) };
}
export function frame(t) {
  if (!CAM.hero) computeCams();
  S.setLayout(SHOTS.find(s => t >= s[0] && t < s[1])[2], { gap: 45 });
  const build = t < 2.4 ? 0 : lerp(0, 6.2, sm((t - 2.4) / 4.4));
  const dr = t > 20.8 && t < 23.6 ? sm((t - 21.0) / 1.0) * (1 - sm((t - 22.7) / 0.8)) : 0;
  const other = FIN0 === 'nog' ? 'jat' : 'nog';
  S.setPreto(t >= 25.0 && t < 28.3, HERO);
  S.setFinish(t >= 30.4 && t < 32.25 ? other : FIN0);
  for (const id of HERO) S.setPose({ id, build: t < 8 ? build : 6 });
  S.setPose({ id: 'ap', build: t < 8 ? build : 6, drawer: [dr * 0.8, dr * 0.8] });
  S.setCam(camAt(t)); S.render();
  const seg = SEG.find(s => t >= s[0] && t <= s[1]), cap = document.getElementById('cap');
  if (seg) {
    let [a, b, eb, tt, st] = seg;
    if (eb.startsWith('Madeira ·')) [tt, st] = FNAME[eb.endsWith('1') ? FIN0 : other];
    document.getElementById('eb').textContent = eb; document.getElementById('tt').textContent = tt; document.getElementById('st').textContent = st;
    const o = win(t, a, b, 0.4); cap.style.opacity = o; cap.style.transform = `translateY(${(1 - o) * 14}px)`;
    document.getElementById('scrim').style.opacity = cl((t - a) / 0.5) * cl((b - t) / 0.5) * (t > 8.1 && t < 10.95 ? 1 : 0.6);
  } else { cap.style.opacity = 0; document.getElementById('scrim').style.opacity = 0; }
  document.getElementById('dim').innerHTML = ''; document.getElementById('tags').innerHTML = '';
  const end = document.getElementById('end'); const oe = cl((t - 32.6) / 0.6) * (1 - cl((t - 37.2) / 0.5));
  end.style.opacity = oe; end.style.transform = `translateY(${(1 - cl((t - 32.6) / 0.6)) * 14}px)`;
  logoAt(t);
  const cuts = [10.95, 15.35, 19.75, 24.15];
  document.getElementById('fade').style.opacity = Math.max(cl((t - 37.4) / 0.6), ...cuts.map(c => win(t, c - 0.3, c + 0.3, 0.3)));
}
