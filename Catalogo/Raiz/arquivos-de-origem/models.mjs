// Linha Raiz: Mesa de Jantar Raiz, Banco Raiz e Bancada Gourmet Raiz. Todas as peças em cm.
// Eixos: x = largura (0 à esquerda, olhando de frente), y = profundidade (0 na frente), z = altura (0 no chão).
// O que une a linha: tampo grosso de 5 cm (tábuas coladas), encaixe à mostra como detalhe: cavilhas, cunhas e
// gravatas-borboleta em cambará claro, contrastando com a madeira escura. Pés grossos, cavalete com cunha passante.
// peg: 1 = peça de contraste (cambará natural; na opção "discreta" fica da mesma madeira do móvel).
// cyl: 'x' | 'y' | 'z' = cilindro nesse eixo · bow: 1 = gravata-borboleta (comprida em y) · thin: 1 = fora das vistas cotadas.

const r1 = n => Math.round(n * 100) / 100;
function maker() {
  const P = [];
  const add = (id, n, g, b, o = {}) => P.push({ id, n, g, b: b.map(r1), m: 'madeira', grain: 'x', step: 0, ex: [0, 0, 1], ...o });
  return { P, add };
}
const SC = () => { const L = []; return { L, S: (a, b, t) => L.push({ a: a.map(r1), b: b.map(r1), t }) }; };
function stats(P) {
  let wood = 0;
  P.forEach(p => { if (p.m === 'madeira') { const [a, b, c, d, e, f] = p.b; wood += (d - a) * (e - b) * (f - c) * (p.cyl ? 0.785 : 1) * (p.bow ? 0.7 : 1); } });
  return { kgWood: wood * 0.62 / 1000, kg: wood * 0.62 / 1000 };
}
// tampo de tábuas coladas no comprimento (y0..y1 de cada tábua), cantos de fora levemente arredondados
function tampo(add, L, D, z0, z1, seams, r = 1.5) {
  const ys = [0, ...seams, D];
  for (let i = 0; i < ys.length - 1; i++) {
    const first = i === 0, last = i === ys.length - 2;
    add('tab' + (i + 1), 'Tábua do tampo', 'tampo', [0, ys[i], z0, L, ys[i + 1], z1], { step: 4.4, ex: [0, 0, 1], rr: [first ? r : 0, first ? r : 0, last ? r : 0, last ? r : 0], u: 'tabua' });
  }
}
// gravata-borboleta embutida no tampo, atravessando a emenda em y = s
function gravata(add, x, s, z, len, wEnd, k) {
  add('grav' + k, 'Gravata-borboleta', 'tampo', [x - wEnd / 2, s - len / 2, z - 0.55, x + wEnd / 2, s + len / 2, z + 0.06], { grain: 'y', step: 5, ex: [0, 0, 1], bow: 1, peg: 1, thin: 1, u: 'gravata' });
}
const cav = (add, k, b, axis, ex, step = 4.2) => add('cav' + k, 'Cavilha aparente', 'cavilhas', b, { grain: axis, cyl: axis, step, ex, peg: 1, thin: 1, u: 'cavilha' });

