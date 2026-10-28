// Catálogo do site: linhas e peças. Resumo da documentação de cada peça, sem preço (valor sob consulta).
// As medidas de cada versão vêm do próprio modelo 3D (engine.getM), então batem sempre com o projeto.

export const WHATSAPP = '5534999931020';
export const WHATSAPP_TXT = '(34) 9 9993-1020';

export const LINES = [
  {
    id: 'antique', name: 'Antique', kicker: 'Ferragens de época',
    lead: 'Portas almofadadas, vidro e ferragens de ferro preto: dobradiças borboleta e rústicas, tramelas, puxadores concha e argola. Para a sala e o quarto com cara de casa de fazenda antiga.',
    img: 'assets/img/pecas/line-antique.webp', video: 'assets/video/linha-antique.mp4',
    marks: ['Dobradiça borboleta', 'Tramela de ferro', 'Portas almofadadas', 'Pés de 10 cm'],
  },
  {
    id: 'modern', name: 'Modern', kicker: 'Nada à vista',
    lead: 'Linhas retas, pernas de painel e nenhum parafuso, cantoneira ou puxador à vista. As gavetas abrem pela cava recortada na madeira. Opção com detalhes pretos.',
    img: 'assets/img/pecas/line-modern.webp', video: 'assets/video/linha-modern.mp4',
    marks: ['Pernas de painel', 'Borda de 4 cm', 'Gaveta com cava', 'Opção preta'],
  },
  {
    id: 'raiz', name: 'Raiz', kicker: 'O encaixe à mostra',
    lead: 'Madeira grossa e encaixes que viram enfeite: tampo de 5 cm, gravatas-borboleta, cunhas e cavilhas em cambará claro sobre a madeira escura. Para a sala de jantar e a área gourmet.',
    img: 'assets/img/pecas/line-raiz.webp', video: 'assets/video/linha-raiz.mp4',
    marks: ['Tampo de 5 cm', 'Gravata-borboleta', 'Cunha passante', 'Cavilhas claras'],
  },
];

