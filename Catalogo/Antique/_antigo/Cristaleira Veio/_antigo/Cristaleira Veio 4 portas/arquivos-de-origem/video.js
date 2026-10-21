// Linha do tempo do vídeo (35 s) e textos por cima da cena, nos 3 formatos: 45 (4:5), 916 (9:16) e 169 (16:9)
import * as S from './scene.js';
const M = S.M;

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
  for (const f of ['45', '916', '169']) if (f === fmt) { BASE[f] = S.fit(AREA[f], { az: 25, el: 10 }); BEND[f] = S.fit(AREA_END[f], { az: 28, el: 8 }); }
  const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
  const u = Math.min(W, H) / (fmt === '45' ? 40 : fmt === '169' ? 39 : 36); ov().style.setProperty('--u', u + 'px');
  ov().innerHTML = `
    <div class="scrim" id="scrim"></div>
    <div class="cap" id="cap"><div class="eb"><span id="eb"></span><i></i></div><div class="tt" id="tt"></div><div class="st" id="st"></div></div>
    <svg class="dim" id="dim"></svg><div id="tags"></div>
    <div class="end" id="end"><div class="eb" style="justify-content:center"><span>Marcenaria Moraes</span></div><div class="tt">Cristaleira Veio</div><div class="st" id="endst">${M.v === 1 ? '' : M.short + ' · '}nogueira ou jatobá · feita à mão</div></div>
    <div class="logo" id="logo"></div>
    <div class="fade" id="fade"></div>`;
  // posição dos textos por formato
  const cap = document.getElementById('cap');
  if (fmt === '169') Object.assign(cap.style, { left: `${W * 0.07}px`, top: `${H * 0.36}px`, maxWidth: `${W * 0.38}px` });
  else Object.assign(cap.style, { left: `${W * 0.08}px`, top: `${H * (fmt === '916' ? 0.17 : 0.09)}px`, maxWidth: `${W * (fmt === '916' ? 0.8 : M.v === 1 ? 0.5 : 0.84)}px` });
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

// câmera base por formato: a cristaleira inteira cabe na área livre ao lado ou embaixo do texto (calculado no setup)
// área [x0, y0, x1, y1] em frações da tela; a de 1 porta, fina, fica ao lado do texto no 4:5
const AREA = {
  '45': M.v === 1 ? [0.56, 0.06, 0.95, 0.94] : [0.07, 0.355, 0.93, 0.965],
  '916': [0.07, 0.37, 0.93, 0.85],
  '169': [0.45, 0.07, 0.95, 0.93],
};
const AREA_END = { '45': [0.1, 0.33, 0.9, 0.965], '916': [0.07, 0.33, 0.93, 0.85], '169': [0.45, 0.07, 0.95, 0.93] };
let BASE = {}, BEND = {};
const TXT = {
  1: { vit: 'Frente e laterais, com 3 prateleiras por dentro', med: 'Centímetros · cabe num canto da sala', ferr: 'Dobradiças borboleta, tramela e puxador concha', abre: 'Porta de vidro e gaveta', abreSt: 'Gaveta de 42 cm para talheres e toalhas' },
  2: { vit: 'Duas portas e laterais, com 3 prateleiras por dentro', med: 'Centímetros · menos de 1 metro de parede', ferr: 'Dobradiças borboleta, tramela e puxadores concha', abre: 'Portas e gaveta', abreSt: 'Gaveta de 80 cm para talheres e toalhas' },
  4: { vit: 'Quatro portas e laterais, com 6 prateleiras por dentro', med: 'Centímetros · a vitrine da sala de jantar', ferr: 'Dobradiças borboleta, tramelas e puxadores concha', abre: '4 portas, 2 gavetas', abreSt: 'Gavetas de 70 cm para talheres e toalhas' },
}[M.v];
const SEG = [
  // [início, fim, eyebrow, título, subtítulo]
  [9.0, 12.4, 'Madeira', 'Madeira maciça', 'Nogueira ou jatobá, com óleo e cera de abelha'],
  [12.6, 16.0, 'Vitrine', 'Vidro nos três lados', TXT.vit],
  [16.2, 20.0, 'Medidas', `${M.H} × ${M.L} × ${M.D}`, TXT.med],
  [20.2, 24.0, 'Detalhe', 'Ferragens de ferro', TXT.ferr],
  [24.2, 27.6, 'Abre e guarda', TXT.abre, TXT.abreSt],
  [27.8, 29.7, 'Acabamento · 1', '', ''],
  [29.9, 31.6, 'Acabamento · 2', '', ''],
];

