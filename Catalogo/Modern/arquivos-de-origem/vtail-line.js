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
