// ---------- enquadramentos ----------
const AREA = { '45': [0.06, 0.4, 0.86, 0.9], '916': [0.07, 0.42, 0.85, 0.78], '169': [0.44, 0.15, 0.9, 0.85] };
const AREA_ALL = { '45': [0.04, 0.42, 0.96, 0.9], '916': [0.03, 0.44, 0.97, 0.76], '169': [0.42, 0.18, 0.97, 0.85] };
const CAM = {};
function computeCams() {
  for (const id of IDS) { S.setLayout([id]); CAM[id] = S.fit(AREA[FMT], { az: 25, el: 12 }); }
  S.setLayout(IDS, { gap: 50 }); CAM.all = S.fit(AREA_ALL[FMT], { az: 16, el: 10 });
  S.setLayout([IDS[0]]);
}
const MA = S.getM('bf150'), MB = S.getM('bf110');
const med = M => `${M.L} × ${M.H} × ${M.D}`;
const SEG = [
  [8.6, 11.8, 'Madeira', 'Madeira maciça', 'Nogueira ou jatobá, com óleo e cera de abelha'],
  [12.0, 15.4, 'Medidas · 150 cm', med(MA), 'Centímetros · 3 gavetas e 3 portas'],
  [15.6, 19.2, 'Por dentro', 'Gavetas e armários', 'Talheres em cima, louça embaixo'],
  [19.4, 22.8, 'Detalhe', 'Ferragens de época', 'Dobradiça rústica, argola e puxador concha'],
  [23.6, 26.8, 'Também em 110 cm', med(MB), 'Centímetros · 2 gavetas e 2 portas'],
  [27.2, 28.9, 'Madeira · 1', '', ''],
  [29.1, 30.8, 'Madeira · 2', '', ''],
];
const mix = (a, b, k) => ({ az: lerp(a.az, b.az, k), el: lerp(a.el, b.el, k), dist: lerp(a.dist, b.dist, k), ty: lerp(a.ty, b.ty, k), tx: lerp(a.tx, b.tx, k), tz: lerp(a.tz || 0, b.tz || 0, k), fov: 28 });
function camAt(t) {
  const k = (a, c) => sm((t - a) / (c - a)), A = CAM.bf150, B = CAM.bf110, all = CAM.all;
  if (t < 8.6) { const q = sm((t - 3) / 5.6); return { ...A, az: lerp(-38, 22, q), el: lerp(22, 13, q), dist: A.dist * lerp(1.1, 1, q) }; }
  if (t < 12) return { ...A, az: lerp(22, 32, (t - 8.6) / 3.4) };
  if (t < 15.5) { const q = k(12, 12.9); return { ...A, az: lerp(32, 26, q) }; }
  if (t < 19.3) { const q = k(15.5, 16.4); return mix({ ...A, az: 26 }, { ...A, az: 14, el: 16, dist: A.dist * 1.02 }, q); }
  if (t < 23.3) { // close: dobradiça da porta da direita, depois a argola e o puxador concha
    const h = S.world(MA.L - 4, 0, 61, 'bf150'), l = S.world(MA.divs[MA.divs.length - 1] + 1, 0, 53, 'bf150');
    const c1 = { az: 32, el: 8, dist: 50, ty: h.y, tx: h.x, tz: h.z }, c2 = { az: 12, el: 6, dist: 88, ty: l.y, tx: l.x, tz: l.z };
    const q = k(19.3, 20.2), q2 = k(20.9, 22.4);
    return mix({ ...A, az: 14, el: 16, dist: A.dist * 1.02 }, mix(c1, c2, q2), q);
  }
  if (t < 27.0) return { ...B, az: lerp(34, 24, k(23.3, 26.8)) };
  const q = sm((t - 27) / 7); return { ...all, az: lerp(22, 14, q), dist: all.dist * lerp(1, 1.04, q) };
}
function layoutAt(t) {
  if (t < 23.35) S.setLayout(['bf150']);
  else if (t < 27.05) S.setLayout(['bf110']);
  else S.setLayout(['bf110', 'bf150'], { gap: 50 });
}
export function frame(t) {
  if (!CAM.bf150) computeCams();
  layoutAt(t);
  const open = (a, b) => t >= a && t < b + 0.6 ? sm((t - a - 0.4) / 1.3) * (1 - sm((t - b + 0.6) / 1.0)) : 0;
  const build = t < 3.0 ? 0 : lerp(0, 6.2, sm((t - 3.0) / 5.4));
  const d = open(15.6, 19.2);
  const other = FIN0 === 'nog' ? 'jat' : 'nog';
  S.setFinish(t >= 29.0 && t < 30.85 ? other : FIN0);
  S.setPose({ id: 'bf150', build, door: d * 0.8, drawer: d * 0.9 });
  S.setPose({ id: 'bf110', build: 6 });
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
  if (!dims(MA, 'bf150', 12.3, 15.3) && !dims(MB, 'bf110', 24.0, 26.7)) { dim.innerHTML = ''; tags.innerHTML = ''; }
  const end = document.getElementById('end'); const oe = cl((t - 31.0) / 0.6) * (1 - cl((t - 33.3) / 0.5));
  end.style.opacity = oe; end.style.transform = `translateY(${(1 - cl((t - 31.0) / 0.6)) * 14}px)`;
  logoAt(t);
  document.getElementById('fade').style.opacity = Math.max(cl((t - 33.4) / 0.6), win(t, 23.05, 23.65, 0.3), win(t, 26.75, 27.35, 0.3));
}
