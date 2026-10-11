// Buffet Antique (150 e 110 cm): todas as peças em cm, geradas a partir da versão escolhida.
// Eixos: x = largura (0 à esquerda, olhando de frente), y = profundidade (0 na frente), z = altura (0 no chão).
// 90 de altura e 45 de fundo. Cada vão tem uma gaveta em cima e uma porta almofadada embaixo, com prateleira.
// Mesma construção da linha: colunas 4 × 4 com pés de 10 cm, laterais inteiras com veio em pé, cavilhas e topo com beiral.
// Ferragens de época: dobradiça rústica de ferro (a do guarda-roupa), puxador concha nas gavetas e argola nas portas.

const VARIANTS = {
  150: { L: 150, name: 'Buffet Antique 150', short: '150 cm', nb: 3 },
  110: { L: 110, name: 'Buffet Antique 110', short: '110 cm', nb: 2 },
};

export function make(v = 150) {
  const V = VARIANTS[v]; if (!V) throw new Error('versão ' + v);
  const L = V.L, D = 45, H = 90, nb = V.nb;
  const DIM = { L, P: D, H, LT: L + 6, PT: D + 3 };
  const r1 = n => Math.round(n * 100) / 100;
  const ZC = H - 2;                    // topo das colunas (88)
  const ZF = 10;                       // pés: 10 cm livres embaixo
  const ZD = [14.2, 68.8];             // portas
  const ZG = [72.2, 84.8];             // frentes das gavetas
  const ZPR = 40;                      // prateleira atrás das portas
  const HINGES = [22, 61], ST = 7, RL = 7;
  const YB = 39;                       // face da frente das colunas de trás
  // vãos iguais, separados por divisórias de 2 cm
  const bw = (L - 8 - 2 * (nb - 1)) / nb;
  const bays = Array.from({ length: nb }, (_, i) => { const x0 = 4 + i * (bw + 2); return { k: String(i + 1), x0: r1(x0), x1: r1(x0 + bw), w: r1(bw), cx: r1(x0 + bw / 2) }; });
  const divs = bays.slice(0, -1).map(b => b.x1);

  const P = [];
  const add = (id, n, g, b, o = {}) => P.push({ id, n, g, b: b.map(r1), m: 'madeira', grain: 'x', step: 0, ex: [0, 0, 1], ...o });

  // colunas 4 × 4 do chão ao topo (os 10 cm de baixo são os pés)
  add('colFE', 'Coluna', 'colunas', [0, 0, 0, 4, 4, ZC], { grain: 'z', ex: [-1, -1, 0], u: 'col' });
  add('colFD', 'Coluna', 'colunas', [L - 4, 0, 0, L, 4, ZC], { grain: 'z', ex: [1, -1, 0], u: 'col' });
  add('colTE', 'Coluna', 'colunas', [0, YB, 0, 4, YB + 4, ZC], { grain: 'z', ex: [-1, 1, 0], u: 'col' });
  add('colTD', 'Coluna', 'colunas', [L - 4, YB, 0, L, YB + 4, ZC], { grain: 'z', ex: [1, 1, 0], u: 'col' });
  // laterais inteiras com veio em pé
  add('latE', 'Lateral', 'laterais', [0, 4, ZF, 2, YB, ZC], { grain: 'z', step: 1, ex: [-1, 0, 0], u: 'lat' });
  add('latD', 'Lateral', 'laterais', [L - 2, 4, ZF, L, YB, ZC], { grain: 'z', step: 1, ex: [1, 0, 0], u: 'lat' });
  // travessas da frente e de trás (inteiras, de coluna a coluna)
  add('tfInf', 'Rodapé da frente', 'travessas', [4, 0, ZF, L - 4, 2, 14], { step: 1, ex: [0, -1, 0], u: 'tfInf' });
  add('tfSup', 'Travessa de cima (frente)', 'travessas', [4, 0, 85, L - 4, 2, ZC], { step: 1, ex: [0, -1, 0], u: 'tfSup' });
  add('ttInf', 'Travessa de baixo (trás)', 'travessas', [4, YB + 2, ZF, L - 4, YB + 4, 14], { step: 1, ex: [0, 1, 0], u: 'ttInf' });
  add('ttSup', 'Travessa de cima (trás)', 'travessas', [4, YB + 2, 85, L - 4, YB + 4, ZC], { step: 1, ex: [0, 1, 0], u: 'ttSup' });
  // piso inteiro e divisórias em pé sobre ele
  add('piso', 'Piso', 'pisos', [2, 2, 12, L - 2, YB + 2, 14], { step: 2, ex: [0, 0, -1], u: 'piso' });
  divs.forEach((d, i) => add('div' + i, 'Divisória', 'divisorias', [d, 0, 14, d + 2, YB + 2, 85], { grain: 'z', step: 2, ex: [0, 0, 1], u: 'div' }));
  // montante de 5 cm na frente de cada divisória: é onde a dobradiça da porta do meio e o fecho da vizinha se apoiam
  divs.forEach((d, i) => add('mont' + i, 'Montante da frente', 'travessas', [d - 1.5, 0, 14, d + 3.5, 2, 85], { grain: 'z', step: 2, ex: [0, -1, 0], u: 'mont' }));
  for (const [k, a, c] of [['E', 2, 4], ['D', L - 4, L - 2]]) add('apP' + k, 'Apoio do piso', 'apoios', [a, 4, ZF, c, YB, 12], { grain: 'y', step: 2, u: 'apPiso' });
  add('apPF', 'Apoio do piso', 'apoios', [4, 2, ZF, L - 4, 4, 12], { step: 2, u: 'apPisoF' });
  // em cada vão: travessa entre gaveta e porta, piso da gaveta, apoios, prateleira e batente
  const DOORS = [], DRAWERS = [], PULLS = [], DOOR_PULLS = [];
  const sides = nb === 3 ? ['L', 'R', 'R'] : ['L', 'R'];
  bays.forEach((b, i) => {
    const s = b.k, sa = b.x0 === 4 ? 2 : b.x0, sb = b.x1 === L - 4 ? L - 2 : b.x1;   // face onde os apoios encostam (lateral ou divisória)
    add('tfG' + s, 'Travessa da gaveta', 'travessas', [b.x0, 0, 69, b.x1, 2, 72], { step: 2, ex: [0, -1, 0], u: 'tfGav' });
    add('pisoG' + s, 'Piso da gaveta', 'pisos', [b.x0, 2, 70, b.x1, YB + 2, 72], { step: 2, ex: [0, 0, -1], u: 'pisoG' });
    add('apGE' + s, 'Apoio do piso da gaveta', 'apoios', [sa === 2 ? 2 : b.x0, 4, 68, (sa === 2 ? 2 : b.x0) + 2, YB, 70], { grain: 'y', step: 2, u: 'apPr' });
    add('apGD' + s, 'Apoio do piso da gaveta', 'apoios', [(sb === L - 2 ? L - 2 : b.x1) - 2, 4, 68, sb === L - 2 ? L - 2 : b.x1, YB, 70], { grain: 'y', step: 2, u: 'apPr' });
    add('apLE' + s, 'Apoio da prateleira', 'apoios', [sa === 2 ? 2 : b.x0, 6, ZPR - 2, (sa === 2 ? 2 : b.x0) + 2, YB, ZPR], { grain: 'y', step: 3, u: 'apPr' });
    add('apLD' + s, 'Apoio da prateleira', 'apoios', [(sb === L - 2 ? L - 2 : b.x1) - 2, 6, ZPR - 2, sb === L - 2 ? L - 2 : b.x1, YB, ZPR], { grain: 'y', step: 3, u: 'apPr' });
    add('pr' + s, 'Prateleira', 'prateleiras', [b.x0 + (b.x0 === 4 ? -1.5 : 0.2), 6, ZPR, b.x1 - (b.x1 === L - 4 ? -1.5 : 0.2), YB, ZPR + 2], { step: 3, ex: [0, -1, 0], u: 'prat' });
    // porta almofadada
    const fx0 = b.x0 + 0.2 + (b.x0 === 4 ? 0 : 1.5), fx1 = b.x1 - 0.2 - (b.x1 === L - 4 ? 0 : 1.5);   // vão livre na frente (descontando os montantes)
    const side = sides[i], d = { x0: r1(fx0), x1: r1(fx1), side, i };
    d.w = r1(d.x1 - d.x0); d.hinge = side === 'R' ? d.x1 + 0.1 : d.x0 - 0.1; DOORS.push(d);
    const o = { step: 4, door: i + 1 }, a = d.x0 + ST, c = d.x1 - ST, za = ZD[0] + RL, zc = ZD[1] - RL;
    add('pMontE' + s, 'Montante da porta', 'porta', [d.x0, 0, ZD[0], a, 2, ZD[1]], { ...o, grain: 'z', u: 'pMont' });
    add('pMontD' + s, 'Montante da porta', 'porta', [c, 0, ZD[0], d.x1, 2, ZD[1]], { ...o, grain: 'z', u: 'pMont' });
    add('pTrInf' + s, 'Travessa da porta', 'porta', [a, 0, ZD[0], c, 2, za], { ...o, u: 'pTr' });
    add('pTrSup' + s, 'Travessa da porta', 'porta', [a, 0, zc, c, 2, ZD[1]], { ...o, u: 'pTr' });
    add('alm' + s, 'Almofada da porta', 'porta', [a - 1.5, 2, za - 1.5, c + 1.5, 4, zc + 1.5], { ...o, grain: 'z', u: 'alm' });
    add(`mo${s}1`, 'Moldura', 'moldura', [a, 1, za, c, 2, za + 1], { ...o, u: 'mold', thin: 1 });
    add(`mo${s}2`, 'Moldura', 'moldura', [a, 1, zc - 1, c, 2, zc], { ...o, u: 'mold', thin: 1 });
    add(`mo${s}3`, 'Moldura', 'moldura', [a, 1, za + 1, a + 1, 2, zc - 1], { ...o, grain: 'z', u: 'mold', thin: 1 });
    add(`mo${s}4`, 'Moldura', 'moldura', [c - 1, 1, za + 1, c, 2, zc - 1], { ...o, grain: 'z', u: 'mold', thin: 1 });
    // batente atrás da borda livre da porta
    const bx = side === 'L' ? [d.x1 - 1.3, d.x1 + 1.7] : [d.x0 - 1.7, d.x0 + 1.3];
    add('bat' + s, 'Batente da porta', 'apoios', [bx[0], 2, 16, bx[1], 3, 66], { grain: 'z', step: 4, u: 'bat' });
    DOOR_PULLS.push({ door: i + 1, x: r1(side === 'L' ? d.x1 - 3.5 : d.x0 + 3.5), z: 44 });
    // gaveta, correndo sobre o piso da gaveta
    const gx0 = fx0 + 0.2, gx1 = fx1 - 0.2, og = { step: 4, drawer: i + 1 };
    add('gF' + s, 'Frente da gaveta', 'gaveta', [fx0, 0, ZG[0], fx1, 2, ZG[1]], { ...og, u: 'gF' });
    add('gLE' + s, 'Lateral da gaveta', 'gaveta', [gx0, 2, 72.6, gx0 + 1.5, 38, 83.6], { ...og, grain: 'y', u: 'gL' });
    add('gLD' + s, 'Lateral da gaveta', 'gaveta', [gx1 - 1.5, 2, 72.6, gx1, 38, 83.6], { ...og, grain: 'y', u: 'gL' });
    add('gT' + s, 'Traseira da gaveta', 'gaveta', [gx0 + 1.5, 36.5, 72.6, gx1 - 1.5, 38, 82.6], { ...og, u: 'gT' });
    add('gFu' + s, 'Fundo da gaveta', 'gaveta', [gx0, 2, 72, gx1, 38, 72.6], { ...og, m: 'comp', u: 'gFu' });
    DRAWERS.push({ x0: fx0, x1: fx1, gx0, gx1, bay: i });
    PULLS.push({ x: b.cx, z: 78.5, drawer: i + 1 });
  });
  // sarrafos do topo
  add('sfF', 'Sarrafo do topo', 'apoios', [4, 2, ZC - 3, L - 4, 5, ZC], { step: 3, u: 'sfTopo' });
  add('sfT', 'Sarrafo do topo', 'apoios', [4, YB - 1, ZC - 3, L - 4, YB + 2, ZC], { step: 3, u: 'sfTopo' });
  // fundo: tábuas com veio em pé, fresta de 2 mm
  const nF = Math.ceil(L / 28), wF = (L - 0.2 * (nF - 1)) / nF, FUNDO = [];
  for (let i = 0; i < nF; i++) { const a = i * (wF + 0.2); FUNDO.push([a, a + wF]); add('fundo' + i, 'Tábua do fundo', 'fundo', [a, YB + 4, ZF, a + wF, D, ZC], { grain: 'z', step: 3, ex: [0, 1, 0], u: 'fundo' }); }
  // topo com beiral de 3 cm na frente e nos lados
  add('topo', 'Topo', 'chapeu', [-3, -3, ZC, L + 3, D, H], { step: 5, ex: [0, 0, 1], round: 0.6 });
  const DOOR_OPEN = [[r1(ZD[0] + RL), r1(ZD[1] - RL)]];
  const PARTS = P, LATCHES = [];

  // ---------- parafusos ----------
  const SCREWS = [], S = (a, b, t) => SCREWS.push({ a: a.map(r1), b: b.map(r1), t });
  const spread = (a, c, step = 18) => { const n = Math.max(2, Math.round((c - a) / step)); return Array.from({ length: n }, (_, i) => a + (c - a) * (i + 0.5) / n); };
  for (const [x, xo] of [[4, 0.5], [L - 4, L - 0.5]]) [10, 22, 34].forEach(y => { S([x, y, 11], [xo, y, 11], 'm30'); S([x, y, ZPR - 1], [xo, y, ZPR - 1], 'm30'); S([x, y, 69], [xo, y, 69], 'm30'); });
  spread(4, L - 4).forEach(x => { S([x, 4, 11], [x, 0.5, 11], 'm30'); S([x, 3, 14], [x, 3, 11], 'm30'); S([x, 5, ZC - 1.5], [x, 1, ZC - 1.5], 'm40'); S([x, YB - 1, ZC - 1.5], [x, YB + 3, ZC - 1.5], 'm40'); S([x, 3.5, ZC - 3], [x, 3.5, ZC + 1], 'm40'); S([x, YB + 0.5, ZC - 3], [x, YB + 0.5, ZC + 1], 'm40'); });
  divs.forEach(d => { [8, 22, 36].forEach(y => S([d + 1, y, 12], [d + 1, y, 17], 'm40')); [[d - 2, d + 0.5], [d + 4, d + 1.5]].forEach(([x0, x1]) => [12, 30].forEach(y => { S([x0, y, ZPR - 1], [x1, y, ZPR - 1], 'm30'); S([x0, y, 69], [x1, y, 69], 'm30'); })); });
  DRAWERS.forEach(dr => { for (const [x, xo] of [[dr.gx0, dr.gx0 + 4], [dr.gx1, dr.gx1 - 4]]) S([x, 37, 78], [xo, 37, 78], 'm30'); });
  FUNDO.forEach(([a, c]) => { const m = (a + c) / 2; for (const z of [12, 50, ZC - 2]) S([m, D, z], [m, YB + 2, z], 'vis30'); });
  for (const x of [2, L - 2]) [25, 60].forEach(z => S([x, D, z], [x, YB + 1, z], 'vis40'));

  let wood = 0;
  PARTS.forEach(p => { if (p.m === 'madeira') { const [a, b, c, d, e, f] = p.b; wood += (d - a) * (e - b) * (f - c); } });
  const moldLen = PARTS.filter(p => p.u === 'mold').reduce((s, p) => { const [a, b, c, d, e, f] = p.b; return s + Math.max(d - a, e - b, f - c); }, 0) / 100;
  return {
    v, ...V, kind: 'bf', hw: { hinge: 'flag', pull: 'concha', latch: 'none' },
    L, D, H, DIM, ZC, ZD, ZG, ZPR, ZF, HINGES, ST, RL, YB, divs,
    bays, DOORS, DOOR_OPEN, DRAWERS, FUNDO, PARTS, SCREWS, PULLS, DOOR_PULLS, LATCHES,
    stats: { kgWood: wood * 0.62 / 1000, kg: wood * 0.62 / 1000, moldLen, nScrews: SCREWS.length },
  };
}
