// Rack Antique: linha do tempo do vídeo (34 s, as duas medidas) e textos por cima da cena, nos 3 formatos: 45 (4:5), 916 (9:16) e 169 (16:9)
import * as S from './scene.js';

const ov = () => document.getElementById('ov');
const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const sm = t => { t = cl(t); return t * t * (3 - 2 * t); };
const lerp = (a, b, k) => a + (b - a) * k;
const win = (t, a, b, f = 0.45) => cl(Math.min((t - a) / f, (b - t) / f)); // 0→1→0 dentro da janela [a, b]

const IDS = ['rk180', 'rk140'];
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
    <div class="end" id="end"><div class="eb" style="justify-content:center"><span>Linha Antique · Marcenaria Moraes</span></div><div class="tt">Rack Antique</div><div class="st" id="endst">180 ou 140 cm · nogueira ou jatobá · feito à mão</div></div>
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
// ---------- enquadramentos ----------
const AREA = { '45': [0.06, 0.4, 0.86, 0.9], '916': [0.07, 0.42, 0.85, 0.78], '169': [0.44, 0.15, 0.9, 0.85] };
const AREA_ALL = { '45': [0.04, 0.42, 0.96, 0.9], '916': [0.03, 0.44, 0.97, 0.76], '169': [0.42, 0.18, 0.97, 0.85] };
const CAM = {};
function computeCams() {
  for (const id of IDS) { S.setLayout([id]); CAM[id] = S.fit(AREA[FMT], { az: 25, el: 12 }); }
  S.setLayout(IDS, { gap: 50 }); CAM.all = S.fit(AREA_ALL[FMT], { az: 16, el: 10 });
  S.setLayout([IDS[0]]);
}
const MA = S.getM('rk180'), MB = S.getM('rk140');
const med = M => `${M.L} × ${M.H} × ${M.D}`;
const SEG = [
  [8.6, 11.8, 'Madeira', 'Madeira maciça', 'Nogueira ou jatobá, com óleo e cera de abelha'],
  [12.0, 15.4, 'Medidas · 180 cm', med(MA), 'Centímetros · TV de até 75"'],
  [15.6, 19.2, 'Por dentro', 'Nicho e gaveta', 'Aparelhos no meio, controles na gaveta'],
  [19.4, 22.8, 'Detalhe', 'Ferragens de época', 'Dobradiça borboleta, tramela e puxador concha'],
  [23.6, 26.8, 'Também em 140 cm', med(MB), 'Centímetros · TV de até 55"'],
  [27.2, 28.9, 'Madeira · 1', '', ''],
  [29.1, 30.8, 'Madeira · 2', '', ''],
];
const mix = (a, b, k) => ({ az: lerp(a.az, b.az, k), el: lerp(a.el, b.el, k), dist: lerp(a.dist, b.dist, k), ty: lerp(a.ty, b.ty, k), tx: lerp(a.tx, b.tx, k), tz: lerp(a.tz || 0, b.tz || 0, k), fov: 28 });
function camAt(t) {
  const k = (a, c) => sm((t - a) / (c - a)), A = CAM.rk180, B = CAM.rk140, all = CAM.all;
  if (t < 8.6) { const q = sm((t - 3) / 5.6); return { ...A, az: lerp(-38, 22, q), el: lerp(22, 13, q), dist: A.dist * lerp(1.1, 1, q) }; }
  if (t < 12) return { ...A, az: lerp(22, 32, (t - 8.6) / 3.4) };
  if (t < 15.5) { const q = k(12, 12.9); return { ...A, az: lerp(32, 26, q) }; }
  if (t < 19.3) { const q = k(15.5, 16.4); return mix({ ...A, az: 26 }, { ...A, az: 14, el: 16, dist: A.dist * 1.02 }, q); }
  if (t < 23.3) { // close: dobradiça da porta da direita, depois a tramela
    const h = S.world(MA.L - 4, 0, 43, 'rk180'), l = S.world(MA.d2 + 1, 0, 31.5, 'rk180');
    const c1 = { az: 32, el: 8, dist: 46, ty: h.y, tx: h.x, tz: h.z }, c2 = { az: 14, el: 8, dist: 44, ty: l.y, tx: l.x + 2, tz: l.z };
    const q = k(19.3, 20.2), q2 = k(20.9, 22.4);
    return mix({ ...A, az: 14, el: 16, dist: A.dist * 1.02 }, mix(c1, c2, q2), q);
  }
  if (t < 27.0) return { ...B, az: lerp(34, 24, k(23.3, 26.8)) };
  const q = sm((t - 27) / 7); return { ...all, az: lerp(22, 14, q), dist: all.dist * lerp(1, 1.04, q) };
}
function layoutAt(t) {
  if (t < 23.35) S.setLayout(['rk180']);
  else if (t < 27.05) S.setLayout(['rk140']);
  else S.setLayout(['rk140', 'rk180'], { gap: 50 });
}
export function frame(t) {
  if (!CAM.rk180) computeCams();
  layoutAt(t);
  const open = (a, b) => t >= a && t < b + 0.6 ? sm((t - a - 0.4) / 1.3) * (1 - sm((t - b + 0.6) / 1.0)) : 0;
  const build = t < 3.0 ? 0 : lerp(0, 6.2, sm((t - 3.0) / 5.4));
  const d = open(15.6, 19.2), lt = t > 21.3 && t < 23 ? sm((t - 21.3) / 0.5) * (1 - sm((t - 22.4) / 0.5)) : 0;
  const other = FIN0 === 'nog' ? 'jat' : 'nog';
  S.setFinish(t >= 29.0 && t < 30.85 ? other : FIN0);
  S.setPose({ id: 'rk180', build, door: d * 0.8, drawer: d * 0.9, latch: Math.max(Math.min(1, d * 3), lt) });
  S.setPose({ id: 'rk140', build: 6 });
  S.setCam(camAt(t));
  S.render();
  const seg = SEG.find(s => t >= s[0] && t <= s[1]), cap = document.getElementById('cap');
  if (seg) {
    let [a, b, eb, tt, st] = seg;
    if (eb.startsWith('Madeira ·')) [tt, st] = FNAME[eb.endsWith('1') ? FIN0 : other];
    document.getElementById('eb').textContent = eb; document.getElementById('tt').textContent = tt; document.getElementById('st').textContent = st;
    const o = win(t, a, b, 0.4); cap.style.opacity = o; cap.style.transform = `translateY(${(1 - o) * 14}px)`;
    document.getElementById('scrim').style.opacity = cl((t - a) / 0.5) * cl((b - t) / 0.5) * (t > 19.3 && t < 23.3 ? 1 : 0.6);
  } else { cap.style.opacity = 0; document.getElementById('scrim').style.opacity = 0; }
  const dim = document.getElementById('dim'), tags = document.getElementById('tags');
  const dims = (Mx, id, a, b) => {
    const od = win(t, a, b, 0.5); if (od <= 0) return false;
    const L = (p, q, lab, off) => {
      const A = S.project(...p, id), B = S.project(...q, id), dr = cl((t - a - 0.1) / 0.8);
      const Bx = A[0] + (B[0] - A[0]) * dr, By = A[1] + (B[1] - A[1]) * dr;
      return { svg: `<line x1="${A[0]}" y1="${A[1]}" x2="${Bx}" y2="${By}" stroke="#F3ECEF" stroke-width="${W / 900}" opacity=".85"/><circle cx="${A[0]}" cy="${A[1]}" r="${W / 300}" fill="#F3ECEF"/><circle cx="${Bx}" cy="${By}" r="${W / 300}" fill="#F3ECEF"/>`,
        tag: `<div class="tag" style="left:${(A[0] + B[0]) / 2 + off[0]}px;top:${(A[1] + B[1]) / 2 + off[1]}px;opacity:${cl((t - a - 0.7) / 0.4)}"><b>${lab}</b> cm</div>` };
    };
    const u = Math.min(W, H) / 36;
    const ls = [L([0, -7, 0], [Mx.L, -7, 0], Mx.L, [0, u * 1.2]), L([Mx.L + 7, -2, 0], [Mx.L + 7, -2, Mx.H], Mx.H, [u * 2.4, 0]), L([Mx.L + 7, 0, -0.1], [Mx.L + 7, Mx.D, -0.1], Mx.D, [u * 1.8, u * 0.8])];
    dim.innerHTML = ls.map(l => l.svg).join(''); tags.innerHTML = ls.map(l => l.tag).join('');
    dim.style.opacity = od; tags.style.opacity = od; return true;
  };
  if (!dims(MA, 'rk180', 12.3, 15.3) && !dims(MB, 'rk140', 24.0, 26.7)) { dim.innerHTML = ''; tags.innerHTML = ''; }
  const end = document.getElementById('end'); const oe = cl((t - 31.0) / 0.6) * (1 - cl((t - 33.3) / 0.5));
  end.style.opacity = oe; end.style.transform = `translateY(${(1 - cl((t - 31.0) / 0.6)) * 14}px)`;
  logoAt(t);
  document.getElementById('fade').style.opacity = Math.max(cl((t - 33.4) / 0.6), win(t, 23.05, 23.65, 0.3), win(t, 26.75, 27.35, 0.3));
}
