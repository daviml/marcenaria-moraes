// Textos, contas de material e custo de cada versão (usados na ficha, nos posts e nas legendas)
export function info(M) {
  const { v, L, H, ZC, ZL, ZLS, ZD, ZPR, bays, DOORS, DRAWERS, PARTS, SCREWS, stats, FUNDO } = M;
  const nd = DOORS.length, nb = bays.length, pairs = nd > 1, np = M.PULLS.length;
  const f = n => String(Math.round(n * 10) / 10).replace('.', ',');
  const money = n => n.toLocaleString('pt-BR');
  const dh = M.DOOR_OPEN[0][1] - M.DOOR_OPEN[0][0];
  const dw = DOORS[0].w, bw = bays[0].w, wF = FUNDO[0][1] - FUNDO[0][0];
  const fw = DRAWERS[0].x1 - DRAWERS[0].x0, gin = DRAWERS[0].gx1 - DRAWERS[0].gx0 - 4;
  const glass = { door: [dw - 12 - 0.2, dh - 0.2], side: [29.8, 33.8] };
  const cav = 14 * nb + 32 + (v === 4 ? 16 : 0) + 14 * nd + 4 * nb;
  const kg = Math.round(stats.kg), kgW = Math.round(stats.kgWood), kgG = Math.round(stats.kgGlass);
  const prazo = { 1: '4 a 5 semanas', 2: '5 a 6 semanas', 4: '6 a 8 semanas' }[v];
  const nGav = nb > 1 ? `${nb} gavetas` : 'gaveta';
  const dSales = { 1: 'porta de vidro', 2: 'duas portas de vidro', 4: 'quatro portas de vidro' }[v];

  // ---------- material ----------
  const AXI = { x: 0, y: 1, z: 2 };
  let board = 0, ripa = 0, sarr = 0;
  PARTS.forEach(p => {
    if (p.m !== 'madeira' || p.u === 'bg') return;
    const [a, b, c, d, e, g] = p.b, ext = [d - a, e - b, g - c], gi = AXI[p.grain], len = ext[gi], o = ext.filter((_, i) => i !== gi).sort((x, y) => y - x);
    if (p.u === 'col' || p.u === 'colC') board += len * o[0] * 2; // colunas: 2 ripas (ou réguas) coladas
    else if (o[1] >= 2.9) sarr += len; else if (o[0] <= 2.1 && o[1] >= 1.9) ripa += len; else board += len * o[0];
  });
  const boardM = Math.ceil(board / 30 / 100 * 1.25), ripaM = Math.ceil(ripa / 100 * 1.15), sarrM = Math.ceil(sarr / 100 * 1.15 * 2) / 2;
  const bgBuy = Math.ceil(stats.bgLen * 1.08 / 5) * 5;
  const nH = 3 * nd, nT = pairs ? nd / 2 : 1, nFer = pairs ? nd / 2 : 0, nFecho = pairs ? nd / 2 : 1, nFeet = v === 4 ? 6 : 4;
  const m30 = SCREWS.filter(s => s.t === 'm30' || s.t === 'vis30').length, m40 = SCREWS.filter(s => s.t === 'm40' || s.t === 'vis40').length;
  const cost = {
    cambara: Math.round(boardM * 17.7 / 5) * 5,
    ripas: Math.round((ripaM * 2.5 + sarrM * 5) / 5) * 5,
    vidro: Math.round(stats.m2Glass * 140 / 5) * 5,
    baguete: Math.round(bgBuy * 1.5 / 5) * 5,
    ferr: Math.round((nH * 20 + nT * 15 + np * 15 + nFecho * 8 + nFer * 12 + nFeet * 2.5) / 5) * 5,
    fix: Math.round((Math.ceil(cav * 1.4 / 50) * 50 * 0.15 + (m30 + m40) * 1.1 * 0.15 + 15) / 5) * 5,
    comp: 15 * nb,
    acab: { 1: 60, 2: 85, 4: 120 }[v],
    cons: { 1: 35, 2: 45, 4: 60 }[v],
    parede: 15,
  };
  const mat = Object.values(cost).reduce((s, x) => s + x, 0);
  // nogueira (principal) = cambará + tingidor; jatobá = tábua de jatobá (~R$ 38/m), sem tingidor, ~15% mais horas (madeira dura)
  const nog = { 1: 40, 2: 40, 4: 70 }[v];
  const matR = Math.round((mat + nog) / 10) * 10;
  const jatBoard = Math.round(boardM * 38 / 5) * 5, matJ = Math.round((mat - cost.cambara + jatBoard) / 10) * 10;
  const hours = { 1: 36, 2: 52, 4: 80 }[v], hoursJ = Math.round(hours * 1.15);
  const calc = (matR + hours * 30) * 1.3, pLo = Math.round((calc - 50) / 100) * 100, pHi = pLo + { 1: 300, 2: 400, 4: 600 }[v];
  const calcJ = (matJ + hoursJ * 30) * 1.3, pjLo = Math.round((calcJ - 50) / 100) * 100, pjHi = pjLo + { 1: 300, 2: 400, 4: 600 }[v];
  const kgJ = Math.round(stats.kgWood * 0.95 / 0.62 + stats.kgGlass);
  const market = { 1: 'Cristaleiras rústicas de 1 porta em madeira maciça costumam sair de R$ 1.800 a 3.500', 2: 'Cristaleiras rústicas de 2 portas em madeira maciça costumam sair de R$ 2.800 a 5.000', 4: 'Cristaleiras rústicas de 4 portas em madeira maciça, de 1,60 m, costumam sair de R$ 4.500 a 8.000' }[v];

  const buy = [
    [`~${boardM} m de cambará`, `tábua de 30 × 2 cm · ~R$ ${cost.cambara}. Fundo, colunas, portas, topo, pisos, prateleiras, laterais, gavetas e ripas (versão nogueira)`],
    [`ou ~${boardM} m de jatobá`, `mesma tábua de 30 × 2, para a versão jatobá · ~R$ ${jatBoard} no lugar do cambará. Peça tábuas secas (estufa) e retas`],
    ['Ripas e sarrafos', `~${ripaM} m de ripa 2 × 2 e ${f(sarrM)} m de sarrafo 3 × 3 (pinus serve) · ~R$ ${cost.ripas}`],
    [`${stats.nGlass} vidros 3 mm`, `~${f(stats.m2Glass)} m², incolor, bordas lapidadas, cortados na vidraçaria · ~R$ ${cost.vidro}`],
    [`${bgBuy} m de baguete 1 × 1`, `de madeira, + preguinho sem cabeça 15 mm · ~R$ ${cost.baguete}`],
    ['Ferragens de ferro preto', `${nH} dobradiças borboleta de sobrepor (~7,5 cm), ${nT} ${nT > 1 ? 'tramelas' : 'tramela'}, ${np} ${np > 1 ? 'puxadores' : 'puxador'} concha, ${nFecho} ${nFecho > 1 ? 'fechos magnéticos' : 'fecho magnético'}${nFer ? `, ${nFer} ${nFer > 1 ? 'ferrolhos' : 'ferrolho'} de 10 cm` : ''} e ${nFeet} sapatas de feltro · ~R$ ${cost.ferr}`],
    ['Fixação', `${Math.ceil(cav * 1.4 / 50) * 50} cavilhas 8 × 40 + ${Math.ceil(m30 * 1.1 / 5) * 5} parafusos 4 × 30 + ${Math.ceil(m40 * 1.1 / 5) * 5} de 4 × 40 cabeça chata + ${10 * nb} arruelas + marcador de cavilha 8 mm · ~R$ ${cost.fix}`],
    ['Compensado 6 mm', `${nb > 1 ? nb + ' retalhos' : 'retalho'} de ${f(DRAWERS[0].gx1 - DRAWERS[0].gx0)} × 30 para o fundo ${nb > 1 ? 'das gavetas' : 'da gaveta'} · ~R$ ${cost.comp}`],
    ['Acabamento', `óleo de linhaça cozido ${{ 1: '500 ml', 2: '1 litro', 4: '1,5 litro' }[v]} · cera de abelha (~R$ ${cost.acab} os dois). Nogueira: + tingidor nogueira à base d'água (~R$ ${nog}); no jatobá não precisa`],
    ['Consumo', `lixas 80, 120, 180 e 220 · ~R$ ${cost.cons}. Broca de 8 mm, se ainda não tiver`],
    ['Fixação na parede', `2 cantoneiras de 5 cm + parafusos e buchas 6 · ~R$ ${cost.parede}. Vai junto com a cristaleira`],
  ];

  // ---------- nomes e observações da lista de corte (o = ordem) ----------
  const cut = {
    col: { o: 1, n: 'Colunas', n1: 'Coluna', obs: `Cada uma com 2 ripas de ${ZC} × 4 × 2 coladas pela face. Corte com ${ZC + 4} e acerte depois. <b>Veio em pé</b>` },
    colC: { o: 2, n: 'Colunas centrais', n1: 'Coluna central', obs: `Frente e trás, no meio. Cada uma com 2 réguas de ${ZC} × 8 × 2 coladas pela face. Recebem as dobradiças das duas portas do meio. <b>Veio em pé</b>` },
    tfRod: { o: 3, n: nb > 1 ? 'Rodapés da frente' : 'Rodapé da frente', obs: 'De 4 a 8 cm do chão, rente à face da frente das colunas. 1 cavilha por ponta' },
    tfGav: { o: 4, n: nb > 1 ? 'Travessas sobre as gavetas' : 'Travessa sobre a gaveta', obs: 'De 24 a 28 cm. Separa a gaveta da porta. 1 cavilha por ponta' },
    tfSup: { o: 5, n: 'Travessas de cima (frente)', n1: 'Travessa de cima (frente)', obs: `De ${ZC - 10} a ${ZC} cm. O friso cobre os 5 cm de cima. 2 cavilhas por ponta` },
    ttInf: { o: 6, n: 'Travessas de baixo (trás)', n1: 'Travessa de baixo (trás)', obs: 'Rentes à face de trás das colunas. Seguram o fundo e o apoio do piso' },
    ttSup: { o: 7, n: 'Travessas de cima (trás)', n1: 'Travessa de cima (trás)', obs: 'Rentes à face de trás. Seguram o fundo e o sarrafo do topo' },
    lInf: { o: 8, n: 'Painéis de baixo das laterais', n1: 'Painel de baixo da lateral', obs: 'Veio deitado. Rentes à face de fora das colunas. 3 cavilhas por lado, cola só na de baixo' },
    lTr: { o: 9, n: 'Travessas das laterais', n1: 'Travessa da lateral', obs: `3 por lado, com a base a ${ZL.join(', ')} cm do chão. Por dentro recebem o apoio da prateleira` },
    lSup: { o: 10, n: 'Travessas de cima das laterais', n1: 'Travessa de cima da lateral', obs: `De ${ZLS} a ${ZC} cm. O friso cobre os 5 cm de cima. 2 cavilhas por ponta` },
    cInf: { o: 11, n: 'Painel de baixo da divisória', obs: 'Fica no meio da coluna central, a 1 cm de cada face. Veio deitado. Separa as duas gavetas' },
    cTr: { o: 12, n: 'Travessas da divisória', n1: 'Travessa da divisória', obs: `Mesmas alturas das travessas das laterais (${ZL.join(', ')} cm). Seguram os apoios das prateleiras dos dois lados` },
    cSup: { o: 13, n: 'Travessa de cima da divisória', obs: `De ${ZLS} a ${ZC} cm. Segura os sarrafos do topo do meio` },
    fundo: { o: 14, n: 'Tábuas do fundo', n1: 'Tábua do fundo', obs: `Refile ${f(30 - wF)} cm de cada tábua de 30. <b>Veio em pé</b>. Ficam atrás das colunas, de 4 a ${ZC} cm, com fresta de 2 mm entre elas` },
    pisoInf: { o: 15, n: nb > 1 ? 'Pisos das gavetas' : 'Piso da gaveta', n1: 'Piso da gaveta', obs: `Tábua de 30 + ripa de 4 colada. Recorte de 2 × 2 nos cantos das colunas de fora${v === 4 ? ' e de 3 × 2 nos da coluna central' : ''}. A gaveta corre em cima dele` },
    pisoSup: { o: 16, n: nb > 1 ? 'Pisos dos armários' : 'Piso do armário', n1: 'Piso do armário', obs: `Tábua de 30 + ripa de 6 colada. Recorte de 2 × 2 na frente e 2 × 4 atrás${v === 4 ? ' (3 × 2 e 3 × 4 do lado da coluna central)' : ''}` },
    prat: { o: 17, n: 'Prateleiras', n1: 'Prateleira', obs: `Uma tábua de 30 inteira. Recorte de 1,5 × 4 nos cantos de trás${v === 4 ? ' (2,5 × 4 do lado da coluna central)' : ''}. Soltas${bw > 60 ? '. Até ~12 kg cada' : ''}` },
    topo: { o: 18, n: 'Topo', obs: `Tábua de 30 + tábua de 13 coladas (anéis alternados)${L + 6 > 150 ? '. Peça tábuas de 3 m na madeireira' : ''}. Bordas da frente e dos lados arredondadas` },
    frisoF: { o: 19, n: 'Friso da frente', obs: 'As duas pontas a 45°' },
    frisoL: { o: 20, n: 'Frisos dos lados', n1: 'Friso do lado', obs: 'Ponta da frente a 45°, ponta de trás reta, rente ao fundo' },
    pMont: { o: 21, n: pairs ? 'Montantes das portas' : 'Montantes da porta', n1: 'Montante da porta', obs: 'Veio em pé. Separe as ripas mais retas da tábua para eles' },
    pTr: { o: 22, n: pairs ? 'Travessas das portas (em cima e embaixo)' : 'Travessas da porta (em cima e embaixo)', n1: 'Travessa da porta', obs: 'A de cima fica com 5,8 depois de ajustada. 2 cavilhas por ponta' },
    pMeio: { o: 23, n: pairs ? 'Travessas do meio das portas' : 'Travessas do meio da porta', n1: 'Travessa do meio da porta', obs: 'Na altura das prateleiras. 1 cavilha por ponta' },
    mj: { o: 24, n: 'Mata-juntas', n1: 'Mata-junta', obs: 'Colada por dentro da porta da direita de cada par, sobrando 1,5 cm atrás da outra porta: é nela que a porta da esquerda encosta ao fechar' },
    gFrente: { o: 25, n: nb > 1 ? 'Frentes das gavetas' : 'Frente da gaveta', n1: 'Frente da gaveta', obs: `Embutida, com 2 mm de folga em volta. ${np / nb > 1 ? 'Dois puxadores, a 1/4 de cada ponta' : 'Puxador concha no centro'}` },
    gLat: { o: 26, n: nb > 1 ? 'Laterais das gavetas' : 'Laterais da gaveta', n1: 'Lateral da gaveta', obs: 'Cola + 2 cavilhas na frente' },
    gTras: { o: 27, n: nb > 1 ? 'Traseiras das gavetas' : 'Traseira da gaveta', n1: 'Traseira da gaveta', obs: 'Entre as laterais, 2 cm mais baixa para o ar sair quando fecha' },
    gFundo: { o: 28, n: nb > 1 ? 'Fundos das gavetas' : 'Fundo da gaveta', n1: 'Fundo da gaveta', obs: 'Pregado e colado por baixo' },
    apPiso: { o: 29, n: 'Apoios dos pisos (laterais)', n1: 'Apoio do piso', mat: 'Ripa 2 × 2', obs: 'Colados por dentro do painel de baixo das laterais' },
    apPisoC: { o: 30, n: 'Apoios dos pisos (divisória)', n1: 'Apoio do piso', mat: 'Sarrafo 3 × 2', obs: 'Dos dois lados do painel da divisória' },
    apPisoF: { o: 31, n: 'Apoios dos pisos (frente e trás)', n1: 'Apoio do piso', mat: 'Ripa 2 × 2', obs: `Atrás do rodapé, atrás da travessa sobre a gaveta e na travessa de baixo de trás (3 por vão)` },
    guia: { o: 32, n: 'Guias da gaveta', n1: 'Guia da gaveta', obs: 'Logo acima do piso da gaveta. Enchem o degrau entre a lateral e a coluna' },
    guiaC: { o: 33, n: 'Guias da gaveta (divisória)', n1: 'Guia da gaveta', mat: 'Sarrafo 4 × 3', obs: 'Dos dois lados da divisória, rentes à face da coluna central' },
    apPr: { o: 34, n: 'Apoios das prateleiras', n1: 'Apoio da prateleira', mat: 'Ripa 2 × 2', obs: 'Colados atrás das travessas das laterais, rentes à base delas' },
    apPrC: { o: 35, n: 'Apoios das prateleiras (divisória)', n1: 'Apoio da prateleira', mat: 'Sarrafo 3 × 2', obs: 'Dos dois lados das travessas da divisória' },
    sfTopoFT: { o: 36, n: 'Sarrafos do topo (frente e trás)', n1: 'Sarrafo do topo', mat: 'Sarrafo 3 × 3', obs: 'Por dentro das travessas de cima, rentes ao topo delas. O da frente prende o topo em furo redondo' },
    sfTopoL: { o: 37, n: 'Sarrafos do topo (lados)', n1: 'Sarrafo do topo (lado)', mat: 'Sarrafo 3 × 3', obs: `Por dentro das travessas de cima das laterais${v === 4 ? ' e dos dois lados da divisória' : ''}. Furo oval` },
    batGav: { o: 38, n: nb > 1 ? 'Batentes das gavetas' : 'Batente da gaveta', n1: 'Batente da gaveta', obs: 'No piso, atrás. A gaveta para com a frente rente' },
    batPorta: { o: 39, n: 'Batente da porta', obs: 'Colado na coluna da esquerda, por dentro. A porta para rente à frente' },
  };

  // ---------- textos da ficha ----------
  const t = {};
  t.lead = {
    1: 'Cristaleira de madeira maciça com vidro nos três lados: porta de vidro na frente e janelas de vidro nas duas laterais. Quatro nichos com três prateleiras soltas, gaveta embaixo, chapéu com friso e ferragens de ferro preto (dobradiças borboleta, tramela e puxador concha). A mais estreita da linha Veio: as três têm 2 m de altura, com os mesmos vidros das laterais e as mesmas alturas de nicho.',
    2: 'A Cristaleira Veio em versão larga: duas portas de vidro que abrem ao meio, laterais de vidro, quatro nichos de 82 cm com três prateleiras soltas, uma gaveta larga com dois puxadores, chapéu com friso e ferragens de ferro preto. Mesma altura (2 m), mesmas laterais e mesmos nichos da versão de 1 porta.',
    4: 'A Cristaleira Veio grande, como a da foto de referência (2 m × 1,60 m): quatro portas de vidro em dois pares, coluna central, laterais de vidro, oito nichos com seis prateleiras soltas, duas gavetas com dois puxadores cada, chapéu com friso e ferragens de ferro preto. Por dentro são dois armários iguais lado a lado.',
  }[v];
  t.facts = [
    ['Nome', M.name],
    ['Madeira', `<b>Nogueira (principal):</b> cambará maciço com tingidor nogueira, tom de chocolate. <b>Jatobá:</b> madeira de lei maciça, castanho-avermelhado escuro natural, sem tingidor; mais dura e pesada, e escurece com o tempo`],
    ['Medidas', `${L} cm de largura × 40 cm de profundidade × ${H} cm de altura. O topo tem beiral de 3 cm: ${L + 6} × 43 cm`],
    ['Estrutura', v === 4 ? '4 colunas de 4 × 4 cm nos cantos e 2 colunas centrais de 8 × 4 (frente e trás), do chão ao topo, com pés de 4 cm. Divisória central por dentro, que separa os dois armários' : '4 colunas de 4 × 4 cm (duas ripas de cambará coladas), do chão ao topo, com pés de 4 cm'],
    ['Portas', pairs ? `${nd} portas de ${f(dw)} × ${f(ZD[1] - ZD[0])} cm, ${nd === 2 ? 'abrindo ao meio' : 'em dois pares que abrem ao meio'}. A da esquerda de cada par fecha na tramela; a da direita fica presa por ferrolho e fecho magnético por dentro` : `1 porta de ${f(dw)} × ${f(ZD[1] - ZD[0])} cm, embutida, abrindo para a direita`],
    ['Vidros', `${stats.nGlass} vidros de 3 mm: ${4 * nd} ${pairs ? 'nas portas' : 'na porta'} e 4 em cada lateral, presos com baguete dos dois lados (troca fácil se quebrar)`],
    ['Por dentro', v === 4 ? `Dois armários lado a lado, cada um com piso + 3 prateleiras soltas de ${f(PARTS.find(p => p.g === 'prateleiras').b[3] - PARTS.find(p => p.g === 'prateleiras').b[0])} cm: 8 nichos de 72 cm de largura, 36 a 42 cm de altura e 30 cm de fundo` : `Piso + 3 prateleiras soltas, alinhadas com as travessas ${pairs ? 'das portas' : 'da porta'} e das laterais: 4 nichos de ${f(bw)} cm de largura, 36 a 42 cm de altura e 30 cm de fundo`],
    [nb > 1 ? 'Gavetas' : 'Gaveta', `${nb > 1 ? nb + ' gavetas, cada uma com frente' : 'Frente'} de ${f(fw)} cm; por dentro ${f(gin)} × 28 cm e 13 cm de altura útil. Corre${nb > 1 ? 'm' : ''} sobre o piso de madeira, com guias dos lados`],
    ['Ferragens', `${nH} dobradiças borboleta de sobrepor, ${nT} ${nT > 1 ? 'tramelas' : 'tramela'} e ${np} ${np > 1 ? 'puxadores' : 'puxador'} concha, todas de ferro preto. ${pairs ? `${nFer > 1 ? 'Ferrolhos e fechos magnéticos' : 'Ferrolho e fecho magnético'} por dentro` : 'Fecho magnético por dentro'}`],
    ['Peso', `~${kg} kg na nogueira (${kgW} de madeira e ${kgG} de vidro) · ~${kgJ} kg no jatobá`],
    ['Fabricação', `Sob encomenda, peça a peça, em Uberlândia. Prazo sugerido: ${prazo}`],
    ['Entrega', v === 4 ? 'Vai montada. Para carregar, tire portas, gavetas e prateleiras (a caixa fica com ~110 kg, 3 a 4 pessoas). Passa em porta de 80 cm em pé, de lado. Fixar na parede com 2 cantoneiras' : `Vai montada. Passa em porta de 80 cm em pé, de lado. Fixar na parede com 2 cantoneiras (2 m de altura${v === 1 ? ' e só 40 de fundo' : ''})`],
  ];
  t.priceNote = `<b>Não vai no post:</b> no Instagram a cristaleira aparece como "sob encomenda · valor sob consulta", e o valor é passado no direct ou no WhatsApp. Conta do planejamento: (R$ ${money(matR)} de material + ~${hours} h × R$ 30) × 1,3 ≈ R$ ${money(Math.round(calc / 10) * 10)}. <b>Jatobá:</b> ~R$ ${money(matJ)} de material e ~${hoursJ} h (madeira dura) → <b>R$ ${money(pjLo)} a ${money(pjHi)}</b>. ${market}.`;
  t.why = [
    '<b>Madeira maciça de verdade,</b> não MDF. Pode ser lixada e renovada daqui a 20 anos.',
    '<b>Vidro nos três lados:</b> o que está dentro aparece de qualquer ângulo da sala.',
    '<b>Nenhum parafuso aparente</b> na frente nem nas laterais. Só as ferragens de ferro, que são decoração.',
    '<b>Vidro trocável:</b> baguete com preguinho por dentro, sem massa nem silicone.',
    v === 1 ? '<b>Mesma linha das maiores:</b> mesma altura, mesmas laterais e mesmos nichos da 2 e da 4 portas. Ficam bonitas juntas.' : `<b>Mesma linha da 1 porta:</b> mesma altura, laterais e nichos. ${v === 4 ? 'Uma 4 portas no centro com duas de 1 porta dos lados forma uma parede inteira de vitrine.' : 'Dá para fazer um conjunto.'}`,
  ];
  t.sale = `${M.name} 🌳

Madeira maciça e vidro nos três lados, para mostrar louças, taças e lembranças de família.

• ${H} × ${L} × 40 cm
• Madeira maciça escura: cambará nogueira ou jatobá, com óleo e cera
• ${{ 1: '3 prateleiras, gaveta', 2: '2 portas, 3 prateleiras, gaveta larga', 4: '4 portas, 6 prateleiras, 2 gavetas' }[v]} e ferragens de ferro preto
• Feita sob encomenda em Uberlândia

Valor sob consulta: chame no direct ou no WhatsApp 📲`;
  t.care = [
    'Limpe a madeira com pano levemente úmido e seque em seguida. Nada de álcool, multiuso ou lustra-móveis com silicone.',
    'Vidro: limpa-vidros borrifado no pano, nunca direto no vidro, para não escorrer na madeira.',
    `Não passe de ~${bw > 60 ? 12 : 15} kg por prateleira. Peças pesadas vão na prateleira de baixo.`,
    'A cada 3 ou 4 meses, passe uma camada fina de cera de abelha na madeira e lustre com pano seco.',
    `Deixe a cristaleira presa na parede pelas 2 cantoneiras em cima do topo${v === 1 ? ': com 2 m de altura e 40 de fundo, ela não pode ficar solta' : ''}. Evite sol direto o dia todo e parede úmida. Se o piso for irregular, calce os pés para ${pairs ? 'as portas fecharem' : 'a porta fechar'} certinho.`,
  ];
  const wsum = v === 4 ? `4 coluna + ${f(bw)} vão + 8 coluna central + ${f(bw)} vão + 4 coluna` : `4 coluna + ${f(bw)} vão + 4 coluna`;
  t.check = [
    ['Largura (frente)', wsum, `${L} ✓`],
    ['Profundidade (lado)', '4 coluna + 30 vão + 4 coluna + 2 fundo', '40 ✓'],
    ['Altura', `${ZC} coluna + 2 topo`, `${H} ✓`],
    ['Frente, de baixo para cima', `4 pé + 4 rodapé + 16 gaveta + 4 travessa + ${ZC - 38} ${pairs ? 'portas' : 'porta'} + 10 travessa`, `${ZC} ✓`],
    [pairs ? 'Portas (2 mm de folga em volta e entre as duas)' : 'Porta (com 2 mm de folga em volta)', pairs ? `(${f(bw)} − 3 × 0,2) ÷ 2 = ${f(dw)} · ${ZC - 38} − 0,4 = ${f(ZD[1] - ZD[0])}` : `${f(bw)} − 0,4 = ${f(dw)} · ${ZC - 38} − 0,4 = ${f(ZD[1] - ZD[0])}`, `${f(dw)} × ${f(ZD[1] - ZD[0])} ✓`],
    ['Largura dos vidros da porta', `${f(dw)} − 6 − 6 montantes = ${f(dw - 12)} de vão`, `vidro ${f(glass.door[0])} ✓`],
    ['Alturas da porta', `6 + 4 vãos de ${f(dh)} + 3 × 4 + 5,8`, `${f(ZD[1] - ZD[0])} ✓`],
    ['Lateral, de baixo para cima', `4 pé + 30 painel + 4 vãos de 34 + 3 × 4 travessas + 16 travessa`, `${ZC} ✓`],
    ['Prateleiras × travessas', `As travessas da lateral ficam a ${ZL.join(', ')} cm do chão e as ${pairs ? 'das portas' : 'da porta'} quase na mesma altura. A prateleira (2 cm) apoia no apoio de 2 cm colado atrás da travessa, então fica escondida atrás dela, de frente e de lado`, `${ZPR[0]} + 2 = ${ZPR[0] + 2} = topo da travessa ✓`],
    ['Nichos', `28 → ${ZPR[0]} · ${ZPR[0] + 2} → ${ZPR[1]} · ${ZPR[1] + 2} → ${ZPR[2]} · ${ZPR[2] + 2} → ${ZC - 10} (vão da porta)`, `${ZPR[0] - 28} · ${ZPR[1] - ZPR[0] - 2} · ${ZPR[2] - ZPR[1] - 2} · ${ZC - 10 - ZPR[2] - 2} ✓`],
    ['Chapéu', `friso 5 (de ${ZC - 5} a ${ZC}) + topo 2; beiral: friso sai 2 e o topo mais 1`, `${L + 6} × 43 ✓`],
  ];
  t.cutNote = 'Ripas e sarrafos escondidos podem ser de pinus com o mesmo tingidor nogueira (também na versão jatobá, onde ficam por dentro). No jatobá, faça furo-guia em todo parafuso e use lâmina e broca afiadas: a madeira é dura e queima a serra se forçar. Para tirar ripas de 4, 6, 8 e 10 cm, peça para a madeireira desdobrar as tábuas de 30 (ou use a serra circular quando tiver). As colunas, montantes e tábuas do fundo têm ' + ZC + ' cm: compre tábuas de pelo menos 2,10 m.';
  const hingeTxt = `3 dobradiças borboleta de sobrepor por porta (a ${M.HINGES.join(', ')} cm do chão), com os parafusos pretos que vêm com elas. Calce a porta com papelão de 2 mm em volta para marcar os furos`;
  t.joints = [
    ['Ripas das colunas (face com face)', 'sim', 'Titebond III nas duas faces, alicates ou sargentos a cada 20 cm. Espere 24 h'],
    ['Travessas da frente e de trás → colunas', 'sim', 'Cavilhas de <b>8 × 40 mm</b>: 1 por ponta nas de 4 cm e 2 nas de 10 cm. Entram 2 cm na coluna e 2 cm na travessa'],
    ['Painel de baixo da lateral → colunas', 'só embaixo', '3 cavilhas por lado. O painel tem veio deitado e cresce na altura: <b>cola só na cavilha de baixo</b>; as duas de cima entram secas, com o furo do painel alongado na vertical (8 × 12 mm)'],
    ['Travessas das laterais → colunas', 'sim', '1 cavilha + cola em cada ponta (2 nas travessas de cima, de 16 cm)'],
    ...(v === 4 ? [['Divisória central → colunas centrais', 'sim', 'Igual às laterais (o painel de baixo só com cola na cavilha de baixo), mas no meio da espessura da coluna: risque uma linha a 4 cm da face de cada coluna central para centrar os furos']] : []),
    ['Apoios dos pisos → laterais e travessas', 'sim', `Cola e 3 parafusos <b>4 × 30</b> de dentro para fora${v === 4 ? '; na divisória, <b>4 × 40</b> e desencontrados dos do outro lado' : ''}`],
    ['Pisos → apoios', 'não', 'Parafusos <b>4 × 30</b> de cima para baixo: na frente em furo redondo; nos lados e atrás em <b>furo oval</b> frente ↔ trás (o piso cresce e encolhe na profundidade)'],
    ['Guias da gaveta → laterais', 'sim', 'Cola e 3 parafusos. Passe vela na face de cima do piso e das guias para a gaveta correr leve'],
    ['Apoios das prateleiras → travessas', 'sim', 'Cola e 2 parafusos, rentes à base da travessa. As prateleiras só apoiam (tiram para limpar)'],
    ['Frisos → travessas de cima', 'sim', 'Cola só na travessa (não na coluna, que tem veio cruzado) e parafusos <b>4 × 30</b> de dentro para fora. Cantos da frente a 45°, colados entre si'],
    ['Sarrafos do topo → travessas', 'sim', 'Cola e parafusos <b>4 × 40</b>'],
    ['Topo → sarrafos', 'não', 'Parafusos <b>4 × 40</b> de baixo para cima (atravessa 3 cm de sarrafo e entra 1 cm no topo). Sarrafo da frente em furo redondo; os outros em <b>furo oval</b> frente ↔ trás, com arruela. O topo cresce para trás'],
    ['Fundo → colunas e travessas de trás', 'não', `6 parafusos <b>4 × 40</b> em cada coluna de trás (furo redondo) e 2 parafusos <b>4 × 30</b> por tábua nas travessas, em furo oval no sentido da largura. Fresta de 2 mm entre as tábuas. São os únicos parafusos que aparecem, e ficam contra a parede`],
    [pairs ? 'Quadro das portas' : 'Quadro da porta', 'sim', 'Travessas → montantes com cola e cavilhas 8 × 40: 2 nas de 6 cm, 1 nas de 4 cm. Monte sobre uma superfície plana e confira as diagonais'],
    ['Vidros', 'não', 'Baguete de fora colada no vão; vidro; baguete de dentro só com preguinho sem cabeça 15 mm. Cola nunca encosta no vidro'],
    ...(pairs ? [
      ['Portas → colunas', 'não', `${hingeTxt}. A porta da esquerda de cada par vai na coluna da esquerda do vão; a da direita, na da direita${v === 4 ? ' (as duas do meio dividem a coluna central de 8 cm, uma dobradiça em cada metade)' : ''}`],
      ['Mata-junta → porta da direita', 'sim', 'Cola e 4 preguinhos por dentro, de 3 cm do alto até 3 cm da base da porta, sobrando 1,5 cm para o lado da outra porta'],
      ['Ferrolho, fecho e tramela', 'não', `Ferrolho de 10 cm por dentro, no alto da porta da direita, entrando num furo de 8 mm na travessa de cima. Fecho magnético no alto, por dentro. Tramela na porta da direita, a ${M.ZLATCH} cm do chão, girando por cima do montante da porta da esquerda`],
    ] : [
      ['Porta → coluna da direita', 'não', hingeTxt],
      ['Tramela e fecho', 'não', `Tramela na coluna da esquerda, a ${M.ZLATCH} cm, girando por cima do montante da porta. Fecho magnético por dentro, no alto, e batente de 1,5 × 1 colado na coluna da esquerda para a porta parar rente`],
    ]),
    [nb > 1 ? 'Gavetas' : 'Gaveta', 'sim', `Laterais → frente com cola e 2 cavilhas cada; traseira → laterais com cola e 2 parafusos <b>4 × 40</b> pela lateral; fundo de compensado colado e pregado por baixo a cada 8 cm. ${np > 1 ? 'Puxadores concha com os parafusos deles' : 'Puxador concha com os parafusos dele'}, por dentro`],
    ['Cristaleira → parede', 'não', '2 cantoneiras de 5 cm em cima do topo, encostadas na parede, com parafuso e bucha 6. A 2 m de altura ninguém vê'],
  ];
  t.steps = [
    `<b>Deixe a madeira 1 a 2 semanas dentro de casa</b>, deitada com tacos entre as tábuas. Madeira úmida empena ${pairs ? 'as portas' : 'a porta'} e trinca o vidro depois.`,
    `<b>Cole as peças largas e as colunas:</b> as 2 ripas de cada coluna${v === 4 ? ' (e as 2 réguas de cada coluna central)' : ''}, o topo (30 + 13, anéis alternados) e os pisos (30 + ripa). Espere 24 h.`,
    `<b>Corte tudo na medida final</b> e no esquadro, seguindo a lista de corte. Separe as ripas mais retas para os montantes ${pairs ? 'das portas' : 'da porta'}.`,
    '<b>Lixe todas as peças antes de montar</b> (80 → 120 → 180). Depois de montada, os cantos internos ficam difíceis.',
    '<b>Fure as cavilhas e monte tudo a seco</b> primeiro, sem cola, para conferir. Numere as ligações a lápis.',
    `<b>Monte as duas laterais${v === 4 ? ' e a divisória central' : ''}</b> deitadas: 2 colunas + painel de baixo + 3 travessas + travessa de cima, com cola (no painel, só na cavilha de baixo). Confira as diagonais. Espere 24 h.`,
    `<b>Nas laterais${v === 4 ? ' e na divisória' : ''} ainda soltas,</b> cole e parafuse os apoios dos pisos, as guias da gaveta e os apoios das prateleiras. Com a peça deitada é muito mais fácil.`,
    `<b>Una as laterais</b> com as ${5 * nb} travessas da frente e de trás (cola + cavilhas)${v === 4 ? ', com a divisória no meio' : ''}, com a cristaleira deitada de costas sobre um cobertor. Confira as diagonais da frente e de cima, aperte com cinta ou sargento e espere 24 h.${v === 4 ? ' Com 1,60 m, peça ajuda: são duas pessoas para virar.' : ''}`,
    '<b>Pisos:</b> parafuse os apoios da frente e de trás, apoie os pisos e prenda com os 4 × 30 (furo oval nos lados e atrás).',
    '<b>Chapéu:</b> sarrafos do topo por dentro das travessas; frisos com cantos a 45°; por último o topo, com os furos ovais.',
    `<b>Fundo:</b> as ${FUNDO.length} tábuas atrás das colunas, com 2 mm de fresta (use uma moeda de calço)${pairs ? '' : ' e o batente da porta na coluna da esquerda'}.`,
    pairs ? `<b>Portas:</b> monte os quadros, espere a cola secar e prove cada par no vão. Ajuste com plaina até ficar 2 mm de folga em volta e entre as duas. Cole a mata-junta na porta da direita de cada par. Faça o mesmo ajuste com ${nb > 1 ? 'as gavetas' : 'a gaveta'}.` : '<b>Porta:</b> monte o quadro, espere a cola secar e prove no vão. Ajuste com plaina até ficar 2 mm de folga em volta. Faça o mesmo com a gaveta.',
    '<b>Acabamento antes dos vidros e das ferragens:</b> nogueira = tingidor nogueira à base d\'água no cambará (teste numa sobra, lixa 220 depois de seco), depois 3 demãos finas de óleo de linhaça cozido (tira o excesso em 20 min, 24 h entre demãos) e cera de abelha depois de 1 semana. Jatobá = sem tingidor, só o óleo e a cera: o óleo já deixa a madeira bem escura. Mesmo número de demãos por dentro e por fora. <b>Pano com óleo de linhaça pode pegar fogo sozinho:</b> abra no chão para secar ou deixe de molho na água.',
    '<b>Vidros:</b> meça cada vão pronto, encomende com 2 mm a menos, cole as baguetes de fora, encaixe o vidro e prenda as de dentro com preguinho.',
    `<b>Ferragens:</b> dobradiças (porta calçada com 2 mm), ${pairs ? 'ferrolhos, tramelas, fechos magnéticos' : 'tramela, fecho magnético'}, ${np > 1 ? 'puxadores' : 'puxador'}, ${nFeet} sapatas de feltro nos pés e as 2 cantoneiras em cima do topo, presas na parede.`,
  ];

  // ---------- textos do post ----------
  const post = {
    eyebrow: v === 1 ? 'Lançamento' : `Lançamento · ${M.short}`,
    sub: { 1: 'Madeira maciça e vidro nos três lados.<br>Feita à mão, para mostrar o que importa.', 2: 'Duas portas de vidro, madeira maciça.<br>Feita à mão, para mostrar o que importa.', 4: 'Quatro portas de vidro, madeira maciça.<br>A vitrine da sua sala de jantar.' }[v],
    s3: [
      ['Madeira maciça escura', 'Cambará nogueira ou jatobá, nada de MDF. Pode ser lixada e renovada daqui a 20 anos'],
      ['Vidro nos três lados', { 1: 'Frente e laterais em vidro de 3 mm, com 3 prateleiras por dentro', 2: 'Duas portas e laterais em vidro de 3 mm, com 3 prateleiras por dentro', 4: 'Quatro portas e laterais em vidro de 3 mm, com 6 prateleiras por dentro' }[v]],
      ['Ferragens de ferro', { 1: 'Dobradiças borboleta, tramela e puxador concha em ferro preto', 2: 'Dobradiças borboleta, tramela e puxadores concha em ferro preto', 4: 'Dobradiças borboleta, tramelas e puxadores concha em ferro preto' }[v]],
      [nb > 1 ? 'Duas gavetas' : 'Gaveta embaixo', { 1: '42 cm de largura para talheres, toalhas e guardanapos', 2: '80 cm de largura, com dois puxadores, para talheres e toalhas', 4: '70 cm cada, para talheres, toalhas e jogos americanos' }[v]],
    ],
    s4d: { 1: 'Ocupa meio metro de parede e cabe num canto da sala, da copa ou do corredor.', 2: 'Menos de 1 metro de parede: cabe na sala, na copa ou na varanda gourmet.', 4: '1,60 m de vitrine para a parede principal da sala de jantar.' }[v],
    stats: [[String(4 * nb), 'nichos com vidro'], ['36 cm', 'entre prateleiras'], [nb > 1 ? '2 × 70' : f(Math.round(fw)) + ' cm', nb > 1 ? 'cm de gaveta' : 'de gaveta'], [`~${Math.round(kg / 5) * 5} kg`, 'madeira maciça']],
    prazo,
  };
  return { t, cut, glass, cav, buy, bgBuy, post, prazo, cost: { mat: matR, matTxt: money(matR), matJatTxt: money(matJ), priceJatTxt: `${money(pjLo)} a ${money(pjHi)}`, price: [pLo, pHi], priceTxt: `${money(pLo)} a ${money(pHi)}`, hours }, board: boardM, ripa: ripaM, sarr: sarrM };
}