// ---------- cavalete (mesa e banco): pé, coluna, travessa de cima, cunha na longarina ----------
function cavalete(add, S, xc, d, side, tag) {
  const { t, yF, yC, zF, zC, zT, zTop, pad } = d, h = t / 2, ex = [side, 0, 0];
  add('pe' + tag, 'Pé do cavalete', 'cavalete', [xc - h, yF[0], pad, xc + h, yF[1], zF], { grain: 'y', step: 0, ex, round: 0.5, u: 'pe' });
  add('apA' + tag, 'Calço do pé', 'cavalete', [xc - h, yF[0], 0, xc + h, yF[0] + d.padL, pad], { grain: 'y', step: 0, ex, u: 'calco', part: 1 });
  add('apB' + tag, 'Calço do pé', 'cavalete', [xc - h, yF[1] - d.padL, 0, xc + h, yF[1], pad], { grain: 'y', step: 0, ex, u: 'calco', part: 1 });
  add('col' + tag, 'Coluna', 'cavalete', [xc - h, yC[0], zF, xc + h, yC[1], zC], { grain: 'z', step: 1, ex, round: 0.5, u: 'coluna' });
  add('trc' + tag, 'Travessa de cima', 'cavalete', [xc - h, yF[0] + d.inT, zC, xc + h, yF[1] - d.inT, zT], { grain: 'y', step: 2, ex: [side, 0, 0.6], round: 0.5, u: 'trCima' });
  const yc = (yC[0] + yC[1]) / 2, pz = [(pad + zF) / 2, (zC + zT) / 2], py = [yc - d.pegY, yc + d.pegY], pr = d.peg / 2;
  pz.forEach((z, i) => py.forEach((y, j) => cav(add, tag + i + j, [xc - h - 0.25, y - pr, z - pr, xc + h + 0.25, y + pr, z + pr], 'x', [side, 0, 0])));
  // allen do tampo na travessa de cima: o do meio em furo redondo, os das pontas em furo oval
  d.allenY.forEach(y => S([xc, y, zC + 2], [xc, y, zTop - 1], 'allen'));
  [yC[0] + 3, yC[1] - 3].forEach(y => S([xc, y, zF - 3.5], [xc, y, zF + 4], 'tenao'));
  [yC[0] + 3, yC[1] - 3].forEach(y => S([xc, y, zC - 4], [xc, y, zC + 3.5], 'tenao'));
}
function longarina(add, d, xs) {
  const { t, yS, zS, out, wedge } = d, h = t / 2, x0 = xs[0] - h - out, x1 = xs[1] + h + out;
  add('long', 'Longarina', 'travessa', [x0, yS[0], zS[0], x1, yS[1], zS[1]], { step: 3, ex: [0, 1, 0], round: 0.4, u: 'longarina' });
  [[xs[0] - h - out / 2, -1, 'E'], [xs[1] + h + out / 2, 1, 'D']].forEach(([x, s, k]) =>
    add('cun' + k, 'Cunha', 'travessa', [x - wedge[0] / 2, yS[0] + 0.4, zS[0] - wedge[1], x + wedge[0] / 2, yS[1] - 0.4, zS[1] + wedge[1]], { grain: 'z', step: 3.7, ex: [0, 0, 1], peg: 1, u: 'cunha' }));
}

// ---------- Mesa de Jantar Raiz · 180 × 90 × 76, 6 a 8 lugares ----------
export function mesaJantar() {
  const L = 180, D = 90, H = 76, { P, add } = maker(), { L: SCREWS, S } = SC();
  const XS = [30, 150];
  const d = { t: 9, yF: [5, 85], yC: [37, 53], pad: 1.5, padL: 10, zF: 9.5, zC: 63, zT: 71, zTop: 76, inT: 3, peg: 1.6, pegY: 4.5, allenY: [15, 45, 75], yS: [42, 48], zS: [30, 40], out: 9, wedge: [2.4, 3] };
  tampo(add, L, D, 71, 76, [30, 60]);
  [[50, 30], [130, 30], [90, 60]].forEach(([x, s], i) => gravata(add, x, s, 76, 11, 5.5, i + 1));
  cavalete(add, S, XS[0], d, -1, 'E'); cavalete(add, S, XS[1], d, 1, 'D');
  longarina(add, d, XS);
  // emenda das tábuas do tampo: cola + cavilhas de 10 mm escondidas a cada 30 cm
  [30, 60].forEach(s => [20, 50, 80, 110, 140, 160].forEach(x => S([x, s - 2.5, 73.5], [x, s + 2.5, 73.5], 'cav10')));
  return { key: 'mj', kind: 'mj', name: 'Mesa de Jantar Raiz', short: '180 × 90', L, D, H, DIM: { L, P: D, H, LT: L, PT: D }, XS, TR: d, PARTS: P, SCREWS, DOORS: [], DRAWERS: [], PULLS: [], DOOR_PULLS: [], LATCHES: [], HINGES: [], hw: {}, stats: stats(P) };
}

// ---------- Banco Raiz · 160 × 35 × 45, par da mesa ----------
export function banco() {
  const L = 160, D = 35, H = 45, { P, add } = maker(), { L: SCREWS, S } = SC();
  const XS = [25, 135];
  const d = { t: 7, yF: [3, 32], yC: [11.5, 23.5], pad: 1.2, padL: 7, zF: 7.2, zC: 35, zT: 40, zTop: 45, inT: 1, peg: 1.4, pegY: 3, allenY: [8, 17.5, 27], yS: [15.5, 19.5], zS: [16, 23], out: 7, wedge: [2, 2.2] };
  tampo(add, L, D, 40, 45, [17.5]);
  [[40, 17.5], [120, 17.5]].forEach(([x, s], i) => gravata(add, x, s, 45, 9, 4.6, i + 1));
  cavalete(add, S, XS[0], d, -1, 'E'); cavalete(add, S, XS[1], d, 1, 'D');
  longarina(add, d, XS);
  [20, 50, 80, 110, 140].forEach(x => S([x, 15, 42.5], [x, 20, 42.5], 'cav10'));
  return { key: 'bc', kind: 'bc', name: 'Banco Raiz', short: '160 × 35', L, D, H, DIM: { L, P: D, H, LT: L, PT: D }, XS, TR: d, PARTS: P, SCREWS, DOORS: [], DRAWERS: [], PULLS: [], DOOR_PULLS: [], LATCHES: [], HINGES: [], hw: {}, stats: stats(P) };
}

