// Guarda-Roupa Veio (2 e 4 portas): todas as peças em cm, geradas a partir da versão escolhida.
// Eixos: x = largura (0 à esquerda, olhando de frente), y = profundidade (0 na frente), z = altura (0 no chão).
// As duas têm 200 de altura e 58 de profundidade (cabide de frente). 2 portas: 130 de largura; 4 portas: 200.
// Embaixo, base com sapatas, 3 gavetas por vão (uma larga e duas pequenas) e cinta; em cima, portas almofadadas e chapéu.

const VARIANTS = {
  2: { L: 130, name: 'Guarda-Roupa Veio 2 Portas', short: '2 portas', nd: 2 },
  4: { L: 200, name: 'Guarda-Roupa Veio 4 Portas', short: '4 portas', nd: 4 },
};

export function make(v = 2) {
  const V = VARIANTS[v]; if (!V) throw new Error('versão ' + v);
  const L = V.L, D = 58, H = 200, CW = 8;
  const DIM = { L, P: D, H, LT: L + 6, PT: D + 3 };
  const r1 = n => Math.round(n * 100) / 100;

  // ---------- alturas ----------
  const ZC = H - 2;                 // topo das colunas (198)
  const ZP = 12;                    // topo das sapatas e do rodapé
  const ZG1 = [12.2, 26.8];         // frente da gaveta larga
  const ZG2 = [30.2, 42.8];         // frentes das gavetas pequenas
  const ZCI = [43, 47];             // cinta (travessa da frente + friso que sai 2 cm)
  const ZD = [47.2, ZC - 10.2];     // portas: 47,2 a 187,8
  const RB = 10, RT = 10, RM = 10, ST = 8; // travessas e montantes das portas
  const pBot = 51.3;                // vão de baixo da porta
  const ZM = r1(ZD[0] + RB + pBot);  // base da travessa do meio da porta
  const DOOR_OPEN = [[r1(ZD[0] + RB), ZM], [r1(ZM + RM), r1(ZD[1] - RT)]];
  const ZS = [82, 117, 152];        // prateleiras (apoio de 2 embaixo); a de 152 é também o maleiro do cabideiro
  const ZROD = 143;                 // varão (base), 3 cm de diâmetro
  const HINGES = [60, 113.5, 175];
  const ZPULL = 113.5;

  // ---------- vãos ----------
  const bays = v === 4
    ? [{ x0: 4, x1: L / 2 - CW / 2, bl: [2, 4], br: [L / 2 - CW / 2, L / 2 - 1] }, { x0: L / 2 + CW / 2, x1: L - 4, bl: [L / 2 + 1, L / 2 + CW / 2], br: [L - 4, L - 2] }]
    : [{ x0: 4, x1: L - 4, bl: [2, 4], br: [L - 4, L - 2] }];
  bays.forEach((b, i) => { b.i = i; b.w = b.x1 - b.x0; b.cx = (b.x0 + b.x1) / 2; });

  const P = [];
  const add = (id, n, g, b, o = {}) => P.push({ id, n, g, b: b.map(r1), m: 'madeira', grain: 'x', step: 0, ex: [0, 0, 1], ...o });

  // Colunas 4 × 4 (2 ripas coladas), do chão ao topo; na de 4 portas, coluna central de 8 × 4 na frente e atrás
  add('colFE', 'Coluna', 'colunas', [0, 0, 0, 4, 4, ZC], { grain: 'z', ex: [-1, -1, 0], u: 'col' });
  add('colFD', 'Coluna', 'colunas', [L - 4, 0, 0, L, 4, ZC], { grain: 'z', ex: [1, -1, 0], u: 'col' });
  add('colTE', 'Coluna', 'colunas', [0, 52, 0, 4, 56, ZC], { grain: 'z', ex: [-1, 1, 0], u: 'col' });
  add('colTD', 'Coluna', 'colunas', [L - 4, 52, 0, L, 56, ZC], { grain: 'z', ex: [1, 1, 0], u: 'col' });
  if (v === 4) {
    add('colFC', 'Coluna central', 'colunas', [L / 2 - CW / 2, 0, 0, L / 2 + CW / 2, 4, ZC], { grain: 'z', ex: [0, -1, 0], u: 'colC' });
    add('colTC', 'Coluna central', 'colunas', [L / 2 - CW / 2, 52, 0, L / 2 + CW / 2, 56, ZC], { grain: 'z', ex: [0, 1, 0], u: 'colC' });
  }
  // Laterais inteiras: tábuas com veio em pé coladas entre as colunas (mexem junto com elas)
  add('latE', 'Lateral', 'laterais', [0, 4, 4, 2, 52, ZC], { grain: 'z', step: 1, ex: [-1, 0, 0], u: 'lat' });
  add('latD', 'Lateral', 'laterais', [L - 2, 4, 4, L, 52, ZC], { grain: 'z', step: 1, ex: [1, 0, 0], u: 'lat' });
  if (v === 4) add('divC', 'Divisória central', 'laterais', [L / 2 - 1, 4, 4, L / 2 + 1, 52, ZC], { grain: 'z', step: 1, ex: [0, 0, 1], u: 'divC' });

  // Por vão: travessas, pisos, apoios, guias, divisória das gavetas, sarrafos do topo
  bays.forEach(b => {
    const s = bays.length > 1 ? String(b.i + 1) : '';
    const { x0, x1, bl, br, cx } = b;
    add('tfInf' + s, 'Travessa de baixo (frente)', 'travessas', [x0, 0, 8, x1, 2, 12], { step: 1, ex: [0, -1, 0], u: 'tfInf' });
    add('tfMei' + s, 'Travessa entre as gavetas', 'travessas', [x0, 0, 27, x1, 2, 30], { step: 1, ex: [0, -1, 0], u: 'tfMei' });
    add('tfCin' + s, 'Travessa da cinta', 'travessas', [x0, 0, ZCI[0], x1, 2, ZCI[1]], { step: 1, ex: [0, -1, 0], u: 'tfCin' });
    add('tfSup' + s, 'Travessa de cima (frente)', 'travessas', [x0, 0, ZC - 10, x1, 2, ZC], { step: 1, ex: [0, -1, 0], u: 'tfSup' });
    add('mGav' + s, 'Montante entre as gavetas', 'travessas', [cx - 2, 0, 30, cx + 2, 2, ZCI[0]], { step: 1, grain: 'z', ex: [0, -1, 0], u: 'mGav' });
    add('ttInf' + s, 'Travessa de baixo (trás)', 'travessas', [x0, 54, 8, x1, 56, 12], { step: 1, ex: [0, 1, 0], u: 'ttInf' });
    add('ttSup' + s, 'Travessa de cima (trás)', 'travessas', [x0, 54, ZC - 10, x1, 56, ZC], { step: 1, ex: [0, 1, 0], u: 'ttSup' });
    // pisos (gaveta larga, gavetas pequenas e chão do armário)
    add('pisoA' + s, 'Piso da gaveta larga', 'pisos', [bl[0], 2, 10, br[1], 54, 12], { step: 2, ex: [0, 0, -1], u: 'pisoG' });
    add('pisoB' + s, 'Piso das gavetas pequenas', 'pisos', [bl[0], 2, 28, br[1], 54, 30], { step: 2, ex: [0, 0, -1], u: 'pisoG' });
    add('pisoC' + s, 'Piso do armário', 'pisos', [bl[0], 2, 45, br[1], 56, 47], { step: 2, ex: [0, 0, -1], u: 'pisoC' });
    for (const [k, [a, c]] of [['E', bl], ['D', br]]) {
      const cen = c - a > 2.5;
      for (const [z, nm] of [[8, 'A'], [26, 'B'], [43, 'C']]) add(`ap${nm}${s}${k}`, 'Apoio do piso', 'apoios', [a, 4, z, c, 52, z + 2], { grain: 'y', step: 2, u: cen ? 'apPisoC' : 'apPiso' });
      add(`gu1${s}${k}`, 'Guia da gaveta', 'apoios', [a, 4, 12, c, 52, 16], { grain: 'y', step: 2, u: cen ? 'guiaC' : 'guia' });
      add(`gu2${s}${k}`, 'Guia da gaveta', 'apoios', [a, 4, 30, c, 52, 34], { grain: 'y', step: 2, u: cen ? 'guiaC' : 'guia' });
      add(`sl${s}${k}`, 'Sarrafo do topo (lado)', 'apoios', [k === 'E' ? a : c - 3, 5, ZC - 3, k === 'E' ? a + 3 : c, 51, ZC], { grain: 'y', step: 3, u: 'sfTopoL' });
    }
    for (const [z, nm] of [[8, 'A'], [26, 'B'], [43, 'C']]) add(`apF${nm}${s}`, 'Apoio do piso', 'apoios', [x0, 2, z, x1, 4, z + 2], { step: 2, u: 'apPisoF' });
    for (const [z, nm] of [[8, 'A'], [26, 'B']]) add(`apT${nm}${s}`, 'Apoio do piso', 'apoios', [x0, 52, z, x1, 54, z + 2], { step: 2, u: 'apPisoF' });
    // divisória entre as gavetas pequenas, com guia dos dois lados
    add('dGav' + s, 'Divisória das gavetas', 'pisos', [cx - 1, 4, 30, cx + 1, 52, 45], { grain: 'y', step: 2, u: 'dGav' });
    add('gdE' + s, 'Guia da gaveta', 'apoios', [cx - 3, 4, 30, cx - 1, 52, 34], { grain: 'y', step: 2, u: 'guia' });
    add('gdD' + s, 'Guia da gaveta', 'apoios', [cx + 1, 4, 30, cx + 3, 52, 34], { grain: 'y', step: 2, u: 'guia' });
    add('batG' + s, 'Batente das gavetas', 'apoios', [cx - 20, 50, 12, cx + 20, 52, 14], { step: 2, u: 'batG' });
    add('sfT' + s, 'Sarrafo do topo', 'apoios', [x0, 2, ZC - 3, x1, 5, ZC], { step: 3, u: 'sfTopoFT' });
    add('stT' + s, 'Sarrafo do topo', 'apoios', [x0, 51, ZC - 3, x1, 54, ZC], { step: 3, u: 'sfTopoFT' });
  });

  // Por dentro: prateleiras de um lado, cabideiro com maleiro do outro
  const shelfZones = [], rodZones = [];
  if (v === 2) {
    const m = L / 2;
    add('divI', 'Divisória interna', 'interno', [m - 1, 5, 47, m + 1, 51, ZC], { grain: 'z', step: 3, ex: [0, -1, 0], u: 'divI' });
    shelfZones.push({ a: [2, 4], c: [m - 3, m - 1], shelves: ZS }); rodZones.push({ a: [m + 1, m + 3], c: [L - 4, L - 2], x0: m + 1, x1: L - 2 });
  } else {
    rodZones.push({ a: bays[0].bl, c: bays[0].br, x0: 2, x1: L / 2 - 1 });
    shelfZones.push({ a: bays[1].bl, c: bays[1].br, shelves: ZS });
  }
  let ni = 0;
  shelfZones.forEach(zn => zn.shelves.forEach(z => {
    ni++;
    add('apPrE' + ni, 'Apoio da prateleira', 'apoios', [zn.a[0], 8, z - 2, zn.a[1], 52, z], { grain: 'y', step: 3, u: zn.a[1] - zn.a[0] > 2.5 ? 'apPrC' : 'apPr' });
    add('apPrD' + ni, 'Apoio da prateleira', 'apoios', [zn.c[0], 8, z - 2, zn.c[1], 52, z], { grain: 'y', step: 3, u: zn.c[1] - zn.c[0] > 2.5 ? 'apPrC' : 'apPr' });
    add('prat' + ni, 'Prateleira', 'interno', [zn.a[0] + 0.5, 8, z, zn.c[1] - 0.5, 54, z + 2], { step: 3, ex: [0, -1, 0], u: 'prat' });
  }));
  rodZones.forEach((zn, i) => {
    add('apMaE' + i, 'Apoio do maleiro', 'apoios', [zn.a[0], 8, ZS[2] - 2, zn.a[1], 52, ZS[2]], { grain: 'y', step: 3, u: zn.a[1] - zn.a[0] > 2.5 ? 'apPrC' : 'apPr' });
    add('apMaD' + i, 'Apoio do maleiro', 'apoios', [zn.c[0], 8, ZS[2] - 2, zn.c[1], 52, ZS[2]], { grain: 'y', step: 3, u: zn.c[1] - zn.c[0] > 2.5 ? 'apPrC' : 'apPr' });
    add('mal' + i, 'Maleiro', 'interno', [zn.a[0] + 0.5, 8, ZS[2], zn.c[1] - 0.5, 54, ZS[2] + 2], { step: 3, ex: [0, -1, 0], u: 'prat' });
    add('rod' + i, 'Varão', 'interno', [zn.x0, 27.5, ZROD, zn.x1, 30.5, ZROD + 3], { step: 3, ex: [0, -1, 0], u: 'rod', cyl: 1 });
  });

  // Fundo: tábuas com veio em pé atrás das colunas, fresta de 2 mm entre elas
  const nF = Math.ceil(L / 28), wF = (L - 0.2 * (nF - 1)) / nF;
  const FUNDO = [];
  for (let i = 0; i < nF; i++) { const a = i * (wF + 0.2); FUNDO.push([a, a + wF]); add('fundo' + i, 'Tábua do fundo', 'fundo', [a, 56, 4, a + wF, 58, ZC], { grain: 'z', step: 3, ex: [0, 1, 0], u: 'fundo' }); }

  // Base: sapatas recortadas e rodapé na frente e nos lados, cinta saindo 2 cm
  const feetX = v === 4 ? [[-2, 12], [L / 2 - 7, L / 2 + 7], [L - 12, L + 2]] : [[-2, 12], [L - 12, L + 2]];
  feetX.forEach(([a, c], i) => add('sapF' + i, 'Sapata da frente', 'base', [a, -2, 0, c, 0, ZP], { step: 1, ex: [0, -1, 0], u: i === 1 && v === 4 ? 'sapC' : 'sapF' }));
  for (let i = 0; i < feetX.length - 1; i++) add('rodF' + i, 'Rodapé da frente', 'base', [feetX[i][1], -2, 4, feetX[i + 1][0], 0, ZP], { step: 1, ex: [0, -1, 0], u: 'rodF' });
  for (const [s, x0, ex] of [['E', -2, -1], ['D', L, 1]]) {
    add('sapL1' + s, 'Sapata do lado', 'base', [x0, 0, 0, x0 + 2, 12, ZP], { grain: 'y', step: 1, ex: [ex, 0, 0], u: 'sapL' });
    add('sapL2' + s, 'Sapata do lado', 'base', [x0, 44, 0, x0 + 2, 58, ZP], { grain: 'y', step: 1, ex: [ex, 0, 0], u: 'sapL' });
    add('rodL' + s, 'Rodapé do lado', 'base', [x0, 12, 4, x0 + 2, 44, ZP], { grain: 'y', step: 1, ex: [ex, 0, 0], u: 'rodL' });
    add('cinL' + s, 'Cinta do lado', 'base', [x0, 0, ZCI[0], x0 + 2, 58, ZCI[1]], { grain: 'y', step: 1, ex: [ex, 0, 0], u: 'cinL' });
  }
  add('cinF', 'Cinta da frente', 'base', [-2, -2, ZCI[0], L + 2, 0, ZCI[1]], { step: 1, ex: [0, -1, 0] });

  // Chapéu: friso de 5 cm em volta e topo com 3 cm de beiral
  add('frisoF', 'Friso da frente', 'chapeu', [-2, -2, ZC - 5, L + 2, 0, ZC], { step: 5, ex: [0, -1, 0.3] });
  add('frisoE', 'Friso do lado', 'chapeu', [-2, 0, ZC - 5, 0, D, ZC], { grain: 'y', step: 5, ex: [-1, 0, 0.3], u: 'frisoL' });
  add('frisoD', 'Friso do lado', 'chapeu', [L, 0, ZC - 5, L + 2, D, ZC], { grain: 'y', step: 5, ex: [1, 0, 0.3], u: 'frisoL' });
  add('topo', 'Topo', 'chapeu', [-3, -3, ZC, L + 3, D, H], { step: 5, ex: [0, 0, 1], round: 0.6 });

  // Portas almofadadas, embutidas (2 mm de folga em volta e entre as duas do par): quadro de 2 cm e almofada parafusada por trás
  const DOORS = [];
  bays.forEach(b => {
    DOORS.push({ x0: b.x0 + 0.2, x1: b.cx - 0.1, side: 'L', bay: b.i, active: 1 });
    DOORS.push({ x0: b.cx + 0.1, x1: b.x1 - 0.2, side: 'R', bay: b.i, passive: 1 });
  });
  DOORS.forEach((d, k) => {
    d.i = k; d.w = r1(d.x1 - d.x0); d.hinge = d.side === 'R' ? d.x1 + 0.1 : d.x0 - 0.1;
    const o = { step: 4, door: k + 1 }, s = String(k + 1), a = d.x0 + ST, c = d.x1 - ST;
    add('pMontE' + s, 'Montante da porta', 'porta', [d.x0, 0, ZD[0], a, 2, ZD[1]], { ...o, grain: 'z', u: 'pMont' });
    add('pMontD' + s, 'Montante da porta', 'porta', [c, 0, ZD[0], d.x1, 2, ZD[1]], { ...o, grain: 'z', u: 'pMont' });
    add('pTrInf' + s, 'Travessa da porta', 'porta', [a, 0, ZD[0], c, 2, ZD[0] + RB], { ...o, u: 'pTr' });
    add('pTrMei' + s, 'Travessa da porta', 'porta', [a, 0, ZM, c, 2, ZM + RM], { ...o, u: 'pTr' });
    add('pTrSup' + s, 'Travessa da porta', 'porta', [a, 0, ZD[1] - RT, c, 2, ZD[1]], { ...o, u: 'pTr' });
    DOOR_OPEN.forEach(([za, zc], i) => {
      add(`alm${s}${i}`, 'Almofada da porta', 'porta', [a - 1.5, 2, za - 1.5, c + 1.5, 4, zc + 1.5], { ...o, grain: 'z', u: i ? 'almA' : 'almB' });
      add(`mo${s}${i}1`, 'Moldura', 'moldura', [a, 1, za, c, 2, za + 1], { ...o, u: 'mold', thin: 1 });
      add(`mo${s}${i}2`, 'Moldura', 'moldura', [a, 1, zc - 1, c, 2, zc], { ...o, u: 'mold', thin: 1 });
      add(`mo${s}${i}3`, 'Moldura', 'moldura', [a, 1, za + 1, a + 1, 2, zc - 1], { ...o, grain: 'z', u: 'mold', thin: 1 });
      add(`mo${s}${i}4`, 'Moldura', 'moldura', [c - 1, 1, za + 1, c, 2, zc - 1], { ...o, grain: 'z', u: 'mold', thin: 1 });
    });
    if (d.passive) add('mj' + s, 'Mata-junta', 'porta', [d.x0 - 1.5, 2, ZD[0] + 3, d.x0 + 2.5, 3, ZD[1] - 3], { ...o, grain: 'z', u: 'mj' });
  });

  // Gavetas: uma larga e duas pequenas por vão, embutidas, correndo sobre os pisos
  const DRAWERS = [];
  bays.forEach(b => {
    const s = bays.length > 1 ? String(b.i + 1) : '';
    const list = [
      { k: 'A', fx: [b.x0 + 0.2, b.x1 - 0.2], bx: [b.x0 + 0.4, b.x1 - 0.4], z: ZG1, zb: 12.6, h: 12, big: 1 },
      { k: 'B', fx: [b.x0 + 0.2, b.cx - 2.2], bx: [b.x0 + 0.4, b.cx - 3.4], z: ZG2, zb: 30.6, h: 11 },
      { k: 'C', fx: [b.cx + 2.2, b.x1 - 0.2], bx: [b.cx + 3.4, b.x1 - 0.4], z: ZG2, zb: 30.6, h: 11 },
    ];
    list.forEach(g => {
      const n = DRAWERS.length + 1, o = { step: 4, drawer: n }, t = s + g.k, [gx0, gx1] = g.bx;
      add('gF' + t, 'Frente da gaveta', 'gaveta', [g.fx[0], 0, g.z[0], g.fx[1], 2, g.z[1]], { ...o, u: g.big ? 'gFA' : 'gFB' });
      add('gLE' + t, 'Lateral da gaveta', 'gaveta', [gx0, 2, g.zb, gx0 + 2, 48, g.zb + g.h], { ...o, grain: 'y', u: g.big ? 'gLA' : 'gLB' });
      add('gLD' + t, 'Lateral da gaveta', 'gaveta', [gx1 - 2, 2, g.zb, gx1, 48, g.zb + g.h], { ...o, grain: 'y', u: g.big ? 'gLA' : 'gLB' });
      add('gT' + t, 'Traseira da gaveta', 'gaveta', [gx0 + 2, 46, g.zb, gx1 - 2, 48, g.zb + g.h - 2], { ...o, u: g.big ? 'gTA' : 'gTB' });
      add('gFu' + t, 'Fundo da gaveta', 'gaveta', [gx0, 2, g.zb - 0.6, gx1, 48, g.zb], { ...o, m: 'comp', u: g.big ? 'gFuA' : 'gFuB' });
      const w = g.fx[1] - g.fx[0], zc = (g.z[0] + g.z[1]) / 2;
      DRAWERS.push({ x0: g.fx[0], x1: g.fx[1], gx0, gx1, zb: g.zb, h: g.h, big: !!g.big, pulls: (g.big ? [g.fx[0] + w * 0.25, g.fx[1] - w * 0.25] : [(g.fx[0] + g.fx[1]) / 2]).map(x => ({ x: r1(x), z: zc })), bay: b.i });
    });
  });

  const PARTS = P;
  const PULLS = DRAWERS.flatMap((d, i) => d.pulls.map(p => ({ ...p, drawer: i + 1 })));
  // puxadores argola das portas (na travessa do meio, junto ao encontro das duas)
  const DOOR_PULLS = DOORS.map(d => ({ door: d.i + 1, x: r1(d.side === 'L' ? d.x1 - 4 : d.x0 + 4), z: ZPULL }));
  // taramelas de madeira: no encontro de cada par, na travessa de cima e na cinta
  const LATCHES = bays.flatMap(b => [{ x: b.cx, z: ZC - 6 }, { x: b.cx, z: (ZCI[0] + ZCI[1]) / 2 }]);

  // ---------- parafusos ----------
  const SCREWS = [];
  const S = (a, b, t) => SCREWS.push({ a: a.map(r1), b: b.map(r1), t });
  const spread = (a, c, step = 16) => { const n = Math.max(3, Math.round((c - a) / step)); return Array.from({ length: n }, (_, i) => a + (c - a) * (i + 0.5) / n); };
  const Y3 = [10, 28, 46];
  // apoios e guias nas laterais/divisória (de dentro para fora)
  bays.forEach(b => {
    for (const [band, head, dir] of [[b.bl, b.bl[1], -1], [b.br, b.br[0], 1]]) {
      const cen = band[1] - band[0] > 2.5, t = cen ? 'm40' : 'm30', tip = head + dir * (cen ? 4 : 3.5), yo = cen && dir > 0 ? 3 : 0;
      for (const z of [9, 27, 44, 14, 32]) Y3.forEach(y => S([head, y + yo, z], [tip, y + yo, z], t));
      const xm = (band[0] + band[1]) / 2;
      for (const z of [12, 30, 47]) Y3.forEach(y => S([xm, y, z], [xm, y, z - 3], 'm30'));
      const sIn = dir < 0 ? band[0] + 3 : band[1] - 3, sx = dir < 0 ? band[0] + 1.5 : band[1] - 1.5;
      [14, 28, 42].forEach(y => { S([sIn, y + yo, ZC - 1.5], [sIn + dir * 4, y + yo, ZC - 1.5], 'm40'); S([sx, y, ZC - 3], [sx, y, ZC + 1], 'm40'); });
    }
    spread(b.x0, b.x1).forEach(x => {
      for (const z of [9, 27, 44]) S([x, 4, z], [x, 0.5, z], 'm30');
      for (const z of [9, 27]) S([x, 52, z], [x, 55.5, z], 'm30');
      for (const z of [12, 30, 47]) S([x, 3, z], [x, 3, z - 3], 'm30');
      S([x, 5, ZC - 1.5], [x, 1, ZC - 1.5], 'm40'); S([x, 51, ZC - 1.5], [x, 55, ZC - 1.5], 'm40');
      S([x, 3.5, ZC - 3], [x, 3.5, ZC + 1], 'm40'); S([x, 52.5, ZC - 3], [x, 52.5, ZC + 1], 'm40');
      S([x, 2, ZC - 2.5], [x, -1, ZC - 2.5], 'm30');       // friso
      S([x, 2, 10], [x, -1, 10], 'm30'); S([x, 2, 45], [x, -1, 45], 'm30'); // rodapé e cinta, por dentro da travessa
    });
    // divisória das gavetas: de baixo pelo piso do meio e de cima pelo piso do armário
    [12, 40].forEach(y => { S([b.cx, y, 28], [b.cx, y, 33], 'm40'); S([b.cx, y, 47], [b.cx, y, 42], 'm40'); });
    // guias da divisória
    for (const [x, xo] of [[b.cx - 3, b.cx + 0.5], [b.cx + 3, b.cx - 0.5]]) Y3.forEach(y => S([x, y + (x > b.cx ? 3 : 0), 32], [xo, y + (x > b.cx ? 3 : 0), 32], 'm30'));
  });
  // apoios das prateleiras e do maleiro
  const solid = x => x < 2 || x > L - 2 || Math.abs(x - L / 2) < 1;
  PARTS.filter(p => p.u === 'apPr' || p.u === 'apPrC').forEach(p => {
    const [a, , z0, c, , z1] = p.b, cen = c - a > 2.5, z = (z0 + z1) / 2;
    const dir = solid(a - 0.5) ? -1 : 1, head = dir < 0 ? c : a, tip = head + dir * (cen ? 4 : 3);
    [14, 30, 46].forEach(y => S([head, y, z], [tip, y, z], cen ? 'm40' : 'm30'));
  });
  // laterais da base (sapatas, rodapé e cinta) pela lateral, de dentro para fora
  for (const [x, xo] of [[2, -1], [L - 2, L + 1]]) { [6, 28, 50].forEach(y => { S([x, y, 8], [xo, y, 8], 'm30'); S([x, y, 45], [xo, y, 45], 'm30'); S([x, y, ZC - 2.5], [xo, y, ZC - 2.5], 'm30'); }); }
  // traseira das gavetas (pela lateral)
  DRAWERS.forEach(d => { for (const [x, xo] of [[d.gx0, d.gx0 + 4], [d.gx1, d.gx1 - 4]]) [d.zb + 3, d.zb + d.h - 5].forEach(z => S([x, 47, z], [xo, 47, z], 'm40')); });
  // fundo: colunas de trás (4 × 40) e travessas de trás (4 × 30, furo oval), de fora
  const backCols = [[0, 4], [L - 4, L]]; if (v === 4) backCols.push([L / 2 - CW / 2, L / 2 + CW / 2]);
  const ZF = [15, 50, 85, 120, 155, 190];
  backCols.forEach(([c0, c1]) => FUNDO.forEach(([a, c]) => { const o0 = Math.max(a, c0), o1 = Math.min(c, c1); if (o1 - o0 >= 1.5) ZF.forEach(z => S([(o0 + o1) / 2, 58, z], [(o0 + o1) / 2, 54, z], 'vis40')); }));
  FUNDO.forEach(([a, c]) => { const m = (a + c) / 2, b = bays.find(b => m > b.x0 + 1 && m < b.x1 - 1); if (b) for (const z of [10, ZC - 5]) S([m, 58, z], [m, 55, z], 'vis30'); });

  // ---------- números ----------
  let wood = 0;
  PARTS.forEach(p => { if (p.m === 'madeira') { const [a, b, c, d, e, f] = p.b; wood += (d - a) * (e - b) * (f - c) * (p.cyl ? 0.785 : 1); } });
  const kgWood = wood * 0.62 / 1000;
  const moldLen = PARTS.filter(p => p.u === 'mold').reduce((s, p) => { const [a, b, c, d, e, f] = p.b; return s + Math.max(d - a, e - b, f - c); }, 0) / 100;
  return {
    v, ...V, kind: 'gr', L, D, H, DIM, CW, ZC, ZD, ZM, ZS, ZROD, ZCI, ZG1, ZG2, DOOR_OPEN, HINGES, ZPULL, ST, RB, RT, RM,
    bays, DOORS, DRAWERS, FUNDO, PARTS, SCREWS, PULLS, DOOR_PULLS, LATCHES, shelfZones, rodZones,
    stats: { kgWood, kg: kgWood, moldLen, nScrews: SCREWS.length },
  };
}
