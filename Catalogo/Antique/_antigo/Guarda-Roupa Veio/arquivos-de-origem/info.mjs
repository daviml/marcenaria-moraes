// Guarda-Roupa Veio: textos, contas de material e custo de cada versão (ficha, posts e legendas)
export function info(M) {
  const { v, L, H, D, ZC, ZD, ZM, ZS, bays, DOORS, DRAWERS, PARTS, SCREWS, stats, FUNDO } = M;
  const nd = DOORS.length, nb = bays.length;
  const f = n => String(Math.round(n * 10) / 10).replace('.', ',');
  const money = n => n.toLocaleString('pt-BR');
  const dw = DOORS[0].w, bw = bays[0].w, wF = FUNDO[0][1] - FUNDO[0][0];
  const cav = { 2: 86, 4: 156 }[v];
  const kg = Math.round(stats.kg), kgJ = Math.round(stats.kgWood * 0.95 / 0.62);
  const prazo = { 2: '6 a 8 semanas', 4: '8 a 10 semanas' }[v];
  const nPulls = M.PULLS.length + M.DOOR_PULLS.length;
  const big = DRAWERS.find(d => d.big), small = DRAWERS.find(d => !d.big);
  const prat = PARTS.find(p => p.u === 'prat'), rod = PARTS.find(p => p.u === 'rod');

  // ---------- material ----------
  const AXI = { x: 0, y: 1, z: 2 };
  let board = 0, ripa = 0, sarr = 0;
  PARTS.forEach(p => {
    if (p.m !== 'madeira' || p.u === 'mold' || p.u === 'rod') return;
    const [a, b, c, d, e, g] = p.b, ext = [d - a, e - b, g - c], gi = AXI[p.grain], len = ext[gi], o = ext.filter((_, i) => i !== gi).sort((x, y) => y - x);
    if (p.u === 'col' || p.u === 'colC') board += len * o[0] * 2;
    else if (o[1] >= 2.9) sarr += len; else if (o[0] <= 2.1 && o[1] >= 1.9) ripa += len; else board += len * o[0];
  });
  const boardM = Math.ceil(board / 30 / 100 * 1.25), ripaM = Math.ceil(ripa / 100 * 1.15), sarrM = Math.ceil(sarr / 100 * 1.15 * 2) / 2;
  const moldBuy = Math.ceil(stats.moldLen * 1.1 / 5) * 5;
  const nH = 3 * nd, nPair = nd / 2, nFeet = { 2: 4, 4: 6 }[v];
  const m30 = SCREWS.filter(s => s.t === 'm30' || s.t === 'vis30').length, m40 = SCREWS.filter(s => s.t === 'm40' || s.t === 'vis40').length;
  const cost = {
    cambara: Math.round(boardM * 17.7 / 5) * 5,
    ripas: Math.round((ripaM * 2.5 + sarrM * 5) / 5) * 5,
    moldura: Math.round(moldBuy * 1.5 / 5) * 5,
    ferr: Math.round((nH * 25 + nPulls * 18 + nPair * (2 * 12 + 8) + M.rodZones.length * 35 + nFeet * 2.5) / 5) * 5,
    fix: Math.round((Math.ceil(cav * 1.4 / 50) * 50 * 0.15 + (m30 + m40) * 1.1 * 0.15 + 15 + 8 * 2 * nd * 0.5) / 5) * 5,
    comp: 15 * DRAWERS.length,
    acab: { 2: 140, 4: 200 }[v],
    cons: { 2: 70, 4: 95 }[v],
    parede: 15,
  };
  const mat = Object.values(cost).reduce((s, x) => s + x, 0);
  const nog = { 2: 80, 4: 110 }[v];
  const matR = Math.round((mat + nog) / 10) * 10;
  const jatBoard = Math.round(boardM * 38 / 5) * 5, matJ = Math.round((mat - cost.cambara + jatBoard) / 10) * 10;
  const hours = { 2: 70, 4: 105 }[v], hoursJ = Math.round(hours * 1.15);
  const span = { 2: 500, 4: 700 }[v];
  const calc = (matR + hours * 30) * 1.3, pLo = Math.round((calc - 50) / 100) * 100, pHi = pLo + span;
  const calcJ = (matJ + hoursJ * 30) * 1.3, pjLo = Math.round((calcJ - 50) / 100) * 100, pjHi = pjLo + span;
  const market = { 2: 'Guarda-roupas rústicos de 2 portas em madeira maciça costumam sair de R$ 4.500 a 8.000', 4: 'Guarda-roupas rústicos de 4 portas em madeira maciça costumam sair de R$ 7.000 a 12.000' }[v];

  const buy = [
    [`~${boardM} m de cambará`, `tábua de 30 × 2 cm · ~R$ ${cost.cambara}. Laterais, fundo, portas e almofadas, pisos, prateleiras, gavetas, base e chapéu (versão nogueira)`],
    [`ou ~${boardM} m de jatobá`, `mesma tábua de 30 × 2, para a versão jatobá · ~R$ ${jatBoard} no lugar do cambará. Peça tábuas secas em estufa e retas`],
    ['Ripas e sarrafos', `~${ripaM} m de ripa 2 × 2 e ${f(sarrM)} m de sarrafo 3 × 3 (pinus serve, por dentro) · ~R$ ${cost.ripas}`],
    [`${moldBuy} m de moldura 1 × 1`, `baguete de madeira em volta das almofadas das portas · ~R$ ${cost.moldura}`],
    ['Ferragens de ferro', `${nH} dobradiças rústicas de sobrepor (~8 cm), ${nPulls} puxadores argola (${M.DOOR_PULLS.length} nas portas e ${M.PULLS.length} nas gavetas), ${2 * nPair} ferrolhos de 10 cm, ${nPair} ${nPair > 1 ? 'fechos magnéticos' : 'fecho magnético'}, ${M.rodZones.length} varão de 3 cm com 2 suportes e ${nFeet} feltros · ~R$ ${cost.ferr}`],
    ['Fixação', `${Math.ceil(cav * 1.4 / 50) * 50} cavilhas 8 × 40 + ${Math.ceil(m30 * 1.1 / 5) * 5} parafusos 4 × 30 + ${Math.ceil(m40 * 1.1 / 5) * 5} de 4 × 40 + ${8 * 2 * nd} presilhas para as almofadas + arruelas + marcador de cavilha 8 mm · ~R$ ${cost.fix}`],
    ['Compensado 6 mm', `fundos das ${DRAWERS.length} gavetas (${nb > 1 ? nb + ' de ' : '1 de '}${f(big.gx1 - big.gx0)} × 46 e ${2 * nb} de ${f(small.gx1 - small.gx0)} × 46) · ~R$ ${cost.comp}`],
    ['Acabamento', `óleo de linhaça cozido ${{ 2: '2 litros', 4: '3 litros' }[v]} · cera de abelha (~R$ ${cost.acab} os dois). Nogueira: + tingidor nogueira à base d'água (~R$ ${nog}); no jatobá não precisa`],
    ['Consumo', `lixas 80, 120, 180 e 220 · ~R$ ${cost.cons}`],
    ['Fixação na parede', `2 cantoneiras de 5 cm + parafusos e buchas 6 · ~R$ ${cost.parede}. Vão junto com o guarda-roupa`],
  ];

  // ---------- lista de corte ----------
  const cut = {
    col: { o: 1, n: 'Colunas', n1: 'Coluna', obs: `Cada uma com 2 ripas de ${ZC} × 4 × 2 coladas pela face. Corte com ${ZC + 4} e acerte depois. <b>Veio em pé</b>` },
    colC: { o: 2, n: 'Colunas centrais', n1: 'Coluna central', obs: `Frente e trás, no meio. Cada uma com 2 réguas de ${ZC} × 8 × 2 coladas. Recebem as dobradiças das duas portas do meio. <b>Veio em pé</b>` },
    lat: { o: 3, n: 'Laterais', n1: 'Lateral', obs: `Painel inteiro de 2 tábuas de 24 coladas (refile 6 de cada tábua de 30). <b>Veio em pé</b>, como as colunas: cola e cavilha a cada 25 cm nas duas colunas, porque madeira e coluna mexem juntas. Rente à face de fora` },
    divC: { o: 4, n: 'Divisória central', obs: 'Igual às laterais, no meio da coluna central (1 cm para dentro de cada face). Separa os dois armários' },
    tfInf: { o: 5, n: nb > 1 ? 'Travessas de baixo (frente)' : 'Travessa de baixo (frente)', n1: 'Travessa de baixo (frente)', obs: 'De 8 a 12 cm. Fica atrás do rodapé e segura o piso da gaveta larga' },
    tfMei: { o: 6, n: 'Travessas entre as gavetas', n1: 'Travessa entre as gavetas', obs: 'De 27 a 30 cm. Separa a gaveta larga das pequenas' },
    tfCin: { o: 7, n: 'Travessas da cinta', n1: 'Travessa da cinta', obs: 'De 43 a 47 cm. Separa gavetas e portas; a cinta é parafusada nela por dentro' },
    tfSup: { o: 8, n: 'Travessas de cima (frente)', n1: 'Travessa de cima (frente)', obs: `De ${ZC - 10} a ${ZC} cm. O friso cobre os 5 cm de cima. 2 cavilhas por ponta` },
    mGav: { o: 9, n: 'Montantes entre as gavetas', n1: 'Montante entre as gavetas', obs: 'Separa as duas gavetas pequenas na frente. <b>Veio em pé</b>. 1 cavilha em cima e 1 embaixo' },
    ttInf: { o: 10, n: 'Travessas de baixo (trás)', n1: 'Travessa de baixo (trás)', obs: 'Rentes à face de trás das colunas. Seguram o fundo' },
    ttSup: { o: 11, n: 'Travessas de cima (trás)', n1: 'Travessa de cima (trás)', obs: 'Seguram o fundo e o sarrafo do topo' },
    fundo: { o: 12, n: 'Tábuas do fundo', n1: 'Tábua do fundo', obs: `Refile ${f(30 - wF)} cm de cada tábua de 30. <b>Veio em pé</b>, atrás das colunas, de 4 a ${ZC} cm, com fresta de 2 mm entre elas` },
    pisoG: { o: 13, n: 'Pisos das gavetas', n1: 'Piso das gavetas', obs: 'Dois por vão (gaveta larga e gavetas pequenas). 52 de fundo: tábua de 30 + tábua de 22 coladas. Recorte em volta das colunas' },
    pisoC: { o: 14, n: nb > 1 ? 'Pisos dos armários' : 'Piso do armário', n1: 'Piso do armário', obs: 'Chão do guarda-roupa, rente à cinta. Tábua de 30 + 24 coladas. Recorte em volta das colunas' },
    dGav: { o: 15, n: 'Divisórias das gavetas', n1: 'Divisória das gavetas', obs: 'Entre as duas gavetas pequenas, de piso a piso. Parafusada por baixo e por cima' },
    divI: { o: 16, n: 'Divisória interna', obs: `No meio, atrás do encontro das portas, do piso ao topo. Separa prateleiras e cabideiro. 2 tábuas de 23 coladas. Presa com 4 cantoneiras (2 no piso, 2 no topo, furo oval no topo)` },
    prat: { o: 17, n: 'Prateleiras e maleiro', n1: 'Prateleira', obs: `Tábua de 30 + 16 coladas, 46 de fundo. Soltas, sobre os apoios. Recorte de 1,5 × 2 nos cantos de trás junto às colunas. Até ~15 kg cada` },
    rod: { o: 18, n: 'Varão', mat: 'Varão redondo 3 cm', obs: `A ${M.ZROD} cm do chão, 30 cm da frente: cabide de frente com folga. Varão de madeira (cabo) ou tubo, com 2 suportes parafusados` },
    sapF: { o: 19, n: 'Sapatas da frente', n1: 'Sapata da frente', obs: 'Pés recortados (14 × 12): a ponta de fora a 45° para emendar com a sapata do lado. Desenhe a curva com uma lata e corte com tico-tico' },
    sapC: { o: 20, n: 'Sapata do meio', obs: 'Embaixo da coluna central, recortada dos dois lados' },
    rodF: { o: 21, n: 'Rodapés da frente', n1: 'Rodapé da frente', obs: 'Entre as sapatas, 4 cm acima do chão. Colado e parafusado por dentro da travessa de baixo' },
    sapL: { o: 22, n: 'Sapatas dos lados', n1: 'Sapata do lado', obs: 'Duas por lado; a da frente com a ponta a 45°' },
    rodL: { o: 23, n: 'Rodapés dos lados', n1: 'Rodapé do lado', obs: 'Entre as sapatas, parafusado por dentro da lateral' },
    cinF: { o: 24, n: 'Cinta da frente', obs: 'Faixa de 4 cm saindo 2 cm da frente, entre gavetas e portas. Pontas a 45°' },
    cinL: { o: 25, n: 'Cintas dos lados', n1: 'Cinta do lado', obs: 'Ponta da frente a 45°, a de trás reta. Parafusada por dentro da lateral' },
    frisoF: { o: 26, n: 'Friso da frente', obs: 'As duas pontas a 45°' },
    frisoL: { o: 27, n: 'Frisos dos lados', n1: 'Friso do lado', obs: 'Ponta da frente a 45°, a de trás reta' },
    topo: { o: 28, n: 'Topo', obs: `3 tábuas coladas (30 + 30 + 1) em 61 de fundo, anéis alternados${L + 6 > 150 ? '. Peça tábuas de 3 m' : ''}. Bordas da frente e dos lados arredondadas` },
    pMont: { o: 29, n: 'Montantes das portas', n1: 'Montante da porta', obs: 'Veio em pé. Separe as ripas mais retas para eles' },
    pTr: { o: 30, n: 'Travessas das portas', n1: 'Travessa da porta', obs: 'Três por porta (embaixo, no meio e em cima). 2 cavilhas por ponta' },
    almB: { o: 31, n: 'Almofadas de baixo', n1: 'Almofada de baixo', obs: 'Tábua inteira atrás do vão, 1,5 cm maior em volta. Presa por trás com presilhas (sem cola, para poder mexer). <b>Veio em pé</b>' },
    almA: { o: 32, n: 'Almofadas de cima', n1: 'Almofada de cima', obs: 'Como a de baixo: 2 tábuas coladas se a porta for larga. <b>Veio em pé</b>' },
    mj: { o: 33, n: 'Mata-juntas', n1: 'Mata-junta', obs: 'Colada por dentro da porta da direita de cada par: a da esquerda fecha encostada nela' },
    gFA: { o: 34, n: 'Frentes das gavetas largas', n1: 'Frente da gaveta larga', obs: 'Embutida, 2 mm de folga em volta. Duas argolas a 1/4 de cada ponta' },
    gLA: { o: 35, n: 'Laterais das gavetas largas', n1: 'Lateral da gaveta', obs: 'Cola + 2 cavilhas na frente' },
    gTA: { o: 36, n: 'Traseiras das gavetas largas', n1: 'Traseira da gaveta', obs: 'Entre as laterais, 2 cm mais baixa' },
    gFuA: { o: 37, n: 'Fundos das gavetas largas', n1: 'Fundo da gaveta', obs: 'Pregado e colado por baixo' },
    gFB: { o: 38, n: 'Frentes das gavetas pequenas', n1: 'Frente da gaveta pequena', obs: 'Uma argola no centro' },
    gLB: { o: 39, n: 'Laterais das gavetas pequenas', n1: 'Lateral da gaveta', obs: 'Cola + 2 cavilhas na frente' },
    gTB: { o: 40, n: 'Traseiras das gavetas pequenas', n1: 'Traseira da gaveta', obs: 'Entre as laterais, 2 cm mais baixa' },
    gFuB: { o: 41, n: 'Fundos das gavetas pequenas', n1: 'Fundo da gaveta', obs: 'Pregado e colado por baixo' },
    apPiso: { o: 42, n: 'Apoios dos pisos (laterais)', n1: 'Apoio do piso', mat: 'Ripa 2 × 2', obs: 'Três alturas por lado (8, 26 e 43 cm), colados e parafusados na lateral' },
    apPisoC: { o: 43, n: 'Apoios dos pisos (divisória)', n1: 'Apoio do piso', mat: 'Sarrafo 3 × 2', obs: 'Dos dois lados da divisória central' },
    apPisoF: { o: 44, n: 'Apoios dos pisos (frente e trás)', n1: 'Apoio do piso', mat: 'Ripa 2 × 2', obs: 'Atrás das travessas da frente (3) e de trás (2), por vão' },
    guia: { o: 45, n: 'Guias das gavetas', n1: 'Guia da gaveta', obs: 'Logo acima de cada piso, nas laterais e dos dois lados da divisória das gavetas. Passe vela em cima' },
    guiaC: { o: 46, n: 'Guias das gavetas (divisória central)', n1: 'Guia da gaveta', mat: 'Sarrafo 4 × 3', obs: 'Rentes à face da coluna central' },
    apPr: { o: 47, n: 'Apoios das prateleiras', n1: 'Apoio da prateleira', mat: 'Ripa 2 × 2', obs: `Colados e parafusados na lateral e na divisória, com o topo a ${ZS.join(', ')} cm` },
    apPrC: { o: 48, n: 'Apoios das prateleiras (divisória central)', n1: 'Apoio da prateleira', mat: 'Sarrafo 3 × 2', obs: 'Dos dois lados da divisória central' },
    batG: { o: 49, n: 'Batentes das gavetas largas', n1: 'Batente da gaveta', obs: 'No piso, atrás. A gaveta para com a frente rente' },
    sfTopoFT: { o: 50, n: 'Sarrafos do topo (frente e trás)', n1: 'Sarrafo do topo', mat: 'Sarrafo 3 × 3', obs: 'Por dentro das travessas de cima. O da frente prende o topo em furo redondo' },
    sfTopoL: { o: 51, n: 'Sarrafos do topo (lados)', n1: 'Sarrafo do topo (lado)', mat: 'Sarrafo 3 × 3', obs: 'Por dentro das laterais. Furo oval' },
  };

  // ---------- textos da ficha ----------
  const t = {};
  t.lead = {
    2: 'Guarda-roupa de madeira maciça com duas portas almofadadas, como o da foto de referência (2 m × 1,30 m): por dentro, prateleiras de um lado e cabideiro com maleiro do outro. Embaixo, base com sapatas recortadas e três gavetas (duas pequenas e uma larga), cinta separando as portas e chapéu com friso. Ferragens de ferro: dobradiças rústicas e puxadores argola.',
    4: 'A versão grande do Guarda-Roupa Veio: quatro portas almofadadas em dois pares, com coluna central. São dois armários lado a lado: um com cabideiro inteiro (92 cm de varão) e maleiro, outro com três prateleiras e maleiro. Embaixo, seis gavetas sobre sapatas recortadas, cinta e chapéu com friso. Ferragens de ferro: dobradiças rústicas e puxadores argola.',
  }[v];
  t.facts = [
    ['Nome', M.name],
    ['Madeira', '<b>Nogueira (principal):</b> cambará maciço com tingidor nogueira, tom de chocolate. <b>Jatobá:</b> madeira de lei maciça, escura por natureza, sem tingidor; mais dura e pesada'],
    ['Medidas', `${L} cm de largura × ${D} cm de profundidade × ${H} cm de altura. Topo com beiral de 3 cm (${L + 6} × ${D + 3}); sapatas e cinta saem 2 cm`],
    ['Estrutura', v === 4 ? '4 colunas de 4 × 4 nos cantos e 2 colunas centrais de 8 × 4. Laterais e divisória central inteiras, de tábuas coladas com veio em pé' : '4 colunas de 4 × 4 (duas ripas coladas) do chão ao topo. Laterais inteiras, de tábuas coladas com veio em pé'],
    ['Portas', `${nd} portas almofadadas de ${f(dw)} × ${f(ZD[1] - ZD[0])} cm, em ${nd === 2 ? 'um par' : 'dois pares'} que abrem ao meio. Quadro de 2 cm (montantes de 8, travessas de 10) e almofada atrás, presa sem cola. A da esquerda fecha na taramela; a da direita, ferrolho em cima e embaixo`],
    ['Por dentro', v === 4 ? `Lado esquerdo: varão de 92 cm a ${M.ZROD} cm do chão (98 cm para pendurar) e maleiro. Lado direito: 3 prateleiras de ${f(prat.b[3] - prat.b[0])} × 46 cm, a de cima servindo de maleiro` : `Lado esquerdo: 3 prateleiras de ${f(prat.b[3] - prat.b[0])} × 46 cm. Lado direito: varão de ${f(rod.b[3] - rod.b[0])} cm a ${M.ZROD} cm do chão (98 cm para pendurar) e maleiro em cima`],
    ['Gavetas', `${DRAWERS.length} gavetas: ${nb > 1 ? nb + ' largas' : '1 larga'} (frente de ${f(big.x1 - big.x0)} cm, 12 de altura útil) e ${2 * nb} pequenas (frente de ${f(small.x1 - small.x0)} cm, 11 de altura útil), com 46 de fundo. Correm sobre pisos de madeira, com guias`],
    ['Ferragens', `${nH} dobradiças rústicas de ferro, ${nPulls} puxadores argola, ${2 * nPair} ferrolhos, ${nPair} ${nPair > 1 ? 'fechos magnéticos' : 'fecho magnético'} e ${nPair * 2} taramelas de madeira no encontro das portas`],
    ['Peso', `~${kg} kg na nogueira · ~${kgJ} kg no jatobá`],
    ['Fabricação', `Sob encomenda, peça a peça, em Uberlândia. Prazo sugerido: ${prazo}`],
    ['Entrega', `Vai montado. Para carregar, tire portas, gavetas e prateleiras (a caixa fica com ~${Math.round(kg * 0.6 / 5) * 5} kg). Com ${D} de fundo, passa em pé, de lado, por porta de 70 cm. Fixar na parede com 2 cantoneiras`],
  ];
  t.priceNote = `<b>Não vai no post:</b> no Instagram o guarda-roupa aparece como "sob encomenda · valor sob consulta", e o valor é passado no direct ou no WhatsApp. Conta do planejamento: (R$ ${money(matR)} de material + ~${hours} h × R$ 30) × 1,3 ≈ R$ ${money(Math.round(calc / 10) * 10)}. <b>Jatobá:</b> ~R$ ${money(matJ)} de material e ~${hoursJ} h → <b>R$ ${money(pjLo)} a ${money(pjHi)}</b>. ${market}.`;
  t.why = [
    '<b>Madeira maciça de verdade,</b> não MDF. Pode ser lixada e renovada daqui a 20 anos.',
    '<b>Cabide de frente:</b> 58 cm de fundo, cabe cabide de casaco sem raspar na porta.',
    '<b>Nenhum parafuso aparente</b> na frente nem nos lados. Só as ferragens de ferro, que são decoração.',
    '<b>Almofada que não racha:</b> presa por trás sem cola, ela mexe livre quando o tempo muda.',
    `<b>Mesma linha das cristaleiras Veio:</b> mesma altura (2 m), chapéu e ferragens. Quarto e sala combinando.`,
  ];
  t.sale = `${M.name} 🌳

Madeira maciça, portas almofadadas e ferragens de ferro, para durar a vida inteira.

• ${H} × ${L} × ${D} cm
• Madeira maciça escura: cambará nogueira ou jatobá, com óleo e cera
• ${v === 4 ? 'Cabideiro inteiro, 3 prateleiras, 2 maleiros e 6 gavetas' : 'Cabideiro, 3 prateleiras, maleiro e 3 gavetas'}
• Feito sob encomenda em Uberlândia

Valor sob consulta: chame no direct ou no WhatsApp 📲`;
  t.care = [
    'Limpe a madeira com pano levemente úmido e seque em seguida. Nada de álcool, multiuso ou lustra-móveis com silicone.',
    'Não guarde roupa úmida: o vapor estufa as gavetas. Deixe uma fresta aberta de vez em quando para ventilar.',
    'Até ~15 kg por prateleira e ~30 kg no varão. Peso maior vai nas gavetas de baixo.',
    'A cada 3 ou 4 meses, passe uma camada fina de cera de abelha e lustre com pano seco. Vela nas guias se a gaveta pesar.',
    'Deixe preso na parede pelas 2 cantoneiras em cima do topo. Se o piso for irregular, calce as sapatas para as portas fecharem certinho.',
  ];
  const wsum = v === 4 ? `4 coluna + ${f(bw)} vão + 8 coluna central + ${f(bw)} vão + 4 coluna` : `4 coluna + ${f(bw)} vão + 4 coluna`;
  t.check = [
    ['Largura (frente)', wsum, `${L} ✓`],
    ['Profundidade (lado)', '4 coluna + 48 lateral + 4 coluna + 2 fundo', `${D} ✓`],
    ['Altura', `${ZC} coluna + 2 topo`, `${H} ✓`],
    ['Frente, de baixo para cima', `12 sapata/rodapé + 15 gaveta larga + 3 travessa + 13 gavetas pequenas + 4 cinta + ${ZC - 57} portas + 10 travessa`, `${ZC} ✓`],
    ['Portas (2 mm de folga em volta e entre as duas)', `(${f(bw)} − 3 × 0,2) ÷ 2 = ${f(dw)} · ${ZC - 57} − 0,4 = ${f(ZD[1] - ZD[0])}`, `${f(dw)} × ${f(ZD[1] - ZD[0])} ✓`],
    ['Alturas da porta', `10 + ${f(M.DOOR_OPEN[0][1] - M.DOOR_OPEN[0][0])} vão + 10 + ${f(M.DOOR_OPEN[1][1] - M.DOOR_OPEN[1][0])} vão + 10`, `${f(ZD[1] - ZD[0])} ✓`],
    ['Almofadas', `vão + 1,5 de cada lado: ${f(dw - 16 + 3)} de largura`, `${f(dw - 13)} × ${f(M.DOOR_OPEN[0][1] - M.DOOR_OPEN[0][0] + 3)} e × ${f(M.DOOR_OPEN[1][1] - M.DOOR_OPEN[1][0] + 3)} ✓`],
    ['Por dentro', `piso a 47 · prateleiras a ${ZS.join(', ')} (vãos de ~33) · maleiro de ${ZS[2] + 2} a ${ZC - 10} · varão a ${M.ZROD}: ${M.ZROD - 47} cm para pendurar`, 'cabide de 1 m ✓'],
    ['Gavetas', '12 → 27 larga · 30 → 43 pequenas · frentes com 2 mm de folga', '14,6 e 12,6 ✓'],
    ['Chapéu e base', `friso 5 + topo 2, beiral de 3; cinta e sapatas saem 2`, `${L + 6} × ${D + 3} ✓`],
  ];
  t.cutNote = `Ripas e sarrafos escondidos podem ser de pinus com o mesmo tingidor. Colunas, laterais, montantes e tábuas do fundo têm ~${ZC} cm: compre tábuas de pelo menos 2,10 m e, para elas, prefira madeira seca em estufa e aplainada. No jatobá, faça furo-guia em todo parafuso e use lâmina e broca afiadas.`;
  const hingeTxt = `3 dobradiças rústicas de sobrepor por porta (a ${M.HINGES.join(', ')} cm do chão), com os parafusos pretos delas. Calce a porta com papelão de 2 mm em volta para marcar os furos`;
  t.joints = [
    ['Ripas das colunas (face com face)', 'sim', 'Titebond III nas duas faces, alicates ou sargentos a cada 20 cm. Espere 24 h'],
    ['Laterais → colunas', 'sim', `Cola e cavilhas <b>8 × 40</b> a cada 25 cm nas duas colunas. Lateral e coluna têm veio em pé, então mexem juntas e podem ser coladas inteiras${v === 4 ? '. A divisória central entra igual nas colunas centrais, no meio da espessura' : ''}`],
    ['Travessas da frente e de trás → colunas', 'sim', 'Cavilhas <b>8 × 40</b>: 1 por ponta nas de 3 e 4 cm, 2 nas de 10 cm'],
    ['Montante entre as gavetas', 'sim', '1 cavilha em cima (travessa da cinta) e 1 embaixo (travessa entre as gavetas)'],
    ['Apoios e guias → laterais', 'sim', `Cola e 3 parafusos <b>4 × 30</b> de dentro para fora${v === 4 ? '; na divisória central, <b>4 × 40</b> e desencontrados dos do outro lado' : ''}`],
    ['Pisos → apoios', 'não', 'Parafusos <b>4 × 30</b> de cima para baixo: na frente em furo redondo, nos lados e atrás em <b>furo oval</b> frente ↔ trás'],
    ['Divisória das gavetas', 'não', '2 parafusos <b>4 × 40</b> por baixo (pelo piso do meio) e 2 por cima (pelo piso do armário)'],
    ...(v === 2 ? [['Divisória interna', 'não', '4 cantoneiras de 3 cm: 2 no piso do armário e 2 embaixo do topo (no topo, furo oval). Atrás da junta das portas, não aparece']] : []),
    ['Apoios das prateleiras → laterais e divisória', 'sim', 'Cola e 3 parafusos. As prateleiras e os maleiros só apoiam (saem para limpar)'],
    ['Varão', 'não', '2 suportes de varão (flange) parafusados na lateral e na divisória, a ' + M.ZROD + ' cm do chão e 30 cm da frente'],
    ['Base (sapatas, rodapés e cinta)', 'sim', 'Na frente: cola e parafusos <b>4 × 30</b> por dentro da travessa de baixo e da travessa da cinta. Nos lados: só parafuso por dentro da lateral, com cola só nos 10 cm da frente (a lateral mexe). Cantos a 45° colados entre si'],
    ['Frisos e topo', 'parte', 'Friso: cola na travessa e <b>4 × 30</b> de dentro. Topo: <b>4 × 40</b> de baixo pelos sarrafos, furo oval atrás, sem cola'],
    ['Fundo → colunas e travessas de trás', 'não', '6 parafusos <b>4 × 40</b> em cada coluna de trás e 2 de <b>4 × 30</b> por tábua nas travessas (furo oval). Fresta de 2 mm entre as tábuas. São os únicos parafusos que aparecem, e ficam contra a parede'],
    ['Quadro das portas', 'sim', 'Travessas → montantes com cola e 2 cavilhas 8 × 40 por ponta. Monte sobre uma superfície plana e confira as diagonais'],
    ['Almofadas → quadro', 'não', '8 presilhas por almofada (taquinho de madeira de 2 × 4 parafusado no quadro, por cima da almofada) ou parafuso em furo oval atravessado ao veio. <b>Nunca cole a almofada</b>. Deixe 2 mm de folga nos lados'],
    ['Moldura → quadro', 'sim', 'Baguete 1 × 1 em volta de cada vão, colada só no quadro (não na almofada) e com preguinho sem cabeça'],
    ['Portas → colunas', 'não', `${hingeTxt}. As duas portas do meio${v === 4 ? ' de cada lado da coluna central' : ''} usam uma dobradiça em cada metade da coluna`],
    ['Mata-junta, ferrolhos e taramelas', 'parte', 'Mata-junta colada e pregada na porta da direita. Ferrolhos de 10 cm por dentro, em cima e embaixo da porta da direita, entrando em furo de 8 mm na travessa de cima e na da cinta. Taramelas de madeira (2 × 7 × 1) com um parafuso de 4 × 40 e arruela no centro, na travessa de cima e na cinta'],
    ['Gavetas', 'sim', 'Laterais → frente com cola e 2 cavilhas; traseira → laterais com 2 parafusos <b>4 × 40</b>; fundo de compensado colado e pregado por baixo a cada 8 cm. Argolas com os parafusos delas'],
    ['Guarda-roupa → parede', 'não', '2 cantoneiras de 5 cm em cima do topo, encostadas na parede, com parafuso e bucha 6'],
  ];
  t.steps = [
    '<b>Deixe a madeira 1 a 2 semanas dentro de casa</b>, deitada com tabiques entre as tábuas. Para colunas, laterais e montantes, use madeira seca em estufa e reta.',
    `<b>Cole as peças largas e as colunas:</b> ripas das colunas${v === 4 ? ' e réguas das colunas centrais' : ''}, laterais${v === 4 ? ' e divisória central' : ''}, pisos, prateleiras, almofadas largas e o topo. Espere 24 h.`,
    '<b>Corte tudo na medida final</b> e no esquadro, seguindo a lista de corte. Recorte as sapatas com tico-tico.',
    '<b>Lixe todas as peças antes de montar</b> (80 → 120 → 180).',
    '<b>Fure as cavilhas e monte tudo a seco</b> primeiro. Numere as ligações a lápis.',
    `<b>Monte os dois lados</b> deitados: coluna + lateral + coluna, com cola e cavilhas${v === 4 ? '; e a parte do meio (colunas centrais + divisória)' : ''}. Com os lados ainda deitados, cole e parafuse apoios, guias e apoios das prateleiras.`,
    `<b>Una os lados</b> com as travessas da frente e de trás (${7 * nb} por todo), com o guarda-roupa deitado de costas sobre um cobertor. Confira as diagonais da frente e de cima. São duas pessoas para virar.`,
    '<b>Pisos e divisórias das gavetas:</b> apoios da frente e de trás, pisos (furo oval), divisória das gavetas, montante da frente.',
    `<b>Por dentro:</b> ${v === 2 ? 'divisória interna com as cantoneiras, ' : ''}suportes do varão.`,
    '<b>Base e chapéu:</b> sapatas, rodapés e cinta (cantos a 45°); sarrafos do topo, frisos e por último o topo, com furos ovais.',
    `<b>Fundo:</b> as ${FUNDO.length} tábuas atrás das colunas, com 2 mm de fresta.`,
    '<b>Portas:</b> monte os quadros, espere a cola secar, prove cada par no vão e ajuste com plaina até 2 mm de folga. Coloque as almofadas com as presilhas, a moldura e a mata-junta. Ajuste as gavetas.',
    "<b>Acabamento antes das ferragens:</b> nogueira = tingidor nogueira à base d'água no cambará (teste numa sobra), 3 demãos finas de óleo de linhaça (24 h entre demãos) e cera de abelha depois de 1 semana. Jatobá = sem tingidor, só óleo e cera. <b>Passe também por trás das almofadas e por dentro</b>, para a madeira trocar umidade igual. <b>Pano com óleo de linhaça pode pegar fogo sozinho:</b> abra no chão para secar ou deixe de molho na água.",
    '<b>Ferragens:</b> dobradiças (porta calçada com 2 mm), ferrolhos, fecho magnético, taramelas, argolas, feltros nas sapatas, prateleiras e varão. Por último, as 2 cantoneiras na parede.',
  ];

  // ---------- textos do post ----------
  const post = {
    prazo,
    s3: [
      ['Madeira maciça escura', 'Cambará nogueira ou jatobá, nada de MDF. Pode ser lixada e renovada daqui a 20 anos'],
      ['Cabide de frente', `${D} cm de fundo, varão com 98 cm para pendurar e maleiro em cima`],
      ['Portas almofadadas', 'Almofada solta por trás, que não racha. Dobradiças rústicas e argolas de ferro'],
      [nb > 1 ? '6 gavetas' : '3 gavetas', nb > 1 ? 'Duas largas e quatro pequenas, sobre sapatas recortadas' : 'Uma larga e duas pequenas, sobre sapatas recortadas'],
    ],
  };
  return { t, cut, cav, buy, moldBuy, post, prazo, kg, kgJ, cost: { mat: matR, matTxt: money(matR), matJatTxt: money(matJ), priceTxt: `${money(pLo)} a ${money(pHi)}`, priceJatTxt: `${money(pjLo)} a ${money(pjHi)}`, hours }, board: boardM };
}
