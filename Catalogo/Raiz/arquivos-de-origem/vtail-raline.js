// ---------- a linha Raiz inteira, peça a peça (~38 s) ----------
const AREA = { '45': [0.07, 0.4, 0.9, 0.9], '916': [0.07, 0.42, 0.9, 0.78], '169': [0.44, 0.14, 0.93, 0.86] };
const AREA_ROW = { '45': [0.04, 0.42, 0.96, 0.9], '916': [0.03, 0.44, 0.97, 0.76], '169': [0.42, 0.16, 0.97, 0.86] };
// o conjunto: bancada à esquerda, mesa no meio e o banco na frente da mesa
const SET = [['bg', -205, -10], ['mj', 0, 0], ['bc', 0, 78]];
const CAM = {};
function computeCams() {
  S.place(SET); CAM.hero = S.fit(AREA_ROW[FMT], { az: 24, el: 16 });
  const one = (k, az, el) => { S.setLayout([k]); CAM[k] = S.fit(AREA[FMT], { az, el }); };
  one('mj', 26, 16); one('bc', 26, 16); one('bg', 26, 14);
  S.place(SET);
  const w = S.world(90, 60, 76, 'mj');
  CAM.close = { az: 22, el: 40, dist: 95, tx: w.x, ty: w.y, tz: w.z, fov: 28 };
}
const SEG = [
  [3.4, 7.9, 'Nova linha · Marcenaria Moraes', 'Raiz', 'Madeira grossa e o encaixe à mostra'],
  [8.2, 10.6, 'O que une a linha', 'Gravata-borboleta', 'Cavilhas, cunhas e gravatas em cambará claro'],
  [11.2, 15.0, 'Sala de jantar', 'Mesa de Jantar Raiz', '180 × 90 cm · 6 lugares · desmonta'],
  [15.6, 19.4, 'Par da mesa', 'Banco Raiz', '160 × 35 cm · 3 lugares'],
  [20.0, 23.8, 'Área gourmet', 'Bancada Gourmet Raiz', 'Gaveta, ganchos e prateleira de ripas'],
  [24.4, 28.0, 'O conjunto', 'Feita para durar', 'Tampo de 5 cm: riscou, lixa e passa óleo'],
  [28.6, 30.3, 'Madeira · 1', '', ''],
  [30.5, 32.2, 'Madeira · 2', '', ''],
];
const mix = (a, b, k) => ({ az: lerp(a.az, b.az, k), el: lerp(a.el, b.el, k), dist: lerp(a.dist, b.dist, k), ty: lerp(a.ty, b.ty, k), tx: lerp(a.tx, b.tx, k), tz: lerp(a.tz || 0, b.tz || 0, k), fov: 28 });
const spin = (c, t, a, b, az0, az1) => ({ ...c, az: lerp(az0, az1, sm((t - a) / (b - a))) });
const SHOTS = [[0, 10.95, null], [10.95, 15.35, 'mj'], [15.35, 19.75, 'bc'], [19.75, 24.15, 'bg'], [24.15, 99, null]];
function camAt(t) {
  const k = (a, c) => sm((t - a) / (c - a));
  if (t < 8.1) return spin(CAM.hero, t, 2.5, 8.1, 36, 20);
  if (t < 10.95) return mix({ ...CAM.hero, az: 20 }, CAM.close, k(8.1, 9.4));
  if (t < 15.35) return spin(CAM.mj, t, 10.95, 15.35, 36, 16);
  if (t < 19.75) return spin(CAM.bc, t, 15.35, 19.75, 36, 16);
  if (t < 24.15) return spin(CAM.bg, t, 19.75, 24.15, 36, 16);
  return { ...spin(CAM.hero, t, 24.15, 38, 30, 16), dist: CAM.hero.dist * lerp(1, 1.05, sm((t - 24.15) / 13)) };
}
export function frame(t) {
  if (!CAM.hero) computeCams();
  const shot = SHOTS.find(s => t >= s[0] && t < s[1])[2];
  if (shot) S.setLayout([shot]); else S.place(SET);
  const build = t < 2.4 ? 0 : lerp(0, 6.2, sm((t - 2.4) / 4.4));
  const dr = t > 20.8 && t < 23.6 ? sm((t - 21.0) / 1.0) * (1 - sm((t - 22.7) / 0.8)) : 0;
  const other = FIN0 === 'nog' ? 'jat' : 'nog';
  S.setFinish(t >= 30.4 && t < 32.25 ? other : FIN0);
  for (const id of ['mj', 'bc']) S.setPose({ id, build: t < 8 ? build : 6 });
  S.setPose({ id: 'bg', build: t < 8 ? build : 6, drawer: [dr * 0.85] });
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
