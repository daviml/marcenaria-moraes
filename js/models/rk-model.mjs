// Rack Antique (180 e 140 cm): todas as peças em cm, geradas a partir da versão escolhida.
// Eixos: x = largura (0 à esquerda, olhando de frente), y = profundidade (0 na frente), z = altura (0 no chão).
// 55 de altura e 42 de fundo. Três vãos: porta almofadada de cada lado e, no meio, gaveta em cima e nicho aberto com prateleira.
// Mesma construção da linha: colunas 4 × 4 com pés de 10 cm, laterais inteiras com veio em pé, cavilhas e topo com beiral.

const VARIANTS = {
  180: { L: 180, name: 'Rack Antique 180', short: '180 cm', side: 48 },
  140: { L: 140, name: 'Rack Antique 140', short: '140 cm', side: 38 },
};

export function make(v = 180) {
  const V = VARIANTS[v]; if (!V) throw new Error('versão ' + v);
  const L = V.L, D = 42, H = 55;
  const DIM = { L, P: D, H, LT: L + 6, PT: D + 3 };
  const r1 = n => Math.round(n * 100) / 100;
  const ZC = H - 2;                    // topo das colunas (53)
  const ZF = 10;                       // pés: 10 cm livres embaixo
  const ZD = [14.2, 48.8];             // portas
  const ZG = [41.2, 48.8];             // frente da gaveta
  const ZPR = 26, ZPL = 30;            // prateleira do nicho e prateleiras atrás das portas
  const HINGES = [20, 43], ZLATCH = 31.5, ST = 7, RL = 7;
  const d1 = 4 + V.side, d2 = L - 4 - V.side - 2;       // divisórias (2 cm)
  const bays = [
    { k: 'E', x0: 4, x1: d1, door: 1 },
    { k: 'C', x0: d1 + 2, x1: d2, door: 0 },
    { k: 'D', x0: d2 + 2, x1: L - 4, door: 1 },
  ];
  bays.forEach(b => { b.w = b.x1 - b.x0; b.cx = (b.x0 + b.x1) / 2; });

  const P = [];
  const add = (id, n, g, b, o = {}) => P.push({ id, n, g, b: b.map(r1), m: 'madeira', grain: 'x', step: 0, ex: [0, 0, 1], ...o });

  // colunas 4 × 4 do chão ao topo (os 10 cm de baixo são os pés)
  add('colFE', 'Coluna', 'colunas', [0, 0, 0, 4, 4, ZC], { grain: 'z', ex: [-1, -1, 0], u: 'col' });
  add('colFD', 'Coluna', 'colunas', [L - 4, 0, 0, L, 4, ZC], { grain: 'z', ex: [1, -1, 0], u: 'col' });
  add('colTE', 'Coluna', 'colunas', [0, 36, 0, 4, 40, ZC], { grain: 'z', ex: [-1, 1, 0], u: 'col' });
  add('colTD', 'Coluna', 'colunas', [L - 4, 36, 0, L, 40, ZC], { grain: 'z', ex: [1, 1, 0], u: 'col' });
  // laterais inteiras com veio em pé, coladas nas colunas
  add('latE', 'Lateral', 'laterais', [0, 4, ZF, 2, 36, ZC], { grain: 'z', step: 1, ex: [-1, 0, 0], u: 'lat' });
  add('latD', 'Lateral', 'laterais', [L - 2, 4, ZF, L, 36, ZC], { grain: 'z', step: 1, ex: [1, 0, 0], u: 'lat' });
  // travessas da frente e de trás (inteiras, de coluna a coluna)
  add('tfInf', 'Rodapé da frente', 'travessas', [4, 0, ZF, L - 4, 2, 14], { step: 1, ex: [0, -1, 0], u: 'tfInf' });
  add('tfSup', 'Travessa de cima (frente)', 'travessas', [4, 0, 49, L - 4, 2, ZC], { step: 1, ex: [0, -1, 0], u: 'tfSup' });
  add('ttInf', 'Travessa de baixo (trás)', 'travessas', [4, 38, ZF, L - 4, 40, 14], { step: 1, ex: [0, 1, 0], u: 'ttInf' });
  add('ttSup', 'Travessa de cima (trás)', 'travessas', [4, 38, 49, L - 4, 40, ZC], { step: 1, ex: [0, 1, 0], u: 'ttSup' });
  add('tfGav', 'Travessa da gaveta', 'travessas', [d1 + 2, 0, 38, d2, 2, 41], { step: 2, ex: [0, -1, 0], u: 'tfGav' });
  // piso inteiro, sobre apoios, e divisórias de 2 cm em pé sobre ele
  add('piso', 'Piso', 'pisos', [2, 2, 12, L - 2, 38, 14], { step: 2, ex: [0, 0, -1], u: 'piso' });
  add('divE', 'Divisória', 'divisorias', [d1, 0, 14, d1 + 2, 38, 49], { grain: 'z', step: 2, ex: [0, 0, 1], u: 'div' });
  add('divD', 'Divisória', 'divisorias', [d2, 0, 14, d2 + 2, 38, 49], { grain: 'z', step: 2, ex: [0, 0, 1], u: 'div' });
  add('pisoG', 'Piso da gaveta', 'pisos', [d1 + 2, 2, 39, d2, 38, 41], { step: 2, ex: [0, 0, -1], u: 'pisoG' });
  // apoios (ripa 2 × 2)
  for (const [k, a, c] of [['E', 2, 4], ['D', L - 4, L - 2]]) {
    add('apP' + k, 'Apoio do piso', 'apoios', [a, 4, ZF, c, 36, 12], { grain: 'y', step: 2, u: 'apPiso' });
    add('apL' + k, 'Apoio da prateleira', 'apoios', [a, 6, ZPL - 2, c, 36, ZPL], { grain: 'y', step: 3, u: 'apPr' });
  }
  add('apPF', 'Apoio do piso', 'apoios', [4, 2, ZF, L - 4, 4, 12], { step: 2, u: 'apPisoF' });
  add('apDE', 'Apoio da prateleira', 'apoios', [d1 - 2, 6, ZPL - 2, d1, 36, ZPL], { grain: 'y', step: 3, u: 'apPr' });
  add('apDD', 'Apoio da prateleira', 'apoios', [d2 + 2, 6, ZPL - 2, d2 + 4, 36, ZPL], { grain: 'y', step: 3, u: 'apPr' });
  add('apCE', 'Apoio da prateleira', 'apoios', [d1 + 2, 6, ZPR - 2, d1 + 4, 36, ZPR], { grain: 'y', step: 3, u: 'apPr' });
  add('apCD', 'Apoio da prateleira', 'apoios', [d2 - 2, 6, ZPR - 2, d2, 36, ZPR], { grain: 'y', step: 3, u: 'apPr' });
  add('apGE', 'Apoio do piso da gaveta', 'apoios', [d1 + 2, 4, 37, d1 + 4, 36, 39], { grain: 'y', step: 2, u: 'apPr' });
  add('apGD', 'Apoio do piso da gaveta', 'apoios', [d2 - 2, 4, 37, d2, 36, 39], { grain: 'y', step: 2, u: 'apPr' });
  // batentes das portas, colados na face da divisória, atrás da porta
  add('batE', 'Batente da porta', 'apoios', [d1 - 1.5, 2, 16, d1, 3, 47], { grain: 'z', step: 4, u: 'bat' });
  add('batD', 'Batente da porta', 'apoios', [d2 + 2, 2, 16, d2 + 3.5, 3, 47], { grain: 'z', step: 4, u: 'bat' });
  // sarrafos do topo
  add('sfF', 'Sarrafo do topo', 'apoios', [4, 2, ZC - 3, L - 4, 5, ZC], { step: 3, u: 'sfTopo' });
  add('sfT', 'Sarrafo do topo', 'apoios', [4, 35, ZC - 3, L - 4, 38, ZC], { step: 3, u: 'sfTopo' });
  // prateleiras soltas (tábua de 30 inteira)
  add('prE', 'Prateleira', 'prateleiras', [2.5, 6, ZPL, d1 - 0.2, 36, ZPL + 2], { step: 3, ex: [0, -1, 0], u: 'pratL' });
  add('prD', 'Prateleira', 'prateleiras', [d2 + 2.2, 6, ZPL, L - 2.5, 36, ZPL + 2], { step: 3, ex: [0, -1, 0], u: 'pratL' });
  add('prC', 'Prateleira do nicho', 'prateleiras', [d1 + 2.2, 6, ZPR, d2 - 0.2, 36, ZPR + 2], { step: 3, ex: [0, -1, 0], u: 'pratC' });
  // fundo: tábuas com veio em pé, fresta de 2 mm; furo para os fios atrás do nicho
  const nF = Math.ceil(L / 28), wF = (L - 0.2 * (nF - 1)) / nF, FUNDO = [];
  for (let i = 0; i < nF; i++) { const a = i * (wF + 0.2); FUNDO.push([a, a + wF]); add('fundo' + i, 'Tábua do fundo', 'fundo', [a, 40, ZF, a + wF, 42, ZC], { grain: 'z', step: 3, ex: [0, 1, 0], u: 'fundo' }); }
  // topo com beiral de 3 cm na frente e nos lados
  add('topo', 'Topo', 'chapeu', [-3, -3, ZC, L + 3, D, H], { step: 5, ex: [0, 0, 1], round: 0.6 });

  // portas almofadadas (iguais às do guarda-roupa, com uma almofada)
  const DOORS = [{ x0: 4.2, x1: d1 - 0.2, side: 'L' }, { x0: d2 + 2.2, x1: L - 4.2, side: 'R' }];
  DOORS.forEach((d, k) => {
    d.i = k; d.w = r1(d.x1 - d.x0); d.hinge = d.side === 'R' ? d.x1 + 0.1 : d.x0 - 0.1;
    const o = { step: 4, door: k + 1 }, s = String(k + 1), a = d.x0 + ST, c = d.x1 - ST, za = ZD[0] + RL, zc = ZD[1] - RL;
    add('pMontE' + s, 'Montante da porta', 'porta', [d.x0, 0, ZD[0], a, 2, ZD[1]], { ...o, grain: 'z', u: 'pMont' });
    add('pMontD' + s, 'Montante da porta', 'porta', [c, 0, ZD[0], d.x1, 2, ZD[1]], { ...o, grain: 'z', u: 'pMont' });
    add('pTrInf' + s, 'Travessa da porta', 'porta', [a, 0, ZD[0], c, 2, za], { ...o, u: 'pTr' });
    add('pTrSup' + s, 'Travessa da porta', 'porta', [a, 0, zc, c, 2, ZD[1]], { ...o, u: 'pTr' });
    add('alm' + s, 'Almofada da porta', 'porta', [a - 1.5, 2, za - 1.5, c + 1.5, 4, zc + 1.5], { ...o, u: 'alm' });
    add(`mo${s}1`, 'Moldura', 'moldura', [a, 1, za, c, 2, za + 1], { ...o, u: 'mold', thin: 1 });
    add(`mo${s}2`, 'Moldura', 'moldura', [a, 1, zc - 1, c, 2, zc], { ...o, u: 'mold', thin: 1 });
    add(`mo${s}3`, 'Moldura', 'moldura', [a, 1, za + 1, a + 1, 2, zc - 1], { ...o, grain: 'z', u: 'mold', thin: 1 });
    add(`mo${s}4`, 'Moldura', 'moldura', [c - 1, 1, za + 1, c, 2, zc - 1], { ...o, grain: 'z', u: 'mold', thin: 1 });
  });
  const DOOR_OPEN = [[r1(ZD[0] + RL), r1(ZD[1] - RL)]];

  // gaveta do meio, rasa (controles), correndo sobre o piso da gaveta
  const gx0 = d1 + 2.4, gx1 = d2 - 0.4, og = { step: 4, drawer: 1 };
  add('gF', 'Frente da gaveta', 'gaveta', [d1 + 2.2, 0, ZG[0], d2 - 0.2, 2, ZG[1]], { ...og, u: 'gF' });
  add('gLE', 'Lateral da gaveta', 'gaveta', [gx0, 2, 41.6, gx0 + 1.5, 34, 47.6], { ...og, grain: 'y', u: 'gL' });
  add('gLD', 'Lateral da gaveta', 'gaveta', [gx1 - 1.5, 2, 41.6, gx1, 34, 47.6], { ...og, grain: 'y', u: 'gL' });
  add('gT', 'Traseira da gaveta', 'gaveta', [gx0 + 1.5, 32.5, 41.6, gx1 - 1.5, 34, 46.6], { ...og, u: 'gT' });
  add('gFu', 'Fundo da gaveta', 'gaveta', [gx0, 2, 41, gx1, 34, 41.6], { ...og, m: 'comp', u: 'gFu' });
  const DRAWERS = [{ x0: d1 + 2.2, x1: d2 - 0.2, gx0, gx1, bay: 1 }];

  const PARTS = P;
  const PULLS = [{ x: r1((d1 + 2 + d2) / 2), z: 45, drawer: 1 }];
  // tramela de ferro na frente de cada divisória, girando por cima do montante da porta
  const LATCHES = [{ x: d1, px: d1 + 1, z: ZLATCH, dir: -1, on: 0 }, { x: d2 + 2, px: d2 + 1, z: ZLATCH, dir: 1, on: 0 }];

  // ---------- parafusos ----------
  const SCREWS = [], S = (a, b, t) => SCREWS.push({ a: a.map(r1), b: b.map(r1), t });
  const spread = (a, c, step = 18) => { const n = Math.max(2, Math.round((c - a) / step)); return Array.from({ length: n }, (_, i) => a + (c - a) * (i + 0.5) / n); };
  for (const [x, xo] of [[4, 0.5], [L - 4, L - 0.5]]) { [10, 20, 30].forEach(y => { S([x, y, 11], [xo, y, 11], 'm30'); S([x, y, ZPL - 1], [xo, y, ZPL - 1], 'm30'); }); }
  spread(4, L - 4).forEach(x => { S([x, 4, 11], [x, 0.5, 11], 'm30'); S([x, 3, 14], [x, 3, 11], 'm30'); S([x, 5, ZC - 1.5], [x, 1, ZC - 1.5], 'm40'); S([x, 35, ZC - 1.5], [x, 39, ZC - 1.5], 'm40'); S([x, 3.5, ZC - 3], [x, 3.5, ZC + 1], 'm40'); S([x, 36.5, ZC - 3], [x, 36.5, ZC + 1], 'm40'); });
  for (const d of [d1, d2]) { [8, 22, 34].forEach(y => S([d + 1, y, 12], [d + 1, y, 17], 'm40')); }      // divisórias por baixo, pelo piso
  [10, 20, 30].forEach(y => { S([3, y, 14], [3, y, 11], 'm30'); S([L - 3, y, 14], [L - 3, y, 11], 'm30'); });
  for (const [x0, x1] of [[d1 - 2, d1 + 0.5], [d2 + 4, d2 + 1.5], [d1 + 4, d1 + 1.5], [d2 - 2, d2 + 0.5]]) [12, 28].forEach(y => S([x0, y, x0 < d1 + 1 || x0 > d2 + 1 ? ZPL - 1 : ZPR - 1], [x1, y, x0 < d1 + 1 || x0 > d2 + 1 ? ZPL - 1 : ZPR - 1], 'm30'));
  for (const [x0, x1] of [[d1 + 4, d1 + 1.5], [d2 - 2, d2 + 0.5]]) [12, 28].forEach(y => S([x0, y, 38], [x1, y, 38], 'm30'));
  for (const [x, xo] of [[gx0, gx0 + 4], [gx1, gx1 - 4]]) S([x, 33, 44], [xo, 33, 44], 'm30');
  FUNDO.forEach(([a, c]) => { const m = (a + c) / 2; for (const z of [12, ZC - 2]) S([m, 42, z], [m, 39, z], 'vis30'); });
  for (const x of [2, L - 2]) [20, 40].forEach(z => S([x, 42, z], [x, 38, z], 'vis40'));

  let wood = 0;
  PARTS.forEach(p => { if (p.m === 'madeira') { const [a, b, c, d, e, f] = p.b; wood += (d - a) * (e - b) * (f - c); } });
  const moldLen = PARTS.filter(p => p.u === 'mold').reduce((s, p) => { const [a, b, c, d, e, f] = p.b; return s + Math.max(d - a, e - b, f - c); }, 0) / 100;
  return {
    v, ...V, kind: 'rk', hw: { hinge: 'butterfly', pull: 'concha', latch: 'iron' },
    L, D, H, DIM, ZC, ZD, ZG, ZPR, ZPL, ZF, HINGES, ZLATCH, ST, RL, d1, d2,
    bays, DOORS, DOOR_OPEN, DRAWERS, FUNDO, PARTS, SCREWS, PULLS, DOOR_PULLS: [], LATCHES,
    stats: { kgWood: wood * 0.62 / 1000, kg: wood * 0.62 / 1000, moldLen, nScrews: SCREWS.length },
  };
}