// ---------- Bancada Gourmet Raiz · 120 × 50 × 90, gaveta, prateleira de ripas, ganchos e toalheiro ----------
export function bancada() {
  const L = 120, D = 50, H = 90, { P, add } = maker(), { L: SCREWS, S } = SC();
  const ZT = 85, LX = [[3, 10], [110, 117]], LY = [[3, 10], [40, 47]];
  tampo(add, L, D, ZT, H, [25]);
  [[30, 25], [90, 25]].forEach(([x, s], i) => gravata(add, x, s, H, 10, 5, i + 1));
  LX.forEach(([a, b], i) => LY.forEach(([c, e], j) => add('perna' + i + j, 'Perna', 'pernas', [a, c, 0, b, e, ZT], { grain: 'z', step: 0, ex: [i ? 1 : -1, j ? 1 : -1, 0], round: 0.5, u: 'perna' })));
  // saias (avental) embaixo do tampo: frente com a abertura da gaveta, lados e fundo
  add('saiaFE', 'Saia da frente', 'saias', [10, 4, 71, 35, 6.5, ZT], { step: 1, ex: [0, -1, 0], u: 'saiaF' });
  add('saiaFD', 'Saia da frente', 'saias', [85, 4, 71, 110, 6.5, ZT], { step: 1, ex: [0, -1, 0], u: 'saiaF' });
  add('saiaFB', 'Régua embaixo da gaveta', 'saias', [35, 4, 71, 85, 6.5, 72.5], { step: 1, ex: [0, -1, 0], u: 'regua' });
  add('saiaE', 'Saia do lado', 'saias', [4, 10, 71, 6.5, 40, ZT], { grain: 'y', step: 1, ex: [-1, 0, 0], u: 'saiaL' });
  add('saiaD', 'Saia do lado', 'saias', [113.5, 10, 71, 116, 40, ZT], { grain: 'y', step: 1, ex: [1, 0, 0], u: 'saiaL' });
  add('saiaT', 'Saia do fundo', 'saias', [10, 43.5, 71, 110, 46, ZT], { step: 1, ex: [0, 1, 0], u: 'saiaT' });
  add('guiaE', 'Guia da gaveta', 'saias', [33.5, 6.5, 71, 37, 43.5, 73], { grain: 'y', step: 1.5, ex: [0, 0, -1], u: 'guia' });
  add('guiaD', 'Guia da gaveta', 'saias', [83, 6.5, 71, 86.5, 43.5, 73], { grain: 'y', step: 1.5, ex: [0, 0, -1], u: 'guia' });
  // prateleira de ripas, a 21 cm do chão
  add('trF', 'Travessa da prateleira', 'prateleira', [10, 4.5, 14, 110, 8.5, 19], { step: 1, ex: [0, -1, 0], u: 'trPrat' });
  add('trT', 'Travessa da prateleira', 'prateleira', [10, 41.5, 14, 110, 45.5, 19], { step: 1, ex: [0, 1, 0], u: 'trPrat' });
  add('trE', 'Travessa do lado', 'prateleira', [4.5, 10, 14, 8.5, 40, 19], { grain: 'y', step: 1, ex: [-1, 0, 0], u: 'trLado' });
  add('trD', 'Travessa do lado', 'prateleira', [111.5, 10, 14, 115.5, 40, 19], { grain: 'y', step: 1, ex: [1, 0, 0], u: 'trLado' });
  const n = 10, w = 7, g = (100 - n * w) / (n + 1);
  for (let i = 0; i < n; i++) { const x = 10 + g + i * (w + g); add('ripa' + i, 'Ripa da prateleira', 'prateleira', [x, 4.5, 19, x + w, 45.5, 21], { grain: 'y', step: 2 + i * 0.06, ex: [0, 0, 1], u: 'ripa' }); }
  // toalheiro (lado direito) e 3 ganchos de cavilha (lado esquerdo)
  add('toal', 'Toalheiro', 'detalhes', [112.25, 10, 60.75, 114.75, 40, 63.25], { grain: 'y', cyl: 'y', step: 2.6, ex: [1, 0, 0], u: 'toalheiro' });
  [16, 25, 34].forEach((y, i) => add('ganc' + i, 'Gancho', 'detalhes', [-3, y - 0.9, 76.1, 4.3, y + 0.9, 77.9], { grain: 'x', cyl: 'x', step: 4.4 + i * 0.1, ex: [-1, 0, 0], peg: 1, u: 'gancho' }));
  // cavilhas aparentes nas ligações das pernas (2 em cada saia, 1 em cada travessa de baixo)
  let k = 0; const pr = 0.8;
  for (const [x, yF] of [[6.5, 2.7], [113.5, 2.7], [6.5, 47.3], [113.5, 47.3]]) { const yi = yF < 10 ? [yF, yF + 0.6] : [yF - 0.6, yF]; [75, 81, 16.5].forEach(z => cav(add, k++, [x - pr, yi[0], z - pr, x + pr, yi[1], z + pr], 'y', [0, yF < 10 ? -1 : 1, 0])); }
  for (const [xF, y] of [[2.7, 6.5], [2.7, 43.5], [117.3, 6.5], [117.3, 43.5]]) { const xi = xF < 10 ? [xF, xF + 0.6] : [xF - 0.6, xF]; [75, 81, 16.5].forEach(z => cav(add, k++, [xi[0], y - pr, z - pr, xi[1], y + pr, z + pr], 'x', [xF < 10 ? -1 : 1, 0, 0])); }
  // gaveta de talheres, com puxador torneado em cambará claro
  const DRAWERS = [{ x0: 35.3, x1: 84.7, gx0: 37.2, gx1: 82.8 }], o = { step: 4, drawer: 1 };
  add('gF', 'Frente da gaveta', 'gaveta', [35.3, 4, 72.8, 84.7, 6.5, 84.6], { ...o, u: 'gF' });
  add('gP', 'Puxador torneado', 'gaveta', [58.5, 1.3, 77.2, 61.5, 4.05, 80.2], { ...o, grain: 'y', cyl: 'y', peg: 1, u: 'puxador' });
  add('gLE', 'Lateral da gaveta', 'gaveta', [37.2, 6.5, 73.5, 38.7, 42, 82.5], { ...o, grain: 'y', u: 'gL' });
  add('gLD', 'Lateral da gaveta', 'gaveta', [81.3, 6.5, 73.5, 82.8, 42, 82.5], { ...o, grain: 'y', u: 'gL' });
  add('gT', 'Traseira da gaveta', 'gaveta', [38.7, 40.5, 73.5, 81.3, 42, 82], { ...o, u: 'gT' });
  add('gFu', 'Fundo da gaveta', 'gaveta', [37.2, 6.5, 73, 82.8, 42, 73.5], { ...o, m: 'comp', u: 'gFu' });
  // fixação escondida: tampo nas saias por dentro (furo oval), guias, ripas
  [20, 45, 75, 100].forEach(x => { S([x, 6.5, 80], [x, 3, 87.5], 'm50'); S([x, 43.5, 80], [x, 47, 87.5], 'm50'); });
  [20, 30].forEach(y => { S([6.5, y, 80], [3, y, 87.5], 'm50'); S([113.5, y, 80], [117, y, 87.5], 'm50'); });
  [[35.25, 8], [35.25, 41], [84.75, 8], [84.75, 41]].forEach(([x, y]) => S([x, y, 71], [x, y, 74.5], 'm40'));
  for (let i = 0; i < n; i++) { const x = 10 + g + i * (w + g) + w / 2; S([x, 6.5, 21.2], [x, 6.5, 16], 'm30'); S([x, 43.5, 21.2], [x, 43.5, 16], 'm30'); }
  return { key: 'bg', kind: 'bg', name: 'Bancada Gourmet Raiz', short: '120 × 50', L, D, H, DIM: { L, P: D, H, LT: L, PT: D }, PARTS: P, SCREWS, DOORS: [], DRAWERS, PULLS: [], DOOR_PULLS: [], LATCHES: [], HINGES: [], hw: {}, stats: stats(P) };
}

export const MAKERS = { mj: mesaJantar, bc: banco, bg: bancada };