// opts: 'open' = portas/gavetas abrem no provador · 'preto' = detalhes pretos · 'contra' = cavilhas claras
export const PRODUCTS = [
  {
    id: 'cr', line: 'antique', name: 'Cristaleira Antique', room: 'Sala de jantar', prazo: '4 a 5 semanas',
    tagline: 'Vidro nos três lados e ferragens de ferro preto.',
    variants: [{ id: 'cr1', label: '1 porta' }, { id: 'cr2', label: '2 portas' }, { id: 'cr4', label: '4 portas' }],
    about: 'Cristaleira de 2 metros com porta de vidro na frente e janelas de vidro nas laterais, para mostrar a louça de todos os lados. Nichos com prateleiras soltas, gaveta embaixo e chapéu com friso.',
    highlights: [['Vidro nos 3 lados', 'Porta e laterais de vidro: a louça aparece de qualquer ângulo'], ['Ferragens de época', 'Dobradiça borboleta, tramela e puxador concha de ferro preto'], ['Prateleiras soltas', 'Mude a altura conforme as peças que vai guardar'], ['Gaveta embaixo', 'Para toalhas de mesa, guardanapos e talheres']],
    imgs: ['assets/img/detalhes/cr-borboleta.webp', 'assets/img/detalhes/cr-tramela.webp', 'assets/img/detalhes/cr-concha.webp'],
    video: 'assets/video/cr.mp4', opts: ['open'],
  },
  {
    id: 'gr', line: 'antique', name: 'Guarda-Roupa Antique', room: 'Quarto', prazo: '6 a 10 semanas',
    tagline: 'Portas almofadadas, sapatas recortadas e gavetas embaixo.',
    variants: [{ id: 'gr2', label: '2 portas' }, { id: 'gr4', label: '4 portas' }],
    about: 'Guarda-roupa de 2 metros com portas almofadadas. Por dentro, cabideiro com maleiro e prateleiras; embaixo, base com sapatas recortadas e gavetas. Cinta entre as portas e chapéu com friso.',
    highlights: [['Cabideiro e prateleiras', 'Varão com maleiro de um lado, prateleiras do outro'], ['Gavetas embaixo', 'Uma larga e duas pequenas em cada vão'], ['Ferragens de ferro', 'Dobradiças rústicas e puxadores argola'], ['58 cm de fundo', 'O cabide cabe de frente, sem amassar a roupa']],
    imgs: ['assets/img/detalhes/gr-dobradica.webp', 'assets/img/detalhes/gr-argola.webp'],
    video: 'assets/video/gr.mp4', opts: ['open'],
  },
  {
    id: 'bf', line: 'antique', name: 'Buffet Antique', room: 'Sala de jantar', prazo: '3 a 5 semanas',
    tagline: 'Gavetas em cima, armários embaixo e topo de aparador.',
    variants: [{ id: 'bf150', label: '3 portas' }, { id: 'bf110', label: '2 portas' }],
    about: 'Buffet para a sala de jantar: gavetas para talheres e toalhas, armários com prateleira para a louça e o topo como aparador na hora de servir. Faz par com a Cristaleira Antique.',
    highlights: [['Gavetas e armários', 'Talheres em cima, travessas e louça embaixo'], ['Ferragens de época', 'Dobradiça rústica, argola e puxador concha'], ['45 cm de fundo', 'Cabe travessa grande e prato de servir'], ['Topo de aparador', 'Beiral de 3 cm na frente e nos lados']],
    imgs: ['assets/img/detalhes/bf-detalhe.webp', 'assets/img/detalhes/bf-aberta.webp'],
    video: 'assets/video/bf.mp4', opts: ['open'],
  },
  {
    id: 'rk', line: 'antique', name: 'Rack Antique', room: 'Sala de TV', prazo: '3 a 4 semanas',
    tagline: 'Nicho para os aparelhos, gaveta para os controles.',
    variants: [{ id: 'rk180', label: '180 cm · TV até 75"' }, { id: 'rk140', label: '140 cm · TV até 55"' }],
    about: 'Rack de sala com duas portas almofadadas e, no meio, nicho aberto para receptor e videogame, com gaveta rasa para os controles. Furo para os fios no fundo e pés altos para limpar embaixo.',
    highlights: [['Nicho e gaveta', 'Aparelhos no meio, controles à mão'], ['Furo para os fios', 'Atrás do nicho, com prateleira solta'], ['Ferragens de época', 'Dobradiça borboleta, tramela e puxador concha'], ['Pés de 10 cm', 'Dá para limpar embaixo']],
    imgs: ['assets/img/detalhes/rk-detalhe.webp', 'assets/img/detalhes/rk-aberta.webp', 'assets/img/detalhes/rk-tramela.webp'],
    video: 'assets/video/rk.mp4', opts: ['open'],
  },
  {
    id: 'es', line: 'modern', name: 'Escrivaninha Cerne', room: 'Escritório', prazo: '3 a 4 semanas',
    tagline: 'Tampo de 1,50 m e nenhum parafuso à vista.',
    variants: [{ id: 'es', label: '150 × 60' }],
    about: 'Escrivaninha com tampo largo para trabalhar e estudar, borda de 4 cm e cantos arredondados. A saia traseira esconde os fios e ela desmonta em 4 partes com uma chave allen.',
    highlights: [['Tampo de 1,50 m', 'Monitor, notebook e caderno lado a lado'], ['Nada à vista', 'Nenhum parafuso nem cantoneira aparente'], ['Saia traseira', 'Esconde os fios; 138 cm livres entre as pernas'], ['Desmonta', 'Em 4 partes, para a mudança']],
    imgs: ['assets/img/detalhes/es-detalhe.webp', 'assets/img/detalhes/es-borda.webp', 'assets/img/detalhes/es-preto.webp'],
    video: 'assets/video/es.mp4', opts: ['preto'],
  },
  {
    id: 'mc', line: 'modern', name: 'Mesa de Centro Modern', room: 'Sala', prazo: '2 a 3 semanas',
    tagline: 'Prateleira embaixo e zero ferragem.',
    variants: [{ id: 'mc', label: '100 × 60' }],
    about: 'Mesa de centro com o mesmo desenho da Escrivaninha Cerne: tampo com borda de 4 cm, duas pernas de painel e prateleira embaixo para revistas, livros e controles.',
    highlights: [['Prateleira embaixo', 'Revistas, livros e controles'], ['Zero ferragem', 'Nem dobradiça, nem puxador, nem parafuso à vista'], ['Na altura do sofá', '40 cm do chão ao tampo'], ['Cantos arredondados', 'Borda de 4 cm, sem quina viva']],
    imgs: ['assets/img/detalhes/mc-detalhe.webp', 'assets/img/detalhes/mc-perna.webp'],
    video: 'assets/video/mc.mp4', opts: ['preto'],
  },
  {
    id: 'ap', line: 'modern', name: 'Aparador Modern', room: 'Hall', prazo: '3 a 4 semanas',
    tagline: 'Duas gavetas sem puxador, que abrem pela cava.',
    variants: [{ id: 'ap', label: '120 × 35' }],
    about: 'Aparador para o hall, a sala de jantar ou atrás do sofá. As gavetas abrem pelo recorte na borda de baixo da frente: fechado, parece uma faixa lisa de madeira. Prateleira baixa entre as pernas.',
    highlights: [['Gaveta com cava', 'O recorte na madeira faz o papel do puxador'], ['Só 35 cm de fundo', 'Cabe no hall e atrás do sofá'], ['Prateleira baixa', 'Para cestos, livros ou sapatos'], ['Nada à vista', 'Nenhuma ferragem aparente']],
    imgs: ['assets/img/detalhes/ap-cava.webp', 'assets/img/detalhes/ap-detalhe.webp'],
    video: 'assets/video/ap.mp4', opts: ['open', 'preto'],
  },
  {
    id: 'pf', line: 'modern', name: 'Prateleira Flutuante Modern', room: 'Sala', prazo: '1 a 2 semanas',
    tagline: 'Sai direto da parede, sem nenhum suporte à vista.',
    variants: [{ id: 'pf60', label: '60 cm' }, { id: 'pf40', label: '40 cm' }, { id: 'pf90', label: '90 cm' }],
    about: 'Prateleira de madeira maciça com 6 cm de espessura, que parece sair direto da parede. Por dentro ela é oca e encaixa num suporte de madeira parafusado na parede, que fica escondido. Avulsa ou em jogo.',
    highlights: [['Suporte escondido', 'Encaixa num pente de madeira preso na parede'], ['6 cm de espessura', 'Cara de bloco maciço, sem ser pesada'], ['20 cm de fundo', 'Livros, plantas e porta-retratos'], ['Até 10 kg', 'Em parede de alvenaria']],
    imgs: ['assets/img/detalhes/pf-encaixe.webp'],
    video: null, opts: [],
  },
  {
    id: 'mj', line: 'raiz', name: 'Mesa de Jantar Raiz', room: 'Sala de jantar', prazo: '4 a 5 semanas',
    tagline: 'Tampo de 5 cm e cavaletes com cunha passante.',
    variants: [{ id: 'mj', label: '180 × 90 · 6 lugares' }],
    about: 'Mesa para 6 lugares com tampo de 5 cm de três pranchas coladas e gravatas-borboleta nas emendas. Os cavaletes são presos por uma longarina com cunha: tira a cunha e a mesa desmonta em 4 partes.',
    highlights: [['Tampo de 5 cm', 'Pranchas maciças: não empena nem afunda'], ['Gravatas-borboleta', 'Em cambará claro, atravessando as emendas'], ['Cunha passante', 'Aperta o cavalete; tira a cunha e desmonta'], ['Cavilhas aparentes', 'Travam o pé e a travessa, à mostra']],
    imgs: ['assets/img/detalhes/mj-gravata.webp', 'assets/img/detalhes/mj-cunha.webp', 'assets/img/detalhes/mj-detalhe.webp'],
    video: 'assets/video/mj.mp4', opts: ['contra'],
  },
  {
    id: 'bc', line: 'raiz', name: 'Banco Raiz', room: 'Sala de jantar', prazo: '2 a 3 semanas',
    tagline: 'O par da mesa: assento de 5 cm e o mesmo cavalete.',
    variants: [{ id: 'bc', label: '160 × 35 · 3 lugares' }],
    about: 'Banco que faz par com a Mesa de Jantar Raiz: assento de duas pranchas com gravatas na emenda e o mesmo cavalete com cunha. Senta três pessoas de um lado da mesa.',
    highlights: [['3 lugares', 'No lugar de duas cadeiras'], ['45 cm de altura', 'A medida certa para a mesa de 76'], ['Mesma cunha', 'O cavalete da mesa, em pequeno'], ['Gravatas claras', 'Na emenda do assento']],
    imgs: ['assets/img/detalhes/bc-detalhe.webp', 'assets/img/detalhes/bc-cavilha.webp'],
    video: 'assets/video/bc.mp4', opts: ['contra'],
  },
  {
    id: 'bg', line: 'raiz', name: 'Bancada Gourmet Raiz', room: 'Área gourmet', prazo: '3 a 4 semanas',
    tagline: 'Gaveta, ganchos, toalheiro e prateleira de ripas.',
    variants: [{ id: 'bg', label: '120 × 50 × 90' }],
    about: 'Bancada para a área gourmet, a varanda coberta ou a cozinha: tampo de 5 cm para a tábua e a travessa, gaveta de talheres com puxador torneado, três ganchos de cavilha, toalheiro e prateleira de ripas. Opção com rodízios.',
    highlights: [['Tampo de 5 cm', 'Aguenta o peso do dia a dia'], ['Gaveta de talheres', 'Puxador torneado em cambará claro'], ['Ganchos e toalheiro', 'Pano e avental sempre à mão'], ['Prateleira de ripas', 'Panelas, carvão e cestos; o ar passa']],
    imgs: ['assets/img/detalhes/bg-gancho.webp', 'assets/img/detalhes/bg-detalhe.webp'],
    video: 'assets/video/bg.mp4', opts: ['open', 'contra'],
  },
];

