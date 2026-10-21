// ---------- a linha inteira, peça a peça ----------
const AREA = { '45': [0.07, 0.38, 0.9, 0.93], '916': [0.07, 0.4, 0.9, 0.8], '169': [0.44, 0.12, 0.93, 0.88] };
const AREA_ROW = { '45': [0.04, 0.42, 0.96, 0.9], '916': [0.03, 0.44, 0.97, 0.76], '169': [0.42, 0.16, 0.97, 0.86] };
const HERO = ['cr4', 'gr2', 'rk180'], CR = ['cr1', 'cr2', 'cr4'], GR = ['gr2', 'gr4'], RK = ['rk140', 'rk180'];
const CAM = {};
function computeCams() {
  const set = (k, ids, area, az, el) => { S.setLayout(ids, { gap: 45 }); CAM[k] = S.fit(area, { az, el }); };
  set('hero', HERO, AREA_ROW[FMT], 20, 8);
  set('cr4', ['cr4'], AREA[FMT], 24, 10); set('cr', CR, AREA_ROW[FMT], 16, 8);
  set('gr2', ['gr2'], AREA[FMT], 24, 10); set('gr', GR, AREA_ROW[FMT], 16, 8);
  set('rk180', ['rk180'], AREA[FMT], 24, 12); set('rk', RK, AREA_ROW[FMT], 16, 10);
  S.setLayout(HERO, { gap: 45 });
  const h = S.world(S.getM('cr4').L - 4, 0, 108, 'cr4');
  CAM.close = { az: 30, el: 6, dist: 52, ty: h.y, tx: h.x, tz: h.z, fov: 28 };
}
const SEG = [
  // [início, fim, eyebrow, título, subtítulo]
  [3.4, 7.9, 'Nova linha · Marcenaria Moraes', 'Antique', 'Madeira maciça escura e ferragens de época'],
  [8.2, 10.6, 'O que une a linha', 'Ferragens de época', 'Dobradiças, tramelas e puxadores de ferro'],
  [11.2, 15.0, 'Sala', 'Cristaleira Antique', 'Vidro nos três lados, 2 m de altura'],
  [15.4, 17.4, 'Cristaleira · três tamanhos', '1, 2 ou 4 portas', '50, 90 ou 160 cm de largura'],
  [18.0, 21.8, 'Quarto', 'Guarda-Roupa Antique', 'Portas almofadadas e cabide de frente'],
  [22.2, 24.4, 'Guarda-roupa · dois tamanhos', '2 ou 4 portas', '130 ou 200 cm de largura'],
  [25.0, 28.6, 'Sala de TV', 'Rack Antique', 'Nicho para os aparelhos e gaveta'],
  [29.0, 31.0, 'Rack · duas medidas', '140 ou 180 cm', 'Para TV de até 55" ou 75"'],
  [31.8, 33.5, 'Madeira · 1', '', ''],
  [33.7, 35.4, 'Madeira · 2', '', ''],
];
const mix = (a, b, k) => ({ az: lerp(a.az, b.az, k), el: lerp(a.el, b.el, k), dist: lerp(a.dist, b.dist, k), ty: lerp(a.ty, b.ty, k), tx: lerp(a.tx, b.tx, k), tz: lerp(a.tz || 0, b.tz || 0, k), fov: 28 });
const spin = (c, t, a, b, az0, az1) => ({ ...c, tz: 0, az: lerp(az0, az1, sm((t - a) / (b - a))) });
// cena em cada trecho: [início, fim, layout, câmera]
const SHOTS = [
  [0, 10.95, 'hero', HERO], [10.95, 15.25, 'cr4', ['cr4']], [15.25, 17.75, 'cr', CR], [17.75, 22.05, 'gr2', ['gr2']], [22.05, 24.75, 'gr', GR],
  [24.75, 28.85, 'rk180', ['rk180']], [28.85, 31.45, 'rk', RK], [31.45, 99, 'hero', HERO],
];
function camAt(t) {
  const k = (a, c) => sm((t - a) / (c - a));
  if (t < 8.1) return spin(CAM.hero, t, 2.5, 8.1, 34, 18);
  if (t < 10.95) return mix({ ...CAM.hero, az: 18 }, CAM.close, k(8.1, 9.4));
  if (t < 15.25) return spin(CAM.cr4, t, 10.95, 15.25, 34, 14);
  if (t < 17.75) return spin(CAM.cr, t, 15.25, 17.75, 26, 18);
  if (t < 22.05) return spin(CAM.gr2, t, 17.75, 22.05, 34, 14);
  if (t < 24.75) return spin(CAM.gr, t, 22.05, 24.75, 26, 18);
  if (t < 28.85) return spin(CAM.rk180, t, 24.75, 28.85, 34, 14);
  if (t < 31.45) return spin(CAM.rk, t, 28.85, 31.45, 26, 18);
  return { ...spin(CAM.hero, t, 31.45, 41, 24, 14), dist: CAM.hero.dist * lerp(1, 1.05, sm((t - 31.45) / 9.5)) };
}
export function frame(t) {
  if (!CAM.hero) computeCams();
  const shot = SHOTS.find(s => t >= s[0] && t < s[1]);
  S.setLayout(shot[3], { gap: 45 });
  const open = (a, b) => t >= a && t < b + 0.6 ? sm((t - a - 0.3) / 1.1) * (1 - sm((t - b + 0.5) / 0.9)) : 0;
  const build = t < 2.4 ? 0 : lerp(0, 6.2, sm((t - 2.4) / 4.4));
  const oc = open(12.2, 15.0), og = open(19.0, 21.8), ok = open(26.0, 28.6);
  const other = FIN0 === 'nog' ? 'jat' : 'nog';
  S.setFinish(t >= 33.6 && t < 35.45 ? other : FIN0);
  for (const id of ['cr1', 'cr2', 'cr4', 'gr2', 'gr4', 'rk140', 'rk180']) S.setPose({ id, build: t < 8 && HERO.includes(id) ? build : 6 });
  S.setPose({ id: 'cr4', build: t < 8 ? build : 6, door: oc * 0.72, drawer: oc, latch: Math.min(1, oc * 3) });
  S.setPose({ id: 'gr2', door: og * 0.78, drawer: [og * 0.55, og * 0.35, og * 0.35], latch: Math.min(1, og * 3) });
  S.setPose({ id: 'rk180', build: t < 8 ? build : 6, door: ok * 0.8, drawer: ok * 0.9, latch: Math.min(1, ok * 3) });
  S.setCam(camAt(t));
  S.render();

  const seg = SEG.find(s => t >= s[0] && t <= s[1]), cap = document.getElementById('cap');
  if (seg) {
    let [a, b, eb, tt, st] = seg;
    if (eb.startsWith('Madeira ·')) [tt, st] = FNAME[eb.endsWith('1') ? FIN0 : other];
    document.getElementById('eb').textContent = eb; document.getElementById('tt').textContent = tt; document.getElementById('st').textContent = st;
    const o = win(t, a, b, 0.4); cap.style.opacity = o; cap.style.transform = `translateY(${(1 - o) * 14}px)`;
    document.getElementById('scrim').style.opacity = cl((t - a) / 0.5) * cl((b - t) / 0.5) * (t > 8.1 && t < 10.95 ? 1 : 0.6);
  } else { cap.style.opacity = 0; document.getElementById('scrim').style.opacity = 0; }
  document.getElementById('dim').innerHTML = ''; document.getElementById('tags').innerHTML = '';

  const end = document.getElementById('end'); const oe = cl((t - 35.7) / 0.6) * (1 - cl((t - 40.2) / 0.5));
  end.style.opacity = oe; end.style.transform = `translateY(${(1 - cl((t - 35.7) / 0.6)) * 14}px)`;
  logoAt(t);
  const cuts = [10.95, 15.25, 17.75, 22.05, 24.75, 28.85, 31.45];
  document.getElementById('fade').style.opacity = Math.max(cl((t - 40.4) / 0.6), ...cuts.map(c => win(t, c - 0.3, c + 0.3, 0.3)));
}
