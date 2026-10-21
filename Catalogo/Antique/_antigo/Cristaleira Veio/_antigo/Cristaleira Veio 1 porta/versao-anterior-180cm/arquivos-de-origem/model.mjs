// Cristaleira Veio: todas as peças em cm.
// Eixos do projeto: x = largura (0 à esquerda, olhando de frente), y = profundidade (0 na frente), z = altura (0 no chão).
// Corpo: 50 × 40 × 180. Topo (chapéu) com 56 × 43.
export const DIM = { L: 50, P: 40, H: 180, LT: 56, PT: 43 };

// m: madeira | vidro | ferro | comp (compensado)   g: grupo (destaque na ficha)   grain: sentido do veio
// step: ordem em que a peça entra na montagem do vídeo   ex: direção de onde ela chega
const P = [];
const add = (id, n, g, b, o = {}) => P.push({ id, n, g, b, m: 'madeira', grain: 'x', step: 0, ex: [0, 0, 1], ...o });

// Colunas 4 × 4 (2 ripas de 4 × 2 coladas), do chão ao topo
add('colFE', 'Coluna', 'colunas', [0, 0, 0, 4, 4, 178], { grain: 'z', step: 0, ex: [-1, -1, 0], u: 'col' });
add('colFD', 'Coluna', 'colunas', [46, 0, 0, 50, 4, 178], { grain: 'z', step: 0, ex: [1, -1, 0], u: 'col' });
add('colTE', 'Coluna', 'colunas', [0, 34, 0, 4, 38, 178], { grain: 'z', step: 0, ex: [-1, 1, 0], u: 'col' });
add('colTD', 'Coluna', 'colunas', [46, 34, 0, 50, 38, 178], { grain: 'z', step: 0, ex: [1, 1, 0], u: 'col' });

// Travessas da frente (rentes à face da frente) e de trás
add('tfRod', 'Rodapé da frente', 'travessas', [4, 0, 4, 46, 2, 8], { step: 1, ex: [0, -1, 0] });
add('tfGav', 'Travessa sobre a gaveta', 'travessas', [4, 0, 24, 46, 2, 28], { step: 1, ex: [0, -1, 0] });
add('tfSup', 'Travessa de cima (frente)', 'travessas', [4, 0, 168, 46, 2, 178], { step: 1, ex: [0, -1, 0] });
add('ttInf', 'Travessa de baixo (trás)', 'travessas', [4, 36, 4, 46, 38, 8], { step: 1, ex: [0, 1, 0] });
add('ttSup', 'Travessa de cima (trás)', 'travessas', [4, 36, 168, 46, 38, 178], { step: 1, ex: [0, 1, 0] });

// Laterais: painel de baixo, 3 travessas no meio (na altura das prateleiras) e travessa de cima
for (const [s, x0, x1, ex] of [['E', 0, 2, -1], ['D', 48, 50, 1]]) {
  add('lInf' + s, 'Painel de baixo da lateral', 'laterais', [x0, 4, 4, x1, 34, 34], { grain: 'y', step: 2, ex: [ex, 0, 0], u: 'lInf' });
  [63, 96, 129].forEach((z, i) => add(`lTr${i}${s}`, 'Travessa da lateral', 'laterais', [x0, 4, z, x1, 34, z + 4], { grain: 'y', step: 2, ex: [ex, 0, 0], u: 'lTr' }));
  add('lSup' + s, 'Travessa de cima da lateral', 'laterais', [x0, 4, 162, x1, 34, 178], { grain: 'y', step: 2, ex: [ex, 0, 0], u: 'lSup' });
}

// Fundo: 2 tábuas de 25 com veio em pé, atrás das colunas (fresta de 2 mm no meio)
add('fundoE', 'Tábua do fundo', 'fundo', [0, 38, 4, 24.9, 40, 178], { grain: 'z', step: 3, ex: [0, 1, 0], u: 'fundo' });
add('fundoD', 'Tábua do fundo', 'fundo', [25.1, 38, 4, 50, 40, 178], { grain: 'z', step: 3, ex: [0, 1, 0], u: 'fundo' });

