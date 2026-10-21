// Linha Modern: Escrivaninha Cerne, Mesa de Centro Modern e Aparador Modern. Todas as peças em cm.
// Eixos: x = largura (0 à esquerda, olhando de frente), y = profundidade (0 na frente), z = altura (0 no chão).
// O que une a linha: pernas de painel (tábua inteira em pé), tampo com borda engrossada, nenhum parafuso
// nem puxador à vista (gaveta com cava) e a opção "detalhes pretos" (base em preto fosco, tampo em madeira).
// black: 1 = a peça fica preta na opção detalhes pretos.

const r1 = n => Math.round(n * 100) / 100;
function maker() {
  const P = [];
  const add = (id, n, g, b, o = {}) => P.push({ id, n, g, b: b.map(r1), m: 'madeira', grain: 'x', step: 0, ex: [0, 0, 1], ...o });
  return { P, add };
}
const SC = () => { const L = []; return { L, S: (a, b, t) => L.push({ a: a.map(r1), b: b.map(r1), t }) }; };
function stats(P) {
  let wood = 0;
  P.forEach(p => { if (p.m === 'madeira') { const [a, b, c, d, e, f] = p.b; wood += (d - a) * (e - b) * (f - c); } });
  return { kgWood: wood * 0.62 / 1000, kg: wood * 0.62 / 1000 };
}

// ---------- Escrivaninha Cerne · 150 × 60 × 76 (fiel à ficha da primeira peça) ----------
export function escrivaninha() {
  const L = 150, D = 60, H = 76, { P, add } = maker();
  add('tampo', 'Tampo', 'tampo', [0, 0, 74, L, D, H], { step: 5, ex: [0, 0, 1], rr: 6, u: 'tampo' });
  add('engF', 'Engrosso da frente', 'tampo', [0, 0, 72, L, 6, 74], { step: 5, ex: [0, -1, 0.4], rr: [6, 6, 0, 0], u: 'engF' });
  add('engE', 'Engrosso do lado', 'tampo', [0, 6, 72, 4, 58, 74], { grain: 'y', step: 5, ex: [-1, 0, 0.4], u: 'engL' });
  add('engD', 'Engrosso do lado', 'tampo', [L - 4, 6, 72, L, 58, 74], { grain: 'y', step: 5, ex: [1, 0, 0.4], u: 'engL' });
  for (const [k, x0, ex] of [['E', 4, -1], ['D', L - 6, 1]]) {
    add('pern' + k, 'Perna', 'pernas', [x0, 6, 0, x0 + 2, 58, 74], { grain: 'z', ex: [ex, 0, 0], black: 1, u: 'perna' });
    add('pernR' + k, 'Perna', 'pernas', [x0, 2, 0, x0 + 2, 6, 72], { grain: 'z', ex: [ex, 0, 0], black: 1, u: 'perna', part: 1 });
  }
  add('saia', 'Saia traseira', 'saia', [6, 56, 44, L - 6, 58, 74], { step: 1, ex: [0, 1, 0], black: 1, u: 'saia' });
  add('sfPE', 'Sarrafo do topo da perna', 'sarrafos', [6, 6, 70, 9, 56, 74], { grain: 'y', step: 2, black: 1, u: 'sfPerna' });
  add('sfPD', 'Sarrafo do topo da perna', 'sarrafos', [L - 9, 6, 70, L - 6, 56, 74], { grain: 'y', step: 2, black: 1, u: 'sfPerna' });
  add('sfSE', 'Sarrafo da saia', 'sarrafos', [6, 53, 44, 9, 56, 70], { grain: 'z', step: 2, black: 1, u: 'sfSaia' });
  add('sfSD', 'Sarrafo da saia', 'sarrafos', [L - 9, 53, 44, L - 6, 56, 70], { grain: 'z', step: 2, black: 1, u: 'sfSaia' });
  add('sfTS', 'Sarrafo do topo da saia', 'sarrafos', [9, 53, 70, L - 9, 56, 74], { step: 2, black: 1, u: 'sfTopoSaia' });
  add('refA', 'Reforço A', 'sarrafos', [9, 25, 72, L - 9, 35, 74], { step: 2, black: 1, u: 'refA' });
  add('trB1', 'Travessa B', 'sarrafos', [73, 6, 71, 77, 25, 74], { grain: 'y', step: 2, black: 1, u: 'trB' });
  add('trB2', 'Travessa B', 'sarrafos', [73, 35, 71, 77, 53, 74], { grain: 'y', step: 2, black: 1, u: 'trB' });
  const { L: SCREWS, S } = SC();
  [15, 45, 75, 105, 135].forEach(x => S([x, 3, 72], [x, 3, 75], 'm30'));
  [12, 30, 50].forEach(y => { S([2, y, 72], [2, y, 75], 'm30'); S([L - 2, y, 72], [L - 2, y, 75], 'm30'); });
  [20, 40, 60, 90, 110, 130].forEach(x => S([x, 30, 72], [x, 30, 75], 'm30'));
  for (const y of [12, 18, 40, 46]) S([75, y, 71], [75, y, 75.5], 'm45');
  [30, 60, 90, 120].forEach(x => S([x, 54.5, 70], [x, 54.5, 75.5], 'm45'));
  [24, 40, 56, 72, 88].forEach(x => S([x + 20, 53, 72], [x + 20, 57, 72], 'm40'));
  for (const [x, xo] of [[9, 5.5], [L - 9, L - 5.5]]) [50, 57, 64].forEach(z => S([x, 54.5, z], [xo, 54.5, z], 'm35'));
  for (const [x, xo] of [[9, 5], [L - 9, L - 5]]) [12, 31, 50].forEach(y => S([x, y, 72], [xo, y, 72], 'm35'));
  for (const x of [7.5, L - 7.5]) [12, 31, 50].forEach(y => S([x, y, 70], [x, y, 75], 'allen'));
  for (const [x, xo] of [[9, 5.5], [L - 9, L - 5.5]]) [48, 57, 66].forEach(z => S([x, 54.5, z], [x, 57, z], 'allen'));
  return { key: 'es', kind: 'es', name: 'Escrivaninha Cerne', short: '150 × 60', L, D, H, DIM: { L, P: D, H, LT: L, PT: D }, PARTS: P, SCREWS, DOORS: [], DRAWERS: [], PULLS: [], DOOR_PULLS: [], LATCHES: [], HINGES: [], hw: {}, stats: stats(P) };
}