function camAt(t) {
  const b = BASE[FMT];
  const k = (a, c) => sm((t - a) / (c - a));
  let az = 25, el = 10, dist = b.dist, ty = b.ty, tx = b.tx;
  if (t < 9) { // montagem: gira devagar
    const q = sm((t - 3) / 6); az = lerp(-40, 22, q); el = lerp(18, 11, q); dist = b.dist * lerp(1.08, 1, q);
  } else if (t < 12.5) { az = lerp(22, 34, (t - 9) / 3.5); }
  else if (t < 16.1) { const q = k(12.5, 13.6); az = lerp(34, 62, q) + (t - 13.6) * 2; el = lerp(10, 7, q); }
  else if (t < 20.1) { const q = k(16.1, 17); az = lerp(64, 30, q); el = 9; dist = b.dist * lerp(1, 1.05, q); }
  else if (t < 24.1) { // close: dobradiça de cima e chapéu, descendo até o puxador
    const q = k(20.1, 21), q2 = k(21.5, 23.8);
    az = lerp(30, 40, q); el = lerp(9, lerp(10, 22, q2), q);
    dist = lerp(b.dist, 185, q); ty = lerp(b.ty, lerp(M.H - 18, 46, q2), q); tx = lerp(b.tx, lerp(M.L / 2 - 21, M.L / 2 - 25 + (M.v === 1 ? 0 : 4), q2), q);
  } else if (t < 27.7) { const q = k(24.1, 25); az = lerp(40, 18, q); el = lerp(22, 12, q); dist = lerp(175, b.dist, q); ty = lerp(40, b.ty, q); tx = lerp(M.L / 2 - 19, b.tx, q); }
  else if (t < 31.7) { az = lerp(18, 38, (t - 27.7) / 4); el = 10; }
  else { const e = BEND[FMT], q = sm((t - 31.7) / 3.3), q0 = sm((t - 31.7) / 0.9); az = lerp(38, 28, q); el = lerp(10, 8, q); dist = lerp(b.dist, e.dist, q0) * lerp(1, 1.05, q); ty = lerp(b.ty, e.ty, q0); tx = lerp(b.tx, e.tx, q0); }
  return { az, el, dist, ty, tx };
}

export function frame(t) {
  // pose
  const build = t < 3.2 ? 0 : lerp(0, 6.2, sm((t - 3.2) / 5.6));
  const door = t >= 24.2 && t < 28.3 ? sm((t - 24.6) / 1.4) * (1 - sm((t - 27.2) / 1.0)) * 0.72 : 0;
  const drawer = t >= 24.2 && t < 28.3 ? sm((t - 25.4) / 1.1) * (1 - sm((t - 27.0) / 1.0)) : 0;
  const latch = t >= 24.0 && t < 28.5 ? sm((t - 24.2) / 0.4) * (1 - sm((t - 27.9) / 0.4)) : 0;
  const other = FIN0 === 'nog' ? 'jat' : 'nog';
  S.setFinish(t >= 29.8 && t < 31.65 ? other : FIN0);
  S.setPose({ build, door, drawer, latch });
  S.setCam(camAt(t));
  S.render();

  // textos dos segmentos
  const seg = SEG.find(s => t >= s[0] && t <= s[1]);
  const cap = document.getElementById('cap');
  if (seg) {
    let [a, b, eb, tt, st] = seg;
    if (eb.startsWith('Acabamento')) { // acompanha o acabamento mostrado
      [tt, st] = FNAME[eb.endsWith('1') ? FIN0 : other];
    }
    document.getElementById('eb').textContent = eb; document.getElementById('tt').textContent = tt; document.getElementById('st').textContent = st;
    const o = win(t, a, b, 0.4); cap.style.opacity = o; cap.style.transform = `translateY(${(1 - o) * 14}px)`;
    document.getElementById('scrim').style.opacity = cl((t - a) / 0.5) * cl((b - t) / 0.5) * (t > 20 && t < 24.3 ? 1 : 0.6);
  } else { cap.style.opacity = 0; document.getElementById('scrim').style.opacity = 0; }

  // cotas (medidas)
  const dim = document.getElementById('dim'), tags = document.getElementById('tags');
  const od = win(t, 16.5, 19.9, 0.5);
  if (od > 0) {
    const L = (p, q, lab, off) => {
      const A = S.project(...p), B = S.project(...q), dr = cl((t - 16.6) / 0.8);
      const Bx = A[0] + (B[0] - A[0]) * dr, By = A[1] + (B[1] - A[1]) * dr;
      return { svg: `<line x1="${A[0]}" y1="${A[1]}" x2="${Bx}" y2="${By}" stroke="#F3ECEF" stroke-width="${W / 900}" opacity=".85"/>` +
        `<circle cx="${A[0]}" cy="${A[1]}" r="${W / 300}" fill="#F3ECEF"/><circle cx="${Bx}" cy="${By}" r="${W / 300}" fill="#F3ECEF"/>`,
        tag: `<div class="tag" style="left:${(A[0] + B[0]) / 2 + off[0]}px;top:${(A[1] + B[1]) / 2 + off[1]}px;opacity:${cl((t - 17.2) / 0.4)}"><b>${lab}</b> cm</div>` };
    };
    const u = Math.min(W, H) / 36;
    const ls = [L([0, -7, 0], [M.L, -7, 0], M.L, [0, u * 1.2]), L([M.L + 7, -2, 0], [M.L + 7, -2, M.H], M.H, [u * 2.4, 0]), L([M.L + 7, 0, -0.1], [M.L + 7, M.D, -0.1], M.D, [u * 1.8, u * 0.8])];
    dim.innerHTML = ls.map(l => l.svg).join(''); tags.innerHTML = ls.map(l => l.tag).join('');
    dim.style.opacity = od; tags.style.opacity = od;
  } else { dim.innerHTML = ''; tags.innerHTML = ''; }

  // final
  const end = document.getElementById('end'); const oe = cl((t - 31.9) / 0.6) * (1 - cl((t - 34.3) / 0.5));
  end.style.opacity = oe; end.style.transform = `translateY(${(1 - cl((t - 31.9) / 0.6)) * 14}px)`;

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

  document.getElementById('fade').style.opacity = cl((t - 34.4) / 0.6);
}
