// Mesa de Centro Modern: vídeo de 31 s (madeira e detalhes pretos) e textos por cima da cena, nos 3 formatos: 45 (4:5), 916 (9:16) e 169 (16:9)
import * as S from './scene.js';

const ov = () => document.getElementById('ov');
const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const sm = t => { t = cl(t); return t * t * (3 - 2 * t); };
const lerp = (a, b, k) => a + (b - a) * k;
const win = (t, a, b, f = 0.45) => cl(Math.min((t - a) / f, (b - t) / f)); // 0→1→0 dentro da janela [a, b]

const IDS = ['mc', 'mcK'];
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
    <div class="end" id="end"><div class="eb" style="justify-content:center"><span>Linha Modern · Marcenaria Moraes</span></div><div class="tt">Mesa de Centro Modern</div><div class="st" id="endst">nogueira ou jatobá · opção com detalhes pretos</div></div>
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
// ---------- uma peça da linha Modern (31 s) ----------
const KEY = IDS[0], KK = IDS[1], MM = S.getM(KEY);
const AREA = { '45': [0.07, 0.38, 0.88, 0.92], '916': [0.07, 0.4, 0.88, 0.8], '169': [0.44, 0.14, 0.9, 0.86] };
const AREA_TWO = { '45': [0.04, 0.4, 0.96, 0.9], '916': [0.03, 0.42, 0.97, 0.78], '169': [0.42, 0.16, 0.97, 0.86] };
const CAM = {};
const DET = {
  es: ['Detalhe', 'Borda de 4 cm', 'Cantos arredondados e nada de metal à vista'],
  mc: ['Detalhe', 'Prateleira embaixo', 'Para revistas, livros e controles'],
  ap: ['Detalhe', 'Gaveta com cava', 'Abre pelo recorte na madeira, sem puxador'],
}[KEY];
const MED = { es: 'Centímetros · 138 livres entre as pernas', mc: 'Centímetros · na altura do sofá', ap: 'Centímetros · cabe no hall e atrás do sofá' }[KEY];
function computeCams() {
  S.setLayout([KEY]); CAM.one = S.fit(AREA[FMT], { az: 25, el: 14 });
  S.setLayout([KEY, KK], { gap: KEY === 'es' ? 60 : 50 }); CAM.two = S.fit(AREA_TWO[FMT], { az: 18, el: 12 });
  S.setLayout([KEY]);
  if (KEY === 'es') { const w = S.world(MM.L, 0, 74, KEY); CAM.det = { az: 36, el: 8, dist: 120, tx: w.x - 14, ty: w.y - 10, tz: w.z }; }
  if (KEY === 'mc') { const w = S.world(MM.L / 2, 10, 16, KEY); CAM.det = { az: 28, el: 14, dist: 175, tx: w.x, ty: w.y, tz: w.z }; }
  if (KEY === 'ap') { const d = MM.DRAWERS[1], w = S.world((d.cava[0] + d.cava[1]) / 2, 2, 64, KEY); CAM.det = { az: 22, el: 4, dist: 95, tx: w.x - 6, ty: w.y + 2, tz: w.z }; }
}
const SEG = [
  [8.6, 11.8, 'Madeira', 'Madeira maciça', 'Nogueira ou jatobá, com óleo e cera de abelha'],
  [12.0, 15.4, 'Medidas', `${MM.L} × ${MM.D} × ${MM.H}`, MED],
  [15.6, 19.2, ...DET],
  [19.4, 22.9, 'Opção', 'Detalhes pretos', 'Base em preto fosco, tampo em madeira'],
  [23.3, 24.9, 'Madeira · 1', '', ''],
  [25.1, 26.7, 'Madeira · 2', '', ''],
];
const mix = (a, b, k) => ({ az: lerp(a.az, b.az, k), el: lerp(a.el, b.el, k), dist: lerp(a.dist, b.dist, k), ty: lerp(a.ty, b.ty, k), tx: lerp(a.tx, b.tx, k), tz: lerp(a.tz || 0, b.tz || 0, k), fov: 28 });
function camAt(t) {
  const k = (a, c) => sm((t - a) / (c - a)), A = CAM.one;
  if (t < 8.6) { const q = sm((t - 3) / 5.6); return { ...A, az: lerp(-38, 22, q), el: lerp(26, 15, q), dist: A.dist * lerp(1.1, 1, q) }; }
  if (t < 12) return { ...A, az: lerp(22, 32, (t - 8.6) / 3.4) };
  if (t < 15.5) return { ...A, az: lerp(32, 26, k(12, 12.9)) };
  if (t < 19.3) return mix({ ...A, az: 26 }, CAM.det, k(15.5, 16.5));
  if (t < 23.1) return mix(CAM.det, { ...A, az: lerp(34, 22, k(19.3, 23)) }, k(19.3, 20.3));
  const q = sm((t - 23.1) / 7.9); return { ...CAM.two, az: lerp(22, 14, q), dist: CAM.two.dist * lerp(1, 1.04, q) };
}
export function frame(t) {
  if (!CAM.one) computeCams();
  if (t < 23.1) S.setLayout([KEY]); else S.setLayout([KEY, KK], { gap: KEY === 'es' ? 60 : 50 });
  const build = t < 3.0 ? 0 : lerp(0, 6.2, sm((t - 3.0) / 5.4));
  const dr = KEY === 'ap' && t > 16.4 && t < 19.6 ? sm((t - 16.6) / 1.0) * (1 - sm((t - 18.6) / 0.9)) : 0;
  const other = FIN0 === 'nog' ? 'jat' : 'nog';
  S.setPreto(t >= 20.0 && t < 23.1, KEY); S.setPreto(true, KK);
  S.setFinish(t >= 25.0 && t < 26.75 ? other : FIN0);
  S.setPose({ id: KEY, build, drawer: [0, dr * 0.9] }); S.setPose({ id: KK, build: 6 });
  S.setCam(camAt(t)); S.render();
  const seg = SEG.find(s => t >= s[0] && t <= s[1]), cap = document.getElementById('cap');
  if (seg) {
    let [a, b, eb, tt, st] = seg;
    if (eb.startsWith('Madeira ·')) [tt, st] = FNAME[eb.endsWith('1') ? FIN0 : other];
    document.getElementById('eb').textContent = eb; document.getElementById('tt').textContent = tt; document.getElementById('st').textContent = st;
    const o = win(t, a, b, 0.4); cap.style.opacity = o; cap.style.transform = `translateY(${(1 - o) * 14}px)`;
    document.getElementById('scrim').style.opacity = cl((t - a) / 0.5) * cl((b - t) / 0.5) * (t > 15.5 && t < 19.3 ? 1 : 0.6);
  } else { cap.style.opacity = 0; document.getElementById('scrim').style.opacity = 0; }
  const dim = document.getElementById('dim'), tags = document.getElementById('tags');
  const od = win(t, 12.3, 15.3, 0.5);
  if (od > 0) {
    const Lf = (p, q, lab, off) => {
      const A = S.project(...p, KEY), B = S.project(...q, KEY), d = cl((t - 12.4) / 0.8), Bx = A[0] + (B[0] - A[0]) * d, By = A[1] + (B[1] - A[1]) * d;
      return { svg: `<line x1="${A[0]}" y1="${A[1]}" x2="${Bx}" y2="${By}" stroke="#F3ECEF" stroke-width="${W / 900}" opacity=".85"/><circle cx="${A[0]}" cy="${A[1]}" r="${W / 300}" fill="#F3ECEF"/><circle cx="${Bx}" cy="${By}" r="${W / 300}" fill="#F3ECEF"/>`,
        tag: `<div class="tag" style="left:${(A[0] + B[0]) / 2 + off[0]}px;top:${(A[1] + B[1]) / 2 + off[1]}px;opacity:${cl((t - 13.0) / 0.4)}"><b>${lab}</b> cm</div>` };
    };
    const u = Math.min(W, H) / 36, M = MM;
    const ls = [Lf([0, -7, 0], [M.L, -7, 0], M.L, [0, u * 1.2]), Lf([M.L + 7, -2, 0], [M.L + 7, -2, M.H], M.H, [u * 2.4, 0]), Lf([M.L + 7, 0, -0.1], [M.L + 7, M.D, -0.1], M.D, [u * 1.8, u * 0.8])];
    dim.innerHTML = ls.map(l => l.svg).join(''); tags.innerHTML = ls.map(l => l.tag).join(''); dim.style.opacity = od; tags.style.opacity = od;
  } else { dim.innerHTML = ''; tags.innerHTML = ''; }
  const end = document.getElementById('end'); const oe = cl((t - 27.0) / 0.6) * (1 - cl((t - 29.9) / 0.5));
  end.style.opacity = oe; end.style.transform = `translateY(${(1 - cl((t - 27.0) / 0.6)) * 14}px)`;
  logoAt(t);
  document.getElementById('fade').style.opacity = Math.max(cl((t - 30.4) / 0.6), win(t, 22.8, 23.4, 0.3));
}