// Pisos: o de baixo é a cama da gaveta; o de cima é o chão do armário
add('pisoInf', 'Piso da gaveta', 'pisos', [2, 2, 6, 48, 36, 8], { step: 2, ex: [0, 0, -1] });
add('pisoSup', 'Piso do armário', 'pisos', [2, 2, 26, 48, 38, 28], { step: 2, ex: [0, 0, -1] });

// Apoios (ripas 2 × 2 escondidas): dos pisos, guias da gaveta e apoios das prateleiras
for (const [s, x0, x1] of [['E', 2, 4], ['D', 46, 48]]) {
  add('apInf' + s, 'Apoio do piso', 'apoios', [x0, 4, 4, x1, 34, 6], { grain: 'y', step: 2, u: 'apPiso' });
  add('apSup' + s, 'Apoio do piso', 'apoios', [x0, 4, 24, x1, 34, 26], { grain: 'y', step: 2, u: 'apPiso' });
  add('guia' + s, 'Guia da gaveta', 'apoios', [x0, 4, 8, x1, 34, 12], { grain: 'y', step: 2, u: 'guia' });
  [63, 96, 129].forEach((z, i) => add(`apPr${i}${s}`, 'Apoio da prateleira', 'apoios', [x0, 4, z, x1, 34, z + 2], { grain: 'y', step: 2, u: 'apPr' }));
}
add('apInfF', 'Apoio do piso', 'apoios', [4, 2, 4, 46, 4, 6], { step: 2, u: 'apPiso' });
add('apInfT', 'Apoio do piso', 'apoios', [4, 34, 4, 46, 36, 6], { step: 2, u: 'apPiso' });
add('apSupF', 'Apoio do piso', 'apoios', [4, 2, 24, 46, 4, 26], { step: 2, u: 'apPiso' });
add('batGav', 'Batente da gaveta', 'apoios', [20, 32, 8, 30, 34, 10], { step: 2 });
add('batPorta', 'Batente da porta', 'apoios', [4, 2, 30, 5.5, 3, 166], { grain: 'z', step: 4 });

// Sarrafos do topo (3 × 3), por dentro das travessas de cima
add('sfT', 'Sarrafo do topo', 'apoios', [4, 2, 175, 46, 5, 178], { step: 3, u: 'sfTopoFT' });
add('stT', 'Sarrafo do topo', 'apoios', [4, 33, 175, 46, 36, 178], { step: 3, u: 'sfTopoFT' });
add('seT', 'Sarrafo do topo (lado)', 'apoios', [2, 5, 175, 5, 33, 178], { grain: 'y', step: 3, u: 'sfTopoL' });
add('sdT', 'Sarrafo do topo (lado)', 'apoios', [45, 5, 175, 48, 33, 178], { grain: 'y', step: 3, u: 'sfTopoL' });

// Prateleiras soltas, apoiadas nos apoios (topo rente ao topo das travessas)
[65, 98, 131].forEach((z, i) => add('prat' + i, 'Prateleira', 'prateleiras', [2.5, 8, z, 47.5, 38, z + 2], { step: 3, ex: [0, -1, 0], u: 'prat' }));

// Chapéu: friso de 5 cm em volta e topo com 3 cm de beiral
add('frisoF', 'Friso da frente', 'chapeu', [-2, -2, 173, 52, 0, 178], { step: 5, ex: [0, -1, 0.3] });
add('frisoE', 'Friso do lado', 'chapeu', [-2, 0, 173, 0, 40, 178], { grain: 'y', step: 5, ex: [-1, 0, 0.3], u: 'frisoL' });
add('frisoD', 'Friso do lado', 'chapeu', [50, 0, 173, 52, 40, 178], { grain: 'y', step: 5, ex: [1, 0, 0.3], u: 'frisoL' });
add('topo', 'Topo', 'chapeu', [-3, -3, 178, 53, 40, 180], { step: 5, ex: [0, 0, 1], round: 0.6 });