// ---------- Mesa de Centro Modern · 100 × 60 × 40 ----------
export function mesaCentro() {
  const L = 100, D = 60, H = 40, { P, add } = maker();
  add('tampo', 'Tampo', 'tampo', [0, 0, 38, L, D, H], { step: 5, ex: [0, 0, 1], rr: 5, u: 'tampo' });
  add('engF', 'Engrosso da frente', 'tampo', [0, 0, 36, L, 6, 38], { step: 5, ex: [0, -1, 0.4], rr: [5, 5, 0, 0], u: 'engFT' });
  add('engT', 'Engrosso de trás', 'tampo', [0, D - 6, 36, L, D, 38], { step: 5, ex: [0, 1, 0.4], rr: [0, 0, 5, 5], u: 'engFT' });
  add('engE', 'Engrosso do lado', 'tampo', [0, 6, 36, 4, D - 6, 38], { grain: 'y', step: 5, ex: [-1, 0, 0.4], u: 'engL' });
  add('engD', 'Engrosso do lado', 'tampo', [L - 4, 6, 36, L, D - 6, 38], { grain: 'y', step: 5, ex: [1, 0, 0.4], u: 'engL' });
  for (const [k, x0, ex] of [['E', 8, -1], ['D', L - 10, 1]]) add('pern' + k, 'Perna', 'pernas', [x0, 6, 0, x0 + 2, D - 6, 36], { grain: 'z', ex: [ex, 0, 0], black: 1, u: 'perna' });
  add('prat', 'Prateleira', 'prateleira', [10, 8, 9, L - 10, D - 8, 11], { step: 2, ex: [0, -1, 0], u: 'prat' });
  add('sfPE', 'Sarrafo do topo da perna', 'sarrafos', [10, 8, 33, 13, D - 8, 36], { grain: 'y', step: 2, black: 1, u: 'sfPerna' });
  add('sfPD', 'Sarrafo do topo da perna', 'sarrafos', [L - 13, 8, 33, L - 10, D - 8, 36], { grain: 'y', step: 2, black: 1, u: 'sfPerna' });
  add('sfBE', 'Sarrafo da prateleira', 'sarrafos', [10, 10, 6, 13, D - 10, 9], { grain: 'y', step: 2, black: 1, u: 'sfPrat' });
  add('sfBD', 'Sarrafo da prateleira', 'sarrafos', [L - 13, 10, 6, L - 10, D - 10, 9], { grain: 'y', step: 2, black: 1, u: 'sfPrat' });
  add('refA', 'Reforço', 'sarrafos', [13, 25, 36, L - 13, 35, 38], { step: 2, black: 1, u: 'refA' });
  const { L: SCREWS, S } = SC();
  [12, 30, 50, 70, 88].forEach(x => { S([x, 2, 36], [x, 2, 39], 'm30'); S([x, D - 2, 36], [x, D - 2, 39], 'm30'); });
  [20, 40].forEach(y => { S([2, y, 36], [2, y, 39], 'm30'); S([L - 2, y, 36], [L - 2, y, 39], 'm30'); });
  [22, 40, 58, 76].forEach(x => S([x, 30, 36], [x, 30, 39], 'm30'));
  for (const x of [11.5, L - 11.5]) [14, 30, 46].forEach(y => S([x, y, 33], [x, y, 39], 'allen'));
  for (const [x, xo] of [[13, 9], [L - 13, L - 9]]) { [14, 30, 46].forEach(y => { S([x, y, 34.5], [xo, y, 34.5], 'm35'); S([x, y, 7.5], [xo, y, 7.5], 'm35'); }); }
  for (const x of [11.5, L - 11.5]) [16, 30, 44].forEach(y => S([x, y, 6], [x, y, 10.5], 'm30'));
  return { key: 'mc', kind: 'mc', name: 'Mesa de Centro Modern', short: '100 × 60', L, D, H, DIM: { L, P: D, H, LT: L, PT: D }, PARTS: P, SCREWS, DOORS: [], DRAWERS: [], PULLS: [], DOOR_PULLS: [], LATCHES: [], HINGES: [], hw: {}, stats: stats(P) };
}

