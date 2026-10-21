// Linha Raiz: textos, lista de corte, ligações, montagem, compras e custo de cada peça
export function info(M) {
  const k = M.key, f = n => String(Math.round(n * 10) / 10).replace('.', ','), money = n => n.toLocaleString('pt-BR');
  const { L, D, H, PARTS, SCREWS, stats } = M;
  const kg = Math.round(stats.kg), kgJ = Math.round(stats.kgWood * 0.95 / 0.62);
  // ---------- material: volume de madeira + 30% de perda, preço por m³ (cambará ~R$ 3.000, jatobá ~R$ 6.500) ----------
  let vol = 0;
  PARTS.forEach(p => { if (p.m !== 'madeira' || p.peg) return; const [a, b, c, d, e, g] = p.b; vol += (d - a) * (e - b) * (g - c) * (p.cyl ? 0.785 : 1); });
  const m3 = vol / 1e6 * 1.3;
  const nScrew = SCREWS.filter(s => /^m\d/.test(s.t)).length, nAllen = SCREWS.filter(s => s.t === 'allen').length;
  const nPeg = PARTS.filter(p => p.u === 'cavilha').length, nGrav = PARTS.filter(p => p.u === 'gravata').length;
  const cost = {
    cambara: Math.round(m3 * 3000 / 10) * 10,
    contraste: 15,
    fix: Math.round((nScrew * 0.25 + nAllen * 2.5 + 20) / 5) * 5,
    comp: k === 'bg' ? 15 : 0,
    acab: { mj: 90, bc: 45, bg: 70 }[k], cons: { mj: 50, bc: 30, bg: 40 }[k],
  };
  const mat = Object.values(cost).reduce((s, x) => s + x, 0), nog = { mj: 50, bc: 30, bg: 40 }[k];
  const matR = Math.round((mat + nog) / 10) * 10;
  const jatWood = Math.round(m3 * 6500 / 10) * 10, matJ = Math.round((mat - cost.cambara + jatWood) / 10) * 10;
  const hours = { mj: 40, bc: 18, bg: 34 }[k], hoursJ = Math.round(hours * 1.15);
  const span = { mj: 400, bc: 200, bg: 300 }[k];
  const calc = (matR + hours * 30) * 1.3, pLo = Math.round((calc - 50) / 100) * 100, pHi = pLo + span;
  const calcJ = (matJ + hoursJ * 30) * 1.3, pjLo = Math.round((calcJ - 50) / 100) * 100, pjHi = pjLo + span;
  const prazo = { mj: '4 a 5 semanas', bc: '2 a 3 semanas', bg: '3 a 4 semanas' }[k];
  const T = M.TR || { zC: 0, zF: 0, yC: [0, 0], yS: [0, 0], zS: [0, 0], t: 0, out: 0, wedge: [0, 0] };

  // ---------- lista de corte (d = medida da peça inteira, quando o 3D a divide em partes) ----------
  const cutAll = {
    tabua: { o: 1, n: 'Tábuas do tampo', n1: 'Tábua do tampo', mat: 'Prancha de 5', obs: `Prancha de ${k === 'bc' ? '20' : '30'} × 5 (ou duas de 2,5 coladas). Corte com 5 cm a mais e acerte depois de colado. Cantos de fora com raio de 1,5 cm e quinas quebradas com lixa` },
    gravata: { o: 2, n: 'Gravatas-borboleta', n1: 'Gravata-borboleta', mat: 'Cambará claro', d: k === 'mj' ? '11 × 5,5 × 0,6' : k === 'bc' ? '9 × 4,6 × 0,6' : '10 × 5 × 0,6', obs: 'Em cambará sem tingidor. Risque em volta da gravata, rebaixe 6 mm com tupia ou formão e cole por cima da emenda. Lixe rente depois de seca' },
    pe: { o: 3, n: 'Pés do cavalete', n1: 'Pé do cavalete', mat: 'Prancha de 5', d: k === 'mj' ? '80 × 9 × 8' : '29 × 7 × 6', obs: `Duas pranchas coladas. Furo (mortise) de ${k === 'mj' ? '16 × 4,5' : '12 × 3,5'} cm no meio, 5 cm de fundo, para o espigão da coluna` },
    calco: { o: 4, n: 'Calços do pé', n1: 'Calço do pé', obs: 'Colados embaixo das pontas do pé: o meio fica no ar e a mesa não balança em piso torto' },
    coluna: { o: 5, n: 'Colunas', n1: 'Coluna', mat: 'Prancha de 5', d: k === 'mj' ? `${f(T.zC - T.zF + 10)} × ${T.yC[1] - T.yC[0]} × 9` : `${f(T.zC - T.zF + 8)} × ${T.yC[1] - T.yC[0]} × 7`, obs: `<b>Veio em pé.</b> Duas pranchas coladas, aplainadas para ${T.t} de grosso. Espigão de ${k === 'mj' ? 5 : 4} cm em cada ponta (já incluído na medida). Furo passante de ${T.yS[1] - T.yS[0]} × ${T.zS[1] - T.zS[0]} para a longarina` },
    trCima: { o: 6, n: 'Travessas de cima', n1: 'Travessa de cima', mat: 'Prancha de 5', obs: 'Seguram o tampo com 3 allen. Furo para o espigão da coluna no meio. Pontas chanfradas por baixo' },
    longarina: { o: 7, n: 'Longarina', mat: 'Prancha de 5', obs: `Passa pelas duas colunas e sobra ${T.out} cm para fora de cada uma. Na sobra, furo vertical de ${f(T.wedge[0])} cm para a cunha, a 2 mm para dentro da face da coluna (é o que aperta)` },
    cunha: { o: 8, n: 'Cunhas', n1: 'Cunha', mat: 'Cambará claro', obs: 'Em cambará sem tingidor, afinando 1:8. Entra a martelo e aperta o cavalete na longarina. Tira a cunha e a mesa desmonta' },
    cavilha: { o: 9, n: 'Cavilhas aparentes', n1: 'Cavilha', mat: 'Cambará claro', d: k === 'mj' ? 'Ø 1,6 × 10' : k === 'bc' ? 'Ø 1,4 × 8' : 'Ø 1,6 × 7', obs: 'Vareta de cambará claro (ou cabo de vassoura torneado). Atravessam o encaixe e travam o espigão. Cola, martelo e corte rente deixando 2 mm' },
    perna: { o: 3, n: 'Pernas', n1: 'Perna', mat: 'Prancha de 5', d: '85 × 7 × 7', obs: 'Duas pranchas de 5 × 7 coladas e aplainadas para 7 × 7 (ou caibro de cambará). Furos (mortises) para as saias e as travessas de baixo' },
    saiaF: { o: 4, n: 'Saias da frente', n1: 'Saia da frente', obs: 'Das pernas até a abertura da gaveta. Espigão de 3 cm na ponta da perna' },
    regua: { o: 5, n: 'Régua embaixo da gaveta', obs: 'Fecha a abertura por baixo. Colada nas duas saias da frente' },
    saiaL: { o: 6, n: 'Saias dos lados', n1: 'Saia do lado', d: '37 × 14 × 2,5', obs: 'Com espigão de 3,5 cm em cada ponta. A da esquerda leva os 3 ganchos' },
    saiaT: { o: 7, n: 'Saia do fundo', d: '107 × 14 × 2,5', obs: 'Com espigão de 3,5 cm em cada ponta' },
    guia: { o: 8, n: 'Guias da gaveta', n1: 'Guia da gaveta', mat: 'Sarrafo 3,5 × 2', obs: 'Da saia da frente à do fundo, dos dois lados da gaveta. Vela em cima' },
    trPrat: { o: 9, n: 'Travessas da prateleira', n1: 'Travessa da prateleira', d: '107 × 5 × 4', obs: 'Frente e fundo, a 14 cm do chão, com espigão nas pernas. As ripas apoiam em cima' },
    trLado: { o: 10, n: 'Travessas dos lados', n1: 'Travessa do lado', d: '37 × 5 × 4', obs: 'Com espigão nas pernas' },
    ripa: { o: 11, n: 'Ripas da prateleira', n1: 'Ripa', obs: 'Ripas de 7 com 2,7 cm de vão, aparafusadas por cima nas travessas (parafuso escondido com tampa de madeira)' },
    toalheiro: { o: 12, n: 'Toalheiro', mat: 'Cabo de madeira Ø 2,5', d: 'Ø 2,5 × 37', obs: 'Entra 3,5 cm em cada perna do lado direito, com cola' },
    gancho: { o: 13, n: 'Ganchos', n1: 'Gancho', mat: 'Cambará claro', d: 'Ø 1,8 × 9', obs: 'Cavilha grossa entrando 2 cm na saia do lado esquerdo, inclinada 10° para cima. Para pano, avental e pegador' },
    gF: { o: 14, n: 'Frente da gaveta', obs: 'Folga de 3 mm em volta. Furo de 8 mm no meio para o puxador' },
    puxador: { o: 15, n: 'Puxador torneado', mat: 'Cambará claro', d: 'Ø 3 × 2,8', obs: 'Em cambará claro, com espiga de 8 mm colada na frente' },
    gL: { o: 16, n: 'Laterais da gaveta', n1: 'Lateral da gaveta', obs: 'Ripa de 1,5. Cola + 2 cavilhas de 6 mm na frente' },
    gT: { o: 17, n: 'Traseira da gaveta', obs: 'Entre as laterais, 0,5 cm mais baixa' },
    gFu: { o: 18, n: 'Fundo da gaveta', obs: 'Compensado 6 mm, pregado e colado por baixo' },
  };

  const t = {};
  t.name = M.name;
  t.lead = {
    mj: 'Mesa de jantar de madeira maciça para 6 lugares: tampo de 5 cm de três pranchas coladas, com gravatas-borboleta em cambará claro nas emendas, e dois cavaletes ligados por uma longarina presa com cunha passante. Os encaixes ficam à mostra como detalhe: cavilhas claras no pé e na travessa. Tira as cunhas e desmonta para a mudança.',
    bc: 'Banco de madeira maciça que faz par com a Mesa de Jantar Raiz: assento de 5 cm de duas pranchas coladas, com gravatas-borboleta na emenda, e os mesmos cavaletes com cunha passante e cavilhas claras. Senta três adultos de um lado da mesa.',
    bg: 'Bancada de madeira maciça para área gourmet, varanda ou cozinha: tampo de 5 cm para apoiar a tábua e a travessa, gaveta de talheres com puxador torneado, prateleira de ripas embaixo, três ganchos para pano e avental de um lado e toalheiro do outro. Pernas de 7 × 7 encaixadas nas saias com cavilhas aparentes.',
  }[k];
  t.facts = [
    ['Nome', M.name],
    ['Linha', 'Raiz: tampo grosso de 5 cm e encaixes à mostra, com cavilhas, cunhas e gravatas em cambará claro'],
    ['Madeira', '<b>Nogueira (principal):</b> cambará maciço com tingidor nogueira. <b>Jatobá:</b> madeira de lei, escura por natureza, sem tingidor'],
    ['Detalhes claros', `${k === 'bg' ? 'Cavilhas, ganchos, puxador e gravatas' : 'Cavilhas, cunhas e gravatas-borboleta'} em cambará natural, sem tingidor. Opção "discreta": tudo na mesma madeira do móvel. Mesmo preço`],
    ['Medidas', `${L} cm de comprimento × ${D} de profundidade × ${H} de altura`],
    ...({
      mj: [['Lugares', '6 com folga (2 de cada lado e 1 em cada ponta); com o Banco Raiz no lugar de 2 cadeiras, 7'], ['Espaço livre', `${M.XS ? M.XS[1] - M.XS[0] - T.t : 0} cm entre os cavaletes e 71 cm do chão até o tampo. A longarina fica a 30 cm do chão, longe dos joelhos`], ['Desmontagem', 'Tire as 2 cunhas e os 6 allen do tampo: sai em 4 partes (tampo, 2 cavaletes e longarina)']],
      bc: [['Lugares', '3 adultos'], ['Altura', '45 cm: a altura certa para a mesa de 76'], ['Desmontagem', 'Tire as 2 cunhas e os 6 allen do assento']],
      bg: [['Gaveta', '43 cm de largura útil, 9 de altura e 35 de fundo: talheres, pegadores e facas'], ['Prateleira', 'Ripas a 21 cm do chão, 50 cm livres até a saia: panelas, carvão, cestos'], ['Ganchos e toalheiro', '3 ganchos de cavilha no lado esquerdo e toalheiro de 30 cm no direito'], ['Opção', 'Rodízios com trava nas 4 pernas (+ R$ 120): a bancada vira carrinho']],
    }[k]),
    ['Peso', `~${kg} kg na nogueira · ~${kgJ} kg no jatobá`],
    ['Fabricação', `Sob encomenda, em Uberlândia. Prazo sugerido: ${prazo}`],
  ];
  t.priceNote = `<b>Não vai no post:</b> no Instagram aparece como "sob encomenda · valor sob consulta". Conta: (R$ ${money(matR)} de material + ~${hours} h × R$ 30) × 1,3 ≈ R$ ${money(Math.round(calc / 10) * 10)}. <b>Jatobá:</b> ~R$ ${money(matJ)} de material e ~${hoursJ} h → <b>R$ ${money(pjLo)} a ${money(pjHi)}</b>. Detalhes claros ou discretos: mesmo preço.${k === 'mj' ? ' <b>Conjunto mesa + banco:</b> ofereça 5% de desconto.' : ''}`;
  t.why = [
    '<b>Madeira maciça de verdade,</b> e grossa: tampo de 5 cm, que não empena nem afunda.',
    '<b>O encaixe é o enfeite:</b> cavilhas, cunhas e gravatas em cambará claro mostram como a peça foi feita.',
    { mj: '<b>Desmonta sem ferramenta:</b> tira as cunhas a martelo e a mesa sai em 4 partes.', bc: '<b>Par da mesa:</b> mesmo cavalete, mesma cunha, mesma gravata.', bg: '<b>Pensada para o churrasco:</b> tampo grosso, gaveta, ganchos, toalheiro e prateleira de ripas, que deixa o ar passar.' }[k],
    '<b>Dura gerações:</b> riscou, lixa e passa óleo. Fica mais bonita com o uso.',
    '<b>Linha Raiz:</b> mesa de jantar, banco e bancada gourmet com o mesmo desenho.',
  ];
  t.sale = `${M.name} 🌳

${{ mj: 'Tampo de 5 cm com gravatas-borboleta nas emendas e cavaletes presos com cunha.', bc: 'O par da Mesa de Jantar Raiz: assento de 5 cm e os mesmos cavaletes com cunha.', bg: 'Tampo de 5 cm, gaveta, ganchos, toalheiro e prateleira de ripas.' }[k]}

• ${L} × ${D} × ${H} cm
• Madeira maciça escura: cambará nogueira ou jatobá
• Cavilhas e gravatas em cambará claro (ou discretas)
• Encaixes à mostra, feitos à mão
• Feita sob encomenda em Uberlândia

Valor sob consulta: chame no direct ou no WhatsApp 📲`;
  t.care = [
    'Limpe com pano levemente úmido e seque em seguida. Nada de álcool, multiuso ou lustra-móveis com silicone.',
    k === 'bg' ? 'Use tábua para cortar e descanso para panela quente: o tampo aguenta, mas marca.' : 'Use descanso para panela quente e porta-copos: copo gelado parado deixa marca branca.',
    'A cada 2 ou 3 meses, uma camada fina de cera de abelha, lustrada com pano seco. Na área externa, 1 demão de óleo por ano.',
    k === 'bc' ? 'Se o banco ficar bambo depois de muitos anos, bata as cunhas mais um pouco: ele aperta de novo.' : k === 'mj' ? 'Se a mesa ficar bamba depois de muitos anos, bata as cunhas mais um pouco: ela aperta de novo.' : 'Não deixe na chuva nem no sol direto o dia todo: varanda coberta é o lugar dela.',
    'Riscos saem com lixa fina e uma nova demão de óleo: é a vantagem da madeira maciça.',
  ];
  t.check = {
    mj: [['Comprimento', '30 até o meio do cavalete + 120 + 30', '180 ✓'], ['Profundidade', '5 + 80 pé + 5', '90 ✓'], ['Altura', '1,5 calço + 8 pé + 53,5 coluna + 8 travessa + 5 tampo', '76 ✓'], ['Joelhos', 'longarina de 30 a 40 cm do chão, no meio da largura', 'livre ✓'], ['Cunha', `longarina sobra ${T.out} cm; cunha no meio da sobra`, '✓']],
    bc: [['Comprimento', '25 até o meio do cavalete + 110 + 25', '160 ✓'], ['Profundidade', '3 + 29 pé + 3', '35 ✓'], ['Altura', '1,2 calço + 6 pé + 27,8 coluna + 5 travessa + 5 assento', '45 ✓'], ['Com a mesa', '76 − 45 = 31 cm entre assento e tampo', 'confortável ✓']],
    bg: [['Comprimento', '3 + 7 perna + 100 + 7 perna + 3', '120 ✓'], ['Profundidade', '3 + 7 perna + 30 + 7 perna + 3', '50 ✓'], ['Altura', '85 perna + 5 tampo', '90 ✓'], ['Gaveta', 'abertura de 50 × 12,5; frente de 49,4 × 11,8', '3 mm de folga ✓'], ['Prateleira', 'ripas a 21 cm; 50 cm livres até a saia', '✓']],
  }[k];
  const joints = {
    mj: [['Coluna → pé e coluna → travessa de cima', 'sim', 'Espigão de 5 cm no furo (mortise), cola e 2 cavilhas claras atravessadas. Faça o furo da cavilha no espigão 1 mm mais perto do ombro: ela puxa e fecha a junta'], ['Longarina → colunas', 'não', 'Passa pelo furo das colunas e é apertada pela cunha, sem cola. É o que desmonta'], ['Calços → pé', 'sim', 'Cola e 2 pregos sem cabeça'], ['Tampo → travessas de cima', 'não', '3 allen M6 × 60 por travessa, de baixo para cima, em bucha com rosca no tampo. O do meio em furo redondo, os das pontas em furo oval: o tampo de 90 cm se mexe com a umidade']],
    bc: [['Coluna → pé e coluna → travessa de cima', 'sim', 'Espigão de 4 cm, cola e 2 cavilhas claras atravessadas'], ['Longarina → colunas', 'não', 'Apertada pela cunha, sem cola'], ['Assento → travessas', 'não', '3 allen M6 × 50 por travessa, em bucha; os das pontas em furo oval']],
    bg: [['Saias e travessas → pernas', 'sim', 'Espigão de 3 a 3,5 cm no furo da perna, cola e cavilhas claras atravessadas (2 nas saias, 1 nas travessas de baixo)'], ['Tampo → saias', 'não', 'Parafusos 4,5 × 50 inclinados por dentro das saias, em furo oval (8 no comprido, 4 nos lados)'], ['Guias → saias', 'não', 'Parafusos 4 × 40'], ['Ripas → travessas', 'não', 'Parafuso 4 × 30 por cima, escareado e tapado com tampa de madeira'], ['Gaveta', 'sim', 'Laterais na frente com cola e cavilha de 6 mm, traseira com parafuso 4 × 30, fundo pregado']],
  }[k];
  t.joints = [['Pranchas do tampo (borda com borda)', 'sim', 'Titebond III, cavilhas de 10 mm escondidas a cada 30 cm para alinhar, alicates a cada 25 cm. Anéis alternados'], ['Gravatas-borboleta', 'sim', 'Coladas no rebaixo de 6 mm, atravessando a emenda. Decoram e seguram a emenda'], ...joints];
  t.steps = {
    mj: [
      '<b>Compre as pranchas com 2 semanas de antecedência</b> e deixe dentro da oficina, deitadas com tabiques. Prancha grossa precisa de tempo.',
      '<b>Cole o tampo:</b> 3 pranchas de 30 × 5 com cavilhas de 10 mm, anéis alternados. Espere 24 h e aplaine ou lixe com a lixadeira de cinta.',
      '<b>Cole as peças grossas:</b> pés, colunas e travessas de cima (duas pranchas de 5 cada). Espere 24 h e aplaine.',
      '<b>Furos e espigões:</b> marque com gabarito. Furo do pé e da travessa com furadeira de bancada e formão; espigão da coluna com serrote e formão.',
      '<b>Furo da longarina</b> nas colunas e <b>furo da cunha</b> na longarina. Monte a seco e confira o esquadro.',
      '<b>Cole os cavaletes</b> e trave com as cavilhas claras. Corte rente deixando 2 mm e arredonde com lixa.',
      '<b>Gravatas:</b> risque, rebaixe 6 mm com tupia e formão, cole e lixe rente.',
      '<b>Acabamento antes de montar:</b> nogueira = tingidor + 3 demãos de óleo de linhaça + cera; jatobá = só óleo e cera. <b>Nas cavilhas, cunhas e gravatas, não passe tingidor</b>: proteja com fita e passe só óleo. Mesmo número de demãos em cima e embaixo do tampo.',
      '<b>Monte na casa do cliente:</b> cavaletes, longarina, cunhas a martelo e o tampo com os allen.',
    ],
    bc: [
      '<b>Mesmas regras da mesa:</b> pranchas de 5 dentro da oficina por 2 semanas.',
      '<b>Cole o assento</b> (2 pranchas de 17,5) e as peças grossas dos cavaletes. 24 h e aplaine.',
      '<b>Furos, espigões e o furo da longarina</b> com o mesmo gabarito da mesa, em escala menor.',
      '<b>Cole os cavaletes</b> com as cavilhas claras. Faça as cunhas e a gravata.',
      '<b>Acabamento</b> igual ao da mesa (sem tingidor nas peças claras) e monte.',
    ],
    bg: [
      '<b>Pranchas de 5 dentro da oficina</b> por 2 semanas, deitadas com tabiques.',
      '<b>Cole o tampo</b> (2 pranchas de 25 × 5) e as pernas (duas de 5 × 7 cada). 24 h, aplaine e lixe.',
      '<b>Furos nas pernas e espigões</b> nas saias e travessas. Monte a seco.',
      '<b>Cole as laterais</b> (2 pernas + saia + travessa de cada lado) e trave com as cavilhas claras. Depois ligue as laterais com as saias da frente, do fundo e as travessas.',
      '<b>Guias, régua e ripas.</b> Faça os furos dos ganchos (inclinados 10°) e do toalheiro antes de colar o lado.',
      '<b>Gaveta:</b> monte a caixa, ajuste até correr leve com 2 mm de folga e cole o puxador.',
      '<b>Gravatas</b> no tampo e <b>acabamento</b>: nogueira = tingidor + 3 demãos de óleo + cera, sem tingidor nas peças claras. Para área externa coberta, 1 demão a mais de óleo.',
      '<b>Prenda o tampo</b> com os parafusos inclinados em furo oval.',
    ],
  }[k];
  t.buy = [
    [`~${f(m3)} m³ de cambará`, `em pranchas de 30 × 5 (ou tábuas de 2,5 para colar em dobro) · ~R$ ${money(cost.cambara)} (versão nogueira)`],
    [`ou ~${f(m3)} m³ de jatobá`, `para a versão jatobá · ~R$ ${money(jatWood)} no lugar do cambará`],
    ['Cambará claro (contraste)', `${nPeg ? nPeg + ' cavilhas, ' : ''}${k !== 'bg' ? '2 cunhas, ' : '3 ganchos, puxador, '}${nGrav} gravatas: sobra de tábua sem tingidor + 1 m de vareta Ø 16 mm · ~R$ ${cost.contraste}`],
    ['Fixação', `${nAllen ? nAllen + ' allen M6 com buchas com rosca e arruelas + ' : ''}${nScrew ? nScrew + ' parafusos de madeira + ' : ''}cavilhas de 10 mm para o tampo · ~R$ ${cost.fix}`],
    ...(k === 'bg' ? [['Compensado 6 mm', 'fundo da gaveta · ~R$ 15'], ['Cabo de madeira Ø 2,5', 'toalheiro (cabo de vassoura de madeira serve)']] : []),
    ['Acabamento', `óleo de linhaça e cera (~R$ ${cost.acab}); nogueira: + tingidor (~R$ ${nog})`],
    ['Consumo', `lixas 60, 80, 120 e 180 · fita crepe para proteger as peças claras · ~R$ ${cost.cons}. 4 feltros grossos`],
  ];
  return { t, cut: cutAll, kg, kgJ, prazo, cost: { matTxt: money(matR), matJatTxt: money(matJ), priceTxt: `${money(pLo)} a ${money(pHi)}`, priceJatTxt: `${money(pjLo)} a ${money(pjHi)}`, hours }, nScrew, nAllen };
}