// Porta (embutida, 2 mm de folga em volta): montantes 6, travessas 6 e 3 travessas de 4 alinhadas com as prateleiras
const DZ = [28.2, 167.8], DX = [4.2, 45.8];
add('pMontE', 'Montante da porta', 'porta', [4.2, 0, 28.2, 10.2, 2, 167.8], { grain: 'z', step: 4, door: 1, u: 'pMont' });
add('pMontD', 'Montante da porta', 'porta', [39.8, 0, 28.2, 45.8, 2, 167.8], { grain: 'z', step: 4, door: 1, u: 'pMont' });
add('pTrInf', 'Travessa da porta', 'porta', [10.2, 0, 28.2, 39.8, 2, 34.2], { step: 4, door: 1, u: 'pTr' });
add('pTrSup', 'Travessa da porta', 'porta', [10.2, 0, 161.8, 39.8, 2, 167.8], { step: 4, door: 1, u: 'pTr' });
export const MULL = [63.1, 96, 128.9]; // base das 3 travessas do meio da porta (4 cm de altura)
MULL.forEach((z, i) => add('pMeio' + i, 'Travessa do meio da porta', 'porta', [10.2, 0, z, 39.8, 2, z + 4], { step: 4, door: 1, u: 'pMeio' }));
// vãos da porta: vidro dentro do vão, preso por baguete dos dois lados (não precisa de rebaixo nem tupia)
const doorOpen = [[34.2, 63.1], [67.1, 96], [100, 128.9], [132.9, 161.8]];
doorOpen.forEach(([a, c], i) => {
  add('vP' + i, 'Vidro da porta', 'vidros', [10.3, 1, a + 0.1, 39.7, 1.3, c - 0.1], { m: 'vidro', step: 4, door: 1, u: 'vP' });
  for (const [k, ya, yb] of [['o', 0, 1], ['i', 1.3, 2.3]]) {
    add(`bgP${i}${k}1`, 'Baguete', 'baguetes', [10.2, ya, a, 39.8, yb, a + 1], { step: 4, door: 1, u: 'bg', thin: 1 });
    add(`bgP${i}${k}2`, 'Baguete', 'baguetes', [10.2, ya, c - 1, 39.8, yb, c], { step: 4, door: 1, u: 'bg', thin: 1 });
    add(`bgP${i}${k}3`, 'Baguete', 'baguetes', [10.2, ya, a + 1, 11.2, yb, c - 1], { grain: 'z', step: 4, door: 1, u: 'bg', thin: 1 });
    add(`bgP${i}${k}4`, 'Baguete', 'baguetes', [38.8, ya, a + 1, 39.8, yb, c - 1], { grain: 'z', step: 4, door: 1, u: 'bg', thin: 1 });
  }
});
export const DOOR = { x0: DX[0], x1: DX[1], z0: DZ[0], z1: DZ[1], hinge: 45.8 };

// Vidros das laterais: dentro do vão, com baguete dos dois lados
const sideOpen = [[34, 63], [67, 96], [100, 129], [133, 162]];
for (const [s, x0] of [['E', 0], ['D', 48]]) sideOpen.forEach(([a, c], i) => {
  add(`vL${i}${s}`, 'Vidro da lateral', 'vidros', [x0 + 1, 4.2, a + 0.2, x0 + 1.3, 33.8, c - 0.2], { m: 'vidro', step: 2, u: 'vL' });
  for (const [k, xa, xb] of [['o', x0, x0 + 1], ['i', x0 + 1.3, x0 + 2.3]]) {
    add(`bgL${i}${s}${k}1`, 'Baguete', 'baguetes', [xa, 4, a, xb, 34, a + 1], { grain: 'y', step: 2, u: 'bg', thin: 1 });
    add(`bgL${i}${s}${k}2`, 'Baguete', 'baguetes', [xa, 4, c - 1, xb, 34, c], { grain: 'y', step: 2, u: 'bg', thin: 1 });
    add(`bgL${i}${s}${k}3`, 'Baguete', 'baguetes', [xa, 4, a + 1, xb, 5, c - 1], { grain: 'z', step: 2, u: 'bg', thin: 1 });
    add(`bgL${i}${s}${k}4`, 'Baguete', 'baguetes', [xa, 33, a + 1, xb, 34, c - 1], { grain: 'z', step: 2, u: 'bg', thin: 1 });
  }
});

