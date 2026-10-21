// Linha Modern: textos, lista de corte, ligações, montagem, compras e custo de cada peça
export function info(M) {
  const k = M.key, f = n => String(Math.round(n * 10) / 10).replace('.', ','), money = n => n.toLocaleString('pt-BR');
  const { L, D, H, PARTS, SCREWS, stats } = M;
  const kg = Math.round(stats.kg), kgJ = Math.round(stats.kgWood * 0.95 / 0.62);
  // ---------- material ----------
  const AXI = { x: 0, y: 1, z: 2 };
  let board = 0, sarr = 0;
  PARTS.forEach(p => {
    if (p.m !== 'madeira') return;
    const [a, b, c, d, e, g] = p.b, ext = [d - a, e - b, g - c], gi = AXI[p.grain], len = ext[gi], o = ext.filter((_, i) => i !== gi).sort((x, y) => y - x);
    if (o[1] >= 2.9) sarr += len; else board += len * o[0];
  });
  const boardM = Math.ceil(board / 30 / 100 * 1.25), sarrM = Math.ceil(sarr / 100 * 1.15 * 2) / 2;
  const nScrew = SCREWS.filter(s => s.t !== 'allen').length, nAllen = SCREWS.filter(s => s.t === 'allen').length;
  const cost = {
    cambara: Math.round(boardM * 17.7 / 5) * 5,
    sarr: Math.round(sarrM * 5 / 5) * 5 || 5,
    fix: Math.round((nScrew * 0.2 + nAllen * 2.5 + 20) / 5) * 5,
    comp: k === 'ap' ? 15 : 0,
    acab: { es: 60, mc: 40, ap: 50 }[k], cons: { es: 30, mc: 25, ap: 30 }[k],
    preto: 0,
  };
  const mat = Object.values(cost).reduce((s, x) => s + x, 0), nog = 40;
  const matR = Math.round((mat + nog) / 10) * 10;
  const jatBoard = Math.round(boardM * 38 / 5) * 5, matJ = Math.round((mat - cost.cambara + jatBoard) / 10) * 10;
  const hours = { es: 22, mc: 12, ap: 24 }[k], hoursJ = Math.round(hours * 1.15);
  const span = { es: 300, mc: 200, ap: 300 }[k];
  const calc = (matR + hours * 30) * 1.3; let pLo = Math.round((calc - 50) / 100) * 100, pHi = pLo + span;
  // escrivaninha: mantém o preço que já foi praticado (R$ 1.600 a 1.900 normal, R$ 1.500 de lançamento)
  if (k === 'es') { pLo = 1600; pHi = 1900; }
  const calcJ = (matJ + hoursJ * 30) * 1.3; let pjLo = Math.round((calcJ - 50) / 100) * 100; if (k === 'es') pjLo = Math.max(pjLo, 2000); const pjHi = pjLo + span;
  const prazo = { es: '3 a 4 semanas', mc: '2 a 3 semanas', ap: '3 a 4 semanas' }[k];

  // ---------- lista de corte (d = medida da peça inteira, quando o 3D a divide em partes) ----------
  const cutAll = {
    tampo: { o: 1, n: 'Tampo', obs: k === 'es' ? 'Duas tábuas de 150 × 30 coladas pela borda (corte com 155 e acerte depois). Cantos com raio de 6 cm' : k === 'mc' ? 'Duas tábuas de 30 coladas pela borda. Cantos com raio de 5 cm' : 'Tábua de 30 + 5 coladas. Cantos da frente com raio de 4 cm' },
    engF: { o: 2, n: 'Engrosso da frente', obs: 'Ripa desdobrada, colada embaixo do tampo de ponta a ponta: a borda fica com cara de 4 cm. Os cantos são cortados junto com os do tampo' },
    engFT: { o: 2, n: 'Engrossos da frente e de trás', n1: 'Engrosso', obs: 'Colados embaixo do tampo, de ponta a ponta. Cantos cortados junto com os do tampo' },
    engL: { o: 3, n: 'Engrossos dos lados', n1: 'Engrosso do lado', obs: 'Veio cruzado com o tampo: cola só nos 10 cm da frente, o resto em parafuso com furo oval' },
    perna: { o: 4, n: 'Pernas (painel)', n1: 'Perna', d: { es: '74 × 56 × 2', mc: '36 × 48 × 2', ap: '76 × 31 × 2' }[k], obs: k === 'es' ? '2 tábuas de 74 × 28 coladas por perna (refile 2 de cada tábua de 30). <b>Veio em pé</b>. Recorte de 4 × 2 no canto de cima da frente, onde passa o engrosso' : k === 'mc' ? 'Tábua de 30 + 18 coladas. <b>Veio em pé</b>. A 8 cm de cada ponta do tampo' : 'Tábua de 30 + 1. <b>Veio em pé</b>. Recuada 2 cm na frente e atrás' },
    saia: { o: 5, n: 'Saia traseira', obs: k === 'es' ? 'Uma tábua de 30 inteira, alinhada com o fundo das pernas. Esconde os fios' : 'Fundo do gaveteiro, de perna a perna' },
    prat: { o: 6, n: 'Prateleira', obs: k === 'mc' ? 'Tábua de 30 + 14 coladas, entre as pernas, a 9 cm do chão' : 'Tábua de 27 (refile 3 da de 30), entre as pernas, a 14 cm do chão' },
    pisoG: { o: 7, n: 'Piso das gavetas', obs: 'De perna a perna: as gavetas correm em cima dele. A borda da frente aparece embaixo das gavetas como um filete' },
    div: { o: 8, n: 'Divisória das gavetas', obs: '<b>Veio em pé</b>. A borda da frente aparece entre as duas gavetas' },
    sfPerna: { o: 9, n: 'Sarrafos do topo das pernas', n1: 'Sarrafo do topo da perna', mat: 'Sarrafo', obs: 'Seguram o tampo (allen em bucha) e ficam presos na perna sem cola, com furo oval' },
    sfSaia: { o: 10, n: 'Sarrafos da saia', n1: 'Sarrafo da saia', mat: 'Sarrafo 3 × 3', obs: 'Seguram a saia nas pernas com allen em bucha, por dentro' },
    sfTopoSaia: { o: 11, n: 'Sarrafo do topo da saia', mat: 'Sarrafo 4 × 3', obs: 'Segura o tampo na saia: 4 parafusos 4 × 45 em furo oval' },
    refA: { o: 12, n: k === 'es' ? 'Reforço A (no comprimento)' : 'Reforço', obs: 'Deitado no meio, sobre a emenda das tábuas do tampo. Cola e parafusos 4 × 30 de baixo: o meio não afunda' },
    trB: { o: 13, n: 'Travessa B (2 metades)', n1: 'Travessa B', mat: 'Sarrafo 4 × 3', obs: 'Atravessada no centro, sem cola, furo oval: mantém o tampo plano na largura' },
    sfPrat: { o: 14, n: 'Sarrafos da prateleira', n1: 'Sarrafo da prateleira', mat: 'Sarrafo 3 × 3', obs: 'Na face de dentro das pernas, a prateleira apoia e é parafusada por baixo' },
    guia: { o: 15, n: 'Guias das gavetas', n1: 'Guia da gaveta', mat: 'Sarrafo 4 × 3', obs: 'Na face de dentro das pernas: enchem o espaço até a gaveta. Vela em cima' },
    gF: { o: 16, n: 'Frentes das gavetas', n1: 'Frente da gaveta', d: '52,6 × 13,6 × 2', obs: '<b>Cava:</b> recorte de 14 × 2,6 cm no meio da borda de baixo, com tico-tico; arredonde as bordas do recorte com lixa 80 em volta de um cabo de vassoura. É por ali que o dedo puxa' },
    gL: { o: 17, n: 'Laterais das gavetas', n1: 'Lateral da gaveta', obs: 'Ripa de 1,5. Cola + 2 cavilhas de 6 mm na frente' },
    gT: { o: 18, n: 'Traseiras das gavetas', n1: 'Traseira da gaveta', obs: 'Entre as laterais, 1 cm mais baixa' },
    gFu: { o: 19, n: 'Fundos das gavetas', n1: 'Fundo da gaveta', obs: 'Compensado 6 mm, pregado e colado por baixo' },
  };

  const t = {};
  t.name = M.name;
  t.lead = {
    es: 'Escrivaninha de madeira maciça, do tampo às pernas: tampo largo de 150 × 60 com borda engrossada de 4 cm e cantos arredondados, pernas de painel recuadas e saia traseira que esconde os fios. Nenhum parafuso à vista: desmonta em 4 partes com chave allen. Reforçada por baixo para ficar reta por muitos anos. Agora da linha Modern.',
    mc: 'Mesa de centro de madeira maciça com o mesmo desenho da Escrivaninha Cerne: tampo com borda de 4 cm e cantos arredondados, duas pernas de painel e uma prateleira embaixo para revistas, livros e controles. Zero ferragem: nem dobradiça, nem puxador, nem parafuso à vista.',
    ap: 'Aparador de madeira maciça para hall, sala de jantar ou atrás do sofá: tampo com borda engrossada, pernas de painel e duas gavetas sem puxador, que abrem pela cava recortada na borda de baixo. Fechado, parece uma faixa lisa de madeira. Prateleira baixa entre as pernas.',
  }[k];
  const preto = { es: 'pernas, saia e sarrafos', mc: 'pernas e sarrafos', ap: 'pernas, gaveteiro e sarrafos' }[k];
  t.facts = [
    ['Nome', M.name],
    ['Linha', 'Modern: pernas de painel, borda engrossada, nenhum parafuso nem puxador à vista'],
    ['Madeira', '<b>Nogueira (principal):</b> cambará maciço com tingidor nogueira. <b>Jatobá:</b> madeira de lei, escura por natureza, sem tingidor'],
    ['Detalhes pretos', `Opção com ${preto} em preto fosco e o tampo${k === 'ap' ? ', as frentes das gavetas' : ''}${k !== 'es' ? ' e a prateleira' : ''} em madeira. Mesmo preço`],
    ['Medidas', `${L} cm de largura × ${D} de profundidade × ${H} de altura`],
    ...({
      es: [['Espaço livre', '138 cm entre as pernas e 72 cm do chão até a borda: cabe cadeira de escritório com braço'], ['Fixação', 'Allen M6 em bucha com rosca nas ligações que desmontam (tampo, 2 pernas e saia)']],
      mc: [['Prateleira', `${f(L - 20)} × 44 cm, a 9 cm do chão`], ['Fixação', 'Tampo nas pernas com allen M6 em bucha: as pernas soltam para mudança']],
      ap: [['Gavetas', '2 gavetas de 52 cm de frente, 9 cm de altura útil e 26 de fundo. Abrem pela cava, sem puxador'], ['Prateleira', `${L - 12} × 27 cm, a 14 cm do chão`]],
    }[k]),
    ['Peso', `~${kg} kg na nogueira · ~${kgJ} kg no jatobá`],
    ['Fabricação', `Sob encomenda, em Uberlândia. Prazo sugerido: ${prazo}`],
  ];
  t.priceNote = `<b>Não vai no post:</b> no Instagram aparece como "sob encomenda · valor sob consulta". Conta: (R$ ${money(matR)} de material + ~${hours} h × R$ 30) × 1,3 ≈ R$ ${money(Math.round(calc / 10) * 10)}. <b>Jatobá:</b> ~R$ ${money(matJ)} de material e ~${hoursJ} h → <b>R$ ${money(pjLo)} a ${money(pjHi)}</b>. Detalhes pretos: mesmo preço (pernas e saia podem ser de pinus pintado, mais barato).`;
  t.why = [
    '<b>Madeira maciça de verdade,</b> não MDF. Pode ser lixada e renovada daqui a 20 anos.',
    '<b>Nada à vista:</b> nenhum parafuso, cantoneira ou puxador. Só madeira (e preto, se quiser).',
    '<b>Borda de 4 cm e cantos arredondados:</b> parece um tampo grosso e maciço, mas é leve.',
    { es: '<b>Reta por muitos anos:</b> três vigas por baixo do tampo. Desmonta em 4 partes.', mc: '<b>A mais fácil da linha:</b> e combina com a escrivaninha e o aparador.', ap: '<b>Gaveta com cava:</b> o recorte na madeira faz o papel do puxador, sem nenhuma ferragem.' }[k],
    '<b>Linha Modern:</b> escrivaninha, mesa de centro e aparador com o mesmo desenho.',
  ];
  t.sale = `${M.name} 🌳

${{ es: 'Tampo largo de 1,50 m para trabalhar e estudar, borda de 4 cm e cantos arredondados.', mc: 'Tampo com borda de 4 cm, pernas de painel e prateleira embaixo.', ap: 'Duas gavetas sem puxador, que abrem pela cava, e prateleira embaixo.' }[k]}

• ${L} × ${D} × ${H} cm
• Madeira maciça escura: cambará nogueira ou jatobá
• Opção com detalhes pretos
• Sem parafuso nem puxador à vista
• Feita sob encomenda em Uberlândia

Valor sob consulta: chame no direct ou no WhatsApp 📲`;
  t.care = [
    'Limpe com pano levemente úmido e seque em seguida. Nada de álcool, multiuso ou lustra-móveis com silicone.',
    'Use porta-copos: copo gelado ou molhado parado deixa marca branca.',
    'A cada 2 ou 3 meses, uma camada fina de cera de abelha, lustrada com pano seco.',
    'Na versão com detalhes pretos, limpe o preto só com pano seco ou levemente úmido.',
    'Riscos saem com lixa fina e uma nova demão de óleo: é a vantagem da madeira maciça.',
  ];
  t.check = {
    es: [['Largura', '4 + 2 perna + 138 saia + 2 perna + 4', '150 ✓'], ['Profundidade', '2 recuo + 56 perna + 2 recuo', '60 ✓'], ['Altura', '74 perna + 2 tampo', '76 ✓'], ['Vão livre', '76 − 2 tampo − 2 engrosso', '72 ✓'], ['Perna × engrosso', 'perna começa a 2 cm da borda; engrosso ocupa 6: recorte de 4 × 2', '2 + 4 = 6 ✓']],
    mc: [['Largura', '8 + 2 perna + 80 prateleira + 2 perna + 8', '100 ✓'], ['Profundidade', '6 recuo + 48 perna + 6 recuo', '60 ✓'], ['Altura', '36 perna + 2 engrosso + 2 tampo', '40 ✓'], ['Prateleira', '9 cm do chão; 25 livres até o engrosso', 'revistas e livros ✓']],
    ap: [['Largura', '4 + 2 perna + 52,6 gaveta + 2 divisória + 52,6 gaveta + 2 perna + 4 (com folgas)', '120 ✓'], ['Profundidade', '2 recuo + 31 perna + 2 recuo', '35 ✓'], ['Altura', '76 perna + 2 tampo', '80 ✓'], ['Gavetas', '62,2 → 75,8 frente; cava de 14 × 2,6 na borda de baixo', '13,6 ✓'], ['Prateleira', '14 → 16 cm; 44 livres até o piso das gavetas', '✓']],
  }[k];
  t.joints = [
    ['Tábuas do tampo e das pernas (borda com borda)', 'sim', 'Titebond III, alicates a cada 25 cm e sarrafos atravessados para não embarrigar. Anéis alternados'],
    ['Engrosso da frente → tampo', 'sim', 'Cola em toda a ripa (mesmo sentido do veio) e parafusos 4 × 30 de baixo'],
    ['Engrossos dos lados → tampo', 'parte', 'Veio cruzado: cola só nos 10 cm da frente, o resto em parafuso 4 × 30 com furo oval'],
    ['Sarrafo do topo → perna', 'não', 'Veio cruzado, sem cola: parafusos 4 × 35 de dentro para fora com rebaixo; o do meio em furo redondo, os das pontas em furo oval'],
    ['Tampo → sarrafos das pernas', 'não', 'Allen M6 × 40 de baixo para cima, em bucha com rosca M6 cravada no tampo, com arruela: o do meio em furo redondo, os das pontas em furo oval. É o que solta a perna'],
    ...({
      es: [['Sarrafo da saia → perna', 'sim', 'Os dois com veio em pé: cola e 3 parafusos 4 × 35'], ['Saia → sarrafos da saia', 'não', '3 allen M6 × 40 de cada lado, de dentro para fora, em bucha cravada na saia'], ['Reforço A → tampo', 'sim', 'Cola e 6 parafusos 4 × 30'], ['Travessa B → tampo', 'não', '2 parafusos 4 × 45 em cada metade, furo oval'], ['Tampo → sarrafo da saia', 'não', '4 parafusos 4 × 45, furo oval']],
      mc: [['Reforço → tampo', 'sim', 'Cola e 4 parafusos 4 × 30'], ['Sarrafos da prateleira → pernas', 'não', 'Parafusos 4 × 35 com furo oval, como os de cima'], ['Prateleira → sarrafos', 'não', 'Parafusos 4 × 30 de baixo para cima, furo oval nos de trás']],
      ap: [['Gaveteiro (piso, saia e divisória)', 'parte', 'Piso preso nas pernas por baixo com allen; saia com allen em bucha nas pernas; divisória com 2 parafusos 4 × 40 pelo piso e 1 cavilha seca no tampo'], ['Guias → pernas', 'não', 'Parafusos 4 × 35 com furo oval. Vela em cima para a gaveta correr'], ['Gavetas', 'sim', 'Laterais na frente com cola e cavilha de 6 mm, traseira com parafuso 4 × 30, fundo pregado'], ['Prateleira', 'não', 'Sobre os sarrafos, parafusada por baixo']],
    }[k]),
  ];
  t.steps = [
    '<b>Deixe a madeira 1 a 2 semanas dentro de casa</b>, deitada com tabiques. Para o tampo, use tábuas secas em estufa e retas.',
    '<b>Cole os painéis:</b> tampo e pernas (e prateleira, piso). Anéis alternados. Espere 24 h.',
    '<b>Acerte as medidas</b> no esquadro e <b>lixe tudo antes de montar</b> (80 → 120 → 180).',
    '<b>Engrossos:</b> o da frente com cola em toda a ripa; os dos lados só com cola nos 10 cm da frente.',
    `<b>Arredonde os cantos do tampo</b> junto com os engrossos (risque com uma tampa e corte no tico-tico, por fora da linha; acerte com lixa 80). Quebre as quinas com lixa.`,
    ...({ es: ['<b>Reforço A, travessa B e sarrafos</b> embaixo do tampo.', '<b>Pernas:</b> recorte 4 × 2, sarrafos do topo e da saia; crave as buchas M6.', '<b>Monte de ponta-cabeça:</b> tampo deitado sobre um cobertor, pernas e saia com os allen.'],
      mc: ['<b>Reforço</b> embaixo do tampo e <b>sarrafos</b> nas pernas (de cima e da prateleira).', '<b>Monte de ponta-cabeça:</b> pernas no tampo com os allen, depois a prateleira.'],
      ap: ['<b>Sarrafos, guias e buchas</b> nas pernas; <b>divisória</b> no piso das gavetas.', '<b>Monte de ponta-cabeça:</b> tampo, pernas, piso e saia do gaveteiro, depois a prateleira.', '<b>Gavetas:</b> monte as caixas, recorte as cavas nas frentes e ajuste até correr leve, com 2 mm de folga.'] }[k]),
    '<b>Acabamento:</b> nogueira = tingidor + 3 demãos finas de óleo de linhaça + cera; jatobá = só óleo e cera. <b>Detalhes pretos:</b> tinta preta fosca à base d\'água (2 demãos, lixa 320 entre elas) nas peças pretas, antes de montar. Mesmo número de demãos em cima e embaixo do tampo.',
  ];
  t.buy = [
    [`~${boardM} m de cambará`, `tábua de 30 × 2 · ~R$ ${cost.cambara} (versão nogueira). Na opção detalhes pretos, pernas${k === 'es' ? ' e saia' : ''} podem ser de pinus`],
    [`ou ~${boardM} m de jatobá`, `para a versão jatobá · ~R$ ${jatBoard} no lugar do cambará`],
    ['Sarrafos', `~${f(sarrM)} m de sarrafo 3 × 3 e 4 × 3 (pinus serve) · ~R$ ${cost.sarr}`],
    ['Fixação', `${nScrew} parafusos de madeira (4 × 30 a 4 × 45) + ${nAllen} allen M6 × 40 com buchas com rosca e arruelas · ~R$ ${cost.fix}`],
    ...(k === 'ap' ? [['Compensado 6 mm', 'fundos das 2 gavetas · ~R$ 15']] : []),
    ['Acabamento', `óleo de linhaça e cera (~R$ ${cost.acab}); nogueira: + tingidor (~R$ ${nog}); detalhes pretos: + tinta preta fosca 900 ml (~R$ 45)`],
    ['Consumo', `lixas 80, 120, 180, 220 e 320 · ~R$ ${cost.cons}. 4 feltros para os pés`],
  ];
  return { t, cut: cutAll, kg, kgJ, prazo, cost: { matTxt: money(matR), matJatTxt: money(matJ), priceTxt: `${money(pLo)} a ${money(pHi)}`, priceJatTxt: `${money(pjLo)} a ${money(pjHi)}`, hours }, nScrew, nAllen };
}
