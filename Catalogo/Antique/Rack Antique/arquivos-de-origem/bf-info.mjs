// Buffet Antique: textos, contas de material e custo de cada versão (ficha, posts e legendas)
export function info(M) {
  const { v, L, H, D, ZC, ZD, PARTS, SCREWS, stats, FUNDO, DOORS, DRAWERS, bays, nb } = M;
  const f = n => String(Math.round(n * 10) / 10).replace('.', ',');
  const money = n => n.toLocaleString('pt-BR');
  const dw = DOORS[0].w, wF = FUNDO[0][1] - FUNDO[0][0], bw = bays[0].w;
  const cav = { 150: 56, 110: 44 }[v];
  const kg = Math.round(stats.kg), kgJ = Math.round(stats.kgWood * 0.95 / 0.62);
  const prazo = { 150: '4 a 5 semanas', 110: '3 a 4 semanas' }[v];
  const nd = DOORS.length, nh = nd * 2;

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
    ferr: Math.round((nh * 22 + nb * 15 + nd * 12) / 5) * 5,
    fix: Math.round((cav * 0.15 + (m30 + m40) * 1.1 * 0.15 + 15) / 5) * 5,
    comp: nb * 10, acab: { 150: 80, 110: 65 }[v], cons: 35,
  };
  const mat = Object.values(cost).reduce((s, x) => s + x, 0);
  const nog = 45, matR = Math.round((mat + nog) / 10) * 10;
  const jatBoard = Math.round(boardM * 38 / 5) * 5, matJ = Math.round((mat - cost.cambara + jatBoard) / 10) * 10;
  const hours = { 150: 44, 110: 34 }[v], hoursJ = Math.round(hours * 1.15);
  const calc = (matR + hours * 30) * 1.3, pLo = Math.round((calc - 50) / 100) * 100, pHi = pLo + 400;
  const calcJ = (matJ + hoursJ * 30) * 1.3, pjLo = Math.round((calcJ - 50) / 100) * 100, pjHi = pjLo + 400;

  const buy = [
    [`~${boardM} m de cambará`, `tábua de 30 × 2 cm · ~R$ ${cost.cambara}. Topo, piso, laterais, divisórias, fundo, portas, gavetas e colunas (versão nogueira)`],
    [`ou ~${boardM} m de jatobá`, `mesma tábua, para a versão jatobá · ~R$ ${jatBoard} no lugar do cambará`],
    ['Ripas e sarrafos', `~${ripaM} m de ripa 2 × 2 e ${f(sarrM)} m de sarrafo 3 × 3 (pinus serve, por dentro) · ~R$ ${cost.ripas}`],
    [`${moldBuy} m de moldura 1 × 1`, `baguete em volta das almofadas · ~R$ ${cost.moldura}`],
    ['Ferragens de época', `${nh} dobradiças rústicas de ferro preto (chapa de ~10 cm), ${nb} puxadores concha e ${nd} puxadores argola, + 4 feltros para os pés · ~R$ ${cost.ferr}`],
    ['Fixação', `${cav} cavilhas 8 × 40 + ${Math.ceil(m30 * 1.1 / 5) * 5} parafusos 4 × 30 + ${Math.ceil(m40 * 1.1 / 5) * 5} de 4 × 40 + ${nd * 4} presilhas para as almofadas + ${nd} fechos magnéticos · ~R$ ${cost.fix}`],
    ['Compensado 6 mm', `fundos das ${nb} gavetas, ${f(DRAWERS[0].gx1 - DRAWERS[0].gx0)} × 36 cada · ~R$ ${cost.comp}`],
    ['Acabamento', `óleo de linhaça cozido 900 ml e cera de abelha (~R$ ${cost.acab}). Nogueira: + tingidor (~R$ ${nog}); no jatobá não precisa`],
    ['Consumo', `lixas 80, 120, 180 e 220 · ~R$ ${cost.cons}`],
  ];

  const cut = {
    col: { o: 1, n: 'Colunas', n1: 'Coluna', obs: `Cada uma com 2 ripas de ${ZC} × 4 × 2 coladas. Os 10 cm de baixo são os pés. <b>Veio em pé</b>` },
    lat: { o: 2, n: 'Laterais', n1: 'Lateral', obs: 'Painel inteiro com <b>veio em pé</b> (tábua de 30 + 5 coladas), colado nas duas colunas com cola e 3 cavilhas de cada lado' },
    tfInf: { o: 3, n: 'Rodapé da frente', obs: 'De 10 a 14 cm do chão, de coluna a coluna. 1 cavilha por ponta' },
    tfSup: { o: 4, n: 'Travessa de cima (frente)', obs: 'De 85 a 88 cm, de coluna a coluna. As divisórias encaixam embaixo dela com 1 cavilha' },
    ttInf: { o: 5, n: 'Travessa de baixo (trás)', obs: 'Rente à face de trás das colunas. Segura o piso e o fundo' },
    ttSup: { o: 6, n: 'Travessa de cima (trás)', obs: 'Segura o fundo e o sarrafo do topo' },
    mont: { o: 6.5, n: 'Montantes da frente', n1: 'Montante da frente', obs: '5 cm de largura, colados na frente de cada divisória (veio em pé). A dobradiça da porta e o batente da vizinha se apoiam nele' },
    tfGav: { o: 7, n: 'Travessas das gavetas', n1: 'Travessa da gaveta', obs: 'Uma por vão, de 69 a 72 cm, entre a gaveta e a porta. 1 cavilha em cada ponta' },
    piso: { o: 8, n: 'Piso', obs: 'Inteiro, de lateral a lateral: tábua de 30 + 9 coladas. Recorte de 2 × 2 nas colunas. Furo oval nos lados' },
    div: { o: 9, n: 'Divisórias', n1: 'Divisória', obs: 'Em pé sobre o piso, <b>veio em pé</b> (tábua de 30 + 9). A borda da frente aparece entre as portas: lixe bem e arredonde de leve' },
    pisoG: { o: 10, n: 'Pisos das gavetas', n1: 'Piso da gaveta', obs: 'Um por vão, sobre 2 apoios. A gaveta corre em cima dele (passe vela)' },
    prat: { o: 11, n: 'Prateleiras', n1: 'Prateleira', obs: 'Uma por vão, tábua de 30 + 3. Soltas, sobre os apoios, a 40 cm do chão' },
    fundo: { o: 12, n: 'Tábuas do fundo', n1: 'Tábua do fundo', obs: `Refile ${f(30 - wF)} cm de cada tábua. <b>Veio em pé</b>` },
    topo: { o: 13, n: 'Topo', obs: `Tábua de 30 + 18 coladas, ${L + 6} × 48. Beiral de 3 cm na frente e nos lados, bordas arredondadas` },
    pMont: { o: 14, n: 'Montantes das portas', n1: 'Montante da porta', obs: 'Veio em pé' },
    pTr: { o: 15, n: 'Travessas das portas', n1: 'Travessa da porta', obs: 'Em cima e embaixo. 2 cavilhas por ponta' },
    alm: { o: 16, n: 'Almofadas', n1: 'Almofada', obs: '<b>Veio em pé.</b> Tábua inteira atrás do vão, 1,5 cm maior em volta, presa por trás com presilhas, sem cola' },
    gF: { o: 17, n: 'Frentes das gavetas', n1: 'Frente da gaveta', obs: 'Embutidas, 2 mm de folga. Puxador concha no centro' },
    gL: { o: 18, n: 'Laterais das gavetas', n1: 'Lateral da gaveta', obs: 'Ripa de 1,5 de espessura. Cola + 2 cavilhas de 6 mm na frente' },
    gT: { o: 19, n: 'Traseiras das gavetas', n1: 'Traseira da gaveta', obs: 'Entre as laterais, 1 cm mais baixa' },
    gFu: { o: 20, n: 'Fundos das gavetas', n1: 'Fundo da gaveta', obs: 'Pregado e colado por baixo' },
    apPiso: { o: 21, n: 'Apoios do piso (laterais)', n1: 'Apoio do piso', mat: 'Ripa 2 × 2', obs: 'Colados e parafusados nas laterais' },
    apPisoF: { o: 22, n: 'Apoio do piso (frente)', mat: 'Ripa 2 × 2', obs: 'Atrás do rodapé' },
    apPr: { o: 23, n: 'Apoios das prateleiras e das gavetas', n1: 'Apoio', mat: 'Ripa 2 × 2', obs: 'Nas laterais e nas divisórias, 2 parafusos 4 × 30 cada' },
    bat: { o: 24, n: 'Batentes das portas', n1: 'Batente da porta', obs: 'Colado atrás do montante, na borda livre de cada porta: ela fecha rente. O fecho magnético vai aqui' },
    sfTopo: { o: 25, n: 'Sarrafos do topo', n1: 'Sarrafo do topo', mat: 'Sarrafo 3 × 3', obs: 'Por dentro das travessas de cima. O topo é parafusado neles por baixo' },
  };

  const t = {};
  t.lead = {
    150: 'Buffet de madeira maciça da linha Antique, para a sala de jantar: três gavetas em cima e três portas almofadadas embaixo, com dobradiças rústicas, puxador concha e argola em ferro preto. Pés de 10 cm e topo com beiral. Cabe a louça, as toalhas e os talheres, e o topo vira aparador para servir.',
    110: 'A versão menor do Buffet Antique, para salas e apartamentos compactos: duas gavetas e duas portas almofadadas, com as mesmas ferragens de época. Também serve como cômoda baixa ou aparador de hall.',
  }[v];
  t.facts = [
    ['Nome', M.name],
    ['Madeira', '<b>Nogueira (principal):</b> cambará maciço com tingidor nogueira. <b>Jatobá:</b> madeira de lei, escura por natureza, sem tingidor'],
    ['Medidas', `${L} cm de largura × ${D} de profundidade × ${H} de altura. Topo com beiral de 3 cm (${L + 6} × ${D + 3})`],
    ['Vãos', `${nb} vãos de ${f(bw)} cm, cada um com gaveta em cima (${f(bw - 0.8)} × 10 úteis, 36 de fundo) e armário com porta e prateleira embaixo`],
    ['Portas', `${nd} portas almofadadas de ${[...new Set(DOORS.map(d => f(d.w)))].join(' e ')} × ${f(ZD[1] - ZD[0])} cm, com 2 dobradiças rústicas de ferro, puxador argola e fecho magnético escondido. Montante de 5 cm na frente de cada divisória`],
    ['Uso', 'Louça, travessas e taças atrás das portas; talheres e toalhas nas gavetas; o topo serve de aparador na hora do almoço'],
    ['Peso', `~${kg} kg na nogueira · ~${kgJ} kg no jatobá`],
    ['Fabricação', `Sob encomenda, em Uberlândia. Prazo sugerido: ${prazo}`],
  ];
  t.priceNote = `<b>Não vai no post:</b> no Instagram o buffet aparece como "sob encomenda · valor sob consulta". Conta do planejamento: (R$ ${money(matR)} de material + ~${hours} h × R$ 30) × 1,3 ≈ R$ ${money(Math.round(calc / 10) * 10)}. <b>Jatobá:</b> ~R$ ${money(matJ)} de material e ~${hoursJ} h → <b>R$ ${money(pjLo)} a ${money(pjHi)}</b>. Buffets rústicos de madeira maciça desse tamanho costumam sair de R$ 2.500 a 5.000.`;
  t.why = [
    '<b>Madeira maciça de verdade,</b> não MDF. Pode ser lixado e renovado daqui a 20 anos.',
    '<b>Ferragens de época:</b> dobradiças rústicas, puxador concha e argola de ferro preto, da mesma família do guarda-roupa e da cristaleira.',
    `<b>Muito espaço:</b> ${nb} gavetas e ${nd} armários com prateleira, ${D} cm de fundo para as travessas.`,
    '<b>Pés altos:</b> 10 cm livres embaixo para limpar.',
    '<b>Linha Antique:</b> faz par com a Cristaleira Antique na sala de jantar.',
  ];
  t.sale = `${M.name} 🌳

Madeira maciça, portas almofadadas e ferragens de época em ferro.

• ${L} × ${H} × ${D} cm · ${nb} gavetas e ${nd} portas
• Madeira maciça escura: cambará nogueira ou jatobá
• Dobradiças rústicas, puxador concha e argola de ferro
• Feito sob encomenda em Uberlândia

Valor sob consulta: chame no direct ou no WhatsApp 📲`;
  t.care = [
    'Limpe com pano levemente úmido e seque em seguida. Nada de álcool ou lustra-móveis com silicone.',
    'Use descanso para travessa quente e porta-copos no topo.',
    'Distribua o peso: louça pesada nas prateleiras de baixo, não tudo num lado só.',
    'Se a gaveta ficar dura, passe vela no piso dela.',
    'A cada 3 ou 4 meses, uma camada fina de cera de abelha, lustrada com pano seco.',
  ];
  t.check = [
    ['Largura', `4 coluna + ${bays.map(() => f(bw)).join(' + 2 divisória + ')} + 4 coluna`, `${L} ✓`],
    ['Profundidade', '4 coluna + 35 + 4 coluna + 2 fundo', `${D} ✓`],
    ['Altura', '10 pé + 4 rodapé + 55 porta + 3 travessa + 13 gaveta + 3 travessa + 2 topo', `${H} ✓`],
    ['Portas', `vão de ${f(bw)} − 0,4 de folga − 1,5 de cada montante`, `${DOORS.map(d => f(d.w)).join(' · ')} × 54,6 ✓`],
    ['Gavetas', '72 → 85 · frente de 12,6 · 10 úteis', '✓'],
    ['Topo', 'colunas até 88 + 2; beiral de 3 na frente e nos lados', `${L + 6} × ${D + 3} ✓`],
  ];
  t.cutNote = 'Ripas e sarrafos escondidos podem ser de pinus com o mesmo tingidor. As portas e gavetas são todas iguais: corte em série, com batente na serra.';
  t.joints = [
    ['Ripas das colunas', 'sim', 'Cola nas duas faces, alicates a cada 20 cm. Espere 24 h'],
    ['Laterais → colunas', 'sim', 'Cola e 3 cavilhas <b>8 × 40</b> em cada coluna. Lateral e coluna têm veio em pé e mexem juntas'],
    ['Travessas → colunas', 'sim', 'Cavilhas <b>8 × 40</b>, 1 por ponta'],
    ['Divisórias', 'parte', '3 parafusos <b>4 × 40</b> por baixo, pelo piso, e 1 cavilha seca em cima, na travessa da frente. Não cole no piso'],
    ['Travessas e pisos das gavetas', 'sim', 'Travessa com 1 cavilha em cada lado; piso sobre 2 apoios parafusados'],
    ['Piso → apoios', 'não', 'Parafusos <b>4 × 30</b> de cima para baixo, furo oval nos lados'],
    ['Topo → sarrafos', 'não', 'Parafusos <b>4 × 40</b> de baixo para cima; furo oval no sarrafo de trás'],
    ['Fundo', 'não', 'Parafusos <b>4 × 30</b> nas travessas de trás e 4 × 40 nas colunas, por fora. Fresta de 2 mm'],
    ['Portas', 'sim', 'Quadro com cola e 2 cavilhas por ponta; almofada presa por trás com 4 presilhas, sem cola; moldura colada só no quadro'],
    ['Ferragens', 'não', `2 dobradiças por porta (a 22 e 61 cm do chão), puxador argola a 44 cm, entre as dobradiças, e fecho magnético no batente`],
    ['Gavetas', 'sim', 'Laterais na frente com cola e cavilha de 6 mm, traseira com parafuso 4 × 30, fundo pregado. Vela no piso'],
  ];
  t.steps = [
    '<b>Cole as colunas, as laterais, o piso, as divisórias e o topo</b> (tábuas emendadas). Espere 24 h.',
    '<b>Corte tudo na medida</b> e no esquadro. Lixe antes de montar (80 → 120 → 180).',
    '<b>Monte as duas laterais</b> (coluna + lateral + coluna) e cole os apoios.',
    '<b>Una as laterais</b> com as 4 travessas da frente e de trás. Confira as diagonais e espere 24 h.',
    '<b>Piso, divisórias, travessas e pisos das gavetas</b>, com os parafusos por baixo.',
    '<b>Sarrafos e topo</b>, com os furos ovais. <b>Fundo.</b>',
    `<b>Portas:</b> as ${nd} em série, quadro, almofada e moldura; prove e ajuste até 2 mm de folga. Faça as ${nb} gavetas.`,
    '<b>Acabamento:</b> nogueira = tingidor + 3 demãos de óleo de linhaça + cera; jatobá = só óleo e cera. Por dentro também.',
    '<b>Ferragens:</b> dobradiças, puxadores, fechos magnéticos e feltros nos pés.',
  ];
  return { t, cut, cav, buy, moldBuy, prazo, kg, kgJ, cost: { matTxt: money(matR), matJatTxt: money(matJ), priceTxt: `${money(pLo)} a ${money(pHi)}`, priceJatTxt: `${money(pjLo)} a ${money(pjHi)}`, hours } };
}