// Gaveta (embutida): frente, laterais, traseira e fundo de compensado 6 mm pregado por baixo
add('gFrente', 'Frente da gaveta', 'gaveta', [4.2, 0, 8.2, 45.8, 2, 23.8], { step: 4, drawer: 1 });
add('gLatE', 'Lateral da gaveta', 'gaveta', [4.4, 2, 8.6, 6.4, 32, 21.6], { grain: 'y', step: 4, drawer: 1, u: 'gLat' });
add('gLatD', 'Lateral da gaveta', 'gaveta', [43.6, 2, 8.6, 45.6, 32, 21.6], { grain: 'y', step: 4, drawer: 1, u: 'gLat' });
add('gTras', 'Traseira da gaveta', 'gaveta', [6.4, 30, 8.6, 43.6, 32, 19.6], { step: 4, drawer: 1 });
add('gFundo', 'Fundo da gaveta', 'gaveta', [4.4, 2, 8, 45.6, 32, 8.6], { m: 'comp', step: 4, drawer: 1 });

export const PARTS = P;

// Ferragens de ferro preto (desenhadas à parte no 3D): z = centro
export const HINGES = [42, 98, 154];
export const LATCH = { x: 4.2, z: 98 };
export const PULL = { x: 25, z: 16 };

// Parafusos: [cabeça], [ponta], tipo. Tipos: m30 (4 × 30), m40 (4 × 40), vis (aparece: fundo e ferragens)
export const SCREWS = [];
const S = (a, b, t) => SCREWS.push({ a, b, t });
// apoios dos pisos nas laterais (4 × 30, de dentro para fora)
for (const [x, xo] of [[4, 0.5], [46, 49.5]]) for (const z of [5, 25]) [8, 19, 30].forEach(y => S([x, y, z], [xo, y, z], 'm30'));
// apoios da frente e de trás (piso da gaveta) e da frente (piso do armário)
[12, 25, 38].forEach(x => { S([x, 4, 5], [x, 0.5, 5], 'm30'); S([x, 34, 5], [x, 37.5, 5], 'm30'); S([x, 4, 25], [x, 0.5, 25], 'm30'); });
// pisos nos apoios (de cima para baixo)
for (const z of [8, 28]) { [8, 19, 30].forEach(y => { S([3, y, z], [3, y, z - 3], 'm30'); S([47, y, z], [47, y, z - 3], 'm30'); }); [12, 25, 38].forEach(x => S([x, 3, z], [x, 3, z - 3], 'm30')); }
[12, 25, 38].forEach(x => S([x, 35, 8], [x, 35, 5], 'm30'));
// guias da gaveta e apoios das prateleiras nas laterais
for (const [x, xo] of [[4, 0.5], [46, 49.5]]) { [8, 19, 30].forEach(y => S([x, y, 10], [xo, y, 10], 'm30')); [64, 97, 130].forEach(z => [10, 28].forEach(y => S([x, y, z], [xo, y, z], 'm30'))); }
// friso: de dentro da travessa para fora
[10, 25, 40].forEach(x => S([x, 2, 175.5], [x, -1, 175.5], 'm30'));
for (const [x, xo] of [[2, -1], [48, 51]]) [10, 19, 28].forEach(y => S([x, y, 175.5], [xo, y, 175.5], 'm30'));
// sarrafos do topo nas travessas (4 × 40) e topo nos sarrafos (4 × 40, de baixo para cima)
[12, 25, 38].forEach(x => { S([x, 5, 176.5], [x, 1, 176.5], 'm40'); S([x, 33, 176.5], [x, 37, 176.5], 'm40'); S([x, 3.5, 175], [x, 3.5, 179], 'm40'); S([x, 34.5, 175], [x, 34.5, 179], 'm40'); });
for (const [x, xo] of [[5, 1], [45, 49]]) [12, 26].forEach(y => { S([x, y, 176.5], [xo, y, 176.5], 'm40'); S([x - (x < 25 ? 1.5 : -1.5), y, 175], [x - (x < 25 ? 1.5 : -1.5), y, 179], 'm40'); });
// traseira da gaveta (pela lateral)
for (const [x, xo] of [[4.4, 8.4], [45.6, 41.6]]) [12, 17].forEach(z => S([x, 31, z], [xo, 31, z], 'm40'));
// fundo: nas colunas de trás (4 × 40) e nas travessas de trás (4 × 30), de fora (contra a parede)
for (const x of [2, 48]) [20, 50, 80, 110, 140, 170].forEach(z => S([x, 40, z], [x, 36, z], 'vis40'));
for (const x of [12, 38]) for (const z of [6, 173]) S([x, 40, z], [x, 37, z], 'vis30');
