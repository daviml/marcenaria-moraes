// Cristaleira Antique (linha 1, 2 e 4 portas): todas as peças em cm, geradas a partir da versão escolhida.
// Eixos do projeto: x = largura (0 à esquerda, olhando de frente), y = profundidade (0 na frente), z = altura (0 no chão).
// Todas têm 200 de altura e 40 de profundidade. Muda a largura: 1 porta 50, 2 portas 90, 4 portas 160.
// Cada "vão" é um armário entre duas paredes (lateral ou divisória central), com uma porta ou um par de portas e uma gaveta.

const VARIANTS = {
  1: { L: 50, name: 'Cristaleira Antique', short: '1 porta', slug: 'Cristaleira-Antique', nd: 1 },
  2: { L: 90, name: 'Cristaleira Antique 2 Portas', short: '2 portas', slug: 'Cristaleira-Antique-2-Portas', nd: 2 },
  4: { L: 160, name: 'Cristaleira Antique 4 Portas', short: '4 portas', slug: 'Cristaleira-Antique-4-Portas', nd: 4 },
};

export function make(v = 1) {
  const V = VARIANTS[v]; if (!V) throw new Error('versão ' + v);
  const L = V.L, D = 40, H = 200, CW = 8; // CW: largura da coluna central (só na de 4 portas)
  const DIM = { L, P: D, H, LT: L + 6, PT: 43 };
  const r1 = n => Math.round(n * 100) / 100;

  // ---------- alturas (iguais nas três) ----------
  const ZC = H - 2;                         // topo das colunas (198)
  const ZD = [28.2, ZC - 10.2];             // porta: 28,2 a 187,8
  const ZLS = ZC - 16;                      // travessa de cima da lateral: 182 a 198
  const ZL = [68, 106, 144];                // base das travessas das laterais
  const SIDE_OPEN = [[34, 68], [72, 106], [110, 144], [148, ZLS]];
  const ZPR = ZL.map(z => z + 2);           // prateleiras (2 cm), topo rente ao topo da travessa
  const dh = (ZD[1] - ZD[0] - 6 - 5.8 - 12) / 4; // vão de vidro da porta (33,95)
  const MULL = [0, 1, 2].map(i => r1(ZD[0] + 6 + dh * (i + 1) + 4 * i)); // base das 3 travessas do meio da porta
  const DOOR_OPEN = [0, 1, 2, 3].map(i => [r1(ZD[0] + 6 + (dh + 4) * i), r1(ZD[0] + 6 + (dh + 4) * i + dh)]);
  const HINGES = [44, 108, 172];
  const ZLATCH = 108;

  // ---------- vãos e paredes ----------
  // banda = faixa entre a face da parede e a face da coluna, onde ficam apoios e guias
  const bays = v === 4
    ? [{ x0: 4, x1: L / 2 - CW / 2, bl: [2, 4], br: [L / 2 - CW / 2, L / 2 - 1] }, { x0: L / 2 + CW / 2, x1: L - 4, bl: [L / 2 + 1, L / 2 + CW / 2], br: [L - 4, L - 2] }]
    : [{ x0: 4, x1: L - 4, bl: [2, 4], br: [L - 4, L - 2] }];
  bays.forEach((b, i) => { b.i = i; b.w = b.x1 - b.x0; b.cx = (b.x0 + b.x1) / 2; });

  const P = [];
  const add = (id, n, g, b, o = {}) => P.push({ id, n, g, b: b.map(r1), m: 'madeira', grain: 'x', step: 0, ex: [0, 0, 1], ...o });

  // Colunas 4 × 4 (2 ripas de 4 × 2 coladas), do chão ao topo; na de 4 portas, coluna central de 8 × 4 na frente e atrás
  add('colFE', 'Coluna', 'colunas', [0, 0, 0, 4, 4, ZC], { grain: 'z', ex: [-1, -1, 0], u: 'col' });
  add('colFD', 'Coluna', 'colunas', [L - 4, 0, 0, L, 4, ZC], { grain: 'z', ex: [1, -1, 0], u: 'col' });
  add('colTE', 'Coluna', 'colunas', [0, 34, 0, 4, 38, ZC], { grain: 'z', ex: [-1, 1, 0], u: 'col' });
  add('colTD', 'Coluna', 'colunas', [L - 4, 34, 0, L, 38, ZC], { grain: 'z', ex: [1, 1, 0], u: 'col' });
  if (v === 4) {
    add('colFC', 'Coluna central', 'colunas', [L / 2 - CW / 2, 0, 0, L / 2 + CW / 2, 4, ZC], { grain: 'z', ex: [0, -1, 0], u: 'colC' });
    add('colTC', 'Coluna central', 'colunas', [L / 2 - CW / 2, 34, 0, L / 2 + CW / 2, 38, ZC], { grain: 'z', ex: [0, 1, 0], u: 'colC' });
  }

  // Laterais: painel de baixo, 3 travessas na altura das prateleiras e travessa de cima; vidros com baguete dos dois lados
  for (const [s, x0, ex] of [['E', 0, -1], ['D', L - 2, 1]]) {
    const x1 = x0 + 2;
    add('lInf' + s, 'Painel de baixo da lateral', 'laterais', [x0, 4, 4, x1, 34, 34], { grain: 'y', step: 2, ex: [ex, 0, 0], u: 'lInf' });
    ZL.forEach((z, i) => add(`lTr${i}${s}`, 'Travessa da lateral', 'laterais', [x0, 4, z, x1, 34, z + 4], { grain: 'y', step: 2, ex: [ex, 0, 0], u: 'lTr' }));
    add('lSup' + s, 'Travessa de cima da lateral', 'laterais', [x0, 4, ZLS, x1, 34, ZC], { grain: 'y', step: 2, ex: [ex, 0, 0], u: 'lSup' });
    SIDE_OPEN.forEach(([a, c], i) => {
      add(`vL${i}${s}`, 'Vidro da lateral', 'vidros', [s === 'D' ? x0 + 0.7 : x0 + 1, 4.2, a + 0.2, s === 'D' ? x0 + 1 : x0 + 1.3, 33.8, c - 0.2], { m: 'vidro', step: 2, ex: [ex, 0, 0], u: 'vL' });
      for (const [k, xa, xb] of [['o', x0, x0 + 1], ['i', x0 + 1.3, x0 + 2.3]]) {
        const xo = s === 'D' ? [2 * x0 + 2 - xb, 2 * x0 + 2 - xa] : [xa, xb]; // espelha: baguete de fora sempre na face de fora
        add(`bgL${i}${s}${k}1`, 'Baguete', 'baguetes', [xo[0], 4, a, xo[1], 34, a + 1], { grain: 'y', step: 2, ex: [ex, 0, 0], u: 'bg', thin: 1 });
        add(`bgL${i}${s}${k}2`, 'Baguete', 'baguetes', [xo[0], 4, c - 1, xo[1], 34, c], { grain: 'y', step: 2, ex: [ex, 0, 0], u: 'bg', thin: 1 });
        add(`bgL${i}${s}${k}3`, 'Baguete', 'baguetes', [xo[0], 4, a + 1, xo[1], 5, c - 1], { grain: 'z', step: 2, ex: [ex, 0, 0], u: 'bg', thin: 1 });
        add(`bgL${i}${s}${k}4`, 'Baguete', 'baguetes', [xo[0], 33, a + 1, xo[1], 34, c - 1], { grain: 'z', step: 2, ex: [ex, 0, 0], u: 'bg', thin: 1 });
      }
    });
  }
  // Divisória central (4 portas): painel de baixo, travessas e travessa de cima, sem vidro, no meio da coluna central
  if (v === 4) {
    const x0 = L / 2 - 1, x1 = L / 2 + 1;
    add('cInf', 'Painel de baixo da divisória', 'divisoria', [x0, 4, 4, x1, 34, 34], { grain: 'y', step: 2, ex: [0, 0, 1], u: 'cInf' });
    ZL.forEach((z, i) => add(`cTr${i}`, 'Travessa da divisória', 'divisoria', [x0, 4, z, x1, 34, z + 4], { grain: 'y', step: 2, ex: [0, 0, 1], u: 'cTr' }));
    add('cSup', 'Travessa de cima da divisória', 'divisoria', [x0, 4, ZLS, x1, 34, ZC], { grain: 'y', step: 2, ex: [0, 0, 1], u: 'cSup' });
  }

  // Por vão: travessas da frente e de trás, pisos, apoios, guias, prateleiras e sarrafos do topo
  bays.forEach(b => {
    const s = bays.length > 1 ? String(b.i + 1) : '';
    const { x0, x1, bl, br } = b;
    add('tfRod' + s, 'Rodapé da frente', 'travessas', [x0, 0, 4, x1, 2, 8], { step: 1, ex: [0, -1, 0], u: 'tfRod' });
    add('tfGav' + s, 'Travessa sobre a gaveta', 'travessas', [x0, 0, 24, x1, 2, 28], { step: 1, ex: [0, -1, 0], u: 'tfGav' });
    add('tfSup' + s, 'Travessa de cima (frente)', 'travessas', [x0, 0, ZC - 10, x1, 2, ZC], { step: 1, ex: [0, -1, 0], u: 'tfSup' });
    add('ttInf' + s, 'Travessa de baixo (trás)', 'travessas', [x0, 36, 4, x1, 38, 8], { step: 1, ex: [0, 1, 0], u: 'ttInf' });
    add('ttSup' + s, 'Travessa de cima (trás)', 'travessas', [x0, 36, ZC - 10, x1, 38, ZC], { step: 1, ex: [0, 1, 0], u: 'ttSup' });
    // pisos: o de baixo é a cama da gaveta; o de cima é o chão do armário (recortados em volta das colunas)
    add('pisoInf' + s, 'Piso da gaveta', 'pisos', [bl[0], 2, 6, br[1], 36, 8], { step: 2, ex: [0, 0, -1], u: 'pisoInf' });
    add('pisoSup' + s, 'Piso do armário', 'pisos', [bl[0], 2, 26, br[1], 38, 28], { step: 2, ex: [0, 0, -1], u: 'pisoSup' });
    for (const [k, [a, c]] of [['E', bl], ['D', br]]) {
      const cen = c - a > 2.5; // banda da divisória central: sarrafo de 3
      add(`apInf${s}${k}`, 'Apoio do piso', 'apoios', [a, 4, 4, c, 34, 6], { grain: 'y', step: 2, u: cen ? 'apPisoC' : 'apPiso' });
      add(`apSup${s}${k}`, 'Apoio do piso', 'apoios', [a, 4, 24, c, 34, 26], { grain: 'y', step: 2, u: cen ? 'apPisoC' : 'apPiso' });
      add(`guia${s}${k}`, 'Guia da gaveta', 'apoios', [a, 4, 8, c, 34, 12], { grain: 'y', step: 2, u: cen ? 'guiaC' : 'guia' });
      ZL.forEach((z, i) => add(`apPr${s}${i}${k}`, 'Apoio da prateleira', 'apoios', [a, 4, z, c, 34, z + 2], { grain: 'y', step: 2, u: cen ? 'apPrC' : 'apPr' }));
      add(`sl${s}${k}`, 'Sarrafo do topo (lado)', 'apoios', [k === 'E' ? a : c - 3, 5, ZC - 3, k === 'E' ? a + 3 : c, 33, ZC], { grain: 'y', step: 3, u: 'sfTopoL' });
    }
    add('apInfF' + s, 'Apoio do piso', 'apoios', [x0, 2, 4, x1, 4, 6], { step: 2, u: 'apPisoF' });
    add('apInfT' + s, 'Apoio do piso', 'apoios', [x0, 34, 4, x1, 36, 6], { step: 2, u: 'apPisoF' });
    add('apSupF' + s, 'Apoio do piso', 'apoios', [x0, 2, 24, x1, 4, 26], { step: 2, u: 'apPisoF' });
    add('batGav' + s, 'Batente da gaveta', 'apoios', [b.cx - 5, 32, 8, b.cx + 5, 34, 10], { step: 2, u: 'batGav' });
    // sarrafos do topo (3 × 3) por dentro das travessas de cima
    add('sfT' + s, 'Sarrafo do topo', 'apoios', [x0, 2, ZC - 3, x1, 5, ZC], { step: 3, u: 'sfTopoFT' });
    add('stT' + s, 'Sarrafo do topo', 'apoios', [x0, 33, ZC - 3, x1, 36, ZC], { step: 3, u: 'sfTopoFT' });
    // prateleiras soltas, apoiadas nos apoios (topo rente ao topo das travessas)
    ZPR.forEach((z, i) => add(`prat${s}${i}`, 'Prateleira', 'prateleiras', [bl[0] + 0.5, 8, z, br[1] - 0.5, 38, z + 2], { step: 3, ex: [0, -1, 0], u: 'prat' }));
  });

  // Fundo: tábuas com veio em pé atrás das colunas, fresta de 2 mm entre elas
  const nF = Math.ceil(L / 28), wF = (L - 0.2 * (nF - 1)) / nF;
  const FUNDO = [];
  for (let i = 0; i < nF; i++) {
    const a = i * (wF + 0.2); FUNDO.push([a, a + wF]);
    add('fundo' + i, 'Tábua do fundo', 'fundo', [a, 38, 4, a + wF, 40, ZC], { grain: 'z', step: 3, ex: [0, 1, 0], u: 'fundo' });
  }

  // Chapéu: friso de 5 cm em volta e topo com 3 cm de beiral
  add('frisoF', 'Friso da frente', 'chapeu', [-2, -2, ZC - 5, L + 2, 0, ZC], { step: 5, ex: [0, -1, 0.3] });
  add('frisoE', 'Friso do lado', 'chapeu', [-2, 0, ZC - 5, 0, 40, ZC], { grain: 'y', step: 5, ex: [-1, 0, 0.3], u: 'frisoL' });
  add('frisoD', 'Friso do lado', 'chapeu', [L, 0, ZC - 5, L + 2, 40, ZC], { grain: 'y', step: 5, ex: [1, 0, 0.3], u: 'frisoL' });
  add('topo', 'Topo', 'chapeu', [-3, -3, ZC, L + 3, 40, H], { step: 5, ex: [0, 0, 1], round: 0.6 });

  // Portas embutidas, 2 mm de folga em volta (e 2 mm entre as duas do par): montantes 6, travessas 6, 3 travessas de 4 no meio
  const DOORS = [];
  bays.forEach(b => {
    if (V.nd === 1) DOORS.push({ x0: b.x0 + 0.2, x1: b.x1 - 0.2, side: 'R', bay: b.i });
    else {
      DOORS.push({ x0: b.x0 + 0.2, x1: b.cx - 0.1, side: 'L', bay: b.i, active: 1 });
      DOORS.push({ x0: b.cx + 0.1, x1: b.x1 - 0.2, side: 'R', bay: b.i, passive: 1 });
    }
  });
  DOORS.forEach((d, k) => {
    d.i = k; d.w = r1(d.x1 - d.x0); d.hinge = d.side === 'R' ? d.x1 + 0.1 : d.x0 - 0.1;
    const o = { step: 4, door: k + 1 }, s = DOORS.length > 1 ? String(k + 1) : '';
    const a = d.x0 + 6, c = d.x1 - 6;
    add('pMontE' + s, 'Montante da porta', 'porta', [d.x0, 0, ZD[0], a, 2, ZD[1]], { ...o, grain: 'z', u: 'pMont' });
    add('pMontD' + s, 'Montante da porta', 'porta', [c, 0, ZD[0], d.x1, 2, ZD[1]], { ...o, grain: 'z', u: 'pMont' });
    add('pTrInf' + s, 'Travessa da porta', 'porta', [a, 0, ZD[0], c, 2, ZD[0] + 6], { ...o, u: 'pTr' });
    add('pTrSup' + s, 'Travessa da porta', 'porta', [a, 0, ZD[1] - 5.8, c, 2, ZD[1]], { ...o, u: 'pTr' });
    MULL.forEach((z, i) => add(`pMeio${s}${i}`, 'Travessa do meio da porta', 'porta', [a, 0, z, c, 2, z + 4], { ...o, u: 'pMeio' }));
    DOOR_OPEN.forEach(([za, zc], i) => {
      add(`vP${s}${i}`, 'Vidro da porta', 'vidros', [a + 0.1, 1, za + 0.1, c - 0.1, 1.3, zc - 0.1], { ...o, m: 'vidro', u: 'vP' });
      for (const [k2, ya, yb] of [['o', 0, 1], ['i', 1.3, 2.3]]) {
        add(`bgP${s}${i}${k2}1`, 'Baguete', 'baguetes', [a, ya, za, c, yb, za + 1], { ...o, u: 'bg', thin: 1 });
        add(`bgP${s}${i}${k2}2`, 'Baguete', 'baguetes', [a, ya, zc - 1, c, yb, zc], { ...o, u: 'bg', thin: 1 });
        add(`bgP${s}${i}${k2}3`, 'Baguete', 'baguetes', [a, ya, za + 1, a + 1, yb, zc - 1], { ...o, grain: 'z', u: 'bg', thin: 1 });
        add(`bgP${s}${i}${k2}4`, 'Baguete', 'baguetes', [c - 1, ya, za + 1, c, yb, zc - 1], { ...o, grain: 'z', u: 'bg', thin: 1 });
      }
    });
    // mata-junta: ripa colada por dentro da porta passiva, a outra porta fecha encostada nela
    if (d.passive) add('mj' + s, 'Mata-junta', 'porta', [d.x0 - 1.5, 2.3, ZD[0] + 3, d.x0 + 2.5, 3.3, ZD[1] - 3], { ...o, grain: 'z', u: 'mj' });
  });
  // batente da porta única: na coluna da esquerda, por dentro
  if (V.nd === 1) add('batPorta', 'Batente da porta', 'apoios', [4, 2, 30, 5.5, 3, ZD[1] - 1.8], { grain: 'z', step: 4, u: 'batPorta' });

  // Gavetas embutidas (uma por vão): frente, laterais, traseira e fundo de compensado 6 mm pregado por baixo
  const DRAWERS = [];
  bays.forEach(b => {
    const s = bays.length > 1 ? String(b.i + 1) : '';
    const gx0 = b.x0 + 0.4, gx1 = b.x1 - 0.4, o = { step: 4, drawer: b.i + 1 };
    add('gFrente' + s, 'Frente da gaveta', 'gaveta', [b.x0 + 0.2, 0, 8.2, b.x1 - 0.2, 2, 23.8], { ...o, u: 'gFrente' });
    add('gLatE' + s, 'Lateral da gaveta', 'gaveta', [gx0, 2, 8.6, gx0 + 2, 32, 21.6], { ...o, grain: 'y', u: 'gLat' });
    add('gLatD' + s, 'Lateral da gaveta', 'gaveta', [gx1 - 2, 2, 8.6, gx1, 32, 21.6], { ...o, grain: 'y', u: 'gLat' });
    add('gTras' + s, 'Traseira da gaveta', 'gaveta', [gx0 + 2, 30, 8.6, gx1 - 2, 32, 19.6], { ...o, u: 'gTras' });
    add('gFundo' + s, 'Fundo da gaveta', 'gaveta', [gx0, 2, 8, gx1, 32, 8.6], { ...o, m: 'comp', u: 'gFundo' });
    const fw = b.w - 0.4, pulls = fw > 55 ? [b.x0 + fw * 0.25 + 0.2, b.x1 - 0.2 - fw * 0.25] : [b.cx];
    DRAWERS.push({ x0: b.x0 + 0.2, x1: b.x1 - 0.2, gx0, gx1, pulls: pulls.map(r1), bay: b.i });
  });

  const PARTS = P;
  const PULLS = DRAWERS.flatMap(d => d.pulls.map(x => ({ x, z: 16, drawer: d.bay + 1 })));
  // tramela: na porta única fica na coluna da esquerda; nos pares fica na porta passiva e gira por cima da ativa
  const LATCHES = V.nd === 1 ? [{ x: 4.2, z: ZLATCH, dir: 1, on: 0 }] : DOORS.filter(d => d.passive).map(d => ({ x: d.x0, z: ZLATCH, dir: -1, on: d.i + 1 }));

  // ---------- parafusos: [cabeça], [ponta], tipo: m30 (4 × 30), m40 (4 × 40), vis (aparece: fundo) ----------
  const SCREWS = [];
  const S = (a, b, t) => SCREWS.push({ a: a.map(r1), b: b.map(r1), t });
  const spread = (a, c, step = 14) => { const n = Math.max(3, Math.round((c - a) / step)); return Array.from({ length: n }, (_, i) => a + (c - a) * (i + 0.5) / n); };
  bays.forEach(b => {
    const { x0, x1, bl, br } = b;
    // bandas: de dentro (face da coluna) para a parede
    for (const [band, head, tip, cen] of [[bl, bl[1], bl[1] - 3.5, bl[1] - bl[0] > 2.5], [br, br[0], br[0] + 3.5, br[1] - br[0] > 2.5]]) {
      const dir = Math.sign(tip - head), t = cen ? 'm40' : 'm30', tp = cen ? head + dir * 4 : tip;
      const yo = cen && dir > 0 ? 3 : 0; // na divisória, os parafusos dos dois lados ficam desencontrados
      for (const z of [5, 25]) [8, 19, 30].forEach(y => S([head, y + yo, z], [tp, y + yo, z], t));
      [8, 19, 30].forEach(y => S([head, y + yo, 10], [tp, y + yo, 10], t));
      ZL.forEach(z => [10, 28].forEach(y => S([head, y + yo, z + 1], [tp, y + yo, z + 1], t)));
      // pisos nos apoios (de cima para baixo)
      const xm = (band[0] + band[1]) / 2;
      for (const z of [8, 28]) [8, 19, 30].forEach(y => S([xm, y, z], [xm, y, z - 3], 'm30'));
      // sarrafo do topo (lado) na travessa de cima da parede e topo no sarrafo
      const sx = dir < 0 ? band[0] + 1.5 : band[1] - 1.5, sIn = dir < 0 ? band[0] + 3 : band[1] - 3;
      [12, 26].forEach(y => { S([sIn, y + yo, ZC - 1.5], [sIn + dir * 4, y + yo, ZC - 1.5], 'm40'); S([sx, y, ZC - 3], [sx, y, ZC + 1], 'm40'); });
    }
    const xs = spread(x0, x1);
    xs.forEach(x => {
      S([x, 4, 5], [x, 0.5, 5], 'm30'); S([x, 34, 5], [x, 37.5, 5], 'm30'); S([x, 4, 25], [x, 0.5, 25], 'm30');
      for (const z of [8, 28]) S([x, 3, z], [x, 3, z - 3], 'm30');
      S([x, 35, 8], [x, 35, 5], 'm30');
      // sarrafos do topo nas travessas e topo nos sarrafos
      S([x, 5, ZC - 1.5], [x, 1, ZC - 1.5], 'm40'); S([x, 33, ZC - 1.5], [x, 37, ZC - 1.5], 'm40');
      S([x, 3.5, ZC - 3], [x, 3.5, ZC + 1], 'm40'); S([x, 34.5, ZC - 3], [x, 34.5, ZC + 1], 'm40');
      // friso da frente: de dentro da travessa para fora
      S([x, 2, ZC - 2.5], [x, -1, ZC - 2.5], 'm30');
    });
  });
  for (const [x, xo] of [[2, -1], [L - 2, L + 1]]) [10, 19, 28].forEach(y => S([x, y, ZC - 2.5], [xo, y, ZC - 2.5], 'm30'));
  // traseira da gaveta (pela lateral)
  DRAWERS.forEach(d => { for (const [x, xo] of [[d.gx0, d.gx0 + 4], [d.gx1, d.gx1 - 4]]) [12, 17].forEach(z => S([x, 31, z], [xo, 31, z], 'm40')); });
  // fundo: nas colunas de trás (4 × 40) e nas travessas de trás (4 × 30, furo oval), de fora (contra a parede)
  const backCols = [[0, 4], [L - 4, L]]; if (v === 4) backCols.push([L / 2 - CW / 2, L / 2 + CW / 2]);
  const ZF = [15, 50, 85, 120, 155, 190];
  backCols.forEach(([c0, c1]) => FUNDO.forEach(([a, c]) => {
    const o0 = Math.max(a, c0), o1 = Math.min(c, c1);
    if (o1 - o0 >= 1.5) ZF.forEach(z => S([(o0 + o1) / 2, 40, z], [(o0 + o1) / 2, 36, z], 'vis40'));
  }));
  FUNDO.forEach(([a, c]) => {
    const m = (a + c) / 2, inBay = bays.some(b => m > b.x0 + 1 && m < b.x1 - 1);
    const x = inBay ? m : (bays.find(b => b.x1 > a && b.x0 < c) ? Math.max(a + 3, Math.min(c - 3, bays.find(b => b.x1 > a && b.x0 < c).cx)) : m);
    for (const z of [6, ZC - 5]) S([x, 40, z], [x, 37, z], 'vis30');
  });

  // ---------- números para textos e fichas ----------
  const vol = p => { const [a, b, c, d, e, f] = p.b; return (d - a) * (e - b) * (f - c); };
  let wood = 0, glass = 0;
  PARTS.forEach(p => { if (p.m === 'madeira') wood += vol(p); else if (p.m === 'vidro') { const [a, b, c, d, e, f] = p.b; glass += (d - a) * (e - b) * (f - c) / Math.min(d - a, e - b, f - c); } });
  const kgWood = wood * 0.62 / 1000, m2Glass = glass / 1e4, kgGlass = m2Glass * 7.5;
  const bgLen = PARTS.filter(p => p.u === 'bg').reduce((s, p) => { const [a, b, c, d, e, f] = p.b; return s + Math.max(d - a, e - b, f - c); }, 0) / 100;
  return {
    v, ...V, kind: 'cr', hw: { hinge: 'butterfly', pull: 'concha', latch: 'iron' }, DOOR_PULLS: [], L, D, H, DIM, CW, ZC, ZD, ZLS, ZL, ZPR, SIDE_OPEN, DOOR_OPEN, MULL, HINGES, ZLATCH,
    bays, DOORS, DRAWERS, FUNDO, PARTS, SCREWS, PULLS, LATCHES,
    stats: { kgWood, m2Glass, kgGlass, kg: kgWood + kgGlass, bgLen, nScrews: SCREWS.length, nGlass: PARTS.filter(p => p.m === 'vidro').length },
  };
}

// no navegador, a versão vem do endereço da página (?v=2); no node, de make(v)
export const VERSION = typeof location !== 'undefined' ? +(new URLSearchParams(location.search).get('v') || 1) : 1;