// ---------- Aparador Modern · 120 × 35 × 80, duas gavetas com cava ----------
export function aparador() {
  const L = 120, D = 35, H = 80, { P, add } = maker();
  const ZT = 78, ZG = [62.2, 75.8], CV = [14, 2.6];   // cava: 14 de largura × 2,6 de altura, na borda de baixo da frente
  add('tampo', 'Tampo', 'tampo', [0, 0, ZT, L, D, H], { step: 5, ex: [0, 0, 1], rr: 4, u: 'tampo' });
  add('engF', 'Engrosso da frente', 'tampo', [0, 0, 76, L, 6, ZT], { step: 5, ex: [0, -1, 0.4], rr: [4, 4, 0, 0], u: 'engF' });
  add('engE', 'Engrosso do lado', 'tampo', [0, 6, 76, 4, D - 2, ZT], { grain: 'y', step: 5, ex: [-1, 0, 0.4], u: 'engL' });
  add('engD', 'Engrosso do lado', 'tampo', [L - 4, 6, 76, L, D - 2, ZT], { grain: 'y', step: 5, ex: [1, 0, 0.4], u: 'engL' });
  for (const [k, x0, ex] of [['E', 4, -1], ['D', L - 6, 1]]) add('pern' + k, 'Perna', 'pernas', [x0, 2, 0, x0 + 2, D - 2, 76], { grain: 'z', ex: [ex, 0, 0], black: 1, u: 'perna' });
  // gaveteiro embaixo do tampo: piso, saia de trás, divisória do meio
  add('pisoG', 'Piso das gavetas', 'gaveteiro', [6, 2, 60, L - 6, D - 4, 62], { step: 2, ex: [0, 0, -1], black: 1, u: 'pisoG' });
  add('saia', 'Saia traseira', 'gaveteiro', [6, D - 4, 60, L - 6, D - 2, 76], { step: 1, ex: [0, 1, 0], black: 1, u: 'saia' });
  add('div', 'Divisória das gavetas', 'gaveteiro', [L / 2 - 1, 2, 62, L / 2 + 1, D - 4, 76], { grain: 'z', step: 2, black: 1, u: 'div' });
  for (const [k, a, c] of [['E', 6, 9], ['D', L - 9, L - 6]]) {
    add('guia' + k, 'Guia da gaveta', 'sarrafos', [a, 4, 62, c, D - 5, 66], { grain: 'y', step: 2, black: 1, u: 'guia' });
    add('sfP' + k, 'Sarrafo do topo da perna', 'sarrafos', [a, 4, 73, c, D - 5, 76], { grain: 'y', step: 2, black: 1, u: 'sfPerna' });
  }
  add('sfTS', 'Sarrafo do topo da saia', 'sarrafos', [9, D - 7, 73, L - 9, D - 4, 76], { step: 2, black: 1, u: 'sfTopoSaia' });
  // prateleira baixa entre as pernas
  add('prat', 'Prateleira', 'prateleira', [6, 4, 14, L - 6, D - 4, 16], { step: 2, ex: [0, -1, 0], u: 'prat' });
  add('sfBE', 'Sarrafo da prateleira', 'sarrafos', [6, 6, 11, 9, D - 6, 14], { grain: 'y', step: 2, black: 1, u: 'sfPrat' });
  add('sfBD', 'Sarrafo da prateleira', 'sarrafos', [L - 9, 6, 11, L - 6, D - 6, 14], { grain: 'y', step: 2, black: 1, u: 'sfPrat' });
  // gavetas: frente com cava (recorte na borda de baixo), caixa correndo sobre o piso
  const DRAWERS = [];
  [[6.2, L / 2 - 1.2], [L / 2 + 1.2, L - 6.2]].forEach(([x0, x1], i) => {
    const o = { step: 4, drawer: i + 1 }, s = String(i + 1), cx = (x0 + x1) / 2, [cw, ch] = CV;
    add('gF' + s, 'Frente da gaveta', 'gaveta', [x0, 2, ZG[0] + ch, x1, 4, ZG[1]], { ...o, u: 'gF' });
    add('gFa' + s, 'Frente da gaveta', 'gaveta', [x0, 2, ZG[0], cx - cw / 2, 4, ZG[0] + ch], { ...o, u: 'gF', part: 1 });
    add('gFb' + s, 'Frente da gaveta', 'gaveta', [cx + cw / 2, 2, ZG[0], x1, 4, ZG[0] + ch], { ...o, u: 'gF', part: 1 });
    const gx0 = i ? L / 2 + 1.4 : 9.4, gx1 = i ? L - 9.4 : L / 2 - 1.4;
    add('gLE' + s, 'Lateral da gaveta', 'gaveta', [gx0, 4, 62.6, gx0 + 1.5, 30, 73], { ...o, grain: 'y', u: 'gL' });
    add('gLD' + s, 'Lateral da gaveta', 'gaveta', [gx1 - 1.5, 4, 62.6, gx1, 30, 73], { ...o, grain: 'y', u: 'gL' });
    add('gT' + s, 'Traseira da gaveta', 'gaveta', [gx0 + 1.5, 28.5, 62.6, gx1 - 1.5, 30, 72], { ...o, u: 'gT' });
    add('gFu' + s, 'Fundo da gaveta', 'gaveta', [gx0, 4, 62.0, gx1, 30, 62.6], { ...o, m: 'comp', u: 'gFu' });
    DRAWERS.push({ x0, x1, gx0, gx1, cava: [cx - cw / 2, cx + cw / 2] });
  });
  const { L: SCREWS, S } = SC();
  [12, 36, 60, 84, 108].forEach(x => S([x, 1, 76], [x, 1, 79], 'm30'));
  [10, 22].forEach(y => { S([2, y, 76], [2, y, 79], 'm30'); S([L - 2, y, 76], [L - 2, y, 79], 'm30'); });
  for (const x of [7.5, L - 7.5]) [9, 18, 27].forEach(y => S([x, y, 73], [x, y, 79], 'allen'));
  [25, 50, 70, 95].forEach(x => S([x, D - 5.5, 73], [x, D - 5.5, 79.5], 'm45'));
  for (const [x, xo] of [[9, 5], [L - 9, L - 5]]) [10, 22].forEach(y => { S([x, y, 74.5], [xo, y, 74.5], 'm35'); S([x, y, 64], [xo, y, 64], 'm35'); S([x, y, 12.5], [xo, y, 12.5], 'm35'); });
  [20, 40, 80, 100].forEach(x => S([x, D - 4, 61], [x, D - 1, 61], 'allen'));
  [8, 20].forEach(y => S([L / 2, y, 60], [L / 2, y, 65], 'm40'));
  for (const x of [7.5, L - 7.5]) [10, 22].forEach(y => S([x, y, 61], [x, y, 61], 'allen'));
  DRAWERS.forEach(d => { for (const [x, xo] of [[d.gx0, d.gx0 + 4], [d.gx1, d.gx1 - 4]]) S([x, 29, 67], [xo, 29, 67], 'm30'); });
  return { key: 'ap', kind: 'ap', name: 'Aparador Modern', short: '120 × 35', L, D, H, DIM: { L, P: D, H, LT: L, PT: D }, ZG, CV, PARTS: P, SCREWS, DOORS: [], DRAWERS, PULLS: [], DOOR_PULLS: [], LATCHES: [], HINGES: [], hw: {}, stats: stats(P) };
}

export const MAKERS = { es: escrivaninha, mc: mesaCentro, ap: aparador };
