// Guarda-Roupa Antique: linha do tempo do vídeo (38 s, as duas versões) e textos por cima da cena, nos 3 formatos: 45 (4:5), 916 (9:16) e 169 (16:9)
import * as S from './scene.js';

const ov = () => document.getElementById('ov');
const cl = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const sm = t => { t = cl(t); return t * t * (3 - 2 * t); };
const lerp = (a, b, k) => a + (b - a) * k;
const win = (t, a, b, f = 0.45) => cl(Math.min((t - a) / f, (b - t) / f)); // 0→1→0 dentro da janela [a, b]

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
  S.init({ w: W, h: H, fin, dpr: 1.5 });
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  const u = Math.min(W, H) / (fmt === '45' ? 40 : fmt === '169' ? 39 : 36); ov().style.setProperty('--u', u + 'px');
  ov().innerHTML = `
    <div class="scrim" id="scrim"></div>
    <div class="cap" id="cap"><div class="eb"><span id="eb"></span><i></i></div><div class="tt" id="tt"></div><div class="st" id="st"></div></div>
    <svg class="dim" id="dim"></svg><div id="tags"></div>
    <div class="end" id="end"><div class="eb" style="justify-content:center"><span>Linha Antique · Marcenaria Moraes</span></div><div class="tt">Guarda-Roupa Antique</div><div class="st" id="endst">2 ou 4 portas · nogueira ou jatobá · feito à mão</div></div>
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

// ---------- enquadramentos: cada guarda-roupa sozinho e os dois juntos, na área livre do texto ----------
const AREA = { '45': [0.07, 0.355, 0.93, 0.965], '916': [0.07, 0.37, 0.93, 0.85], '169': [0.45, 0.07, 0.95, 0.93] };
const AREA_BOTH = { '45': [0.05, 0.36, 0.95, 0.96], '916': [0.05, 0.42, 0.95, 0.8], '169': [0.42, 0.12, 0.97, 0.9] };
const CAM = {};
function computeCams() {
  S.setModel(2); CAM[2] = S.fit(AREA[FMT], { az: 25, el: 10 });
  S.setModel(4); CAM[4] = S.fit(AREA[FMT], { az: 25, el: 10 });
  S.setModel('both'); CAM.both = S.fit(AREA_BOTH[FMT], { az: 18, el: 8 });
  S.setModel(2);
}
const MS = S.models(), M2 = MS[2], M4 = MS[4];
const SEG = [
  // [início, fim, eyebrow, título, subtítulo]
  [9.0, 12.4, 'Madeira', 'Madeira maciça', 'Nogueira ou jatobá, com óleo e cera de abelha'],
  [12.6, 16.4, 'Medidas · 2 portas', `${M2.H} × ${M2.L} × ${M2.D}`, 'Centímetros · cabide de frente'],
  [16.6, 20.6, 'Por dentro · 2 portas', 'Varão e prateleiras', 'Maleiro, 3 prateleiras e 3 gavetas'],
  [20.8, 24.4, 'Detalhe', 'Ferragens de ferro', 'Dobradiças rústicas, argolas e taramelas'],
  [24.8, 27.8, 'Também em 4 portas', `${M4.H} × ${M4.L} × ${M4.D}`, 'Centímetros · dois armários lado a lado'],
  [28.0, 31.0, 'Por dentro · 4 portas', '6 gavetas', 'Cabideiro inteiro de um lado, prateleiras do outro'],
  [31.2, 33.0, 'Madeira · 1', '', ''],
  [33.2, 35.0, 'Madeira · 2', '', ''],
];
const mix = (a, b, k) => ({ az: lerp(a.az, b.az, k), el: lerp(a.el, b.el, k), dist: lerp(a.dist, b.dist, k), ty: lerp(a.ty, b.ty, k), tx: lerp(a.tx, b.tx, k), fov: 28 });

function camAt(t) {
  const k = (a, c) => sm((t - a) / (c - a)), b2 = CAM[2], b4 = CAM[4], bb = CAM.both;
  if (t < 9) { const q = sm((t - 3) / 6); return { ...b2, az: lerp(-40, 22, q), el: lerp(18, 11, q), dist: b2.dist * lerp(1.08, 1, q) }; }
  if (t < 12.5) return { ...b2, az: lerp(22, 34, (t - 9) / 3.5) };
  if (t < 16.5) { const q = k(12.5, 13.4); return { ...b2, az: lerp(34, 28, q), el: 9, dist: b2.dist * lerp(1, 1.05, q) }; }
  if (t < 20.7) { const q = k(16.5, 17.4); return { ...b2, az: lerp(28, 14, q), el: lerp(9, 12, q), dist: b2.dist * lerp(1.05, 0.98, q) }; }
  if (t < 24.5) { // close: dobradiça de cima e chapéu, descendo até as argolas das gavetas
    const q = k(20.7, 21.6), q2 = k(22.1, 24.3);
    const c = { az: 38, el: lerp(10, 22, q2), dist: 205, ty: lerp(M2.H - 22, 44, q2), tx: lerp(M2.L / 2 - 16, M2.L / 2 - 30, q2), fov: 28 };
    return mix({ ...b2, az: 14, el: 12, dist: b2.dist * 0.98 }, c, q);
  }
  if (t < 24.65) return { az: 38, el: 22, dist: 205, ty: 44, tx: M2.L / 2 - 30, fov: 28 };
  if (t < 28) return { ...b4, az: lerp(34, 26, k(24.65, 27.9)), el: lerp(12, 10, k(24.65, 26)) };
  if (t < 31.1) { const q = k(28, 28.8); return { ...b4, az: lerp(26, 14, q), el: lerp(10, 12, q) }; }
  if (t < 35.1) { const q = k(31.1, 32.2); return mix({ ...b4, az: 14, el: 12 }, { ...bb, az: lerp(18, 26, (t - 31.1) / 4) }, q); }
  const q = sm((t - 35.1) / 2.9); return { ...bb, az: lerp(26, 20, q), dist: bb.dist * lerp(1, 1.04, q) };
}

function layoutAt(t) {
  // 2 portas sozinho até 24,5; troca deslizando para o 4 portas; os dois juntos a partir de 31,1
  if (t < 24.5) { S.setModel(2); return; }
  if (t < 24.65) { S.setModel(2); return; }
  if (t < 31.1) { S.setModel(4); S.setOffset(2, -380, false); return; }
  const q = sm((t - 31.1) / 1.1), w2 = M2.L, w4 = M4.L, gap = 40, tot = w2 + gap + w4;
  S.setOffset(2, lerp(-380, -tot / 2 + w2 / 2, q), true); S.setOffset(4, lerp(0, tot / 2 - w4 / 2, q), true);
}

export function frame(t) {
  if (!CAM[2]) computeCams();
  layoutAt(t);
  const open = (a, b) => t >= a && t < b + 0.6 ? sm((t - a - 0.4) / 1.3) * (1 - sm((t - b + 0.6) / 1.0)) : 0;
  const build2 = t < 3.2 ? 0 : lerp(0, 6.2, sm((t - 3.2) / 5.6));
  const d2 = open(16.6, 20.6), d4 = open(28.0, 31.0);
  const other = FIN0 === 'nog' ? 'jat' : 'nog';
  S.setFinish(t >= 33.1 && t < 35.05 ? other : FIN0);
  S.setPose({ v: 2, build: build2, door: d2 * 0.78, drawer: [d2 * 0.55, d2 * 0.35, d2 * 0.35], latch: Math.min(1, d2 * 3) });
  S.setPose({ v: 4, build: 6, door: d4 * 0.78, drawer: [d4 * 0.55, d4 * 0.35, d4 * 0.35, d4 * 0.55, d4 * 0.35, d4 * 0.35], latch: Math.min(1, d4 * 3) });
  S.setCam(camAt(t));
  S.render();

  // textos
  const seg = SEG.find(s => t >= s[0] && t <= s[1]);
  const cap = document.getElementById('cap');
  if (seg) {
    let [a, b, eb, tt, st] = seg;
    if (eb.startsWith('Madeira ·')) [tt, st] = FNAME[eb.endsWith('1') ? FIN0 : other];
    document.getElementById('eb').textContent = eb; document.getElementById('tt').textContent = tt; document.getElementById('st').textContent = st;
    const o = win(t, a, b, 0.4); cap.style.opacity = o; cap.style.transform = `translateY(${(1 - o) * 14}px)`;
    document.getElementById('scrim').style.opacity = cl((t - a) / 0.5) * cl((b - t) / 0.5) * (t > 20.7 && t < 24.5 ? 1 : 0.6);
  } else { cap.style.opacity = 0; document.getElementById('scrim').style.opacity = 0; }

  // cotas
  const dim = document.getElementById('dim'), tags = document.getElementById('tags');
  const dims = (Mx, v, a, b) => {
    const od = win(t, a, b, 0.5); if (od <= 0) return false;
    const L = (p, q, lab, off) => {
      const A = S.project(...p, v), B = S.project(...q, v), dr = cl((t - a - 0.1) / 0.8);
      const Bx = A[0] + (B[0] - A[0]) * dr, By = A[1] + (B[1] - A[1]) * dr;
      return { svg: `<line x1="${A[0]}" y1="${A[1]}" x2="${Bx}" y2="${By}" stroke="#F3ECEF" stroke-width="${W / 900}" opacity=".85"/><circle cx="${A[0]}" cy="${A[1]}" r="${W / 300}" fill="#F3ECEF"/><circle cx="${Bx}" cy="${By}" r="${W / 300}" fill="#F3ECEF"/>`,
        tag: `<div class="tag" style="left:${(A[0] + B[0]) / 2 + off[0]}px;top:${(A[1] + B[1]) / 2 + off[1]}px;opacity:${cl((t - a - 0.7) / 0.4)}"><b>${lab}</b> cm</div>` };
    };
    const u = Math.min(W, H) / 36;
    const ls = [L([0, -7, 0], [Mx.L, -7, 0], Mx.L, [0, u * 1.2]), L([Mx.L + 7, -2, 0], [Mx.L + 7, -2, Mx.H], Mx.H, [u * 2.4, 0]), L([Mx.L + 7, 0, -0.1], [Mx.L + 7, Mx.D, -0.1], Mx.D, [u * 1.8, u * 0.8])];
    dim.innerHTML = ls.map(l => l.svg).join(''); tags.innerHTML = ls.map(l => l.tag).join('');
    dim.style.opacity = od; tags.style.opacity = od; return true;
  };
  if (!dims(M2, 2, 12.9, 16.3) && !dims(M4, 4, 25.9, 27.7)) { dim.innerHTML = ''; tags.innerHTML = ''; }

  // final
  const end = document.getElementById('end'); const oe = cl((t - 35.3) / 0.6) * (1 - cl((t - 37.3) / 0.5));
  end.style.opacity = oe; end.style.transform = `translateY(${(1 - cl((t - 35.3) / 0.6)) * 14}px)`;

  // abertura com o selo
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

  document.getElementById('fade').style.opacity = Math.max(cl((t - 37.4) / 0.6), win(t, 24.35, 24.95, 0.3)); // escurece rápido na troca de modelo
}
