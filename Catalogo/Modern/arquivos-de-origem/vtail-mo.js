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