// madeiras do provador (cores aproximadas: cada tábua tem o seu tom)
export const WOODS = [
  { id: 'nog', name: 'Nogueira', tone: 'escura', note: 'Cambará com tingidor nogueira. Tom de chocolate. A mais pedida.', main: true },
  { id: 'jat', name: 'Jatobá', tone: 'escura', note: 'Madeira de lei, castanho-avermelhado, escurece com o tempo.', main: true },
  { id: 'imb', name: 'Imbuia', tone: 'escura', note: 'Marrom profundo com reflexo esverdeado. Clássica dos móveis antigos.' },
  { id: 'rox', name: 'Roxinho', tone: 'especial', note: 'Arroxeada, muito dura e de cor única. Ótima para detalhes.' },
  { id: 'cum', name: 'Cumaru', tone: 'média', note: 'Dourado escuro, pesado e resistente. Vai bem em área externa coberta.' },
  { id: 'per', name: 'Peroba-rosa', tone: 'média', note: 'Rosada e cheia de história, muitas vezes de demolição.' },
  { id: 'fre', name: 'Freijó', tone: 'média', note: 'Dourado suave, leve e estável.' },
  { id: 'cla', name: 'Cambará natural', tone: 'clara', note: 'O cambará sem tingidor, só com óleo e cera.' },
  { id: 'mar', name: 'Pau-marfim', tone: 'clara', note: 'Quase creme, liso e claro. Moderno e luminoso.' },
];
