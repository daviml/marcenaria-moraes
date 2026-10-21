// Rack Antique: textos, contas de material e custo de cada versão (ficha, posts e legendas)
export function info(M) {
  const { v, L, H, D, ZC, ZD, PARTS, SCREWS, stats, FUNDO, d1, d2, DOORS, DRAWERS } = M;
  const f = n => String(Math.round(n * 10) / 10).replace('.', ',');
  const money = n => n.toLocaleString('pt-BR');
  const dw = DOORS[0].w, wF = FUNDO[0][1] - FUNDO[0][0], cw = d2 - d1 - 2, sw = d1 - 4;
  const cav = { 180: 40, 140: 40 }[v];
  const kg = Math.round(stats.kg), kgJ = Math.round(stats.kgWood * 0.95 / 0.62);
  const prazo = { 180: '3 a 4 semanas', 140: '3 a 4 semanas' }[v];
  const tvMax = { 180: '75"', 140: '55"' }[v];

  const AXI = { x: 0, y: 1, z: 2 };
  let board = 0, ripa = 0, sarr = 0;
  PARTS.forEach(p => {
    if (p.m !== 'madeira' || p.u === 'mold') return;
    const [a, b, c, d, e, g] = p.b, ext = [d - a, e - b, g - c], gi = AXI[p.grain], len = ext[gi], o = ext.filter((_, i) => i !== gi).sort((x, y) => y - x);
    if (p.u === 'col') board += len * o[0] * 2;
    else if (o[1] >= 2.9) sarr += len; else if (o[0] <= 2.1 && o[1] >= 1.9) ripa += len; else board += len * o[0];
  });
  const boardM = Math.ceil(board / 30 / 100 * 1.25), ripaM = Math.ceil(ripa / 100 * 1.15), sarrM = Math.ceil(sarr / 100 * 1.15 * 2) / 2;
  const moldBuy = Math.ceil(stats.moldLen * 1.1);
  const m30 = SCREWS.filter(s => s.t === 'm30' || s.t === 'vis30').length, m40 = SCREWS.filter(s => s.t === 'm40' || s.t === 'vis40').length;
  const cost = {
    cambara: Math.round(boardM * 17.7 / 5) * 5,
    ripas: Math.round((ripaM * 2.5 + sarrM * 5) / 5) * 5,
    moldura: Math.round(moldBuy * 1.5 / 5) * 5 || 5,
    ferr: Math.round((4 * 20 + 2 * 15 + 15 + 4 * 2.5) / 5) * 5,
    fix: Math.round((50 * 0.15 + (m30 + m40) * 1.1 * 0.15 + 15) / 5) * 5,
    comp: 15, acab: { 180: 60, 140: 50 }[v], cons: 30,
  };
  const mat = Object.values(cost).reduce((s, x) => s + x, 0);
  const nog = 40, matR = Math.round((mat + nog) / 10) * 10;
  const jatBoard = Math.round(boardM * 38 / 5) * 5, matJ = Math.round((mat - cost.cambara + jatBoard) / 10) * 10;
  const hours = { 180: 28, 140: 24 }[v], hoursJ = Math.round(hours * 1.15);
  const calc = (matR + hours * 30) * 1.3, pLo = Math.round((calc - 50) / 100) * 100, pHi = pLo + 300;
  const calcJ = (matJ + hoursJ * 30) * 1.3, pjLo = Math.round((calcJ - 50) / 100) * 100, pjHi = pjLo + 300;

  const buy = [
    [`~${boardM} m de cambará`, `tábua de 30 × 2 cm · ~R$ ${cost.cambara}. Topo, piso, laterais, divisórias, fundo, portas, gaveta e colunas (versão nogueira)`],
    [`ou ~${boardM} m de jatobá`, `mesma tábua, para a versão jatobá · ~R$ ${jatBoard} no lugar do cambará`],
    ['Ripas e sarrafos', `~${ripaM} m de ripa 2 × 2 e ${f(sarrM)} m de sarrafo 3 × 3 (pinus serve, por dentro) · ~R$ ${cost.ripas}`],
    [`${moldBuy} m de moldura 1 × 1`, `baguete em volta das almofadas · ~R$ ${cost.moldura}`],
    ['Ferragens de época', `4 dobradiças borboleta de ferro preto (~7,5 cm), 2 tramelas e 1 puxador concha, + 4 feltros para os pés · ~R$ ${cost.ferr}`],
    ['Fixação', `50 cavilhas 8 × 40 + ${Math.ceil(m30 * 1.1 / 5) * 5} parafusos 4 × 30 + ${Math.ceil(m40 * 1.1 / 5) * 5} de 4 × 40 + 8 presilhas para as almofadas · ~R$ ${cost.fix}`],
    ['Compensado 6 mm', `fundo da gaveta, ${f(DRAWERS[0].gx1 - DRAWERS[0].gx0)} × 32 · ~R$ ${cost.comp}`],
    ['Acabamento', `óleo de linhaça cozido 500 ml e cera de abelha (~R$ ${cost.acab}). Nogueira: + tingidor (~R$ ${nog}); no jatobá não precisa`],
    ['Consumo', `lixas 80, 120, 180 e 220 · ~R$ ${cost.cons}. Serra copo de 60 mm para o furo dos fios`],
  ];

  const cut = {
    col: { o: 1, n: 'Colunas', n1: 'Coluna', obs: `Cada uma com 2 ripas de ${ZC} × 4 × 2 coladas. Os 10 cm de baixo são os pés. <b>Veio em pé</b>` },
    lat: { o: 2, n: 'Laterais', n1: 'Lateral', obs: 'Painel inteiro com <b>veio em pé</b> (tábua de 30 + 2 coladas), colado nas duas colunas com cola e 2 cavilhas de cada lado' },
    tfInf: { o: 3, n: 'Rodapé da frente', obs: 'De 10 a 14 cm do chão, de coluna a coluna. 1 cavilha por ponta' },
    tfSup: { o: 4, n: 'Travessa de cima (frente)', obs: 'De 49 a 53 cm, de coluna a coluna. As divisórias encaixam embaixo dela com 1 cavilha' },
    ttInf: { o: 5, n: 'Travessa de baixo (trás)', obs: 'Rente à face de trás das colunas. Segura o piso e o fundo' },
    ttSup: { o: 6, n: 'Travessa de cima (trás)', obs: 'Segura o fundo e o sarrafo do topo' },
    tfGav: { o: 7, n: 'Travessa da gaveta', obs: 'Entre as divisórias, de 38 a 41 cm. Separa a gaveta do nicho' },
    piso: { o: 8, n: 'Piso', obs: 'Inteiro, de lateral a lateral: tábua de 30 + 6 coladas. Recorte de 2 × 2 nas colunas. Furo oval nos lados' },
    div: { o: 9, n: 'Divisórias', n1: 'Divisória', obs: 'Em pé sobre o piso, <b>veio em pé</b> (tábua de 30 + 8). A borda da frente aparece entre a porta e o nicho: lixe bem e arredonde de leve' },
    pisoG: { o: 10, n: 'Piso da gaveta', obs: 'Entre as divisórias, sobre 2 apoios. A gaveta corre em cima dele' },
    pratL: { o: 11, n: 'Prateleiras atrás das portas', n1: 'Prateleira', obs: 'Uma tábua de 30 inteira. Soltas, sobre os apoios' },
    pratC: { o: 12, n: 'Prateleira do nicho', obs: 'Para receptor, videogame e roteador. Solta: tire para passar os fios' },
    fundo: { o: 13, n: 'Tábuas do fundo', n1: 'Tábua do fundo', obs: `Refile ${f(30 - wF)} cm de cada tábua. <b>Veio em pé</b>. Faça um furo de 6 cm (serra copo) atrás do nicho, a 20 cm do chão, para os fios` },
    topo: { o: 14, n: 'Topo', obs: `Tábua de 30 + 15 coladas, ${L + 6} × 45. Beiral de 3 cm na frente e nos lados, bordas arredondadas. Aguenta TV de até 50 kg` },
    pMont: { o: 15, n: 'Montantes das portas', n1: 'Montante da porta', obs: 'Veio em pé' },
    pTr: { o: 16, n: 'Travessas das portas', n1: 'Travessa da porta', obs: 'Em cima e embaixo. 2 cavilhas por ponta' },
    alm: { o: 17, n: 'Almofadas', n1: 'Almofada', obs: 'Tábua inteira atrás do vão, 1,5 cm maior em volta, presa por trás com presilhas, sem cola' },
    gF: { o: 18, n: 'Frente da gaveta', obs: 'Embutida, 2 mm de folga. Puxador concha no centro' },
    gL: { o: 19, n: 'Laterais da gaveta', n1: 'Lateral da gaveta', obs: 'Ripa de 1,5 de espessura (gaveta rasa, para controles). Cola + 2 cavilhas de 6 mm na frente' },
    gT: { o: 20, n: 'Traseira da gaveta', obs: 'Entre as laterais, 1 cm mais baixa' },
    gFu: { o: 21, n: 'Fundo da gaveta', obs: 'Pregado e colado por baixo' },
    apPiso: { o: 22, n: 'Apoios do piso (laterais)', n1: 'Apoio do piso', mat: 'Ripa 2 × 2', obs: 'Colados e parafusados nas laterais' },
    apPisoF: { o: 23, n: 'Apoio do piso (frente)', mat: 'Ripa 2 × 2', obs: 'Atrás do rodapé' },
    apPr: { o: 24, n: 'Apoios das prateleiras', n1: 'Apoio da prateleira', mat: 'Ripa 2 × 2', obs: 'Nas laterais e nas divisórias, 2 parafusos 4 × 30 cada' },
    bat: { o: 25, n: 'Batentes das portas', n1: 'Batente da porta', obs: 'Colados na divisória, atrás da porta: ela fecha rente' },
    sfTopo: { o: 26, n: 'Sarrafos do topo', n1: 'Sarrafo do topo', mat: 'Sarrafo 3 × 3', obs: 'Por dentro das travessas de cima. O topo é parafusado neles por baixo' },
  };

  const t = {};
  t.lead = {
    180: 'Rack de sala de madeira maciça, da linha Antique: duas portas almofadadas com dobradiça borboleta e tramela de ferro, e no meio um nicho aberto para os aparelhos, com gaveta rasa para os controles. Pés de 10 cm e topo com beiral. Para TV de até 75".',
    140: 'A versão menor do Rack Antique, para salas compactas: mesma construção, mesmas portas almofadadas e ferragens de época, nicho aberto e gaveta. Para TV de até 55".',
  }[v];
  t.facts = [
    ['Nome', M.name],
    ['Madeira', '<b>Nogueira (principal):</b> cambará maciço com tingidor nogueira. <b>Jatobá:</b> madeira de lei, escura por natureza, sem tingidor'],
    ['Medidas', `${L} cm de largura × ${D} de profundidade × ${H} de altura. Topo com beiral de 3 cm (${L + 6} × ${D + 3})`],
    ['Vãos', `Dois armários de ${f(sw)} cm com porta e prateleira; no meio, ${f(cw)} cm com gaveta rasa (controles) e nicho aberto de 24 cm de altura com prateleira, para receptor, videogame e roteador`],
    ['Portas', `2 portas almofadadas de ${f(dw)} × ${f(ZD[1] - ZD[0])} cm, com 2 dobradiças borboleta e tramela de ferro preto`],
    ['TV', `Até ${tvMax} e 50 kg em cima. Centro da TV de 55" a 65" na altura dos olhos de quem está sentado`],
    ['Fios', 'Furo de 6 cm no fundo, atrás do nicho, e prateleira solta para passar os cabos'],
    ['Peso', `~${kg} kg na nogueira · ~${kgJ} kg no jatobá`],
    ['Fabricação', `Sob encomenda, em Uberlândia. Prazo sugerido: ${prazo}`],
  ];
  t.priceNote = `<b>Não vai no post:</b> no Instagram o rack aparece como "sob encomenda · valor sob consulta". Conta do planejamento: (R$ ${money(matR)} de material + ~${hours} h × R$ 30) × 1,3 ≈ R$ ${money(Math.round(calc / 10) * 10)}. <b>Jatobá:</b> ~R$ ${money(matJ)} de material e ~${hoursJ} h → <b>R$ ${money(pjLo)} a ${money(pjHi)}</b>. Racks rústicos de madeira maciça desse tamanho costumam sair de R$ 1.500 a 3.500.`;
  t.why = [
    '<b>Madeira maciça de verdade,</b> não MDF. Pode ser lixada e renovada daqui a 20 anos.',
    '<b>Ferragens de época:</b> dobradiça borboleta, tramela e puxador concha de ferro preto, iguais aos da cristaleira.',
    '<b>Pensado para a TV:</b> 42 cm de fundo para o pé da TV e os aparelhos, furo para os fios, gaveta para os controles.',
    '<b>Pés altos:</b> 10 cm livres embaixo para limpar (e para o aspirador robô passar).',
    '<b>Linha Antique:</b> combina com a cristaleira na sala e com o guarda-roupa no quarto.',
  ];
  t.sale = `${M.name} 🌳

Madeira maciça, portas almofadadas e ferragens de época em ferro.

• ${L} × ${H} × ${D} cm · TV de até ${tvMax}
• Madeira maciça escura: cambará nogueira ou jatobá
• Nicho para os aparelhos, gaveta para os controles e furo para os fios
• Feito sob encomenda em Uberlândia

Valor sob consulta: chame no direct ou no WhatsApp 📲`;
  t.care = [
    'Limpe com pano levemente úmido e seque em seguida. Nada de álcool ou lustra-móveis com silicone.',
    'Não coloque copo molhado ou vaso direto no topo: use um porta-copos ou um paninho.',
    'TV de até 50 kg em cima. Se a TV tiver pés nas pontas, veja se eles cabem nos 45 cm do topo.',
    'Deixe um espaço atrás dos aparelhos para o ar circular: o calor resseca a madeira.',
    'A cada 3 ou 4 meses, uma camada fina de cera de abelha, lustrada com pano seco.',
  ];
  t.check = [
    ['Largura', `4 coluna + ${f(sw)} vão + 2 divisória + ${f(cw)} nicho + 2 divisória + ${f(sw)} vão + 4 coluna`, `${L} ✓`],
    ['Profundidade', '4 coluna + 32 + 4 coluna + 2 fundo', `${D} ✓`],
    ['Altura', `10 pé + 4 rodapé + 35 vão + 4 travessa + 2 topo`, `${H} ✓`],
    ['Portas', `${f(sw)} − 0,4 = ${f(dw)} · 34,6 de altura`, `${f(dw)} × 34,6 ✓`],
    ['Nicho', '14 → 26 prateleira (12 livres) · 28 → 38 (10 livres) · gaveta de 41 a 49 (6 úteis)', 'receptor e videogame ✓'],
    ['Topo', 'colunas até 53 + 2; beiral de 3 na frente e nos lados', `${L + 6} × ${D + 3} ✓`],
  ];
  t.cutNote = 'Ripas e sarrafos escondidos podem ser de pinus com o mesmo tingidor. É a peça mais fácil da linha: as tábuas são curtas (a maior é o topo) e só há 2 portas e 1 gaveta.';
  t.joints = [
    ['Ripas das colunas', 'sim', 'Cola nas duas faces, alicates a cada 20 cm. Espere 24 h'],
    ['Laterais → colunas', 'sim', 'Cola e 2 cavilhas <b>8 × 40</b> em cada coluna. Lateral e coluna têm veio em pé e mexem juntas'],
    ['Travessas → colunas', 'sim', 'Cavilhas <b>8 × 40</b>, 1 por ponta (a de cima e a de baixo da frente e de trás)'],
    ['Divisórias', 'parte', '3 parafusos <b>4 × 40</b> por baixo, pelo piso, e 1 cavilha seca em cima, na travessa da frente. Não cole no piso: o piso mexe na profundidade'],
    ['Piso → apoios', 'não', 'Parafusos <b>4 × 30</b> de cima para baixo, furo oval nos lados'],
    ['Travessa da gaveta e piso da gaveta', 'sim', 'Travessa com 1 cavilha em cada divisória; piso da gaveta sobre 2 apoios parafusados nas divisórias'],
    ['Topo → sarrafos', 'não', 'Parafusos <b>4 × 40</b> de baixo para cima; furo oval no sarrafo de trás. O topo cresce para trás'],
    ['Fundo', 'não', 'Parafusos <b>4 × 30</b> nas travessas de trás e 4 × 40 nas colunas, por fora, contra a parede. Fresta de 2 mm'],
    ['Portas', 'sim', 'Quadro com cola e 2 cavilhas por ponta; almofada presa por trás com 4 presilhas, sem cola; moldura colada só no quadro'],
    ['Ferragens', 'não', '2 dobradiças borboleta por porta (a 20 e 43 cm do chão) na coluna de fora; tramela na frente da divisória, a 31 cm; batente colado na divisória'],
    ['Gaveta', 'sim', 'Laterais na frente com cola e cavilha de 6 mm, traseira com parafuso 4 × 30, fundo pregado. Vela no piso da gaveta'],
  ];
  t.steps = [
    '<b>Cole as colunas, as laterais, o piso, as divisórias e o topo</b> (tábuas emendadas). Espere 24 h.',
    '<b>Corte tudo na medida</b> e no esquadro. Lixe antes de montar (80 → 120 → 180).',
    '<b>Monte as duas laterais</b> (coluna + lateral + coluna) e cole os apoios do piso e das prateleiras.',
    '<b>Una as laterais</b> com as 4 travessas da frente e de trás. Confira as diagonais e espere 24 h.',
    '<b>Piso, divisórias, travessa e piso da gaveta</b>, com os parafusos por baixo.',
    '<b>Sarrafos e topo</b>, com os furos ovais. <b>Fundo</b> com o furo dos fios.',
    '<b>Portas:</b> quadro, almofada, moldura; prove no vão e ajuste até 2 mm de folga. Faça a gaveta.',
    '<b>Acabamento:</b> nogueira = tingidor + 3 demãos de óleo de linhaça + cera; jatobá = só óleo e cera. Por dentro também.',
    '<b>Ferragens:</b> dobradiças, tramelas, puxador, batentes e feltros nos pés.',
  ];
  return { t, cut, cav, buy, moldBuy, prazo, kg, kgJ, tvMax, cost: { matTxt: money(matR), matJatTxt: money(matJ), priceTxt: `${money(pLo)} a ${money(pHi)}`, priceJatTxt: `${money(pjLo)} a ${money(pjHi)}`, hours } };
}
